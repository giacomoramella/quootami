/**
 * Quootami — Resend client per email transazionali
 * ============================================================
 * Resend offre invio email con allegati fino a 40MB nel free
 * tier (100 email/giorno).
 *
 * Env vars necessarie:
 * - RESEND_API_KEY        (re_xxxxx)
 * - INTERMEDIARIO_EMAIL   (destinatario delle notifiche lead)
 *
 * Il mittente è `noreply@quootami.it` — richiede verifica dominio
 * su Resend Dashboard. Finché il dominio non è verificato,
 * Resend permette invio solo verso l'email dell'account proprietario.
 * ============================================================
 */
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const INTERMEDIARIO_EMAIL =
  process.env.INTERMEDIARIO_EMAIL ?? 'giacomo.rp@sistoassicurazioni.com';

// Mittenti per area (dominio quootami.it verificato su Resend, accertato il
// 07/08/2026): ogni sezione firma con il proprio nome — il comparatore usa
// "Quootami Energia" nella edge function en-lead. Stesso indirizzo per tutti,
// cambia solo il nome visualizzato.
export const SENDER_POLIZZE =
  process.env.RESEND_FROM_POLIZZE ?? 'Quootami Polizze <polizze@quootami.it>';
export const SENDER_PENSIONE =
  process.env.RESEND_FROM_PENSIONE ?? 'Quootami Pensione <pensione@quootami.it>';

/**
 * Testata brand per tutte le email: wordmark "Quootami" navy con punto giallo
 * (come nella og-image) e claim. Stessa veste della shell di en-lead.
 */
export const WORDMARK = `
      <div style="padding: 4px 0 14px;">
        <div style="font-size: 25px; font-weight: 800; letter-spacing: -0.5px; color: #0B1220;">Quootami<span style="color: #FFD84D;">.</span></div>
        <div style="margin-top: 3px; font-size: 10.5px; font-weight: 700; letter-spacing: 1.6px; color: #9AA0A6; text-transform: uppercase;">Confronta. Cambia. Risparmia.</div>
      </div>`;

export function getResend() {
  if (!RESEND_API_KEY) {
    throw new Error(
      '[Quootami] RESEND_API_KEY non configurata. Crea un account su https://resend.com e imposta la variabile su Vercel.'
    );
  }
  return new Resend(RESEND_API_KEY);
}

export type LeadEmailPayload = {
  prodotto: string;
  nome: string;
  cognome: string;
  dataNascita?: string;
  email: string;
  telefono: string;
  targa?: string;
  leadId?: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
};

/**
 * Invia email di notifica nuovo lead al broker con allegati PDF.
 */
/**
 * L'SDK Resend NON lancia eccezioni sugli errori API: risolve con
 * { data: null, error }. Senza questo controllo un invio fallito
 * (dominio non verificato, 4xx, rate limit) passerebbe per riuscito.
 */
async function sendOrThrow(
  resend: Resend,
  payload: Parameters<Resend['emails']['send']>[0]
) {
  const result = await resend.emails.send(payload);
  if (result.error) {
    throw new Error(`Resend: ${result.error.name ?? ''} ${result.error.message}`.trim());
  }
  return result;
}

