import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparatoreLuce } from '@/components/ComparatoreLuce';
import { LuceGuida } from '@/components/LuceGuida';
import { OPERATORE } from '@/config/operatore';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

const META_TITLE = 'Luce e Gas · Confronta le tariffe con i dati ARERA';
const META_DESC =
  'Confronto gratuito delle offerte luce e gas del mercato libero con i dati ufficiali del Portale Offerte ARERA. Carica la bolletta: i dati si compilano da soli.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    images: [
      {
        url: '/og-image.png',
        alt: 'Quootami — confronto offerte luce e gas con i dati ARERA',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function LucePage() {
  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Luce e Gas', href: '/luce' }]} />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8">
        <div aria-hidden className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]" />
        <div
          aria-hidden
          className="blob-green bottom-[-140px] right-[-140px] w-[520px] h-[520px]"
          style={{ animationDelay: '-4s' }}
        />

        <div className="container-content text-center relative">
          <span className="eyebrow animate-fade-in">Luce e Gas</span>
          <h1 className="mt-4 font-sans font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-ink animate-rise">
            Bollette più leggere, <span className="hl">senza pensieri.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Quootami confronta le offerte reali del mercato libero — quelle che i fornitori
            pubblicano per legge sul Portale Offerte ARERA — e ti accompagna fino al cambio.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="#confronta" className="btn-primary">
              Confronta gratis →
            </a>
            <a href="#come-funziona" className="btn-secondary">
              Come funziona
            </a>
          </div>
          <p className="mt-8 text-xs sm:text-sm text-ink-muted animate-fade-up" style={{ animationDelay: '0.4s' }}>
            Nessun costo &middot; Dati ufficiali ARERA &middot; Nessun impegno
          </p>
        </div>
      </section>

      {/* ─── COMPARATORE ─── */}
      <ComparatoreLuce />

      {/* ─── COME FUNZIONA ─── */}
      <section id="come-funziona" className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-14">
            <span className="eyebrow">Come funziona</span>
            <h2 className="section-title">
              Quattro passaggi, <span className="hl">zero pratiche.</span>
            </h2>
          </div>
          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 list-none">
            <div
              aria-hidden
              className="hidden lg:block absolute top-7 left-[13%] right-[13%] border-t-2 border-dashed border-ink/15"
            />
            {[
              { title: 'Carica o inserisci i dati', desc: 'Foto della bolletta o due numeri a mano: bastano un paio di minuti.' },
              { title: 'Quootami confronta', desc: 'Le offerte realmente disponibili, dai dati pubblici ufficiali ARERA.' },
              { title: 'Ricevi la proposta', desc: 'Dopo la conferma email, la soluzione migliore spiegata con chiarezza.' },
              { title: 'Cambio senza pensieri', desc: 'Le pratiche del passaggio le segue Quootami. Nessuna interruzione di fornitura.' },
            ].map((step, i) => (
              <li key={step.title} className="relative text-center group">
                <div className="relative mx-auto mb-5 w-14 h-14 rounded-full bg-brand-yellow shadow-glow-yellow flex items-center justify-center font-sans font-bold text-xl text-ink group-hover:scale-110 transition-transform duration-300 ease-soft">
                  {i + 1}
                </div>
                <h3 className="font-sans font-bold text-base text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── GUIDA A MODULI ─── */}
      <LuceGuida />

      {/* ─── PERCHÉ QUOOTAMI ─── */}
      <section className="section bg-bg-alt">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { title: 'Fonte ufficiale', desc: 'Le offerte arrivano dal Portale Offerte ARERA, dove ogni fornitore è obbligato per legge a pubblicare le proprie tariffe.' },
              { title: 'Gratis per te', desc: 'Il confronto e la consulenza non costano nulla: Quootami può ricevere una commissione dal fornitore solo se attivi un contratto.' },
              { title: 'Una persona vera', desc: 'Niente call center: lo stesso referente del resto di Quootami ti segue anche sul cambio di fornitura.' },
            ].map((v) => (
              <article
                key={v.title}
                className="bg-bg-card border border-black/5 rounded-3xl p-7 hover:-translate-y-1.5 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft"
              >
                <h3 className="font-sans font-bold text-base text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINALE ─── */}
      <section className="section bg-bg">
        <div className="container-content text-center">
          <span className="eyebrow">Inizia ora</span>
          <h2 className="section-title">
            Due minuti per <span className="hl">saperlo.</span>
          </h2>
          <p className="section-sub mx-auto">
            Confronto gratuito e senza impegno. Per qualsiasi dubbio, Quootami risponde
            sui soliti canali.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#confronta" className="btn-primary">
              Confronta gratis →
            </a>
            <a
              href={OPERATORE.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Scrivi su WhatsApp
            </a>
          </div>
          <p className="mt-8 text-xs text-ink-muted">
            Le polizze restano il cuore di Quootami:{' '}
            <Link href="/" className="underline underline-offset-2 hover:text-ink">
              torna alle assicurazioni
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
