import type { Metadata } from 'next';
import Link from 'next/link';
import { getPolizzeByCategory, type Polizza } from '@/config/polizze';
import { JsonLdBreadcrumb, JsonLdFaqGenerico } from '@/components/JsonLd';
import { Approfondimento } from '@/components/ProductApprofondimento';
import { FaqAccordion } from '@/components/FaqAccordion';
import type { Approfondimento as ApprofondimentoType } from '@/config/polizze';

/** Sezione redazionale dell'hub, resa a fisarmonica in fondo alla pagina. */
const APPROFONDIMENTO: ApprofondimentoType = {
  eyebrow: 'Come si sceglie',
  title: 'Scegliere una polizza senza sbagliare',
  accent: 'senza sbagliare',
  intro:
    'Il prezzo è la prima cosa che si guarda ed è quasi sempre quella che conta meno: a fare la differenza sono massimali, franchigie, carenze ed esclusioni.',
  blocchi: [
    {
      h3: 'Quali coperture sono obbligatorie e quali no',
      p: [
        'Poche assicurazioni sono imposte dalla legge. Per i privati l\'unico obbligo generalizzato riguarda la responsabilità civile dei veicoli, prevista dall\'art. 122 del Codice delle Assicurazioni e dovuta anche quando il mezzo non circola, purché sia idoneo alla circolazione. La polizza incendio sul fabbricato non è un obbligo di legge, ma è normalmente richiesta dalla banca come condizione per erogare un mutuo.',
        'Per professionisti e imprese il quadro è diverso. Chi è iscritto a un albo deve stipulare una copertura di responsabilità professionale ai sensi dell\'art. 5 del D.P.R. 137/2012 e comunicarne gli estremi al cliente. Le imprese tenute all\'iscrizione nel registro delle imprese devono inoltre assicurare i beni aziendali contro i danni da calamità naturali ed eventi catastrofali.',
      ],
    },
    {
      h3: 'Le tre domande da porsi prima di firmare',
      p: [
        'Quanto è alto il massimale rispetto al danno peggiore possibile? Un massimale basso sulla responsabilità civile è il rischio più sottovalutato: i danni alla persona raggiungono cifre che il patrimonio personale non regge.',
        'Cosa resta escluso? Le esclusioni raccontano il contratto meglio delle garanzie. Vale per le catastrofali, che coprono cinque eventi precisi e lasciano fuori grandine e trombe d\'aria, e per le coperture sanitarie, che escludono quasi sempre le patologie preesistenti.',
        'La somma assicurata corrisponde al valore reale? Se è più bassa, l\'art. 1907 del Codice civile consente all\'assicuratore di ridurre l\'indennizzo in proporzione: dichiarare valori bassi per pagare meno significa essere rimborsati meno anche sui danni piccoli.',
      ],
    },
    {
      h3: 'Cosa cambia passando da un broker',
      p: [
        'Un agente rappresenta la compagnia da cui ha ricevuto mandato e propone i prodotti di quella compagnia. Un broker lavora invece su incarico del cliente e confronta le proposte di più compagnie: cambia il punto di vista, non solo l\'assortimento. Il confronto viene fatto sulle condizioni contrattuali, non soltanto sul premio, e resta un unico referente per la gestione del contratto e per l\'eventuale sinistro.',
      ],
    },
  ],
  fonti:
    'D.Lgs. 209/2005 (Codice delle Assicurazioni) art. 122; art. 5 D.P.R. 137/2012; art. 1907 Codice civile.',
};

/**
 * FAQ dell'hub. Sono rese anche visivamente più sotto: il FAQPage strutturato
 * deve corrispondere al testo effettivamente presente in pagina.
 */
const FAQ = [
  {
    q: 'Quanto costa il servizio di Quootami?',
    a: 'Il confronto e il preventivo sono gratuiti e senza impegno. Il broker è remunerato dalle compagnie tramite provvigione sui contratti effettivamente stipulati; eventuali compensi diversi vengono comunicati per iscritto prima della sottoscrizione.',
  },
  {
    q: 'Quali assicurazioni sono obbligatorie per legge?',
    a: 'Per i privati la responsabilità civile dei veicoli, dovuta anche a veicolo fermo se il mezzo è idoneo alla circolazione. Per i professionisti iscritti a un albo la responsabilità civile professionale. Per le imprese iscritte al registro delle imprese la copertura dei beni aziendali contro gli eventi catastrofali. La polizza incendio sulla casa non è obbligatoria per legge, ma è di norma richiesta dalla banca in presenza di un mutuo.',
  },
  {
    q: 'Che differenza c\'è fra un broker e un agente assicurativo?',
    a: 'L\'agente opera su mandato di una o più compagnie e ne propone i prodotti. Il broker opera su incarico del cliente e confronta le proposte di compagnie diverse, valutandole sulle condizioni contrattuali oltre che sul premio.',
  },
  {
    q: 'Posso cambiare compagnia mantenendo la mia classe di merito?',
    a: 'Sì. La classe di merito universale è legata al veicolo e viene rilevata dalle compagnie nella banca dati dell\'attestato di rischio, che dal 2015 è dematerializzato: non va consegnato a mano. Cambiando compagnia la classe maturata resta quella.',
  },
  {
    q: 'Quali premi assicurativi si possono detrarre?',
    a: 'Il 19% dei premi per il rischio di morte o invalidità permanente non inferiore al 5%, entro 530 euro; il 19% dei premi contro il rischio di non autosufficienza entro 1.291,14 euro; il 19% senza limite di importo per le polizze contro gli eventi calamitosi su immobili a uso abitativo. In tutti i casi il pagamento deve avvenire con strumenti tracciabili.',
  },
];

