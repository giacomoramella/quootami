/**
 * Quootami — Campi del "preventivo rapido" specifici per prodotto.
 * ============================================================
 * Ogni pagina prodotto mostra un form con campi diversi, guidati da questa
 * mappa (chiave = slug della polizza). I campi contatto (Nome, Email, Telefono)
 * e il consenso GDPR sono comuni e gestiti dal componente PreventivoForm.
 *
 * Prodotti con flusso proprio (piano-pensione) non compaiono qui.
 */

export type PreventivoFieldType = 'text' | 'number' | 'select' | 'checkboxes';

export type PreventivoField = {
  /** chiave tecnica (usata in email + messaggio Supabase) */
  name: string;
  label: string;
  type: PreventivoFieldType;
  /** opzioni per select / checkboxes */
  options?: string[];
  placeholder?: string;
  required?: boolean;
  /** suffisso mostrato a destra (es. '€', 'mq') */
  suffix?: string;
  /** occupa l'intera larghezza nella griglia a 2 colonne */
  full?: boolean;
  /**
   * Formato atteso, validato solo se il campo è valorizzato. Serve a fermare i
   * dati inutilizzabili prima dell'invio: una richiesta RC arrivata senza P.IVA
   * e con la ragione sociale inventata non è lavorabile, e la si scopre solo
   * richiamando il cliente.
   */
  pattern?: string;
  patternMessage?: string;
};

/** Forme giuridiche italiane più ricorrenti fra i clienti di una RC. */
const FORME_GIURIDICHE = [
  'Libero professionista',
  'Ditta individuale',
  'Studio associato',
  'Società semplice (S.s.)',
  'S.n.c.',
  'S.a.s.',
  'S.r.l.',
  'S.r.l.s.',
  'S.p.A.',
  'Società cooperativa',
  'Associazione o ente no profit',
  'Altro',
];

/**
 * Percorso alternativo: invece di compilare l'anagrafica, il cliente allega la
 * visura camerale, che contiene già ragione sociale, forma giuridica, partita
 * IVA, codice fiscale, ATECO e sede. In quel caso bastano i recapiti, il CAP e
 * il file — meno campi da riempire, e i dati arrivano corretti dalla fonte.
 *
 * Il file finisce nel bucket privato `documenti-lead`, mai in un'email: la
 * visura contiene dati identificativi e non va spedita in chiaro.
 */
const ALLEGATO_VISURA = {
  etichetta: 'Allega la visura camerale',
  titolo: 'Allega la visura camerale',
  descrizione:
    'Se hai la visura camerale a portata di mano, allegala: contiene già tutti i dati dell\'attività. Bastano i tuoi recapiti e il CAP.',
};

export const PREVENTIVO_ALLEGATO: Record<
  string,
  { etichetta: string; titolo: string; descrizione: string }
> = {
  rc: ALLEGATO_VISURA,
  cyber: ALLEGATO_VISURA,
};

/**
 * Il CAP è obbligatorio su tutti i prodotti in cui il rischio è territoriale:
 * su auto e casa determina il premio, su imprese e professionisti serve almeno
 * a sapere in che provincia si trova chi ha scritto. L'etichetta cambia perché
 * cambia a cosa si riferisce — la residenza, il veicolo o l'immobile.
 */
function campoCap(label = 'CAP di residenza'): PreventivoField {
  return {
    name: 'cap',
    label,
    type: 'text',
    required: true,
    placeholder: '13900',
    pattern: '^\\d{5}$',
    patternMessage: 'Il CAP è composto da 5 cifre',
  };
}

/**
 * Blocco anagrafico comune ai prodotti per imprese e professionisti (rc, cyber).
 * Sono esattamente i dati che compaiono sulla visura camerale: per questo, se
 * il cliente la allega, questo blocco non viene chiesto.
 */
const CAMPI_IMPRESA: PreventivoField[] = [
  { name: 'ragione_sociale', label: 'Ragione sociale o nome dello studio', type: 'text', required: true, full: true },
  { name: 'forma_giuridica', label: 'Forma giuridica', type: 'select', required: true, options: FORME_GIURIDICHE },
  { name: 'piva', label: 'Partita IVA', type: 'text', required: true, placeholder: '11 cifre',
    pattern: '^\\d{11}$', patternMessage: 'La partita IVA è composta da 11 cifre' },
  // Facoltativo: per le società coincide con la partita IVA, per i
  // professionisti è quello personale a 16 caratteri. Il formato accetta
  // entrambi, ma solo se il campo viene compilato.
  { name: 'codice_fiscale', label: 'Codice fiscale', type: 'text', placeholder: 'facoltativo',
    pattern: '^([A-Za-z]{6}\\d{2}[A-Za-z]\\d{2}[A-Za-z]\\d{3}[A-Za-z]|\\d{11})$',
    patternMessage: 'Codice fiscale non valido (16 caratteri, o 11 cifre per le società)' },
  { name: 'ateco', label: 'Codice ATECO', type: 'text', placeholder: 'facoltativo, es. 62.01',
    pattern: '^\\d{2}(\\.\\d{1,2}){0,3}$', patternMessage: 'Formato ATECO non valido (es. 62.01 o 62.01.00)' },
  campoCap(),
];

/** Le tre soglie su cui Quootami fa quotare. */
const MASSIMALI = ['500.000 €', '1.000.000 €', '1.500.000 €'];

/**
 * La scadenza dice quando richiamare: una polizza in scadenza fra un mese è un
 * cliente che decide adesso, una appena rinnovata no.
 */
