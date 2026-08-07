/**
 * Quootami — Catalogo prodotti CENTRALIZZATO
 * ============================================================
 * Ogni polizza ha la stessa struttura tipizzata. Le pagine
 * prodotto leggono da qui via `getPolizza(slug)`. Per modificare
 * un prodotto basta cambiare un valore in questo file.
 * ============================================================
 */

export type Coverage = {
  title: string;
  desc: string;
  required?: boolean;
  color: 'navy' | 'red' | 'amber' | 'violet' | 'teal' | 'green' | 'blue';
};

export type FaqItem = {
  q: string;
  a: string;
};

/**
 * Sezione redazionale in fondo alla pagina prodotto: è il contenuto che dà
 * sostanza alla pagina agli occhi di un motore di ricerca e risponde alle
 * domande che l'utente si fa PRIMA di chiedere un preventivo.
 *
 * Regole (settore vigilato IVASS, vedi CLAUDE.md §4):
 * - nessun prezzo, nessuna stima di premio, nessuna promessa di risparmio;
 * - solo fatti verificabili, con la norma citata quando è il caso;
 * - `fonti` chiude la sezione con i riferimenti usati.
 */
export type Approfondimento = {
  eyebrow: string;
  title: string;
  /** parola evidenziata in giallo dentro `title` */
  accent: string;
  intro: string;
  blocchi: { h3: string; p: string[] }[];
  fonti?: string;
};

