import type { Metadata } from 'next';
import Link from 'next/link';
import { PensioneHero } from '@/components/PensioneHero';
import { PensionePercorso } from '@/components/PensionePercorso';
import { PensioneEsigenze } from '@/components/PensioneEsigenze';
import { PensioneServizi } from '@/components/PensioneServizi';
import { CalcolatoreFondoPensione } from '@/components/CalcolatoreFondoPensione';
import { PensioneDati } from '@/components/PensioneDati';
import { PensioneConfronto } from '@/components/PensioneConfronto';
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
      <PensionePercorso adesioneUrl={polizza.adesioneUrl} />
      <PensioneEsigenze />
      <PensioneServizi />
      <CalcolatoreFondoPensione />
      <PensioneDati />
      <PensioneConfronto />
      <FaqAccordion polizza={polizza} />
      <CtaFinale adesioneUrl={polizza.adesioneUrl} />
    </>
  );
}

/* ── CTA finale: calcolo + persona vera + firma online ── */
function CtaFinale({ adesioneUrl }: { adesioneUrl?: string }) {
  return (
    <section id="contatti" className="section bg-bg-alt">
      <div className="container-content text-center">
        <span className="eyebrow">Inizia ora</span>
        <h2 className="section-title">
          Scopri se ti <span className="hl">conviene.</span>
        </h2>
        <p className="section-sub mx-auto">
          Calcola il vantaggio in un minuto, poi ne parli con una persona vera. Nessun costo,
          nessun impegno.
        </p>

        {adesioneUrl && (
          <div className="mt-10 mx-auto max-w-lg p-[2px] rounded-3xl bg-gradient-to-br from-brand-yellow via-brand-yellow to-brand-green shadow-glow-yellow">
            <div className="rounded-[calc(1.5rem-2px)] bg-bg-card p-6">
              <p className="text-sm font-bold uppercase tracking-wide text-ink mb-2">
                Adesione online in 5 minuti
              </p>
              <p className="text-sm text-ink-muted mb-4">
                Modulo digitale e firma elettronica a norma eIDAS. Nessuna stampa, nessuna scansione.
              </p>
              <a href={adesioneUrl} className="btn-primary inline-block">
                Compila adesione e firma online →
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#calcolatore" className={adesioneUrl ? 'btn-secondary' : 'btn-primary'}>
            Calcola il tuo risparmio →
          </Link>
          <a
            href={OPERATORE.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Scrivi su WhatsApp
          </a>
          <a
            href={`mailto:${OPERATORE.contatti.email}?subject=${encodeURIComponent('Richiesta informazioni Fondo Pensione')}`}
            className="btn-secondary"
          >
            Invia email
          </a>
        </div>

        <p className="mt-8 text-xs text-ink-muted">
          Connessione cifrata &middot; Nessun costo &middot; Broker iscritto IVASS
        </p>
      </div>
    </section>
  );
}
