'use client';

import { useMemo, useState } from 'react';
import {
  calculateNetProfit,
  calculateProfitMargin,
  type CalculatorInput,
} from '@/lib/calculator';

const baseInput = (sellingPrice: number, productCost: number, advertising: number, shipping: number): CalculatorInput => ({
  sellingPrice,
  quantity: 1,
  productCost,
  platformFee: { enabled: true, value: 7, mode: 'fixed' },
  paymentFee: { enabled: true, value: 1.75, mode: 'fixed' },
  shipping: { enabled: true, value: shipping, mode: 'fixed' },
  packaging: { enabled: false, value: 0, mode: 'fixed' },
  advertising: { enabled: true, value: advertising, mode: 'fixed' },
  affiliate: { enabled: false, value: 0, mode: 'fixed' },
  discount: { enabled: false, value: 0, mode: 'fixed' },
  returns: { enabled: false, value: 0, mode: 'fixed' },
  rto: { enabled: false, value: 0, mode: 'fixed' },
  tax: { enabled: false, value: 0, mode: 'fixed' },
  other: { enabled: false, value: 0, mode: 'fixed' },
});

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

function Field({ label, value, onChange, step = 0.01 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return (
    <label className="hero-demo-field">
      <span>{label}</span>
      <div className="hero-demo-input">
        <span>$</span>
        <input type="number" value={value} min={0} step={step} onChange={(e) => onChange(Number(e.target.value) || 0)} aria-label={label} />
      </div>
    </label>
  );
}

export default function HomeHeroDemo() {
  const [sellingPrice, setSellingPrice] = useState(49.99);
  const [productCost, setProductCost] = useState(15);
  const [advertising, setAdvertising] = useState(8);
  const [shipping, setShipping] = useState(5);

  const result = useMemo(() => {
    const input = baseInput(sellingPrice, productCost, advertising, shipping);
    return {
      profit: calculateNetProfit(input),
      margin: calculateProfitMargin(input),
    };
  }, [sellingPrice, productCost, advertising, shipping]);

  const verdict = result.profit > 0 && result.margin >= 20 ? 'GOOD OPPORTUNITY' : result.profit > 0 ? 'MARGINAL / RISKY' : 'NOT RECOMMENDED';
  const verdictClass = result.profit > 0 && result.margin >= 20 ? 'good' : result.profit > 0 ? 'warn' : 'bad';

  const tryExample = () => {
    setSellingPrice(49.99);
    setProductCost(15);
    setAdvertising(8);
    setShipping(5);
  };

  return (
    <div className="hero-demo-shell" aria-label="Interactive profit example">
      <div className="hero-demo-topline">
        <span className="live-dot" aria-hidden="true" />
        <span>Live example · changes instantly</span>
        <button className="text-action" onClick={tryExample}>Reset</button>
      </div>

      <div className="hero-demo-input-grid">
        <Field label="Selling price" value={sellingPrice} onChange={setSellingPrice} />
        <Field label="Product cost" value={productCost} onChange={setProductCost} />
        <Field label="Ad spend" value={advertising} onChange={setAdvertising} />
        <Field label="Shipping" value={shipping} onChange={setShipping} />
      </div>

      <div className="hero-demo-result">
        <div className="hero-demo-result-main">
          <div className="hero-demo-kicker">TRUE PROFIT / ORDER</div>
          <div className="hero-demo-number">{money(result.profit)}</div>
          <div className="hero-demo-sub">after the example fees, product cost, ads and shipping</div>
        </div>
        <div className="hero-demo-result-side">
          <div className="hero-stat"><span>Margin</span><strong>{result.margin.toFixed(1)}%</strong></div>
          <div className={`hero-verdict ${verdictClass}`}><span>Verdict</span><strong>{verdict}</strong></div>
        </div>
      </div>

      <div className="hero-demo-strip">
        <span>Revenue {money(sellingPrice)}</span>
        <span>− Costs {money(Math.max(0, sellingPrice - result.profit))}</span>
        <strong>= Profit {money(result.profit)}</strong>
      </div>
    </div>
  );
}
