'use client';

/**
 * Form di richiesta stima previdenziale — pagina Fondo Pensione.
 * Sostituisce la CTA di adesione Allianz (che è un flusso a sé, diretto ad
 * Allianz Previdenza). Qui si raccoglie un profilo previdenziale semplice e si
 * invia al broker via Web3Forms (stesso canale degli altri form del sito).
 *
 * GDPR (CLAUDE.md §7): consenso obbligatorio, link alla privacy, spiegazione
 * di dove vanno i dati. Invio via fetch a Web3Forms (connect-src già whitelisted
 * in CSP); nessun dato in URL, nessun tracciamento nuovo.
 *
 * NOTA: il campo "Crescita retributiva" ha opzioni indicative — da confermare.
 */

import { useState } from 'react';
import Link from 'next/link';
import { WEB3FORMS } from '@/config/credentials';

const CRESCITA = ['Nessuna (stipendio stabile)', 'Bassa (~1% l\'anno)', 'Media (~2% l\'anno)', 'Alta (~3% l\'anno)'];

export function PensioneRichiestaForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!data.get('consenso')) {
      setError('Per inviare la richiesta è necessario il consenso al trattamento dei dati.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('access_key', WEB3FORMS.accessKey);
      fd.append('subject', `Richiesta stima previdenziale — ${data.get('nome') || 'sito'}`);
      fd.append('from_name', 'Quootami — sito web');
      fd.append('replyto', String(data.get('email') || ''));
      fd.append('Nome e cognome', String(data.get('nome') || ''));
      fd.append('Email', String(data.get('email') || ''));
      fd.append('Telefono', String(data.get('telefono') || ''));
      fd.append('Data di nascita', String(data.get('nascita') || ''));
      fd.append('Sesso', String(data.get('sesso') || ''));
      fd.append('Anni di servizio', String(data.get('anni_servizio') || ''));
      fd.append('Tipo di lavoratore', String(data.get('lavoratore') || ''));
      fd.append('Reddito annuo lordo', String(data.get('reddito') || ''));
      fd.append('Crescita retributiva', String(data.get('crescita') || ''));
      fd.append('Data invio', new Date().toLocaleString('it-IT'));
      fd.append('Pagina di provenienza', typeof window !== 'undefined' ? window.location.pathname : '');

      const res = await fetch(WEB3FORMS.submitUrl, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });
      const json = await res.json().catch(() => ({ success: false }));
      if (!res.ok || !json.success) throw new Error('Invio non riuscito. Riprova o scrivici su WhatsApp.');
      setSuccess(true);
      form.reset();
    } catch (err) {
      setError((err as Error).message || 'Errore di invio.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-bg-card border border-brand-green/30 shadow-brand-md p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-brand-green/15 flex items-center justify-center text-brand-green-dark text-2xl font-bold">✓</div>
        <h3 className="mt-4 font-sans font-bold text-2xl text-ink">Richiesta inviata!</h3>
        <p className="mt-2 text-ink-muted">
          Quootami elabora una stima sul tuo profilo e ti ricontatta entro 24 ore lavorative
          all&apos;email o al telefono indicato.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto rounded-3xl bg-bg-card border border-black/5 shadow-brand-md p-6 sm:p-8 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Campo label="Nome e cognome" name="nome" required autoComplete="name" />
        <Campo label="Email" name="email" type="email" required autoComplete="email" />
        <Campo label="Telefono" name="telefono" type="tel" required autoComplete="tel" />
        <Campo label="Data di nascita" name="nascita" type="date" required />

        <Select label="Sesso" name="sesso" options={['Maschio', 'Femmina']} required />
        <Campo label="Anni di servizio" name="anni_servizio" type="number" min={0} max={50} placeholder="es. 12" suffix="anni" required />

        <Select label="Tipo di lavoratore" name="lavoratore" options={['Dipendente', 'Autonomo', 'Libero professionista']} required />
        <Campo label="Reddito annuo lordo" name="reddito" type="number" min={0} step={500} placeholder="40.000" prefix="€" required />

        <div className="sm:col-span-2">
          <Select label="Crescita retributiva attesa" name="crescita" options={CRESCITA} required />
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-ink-muted leading-relaxed">
        <input type="checkbox" name="consenso" required className="mt-1 w-4 h-4 accent-brand-green flex-shrink-0" />
        <span>
          Acconsento al trattamento dei miei dati per ricevere una stima previdenziale ed essere
          ricontattato da Quootami. I dati sono inviati al broker{' '}
          <span className="text-ink">Sisto Assicurazioni</span> e non vengono ceduti a terzi.{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">Informativa privacy</Link>.
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold" style={{ color: '#E76F51' }}>{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full mt-6 justify-center disabled:opacity-60">
        {loading ? 'Invio in corso…' : 'Richiedi la stima →'}
      </button>

      <p className="mt-4 text-xs text-ink-muted text-center">
        Connessione cifrata · Nessun costo · Nessun impegno
      </p>
    </form>
  );
}

/* ── Campi ── */

function Campo({ label, name, type = 'text', required, placeholder, autoComplete, min, max, step, prefix, suffix }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
  autoComplete?: string; min?: number; max?: number; step?: number; prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-ink mb-1.5">
        {label}{required && <span className="text-brand-green-dark"> *</span>}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted">{prefix}</span>}
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-xl border border-ink/15 bg-bg py-2.5 text-sm text-ink placeholder:text-ink-muted/60
                      focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30
                      ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-14' : 'pr-4'}`}
        />
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted">{suffix}</span>}
      </div>
    </div>
  );
}

function Select({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-ink mb-1.5">
        {label}{required && <span className="text-brand-green-dark"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-xl border border-ink/15 bg-bg px-4 py-2.5 text-sm text-ink
                   focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
      >
        <option value="" disabled>Seleziona…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
