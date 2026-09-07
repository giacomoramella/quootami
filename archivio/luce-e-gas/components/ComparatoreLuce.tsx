'use client';

import { useEffect, useState } from 'react';
import { SUPABASE } from '@/config/credentials';

/**
 * Comparatore offerte luce/gas — porting React del flusso `en.*`:
 *   1. dati bolletta (a mano o via foto → Edge Function en-bill-extract)
 *   2. confronto → RPC en_quote_public (offerte reali dal Portale ARERA)
 *   3. lead con consenso → en-lead?action=submit → email doppio opt-in
 *   4. ritorno da email (?verified=token) → en-lead?action=results
 *
 * Backend: progetto Supabase del sito (Francoforte). La chiave anon è
 * public-by-design (config/credentials.ts), protetta da RLS lato DB.
 */

const HEADERS = {
  'Content-Type': 'application/json',
  apikey: SUPABASE.anonKey,
  Authorization: `Bearer ${SUPABASE.anonKey}`,
};

type Commodity = 'ele' | 'gas';

/**
 * Riga di proposta. Prima della conferma email arriva da en_quote_public con
 * i nomi MASCHERATI dal backend ("Fornitore 1", "Offerta riservata"); dopo la
 * conferma arriva da en_verification_results in chiaro, con anche
 * signup_url/supplier_website (il link tracciato degli accordi partner).
 */
type Proposal = {
  rank?: number;
  supplier_name?: string;
  offer_name?: string;
  price_type?: string;
  index_name?: string | null;
  fixed_fee_year?: number | null;
  duration_months?: number | null;
  annual_saving?: number;
  annual_cost_offer?: number;
  signup_url?: string | null;
  supplier_website?: string | null;
};

type QuoteResult =
  | { kind: 'ok'; saving: number; pct: number; current: number; count: number; proposals: Proposal[] }
  | { kind: 'empty' };

type VerifiedResult = {
  title: string;
  main: string;
  sub: string;
  proposals?: Proposal[];
};

