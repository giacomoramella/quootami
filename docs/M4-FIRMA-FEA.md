# M4 — Firma Elettronica Avanzata (FEA) via OTP Service

Quootami integra la **Firma Elettronica Avanzata** sul modulo di adesione
Allianz Previdenza tramite il provider italiano **OTP Service**
(<https://app.otpservice.io>), conforme **eIDAS Reg. UE 910/2014** + CAD + AgID.

---

## Architettura

```
┌──────────────────────────┐
│ /firma-allianz.html      │  HTML statico (pubblico)
│ (form 9 sezioni)         │  Genera PDF compilato via pdf-lib in browser
└─────────────┬────────────┘
              │ POST multipart
              ▼
┌──────────────────────────┐
│ /api/firma/start         │  Validazione + upload bozza Supabase
│ (Node runtime)           │  + chiamata OTP Service
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ OTP Service              │  Invia email/SMS al firmatario
│ (esterno)                │  Cliente firma con OTP
└─────────────┬────────────┘
              │ webhook
              ▼
┌──────────────────────────┐
│ /api/firma/callback      │  HMAC verify + download firmato
│ (Node runtime)           │  + email al broker con allegato
└──────────────────────────┘
```

---

## Modalità di esecuzione

Il sistema ha **due modalità** controllate dalla env var `OTP_MODE`:

| Modalità | `OTP_MODE` | Costi | Quando |
|---|---|---|---|
| **mock** (default) | `mock` o assente | €0 | Sviluppo + demo |
| **live** | `live` | €1.40/firma + €0.08/SMS | Produzione |

### Modalità mock (attuale)

- Nessuna chiamata HTTP a OTP Service
- `createSignatureRequest` ritorna un ID finto `MOCK-XXXXXX`
- `signUrl` punta a un dominio fittizio
- `verifyWebhook` accetta sempre (per test locali)
- `downloadSignedDoc` ritorna un PDF dummy
- L'upload Supabase/invio email sono **best-effort**: se le env vars
  non sono settate, vengono saltati con un warning in console

**In mock, l'utente che clicca "Invia per firma" vede un alert:**

```
✅ MODALITÀ TEST
In produzione il cliente riceverà via email il link per firmare con OTP Service.
Pratica ID: MOCK-XXXXXX
Destinatario: cliente@email.it
Nessun costo addebitato (mock).
```

---

## Come passare da mock → live

### 1. Registrazione OTP Service

1. Crea account su <https://app.otpservice.io/sign-up>
2. **Ricarica minima €25** (necessaria per attivare le API — il free
   tier 3 firme/mese non include API)
3. Conserva username/password (servono per l'auth API)

### 2. Configurazione webhook

Su OTP Service:
1. **Impostazioni → Webhook**
2. URL: `https://quootami.it/api/firma/callback`
3. **Genera secret HMAC-SHA256** (16+ caratteri random)
4. Copia il secret

### 3. Database Supabase

Esegui lo script SQL:

```bash
# Dashboard Supabase → SQL Editor → New query
# copia il contenuto di:
docs/sql/M4-firma-fea.sql
```

Crea i due bucket privati da Dashboard Supabase → Storage:

| Bucket | Privato | Max size | MIME |
|---|---|---|---|
| `adesioni-bozze` | ✅ | 15 MB | `application/pdf` |
| `adesioni-firmate` | ✅ | 15 MB | `application/pdf` |

### 4. Env vars Vercel

Vercel → Project Settings → Environment Variables:

```
OTP_MODE=live
OTP_USERNAME=<email OTP Service>
OTP_PASSWORD=<password OTP Service>
OTP_WEBHOOK_SECRET=<secret HMAC>

# se non già configurate:
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://ivcdwizhkdubjxxrukbs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
RESEND_API_KEY=re_...
INTERMEDIARIO_EMAIL=giacomo.rp@sistoassicurazioni.com
```

### 5. Redeploy

```bash
git push
```

Vercel rideploya automaticamente; il prossimo click su "Invia per firma"
chiamerà OTP Service reale.

---

## Test del flusso completo (modalità mock)

Senza nessuna env var settata:

1. `npm run dev`
2. Apri <http://localhost:3000/piano-pensione>
3. Click su **"Compila adesione e firma online →"**
4. Compila almeno i campi marcati con `*` (cognome, CF, email, cellulare)
5. Click **"Invia per firma"** nella toolbar in alto
6. Verifica:
   - Alert con `MOCK-XXXXXX`
   - Console server: `[OTP mock] createSignatureRequest {...}`
   - Nessun errore in Network tab

Se hai già `SUPABASE_SERVICE_ROLE_KEY` settato in `.env.local`, il file PDF
bozza viene anche caricato sul bucket `adesioni-bozze` (devi prima creare
il bucket e la tabella `pratiche`).

---

## File chiave M4

| File | Ruolo |
|---|---|
| `public/firma-allianz.html` | Form HTML standalone con 9 sezioni, generazione PDF e CTA firma |
| `lib/otpservice.ts` | Adapter OTP Service con switch mock/live |
| `app/api/firma/start/route.ts` | Endpoint multipart per partire la firma |
| `app/api/firma/callback/route.ts` | Webhook OTP Service (download + email broker) |
| `docs/sql/M4-firma-fea.sql` | Schema Supabase tabella `pratiche` |

---

## Costi operativi stimati (live)

| Volume mese | OTP Service | Costo mensile |
|---|---|---|
| 5 firme | 5 × €1.40 | €7.00 |
| 20 firme | 20 × €1.40 | €28.00 |
| 50 firme | 50 × €1.40 | €70.00 |

**Notifica OTP via email = gratuita.** SMS costa €0.08 in più ma è facoltativa.

Costi non inclusi: conservazione digitale a norma 10 anni (€0.20/doc).

---

## Sicurezza

- ✅ HMAC-SHA256 sul webhook (`OTP_WEBHOOK_SECRET`)
- ✅ Bucket Supabase privati (solo `service_role` accede)
- ✅ Tabella `pratiche` con RLS attiva (nessun accesso anon)
- ✅ PDF compilato firmato lato server, non manipolabile dal browser
- ✅ Limite 15 MB su upload
- ✅ Validazione email + cellulare + lunghezza CF
- ✅ CSP `connect-src` include `*.supabase.co`
