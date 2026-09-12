# ProfitPilot — Decision Tools Master Upgrade

This implementation is based on the supplied **Decision Tools Master Upgrade** prompt and the higher-priority rule:

> **NUMBER → MEANING → REASON → NEXT ACTION**

## Scope

- Seller Intelligence
- What-If
- Stress Test
- Compare

These remain decision layers over the existing calculation engine. No second calculation engine is introduced.

## Implementation choices

1. Existing `components/Calculator.tsx` keeps the calculator, localization and FX architecture.
2. The old combined scenario/compare tab is consolidated into a `DecisionTools` component so the four tools share one calculation path.
3. `lib/decision-tools.ts` contains deterministic scenario, risk and recommendation logic.
4. `lib/csv.ts` now separates return/RTO counts from monetary return/RTO costs and preserves source currency.
5. `components/SellerAnalyzer.tsx` now labels Product Cost, Recognized Costs, Settlement, Profit and Margin explicitly and surfaces unmapped deductions.
6. Native economics are shown before converted reporting values in comparisons.
7. Recommendations avoid invented explanations when data is insufficient.

## Important data-trust rule

Imported seller money is not converted merely because the global display-currency selector changes. Source currency remains explicit. Cross-currency reporting should only be added with a valid FX path and explicit status.

## Verification note

The existing archive had previously been build-verified in Vercel before this upgrade; the local environment available for this package could not complete a fresh `npm install` during this build pass because the dependency install timed out. The new calculation/csv TypeScript sources were statically type-checked without installing external packages. The final ZIP intentionally contains no `node_modules` and no newly generated lockfile.
