'use client';

/**
 * Guida a luce e gas — pagina Luce e Gas.
 * Struttura condivisa: vedi GuidaModuli.
 *
 * Taglio volutamente essenziale: pochi numeri e una frase per concetto.
 * I riferimenti normativi puntuali sono stati tolti dalla pagina per
 * leggibilità, ma i fatti restano quelli verificati alle fonti ARERA a
 * luglio 2026 — qui sotto la traccia, per chi dovrà aggiornarla.
 *
 * - Bolletta: quattro macro-voci; solo la spesa per la materia energia
 *   dipende dal fornitore (indicativamente circa metà del totale, varia
 *   con prezzi e consumi). Trasporto e gestione contatore, oneri di
 *   sistema e imposte sono regolati o fissati per legge, uguali per tutti.
 * - Switch OGGI (fino al 30/11/2026): il cambio avviene il primo giorno
 *   del mese, con richiesta entro il giorno 10 del mese precedente; in
 *   tutto da uno a due mesi. Fonte: ARERA, Atlante per il consumatore.
 * - Switch DAL 1° DICEMBRE 2026: delibera ARERA 58/2026/R/eel — 24 ore di
 *   un giorno lavorativo per i domestici non morosi, fino a 10 giorni
 *   lavorativi con morosità, comunque entro tre settimane. NON ancora in
 *   vigore: se la pagina viene letta dopo quella data, va aggiornata.
 * - Ripensamento: 14 giorni (contratti a distanza o fuori dai locali);
 *   30 giorni per le visite domiciliari non richieste.
 * - Fine maggior tutela per i NON vulnerabili: gas 1/1/2024, luce 1/7/2024.
 * - Servizio a Tutele Graduali: cessa per tutti il 31 marzo 2027.
 * - Vulnerabili (criteri ARERA, basta uno): 75 anni compiuti; bonus sociale
 *   per ISEE; bonus per gravi condizioni di salute con apparecchiature
 *   medico-terapeutiche; disabilità ex art. 3 L. 104/92; utenza in struttura
 *   abitativa di emergenza post-calamità; isola minore non interconnessa.
 */

import { GuidaModuli, TEAL, CORAL, SogliaTile, type ModuloGuida } from '@/components/GuidaModuli';

const MODULI: ModuloGuida[] = [
  {
    id: 'bolletta',
    titolo: 'La bolletta',
    sottotitolo: 'Cosa si paga',
    desc: 'Solo una voce su quattro dipende dal fornitore.',
    lettura: '1 min',
    contenuto: <ModuloBolletta />,
  },
  {
    id: 'fisso-variabile',
    titolo: 'Fisso o variabile',
    sottotitolo: 'Le due scelte',
    desc: 'Prezzo bloccato o prezzo che segue il mercato.',
    lettura: '1 min',
    contenuto: <ModuloFissoVariabile />,
  },
  {
    id: 'cambio',
    titolo: 'Cambiare fornitore',
    sottotitolo: 'Come funziona',
    desc: 'Gratis, senza interruzioni, con 14 giorni per ripensarci.',
    lettura: '1 min',
    contenuto: <ModuloCambio />,
  },
  {
    id: 'tutele',
    titolo: 'Le tutele',
    sottotitolo: 'Dopo la maggior tutela',
    desc: 'Cosa è cambiato e chi ha ancora un prezzo protetto.',
    lettura: '2 min',
    contenuto: <ModuloTutele />,
  },
];

export function LuceGuida() {
  return (
    <GuidaModuli
      id="guida"
      eyebrow="La guida"
      titolo="Capire la"
      accent="bolletta."
      sottotitolo="Quattro cose da sapere, in pochi minuti."
      moduli={MODULI}
      sfondo="base"
    />
  );
}

/* ══════════ Moduli ══════════ */

function ModuloBolletta() {
  return (
    <>
      <ul className="rounded-2xl bg-bg-alt px-6 sm:px-7 py-2 list-none">
        <Voce nome="Energia consumata" cambia />
        <Voce nome="Trasporto e contatore" />
        <Voce nome="Oneri di sistema" />
        <Voce nome="Imposte" />
      </ul>

      <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-prose-wide">
        L&apos;energia vale circa <strong className="text-ink">metà</strong>{' '}
        della bolletta. È l&apos;unica parte su cui si può risparmiare: il resto è uguale per tutti
        i fornitori.
      </p>
      <p className="mt-3 text-base text-ink-soft leading-relaxed max-w-prose-wide">
        Per questo la bolletta non si dimezza mai. Ma su quella metà le differenze sono reali, e tornano
        ogni mese.
      </p>
    </>
  );
}

