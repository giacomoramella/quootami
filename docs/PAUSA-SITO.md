# Pausa del sito — come si spegne e come si riaccende

Il sito è in pausa dal **07/09/2026**. Ogni URL risponde 200 con la pagina
`/manutenzione` e tutto il sito è fuori dai motori di ricerca.

L'interruttore è uno: **`MANUTENZIONE` in `config/manutenzione.ts`**.

## Cosa succede quando vale `true`

| File | Effetto |
|---|---|
| `proxy.ts` | riscrive ogni richiesta di pagina su `/manutenzione`, con `X-Robots-Tag: noindex, nofollow` |
| `app/layout.tsx` | rende solo la pagina: niente Nav, Footer, banner cookie, dati strutturati |
| `config/seo.ts` | `robots: noindex, nofollow` nei metadata di ogni pagina |
| `app/sitemap.ts` | sitemap servita ma vuota |
| `next.config.js` | `X-Robots-Tag: noindex, nofollow` su tutte le risposte — **non legge il flag**, vedi sotto |

Restano raggiungibili di proposito, perché il matcher del proxy salta i path
con estensione: `/robots.txt`, `/sitemap.xml`, `/firma-allianz.html` (il modulo
di adesione Allianz, che potrebbe servire a una pratica già avviata) e gli
asset statici.

## Perché non si blocca robots.txt

Sembrerebbe la mossa ovvia, ed è quella sbagliata. `Disallow` impedisce a
Google di **scaricare** la pagina; ma senza scaricarla non può leggerci dentro
il `noindex`, e l'URL resta nei risultati — con lo snippet vecchio, anche per
mesi. Per uscire dall'indice bisogna lasciare passare il crawler e dirgli
`noindex` dalla pagina: è esattamente quello che fa questa configurazione.

## Tempi

Il `noindex` non è istantaneo: Google deve ripassare pagina per pagina.
Giorni per la home, qualche settimana per la coda lunga. Se serve sparire in
poche ore, l'unico strumento è la **Rimozione temporanea** in Google Search
Console (dura circa 6 mesi) e l'equivalente in Bing Webmaster Tools — sono
azioni manuali sui rispettivi account, non si automatizzano da qui.

## Come riaccendere

1. `config/manutenzione.ts` → `export const MANUTENZIONE = false;`
2. `next.config.js` → rimettere `{ key: 'X-Robots-Tag', value: 'index, follow' }`.
   **Questo è l'unico punto che non segue il flag**: il file è CommonJS e non
   può importare un modulo TypeScript. Se lo si dimentica, il sito torna online
   ma resta invisibile ai motori.
3. Commit e push su `next`.
4. Verificare che l'header sia tornato a posto:
   ```bash
   curl -sI https://www.quootami.it/ | grep -i x-robots-tag
   ```
5. In Search Console: reinviare la sitemap e chiedere l'indicizzazione della
   home e delle pagine prodotto. Se era stata usata la Rimozione temporanea,
   annullarla, altrimenti resta attiva per i mesi rimanenti.

## Cosa costa la pausa

Uscire dall'indice azzera il posizionamento costruito finora. Al rientro le
pagine ripartono dalla coda: rientrare nelle stesse posizioni richiede
settimane, e non è garantito. È il prezzo da mettere in conto e va confrontato
con il motivo per cui il sito è stato messo in pausa.
