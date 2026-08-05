import Link from 'next/link';

/**
 * Corpo articolo: "Detrazione 19% sulla polizza casa contro gli eventi calamitosi".
 *
 * Regola in vigore dal 1° gennaio 2018: detrazione IRPEF del 19% sui premi delle
 * assicurazioni contro eventi calamitosi su unità immobiliari a uso abitativo,
 * SENZA limite di importo (a differenza della detrazione vita/infortuni, che ha
 * il tetto di 530 euro). Consiglio operativo distintivo: nelle multirischio serve
 * lo scorporo in certificazione della quota di premio calamitosa.
 */
export function DetrazioneCalamitosi() {
  return (
    <>
      <p>
        Tra le detrazioni assicurative è la più generosa e la meno conosciuta: sui premi delle
        polizze che coprono <strong>eventi calamitosi</strong> su immobili a uso abitativo spetta una
        detrazione IRPEF del <strong>19% senza limite di importo</strong>. Non c’è il tetto di spesa
        che invece si applica alle polizze vita e infortuni.
      </p>

      <h2>Chi ne ha diritto</h2>
      <ul>
        <li>
          La polizza deve riguardare <strong>unità immobiliari a uso abitativo</strong>. Non è
          richiesto che si tratti della prima casa: la detrazione può riguardare anche più immobili.
        </li>
        <li>
          Spetta a chi <strong>paga il premio</strong> in quanto contraente, a prescindere
          dall’intestazione dell’immobile.
        </li>
        <li>
          <strong>Non spetta</strong> se la polizza copre soltanto una pertinenza (per esempio il
          solo box auto) senza l’abitazione.
        </li>
      </ul>

      <h2>Il punto che fa perdere la detrazione</h2>
      <p>
        Quasi nessuno stipula una polizza «solo calamità»: nella pratica si acquista una{' '}
        <strong>multirischio casa</strong>, dove la garanzia contro gli eventi calamitosi è una delle
        tante insieme a furto, incendio e responsabilità civile.
      </p>
      <blockquote>
        <p>
          La detrazione spetta <strong>solo sulla quota di premio</strong> riferita alle garanzie
          calamitose, non sull’intero premio della multirischio. Serve quindi che la compagnia
          indichi separatamente quell’importo nella certificazione annuale dei premi.
        </p>
      </blockquote>
      <p>
        È il passaggio dove si perde più spesso il beneficio: se la certificazione riporta un unico
        importo complessivo, in dichiarazione non si sa quanto portare in detrazione. La richiesta
        di scorporo va fatta alla compagnia — meglio se al momento della stipula, ma è ottenibile
        anche dopo.
      </p>

      <h2>Come si porta in dichiarazione</h2>
      <ol>
        <li>Recupera la <strong>certificazione dei premi</strong> emessa dalla compagnia.</li>
        <li>
          Verifica che la quota relativa agli eventi calamitosi sia indicata in modo distinto.
        </li>
        <li>
          Conserva la <strong>prova di pagamento tracciabile</strong> del premio.
        </li>
        <li>
          Indica l’importo nel quadro degli oneri detraibili del modello 730 o Redditi.
        </li>
      </ol>

      <h2>Non confonderla con le altre detrazioni assicurative</h2>
      <div className="tabella-scroll">
        <table>
          <thead>
            <tr>
              <th>Tipo di polizza</th>
              <th>Detrazione</th>
              <th>Limite di spesa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Eventi calamitosi su immobili residenziali</td>
              <td>19%</td>
              <td><strong>Nessun limite</strong></td>
            </tr>
            <tr>
              <td>Vita e infortuni (rischio morte o invalidità permanente)</td>
              <td>19%</td>
              <td>530 € di premio annuo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Il vantaggio fiscale non è il motivo per cui assicurare casa, ma cambia parecchio il costo
        reale della copertura: su una garanzia calamitosa da 300 euro l’anno, quasi 60 euro tornano
        indietro. Se stai valutando una{' '}
        <Link href="/polizza-casa">polizza casa</Link>, chiedi fin da subito che la quota
        calamitosa sia certificata separatamente.
      </p>

      <hr />
      <p className="text-sm">
        <strong>Fonti:</strong> art. 15, comma 1, lett. f-bis del TUIR (D.P.R. 917/1986), introdotta
        dalla Legge di Bilancio 2018 (L. 205/2017) e applicabile ai premi versati dal 1° gennaio 2018
        per polizze contro eventi calamitosi su unità immobiliari a uso abitativo; art. 15, comma 1,
        lett. f del TUIR per il limite di €530 su vita e infortuni. Contenuto a carattere
        divulgativo, aggiornato ad agosto 2026: non costituisce consulenza fiscale, per il caso
        specifico rivolgiti al tuo intermediario e al tuo commercialista.
      </p>
    </>
  );
}
