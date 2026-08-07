import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { OPERATORE } from '@/config/operatore';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informativa sull\'uso dei cookie ai sensi dell\'art. 122 D.Lgs. 196/2003, del Reg. UE 2016/679 e delle Linee guida del Garante del 10/06/2021.',
};

/**
 * Informativa essenziale: contiene i soli elementi richiesti dalle Linee guida
 * del Garante 10/06/2021 — titolare, cookie effettivamente installati con
 * finalità/durata/terza parte, modo per prestare e revocare il consenso,
 * diritti e reclamo.
 *
 * Il Meta Pixel è dichiarato NON attivo perché l'env NEXT_PUBLIC_META_PIXEL_ID
 * non è impostata: senza ID il codice non carica nulla. Se un domani viene
 * attivato, questa voce va aggiornata di conseguenza.
 */
export default function CookiePage() {
  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Cookie Policy', href: '/cookie' }]} />
      <LegalPage
      eyebrow="Art. 122 D.Lgs. 196/2003 · Garante 10/06/2021"
      title="Cookie"
      titleAccent="Policy."
      intro="Quali cookie usa questo sito e come gestirli. Resa ai sensi dell'art. 13 GDPR, dell'art. 122 D.Lgs. 196/2003 e delle Linee guida del Garante del 10 giugno 2021."
      lastUpdate="5 agosto 2026"
    >
      <h2>1. Titolare del trattamento</h2>
      <p>Il titolare è <strong>{OPERATORE.collaboratore.nome_completo}</strong>, gestore del sito, iscritto al RUI sez. {OPERATORE.collaboratore.rui_sezione} n. {OPERATORE.collaboratore.rui_numero} e vigilato IVASS. Contatto: <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a>.</p>

      <h2>2. Cookie utilizzati</h2>
      <p>Nessun cookie diverso da quelli tecnici viene installato prima della scelta espressa dall&apos;utente nel banner.</p>

      <h3>2.1 Tecnici — sempre attivi, non richiedono consenso</h3>
      <ul>
        <li><strong><code>qtm_consent</code></strong> — prima parte; memorizza le preferenze espresse nel banner. Durata: 180 giorni.</li>
        <li><strong>Cookie di sicurezza</strong> — impostati dal fornitore di hosting (Vercel) per mitigazione DDoS e rilevamento bot. Durata: di sessione.</li>
      </ul>

      <h3>2.2 Statistici — solo previo consenso</h3>
      <ul>
        <li><strong>Google Analytics 4</strong> — Google Ireland Ltd.; cookie <code>_ga</code> e <code>_ga_*</code>, con IP anonimizzato, per misurare le visite in forma aggregata. Durata: fino a 24 mesi. Eventuali trasferimenti extra-UE sulla base dell&apos;EU-U.S. Data Privacy Framework. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Informativa Google</a>.</li>
      </ul>

      <h3>2.3 Marketing — attualmente non utilizzati</h3>
      <p>Alla data odierna il sito <strong>non installa cookie di profilazione o marketing</strong>: la relativa categoria del banner resta senza strumenti collegati. Se in futuro verrà attivato il Meta Pixel (cookie <code>_fbp</code>, Meta Platforms Ireland Ltd., durata 90 giorni), questa informativa sarà aggiornata prima dell&apos;attivazione.</p>

      <h2>3. Come prestare, modificare o revocare il consenso</h2>
      <p>Il consenso si presta per categoria dal banner alla prima visita. È modificabile o revocabile in qualsiasi momento dal link <strong>&ldquo;Preferenze cookie&rdquo;</strong> nel footer del sito.</p>
      <p>I cookie possono inoltre essere gestiti dalle impostazioni del browser — <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a>, <a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer">Firefox</a>, <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a>, <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a> — tenendo presente che disattivare i cookie tecnici può compromettere il funzionamento del sito.</p>

      <h2>4. Diritti e reclamo</h2>
      <p>L&apos;utente può esercitare i diritti previsti dagli artt. 15-22 GDPR scrivendo a <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a>; le finalità del trattamento sono descritte nella <a href="/privacy">Privacy Policy</a>. È inoltre riconosciuto il diritto di proporre reclamo al <strong>Garante per la Protezione dei Dati Personali</strong> (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>).</p>
      </LegalPage>
    </>
  );
}
