import Link from 'next/link';
import Calculator from '@/components/Calculator';
import HomeHeroDemo from '@/components/HomeHeroDemo';
import ToolIcon from '@/components/ToolIcon';
import BrandIcon from '@/components/BrandIcon';
import CountryPills from '@/components/CountryPills';
import { DEMO_SCENARIO, demoAssumptions, getDemoDecision, getDemoRange, getDemoSnapshot, getDemoStress } from '@/lib/demo';

const tools = [
  ['Profit Margin Calculator', '/profit-margin-calculator/'],
  ['Break-even Calculator', '/break-even-calculator/'],
  ['ROAS Calculator', '/roas-calculator/'],
  ['Maximum Ad Spend Calculator', '/maximum-ad-spend-calculator/'],
  ['Target Profit Calculator', '/target-profit-calculator/'],
  ['E-commerce Fee Calculator', '/ecommerce-fee-calculator/']
] as const;

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
const labelForLine = (key: string) => ({
  product: 'Product cost',
  platform: 'Marketplace fee',
  payment: 'Payment fee',
  shipping: 'Shipping',
  packaging: 'Packaging',
  advertising: 'Advertising',
  affiliate: 'Affiliate',
  discount: 'Discounts',
  returns: 'Returns',
  rto: 'RTO',
  tax: 'Tax',
  other: 'Other'
}[key] ?? key);

