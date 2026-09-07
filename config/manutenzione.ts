/**
 * Quootami — Interruttore della pausa del sito
 * ============================================================
 * `true`  → ogni URL risponde con la pagina "in manutenzione", il sito esce
 *           dai motori di ricerca (noindex) e Nav/Footer/banner cookie non
 *           vengono renderizzati.
 * `false` → il sito torna com'era, senza altre modifiche.
 *
 * Chi tocca cosa quando questo vale `true`:
 *   • proxy.ts          → riscrive ogni richiesta di pagina su /manutenzione
 *   • app/layout.tsx    → niente Nav, Footer, cookie banner e dati strutturati
 *   • config/seo.ts     → robots: noindex, nofollow su tutte le pagine
 *   • app/sitemap.ts    → sitemap vuota
 *
 * ATTENZIONE — c'è un secondo punto da cambiare A MANO, perché
 * `next.config.js` è CommonJS e non può importare questo file TypeScript:
 * l'header `X-Robots-Tag` in `next.config.js` va rimesso su `index, follow`
 * quando si riapre. Il commento lì lo ricorda.
 *
 * Vedi docs/PAUSA-SITO.md per la procedura completa di riapertura.
 */
export const MANUTENZIONE = true;
