import { OPERATORE } from './operatore';

/**
 * Quootami — Pausa del sito
 * ============================================================
 * `true`  → ogni URL risponde **503 Service Unavailable** con la pagina di
 *           cortesia qui sotto.
 * `false` → il sito torna com'era, senza altre modifiche.
 *
 * Perché 503 e NON `noindex`
 * --------------------------
 * Sembrano la stessa cosa e sono opposte.
 *
 * `noindex` dice a Google «togli queste pagine dall'indice»: le toglie davvero,
 * e alla riapertura si riparte da capo — riscoperta, rivalutazione,
 * riposizionamento. Settimane, senza garanzia di tornare dov'eravamo.
 *
 * `503` dice «non disponibile adesso, ripassa»: è la risposta prevista per il
 * fermo pianificato. Google mantiene gli URL nell'indice e congela le
 * posizioni, quindi alla riapertura ritrova tutto al suo posto. È la scelta
 * giusta quando il sito deve tornare online con la stessa visibilità di prima.
 *
 * Il prezzo del 503 è che il sito **resta nei risultati di ricerca**: chi cerca
 * il marchio vede ancora il vecchio risultato e, cliccando, trova questa
 * pagina. Non si sparisce, ci si ferma. Chi invece deve sparire dalle ricerche
 * deve accettare di perdere il posizionamento, e allora serve `noindex`.
 *
 * DURATA — questo è il limite da non superare
 * -------------------------------------------
 * Il 503 protegge il posizionamento per una pausa **breve**: indicativamente
 * una o due settimane. Oltre, Google smette di considerarlo temporaneo e
 * comincia comunque a togliere le pagine, con l'aggravante di non averlo
 * chiesto noi. Se la pausa si allunga, va ripensata (vedi docs/PAUSA-SITO.md).
 *
 * Chi tocca cosa: solo `proxy.ts`. Metadata, sitemap, robots.txt e header
 * restano quelli del sito normale — di proposito: una sitemap vuota o un
 * `noindex` direbbero a Google che le pagine non ci sono più.
 */
export const MANUTENZIONE = true;

/** Data di inizio della pausa, per sapere quando si sta sforando. */
export const PAUSA_DAL = '2026-09-07';

/**
 * Secondi dopo i quali invitare i crawler a ritentare (header `Retry-After`).
 * 86400 = un giorno: prudente con una durata ancora da definire, perché non
 * sollecita il ricrawl ogni ora ma nemmeno lascia il sito fermo per settimane
 * senza che nessuno ripassi.
 */
export const RETRY_AFTER_SECONDI = 86400;

/**
 * Pagina di cortesia, come documento HTML completo.
 *
 * Sta qui e non in una route React perché una pagina dell'App Router non può
 * scegliere il proprio status HTTP, e il 503 è l'unica parte che conta davvero
 * per il posizionamento. Il proxy la restituisce così com'è, con lo status
 * giusto, per qualunque indirizzo.
 *
 * Niente script: solo CSS inline, autorizzato dalla CSP (`style-src` ammette
 * 'unsafe-inline'). Nessun font remoto: si usa lo stack di sistema, così la
 * pagina non dipende da nulla.
 *
 * I recapiti ci sono di proposito: il sito è fermo, l'attività no, e chi ha una
 * pratica in corso deve poter raggiungere l'intermediario. Sono recapiti nudi
 * con l'iscrizione RUI — nessun prodotto, nessun claim: non è un messaggio
 * pubblicitario ai sensi dell'art. 35 Reg. IVASS 40/2018.
 */
export function htmlManutenzione(): string {
  const { brand, contatti, collaboratore, broker } = OPERATORE;
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>Sito in manutenzione · ${brand.name}</title>
<style>
  :root { --giallo: #FFD84D; --ink: #0B1220; --ink-muted: #5A6473; --bg: #FAFAF7; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg); color: var(--ink);
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 2.5rem 1.25rem; line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  .wrap { width: 100%; max-width: 34rem; text-align: center; }
  .marchio { font-weight: 700; font-size: 1.05rem; letter-spacing: -.01em; }
  .marchio span { color: #B58900; }
  h1 {
    margin-top: 2.5rem; font-weight: 700; letter-spacing: -.025em; line-height: 1.1;
    font-size: clamp(2rem, 7vw, 3rem);
  }
  h1 .hl { position: relative; display: inline-block; z-index: 1; white-space: nowrap; }
  h1 .hl::before {
    content: ''; position: absolute; left: -4px; right: -4px; top: 58%; bottom: 6%;
    background: var(--giallo); z-index: -1;
  }
  .sub { margin-top: 1.4rem; font-size: 1.05rem; color: var(--ink-muted); }
  .sep { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(11,18,32,.08); }
  .sep p { font-size: .9rem; color: var(--ink-muted); }
  .contatti { margin-top: 1rem; display: flex; flex-wrap: wrap; gap: .6rem; justify-content: center; }
  .contatti a {
    display: inline-block; padding: .7rem 1.4rem; border-radius: 999px;
    border: 1px solid rgba(11,18,32,.12); background: #fff;
    color: var(--ink); text-decoration: none; font-weight: 600; font-size: .95rem;
  }
  .contatti a:hover { border-color: var(--ink); }
  .legale { margin-top: 2rem; font-size: .75rem; color: var(--ink-muted); }
</style>
</head>
<body>
  <main class="wrap">
    <p class="marchio">${brand.name}<span>.</span></p>
    <h1>Sito in <span class="hl">manutenzione.</span></h1>
    <p class="sub">Stiamo lavorando a una nuova versione. Il servizio tornerà online a breve.</p>
    <div class="sep">
      <p>Nel frattempo, per chi ha già una pratica in corso:</p>
      <div class="contatti">
        <a href="tel:${contatti.telefono_tel}">${contatti.telefono_display}</a>
        <a href="mailto:${contatti.email}">Scrivi una email</a>
      </div>
      <p class="legale">
        ${collaboratore.nome_completo} — iscritto al RUI sez. ${collaboratore.rui_sezione}
        n. ${collaboratore.rui_numero}, per conto di ${broker.ragione_sociale_breve}
        (RUI sez. ${broker.rui_sezione} n. ${broker.rui_numero}).
      </p>
    </div>
  </main>
</body>
</html>`;
}
