# CLAUDE.md — Istruzioni per Claude Code

Questo file viene letto **automaticamente** ogni volta che operi in questa cartella. Le regole qui dentro vanno seguite **sempre**.

---

## Contesto del progetto

Sito web del broker assicurativo **Quootami**.

- **Intermediario:** Giacomo Ramella Pollone, collaboratore iscritto al **RUI sez. E n. E000821549**, operante per conto del broker **Sisto Assicurazioni S.a.s.** (RUI sez. B n. B000639183, P.IVA 02696750021).
- **Titolare del trattamento dati** (privacy + cookie): **Giacomo Ramella Pollone**, gestore del sito. (Il broker Sisto resta "titolare" solo del **mandato di intermediazione** IVASS nella pagina Trasparenza — è un "titolare" diverso, non confonderli.)
- **Stack:** **Next.js 16 (App Router, Turbopack) + React 19 + TypeScript**. NON è più un sito statico HTML.
- **Produzione:** `https://quootami.it` (+ `www.quootami.it`). **Production branch = `next`**: un `git push origin next` fa partire in automatico il deploy in produzione su Vercel.
- **Repository:** `https://github.com/giacomoramella/quootami`
- Le pagine usano `export const dynamic = 'force-dynamic'` perché la CSP a nonce va generata per-request.

### Struttura
- `app/` — route (App Router) + `app/api/` (route handler) + `app/sitemap.ts`, `app/robots.ts`
- `components/` — componenti React (Nav, Footer, form, sezioni prodotto/pensione, comparatore luce…)
- `config/` — dati centralizzati: `operatore.ts` (anagrafica/contatti/disclaimer), `seo.ts` (metadata default), `polizze.ts` (contenuti prodotti + FAQ), `credentials.ts` (chiavi pubbliche)
- `lib/` — client Supabase/Resend/OTP e utility server
- `public/` — asset statici serviti (favicon.ico/.svg, apple-icon.png, og-image.png, site.webmanifest, firma-allianz.html)
- `supabase/` — schema SQL, seed, edge functions (comparatore luce, estrazione bolletta)
- `docs/` — documentazione tecnica (firma FEA, migrazione luce, ecc.)
- `next.config.js` — **security header** · `proxy.ts` — **CSP a nonce (middleware)** · `tailwind.config.ts` — design token

---

## Regole inderogabili

### 1. Sicurezza — controllo dopo OGNI modifica

Prima di proporre il push, verifica:

- [ ] **Security header intatti** in `next.config.js` (`headers()`): HSTS con `preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP. **Mai rimuoverli o indebolirli.**
- [ ] **CSP intatta** in `proxy.ts`: in produzione `script-src` = `'self' 'nonce-…' 'strict-dynamic'` (niente `unsafe-inline`/`unsafe-eval`), `form-action 'self'`, `frame-ancestors 'none'`, `object-src 'none'`.
- [ ] Se aggiungi una **risorsa esterna** (API, iframe, font, immagine remota), aggiungi il dominio alla direttiva CSP giusta in `proxy.ts` (`connect-src`, `frame-src`, `img-src`, `font-src`, `style-src`).
- [ ] **Nessuna nuova `<script>` da CDN** non whitelisted (prima discutila con l'utente).
- [ ] **Nessuna `eval()`, `new Function()`, `setTimeout` con stringa**.
- [ ] **Nessun `dangerouslySetInnerHTML` o `innerHTML = userInput`** (XSS).
- [ ] **Nessun segreto/token/api-key nuovo** in chiaro. Eccezione documentata: l'access_key Web3Forms `227eeb26-f8e1-4eba-8b60-5969ab33c2c7` è **pubblica per design**. I segreti server (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `OTP_*`) stanno solo in env Vercel.
- [ ] **Form** — `form-action` resta `'self'`: i form inviano via `fetch()` (governato da `connect-src`), non con POST nativo.

Se un punto è indebolito, **avvisa l'utente** prima di chiedere il push.

> Nota: `vercel.json` contiene **solo** `regions` (fra1). Gli header NON sono lì — non cercarli/spostarli in `vercel.json`.

### 2. Dopo il deploy — verifica

Quando l'utente conferma il push, verifica gli header live:

```bash
curl -sI https://www.quootami.it/ | grep -iE "strict-transport|content-security|x-frame|x-content-type|referrer|permissions"
```

Standard atteso: **A+** su securityheaders.com e Mozilla Observatory (`quootami.it`).

### 3. Cosa NON modificare senza spiegare e chiedere

- **Disclaimer legale IVASS nel footer** — generato da `getDisclaimerHTML()` in `config/operatore.ts`, reso in `Footer.tsx`. Obbligatorio per art. 35 Reg. IVASS 40/2018 (RUI collaboratore + broker, messaggio pubblicitario, vigilanza IVASS). Testo intoccabile.
- **Pagine legali** `app/trasparenza/`, `app/privacy/`, `app/cookie/` — modificabili solo per allinearle a ciò che il sito effettivamente fa. La Trasparenza è obbligatoria IVASS.
- **`next.config.js` header** e **`proxy.ts` CSP** — toccare solo per aggiungere domini autorizzati, mai per rimuovere protezioni.
- **Web3Forms `access_key`** — non rimuoverla/cambiarla senza ok esplicito.
- Nessun nuovo segreto in chiaro nel codice.

### 4. Convenzioni di stile

- **Voce**: terza persona / impersonale ("Quootami…"). Mai "io"/"una persona". Eccezione: pagine legali (privacy/cookie/trasparenza) dove serve la prima persona per l'identificazione.
- **Palette**: usa i token di `tailwind.config.ts` — `brand.yellow #FFD84D`, `brand.navy #0B1220`, `brand.green #1F9D55`, token `ink`/`bg`; accenti grafici teal `#2A9D8F` / coral `#E76F51` / amber `#E9B440`. Classi utility in `app/globals.css` (`.section`, `.container-content`, `.eyebrow`, `.section-title`, `.hl`, `.btn-primary`, `.btn-secondary`).
- **Niente emoji** nei titoli/card dove non già presenti (stile sobrio).
- **Niente claim/numeri inventati** (es. "risparmio medio €X", rendimenti promessi). Solo fatti verificabili di legge o dati con fonte dichiarata. Il broker è neutrale.

