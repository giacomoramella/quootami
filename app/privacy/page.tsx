import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { OPERATORE } from '@/config/operatore';

export const metadata: Metadata = {
  title: 'Privacy Policy · Reg. UE 2016/679 (GDPR)',
  description: 'Informativa privacy ai sensi degli artt. 13 e 14 del Reg. UE 2016/679 (GDPR). Titolare, finalità, basi giuridiche, conservazione, destinatari, diritti dell\'interessato.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Reg. UE 2016/679 · GDPR"
      title="Privacy"
      titleAccent="Policy."
      intro="Quali dati raccogliamo, perché, e cosa puoi farne tu. Resa ai sensi degli artt. 13 e 14 del Reg. UE 2016/679 (GDPR)."
      lastUpdate="17 giugno 2026"
    >
      <h2>1. Titolare del trattamento</h2>
      <p>Il titolare del trattamento dei dati personali raccolti tramite questo sito è il broker assicurativo per il quale Quootami opera:</p>
      <ul>
        <li><strong>Denominazione:</strong> {OPERATORE.broker.ragione_sociale}</li>
        <li><strong>P.IVA / C.F.:</strong> {OPERATORE.broker.partita_iva}</li>
        <li><strong>Iscrizione RUI sez. {OPERATORE.broker.rui_sezione} n.</strong> {OPERATORE.broker.rui_numero} — vigilato IVASS</li>
        <li><strong>Email privacy:</strong> <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a></li>
        <li><strong>Telefono:</strong> <a href={`tel:${OPERATORE.contatti.telefono_tel}`}>{OPERATORE.contatti.telefono_display}</a></li>
      </ul>
      <p>Ai sensi dell&apos;art. 37 GDPR il titolare non rientra fra i soggetti obbligati alla nomina di un Responsabile della Protezione dei Dati (DPO).</p>

      <h2>2. Quali dati raccogliamo</h2>
      <h3>2.1 Dati conferiti tramite i form</h3>
      <ul>
        <li><strong>Dati anagrafici e di contatto:</strong> nome, cognome, data di nascita, email, telefono.</li>
        <li><strong>Dati relativi al rischio assicurato:</strong> es. targa veicolo per la polizza auto.</li>
        <li><strong>Documenti di identità:</strong> immagini di carta d&apos;identità (fronte/retro) e libretto di circolazione, caricati su archivio cifrato (Supabase Storage, regione UE).</li>
        <li><strong>Consenso al trattamento</strong> registrato prima dell&apos;invio.</li>
      </ul>

      <h3>2.2 Dati raccolti in fase contrattuale</h3>
      <p>Se decidi di procedere con una consulenza/sottoscrizione, raccogliamo gli ulteriori dati richiesti dalla normativa assicurativa (codice fiscale, dati patrimoniali, eventuali dati sanitari per polizze salute con consenso ex art. 9 GDPR).</p>

      <h3>2.3 Dati di navigazione</h3>
      <p>Log tecnici trasmessi dal browser (indirizzo IP, user-agent, pagine richieste, codice di stato). Trattati dal fornitore di hosting per il tempo strettamente necessario al funzionamento del servizio, senza profilazione.</p>

      <h3>2.4 Cookie</h3>
      <p>Il sito utilizza esclusivamente cookie tecnici. Dettagli nella <a href="/cookie">Cookie Policy</a>.</p>

      <h2>3. Finalità del trattamento</h2>
      <ul>
        <li>Ricontatto e gestione della richiesta di preventivo (su richiesta dell&apos;interessato).</li>
        <li>Identificazione e verifica documentale (adempimenti antiriciclaggio e di conformità).</li>
        <li>Analisi delle esigenze assicurative (artt. 119-bis CAP, Reg. IVASS 40/2018).</li>
        <li>Esecuzione del contratto e gestione dei sinistri.</li>
        <li>Adempimenti di legge (IVASS, antiriciclaggio, fiscali).</li>
        <li>Difesa di diritti in sede giudiziaria.</li>
      </ul>

      <h2>4. Basi giuridiche</h2>
      <ul>
        <li><strong>Consenso dell&apos;interessato</strong> (art. 6 c.1 lett. a) per il ricontatto e per il trattamento dei documenti d&apos;identità.</li>
        <li><strong>Esecuzione del contratto e misure precontrattuali</strong> (art. 6 c.1 lett. b).</li>
        <li><strong>Obbligo di legge</strong> (art. 6 c.1 lett. c) per gli adempimenti normativi.</li>
        <li><strong>Legittimo interesse</strong> (art. 6 c.1 lett. f) per la sicurezza del sito.</li>
      </ul>

      <h2>5. Conservazione</h2>
      <ul>
        <li><strong>Lead non finalizzati:</strong> fino a 24 mesi dall&apos;ultima interazione.</li>
        <li><strong>Documenti d&apos;identità sul sito:</strong> link firmati validi 30 giorni; file cancellati dopo acquisizione contrattuale o entro 12 mesi.</li>
        <li><strong>Dati contrattuali:</strong> durata del contratto + 10 anni (obblighi fiscali e IVASS).</li>
        <li><strong>Dati di sinistro:</strong> 10 anni dalla chiusura.</li>
        <li><strong>Log di navigazione:</strong> massimo 12 mesi.</li>
      </ul>

      <h2>6. Destinatari</h2>
      <ul>
        <li>Personale autorizzato del titolare (art. 29 GDPR).</li>
        <li>Compagnie assicurative partner — quali autonomi titolari.</li>
        <li>Responsabili esterni (art. 28 GDPR): <strong>Supabase</strong> (DB + Storage, Frankfurt UE), <strong>Resend</strong> (email transazionali), <strong>Vercel</strong> (hosting).</li>
        <li>Autorità competenti (IVASS, UIF, autorità giudiziaria) nei casi previsti dalla legge.</li>
      </ul>

      <h2>7. Trasferimenti extra-UE e processi automatizzati</h2>
      <p>Alcuni fornitori (Resend, Vercel) possono trattare dati in territori extra-UE sulla base delle <strong>Standard Contractual Clauses</strong> approvate dalla Commissione Europea (decisione 2021/914). Non sono effettuati processi decisionali automatizzati né profilazione ex art. 22 GDPR.</p>

      <h2>8. Diritti dell&apos;interessato</h2>
      <p>L&apos;interessato può esercitare in qualsiasi momento i diritti di accesso (art. 15), rettifica (art. 16), cancellazione (art. 17), limitazione (art. 18), portabilità (art. 20), opposizione (art. 21) e revoca del consenso.</p>
      <p>Per esercitare i diritti scrivere a <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a>. Risposta entro 30 giorni (prorogabili di 60 in casi complessi, art. 12 c.3 GDPR).</p>

      <h2>9. Reclamo al Garante</h2>
      <p>Diritto di proporre reclamo al <strong>Garante per la Protezione dei Dati Personali</strong>: Piazza Venezia 11, 00187 Roma · <a href="mailto:garante@gpdp.it">garante@gpdp.it</a> · <a href="https://www.garanteprivacy.it" rel="external noopener" target="_blank">www.garanteprivacy.it</a></p>

      <h2>10. Note finali</h2>
      <p><strong>Minori.</strong> Il sito è destinato a maggiorenni e non raccoglie consapevolmente dati personali di minori di 18 anni.</p>
      <p><strong>Sicurezza.</strong> Misure tecniche e organizzative adeguate: HTTPS sull&apos;intero sito, archivio documenti cifrato a riposo, accessi limitati al personale autorizzato.</p>
      <p><strong>Modifiche.</strong> L&apos;informativa può essere aggiornata. Data di ultimo aggiornamento in cima alla pagina.</p>
    </LegalPage>
  );
}
