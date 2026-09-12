'use client';

import { useMemo, useState, type ReactNode } from 'react';
import type { CalculatorInput, CostConfig } from '@/lib/calculator';
import type { CurrencyCode, FeeStatus, Platform } from '@/lib/config';
import { calculateAll } from '@/lib/calculation-engine';
import { formatMoney } from '@/lib/money';
import { buildRecommendation, buildStressScenarios, riskState } from '@/lib/decision-tools';
import Link from 'next/link';
import { getPlatformDecisionContext } from '@/lib/platform-intelligence';

type ResultLite = { profit: number; margin: number };
type ProductDraft = { name: string; price: number; cost: number; ads: number };
type CountryRow = { code: string; name: string; currency: CurrencyCode; platform: Platform; profit: number; displayProfit?: number; margin: number; score: number };
type PlatformRow = { platform: Platform; fee: { value: number; status: FeeStatus }; profit: number; margin: number; score: number; description: string };

type Props = {
  input: CalculatorInput;
  currency: CurrencyCode;
  displayCurrency: CurrencyCode;
  result: ResultLite;
  feeStatus: FeeStatus;
  platformRows: PlatformRow[];
  countryRows: CountryRow[];
  products: ProductDraft[];
  onProductChange: (index: number, patch: Partial<ProductDraft>) => void;
};

const money = (value: number, currency: CurrencyCode) => formatMoney(value, currency);
const signed = (value: number, currency: CurrencyCode) => `${value >= 0 ? '+' : ''}${money(value, currency)}`;

function StatusChip({ children }: { children: ReactNode }) {
  return <span className="trust-chip">{children}</span>;
}

function DecisionBrief({ result, next, currency }: { result: ResultLite; next: ReturnType<typeof buildRecommendation>; currency: CurrencyCode }) {
  const state = result.profit > 0 ? 'profitable' : result.profit < 0 ? 'loss-making' : 'break-even';
  return <div className="decision-brief card">
    <div className="decision-number"><span className="eyebrow">TRUE PROFIT</span><strong className={result.profit > 0 ? 'positive' : result.profit < 0 ? 'negative' : ''}>{money(result.profit, currency)}</strong></div>
    <div><strong>{`You're currently ${state}.`}</strong><p className="section-copy">Margin is {result.margin.toFixed(1)}% under the current assumptions.</p></div>
    <div className="decision-reason"><strong>Why</strong><p>{next.why}</p></div>
    <div className="decision-next"><strong>Next test</strong><p>{next.action}</p><small>{next.effect}</small></div>
  </div>;
}

