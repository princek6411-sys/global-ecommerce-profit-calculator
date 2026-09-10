export type CurrencyCode = 'USD'|'GBP'|'EUR'|'CAD'|'AUD'|'INR'|'AED'|'SAR'|'JPY';
export type Platform = 'Amazon'|'TikTok Shop'|'Shopify'|'Etsy'|'eBay'|'Walmart';

export const currencies: Record<CurrencyCode, { symbol: string; label: string }> = {
  USD: { symbol: '$', label: 'US Dollar' },
  GBP: { symbol: '£', label: 'British Pound' },
  EUR: { symbol: '€', label: 'Euro' },
  CAD: { symbol: 'C$', label: 'Canadian Dollar' },
  AUD: { symbol: 'A$', label: 'Australian Dollar' },
  INR: { symbol: '₹', label: 'Indian Rupee' },
  AED: { symbol: 'د.إ', label: 'UAE Dirham' },
  SAR: { symbol: '﷼', label: 'Saudi Riyal' },
  JPY: { symbol: '¥', label: 'Japanese Yen' }
};

export const countries = ['United States','United Kingdom','Canada','Australia','Germany','India'] as const;

// IMPORTANT: These are demo/default assumptions for the MVP, not claims of current official rates.
// Replace/verify these with official platform fee data before production use.
export const demoPlatformFees: Record<Platform, number> = {
  Amazon: 0.15,
  'TikTok Shop': 0.10,
  Shopify: 0.029,
  Etsy: 0.065,
  eBay: 0.13,
  Walmart: 0.15
};

export const supportedPlatforms: Platform[] = ['Amazon','TikTok Shop','Shopify','Etsy','eBay','Walmart'];
