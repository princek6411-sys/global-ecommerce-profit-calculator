import {
  calculateAdvertising,
  calculateBreakEvenPrice,
  calculateLineItems,
  calculateMaximumAdSpend,
  calculateNetProfit,
  calculateProfitMargin,
  calculateROI,
  calculateTargetMarginPrice,
  calculateTargetProfitPrice,
  decisionForScore,
  scoreProfit,
  type CalculatorInput,
} from '@/lib/calculator';
import type { CurrencyCode } from '@/lib/config';
import { money, type Money } from '@/lib/money';

export type CalculationResult = {
  currency: CurrencyCode;
  revenue: Money;
  totalExpenses: Money;
  grossProfit: Money;
  contributionProfit: Money;
  adAdjustedProfit: Money;
  trueProfit: Money;
  margin: number;
  roi: number;
  breakEvenPrice: Money;
  breakEvenPriceValid: boolean;
  targetProfitPrice: Money;
  targetProfitPriceValid: boolean;
  targetMarginPrice: Money;
  targetMarginPriceValid: boolean;
  maxAdSpend: Money;
  profitScore: number;
  verdict: ReturnType<typeof decisionForScore>;
  line: Record<string, Money>;
  advertisingBurden: number;
};

function determineCurrency(currency: CurrencyCode | undefined): CurrencyCode {
  return currency ?? 'USD';
}

export function calculateAll(input: CalculatorInput, currency: CurrencyCode = 'USD', targetProfit = 0, targetMargin = 25): CalculationResult {
  const line = calculateLineItems(input);
  const revenue = line.revenue;
  const product = line.product + line.discount;
  const grossProfit = revenue - product;
  const operatingBeforeAds = grossProfit - line.platform - line.payment - line.shipping - line.packaging - line.affiliate - line.returns - line.rto - line.tax - line.other;
  const adAdjustedProfit = operatingBeforeAds - line.advertising;
  const trueProfit = calculateNetProfit(input);
  const breakEven = calculateBreakEvenPrice(input);
  const targetPrice = calculateTargetProfitPrice(input, targetProfit);
  const targetMarginPrice = calculateTargetMarginPrice(input, targetMargin);
  const totalExpenses = Object.entries(line).filter(([key]) => key !== 'revenue').reduce((sum, [, value]) => sum + Number(value), 0);
  const advertisingBurden = revenue <= 0 ? 0 : (calculateAdvertising(input) / revenue) * 100;
  const c = determineCurrency(currency);

  return {
    currency: c,
    revenue: money(revenue, c),
    totalExpenses: money(totalExpenses, c),
    grossProfit: money(grossProfit, c),
    contributionProfit: money(operatingBeforeAds, c),
    adAdjustedProfit: money(adAdjustedProfit, c),
    trueProfit: money(trueProfit, c),
    margin: calculateProfitMargin(input),
    roi: calculateROI(input),
    breakEvenPrice: money(breakEven, c),
    breakEvenPriceValid: Number.isFinite(breakEven),
    targetProfitPrice: money(targetPrice, c),
    targetProfitPriceValid: Number.isFinite(targetPrice),
    targetMarginPrice: money(targetMarginPrice, c),
    targetMarginPriceValid: Number.isFinite(targetMarginPrice),
    maxAdSpend: money(calculateMaximumAdSpend(input, 0), c),
    profitScore: scoreProfit(input),
    verdict: decisionForScore(scoreProfit(input)),
    line: Object.fromEntries(Object.entries(line).map(([key, value]) => [key, money(value, c)])),
    advertisingBurden,
  };
}
