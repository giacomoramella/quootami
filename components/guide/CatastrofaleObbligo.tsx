import Link from 'next/link';

/**
 * Corpo articolo: "Polizza catastrofale: quali imprese sono obbligate".
 *
 * Fonti primarie e di settore verificate (agosto 2026):
 * - L. 213/2023 (Bilancio 2024), art. 1 commi 101-111 — istituzione dell'obbligo
 * - D.L. 39/2025 conv. L. 78/2025 — scaglionamento delle scadenze per dimensione
 * - D.L. Milleproroghe 2026 conv. L. 26/2026 — proroga per turistico-ricettivo
 *   e somministrazione alimenti e bevande
 * - Art. 2424 c.c. (voce B-II) — beni oggetto dell'obbligo
 * Nessuna sanzione pecuniaria diretta a carico dell'impresa: l'inadempimento
 * rileva nell'assegnazione di contributi e agevolazioni pubbliche.
 */
export function CatastrofaleObbligo() {
  return (
    <>
      <p>
        La legge di bilancio 2024 ha introdotto per le imprese l’obbligo di assicurarsi contro i
        danni provocati da alcune calamità naturali. Le scadenze sono state più volte riviste e,
        salvo proroghe successive, sono <strong>ormai tutte trascorse</strong>: chi non ha ancora
        stipulato la copertura è già in una posizione di inadempimento.
      </p>

      <h2>Chi è obbligato</h2>
      <p>
        L’obbligo riguarda le <strong>imprese con sede legale in Italia</strong> e quelle estere con
        stabile organizzazione nel territorio, tenute all’iscrizione nel Registro delle imprese.
        Non dipende dal settore né dal fatturato: conta l’essere impresa e possedere i beni indicati
        più avanti.
      </p>

      <h3>Le scadenze per dimensione</h3>
      <div className="tabella-scroll">
        <table>
          <thead>
            <tr>
              <th>Dimensione impresa</th>
              <th>Termine per essere in regola</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Grandi imprese</td>
              <td>1° aprile 2025</td>
            </tr>
            <tr>
              <td>Medie imprese</td>
              <td>1° ottobre 2025</td>
            </tr>
            <tr>
              <td>Micro e piccole imprese</td>
              <td>1° gennaio 2026</td>
            </tr>
            <tr>
              <td>
                Micro e piccole del <strong>turistico-ricettivo</strong> e della{' '}
                <strong>somministrazione di alimenti e bevande</strong>
              </td>
              <td>31 marzo 2026 (proroga Milleproroghe)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Le soglie dimensionali seguono i criteri europei (dipendenti, fatturato e totale di
        bilancio). Se hai dubbi sulla fascia in cui rientra la tua impresa, è il primo punto da
        chiarire: cambia la data entro cui avresti dovuto essere coperto.
      </p>

      <h2>Quali beni vanno assicurati</h2>
      <p>
        L’obbligo riguarda i beni iscritti in bilancio all’attivo dello stato patrimoniale, voce
        B-II numeri da 1 a 3 dell’articolo 2424 del codice civile:
      </p>
      <ul>
        <li><strong>terreni</strong> e fabbricati;</li>
        <li><strong>impianti e macchinari</strong>;</li>
        <li><strong>attrezzature industriali e commerciali</strong>.</li>
      </ul>
      <p>
        Restano <strong>fuori</strong> dall’obbligo le merci e le scorte di magazzino, i veicoli
        iscritti al Pubblico Registro Automobilistico e gli immobili ancora in costruzione. Questo
        non significa che non convenga assicurarli: significa che la legge non lo impone.
      </p>

      <h2>Chi è escluso dall’obbligo</h2>
      <ul>
        <li>
          <strong>Imprese agricole</strong> (art. 2135 c.c.): hanno un canale dedicato, il fondo
          mutualistico AGRICAT.
        </li>
        <li>
          <strong>Liberi professionisti</strong> con studio individuale o associato, non iscritti al
          Registro delle imprese.
        </li>
        <li>
          Imprese i cui immobili sono gravati da <strong>abuso edilizio</strong> o costruiti senza
          le autorizzazioni previste.
        </li>
        <li>Imprese che non possiedono nessuno dei beni elencati sopra.</li>
      </ul>

      <h2>Cosa si rischia senza polizza</h2>
      <p>
        Non è prevista una multa diretta. La conseguenza è però concreta e spesso sottovalutata:
        dell’inadempimento <strong>si tiene conto nell’assegnazione di contributi, sovvenzioni e
        agevolazioni pubbliche</strong>. In pratica un’impresa non in regola rischia di vedersi
        precludere l’accesso a bandi, incentivi e misure di sostegno.
      </p>
      <p>
        A questo si aggiunge il rischio economico vero e proprio: senza copertura, i danni da
        terremoto o alluvione restano interamente a carico dell’impresa.
      </p>

      <blockquote>
        <p>
          Attenzione a un equivoco frequente: essere in regola con l’obbligo{' '}
          <strong>non significa essere coperti da qualsiasi evento atmosferico</strong>. L’obbligo
          riguarda cinque eventi precisi — ne parliamo in{' '}
          <Link href="/guide/polizza-catastrofale-cosa-copre">
            cosa copre davvero la polizza catastrofale
          </Link>
          .
        </p>
      </blockquote>

      <h2>Cosa fare adesso</h2>
      <ol>
        <li>Verifica in quale fascia dimensionale rientra l’impresa e quale termine ti riguardava.</li>
        <li>
          Estrai dal bilancio i valori della voce B-II (terreni e fabbricati, impianti e macchinari,
          attrezzature): sono la base su cui si costruisce la copertura.
        </li>
        <li>
          Controlla se una polizza già attiva (incendio, all risks) contiene garanzie catastrofali:
          a volte c’è già una copertura parziale da integrare invece che duplicare.
        </li>
        <li>Confronta più compagnie: su questo rischio le condizioni variano molto.</li>
      </ol>

      <hr />
      <p className="text-sm">
        <strong>Fonti:</strong> L. 213/2023, art. 1 commi 101-111; D.L. 39/2025 convertito in
        L. 78/2025; decreto Milleproroghe 2026 convertito in L. 26/2026; art. 2424 codice civile.
        Contenuto a carattere divulgativo, aggiornato ad agosto 2026: non sostituisce la lettura
        delle condizioni di polizza né una consulenza sul caso specifico.
      </p>
    </>
  );
}
