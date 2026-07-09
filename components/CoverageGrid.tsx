import type { Polizza } from '@/config/polizze';

/* Chip colorato per card: sfondo tenue + icona nel colore pieno.
   Classi letterali complete (richiesto dal JIT di Tailwind). */
const COLOR_MAP = {
  navy: 'bg-[#264653]/10 text-[#264653]',
  red: 'bg-[#E76F51]/10 text-[#E76F51]',
  amber: 'bg-[#E9B440]/15 text-[#B8860B]',
  violet: 'bg-[#8E5BB5]/10 text-[#8E5BB5]',
  blue: 'bg-[#4A9EBA]/10 text-[#3A7E95]',
  teal: 'bg-[#2A9D8F]/10 text-[#2A9D8F]',
  green: 'bg-[#5B8B3F]/10 text-[#4A7233]',
} as const;

export function CoverageGrid({ polizza }: { polizza: Polizza }) {
  return (
    <section id="coperture" className="section">
      <div className="container-content">
        <div className="text-center mb-14">
          <span className="eyebrow">Le coperture</span>
          <h2 className="section-title">{polizza.coverages.title}</h2>
          <p className="section-sub mx-auto">{polizza.coverages.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {polizza.coverages.items.map((item) => (
            <article
              key={item.title}
              className="group relative bg-bg-card border border-black/5 rounded-3xl p-7
                         hover:-translate-y-1.5 hover:border-brand-yellow/70 hover:shadow-brand-md
                         transition-all duration-300 ease-soft"
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4
                            group-hover:scale-110 transition-transform duration-300 ease-soft
                            ${COLOR_MAP[item.color]}`}
                aria-hidden
              >
                <CheckIcon />
              </div>
              {item.required && (
                <span className="inline-block mb-2 px-3 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy text-[0.65rem] font-bold tracking-widest uppercase">
                  Obbligatoria
                </span>
              )}
              <h3 className="font-sans font-bold text-base text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
