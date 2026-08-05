import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPolizze, getPolizzeByCategory } from '@/config/polizze';
import { getAllArticoli } from '@/config/guide';

export const metadata: Metadata = {
  title: 'Mappa del sito',
  description:
    'Tutte le pagine di Quootami organizzate per area: polizze per privati e imprese, previdenza, guide, informative legali e contatti.',
};

const SECTIONS = [
  {
    title: '🏠 Home',
    links: [
      { href: '/', label: 'Quootami — Home' },
      { href: '/polizze', label: 'Polizze assicurative — tutte le aree' },
    ],
  },
  {
    title: '🚗 Polizze privati',
    links: getPolizzeByCategory('privati').map(p => ({ href: `/${p.slug}`, label: p.title })),
  },
  {
    title: '💎 Previdenza',
    links: [
      ...getPolizzeByCategory('previdenza').map(p => ({ href: `/${p.slug}`, label: p.title })),
      { href: '/piano-pensione/guida', label: 'Guida ai fondi pensione' },
      { href: '/piano-pensione/schema', label: 'Schema della previdenza' },
      { href: '/piano-pensione/glossario', label: 'Glossario della previdenza' },
    ],
  },
  {
    title: '🏢 Polizze imprese',
    links: getPolizzeByCategory('imprese').map(p => ({ href: `/${p.slug}`, label: p.title })),
  },
  {
    title: '📖 Guide e approfondimenti',
    links: [
      { href: '/guide', label: 'Tutte le guide' },
      ...getAllArticoli().map(a => ({ href: `/guide/${a.slug}`, label: a.titolo })),
    ],
  },
  {
    title: 'ℹ️ Informazioni',
    links: [
      { href: '/chi-siamo', label: 'Chi siamo' },
      { href: '/sinistri', label: 'Gestione sinistri' },
      { href: '/contatti', label: 'Contatti' },
    ],
  },
  {
    title: '📋 Informative legali',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/cookie', label: 'Cookie policy' },
    ],
  },
];

export default function MappaSitoPage() {
  return (
    <>
      <section className="pt-32 pb-12 px-5 sm:px-8">
        <div className="container-content text-center">
          <span className="eyebrow">Navigazione</span>
          <h1 className="font-sans font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] text-ink mt-4">
            Mappa del <span className="hl">sito.</span>
          </h1>
          <p className="section-sub mx-auto">Tutte le pagine del sito Quootami organizzate per area.</p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {SECTIONS.map(section => (
              <div key={section.title}>
                <h2 className="font-sans font-bold text-base text-ink pb-3 border-b-2 border-brand-yellow mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-2 list-none">
                  {section.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-ink hover:text-brand-green-dark hover:pl-1 transition-all">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
