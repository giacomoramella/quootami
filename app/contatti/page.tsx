import type { Metadata } from 'next';
import { OPERATORE } from '@/config/operatore';

export const metadata: Metadata = {
  title: 'Contatti · Quootami',
  description: 'Contatti Quootami: WhatsApp, email, telefono. Risposta entro 24 ore lavorative.',
};

export default function ContattiPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 px-5 sm:px-8">
        <div className="container-content text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-semibold tracking-wider uppercase text-brand-green-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green-dark" />
            Parla con Quootami
          </span>
          <h1 className="mt-8 font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink">
            Come posso <span className="hl">aiutarti?</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">
            Scegli il canale che preferisci. Risposta entro 24 ore lavorative.
          </p>
        </div>
      </section>

      <section className="section bg-bg">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-content mx-auto">
            <ContactCard href={OPERATORE.social.whatsapp} external icon="💬" title="WhatsApp" desc="Risposta in tempo reale durante l'orario lavorativo." />
            <ContactCard href={`mailto:${OPERATORE.contatti.email}`} icon="✉️" title="Email" desc={OPERATORE.contatti.email} />
            <ContactCard href={`tel:${OPERATORE.contatti.telefono_tel}`} icon="📞" title="Telefono" desc={`${OPERATORE.contatti.telefono_display} · ${OPERATORE.contatti.orari}`} />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ href, icon, title, desc, external }: { href: string; icon: string; title: string; desc: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="block p-7 bg-bg-card rounded-3xl border border-black/5 hover:-translate-y-1 hover:shadow-brand-md hover:border-brand-yellow transition-all duration-200 ease-soft"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-sans font-bold text-base text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
    </a>
  );
}
