import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticoli, CATEGORIE_LABEL, type Articolo } from '@/config/guide';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Guide e approfondimenti',
  description:
    'Guide chiare su assicurazioni, obblighi di legge e detrazioni: polizza catastrofale per le imprese, coperture casa, previdenza complementare. Aggiornate e con le fonti.',
};

/** Indice della sezione Guide: elenco articoli con sommario e categoria. */
export default function GuidePage() {
  const articoli = getAllArticoli();

  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Guide', href: '/guide' }]} />

      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="container-content text-center">
          <span className="eyebrow">Guide</span>
          <h1 className="mt-8 font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink">
            Capire prima di <span className="hl">firmare.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">
            Approfondimenti su obblighi di legge, coperture e detrazioni. Scritti in modo
            comprensibile, con le fonti sempre indicate e la data di aggiornamento.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-content">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none max-w-content mx-auto">
            {articoli.map(a => (
              <CardArticolo key={a.slug} articolo={a} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function CardArticolo({ articolo: a }: { articolo: Articolo }) {
  return (
    <li>
      <Link
        href={`/guide/${a.slug}`}
        className="group flex flex-col h-full rounded-2xl bg-bg-card border border-black/5 p-6 hover:-translate-y-1 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft"
      >
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="font-semibold text-brand-green-dark">
            {CATEGORIE_LABEL[a.categoria]}
          </span>
          <span aria-hidden>·</span>
          <span>{a.lettura} min di lettura</span>
        </div>
        <h2 className="mt-3 font-sans font-bold text-lg text-ink leading-snug">{a.titolo}</h2>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">{a.sommario}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark group-hover:gap-1.5 transition-all">
          Leggi <span aria-hidden>→</span>
        </span>
      </Link>
    </li>
  );
}
