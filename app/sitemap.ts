import type { MetadataRoute } from 'next';
import { OPERATORE } from '@/config/operatore';
import { getAllPolizze } from '@/config/polizze';
import { getAllArticoli } from '@/config/guide';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = OPERATORE.brand.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/polizze`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/luce`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/guide`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // NB: /piano-pensione non va elencata qui — è già generata dal ciclo sui
    // prodotti più sotto (è uno slug di config/polizze.ts) e finirebbe doppia.
    { url: `${baseUrl}/piano-pensione/guida`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/piano-pensione/schema`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/piano-pensione/glossario`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chi-siamo`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sinistri`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contatti`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/mappa-sito`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/trasparenza`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const productPages: MetadataRoute.Sitemap = getAllPolizze().map(p => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Le guide si registrano da sole: basta aggiungerle a config/guide.ts
  const guidePages: MetadataRoute.Sitemap = getAllArticoli().map(a => ({
    url: `${baseUrl}/guide/${a.slug}`,
    lastModified: new Date(`${a.aggiornato ?? a.pubblicato}T00:00:00`),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...productPages, ...guidePages];
}
