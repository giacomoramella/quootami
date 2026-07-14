'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Banner di consenso cookie first-party (stile CMP, senza CMP esterni).
 *
 * Regole (Linee guida Garante 10/06/2021):
 * - nessun cookie non tecnico prima della scelta dell'utente;
 * - "Accetta" e "Rifiuta" con pari evidenza;
 * - revoca sempre possibile (link "Preferenze cookie" nel footer, che
 *   emette l'evento `qtm-open-cookie-prefs`);
 * - scelta memorizzata 180 giorni nel cookie tecnico `qtm_consent`.
 *
 * Il banner appare sempre alla prima visita e registra il consenso per
 * categoria. Gli strumenti però si attivano SOLO se configurati via env:
 * - NEXT_PUBLIC_GA4_ID        → Google Analytics 4  (categoria: statistiche)
 * - NEXT_PUBLIC_META_PIXEL_ID → Meta Pixel          (categoria: marketing)
 * Senza ID configurati il consenso viene comunque memorizzato (varrà
 * all'attivazione) ma nessuno script di terze parti viene caricato.
 */

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const COOKIE_NAME = 'qtm_consent';
const COOKIE_MAX_AGE = 180 * 24 * 60 * 60; // 180 giorni

type Consent = { s: boolean; m: boolean }; // statistiche, marketing

function readConsent(): Consent | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!m) return null;
  try {
    const v = JSON.parse(decodeURIComponent(m[1]!));
    return { s: !!v.s, m: !!v.m };
  } catch {
    return null;
  }
}

function writeConsent(c: Consent) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(c))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
}

/** Rimozione best-effort dei cookie di tracciamento alla revoca. */
function clearTrackingCookies() {
  document.cookie.split(';').forEach((raw) => {
    const name = raw.trim().split('=')[0];
    if (name && (name.startsWith('_ga') || name === '_gid' || name === '_fbp' || name === '_fbc')) {
      const base = `${name}=; path=/; max-age=0`;
      document.cookie = base;
      document.cookie = `${base}; domain=.${location.hostname}`;
    }
  });
}

function loadGA4(id: string) {
  if (document.getElementById('qtm-ga4')) return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: unknown[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
  const s = document.createElement('script');
  s.id = 'qtm-ga4';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function loadMetaPixel(id: string) {
  const w = window as any;
  if (w.fbq) return;
  const fbq: any = (...args: unknown[]) => {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  w.fbq = fbq;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/it_IT/fbevents.js';
  document.head.appendChild(s);
  w.fbq('init', id);
  w.fbq('track', 'PageView');
}

function applyConsent(c: Consent) {
  if (c.s && GA4_ID) loadGA4(GA4_ID);
  if (c.m && META_PIXEL_ID) loadMetaPixel(META_PIXEL_ID);
  if (!c.s && !c.m) clearTrackingCookies();
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      applyConsent(saved);
    } else {
      setVisible(true);
    }
    // Il footer riapre il banner per la revoca/modifica del consenso.
    const open = () => {
      const cur = readConsent();
      if (cur) {
        setStats(cur.s);
        setMarketing(cur.m);
      }
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener('qtm-open-cookie-prefs', open);
    return () => window.removeEventListener('qtm-open-cookie-prefs', open);
  }, []);

  if (!visible) return null;

  const decide = (c: Consent) => {
    writeConsent(c);
    applyConsent(c);
    setVisible(false);
    setExpanded(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Preferenze cookie"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50
                 bg-white border border-black/10 rounded-3xl shadow-brand-lg p-6 animate-fade-up"
    >
      {/* X = chiudi senza consenso: equivale a "Rifiuta" (Linee guida Garante) */}
      <button
        onClick={() => decide({ s: false, m: false })}
        aria-label="Chiudi il banner senza acconsentire ai cookie non necessari"
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-alt text-ink-muted
                   flex items-center justify-center hover:bg-brand-navy hover:text-white
                   transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <p className="font-sans font-bold text-base text-ink pr-10">Cookie su Quootami</p>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">
        Questo sito usa cookie tecnici e, solo con il tuo consenso, cookie di
        misurazione e marketing. Puoi cambiare idea quando vuoi da
        &ldquo;Preferenze cookie&rdquo; nel footer.{' '}
        <Link href="/cookie" className="underline underline-offset-2 hover:text-ink">
          Cookie Policy
        </Link>
      </p>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-black/5 pt-4">
          <ConsentRow label="Necessari" desc="Memorizzano solo questa scelta." checked disabled />
          <ConsentRow
            label="Statistiche"
            desc="Misurazione visite in forma aggregata (Google Analytics 4, IP anonimizzato)."
            checked={stats}
            onChange={setStats}
          />
          <ConsentRow
            label="Marketing"
            desc="Misurazione dell'efficacia delle campagne (Meta Pixel)."
            checked={marketing}
            onChange={setMarketing}
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => decide({ s: true, m: true })}
          className="flex-1 px-4 py-2.5 rounded-full bg-brand-yellow text-ink text-sm font-bold hover:bg-brand-navy hover:text-white transition-colors"
        >
          Accetta tutti
        </button>
        <button
          onClick={() => decide({ s: false, m: false })}
          className="flex-1 px-4 py-2.5 rounded-full bg-white border border-black/15 text-ink text-sm font-bold hover:border-brand-navy transition-colors"
        >
          Rifiuta
        </button>
        {expanded ? (
          <button
            onClick={() => decide({ s: stats, m: marketing })}
            className="w-full px-4 py-2.5 rounded-full bg-bg-alt text-ink text-sm font-semibold hover:bg-brand-yellow/30 transition-colors"
          >
            Salva le preferenze selezionate
          </button>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="w-full text-center text-xs font-semibold text-ink-muted underline underline-offset-2 hover:text-ink transition-colors pt-1"
          >
            Personalizza
          </button>
        )}
      </div>
    </div>
  );
}

function ConsentRow({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-brand-green"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-ink-muted">{desc}</span>
      </span>
    </label>
  );
}

/** Link footer: riapre il banner per modificare/revocare il consenso. */
export function CookiePrefsButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('qtm-open-cookie-prefs'))}
      className="text-sm text-white/55 hover:text-brand-yellow transition-colors underline-offset-2"
    >
      Preferenze cookie
    </button>
  );
}