export async function sendLeadEmail(payload: LeadEmailPayload) {
  const resend = getResend();

  const subject = `Nuova richiesta preventivo ${payload.prodotto} — ${payload.nome} ${payload.cognome}`;

  const html = `
    <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; color: #0B1220;">
      ${WORDMARK}
      <h2 style="color: #0B1220; border-bottom: 3px solid #FFD84D; padding-bottom: 8px;">
        Nuova richiesta preventivo via sito Quootami
      </h2>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        ${row('Prodotto', esc(payload.prodotto))}
        ${row('Nome', esc(payload.nome))}
        ${row('Cognome', esc(payload.cognome))}
        ${payload.dataNascita ? row('Data di nascita', esc(payload.dataNascita)) : ''}
        ${row('Email cliente', `<a href="mailto:${esc(payload.email)}">${esc(payload.email)}</a>`)}
        ${row('Telefono', `<a href="tel:${esc(payload.telefono)}">${esc(payload.telefono)}</a>`)}
        ${payload.targa ? row('Targa veicolo', esc(payload.targa)) : ''}
        ${row('Lead ID', esc(payload.leadId ?? 'n/d'))}
        ${row('Data invio', new Date().toLocaleString('it-IT'))}
      </table>
      <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">
        Documenti del cliente in allegato (PDF). Puoi rispondere direttamente a questa email per
        contattare il cliente — il <code>Reply-To</code> è impostato sul suo indirizzo.
      </p>
      <hr style="border: none; border-top: 1px solid #E5E5E0; margin: 24px 0;">
      <p style="color: #6B7280; font-size: 12px;">
        Quootami · sistema automatico di consegna lead<br>
        I dati sono salvati anche su Supabase (Lead ID: <code>${payload.leadId ?? 'n/d'}</code>)
      </p>
    </div>
  `;

  return sendOrThrow(resend, {
    from: SENDER_POLIZZE,
    to: [INTERMEDIARIO_EMAIL],
    replyTo: payload.email,
    subject,
    html,
    attachments: payload.attachments?.map(a => ({
      filename: a.filename,
      content: a.content,
    })),
  });
}

// ────────────────── Adesione FEA firmata (M4) ──────────────────

export type AdesioneFirmataPayload = {
  prodotto: string;             // es. "Allianz Previdenza"
  praticaId: string;
  nome: string;
  cognome: string;
  cf: string;
  email: string;
  cellulare: string;
  codiceVerifica?: string;
  firmatoIl?: string;
  pdfFirmato: Buffer;
};

/**
 * Email al broker con allegato il PDF firmato del cliente (post-FEA).
 */
export async function sendAdesioneFirmataEmail(p: AdesioneFirmataPayload) {
  const resend = getResend();
  const subject = `✅ Adesione ${p.prodotto} firmata — ${p.nome} ${p.cognome}`;
  const html = `
    <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; color: #0B1220;">
      ${WORDMARK}
      <h2 style="color: #1d7a4d; border-bottom: 3px solid #1d7a4d; padding-bottom: 8px;">
        Adesione firmata via FEA ✓
      </h2>
      <p>Il cliente ha completato la firma elettronica avanzata.
      Il modulo firmato è in allegato.</p>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        ${row('Prodotto', esc(p.prodotto))}
        ${row('Cliente', esc(`${p.nome} ${p.cognome}`))}
        ${row('Codice fiscale', esc(p.cf))}
        ${row('Email', `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`)}
        ${row('Cellulare', `<a href="tel:${esc(p.cellulare)}">${esc(p.cellulare)}</a>`)}
        ${row('Pratica ID (OTP Service)', esc(p.praticaId))}
        ${p.codiceVerifica ? row('Codice verifica firma', `<code>${esc(p.codiceVerifica)}</code>`) : ''}
        ${row('Firmato il', esc(p.firmatoIl ?? new Date().toLocaleString('it-IT')))}
      </table>
      <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">
        Il PDF firmato è archiviato anche su Supabase Storage (bucket <code>adesioni-firmate</code>).
        Documento conforme eIDAS / CAD / AgID.
      </p>
    </div>
  `;
  return sendOrThrow(resend, {
    from: SENDER_PENSIONE,
    to: [INTERMEDIARIO_EMAIL],
    replyTo: p.email,
    subject,
    html,
    attachments: [
      {
        filename: `Adesione_${p.prodotto.replace(/\s+/g, '_')}_${p.cognome}_FIRMATO.pdf`,
        content: p.pdfFirmato,
      },
    ],
  });
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E5E5E0; font-weight: 600; color: #0B1220; width: 40%;">${label}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E5E5E0; color: #1F2937;">${value}</td>
    </tr>
  `;
}

/**
 * Escape HTML per valori forniti dall'utente interpolati nelle email.
 * Senza questo, chiunque invii il form può iniettare HTML/link arbitrari
 * nell'inbox del broker (vettore di phishing).
 */
function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
