'use client';

/**
 * Guida a moduli — struttura condivisa fra le pagine (Fondo Pensione, Luce e Gas).
 *
 * Cinque o più moduli selezionabili: si clicca la scheda e il contenuto si apre
 * sotto, senza cambiare pagina. Pattern ARIA tablist/tab/tabpanel: frecce,
 * Home/End, aria-selected.
 *
 * Qui vivono anche i mattoncini condivisi dai contenuti (Tabella, Blocco,
 * SogliaTile...): servono a entrambe le guide e devono restare identici.
 */

import { useRef, useState } from 'react';

/** Coppia validata CVD-safe su sfondo chiaro. Il testo usa sempre i token ink. */
export const TEAL = '#2A9D8F';
export const CORAL = '#E76F51';

export type ModuloGuida = {
  id: string;
  titolo: string;
  sottotitolo: string;
  desc: string;
  lettura: string;
  contenuto: React.ReactNode;
};

export function GuidaModuli({ id, eyebrow, titolo, accent, sottotitolo, moduli, sfondo = 'alt' }: {
  id: string;
  eyebrow: string;
  titolo: string;
  accent: string;
  sottotitolo: string;
  moduli: ModuloGuida[];
  sfondo?: 'alt' | 'base';
}) {
  const [attivo, setAttivo] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Frecce, Home e End sulla lista dei moduli (pattern ARIA tablist). */
  function onKeyDown(e: React.KeyboardEvent) {
    const ultimo = moduli.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = attivo === ultimo ? 0 : attivo + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = attivo === 0 ? ultimo : attivo - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = ultimo;
    if (next === null) return;
    e.preventDefault();
    setAttivo(next);
    tabRefs.current[next]?.focus();
  }

  const m = moduli[attivo];
  const colonne = moduli.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  return (
    <section id={id} className={`section ${sfondo === 'alt' ? 'bg-bg-alt' : 'bg-bg'}`}>
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title">
            {titolo} <span className="hl">{accent}</span>
          </h2>
          <p className="section-sub mx-auto">{sottotitolo}</p>
        </div>

        {/* ── Selettore moduli ── */}
        <div
          role="tablist"
          aria-label={`Moduli: ${eyebrow}`}
          onKeyDown={onKeyDown}
          className={`grid grid-cols-1 sm:grid-cols-2 ${colonne} gap-3`}
        >
          {moduli.map((mod, i) => {
            const on = i === attivo;
            return (
              <button
                key={mod.id}
                ref={el => { tabRefs.current[i] = el; }}
                role="tab"
                id={`tab-${mod.id}`}
                aria-selected={on}
                aria-controls={`pannello-${mod.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setAttivo(i)}
                className={`group text-left rounded-2xl p-5 border transition-all duration-300 ease-soft
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2
                            ${on
                              ? 'bg-bg-card border-transparent shadow-brand-md -translate-y-1'
                              : 'bg-bg-card/50 border-black/5 hover:bg-bg-card hover:-translate-y-0.5'}`}
                style={on ? { borderColor: TEAL } : undefined}
              >
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-sans font-bold text-xs tabular-nums transition-colors duration-300"
                  style={on
                    ? { backgroundColor: TEAL, color: '#fff' }
                    : { backgroundColor: `${TEAL}1A`, color: TEAL }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="block mt-3 font-sans font-bold text-sm text-ink leading-snug">
                  {mod.titolo}
                </span>
                <span className="block mt-0.5 text-xs text-ink-muted">{mod.sottotitolo}</span>
              </button>
            );
          })}
        </div>

        {/* ── Pannello del modulo ── */}
        <div
          key={m.id}
          role="tabpanel"
          id={`pannello-${m.id}`}
          aria-labelledby={`tab-${m.id}`}
          tabIndex={0}
          className="mt-5 rounded-3xl bg-bg-card border border-black/5 p-7 sm:p-10 animate-fade-up focus-visible:outline-none"
        >
          <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-black/5">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: TEAL }}>
              Modulo {attivo + 1} di {moduli.length}
            </span>
            <span className="w-1 h-1 rounded-full bg-ink/20" aria-hidden />
            <span className="text-xs text-ink-muted">Lettura: {m.lettura}</span>
          </div>

          <h3 className="mt-6 font-sans font-bold text-2xl sm:text-3xl text-ink tracking-tight">
            {m.titolo}
          </h3>
          <p className="mt-2 text-sm sm:text-base text-ink-muted leading-relaxed max-w-prose-wide">
            {m.desc}
          </p>

          <div className="mt-8">{m.contenuto}</div>

          <div className="mt-10 pt-6 border-t border-black/5 flex items-center justify-between gap-4">
            <NavModulo
              verso="prec"
              modulo={attivo > 0 ? moduli[attivo - 1] : null}
              onClick={() => setAttivo(attivo - 1)}
            />
            <NavModulo
              verso="succ"
              modulo={attivo < moduli.length - 1 ? moduli[attivo + 1] : null}
              onClick={() => setAttivo(attivo + 1)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function NavModulo({ verso, modulo, onClick }: {
  verso: 'prec' | 'succ'; modulo: ModuloGuida | null; onClick: () => void;
}) {
  if (!modulo) return <span aria-hidden />;
  const succ = verso === 'succ';
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col ${succ ? 'items-end text-right ml-auto' : 'items-start text-left'}
                  rounded-xl px-3 py-2 -mx-3 hover:bg-bg-alt transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow`}
    >
      <span className="text-xs text-ink-muted">{succ ? 'Modulo successivo' : 'Modulo precedente'}</span>
      <span className="mt-0.5 font-sans font-bold text-sm text-ink inline-flex items-center gap-1.5">
        {!succ && <span className="transition-transform group-hover:-translate-x-1" aria-hidden>←</span>}
        {modulo.titolo}
        {succ && <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>}
      </span>
    </button>
  );
}

/* ══════════ Mattoncini condivisi dai contenuti ══════════ */

export function Blocco({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl bg-bg-alt p-6 sm:p-7">
      <h4 className="font-sans font-bold text-base text-ink">{titolo}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function Nota({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 text-xs text-ink-muted leading-relaxed">{children}</p>;
}

/**
 * Tabella responsive. `highlight` è l'indice della colonna da evidenziare;
 * -1 per nessuna. `primo` toglie il margine se apre il modulo.
 */
export function Tabella({ title, note, head, rows, highlight, primo }: {
  title: string; note: string; head: string[]; rows: React.ReactNode[][]; highlight: number; primo?: boolean;
}) {
  return (
    <div className={`${primo ? '' : 'mt-6'} rounded-2xl bg-bg-alt p-6 sm:p-7`}>
      <h4 className="font-sans font-bold text-base text-ink">{title}</h4>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[520px]">
          <thead>
            <tr>
              {head.map((h, i) => (
                <th
                  key={h || i}
                  scope="col"
                  className={`text-left font-sans font-bold text-xs uppercase tracking-wider pb-3 px-3 border-b-2 border-black/10
                              ${i === highlight ? 'text-ink' : 'text-ink-muted'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`py-3.5 px-3 border-b border-black/5 align-top leading-relaxed
                                ${i === 0 ? 'font-semibold text-ink' : ''}
                                ${i === highlight ? 'font-semibold text-ink bg-brand-yellow/15' : 'text-ink-soft'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Nota>{note}</Nota>
    </div>
  );
}

export function RigaDato({ label, valore }: { label: string; valore: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 pb-3 border-b border-black/5 last:border-0">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="text-sm font-bold text-ink whitespace-nowrap">{valore}</span>
    </li>
  );
}

export function SogliaTile({ valore, label }: { valore: string; label: string }) {
  return (
    <div className="rounded-2xl bg-bg-alt p-5 text-center">
      <p className="font-sans font-bold text-2xl text-ink tabular-nums">{valore}</p>
      <p className="mt-2 text-xs text-ink-muted leading-relaxed">{label}</p>
    </div>
  );
}

export function PassoCard({ n, title, desc, tono }: { n: number; title: string; desc: string; tono?: 'alert' }) {
  const colore = tono === 'alert' ? CORAL : TEAL;
  return (
    <li className="rounded-2xl bg-bg-alt p-5">
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-sm text-white"
        style={{ backgroundColor: colore }}
        aria-hidden
      >
        {n}
      </span>
      <p className="mt-3 font-sans font-bold text-sm text-ink">{title}</p>
      <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{desc}</p>
    </li>
  );
}

/** Card di una novità normativa: verde se già in vigore, corallo se in arrivo. */
export function NovitaCard({ stato, statoLabel, title, desc }: {
  stato: 'in-vigore' | 'in-arrivo'; statoLabel: string; title: string; desc: string;
}) {
  const attiva = stato === 'in-vigore';
  return (
    <div className="rounded-2xl bg-bg-alt p-6">
      <span
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
        style={{
          backgroundColor: attiva ? `${TEAL}1A` : `${CORAL}1A`,
          color: attiva ? TEAL : CORAL,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: attiva ? TEAL : CORAL }}
          aria-hidden
        />
        {statoLabel}
      </span>
      <h4 className="mt-4 font-sans font-bold text-base text-ink">{title}</h4>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{desc}</p>
    </div>
  );
}

/** Elenco puntato con pallini colorati, dentro una card chiara. */
export function ElencoCard({ titolo, voci }: { titolo: string; voci: string[] }) {
  return (
    <div className="rounded-2xl bg-bg-card p-5">
      <p className="font-sans font-bold text-sm text-ink">{titolo}</p>
      <ul className="mt-3 space-y-2 list-none">
        {voci.map(v => (
          <li key={v} className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: TEAL }}
              aria-hidden
            />
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}
