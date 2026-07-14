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
import { sendAdesioneFirmataEmail, INTERMEDIARIO_EMAIL } from '@/lib/resend';
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

  // 2b. Idempotenza: i provider webhook ritentano e possono inviare sia
  // 'firmata' sia 'completata' per la stessa pratica. Se è già chiusa,
  // ack senza rielaborare (niente email duplicate al broker).
  if (praticaRow?.stato === 'completata') {
    console.log(`[firma/callback] pratica=${praticaId} già completata — skip`);
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // 3. Scarica PDF firmato
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await downloadSignedDoc(praticaId);
  } catch (e: any) {
    console.error('[firma/callback] download firmato fallito:', e?.message);
    return NextResponse.json({ ok: false, error: 'download failed' }, { status: 502 });
  }

  // 4. Archivio su Supabase Storage (best-effort, upsert = idempotente)
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
  } catch (e: any) {
    console.warn('[firma/callback] Storage non disponibile:', e?.message);
  }

  // 5. Email al broker — PRIMA di marcare la pratica completata: se
  // l'invio fallisce rispondiamo 502 e il provider ritenta il webhook
  // (la firma non deve mai andare persa in silenzio). Senza riga DB si
  // invia comunque un'email di fallback con il PDF e l'ID pratica.
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
      console.warn(`[firma/callback] pratica=${praticaId} senza riga DB → email di fallback`);
      await sendAdesioneFirmataEmail({
        prodotto: 'Allianz Previdenza',
        praticaId,
        nome: '(dati firmatario non disponibili',
        cognome: `— pratica ${praticaId})`,
        cf: 'n/d',
        email: INTERMEDIARIO_EMAIL,
        cellulare: 'n/d',
        codiceVerifica,
        firmatoIl,
        pdfFirmato: pdfBuffer,
      });
    }
  } catch (e: any) {
    if (getOtpMode() === 'mock') {
      // In mock Resend può non essere configurato: best-effort come il resto.
      console.warn('[firma/callback] email fallita (mock, best-effort):', e?.message);
    } else {
      console.error('[firma/callback] email fallita, chiedo retry al provider:', e?.message);
      return NextResponse.json({ ok: false, error: 'email delivery failed' }, { status: 502 });
    }
  }

  // 6. Chiusura pratica (best-effort: l'email è già partita)
  try {
    const supa = getSupabaseAdmin();
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
    console.warn('[firma/callback] update pratica fallito:', e?.message);
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
