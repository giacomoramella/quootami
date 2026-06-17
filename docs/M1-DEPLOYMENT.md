# Quootami — Milestone 1: Foundation

Questa è la prima milestone della migrazione da HTML statico a **Next.js 14 App Router**. Contiene foundation, security banking-grade, layout, Home page.

## Cosa contiene M1

| File | Scopo |
|---|---|
| `package.json` | Dipendenze (Next 14.2, React 18, Tailwind 3, Supabase, Resend) |
| `tsconfig.json` | TypeScript strict mode |
| `next.config.js` | **Security headers banking-grade** (HSTS, COOP, CORP, Permissions-Policy, ecc.) |
| `middleware.ts` | **CSP rigorosa con nonce** + cookie forced Secure/HttpOnly/SameSite=Strict |
| `tailwind.config.ts` | Design tokens Quootami (brand yellow, navy, glassmorphism, smooth animations) |
| `app/globals.css` | Reset, brand tokens CSS, classi reusable (btn-primary, glass, hl, section) |
| `app/layout.tsx` | Root layout con CSP nonce, font Inter + JetBrains Mono via next/font (no FOIT) |
| `app/page.tsx` | **Home page migrata** con glassmorphism nav, hero animato, categorie, banner pensione verde, omnicanale |
| `components/Nav.tsx` | Nav glassmorphism responsive con menu mobile |
| `components/Footer.tsx` | Footer 5 colonne con disclaimer IVASS dinamico |
| `config/operatore.ts` | **CENTRALIZZAZIONE DATI** — modificare qui per cambiare proprietario |
| `config/seo.ts` | Default Open Graph + Twitter Cards |

## Setup locale (dal tuo Mac)

### 1. Switch al branch `next`

```bash
cd ~/Desktop/quootami
git checkout -b next
```

### 2. Installa dipendenze

```bash
npm install
```

> Tempo: ~1 minuto. Scarica ~250 MB in `node_modules/`.

### 3. Dev server

```bash
npm run dev
```

Apri http://localhost:3000 — dovresti vedere la home con:
- Nav glassmorphism in alto (blur + trasparenza)
- Hero con "quootami." in grande
- 4 stats sotto
- 6 card categorie prodotto
- Banner pensione verde
- 4 icone omnicanale minimal
- Footer scuro con disclaimer IVASS

### 4. Type check + build di prova

```bash
npm run type-check    # Verifica TypeScript
npm run build         # Build di produzione (verifica che tutto compili)
```

## Cosa fare DOPO M1

Le prossime milestone migrano il resto del sito:

- **M2** — Tutte le pagine prodotto + istituzionali
- **M3** — Lead form con Supabase + Resend operativo
- **M4** — Adesione Allianz + FEA + documentazione completa per vendita

## Stack riepilogo

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Lingua | TypeScript 5.6 strict |
| Styling | Tailwind CSS 3.4 + custom CSS |
| Font | Inter + JetBrains Mono (next/font, preload) |
| Sicurezza | CSP nonce dinamico, HSTS preload, COOP/COEP/CORP, Permissions-Policy |
| Cookie | Forced Secure + HttpOnly + SameSite=Strict via middleware |
| Database | Supabase Postgres (regione EU) |
| Storage | Supabase Storage privato |
| Email | Resend |
| Hosting | Vercel (Hobby/Pro) |

## Note sicurezza

La CSP è **molto restrittiva**:
- `script-src 'self' 'nonce-<random>' 'strict-dynamic'` → script inline richiedono nonce dal middleware
- `default-src 'self'` → niente esterni di default
- `frame-ancestors 'none'` → no iframe embedding
- `object-src 'none'` → no Flash/plugin
- `upgrade-insecure-requests` → forza HTTPS
- `block-all-mixed-content` → blocca contenuti HTTP

In dev locale potrebbe dare warning di sicurezza per HMR; in produzione tutto pulito.
