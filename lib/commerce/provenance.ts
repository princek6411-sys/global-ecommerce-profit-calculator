export type ProvenanceKind =
  | 'VERIFIED_SOURCE'
  | 'USER_PROVIDED'
  | 'CALCULATED'
  | 'ALLOCATED'
  | 'ESTIMATED'
  | 'SCENARIO'
  | 'UNAVAILABLE'
  | 'UNCLASSIFIED'
  | 'STALE'
  | 'MOCKED';

export type SourceProvenance = {
  kind: ProvenanceKind | string;
  source?: string;
  sourceUrl?: string;
  sourceRecordId?: string;
  effectiveAt?: string;
  observedAt?: string;
  confidence?: number;
  freshness?: 'LIVE' | 'RECENT' | 'STALE' | 'UNKNOWN';
  note?: string;
};

export function sourceProvenance(input: SourceProvenance): SourceProvenance {
  return {
    ...input,
    confidence: typeof input.confidence === 'number' ? Math.max(0, Math.min(1, input.confidence)) : undefined,
    observedAt: input.observedAt ?? new Date().toISOString()
  };
}
