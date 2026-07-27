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
    canonical: baseUrl,
    languages: { 'it-IT': baseUrl },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: baseUrl,
    siteName: OPERATORE.brand.name,
    title: `${OPERATORE.brand.name} · Comparatore digitale, consulenza personale`,
    description: OPERATORE.brand.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
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
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  category: 'finance',
};
