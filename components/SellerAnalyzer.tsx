'use client';

import { useMemo, useState } from 'react';
import { analyzeSettlementCSV, buildCSVReport, type CSVAnalysis } from '@/lib/csv';

type Props = { currency: string };
const MAX_FILE_BYTES = 8 * 1024 * 1024;

export default function SellerAnalyzer({ currency }: Props) {
  const [analysis, setAnalysis] = useState<CSVAnalysis | null>(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const money = (v: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number.isFinite(v) ? v : 0);
  const lossMakers = useMemo(() => analysis?.skuSummary.filter((x) => x.profit < 0).sort((a, b) => a.profit - b.profit).slice(0, 5) ?? [], [analysis]);
  const deductionRows = useMemo(() => {
    if (!analysis) return [];
    return Object.entries(analysis.deductionBuckets).map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value);
  }, [analysis]);

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') { setStatus('Please upload a CSV file.'); return; }
    if (file.size > MAX_FILE_BYTES) { setStatus('File is larger than 8 MB. Split the report by period before analysis.'); return; }
    try {
      setStatus('Reading and validating the file locally…');
      const text = await file.text();
      const result = analyzeSettlementCSV(text);
      setAnalysis(result);
      setFileName(file.name);
      setStatus(result.issues.length ? `${result.issues.length} review item(s) found — inspect the notes below.` : 'Analysis ready. Review assumptions before using the report.');
    } catch {
      setAnalysis(null);
      setStatus('The CSV could not be parsed safely. Please export a fresh CSV and try again.');
    }
  }

  function downloadReport() {
    if (!analysis) return;
    const rows = analysis.skuSummary.map((x) => ({ SKU: x.sku, Product: x.productName, Orders: x.orders, Revenue: x.revenue.toFixed(2), COGS: x.cogs.toFixed(2), Fees: x.fees.toFixed(2), Shipping: x.shipping.toFixed(2), Ads: x.ads.toFixed(2), Returns: x.returns.toFixed(2), RTO: x.rto.toFixed(2), Taxes: x.taxes.toFixed(2), Other: x.other.toFixed(2), Deductions: x.deductions.toFixed(2), Profit: x.profit.toFixed(2), Margin: `${x.margin.toFixed(2)}%` }));
    const blob = new Blob([buildCSVReport(rows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'profitpilot-sku-report.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); setStatus('CSV report downloaded.');
  }

  return <section className="section" id="seller-intelligence">
    <div className="card panel">
      <div className="section-head"><div><span className="eyebrow">Seller intelligence</span><h2 className="section-title">Where did the money go?</h2><p className="section-copy">Upload a settlement CSV to estimate per-SKU profit, deductions and return/RTO impact. Processing stays in your browser in this MVP.</p></div><span className="trust-chip">Local processing • no signup</span></div>
      <label className="upload-zone"><input type="file" accept=".csv,text/csv" onChange={(e) => { const file = e.currentTarget.files?.[0]; if (file) void handleFile(file); }} /><strong>Upload settlement CSV</strong><span>{fileName || 'Marketplace exports can be mapped by detected column names.'}</span></label>
      {status && <p className="input-note" role="status">{status}</p>}
      {analysis && <>
        <div className="metrics seller-metrics"><div className="metric"><small>Orders</small><strong>{analysis.totals.orders.toLocaleString()}</strong></div><div className="metric"><small>Revenue</small><strong>{money(analysis.totals.revenue)}</strong></div><div className="metric"><small>Estimated profit</small><strong>{money(analysis.totals.profit)}</strong></div><div className="metric"><small>Deductions</small><strong>{money(analysis.totals.deductions)}</strong></div></div>
        <div className="feature-grid" style={{ marginTop: 12 }}>
          <div className="card feature"><span className="feature-number">01</span><h3>Profit check</h3><p>{analysis.totals.profit >= 0 ? 'The imported data is profitable under the detected fields and provided costs.' : 'The imported data is loss-making under the detected fields and costs.'}</p></div>
          <div className="card feature"><span className="feature-number">02</span><h3>Biggest visible deduction</h3><p>{deductionRows[0] ? `${deductionRows[0].key} accounts for ${money(deductionRows[0].value)} in detected deductions.` : 'No deduction bucket was detected.'}</p></div>
        </div>
        {lossMakers.length > 0 && <div className="insight danger"><strong>Loss-making SKUs</strong><p>{lossMakers.map((x) => `${x.sku} (${money(x.profit)})`).join(' • ')}</p></div>}
        <div className="card feature" style={{ marginTop: 12 }}><h3>Where your payout went</h3><div className="breakdown">{deductionRows.map((row) => <div className="breakdown-row" key={row.key}><span>{row.key}</span><strong>{money(row.value)}</strong></div>)}</div></div>
        {analysis.issues.length > 0 && <div className="notice" style={{ marginTop: 12 }}><strong>Review before trusting the report</strong><ul>{analysis.issues.slice(0, 12).map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
        <div className="table-wrap" style={{ marginTop: 12 }}><table className="compare-table"><thead><tr><th>SKU</th><th>Orders</th><th>Revenue</th><th>Deductions</th><th>Profit</th><th>Margin</th></tr></thead><tbody>{analysis.skuSummary.slice().sort((a, b) => b.profit - a.profit).slice(0, 50).map((x) => <tr key={x.sku}><td><strong>{x.sku}</strong><div className="input-note">{x.productName}</div></td><td>{x.orders}</td><td>{money(x.revenue)}</td><td>{money(x.deductions)}</td><td className={x.profit < 0 ? 'negative' : ''}>{money(x.profit)}</td><td>{x.margin.toFixed(1)}%</td></tr>)}</tbody></table></div>
        <div className="actions"><button className="small-btn" onClick={downloadReport}>⬇ Download CSV report</button><button className="small-btn" onClick={() => { setAnalysis(null); setFileName(''); setStatus(''); }}>Clear</button></div>
      </>}
      <p className="input-note">Privacy: uploaded files are processed locally by this MVP and are not intentionally sent to a server. Verify the export’s columns, settlement timing and COGS assumptions before relying on the report.</p>
    </div>
  </section>;
}
