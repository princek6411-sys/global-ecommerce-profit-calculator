import { NextResponse } from 'next/server';
import { exchangeShopifyCode, verifyShopifyState } from '@/lib/integrations/shopify/auth';
import { getShopifyConfig } from '@/lib/integrations/shopify/config';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const shop = url.searchParams.get('shop');
    if (!code || !state || !shop) {
      return NextResponse.json({ error: 'Missing Shopify OAuth callback parameters.' }, { status: 400 });
    }
    const cookieState = request.headers.get('cookie')?.match(/(?:^|; )profitpilot_shopify_oauth_state=([^;]+)/)?.[1];
    if (!cookieState || cookieState !== state) {
      return NextResponse.json({ error: 'Shopify OAuth state does not match the initiating browser session.' }, { status: 400 });
    }
    const verified = verifyShopifyState(state);
    if (verified.shop !== shop.toLowerCase()) {
      return NextResponse.json({ error: 'Shop mismatch in Shopify OAuth callback.' }, { status: 400 });
    }

    const token = await exchangeShopifyCode(verified.shop, code);
    const config = getShopifyConfig();
    const response = config.persistenceConfigured
      ? NextResponse.json({
          status: 'BLOCKED',
          reason: 'A production database adapter is declared but is not implemented in this baseline ZIP. The OAuth token was not persisted.',
          shop: token.shop,
          grantedScopes: token.scope,
        }, { status: 503 })
      : NextResponse.json({
          status: 'BLOCKED',
          reason: 'OAuth exchange succeeded, but this existing ProfitPilot ZIP does not include a production persistence provider. The access/refresh tokens were NOT stored.',
          shop: token.shop,
          grantedScopes: token.scope,
          expiresIn: token.expiresIn,
        }, { status: 503 });
    response.cookies.delete('profitpilot_shopify_oauth_state');
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Shopify callback failed.' }, { status: 400 });
  }
}
