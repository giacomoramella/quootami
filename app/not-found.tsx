import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-content text-center py-20">
        <span className="eyebrow">Errore 404</span>
        <h1 className="font-sans font-bold text-5xl sm:text-7xl text-ink mt-4 leading-tight">
          Pagina <span className="hl">non trovata.</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-muted mt-6 max-w-prose-wide mx-auto">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Torna alla home →
          </Link>
          <Link href="/contatti" className="btn-secondary">
            Contatti Quootami
          </Link>
        </div>
      </div>
    </section>
  );
}
