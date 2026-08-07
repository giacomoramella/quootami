import type { Metadata } from 'next';
import Link from 'next/link';
import { PensioneHeaderPagina } from '@/components/PensioneHeaderPagina';
import { PensioneSchemi } from '@/components/PensioneSchemi';
import { JsonLdBreadcrumb } from '@/components/JsonLd';
import { Approfondimento } from '@/components/ProductApprofondimento';
import type { Approfondimento as ApprofondimentoType } from '@/config/polizze';

/** Sezione redazionale in fondo alla guida. Solo numeri fissati dalla legge. */
const APPROFONDIMENTO: ApprofondimentoType = {
  eyebrow: 'Le domande ricorrenti',
  title: 'Dubbi che fermano chi sta valutando un fondo pensione',
  accent: 'Dubbi',
  intro:
    'Sono le obiezioni che tornano più spesso. Nessuna ha una risposta valida per tutti, ma tutte hanno una risposta basata su regole precise.',
  blocchi: [
    {
      h3: '«Se metto i soldi lì dentro non li vedo più fino alla pensione»',
      p: [
        'Non è così. La normativa prevede anticipazioni in corso di adesione: in qualsiasi momento fino al 75% per spese sanitarie straordinarie; dopo otto anni di iscrizione fino al 75% per l\'acquisto o la ristrutturazione della prima casa e fino al 30% per esigenze ulteriori, senza doverne indicare il motivo.',
        'Esistono inoltre i casi di riscatto, totale o parziale, legati a situazioni come la cessazione dell\'attività lavorativa, l\'invalidità permanente o la disoccupazione prolungata. Il capitale non è quindi indisponibile: è vincolato a condizioni note in anticipo.',
      ],
    },
    {
      h3: '«Il vantaggio fiscale è solo un rinvio della tassazione»',
      p: [
        'In parte lo è, ma il rinvio avviene a un\'aliquota molto più bassa. I contributi si deducono dal reddito complessivo fino a 5.300 euro l\'anno, abbattendo l\'IRPEF all\'aliquota marginale di chi versa. La prestazione finale è invece tassata con un\'imposta sostitutiva del 15%, che scende dello 0,30% per ogni anno di partecipazione oltre il quindicesimo, fino a un minimo del 9%.',
        'La differenza fra l\'aliquota risparmiata oggi e quella pagata domani è il vantaggio reale, e non dipende dall\'andamento dei mercati. Anche i rendimenti maturati sono tassati al 20%, contro il 26% della generalità delle rendite finanziarie.',
      ],
    },
    {
      h3: '«Preferisco tenere il TFR in azienda, è più sicuro»',
      p: [
        'Il TFR lasciato in azienda si rivaluta secondo un criterio fissato per legge: 1,5% fisso più il 75% dell\'aumento dell\'indice ISTAT dei prezzi al consumo. È un rendimento prevedibile, non un rendimento garantito superiore.',
        'Il confronto onesto non è quindi fra rischio e sicurezza, ma fra due regole diverse di rivalutazione, alle quali si aggiungono la deducibilità dei versamenti volontari e l\'eventuale contributo del datore di lavoro previsto dai contratti collettivi, che nel TFR in azienda non esiste.',
      ],
    },
    {
      h3: '«Tanto i fondi si somigliano tutti»',
      p: [
        'La variabile che li distingue in modo più netto è il costo, misurato dall\'Indicatore Sintetico di Costo pubblicato da COVIP secondo criteri uniformi, che rende i fondi confrontabili fra loro. Su un orizzonte di trent\'anni la differenza fra un ISC basso e uno alto incide sul capitale finale più di quanto si tenda a immaginare.',
        'La seconda variabile è il comparto scelto rispetto agli anni che mancano alla pensione: un comparto garantito su un orizzonte lungo protegge da un rischio che, su quell\'orizzonte, è meno rilevante del costo opportunità.',
      ],
    },
  ],
  fonti:
    'D.Lgs. 252/2005, artt. 11 e 14 (anticipazioni, riscatti, tassazione della prestazione); art. 2120 Codice civile (rivalutazione del TFR); L. 199/2025 per il limite di deducibilità; COVIP per l\'Indicatore Sintetico di Costo.',
};

/** Home → Piano pensione → sottopagina. */
const BREADCRUMB = [
  { nome: 'Piano pensione', href: '/piano-pensione' },
  { nome: 'Guida ai fondi pensione', href: '/piano-pensione/guida' },
];

const META_TITLE = 'Fondi pensione: come funzionano e cosa si deduce';
const META_DESC =
  'Guida ai fondi pensione: vantaggi fiscali, dove destinare il TFR, novità 2026, anticipazioni, RITA e premorienza. Fonti di legge.';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    images: [
      { url: '/og-image.png', alt: 'Quootami — guida ai fondi pensione', width: 1200, height: 630 },
    ],
  },
};

export default function GuidaPensionePage() {
  return (
    <>
      <JsonLdBreadcrumb voci={BREADCRUMB} />
      <PensioneHeaderPagina
        eyebrow="La guida"
        titolo="Tutto sui fondi"
        accent="pensione."
        sottotitolo="Dalle basi alla pianificazione: scegli un modulo e si apre qui sotto. Fatti fiscali e normativi verificati alle fonti di legge."
      />

      {/* Rimando allo schema visuale, come su latuapensione */}
      <section className="px-5 sm:px-8">
        <div className="container-content">
          <div className="rounded-2xl bg-bg-alt border border-black/5 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="font-sans font-bold text-base text-ink">Vuoi una panoramica veloce?</h2>
              <p className="mt-1 text-sm text-ink-muted leading-relaxed max-w-prose-wide">
                Lo schema visuale mostra tutto il percorso, dall&apos;adesione alla rendita, in un colpo d&apos;occhio.
              </p>
            </div>
            <Link
              href="/piano-pensione/schema"
              className="btn-secondary flex-shrink-0 self-start sm:self-auto"
            >
              Vedi lo schema →
            </Link>
          </div>
        </div>
      </section>

      <PensioneSchemi mostraTestata={false} />

      <Approfondimento dati={APPROFONDIMENTO} />
    </>
  );
}
