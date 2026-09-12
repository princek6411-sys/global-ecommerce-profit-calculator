/**
 * ProfitPilot Platform Intelligence
 *
 * Research-backed, versioned marketplace knowledge. This layer is intentionally
 * separate from the canonical calculation engine: only economics that match a
 * calculator input contract should ever be auto-applied to profit arithmetic.
 *
 * Source basis: supplied “E-Commerce Platform Seller Features A–Z: Verified
 * Edition (September 2026)” research report, built from official first-party
 * marketplace sources. Retrieval date for this product snapshot: 2026-09-12.
 */

export type PlatformLifecycleStatus =
  | 'ACTIVE'
  | 'RENAMED'
  | 'DISCONTINUED'
  | 'ANNOUNCED_NOT_LIVE'
  | 'UNVERIFIED';

export type PlatformVerificationState =
  | 'VERIFIED'
  | 'UNAVAILABLE'
  | 'STALE'
  | 'UNCLASSIFIED'
  | 'MOCKED'
  | 'UNVERIFIED';

export type PlatformFeatureFamily =
  | 'seller-console'
  | 'fulfilment'
  | 'seller-performance'
  | 'advertising'
  | 'fees'
  | 'payments-payouts'
  | 'api-integration'
  | 'brand-ip'
  | 'multichannel-fulfilment'
  | 'cross-border'
  | 'financing'
  | 'pricing-automation'
  | 'reviews'
  | 'storefront'
  | 'loyalty'
  | 'ai-operations'
  | 'catalogue';

export type PlatformImpact = 'HIGH' | 'MEDIUM' | 'LOW';
export type PlatformCalculationRole = 'CALCULATION_INPUT' | 'CONTEXT_ONLY' | 'NOT_MODELED';

export type PlatformEconomicValue = {
  value?: number;
  valueMin?: number;
  valueMax?: number;
  unit?: 'percent' | 'currency' | 'days' | 'calls-per-day' | 'calls-per-second' | 'months' | 'count';
  currency?: string;
  scope?: string;
  thresholds?: Record<string, string | number>;
};

export type PlatformFact = {
  id: string;
  letter: string;
  officialName: string;
  status: PlatformLifecycleStatus;
  verification: PlatformVerificationState;
  family: PlatformFeatureFamily;
  definition: string;
  whyItMatters: string;
  scope?: string;
  eligibility?: string;
  dependencies?: string;
  impact: PlatformImpact;
  adoption?: PlatformImpact;
  calculationRole: PlatformCalculationRole;
  economic?: PlatformEconomicValue;
  effectiveDate?: string;
  discontinuedDate?: string;
  replacement?: string;
  failureMode?: string;
  source?: string;
  sourceUrl?: string;
  notes?: string;
};

export type PlatformResearch = {
  id: string;
  displayName: string;
  model: string;
  researchStatus: PlatformLifecycleStatus;
  verification: PlatformVerificationState;
  calculatorSupported: boolean;
  researchedMarkets: string[];
  keyFamilies: PlatformFeatureFamily[];
  facts: PlatformFact[];
  limitations: string[];
  source: string;
  retrievalDate: string;
  effectiveDate?: string;
};

export type PlatformLifecycleNotice = {
  platform: string;
  name: string;
  status: 'RENAMED' | 'DISCONTINUED';
  date: string;
  replacement?: string;
  reason: string;
  sourceUrl?: string;
};

export const REPORT_SOURCE =
  'E-Commerce Platform Seller Features A–Z: Verified Edition (September 2026)';
export const RETRIEVAL_DATE = '2026-09-12';

const FAMILIES: Record<PlatformFeatureFamily, string> = {
  'seller-console': 'Seller console',
  fulfilment: 'Fulfilment',
  'seller-performance': 'Seller performance',
  advertising: 'Advertising',
  fees: 'Fees',
  'payments-payouts': 'Payments & payouts',
  'api-integration': 'API & integration',
  'brand-ip': 'Brand & IP',
  'multichannel-fulfilment': 'Multichannel fulfilment',
  'cross-border': 'Cross-border',
  financing: 'Financing',
  'pricing-automation': 'Pricing automation',
  reviews: 'Reviews',
  storefront: 'Storefront',
  loyalty: 'Loyalty',
  'ai-operations': 'AI & operations',
  catalogue: 'Catalogue',
};

const fact = (
  platform: string,
  input: Omit<PlatformFact, 'id' | 'verification' | 'source'> & { sourceUrl?: string },
): PlatformFact => ({
  ...input,
  id: `${platform.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${input.letter.toLowerCase()}-${input.officialName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`,
  verification: input.status === 'UNVERIFIED' ? 'UNVERIFIED' : 'VERIFIED',
  source: REPORT_SOURCE,
});

const researchSource = REPORT_SOURCE;

