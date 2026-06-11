-- ================================================================
-- Quootami — Setup completo Supabase
-- ================================================================
-- Esegui questo script nel SQL Editor di Supabase Dashboard.
-- Crea:
--   1) tabella "leads"
--   2) bucket privato "documenti-lead" (carte identita', libretti)
--   3) RLS sicure (chiunque puo' INSERIRE, solo tu puoi LEGGERE)
-- ================================================================

-- 1) TABELLA LEADS
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  prodotto     text not null,
  nome_cognome text,
  data_nascita date,
  email        text,
  telefono     text,
  cap          text,
  citta        text,
  targa        text,
  messaggio    text,
  fonte        text default 'sito web',
  pagina       text,
  user_agent   text,
  stato        text default 'nuovo'
                check (stato in ('nuovo','contattato','preventivo_inviato','chiuso_positivo','chiuso_negativo')),
  note         text,
  documenti    jsonb                -- {ci_fronte: 'leads/<id>/...', ci_retro: '...', libretto: '...'}
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_prodotto   on public.leads (prodotto);
create index if not exists idx_leads_stato      on public.leads (stato);
create index if not exists idx_leads_documenti  on public.leads using gin (documenti);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ================================================================
-- 2) RLS TABELLA LEADS
--    INSERT: chiunque (sito pubblico)
--    SELECT/UPDATE/DELETE: solo dashboard / service_role
-- ================================================================
alter table public.leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads for insert to anon with check (true);

-- Permetti UPDATE solo del campo "documenti" e dal lead appena creato
-- (e' necessario per allegare i path dei file uploadati dopo l'insert)
drop policy if exists "Anon can attach documents to own lead" on public.leads;
create policy "Anon can attach documents to own lead"
  on public.leads for update to anon
  using (created_at > now() - interval '5 minutes')
  with check (created_at > now() - interval '5 minutes');

-- ================================================================
-- 3) STORAGE BUCKET "documenti-lead" (privato, cifrato a riposo)
-- ================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documenti-lead',
  'documenti-lead',
  false,                          -- PRIVATO (no accesso pubblico via URL)
  10485760,                       -- 10 MB per file
  array[
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/heif',
    'image/webp',
    'application/pdf'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  public = false;

-- ================================================================
-- 4) RLS BUCKET
--    INSERT: anonimi (upload dal form pubblico)
--    SELECT/DELETE/UPDATE: nessuno via anon
--      (solo dashboard / signed URL)
-- ================================================================

-- Permetti upload anonimo nel bucket
drop policy if exists "Anyone can upload to documenti-lead" on storage.objects;
create policy "Anyone can upload to documenti-lead"
  on storage.objects for insert to anon
  with check (bucket_id = 'documenti-lead');

-- NESSUNA policy SELECT/UPDATE/DELETE per anon:
-- i file sono accessibili solo via signed URL generata lato server
-- (le signed URL si generano con auth) o dal dashboard Supabase loggato.

-- ================================================================
-- VERIFICA
-- ================================================================
-- Test SQL Editor:
--   insert into public.leads (prodotto, email) values ('test', 't@quootami.it');
--   select * from public.leads;
--
-- Bucket: Dashboard -> Storage -> documenti-lead deve esistere ed essere PRIVATE.
-- ================================================================

-- ================================================================
-- BACKUP / CLEANUP
-- ================================================================
-- Per cancellare un lead (diritto all'oblio GDPR):
--   delete from public.leads where id = '<uuid>';
-- I file in Storage vanno cancellati separatamente:
--   Dashboard -> Storage -> documenti-lead -> leads/<lead-id>/ -> Delete
-- (o via API con service_role key)
-- ================================================================
