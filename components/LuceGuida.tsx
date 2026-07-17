'use client';

/**
 * Guida a luce e gas — pagina Luce e Gas.
 * Struttura e mattoncini condivisi: vedi GuidaModuli.
 *
 * Fonti e verifiche (luglio 2026):
 * - Composizione della bolletta: quattro macro-voci (materia energia,
 *   trasporto e gestione contatore, oneri di sistema, imposte). Solo la
 *   spesa per la materia energia cambia col fornitore; le altre sono
 *   regolate da ARERA o fissate per legge e sono identiche per tutti.
 *   IVA 10% per le utenze domestiche. Fonte: ARERA, guida alla lettura
 *   delle voci di spesa.
 * - Switch OGGI (fino al 30/11/2026): i cambi si eseguono il primo giorno
 *   del mese; la richiesta va inviata entro il giorno 10 del mese
 *   precedente, altrimenti slitta al mese dopo. In tutto da uno a due mesi.
 *   La procedura parte dopo i termini di ripensamento. Fonte: ARERA,
 *   Atlante per il consumatore.
 * - Switch DAL 1° DICEMBRE 2026: delibera ARERA 58/2026/R/eel (3 marzo
 *   2026, pubblicata il 6 marzo) — procedura tecnica in 24 ore di un
 *   giorno lavorativo per i domestici non morosi, fino a 10 giorni
 *   lavorativi in caso di morosità, comunque entro tre settimane
 *   complessive. Base: direttiva (UE) 2019/944. NON è ancora in vigore.
 * - Ripensamento: 14 giorni per i contratti a distanza o fuori dai locali
 *   commerciali; 30 giorni per le visite domiciliari non richieste.
 * - Fine maggior tutela per i NON vulnerabili: gas 1° gennaio 2024,
 *   elettricità 1° luglio 2024.
 * - Servizio a Tutele Graduali: cessa per tutti il 31 marzo 2027; ARERA ha
 *   avviato una consultazione per la regolazione successiva.
 * - Clienti vulnerabili (elettrico), criteri ARERA: 75 anni compiuti;
 *   titolarità del bonus sociale per ISEE o del bonus per gravi condizioni
 *   di salute con apparecchiature medico-terapeutiche; disabilità ex art. 3
 *   L. 104/92; utenza in struttura abitativa di emergenza post-calamità;
 *   utenza in isola minore non interconnessa.
 * - Portale Offerte ARERA (portaleofferte.it): unico comparatore pubblico,
 *   senza accordi commerciali con i fornitori. È la fonte dei dati usati
 *   dal comparatore di questa pagina.
 * - Codice di Condotta Commerciale: Allegato A delibera ARERA
 *   366/2018/R/com.
 *
 * Le percentuali sul peso delle voci in bolletta sono indicative: variano
 * con i prezzi di mercato e con i consumi. Per questo sono presentate come
 * ordine di grandezza e non come dato puntuale.
 */

import {
  GuidaModuli, Blocco, Nota, Tabella, SogliaTile, PassoCard, NovitaCard, ElencoCard,
  TEAL, type ModuloGuida,
} from '@/components/GuidaModuli';

const MODULI: ModuloGuida[] = [
  {
    id: 'bolletta',
    titolo: 'Leggere la bolletta',
    sottotitolo: 'Le quattro voci',
    desc: 'Cosa si paga davvero e quale parte cambia scegliendo un altro fornitore.',
    lettura: '4 min',
    contenuto: <ModuloBolletta />,
  },
  {
    id: 'fisso-variabile',
    titolo: 'Fisso o variabile',
    sottotitolo: 'Quale prezzo scegliere',
    desc: 'Le due famiglie di offerte del mercato libero, con pregi e difetti di ciascuna.',
    lettura: '4 min',
    contenuto: <ModuloFissoVariabile />,
  },
  {
    id: 'cambio',
    titolo: 'Cambiare fornitore',
    sottotitolo: 'Tempi e procedura',
    desc: 'Quanto dura il passaggio, quanto costa e cosa succede alla fornitura.',
    lettura: '5 min',
    contenuto: <ModuloCambio />,
  },
  {
    id: 'tutele',
    titolo: 'Mercato e tutele',
    sottotitolo: 'Tutele graduali e vulnerabili',
    desc: 'Cosa è successo alla maggior tutela e chi ha ancora un prezzo regolato.',
    lettura: '4 min',
    contenuto: <ModuloTutele />,
  },
  {
    id: 'diritti',
    titolo: 'Diritti e tutele',
    sottotitolo: 'Le regole ARERA',
    desc: 'Gli strumenti pubblici per confrontare, verificare e reclamare.',
    lettura: '3 min',
    contenuto: <ModuloDiritti />,
  },
];

