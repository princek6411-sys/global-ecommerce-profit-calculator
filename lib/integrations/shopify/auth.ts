import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { assertShopDomain, getShopifyConfig } from './config';

const STATE_TTL_SECONDS = 10 * 60;

function base64Url(value: Buffer | string): string {
  return Buffer.from(value).toString('base64url');
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createShopifyState(shop: string): string {
  const config = getShopifyConfig();
  if (!config.clientSecret) throw new Error('SHOPIFY_API_SECRET is not configured.');
  const payload = JSON.stringify({ shop: assertShopDomain(shop), nonce: randomBytes(18).toString('base64url'), exp: Math.floor(Date.now() / 1000) + STATE_TTL_SECONDS });
  const body = base64Url(payload);
  return `${body}.${sign(body, config.clientSecret)}`;
}

export function verifyShopifyState(state: string): { shop: string; exp: number } {
  const config = getShopifyConfig();
  const [body, signature] = state.split('.');
  if (!body || !signature || !config.clientSecret) throw new Error('Invalid Shopify OAuth state.');
  const expected = sign(body, config.clientSecret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error('Invalid Shopify OAuth state signature.');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { shop?: string; exp?: number };
  if (!payload.shop || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Expired Shopify OAuth state.');
  return { shop: assertShopDomain(payload.shop), exp: payload.exp };
}

export function buildShopifyAuthorizationUrl(shop: string): string {
  const config = getShopifyConfig();
  if (!config.configured) throw new Error('Shopify OAuth is not configured.');
  const normalizedShop = assertShopDomain(shop);
  const state = createShopifyState(normalizedShop);
  const url = new URL(`https://${normalizedShop}/admin/oauth/authorize`);
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('scope', config.scopes.join(','));
  url.searchParams.set('redirect_uri', config.redirectUri);
  url.searchParams.set('state', state);
  return url.toString();
}

export async function exchangeShopifyCode(shop: string, code: string) {
  const config = getShopifyConfig();
  const normalizedShop = assertShopDomain(shop);
  if (!config.configured) throw new Error('Shopify OAuth is not configured.');
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    expiring: '1',
  });
  const response = await fetch(`https://${normalizedShop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  const data = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(`Shopify token exchange failed (${response.status}).`);
  if (typeof data.access_token !== 'string') throw new Error('Shopify did not return an access token.');
  return {
    shop: normalizedShop,
    accessToken: data.access_token,
    scope: typeof data.scope === 'string' ? data.scope : '',
    expiresIn: typeof data.expires_in === 'number' ? data.expires_in : null,
    refreshToken: typeof data.refresh_token === 'string' ? data.refresh_token : null,
    refreshTokenExpiresIn: typeof data.refresh_token_expires_in === 'number' ? data.refresh_token_expires_in : null,
  };
}
