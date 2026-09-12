# ProfitPilot Architecture Audit

This document records the refactor boundary for the ProfitPilot upgrade.

## Current source of truth
- `lib/calculator.ts` remains the low-level legacy calculation implementation to preserve regression behavior.
- `lib/calculation-engine.ts` is the new single orchestration layer used by upgraded result surfaces.
- `lib/money.ts` owns typed money values and formatting.
- `lib/fx.ts` owns exchange-rate fetching, cache, fallback, and metadata.
- `lib/config.ts` owns country, currency, language, marketplace, and fee metadata.
- `lib/csv.ts` remains the browser-local settlement/SKU normalization layer.

## Critical invariant
Operating/marketplace currency and display/reporting currency are separate concepts. Changing display currency converts monetary outputs but does not change the underlying economics or percentage metrics.

## Data trust
Marketplace fee values marked `example` remain assumptions. The UI must not label those values as official/current without source verification.

## Platform Intelligence Pass — 2026-09-12

The platform-intelligence layer is implemented separately from the calculator configuration. Verified research metadata covers the ten platforms in the supplied A–Z report. Existing calculator-supported platforms not covered by that report (for example Meesho and TikTok Shop) are explicitly marked unverified within the research layer rather than being falsely upgraded to verified.

No live API connectors were introduced. No universal fee schedule was manufactured from the report. The canonical calculation engine remains the authority for numerical profit results.

## Platform Intelligence implementation pass — 2026-09-12

Implemented the researched Platform Intelligence layer without creating a second application or replacing the calculation engine.

- Centralized `PlatformFact` schema and research registry in `lib/platform-intelligence.ts`.
- Added active capability coverage for all ten research platforms from the supplied A–Z report.
- Added explicit lifecycle notices for renamed/discontinued items with dates.
- Added scoped economic facts without pretending unpublished/category-specific values are universal.
- Added free `/platform-intelligence` hub with search, family filter, economic-only filter, source links and lifecycle watch.
- Added full A–Z research link from the homepage and Decision Tools.
- Kept Meesho and TikTok Shop calculator support separate from research verification.
- Decision Tools now surfaces active capability counts, economic facts and research boundaries.
- Added automated tests for platform coverage, lifecycle data, source integrity and alias handling.
