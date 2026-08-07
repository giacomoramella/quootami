/**
 * Quootami — dati strutturati schema.org (JSON-LD).
 * ============================================================
 * ECCEZIONE DOCUMENTATA alla regola CLAUDE.md su dangerouslySetInnerHTML:
 * i blocchi <script type="application/ld+json"> sono l'UNICO modo di emettere
 * JSON-LD (React escaperebbe le entities nei figli testo, corrompendo il JSON
 * dentro <script>, che il parser HTML tratta come raw text). Il contenuto è
 * SEMPRE JSON.stringify di oggetti statici da config (zero input utente) e
 * `sanificato` (`<` → <) → nessun vettore XSS. Pattern raccomandato
 * dalla documentazione Next.js per i dati strutturati.
 *
 * Nota CSP: i data block ld+json non sono script eseguibili → non richiedono
 * nonce e non sono soggetti a script-src.
 */

import { OPERATORE } from '@/config/operatore';
import type { Polizza } from '@/config/polizze';

/**
 * Profili pubblici dell'intermediario, per `sameAs`: è il campo con cui Google
 * collega la persona che firma le pagine ai suoi profili verificabili altrove.
 * Le voci vuote in `OPERATORE.social` vengono scartate.
 */
const PROFILI_PERSONA = [OPERATORE.social.linkedin, OPERATORE.social.instagram].filter(Boolean);

/** Serializzazione sicura per <script>: niente sequenze che chiudono il tag. */
function safeJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function Script({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}

/** Schema sito-wide: InsuranceAgency (broker) + WebSite. Montato nel layout. */
export function JsonLdSito() {
  const { brand, contatti, collaboratore, broker } = OPERATORE;
  return (
    <>
      <Script
        data={{
          '@context': 'https://schema.org',
          '@type': 'InsuranceAgency',
          name: brand.name,
          url: brand.url,
          logo: `${brand.url}/apple-icon.png`,
          image: `${brand.url}/og-image.png`,
          description: brand.description,
          // E.164 senza spazi: formato atteso da Google
          telephone: `+${contatti.telefono_wa}`,
          email: contatti.email,
          // `address` è richiesto per i sottotipi di LocalBusiness: senza,
          // il Rich Results Test segnala il campo mancante.
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Biella',
            addressRegion: 'BI',
            postalCode: '13900',
            addressCountry: 'IT',
          },
          areaServed: { '@type': 'Country', name: 'Italia' },
          founder: {
            '@type': 'Person',
            name: collaboratore.nome_completo,
            url: `${brand.url}/chi-siamo`,
            ...(PROFILI_PERSONA.length ? { sameAs: PROFILI_PERSONA } : {}),
          },
          parentOrganization: { '@type': 'Organization', name: broker.ragione_sociale_breve },
          knowsLanguage: 'it',
        }}
      />
      <Script
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: brand.name,
          url: brand.url,
          inLanguage: 'it-IT',
        }}
      />
    </>
  );
}

/**
 * BreadcrumbList generico. `voci` sono i passi DOPO la Home (aggiunta in automatico),
 * con `href` relativo alla root (es. '/polizze').
 */
export function JsonLdBreadcrumb({ voci }: { voci: { nome: string; href: string }[] }) {
  const base = OPERATORE.brand.url;
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: base },
          ...voci.map((v, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: v.nome,
            item: `${base}${v.href}`,
          })),
        ],
      }}
    />
  );
}

/** Breadcrumb delle pagine prodotto: Home → Polizze → prodotto. */
export function JsonLdBreadcrumbProdotto({ polizza }: { polizza: Polizza }) {
  return (
    <JsonLdBreadcrumb
      voci={[
        { nome: 'Polizze', href: '/polizze' },
        { nome: polizza.title, href: `/${polizza.slug}` },
      ]}
    />
  );
}

/**
 * Article per le guide/approfondimenti. Le date vanno in formato ISO (YYYY-MM-DD).
 * L'autore è l'intermediario (persona fisica), l'editore il brand.
 */
export function JsonLdArticle({
  titolo,
  descrizione,
  href,
  pubblicato,
  aggiornato,
}: {
  titolo: string;
  descrizione: string;
  /** percorso relativo, es. '/guide/polizza-catastrofale-pmi' */
  href: string;
  pubblicato: string;
  aggiornato?: string;
}) {
  const { brand, collaboratore } = OPERATORE;
  const url = `${brand.url}${href}`;
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: titolo,
        description: descrizione,
        inLanguage: 'it-IT',
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
        image: `${brand.url}/og-image.png`,
        datePublished: pubblicato,
        dateModified: aggiornato ?? pubblicato,
        author: {
          '@type': 'Person',
          name: collaboratore.nome_completo,
          url: `${brand.url}/chi-siamo`,
          ...(PROFILI_PERSONA.length ? { sameAs: PROFILI_PERSONA } : {}),
        },
        publisher: {
          '@type': 'Organization',
          name: brand.name,
          logo: { '@type': 'ImageObject', url: `${brand.url}/apple-icon.png` },
        },
      }}
    />
  );
}

/** FAQPage per le pagine prodotto (usa le FAQ già presenti in config/polizze). */
/**
 * FAQPage per le pagine che non hanno un oggetto Polizza (hub, /luce).
 * Le domande devono essere effettivamente visibili nella pagina: pubblicare
 * un FAQPage senza il testo corrispondente viola le linee guida di Google.
 */
export function JsonLdFaqGenerico({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }}
    />
  );
}

export function JsonLdFaq({ polizza }: { polizza: Polizza }) {
  if (!polizza.faq?.items?.length) return null;
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: polizza.faq.items.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }}
    />
  );
}
