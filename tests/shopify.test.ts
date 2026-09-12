import { describe, expect, it } from 'vitest';
import { normalizeShopifyOrders } from '@/lib/integrations/shopify/client';
import { reconcileShopifyOrders } from '@/lib/commerce/reconcile';
import { assertShopDomain } from '@/lib/integrations/shopify/config';

describe('Shopify connector', () => {
  it('normalizes money without inventing currency conversion', () => {
    const orders = normalizeShopifyOrders('demo.myshopify.com', 'shopify:demo.myshopify.com', [{
      id: 'gid://shopify/Order/1', name: '#1001', createdAt: '2026-09-12T10:00:00Z', updatedAt: '2026-09-12T10:05:00Z', processedAt: '2026-09-12T10:01:00Z', currencyCode: 'INR', test: false,
      displayFinancialStatus: 'PAID', displayFulfillmentStatus: 'FULFILLED',
      totalPriceSet: { shopMoney: { amount: '999.00', currencyCode: 'INR' } },
      subtotalPriceSet: { shopMoney: { amount: '900.00', currencyCode: 'INR' } },
      totalShippingPriceSet: { shopMoney: { amount: '99.00', currencyCode: 'INR' } },
      totalTaxSet: { shopMoney: { amount: '0', currencyCode: 'INR' } },
      totalDiscountsSet: { shopMoney: { amount: '0', currencyCode: 'INR' } },
      totalRefundedSet: { shopMoney: { amount: '100.00', currencyCode: 'INR' } },
      lineItems: { nodes: [{ id: 'line-1', title: 'SKU-A', quantity: 1, sku: 'SKU-A', originalUnitPriceSet: { shopMoney: { amount: '900', currencyCode: 'INR' } }, discountedTotalSet: { shopMoney: { amount: '900', currencyCode: 'INR' } }, variant: { id: 'variant-1', sku: 'SKU-A' } }] }
    }]);
    expect(orders[0].currency).toBe('INR');
    expect(orders[0].totalPrice?.amount).toBe(999);
    expect(orders[0].totalRefunded?.amount).toBe(100);
  });

  it('keeps reconciliation conservative when COGS/fees are missing', () => {
    const orders = normalizeShopifyOrders('demo.myshopify.com', 'shopify:demo.myshopify.com', [{
      id: 'gid://shopify/Order/1', name: '#1001', createdAt: '2026-09-12T10:00:00Z', updatedAt: '2026-09-12T10:05:00Z', processedAt: '2026-09-12T10:01:00Z', currencyCode: 'INR', test: false,
      totalPriceSet: { shopMoney: { amount: '999', currencyCode: 'INR' } }, subtotalPriceSet: null, totalShippingPriceSet: null, totalTaxSet: null, totalDiscountsSet: null, totalRefundedSet: { shopMoney: { amount: '0', currencyCode: 'INR' } },
      lineItems: { nodes: [] }
    }]);
    const result = reconcileShopifyOrders(orders);
    expect(result.status).toBe('PARTIALLY_MATCHED');
    expect(result.netCashBeforeUnmappedCosts).toBe(999);
    expect(result.reason).toContain('COGS');
  });

  it('rejects non-myshopify domains', () => {
    expect(() => assertShopDomain('https://example.com')).toThrow();
    expect(assertShopDomain('https://demo.myshopify.com/')).toBe('demo.myshopify.com');
  });
});
