'use client';

/**
 * Guida alla previdenza complementare — pagina Fondo Pensione.
 *
 * Cinque moduli selezionabili: si clicca la scheda e il contenuto si apre
 * sotto, senza cambiare pagina. Pattern tablist/tab/tabpanel accessibile
 * (frecce, Home/End, aria-selected).
 *
 * Fonti e verifiche (luglio 2026):
 * - Deduzione €5.300/anno: limite alzato dalla Legge di Bilancio 2026
 *   (prima €5.164,57).
 * - Tassazione: 20% sui rendimenti (12,5% sulla quota in titoli di Stato),
 *   15% all'uscita con −0,30% per ogni anno oltre il 15° fino al 9%.
 * - TFR in azienda: rivalutazione 1,5% + 75% dell'inflazione, imposta
 *   sostitutiva 17% sulla rivalutazione, erogazione a tassazione separata
 *   (aliquota media degli ultimi 5 anni, di fatto mai sotto il 23%).
 * - Anticipazioni: art. 11 D.Lgs 252/2005. Cumulo massimo 75%.
 * - Reintegro: art. 11 c.8 D.Lgs 252/2005 — si può versare oltre il limite
 *   di deducibilità; sulla parte eccedente spetta un CREDITO D'IMPOSTA pari
 *   all'imposta pagata sull'anticipazione (NON una seconda deduzione).
 * - Riscatto 100% in capitale: possibile se la rendita ottenuta convertendo
 *   il 70% della posizione è inferiore al 50% dell'assegno sociale annuo.
 *   Assegno sociale 2026: €7.101,12/anno (€546,24 × 13) → soglia €3.550,56.
 * - Silenzio-assenso: dal 1° luglio 2026 adesione automatica per i
 *   neoassunti del settore privato, con opt-out entro 60 giorni.
 * - Portabilità del contributo datoriale verso fondi aperti/PIP: rinviata
 *   al 1° ottobre 2026 (NON in vigore dal 1° luglio, come si legge altrove).
 * - Fondo Tesoreria INPS: soglia 60 dipendenti nel biennio 2026-2027,
 *   50 dal 2028.
 *
 * Le percentuali dei CCNL sono esempi dei contratti più diffusi e cambiano
 * a ogni rinnovo: vanno sempre verificate sull'accordo applicato.
 */

import { useRef, useState } from 'react';

const TEAL = '#2A9D8F';
const CORAL = '#E76F51';

type Modulo = {
  id: string;
  titolo: string;
  sottotitolo: string;
  desc: string;
  lettura: string;
  contenuto: React.ReactNode;
};

const MODULI: Modulo[] = [
  {
    id: 'vantaggi-fiscali',
    titolo: 'Vantaggi fiscali',
    sottotitolo: 'Il sistema E-T-T',
    desc: 'Deduzione dei contributi, imposta ridotta sui rendimenti e aliquota agevolata all\'incasso.',
    lettura: '4 min',
    contenuto: <ModuloVantaggi />,
  },
  {
    id: 'tfr',
    titolo: 'TFR: dove destinarlo',
    sottotitolo: 'Azienda o fondo pensione',
    desc: 'Il confronto sui sei parametri che contano e il contributo del datore di lavoro.',
    lettura: '5 min',
    contenuto: <ModuloTfr />,
  },
  {
    id: 'novita-2026',
    titolo: 'Le regole del 2026',
    sottotitolo: 'Cosa è cambiato',
    desc: 'Adesione automatica per i neoassunti e portabilità del contributo datoriale.',
    lettura: '3 min',
    contenuto: <ModuloNovita />,
  },
  {
    id: 'anticipazioni',
    titolo: 'Anticipazioni e RITA',
    sottotitolo: 'Accedere al capitale prima',
    desc: 'Spese sanitarie, prima casa, perdita del lavoro, reintegro e uscita anticipata.',
    lettura: '6 min',
    contenuto: <ModuloAnticipazioni />,
  },
  {
    id: 'premorienza',
    titolo: 'Premorienza',
    sottotitolo: 'In caso di decesso',
    desc: 'A chi va la posizione, con che tassazione e perché designare i beneficiari.',
    lettura: '3 min',
    contenuto: <ModuloPremorienza />,
  },
];

