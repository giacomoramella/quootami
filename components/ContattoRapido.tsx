'use client';

/**
 * Quootami — Contatto rapido dalla sezione omnicanale della home.
 * ============================================================
 * Prima le icone WhatsApp ed Email erano link secchi (`wa.me` e `mailto:`):
 * aprivano l'app a foglio bianco e la richiesta la doveva scrivere l'utente,
 * che nella maggior parte dei casi chiudeva e se ne andava.
 *
 * Ora aprono un modulo di tre campi. All'invio:
 *   • WhatsApp → si apre la chat con il messaggio GIÀ SCRITTO. La finestra va
 *     aperta in modo sincrono dentro l'handler, prima di qualunque `await`:
 *     dopo una promise il browser considera l'apertura non più originata dal
 *     click e la blocca come popup.
 *   • Email → invia dal sito, senza aprire nessun client di posta.
 * In entrambi i casi il lead viene archiviato e notificato al broker, così la
 * richiesta resta anche se l'utente non preme "invia" dentro WhatsApp.
 *
 * Invio identico a PreventivoForm (nessun endpoint nuovo, CSP invariata):
 *   1. Supabase via RPC `insert_lead` — best-effort, non blocca.
 *   2. Web3Forms → giacomo.rp@sistoassicurazioni.com — canale critico.
 * Il telefono resta un link `tel:` diretto: lì non c'è nulla da precompilare.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { SUPABASE, WEB3FORMS } from '@/config/credentials';
import { OPERATORE } from '@/config/operatore';
import { trackLead } from '@/lib/tracking';

const SUPABASE_HEADERS = {
  apikey: SUPABASE.anonKey,
  Authorization: `Bearer ${SUPABASE.anonKey}`,
  'Content-Type': 'application/json',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9 ()\-]{8,18}$/;
const CAP_REGEX = /^\d{5}$/;

const ALTRO = 'Non lo so ancora';

type Canale = 'whatsapp' | 'email';

export function ContattoRapido({ aree }: { aree: string[] }) {
  const [canale, setCanale] = useState<Canale | null>(null);

  return (
    <section className="section bg-bg">
      <div className="container-content text-center">
        <span className="eyebrow">Siamo sempre con te</span>
        <h2 className="section-title">
          Il tuo <span className="hl">phygital partner.</span>
        </h2>
        <p className="section-sub mx-auto">
          Scegli il canale che preferisci: bastano tre campi e la richiesta parte già scritta.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-10 sm:gap-14">
          <OmniBottone label="WhatsApp" color="green" onClick={() => setCanale('whatsapp')}>
            <WhatsAppIcon />
          </OmniBottone>
          <OmniBottone label="Email" color="yellow" onClick={() => setCanale('email')}>
            <EmailIcon />
          </OmniBottone>
          <OmniLink
            href={`tel:${OPERATORE.contatti.telefono_tel}`}
            label="Telefono"
            color="navy"
          >
            <PhoneIcon />
          </OmniLink>
        </div>

        <p className="mt-8 text-sm text-ink-muted">
          {OPERATORE.contatti.orari} · Risposta entro 24 ore lavorative
        </p>
      </div>

      {canale && (
        <ModaleContatto canale={canale} aree={aree} onClose={() => setCanale(null)} />
      )}
    </section>
  );
}

/* ─────────────────────────── Modale ─────────────────────────── */

