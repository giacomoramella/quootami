/**
 * "I numeri della previdenza" — dati di mercato COVIP, riprodotti in stile
 * Quootami dalla sezione omologa di latuapensione.it.
 *
 * Sono dati statistici pubblici (fatti, non claim): quattro aggregati di mercato
 * + la tabella dei costi (ISC) per comparto e tipo di fondo. Attribuzione:
 * elaborazione su dati COVIP, fine 2024. Le variazioni % sono anno su anno.
 *
 * Accento grafico teal come il resto della sezione previdenza.
 */

const TEAL = '#2A9D8F';

const STAT = [
  { valore: '291', unita: 'forme pensionistiche', delta: null },
  { valore: '11,1', unita: 'milioni di posizioni', delta: '+4,1%' },
  { valore: '243,4', unita: 'miliardi € di risorse', delta: '+8,5%' },
  { valore: '20,5', unita: 'miliardi € di contributi', delta: '+7,0%' },
];

// ISC % — [min, media, max] per Fondo Negoziale / Fondo Aperto / Piano Individuale.
const ISC: { comparto: string; fpn: string[]; fpa: string[]; pip: string[] }[] = [
  { comparto: 'Garantito',       fpn: ['0,25', '0,678', '1,15'], fpa: ['0,65', '1,182', '2,22'], pip: ['1,20', '1,873', '2,58'] },
  { comparto: 'Obbligazionario', fpn: ['0,13', '0,375', '0,71'], fpa: ['0,63', '1,066', '1,65'], pip: ['0,58', '1,941', '2,70'] },
  { comparto: 'Bilanciato',      fpn: ['0,16', '0,386', '0,73'], fpa: ['0,78', '1,445', '2,13'], pip: ['1,42', '2,142', '2,90'] },
  { comparto: 'Azionario',       fpn: ['0,24', '0,392', '0,75'], fpa: ['0,83', '1,722', '2,58'], pip: ['1,04', '2,630', '4,07'] },
];

export function PensioneCovip() {
  return (
    <section className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">Dati COVIP</span>
          <h2 className="section-title">
            I numeri della <span className="hl">previdenza.</span>
          </h2>
          <p className="section-sub mx-auto">
            Fotografia del mercato dei fondi pensione in Italia e quanto costano davvero, per tipo di
            fondo.
          </p>
        </div>

        {/* ── 4 aggregati di mercato ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {STAT.map((s) => (
            <div key={s.unita} className="rounded-2xl bg-bg-card border border-black/5 p-5 text-center">
              <p className="font-sans font-bold text-3xl sm:text-4xl text-ink tabular-nums">{s.valore}</p>
              {s.delta && (
                <span className="inline-block mt-1 text-xs font-bold" style={{ color: TEAL }}>
                  {s.delta}
                </span>
              )}
              <div className="w-7 h-1 rounded-full bg-brand-yellow mx-auto mt-2" />
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">{s.unita}</p>
            </div>
          ))}
        </div>

        {/* ── Tabella ISC per comparto e tipo di fondo ── */}
        <div className="mt-8 max-w-4xl mx-auto rounded-3xl bg-bg-card border border-black/5 p-4 sm:p-7">
          <h3 className="font-sans font-bold text-lg text-ink px-2">Quanto costano i fondi (ISC %)</h3>
          <p className="mt-1 px-2 text-sm text-ink-muted leading-relaxed">
            Range minimo–massimo e valore medio dell&apos;Indicatore Sintetico dei Costi, per comparto
            e tipo di fondo. Più l&apos;ISC è basso, più rendimento resta all&apos;iscritto.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[640px]">
              <thead>
                <tr>
                  <th rowSpan={2} scope="col" className="text-left align-bottom font-sans font-bold text-xs uppercase tracking-wider text-ink pb-3 px-3 border-b-2 border-black/10">
                    Comparto
                  </th>
                  <th colSpan={3} scope="colgroup" className="text-center font-sans font-bold text-xs uppercase tracking-wider text-ink-muted pb-2 px-3">
                    Fondo negoziale
                  </th>
                  <th colSpan={3} scope="colgroup" className="text-center font-sans font-bold text-xs uppercase tracking-wider text-ink-muted pb-2 px-3">
                    Fondo aperto
                  </th>
                  <th colSpan={3} scope="colgroup" className="text-center font-sans font-bold text-xs uppercase tracking-wider text-ink-muted pb-2 px-3">
                    Piano individuale
                  </th>
                </tr>
                <tr>
                  {['Min', 'Media', 'Max', 'Min', 'Media', 'Max', 'Min', 'Media', 'Max'].map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`text-center font-semibold text-[11px] uppercase tracking-wider pb-3 px-3 border-b-2 border-black/10
                                  ${i % 3 === 1 ? 'text-ink' : 'text-ink-muted'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ISC.map((r) => (
                  <tr key={r.comparto}>
                    <td className="py-3.5 px-3 border-b border-black/5 font-semibold text-ink whitespace-nowrap">
                      {r.comparto}
                    </td>
                    {[r.fpn, r.fpa, r.pip].flatMap((gruppo, g) =>
                      gruppo.map((v, i) => (
                        <td
                          key={`${g}-${i}`}
                          className={`py-3.5 px-3 border-b border-black/5 text-center tabular-nums
                                      ${i === 1 ? 'font-bold text-ink' : 'text-ink-soft'}`}
                        >
                          {v}
                        </td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 px-2 text-xs text-ink-muted leading-relaxed">
            Colonna in evidenza = valore medio. Elaborazione su dati COVIP · fine 2024. I costi
            variano nel tempo e vanno verificati sul singolo fondo prima dell&apos;adesione.
          </p>
        </div>
      </div>
    </section>
  );
}
