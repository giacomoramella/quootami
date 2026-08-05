# Fase 1 — lista operativa dei fornitori da contattare

Documento di lavoro. Deriva da `PROSSIMI-PASSI-PARTNERSHIP-FORNITORI.md` (la strategia)
e dai 92 fornitori censiti in `en.suppliers` (seed in `supabase/seed/en-seed-suppliers.sql`).

Qui c'è **cosa fare, con chi, e da quale porta si entra**. Ogni riga marcata
"verificato" è stata controllata sulla fonte indicata alla data del 5 agosto 2026;
quelle marcate "da verificare" richiedono una telefonata o una mail perché non
esiste un canale pubblico documentato.

---

## Lo stato di partenza

Dei 92 fornitori censiti:

| | |
|---|---|
| già marcati `target` | 6 (A2A, Enel, NeN, Octopus, Plenitude, Sorgenia) |
| tipo `digital` | 55 · `locale` 29 · `incumbent` 8 |
| con onboarding digitale | 28 |
| **con email di contatto** | **3 su 92** |
| **con telefono** | **12 su 92** |

Il problema non è la lista: è che non ha i recapiti. Questo documento colma il buco
sui target di Fase 1.

---

## Scoperta che cambia l'ordine delle mosse

Il documento di strategia dava per scontato che gli **incumbent** (Enel, Plenitude,
A2A) non firmassero con un comparatore piccolo, e li rimandava alla Fase 2.

Non è più vero, o almeno non del tutto: **Plenitude, NeN e Octopus hanno un programma
di affiliazione pubblico sulla rete Awin**, e anche **Enel** ha una campagna di
affiliazione attiva. Una sola registrazione a una rete di affiliazione dà quindi
accesso a tre dei sei target già individuati, incluso un incumbent.

Le reti di affiliazione sono un canale che il documento originale non contemplava e
che va inserito accanto ai quattro esistenti. Sono la via più rapida perché:

- l'accredito è per **publisher**, non richiede mandato di agenzia;
- il tracciamento (link, subid, postback) è fornito dalla piattaforma, quindi risolve
  da solo il punto 5.2 del documento di strategia (registrare la conversione, non
  solo il lead);
- la rendicontazione è automatica, quindi elimina la riconciliazione manuale.

Lo svantaggio è lo stesso delle reti di agenzia: la piattaforma trattiene una quota,
quindi la commissione unitaria è più bassa di un accordo diretto. Resta la mossa
giusta per partire, non quella definitiva.

---

## Priorità 1 — reti di affiliazione (una registrazione, più fornitori)

| Rete | Fornitori energia italiani presenti | Nota |
|---|---|---|
| **Awin** | Eni Plenitude IT, NeN 2025 IT, Octopus Energy IT | verificato — profili advertiser pubblici |
| **FlexOffers** | Octopus Energy IT | verificato |

**Azione:** registrarsi su Awin come publisher indicando quootami.it come sito, poi
candidarsi ai singoli programmi. L'approvazione è per programma, non automatica: serve
che il sito sia già online, con privacy e cookie policy pubblicate e un contenuto
credibile sul tema energia. Entrambe le condizioni sono soddisfatte.

> Awin applica in genere una quota di iscrizione rimborsabile al primo pagamento.
> Verificare l'importo corrente in fase di registrazione.

---

## Priorità 2 — programmi partner diretti (verificati)

### Pulsee — gruppo Axpo
- **Porta d'ingresso:** pagina pubblica "Diventa Business Partner" su pulsee.it
- **Cosa cercano:** partner commerciali con esperienza nel settore energia, per il
  mercato residenziale. Esiste un canale separato Axpo per micro-business e PMI.
- **Nota:** hanno costruito una rete fisica di oltre 200 agenzie sul territorio, quindi
  sono abituati a gestire partner esterni. È il target più adatto a un primo accordo
  diretto.
- **Stato:** verificato · canale di candidatura pubblico

### Wekiwi
- **Porta d'ingresso:** programma **Ambassador** (non il "Passaparola")
- **Perché questa distinzione conta:** il Passaparola riconosce 30 € allo sponsor e
  20 € al segnalato, ma **non viene riconosciuto quando l'adesione arriva da
  intermediari online**. Per un comparatore è quindi inutilizzabile: la via corretta è
  l'accredito come Ambassador, che prevede un portale dedicato, codice sponsor,
  rendiconto dei contratti attivi e compensi ricorrenti.
