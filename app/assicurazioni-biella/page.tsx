import type { Metadata } from 'next';
import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';
import { getPolizzeByCategory } from '@/config/polizze';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Assicurazioni a Biella — broker multi-compagnia',
  description:
    'Broker assicurativo a Biella e provincia: confronto tra più compagnie su auto, casa, salute, imprese e previdenza. Un solo referente, preventivi gratuiti.',
};

/**
 * Pagina locale (SEO) per Biella e provincia.
 *
 * Angolo differenziante emerso dalla ricerca: sulla SERP locale ci sono
 * directory senza contenuto e agenzie MONO-mandato. Il broker plurimandato è
 * la differenza sostanziale da spiegare.
 *
 * Dato IVASS citato: Comunicazione statistica n. 6/2026 (indagine IPER),
 * 1° trimestre 2026 — premio medio RCA 423 €, +3,2% su base annua; tra i
 * rincari maggiori Vercelli +5,8%. ATTENZIONE: il dato provinciale è di
 * VERCELLI (provincia confinante), non di Biella: nel testo è detto così.
 */
export default function AssicurazioniBiellaPage() {
  const privati = getPolizzeByCategory('privati');
  const imprese = getPolizzeByCategory('imprese');
  const { contatti, collaboratore, broker } = OPERATORE;

  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Assicurazioni a Biella', href: '/assicurazioni-biella' }]} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 px-5 sm:px-8">
        <div className="container-content text-center">
          <span className="eyebrow">Biella e provincia</span>
          <h1 className="mt-8 font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink">
            Assicurazioni a Biella:<br />
            un <span className="hl">broker,</span> non un’agenzia.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">
            La differenza è sostanziale: un’agenzia propone i prodotti della compagnia per cui
            lavora, un broker confronta più compagnie e sceglie in base al tuo caso. Quootami opera
            a Biella e in provincia con un unico referente, dalla richiesta alla gestione del
            sinistro.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/polizze" className="btn-primary">
              Richiedi un preventivo →
            </Link>
            <a
              href={OPERATORE.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Scrivi su WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Broker vs agenzia */}
      <section className="section bg-bg-alt">
        <div className="container-content">
          <div className="text-center mb-10">
            <span className="eyebrow">La differenza</span>
            <h2 className="section-title">
              Perché rivolgersi a un <span className="hl">broker.</span>
            </h2>
          </div>
          <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-bg-card border border-black/5 p-6">
              <p className="font-sans font-bold text-base text-ink">Agenzia mono-mandataria</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted leading-relaxed list-none">
                <li>Propone i prodotti della propria compagnia.</li>
                <li>Il confronto, se serve, lo devi fare tu andando altrove.</li>
                <li>Cambiare compagnia significa cambiare interlocutore.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-bg-card border border-brand-green/30 p-6">
              <p className="font-sans font-bold text-base text-ink">Broker (Quootami)</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted leading-relaxed list-none">
                <li>Confronta le proposte di più compagnie secondo i mandati del broker.</li>
                <li>Lavora per il cliente, non per la compagnia.</li>
                <li>Se cambia la compagnia, il referente resta lo stesso.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contesto locale */}
      <section className="section">
        <div className="container-content">
          <div className="max-w-prose-wide mx-auto prose-quootami">
            <h2>Cosa sta succedendo ai prezzi nel Nord-Ovest</h2>
            <p>
              Secondo la rilevazione IVASS sui prezzi effettivi dell’RC auto, nel primo trimestre
              2026 il premio medio in Italia è stato di <strong>423 euro</strong>, con un aumento
              del 3,2% su base annua (1,5% al netto dell’inflazione). Il dato interessante per chi
              vive qui riguarda le province: tra i rincari più marcati d’Italia compare{' '}
              <strong>Vercelli, con +5,8%</strong> — la provincia confinante con quella di Biella.
            </p>
            <p>
              È il motivo per cui, in questa zona, confrontare più compagnie prima del rinnovo pesa
              più che altrove: quando i prezzi salgono, la differenza tra la prima e la terza
              proposta si allarga.
            </p>

            <h2>Il rischio idrogeologico nel Biellese</h2>
            <p>
              Il territorio biellese è stato interessato da eventi alluvionali documentati, con
              ordinanze e bandi regionali per i danni da eventi atmosferici eccezionali che hanno
              riguardato anche la provincia di Biella. Per le imprese questo si intreccia con
              l’obbligo di{' '}
              <Link href="/guide/polizza-catastrofale-imprese-chi-e-obbligato">
                polizza catastrofale
              </Link>
              ; per le famiglie, con la scelta delle garanzie della{' '}
              <Link href="/polizza-casa">polizza casa</Link> e con la{' '}
              <Link href="/guide/detrazione-polizza-eventi-calamitosi-casa">
                detrazione del 19% sugli eventi calamitosi
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="section bg-bg-alt">
        <div className="container-content">
          <div className="text-center mb-10">
            <span className="eyebrow">Di cosa mi occupo</span>
            <h2 className="section-title">
              Coperture per privati e <span className="hl">imprese.</span>
            </h2>
          </div>
          <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <BloccoServizi titolo="Privati e famiglie" voci={privati} />
            <BloccoServizi titolo="Imprese e professionisti" voci={imprese} />
          </div>
          <p className="mt-8 text-center text-sm text-ink-muted">
            Oltre alle polizze, il{' '}
            <Link href="/piano-pensione" className="text-brand-green-dark underline underline-offset-2">
              fondo pensione
            </Link>{' '}
            e il{' '}
            <Link href="/luce" className="text-brand-green-dark underline underline-offset-2">
              confronto delle tariffe luce e gas
            </Link>{' '}
            sui dati del Portale Offerte ARERA.
          </p>
        </div>
      </section>

      {/* Come funziona + contatti */}
      <section className="section">
        <div className="container-content">
          <div className="text-center mb-10">
            <span className="eyebrow">Come funziona</span>
            <h2 className="section-title">
              Di persona o a <span className="hl">distanza.</span>
            </h2>
            <p className="section-sub mx-auto">
              Su appuntamento a Biella e provincia, oppure interamente online se preferisci: la
              raccolta dei dati, il confronto e la firma si possono gestire senza spostarsi.
            </p>
          </div>

          <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
            <CardContatto
              titolo="WhatsApp"
              testo="Risposta in orario lavorativo"
              href={OPERATORE.social.whatsapp}
              esterno
            />
            <CardContatto
              titolo="Telefono"
              testo={`${contatti.telefono_display} · ${contatti.orari}`}
              href={`tel:${contatti.telefono_tel}`}
            />
            <CardContatto titolo="Email" testo={contatti.email} href={`mailto:${contatti.email}`} />
          </div>

          <p className="mt-10 text-center text-xs text-ink-muted max-w-prose-wide mx-auto leading-relaxed">
            {collaboratore.nome_completo}, intermediario iscritto al RUI sezione{' '}
            {collaboratore.rui_sezione} n. {collaboratore.rui_numero}, opera per conto di{' '}
            {broker.ragione_sociale_breve} (RUI sezione {broker.rui_sezione} n. {broker.rui_numero}).
          </p>
        </div>
      </section>

      {/* CTA finale */}
      <section className="section bg-bg-alt">
        <div className="container-content text-center">
          <span className="eyebrow">Preventivo gratuito</span>
          <h2 className="section-title">
            Confrontiamo le tue <span className="hl">polizze.</span>
          </h2>
          <p className="section-sub mx-auto">
            Nessun costo, nessun impegno: si parte da quello che hai già e si verifica se esiste di
            meglio.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/polizze" className="btn-primary">
              Scegli il prodotto →
            </Link>
            <Link href="/contatti" className="btn-secondary">
              Parla con Quootami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Sotto-componenti ── */

function BloccoServizi({
  titolo,
  voci,
}: {
  titolo: string;
  voci: { slug: string; title: string; shortDesc: string }[];
}) {
  return (
    <div className="rounded-2xl bg-bg-card border border-black/5 p-6">
      <p className="font-sans font-bold text-base text-ink mb-4">{titolo}</p>
      <ul className="space-y-3 list-none">
        {voci.map(v => (
          <li key={v.slug}>
            <Link href={`/${v.slug}`} className="group block">
              <span className="font-semibold text-sm text-ink group-hover:text-brand-green-dark transition-colors">
                {v.title}
              </span>
              <span className="block text-sm text-ink-muted leading-relaxed">{v.shortDesc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CardContatto({
  titolo,
  testo,
  href,
  esterno,
}: {
  titolo: string;
  testo: string;
  href: string;
  esterno?: boolean;
}) {
  const cls =
    'block rounded-2xl bg-bg-card border border-black/5 p-6 text-center hover:-translate-y-1 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft';
  const inner = (
    <>
      <p className="font-sans font-bold text-base text-ink">{titolo}</p>
      <p className="mt-1.5 text-sm text-ink-muted leading-relaxed break-words">{testo}</p>
    </>
  );
  return esterno ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}
