import type { Polizza } from '@/config/polizze';

export function ProcessSteps({ polizza }: { polizza: Polizza }) {
  return (
    <section className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-14">
          <span className="eyebrow">Come funziona</span>
          <h2 className="section-title">{polizza.process.title}</h2>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 list-none">
          {polizza.process.steps.map((step, i) => (
            <li key={step.title} className="text-center">
              <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-brand-yellow flex items-center justify-center font-sans font-bold text-xl text-ink">
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
