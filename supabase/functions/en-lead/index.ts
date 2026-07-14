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
// Valori Quootami definitivi: landing /luce.html su quootami.it, mittente
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

const LANDING = Deno.env.get('LANDING_URL') || 'https://quootami.it/luce.html';
const FROM = Deno.env.get('FROM_EMAIL') || 'Quootami Energia <noreply@quootami.it>';
const SITE = 'quootami.it';

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

function emailShell(inner: string) {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f6f8fb;padding:28px 14px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
    <div style="background:#1e3a8a;color:#fff;padding:18px 24px;font-weight:800;font-size:17px">⚡ ${SITE}</div>
    <div style="padding:26px 24px;color:#0f172a;font-size:15px;line-height:1.6">${inner}</div>
    <div style="padding:14px 24px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11.5px;line-height:1.5">
      Ricevi questa email perche' hai richiesto un confronto su ${SITE}. Se non sei stato tu, ignora questo messaggio: senza conferma non riceverai altre comunicazioni.
    </div>
  </div></div>`;
}

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
           <p style="text-align:center;margin:22px 0"><a href="${LANDING}?verified=${token}" style="background:#1d4ed8;color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:700;display:inline-block">Vedi le offerte</a></p>
           <p>Un nostro consulente ti contattera' per accompagnarti gratuitamente nel cambio fornitore. Nessun costo, nessun impegno: il diritto di recesso e' di 14 giorni sul nuovo contratto.</p>
           <p>Per qualsiasi domanda rispondi pure a questa email.</p>`));
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
         <p style="text-align:center;margin:22px 0"><a href="${verifyUrl}" style="background:#1d4ed8;color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:700;display:inline-block">Conferma e vedi le offerte</a></p>
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
