import type { Metadata } from 'next';
import Link from 'next/link';
import { PensioneHeaderPagina } from '@/components/PensioneHeaderPagina';
import { PensioneGlossario } from '@/components/PensioneGlossario';

export const metadata: Metadata = {
  title: 'Glossario della previdenza · I termini dei fondi pensione',
  description:
    'I termini della previdenza complementare spiegati in una riga: TFR, fondo negoziale, fondo aperto, PIP, ISC, comparto, RITA, deducibilità e altri.',
};

export default function GlossarioPensionePage() {
  return (
    <>
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