export const platformResearch: Record<string, PlatformResearch> = {
  Amazon: {
    id: 'amazon',
    displayName: 'Amazon',
    model: 'Hybrid 1P/3P marketplace',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['US', 'IN', 'DE', 'FR', 'ES', 'JP'],
    keyFamilies: ['seller-console', 'fulfilment', 'seller-performance', 'advertising', 'fees', 'payments-payouts', 'api-integration', 'brand-ip', 'multichannel-fulfilment', 'cross-border', 'financing'],
    facts: [
      fact('amazon', { letter: 'A', officialName: 'A+ Content', status: 'ACTIVE', family: 'catalogue', definition: 'Enhanced product-detail modules for eligible brand owners.', whyItMatters: 'Improves product-detail merchandising without changing base product economics.', eligibility: 'Brand-approved ASINs and eligible brand ownership.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sell.amazon.com/tools/a-plus-content', failureMode: 'Content can be rejected for policy or image violations.' }),
      fact('amazon', { letter: 'B', officialName: 'Brand Registry', status: 'ACTIVE', family: 'brand-ip', definition: 'Brand-protection and brand-tools programme.', whyItMatters: 'Unlocks brand controls, A+ Content, analytics and enforcement tools.', eligibility: 'Registered or pending trademark in an accepted office.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sell.amazon.com/brand-registry' }),
      fact('amazon', { letter: 'B', officialName: 'Brand Analytics', status: 'ACTIVE', family: 'seller-performance', definition: 'Search, market-basket, repeat-purchase and demographic dashboards for brand owners.', whyItMatters: 'Turns marketplace demand data into pricing, assortment and merchandising decisions.', eligibility: 'Brand Registry enrolment.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sell.amazon.com/tools/amazon-brand-analytics' }),
      fact('amazon', { letter: 'F', officialName: 'FBA fee schedule 2026', status: 'ACTIVE', family: 'fulfilment', definition: 'Annual fulfilment fee revision covering storage, inbound and fulfilment charges.', whyItMatters: 'FBA economics directly change per-order contribution profit.', scope: 'US 2026 fee schedule in the research report.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', effectiveDate: '2026-01-15', sourceUrl: 'https://sell.amazon.com/pricing', notes: 'Use only with matching country/category/size-tier inputs; not a universal 15% fee.' }),
      fact('amazon', { letter: 'H', officialName: 'Account Health Rating', status: 'ACTIVE', family: 'seller-performance', definition: '0–1,000 policy-compliance score with Healthy/At Risk/Unhealthy bands.', whyItMatters: 'Low account health can create deactivation risk.', scope: 'Amazon store/account.', economic: { valueMin: 200, valueMax: 1000, unit: 'count', scope: 'Healthy band in source report' }, impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW', failureMode: 'Unhealthy band and deactivation notice at very low scores.' }),
      fact('amazon', { letter: 'L', officialName: 'Amazon Lending', status: 'ACTIVE', family: 'financing', definition: 'Eligibility/invitation-based third-party financing offers surfaced in Seller Central.', whyItMatters: 'Working capital can affect inventory and advertising capacity.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sell.amazon.com/programs/amazon-lending' }),
      fact('amazon', { letter: 'M', officialName: 'Multi-Channel Fulfillment (MCF)', status: 'ACTIVE', family: 'multichannel-fulfilment', definition: 'FBA inventory used to fulfil orders from off-Amazon channels.', whyItMatters: 'Lets one inventory pool serve multiple channels; fulfilment cost must be modeled when used.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://sell.amazon.com/fulfillment-by-amazon/fba-multichannel', failureMode: 'Orders can be rejected for blocked ASINs or unfulfillable inventory.' }),
      fact('amazon', { letter: 'P', officialName: 'Professional vs Individual selling plans', status: 'ACTIVE', family: 'fees', definition: 'Seller plan structure with monthly plan fees versus per-item fees.', whyItMatters: 'Plan choice changes fixed and variable selling cost.', scope: 'US values in research report.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://sell.amazon.com/pricing', notes: 'Plan-level arithmetic should be entered explicitly; do not auto-apply from platform selection.' }),
      fact('amazon', { letter: 'P', officialName: 'Project Zero', status: 'ACTIVE', family: 'brand-ip', definition: 'Self-service counterfeit removal for qualifying brand owners.', whyItMatters: 'Reduces counterfeit exposure and brand leakage.', eligibility: 'Brand Registry; accuracy thresholds apply.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sell.amazon.com/brand-registry/project-zero' }),
      fact('amazon', { letter: 'R', officialName: 'Remote Fulfillment with FBA', status: 'ACTIVE', family: 'cross-border', definition: 'US FBA inventory sold into Canada, Mexico and Brazil through cross-border offers.', whyItMatters: 'Expands market reach without separately stocking destination inventory.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sell.amazon.com/fulfillment-by-amazon/remote-fulfillment' }),
      fact('amazon', { letter: 'R', officialName: 'SP-API usage plans', status: 'ACTIVE', family: 'api-integration', definition: 'Token-bucket API throttling with operation and selling-partner/application scope.', whyItMatters: 'API limits determine automation reliability at scale.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://developer-docs.amazon.com/sp-api/docs/usage-plans-and-rate-limits', failureMode: 'HTTP 429 is retryable; clients must back off.' }),
      fact('amazon', { letter: 'S', officialName: 'Fuel and logistics surcharge 2026', status: 'ACTIVE', family: 'fees', definition: '3.5% surcharge on specified FBA and Remote Fulfillment fees, with additional MCF/Buy with Prime timing.', whyItMatters: 'Surcharge changes fulfilment contribution and can be missed when repricing.', scope: 'US 2026.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', economic: { value: 3.5, unit: 'percent', scope: 'applies to specified fulfilment fee lines' }, effectiveDate: '2026-04-17', sourceUrl: 'https://sell.amazon.com/pricing', notes: 'Peak period noted in source: 2026-10-15 through 2027-01-14.' }),
      fact('amazon', { letter: 'T', officialName: 'Transparency', status: 'ACTIVE', family: 'brand-ip', definition: 'Item-level serialisation/authenticity programme using product codes.', whyItMatters: 'Helps prevent counterfeit fulfilment and improves authenticity controls.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sell.amazon.com/brand-registry/transparency' }),
      fact('amazon', { letter: 'U', officialName: 'SP-API error response format', status: 'ACTIVE', family: 'api-integration', definition: 'Standard error envelope and x-amzn error/request headers.', whyItMatters: 'Makes automated recovery and observability predictable.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://developer-docs.amazon.com/sp-api/docs/response-format' }),
      fact('amazon', { letter: 'V', officialName: 'Amazon Vine', status: 'ACTIVE', family: 'reviews', definition: 'Reviewer programme for eligible ASINs.', whyItMatters: 'Review acquisition can influence conversion and merchandising.', eligibility: 'Brand Registry and ASIN-specific conditions.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://sellercentral.amazon.com/help/hub/reference/external/G92T8UV339NZ98TN?locale=en-US' }),
    ],
    limitations: ['Country/category/tier fee schedules require additional inputs and are not universally auto-applied.', 'Seller account programmes can be eligibility scoped.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  'Alibaba.com / Tmall / Taobao': {
    id: 'alibaba-group',
    displayName: 'Alibaba / Tmall / Taobao',
    model: 'B2B sourcing + B2C marketplace ecosystem',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['CN', 'GLOBAL'],
    keyFamilies: ['seller-console', 'advertising', 'ai-operations', 'cross-border', 'payments-payouts', 'api-integration', 'loyalty'],
    facts: [
      fact('alibaba', { letter: 'A', officialName: 'Accio Work', status: 'ACTIVE', family: 'ai-operations', definition: 'Agentic business team for Alibaba.com sourcing, marketing and operations tasks.', whyItMatters: 'Can reduce research and repetitive seller-operations work.', impact: 'MEDIUM', adoption: 'LOW', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.alibaba.com/businessblogs/meet-accio-work---your-agentic-business-team-px002dj6w' }),
      fact('alibaba', { letter: 'A', officialName: 'Alibaba.com Advertising Suite', status: 'ACTIVE', family: 'advertising', definition: 'Keyword Advertising, Premium Sponsored Ads, Sponsored Brands and Smart Marketing.', whyItMatters: 'Paid demand generation affects acquisition cost and therefore margin.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://seller.alibaba.com/advertising', failureMode: 'Campaign can pause when spending limits are reached.' }),
      fact('alibaba', { letter: 'B', officialName: 'Business Advisor AI Agent Team', status: 'ACTIVE', family: 'ai-operations', definition: 'Tmall merchant agent workflows for store inspection, analysis, creatives, ad placement and service.', whyItMatters: 'Automates merchant analysis and operational tasks.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.alibabagroup.com/en-US/document-1975267612359131136' }),
      fact('alibaba', { letter: 'C', officialName: 'Tmall Global entry models', status: 'ACTIVE', family: 'cross-border', definition: 'Cross-border entry models including Cross-Border Hub, Overseas Fulfillment, Mini Store and Direct Import.', whyItMatters: 'Changes eligibility, fulfilment footprint and cross-border operating complexity.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://merchant.tmall.hk/en', notes: 'Deposit and annual-fee amounts were not published in the consulted official source.' }),
      fact('alibaba', { letter: 'D', officialName: 'Dianxiaomi / 店小蜜', status: 'ACTIVE', family: 'ai-operations', definition: 'Conversational merchant assistant that executes tasks in store back ends.', whyItMatters: 'Operational automation can reduce repetitive seller work.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.alibabagroup.com/en-US/document-1975267612359131136' }),
      fact('alibaba', { letter: 'E', officialName: 'Taobao Open Platform error codes', status: 'ACTIVE', family: 'api-integration', definition: 'Platform-level API errors and sub-codes for calls.', whyItMatters: 'Reliable API error handling matters for high-volume operations.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://open.taobao.com/doc.htm?docId=101617&docType=1' }),
      fact('alibaba', { letter: 'F', officialName: 'Free Member / Gold Supplier / Verified Supplier tiers', status: 'ACTIVE', family: 'seller-performance', definition: 'Alibaba.com membership ladder with verification and marketplace benefits.', whyItMatters: 'Tier status can influence showcase capacity and RFQ priority.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.alibaba.com/help/gold_supplier.html' }),
      fact('alibaba', { letter: 'M', officialName: '88VIP membership tie-in', status: 'ACTIVE', family: 'loyalty', definition: 'Tmall brand participation in a paid consumer membership ecosystem.', whyItMatters: 'Membership participation can change demand and promotional economics.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.alibabagroup.com/en-US/document-1975267612359131136' }),
      fact('alibaba', { letter: 'R', officialName: 'RFQ marketplace', status: 'ACTIVE', family: 'seller-console', definition: 'Buyer sourcing requests that suppliers answer with quotations.', whyItMatters: 'Provides a demand-capture channel separate from standard catalogue selling.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.alibaba.com/rfq' }),
      fact('alibaba', { letter: 'S', officialName: 'Smart Marketing', status: 'ACTIVE', family: 'advertising', definition: 'Automated Keyword Advertising with real-time bidding and daily budget controls.', whyItMatters: 'Advertising automation can change acquisition efficiency.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://seller.alibaba.com/kwa' }),
      fact('alibaba', { letter: 'T', officialName: 'Trade Assurance', status: 'ACTIVE', family: 'payments-payouts', definition: 'Order-protection programme covering payment, quality and on-time shipping terms.', whyItMatters: 'Protection can affect trust, conversion and dispute handling.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://tradeassurance.alibaba.com/' }),
      fact('alibaba', { letter: 'T', officialName: 'TMIC', status: 'ACTIVE', family: 'ai-operations', definition: 'Tmall Innovation Center for new-product development and insight generation.', whyItMatters: 'Product-development intelligence can inform assortment and launch choices.', impact: 'MEDIUM', adoption: 'LOW', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.alibabagroup.com/en-US/document-1975267612359131136' }),
    ],
    limitations: ['Some Tmall domestic tooling and exact fee values were not publicly reachable in the English-source research pass.', 'Do not convert membership or advertising participation into universal profit percentages.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  eBay: {
    id: 'ebay',
    displayName: 'eBay',
    model: '3P marketplace',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['GLOBAL'],
    keyFamilies: ['seller-console', 'advertising', 'fees', 'payments-payouts', 'seller-performance', 'api-integration', 'cross-border', 'pricing-automation'],
    facts: [
      fact('ebay', { letter: 'D', officialName: 'Discounts Manager', status: 'ACTIVE', family: 'fees', definition: 'Coupons, order discounts, sale events and volume pricing tools.', whyItMatters: 'Discounting directly reduces realized contribution per sale.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.ebay.com/help/selling/selling-tools/seller-hub?id=4095' }),
      fact('ebay', { letter: 'E', officialName: 'eBay International Shipping', status: 'ACTIVE', family: 'cross-border', definition: 'eBay-managed export hub for qualifying international orders.', whyItMatters: 'Changes who controls international export and can simplify cross-border fulfilment.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', effectiveDate: '2026-08', sourceUrl: 'https://www.ebay.co.uk/sellercentre/postage/ebay-international-shipping', replacement: 'Replaces legacy Global Shipping Program enrolment in relevant markets.', failureMode: 'Listings can be ineligible by location, value, category or destination.' }),
      fact('ebay', { letter: 'F', officialName: 'Selling fees', status: 'ACTIVE', family: 'fees', definition: 'Insertion/final value and per-order fee schedule.', whyItMatters: 'Selling fees are a first-order profit driver.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', economic: { value: 0.35, currency: 'USD', unit: 'currency', scope: 'US insertion fee after monthly free-listing allowance in report' }, sourceUrl: 'https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822', notes: 'Category-specific final-value rates must be matched before auto-application.' }),
      fact('ebay', { letter: 'H', officialName: 'Seller Hub', status: 'ACTIVE', family: 'seller-console', definition: 'Central console covering listings, orders, marketing, advertising, performance, research, payments and reports.', whyItMatters: 'Central operating surface for day-to-day marketplace management.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.ebay.com/help/selling/selling-tools/seller-hub?id=4095' }),
      fact('ebay', { letter: 'I', officialName: 'Inventory API error catalogue', status: 'ACTIVE', family: 'api-integration', definition: 'Numbered errors for Sell Inventory API calls.', whyItMatters: 'Error contracts are essential to stable ERP/integration workflows.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://developer.ebay.com/api-docs/sell/static/inventory/inventory-error-details.html' }),
      fact('ebay', { letter: 'P', officialName: 'Managed Payments payouts', status: 'ACTIVE', family: 'payments-payouts', definition: 'Payouts from available funds to a bank or debit card, with hold conditions.', whyItMatters: 'Payout timing affects cash flow and working capital even when profit is unchanged.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.ebay.com/help/selling/getting-paid/payouts-work-managed-payments-sellers?id=4814' }),
      fact('ebay', { letter: 'P', officialName: 'Promoted Listings General', status: 'ACTIVE', family: 'advertising', definition: 'Cost-per-sale promoted listing campaigns with attributed sales.', whyItMatters: 'Ad fees directly reduce contribution profit.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.ebay.com/help/selling/listings/promoted-listings-overview?id=5295' }),
      fact('ebay', { letter: 'P', officialName: 'Promoted Listings Priority', status: 'ACTIVE', family: 'advertising', definition: 'Cost-per-click promoted listing campaigns.', whyItMatters: 'CPC spend is a direct acquisition cost.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.ebay.com/help/selling/listings/promoted-listings-overview?id=5295' }),
      fact('ebay', { letter: 'S', officialName: 'Seller Hub Reports', status: 'ACTIVE', family: 'seller-console', definition: 'Bulk upload/download reporting for listings, orders and inventory.', whyItMatters: 'Supports bulk operations and reconciliation.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.ebay.com/help/selling/selling-tools/seller-hub?id=4095' }),
      fact('ebay', { letter: 'T', officialName: 'Top Rated Seller / Top Rated Plus', status: 'ACTIVE', family: 'seller-performance', definition: 'Performance status requiring quality and handling thresholds; Plus can provide a fee discount.', whyItMatters: 'Performance can change visibility and fees.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.ebay.com/sellercenter/protections/top-rated-program' }),
    ],
    limitations: ['Final-value fees are category and seller-context dependent.', 'International shipping eligibility is market-specific.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  Shopify: {
    id: 'shopify',
    displayName: 'Shopify',
    model: 'SaaS storefront + payments',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['GLOBAL'],
    keyFamilies: ['seller-console', 'fees', 'payments-payouts', 'multichannel-fulfilment', 'api-integration', 'storefront', 'financing', 'ai-operations', 'catalogue'],
    facts: [
      fact('shopify', { letter: 'A', officialName: 'Abandoned checkout recovery', status: 'ACTIVE', family: 'storefront', definition: 'Recovery emails for eligible abandoned checkouts.', whyItMatters: 'Can recover revenue without changing product economics.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY' }),
      fact('shopify', { letter: 'A', officialName: 'Shopify Audiences', status: 'ACTIVE', family: 'advertising', definition: 'Audience exports for eligible advertising use.', whyItMatters: 'Can improve ad targeting efficiency.', scope: 'US/Canada availability in the research report.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY' }),
      fact('shopify', { letter: 'B', officialName: 'Brand Portal / Brand Portfolio', status: 'ACTIVE', family: 'brand-ip', definition: 'Brand-related IP claims and brand-content tooling.', whyItMatters: 'Protects branded catalogue assets and IP.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY' }),
      fact('shopify', { letter: 'F', officialName: 'Shopify Fulfillment Network', status: 'ACTIVE', family: 'multichannel-fulfilment', definition: 'Fulfilment delivered through integrated logistics partners.', whyItMatters: 'Fulfilment cost and speed materially affect contribution and conversion.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://help.shopify.com/en/manual/fulfillment/shopify-fulfillment-network/logistics-partners' }),
      fact('shopify', { letter: 'F', officialName: 'Shopify Flow', status: 'ACTIVE', family: 'ai-operations', definition: 'Automation workflows for store operations.', whyItMatters: 'Reduces repetitive operational work.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://help.shopify.com/en/manual/shopify-flow' }),
      fact('shopify', { letter: 'L', officialName: 'Shopify Markets', status: 'ACTIVE', family: 'storefront', definition: 'International selling configuration for localized prices, languages, domains, catalogues and taxes.', whyItMatters: 'Changes cross-border setup and local selling experience.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.shopify.com/markets' }),
      fact('shopify', { letter: 'M', officialName: 'Shopify Payments', status: 'ACTIVE', family: 'payments-payouts', definition: 'Native payments with plan and market dependent charges.', whyItMatters: 'Payment processing fees reduce net contribution.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://help.shopify.com/en/manual/payments/shopify-payments/onboarding/cost-of-shopify-payments' }),
      fact('shopify', { letter: 'P', officialName: 'Shopify Pricing', status: 'ACTIVE', family: 'fees', definition: 'Plan-based platform subscription pricing and related fees.', whyItMatters: 'Fixed platform cost changes unit economics at different order volumes.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.shopify.com/pricing' }),
      fact('shopify', { letter: 'R', officialName: 'Admin API rate limits', status: 'ACTIVE', family: 'api-integration', definition: 'GraphQL Admin API point budget/leaky bucket limits varying by plan.', whyItMatters: 'Determines automation capacity and integration reliability.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://shopify.dev/docs/api/usage/limits' }),
      fact('shopify', { letter: 'S', officialName: 'Shopify Sidekick', status: 'ACTIVE', family: 'ai-operations', definition: 'AI assistance for merchant tasks and recommendations.', whyItMatters: 'Reduces operational friction and supports decision-making.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://help.shopify.com/en/manual/ai-powered-tools/sidekick' }),
      fact('shopify', { letter: 'C', officialName: 'Shopify Capital', status: 'ACTIVE', family: 'financing', definition: 'Funding offers based on merchant data and eligibility.', whyItMatters: 'Can influence inventory and growth cash flow.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://help.shopify.com/en/manual/finance/shopify-capital/eligibility' }),
    ],
    limitations: ['Plan, country and gateway variations prevent one universal payment/transaction rate.', 'Fulfilment partner costs vary by contract.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  'Walmart Marketplace': {
    id: 'walmart',
    displayName: 'Walmart Marketplace',
    model: '3P marketplace',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['US', 'GLOBAL_SELLER_PROGRAMS'],
    keyFamilies: ['seller-console', 'fulfilment', 'seller-performance', 'advertising', 'fees', 'payments-payouts', 'api-integration', 'brand-ip', 'multichannel-fulfilment', 'cross-border', 'financing', 'pricing-automation', 'reviews'],
    facts: [
      fact('walmart', { letter: 'B', officialName: 'Brand Portal / Brand Portfolio', status: 'ACTIVE', family: 'brand-ip', definition: 'IP claims and brand-content tooling linked to seller credentials.', whyItMatters: 'Helps protect brand content and enforce catalogue control.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://marketplace.walmart.com/brand-portal/' }),
      fact('walmart', { letter: 'C', officialName: 'Walmart Cross Border: Imports', status: 'ACTIVE', family: 'cross-border', definition: 'Freight/import workflow from selected origin countries into WFS.', whyItMatters: 'Changes landed-cost and inventory lead-time planning.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://marketplace.walmart.com/getting-started-in-seller-center/' }),
      fact('walmart', { letter: 'C', officialName: 'Marketplace Capital / Faster Payout', status: 'ACTIVE', family: 'financing', definition: 'Seller financing offers and faster payout option subject to eligibility.', whyItMatters: 'Changes working-capital timing, not canonical product profit.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://marketplace.walmart.com/walmart-marketplace-capital/' }),
      fact('walmart', { letter: 'E', officialName: 'Marketplace API error codes', status: 'ACTIVE', family: 'api-integration', definition: 'Documented 400/401/403/404/429 response contract and retry guidance.', whyItMatters: 'Reliable integration depends on predictable error handling.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://developer.walmart.com/us-marketplace/docs/error-codes' }),
      fact('walmart', { letter: 'I', officialName: 'India-based seller onboarding', status: 'ACTIVE', family: 'cross-border', definition: 'India seller onboarding path with GSTIN and other documentation.', whyItMatters: 'Eligibility changes before any US marketplace economics can matter.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://marketplace.walmart.com/getting-started-in-seller-center/' }),
      fact('walmart', { letter: 'L', officialName: 'Listing Quality Score', status: 'ACTIVE', family: 'seller-performance', definition: 'Content, discoverability, offer, ratings/reviews and post-purchase quality score.', whyItMatters: 'Low quality can reduce discoverability and programme eligibility.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://marketplace.walmart.com/listing-quality/' }),
      fact('walmart', { letter: 'M', officialName: 'Multichannel Solutions', status: 'ACTIVE', family: 'multichannel-fulfilment', definition: 'WFS fulfilment for eligible off-Walmart channels and own-site orders.', whyItMatters: 'Lets one fulfilment network serve multiple channels.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://marketplace.walmart.com/multichannel-solutions/', economic: { value: 7.45, unit: 'currency', currency: 'USD', scope: 'standard shipping from 6 oz or less in research report' } }),
      fact('walmart', { letter: 'N', officialName: 'New-Seller Savings 2026', status: 'ACTIVE', family: 'fees', definition: 'Time-bounded referral discounts and credits for qualified new sellers.', whyItMatters: 'Temporary credits can materially affect launch economics.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', effectiveDate: '2026-02-02', notes: 'Programme in report runs through 2027-01-31.', sourceUrl: 'https://marketplace.walmart.com/new-seller-savings-2026/' }),
      fact('walmart', { letter: 'P', officialName: 'Pro Seller programme', status: 'ACTIVE', family: 'seller-performance', definition: 'Performance tiers linked to service metrics, badges, credits, deals and faster payouts.', whyItMatters: 'Seller performance can affect fees and visibility.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://marketplace.walmart.com/pro-seller/', notes: 'Research report cites 5% Advanced and 10% Pro referral-fee discounts.' }),
      fact('walmart', { letter: 'P', officialName: 'Post-Purchase Reviews', status: 'ACTIVE', family: 'reviews', definition: 'Incentivised review programme with eligibility and service-fee conditions.', whyItMatters: 'Reviews influence trust and conversion; incentives create direct cost.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://marketplace.walmart.com/post-purchase-reviews/' }),
      fact('walmart', { letter: 'R', officialName: 'Referral fees', status: 'ACTIVE', family: 'fees', definition: 'Category-based referral fees published in a 5–20% range in the research report.', whyItMatters: 'Referral fee is a primary marketplace cost.', scope: 'US marketplace, category-dependent.', economic: { valueMin: 5, valueMax: 20, unit: 'percent' }, impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://marketplace.walmart.com/pricing/' }),
      fact('walmart', { letter: 'R', officialName: 'Repricer', status: 'ACTIVE', family: 'pricing-automation', definition: 'Automated price management with floor/ceiling guards.', whyItMatters: 'Price changes can affect profit and Buy Box/visibility trade-offs.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://marketplace.walmart.com/repricer/' }),
      fact('walmart', { letter: 'S', officialName: 'Sponsored Search', status: 'ACTIVE', family: 'advertising', definition: 'Walmart Connect Sponsored Products, Brands and Videos.', whyItMatters: 'Ad spend is a controllable contribution-profit driver.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.walmartconnect.com/solutions/sponsored-search' }),
      fact('walmart', { letter: 'W', officialName: 'Walmart Fulfillment Services (WFS)', status: 'ACTIVE', family: 'fulfilment', definition: 'First-party fulfilment for eligible items up to defined weight tiers.', whyItMatters: 'WFS fulfilment charges can be the largest variable cost after product cost.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://marketplace.walmart.com/walmart-fulfillment-services-pricing/', economic: { value: 3.45, unit: 'currency', currency: 'USD', scope: '1 lb or less standard fee example in report' }, notes: 'Research report also cites US$2.25/cubic foot long-term storage.' }),
    ],
    limitations: ['Referral fees are category-based.', 'Some programme benefits are eligibility-dependent and time-limited.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  'Rakuten Ichiba': {
    id: 'rakuten-ichiba',
    displayName: 'Rakuten Ichiba',
    model: 'Japanese marketplace',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['JP', 'GLOBAL'],
    keyFamilies: ['seller-console', 'fees', 'fulfilment', 'advertising', 'loyalty', 'api-integration', 'storefront', 'payments-payouts'],
    facts: [
      fact('rakuten', { letter: 'A', officialName: 'Affiliate programme fees', status: 'ACTIVE', family: 'fees', definition: 'Affiliate commission plus system fee tied to affiliate-referred sales.', whyItMatters: 'Affiliate acquisition is a direct cost of sale.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.rakuten.co.jp/ec/pricelist/list03/' }),
      fact('rakuten', { letter: 'B', officialName: 'BOSS / RSL integration', status: 'ACTIVE', family: 'fulfilment', definition: 'Order-management integration that can trigger RSL shipments and inventory sync.', whyItMatters: 'Fulfilment automation can change operational cost and speed.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://logistics.rakuten.co.jp/rsl/overview/' }),
      fact('rakuten', { letter: 'D', officialName: 'D-U-N-S requirement for overseas direct sellers', status: 'ACTIVE', family: 'cross-border', definition: 'Overseas direct sellers can open a shop subject to company screening and market requirements.', whyItMatters: 'Entry requirements must be satisfied before marketplace economics apply.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.rakuten.co.jp/ec/sellinjapan/' }),
      fact('rakuten', { letter: 'E', officialName: 'E-Commerce Consultant (ECC)', status: 'ACTIVE', family: 'seller-console', definition: 'Dedicated post-launch advisory support for operations, promotions, traffic and conversion.', whyItMatters: 'Human operating support can affect execution quality.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.rakuten.co.jp/ec/sellinjapan/' }),
      fact('rakuten', { letter: 'F', officialName: 'Basic plan fee structure', status: 'ACTIVE', family: 'fees', definition: 'Public Basic plan with registration, monthly and variable system fees.', whyItMatters: 'Fixed and variable platform fees materially change unit economics.', scope: 'Basic plan; Japan.', economic: { value: 60000, currency: 'JPY', unit: 'currency', scope: 'registration fee in research report' }, impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.rakuten.co.jp/ec/plan/', notes: 'Research report cites ¥65,000 monthly, 2.0–4.0% PC, 2.5–4.5% mobile, 1.0% points, 0.1% safety, 2.5–3.5% R-Pay; comparison page encoding was corrupted for other tiers.' }),
      fact('rakuten', { letter: 'R', officialName: 'RMS (Rakuten Merchant Server)', status: 'ACTIVE', family: 'seller-console', definition: 'Store-page creation, listings, traffic/CVR and customer analytics console.', whyItMatters: 'Primary merchant operating surface.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://webservice.rms.rakuten.co.jp/enterprise-portal/?lang=en' }),
      fact('rakuten', { letter: 'R', officialName: 'RPP / RPP-EXP / Sales Expansion', status: 'ACTIVE', family: 'advertising', definition: 'Search-result and promotional advertising products.', whyItMatters: 'Paid traffic is a controllable acquisition cost.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://maker-showroom.rakuten.co.jp/solution/service/search/' }),
      fact('rakuten', { letter: 'R', officialName: 'RMS Web Service', status: 'ACTIVE', family: 'api-integration', definition: 'Enterprise API portal for shop data.', whyItMatters: 'Enables integration with back-office systems.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://webservice.rms.rakuten.co.jp/enterprise-portal/?lang=en' }),
      fact('rakuten', { letter: 'R', officialName: 'Rakuten Super Logistics (RSL)', status: 'ACTIVE', family: 'fulfilment', definition: 'Outsourced storage, packing and delivery through Rakuten logistics.', whyItMatters: 'Third-party fulfilment changes unit economics and delivery speed.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://logistics.rakuten.co.jp/rsl/overview/' }),
      fact('rakuten', { letter: 'R', officialName: 'Rakuten Points', status: 'ACTIVE', family: 'loyalty', definition: 'Seller-funded loyalty programme through points fees.', whyItMatters: 'Points expense can be a direct reduction in contribution.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.rakuten.co.jp/ec/sellinjapan/' }),
    ],
    limitations: ['Exact RSL fees were unpublished in the consulted source.', 'Some plan comparison data was encoding-corrupted in the research environment.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  'Mercado Libre': {
    id: 'mercado-libre',
    displayName: 'Mercado Libre',
    model: '3P marketplace across Latin America',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['LATAM'],
    keyFamilies: ['seller-console', 'fulfilment', 'seller-performance', 'advertising', 'fees', 'payments-payouts', 'api-integration', 'cross-border', 'financing'],
    facts: [
      fact('meli', { letter: 'A', officialName: 'Product Ads', status: 'ACTIVE', family: 'advertising', definition: 'Automatic and manual campaigns with ROAS Objetivo and Budget Rollover.', whyItMatters: 'Advertising spend directly changes realized profit.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://knowledgehub.academy.mercadoads.com/product-ads', failureMode: 'Campaigns can be blocked when seller reputation falls to orange/red.' }),
      fact('meli', { letter: 'C', officialName: 'Costs of selling', status: 'ACTIVE', family: 'fees', definition: 'Country-specific Clásica/Premium commission structure plus fixed costs for lower-priced items.', whyItMatters: 'Selling fees are a primary marketplace cost.', scope: 'Mexico example from the research report.', economic: { valueMin: 8, valueMax: 20.5, unit: 'percent', currency: 'MXN', scope: 'clásica 8–16%; premium 12.5–20.5%' }, impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://www.mercadolibre.com.mx/ayuda/Costos-de-vender-un-producto_870', notes: 'Report also cites MXN 35 minimum price and MXN 28/33 fixed cost below thresholds.' }),
      fact('meli', { letter: 'C', officialName: 'Mercado Crédito', status: 'ACTIVE', family: 'financing', definition: 'Working-capital credit offers for eligible sellers.', whyItMatters: 'Working-capital access affects inventory and advertising capacity.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.mercadolibre.com.mx/institucional/hacemos/prestamos-a-vendedores' }),
      fact('meli', { letter: 'F', officialName: 'Mercado Envíos Full', status: 'ACTIVE', family: 'fulfilment', definition: 'Marketplace warehousing and fulfilment in selected Latin American markets.', whyItMatters: 'Fulfilment charges and service levels directly affect unit economics.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://developers.mercadolibre.com.ar/en_us/introduction-products/fulfillment' }),
      fact('meli', { letter: 'G', officialName: 'Global Selling', status: 'ACTIVE', family: 'cross-border', definition: 'One account managing selected Latin American marketplaces with translation and USD payouts.', whyItMatters: 'Changes cross-border reach and payout handling.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://global-selling.mercadolibre.com/landing/how-it-works' }),
      fact('meli', { letter: 'L', officialName: 'MercadoLíder / Gold / Platinum', status: 'ACTIVE', family: 'seller-performance', definition: 'Seller reputation/tier statuses linked to defined sales and performance metrics.', whyItMatters: 'Performance affects exposure and seller benefits.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.mercadolibre.com.mx/ayuda/Como-ser-MercadoLider_864' }),
      fact('meli', { letter: 'R', officialName: 'Reputation system', status: 'ACTIVE', family: 'seller-performance', definition: 'Post-sale reputation based on operational metrics.', whyItMatters: 'Reputation affects exposure and ad eligibility.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.mercadolibre.com.ar/ayuda/variables_reputacion_30193' }),
      fact('meli', { letter: 'R', officialName: 'Developers API rate limits / 429', status: 'ACTIVE', family: 'api-integration', definition: 'Documented over-quota/429 behaviour and quota limits.', whyItMatters: 'Stable integrations need predictable retry/backoff behaviour.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://developers.mercadolibre.com.ar/en_us/net/rate-limit-429-error', failureMode: '429/over-quota when limits are exceeded.' }),
    ],
    limitations: ['Fees and financing vary by country.', 'The research report intentionally does not turn one country’s rate card into a universal Mercado Libre fee.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  'JD.com': {
    id: 'jd',
    displayName: 'JD.com',
    model: 'Chinese 3P/POP marketplace with integrated logistics',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['CN', 'GLOBAL'],
    keyFamilies: ['seller-console', 'fulfilment', 'advertising', 'seller-performance', 'api-integration', 'cross-border', 'pricing-automation', 'storefront', 'ai-operations'],
    facts: [
      fact('jd', { letter: 'F', officialName: 'JD Logistics', status: 'ACTIVE', family: 'fulfilment', definition: 'Integrated logistics and warehousing network for seller fulfilment.', whyItMatters: 'Fulfilment service level and cost directly affect margin.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://open.jdl.com/#/home' }),
      fact('jd', { letter: 'J', officialName: 'JD Merchant Open Platform', status: 'ACTIVE', family: 'api-integration', definition: 'Merchant product/order/finance/marketing/service API platform replacing the legacy JOS centre.', whyItMatters: 'Provides current integration entry point.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', effectiveDate: '2026-08-30', sourceUrl: 'https://open.jd.com/v2/#/index', notes: 'Legacy JOS developer centre migrated into the Merchant Open Platform by the date above.' }),
      fact('jd', { letter: 'J', officialName: 'Jingzhuntong', status: 'ACTIVE', family: 'advertising', definition: 'Merchant marketing platform for paid traffic and search advertising.', whyItMatters: 'Paid traffic affects acquisition cost.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://jzt.jd.com/gw/solution' }),
      fact('jd', { letter: 'M', officialName: 'JD Marketing 360 / Jingmai', status: 'ACTIVE', family: 'ai-operations', definition: 'Merchant workbench and marketing platform with Spring Dawn AI tooling.', whyItMatters: 'Operational tooling can reduce setup and execution cost.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://jdcorporateblog.com/jd-com-announces-enhanced-spring-dawn-initiative-with-new-ai-service-package/' }),
      fact('jd', { letter: 'P', officialName: 'POP store types', status: 'ACTIVE', family: 'storefront', definition: 'Flagship, Specialty, Multi-brand, Standard Enterprise, Individual and Individual-business store types.', whyItMatters: 'Store type changes eligibility and document requirements.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://lai-pop.jd.com/lainew/index?menuId=2' }),
      fact('jd', { letter: 'S', officialName: 'Search Express', status: 'ACTIVE', family: 'advertising', definition: 'Real-time bidding ads with keyword/product targeting and intelligent bidding.', whyItMatters: 'Advertising cost affects contribution profit.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://jzt.jd.com/gw/solution' }),
      fact('jd', { letter: 'S', officialName: 'Store rating / Five Star Store', status: 'ACTIVE', family: 'seller-performance', definition: 'Store rating designation disclosed in JD annual reporting.', whyItMatters: 'Performance affects seller visibility and confidence.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1549802/000119312525083473/d871796d20f.htm' }),
      fact('jd', { letter: 'W', officialName: 'Warehousing networks', status: 'ACTIVE', family: 'fulfilment', definition: 'JD Logistics warehouse network plus Open Warehouse Platform capacity.', whyItMatters: 'Warehouse coverage supports fulfilment and inventory positioning.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1549802/000119312525083473/d871796d20f.htm' }),
    ],
    limitations: ['Merchant fee rules are often behind login or category-specific.', 'Some localised JD tooling is not publicly available in English.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  Etsy: {
    id: 'etsy',
    displayName: 'Etsy',
    model: '3P marketplace for handmade/vintage/original goods',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['GLOBAL'],
    keyFamilies: ['seller-console', 'advertising', 'fees', 'payments-payouts', 'seller-performance', 'api-integration', 'reviews', 'storefront'],
    facts: [
      fact('etsy', { letter: 'A', officialName: 'API authentication', status: 'ACTIVE', family: 'api-integration', definition: 'x-api-key header plus OAuth 2.0 token authentication.', whyItMatters: 'Stable integrations require valid authentication and token handling.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://developers.etsy.com/documentation/essentials/requests', failureMode: '401 when key or token is invalid.' }),
      fact('etsy', { letter: 'A', officialName: 'Etsy Ads', status: 'ACTIVE', family: 'advertising', definition: 'On-site ads with daily budget controls.', whyItMatters: 'Ad spend reduces realized contribution profit.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', economic: { valueMin: 1, valueMax: 25, unit: 'currency', currency: 'USD', scope: 'daily budget range in research report' }, sourceUrl: 'https://help.etsy.com/hc/en-us/articles/360033701174-How-to-Set-Up-and-Manage-an-Etsy-Ads-Campaign' }),
      fact('etsy', { letter: 'D', officialName: 'Etsy Payments deposits', status: 'ACTIVE', family: 'payments-payouts', definition: 'Scheduled deposits with holds/reserves and instant-transfer options for eligible sellers.', whyItMatters: 'Payout timing affects cash flow and reserves.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://help.etsy.com/hc/en-us/articles/360046998234-How-to-Receive-Your-Etsy-Payments-Deposit' }),
      fact('etsy', { letter: 'D', officialName: 'Digital listings', status: 'ACTIVE', family: 'catalogue', definition: 'Digital-download listing support with file-count/size limits.', whyItMatters: 'Digital products have a different fulfilment cost structure.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://help.etsy.com/hc/en-us/articles/115015628347-How-to-Manage-Your-Digital-Listings' }),
      fact('etsy', { letter: 'F', officialName: 'Etsy fees', status: 'ACTIVE', family: 'fees', definition: 'Listing, transaction, currency-conversion and Pattern charges.', whyItMatters: 'Core marketplace costs directly reduce contribution profit.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', economic: { value: 6.5, unit: 'percent', scope: 'transaction fee in research report' }, effectiveDate: '2026-02-13', sourceUrl: 'https://www.etsy.com/legal/fees/', notes: 'Report also cites US$0.20 listing fee per four months and 2.5% currency conversion fee.' }),
      fact('etsy', { letter: 'O', officialName: 'Offsite Ads', status: 'ACTIVE', family: 'advertising', definition: 'Etsy-run external advertising charged on attributed orders.', whyItMatters: 'Attributed offsite sales carry an incremental acquisition fee.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', economic: { value: 15, valueMin: 12, unit: 'percent', scope: '12% for shops at/above US$10k trailing 365-day sales; 15% otherwise; mandatory above threshold' }, sourceUrl: 'https://help.etsy.com/hc/en-us/articles/360000338367-How-Etsy-s-Offsite-Ads-Work' }),
      fact('etsy', { letter: 'P', officialName: 'Etsy Plus', status: 'ACTIVE', family: 'fees', definition: 'Paid seller plan with listing/ad credits and customization.', whyItMatters: 'Fixed subscription can matter at low volume.', impact: 'LOW', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', economic: { value: 10, unit: 'currency', currency: 'USD', scope: 'monthly in research report' }, sourceUrl: 'https://www.etsy.com/legal/fees/' }),
      fact('etsy', { letter: 'P', officialName: 'Purchase Protection Program for sellers', status: 'ACTIVE', family: 'payments-payouts', definition: 'Etsy-funded protection for qualifying orders up to a stated limit when seller requirements are met.', whyItMatters: 'Can reduce certain refund exposure.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', economic: { value: 250, unit: 'currency', currency: 'USD', scope: 'qualifying order protection cap in research report' }, effectiveDate: '2026-07-09', sourceUrl: 'https://www.etsy.com/legal/policy/purchase-protection-program-for-sellers/34509585385' }),
      fact('etsy', { letter: 'R', officialName: 'Open API v3 rate limits', status: 'ACTIVE', family: 'api-integration', definition: 'Per-app per-second and per-day limits with headers and retry-after guidance.', whyItMatters: 'Prevents integrations from failing under volume.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', economic: { value: 150, unit: 'calls-per-second', scope: 'example in research report' }, sourceUrl: 'https://developers.etsy.com/documentation/essentials/rate-limits', failureMode: 'HTTP 429 when limits are exceeded.' }),
      fact('etsy', { letter: 'R', officialName: 'Payment account reserves', status: 'ACTIVE', family: 'payments-payouts', definition: 'Risk-based reserves with releases over time.', whyItMatters: 'Reserves affect cash availability without necessarily changing product P&L.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://help.etsy.com/hc/en-us/articles/360058722214-What-is-a-Payment-Account-Reserve' }),
      fact('etsy', { letter: 'S', officialName: 'Share & Save', status: 'ACTIVE', family: 'advertising', definition: 'Seller-shared-link programme that can return a fee credit on qualifying orders.', whyItMatters: 'Can change effective acquisition economics.', impact: 'LOW', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', economic: { value: 4, unit: 'percent', scope: 'fee refund in research report' }, sourceUrl: 'https://www.etsy.com/legal/fees/' }),
      fact('etsy', { letter: 'S', officialName: 'Star Seller', status: 'ACTIVE', family: 'seller-performance', definition: 'Performance badge based on response time, rating, shipping and minimum sales.', whyItMatters: 'Performance badge can influence trust and seller visibility.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://www.etsy.com/starseller' }),
    ],
    limitations: ['Fee policy is market and payment-method dependent in detail.', 'Offsite Ads attribution has a defined window and eligibility threshold.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  Flipkart: {
    id: 'flipkart',
    displayName: 'Flipkart',
    model: '3P marketplace in India',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['IN'],
    keyFamilies: ['seller-console', 'fulfilment', 'advertising', 'fees', 'seller-performance', 'api-integration', 'brand-ip', 'storefront', 'pricing-automation'],
    facts: [
      fact('flipkart', { letter: 'A', officialName: 'API access model', status: 'ACTIVE', family: 'api-integration', definition: 'Developer Access with Self Access or Third Party authorization and token endpoint.', whyItMatters: 'Enables ERP and automation integrations.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.flipkart.com/api-docs/FMSAPI.html', failureMode: 'Smart fulfilment is not supported via API per the report.' }),
      fact('flipkart', { letter: 'A', officialName: 'Flipkart Ads', status: 'ACTIVE', family: 'advertising', definition: 'CPC and Smart ROI campaigns.', whyItMatters: 'Advertising spend reduces contribution profit.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://seller.flipkart.com/seller-blog/flipkart-ads', notes: 'Research report stresses that advertising does not guarantee purchases.' }),
      fact('flipkart', { letter: 'B', officialName: 'Brand Assure / Flipkart Brand Hub', status: 'ACTIVE', family: 'brand-ip', definition: 'Brand analytics and authorised-seller/infringement tools.', whyItMatters: 'Brand control can reduce catalogue and IP leakage.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://brandhub.flipkart.com/' }),
      fact('flipkart', { letter: 'B', officialName: 'Bulk listing update API', status: 'ACTIVE', family: 'api-integration', definition: 'Bulk listing update endpoint with a ten-FSN call limit.', whyItMatters: 'Bulk catalogue automation is essential for large assortment sellers.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', economic: { value: 10, unit: 'count', scope: 'FSNs per bulk update call in research report' }, sourceUrl: 'https://seller.flipkart.com/api-docs/FMSAPI.html' }),
      fact('flipkart', { letter: 'F', officialName: 'Fees and commission', status: 'ACTIVE', family: 'fees', definition: 'Commission/fixed/closing/shipping fee structure with exact full card inside seller dashboard.', whyItMatters: 'Marketplace fees are core profit inputs.', scope: 'India marketplace.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://seller.flipkart.com/fees-and-commission', notes: 'Research report notes 0% commission for products under ₹1,000 and 0% across Fashion, but exact full rate card requires seller login.' }),
      fact('flipkart', { letter: 'F', officialName: 'Fulfilment by Flipkart (FBF)', status: 'ACTIVE', family: 'fulfilment', definition: 'Invitation-based end-to-end fulfilment for eligible sellers.', whyItMatters: 'Fulfilment cost and service level are direct unit-economics inputs.', impact: 'HIGH', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://seller.flipkart.com/seller-blog/fulfilment-by-flipkart' }),
      fact('flipkart', { letter: 'F', officialName: 'FAssured', status: 'ACTIVE', family: 'seller-performance', definition: 'Reliability badge tied to quality checks, delivery promise and returns.', whyItMatters: 'Performance and fulfilment quality influence customer trust and visibility.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.flipkart.com/seller-blog/flipkart-assured' }),
      fact('flipkart', { letter: 'G', officialName: 'Growth tools', status: 'ACTIVE', family: 'pricing-automation', definition: 'Price Recommendations, Selection Insights, Inventory Health and partner-service tooling.', whyItMatters: 'Helps improve price, assortment and inventory decisions.', impact: 'MEDIUM', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.flipkart.com/grow' }),
      fact('flipkart', { letter: 'N', officialName: 'Non-FBF seller fulfilment', status: 'ACTIVE', family: 'fulfilment', definition: 'Seller stores and packs; Flipkart agent pickup to broad pincode coverage.', whyItMatters: 'Alternative fulfilment path changes unit cost and service responsibility.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CALCULATION_INPUT', sourceUrl: 'https://seller.flipkart.com/sell-online', failureMode: 'READY_TO_DISPATCH breaches can count against seller tier.' }),
      fact('flipkart', { letter: 'O', officialName: 'Order Management API states', status: 'ACTIVE', family: 'api-integration', definition: 'Standard order/return state transitions for fulfilment.', whyItMatters: 'Operational automation depends on correct lifecycle states.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.flipkart.com/api-docs/order-api-docs/OMAPIOverview.html' }),
      fact('flipkart', { letter: 'P', officialName: 'Seller payments', status: 'ACTIVE', family: 'payments-payouts', definition: 'Settlement begins at pickup with tier-dependent speed.', whyItMatters: 'Cash timing affects working capital.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.flipkart.com/fees-and-commission', notes: 'Research report cites as fast as three days after dispatch for some tiers.' }),
      fact('flipkart', { letter: 'S', officialName: 'Seller tiers', status: 'ACTIVE', family: 'seller-performance', definition: 'Bronze, Silver, Gold and Platinum tiers based on sales and operational metrics.', whyItMatters: 'Tier can change fixed fees and payout speed.', impact: 'HIGH', adoption: 'HIGH', calculationRole: 'CONTEXT_ONLY', sourceUrl: 'https://seller.flipkart.com/seller-blog/flipkart-seller-tier' }),
      fact('flipkart', { letter: 'S', officialName: 'Shopsy', status: 'ACTIVE', family: 'storefront', definition: 'Value marketplace with 0% commission across verticals in the research report.', whyItMatters: 'Different channel economics can change marketplace choice.', impact: 'MEDIUM', adoption: 'MEDIUM', calculationRole: 'CALCULATION_INPUT', economic: { value: 0, unit: 'percent', scope: 'commission in research report' }, sourceUrl: 'https://seller.flipkart.com/shopsy' }),
    ],
    limitations: ['Full Flipkart rate card is not public in the research report and requires seller login.', 'Exact shipping/closing fees are therefore not auto-applied by ProfitPilot.'],
    source: researchSource,
    retrievalDate: RETRIEVAL_DATE,
  },

  // Existing calculator marketplaces not covered by the supplied A–Z report.
  Meesho: {
    id: 'meesho',
    displayName: 'Meesho',
    model: 'Indian social-commerce marketplace',
    researchStatus: 'UNVERIFIED',
    verification: 'UNCLASSIFIED',
    calculatorSupported: true,
    researchedMarkets: ['IN'],
    keyFamilies: [],
    facts: [],
    limitations: ['Not covered by the supplied A–Z research report. Existing calculator support is intentionally kept separate from research verification.'],
    source: 'Not covered by supplied research report',
    retrievalDate: RETRIEVAL_DATE,
  },
  'TikTok Shop': {
    id: 'tiktok-shop',
    displayName: 'TikTok Shop',
    model: 'Social-commerce marketplace',
    researchStatus: 'UNVERIFIED',
    verification: 'UNCLASSIFIED',
    calculatorSupported: true,
    researchedMarkets: ['US', 'DE', 'FR', 'ES', 'JP'],
    keyFamilies: [],
    facts: [],
    limitations: ['Not covered by the supplied A–Z research report. Existing calculator support is intentionally kept separate from research verification.'],
    source: 'Not covered by supplied research report',
    retrievalDate: RETRIEVAL_DATE,
  },
};

export const platformLifecycleNotices: PlatformLifecycleNotice[] = [
  {
    platform: 'eBay',
    name: 'eBay Bucks',
    status: 'DISCONTINUED',
    date: '2024-04-02',
    reason: 'The seller feature inventory identifies the eBay Bucks programme as ended on 2 April 2024.',
    sourceUrl: 'https://www.ebay.com/help/buying/paying-items/earning-using-ebay-bucks?id=4638',
  },
  {
    platform: 'eBay',
    name: 'Global Shipping Program (GSP)',
    status: 'RENAMED',
    date: '2026-08',
    replacement: 'eBay International Shipping',
    reason: 'The researched eBay International Shipping documentation states that relevant-market enrolment replaces legacy GSP participation.',
    sourceUrl: 'https://www.ebay.co.uk/sellercentre/postage/ebay-international-shipping',
  },
  {
    platform: 'Shopify',
    name: 'Oberlo',
    status: 'DISCONTINUED',
    date: '2022-06-15',
    reason: 'The report records Oberlo as shut down and explicitly excludes it from the active feature index.',
    sourceUrl: 'https://community.shopify.com/t/is-oberlo-no-longer-available-on-the-shopify-app-list/121465',
  },
  {
    platform: 'Mercado Libre',
    name: 'Mercado Shops',
    status: 'DISCONTINUED',
    date: '2025-12-31',
    reason: 'The supplied research records active stores as usable only through 31 December 2025 after the earlier new-store closure.',
    sourceUrl: 'https://www.mercadolibre.com.mx/ayuda/Costos-de-vender-un-producto_870',
  },
  {
    platform: 'JD.com',
    name: 'JOS developer centre',
    status: 'RENAMED',
    date: '2026-08-30',
    replacement: 'JD Merchant Open Platform',
    reason: 'The research report says JOS was migrating into the current Merchant Open Platform by 30 August 2026.',
    sourceUrl: 'http://jos.jd.com/',
  },
  {
    platform: 'Etsy',
    name: 'Adobe and Hover offers inside Etsy Plus',
    status: 'DISCONTINUED',
    date: '2026-02-21',
    reason: 'The research report records these partner offers as ended on 21 February 2026.',
    sourceUrl: 'https://www.etsy.com/legal/fees/',
  },
];

export const platformOrder = [
  'Amazon',
  'Alibaba.com / Tmall / Taobao',
  'eBay',
  'Shopify',
  'Walmart Marketplace',
  'Rakuten Ichiba',
  'Mercado Libre',
  'JD.com',
  'Etsy',
  'Flipkart',
  'Meesho',
  'TikTok Shop',
] as const;

export const platformFeatureFamilies = FAMILIES;

export function getPlatformResearch(platform: string): PlatformResearch | undefined {
  if (platformResearch[platform]) return platformResearch[platform];
  const aliases: Record<string, string> = {
    Walmart: 'Walmart Marketplace',
    'Alibaba / Tmall / Taobao': 'Alibaba.com / Tmall / Taobao',
    'Alibaba.com / Tmall / Taobao': 'Alibaba.com / Tmall / Taobao',
  };
  const mapped = aliases[platform];
  return mapped ? platformResearch[mapped] : undefined;
}

export function isResearchVerified(platform: string): boolean {
  return getPlatformResearch(platform)?.verification === 'VERIFIED';
}

export function getPlatformFeatureCount(platform: string): number {
  return getPlatformResearch(platform)?.facts.length ?? 0;
}

export function getActivePlatformFacts(platform: string): PlatformFact[] {
  return getPlatformResearch(platform)?.facts.filter((item) => item.status === 'ACTIVE') ?? [];
}

export function getPlatformEconomicFacts(platform: string): PlatformFact[] {
  return getActivePlatformFacts(platform).filter((item) => item.calculationRole === 'CALCULATION_INPUT' && item.economic);
}

export function getPlatformResearchSummary(platform: string) {
  const research = getPlatformResearch(platform);
  if (!research) return { status: 'UNAVAILABLE' as const, text: 'No platform research metadata is available for this marketplace.' };
  if (research.verification !== 'VERIFIED') {
    return { status: research.verification, text: 'Platform capability research is not verified for this marketplace in the supplied A–Z report.' };
  }
  return {
    status: research.researchStatus,
    text: `Verified in the supplied official-source research report; ${research.facts.length} researched capabilities are indexed (retrieved ${research.retrievalDate}).`,
  };
}

export function getPlatformDecisionContext(platform: string) {
  const research = getPlatformResearch(platform);
  if (!research) return null;
  const active = getActivePlatformFacts(platform);
  const economics = getPlatformEconomicFacts(platform);
  const families = Array.from(new Set(active.map((x) => FAMILIES[x.family])));
  return {
    research,
    active,
    economics,
    familyNames: families,
    lifecycleNotices: platformLifecycleNotices.filter((x) => x.platform === research.displayName),
  };
}
