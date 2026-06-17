'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log a server-side error reporter (es. Sentry) — placeholder
    console.error('[Quootami app error]', error);
  }, [error]);

  return (
    <section className="section">
      <div className="container-content text-center py-20">
        <span className="eyebrow">Errore 500</span>
        <h1 className="font-sans font-bold text-5xl sm:text-7xl text-ink mt-4 leading-tight">
          Qualcosa è <span className="hl">andato storto.</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-muted mt-6 max-w-prose-wide mx-auto">
          Si è verificato un errore imprevisto. Prova a ricaricare la pagina oppure contatta Quootami.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => reset()} className="btn-primary">
            Riprova
          </button>
          <Link href="/" className="btn-secondary">
            Torna alla home
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-ink-muted/60 mt-8 font-mono">Codice errore: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
