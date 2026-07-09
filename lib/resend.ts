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

// Sender — quando il dominio è verificato puoi usare adesioni@quootami.it
// Prima della verifica del dominio Resend usa onboarding@resend.dev
export const SENDER_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'Quootami <noreply@quootami.it>';

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
export async function sendLeadEmail(payload: LeadEmailPayload) {
  const resend = getResend();

  const subject = `Nuova richiesta preventivo ${payload.prodotto} — ${payload.nome} ${payload.cognome}`;

  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; color: #0B1220;">
      <h2 style="color: #0B1220; border-bottom: 3px solid #FFD84D; padding-bottom: 8px;">
        Nuova richiesta preventivo via sito Quootami
      </h2>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        ${row('Prodotto', payload.prodotto)}
        ${row('Nome', payload.nome)}
        ${row('Cognome', payload.cognome)}
        ${payload.dataNascita ? row('Data di nascita', payload.dataNascita) : ''}
        ${row('Email cliente', `<a href="mailto:${payload.email}">${payload.email}</a>`)}
        ${row('Telefono', `<a href="tel:${payload.telefono}">${payload.telefono}</a>`)}
        ${payload.targa ? row('Targa veicolo', payload.targa) : ''}
        ${row('Lead ID', payload.leadId ?? 'n/d')}
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

  return resend.emails.send({
    from: SENDER_EMAIL,
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
    <div style="font-family: Inter, sans-serif; max-width: 600px; color: #0B1220;">
      <h2 style="color: #1d7a4d; border-bottom: 3px solid #1d7a4d; padding-bottom: 8px;">
        Adesione firmata via FEA ✓
      </h2>
      <p>Il cliente ha completato la firma elettronica avanzata.
      Il modulo firmato è in allegato.</p>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        ${row('Prodotto', p.prodotto)}
        ${row('Cliente', `${p.nome} ${p.cognome}`)}
        ${row('Codice fiscale', p.cf)}
        ${row('Email', `<a href="mailto:${p.email}">${p.email}</a>`)}
        ${row('Cellulare', `<a href="tel:${p.cellulare}">${p.cellulare}</a>`)}
        ${row('Pratica ID (OTP Service)', p.praticaId)}
        ${p.codiceVerifica ? row('Codice verifica firma', `<code>${p.codiceVerifica}</code>`) : ''}
        ${row('Firmato il', p.firmatoIl ?? new Date().toLocaleString('it-IT'))}
      </table>
      <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">
        Il PDF firmato è archiviato anche su Supabase Storage (bucket <code>adesioni-firmate</code>).
        Documento conforme eIDAS / CAD / AgID.
      </p>
    </div>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
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
