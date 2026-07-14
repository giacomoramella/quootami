/**
 * Quootami — POST /api/firma/start
 * ============================================================
 * Riceve dal form Allianz (public/firma-allianz.html) il PDF compilato +
 * dati del firmatario, archivia la bozza su Supabase Storage e fa partire
 * la richiesta di firma FEA via OTP Service.
 *
 * Body: multipart/form-data
 *   pdf:        Blob (application/pdf)  — modulo Allianz compilato
 *   nome:       string
 *   cognome:    string
 *   cf:         string
 *   email:      string
 *   cellulare:  string
 *   prodotto:   string                   (es. "Allianz Previdenza")
 *
 * Risposta JSON:
 *   { ok: true, praticaId, signUrl, mock }
 *
 * Modalità mock (default fino a quando l'utente non attiva piano OTP):
 *   - Salta upload Supabase se le env vars non ci sono (best-effort log)
 *   - Genera praticaId fittizio, ritorna signUrl mock
 *   - Zero costi
 * ============================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  createSignatureRequest,
  getOtpMode,
  type Firmatario,
} from '@/lib/otpservice';
import {
  getSupabaseAdmin,
  STORAGE_BUCKET_ADESIONI_BOZZE,
} from '@/lib/supabase';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Codice fiscale persona fisica, omocodia inclusa (le cifre possono
// diventare lettere LMNPQRSTUV nelle posizioni numeriche).
const CF_RE =
  /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/;
const CELLULARE_RE = /^\+?[0-9]{8,15}$/;
// Solo i prodotti per cui esiste un flusso di adesione online.
const PRODOTTI_AMMESSI = new Set(['Allianz Previdenza']);

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function POST(req: NextRequest) {
  // Rate limit per-IP: 5 avvii di pratica ogni 10 minuti bastano a
  // qualsiasi uso legittimo e frenano spam/scan automatici.
  if (!rateLimit(`firma-start:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return bad('Troppe richieste. Riprova tra qualche minuto.', 429);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (e) {
    return bad('Body non valido (atteso multipart/form-data)', 400);
  }

  const pdf = form.get('pdf');
  const nome = String(form.get('nome') ?? '').trim();
  const cognome = String(form.get('cognome') ?? '').trim();
  const cf = String(form.get('cf') ?? '').trim().toUpperCase();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const cellulare = String(form.get('cellulare') ?? '').trim().replace(/[()\s./-]/g, '');
  const prodotto = String(form.get('prodotto') ?? 'Allianz Previdenza').trim();
  const consenso = String(form.get('consenso') ?? '') === 'true';

  // Validazione
  if (!(pdf instanceof Blob)) return bad('PDF mancante');
  if (pdf.size === 0) return bad('PDF vuoto');
  if (pdf.size > 15 * 1024 * 1024) return bad('PDF troppo grande (>15 MB)');
  if (!nome || nome.length > 80) return bad('Nome mancante o troppo lungo');
  if (!cognome || cognome.length > 80) return bad('Cognome mancante o troppo lungo');
  if (!CF_RE.test(cf)) return bad('Codice fiscale non valido');
  if (!EMAIL_RE.test(email) || email.length > 254) return bad('Email non valida');
  if (!CELLULARE_RE.test(cellulare)) return bad('Cellulare non valido');
  if (!PRODOTTI_AMMESSI.has(prodotto)) return bad('Prodotto non riconosciuto');
  // Consenso GDPR: il form lo impone lato client, il server non si fida.
  if (!consenso) return bad('Consenso al trattamento dei dati mancante');

  const pdfBytes = Buffer.from(await pdf.arrayBuffer());

  // Il MIME type dichiarato dal client non fa fede: controlliamo i
  // magic bytes. Ogni PDF valido inizia con "%PDF-".
  if (pdfBytes.subarray(0, 5).toString('latin1') !== '%PDF-') {
    return bad('Il file deve essere un PDF');
  }

  // ── 1. Archivio bozza su Supabase (best-effort) ──
  let bozzaPath: string | null = null;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const slug = `${cognome}_${nome}`.replace(/[^A-Za-z0-9_]/g, '');
  const filename = `${ts}_${slug}.pdf`;
  try {
    const supa = getSupabaseAdmin();
    bozzaPath = `${cf}/${filename}`;
    const up = await supa.storage
      .from(STORAGE_BUCKET_ADESIONI_BOZZE)
      .upload(bozzaPath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false,
      });
    if (up.error) {
      console.warn('[firma/start] upload bozza fallito:', up.error.message);
      bozzaPath = null;
    }
  } catch (e: any) {
    // Mock mode senza Supabase configurato → ok, andiamo avanti.
    console.warn('[firma/start] Supabase non disponibile:', e?.message);
  }

  // ── 2. Crea pratica di firma (OTP Service o mock) ──
  const firmatario: Firmatario = { nome, cognome, cf, email, cellulare };
  let pratica;
  try {
    pratica = await createSignatureRequest({
      pdfBytes,
      filename,
      firmatario,
      prodotto,
    });
  } catch (e: any) {
    console.error('[firma/start] OTP Service failed:', e?.message);
    return bad(`Provider firma non disponibile: ${e?.message || 'unknown'}`, 502);
  }

  // ── 3. Registra pratica su DB (best-effort) ──
  try {
    const supa = getSupabaseAdmin();
    const { error } = await supa.from('pratiche').insert({
      otp_pratica_id: pratica.praticaId,
      stato: 'in_corso',
      prodotto,
      firmatario_nome: nome,
      firmatario_cognome: cognome,
      firmatario_cf: cf,
      firmatario_email: email,
      firmatario_cellulare: cellulare,
      file_bozza_path: bozzaPath,
      mock: pratica.mock,
    });
    if (error) console.warn('[firma/start] insert pratica fallito:', error.message);
  } catch (e: any) {
    console.warn('[firma/start] DB non disponibile:', e?.message);
  }

  return NextResponse.json({
    ok: true,
    praticaId: pratica.praticaId,
    signUrl: pratica.signUrl,
    mock: pratica.mock,
    mode: getOtpMode(),
  });
}
