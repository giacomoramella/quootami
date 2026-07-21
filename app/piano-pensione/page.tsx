import type { Metadata } from 'next';
import { PensioneHero } from '@/components/PensioneHero';
import { PensionePercorso } from '@/components/PensionePercorso';
import { PensioneEsigenze } from '@/components/PensioneEsigenze';
import { PensioneServizi } from '@/components/PensioneServizi';
import { CalcolatoreFondoPensione } from '@/components/CalcolatoreFondoPensione';
import { PensioneDati } from '@/components/PensioneDati';
import { PensioneCovip } from '@/components/PensioneCovip';
import { PensioneConfronto } from '@/components/PensioneConfronto';
import { PensioneRichiestaForm } from '@/components/PensioneRichiestaForm';
import { FaqAccordion } from '@/components/FaqAccordion';
import { OPERATORE } from '@/config/operatore';
import { getPolizza } from '@/config/polizze';

const polizza = getPolizza('piano-pensione')!;

export const metadata: Metadata = {
  title: polizza.metaTitle,
  description: polizza.metaDesc,
  openGraph: {
    title: polizza.metaTitle,
    description: polizza.metaDesc,
    images: [{ url: '/og-image.png', alt: polizza.ogImageAlt, width: 1200, height: 630 }],
  },
};

/**
 * Home dell'area previdenza — mini-sito ispirato a latuapensione.it, adattato a
 * Quootami (broker IVASS). Ordine delle sezioni fedele al riferimento; contenuti
 * conformi: niente consulente AI (non esiste ancora), niente risparmi promessi.
 * La guida e il glossario sono ora sottopagine (/guida, /glossario, /schema).
 */
export default function PianoPensionePage() {
  return (
    <>
      <PensioneHero />
      <PensionePercorso />
      <PensioneEsigenze />
      <PensioneServizi />
      <CalcolatoreFondoPensione />
      <PensioneDati />
      <PensioneCovip />
      <PensioneConfronto />
      <FaqAccordion polizza={polizza} />
      <CtaFinale />
    </>
  );
}

/* ── CTA finale: form di richiesta stima previdenziale ── */
function CtaFinale() {
  return (
    <section id="richiesta" className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-10">
          <span className="eyebrow">Richiedi una stima</span>
          <h2 className="section-title">
            La tua pensione, <span className="hl">sul tuo profilo.</span>
          </h2>
          <p className="section-sub mx-auto">
            Lascia i tuoi dati: Quootami elabora una stima previdenziale personalizzata e ti
            ricontatta una persona vera. Nessun costo, nessun impegno.
          </p>
        </div>

        <PensioneRichiestaForm />

        <p className="mt-8 text-center text-sm text-ink-muted">
          Preferisci parlarne subito?{' '}
          <a
            href={OPERATORE.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-green-dark underline underline-offset-2 hover:text-ink"
          >
            Scrivi su WhatsApp
          </a>{' '}
          oppure{' '}
          <a
            href={`mailto:${OPERATORE.contatti.email}?subject=${encodeURIComponent('Richiesta informazioni Fondo Pensione')}`}
            className="font-semibold text-brand-green-dark underline underline-offset-2 hover:text-ink"
          >
            invia una email
          </a>.
        </p>
      </div>
    </section>
  );
}
