import Link from 'next/link';
import type { Polizza } from '@/config/polizze';

export function ProductHero({ polizza }: { polizza: Polizza }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8">
      <div
        aria-hidden
        className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]"
      />
      <div
        aria-hidden
        className="blob-green bottom-[-120px] right-[-140px] w-[520px] h-[520px]"
        style={{ animationDelay: '-4s' }}
      />

      <div className="container-content text-center relative">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-semibold tracking-wider uppercase text-brand-green-dark animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green-dark" />
          {polizza.hero.eyebrow}
        </span>

        <h1 className="mt-8 font-sans font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-ink animate-fade-up">
          {polizza.hero.h1Lead}{' '}
          <span className="hl">{polizza.hero.h1Accent}</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {polizza.hero.sub}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Link href="#preventivo" className="btn-primary">
            Richiedi un preventivo →
          </Link>
          <Link href="#coperture" className="btn-secondary">
            Scopri le coperture
          </Link>
        </div>

        <p className="mt-8 text-xs sm:text-sm text-ink-muted animate-fade-up" style={{ animationDelay: '0.4s' }}>
          Nessun costo &middot; Risposta entro 24h lavorative &middot; Broker iscritto IVASS
        </p>
      </div>
    </section>
  );
}
