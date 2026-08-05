import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';

/**
 * Hero della home previdenza — struttura ispirata a latuapensione.it, adattata
 * a Quootami (broker IVASS, non consulente AI).
 *
 * A sinistra: titolo, tre punti, CTA. A destra: uno SLOT interattivo isolato
 * (<HeroSlot>). Oggi lo slot mostra un'anteprima del calcolatore + il
 * posizionamento "una persona vera". DOMANI, quando l'utente aggiungerà un vero
 * consulente AI, si sostituisce SOLO il contenuto di <HeroSlot> — nessuna
 * risposta finta va messa qui finché l'AI non è reale, e in quel caso andrà
 * aggiornata la CSP (connect-src) con l'endpoint dell'AI.
 *
 * I numeri sono fatti di legge (deducibilità, tassazione), non stime di
 * risparmio: quelle le dà solo il calcolatore, con ipotesi dichiarate.
 */

const STAT = [
  { valore: '€5.300', label: 'deducibili ogni anno' },
  { valore: '20%', label: 'tassazione rendimenti' },
  { valore: '9–15%', label: "all'uscita, non 23–43%" },
  { valore: 'Una persona', label: 'vera, non un call center' },
];

export function PensioneHero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pb-20 px-5 sm:px-8">
      <div aria-hidden className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]" />
      <div
        aria-hidden
        className="blob-green bottom-[-140px] right-[-160px] w-[520px] h-[520px]"
        style={{ animationDelay: '-4s' }}
      />

      <div className="container-content relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        {/* ── Colonna testo ── */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-semibold tracking-wider uppercase text-brand-green-dark animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green-dark" />
            Fondo pensione
          </span>

          <h1 className="mt-6 font-sans font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-ink animate-rise">
            Il fondo pensione ti conviene?{' '}
            <span className="hl">Te lo diciamo in euro.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            Calcolo personalizzato del vantaggio fiscale, confronto indipendente tra i fondi e una
            persona vera che ti segue fino all&apos;iscrizione. Nessun costo per te.
          </p>

          <ul className="mt-7 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start list-none animate-fade-up" style={{ animationDelay: '0.25s' }}>
            {['Calcolo su reddito ed età', 'Confronto neutrale dei costi', 'Assistenza fino alla firma'].map((v) => (
              <li key={v} className="inline-flex items-center gap-2 text-sm text-ink-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" aria-hidden />
                {v}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <Link href="#calcolatore" className="btn-primary">
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
          </div>
        </div>

        {/* ── Slot interattivo (oggi calcolatore/persona vera, domani AI) ── */}
        <HeroSlot />
      </div>

      {/* ── Stat tile ── */}
      <div className="container-content relative mt-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STAT.map((s) => (
            <div key={s.label} className="rounded-2xl bg-bg-card border border-black/5 p-5 text-center">
              <p className="font-sans font-bold text-2xl sm:text-3xl text-ink tabular-nums">{s.valore}</p>
              <div className="w-7 h-1 rounded-full bg-brand-yellow mx-auto mt-2" />
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * SLOT dell'hero — punto di estensione per il futuro consulente AI.
 * Contenuto attuale: invito al calcolatore + "una persona vera".
 * Sostituire QUI il contenuto quando l'AI sarà reale.
 */
function HeroSlot() {
  return (
    <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="rounded-3xl bg-bg-card border border-black/5 shadow-brand-lg p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
          </span>
          <div>
            <p className="font-sans font-bold text-sm text-ink leading-tight">Quootami</p>
            <p className="text-xs text-ink-muted">Consulente · risponde entro 24h</p>
          </div>
        </div>

        <p className="mt-5 text-base text-ink-soft leading-relaxed">
          «Ho 35 anni e guadagno €35.000. Mi conviene il fondo pensione?»
        </p>
        <div className="mt-4 rounded-2xl bg-bg-alt p-5">
          <p className="text-sm text-ink-muted leading-relaxed">
            La risposta dipende dalla tua aliquota IRPEF, dai costi del fondo e da quanti anni
            mancano alla pensione. Il calcolatore qui sotto ti dà il numero sul tuo caso.
          </p>
          <Link
            href="#calcolatore"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark hover:text-brand-navy transition-colors"
          >
            Fai il calcolo →
          </Link>
        </div>

        <p className="mt-5 text-xs text-ink-muted leading-relaxed">
          Poi ne parli con una persona vera: nessun call center, lo stesso referente del resto di
          Quootami.
        </p>
      </div>
    </div>
  );
}
