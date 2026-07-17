/**
 * Schemi della pagina Fondo Pensione — parte "guida".
 *
 * Complementare a PensioneDati (che mostra i grafici): qui ci sono gli
 * schemi normativi, cioè le regole di legge in forma di tabella.
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

const TEAL = '#2A9D8F';
const CORAL = '#E76F51';

export function PensioneSchemi() {
  return (
    <>
      {/* ═══ SISTEMA E-T-T ═══ */}
      <section id="ett" className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="eyebrow">Come funziona</span>
            <h2 className="section-title">
              Il vantaggio arriva <span className="hl">tre volte.</span>
            </h2>
            <p className="section-sub mx-auto">
              La previdenza complementare è l&apos;unico strumento in Italia agevolato in tutte e tre
              le fasi: quando si versa, mentre il capitale cresce e quando viene incassato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
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

          {/* Tabella confronto */}
          <TabellaCard
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
        </div>
      </section>

      {/* ═══ TFR ═══ */}
      <section id="tfr" className="section bg-bg-alt">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="eyebrow">La scelta sul TFR</span>
            <h2 className="section-title">
              In azienda o <span className="hl">nel fondo.</span>
            </h2>
            <p className="section-sub mx-auto">
              È la decisione che pesa di più, perché riguarda una quota di stipendio già maturata.
              La scelta non è definitiva in un senso: il TFR può essere spostato nel fondo in qualsiasi
              momento, ma una volta versato non torna in azienda.
            </p>
          </div>

          <TabellaCard
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
          />

          {/* Contributo datoriale */}
          <div className="mt-8 max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-7 sm:p-8">
            <h3 className="font-sans font-bold text-lg text-ink">Il contributo del datore di lavoro</h3>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
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

            <p className="mt-6 text-xs text-ink-muted leading-relaxed">
              Percentuali dei due contratti più diffusi, a titolo di esempio. Ogni CCNL ha aliquote proprie e
              le cambia a ogni rinnovo, e alcuni prevedono quote maggiorate per i giovani: il valore esatto va
              verificato sull&apos;accordo applicato al singolo rapporto di lavoro.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ NOVITÀ 2026 ═══ */}
      <section id="novita-2026" className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="eyebrow">Cosa cambia</span>
            <h2 className="section-title">
              Le regole <span className="hl">del 2026.</span>
            </h2>
            <p className="section-sub mx-auto">
              La Legge di Bilancio 2026 ha rivisto la previdenza complementare in due tappe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
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

          <p className="mt-6 max-w-4xl mx-auto text-xs text-ink-muted leading-relaxed text-center">
            Cambia anche il Fondo di Tesoreria INPS: nel biennio 2026-2027 vi confluisce il TFR non destinato
            alla previdenza complementare delle aziende con almeno 60 dipendenti, soglia che scende a 50 dal 2028.
          </p>
        </div>
      </section>

      {/* ═══ ANTICIPAZIONI ═══ */}
      <section id="anticipazioni" className="section bg-bg-alt">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="eyebrow">Prima della pensione</span>
            <h2 className="section-title">
              Il capitale non è <span className="hl">bloccato.</span>
            </h2>
            <p className="section-sub mx-auto">
              È l&apos;obiezione più comune al fondo pensione, ed è basata su un equivoco: la legge prevede
              diversi casi in cui si può accedere alle somme accumulate prima del pensionamento.
            </p>
          </div>

          <TabellaCard
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
          />

          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-3xl bg-bg-card border border-black/5 p-7">
              <h3 className="font-sans font-bold text-base text-ink">Se si perde il lavoro</h3>
              <ul className="mt-4 space-y-3 list-none">
                <RigaDato label="Dopo 12 mesi di disoccupazione" valore="riscatto del 50%" />
                <RigaDato label="Dopo 48 mesi di disoccupazione" valore="riscatto del 100%" />
              </ul>
              <p className="mt-4 text-xs text-ink-muted leading-relaxed">
                In entrambi i casi si applica la tassazione agevolata dal 15% al 9%, non l&apos;IRPEF ordinaria.
              </p>
            </div>

            <div className="rounded-3xl bg-bg-card border border-black/5 p-7">
              <h3 className="font-sans font-bold text-base text-ink">Restituire l&apos;anticipazione</h3>
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

          {/* RITA */}
          <div className="mt-8 max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-7 sm:p-8">
            <h3 className="font-sans font-bold text-lg text-ink">RITA: anticipare l&apos;uscita dal lavoro</h3>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
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

            <p className="mt-6 text-xs text-ink-muted leading-relaxed">
              La RITA può essere parziale: si destina a rendita anticipata solo una parte della posizione,
              lasciando il resto investito per la pensione integrativa ordinaria.
            </p>
          </div>

          {/* Riscatto 100% capitale */}
          <div className="mt-8 max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-7 sm:p-8">
            <h3 className="font-sans font-bold text-lg text-ink">Quando si può incassare tutto in capitale</h3>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Di regola almeno metà della posizione deve essere convertita in rendita vitalizia. Fa eccezione
              chi ha accumulato poco: se la rendita ottenuta convertendo il 70% della posizione resta sotto la
              metà dell&apos;assegno sociale, si può incassare il 100% in un&apos;unica soluzione.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SogliaTile valore="€7.101,12" label="assegno sociale 2026, su base annua" />
              <SogliaTile valore="€3.550,56" label="la metà: è la soglia di riferimento" />
              <SogliaTile valore="~€273" label="al mese, ripartito su 13 mensilità" />
            </div>
            <p className="mt-6 text-xs text-ink-muted leading-relaxed">
              La rendita si calcola con i coefficienti di trasformazione del fondo, che variano con l&apos;età e
              con la forma pensionistica scelta: la verifica va fatta sul singolo caso.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PREMORIENZA ═══ */}
      <section id="premorienza" className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="eyebrow">In caso di decesso</span>
            <h2 className="section-title">
              Il capitale <span className="hl">non si perde.</span>
            </h2>
            <p className="section-sub mx-auto">
              Se l&apos;iscritto muore prima della pensione, la posizione viene liquidata secondo un ordine
              preciso. È la ragione per cui la designazione dei beneficiari va compilata e tenuta aggiornata.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-7 sm:p-8">
            <h3 className="font-sans font-bold text-lg text-ink">A chi va la posizione</h3>
            <ol className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 list-none">
              <PassoCard n={1} title="Beneficiari designati" desc="Chiunque sia stato indicato dall'iscritto, anche fuori dalla famiglia. La designazione prevale sulle regole della successione." />
              <PassoCard n={2} title="Eredi legittimi" desc="In assenza di designazione, la posizione va agli eredi secondo le norme ordinarie." />
              <PassoCard n={3} title="Resta al fondo" desc="Senza beneficiari né eredi il capitale non viene liquidato a nessuno: resta alla forma pensionistica." tono="alert" />
            </ol>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SogliaTile valore="15% → 9%" label="tassazione per i beneficiari, la stessa agevolata della prestazione" />
              <SogliaTile valore="0%" label="imposta di successione: il capitale non entra nell'asse ereditario" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════ Sottocomponenti ══════════ */

