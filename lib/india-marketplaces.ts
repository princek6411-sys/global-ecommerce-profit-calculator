export type FlipkartFulfillment = 'FBF' | 'NFBF';
export type FlipkartPaymentMode = 'Prepaid' | 'COD';
export type FlipkartZone = 'Local' | 'Zonal' | 'National';

export const FLIPKART_SOURCE = 'https://seller.flipkart.com/fees-and-commission';
export const FLIPKART_ZERO_COMMISSION_SOURCE = 'https://stories.flipkart.com/announcement/flipkart-launches-zero-commission-model-for-products-below-rs-1-000-strengthens-seller-success-with-unmatched-supply-chain-reliability-and-technology';
export const FLIPKART_FASHION_SOURCE = 'https://stories.flipkart.com/announcement/flipkart-expands-zero-commission-across-fashion-empowering-sellers-and-accelerating-the-growth-of-indias-fashion-ecosystem';
export const MEESHO_SOURCE = 'https://supplier.meesho.com/sell-online/shirts';

export type IndiaMarketplaceInputs = {
  sellingPrice: number;
  category: string;
  fulfillment: FlipkartFulfillment;
  paymentMode: FlipkartPaymentMode;
  zone: FlipkartZone;
  packedWeightKg: number;
};

export function isFlipkartZeroCommissionEligible(sellingPrice: number, category: string) {
  const priceEligible = sellingPrice > 0 && sellingPrice < 1000;
  const fashionEligible = category === 'Clothing';
  return { priceEligible, fashionEligible, eligible: priceEligible || fashionEligible };
}

export function flipkartFixedFee(sellingPrice: number, fulfillment: FlipkartFulfillment) {
  if (sellingPrice <= 0) return 0;
  if (sellingPrice <= 300) return fulfillment === 'FBF' ? 14 : 16;
  if (sellingPrice <= 500) return fulfillment === 'FBF' ? 14 : 16;
  if (sellingPrice <= 1000) return 30;
  return fulfillment === 'FBF' ? 50 : 55;
}

export function flipkartCollectionFee(sellingPrice: number) {
  if (sellingPrice <= 0) return 0;
  return sellingPrice <= 750 ? 12.5 : sellingPrice * 0.02;
}

// Flipkart standard rate-card examples for packed weight up to 5kg.
// Values are based on the public standard rate card and should be re-verified against the seller account before production use.
const firstHalfKg: Record<FlipkartZone, number> = { Local: 47, Zonal: 54, National: 68 };
const increments: { upTo: number; step: number; fee: Record<FlipkartZone, number> }[] = [
  { upTo: 1, step: 0.5, fee: { Local: 4, Zonal: 19, National: 26 } },
  { upTo: 1.5, step: 0.5, fee: { Local: 13, Zonal: 17, National: 28 } },
  { upTo: 2, step: 0.5, fee: { Local: 10, Zonal: 18, National: 22 } },
  { upTo: 2.5, step: 0.5, fee: { Local: 8, Zonal: 11, National: 17 } },
  { upTo: 3, step: 0.5, fee: { Local: 8, Zonal: 11, National: 17 } },
  { upTo: 4, step: 1, fee: { Local: 7, Zonal: 10, National: 16 } },
  { upTo: 5, step: 1, fee: { Local: 7, Zonal: 10, National: 16 } },
];

export function flipkartShippingFee(weightKg: number, zone: FlipkartZone) {
  const weight = Math.max(0.5, Number.isFinite(weightKg) ? weightKg : 0.5);
  let total = firstHalfKg[zone];
  let covered = 0.5;
  if (weight <= 0.5) return total;
  for (const bracket of increments) {
    if (weight <= covered) break;
    const until = Math.min(weight, bracket.upTo);
    const extra = Math.max(0, until - covered);
    const steps = Math.ceil(extra / bracket.step - 1e-9);
    total += steps * bracket.fee[zone];
    covered = bracket.upTo;
  }
  // Beyond the public 5kg table, don't fabricate a new rate. Return null-like sentinel via NaN.
  if (weight > 5) return Number.NaN;
  return total;
}

export function getIndiaMarketplaceMetadata(platform: 'Flipkart' | 'Meesho') {
  if (platform === 'Meesho') {
    return {
      platform,
      headline: '0% commission',
      description: 'Meesho states that suppliers pay 0% commission; shipping and other seller-specific costs still need to be provided separately.',
      source: MEESHO_SOURCE,
      status: 'official' as const,
      lastVerified: '2026-09'
    };
  }
  return {
    platform,
    headline: 'Rate-card driven',
    description: 'Flipkart fees vary by category, fulfilment, selling price, payment method, weight and location.',
    source: FLIPKART_SOURCE,
    status: 'official' as const,
    lastVerified: '2026-09'
  };
}
