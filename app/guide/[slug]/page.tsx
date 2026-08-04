import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticolo, getAllArticoli, CATEGORIE_LABEL } from '@/config/guide';
import { getPolizza } from '@/config/polizze';
import { OPERATORE } from '@/config/operatore';
import { JsonLdArticle, JsonLdBreadcrumb } from '@/components/JsonLd';
import { CatastrofaleObbligo } from '@/components/guide/CatastrofaleObbligo';
import { CatastrofaleCosaCopre } from '@/components/guide/CatastrofaleCosaCopre';
import { DetrazioneCalamitosi } from '@/components/guide/DetrazioneCalamitosi';

/** Mappa slug → corpo dell'articolo (componenti server). */
const CORPI: Record<string, () => ReactNode> = {
  'polizza-catastrofale-imprese-chi-e-obbligato': CatastrofaleObbligo,
  'polizza-catastrofale-cosa-copre': CatastrofaleCosaCopre,
  'detrazione-polizza-eventi-calamitosi-casa': DetrazioneCalamitosi,
};

export function generateStaticParams() {
  return getAllArticoli().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticolo(slug);
  if (!a) return {};
  return {
    title: a.metaTitle,
    description: a.metaDesc,
    openGraph: {
      type: 'article',
      title: a.metaTitle,
      description: a.metaDesc,
      publishedTime: a.pubblicato,
      modifiedTime: a.aggiornato ?? a.pubblicato,
      authors: [OPERATORE.collaboratore.nome_completo],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: a.titolo }],
    },
  };
}

/**
 * Evidenzia in giallo la parola/e `accento` LASCIANDOLA al suo posto nel titolo
 * (evita di spostarla in fondo e stravolgere la frase).
 */
function TitoloConAccento({ titolo, accento }: { titolo: string; accento: string }) {
  const i = titolo.indexOf(accento);
  if (i === -1) return <>{titolo}</>;
  return (
    <>
      {titolo.slice(0, i)}
      <span className="hl">{accento}</span>
      {titolo.slice(i + accento.length)}
    </>
  );
}

/** Formatta una data ISO in italiano leggibile. */
function dataIt(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ArticoloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticolo(slug);
  const Corpo = CORPI[slug];
  if (!a || !Corpo) notFound();

  const polizza = a.prodotto ? getPolizza(a.prodotto) : undefined;
  const altri = getAllArticoli().filter(x => x.slug !== a.slug).slice(0, 2);

  return (
    <>
      <JsonLdArticle
        titolo={a.titolo}
        descrizione={a.metaDesc}
        href={`/guide/${a.slug}`}
        pubblicato={a.pubblicato}
        aggiornato={a.aggiornato}
      />
      <JsonLdBreadcrumb
        voci={[
          { nome: 'Guide', href: '/guide' },
          { nome: a.titolo, href: `/guide/${a.slug}` },
        ]}
      />

      {/* Testata */}
      <section className="pt-32 pb-10 px-5 sm:px-8">
        <div className="container-content">
          <nav aria-label="Percorso" className="max-w-prose-wide mx-auto mb-6 text-sm text-ink-muted">
            <Link href="/guide" className="hover:text-ink transition-colors">
              ← Tutte le guide
            </Link>
          </nav>
          <div className="max-w-prose-wide mx-auto">
            <span className="eyebrow">{a.eyebrow}</span>
            <h1 className="mt-6 font-sans font-bold text-3xl sm:text-5xl tracking-tight leading-[1.1] text-ink">
              <TitoloConAccento titolo={a.titolo} accento={a.accent} />
            </h1>
            <p className="mt-5 text-base sm:text-lg text-ink-muted leading-relaxed">{a.sommario}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
              <span>{CATEGORIE_LABEL[a.categoria]}</span>
              <span aria-hidden>·</span>
              <span>{a.lettura} min di lettura</span>
              <span aria-hidden>·</span>
              <span>
                Aggiornato al{' '}
                <time dateTime={a.aggiornato ?? a.pubblicato}>
                  {dataIt(a.aggiornato ?? a.pubblicato)}
                </time>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Corpo */}
      <article className="px-5 sm:px-8 pb-16">
        <div className="max-w-prose-wide mx-auto prose-quootami">
          <Corpo />
        </div>
      </article>

      {/* CTA al prodotto collegato */}
      {polizza && (
        <section className="section bg-bg-alt">
          <div className="container-content text-center">
            <span className="eyebrow">Ti serve una mano?</span>
            <h2 className="section-title">
              Parla con <span className="hl">Quootami.</span>
            </h2>
            <p className="section-sub mx-auto">
              Quootami confronta le proposte di più compagnie e ti dice cosa serve davvero al tuo
              caso. Preventivo gratuito, nessun impegno.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${polizza.slug}#preventivo`} className="btn-primary">
                Richiedi un preventivo →
              </Link>
              <a
                href={OPERATORE.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Scrivi su WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Altre guide */}
      {altri.length > 0 && (
        <section className="section">
          <div className="container-content">
            <h2 className="font-sans font-bold text-xl text-ink text-center mb-8">Altre guide</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none max-w-content mx-auto">
              {altri.map(x => (
                <li key={x.slug}>
                  <Link
                    href={`/guide/${x.slug}`}
                    className="group flex flex-col h-full rounded-2xl bg-bg-card border border-black/5 p-6 hover:-translate-y-1 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft"
                  >
                    <span className="text-xs font-semibold text-brand-green-dark">
                      {CATEGORIE_LABEL[x.categoria]}
                    </span>
                    <span className="mt-2 font-sans font-bold text-base text-ink leading-snug">
                      {x.titolo}
                    </span>
                    <span className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">
                      {x.sommario}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark group-hover:gap-1.5 transition-all">
                      Leggi <span aria-hidden>→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