function parseNum(v: string): number | null {
  if (!v) return null;
  const n = parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function eur(n: number): string {
  return Math.round(n).toLocaleString('it-IT');
}

type Filtro = 'tutte' | 'fixed' | 'indexed' | 'noquota';

const CHIP: [Filtro, string][] = [
  ['tutte', 'Tutte'],
  ['fixed', 'Prezzo fisso'],
  ['indexed', 'Indicizzato'],
  ['noquota', 'Senza quota fissa'],
];

/**
 * Lista delle offerte convenienti con filtri, ordinata per risparmio.
 * `mascherata`: prima della conferma email i nomi arrivano già oscurati dal
 * backend; qui si aggiunge solo l'avviso che spiega come sbloccarli.
 * Sulle righe verificate, se il fornitore ha un accordo attivo compare il
 * link di attivazione tracciato (signup_url in en.suppliers).
 */
function ListaOfferte({ proposals, mascherata }: { proposals: Proposal[]; mascherata: boolean }) {
  const [filtro, setFiltro] = useState<Filtro>('tutte');
  const [visibili, setVisibili] = useState(10);

  const filtrate = proposals.filter((p) =>
    filtro === 'fixed' ? p.price_type === 'fixed'
    : filtro === 'indexed' ? p.price_type === 'indexed'
    : filtro === 'noquota' ? !(p.fixed_fee_year && p.fixed_fee_year > 0)
    : true
  );

  if (proposals.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6 rounded-3xl bg-bg-card border border-black/5 shadow-brand-sm p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="font-sans font-bold text-lg text-ink">
          {filtrate.length === proposals.length
            ? `${proposals.length} offerte più convenienti della tua`
            : `${filtrate.length} offerte su ${proposals.length}`}
        </h3>
      </div>
      {mascherata && (
        <p className="mt-1 text-xs text-ink-muted">
          I nomi dei fornitori si sbloccano con la conferma email qui sotto — gratis e senza impegno.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Filtra le offerte">
        {CHIP.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filtro === id}
            onClick={() => { setFiltro(id); setVisibili(10); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filtro === id ? 'bg-brand-navy text-white' : 'bg-bg-alt text-ink-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2.5 list-none">
        {filtrate.slice(0, visibili).map((p, i) => (
          <li
            key={`${p.rank ?? i}-${p.offer_name ?? i}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-sans font-bold text-sm text-ink truncate">
                {mascherata ? '🔒 ' : ''}{p.supplier_name || 'Fornitore'}
                {!mascherata && p.offer_name ? <span className="font-normal text-ink-muted"> · {p.offer_name}</span> : null}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {p.price_type === 'fixed' ? 'Prezzo fisso' : `Indicizzato${p.index_name ? ' ' + p.index_name : ''}`}
                {p.duration_months && p.duration_months > 0 ? ` · ${p.duration_months} mesi` : ''}
                {p.fixed_fee_year && p.fixed_fee_year > 0 ? ` · quota ${eur(p.fixed_fee_year)} €/anno` : ' · senza quota fissa'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-sm text-brand-green-dark tabular-nums">−{eur(p.annual_saving ?? 0)} €/anno</p>
              <p className="text-xs text-ink-muted tabular-nums">{eur(p.annual_cost_offer ?? 0)} €/anno</p>
              {!mascherata && p.signup_url && (
                <a
                  href={p.signup_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-1 inline-block text-xs font-bold text-brand-green-dark underline underline-offset-2"
                >
                  Attiva l&apos;offerta ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {filtrate.length > visibili && (
        <button
          type="button"
          onClick={() => setVisibili((v) => v + 10)}
          className="mt-4 w-full text-center text-sm font-bold text-brand-green-dark hover:underline underline-offset-4"
        >
          Mostra altre {Math.min(10, filtrate.length - visibili)} offerte
        </button>
      )}
      {filtrate.length === 0 && (
        <p className="mt-4 text-sm text-ink-muted text-center">Nessuna offerta con questo filtro: prova &ldquo;Tutte&rdquo;.</p>
      )}

      <p className="mt-5 text-[11px] text-ink-muted leading-relaxed border-t border-black/5 pt-4">
        Stima sulla sola componente materia energia, a parità di consumo annuo; esclusi oneri,
        imposte e trasporto, uguali per tutti i fornitori. Ordinate per risparmio.
      </p>
    </div>
  );
}

export function ComparatoreLuce() {
  // ── input ──
  const [commodity, setCommodity] = useState<Commodity>('ele');
  const [modo, setModo] = useState<'upload' | 'manuale'>('upload');
  const [consumo, setConsumo] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [quota, setQuota] = useState('');
  const [periodo, setPeriodo] = useState('2');
  const [cap, setCap] = useState('');
  const [fornitore, setFornitore] = useState('');
  // ── stato flusso ──
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [lastPayload, setLastPayload] = useState<Record<string, unknown> | null>(null);
  // ── lead ──
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [consenso, setConsenso] = useState(false);
  const [consensoMarketing, setConsensoMarketing] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadLoading, setLeadLoading] = useState(false);
  const [grazie, setGrazie] = useState<string | null>(null);
  // ── ritorno da email di verifica ──
  const [verified, setVerified] = useState<VerifiedResult | null>(null);

  const giorni = periodo === '1' ? 30 : periodo === '12' ? 365 : 61;
  const unita = commodity === 'ele' ? 'kWh' : 'Smc';

  function buildPayload() {
    return {
      commodity,
      customer_type: 'domestic',
      consumption_total: parseNum(consumo),
      current_unit_price: parseNum(prezzo),
      current_fixed_fee_year: parseNum(quota) ?? 0,
      days: giorni,
      postal_code: cap.trim() || null,
      current_supplier: fornitore.trim() || null,
    };
  }

  async function confronta() {
    setQuoteError(null);
    const p = buildPayload();
    if (!p.consumption_total || !p.current_unit_price) {
      setQuoteError('Inserisci almeno consumo e prezzo della materia energia (li trovi in bolletta).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE.url}/rest/v1/rpc/en_quote_public`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ p }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'servizio non disponibile');
      const proposals: Proposal[] = data?.proposals ?? [];
      const best = proposals[0];
      if (!best) {
        setQuote({ kind: 'empty' });
      } else {
        const saving = Math.max(best.annual_saving ?? 0, 0);
        const pct = data.annual_cost_current > 0 ? Math.round((saving / data.annual_cost_current) * 100) : 0;
        // In lista solo le offerte che fanno risparmiare davvero.
        const convenienti = proposals.filter((x) => (x.annual_saving ?? 0) > 0);
        setQuote({ kind: 'ok', saving, pct, current: data.annual_cost_current, count: proposals.length, proposals: convenienti });
      }
      setLastPayload(p);
    } catch (err) {
      setQuoteError(`Non siamo riusciti a calcolare il confronto: ${err instanceof Error ? err.message : err}`);
    } finally {
      setLoading(false);
    }
  }

  async function leggiBolletta(file: File) {
    setUploadMsg('Lettura della bolletta in corso…');
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]!);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch(`${SUPABASE.url}/functions/v1/en-bill-extract`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ data: base64, mime: file.type }),
      });
      const ex = await res.json();
      if (!res.ok) throw new Error(ex.error || 'estrazione non riuscita');
      setCommodity(ex.commodity === 'gas' ? 'gas' : 'ele');
      if (ex.consumption_total) setConsumo(String(ex.consumption_total));
      if (ex.current_unit_price) setPrezzo(String(ex.current_unit_price).replace('.', ','));
      if (ex.current_fixed_fee_year) setQuota(String(ex.current_fixed_fee_year).replace('.', ','));
      if (ex.postal_code) setCap(ex.postal_code);
      if (ex.supplier) setFornitore(ex.supplier);
      if (ex.customer_name) setNome(ex.customer_name);
      setModo('manuale');
      setUploadMsg(null);
    } catch (err) {
      setUploadMsg(
        `Non siamo riusciti a leggere il file: ${err instanceof Error ? err.message : 'riprova con una foto più nitida o inserisci i dati a mano.'}`
      );
    }
  }

  async function inviaLead(e: React.FormEvent) {
    e.preventDefault();
    setLeadError(null);
    if (!consenso) {
      setLeadError('Serve il consenso al trattamento dei dati per procedere.');
      return;
    }
    if (!lastPayload) {
      setLeadError('Esegui prima il confronto qui sopra.');
      return;
    }
    setLeadLoading(true);
    try {
      const p = {
        ...lastPayload,
        customer_name: nome.trim(),
        email: email.trim(),
        phone: telefono.trim() || null,
        consent: true,
        marketing_consent: consensoMarketing,
        source: 'quootami-luce',
      };
      const res = await fetch(`${SUPABASE.url}/functions/v1/en-lead?action=submit`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ p }),
      });
      const out = await res.json();
      if (!res.ok || out.error) throw new Error(out.error || 'invio non riuscito');
      setGrazie(
        out.offers_count
          ? `Abbiamo trovato ${out.offers_count} offerte più convenienti (fino a ${eur(out.best_saving)} €/anno). Controlla la tua email e clicca sul link per sbloccarle.`
          : "Ti abbiamo inviato un'email di conferma: clicca sul link per completare la richiesta."
      );
    } catch (err) {
      setLeadError(`Non siamo riusciti a inviare la richiesta: ${err instanceof Error ? err.message : err}`);
    } finally {
      setLeadLoading(false);
    }
  }

  // Ritorno dal link email (?verified=token | ?verifyerr=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verifyerr')) {
      setVerified({
        title: 'Link di conferma non valido o scaduto',
        main: '',
        sub: 'Ripeti il confronto qui sotto per ricevere una nuova email.',
      });
      return;
    }
    const token = params.get('verified');
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${SUPABASE.url}/functions/v1/en-lead?action=results`, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({ token }),
        });
        const out = await res.json();
        if (!res.ok || !out.ok) return;
        const tutte: Proposal[] = out.proposals ?? [];
        const best = tutte[0];
        setVerified({
          title: `Email confermata${out.customer_name ? `, ${out.customer_name.split(' ')[0]}` : ''}. Ecco la proposta migliore:`,
          main: best ? `${best.supplier_name ?? ''} — ${best.offer_name ?? ''}` : 'Nessuna offerta migliorativa trovata',
          sub: best
            ? `Risparmio stimato ${eur(best.annual_saving ?? 0)} €/anno (${eur(best.annual_cost_offer ?? 0)} €/anno contro ${eur(out.annual_cost_current)} €/anno attuali). Quootami ti contatterà a breve.`
            : 'Quootami ti contatterà comunque per una verifica personalizzata.',
          proposals: tutte.filter((x) => (x.annual_saving ?? 0) > 0),
        });
      } catch {
        /* silenzioso: il confronto resta disponibile */
      }
    })();
  }, []);

  const inputCls =
    'w-full px-4 py-3 rounded-2xl border border-black/10 bg-white text-ink text-base placeholder:text-ink-muted/60 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/40 outline-none transition';

  return (
    <section id="confronta" className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-10">
          <span className="eyebrow">Confronta</span>
          <h2 className="section-title">
            Quanto risparmi <span className="hl">in bolletta?</span>
          </h2>
          <p className="section-sub mx-auto">
            Carica la bolletta o inserisci due dati: il confronto usa le offerte reali del
            mercato libero.
          </p>
        </div>

        {/* Esito verifica email */}
        {verified && (
          <div className="max-w-2xl mx-auto mb-8 rounded-3xl bg-brand-navy text-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-yellow">{verified.title}</p>
            {verified.main && <p className="mt-2 text-2xl font-bold">{verified.main}</p>}
            <p className="mt-2 text-sm text-white/75">{verified.sub}</p>
          </div>
        )}

        {/* Lista in chiaro dopo la conferma email */}
        {verified?.proposals && verified.proposals.length > 0 && (
          <div className="mb-8">
            <ListaOfferte proposals={verified.proposals} mascherata={false} />
          </div>
        )}

        <div className="max-w-2xl mx-auto rounded-3xl bg-bg-card border border-black/5 shadow-brand-sm p-6 sm:p-8">
          {/* Luce / Gas */}
          <div className="flex gap-2 mb-6" role="tablist" aria-label="Tipo di fornitura">
            {(['ele', 'gas'] as const).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={commodity === c}
                onClick={() => setCommodity(c)}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
                  commodity === c ? 'bg-brand-navy text-white' : 'bg-bg-alt text-ink-muted hover:text-ink'
                }`}
              >
                {c === 'ele' ? 'Luce' : 'Gas'}
              </button>
            ))}
          </div>

          {/* Bolletta o inserimento manuale */}
          {modo === 'upload' ? (
            <div>
              <label
                className="block rounded-2xl border-2 border-dashed border-brand-green/40 bg-brand-green/5 p-8 text-center cursor-pointer hover:border-brand-green transition-colors"
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && leggiBolletta(e.target.files[0])}
                />
                <span className="block font-bold text-ink">Carica la bolletta — PDF o foto</span>
                <span className="mt-1 block text-sm text-ink-muted">
                  {uploadMsg ?? 'I dati vengono letti in automatico, senza scrivere nulla.'}
                </span>
              </label>
              <button
                onClick={() => setModo('manuale')}
                className="mt-4 w-full text-center text-sm font-semibold text-ink-muted underline underline-offset-2 hover:text-ink transition-colors"
              >
                Preferisco inserire i dati a mano
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confronta();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label={`Consumo del periodo (${unita})`} hint="in bolletta">
                  <input className={inputCls} value={consumo} onChange={(e) => setConsumo(e.target.value)} placeholder={commodity === 'ele' ? 'es. 600' : 'es. 300'} required inputMode="decimal" />
                </Campo>
                <Campo label="Periodo della bolletta" hint="per stimare l'anno">
                  <select className={inputCls} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                    <option value="1">1 mese (mensile)</option>
                    <option value="2">2 mesi (bimestrale)</option>
                    <option value="12">Consumo già annuo</option>
                  </select>
                </Campo>
                <Campo label={`Prezzo materia ${commodity === 'ele' ? 'energia (€/kWh)' : 'gas (€/Smc)'}`} hint="in bolletta">
                  <input className={inputCls} value={prezzo} onChange={(e) => setPrezzo(e.target.value)} placeholder="es. 0,16" required inputMode="decimal" />
                </Campo>
                <Campo label="Quota fissa attuale (€/anno)" hint="se indicata">
                  <input className={inputCls} value={quota} onChange={(e) => setQuota(e.target.value)} placeholder="es. 90" inputMode="decimal" />
                </Campo>
                <Campo label="CAP" hint="facoltativo">
                  <input className={inputCls} value={cap} onChange={(e) => setCap(e.target.value)} placeholder="es. 20121" inputMode="numeric" />
                </Campo>
                <Campo label="Fornitore attuale" hint="facoltativo">
                  <input className={inputCls} value={fornitore} onChange={(e) => setFornitore(e.target.value)} placeholder="es. Enel Energia" />
                </Campo>
              </div>
              <button
                onClick={() => setModo('upload')}
                type="button"
                className="mt-4 text-sm font-semibold text-ink-muted underline underline-offset-2 hover:text-ink transition-colors"
              >
                Oppure carica la bolletta e compiliamo noi
              </button>
              {quoteError && (
                <p role="alert" className="mt-4 rounded-2xl bg-[#E76F51]/10 border border-[#E76F51]/30 px-4 py-3 text-sm text-ink">
                  {quoteError}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full mt-5 disabled:opacity-60">
                {loading ? 'Confronto in corso…' : 'Confronta gratis →'}
              </button>
            </form>
          )}
        </div>

        {/* Risultato */}
        {quote && (
          <div className="max-w-2xl mx-auto mt-6 rounded-3xl bg-brand-navy text-white p-7 text-center">
            {quote.kind === 'empty' ? (
              <p className="text-lg font-semibold">Nessuna offerta disponibile al momento per questi parametri.</p>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-yellow">
                  In base ai tuoi consumi potresti risparmiare fino a
                </p>
                <p className="mt-1 text-4xl font-bold tabular-nums">{eur(quote.saving)} €/anno</p>
                <p className="mt-2 text-sm text-white/70">
                  circa il {quote.pct}% della spesa attuale ({eur(quote.current)} €/anno oggi) ·{' '}
                  {quote.count} offerte reali confrontate
                </p>
              </>
            )}
          </div>
        )}

        {/* Lista offerte (nomi mascherati fino alla conferma email) */}
        {quote?.kind === 'ok' && <ListaOfferte proposals={quote.proposals} mascherata={true} />}

        {/* Lead form */}
        {quote && (
          <div className="max-w-2xl mx-auto mt-6 rounded-3xl bg-bg-card border border-black/5 shadow-brand-sm p-6 sm:p-8">
            {grazie ? (
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center text-xl font-bold">✓</div>
                <h3 className="mt-4 font-sans font-bold text-lg text-ink">Controlla la tua email</h3>
                <p className="mt-2 text-sm text-ink-muted">{grazie}</p>
              </div>
            ) : (
              <>
                <h3 className="font-sans font-bold text-lg text-ink">Scopri i fornitori e ricevi la proposta</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Quootami ti invia la proposta migliore e ti segue nel cambio, gratuitamente.
                </p>
                <form onSubmit={inviaLead} className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Campo label="Nome e cognome *">
                      <input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Mario Rossi" required />
                    </Campo>
                    <Campo label="Email *">
                      <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@esempio.it" required />
                    </Campo>
                  </div>
                  <Campo label="Telefono" hint="facoltativo">
                    <input type="tel" className={inputCls} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+39 …" />
                  </Campo>
                  <label className="mt-4 flex items-start gap-3 text-sm text-ink-soft cursor-pointer">
                    <input type="checkbox" checked={consenso} onChange={(e) => setConsenso(e.target.checked)} required className="mt-0.5 w-4 h-4 accent-brand-green" />
                    <span>
                      Acconsento al trattamento dei dati per ricevere la proposta —{' '}
                      <a href="/privacy" target="_blank" className="underline underline-offset-2">Informativa privacy</a>.
                      I dati vanno al gestore del sito e non vengono ceduti a terzi senza consenso. *
                    </span>
                  </label>
                  <label className="mt-3 flex items-start gap-3 text-sm text-ink-soft cursor-pointer">
                    <input type="checkbox" checked={consensoMarketing} onChange={(e) => setConsensoMarketing(e.target.checked)} className="mt-0.5 w-4 h-4 accent-brand-green" />
                    <span>Acconsento a essere ricontattato per comunicazioni commerciali (facoltativo).</span>
                  </label>
                  {leadError && (
                    <p role="alert" className="mt-4 rounded-2xl bg-[#E76F51]/10 border border-[#E76F51]/30 px-4 py-3 text-sm text-ink">
                      {leadError}
                    </p>
                  )}
                  <button type="submit" disabled={leadLoading} className="btn-primary w-full mt-5 disabled:opacity-60">
                    {leadLoading ? 'Invio in corso…' : 'Ricevi la proposta →'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        <p className="max-w-2xl mx-auto mt-6 text-xs text-ink-muted text-center leading-relaxed">
          Stima indicativa sulla sola componente materia energia, calcolata sulle offerte
          pubblicate dai fornitori per i clienti domestici; esclusi oneri, imposte e trasporto.
          Servizio gratuito per il cliente: Quootami può ricevere una commissione dal fornitore
          in caso di attivazione.
        </p>
      </div>
    </section>
  );
}

function Campo({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {hint && <span className="ml-1 font-normal text-ink-muted">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}
