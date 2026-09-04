import type { Metadata } from 'next';
import { OPERATORE } from '@/config/operatore';
import { LegalPage } from '@/components/LegalPage';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

/**
 * Informazioni sull'intermediario — art. 79 Reg. IVASS 40/2018.
 *
 * La norma impone che i dati identificativi, la sede, i recapiti, la
 * sottoposizione alla vigilanza IVASS e i canali di reclamo stiano «nella home
 * page, ovvero in una apposita pagina direttamente accessibile dalla home
 * page». Questa è quella pagina: il link vive nel footer, presente su tutte le
 * pagine home inclusa.
 *
 * NON è la pagina /trasparenza eliminata il 05/08/2026: qui non c'è
 * l'informativa precontrattuale IDD (ruolo, remunerazione, conflitti di
 * interesse), che resta fuori dal sito e viene consegnata al cliente per altra
 * via. Qui c'è solo ciò che l'art. 79 richiede di pubblicare.
 *
 * La lettera e) dell'art. 79 — reclami, Arbitro Assicurativo e altri sistemi
 * stragiudiziali — è stata riscritta dal Provvedimento IVASS n. 163/2025.
 * L'Arbitro Assicurativo è operativo dal 15 gennaio 2026.
 */

const { collaboratore, broker, contatti } = OPERATORE;

const META_TITLE = 'Informazioni sull\'intermediario';
const META_DESC =
  'Dati identificativi, iscrizione al RUI, sede, recapiti, vigilanza IVASS e canali di reclamo, ai sensi dell\'art. 79 del Regolamento IVASS n. 40/2018.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
};

export default function InformazioniIntermediarioPage() {
  return (
    <>
      <JsonLdBreadcrumb
        voci={[{ nome: 'Informazioni sull\'intermediario', href: '/informazioni-intermediario' }]}
      />
      <LegalPage
        eyebrow="Art. 79 Reg. IVASS 40/2018"
        title="Informazioni"
        titleAccent="sull'intermediario."
        intro="Chi gestisce questo sito, con quale iscrizione opera, dove ha sede e come presentare un reclamo."
        lastUpdate="4 settembre 2026"
      >
        <h2>1. Chi opera su questo sito</h2>
        <p>
          Il sito è gestito da <strong>{collaboratore.nome_completo}</strong>, intermediario
          assicurativo iscritto al Registro Unico degli Intermediari (RUI) nella{' '}
          <strong>sezione {collaboratore.rui_sezione}</strong> con il numero{' '}
          <strong>{collaboratore.rui_numero}</strong>, che opera per conto di{' '}
          <strong>{broker.ragione_sociale}</strong>, broker iscritto al RUI nella{' '}
          <strong>sezione {broker.rui_sezione}</strong> con il numero{' '}
          <strong>{broker.rui_numero}</strong> — P.IVA {broker.partita_iva}.
        </p>
        <p>
          Gli estremi di entrambe le iscrizioni sono consultabili da chiunque nel registro pubblico
          tenuto dall&apos;IVASS:{' '}
          <a href="https://www.ivass.it/consumatori/rui/index.html" rel="external noopener noreferrer" target="_blank">
            www.ivass.it/consumatori/rui
          </a>
          .
        </p>

        <h2>2. Sede</h2>
        <ul>
          <li>
            <strong>Sede:</strong> {broker.sede.via}, {broker.sede.cap} {broker.sede.citta} (
            {broker.sede.provincia})
          </li>
        </ul>

        <h2>3. Recapiti</h2>
        <ul>
          <li>
            <strong>Telefono:</strong>{' '}
            <a href={`tel:${contatti.telefono_tel}`}>{contatti.telefono_display}</a> ({contatti.orari})
          </li>
          <li>
            <strong>Email:</strong> <a href={`mailto:${contatti.email}`}>{contatti.email}</a>
          </li>
          <li>
            <strong>Email del broker:</strong>{' '}
            <a href={`mailto:${broker.email}`}>{broker.email}</a> ·{' '}
            <a href={`tel:${broker.telefono_tel}`}>{broker.telefono_display}</a>
          </li>
          <li>
            <strong>PEC:</strong> <a href={`mailto:${broker.pec}`}>{broker.pec}</a>
          </li>
        </ul>

        <h2>4. Vigilanza</h2>
        <p>
          L&apos;attività di intermediazione assicurativa è soggetta alla{' '}
          <strong>vigilanza dell&apos;IVASS</strong> — Istituto per la Vigilanza sulle Assicurazioni,
          Via del Quirinale 21, 00187 Roma —{' '}
          <a href="https://www.ivass.it" rel="external noopener noreferrer" target="_blank">
            www.ivass.it
          </a>
          .
        </p>

        <h2>5. Reclami</h2>
        <p>
          I reclami relativi al comportamento dell&apos;intermediario vanno presentati per iscritto a{' '}
          <strong>{broker.ragione_sociale_breve}</strong>, {broker.sede.via}, {broker.sede.cap}{' '}
          {broker.sede.citta} ({broker.sede.provincia}), oppure via email a{' '}
          <a href={`mailto:${broker.email}`}>{broker.email}</a> o via PEC a{' '}
          <a href={`mailto:${broker.pec}`}>{broker.pec}</a>. La risposta è dovuta entro{' '}
          <strong>45 giorni</strong> dal ricevimento.
        </p>
        <p>
          I reclami che riguardano il contratto o la gestione del sinistro vanno indirizzati
          all&apos;impresa di assicurazione, ai recapiti indicati nella documentazione contrattuale.
        </p>
        <p>
          In caso di risposta insoddisfacente, o in assenza di risposta entro 45 giorni, è possibile
          rivolgersi all&apos;<strong>IVASS</strong> — Servizio Tutela del Consumatore, Via del
          Quirinale 21, 00187 Roma — utilizzando il modulo disponibile su{' '}
          <a href="https://www.ivass.it/consumatori/reclami/index.html" rel="external noopener noreferrer" target="_blank">
            www.ivass.it/consumatori/reclami
          </a>
          .
        </p>

        <h2>6. Arbitro Assicurativo e altri rimedi</h2>
        <p>
          Esaurito il reclamo, il contraente ha facoltà di presentare ricorso all&apos;
          <strong>Arbitro Assicurativo</strong>, il sistema di risoluzione stragiudiziale delle
          controversie assicurative operativo dal 15 gennaio 2026. Il ricorso si presenta
          esclusivamente online, non richiede l&apos;assistenza di un avvocato ed è ammesso quando il
          reclamo non ha ricevuto risposta entro 45 giorni o la risposta non è stata soddisfacente:{' '}
          <a href="https://www.arbitroassicurativo.org" rel="external noopener noreferrer" target="_blank">
            www.arbitroassicurativo.org
          </a>
          .
        </p>
        <p>
          Restano impregiudicati gli altri sistemi di risoluzione stragiudiziale previsti dalla
          normativa vigente — in particolare la <strong>mediazione</strong> ai sensi del D.Lgs.
          28/2010, condizione di procedibilità per le controversie in materia di contratti
          assicurativi, e la <strong>negoziazione assistita</strong> ai sensi del D.L. 132/2014 — così
          come la facoltà di adire l&apos;autorità giudiziaria.
        </p>
      </LegalPage>
    </>
  );
}
