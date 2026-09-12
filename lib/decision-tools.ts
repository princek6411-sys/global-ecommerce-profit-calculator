import type { CalculatorInput, CostConfig } from '@/lib/calculator';
import { calculateAll } from '@/lib/calculation-engine';
import type { CurrencyCode, FeeStatus, Platform } from '@/lib/config';

export type DecisionStatus = 'CALCULATED' | 'ESTIMATED' | 'USER-DEFINED' | 'VERIFIED' | 'UNAVAILABLE' | 'UNCLASSIFIED' | 'STALE' | 'MOCKED';

export type DecisionScenario = {
  label: string;
  input: CalculatorInput;
  profit: number;
  margin: number;
};

export type Recommendation = {
  trigger: string;
  why: string;
  action: string;
  effect: string;
};

export type ComparisonRow = {
  key: string;
  label: string;
  profit: number;
  margin: number;
  status: DecisionStatus;
  freshness?: string;
  reason: string;
  currency: CurrencyCode;
  platform?: Platform;
  displayProfit?: number;
};

export const roundForDisplay = (n: number, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round((Number.isFinite(n) ? n : 0) * factor) / factor;
};

export function calculateScenario(input: CalculatorInput, currency: CurrencyCode, targetProfit = 0, targetMargin = 25) {
  const result = calculateAll(input, currency, targetProfit, targetMargin);
  return { profit: result.trueProfit.amount, margin: result.margin, result };
}

export function buildStressScenarios(base: CalculatorInput, currency: CurrencyCode, targetProfit = 0, targetMargin = 25): DecisionScenario[] {
  const definitions: Array<[string, CalculatorInput]> = [
    ['Price −10%', { ...base, sellingPrice: base.sellingPrice * 0.9 }],
    ['COGS +10%', { ...base, productCost: base.productCost * 1.1 }],
    ['Ads +20%', { ...base, advertising: { ...base.advertising, value: base.advertising.value * 1.2 } }],
    ['Shipping +10%', { ...base, shipping: { ...base.shipping, value: base.shipping.value * 1.1 } }],
    ['Returns +10%', { ...base, returns: { ...base.returns, enabled: true, value: base.returns.value + 10, mode: 'percent' as const } }],
  ];
  return definitions.map(([label, input]) => {
    const result = calculateScenario(input, currency, targetProfit, targetMargin);
    return { label, input, ...result };
  });
}

export function riskState(baseProfit: number, stress: DecisionScenario[]): 'SAFE' | 'WATCH' | 'AT RISK' | 'LOSS-MAKING' {
  if (baseProfit < 0) return 'LOSS-MAKING';
  const losses = stress.filter((x) => x.profit < 0).length;
  if (losses >= 3) return 'AT RISK';
  if (losses > 0 || stress.some((x) => x.profit < baseProfit * 0.5)) return 'WATCH';
  return 'SAFE';
}

export function buildRecommendation(args: {
  input: CalculatorInput;
  currency: CurrencyCode;
  feeStatus?: FeeStatus;
  targetProfit?: number;
  targetMargin?: number;
}): Recommendation {
  const { input, currency, feeStatus = 'unavailable', targetProfit = 0, targetMargin = 25 } = args;
  const calc = calculateAll(input, currency, targetProfit, targetMargin);
  const revenue = Math.max(0, calc.revenue.amount);
  const candidates: Array<{ key: string; label: string; amount: number; controllable: boolean; action: string }> = [
    { key: 'advertising', label: 'Ads', amount: Math.max(0, calc.line.advertising.amount), controllable: true, action: 'test a lower ad spend' },
    { key: 'productCost', label: 'COGS', amount: Math.max(0, input.productCost), controllable: true, action: 'test a lower product cost' },
    { key: 'shipping', label: 'Shipping', amount: input.shipping.enabled ? Math.max(0, input.shipping.value) : 0, controllable: true, action: 'test a lower shipping cost' },
    { key: 'platformFee', label: 'Marketplace fees', amount: calc.line.platform.amount, controllable: false, action: 'compare marketplace fee assumptions' },
  ];
  const topControllable = candidates.filter((x) => x.controllable && x.amount > 0).sort((a, b) => b.amount - a.amount)[0];
  if (!topControllable || revenue <= 0) {
    return { trigger: 'Insufficient decision data', why: 'A meaningful controllable cost driver cannot be identified from the current inputs.', action: 'Complete the core cost inputs and recalculate.', effect: 'No unsupported scenario effect is shown.' };
  }
  const share = (topControllable.amount / revenue) * 100;
  const testAmount = Math.max(1, Math.min(topControllable.amount * 0.1, topControllable.amount));
  const effect = topControllable.key === 'advertising' ? testAmount : testAmount;
  const statusNote = feeStatus === 'example' ? ' Fee assumptions are illustrative.' : '';
  return {
    trigger: `${topControllable.label} = ${roundForDisplay(share, 1)}% of selling price`,
    why: `${topControllable.label} is the largest controllable cost among the supported inputs.${statusNote}`,
    action: `${capitalize(topControllable.action)} by about ${roundForDisplay(testAmount)} ${currency} and recalculate.`,
    effect: `Scenario indicates approximately ${roundForDisplay(effect)} ${currency} of profit improvement if the cost falls by that amount and other assumptions stay unchanged.`,
  };
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
