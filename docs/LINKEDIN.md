# LinkedIn — profilo e piano editoriale

Materiale pronto da copiare. Obiettivo: portare traffico qualificato alle guide di
`quootami.it`, che sono già ottimizzate per la ricerca. Tre guide su sei parlano a
**imprese** (catastrofale ×2, NIS2) — e le imprese stanno qui, non su Instagram.

**Vincoli da rispettare sempre**
- **Mai link o menzioni Eni Plenitude nei post**: il programma di affiliazione vieta
  l'attività social. Le altre offerte energia si possono citare, ma il link va al
  comparatore (`/luce`), non al fornitore.
- **Identificazione dell'intermediario** (Reg. IVASS 40/2018): la qualifica va resa
  riconoscibile. Sta nel profilo (headline + Informazioni + Esperienza); nei post
  basta non presentarsi come compagnia e non promettere risultati economici certi.
- **Contenuto educativo, non promozionale**: nessuna promessa di risparmio, nessun
  confronto nominale tra compagnie, niente "la polizza più conveniente".

---

## 1. Stato del profilo — aggiornato il 07/08/2026

Profilo: `linkedin.com/in/giacomo-ramella-pollone`

| Elemento | Stato | Valore |
|---|---|---|
| Badge "Open to work" | ✅ rimosso | — |
| Headline | ✅ | `Collaboratore assicurativo per conto di Sisto Assicurazioni` |
| Settore | ✅ era "Retail" | Insurance Agencies and Brokerages |
| Azienda nel top card | ✅ attivata | **Quootami.it** |
| Università nel top card | ✅ rimossa | (era University of Europe for Applied Sciences) |
| Esperienza 1 | ✅ creata | Collaboratore assicurativo · Sisto Assicurazioni · da mag 2026 |
| Esperienza 2 | ✅ creata | Fondatore · Quootami.it · da apr 2026 |
| Informazioni | ✅ riscritta in italiano | vedi §2 |
| Competenze in evidenza | ✅ sostituite | Insurance · Commercial Insurance · Risk Management · Retirement Planning · Small Business Insurance |
| Sito web nei contatti | ✅ | `https://www.quootami.it` (tipo: Company) |
| Copertina 1584×396 | ✅ caricata | rigenerabile — vedi §3 |
| Sezione "In evidenza" | ✅ creata | card cliccabile → `https://www.quootami.it/` |
| Versione inglese del profilo | ⬜ da fare | Modifica lingua profilo → aggiungi inglese |
| In evidenza: le 2 guide imprese | ⬜ da fare | dopo la partenza dei post |
| Sezione "Fornisci servizi" | ⬜ da fare | ti fa comparire nelle ricerche di servizi locali |
| Pagina aziendale LinkedIn | ⬜ da decidere | unico modo per rendere cliccabile il nome azienda + logo |

**Dove sono i link cliccabili al sito.** Il nome azienda nel top card (`Quootami.it`)
NON è un link esterno: LinkedIn lo collega solo a una propria pagina aziendale. I due
link veri sono **In evidenza** (card con anteprima, sotto Informazioni) e **Contatti**.
Un terzo, il pulsante personalizzato sul top card, richiede Premium.

**Attenzione operativa:** digitando testo nei campi LinkedIn via automazione si perdono
caratteri singoli (es. "previdenza" → "previdena"). Dopo ogni inserimento va riletto il
testo salvato; il metodo affidabile è impostare il valore via JS con il native setter di
`HTMLTextAreaElement` e poi emettere gli eventi `input`/`change`.

**Career break (set 2024 – nov 2025): lasciato in profilo su decisione di Giacomo.**
Non si sovrappone: entrambe le attività partono nel 2026 (Quootami aprile, Sisto maggio).

