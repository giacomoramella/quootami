import type { Polizza } from '@/config/polizze';

export function ProcessSteps({ polizza }: { polizza: Polizza }) {
  return (
    <section className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-14">
          <span className="eyebrow">Come funziona</span>
          <h2 className="section-title">{polizza.process.title}</h2>
        </div>

        <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 list-none">
          {/* Linea tratteggiata che collega gli step (solo desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-7 left-[13%] right-[13%] border-t-2 border-dashed border-ink/15"
          />
          {polizza.process.steps.map((step, i) => (
            <li key={step.title} className="relative text-center group">
              <div className="relative mx-auto mb-5 w-14 h-14 rounded-full bg-brand-yellow shadow-glow-yellow flex items-center justify-center font-sans font-bold text-xl text-ink group-hover:scale-110 transition-transform duration-300 ease-soft">
                {i + 1}
              </div>
              <h3 className="font-sans font-bold text-base text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
