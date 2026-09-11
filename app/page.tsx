import Link from 'next/link';
import Calculator from '@/components/Calculator';

const tools = [
  ['Profit Margin Calculator', '/profit-margin-calculator/'],
  ['Break-even Calculator', '/break-even-calculator/'],
  ['ROAS Calculator', '/roas-calculator/'],
  ['Maximum Ad Spend Calculator', '/maximum-ad-spend-calculator/'],
  ['Target Profit Calculator', '/target-profit-calculator/'],
  ['E-commerce Fee Calculator', '/ecommerce-fee-calculator/']
];

export default function Home() {
  return <>
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">ProfitPilot</Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#calculator">Calculator</a><a href="#features">Features</a><a href="#feedback">Feedback</a><Link href="/roadmap">Roadmap</Link>
        </nav>
      </div>
    </header>

    <main>
      <section className="container hero">
        <div>
          <span className="eyebrow">Calculate • Compare • Stress-test • Decide</span>
          <h1>Know Your <span className="hero-accent">REAL</span> E-commerce Profit</h1>
          <p className="lede">See what you actually keep after marketplace fees, product cost, shipping, ads, returns and other expenses — then find the levers that can improve it.</p>
          <div className="cta-row"><a className="btn primary" href="#calculator">Calculate My Profit</a><a className="btn secondary" href="#features">See how it works</a></div>
          <div className="trust-row"><span>✓ No signup</span><span>✓ Transparent assumptions</span><span>✓ Mobile-first</span></div>
        </div>
        <div className="hero-demo card">
          <div className="preview-header"><div><span className="eyebrow">Example result</span><strong>Product verdict</strong></div><span className="badge good">82/100</span></div>
          <div className="demo-profit">$13.24</div>
          <div className="demo-label">estimated true profit / order</div>
          <div className="mini-grid"><div className="mini"><small>Margin</small><strong>26.5%</strong></div><div className="mini"><small>Ads</small><strong>$8.00</strong></div><div className="mini"><small>Break-even</small><strong>$34.10</strong></div><div className="mini"><small>Verdict</small><strong>Good</strong></div></div>
          <div className="insight compact"><strong>Biggest profit leak</strong><p>Advertising is 16% of revenue in this example.</p></div>
        </div>
      </section>

      <section className="container section" id="calculator">
        <div className="section-intro"><div><span className="eyebrow">Your decision engine</span><h2 className="section-title">One place to understand the whole unit economics</h2></div><p className="section-copy">Start with a simple estimate. Open scenarios, platform comparisons or seller-data analysis only when you need them.</p></div>
        <Calculator />
      </section>

      <section className="container section" id="features">
        <div className="section-intro"><div><span className="eyebrow">Why this is more than a calculator</span><h2 className="section-title">From “what is my profit?” to “what should I do?”</h2></div></div>
        <div className="feature-grid">
          <div className="card feature"><span className="feature-number">01</span><h3>True profit, not sales</h3><p>Break revenue into the costs that actually consume your payout.</p></div>
          <div className="card feature"><span className="feature-number">02</span><h3>Decision engine</h3><p>Get a simple Good, Marginal or Not Profitable verdict with transparent reasons.</p></div>
          <div className="card feature"><span className="feature-number">03</span><h3>What-if + stress test</h3><p>See what happens when ads, returns, shipping or product costs move.</p></div>
          <div className="card feature"><span className="feature-number">04</span><h3>Seller intelligence</h3><p>Upload a settlement CSV to analyze SKU profit and deductions locally.</p></div>
        </div>
      </section>

      <section className="container section">
        <div className="card panel methodology"><div><span className="eyebrow">Trust by design</span><h2 className="section-title">Every important number has context</h2><p className="section-copy">Fee assumptions are explicitly marked as example, official or user-defined. Current marketplace rules can vary by country, category, program and seller account.</p></div><div className="method-list"><div><strong>Source</strong><span>Where a fee comes from</span></div><div><strong>Last verified</strong><span>When the configuration was checked</span></div><div><strong>Assumption type</strong><span>Official / example / user-defined</span></div></div></div>
      </section>

      <section className="container section" id="tools"><h2 className="section-title">More free calculators</h2><p className="section-copy">Useful entry points for specific seller questions.</p><div className="tool-grid">{tools.map(([name, href]) => <Link className="card feature" href={href} key={href}><h3>{name}</h3><p>Open tool →</p></Link>)}</div></section>

      <section className="container section"><div className="faq card panel"><span className="eyebrow">Quick answers</span><h2 className="section-title">Common questions</h2><details><summary>Is this an official marketplace fee calculator?</summary><p>No. Results are estimates using the displayed assumptions. Always verify current marketplace terms before making a business decision.</p></details><details><summary>Do I need an account?</summary><p>No. Core calculations, comparisons and local saving work without registration.</p></details><details><summary>Does the CSV analyzer upload my business data?</summary><p>This MVP processes CSV text in the browser. It does not intentionally send the uploaded file to a server.</p></details></div></section>

      <section className="container section" id="feedback"><div className="card feedback-box"><span className="eyebrow">Help shape the roadmap</span><h2 className="section-title">What should we build next?</h2><p className="section-copy">Vote in the roadmap or tell us which marketplace, country, fee or seller workflow you need.</p><div className="cta-row"><Link className="btn primary" href="/roadmap">View roadmap</Link><a className="btn" href="mailto:hello@profitpilot.example">Contact the builder</a></div></div></section>
    </main>

    <footer className="container footer"><strong>ProfitPilot</strong><p>Estimated results only. Verify marketplace fees, taxes, returns and seller-specific terms before making business decisions.</p><div className="footer-links"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link></div></footer>
  </>;
}
