import type { Polizza } from '@/config/polizze';

const COLOR_MAP = {
  navy: 'border-t-[#264653]',
  red: 'border-t-[#E76F51]',
  amber: 'border-t-[#E9B440]',
  violet: 'border-t-[#8E5BB5]',
  blue: 'border-t-[#4A9EBA]',
  teal: 'border-t-[#2A9D8F]',
  green: 'border-t-[#5B8B3F]',
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
              className={`relative bg-bg-card border border-black/5 rounded-3xl p-7 border-t-4 ${COLOR_MAP[item.color]} hover:-translate-y-1 hover:shadow-brand-md transition-all duration-200 ease-soft`}
            >
              {item.required && (
                <span className="inline-block mb-3 px-3 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy text-[0.65rem] font-bold tracking-widest uppercase">
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
