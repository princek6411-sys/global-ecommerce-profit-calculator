export type ProfitLeak = { key: string; label: string; amount: number; share: number };

export function getProfitLeaks(line: Record<string, number>): ProfitLeak[] {
  const labels: Record<string, string> = {
    product: 'Product cost', platform: 'Marketplace fee', payment: 'Payment fee', shipping: 'Shipping', packaging: 'Packaging',
    advertising: 'Advertising', affiliate: 'Affiliate', discount: 'Discounts', returns: 'Returns', rto: 'RTO', tax: 'Tax', other: 'Other'
  };
  const rows = Object.entries(line).filter(([key]) => key !== 'revenue' && Number.isFinite(line[key]) && line[key] > 0);
  const total = rows.reduce((sum, [, amount]) => sum + amount, 0);
  return rows.map(([key, amount]) => ({ key, label: labels[key] ?? key, amount, share: total > 0 ? (amount / total) * 100 : 0 })).sort((a, b) => b.amount - a.amount);
}

export function calculateDataConfidence(args: {
  feeStatus: 'example' | 'official' | 'user-defined' | 'estimated' | 'unavailable' | 'stale';
  fxStatus: 'same' | 'fresh' | 'stale' | 'unavailable';
  enabledCosts: number;
  missingInputs: number;
}) {
  let score = 100;
  if (args.feeStatus === 'example') score -= 25;
  if (args.feeStatus === 'estimated') score -= 30;
  if (args.feeStatus === 'unavailable') score -= 40;
  if (args.feeStatus === 'stale') score -= 20;
  if (args.fxStatus === 'stale') score -= 15;
  if (args.fxStatus === 'unavailable') score -= 25;
  score -= Math.min(20, args.missingInputs * 8);
  score -= Math.min(10, Math.max(0, args.enabledCosts - 7));
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, label: score >= 80 ? 'High' : score >= 55 ? 'Medium' : 'Low' } as const;
}
