import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { OPERATORE } from '@/config/operatore';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy · Reg. UE 2016/679 (GDPR)',
  description: 'Informativa privacy ai sensi dell\'art. 13 del Reg. UE 2016/679 (GDPR): titolare, dati trattati, finalità, basi giuridiche, conservazione e diritti.',
};

/**
 * Informativa essenziale: contiene TUTTI gli elementi obbligatori dell'art. 13
 * GDPR (titolare, dati, finalità, basi giuridiche, conservazione, destinatari,
 * trasferimenti extra-UE, assenza di decisioni automatizzate, diritti, reclamo
 * al Garante) e nient'altro.
 *
 * VERSIONAMENTO — IMPORTANTE
 * Ogni contatto raccolto dai moduli deve essere salvato insieme a INFORMATIVA_VERSIONE
 * qui sotto. Serve a dimostrare, a distanza di anni, quale testo l'interessato
 * aveva davanti quando ha spuntato i consensi (art. 7.1 GDPR). Se modifichi
 * finalità, destinatari o consensi, INCREMENTA la versione e aggiorna lastUpdate.
 *
 * PERIMETRO
 * Il sito eroga tre servizi con regimi diversi: assicurativo e previdenziale
 * (intermediazione RUI sez. E per conto di Sisto Assicurazioni) e comparazione
 * forniture luce e gas (attività propria del titolare, FUORI dal perimetro
 * IVASS). La § 2 tiene distinti i tre.
 *
 * VERTICALE LUCE E GAS
 * Il verticale è archiviato dal 07/09/2026 (vedi archivio/luce-e-gas/README.md)
 * ma l'informativa lo copre già, perché gli accordi con i fornitori sono in
 * corso di negoziazione e la compliance deve precedere la raccolta, non seguirla.
 * Alla riattivazione della rotta /luce questa pagina NON va toccata, tranne che
 * per: (a) rimettere Anthropic fra i responsabili e nei trasferimenti extra-UE
 * SE torna l'estrazione dati da bolletta (supabase/functions/en-bill-extract);
 * (b) creare la pagina /luce-e-gas/fornitori citata alla § 8.
 */
const INFORMATIVA_VERSIONE = '2.1';

