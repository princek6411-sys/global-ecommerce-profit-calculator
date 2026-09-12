import { NextResponse } from 'next/server';
import { runConfiguredShopifySync } from '@/lib/integrations/shopify/runtime';

export async function POST() {
  try {
    const result = await runConfiguredShopifySync();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      status: 'BLOCKED',
      error: error instanceof Error ? error.message : 'Shopify sync failed.',
    }, { status: 503 });
  }
}
