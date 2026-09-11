import { NextResponse } from 'next/server';
import type { CurrencyCode } from '@/lib/config';
import { currencies } from '@/lib/config';

const SOURCE = 'Frankfurter API (blended reference rates)';
const API = 'https://api.frankfurter.dev/v2';

function validCurrency(value: string | null): value is CurrencyCode {
  return Boolean(value && Object.prototype.hasOwnProperty.call(currencies, value));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const base = url.searchParams.get('base')?.toUpperCase() ?? 'USD';
  const quote = url.searchParams.get('quote')?.toUpperCase() ?? null;
  const date = url.searchParams.get('date');

  if (!validCurrency(base)) return NextResponse.json({ error: 'Unsupported base currency.' }, { status: 400 });
  if (quote && !validCurrency(quote)) return NextResponse.json({ error: 'Unsupported quote currency.' }, { status: 400 });

  try {
    if (quote) {
      if (base === quote) {
        const today = new Date().toISOString().slice(0, 10);
        return NextResponse.json({ base, quote, rate: 1, date: date ?? today, source: 'Identity', fetchedAt: new Date().toISOString(), semantics: date ? 'historical-identity' : 'latest-identity' });
      }
      const endpoint = `${API}/rate/${base}/${quote}${date ? `?date=${encodeURIComponent(date)}` : ''}`;
      const response = await fetch(endpoint, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`FX provider returned ${response.status}`);
      const data = await response.json() as { base: string; quote: string; rate: number; date: string };
      if (!Number.isFinite(data.rate) || data.base !== base || data.quote !== quote) throw new Error('FX provider returned an invalid quote.');
      return NextResponse.json({ ...data, source: SOURCE, fetchedAt: new Date().toISOString(), semantics: date ? 'historical-reference-rate' : 'latest-reference-rate' }, { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' } });
    }

    const quotes = Object.keys(currencies).filter((x) => x !== base) as CurrencyCode[];
    const params = new URLSearchParams({ base, quotes: quotes.join(',') });
    if (date) params.set('date', date);
    const response = await fetch(`${API}/rates?${params.toString()}`, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`FX provider returned ${response.status}`);
    const data = await response.json();
    return NextResponse.json({ data, source: SOURCE, fetchedAt: new Date().toISOString(), base, semantics: date ? 'historical-reference-rate' : 'latest-reference-rate' }, { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load FX rates.', source: SOURCE }, { status: 502 });
  }
}
