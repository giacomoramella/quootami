// Edge Function: en-bill-extract — estrazione dati bolletta luce/gas con
// Anthropic (Claude vision) da PDF o foto. Porting invariato (nessuna
// dipendenza da crm/energy: usa solo il rate limiter en_rate_hit).
// verify_jwt disattivato: endpoint pubblico per la landing en.confronta.html.
// Protezioni: solo POST, payload max ~8MB, mime whitelist, max_tokens limitato,
// rate limit 5/ora per IP e 300/giorno globale (en.rate_limits via RPC service role).
// Secret: ANTHROPIC_API_KEY. Opzionale: BILL_MODEL (default claude-sonnet-4-6).

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, 'content-type': 'application/json' } });
}

const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_B64 = 8 * 1024 * 1024; // ~8MB base64
const IP_MAX = 5, IP_TTL = 3600;       // 5 estrazioni/ora per IP
const GLOBAL_MAX = 300, GLOBAL_TTL = 86400; // 300 estrazioni/giorno totali

async function rateHit(bucket: string, max: number, ttl: number): Promise<boolean> {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return true; // fail-open se env mancante
  try {
    const r = await fetch(url + '/rest/v1/rpc/en_rate_hit', {
      method: 'POST',
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_bucket: bucket, p_max: max, p_ttl_seconds: ttl }),
    });
    if (!r.ok) return true;
    return (await r.json()) === true;
  } catch (_) { return true; }
}

const PROMPT = `Sei un estrattore esperto di dati da bollette italiane di energia elettrica (luce) o gas.
Leggi soprattutto la sezione "Scontrino dell'energia" / dettaglio importi.
Restituisci ESCLUSIVAMENTE un oggetto JSON valido (niente testo prima o dopo) con questi campi:
{
  "commodity": "ele" per luce, "gas" per gas,
  "customer_name": intestatario della fornitura, o null,
  "fiscal_code": codice fiscale o partita IVA, o null,
  "address": indirizzo completo di fornitura, o null,
  "postal_code": CAP, o null,
  "pod": codice POD (solo luce, inizia con IT), o null,
  "pdr": codice PDR (solo gas), o null,
  "supplier": fornitore/venditore attuale, o null,
  "period_start": inizio periodo fatturazione YYYY-MM-DD,
  "period_end": fine periodo fatturazione YYYY-MM-DD,
  "consumption_total": numero, consumo del periodo (kWh luce / Smc gas),
  "current_unit_price": numero. E' il prezzo UNITARIO della sola materia energia in EUR/kWh (luce) o EUR/Smc (gas). COME TROVARLO: nello scontrino, nella QUOTA CONSUMI, prendi la voce "di cui spesa per la vendita di energia elettrica" (o "...materia gas") espressa in EUR/kWh o EUR/Smc. Se e' indicata solo come importo, dividi quell'importo per il consumo del periodo. In alternativa usa il "Prezzo fisso"/"Prezzo" della componente energia indicato nel Box offerta. Deve essere un valore PICCOLO per unita': tipicamente 0,08-0,40 per la luce e 0,30-0,95 per il gas. NON usare quote fisse mensili, totali di bolletta, prezzi medi comprensivi di rete/oneri, ne' importi in euro/mese.
  "current_fixed_fee_year": numero in EUR/anno. E' la sola QUOTA FISSA DI VENDITA: prendi "di cui spesa per la vendita di energia elettrica" dentro la QUOTA FISSA (in EUR/mese) e moltiplicala per 12. Escludi quota potenza, rete e oneri. Se assente, 0,
  "power_kw": potenza impegnata in kW (solo luce), o null,
  "confidence": numero 0-1
}
Regole: punto come separatore decimale. Controlla la plausibilita': se current_unit_price risulta >1 per la luce o >2 per il gas, hai quasi certamente preso il valore sbagliato (es. una quota fissa) — ricontrolla e correggi. Non inventare: se un dato non e' leggibile metti null (eccetto current_fixed_fee_year che puo' essere 0).`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Metodo non consentito' }, 405);
  try {
    const key = Deno.env.get('ANTHROPIC_API_KEY');
    if (!key) return json({ error: 'Estrazione automatica non disponibile al momento.' }, 501);
    const model = Deno.env.get('BILL_MODEL') || 'claude-sonnet-4-6';

    const body = await req.json().catch(() => null);
    if (!body || !body.data || !body.mime) return json({ error: 'File mancante o non valido' }, 400);
    const mime: string = String(body.mime).toLowerCase();
    const data: string = body.data;
    if (!ALLOWED.includes(mime)) return json({ error: 'Formato non supportato: usa PDF o foto (JPG/PNG).' }, 415);
    if (typeof data !== 'string' || data.length > MAX_B64) return json({ error: 'File troppo grande (max ~6MB).' }, 413);

    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    if (!(await rateHit('extract:ip:' + ip, IP_MAX, IP_TTL)))
      return json({ error: 'Hai raggiunto il limite di letture per questa ora. Riprova piu tardi o inserisci i dati a mano.' }, 429);
    if (!(await rateHit('extract:global', GLOBAL_MAX, GLOBAL_TTL)))
      return json({ error: 'Servizio momentaneamente molto richiesto. Inserisci i dati a mano o riprova domani.' }, 429);

    const isPdf = mime.includes('pdf');
    const fileBlock = isPdf
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } }
      : { type: 'image', source: { type: 'base64', media_type: mime, data } };

    const headers: Record<string, string> = {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    };
    if (isPdf) headers['anthropic-beta'] = 'pdfs-2024-09-25';

    const ar = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: [fileBlock, { type: 'text', text: PROMPT }] }],
      }),
    });
    const ad = await ar.json().catch(() => ({}));
    if (!ar.ok) return json({ error: (ad?.error?.message) || ('Anthropic HTTP ' + ar.status) }, 502);

    const text = (ad.content || []).map((c: any) => c.text || '').join('').trim();
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    let parsed: any;
    try { parsed = JSON.parse(clean); } catch (_) {
      const m = clean.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch (_) {} }
    }
    if (!parsed) return json({ error: 'Non sono riuscito a leggere la bolletta. Riprova con una foto piu nitida o inserisci i dati a mano.' }, 502);
    return json(parsed, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
