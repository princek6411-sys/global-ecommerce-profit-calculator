export type NormalizedTransaction = {
  sku: string;
  productName: string;
  orderId: string;
  date: string;
  revenue: number;
  cogs: number;
  fees: number;
  shipping: number;
  ads: number;
  returns: number;
  rto: number;
  taxes: number;
  other: number;
  netPayout: number;
};

export type CSVAnalysis = {
  transactions: NormalizedTransaction[];
  skuSummary: Array<NormalizedTransaction & { orders: number; profit: number; margin: number; deductions: number }>;
  totals: { revenue: number; profit: number; deductions: number; orders: number };
  deductionBuckets: Record<'fees' | 'shipping' | 'ads' | 'returns' | 'rto' | 'taxes' | 'other', number>;
  issues: string[];
};

const aliases: Record<keyof NormalizedTransaction, string[]> = {
  sku: ['sku', 'seller sku', 'product sku', 'item sku', 'merchant sku'],
  productName: ['product', 'product name', 'title', 'item title', 'product title', 'description'],
  orderId: ['order id', 'order_id', 'sub order id', 'sub-order id', 'order number'],
  date: ['date', 'order date', 'transaction date', 'posted date'],
  revenue: ['revenue', 'sales', 'sale amount', 'item price', 'selling price', 'gross sales', 'order amount'],
  cogs: ['cogs', 'product cost', 'cost of goods', 'cost', 'purchase cost'],
  fees: ['fees', 'platform fee', 'referral fee', 'commission', 'marketplace fee', 'selling fee', 'closing fee'],
  shipping: ['shipping', 'shipping fee', 'logistics', 'delivery fee', 'shipping charges', 'fulfillment fee'],
  ads: ['ads', 'ad spend', 'advertising', 'marketing', 'sponsored ads'],
  returns: ['returns', 'refund', 'refunds', 'return charges', 'refund amount'],
  rto: ['rto', 'rto charges', 'return to origin', 'rto fee'],
  taxes: ['tax', 'taxes', 'gst', 'tcs', 'tds', 'vat'],
  other: ['other', 'adjustment', 'adjustments', 'other charges', 'misc'],
  netPayout: ['net payout', 'payout', 'settlement amount', 'net amount', 'seller proceeds', 'payable amount']
};

const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const num = (value: unknown) => {
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const negative = /^\(.*\)$/.test(raw);
  const parsed = Number(raw.replace(/[₹$€£¥₩,\s]/g, '').replace(/[()]/g, ''));
  if (!Number.isFinite(parsed)) return 0;
  return negative ? -parsed : parsed;
};

function parseCSVText(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted;
    } else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); if (row.some((x) => x.trim())) rows.push(row); }
  return rows;
}

function findIndex(headers: string[], candidates: string[]) {
  const normalized = headers.map(clean);
  const c = candidates.map(clean);
  const exact = normalized.findIndex((h) => c.includes(h));
  if (exact >= 0) return exact;
  return normalized.findIndex((h) => c.some((x) => h.includes(x) || x.includes(h)));
}

