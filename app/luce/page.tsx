import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparatoreLuce } from '@/components/ComparatoreLuce';
import { LuceGuida } from '@/components/LuceGuida';
import { OPERATORE } from '@/config/operatore';
import { JsonLdBreadcrumb, JsonLdFaqGenerico } from '@/components/JsonLd';
import { Approfondimento } from '@/components/ProductApprofondimento';
import type { Approfondimento as ApprofondimentoType } from '@/config/polizze';

/** FAQ della pagina: rese anche visivamente più sotto, come richiede Google. */
const FAQ = [
  {
    q: 'Cambiare fornitore di luce o gas comporta interruzioni?',
    a: 'No. Il cambio è solo commerciale: contatore, allacciamento e rete restano gli stessi e non è previsto alcun intervento tecnico. La fornitura non si interrompe nemmeno per un istante e non ci sono costi di attivazione.',
  },
  {
    q: 'Il mercato tutelato esiste ancora?',
    a: 'Per i clienti domestici non vulnerabili è terminato: il 1° gennaio 2024 per il gas e il 1° luglio 2024 per l\'elettricità. Chi non aveva scelto un\'offerta di mercato libero è passato automaticamente al Servizio a Tutele Graduali, assegnato per asta e attivo fino al 31 marzo 2027. I clienti vulnerabili continuano invece ad avere accesso al servizio di tutela.',
  },
  {
    q: 'Da dove arrivano le offerte confrontate da Quootami?',
    a: 'Sono le condizioni economiche che i venditori pubblicano per i clienti domestici: offerte realmente sottoscrivibili, non stime commerciali né simulazioni. Il confronto viene fatto a parità di consumo annuo, così i risultati sono paragonabili fra loro.',
  },
  {
    q: 'Conviene di più il prezzo fisso o quello indicizzato?',
    a: 'Dipende da cosa si vuole. Il prezzo fisso resta bloccato per la durata indicata nell\'offerta e protegge dai rialzi, ma non consente di beneficiare dei ribassi. L\'indicizzato segue un riferimento di mercato come il PUN, con uno spread applicato dal venditore: costa meno quando i prezzi scendono, di più quando salgono.',
  },
  {
    q: 'Posso ripensarci dopo aver firmato il nuovo contratto?',
    a: 'Sì. Per i contratti conclusi a distanza o fuori dai locali commerciali il Codice del Consumo riconosce quattordici giorni di diritto di recesso, senza penali e senza dover motivare la scelta.',
  },
  {
    q: 'Il servizio di confronto ha un costo?',
    a: 'No. Il confronto e la consulenza sono gratuiti. Quootami può ricevere una commissione dal fornitore soltanto se il cliente decide di attivare un contratto.',
  },
];

const APPROFONDIMENTO: ApprofondimentoType = {
  eyebrow: 'Come si legge',
  title: 'Capire la bolletta prima di confrontare',
  accent: 'la bolletta',
  intro:
    'Solo una parte della bolletta dipende dal fornitore. Sapere quale evita di confrontare numeri che non sono confrontabili.',
  blocchi: [
    {
      h3: 'Solo una voce su quattro è negoziabile',
      p: [
        'La bolletta si compone di quattro blocchi: la spesa per la materia energia o gas naturale, la spesa per il trasporto e la gestione del contatore, gli oneri di sistema, e infine imposte e IVA. Cambiando fornitore si incide soltanto sul primo: gli altri tre sono definiti da ARERA e sono identici per tutti, qualunque sia il venditore.',
        'È il motivo per cui una promessa di dimezzare la bolletta non è credibile. Il margine di manovra reale riguarda la componente energia, che a seconda dei consumi e del periodo pesa mediamente attorno alla metà del totale.',
      ],
    },
    {
      h3: 'I tre numeri da avere sotto mano',
      p: [
        'Per confrontare in modo serio servono il consumo annuo in kWh per la luce o in Smc per il gas, il prezzo unitario della materia energia che si sta pagando oggi, e le eventuali quote fisse annue. Sono tutti indicati nella bolletta, nella sezione di dettaglio degli importi.',
        'Confrontare il totale della bolletta di due periodi diversi non dice nulla: i consumi variano con la stagione e gli oneri cambiano ogni trimestre. Il confronto ha senso solo a parità di consumo annuo.',
      ],
    },
    {
      h3: 'Prezzo fisso, indicizzato e durata',
      p: [
        'Nelle offerte a prezzo fisso il valore della componente energia resta bloccato per la durata indicata nel contratto. In quelle indicizzate segue un indice di mercato — per l\'elettricità tipicamente il PUN — al quale il venditore somma uno spread: è quello spread, non l\'indice, il vero termine di confronto fra due offerte indicizzate.',
        'Attenzione alle quote fisse annue e ai bonus promozionali validi solo per i primi mesi: un prezzo unitario più basso accompagnato da una quota fissa alta può risultare più caro di un\'offerta apparentemente meno conveniente, soprattutto per chi consuma poco.',
      ],
    },
    {
      h3: 'Cosa succede quando si cambia',
      p: [
        'Il passaggio è puramente commerciale: nessun tecnico, nessuna modifica al contatore, nessuna interruzione della fornitura. Il vecchio contratto si chiude con una bolletta di conguaglio e il nuovo venditore subentra dalla data di decorrenza.',
        'Va verificato solo se il contratto in essere prevede vincoli di durata o penali di recesso: per i clienti domestici il recesso è di norma libero, ma alcune offerte a prezzo bloccato possono prevedere condizioni particolari.',
      ],
    },
  ],
  fonti:
    'ARERA — fine tutela elettricità e gas, Servizio a Tutele Graduali, composizione della bolletta; D.Lgs. 206/2005 (Codice del Consumo) per il diritto di recesso.',
};