export function LuceGuida() {
  return (
    <GuidaModuli
      id="guida"
      eyebrow="La guida"
      titolo="Capire la"
      accent="bolletta."
      sottotitolo="Cinque moduli per scegliere con cognizione di causa. Scegli l'argomento: si apre qui sotto."
      moduli={MODULI}
      sfondo="base"
    />
  );
}

/* ══════════ Moduli ══════════ */

function ModuloBolletta() {
  const si = <span className="font-bold" style={{ color: TEAL }}>Sì</span>;
  const no = <span className="text-ink-muted">No</span>;
  return (
    <>
      <Tabella
        title="Le quattro voci della bolletta"
        note="Struttura definita da ARERA. Le voci diverse dalla materia energia sono uguali per tutti i
              fornitori: cambiare offerta non le tocca. L'IVA per le utenze domestiche è al 10%."
        head={['Voce', 'Cosa copre', 'Cambia col fornitore?']}
        rows={[
          ['Spesa per la materia energia', 'L\'energia effettivamente consumata e la sua commercializzazione', si],
          ['Trasporto e gestione del contatore', 'Le reti di trasmissione e distribuzione, la lettura e la gestione dei contatori', no],
          ['Oneri di sistema', 'Attività di interesse generale del sistema elettrico, stabilite da ARERA', no],
          ['Imposte', 'Accise e IVA, fissate per legge', no],
        ]}
        highlight={2}
        primo
      />

      <Blocco titolo="Perché il risparmio ha un limite fisiologico">
        <p className="text-sm text-ink-soft leading-relaxed">
          È il punto che i confronti pubblicitari tendono a nascondere: una sola delle quattro voci dipende
          dal fornitore. Le altre tre sono identiche per tutti, qualunque offerta si scelga. La spesa per la
          materia energia vale indicativamente intorno alla metà del totale, quindi anche un&apos;offerta
          molto migliore agisce solo su quella parte.
        </p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          Detto questo, su quella metà le differenze fra fornitori sono reali e si ripetono ogni mese: è lì
          che ha senso lavorare, senza aspettarsi che la bolletta si dimezzi.
        </p>
        <Nota>
          Il peso delle singole voci è indicativo e cambia con i prezzi di mercato e con i consumi:
          non è una percentuale fissa. Il dettaglio esatto è sempre riportato nella propria bolletta.
        </Nota>
      </Blocco>
    </>
  );
}

