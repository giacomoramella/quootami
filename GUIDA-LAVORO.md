# Guida — Lavorare sul sito Quootami con Claude

## 1. Il flusso base in 3 mosse

1. **Tu mi dici cosa vuoi cambiare** (in italiano, senza tecnicismi)
2. **Io modifico i file** nella tua cartella `~/Desktop/quotami`
3. **Tu lanci il deploy** copiando il comando che ti do nel Terminal

Aspetta 30 secondi dopo il push, poi apri il sito con **Cmd+Shift+R** per vedere le modifiche.

---

## 2. Come pubblicare le modifiche (Terminal)

### Comando standard di deploy

Apri Terminal e incolla:

```
cd ~/Desktop/quotami && rm -f .git/index.lock && find .git -name "*.lock" -delete && git add -A && git commit -m "descrizione modifiche" && git push
```

Sostituisci "descrizione modifiche" con un breve testo (es. "aggiornata sezione coperture casa").

### Alternativa: doppio-click

Nella cartella `quotami` c'è il file **`deploy.command`** — doppio-click e fa tutto da solo. Se macOS blocca al primo lancio, tasto destro → Apri → conferma.

### Se vedi errori 500 da GitHub

Aspetta 1-2 minuti e riprova. Sono outage temporanei di GitHub, non problemi del tuo codice.

### Se vedi `! [remote rejected]` o conflitti

```
cd ~/Desktop/quotami && git pull --rebase origin main && git push
```

---

## 3. Come scrivere richieste efficaci

### ✅ Buone richieste

> "Su polizza-auto, cambia il titolo in 'Quootami l'RC giusta'"

> "Sotto la sezione coperture aggiungi un blocco con 3 vantaggi colorati"

> "Elimina la frase '€261 risparmio medio' nella sezione benefits"

> "Sposta il blocco 'vantaggi fiscali' subito dopo l'hero su piano-pensione"

> "Le card devono essere centrate e con la stessa dimensione su tutte e 3 le pagine prodotto"

### ❌ Richieste da evitare

> "Fai bene tutto" — troppo vago

> "Cambia il sito" — quale parte?

> "Metti i colori" — quali colori, dove?

**Regola d'oro**: dimmi 1) su quale pagina, 2) quale sezione, 3) cosa vuoi che cambi.

---

## 4. Pagine del sito

| File | Pagina | URL |
|---|---|---|
| `index.html` | Home | `/` |
| `polizza-auto.html` | RC Auto | `/polizza-auto` |
| `polizza-casa.html` | Casa | `/polizza-casa` |
| `salute.html` | Salute & Vita | `/salute` |
| `cyber.html` | Cyber | `/cyber` |
| `piano-pensione.html` | Pensione | `/piano-pensione` |
| `polizza-animali.html` | Cane/Gatto | `/polizza-animali` |
| `rc.html` | RC e Catastrofale PMI | `/rc` |
| `contatti.html` | Contatti | `/contatti` |
| `privacy.html` | Privacy | `/privacy` |
| `cookie.html` | Cookie policy | `/cookie` |
| `trasparenza.html` | Trasparenza IVASS | `/trasparenza` |
| `landing-pensione.html` | Landing page pensione (non in menu) | `/landing-pensione` |

---

## 5. Identità visiva del sito

### Colori principali
- **Giallo highlight** (`--yellow` #FFD84D) — usato sotto la parola "accent" nei titoli
- **Navy scuro** (`--primary` #0B1220) — testi e bottoni
- **Verde scuro** (`--green-dark` #1a7a4a) — link e accenti

### Palette card colorate (categorie)
- Verde acqua `#2A9D8F` — famiglia, deduzione, persone
- Azzurro `#4A9EBA` — acqua, finanza
- Terracotta `#E76F51` — incendio, urgenza
- Viola `#8E5BB5` — eventi naturali, catastrofi
- Ambra/oro `#E9B440` — legale, premio, denaro
- Navy `#264653` — sicurezza, RC
- Verde oliva `#5B8B3F` — assistenza

### Stile titoli H1
Tutti uguali: testo nero + **barra gialla sotto la parola accent**. Esempio: `Quootami l'RC <span class="hero-accent">giusta.</span>`

### Voce del sito
Terza persona — non si dice "io" o "una persona". Si parla di "Quootami", "il broker", o si usano forme impersonali ("verrai contattato", "Quootami ti segue"). Eccezione: pagine legali (privacy, cookie, trasparenza) — qui per obbligo IVASS la prima persona è richiesta.

---

## 6. Cosa NON modificare senza pensarci

- **Disclaimer legale nel footer** (paragrafo con RUI, IVASS, P.IVA, broker Sisto): obbligatorio per legge
- **Pagina `trasparenza.html`**: obblighi IVASS art. 35 Reg. 40/2018
- **`privacy.html`** e **`cookie.html`**: GDPR — modificare solo per allinearle a quello che il sito effettivamente fa
- **`vercel.json`**: contiene gli header di sicurezza CSP — toccare solo per aggiungere domini autorizzati (es. nuovi servizi esterni)

---

## 7. Form e ricezione richieste

Tutti i form (preventivo + contatti) inviano via **Web3Forms** a `giacomo.rp@sistoassicurazioni.com`.

- Access key: `227eeb26-f8e1-4eba-8b60-5969ab33c2c7`
- Se uno smette di funzionare, prima cosa: provare a inviare e leggere il "Dettaglio tecnico" nel box rosso che appare

---

## 8. File importanti

- **`style.css`** — Stili globali condivisi (nav, footer, FAQ, form-feedback)
- **`components.js`** — Comportamenti condivisi (mega-menu, hamburger, WhatsApp button)
- **`vercel.json`** — Configurazione deploy + header di sicurezza
- **`assets/`** — Immagini (foto profilo, logo Sisto)
- **`deploy.command`** — Script per pushare con doppio-click
- **`README.md`** — Note del repository

---

## 9. Domini e deploy

- **Repository GitHub**: https://github.com/giacomoramella/quotami
- **URL live**: https://quotami-it.vercel.app
- **Deploy automatico**: ogni `git push` su `main` triggera Vercel (in ~30 secondi è online)

---

## 10. Cose tipiche che chiedi

| Vuoi... | Esempio richiesta |
|---|---|
| Cambiare un titolo | "Cambia il titolo di [pagina] con 'Nuovo testo'" |
| Eliminare una sezione | "Elimina la sezione [titolo della sezione]" |
| Spostare un blocco | "Sposta [blocco] sotto a [altro blocco]" |
| Cambiare colori | "Metti la palette colorata anche sulla pagina X" |
| Aggiungere contenuti | "Sotto a [sezione] metti un blocco con X, Y, Z" |
| Aggiornare dati | "I numeri non sono veri, dammi alternative" |
| Pulizia generale | "Semplifica i testi di [sezione], sono troppo lunghi" |

---

## Quick reference comando deploy

```
cd ~/Desktop/quotami && rm -f .git/index.lock && find .git -name "*.lock" -delete && git add -A && git commit -m "modifica" && git push
```

Buon lavoro!
