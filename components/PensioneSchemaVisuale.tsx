import { SogliaTile, Nota, TEAL, CORAL } from '@/components/GuidaModuli';

/**
 * Schema visuale della previdenza complementare — pagina /piano-pensione/schema.
 * Struttura ispirata a latuapensione.it/schema-previdenza, adattata a Quootami.
 *
 * IMPORTANTE — fatti verificati (luglio 2026), NON copiati da latuapensione dove
 * divergono dalle fonti:
 * - Prestazione in capitale: di regola almeno il 50% va convertito in rendita
 *   (quindi fino al 50% in capitale); 100% in capitale solo se la rendita da
 *   conversione del 70% della posizione è sotto metà dell'assegno sociale.
 *   (latuapensione scrive "fino al 60% NUOVO 2026": non riportato, non verificato
 *   e in contrasto con questa regola.)
 * - TFR: accantonamento pari al 6,91% della RAL (13,5/193).
 * - Deducibilità: fino a €5.300/anno (Legge di Bilancio 2026).
 * - Tassazione: rendimenti 20% (12,5% titoli di Stato); prestazione 15%→9%.
 * - Anticipazioni: art. 11 D.Lgs 252/2005 (75% salute/prima casa; 30% altre,
 *   dopo 8 anni; cumulo max 75%).
 * - Misure compensative datore: art. 10 D.Lgs 252/2005.
 * Fonte generale: D.Lgs 252/2005 e successive modifiche; COVIP.
 */

const STEP_NAV = [
  { href: '#step-1', label: 'Come aderire' },
  { href: '#step-2', label: 'Dove versare' },
  { href: '#step-3', label: 'Accumulo' },
  { href: '#step-4', label: 'Cosa ottieni' },
  { href: '#step-5', label: 'Il datore' },
];

const SIGLE = [
  ['FPN', 'fondo pensione negoziale (di categoria)'],
  ['FPA', 'fondo pensione aperto'],
  ['PIP', 'piano individuale pensionistico'],
  ['TFR', 'trattamento di fine rapporto'],
  ['ISC', 'indicatore sintetico dei costi'],
  ['CCNL', 'contratto collettivo nazionale di lavoro'],
];

