# ProfitPilot Final Upgrade Audit

## Implemented in this working copy

- Added typed `Money` model and centralized formatting helpers.
- Added separate marketplace operating currency and display/reporting currency.
- Added dynamic FX provider abstraction using the app's `/api/fx` route and Frankfurter reference-rate data.
- Added browser cache and explicit stale-rate state.
- Added FX source/date messaging in the calculator.
- Added calculation orchestration through `lib/calculation-engine.ts`.
- Added structured profit layers, validity flags for mathematically impossible prices, and deterministic confidence/leak diagnostics.
- Added price-sensitivity scenarios and preserved existing what-if/stress flows.
- Updated marketplace and country comparison presentation to distinguish native economics from converted reporting values.
- Extended settlement CSV analysis with expected payout vs actual payout reconciliation variance.
- Added automated unit test definitions in `tests/calculator.test.ts`.
- Added architecture/data-trust/regression documentation.
- Added ESLint/Vitest configuration and scripts.

## Source/data policy

Marketplace numbers already marked as example assumptions remain examples. No new live marketplace fee/tax/shipping values were invented.

## Validation completed in this environment

- Pure TypeScript check for the calculation/config/money/FX-adjacent modules: PASS.
- Production Next.js build: NOT VERIFIED in this environment because project dependencies could not be installed within the available network/runtime window.
- Full Vercel deployment: NOT VERIFIED here.

## Important runtime acceptance test

When an operating-currency profit is displayed in another currency, the amount must change through the FX rate while percentage margin/ROI remain invariant apart from display rounding.

Example acceptance behavior:

USD $11.04 -> INR is a converted INR amount, not ₹11.04.

The UI labels the operating currency, display currency, FX date/source, and stale-state where applicable.
