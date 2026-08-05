import type { MetadataRoute } from 'next';
import { OPERATORE } from '@/config/operatore';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // /_next/static NON va bloccato: contiene CSS e JS: senza, Googlebot
        // renderizza la pagina "nuda" e ne penalizza la valutazione mobile.
        allow: ['/', '/_next/static/'],
        disallow: [
          '/api/',
          '/_next/image',
          // modulo di adesione standalone: non è una pagina di contenuto e
          // duplicherebbe i meta della home
          '/firma-allianz.html',
        ],
      },
    ],
    sitemap: `${OPERATORE.brand.url}/sitemap.xml`,
    host: OPERATORE.brand.url,
  };
}
