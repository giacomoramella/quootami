/**
 * Quootami — Default SEO + Open Graph
 * Usato in app/layout.tsx come fallback per ogni pagina,
 * ogni pagina può sovrascrivere via `generateMetadata()`.
 */
import type { Metadata } from 'next';
import { OPERATORE } from './operatore';

const baseUrl = OPERATORE.brand.url;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${OPERATORE.brand.name} · Comparatore digitale, consulenza personale`,
    template: `%s · ${OPERATORE.brand.name}`,
  },
  description: OPERATORE.brand.description,
  applicationName: OPERATORE.brand.name,
  authors: [{ name: OPERATORE.brand.name, url: baseUrl }],
  generator: 'Next.js 14',
  keywords: [
    'preventivo assicurazione',
    'confronto polizze',
    'broker assicurativo',
    'fondo pensione',
    'rc auto',
    'polizza casa',
  ],
  referrer: 'strict-origin-when-cross-origin',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: {
    // './' = canonical relativo: si risolve contro metadataBase + path della
    // pagina corrente, così OGNI pagina è canonica di se stessa (prima tutte
    // puntavano alla home → Google le trattava come duplicati).
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    // Nessun og:url fisso: ogni pagina resta identificata dalla propria URL,
    // così le anteprime social (WhatsApp/Facebook) non vengono "ricollassate"
    // tutte sulla home. La canonicalizzazione SEO resta gestita da alternates.canonical.
    siteName: OPERATORE.brand.name,
    title: `${OPERATORE.brand.name} · Comparatore digitale, consulenza personale`,
    description: OPERATORE.brand.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `${OPERATORE.brand.name} — ${OPERATORE.brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@quootami',
    title: `${OPERATORE.brand.name} · Comparatore digitale, consulenza personale`,
    description: OPERATORE.brand.description,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  category: 'finance',
};
