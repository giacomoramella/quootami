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
          telephone: contatti.telefono_display,
          email: contatti.email,
          areaServed: { '@type': 'Country', name: 'Italia' },
          founder: { '@type': 'Person', name: collaboratore.nome_completo },
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

/** FAQPage per le pagine prodotto (usa le FAQ già presenti in config/polizze). */
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
