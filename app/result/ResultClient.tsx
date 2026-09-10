'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { calculateNetProfit, calculateProfitMargin, calculateROI, scoreProfit } from '@/lib/calculator';
import { type CurrencyCode } from '@/lib/config';
export default function ResultClient(){
  const params=useSearchParams(); const data=params.get('data');
  const state=useMemo(()=>{ try{return data?JSON.parse(decodeURIComponent(data)).s:null;}catch{return null;}},[data]);
  if(!state) return <main className="container section"><div className="card panel"><h1>Shared result not found</h1><p className="section-copy">Create a new calculation to generate a shareable result.</p><Link className="btn primary" href="/#calculator">Calculate Your Own Profit</Link></div></main>;
  const profit=calculateNetProfit(state); const margin=calculateProfitMargin(state); const roi=calculateROI(state); const score=scoreProfit(state); const currency=state.currency as CurrencyCode; const money=(v:number)=>new Intl.NumberFormat(undefined,{style:'currency',currency}).format(v);
  return <main className="container section"><div className="card panel" style={{maxWidth:760,margin:'40px auto'}}><span className="eyebrow">Shared e-commerce result</span><h1>{state.productName || 'Product'}</h1><div className="profit-hero" style={{marginTop:18}}><small>TRUE NET PROFIT</small><div className="profit-value">{money(profit)}</div><div style={{opacity:.8}}>Score {score}/100</div></div><div className="metrics"><div className="metric"><small>Selling price</small><strong>{money(state.sellingPrice)}</strong></div><div className="metric"><small>Margin</small><strong>{margin.toFixed(1)}%</strong></div><div className="metric"><small>ROI</small><strong>{roi.toFixed(1)}%</strong></div><div className="metric"><small>Platform</small><strong>{state.platform}</strong></div></div><div className="notice" style={{marginTop:16}}>Estimate only. Shared results show the calculation assumptions encoded in the link.</div><div className="cta-row"><Link className="btn primary" href="/#calculator">Calculate Your Own Profit</Link></div></div></main>
}
