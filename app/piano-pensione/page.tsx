import type { Metadata } from 'next';
import { PensioneHero } from '@/components/PensioneHero';
import { PensionePercorso } from '@/components/PensionePercorso';
import { PensioneEsigenze } from '@/components/PensioneEsigenze';
import { PensioneServizi } from '@/components/PensioneServizi';
import { CalcolatoreFondoPensione } from '@/components/CalcolatoreFondoPensione';
import { PensioneDati } from '@/components/PensioneDati';
import { PensioneCovip } from '@/components/PensioneCovip';
import { PensioneConfronto } from '@/components/PensioneConfronto';
import { FaqAccordion } from '@/components/FaqAccordion';
import { GuideCorrelate } from '@/components/GuideCorrelate';
import { JsonLdFaq, JsonLdBreadcrumbProdotto } from '@/components/JsonLd';
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
      {/* Questa pagina non usa ProductPage, quindi FAQ e breadcrumb vanno montati qui */}
      <JsonLdFaq polizza={polizza} />
      <JsonLdBreadcrumbProdotto polizza={polizza} />
      <PensioneHero />
      <PensionePercorso />
      <PensioneEsigenze />
      <PensioneServizi />
      <CalcolatoreFondoPensione />
      <PensioneDati />
      <PensioneCovip />
      <PensioneConfronto />
      <FaqAccordion polizza={polizza} />
      <GuideCorrelate slug={polizza.slug} />
      <CtaFinale />
    </>
  );
}

/* ── CTA finale: richiesta stima previdenziale via contatto diretto ── */
function CtaFinale() {
  return (
    // id="preventivo": stesso ancoraggio delle altre pagine prodotto, così i
    // rimandi generici "/{slug}#preventivo" (es. la CTA in fondo alle guide)
    // atterrano nel punto giusto anche qui.
    <section id="preventivo" className="section bg-bg-alt">
      <div className="container-content text-center">
        <span className="eyebrow">Richiedi una stima</span>
        <h2 className="section-title">
          La tua pensione, <span className="hl">sul tuo profilo.</span>
        </h2>
        <p className="section-sub mx-auto">
          Scrivi su WhatsApp, manda una email o chiama: Quootami elabora una stima previdenziale
          personalizzata e ti ricontatta una persona vera. Nessun costo, nessun impegno.
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
            href={`mailto:${OPERATORE.contatti.email}?subject=${encodeURIComponent('Richiesta stima Fondo Pensione')}`}
            className="btn-secondary"
          >
            Invia una email
          </a>
          <a href={`tel:${OPERATORE.contatti.telefono_tel}`} className="btn-secondary">
            Chiama Quootami
          </a>
        </div>
      </div>
    </section>
  );
}
