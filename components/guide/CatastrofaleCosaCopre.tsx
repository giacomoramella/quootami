import Link from 'next/link';

/**
 * Corpo articolo: "Polizza catastrofale: cosa copre davvero (e cosa no)".
 *
 * Fonte primaria dell'elenco eventi: L. 213/2023, art. 1 comma 101 — testo
 * letterale "sismi, alluvioni, frane, inondazioni ed esondazioni".
 * Tutto ciò che non è in quell'elenco (grandine, trombe d'aria, mareggiate,
 * valanghe, eruzioni vulcaniche) resta fuori dall'obbligo ed è acquistabile
 * solo come garanzia facoltativa.
 */
export function CatastrofaleCosaCopre() {
  return (
    <>
      <p>
        È l’equivoco più diffuso da quando l’obbligo è entrato in vigore: molte imprese stipulano la
        polizza catastrofale e restano convinte di essere protette da qualunque evento naturale.
        In realtà la legge elenca <strong>cinque eventi precisi</strong>, e diversi danni tra i più
        frequenti in Italia restano fuori.
      </p>

      <h2>Gli eventi coperti dall’obbligo</h2>
      <p>La norma parla di danni direttamente cagionati da:</p>
      <ul>
        <li><strong>sismi</strong> (terremoti);</li>
        <li><strong>alluvioni</strong>;</li>
        <li><strong>frane</strong>;</li>
        <li><strong>inondazioni</strong>;</li>
        <li><strong>esondazioni</strong>.</li>
      </ul>
      <p>
        L’elenco è tassativo. Tutto ciò che non compare qui non rientra nell’obbligo — il che non
        vuol dire che sia impossibile assicurarlo, ma che va richiesto a parte.
      </p>

      <h2>Cosa resta fuori (e capita più spesso)</h2>
      <div className="tabella-scroll">
        <table>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Rientra nell’obbligo?</th>
              <th>Come coprirsi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Terremoto, alluvione, frana, inondazione, esondazione</td>
              <td><strong>Sì</strong></td>
              <td>Polizza catastrofale obbligatoria</td>
            </tr>
            <tr>
              <td>Grandine</td>
              <td>No</td>
              <td>Garanzia eventi atmosferici, facoltativa</td>
            </tr>
            <tr>
              <td>Trombe d’aria e vento forte</td>
              <td>No</td>
              <td>Garanzia eventi atmosferici, facoltativa</td>
            </tr>
            <tr>
              <td>Mareggiate</td>
              <td>No</td>
              <td>Estensione dedicata, ove disponibile</td>
            </tr>
            <tr>
              <td>Valanghe e slavine</td>
              <td>No</td>
              <td>Estensione dedicata, ove disponibile</td>
            </tr>
            <tr>
              <td>Eruzioni vulcaniche</td>
              <td>No</td>
              <td>Estensione dedicata, ove disponibile</td>
            </tr>
          </tbody>
        </table>
      </div>

      <blockquote>
        <p>
          Il caso tipico: un capannone perde parte della copertura per una tromba d’aria.
          L’imprenditore è convinto di essere coperto perché ha «la polizza catastrofale».
          Ma la tromba d’aria non è nell’elenco di legge, e senza la garanzia eventi atmosferici
          il danno resta a suo carico.
        </p>
      </blockquote>

      <h2>Franchigie e scoperti: il secondo punto da guardare</h2>
      <p>
        Anche sugli eventi obbligatori la copertura non è mai integrale. Le condizioni prevedono
        <strong> scoperti</strong> (una percentuale del danno che resta a carico dell’impresa) e
        <strong> limiti di indennizzo</strong> parametrati al valore dei beni assicurati. Due
        polizze che sembrano equivalenti sul premio possono differire molto qui: è la parte del
        contratto che conviene leggere per prima.
      </p>

      <h2>Come verificare la propria posizione</h2>
      <ol>
        <li>
          Apri il set informativo della polizza e cerca l’elenco degli eventi assicurati: se trovi
          solo i cinque di legge, sei coperto per l’obbligo e nulla di più.
        </li>
        <li>
          Verifica se esiste già una polizza incendio o all risks: spesso contiene la garanzia
          eventi atmosferici, e in quel caso grandine e vento sono già coperti lì.
        </li>
        <li>
          Controlla scoperti e limiti di indennizzo, non solo il premio.
        </li>
        <li>
          Valuta se il rischio prevalente della tua zona è tra quelli obbligatori o tra quelli
          esclusi: cambia completamente la priorità.
        </li>
      </ol>

      <p>
        Se hai dubbi su cosa copra la polizza che hai già in mano, il modo più rapido è farla
        leggere: le condizioni sono lunghe ma le voci che contano sono poche. Vedi anche{' '}
        <Link href="/guide/polizza-catastrofale-imprese-chi-e-obbligato">
          quali imprese sono obbligate alla polizza catastrofale
        </Link>
        .
      </p>

      <hr />
      <p className="text-sm">
        <strong>Fonti:</strong> L. 213/2023, art. 1 comma 101 (elenco degli eventi). Contenuto a
        carattere divulgativo, aggiornato ad agosto 2026: le garanzie effettive dipendono dalle
        condizioni della singola polizza, che vanno sempre lette prima della sottoscrizione.
      </p>
    </>
  );
}
