export type CostConfig = {
  enabled: boolean;
  value: number;
  mode: 'fixed' | 'percent';
};

export type CalculatorInput = {
  sellingPrice: number;
  quantity: number;
  productCost: number;
  platformFee: CostConfig;
  paymentFee: CostConfig;
  shipping: CostConfig;
  packaging: CostConfig;
  advertising: CostConfig;
  affiliate: CostConfig;
  discount: CostConfig;
  returns: CostConfig;
  rto: CostConfig;
  tax: CostConfig;
  other: CostConfig;
};

export type ProfitLine = Record<string, number>;

export function safeNumber(value: unknown, fallback = 0) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function safeQuantity(value: unknown) {
  return Math.max(1, Math.floor(safeNumber(value, 1)) || 1);
}

export function normalizeCost(c: CostConfig): CostConfig {
  const value = Math.max(0, safeNumber(c?.value));
  const mode = c?.mode === 'fixed' ? 'fixed' : 'percent';
  return { enabled: Boolean(c?.enabled), value: mode === 'percent' ? Math.min(100, value) : value, mode };
}

const baseRevenue = (i: CalculatorInput) => Math.max(0, safeNumber(i.sellingPrice)) * safeQuantity(i.quantity);

export function cost(base: number, c: CostConfig) {
  const normalized = normalizeCost(c);
  if (!normalized.enabled || base <= 0) return 0;
  return normalized.mode === 'percent' ? base * (normalized.value / 100) : normalized.value;
}

export function calculateRevenue(i: CalculatorInput) { return baseRevenue(i); }
export function calculateProductCost(i: CalculatorInput) { return Math.max(0, safeNumber(i.productCost)) * safeQuantity(i.quantity); }
export function calculatePlatformFee(i: CalculatorInput) { return cost(calculateRevenue(i), i.platformFee); }
export function calculatePaymentFee(i: CalculatorInput) { return cost(calculateRevenue(i), i.paymentFee); }
export function calculateShipping(i: CalculatorInput) { return cost(calculateRevenue(i), i.shipping); }
export function calculatePackaging(i: CalculatorInput) { return cost(calculateRevenue(i), i.packaging); }
export function calculateAdvertising(i: CalculatorInput) { return cost(calculateRevenue(i), i.advertising); }
export function calculateAffiliateCommission(i: CalculatorInput) { return cost(calculateRevenue(i), i.affiliate); }
export function calculateDiscount(i: CalculatorInput) { return cost(calculateRevenue(i), i.discount); }
export function calculateRefundAllowance(i: CalculatorInput) { return cost(calculateRevenue(i), i.returns); }
export function calculateRTO(i: CalculatorInput) { return cost(calculateRevenue(i), i.rto); }
export function calculateTax(i: CalculatorInput) { return cost(calculateRevenue(i), i.tax); }
export function calculateOtherCosts(i: CalculatorInput) { return cost(calculateRevenue(i), i.other); }

export function calculateLineItems(i: CalculatorInput): ProfitLine {
  return {
    revenue: calculateRevenue(i), product: calculateProductCost(i), platform: calculatePlatformFee(i), payment: calculatePaymentFee(i), shipping: calculateShipping(i), packaging: calculatePackaging(i), advertising: calculateAdvertising(i), affiliate: calculateAffiliateCommission(i), discount: calculateDiscount(i), returns: calculateRefundAllowance(i), rto: calculateRTO(i), tax: calculateTax(i), other: calculateOtherCosts(i)
  };
}

export function calculateTotalExpenses(i: CalculatorInput) {
  const line = calculateLineItems(i);
  return Object.entries(line).filter(([key]) => key !== 'revenue').reduce((sum, [, value]) => sum + value, 0);
}

export function calculateNetProfit(i: CalculatorInput) { return calculateRevenue(i) - calculateTotalExpenses(i); }
export function calculateProfitMargin(i: CalculatorInput) {
  const revenue = calculateRevenue(i);
  return revenue === 0 ? 0 : (calculateNetProfit(i) / revenue) * 100;
}
export function calculateROI(i: CalculatorInput) {
  const invested = calculateTotalExpenses(i) - calculateAdvertising(i);
  return invested <= 0 ? 0 : (calculateNetProfit(i) / invested) * 100;
}

function variableRate(c: CostConfig) {
  const normalized = normalizeCost(c);
  return normalized.enabled && normalized.mode === 'percent' ? normalized.value / 100 : 0;
}
function fixedCost(c: CostConfig) {
  const normalized = normalizeCost(c);
  return normalized.enabled && normalized.mode === 'fixed' ? normalized.value : 0;
}

