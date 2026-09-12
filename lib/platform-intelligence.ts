/**
 * Platform Intelligence
 *
 * Research-backed metadata for seller-facing platform context.
 * This layer intentionally does NOT pretend to be a live API integration
 * or a complete fee schedule. It separates researched platform facts from
 * the calculator's economic configuration.
 */

export type PlatformResearchStatus =
  | 'ACTIVE'
  | 'RENAMED'
  | 'DISCONTINUED'
  | 'ANNOUNCED-NOT-LIVE'
  | 'UNVERIFIED';

export type PlatformVerificationState =
  | 'VERIFIED'
  | 'UNAVAILABLE'
  | 'STALE'
  | 'UNCLASSIFIED';

export type PlatformFeatureFamily =
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
  | 'ai-operations';

export type PlatformFeatureFact = {
  officialName: string;
  status: PlatformResearchStatus;
  definition: string;
  family: PlatformFeatureFamily;
  scope?: string;
  notes?: string;
};

export type PlatformResearch = {
  id: string;
  displayName: string;
  researchStatus: PlatformResearchStatus;
  verification: PlatformVerificationState;
  calculatorSupported: boolean;
  researchedMarkets: string[];
  keyFamilies: PlatformFeatureFamily[];
  facts: PlatformFeatureFact[];
  source: string;
  retrievalDate: string;
  effectiveDate?: string;
  limitations: string[];
};

const REPORT_SOURCE = 'Supplied E-Commerce Platform Seller Features A–Z research report';
const RETRIEVAL_DATE = '2026-09-12';

/**
 * The report was researched from official platform sources.
 * Exact page URLs are intentionally not fabricated here because the supplied
 * parsed PDF content does not expose its inline URL targets. The application
 * therefore exposes the research provenance without inventing URL strings.
 */
