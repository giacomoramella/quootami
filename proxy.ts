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

const isProd = process.env.NODE_ENV === 'production';

export function proxy(request: NextRequest) {
  // ── CSP banking-grade ──
  // In dev permettiamo 'unsafe-eval'/'unsafe-inline' per HMR di Next.js.
  const nonce = btoa(crypto.randomUUID());
  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
    : "'self' 'unsafe-eval' 'unsafe-inline' https:";

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com data:;
    connect-src 'self' https://*.supabase.co https://api.resend.com https://api.web3forms.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://connect.facebook.net https://www.facebook.com;
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

  // Il nonce deve viaggiare anche sulla request: Next.js lo legge
  // dall'header CSP e lo applica ai propri <script> in rendering dinamico.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

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
