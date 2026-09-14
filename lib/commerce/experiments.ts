export type ExperimentStatus = 'DRAFT' | 'RUNNING' | 'OBSERVED' | 'COMPLETED' | 'CANCELLED';

export type EconomicExperiment = {
  id: string;
  hypothesis: string;
  baselineProfit: number;
  baselineMargin: number;
  proposedChange: string;
  expectedProfit?: number;
  startedAt: string;
  status: ExperimentStatus;
  observedProfit?: number;
  observedMargin?: number;
  result?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'INCONCLUSIVE';
  learning?: string;
};

export function createExperiment(input: Pick<EconomicExperiment, 'hypothesis' | 'baselineProfit' | 'baselineMargin' | 'proposedChange'> & Partial<Pick<EconomicExperiment, 'expectedProfit'>>): EconomicExperiment {
  return {
    id: `exp:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    startedAt: new Date().toISOString(),
    status: 'RUNNING'
  };
}

export function recordExperimentOutcome(experiment: EconomicExperiment, outcome: { observedProfit: number; observedMargin: number; learning?: string }): EconomicExperiment {
  const profitDelta = outcome.observedProfit - experiment.baselineProfit;
  const result = Math.abs(profitDelta) < 0.000001 ? 'NEUTRAL' : profitDelta > 0 ? 'POSITIVE' : 'NEGATIVE';
  return {
    ...experiment,
    status: 'COMPLETED',
    observedProfit: outcome.observedProfit,
    observedMargin: outcome.observedMargin,
    result,
    learning: outcome.learning
  };
}
