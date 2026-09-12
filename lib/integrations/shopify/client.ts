import type { CanonicalOrder, CanonicalProduct, CanonicalVariant } from '@/lib/commerce/types';
import { getShopifyConfig, assertShopDomain } from './config';

export type ShopifyPageInfo = { hasNextPage: boolean; endCursor: string | null };

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
};

async function shopifyGraphql<T>(shop: string, accessToken: string, query: string, variables?: Record<string, unknown>): Promise<T> {
  const config = getShopifyConfig();
  const response = await fetch(`https://${assertShopDomain(shop)}/admin/api/${config.apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const body = await response.json() as GraphQLResponse<T>;
  if (!response.ok) throw new Error(`Shopify GraphQL HTTP ${response.status}.`);
  if (body.errors?.length) throw new Error(`Shopify GraphQL: ${body.errors[0].message}`);
  if (!body.data) throw new Error('Shopify GraphQL returned no data.');
  return body.data;
}

export type ShopifyOrderNode = {
  id: string;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string;
  currencyCode: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  subtotalPriceSet: { shopMoney: { amount: string; currencyCode: string } } | null;
  totalShippingPriceSet: { shopMoney: { amount: string; currencyCode: string } } | null;
  totalTaxSet: { shopMoney: { amount: string; currencyCode: string } } | null;
  totalDiscountsSet: { shopMoney: { amount: string; currencyCode: string } } | null;
  totalRefundedSet: { shopMoney: { amount: string; currencyCode: string } } | null;
  test: boolean;
  displayFinancialStatus?: string | null;
  displayFulfillmentStatus?: string | null;
  lineItems: { nodes: Array<{ id: string; title: string; quantity: number; sku?: string | null; originalUnitPriceSet: { shopMoney: { amount: string; currencyCode: string } } | null; discountedTotalSet: { shopMoney: { amount: string; currencyCode: string } } | null; variant?: { id: string; sku?: string | null } | null }> };
};

const ORDER_QUERY = `#graphql
  query OrdersPage($first: Int!, $after: String) {
    orders(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id name createdAt updatedAt processedAt currencyCode test
        displayFinancialStatus displayFulfillmentStatus
        totalPriceSet { shopMoney { amount currencyCode } }
        subtotalPriceSet { shopMoney { amount currencyCode } }
        totalShippingPriceSet { shopMoney { amount currencyCode } }
        totalTaxSet { shopMoney { amount currencyCode } }
        totalDiscountsSet { shopMoney { amount currencyCode } }
        totalRefundedSet { shopMoney { amount currencyCode } }
        lineItems(first: 250) {
          nodes {
            id title quantity sku
            originalUnitPriceSet { shopMoney { amount currencyCode } }
            discountedTotalSet { shopMoney { amount currencyCode } }
            variant { id sku }
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query ProductsPage($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id title handle status
        variants(first: 250) { nodes { id sku price inventoryQuantity } }
      }
    }
  }
`;

async function page<T>(shop: string, accessToken: string, query: string, variables: Record<string, unknown>, selector: (data: any) => { nodes: T[]; pageInfo: ShopifyPageInfo }): Promise<{ nodes: T[]; pageInfo: ShopifyPageInfo }> {
  const data = await shopifyGraphql<any>(shop, accessToken, query, variables);
  return selector(data);
}

export async function fetchShopifyOrders(shop: string, accessToken: string, maxPages = 5): Promise<ShopifyOrderNode[]> {
  const results: ShopifyOrderNode[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < maxPages; i += 1) {
    const result = await page<ShopifyOrderNode>(shop, accessToken, ORDER_QUERY, { first: 100, after: cursor }, (data) => data.orders);
    results.push(...result.nodes);
    if (!result.pageInfo.hasNextPage) break;
    cursor = result.pageInfo.endCursor;
  }
  return results;
}

export async function fetchShopifyProducts(shop: string, accessToken: string, maxPages = 5): Promise<Array<{ id: string; title: string; handle: string; status: string; variants: Array<{ id: string; sku: string | null; price: string; inventoryQuantity: number }> }>> {
  const results: Array<{ id: string; title: string; handle: string; status: string; variants: Array<{ id: string; sku: string | null; price: string; inventoryQuantity: number }> }> = [];
  let cursor: string | null = null;
  for (let i = 0; i < maxPages; i += 1) {
    const result = await page<any>(shop, accessToken, PRODUCT_QUERY, { first: 100, after: cursor }, (data) => data.products);
    results.push(...result.nodes);
    if (!result.pageInfo.hasNextPage) break;
    cursor = result.pageInfo.endCursor;
  }
  return results;
}

export function normalizeShopifyOrders(shop: string, storeId: string, orders: ShopifyOrderNode[]): CanonicalOrder[] {
  return orders.map((order) => ({
    id: `shopify:${shop}:order:${order.id}`,
    storeId,
    externalId: order.id,
    name: order.name ?? undefined,
    processedAt: order.processedAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    currency: order.currencyCode,
    totalPrice: { amount: Number(order.totalPriceSet.shopMoney.amount), currency: order.totalPriceSet.shopMoney.currencyCode },
    subtotal: order.subtotalPriceSet ? { amount: Number(order.subtotalPriceSet.shopMoney.amount), currency: order.subtotalPriceSet.shopMoney.currencyCode } : undefined,
    totalShipping: order.totalShippingPriceSet ? { amount: Number(order.totalShippingPriceSet.shopMoney.amount), currency: order.totalShippingPriceSet.shopMoney.currencyCode } : undefined,
    totalTax: order.totalTaxSet ? { amount: Number(order.totalTaxSet.shopMoney.amount), currency: order.totalTaxSet.shopMoney.currencyCode } : undefined,
    totalDiscounts: order.totalDiscountsSet ? { amount: Number(order.totalDiscountsSet.shopMoney.amount), currency: order.totalDiscountsSet.shopMoney.currencyCode } : undefined,
    totalRefunded: order.totalRefundedSet ? { amount: Number(order.totalRefundedSet.shopMoney.amount), currency: order.totalRefundedSet.shopMoney.currencyCode } : undefined,
    paymentState: order.displayFinancialStatus ?? undefined,
    fulfillmentState: order.displayFulfillmentStatus ?? undefined,
    test: order.test,
    lines: order.lineItems.nodes.map((line) => ({
      id: `shopify:${shop}:line:${line.id}`,
      orderId: `shopify:${shop}:order:${order.id}`,
      variantId: line.variant?.id,
      sku: line.sku ?? line.variant?.sku ?? undefined,
      title: line.title,
      quantity: line.quantity,
      unitPrice: line.originalUnitPriceSet ? { amount: Number(line.originalUnitPriceSet.shopMoney.amount), currency: line.originalUnitPriceSet.shopMoney.currencyCode } : undefined,
      lineRevenue: line.discountedTotalSet ? { amount: Number(line.discountedTotalSet.shopMoney.amount), currency: line.discountedTotalSet.shopMoney.currencyCode } : undefined,
    })),
  }));
}

export type { CanonicalOrder, CanonicalProduct, CanonicalVariant };