const CAMPO_POLIZZA_ATTUALE: PreventivoField = {
  name: 'polizza_attuale',
  label: 'Hai già una polizza?',
  type: 'select',
  options: ['No, è la prima', 'Sì, scade entro 3 mesi', 'Sì, scade oltre 3 mesi', 'Non so'],
};

export const PREVENTIVO_FIELDS: Record<string, PreventivoField[]> = {
  // RC professionale e Catastrofale PMI. Il cliente è sempre un'impresa o un
  // professionista, quindi P.IVA e CAP sono obbligatori: senza P.IVA il
  // soggetto non è identificabile e senza CAP non si conosce la provincia, che
  // serve sia per quotare sia per sapere chi si sta richiamando.
  rc: [
    ...CAMPI_IMPRESA,
    { name: 'attivita', label: 'Attività o professione', type: 'text', required: true, full: true,
      placeholder: 'es. studio commercialista, officina, impresa edile' },
    { name: 'dipendenti', label: 'N° dipendenti', type: 'number', placeholder: '0' },
    // Il massimale è il primo parametro su cui le compagnie quotano: senza,
    // il preventivo non si può nemmeno impostare.
    { name: 'massimale', label: 'Massimale della polizza', type: 'select', options: MASSIMALI },
    CAMPO_POLIZZA_ATTUALE,
    { name: 'garanzie', label: 'Garanzie che cerchi', type: 'checkboxes', full: true,
      options: ['RC professionale', 'Responsabilità Civile verso terzi (RCT)', 'Responsabilità prestatore di lavoro (RCO)', 'Catastrofale PMI', 'Tutela legale', 'Altro'] },
  ],

  'polizza-auto': [
    { name: 'targa', label: 'Targa', type: 'text', required: true, placeholder: 'AB123CD' },
    { name: 'tipo_veicolo', label: 'Tipo di veicolo', type: 'select', required: true,
      options: ['Auto', 'Moto', 'Autocarro', 'Altro'] },
    // Il premio RC auto dipende dalla provincia in cui il veicolo circola.
    campoCap('CAP di residenza'),
    { name: 'uso', label: 'Uso del veicolo', type: 'select', options: ['Privato', 'Professionale'] },
    { name: 'garanzie', label: 'Garanzie che cerchi', type: 'checkboxes', full: true,
      options: ['RC Auto', 'Furto e Incendio', 'Kasko', 'Assistenza stradale', 'Tutela legale'] },
  ],

  'polizza-casa': [
    { name: 'tipo_immobile', label: 'Tipo di immobile', type: 'select', required: true,
      options: ['Appartamento', 'Villa / Villetta', 'Altro'] },
    // Qui il CAP è quello dell'immobile, non del contraente: rischio furto,
    // zona sismica e alluvionale si valutano su dove sta la casa.
    campoCap('CAP dell\'immobile'),
    { name: 'mq', label: 'Metratura', type: 'number', suffix: 'mq', placeholder: '100' },
    { name: 'titolo', label: 'Sei…', type: 'select', options: ['Proprietario', 'Affittuario'] },
    { name: 'garanzie', label: 'Garanzie che cerchi', type: 'checkboxes', full: true,
      options: ['Furto', 'Incendio', 'RC capofamiglia', 'Danni da acqua', 'Assistenza casa'] },
  ],

  salute: [
    { name: 'chi', label: 'Chi vuoi assicurare', type: 'select', required: true,
      options: ['Me stesso', 'Coppia', 'Famiglia'] },
    { name: 'eta', label: "Fascia d'età", type: 'select', options: ['18-30', '31-45', '46-60', 'Over 60'] },
    { name: 'copertura', label: 'Cosa ti interessa', type: 'checkboxes', full: true,
      options: ['Rimborso spese mediche', 'Vita', 'Infortuni', 'Malattie gravi'] },
  ],

  cyber: [
    ...CAMPI_IMPRESA,
    { name: 'settore', label: 'Settore di attività', type: 'text', required: true, full: true,
      placeholder: 'es. e-commerce, studio professionale, azienda manifatturiera' },
    { name: 'dipendenti', label: 'N° dipendenti', type: 'number', placeholder: '0' },
    { name: 'massimale', label: 'Massimale della polizza', type: 'select', options: MASSIMALI },
    // Un incidente già avvenuto cambia la quotabilità del rischio: le compagnie
    // lo chiedono sempre, tanto vale saperlo prima di chiamare.
    { name: 'incidenti', label: 'Hai già subìto attacchi informatici?', type: 'select',
      options: ['No', 'Sì', 'Non so'] },
    CAMPO_POLIZZA_ATTUALE,
    { name: 'coperture', label: 'Cosa ti interessa', type: 'checkboxes', full: true,
      options: [
        'Interruzione dell\'attività',
        'Ripristino di dati e sistemi',
        'Attacchi ransomware',
        'Responsabilità verso terzi per violazione dei dati',
        'Spese legali e notifiche al Garante',
        'Altro',
      ] },
  ],

  'polizza-animali': [
    { name: 'animale', label: 'Tipo di animale', type: 'select', required: true,
      options: ['Cane', 'Gatto', 'Altro'] },
    { name: 'eta_animale', label: "Età dell'animale", type: 'text', placeholder: 'es. 3 anni' },
    { name: 'coperture', label: 'Cosa ti interessa', type: 'checkboxes', full: true,
      options: ['Spese veterinarie', 'RC danni a terzi', 'Assistenza'] },
  ],
};

export function getPreventivoFields(slug: string): PreventivoField[] {
  return PREVENTIVO_FIELDS[slug] ?? [];
}

/** Presente solo sui prodotti che ammettono la via dell'allegato (oggi: rc). */
export function getPreventivoAllegato(slug: string) {
  return PREVENTIVO_ALLEGATO[slug] ?? null;
}