export function PensioneSchemi() {
  const [attivo, setAttivo] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Frecce, Home e End sulla lista dei moduli (pattern ARIA tablist). */
  function onKeyDown(e: React.KeyboardEvent) {
    const ultimo = MODULI.length - 1;
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

  const m = MODULI[attivo];

  return (
    <section id="guida" className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">La guida</span>
          <h2 className="section-title">
            Tutto sulla <span className="hl">previdenza.</span>
          </h2>
          <p className="section-sub mx-auto">
            Cinque moduli, dalle basi alla pianificazione. Scegli l&apos;argomento: si apre qui sotto.
          </p>
        </div>

        {/* ── Selettore moduli ── */}
        <div
          role="tablist"
          aria-label="Moduli della guida alla previdenza complementare"
          onKeyDown={onKeyDown}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {MODULI.map((mod, i) => {
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
          {/* Intestazione del modulo */}
          <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-black/5">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: TEAL }}>
              Modulo {attivo + 1} di {MODULI.length}
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

          {/* Navigazione fra moduli */}
          <div className="mt-10 pt-6 border-t border-black/5 flex items-center justify-between gap-4">
            <NavModulo
              verso="prec"
              modulo={attivo > 0 ? MODULI[attivo - 1] : null}
              onClick={() => setAttivo(attivo - 1)}
            />
            <NavModulo
              verso="succ"
              modulo={attivo < MODULI.length - 1 ? MODULI[attivo + 1] : null}
              onClick={() => setAttivo(attivo + 1)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function NavModulo({ verso, modulo, onClick }: {
  verso: 'prec' | 'succ'; modulo: Modulo | null; onClick: () => void;
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

/* ══════════ Moduli ══════════ */

function ModuloVantaggi() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FaseCard
          lettera="E"
          fase="Esenzione"
          momento="Quando si versa"
          desc="I contributi si sottraggono dal reddito imponibile IRPEF, fino a €5.300 l'anno. Il risparmio è immediato e si ripete ogni anno."
          cifra="fino a €2.279"
          cifraLabel="di IRPEF risparmiata in un anno, con aliquota marginale al 43%"
        />
        <FaseCard
          lettera="T"
          fase="Tassazione ridotta"
          momento="Mentre cresce"
          desc="I rendimenti scontano un'imposta sostitutiva del 20%, contro il 26% di qualsiasi altro investimento finanziario. Sulla quota in titoli di Stato si scende al 12,5%."
          cifra="20%"
          cifraLabel="sui rendimenti, invece del 26%"
        />
        <FaseCard
          lettera="T"
          fase="Tassazione agevolata"
          momento="Quando si incassa"
          desc="La prestazione è tassata al 15%, che cala dello 0,30% per ogni anno di partecipazione oltre il quindicesimo, fino al minimo del 9%."
          cifra="15% → 9%"
          cifraLabel="contro il 23–43% dell'IRPEF ordinaria"
        />
      </div>

      <Tabella
        title="Fondo pensione e altri investimenti a confronto"
        note="Il confronto riguarda il trattamento fiscale, non il rendimento: quello dipende dal comparto scelto e dai costi del fondo."
        head={['Momento', 'Fondo pensione', 'Altro investimento']}
        rows={[
          ['Versamento', 'Deducibile fino a €5.300/anno', 'Nessuna agevolazione'],
          ['Rendimenti', '20% (12,5% su titoli di Stato)', '26%'],
          ['Incasso', 'Dal 15% al 9%', 'IRPEF 23–43%'],
          ['Successione', 'Esente da imposta', 'Soggetto a imposta'],
        ]}
        highlight={1}
      />
    </>
  );
}

function ModuloTfr() {
  return (
    <>
      <Tabella
        title="TFR in azienda e TFR nel fondo pensione"
        note="Il TFR lasciato in azienda si rivaluta dell'1,5% fisso più il 75% dell'inflazione, e la
              rivalutazione sconta un'imposta sostitutiva del 17%. All'erogazione si applica la tassazione
              separata, con l'aliquota media degli ultimi cinque anni: di fatto non scende mai sotto il 23%."
        head={['', 'TFR in azienda', 'TFR nel fondo pensione']}
        rows={[
          ['Rivalutazione', '1,5% + 75% dell\'inflazione', 'Dipende dal comparto scelto'],
          ['Tassa sui rendimenti', '17%', '20% (12,5% su titoli di Stato)'],
          ['Tassa all\'incasso', 'IRPEF separata, min. 23%', 'Dal 15% al 9%'],
          ['Contributo del datore', 'Non spetta', 'Spetta, se previsto dal CCNL'],
          ['Anticipazioni', 'Limitate per legge', 'Più ampie (fino al 75%)'],
          ['Se l\'azienda fallisce', 'Fondo di Garanzia INPS', 'Patrimonio separato e vigilato'],
        ]}
        highlight={2}
        primo
      />

      <Blocco titolo="Il contributo del datore di lavoro">
        <p className="text-sm text-ink-soft leading-relaxed">
          È l&apos;argomento più concreto a favore dell&apos;adesione. Se il lavoratore versa la propria
          quota al fondo di categoria, il datore è tenuto dal CCNL a versare la sua: è retribuzione
          aggiuntiva, che non spetta a chi lascia il TFR in azienda.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CcnlCard
            ccnl="Metalmeccanici"
            fondo="Fondo Cometa"
            righe={[
              ['Quota del lavoratore', '1,2% della RAL'],
              ['Quota del datore', '2,0% della RAL'],
            ]}
          />
          <CcnlCard
            ccnl="Commercio e terziario"
            fondo="Fondo Fon.Te."
            righe={[
              ['Quota del lavoratore', '0,55% della RAL'],
              ['Quota del datore', '1,55% della RAL'],
            ]}
          />
        </div>
        <Nota>
          Percentuali dei due contratti più diffusi, a titolo di esempio. Ogni CCNL ha aliquote proprie e
          le cambia a ogni rinnovo, e alcuni prevedono quote maggiorate per i giovani: il valore esatto va
          verificato sull&apos;accordo applicato al singolo rapporto di lavoro.
        </Nota>
      </Blocco>
    </>
  );
}

function ModuloNovita() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NovitaCard
          stato="in-vigore"
          statoLabel="In vigore dal 1° luglio 2026"
          title="Adesione automatica per i neoassunti"
          desc="Chi viene assunto nel settore privato è iscritto automaticamente al fondo pensione previsto dal
                proprio CCNL, con il versamento del TFR e delle quote. Per rinunciare o scegliere diversamente
                ci sono 60 giorni dall'assunzione: prima il termine era di sei mesi."
        />
        <NovitaCard
          stato="in-arrivo"
          statoLabel="Dal 1° ottobre 2026"
          title="Il contributo del datore diventa portabile"
          desc="Chi trasferisce la posizione dal fondo di categoria a un fondo aperto o a un PIP manterrà il
                diritto al contributo del datore di lavoro. Oggi quel contributo si perde cambiando fondo.
                L'entrata in vigore, inizialmente fissata a luglio, è stata rinviata a ottobre."
        />
      </div>
      <Nota>
        Cambia anche il Fondo di Tesoreria INPS: nel biennio 2026-2027 vi confluisce il TFR non destinato
        alla previdenza complementare delle aziende con almeno 60 dipendenti, soglia che scende a 50 dal 2028.
      </Nota>
    </>
  );
}

function ModuloAnticipazioni() {
  return (
    <>
      <Tabella
        title="Anticipazioni: quanto, quando, con che tassazione"
        note="Le causali sono cumulabili, ma il totale anticipato non può superare il 75% della posizione
              maturata. L'anzianità di iscrizione si conserva anche trasferendo il fondo: gli otto anni non
              ripartono da zero. Riferimento: art. 11 D.Lgs 252/2005."
        head={['Causale', 'Quota massima', 'Da quando', 'Tassazione']}
        rows={[
          ['Spese sanitarie gravi', 'Fino al 75%', 'In qualsiasi momento', 'Dal 15% al 9%'],
          ['Prima casa, acquisto o ristrutturazione', 'Fino al 75%', 'Dopo 8 anni di iscrizione', '23%'],
          ['Qualsiasi motivo, senza giustificazione', 'Fino al 30%', 'Dopo 8 anni di iscrizione', '23%'],
        ]}
        highlight={-1}
        primo
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-bg-alt p-6">
          <h4 className="font-sans font-bold text-base text-ink">Se si perde il lavoro</h4>
          <ul className="mt-4 space-y-3 list-none">
            <RigaDato label="Dopo 12 mesi di disoccupazione" valore="riscatto del 50%" />
            <RigaDato label="Dopo 48 mesi di disoccupazione" valore="riscatto del 100%" />
          </ul>
          <p className="mt-4 text-xs text-ink-muted leading-relaxed">
            In entrambi i casi si applica la tassazione agevolata dal 15% al 9%, non l&apos;IRPEF ordinaria.
          </p>
        </div>

        <div className="rounded-2xl bg-bg-alt p-6">
          <h4 className="font-sans font-bold text-base text-ink">Restituire l&apos;anticipazione</h4>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Le somme anticipate possono essere reintegrate in qualsiasi momento, anche in più versamenti e
            anche oltre il limite annuo di deducibilità.
          </p>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Sulla parte che eccede il limite spetta un <strong>credito d&apos;imposta</strong>{' '}
            pari all&apos;imposta già pagata sull&apos;anticipazione: in pratica si recupera il prelievo
            subito, e la posizione previdenziale torna intera.
          </p>
        </div>
      </div>

      <Blocco titolo="RITA: anticipare l'uscita dal lavoro">
        <p className="text-sm text-ink-soft leading-relaxed">
          La Rendita Integrativa Temporanea Anticipata permette di farsi erogare il capitale a rate prima
          dell&apos;età pensionabile, con la stessa tassazione agevolata dal 15% al 9%. Copre gli anni che
          mancano alla pensione pubblica. Due situazioni la rendono accessibile.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RitaCard
            titolo="Fino a 5 anni prima"
            requisiti={[
              'Attività lavorativa cessata',
              'Requisiti per la pensione entro 5 anni',
              'Almeno 5 anni nel fondo pensione',
              'Almeno 20 anni di contributi obbligatori',
            ]}
          />
          <RitaCard
            titolo="Fino a 10 anni prima"
            requisiti={[
              'Attività lavorativa cessata',
              'Inoccupato da almeno 24 mesi',
              'Requisiti per la pensione entro 10 anni',
              'Almeno 5 anni nel fondo pensione',
            ]}
          />
        </div>
        <Nota>
          La RITA può essere parziale: si destina a rendita anticipata solo una parte della posizione,
          lasciando il resto investito per la pensione integrativa ordinaria.
        </Nota>
      </Blocco>

      <Blocco titolo="Quando si può incassare tutto in capitale">
        <p className="text-sm text-ink-soft leading-relaxed">
          Di regola almeno metà della posizione deve essere convertita in rendita vitalizia. Fa eccezione
          chi ha accumulato poco: se la rendita ottenuta convertendo il 70% della posizione resta sotto la
          metà dell&apos;assegno sociale, si può incassare il 100% in un&apos;unica soluzione.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SogliaTile valore="€7.101,12" label="assegno sociale 2026, su base annua" />
          <SogliaTile valore="€3.550,56" label="la metà: è la soglia di riferimento" />
          <SogliaTile valore="~€273" label="al mese, ripartito su 13 mensilità" />
        </div>
        <Nota>
          La rendita si calcola con i coefficienti di trasformazione del fondo, che variano con l&apos;età e
          con la forma pensionistica scelta: la verifica va fatta sul singolo caso.
        </Nota>
      </Blocco>
    </>
  );
}

function ModuloPremorienza() {
  return (
    <>
      <p className="text-sm text-ink-soft leading-relaxed max-w-prose-wide">
        Se l&apos;iscritto muore prima della pensione, la posizione viene liquidata secondo un ordine
        preciso. È la ragione per cui la designazione dei beneficiari va compilata e tenuta aggiornata.
      </p>

      <ol className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 list-none">
        <PassoCard n={1} title="Beneficiari designati" desc="Chiunque sia stato indicato dall'iscritto, anche fuori dalla famiglia. La designazione prevale sulle regole della successione." />
        <PassoCard n={2} title="Eredi legittimi" desc="In assenza di designazione, la posizione va agli eredi secondo le norme ordinarie." />
        <PassoCard n={3} title="Resta al fondo" desc="Senza beneficiari né eredi il capitale non viene liquidato a nessuno: resta alla forma pensionistica." tono="alert" />
      </ol>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SogliaTile valore="15% → 9%" label="tassazione per i beneficiari, la stessa agevolata della prestazione" />
        <SogliaTile valore="0%" label="imposta di successione: il capitale non entra nell'asse ereditario" />
      </div>
    </>
  );
}

/* ══════════ Sottocomponenti ══════════ */

function Blocco({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl bg-bg-alt p-6 sm:p-7">
      <h4 className="font-sans font-bold text-base text-ink">{titolo}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Nota({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 text-xs text-ink-muted leading-relaxed">{children}</p>;
}

function FaseCard({ lettera, fase, momento, desc, cifra, cifraLabel }: {
  lettera: string; fase: string; momento: string; desc: string; cifra: string; cifraLabel: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-bg-alt p-6">
      <div className="flex items-center gap-3">
        <span
          className="w-11 h-11 rounded-2xl flex items-center justify-center font-sans font-bold text-xl text-white flex-shrink-0"
          style={{ backgroundColor: TEAL }}
          aria-hidden
        >
          {lettera}
        </span>
        <div>
          <p className="font-sans font-bold text-base text-ink leading-tight">{fase}</p>
          <p className="text-xs text-ink-muted mt-0.5">{momento}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-soft leading-relaxed">{desc}</p>
      {/* Il blocco cifra è ancorato in basso: senza un'altezza minima sulla
          didascalia, quella più lunga spingerebbe il numero più in alto e le
          tre cifre non risulterebbero allineate fra loro. Vincolo solo da md
          in su, dove le card stanno affiancate. */}
      <div className="mt-auto pt-5">
        <p className="font-sans font-bold text-2xl text-ink tabular-nums">{cifra}</p>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed md:min-h-[3.7rem]">{cifraLabel}</p>
      </div>
    </div>
  );
}

/**
 * Tabella responsive. `highlight` è l'indice della colonna da evidenziare
 * (quella del fondo pensione); -1 per nessuna.
 */
function Tabella({ title, note, head, rows, highlight, primo }: {
  title: string; note: string; head: string[]; rows: string[][]; highlight: number; primo?: boolean;
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
            {rows.map(row => (
              <tr key={row[0]}>
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

function CcnlCard({ ccnl, fondo, righe }: { ccnl: string; fondo: string; righe: string[][] }) {
  return (
    <div className="rounded-2xl bg-bg-card p-5">
      <p className="font-sans font-bold text-sm text-ink">{ccnl}</p>
      <p className="text-xs text-ink-muted mt-0.5">{fondo}</p>
      <ul className="mt-4 space-y-2 list-none">
        {righe.map(([l, v]) => (
          <li key={l} className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-ink-soft">{l}</span>
            <span className="text-sm font-bold text-ink tabular-nums whitespace-nowrap">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NovitaCard({ stato, statoLabel, title, desc }: {
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

function RigaDato({ label, valore }: { label: string; valore: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 pb-3 border-b border-black/5 last:border-0">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="text-sm font-bold text-ink whitespace-nowrap">{valore}</span>
    </li>
  );
}

function RitaCard({ titolo, requisiti }: { titolo: string; requisiti: string[] }) {
  return (
    <div className="rounded-2xl bg-bg-card p-5">
      <p className="font-sans font-bold text-sm text-ink">{titolo}</p>
      <ul className="mt-3 space-y-2 list-none">
        {requisiti.map(r => (
          <li key={r} className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: TEAL }}
              aria-hidden
            />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SogliaTile({ valore, label }: { valore: string; label: string }) {
  return (
    <div className="rounded-2xl bg-bg-alt p-5 text-center">
      <p className="font-sans font-bold text-2xl text-ink tabular-nums">{valore}</p>
      <p className="mt-2 text-xs text-ink-muted leading-relaxed">{label}</p>
    </div>
  );
}

function PassoCard({ n, title, desc, tono }: { n: number; title: string; desc: string; tono?: 'alert' }) {
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
