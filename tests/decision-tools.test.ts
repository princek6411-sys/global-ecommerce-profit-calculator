import { describe, expect, it } from 'vitest';
import { analyzeSettlementCSV } from '@/lib/csv';
import { buildStressScenarios, buildRecommendation, riskState } from '@/lib/decision-tools';
import type { CalculatorInput } from '@/lib/calculator';

const baseInput: CalculatorInput = {
  sellingPrice: 100,
  quantity: 1,
  productCost: 25,
  platformFee: { enabled: true, value: 10, mode: 'percent' },
  paymentFee: { enabled: true, value: 2, mode: 'percent' },
  shipping: { enabled: true, value: 5, mode: 'fixed' },
  packaging: { enabled: true, value: 2, mode: 'fixed' },
  advertising: { enabled: true, value: 10, mode: 'fixed' },
  affiliate: { enabled: false, value: 0, mode: 'percent' },
  discount: { enabled: false, value: 0, mode: 'percent' },
  returns: { enabled: true, value: 3, mode: 'percent' },
  rto: { enabled: false, value: 0, mode: 'percent' },
  tax: { enabled: false, value: 0, mode: 'percent' },
  other: { enabled: false, value: 0, mode: 'fixed' },
};

describe('Decision clarity and Seller Intelligence', () => {
  it('keeps return/RTO counts separate from money costs and preserves source currency', () => {
    const csv = [
      'order_id,sku,currency,selling_price,product_cost,marketplace_fee,shipping,ad_spend,returns,rto,deductions,tax,settlement_amount,order_date',
      'ORD-1,SKU-A,INR,999,320,120,80,60,0,0,25,35,359,2026-09-01',
      'ORD-2,SKU-A,INR,999,320,120,80,60,1,0,25,35,319,2026-09-02',
    ].join('\n');
    const result = analyzeSettlementCSV(csv);
    expect(result.sourceCurrency).toBe('INR');
    expect(result.totals.returnOrders).toBe(1);
    expect(result.totals.rtoOrders).toBe(0);
    expect(result.totals.unmappedDeductions).toBe(50);
    expect(result.skuSummary[0].recognizedCosts).toBe(590);
    expect(result.skuSummary[0].profit).toBe(38);
  });

  it('builds stress cases from the central calculation engine', () => {
    const stress = buildStressScenarios(baseInput, 'USD');
    expect(stress).toHaveLength(5);
    expect(stress.every((x) => Number.isFinite(x.profit))).toBe(true);
  });

  it('uses signed profit for the risk state', () => {
    expect(riskState(-10, [])).toBe('LOSS-MAKING');
  });

  it('creates a deterministic recommendation from the largest controllable cost', () => {
    const recommendation = buildRecommendation({ input: baseInput, currency: 'USD', feeStatus: 'example' });
    expect(recommendation.why).toContain('largest controllable cost');
    expect(recommendation.action).toContain('recalculate');
  });
});
