import { describe, expect, it } from 'vitest';
import { calculateAll } from '@/lib/calculation-engine';
import { buildEconomicSnapshotFromCalculation, deriveEconomicDecision } from '@/lib/commerce/economic-core';
import { createExperiment, recordExperimentOutcome } from '@/lib/commerce/experiments';
import { reconcileAmounts, reconcileShopifyOrders } from '@/lib/commerce/reconcile';
import { reconcileSettlementToPayout } from '@/lib/commerce/reconciliation-engine';
import { getIntegrationAdapter } from '@/lib/integrations/registry';

const input = {
  sellingPrice: 1000,
  quantity: 1,
  productCost: 300,
  discount: { enabled: false, value: 0, mode: 'percent' as const },
  platformFee: { enabled: true, value: 100, mode: 'fixed' as const },
  paymentFee: { enabled: true, value: 20, mode: 'fixed' as const },
  shipping: { enabled: true, value: 50, mode: 'fixed' as const },
  packaging: { enabled: false, value: 0, mode: 'fixed' as const },
  advertising: { enabled: true, value: 100, mode: 'fixed' as const },
  affiliate: { enabled: false, value: 0, mode: 'fixed' as const },
  returns: { enabled: false, value: 0, mode: 'percent' as const },
  rto: { enabled: false, value: 0, mode: 'percent' as const },
  tax: { enabled: false, value: 0, mode: 'percent' as const },
  other: { enabled: false, value: 0, mode: 'fixed' as const },
};

describe('ProfitPilot economic intelligence core', () => {
  it('keeps one canonical calculation source and attaches provenance', () => {
    const result = calculateAll(input, 'INR');
    const snapshot = buildEconomicSnapshotFromCalculation(result);
    expect(snapshot.profit.amount).toBe(result.trueProfit.amount);
    expect(snapshot.provenance.kind).toBe('CALCULATED');
    expect(snapshot.ledger.length).toBeGreaterThan(1);
  });

  it('derives a deterministic actionable next step from economic evidence', () => {
    const snapshot = buildEconomicSnapshotFromCalculation(calculateAll(input, 'INR'));
    const decision = deriveEconomicDecision(snapshot);
    expect(decision.action).not.toBeNull();
    expect(decision.action?.evidence).toContain('INR');
  });

  it('never invents reconciliation when the expected and actual values differ', () => {
    const diff = reconcileAmounts({ key: 'settlement-1', expected: { amount: 1000, currency: 'INR' }, actual: { amount: 920, currency: 'INR' } });
    expect(diff.status).toBe('UNCLASSIFIED');
    expect(diff.amount).toBe(-80);
  });

  it('reconciles a settlement to a payout without turning the difference into profit', () => {
    const result = reconcileSettlementToPayout({ id: 'set-1', storeId: 'store-1', statementId: 'stmt-1', expected: { amount: 1000, currency: 'INR' } }, { id: 'pay-1', storeId: 'store-1', settlementId: 'set-1', amount: { amount: 920, currency: 'INR' } });
    expect(result.status).toBe('UNCLASSIFIED');
    expect(result.difference?.amount).toBe(-80);
  });

  it('keeps research-only platforms from pretending to be live', async () => {
    const adapter = getIntegrationAdapter('Amazon');
    expect(adapter?.descriptor.integrationState).toBe('RESEARCH_ONLY');
    expect(await adapter?.adapter.getConnectionStatus()).toBe('NOT_CONNECTED');
  });

  it('supports an honest local experiment lifecycle', () => {
    const experiment = createExperiment({ hypothesis: 'Reduce ads to improve contribution margin.', baselineProfit: 100, baselineMargin: 10, expectedProfit: 115, proposedChange: 'Ad spend -10%.' });
    const completed = recordExperimentOutcome(experiment, { observedProfit: 125, observedMargin: 12.5, learning: 'Profit improved after the real change.' });
    expect(completed.status).toBe('COMPLETED');
    expect(completed.result).toBe('POSITIVE');
  });
});
