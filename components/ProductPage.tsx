import Link from 'next/link';
import { ProductHero } from './ProductHero';
import { CoverageGrid } from './CoverageGrid';
import { ProcessSteps } from './ProcessSteps';
import { FaqAccordion } from './FaqAccordion';
import { OPERATORE } from '@/config/operatore';
import type { Polizza } from '@/config/polizze';

/**
 * Template universale per ogni pagina prodotto.
 *
 * NOTA: il form preventivo è temporaneamente sostituito da una
 *       sezione contatti. Per riattivarlo, importa LeadForm e
 *       sostituisci il blocco <PreventivoContatti />.
 */
export function ProductPage({ polizza }: { polizza: Polizza }) {
  return (
    <>
      <ProductHero polizza={polizza} />
      <CoverageGrid polizza={polizza} />
      <ProcessSteps polizza={polizza} />
      <PreventivoContatti polizza={polizza} />
      <FaqAccordion polizza={polizza} />
    </>
  );
}

/* ── Sezione contatti (sostituisce temporaneamente il form) ── */
function PreventivoContatti({ polizza }: { polizza: Polizza }) {
  return (
    <section id="preventivo" className="section bg-bg">
      <div className="container-content text-center">
        <span className="eyebrow">Richiedi un preventivo</span>
        <h2 className="section-title">
          Parla con <span className="hl">Quootami.</span>
        </h2>
        <p className="section-sub mx-auto">
          Scrivi su WhatsApp, manda una email o chiama: Quootami ti contatta entro 24h con
          le migliori offerte delle compagnie partner per <strong>{polizza.title.toLowerCase()}</strong>.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={OPERATORE.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Scrivi su WhatsApp →
          </a>
          <a
            href={`mailto:${OPERATORE.contatti.email}?subject=${encodeURIComponent(`Richiesta preventivo ${polizza.title}`)}`}
            className="btn-secondary"
          >
            Invia email
          </a>
          <a
            href={`tel:${OPERATORE.contatti.telefono_tel}`}
            className="btn-secondary"
          >
            Chiama Quootami
          </a>
        </div>

        <p className="mt-6 text-xs text-ink-muted">
          🔒 Connessione cifrata · Nessun costo · Nessun obbligo
        </p>
      </div>
    </section>
  );
}
