import type { CanonicalOrder, MoneyValue } from '@/lib/commerce/types';

export type ReconciliationStatus =
  | 'MATCHED'
  | 'PARTIALLY_MATCHED'
  | 'UNMATCHED'
  | 'UNCLASSIFIED'
  | 'PENDING'
  | 'DATA_DELAY'
  | 'SOURCE_CONFLICT'
  | 'DUPLICATE'
  | 'INVALID'
  | 'STALE';

export type ReconciliationDifference = {
  key: string;
  amount: number;
  currency: string;
  status: ReconciliationStatus;
  reason: string;
};

export type ReconciliationResult = {
  status: ReconciliationStatus;
  grossRevenue: number;
  refunds: number;
  taxes: number;
  shipping: number;
  netCashBeforeUnmappedCosts: number;
  unmappedMoney: number;
  expectedPayout?: number;
  actualPayout?: number;
  differences?: ReconciliationDifference[];
  reason: string;
};

export function reconcileAmounts(input: {
  expected: MoneyValue;
  actual?: MoneyValue;
  key: string;
  missingReason?: string;
}): ReconciliationDifference {
  if (!input.actual) {
    return { key: input.key, amount: input.expected.amount, currency: input.expected.currency, status: 'PENDING', reason: input.missingReason ?? 'Actual financial evidence is not available.' };
  }
  if (input.actual.currency !== input.expected.currency) {
    return { key: input.key, amount: input.actual.amount - input.expected.amount, currency: input.actual.currency, status: 'SOURCE_CONFLICT', reason: 'Expected and actual amounts use different currencies.' };
  }
  const delta = input.actual.amount - input.expected.amount;
  if (Math.abs(delta) < 0.000001) return { key: input.key, amount: 0, currency: input.actual.currency, status: 'MATCHED', reason: 'Expected and actual values match.' };
  return { key: input.key, amount: delta, currency: input.actual.currency, status: 'UNCLASSIFIED', reason: 'A difference exists, but the supplied evidence is insufficient to classify it safely.' };
}

export function reconcileShopifyOrders(orders: CanonicalOrder[]): ReconciliationResult {
  let grossRevenue = 0;
  let refunds = 0;
  let taxes = 0;
  let shipping = 0;
  const currencies = new Set<string>();
  for (const order of orders) {
    grossRevenue += order.totalPrice?.amount ?? 0;
    refunds += order.totalRefunded?.amount ?? 0;
    taxes += order.totalTax?.amount ?? 0;
    shipping += order.totalShipping?.amount ?? 0;
    currencies.add(order.currency);
  }
  const netCashBeforeUnmappedCosts = grossRevenue - refunds;
  const status: ReconciliationStatus = orders.length === 0 ? 'PENDING' : currencies.size > 1 ? 'SOURCE_CONFLICT' : 'PARTIALLY_MATCHED';
  return {
    status,
    grossRevenue,
    refunds,
    taxes,
    shipping,
    netCashBeforeUnmappedCosts,
    unmappedMoney: 0,
    reason: 'Order-level Shopify data establishes sales/refund context. COGS, ad spend, marketplace-specific fees and seller settlement economics remain unclassified unless additional evidence is supplied.'
  };
}
