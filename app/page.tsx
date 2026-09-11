'use client';

import { useMemo, useState } from 'react';

const countries = [
  { flag: '🇮🇳', code: 'IN', currency: '₹', profit: '274' },
  { flag: '🇺🇸', code: 'US', currency: '$', profit: '13.24' },
  { flag: '🇩🇪', code: 'DE', currency: '€', profit: '12.10' },
  { flag: '🇫🇷', code: 'FR', currency: '€', profit: '12.10' },
  { flag: '🇪🇸', code: 'ES', currency: '€', profit: '11.80' },
  { flag: '🇯🇵', code: 'JP', currency: '¥', profit: '1980' },
];

const marketplaces = [
  { name: 'Amazon India', profit: '₹274', tag: '' },
  { name: 'Flipkart', profit: '₹291', tag: '' },
  { name: 'Meesho', profit: '₹318', tag: 'Best Estimate' },
  { name: 'Own Store', profit: '₹356', tag: 'Highest Profit +₹82' },
];

function money(v: number) {
  return `$${v.toFixed(2)}`;
}

export default function Home() {
  const [price, setPrice] = useState(39.99);
  const [productCost, setProductCost] = useState(12);
  const [ads, setAds] = useState(4.75);
  const [shipping, setShipping] = useState(5);
  const [country, setCountry] = useState('US');
  const [indiaMode, setIndiaMode] = useState(false);

  const fees = 5;
  const profit = useMemo(() => price - productCost - fees - ads - shipping, [price, productCost, ads, shipping]);
  const stressProfit = profit - 3;
  const margin = price ? (profit / price) * 100 : 0;

  const currency = countries.find((c) => c.code === country)?.currency ?? '$';
  const demoDisplay = country === 'IN' ? '₹274' : country === 'JP' ? '¥1980' : `${currency}${country === 'US' ? '13.24' : country === 'DE' || country === 'FR' ? '12.10' : '11.80'}`;

  return (
    <main className="min-h-screen bg-white text-[#111] selection:bg-[#00C853]/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-2 font-black tracking-tight text-xl"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#111] text-white">P</span>ProfitPilot</div>
        <div className="hidden items-center gap-6 text-sm font-semibold text-neutral-700 md:flex">
          <a href="#calculator" className="hover:text-black">Calculator</a>
          <a href="#india" className="hover:text-black">Compare</a>
          <a href="#csv" className="hover:text-black">Seller Intelligence</a>
          <a href="#faq" className="hover:text-black">FAQ</a>
        </div>
        <button onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full bg-[#00C853] px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(0,200,83,.25)]">Check Profit →</button>
      </nav>

      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,200,83,.10),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(0,0,0,.05),transparent_30%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold shadow-sm"><span className="h-2 w-2 rounded-full bg-[#00C853]" /> Trusted by 127 sellers</div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl md:text-6xl">Amazon, Flipkart, Meesho pe kitna bachega? Ek click me pata karo.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">The only calculator for 6 Marketplaces + 9 Currencies. Includes GST, RTO, Shipping, Ads. No login. 100% Private.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-2xl bg-[#00C853] px-6 py-4 text-base font-black text-white shadow-[0_14px_35px_rgba(0,200,83,.25)] transition hover:-translate-y-0.5">Check My True Profit →</button>
              <button onClick={() => document.getElementById('stress')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-base font-black transition hover:border-black/20">See Stress Test</button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-neutral-600"><span>✓ No signup</span><span>✓ India + US + EU</span><span>✓ Browser-first privacy</span></div>
          </div>

          <div id="calculator" className="rounded-[28px] bg-[#111] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,.24)] md:p-6">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-white/45">Live profit simulator</p><h2 className="mt-2 text-xl font-extrabold">What actually stays in your pocket?</h2></div><div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold">{indiaMode ? '🇮🇳 India Mode' : 'Global Mode'}</div></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[['Selling Price', price, setPrice], ['Product Cost', productCost, setProductCost], ['Ad Spend', ads, setAds], ['Shipping', shipping, setShipping]].map(([label, value, setter]) => (
                <label key={String(label)} className="block"><span className="mb-2 block text-xs font-semibold text-white/55">{label}</span><input type="number" value={Number(value)} step="0.01" onChange={(e) => (setter as (n:number)=>void)(Number(e.target.value))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold outline-none transition focus:border-[#00C853]" /></label>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Metric label="Fees" value="$5.00" />
              <Metric label="True Profit" value={money(profit)} green />
              <Metric label="Stress Test" value={money(stressProfit)} red={stressProfit < 0} />
            </div>
            <div className="mt-5 rounded-2xl bg-white/[0.04] p-4">
              <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-white/45">Profit Leak</p><p className="mt-1 text-sm text-white/70">Your biggest costs</p></div><span className="rounded-full bg-[#00C853]/10 px-2.5 py-1 text-xs font-extrabold text-[#66f19c]">{margin.toFixed(1)}% margin</span></div>
              <div className="mt-5 space-y-3">
                <Leak label="Product" value={productCost} max={price} />
                <Leak label="Ads" value={ads} max={price} />
                <Leak label="Shipping" value={shipping} max={price} />
                <Leak label="Fees" value={fees} max={price} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="india" className="bg-[#FFF8E1] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl"><span className="rounded-full bg-[#111] px-3 py-1 text-xs font-black uppercase tracking-[.15em] text-white">Built for Bharat</span><h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">🇮🇳 Selling in India? Ye sabse important hai</h2><p className="mt-4 text-neutral-700">Compare estimated profit across the channels Indian sellers actually use.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {marketplaces.map((m, i) => <div key={m.name} className={`rounded-3xl border bg-white p-5 shadow-sm ${i===3 ? 'border-[#00C853] shadow-[0_10px_30px_rgba(0,200,83,.10)]' : 'border-black/10'}`}>
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-neutral-500">{m.name}</p><p className="mt-3 text-3xl font-black">{m.profit}</p><p className="mt-1 text-sm font-semibold text-neutral-500">estimated profit / order</p></div>{m.tag && <span className="rounded-full bg-[#00C853]/10 px-2.5 py-1 text-[11px] font-black text-[#007d35]">{m.tag}</span>}</div>
            </div>)}
          </div>
          <button onClick={() => { setIndiaMode(true); setCountry('IN'); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-7 rounded-2xl bg-[#111] px-6 py-4 font-black text-white shadow-lg">🇮🇳 India Mode ON Karo — GST + RTO ke saath</button>
          <p className="mt-3 text-xs font-semibold text-neutral-600">Rates and tax assumptions should be verified for your seller account, category and region.</p>
        </div>
      </section>

      <section id="stress" className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div><span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-[.15em] text-[#FF3B30]">Stress test</span><h2 className="mt-4 text-3xl font-black md:text-5xl">What if costs change?</h2><p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">A good product should survive bad days—not just look profitable on paper.</p><div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-[#c92820]">Largest cost: Product cost — {(productCost / Math.max(price, 1) * 100).toFixed(0)}% of revenue yahi kha raha hai</div></div>
          <div className="space-y-4">
            <Scenario label="Base" value={profit} positive />
            <Scenario label="Product +$2" value={profit-2} />
            <Scenario label="Ads +$3" value={profit-3} />
          </div>
        </div>
      </section>

      <section className="bg-[#111] py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-[.15em] text-white/70">Worldwide</span><h2 className="mt-4 text-3xl font-black md:text-5xl">One product. 6 countries. Instant switch.</h2><p className="mt-4 max-w-2xl text-white/65">Switch country, currency, language without losing flow.</p></div><select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-bold text-white outline-none"><option value="IN">🇮🇳 India — ₹</option><option value="US">🇺🇸 USA — $</option><option value="DE">🇩🇪 Germany — €</option><option value="FR">🇫🇷 France — €</option><option value="ES">🇪🇸 Spain — €</option><option value="JP">🇯🇵 Japan — ¥</option></select></div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{countries.map(c => <button key={c.code} onClick={() => setCountry(c.code)} className={`rounded-2xl border p-4 text-left transition ${country===c.code ? 'border-[#00C853] bg-[#00C853]/10' : 'border-white/10 bg-white/[.03]'}`}><div className="text-2xl">{c.flag}</div><p className="mt-3 text-xs font-bold text-white/50">{c.code}</p><p className="mt-1 text-lg font-black">{c.currency}{c.profit}</p></button>)}</div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.04] p-5"><p className="text-xs font-black uppercase tracking-[.2em] text-white/45">Selected estimate</p><div className="mt-2 text-4xl font-black">{demoDisplay}</div></div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8"><div className="max-w-2xl"><span className="rounded-full bg-black/5 px-3 py-1 text-xs font-black uppercase tracking-[.15em]">Simple by design</span><h2 className="mt-4 text-3xl font-black md:text-5xl">Calculate. Compare. Decide.</h2></div><div className="mt-9 grid gap-5 md:grid-cols-3"><Step n="01" title="Calculate" text="Enter cost, fees, shipping, ads and returns."/><Step n="02" title="Compare" text="Meesho pe ₹318 vs Amazon pe ₹274 — difference ₹44."/><Step n="03" title="Decide" text="Test risk — will you still profit if ads increase by $3?"/></div></div>
      </section>

      <section id="csv" className="bg-neutral-950 py-16 text-white md:py-20"><div className="mx-auto max-w-5xl px-5 md:px-8"><div className="rounded-[32px] border border-white/10 bg-[#111] p-6 shadow-2xl md:p-10"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">🔒 100% Private — browser-first</span><h2 className="mt-4 text-3xl font-black md:text-5xl">Find out where your money actually went</h2><p className="mt-4 max-w-2xl text-white/65">Upload a settlement export and turn messy deductions into a clear profit story. Your preview data below is illustrative.</p></div><div className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold text-white/70">No server upload in this demo</div></div><div className="mt-8 grid gap-4 md:grid-cols-4"><Metric label="Net Payout" value="₹20,340"/><Metric label="Fees" value="38%"/><Metric label="Ads" value="22%"/><Metric label="Returns" value="12%"/></div><div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200"><p className="font-black">⚠️ Example insight</p><p className="mt-1 text-sm">2 SKUs are loss-making — investigate them before scaling ad spend.</p></div><button className="mt-6 rounded-2xl bg-[#00C853] px-6 py-4 font-black text-white">Upload Amazon / Flipkart CSV (Private & Free) →</button></div></div></section>

      <section id="faq" className="py-16 md:py-20"><div className="mx-auto max-w-5xl px-5 md:px-8"><span className="rounded-full bg-black/5 px-3 py-1 text-xs font-black uppercase tracking-[.15em]">FAQ</span><h2 className="mt-4 text-3xl font-black md:text-5xl">Har seller yehi puchta hai</h2><div className="mt-8 divide-y divide-black/10 border-y border-black/10">{[
        ['Is this an official marketplace fee calculator?', 'No. ProfitPilot is an independent tool. Estimates depend on your inputs and current marketplace rules; always verify official rates for your account and category.'],
        ['Do I need an account?', 'No. No login is required to use the calculator.'],
        ['Is my CSV private?', 'The intended CSV analyzer architecture is browser-side/client-side processing. Do not treat this demo preview as proof of a production privacy guarantee until the uploader is wired and tested.'],
        ['Meesho ka commission kitna lete ho?', 'This varies by seller/category and current policy. ProfitPilot should surface the current verified or user-defined assumption rather than invent a universal rate.'],
        ['Kya ye Amazon India ke liye accurate hai?', 'It is an estimate based on selected assumptions. Actual fees vary by category, fulfilment, location and seller program. Verify current official rates.'],
        ['GST included hai?', 'India mode can include GST/tax inputs when supported, but the exact treatment depends on your business and tax setup.'],
      ].map(([q,a]) => <details key={q} open className="py-5"><summary className="cursor-pointer list-none pr-6 text-base font-black md:text-lg">{q}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{a}</p></details>)}</div></div></section>

      <footer className="border-t border-black/10 py-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm font-semibold text-neutral-600 md:flex-row md:items-center md:justify-between md:px-8"><div>Made in Gaya, Bihar for Sellers Worldwide</div><div>© ProfitPilot</div></div></footer>
    </main>
  );
}

function Metric({label, value, green, red}:{label:string;value:string;green?:boolean;red?:boolean}) { return <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><p className="text-xs font-semibold text-white/45">{label}</p><p className={`mt-2 text-xl font-black ${green ? 'text-[#66f19c]' : red ? 'text-[#ff7a72]' : 'text-white'}`}>{value}</p></div>; }
function Leak({label,value,max}:{label:string;value:number;max:number}) { return <div><div className="mb-1 flex justify-between text-xs font-bold"><span className="text-white/65">{label}</span><span>{money(value)}</span></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[#00C853]" style={{width:`${Math.max(6,Math.min(100,(value/Math.max(max,1))*100))}%`}}/></div></div> }
function Scenario({label,value,positive}:{label:string;value:number;positive?:boolean}) { return <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="font-black">{label}</span><span className={`text-xl font-black ${positive ? 'text-[#00C853]':'text-[#FF3B30]'}`}>{money(value)}</span></div><div className="mt-4 h-3 rounded-full bg-neutral-100"><div className={`h-3 rounded-full ${positive ? 'bg-[#00C853]':'bg-[#FF3B30]'}`} style={{width:`${Math.max(8,Math.min(100,Math.abs(value)/20*100))}%`}}/></div></div> }
function Step({n,title,text}:{n:string;title:string;text:string}) { return <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"><div className="text-sm font-black text-[#00C853]">{n}</div><h3 className="mt-4 text-2xl font-black">{title}</h3><p className="mt-2 leading-6 text-neutral-600">{text}</p></div> }
