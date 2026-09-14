import type { MoneyValue, CanonicalOrder, CanonicalSettlement, CanonicalPayout, CanonicalTransaction, CanonicalFee } from '@/lib/commerce/types';
import { reconcileAmounts, type ReconciliationDifference, type ReconciliationStatus } from '@/lib/commerce/reconcile';

export type OrderEconomicReconciliation = {
  orderId: string;
  revenue: number;
  refund: number;
  fees: number;
  netTransaction: number;
  status: ReconciliationStatus;
  differences: ReconciliationDifference[];
};

export type SettlementReconciliation = {
  settlementId: string;
  status: ReconciliationStatus;
  expected?: MoneyValue;
  actual?: MoneyValue;
  difference?: ReconciliationDifference;
};

export function reconcileOrderEconomicEvidence(input: {
  order: CanonicalOrder;
  transactions: CanonicalTransaction[];
  fees: CanonicalFee[];
}): OrderEconomicReconciliation {
  const revenue = input.order.totalPrice?.amount ?? 0;
  const refunds = input.transactions.filter((t) => t.type === 'REFUND').reduce((sum, t) => sum + Math.abs(t.amount.amount), 0);
  const fees = input.fees.reduce((sum, f) => sum + Math.abs(f.amount.amount), 0);
  const transactionNet = input.transactions.filter((t) => t.type === 'PAYMENT' || t.type === 'REFUND').reduce((sum, t) => sum + t.amount.amount, 0);
  const differences: ReconciliationDifference[] = [];
  const paymentDifference = reconcileAmounts({
    key: `${input.order.id}:payment`,
    expected: { amount: revenue - refunds, currency: input.order.currency },
    actual: { amount: transactionNet, currency: input.order.currency },
    missingReason: 'No transaction set supplied for this order.'
  });
  differences.push(paymentDifference);
  const status = differences.every((d) => d.status === 'MATCHED') ? 'MATCHED' : differences.some((d) => d.status === 'SOURCE_CONFLICT') ? 'SOURCE_CONFLICT' : 'UNCLASSIFIED';
  return { orderId: input.order.id, revenue, refund: refunds, fees, netTransaction: transactionNet, status, differences };
}

export function reconcileSettlementToPayout(settlement: CanonicalSettlement, payout?: CanonicalPayout): SettlementReconciliation {
  if (!settlement.expected || !payout) return { settlementId: settlement.id, status: 'PENDING', expected: settlement.expected, actual: payout?.amount };
  const difference = reconcileAmounts({ key: settlement.id, expected: settlement.expected, actual: payout.amount });
  return { settlementId: settlement.id, status: difference.status, expected: settlement.expected, actual: payout.amount, difference };
}
