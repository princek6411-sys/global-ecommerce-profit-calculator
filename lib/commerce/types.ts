import type { CurrencyCode } from '@/lib/config';

export type DataTrustState =
  | 'VERIFIED'
  | 'USER_PROVIDED'
  | 'CALCULATED'
  | 'ESTIMATED'
  | 'UNAVAILABLE'
  | 'UNPUBLISHED'
  | 'STALE'
  | 'UNCLASSIFIED'
  | 'SOURCE_CONFLICT'
  | 'MOCKED'
  | 'SYNC_PENDING'
  | 'SYNC_FAILED';

export type SyncStatus =
  | 'NOT_CONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'SYNC_PENDING'
  | 'SYNCING'
  | 'SYNCED'
  | 'SYNC_PARTIAL'
  | 'SYNC_FAILED'
  | 'REAUTH_REQUIRED'
  | 'DISCONNECTED';

export type NormalizationState = 'NORMALIZED' | 'PARTIAL' | 'REJECTED';

export type MoneyValue = {
  amount: number;
  currency: CurrencyCode | string;
};

export type CanonicalMerchant = {
  id: string;
  name?: string;
};

export type CanonicalStore = {
  id: string;
  merchantId: string;
  platform: string;
  externalId: string;
  domain?: string;
  currency?: string;
  region?: string;
};

export type CanonicalProduct = {
  id: string;
  storeId: string;
  externalId: string;
  title: string;
  handle?: string;
  status?: string;
};

export type CanonicalVariant = {
  id: string;
  productId: string;
  storeId: string;
  externalId: string;
  sku?: string;
  price?: MoneyValue;
  inventoryQuantity?: number;
};

export type CanonicalOrderLine = {
  id: string;
  orderId: string;
  variantId?: string;
  sku?: string;
  title: string;
  quantity: number;
  unitPrice?: MoneyValue;
  lineRevenue?: MoneyValue;
  totalDiscount?: MoneyValue;
};

export type CanonicalOrder = {
  id: string;
  storeId: string;
  externalId: string;
  name?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  currency: string;
  totalPrice?: MoneyValue;
  subtotal?: MoneyValue;
  totalShipping?: MoneyValue;
  totalTax?: MoneyValue;
  totalDiscounts?: MoneyValue;
  totalRefunded?: MoneyValue;
  paymentState?: string;
  fulfillmentState?: string;
  test: boolean;
  lines: CanonicalOrderLine[];
};

export type SyncSummary = {
  provider: 'shopify';
  storeDomain: string;
  orders: number;
  orderLines: number;
  products: number;
  variants: number;
  inventories: number;
  refunds: number;
  rejected: number;
  status: SyncStatus;
  startedAt: string;
  completedAt?: string;
  limitations: string[];
};
