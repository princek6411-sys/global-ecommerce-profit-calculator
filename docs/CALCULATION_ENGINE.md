# Calculation Engine

`lib/calculation-engine.ts` is the orchestration layer. It reuses the existing low-level formula functions from `lib/calculator.ts` while standardizing the structured result returned to UI surfaces.

Profit layers:

- Gross profit = revenue - product cost - discounts.
- Contribution profit = gross profit - non-ad operating variable costs.
- Ad-adjusted profit = contribution profit - advertising.
- True profit = the existing calculator's net profit result, retained for regression safety.

Break-even and target prices report a validity flag when the mathematical denominator makes the solution impossible; the UI should show `N/A` instead of `Infinity`.
