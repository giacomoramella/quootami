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

export const PREVENTIVO_FIELDS: Record<string, PreventivoField[]> = {
  // RC professionale e Catastrofale PMI. Il cliente è sempre un'impresa o un
  // professionista, quindi P.IVA e CAP sono obbligatori: senza P.IVA il
  // soggetto non è identificabile e senza CAP non si conosce la provincia, che
  // serve sia per quotare sia per sapere chi si sta richiamando.
  rc: [
    { name: 'ragione_sociale', label: 'Ragione sociale o nome dello studio', type: 'text', required: true, full: true },
    { name: 'piva', label: 'Partita IVA', type: 'text', required: true, placeholder: '11 cifre',
      pattern: '^\\d{11}$', patternMessage: 'La partita IVA è composta da 11 cifre' },
    { name: 'cap', label: 'CAP della sede', type: 'text', required: true, placeholder: '13900',
      pattern: '^\\d{5}$', patternMessage: 'Il CAP è composto da 5 cifre' },
    { name: 'soggetto', label: 'Tipo di soggetto', type: 'select', required: true,
      options: ['Professionista iscritto a un albo', 'Impresa', 'Ditta individuale', 'Altro'] },
    { name: 'attivita', label: 'Attività o professione', type: 'text', required: true, full: true,
      placeholder: 'es. studio commercialista, officina, impresa edile' },
    { name: 'fatturato', label: 'Fatturato annuo', type: 'number', suffix: '€', placeholder: '100.000' },
    { name: 'dipendenti', label: 'N° dipendenti', type: 'number', placeholder: '0' },
    // Il massimale è il primo parametro su cui le compagnie quotano: senza,
    // il preventivo non si può nemmeno impostare.
    { name: 'massimale', label: 'Massimale desiderato', type: 'select',
      options: ['250.000 €', '500.000 €', '1.000.000 €', '2.000.000 € o più', 'Non so, mi faccio consigliare'] },
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
