# Attivazione comparatore Luce e Gas — stato

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

## 🔧 Da completare (chiavi/servizi tuoi)

### 1. Secret Edge Functions mancanti (Dashboard → Edge Functions → Secrets, o CLI)
```
RESEND_API_KEY=re_...        # invio email di verifica (comparatore) e broker (firma)
ANTHROPIC_API_KEY=sk-ant-... # lettura OCR delle bollette (en-bill-extract)
```
Senza `RESEND_API_KEY` il confronto funziona ma l'email di verifica non parte
(risposta: `email_sent:false`). Senza `ANTHROPIC_API_KEY` l'upload bolletta
non compila i campi (si usa l'inserimento manuale).

### 2. Resend — verifica dominio quootami.it
Serve per una buona deliverability e per il mittente `noreply@quootami.it`
(vale sia per il comparatore sia per la firma FEA).

### 3. Env vars su Vercel (per il sito, non Supabase)
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