export type Polizza = {
  slug: string;
  category: 'privati' | 'imprese' | 'previdenza';
  title: string;
  /** Riga breve usata nelle card degli hub (home e /polizze). */
  shortDesc: string;
  hero: {
    eyebrow: string;
    h1Lead: string;        // es. "Quootami l'RC"
    h1Accent: string;      // es. "giusta." (highlighted in giallo)
    sub: string;
  };
  metaTitle: string;
  metaDesc: string;
  ogImageAlt: string;
  coverages: {
    title: string;
    sub: string;
    items: Coverage[];
  };
  process: {
    title: string;
    steps: { title: string; desc: string }[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  /**
   * URL opzionale del modulo di adesione online compilabile direttamente
   * dal cliente. Se presente, ProductPage mostra un CTA dedicato
   * "Compila online + firma".
   * Per ora usato solo da Allianz Previdenza (`/firma-allianz.html`).
   */
  adesioneUrl?: string;
  /** Sezione redazionale in fondo alla pagina. Se assente, non viene resa. */
  approfondimento?: Approfondimento;
};

export const POLIZZE: Record<string, Polizza> = {
  'polizza-auto': {
    slug: 'polizza-auto',
    category: 'privati',
    title: 'Polizza Auto',
    shortDesc: 'RC obbligatoria, Furto, Incendio, Kasko.',
    hero: {
      eyebrow: 'RC Auto obbligatoria · Furto, Incendio & Kasko',
      h1Lead: "L'assicurazione auto",
      h1Accent: 'giusta.',
      sub: 'Confronto multi-compagnia per trovare la polizza migliore per il tuo veicolo.',
    },
    metaTitle: 'Polizza Auto · RC, Furto, Incendio e Kasko',
    metaDesc: 'Confronto polizze auto fra più compagnie: RC obbligatoria, Furto, Incendio e Kasko. Come funziona la classe di merito e cosa fa salire il premio.',
    ogImageAlt: 'Polizza Auto Quootami — RC Auto, Furto, Incendio, Kasko',
    approfondimento: {
      eyebrow: 'Come si sceglie',
      title: 'Cosa determina il prezzo dell\'assicurazione auto',
      accent: 'il prezzo',
      intro: 'A parità di veicolo, due preventivi possono differire in modo sensibile. Sapere da cosa dipendono aiuta a capire dove si può intervenire e dove no.',
      blocchi: [
        {
          h3: 'La classe di merito è il fattore che pesa di più',
          p: [
            'Il sistema bonus-malus assegna a ogni veicolo una classe di merito universale (CU) da 1 a 18: si scende di una classe per ogni anno senza sinistri con colpa e si sale di due quando un sinistro viene pagato. La classe segue il contratto, non la persona, ed è consultabile dalle compagnie nella banca dati dell\'attestato di rischio: dal 2015 l\'attestato è dematerializzato, quindi non va più consegnato a mano al momento del preventivo.',
            'Chi assicura un veicolo nuovo non parte necessariamente dalla classe 14. L\'art. 134 comma 4-bis del Codice delle Assicurazioni — la cosiddetta legge Bersani — consente di ereditare la classe di merito già maturata da un familiare convivente su un veicolo della stessa tipologia. È una delle poche leve che abbatte davvero il premio, e va chiesta esplicitamente.',
          ],
        },
        {
          h3: 'Gli altri elementi che la compagnia valuta',
          p: [
            'Pesano la provincia di residenza — la frequenza dei sinistri varia molto da zona a zona — l\'età e l\'anzianità di patente del contraente, la formula di guida scelta (esclusiva, esperta o libera), potenza e alimentazione del veicolo, i chilometri percorsi e l\'eventuale installazione di una scatola nera.',
            'La formula di guida è il punto in cui si sbaglia più spesso: la guida esclusiva costa meno, ma se al volante c\'è qualcun altro al momento del sinistro molte compagnie applicano una rivalsa o una franchigia aggiuntiva. Conviene solo se corrisponde davvero all\'uso del veicolo.',
          ],
        },
        {
          h3: 'Il veicolo va assicurato anche quando non circola',
          p: [
            'L\'obbligo di assicurazione previsto dall\'art. 122 del Codice delle Assicurazioni riguarda i veicoli idonei alla circolazione, non solo quelli effettivamente usati. Un\'auto immatricolata e funzionante ferma in un cortile condominiale o su strada resta soggetta all\'obbligo: per interromperlo servono la sospensione della polizza, la demolizione o il ricovero in un\'area privata chiusa.',
            'Alla scadenza la copertura non cade nell\'istante: l\'art. 1901 del Codice civile mantiene la garanzia operante per quindici giorni oltre il termine. Sono giorni di tolleranza, non un rinnovo: passati quelli il veicolo è scoperto a tutti gli effetti.',
          ],
        },
        {
          h3: 'Cosa controllare prima di firmare',
          p: [
            'Al di là del premio, i punti che fanno la differenza quando serve davvero sono quattro: i massimali di responsabilità civile, le franchigie e gli scoperti sulle garanzie accessorie, i casi di rivalsa (guida in stato di ebbrezza, patente scaduta, veicolo non revisionato) e — per furto, incendio e kasko — se il rimborso avviene a valore commerciale o a valore a nuovo, differenza che sui primi anni di vita del veicolo vale molto.',
          ],
        },
      ],
      fonti: 'D.Lgs. 209/2005 (Codice delle Assicurazioni Private), artt. 122, 134 e 149; art. 1901 Codice civile; Reg. IVASS 9/2015 sull\'attestato di rischio dematerializzato.',
    },
    coverages: {
      title: 'Cosa copre la polizza auto',
      sub: 'Dalla RC obbligatoria alle garanzie accessorie: scegli il livello di protezione adatto.',
      items: [
        { title: 'RC Auto', desc: 'Copre i danni che provochi a terzi alla guida. È l\'unica copertura obbligatoria per legge.', required: true, color: 'navy' },
        { title: 'Furto e Incendio', desc: 'Rimborso in caso di furto, tentato furto, incendio o esplosione.', color: 'red' },
        { title: 'Kasko', desc: 'Copre i danni al tuo veicolo anche se la colpa è tua.', color: 'amber' },
        { title: 'Eventi naturali e vandalismo', desc: 'Grandine, alluvioni, trombe d\'aria, atti vandalici.', color: 'violet' },
        { title: 'Cristalli', desc: 'Rottura e sostituzione di parabrezza, lunotto e finestrini.', color: 'blue' },
        { title: 'Infortuni del Conducente', desc: 'Indennizzo per morte o invalidità del conducente.', color: 'teal' },
        { title: 'Tutela Legale', desc: 'Spese legali per controversie nate dalla circolazione.', color: 'amber' },
        { title: 'Assistenza Stradale', desc: 'Soccorso 24/7, traino, auto sostitutiva.', color: 'green' },
      ],
    },
    process: {
      title: 'Da richiesta a polizza in 4 step.',
      steps: [
        { title: 'Richiedi il preventivo', desc: 'Compili il form con i dati del veicolo e del conducente. Bastano 2 minuti.' },
        { title: 'Quootami confronta', desc: 'Il team analizza le proposte delle compagnie partner e seleziona la più adatta.' },
        { title: 'Ricevi la proposta', desc: 'Entro 24h Quootami invia il preventivo migliore, con spiegazione chiara.' },
        { title: 'Sottoscrivi la polizza', desc: 'Firma digitale, attivazione immediata. Quootami resta come referente.' },
      ],
    },
    faq: {
      title: 'Le risposte che cerchi.',
      items: [
        { q: 'Quanto costa richiedere un preventivo?', a: 'Il preventivo è completamente gratuito e senza impegno. Si paga solo se si decide di attivare la polizza.' },
        { q: 'Con quali compagnie lavora Quootami?', a: 'Quootami confronta le offerte delle principali compagnie del mercato, secondo i mandati del broker. Il confronto è indipendente: non siamo legati a un\'unica compagnia, così la proposta è quella più adatta al tuo profilo.' },
        { q: 'Posso disdire la mia polizza attuale?', a: 'Sì, ed è più semplice di quanto pensi: per legge la RC Auto non ha tacito rinnovo, quindi alla scadenza annuale sei libero di cambiare compagnia senza inviare alcuna disdetta. Quootami gestisce il passaggio senza interruzioni di copertura.' },
      ],
    },
  },

  'polizza-casa': {
    slug: 'polizza-casa',
    category: 'privati',
    title: 'Polizza Casa',
    shortDesc: 'RC capofamiglia, furto, incendio, eventi naturali.',
    hero: {
      eyebrow: 'Casa e famiglia',
      h1Lead: 'La polizza casa',
      h1Accent: 'su misura.',
      sub: 'Una sola polizza per furto, incendio, eventi naturali e RC capofamiglia.',
    },
    metaTitle: 'Polizza Casa · Furto, Incendio, RC capofamiglia',
    metaDesc: 'Confronto polizze casa: furto, incendio, danni da acqua, eventi atmosferici e RC capofamiglia. Come evitare la regola proporzionale. Preventivo gratuito.',
    ogImageAlt: 'Polizza Casa Quootami — Furto, Incendio, RC capofamiglia',
    approfondimento: {
      eyebrow: 'Come si sceglie',
      title: 'Gli errori che rendono inutile una polizza casa',
      accent: 'inutile',
      intro: 'La polizza casa è quella in cui la somma assicurata conta più del premio: sbagliarla significa scoprire al momento del danno di essere coperti solo in parte.',
      blocchi: [
        {
          h3: 'Fabbricato e contenuto sono due cose diverse',
          p: [
            'Il fabbricato è la struttura: muri, tetto, impianti fissi, infissi. Il contenuto è tutto ciò che sta dentro: mobili, elettrodomestici, vestiti, oggetti di valore. Sono partite separate, con massimali separati, e chi abita in affitto assicura solo il contenuto più la responsabilità civile — il fabbricato è del proprietario.',
            'Per chi ha un mutuo la polizza incendio sul fabbricato è in genere richiesta dalla banca come condizione del finanziamento. La banca può proporre la propria, ma il cliente è libero di stipularla altrove purché rispetti i requisiti richiesti.',
          ],
        },
        {
          h3: 'La regola proporzionale: il meccanismo che sorprende tutti',
          p: [
            'Se la somma assicurata è inferiore al valore reale del bene, l\'art. 1907 del Codice civile prevede che l\'indennizzo venga ridotto nella stessa proporzione. Assicurare per 100.000 euro un contenuto che ne vale 200.000 non significa essere coperti fino a 100.000: significa che su un danno da 20.000 euro se ne ricevono 10.000.',
            'È il motivo per cui dichiarare valori bassi per pagare meno è quasi sempre una falsa economia. Alcune polizze prevedono la deroga alla regola proporzionale entro certi limiti: è una clausola che vale la pena cercare e verificare.',
          ],
        },
        {
          h3: 'Le garanzie che si attivano più spesso',
          p: [
            'Nella pratica i sinistri più frequenti non sono i furti ma i danni da acqua: rottura di tubazioni, infiltrazioni, allagamenti. Attenzione alla distinzione contrattuale tra la rottura dell\'impianto — quasi sempre coperta — e il danno da infiltrazione lenta o da mancata manutenzione, spesso esclusa.',
            'La responsabilità civile della vita privata, o RC capofamiglia, copre i danni che il nucleo familiare causa involontariamente a terzi: dall\'acqua che allaga il vicino al cane che morde. È la garanzia con il rapporto fra costo e utilità più alto dell\'intero contratto.',
            'Il furto merita una lettura attenta dei requisiti dei mezzi di chiusura: molte polizze condizionano l\'indennizzo alla presenza di serrature, inferriate o sistemi d\'allarme con caratteristiche precise, e a un accesso avvenuto per effrazione.',
          ],
        },
        {
          h3: 'Eventi catastrofali e detrazione fiscale',
          p: [
            'Terremoto e alluvione sono in genere esclusi dalle garanzie base e vanno aggiunti. Per i privati non c\'è obbligo, a differenza di quanto previsto per le imprese, ma c\'è un incentivo fiscale rilevante: sui premi delle polizze contro gli eventi calamitosi relative a unità immobiliari a uso abitativo spetta la detrazione del 19% senza tetto di spesa, ai sensi dell\'art. 15 comma 1 lettera f-bis del TUIR.',
          ],
        },
      ],
      fonti: 'Artt. 1907 e 1913 Codice civile; art. 15 c.1 lett. f-bis TUIR (D.P.R. 917/1986), introdotto dalla L. 205/2017.',
    },
    coverages: {
      title: 'Cosa copre la polizza casa',
      sub: 'Una protezione modulare per casa e famiglia.',
      items: [
        { title: 'Incendio e scoppio', desc: 'Danni da incendio, fulmine, esplosione, fumo. Richiesta dalla banca se hai un mutuo.', color: 'red' },
        { title: 'Furto', desc: 'Furto, rapina, scippo, danni da effrazione.', color: 'navy' },
        { title: 'RC capofamiglia', desc: 'Danni causati a terzi da te, dai tuoi familiari, dai tuoi animali domestici.', color: 'teal' },
        { title: 'Eventi atmosferici', desc: 'Grandine, alluvione, vento, neve.', color: 'blue' },
        { title: 'Catastrofali', desc: 'Terremoto, alluvione, frana. Per le abitazioni il premio è detraibile al 19%.', color: 'violet' },
        { title: 'Cristalli', desc: 'Rottura accidentale di vetri, specchi, lastre.', color: 'amber' },
        { title: 'Tutela legale', desc: 'Spese legali per controversie sulla casa.', color: 'green' },
        { title: 'Assistenza domestica', desc: 'Idraulico, fabbro, elettricista 24/7.', color: 'navy' },
      ],
    },
    process: {
      title: 'Da richiesta a polizza in 4 step.',
      steps: [
        { title: 'Compila la richiesta', desc: 'Dati immobile, mq, anno costruzione, eventuali allarmi.' },
        { title: 'Quootami confronta', desc: 'Analisi delle proposte delle compagnie partner.' },
        { title: 'Ricevi il preventivo', desc: 'Entro 24h ti arriva la proposta con coperture spiegate.' },
        { title: 'Sottoscrivi', desc: 'Firma digitale e attivazione immediata.' },
      ],
    },
    faq: {
      title: 'Le risposte che cerchi.',
      items: [
        { q: 'Posso assicurare solo il furto?', a: 'Sì, è possibile selezionare solo le coperture di interesse. Spesso però la formula completa costa molto meno della somma delle singole.' },
        { q: 'La banca mi obbliga a prendere la sua polizza per il mutuo?', a: 'No. Per concedere il mutuo la banca richiede quasi sempre una polizza incendio sull\'immobile, ma per legge sei libero di sceglierla sul mercato: la banca deve accettare qualsiasi polizza con le coperture equivalenti. Quootami può trovartene una più conveniente di quella proposta in filiale.' },
        { q: 'Sono coperto se faccio danni nel condominio?', a: 'Sì con la RC capofamiglia: copre i danni che provochi tu o i tuoi familiari a terzi, vicini, parti comuni.' },
      ],
    },
  },

  'salute': {
    slug: 'salute',
    category: 'privati',
    title: 'Salute & Vita',
    shortDesc: 'Sanitaria, vita, infortuni.',
    hero: {
      eyebrow: 'Salute, vita, infortuni',
      h1Lead: 'Polizza salute e vita,',
      h1Accent: 'senza pensieri.',
      sub: 'Polizze sanitarie, vita e infortuni per ridurre le spese mediche e proteggere chi ami.',
    },
    metaTitle: 'Polizza Salute, Vita e Infortuni',
    metaDesc: 'Confronto polizze salute, vita e infortuni: rimborso di visite, ricoveri e interventi, carenze ed esclusioni, quanto si detrae in dichiarazione. Preventivo gratuito.',
    ogImageAlt: 'Polizza Salute Quootami — Sanitaria, Vita, Infortuni',
    approfondimento: {
      eyebrow: 'Come si sceglie',
      title: 'Polizza salute: le clausole che decidono se sarai rimborsato',
      accent: 'le clausole',
      intro: 'Nelle coperture sanitarie il premio dice poco. Quello che conta sono carenze, esclusioni e il modo in cui hai risposto al questionario.',
      blocchi: [
        {
          h3: 'Il questionario sanitario è la parte più delicata del contratto',
          p: [
            'Gli artt. 1892 e 1893 del Codice civile disciplinano le dichiarazioni inesatte o reticenti: se sono rese con dolo o colpa grave la compagnia può chiedere l\'annullamento del contratto, e anche in assenza di colpa grave può ridurre l\'indennizzo in proporzione. Tradotto: un\'omissione fatta per ottenere condizioni migliori può far cadere la copertura proprio quando serve.',
            'La regola pratica è dichiarare tutto, anche ciò che sembra irrilevante o lontano nel tempo. Una patologia dichiarata può portare a un\'esclusione specifica o a un sovrappremio; la stessa patologia taciuta può portare a non essere rimborsati affatto.',
          ],
        },
        {
          h3: 'Carenze, preesistenze ed esclusioni',
          p: [
            'Il periodo di carenza è l\'intervallo fra la decorrenza della polizza e l\'inizio effettivo della copertura: cambia a seconda della garanzia, ed è tipicamente più lungo per parto, malattie e interventi programmati che per gli infortuni. Va letto prima, non dopo.',
            'Le patologie già esistenti al momento della stipula sono di norma escluse, così come le cure non riconducibili a una necessità medica. Vanno verificati anche i limiti per accertamenti diagnostici, fisioterapia e cure odontoiatriche, che spesso hanno sottomassimali propri molto più bassi del massimale generale.',
          ],
        },
        {
          h3: 'Rimborso o rete convenzionata',
          p: [
            'Le formule si dividono in due famiglie. Con il rimborso si anticipa la spesa e si viene rimborsati a fronte della documentazione, di solito con uno scoperto a carico dell\'assicurato. Con la rete convenzionata ci si rivolge a strutture accreditate che fatturano direttamente alla compagnia, spesso senza anticipo.',
            'La seconda è più comoda ma dipende interamente da quali strutture siano convenzionate nella zona in cui si vive: è la prima cosa da verificare, prima ancora del massimale.',
          ],
        },
        {
          h3: 'Quanto si detrae',
          p: [
            'Sui premi delle polizze che coprono il rischio di morte o di invalidità permanente non inferiore al 5% spetta la detrazione del 19% su un importo massimo di 530 euro. Per le coperture contro il rischio di non autosufficienza nel compimento degli atti della vita quotidiana il limite sale a 1.291,14 euro, al netto dei premi già considerati per morte e invalidità.',
            'Il limite è elevato a 750 euro per i premi delle polizze a tutela delle persone con disabilità grave ai sensi dell\'art. 3 comma 3 della L. 104/1992. In tutti i casi la detrazione spetta solo se il pagamento è avvenuto con mezzi tracciabili.',
          ],
        },
      ],
      fonti: 'Artt. 1892 e 1893 Codice civile; art. 15 c.1 lett. f TUIR (D.P.R. 917/1986); Agenzia delle Entrate, guida ai premi di assicurazione.',
    },
    coverages: {
      title: 'Cosa copre la polizza salute',
      sub: 'Diverse formule per esigenze diverse.',
      items: [
        { title: 'Ricoveri e interventi', desc: 'Spese di ricovero, intervento chirurgico, day hospital.', color: 'red' },
        { title: 'Visite specialistiche', desc: 'Rimborso visite, esami diagnostici, accertamenti.', color: 'navy' },
        { title: 'Cure odontoiatriche', desc: 'Igiene, otturazioni, protesi, ortodonzia.', color: 'amber' },
        { title: 'Vita', desc: 'Capitale ai beneficiari in caso di decesso dell\'assicurato.', color: 'violet' },
        { title: 'Infortuni', desc: 'Indennizzo per invalidità permanente o temporanea.', color: 'teal' },
        { title: 'Malattia grave', desc: 'Capitale in caso di patologie gravi (tumore, infarto, ictus...).', color: 'green' },
      ],
    },
    process: {
      title: 'Come funziona.',
      steps: [
        { title: 'Compila la richiesta', desc: 'Dati anagrafici e profilo sanitario (questionario semplice).' },
        { title: 'Quootami valuta', desc: 'Analisi delle compagnie partner secondo profilo ed età.' },
        { title: 'Ricevi il preventivo', desc: 'Entro 24h ti arriva la proposta personalizzata.' },
        { title: 'Sottoscrivi', desc: 'Eventuali visite mediche, firma digitale, polizza attiva.' },
      ],
    },
    faq: {
      title: 'Le risposte che cerchi.',
      items: [
        { q: 'Posso essere rifiutato per patologie pregresse?', a: 'Dipende dalla compagnia. Alcune escludono le patologie preesistenti, altre le coprono ma con sovrapremio. Quootami ti aiuta a scegliere la formula adeguata al tuo profilo.' },
        { q: 'Le spese mediche le pago io e poi mi vengono rimborsate?', a: 'Dipende dalla formula. Alcune polizze prevedono pagamento diretto (con strutture convenzionate), altre rimborso a posteriori. Quootami spiega le differenze.' },
        { q: 'Posso assicurare anche la mia famiglia?', a: 'Sì, con la formula "Nucleo familiare" copri te, coniuge e figli con un\'unica polizza.' },
        { q: 'I premi sono detraibili dalle tasse?', a: 'In parte. I premi delle polizze vita e infortuni (per morte o invalidità permanente superiore al 5%) danno diritto alla detrazione IRPEF del 19% fino a €530/anno di premio. Le polizze sanitarie di rimborso spese invece non sono detraibili.' },
      ],
    },
  },

  'piano-pensione': {
    slug: 'piano-pensione',
    category: 'previdenza',
    title: 'Fondo Pensione',
    shortDesc: 'Deduci fino a €5.300/anno dal reddito IRPEF.',
    hero: {
      eyebrow: 'Previdenza complementare',
      h1Lead: 'Il tuo futuro,',
      h1Accent: 'con vantaggio fiscale.',
      sub: 'Deduci fino a €5.300/anno dal reddito IRPEF e costruisci la pensione integrativa. Calcola subito quanto risparmi.',
    },
    metaTitle: 'Fondo Pensione · Calcola il risparmio fiscale',
    metaDesc: 'Fondo pensione: calcola il risparmio IRPEF, deducibilità fino a 5.300 € l\'anno e rendimenti tassati al 20%. Confronto fra fondi e costi ISC.',
    ogImageAlt: 'Fondo Pensione Quootami — Previdenza complementare e deduzione fiscale',
    adesioneUrl: '/firma-allianz.html',
    coverages: {
      title: 'Vantaggi del fondo pensione',
      sub: 'I benefici fiscali che lo Stato riserva alla previdenza complementare.',
      items: [
        { title: 'Deduzione fiscale', desc: 'Deduci fino a €5.300/anno dal reddito IRPEF (nuovo limite 2026) — risparmio immediato in tasse.', color: 'green' },
        { title: 'Tassazione agevolata', desc: 'Rendimenti tassati al 20% (vs 26% degli altri investimenti), 12,5% sulla parte in titoli di Stato.', color: 'navy' },
        { title: 'Tassazione finale ridotta', desc: 'Al momento della pensione paghi dal 15% al 9% (dopo 35 anni), contro il 23–43% IRPEF.', color: 'teal' },
        { title: 'Patrimonio protetto', desc: 'Impignorabile, fuori dall\'asse ereditario ed esente dall\'imposta di bollo.', color: 'violet' },
        { title: 'Anticipazioni', desc: 'Anticipi per spese sanitarie (75%), prima casa (75%) e altre esigenze (30%).', color: 'amber' },
        { title: 'Trasferibile', desc: 'Puoi trasferire la posizione a un altro fondo dopo 2 anni, senza penali e senza tasse.', color: 'blue' },
      ],
    },
    process: {
      title: 'Come iscriversi.',
      steps: [
        { title: 'Compila la richiesta', desc: 'Età, reddito, obiettivi previdenziali.' },
        { title: 'Quootami valuta', desc: 'Analisi dei fondi disponibili in base al profilo.' },
        { title: 'Ricevi la proposta', desc: 'Confronto a 3 scenari (deduzione, costi, rendimenti attesi).' },
        { title: 'Iscriviti', desc: 'Modulo di adesione, firma digitale, prima contribuzione.' },
      ],
    },
    faq: {
      title: 'Le risposte che cerchi.',
      items: [
        { q: 'Conviene sempre il fondo pensione?', a: 'Non sempre: dipende dalla tua aliquota IRPEF marginale, dal costo del fondo (ISC) e dall\'orizzonte temporale. Più alta è l\'aliquota e più lungo è l\'orizzonte, più conviene. Quootami fa un calcolo personalizzato per dirti in euro quanto guadagni.' },
        { q: 'Quanto si risparmia con la deduzione?', a: 'I versamenti riducono il reddito imponibile fino a €5.300/anno (limite elevato da €5.164,57 dalla Legge di Bilancio 2026, L. 199/2025, con decorrenza 1° gennaio 2026). Con reddito di €35.000 e versamento di €5.000, il risparmio IRPEF è di circa €1.750/anno (aliquota marginale 35%). Usa il calcolatore in questa pagina per la stima sul tuo reddito.' },
        { q: 'Come sono tassati i rendimenti?', a: 'Al 20% invece del 26% degli altri strumenti finanziari; la parte investita in titoli di Stato è tassata al 12,5%. Il fondo pensione è inoltre esente dall\'imposta di bollo dello 0,2%.' },
        { q: 'Quanto costa un fondo pensione?', a: 'Il costo si misura con l\'ISC (Indicatore Sintetico dei Costi): indicativamente 0,2–0,8% per i fondi negoziali di categoria, 0,8–1,5% per i fondi aperti, 1,5–3,5% per i PIP assicurativi. A parità di vantaggio fiscale, il costo è il fattore che pesa di più sul risultato finale: per questo Quootami lo confronta per primo.' },
        { q: 'Quando posso prelevare i soldi?', a: 'Al momento della pensione (con almeno 5 anni di partecipazione). Prima sono possibili anticipi per spese sanitarie (75%, in qualsiasi momento), acquisto/ristrutturazione prima casa (75%, dopo 8 anni) e altre esigenze (30%, dopo 8 anni).' },
        { q: 'E se perdo il lavoro?', a: 'Dopo 12 mesi di disoccupazione puoi riscattare il 50% della posizione; dopo 48 mesi il 100%, con tassazione agevolata al 15% (che scende fino al 9%). In alternativa esiste la RITA, la rendita anticipata fino a 10 anni prima della pensione.' },
        { q: 'Posso cambiare fondo se ne trovo uno migliore?', a: 'Sì, dopo almeno 2 anni puoi trasferire l\'intera posizione a un altro fondo senza penali e senza tassazione, mantenendo l\'anzianità di partecipazione maturata.' },
        { q: 'Meglio lasciare il TFR in azienda o versarlo al fondo?', a: 'In azienda il TFR si rivaluta dell\'1,5% fisso più il 75% dell\'inflazione, e all\'incasso sconta la tassazione separata (di fatto mai sotto il 23%). Nel fondo pensione il rendimento dipende dal comparto scelto, la tassazione finale scende dal 15% al 9% e — soprattutto — può scattare il contributo del datore di lavoro. Non è una scelta uguale per tutti: dipende da orizzonte temporale, comparto e CCNL applicato.' },
        { q: 'Il datore di lavoro versa qualcosa nel fondo?', a: 'Sì, se aderisci al fondo di categoria e versi la tua quota, molti CCNL obbligano il datore a versare la sua: è retribuzione aggiuntiva che non spetta a chi lascia il TFR in azienda. La percentuale varia da contratto a contratto e va verificata sull\'accordo applicato al tuo rapporto di lavoro.' },
        { q: 'Cosa cambia con l\'adesione automatica del 2026?', a: 'Dal 1° luglio 2026 chi viene assunto nel settore privato è iscritto automaticamente al fondo pensione previsto dal proprio CCNL, con il versamento del TFR. Per rinunciare o scegliere diversamente ci sono 60 giorni dall\'assunzione (prima il termine era di sei mesi). È il cosiddetto silenzio-assenso.' },
        { q: 'Cosa succede al fondo se muoio prima della pensione?', a: 'La posizione viene liquidata ai beneficiari che hai designato — anche fuori dalla famiglia — e, in loro assenza, agli eredi legittimi. Ai beneficiari si applica la tassazione agevolata dal 15% al 9%, e il capitale è esente dall\'imposta di successione perché non entra nell\'asse ereditario. Per questo la designazione dei beneficiari va compilata e tenuta aggiornata.' },
      ],
    },
  },

  'cyber': {
    slug: 'cyber',
    category: 'privati',
    title: 'Cyber',
    shortDesc: 'Furto identità, frodi online.',
    hero: {
      eyebrow: 'Protezione digitale',
      h1Lead: 'Polizza cyber: vita digitale',
      h1Accent: 'protetta.',
      sub: 'Copertura per furto identità, frodi online, attacchi cyber, danni reputazionali.',
    },
    metaTitle: 'Polizza Cyber · Furto identità, frodi online',
    metaDesc: 'Polizza cyber per privati e PMI: furto d\'identità, frodi online, ransomware e fermo attività. Cosa copre davvero e perché conta la retroattività.',
    ogImageAlt: 'Polizza Cyber Quootami — Privati e Imprese',
    approfondimento: {
      eyebrow: 'Come si sceglie',
      title: 'Polizza cyber: cosa copre davvero e cosa resta fuori',
      accent: 'cosa copre davvero',
      intro: 'È il ramo con le differenze contrattuali più marcate fra una compagnia e l\'altra: due polizze con lo stesso nome possono coprire cose molto diverse.',
      blocchi: [
        {
          h3: 'Per un privato: identità, conti e acquisti online',
          p: [
            'Le coperture rivolte alle persone fisiche intervengono in genere su tre fronti: l\'uso fraudolento dei dati personali e dei documenti, le operazioni non autorizzate su conti e carte quando la banca non rimborsa, e gli acquisti online in cui il bene pagato non arriva o è diverso da quello promesso.',
            'Accanto all\'indennizzo, la parte spesso più utile è l\'assistenza: supporto legale per il ripristino dell\'identità, aiuto nella rimozione di contenuti diffamatori, gestione delle comunicazioni verso banche e piattaforme. Sono servizi che valgono più del rimborso, perché il danno da furto d\'identità è soprattutto tempo.',
          ],
        },
        {
          h3: 'Per un\'impresa: il fermo attività è la voce che pesa',
          p: [
            'Nelle polizze per le imprese il danno più rilevante raramente è il dato perso: è l\'interruzione dell\'attività. Un attacco ransomware che blocca i sistemi per giorni produce un danno economico che supera di molto il costo del ripristino tecnico. Va verificato se la garanzia di business interruption è presente, da quale momento decorre e per quanti giorni opera.',
            'Le altre voci da controllare sono la responsabilità verso terzi per i dati altrui compromessi, i costi di notifica e gestione della violazione, e la copertura delle sanzioni amministrative, che non tutte le polizze includono e che in alcuni casi la legge non consente di assicurare.',
          ],
        },
        {
          h3: 'L\'obbligo di notifica al Garante corre in fretta',
          p: [
            'In caso di violazione dei dati personali l\'art. 33 del GDPR impone al titolare del trattamento di notificare l\'accaduto all\'autorità di controllo senza ingiustificato ritardo e, ove possibile, entro 72 ore da quando ne è venuto a conoscenza. Quando la violazione comporta un rischio elevato per i diritti degli interessati, l\'art. 34 impone di informare anche le persone coinvolte.',
            'Sono termini che si esauriscono nel giro di un fine settimana. Le polizze che includono un servizio di risposta all\'incidente con contatto immediato di consulenti tecnici e legali sono quelle che fanno la differenza proprio in questa fase.',
          ],
        },
        {
          h3: 'Retroattività: la clausola che si dimentica',
          p: [
            'Gli attacchi informatici hanno spesso una latenza lunga: l\'intrusione avviene mesi prima che il danno si manifesti. Se la polizza copre solo gli eventi verificatisi dopo la decorrenza, un attacco iniziato prima resta scoperto anche se si manifesta durante la validità del contratto. Verificare la presenza e l\'estensione della retroattività è tanto importante quanto il massimale.',
          ],
        },
      ],
      fonti: 'Reg. UE 2016/679 (GDPR), artt. 33 e 34; D.Lgs. 138/2024 di recepimento della direttiva NIS2.',
    },
    coverages: {
      title: 'Cosa copre la polizza cyber',
      sub: 'Per privati e PMI.',
      items: [
        { title: 'Furto identità', desc: 'Tutela in caso di clonazione dati anagrafici, account social.', color: 'red' },
        { title: 'Frodi online', desc: 'Rimborso per phishing, frode su pagamenti elettronici, e-commerce.', color: 'navy' },
        { title: 'Ransomware (PMI)', desc: 'Spese di ripristino di dati e sistemi, consulenza forense, danni da fermo attività.', color: 'amber' },
        { title: 'Tutela legale', desc: 'Spese legali per controversie digitali, denunce, recupero crediti.', color: 'green' },
        { title: 'Reputazione', desc: 'Spese per rimozione contenuti diffamatori, gestione crisi reputazionale.', color: 'violet' },
        { title: 'Assistenza tecnica', desc: 'Supporto IT 24/7 per incidenti, recupero dati, ripristino sistemi.', color: 'blue' },
      ],
    },
    process: {
      title: 'Come funziona.',
      steps: [
        { title: 'Compila la richiesta', desc: 'Profilo (privato o impresa), uso digitale, eventuali asset digitali.' },
        { title: 'Quootami valuta', desc: 'Analisi delle compagnie cyber specializzate.' },
        { title: 'Ricevi il preventivo', desc: 'Entro 24h proposta con massimali e franchigie.' },
        { title: 'Sottoscrivi', desc: 'Firma digitale, polizza attiva immediatamente.' },
      ],
    },
    faq: {
      title: 'Le risposte che cerchi.',
      items: [
        { q: 'Mi serve anche se non faccio acquisti online?', a: 'Sì. Bastano SPID, email e un conto online per essere esposti: phishing, furto d\'identità e frodi sui pagamenti colpiscono anche chi usa poco internet.' },
        { q: 'Per la mia PMI è obbligatoria?', a: 'No, non è obbligatoria per legge (a differenza della catastrofale). È però molto consigliata: un attacco ransomware può fermare l\'azienda per giorni e la polizza copre i costi di ripristino.' },
        { q: 'Cosa NON copre?', a: 'Dipende dalla compagnia, ma in genere sono escluse le perdite da investimenti (es. criptovalute), le violazioni commesse volontariamente e gli incidenti avvenuti prima della sottoscrizione. Quootami ti evidenzia le esclusioni prima della firma.' },
      ],
    },
  },

  'polizza-animali': {
    slug: 'polizza-animali',
    category: 'privati',
    title: 'Polizza Animali',
    shortDesc: 'RC e veterinario.',
    hero: {
      eyebrow: 'Cani e gatti',
      h1Lead: 'Polizza cane e gatto,',
      h1Accent: 'senza sorprese.',
      sub: 'Spese veterinarie, RC danni a terzi, smarrimento, decesso. Pensa a lui come a un membro della famiglia.',
    },
    metaTitle: 'Polizza Animali · Veterinario e RC',
    metaDesc: 'Assicurazione per cani e gatti: rimborso delle spese veterinarie e responsabilità civile per i danni a terzi. Quanto si detrae e cosa resta escluso.',
    ogImageAlt: 'Polizza Animali Quootami — Cani e gatti',
    approfondimento: {
      eyebrow: 'Come si sceglie',
      title: 'Assicurare cane e gatto: responsabilità e spese veterinarie',
      accent: 'responsabilità',
      intro: 'Sono due esigenze distinte, con logiche diverse: una riguarda i danni che l\'animale causa agli altri, l\'altra le cure di cui ha bisogno lui.',
      blocchi: [
        {
          h3: 'Del danno risponde il proprietario, anche se l\'animale è scappato',
          p: [
            'L\'art. 2052 del Codice civile stabilisce che il proprietario di un animale, o chi se ne serve per il tempo in cui lo ha in uso, risponde dei danni causati, sia che l\'animale fosse sotto la sua custodia sia che fosse smarrito o fuggito. L\'unica esimente è il caso fortuito.',
            'È una responsabilità particolarmente severa, perché non richiede di dimostrare una disattenzione: basta il nesso fra l\'animale e il danno. Un morso a un passante, una caduta di ciclista causata da un cane libero, un danno a cose altrui rientrano tutti in questo perimetro. La garanzia di responsabilità civile è talvolta già compresa nell\'RC capofamiglia di una polizza casa: prima di stipularne una nuova conviene verificare se esiste già e con quali limiti.',
          ],
        },
        {
          h3: 'Spese veterinarie: contano i sottomassimali, non il massimale',
          p: [
            'Le coperture sanitarie per animali hanno quasi sempre uno scoperto a carico del proprietario e limiti per singolo evento o per anno. Il numero grande esposto in copertina dice poco: quello che determina il rimborso reale sono i sottolimiti su interventi chirurgici, diagnostica, ricovero e terapie prolungate.',
            'Vanno verificate anche le esclusioni ricorrenti: patologie preesistenti o congenite, limiti di età alla stipula e al rinnovo, alcune razze predisposte a patologie specifiche, e i periodi di carenza, che per le malattie sono in genere più lunghi che per gli infortuni.',
          ],
        },
        {
          h3: 'Quanto si detrae in dichiarazione',
          p: [
            'Le spese veterinarie per gli animali detenuti legalmente a scopo di compagnia o per la pratica sportiva danno diritto alla detrazione del 19%, calcolata sulla parte che eccede la franchigia di 129,11 euro e fino a un importo massimo di 550 euro. Il beneficio massimo effettivo è quindi di circa 80 euro.',
            'Il tetto è per contribuente e non aumenta con il numero di animali posseduti. Rientrano le prestazioni del veterinario, i medicinali da lui prescritti e le analisi di laboratorio; il pagamento deve avvenire con strumenti tracciabili. Le spese rimborsate dalla polizza non sono detraibili, perché non restano a carico del contribuente.',
          ],
        },
        {
          h3: 'Prima di stipulare',
          p: [
            'Il cane deve essere iscritto all\'anagrafe canina e identificato con microchip: gli adempimenti sono disciplinati a livello regionale e sono comunque un presupposto pratico per la gestione di qualunque pratica assicurativa o veterinaria.',
          ],
        },
      ],
      fonti: 'Art. 2052 Codice civile; art. 15 c.1 lett. c-bis TUIR (D.P.R. 917/1986); Agenzia delle Entrate, guida alle spese veterinarie.',
    },
    coverages: {
      title: 'Cosa copre la polizza animali',
      sub: 'Una protezione per chi vive in famiglia con un animale.',
      items: [
        { title: 'Spese veterinarie', desc: 'Visite, esami, interventi chirurgici, ricoveri, terapie.', color: 'red' },
        { title: 'RC danni a terzi', desc: 'Copre i danni che il tuo animale provoca a persone o cose. Dei danni risponde sempre il proprietario (art. 2052 c.c.).', color: 'navy' },
        { title: 'Smarrimento', desc: 'Spese di ricerca, premio per chi lo ritrova.', color: 'amber' },
        { title: 'Decesso accidentale', desc: 'Indennizzo in caso di decesso da infortunio.', color: 'violet' },
        { title: 'Assistenza viaggio', desc: 'Spese veterinarie all\'estero, rimpatrio sanitario.', color: 'teal' },
      ],
    },
    process: {
      title: 'Come funziona.',
      steps: [
        { title: 'Compila la richiesta', desc: 'Specie (cane/gatto), razza, età, eventuali patologie pregresse.' },
        { title: 'Quootami valuta', desc: 'Confronto compagnie partner specializzate in animali.' },
        { title: 'Ricevi il preventivo', desc: 'Proposta con massimali e franchigie spiegate.' },
        { title: 'Sottoscrivi', desc: 'Firma digitale, polizza attiva.' },
      ],
    },
    faq: {
      title: 'Le risposte che cerchi.',
      items: [
        { q: 'Anche se ha già una patologia?', a: 'Dipende dalla compagnia. Alcune escludono le patologie preesistenti dichiarate, altre le coprono con sovrapremio. Importante dichiararle al momento della sottoscrizione.' },
        { q: 'Cosa copre la RC?', a: 'I danni che il tuo animale provoca a terzi: morsi, danni alle cose, incidenti causati da lui (es. cane che attraversa la strada e fa cadere un ciclista).' },
        { q: 'C\'è un\'età massima?', a: 'Varia per compagnia: in genere la prima sottoscrizione è possibile entro gli 8-10 anni di età. Molte compagnie poi rinnovano senza limiti di età, ma le condizioni cambiano da polizza a polizza: Quootami le verifica prima di proporti la soluzione.' },
      ],
    },
  },

  'rc': {
    slug: 'rc',
    category: 'imprese',
    title: 'RC Professionale & PMI',
    shortDesc: 'RC professionale, Catastrofale, Cyber business.',
    hero: {
      eyebrow: 'Imprese e professionisti',
      h1Lead: 'RC professionale e PMI,',
      h1Accent: 'al sicuro.',
      sub: 'RC professionale, Catastrofale PMI obbligatoria, Cyber business: tutta la protezione per la tua impresa.',
    },
    metaTitle: 'RC Professionale e Catastrofale PMI',
    metaDesc: 'RC professionale obbligatoria per gli iscritti agli albi, RCT e RCO per le imprese e copertura catastrofale. Claims made, retroattività e ultrattività spiegate.',
    ogImageAlt: 'RC Professionale e Catastrofale PMI — Quootami',
    approfondimento: {
      eyebrow: 'Come si sceglie',
      title: 'RC professionale e imprese: obblighi e clausole da leggere',
      accent: 'obblighi',
      intro: 'Per i professionisti iscritti a un albo la copertura è un obbligo di legge. Per le imprese l\'obbligo riguarda oggi anche gli eventi catastrofali.',
      blocchi: [
        {
          h3: 'Per i professionisti la polizza è obbligatoria',
          p: [
            'L\'art. 5 del D.P.R. 137/2012 impone al professionista iscritto a un albo di stipulare una polizza a copertura dei danni derivanti dall\'esercizio dell\'attività, e di comunicarne gli estremi al cliente al momento dell\'incarico. È un obbligo deontologico prima ancora che contrattuale: la sua violazione è rilevante sul piano disciplinare.',
            'Alcune categorie hanno regole proprie e più stringenti. In ambito sanitario la L. 24/2017 disciplina in modo specifico gli obblighi assicurativi delle strutture e degli esercenti la professione sanitaria.',
          ],
        },
        {
          h3: 'Claims made: la clausola che determina se sei coperto',
          p: [
            'Quasi tutte le polizze di responsabilità professionale operano in regime claims made: vale la data in cui il danneggiato presenta la richiesta di risarcimento, non quella in cui è stato commesso l\'errore. Due parametri diventano allora decisivi.',
            'La retroattività stabilisce da quando indietro nel tempo sono coperti i comportamenti professionali: senza un\'adeguata retroattività, un errore di tre anni fa contestato oggi resta scoperto. L\'ultrattività, o postuma, copre invece le richieste che arrivano dopo la cessazione del contratto o dell\'attività — situazione tutt\'altro che rara, visto che le contestazioni professionali emergono spesso a distanza di anni.',
          ],
        },
        {
          h3: 'Per le imprese: RCT, RCO e la distinzione fra le due',
          p: [
            'La responsabilità civile verso terzi (RCT) copre i danni che l\'attività dell\'impresa provoca a persone o cose estranee. La responsabilità civile verso i prestatori d\'opera (RCO) riguarda invece gli infortuni dei propri dipendenti, ed è la garanzia che interviene sulle azioni di rivalsa dell\'INAIL e sulle richieste di danno differenziale.',
            'Sono coperture distinte e vanno entrambe verificate: un\'impresa con dipendenti che ha solo l\'RCT ha una lacuna su uno degli scenari più costosi.',
          ],
        },
        {
          h3: 'L\'obbligo di copertura catastrofale',
          p: [
            'Le imprese con sede legale in Italia, o con stabile organizzazione nel territorio, tenute all\'iscrizione nel registro delle imprese, devono stipulare una copertura contro i danni ai beni aziendali causati da calamità naturali ed eventi catastrofali. L\'obbligo riguarda terreni, fabbricati, impianti, macchinari e attrezzature.',
            'Le scadenze sono state differenziate in base alla dimensione dell\'impresa e sono ormai maturate per la generalità dei soggetti obbligati. La copertura riguarda cinque eventi precisi — sismi, alluvioni, frane, inondazioni ed esondazioni — mentre grandine, trombe d\'aria e mareggiate restano fuori dal perimetro dell\'obbligo e vanno eventualmente aggiunte a parte.',
          ],
        },
      ],
      fonti: 'Art. 5 D.P.R. 137/2012; L. 24/2017 per l\'ambito sanitario; L. 213/2023 art. 1 commi 101-111 e successive modifiche sull\'obbligo di copertura catastrofale.',
    },
    coverages: {
      title: 'Coperture per la tua attività',
      sub: 'Da libero professionista a PMI strutturata.',
      items: [
        { title: 'RC Professionale', desc: 'Copre i danni a terzi causati nell\'esercizio della professione. Obbligatoria per le professioni ordinistiche.', required: true, color: 'navy' },
        { title: 'Catastrofale PMI', desc: 'Obbligatoria per legge: terremoto, alluvione, esondazione, frana su fabbricati, impianti e attrezzature.', required: true, color: 'red' },
        { title: 'Cyber business', desc: 'Attacchi informatici, ransomware, perdita dati clienti.', color: 'amber' },
        { title: 'Tutela legale', desc: 'Spese legali per controversie professionali e contrattuali.', color: 'green' },
        { title: 'D&O (Amministratori)', desc: 'Responsabilità civile di amministratori e dirigenti.', color: 'violet' },
        { title: 'Infortuni dipendenti', desc: 'Indennizzo per infortuni occorsi al personale.', color: 'teal' },
      ],
    },
    process: {
      title: 'Come funziona.',
      steps: [
        { title: 'Compila la richiesta', desc: 'Attività, fatturato, dipendenti, sede, copertura richiesta.' },
        { title: 'Quootami valuta', desc: 'Analisi delle compagnie specializzate nel tuo settore.' },
        { title: 'Ricevi il preventivo', desc: 'Proposta con massimali e franchigie tarate sull\'azienda.' },
        { title: 'Sottoscrivi', desc: 'Firma digitale, polizza attiva.' },
      ],
    },
    faq: {
      title: 'Le risposte che cerchi.',
      items: [
        { q: 'La Catastrofale PMI è davvero obbligatoria?', a: 'Sì. L\'obbligo, introdotto dalla Legge di Bilancio 2024 (L. 213/2023), è ormai in vigore per le imprese di ogni dimensione: le scadenze scaglionate (grandi 31/3/2025, medie 1/10/2025, micro e piccole 1/1/2026) sono tutte passate. Sono escluse le imprese agricole, coperte dal fondo pubblico AgriCat. Chi non è in regola perde l\'accesso a contributi e agevolazioni pubbliche. Quootami ti aiuta a metterti in regola rapidamente.' },
        { q: 'Per la mia professione mi serve la RC?', a: 'È obbligatoria per molte professioni regolamentate (avvocati, commercialisti, ingegneri, medici, architetti, ecc.). Per i forfettari e ditte individuali è altamente raccomandata.' },
        { q: 'Posso unire più coperture?', a: 'Sì. Quootami spesso propone soluzioni "all-in-one" che includono RC + Cyber + Catastrofale a costo inferiore della somma delle singole.' },
      ],
    },
  },
};

// Helpers
export function getPolizza(slug: string): Polizza | undefined {
  return POLIZZE[slug];
}

export function getAllPolizze(): Polizza[] {
  return Object.values(POLIZZE);
}

export function getPolizzeByCategory(category: Polizza['category']): Polizza[] {
  return getAllPolizze().filter(p => p.category === category);
}
