# Quootami — Stato del progetto (handoff)

> **Documento di continuità.** Incolla questo file in una nuova finestra di Claude
> Code (o qualsiasi altro AI coding assistant) per riprendere il lavoro con
> tutto il contesto necessario. Aggiornato al `2026-07-09`.

---

## 1. Cos'è Quootami

Sito web di un **broker assicurativo** (Sisto Assicurazioni S.a.s.,
collaboratore Giacomo Ramella Pollone, RUI E000821549). Brand:
**Quootami** (due `o`), dominio **quootami.it**.

Il sito ha lo scopo di:
- Presentare 7 prodotti assicurativi (auto, casa, salute, cyber, animali, RC, previdenza)
- Raccogliere lead con form + documenti (attualmente sostituiti da CTA WhatsApp/email/telefono)
- **Far firmare online** l'adesione al fondo pensione Allianz Previdenza con
  Firma Elettronica Avanzata a norma eIDAS (nuovissimo — M4)

Il progetto è **pensato per essere vendibile**: un futuro acquirente cambia solo
`config/operatore.ts` e alcune env vars, e si ritrova il suo sito broker pronto.

---

## 2. Stack tecnico

| Layer | Tecnologia | Note |
|---|---|---|
| Framework | **Next.js 16.2.10** App Router (Turbopack) | TypeScript strict, React 19 |
| UI | **React 19.2** + **Tailwind CSS 3.4** | Design tokens custom, glassmorphism |
| Font | `next/font` (Inter) | preload, no FOIT |
| Sicurezza | CSP + HSTS + COOP/COEP + Permissions-Policy | nonce in `proxy.ts` + `next.config.js` headers |
| Cookie | `Secure` + `HttpOnly` + `SameSite=Strict` | forzati in `proxy.ts` |
| DB + Storage | **Supabase** EU (Frankfurt) | `ivcdwizhkdubjxxrukbs.supabase.co` |
| Email | **Resend** | 100 email/g free |
| Firma FEA | **OTP Service** (app.otpservice.io) | Fractalgarden Srl, eIDAS |
| Hosting | **Vercel** | Auto-deploy da GitHub |

Repo GitHub: `quootami` — branch attivo di sviluppo **`next`**.
Branch `main` = vecchio sito statico in maintenance (in attesa di domain switch).

---

## 3. Struttura repo (branch `next`)

```
quootami/
├── app/                          # Next App Router
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Root layout (force-dynamic: richiesto dalla CSP a nonce)
│   ├── error.tsx, not-found.tsx  # Error boundaries
│   ├── globals.css               # Tailwind + design tokens
│   ├── robots.ts, sitemap.ts     # SEO dinamici
│   ├── piano-pensione/           # /piano-pensione (usa ProductPage)
│   ├── polizza-auto/             # /polizza-auto
│   ├── polizza-casa/             # /polizza-casa
│   ├── salute/                   # /salute
│   ├── cyber/                    # /cyber
│   ├── polizza-animali/          # /polizza-animali
│   ├── rc/                       # /rc (imprese)
│   ├── chi-siamo/                # /chi-siamo
│   ├── contatti/                 # /contatti
│   ├── sinistri/                 # /sinistri
│   ├── mappa-sito/               # /mappa-sito
│   ├── privacy/, cookie/, trasparenza/   # legali
│   └── api/
│       ├── lead/route.ts         # legacy stub (410 Gone)
│       └── firma/
│           ├── start/route.ts    # POST multipart, avvia FEA
│           └── callback/route.ts # webhook OTP Service
├── components/
│   ├── Nav.tsx, Footer.tsx
│   ├── ProductPage.tsx           # template universale prodotto
│   ├── ProductHero.tsx, CoverageGrid.tsx, ProcessSteps.tsx, FaqAccordion.tsx
│   ├── LegalPage.tsx
│   └── LeadForm.tsx              # dormiente (form client-side completo)
├── config/
│   ├── operatore.ts              # ⭐ DATI BROKER CENTRALIZZATI (unico file da toccare per rivendere)
│   ├── polizze.ts                # catalogo 7 polizze + adesioneUrl opzionale
│   └── credentials.ts            # Supabase anon + Web3Forms (public-by-design)
├── lib/
│   ├── supabase.ts               # supabaseAnon + getSupabaseAdmin
│   ├── resend.ts                 # sendLeadEmail + sendAdesioneFirmataEmail
│   ├── pdf-utils.ts              # helpers pdf-lib
│   └── otpservice.ts             # ⭐ adapter FEA con switch mock/live
├── public/
│   └── firma-allianz.html        # 755 KB form Allianz standalone (9 sezioni, pdf-lib)
├── docs/
│   ├── M1-DEPLOYMENT.md
│   ├── M3-SETUP.md
│   ├── M4-FIRMA-FEA.md           # ⭐ guida switch mock → live OTP Service
│   └── sql/M4-firma-fea.sql      # schema tabella pratiche
├── proxy.ts                      # CSP a nonce + cookie flags (ex middleware.ts, conv. Next 16)
├── next.config.js                # security headers globali
├── package.json, tsconfig.json, tailwind.config.js
└── CONTINUA-QUI.md               # (questo file)
```

