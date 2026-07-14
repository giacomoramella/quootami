# Migrazione "Luce" -> Quootami (prefisso `en`)

Stato: **fase 1 completata (codice copiato), fase 2 in attesa di accesso Supabase**.

## Cosa contiene questo commit

- `en.confronta.html` — frontend del comparatore, identico al sito "Luce" oggi
  live su `novacrm-nine.vercel.app/confronta.html`. **Punta ancora al backend
  Supabase originale** (`novacrm-eu`, progetto di armandocesa) tramite
  `energy_quote_public` / `energy-lead` / `bill-extract-public`: funziona da
  subito, ma i lead generati da qui finiscono ancora nel CRM originale, non in
  un progetto Quootami.
- `supabase/en-schema.sql` — schema Postgres autonomo (`en.*`), pronto per
  essere eseguito su un progetto Supabase nuovo/vuoto. A differenza dello
  schema originale non dipende da uno schema `crm` esterno: i dati del lead
  (nome, email, telefono) sono salvati direttamente su `en.bills`.
- `supabase/functions/en-lead/index.ts` — Edge Function per invio lead,
  verifica email (doppio opt-in) e sblocco risultati. Contiene dei `TODO`
  (dominio, mittente email) da completare prima del deploy.
- `supabase/functions/en-bill-extract/index.ts` — Edge Function per la
  lettura automatica delle bollette (OCR con Claude Vision), invariata.

## Perche' non e' ancora collegato al Supabase di Quootami

Il progetto Supabase dell'organizzazione Quootami (`iulktthjkzvmevzoqhww`,
progetto `quootami`) e' **in pausa**, e l'accesso disponibile al momento e'
di sola lettura (tentativo di riattivazione fallito: "il tuo account non ha
i privilegi necessari"). Per completare la migrazione serve che un
Owner/Admin dell'organizzazione:

1. riattivi il progetto dal dashboard Supabase (Project -> "Resume project"), oppure
2. alzi il ruolo dell'account collegato a Owner/Admin cosi' posso farlo direttamente.

## Passi restanti (fase 2, dopo lo sblocco Supabase)

1. Eseguire `supabase/en-schema.sql` sul progetto Supabase Quootami (SQL Editor
   o `supabase db push`).
2. Popolare `en.suppliers` ed `en.offers` con i dati fornitori/offerte
   (esportabili dal progetto novacrm-eu su richiesta).
3. Deployare le due Edge Function (`en-lead`, `en-bill-extract`) con
   `verify_jwt` disattivato, dopo aver compilato i `TODO` nel codice
   (dominio/brand, mittente email).
4. Impostare i secret della funzione: `RESEND_API_KEY`, `ANTHROPIC_API_KEY`,
   `LANDING_URL` (URL definitivo di `en.confronta.html`), `FROM_EMAIL`
   (richiede un dominio verificato su Resend per una buona deliverability).
5. In `en.confronta.html`, sostituire `SUPABASE_URL` e `SUPABASE_ANON_KEY`
   con quelli del nuovo progetto, e rinominare le chiamate RPC/azioni da
   `energy_quote_public` / `energy-lead` / `bill-extract-public` a
   `en_quote_public` / `en-lead` / `en-bill-extract`.
6. Verificare il flusso end-to-end (confronto -> lead -> email -> verifica ->
   sblocco risultati) prima di sostituire eventuali link pubblici.

## Note aperte, da chiarire con Giacomo

- Dominio/URL definitivo su cui pubblicare `en.confronta.html` (sottopercorso
  del sito Quootami esistente, o dominio/progetto Vercel separato?).
- Branding delle email transazionali (nome mittente, dominio Resend).
- Se in futuro serve un CRM lead anche lato Quootami (pipeline, follow-up),
  valutare se collegare `en.bills` a un modulo CRM esistente o tenerlo
  standalone come e' oggi.