Il collegamento con il sito è fatto: `config/operatore.ts` ora ha `social.linkedin`
valorizzato, e `components/JsonLd.tsx` lo emette come `sameAs` sulla persona
(sia in `InsuranceAgency.founder`, sia nell'autore delle guide). È così che Google
associa ufficialmente Giacomo al dominio.

---

## 2. Testo della sezione "Informazioni" (quello attualmente online)

```
Mi occupo di protezione: polizze per famiglie e imprese, previdenza complementare e,
da quest'anno, anche confronto delle offerte luce e gas.

Collaboratore di Sisto Assicurazioni S.a.s. (RUI sez. B n. B000639183), iscritto al
RUI sezione E con il n. E000821549.

Ho costruito Quootami.it perché la parte meccanica del lavoro la può fare uno strumento:
confrontare, filtrare, mettere i numeri in fila. Quello che uno strumento non fa è
dirti se quella garanzia serve al tuo caso, se un obbligo ti riguarda davvero, cosa
succede il giorno del sinistro. Quella parte resta mia.

Qui scrivo di ciò che vedo tornare più spesso: obblighi nuovi che le imprese scoprono
in ritardo, coperture che tutti danno per scontate e non ci sono, detrazioni che quasi
nessuno chiede.

Se hai un dubbio specifico, scrivimi pure: rispondo anche quando la risposta è
"non ti serve".

Guide e comparatore: https://www.quootami.it
```

---

## 2-bis. Descrizioni delle due esperienze (online)

**Collaboratore assicurativo — Sisto Assicurazioni**
```
Intermediazione assicurativa per privati e imprese e consulenza in materia di
previdenza complementare.

Aree di specializzazione: polizze auto, casa e salute; obbligo catastrofale per le
imprese; rischio cyber e ricadute della NIS2 sulla filiera; RC professionale e verso
terzi.

Iscritto al Registro Unico degli Intermediari (RUI) sezione E n. E000821549, per conto
di Sisto Assicurazioni S.a.s., broker iscritto in sezione B n. B000639183.
```

**Fondatore — Quootami.it**
```
Ideazione e sviluppo di quootami.it, piattaforma che integra comparazione digitale e
consulenza dell'intermediario.

Preventivi assicurativi con moduli dedicati per prodotto — auto, casa, salute, RC
d'impresa, cyber — e raccolta dati strutturata con consenso esplicito. Calcolatore di
previdenza complementare con confronto dei costi dei fondi. Comparatore luce e gas
alimentato dal catalogo pubblico delle offerte di mercato, con lettura della bolletta
e stima del risparmio sui consumi reali.

Architettura Next.js e React, dati e funzioni serverless su Supabase.
```

---

## 3. Come caricare la copertina

LinkedIn apre il selettore file di macOS, che non è pilotabile dal browser: questo
passaggio va fatto a mano.

La copertina si rigenera da `assets/quootami-copertina-1024x576.png` (sfondo bianco
pieno), ritagliata e rimontata su tela 1584×396 — la misura esatta di LinkedIn. Il
wordmark sta a destra del centro perché il basso a sinistra è coperto dalla foto
profilo, e in fondo corre una banda gialla del brand.

```bash
cd ~/Desktop/quootami && node -e "
const sharp=require('sharp');
(async()=>{
  const W=1584,H=396;
  const block=await sharp('assets/quootami-copertina-1024x576.png').trim({threshold:8}).resize({width:760}).png().toBuffer();
  const bm=await sharp(block).metadata();
  const bar=await sharp({create:{width:W,height:10,channels:4,background:'#FFD84D'}}).png().toBuffer();
  await sharp({create:{width:W,height:H,channels:4,background:'#FFFFFF'}})
    .composite([{input:block,left:Math.round((W-bm.width)/2)+60,top:Math.round((H-bm.height)/2)-8},{input:bar,left:0,top:H-10}])
    .png().toFile('assets/linkedin-cover.png');
})();"
```

Poi: profilo → matita sull'immagine di sfondo → **Cambia foto** → seleziona il file.
**Non ritagliare**: è già nella misura giusta.

---

## 5. I sei post

Uno ogni 4-5 giorni, in questo ordine (prima i due che pescano il pubblico impresa,
che è quello che su LinkedIn risponde). Ogni post chiude con il link alla guida.

**Regola tecnica**: LinkedIn penalizza i post con link esterno nel corpo. Metti il
link **nel primo commento** e nel post scrivi "link nel primo commento" oppure
usa il link nel testo accettando meno copertura. Per sei post all'avvio: link nel
primo commento.

---

### Post 1 — Catastrofale: cosa NON copre
*Guida: /guide/polizza-catastrofale-cosa-copre*

```
Un imprenditore mi ha detto la settimana scorsa: "tranquillo, ho fatto la
catastrofale obbligatoria, sono coperto".

Poi gli ho chiesto: e se domani una tromba d'aria ti scoperchia il capannone?

Silenzio.

L'obbligo cat nat copre cinque eventi: sisma, alluvione, frana, inondazione,
esondazione. Punto.

Restano fuori — e non è un dettaglio:
· grandine
· trombe d'aria e vento forte
· mareggiate

Cioè, statisticamente, i danni che in Italia capitano più spesso.

Non è un difetto della norma: la norma serviva a coprire il rischio catastrofale
sistemico, non il maltempo. Il problema nasce quando l'impresa firma, archivia e
si convince di aver risolto tutto.

L'integrazione esiste, costa poco rispetto al resto, e va chiesta esplicitamente.
Ma prima bisogna sapere che serve.

Ho scritto una guida su cosa copre davvero e cosa no — link nel primo commento.

#assicurazioni #PMI #riskmanagement #imprese
```

---

### Post 2 — NIS2 e l'effetto catena sui fornitori
*Guida: /guide/nis2-pmi-obblighi-cybersicurezza*

```
"La NIS2 non mi riguarda, sono troppo piccolo."

È la frase che sento più spesso. Ed è vera solo a metà.

Formalmente sì: se stai sotto le soglie dimensionali e fuori dai settori indicati
dal D.Lgs. 138/2024, l'obbligo diretto non ti tocca.

Ma la NIS2 chiede alle aziende obbligate di mettere in sicurezza anche la propria
catena di fornitura. Tradotto: il tuo cliente grande, che è obbligato, scarica su
di te i requisiti. Via contratto, via questionario, via clausola di rinnovo.

Nell'ultimo anno ho visto arrivare quei questionari a officine, studi tecnici,
piccoli produttori. Nessuno di loro era "obbligato". Tutti hanno dovuto rispondere.

Chi non risponde non prende una multa: perde la fornitura. Che di solito fa più
male.

Ho messo giù una guida su settori, soglie, effetto catena e dove entra davvero la
polizza cyber (spoiler: non sostituisce le misure tecniche, le affianca).

Link nel primo commento.

#NIS2 #cybersecurity #PMI #compliance
```

---

### Post 3 — Auto ferma in garage
*Guida: /guide/auto-ferma-in-garage-va-assicurata*

```
"L'auto è ferma in garage da otto mesi, mica devo assicurarla."

Purtroppo sì.

L'obbligo di RC auto non dipende da quanto circoli. Dipende da una cosa sola: se il
veicolo è immatricolato e idoneo al trasporto. Anche fermo. Anche in un box chiuso
a chiave.

Le uscite legittime esistono, e sono tre:
· radiazione o demolizione
· consegna in conto vendita a un concessionario
· sospensione della polizza — che non è una disdetta, e soprattutto non ti fa
  perdere la classe di merito maturata

È il terzo punto quello che quasi nessuno conosce. Chi disdice e basta, quando
riprende in mano l'auto riparte peggio di com'era.

Poi ci sono le formule stagionali, che per moto e camper hanno senso eccome.

Guida completa nel primo commento.

#assicurazioni #rcauto #consulenza
```

---

### Post 4 — La detrazione al 19% che quasi nessuno chiede
*Guida: /guide/detrazione-polizza-eventi-calamitosi-casa*

```
C'è una detrazione fiscale al 19% **senza tetto di spesa**. Sulle polizze contro
gli eventi calamitosi per gli immobili residenziali.

Senza limite di importo. In un sistema dove qualunque altra detrazione ha un
massimale, è un'anomalia.

Eppure la vedo chiedere pochissimo. Il motivo è quasi sempre lo stesso: nella
polizza multirischi il premio della parte calamitosa non è distinto dal resto, e
allora in dichiarazione non si porta nulla.

Serve che la certificazione della compagnia separi quella componente. Se il tuo
contratto è già attivo, si può chiedere. Se lo stai facendo adesso, va chiesto
subito.

Non è una furbizia fiscale: è una detrazione prevista, semplicemente scritta in
un punto che nessuno legge.

Come funziona e come ottenerla — link nel primo commento.

#fisco #casa #assicurazioni #detrazioni
```

---

### Post 5 — Adesione automatica al fondo pensione
*Guida: /guide/adesione-automatica-fondo-pensione-2026*

```
Dal 1° luglio 2026 chi viene assunto aderisce **automaticamente** alla previdenza
complementare. Il TFR ci va da solo, salvo scelta contraria entro 60 giorni.

Sto vedendo due reazioni opposte, sbagliate nello stesso modo.

La prima: "mi hanno messo dentro senza chiedermelo, esco subito". Quasi mai
conviene. Il contributo del datore di lavoro, quando previsto dal contratto, lo
prendi solo se resti dentro. Uscire significa rinunciare a soldi di qualcun altro.

La seconda: "va bene così, non tocco niente". Anche questa è una scelta non fatta.
Il comparto in cui finisci d'ufficio è quello prudente, che a trent'anni è quasi
sempre il meno adatto: hai davanti trent'anni di versamenti e stai investendo come
se ne avessi tre.

I 60 giorni non servono per uscire. Servono per decidere **come** stare dentro.

Cosa valutare, chi resta escluso e come funziona davvero — nel primo commento.

#previdenza #fondopensione #TFR #lavoro
```

---

### Post 6 — Catastrofale: chi è obbligato (e le scadenze già passate)
*Guida: /guide/polizza-catastrofale-imprese-chi-e-obbligato*

```
Le scadenze dell'obbligo di polizza catastrofale sono passate per quasi tutte le
imprese. E una parte non lo sa ancora.

Non c'è una multa che ti arriva a casa: la sanzione è più subdola. Senza copertura
in regola, l'accesso a contributi, agevolazioni e sovvenzioni pubbliche può essere
precluso. Te ne accorgi il giorno in cui presenti la domanda.

Le tre cose che vedo sbagliare più spesso:

1. **"Ho l'incendio, basta quello."** No. Sono coperture diverse, con eventi diversi.

2. **"Sono in affitto, tocca al proprietario."** L'obbligo riguarda i beni iscritti
   nell'attivo di bilancio: macchinari, attrezzature, impianti. Quelli sono tuoi
   anche se il capannone no.

3. **"Sono agricola, sono esclusa."** L'esclusione c'è, ma è più stretta di come
   viene raccontata in giro.

Ho scritto chi rientra, chi è fuori, cosa va assicurato e cosa si rischia
concretamente. Link nel primo commento.

#imprese #PMI #catnat #assicurazioni
```

---

## 6. Dopo i sei post

Quando questi sono usciti (circa un mese), le tracce successive escono dai dati,
non dall'istinto: si guarda in Search Console quali query portano già impression
al sito e si scrive il post — e poi la guida — su quelle. Stessa logica con cui
sono state scelte queste sei.

Idee già in coda, in ordine di priorità:
- **Bollette luce/gas per le PMI** — l'unico aggancio energia che su LinkedIn ha
  senso (le famiglie non leggono LinkedIn per la bolletta). Link a `/luce`.
- **RC professionale**: cosa copre la postuma e perché disdire una RC professionale
  senza pensarci è il modo più veloce per restare scoperti su vecchi incarichi.
- **Infortuni del titolare**: la copertura che manca in quasi tutte le PMI che vedo.

## 7. Cosa manca

1. **Caricare la copertina** — vedi §3, due minuti.
2. **Versione inglese del profilo** — Impostazioni profilo → Lingua del profilo →
   aggiungi inglese. Serve solo per i contatti internazionali dell'università: il
   profilo primario resta italiano, che è la lingua dei clienti.
3. **Ok sui sei post**, che sono scritti con la tua voce ma restano da fare tuoi.
4. **Sezione "In evidenza"** con le due guide imprese, dopo che i post sono partiti.
