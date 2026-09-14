export type CapabilityStatus =
  | 'SUPPORTED'
  | 'PARTIAL'
  | 'UNSUPPORTED'
  | 'UNAVAILABLE'
  | 'APPROVAL_REQUIRED'
  | 'CREDENTIAL_REQUIRED'
  | 'REGION_LIMITED'
  | 'PLAN_LIMITED'
  | 'UNDOCUMENTED'
  | 'UNKNOWN';

export type IntegrationState =
  | 'LIVE'
  | 'PARTIAL_LIVE'
  | 'CSV_STATEMENT'
  | 'MANUAL'
  | 'RESEARCH_ONLY'
  | 'BLOCKED'
  | 'APPROVAL_REQUIRED'
  | 'NOT_AVAILABLE';

export type PlatformCapability = {
  authentication: CapabilityStatus;
  orders: CapabilityStatus;
  products: CapabilityStatus;
  skus: CapabilityStatus;
  inventory: CapabilityStatus;
  fulfillment: CapabilityStatus;
  shipping: CapabilityStatus;
  refunds: CapabilityStatus;
  returns: CapabilityStatus;
  fees: CapabilityStatus;
  transactions: CapabilityStatus;
  settlements: CapabilityStatus;
  payouts: CapabilityStatus;
  advertising: CapabilityStatus;
  reports: CapabilityStatus;
  webhooks: CapabilityStatus;
  backfill: CapabilityStatus;
  realTimeEvents: CapabilityStatus;
  rateLimits: CapabilityStatus;
  region: CapabilityStatus;
  approval: CapabilityStatus;
};

export type PlatformAdapterDescriptor = {
  platform: string;
  integrationState: IntegrationState;
  capabilities: PlatformCapability;
  sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED';
  notes: string[];
};

const unavailable: PlatformCapability = {
  authentication: 'UNKNOWN', orders: 'UNKNOWN', products: 'UNKNOWN', skus: 'UNKNOWN', inventory: 'UNKNOWN',
  fulfillment: 'UNKNOWN', shipping: 'UNKNOWN', refunds: 'UNKNOWN', returns: 'UNKNOWN', fees: 'UNKNOWN',
  transactions: 'UNKNOWN', settlements: 'UNKNOWN', payouts: 'UNKNOWN', advertising: 'UNKNOWN', reports: 'UNKNOWN',
  webhooks: 'UNKNOWN', backfill: 'UNKNOWN', realTimeEvents: 'UNKNOWN', rateLimits: 'UNKNOWN', region: 'UNKNOWN', approval: 'UNKNOWN'
};

export const platformAdapterRegistry: Record<string, PlatformAdapterDescriptor> = {
  Shopify: {
    platform: 'Shopify',
    integrationState: 'PARTIAL_LIVE',
    sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED',
    capabilities: {
      ...unavailable,
      authentication: 'SUPPORTED',
      orders: 'SUPPORTED', products: 'SUPPORTED', skus: 'SUPPORTED', inventory: 'SUPPORTED',
      refunds: 'PARTIAL', returns: 'PARTIAL', transactions: 'PARTIAL', webhooks: 'SUPPORTED',
      backfill: 'SUPPORTED', rateLimits: 'SUPPORTED', region: 'SUPPORTED'
    },
    notes: ['Current repository contains a server-side Shopify OAuth/client/sync vertical slice.', 'Durable multi-merchant token persistence is blocked until the repository has a database and merchant identity layer.']
  },
  Amazon: { platform: 'Amazon', integrationState: 'RESEARCH_ONLY', sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED', capabilities: { ...unavailable }, notes: ['Architecture reserved; live implementation requires verified seller credentials and current official API access.'] },
  eBay: { platform: 'eBay', integrationState: 'RESEARCH_ONLY', sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED', capabilities: { ...unavailable }, notes: ['Architecture reserved; live implementation requires verified seller credentials and current official API access.'] },
  Walmart: { platform: 'Walmart', integrationState: 'RESEARCH_ONLY', sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED', capabilities: { ...unavailable }, notes: ['Architecture reserved; live implementation requires verified seller credentials and current official API access.'] },
  Etsy: { platform: 'Etsy', integrationState: 'RESEARCH_ONLY', sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED', capabilities: { ...unavailable }, notes: ['Architecture reserved; live implementation requires verified seller credentials and current official API access.'] },
  Flipkart: { platform: 'Flipkart', integrationState: 'RESEARCH_ONLY', sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED', capabilities: { ...unavailable }, notes: ['Architecture reserved; do not label unsupported API capabilities as live.'] },
  Meesho: { platform: 'Meesho', integrationState: 'RESEARCH_ONLY', sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED', capabilities: { ...unavailable }, notes: ['Architecture reserved; calculator support remains separate from verified live integration support.'] },
  'TikTok Shop': { platform: 'TikTok Shop', integrationState: 'RESEARCH_ONLY', sourcePolicy: 'OFFICIAL_PRIMARY_SOURCES_REQUIRED', capabilities: { ...unavailable }, notes: ['Architecture reserved; live capability claims require current official documentation and seller/app access.'] }
};

export function getPlatformAdapterDescriptor(platform: string): PlatformAdapterDescriptor | undefined {
  return platformAdapterRegistry[platform];
}
