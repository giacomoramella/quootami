import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';

/**
 * Sezione "Come possiamo aiutarti" della home previdenza — ispirata a
 * latuapensione.it. Sei servizi, ognuno con tre punti concreti e un rimando.
 * I rimandi puntano a risorse reali del sito (calcolatore, guida, schema,
 * WhatsApp, adesione), non a funzioni inesistenti.
 */

type Servizio = {
  titolo: string;
  desc: string;
  punti: string[];
  cta: string;
  href: string;
  esterno?: boolean;
};

const SERVIZI: Servizio[] = [
  {
    titolo: 'Ti conviene il fondo pensione?',
    desc: 'Analisi della tua situazione fiscale e del risparmio rispetto a investire da solo.',
    punti: ['Calcolo IRPEF personalizzato', 'Confronto con il fai-da-te', 'Vantaggio stimato in euro'],
    cta: 'Calcola ora',
    href: '#calcolatore',
  },
  {
    titolo: 'Scegliere il fondo giusto',
    desc: 'Ti aiutiamo a trovare la forma più adatta: negoziale, aperto o piano individuale.',
    punti: ['Analisi dei costi (ISC)', 'Confronto delle caratteristiche', 'Adesione collettiva o individuale'],
    cta: 'Vedi le differenze',
    href: '/piano-pensione/schema',
  },
  {
    titolo: 'Il comparto adatto a te',
    desc: 'La linea di investimento giusta per la tua età e quanti anni mancano alla pensione.',
    punti: ['Garantito, bilanciato o azionario', 'Strategia in base all’orizzonte', 'Come e quando cambiare linea'],
    cta: 'Approfondisci',
    href: '/piano-pensione/guida',
  },
  {
    titolo: 'Anticipazioni e prelievi',
    desc: 'Quando e quanto puoi anticipare per casa, spese sanitarie o altre esigenze.',
    punti: ['Anticipazione fino al 75%', 'Riscatto per perdita del lavoro', 'Tassazione agevolata sui prelievi'],
    cta: 'Scopri le opzioni',
    href: '/piano-pensione/guida',
  },
  {
    titolo: 'Trasferire un fondo',
    desc: 'Hai già un fondo che costa troppo? Confrontiamo e, se conviene, ti assistiamo nel passaggio.',
    punti: ['Confronto costi del tuo fondo', 'Nessuna penale dopo 2 anni', 'L’anzianità non riparte da zero'],
    cta: 'Confronta',
    href: '#calcolatore',
  },
  {
    titolo: 'Iscrizione e firma',
    desc: 'Ti accompagniamo passo passo fino all’iscrizione al fondo scelto.',
    punti: ['Assistenza completa', 'Modulistica preparata per te', 'Firma online a norma eIDAS'],
    cta: 'Parla con Quootami',
    href: OPERATORE.social.whatsapp,
    esterno: true,
  },
];

export function PensioneServizi() {
  return (
    <section className="section bg-bg-alt">
      <div className="container-content">
        <div className="text-center mb-12">
          <span className="eyebrow">I nostri servizi</span>
          <h2 className="section-title">
            Come possiamo <span className="hl">aiutarti</span>
          </h2>
          <p className="section-sub mx-auto">
            Dal primo calcolo fino all&apos;iscrizione: una guida in ogni fase della previdenza
            complementare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVIZI.map((s) => (
            <article
              key={s.titolo}
              className="flex flex-col rounded-2xl bg-bg-card border border-black/5 p-6 sm:p-7 hover:-translate-y-1 hover:border-brand-yellow/70 hover:shadow-brand-md transition-all duration-300 ease-soft"
            >
              <h3 className="font-sans font-bold text-base text-ink">{s.titolo}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
              <ul className="mt-4 space-y-2 list-none">
                {s.punti.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-black/5">
                {s.esterno ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark hover:text-brand-navy transition-colors"
                  >
                    {s.cta} <span aria-hidden>→</span>
                  </a>
                ) : (
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark hover:text-brand-navy transition-colors"
                  >
                    {s.cta} <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
