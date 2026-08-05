import Link from 'next/link';
import { getArticoliPerProdotto, CATEGORIE_LABEL } from '@/config/guide';

/**
 * Blocco "Approfondisci" in fondo alle pagine prodotto.
 *
 * Chiude il collegamento interno fra guide e prodotti: le guide rimandavano già
 * al prodotto (CTA in fondo all'articolo), ma il prodotto non rimandava alle
 * guide, quindi il collegamento era a senso unico.
 *
 * Le voci si ricavano da `config/guide.ts` (campo `prodotto`): aggiungendo una
 * guida con `prodotto: '<slug>'` compare qui da sola. Se il prodotto non ha
 * ancora guide collegate il blocco non viene reso.
 */
export function GuideCorrelate({ slug }: { slug: string }) {
  const articoli = getArticoliPerProdotto(slug);
  if (articoli.length === 0) return null;

  return (
    <section className="section">
      <div className="container-content">
        <span className="eyebrow block text-center">Approfondisci</span>
        <h2 className="section-title text-center">
          Prima di decidere, <span className="hl">informati.</span>
        </h2>
        <p className="section-sub mx-auto text-center">
          Guide brevi, con le fonti di legge citate: cosa prevede la norma, cosa resta escluso e
          cosa conviene valutare.
        </p>

        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 list-none max-w-content mx-auto">
          {articoli.map(a => (
            <li key={a.slug}>
              <Link
                href={`/guide/${a.slug}`}
                className="group flex flex-col h-full rounded-2xl bg-bg-card border border-black/5 p-6 hover:-translate-y-1 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft"
              >
                <span className="text-xs font-semibold text-brand-green-dark">
                  {CATEGORIE_LABEL[a.categoria]} · {a.lettura} min
                </span>
                <span className="mt-2 font-sans font-bold text-base text-ink leading-snug">
                  {a.titolo}
                </span>
                <span className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">
                  {a.sommario}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark group-hover:gap-1.5 transition-all">
                  Leggi <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link
            href="/guide"
            className="text-sm font-bold text-brand-green-dark hover:underline underline-offset-4"
          >
            Tutte le guide →
          </Link>
        </p>
      </div>
    </section>
  );
}
