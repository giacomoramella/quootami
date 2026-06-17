# Quootami — Milestone 3: Backend Lead Form

Questa milestone aggiunge il backend completo per ricevere i lead dal sito.

## Cosa è stato fatto

| Cosa | Dove |
|---|---|
| Supabase clients | `lib/supabase.ts` (anon + admin) |
| Resend client | `lib/resend.ts` (invio email con allegati) |
| Conversione immagini → PDF | `lib/pdf-utils.ts` (server-side, `pdf-lib`) |
| API route lead | `app/api/lead/route.ts` |
| Form universale | `components/LeadForm.tsx` (in ogni `ProductPage`) |
| Schema SQL Supabase | `supabase/schema.sql` |

## Flusso end-to-end

1. Utente compila form preventivo su `/polizza-auto` (o altra pagina prodotto)
2. Submit → `POST /api/lead` con `FormData` (dati + 2 o 3 file)
3. Server-side:
   - Valida con Zod
   - Inserisce lead via RPC `insert_lead` (bypass RLS controllato)
   - Carica file su Supabase Storage (privato)
   - Converte immagini in PDF con `pdf-lib`
   - Invia email a `INTERMEDIARIO_EMAIL` via Resend con allegati PDF
4. Risponde JSON `{ ok: true, leadId }`
5. UI mostra messaggio successo

## Setup tu (3 step, ~10 min)

### 1) Account Resend

1. Vai su https://resend.com
2. **Sign up** con GitHub
3. Verifica email
4. Dashboard → **API Keys** → **Create API Key**
   - Name: `quootami-production`
   - Permission: **Full access**
   - Save → **copia la key** (`re_xxxxx`)

### 2) Verifica dominio (consigliato, non blocca)

1. Dashboard Resend → **Domains** → **Add Domain**
2. Aggiungi `quootami.it`
3. Aggiungi i record DNS che Resend ti mostra (TXT, MX, DKIM) sul tuo provider DNS
4. Aspetta verifica (5-15 min)

Senza dominio verificato, Resend ti lascia mandare email solo all'email dell'account che usi per Resend. Per produzione verifica il dominio.

### 3) Configura env vars su Vercel

Vai su https://vercel.com/dashboard → progetto **quootami** → **Settings** → **Environment Variables**.

Aggiungi (tutte e 3 per Production + Preview + Development):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ivcdwizhkdubjxxrukbs.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la **anon public** key del tuo progetto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | la **service_role secret** key (vista una volta) |
| `RESEND_API_KEY` | `re_xxxxx` (key appena creata) |
| `RESEND_FROM_EMAIL` | `Quootami <noreply@quootami.it>` (o `onboarding@resend.dev` finché non verifichi dominio) |
| `INTERMEDIARIO_EMAIL` | `giacomo.rp@sistoassicurazioni.com` |

⚠️ `SUPABASE_SERVICE_ROLE_KEY` **NON deve avere il prefisso `NEXT_PUBLIC_`** — è una chiave amministrativa che deve restare server-only.

### 4) Redeploy

Dopo aver salvato le env vars:

1. Deployments → ultimo deploy → click sui **... 3 puntini** → **Redeploy**

Oppure pusha un commit vuoto:

```bash
git commit --allow-empty -m "redeploy: M3 env vars configured" && git push origin next
```

## Test manuale

1. Apri preview Vercel del branch `next` → `/polizza-auto`
2. Scrolla al form preventivo
3. Compila tutti i campi + carica 3 file (jpg/png/pdf < 10MB)
4. Spunta consenso GDPR
5. Click "Invia richiesta →"

### Risultato atteso

- ✅ Bottone mostra "Invio in corso…"
- ✅ Box verde "Richiesta inviata!"
- ✅ Email a `giacomo.rp@sistoassicurazioni.com` con:
  - Oggetto: `Nuova richiesta preventivo polizza-auto — Mario Rossi`
  - Reply-To: email del cliente
  - 3 PDF allegati: `mario_rossi_ci_fronte.pdf`, `mario_rossi_ci_retro.pdf`, `mario_rossi_libretto.pdf`
- ✅ Riga su Supabase Table Editor → leads con tutti i campi popolati
- ✅ File su Supabase Storage → `documenti-lead/leads/<uuid>/`

## Troubleshooting

| Errore | Causa | Fix |
|---|---|---|
| `RESEND_API_KEY non configurata` | env var mancante | Aggiungila su Vercel + redeploy |
| `400 Bad Request` su email | Mittente non autorizzato | Usa `onboarding@resend.dev` finché non verifichi dominio |
| `Errore salvataggio lead` | RLS Supabase | Verifica che la RPC `insert_lead` esista (lancia `supabase/schema.sql` nel SQL Editor) |
| `Upload fallito` | Bucket privato non esistente | Crea bucket `documenti-lead` private + esegui policy |
