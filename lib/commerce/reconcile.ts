import type { CanonicalOrder } from '@/lib/commerce/types';

export type ReconciliationStatus =
  | 'MATCHED'
  | 'PARTIALLY_MATCHED'
  | 'UNMATCHED'
  | 'UNCLASSIFIED'
  | 'PENDING'
  | 'DATA_DELAY'
  | 'SOURCE_CONFLICT';

export type ReconciliationResult = {
  status: ReconciliationStatus;
  grossRevenue: number;
  refunds: number;
  taxes: number;
  shipping: number;
  netCashBeforeUnmappedCosts: number;
  unmappedMoney: number;
  reason: string;
};

/**
 * Conservative reconciliation for Shopify orders.
 * It deliberately does not invent marketplace fees, ad spend, or COGS because
 * those are not guaranteed to be present in the Shopify order object.
 */
export function reconcileShopifyOrders(orders: CanonicalOrder[]): ReconciliationResult {
  let grossRevenue = 0;
  let refunds = 0;
  let taxes = 0;
  let shipping = 0;

  for (const order of orders) {
    grossRevenue += order.totalPrice?.amount ?? 0;
    refunds += order.totalRefunded?.amount ?? 0;
    taxes += order.totalTax?.amount ?? 0;
    shipping += order.totalShipping?.amount ?? 0;
  }

  const netCashBeforeUnmappedCosts = grossRevenue - refunds;
  const status: ReconciliationStatus = orders.length === 0
    ? 'PENDING'
    : 'PARTIALLY_MATCHED';

  return {
    status,
    grossRevenue,
    refunds,
    taxes,
    shipping,
    netCashBeforeUnmappedCosts,
    unmappedMoney: 0,
    reason: 'Shopify order data can establish sales/refund context, but COGS, advertising, marketplace-specific fees and some settlement economics require additional source data.'
  };
}
