/**
 * Quootami — Supabase clients
 * ============================================================
 * Due client distinti per i due contesti di esecuzione:
 *
 * 1. `supabaseAnon` — client browser-safe (anon key)
 *    Usato per chiamate dal client che rispettano le RLS.
 *
 * 2. `supabaseAdmin` — client server-only (service_role key)
 *    Bypassa le RLS. NON DEVE essere mai esposto al browser.
 *    Usato dalle API routes per operazioni privilegiate.
 *
 * Le env vars devono essere configurate:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY    (SENZA `NEXT_PUBLIC_`)
 * ============================================================
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[Quootami] Variabili Supabase mancanti. Configura NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

// Client browser-safe — rispetta le RLS, usabile lato client e server
export const supabaseAnon = createClient(
  SUPABASE_URL ?? 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY ?? 'placeholder-key',
  {
    auth: { persistSession: false },
  }
);

// Admin client — bypassa RLS, USARE SOLO NEL SERVER (API routes / Server Actions)
export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      '[Quootami] SUPABASE_SERVICE_ROLE_KEY non configurata. Imposta la variabile su Vercel (Environment Variables).'
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Nome bucket Storage per i documenti dei lead
export const STORAGE_BUCKET = 'documenti-lead';

// Bucket Storage per il flusso FEA (M4 — adesione Allianz Previdenza)
export const STORAGE_BUCKET_ADESIONI_BOZZE = 'adesioni-bozze';   // PDF compilati pre-firma
export const STORAGE_BUCKET_ADESIONI_FIRMATE = 'adesioni-firmate'; // PDF firmati dal cliente
