/* ================================================================
   Quootami — Schema.org JSON-LD
   ================================================================
   Inietta i markup structured data che Google usa per:
   - rich snippets (logo, sitelinks, valutazioni)
   - knowledge panel
   - migliore comprensione del contenuto

   La pagina puo' aggiungere i suoi schema specifici (es. FAQPage,
   Product, Service) tramite window.QUOOTAMI_PAGE_SCHEMAS.
   ================================================================ */

(function () {
  function injectJsonLd(obj) {
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(obj);
    document.head.appendChild(script);
  }

  function run() {
    var op = window.QUOOTAMI_OPERATORE;
    if (!op) return;

    // === Organization (presente su ogni pagina) ===
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'InsuranceAgency',
      '@id': op.brand.url + '/#organization',
      'name': op.brand.name,
      'url': op.brand.url,
      'logo': op.brand.url + '/assets/favicon.svg',
      'image': op.brand.url + '/assets/og-image.svg',
      'description': op.brand.description,
      'telephone': op.contatti.telefono,
      'email': op.contatti.email,
      'areaServed': { '@type': 'Country', 'name': 'Italia' },
      'sameAs': [op.social.whatsapp].filter(function (u) { return !!u; }),
      'parentOrganization': {
        '@type': 'Organization',
        'name': op.broker.ragione_sociale_breve,
        'taxID': op.broker.partita_iva,
        'identifier': 'RUI sez. ' + op.broker.rui_sezione + ' n. ' + op.broker.rui_numero
      }
    });

    // === WebSite con SearchAction ===
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': op.brand.url + '/#website',
      'url': op.brand.url,
      'name': op.brand.name,
      'description': op.brand.description,
      'inLanguage': 'it-IT',
      'publisher': { '@id': op.brand.url + '/#organization' }
    });

    // === Schema specifici della pagina (se la pagina ne ha definiti) ===
    if (Array.isArray(window.QUOOTAMI_PAGE_SCHEMAS)) {
      window.QUOOTAMI_PAGE_SCHEMAS.forEach(injectJsonLd);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
