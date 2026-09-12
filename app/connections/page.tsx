'use client';

import { useEffect, useState } from 'react';

type ShopifyStatus = {
  status: string;
  oauth: { configured: boolean; persistenceConfigured: boolean };
  liveTokenConfigured: boolean;
  shopConfigured: boolean;
  apiVersion: string;
  note: string;
};

export default function ConnectionsPage() {
  const [status, setStatus] = useState<ShopifyStatus | null>(null);
  const [shop, setShop] = useState('');
  const [syncState, setSyncState] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/shopify/status').then((r) => r.json()).then(setStatus).catch(() => setStatus(null));
  }, []);

  async function runSync() {
    setSyncState('SYNCING');
    setSyncResult(null);
    const response = await fetch('/api/shopify/sync', { method: 'POST' });
    const data = await response.json();
    setSyncState(response.ok ? 'SYNCED' : 'BLOCKED');
    setSyncResult(data);
  }

  return (
    <main style={{maxWidth: 980, margin: '0 auto', padding: '48px 20px'}}>
      <div className="eyebrow">LIVE DATA</div>
      <h1 className="section-title">Connect your commerce data</h1>
      <p className="section-copy" style={{maxWidth: 760}}>
        ProfitPilot is moving from manual calculations toward real seller data. This first vertical slice focuses on Shopify and refuses to fake a live connection when credentials or durable storage are missing.
      </p>

      <section className="card panel" style={{marginTop: 24}}>
        <div style={{display: 'flex', justifyContent:'space-between', gap: 20, alignItems:'flex-start', flexWrap:'wrap'}}>
          <div>
            <div className="eyebrow">SHOPIFY</div>
            <h2>Real connector foundation</h2>
            <p className="section-copy">GraphQL Admin API · server-side token flow · webhook signature verification · live order/product sync.</p>
          </div>
          <strong className={status?.status === 'CONNECTED' ? 'positive' : ''}>{status?.status ?? 'CHECKING'}</strong>
        </div>

        <div className="feature-grid" style={{marginTop: 20}}>
          <div className="card panel"><strong>OAuth configuration</strong><p>{status?.oauth.configured ? 'Configured' : 'Not configured'}</p></div>
          <div className="card panel"><strong>Server-side token</strong><p>{status?.liveTokenConfigured ? 'Configured' : 'Not configured'}</p></div>
          <div className="card panel"><strong>Persistence</strong><p>{status?.oauth.persistenceConfigured ? 'Configured' : 'Blocked — no DB adapter in baseline ZIP'}</p></div>
          <div className="card panel"><strong>API version</strong><p>{status?.apiVersion ?? '—'}</p></div>
        </div>

        <div className="notice" style={{marginTop: 20}}>{status?.note ?? 'Loading connector status…'}</div>

        <div style={{marginTop: 24}}>
          <label style={{display:'block', fontWeight: 700, marginBottom: 8}}>Shopify store domain</label>
          <input value={shop} onChange={(e) => setShop(e.target.value)} placeholder="your-store.myshopify.com" style={{width:'100%', padding:'12px 14px', borderRadius:10, border:'1px solid #d6dbe5'}} />
          <div style={{display:'flex', gap: 10, flexWrap:'wrap', marginTop: 12}}>
            <a className="btn primary" href={shop ? `/api/shopify/connect?shop=${encodeURIComponent(shop)}` : '#'} aria-disabled={!shop}>Connect Shopify</a>
            <button className="btn" onClick={runSync}>Test configured live sync</button>
          </div>
        </div>

        {syncState && <div className="notice" style={{marginTop: 20}}><strong>{syncState}</strong>{syncResult?.error && <p>{syncResult.error}</p>}</div>}

        {syncResult?.summary && <div className="money-flow card" style={{marginTop: 20}}>
          <div className="money-flow-header"><span>Live sync result</span><strong>{syncResult.summary.storeDomain}</strong></div>
          <div className="money-flow-steps">
            <div className="money-step"><span>Orders</span><strong>{syncResult.summary.orders}</strong></div>
            <div className="money-step"><span>Order lines</span><strong>{syncResult.summary.orderLines}</strong></div>
            <div className="money-step"><span>Products</span><strong>{syncResult.summary.products}</strong></div>
            <div className="money-step"><span>Variants / inventory</span><strong>{syncResult.summary.variants} / {syncResult.summary.inventories}</strong></div>
            <div className="money-step profit-step"><span>Reconciliation state</span><strong>{syncResult.reconciliation?.status ?? '—'}</strong></div>
          </div>
          <div className="money-flow-footer"><span>{syncResult.summary.status}</span><span>Unmapped profit inputs remain visible instead of being guessed.</span></div>
        </div>}
      </section>
    </main>
  );
}