function FaseCard({ lettera, fase, momento, desc, cifra, cifraLabel }: {
  lettera: string; fase: string; momento: string; desc: string; cifra: string; cifraLabel: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl bg-bg-card border border-black/5 p-7">
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
      <div className="mt-auto pt-5">
        <p className="font-sans font-bold text-2xl text-ink tabular-nums">{cifra}</p>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">{cifraLabel}</p>
      </div>
    </div>
  );
}

/**
 * Tabella responsive. `highlight` è l'indice della colonna da evidenziare
 * (quella del fondo pensione); -1 per nessuna.
 */
function TabellaCard({ title, note, head, rows, highlight }: {
  title: string; note: string; head: string[]; rows: string[][]; highlight: number;
}) {
  return (
    <div className="mt-8 max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-7 sm:p-8">
      <h3 className="font-sans font-bold text-lg text-ink">{title}</h3>
      <div className="mt-6 overflow-x-auto">
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
                                ${i === highlight ? 'font-semibold text-ink bg-brand-yellow/10' : 'text-ink-soft'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-xs text-ink-muted leading-relaxed">{note}</p>
    </div>
  );
}

function CcnlCard({ ccnl, fondo, righe }: { ccnl: string; fondo: string; righe: string[][] }) {
  return (
    <div className="rounded-2xl bg-bg-alt p-5">
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
    <div className="rounded-3xl bg-bg-card border border-black/5 p-7">
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
      <h3 className="mt-4 font-sans font-bold text-base text-ink">{title}</h3>
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
    <div className="rounded-2xl bg-bg-alt p-5">
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
