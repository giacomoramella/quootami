'use client';

/**
 * Sub-navigazione dell'area previdenza (home + sottopagine).
 * Montata da app/piano-pensione/layout.tsx, quindi appare su tutte le pagine
 * pensione. Stato attivo via usePathname(). Non sticky per non collidere con la
 * Nav flottante (che è fixed, z-40): questa barra sta sotto, in flusso.
 *
 * Il padding-top qui serve a superare la Nav flottante: le hero delle pagine
 * pensione partono con poco padding perché lo spazio lo dà questa barra.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const VOCI = [
  { href: '/piano-pensione', label: 'Panoramica' },
  { href: '/piano-pensione/guida', label: 'Guida' },
  { href: '/piano-pensione/schema', label: 'Schema' },
  { href: '/piano-pensione/glossario', label: 'Glossario' },
];

export function PensioneSubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sezioni previdenza"
      className="pt-24 sm:pt-28 pb-1 px-4 sm:px-8"
    >
      {/* Su mobile le voci vanno a capo: con `nowrap` il CTA "Calcola" finiva
          fuori dallo schermo dietro uno scroll orizzontale che nessuno scopre. */}
      <div className="container-content flex flex-wrap md:flex-nowrap items-center gap-2 md:overflow-x-auto md:no-scrollbar">
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-ink-muted mr-2 flex-shrink-0">
          Previdenza
        </span>
        <ul className="flex flex-wrap md:flex-nowrap items-center gap-1.5 list-none md:flex-shrink-0">
          {VOCI.map((v) => {
            const attiva = pathname === v.href;
            return (
              <li key={v.href}>
                <Link
                  href={v.href}
                  aria-current={attiva ? 'page' : undefined}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200
                              ${attiva
                                ? 'bg-brand-yellow text-ink shadow-glow-yellow'
                                : 'text-ink-muted hover:text-ink hover:bg-bg-alt'}`}
                >
                  {v.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/piano-pensione#calcolatore"
          className="md:ml-auto flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold text-ink border border-ink/15 hover:border-brand-yellow hover:bg-brand-yellow/10 transition-colors duration-200 whitespace-nowrap"
        >
          Calcola →
        </Link>
      </div>
    </nav>
  );
}
