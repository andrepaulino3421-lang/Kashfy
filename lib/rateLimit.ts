
type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, options?: { maxPerMinute?: number }): { ok: boolean; retryAfterSec?: number } {
  const maxPerMinute = options?.maxPerMinute ?? 30;
  const now = Date.now();
  const windowMs = 60_000;
  const refillPerMs = maxPerMinute / windowMs;

  const bucket = buckets.get(key) ?? { tokens: maxPerMinute, updatedAt: now };
  const elapsed = now - bucket.updatedAt;
  const refill = elapsed * refillPerMs;

  bucket.tokens = Math.min(maxPerMinute, bucket.tokens + refill);
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    const needed = 1 - bucket.tokens;
    const retryAfterMs = needed / refillPerMs;
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true };
}
