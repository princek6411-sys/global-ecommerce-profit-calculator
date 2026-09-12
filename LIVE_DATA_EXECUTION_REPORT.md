# ProfitPilot Live Data Execution Report

Execution date: 2026-09-12
Baseline: `profitpilot-platform-intelligence-AZ-implemented.zip`

## Status

- Repository audit: PASSED
- Shopify official research: PASSED
- Canonical commerce model foundation: PASSED
- Shopify server-side GraphQL client: PASSED (source implementation)
- Shopify OAuth authorization-code entry point: IMPLEMENTED
- OAuth browser-state binding: IMPLEMENTED
- OAuth token exchange: IMPLEMENTED
- Production token persistence: BLOCKED
- Live configured-token sync path: IMPLEMENTED
- Order/product/variant normalization: IMPLEMENTED
- Conservative reconciliation foundation: IMPLEMENTED
- Webhook HMAC verification: IMPLEMENTED
- Durable webhook processing/idempotency: BLOCKED
- Multi-merchant persistence: BLOCKED
- Existing calculator preserved: PASSED by code inspection
- Tests executed: BLOCKED by missing installed dependencies
- Full build executed: BLOCKED by missing installed dependencies

## Why persistence is blocked

The exact baseline ZIP contains no user authentication system or database/persistence layer. Adding ephemeral-file or browser token storage would violate the security requirement. Therefore the OAuth callback intentionally refuses to persist access/refresh tokens until a real server-side persistence adapter is configured.

The live sync path supports a server-side environment token for controlled testing/development. Production multi-merchant sync still requires durable `MarketplaceConnection`, `SyncJob`, `WebhookEvent` and raw-source persistence plus merchant identity/authentication.

## Files added

- `lib/commerce/types.ts`
- `lib/commerce/reconcile.ts`
- `lib/integrations/shopify/config.ts`
- `lib/integrations/shopify/auth.ts`
- `lib/integrations/shopify/client.ts`
- `lib/integrations/shopify/runtime.ts`
- `app/api/shopify/connect/route.ts`
- `app/api/shopify/callback/route.ts`
- `app/api/shopify/status/route.ts`
- `app/api/shopify/sync/route.ts`
- `app/api/shopify/webhooks/route.ts`
- `app/connections/page.tsx`
- `tests/shopify.test.ts`
- `docs/LIVE_DATA_DEEP_RESEARCH.md`
- `docs/LIVE_DATA_VERTICAL_SLICE.md`

## Files modified

- `app/page.tsx` — Live Data navigation link
- `app/sitemap.ts` — `/connections/` route
- `README.md` — live-data documentation
- `docs/ARCHITECTURE_AUDIT.md` — live-data boundary and migration path

## Deliberate non-implementation

The following are intentionally not faked or prematurely implemented:

- durable multi-merchant token storage
- background job queue
- durable webhook event store
- full historical backfill beyond Shopify's directly accessible order window
- ads reconciliation
- COGS ingestion
- Shopify accounting/settlement claims that are not present in the selected data path

## Official research basis

- Shopify authentication: standalone apps use authorization-code grant; public GraphQL apps must use expiring offline access tokens; current docs state non-expiring public GraphQL offline tokens cannot be used after 2027-01-01.
- Shopify GraphQL Admin API: cost-based throttling and bulk operations for large datasets.
- Shopify webhooks: HMAC verification, webhook IDs, API version, triggered-at metadata; delivery ordering is not guaranteed.
- Shopify public App Store apps: mandatory compliance webhooks for customer/shop data requests and redaction.

See `docs/LIVE_DATA_DEEP_RESEARCH.md` for URLs.
