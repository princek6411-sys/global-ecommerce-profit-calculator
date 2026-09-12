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
