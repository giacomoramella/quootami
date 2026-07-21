/**
 * Glossario della previdenza complementare — pagina Fondo Pensione.
 *
 * Definizioni volutamente brevi e neutrali: spiegano i termini richiamati dalla
 * guida (PensioneSchemi) e dalle FAQ, senza aggiungere numeri che vivono già
 * altrove nella pagina. Componente statico (nessuno stato): resta un Server
 * Component, così non pesa sul bundle.
 *
 * Fonti (luglio 2026): D.Lgs 252/2005; COVIP, «La previdenza complementare».
 * TFR: art. 2120 c.c. (rivalutazione 1,5% + 75% dell'indice ISTAT).
 * I termini sono ordinati alfabeticamente per facilitarne la ricerca.
 */

/** Stesso teal della guida, per coerenza visiva. */
const TEAL = '#2A9D8F';

type Voce = { termine: string; definizione: string };

const VOCI: Voce[] = [
  {
    termine: 'Anticipazione',
    definizione:
      'Prelievo di una parte della posizione prima della pensione, per le causali previste dalla legge: spese sanitarie gravi, prima casa o altre esigenze.',
  },
  {
    termine: 'Coefficiente di trasformazione',
    definizione:
      'Il parametro che converte il capitale accumulato in rendita vitalizia. Dipende dall’età al pensionamento e dalle basi demografiche del fondo.',
  },
  {
    termine: 'Comparto',
    definizione:
      'La linea di investimento con cui il fondo gestisce i versamenti: garantito, obbligazionario, bilanciato o azionario. Si sceglie e si può cambiare nel tempo.',
  },
  {
    termine: 'COVIP',
    definizione:
      'La Commissione di Vigilanza sui Fondi Pensione: l’autorità pubblica che controlla la previdenza complementare e ne fissa le regole di trasparenza.',
  },
  {
    termine: 'Deducibilità',
    definizione:
      'La possibilità di sottrarre i contributi versati dal reddito imponibile IRPEF, fino a €5.300 l’anno. È il primo vantaggio fiscale del fondo pensione.',
  },
  {
    termine: 'Fondo aperto',
    definizione:
      'Forma pensionistica istituita da banche, SGR o assicurazioni, a cui può aderire chiunque — anche i lavoratori autonomi — a titolo individuale o collettivo.',
  },
  {
    termine: 'Fondo negoziale',
    definizione:
      'Detto anche «chiuso»: nasce dai contratti collettivi per una categoria di lavoratori (es. Cometa per i metalmeccanici). Senza scopo di lucro, con costi contenuti.',
  },
  {
    termine: 'ISC',
    definizione:
      'Indicatore Sintetico dei Costi: misura in percentuale quanto pesano i costi del fondo nel tempo. Più è basso, più rendimento resta all’iscritto.',
  },
  {
    termine: 'PIP',
    definizione:
      'Piano Individuale Pensionistico: forma pensionistica di tipo assicurativo, sottoscrivibile singolarmente. In genere ha costi più alti di fondi negoziali e aperti.',
  },
  {
    termine: 'Previdenza complementare',
    definizione:
      'Il «secondo pilastro»: la pensione integrativa e volontaria che si affianca a quella pubblica INPS, per avvicinarsi al reddito dell’ultimo periodo di lavoro.',
  },
  {
    termine: 'Rendita vitalizia',
    definizione:
      'L’erogazione periodica che il fondo paga per tutta la vita a partire dalla pensione. Di regola almeno metà della posizione va convertita in rendita.',
  },
  {
    termine: 'RITA',
    definizione:
      'Rendita Integrativa Temporanea Anticipata: eroga il capitale a rate negli anni che mancano alla pensione pubblica, con la tassazione agevolata dal 15% al 9%.',
  },
  {
    termine: 'Silenzio-assenso',
    definizione:
      'Il meccanismo per cui, in mancanza di una scelta esplicita, il TFR del lavoratore viene destinato al fondo pensione previsto dal proprio contratto.',
  },
  {
    termine: 'TFR',
    definizione:
      'Trattamento di Fine Rapporto: la «liquidazione» accantonata dal datore ogni anno. Si può lasciare in azienda o versare a un fondo pensione.',
  },
];

/**
 * `heading` a false quando la pagina fornisce già il proprio header (sottopagina
 * dedicata /piano-pensione/glossario), per non duplicare titolo ed eyebrow.
 */
export function PensioneGlossario({ heading = true }: { heading?: boolean }) {
  return (
    <section id="glossario" className="section bg-bg">
      <div className="container-content">
        {heading && (
          <div className="text-center mb-12">
            <span className="eyebrow">Glossario</span>
            <h2 className="section-title">
              Le parole della <span className="hl">previdenza.</span>
            </h2>
            <p className="section-sub mx-auto">
              Quattordici termini che tornano nella guida, spiegati in una riga.
            </p>
          </div>
        )}

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {VOCI.map((v) => (
            <div key={v.termine} className="rounded-2xl bg-bg-card border border-black/5 p-6">
              <dt className="flex items-baseline gap-2.5 font-sans font-bold text-base text-ink">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 translate-y-[-0.15rem]"
                  style={{ backgroundColor: TEAL }}
                  aria-hidden
                />
                {v.termine}
              </dt>
              <dd className="mt-2 text-sm text-ink-muted leading-relaxed">{v.definizione}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
