'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import {
  getPlatformDecisionContext,
  platformFeatureFamilies,
  platformLifecycleNotices,
  platformOrder,
  platformResearch,
  type PlatformFeatureFamily,
  type PlatformFact,
} from '@/lib/platform-intelligence';

const statusLabel: Record<string, string> = {
  ACTIVE: 'ACTIVE',
  RENAMED: 'RENAMED',
  DISCONTINUED: 'DISCONTINUED',
  ANNOUNCED_NOT_LIVE: 'ANNOUNCED — NOT LIVE',
  UNVERIFIED: 'UNVERIFIED',
};

function statusTone(status: PlatformFact['status']) {
  if (status === 'ACTIVE') return 'status-good';
  if (status === 'RENAMED') return 'status-warn';
  if (status === 'DISCONTINUED') return 'status-danger';
  return 'status-neutral';
}

function groupByFamily(facts: PlatformFact[]) {
  return facts.reduce<Record<string, PlatformFact[]>>((acc, item) => {
    (acc[item.family] ??= []).push(item);
    return acc;
  }, {});
}

export default function PlatformIntelligenceHub() {
  const [selected, setSelected] = useState<string>('Amazon');
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<PlatformFeatureFamily | 'all'>('all');
  const [showEconomicsOnly, setShowEconomicsOnly] = useState(false);

  const context = getPlatformDecisionContext(selected);
  const allFacts = context?.active ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allFacts.filter((item) => {
      const matchesFamily = family === 'all' || item.family === family;
      const matchesEconomic = !showEconomicsOnly || item.calculationRole === 'CALCULATION_INPUT';
      const haystack = [item.officialName, item.definition, item.whyItMatters, item.scope, item.notes].filter(Boolean).join(' ').toLowerCase();
      return matchesFamily && matchesEconomic && (!q || haystack.includes(q));
    });
  }, [allFacts, family, query, showEconomicsOnly]);

  const grouped = useMemo(() => groupByFamily(filtered), [filtered]);
  const researchedPlatforms = platformOrder.filter((name) => platformResearch[name]?.verification === 'VERIFIED');

  return (
    <main className="container section platform-hub">
      <section className="platform-hub-hero card">
        <div>
          <span className="eyebrow">PLATFORM INTELLIGENCE · FREE</span>
          <h1 className="section-title">Know what the platform actually offers.</h1>
          <p className="section-copy">Research-backed seller capabilities, economics, eligibility and lifecycle status — without mixing platform facts into the core profit formula unless the input is genuinely modelable.</p>
          <div className="platform-trust-row">
            <span><ShieldCheck size={15} /> Official-source research</span>
            <span>10 researched platforms</span>
            <span>No paywall</span>
            <span>Retrieved {context?.research.retrievalDate ?? '2026-09-12'}</span>
          </div>
        </div>
        <div className="platform-hub-actions">
          <Link className="btn secondary" href="/#calculator">Open calculator →</Link>
          <Link className="btn primary" href="/roadmap">See roadmap →</Link>
        </div>
      </section>

      <section className="platform-selector-strip" aria-label="Platform selector">
        {platformOrder.map((platform) => {
          const item = platformResearch[platform];
          const isActive = selected === platform;
          return (
            <button key={platform} className={`platform-select-pill ${isActive ? 'active' : ''}`} onClick={() => { setSelected(platform); setQuery(''); setFamily('all'); }}>
              <strong>{item?.displayName ?? platform}</strong>
              <small>{item?.verification === 'VERIFIED' ? `${item.facts.length} researched` : 'Research gap'}</small>
            </button>
          );
        })}
      </section>

      {context && (
        <section className="platform-overview-grid">
          <div className="card panel platform-overview-main">
            <div className="platform-overview-heading">
              <div>
                <span className="eyebrow">{context.research.model}</span>
                <h2>{context.research.displayName}</h2>
                <p>{context.research.calculatorSupported ? 'Calculator-supported marketplace in ProfitPilot.' : 'Research-only marketplace context in this version; no universal calculator economics are auto-applied.'}</p>
              </div>
              <span className={`trust-chip ${context.research.verification === 'VERIFIED' ? 'verified' : ''}`}>{context.research.verification}</span>
            </div>
            <div className="platform-stat-grid">
              <div><strong>{context.active.length}</strong><span>active capabilities indexed</span></div>
              <div><strong>{context.economics.length}</strong><span>economic facts available for scoped modeling</span></div>
              <div><strong>{context.familyNames.length}</strong><span>capability families</span></div>
            </div>
            <div className="platform-family-row">
              {context.familyNames.map((name) => <span key={name} className="platform-family-chip">{name}</span>)}
            </div>
          </div>
          <aside className="card panel platform-decision-panel">
            <span className="eyebrow">WHAT THIS MEANS FOR PROFITPILOT</span>
            <h3>Facts inform the decision. They do not silently rewrite the calculation.</h3>
            <p>Fees, fulfilment and ad costs can be modeled only when the required country/category/plan/weight inputs are known. Performance, API, brand and lifecycle facts stay contextual.</p>
            <div className="decision-next"><strong>Next action</strong><p>Open a capability below, inspect its source and then test any modelable cost in Calculator → What-If.</p></div>
          </aside>
        </section>
      )}

      <section className="card panel platform-controls">
        <div className="platform-search"><Search size={16} aria-hidden="true" /><input aria-label="Search platform capabilities" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search features, fees, APIs, fulfilment…" /></div>
        <select value={family} onChange={(e) => setFamily(e.target.value as PlatformFeatureFamily | 'all')} aria-label="Filter feature family">
          <option value="all">All capability families</option>
          {Object.entries(platformFeatureFamilies).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <button className={`filter-toggle ${showEconomicsOnly ? 'active' : ''}`} onClick={() => setShowEconomicsOnly((v) => !v)}><SlidersHorizontal size={15} /> {showEconomicsOnly ? 'Economic facts only' : 'Show economics only'}</button>
        <span className="platform-filter-count">{filtered.length} result{filtered.length === 1 ? '' : 's'}</span>
      </section>

      {context?.research.verification !== 'VERIFIED' ? (
        <section className="card panel platform-gap-callout">
          <strong>Research gap — not the same as unsupported marketplace.</strong>
          <p>This marketplace exists in the calculator, but the supplied A–Z research report did not cover it. ProfitPilot therefore does not display invented “verified” platform facts.</p>
        </section>
      ) : null}

      <section className="platform-feature-groups">
        {Object.entries(grouped).map(([familyKey, facts]) => (
          <div key={familyKey} className="card panel platform-feature-group">
            <div className="platform-group-heading">
              <div><span className="eyebrow">{platformFeatureFamilies[familyKey as PlatformFeatureFamily]}</span><h2>{facts.length} capability{facts.length === 1 ? '' : 'ies'}</h2></div>
              <span className="input-note">{facts.filter((x) => x.calculationRole === 'CALCULATION_INPUT').length} modelable</span>
            </div>
            <div className="platform-fact-list">
              {facts.map((item) => (
                <details key={item.id} className="platform-fact-card">
                  <summary>
                    <span className="platform-fact-letter">{item.letter}</span>
                    <span className="platform-fact-title"><strong>{item.officialName}</strong><small>{item.definition}</small></span>
                    <span className={`platform-status ${statusTone(item.status)}`}>{statusLabel[item.status]}</span>
                  </summary>
                  <div className="platform-fact-detail">
                    <div className="platform-fact-grid">
                      <div><small>Why it matters</small><p>{item.whyItMatters}</p></div>
                      <div><small>Decision role</small><p>{item.calculationRole === 'CALCULATION_INPUT' ? 'Can feed economics when its scope exactly matches the user inputs.' : 'Context only — not used in profit arithmetic.'}</p></div>
                      {item.scope ? <div><small>Scope</small><p>{item.scope}</p></div> : null}
                      {item.eligibility ? <div><small>Eligibility</small><p>{item.eligibility}</p></div> : null}
                      {item.economic ? <div><small>Economic fact</small><p>{item.economic.valueMin != null ? `${item.economic.valueMin}–${item.economic.valueMax ?? ''}` : item.economic.value}{item.economic.unit === 'percent' ? '%' : item.economic.currency ? ` ${item.economic.currency}` : ''} {item.economic.scope ? `· ${item.economic.scope}` : ''}</p></div> : null}
                      {item.effectiveDate ? <div><small>Effective</small><p>{item.effectiveDate}</p></div> : null}
                      {item.dependencies ? <div><small>Dependencies</small><p>{item.dependencies}</p></div> : null}
                      {item.failureMode ? <div><small>Known failure mode</small><p>{item.failureMode}</p></div> : null}
                    </div>
                    {item.notes ? <p className="platform-note"><strong>Research note:</strong> {item.notes}</p> : null}
                    <div className="platform-source-row">
                      <span>Source: {item.source}</span>
                      {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer">Open official source <ExternalLink size={14} /></a> : null}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="card panel lifecycle-panel">
        <div><span className="eyebrow">LIFECYCLE WATCH</span><h2>Renamed and discontinued features</h2><p className="section-copy">Deprecated history stays visible so the product does not accidentally teach sellers an old workflow.</p></div>
        <div className="lifecycle-list">
          {platformLifecycleNotices.map((item) => (
            <div key={`${item.platform}-${item.name}`} className="lifecycle-item">
              <div><strong>{item.platform} · {item.name}</strong><span>{item.status} · {item.date}</span></div>
              <p>{item.reason}</p>
              {item.replacement ? <small>Replacement: <strong>{item.replacement}</strong></small> : null}
              {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink size={13} /></a> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="card panel platform-research-footer">
        <div><span className="eyebrow">RESEARCH BOUNDARY</span><h2>Verified ≠ live account data.</h2><p className="section-copy">This is a versioned research layer built from the supplied official-source report. It does not claim live seller-account fees, eligibility, inventory or API access.</p></div>
        <Link href="/#calculator" className="btn primary">Test your numbers →</Link>
      </section>
      <p className="input-note">Verified platform set: {researchedPlatforms.join(' · ')}. All newly surfaced platform intelligence is free and discoverable.</p>
    </main>
  );
}