function sumVariableRates(i: CalculatorInput, omitAdvertising = false) {
  const list = [i.platformFee, i.paymentFee, i.shipping, i.packaging, i.advertising, i.affiliate, i.discount, i.returns, i.rto, i.tax, i.other];
  return list.reduce((sum, item) => sum + (omitAdvertising && item === i.advertising ? 0 : variableRate(item)), 0);
}

function fixedNonProductCosts(i: CalculatorInput, omitAdvertising = false) {
  const list: CostConfig[] = [i.platformFee, i.paymentFee, i.shipping, i.packaging, i.advertising, i.affiliate, i.discount, i.returns, i.rto, i.tax, i.other];
  return list.reduce((sum, item) => sum + (omitAdvertising && item === i.advertising ? 0 : fixedCost(item)), 0);
}

export function calculateBreakEvenPrice(i: CalculatorInput) {
  const q = safeQuantity(i.quantity);
  const variableRates = sumVariableRates(i);
  if (variableRates >= 1) return Infinity;
  const fixed = calculateProductCost(i) + fixedNonProductCosts(i);
  return Math.max(0, fixed / (1 - variableRates) / q);
}

export function calculateMaximumAdSpend(i: CalculatorInput, targetProfit = 0) {
  const withoutAds = calculateNetProfit({ ...i, advertising: { enabled: false, value: 0, mode: 'fixed' } });
  const target = Math.max(0, safeNumber(targetProfit));
  const ad = normalizeCost(i.advertising);
  // If current ads are percentage-based, maximum ad spend means the revenue amount that can be allocated to ads.
  if (ad.enabled && ad.mode === 'percent') {
    const baseProfitBeforeAds = withoutAds;
    const available = Math.max(0, baseProfitBeforeAds - target);
    const denominator = 1;
    return available / denominator;
  }
  return Math.max(0, withoutAds - target);
}

export function calculateTargetProfitPrice(i: CalculatorInput, targetProfit: number) {
  return solvePrice(i, Math.max(0, safeNumber(targetProfit)));
}

export function calculateTargetMarginPrice(i: CalculatorInput, targetMargin: number) {
  const margin = Math.min(99.9, Math.max(0, safeNumber(targetMargin))) / 100;
  const q = safeQuantity(i.quantity);
  const variableRates = sumVariableRates(i);
  const fixed = calculateProductCost(i) + fixedNonProductCosts(i);
  const denominator = 1 - variableRates - margin;
  if (denominator <= 0) return Infinity;
  return Math.max(0, fixed / denominator / q);
}

function solvePrice(i: CalculatorInput, targetProfit: number) {
  const q = safeQuantity(i.quantity);
  const variableRates = sumVariableRates(i);
  if (variableRates >= 1) return Infinity;
  const fixed = calculateProductCost(i) + fixedNonProductCosts(i);
  return Math.max(0, (fixed + targetProfit) / (1 - variableRates) / q);
}

export function scoreProfit(i: CalculatorInput) {
  const margin = calculateProfitMargin(i);
  const roi = calculateROI(i);
  const revenue = calculateRevenue(i);
  const adBurden = revenue <= 0 ? 100 : (calculateAdvertising(i) / revenue) * 100;
  const feeBurden = revenue <= 0 ? 100 : ((calculatePlatformFee(i) + calculatePaymentFee(i)) / revenue) * 100;
  const breakEven = calculateBreakEvenPrice(i);
  const sellingPrice = Math.max(0, safeNumber(i.sellingPrice));
  const buffer = revenue <= 0 || !Number.isFinite(breakEven) || sellingPrice <= 0 ? 0 : Math.max(0, ((sellingPrice - breakEven) / sellingPrice) * 100);
  const marginScore = Math.max(0, Math.min(50, margin * 2));
  const roiScore = Math.max(0, Math.min(25, roi / 4));
  const adScore = Math.max(0, Math.min(15, 15 - adBurden * 0.5));
  const feeScore = Math.max(0, Math.min(10, 10 - feeBurden * 0.5));
  const bufferBonus = Math.min(10, buffer / 10);
  const raw = marginScore + roiScore + adScore + feeScore + bufferBonus;
  return Math.round(Math.max(0, Math.min(100, calculateNetProfit(i) <= 0 ? 0 : raw)));
}

export function decisionForScore(score: number) {
  if (score >= 70) return { label: 'Good opportunity', tone: 'good' as const };
  if (score >= 45) return { label: 'Marginal / risky', tone: 'warn' as const };
  return { label: 'Not recommended under current assumptions', tone: 'bad' as const };
}

export function calculateProfitSnapshot(i: CalculatorInput) {
  const line = calculateLineItems(i);
  const profit = calculateNetProfit(i);
  const margin = calculateProfitMargin(i);
  const roi = calculateROI(i);
  const score = scoreProfit(i);
  const decision = decisionForScore(score);
  return { revenue: line.revenue, expenses: calculateTotalExpenses(i), profit, margin, roi, score, decision, line };
}
