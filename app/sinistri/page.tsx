import type { Metadata } from 'next';
import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';
import { JsonLdBreadcrumb } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Sinistri · Come denunciare e gestire',
  description: 'Guida pratica alla gestione di un sinistro assicurativo: denuncia, perizia, liquidazione. Quootami assiste il cliente in ogni fase.',
};

const STEPS = [
  { title: 'Mettere in sicurezza le persone', desc: 'Prima di tutto: incolumità delle persone coinvolte. Se necessario, chiamare il 118 (emergenza sanitaria) o il 112 (NUE — Numero Unico Emergenze).' },
  { title: 'Raccogliere le informazioni', desc: 'Foto dei danni (più angolazioni), foto della scena, dati di eventuali testimoni. Per auto: CAI compilato. Per casa: copia denuncia FFAA se necessaria.' },
  { title: 'Contattare Quootami', desc: 'Il prima possibile, anche prima di parlare con la compagnia. Quootami guida nella procedura corretta e prepara la denuncia formale.' },
  { title: 'Denuncia formale', desc: 'Quootami prepara e invia la denuncia formale alla compagnia entro i termini contrattuali (in genere 3 giorni dall\'evento).' },
  { title: 'Perizia e liquidazione', desc: 'La compagnia invia il perito per la valutazione. Quootami assiste durante la perizia e segue la liquidazione fino al pagamento.' },
  { title: 'Chiusura e follow-up', desc: 'A pratica chiusa, Quootami verifica che la liquidazione sia conforme al contratto. In caso di contestazioni, supporta nella redazione di reclami.' },
];

export default function SinistriPage() {
  return (
    <>
      <JsonLdBreadcrumb voci={[{ nome: 'Sinistri', href: '/sinistri' }]} />
      <section className="relative overflow-hidden pt-32 pb-16 px-5 sm:px-8">
        <div className="container-content text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-semibold tracking-wider uppercase text-brand-green-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green-dark" />
            Gestione sinistri
          </span>
          <h1 className="mt-8 font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink">
            Denuncia del sinistro, <span className="hl">passo per passo.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">
            Cosa fare subito dopo un sinistro, entro quanto va denunciato e come si arriva alla
            liquidazione. Un referente unico segue la pratica dall&apos;inizio alla fine.
          </p>

          <div className="mt-10 max-w-2xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-brand-yellow-deep rounded-2xl">
            {/* h2 e non h3: è il primo titolo dopo l'H1 e un salto di livello
                rompe la gerarchia del documento. La dimensione la dà la classe. */}
            <h2 className="font-bold text-ink mb-2 flex items-center gap-2 justify-center">
              🚨 Hai appena avuto un sinistro?
            </h2>
            <p className="text-sm text-ink-soft mb-4 text-center">
              Contatta Quootami immediatamente. Più rapida è la denuncia, più efficace sarà la gestione.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={OPERATORE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Apri WhatsApp →
              </a>
              <a href={`tel:${OPERATORE.contatti.telefono_tel}`} className="btn-secondary">
                Chiama subito
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-bg-alt">
        <div className="container-content">
          <div className="text-center mb-14">
            <span className="eyebrow">Cosa fare subito</span>
            <h2 className="section-title">I primi passi <span className="hl">dopo un sinistro.</span></h2>
          </div>
          <ol className="max-w-3xl mx-auto list-none space-y-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[48px_1fr] gap-5 pb-8 border-b border-black/10 last:border-0">
                <div className="w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-ink mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-bg text-center">
        <div className="container-content">
          <h2 className="section-title">Sinistro in corso?<br/>Contatta Quootami.</h2>
          <p className="section-sub mx-auto">Più veloce è la denuncia, migliore è la gestione.</p>
          <div className="mt-10">
            <a href={OPERATORE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Apri WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
