import type { Metadata } from 'next';
import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';
import { ListaAttesaLuceGas } from '@/components/ListaAttesaLuceGas';

/**
 * Luce e gas — landing di lista d'attesa. ARCHIVIATA, non in produzione.
 *
 * A COSA SERVE
 * Il 07/09/2026 sono partite le prime mail di apertura ai fornitori (NeN, E.ON,
 * Iren, Sorgenia — vedi docs/OUTREACH-FORNITORI-2026-09.md). La prima cosa che
 * fa chi le riceve è aprire il sito. Se non trova traccia del verticale energia,
 * la conversazione muore lì. Lo stesso vale per Awin, che valuta il sito del
 * publisher prima di approvare la candidatura.
 *
 * Questa pagina è la risposta: non promette un comparatore che non c'è, ma
 * dimostra che il verticale esiste e raccoglie contatti con consenso valido.
 *
 * COSA NON DEVE FARE, MAI
 *  - simulare un confronto prezzi: senza mandati sarebbe una comparazione
 *    finta, cioè una pratica commerciale scorretta;
 *  - mostrare loghi o nomi di fornitori con cui non c'è un accordo firmato:
 *    è contestabile e brucia proprio le aziende con cui si sta trattando;
 *  - promettere risparmi in euro o in percentuale.
 * La leva onesta è già più forte: siamo gli unici a dichiarare che non facciamo
 * chiamate a freddo, in un mercato dove da aprile 2026 è illegale farle.
 *
 * COME ATTIVARLA
 *  1. applicare archivio/luce-e-gas/supabase/en-waitlist.sql su Supabase;
 *  2. git mv archivio/luce-e-gas/components/ListaAttesaLuceGas.tsx components/
 *  3. git mv archivio/luce-e-gas/app-luce-e-gas/page.tsx app/luce-e-gas/page.tsx
 *  4. next.config.js: togliere il redirect /luce → / e puntarlo su /luce-e-gas
 *  5. rimettere la voce in Nav.tsx, app/sitemap.ts e app/mappa-sito/page.tsx
 * Il comparatore vero (ComparatoreLuce.tsx) resta archiviato finché non c'è
 * almeno un mandato firmato.
 */

const META_TITLE = 'Luce e Gas · Confronto in attivazione';
const META_DESC =
  'Quootami sta aprendo il confronto delle offerte luce e gas. Lascia i tuoi dati: ti avvisiamo appena parte. Nessuna telefonata a freddo.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: { canonical: `${OPERATORE.brand.url}/luce-e-gas` },
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: `${OPERATORE.brand.url}/luce-e-gas`,
    type: 'website',
  },
};

const PASSI = [
  {
    n: '1',
    t: 'Ci lasci i dati della fornitura',
    d: 'Bastano il CAP e quanto spendi al mese. Niente POD, niente codice fiscale, niente bolletta da caricare.',
  },
  {
    n: '2',
    t: 'Confrontiamo e ti mandiamo il risultato',
    d: 'Mettiamo a confronto le offerte dei fornitori con cui abbiamo un accordo e ti diciamo se ti conviene cambiare. Anche quando la risposta è no.',
  },
  {
    n: '3',
    t: 'Se cambi, il passaggio lo gestiamo noi',
    d: 'Nessuna interruzione della fornitura, nessun costo per te. Il tuo contatore e il tuo distributore restano gli stessi.',
  },
];

const FAQ = [
  {
    q: 'Quanto costa?',
    a: 'Niente. Il servizio è gratuito per te: veniamo pagati dal fornitore solo se attivi una fornitura tramite noi. Lo scriviamo qui perché è giusto che tu lo sappia prima di lasciarci i dati.',
  },
  {
    q: 'Devo disdire il contratto con il mio fornitore attuale?',
    a: 'No. Il cambio fornitore si gestisce fra i due operatori: non devi disdire nulla e non c’è alcun costo di uscita sul mercato libero.',
  },
  {
    q: 'Resto senza luce durante il passaggio?',
    a: 'No, mai. Cambia solo chi ti fattura l’energia: la rete, il contatore e il distributore della tua zona non cambiano, e non viene fatto alcun intervento tecnico.',
  },
  {
    q: 'Chi vede i miei dati?',
    a: 'Noi. E i fornitori partner soltanto se ci autorizzi con la casella dedicata nel modulo, che è separata dalle altre proprio perché tu possa dire di sì a una cosa e no all’altra. Non compriamo e non vendiamo liste di contatti.',
  },
  {
    q: 'Quando partite davvero?',
    a: 'Stiamo chiudendo gli accordi con i primi fornitori. Contiamo di attivare il confronto entro la fine dell’anno: se dovesse slittare te lo scriviamo, invece di lasciarti in attesa.',
  },
];

export default function LuceEGasPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 px-5 sm:px-8">
        <div aria-hidden className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]" />
        <div className="container-content relative">
          <span className="eyebrow">Luce e Gas</span>
          <h1 className="font-sans font-bold text-4xl sm:text-5xl tracking-tight leading-[1.05] text-ink mt-4 max-w-3xl">
            Stiamo aprendo il <span className="hl">confronto.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide">
            Quootami confronta assicurazioni e previdenza dal 2025. Adesso stiamo chiudendo gli
            accordi con i fornitori di energia per fare lo stesso con la bolletta di casa.
          </p>
          <p className="mt-4 text-base text-ink-muted max-w-prose-wide">
            Lasciaci due dati: quando partiamo, il confronto sulla tua fornitura lo facciamo noi e
            ti mandiamo il risultato. <strong className="text-ink">Nessuna telefonata a freddo, mai.</strong>
          </p>

          <div className="mt-10 max-w-2xl">
            <ListaAttesaLuceGas />
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 border-t border-black/5">
        <div className="container-content">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-ink">
            Come funziona
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {PASSI.map((p) => (
              <div key={p.n}>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink text-white text-xs font-semibold">
                  {p.n}
                </span>
                <h3 className="mt-3 font-semibold text-ink">{p.t}</h3>
                <p className="mt-2 text-sm text-ink-muted">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 border-t border-black/5">
        <div className="container-content">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-ink">
            Chi c&apos;è dietro
          </h2>
          <p className="mt-6 text-base text-ink-muted max-w-prose-wide">
            Una persona sola, con nome e cognome: <strong className="text-ink">{OPERATORE.collaboratore.nome_completo}</strong>,
            intermediario assicurativo iscritto al RUI in sezione {OPERATORE.collaboratore.rui_sezione} n.{' '}
            {OPERATORE.collaboratore.rui_numero}, operante con {OPERATORE.broker.ragione_sociale_breve}.
          </p>
          <p className="mt-4 text-base text-ink-muted max-w-prose-wide">
            Non siamo un call center e non compriamo liste di numeri. L&apos;iscrizione al RUI
            riguarda l&apos;attività assicurativa: il confronto luce e gas è un servizio distinto,
            che non rientra nel perimetro IVASS. Lo scriviamo perché è la verità, e perché un
            comparatore che non dichiara chi è non merita i tuoi dati.
          </p>
          <p className="mt-6 text-sm text-ink-muted">
            <Link href="/chi-siamo" className="underline">Chi siamo</Link>
            {' · '}
            <Link href="/informazioni-intermediario" className="underline">Informazioni sull&apos;intermediario</Link>
            {' · '}
            <Link href="/privacy" className="underline">Privacy</Link>
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16 border-t border-black/5">
        <div className="container-content">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-ink">
            Domande frequenti
          </h2>
          <dl className="mt-8 space-y-6 max-w-prose-wide">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-2 text-sm text-ink-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
