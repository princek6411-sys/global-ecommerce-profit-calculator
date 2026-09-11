import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const siteUrl = 'https://global-ecommerce-profit-calculator.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ProfitPilot — Know Your REAL E-commerce Profit',
    template: '%s | ProfitPilot'
  },
  description: 'Calculate true e-commerce profit after marketplace fees, product cost, shipping, ads, returns and other costs. Compare platforms, stress-test scenarios and analyze settlement data.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Know Your REAL E-commerce Profit',
    description: 'Calculate, compare, stress-test and decide before you sell.',
    url: siteUrl,
    siteName: 'ProfitPilot',
    type: 'website'
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
