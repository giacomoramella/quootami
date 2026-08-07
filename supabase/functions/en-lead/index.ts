// Edge Function: en-lead — funnel lead comparatore luce/gas (double opt-in).
// Porting autonomo per il progetto Supabase di Quootami (nessuna dipendenza da
// uno schema "crm": il lead vive direttamente su en.bills).
// Azioni:
//   POST ?action=submit  {p}      -> rate limit -> en_public_lead -> email di verifica -> risposta mascherata
//   GET  ?action=verify&token=... -> conferma indirizzo -> email di conferma -> redirect alla landing
//   POST ?action=results {token}  -> offerte in chiaro (solo token verificati)
// verify_jwt disattivato: endpoint pubblico. Le RPC usate sono eseguibili solo dalla service role.
// Env richiesti: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, FROM_EMAIL?, LANDING_URL?
//
// Valori Quootami definitivi: landing /luce su quootami.it, mittente
// noreply@quootami.it (richiede dominio verificato su Resend — fino ad
// allora impostare FROM_EMAIL con il mittente onboarding di Resend).

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, 'content-type': 'application/json' } });
}

const LANDING = Deno.env.get('LANDING_URL') || 'https://quootami.it/luce';
const FROM = Deno.env.get('FROM_EMAIL') || 'Quootami Energia <noreply@quootami.it>';
const SITE = 'quootami.it';
// Destinatario delle notifiche lead: senza questa email il funnel finisce in
// un database che nessuno guarda.
const BROKER = Deno.env.get('INTERMEDIARIO_EMAIL') || 'giacomo.rp@sistoassicurazioni.com';

