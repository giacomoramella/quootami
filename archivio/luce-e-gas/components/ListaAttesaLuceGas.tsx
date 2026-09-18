'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE } from '@/config/credentials';

/**
 * Lista d'attesa luce e gas — ARCHIVIATO, non ancora in produzione.
 *
 * Richiede `archivio/luce-e-gas/supabase/en-waitlist.sql` applicato al progetto
 * Supabase. Finché la migrazione non è applicata, la RPC non esiste e il form
 * fallisce: non spostare questo file in components/ prima di averla eseguita.
 *
 * PERCHÉ NON È IL COMPARATORE
 * Il comparatore vero è ComparatoreLuce.tsx, in questa stessa cartella. Non si
 * riattiva finché non c'è almeno un mandato firmato: mostrare un confronto
 * prezzi senza accordi sarebbe una comparazione finta, cioè una pratica
 * commerciale scorretta, oltre che il modo più rapido di bruciarsi con i
 * fornitori con cui si sta trattando.
 *
 * LE VERSIONI QUI SOTTO SONO LA PROVA DEL CONSENSO
 * Ogni riga salvata porta con sé la versione dei testi che l'interessato aveva
 * davanti. Se cambi anche una sola parola dei consensi, INCREMENTA
 * CONSENSI_VERSIONE; se cambia l'informativa, allinea INFORMATIVA_VERSIONE a
 * quella dichiarata in app/privacy/page.tsx. Non riusare una versione vecchia
 * per un testo nuovo: è l'unica cosa che rende il consenso dimostrabile.
 */

// Deve restare allineata a INFORMATIVA_VERSIONE in app/privacy/page.tsx
const INFORMATIVA_VERSIONE = '2.0';
const CONSENSI_VERSIONE = '1.0';

