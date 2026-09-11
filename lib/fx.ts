import type { CurrencyCode } from '@/lib/config';

export type FXQuote = {
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  date: string;
  source: string;
  fetchedAt: string;
  stale?: boolean;
};

export type FXRateMap = Record<string, number>;

export type FXLoadResult = {
  quotes: FXQuote[];
  source: string;
  stale: boolean;
  error?: string;
};

export const FX_SOURCE = 'Frankfurter API (blended reference rates)';
export const FX_SOURCE_URL = 'https://frankfurter.dev/';
const API_BASE = '/api/fx';
const CACHE_PREFIX = 'profitpilot:fx:v2:';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function identityRate(base: CurrencyCode, quote: CurrencyCode) {
  return base === quote ? 1 : undefined;
}

export function pairKey(base: CurrencyCode, quote: CurrencyCode) {
  return `${base}:${quote}`;
}

export function convertAmount(value: number, base: CurrencyCode, quote: CurrencyCode, rates: FXRateMap) {
  if (!Number.isFinite(value)) return 0;
  if (base === quote) return value;
  const rate = rates[pairKey(base, quote)];
  return typeof rate === 'number' && Number.isFinite(rate) ? value * rate : undefined;
}

export function buildCrossRates(base: CurrencyCode, quotes: CurrencyCode[], direct: Record<string, number>) {
  const rates: FXRateMap = {};
  for (const quote of quotes) {
    if (quote === base) rates[pairKey(base, quote)] = 1;
    else if (Number.isFinite(direct[quote])) rates[pairKey(base, quote)] = direct[quote];
  }
  return rates;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function cacheKey(base: CurrencyCode, quote: CurrencyCode) {
  return `${CACHE_PREFIX}${base}:${quote}`;
}

function readCached(base: CurrencyCode, quote: CurrencyCode): FXQuote | undefined {
  if (!isBrowser()) return undefined;
  try {
    const raw = window.localStorage.getItem(cacheKey(base, quote));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as FXQuote;
    if (!parsed || !Number.isFinite(parsed.rate) || !parsed.date || !parsed.fetchedAt) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

function writeCached(quote: FXQuote) {
  if (!isBrowser()) return;
  try { window.localStorage.setItem(cacheKey(quote.base, quote.quote), JSON.stringify(quote)); } catch { /* private mode / quota */ }
}

async function fetchDirect(base: CurrencyCode, quote: CurrencyCode): Promise<FXQuote> {
  if (base === quote) {
    return { base, quote, rate: 1, date: new Date().toISOString().slice(0, 10), source: 'Identity', fetchedAt: new Date().toISOString() };
  }
  const response = await fetch(`${API_BASE}?base=${encodeURIComponent(base)}&quote=${encodeURIComponent(quote)}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`FX provider returned ${response.status}`);
  const data = await response.json() as { base: string; quote: string; rate: number; date: string };
  if (data.base !== base || data.quote !== quote || !Number.isFinite(data.rate) || data.rate <= 0) throw new Error('FX provider returned an invalid rate.');
  return { base, quote, rate: data.rate, date: data.date, source: FX_SOURCE, fetchedAt: new Date().toISOString() };
}

export async function getLatestRate(base: CurrencyCode, quote: CurrencyCode): Promise<FXQuote> {
  const cached = readCached(base, quote);
  const cachedAge = cached ? Date.now() - new Date(cached.fetchedAt).getTime() : Infinity;
  if (cached && cachedAge >= 0 && cachedAge < CACHE_TTL_MS) return cached;

  try {
    const fresh = await fetchDirect(base, quote);
    writeCached(fresh);
    return fresh;
  } catch (error) {
    if (cached) return { ...cached, stale: true };
    throw error instanceof Error ? error : new Error('Unable to load exchange rate.');
  }
}

export async function getLatestRates(base: CurrencyCode, quotes: CurrencyCode[]): Promise<FXLoadResult> {
  const unique = Array.from(new Set(quotes)).filter((q) => q !== base);
  const loaded: FXQuote[] = [];
  const failures: string[] = [];
  for (const quote of unique) {
    try {
      loaded.push(await getLatestRate(base, quote));
    } catch (error) {
      failures.push(`${base}/${quote}: ${error instanceof Error ? error.message : 'unavailable'}`);
    }
  }
  if (base === base) loaded.unshift({ base, quote: base, rate: 1, date: new Date().toISOString().slice(0, 10), source: 'Identity', fetchedAt: new Date().toISOString() });
  return {
    quotes: loaded,
    source: FX_SOURCE,
    stale: loaded.some((q) => q.stale === true),
    error: failures.length ? failures.join(' • ') : undefined,
  };
}

export function quoteMap(quotes: FXQuote[]): FXRateMap {
  return Object.fromEntries(quotes.map((q) => [pairKey(q.base, q.quote), q.rate]));
}

export async function getCachedOrLatest(base: CurrencyCode, quote: CurrencyCode): Promise<FXQuote | undefined> {
  try { return await getLatestRate(base, quote); } catch { return readCached(base, quote); }
}

export function cacheFreshnessLabel(quote: FXQuote | undefined) {
  if (!quote) return 'Unavailable';
  if (quote.stale) return `Cached rate from ${quote.date}`;
  return `Reference rate for ${quote.date}`;
}
