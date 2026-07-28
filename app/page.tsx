import type { Metadata } from 'next';
import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';
import { getPolizzeByCategory } from '@/config/polizze';

// Description dedicata (keyword-mirata) — il title resta quello di default
// del sito, così la card di condivisione social non cambia.
export const metadata: Metadata = {
  description:
    'Confronta polizze auto, casa, salute, cyber e fondo pensione con Quootami: comparatore digitale e consulenza personale di un intermediario indipendente. Preventivo gratuito.',
};

/** Aree di copertura raccolte sotto /polizze (previdenza ha un blocco suo). */
const NUM_POLIZZE =
  getPolizzeByCategory('privati').length + getPolizzeByCategory('imprese').length;

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8">
        {/* Blob decorativi brand (GPU-optimized) */}
        <div
          aria-hidden
          className="blob-yellow top-[-260px] left-[-200px] w-[700px] h-[700px]"
        />
        <div
          aria-hidden
          className="blob-green bottom-[-120px] right-[-140px] w-[520px] h-[520px]"
          style={{ animationDelay: '-4s' }}
        />

        <div className="container-content text-center relative">
          {/* H1 */}
          <h1 className="mt-8 font-sans font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.05] text-ink animate-fade-up">
            <span>{OPERATORE.brand.name}</span>
            <span className="text-brand-yellow-deep">.</span>
          </h1>

          {/* Pillars */}
          <p className="mt-6 font-sans font-semibold text-base sm:text-xl tracking-tight text-ink animate-fade-up" style={{ animationDelay: '0.15s' }}>
            {OPERATORE.brand.tagline}
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/polizze" className="btn-primary">
              Richiedi un preventivo →
            </Link>
            <Link href="/chi-siamo" className="btn-secondary">
              Scopri Quootami
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.45s' }}>
            <Stat num="Multi-compagnia" label={<>Confronto reale<br />tra più compagnie</>} />
            <Stat num="Referente unico" label={<>Una sola persona<br />dall&apos;inizio alla fine</>} />
            <Stat num="Sinistri inclusi" label={<>Quootami assiste dalla denuncia<br />alla liquidazione</>} />
            <Stat num="IVASS" label={<>Iscrizione attiva<br />al RUI</>} />
          </div>
        </div>
      </section>

      {/* ─── 3 AREE PRINCIPALI ─── */}
      <section className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-16">
            <span className="eyebrow">Cosa cerchi</span>
            <h2 className="section-title">
              Tre modi per <span className="hl">risparmiare.</span>
            </h2>
            <p className="section-sub mx-auto">
              Scegli l&apos;area che ti interessa: Quootami confronta e ti segue fino alla firma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AreaCard
              href="/polizze"
              accent="yellow"
              title="Polizze assicurative"
              desc="Auto, casa, salute, cyber, animali e imprese. Confronto multi-compagnia per trovare la copertura adatta."
              items={['Auto e mobilità', 'Casa e famiglia', 'Salute & Vita', 'Cyber e animali', 'Imprese e PMI']}
              cta={`${NUM_POLIZZE} aree di copertura`}
              icon={<ShieldIcon />}
            />
            <AreaCard
              href="/piano-pensione"
              accent="green"
              badge="Novità 2026"
              title="Fondo pensione"
              desc="Deduci fino a €5.300 all'anno dal reddito IRPEF e costruisci la pensione integrativa."
              items={['Deduzione fino a €5.300', 'Rendimenti tassati al 20%', 'Calcolatore del risparmio']}
              cta="Calcola il vantaggio fiscale"
              icon={<GrowthIcon />}
            />
            <AreaCard
              href="/luce"
              accent="navy"
              title="Luce e Gas"
              desc="Confronta le tariffe di energia elettrica e gas sui dati ufficiali ARERA. Gratuito e senza impegno."
              items={['Dati ufficiali ARERA', 'Confronto in 2 minuti', 'Lettura automatica bolletta']}
              cta="Confronta le tariffe"
              icon={<BoltIcon />}
            />
          </div>
        </div>
      </section>

      {/* ─── OMNICANALE — 4 icone minimal ─── */}
      <section className="section bg-bg">
        <div className="container-content text-center">
          <span className="eyebrow">Siamo sempre con te</span>
          <h2 className="section-title">
            Il tuo <span className="hl">phygital partner.</span>
          </h2>
          <p className="section-sub mx-auto">Scegli il canale che preferisci. Quootami ti risponde sempre.</p>

          <div className="mt-12 flex flex-wrap justify-center gap-10 sm:gap-14">
            <OmniIcon href={OPERATORE.social.whatsapp} label="WhatsApp" color="green" external>
              <WhatsAppIcon />
            </OmniIcon>
            <OmniIcon href={`mailto:${OPERATORE.contatti.email}`} label="Email" color="yellow">
              <EmailIcon />
            </OmniIcon>
            <OmniIcon href={`tel:${OPERATORE.contatti.telefono_tel}`} label="Telefono" color="navy">
              <PhoneIcon />
            </OmniIcon>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Subcomponents (interni a questo file per snellezza) ── */