const META_TITLE = 'Polizze assicurative · Privati e imprese';
const META_DESC =
  'Confronto polizze per privati e imprese: auto, casa, salute, cyber, animali, RC professionale e catastrofale. Quali sono obbligatorie e cosa controllare.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    images: [
      {
        url: '/og-image.png',
        alt: 'Quootami — le polizze per privati e imprese',
        width: 1200,
        height: 630,
      },
    ],
  },
};

/**
 * Emoji per slug — le stesse già associate ai prodotti nella home
 * prima della riorganizzazione in hub.
 */
const EMOJI: Record<string, string> = {
  'polizza-auto': '🚗',
  'polizza-casa': '🏠',
  salute: '🩺',
  cyber: '🔐',
  'polizza-animali': '🐾',
  rc: '🏢',
};

export default function PolizzePage() {
  const privati = getPolizzeByCategory('privati');
  const imprese = getPolizzeByCategory('imprese');

  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Polizze', href: '/polizze' }]} />
      <JsonLdFaqGenerico items={FAQ} />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-12 px-5 sm:px-8">
        <div
          aria-hidden
          className="blob-yellow top-[-320px] left-[-180px] w-[620px] h-[620px]"
        />
        <div className="container-content text-center relative">
          <span className="eyebrow">Polizze assicurative</span>
          <h1 className="font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink mt-4">
            Polizze assicurative, <span className="hl">confrontate.</span>
          </h1>
          <p className="section-sub mx-auto">
            Quootami confronta le proposte di più compagnie e seleziona quella adatta al tuo caso.
            Il preventivo è gratuito e senza impegno.
          </p>
        </div>
      </section>

      {/* ─── PRIVATI ─── */}
      <section className="section pt-8">
        <div className="container-content">
          <div className="mb-8">
            <span className="eyebrow">Per te e la tua famiglia</span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-ink mt-2">
              Privati
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {privati.map(p => (
              <PolizzaCard key={p.slug} polizza={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMPRESE ─── */}
      <section className="section pt-0">
        <div className="container-content">
          <div className="mb-8">
            <span className="eyebrow">Per la tua attività</span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-ink mt-2">
              Imprese e professionisti
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {imprese.map(p => (
              <PolizzaCard key={p.slug} polizza={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <FaqAccordion items={FAQ} title="Domande frequenti" className="section pt-0" />

      {/* ─── APPROFONDIMENTO (a fisarmonica, sotto le FAQ) ─── */}
      <Approfondimento dati={APPROFONDIMENTO} />

      {/* ─── ALTRE AREE ─── */}
      <section className="section pt-0">
        <div className="container-content">
          <div className="rounded-3xl bg-bg-alt p-8 sm:p-10 text-center">
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-ink">
              Quootami non si ferma alle polizze.
            </h2>
            <p className="text-sm sm:text-base text-ink-soft mt-2 max-w-prose-wide mx-auto">
              Oltre alle coperture assicurative puoi costruire la pensione integrativa con vantaggio
              fiscale e dedurre i versamenti dal reddito IRPEF.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/piano-pensione" className="btn-secondary">
                Fondo pensione
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PolizzaCard({ polizza }: { polizza: Polizza }) {
  return (
    <Link
      href={`/${polizza.slug}`}
      className="group relative block p-7 rounded-3xl bg-bg-card border border-black/5 hover:border-brand-yellow hover:shadow-brand-md transition-all duration-300 ease-soft hover:-translate-y-1.5"
    >
      <div
        className="w-14 h-14 rounded-2xl bg-bg-alt flex items-center justify-center text-2xl mb-4
                   group-hover:bg-brand-yellow/20 group-hover:scale-110 transition-all duration-300 ease-soft"
        aria-hidden
      >
        {EMOJI[polizza.slug] ?? '📄'}
      </div>
      <h3 className="font-sans font-bold text-base text-ink">{polizza.title}</h3>
      <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{polizza.shortDesc}</p>
      <span
        className="absolute top-7 right-6 w-8 h-8 rounded-full bg-bg-alt flex items-center justify-center text-ink-muted font-semibold group-hover:bg-brand-yellow group-hover:text-ink group-hover:translate-x-1 transition-all duration-300"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
