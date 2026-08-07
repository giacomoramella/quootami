-- Patch 07/08/2026 — en_verification_confirm restituisce anche il telefono.
-- Serve alla notifica lead verso il broker nella edge function en-lead:
-- senza telefono la notifica obbliga a un giro in piu' via email.
-- Sostituisce integralmente la versione in en-schema.sql:447.

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
