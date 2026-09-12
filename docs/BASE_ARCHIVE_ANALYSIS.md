# Base Archive Analysis — GitHub-safe Decision Tools Upgrade

## Source used

The implementation base was the latest internally produced `profitpilot-23-point-production-upgrade.zip`, with the earlier `ecom-profit-calculator-vercel-build-fix.zip` checked as a build-safety reference.

## Findings from the base

### 1. Existing architecture was already suitable
- Next.js App Router + TypeScript
- One central calculation path through `lib/calculation-engine.ts` / `lib/calculator.ts`
- Existing money model in `lib/money.ts`
- Existing FX architecture in `lib/fx.ts`
- Existing marketplace/country configuration in `lib/config.ts`
- Existing Seller Intelligence in `components/SellerAnalyzer.tsx` and `lib/csv.ts`
- Existing calculator already had scenario and comparison UI

### 2. High-priority Seller Intelligence defects found
- Imported CSV money was formatted using the global display currency rather than preserving source currency.
- `returns` and `rto` were treated as monetary fields even when the source values were counts.
- `deductions` could be present in a source CSV without a supported mapping and therefore needed explicit unclassified handling.
- The SKU table did not expose Product Cost, Recognized Costs and Settlement as distinct, correctly labeled columns.
- Settlement variance and profit were displayed too close together without a sufficiently clear calculation-basis explanation.
- Recommendations were too generic and not consistently tied to the largest controllable cost.

### 3. Decision-tool UX gap
The old scenario and comparison surfaces were functional but did not fully enforce the supplied decision-clarity rule:

**NUMBER → MEANING → REASON → NEXT ACTION**

The upgrade consolidates What-If, Stress Test and Compare into a shared decision layer while keeping the existing calculation engine.

### 4. Build-safety reference
The earlier Vercel build record showed two known dependency hazards: unsupported `simple-icons` exports and a PostCSS/Tailwind mismatch. The working base already contained the build-safe neutral/Lucide icon approach and build-safe PostCSS configuration. Those were preserved rather than reintroduced.

## Change-minimization rule

No duplicate app, duplicate repository identity, duplicate wrapper project, or second calculation engine was introduced.

The ZIP root is the application root itself and does not contain a `work_home/` wrapper directory.
