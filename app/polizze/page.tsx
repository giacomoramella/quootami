import type { Metadata } from 'next';
import Link from 'next/link';
import { getPolizzeByCategory, type Polizza } from '@/config/polizze';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

const META_TITLE = 'Polizze assicurative · Privati e imprese';
const META_DESC =
  'Tutte le polizze Quootami: auto, casa, salute e vita, cyber, animali, RC professionale e Catastrofale PMI. Preventivo gratuito.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    images: [
      {
        url: '/og-image.png',
        alt: 'Quootami — le polizze per privati e imprese',
        width: 1200,
        height: 630,
      },
    ],
  },
};

/**
 * Emoji per slug — le stesse già associate ai prodotti nella home
 * prima della riorganizzazione in hub.
 */
const EMOJI: Record<string, string> = {
  'polizza-auto': '🚗',
  'polizza-casa': '🏠',
  salute: '🩺',
  cyber: '🔐',
  'polizza-animali': '🐾',
  rc: '🏢',
};

export default function PolizzePage() {
  const privati = getPolizzeByCategory('privati');
  const imprese = getPolizzeByCategory('imprese');

  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Polizze', href: '/polizze' }]} />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-12 px-5 sm:px-8">
        <div
          aria-hidden
          className="blob-yellow top-[-320px] left-[-180px] w-[620px] h-[620px]"
        />
        <div className="container-content text-center relative">
          <span className="eyebrow">Polizze assicurative</span>
          <h1 className="font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink mt-4">
            Copertura per ogni <span className="hl">esigenza.</span>
          </h1>
          <p className="section-sub mx-auto">
            Quootami confronta le proposte di più compagnie e seleziona quella adatta al tuo caso.
            Il preventivo è gratuito e senza impegno.
          </p>
        </div>
      </section>

      {/* ─── PRIVATI ─── */}
      <section className="section pt-8">
        <div className="container-content">
          <div className="mb-8">
            <span className="eyebrow">Per te e la tua famiglia</span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-ink mt-2">
              Privati
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {privati.map(p => (
              <PolizzaCard key={p.slug} polizza={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMPRESE ─── */}
      <section className="section pt-0">
        <div className="container-content">
          <div className="mb-8">
            <span className="eyebrow">Per la tua attività</span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-ink mt-2">
              Imprese e professionisti
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {imprese.map(p => (
              <PolizzaCard key={p.slug} polizza={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ALTRE AREE ─── */}
      <section className="section pt-0">
        <div className="container-content">
          <div className="rounded-3xl bg-bg-alt p-8 sm:p-10 text-center">
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-ink">
              Quootami non si ferma alle polizze.
            </h2>
            <p className="text-sm sm:text-base text-ink-soft mt-2 max-w-prose-wide mx-auto">
              Oltre alle coperture assicurative puoi costruire la pensione integrativa con vantaggio
              fiscale e confrontare le tariffe di luce e gas sui dati ufficiali ARERA.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/piano-pensione" className="btn-secondary">
                Fondo pensione
              </Link>
              <Link href="/luce" className="btn-secondary">
                Luce e Gas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PolizzaCard({ polizza }: { polizza: Polizza }) {
  return (
    <Link
      href={`/${polizza.slug}`}
      className="group relative block p-7 rounded-3xl bg-bg-card border border-black/5 hover:border-brand-yellow hover:shadow-brand-md transition-all duration-300 ease-soft hover:-translate-y-1.5"
    >
      <div
        className="w-14 h-14 rounded-2xl bg-bg-alt flex items-center justify-center text-2xl mb-4
                   group-hover:bg-brand-yellow/20 group-hover:scale-110 transition-all duration-300 ease-soft"
        aria-hidden
      >
        {EMOJI[polizza.slug] ?? '📄'}
      </div>
      <h3 className="font-sans font-bold text-base text-ink">{polizza.title}</h3>
      <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{polizza.shortDesc}</p>
      <span
        className="absolute top-7 right-6 w-8 h-8 rounded-full bg-bg-alt flex items-center justify-center text-ink-muted font-semibold group-hover:bg-brand-yellow group-hover:text-ink group-hover:translate-x-1 transition-all duration-300"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
