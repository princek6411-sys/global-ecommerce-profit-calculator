export type CurrencyCode = 'USD' | 'EUR' | 'INR' | 'JPY' | 'GBP' | 'CAD' | 'AUD' | 'AED' | 'SAR';
export type CountryCode = 'IN' | 'US' | 'DE' | 'FR' | 'ES' | 'JP';
export type LanguageCode = 'en' | 'hi' | 'de' | 'fr' | 'es' | 'ja';
export type Platform = 'Amazon' | 'Flipkart' | 'Meesho' | 'TikTok Shop' | 'Shopify' | 'Etsy' | 'eBay' | 'Walmart';
export type FeeStatus = 'example' | 'official' | 'user-defined';

export type FeeAssumption = {
  value: number;
  mode: 'fixed' | 'percent';
  status: FeeStatus;
  source?: string;
  sourceUrl?: string;
  effectiveDate?: string;
  lastVerified?: string;
};

export type PlatformConfig = {
  platform: Platform;
  countries: CountryCode[];
  fee: FeeAssumption;
  description: string;
  supportedCategories?: Category[];
};

export const currencies: Record<CurrencyCode, { symbol: string; label: string; locale: string }> = {
  USD: { symbol: '$', label: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', label: 'Euro', locale: 'de-DE' },
  INR: { symbol: '₹', label: 'Indian Rupee', locale: 'en-IN' },
  JPY: { symbol: '¥', label: 'Japanese Yen', locale: 'ja-JP' },
  GBP: { symbol: '£', label: 'British Pound', locale: 'en-GB' },
  CAD: { symbol: 'C$', label: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { symbol: 'A$', label: 'Australian Dollar', locale: 'en-AU' },
  AED: { symbol: 'د.إ', label: 'UAE Dirham', locale: 'ar-AE' },
  SAR: { symbol: '﷼', label: 'Saudi Riyal', locale: 'ar-SA' }
};

export const countries: { code: CountryCode; name: string; currency: CurrencyCode; language: LanguageCode }[] = [
  { code: 'IN', name: 'India', currency: 'INR', language: 'hi' },
  { code: 'US', name: 'United States', currency: 'USD', language: 'en' },
  { code: 'DE', name: 'Germany', currency: 'EUR', language: 'de' },
  { code: 'FR', name: 'France', currency: 'EUR', language: 'fr' },
  { code: 'ES', name: 'Spain', currency: 'EUR', language: 'es' },
  { code: 'JP', name: 'Japan', currency: 'JPY', language: 'ja' }
];

export const languages: { code: LanguageCode; nativeName: string }[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'es', nativeName: 'Español' },
  { code: 'ja', nativeName: '日本語' }
];

// These numbers are deliberately EXAMPLE/DEMO assumptions, not claims of current official rates.
// They are displayed with source/status metadata and are intended to be replaced with verified rates.
const example = (value: number): FeeAssumption => ({
  value,
  mode: 'percent',
  status: 'example',
  lastVerified: 'Demo assumption — verify before production use'
});

export const platformConfigs: PlatformConfig[] = [
  { platform: 'Amazon', countries: ['IN', 'US', 'DE', 'FR', 'ES', 'JP'], fee: example(15), description: 'Marketplace reach' },
  { platform: 'Flipkart', countries: ['IN'], fee: { ...example(14), source: 'Flipkart Fees & Commission', sourceUrl: 'https://seller.flipkart.com/fees-and-commission', effectiveDate: '2026-09', lastVerified: '2026-09' }, description: 'India marketplace — helper models public fixed, collection and shipping components; category commission outside eligible zero-commission cases remains an example assumption' },
  { platform: 'Meesho', countries: ['IN'], fee: { ...example(0), status: 'official', source: 'Meesho Supplier', sourceUrl: 'https://supplier.meesho.com/sell-online/shirts', effectiveDate: '2026-09', lastVerified: '2026-09' }, description: 'India social commerce — 0% commission; enter seller-specific shipping/other costs' },
  { platform: 'TikTok Shop', countries: ['US', 'DE', 'FR', 'ES', 'JP'], fee: example(10), description: 'Social commerce' },
  { platform: 'Shopify', countries: ['IN', 'US', 'DE', 'FR', 'ES', 'JP'], fee: example(2.9), description: 'Owned storefront' },
  { platform: 'Etsy', countries: ['IN', 'US', 'DE', 'FR', 'ES', 'JP'], fee: example(6.5), description: 'Creative products' },
  { platform: 'eBay', countries: ['IN', 'US', 'DE', 'FR', 'ES', 'JP'], fee: example(13), description: 'Broad marketplace' },
  { platform: 'Walmart', countries: ['US'], fee: example(15), description: 'US marketplace' }
];

export const supportedPlatforms = platformConfigs.map((x) => x.platform);
export const platformFeeAssumption = Object.fromEntries(platformConfigs.map((x) => [x.platform, x.fee])) as Record<Platform, FeeAssumption>;

export const categories = ['Electronics', 'Clothing', 'Beauty', 'Home & Kitchen', 'Grocery', 'Other'] as const;
export type Category = (typeof categories)[number];

export function getCountry(code: CountryCode) {
  return countries.find((country) => country.code === code) ?? countries[0];
}

export function getPlatformsForCountry(code: CountryCode) {
  return platformConfigs.filter((platform) => platform.countries.includes(code));
}

export function getPlatformConfig(platform: Platform, country?: CountryCode) {
  const item = platformConfigs.find((entry) => entry.platform === platform);
  if (!item) return undefined;
  if (country && !item.countries.includes(country)) return undefined;
  return item;
}

// Category-aware fee data is intentionally nullable until verified marketplace schedules are connected.
// UI should fall back to the marketplace-level assumption and clearly label it.
export function getCategoryFeeAssumption(_platform: Platform, _country: CountryCode, _category: Category): FeeAssumption | undefined {
  return undefined;
}

export function getDefaultPlatform(country: CountryCode): Platform {
  return getPlatformsForCountry(country)[0]?.platform ?? 'Amazon';
}
