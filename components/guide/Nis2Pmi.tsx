import Link from 'next/link';

/**
 * Corpo articolo: "NIS2: la mia PMI è obbligata?".
 *
 * Fonti: Direttiva (UE) 2022/2555 recepita in Italia con D.Lgs. 138/2024;
 * Agenzia per la Cybersicurezza Nazionale (ACN) per registrazione ed elenco
 * dei soggetti; art. 38 D.Lgs. 138/2024 per le sanzioni.
 *
 * CAUTELA: NON si citano scadenze operative 2026 (registrazione, misure di
 * base) perché reperibili solo su fonti secondarie discordanti. L'articolo
 * rimanda ad ACN per le finestre temporali aggiornate.
 * Nessun premio assicurativo indicato: sarebbero cifre non verificabili.
 */
export function Nis2Pmi() {
  return (
    <>
      <p>
        La direttiva europea NIS2 ha allargato di molto il perimetro delle imprese tenute a
        garantire un livello minimo di sicurezza informatica. In Italia è stata recepita con il
        <strong> D.Lgs. 138/2024</strong>, e i settori interessati sono passati da 7 a{' '}
        <strong>18</strong>. La domanda che si pongono quasi tutte le PMI è la stessa: riguarda
        anche me?
      </p>

      <h2>Il criterio: settore + dimensione</h2>
      <p>Per rientrare direttamente nell’ambito di applicazione servono due condizioni insieme:</p>
      <ol>
        <li>
          operare in uno dei <strong>settori individuati dalla norma</strong> (tra gli altri:
          energia, trasporti, sanità, acqua, infrastrutture digitali, pubblica amministrazione,
          gestione rifiuti, produzione e distribuzione di alimenti, fabbricazione di dispositivi,
          servizi postali);
        </li>
        <li>
          superare le <strong>soglie dimensionali</strong>: come regola generale, almeno 50
          dipendenti oppure 10 milioni di euro di fatturato annuo.
        </li>
      </ol>
      <p>
        Sotto quelle soglie, di norma l’obbligo non scatta. Ma ci sono due eccezioni importanti che
        riguardano proprio le imprese piccole.
      </p>

      <h2>Le due eccezioni che colpiscono le PMI</h2>
      <h3>1. L’inclusione decisa dall’Autorità</h3>
      <p>
        L’Agenzia per la Cybersicurezza Nazionale può includere nell’elenco dei soggetti anche
        imprese <strong>sotto soglia</strong>, quando svolgono funzioni critiche per la sicurezza
        nazionale o per l’economia. La dimensione, da sola, non mette al riparo.
      </p>
      <h3>2. L’effetto catena sui fornitori</h3>
      <p>
        È il punto che sta cambiando davvero le cose. I soggetti obbligati devono presidiare la
        sicurezza della propria <strong>catena di fornitura</strong>: nella pratica, lo fanno
        inserendo requisiti di sicurezza nei contratti con i fornitori.
      </p>
      <blockquote>
        <p>
          Risultato: molte PMI che non rientrano nella NIS2 si vedono comunque richiedere
          questionari di sicurezza, certificazioni o clausole contrattuali dai clienti più grandi.
          Non è un obbligo di legge diretto, ma <strong>diventa una condizione per lavorare</strong>.
        </p>
      </blockquote>

      <h2>Cosa comporta essere dentro</h2>
      <ul>
        <li><strong>Registrarsi</strong> sulla piattaforma dell’ACN come soggetto NIS.</li>
        <li>
          Adottare <strong>misure di gestione del rischio</strong> proporzionate: analisi dei rischi,
          gestione degli incidenti, continuità operativa, sicurezza della catena di fornitura,
          controllo degli accessi.
        </li>
        <li>
          <strong>Notificare gli incidenti</strong> significativi secondo i tempi e le modalità
          previsti.
        </li>
        <li>
          Coinvolgere gli <strong>organi di amministrazione</strong>: la NIS2 attribuisce
          responsabilità dirette al vertice aziendale sull’approvazione e sulla supervisione delle
          misure.
        </li>
      </ul>
      <p>
        Le sanzioni previste sono rilevanti: per i soggetti «importanti» l’articolo 38 del
        D.Lgs. 138/2024 arriva fino a 7 milioni di euro o all’1,4% del fatturato annuo mondiale, con
        soglie più alte per i soggetti «essenziali».
      </p>
      <p className="text-sm">
        Le finestre temporali per registrazione e adeguamento sono definite e aggiornate
        dall’ACN: sono l’unico riferimento da usare per le scadenze, che variano in base alla
        categoria di soggetto.
      </p>

      <h2>Dove entra l’assicurazione</h2>
      <p>
        Qui va detta una cosa con chiarezza: <strong>nessuna polizza rende conformi alla NIS2</strong>.
        La conformità è organizzativa e tecnica. L’assicurazione interviene su un piano diverso —
        cosa succede quando, nonostante le misure, l’incidente accade:
      </p>
      <ul>
        <li>
          <strong>Polizza cyber</strong>: costi di ripristino dei sistemi, interruzione
          dell’attività, gestione della crisi, notifica agli interessati, riscatti (dove
          contrattualmente previsto e nei limiti di legge), responsabilità verso terzi per la
          perdita di dati.
        </li>
        <li>
          <strong>Responsabilità degli amministratori</strong>: poiché la norma responsabilizza il
          vertice, cresce l’esposizione personale di chi amministra.
        </li>
        <li>
          <strong>Responsabilità verso i clienti</strong>: se sei fornitore di un soggetto obbligato
          e un tuo incidente si propaga a valle, la richiesta di danni arriva a te.
        </li>
      </ul>
      <p>
        Le compagnie, dal canto loro, chiedono sempre più spesso requisiti minimi (backup,
        autenticazione a più fattori, gestione degli aggiornamenti) come condizione per assumere il
        rischio. Il lavoro fatto per la conformità, quindi, ha un effetto diretto anche sulla
        possibilità di assicurarsi e sulle condizioni ottenibili.
      </p>

      <h2>Da dove partire</h2>
      <ol>
        <li>Verifica se il tuo settore rientra tra quelli indicati dalla norma.</li>
        <li>Controlla le soglie dimensionali della tua impresa.</li>
        <li>
          Se sei fornitore di aziende grandi o della PA, aspettati richieste contrattuali sulla
          sicurezza: conviene prepararsi prima che arrivino.
        </li>
        <li>
          Consulta l’ACN per registrazione e scadenze aggiornate della tua categoria.
        </li>
        <li>
          In parallelo, valuta la <Link href="/cyber">copertura cyber</Link>: è ciò che protegge il
          bilancio quando le misure non bastano.
        </li>
      </ol>

      <hr />
      <p className="text-sm">
        <strong>Fonti:</strong> Direttiva (UE) 2022/2555 (NIS2); D.Lgs. 138/2024, in particolare
        art. 38 per le sanzioni; Agenzia per la Cybersicurezza Nazionale per elenco dei soggetti,
        registrazione e scadenze. Contenuto a carattere divulgativo, aggiornato ad agosto 2026: non
        costituisce consulenza legale né valutazione di conformità.
      </p>
    </>
  );
}
