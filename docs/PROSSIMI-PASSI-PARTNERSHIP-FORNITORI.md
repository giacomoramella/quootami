# Prossimi passi: collegarsi ai fornitori di energia per essere remunerati

Questo documento descrive come trasformare il comparatore `en.confronta.html` da semplice vetrina a canale che genera ricavi, collegandosi ai fornitori luce/gas veri e propri. Non è un lavoro tecnico: è un lavoro commerciale/contrattuale, che poi si traduce in pochi campi da compilare nel DB già pronto (`en.suppliers`: `partner_status`, `commission_note`, `phone`, `email`, `website`, `signup_url`).

## 1. Come funziona il modello di remunerazione

I comparatori di energia in Italia (Facile.it, Selectra/Luce-gas.it, Segugio, SosTariffe) non fanno pagare l'utente finale: sono remunerati dai fornitori solo quando l'utente attiva un contratto tramite il loro canale. Due strutture di compenso comuni nel settore:

- **Commissione/token per attivazione** — importo fisso per ogni contratto attivato e "sopravvissuto" al periodo di ripensamento (spesso con penalità se il cliente disdice entro N mesi — "qualità del contratto").
- **Percentuale sul valore del contratto** — meno comune per il segmento residenziale, più tipico su forniture business/PMI.

Da tenere in conto quando si negozia: soglie minime di volume, over-commission oltre una soglia mensile, ritenute per "storno" in caso di recesso anticipato del cliente.

## 2. Vincoli normativi da rispettare (ARERA + privacy)

Prima di attivare qualunque canale che promuove o conclude contratti per conto di un fornitore, valgono le regole del **Codice di Condotta Commerciale ARERA** (Allegato A delibera 366/2018/R/com, più volte aggiornato, ultimo adeguamento aprile 2026):

