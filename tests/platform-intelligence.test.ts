import { describe, expect, it } from 'vitest';
import {
  getPlatformDecisionContext,
  getPlatformEconomicFacts,
  getPlatformResearch,
  getPlatformResearchSummary,
  isResearchVerified,
  platformLifecycleNotices,
  platformResearch,
} from '@/lib/platform-intelligence';

describe('platform intelligence research layer', () => {
  it('covers all ten researched platforms from the supplied A–Z report', () => {
    const researched = [
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
    ];
    for (const name of researched) expect(getPlatformResearch(name)?.verification).toBe('VERIFIED');
  });

  it('keeps existing calculator marketplaces separate from research verification', () => {
    expect(getPlatformResearch('Meesho')?.verification).toBe('UNCLASSIFIED');
    expect(getPlatformResearch('TikTok Shop')?.verification).toBe('UNCLASSIFIED');
    expect(isResearchVerified('Meesho')).toBe(false);
  });

  it('indexes meaningful A–Z capabilities instead of only platform summaries', () => {
    for (const [name, research] of Object.entries(platformResearch).filter(([, item]) => item.verification === 'VERIFIED')) {
      expect(research.facts.length, `${name} should expose researched facts`).toBeGreaterThanOrEqual(7);
      expect(research.facts.every((f) => f.officialName && f.definition && f.whyItMatters)).toBe(true);
    }
  });

  it('attaches source URLs only to researched facts', () => {
    for (const research of Object.values(platformResearch)) {
      if (research.verification !== 'VERIFIED') continue;
      expect(research.facts.every((f) => f.source === 'E-Commerce Platform Seller Features A–Z: Verified Edition (September 2026)')).toBe(true);
      expect(research.facts.some((f) => f.sourceUrl)).toBe(true);
    }
  });

  it('does not claim a universal fee when the report says the value is scoped or unpublished', () => {
    const flipkart = getPlatformResearch('Flipkart')!;
    expect(flipkart.limitations.some((x) => /full rate card/i.test(x))).toBe(true);
    expect(getPlatformEconomicFacts('Flipkart').some((f) => /fees and commission/i.test(f.officialName))).toBe(true);
  });

  it('maps aliases used by the existing calculator', () => {
    expect(getPlatformDecisionContext('Walmart')?.research.displayName).toBe('Walmart Marketplace');
  });

  it('exposes lifecycle notices with explicit dates', () => {
    expect(platformLifecycleNotices.find((x) => x.name === 'eBay Bucks')?.date).toBe('2024-04-02');
    expect(platformLifecycleNotices.find((x) => x.name === 'Oberlo')?.date).toBe('2022-06-15');
    expect(platformLifecycleNotices.find((x) => x.name === 'JOS developer centre')?.replacement).toBe('JD Merchant Open Platform');
  });

  it('returns explicit research status for unknown and known platforms', () => {
    expect(getPlatformResearchSummary('Unknown marketplace').status).toBe('UNAVAILABLE');
    expect(getPlatformResearchSummary('Amazon').status).toBe('ACTIVE');
  });
});
