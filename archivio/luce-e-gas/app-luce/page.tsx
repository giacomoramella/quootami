import type { Metadata } from 'next';
import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';

/**
 * Comparatore luce e gas — SOSPESO TEMPORANEAMENTE (03/09/2026).
 *
 * La pagina resta raggiungibile e risponde 200 di proposito: restituire 404
 * farebbe deindicizzare l'URL da Google e romperebbe i link già in giro. Con
 * `noindex` la pagina esce dai risultati di ricerca ma l'URL resta valido, così
 * la riattivazione è una sola operazione e non ricomincia da zero il
 * posizionamento.
 *
 * Per riattivare il comparatore:
 *   git checkout fbcc43f -- app/luce/page.tsx
 * e ripristinare le voci rimosse in Nav.tsx, app/page.tsx, app/polizze/page.tsx
 * e app/sitemap.ts (vedi il commit che ha introdotto questa sospensione).
 */

const META_TITLE = 'Luce e Gas · Servizio in aggiornamento';
const META_DESC =
  'Il comparatore luce e gas di Quootami è temporaneamente sospeso per un aggiornamento del catalogo offerte.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  // Fuori dai risultati di ricerca finché il servizio è sospeso, ma i link
  // interni restano seguibili: non si disperde l'autorevolezza già acquisita.
  robots: { index: false, follow: true },
};

export default function LucePage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-5 sm:px-8">
      <div
        aria-hidden
        className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]"
      />
      <div className="container-content text-center relative">
        <span className="eyebrow">Luce e Gas</span>
        <h1 className="font-sans font-bold text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink mt-4">
          Servizio <span className="hl">in aggiornamento.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">
          Il confronto delle offerte di luce e gas è temporaneamente sospeso per un aggiornamento
          del catalogo. Tornerà disponibile appena il lavoro è concluso.
        </p>
        <p className="mt-4 text-sm text-ink-muted max-w-prose-wide mx-auto">
          Nel frattempo, per una consulenza su energia o su una copertura assicurativa, i canali
          di contatto restano attivi.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={OPERATORE.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Scrivi su WhatsApp →
          </a>
          <Link href="/contatti" className="btn-secondary">
            Altri contatti
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 max-w-xl mx-auto">
          <p className="text-sm text-ink-muted">Le altre aree di Quootami sono attive:</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/polizze" className="btn-secondary">
              Polizze assicurative
            </Link>
            <Link href="/piano-pensione" className="btn-secondary">
              Fondo pensione
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