- Chi promuove/conclude contratti (anche online) deve dichiarare chiaramente lo scopo commerciale del contatto prima di chiedere dati.
- Per contatti telefonici o porta a porta è richiesta identificazione esplicita (dati dell'agente, del venditore, recapito telefonico).
- Dal 1° luglio 2025 i fornitori devono esporre in modo uniforme codice offerta, documentazione contrattuale e scheda sintetica — un comparatore serio deve linkare/mostrare questi elementi, non solo il prezzo.
- Se si fa outbound (telemarketing/teleselling) va rispettato il Registro Pubblico delle Opposizioni e le regole su consenso esplicito.

Nota importante: il **Portale Offerte** di ARERA (portaleofferte.it) è l'unico comparatore pubblico e non ha accordi commerciali con i fornitori — è la fonte dati "neutra" già usata per popolare `en.offers` (vedi `fetch_arera_opendata.py`), ma non è un canale di remunerazione: i ricavi arrivano solo dagli accordi commerciali diretti descritti sotto.

Requisito pratico preliminare: Quootami deve operare con una P.IVA/società (già presumibilmente esistente), avere privacy policy e cookie policy pubblicate (i file `privacy.html`/`cookie.html` già presenti nel repo vanno tenuti aggiornati e coerenti con l'attività di comparazione/lead generation).

## 3. Approcci diversi per tipo di fornitore

Non tutti i fornitori si raggiungono allo stesso modo. Conviene lavorare su più binari in parallelo.

### 3a. Fornitori digitali / "discount" (via più veloce da attivare)
Esempi: Pulsee (Enel X), Wekiwi, NeN, Optima, Illumia, Sorgenia, Fastweb Energia.
Molti hanno un vero programma partner pubblicato sul sito (es. Pulsee ha una pagina "Diventa Business Partner" dedicata a chi porta clienti). Approccio: candidatura diretta tramite il modulo/contatto pubblicato, negoziazione di un accordo di segnalazione con tracciamento tramite link/codice referral o webhook. Sono il target più semplice perché abituati a gestire flussi di lead digitali e onboarding rapido — punto di partenza consigliato per Quootami.

### 3b. Grandi fornitori incumbent
Esempi: Enel Energia, Eni Plenitude, Edison Energia, Iren Luce Gas, A2A Energia, Hera Comm.
Raramente firmano un accordo diretto con un piccolo comparatore nuovo: lavorano tipicamente tramite reti di agenzie plurimandatarie strutturate. Approccio realistico: non bussare direttamente al fornitore, ma diventare sub-agente/sub-affiliato di una rete di agenzia già mandataria (vedi punto 3c), oppure contattare l'ufficio marketing/canale "comparatori online" del fornitore solo dopo aver dimostrato un volume di lead significativo con altri partner più piccoli.

### 3c. Reti di agenzia plurimandatarie (scorciatoia per accedere a più fornitori insieme)
Esempi di reti attive sul mercato italiano: AgentScout, ENEXTRA, M2G Group, TuoAgente, Broker Vincente, AAAgents.
Queste agenzie hanno già mandati con diversi fornitori (grandi e piccoli) e cercano a loro volta sub-agenti/segnalatori. Vantaggio: un solo accordo dà accesso a un paniere di fornitori, tempi di attivazione più rapidi, supporto su documentazione e formazione. Svantaggio: la commissione per contratto è più bassa perché l'agenzia trattiene una quota. Utile come ponte mentre si negoziano accordi diretti con i fornitori digitali (3a) e, più avanti, con gli incumbent (3b).

### 3d. Reti di affiliazione (canale aggiunto il 05/08/2026 — oggi la via più rapida)
Esempi: **Awin**, **FlexOffers**.
Verificato che sulla rete Awin sono presenti come advertiser **Eni Plenitude IT**, **NeN 2025 IT** e **Octopus Energy IT**; anche **Enel** ha una campagna di affiliazione attiva. Una sola registrazione come publisher dà quindi accesso a più fornitori insieme, incluso un incumbent che il punto 3b dava per irraggiungibile.
Vantaggi rispetto agli altri canali: non serve un mandato di agenzia, il tracciamento (link, subid, postback) e la rendicontazione sono forniti dalla piattaforma — il che risolve da solo il problema descritto al punto 5.2, cioè registrare la conversione e non solo il lead. Svantaggio: la piattaforma trattiene una quota, quindi la commissione unitaria è inferiore a un accordo diretto.
L'approvazione avviene per singolo programma e richiede un sito già online con privacy e cookie policy pubblicate: condizioni oggi soddisfatte.
**È il punto di partenza consigliato, prima ancora di 3a.** Vedi `TARGET-FORNITORI-FASE1.md` per la lista operativa.

### 3e. Syndication verso comparatori già affermati
Esempi: Facile.it, Selectra/Luce-gas.it, Segugio, SosTariffe.
Invece di negoziare con i fornitori, ci si affilia a un comparatore più grande che gira il lead e riconosce una commissione minore. È l'opzione a minor sforzo/minor margine, utile solo come bootstrap iniziale se non si riesce ad attivare nulla su 3a/3c in tempi brevi.

## 4. Roadmap operativa consigliata

**Fase 1 — attivare i primi ricavi in fretta**
Registrarsi su una rete di affiliazione (3d) e candidarsi ai programmi energia già presenti: è una sola pratica che copre Plenitude, NeN e Octopus, con tracciamento incluso. In parallelo, candidarsi ai programmi partner diretti dei fornitori digitali che hanno una porta d'ingresso documentata (3a): Pulsee ha una pagina pubblica "Diventa Business Partner", Wekiwi accredita come Ambassador — non tramite il Passaparola, che esclude espressamente gli intermediari online. Solo dopo, se serve ampliare, contattare 1-2 reti di agenzia plurimandataria (3c).
La lista operativa con le porte d'ingresso verificate è in `TARGET-FORNITORI-FASE1.md`.

**Fase 2 — consolidare**
Con i primi contratti attivi e un volume di lead misurabile, riaprire il discorso con i fornitori incumbent (3b) o con le loro reti di canale "comparatori online", portando dati reali di conversione come leva negoziale.

**Fase 3 — ottimizzare**
Rinegoziare le commissioni dei fornitori più performanti, eliminare i canali a bassa marginalità (3e, e progressivamente 3d) man mano che si aprono accordi diretti, automatizzare la riconciliazione lead → contratto → commissione.

## 5. Cosa cambia nel sistema già costruito (collegamento tecnico)

Per ogni fornitore che firma un accordo:

1. Aggiornare la riga in `en.suppliers`: `partner_status` (es. `active`), `commission_note` (struttura del compenso concordato), `phone`/`email`/`website`, e soprattutto `signup_url` con il link/codice tracciato fornito dal partner (referral code, subid, UTM dedicato).
2. Se il fornitore fornisce un webhook o un'API di conferma attivazione, va valutato un piccolo endpoint aggiuntivo (nuova Edge Function `en-conversion` o simile) per registrare quando un lead generato da `en-lead` diventa contratto attivo — oggi il sistema traccia il lead ma non la conversione finale.
3. Tenere un foglio/tabella di riconciliazione mensile: lead inviati per fornitore vs contratti attivati vs commissioni ricevute, per verificare che i pagamenti dei partner corrispondano ai volumi reali.

Questi tre punti sono l'unico lavoro tecnico da fare quando si chiude un accordo — tutto il resto (schema `en.*`, pagina di confronto, RPO estrazione bolletta) è già pronto.
