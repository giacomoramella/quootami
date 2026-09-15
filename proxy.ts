/**
 * Quootami — Proxy (ex middleware, convenzione Next.js 16) con CSP
 * + security banking-grade
 *
 * CSP strategia (pattern ufficiale Next.js):
 * - Nonce per-request + `strict-dynamic`: solo gli script con il nonce
 *   (iniettato da Next.js nei propri tag <script>) vengono eseguiti, e la
 *   fiducia si propaga agli script che questi caricano dinamicamente.
 * - Il nonce viene passato a Next.js tramite l'header CSP sulla *request*:
 *   Next lo applica automaticamente ai propri script durante il rendering
 *   dinamico (per questo `app/layout.tsx` ha `dynamic = 'force-dynamic'`).
 * - Niente `unsafe-eval`, niente `unsafe-inline` per gli script.
 * - Style inline permessi (Tailwind hash) per consentire Next.js styled-jsx
 *   e Tailwind generato a build time. Mitigato da CSP rigorosa sugli script.
 *
 * Cookie:
 * - Forzati Secure + HttpOnly + SameSite=Strict (banking-grade)
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  MANUTENZIONE,
  RETRY_AFTER_SECONDI,
  htmlManutenzione,
} from '@/config/manutenzione';

const isProd = process.env.NODE_ENV === 'production';

export function proxy(request: NextRequest) {
  // ── CSP banking-grade ──
  // In dev permettiamo 'unsafe-eval'/'unsafe-inline' per HMR di Next.js.
  //
  // Niente fonts.googleapis.com / fonts.gstatic.com: `next/font/google` scarica
  // i font in fase di build e li serve da /_next/static/media, quindi il browser
  // non contatta mai Google. Erano permessi morti, tolti il 07/08/2026.
  // Se un domani si aggiunge un font remoto vanno rimessi in style-src e font-src.
  const nonce = btoa(crypto.randomUUID());
  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
    : "'self' 'unsafe-eval' 'unsafe-inline' https:";

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co https://api.web3forms.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isProd ? 'upgrade-insecure-requests;' : ''}
    ${isProd ? 'block-all-mixed-content;' : ''}
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Tolti da connect-src il 15/09/2026 perche' erano permessi concessi a vuoto:
  //  - api.resend.com: Resend gira solo lato server (lib/resend, route firma),
  //    e il server non e' soggetto alla CSP del browser;
  //  - connect.facebook.net e www.facebook.com: il Meta Pixel non ha un ID
  //    configurato (NEXT_PUBLIC_META_PIXEL_ID assente su Vercel), quindi non
  //    viene mai caricato. VANNO RIMESSI qui il giorno in cui si attiva il
  //    Pixel, altrimenti la CSP lo blocca e il blocco e' silenzioso.

  // Il nonce deve viaggiare anche sulla request: Next.js lo legge
  // dall'header CSP e lo applica ai propri <script> in rendering dinamico.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // ── Pausa del sito (config/manutenzione.ts) ──
  // 503 e non 200: e' la risposta che Google interpreta come fermo
  // temporaneo, quindi tiene gli URL nell'indice e congela le posizioni
  // invece di deindicizzare. Con un 200 (o peggio un noindex) le pagine
  // uscirebbero dall'indice e alla riapertura si ripartirebbe da capo.
  //
  // La pagina viene servita direttamente da qui, non riscritta su una route:
  // una pagina dell'App Router non puo' scegliere il proprio status HTTP, e
  // qui lo status e' l'unica cosa che conta davvero.
  if (MANUTENZIONE) {
    return new NextResponse(htmlManutenzione(), {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': String(RETRY_AFTER_SECONDI),
        // Nessuna copia in cache: alla riapertura la pagina di cortesia non
        // deve restare appesa in CDN o nel browser di chi e' gia' passato.
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Security-Policy': cspHeader,
      },
    });
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Security-Policy', cspHeader);

  // ── Cookie banking-grade ──
  // Forza Secure + HttpOnly + SameSite=Strict sui cookie applicativi.
  const cookies = response.cookies.getAll();
  for (const cookie of cookies) {
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
  }

  return response;
}

// Applica a tutte le pagine eccetto asset statici
export const config = {
  matcher: [
    {
      source:
        '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