function ModaleContatto({
  canale,
  aree,
  onClose,
}: {
  canale: Canale;
  aree: string[];
  onClose: () => void;
}) {
  const isWa = canale === 'whatsapp';
  const uid = useId();
  const primoCampo = useRef<HTMLInputElement>(null);
  const pannello = useRef<HTMLDivElement>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [area, setArea] = useState('');
  const [cap, setCap] = useState('');
  const [messaggio, setMessaggio] = useState('');
  const [consenso, setConsenso] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});

  // Chiusura con Esc + blocco dello scorrimento sotto la modale.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const overflowPrec = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    primoCampo.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowPrec;
    };
  }, [onClose]);

  /** Il focus non deve poter uscire dalla modale con Tab finché è aperta. */
  const onKeyDownPannello = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !pannello.current) return;
    const focusabili = pannello.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusabili.length === 0) return;
    const primo = focusabili[0];
    const ultimo = focusabili[focusabili.length - 1];
    if (e.shiftKey && document.activeElement === primo) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primo.focus();
    }
  }, []);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (nome.trim().length < 2) e.nome = 'Inserisci il tuo nome';
    if (!area) e.area = 'Scegli di cosa hai bisogno';
    if (cap.trim() && !CAP_REGEX.test(cap.trim())) e.cap = 'Il CAP è composto da 5 cifre';
    if (!isWa) {
      if (!EMAIL_REGEX.test(email.trim())) e.email = 'Email non valida';
      if (telefono.trim() && !PHONE_REGEX.test(telefono.trim()))
        e.telefono = 'Telefono non valido (es. +39 333 1234567)';
    }
    if (!consenso) e.consenso = 'Devi accettare il trattamento dati';
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  /** Il testo che l'utente si ritrova già scritto nella chat WhatsApp. */
  function componiMessaggio(): string {
    const righe = [
      `Ciao Quootami, sono ${nome.trim()}.`,
      `Mi serve: ${area}.`,
    ];
    if (cap.trim()) righe.push(`CAP: ${cap.trim()}`);
    if (messaggio.trim()) righe.push('', messaggio.trim());
    return righe.join('\n');
  }

  async function archivia(testo: string) {
    // [1] Archivio — best-effort: se fallisce resta la notifica al broker.
    try {
      await fetch(`${SUPABASE.url}/rest/v1/rpc/insert_lead`, {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify({
          payload: {
            prodotto: area,
            nome_cognome: nome.trim(),
            email: isWa ? null : email.trim(),
            telefono: isWa ? null : telefono.trim() || null,
            cap: cap.trim() || null,
            messaggio: testo,
            fonte: isWa ? 'sito web · contatto rapido WhatsApp' : 'sito web · contatto rapido email',
            pagina: typeof window !== 'undefined' ? window.location.pathname : '',
            user_agent:
              typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 255) : '',
          },
        }),
      });
    } catch (dbErr) {
      console.warn('[contatto rapido] insert_lead non riuscito, proseguo:', dbErr);
    }

    // [2] Notifica al broker.
    const fd = new FormData();
    fd.append('access_key', WEB3FORMS.accessKey);
    fd.append(
      'subject',
      `${isWa ? 'Contatto WhatsApp' : 'Nuovo contatto dal sito'} — ${nome.trim()} · ${area}`,
    );
    fd.append('from_name', 'Quootami — sito web');
    if (!isWa) fd.append('replyto', email.trim());
    fd.append('Canale', isWa ? 'WhatsApp (chat aperta dall utente)' : 'Email');
    fd.append('Nome', nome.trim());
    fd.append('Di cosa ha bisogno', area);
    fd.append('Email', isWa ? 'non richiesta (arriva da WhatsApp)' : email.trim());
    fd.append('Telefono', isWa ? 'arriva da WhatsApp' : telefono.trim() || 'non indicato');
    fd.append('CAP', cap.trim() || 'non indicato');
    fd.append('Messaggio', messaggio.trim() || 'nessuno');
    fd.append('Data invio', new Date().toLocaleString('it-IT'));

    const res = await fetch(WEB3FORMS.submitUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fd,
    });
    const json = await res.json().catch(() => ({ success: false }));
    if (!res.ok || !json.success) throw new Error('notifica non riuscita');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    const testo = componiMessaggio();

    // WhatsApp: la finestra si apre QUI, prima di ogni await. Rimandarla dopo
    // le fetch la farebbe classificare come popup e bloccare dal browser.
    let url: string | null = null;
    if (isWa) {
      url = `https://wa.me/${OPERATORE.contatti.telefono_wa}?text=${encodeURIComponent(testo)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setWaUrl(url);
    }

    setLoading(true);
    try {
      await archivia(testo);
      trackLead(area);
      setSuccess(true);
    } catch {
      if (isWa) {
        // La chat è già aperta: la richiesta parte comunque, il broker la vede
        // arrivare su WhatsApp. Nessun motivo di allarmare l'utente.
        trackLead(area);
        setSuccess(true);
      } else {
        setError('Invio non riuscito. Riprova, oppure scrivici su WhatsApp.');
      }
    } finally {
      setLoading(false);
    }
  }

  const titolo = isWa ? 'Scrivi su WhatsApp' : 'Scrivi una email';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-ink/50 backdrop-blur-sm"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={pannello}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-titolo`}
        onKeyDown={onKeyDownPannello}
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-bg-card shadow-brand-lg p-6 sm:p-8 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id={`${uid}-titolo`} className="font-sans font-bold text-xl text-ink">
            {success ? 'Fatto.' : titolo}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="w-9 h-9 -mt-1 -mr-1 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-bg-alt transition-colors"
          >
            <span aria-hidden className="text-xl leading-none">×</span>
          </button>
        </div>

        {success ? (
          <div className="mt-4">
            <p className="text-ink-muted leading-relaxed">
              {isWa ? (
                <>
                  WhatsApp si è aperto con il messaggio già scritto: controlla che sia tutto giusto
                  e premi invia. Quootami risponde entro 24 ore lavorative.
                </>
              ) : (
                <>
                  La richiesta è arrivata. Quootami ti ricontatta entro 24 ore lavorative
                  all&apos;indirizzo che hai indicato.
                </>
              )}
            </p>
            {isWa && waUrl && (
              <p className="mt-4 text-sm text-ink-muted">
                Non si è aperto niente?{' '}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-green-dark underline underline-offset-2 hover:text-ink"
                >
                  Apri la chat a mano
                </a>
                .
              </p>
            )}
            <button type="button" onClick={onClose} className="btn-primary w-full mt-6 justify-center">
              Chiudi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-1">
            <p className="text-sm text-ink-muted leading-relaxed">
              {isWa
                ? 'Tre campi e la chat si apre con il messaggio già pronto: niente foglio bianco.'
                : 'Tre campi e la richiesta parte da qui, senza aprire il programma di posta.'}
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Etichetta htmlFor={`${uid}-nome`} label="Nome" required />
                <input
                  ref={primoCampo}
                  id={`${uid}-nome`}
                  type="text"
                  autoComplete="name"
                  value={nome}
                  onChange={ev => setNome(ev.target.value)}
                  className={inputCls}
                  required
                />
                {errs.nome && <Errore msg={errs.nome} />}
              </div>

              {!isWa && (
                <>
                  <div>
                    <Etichetta htmlFor={`${uid}-email`} label="Email" required />
                    <input
                      id={`${uid}-email`}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={ev => setEmail(ev.target.value)}
                      className={inputCls}
                      required
                    />
                    {errs.email && <Errore msg={errs.email} />}
                  </div>
                  <div>
                    <Etichetta htmlFor={`${uid}-tel`} label="Telefono" />
                    <input
                      id={`${uid}-tel`}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+39 333 1234567"
                      value={telefono}
                      onChange={ev => setTelefono(ev.target.value)}
                      className={inputCls}
                    />
                    {errs.telefono && <Errore msg={errs.telefono} />}
                  </div>
                </>
              )}

              <div className={isWa ? 'sm:col-span-2' : 'sm:col-span-2'}>
                <Etichetta htmlFor={`${uid}-area`} label="Di cosa hai bisogno" required />
                <select
                  id={`${uid}-area`}
                  value={area}
                  onChange={ev => setArea(ev.target.value)}
                  className={inputCls}
                  required
                >
                  <option value="">Scegli…</option>
                  {aree.map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                  <option value={ALTRO}>{ALTRO}</option>
                </select>
                {errs.area && <Errore msg={errs.area} />}
              </div>

              <div>
                <Etichetta htmlFor={`${uid}-cap`} label="CAP" />
                <input
                  id={`${uid}-cap`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="13900"
                  maxLength={5}
                  value={cap}
                  onChange={ev => setCap(ev.target.value)}
                  className={inputCls}
                />
                {errs.cap ? (
                  <Errore msg={errs.cap} />
                ) : (
                  <p className="mt-1 text-xs text-ink-muted">Su auto e casa il premio dipende dalla zona.</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Etichetta htmlFor={`${uid}-msg`} label="Messaggio" />
                <textarea
                  id={`${uid}-msg`}
                  rows={3}
                  value={messaggio}
                  onChange={ev => setMessaggio(ev.target.value)}
                  placeholder="Facoltativo: qualche dettaglio in più."
                  className={`${inputCls} resize-y`}
                />
              </div>
            </div>

            {/* Consenso GDPR — obbligatorio su ogni modulo del sito */}
            <label className="mt-5 flex items-start gap-3 text-sm text-ink-muted leading-relaxed">
              <input
                type="checkbox"
                checked={consenso}
                onChange={ev => setConsenso(ev.target.checked)}
                className="mt-1 w-4 h-4 accent-brand-green flex-shrink-0"
                required
              />
              <span>
                Acconsento al trattamento dei miei dati per essere ricontattato. Il titolare del
                trattamento è indicato nell&apos;{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
                  Informativa privacy
                </Link>
                ; i dati non vengono ceduti a terzi.
              </span>
            </label>
            {errs.consenso && <Errore msg={errs.consenso} />}

            {error && (
              <p role="alert" className="mt-4 text-sm font-semibold" style={{ color: '#B23A17' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 justify-center disabled:opacity-60"
            >
              {loading
                ? 'Invio in corso…'
                : isWa
                  ? 'Apri WhatsApp con il messaggio →'
                  : 'Invia la richiesta →'}
            </button>
            <p className="mt-4 text-xs text-ink-muted text-center">
              Connessione cifrata · Nessun costo · Nessun impegno
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── Sotto-componenti ─────────────────────── */

// text-base (16px) e NON text-sm: sotto i 16px iOS Safari zooma al focus e
// lascia la pagina zoomata, con scorrimento orizzontale.
const inputCls =
  'w-full rounded-xl border border-ink/15 bg-bg px-4 py-2.5 text-base text-ink placeholder:text-ink-muted focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30';

const OMNI_COLORS = {
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-700',
  navy: 'bg-gray-100 text-brand-navy',
} as const;

type OmniColor = keyof typeof OMNI_COLORS;

const omniWrap =
  'flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform duration-200 ease-soft';
const omniBadge =
  'w-[72px] h-[72px] rounded-full flex items-center justify-center transition-shadow';

function OmniBottone({
  label,
  color,
  onClick,
  children,
}: {
  label: string;
  color: OmniColor;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={omniWrap} aria-label={`${label} — apri il modulo di contatto`}>
      <span className={`${omniBadge} ${OMNI_COLORS[color]}`}>{children}</span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </button>
  );
}

function OmniLink({
  href,
  label,
  color,
  children,
}: {
  href: string;
  label: string;
  color: OmniColor;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={omniWrap} aria-label={label}>
      <span className={`${omniBadge} ${OMNI_COLORS[color]}`}>{children}</span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </a>
  );
}

function Etichetta({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink mb-1.5">
      {label}
      {required && <span className="text-brand-green-dark"> *</span>}
    </label>
  );
}

function Errore({ msg }: { msg: string }) {
  return (
    <p role="alert" className="mt-1 text-xs font-semibold" style={{ color: '#B23A17' }}>
      {msg}
    </p>
  );
}

/* ── Icone SVG inline (nessun HTTP in più) ── */

function WhatsAppIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