---

## 4. Cronologia milestone completate

### M1 — Foundation Next.js
Setup Next 14 + Tailwind + TypeScript strict + security banking-grade
(CSP, HSTS, COOP, COEP, cookie Secure/HttpOnly/SameSite=Strict).
Home page migrata.

### M2 — Catalogo pagine (15 pagine)
- 7 polizze usano tutte lo stesso template `components/ProductPage.tsx`
- Contenuti prodotti centralizzati in `config/polizze.ts` (SEO, hero,
  coperture, processo, FAQ)
- Istituzionali: chi-siamo, contatti, sinistri, mappa-sito
- Legali: privacy, cookie, trasparenza
- `sitemap.ts` + `robots.ts` dinamici

### M3 — Backend lead form
- `lib/supabase.ts` (anon + admin clients)
- `lib/resend.ts` con email al broker + allegati PDF
- `components/LeadForm.tsx` (330 righe) universale con validazione zod-like
- `app/api/lead/route.ts` disattivato (410 Gone) — il form ora lavora
  client-side con Supabase anon + Web3Forms

### M3.5 — CTA fallback
Su richiesta utente, il form è sospeso: `ProductPage.tsx` mostra 3 CTA
(WhatsApp / Email / Telefono) al posto del form.

### M4 — Adesione Allianz + Firma FEA (mock)
**Appena completata**. Vedi sezione 6.

### UI polish
- Rimossa eyebrow "Broker iscritto IVASS · Confronto multi-compagnia" dalla home
- Rimosse icone "Video call" da home e pagina contatti

### M4.1 — Fix CSP produzione (2026-07-09)
La CSP in produzione usava `script-src 'strict-dynamic'` con un hash
placeholder (`'sha256-quootami'`): **bloccava TUTTI gli script del sito**
(menu mobile, FAQ accordion, error boundaries morti). Fix:
- `proxy.ts` (ex `middleware.ts`) genera un **nonce per-request** e lo passa a Next.js via
  header CSP sulla request (pattern ufficiale Next.js)
- `app/layout.tsx` ha `export const dynamic = 'force-dynamic'` — necessario
  perché il nonce cambia a ogni richiesta (le pagine non sono più statiche,
  sono server-rendered on demand)
- Verificato in locale con `next build && next start`: 15/15 script con
  nonce, hydration OK, menu e API mock funzionanti
- Nota: `/firma-allianz.html` è escluso dal matcher del proxy
  (`.*\..*`), quindi non riceve CSP — per questo pdf-lib da cdnjs carica
  senza whitelist. Gli header globali di next.config.js restano attivi.

