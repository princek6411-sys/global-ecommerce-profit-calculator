# ProfitPilot Architecture Audit

Date: 2026-09-14

## Repository source of truth

This document reflects the inspected ProfitPilot repository snapshot. Existing calculation, Money/FX, Seller Intelligence, Decision Tools, Platform Intelligence and Shopify integration remain authoritative where already implemented.

## Current → target mapping

| Target responsibility | Existing/current implementation | Status | Decision |
|---|---|---|---|
| Canonical calculation | `lib/calculator.ts`, `lib/calculation-engine.ts` | IMPLEMENTED | KEEP as single economic authority |
| Money / FX | `lib/money.ts`, `lib/fx.ts` | IMPLEMENTED | KEEP |
| Seller Intelligence | `components/SellerAnalyzer.tsx`, `lib/csv.ts` | IMPLEMENTED + EXTENDED | KEEP / extend with economic core |
| What-If / Stress / Compare | `components/DecisionTools.tsx`, `lib/decision-tools.ts` | IMPLEMENTED + EXTENDED | KEEP / extend with shared economic decisions |
| Raw source representation | `lib/commerce/types.ts` source refs | PARTIAL | EXTEND; durable storage remains blocked without persistence |
| Normalization | Shopify client + CSV normalizer | PARTIAL | EXTEND through common canonical types |
| Canonical commerce model | `lib/commerce/types.ts` | PARTIAL → EXTENDED | KEEP / add transaction, settlement, payout, inventory, ads, experiment entities |
| Economic ledger | `lib/commerce/ledger.ts` | IMPLEMENTED FOUNDATION | Reuses calculation engine; no competing formulas |
| Provenance | `lib/commerce/provenance.ts` | IMPLEMENTED FOUNDATION | Attach evidence/trust metadata |
| Reconciliation | `lib/commerce/reconcile.ts`, `lib/commerce/reconciliation-engine.ts`, CSV reconciliation | IMPLEMENTED FOUNDATION / PARTIAL LIVE | Generic amount + settlement reconciliation; multi-source persistence remains future |
| Platform adapters | `lib/commerce/platform-adapters.ts`, `lib/integrations/platform-adapter.ts`, registry | IMPLEMENTED ARCHITECTURAL CONTRACT | Shopify partial-live; other platforms capability-only/research-only |
| Action engine | `lib/commerce/actions.ts`, `lib/commerce/economic-core.ts` | IMPLEMENTED FOUNDATION | Deterministic evidence-driven recommendation |
| Experiments | `lib/commerce/experiments.ts`, Decision Tools local browser lifecycle | IMPLEMENTED LOCAL | Scenario vs observed outcome explicitly separated; durable cross-device history requires persistence |
| Monitoring | `lib/commerce/monitoring.ts` | IMPLEMENTED PURE ENGINE | Alert derivation exists; scheduler/persistent history requires background infrastructure |
| Learning | experiment outcome object + local storage | PARTIAL | Local learning record exists; cross-seller learning system intentionally not claimed |
| Platform Intelligence | `lib/platform-intelligence.ts`, UI | IMPLEMENTED | KEEP separate from transaction economics |
| Security | existing server-side Shopify integration | PARTIAL | Secrets remain server-side; durable credential lifecycle needs auth/database |
| Observability | sync diagnostics + economic alert primitives | PARTIAL | Expand with production telemetry when worker/database infrastructure exists |

## Deliberate blockers

1. No fake Amazon/eBay/Walmart/Etsy/Flipkart/Meesho/TikTok Shop live connectors are claimed. Their adapter/capability contracts exist, but official credentials, approvals and production data access are platform-dependent.
2. The repository has no durable multi-merchant database/authentication layer. OAuth/token persistence and long-lived raw evidence therefore remain blocked rather than being faked.
3. Full inventory cost-layer accounting is not claimed. Current COGS remains explicit and model-dependent.
4. Background scheduling, durable monitoring history and cross-device experiment history require persistence/worker infrastructure.

## Safety invariants

- One economic calculation authority.
- Native operating economics stay distinct from reporting-currency conversions.
- Settlement variance is independent from profit.
- Unmapped monetary amounts remain visible.
- Counts and money values remain different types.
- Research facts cannot silently become seller-specific economics.
- Fake live integrations and fake evidence are forbidden.
