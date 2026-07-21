import type { Metadata } from 'next';
import Link from 'next/link';
import { PensioneHeaderPagina } from '@/components/PensioneHeaderPagina';
import { PensioneSchemi } from '@/components/PensioneSchemi';

export const metadata: Metadata = {
  title: 'Guida ai fondi pensione · Vantaggi fiscali, TFR, anticipazioni',
  description:
    'Guida completa alla previdenza complementare: vantaggi fiscali (E-T-T), dove destinare il TFR, novità 2026, anticipazioni, RITA e premorienza. Fonti di legge verificate.',
};

export default function GuidaPensionePage() {
  return (
    <>
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
    </>
  );
}
