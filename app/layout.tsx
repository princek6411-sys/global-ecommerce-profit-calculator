import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Know Your REAL E-commerce Profit | ProfitPilot',
  description: 'Calculate true e-commerce profit after marketplace fees, product cost, shipping, ads, commissions, refunds and more.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Know Your REAL E-commerce Profit',
    description: 'Calculate, compare, stress-test and decide before you sell.',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