export function PensioneSchemaVisuale() {
  return (
    <section className="section bg-bg">
      <div className="container-content">
        {/* ── Sub-nav interna agli step ── */}
        <nav aria-label="Passi dello schema" className="mb-10">
          <ul className="flex flex-wrap gap-2 justify-center list-none">
            {STEP_NAV.map((s, i) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold text-ink-soft bg-bg-alt hover:bg-brand-yellow/20 transition-colors"
                >
                  <span className="font-mono text-xs text-brand-green-dark">0{i + 1}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Step 1 ── */}
        <Step n={1} titolo="Chi sei e come puoi aderire" desc="Il percorso cambia in base al tuo lavoro.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfiloCard titolo="Lavoratore dipendente" sotto="Con datore di lavoro e TFR" />
            <ProfiloCard titolo="Autonomo o libero professionista" sotto="Senza datore, senza TFR" />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ViaCard
              titolo="Adesione collettiva (via CCNL)"
              tono="consigliata"
              badge="Contributo del datore incluso"
              desc="Se versi la tua quota minima, il datore è tenuto ad aggiungere la sua: denaro in più che altrimenti non avresti."
            />
            <ViaCard
              titolo="Adesione individuale (di tua iniziativa)"
              tono="neutro"
              badge="Niente contributo del datore"
              desc="Scegli liberamente un fondo aperto o un PIP, ma rinunci al contributo del datore previsto dal CCNL."
            />
          </div>
        </Step>

        {/* ── Step 2 ── */}
        <Step n={2} titolo="Dove puoi versare" desc="Tre tipi di forma pensionistica, con costi diversi.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FondoCard
              titolo="Fondo negoziale"
              sotto="Di categoria (FPN)"
              desc="Il fondo del tuo CCNL. Costi molto bassi e contributo del datore."
              costo="Costi minimi · ISC < 0,3%"
            />
            <FondoCard
              titolo="Fondo aperto"
              sotto="Banche, SGR, assicurazioni (FPA)"
              desc="Istituito da banche, SGR o assicurazioni. Aperto a tutti, anche agli autonomi."
              costo="Costi medi · ISC 0,5–1,2%"
            />
            <FondoCard
              titolo="PIP"
              sotto="Piano individuale"
              desc="Forma pensionistica di tipo assicurativo. Solo su adesione individuale."
              costo="Costi più alti · ISC 1,5–3,5%"
            />
          </div>
          <Nota>
            Con l&apos;adesione individuale il fondo negoziale non è accessibile: restano il fondo
            aperto e il PIP. I range di ISC sono indicativi (rilevazioni COVIP) e variano per comparto.
          </Nota>
        </Step>

        {/* ── Step 3 ── */}
        <Step n={3} titolo="Fase di accumulo" desc="Cosa versi e come cresce nel tempo.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BloccoCard titolo="Contribuzione">
              La tua quota, la quota del datore e il TFR (pari al 6,91% della retribuzione lorda).
              I versamenti sono deducibili fino a €5.300 l&apos;anno.
            </BloccoCard>
            <BloccoCard titolo="Linee di investimento">
              Garantita, obbligazionaria, bilanciata o azionaria: la scelta dipende soprattutto da
              quanti anni mancano alla pensione. Si può cambiare nel tempo.
            </BloccoCard>
            <BloccoCard titolo="La tua posizione">
              Contributi più rendimenti netti. È sempre intestata a te, portabile a un altro fondo e
              trasmissibile agli eredi.
            </BloccoCard>
          </div>
        </Step>

        {/* ── Step 4 ── */}
        <Step n={4} titolo="Cosa ottieni" desc="Prima della pensione e al momento della pensione.">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Prima della pensione</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BloccoCard titolo="Anticipazioni">
              Fino al 75% per spese sanitarie gravi o prima casa, fino al 30% per qualsiasi esigenza
              dopo 8 anni di iscrizione. Il cumulo non supera il 75% della posizione.
            </BloccoCard>
            <BloccoCard titolo="RITA — il ponte verso la pensione">
              Se ti mancano al massimo 5 anni alla pensione (10 in caso di lunga inoccupazione),
              puoi farti erogare la posizione a rate, con tassazione agevolata.
            </BloccoCard>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mt-8 mb-3">Al momento della pensione</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BloccoCard titolo="Capitale e rendita">
              Di regola almeno metà della posizione va convertita in rendita vitalizia; l&apos;altra
              metà si può ritirare in capitale. Chi ha accumulato poco può incassare il 100% in
              un&apos;unica soluzione (sotto la soglia legata all&apos;assegno sociale).
            </BloccoCard>
            <BloccoCard titolo="Tassazione agevolata">
              Sulla prestazione finale l&apos;imposta scende dal 15% al 9% (dopo 35 anni di
              iscrizione). I rendimenti sono tassati al 20% invece del 26%.
            </BloccoCard>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SogliaTile valore="9–15%" label="imposta sulla prestazione, non 23–43% IRPEF" />
            <SogliaTile valore="20%" label="sui rendimenti, invece del 26%" />
            <SogliaTile valore="fino a 75%" label="anticipabile per salute o prima casa" />
          </div>
        </Step>

        {/* ── Step 5 ── */}
        <Step n={5} titolo="E per il datore di lavoro?" desc="Versare il TFR al fondo non è un costo a fondo perduto." ultimo>
          <BloccoCard titolo="Misure compensative (art. 10, D.Lgs 252/2005)">
            A fronte del TFR versato alla previdenza complementare, il datore ha una deduzione sul
            reddito d&apos;impresa, l&apos;esonero dal versamento dello 0,20% al Fondo di Garanzia,
            la riduzione degli oneri impropri e nessuna rivalutazione del TFR da accantonare.
          </BloccoCard>
        </Step>

        {/* ── Sigle in breve ── */}
        <div className="mt-12 rounded-3xl bg-bg-alt border border-black/5 p-6 sm:p-8">
          <h3 className="font-sans font-bold text-base text-ink">Sigle in breve</h3>
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {SIGLE.map(([sigla, spieg]) => (
              <div key={sigla} className="flex items-baseline gap-3 border-b border-black/5 pb-3">
                <dt className="font-mono text-sm font-bold text-brand-green-dark flex-shrink-0 w-14">{sigla}</dt>
                <dd className="text-sm text-ink-muted leading-relaxed">{spieg}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Disclaimer divulgativo ── */}
        <p className="mt-8 text-xs text-ink-muted leading-relaxed max-w-prose-wide mx-auto text-center">
          Informazioni a carattere divulgativo, non costituiscono consulenza finanziaria, fiscale o
          legale. Riferimenti: D.Lgs 252/2005 e successive modifiche, Legge di Bilancio 2026.
          Aggiornato a luglio 2026.
        </p>
      </div>
    </section>
  );
}

/* ══════════ Sottocomponenti ══════════ */

function Step({ n, titolo, desc, children, ultimo }: {
  n: number; titolo: string; desc: string; children: React.ReactNode; ultimo?: boolean;
}) {
  return (
    <div id={`step-${n}`} className={`scroll-mt-32 ${ultimo ? '' : 'pb-12 mb-12 border-b border-black/5'}`}>
      <div className="flex items-center gap-4 mb-6">
        <span
          className="w-11 h-11 rounded-2xl flex items-center justify-center font-sans font-bold text-lg text-white flex-shrink-0"
          style={{ backgroundColor: TEAL }}
          aria-hidden
        >
          {n}
        </span>
        <div>
          <h2 className="font-sans font-bold text-xl sm:text-2xl text-ink tracking-tight leading-tight">{titolo}</h2>
          <p className="mt-0.5 text-sm text-ink-muted">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ProfiloCard({ titolo, sotto }: { titolo: string; sotto: string }) {
  return (
    <div className="rounded-2xl bg-bg-card border border-black/5 p-5">
      <p className="font-sans font-bold text-sm text-ink">{titolo}</p>
      <p className="mt-1 text-xs text-ink-muted">{sotto}</p>
    </div>
  );
}

function ViaCard({ titolo, badge, desc, tono }: {
  titolo: string; badge: string; desc: string; tono: 'consigliata' | 'neutro';
}) {
  const consigliata = tono === 'consigliata';
  return (
    <div
      className="rounded-2xl bg-bg-alt p-6 border"
      style={{ borderColor: consigliata ? TEAL : 'rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans font-bold text-base text-ink">{titolo}</h3>
        {consigliata && (
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: `${TEAL}1A`, color: TEAL }}
          >
            Consigliata
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">{desc}</p>
      <p
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold"
        style={{ color: consigliata ? TEAL : CORAL }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: consigliata ? TEAL : CORAL }} aria-hidden />
        {badge}
      </p>
    </div>
  );
}

function FondoCard({ titolo, sotto, desc, costo }: {
  titolo: string; sotto: string; desc: string; costo: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-bg-alt p-6">
      <p className="font-sans font-bold text-base text-ink">{titolo}</p>
      <p className="text-xs text-ink-muted mt-0.5">{sotto}</p>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed flex-grow">{desc}</p>
      <p className="mt-4 text-xs font-bold" style={{ color: TEAL }}>{costo}</p>
    </div>
  );
}

function BloccoCard({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-bg-alt p-6">
      <h3 className="font-sans font-bold text-base text-ink">{titolo}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{children}</p>
    </div>
  );
}
