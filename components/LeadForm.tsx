'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE, WEB3FORMS } from '@/config/credentials';

/**
 * Quootami — LeadForm universale (client-side, no env vars)
 * ============================================================
 * Flusso identico al vecchio sito statico che funzionava:
 *
 * 1. Salva lead su Supabase via RPC `insert_lead` (anon key + RLS)
 * 2. Carica i 3 file su Supabase Storage privato (anon key)
 * 3. Notifica via Web3Forms (access_key pubblica) con link al
 *    dashboard Supabase per scaricare i documenti
 *
 * Niente Resend, niente env vars, niente service_role.
 * ============================================================
 */

const supabase = createClient(SUPABASE.url, SUPABASE.anonKey, {
  auth: { persistSession: false },
});

type Props = {
  prodotto: string;
  requiresVehicle?: boolean;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = [
  'image/jpeg', 'image/jpg', 'image/png',
  'image/heic', 'image/heif', 'image/webp',
  'application/pdf',
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9 ()\-]{8,18}$/;
const TARGA_REGEX = /^[A-Z0-9]{5,7}$/;

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(2)} MB`;
}

function calcAge(dob: string) {
  const t = new Date();
  const b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
}

export function LeadForm({ prodotto, requiresVehicle = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Invio in corso…');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [targa, setTarga] = useState('');
  const [ciFronte, setCiFronte] = useState<File | null>(null);
  const [ciRetro, setCiRetro] = useState<File | null>(null);
  const [libretto, setLibretto] = useState<File | null>(null);
  const [consenso, setConsenso] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const years = useMemo(() => {
    const cy = new Date().getFullYear();
    return Array.from({ length: 83 }, (_, i) => cy - 18 - i);
  }, []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

  function validate(): boolean {
    const err: Record<string, string> = {};
    if (nome.length < 2) err.nome = 'Nome troppo corto';
    if (cognome.length < 2) err.cognome = 'Cognome troppo corto';
    if (!dobDay || !dobMonth || !dobYear) err.dob = 'Seleziona giorno, mese, anno';
    else {
      const dob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
      const testDate = new Date(parseInt(dobYear), parseInt(dobMonth) - 1, parseInt(dobDay));
      if (testDate.getDate() !== parseInt(dobDay)) err.dob = 'Data non valida';
      else {
        const age = calcAge(dob);
        if (age < 18) err.dob = 'Devi avere almeno 18 anni';
        else if (age > 100) err.dob = 'Data non valida';
      }
    }
    if (!EMAIL_REGEX.test(email)) err.email = 'Email non valida';
    if (!PHONE_REGEX.test(telefono)) err.telefono = 'Telefono non valido (es. +39 333 1234567)';
    if (requiresVehicle && !TARGA_REGEX.test(targa.toUpperCase())) err.targa = 'Targa non valida (es. AB123CD)';
    if (!ciFronte) err.ci_fronte = 'Carica fronte CI';
    if (!ciRetro) err.ci_retro = 'Carica retro CI';
    if (requiresVehicle && !libretto) err.libretto = 'Carica il libretto';
    if (!consenso) err.consenso = 'Devi accettare il trattamento dati';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  function fileHandler(setter: (f: File | null) => void, key: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;
      const err = { ...fieldErrors };
      if (!f) { setter(null); return; }
      if (f.size > MAX_FILE_BYTES) {
        err[key] = `Oltre 10 MB (${fmtBytes(f.size)})`;
        setFieldErrors(err);
        setter(null);
        return;
      }
      if (!ALLOWED_MIME.includes(f.type) && !/\.(jpe?g|png|heic|heif|webp|pdf)$/i.test(f.name)) {
        err[key] = 'Formato non valido';
        setFieldErrors(err);
        setter(null);
        return;
      }
      delete err[key];
      setFieldErrors(err);
      setter(f);
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    setLoadingMsg('Salvataggio dati in corso…');

    const dob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
    const nomeCognome = `${nome} ${cognome}`;
    let leadId: string | null = null;
    const documenti: Record<string, string> = {};

    try {
      // === [1] Insert lead via RPC SECURITY DEFINER ===
      const { data: lead, error: rpcErr } = await supabase.rpc('insert_lead', {
        payload: {
          prodotto,
          nome_cognome: nomeCognome,
          data_nascita: dob,
          email,
          telefono,
          targa: requiresVehicle ? targa.toUpperCase() : null,
          fonte: 'sito web · next',
          pagina: typeof window !== 'undefined' ? window.location.pathname : '',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 255) : '',
        },
      });
      if (rpcErr) throw new Error(`DB: ${rpcErr.message}`);
      leadId = (lead as { id?: string })?.id ?? null;

      // === [2] Upload documenti su Storage privato ===
      setLoadingMsg('Caricamento sicuro dei documenti…');
      const filesToUpload: Array<[string, File | null]> = [
        ['ci_fronte', ciFronte],
        ['ci_retro', ciRetro],
        ...(requiresVehicle ? [['libretto', libretto] as [string, File | null]] : []),
      ];

      const uploads = filesToUpload
        .filter(([, f]) => !!f)
        .map(async ([key, file]) => {
          const ext = (file!.name.split('.').pop() ?? 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
          const path = `leads/${leadId ?? 'noid'}/${key}-${Date.now()}.${ext || 'bin'}`;
          const { error: upErr } = await supabase.storage
            .from(SUPABASE.bucket)
            .upload(path, file!, { contentType: file!.type || 'application/octet-stream' });
          if (!upErr) documenti[key] = path;
        });
      await Promise.all(uploads);

      // === [3] Email a Giacomo via Web3Forms (con link al dashboard) ===
      setLoadingMsg('Notifica al broker in corso…');
      const dashboardLink = leadId
        ? `https://supabase.com/dashboard/project/ivcdwizhkdubjxxrukbs/storage/buckets/${SUPABASE.bucket}?path=leads/${leadId}`
        : 'n/d';

      const fd = new FormData();
      fd.append('access_key', WEB3FORMS.accessKey);
      fd.append('subject', `Nuova richiesta preventivo ${prodotto} — ${nomeCognome}`);
      fd.append('from_name', 'Quootami — sito web');
      fd.append('replyto', email);
      fd.append('Prodotto', prodotto);
      fd.append('Nome', nome);
      fd.append('Cognome', cognome);
      fd.append('Data di nascita', dob);
      fd.append('Email cliente', email);
      fd.append('Telefono', telefono);
      if (requiresVehicle) fd.append('Targa veicolo', targa.toUpperCase());
      fd.append('Lead ID Supabase', leadId ?? 'n/d');
      fd.append('Link dashboard documenti', dashboardLink);
      fd.append('Documenti caricati', Object.keys(documenti).join(', ') || 'nessuno');
      fd.append('Data invio', new Date().toLocaleString('it-IT'));
      fd.append('Pagina di provenienza', typeof window !== 'undefined' ? window.location.pathname : '');

      const w3res = await fetch(WEB3FORMS.submitUrl, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });
      const w3json = await w3res.json().catch(() => ({ success: false }));
      if (!w3res.ok || !w3json.success) {
        // Non blocchiamo: il lead è già salvato su Supabase
        console.warn('[Web3Forms] non success:', w3json);
      }

      setSuccess(true);
    } catch (err) {
      const msg = (err as Error).message || 'Errore di invio';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-prose-wide mx-auto p-8 bg-bg-card border border-brand-green/30 rounded-3xl shadow-brand-md text-center">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="font-sans font-bold text-2xl text-ink mb-2">Richiesta inviata!</h3>
        <p className="text-ink-muted">
          Quootami ti contatterà entro 24 ore lavorative all&apos;email o al telefono indicato.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-prose-wide mx-auto p-8 sm:p-10 bg-bg-card border border-black/5 rounded-3xl shadow-brand-md"
    >
      <Section title="Dati personali">
        <Row>
          <Field id="nome" label="Nome" err={fieldErrors.nome}>
            <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} autoComplete="given-name" className={inputCls} required />
          </Field>
          <Field id="cognome" label="Cognome" err={fieldErrors.cognome}>
            <input type="text" id="cognome" value={cognome} onChange={e => setCognome(e.target.value)} autoComplete="family-name" className={inputCls} required />
          </Field>
        </Row>

        <Field id="dob" label="Data di nascita" err={fieldErrors.dob}>
          <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2">
            <select value={dobDay} onChange={e => setDobDay(e.target.value)} className={selectCls} required aria-label="Giorno">
              <option value="">Giorno</option>
              {days.map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
            </select>
            <select value={dobMonth} onChange={e => setDobMonth(e.target.value)} className={selectCls} required aria-label="Mese">
              <option value="">Mese</option>
              {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <select value={dobYear} onChange={e => setDobYear(e.target.value)} className={selectCls} required aria-label="Anno">
              <option value="">Anno</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </Field>

        <Field id="email" label="Email" err={fieldErrors.email}>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email" className={inputCls} required />
        </Field>

        <Field id="telefono" label="Telefono" err={fieldErrors.telefono}>
          <input type="tel" id="telefono" value={telefono} onChange={e => setTelefono(e.target.value)} autoComplete="tel" placeholder="+39 333 1234567" inputMode="tel" className={inputCls} required />
        </Field>

        {requiresVehicle && (
          <Field id="targa" label="Targa veicolo" err={fieldErrors.targa}>
            <input type="text" id="targa" value={targa} onChange={e => setTarga(e.target.value.toUpperCase())} maxLength={7} placeholder="AB123CD" className={`${inputCls} uppercase`} required />
          </Field>
        )}
      </Section>

      <Section title="Documenti">
        <div className="p-3.5 bg-brand-yellow/8 border-l-4 border-brand-yellow rounded-lg mb-4 text-sm text-ink-soft leading-relaxed">
          🔒 Documenti caricati su archivio cifrato e privato. Solo Quootami può accedervi.<br />
          📱 Da smartphone puoi scattare la foto direttamente al documento.
        </div>

        <FileField id="ci_fronte" label="Carta d'identità — FRONTE" file={ciFronte} onChange={fileHandler(setCiFronte, 'ci_fronte')} err={fieldErrors.ci_fronte} />
        <FileField id="ci_retro" label="Carta d'identità — RETRO" file={ciRetro} onChange={fileHandler(setCiRetro, 'ci_retro')} err={fieldErrors.ci_retro} />
        {requiresVehicle && (
          <FileField id="libretto" label="Libretto di circolazione" file={libretto} onChange={fileHandler(setLibretto, 'libretto')} err={fieldErrors.libretto} />
        )}
      </Section>

      <label className="flex items-start gap-3 mt-6 cursor-pointer text-sm text-ink-soft leading-relaxed">
        <input
          type="checkbox"
          checked={consenso}
          onChange={e => setConsenso(e.target.checked)}
          className="mt-1 w-4 h-4 accent-brand-green-dark"
          required
        />
        <span>
          Acconsento al trattamento dei miei dati personali (compresi documenti d&apos;identità) ai sensi del Reg. UE 2016/679 — GDPR.
          Ho letto la <Link href="/privacy" target="_blank" className="text-brand-green-dark underline">privacy policy</Link>. *
        </span>
      </label>
      {fieldErrors.consenso && <p className="mt-2 text-xs text-red-600">{fieldErrors.consenso}</p>}

      {error && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>Errore:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="mt-5 p-4 bg-bg-alt border border-black/10 rounded-xl text-sm text-ink flex items-center gap-3 justify-center">
          <span className="inline-block w-4 h-4 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
          {loadingMsg}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full mt-6 justify-center disabled:opacity-60 disabled:cursor-wait">
        {loading ? 'Invio in corso…' : 'Invia richiesta →'}
      </button>
      <p className="text-center text-xs text-ink-muted mt-3">
        🔒 Connessione cifrata HTTPS · Documenti su storage privato · Nessun obbligo
      </p>
    </form>
  );
}

/* ── Sub-componenti ── */

const inputCls = 'w-full px-4 py-3 rounded-xl border border-black/10 bg-bg text-sm text-ink outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/30 transition';
const selectCls = `${inputCls} appearance-none cursor-pointer pr-10 bg-no-repeat bg-[right_1rem_center]`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <h3 className="font-sans font-bold text-base text-ink mb-4 mt-6 pt-4 border-t border-black/5 first:mt-0 first:pt-0 first:border-t-0">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">{children}</div>;
}

function Field({ id, label, err, children }: { id: string; label: string; err?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs font-semibold text-ink mb-1.5 tracking-wide">
        {label} *
      </label>
      {children}
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}

function FileField({ id, label, file, onChange, err }: {
  id: string;
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  err?: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs font-semibold text-ink mb-1.5 tracking-wide">
        {label} *
      </label>
      <input
        type="file"
        id={id}
        accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,application/pdf"
        capture="environment"
        onChange={onChange}
        className="block w-full text-sm text-ink p-3 border border-dashed border-black/15 rounded-xl cursor-pointer file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-brand-green hover:file:text-brand-navy transition-all"
        required
      />
      <p className="mt-1.5 text-xs text-ink-muted">
        {file ? `✓ ${file.name} · ${fmtBytes(file.size)}` : 'Nessun file selezionato'}
      </p>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}
