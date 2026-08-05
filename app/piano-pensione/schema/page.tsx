import type { Metadata } from 'next';
import Link from 'next/link';
import { PensioneHeaderPagina } from '@/components/PensioneHeaderPagina';
import { PensioneSchemaVisuale } from '@/components/PensioneSchemaVisuale';

export const metadata: Metadata = {
  title: 'Schema della previdenza complementare',
  description:
    'Lo schema della previdenza complementare spiegato semplice: adesione, fondi negoziali/aperti/PIP, anticipazioni, RITA, capitale e rendita.',
};

export default function SchemaPensionePage() {
  return (
    <>
      <PensioneHeaderPagina
        eyebrow="Lo schema"
        titolo="La previdenza,"
        accent="spiegata semplice."
        sottotitolo="Come funziona un fondo pensione dall'adesione alla rendita, in cinque passi. Tutti i numeri sono fatti di legge, verificati alle fonti."
      />

      <PensioneSchemaVisuale />

      <section className="section bg-bg-alt">
        <div className="container-content text-center">
          <span className="eyebrow">Il tuo caso</span>
          <h2 className="section-title">
            Ora vedi quanto <span className="hl">risparmi tu.</span>
          </h2>
          <p className="section-sub mx-auto">
            Lo schema vale per tutti. Il vantaggio in euro, invece, dipende dal tuo reddito e dalla
            tua età: lo calcoli in un minuto.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/piano-pensione#calcolatore" className="btn-primary">
              Calcola il tuo risparmio →
            </Link>
            <Link href="/piano-pensione/guida" className="btn-secondary">
              Leggi la guida
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
