/* ================================================================
   Quootami — Lead Database + Document Storage (Supabase)
   ================================================================
   Modulo per gestione lead con:
   - Salvataggio dati anagrafici su tabella "leads" (PostgreSQL)
   - Upload sicuro documenti (carta identità, libretto) su Storage
   - Generazione link firmati (signed URLs) inviati via email

   ⚠️ SICUREZZA DOCUMENTI SENSIBILI
   I documenti vengono caricati su un bucket privato cifrato a riposo.
   L'email a Giacomo contiene SOLO link firmati validi 30 giorni
   (configurabile). Mai allegati raw via email.

   ATTIVAZIONE:
   1. Crea progetto Supabase
   2. Esegui supabase-setup.sql (crea tabella + bucket + policy)
   3. Sostituisci SUPABASE_URL e SUPABASE_ANON_KEY qui sotto
   4. Tutti i form preventivo sono operativi
   ================================================================ */

(function () {
  'use strict';

  // ⚠️ SOSTITUISCI questi due valori con quelli del tuo progetto Supabase.
  // Finche' restano vuoti, il modulo e' disattivato e l'utente non puo'
  // caricare documenti (i form mostrano un avviso).
  var SUPABASE_URL = '';
  var SUPABASE_ANON_KEY = '';

  // Bucket privato per documenti d'identita' (creato da supabase-setup.sql)
  var BUCKET_DOCUMENTI = 'documenti-lead';

  // Durata link firmati nelle email (in secondi)
  var SIGNED_URL_EXPIRES = 60 * 60 * 24 * 30; // 30 giorni

  // === STATO MODULO ===
  var isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

  // === HEADERS HTTP COMUNI ===
  function authHeaders(extra) {
    var h = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
    };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }

  // === UPLOAD FILE SU SUPABASE STORAGE ===
  /**
   * Carica un file sul bucket privato.
   * Restituisce il path interno (es. "leads/2026/uuid/ci-fronte.jpg")
   */
  async function uploadFile(file, leadId, label) {
    if (!isConfigured) throw new Error('Supabase non configurato — upload disabilitato');

    var ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    // Pulisce caratteri non sicuri dall'estensione
    ext = ext.replace(/[^a-z0-9]/g, '').slice(0, 5) || 'bin';
    var safeName = label + '-' + Date.now() + '.' + ext;
    var path = 'leads/' + leadId + '/' + safeName;

    var url = SUPABASE_URL + '/storage/v1/object/' + BUCKET_DOCUMENTI + '/' + path;
    var res = await fetch(url, {
      method: 'POST',
      headers: authHeaders({
        'x-upsert': 'false',
        'Content-Type': file.type || 'application/octet-stream'
      }),
      body: file
    });
    if (!res.ok) {
      var t = await res.text().catch(function () { return res.statusText; });
      throw new Error('Upload fallito (' + res.status + '): ' + t);
    }
    return path;
  }

  // === CREA SIGNED URL ===
  /**
   * Genera un link firmato (signed URL) valido SIGNED_URL_EXPIRES secondi.
   * Solo chi ha questo link puo' scaricare il file.
   */
  async function getSignedUrl(path) {
    if (!isConfigured) throw new Error('Supabase non configurato');
    var url = SUPABASE_URL + '/storage/v1/object/sign/' + BUCKET_DOCUMENTI + '/' + path;
    var res = await fetch(url, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ expiresIn: SIGNED_URL_EXPIRES })
    });
    if (!res.ok) {
      var t = await res.text().catch(function () { return res.statusText; });
      throw new Error('Signed URL fallita (' + res.status + '): ' + t);
    }
    var json = await res.json();
    // signedURL e' relativo; prefisso con il base
    return SUPABASE_URL + '/storage/v1' + json.signedURL;
  }

  // === SALVA LEAD SU TABELLA ===
  async function saveLead(lead) {
    if (!isConfigured) {
      console.log('[Quootami LeadDB] DB non configurato — salvataggio saltato');
      return null;
    }
    if (!lead || !lead.prodotto) throw new Error('Lead invalido: serve "prodotto"');

    var payload = {
      prodotto: lead.prodotto,
      nome_cognome: lead.nome_cognome || null,
      data_nascita: lead.data_nascita || null,
      email: lead.email || null,
      telefono: lead.telefono || null,
      cap: lead.cap || null,
      citta: lead.citta || null,
      targa: lead.targa || null,
      messaggio: lead.messaggio || null,
      fonte: lead.fonte || 'sito web',
      pagina: window.location.pathname,
      user_agent: (navigator.userAgent || '').substring(0, 255),
      stato: 'nuovo',
      documenti: lead.documenti || null  // {ci_fronte: path, ci_retro: path, libretto: path}
    };

    var res = await fetch(SUPABASE_URL + '/rest/v1/leads', {
      method: 'POST',
      headers: authHeaders({
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      var errText = await res.text().catch(function () { return res.statusText; });
      throw new Error('Supabase HTTP ' + res.status + ': ' + errText);
    }
    var data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  }

  // === FLUSSO COMPLETO: SALVA LEAD + UPLOAD DOCUMENTI + RITORNA LINK FIRMATI ===
  /**
   * @param {Object} leadData - Dati anagrafici del lead.
   * @param {Object} files - {ci_fronte: File, ci_retro: File, libretto: File}
   * @returns {Object} { lead, signedUrls: {ci_fronte: url, ci_retro: url, libretto: url} }
   */
  async function submitFullLead(leadData, files) {
    if (!isConfigured) {
      throw new Error('Sistema documenti non configurato. Il proprietario del sito deve configurare Supabase.');
    }

    // 1) Prima salva il lead (per avere un ID univoco da usare come cartella)
    var lead = await saveLead(leadData);
    if (!lead || !lead.id) throw new Error('Lead salvato ma ID mancante');

    // 2) Upload dei file in parallelo
    var paths = {};
    var uploadPromises = [];
    Object.keys(files).forEach(function (key) {
      if (files[key] instanceof File) {
        uploadPromises.push(
          uploadFile(files[key], lead.id, key).then(function (path) {
            paths[key] = path;
          })
        );
      }
    });
    await Promise.all(uploadPromises);

    // 3) Update lead con i path documenti
    if (Object.keys(paths).length) {
      await fetch(SUPABASE_URL + '/rest/v1/leads?id=eq.' + lead.id, {
        method: 'PATCH',
        headers: authHeaders({
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }),
        body: JSON.stringify({ documenti: paths })
      });
    }

    // 4) Genera signed URL per ciascun documento (in parallelo)
    var signedUrls = {};
    var signPromises = Object.keys(paths).map(function (key) {
      return getSignedUrl(paths[key]).then(function (url) {
        signedUrls[key] = url;
      });
    });
    await Promise.all(signPromises);

    return { lead: lead, signedUrls: signedUrls };
  }

  // === ESPORTA API ===
  window.QuootamiLeadDB = {
    isConfigured: isConfigured,
    saveLead: saveLead,
    uploadFile: uploadFile,
    getSignedUrl: getSignedUrl,
    submitFullLead: submitFullLead
  };

  console.log('[Quootami LeadDB]', isConfigured ? 'configurato e pronto' : 'NON configurato — modulo in standby');
})();