function Stat({ num, label }: { num: string; label: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="font-sans font-bold text-base sm:text-lg text-ink leading-tight">
        {num}
        <div className="w-6 h-0.5 bg-brand-yellow rounded-full mx-auto mt-2" />
      </div>
      <p className="mt-3 text-sm text-ink-muted leading-relaxed">{label}</p>
    </div>
  );
}

/**
 * Blocco grande di una delle 3 aree della home. L'accento colorato
 * riprende la palette già in uso: giallo = brand, verde = previdenza,
 * navy = energia.
 */
function AreaCard({ href, accent, badge, title, desc, items, cta, icon }: {
  href: string;
  accent: 'yellow' | 'green' | 'navy';
  badge?: string;
  title: string;
  desc: string;
  items: string[];
  cta: string;
  icon: React.ReactNode;
}) {
  const styles = {
    yellow: {
      border: 'hover:border-brand-yellow',
      iconBox: 'bg-brand-yellow/15 text-brand-yellow-deep group-hover:bg-brand-yellow group-hover:text-ink',
      dot: 'bg-brand-yellow',
      cta: 'text-brand-yellow-deep',
      badge: 'bg-brand-yellow/15 text-brand-yellow-deep',
    },
    green: {
      border: 'hover:border-brand-green',
      iconBox: 'bg-brand-green/15 text-brand-green group-hover:bg-brand-green group-hover:text-white',
      dot: 'bg-brand-green',
      cta: 'text-brand-green-dark',
      badge: 'bg-brand-green/10 text-brand-green-dark',
    },
    navy: {
      border: 'hover:border-brand-navy',
      iconBox: 'bg-brand-navy/10 text-brand-navy group-hover:bg-brand-navy group-hover:text-white',
      dot: 'bg-brand-navy',
      cta: 'text-brand-navy',
      badge: 'bg-brand-navy/10 text-brand-navy',
    },
  } as const;
  const s = styles[accent];

  return (
    <Link
      href={href}
      className={`group flex flex-col h-full p-8 rounded-3xl bg-bg-card border border-black/5 ${s.border}
                  hover:shadow-brand-lg transition-all duration-300 ease-soft hover:-translate-y-1.5`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ease-soft group-hover:scale-110 ${s.iconBox}`}
        aria-hidden
      >
        {icon}
      </div>

      {badge && (
        <span className={`inline-block self-start px-3 py-0.5 mb-2 rounded-full text-xs font-bold tracking-wider uppercase ${s.badge}`}>
          {badge}
        </span>
      )}

      <h3 className="font-sans font-bold text-xl text-ink">{title}</h3>
      <p className="text-sm text-ink-muted mt-2 leading-relaxed">{desc}</p>

      <ul className="mt-5 space-y-2 list-none">
        {items.map(item => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-ink-soft">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <span className={`mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold ${s.cta}`}>
        {cta}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
      </span>
    </Link>
  );
}

function OmniIcon({ href, label, color, external, children }: {
  href: string;
  label: string;
  color: 'green' | 'yellow' | 'navy';
  external?: boolean;
  children: React.ReactNode;
}) {
  const colors = {
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    navy: 'bg-gray-100 text-brand-navy',
  } as const;
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform duration-200 ease-soft"
      aria-label={label}
    >
      <span className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-shadow ${colors[color]}`}>
        {children}
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </a>
  );
}

/* ── Icons SVG inline (no extra HTTP) ── */
function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function GrowthIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
      <path d="M15 8h4v4" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
