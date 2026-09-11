'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { type CurrencyCode } from '@/lib/config';

type PublicResult = { productName?: string; currency: CurrencyCode; operatingCurrency?: CurrencyCode; displayCurrency?: CurrencyCode; fxDate?: string; profit: number; margin: number; roi: number; score: number; platform: string; verdict: string; bestPlatform?: string };

export default function ResultClient() {
  const params = useSearchParams();
  const data = params.get('data');
  const result = useMemo<PublicResult | null>(() => { try { return data ? JSON.parse(decodeURIComponent(data)).result as PublicResult : null; } catch { return null; } }, [data]);
  if (!result) return <main className="container section"><div className="card panel"><h1>Shared result not found</h1><p className="section-copy">Create a new calculation to generate a shareable result.</p><Link className="btn primary" href="/#calculator">Calculate Your Own Profit</Link></div></main>;
  const money = (v: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: result.currency }).format(v);
  return <main className="container section"><div className="card panel" style={{ maxWidth: 760, margin: '40px auto' }}><span className="eyebrow">Shared e-commerce result</span><h1>{result.productName || 'Product'}</h1><div className="profit-hero" style={{ marginTop: 18 }}><small>TRUE NET PROFIT</small><div className="profit-value">{money(result.profit)}</div><div style={{ opacity: .8 }}>Score {result.score}/100 • {result.verdict}</div>
      {result.operatingCurrency && result.displayCurrency && <p className="input-note" style={{ marginTop: 10 }}>Operating currency: {result.operatingCurrency} · Display currency: {result.displayCurrency}{result.fxDate ? ` · FX reference date: ${result.fxDate}` : ''}</p>}</div><div className="metrics"><div className="metric"><small>Margin</small><strong>{result.margin.toFixed(1)}%</strong></div><div className="metric"><small>ROI</small><strong>{result.roi.toFixed(1)}%</strong></div><div className="metric"><small>Platform</small><strong>{result.platform}</strong></div><div className="metric"><small>Best platform</small><strong>{result.bestPlatform || result.platform}</strong></div></div><div className="notice" style={{ marginTop: 16 }}>This public share card contains summary results only. Supplier/product-cost details are not embedded.</div><div className="cta-row"><Link className="btn primary" href="/#calculator">Calculate Your Own Profit</Link></div></div></main>;
}
