import { ProductHero } from './ProductHero';
import { CoverageGrid } from './CoverageGrid';
import { ProcessSteps } from './ProcessSteps';
import { FaqAccordion } from './FaqAccordion';
import { PreventivoForm } from './PreventivoForm';
import { GuideCorrelate } from './GuideCorrelate';
import { ProductApprofondimento } from './ProductApprofondimento';
import { JsonLdFaq, JsonLdBreadcrumbProdotto } from './JsonLd';
import type { Polizza } from '@/config/polizze';

/**
 * Template universale per ogni pagina prodotto.
 * La sezione `id="preventivo"` è il form preventivo rapido specifico del prodotto
 * (campi da config/preventivo.ts) — archivia su Supabase e notifica il broker.
 */
export function ProductPage({
  polizza,
  extra,
}: {
  polizza: Polizza;
  /** Sezione opzionale specifica del prodotto (es. calcolatore pensione). */
  extra?: React.ReactNode;
}) {
  return (
    <>
      <JsonLdFaq polizza={polizza} />
      <JsonLdBreadcrumbProdotto polizza={polizza} />
      <ProductHero polizza={polizza} />
      <CoverageGrid polizza={polizza} />
      <ProductApprofondimento polizza={polizza} />
      {extra}
      <ProcessSteps polizza={polizza} />
      <PreventivoForm polizza={polizza} />
      <FaqAccordion polizza={polizza} />
      <GuideCorrelate slug={polizza.slug} />
    </>
  );
}
