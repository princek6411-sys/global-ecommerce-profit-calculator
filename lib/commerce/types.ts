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

export type SourceRecordRef = {
  provider: string;
  objectType: string;
  objectId: string;
  eventId?: string;
  observedAt?: string;
  sourceTimestamp?: string;
  rawPayloadRef?: string;
  checksum?: string;
};

export type RecordMetadata = {
  source?: SourceRecordRef;
  trust?: DataTrustState;
  confidence?: number;
  freshness?: 'LIVE' | 'RECENT' | 'STALE' | 'UNKNOWN';
  reconciliationStatus?: string;
  idempotencyKey?: string;
  version?: number;
  correctedFromId?: string;
};

export type MoneyValue = { amount: number; currency: CurrencyCode | string };

export type CanonicalMerchant = { id: string; name?: string; metadata?: RecordMetadata };

export type CanonicalStore = {
  id: string;
  merchantId: string;
  platform: string;
  externalId: string;
  domain?: string;
  currency?: string;
  region?: string;
  metadata?: RecordMetadata;
};

export type CanonicalChannel = { id: string; storeId: string; type: 'MARKETPLACE' | 'OWN_STORE' | 'OTHER'; name: string; metadata?: RecordMetadata };

export type CanonicalProduct = { id: string; storeId: string; externalId: string; title: string; handle?: string; status?: string; metadata?: RecordMetadata };

export type CanonicalVariant = { id: string; productId: string; storeId: string; externalId: string; sku?: string; price?: MoneyValue; inventoryQuantity?: number; metadata?: RecordMetadata };

export type CanonicalSKUMap = { id: string; storeId: string; canonicalSku: string; sourcePlatform: string; sourceSku: string; confidence: number; status: 'ACTIVE' | 'UNMAPPED' | 'CONFLICT'; metadata?: RecordMetadata };

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
  metadata?: RecordMetadata;
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
  metadata?: RecordMetadata;
};

export type CanonicalTransaction = { id: string; storeId: string; orderId?: string; type: 'PAYMENT' | 'REFUND' | 'FEE' | 'ADJUSTMENT' | 'OTHER'; amount: MoneyValue; effectiveAt: string; metadata?: RecordMetadata };
export type CanonicalFee = { id: string; storeId: string; orderId?: string; category: 'MARKETPLACE' | 'PAYMENT' | 'FULFILLMENT' | 'OTHER'; amount: MoneyValue; effectiveAt: string; metadata?: RecordMetadata };
export type CanonicalSettlement = { id: string; storeId: string; statementId: string; expected?: MoneyValue; actual?: MoneyValue; periodStart?: string; periodEnd?: string; metadata?: RecordMetadata };
export type CanonicalPayout = { id: string; storeId: string; settlementId?: string; amount: MoneyValue; paidAt?: string; metadata?: RecordMetadata };
export type CanonicalInventoryMovement = { id: string; storeId: string; sku: string; quantity: number; type: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'WRITE_OFF'; unitCost?: MoneyValue; effectiveAt: string; metadata?: RecordMetadata };
export type CanonicalAdSpend = { id: string; storeId: string; campaignId?: string; sku?: string; amount: MoneyValue; spendDate: string; attribution: 'ORDER' | 'SKU' | 'CAMPAIGN' | 'CHANNEL' | 'UNATTRIBUTED'; metadata?: RecordMetadata };
export type CanonicalRefund = { id: string; storeId: string; orderId: string; amount: MoneyValue; effectiveAt: string; metadata?: RecordMetadata };
export type CanonicalReturn = { id: string; storeId: string; orderId: string; sku?: string; count: number; cost?: MoneyValue; effectiveAt: string; metadata?: RecordMetadata };
export type CanonicalExperimentObservation = { id: string; experimentId: string; observedAt: string; profit: MoneyValue; margin: number; notes?: string; metadata?: RecordMetadata };
export type SyncSummary = { provider: 'shopify'; storeDomain: string; orders: number; orderLines: number; products: number; variants: number; inventories: number; refunds: number; rejected: number; status: SyncStatus; startedAt: string; completedAt?: string; limitations: string[] };
