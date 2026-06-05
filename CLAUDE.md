# CLAUDE.md — Istruzioni per Claude Code

Questo file viene letto **automaticamente** da Claude Code ogni volta che operi in questa cartella. Le regole qui dentro vanno seguite **sempre**.

---

## Contesto del progetto

Questo è il sito web del broker assicurativo **Quootami** (Giacomo Ramella Pollone, RUI sez. E n. E000821549, collaboratore di Sisto Assicurazioni S.a.s.). Sito statico HTML+CSS+JS, deployato su Vercel da GitHub.

URL produzione: `https://quootami-it.vercel.app`
Repository: `https://github.com/giacomoramella/quootami`

Prima di modificare qualsiasi cosa, leggi:
1. `GUIDA-LAVORO.md` — convenzioni stile, struttura, palette colori
2. `AUDIT-SICUREZZA.md` — stato sicurezza, header HTTP, CSP

---

## Regole inderogabili

### 1. Sicurezza — controllo dopo OGNI modifica

Dopo ogni modifica sostanziale, prima di proporre il push, fai questo check:

- [ ] **`vercel.json` non è stato indebolito**: tutti gli header in `AUDIT-SICUREZZA.md` sono ancora presenti
- [ ] **CSP non allentata**: se aggiungi una nuova risorsa esterna (CDN, API, iframe), verifica che il dominio sia stato aggiunto al direttiva CSP corretta (`script-src`, `connect-src`, `frame-src`, `img-src`, `font-src`, `style-src` o `form-action`)
- [ ] **Nessuna nuova `<script>` da CDN non whitelisted** — se serve una libreria esterna, prima discutila con l'utente
- [ ] **Nessuna `eval()`, `Function()`, `setTimeout` con stringa** introdotta
- [ ] **Nessun `dangerouslySetInnerHTML` o `innerHTML = userInput`** (XSS)
- [ ] **Nessun token/segreto/api-key nuovo** committato in chiaro nel codice (eccezione documentata: l'access_key Web3Forms `227eeb26-f8e1-4eba-8b60-5969ab33c2c7` è pubblica per design del servizio)
- [ ] **`form-action` CSP ancora restrittiva**: tutti i nuovi form puntano solo a `'self'`, `https://wa.me`, `https://api.web3forms.com`
- [ ] **`X-Frame-Options: DENY` ancora attivo**
- [ ] **HSTS preload ancora attivo**

Se uno qualunque di questi punti è stato indebolito, **avvisa l'utente** prima di chiedere il push.

### 2. Dopo ogni deploy, fai test automatico

Quando l'utente conferma di aver pushato, suggerisci di testare:

- `https://securityheaders.com/?q=quootami-it.vercel.app` (target: **A+**)
- `https://observatory.mozilla.org/analyze/quootami-it.vercel.app` (target: **A+**)

Se uno scende sotto A, **investiga prima di fare altre modifiche**.

### 3. Cosa NON modificare senza spiegare e chiedere

- **`vercel.json`** — toccare solo per aggiungere domini autorizzati a CSP. Mai rimuovere header esistenti
- **Disclaimer legale nel footer** (paragrafo con RUI, IVASS, P.IVA, broker Sisto) — obbligatorio per legge IVASS art. 35 Reg. 40/2018
- **`trasparenza.html`** — pagina obbligatoria IVASS
- **`privacy.html`** e **`cookie.html`** — possono essere aggiornate solo per allinearle a cosa il sito effettivamente fa
- **Web3Forms `access_key`** — non rimuoverla né cambiarla senza approvazione esplicita
- **Access keys, token, password** — non introdurne mai di nuove in chiaro nel codice

### 4. Convenzioni di stile (da NON rompere)

- **Voce**: terza persona o impersonale. Mai "io", "una persona", "persona fisica". Eccezione: pagine legali (privacy, cookie, trasparenza) dove la prima persona è richiesta per identificazione IVASS
- **Titoli H1**: tutti con stessa dimensione `clamp(3rem, 6.5vw, 5.8rem)` e barra gialla sotto la parola accent (`<span class="hero-accent">` o `<span class="accent">`)
- **Palette card colorate**: usare i 6-8 colori già definiti (vedi GUIDA-LAVORO.md sezione 5)
- **Niente emoji nei titoli o nelle card** dove non già presenti (lo stile attuale è sobrio)
- **Niente claim non realistici** (es. "risparmio medio €261", "rendimento 4.2%") — il sito è di un broker neutrale, non vende numeri inventati

### 5. Flusso di lavoro

1. **Capisci la richiesta**. Se ambigua, chiedi prima di modificare
2. **Identifica i file da toccare**. Mostrali all'utente prima di iniziare
3. **Modifica**
4. **Esegui il check sicurezza** della sezione 1
5. **Proponi il messaggio di commit** specifico (non "modifiche generiche")
6. **Dai all'utente il comando esatto** da incollare in Terminal per push

### 6. Email di ricezione form

Tutti i form di richiesta preventivo + contatti devono inviare a:
`giacomo.rp@sistoassicurazioni.com`
tramite Web3Forms con access_key `227eeb26-f8e1-4eba-8b60-5969ab33c2c7`.

Se aggiungi un nuovo form, usa lo stesso schema. Vedi `polizza-auto.html` o `contatti.html` come esempio.

### 7. Privacy / GDPR

Ogni form **DEVE avere**:
- Una checkbox di consenso GDPR obbligatoria
- Link a `privacy.html`
- Spiegazione di cosa succede ai dati (a chi vengono inviati)

Se aggiungi un nuovo strumento di tracciamento (analytics, pixel, cookie), **avvisa l'utente** che bisogna:
1. Aggiornare `privacy.html` e `cookie.html`
2. Probabilmente aggiungere un cookie banner
3. Aggiornare CSP `connect-src`

### 8. Commit messages

Formato preferito:
```
<area>: <cosa è cambiato>

Esempi:
- polizza-auto: rimossa sezione benefits con dati inventati
- sicurezza: aggiunti COOP/CORP/permissions-policy estesa
- cyber: 4 vantaggi colorati sotto 'cosa puoi proteggere'
- linguaggio: terza persona/Quootami su tutte le pagine commerciali
```

---

## Quick commands

### Deploy (incollare in Terminal):

```bash
cd ~/Desktop/quootami && rm -f .git/index.lock && find .git -name "*.lock" -delete && git add -A && git commit -m "descrizione" && git push
```

### Verifica sicurezza headers live:

```bash
curl -sI https://quootami-it.vercel.app/ | grep -iE "strict-transport|content-security|x-frame|x-content-type|referrer|permissions|cross-origin"
```

### Lista file principali:

- `index.html` — Home
- `polizza-*.html` — Pagine prodotto privati
- `cyber.html`, `salute.html`, `piano-pensione.html`, `rc.html` — altre prodotto
- `contatti.html` — Contatti + mappa + form
- `privacy.html`, `cookie.html`, `trasparenza.html` — Pagine legali (toccare con attenzione)
- `style.css` — Stili globali
- `components.js` — JS condiviso (nav, hamburger, WhatsApp button)
- `vercel.json` — Header sicurezza + cache (CRITICO)
- `assets/` — Immagini

---

## Comportamento atteso da Claude Code

Quando lavori in questa cartella:
- **Prima di iniziare un task complesso**, conferma di aver letto questo file
- **Dopo ogni modifica**, ripeti mentalmente la checklist sicurezza della sezione 1
- **Prima di proporre il push**, esplicita all'utente che hai fatto il check
- **Se l'utente chiede di indebolire la sicurezza** (es. "togli CSP", "rimuovi HSTS"), avvisa esplicitamente che è sconsigliato e chiedi conferma

Lo standard è **A+ su securityheaders.com e Mozilla Observatory**, sempre.

---

*Ultimo aggiornamento: 25 maggio 2026*
