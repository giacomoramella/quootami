'use client';

/**
 * Quootami — Form "preventivo rapido" per pagina prodotto.
 * ============================================================
 * Campi contatto comuni (Nome, Email, Telefono) + campi specifici del prodotto
 * (guidati da config/preventivo.ts) + consenso GDPR obbligatorio.
 *
 * Invio (via fetch, nessun endpoint nuovo — CSP form-action 'self' rispettata):
 *   1. Archivia su Supabase via RPC `insert_lead` (best-effort: i campi
 *      specifici finiscono in `messaggio`).
 *   2. Notifica il broker via Web3Forms (ogni campo su riga propria) →
 *      giacomo.rp@sistoassicurazioni.com. Questo è il canale critico.
 *
 * Niente upload documenti: è un preventivo rapido, non un'adesione.
 */

import { useState } from 'react';
import Link from 'next/link';
import { SUPABASE, WEB3FORMS } from '@/config/credentials';
import { OPERATORE } from '@/config/operatore';
import { getPreventivoFields, getPreventivoAllegato, type PreventivoField } from '@/config/preventivo';
import { trackLead } from '@/lib/tracking';
import type { Polizza } from '@/config/polizze';

/**
 * NIENTE @supabase/supabase-js qui: importarlo per una sola RPC costava
 * ~63 KB gzip su tutte le pagine prodotto (trascina realtime, auth e storage).
 * PostgREST si chiama benissimo con fetch — stesso approccio di ComparatoreLuce.
 */
const SUPABASE_HEADERS = {
  apikey: SUPABASE.anonKey,
  Authorization: `Bearer ${SUPABASE.anonKey}`,
  'Content-Type': 'application/json',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9 ()\-]{8,18}$/;
const CAP_REGEX = /^\d{5}$/;

/** Stessi limiti del bucket `documenti-lead` (vedi supabase/schema.sql). */
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const TIPI_AMMESSI = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];