### M4.2 — Audit sicurezza banking-grade + Next 16 (2026-07-09)
Audit completo confrontato con siti bancari reali (Intesa, N26, Revolut):
gli header Quootami risultano più severi dei loro. Interventi:
- **Next.js 14.2.15 → 16.2.10 + React 19** (14 era EOL con advisory non
  backportati, inclusa una XSS sulle app che usano CSP nonce).
  `middleware.ts` → `proxy.ts` (nuova convenzione). Build con Turbopack.
- `npm audit`: **0 vulnerabilità** (override postcss>=8.5.10 dentro next)
- Email al broker: escape HTML di tutti i valori utente (era HTML injection)
- `/api/firma/start`: magic bytes PDF, regex CF (omocodia), regex cellulare,
  limiti lunghezza, whitelist prodotto, **rate limit** 5 req/10min/IP
- `/api/firma/callback`: validazione formato praticaId + rate limit
- pdf-lib **self-hosted** in `/public/vendor/` (era su cdnjs senza SRI;
  hash sha256 verificato identico tra npm e cdnjs)
- CSP dedicata per `/firma-allianz.html` con hash SHA-256 dello script
  inline (vedi commento in `next.config.js` per ricalcolarlo dopo modifiche)
- `lib/rate-limit.ts`: limiter in-memory per-IP (difesa in profondità;
  per un limite globale usare Vercel WAF)

---

## 5. Config chiave

### `config/operatore.ts`  ⭐ UNICO FILE DA TOCCARE PER RIVENDERE

```ts
OPERATORE.brand         // Quootami, tagline, dominio
OPERATORE.collaboratore // Giacomo Ramella Pollone, RUI E000821549
OPERATORE.broker        // Sisto Assicurazioni S.a.s., iscrizione IVASS
OPERATORE.contatti      // email, telefono, orari, indirizzo
OPERATORE.social        // WhatsApp URL, IG, LinkedIn
```

Ci sono anche `getDisclaimerHTML()` e `getCopyrightText()` come helper.

### `config/polizze.ts`
Ogni polizza ha `slug, category, title, hero, metaTitle, metaDesc, ogImageAlt,
coverages, process, faq` e opzionalmente `adesioneUrl` (usato solo su
`piano-pensione` = `/firma-allianz.html`).

### `config/credentials.ts`  (public-by-design)
```ts
SUPABASE.url = 'https://ivcdwizhkdubjxxrukbs.supabase.co'
SUPABASE.anonKey = 'eyJhbGc...'   // protetta da RLS
SUPABASE.bucket = 'documenti-lead'
WEB3FORMS.accessKey = '227eeb26-f8e1-4eba-8b60-5969ab33c2c7'
```
Le credenziali segrete (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) vanno
solo in env vars Vercel, mai in questo file.

---

## 6. M4 — Firma FEA (dettaglio importante)

### Architettura

```
/firma-allianz.html (statico in public/)
        │  form 9 sezioni, 122 campi, pdf-lib client-side
        │  bottoni: Importa | Riepilogo | Esporta | Genera PDF | Invia per firma
        ↓ POST multipart (PDF + dati firmatario)
/api/firma/start
        │  valida, upload bozza Supabase, crea pratica OTP
        ↓
OTP Service (Fractalgarden Srl)
        │  invia email al firmatario con link firma OTP
        ↓ webhook
/api/firma/callback
        │  HMAC verify, scarica firmato, archivia, email broker con allegato
        ↓
giacomo.rp@sistoassicurazioni.com riceve PDF firmato
```

### Modalità

| Modalità | Env var | Costi | Uso |
|---|---|---|---|
| **mock** (attuale) | `OTP_MODE=mock` o assente | €0 | dev + demo |
| **live** | `OTP_MODE=live` | €25 ricarica minima + €1.40/firma | produzione |

In mock:
- Nessun HTTP verso OTP Service
- `createSignatureRequest()` ritorna ID `MOCK-XXXXXX`
- `verifyWebhook()` accetta sempre
- `downloadSignedDoc()` ritorna PDF dummy
- Supabase/Resend best-effort (funziona anche senza env vars)
- Il cliente vede alert "MODALITÀ TEST"

