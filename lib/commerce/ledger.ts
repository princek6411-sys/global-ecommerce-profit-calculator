import type { Money } from '@/lib/money';
import type { CalculationResult } from '@/lib/calculation-engine';
import type { SourceProvenance } from '@/lib/commerce/provenance';

export type EconomicCategory =
  | 'revenue' | 'discount' | 'refund' | 'cogs' | 'marketplace_fee' | 'payment_fee' | 'fulfillment' | 'shipping'
  | 'packaging' | 'advertising' | 'affiliate' | 'returns' | 'rto' | 'tax' | 'other' | 'settlement_adjustment' | 'unclassified';

export type EconomicLedgerEntry = {
  id: string;
  category: EconomicCategory;
  amount: Money;
  direction: 'CREDIT' | 'DEBIT';
  provenance: SourceProvenance;
  description: string;
};

const categoryMap: Record<string, EconomicCategory> = {
  product: 'cogs', discount: 'discount', platform: 'marketplace_fee', payment: 'payment_fee', shipping: 'shipping', packaging: 'packaging',
  advertising: 'advertising', affiliate: 'affiliate', returns: 'returns', rto: 'rto', tax: 'tax', other: 'other'
};

export function buildLedgerFromCalculation(result: CalculationResult, provenanceOrNote: SourceProvenance | string = 'Existing ProfitPilot calculation engine'): EconomicLedgerEntry[] {
  const createdAt = new Date().toISOString();
  const provenance: SourceProvenance = typeof provenanceOrNote === 'string'
    ? { kind: 'CALCULATED', effectiveAt: createdAt, confidence: 1, note: provenanceOrNote }
    : provenanceOrNote;
  const entries: EconomicLedgerEntry[] = [];
  entries.push({ id: `calc:revenue:${createdAt}`, category: 'revenue', amount: result.revenue, direction: 'CREDIT', provenance, description: 'Revenue from the canonical calculation result.' });
  for (const [key, value] of Object.entries(result.line) as Array<[string, Money]>) {
    if (key === 'revenue') continue;
    const amount = value.amount;
    if (!Number.isFinite(amount) || amount === 0) continue;
    const category = categoryMap[key] ?? 'unclassified';
    entries.push({ id: `calc:${key}:${createdAt}`, category, amount: value, direction: 'DEBIT', provenance, description: `Calculated ${key} component.` });
  }
  return entries;
}

export function ledgerDebitTotal(entries: EconomicLedgerEntry[]): number {
  return entries.filter((entry) => entry.direction === 'DEBIT').reduce((sum, entry) => sum + Math.abs(entry.amount.amount), 0);
}
