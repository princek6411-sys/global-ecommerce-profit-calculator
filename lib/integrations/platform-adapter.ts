import type { PlatformAdapterDescriptor } from '@/lib/commerce/platform-adapters';
import type { CanonicalOrder, SyncStatus, SyncSummary } from '@/lib/commerce/types';

export type PlatformSyncResult = {
  orders?: CanonicalOrder[];
  summary: SyncSummary | { provider: string; status: SyncStatus; limitations: string[]; startedAt: string; completedAt?: string };
};

export interface PlatformAdapter {
  readonly descriptor: PlatformAdapterDescriptor;
  getConnectionStatus(): Promise<SyncStatus>;
  syncOrders(): Promise<PlatformSyncResult>;
}

export class CapabilityOnlyAdapter implements PlatformAdapter {
  constructor(public readonly descriptor: PlatformAdapterDescriptor) {}
  async getConnectionStatus(): Promise<SyncStatus> {
    return this.descriptor.integrationState === 'RESEARCH_ONLY' ? 'NOT_CONNECTED' : 'DISCONNECTED';
  }
  async syncOrders(): Promise<PlatformSyncResult> {
    return {
      summary: {
        provider: this.descriptor.platform,
        status: 'DISCONNECTED',
        limitations: [
          `No live connector is implemented for ${this.descriptor.platform} in the current repository snapshot.`,
          'Use the platform capability matrix and CSV/statement workflows instead of treating research metadata as live seller data.'
        ],
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    };
  }
}
