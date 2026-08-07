-- ============================================================================
-- Schema "en" — comparatore luce e gas (progetto "Luce"), versione portata
-- e resa autonoma per il progetto Supabase di Quootami.
--
-- Differenze rispetto allo schema originale "energy" su novacrm-eu:
--   - Nessuna dipendenza dallo schema "crm" (organizations/contacts/deals):
--     qui il lead (nome, email, telefono) viene salvato direttamente sulla
--     riga en.bills, niente pipeline CRM.
--   - Tutte le tabelle/funzioni/RPC hanno prefisso "en" come richiesto.
--   - RLS abilitata su tutte le tabelle: l'accesso passa solo dalle funzioni
--     RPC (SECURITY DEFINER, owner postgres, bypassano RLS) o da service_role.
--
-- Esegui questo file una sola volta su un progetto Supabase nuovo/vuoto
-- (SQL Editor del dashboard, oppure supabase db push da CLI).
-- ============================================================================

create schema if not exists en;

-- ---------------------------------------------------------------------------
-- TABELLE
-- ---------------------------------------------------------------------------

create table en.suppliers (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null unique,
  vat                 text,
  arera_code          text,
  logo_url            text,
  active              boolean not null default true,
  created_at          timestamptz not null default now(),
  gruppo              text,
  tipo                text,
  dual                boolean default true,
  digital_onboarding  boolean default false,
  commission_note     text,
  characteristics     text,
  partner_status      text default 'none' check (partner_status in ('none','target','contacted','negotiating','active','rejected')),
  area                text,
  no_fixed_fee        boolean default false,
  price_level         text,
  phone               text,
  email               text,
  website             text,
  signup_url          text
);

