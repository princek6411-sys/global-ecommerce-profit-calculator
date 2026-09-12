import { NextResponse } from 'next/server';
import { getShopifyConfig } from '@/lib/integrations/shopify/config';

export async function GET() {
  const config = getShopifyConfig();
  const connected = config.shopConfigured && config.tokenConfigured;
  return NextResponse.json({
    provider: 'shopify',
    status: connected ? 'CONNECTED' : 'NOT_CONNECTED',
    oauth: {
      configured: config.configured,
      persistenceConfigured: config.persistenceConfigured,
    },
    liveTokenConfigured: config.tokenConfigured,
    shopConfigured: config.shopConfigured,
    apiVersion: config.apiVersion,
    note: connected
      ? 'A server-side Shopify token is configured. Sync can run without exposing the token to the browser.'
      : 'No live Shopify credentials are configured. ProfitPilot will not simulate a connection.',
  });
}
