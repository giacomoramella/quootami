/**
 * Quootami — POST /api/lead
 * ============================================================
 * Endpoint server-side che orchestra l'intero flusso:
 *
 * 1. Riceve FormData dal form lead universale
 * 2. Valida i dati con Zod
 * 3. Salva il lead su Supabase via RPC `insert_lead`
 * 4. Carica i documenti su Supabase Storage (privato)
 * 5. Converte i file in PDF (server-side, pdf-lib)
 * 6. Invia email a INTERMEDIARIO_EMAIL con allegati PDF (Resend)
 * 7. Risponde con leadId
 *
 * Runtime: nodejs (serve Buffer + pdf-lib).
 * ============================================================
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase';
import { sendLeadEmail } from '@/lib/resend';
import { fileToPdf, buildPdfFilename } from '@/lib/pdf-utils';

export const runtime = 'nodejs';

// Limite massimo per singolo file (10MB, lo stesso del bucket)
const MAX_FILE_BYTES = 10 * 1024 * 1024;

// Schema di validazione dei campi testuali del form
const leadSchema = z.object({
  prodotto: z.string().min(1).max(40),
  nome: z.string().min(2).max(80),
  cognome: z.string().min(2).max(80),
  data_nascita: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data non valida'),
  email: z.string().email(),
  telefono: z.string().regex(/^\+?[0-9 ()\-]{8,18}$/, 'Telefono non valido'),
  targa: z.string().regex(/^[A-Z0-9]{5,7}$/i).optional().or(z.literal('')),
  consenso: z.string(), // 'true' come stringa nel FormData
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 1) Estrai e valida campi testuali
    const fields = {
      prodotto: String(formData.get('prodotto') ?? ''),
      nome: String(formData.get('nome') ?? '').trim(),
      cognome: String(formData.get('cognome') ?? '').trim(),
      data_nascita: String(formData.get('data_nascita') ?? ''),
      email: String(formData.get('email') ?? '').trim(),
      telefono: String(formData.get('telefono') ?? '').trim(),
      targa: String(formData.get('targa') ?? '').trim().toUpperCase(),
      consenso: String(formData.get('consenso') ?? ''),
    };

    const validation = leadSchema.safeParse(fields);
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: 'Dati non validi', details: validation.error.flatten() },
        { status: 400 }
      );
    }
    if (fields.consenso !== 'true') {
      return NextResponse.json(
        { ok: false, error: 'Consenso al trattamento obbligatorio' },
        { status: 400 }
      );
    }

    // 2) Estrai i file (CI fronte / retro / libretto)
    const files: Record<string, File> = {};
    for (const key of ['ci_fronte', 'ci_retro', 'libretto']) {
      const f = formData.get(key);
      if (f instanceof File && f.size > 0) {
        if (f.size > MAX_FILE_BYTES) {
          return NextResponse.json(
            { ok: false, error: `${key}: file oltre i 10 MB` },
            { status: 413 }
          );
        }
        files[key] = f;
      }
    }

    // 3) Insert lead via RPC
    const supabase = getSupabaseAdmin();
    const { data: lead, error: rpcError } = await supabase.rpc('insert_lead', {
      payload: {
        prodotto: fields.prodotto,
        nome_cognome: `${fields.nome} ${fields.cognome}`,
        data_nascita: fields.data_nascita,
        email: fields.email,
        telefono: fields.telefono,
        targa: fields.targa || null,
        fonte: 'sito web · next',
        pagina: request.headers.get('referer') ?? null,
        user_agent: request.headers.get('user-agent')?.slice(0, 255) ?? null,
      },
    });

    if (rpcError) {
      console.error('[/api/lead] RPC error:', rpcError);
      return NextResponse.json(
        { ok: false, error: 'Errore salvataggio lead' },
        { status: 500 }
      );
    }

    const leadId = (lead as { id?: string })?.id ?? null;
    const documentiPaths: Record<string, string> = {};
    const attachments: Array<{ filename: string; content: Buffer }> = [];

    // 4) Upload file su Storage + 5) conversione PDF in parallelo
    const fileTasks = Object.entries(files).map(async ([key, f]) => {
      const buf = Buffer.from(await f.arrayBuffer());
      // Upload original (raw)
      const ext = (f.name.split('.').pop() ?? 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
      const safeName = `${key}-${Date.now()}.${ext || 'bin'}`;
      const path = `leads/${leadId ?? 'unknown'}/${safeName}`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, buf, { contentType: f.type || 'application/octet-stream' });
      if (upErr) {
        console.warn(`[upload] ${key}:`, upErr.message);
      } else {
        documentiPaths[key] = path;
      }

      // Conversione PDF per allegato email
      try {
        const pdfBuf = await fileToPdf(buf, f.type, f.name);
        const pdfName = buildPdfFilename(`${fields.nome}_${fields.cognome}_${key}`, f.name);
        attachments.push({ filename: pdfName, content: pdfBuf });
      } catch (e) {
        console.warn(`[pdf-convert] ${key}:`, (e as Error).message);
        // Fallback: allega il file originale
        attachments.push({ filename: f.name, content: buf });
      }
    });

    await Promise.all(fileTasks);

    // Aggiorna lead con i path documenti (best-effort)
    if (leadId && Object.keys(documentiPaths).length) {
      await supabase
        .from('leads')
        .update({ documenti: documentiPaths })
        .eq('id', leadId);
    }

    // 6) Email a giacomo.rp@ con allegati PDF
    try {
      await sendLeadEmail({
        prodotto: fields.prodotto,
        nome: fields.nome,
        cognome: fields.cognome,
        dataNascita: fields.data_nascita,
        email: fields.email,
        telefono: fields.telefono,
        targa: fields.targa || undefined,
        leadId: leadId ?? undefined,
        attachments,
      });
    } catch (e) {
      console.error('[/api/lead] resend error:', e);
      // Non blocca la risposta: il lead è salvato comunque
    }

    return NextResponse.json({ ok: true, leadId }, { status: 200 });
  } catch (err) {
    console.error('[/api/lead] uncaught:', err);
    return NextResponse.json(
      { ok: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
