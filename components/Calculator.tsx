'use client';

import { useEffect, useMemo, useState } from 'react';
import { countries, currencies, demoPlatformFees, supportedPlatforms, type CurrencyCode, type Platform } from '@/lib/config';
import {
  CalculatorInput,
  calculateAdvertising,
  calculateAffiliateCommission,
  calculateBreakEvenPrice,
  calculateDiscount,
  calculateMaximumAdSpend,
  calculateNetProfit,
  calculateOtherCosts,
  calculatePackaging,
  calculatePaymentFee,
  calculatePlatformFee,
  calculateProductCost,
  calculateProfitMargin,
  calculateRefundAllowance,
  calculateRevenue,
  calculateROI,
  calculateShipping,
  calculateTax,
  calculateTotalExpenses,
  decisionForScore,
  scoreProfit,
  calculateTargetProfitPrice
} from '@/lib/calculator';

type Props = { initialPlatform?: Platform };
type State = CalculatorInput & { platform: Platform; country: typeof countries[number]; currency: CurrencyCode; productName: string };

const defaultCost = (enabled: boolean, value: number, mode: 'fixed'|'percent' = 'percent') => ({ enabled, value, mode });
const initial = (platform: Platform = 'Amazon'): State => ({
  productName: 'Sample Product', platform, country: 'United States', currency: 'USD', sellingPrice: 49.99, quantity: 1, productCost: 15,
  platformFee: defaultCost(true, demoPlatformFees[platform] * 100), paymentFee: defaultCost(true, 2.9), shipping: defaultCost(true, 5, 'fixed'), packaging: defaultCost(true, 0.5, 'fixed'), advertising: defaultCost(true, 8, 'fixed'), affiliate: defaultCost(false, 0), discount: defaultCost(false, 0), returns: defaultCost(true, 3), tax: defaultCost(false, 0), other: defaultCost(false, 0)
});
const money = (value: number, currency: CurrencyCode) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);

