import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProfitPilot — Global E-commerce Profit Calculator',
  description: 'Calculate true e-commerce profit across marketplaces, countries, fees, shipping, ads and returns.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
