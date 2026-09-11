'use client';

import { siAmazon, siEtsy, siEbay, siFlipkart, siShopify, siTiktok, siWalmart } from 'simple-icons';
import type { Platform } from '@/lib/config';

type BrandIconProps = { platform: Platform; size?: number; className?: string; label?: string };

type SimpleIcon = { title: string; path: string };

const icons: Partial<Record<Platform, SimpleIcon>> = {
  Amazon: siAmazon,
  Flipkart: siFlipkart,
  'TikTok Shop': siTiktok,
  Shopify: siShopify,
  Etsy: siEtsy,
  eBay: siEbay,
  Walmart: siWalmart,
};

const colors: Partial<Record<Platform, string>> = {
  Amazon: '#111111',
  Flipkart: '#2874F0',
  'TikTok Shop': '#111111',
  Shopify: '#95BF47',
  Etsy: '#F1641E',
  eBay: '#0064D2',
  Walmart: '#0071CE',
  Meesho: '#c43dff',
};

export default function BrandIcon({ platform, size = 24, className = '', label }: BrandIconProps) {
  const icon = icons[platform];
  if (!icon) {
    return <span className={`brand-icon-fallback ${className}`} style={{ width: size, height: size }} aria-hidden="true">{platform === 'Meesho' ? 'M' : platform === 'Own Store' ? 'OS' : platform.slice(0, 1)}</span>;
  }
  return (
    <svg
      className={`brand-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      style={{ color: colors[platform] ?? 'currentColor' }}
    >
      <path d={icon.path} />
    </svg>
  );
}
