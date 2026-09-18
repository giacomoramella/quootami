# Landing luce e gas — specifica

Pagina di **lista d'attesa** per il verticale energia. Non è il comparatore: è
ciò che va online adesso, mentre gli accordi con i fornitori sono in trattativa.

Codice pronto e archiviato:
- `archivio/luce-e-gas/app-luce-e-gas/page.tsx`
- `archivio/luce-e-gas/components/ListaAttesaLuceGas.tsx`
- `archivio/luce-e-gas/supabase/en-waitlist.sql`

*Ultimo aggiornamento: 7 settembre 2026.*

---

## Perché serve, e perché adesso

Il 07/09/2026 sono partite le mail di apertura a NeN, E.ON, Iren e Sorgenia
(vedi `OUTREACH-FORNITORI-2026-09.md`), in cui si dichiara che Quootami sta
aprendo la comparazione energia. La prima cosa che fa chi le riceve è aprire il
sito: se non trova traccia del verticale, la conversazione finisce lì.

Lo stesso vale per **Awin**, che valuta il sito del publisher prima di approvare
la candidatura al programma Sorgenia. `TARGET-FORNITORI-FASE1.md` dava per
soddisfatto il prerequisito "sito già online con contenuto credibile sul tema
energia": **dal 07/09/2026 non è più vero**, perché il verticale è archiviato.
Questa pagina lo rimette in piedi.

---

## Cosa deve fare

- dire con chiarezza che il servizio sta partendo e che i fornitori sono in
  selezione;
- raccogliere contatti con consenso esplicito, granulare e **dimostrabile**;
- mostrare chi c'è dietro: nome, iscrizione RUI, struttura di appoggio;
- esistere a un URL stabile da mettere nelle mail e nella candidatura Awin.

## Cosa non deve fare, mai

- simulare un confronto prezzi che oggi non è possibile: senza mandati è una
  comparazione finta, cioè una pratica commerciale scorretta;
- mostrare loghi o nomi di fornitori con cui non c'è un accordo firmato —
  contestabile, e brucia proprio le aziende con cui si sta trattando;
- promettere risparmi in euro o in percentuale;
- chiedere codice fiscale, POD, PdR o IBAN: in fase di lista non servono e
  alzano l'attrito;
- avere caselle di consenso pre-spuntate o un consenso unico cumulativo.

La leva onesta è già la più forte: siamo gli unici a dichiarare che non facciamo
chiamate a freddo, in un mercato dove da aprile 2026 è illegale farle.

---

## Struttura

1. **Apertura** — nessun hero a tutto schermo. Titolo, una riga di contesto, il
   form subito visibile o a un pollice di distanza su mobile. Chi arriva ha una
   bolletta in mano, non voglia di leggere.
2. **Form** — il cuore della pagina, l'unica cosa che deve funzionare
   perfettamente.
3. **Come funziona** — tre passaggi, una riga ciascuno.
4. **Chi c'è dietro** — non è per l'utente, è per il fornitore e per chi valuta
   la candidatura Awin. Un comparatore anonimo non lo approva nessuno.
5. **FAQ** — cinque domande. L'ultima ("quando partite davvero") merita una
   risposta onesta con un periodo indicativo: l'ambiguità costa più di un
   ritardo dichiarato.
6. **Footer legale** — informativa raggiungibile dal form senza uscire dalla
   pagina.

---

## Campi del form

Sei campi. Ogni campo in più costa contatti.

| Campo | Tipo | Stato | Perché |
|---|---|---|---|
| Fornitura | luce / gas / entrambe | obbligatorio | determina a quale fornitore ha senso girarlo |
| CAP | 5 cifre | obbligatorio | ambito territoriale e distributore di zona |
| Spesa mensile | fasce + "non lo so" | facoltativo | a fasce, non a cifra esatta: nessuno sa quanto spende al centesimo, e obbligarlo a saperlo fa abbandonare |
| Nome | testo | obbligatorio | solo il nome, non nome e cognome separati |
| Email | validata | obbligatorio | è il canale con cui si mantiene la promessa |
| Telefono | testo | facoltativo | "solo se preferisci che ti chiamiamo noi" — coerente con la promessa di non chiamare a freddo, e distingue da chiunque altro |

---

## Consensi

Quattro caselle distinte, **nessuna pre-spuntata**. Il secondo è quello che vale:
senza, il contatto non è cedibile a nessun fornitore e il canale venduto nelle
mail non esiste.

| Casella | Stato | Nota |
|---|---|---|
| Contatto | obbligatorio | senza, il servizio non può essere erogato |
| **Comunicazione ai fornitori** | **facoltativo ma decisivo** | formalmente facoltativo; va reso evidente e spiegato in una riga, non nascosto fra gli altri |
| Marketing | facoltativo | nessuna conseguenza sul servizio |

I testi vivono in `TESTI_CONSENSO` dentro `ListaAttesaLuceGas.tsx`, non nel JSX:
sono ciò che viene versionato, e tenerli in un posto solo rende evidente quando
cambiano.

---

## La parte che tutti saltano: la prova del consenso

Per ogni invio vanno salvati, oltre ai dati:

| Dato | A cosa serve |
|---|---|
| timestamp | data e ora dell'invio |
| indirizzo IP | prova di provenienza — **preso lato server** dagli header nella RPC, non passato dal client: un IP scritto dal client non prova niente |
| user-agent | completa la prova tecnica |
| **versione dei testi** | il più importante e il più dimenticato: se fra un anno il testo cambia, bisogna poter dimostrare cosa aveva accettato quel contatto (art. 7.1 GDPR) |
| tre consensi separati | booleani distinti, mai uno cumulativo |
| sorgente | UTM e referrer: serviranno fra tre mesi per dire agli incumbent da dove arriva il traffico |

Il primo fornitore che firma chiede come si dimostra il consenso, e "la casella
era spuntata" non è una risposta. Costruirlo adesso con dieci contatti costa
un'ora; rifarlo dopo con duemila significa buttarli.

**Regola operativa:** `INFORMATIVA_VERSIONE` in `ListaAttesaLuceGas.tsx` deve
restare allineata a quella dichiarata in `app/privacy/page.tsx`. Se cambia anche
una sola parola dei consensi, si incrementa `CONSENSI_VERSIONE`. Non riusare mai
una versione vecchia per un testo nuovo.

---

## Prima di pubblicare

1. **Informativa privacy** — già fatta. La versione 2.0 del 07/09/2026 copre il
   verticale energia: perimetro fuori RUI/IVASS, dati del modulo, base giuridica
   del confronto, consenso distinto per la comunicazione, fornitori come titolari
   autonomi.
2. **Scegliere il periodo di partenza** da scrivere nelle FAQ. Una data
   dichiarata e rispettata vale più di un "presto" che non impegna nessuno.
3. **Applicare `en-waitlist.sql`** su Supabase (progetto `ivcdwizhkdubjxxrukbs`).
4. **Spostare i due file** da `archivio/` alle rispettive cartelle, sistemare
   `next.config.js`, `Nav.tsx`, `app/sitemap.ts` e `app/mappa-sito/page.tsx`.
5. **Poi** iscriversi ad Awin e mandare l'URL nel follow-up del 15 settembre.

Il comparatore vero (`ComparatoreLuce.tsx`) resta archiviato finché non c'è
almeno un mandato firmato.