/** Ref del progetto Supabase, per comporre il link al file nel dashboard. */
const PROJECT_REF = SUPABASE.url.replace(/^https?:\/\//, '').split('.')[0];

type Valore = string | string[];
type Modo = 'dati' | 'allegato';

export function PreventivoForm({ polizza }: { polizza: Polizza }) {
  const campi = getPreventivoFields(polizza.slug);
  const allegato = getPreventivoAllegato(polizza.slug);

  const [modo, setModo] = useState<Modo>('dati');
  const [file, setFile] = useState<File | null>(null);
  const conAllegato = modo === 'allegato';

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dati, setDati] = useState<Record<string, Valore>>({});
  const [consenso, setConsenso] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function setCampo(name: string, v: Valore) {
    setDati(prev => ({ ...prev, [name]: v }));
  }

  function toggleCheckbox(name: string, opt: string) {
    setDati(prev => {
      const cur = Array.isArray(prev[name]) ? (prev[name] as string[]) : [];
      const next = cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt];
      return { ...prev, [name]: next };
    });
  }

  function valoreLeggibile(v: Valore | undefined): string {
    if (Array.isArray(v)) return v.join(', ');
    return (v ?? '').toString().trim();
  }

  function validate(): boolean {
    const err: Record<string, string> = {};
    if (!EMAIL_REGEX.test(email)) err.email = 'Email non valida';
    if (!PHONE_REGEX.test(telefono)) err.telefono = 'Telefono non valido (es. +39 333 1234567)';

    if (conAllegato) {
      // Con la visura allegata i dati anagrafici arrivano dal documento: si
      // chiedono solo recapiti, CAP e file.
      if (!CAP_REGEX.test(valoreLeggibile(dati.cap))) err.cap = 'Il CAP è composto da 5 cifre';
      if (!file) err.file = 'Allega la visura camerale';
    } else {
      if (nome.trim().length < 2) err.nome = 'Inserisci il tuo nome';
      for (const c of campi) {
        const valore = valoreLeggibile(dati[c.name]);
        if (c.required && !valore) {
          err[c.name] = 'Campo obbligatorio';
        } else if (c.pattern && valore && !new RegExp(c.pattern).test(valore)) {
          // Il formato si controlla solo se il campo è compilato: un facoltativo
          // lasciato vuoto resta valido.
          err[c.name] = c.patternMessage ?? 'Formato non valido';
        }
      }
    }

    if (!consenso) err.consenso = 'Devi accettare il trattamento dati';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFieldErrors(prev => ({ ...prev, file: '' }));
    if (!f) return setFile(null);
    if (!TIPI_AMMESSI.includes(f.type)) {
      setFieldErrors(prev => ({ ...prev, file: 'Formati ammessi: PDF, JPG, PNG, HEIC, WEBP' }));
      return setFile(null);
    }
    if (f.size > MAX_FILE_BYTES) {
      setFieldErrors(prev => ({ ...prev, file: 'Il file supera i 10 MB' }));
      return setFile(null);
    }
    setFile(f);
  }

  /**
   * Carica la visura nel bucket privato e restituisce il percorso.
   * Il file non viaggia mai per email: nella notifica finisce solo il link al
   * dashboard, che richiede l'accesso al progetto Supabase.
   */
  async function caricaVisura(f: File, cartella: string): Promise<string> {
    const ext = (f.name.split('.').pop() ?? 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `leads/${cartella}/visura.${ext}`;
    const res = await fetch(`${SUPABASE.url}/storage/v1/object/${SUPABASE.bucket}/${path}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE.anonKey,
        Authorization: `Bearer ${SUPABASE.anonKey}`,
        'Content-Type': f.type || 'application/octet-stream',
      },
      body: f,
    });
    if (!res.ok) throw new Error('Caricamento della visura non riuscito. Riprova o scrivici su WhatsApp.');
    return path;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);

    // Serializza i campi specifici in righe leggibili
    const righe = conAllegato
      ? [{ label: 'CAP di residenza', val: valoreLeggibile(dati.cap) }]
      : campi
          .map(c => ({ label: c.label, val: valoreLeggibile(dati[c.name]) }))
          .filter(r => r.val);

    // Senza nome (percorso con allegato) l'oggetto della mail userebbe una
    // stringa vuota: meglio dirlo esplicitamente.
    const riferimento = nome.trim() || 'visura allegata';

    try {
      // [0] La visura va caricata prima: se fallisce non ha senso notificare
      // una richiesta a cui manca il documento su cui si basa.
      if (conAllegato && file) {
        const cartella =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now());
        const path = await caricaVisura(file, cartella);
        righe.push({ label: 'Visura camerale', val: `${file.name} (${Math.round(file.size / 1024)} KB)` });
        righe.push({ label: 'Percorso del file', val: path });
        righe.push({
          label: 'Apri su Supabase',
          val: `https://supabase.com/dashboard/project/${PROJECT_REF}/storage/buckets/${SUPABASE.bucket}?path=${encodeURIComponent(`leads/${cartella}`)}`,
        });
      }

      const messaggio = righe.map(r => `${r.label}: ${r.val}`).join('\n');

      // [1] Archivio Supabase — best-effort (non blocca la notifica)
      try {
        await fetch(`${SUPABASE.url}/rest/v1/rpc/insert_lead`, {
          method: 'POST',
          headers: SUPABASE_HEADERS,
          body: JSON.stringify({
            payload: {
              prodotto: polizza.title,
              nome_cognome: nome.trim(),
              email: email.trim(),
              telefono: telefono.trim(),
              messaggio,
              fonte: 'sito web · preventivo',
              pagina: typeof window !== 'undefined' ? window.location.pathname : '',
              user_agent:
                typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 255) : '',
            },
          }),
        });
      } catch (dbErr) {
        console.warn('[preventivo] insert_lead non riuscito, proseguo con la notifica:', dbErr);
      }

      // [2] Notifica al broker — canale critico
      const fd = new FormData();
      fd.append('access_key', WEB3FORMS.accessKey);
      fd.append('subject', `Nuova richiesta preventivo ${polizza.title} — ${riferimento}`);
      fd.append('from_name', 'Quootami — sito web');
      fd.append('replyto', email.trim());
      fd.append('Prodotto', polizza.title);
      fd.append('Nome', riferimento);
      fd.append('Email', email.trim());
      fd.append('Telefono', telefono.trim());
      for (const r of righe) fd.append(r.label, r.val);
      fd.append('Data invio', new Date().toLocaleString('it-IT'));
      fd.append('Pagina di provenienza', typeof window !== 'undefined' ? window.location.pathname : '');

      const res = await fetch(WEB3FORMS.submitUrl, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });
      const json = await res.json().catch(() => ({ success: false }));
      if (!res.ok || !json.success) {
        throw new Error('Invio non riuscito. Riprova o scrivici su WhatsApp.');
      }

      setSuccess(true);
      trackLead(polizza.title); // conversione: GA4 generate_lead + Meta Pixel Lead (solo con consenso)
    } catch (err) {
      setError((err as Error).message || 'Errore di invio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="preventivo" className="section bg-bg">
      <div className="container-content">
        <div className="text-center mb-10">
          <span className="eyebrow">Richiedi un preventivo</span>
          <h2 className="section-title">
            Preventivo <span className="hl">gratuito.</span>
          </h2>
          <p className="section-sub mx-auto">
            Lascia i tuoi dati per <strong>{polizza.title.toLowerCase()}</strong>: Quootami confronta
            le compagnie partner e ti ricontatta una persona vera entro 24 ore. Nessun costo, nessun impegno.
          </p>
        </div>

        {success ? (
          <div className="max-w-2xl mx-auto rounded-3xl bg-bg-card border border-brand-green/30 shadow-brand-md p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-green/15 flex items-center justify-center text-brand-green-dark text-2xl font-bold">✓</div>
            <h3 className="mt-4 font-sans font-bold text-2xl text-ink">Richiesta inviata!</h3>
            <p className="mt-2 text-ink-muted">
              Quootami ti ricontatta entro 24 ore lavorative all&apos;email o al telefono indicato.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto rounded-3xl bg-bg-card border border-black/5 shadow-brand-md p-6 sm:p-8 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-ink mb-5">Preventivo rapido</p>

            {/* Scelta del percorso: compilare i dati oppure allegare la visura,
                che quei dati li contiene già. */}
            {allegato && (
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-2 p-1 rounded-2xl bg-bg-alt">
                  <BottoneModo attivo={!conAllegato} onClick={() => setModo('dati')}>
                    Compila i dati
                  </BottoneModo>
                  <BottoneModo attivo={conAllegato} onClick={() => setModo('allegato')}>
                    {allegato.etichetta}
                  </BottoneModo>
                </div>
                {conAllegato && (
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed">{allegato.descrizione}</p>
                )}
              </div>
            )}

            {/* Percorso con allegato: CAP e file, il resto arriva dalla visura */}
            {conAllegato && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Etichetta htmlFor="pv-cap" label="CAP di residenza" required />
                  <input id="pv-cap" name="cap" type="text" inputMode="numeric" placeholder="13900"
                    value={valoreLeggibile(dati.cap)} onChange={e => setCampo('cap', e.target.value)}
                    className={inputCls} required />
                  {fieldErrors.cap && <Errore msg={fieldErrors.cap} />}
                </div>
                <div className="sm:col-span-2">
                  <Etichetta htmlFor="pv-visura" label="Visura camerale" required />
                  <input id="pv-visura" name="visura" type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.webp"
                    onChange={onFileChange}
                    className="w-full text-sm text-ink-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-ink hover:file:bg-brand-yellow-deep file:cursor-pointer" />
                  {file && <p className="mt-2 text-xs text-ink-muted">{file.name} · {Math.round(file.size / 1024)} KB</p>}
                  <p className="mt-2 text-xs text-ink-muted">PDF o foto, massimo 10 MB. Il file viene caricato su archivio privato, non allegato a un&apos;email.</p>
                  {fieldErrors.file && <Errore msg={fieldErrors.file} />}
                </div>
              </div>
            )}

            {/* Campi specifici del prodotto */}
            {!conAllegato && campi.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {campi.map(c => (
                  <div key={c.name} className={c.full ? 'sm:col-span-2' : undefined}>
                    <CampoDinamico
                      campo={c}
                      value={dati[c.name]}
                      onText={v => setCampo(c.name, v)}
                      onToggle={opt => toggleCheckbox(c.name, opt)}
                      err={fieldErrors[c.name]}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Contatti */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${campi.length > 0 || conAllegato ? 'mt-4 pt-5 border-t border-black/5' : ''}`}>
              {/* Con la visura allegata il nominativo è già nel documento */}
              {!conAllegato && (
                <div className="sm:col-span-2">
                  <Etichetta htmlFor="pv-nome" label="Nome e cognome" required />
                  <input id="pv-nome" name="nome" type="text" autoComplete="name" value={nome}
                    onChange={e => setNome(e.target.value)} className={inputCls} required />
                  {fieldErrors.nome && <Errore msg={fieldErrors.nome} />}
                </div>
              )}
              <div>
                <Etichetta htmlFor="pv-email" label="Email" required />
                <input id="pv-email" name="email" type="email" autoComplete="email" inputMode="email" value={email}
                  onChange={e => setEmail(e.target.value)} className={inputCls} required />
                {fieldErrors.email && <Errore msg={fieldErrors.email} />}
              </div>
              <div>
                <Etichetta htmlFor="pv-tel" label="Telefono" required />
                <input id="pv-tel" name="telefono" type="tel" autoComplete="tel" inputMode="tel" placeholder="+39 333 1234567"
                  value={telefono} onChange={e => setTelefono(e.target.value)} className={inputCls} required />
                {fieldErrors.telefono && <Errore msg={fieldErrors.telefono} />}
              </div>
            </div>

            {/* Consenso GDPR */}
            <label className="mt-6 flex items-start gap-3 text-sm text-ink-muted leading-relaxed">
              <input type="checkbox" name="consenso" checked={consenso} onChange={e => setConsenso(e.target.checked)}
                className="mt-1 w-4 h-4 accent-brand-green flex-shrink-0" required />
              <span>
                Acconsento al trattamento dei miei dati per essere ricontattato con un preventivo.
                Il titolare del trattamento è indicato nell&apos;{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">Informativa privacy</Link>;
                i dati non vengono ceduti a terzi.
              </span>
            </label>
            {fieldErrors.consenso && <Errore msg={fieldErrors.consenso} />}

            {error && (
              <p role="alert" className="mt-4 text-sm font-semibold" style={{ color: '#B23A17' }}>{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 justify-center disabled:opacity-60">
              {loading ? 'Invio in corso…' : 'Richiedi il preventivo →'}
            </button>
            <p className="mt-4 text-xs text-ink-muted text-center">
              Connessione cifrata · Nessun costo · Nessun impegno
            </p>
          </form>
        )}

        {/* Alternativa: contatto diretto */}
        {!success && (
          <p className="mt-8 text-center text-sm text-ink-muted">
            Preferisci parlarne subito?{' '}
            <a href={OPERATORE.social.whatsapp} target="_blank" rel="noopener noreferrer"
              className="font-semibold text-brand-green-dark underline underline-offset-2 hover:text-ink">
              Scrivi su WhatsApp
            </a>{' '}
            oppure{' '}
            <a href={`tel:${OPERATORE.contatti.telefono_tel}`}
              className="font-semibold text-brand-green-dark underline underline-offset-2 hover:text-ink">
              chiama Quootami
            </a>.
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Sotto-componenti ── */

// text-base (16px) e NON text-sm: sotto i 16px iOS Safari zooma al focus e
// lascia la pagina zoomata, con scorrimento orizzontale.
const inputCls = 'w-full rounded-xl border border-ink/15 bg-bg px-4 py-2.5 text-base text-ink placeholder:text-ink-muted focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30';

/** Selettore fra i due percorsi del form. `type="button"` per non inviarlo. */
function BottoneModo({ attivo, onClick, children }: {
  attivo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={attivo}
      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        attivo ? 'bg-bg-card text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function Etichetta({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink mb-1.5">
      {label}{required && <span className="text-brand-green-dark"> *</span>}
    </label>
  );
}

/**
 * Messaggio di errore di campo: annunciato agli screen reader (role="alert") e
 * con colore che supera il contrasto AA su fondo chiaro (#B23A17 ≈ 5.3:1;
 * il coral #E76F51 del brand si fermava a 3.09:1).
 */
function Errore({ msg, id }: { msg: string; id?: string }) {
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-semibold" style={{ color: '#B23A17' }}>
      {msg}
    </p>
  );
}

function CampoDinamico({ campo, value, onText, onToggle, err }: {
  campo: PreventivoField;
  value: Valore | undefined;
  onText: (v: string) => void;
  onToggle: (opt: string) => void;
  err?: string;
}) {
  const id = `pv-${campo.name}`;
  const strVal = typeof value === 'string' ? value : '';
  const arrVal = Array.isArray(value) ? value : [];

  if (campo.type === 'checkboxes') {
    return (
      <fieldset>
        <legend className="block text-sm font-semibold text-ink mb-1.5">
          {campo.label}{campo.required && <span className="text-brand-green-dark"> *</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {(campo.options ?? []).map(opt => {
            const on = arrVal.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                onClick={() => onToggle(opt)}
                aria-pressed={on}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  on
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'bg-bg text-ink border-ink/15 hover:border-brand-green/60'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {err && <Errore msg={err} />}
      </fieldset>
    );
  }

  if (campo.type === 'select') {
    return (
      <div>
        <Etichetta htmlFor={id} label={campo.label} required={campo.required} />
        <select id={id} name={campo.name} value={strVal} onChange={e => onText(e.target.value)}
          className={inputCls} required={campo.required}>
          <option value="" disabled>Seleziona…</option>
          {(campo.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {err && <Errore msg={err} />}
      </div>
    );
  }

  // text | number
  return (
    <div>
      <Etichetta htmlFor={id} label={campo.label} required={campo.required} />
      <div className="relative">
        <input
          id={id}
          name={campo.name}
          type={campo.type === 'number' ? 'number' : 'text'}
          inputMode={campo.type === 'number' ? 'numeric' : undefined}
          min={campo.type === 'number' ? 0 : undefined}
          placeholder={campo.placeholder}
          value={strVal}
          onChange={e => onText(e.target.value)}
          className={`${inputCls} ${campo.suffix ? 'pr-12' : ''}`}
          required={campo.required}
        />
        {campo.suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted">{campo.suffix}</span>
        )}
      </div>
      {err && <Errore msg={err} />}
    </div>
  );
}
