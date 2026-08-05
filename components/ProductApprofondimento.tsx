import type { Polizza } from '@/config/polizze';

/**
 * Sezione redazionale della pagina prodotto (campo `approfondimento` in
 * config/polizze.ts). Serve a due cose insieme: dare all'utente le risposte
 * che cerca prima di chiedere un preventivo, e dare alla pagina il contenuto
 * indicizzabile che una griglia di card non può fornire.
 *
 * Non viene resa se il prodotto non ha ancora un approfondimento.
 */
export function ProductApprofondimento({ polizza }: { polizza: Polizza }) {
  const a = polizza.approfondimento;
  if (!a) return null;

  const i = a.title.indexOf(a.accent);

  return (
    <section className="section">
      <div className="container-content">
        <div className="text-center">
          <span className="eyebrow">{a.eyebrow}</span>
          <h2 className="section-title">
            {i === -1 ? (
              a.title
            ) : (
              <>
                {a.title.slice(0, i)}
                <span className="hl">{a.accent}</span>
                {a.title.slice(i + a.accent.length)}
              </>
            )}
          </h2>
          <p className="section-sub mx-auto">{a.intro}</p>
        </div>

        <div className="mt-12 max-w-prose-wide mx-auto prose-quootami">
          {a.blocchi.map(b => (
            <div key={b.h3}>
              <h3>{b.h3}</h3>
              {b.p.map((testo, n) => (
                <p key={n}>{testo}</p>
              ))}
            </div>
          ))}

          {a.fonti && (
            <p className="text-sm text-ink-muted border-t border-black/10 pt-5 mt-8">
              <strong>Fonti:</strong> {a.fonti}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
