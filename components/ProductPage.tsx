import { ProductHero } from './ProductHero';
import { CoverageGrid } from './CoverageGrid';
import { ProcessSteps } from './ProcessSteps';
import { FaqAccordion } from './FaqAccordion';
import type { Polizza } from '@/config/polizze';

/**
 * Template universale per ogni pagina prodotto.
 * Le 7 pagine /polizza-auto, /polizza-casa, ecc. usano questo
 * componente passando la Polizza da `config/polizze.ts`.
 */
export function ProductPage({ polizza }: { polizza: Polizza }) {
  return (
    <>
      <ProductHero polizza={polizza} />
      <CoverageGrid polizza={polizza} />
      <ProcessSteps polizza={polizza} />
      <FaqAccordion polizza={polizza} />
    </>
  );
}
