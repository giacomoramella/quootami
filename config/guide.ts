/**
 * Quootami — registro delle guide/approfondimenti.
 * ============================================================
 * Qui vivono SOLO i metadati: il corpo di ogni articolo è un componente
 * server in `components/guide/`, mappato per slug in app/guide/[slug]/page.tsx.
 *
 * Registrando gli articoli qui, `app/sitemap.ts` e la mappa del sito li
 * pubblicano automaticamente (stessa logica di config/polizze.ts).
 *
 * REGOLE DI CONTENUTO (settore vigilato IVASS):
 * - mai presentare disegni di legge come norme in vigore;
 * - ogni cifra di premio è una stima di mercato, mai una tariffa;
 * - citare fonti primarie (Gazzetta Ufficiale, IVASS, COVIP, ARERA, ACN).
 */

export type Articolo = {
  slug: string;
  /** H1 e titolo in lista */
  titolo: string;
  /** <title> SEO — può differire dall'H1 */
  metaTitle: string;
  metaDesc: string;
  /** occhiello sopra l'H1 */
  eyebrow: string;
  /** parola evidenziata in giallo nell'H1 */
  accent: string;
  /** sommario mostrato in lista e sotto l'H1 */
  sommario: string;
  /** ISO YYYY-MM-DD */
  pubblicato: string;
  aggiornato?: string;
  /** minuti di lettura, indicativi */
  lettura: number;
  /** slug della polizza collegata (per il rimando commerciale) */
  prodotto?: string;
  categoria: 'imprese' | 'privati' | 'previdenza' | 'casa-energia';
};

export const ARTICOLI: Articolo[] = [
  {
    slug: 'polizza-catastrofale-imprese-chi-e-obbligato',
    titolo: 'Polizza catastrofale: quali imprese sono obbligate',
    metaTitle: 'Polizza catastrofale imprese: chi è obbligato e chi è escluso',
    metaDesc:
      'Obbligo di polizza catastrofale (cat nat) per le imprese: scadenze per dimensione, chi è escluso, quali beni assicurare e cosa si rischia senza copertura.',
    eyebrow: 'Guida imprese',
    accent: 'obbligate',
    sommario:
      'Le scadenze sono già passate per quasi tutte le imprese. Qui trovi chi rientra nell’obbligo, chi ne è fuori, quali beni vanno assicurati e quali conseguenze concrete comporta non essere in regola.',
    pubblicato: '2026-08-04',
    lettura: 6,
    prodotto: 'rc',
    categoria: 'imprese',
  },
  {
    slug: 'polizza-catastrofale-cosa-copre',
    titolo: 'Polizza catastrofale: cosa copre davvero (e cosa no)',
    metaTitle: 'Polizza catastrofale: cosa copre e cosa non copre',
    metaDesc:
      'L’obbligo cat nat copre sismi, alluvioni, frane, inondazioni ed esondazioni. Grandine, trombe d’aria e mareggiate restano fuori: come integrarle.',
    eyebrow: 'Guida imprese',
    accent: 'davvero',
    sommario:
      'Molte imprese comprano la polizza obbligatoria e restano convinte di essere coperte da qualsiasi evento atmosferico. Non è così: l’obbligo riguarda cinque eventi precisi, e i danni più frequenti restano fuori.',
    pubblicato: '2026-08-04',
    lettura: 5,
    prodotto: 'rc',
    categoria: 'imprese',
  },
  {
    slug: 'detrazione-polizza-eventi-calamitosi-casa',
    titolo: 'Detrazione 19% sulla polizza casa contro gli eventi calamitosi',
    metaTitle: 'Detrazione polizza eventi calamitosi: come funziona',
    metaDesc:
      'Sui premi delle polizze contro gli eventi calamitosi su immobili residenziali spetta la detrazione del 19% senza limite di importo. Requisiti e come ottenerla.',
    eyebrow: 'Guida privati',
    accent: 'eventi calamitosi',
    sommario:
      'È una delle poche detrazioni assicurative senza tetto di spesa, ma va richiesta nel modo giusto: serve che il premio delle garanzie calamitose sia distinto in certificazione.',
    pubblicato: '2026-08-04',
    lettura: 4,
    prodotto: 'polizza-casa',
    categoria: 'privati',
  },
];

export function getArticolo(slug: string): Articolo | undefined {
  return ARTICOLI.find(a => a.slug === slug);
}

/** Tutti gli articoli, dal più recente al più vecchio. */
export function getAllArticoli(): Articolo[] {
  return [...ARTICOLI].sort((a, b) => b.pubblicato.localeCompare(a.pubblicato));
}

export const CATEGORIE_LABEL: Record<Articolo['categoria'], string> = {
  imprese: 'Imprese',
  privati: 'Privati',
  previdenza: 'Previdenza',
  'casa-energia': 'Casa ed energia',
};