function ModuloFissoVariabile() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SceltaCard
          titolo="Prezzo fisso"
          frase="Il prezzo dell'energia resta uguale per tutta la durata dell'offerta."
          pro="Se i prezzi salgono, la spesa non cambia."
          contro="Se scendono, non se ne approfitta."
        />
        <SceltaCard
          titolo="Prezzo variabile"
          frase="Il prezzo segue il mercato, mese per mese."
          pro="Se i prezzi scendono, la bolletta scende."
          contro="Se salgono, la bolletta sale."
        />
      </div>

      <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-prose-wide">
        Nessuna delle due è migliore. Il fisso serve a chi vuole una spesa prevedibile, il variabile a chi
        accetta gli alti e bassi per seguire il mercato.
      </p>
    </>
  );
}

function ModuloCambio() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SogliaTile valore="€0" label="il cambio è gratuito" />
        <SogliaTile valore="Nessuna" label="interruzione: non si resta mai senza luce o gas" />
        <SogliaTile valore="14 giorni" label="di tempo per ripensarci, dopo la firma" />
      </div>

      <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-prose-wide">
        Cambia solo chi manda la bolletta. Contatore, rete e assistenza restano gli stessi, e nessuno deve
        venire a casa.
      </p>

      <div className="mt-6 rounded-2xl bg-bg-alt p-6 sm:p-7">
        <p className="text-base text-ink-soft leading-relaxed">
          <strong className="text-ink">Oggi serve un mese o due.</strong> Il passaggio avviene il primo
          giorno del mese, se la richiesta parte entro il giorno 10 di quello prima.
        </p>
        <p className="mt-3 text-base leading-relaxed" style={{ color: CORAL }}>
          <strong>Da dicembre 2026 basteranno 24 ore.</strong>
        </p>
      </div>
    </>
  );
}

function ModuloTutele() {
  return (
    <>
      <ol className="list-none">
        <Tappa anno="2024" testo="Finisce la maggior tutela: a gennaio per il gas, a luglio per la luce." />
        <Tappa anno="Oggi" testo="Chi non ha mai scelto un'offerta è nel Servizio a Tutele Graduali, a condizioni fissate dalla regolazione di settore." />
        <Tappa anno="2027" testo="Il 31 marzo finisce anche quello: si passa tutti al mercato libero." ultimo />
      </ol>

      <div className="mt-8 rounded-2xl bg-bg-alt p-6 sm:p-7">
        <h4 className="font-sans font-bold text-base text-ink">Chi ha ancora un prezzo protetto</h4>
        <p className="mt-2 text-sm text-ink-muted">Basta una di queste condizioni:</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            'Più di 75 anni',
            'Bonus sociale',
            'Legge 104',
            'Gravi condizioni di salute',
            'Casa d\'emergenza dopo una calamità',
            'Isola minore',
          ].map(v => (
            <span
              key={v}
              className="px-3 py-1.5 rounded-full text-sm font-semibold bg-bg-card text-ink"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══════════ Sottocomponenti ══════════ */

function Voce({ nome, cambia }: { nome: string; cambia?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-4 py-4 border-b border-black/5 last:border-0">
      <span className="text-base font-semibold text-ink">{nome}</span>
      {cambia ? (
        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap"
          style={{ backgroundColor: TEAL }}
        >
          Cambia
        </span>
      ) : (
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-ink-muted bg-bg-card whitespace-nowrap">
          Uguale per tutti
        </span>
      )}
    </li>
  );
}

function SceltaCard({ titolo, frase, pro, contro }: {
  titolo: string; frase: string; pro: string; contro: string;
}) {
  return (
    <div className="rounded-2xl bg-bg-alt p-6 sm:p-7">
      <h4 className="font-sans font-bold text-lg text-ink">{titolo}</h4>
      <p className="mt-2 text-base text-ink-soft leading-relaxed">{frase}</p>
      <ul className="mt-5 space-y-3 list-none">
        <li className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
          <span className="font-bold flex-shrink-0" style={{ color: TEAL }} aria-hidden>+</span>
          {pro}
        </li>
        <li className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
          <span className="font-bold flex-shrink-0" style={{ color: CORAL }} aria-hidden>−</span>
          {contro}
        </li>
      </ul>
    </div>
  );
}

function Tappa({ anno, testo, ultimo }: { anno: string; testo: string; ultimo?: boolean }) {
  return (
    <li className="relative flex gap-5 pb-6 last:pb-0">
      {/* filo verticale che unisce le tappe */}
      {!ultimo && (
        <span className="absolute left-[9px] top-5 bottom-0 w-px bg-ink/15" aria-hidden />
      )}
      <span
        className="relative z-10 flex-shrink-0 w-[18px] h-[18px] rounded-full border-4 border-bg-card mt-1"
        style={{ backgroundColor: ultimo ? CORAL : TEAL }}
        aria-hidden
      />
      <div>
        <p className="font-sans font-bold text-base text-ink tabular-nums">{anno}</p>
        <p className="mt-1 text-base text-ink-soft leading-relaxed max-w-prose-wide">{testo}</p>
      </div>
    </li>
  );
}
