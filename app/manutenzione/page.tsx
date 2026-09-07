import type { Metadata } from 'next';
import { OPERATORE } from '@/config/operatore';

/**
 * Pagina unica servita durante la pausa del sito (config/manutenzione.ts).
 *
 * Ogni URL ci arriva per riscrittura da proxy.ts, quindi risponde 200 con
 * l'indirizzo originale in barra: è la combinazione che Google richiede per
 * togliere davvero le pagine dall'indice, perché deve poterle scaricare per
 * leggerci dentro il `noindex`. Un 404 o un blocco in robots.txt otterrebbe il
 * contrario: senza poter rileggere la pagina, il vecchio risultato resta in
 * SERP più a lungo.
 *
 * Contatti in fondo: il sito è fermo, l'attività no. Chi ha già una polizza
 * deve poter raggiungere l'intermediario. Sono recapiti nudi con l'iscrizione
 * RUI, non un messaggio promozionale: nessun prodotto, nessun claim, nessun
 * invito a comprare.
 */

export const metadata: Metadata = {
  title: 'Sito in manutenzione',
  description: 'Quootami è temporaneamente non disponibile.',
  robots: { index: false, follow: false },
  alternates: {},
};

export default function ManutenzionePage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-5 py-20">
      <div className="w-full max-w-xl text-center">
        <p className="font-sans font-bold text-lg text-ink">
          {OPERATORE.brand.name}
          <span className="text-brand-yellow-deep">.</span>
        </p>

        <h1 className="mt-10 font-sans font-bold text-4xl sm:text-5xl tracking-tight leading-[1.08] text-ink">
          Sito in <span className="hl">manutenzione.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-ink-muted leading-relaxed">
          Stiamo lavorando a una nuova versione. Il servizio tornerà online a breve.
        </p>

        <div className="mt-12 pt-8 border-t border-black/5">
          <p className="text-sm text-ink-muted">Nel frattempo, per chi ha già una pratica in corso:</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${OPERATORE.contatti.telefono_tel}`} className="btn-secondary">
              {OPERATORE.contatti.telefono_display}
            </a>
            <a href={`mailto:${OPERATORE.contatti.email}`} className="btn-secondary">
              Scrivi una email
            </a>
          </div>
          <p className="mt-8 text-xs text-ink-muted leading-relaxed">
            {OPERATORE.collaboratore.nome_completo} — iscritto al RUI sez.{' '}
            {OPERATORE.collaboratore.rui_sezione} n. {OPERATORE.collaboratore.rui_numero}, per conto
            di {OPERATORE.broker.ragione_sociale_breve} (RUI sez. {OPERATORE.broker.rui_sezione} n.{' '}
            {OPERATORE.broker.rui_numero}).
          </p>
        </div>
      </div>
    </section>
  );
}