export const platformResearch: Record<string, PlatformResearch> = {
  Amazon: {
    id: 'amazon',
    displayName: 'Amazon',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['US', 'IN', 'DE', 'FR', 'ES', 'JP'],
    keyFamilies: ['fulfilment', 'seller-performance', 'advertising', 'fees', 'payments-payouts', 'api-integration', 'brand-ip', 'cross-border'],
    facts: [
      { officialName: 'FBA', status: 'ACTIVE', definition: 'First-party fulfilment with storage, picking, packing and shipping.', family: 'fulfilment' },
      { officialName: 'Account Health Rating', status: 'ACTIVE', definition: 'Seller policy-compliance score that can affect account standing.', family: 'seller-performance' },
      { officialName: 'Sponsored Products / Sponsored Brands / Sponsored Display', status: 'ACTIVE', definition: 'Native sponsored advertising products.', family: 'advertising' },
      { officialName: 'SP-API usage plans', status: 'ACTIVE', definition: 'Token-bucket style API throttling and usage limits.', family: 'api-integration' },
    ],
    limitations: ['Category-specific and country-specific fee details are not represented by this metadata layer.', 'Some platform rules are plan/account scoped.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  'Alibaba.com / Tmall / Taobao': {
    id: 'alibaba-group',
    displayName: 'Alibaba / Tmall / Taobao',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['CN', 'GLOBAL'],
    keyFamilies: ['advertising', 'cross-border', 'payments-payouts', 'api-integration', 'loyalty', 'ai-operations'],
    facts: [
      { officialName: 'Alibaba.com Advertising Suite', status: 'ACTIVE', definition: 'Native keyword, sponsored and smart marketing products.', family: 'advertising' },
      { officialName: 'Trade Assurance', status: 'ACTIVE', definition: 'Order-protection programme covering defined payment, quality and shipping terms.', family: 'payments-payouts' },
      { officialName: 'Tmall Global entry models', status: 'ACTIVE', definition: 'Cross-border entry models with qualification and documentation requirements.', family: 'cross-border' },
      { officialName: 'Taobao Open Platform error codes', status: 'ACTIVE', definition: 'Official API error code and sub-code model.', family: 'api-integration' },
    ],
    limitations: ['Some Tmall domestic tooling was not publicly reachable in the research pass.', 'Tmall Global deposit and annual fee amounts were not published in the cited official source.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  eBay: {
    id: 'ebay',
    displayName: 'eBay',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['GLOBAL'],
    keyFamilies: ['payments-payouts', 'advertising', 'fees', 'seller-performance', 'api-integration', 'cross-border'],
    facts: [
      { officialName: 'Seller Hub', status: 'ACTIVE', definition: 'Central seller console covering listings, orders, marketing, advertising, performance, research, payments and reports.', family: 'storefront' },
      { officialName: 'Promoted Listings General', status: 'ACTIVE', definition: 'Cost-per-sale promoted listing product with attributed sales.', family: 'advertising' },
      { officialName: 'Promoted Listings Priority', status: 'ACTIVE', definition: 'Cost-per-click promoted listing product.', family: 'advertising' },
      { officialName: 'eBay International Shipping', status: 'ACTIVE', definition: 'eBay-managed international export and delivery programme replacing legacy GSP enrolment in relevant markets.', family: 'cross-border' },
      { officialName: 'Managed Payments', status: 'ACTIVE', definition: 'Seller payment processing and payout system with payout timing and holds.', family: 'payments-payouts' },
    ],
    limitations: ['Exact category-level selling fees depend on the applicable rate card and seller context.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  Shopify: {
    id: 'shopify',
    displayName: 'Shopify',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['GLOBAL'],
    keyFamilies: ['fees', 'payments-payouts', 'multichannel-fulfilment', 'api-integration', 'storefront', 'financing', 'ai-operations'],
    facts: [
      { officialName: 'Shopify Markets', status: 'ACTIVE', definition: 'International selling configuration for localised prices, languages, domains, catalogues and taxes.', family: 'storefront' },
      { officialName: 'Shopify Payments', status: 'ACTIVE', definition: 'Native payment processing with plan and gateway-dependent charges.', family: 'payments-payouts' },
      { officialName: 'Admin API rate limits', status: 'ACTIVE', definition: 'Leaky-bucket GraphQL Admin API limits that vary by plan.', family: 'api-integration' },
      { officialName: 'Shopify Fulfillment Network', status: 'ACTIVE', definition: 'Fulfilment delivered through integrated logistics partners.', family: 'multichannel-fulfilment' },
      { officialName: 'Shopify Capital', status: 'ACTIVE', definition: 'Data-driven funding offers subject to market and eligibility rules.', family: 'financing' },
    ],
    limitations: ['Plan-specific rates and feature availability vary by country and configuration.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  'Walmart Marketplace': {
    id: 'walmart',
    displayName: 'Walmart Marketplace',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['US', 'GLOBAL_SELLER_PROGRAMS'],
    keyFamilies: ['fulfilment', 'seller-performance', 'advertising', 'fees', 'payments-payouts', 'api-integration', 'brand-ip', 'multichannel-fulfilment', 'cross-border', 'financing', 'pricing-automation'],
    facts: [
      { officialName: 'Walmart Fulfillment Services (WFS)', status: 'ACTIVE', definition: 'First-party fulfilment for eligible marketplace inventory.', family: 'fulfilment' },
      { officialName: 'Pro Seller programme', status: 'ACTIVE', definition: 'Seller performance tiering linked to defined service metrics and benefits.', family: 'seller-performance' },
      { officialName: 'Walmart Connect Sponsored Search', status: 'ACTIVE', definition: 'Native sponsored advertising products.', family: 'advertising' },
      { officialName: 'Listing Quality', status: 'ACTIVE', definition: 'Quality and discoverability score with eligibility implications.', family: 'seller-performance' },
      { officialName: 'Multichannel Solutions', status: 'ACTIVE', definition: 'WFS fulfilment for eligible off-Walmart channels and own-site orders.', family: 'multichannel-fulfilment' },
    ],
    limitations: ['Some capital pricing details and international onboarding constraints are not fully public.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  'Rakuten Ichiba': {
    id: 'rakuten-ichiba',
    displayName: 'Rakuten Ichiba',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['JP', 'GLOBAL'],
    keyFamilies: ['fees', 'fulfilment', 'advertising', 'loyalty', 'api-integration', 'storefront', 'payments-payouts'],
    facts: [
      { officialName: 'RMS (Rakuten Merchant Server)', status: 'ACTIVE', definition: 'Merchant storefront, listing, traffic and customer-analytics console.', family: 'storefront' },
      { officialName: 'Rakuten Super Logistics (RSL)', status: 'ACTIVE', definition: 'Outsourced storage, packing and delivery service.', family: 'fulfilment' },
      { officialName: 'RPP / RPP-EXP / Sales Expansion', status: 'ACTIVE', definition: 'Native search and promotional advertising products.', family: 'advertising' },
      { officialName: 'Rakuten Points', status: 'ACTIVE', definition: 'Seller-funded loyalty programme through points fees.', family: 'loyalty' },
    ],
    limitations: ['Some plan comparison pages were encoding-corrupted in the research environment.', 'RSL exact rates were not publicly available in the consulted source.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  'Mercado Libre': {
    id: 'mercado-libre',
    displayName: 'Mercado Libre',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['LATAM'],
    keyFamilies: ['fulfilment', 'seller-performance', 'advertising', 'fees', 'payments-payouts', 'api-integration', 'cross-border', 'financing'],
    facts: [
      { officialName: 'Mercado Envíos Full', status: 'ACTIVE', definition: 'Marketplace fulfilment service using platform warehouses in selected Latin American markets.', family: 'fulfilment' },
      { officialName: 'Mercado Ads / Product Ads', status: 'ACTIVE', definition: 'Native advertising with manual/automatic campaigns and ROAS targeting options.', family: 'advertising' },
      { officialName: 'Reputation / MercadoLíder', status: 'ACTIVE', definition: 'Post-sale reputation and seller tiering that can affect exposure and eligibility.', family: 'seller-performance' },
      { officialName: 'Global Selling', status: 'ACTIVE', definition: 'Cross-border selling through one account across selected Latin American marketplaces.', family: 'cross-border' },
    ],
    limitations: ['Fees and financing rates vary by country and are not represented as a universal value.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  'JD.com': {
    id: 'jd',
    displayName: 'JD.com',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: false,
    researchedMarkets: ['CN', 'GLOBAL'],
    keyFamilies: ['fulfilment', 'advertising', 'seller-performance', 'api-integration', 'cross-border', 'pricing-automation', 'storefront', 'ai-operations'],
    facts: [
      { officialName: 'JD Logistics', status: 'ACTIVE', definition: 'Integrated logistics and warehousing network for seller fulfilment.', family: 'fulfilment' },
      { officialName: 'JD Merchant Open Platform', status: 'ACTIVE', definition: 'Successor platform for merchant product, order, finance, marketing and service APIs.', family: 'api-integration' },
      { officialName: 'Jingzhuntong', status: 'ACTIVE', definition: 'Merchant marketing platform including paid traffic and search-ad products.', family: 'advertising' },
      { officialName: 'Jingmai', status: 'ACTIVE', definition: 'Merchant workbench and marketing platform.', family: 'storefront' },
      { officialName: 'JD Business Intelligence', status: 'ACTIVE', definition: 'Store, traffic, product, conversion and competitor analytics.', family: 'ai-operations' },
    ],
    limitations: ['Some merchant fee rules and API errors are login-gated.', 'JOS was transitioning to the JD Merchant Open Platform in 2026 and should not be treated as the current developer platform.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  Etsy: {
    id: 'etsy',
    displayName: 'Etsy',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['GLOBAL'],
    keyFamilies: ['advertising', 'fees', 'payments-payouts', 'api-integration', 'reviews', 'storefront'],
    facts: [
      { officialName: 'Etsy Ads', status: 'ACTIVE', definition: 'Native on-site advertising with budget controls.', family: 'advertising' },
      { officialName: 'Offsite Ads', status: 'ACTIVE', definition: 'External Etsy-run advertising with attributed-order fees.', family: 'advertising' },
      { officialName: 'Star Seller', status: 'ACTIVE', definition: 'Seller-performance badge based on response, rating and shipping metrics.', family: 'seller-performance' },
      { officialName: 'Etsy Payments reserves', status: 'ACTIVE', definition: 'Risk-based funds reserves that can delay availability.', family: 'payments-payouts' },
      { officialName: 'Open API v3', status: 'ACTIVE', definition: 'Seller API with published rate-limit headers and quotas.', family: 'api-integration' },
    ],
    limitations: ['Etsy fees depend on listing, transaction, payment and advertising circumstances.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  Flipkart: {
    id: 'flipkart',
    displayName: 'Flipkart',
    researchStatus: 'ACTIVE',
    verification: 'VERIFIED',
    calculatorSupported: true,
    researchedMarkets: ['IN'],
    keyFamilies: ['fulfilment', 'seller-performance', 'advertising', 'fees', 'payments-payouts', 'api-integration', 'brand-ip', 'pricing-automation'],
    facts: [
      { officialName: 'Fulfilment by Flipkart (FBF)', status: 'ACTIVE', definition: 'Invitation/eligibility-based end-to-end fulfilment.', family: 'fulfilment' },
      { officialName: 'Seller tiers', status: 'ACTIVE', definition: 'Performance tiers including Bronze, Silver, Gold and Platinum with fee/payout effects.', family: 'seller-performance' },
      { officialName: 'Flipkart Ads', status: 'ACTIVE', definition: 'CPC and Smart ROI native advertising products.', family: 'advertising' },
      { officialName: 'Brand Assure', status: 'ACTIVE', definition: 'Brand-protection and growth tooling for eligible registered brands.', family: 'brand-ip' },
      { officialName: 'Grow tools', status: 'ACTIVE', definition: 'Seller tools including price recommendations, inventory health and selection insights.', family: 'pricing-automation' },
    ],
    limitations: ['The full fee card is dashboard-restricted in the research pass.', 'API limitations and some seller tooling are not fully public.'],
    source: REPORT_SOURCE,
    retrievalDate: RETRIEVAL_DATE,
  },
  Meesho: {
    id: 'meesho',
    displayName: 'Meesho',
    researchStatus: 'UNVERIFIED',
    verification: 'UNCLASSIFIED',
    calculatorSupported: true,
    researchedMarkets: ['IN'],
    keyFamilies: [],
    facts: [],
    limitations: ['Meesho was not one of the ten platforms covered by the supplied A–Z research report. Existing calculator support therefore remains based on the app\'s own configuration and must not be represented as research-verified here.'],
    source: 'Not covered by supplied research report',
    retrievalDate: RETRIEVAL_DATE,
  },
  'TikTok Shop': {
    id: 'tiktok-shop',
    displayName: 'TikTok Shop',
    researchStatus: 'UNVERIFIED',
    verification: 'UNCLASSIFIED',
    calculatorSupported: true,
    researchedMarkets: ['US', 'DE', 'FR', 'ES', 'JP'],
    keyFamilies: [],
    facts: [],
    limitations: ['TikTok Shop was not one of the ten platforms covered by the supplied A–Z research report. Existing calculator support therefore remains based on the app\'s own configuration and must not be represented as research-verified here.'],
    source: 'Not covered by supplied research report',
    retrievalDate: RETRIEVAL_DATE,
  },
};

export function getPlatformResearch(platform: string): PlatformResearch | undefined {
  return platformResearch[platform];
}

export function isResearchVerified(platform: string): boolean {
  return platformResearch[platform]?.verification === 'VERIFIED';
}

export function getPlatformResearchSummary(platform: string) {
  const research = getPlatformResearch(platform);
  if (!research) {
    return {
      status: 'UNAVAILABLE' as const,
      text: 'No platform research metadata is available for this marketplace.'
    };
  }
  if (research.verification !== 'VERIFIED') {
    return {
      status: research.verification,
      text: 'Platform research is not verified for this marketplace in the supplied report.'
    };
  }
  return {
    status: research.researchStatus,
    text: `Research verified from official-source material in the supplied report; retrieved ${research.retrievalDate}.`
  };
}
