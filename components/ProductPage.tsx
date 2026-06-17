import { ProductHero } from './ProductHero';
import { CoverageGrid } from './CoverageGrid';
import { ProcessSteps } from './ProcessSteps';
import { FaqAccordion } from './FaqAccordion';
import { LeadForm } from './LeadForm';
import type { Polizza } from '@/config/polizze';

/**
 * Template universale per ogni pagina prodotto.
 */
export function ProductPage({ polizza }: { polizza: Polizza }) {
  // Solo polizza-auto richiede targa + libretto
  const requiresVehicle = polizza.slug === 'polizza-auto';

  return (
    <>
      <ProductHero polizza={polizza} />
      <CoverageGrid polizza={polizza} />
      <ProcessSteps polizza={polizza} />

      {/* ── Sezione PREVENTIVO con form lead universale ── */}
      <section id="preventivo" className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="eyebrow">Preventivo gratuito</span>
            <h2 className="section-title">
              Richiedi il tuo<br />
              <span className="hl">preventivo personalizzato.</span>
            </h2>
            <p className="section-sub mx-auto">
              Compila i dati: Quootami ti contatta entro 24h con le migliori offerte delle compagnie partner.
            </p>
          </div>

          <LeadForm prodotto={polizza.slug} requiresVehicle={requiresVehicle} />
        </div>
      </section>

      <FaqAccordion polizza={polizza} />
    </>
  );
}
