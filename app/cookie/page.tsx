import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { OPERATORE } from '@/config/operatore';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informativa sull\'uso dei cookie ai sensi del D.Lgs. 196/2003, Reg. UE 2016/679 (GDPR) e Linee guida Garante 10/06/2021.',
};

export default function CookiePage() {
  return (
    <LegalPage
      eyebrow="D.Lgs. 196/2003 · Garante 10/06/2021"
      title="Cookie"
      titleAccent="Policy."
      intro="Informativa sull'uso dei cookie. Resa ai sensi dell'art. 13 GDPR, art. 122 D.Lgs. 196/2003 e Linee guida Garante del 10 giugno 2021."
      lastUpdate="14 luglio 2026"
    >
      <h2>1. Cosa sono i cookie</h2>
      <p>I cookie sono piccole stringhe di testo che i siti web inviano al terminale dell&apos;utente, dove vengono memorizzate per essere ritrasmesse alla visita successiva. Possono essere di prima parte (impostati dal sito visitato) o di terze parti (impostati da domini diversi).</p>

      <h2>2. Titolare del trattamento</h2>
      <p>Il titolare del trattamento dei cookie e degli strumenti di tracciamento di questo sito è <strong>{OPERATORE.collaboratore.nome_completo}</strong>, gestore del sito, intermediario iscritto al RUI sez. {OPERATORE.collaboratore.rui_sezione} n. {OPERATORE.collaboratore.rui_numero}, vigilato IVASS. Per richieste in materia di cookie: <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a>.</p>
      <p>Per i dati personali conferiti tramite i form del sito (richieste di preventivo, adesioni), il titolare è il broker indicato nella <a href="/privacy">Privacy Policy</a>.</p>

      <h2>3. Categorie di cookie</h2>
      <ul>
        <li><strong>Cookie tecnici</strong> — necessari al funzionamento del sito. Non richiedono consenso (art. 122 c.1 D.Lgs. 196/2003).</li>
        <li><strong>Cookie analitici di terze parti</strong> — richiedono consenso, salvo siano equiparati ai tecnici (IP anonimizzato, niente intersezioni, contratto come responsabile esterno).</li>
        <li><strong>Cookie di profilazione / marketing</strong> — richiedono sempre consenso preventivo.</li>
      </ul>

      <h2>4. Cookie utilizzati su questo sito</h2>
      <p>Il sito utilizza <strong>cookie tecnici di prima parte</strong> (sempre attivi, non
      richiedono consenso) e, <strong>solo previo consenso espresso tramite il banner</strong>,
      cookie di misurazione statistica ed eventualmente di marketing. Nessun cookie non
      tecnico viene installato prima della scelta dell&apos;utente. La scelta è modificabile o
      revocabile in ogni momento dal link <strong>&ldquo;Preferenze cookie&rdquo;</strong> nel
      footer del sito.</p>

      <h3>4.1 Cookie tecnici (sempre attivi)</h3>
      <ul>
        <li><strong><code>qtm_consent</code></strong> — prima parte, memorizza le preferenze di consenso espresse nel banner. Durata: 180 giorni.</li>
        <li><strong>Cookie di sessione/sicurezza</strong> — possono essere impostati dal fornitore di hosting (Vercel) per finalità di sicurezza (mitigazione DDoS, bot detection).</li>
      </ul>

      <h3>4.2 Cookie statistici (solo previo consenso)</h3>
      <ul>
        <li><strong>Google Analytics 4</strong> — fornito da <strong>Google Ireland Ltd. (UE)</strong>; cookie <code>_ga</code>, <code>_ga_*</code>, con IP anonimizzato. Misurano visite e utilizzo del sito in forma aggregata. Durata: fino a 24 mesi. Eventuali trasferimenti extra-UE avvengono sulla base dell&apos;<strong>EU-U.S. Data Privacy Framework</strong> (decisione di adeguatezza della Commissione Europea del 10/07/2023). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Google</a>.</li>
      </ul>

      <h3>4.3 Cookie di marketing (solo previo consenso, se attivi)</h3>
      <ul>
        <li><strong>Meta Pixel</strong> — fornito da <strong>Meta Platforms Ireland Ltd. (UE)</strong>; cookie <code>_fbp</code>, misura l&apos;efficacia delle campagne pubblicitarie. Durata: 90 giorni. Eventuali trasferimenti extra-UE avvengono sulla base dell&apos;<strong>EU-U.S. Data Privacy Framework</strong>. <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Privacy Meta</a>.</li>
      </ul>
      <p>Se una categoria non è mostrata nel banner, il relativo strumento non è attivo sul sito
      e nessun cookie di quella categoria viene installato.</p>

      <h3>4.4 Altre risorse di terze parti (non installano cookie)</h3>
      <ul>
        <li><strong>Font tipografici</strong> — auto-hostati al build tramite next/font: nessuna richiesta verso Google Fonts durante la navigazione.</li>
        <li><strong>Supabase</strong> (regione <strong>Francoforte, UE</strong>) — archivio dati dei moduli, attivato solo all&apos;invio del form. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Supabase</a>.</li>
        <li><strong>Vercel</strong> — hosting; le funzioni server del sito sono eseguite in <strong>regione UE (Francoforte)</strong>. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Vercel</a>.</li>
        <li><strong>Resend</strong> — invio email transazionali, attivato solo all&apos;invio del form; eventuali trasferimenti extra-UE sulla base di <strong>Standard Contractual Clauses</strong>. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Resend</a>.</li>
        <li><strong>WhatsApp (wa.me)</strong> — i link non scambiano dati finché l&apos;utente non clicca, attivando conversazione con Meta.</li>
      </ul>

      <h2>5. Come gestire o disattivare i cookie</h2>
      <p>I cookie possono essere gestiti dalle impostazioni del browser:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
        <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>
      <p>La disattivazione dei cookie tecnici può compromettere il corretto funzionamento del sito.</p>

      <h2>6. Diritti dell&apos;interessato</h2>
      <p>L&apos;utente può esercitare i diritti previsti dagli artt. 15-22 GDPR scrivendo a <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a>. Maggiori informazioni sui diritti e sulle finalità del trattamento nella <a href="/privacy">Privacy Policy</a>.</p>
      <p>In caso di violazione, diritto di proporre reclamo al <strong>Garante per la Protezione dei Dati Personali</strong> (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>).</p>
    </LegalPage>
  );
}
