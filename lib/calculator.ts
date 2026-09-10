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
  tax: CostConfig;
  other: CostConfig;
};

const cost = (base: number, c: CostConfig) => {
  if (!c.enabled) return 0;
  return c.mode === 'percent' ? base * (c.value / 100) : c.value;
};

export function calculateRevenue(i: CalculatorInput) { return Math.max(0, i.sellingPrice * Math.max(1, i.quantity)); }
export function calculateProductCost(i: CalculatorInput) { return Math.max(0, i.productCost * Math.max(1, i.quantity)); }
export function calculatePlatformFee(i: CalculatorInput) { return cost(calculateRevenue(i), i.platformFee); }
export function calculatePaymentFee(i: CalculatorInput) { return cost(calculateRevenue(i), i.paymentFee); }
export function calculateShipping(i: CalculatorInput) { return cost(calculateRevenue(i), i.shipping); }
export function calculatePackaging(i: CalculatorInput) { return cost(calculateRevenue(i), i.packaging); }
export function calculateAdvertising(i: CalculatorInput) { return cost(calculateRevenue(i), i.advertising); }
export function calculateAffiliateCommission(i: CalculatorInput) { return cost(calculateRevenue(i), i.affiliate); }
export function calculateDiscount(i: CalculatorInput) { return cost(calculateRevenue(i), i.discount); }
export function calculateRefundAllowance(i: CalculatorInput) { return cost(calculateRevenue(i), i.returns); }
export function calculateTax(i: CalculatorInput) { return cost(calculateRevenue(i), i.tax); }
export function calculateOtherCosts(i: CalculatorInput) { return cost(calculateRevenue(i), i.other); }

export function calculateTotalExpenses(i: CalculatorInput) {
  return calculateProductCost(i) + calculatePlatformFee(i) + calculatePaymentFee(i) + calculateShipping(i) + calculatePackaging(i) + calculateAdvertising(i) + calculateAffiliateCommission(i) + calculateDiscount(i) + calculateRefundAllowance(i) + calculateTax(i) + calculateOtherCosts(i);
}

export function calculateNetProfit(i: CalculatorInput) { return calculateRevenue(i) - calculateTotalExpenses(i); }
export function calculateProfitMargin(i: CalculatorInput) {
  const r = calculateRevenue(i); return r === 0 ? 0 : (calculateNetProfit(i) / r) * 100;
}
export function calculateROI(i: CalculatorInput) {
  const invested = calculateTotalExpenses(i) - calculateAdvertising(i);
  return invested <= 0 ? 0 : (calculateNetProfit(i) / invested) * 100;
}

export function calculateBreakEvenPrice(i: CalculatorInput) {
  const q = Math.max(1, i.quantity);
  const fixedPerOrder = calculateShipping({...i, sellingPrice: 1}) + calculatePackaging({...i, sellingPrice: 1}) + 0;
  const fixedCosts = calculateProductCost(i) + fixedPerOrder;
  const variableRate = [i.platformFee,i.paymentFee,i.advertising,i.affiliate,i.discount,i.returns,i.tax,i.other]
    .filter(c => c.enabled && c.mode === 'percent')
    .reduce((sum,c) => sum + c.value / 100, 0);
  const variablePerRevenue = Math.max(0.01, 1 - variableRate);
  return fixedCosts / variablePerRevenue / q;
}

export function calculateMaximumAdSpend(i: CalculatorInput) {
  const withoutAds = calculateNetProfit({...i, advertising: { enabled: false, value: 0, mode: 'fixed' }});
  return Math.max(0, withoutAds);
}

export function calculateTargetProfitPrice(i: CalculatorInput, targetProfit: number) {
  const q = Math.max(1, i.quantity);
  const fixed = calculateProductCost(i) + (i.shipping.enabled && i.shipping.mode === 'fixed' ? i.shipping.value : 0) + (i.packaging.enabled && i.packaging.mode === 'fixed' ? i.packaging.value : 0);
  const percentRates = [i.platformFee,i.paymentFee,i.advertising,i.affiliate,i.discount,i.returns,i.tax,i.other]
    .filter(c => c.enabled && c.mode === 'percent')
    .reduce((sum,c) => sum + c.value/100, 0);
  const fixedVariable = (i.shipping.enabled && i.shipping.mode === 'percent' ? 0 : 0) + (i.packaging.enabled && i.packaging.mode === 'percent' ? 0 : 0);
  const denominator = Math.max(0.01, 1 - percentRates);
  return (fixed + fixedVariable + targetProfit) / denominator / q;
}

export function scoreProfit(i: CalculatorInput) {
  const margin = calculateProfitMargin(i);
  const roi = calculateROI(i);
  const revenue = calculateRevenue(i);
  const adBurden = revenue <= 0 ? 100 : (calculateAdvertising(i) / revenue) * 100;
  const feeBurden = revenue <= 0 ? 100 : ((calculatePlatformFee(i) + calculatePaymentFee(i)) / revenue) * 100;
  const profit = calculateNetProfit(i);
  const marginScore = Math.max(0, Math.min(50, margin * 2));
  const roiScore = Math.max(0, Math.min(25, roi / 4));
  const adScore = Math.max(0, 15 - adBurden * 0.5);
  const feeScore = Math.max(0, 10 - feeBurden * 0.5);
  const raw = marginScore + roiScore + adScore + feeScore;
  return Math.round(Math.max(0, Math.min(100, profit <= 0 ? 0 : raw)));
}

export function decisionForScore(score: number) {
  if (score >= 70) return { label: 'Good opportunity', tone: 'good' as const };
  if (score >= 45) return { label: 'Marginal / risky', tone: 'warn' as const };
  return { label: 'Not profitable under current assumptions', tone: 'bad' as const };
}
