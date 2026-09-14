import { platformAdapterRegistry, type PlatformAdapterDescriptor } from '@/lib/commerce/platform-adapters';
import { CapabilityOnlyAdapter, type PlatformAdapter } from '@/lib/integrations/platform-adapter';
import { runConfiguredShopifySync } from '@/lib/integrations/shopify/runtime';
import type { SyncStatus } from '@/lib/commerce/types';

class ShopifyAdapter implements PlatformAdapter {
  constructor(public readonly descriptor: PlatformAdapterDescriptor) {}
  async getConnectionStatus(): Promise<SyncStatus> {
    return process.env.SHOPIFY_SHOP_DOMAIN && process.env.SHOPIFY_OFFLINE_ACCESS_TOKEN ? 'CONNECTED' : 'NOT_CONNECTED';
  }
  async syncOrders() {
    const result = await runConfiguredShopifySync();
    return { orders: [], summary: result.summary };
  }
}

export type IntegrationAdapter = {
  descriptor: PlatformAdapterDescriptor;
  adapter: PlatformAdapter;
};

export const integrationRegistry: Record<string, IntegrationAdapter> = Object.fromEntries(
  Object.entries(platformAdapterRegistry).map(([platform, descriptor]) => [
    platform,
    {
      descriptor,
      adapter: platform === 'Shopify' ? new ShopifyAdapter(descriptor) : new CapabilityOnlyAdapter(descriptor)
    }
  ])
);

export function getIntegrationAdapter(platform: string): IntegrationAdapter | undefined {
  return integrationRegistry[platform];
}
