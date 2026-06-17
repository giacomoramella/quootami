/**
 * Quootami — POST /api/lead
 * ============================================================
 * Endpoint server-side LEGACY.
 *
 * Il LeadForm attuale lavora interamente client-side (Supabase anon
 * + Web3Forms) e NON chiama più questa route. Lasciato qui per
 * compatibilità con eventuali integrazioni future M3 enhanced
 * (Resend con allegati PDF, conversione server-side, ecc.).
 *
 * Per attivarla servono le env vars:
 * - SUPABASE_SERVICE_ROLE_KEY
 * - RESEND_API_KEY
 * ============================================================
 */
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: 'Endpoint legacy non attivo. Il form usa direttamente Supabase + Web3Forms.',
    },
    { status: 410 }
  );
}
