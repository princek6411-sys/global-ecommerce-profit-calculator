import {
  calculateBreakEvenPrice,
  calculateLineItems,
  calculateMaximumAdSpend,
  calculateProfitSnapshot,
  calculateTargetProfitPrice,
  type CalculatorInput,
} from '@/lib/calculator';

export type DemoScenario = {
  sellingPrice: number;
  productCost: number;
  platformFee: number;
  paymentFee: number;
  advertising: number;
  shipping: number;
};

export const DEMO_SCENARIO: DemoScenario = {
  sellingPrice: 49.99,
  productCost: 15,
  platformFee: 7,
  paymentFee: 1.75,
  advertising: 8,
  shipping: 5,
};

export const demoAssumptions = [
  { label: 'Selling price', value: '$49.99', status: 'User/example input' },
  { label: 'Product cost', value: '$15.00', status: 'User/example input' },
  { label: 'Marketplace fee', value: '$7.00', status: 'Example assumption' },
  { label: 'Payment fee', value: '$1.75', status: 'Example assumption' },
  { label: 'Shipping', value: '$5.00', status: 'User/example input' },
  { label: 'Advertising', value: '$8.00', status: 'User/example input' },
  { label: 'Tax / returns / RTO', value: '$0.00', status: 'Disabled in this example' },
];

export function createDemoInput(overrides: Partial<DemoScenario> = {}): CalculatorInput {
  const s = { ...DEMO_SCENARIO, ...overrides };
  return {
    sellingPrice: s.sellingPrice,
    quantity: 1,
    productCost: s.productCost,
    platformFee: { enabled: true, value: s.platformFee, mode: 'fixed' },
    paymentFee: { enabled: true, value: s.paymentFee, mode: 'fixed' },
    shipping: { enabled: true, value: s.shipping, mode: 'fixed' },
    packaging: { enabled: false, value: 0, mode: 'fixed' },
    advertising: { enabled: true, value: s.advertising, mode: 'fixed' },
    affiliate: { enabled: false, value: 0, mode: 'fixed' },
    discount: { enabled: false, value: 0, mode: 'fixed' },
    returns: { enabled: false, value: 0, mode: 'fixed' },
    rto: { enabled: false, value: 0, mode: 'fixed' },
    tax: { enabled: false, value: 0, mode: 'fixed' },
    other: { enabled: false, value: 0, mode: 'fixed' },
  };
}

export function getDemoSnapshot(overrides: Partial<DemoScenario> = {}) {
  const input = createDemoInput(overrides);
  return { input, ...calculateProfitSnapshot(input) };
}

export function getDemoStress() {
  const base = getDemoSnapshot();
  const scenarios = [
    { key: 'ads', label: 'Ads +20%', input: createDemoInput({ advertising: DEMO_SCENARIO.advertising * 1.2 }) },
    { key: 'shipping', label: 'Shipping +15%', input: createDemoInput({ shipping: DEMO_SCENARIO.shipping * 1.15 }) },
    { key: 'product', label: 'Product cost +10%', input: createDemoInput({ productCost: DEMO_SCENARIO.productCost * 1.1 }) },
    {
      key: 'combined',
      label: 'Combined downside',
      input: createDemoInput({
        advertising: DEMO_SCENARIO.advertising * 1.2,
        shipping: DEMO_SCENARIO.shipping * 1.15,
        productCost: DEMO_SCENARIO.productCost * 1.1,
      }),
    },
  ].map((scenario) => ({
    ...scenario,
    profit: calculateProfitSnapshot(scenario.input).profit,
  }));

  return { base, scenarios, surviveCount: scenarios.filter((scenario) => scenario.profit > 0).length };
}

export function getDemoRange() {
  const base = getDemoSnapshot();
  const upside = getDemoSnapshot({ sellingPrice: DEMO_SCENARIO.sellingPrice * 1.05 });
  const downside = getDemoSnapshot({
    advertising: DEMO_SCENARIO.advertising * 1.2,
    shipping: DEMO_SCENARIO.shipping * 1.15,
    productCost: DEMO_SCENARIO.productCost * 1.1,
  });
  return {
    low: Math.min(base.profit, downside.profit),
    high: Math.max(base.profit, upside.profit),
    upside: upside.profit,
    downside: downside.profit,
  };
}

export function getDemoDecision() {
  const snapshot = getDemoSnapshot();
  const line = calculateLineItems(snapshot.input);
  const entries = Object.entries(line).filter(([key]) => key !== 'revenue');
  const biggest = entries.sort((a, b) => b[1] - a[1])[0];
  const maxAdSpend = calculateMaximumAdSpend(snapshot.input);
  const targetPrice = calculateTargetProfitPrice(snapshot.input, 20);
  const breakEven = calculateBreakEvenPrice(snapshot.input);

  return {
    snapshot,
    biggestCostKey: biggest?.[0] ?? 'product',
    biggestCostValue: biggest?.[1] ?? 0,
    maxAdSpend,
    targetPrice,
    breakEven,
    recommendation: maxAdSpend < DEMO_SCENARIO.advertising + 1
      ? 'Keep ad spend tightly controlled.'
      : 'Test a lower ad cost before raising price.',
  };
}
