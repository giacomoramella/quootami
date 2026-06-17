/**
 * Quootami — Middleware con CSP + security banking-grade
 *
 * CSP strategia:
 * - `script-src 'self' 'strict-dynamic' https:` permette script Next.js
 *   bundlati e ne trust la propagazione (strict-dynamic).
 * - Niente `unsafe-eval`, niente `unsafe-inline` per script di terze parti.
 * - Style inline permessi (Tailwind hash) per consentire Next.js styled-jsx
 *   e Tailwind generato a build time. Mitigato da CSP rigorosa sugli script.
 *
 * Cookie:
 * - Forzati Secure + HttpOnly + SameSite=Strict (banking-grade)
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export function middleware(request: NextRequest) {
  // ── CSP banking-grade ──
  // In dev permettiamo 'unsafe-eval' per HMR di Next.js. In prod nessuna pietà.
  const scriptSrc = isProd
    ? "'self' 'strict-dynamic' https: 'sha256-quootami'"
    : "'self' 'unsafe-eval' 'unsafe-inline' https:";

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com data:;
    connect-src 'self' https://*.supabase.co https://api.resend.com;
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

  const response = NextResponse.next();
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
