import type { Metadata } from 'next';
import { ProductPage } from '@/components/ProductPage';
import { CalcolatoreFondoPensione } from '@/components/CalcolatoreFondoPensione';
import { PensioneDati } from '@/components/PensioneDati';
import { getPolizza } from '@/config/polizze';

const polizza = getPolizza('piano-pensione')!;

export const metadata: Metadata = {
  title: polizza.metaTitle,
  description: polizza.metaDesc,
  openGraph: {
    title: polizza.metaTitle,
    description: polizza.metaDesc,
    images: [{ url: '/og-image.png', alt: polizza.ogImageAlt, width: 1200, height: 630 }],
  },
};

export default function PianoPensionePage() {
  return (
    <ProductPage
      polizza={polizza}
      extra={
        <>
          <CalcolatoreFondoPensione />
          <PensioneDati />
        </>
      }
    />
  );
}
