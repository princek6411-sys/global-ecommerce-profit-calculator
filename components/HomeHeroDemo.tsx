'use client';

import { useMemo, useState } from 'react';
import {
  calculateLineItems,
  calculateMaximumAdSpend,
  calculateProfitSnapshot,
  type CalculatorInput,
} from '@/lib/calculator';
import { DEMO_SCENARIO, createDemoInput, type DemoScenario } from '@/lib/demo';

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="hero-demo-field">
      <span>{label}</span>
      <div className="hero-demo-input">
        <span>$</span>
        <input type="number" min={0} step={0.01} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} aria-label={label} />
      </div>
    </label>
  );
}

function buildInput(values: DemoScenario): CalculatorInput {
  return createDemoInput(values);
}

export default function HomeHeroDemo() {
  const [values, setValues] = useState({ ...DEMO_SCENARIO });

  const result = useMemo(() => {
    const input = buildInput(values);
    const snapshot = calculateProfitSnapshot(input);
    const line = calculateLineItems(input);
    const maxAdSpend = calculateMaximumAdSpend(input);
    const costs = Object.entries(line)
      .filter(([key]) => key !== 'revenue')
      .sort((a, b) => b[1] - a[1]);
    return { input, ...snapshot, line, maxAdSpend, biggest: costs[0] };
  }, [values]);

  const verdict = result.decision.label;
  const verdictClass = result.decision.tone;

  function update(key: keyof typeof DEMO_SCENARIO, value: number) {
    setValues((previous) => ({ ...previous, [key]: Math.max(0, value) }));
  }

  function reset() {
    setValues({ ...DEMO_SCENARIO });
  }

  return (
    <div className="hero-demo-shell" aria-label="Interactive profit example">
      <div className="hero-demo-topline">
        <span className="live-dot" aria-hidden="true" />
        <span>Live example · changes instantly</span>
        <button className="text-action" onClick={reset}>Reset</button>
      </div>

      <div className="hero-demo-input-grid">
        <Field label="Selling price" value={values.sellingPrice} onChange={(v) => update('sellingPrice', v)} />
        <Field label="Product cost" value={values.productCost} onChange={(v) => update('productCost', v)} />
        <Field label="Ad spend" value={values.advertising} onChange={(v) => update('advertising', v)} />
        <Field label="Shipping" value={values.shipping} onChange={(v) => update('shipping', v)} />
      </div>

      <div className="hero-demo-result">
        <div className="hero-demo-result-main">
          <div className="hero-demo-kicker">TRUE PROFIT / ORDER</div>
          <div className="hero-demo-number">{money(result.profit)}</div>
          <div className="hero-demo-sub">Single calculation engine · example assumptions visible below</div>
        </div>
        <div className="hero-demo-result-side">
          <div className="hero-stat"><span>Margin</span><strong>{result.margin.toFixed(1)}%</strong></div>
          <div className={`hero-verdict ${verdictClass}`}><span>Verdict</span><strong>{verdict}</strong></div>
        </div>
      </div>

      <div className="hero-demo-strip">
        <span>Revenue {money(values.sellingPrice)}</span>
        <span>− Costs {money(Math.max(0, values.sellingPrice - result.profit))}</span>
        <strong>= Profit {money(result.profit)}</strong>
      </div>

      <div className="hero-decision-mini">
        <div><span>Biggest leak</span><strong>{result.biggest?.[0] ?? 'product'}</strong></div>
        <div><span>Max ad spend</span><strong>{money(result.maxAdSpend)}</strong></div>
        <div><span>Do next</span><strong>Test a lower ad cost</strong></div>
      </div>

      <div className="hero-assumption-inline">
        <details>
          <summary>How is this calculated?</summary>
          <p>Illustrative fee assumptions are $7 platform fee + $1.75 payment fee. Shipping and ad spend come directly from the inputs above. Tax, returns, RTO and packaging are disabled in this example.</p>
        </details>
      </div>

      <div className="mobile-profit-sticky" aria-live="polite">
        <div><span>True profit</span><strong>{money(result.profit)}</strong></div>
        <div><span>Margin</span><strong>{result.margin.toFixed(1)}%</strong></div>
        <a href="#calculator">Full calculator →</a>
      </div>
    </div>
  );
}