function ModuloFissoVariabile() {
  return (
    <>
      <Tabella
        title="Prezzo fisso e prezzo variabile a confronto"
        note="Nessuna delle due formule è migliore in assoluto: dipende da quanto si vuole essere esposti al
              mercato. Il prezzo bloccato riguarda la componente energia, non le voci regolate, che continuano
              a cambiare secondo gli aggiornamenti ARERA."
        head={['', 'Prezzo fisso', 'Prezzo variabile']}
        rows={[
          ['Come funziona', 'La componente energia resta bloccata per tutta la durata dell\'offerta', 'Segue un indice di mercato (PUN per la luce, PSV per il gas) più uno spread del fornitore'],
          ['Se i prezzi salgono', 'La spesa non cambia', 'La bolletta sale'],
          ['Se i prezzi scendono', 'Non se ne beneficia', 'La bolletta scende'],
          ['Durata tipica', '12 mesi, poi va rinegoziata', 'Nessun blocco'],
          ['A chi si adatta', 'Chi vuole una spesa prevedibile', 'Chi accetta oscillazioni per seguire il mercato'],
        ]}
        highlight={-1}
        primo
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ElencoCard
          titolo="Cosa guardare in un'offerta a prezzo fisso"
          voci={[
            'Per quanti mesi il prezzo è davvero bloccato',
            'Cosa succede alla scadenza, se non si fa nulla',
            'Se è prevista una penale per il recesso anticipato',
            'Il costo di commercializzazione, che si paga anche a consumo zero',
          ]}
        />
        <ElencoCard
          titolo="Cosa guardare in un'offerta variabile"
          voci={[
            'Quale indice viene usato come riferimento',
            'Quanto vale lo spread aggiunto dal fornitore',
            'Ogni quanto il prezzo viene aggiornato',
            'Il costo di commercializzazione, che si paga anche a consumo zero',
          ]}
        />
      </div>

      <Nota>
        Lo spread è il vero termine di paragone fra due offerte indicizzate: l&apos;indice è uguale per
        tutti, la differenza la fa quanto ci aggiunge sopra il fornitore.
      </Nota>
    </>
  );
}

function ModuloCambio() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SogliaTile valore="€0" label="il cambio fornitore è gratuito: nessun costo di pratica" />
        <SogliaTile valore="Nessuna" label="interruzione della fornitura: non si resta mai senza luce o gas" />
        <SogliaTile valore="14 giorni" label="di ripensamento sui contratti a distanza o fuori dai locali" />
      </div>

      <Blocco titolo="Cosa non cambia">
        <p className="text-sm text-ink-soft leading-relaxed">
          Cambiare fornitore significa cambiare solo chi emette la bolletta e a quale prezzo vende
          l&apos;energia. Restano identici il contatore, la rete, il distributore locale e la qualità del
          servizio: non serve alcun intervento tecnico e nessuno viene a casa. In caso di guasto continua a
          intervenire lo stesso distributore di prima.
        </p>
      </Blocco>

      <Blocco titolo="Quanto dura il passaggio, oggi">
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 list-none">
          <PassoCard n={1} title="Si firma il contratto" desc="Con il nuovo fornitore. La data prevista del passaggio deve essere indicata nel contratto." />
          <PassoCard n={2} title="Decorre il ripensamento" desc="La procedura può partire dopo i termini di ripensamento: 14 giorni, che diventano 30 per le visite domiciliari non richieste." />
          <PassoCard n={3} title="Si cambia il primo del mese" desc="Se la richiesta parte entro il giorno 10, il passaggio avviene il primo giorno del mese successivo. Oltre quel termine slitta di un mese." />
        </ol>
        <Nota>
          In tutto servono da uno a due mesi. Fonte: ARERA, Atlante per il consumatore. Il recesso dal
          vecchio contratto è gratuito, salvo la penale eventualmente prevista in modo esplicito dalle
          offerte a prezzo fisso.
        </Nota>
      </Blocco>

      <div className="mt-6">
        <NovitaCard
          stato="in-arrivo"
          statoLabel="Dal 1° dicembre 2026"
          title="Il cambio fornitore scende a 24 ore"
          desc="La delibera ARERA 58/2026 riforma lo switching elettrico: per i clienti domestici in regola con
                i pagamenti il passaggio tecnico si chiuderà in 24 ore di un giorno lavorativo, fino a 10 giorni
                lavorativi in caso di morosità, e comunque entro tre settimane complessive. Finché non entra in
                vigore restano validi i tempi indicati sopra."
        />
      </div>
    </>
  );
}