const META_TITLE = 'Confronto offerte luce e gas del mercato libero';
const META_DESC =
  'Confronto gratuito delle offerte luce e gas del mercato libero: come si legge la bolletta, quale voce è davvero negoziabile e cosa cambia fra prezzo fisso e indicizzato.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    images: [
      {
        url: '/og-image.png',
        alt: 'Quootami — confronto offerte luce e gas del mercato libero',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function LucePage() {
  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Luce e Gas', href: '/luce' }]} />
      <JsonLdFaqGenerico items={FAQ} />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8">
        <div aria-hidden className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]" />
        <div
          aria-hidden
          className="blob-green bottom-[-140px] right-[-140px] w-[520px] h-[520px]"
          style={{ animationDelay: '-4s' }}
        />

        <div className="container-content text-center relative">
          <span className="eyebrow animate-fade-in">Luce e Gas</span>
          <h1 className="mt-4 font-sans font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-ink animate-rise">
            Confronta le offerte <span className="hl">luce e gas.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Quootami confronta le offerte reali del mercato libero e ti accompagna fino al cambio.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="#confronta" className="btn-primary">
              Confronta gratis →
            </a>
            <a href="#come-funziona" className="btn-secondary">
              Come funziona
            </a>
          </div>
          <p className="mt-8 text-xs sm:text-sm text-ink-muted animate-fade-up" style={{ animationDelay: '0.4s' }}>
            Nessun costo &middot; Offerte reali del mercato libero &middot; Nessun impegno
          </p>
        </div>
      </section>

      {/* ─── COMPARATORE ─── */}
      <ComparatoreLuce />

      {/* ─── COME FUNZIONA ─── */}
      <section id="come-funziona" className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-14">
            <span className="eyebrow">Come funziona</span>
            <h2 className="section-title">
              Quattro passaggi, <span className="hl">zero pratiche.</span>
            </h2>
          </div>
          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 list-none">
            <div
              aria-hidden
              className="hidden lg:block absolute top-7 left-[13%] right-[13%] border-t-2 border-dashed border-ink/15"
            />
            {[
              { title: 'Carica o inserisci i dati', desc: 'Foto della bolletta o due numeri a mano: bastano un paio di minuti.' },
              { title: 'Quootami confronta', desc: 'Le offerte realmente disponibili sul mercato libero, non stime.' },
              { title: 'Ricevi la proposta', desc: 'Dopo la conferma email, la soluzione migliore spiegata con chiarezza.' },
              { title: 'Cambio senza pensieri', desc: 'Le pratiche del passaggio le segue Quootami. Nessuna interruzione di fornitura.' },
            ].map((step, i) => (
              <li key={step.title} className="relative text-center group">
                <div className="relative mx-auto mb-5 w-14 h-14 rounded-full bg-brand-yellow shadow-glow-yellow flex items-center justify-center font-sans font-bold text-xl text-ink group-hover:scale-110 transition-transform duration-300 ease-soft">
                  {i + 1}
                </div>
                <h3 className="font-sans font-bold text-base text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── GUIDA A MODULI ─── */}
      <LuceGuida />

      {/* ─── PERCHÉ QUOOTAMI ─── */}
      <section className="section bg-bg-alt">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { title: 'Offerte reali', desc: 'Il confronto usa le condizioni economiche che i fornitori pubblicano per i clienti domestici, non stime commerciali.' },
              { title: 'Gratis per te', desc: 'Il confronto e la consulenza non costano nulla: Quootami può ricevere una commissione dal fornitore solo se attivi un contratto.' },
              { title: 'Una persona vera', desc: 'Niente call center: lo stesso referente del resto di Quootami ti segue anche sul cambio di fornitura.' },
            ].map((v) => (
              <article
                key={v.title}
                className="bg-bg-card border border-black/5 rounded-3xl p-7 hover:-translate-y-1.5 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft"
              >
                <h3 className="font-sans font-bold text-base text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section bg-bg">
        <div className="container-content">
          <div className="max-w-prose-wide mx-auto prose-quootami">
            <h2>Domande frequenti su luce e gas</h2>
            {FAQ.map(f => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPROFONDIMENTO (a fisarmonica) ─── */}
      <Approfondimento dati={APPROFONDIMENTO} />

      {/* ─── CTA FINALE ─── */}
      <section className="section bg-bg">
        <div className="container-content text-center">
          <span className="eyebrow">Inizia ora</span>
          <h2 className="section-title">
            Due minuti per <span className="hl">saperlo.</span>
          </h2>
          <p className="section-sub mx-auto">
            Confronto gratuito e senza impegno. Per qualsiasi dubbio, Quootami risponde
            sui soliti canali.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#confronta" className="btn-primary">
              Confronta gratis →
            </a>
            <a
              href={OPERATORE.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Scrivi su WhatsApp
            </a>
          </div>
          <p className="mt-8 text-xs text-ink-muted">
            Le polizze restano il cuore di Quootami:{' '}
            <Link href="/" className="underline underline-offset-2 hover:text-ink">
              torna alle assicurazioni
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
