import Link from 'next/link';

/**
 * Corpo articolo: "Adesione automatica al fondo pensione dal 1° luglio 2026".
 *
 * Fonte primaria: Ministero del Lavoro — Legge di Bilancio 2026 (L. 199/2025),
 * in vigore dal 1° luglio 2026.
 * Fatti verificati sulla fonte ministeriale:
 * - decorrenza 1° luglio 2026;
 * - 60 giorni dalla prima assunzione per rinunciare/scegliere diversamente;
 * - in assenza di accordi collettivi applicabili il TFR confluisce nella forma
 *   pensionistica RESIDUALE individuata dal D.M. Lavoro n. 85 del 31/03/2020
 *   (NON viene nominato uno specifico fondo: altre fonti lo fanno, la fonte
 *   primaria no);
 * - contribuzione non obbligatoria sotto la retribuzione annua lorda pari
 *   all'assegno sociale INPS.
 * Deducibilità: la L. 199/2025 ha elevato il limite ordinario da €5.164,57 a
 * €5.300 dal 1° gennaio 2026 (verificato su fonti di settore previdenziale:
 * Mefop, Fondapi, Previbank). Qui il dato non è ripetuto perché l'articolo
 * tratta l'adesione automatica, non il regime fiscale: per quello si rimanda
 * alla guida ai fondi pensione.
 */
export function AdesioneAutomaticaFondoPensione() {
  return (
    <>
      <p>
        Dal <strong>1° luglio 2026</strong> cambia il modo in cui i lavoratori entrano nella
        previdenza complementare: per i nuovi assunti l’adesione a un fondo pensione diventa
        <strong> automatica</strong>, salvo scelta contraria. È un meccanismo di silenzio-assenso:
        se non fai nulla, entri.
      </p>

      <h2>Come funziona</h2>
      <p>
        Al momento della prima assunzione, in assenza di una scelta esplicita, il TFR maturando
        viene destinato alla previdenza complementare. Il lavoratore ha{' '}
        <strong>60 giorni dalla prima assunzione</strong> per manifestare una volontà diversa:
        rinunciare all’adesione automatica oppure scegliere un’altra forma pensionistica.
      </p>
      <p>
        Se il contratto collettivo applicato non prevede un fondo di riferimento, il TFR confluisce
        nella <strong>forma pensionistica residuale</strong> individuata dal regolamento
        ministeriale (D.M. Ministero del Lavoro n. 85 del 31 marzo 2020).
      </p>

      <blockquote>
        <p>
          I <strong>60 giorni</strong> sono il punto su cui prestare attenzione. Passati quelli, la
          scelta si consolida: non è una porta che resta aperta a tempo indeterminato.
        </p>
      </blockquote>

      <h2>Chi resta fuori</h2>
      <p>
        La contribuzione non è obbligatoria quando la <strong>retribuzione annua lorda è inferiore
        all’assegno sociale INPS</strong>: una tutela per i rapporti di lavoro con redditi molto
        bassi, per cui il versamento risulterebbe sproporzionato.
      </p>

      <h2>«Mi hanno iscritto e non lo sapevo»</h2>
      <p>
        È lo scenario che si verificherà più spesso nei prossimi mesi. Se scopri di essere stato
        iscritto a un fondo pensione senza averlo chiesto, prima di allarmarti verifica tre cose:
      </p>
      <ol>
        <li>
          <strong>Da quanto tempo sei stato assunto</strong>: se rientri nei 60 giorni, puoi ancora
          scegliere diversamente.
        </li>
        <li>
          <strong>Quale fondo</strong> ti è stato assegnato: se è il fondo previsto dal tuo CCNL,
          spesso porta con sé il contributo del datore di lavoro — un vantaggio che perderesti
          uscendo.
        </li>
        <li>
          <strong>In quale comparto</strong> è stato investito il versamento: quello di default non
          è detto sia adatto alla tua età e al tuo orizzonte temporale.
        </li>
      </ol>

      <h2>Rinunciare conviene?</h2>
      <p>
        Non esiste una risposta valida per tutti, ma due elementi pesano più degli altri:
      </p>
      <ul>
        <li>
          <strong>Il contributo del datore di lavoro.</strong> Nei fondi negoziali previsti dai CCNL
          l’azienda versa una quota aggiuntiva, ma in genere solo se contribuisci anche tu.
          Rinunciando, rinunci anche a quella.
        </li>
        <li>
          <strong>Il trattamento fiscale.</strong> La previdenza complementare gode di un regime
          fiscale di favore rispetto al TFR lasciato in azienda, sia sui versamenti sia sulla
          prestazione finale.
        </li>
      </ul>
      <p>
        Sul secondo punto trovi numeri e meccanismi nella{' '}
        <Link href="/piano-pensione/guida">guida ai fondi pensione</Link>, e puoi stimare l’effetto
        sul tuo caso con il{' '}
        <Link href="/piano-pensione#calcolatore">calcolatore</Link>.
      </p>

      <h2>Cosa fare adesso</h2>
      <ol>
        <li>Se sei stato assunto di recente, controlla la busta paga e la documentazione ricevuta.</li>
        <li>Verifica se il tuo CCNL prevede un fondo negoziale e con quale contributo aziendale.</li>
        <li>
          Se decidi di restare, controlla il comparto di investimento: è la scelta che incide di più
          sul risultato finale.
        </li>
        <li>Se decidi di uscire, fallo entro i 60 giorni.</li>
      </ol>

      <hr />
      <p className="text-sm">
        <strong>Fonti:</strong> Legge di Bilancio 2026 (L. 199/2025), in vigore dal 1° luglio 2026 —
        Ministero del Lavoro e delle Politiche Sociali; D.M. Ministero del Lavoro n. 85 del
        31 marzo 2020 per la forma pensionistica residuale. Contenuto a carattere divulgativo,
        aggiornato ad agosto 2026: non costituisce consulenza previdenziale sul caso specifico.
      </p>
    </>
  );
}