const supabase = createClient(SUPABASE.url, SUPABASE.anonKey, {
  auth: { persistSession: false },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAP_REGEX = /^[0-9]{5}$/;
const PHONE_REGEX = /^\+?[0-9 ()\-]{8,18}$/;

const FORNITURE = [
  { value: 'luce', label: 'Luce' },
  { value: 'gas', label: 'Gas' },
  { value: 'entrambe', label: 'Entrambe' },
] as const;

const FASCE = [
  { value: '<50', label: 'Meno di 50 €' },
  { value: '50-100', label: '50 – 100 €' },
  { value: '100-150', label: '100 – 150 €' },
  { value: '150-250', label: '150 – 250 €' },
  { value: '>250', label: 'Più di 250 €' },
  { value: 'non-so', label: 'Non lo so' },
] as const;

// I testi sono qui, non nel JSX, perché sono ciò che viene versionato:
// tenerli in un posto solo rende evidente quando cambiano.
const TESTI_CONSENSO = {
  contatto:
    'Acconsento a essere contattato da Quootami via email, e via telefono se ho lasciato il numero, per il confronto delle offerte luce e gas.',
  fornitori:
    'Acconsento alla comunicazione dei miei dati ai fornitori di energia partner di Quootami, per la formulazione di un’offerta e l’eventuale attivazione della fornitura.',
  marketing:
    'Acconsento a ricevere comunicazioni su nuovi servizi e offerte Quootami.',
};

type Utm = Record<string, string>;

export function ListaAttesaLuceGas() {
  const [fornitura, setFornitura] = useState<string>('');
  const [cap, setCap] = useState('');
  const [fascia, setFascia] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const [cContatto, setCContatto] = useState(false);
  const [cFornitori, setCFornitori] = useState(false);
  const [cMarketing, setCMarketing] = useState(false);

  const [utm, setUtm] = useState<Utm | null>(null);
  const [referrer, setReferrer] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Provenienza raccolta al mount: serve a dire ai fornitori da dove arriva il
  // traffico, ed è l'unico dato di marketing che vale la pena conservare.
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const found: Utm = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
        const v = p.get(k);
        if (v) found[k] = v.slice(0, 120);
      });
      setUtm(Object.keys(found).length ? found : null);
      setReferrer(document.referrer ? document.referrer.slice(0, 500) : null);
    } catch {
      /* niente: la provenienza è un di più, non deve mai bloccare il form */
    }
  }, []);

  function validate() {
    const err: Record<string, string> = {};
    if (!fornitura) err.fornitura = 'Scegli il tipo di fornitura';
    if (!CAP_REGEX.test(cap)) err.cap = 'Il CAP è di 5 cifre';
    if (nome.trim().length < 2) err.nome = 'Inserisci il tuo nome';
    if (!EMAIL_REGEX.test(email)) err.email = 'Email non valida';
    if (telefono.trim() && !PHONE_REGEX.test(telefono.trim())) err.telefono = 'Numero non valido';
    if (!cContatto) err.cContatto = 'Serve il tuo consenso per poterti rispondere';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const { error: rpcErr } = await supabase.rpc('waitlist_submit', {
        p_fornitura: fornitura,
        p_cap: cap,
        p_nome: nome,
        p_email: email,
        p_consenso_contatto: cContatto,
        p_consenso_fornitori: cFornitori,
        p_consenso_marketing: cMarketing,
        p_informativa_versione: INFORMATIVA_VERSIONE,
        p_consensi_versione: CONSENSI_VERSIONE,
        p_spesa_fascia: fascia || null,
        p_telefono: telefono.trim() || null,
        p_utm: utm,
        p_referrer: referrer,
      });
      if (rpcErr) throw rpcErr;
      setSuccess(true);
    } catch {
      setError(
        'Non siamo riusciti a salvare la richiesta. Riprova fra poco, oppure scrivici e ci pensiamo noi.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-8 text-center">
        <h3 className="font-sans font-bold text-xl text-ink">Ci siamo, grazie.</h3>
        <p className="mt-3 text-sm text-ink-muted">
          Ti scriviamo appena il confronto è attivo. Nessuna telefonata a freddo, mai — e se cambi
          idea basta rispondere a una nostra email per essere cancellato.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8">
      <fieldset className="border-0 p-0 m-0">
        <legend className="text-sm font-semibold text-ink">Cosa vuoi confrontare</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FORNITURE.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFornitura(f.value)}
              aria-pressed={fornitura === f.value}
              className={
                fornitura === f.value
                  ? 'px-4 py-2 rounded-full text-sm font-medium bg-ink text-white'
                  : 'px-4 py-2 rounded-full text-sm font-medium border border-black/10 text-ink-muted'
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        {fieldErrors.fornitura && <p className="mt-2 text-xs text-red-600">{fieldErrors.fornitura}</p>}
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">CAP</span>
          <input
            inputMode="numeric"
            maxLength={5}
            value={cap}
            onChange={(e) => setCap(e.target.value.replace(/\D/g, ''))}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            autoComplete="postal-code"
          />
          {fieldErrors.cap && <p className="mt-1 text-xs text-red-600">{fieldErrors.cap}</p>}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink">Quanto spendi al mese</span>
          <select
            value={fascia}
            onChange={(e) => setFascia(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
          >
            <option value="">—</option>
            {FASCE.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink">Nome</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            autoComplete="given-name"
          />
          {fieldErrors.nome && <p className="mt-1 text-xs text-red-600">{fieldErrors.nome}</p>}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            autoComplete="email"
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-ink">
            Telefono <span className="font-normal text-ink-muted">— solo se preferisci che ti chiamiamo noi</span>
          </span>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            autoComplete="tel"
          />
          {fieldErrors.telefono && <p className="mt-1 text-xs text-red-600">{fieldErrors.telefono}</p>}
        </label>
      </div>

      <div className="mt-6 space-y-3 border-t border-black/5 pt-5">
        <label className="flex gap-3 text-xs text-ink-muted">
          <input
            type="checkbox"
            checked={cContatto}
            onChange={(e) => setCContatto(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>{TESTI_CONSENSO.contatto}</span>
        </label>
        {fieldErrors.cContatto && <p className="text-xs text-red-600">{fieldErrors.cContatto}</p>}

        <label className="flex gap-3 text-xs text-ink-muted">
          <input
            type="checkbox"
            checked={cFornitori}
            onChange={(e) => setCFornitori(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>
            {TESTI_CONSENSO.fornitori}{' '}
            <span className="text-ink-muted/80">
              Senza questo consenso possiamo confrontare le offerte per te, ma non possiamo
              chiedere al fornitore di formulartene una.
            </span>
          </span>
        </label>

        <label className="flex gap-3 text-xs text-ink-muted">
          <input
            type="checkbox"
            checked={cMarketing}
            onChange={(e) => setCMarketing(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>{TESTI_CONSENSO.marketing}</span>
        </label>

        <p className="text-xs text-ink-muted pt-1">
          I dati sono trattati come descritto nella{' '}
          <Link href="/privacy" className="underline">informativa privacy</Link> (versione{' '}
          {INFORMATIVA_VERSIONE}). Puoi revocare ogni consenso in qualsiasi momento.
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full sm:w-auto">
        {loading ? 'Invio…' : 'Avvisami quando parte →'}
      </button>
    </form>
  );
}
