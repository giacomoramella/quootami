'use client';

import { useState } from 'react';

/**
 * Calcolatore del risparmio fiscale del fondo pensione.
 *
 * Ipotesi dichiarate (mostrate anche all'utente):
 * - Scaglioni IRPEF 2025: 23% fino a €28.000, 35% fino a €50.000, 43% oltre.
 *   Escluse addizionali regionali/comunali → il risparmio reale è
 *   leggermente superiore alla stima.
 * - Deduzione massima: €5.300/anno.
 * - Rendimento lordo stimato 4%/anno, tassato al 20% → 3,2% netto.
 * - Pensione a 67 anni.
 * - Tassazione finale sui contributi dedotti: 15%, ridotta dello 0,30%
 *   per ogni anno di partecipazione oltre il 15°, minimo 9%.
 *
 * È una stima indicativa, non una consulenza: serve a dare l'ordine di
 * grandezza prima del calcolo personalizzato fatto da Quootami.
 */

const DEDUZIONE_MAX = 5300;
const ETA_PENSIONE = 67;
const RENDIMENTO_NETTO = 0.032; // 4% lordo − 20% tassazione annua

/** IRPEF lorda sugli scaglioni 2025 (senza detrazioni/addizionali). */
function irpef(reddito: number): number {
  const r = Math.max(0, reddito);
  let tax = Math.min(r, 28_000) * 0.23;
  if (r > 28_000) tax += (Math.min(r, 50_000) - 28_000) * 0.35;
  if (r > 50_000) tax += (r - 50_000) * 0.43;
  return tax;
}

/** Aliquota di tassazione finale sul montante dedotto: 15% → 9%. */
function aliquotaFinale(anniPartecipazione: number): number {
  return Math.max(9, 15 - 0.3 * Math.max(0, anniPartecipazione - 15));
}

function eur(n: number): string {
  // useGrouping 'always': l'it-IT di default non separa le migliaia sotto
  // 10.000 ("5300"), ma il sito scrive ovunque "€5.300".
  return n.toLocaleString('it-IT', {
    maximumFractionDigits: 0,
    useGrouping: 'always' as Intl.NumberFormatOptions['useGrouping'],
  });
}