export default function PrivacyPage() {
  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Privacy Policy', href: '/privacy' }]} />
      <LegalPage
      eyebrow="Reg. UE 2016/679 · GDPR"
      title="Privacy"
      titleAccent="Policy."
      intro="Quali dati raccogliamo, perché, e cosa puoi farne tu. Resa ai sensi dell'art. 13 del Reg. UE 2016/679 (GDPR)."
      lastUpdate="15 settembre 2026"
    >
      <h2>1. Titolare del trattamento</h2>
      <ul>
        <li><strong>Titolare:</strong> {OPERATORE.collaboratore.nome_completo}, gestore del sito</li>
        <li><strong>Iscrizione RUI sez. {OPERATORE.collaboratore.rui_sezione} n.</strong> {OPERATORE.collaboratore.rui_numero}</li>
        <li><strong>Email:</strong> <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a></li>
        <li><strong>Telefono:</strong> <a href={`tel:${OPERATORE.contatti.telefono_tel}`}>{OPERATORE.contatti.telefono_display}</a></li>
      </ul>
      <p>Non è nominato un Responsabile della Protezione dei Dati (DPO), non ricorrendone i presupposti dell&apos;art. 37 GDPR.</p>

      <h2>2. A quali servizi si applica</h2>
      <p>Il sito eroga servizi con regimi diversi. Le sezioni 1, 3, 6, 9, 10, 11 e 12 valgono per tutti; le sezioni 7 e 8 contengono le parti specifiche.</p>
      <ul>
        <li><strong>Assicurazioni e previdenza complementare</strong> — il titolare opera come intermediario iscritto al RUI in sezione {OPERATORE.collaboratore.rui_sezione} n. {OPERATORE.collaboratore.rui_numero}, per conto di {OPERATORE.broker.ragione_sociale}, iscritta al RUI in sezione {OPERATORE.broker.rui_sezione} n. {OPERATORE.broker.rui_numero}.</li>
        <li><strong>Comparazione forniture luce e gas</strong> — <em>servizio attualmente sospeso.</em> Questa informativa continua a descriverlo perché riguarda i dati raccolti quando era attivo, che restano in archivio e sui quali l&apos;interessato conserva i diritti di cui alla § 10. Non è intermediazione assicurativa, non rientra nel perimetro RUI e non è soggetto alla vigilanza IVASS: il titolare opera in proprio.</li>
      </ul>

      <h2>3. Dati trattati</h2>
      <ul>
        <li><strong>Moduli di preventivo e di contatto rapido:</strong> nome, email, telefono, CAP, l&apos;area di interesse e i dati del rischio da assicurare (es. targa del veicolo, dati dell&apos;attività), oltre all&apos;eventuale messaggio libero.</li>
        <li><strong>Modulo luce e gas:</strong> tipo di fornitura (energia elettrica, gas o entrambe), CAP di fornitura, fascia di spesa mensile indicativa, nome, email e — se conferito volontariamente — telefono. In una fase successiva e solo su ulteriore richiesta specifica: codice POD e/o PdR, consumo annuo e dati di bolletta.</li>
        <li><strong>Prova del consenso:</strong> per ogni invio vengono registrati data e ora, indirizzo IP, user-agent, lo stato di ciascun consenso in forma distinta e l&apos;identificativo di versione dell&apos;informativa e dei testi di consenso vigenti in quel momento. Servono a dimostrare che il consenso è stato prestato e a quali condizioni (art. 7.1 GDPR).</li>
        <li><strong>Dati di navigazione:</strong> log tecnici trasmessi dal browser (indirizzo IP, user-agent, pagine richieste) e parametri di provenienza della campagna, necessari al funzionamento e alla sicurezza del sito.</li>
        <li><strong>Cookie:</strong> vedi la <a href="/cookie">Cookie Policy</a>.</li>
      </ul>
      <p>Non sono richieste né devono essere inserite categorie particolari di dati ai sensi dell&apos;art. 9 GDPR.</p>

      <h2>4. Finalità e basi giuridiche</h2>
      <ul>
        <li><strong>Rispondere alla richiesta di preventivo e ricontattare l&apos;interessato</strong> — consenso (art. 6.1.a) e misure precontrattuali (art. 6.1.b).</li>
        <li><strong>Analisi delle esigenze assicurative, esecuzione del contratto e gestione dei sinistri</strong> — contratto (art. 6.1.b) e obblighi di legge (art. 6.1.c: art. 119-bis CAP, Reg. IVASS 40/2018).</li>
        <li><strong>Confronto delle offerte di fornitura luce e gas e formulazione di una proposta</strong> — consenso (art. 6.1.a) e misure precontrattuali (art. 6.1.b).</li>
        <li><strong>Comunicazione dei dati ai fornitori di energia partner</strong>, per la formulazione di un&apos;offerta e l&apos;eventuale attivazione della fornitura — <strong>consenso specifico e distinto</strong> (art. 6.1.a).</li>
        <li><strong>Invio di comunicazioni commerciali</strong> sui servizi del titolare — consenso specifico e distinto (art. 6.1.a).</li>
        <li><strong>Adempimenti di legge</strong> (IVASS, antiriciclaggio, fiscali) e difesa di un diritto in giudizio — obbligo di legge e legittimo interesse (artt. 6.1.c e 6.1.f).</li>
        <li><strong>Dimostrare l&apos;avvenuta acquisizione del consenso</strong> — legittimo interesse del titolare (art. 6.1.f), in adempimento dell&apos;art. 7.1 GDPR.</li>
        <li><strong>Sicurezza e funzionamento del sito</strong> — legittimo interesse (art. 6.1.f).</li>
      </ul>

      <h2>5. Consensi richiesti</h2>
      <p>I consensi sono raccolti separatamente, con caselle distinte e mai pre-spuntate. Ciascuno è indipendente dagli altri e revocabile in qualsiasi momento.</p>
      <ul>
        <li><strong>Contatto</strong> — necessario per dare seguito alla richiesta. Senza, il servizio non può essere erogato.</li>
        <li><strong>Comunicazione ai fornitori di energia</strong> — facoltativo. Il rifiuto non impedisce il confronto delle offerte, ma impedisce di trasmettere la richiesta ai fornitori e quindi di ricevere da loro un&apos;offerta.</li>
        <li><strong>Comunicazioni commerciali</strong> — facoltativo. Il rifiuto non ha alcuna conseguenza sul servizio.</li>
      </ul>

      <h2>6. Conservazione</h2>
      <ul>
        <li><strong>Richieste non finalizzate:</strong> fino a 24 mesi dall&apos;ultima interazione.</li>
        <li><strong>Dati contrattuali:</strong> durata del contratto più 10 anni (obblighi fiscali e IVASS).</li>
        <li><strong>Dati di sinistro:</strong> 10 anni dalla chiusura.</li>
        <li><strong>Consensi commerciali e alla comunicazione ai fornitori:</strong> fino alla revoca e comunque non oltre 24 mesi dall&apos;ultima interazione.</li>
        <li><strong>Prova del consenso:</strong> 10 anni dalla raccolta o dalla revoca, quale termine di prescrizione ordinaria.</li>
        <li><strong>Log di navigazione:</strong> massimo 12 mesi.</li>
        <li><strong>Copia presso il servizio di recapito dei moduli</strong> (Web3Forms): fino a 3 anni dall&apos;invio, per configurazione del fornitore. &Egrave; una copia tecnica del messaggio, distinta dall&apos;archivio del titolare.</li>
      </ul>

      <h2>7. Destinatari</h2>
      <ul>
        <li>Personale autorizzato del titolare (art. 29 GDPR).</li>
        <li>Compagnie assicurative ed enti di previdenza partner, quali autonomi titolari.</li>
        <li><strong>Fornitori di energia elettrica e gas partner</strong>, quali autonomi titolari, nei soli limiti del consenso prestato: vedi § 8.</li>
        <li>Responsabili esterni (art. 28 GDPR): <strong>Supabase</strong> (banca dati, regione Francoforte, UE), <strong>Vercel</strong> (hosting e funzioni server, regione UE), <strong>Web3Creative &mdash; Web3Forms</strong> (recapito al titolare delle richieste inviate dai moduli del sito), <strong>Resend</strong> (email transazionali).</li>
        <li>Autorità competenti (IVASS, UIF, autorità giudiziaria) nei casi previsti dalla legge.</li>
      </ul>
      <p>I dati non sono diffusi né ceduti a terzi per finalità diverse da quelle indicate.</p>

      <h2>8. Servizio luce e gas: come funziona</h2>
      <p><strong>Cosa facciamo.</strong> I dati di fornitura servono a individuare, fra le offerte dei fornitori con cui il titolare ha un accordo in essere, quelle compatibili con il profilo di consumo dell&apos;interessato, e a comunicargli l&apos;esito del confronto.</p>
      <p><strong>I fornitori sono titolari autonomi.</strong> Se l&apos;interessato ha prestato il consenso specifico, i dati sono comunicati ai fornitori partner, che li trattano <strong>in qualità di titolari autonomi</strong>, per proprie finalità e sotto la propria responsabilità, secondo la propria informativa. Il titolare non risponde dei trattamenti successivi alla comunicazione: per esercitare i propri diritti nei confronti di un fornitore occorre rivolgersi direttamente a quest&apos;ultimo.</p>
      <p><strong>Elenco dei fornitori.</strong> L&apos;elenco aggiornato dei fornitori ai quali i dati possono essere comunicati è disponibile in ogni momento su richiesta scritta all&apos;indirizzo indicato alla § 1. L&apos;ingresso di un nuovo fornitore non consente di comunicargli i dati già raccolti senza un rinnovo del consenso.</p>
      <p><strong>Come contattiamo l&apos;interessato.</strong> Solo sui recapiti che ha conferito volontariamente e per i quali ha prestato consenso. Il titolare <strong>non effettua né commissiona chiamate commerciali non richieste</strong>, non acquista liste di contatti da terzi e non utilizza numerazioni reperite da fonti diverse dal conferimento diretto.</p>
      <p><strong>Il servizio è gratuito</strong> per l&apos;interessato. Il titolare percepisce un compenso dal fornitore in caso di attivazione della fornitura. La circostanza è resa nota per trasparenza e non incide sul trattamento dei dati personali.</p>

      <h2>9. Trasferimenti extra-UE e decisioni automatizzate</h2>
      <p>Il trattamento avviene in via prioritaria <strong>all&apos;interno dell&apos;Unione Europea</strong>: banca dati su Supabase e funzioni server su Vercel in regione Francoforte.</p>
      <p><strong>Web3Creative</strong>, che fornisce il servizio Web3Forms usato per recapitare le richieste inviate dai moduli, opera dall&apos;India e si avvale a sua volta di sub-responsabili situati anche fuori dall&apos;Unione: il trasferimento avviene sulla base delle <strong>Standard Contractual Clauses</strong> (decisione 2021/914). I dati interessati sono quelli che l&apos;interessato inserisce nel modulo.</p>
      <p>Altri trasferimenti extra-UE residui possono avvenire verso <strong>Resend</strong> (Standard Contractual Clauses, decisione 2021/914) e verso <strong>Google</strong> e <strong>Meta</strong> — solo previo consenso cookie — sulla base dell&apos;<strong>EU-U.S. Data Privacy Framework</strong> (decisione di adeguatezza del 10/07/2023).</p>
      <p>Non sono effettuati processi decisionali automatizzati né profilazione ai sensi dell&apos;art. 22 GDPR. L&apos;ordine in cui le offerte sono presentate dipende dalla convenienza economica rispetto ai dati conferiti; la scelta se aderire resta integralmente dell&apos;interessato.</p>

      <h2>10. Diritti dell&apos;interessato</h2>
      <p>L&apos;interessato può esercitare in qualsiasi momento i diritti di accesso (art. 15), rettifica (art. 16), cancellazione (art. 17), limitazione (art. 18), portabilità (art. 20) e opposizione (art. 21), oltre alla revoca del consenso, che non pregiudica la liceità del trattamento già effettuato.</p>
      <p>La revoca del consenso alla comunicazione ai fornitori impedisce ogni ulteriore comunicazione, ma non produce effetti sui trattamenti già avviati dai fornitori che hanno ricevuto i dati prima della revoca: per quelli occorre rivolgersi direttamente al fornitore.</p>
      <p>Per esercitarli scrivere a <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a>. Risposta entro 30 giorni, prorogabili di 60 nei casi complessi (art. 12 c.3 GDPR).</p>
      <p>Il conferimento dei dati è facoltativo, ma senza i dati di contatto non è possibile dare seguito alla richiesta.</p>

      <h2>11. Reclamo al Garante</h2>
      <p>L&apos;interessato ha diritto di proporre reclamo al <strong>Garante per la Protezione dei Dati Personali</strong>: Piazza Venezia 11, 00187 Roma · <a href="mailto:garante@gpdp.it">garante@gpdp.it</a> · <a href="https://www.garanteprivacy.it" rel="external noopener" target="_blank">www.garanteprivacy.it</a></p>

      <h2>12. Versione dell&apos;informativa</h2>
      <p>Versione <strong>{INFORMATIVA_VERSIONE}</strong> del 15 settembre 2026. La versione vigente al momento della raccolta di ciascun dato è conservata insieme al dato stesso e può essere richiesta dall&apos;interessato. Le modifiche che incidono su finalità o destinatari sono comunicate agli interessati e, ove necessario, comportano la richiesta di un nuovo consenso.</p>
      </LegalPage>
    </>
  );
}
