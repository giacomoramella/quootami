import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { OPERATORE } from '@/config/operatore';

export const metadata: Metadata = {
  title: 'Trasparenza intermediario',
  description: 'Trasparenza dell\'intermediario assicurativo ai sensi del Reg. IVASS 40/2018, IDD e art. 119-bis CAP.',
};

export default function TrasparenzaPage() {
  return (
    <LegalPage
      eyebrow="Reg. IVASS 40/2018 · Art. 119-bis CAP"
      title="Trasparenza"
      titleAccent="intermediario."
      intro="Informazioni sull'intermediario, sulla sua attività e sui rapporti contrattuali con le compagnie partner. Ai sensi del Reg. IVASS 40/2018 e della normativa IDD."
      lastUpdate="17 giugno 2026"
    >
      <h2>1. Identificazione dell&apos;intermediario</h2>
      <ul>
        <li><strong>Broker (titolare):</strong> {OPERATORE.broker.ragione_sociale}</li>
        <li><strong>P.IVA / C.F.:</strong> {OPERATORE.broker.partita_iva}</li>
        <li><strong>Iscrizione RUI sez. {OPERATORE.broker.rui_sezione} n.</strong> {OPERATORE.broker.rui_numero}</li>
        <li><strong>Collaboratore operativo:</strong> {OPERATORE.collaboratore.nome_completo}</li>
        <li><strong>Iscrizione RUI sez. {OPERATORE.collaboratore.rui_sezione} n.</strong> {OPERATORE.collaboratore.rui_numero}</li>
        <li><strong>Email:</strong> <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a></li>
        <li><strong>Telefono:</strong> <a href={`tel:${OPERATORE.contatti.telefono_tel}`}>{OPERATORE.contatti.telefono_display}</a></li>
        <li><strong>Autorità di vigilanza:</strong> <a href="https://www.ivass.it" target="_blank" rel="noopener noreferrer">IVASS</a> — Istituto per la Vigilanza sulle Assicurazioni.</li>
      </ul>
      <p>Gli estremi di iscrizione al RUI sono consultabili sul <a href="https://ruipubblico.ivass.it/rui-pubblica/" target="_blank" rel="noopener noreferrer">Registro Unico degli Intermediari</a> tenuto da IVASS.</p>

      <h2>2. Ruolo del broker</h2>
      <p>{OPERATORE.brand.name} opera come <strong>broker assicurativo indipendente</strong>: agisce nell&apos;interesse del cliente e non delle compagnie. L&apos;analisi delle proposte avviene su base oggettiva, confrontando più compagnie partner per individuare la soluzione più adeguata alle esigenze del cliente.</p>

      <h2>3. Retribuzione</h2>
      <p>Il broker è retribuito dalle compagnie assicurative tramite provvigione sui contratti stipulati. Non sono richiesti compensi diretti al cliente per la consulenza precontrattuale né per la mediazione, salvo accordi specifici comunicati per iscritto prima della sottoscrizione.</p>
      <p>Il collaboratore iscritto al RUI sez. {OPERATORE.collaboratore.rui_sezione} è retribuito dal broker secondo gli accordi del contratto di collaborazione e <strong>non riceve provvigioni dirette dalle compagnie</strong>.</p>

      <h2>4. Conflitto di interessi</h2>
      <p>{OPERATORE.brand.name} non ha partecipazioni dirette o indirette nelle compagnie partner né le compagnie hanno partecipazioni superiori al 10% nel capitale del broker. Se in una specifica circostanza dovesse manifestarsi un conflitto di interesse rilevante, verrà comunicato per iscritto prima della sottoscrizione, secondo le procedure stabilite dal broker.</p>

      <h2>5. Analisi delle esigenze (Art. 119-bis CAP)</h2>
      <p>Prima di proporre un prodotto, il broker effettua un&apos;analisi delle esigenze e delle richieste del cliente, raccogliendo informazioni sul rischio da assicurare, sulla capacità finanziaria e sugli obiettivi di copertura. L&apos;analisi viene formalizzata e consegnata al cliente.</p>
      <p>Per i prodotti vita (IBIP) si esegue il test di adeguatezza/appropriatezza ai sensi dell&apos;art. 121-quinquies CAP e dei Reg. IVASS 41/2020 e 45/2020.</p>

      <h2 id="reclami">6. Reclami</h2>
      <p>I reclami sull&apos;attività del broker possono essere presentati per iscritto a:</p>
      <ul>
        <li>Email: <a href={`mailto:${OPERATORE.contatti.email}`}>{OPERATORE.contatti.email}</a></li>
        <li>Sede del broker: {OPERATORE.broker.ragione_sociale}</li>
      </ul>
      <p>Il broker risponde entro <strong>45 giorni</strong> dal ricevimento del reclamo. In caso di mancata o insoddisfacente risposta, il reclamante può rivolgersi a:</p>
      <ul>
        <li><strong>IVASS</strong> — Servizio Tutela del Consumatore, Via del Quirinale 21, 00187 Roma. <a href="https://www.ivass.it/consumatori/reclami/" target="_blank" rel="noopener noreferrer">Modulo reclami IVASS</a>.</li>
        <li><strong>Arbitro Assicurativo</strong> — sistema di risoluzione alternativa delle controversie ai sensi del D.Lgs. 130/2015 (quando operativo).</li>
      </ul>
      <p>Per reclami sull&apos;esecuzione del contratto (sinistri, liquidazioni, comportamenti della compagnia), il reclamo va inviato direttamente alla compagnia, con le modalità indicate nelle condizioni di polizza.</p>

      <h2>7. Polizza di Responsabilità Civile professionale</h2>
      <p>Il broker è coperto da polizza di Responsabilità Civile professionale per i danni derivanti dall&apos;attività di intermediazione, secondo i minimi richiesti dalla normativa IVASS.</p>

      <h2>8. Privacy e protezione dei dati</h2>
      <p>Per il trattamento dei dati personali raccolti tramite il sito si rinvia alla <a href="/privacy">Privacy Policy</a> e alla <a href="/cookie">Cookie Policy</a>.</p>

      <h2>9. Riferimenti normativi</h2>
      <ul>
        <li>D.Lgs. 209/2005 (Codice delle Assicurazioni Private, CAP)</li>
        <li>Direttiva 2016/97/UE (IDD)</li>
        <li>Reg. IVASS 40/2018 (regole di comportamento)</li>
        <li>Reg. IVASS 41/2020, 45/2020 (analisi esigenze, POG)</li>
        <li>Reg. UE 2016/679 (GDPR)</li>
      </ul>
    </LegalPage>
  );
}
