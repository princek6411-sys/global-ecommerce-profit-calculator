import { describe, expect, it } from 'vitest';
import { platformAdapterRegistry } from '@/lib/commerce/platform-adapters';
import { buildEconomicAction } from '@/lib/commerce/actions';
import { deriveEconomicAlerts } from '@/lib/commerce/monitoring';
import { calculateAll } from '@/lib/calculation-engine';

const baseInput = {
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

describe('economic architecture', () => {
  it('keeps a single adapter registry without pretending all platforms are live', () => {
    expect(Object.keys(platformAdapterRegistry)).toEqual(expect.arrayContaining(['Amazon', 'Shopify', 'eBay', 'Walmart', 'Etsy', 'Flipkart', 'Meesho', 'TikTok Shop']));
    expect(platformAdapterRegistry.Shopify.integrationState).toBe('PARTIAL_LIVE');
    expect(platformAdapterRegistry.Amazon.integrationState).toBe('RESEARCH_ONLY');
  });

  it('builds an evidence-backed action from the existing calculation engine', () => {
    const result = calculateAll(baseInput, 'INR');
    const action = buildEconomicAction(result);
    expect(action).not.toBeNull();
    expect(action?.trigger).toContain('Advertising');
    expect(action?.action).toContain('Test');
  });

  it('does not alert without a baseline', () => {
    expect(deriveEconomicAlerts({ profit: 100, margin: 10 })).toEqual([]);
  });

  it('detects material profit deterioration', () => {
    const alerts = deriveEconomicAlerts(
      { profit: 70, margin: 7 },
      { profit: 100, margin: 10 }
    );
    expect(alerts.some((alert) => alert.key === 'profit_drop')).toBe(true);
    expect(alerts.some((alert) => alert.key === 'margin_drop')).toBe(true);
  });
});
