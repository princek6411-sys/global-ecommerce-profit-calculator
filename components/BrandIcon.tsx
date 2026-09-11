'use client';

import {
  Building2,
  Globe2,
  ShoppingBag,
  ShoppingCart,
  Store,
} from 'lucide-react';
import type { Platform } from '@/lib/config';

type BrandName = Platform | 'Own Store';

type BrandIconProps = {
  platform: BrandName;
  size?: number;
  className?: string;
  label?: string;
};

const colors: Partial<Record<BrandName, string>> = {
  Amazon: '#111111',
  Flipkart: '#2874F0',
  Meesho: '#c43dff',
  'TikTok Shop': '#111111',
  Shopify: '#95BF47',
  Etsy: '#F1641E',
  eBay: '#0064D2',
  Walmart: '#0071CE',
  'Own Store': '#16a34a',
};

const initials: Partial<Record<BrandName, string>> = {
  Amazon: 'A',
  Flipkart: 'F',
  Meesho: 'M',
  'TikTok Shop': 'T',
  Shopify: 'S',
  Etsy: 'E',
  eBay: 'e',
  Walmart: 'W',
  'Own Store': 'OS',
};

function PlatformGlyph({ platform, size }: { platform: BrandName; size: number }) {
  const strokeWidth = Math.max(1.7, Math.min(2.2, size / 12));
  const props = { size, strokeWidth, 'aria-hidden': true as const };

  if (platform === 'Own Store') return <Store {...props} />;
  if (platform === 'Shopify' || platform === 'Etsy') return <ShoppingBag {...props} />;
  if (platform === 'eBay' || platform === 'Walmart') return <ShoppingCart {...props} />;
  if (platform === 'TikTok Shop') return <Globe2 {...props} />;
  if (platform === 'Flipkart' || platform === 'Meesho') return <Building2 {...props} />;
  return null;
}

export default function BrandIcon({ platform, size = 24, className = '', label }: BrandIconProps) {
  const color = colors[platform] ?? 'currentColor';
  const initial = initials[platform] ?? platform.slice(0, 1);
  const labelled = Boolean(label);

  return (
    <span
      className={`brand-icon-wrap ${className}`}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? label : undefined}
      aria-hidden={labelled ? undefined : true}
      style={{ width: size, height: size, color }}
    >
      <span className="brand-icon-glyph" aria-hidden="true">
        <PlatformGlyph platform={platform} size={Math.max(14, Math.round(size * 0.62))} />
      </span>
      <span className="brand-icon-initial" aria-hidden="true">{initial}</span>
    </span>
  );
}
