/**
 * Quootami — Campi del "preventivo rapido" specifici per prodotto.
 * ============================================================
 * Ogni pagina prodotto mostra un form con campi diversi, guidati da questa
 * mappa (chiave = slug della polizza). I campi contatto (Nome, Email, Telefono)
 * e il consenso GDPR sono comuni e gestiti dal componente PreventivoForm.
 *
 * Prodotti con flusso proprio (piano-pensione, luce) non compaiono qui.
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
export const PREVENTIVO_ALLEGATO: Record<
  string,
  { etichetta: string; titolo: string; descrizione: string }
> = {
  rc: {
    etichetta: 'Allega la visura camerale',
    titolo: 'Allega la visura camerale',
    descrizione:
      'Se hai la visura camerale a portata di mano, allegala: contiene già tutti i dati dell\'attività. Bastano i tuoi recapiti e il CAP.',
  },
};

export const PREVENTIVO_FIELDS: Record<string, PreventivoField[]> = {
  // RC professionale e Catastrofale PMI. Il cliente è sempre un'impresa o un
  // professionista, quindi P.IVA e CAP sono obbligatori: senza P.IVA il
  // soggetto non è identificabile e senza CAP non si conosce la provincia, che
  // serve sia per quotare sia per sapere chi si sta richiamando.
  rc: [
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
    { name: 'cap', label: 'CAP di residenza', type: 'text', required: true, placeholder: '13900',
      pattern: '^\\d{5}$', patternMessage: 'Il CAP è composto da 5 cifre' },
    { name: 'attivita', label: 'Attività o professione', type: 'text', required: true, full: true,
      placeholder: 'es. studio commercialista, officina, impresa edile' },
    { name: 'dipendenti', label: 'N° dipendenti', type: 'number', placeholder: '0' },
    // Il massimale è il primo parametro su cui le compagnie quotano: senza,
    // il preventivo non si può nemmeno impostare.
    { name: 'massimale', label: 'Massimale della polizza', type: 'select',
      options: ['500.000 €', '1.000.000 €', '1.500.000 €'] },
    // La scadenza dice quando richiamare: una polizza in scadenza fra un mese
    // è un cliente che decide adesso, una appena rinnovata no.
    { name: 'polizza_attuale', label: 'Hai già una polizza?', type: 'select',
      options: ['No, è la prima', 'Sì, scade entro 3 mesi', 'Sì, scade oltre 3 mesi', 'Non so'] },
    { name: 'garanzie', label: 'Garanzie che cerchi', type: 'checkboxes', full: true,
      options: ['RC professionale', 'Responsabilità Civile verso terzi (RCT)', 'Responsabilità prestatore di lavoro (RCO)', 'Catastrofale PMI', 'Tutela legale', 'Altro'] },
  ],

  'polizza-auto': [
    { name: 'targa', label: 'Targa', type: 'text', required: true, placeholder: 'AB123CD' },
    { name: 'tipo_veicolo', label: 'Tipo di veicolo', type: 'select', required: true,
      options: ['Auto', 'Moto', 'Autocarro', 'Altro'] },
    { name: 'uso', label: 'Uso del veicolo', type: 'select', options: ['Privato', 'Professionale'] },
    { name: 'garanzie', label: 'Garanzie che cerchi', type: 'checkboxes', full: true,
      options: ['RC Auto', 'Furto e Incendio', 'Kasko', 'Assistenza stradale', 'Tutela legale'] },
  ],

  'polizza-casa': [
    { name: 'tipo_immobile', label: 'Tipo di immobile', type: 'select', required: true,
      options: ['Appartamento', 'Villa / Villetta', 'Altro'] },
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
    { name: 'settore', label: 'Settore di attività', type: 'text', required: true, full: true,
      placeholder: 'es. e-commerce, studio professionale, azienda manifatturiera' },
    { name: 'fatturato', label: 'Fatturato annuo', type: 'number', suffix: '€', placeholder: '100.000' },
    { name: 'dipendenti', label: 'N° dipendenti', type: 'number', placeholder: '0' },
    { name: 'incidenti', label: 'Hai già subìto attacchi informatici?', type: 'select', full: true,
      options: ['No', 'Sì', 'Non so'] },
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
