/**
 * Quootami — rate limiter in-memory (difesa in profondità)
 * ============================================================
 * Limite per-IP a finestra fissa, senza dipendenze esterne.
 *
 * NOTA ARCHITETTURALE: su Vercel ogni istanza serverless ha la sua
 * memoria, quindi il limite è per-istanza e non globale. È una difesa
 * in profondità contro abusi banali (spam del form, scan automatici),
 * non un rate limit rigoroso. Per un limite globale usare Vercel WAF
 * (dashboard → Firewall) o un contatore condiviso (Upstash Redis).
 * ============================================================
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

/** Ritorna true se la richiesta è ammessa, false se oltre il limite. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();

  // Pruning: evita crescita illimitata della mappa.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (now > b.resetAt) buckets.delete(k);
    }
    // Se ancora piena (attacco distribuito), fail-closed sulle nuove chiavi.
    if (buckets.size > MAX_BUCKETS && !buckets.has(key)) return false;
  }

  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count += 1;
  return true;
}

/** Estrae l'IP del client (Vercel imposta x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
