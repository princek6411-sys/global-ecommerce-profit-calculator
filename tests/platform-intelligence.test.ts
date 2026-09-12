import { describe, expect, it } from 'vitest';
import {
  getPlatformResearch,
  getPlatformResearchSummary,
  isResearchVerified,
  platformResearch,
} from '@/lib/platform-intelligence';

describe('platform intelligence trust model', () => {
  it('keeps verified research separate from calculator support', () => {
    expect(getPlatformResearch('Amazon')?.verification).toBe('VERIFIED');
    expect(getPlatformResearch('Amazon')?.calculatorSupported).toBe(true);
    expect(getPlatformResearch('Alibaba.com / Tmall / Taobao')?.calculatorSupported).toBe(false);
  });

  it('does not pretend Meesho is research-verified by this report', () => {
    expect(getPlatformResearch('Meesho')?.verification).toBe('UNCLASSIFIED');
    expect(isResearchVerified('Meesho')).toBe(false);
  });

  it('does not invent source URLs', () => {
    for (const item of Object.values(platformResearch)) {
      expect(item.source).toBeTruthy();
      expect(item).not.toHaveProperty('sourceUrl');
    }
  });

  it('returns an explicit unavailable/unverified message for missing research', () => {
    expect(getPlatformResearchSummary('Unknown marketplace').status).toBe('UNAVAILABLE');
  });

  it('exposes the research retrieval date', () => {
    expect(getPlatformResearch('Flipkart')?.retrievalDate).toBe('2026-09-12');
  });
});