### Per passare a live

1. Registrarsi su https://app.otpservice.io/sign-up
2. Ricaricare €25 (necessario per API)
3. Su OTP Service → Impostazioni Webhook:
   - URL: `https://quootami.it/api/firma/callback`
   - HMAC secret: generarne uno random 16+ char
4. Eseguire `docs/sql/M4-firma-fea.sql` su Supabase
5. Creare 2 bucket privati da UI Supabase: `adesioni-bozze`, `adesioni-firmate` (max 15 MB, MIME `application/pdf`)
6. Su Vercel Project Settings → Environment Variables:
   ```
   OTP_MODE=live
   OTP_USERNAME=<email OTP Service>
   OTP_PASSWORD=<password OTP Service>
   OTP_WEBHOOK_SECRET=<HMAC secret scelto sopra>
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   RESEND_API_KEY=re_...
   INTERMEDIARIO_EMAIL=giacomo.rp@sistoassicurazioni.com
   ```
7. `git push` → redeploy automatico

---

## 7. Env vars complete (referenza)

### Public (browser-safe, già in `config/credentials.ts`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server-only (Vercel Environment Variables)
- `SUPABASE_SERVICE_ROLE_KEY` (bypassa RLS)
- `RESEND_API_KEY` (formato `re_xxx`)
- `RESEND_FROM_EMAIL` (default `Quootami <noreply@quootami.it>` — richiede DNS verify)
- `INTERMEDIARIO_EMAIL` (default `giacomo.rp@sistoassicurazioni.com`)
- `OTP_MODE` (`mock` | `live`)
- `OTP_USERNAME` (solo se live)
- `OTP_PASSWORD` (solo se live)
- `OTP_WEBHOOK_SECRET` (solo se live)

---

## 8. Cosa manca da fare (in ordine)

### Priorità 1 — Test M4 mock end-to-end
1. `git push` del branch `next` (le modifiche M4 sono già committate localmente? vedi sezione 10)
2. Aprire preview Vercel del branch `next`
3. Andare su `/piano-pensione` → click "Compila adesione e firma online"
4. Compilare almeno cognome, CF, email, cellulare nel form
5. Cliccare "Invia per firma" → deve apparire alert MOCK con `MOCK-XXXXXX`

### Priorità 2 — Domain switch (scelta utente = opzione B)
Quando M4 mock è verificato:
1. Vercel Project Settings → Domains
2. Rimuovere `quootami.it` dal deploy `main` (statico)
3. Aggiungerlo al deploy del branch `next`
4. DNS già configurato correttamente su Namecheap/registrar
5. Verificare HTTPS + HSTS attivi

### Priorità 3 — Attivare firma live (quando l'utente vuole)
Seguire procedura in sezione 6 "Per passare a live".

### Priorità 4 — Vendibility polish (Round 4)
- `docs/CUSTOMIZATION.md` — cosa cambiare per rebrand (basically `config/operatore.ts`)
- `docs/ARCHITECTURE.md` — panoramica tecnica
- `docs/SALES.md` — checklist per un acquirente
- Aggiornare `README.md` finale (attualmente 84 byte)

### Nice-to-have (Round 2/3)
- Schema.org JSON-LD structured data (Organization, Product, FAQPage)
- Glossario assicurativo (era nel vecchio sito statico, migrare)
- Calcolatore convenienza fondo pensione (come latuapensione.it)
- AI chatbot (richiede API key OpenAI/Anthropic)
- Brandizzare `public/firma-allianz.html` (attualmente colori Allianz stock — sostituire con brand Quootami)

---

## 9. File chiave M4 (tutti creati oggi)

