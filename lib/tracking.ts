/**
 * Quootami — eventi di conversione (lead) verso GA4 + Meta Pixel.
 * ============================================================
 * `gtag`/`fbq` esistono su window SOLO dopo il consenso dell'utente
 * (li carica CookieConsent: GA4 su "statistiche", Pixel su "marketing").
 * Qui NON carichiamo nulla e NON tracciamo mai senza consenso: l'evento
 * parte solo se lo strumento è già presente. Tutto best-effort, mai un throw.
 */

type TrackingWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

/** Conversione: richiesta di preventivo inviata. `prodotto` = nome della polizza. */
export function trackLead(prodotto: string) {
  if (typeof window === 'undefined') return;
  const w = window as TrackingWindow;

  try {
    // GA4 — evento raccomandato per la generazione di lead
    w.gtag?.('event', 'generate_lead', {
      currency: 'EUR',
      value: 0,
      item_category: prodotto,
    });
  } catch {
    /* no-op */
  }

  try {
    // Meta Pixel — evento standard "Lead" (su cui Meta ottimizza le campagne)
    w.fbq?.('track', 'Lead', { content_category: prodotto });
  } catch {
    /* no-op */
  }
}
