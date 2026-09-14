import type { CalculationResult } from '@/lib/calculation-engine';
import type { CSVAnalysis } from '@/lib/csv';
import type { CurrencyCode } from '@/lib/config';
import { buildLedgerFromCalculation, ledgerDebitTotal, type EconomicLedgerEntry } from '@/lib/commerce/ledger';
import { buildEconomicActionFromCosts, type EconomicAction } from '@/lib/commerce/actions';
import { deriveEconomicAlerts, type EconomicAlert } from '@/lib/commerce/monitoring';
import { sourceProvenance, type SourceProvenance } from '@/lib/commerce/provenance';

export type EconomicMetricStatus = 'VERIFIED_SOURCE' | 'USER_PROVIDED' | 'CALCULATED' | 'ESTIMATED' | 'SCENARIO' | 'UNAVAILABLE' | 'UNCLASSIFIED' | 'STALE' | 'MOCKED';

export type EconomicMetric = {
  amount: number;
  currency: string;
  status: EconomicMetricStatus;
  source?: string;
  note?: string;
};

export type EconomicSnapshot = {
  id: string;
  currency: string;
  source: string;
  freshness: 'LIVE' | 'RECENT' | 'STALE' | 'STATIC';
  confidence: number;
  revenue: EconomicMetric;
  recognizedCosts: EconomicMetric;
  settlement?: EconomicMetric;
  settlementVariance?: EconomicMetric;
  profit: EconomicMetric;
  margin: number;
  ledger: EconomicLedgerEntry[];
  provenance: SourceProvenance;
  dataQuality: {
    complete: boolean;
    missing: string[];
    unclassifiedAmount: number;
  };
};

const now = () => new Date().toISOString();

export function buildEconomicSnapshotFromCalculation(result: CalculationResult, options?: {
  source?: string;
  status?: EconomicMetricStatus;
  confidence?: number;
  note?: string;
}): EconomicSnapshot {
  const createdAt = now();
  const status = options?.status ?? 'CALCULATED';
  const provenance = sourceProvenance({
    kind: status,
    effectiveAt: createdAt,
    confidence: options?.confidence ?? 0.9,
    note: options?.note ?? 'Derived from the existing canonical ProfitPilot calculation engine.'
  });
  const ledger = buildLedgerFromCalculation(result, provenance);
  const recognizedCosts = ledgerDebitTotal(ledger);
  return {
    id: `calc:${createdAt}`,
    currency: result.currency,
    source: options?.source ?? 'ProfitPilot calculation engine',
    freshness: 'STATIC',
    confidence: options?.confidence ?? 0.9,
    revenue: { amount: result.revenue.amount, currency: result.currency, status, source: options?.source, note: options?.note },
    recognizedCosts: { amount: recognizedCosts, currency: result.currency, status, source: options?.source },
    profit: { amount: result.trueProfit.amount, currency: result.currency, status, source: options?.source },
    margin: result.margin,
    ledger,
    provenance,
    dataQuality: { complete: true, missing: [], unclassifiedAmount: ledger.filter((e) => e.category === 'unclassified').reduce((s, e) => s + Math.abs(e.amount.amount), 0) }
  };
}

