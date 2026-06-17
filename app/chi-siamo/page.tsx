import type { Metadata } from 'next';
import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';

export const metadata: Metadata = {
  title: 'Chi siamo · Quootami',
  description: 'Quootami è il broker assicurativo digitale: confronto multi-compagnia indipendente, vigilato IVASS.',
};

export default function ChiSiamoPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 px-5 sm:px-8">
        <div className="container-content text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-semibold tracking-wider uppercase text-brand-green-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green-dark" />
            Chi siamo
          </span>
          <h1 className="mt-8 font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink">
            Il broker assicurativo <span className="hl">digitale.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">
            {OPERATORE.brand.name} semplifica la ricerca della polizza giusta, in tutta Italia.
          </p>
        </div>
      </section>

      <section className="section bg-bg">
        <div className="container-content text-center">
          <span className="eyebrow">La missione</span>
          <h2 className="section-title">Polizze giuste, <span className="hl">tempo risparmiato.</span></h2>
          <p className="section-sub mx-auto">
            Quootami nasce per restituire alle persone il controllo delle proprie assicurazioni: confronto
            multi-compagnia, consulenza chiara, prezzi trasparenti.
          </p>
        </div>
      </section>

      <section className="section bg-bg-alt">
        <div className="container-content">
          <div className="text-center mb-14">
            <span className="eyebrow">I valori Quootami</span>
            <h2 className="section-title">Tre principi <span className="hl">non negoziabili.</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: '🎯', title: 'Indipendenza', desc: 'Quootami non vende prodotti di una singola compagnia. Confronta tutte le proposte del mercato e propone solo quelle adatte al cliente, senza conflitto di interesse.' },
              { icon: '🔍', title: 'Trasparenza', desc: 'Ogni preventivo è dettagliato voce per voce. Niente costi nascosti, niente "letterine piccole".' },
              { icon: '🤝', title: 'Continuità', desc: 'Un solo referente segue il cliente dall\'inizio alla fine: dalla richiesta del preventivo alla gestione del sinistro.' },
            ].map((v) => (
              <article key={v.title} className="bg-bg-card border border-black/5 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-brand-md transition-all duration-200 ease-soft">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center text-2xl mb-5">{v.icon}</div>
                <h3 className="font-sans font-bold text-lg text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-bg">
        <div className="container-content text-center">
          <span className="eyebrow">Compliance</span>
          <h2 className="section-title">Vigilato IVASS, <span className="hl">conforme normativa.</span></h2>
          <p className="section-sub mx-auto">
            L&apos;attività di Quootami è vigilata dall&apos;IVASS (Istituto per la Vigilanza sulle Assicurazioni) e
            svolta in conformità con il Codice delle Assicurazioni Private (D.Lgs. 209/2005), la normativa POG e IDD.
          </p>
          <div className="mt-10">
            <Link href="/trasparenza" className="btn-primary">Trasparenza intermediario →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
