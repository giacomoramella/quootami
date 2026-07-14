/**
 * Sezione dati/schemi della pagina Fondo Pensione.
 *
 * Dati: parametri di legge (deduzione, aliquote) + esempio numerico con
 * ipotesi dichiarate (40 anni, reddito €40.000, €5.000/anno per 27 anni,
 * rendimento lordo 4%): risparmio IRPEF €1.330/anno con aliquota media
 * 27%, tassazione all'uscita 11,4%, vantaggio +€719 con fondo ISC 1% e
 * svantaggio −€1.092 con fondo ISC 2%, entrambi rispetto al fai-da-te
 * in ETF. Range ISC per tipologia: fonte COVIP.
 *
 * Colori marchi grafici: teal #2A9D8F / corallo #E76F51 — coppia
 * validata CVD-safe (validate_palette: tutti i check PASS su sfondo
 * chiaro). Il testo usa sempre i token ink, mai il colore della serie.
 */

const TEAL = '#2A9D8F';
const CORAL = '#E76F51';
const GRIGIO = '#9CA3AF';

export function PensioneDati() {
  return (
    <section id="numeri" className="section bg-bg">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">I numeri</span>
          <h2 className="section-title">
            La previdenza, <span className="hl">in cifre.</span>
          </h2>
          <p className="section-sub mx-auto">
            I tre vantaggi fiscali in numeri, e il fattore che decide il risultato: il costo del fondo.
          </p>
        </div>

        {/* ── Stat tiles ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <StatTile value="€5.300" label="deducibili ogni anno dal reddito IRPEF" />
          <StatTile value="20%" label="tassazione dei rendimenti, contro il 26% degli altri investimenti" />
          <StatTile value="9–15%" label="tassazione finale all'uscita, contro il 23–43% IRPEF" />
        </div>

        {/* ── Grafico 1: costi ISC per tipologia ── */}
        <ChartCard
          title="Quanto costa un fondo pensione (ISC annuo)"
          note="Range indicativi dell'Indicatore Sintetico dei Costi per tipologia. Fonte: rilevazioni COVIP."
        >
          <RangeBar label="Fondi negoziali" from={0.2} to={0.8} max={3.5} unit="%" color={TEAL} />
          <RangeBar label="Fondi aperti" from={0.8} to={1.5} max={3.5} unit="%" color={TEAL} />
          <RangeBar label="PIP assicurativi" from={1.5} to={3.5} max={3.5} unit="%" color={TEAL} />
        </ChartCard>

        {/* ── Grafico 2: impatto del costo vs fai-da-te ── */}
        <ChartCard
          title="Il costo decide il risultato"
          note="Esempio: 40 anni, reddito €40.000, versamento €5.000/anno per 27 anni, rendimento lordo 4%.
                Con queste ipotesi il risparmio IRPEF è di €1.330/anno (aliquota media 27%) e la tassazione
                all'uscita dell'11,4%. Le barre mostrano il risultato finale rispetto al fai-da-te in ETF."
        >
          <DivergingBar label="Fondo con ISC 1%" value={719} max={1092} color={TEAL} />
          <DivergingBar label="Fai-da-te in ETF" value={0} max={1092} color={GRIGIO} />
          <DivergingBar label="Fondo con ISC 2%" value={-1092} max={1092} color={CORAL} />
        </ChartCard>

        {/* ── Grafico 3: tassazione all'uscita a confronto ── */}
        <ChartCard
          title="Tassazione del capitale all'uscita"
          note="Il fondo pensione applica un'aliquota agevolata sui contributi dedotti: 15%, che scende
                dello 0,30% per ogni anno oltre il 15° fino al 9%. Fuori dal fondo, gli stessi importi
                sconterebbero l'IRPEF ordinaria."
        >
          <RangeBar label="Fondo pensione" from={9} to={15} max={43} unit="%" color={TEAL} />
          <RangeBar label="IRPEF ordinaria" from={23} to={43} max={43} unit="%" color={GRIGIO} />
        </ChartCard>
      </div>
    </section>
  );
}

/* ── Componenti grafici (HTML/CSS puri, testo sempre in token ink) ── */

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl bg-bg-card border border-black/5 p-6 text-center">
      <p className="font-sans font-bold text-4xl text-ink tabular-nums">{value}</p>
      <div className="w-8 h-1 rounded-full bg-brand-yellow mx-auto mt-2" />
      <p className="mt-3 text-sm text-ink-muted leading-relaxed">{label}</p>
    </div>
  );
}

function ChartCard({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-7 sm:p-8">
      <h3 className="font-sans font-bold text-lg text-ink">{title}</h3>
      <div className="mt-6 space-y-5">{children}</div>
      <p className="mt-6 text-xs text-ink-muted leading-relaxed">{note}</p>
    </div>
  );
}

/** Barra a intervallo (da–a) su scala 0–max. */
function RangeBar({
  label, from, to, max, unit, color,
}: { label: string; from: number; to: number; max: number; unit: string; color: string }) {
  const fmt = (n: number) => n.toLocaleString('it-IT');
  return (
    <div title={`${label}: da ${fmt(from)}${unit} a ${fmt(to)}${unit}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-sm font-bold text-ink tabular-nums">{fmt(from)}–{fmt(to)}{unit}</span>
      </div>
      <div className="relative h-3 rounded-full bg-bg-alt">
        <div
          className="absolute top-0 h-3 rounded-full"
          style={{
            left: `${(from / max) * 100}%`,
            width: `${Math.max(((to - from) / max) * 100, 2)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

/** Barra divergente attorno allo zero (± max). */
function DivergingBar({
  label, value, max, color,
}: { label: string; value: number; max: number; color: string }) {
  const half = Math.abs(value) / max * 50;
  const testo = value === 0 ? 'riferimento' : `${value > 0 ? '+' : '−'}€ ${Math.abs(value).toLocaleString('it-IT')}`;
  return (
    <div title={`${label}: ${testo}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-sm font-bold text-ink tabular-nums">{testo}</span>
      </div>
      <div className="relative h-3 rounded-full bg-bg-alt">
        {/* linea dello zero */}
        <div className="absolute left-1/2 top-[-3px] h-[18px] w-px bg-ink/25" />
        {value !== 0 ? (
          <div
            className="absolute top-0 h-3"
            style={{
              left: value > 0 ? '50%' : `${50 - half}%`,
              width: `${half}%`,
              backgroundColor: color,
              borderRadius: value > 0 ? '0 9999px 9999px 0' : '9999px 0 0 9999px',
            }}
          />
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        )}
      </div>
    </div>
  );
}
