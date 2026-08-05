import type { Approfondimento as ApprofondimentoType, Polizza } from '@/config/polizze';

/**
 * Sezione redazionale, resa come fisarmonica sotto le FAQ.
 *
 * Perché a fisarmonica: il testo serve a rispondere alle domande che l'utente
 * si fa prima di chiedere un preventivo e a dare alla pagina il contenuto
 * indicizzabile che una griglia di card non fornisce, ma da aperto occupava
 * mezza pagina e spingeva in basso tutto il resto.
 *
 * Usa `<details>` nativo, non uno stato React: nessun JavaScript, nessun peso
 * aggiunto al bundle e — cosa che conta qui — il testo è SEMPRE presente
 * nell'HTML servito anche a pannelli chiusi, quindi resta interamente
 * indicizzabile.
 */
export function Approfondimento({ dati }: { dati: ApprofondimentoType }) {
  const i = dati.title.indexOf(dati.accent);

  return (
    <section className="section pt-0">
      <div className="container-content">
        <div className="text-center mb-10">
          <span className="eyebrow">{dati.eyebrow}</span>
          <h2 className="section-title">
            {i === -1 ? (
              dati.title
            ) : (
              <>
                {dati.title.slice(0, i)}
                <span className="hl">{dati.accent}</span>
                {dati.title.slice(i + dati.accent.length)}
              </>
            )}
          </h2>
          <p className="section-sub mx-auto">{dati.intro}</p>
        </div>

        <div className="max-w-prose-wide mx-auto space-y-3">
          {dati.blocchi.map(b => (
            <details
              key={b.h3}
              className="group rounded-2xl border border-black/5 bg-bg-card/60 transition-colors duration-300 ease-soft open:bg-bg-card open:border-brand-yellow/70 open:shadow-brand-md hover:border-brand-yellow/40"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-sans font-semibold text-base text-ink list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans font-semibold text-base text-ink m-0">{b.h3}</h3>
                <span
                  aria-hidden
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium bg-brand-green/10 text-brand-green-dark transition-all duration-300 ease-soft group-open:bg-brand-yellow group-open:text-ink group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 space-y-3">
                {b.p.map((testo, n) => (
                  <p key={n} className="text-sm text-ink-muted leading-relaxed">
                    {testo}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>

        {dati.fonti && (
          <p className="max-w-prose-wide mx-auto mt-6 text-xs text-ink-muted leading-relaxed">
            <strong>Fonti:</strong> {dati.fonti}
          </p>
        )}
      </div>
    </section>
  );
}

/** Variante per le pagine prodotto: legge l'approfondimento da config/polizze.ts. */
export function ProductApprofondimento({ polizza }: { polizza: Polizza }) {
  if (!polizza.approfondimento) return null;
  return <Approfondimento dati={polizza.approfondimento} />;
}