export function CalcolatoreFondoPensione() {
  const [eta, setEta] = useState(35);
  const [reddito, setReddito] = useState(32_000);
  const [contributo, setContributo] = useState(3_000);
  const [modo, setModo] = useState<'annuale' | 'singolo'>('annuale');

  const anni = Math.max(1, ETA_PENSIONE - eta);
  const versamento = Math.min(contributo, DEDUZIONE_MAX);

  // Risparmio IRPEF annuo = differenza d'imposta con e senza deduzione.
  const risparmioAnnuo = irpef(reddito) - irpef(reddito - versamento);
  const risparmioTotale = risparmioAnnuo * anni;

  // Montante: rendita di versamenti annui capitalizzati al 3,2% netto.
  const montante =
    versamento * ((Math.pow(1 + RENDIMENTO_NETTO, anni) - 1) / RENDIMENTO_NETTO);
  const contributiTotali = versamento * anni;
  const aliqUscita = aliquotaFinale(anni);
  const imposteUscita = contributiTotali * (aliqUscita / 100);
  const montanteNetto = montante - imposteUscita;

  /* ── Confronto a 3 scenari (patrimonio netto finale) ──
     Modello trasparente, tutte le ipotesi dichiarate sotto il grafico:
     rendimento lordo 4%; nel fondo i rendimenti scontano il 20% annuo,
     la prestazione il 9–15% sui contributi dedotti, e il risparmio IRPEF
     resta all'iscritto; nel fai-da-te in ETF nessuna deduzione, costo
     0,3% e plusvalenze al 26% all'uscita. */
  const versato = modo === 'annuale' ? versamento * anni : versamento;
  const risparmioIrpef = modo === 'annuale' ? risparmioAnnuo * anni : risparmioAnnuo;
  const capitalizza = (rNet: number) =>
    modo === 'annuale'
      ? versamento * ((Math.pow(1 + rNet, anni) - 1) / rNet)
      : versamento * Math.pow(1 + rNet, anni);
  const nettoFondo = (isc: number) => {
    const m = capitalizza(Math.max(0.0005, RENDIMENTO_NETTO - isc));
    return m - versato * (aliqUscita / 100) + risparmioIrpef;
  };
  const mEtf = capitalizza(0.04 - 0.003); // 4% lordo − 0,3% di costo
  const nettoEtf = mEtf - Math.max(0, mEtf - versato) * 0.26; // plusvalenze 26%
  const scenari = [
    { label: 'Fai-da-te in ETF', valore: nettoEtf, tono: 'neutro' as const },
    { label: 'Fondo pensione (ISC 1%)', valore: nettoFondo(0.01), tono: 'buono' as const },
    {
      label: 'Fondo pensione (ISC 2%)',
      valore: nettoFondo(0.02),
      tono: (nettoFondo(0.02) >= nettoEtf ? 'buono' : 'alert') as 'buono' | 'alert',
    },
  ];
  const maxScenario = Math.max(...scenari.map((s) => s.valore), 1);

  return (
    <section id="calcolatore" className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center">
          <span className="eyebrow">Calcolatore</span>
          <h2 className="section-title">
            Quanto <span className="hl">risparmi</span> con il fondo pensione?
          </h2>
          <p className="section-sub mx-auto">
            Stima immediata del vantaggio fiscale in base a età, reddito e
            versamento annuo. Il calcolo personalizzato completo lo fa Quootami.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* ── Input ── */}
          <div className="p-6 rounded-2xl bg-bg-card border border-ink/10 shadow-sm">
            <Slider
              label="Età"
              value={eta}
              min={18}
              max={66}
              step={1}
              format={(v) => `${v} anni`}
              onChange={setEta}
            />
            <Slider
              label="Reddito annuo lordo"
              value={reddito}
              min={10_000}
              max={100_000}
              step={1_000}
              format={(v) => `€ ${eur(v)}`}
              onChange={setReddito}
            />
            <Slider
              label="Versamento annuo"
              value={contributo}
              min={500}
              max={DEDUZIONE_MAX}
              step={100}
              format={(v) => `€ ${eur(v)}`}
              onChange={setContributo}
            />
            <p className="mt-4 text-xs text-ink-muted">
              Il versamento è deducibile fino a €{eur(DEDUZIONE_MAX)}/anno.
            </p>
          </div>

          {/* ── Risultati ── */}
          <div className="p-6 rounded-2xl bg-brand-navy text-white shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-yellow">
                Risparmio IRPEF stimato
              </p>
              <p className="mt-1 text-4xl font-bold">
                € {eur(risparmioAnnuo)}<span className="text-lg font-medium text-white/70">/anno</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                € {eur(risparmioTotale)} cumulati in {anni} anni di versamenti
              </p>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <Riga
                label={`Montante stimato a ${ETA_PENSIONE} anni`}
                value={`€ ${eur(montante)}`}
              />
              <Riga
                label={`Tassazione finale (${aliqUscita.toLocaleString('it-IT', { maximumFractionDigits: 1 })}% dopo ${anni} anni)`}
                value={`− € ${eur(imposteUscita)}`}
              />
              <div className="pt-3 border-t border-white/20">
                <Riga label="Capitale netto stimato" value={`€ ${eur(montanteNetto)}`} bold />
              </div>
            </dl>
          </div>
        </div>

        {/* ── Confronto netto finale a 3 scenari ── */}
        <div className="mt-6 max-w-4xl mx-auto rounded-2xl bg-bg-card border border-ink/10 p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-sans font-bold text-lg text-ink">Confronto netto finale</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Patrimonio stimato a {ETA_PENSIONE} anni, al netto di costi e tasse.
              </p>
            </div>
            <div className="inline-flex rounded-full bg-bg-alt p-1 self-start" role="group" aria-label="Tipo di versamento">
              {([['annuale', 'Ogni anno'], ['singolo', 'Una volta']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setModo(val)}
                  aria-pressed={modo === val}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    modo === val ? 'bg-brand-yellow text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {scenari.map((s) => (
              <ScenarioBar key={s.label} label={s.label} valore={s.valore} max={maxScenario} tono={s.tono} />
            ))}
          </div>

          <p className="mt-5 text-xs text-ink-muted leading-relaxed">
            {modo === 'annuale'
              ? `Ipotesi: ${eur(versamento)} € versati ogni anno per ${anni} anni.`
              : `Ipotesi: ${eur(versamento)} € versati una volta sola, oggi.`}{' '}
            Rendimento lordo 4%/anno. Nel fondo i rendimenti scontano il 20% annuo, la prestazione dal
            15% al 9% sui contributi dedotti, e il risparmio IRPEF resta all&apos;iscritto. Nel
            fai-da-te in ETF nessuna deduzione, costo 0,3% e plusvalenze al 26% all&apos;uscita.
          </p>
        </div>

        <p className="mt-6 max-w-4xl mx-auto text-xs text-ink-muted text-center leading-relaxed">
          Stima indicativa, non costituisce consulenza finanziaria o fiscale.
          Ipotesi: scaglioni IRPEF 2025 (escluse addizionali regionali e comunali:
          il risparmio reale è leggermente superiore), rendimento lordo 4%/anno
          tassato al 20%, pensione a {ETA_PENSIONE} anni, tassazione finale dal 15% al 9%
          sui contributi dedotti. Il risultato reale dipende dal fondo scelto, dai
          suoi costi (ISC) e dall'andamento dei mercati.
        </p>
      </div>
    </section>
  );
}

/* ── Sotto-componenti ── */

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold text-ink">{label}</label>
        <span className="text-sm font-bold text-brand-green-dark tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-green cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}

/** Barra orizzontale di uno scenario di confronto. Colore per tono. */
function ScenarioBar({ label, valore, max, tono }: {
  label: string; valore: number; max: number; tono: 'neutro' | 'buono' | 'alert';
}) {
  const colore = tono === 'buono' ? '#1F9D55' : tono === 'alert' ? '#E76F51' : '#9CA3AF';
  const pct = Math.max(3, (valore / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-sm font-bold text-ink tabular-nums whitespace-nowrap">€ {eur(valore)}</span>
      </div>
      <div className="h-3.5 rounded-full bg-bg-alt overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-soft"
          style={{ width: `${pct}%`, backgroundColor: colore }}
        />
      </div>
    </div>
  );
}

function Riga({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={bold ? 'font-semibold text-white' : 'text-white/70'}>{label}</dt>
      <dd className={`tabular-nums whitespace-nowrap ${bold ? 'text-xl font-bold text-brand-yellow' : 'font-semibold'}`}>
        {value}
      </dd>
    </div>
  );
}