async function rpc(name: string, args: Record<string, unknown>) {
  const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const r = await fetch(url + '/rest/v1/rpc/' + name, {
    method: 'POST',
    headers: { apikey: key!, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(name + ' HTTP ' + r.status + ' ' + t.slice(0, 200));
  return t ? JSON.parse(t) : null;
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return { ok: false, error: 'RESEND_API_KEY mancante' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const d = await r.json().catch(() => ({}));
  return { ok: r.ok, error: r.ok ? null : (d.message || d.error || ('Resend HTTP ' + r.status)), id: d.id };
}

const eur = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);
const esc = (s: string) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

/**
 * Shell email con il brand del sito: sfondo bianco, wordmark "Quootami" navy
 * (#0B1220) con il punto giallo (#FFD84D) come nella og-image, claim sotto,
 * pulsanti gialli. Font di sistema: le email non caricano web font.
 */
function emailShell(inner: string, footer?: string) {
  return `<div style="font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:#FAFAF7;padding:28px 14px">
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E9E5DA;border-radius:16px;overflow:hidden">
    <div style="background:#FFFFFF;padding:22px 26px 14px;border-bottom:1px solid #F0EDE4">
      <div style="font-size:25px;font-weight:800;letter-spacing:-0.5px;color:#0B1220">Quootami<span style="color:#FFD84D">.</span></div>
      <div style="margin-top:3px;font-size:10.5px;font-weight:700;letter-spacing:1.6px;color:#9AA0A6;text-transform:uppercase">Confronta. Cambia. Risparmia.</div>
    </div>
    <div style="padding:24px 26px;color:#0B1220;font-size:15px;line-height:1.65">${inner}</div>
    <div style="padding:14px 26px;border-top:1px solid #F0EDE4;color:#9AA0A6;font-size:11.5px;line-height:1.5">
      ${footer ?? `Ricevi questa email perche' hai richiesto un confronto su ${SITE}. Se non sei stato tu, ignora questo messaggio: senza conferma non riceverai altre comunicazioni.`}
    </div>
  </div></div>`;
}

/** Stile del pulsante principale: giallo brand con testo navy, come sul sito. */
const BTN = 'background:#FFD84D;color:#0B1220;text-decoration:none;padding:13px 26px;border-radius:12px;font-weight:800;display:inline-block';

async function rateHit(bucket: string, max: number, ttl: number): Promise<boolean> {
  try { return (await rpc('en_rate_hit', { p_bucket: bucket, p_max: max, p_ttl_seconds: ttl })) === true; }
  catch (_) { return true; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const u = new URL(req.url);
  const action = u.searchParams.get('action') || '';

  try {
    // ---------- CONFERMA INDIRIZZO (link nell'email) ----------
    if (req.method === 'GET' && action === 'verify') {
      const token = u.searchParams.get('token') || '';
      let ok = false, first = false, d: any = null;
      if (/^[0-9a-f-]{36}$/i.test(token)) {
        d = await rpc('en_verification_confirm', { p_token: token });
        ok = !!(d && d.ok); first = !!(d && d.first_confirm);
      }
      if (ok && first && d.email) {
        const name = (d.customer_name || '').split(' ')[0];
        await sendEmail(d.email, 'Email confermata — i tuoi risparmi su luce e gas',
          emailShell(`<p>Ciao${name ? ' <b>' + esc(name) + '</b>' : ''},</p>
           <p>il tuo indirizzo e' confermato ✅. Ora puoi vedere i fornitori e le offerte selezionate per te:</p>
           <p style="text-align:center;margin:22px 0"><a href="${LANDING}?verified=${token}" style="${BTN}">Vedi le offerte</a></p>
           <p>Un nostro consulente ti contattera' per accompagnarti gratuitamente nel cambio fornitore. Nessun costo, nessun impegno: il diritto di recesso e' di 14 giorni sul nuovo contratto.</p>
           <p>Per qualsiasi domanda rispondi pure a questa email.</p>`));

        // Notifica al broker, solo al PRIMO click di conferma. Best-effort:
        // qualunque errore qui non deve mai bloccare il redirect dell'utente.
        try {
          const res = await rpc('en_verification_results', { p_token: token });
          const best = res && Array.isArray(res.proposals) ? res.proposals[0] : null;
          const gas = res && res.commodity === 'gas';
          const righe = ([
            ['Nome', d.customer_name || '—'],
            ['Email', d.email],
            ['Telefono', d.customer_phone || '—'],
            ['Fornitura', gas ? 'Gas' : 'Luce'],
            ['Consumo annuo', res && res.annual_consumption ? res.annual_consumption + (gas ? ' Smc' : ' kWh') : '—'],
            ['Spesa attuale', res && res.annual_cost_current ? eur(res.annual_cost_current) + '/anno' : '—'],
            ['Migliore proposta', best ? (best.supplier_name || '') + ' — risparmio ' + eur(best.annual_saving) + '/anno' : '—'],
            ['Proposte totali', res && Array.isArray(res.proposals) ? String(res.proposals.length) : '0'],
          ] as [string, string][]).map(([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#64748b;white-space:nowrap">${k}</td><td style="padding:4px 0;font-weight:600">${esc(String(v))}</td></tr>`).join('');
          await sendEmail(BROKER, `Nuovo lead luce/gas verificato — ${d.customer_name || d.email}`,
            emailShell(`<p><b>Lead verificato</b> sul comparatore: l'utente ha confermato l'email e si aspetta di essere ricontattato.</p>
              <table style="font-size:14px;border-collapse:collapse">${righe}</table>`,
              `Notifica automatica del comparatore luce e gas di ${SITE}.`));
        } catch (e) { console.error('en-lead notifica broker:', e); }
      }
      const dest = ok ? `${LANDING}?verified=${token}` : `${LANDING}?verifyerr=1`;
      return new Response(null, { status: 302, headers: { ...cors, Location: dest } });
    }

    // ---------- INVIO LEAD ----------
    if (req.method === 'POST' && action === 'submit') {
      const body = await req.json().catch(() => null);
      const p = body && body.p;
      if (!p || typeof p !== 'object') return json({ error: 'Dati mancanti' }, 400);
      const email = String(p.email || '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return json({ error: 'Indirizzo email non valido.' }, 400);
      if (p.consent !== true) return json({ error: 'Serve il consenso al trattamento dati.' }, 400);

      const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
      if (!(await rateHit('lead:ip:' + ip, 5, 3600))) return json({ error: 'Troppe richieste: riprova tra un’ora.' }, 429);
      if (!(await rateHit('lead:email:' + email, 3, 86400))) return json({ error: 'Hai gia’ richiesto il confronto con questa email: controlla la tua casella (anche lo spam).' }, 429);
      if (!(await rateHit('lead:global', 500, 86400))) return json({ error: 'Servizio momentaneamente molto richiesto, riprova piu’ tardi.' }, 429);

      const lead = await rpc('en_public_lead', { p });
      if (!lead || !lead.bill_id) return json({ error: 'Registrazione non riuscita, riprova.' }, 500);

      const token = await rpc('en_verification_create', { p_bill: lead.bill_id, p_email: email });
      const verifyUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/en-lead?action=verify&token=${token}`;
      const name = (String(p.customer_name || '').trim()).split(' ')[0];
      const best = lead.recommended;

      const mail = await sendEmail(email, 'Conferma il tuo indirizzo — sblocca le offerte luce e gas',
        emailShell(`<p>Ciao${name ? ' <b>' + esc(name) + '</b>' : ''},</p>
         <p>grazie per la tua richiesta su <b>${SITE}</b>.${best && best.annual_saving > 0 ? ' In base alla tua bolletta puoi risparmiare fino a <b>' + eur(best.annual_saving) + '/anno</b>.' : ''}</p>
         <p>Per vedere i fornitori e ricevere la proposta, conferma il tuo indirizzo email:</p>
         <p style="text-align:center;margin:22px 0"><a href="${verifyUrl}" style="${BTN}">Conferma e vedi le offerte</a></p>
         <p style="color:#64748b;font-size:13px">Il link vale 7 giorni. Se il pulsante non funziona copia questo indirizzo nel browser:<br><span style="word-break:break-all">${verifyUrl}</span></p>`));

      const ps = (lead.proposals || []).filter((x: any) => x.annual_saving > 0);
      return json({
        ok: true,
        email_sent: mail.ok,
        email_error: mail.ok ? null : mail.error,
        offers_count: ps.length,
        best_saving: ps.length ? Math.max(...ps.map((x: any) => x.annual_saving)) : 0,
      });
    }

    // ---------- RISULTATI IN CHIARO (dopo conferma) ----------
    if (req.method === 'POST' && action === 'results') {
      const body = await req.json().catch(() => null);
      const token = String(body && body.token || '');
      if (!/^[0-9a-f-]{36}$/i.test(token)) return json({ error: 'Token non valido' }, 400);
      const d = await rpc('en_verification_results', { p_token: token });
      if (!d || !d.ok) return json({ error: 'Link non valido o scaduto.' }, 403);
      return json(d);
    }

    return json({ error: 'Azione non riconosciuta' }, 400);
  } catch (e) {
    console.error('en-lead:', e);
    return json({ error: 'Errore interno. Riprova.' }, 500);
  }
});
