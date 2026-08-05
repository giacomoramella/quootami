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

const META_TITLE = 'Glossario della previdenza complementare';
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

      {/* H2 proprio: il componente è montato con heading={false} per non
          ripetere l'H1, ma senza questo la pagina resterebbe priva di H2. */}
      <section className="section pb-0">
        <div className="container-content">
          <div className="max-w-prose-wide mx-auto prose-quootami">
            <h2>I termini della previdenza complementare</h2>
            <p>
              Il linguaggio dei fondi pensione è pieno di sigle che cambiano il senso di una scelta:
              un ISC di mezzo punto in più erode il capitale finale, un comparto scelto senza
              guardare l&apos;orizzonte temporale può costare rendimento, e parole come
              anticipazione, riscatto e RITA indicano tre cose molto diverse fra loro.
            </p>
            <p>
              Qui sotto trovi le quattordici voci che tornano più spesso nella{' '}
              <Link href="/piano-pensione/guida">guida ai fondi pensione</Link> e nello{' '}
              <Link href="/piano-pensione/schema">schema della previdenza</Link>, spiegate in una
              riga e in modo neutrale.
            </p>
          </div>
        </div>
      </section>

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
