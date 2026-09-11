import { describe, expect, it } from 'vitest';
import { calculateAll } from '@/lib/calculation-engine';
import { calculateLineItems, type CalculatorInput } from '@/lib/calculator';

const baseInput: CalculatorInput = {
  sellingPrice: 100,
  quantity: 1,
  productCost: 20,
  platformFee: { enabled: true, value: 10, mode: 'percent' },
  paymentFee: { enabled: true, value: 2, mode: 'percent' },
  shipping: { enabled: true, value: 5, mode: 'fixed' },
  packaging: { enabled: true, value: 2, mode: 'fixed' },
  advertising: { enabled: true, value: 10, mode: 'fixed' },
  affiliate: { enabled: false, value: 0, mode: 'percent' },
  discount: { enabled: false, value: 0, mode: 'percent' },
  returns: { enabled: false, value: 0, mode: 'percent' },
  rto: { enabled: false, value: 0, mode: 'percent' },
  tax: { enabled: false, value: 0, mode: 'percent' },
  other: { enabled: false, value: 0, mode: 'fixed' },
};

describe('ProfitPilot calculation engine', () => {
  it('uses one calculation result across profit and line items', () => {
    const result = calculateAll(baseInput, 'USD', 10, 25);
    const line = calculateLineItems(baseInput);
    expect(result.revenue.amount).toBe(line.revenue);
    expect(result.trueProfit.amount).toBeCloseTo(51, 10);
    expect(result.margin).toBeCloseTo(51, 10);
    expect(result.trueProfit.currency).toBe('USD');
  });

  it('preserves margin while currency changes outside the engine', () => {
    const usd = calculateAll(baseInput, 'USD');
    const inrSameEconomics = calculateAll(baseInput, 'INR');
    expect(usd.margin).toBeCloseTo(inrSameEconomics.margin, 10);
    expect(usd.trueProfit.amount).toBeCloseTo(inrSameEconomics.trueProfit.amount, 10);
    expect(usd.trueProfit.currency).not.toBe(inrSameEconomics.trueProfit.currency);
  });

  it('never returns NaN or Infinity for normal inputs', () => {
    const result = calculateAll(baseInput, 'USD');
    for (const value of [result.revenue.amount, result.totalExpenses.amount, result.trueProfit.amount, result.margin, result.roi, result.maxAdSpend.amount]) {
      expect(Number.isFinite(value)).toBe(true);
    }
  });

  it('flags mathematically impossible price targets instead of displaying Infinity', () => {
    const impossible = { ...baseInput, platformFee: { enabled: true, value: 100, mode: 'percent' as const } };
    const result = calculateAll(impossible, 'USD', 10, 25);
    expect(result.breakEvenPriceValid).toBe(false);
    expect(result.targetProfitPriceValid).toBe(false);
    expect(result.targetMarginPriceValid).toBe(false);
  });
});
