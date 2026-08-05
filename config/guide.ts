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
    metaTitle: 'Polizza catastrofale imprese: chi è obbligato',
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
  {
    slug: 'auto-ferma-in-garage-va-assicurata',
    titolo: 'Auto ferma in garage: va assicurata lo stesso?',
    metaTitle: 'Auto ferma in garage: va assicurata?',
    metaDesc:
      'Se il veicolo è immatricolato e funzionante l’RC auto è obbligatoria anche da fermo. I casi di esenzione, la sospensione della polizza e le formule stagionali.',
    eyebrow: 'Guida privati',
    accent: 'lo stesso',
    sommario:
      'Non conta se circoli: conta se il mezzo è idoneo al trasporto. Ecco quando l’obbligo resta, quando cade davvero e come sospendere la polizza senza perdere la classe di merito.',
    pubblicato: '2026-08-04',
    lettura: 5,
    prodotto: 'polizza-auto',
    categoria: 'privati',
  },
  {
    slug: 'adesione-automatica-fondo-pensione-2026',
    titolo: 'Adesione automatica al fondo pensione dal 1° luglio 2026',
    metaTitle: 'Adesione automatica al fondo pensione 2026',
    metaDesc:
      'Dal 1° luglio 2026 i nuovi assunti aderiscono automaticamente alla previdenza complementare. Hai 60 giorni per scegliere diversamente: cosa valutare prima.',
    eyebrow: 'Guida previdenza',
    accent: '1° luglio 2026',
    sommario:
      'Il TFR dei nuovi assunti va alla previdenza complementare salvo scelta contraria. I 60 giorni per decidere, chi resta escluso e perché uscire non è sempre conveniente.',
    pubblicato: '2026-08-04',
    lettura: 5,
    prodotto: 'piano-pensione',
    categoria: 'previdenza',
  },
  {
    slug: 'nis2-pmi-obblighi-cybersicurezza',
    titolo: 'NIS2: la mia PMI è obbligata?',
    metaTitle: 'NIS2 PMI: chi è obbligato e cosa comporta',
    metaDesc:
      'NIS2 e D.Lgs. 138/2024: settori e soglie dimensionali, l’effetto catena sui fornitori, sanzioni e dove entra davvero la polizza cyber.',
    eyebrow: 'Guida imprese',
    accent: 'obbligata',
    sommario:
      'Anche restando sotto le soglie molte PMI subiscono la NIS2 di riflesso, perché i clienti più grandi la ribaltano sui fornitori. Come capire dove ti trovi e cosa fare.',
    pubblicato: '2026-08-04',
    lettura: 6,
    prodotto: 'cyber',
    categoria: 'imprese',
  },
];

export function getArticolo(slug: string): Articolo | undefined {
  return ARTICOLI.find(a => a.slug === slug);
}

/** Tutti gli articoli, dal più recente al più vecchio. */
export function getAllArticoli(): Articolo[] {
  return [...ARTICOLI].sort((a, b) => b.pubblicato.localeCompare(a.pubblicato));
}

/**
 * Guide collegate a un prodotto (campo `prodotto`), dalla più recente.
 * Usata dal blocco "Approfondisci" in fondo alle pagine prodotto: il
 * collegamento interno prodotto → guide si popola da sé, senza liste da
 * tenere aggiornate a mano.
 */
export function getArticoliPerProdotto(slug: string): Articolo[] {
  return getAllArticoli().filter(a => a.prodotto === slug);
}

export const CATEGORIE_LABEL: Record<Articolo['categoria'], string> = {
  imprese: 'Imprese',
  privati: 'Privati',
  previdenza: 'Previdenza',
  'casa-energia': 'Casa ed energia',
};
