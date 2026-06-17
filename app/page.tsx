import Link from 'next/link';
import { OPERATORE } from '@/config/operatore';

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8">
        {/* Glass blobs (decorative, GPU-optimized) */}
        <div
          aria-hidden
          className="absolute top-[-260px] left-[-200px] w-[700px] h-[700px] rounded-full bg-bg-alt opacity-55 blur-[100px] animate-drift pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-[-80px] right-[-120px] w-[500px] h-[500px] rounded-full bg-bg-alt opacity-45 blur-[100px] animate-drift pointer-events-none"
          style={{ animationDelay: '-4s' }}
        />

        <div className="container-content text-center relative">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-semibold tracking-wider uppercase text-brand-green-dark animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green-dark" />
            Broker iscritto IVASS · Confronto multi-compagnia
          </span>

          {/* H1 */}
          <h1 className="mt-8 font-sans font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.05] text-ink animate-fade-up">
            <span className="lowercase">quootami</span>
            <span className="text-brand-yellow-deep">.</span>
          </h1>

          {/* Pillars */}
          <p className="mt-6 font-sans font-semibold text-base sm:text-xl tracking-tight text-ink animate-fade-up" style={{ animationDelay: '0.15s' }}>
            {OPERATORE.brand.tagline}
          </p>

          {/* Subtitle */}
          <p className="mt-3 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Trova la copertura giusta e risparmia sulle tasse.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/polizza-auto" className="btn-primary">
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

      {/* ─── CATEGORIE PRODOTTI ─── */}
      <section className="section bg-bg">
        <div className="container-content">
          <div className="text-center mb-16">
            <span className="eyebrow">Cosa cerchi</span>
            <h2 className="section-title">
              Polizze per <span className="hl">privati e imprese.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <CategoryCard href="/polizza-auto" title="Auto e mobilità" desc="RC obbligatoria, Furto, Incendio, Kasko." emoji="🚗" />
            <CategoryCard href="/polizza-casa" title="Casa" desc="RC capofamiglia, furto, incendio, eventi naturali." emoji="🏠" />
            <CategoryCard href="/salute" title="Salute & Vita" desc="Sanitaria, vita, infortuni." emoji="🩺" />
            <CategoryCard href="/cyber" title="Cyber" desc="Furto identità, frodi online." emoji="🔐" />
            <CategoryCard href="/polizza-animali" title="Animali domestici" desc="RC e veterinario." emoji="🐾" />
            <CategoryCard href="/rc" title="Imprese e PMI" desc="RC professionale, Catastrofale, Cyber business." emoji="🏢" />
          </div>
        </div>
      </section>

      {/* ─── PENSION BANNER (verde) ─── */}
      <section className="section bg-bg">
        <div className="container-content">
          <Link
            href="/piano-pensione"
            className="group flex items-center gap-6 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-green/15 to-brand-green-dark/10 border-2 border-brand-green hover:shadow-brand-lg transition-all duration-300 ease-soft"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-green text-white flex items-center justify-center text-3xl">
              💎
            </div>
            <div className="flex-1">
              <span className="inline-block px-3 py-0.5 mb-2 rounded-full bg-brand-green/10 text-brand-green-dark text-xs font-bold tracking-wider uppercase">
                Novità 2026
              </span>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-ink">Deduci fino a €5.300 all&apos;anno</h3>
              <p className="text-sm sm:text-base text-ink-soft mt-1">
                Con il fondo pensione complementare risparmi sulle tasse e costruisci il tuo futuro. <strong>In vigore dal 2026</strong>.
              </p>
            </div>
            <span className="hidden sm:inline-block text-brand-green text-2xl font-bold group-hover:translate-x-1 transition-transform">→</span>
          </Link>
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
            <OmniIcon href={OPERATORE.social.whatsapp} label="Video call" color="violet" external>
              <VideoIcon />
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

function CategoryCard({ href, title, desc, emoji }: { href: string; title: string; desc: string; emoji: string }) {
  return (
    <Link
      href={href}
      className="group relative block p-7 rounded-3xl bg-bg-card border border-black/5 hover:border-brand-yellow hover:shadow-brand-md transition-all duration-300 ease-soft hover:-translate-y-1"
    >
      <div className="text-3xl mb-3" aria-hidden>
        {emoji}
      </div>
      <h3 className="font-sans font-bold text-base text-ink">{title}</h3>
      <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{desc}</p>
      <span className="absolute top-7 right-6 text-ink-muted font-semibold group-hover:text-brand-yellow-deep group-hover:translate-x-1 transition-all">
        →
      </span>
    </Link>
  );
}

function OmniIcon({ href, label, color, external, children }: {
  href: string;
  label: string;
  color: 'green' | 'yellow' | 'navy' | 'violet';
  external?: boolean;
  children: React.ReactNode;
}) {
  const colors = {
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    navy: 'bg-gray-100 text-brand-navy',
    violet: 'bg-violet-100 text-violet-700',
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
function VideoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}
