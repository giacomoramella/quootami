/**
 * Quootami — Configurazione Operatore CENTRALIZZATA
 * ============================================================
 * Questo è IL file da modificare il giorno della vendita del sito.
 * Tutti i dati personali (collaboratore RUI, broker, contatti)
 * sono qui. Componenti footer/disclaimer/email leggono da qui.
 *
 * NUOVO PROPRIETARIO:
 * 1. Forka il repo
 * 2. Modifica questo file con i tuoi dati
 * 3. Re-deploya su Vercel
 * 4. Sei online con il tuo brand
 * ============================================================
 */

export const OPERATORE = {
  // ─── BRAND (non cambia con la vendita, è il marchio del prodotto) ───
  brand: {
    name: 'Quootami',
    domain: 'quootami.it',
    /**
     * Host CANONICO, con www. L'apex `quootami.it` fa un 308 verso il www:
     * dichiarare qui l'apex faceva sì che canonical, sitemap e JSON-LD
     * puntassero a URL che rimbalzano. Se un domani si invertisse il redirect
     * su Vercel, questa riga va cambiata di conseguenza.
     */
    url: 'https://www.quootami.it',
    tagline: 'Confronta. Cambia. Risparmia.',
    description:
      'Comparatore digitale e consulenza personale: polizze assicurative e previdenza complementare in tutta Italia.',
    claim: 'Il tuo phygital partner.',
  },

  // ─── COLLABORATORE (cambia con la vendita) ───
  collaboratore: {
    nome_completo: 'Giacomo Ramella Pollone',
    rui_sezione: 'E',
    rui_numero: 'E000821549',
    iscritto_dal: '2024',
  },

  // ─── BROKER (cambia con la vendita) ───
  broker: {
    ragione_sociale: 'Sisto Assicurazioni S.a.s. di Sisto Terlizzi Xavier & C.',
    ragione_sociale_breve: 'Sisto Assicurazioni S.a.s.',
    rui_sezione: 'B',
    rui_numero: 'B000639183',
    partita_iva: '02696750021',
  },

  // ─── CONTATTI OPERATIVI (cambia con la vendita) ───
  contatti: {
    telefono_display: '+39 392 219 8185',
    telefono_tel: '+393922198185',
    telefono_wa: '393922198185',
    email: 'giacomo.rp@sistoassicurazioni.com',
    orari: 'Lun-Ven 9:00–19:00',
  },

  // ─── SOCIAL ───
  social: {
    whatsapp: 'https://wa.me/393922198185',
    instagram: '',
    linkedin: 'https://www.linkedin.com/in/giacomo-ramella-pollone',
    facebook: '',
  },
} as const;

// Helpers per template
export function getCopyrightText() {
  const { brand, collaboratore } = OPERATORE;
  return `© ${new Date().getFullYear()} ${brand.name} · sito gestito da ${collaboratore.nome_completo} · RUI sez. ${collaboratore.rui_sezione} n. ${collaboratore.rui_numero}`;
}