function ModuloTutele() {
  return (
    <>
      <p className="text-sm text-ink-soft leading-relaxed max-w-prose-wide">
        Il mercato tutelato, cioè quello a prezzo fissato da ARERA, non esiste più per la generalità dei
        clienti domestici. Chi non ha mai scelto un&apos;offerta non è però rimasto senza fornitura: è stato
        accompagnato in un servizio transitorio.
      </p>

      <Tabella
        title="Le tappe della fine della maggior tutela"
        note="Le date riguardano i clienti domestici NON vulnerabili. Chi rientra nelle condizioni di
              vulnerabilità ha mantenuto un servizio a condizioni regolate."
        head={['Quando', 'Cosa è successo']}
        rows={[
          ['1° gennaio 2024', 'Fine della maggior tutela per il gas'],
          ['1° luglio 2024', 'Fine della maggior tutela per l\'energia elettrica'],
          ['31 marzo 2027', 'Cessa il Servizio a Tutele Graduali, per tutti'],
        ]}
        highlight={-1}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Blocco titolo="Il Servizio a Tutele Graduali">
          <p className="text-sm text-ink-soft leading-relaxed">
            È il servizio in cui sono confluiti i clienti che non avevano scelto un&apos;offerta del mercato
            libero. Il fornitore non è scelto dal cliente: viene assegnato per asta, area per area, e le
            condizioni economiche sono definite da ARERA.
          </p>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            È un servizio a termine: si chiude il <strong>31 marzo 2027</strong> per tutti. ARERA ha avviato
            una consultazione pubblica per stabilire cosa accadrà dopo quella data.
          </p>
        </Blocco>

        <Blocco titolo="Chi è cliente vulnerabile">
          <ul className="space-y-2 list-none">
            {[
              'Ha compiuto 75 anni',
              'Ha diritto al bonus sociale per livello ISEE',
              'Ha diritto al bonus per gravi condizioni di salute, con apparecchiature medico-terapeutiche',
              'È persona con disabilità ai sensi dell\'art. 3 della Legge 104/92',
              'Ha l\'utenza in una struttura abitativa di emergenza dopo un evento calamitoso',
              'Ha l\'utenza in un\'isola minore non interconnessa',
            ].map(v => (
              <li key={v} className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ backgroundColor: TEAL }}
                  aria-hidden
                />
                {v}
              </li>
            ))}
          </ul>
          <Nota>Criteri ARERA per il settore elettrico. Basta rientrare in una sola delle condizioni.</Nota>
        </Blocco>
      </div>
    </>
  );
}

function ModuloDiritti() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ElencoCard
          titolo="Strumenti per confrontare e verificare"
          voci={[
            'Portale Offerte ARERA: l\'unico comparatore pubblico, senza accordi commerciali con i fornitori',
            'Codice offerta: identifica in modo univoco la singola offerta e permette di ritrovarla',
            'Scheda sintetica: riassume le condizioni economiche in un formato uguale per tutti',
            'Bolletta: riporta sempre il dettaglio delle voci di spesa effettive',
          ]}
        />
        <ElencoCard
          titolo="Se qualcosa non va"
          voci={[
            'Reclamo scritto al fornitore, che è tenuto a rispondere entro i termini fissati da ARERA',
            'Servizio Conciliazione ARERA, gratuito, se la risposta non arriva o non soddisfa',
            'Sportello per il consumatore Energia e Ambiente, per informazioni e assistenza',
            'Bonus sociale: riconosciuto in automatico a chi ha i requisiti, senza domanda',
          ]}
        />
      </div>

      <Blocco titolo="Le regole di chi vende energia">
        <p className="text-sm text-ink-soft leading-relaxed">
          Chi promuove o conclude contratti di fornitura, anche online, è tenuto a rispettare il Codice di
          Condotta Commerciale di ARERA: deve dichiarare lo scopo commerciale del contatto prima di chiedere
          dati, identificarsi con precisione e consegnare la documentazione contrattuale completa.
        </p>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          È il motivo per cui su questa pagina il confronto parte dai dati pubblici del Portale Offerte e non
          da una selezione di fornitori paganti, e per cui viene chiesto un consenso esplicito prima di
          raccogliere qualsiasi dato.
        </p>
        <Nota>
          Riferimento: Allegato A alla delibera ARERA 366/2018/R/com e successivi aggiornamenti.
        </Nota>
      </Blocco>
    </>
  );
}
