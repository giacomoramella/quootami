import Link from 'next/link';

/**
 * Corpo articolo: "Auto ferma in garage: va assicurata?".
 *
 * Fonte: art. 122 Codice delle Assicurazioni Private come modificato dal
 * D.Lgs. 184/2023 (GU n. 290 del 13/12/2023), che recepisce la Direttiva (UE)
 * 2021/2118; correttivo D.Lgs. 57/2026, in vigore dal 12 maggio 2026.
 * Testo letterale della regola: l'obbligo si applica "indipendentemente dalle
 * caratteristiche del veicolo, dal terreno su cui è utilizzato e dal fatto che
 * sia fermo o in movimento".
 *
 * NOTA: i termini della sospensione (durata, preavviso) sono contrattuali e
 * variano per compagnia — non vengono indicati come regola di legge.
 */
export function AutoFermaAssicurazione() {
  return (
    <>
      <p>
        È una delle domande più frequenti, e la risposta sorprende quasi tutti: se il veicolo è
        immatricolato ed è tecnicamente in grado di muoversi, <strong>va assicurato anche se resta
        fermo</strong> in garage, in cortile o in un piazzale aziendale chiuso.
      </p>

      <h2>Perché non conta se circoli o no</h2>
      <p>
        Fino a qualche anno fa il ragionamento comune era: «non lo uso, non lo assicuro». Oggi la
        norma è esplicita e ribalta il criterio — non conta la circolazione, conta l’
        <strong>idoneità del mezzo a essere usato come mezzo di trasporto</strong>:
      </p>
      <blockquote>
        <p>
          «L’obbligo di assicurazione per la responsabilità civile si applica ai veicoli a motore
          indipendentemente dalle caratteristiche del veicolo, dal terreno su cui è utilizzato e dal
          fatto che sia fermo o in movimento.»
        </p>
      </blockquote>
      <p>
        In pratica: un’auto targata e funzionante, parcheggiata in un box privato, resta soggetta
        all’obbligo. Il ragionamento nasce dalla normativa europea ed è stato recepito in Italia
        modificando il Codice delle Assicurazioni Private.
      </p>

      <h2>I casi in cui l’obbligo non si applica</h2>
      <p>La legge indica situazioni precise in cui il veicolo è fuori dall’obbligo:</p>
      <ul>
        <li>
          veicoli <strong>formalmente ritirati dalla circolazione</strong> (per esempio radiati dal
          PRA);
        </li>
        <li>
          veicoli il cui uso è <strong>vietato da un’autorità</strong>, temporaneamente o in modo
          permanente (sequestro, fermo, confisca);
        </li>
        <li>
          veicoli <strong>non idonei</strong> all’uso come mezzo di trasporto — è il caso del mezzo
          privo di parti essenziali, ad esempio senza motore o senza ruote, che non può muoversi
          autonomamente;
        </li>
        <li>
          veicoli per cui l’uso è stato <strong>volontariamente sospeso</strong> con comunicazione
          all’assicuratore;
        </li>
        <li>carrozzine per persone con disabilità e biciclette a pedalata assistita.</li>
      </ul>
      <p>
        Attenzione al terzo punto: «non idoneo» non significa «vecchio» o «non revisionato».
        Significa materialmente incapace di funzionare come mezzo di trasporto. Un’auto ferma da
        anni ma con motore e ruote resta assicurabile e quindi soggetta all’obbligo.
      </p>

      <h2>La strada pratica: sospendere la polizza</h2>
      <p>
        Se il veicolo resta inutilizzato per un periodo — la moto d’inverno, il camper d’estate, la
        seconda auto — la soluzione non è disdire, ma <strong>sospendere la garanzia</strong>. Il
        contratto resta in vita, i premi non pagati si recuperano alla riattivazione e non si perde
        la classe di merito.
      </p>
      <p>
        Durata massima della sospensione e preavviso <strong>variano da compagnia a compagnia</strong>:
        sono condizioni contrattuali, non regole uguali per tutti. È il punto da verificare prima di
        scegliere, soprattutto se prevedi fermi lunghi e ricorrenti.
      </p>

      <h2>Le novità per storici e uso stagionale</h2>
      <p>
        Il correttivo entrato in vigore nel maggio 2026 ha introdotto strumenti più flessibili:
      </p>
      <ul>
        <li>
          per i <strong>veicoli storici</strong>, schemi che distinguono il rischio statico (mezzo
          fermo in garage o esposto) da quello dinamico (legato alla circolazione);
        </li>
        <li>
          <strong>polizze infrannuali</strong>, di durata inferiore all’anno, pensate per usi
          stagionali: moto, cabriolet, camper, motoslitte.
        </li>
      </ul>
      <p>
        Se hai un mezzo che usi solo pochi mesi l’anno, sono le due opzioni da chiedere
        esplicitamente: raramente vengono proposte da sole.
      </p>

      <h2>Cosa rischi se lasci il veicolo scoperto</h2>
      <p>
        Oltre alla sanzione per mancata assicurazione, c’è un aspetto che pesa di più: senza
        copertura sei <strong>personalmente responsabile</strong> dei danni che il veicolo dovesse
        causare, anche da fermo (per esempio un incendio che si propaga in garage). E la
        riattivazione dopo un lungo periodo scoperto può comportare condizioni peggiori.
      </p>

      <h2>In sintesi</h2>
      <ol>
        <li>Veicolo targato e funzionante = obbligo di assicurazione, anche se non circola.</li>
        <li>Se non lo usi per un periodo, chiedi la <strong>sospensione</strong>, non la disdetta.</li>
        <li>
          Se è davvero inutilizzabile o vuoi chiudere la partita, valuta la{' '}
          <strong>radiazione</strong>: è l’unica via che elimina l’obbligo in modo definitivo.
        </li>
        <li>Per usi stagionali, chiedi le polizze infrannuali.</li>
      </ol>

      <p>
        Vuoi capire quale formula conviene al tuo caso? Dai un’occhiata alla{' '}
        <Link href="/polizza-auto">polizza auto</Link>: confrontare più compagnie su sospensione e
        formule stagionali fa spesso una differenza superiore allo sconto sul premio.
      </p>

      <hr />
      <p className="text-sm">
        <strong>Fonti:</strong> art. 122 Codice delle Assicurazioni Private come modificato dal
        D.Lgs. 184/2023 (in recepimento della Direttiva UE 2021/2118) e dal correttivo
        D.Lgs. 57/2026, in vigore dal 12 maggio 2026. Contenuto a carattere divulgativo, aggiornato
        ad agosto 2026: le condizioni di sospensione dipendono dal singolo contratto.
      </p>
    </>
  );
}
