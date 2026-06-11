/* ================================================================
   Quootami — Dati Operatore Centralizzati
   ================================================================
   QUESTO È IL FILE DA CAMBIARE IL GIORNO DELLA VENDITA DEL SITO.
   Tutti i dati personali del collaboratore, del broker, dei contatti
   e dei dati legali sono qui in un unico posto. Tutti i componenti
   (footer, disclaimer, schema.org) leggono da questo oggetto.

   Si applica automaticamente a tutte le pagine via render_footer().
   ================================================================ */

window.QUOOTAMI_OPERATORE = {

  // === BRAND (non cambia con la vendita) ===
  brand: {
    name: 'Quootami',
    domain: 'quootami.it',
    url: 'https://quootami.it',
    tagline: 'Assicurazioni e previdenza',
    description: 'Confronto polizze assicurative e previdenza complementare in tutta Italia.'
  },

  // === COLLABORATORE (cambia il giorno della vendita) ===
  collaboratore: {
    nome_completo: 'Giacomo Ramella Pollone',
    rui_sezione: 'E',
    rui_numero: 'E000821549',
    iscritto_dal: '2024'
  },

  // === BROKER (cambia il giorno della vendita) ===
  broker: {
    ragione_sociale: 'Sisto Assicurazioni S.a.s. di Sisto Terlizzi Xavier & C.',
    ragione_sociale_breve: 'Sisto Assicurazioni S.a.s.',
    rui_sezione: 'B',
    rui_numero: 'B000639183',
    partita_iva: '02696750021'
  },

  // === CONTATTI OPERATIVI (cambia il giorno della vendita) ===
  contatti: {
    telefono: '+39 392 219 8185',
    telefono_tel: '+393922198185',          // formato per href="tel:"
    telefono_wa: '393922198185',             // formato per wa.me/...
    email: 'giacomo.rp@sistoassicurazioni.com',
    indirizzo: '',                            // se vuoi mostrare un indirizzo fisico
    citta: '',
    cap: '',
    provincia: ''
  },

  // === SOCIAL (cambia il giorno della vendita) ===
  social: {
    whatsapp: 'https://wa.me/393922198185',
    instagram: '',
    linkedin: '',
    facebook: ''
  },

  // === DISCLAIMER IVASS (testo legale obbligatorio) ===
  // Generato automaticamente dai dati sopra
  get disclaimer_html() {
    var c = this.collaboratore, b = this.broker;
    return 'Questo sito è gestito da <strong>' + c.nome_completo + '</strong>, ' +
      'collaboratore iscritto al RUI sezione ' + c.rui_sezione + ' n. <strong>' + c.rui_numero + '</strong>, ' +
      'operante per conto di <strong>' + b.ragione_sociale + '</strong>, ' +
      'broker iscritto al RUI sezione ' + b.rui_sezione + ' n. <strong>' + b.rui_numero + '</strong>. ' +
      'Messaggio pubblicitario con finalità promozionale. Prima della sottoscrizione leggere il set informativo ' +
      'disponibile presso la sede del broker. La vigilanza è esercitata dall\'IVASS — ' +
      '<a href="https://www.ivass.it" rel="external noopener">www.ivass.it</a>.';
  },

  // === COPYRIGHT (cambia il giorno della vendita) ===
  get copyright_html() {
    var b = this.broker;
    return '© ' + new Date().getFullYear() + ' ' + this.brand.name +
      ' · gestito da ' + b.ragione_sociale_breve +
      ' · P.IVA ' + b.partita_iva +
      ' · RUI sez. ' + b.rui_sezione + ' n. ' + b.rui_numero;
  }
};

/* ================================================================
   RENDER AUTOMATICO DEI BLOCCHI CONTATTI/DISCLAIMER
   ================================================================
   Cerca elementi con data-quootami="<chiave>" e li riempie con il
   valore corrispondente dall'oggetto operatore. Cosi' il giorno
   della vendita basta cambiare i dati qui sopra: tutte le pagine
   si aggiornano automaticamente.
   ================================================================ */
(function () {
  function render() {
    var op = window.QUOOTAMI_OPERATORE;

    // disclaimer IVASS (footer-disclaimer)
    document.querySelectorAll('[data-quootami="disclaimer"]').forEach(function (el) {
      el.innerHTML = op.disclaimer_html;
    });

    // copyright (footer-bottom)
    document.querySelectorAll('[data-quootami="copyright"]').forEach(function (el) {
      el.innerHTML = op.copyright_html;
    });

    // telefono come testo
    document.querySelectorAll('[data-quootami="telefono"]').forEach(function (el) {
      el.textContent = op.contatti.telefono;
    });

    // telefono come href="tel:"
    document.querySelectorAll('[data-quootami="telefono-link"]').forEach(function (el) {
      el.href = 'tel:' + op.contatti.telefono_tel;
      if (!el.textContent || el.textContent === '_TEL_') el.textContent = op.contatti.telefono;
    });

    // email come testo
    document.querySelectorAll('[data-quootami="email"]').forEach(function (el) {
      el.textContent = op.contatti.email;
    });

    // email come href="mailto:"
    document.querySelectorAll('[data-quootami="email-link"]').forEach(function (el) {
      el.href = 'mailto:' + op.contatti.email;
      if (!el.textContent || el.textContent === '_EMAIL_') el.textContent = op.contatti.email;
    });

    // whatsapp link
    document.querySelectorAll('[data-quootami="whatsapp-link"]').forEach(function (el) {
      el.href = op.social.whatsapp;
    });

    // collaboratore nome completo
    document.querySelectorAll('[data-quootami="collaboratore-nome"]').forEach(function (el) {
      el.textContent = op.collaboratore.nome_completo;
    });

    // broker ragione sociale
    document.querySelectorAll('[data-quootami="broker-nome"]').forEach(function (el) {
      el.textContent = op.broker.ragione_sociale;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
