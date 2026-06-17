import type { MetadataRoute } from 'next';
import { OPERATORE } from '@/config/operatore';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${OPERATORE.brand.url}/sitemap.xml`,
    host: OPERATORE.brand.url,
  };
}
