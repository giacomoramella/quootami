# Attivazione comparatore Luce e Gas — stato

> **STATO AL 07/09/2026 — il comparatore è ARCHIVIATO, non attivo.**
> Tutto quello che segue descrive un'infrastruttura che *funziona ed è ancora in
> piedi* (schema `en`, 92 fornitori, 170 offerte, Edge Functions attive), ma la
> rotta `/luce` è stata archiviata: vedi `archivio/luce-e-gas/README.md`.
>
> Il verticale riparte da una **landing di lista d'attesa**, non dal comparatore:
> senza almeno un mandato firmato un confronto prezzi sarebbe finto. Specifica e
> codice pronto in `LANDING-LUCE-E-GAS.md`. Il comparatore si riattiva quando il
> primo accordo è chiuso — trattative in corso con Wekiwi e Illumia, vedi
> `OUTREACH-FORNITORI-2026-09.md`.

> Backend sul progetto Supabase attivo `ivcdwizhkdubjxxrukbs` (Francoforte).
> Pagina: `/luce` (React) + `components/ComparatoreLuce.tsx`.

## ✅ Già fatto (15/07/2026, via dashboard + Management API)

- **Progetto Supabase** riattivato (era in pausa)
- **Schema `en`**: 7 tabelle + vista + funzioni RPC + RLS
- **Schema firma M4**: tabella `public.pratiche` + RLS
- **Dati**: 92 fornitori, 170 offerte, 2 indici di mercato (fonte ARERA)
- **Bucket Storage privati** per la firma: `adesioni-bozze`, `adesioni-firmate` (solo PDF, 15 MB)
- **Edge Functions** deployate e ACTIVE: `en-lead`, `en-bill-extract` (verify_jwt off)
- **Secret** `LANDING_URL=https://quootami.it/luce` impostato
- **Verificato end-to-end**: `en_quote_public` calcola (spesa €432 → risparmio €129), `en-lead?submit` salva il lead e calcola le offerte (dati di test poi ripuliti)

## ✅ COMPARATORE OPERATIVO IN PRODUZIONE (15/07/2026 sera)

- Secret `RESEND_API_KEY` e `ANTHROPIC_API_KEY` impostati sulle Edge Functions
- Dominio quootami.it **verificato su Resend** (DKIM + MX/SPF su `send.` via Aruba)
- **Domain switch fatto**: quootami.it serve il branch `next` (sito Next 16)
- **Funnel validato end-to-end dal vivo** dall'utente: confronto (90 offerte,
  risparmio €184/anno) → lead con consenso → email di verifica ricevuta →
  clic sul link → fornitori sbloccati. OCR bolletta testato e funzionante.
  Rate limiting anti-spam verificato in produzione.
- Database ripulito dai lead di test (92 fornitori e 170 offerte intatti)

## 🔧 Unica cosa rimasta (serve solo per la FIRMA, non per il comparatore)

### Env vars su Vercel
```
SUPABASE_SERVICE_ROLE_KEY=...   # firma: upload bozze/firmati, tabella pratiche
RESEND_API_KEY=...              # firma: email al broker
INTERMEDIARIO_EMAIL=giacomo.rp@sistoassicurazioni.com
```
(La anon key pubblica è già in `config/credentials.ts` e funziona.)

## Note di sicurezza (già applicate lato sito)

- pagina React nativa sotto la CSP a nonce globale, nessuna libreria esterna
- RLS su tutte le tabelle `en.*`; accesso solo via funzioni RPC (SECURITY
  DEFINER) o service_role; il frontend usa la anon key protetta da RLS
- consenso GDPR obbligatorio sui form (comparatore e firma)

## Coordinamento

Versione canonica su branch `next`: `app/luce/page.tsx` +
`components/ComparatoreLuce.tsx` + `supabase/`. Non modificare la copia su `main`.
