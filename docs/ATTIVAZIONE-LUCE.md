# Attivazione comparatore Luce e Gas — checklist operativa

> Il frontend è già integrato nel sito (branch `next`, pagina `/luce` (React, stile Quootami),
> collegata al progetto Supabase attivo `ivcdwizhkdubjxxrukbs`, Francoforte).
> Perché funzioni end-to-end vanno completati questi passi, in ordine.

## 0. ⚠️ PRIMA DI TUTTO: il progetto Supabase (bloccante)

Al 14/07/2026 **nessuno dei due progetti Supabase noti risolve il DNS**:
`ivcdwizhkdubjxxrukbs` (nelle credenziali del sito) e `iulktthjkzvmevzoqhww`
(citato in EN-MIGRATION). Probabilmente in pausa prolungata o eliminati.
Da dashboard supabase.com: riattivare il progetto esistente (Resume) o
crearne uno nuovo in **regione Francoforte**. Se il ref cambia, aggiornare
`config/credentials.ts` (url + anonKey) — il comparatore e il resto del
sito leggono da lì.

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
LANDING_URL=https://quootami.it/luce           # (o l'URL del preview finché non c'è il domain switch)
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` sono iniettati automaticamente.

## 4. Test end-to-end

1. Aprire `/luce` → inserire consumi → "Confronta": devono comparire le offerte
2. Lasciare l'email con consenso → arriva l'email di verifica → click → risultati sbloccati
3. Caricare una foto di bolletta → i campi si compilano da soli (OCR)
4. Verificare su Supabase: riga creata in `en.bills`, proposte in `en.proposals`

## Note di sicurezza (già applicate lato sito)

- pagina React nativa del sito: gira sotto la CSP a nonce globale,
  nessuna libreria esterna (chiamate Supabase via fetch), nessun CDN;
  `connect-src` limitato a `self` + `*.supabase.co`
- Consenso GDPR obbligatorio sul form lead con link all'informativa
- Privacy policy aggiornata (dati bolletta, Anthropic come responsabile, DPF)
- Nessun segreto nel codice: le chiavi vivono solo nei secret Supabase/Vercel

## Coordinamento

Da ora la versione canonica del comparatore è su **branch `next`**
(`app/luce/page.tsx` + `components/ComparatoreLuce.tsx`): le modifiche
future vanno fatte qui, non su `main`.
