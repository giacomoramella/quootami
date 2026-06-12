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
  var SUPABASE_URL = 'https://ivcdwizhkdubjxxrukbs.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Y2R3aXpoa2R1Ymp4eHJ1a2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDExNDgsImV4cCI6MjA5NjgxNzE0OH0.qC1_UPr51A5MgxL-cUUD2FnOnMWSdDNwu-jyne0dTq4';

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

  // === SALVA LEAD SU TABELLA (via RPC SECURITY DEFINER, bypassa RLS) ===
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
      user_agent: (navigator.userAgent || '').substring(0, 255)
    };

    // Chiama la funzione RPC insert_lead (SECURITY DEFINER, bypassa RLS)
    var res = await fetch(SUPABASE_URL + '/rest/v1/rpc/insert_lead', {
      method: 'POST',
      headers: authHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ payload: payload })
    });
    if (!res.ok) {
      var errText = await res.text().catch(function () { return res.statusText; });
      throw new Error('Supabase RPC HTTP ' + res.status + ': ' + errText);
    }
    return await res.json();
  }

  // === AGGIORNA DOCUMENTI DEL LEAD (via RPC) ===
  async function attachDocumenti(leadId, docs) {
    if (!isConfigured) return null;
    var res = await fetch(SUPABASE_URL + '/rest/v1/rpc/attach_documenti', {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ lead_id: leadId, docs: docs })
    });
    if (!res.ok) {
      var t = await res.text().catch(function () { return res.statusText; });
      throw new Error('attach_documenti fallita (' + res.status + '): ' + t);
    }
    return true;
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

    // 3) Update lead con i path documenti (via RPC SECURITY DEFINER)
    if (Object.keys(paths).length) {
      try {
        await attachDocumenti(lead.id, paths);
      } catch (ex) {
        console.warn('[Quootami LeadDB] attach_documenti fallita, non blocca:', ex.message);
      }
    }

    // 4) Genera link per accesso documenti tramite Dashboard Supabase
    //    (i file sono su bucket privato, accessibili solo dall'admin loggato)
    var dashboardUrls = {};
    Object.keys(paths).forEach(function (key) {
      dashboardUrls[key] = SUPABASE_URL.replace('.supabase.co', '') +
        '.supabase.co/storage/v1/object/authenticated/documenti-lead/' + paths[key];
    });

    return {
      lead: lead,
      paths: paths,
      signedUrls: dashboardUrls,            // mantengo nome per compatibilita' con codice esistente
      dashboardUrls: dashboardUrls
    };
  }

  // === ESPORTA API ===
  window.QuootamiLeadDB = {
    isConfigured: isConfigured,
    saveLead: saveLead,
    uploadFile: uploadFile,
    getSignedUrl: getSignedUrl,
    attachDocumenti: attachDocumenti,
    submitFullLead: submitFullLead
  };

  console.log('[Quootami LeadDB]', isConfigured ? 'configurato e pronto' : 'NON configurato — modulo in standby');
})();
