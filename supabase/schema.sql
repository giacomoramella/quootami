-- ============================================================
-- Quootami — Schema Supabase (riferimento)
-- ============================================================
-- Questo schema è già attivo sul progetto Supabase Quootami.
-- Questo file è qui per riferimento e per setup di nuovi ambienti.
--
-- Da eseguire nel SQL Editor di Supabase Dashboard.
-- ============================================================

-- 1) Tabella leads
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
  documenti    jsonb
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_prodotto   on public.leads (prodotto);
create index if not exists idx_leads_stato      on public.leads (stato);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- 2) RLS — chiunque INSERT, nessuno SELECT/UPDATE/DELETE da anon
alter table public.leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads for insert to anon with check (true);

-- 3) RPC SECURITY DEFINER per bypass RLS in inserimento controllato
-- (usata dal client browser per inserire lead anche con RLS attive)
create or replace function public.insert_lead(payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare new_lead public.leads;
begin
  insert into public.leads (
    prodotto, nome_cognome, data_nascita, email, telefono,
    cap, citta, targa, messaggio, fonte, pagina, user_agent, documenti
  )
  values (
    payload->>'prodotto',
    payload->>'nome_cognome',
    nullif(payload->>'data_nascita','')::date,
    payload->>'email',
    payload->>'telefono',
    payload->>'cap',
    payload->>'citta',
    payload->>'targa',
    payload->>'messaggio',
    coalesce(payload->>'fonte', 'sito web'),
    payload->>'pagina',
    payload->>'user_agent',
    payload->'documenti'
  )
  returning * into new_lead;
  return row_to_json(new_lead)::jsonb;
end; $$;

grant execute on function public.insert_lead(jsonb) to anon, authenticated;

-- 4) Storage bucket "documenti-lead" (privato)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documenti-lead', 'documenti-lead', false, 10485760,
  array['image/jpeg','image/png','image/heic','image/heif','image/webp','application/pdf']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  public = false;

-- Upload anonimo
drop policy if exists "Anyone can upload to documenti-lead" on storage.objects;
create policy "Anyone can upload to documenti-lead"
  on storage.objects for insert to anon
  with check (bucket_id = 'documenti-lead');
