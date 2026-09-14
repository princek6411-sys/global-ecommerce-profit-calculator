export type EconomicAlertSeverity = 'CRITICAL' | 'IMPORTANT' | 'WATCH' | 'INFO';

export type EconomicAlert = {
  key: string;
  severity: EconomicAlertSeverity;
  whatChanged: string;
  whyItMatters: string;
  action: string;
};

export type MonitoringSnapshot = {
  profit: number;
  margin: number;
  settlementVariance?: number;
  dataFreshnessMinutes?: number;
  unclassifiedAmount?: number;
};

export function deriveEconomicAlerts(current: MonitoringSnapshot, previous?: MonitoringSnapshot): EconomicAlert[] {
  if (!previous) return [];
  const alerts: EconomicAlert[] = [];
  const profitDelta = current.profit - previous.profit;
  if (previous.profit !== 0 && profitDelta < 0 && Math.abs(profitDelta / previous.profit) >= 0.1) {
    alerts.push({ key: 'profit_drop', severity: 'IMPORTANT', whatChanged: `Profit changed by ${profitDelta.toFixed(2)}.`, whyItMatters: 'A material profit decline can be caused by higher costs, weaker pricing or lower revenue quality.', action: 'Open the profit bridge and inspect the largest economic driver before changing multiple variables.' });
  }
  const marginDelta = current.margin - previous.margin;
  if (marginDelta <= -2) {
    alerts.push({ key: 'margin_drop', severity: 'IMPORTANT', whatChanged: `Margin fell by ${Math.abs(marginDelta).toFixed(2)} percentage points.`, whyItMatters: 'Margin deterioration can compound quickly even when revenue remains stable.', action: 'Inspect the largest cost category relative to revenue.' });
  }
  if (current.settlementVariance !== undefined && previous.settlementVariance !== undefined && Math.abs(current.settlementVariance) > Math.abs(previous.settlementVariance) * 1.25) {
    alerts.push({ key: 'settlement_variance', severity: 'WATCH', whatChanged: 'Settlement variance widened materially.', whyItMatters: 'Unexplained payout differences can hide money that has not yet been reconciled.', action: 'Open reconciliation and classify the difference only when source evidence supports it.' });
  }
  if (current.unclassifiedAmount !== undefined && current.unclassifiedAmount > 0) {
    alerts.push({ key: 'unclassified_money', severity: 'WATCH', whatChanged: `There is ${current.unclassifiedAmount.toFixed(2)} of unclassified money.`, whyItMatters: 'Unclassified financial amounts reduce confidence in the completeness of the economic picture.', action: 'Review source records before treating the result as final.' });
  }
  if (current.dataFreshnessMinutes !== undefined && current.dataFreshnessMinutes > 360) {
    alerts.push({ key: 'stale_data', severity: 'WATCH', whatChanged: `Data is approximately ${Math.round(current.dataFreshnessMinutes)} minutes old.`, whyItMatters: 'Recent refunds, fees or payouts may not yet be reflected.', action: 'Sync the connection or mark the result as stale before making a decision.' });
  }
  return alerts;
}