export function buildEconomicSnapshotFromCSV(analysis: CSVAnalysis): EconomicSnapshot {
  const currency = analysis.sourceCurrency || 'UNKNOWN';
  const createdAt = now();
  const unclassified = analysis.totals.unmappedDeductions + Math.abs(analysis.totals.settlementDifference);
  const status: EconomicMetricStatus = analysis.issues.length || unclassified > 0 ? 'UNCLASSIFIED' : 'VERIFIED_SOURCE';
  const confidence = status === 'VERIFIED_SOURCE' ? 0.92 : 0.72;
  const provenance = sourceProvenance({
    kind: status,
    effectiveAt: createdAt,
    confidence,
    source: 'seller-settlement-csv',
    note: 'Parsed from a seller-provided settlement CSV in the browser.'
  });

  const ledger: EconomicLedgerEntry[] = [];
  const push = (id: string, category: EconomicLedgerEntry['category'], amount: number, direction: 'CREDIT' | 'DEBIT', description: string) => {
    if (!Number.isFinite(amount) || amount === 0) return;
    ledger.push({
      id,
      category,
      amount: { amount, currency: currency as CurrencyCode },
      direction,
      provenance,
      description
    });
  };
  push(`csv:revenue:${createdAt}`, 'revenue', analysis.totals.revenue, 'CREDIT', 'Revenue reported by the imported settlement file.');
  push(`csv:fees:${createdAt}`, 'marketplace_fee', analysis.deductionBuckets.fees, 'DEBIT', 'Recognized marketplace fees from mapped CSV fields.');
  push(`csv:shipping:${createdAt}`, 'shipping', analysis.deductionBuckets.shipping, 'DEBIT', 'Recognized shipping/logistics costs from mapped CSV fields.');
  push(`csv:ads:${createdAt}`, 'advertising', analysis.deductionBuckets.ads, 'DEBIT', 'Recognized advertising spend from mapped CSV fields.');
  push(`csv:return:${createdAt}`, 'returns', analysis.deductionBuckets.returnCost, 'DEBIT', 'Recognized return costs.');
  push(`csv:rto:${createdAt}`, 'rto', analysis.deductionBuckets.rtoCost, 'DEBIT', 'Recognized RTO costs.');
  push(`csv:tax:${createdAt}`, 'tax', analysis.deductionBuckets.taxes, 'DEBIT', 'Recognized taxes/withholding fields.');
  push(`csv:other:${createdAt}`, 'other', analysis.deductionBuckets.other, 'DEBIT', 'Recognized other/adjustment costs.');
  push(`csv:cogs:${createdAt}`, 'cogs', analysis.skuSummary.reduce((s: number, row: { cogs: number }) => s + row.cogs, 0), 'DEBIT', 'Product cost/COGS from seller-provided data.');
  if (analysis.totals.unmappedDeductions > 0) push(`csv:unmapped:${createdAt}`, 'unclassified', analysis.totals.unmappedDeductions, 'DEBIT', 'Source deductions could not be confidently mapped to a recognized economic category.');
  if (analysis.totals.settlementDifference !== 0) push(`csv:settlement-variance:${createdAt}`, 'settlement_adjustment', analysis.totals.settlementDifference, analysis.totals.settlementDifference < 0 ? 'DEBIT' : 'CREDIT', 'Settlement variance remains separate from profit.');

  const profit = analysis.totals.profit;
  return {
    id: `csv:${createdAt}`,
    currency,
    source: 'Seller settlement CSV',
    freshness: 'RECENT',
    confidence,
    revenue: { amount: analysis.totals.revenue, currency, status, source: 'CSV', note: 'Seller-provided settlement export.' },
    recognizedCosts: { amount: analysis.totals.recognizedCosts + analysis.skuSummary.reduce((s: number, row: { cogs: number }) => s + row.cogs, 0), currency, status, source: 'CSV mapped fields' },
    settlement: { amount: analysis.totals.actualPayout, currency, status, source: 'CSV payout field' },
    settlementVariance: { amount: analysis.totals.settlementDifference, currency, status: analysis.totals.settlementDifference === 0 ? 'CALCULATED' : 'UNCLASSIFIED', source: 'CSV reconciliation' },
    profit: { amount: profit, currency, status: 'ESTIMATED', source: 'Actual settlement minus product cost', note: 'Not a complete P&L when costs are missing or unmapped.' },
    margin: analysis.totals.revenue === 0 ? 0 : (profit / analysis.totals.revenue) * 100,
    ledger,
    provenance,
    dataQuality: {
      complete: analysis.issues.length === 0 && unclassified === 0,
      missing: analysis.unmappedFields.concat(analysis.issues),
      unclassifiedAmount: unclassified
    }
  };
}

export function deriveEconomicDecision(snapshot: EconomicSnapshot): { action: EconomicAction | null; alerts: EconomicAlert[] } {
  const costByCategory = new Map<string, number>();
  for (const entry of snapshot.ledger) {
    if (entry.category === 'revenue' || entry.category === 'discount' || entry.category === 'settlement_adjustment' || entry.category === 'unclassified') continue;
    costByCategory.set(entry.category, (costByCategory.get(entry.category) ?? 0) + Math.abs(entry.amount.amount));
  }
  const labelMap: Record<string, string> = { cogs: 'Product cost', marketplace_fee: 'Marketplace fee', payment_fee: 'Payment fee', fulfillment: 'Fulfillment', shipping: 'Shipping', packaging: 'Packaging', advertising: 'Advertising', affiliate: 'Affiliate', returns: 'Returns', rto: 'RTO', tax: 'Tax', other: 'Other' };
  const controlLevel = (key: string): EconomicAction['controlLevel'] =>
    ['advertising', 'shipping', 'packaging'].includes(key) ? 'CONTROLLABLE'
      : ['cogs', 'returns', 'rto'].includes(key) ? 'PARTIALLY_CONTROLLABLE'
      : ['marketplace_fee', 'tax'].includes(key) ? 'EXTERNAL'
      : 'UNKNOWN';
  const action = buildEconomicActionFromCosts({
    revenue: snapshot.revenue.amount,
    currency: snapshot.currency,
    costs: [...costByCategory.entries()].map(([key, amount]) => ({
      label: labelMap[key] ?? key,
      key,
      amount,
      controlLevel: controlLevel(key),
      action: key === 'advertising' ? 'Test a modest reduction in advertising spend and compare contribution profit.' : key === 'shipping' ? 'Compare fulfillment/shipping options and recalculate contribution profit.' : key === 'cogs' ? 'Test a lower landed/unit cost or supplier quote.' : key === 'returns' ? 'Review the largest preventable return driver before changing multiple variables.' : key === 'rto' ? 'Review RTO drivers and test a preventable operational change.' : key === 'marketplace_fee' ? 'Verify the current seller fee configuration or compare channels.' : 'Review the driver and test the most controllable lever available.'
    }))
  });
  const alerts = deriveEconomicAlerts({
    profit: snapshot.profit.amount,
    margin: snapshot.margin,
    settlementVariance: snapshot.settlementVariance?.amount,
    dataFreshnessMinutes: snapshot.freshness === 'STALE' ? 9999 : undefined,
    unclassifiedAmount: snapshot.dataQuality.unclassifiedAmount
  });
  return { action, alerts };
}
