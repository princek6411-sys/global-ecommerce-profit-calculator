'use client';

import { useMemo, useState } from 'react';
import { analyzeSettlementCSV, buildCSVReport, type CSVAnalysis } from '@/lib/csv';
import { formatMoney } from '@/lib/money';
import type { CurrencyCode } from '@/lib/config';

type Props = { currency: CurrencyCode };
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const isSupportedCurrency = (value: string): value is CurrencyCode => ['USD', 'EUR', 'INR', 'JPY', 'GBP', 'CAD', 'AUD', 'AED', 'SAR'].includes(value);

export default function SellerAnalyzer({ currency: displayCurrency }: Props) {
  const [analysis, setAnalysis] = useState<CSVAnalysis | null>(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const sourceCurrency = analysis?.sourceCurrency && isSupportedCurrency(analysis.sourceCurrency) ? analysis.sourceCurrency : undefined;
  const reportingCurrency = sourceCurrency ?? displayCurrency;
  const money = (v: number) => formatMoney(Number.isFinite(v) ? v : 0, reportingCurrency);
  const lossMakers = useMemo(() => analysis?.skuSummary.filter((x) => x.profit < 0).sort((a, b) => a.profit - b.profit).slice(0, 5) ?? [], [analysis]);
  const biggestLeak = useMemo(() => {
    if (!analysis) return undefined;
    return Object.entries(analysis.deductionBuckets).map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value)[0];
  }, [analysis]);

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') { setStatus('Please upload a CSV file.'); return; }
    if (file.size > MAX_FILE_BYTES) { setStatus('File is larger than 8 MB. Split the report by period before analysis.'); return; }
    try {
      setStatus('Reading settlement rows locally…');
      const text = await file.text();
      const result = analyzeSettlementCSV(text);
      setAnalysis(result);
      setFileName(file.name);
      setStatus(result.issues.length ? `${result.issues.length} review item(s) found — inspect the notes below.` : 'Analysis ready. Review assumptions before using the report.');
    } catch {
      setAnalysis(null); setStatus('The CSV could not be parsed safely. Please export a fresh CSV and try again.');
    }
  }

  function downloadReport() {
    if (!analysis) return;
    const rows = analysis.skuSummary.map((x) => ({
      SKU: x.sku, Orders: x.orders, Revenue: x.revenue.toFixed(2), 'Product Cost': x.cogs.toFixed(2), 'Recognized Costs': x.recognizedCosts.toFixed(2), Settlement: x.netPayout.toFixed(2), Profit: x.profit.toFixed(2), Margin: `${x.margin.toFixed(2)}%`, 'Return Orders': x.returnCount, 'RTO Orders': x.rtoCount
    }));
    const blob = new Blob([buildCSVReport(rows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'profitpilot-sku-report.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); setStatus('CSV report downloaded.');
  }

  return <section className="section" id="seller-intelligence">
    <div className="card panel">
      <div className="section-head"><div><span className="eyebrow">Seller intelligence</span><h2 className="section-title">Where did your money actually go?</h2><p className="section-copy">Upload a settlement CSV to understand realized payout, SKU profitability and unreconciled money. Processing stays in your browser in this MVP.</p></div><span className="trust-chip">Actual CSV → calculated analysis</span></div>
      <label className="upload-zone"><input type="file" accept=".csv,text/csv" onChange={(e) => { const file = e.currentTarget.files?.[0]; if (file) void handleFile(file); }} /><strong>Upload settlement CSV</strong><span>{fileName || 'The analyzer detects common marketplace export fields.'}</span></label>
      {status && <p className="input-note" role="status">{status}</p>}
      {analysis && <>
        <div className="notice"><strong>DATA QUALITY</strong><br />{analysis.totals.orders} orders · {analysis.skuSummary.length} SKUs · Source currency: <strong>{analysis.sourceCurrency || 'Not provided'}</strong> · Reporting currency: <strong>{reportingCurrency}</strong>. Imported settlement amounts are not symbol-converted just because the global display currency changed.</div>
        <div className="metrics seller-metrics">
          <div className="metric"><small>Orders</small><strong>{analysis.totals.orders.toLocaleString()}</strong></div>
          <div className="metric"><small>Revenue</small><strong>{money(analysis.totals.revenue)}</strong></div>
          <div className="metric"><small>Actual settlement</small><strong>{money(analysis.totals.actualPayout)}</strong></div>
          <div className="metric"><small>Estimated realized profit</small><strong className={analysis.totals.profit < 0 ? 'negative' : analysis.totals.profit > 0 ? 'positive' : ''}>{money(analysis.totals.profit)}</strong></div>
          <div className="metric"><small>Return orders</small><strong>{analysis.totals.returnOrders}</strong></div>
          <div className="metric"><small>RTO orders</small><strong>{analysis.totals.rtoOrders}</strong></div>
        </div>
        <div className="feature-grid" style={{ marginTop: 12 }}>
          <div className="card feature"><span className="eyebrow">PROFIT BASIS</span><h3>Why this profit number?</h3><p>Estimated realized profit = actual settlement − product cost. It is not a complete P&amp;L when costs are missing or unmapped.</p><div className="notice"><strong>Meaning:</strong> {analysis.totals.profit < 0 ? `You're losing ${money(Math.abs(analysis.totals.profit))} under this basis.` : analysis.totals.profit > 0 ? `You're keeping approximately ${money(analysis.totals.profit)} under this basis.` : 'The imported data is at break-even under this basis.'}</div></div>
          <div className="card feature"><span className="eyebrow">BIGGEST MONEY LEAK</span><h3>{biggestLeak && biggestLeak.value > 0 ? biggestLeak.key : 'Not confidently determined'}</h3><p>{biggestLeak && biggestLeak.value > 0 ? `${biggestLeak.key} is the largest recognized monetary cost bucket at ${money(biggestLeak.value)}.` : 'Recognized cost data is insufficient to name the biggest leak confidently.'}</p><div className="decision-next"><strong>Next action</strong><p>{biggestLeak && biggestLeak.value > 0 ? 'Review this cost first, then test the largest controllable lever.' : 'Map more monetary fields before using a cost-leak recommendation.'}</p></div></div>
        </div>
        <div className="card feature" style={{ marginTop: 12 }}><span className="eyebrow">SETTLEMENT RECONCILIATION</span><div className="metrics"><div className="metric"><small>Expected payout</small><strong>{money(analysis.totals.expectedPayout)}</strong></div><div className="metric"><small>Actual payout</small><strong>{money(analysis.totals.actualPayout)}</strong></div><div className="metric"><small>Settlement variance</small><strong className={analysis.totals.settlementDifference < 0 ? 'negative' : analysis.totals.settlementDifference > 0 ? 'positive' : ''}>{money(analysis.totals.settlementDifference)}</strong></div></div><p className="section-copy">Expected payout and settlement variance are separate from profit. {analysis.totals.settlementDifference !== 0 ? `${money(Math.abs(analysis.totals.settlementDifference))} of the variance is currently unclassified from the imported fields.` : 'No settlement variance was detected from the mapped fields.'}</p></div>
        {analysis.totals.unmappedDeductions > 0 && <div className="notice" style={{ marginTop: 12 }}><strong>UNMAPPED / UNCLASSIFIED</strong><br />Source field <strong>deductions</strong>: {money(analysis.totals.unmappedDeductions)}. This amount is not assigned to fees, shipping, ads, tax, returns or RTO without evidence.</div>}
        {lossMakers.length > 0 && <div className="insight danger"><strong>{lossMakers.length} SKU(s) need attention</strong><p>{lossMakers.map((x) => `${x.sku}: loss ${money(Math.abs(x.profit))}`).join(' • ')}</p></div>}
        <div className="table-wrap" style={{ marginTop: 12 }}><table className="compare-table"><thead><tr><th>SKU</th><th>Orders</th><th>Revenue</th><th>Product Cost</th><th>Recognized Costs</th><th>Settlement</th><th>Profit</th><th>Margin</th></tr></thead><tbody>{analysis.skuSummary.slice().sort((a, b) => a.profit - b.profit).slice(0, 50).map((x) => <tr key={x.sku}><td><strong>{x.sku}</strong></td><td>{x.orders}</td><td>{money(x.revenue)}</td><td>{money(x.cogs)}</td><td>{money(x.recognizedCosts)}</td><td>{money(x.netPayout)}</td><td className={x.profit < 0 ? 'negative' : x.profit > 0 ? 'positive' : ''}>{x.profit < 0 ? `−${money(Math.abs(x.profit))}` : money(x.profit)}</td><td>{x.margin.toFixed(1)}%</td></tr>)}</tbody></table></div>
        {analysis.unmappedFields.length > 0 && <div className="notice" style={{ marginTop: 12 }}><strong>Unmapped fields</strong><br />{analysis.unmappedFields.join(' · ')}</div>}
        {analysis.issues.length > 0 && <div className="notice" style={{ marginTop: 12 }}><strong>Review before trusting the report</strong><ul>{analysis.issues.slice(0, 12).map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
        <div className="actions"><button className="small-btn" onClick={downloadReport}>⬇ Download CSV report</button><button className="small-btn" onClick={() => { setAnalysis(null); setFileName(''); setStatus(''); }}>Clear</button></div>
      </>}
      <p className="input-note">Privacy: uploaded files are processed locally by this MVP and are not intentionally sent to a server. Verify source columns, settlement timing and COGS assumptions before relying on the report.</p>
    </div>
  </section>;
}
