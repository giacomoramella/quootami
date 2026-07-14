/**
 * Quootami — Next.js config con security headers BANKING-GRADE
 *
 * Riferimenti:
 * - OWASP Secure Headers Project
 * - Linee guida AGID per la PA
 * - Banca d'Italia: "Linee guida cybersecurity online banking" (analoghi)
 *
 * Nota: la CSP usa nonce dinamici generati in `middleware.ts` per
 * autorizzare gli script inline necessari a Next.js (idratazione,
 * routing) senza `unsafe-inline`. Questo è lo standard OWASP per
 * mitigare XSS in modo robusto.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // rimuove X-Powered-By: Next.js (info disclosure)

  // Il progetto vive in ~/Desktop, che iCloud sincronizza: i file di build
  // in .next venivano evitti a caso a metà build/serve (ENOENT random).
  // Il suffisso .nosync esclude la cartella dalla sincronizzazione iCloud.
  // Solo in locale: su Vercel (env VERCEL=1) si usa il default .next,
  // che è quello che il builder Vercel si aspetta.
  distDir: process.env.VERCEL ? '.next' : '.next.nosync',

  // Forza HTTPS in produzione (Vercel lo fa già a livello edge; HSTS via headers)
  async headers() {
    const securityHeaders = [
      // ── HSTS: forza HTTPS per 2 anni + preload list ──
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      // ── No MIME sniffing ──
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // ── Anti-clickjacking ──
      { key: 'X-Frame-Options', value: 'DENY' },
      // ── Referrer policy minimale ──
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // ── Disabilita feature browser non usate ──
      {
        key: 'Permissions-Policy',
        value: [
          'accelerometer=()',
          'ambient-light-sensor=()',
          'autoplay=()',
          'battery=()',
          'camera=()',
          'display-capture=()',
          'document-domain=()',
          'encrypted-media=()',
          'execution-while-not-rendered=()',
          'execution-while-out-of-viewport=()',
          'fullscreen=(self)',
          'geolocation=()',
          'gyroscope=()',
          'keyboard-map=()',
          'magnetometer=()',
          'microphone=()',
          'midi=()',
          'navigation-override=()',
          'payment=()',
          'picture-in-picture=()',
          'publickey-credentials-get=()',
          'screen-wake-lock=()',
          'sync-xhr=()',
          'usb=()',
          'web-share=()',
          'xr-spatial-tracking=()',
          'interest-cohort=()',
        ].join(', '),
      },
      // ── Isolamento same-origin ──
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
      // ── DNS prefetch ──
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      // ── No Flash/Silverlight cross-domain ──
      { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
      // ── Process isolation a livello browser ──
      { key: 'Origin-Agent-Cluster', value: '?1' },
      // ── Disabilita Adobe Reader "open with" ──
      { key: 'X-Download-Options', value: 'noopen' },
      // ── Indicizzazione: index, follow ──
      { key: 'X-Robots-Tag', value: 'index, follow' },
    ];

    // ── CSP per il form di adesione statico (public/firma-allianz.html) ──
    // Il middleware lo esclude (il matcher salta i path con estensione),
    // quindi la CSP va applicata qui. Lo script inline del form è
    // autorizzato tramite hash SHA-256: se modifichi lo script inline
    // del file, ricalcola l'hash con:
    //   python3 -c "import re,hashlib,base64;s=open('public/firma-allianz.html').read();sc=re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>',s,re.S)[0];print('sha256-'+base64.b64encode(hashlib.sha256(sc.encode()).digest()).decode())"
    const firmaCsp = [
      "default-src 'self'",
      "script-src 'self' 'sha256-44xrcPreeWyLNXbZee7xh445QgTxiJLHPayzRIka1BQ='",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/firma-allianz.html',
        headers: [{ key: 'Content-Security-Policy', value: firmaCsp }],
      },
      // ── Cache-control aggressivo per asset statici ──
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*\\.(?:woff2?|svg|png|jpg|jpeg|webp|ico|avif))',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // URL SEO-friendly: no trailing slash, no estensione
  trailingSlash: false,

  // Il comparatore era una pagina statica /luce.html: redirect permanente
  // alla pagina Next (link in email di verifica già inviate, segnalibri).
  async redirects() {
    return [{ source: '/luce.html', destination: '/luce', permanent: true }];
  },

  // Ottimizzazione immagini con next/image
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },

};

module.exports = nextConfig;