| File | Byte | Ruolo |
|---|---|---|
| `public/firma-allianz.html` | 758 KB | Form standalone Allianz con bottone "Invia per firma" |
| `lib/otpservice.ts` | 7.9 KB | Adapter mock/live per OTP Service |
| `app/api/firma/start/route.ts` | 4.8 KB | Endpoint multipart avvia FEA |
| `app/api/firma/callback/route.ts` | 5.0 KB | Webhook OTP Service (HMAC + email broker) |
| `docs/M4-FIRMA-FEA.md` | 5.9 KB | Guida completa mock → live |
| `docs/sql/M4-firma-fea.sql` | 3.6 KB | Schema Supabase pratiche + istruzioni bucket |

Anche modificati:
- `lib/supabase.ts` — aggiunti `STORAGE_BUCKET_ADESIONI_BOZZE`, `STORAGE_BUCKET_ADESIONI_FIRMATE`
- `lib/resend.ts` — aggiunta `sendAdesioneFirmataEmail()`
- `config/polizze.ts` — aggiunto campo `adesioneUrl?: string` + `piano-pensione` → `/firma-allianz.html`
- `components/ProductPage.tsx` — CTA "Compila adesione online" quando `polizza.adesioneUrl` esiste

---

## 10. Comandi utili

### Dev locale
```bash
cd ~/Desktop/quootami
npm install --legacy-peer-deps
npm run dev
# apri http://localhost:3000  (NON https:// in dev)
```

### Type-check senza build
```bash
npx tsc --noEmit
```

### Build produzione locale (opzionale, Vercel lo fa comunque)
```bash
rm -rf .next
npx next build
```

### Deploy
```bash
git status                                     # verifica cosa cambia
git add -A
git commit -m "descrizione della modifica"
git push                                        # branch next → Vercel auto-deploy
```

### Test firma mock (dopo push)
1. Apri preview URL Vercel
2. `/piano-pensione`
3. Click CTA "Compila adesione e firma online →"
4. Compila cognome + CF + email + cellulare (minimo)
5. Click "Invia per firma" nella toolbar in alto del form
6. Vedi alert: `✅ MODALITÀ TEST ... Pratica ID: MOCK-XXXXXX`

---

## 11. Errori noti e soluzioni

| Errore | Causa | Fix |
|---|---|---|
| `zsh: command not found: #` | copiare commenti bash | non copiare linee che iniziano con `#` |
| `npm ERESOLVE` peer deps | React 18 vs Next peer | usare `npm install --legacy-peer-deps` |
| `EACCES` npm cache | vecchio `sudo npm` | `sudo chown -R $(whoami) ~/.npm && npm cache clean --force` |
| `ERR_SSL_PROTOCOL_ERROR` su https://localhost | dev server è HTTP | usa `http://localhost:3000` |
| Vercel "No Output Directory 'public'" | framework preset era "Other" | Settings → Framework Preset → **Next.js** |
| `Cannot find module 'critters'` | `experimental.optimizeCss: true` | rimosso da `next.config.js` |
| `next build` fallisce con `PageNotFoundError` / `ENOENT` random | iCloud sincronizza `~/Desktop` (incluso `.next/`) durante il build | riprovare `rm -rf .next && npx next build`; non tocca Vercel (builda nel cloud) |

---

## 12. Persone e contatti

- **Utente**: Giacomo Ramella Pollone
- **Email dev**: `ramellapollonegiacomo@gmail.com`
- **Email broker (lead vanno qui)**: `giacomo.rp@sistoassicurazioni.com`
- **RUI**: sez. E, n. `E000821549` (collaboratore di intermediario iscritto)
- **Broker principale**: Sisto Assicurazioni S.a.s.

---

## 13. Come continuare in una nuova finestra

1. Apri il progetto in Claude Code puntando a `~/Desktop/quootami`
2. Incolla il primo prompt tipo:
   > "Leggi CONTINUA-QUI.md nella root del progetto e riprendi il lavoro. Il
   > prossimo step naturale è: [descrivere cosa vuoi fare]."
3. L'assistente avrà tutto il contesto per proseguire senza domande.

**Prossimo step naturale suggerito**: `git push` di M4 e test mock sul
preview Vercel; poi domain switch a `quootami.it`.