create table en.offers (
  id               uuid primary key default gen_random_uuid(),
  supplier_id      uuid not null references en.suppliers(id),
  arera_offer_code text,
  commodity        text not null check (commodity in ('ele','gas')),
  customer_type    text not null default 'domestic' check (customer_type in ('domestic','business')),
  name             text not null,
  price_type       text not null check (price_type in ('fixed','indexed')),
  index_name       text,
  spread_eur       numeric,
  price_f0         numeric,
  price_f1         numeric,
  price_f2         numeric,
  price_f3         numeric,
  fixed_fee_year   numeric not null default 0,
  green            boolean not null default false,
  duration_months  integer,
  validity_start   date not null default current_date,
  validity_end     date,
  raw              jsonb,
  updated_at       timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

create table en.market_indices (
  name  text primary key,
  value numeric not null,
  unit  text not null,
  as_of date not null default current_date
);

create table en.bills (
  id                       uuid primary key default gen_random_uuid(),
  commodity                text not null check (commodity in ('ele','gas')),
  customer_type            text not null default 'domestic' check (customer_type in ('domestic','business')),
  file_path                text,
  period_start             date,
  period_end               date,
  consumption_total        numeric,
  consumption_f1           numeric,
  consumption_f2           numeric,
  consumption_f3           numeric,
  power_kw                 numeric,
  current_unit_price       numeric,
  current_fixed_fee_year   numeric not null default 0,
  postal_code              text,
  days                     integer generated always as (
                              case when period_start is not null and period_end is not null
                                   then (period_end - period_start) end
                            ) stored,
  annual_consumption       numeric,
  status                   text not null default 'draft' check (status in ('draft','analyzed','proposed','won','lost')),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  current_supplier         text,
  address                  text,
  customer_name            text,
  customer_email           text,
  customer_phone           text,
  pod                      text,
  pdr                      text,
  fiscal_code              text,
  source                   text,
  consent                  boolean not null default false,
  marketing_consent        boolean default false
);

create table en.proposals (
  id                    uuid primary key default gen_random_uuid(),
  bill_id               uuid not null references en.bills(id),
  offer_id              uuid not null references en.offers(id),
  annual_cost_current   numeric not null,
  annual_cost_offer     numeric not null,
  annual_saving         numeric not null,
  rank                  integer not null,
  is_recommended        boolean not null default false,
  batch_id              uuid not null,
  created_at            timestamptz not null default now()
);

create table en.rate_limits (
  bucket      text primary key,
  count       integer not null default 0,
  expires_at  timestamptz not null
);

create table en.email_verifications (
  token        uuid primary key default gen_random_uuid(),
  bill_id      uuid not null references en.bills(id),
  email        text not null,
  verified_at  timestamptz,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- VISTA
-- ---------------------------------------------------------------------------

create view en.proposal_details as
select
  p.id, p.bill_id, p.rank, p.is_recommended,
  p.annual_cost_current, p.annual_cost_offer, p.annual_saving,
  s.name as supplier_name, s.logo_url, s.partner_status, s.website as supplier_website, s.signup_url,
  o.name as offer_name, o.commodity, o.price_type, o.green, o.duration_months,
  o.index_name, o.spread_eur, o.price_f0, o.price_f1, o.price_f2, o.price_f3, o.fixed_fee_year,
  p.batch_id, p.created_at
from en.proposals p
join en.offers o on o.id = p.offer_id
join en.suppliers s on s.id = o.supplier_id;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — accesso solo via funzioni RPC (SECURITY DEFINER) o service_role
-- ---------------------------------------------------------------------------

alter table en.suppliers enable row level security;
alter table en.offers enable row level security;
alter table en.market_indices enable row level security;
alter table en.bills enable row level security;
alter table en.proposals enable row level security;
alter table en.rate_limits enable row level security;
alter table en.email_verifications enable row level security;

-- ---------------------------------------------------------------------------
-- FUNZIONI
-- ---------------------------------------------------------------------------

-- Calcola/ricalcola le proposte per una bolletta (stesso algoritmo di energy.compute_proposals)
create or replace function en.compute_proposals(p_bill_id uuid, p_min_saving numeric default 30)
returns uuid
language plpgsql
set search_path to 'en', 'public'
as $function$
declare
  b          en.bills%rowtype;
  v_factor   numeric;
  ann_tot    numeric;
  ann_f1     numeric;
  ann_f2     numeric;
  ann_f3     numeric;
  cur_cost   numeric;
  v_batch    uuid := gen_random_uuid();
  has_fasce  boolean;
begin
  select * into b from en.bills where id = p_bill_id;
  if not found then raise exception 'Bolletta % non trovata', p_bill_id; end if;
  if b.consumption_total is null or b.current_unit_price is null then
    raise exception 'Dati bolletta incompleti: consumo e prezzo unitario attuale sono obbligatori';
  end if;

  v_factor := case when b.days is not null and b.days > 0 then 365.0 / b.days else 1 end;
  ann_tot  := round(b.consumption_total * v_factor, 2);
  ann_f1   := round(coalesce(b.consumption_f1,0) * v_factor, 2);
  ann_f2   := round(coalesce(b.consumption_f2,0) * v_factor, 2);
  ann_f3   := round(coalesce(b.consumption_f3,0) * v_factor, 2);
  has_fasce := (coalesce(b.consumption_f1,0)+coalesce(b.consumption_f2,0)+coalesce(b.consumption_f3,0)) > 0;

  cur_cost := round(b.current_unit_price * ann_tot + coalesce(b.current_fixed_fee_year,0), 2);

  update en.bills set annual_consumption = ann_tot, status = 'analyzed' where id = b.id;

  delete from en.proposals where bill_id = b.id;

  with priced as (
    select
      o.id as offer_id,
      round(
        (case
          when o.price_type = 'indexed'
            then (coalesce(mi.value,0) + coalesce(o.spread_eur,0)) * ann_tot
          when b.commodity = 'ele' and has_fasce and o.price_f1 is not null
            then o.price_f1*ann_f1 + o.price_f2*ann_f2 + o.price_f3*ann_f3
          when o.price_f0 is not null
            then o.price_f0 * ann_tot
          else
            (o.price_f1*0.35 + o.price_f2*0.31 + o.price_f3*0.34) * ann_tot
        end) + coalesce(o.fixed_fee_year,0)
      , 2) as cost_offer
    from en.offers o
    left join en.market_indices mi on mi.name = o.index_name
    where o.commodity = b.commodity
      and o.customer_type = b.customer_type
      and o.validity_start <= current_date
      and (o.validity_end is null or o.validity_end >= current_date)
  ),
  ranked as (
    select offer_id, cost_offer, row_number() over (order by cost_offer asc) as rnk
    from priced
  )
  insert into en.proposals(bill_id, offer_id, annual_cost_current, annual_cost_offer, annual_saving, rank, is_recommended, batch_id)
  select b.id, offer_id, cur_cost, cost_offer, round(cur_cost - cost_offer, 2), rnk,
         (rnk = 1 and (cur_cost - cost_offer) >= p_min_saving), v_batch
  from ranked;

  update en.bills
     set status = case when exists (
            select 1 from en.proposals where bill_id = b.id and annual_saving >= p_min_saving
          ) then 'proposed' else 'analyzed' end
   where id = b.id;

  return v_batch;
end;
$function$;

-- Preventivo "al volo" senza salvare nulla (usato dal box di confronto in tempo reale)
create or replace function public.en_quote(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'en'
as $function$
declare
  v_comm   text := coalesce(p->>'commodity','ele');
  v_ctype  text := coalesce(p->>'customer_type','domestic');
  v_cons   numeric := (p->>'consumption_total')::numeric;
  v_price  numeric := (p->>'current_unit_price')::numeric;
  v_fee    numeric := coalesce((p->>'current_fixed_fee_year')::numeric,0);
  v_days   integer;
  v_factor numeric;
  ann_tot  numeric; ann_f1 numeric; ann_f2 numeric; ann_f3 numeric;
  has_fasce boolean;
  cur_cost numeric;
  v_min    numeric := coalesce((p->>'min_saving')::numeric,30);
begin
  if v_cons is null or v_price is null then
    raise exception 'consumption_total e current_unit_price obbligatori';
  end if;

  if (p ? 'period_start') and (p ? 'period_end') and p->>'period_start' <> '' and p->>'period_end' <> '' then
    v_days := (p->>'period_end')::date - (p->>'period_start')::date;
  else
    v_days := coalesce((p->>'days')::integer, 365);
  end if;
  v_factor := case when v_days > 0 then 365.0 / v_days else 1 end;

  ann_tot := round(v_cons * v_factor, 2);
  ann_f1  := round(coalesce((p->>'consumption_f1')::numeric,0) * v_factor, 2);
  ann_f2  := round(coalesce((p->>'consumption_f2')::numeric,0) * v_factor, 2);
  ann_f3  := round(coalesce((p->>'consumption_f3')::numeric,0) * v_factor, 2);
  has_fasce := (ann_f1+ann_f2+ann_f3) > 0;
  cur_cost := round(v_price * ann_tot + v_fee, 2);

  return jsonb_build_object(
    'annual_consumption', ann_tot,
    'annual_cost_current', cur_cost,
    'proposals', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.rank) from (
        select
          row_number() over (order by cost_offer asc) as rank,
          (row_number() over (order by cost_offer asc) = 1 and (cur_cost - cost_offer) >= v_min) as is_recommended,
          supplier_name, offer_name, price_type, green, duration_months, index_name, spread_eur, fixed_fee_year,
          cur_cost as annual_cost_current, cost_offer as annual_cost_offer,
          round(cur_cost - cost_offer,2) as annual_saving
        from (
          select s.name as supplier_name, o.name as offer_name, o.price_type, o.green,
                 o.duration_months, o.index_name, o.spread_eur, o.fixed_fee_year,
                 round((case
                   when o.price_type='indexed' then (coalesce(mi.value,0)+coalesce(o.spread_eur,0))*ann_tot
                   when v_comm='ele' and has_fasce and o.price_f1 is not null
                     then o.price_f1*ann_f1 + o.price_f2*ann_f2 + o.price_f3*ann_f3
                   when o.price_f0 is not null then o.price_f0*ann_tot
                   else (o.price_f1*0.35 + o.price_f2*0.31 + o.price_f3*0.34)*ann_tot
                 end) + coalesce(o.fixed_fee_year,0), 2) as cost_offer
          from en.offers o
          join en.suppliers s on s.id=o.supplier_id
          left join en.market_indices mi on mi.name=o.index_name
          where o.commodity=v_comm and o.customer_type=v_ctype
            and o.validity_start<=current_date and (o.validity_end is null or o.validity_end>=current_date)
        ) priced
      ) x), '[]'::jsonb)
  );
