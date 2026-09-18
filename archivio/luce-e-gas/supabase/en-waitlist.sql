-- ============================================================
-- Quootami — lista d'attesa luce e gas
-- Da applicare al progetto Supabase ivcdwizhkdubjxxrukbs (Francoforte)
-- quando il verticale viene riattivato. NON ancora applicato al 07/09/2026.
-- ============================================================
--
-- PERCHÉ QUESTA TABELLA ESISTE
-- Il verticale luce e gas riparte da una lista d'attesa, non dal comparatore:
-- gli accordi con i fornitori sono in negoziazione e un confronto prezzi senza
-- mandati sarebbe finto. Questa tabella raccoglie i contatti nel frattempo.
--
-- IL PUNTO CRITICO: LA PROVA DEL CONSENSO
-- Dall'8 aprile 2026 il teleselling energia è vietato (D.L. 21/2026): quello che
-- si vende a un fornitore non è traffico, è un contatto che ha chiesto di essere
-- contattato E di cui si può dimostrare il consenso. Per questo la tabella
-- registra, oltre al consenso, le condizioni in cui è stato prestato:
--
--   * i tre consensi come booleani DISTINTI, mai uno cumulativo;
--   * IP e user-agent presi LATO SERVER dagli header della richiesta —
--     un IP passato dal client non prova niente, lo scrive il client;
--   * la VERSIONE dei testi di informativa e consenso vigenti all'invio, così
--     fra tre anni si può ricostruire cosa aveva davanti l'interessato
--     (art. 7.1 GDPR).
--
-- Senza questi campi il contatto non è cedibile a un fornitore: il primo che
-- firma chiede come si dimostra il consenso, e "la casella era spuntata" non
-- è una risposta.
-- ============================================================

create table if not exists en.waitlist (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz  not null default now(),

  -- dati della richiesta
  fornitura             text         not null check (fornitura in ('luce', 'gas', 'entrambe')),
  cap                   text         not null check (cap ~ '^[0-9]{5}$'),
  spesa_fascia          text                  check (spesa_fascia in ('<50', '50-100', '100-150', '150-250', '>250', 'non-so')),
  nome                  text         not null check (length(btrim(nome)) between 2 and 80),
  email                 text         not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono              text,

  -- consensi: distinti, mai accorpati
  consenso_contatto     boolean      not null,
  consenso_fornitori    boolean      not null default false,
  consenso_marketing    boolean      not null default false,

  -- prova del consenso
  informativa_versione  text         not null,
  consensi_versione     text         not null,
  ip                    inet,
  user_agent            text,

  -- provenienza
  utm                   jsonb,
  referrer              text,

  -- ciclo di vita
  stato                 text         not null default 'nuovo'
                                     check (stato in ('nuovo', 'contattato', 'inviato_fornitore', 'chiuso', 'revocato')),
  note                  text,

  -- il consenso al contatto è il minimo sindacale: senza, la riga non ha senso
  constraint waitlist_consenso_minimo check (consenso_contatto = true)
);

create index if not exists waitlist_created_at_idx on en.waitlist (created_at desc);
create index if not exists waitlist_fornitori_idx  on en.waitlist (consenso_fornitori) where consenso_fornitori = true;
create unique index if not exists waitlist_email_uniq on en.waitlist (lower(email));

alter table en.waitlist enable row level security;
-- Nessuna policy: la tabella è raggiungibile solo dalla RPC SECURITY DEFINER
-- qui sotto e da service_role. La anon key non legge e non scrive direttamente.

-- ============================================================
-- RPC di inserimento
-- IP e user-agent NON sono parametri: vengono letti dagli header della
-- richiesta lato server, altrimenti la prova la scriverebbe il client.
-- ============================================================
create or replace function en.waitlist_submit(
  p_fornitura            text,
  p_cap                  text,
  p_nome                 text,
  p_email                text,
  p_consenso_contatto    boolean,
  p_consenso_fornitori   boolean,
  p_consenso_marketing   boolean,
  p_informativa_versione text,
  p_consensi_versione    text,
  p_spesa_fascia         text default null,
  p_telefono             text default null,
  p_utm                  jsonb default null,
  p_referrer             text default null
)
returns uuid
language plpgsql
security definer
set search_path = en, public
as $$
declare
  v_id      uuid;
  v_headers json;
  v_ip      text;
  v_ua      text;
begin
  if p_consenso_contatto is not true then
    raise exception 'consenso al contatto mancante';
  end if;

  begin
    v_headers := current_setting('request.headers', true)::json;
    v_ip := split_part(coalesce(v_headers ->> 'x-forwarded-for', ''), ',', 1);
    v_ua := v_headers ->> 'user-agent';
  exception when others then
    v_ip := null;
    v_ua := null;
  end;

  insert into en.waitlist (
    fornitura, cap, spesa_fascia, nome, email, telefono,
    consenso_contatto, consenso_fornitori, consenso_marketing,
    informativa_versione, consensi_versione,
    ip, user_agent, utm, referrer
  ) values (
    p_fornitura, p_cap, p_spesa_fascia, btrim(p_nome), lower(btrim(p_email)), nullif(btrim(coalesce(p_telefono, '')), ''),
    p_consenso_contatto, p_consenso_fornitori, p_consenso_marketing,
    p_informativa_versione, p_consensi_versione,
    nullif(btrim(v_ip), '')::inet, v_ua, p_utm, p_referrer
  )
  on conflict (lower(email)) do update set
    fornitura            = excluded.fornitura,
    cap                  = excluded.cap,
    spesa_fascia         = excluded.spesa_fascia,
    nome                 = excluded.nome,
    telefono             = coalesce(excluded.telefono, en.waitlist.telefono),
    consenso_fornitori   = excluded.consenso_fornitori,
    consenso_marketing   = excluded.consenso_marketing,
    informativa_versione = excluded.informativa_versione,
    consensi_versione    = excluded.consensi_versione,
    ip                   = excluded.ip,
    user_agent           = excluded.user_agent
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function en.waitlist_submit from public;
grant execute on function en.waitlist_submit to anon, authenticated;

-- ============================================================
-- REVOCA DEL CONSENSO
-- La riga non si cancella: si marca revocata e si azzerano i consensi.
-- Serve a dimostrare che la revoca è stata onorata — cancellare la riga
-- cancella anche la prova di averla rispettata.
-- ============================================================
create or replace function en.waitlist_revoca(p_email text)
returns boolean
language plpgsql
security definer
set search_path = en, public
as $$
declare v_n int;
begin
  update en.waitlist set
    consenso_fornitori = false,
    consenso_marketing = false,
    stato              = 'revocato',
    note               = coalesce(note || ' | ', '') || 'revoca ' || now()::date
  where lower(email) = lower(btrim(p_email));
  get diagnostics v_n = row_count;
  return v_n > 0;
end;
$$;

revoke all on function en.waitlist_revoca from public;
grant execute on function en.waitlist_revoca to service_role;
