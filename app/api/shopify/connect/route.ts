import { NextResponse } from 'next/server';
import { buildShopifyAuthorizationUrl } from '@/lib/integrations/shopify/auth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    if (!shop) return NextResponse.json({ error: 'Missing shop query parameter.' }, { status: 400 });
    const response = NextResponse.redirect(buildShopifyAuthorizationUrl(shop));
    // Bind OAuth state to this browser session without storing any token client-side.
    const stateUrl = new URL(response.headers.get('location') ?? '');
    const state = stateUrl.searchParams.get('state');
    if (state) {
      response.cookies.set('profitpilot_shopify_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to start Shopify OAuth.' }, { status: 503 });
  }
}
