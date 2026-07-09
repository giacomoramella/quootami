-- =============================================================
-- Quootami — Schema FEA (M4)
-- =============================================================
-- Eseguire su Supabase: Dashboard → SQL Editor → New query → Run.
--
-- Crea:
--   1. tabella public.pratiche  (storico richieste di firma)
--   2. RLS policies (solo service_role può leggere/scrivere)
--   3. due bucket Storage privati:
--        - adesioni-bozze    (PDF compilato pre-firma)
--        - adesioni-firmate  (PDF firmato dal cliente)
--
-- Nota: i bucket Storage NON sono creati via SQL — vanno creati dal
-- pannello Supabase (vedi sezione "BUCKETS" in fondo).
-- =============================================================

-- ─────────── 1. tabella pratiche ───────────
create table if not exists public.pratiche (
  id                    uuid primary key default gen_random_uuid(),

  -- collegamento a OTP Service
  otp_pratica_id        text unique not null,

  -- stato workflow
  stato                 text not null check (stato in ('in_corso','completata','rifiutata','scaduta')),
  mock                  boolean not null default false,

  -- contesto
  prodotto              text not null default 'Allianz Previdenza',
  lead_id               uuid null,  -- se in futuro colleghiamo a public.leads

  -- dati firmatario
  firmatario_nome       text not null,
  firmatario_cognome    text not null,
  firmatario_cf         text not null,
  firmatario_email      text not null,
  firmatario_cellulare  text not null,

  -- artefatti
  file_bozza_path       text null,    -- path nel bucket adesioni-bozze
  file_firmato_path     text null,    -- path nel bucket adesioni-firmate
  codice_verifica       text null,    -- codice di verifica firma di OTP Service

  -- timestamps
  created_at            timestamptz not null default now(),
  completed_at          timestamptz null
);

create index if not exists pratiche_otp_id_idx     on public.pratiche (otp_pratica_id);
create index if not exists pratiche_email_idx      on public.pratiche (firmatario_email);
create index if not exists pratiche_created_idx    on public.pratiche (created_at desc);

-- ─────────── 2. RLS ───────────
-- Solo il service_role (usato dalle API routes server-only) può
-- accedere a questa tabella. Il client anon NON deve mai leggerla.
alter table public.pratiche enable row level security;

-- Drop di eventuali policy precedenti (idempotente)
drop policy if exists "pratiche_no_anon_select" on public.pratiche;
drop policy if exists "pratiche_no_anon_insert" on public.pratiche;
drop policy if exists "pratiche_no_anon_update" on public.pratiche;

-- Nessuna policy = nessun accesso per anon/auth.
-- (service_role bypassa sempre le RLS).

-- ─────────── 3. BUCKETS Storage ───────────
-- Vanno creati DA UI (non via SQL):
--   Supabase Dashboard → Storage → New bucket
--
--   bucket 1:  adesioni-bozze
--     - Privato: ON
--     - File size limit: 15 MB
--     - Allowed MIME types: application/pdf
--
--   bucket 2:  adesioni-firmate
--     - Privato: ON
--     - File size limit: 15 MB
--     - Allowed MIME types: application/pdf
--
-- Le RLS sui bucket si configurano da:
--   Storage → <bucket> → Policies → New policy
--   → "For full customization" → INSERT/SELECT/UPDATE/DELETE = service_role only.
--
-- In alternativa, creando i bucket "Privati" senza altre policy,
-- solo il service_role può accedervi: sufficiente per il nostro use case.
