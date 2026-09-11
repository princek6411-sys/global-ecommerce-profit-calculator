'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import SellerAnalyzer from '@/components/SellerAnalyzer';
import { categories, countries, currencies, getCountry, getDefaultPlatform, getPlatformsForCountry, getPlatformConfig, languages, platformConfigs, type Category, type CountryCode, type CurrencyCode, type LanguageCode, type Platform } from '@/lib/config';
import { type CalculatorInput, type CostConfig, calculateAdvertising, calculateBreakEvenPrice, calculateLineItems, calculateMaximumAdSpend, calculateNetProfit, calculateProfitMargin, calculateROI, calculateTargetMarginPrice, calculateTargetProfitPrice, decisionForScore, scoreProfit, calculateTotalExpenses } from '@/lib/calculator';
import { t } from '@/lib/i18n';
import { calculateAll } from '@/lib/calculation-engine';
import { formatMoney } from '@/lib/money';
import { getLatestRate, type FXQuote } from '@/lib/fx';
import { calculateDataConfidence, getProfitLeaks } from '@/lib/intelligence';
import MarketplaceSelector from '@/components/MarketplaceSelector';
import BrandIcon from '@/components/BrandIcon';
import FlagIcon from '@/components/FlagIcon';

type Props = { initialPlatform?: Platform };
type State = CalculatorInput & { platform: Platform; country: CountryCode; currency: CurrencyCode; displayCurrency: CurrencyCode; productName: string; category: Category; language: LanguageCode };
type ProductDraft = { name: string; price: number; cost: number; ads: number };

const cost = (enabled: boolean, value: number, mode: CostConfig['mode'] = 'percent'): CostConfig => ({ enabled, value, mode });
const clamp = (n: number, min = 0, max = Number.MAX_SAFE_INTEGER) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
const money = (value: number, currency: CurrencyCode) => formatMoney(value, currency);

function initial(platform: Platform = 'Amazon', country: CountryCode = 'US', language: LanguageCode = 'en'): State {
  const c = getCountry(country);
  const valid = getPlatformsForCountry(c.code).some((p) => p.platform === platform) ? platform : getDefaultPlatform(c.code);
  const fee = getPlatformConfig(valid, c.code)?.fee.value ?? 0;
  return { productName: 'Sample Product', platform: valid, country: c.code, currency: c.currency, displayCurrency: c.currency, language, category: 'Other', sellingPrice: 49.99, quantity: 1, productCost: 15, platformFee: cost(true, fee), paymentFee: cost(true, 2.9), shipping: cost(true, 5, 'fixed'), packaging: cost(true, 0.5, 'fixed'), advertising: cost(true, 8, 'fixed'), affiliate: cost(false, 0), discount: cost(false, 0), returns: cost(true, 3), rto: cost(false, 0), tax: cost(false, 0), other: cost(false, 0) };
}

