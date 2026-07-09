/**
 * Quootami — OTP Service adapter (FEA / firma elettronica avanzata)
 * =================================================================
 * Provider: https://app.otpservice.io  (Fractalgarden Srl)
 * Compliance: eIDAS Reg. UE 910/2014 + CAD + AgID
 *
 * MODALITÀ:
 *   - OTP_MODE="mock"  → modalità sviluppo. Nessuna chiamata HTTP.
 *                        Genera ID finto, ritorna URL fittizio.
 *                        ZERO COSTI. Usata fino a quando l'utente non
 *                        attiverà un piano a consumo OTP Service (€25 min).
 *   - OTP_MODE="live"  → modalità produzione. Chiamate reali alle API
 *                        OTP Service. Costo: €1.40/firma FEA + €0.08/OTP-SMS.
 *
 * SWITCH: basta cambiare la env var `OTP_MODE` su Vercel.
 *
 * Env vars richieste in modalità "live":
 *   - OTP_MODE=live
 *   - OTP_USERNAME      (email login OTP Service)
 *   - OTP_PASSWORD      (password OTP Service)
 *   - OTP_WEBHOOK_SECRET (chiave HMAC per verificare i webhook in arrivo)
 *
 * Documentazione provider (Postman):
 *   https://documenter.getpostman.com/view/25768536/2sA3kPq4mN
 *
 * Flow tipico:
 *   1. authenticate() → bearer token
 *   2. createSignatureRequest(pdf, firmatario) → praticaId + signUrl
 *   3. provider invia OTP via email/SMS al firmatario
 *   4. firmatario firma → provider invia webhook al nostro callback
 *   5. verifyWebhook(headers, body) → ok?
 *   6. downloadSignedDoc(praticaId) → bytes PDF firmato
 * =================================================================
 */
import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

// ───────────────── tipi pubblici ─────────────────

export type Firmatario = {
  nome: string;
  cognome: string;
  cf: string;
  email: string;
  cellulare: string;
};

export type SignatureRequest = {
  pdfBytes: Uint8Array | Buffer;
  filename: string;
  firmatario: Firmatario;
  prodotto: string; // es. "Allianz Previdenza"
};

export type SignatureResponse = {
  ok: true;
  praticaId: string;
  signUrl: string;     // URL inviato al firmatario (mock o reale)
  mock: boolean;       // true se modalità mock
  raw?: unknown;       // payload provider per debugging
};

export type WebhookPayload = {
  praticaId: string;
  stato: 'completata' | 'firmata' | 'rifiutata' | 'scaduta' | 'in_corso';
  codiceVerifica?: string;
  downloadUrl?: string;
  firmatoIl?: string;  // ISO timestamp
  raw?: unknown;
};

// ───────────────── helper interni ─────────────────

function isMockMode(): boolean {
  return (process.env.OTP_MODE || 'mock').toLowerCase() !== 'live';
}

function newMockPraticaId(): string {
  return 'MOCK-' + randomBytes(6).toString('hex').toUpperCase();
}

const OTP_BASE_URL = 'https://app.otpservice.io/api/v1';

// ───────────────── 1. authenticate ─────────────────

async function authenticate(): Promise<string> {
  if (isMockMode()) return 'mock-token';
  const username = process.env.OTP_USERNAME;
  const password = process.env.OTP_PASSWORD;
  if (!username || !password) {
    throw new Error('OTP_USERNAME / OTP_PASSWORD non configurati');
  }
  // Endpoint reale OTP Service. Aggiornare quando si conferma in Postman.
  const r = await fetch(`${OTP_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) throw new Error(`OTP auth failed: ${r.status}`);
  const j = (await r.json()) as { token?: string; access_token?: string };
  const token = j.token || j.access_token;
  if (!token) throw new Error('OTP auth: token mancante in risposta');
  return token;
}

// ───────────────── 2. createSignatureRequest ─────────────────

/**
 * Crea una pratica di firma su OTP Service (o simulata in mock).
 */
export async function createSignatureRequest(
  req: SignatureRequest
): Promise<SignatureResponse> {
  // ── MOCK ──
  if (isMockMode()) {
    const praticaId = newMockPraticaId();
    console.log('[OTP mock] createSignatureRequest', {
      praticaId,
      firmatario: req.firmatario.email,
      pdfSize: req.pdfBytes.length,
      prodotto: req.prodotto,
    });
    return {
      ok: true,
      praticaId,
      signUrl: `https://mock.otpservice.io/firma/${praticaId}`,
      mock: true,
    };
  }

  // ── LIVE ──
  const token = await authenticate();
  const fd = new FormData();
  fd.append(
    'document',
    new Blob([new Uint8Array(req.pdfBytes)], { type: 'application/pdf' }),
    req.filename
  );
  fd.append('firmatario_nome', req.firmatario.nome);
  fd.append('firmatario_cognome', req.firmatario.cognome);
  fd.append('firmatario_cf', req.firmatario.cf);
  fd.append('firmatario_email', req.firmatario.email);
  fd.append('firmatario_cellulare', req.firmatario.cellulare);
  fd.append('prodotto', req.prodotto);
  fd.append('otp_channel', 'email'); // gratis. "sms" costa €0.08

  const r = await fetch(`${OTP_BASE_URL}/pratiche`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`OTP createSignatureRequest failed: ${r.status} ${text}`);
  }
  const j = (await r.json()) as {
    id?: string;
    pratica_id?: string;
    url?: string;
    sign_url?: string;
  };
  const praticaId = j.id || j.pratica_id;
  const signUrl = j.url || j.sign_url;
  if (!praticaId || !signUrl) {
    throw new Error('OTP: risposta inattesa, manca id o url');
  }
  return { ok: true, praticaId, signUrl, mock: false, raw: j };
}

// ───────────────── 3. verifyWebhook ─────────────────

/**
 * Verifica HMAC del webhook in arrivo da OTP Service.
 * In mock accetta sempre (per testing locale).
 */
export function verifyWebhook(
  headers: Headers | Record<string, string>,
  rawBody: string
): boolean {
  if (isMockMode()) return true;
  const secret = process.env.OTP_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[OTP] OTP_WEBHOOK_SECRET non configurato — rifiuto webhook');
    return false;
  }
  const getH = (k: string) =>
    headers instanceof Headers ? headers.get(k) : headers[k] || headers[k.toLowerCase()];
  const received = getH('x-otp-signature') || getH('x-signature');
  if (!received) return false;
  const computed = createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(received), Buffer.from(computed));
  } catch {
    return false;
  }
}

// ───────────────── 4. downloadSignedDoc ─────────────────

export async function downloadSignedDoc(praticaId: string): Promise<Buffer> {
  if (isMockMode()) {
    // Ritorna un PDF dummy stub (1 pagina vuota) per testing.
    // In produzione qui c'è il PDF firmato reale.
    const dummyPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0>>endobj\nxref\n0 3\n0000000000 65535 f\n0000000010 00000 n\n0000000054 00000 n\ntrailer<</Size 3/Root 1 0 R>>\nstartxref\n96\n%%EOF',
      'utf-8'
    );
    return dummyPdf;
  }
  const token = await authenticate();
  // encodeURIComponent: il praticaId non deve poter alterare il path API.
  const r = await fetch(
    `${OTP_BASE_URL}/pratiche/${encodeURIComponent(praticaId)}/firmato`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!r.ok) throw new Error(`OTP download firmato failed: ${r.status}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

// ───────────────── 5. helpers per la modalità ─────────────────

export function getOtpMode(): 'mock' | 'live' {
  return isMockMode() ? 'mock' : 'live';
}
