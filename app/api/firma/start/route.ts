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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function POST(req: NextRequest) {
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
  const cellulare = String(form.get('cellulare') ?? '').trim();
  const prodotto = String(form.get('prodotto') ?? 'Allianz Previdenza').trim();

  // Validazione
  if (!(pdf instanceof Blob)) return bad('PDF mancante');
  if (pdf.type !== 'application/pdf') return bad('Il file deve essere PDF');
  if (pdf.size === 0) return bad('PDF vuoto');
  if (pdf.size > 15 * 1024 * 1024) return bad('PDF troppo grande (>15 MB)');
  if (!nome) return bad('Nome mancante');
  if (!cognome) return bad('Cognome mancante');
  if (!cf || cf.length !== 16) return bad('Codice fiscale non valido');
  if (!EMAIL_RE.test(email)) return bad('Email non valida');
  if (cellulare.length < 8) return bad('Cellulare non valido');

  const pdfBytes = Buffer.from(await pdf.arrayBuffer());

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