- **Contatto:** clienti@wekiwi.it
- **Stato:** verificato · attenzione all'esclusione degli intermediari online

### Octopus Energy
- **Doppio canale:** affiliazione professionale via Awin/FlexOffers (priorità 1) oppure
  referral cliente "OctoFriends", 30 € in bolletta a entrambi, senza tetto di
  segnalazioni.
- **Da usare:** il canale affiliazione. Il referral è pensato per i clienti, non per un
  intermediario.
- **Telefono:** 02 385 827 76 (anche WhatsApp), lun-ven 9-17
- **Stato:** verificato

### NeN
- **Porta d'ingresso:** programma di affiliazione su Awin ("NeN 2025 IT").
- **Da non confondere** con "Abbassa la bolletta", che è lo sconto per passaparola fra
  clienti, e con la sezione "Partner" dell'app, che è un catalogo di convenzioni per i
  clienti — nessuno dei due è un canale per intermediari.
- **Telefono:** 800 188 525, lun-ven 9-18
- **Stato:** verificato

### Eni Plenitude
- **Porta d'ingresso:** programma di affiliazione su Awin, remunerazione a lead.
- **Stato:** verificato · è l'incumbent più accessibile

---

## Priorità 3 — da verificare con contatto diretto

Per questi non risulta un programma partner pubblicamente documentato: serve una mail
o una telefonata all'ufficio commerciale.

| Fornitore | Tipo | Perché è in lista |
|---|---|---|
| **Sorgenia** | digital | già marcato `target`, nessun programma partner pubblico trovato |
| **A2A Energia** | incumbent | già marcato `target`, commissione stimata alta |
| **Illumia** | digital | oltre 1 milione di clienti, indipendente, sede Bologna |
| **Optima Italia** | digital | multiservizi in abbonamento, modello adatto al bundling |
| **Tate** | digital | startup app-based, prezzo trasparente sul PUN |
| **Iberdrola** | digital | gruppo spagnolo, 100% rinnovabile |
| **ABenergie** | digital | indipendente, posizionamento trasparenza e green |
| **Enegan**, **4G Energia**, **Union Gas e Luce**, **Uno Energy** | digital | il censimento li segnala come operatori con **canale agenziale forte**: sono quelli con più probabilità di accettare un segnalatore |

---

## Ordine di esecuzione consigliato

**Settimana 1** — registrazione su Awin e candidatura ai tre programmi energia
(Plenitude, NeN, Octopus). È l'azione con il rapporto risultato/sforzo migliore: una
sola pratica, tre fornitori, tracciamento incluso.

**Settimana 1-2** — candidatura al programma Business Partner di Pulsee e richiesta di
accredito Ambassador a Wekiwi. Sono i due canali diretti con porta d'ingresso
documentata.

**Settimana 2-3** — mail all'ufficio commerciale dei quattro operatori con canale
agenziale dichiarato (Enegan, 4G Energia, Union Gas e Luce, Uno Energy) e dei tre
indipendenti di dimensione media (Illumia, Optima, Tate).

**Dopo i primi contratti attivi** — riaprire con Sorgenia e A2A portando dati reali di
conversione, come previsto dalla Fase 2 del documento di strategia.

---

## Cosa aggiornare nel database quando un accordo si chiude

Per ogni fornitore che firma, in `en.suppliers`:

```sql
update en.suppliers set
  partner_status = 'active',
  commission_note = '<struttura del compenso concordato>',
  signup_url      = '<link tracciato: referral, subid o UTM dedicato>',
  email           = '<referente commerciale>',
  phone           = '<recapito diretto>'
where name = '<nome fornitore>';
```

Il campo che conta davvero è `signup_url`: è quello che collega l'utente del
comparatore al tracciamento del partner. Senza, la commissione non viene attribuita.

Quando i primi accordi saranno attivi va valutata la Edge Function `en-conversion`
prevista al punto 5.2 del documento di strategia, per registrare quando un lead
diventa contratto. Con i programmi su rete di affiliazione questo passaggio è meno
urgente, perché il tracciamento lo fa già la piattaforma.

---

*Ultimo aggiornamento: 5 agosto 2026. Le informazioni sui programmi partner vanno
riverificate prima dell'invio: i canali commerciali cambiano senza preavviso.*
