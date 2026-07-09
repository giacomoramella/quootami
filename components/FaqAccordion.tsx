'use client';

import { useState } from 'react';
import type { Polizza } from '@/config/polizze';

export function FaqAccordion({ polizza }: { polizza: Polizza }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">Domande frequenti</span>
          <h2 className="section-title">{polizza.faq.title}</h2>
        </div>

        <div className="max-w-prose-wide mx-auto space-y-3">
          {polizza.faq.items.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 ease-soft ${
                open === i
                  ? 'bg-bg-card border-brand-yellow/70 shadow-brand-md'
                  : 'bg-bg-card/60 border-black/5 hover:border-brand-yellow/40 hover:bg-bg-card'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 font-sans font-semibold text-base text-ink transition-colors"
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
                <p className="px-6 pb-5 text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
