export type NormalizedTransaction = {
  sku: string;
  productName: string;
  orderId: string;
  date: string;
  currency: string;
  revenue: number;
  cogs: number;
  fees: number;
  shipping: number;
  ads: number;
  returnCount: number;
  rtoCount: number;
  returnCost: number;
  rtoCost: number;
  taxes: number;
  other: number;
  deductionsUnmapped: number;
  netPayout: number;
  expectedPayout: number;
  settlementDifference: number;
};

export type SKUAnalysis = NormalizedTransaction & {
  orders: number;
  profit: number;
  margin: number;
  recognizedCosts: number;
};

export type CSVAnalysis = {
  transactions: NormalizedTransaction[];
  skuSummary: SKUAnalysis[];
  sourceCurrency: string;
  totals: {
    revenue: number;
    profit: number;
    recognizedCosts: number;
    orders: number;
    expectedPayout: number;
    actualPayout: number;
    settlementDifference: number;
    returnOrders: number;
    rtoOrders: number;
    unmappedDeductions: number;
  };
  deductionBuckets: Record<'fees' | 'shipping' | 'ads' | 'returnCost' | 'rtoCost' | 'taxes' | 'other', number>;
  issues: string[];
  unmappedFields: string[];
};

type HeaderKey =
  | 'sku' | 'productName' | 'orderId' | 'date' | 'currency' | 'revenue' | 'cogs' | 'fees' | 'shipping' | 'ads'
  | 'returnCount' | 'rtoCount' | 'returnCost' | 'rtoCost' | 'taxes' | 'other' | 'deductions' | 'netPayout';

