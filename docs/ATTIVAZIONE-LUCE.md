# Attivazione comparatore Luce e Gas — checklist operativa

> Il frontend è già integrato nel sito (branch `next`, pagina `/luce.html`,
> collegata al progetto Supabase attivo `ivcdwizhkdubjxxrukbs`, Francoforte).
> Perché funzioni end-to-end vanno completati questi passi, in ordine.

## 1. Database (Dashboard Supabase → SQL Editor) — ~10 min

Eseguire nell'ordine, un file alla volta:

1. `supabase/en-schema.sql` (schema `en.*`, tabelle, funzioni, RLS)
2. `supabase/seed/en-seed-suppliers.sql` (92 fornitori)
3. `supabase/seed/en-seed-offers-1.sql` → `-2` → `-3` → `-4`
4. `supabase/seed/en-seed-market-indices.sql`

Verifica rapida: `select count(*) from en.offers;` deve restituire le offerte caricate.

## 2. Edge Functions (CLI Supabase) — ~10 min

```bash
supabase link --project-ref ivcdwizhkdubjxxrukbs
supabase functions deploy en-lead --no-verify-jwt
supabase functions deploy en-bill-extract --no-verify-jwt
```

## 3. Secret delle funzioni (Dashboard → Edge Functions → Secrets)

```
RESEND_API_KEY=re_...          # stessa chiave del sito
ANTHROPIC_API_KEY=sk-ant-...   # per la lettura OCR delle bollette
FROM_EMAIL=Quootami Energia <noreply@quootami.it>   # richiede dominio verificato su Resend
LANDING_URL=https://quootami.it/luce.html           # (o l'URL del preview finché non c'è il domain switch)
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` sono iniettati automaticamente.

## 4. Test end-to-end

1. Aprire `/luce.html` → inserire consumi → "Confronta": devono comparire le offerte
2. Lasciare l'email con consenso → arriva l'email di verifica → click → risultati sbloccati
3. Caricare una foto di bolletta → i campi si compilano da soli (OCR)
4. Verificare su Supabase: riga creata in `en.bills`, proposte in `en.proposals`

## Note di sicurezza (già applicate lato sito)

- supabase-js self-hostato e pinnato (2.110.5), nessun CDN
- CSP dedicata per `/luce.html` con hash SHA-256 dello script inline;
  `connect-src` limitato a `self` + `*.supabase.co`
- Consenso GDPR obbligatorio sul form lead con link all'informativa
- Privacy policy aggiornata (dati bolletta, Anthropic come responsabile, DPF)
- Nessun segreto nel codice: le chiavi vivono solo nei secret Supabase/Vercel

## Coordinamento

Da ora la versione canonica del comparatore è su **branch `next`**
(`public/luce.html`): le modifiche future vanno fatte qui, non su `main`.
