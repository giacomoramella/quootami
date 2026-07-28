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
};

export const PREVENTIVO_FIELDS: Record<string, PreventivoField[]> = {
  rc: [
    { name: 'ragione_sociale', label: 'Ragione sociale', type: 'text', required: true, full: true },
    { name: 'piva', label: 'Partita IVA', type: 'text', placeholder: 'facoltativa' },
    { name: 'attivita', label: 'Attività svolta', type: 'text', required: true, placeholder: 'es. officina, studio, negozio' },
    { name: 'fatturato', label: 'Fatturato annuo', type: 'number', suffix: '€', placeholder: '100.000' },
    { name: 'dipendenti', label: 'N° dipendenti', type: 'number', placeholder: '0' },
    { name: 'garanzie', label: 'Garanzie che cerchi', type: 'checkboxes', full: true,
      options: ['Responsabilità Civile (RCT)', 'Responsabilità prestatore di lavoro (RCO)', 'Catastrofale PMI', 'Altro'] },
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
