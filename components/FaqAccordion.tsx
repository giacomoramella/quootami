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

        <div className="max-w-prose-wide mx-auto">
          {polizza.faq.items.map((item, i) => (
            <div key={i} className="border-b border-black/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between text-left py-5 font-sans font-semibold text-base text-ink hover:text-brand-green-dark transition-colors"
              >
                <span>{item.q}</span>
                <span
                  className={`flex-shrink-0 text-brand-green-dark text-sm transition-transform duration-200 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`overflow-hidden transition-[max-height] duration-300 ${
                  open === i ? 'max-h-[800px]' : 'max-h-0'
                }`}
              >
                <p className="pb-5 text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
