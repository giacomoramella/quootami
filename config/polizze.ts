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

export type Polizza = {
  slug: string;
  category: 'privati' | 'imprese' | 'previdenza';
  title: string;
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
};

export const POLIZZE: Record<string, Polizza> = {
  'polizza-auto': {
    slug: 'polizza-auto',
    category: 'privati',
    title: 'Polizza Auto',
    hero: {
      eyebrow: 'RC Auto obbligatoria · Furto, Incendio & Kasko',
      h1Lead: "Quootami l'RC",
      h1Accent: 'giusta.',
      sub: 'Confronto multi-compagnia per trovare la polizza migliore per il tuo veicolo.',
    },
    metaTitle: 'Polizza Auto · Confronto RC, Furto, Incendio, Kasko',
    metaDesc: 'Polizza auto Quootami: confronto multi-compagnia per RC obbligatoria, Furto, Incendio e Kasko. Preventivo gratuito senza impegno.',
    ogImageAlt: 'Polizza Auto Quootami — RC Auto, Furto, Incendio, Kasko',
    coverages: {
      title: 'Cosa copre la polizza auto',
      sub: 'Dalla RC obbligatoria alle garanzie accessorie: scegli il livello di protezione adatto.',
      items: [
        { title: 'RC Auto', desc: 'Copre i danni che provochi a terzi alla guida.', required: true, color: 'navy' },
        { title: 'Furto e Incendio', desc: 'Rimborso in caso di furto, tentato furto, incendio o esplosione.', color: 'red' },
        { title: 'Kasko', desc: 'Copre i danni al tuo veicolo anche se la colpa è tua.', color: 'amber' },
        { title: 'Eventi naturali', desc: 'Grandine, alluvioni, trombe d\'aria, atti vandalici.', color: 'violet' },
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
        { q: 'Con quali compagnie lavora Quootami?', a: 'Quootami collabora con le principali compagnie italiane (Generali, UnipolSai, Allianz, AXA, Zurich e altre).' },
        { q: 'Posso disdire la mia polizza attuale?', a: 'Sì. La RC Auto si rinnova ogni 12 mesi e non c\'è tacito rinnovo. Quootami gestisce tutto il passaggio senza interruzioni.' },
      ],
    },
  },

  'polizza-casa': {
    slug: 'polizza-casa',
    category: 'privati',
    title: 'Polizza Casa',
    hero: {
      eyebrow: 'Casa e famiglia',
      h1Lead: 'Proteggi la tua',
      h1Accent: 'casa.',
      sub: 'Una sola polizza per furto, incendio, eventi naturali e RC capofamiglia.',
    },
    metaTitle: 'Polizza Casa · Furto, Incendio, RC capofamiglia',
    metaDesc: 'Polizza casa Quootami: confronto delle migliori coperture per furto, incendio, eventi atmosferici, RC capofamiglia. Preventivo gratuito.',
    ogImageAlt: 'Polizza Casa Quootami — Furto, Incendio, RC capofamiglia',
    coverages: {
      title: 'Cosa copre la polizza casa',
      sub: 'Una protezione modulare per casa e famiglia.',
      items: [
        { title: 'Incendio e scoppio', desc: 'Danni da incendio, fulmine, esplosione, fumo.', required: true, color: 'red' },
        { title: 'Furto', desc: 'Furto, rapina, scippo, danni da effrazione.', color: 'navy' },
        { title: 'RC capofamiglia', desc: 'Danni causati a terzi da te, dai tuoi familiari, dai tuoi animali domestici.', color: 'teal' },
        { title: 'Eventi atmosferici', desc: 'Grandine, alluvione, vento, neve.', color: 'blue' },
        { title: 'Catastrofali', desc: 'Terremoto, alluvione, frana — copertura crescente per legge.', color: 'violet' },
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
        { q: 'La polizza casa copre anche se ho un mutuo?', a: 'Sì. Anzi, le banche spesso richiedono polizza incendio obbligatoria per concedere il mutuo. Quootami può aiutarti a sostituire quella della banca con una più conveniente.' },
        { q: 'Sono coperto se faccio danni nel condominio?', a: 'Sì con la RC capofamiglia: copre i danni che provochi tu o i tuoi familiari a terzi, vicini, parti comuni.' },
      ],
    },
  },

  'salute': {
    slug: 'salute',
    category: 'privati',
    title: 'Salute & Vita',
    hero: {
      eyebrow: 'Salute, vita, infortuni',
      h1Lead: 'La tua salute,',
      h1Accent: 'tutelata.',
      sub: 'Polizze sanitarie, vita e infortuni per ridurre le spese mediche e proteggere chi ami.',
    },
    metaTitle: 'Polizza Salute, Vita e Infortuni',
    metaDesc: 'Polizze sanitarie, vita e infortuni con Quootami: rimborso visite, ricoveri, interventi. Confronto multi-compagnia.',
    ogImageAlt: 'Polizza Salute Quootami — Sanitaria, Vita, Infortuni',
    coverages: {
      title: 'Cosa copre la polizza salute',
      sub: 'Diverse formule per esigenze diverse.',
      items: [
        { title: 'Ricoveri e interventi', desc: 'Spese di ricovero, intervento chirurgico, day hospital.', required: true, color: 'red' },
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
      ],
    },
  },

  'piano-pensione': {
    slug: 'piano-pensione',
    category: 'previdenza',
    title: 'Fondo Pensione',
    hero: {
      eyebrow: 'Previdenza complementare',
      h1Lead: 'Il tuo futuro,',
      h1Accent: 'con vantaggio fiscale.',
      sub: 'Deduci fino a €5.300/anno dal reddito IRPEF e costruisci la pensione integrativa.',
    },
    metaTitle: 'Fondo Pensione · Deduzione fiscale fino a €5.300',
    metaDesc: 'Fondo pensione complementare con deducibilità fiscale fino a €5.300/anno. Confronto Quootami delle migliori soluzioni.',
    ogImageAlt: 'Fondo Pensione Quootami — Previdenza complementare e deduzione fiscale',
    coverages: {
      title: 'Vantaggi del fondo pensione',
      sub: 'Tre benefici fiscali che lo Stato riserva alla previdenza complementare.',
      items: [
        { title: 'Deduzione fiscale', desc: 'Deduci fino a €5.300/anno dal reddito IRPEF — risparmio immediato in tasse.', required: true, color: 'green' },
        { title: 'Tassazione agevolata', desc: 'I rendimenti sono tassati al 20% (vs 26% degli altri investimenti).', color: 'navy' },
        { title: 'Tassazione finale ridotta', desc: 'Al momento della pensione paghi dal 15% al 9% (dopo 35 anni).', color: 'teal' },
        { title: 'Impignorabile', desc: 'Il fondo pensione è impignorabile e non rientra nell\'asse ereditario.', color: 'violet' },
        { title: 'Anticipazioni', desc: 'Possibili anticipi per spese sanitarie, prima casa, altre esigenze.', color: 'amber' },
        { title: 'Trasferibile', desc: 'Puoi trasferire la posizione a un altro fondo dopo 2 anni, senza penali.', color: 'blue' },
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
        { q: 'Conviene sempre il fondo pensione?', a: 'Dipende dalla tua aliquota IRPEF marginale, dal costo del fondo e dall\'orizzonte temporale. Quootami fa un calcolo personalizzato per dirti in euro quanto guadagni.' },
        { q: 'Quando posso prelevare i soldi?', a: 'Al momento della pensione (almeno 5 anni di partecipazione). Sono possibili anticipi per spese sanitarie (75%), prima casa (75%, dopo 8 anni), altre esigenze (30%, dopo 8 anni).' },
        { q: 'Posso cambiare fondo se ne trovo uno migliore?', a: 'Sì, dopo almeno 2 anni puoi trasferire la posizione senza penali e senza tassazione.' },
      ],
    },
  },

  'cyber': {
    slug: 'cyber',
    category: 'privati',
    title: 'Cyber',
    hero: {
      eyebrow: 'Protezione digitale',
      h1Lead: 'Vita digitale,',
      h1Accent: 'protetta.',
      sub: 'Copertura per furto identità, frodi online, attacchi cyber, danni reputazionali.',
    },
    metaTitle: 'Polizza Cyber · Furto identità, frodi online',
    metaDesc: 'Polizza cyber Quootami per privati e PMI: protezione contro furto identità, frodi online, ransomware, danni reputazionali.',
    ogImageAlt: 'Polizza Cyber Quootami — Privati e Imprese',
    coverages: {
      title: 'Cosa copre la polizza cyber',
      sub: 'Per privati e PMI.',
      items: [
        { title: 'Furto identità', desc: 'Tutela in caso di clonazione dati anagrafici, account social.', color: 'red' },
        { title: 'Frodi online', desc: 'Rimborso per phishing, frode su pagamenti elettronici, e-commerce.', color: 'navy' },
        { title: 'Ransomware (PMI)', desc: 'Spese di ripristino, eventuale riscatto, consulenza forense.', color: 'amber' },
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
        { q: 'Mi serve anche se non faccio acquisti online?', a: 'Sì. L\'esposizione cyber include anche social media, email, identità digitale (SPID/CIE), conti bancari. La maggior parte degli attacchi avviene su persone che usano poco internet.' },
        { q: 'Per la mia PMI è obbligatoria?', a: 'Non obbligatoria, ma vivamente consigliata. Un attacco ransomware può fermare l\'azienda per giorni; la polizza copre i costi di ripristino.' },
        { q: 'Cosa NON copre?', a: 'In genere sono escluse le perdite finanziarie derivanti da investimenti speculativi (es. cripto su exchange non sicuri).' },
      ],
    },
  },

  'polizza-animali': {
    slug: 'polizza-animali',
    category: 'privati',
    title: 'Polizza Animali',
    hero: {
      eyebrow: 'Cani e gatti',
      h1Lead: 'Il tuo amico a 4 zampe,',
      h1Accent: 'tutelato.',
      sub: 'Spese veterinarie, RC danni a terzi, smarrimento, decesso. Pensa a lui come a un membro della famiglia.',
    },
    metaTitle: 'Polizza Animali · Veterinario e RC',
    metaDesc: 'Polizza per cani e gatti: rimborso spese veterinarie, RC per danni a terzi, smarrimento. Quootami confronta le migliori coperture.',
    ogImageAlt: 'Polizza Animali Quootami — Cani e gatti',
    coverages: {
      title: 'Cosa copre la polizza animali',
      sub: 'Una protezione per chi vive in famiglia con un animale.',
      items: [
        { title: 'Spese veterinarie', desc: 'Visite, esami, interventi chirurgici, ricoveri, terapie.', color: 'red' },
        { title: 'RC danni a terzi', desc: 'Copre i danni che il tuo animale provoca a persone o cose.', required: true, color: 'navy' },
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
        { q: 'C\'è un\'età massima?', a: 'Varia per compagnia, in genere si sottoscrive entro 8-10 anni di età. Una volta sottoscritta, la polizza dura per tutta la vita dell\'animale.' },
      ],
    },
  },

  'rc': {
    slug: 'rc',
    category: 'imprese',
    title: 'RC Professionale & PMI',
    hero: {
      eyebrow: 'Imprese e professionisti',
      h1Lead: 'La tua attività,',
      h1Accent: 'al sicuro.',
      sub: 'RC professionale, Catastrofale PMI obbligatoria, Cyber business: tutta la protezione per la tua impresa.',
    },
    metaTitle: 'RC Professionale e Catastrofale PMI',
    metaDesc: 'RC professionale per liberi professionisti, Catastrofale PMI obbligatoria (Legge 213/2023), Cyber business. Confronto Quootami.',
    ogImageAlt: 'RC Professionale e Catastrofale PMI — Quootami',
    coverages: {
      title: 'Coperture per la tua attività',
      sub: 'Da libero professionista a PMI strutturata.',
      items: [
        { title: 'RC Professionale', desc: 'Copre i danni a terzi causati nell\'esercizio della professione.', required: true, color: 'navy' },
        { title: 'Catastrofale PMI', desc: 'Obbligatoria per legge: terremoto, alluvione, frana sui beni aziendali.', required: true, color: 'red' },
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
        { q: 'La Catastrofale PMI è davvero obbligatoria?', a: 'Sì. La Legge di Bilancio 2024 (213/2023) ha introdotto l\'obbligo per tutte le imprese iscritte al Registro delle Imprese di stipulare una polizza catastrofale entro il 31/03/2025 (termini estesi). Quootami ti aiuta a essere in regola.' },
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
