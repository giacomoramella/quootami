import type { ReactNode } from 'react';

export function LegalPage({
  eyebrow,
  title,
  titleAccent,
  intro,
  lastUpdate,
  children,
}: {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  lastUpdate: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="container-content text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-semibold tracking-wider uppercase text-brand-green-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green-dark" />
            {eyebrow}
          </span>
          <h1 className="mt-8 font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink">
            {title} <span className="hl">{titleAccent}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">{intro}</p>
          <p className="mt-4 inline-block text-xs text-ink-muted bg-bg-card border border-black/5 px-3 py-1 rounded-full">
            Ultimo aggiornamento: <strong className="text-ink">{lastUpdate}</strong>
          </p>
        </div>
      </section>

      <article className="px-5 sm:px-8 pb-24">
        <div className="max-w-prose-wide mx-auto prose-quootami">
          {children}
        </div>
      </article>
    </>
  );
}
