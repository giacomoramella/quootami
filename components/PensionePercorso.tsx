import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';

/**
 * Sezione "Il percorso" della home previdenza — ispirata a latuapensione.it.
 * Prima il mini-schema "in 30 secondi" (come funziona un fondo pensione), poi
 * le 4 tappe del percorso Quootami. La quarta tappa (firma online) punta alla
 * pagina di adesione FEA, passata come prop dalla pagina.
 *
 * Numeri = fatti di legge (deducibilità, tassazione), nessuna stima di risparmio.
 */

const SCHEMA = [
  { titolo: 'Aderisci', desc: 'Tramite il CCNL (col contributo del datore) o da solo.' },
  { titolo: 'Versi', desc: 'Deduci fino a €5.300 l’anno dal reddito IRPEF.' },
  { titolo: 'Il fondo investe', desc: 'Rendimenti tassati al 20% invece del 26%.' },
  { titolo: 'Ritiri', desc: 'Alla pensione l’imposta scende dal 15% al 9%.' },
];

export function PensionePercorso({ adesioneUrl }: { adesioneUrl?: string }) {
  return (
    <section id="percorso" className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">Il percorso</span>
          <h2 className="section-title">
            Dalla prima domanda alla <span className="hl">scelta giusta.</span>
          </h2>
          <p className="section-sub mx-auto">
            Prima come funziona un fondo pensione, in trenta secondi. Poi le quattro tappe del
            percorso con Quootami.
          </p>
        </div>

        {/* ── Mini-schema "30 secondi" ── */}
        <div className="rounded-3xl bg-bg-card border border-black/5 p-6 sm:p-8">
          <h3 className="font-sans font-bold text-base text-ink text-center sm:text-left">
            Come funziona, in 30 secondi
          </h3>
          <ol className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none">
            {SCHEMA.map((s, i) => (
              <li key={s.titolo} className="relative rounded-2xl bg-bg-alt p-5">
                <span className="font-mono text-xs font-bold text-brand-green-dark">
                  0{i + 1}
                </span>
                <p className="mt-2 font-sans font-bold text-sm text-ink">{s.titolo}</p>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-center sm:text-left">
            <Link
              href="/piano-pensione/schema"
              className="text-sm font-bold text-brand-green-dark hover:text-brand-navy transition-colors"
            >
              Vedi lo schema completo →
            </Link>
          </p>
        </div>

        {/* ── 4 tappe ── */}
        <ol className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none">
          <TappaCard n={1} tempo="5 min" titolo="Capisci le basi" desc="La guida ai fondi pensione, con i vantaggi fiscali spiegati semplice." cta="Leggi" href="/piano-pensione/guida" />
          <TappaCard n={2} tempo="1 min" titolo="Calcola il vantaggio" desc="Età, reddito e versamento: il risultato in euro sul tuo caso, subito." cta="Calcola" href="#calcolatore" />
          <TappaCard n={3} tempo="una persona" titolo="Parla con Quootami" desc="Nessun call center: una persona vera riceve il tuo caso e ti risponde." cta="Scrivi" href={OPERATORE.social.whatsapp} esterno />
          <TappaCard n={4} tempo="5 min" titolo="Firma online" desc={adesioneUrl ? 'Adesione digitale con firma elettronica a norma eIDAS. Niente stampe.' : 'Adesione assistita: Quootami prepara la modulistica e ti segue.'} cta={adesioneUrl ? 'Firma' : 'Iscriviti'} href={adesioneUrl ?? '#contatti'} />
        </ol>

        <p className="mt-6 text-center text-xs text-ink-muted">
          I tuoi dati passano da una tappa all&apos;altra: non li ripeti mai.
        </p>
      </div>
    </section>
  );
}

function TappaCard({ n, tempo, titolo, desc, cta, href, esterno }: {
  n: number; tempo: string; titolo: string; desc: string; cta: string; href: string; esterno?: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center font-sans font-bold text-sm text-ink">
          {n}
        </span>
        <span className="text-xs text-ink-muted">{tempo}</span>
      </div>
      <p className="mt-4 font-sans font-bold text-base text-ink">{titolo}</p>
      <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark group-hover:gap-1.5 transition-all">
        {cta} <span aria-hidden>→</span>
      </span>
    </>
  );

  const cls =
    'group flex flex-col rounded-2xl bg-bg-card border border-black/5 p-6 hover:-translate-y-1 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft';

  return (
    <li>
      {esterno ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
      ) : (
        <Link href={href} className={cls}>{inner}</Link>
      )}
    </li>
  );
}
