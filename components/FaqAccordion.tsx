'use client';

/**
 * FAQ a fisarmonica — unico modo in cui le domande frequenti compaiono sul sito.
 *
 * Prima le pagine hub (/polizze, /luce) rendevano le stesse FAQ come un muro di
 * h3+p dentro `prose-quootami`: contenuto corretto ma fuori dal linguaggio visivo
 * del resto del sito, tutto a card, e lunghissimo da scorrere su mobile.
 *
 * Nota SEO: le risposte restano nel DOM anche da chiuse, come richiede Google per
 * poter pubblicare il dato strutturato FAQPage (`JsonLdFaq`/`JsonLdFaqGenerico`).
 */

import { useState } from 'react';
import type { Polizza } from '@/config/polizze';

export type FaqItem = { q: string; a: string };

export function FaqAccordion({
  items,
  title,
  eyebrow = 'Domande frequenti',
  className = 'section',
}: {
  items: FaqItem[];
  title: string;
  eyebrow?: string;
  /** Permette alle pagine di regolare la spaziatura verticale (es. `section pt-0`). */
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section id="faq" className={className}>
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
        </div>

        <div className="max-w-prose-wide mx-auto space-y-3">
          {items.map((item, i) => (
            <div
              key={item.q}
              className={`rounded-2xl border transition-all duration-300 ease-soft ${
                open === i
                  ? 'bg-bg-card border-brand-yellow/70 shadow-brand-md'
                  : 'bg-bg-card/60 border-black/5 hover:border-brand-yellow/40 hover:bg-bg-card'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5 font-sans font-semibold text-base text-ink transition-colors"
              >
                <span>{item.q}</span>
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium
                              transition-all duration-300 ease-soft ${
                    open === i
                      ? 'bg-brand-yellow text-ink rotate-45'
                      : 'bg-brand-green/10 text-brand-green-dark'
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-[max-height] duration-300 ${
                  open === i ? 'max-h-[800px]' : 'max-h-0'
                }`}
              >
                <p className="px-5 sm:px-6 pb-5 text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Variante per le pagine prodotto, che tengono titolo e domande in `config/polizze`. */
export function FaqAccordionPolizza({ polizza }: { polizza: Polizza }) {
  if (!polizza.faq?.items?.length) return null;
  return <FaqAccordion items={polizza.faq.items} title={polizza.faq.title} />;
}