export function analyzeSettlementCSV(text: string): CSVAnalysis {
  const empty = (): CSVAnalysis => ({ transactions: [], skuSummary: [], totals: { revenue: 0, profit: 0, deductions: 0, orders: 0 }, deductionBuckets: { fees: 0, shipping: 0, ads: 0, returns: 0, rto: 0, taxes: 0, other: 0 }, issues: [] });
  const result = empty();
  if (text.length > 8 * 1024 * 1024) { result.issues.push('CSV is larger than 8 MB. Split the report into smaller periods before analysis.'); return result; }
  const rows = parseCSVText(text);
  if (rows.length < 2) { result.issues.push('The CSV does not contain enough rows to analyze.'); return result; }

  const headers = rows[0];
  const indexes = Object.fromEntries(Object.entries(aliases).map(([key, list]) => [key, findIndex(headers, list)])) as Record<keyof NormalizedTransaction, number>;
  if (indexes.sku < 0 && indexes.productName < 0) result.issues.push('No SKU or product-name column was detected.');
  if (indexes.revenue < 0 && indexes.netPayout < 0) result.issues.push('No revenue or payout column was detected.');
  if (indexes.cogs < 0) result.issues.push('No COGS/product-cost column was detected. SKU profit will be estimated without product cost unless payout already reflects it.');

  const transactions: NormalizedTransaction[] = [];
  rows.slice(1).forEach((row, index) => {
    if (row.length !== headers.length) result.issues.push(`Row ${index + 2} has ${row.length} columns; expected ${headers.length}.`);
    const get = (key: keyof NormalizedTransaction) => indexes[key] >= 0 ? row[indexes[key]] ?? '' : '';
    const revenue = Math.max(0, num(get('revenue')));
    const fees = Math.abs(num(get('fees')));
    const shipping = Math.abs(num(get('shipping')));
    const ads = Math.abs(num(get('ads')));
    const returns = Math.abs(num(get('returns')));
    const rto = Math.abs(num(get('rto')));
    const taxes = Math.abs(num(get('taxes')));
    const other = Math.abs(num(get('other')));
    const cogs = Math.abs(num(get('cogs')));
    const payoutProvided = indexes.netPayout >= 0 ? num(get('netPayout')) : NaN;
    const marketplaceDeductions = fees + shipping + ads + returns + rto + taxes + other;
    // A provided payout is treated as the cash proceeds after marketplace deductions but before COGS.
    // When payout is unavailable, derive the same value from revenue minus known marketplace deductions.
    const netPayout = Number.isFinite(payoutProvided) ? payoutProvided : revenue - marketplaceDeductions;
    transactions.push({ sku: get('sku') || get('productName') || `ROW-${index + 2}`, productName: get('productName') || get('sku') || 'Unknown product', orderId: get('orderId') || `ROW-${index + 2}`, date: get('date'), revenue, cogs, fees, shipping, ads, returns, rto, taxes, other, netPayout });
  });

  const map = new Map<string, NormalizedTransaction & { orders: number; profit: number; margin: number; deductions: number }>();
  for (const tx of transactions) {
    const key = tx.sku || tx.productName;
    const profit = tx.netPayout - tx.cogs;
    const deductions = tx.fees + tx.shipping + tx.ads + tx.returns + tx.rto + tx.taxes + tx.other;
    const existing = map.get(key);
    if (!existing) map.set(key, { ...tx, orders: 1, profit, margin: 0, deductions });
    else { existing.orders += 1; existing.profit += profit; existing.deductions += deductions; existing.revenue += tx.revenue; existing.cogs += tx.cogs; existing.netPayout += tx.netPayout; existing.fees += tx.fees; existing.shipping += tx.shipping; existing.ads += tx.ads; existing.returns += tx.returns; existing.rto += tx.rto; existing.taxes += tx.taxes; existing.other += tx.other; }
  }

  const skuSummary = Array.from(map.values()).map((item) => ({ ...item, margin: item.revenue === 0 ? 0 : (item.profit / item.revenue) * 100 }));
  result.transactions = transactions;
  result.skuSummary = skuSummary;
  result.deductionBuckets = {
    fees: transactions.reduce((sum, x) => sum + x.fees, 0), shipping: transactions.reduce((sum, x) => sum + x.shipping, 0), ads: transactions.reduce((sum, x) => sum + x.ads, 0), returns: transactions.reduce((sum, x) => sum + x.returns, 0), rto: transactions.reduce((sum, x) => sum + x.rto, 0), taxes: transactions.reduce((sum, x) => sum + x.taxes, 0), other: transactions.reduce((sum, x) => sum + x.other, 0)
  };
  result.totals = { revenue: transactions.reduce((sum, x) => sum + x.revenue, 0), profit: transactions.reduce((sum, x) => sum + x.netPayout - x.cogs, 0), deductions: Object.values(result.deductionBuckets).reduce((a, b) => a + b, 0), orders: transactions.length };
  return result;
}

export function buildCSVReport(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const s = String(value ?? '');
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [headers.map(escape).join(','), ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))].join('\n');
}
