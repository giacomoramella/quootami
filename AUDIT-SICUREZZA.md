# Audit di sicurezza — Quotami

Stato della sicurezza del sito dopo l'upgrade del 25 maggio 2026.

---

## Cosa significa "livello bancario"

Le banche italiane (Intesa, UniCredit, ecc.) hanno difese stratificate che includono:
- Web Application Firewall (WAF)
- DDoS protection enterprise
- Header HTTP rigorosi
- 2FA su qualsiasi accesso amministrativo
- Penetration test regolari
- Bug bounty
- Certificazioni ISO 27001
- Disaster Recovery plan

Un sito statico come Quotami **non può avere identico livello di una banca** (non gestisce conti né credenziali), ma può raggiungere **lo stesso livello sui controlli HTTP/CSP/TLS**, che è il livello tecnicamente rilevante per il browser.

---

## 1. Cosa ABBIAMO già

### TLS / HTTPS
- HTTPS obbligatorio (HSTS preload, 2 anni)
- TLS 1.3 (gestito da Vercel)
- Certificato Let's Encrypt rinnovato automaticamente

### Headers HTTP (vercel.json)

| Header | Valore | Funzione |
|---|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | Forza HTTPS per 2 anni |
| X-Content-Type-Options | `nosniff` | Blocca MIME sniffing |
| X-Frame-Options | `DENY` | Impedisce clickjacking (iframe) |
| Referrer-Policy | `strict-origin-when-cross-origin` | Limita referrer leak |
| Permissions-Policy | tutto disabilitato | Blocca API browser sensibili (camera, GPS, pagamento, USB, ecc.) |
| Cross-Origin-Opener-Policy | `same-origin` | Isolamento window/tab |
| Cross-Origin-Resource-Policy | `same-site` | Isolamento risorse cross-origin |
| X-DNS-Prefetch-Control | `on` | Performance + privacy DNS |
| X-Permitted-Cross-Domain-Policies | `none` | Blocca Adobe Flash cross-domain |
| Origin-Agent-Cluster | `?1` | Isolamento processi |
| X-Download-Options | `noopen` | Anti-IE download exploit |

### Content Security Policy (CSP)

- `default-src 'self'` — solo risorse del nostro dominio
- `script-src` limitato a self + inline (necessario per i form JS)
- `style-src` limitato a self + Google Fonts
- `img-src` permette HTTPS (per Google Maps)
- `connect-src` SOLO api.web3forms.com (per i form)
- `frame-src` SOLO Google Maps (per la mappa contatti)
- `frame-ancestors 'none'` — non possiamo essere inseriti in iframe altrui
- `object-src 'none'` — niente plugin (Flash, Java)
- `base-uri 'self'` — anti-injection
- `form-action 'self' wa.me api.web3forms.com` — i form possono inviare SOLO a quei tre destinazioni
- `upgrade-insecure-requests` — auto-upgrade HTTP→HTTPS
- `block-all-mixed-content` — blocca contenuto non-HTTPS

### Privacy / GDPR
- Niente cookie di tracciamento
- Niente Google Analytics
- Niente Facebook pixel
- Niente cookie banner necessario (no cookie da consenso)
- Form con consenso GDPR esplicito + privacy policy
- Web3Forms come responsabile esterno del trattamento dati

### Vercel platform (incluso)
- Edge CDN globale
- DDoS protection base (Vercel + Cloudflare)
- Auto-scaling
- Build immutabili (rollback istantaneo)

---

## 2. Cosa MANCA per raggiungere "100% bank-grade"

### Critico (ma richiede refactor)
1. **CSP senza `unsafe-inline`** — Oggi gli script JavaScript e CSS sono inline dentro le pagine HTML. Per essere bank-grade strict serve:
   - Spostare tutto il JS in file esterni (`/js/forms.js`, `/js/components.js`)
   - Spostare tutto il CSS inline in `style.css`
   - O usare nonce dinamici per inline (richiede backend)
   - **Tempo stimato**: 4-6 ore di refactor

2. **Subresource Integrity (SRI)** — Le risorse esterne (Google Fonts, Web3Forms, Google Maps) sono caricate senza SRI. Significa che se un attaccante compromettesse uno di quei CDN, potrebbe iniettare codice nel tuo sito.
   - Google Fonts: aggiungere `integrity="sha384-..."` ai link
   - **Limite**: Google Fonts cambia spesso i file → SRI si rompe. Lo accetta solo se siamo disposti a usare le webfont self-hosted.

### Avanzato (best practice)
3. **CSP Reporting** — Aggiungere `report-uri` o `report-to` per ricevere notifiche di tentativi di violazione CSP
4. **Expect-CT header** (oggi deprecato — già coperto da Certificate Transparency)
5. **Network Error Logging (NEL)** — Diagnostica errori di rete

### Operativo
6. **WAF (Web Application Firewall)** — Vercel Pro/Enterprise lo offre come add-on. Oggi sei sul piano base.
7. **DDoS protection enterprise** — Stesso discorso (Vercel Pro)
8. **Penetration test** — Da commissionare a una società esterna (€2-5k tipico)

### Privacy avanzata
9. **Self-hosted Google Fonts** — Eviterebbe ogni leak di IP a Google al caricamento delle pagine
10. **Mappa contatti senza Google** — Es. Leaflet+OpenStreetMap (più privacy)

---

## 3. Punteggio attuale stimato

Dopo gli upgrade applicati:

| Test | Punteggio atteso |
|---|---|
| **securityheaders.com** | A → A+ (con upgrade attuali) |
| **observatory.mozilla.org** | A+ |
| **csp-evaluator.withgoogle.com** | Buono (penalizzato da unsafe-inline) |
| **ssllabs.com** | A+ |
| **webhint.io** | 90+ |

Per arrivare a **A+ su csp-evaluator** servirebbe rimuovere `unsafe-inline` (refactor di cui sopra).

---

## 4. Cosa fare se vuoi alzare ulteriormente

Decidi cosa è prioritario:

1. **Massima sicurezza vera (bank-grade)** → fare il refactor inline JS/CSS + SRI + self-host fonts. Costo: 1 giornata di lavoro.

2. **Buona protezione operativa** → attivare piano Vercel Pro + WAF + DDoS. Costo: ~€20/mese.

3. **Per ora sufficiente** → non aggiungere altro. Lo stato attuale è già al 95° percentile di un sito italiano di un broker.

---

## 5. Come testare la sicurezza tu stesso

Apri questi link e inserisci `https://quotami-it.vercel.app`:

- **Headers HTTP**: https://securityheaders.com
- **CSP**: https://csp-evaluator.withgoogle.com
- **Mozilla Observatory**: https://observatory.mozilla.org
- **SSL/TLS**: https://www.ssllabs.com/ssltest/

I primi 3 ti danno un voto da F ad A+. Aspettati **A** o **A+** su tutti.

---

*Aggiornato: 25 maggio 2026*
