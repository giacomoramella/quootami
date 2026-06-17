import type { Metadata } from 'next';
import { ProductPage } from '@/components/ProductPage';
import { getPolizza } from '@/config/polizze';

const polizza = getPolizza('polizza-casa')!;

export const metadata: Metadata = {
  title: polizza.metaTitle,
  description: polizza.metaDesc,
  openGraph: {
    title: polizza.metaTitle,
    description: polizza.metaDesc,
    images: [{ url: '/og-image.png', alt: polizza.ogImageAlt, width: 1200, height: 630 }],
  },
};

export default function PolizzaCasaPage() {
  return <ProductPage polizza={polizza} />;
}
