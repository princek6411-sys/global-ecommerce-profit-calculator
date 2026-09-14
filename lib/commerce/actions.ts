import type { CalculationResult } from '@/lib/calculation-engine';

export type EconomicAction = {
  trigger: string;
  evidence: string;
  diagnosis: string;
  action: string;
  controlLevel: 'CONTROLLABLE' | 'PARTIALLY_CONTROLLABLE' | 'EXTERNAL' | 'UNKNOWN';
  expectedDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  measurement: string;
};

type ActionInput = {
  revenue: number;
  currency: string;
  costs: Array<{ label: string; key: string; amount: number; controlLevel: EconomicAction['controlLevel']; action: string }>;
};

function buildFromInput(input: ActionInput): EconomicAction | null {
  const candidates = input.costs
    .filter((item) => Number.isFinite(item.amount) && item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const top = candidates.find((item) => item.controlLevel !== 'EXTERNAL') ?? candidates[0];
  if (!top || input.revenue <= 0) return null;
  const share = (top.amount / input.revenue) * 100;
  return {
    trigger: `${top.label} is ${share.toFixed(1)}% of revenue.`,
    evidence: `${top.label} contributes ${top.amount.toFixed(2)} ${input.currency} in the canonical economic model.`,
    diagnosis: top.controlLevel === 'EXTERNAL'
      ? `${top.label} is significant but is externally determined in the current data.`
      : `${top.label} is the highest-value actionable cost driver among supported inputs.`,
    action: top.action,
    controlLevel: top.controlLevel,
    expectedDirection: top.controlLevel === 'EXTERNAL' ? 'NEUTRAL' : 'POSITIVE',
    measurement: 'Measure contribution profit, profit margin and the affected cost as a percentage of revenue after the test.'
  };
}

export function buildEconomicAction(result: CalculationResult): EconomicAction | null {
  return buildFromInput({
    revenue: result.revenue.amount,
    currency: result.currency,
    costs: [
      { label: 'Advertising', key: 'advertising', amount: result.line.advertising?.amount ?? 0, controlLevel: 'CONTROLLABLE', action: 'Test a modest reduction in advertising spend and compare contribution profit.' },
      { label: 'Product cost', key: 'product', amount: result.line.product?.amount ?? 0, controlLevel: 'PARTIALLY_CONTROLLABLE', action: 'Test a lower landed/unit cost or supplier quote without changing product quality assumptions.' },
      { label: 'Shipping', key: 'shipping', amount: result.line.shipping?.amount ?? 0, controlLevel: 'PARTIALLY_CONTROLLABLE', action: 'Compare fulfillment/shipping options and recalculate contribution profit.' },
      { label: 'Marketplace fee', key: 'platform', amount: result.line.platform?.amount ?? 0, controlLevel: 'EXTERNAL', action: 'Compare another selling channel or verify the current seller fee configuration.' },
      { label: 'Returns', key: 'returns', amount: result.line.returns?.amount ?? 0, controlLevel: 'PARTIALLY_CONTROLLABLE', action: 'Review return reasons and test the highest-impact preventable return driver.' },
      { label: 'RTO', key: 'rto', amount: result.line.rto?.amount ?? 0, controlLevel: 'PARTIALLY_CONTROLLABLE', action: 'Review RTO drivers and test fulfillment or confirmation changes.' }
    ]
  });
}

export function buildEconomicActionFromCosts(input: ActionInput): EconomicAction | null {
  return buildFromInput(input);
}