const aliases: Record<HeaderKey, string[]> = {
  sku: ['sku', 'seller sku', 'product sku', 'item sku', 'merchant sku'],
  productName: ['product', 'product name', 'title', 'item title', 'product title', 'description'],
  orderId: ['order id', 'order_id', 'sub order id', 'sub-order id', 'order number', 'order'],
  date: ['date', 'order date', 'transaction date', 'posted date'],
  currency: ['currency', 'currency code', 'settlement currency', 'source currency'],
  revenue: ['revenue', 'sales', 'sale amount', 'item price', 'selling price', 'gross sales', 'order amount'],
  cogs: ['cogs', 'product cost', 'cost of goods', 'cost', 'purchase cost'],
  fees: ['fees', 'platform fee', 'referral fee', 'commission', 'marketplace fee', 'selling fee', 'closing fee'],
  shipping: ['shipping', 'shipping fee', 'logistics', 'delivery fee', 'shipping charges', 'fulfillment fee'],
  ads: ['ads', 'ad spend', 'advertising', 'marketing', 'sponsored ads'],
  returnCount: ['returns', 'returned orders', 'return orders', 'return count', 'returns count'],
  rtoCount: ['rto', 'rto orders', 'rto count', 'return to origin orders'],
  returnCost: ['return cost', 'return charges', 'refund amount', 'refunds amount', 'return fee'],
  rtoCost: ['rto cost', 'rto charges', 'return to origin cost', 'rto fee'],
  taxes: ['tax', 'taxes', 'gst', 'tcs', 'tds', 'vat'],
  other: ['other', 'adjustment', 'adjustments', 'other charges', 'misc'],
  deductions: ['deductions', 'total deductions', 'unmapped deductions'],
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

const empty = (): CSVAnalysis => ({
  transactions: [], skuSummary: [], sourceCurrency: '',
  totals: { revenue: 0, profit: 0, recognizedCosts: 0, orders: 0, expectedPayout: 0, actualPayout: 0, settlementDifference: 0, returnOrders: 0, rtoOrders: 0, unmappedDeductions: 0 },
  deductionBuckets: { fees: 0, shipping: 0, ads: 0, returnCost: 0, rtoCost: 0, taxes: 0, other: 0 },
  issues: [], unmappedFields: []
});

export function analyzeSettlementCSV(text: string): CSVAnalysis {
  const result = empty();
  if (text.length > 8 * 1024 * 1024) { result.issues.push('CSV is larger than 8 MB. Split the report into smaller periods before analysis.'); return result; }
  const rows = parseCSVText(text);
  if (rows.length < 2) { result.issues.push('The CSV does not contain enough rows to analyze.'); return result; }

  const headers = rows[0];
  const indexes = Object.fromEntries(Object.entries(aliases).map(([key, list]) => [key, findIndex(headers, list)])) as Record<HeaderKey, number>;
  if (indexes.sku < 0 && indexes.productName < 0) result.issues.push('No SKU or product-name column was detected.');
  if (indexes.revenue < 0 && indexes.netPayout < 0) result.issues.push('No revenue or payout column was detected.');
  if (indexes.cogs < 0) result.issues.push('No COGS/product-cost column was detected. Profit will remain an estimate only when settlement minus product cost can be established.');

  const recognizedIndexes = new Set(Object.values(indexes).filter((x) => x >= 0));
  headers.forEach((header, i) => {
    const normalized = clean(header);
    if (i !== indexes.deductions && !recognizedIndexes.has(i) && /deduct|adjust|charge|cost|fee|tax|refund|return|rto|shipping|ad|payout|settlement/i.test(normalized)) result.unmappedFields.push(header);
  });

  const currencies = new Set<string>();
  const transactions: NormalizedTransaction[] = [];
  rows.slice(1).forEach((row, index) => {
    if (row.length !== headers.length) result.issues.push(`Row ${index + 2} has ${row.length} columns; expected ${headers.length}.`);
    const get = (key: HeaderKey) => indexes[key] >= 0 ? row[indexes[key]] ?? '' : '';
    const currency = get('currency').trim().toUpperCase();
    if (currency) currencies.add(currency);
    const revenue = Math.max(0, num(get('revenue')));
    const fees = Math.abs(num(get('fees')));
    const shipping = Math.abs(num(get('shipping')));
    const ads = Math.abs(num(get('ads')));
    const returnCount = Math.abs(num(get('returnCount')));
    const rtoCount = Math.abs(num(get('rtoCount')));
    const returnCost = Math.abs(num(get('returnCost')));
    const rtoCost = Math.abs(num(get('rtoCost')));
    const taxes = Math.abs(num(get('taxes')));
    const other = Math.abs(num(get('other')));
    const cogs = Math.abs(num(get('cogs')));
    const deductionsUnmapped = Math.abs(num(get('deductions')));
    const payoutProvided = indexes.netPayout >= 0 ? num(get('netPayout')) : NaN;
    const marketplaceDeductions = fees + shipping + ads + returnCost + rtoCost + taxes + other;
    const expectedPayout = revenue - marketplaceDeductions;
    const netPayout = Number.isFinite(payoutProvided) ? payoutProvided : expectedPayout;
    const settlementDifference = Number.isFinite(payoutProvided) ? netPayout - expectedPayout : 0;
    transactions.push({ sku: get('sku') || get('productName') || `ROW-${index + 2}`, productName: get('productName') || get('sku') || 'Unknown product', orderId: get('orderId') || `ROW-${index + 2}`, date: get('date'), currency, revenue, cogs, fees, shipping, ads, returnCount, rtoCount, returnCost, rtoCost, taxes, other, deductionsUnmapped, netPayout, expectedPayout, settlementDifference });
  });

  if (currencies.size === 1) result.sourceCurrency = [...currencies][0];
  else if (currencies.size > 1) { result.sourceCurrency = 'MULTI'; result.issues.push(`Multiple source currencies detected (${[...currencies].join(', ')}). Cross-currency profit is not combined automatically.`); }
  else result.issues.push('No source currency column was detected. Money values are kept unconverted and should be interpreted using the marketplace export currency.');

  const map = new Map<string, SKUAnalysis>();
  for (const tx of transactions) {
    const key = tx.sku || tx.productName;
    const recognizedCosts = tx.cogs + tx.fees + tx.shipping + tx.ads + tx.returnCost + tx.rtoCost + tx.taxes + tx.other;
    const profit = tx.netPayout - tx.cogs;
    const existing = map.get(key);
    if (!existing) map.set(key, { ...tx, orders: 1, profit, margin: tx.revenue === 0 ? 0 : (profit / tx.revenue) * 100, recognizedCosts });
    else {
      existing.orders += 1;
      existing.profit += profit;
      existing.revenue += tx.revenue;
      existing.cogs += tx.cogs;
      existing.netPayout += tx.netPayout;
      existing.expectedPayout += tx.expectedPayout;
      existing.settlementDifference += tx.settlementDifference;
      existing.fees += tx.fees; existing.shipping += tx.shipping; existing.ads += tx.ads;
      existing.returnCount += tx.returnCount; existing.rtoCount += tx.rtoCount; existing.returnCost += tx.returnCost; existing.rtoCost += tx.rtoCost;
      existing.taxes += tx.taxes; existing.other += tx.other; existing.deductionsUnmapped += tx.deductionsUnmapped; existing.recognizedCosts += recognizedCosts;
      existing.margin = existing.revenue === 0 ? 0 : (existing.profit / existing.revenue) * 100;
    }
  }

  result.transactions = transactions;
  result.skuSummary = Array.from(map.values());
  result.deductionBuckets = {
    fees: transactions.reduce((sum, x) => sum + x.fees, 0),
    shipping: transactions.reduce((sum, x) => sum + x.shipping, 0),
    ads: transactions.reduce((sum, x) => sum + x.ads, 0),
    returnCost: transactions.reduce((sum, x) => sum + x.returnCost, 0),
    rtoCost: transactions.reduce((sum, x) => sum + x.rtoCost, 0),
    taxes: transactions.reduce((sum, x) => sum + x.taxes, 0),
    other: transactions.reduce((sum, x) => sum + x.other, 0)
  };
  result.totals = {
    revenue: transactions.reduce((sum, x) => sum + x.revenue, 0),
    profit: transactions.reduce((sum, x) => sum + x.netPayout - x.cogs, 0),
    recognizedCosts: Object.values(result.deductionBuckets).reduce((a, b) => a + b, 0),
    orders: transactions.length,
    expectedPayout: transactions.reduce((sum, x) => sum + x.expectedPayout, 0),
    actualPayout: transactions.reduce((sum, x) => sum + x.netPayout, 0),
    settlementDifference: transactions.reduce((sum, x) => sum + x.settlementDifference, 0),
    returnOrders: transactions.reduce((sum, x) => sum + x.returnCount, 0),
    rtoOrders: transactions.reduce((sum, x) => sum + x.rtoCount, 0),
    unmappedDeductions: transactions.reduce((sum, x) => sum + x.deductionsUnmapped, 0)
  };
  if (result.totals.unmappedDeductions > 0) result.issues.push(`Unmapped deductions: ${result.totals.unmappedDeductions.toFixed(2)} in source currency is not included in recognized cost buckets.`);
  if (result.totals.settlementDifference !== 0) result.issues.push(`${Math.abs(result.totals.settlementDifference).toFixed(2)} of settlement variance could not be confidently reconciled from the mapped fields.`);
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