export default function Home() {
  const snapshot = getDemoSnapshot();
  const decision = getDemoDecision();
  const stress = getDemoStress();
  const range = getDemoRange();
  const leakEntries = Object.entries(snapshot.line).filter(([key]) => key !== 'revenue').sort((a, b) => b[1] - a[1]);
  const biggestLeak = leakEntries[0] ?? ['product', DEMO_SCENARIO.productCost];
  const whatIf = getDemoSnapshot({ advertising: 10, shipping: 6 });
  const combined = stress.scenarios.find((scenario) => scenario.key === 'combined');
  const profitableScenarios = stress.surviveCount + 1;
  const scenarioTotal = stress.scenarios.length + 1;

  return <>
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/"><span className="brand-mark">P</span>ProfitPilot</Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#calculator">Calculator</a><a href="#features">Why it works</a><a href="#seller">Seller tools</a><Link href="/platform-intelligence">Platform Intelligence</Link><Link href="/connections">Live Data</Link><Link href="/roadmap">Roadmap</Link>
        </nav>
        <a className="nav-cta" href="#calculator">Calculate Profit →</a>
      </div>
    </header>

    <main>
      <section className="hero hero-master">
        <div className="container hero-master-grid">
          <div className="hero-copy-block">
            <div className="hero-badge"><span className="hero-badge-dot" /> Built for sellers who care about what they actually keep</div>
            <span className="eyebrow hero-eyebrow">Calculate · Compare · Stress-test · Decide</span>
            <h1>Will your product <span className="hero-gradient-text">actually make money?</span></h1>
            <p className="lede hero-lede">See the profit hiding behind fees, shipping, ads, returns and product costs — then find the move that improves it.</p>
            <div className="cta-row hero-cta-row"><a className="btn primary hero-primary" href="#calculator">Calculate My Profit <span>→</span></a><a className="btn secondary hero-secondary" href="#decision-brief">See the decision brief</a></div>
            <div className="hero-trust-pills"><span>✓ No signup</span><span>✓ Transparent assumptions</span><span>✓ Works on mobile</span></div>
            <div className="hero-proof-row"><div><strong>One answer first</strong><span>What do I actually keep?</span></div><div><strong>Then the why</strong><span>Where is profit leaking?</span></div><div><strong>Then the move</strong><span>What should I change?</span></div></div>
          </div>

          <div className="hero-demo-card">
            <HomeHeroDemo />
            <div className="hero-demo-note"><span>Example only</span> Fee values in this demo are illustrative and editable.</div>
          </div>
        </div>
      </section>

      <section className="container section decision-brief-section" id="decision-brief">
        <div className="decision-brief card">
          <div className="decision-brief-main">
            <span className="eyebrow">The answer behind the answer</span>
            <h2 className="section-title">What should I do next?</h2>
            <p className="section-copy">The tool should not stop at a profit number. This is an illustrative decision brief generated from the same calculation engine as the hero demo.</p>
            <div className="decision-brief-metrics">
              <div><span>True profit</span><strong>{money(snapshot.profit)}</strong><small>{snapshot.margin.toFixed(1)}% margin</small></div>
              <div><span>Break-even price</span><strong>{money(decision.breakEven)}</strong><small>Current price: {money(DEMO_SCENARIO.sellingPrice)}</small></div>
              <div><span>Max ad spend</span><strong>{money(decision.maxAdSpend)}</strong><small>before the profit hits zero</small></div>
            </div>
          </div>
          <div className="recommendation-panel">
            <span className="recommendation-label">RECOMMENDED MOVE</span>
            <strong>{decision.recommendation}</strong>
            <p>The largest visible cost in this example is <b>{labelForLine(biggestLeak[0])}</b> at {money(biggestLeak[1])}.</p>
            <a className="btn primary" href="#calculator">Test your own numbers →</a>
          </div>
        </div>
      </section>

      <section className="container section aha-section" id="aha">
        <div className="section-intro"><div><span className="eyebrow">The “aha” moment</span><h2 className="section-title">Revenue is not profit.</h2></div><p className="section-copy">Every number below comes from the same demo scenario used by the interactive hero, so the story stays mathematically consistent.</p></div>
        <div className="money-flow card">
          <div className="money-flow-header"><span>Example order</span><strong>{money(snapshot.revenue)} revenue</strong></div>
          <div className="money-flow-steps">
            <div className="money-step"><span>Product cost</span><strong>− {money(snapshot.line.product)}</strong></div>
            <div className="money-step"><span>Marketplace + payment fees</span><strong>− {money(snapshot.line.platform + snapshot.line.payment)}</strong></div>
            <div className="money-step"><span>Shipping</span><strong>− {money(snapshot.line.shipping)}</strong></div>
            <div className="money-step"><span>Advertising</span><strong>− {money(snapshot.line.advertising)}</strong></div>
            <div className="money-step profit-step"><span>True profit</span><strong>{money(snapshot.profit)}</strong></div>
          </div>
          <div className="money-flow-footer"><span>{snapshot.margin.toFixed(1)}% margin</span><span>That is the number worth optimizing.</span></div>
        </div>
      </section>

      <section className="container section decision-section" id="features">
        <div className="decision-heading"><div><span className="eyebrow">From calculator to decision engine</span><h2 className="section-title">Don’t just calculate. <span className="accent-word">Decide.</span></h2></div><p className="section-copy">The workflow follows the question a seller really has: “Should I sell this, where should I sell it, and what happens if my assumptions change?”</p></div>
        <div className="decision-grid">
          <div className="decision-card blue"><span className="decision-icon">01</span><h3>CALCULATE</h3><p>Turn selling price, costs and fees into one understandable true-profit number.</p><div className="decision-mini"><span>True profit</span><strong>{money(snapshot.profit)}</strong></div></div>
          <div className="decision-card purple"><span className="decision-icon">02</span><h3>COMPARE</h3><p>See which marketplace gives the strongest estimated outcome under the same assumptions.</p><div className="decision-mini"><span>Best estimate</span><strong>Meesho</strong></div></div>
          <div className="decision-card green"><span className="decision-icon">03</span><h3>STRESS-TEST</h3><p>Push ads, shipping and returns harder and see whether the product still survives.</p><div className="decision-mini"><span>Downside case</span><strong>{money(combined?.profit ?? 0)}</strong></div></div>
        </div>
      </section>

      <section className="container section whatif-showcase">
        <div className="whatif-layout card">
          <div className="whatif-copy"><span className="eyebrow">Interactive thinking</span><h2 className="section-title">What if your costs change?</h2><p className="section-copy">Same calculator. New assumptions. No reload.</p><div className="whatif-lines"><div><span>Ad spend</span><strong>{money(DEMO_SCENARIO.advertising)} → {money(10)}</strong></div><div><span>Shipping</span><strong>{money(DEMO_SCENARIO.shipping)} → {money(6)}</strong></div><div className="whatif-result"><span>Estimated profit</span><strong>{money(snapshot.profit)} → {money(whatIf.profit)}</strong></div></div></div>
          <div className="whatif-visual"><div className="risk-orbit"><div className="risk-center"><small>PROFIT</small><strong>{money(whatIf.profit)}</strong><span>after the change</span></div><span className="orbit-dot one" /><span className="orbit-dot two" /><span className="orbit-dot three" /></div><div className="whatif-caption">Small changes can create big differences. See them before they surprise you.</div></div>
        </div>
      </section>

      <section className="container section survival-section" id="stress">
        <div className="section-intro"><div><span className="eyebrow">Survival mode</span><h2 className="section-title">Can your product survive a bad month?</h2></div><p className="section-copy">A single profit number can be fragile. A scenario test shows how much room you really have.</p></div>
        <div className="survival-board card">
          <div className="survival-summary"><div><span>Base case</span><strong>{money(snapshot.profit)}</strong></div><div><span>Scenarios positive</span><strong>{profitableScenarios}/{scenarioTotal}</strong></div><div><span>Combined downside</span><strong className={(combined?.profit ?? 0) > 0 ? 'positive' : 'negative'}>{money(combined?.profit ?? 0)}</strong></div></div>
          <div className="survival-list">{stress.scenarios.map((scenario) => <div className="survival-row" key={scenario.key}><div><span>{scenario.label}</span><small>Illustrative downside simulation</small></div><strong className={scenario.profit > 0 ? 'positive' : 'negative'}>{money(scenario.profit)}</strong><span className={`survival-status ${scenario.profit > 0 ? 'safe' : 'danger'}`}>{scenario.profit > 0 ? 'Still positive' : 'Loss'}</span></div>)}</div>
        </div>
      </section>

      <section className="container section india-spotlight">
        <div className="india-panel card">
          <div className="india-copy"><div className="india-badge">🇮🇳 INDIA SELLER MODE</div><h2 className="section-title">Selling in India?</h2><p className="section-copy">Compare your estimated economics across the marketplaces Indian sellers actually use.</p><a className="btn primary" href="#calculator">Run an India scenario →</a><small className="trust-note">Illustrative marketplace examples. Actual fees vary by category, fulfilment, seller program and current rate cards.</small></div>
          <div className="marketplace-orbit" aria-label="Illustrative India marketplace examples"><div className="market-pill amazon"><BrandIcon platform="Amazon" size={25} label="Amazon" /><span>Amazon India</span><strong>₹274</strong></div><div className="market-pill flipkart"><BrandIcon platform="Flipkart" size={25} label="Flipkart" /><span>Flipkart</span><strong>₹291</strong></div><div className="market-pill meesho"><BrandIcon platform="Meesho" size={25} label="Meesho" /><span>Meesho</span><strong>₹318</strong></div><div className="market-pill store"><BrandIcon platform="Own Store" size={25} label="Own Store" /><span>Own Store</span><strong>₹356</strong></div></div>
        </div>
      </section>

      <section className="container section global-strip">
        <div className="global-copy"><span className="eyebrow">Built for sellers worldwide</span><h2 className="section-title">One product, different markets.</h2><p className="section-copy">Switch country, currency and language without losing the calculation flow.</p></div>
        <CountryPills selected="US" />
      </section>

      <section className="container section range-confidence-section">
        <div className="range-confidence-grid">
          <div className="profit-range card">
            <span className="eyebrow">Scenario range</span>
            <h2 className="section-title">Your profit has a range, not a guarantee.</h2>
            <p className="section-copy">This is a scenario band built from the same model — not a statistical forecast.</p>
            <div className="range-track"><span className="range-fill" /><i className="range-low" /><i className="range-base" /><i className="range-high" /></div>
            <div className="range-values"><div><small>Downside</small><strong>{money(range.low)}</strong></div><div><small>Base</small><strong>{money(snapshot.profit)}</strong></div><div><small>Upside</small><strong>{money(range.high)}</strong></div></div>
          </div>
          <div className="confidence-card card">
            <span className="eyebrow">Calculation confidence</span>
            <div className="confidence-head"><strong>MEDIUM</strong><span className="confidence-dot" /></div>
            <p>All key inputs are present, but the demo marketplace/payment fees are illustrative rather than verified live rate-card data.</p>
            <div className="confidence-checks"><span>✓ Inputs complete</span><span>✓ One calculation engine</span><span>⚠ Fee source is illustrative</span></div>
            <details className="assumption-inspector"><summary>Inspect assumptions</summary><div className="assumption-table">{demoAssumptions.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.status}</small></div>)}</div></details>
          </div>
        </div>
      </section>

      <section className="container section" id="seller">
        <div className="seller-preview card">
          <div className="seller-preview-copy"><span className="eyebrow">Already selling?</span><h2 className="section-title">Find out where your money actually went.</h2><p className="section-copy">Upload a settlement CSV, inspect deductions and see which SKUs are truly profitable.</p><div className="seller-tags"><span>Per-SKU profit</span><span>Returns / RTO</span><span>Deduction audit</span><span>CSV export</span></div></div>
          <div className="report-preview"><div className="report-label">EXAMPLE REPORT</div><div className="report-main"><span>Total profit</span><strong>₹20,340</strong></div><div className="report-bars"><div><span>Fees</span><i style={{width:'58%'}} /></div><div><span>Ads</span><i style={{width:'38%'}} /></div><div><span>Returns</span><i style={{width:'22%'}} /></div></div><div className="report-alert"><span>2 loss-making SKUs</span><strong>Needs review</strong></div></div>
        </div>
      </section>

      <section className="container section leak-section">
        <div className="leak-layout">
          <div><span className="eyebrow">Profit detective</span><h2 className="section-title">Your biggest profit leak might surprise you.</h2><p className="section-copy">Instead of only showing the answer, the experience points at the cost that is eating the most into it.</p><div className="leak-stat"><span>Largest cost in this example</span><strong>{labelForLine(biggestLeak[0])}</strong><small>{money(biggestLeak[1])} · {((biggestLeak[1] / snapshot.revenue) * 100).toFixed(0)}% of revenue</small></div></div>
          <div className="leak-bars card">{leakEntries.filter(([, value]) => value > 0).slice(0, 5).map(([key, value]) => <div key={key}><span>{labelForLine(key)}</span><i style={{width:`${Math.max(8, Math.min(100, (value / biggestLeak[1]) * 100))}%`}} /><strong>{money(value)}</strong></div>)}</div>
        </div>
      </section>

      <section className="container section" id="calculator">
        <div className="section-intro"><div><span className="eyebrow">The real calculator</span><h2 className="section-title">Ready to run your own numbers?</h2></div><p className="section-copy">Start simple. Open advanced scenarios only when you need them.</p></div>
        <Calculator />
      </section>

      <section className="container section"><div className="card panel methodology"><div><span className="eyebrow">Trust by design</span><h2 className="section-title">Every important number has context</h2><p className="section-copy">Fee assumptions should be explicitly marked as example, official or user-defined. Current marketplace rules can vary by country, category, program and seller account.</p></div><div className="method-list"><div><strong>Source</strong><span>Where a fee comes from</span></div><div><strong>Last verified</strong><span>When the configuration was checked</span></div><div><strong>Assumption type</strong><span>Official / example / user-defined</span></div></div></div></section>

      <section className="container section" id="tools"><h2 className="section-title">More free calculators</h2><p className="section-copy">Useful entry points for specific seller questions.</p><div className="tool-grid">{tools.map(([name, href]) => <Link className="card feature tool-card" href={href} key={href}><ToolIcon href={href} /><div><h3>{name}</h3><p>Open tool →</p></div></Link>)}</div></section>

      <section className="container section"><div className="faq card panel"><span className="eyebrow">Quick answers</span><h2 className="section-title">Common questions</h2><details><summary>Is this an official marketplace fee calculator?</summary><p>No. Results are estimates using the displayed assumptions. Always verify current marketplace terms before making a business decision.</p></details><details><summary>Do I need an account?</summary><p>No. Core calculations, comparisons and local saving work without registration.</p></details><details><summary>Does the CSV analyzer upload my business data?</summary><p>This MVP processes CSV text in the browser. It does not intentionally send the uploaded file to a server.</p></details></div></section>

      <section className="container section" id="feedback"><div className="card feedback-box final-cta"><div><span className="eyebrow">Keep improving with real sellers</span><h2 className="section-title">What should we build next?</h2><p className="section-copy">Vote in the roadmap or tell us which marketplace, country, fee or seller workflow you need.</p></div><div className="cta-row"><Link className="btn primary" href="/roadmap">View roadmap</Link><a className="btn" href="mailto:hello@profitpilot.example">Contact the builder</a></div></div></section>
    </main>

    <footer className="container footer"><strong>ProfitPilot</strong><p>Estimated results only. Verify marketplace fees, taxes, returns and seller-specific terms before making business decisions.</p><p className="independent-disclosure">ProfitPilot is an independent tool and is not affiliated with or endorsed by the marketplaces shown.</p><div className="footer-links"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link></div></footer>
  </>;
}
