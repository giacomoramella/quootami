# Pausa del sito — come si spegne, come si riaccende

Il sito è in pausa dal **07/09/2026**. Ogni URL risponde **503 Service
Unavailable** con una pagina di cortesia.

L'interruttore è uno: **`MANUTENZIONE` in `config/manutenzione.ts`**.

## Perché 503 e non `noindex`

Sembrano la stessa cosa e sono opposte. È la decisione più importante di questa
configurazione, quindi vale la pena fissarla.

| | `noindex` | `503 + Retry-After` |
|---|---|---|
| Cosa dice a Google | «togli queste pagine dall'indice» | «non disponibile adesso, ripassa» |
| Il sito nelle ricerche | sparisce in giorni/settimane | resta visibile, col vecchio risultato |
| Posizionamento | perso, si riparte da capo | congelato, si ritrova al rientro |
| Riapertura | riscoperta e riposizionamento, settimane | immediata |
| Quando ha senso | chiusura vera, o si deve sparire | fermo temporaneo con rientro previsto |

Qui serve il secondo: il sito deve tornare online con la stessa visibilità di
prima. Il prezzo accettato è che chi cerca il marchio continua a vedere un
risultato e, cliccandolo, trova la pagina di manutenzione.

## Il limite da non superare

**Una o due settimane.** Il 503 protegge il posizionamento finché Google lo
considera temporaneo; oltre quella soglia comincia comunque a togliere le
pagine — con l'aggravante che non l'abbiamo deciso noi e non sappiamo quando
succede. Se la pausa si allunga oltre il mese, la strada giusta non è più il
503: meglio pubblicare una pagina sola vera e propria (una landing con i
contatti, indicizzabile) e lasciare che sia quella a tenere il dominio vivo.

Data di inizio in `PAUSA_DAL`, dentro `config/manutenzione.ts`.

## Cosa succede quando `MANUTENZIONE` vale `true`

Tocca **solo `proxy.ts`**: intercetta ogni richiesta di pagina e restituisce la
cortesia con status 503, `Retry-After: 86400` e `Cache-Control: no-store` —
così alla riapertura nessuna copia resta appesa in CDN o nei browser.

Metadata, sitemap, `robots.txt` e header di indicizzazione restano **quelli del
sito normale**, di proposito: una sitemap vuota o un `noindex` direbbero a
Google che le pagine non ci sono più, che è l'opposto di ciò che vogliamo.

Restano raggiungibili, perché il matcher del proxy salta i percorsi con
estensione: `/robots.txt`, `/sitemap.xml`, `/firma-allianz.html` (può servire a
un'adesione già avviata) e gli asset statici.

## Come riaccendere

1. `config/manutenzione.ts` → `export const MANUTENZIONE = false;`
2. Commit e push su `next`. **Non c'è altro da toccare.**
3. Verificare che il sito risponda 200 e resti indicizzabile:
   ```bash
   curl -sI https://www.quootami.it/ | grep -iE "^HTTP|x-robots-tag|retry-after"
   ```
   Atteso: `HTTP/2 200`, `X-Robots-Tag: index, follow`, nessun `Retry-After`.
4. In Search Console non serve fare nulla: con il 503 le pagine non sono mai
   uscite dall'indice. Se si vuole accelerare, si può chiedere l'indicizzazione
   della home, ma è un di più.

## Verifica che la pausa stia funzionando

```bash
curl -sI https://www.quootami.it/polizza-auto | grep -iE "^HTTP|retry-after|x-robots-tag"
```

Atteso: `HTTP/2 503`, `Retry-After: 86400`, e `X-Robots-Tag: index, follow` —
quest'ultimo **è giusto così**: durante un fermo temporaneo non si dice a Google
di deindicizzare.

## Nota

`app/manutenzione/page.tsx` è un residuo della prima versione della pausa, che
serviva la cortesia come route React. Ora rimanda alla home e si può cancellare
quando fa comodo (`rm -r app/manutenzione`).