export default function DecisionTools(props: Props) {
  const [mode, setMode] = useState<'whatif' | 'stress' | 'compare'>('whatif');
  const [whatIfField, setWhatIfField] = useState<'price' | 'cogs' | 'ads'>('price');
  const [whatIfValue, setWhatIfValue] = useState(props.input.sellingPrice);
  const recommendation = useMemo(() => buildRecommendation({ input: props.input, currency: props.currency, feeStatus: props.feeStatus }), [props.input, props.currency, props.feeStatus]);
  const whatIfInput = useMemo(() => {
    const next = { ...props.input } as CalculatorInput;
    if (whatIfField === 'price') next.sellingPrice = Math.max(0, whatIfValue);
    if (whatIfField === 'cogs') next.productCost = Math.max(0, whatIfValue);
    if (whatIfField === 'ads') next.advertising = { ...next.advertising, enabled: true, value: Math.max(0, whatIfValue) } as CostConfig;
    return next;
  }, [props.input, whatIfField, whatIfValue]);
  const after = useMemo(() => calculateAll(whatIfInput, props.currency), [whatIfInput, props.currency]);
  const stress = useMemo(() => buildStressScenarios(props.input, props.currency), [props.input, props.currency]);
  const risk = riskState(props.result.profit, stress);
  const firstBroken = stress.slice().sort((a, b) => a.profit - b.profit)[0];

  const currentWhatIfValue = whatIfField === 'price' ? props.input.sellingPrice : whatIfField === 'cogs' ? props.input.productCost : props.input.advertising.value;
  const baseline = props.result.profit;
  const delta = after.trueProfit.amount - baseline;

  return <section className="decision-tools">
    <div className="card panel decision-tools-head">
      <div><span className="eyebrow">Decision tools</span><h2 className="section-title">Turn the result into a decision.</h2><p className="section-copy">Every important number is interpreted before the next step is shown.</p></div>
      <StatusChip>Actual inputs → calculated scenarios</StatusChip>
    </div>

    <div className="tabbar" role="tablist" aria-label="Decision tools">
      {([['whatif', 'What-If'], ['stress', 'Stress Test'], ['compare', 'Compare']] as const).map(([id, label]) => <button key={id} className={`tab ${mode === id ? 'active' : ''}`} onClick={() => setMode(id)} role="tab" aria-selected={mode === id}>{label}</button>)}
    </div>

    {mode === 'whatif' && <div className="feature-grid">
      <div className="card panel">
        <span className="eyebrow">WHAT-IF ILLUSTRATION</span><h3>What happens if you change one important variable?</h3>
        <p className="section-copy">One variable at a time keeps the experiment understandable.</p>
        <div className="form-grid">
          <div className="field"><label>Variable</label><select value={whatIfField} onChange={(e) => { const key = e.target.value as typeof whatIfField; setWhatIfField(key); setWhatIfValue(key === 'price' ? props.input.sellingPrice : key === 'cogs' ? props.input.productCost : props.input.advertising.value); }}><option value="price">Selling price</option><option value="cogs">COGS</option><option value="ads">Ad spend</option></select></div>
          <div className="field"><label>Try value ({props.currency})</label><input type="number" min="0" step="0.01" value={whatIfValue} onChange={(e) => setWhatIfValue(Number(e.target.value) || 0)} /></div>
        </div>
        <div className="whatif-card"><span>CHANGE</span><strong>{whatIfValue === currentWhatIfValue ? 'No change yet' : `${whatIfField === 'price' ? 'Price' : whatIfField === 'cogs' ? 'COGS' : 'Ad spend'} changed from ${currentWhatIfValue.toFixed(2)} to ${whatIfValue.toFixed(2)}.`}</strong></div>
      </div>
      <div className="card panel">
        <span className="eyebrow">BEFORE → AFTER → DELTA</span><div className="metrics"><div className="metric"><small>Before</small><strong className={baseline < 0 ? 'negative' : 'positive'}>{money(baseline, props.currency)}</strong></div><div className="metric"><small>After</small><strong className={after.trueProfit.amount < 0 ? 'negative' : 'positive'}>{money(after.trueProfit.amount, props.currency)}</strong></div><div className="metric"><small>Change</small><strong className={delta < 0 ? 'negative' : 'positive'}>{signed(delta, props.currency)}</strong></div></div>
        <div className="notice"><strong>Meaning:</strong> {delta > 0 ? `Profit improves by ${money(delta, props.currency)}.` : delta < 0 ? `Profit falls by ${money(Math.abs(delta), props.currency)}.` : 'The change does not alter profit.'}</div>
        <div className="decision-reason"><strong>Why</strong><p>The central calculation engine produced the before/after results using the same assumptions except for the selected variable.</p></div>
        <div className="decision-next"><strong>Next action</strong><p>{delta > 0 ? 'Keep this scenario as a candidate and compare it with the other controllable levers.' : 'Test the opposite direction or return to the largest controllable cost.'}</p></div>
      </div>
    </div>}

    {mode === 'stress' && <div className="feature-grid">
      <div className="card panel"><span className="eyebrow">STRESS-TEST ILLUSTRATION</span><h3>How fragile is the current profit?</h3><div className="decision-status"><strong>{risk}</strong><StatusChip>Scenario-based, not a forecast</StatusChip></div><div className="metrics"><div className="metric"><small>Base case</small><strong>{money(props.result.profit, props.currency)}</strong></div><div className="metric"><small>Worst tested case</small><strong className={firstBroken.profit < 0 ? 'negative' : 'positive'}>{money(firstBroken.profit, props.currency)}</strong></div><div className="metric"><small>Change</small><strong className={firstBroken.profit - props.result.profit < 0 ? 'negative' : 'positive'}>{signed(firstBroken.profit - props.result.profit, props.currency)}</strong></div></div><div className="notice"><strong>{firstBroken.profit < 0 ? 'Becomes loss-making under the most severe tested scenario.' : 'Still profitable under every listed stress scenario.'}</strong><br />Main trigger in the tested set: <strong>{firstBroken.label}</strong>.</div></div>
      <div className="card panel"><span className="eyebrow">WHAT TO WATCH</span>{stress.map((scenario) => <div className="survival-row" key={scenario.label}><div><strong>{scenario.label}</strong><small>{scenario.profit < 0 ? 'This scenario breaks profitability.' : 'Profit remains positive in this scenario.'}</small></div><strong className={scenario.profit < 0 ? 'negative' : 'positive'}>{money(scenario.profit, props.currency)}</strong><span className={`survival-status ${scenario.profit < 0 ? 'danger' : 'safe'}`}>{scenario.profit < 0 ? 'Loss-making' : 'Still profitable'}</span></div>)}</div>
    </div>}

    {mode === 'compare' && <div className="feature-grid">
      <div className="card panel"><span className="eyebrow">MARKETPLACE COMPARISON</span><h3>Which marketplace is economically stronger?</h3><p className="section-copy">Native operating-currency profit and margin come first. Converted reporting values are secondary. Platform research is context, not a substitute for the calculation engine.</p><div className="table-wrap"><table className="compare-table"><thead><tr><th>Marketplace</th><th>Native profit</th><th>Margin</th><th>Data</th></tr></thead><tbody>{props.platformRows.map((row) => <tr key={row.platform}><td><strong>{row.platform}</strong><div className="input-note">{row.description}</div></td><td>{money(row.profit, props.currency)}</td><td>{row.margin.toFixed(1)}%</td><td><span className="trust-chip">{row.fee.status}</span></td></tr>)}</tbody></table></div><div className="notice"><strong>Meaning:</strong> {props.platformRows.length > 1 ? `The strongest current estimate is ${props.platformRows.slice().sort((a, b) => b.profit - a.profit)[0].platform}, but the result remains assumption-dependent.` : 'At least two valid comparable marketplaces are needed.'}</div><div className="platform-research-grid"><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center'}}><strong>Platform research context</strong><Link href="/platform-intelligence" className="input-note">Open full A–Z intelligence →</Link></div>{props.platformRows.map((row) => { const context = getPlatformDecisionContext(row.platform); return <details key={`research-${row.platform}`} className="platform-research-item"><summary>{row.platform} · {context?.research.verification ?? 'UNAVAILABLE'}</summary>{context ? <><p>{context.research.verification === 'VERIFIED' ? `Verified research: ${context.active.length} active capabilities across ${context.familyNames.length} families.` : 'This marketplace is supported by the calculator but was not covered by the supplied research report.'}</p>{context.economics.slice(0, 3).map((item) => <small key={item.id}><strong>{item.officialName}:</strong> {item.notes ?? 'Scoped economic fact; not auto-applied without matching inputs.'}</small>)}{context.research.limitations.slice(0, 1).map((note) => <small key={note}><strong>Boundary:</strong> {note}</small>)}</> : <p>No platform research metadata is available for this marketplace.</p>}</details>; })}</div></div>
      <div className="card panel"><span className="eyebrow">PRODUCT COMPARISON</span><h3>Which product is stronger under the same model?</h3><div className="table-wrap"><table className="compare-table"><thead><tr><th>Product</th><th>Profit</th><th>Margin</th><th>Decision</th></tr></thead><tbody>{props.products.map((p) => { const r = calculateAll({ ...props.input, sellingPrice: p.price, productCost: p.cost, advertising: { ...props.input.advertising, enabled: true, value: p.ads, mode: 'fixed' as const } }, props.currency); return <tr key={p.name}><td><strong>{p.name}</strong></td><td>{money(r.trueProfit.amount, props.currency)}</td><td>{r.margin.toFixed(1)}%</td><td>{r.trueProfit.amount > 0 ? 'Profitable' : r.trueProfit.amount < 0 ? 'Loss-making' : 'Break-even'}</td></tr>; })}</tbody></table></div><div className="decision-next"><strong>Why</strong><p>Compare the actual profit difference before choosing a product. Do not rely on a converted total alone.</p></div></div>
      <div className="card panel" style={{ gridColumn: '1 / -1' }}><span className="eyebrow">COUNTRY COMPARISON</span><h3>How does the same model change by country?</h3><div className="table-wrap"><table className="compare-table"><thead><tr><th>Country</th><th>Native profit</th><th>Margin</th><th>Currency</th><th>Reporting profit</th></tr></thead><tbody>{props.countryRows.map((r) => <tr key={r.code}><td><strong>{r.name}</strong><div className="input-note">{r.platform}</div></td><td>{money(r.profit, r.currency)}</td><td>{r.margin.toFixed(1)}%</td><td>{r.currency}</td><td>{r.displayProfit === undefined ? 'Unavailable' : money(r.displayProfit, props.displayCurrency)}</td></tr>)}</tbody></table></div><p className="input-note">Native/local economics are the primary comparison. Reporting currency is only a converted view and may use a reference FX rate.</p></div>
    </div>}

    <DecisionBrief result={props.result} next={recommendation} currency={props.currency} />
  </section>;
}
