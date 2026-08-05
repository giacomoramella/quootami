import type { Metadata } from 'next';
import Link from 'next/link';
import { PensioneHeaderPagina } from '@/components/PensioneHeaderPagina';
import { PensioneGlossario } from '@/components/PensioneGlossario';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

/** Home → Piano pensione → sottopagina. */
const BREADCRUMB = [
  { nome: 'Piano pensione', href: '/piano-pensione' },
  { nome: 'Glossario della previdenza', href: '/piano-pensione/glossario' },
];

const META_TITLE = 'Glossario della previdenza';
const META_DESC =
  'I termini della previdenza complementare spiegati in una riga: TFR, fondo negoziale, fondo aperto, PIP, ISC, comparto, RITA, deducibilità e altri.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    images: [
      {
        url: '/og-image.png',
        alt: 'Quootami — glossario della previdenza complementare',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function GlossarioPensionePage() {
  return (
    <>
      <JsonLdBreadcrumb voci={BREADCRUMB} />
      <PensioneHeaderPagina
        eyebrow="Glossario"
        titolo="Le parole della"
        accent="previdenza."
        sottotitolo="Quattordici termini che tornano nella guida e nello schema, spiegati in modo semplice e neutrale."
      />

      <PensioneGlossario heading={false} />

      <section className="section bg-bg-alt">
        <div className="container-content text-center">
          <p className="section-sub mx-auto">
            Un termine non è chiaro nel tuo caso? Ne parli con una persona vera.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/piano-pensione/guida" className="btn-secondary">
              Torna alla guida
            </Link>
            <Link href="/piano-pensione#calcolatore" className="btn-primary">
              Calcola il tuo risparmio →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
