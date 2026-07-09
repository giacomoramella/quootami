/**
 * Quootami — POST /api/firma/callback
 * ============================================================
 * Webhook ricevuto da OTP Service ad ogni aggiornamento dello stato
 * di una pratica di firma.
 *
 * Quando lo stato è "completata":
 *   1. verifica HMAC del webhook
 *   2. scarica il PDF firmato
 *   3. archivia su Supabase Storage (bucket adesioni-firmate)
 *   4. aggiorna riga pratiche
 *   5. invia email al broker con allegato il PDF firmato
 *
 * Configurazione su OTP Service:
 *   Webhook URL: https://quootami.it/api/firma/callback
 *   Header:      x-otp-signature  (HMAC-SHA256 del body con OTP_WEBHOOK_SECRET)
 *
 * In modalità mock il webhook accetta sempre (per testing locale).
 * ============================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhook,
  downloadSignedDoc,
  getOtpMode,
} from '@/lib/otpservice';
import {
  getSupabaseAdmin,
  STORAGE_BUCKET_ADESIONI_FIRMATE,
} from '@/lib/supabase';
import { sendAdesioneFirmataEmail } from '@/lib/resend';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Il praticaId arriva dal payload del webhook e finisce in path di
// storage e URL API: ammettiamo solo un formato identificatore stretto.
const PRATICA_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

export async function POST(req: NextRequest) {
  // Rate limit per-IP generoso (i webhook legittimi sono pochi; in live
  // la vera protezione è l'HMAC qui sotto).
  if (!rateLimit(`firma-callback:${clientIp(req)}`, 60, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'rate limited' }, { status: 429 });
  }

  const rawBody = await req.text();

  // 1. HMAC verify
  if (!verifyWebhook(req.headers, rawBody)) {
    console.warn('[firma/callback] HMAC invalid');
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const praticaId: string | undefined = payload.praticaId || payload.id || payload.pratica_id;
  const stato: string | undefined = payload.stato || payload.status;
  const codiceVerifica: string | undefined = payload.codiceVerifica || payload.code;
  const firmatoIl: string | undefined = payload.firmatoIl || payload.signed_at;

  if (!praticaId || !PRATICA_ID_RE.test(praticaId)) {
    return NextResponse.json({ ok: false, error: 'praticaId mancante o non valido' }, { status: 400 });
  }

  console.log(`[firma/callback] pratica=${praticaId} stato=${stato} mode=${getOtpMode()}`);

  // Stati intermedi: solo log e ack.
  if (stato !== 'completata' && stato !== 'firmata') {
    return NextResponse.json({ ok: true, ignored: true, stato });
  }

  // 2. Recupera dati pratica dal DB
  let praticaRow: any = null;
  try {
    const supa = getSupabaseAdmin();
    const r = await supa
      .from('pratiche')
      .select('*')
      .eq('otp_pratica_id', praticaId)
      .maybeSingle();
    if (r.error) console.warn('[firma/callback] lookup pratica:', r.error.message);
    praticaRow = r.data;
  } catch (e: any) {
    console.warn('[firma/callback] DB non disponibile:', e?.message);
  }

  // 3. Scarica PDF firmato
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await downloadSignedDoc(praticaId);
  } catch (e: any) {
    console.error('[firma/callback] download firmato fallito:', e?.message);
    return NextResponse.json({ ok: false, error: 'download failed' }, { status: 502 });
  }

  // 4. Archivio su Supabase (best-effort)
  let firmatoPath: string | null = null;
  try {
    const supa = getSupabaseAdmin();
    const cf = praticaRow?.firmatario_cf || 'UNKNOWN';
    firmatoPath = `${cf}/${praticaId}_FIRMATO.pdf`;
    const up = await supa.storage
      .from(STORAGE_BUCKET_ADESIONI_FIRMATE)
      .upload(firmatoPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });
    if (up.error) {
      console.warn('[firma/callback] upload firmato fallito:', up.error.message);
      firmatoPath = null;
    }
    // aggiorna stato pratica
    await supa
      .from('pratiche')
      .update({
        stato: 'completata',
        codice_verifica: codiceVerifica ?? null,
        file_firmato_path: firmatoPath,
        completed_at: firmatoIl ?? new Date().toISOString(),
      })
      .eq('otp_pratica_id', praticaId);
  } catch (e: any) {
    console.warn('[firma/callback] DB/Storage update fallito:', e?.message);
  }

  // 5. Email al broker
  try {
    if (praticaRow) {
      await sendAdesioneFirmataEmail({
        prodotto: praticaRow.prodotto || 'Allianz Previdenza',
        praticaId,
        nome: praticaRow.firmatario_nome,
        cognome: praticaRow.firmatario_cognome,
        cf: praticaRow.firmatario_cf,
        email: praticaRow.firmatario_email,
        cellulare: praticaRow.firmatario_cellulare,
        codiceVerifica,
        firmatoIl,
        pdfFirmato: pdfBuffer,
      });
    } else {
      console.warn('[firma/callback] niente pratica in DB → email non inviata');
    }
  } catch (e: any) {
    console.error('[firma/callback] email fallita:', e?.message);
    // non blocchiamo l'ack al webhook
  }

  return NextResponse.json({ ok: true });
}

// GET serve solo per ping/test del webhook URL
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'POST /api/firma/callback',
    mode: getOtpMode(),
    note: 'Webhook URL per OTP Service. Usa POST.',
  });
}
