import { getShopifyConfig, assertShopDomain } from './config';
import { fetchShopifyOrders, fetchShopifyProducts, normalizeShopifyOrders } from './client';
import { reconcileShopifyOrders } from '@/lib/commerce/reconcile';
import type { SyncSummary } from '@/lib/commerce/types';

export type LiveShopifySync = {
  summary: SyncSummary;
  reconciliation: ReturnType<typeof reconcileShopifyOrders>;
};

function requireConfiguredToken() {
  const config = getShopifyConfig();
  const shop = process.env.SHOPIFY_SHOP_DOMAIN;
  const token = process.env.SHOPIFY_OFFLINE_ACCESS_TOKEN;
  if (!shop || !token) {
    throw new Error('Live Shopify sync requires server-side SHOPIFY_SHOP_DOMAIN and SHOPIFY_OFFLINE_ACCESS_TOKEN. No mock fallback is used.');
  }
  return { shop: assertShopDomain(shop), token };
}

export async function runConfiguredShopifySync(): Promise<LiveShopifySync> {
  const { shop, token } = requireConfiguredToken();
  const startedAt = new Date().toISOString();
  const [orders, products] = await Promise.all([
    fetchShopifyOrders(shop, token),
    fetchShopifyProducts(shop, token),
  ]);
  const canonicalOrders = normalizeShopifyOrders(shop, `shopify:${shop}`, orders);
  const reconciliation = reconcileShopifyOrders(canonicalOrders);
  const summary: SyncSummary = {
    provider: 'shopify',
    storeDomain: shop,
    orders: canonicalOrders.filter((order) => !order.test).length,
    orderLines: canonicalOrders.reduce((sum, order) => sum + order.lines.length, 0),
    products: products.length,
    variants: products.reduce((sum, product) => sum + product.variants.length, 0),
    inventories: products.reduce((sum, product) => sum + product.variants.filter((variant) => Number.isFinite(variant.inventoryQuantity)).length, 0),
    refunds: canonicalOrders.filter((order) => (order.totalRefunded?.amount ?? 0) > 0).length,
    rejected: 0,
    status: 'SYNCED',
    startedAt,
    completedAt: new Date().toISOString(),
    limitations: [
      'This first vertical slice reads orders/products/inventory from Shopify but does not invent COGS, ads, third-party fees, or settlement values that Shopify has not exposed to the selected query.',
      'Production multi-merchant persistence and per-merchant identity require a database and user-auth layer; this ZIP does not contain one, so OAuth callback refuses to persist tokens rather than storing them insecurely.',
    ],
  };
  return { summary, reconciliation };
}
