/**
 * Quootami — Credenziali pubbliche (browser-safe)
 * ============================================================
 * Queste credenziali sono PUBBLICHE PER DESIGN:
 *  - Supabase anon key: protetta da RLS policy
 *  - Web3Forms access key: già visibile nei sorgenti del sito statico
 *
 * Le credenziali SECRETE (service_role, RESEND_API_KEY) NON SONO QUI.
 * Andrebbero in env vars Vercel SOLO se servono al backend M3 enhanced.
 * Questa versione "client-side fallback" non le richiede.
 * ============================================================
 */

export const SUPABASE = {
  url: 'https://ivcdwizhkdubjxxrukbs.supabase.co',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Y2R3aXpoa2R1Ymp4eHJ1a2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDExNDgsImV4cCI6MjA5NjgxNzE0OH0.qC1_UPr51A5MgxL-cUUD2FnOnMWSdDNwu-jyne0dTq4',
  bucket: 'documenti-lead',
} as const;

export const WEB3FORMS = {
  // Access key collegata a giacomo.rp@sistoassicurazioni.com — verificata
  accessKey: '227eeb26-f8e1-4eba-8b60-5969ab33c2c7',
  submitUrl: 'https://api.web3forms.com/submit',
} as const;
