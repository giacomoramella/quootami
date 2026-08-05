import type { Metadata } from 'next';
import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';

export const metadata: Metadata = {
  title: 'Chi siamo · Il broker assicurativo digitale',
  description: 'Quootami confronta le polizze di più compagnie con un solo referente: chi c\'è dietro, come lavora e gli estremi di iscrizione al RUI, vigilati IVASS.',
};

export default function ChiSiamoPage() {
  const { collaboratore: c, broker: b, contatti } = OPERATORE;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8">
        <div aria-hidden className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]" />
        <div
          aria-hidden
          className="blob-green bottom-[-140px] right-[-140px] w-[520px] h-[520px]"
          style={{ animationDelay: '-4s' }}
        />

        <div className="container-content text-center relative">
          <span className="eyebrow animate-fade-in">Chi siamo</span>
          <h1 className="mt-4 font-sans font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-ink animate-rise">
            Il broker assicurativo <span className="hl">digitale.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {OPERATORE.brand.name} semplifica la ricerca della polizza giusta, in tutta Italia:
            confronto multi-compagnia, consulenza chiara, un solo referente.
          </p>
        </div>
      </section>

      {/* ─── MISSIONE + CARTA D'IDENTITÀ ─── */}
      <section className="section bg-bg">
        <div className="container-content grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="eyebrow">La missione</span>
            <h2 className="section-title">
              Polizze giuste, <span className="hl">tempo risparmiato.</span>
            </h2>
            <p className="section-sub">
              Quootami nasce per restituire alle persone il controllo delle proprie assicurazioni.
              Niente prodotti spinti a provvigione, niente gergo tecnico: le proposte delle
              compagnie vengono confrontate e spiegate voce per voce, e il cliente sceglie
              con tutti gli elementi sul tavolo.
            </p>
            <p className="mt-4 text-ink-muted text-base sm:text-lg leading-relaxed">
              Dietro al sito c&apos;è un intermediario in carne e ossa, iscritto al RUI e
              vigilato IVASS — non un call center.
            </p>
          </div>

          {/* Carta d'identità dell'intermediario — tutti dati verificabili */}
          <div className="p-[2px] rounded-3xl bg-gradient-to-br from-brand-yellow via-brand-yellow to-brand-green shadow-glow-yellow">
            <div className="rounded-[calc(1.5rem-2px)] bg-bg-card p-7 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-5">
                Carta d&apos;identità dell&apos;intermediario
              </p>
              <dl className="space-y-4">
                <IdRow label="Collaboratore" value={c.nome_completo} />
                <IdRow label="Iscrizione RUI" value={`Sezione ${c.rui_sezione} · n. ${c.rui_numero} · dal ${c.iscritto_dal}`} />
                <IdRow label="Broker" value={b.ragione_sociale_breve} />
                <IdRow label="RUI broker" value={`Sezione ${b.rui_sezione} · n. ${b.rui_numero}`} />
                <IdRow label="Vigilanza" value="IVASS — Istituto per la Vigilanza sulle Assicurazioni" />
                <IdRow label="Disponibilità" value={contatti.orari} />
              </dl>
              <p className="mt-6 text-xs text-ink-muted">
                Iscrizioni verificabili sul{' '}
                <a
                  href="https://ruipubblico.ivass.it/rui-pubblica/ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ink transition-colors"
                >
                  Registro Unico degli Intermediari (IVASS)
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALORI ─── */}
      <section className="section bg-bg-alt">
        <div className="container-content">
          <div className="text-center mb-14">
            <span className="eyebrow">I valori Quootami</span>
            <h2 className="section-title">
              Tre principi <span className="hl">non negoziabili.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🎯', title: 'Indipendenza', desc: 'Quootami non vende prodotti di una singola compagnia. Confronta le proposte del mercato e propone solo quelle adatte al cliente, senza conflitto di interesse.' },
              { icon: '🔍', title: 'Trasparenza', desc: 'Ogni preventivo è dettagliato voce per voce. Niente costi nascosti, niente clausole in piccolo scoperte dopo la firma.' },
              { icon: '🤝', title: 'Continuità', desc: 'Un solo referente segue il cliente dall\'inizio alla fine: dalla richiesta del preventivo alla gestione del sinistro.' },
            ].map((v) => (
              <article
                key={v.title}
                className="group bg-bg-card border border-black/5 rounded-3xl p-7 hover:-translate-y-1.5 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 ease-soft">
                  {v.icon}
                </div>
                <h3 className="font-sans font-bold text-lg text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHYGITAL: digitale + umano ─── */}
      <section className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-14">
            <span className="eyebrow">Il metodo</span>
            <h2 className="section-title">
              Digitale dove serve, <span className="hl">umano dove conta.</span>
            </h2>
            <p className="section-sub mx-auto">{OPERATORE.brand.claim}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-3xl bg-brand-navy text-white p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-4">Digitale</p>
              <ul className="space-y-3 list-none">
                <MethodItem dark>Preventivi richiesti e ricevuti online, senza appuntamenti</MethodItem>
                <MethodItem dark>Firma elettronica a norma eIDAS: niente stampe né scansioni</MethodItem>
                <MethodItem dark>WhatsApp come canale diretto, con risposte in orario di lavoro</MethodItem>
              </ul>
            </div>
            <div className="rounded-3xl bg-bg-card border border-black/5 p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-green-dark mb-4">Umano</p>
              <ul className="space-y-3 list-none">
                <MethodItem>Ogni proposta è selezionata e spiegata da una persona, non da un algoritmo</MethodItem>
                <MethodItem>Lo stesso referente dalla prima richiesta alla liquidazione del sinistro</MethodItem>
                <MethodItem>Consulenza al telefono quando il caso è complesso o urgente</MethodItem>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPLIANCE + CTA ─── */}
      <section className="section bg-bg-alt">
        <div className="container-content text-center">
          <span className="eyebrow">Compliance</span>
          <h2 className="section-title">
            Vigilato IVASS, <span className="hl">conforme normativa.</span>
          </h2>
          <p className="section-sub mx-auto">
            L&apos;attività di Quootami è vigilata dall&apos;IVASS e svolta in conformità con il
            Codice delle Assicurazioni Private (D.Lgs. 209/2005) e le normative IDD e POG
            sulla distribuzione assicurativa.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contatti" className="btn-primary">
              Parla con Quootami →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Sotto-componenti ── */

function IdRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted sm:w-32 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

function MethodItem({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
          dark ? 'bg-brand-yellow text-ink' : 'bg-brand-green/10 text-brand-green-dark'
        }`}
        aria-hidden
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span className={`text-sm leading-relaxed ${dark ? 'text-white/85' : 'text-ink-soft'}`}>{children}</span>
    </li>
  );
}
