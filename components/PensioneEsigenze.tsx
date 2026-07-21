import Link from 'next/link';

/**
 * Sezione "A quali esigenze rispondiamo" della home previdenza — ispirata a
 * latuapensione.it. Quattro domande tipiche, con il problema e la risposta di
 * Quootami. Nessun numero promesso: la risposta rimanda al calcolo o al confronto.
 */

const ESIGENZE = [
  {
    domanda: 'Mi conviene fare un fondo pensione?',
    problema: 'Non sai se vale la pena vincolare i tuoi soldi fino alla pensione.',
    risposta: 'Calcolo personalizzato del vantaggio fiscale, con il risultato in euro sul tuo caso.',
  },
  {
    domanda: 'Quale fondo mi conviene?',
    problema: 'Troppa scelta tra negoziali, aperti e PIP: la paura di sbagliare.',
    risposta: 'Confronto indipendente dei costi e delle caratteristiche, senza vendere un prodotto nostro.',
  },
  {
    domanda: 'Ho già un fondo, mi conviene cambiare?',
    problema: 'Hai un piano che forse costa troppo, ma non sai se ti conviene spostarti.',
    risposta: 'Confronto del tuo fondo con le alternative, in chiaro, costi alla mano.',
  },
  {
    domanda: 'Come faccio a cambiare o iscrivermi?',
    problema: 'Burocrazia, moduli, il timore di sbagliare il passaggio.',
    risposta: 'Assistenza passo dopo passo fino alla firma, con una persona vera come referente.',
  },
];

export function PensioneEsigenze() {
  return (
    <section className="section bg-bg">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">Le tue domande</span>
          <h2 className="section-title">
            A quali <span className="hl">esigenze</span> rispondiamo
          </h2>
          <p className="section-sub mx-auto">
            Numeri concreti e assistenza in tutto il percorso, non teoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {ESIGENZE.map((e) => (
            <div key={e.domanda} className="rounded-2xl bg-bg-card border border-black/5 p-6 sm:p-7">
              <h3 className="font-sans font-bold text-lg text-ink leading-snug">
                &ldquo;{e.domanda}&rdquo;
              </h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{e.problema}</p>
              <div className="mt-4 pt-4 border-t border-black/5 flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" aria-hidden />
                <p className="text-sm text-ink-soft leading-relaxed">{e.risposta}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center">
          <Link href="#calcolatore" className="btn-primary">
            Inizia dal calcolo →
          </Link>
        </p>
      </div>
    </section>
  );
}
