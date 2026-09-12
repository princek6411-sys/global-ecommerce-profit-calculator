import type { Metadata } from 'next';
import Link from 'next/link';
import PlatformIntelligenceHub from '@/components/PlatformIntelligenceHub';

export const metadata: Metadata = {
  title: 'Platform Intelligence',
  description: 'Research-backed seller platform capabilities, economics, eligibility and lifecycle status across major ecommerce platforms.',
  alternates: { canonical: '/platform-intelligence' },
};

export default function PlatformIntelligencePage() {
  return <>
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/"><span className="brand-mark">P</span>ProfitPilot</Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/#calculator">Calculator</Link>
          <Link href="/platform-intelligence">Platform Intelligence</Link>
          <Link href="/roadmap">Roadmap</Link>
        </nav>
        <Link className="nav-cta" href="/#calculator">Calculate Profit →</Link>
      </div>
    </header>
    <PlatformIntelligenceHub />
  </>;
}