export default function Calculator({ initialPlatform = 'Amazon' }: Props) {
  const [s, setS] = useState<State>(() => initial(initialPlatform));
  const [targetProfit, setTargetProfit] = useState(10);
  const [targetMargin, setTargetMargin] = useState(25);
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [tab, setTab] = useState<'calculator' | 'scenarios' | 'compare' | 'seller'>('calculator');
  const [products, setProducts] = useState<ProductDraft[]>([
    { name: 'Product A', price: 49.99, cost: 15, ads: 8 },
    { name: 'Product B', price: 59.99, cost: 22, ads: 10 },
    { name: 'Product C', price: 79.99, cost: 28, ads: 12 }
  ]);

  const tr = (key: Parameters<typeof t>[1]) => t(s.language, key);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('profitpilot-calculation-v2');
      if (!raw) return;
      const restored = JSON.parse(raw) as Partial<State>;
      const restoredCountry = restored.country ?? 'US';
      const base = initial(restored.platform ?? initialPlatform, restoredCountry, restored.language ?? 'en');
      const restoredDisplay = restored.displayCurrency ?? restored.currency ?? base.displayCurrency;
      const next = { ...base, ...restored, currency: getCountry(restoredCountry).currency, displayCurrency: restoredDisplay } as State;
      setS(next);
    } catch { /* corrupted local state is ignored */ }
  }, [initialPlatform]);

  useEffect(() => {
    document.documentElement.lang = s.language;
  }, [s.language]);

  const update = <K extends keyof State>(key: K, value: State[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const updateCost = (key: keyof CalculatorInput, patch: Partial<CostConfig>) => setS((prev) => ({ ...prev, [key]: { ...prev[key] as CostConfig, ...patch } }));

  const countryChange = (code: CountryCode) => {
    const c = getCountry(code);
    const platform = getDefaultPlatform(code);
    const fee = getPlatformConfig(platform, code)?.fee.value ?? 0;
    setS((prev) => ({ ...prev, country: code, currency: c.currency, displayCurrency: prev.displayCurrency === prev.currency ? c.currency : prev.displayCurrency, platform, platformFee: cost(true, fee) }));
  };

  const platformChange = (platform: Platform) => {
    const fee = getPlatformConfig(platform, s.country)?.fee.value ?? 0;
    setS((prev) => ({ ...prev, platform, platformFee: cost(true, fee) }));
  };

  const currencyChange = (currency: CurrencyCode) => update('displayCurrency', currency);
  const languageChange = (language: LanguageCode) => update('language', language);

  const [fxQuotes, setFxQuotes] = useState<Record<string, FXQuote>>({});
  const [fxState, setFxState] = useState<'idle' | 'loading' | 'ready' | 'stale' | 'error'>('idle');
  const [fxError, setFxError] = useState('');

  const result = useMemo(() => {
    const input = s as CalculatorInput;
    const calculated = calculateAll(input, s.currency, targetProfit, targetMargin);
    const line = Object.fromEntries(Object.entries(calculated.line).map(([key, value]) => [key, value.amount]));
    return {
      line, revenue: calculated.revenue.amount, expenses: calculated.totalExpenses.amount, profit: calculated.trueProfit.amount,
      margin: calculated.margin, roi: calculated.roi, score: calculated.profitScore, decision: calculated.verdict,
      breakEven: calculated.breakEvenPrice.amount, breakEvenValid: calculated.breakEvenPriceValid, maxAd: calculated.maxAdSpend.amount, targetPrice: calculated.targetProfitPrice.amount, targetPriceValid: calculated.targetProfitPriceValid,
      targetMarginPrice: calculated.targetMarginPrice.amount, targetMarginPriceValid: calculated.targetMarginPriceValid, grossProfit: calculated.grossProfit.amount,
      contributionProfit: calculated.contributionProfit.amount, adAdjustedProfit: calculated.adAdjustedProfit.amount, advertisingBurden: calculated.advertisingBurden,
    };
  }, [s, targetProfit, targetMargin]);
  const totalExpenses = result.expenses;
  const profitLeaks = useMemo(() => getProfitLeaks(result.line), [result.line]);
  const topLeak = profitLeaks[0];
  const confidence = calculateDataConfidence({
    feeStatus: getPlatformConfig(s.platform, s.country)?.fee.status ?? 'unavailable',
    fxStatus: s.currency === s.displayCurrency ? 'same' : fxState === 'stale' ? 'stale' : fxState === 'ready' ? 'fresh' : 'unavailable',
    enabledCosts: Object.values(s).filter((value) => value && typeof value === 'object' && 'enabled' in (value as object) && (value as CostConfig).enabled).length,
    missingInputs: [s.sellingPrice, s.productCost].filter((value) => !Number.isFinite(value) || value <= 0).length,
  });

  const convert = useCallback((value: number, base: CurrencyCode = s.currency, quote: CurrencyCode = s.displayCurrency) => {
    if (!Number.isFinite(value)) return undefined;
    if (base === quote) return value;
    const q = fxQuotes[`${base}:${quote}`];
    return q && Number.isFinite(q.rate) ? value * q.rate : undefined;
  }, [fxQuotes, s.currency, s.displayCurrency]);
  const displayMoney = useCallback((value: number, base: CurrencyCode = s.currency) => {
    const converted = convert(value, base, s.displayCurrency);
    return converted === undefined ? '—' : money(converted, s.displayCurrency);
  }, [convert, s.currency, s.displayCurrency]);

  useEffect(() => {
    let cancelled = false;
    const bases = Array.from(new Set(countries.map((c) => c.currency)));
    const target = s.displayCurrency;
    setFxState('loading');
    setFxError('');
    Promise.all(bases.map(async (base) => base === target
      ? ({ base, quote: target, rate: 1, date: new Date().toISOString().slice(0, 10), source: 'Identity', fetchedAt: new Date().toISOString() } as FXQuote)
      : getLatestRate(base, target)
    )).then((quotes) => {
      if (cancelled) return;
      setFxQuotes((prev) => ({ ...prev, ...Object.fromEntries(quotes.map((q) => [`${q.base}:${q.quote}`, q])) }));
      setFxState(quotes.some((q) => q.stale) ? 'stale' : 'ready');
    }).catch((error) => {
      if (cancelled) return;
      setFxState('error');
      setFxError(error instanceof Error ? error.message : 'Exchange-rate service is unavailable.');
    });
    return () => { cancelled = true; };
  }, [s.displayCurrency]);

  const comparisons = useMemo(() => platformConfigs.filter((p) => p.countries.includes(s.country)).map((p) => {
    const next = { ...s, platform: p.platform, platformFee: cost(true, p.fee.value) } as CalculatorInput;
    const calculated = calculateAll(next, s.currency, targetProfit, targetMargin);
    return { ...p, profit: calculated.trueProfit.amount, margin: calculated.margin, score: calculated.profitScore };
  }).sort((a, b) => b.margin - a.margin || b.profit - a.profit), [s, targetProfit, targetMargin]);

  const countryComparisons = useMemo(() => countries.map((c) => {
    const p = getPlatformsForCountry(c.code)[0];
    const next = { ...s, country: c.code, currency: c.currency, platform: p.platform, platformFee: cost(true, p.fee.value) } as CalculatorInput;
    const calculated = calculateAll(next, c.currency, targetProfit, targetMargin);
    return { ...c, platform: p.platform, profit: calculated.trueProfit.amount, displayProfit: convert(calculated.trueProfit.amount, c.currency, s.displayCurrency), margin: calculated.margin, score: calculated.profitScore };
  }).sort((a, b) => b.margin - a.margin || b.profit - a.profit), [s, targetProfit, targetMargin, fxQuotes]);

  const stress = useMemo(() => {
    const base = s as CalculatorInput;
    const scenarios = [
      ['Base case', base],
      ['Ads +20%', { ...base, advertising: { ...base.advertising, value: base.advertising.value * 1.2 } }],
      ['Shipping +20%', { ...base, shipping: { ...base.shipping, value: base.shipping.value * 1.2 } }],
      ['Product cost +10%', { ...base, productCost: base.productCost * 1.1 }],
      ['Returns +5%', { ...base, returns: { ...base.returns, enabled: true, value: base.returns.value + 5, mode: 'percent' as const } }],
      ['Combined downside', { ...base, advertising: { ...base.advertising, value: base.advertising.value * 1.2 }, shipping: { ...base.shipping, value: base.shipping.value * 1.2 }, productCost: base.productCost * 1.1, returns: { ...base.returns, enabled: true, value: base.returns.value + 5, mode: 'percent' as const } }]
    ] as const;
    return scenarios.map(([label, input]) => { const calculated = calculateAll(input, s.currency, targetProfit, targetMargin); return { label, profit: calculated.trueProfit.amount, margin: calculated.margin }; });
  }, [s, targetProfit, targetMargin]);

  const productComparison = useMemo(() => products.map((p) => {
    const next = { ...s, sellingPrice: Math.max(0, p.price), productCost: Math.max(0, p.cost), advertising: { ...s.advertising, enabled: true, value: Math.max(0, p.ads), mode: 'fixed' as const } } as CalculatorInput;
    const calculated = calculateAll(next, s.currency, targetProfit, targetMargin); return { ...p, profit: calculated.trueProfit.amount, margin: calculated.margin, score: calculated.profitScore, verdict: calculated.verdict };
  }).sort((a, b) => b.profit - a.profit), [products, s, targetProfit, targetMargin]);

  const save = () => {
    try { localStorage.setItem('profitpilot-calculation-v2', JSON.stringify(s)); setSaved(true); window.setTimeout(() => setSaved(false), 1400); } catch { setShareStatus('Local save is unavailable in this browser.'); }
  };

  const share = async () => {
    const publicResult = { productName: s.productName, operatingCurrency: s.currency, displayCurrency: s.displayCurrency, currency: s.displayCurrency, profit: convert(result.profit, s.currency, s.displayCurrency) ?? result.profit, margin: result.margin, roi: result.roi, score: result.score, platform: s.platform, verdict: result.decision.label, bestPlatform: comparisons[0]?.platform, fxDate: fxQuotes[`${s.currency}:${s.displayCurrency}`]?.date };
    const url = `${window.location.origin}/result?data=${encodeURIComponent(JSON.stringify({ result: publicResult }))}`;
    try {
      if (navigator.share) await navigator.share({ title: 'My e-commerce profit result', text: `Estimated profit: ${displayMoney(result.profit)} (${s.currency} operating currency)`, url });
      else { await navigator.clipboard.writeText(url); setShareStatus('Share link copied'); }
    } catch { setShareStatus('Share cancelled.'); }
    window.setTimeout(() => setShareStatus(''), 1800);
  };

  const shareText = async () => {
    try { await navigator.clipboard.writeText(`ProfitPilot report\n${s.productName}\nProfit: ${displayMoney(result.profit)} (${s.currency} operating)\nMargin: ${result.margin.toFixed(1)}%\nROI: ${result.roi.toFixed(1)}%\nScore: ${result.score}/100\nPlatform: ${s.platform}`); setShareStatus('Result copied'); } catch { setShareStatus('Copy is unavailable in this browser.'); }
    window.setTimeout(() => setShareStatus(''), 1800);
  };

  const shareImage = async () => {
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 880; const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff'; ctx.font = '700 34px system-ui'; ctx.fillText('ProfitPilot — E-commerce Profit Report', 70, 90);
    ctx.font = '800 26px system-ui'; ctx.fillText('TRUE PROFIT', 70, 170); ctx.font = '800 86px system-ui'; ctx.fillText(displayMoney(result.profit), 70, 260);
    ctx.font = '600 28px system-ui'; ctx.fillText(`Margin ${result.margin.toFixed(1)}%  •  ROI ${result.roi.toFixed(1)}%`, 70, 320); ctx.fillText(`Profit Score ${result.score}/100`, 70, 365);
    ctx.fillStyle = '#dbeafe'; ctx.fillRect(70, 430, 940, 210); ctx.fillStyle = '#0f172a'; ctx.font = '700 28px system-ui'; ctx.fillText('Platform', 110, 490); ctx.fillText('Break-even', 560, 490); ctx.font = '800 44px system-ui'; ctx.fillText(s.platform, 110, 545); ctx.fillText(result.breakEvenValid ? displayMoney(result.breakEven) : 'N/A', 560, 545); ctx.font = '500 22px system-ui'; ctx.fillText('Estimated result • verify current marketplace terms', 70, 710);
    canvas.toBlob(async (blob) => { if (!blob) return; const file = new File([blob], 'profitpilot-result.png', { type: 'image/png' }); try { if (navigator.share && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: 'ProfitPilot result' }); else { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'profitpilot-result.png'; a.click(); URL.revokeObjectURL(url); } setShareStatus('Share image ready'); } catch { setShareStatus('Image share cancelled.'); } window.setTimeout(() => setShareStatus(''), 1800); }, 'image/png');
  };

  const feeMeta = getPlatformConfig(s.platform, s.country)?.fee;
  const statusClass = result.decision.tone;
  const costRows: Array<[keyof CalculatorInput, string, 'percent' | 'fixed']> = [
    ['platformFee', tr('fees'), 'percent'], ['paymentFee', tr('payment'), 'percent'], ['shipping', tr('shipping'), 'fixed'], ['packaging', tr('packaging'), 'fixed'], ['advertising', tr('advertising'), 'fixed'], ['affiliate', tr('affiliate'), 'percent'], ['discount', tr('discount'), 'percent'], ['returns', tr('returns'), 'percent'], ['rto', tr('rto'), 'percent'], ['tax', tr('tax'), 'percent'], ['other', tr('other'), 'fixed']
  ];

  const updateProduct = (index: number, patch: Partial<ProductDraft>) => setProducts((prev) => prev.map((p, i) => i === index ? { ...p, ...patch } : p));

  return <div>
    <MarketplaceSelector
      country={s.country}
      currency={s.displayCurrency}
      operatingCurrency={s.currency}
      language={s.language}
      platform={s.platform}
      onCountryChange={countryChange}
      onCurrencyChange={currencyChange}
      onLanguageChange={languageChange}
      onPlatformChange={platformChange}
    />
    <div className="fx-context-bar" role="status">
      <span><strong>Operating:</strong> {s.currency}</span>
      <span><strong>Display:</strong> {s.displayCurrency}</span>
      {s.currency === s.displayCurrency ? <span>Same currency — no FX conversion needed.</span> : fxState === 'loading' ? <span>Updating reference exchange rate…</span> : fxState === 'error' ? <span className="negative">FX unavailable: {fxError}</span> : fxState === 'stale' ? <span className="negative">Using cached FX rate. Verify before financial reporting.</span> : <span>Reference rate is informational and may differ from marketplace settlement FX.</span>}
      {s.currency !== s.displayCurrency && fxQuotes[`${s.currency}:${s.displayCurrency}`] && <span className="fx-rate">1 {s.currency} = {fxQuotes[`${s.currency}:${s.displayCurrency}`].rate.toFixed(s.displayCurrency === 'JPY' ? 0 : 4)} {s.displayCurrency} · {fxQuotes[`${s.currency}:${s.displayCurrency}`].date}</span>}
    </div>

    <div className="tabbar" role="tablist" aria-label="Calculator sections">
      {([["calculator", tr('calculator')], ["scenarios", tr('scenarios')], ["compare", tr('compareTab')], ["seller", tr('seller')]] as const).map(([id, label]) => <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}>{label}</button>)}
    </div>

    {tab === 'calculator' && <div className="calculator">
      <div className="card panel">
        <h2>{tr('calculate')}</h2><p className="section-copy">Start with the essentials. Every optional cost can be switched on or off.</p>
        <div className="form-grid">
          <div className="field"><label htmlFor="product-name">{tr('product')}</label><input id="product-name" value={s.productName} onChange={(e) => update('productName', e.target.value.slice(0, 120))} /></div>
          <div className="field marketplace-field"><span className="field-label" id="platform-label">{tr('platform')}</span><div className="field-context-note">Selected above with brand icon + country context.</div></div>
          <div className="field"><label htmlFor="category">{tr('category')}</label><select id="category" value={s.category} onChange={(e) => update('category', e.target.value as Category)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label htmlFor="price">{tr('sellingPrice')}</label><input id="price" type="number" min="0" step="0.01" value={s.sellingPrice} onChange={(e) => update('sellingPrice', clamp(Number(e.target.value)))} /></div>
          <div className="field"><label htmlFor="product-cost">{tr('productCost')}</label><input id="product-cost" type="number" min="0" step="0.01" value={s.productCost} onChange={(e) => update('productCost', clamp(Number(e.target.value)))} /></div>
          <div className="field"><label htmlFor="quantity">{tr('quantity')}</label><input id="quantity" type="number" min="1" step="1" value={s.quantity} onChange={(e) => update('quantity', Math.max(1, Math.floor(Number(e.target.value) || 1)))} /></div><div className="field-context-note full">All numeric cost inputs are entered in the marketplace operating currency ({s.currency}). Change Display currency to convert results without changing the underlying economics.</div>
        </div>
        <h3>Costs & deductions</h3>
        {costRows.map(([key, label]) => <div className="cost-row" key={key}><div className="field"><label htmlFor={`cost-${String(key)}`}>{label}</label><input id={`cost-${String(key)}`} type="number" min="0" step="0.01" value={(s[key] as CostConfig).value} onChange={(e) => updateCost(key, { value: clamp(Number(e.target.value)) })} disabled={!(s[key] as CostConfig).enabled} /></div><div className="field"><label htmlFor={`mode-${String(key)}`}>Mode</label><select id={`mode-${String(key)}`} value={(s[key] as CostConfig).mode} onChange={(e) => updateCost(key, { mode: e.target.value as CostConfig['mode'] })}><option value="percent">%</option><option value="fixed">Fixed</option></select></div><button type="button" className={`toggle ${(s[key] as CostConfig).enabled ? 'on' : ''}`} onClick={() => updateCost(key, { enabled: !(s[key] as CostConfig).enabled })} aria-label={`${(s[key] as CostConfig).enabled ? 'Disable' : 'Enable'} ${label}`}>{(s[key] as CostConfig).enabled ? '✓' : '+'}</button></div>)}
        <div className="notice"><strong>Fee transparency.</strong> {feeMeta?.status === 'example' ? 'This fee is an example assumption, not a current official schedule.' : 'This fee is configured as a verified source or user-defined value.'} Choose a user-defined value whenever you know your current seller terms.</div>
        {feeMeta?.sourceUrl && <p className="input-note"><a href={feeMeta.sourceUrl} target="_blank" rel="noreferrer">View fee source →</a></p>}
        <div className="actions"><button className="small-btn" onClick={save}>💾 {saved ? 'Saved' : tr('save')}</button><button className="small-btn" onClick={() => setS(initial(initialPlatform, s.country, s.language))}>{tr('reset')}</button></div>
      </div>

      <div className="results">
        <div className="card panel">
          <div className="profit-hero"><small>{tr('trueProfit').toUpperCase()}</small><div className="profit-value">{displayMoney(result.profit)}</div><div className="hero-row"><span className={`badge ${statusClass}`}>{result.decision.label}</span><span className="score-chip">{tr('score')} {result.score}/100</span></div><p className="hero-copy">{result.profit > 0 ? 'Your product is profitable under the current assumptions.' : 'Current assumptions do not produce positive profit.'}</p></div>
          <div className="metrics"><div className="metric"><small>{tr('revenue')}</small><strong>{displayMoney(result.revenue)}</strong></div><div className="metric"><small>{tr('expenses')}</small><strong>{displayMoney(totalExpenses)}</strong></div><div className="metric"><small>{tr('margin')}</small><strong>{result.margin.toFixed(1)}%</strong></div><div className="metric"><small>{tr('roi')}</small><strong>{result.roi.toFixed(1)}%</strong></div><div className="metric"><small>{tr('breakEven')}</small><strong>{result.breakEvenValid ? displayMoney(result.breakEven) : 'N/A'}</strong></div><div className="metric"><small>{tr('maxAd')}</small><strong>{displayMoney(result.maxAd)}</strong></div></div>
          <div className="insight"><strong>{tr('why')}</strong><p>{result.margin >= 25 ? 'Healthy margin buffer.' : 'Your margin is relatively thin; small cost increases may reduce profit quickly.'} {calculateAdvertising(s) > 0 ? `Ads are ${((calculateAdvertising(s) / Math.max(result.revenue, 1)) * 100).toFixed(1)}% of revenue.` : 'No ad spend is included.'}</p></div>
          <div className="insight compact"><strong>{tr('recommendedAction')}</strong><p>{topLeak ? `Largest visible leak: ${topLeak.label} (${topLeak.share.toFixed(1)}% of detected costs).` : 'Review your largest cost buckets before increasing ad spend.'} {result.maxAd > 0 ? `Estimated ad room at zero target profit: ${displayMoney(result.maxAd)}.` : 'There is no positive ad room at the current target.'}</p></div>
          <div className="metrics" style={{ marginTop: 12 }}>
            <div className="metric"><small>Gross profit</small><strong>{displayMoney(result.grossProfit)}</strong></div>
            <div className="metric"><small>Contribution profit</small><strong>{displayMoney(result.contributionProfit)}</strong></div>
            <div className="metric"><small>Ad-adjusted profit</small><strong>{displayMoney(result.adAdjustedProfit)}</strong></div>
            <div className="metric"><small>Data confidence</small><strong>{confidence.label} · {confidence.score}/100</strong></div>
          </div>
          <h3>{tr('whereMoneyGoes')}</h3>
          <div className="breakdown">{Object.entries({ Revenue: result.line.revenue, 'Product cost': -result.line.product, 'Marketplace fee': -result.line.platform, 'Payment fee': -result.line.payment, Shipping: -result.line.shipping, Packaging: -result.line.packaging, Advertising: -result.line.advertising, Affiliate: -result.line.affiliate, Discount: -result.line.discount, Returns: -result.line.returns, RTO: -result.line.rto, Tax: -result.line.tax, Other: -result.line.other }).map(([label, value]) => <div className="breakdown-row" key={label}><span>{label}</span><span className={value < 0 ? 'negative' : ''}>{displayMoney(value)}</span></div>)}</div>
          {topLeak && <div className="notice" style={{ marginTop: 12 }}><strong>Biggest profit leak: {topLeak.label}</strong><span> {topLeak.share.toFixed(1)}% of detected costs under the current assumptions.</span></div>}
          <details className="details"><summary>{tr('assumptions')}</summary><div className="assumption-grid"><span>{tr('fees')}</span><strong>{s.platformFee.mode === 'percent' ? `${s.platformFee.value}%` : displayMoney(s.platformFee.value)}</strong><span>Source status</span><strong>{feeMeta?.status ?? 'user-defined'}</strong><span>Last verified</span><strong>{feeMeta?.lastVerified ?? 'Not verified'}</strong><span>{tr('category')}</span><strong>{s.category}</strong></div></details>
          <div className="actions"><button className="small-btn" onClick={share}>📤 {tr('share')}</button><button className="small-btn" onClick={shareImage}>🖼️ {tr('shareImage')}</button><button className="small-btn" onClick={shareText}>Copy result</button></div>{shareStatus && <p className="input-note" role="status">{shareStatus}</p>}
        </div>
        <div className="card panel" style={{ marginTop: 14 }}><h2>{tr('verdict')}</h2><p className="section-copy">Estimate based on your inputs, not financial advice.</p><span className={`badge ${statusClass}`}>{result.decision.label}</span><ul className="plain-list"><li>{result.margin >= 25 ? 'Healthy margin buffer' : 'Thin margin buffer'}</li><li>{result.breakEven <= s.sellingPrice ? 'Selling price is above break-even' : 'Selling price is at or below break-even'}</li><li>{result.maxAd > 0 ? `Estimated ad room: ${displayMoney(result.maxAd)}` : 'No positive ad room at current target'}</li></ul><details className="details"><summary>How is the score calculated?</summary><p className="input-note">The score is a transparent heuristic using margin, ROI, ad burden, fee burden and break-even buffer. It is not an official rating.</p></details></div>
      </div>
    </div>}

    {tab === 'scenarios' && <div className="feature-grid"><div className="card panel"><h2>{tr('whatIf')}</h2><p className="section-copy">Change a few levers and immediately see the estimated profit move.</p><div className="form-grid"><div className="field"><label>Price</label><input type="number" min="0" value={s.sellingPrice} onChange={(e) => update('sellingPrice', clamp(Number(e.target.value)))} /></div><div className="field"><label>Ad spend</label><input type="number" min="0" value={s.advertising.value} onChange={(e) => updateCost('advertising', { value: clamp(Number(e.target.value)) })} /></div><div className="field"><label>Product cost</label><input type="number" min="0" value={s.productCost} onChange={(e) => update('productCost', clamp(Number(e.target.value)))} /></div><div className="field"><label>Shipping</label><input type="number" min="0" value={s.shipping.value} onChange={(e) => updateCost('shipping', { value: clamp(Number(e.target.value)) })} /></div></div><div className="whatif-card"><strong>{displayMoney(result.profit)} estimated profit</strong><p className="input-note">Results update without a page reload.</p></div><h3>Target pricing</h3><div className="form-grid"><div className="field"><label>{tr('targetProfit')}</label><input type="number" min="0" value={targetProfit} onChange={(e) => setTargetProfit(clamp(Number(e.target.value)))} /></div><div className="field"><label>{tr('targetMargin')}</label><input type="number" min="0" max="99" value={targetMargin} onChange={(e) => setTargetMargin(clamp(Number(e.target.value), 0, 99))} /></div></div><div className="metrics"><div className="metric"><small>{tr('targetPrice')}</small><strong>{result.targetPriceValid ? displayMoney(result.targetPrice) : 'N/A'}</strong></div><div className="metric"><small>{tr('targetMarginPrice')}</small><strong>{result.targetMarginPriceValid ? displayMoney(result.targetMarginPrice) : 'N/A'}</strong></div></div>
          <h3>Price sensitivity</h3>
          <div className="scenario-grid">{[-10, -5, 0, 5, 10].map((delta) => { const next = { ...(s as CalculatorInput), sellingPrice: s.sellingPrice * (1 + delta / 100) }; const calc = calculateAll(next, s.currency, targetProfit, targetMargin); return <div className="scenario" key={delta}><strong>{delta === 0 ? 'Current' : `${delta > 0 ? '+' : ''}${delta}%`}</strong><span className={`badge ${calc.trueProfit.amount > 0 ? 'good' : 'bad'}`}>{displayMoney(calc.trueProfit.amount)}</span><small>{calc.margin.toFixed(1)}%</small></div>; })}</div>
        </div><div className="card panel"><h2>{tr('stress')}</h2><p className="section-copy">Downside simulations are scenarios, not predictions.</p><div className="scenario-grid">{stress.map((x) => <div className="scenario" key={x.label}><strong>{x.label}</strong><span className={`badge ${x.profit > 0 ? 'good' : 'bad'}`}>{displayMoney(x.profit)}</span></div>)}</div><div className="notice" style={{ marginTop: 14 }}><strong>Product survives {stress.slice(1).filter((x) => x.profit > 0).length}/{stress.length - 1} downside cases.</strong> The combined scenario is deliberately harsh.</div></div></div>}

    {tab === 'compare' && <div className="feature-grid"><div className="card panel"><h2>{tr('platformBattle')}</h2><p className="section-copy">Same product assumptions across supported platforms for this country.</p><div className="table-wrap"><table className="compare-table"><thead><tr><th>Platform</th><th>Fee</th><th>Profit</th><th>Margin</th><th>Score</th></tr></thead><tbody>{comparisons.map((r, i) => { return <tr key={r.platform}><td><div className="compare-platform-name"><BrandIcon platform={r.platform} size={20} label={r.platform} /><strong>{r.platform}{i === 0 ? ' 🏆' : ''}</strong></div><div className="input-note">{r.description}</div></td><td>{r.fee.value}% <span className="input-note">({r.fee.status})</span></td><td>{displayMoney(r.profit)}</td><td>{r.margin.toFixed(1)}%</td><td>{r.score}/100</td></tr>; })}</tbody></table></div><div className="notice">Winner = highest estimated profit under the assumptions shown. Actual fees vary by account, category, region and seller program.</div></div><div className="card panel"><h2>{tr('countryCompare')}</h2><p className="section-copy">Same product model across the six launch countries. Country taxes and shipping remain estimates unless verified.</p><div className="country-list">{countryComparisons.map((r, i) => <div className="country-row" key={r.code}><div><div className="compare-country-name"><FlagIcon country={r.code} /><strong>{r.name}{i === 0 ? ' 🏆' : ''}</strong></div><div className="input-note">{r.platform} • {r.currency}</div></div><div className="country-values"><strong>{r.displayProfit === undefined ? '—' : money(r.displayProfit, s.displayCurrency)}</strong><span>{r.margin.toFixed(1)}%</span></div></div>)}</div></div><div className="card panel" style={{ gridColumn: '1 / -1' }}><h2>{tr('productCompare')}</h2><p className="section-copy">Compare up to five products using the same marketplace and fee assumptions.</p><div className="feature-grid">{products.map((p, i) => <div className="card feature" key={i}><div className="form-grid"><div className="field"><label>{tr('product')}</label><input value={p.name} onChange={(e) => updateProduct(i, { name: e.target.value })} /></div><div className="field"><label>{tr('sellingPrice')}</label><input type="number" min="0" value={p.price} onChange={(e) => updateProduct(i, { price: clamp(Number(e.target.value)) })} /></div><div className="field"><label>{tr('productCost')}</label><input type="number" min="0" value={p.cost} onChange={(e) => updateProduct(i, { cost: clamp(Number(e.target.value)) })} /></div><div className="field"><label>{tr('advertising')}</label><input type="number" min="0" value={p.ads} onChange={(e) => updateProduct(i, { ads: clamp(Number(e.target.value)) })} /></div></div></div>)}</div><div className="table-wrap" style={{ marginTop: 14 }}><table className="compare-table"><thead><tr><th>Rank</th><th>Product</th><th>Profit</th><th>Margin</th><th>Score</th><th>Verdict</th></tr></thead><tbody>{productComparison.map((p, i) => <tr key={p.name + i}><td>{i + 1}</td><td><strong>{p.name}</strong></td><td>{displayMoney(p.profit)}</td><td>{p.margin.toFixed(1)}%</td><td>{p.score}/100</td><td><span className={`badge ${p.verdict.tone}`}>{p.verdict.label}</span></td></tr>)}</tbody></table></div></div></div>}

    {tab === 'seller' && <SellerAnalyzer currency={s.displayCurrency} />}
  </div>;
}
