'use client';

import Link from 'next/link';
import { useState } from 'react';
import { OPERATORE } from '@/config/operatore';

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-3 sm:top-4 left-0 right-0 z-40 px-3 sm:px-6"
      role="navigation"
      aria-label="Navigazione principale"
    >
      <div className="container-content glass rounded-full flex items-center justify-between px-5 sm:px-7 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="font-sans font-bold text-xl text-ink tracking-tight inline-flex items-baseline"
          aria-label={`${OPERATORE.brand.name} home`}
        >
          <span>{OPERATORE.brand.name}</span>
          <span className="ml-1 w-2 h-2 rounded-full bg-brand-yellow translate-y-[-0.05em]" />
        </Link>

        {/* Menu desktop */}
        <ul className="hidden md:flex items-center gap-7 list-none">
          <li>
            <Link href="/polizze" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Polizze
            </Link>
          </li>
          <li>
            <Link href="/piano-pensione" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Pensione
            </Link>
          </li>
          <li>
            <Link href="/luce" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Luce e Gas
            </Link>
          </li>
          <li>
            <Link href="/guide" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Guide
            </Link>
          </li>
          <li>
            <Link href="/chi-siamo" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Chi siamo
            </Link>
          </li>
          <li>
            <Link
              href="/contatti"
              className="text-sm font-bold text-ink bg-brand-yellow px-5 py-2 rounded-full shadow-glow-yellow hover:bg-brand-navy hover:text-white transition-all duration-200"
            >
              Parla con Quootami →
            </Link>
          </li>
        </ul>

        {/* Toggle mobile */}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Apri/chiudi menu"
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg border border-black/10"
        >
          <span className={`w-5 h-0.5 bg-ink transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-ink transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden container-content bg-white border border-black/5 shadow-brand-lg rounded-3xl mt-2 px-6 py-6 flex flex-col gap-4"
        >
          <Link href="/polizze" onClick={() => setOpen(false)} className="text-base text-ink py-2">Polizze</Link>
          <Link href="/piano-pensione" onClick={() => setOpen(false)} className="text-base text-ink py-2">Fondo Pensione</Link>
          <Link href="/luce" onClick={() => setOpen(false)} className="text-base text-ink py-2">Luce e Gas</Link>
          <Link href="/guide" onClick={() => setOpen(false)} className="text-base text-ink py-2">Guide</Link>
          <Link href="/chi-siamo" onClick={() => setOpen(false)} className="text-base text-ink py-2">Chi siamo</Link>
          <Link
            href="/contatti"
            onClick={() => setOpen(false)}
            className="btn-primary w-full mt-2 justify-center"
          >
            Parla con Quootami →
          </Link>
        </div>
      )}
    </nav>
  );
}