end;
$function$;

-- Versione pubblica del preventivo: maschera fornitore/offerta (usata dal frontend con chiave anon)
create or replace function public.en_quote_public(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'en'
as $function$
declare q jsonb; arr jsonb;
begin
  q := public.en_quote(p);
  select jsonb_agg(
    jsonb_set(
      jsonb_set(e, '{supplier_name}', to_jsonb(('Fornitore '||(e->>'rank'))::text)),
      '{offer_name}', to_jsonb('Offerta riservata'::text)
    ) order by (e->>'rank')::int
  ) into arr
  from jsonb_array_elements(q->'proposals') e;
  return jsonb_set(q, '{proposals}', coalesce(arr,'[]'::jsonb));
end;
$function$;

grant execute on function public.en_quote_public(jsonb) to anon, authenticated;

-- Rate limiting generico a bucket (usato da entrambe le Edge Function)
create or replace function public.en_rate_hit(p_bucket text, p_max integer, p_ttl_seconds integer)
returns boolean
language plpgsql
security definer
set search_path to 'public', 'en'
as $function$
declare v_count integer;
begin
  delete from en.rate_limits where expires_at < now();

  insert into en.rate_limits(bucket, count, expires_at)
  values (p_bucket, 1, now() + make_interval(secs => p_ttl_seconds))
  on conflict (bucket) do update
    set count = case when en.rate_limits.expires_at < now() then 1 else en.rate_limits.count + 1 end,
        expires_at = case when en.rate_limits.expires_at < now() then now() + make_interval(secs => p_ttl_seconds) else en.rate_limits.expires_at end
  returning count into v_count;

  return v_count <= p_max;
end;
$function$;

-- Salva bolletta + lead (nome/email/telefono direttamente su en.bills, niente CRM esterno) e calcola le proposte
create or replace function public.en_analyze_and_lead(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'en'
as $function$
declare
  v_bill uuid; v_comm text; v_unit text; v_label text;
  v_ann numeric; v_cur numeric; v_saving numeric; v_best record;
begin
  v_comm := coalesce(p->>'commodity','ele');
  v_unit := case when v_comm='gas' then 'Smc' else 'kWh' end;
  v_label := case when v_comm='gas' then 'Gas' else 'Luce' end;

  insert into en.bills(commodity, customer_type, file_path, period_start, period_end,
     consumption_total, consumption_f1, consumption_f2, consumption_f3, power_kw,
     current_unit_price, current_fixed_fee_year, postal_code, current_supplier, address,
     customer_name, customer_email, customer_phone, pod, pdr, fiscal_code, source,
     consent, marketing_consent)
  values (v_comm, coalesce(p->>'customer_type','domestic'), nullif(p->>'file_path',''),
     (p->>'period_start')::date, (p->>'period_end')::date,
     (p->>'consumption_total')::numeric, (p->>'consumption_f1')::numeric, (p->>'consumption_f2')::numeric, (p->>'consumption_f3')::numeric,
     (p->>'power_kw')::numeric, (p->>'current_unit_price')::numeric, coalesce((p->>'current_fixed_fee_year')::numeric,0),
     p->>'postal_code', nullif(p->>'current_supplier',''), nullif(p->>'address',''),
     nullif(p->>'customer_name',''), nullif(lower(p->>'email'),''), nullif(p->>'phone',''),
     nullif(p->>'pod',''), nullif(p->>'pdr',''), nullif(p->>'fiscal_code',''), nullif(p->>'source',''),
     coalesce((p->>'consent')::boolean,false), coalesce((p->>'marketing_consent')::boolean,false))
  returning id into v_bill;

  perform en.compute_proposals(v_bill, coalesce((p->>'min_saving')::numeric,30));
  select annual_consumption into v_ann from en.bills where id=v_bill;
  select pr.annual_cost_current, pr.annual_cost_offer, pr.annual_saving, s.name as supplier_name, o.name as offer_name
    into v_best
  from en.proposals pr join en.offers o on o.id=pr.offer_id join en.suppliers s on s.id=o.supplier_id
  where pr.bill_id=v_bill order by pr.rank limit 1;
  v_cur := coalesce(v_best.annual_cost_current,0);
  v_saving := greatest(coalesce(v_best.annual_saving,0),0);

  return jsonb_build_object(
    'bill_id', v_bill,
    'customer_name', coalesce(nullif(trim(p->>'customer_name'),''), 'Lead bolletta '||v_label),
    'annual_consumption', v_ann,
    'recommended', case when v_best.supplier_name is not null then
        jsonb_build_object('supplier',v_best.supplier_name,'offer',v_best.offer_name,
          'annual_cost_offer',v_best.annual_cost_offer,'annual_saving',v_saving) else null end,
    'proposals', coalesce((select jsonb_agg(to_jsonb(d) order by d.rank) from en.proposal_details d where d.bill_id=v_bill),'[]'::jsonb)
  );
end;
$function$;

-- Wrapper chiamato dalla Edge Function en-lead (action=submit): ricava un periodo sintetico da "days" se serve
create or replace function public.en_public_lead(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'en'
as $function$
declare v_days integer;
begin
  v_days := nullif(p->>'days','')::integer;
  if v_days is not null and v_days > 0
     and coalesce(p->>'period_start','') = '' and coalesce(p->>'period_end','') = '' then
    p := p || jsonb_build_object(
      'period_start', to_char(current_date - v_days, 'YYYY-MM-DD'),
      'period_end',   to_char(current_date, 'YYYY-MM-DD'));
  end if;
  return public.en_analyze_and_lead(p);
end;
$function$;

create or replace function public.en_verification_create(p_bill uuid, p_email text)
returns uuid
language sql
security definer
set search_path to 'public', 'en'
as $function$
  insert into en.email_verifications(bill_id, email)
  values (p_bill, lower(p_email))
  returning token;
$function$;

create or replace function public.en_verification_confirm(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'en'
as $function$
declare v record; v_first boolean; v_name text; v_phone text;
begin
  select * into v from en.email_verifications
   where token = p_token and created_at > now() - interval '7 days';
  if v is null then return jsonb_build_object('ok', false); end if;

  v_first := v.verified_at is null;
  update en.email_verifications set verified_at = coalesce(verified_at, now()) where token = p_token;

  select customer_name, customer_phone into v_name, v_phone
    from en.bills where id = v.bill_id;

  return jsonb_build_object(
    'ok', true,
    'first_confirm', v_first,
    'email', v.email,
    'customer_name', v_name,
    'customer_phone', v_phone,
    'bill_id', v.bill_id
  );
end;
$function$;

create or replace function public.en_verification_results(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'en'
as $function$
declare v record;
begin
  select * into v from en.email_verifications
   where token = p_token and verified_at is not null
     and created_at > now() - interval '30 days';
  if v is null then return jsonb_build_object('ok', false); end if;

  return jsonb_build_object(
    'ok', true,
    'customer_name', (select customer_name from en.bills where id = v.bill_id),
    'commodity', (select commodity from en.bills where id = v.bill_id),
    'annual_consumption', (select annual_consumption from en.bills where id = v.bill_id),
    'annual_cost_current', (select annual_cost_current from en.proposal_details where bill_id = v.bill_id order by rank limit 1),
    'proposals', coalesce((select jsonb_agg(to_jsonb(d) order by d.rank)
                             from en.proposal_details d where d.bill_id = v.bill_id), '[]'::jsonb)
  );
end;
$function$;

-- ============================================================================
-- Dopo aver eseguito questo file: popolare en.suppliers / en.offers con i dati
-- fornitori (esportabili da novacrm-eu su richiesta), poi deployare le Edge
-- Function in supabase/functions/en-lead e supabase/functions/en-bill-extract,
-- impostare i secret (RESEND_API_KEY, ANTHROPIC_API_KEY, LANDING_URL) e
-- aggiornare SUPABASE_URL/SUPABASE_ANON_KEY in en.confronta.html.
-- ============================================================================