### 5. Flusso di lavoro

1. Capisci la richiesta (se ambigua, chiedi).
2. Identifica i file da toccare.
3. Modifica.
4. Esegui il **check sicurezza** della sezione 1.
5. Proponi un messaggio di commit **specifico**.
6. Type-check + build prima del push: `npx tsc --noEmit && npx next build`.

### 6. Form → email

Tutti i form preventivo/contatti inviano a **`giacomo.rp@sistoassicurazioni.com`** via Web3Forms (access_key pubblica sopra). Riusa lo schema esistente — vedi i form in `components/` (es. `ComparatoreLuce.tsx`). Il comparatore luce usa anche Supabase (edge function `en-lead`, double opt-in).

### 7. Privacy / GDPR

Ogni form **DEVE avere**: checkbox di consenso obbligatoria + link a `/privacy` + spiegazione di dove vanno i dati (titolare = Giacomo Ramella Pollone).

Se aggiungi tracciamento (analytics/pixel/cookie): aggiorna `app/privacy` e `app/cookie`, verifica il cookie banner (`CookieConsent.tsx`, consenso `qtm_consent`) e aggiungi il dominio a `connect-src` in `proxy.ts`.

### 8. Commit

Formato `<area>: <cosa è cambiato>`, es.:
```
piano-pensione: rimosso il form stima
seo: favicon.ico come fallback per Safari/iPhone
privacy: titolare del trattamento = Giacomo Ramella Pollone
```
Chiudi i commit con:
```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

---

## Comandi

```bash
npm run dev          # sviluppo (localhost:3000)
npm run build        # build produzione
npm run type-check   # tsc --noEmit
```

### Deploy
```bash
cd ~/Desktop/quootami && git add -A && git commit -m "descrizione" && git push origin next
```
Il push su `next` rideploya in automatico su Vercel (produzione). Esiste anche `deploy.command` (doppio click da Finder).

---

## Note operative

- **iCloud rompe il file-watching di Tailwind in locale**: le classi uniche di componenti nuovi possono non essere generate finché non si ricarica la cache del browser. Su Vercel (build pulita) il problema non si presenta.
- **Branch `main`**: le sue build sono in errore (commit di armandocesa); la produzione gira su `next`. Da allineare.
- `GUIDA-LAVORO.md` e `AUDIT-SICUREZZA.md` in root sono documenti storici del vecchio sito statico: utili come contesto, ma questo CLAUDE.md è la fonte autorevole aggiornata.

---

*Ultimo aggiornamento: 28 luglio 2026 — allineato al progetto Next.js.*
