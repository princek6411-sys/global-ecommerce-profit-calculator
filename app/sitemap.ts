import type { MetadataRoute } from 'next';

const siteUrl = 'https://global-ecommerce-profit-calculator.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/amazon-profit-calculator/', '/tiktok-shop-profit-calculator/', '/shopify-profit-calculator/', '/etsy-profit-calculator/', '/ebay-profit-calculator/', '/walmart-profit-calculator/', '/profit-margin-calculator/', '/break-even-calculator/', '/roas-calculator/', '/maximum-ad-spend-calculator/', '/target-profit-calculator/', '/ecommerce-fee-calculator/', '/platform-intelligence/', '/roadmap/', '/about/', '/contact/', '/privacy/', '/terms/', '/disclaimer/'];
  return routes.map((url) => ({ url: `${siteUrl}${url}`, lastModified: new Date() }));
}
