import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { OPERATORE } from '@/config/operatore';

export const metadata: Metadata = {
  title: 'Privacy Policy · Reg. UE 2016/679 (GDPR)',
  description: 'Informativa privacy ai sensi dell\'art. 13 del Reg. UE 2016/679 (GDPR): titolare, dati trattati, finalità, basi giuridiche, conservazione, destinatari e diritti.',
};

/**
 * Informativa essenziale: contiene TUTTI gli elementi obbligatori dell'art. 13
 * GDPR (titolare, dati, finalità, basi giuridiche, conservazione, destinatari,
 * trasferimenti extra-UE, assenza di decisioni automatizzate, diritti, reclamo
 * al Garante) e nient'altro.
 *
 * Descrive solo ciò che il sito fa davvero: i form raccolgono contatti e dati
 * del rischio, il comparatore energia tratta consumi + bolletta + email. Non
 * sono previsti caricamenti di documenti d'identità.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Reg. UE 2016/679 · GDPR"
      title="Privacy"
      titleAccent="Policy."
      intro="Quali dati raccogliamo, perché, e cosa puoi farne tu. Resa ai sensi dell'art. 13 del Reg. UE 2016/679 (GDPR)."
      lastUpdate="5 agosto 2026"
    >
      <h2>1. Titolare del trattamento</h2>
      <ul>
        <li><strong>Titolare:</strong> {OPERATORE.collaboratore.nome_completo}, gestore del sito</li>
        <li><strong>Iscrizione RUI sez. {OPERATORE.collaboratore.rui_sezione} n.</strong> {OPERATORE.collaboratore.rui_numero} — vigilato IVASS</li>
        <li><strong>Email:</strong> <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a></li>
        <li><strong>Telefono:</strong> <a href={`tel:${OPERATORE.contatti.telefono_tel}`}>{OPERATORE.contatti.telefono_display}</a></li>
      </ul>

      <h2>2. Dati trattati</h2>
      <ul>
        <li><strong>Moduli di preventivo:</strong> nome, email, telefono e i dati del rischio da assicurare (es. targa del veicolo, dati dell&apos;attività), oltre al consenso registrato prima dell&apos;invio.</li>
        <li><strong>Comparatore luce e gas:</strong> i dati di consumo inseriti, l&apos;eventuale immagine o PDF della bolletta caricata — letta in modo automatizzato per estrarne i soli dati di fornitura — e l&apos;email, confermata con doppio opt-in.</li>
        <li><strong>Dati di navigazione:</strong> log tecnici trasmessi dal browser (indirizzo IP, user-agent, pagine richieste), necessari al funzionamento e alla sicurezza del sito.</li>
        <li><strong>Cookie:</strong> vedi la <a href="/cookie">Cookie Policy</a>.</li>
      </ul>

      <h2>3. Finalità e basi giuridiche</h2>
      <ul>
        <li><strong>Rispondere alla richiesta di preventivo e ricontattare l&apos;interessato</strong> — consenso (art. 6.1.a) e misure precontrattuali (art. 6.1.b).</li>
        <li><strong>Confronto delle tariffe energia e invio della proposta</strong> — consenso, con verifica dell&apos;indirizzo email (art. 6.1.a).</li>
        <li><strong>Analisi delle esigenze assicurative, esecuzione del contratto e gestione dei sinistri</strong> — contratto (art. 6.1.b) e obblighi di legge (art. 6.1.c: art. 119-bis CAP, Reg. IVASS 40/2018).</li>
        <li><strong>Adempimenti di legge</strong> (IVASS, antiriciclaggio, fiscali) e difesa di un diritto in giudizio — obbligo di legge e legittimo interesse (artt. 6.1.c e 6.1.f).</li>
        <li><strong>Sicurezza e funzionamento del sito</strong> — legittimo interesse (art. 6.1.f).</li>
      </ul>

      <h2>4. Conservazione</h2>
      <ul>
        <li><strong>Richieste non finalizzate:</strong> fino a 24 mesi dall&apos;ultima interazione.</li>
        <li><strong>Dati contrattuali:</strong> durata del contratto più 10 anni (obblighi fiscali e IVASS).</li>
        <li><strong>Dati di sinistro:</strong> 10 anni dalla chiusura.</li>
        <li><strong>Log di navigazione:</strong> massimo 12 mesi.</li>
      </ul>

      <h2>5. Destinatari</h2>
      <ul>
        <li>Personale autorizzato del titolare (art. 29 GDPR).</li>
        <li>Compagnie assicurative partner, quali autonomi titolari.</li>
        <li>Responsabili esterni (art. 28 GDPR): <strong>Supabase</strong> (banca dati, regione Francoforte, UE), <strong>Vercel</strong> (hosting e funzioni server, regione UE), <strong>Resend</strong> (email transazionali), <strong>Anthropic</strong> (lettura automatizzata della bolletta nel comparatore energia).</li>
        <li>Autorità competenti (IVASS, UIF, autorità giudiziaria) nei casi previsti dalla legge.</li>
      </ul>

      <h2>6. Trasferimenti extra-UE e decisioni automatizzate</h2>
      <p>Il trattamento avviene in via prioritaria <strong>all&apos;interno dell&apos;Unione Europea</strong>: banca dati su Supabase e funzioni server su Vercel in regione Francoforte.</p>
      <p>Trasferimenti extra-UE residui possono avvenire verso <strong>Resend</strong> (Standard Contractual Clauses, decisione 2021/914) e verso <strong>Anthropic</strong>, <strong>Google</strong> e <strong>Meta</strong> — questi ultimi due solo previo consenso cookie — sulla base dell&apos;<strong>EU-U.S. Data Privacy Framework</strong> (decisione di adeguatezza del 10/07/2023).</p>
      <p>Non sono effettuati processi decisionali automatizzati né profilazione ai sensi dell&apos;art. 22 GDPR.</p>

      <h2>7. Diritti dell&apos;interessato</h2>
      <p>L&apos;interessato può esercitare in qualsiasi momento i diritti di accesso (art. 15), rettifica (art. 16), cancellazione (art. 17), limitazione (art. 18), portabilità (art. 20) e opposizione (art. 21), oltre alla revoca del consenso, che non pregiudica la liceità del trattamento già effettuato.</p>
      <p>Per esercitarli scrivere a <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a>. Risposta entro 30 giorni, prorogabili di 60 nei casi complessi (art. 12 c.3 GDPR).</p>
      <p>Il conferimento dei dati è facoltativo, ma senza i dati di contatto non è possibile dare seguito alla richiesta di preventivo.</p>

      <h2>8. Reclamo al Garante</h2>
      <p>L&apos;interessato ha diritto di proporre reclamo al <strong>Garante per la Protezione dei Dati Personali</strong>: Piazza Venezia 11, 00187 Roma · <a href="mailto:garante@gpdp.it">garante@gpdp.it</a> · <a href="https://www.garanteprivacy.it" rel="external noopener" target="_blank">www.garanteprivacy.it</a></p>
    </LegalPage>
  );
}
