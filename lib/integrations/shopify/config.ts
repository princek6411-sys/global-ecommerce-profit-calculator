const REQUIRED = ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET'] as const;

export type ShopifyRuntimeConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  apiVersion: string;
  configured: boolean;
  tokenConfigured: boolean;
  shopConfigured: boolean;
  persistenceConfigured: boolean;
};

export function getShopifyConfig(): ShopifyRuntimeConfig {
  const clientId = process.env.SHOPIFY_API_KEY ?? '';
  const clientSecret = process.env.SHOPIFY_API_SECRET ?? '';
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI ?? '';
  const scopes = (process.env.SHOPIFY_SCOPES ?? 'read_orders,read_products,read_inventory,read_locations').split(',').map((v: string) => v.trim()).filter(Boolean);
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? '2026-07';
  const tokenConfigured = Boolean(process.env.SHOPIFY_OFFLINE_ACCESS_TOKEN);
  const shopConfigured = Boolean(process.env.SHOPIFY_SHOP_DOMAIN);
  const persistenceConfigured = process.env.PROFITPILOT_CONNECTION_STORE === 'database';

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes,
    apiVersion,
    configured: REQUIRED.every((key) => Boolean(process.env[key])) && Boolean(redirectUri),
    tokenConfigured,
    shopConfigured,
    persistenceConfigured,
  };
}

export function assertShopDomain(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!/^[a-z0-9][a-z0-9-.-]*\.myshopify\.com$/.test(normalized)) {
    throw new Error('Invalid Shopify shop domain. Use the *.myshopify.com domain.');
  }
  return normalized;
}

export const SHOPIFY_AUTH_BLOCK_MESSAGE =
  'Shopify credentials are not fully configured. This implementation refuses to simulate a live connection.';