export default function Calculator({ initialPlatform = 'Amazon' }: Props) {
  const [s, setS] = useState<State>(() => initial(initialPlatform));
  const [targetProfit, setTargetProfit] = useState(10);
  const [targetMargin, setTargetMargin] = useState(25);
  const [feedback, setFeedback] = useState<'idle'|'yes'|'no'>('idle');
  const [feedbackDetail, setFeedbackDetail] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem('profitpilot-calculation'); if (raw) setS(JSON.parse(raw)); } catch {}
  }, []);

  const update = <K extends keyof State>(key: K, value: State[K]) => setS(prev => ({...prev, [key]: value}));
  const updateCost = (key: keyof CalculatorInput, patch: Partial<{enabled:boolean; value:number; mode:'fixed'|'percent'}>) => setS(prev => ({...prev, [key]: {...(prev[key] as any), ...patch}}));

  const result = useMemo(() => {
    const i: CalculatorInput = s;
    const revenue = calculateRevenue(i), expenses = calculateTotalExpenses(i), profit = calculateNetProfit(i);
    const margin = calculateProfitMargin(i), roi = calculateROI(i), score = scoreProfit(i), decision = decisionForScore(score);
    const line = {
      product: calculateProductCost(i), platform: calculatePlatformFee(i), payment: calculatePaymentFee(i), shipping: calculateShipping(i), packaging: calculatePackaging(i), ads: calculateAdvertising(i), affiliate: calculateAffiliateCommission(i), discount: calculateDiscount(i), returns: calculateRefundAllowance(i), tax: calculateTax(i), other: calculateOtherCosts(i)
    };
    const fixedForTarget = {...i, advertising: {enabled:false,value:0,mode:'fixed' as const}};
    const targetMarginPrice = margin >= targetMargin ? s.sellingPrice : calculateTargetProfitPrice(fixedForTarget, calculateProductCost(i) * 0 + (targetMargin / Math.max(1, 100-targetMargin)) * calculateProductCost(i));
    return { revenue, expenses, profit, margin, roi, score, decision, breakEven: calculateBreakEvenPrice(i), maxAd: calculateMaximumAdSpend(i), targetPrice: calculateTargetProfitPrice(i, targetProfit), targetMarginPrice, line };
  }, [s, targetProfit, targetMargin]);

  const stress = useMemo(() => {
    const base = s as CalculatorInput;
    const cases: {label:string; next:CalculatorInput}[] = [
      {label:'Base case', next: base},
      {label:'Ads +20%', next:{...base, advertising:{...base.advertising, value:base.advertising.value*1.2}}},
      {label:'Shipping +20%', next:{...base, shipping:{...base.shipping, value:base.shipping.value*1.2}}},
      {label:'Product cost +10%', next:{...base, productCost:base.productCost*1.1}},
      {label:'Returns +5%', next:{...base, returns:{...base.returns, value:base.returns.value+5, mode:'percent'}}}
    ];
    const mapped = cases.map(c=>({label:c.label, profit:calculateNetProfit(c.next)}));
    const passed = mapped.filter(x=>x.profit > 0).length;
    return {mapped, passed};
  }, [s]);

  const comparisons = useMemo(() => supportedPlatforms.map(platform => {
    const next = {...s, platform, platformFee:defaultCost(true, demoPlatformFees[platform]*100)} as CalculatorInput;
    return {platform, profit:calculateNetProfit(next), margin:calculateProfitMargin(next)};
  }).sort((a,b)=>b.profit-a.profit), [s]);

  const save = () => { try { localStorage.setItem('profitpilot-calculation', JSON.stringify(s)); setSaved(true); setTimeout(()=>setSaved(false),1600);} catch {} };
  const createShareUrl = () => `${window.location.origin}/result?data=${encodeURIComponent(JSON.stringify({s}))}`;
  const share = async () => {
    const url = createShareUrl();
    try {
      if (navigator.share) await navigator.share({ title:'My e-commerce profit result', text:`Estimated profit: ${money(result.profit,s.currency)}`, url });
      else { await navigator.clipboard.writeText(url); setShareStatus('Share link copied'); setTimeout(()=>setShareStatus(''),2000); }
    } catch {}
  };
  const shareImage = async () => {
    const canvas=document.createElement('canvas'); canvas.width=1080; canvas.height=1350; const ctx=canvas.getContext('2d'); if(!ctx) return;
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,1080,1350);
    ctx.fillStyle='#111827'; ctx.fillRect(60,60,960,1230);
    ctx.fillStyle='#ffffff'; ctx.font='700 34px system-ui'; ctx.fillText('E-commerce Profit Report',110,140);
    ctx.font='800 84px system-ui'; ctx.fillText('TRUE PROFIT',110,270); ctx.font='800 96px system-ui'; ctx.fillText(money(result.profit,s.currency),110,380);
    ctx.font='600 30px system-ui'; ctx.fillText(`${result.margin.toFixed(1)}% margin   •   ${result.roi.toFixed(1)}% ROI`,110,445);
    ctx.font='700 34px system-ui'; ctx.fillText(`Profit Score: ${result.score}/100`,110,530);
    ctx.font='600 30px system-ui'; ctx.fillText(`Platform: ${s.platform}`,110,585);
    ctx.fillStyle='#dbeafe'; ctx.fillRect(110,650,860,230); ctx.fillStyle='#111827'; ctx.font='700 34px system-ui'; ctx.fillText('Selling Price',150,720); ctx.fillText('Break-even',510,720); ctx.font='800 44px system-ui'; ctx.fillText(money(s.sellingPrice,s.currency),150,785); ctx.fillText(money(result.breakEven,s.currency),510,785);
    ctx.fillStyle='#ffffff'; ctx.font='500 28px system-ui'; ctx.fillText('Calculated with ProfitPilot',110,970); ctx.font='500 23px system-ui'; ctx.fillText('Estimate only • Verify current marketplace fees and taxes',110,1020);
    canvas.toBlob(async blob=>{ if(!blob) return; const file=new File([blob], 'profit-result.png',{type:'image/png'}); try { if(navigator.share && 'canShare' in navigator && navigator.canShare({files:[file]})) { await navigator.share({files:[file], title:'My e-commerce profit'}); } else { const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='profit-result.png'; a.click(); URL.revokeObjectURL(a.href); setShareStatus('Share image downloaded'); setTimeout(()=>setShareStatus(''),2000);} } catch {} },'image/png');
  };
  const submitFeedback = () => { try { const items=JSON.parse(localStorage.getItem('profitpilot-feedback')||'[]'); items.push({type:feedback==='yes'?'useful':'missing', detail:feedbackDetail, createdAt:new Date().toISOString()}); localStorage.setItem('profitpilot-feedback',JSON.stringify(items)); setFeedbackDetail(''); setShareStatus('Thanks — feedback saved'); setTimeout(()=>setShareStatus(''),2000);} catch {} };
  const onPlatformChange=(platform:Platform)=>setS(prev=>({...prev,platform,platformFee:defaultCost(true,demoPlatformFees[platform]*100)}));

  const statusClass = result.decision.tone;
  return <>
    <div className="calculator">
      <div className="card panel">
        <h2>True Profit Calculator</h2><p className="section-copy">Enter real costs. Change any assumption and results update instantly.</p>
        <div className="form-grid">
          <div className="field full"><label>Product name</label><input value={s.productName} onChange={e=>update('productName',e.target.value)} /></div>
          <div className="field"><label>Platform</label><select value={s.platform} onChange={e=>onPlatformChange(e.target.value as Platform)}>{supportedPlatforms.map(p=><option key={p}>{p}</option>)}</select></div>
          <div className="field"><label>Country</label><select value={s.country} onChange={e=>update('country',e.target.value as State['country'])}>{countries.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Currency</label><select value={s.currency} onChange={e=>update('currency',e.target.value as CurrencyCode)}>{Object.keys(currencies).map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Quantity</label><input type="number" min="1" value={s.quantity} onChange={e=>update('quantity',Math.max(1,Number(e.target.value)||1))}/></div>
          <div className="field"><label>Selling price / unit</label><input type="number" min="0" step="0.01" value={s.sellingPrice} onChange={e=>update('sellingPrice',Math.max(0,Number(e.target.value)||0))}/></div>
          <div className="field"><label>Product cost / unit</label><input type="number" min="0" step="0.01" value={s.productCost} onChange={e=>update('productCost',Math.max(0,Number(e.target.value)||0))}/></div>
        </div>
        <h3>Costs</h3>
        {([['platformFee','Platform fee'],['paymentFee','Payment processing'],['shipping','Shipping'],['packaging','Packaging'],['advertising','Advertising'],['affiliate','Affiliate commission'],['discount','Discount'],['returns','Refund / return allowance'],['tax','Tax'],['other','Other expenses']] as const).map(([key,label])=><div className="cost-row" key={key}><div className="field"><label>{label}</label><input type="number" min="0" step="0.01" value={(s[key] as any).value} onChange={e=>updateCost(key,{value:Math.max(0,Number(e.target.value)||0)})}/></div><div className="field"><label>Mode</label><select value={(s[key] as any).mode} onChange={e=>updateCost(key,{mode:e.target.value as 'fixed'|'percent'})}><option value="percent">%</option><option value="fixed">Fixed</option></select></div><button className={`toggle ${(s[key] as any).enabled?'on':''}`} onClick={()=>updateCost(key,{enabled:!(s[key] as any).enabled})} aria-label={`Toggle ${label}`}>{(s[key] as any).enabled?'✓':'+'}</button></div>)}
        <div className="notice"><strong>Demo fee assumptions.</strong> Verify official/current marketplace fees, taxes and seller-specific charges before publishing production results.</div>
        <div className="actions"><button className="small-btn" onClick={save}>💾 {saved?'Saved':'Save locally'}</button><button className="small-btn" onClick={()=>setS(initial(s.platform))}>Reset</button></div>
      </div>

      <div className="results">
        <div className="card panel">
          <div className="profit-hero"><small>TRUE NET PROFIT</small><div className="profit-value">{money(result.profit,s.currency)}</div><span className={`badge ${statusClass}`}>{result.decision.label}</span><div style={{marginTop:10,opacity:.8,fontSize:13}}>Profit Score: {result.score}/100</div></div>
          <div className="metrics"><div className="metric"><small>Revenue</small><strong>{money(result.revenue,s.currency)}</strong></div><div className="metric"><small>Total expenses</small><strong>{money(result.expenses,s.currency)}</strong></div><div className="metric"><small>Profit margin</small><strong>{result.margin.toFixed(1)}%</strong></div><div className="metric"><small>ROI</small><strong>{result.roi.toFixed(1)}%</strong></div><div className="metric"><small>Break-even</small><strong>{money(result.breakEven,s.currency)}</strong></div><div className="metric"><small>Max ad spend</small><strong>{money(result.maxAd,s.currency)}</strong></div></div>
          <div className="breakdown">{Object.entries({Revenue:result.revenue,'Product Cost':-result.line.product,'Platform Fees':-result.line.platform,'Payment Fees':-result.line.payment,Shipping:-result.line.shipping,Packaging:-result.line.packaging,Advertising:-result.line.ads,'Affiliate Commission':-result.line.affiliate,Discounts:-result.line.discount,'Refund / Returns':-result.line.returns,Taxes:-result.line.tax,'Other Costs':-result.line.other}).map(([label,value])=><div className="breakdown-row" key={label}><span>{label}</span><span>{money(value,s.currency)}</span></div>)}</div>
          <div className="actions"><button className="small-btn" onClick={share}>📤 Share Result</button><button className="small-btn" onClick={shareImage}>🖼️ Share Image</button><button className="small-btn" onClick={async()=>{await navigator.clipboard.writeText(`E-commerce Profit Report\nSelling price: ${money(s.sellingPrice,s.currency)}\nTrue profit: ${money(result.profit,s.currency)}\nMargin: ${result.margin.toFixed(1)}%\nROI: ${result.roi.toFixed(1)}%\nProfit Score: ${result.score}/100`);setShareStatus('Result copied');setTimeout(()=>setShareStatus(''),2000)}}>Copy</button></div>
          {shareStatus && <div className="input-note">{shareStatus}</div>}
        </div>
        <div className="card panel" style={{marginTop:14}}><h2>Should I sell this product?</h2><p className="section-copy">Estimate based on your assumptions — not financial advice.</p><span className={`badge ${statusClass}`}>{result.decision.label}</span><ul style={{color:'#626a75',lineHeight:1.7}}><li>{result.margin >= 25 ? 'Healthy margin buffer' : 'Margin is relatively thin'}</li><li>{result.maxAd > 0 ? `Up to ${money(result.maxAd,s.currency)} of ad room before zero profit` : 'No positive ad room under current assumptions'}</li><li>{result.breakEven <= s.sellingPrice ? 'Selling price is above break-even' : 'Selling price is at or below break-even'}</li></ul><div className="notice">Why this score? Margin, ROI, fee burden, ad burden and break-even buffer are combined in a transparent heuristic.</div></div>
      </div>
    </div>

    <section className="section"><h2 className="section-title">What-if + Target Price</h2><div className="feature-grid"><div className="card panel"><h3>What should I charge?</h3><div className="form-grid"><div className="field"><label>Target profit</label><input type="number" value={targetProfit} onChange={e=>setTargetProfit(Math.max(0,Number(e.target.value)||0))}/></div><div className="field"><label>Target margin %</label><input type="number" min="0" max="99" value={targetMargin} onChange={e=>setTargetMargin(Math.min(99,Math.max(0,Number(e.target.value)||0)))}/></div></div><div className="metrics"><div className="metric"><small>Target profit price</small><strong>{money(result.targetPrice,s.currency)}</strong></div><div className="metric"><small>Target margin price</small><strong>{money(result.targetMarginPrice,s.currency)}</strong></div></div></div><div className="card panel"><h3>Ad Survival Meter</h3><p className="section-copy">Maximum ad spend before your current product hits zero estimated profit.</p><div className="progress"><div style={{width:`${Math.min(100,Math.max(0,(s.advertising.value/(result.maxAd||1))*100))}%`}}/></div><strong>{money(result.maxAd,s.currency)}</strong><div className="input-note">Increase or decrease your ad cost above to test the boundary.</div></div></div></section>

    <section className="section"><h2 className="section-title">Platform Battle</h2><p className="section-copy">Same product assumptions, different marketplace fee assumption.</p><div className="card panel"><table className="compare-table"><thead><tr><th>Platform</th><th>Estimated profit</th><th>Margin</th></tr></thead><tbody>{comparisons.map((r,i)=><tr key={r.platform}><td><strong>{r.platform}{i===0?' 🥇':''}</strong></td><td>{money(r.profit,s.currency)}</td><td>{r.margin.toFixed(1)}%</td></tr>)}</tbody></table><p className="input-note">MVP demo fee assumptions; verify official fee schedules for live decisions.</p></div></section>

    <section className="section"><h2 className="section-title">Stress Test My Product</h2><div className="card panel"><div className="scenario-grid">{stress.mapped.map((x)=><div className="scenario" key={x.label}><strong>{x.label}</strong><span className={`badge ${x.profit>0?'good':'bad'}`}>{money(x.profit,s.currency)}</span></div>)}</div><div className="notice" style={{marginTop:12}}>Product survives <strong>{stress.passed}/5</strong> modeled scenarios. This is a simulation, not a guarantee.</div></div></section>

    <section className="section" id="feedback"><div className="card feedback-box"><h2 className="section-title">💡 Was this useful?</h2><p className="section-copy">Your feedback decides what gets added next.</p><div className="actions"><button className="small-btn" onClick={()=>{setFeedback('yes');setFeedbackDetail('')}}>👍 Yes</button><button className="small-btn" onClick={()=>setFeedback('no')}>👎 No</button></div>{feedback==='no' && <div style={{marginTop:12}}><select value={feedbackDetail} onChange={e=>setFeedbackDetail(e.target.value)}><option value="">What was missing?</option><option>Fee was incorrect</option><option>Result was confusing</option><option>Missing platform</option><option>Missing country</option><option>Missing feature</option><option>Other</option></select><button className="small-btn" style={{marginLeft:8}} disabled={!feedbackDetail} onClick={submitFeedback}>Submit</button></div>}{feedback==='yes' && <button className="small-btn" style={{marginTop:12}} onClick={submitFeedback}>Send positive feedback</button>}</div></section>
  </>;
}
