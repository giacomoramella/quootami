/**
 * Sezione "Perché scegliere Quootami" della home previdenza — ispirata alla
 * tabella "architettura aperta" di latuapensione.it, adattata all'identità di
 * Quootami: broker indipendente, non vende prodotti propri.
 *
 * Nessun claim numerico: solo il posizionamento (confronto tra tipi di operatore),
 * vero e verificabile.
 */

type Stato = 'si' | 'no' | 'parziale';

const COLONNE = ['Quootami', 'Banche e assicurazioni', 'Siti comparatori'] as const;

const RIGHE: { caratteristica: string; valori: [Stato, Stato, Stato] }[] = [
  { caratteristica: 'Calcolo personalizzato del vantaggio', valori: ['si', 'parziale', 'parziale'] },
  { caratteristica: 'Confronto indipendente tra più fondi', valori: ['si', 'no', 'si'] },
  { caratteristica: 'Nessun prodotto proprio da vendere', valori: ['si', 'no', 'parziale'] },
  { caratteristica: 'Una persona vera che ti segue', valori: ['si', 'parziale', 'no'] },
  { caratteristica: 'Assistenza fino alla firma', valori: ['si', 'parziale', 'no'] },
];

export function PensioneConfronto() {
  return (
    <section className="section bg-bg">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">Perché Quootami</span>
          <h2 className="section-title">
            Confronto <span className="hl">indipendente</span>, interesse tuo
          </h2>
          <p className="section-sub mx-auto">
            Quootami non vende prodotti propri: confronta i fondi sul mercato e consiglia quello
            adatto al tuo caso, anche quando la risposta è &laquo;non ti conviene&raquo;.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-4 sm:p-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[560px]">
            <thead>
              <tr>
                <th scope="col" className="text-left font-sans font-bold text-xs uppercase tracking-wider text-ink-muted pb-4 px-3">
                  Caratteristica
                </th>
                {COLONNE.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`text-center font-sans font-bold text-xs uppercase tracking-wider pb-4 px-3
                                ${i === 0 ? 'text-ink' : 'text-ink-muted'}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RIGHE.map((r) => (
                <tr key={r.caratteristica}>
                  <td className="py-4 px-3 border-t border-black/5 align-middle font-semibold text-ink leading-relaxed">
                    {r.caratteristica}
                  </td>
                  {r.valori.map((v, i) => (
                    <td
                      key={i}
                      className={`py-4 px-3 border-t border-black/5 text-center ${i === 0 ? 'bg-brand-yellow/10' : ''}`}
                    >
                      <Segno stato={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted max-w-prose-wide mx-auto leading-relaxed">
          Quootami può ricevere una commissione dal fornitore solo se attivi un contratto: il
          confronto e la consulenza restano gratuiti per te.
        </p>
      </div>
    </section>
  );
}

function Segno({ stato }: { stato: Stato }) {
  if (stato === 'si') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-green/15" title="Disponibile">
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden fill="none" stroke="#15793F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8.5l3.5 3.5L13 4" />
        </svg>
        <span className="sr-only">Disponibile</span>
      </span>
    );
  }
  if (stato === 'parziale') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ink/5" title="Parziale">
        <span className="w-2.5 h-0.5 rounded-full bg-ink-muted" aria-hidden />
        <span className="sr-only">Parziale</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ink/5" title="Non disponibile">
      <svg viewBox="0 0 16 16" className="w-3 h-3" aria-hidden fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
      <span className="sr-only">Non disponibile</span>
    </span>
  );
}
