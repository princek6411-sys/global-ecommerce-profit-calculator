# ProfitPilot Live Data Deep Research — Shopify-First Vertical Slice

Research date: 2026-09-12

## Decision

Build one complete connector path first: Shopify.

Target path:

CONNECT → AUTHENTICATE → SYNC → NORMALIZE → CALCULATE → RECONCILE → EXPLAIN → RECOMMEND

Do not implement five partially-working connectors.

## Official Shopify findings

### Authentication

Shopify's current documentation supports three access approaches depending on app type. Standalone apps use authorization-code grant; embedded apps can use token exchange; apps operating only on stores in the developer's own organization can use client credentials. Background work and webhooks use offline access tokens. Official docs: https://shopify.dev/docs/apps/build/authentication-authorization and https://shopify.dev/docs/apps/build/authentication-authorization/authenticate-standalone-apps

For public apps calling GraphQL Admin API, current Shopify documentation requires expiring offline access tokens; non-expiring offline tokens are being phased out for public GraphQL apps with a January 1, 2027 deadline. The token response supplies expiration and refresh-token metadata; implementations should use the returned lifetimes rather than hard-code durations.

### API

The GraphQL Admin API is the current primary admin data interface. It uses calculated query cost rather than a simple request-count limit. Standard GraphQL Admin throughput is documented as 100 cost points/second, with higher plan tiers receiving higher restore rates. Official docs: https://shopify.dev/docs/api/usage/limits and https://shopify.dev/docs/api/admin-graphql/latest

### Bulk data

Shopify's BulkOperation object supports asynchronous export of large datasets and exposes status, object counts, result URLs and partial-data URLs. Result URLs expire after seven days. Official docs: https://shopify.dev/docs/api/admin-graphql/latest/objects/bulkoperation

### Orders

The current Order object supports order lifecycle data, line items, fulfillment, refunds, returns and transactions. The default Order object access window is the last 60 days; historical extraction beyond that requires the appropriate supported mechanism rather than assuming unrestricted order history. Official docs: https://shopify.dev/docs/api/admin-graphql/latest/objects/order

### Webhooks

Webhook deliveries include topic, HMAC signature, shop domain, webhook ID, API version and triggered-at metadata. Shopify does not guarantee ordering within a topic or across topics, so ProfitPilot must use timestamps/resource state and idempotent processing rather than assuming delivery order. Official docs: https://shopify.dev/docs/apps/build/webhooks and https://shopify.dev/docs/apps/build/webhooks/delivery-structure

For production, Shopify webhooks remain the appropriate stable mechanism; the newer Events mechanism is documented as developer preview and should not replace production webhooks yet. Official docs: https://shopify.dev/docs/apps/build/events-webhooks

### Compliance

Shopify requires public App Store apps to support mandatory compliance webhooks: `customers/data_request`, `customers/redact`, and `shop/redact`. Official docs: https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance

## Capability decision matrix

| Capability | Status in this ZIP | Reason |
|---|---|---|
| Shopify GraphQL client | IMPLEMENTED | Server-side fetch client added |
| OAuth authorize URL | IMPLEMENTED | Authorization-code flow path added |
| OAuth state binding | IMPLEMENTED | Signed state + HttpOnly browser binding |
| OAuth token exchange | IMPLEMENTED | Uses current expiring-token parameter |
| Durable token persistence | BLOCKED | Baseline has no database/user-auth persistence layer |
| Initial order sync | IMPLEMENTED | Server-side configured-token path |
| Product/variant sync | IMPLEMENTED | Server-side configured-token path |
| Inventory quantities | IMPLEMENTED | Uses product variant inventory quantity |
| Reconciliation foundation | IMPLEMENTED | Conservative order/refund reconciliation |
| Durable webhook queue | BLOCKED | Requires persistence/queue adapter |
| Multi-merchant connections | BLOCKED | Requires authenticated merchant identity + database |
| Historical order backfill | LIMITED | Default Order object window requires additional supported historical mechanism |
| Ads reconciliation | UNAVAILABLE in current vertical slice | Not included in current minimal Shopify queries |
| COGS | USER_PROVIDED / UNAVAILABLE | Shopify order data does not provide product acquisition cost automatically for ProfitPilot's current engine |
| Marketplace fee truth | NOT APPLICABLE to Shopify orders | Shopify economics differ from marketplace commission economics; fee inputs require separate verified source/inputs |

## Strategic connector order

1. Shopify — easiest complete vertical slice and strong webhooks/bulk/GraphQL foundation.
2. eBay — especially valuable for financial/payout reconciliation after generic architecture is proven.
3. Amazon — high value but more complex access/scope/reporting/operational surface.
4. Walmart — rich seller API surface; add after normalization and reconciliation stabilize.
5. Etsy — useful for merchant/listing/transaction research and additional marketplace coverage.

This ordering is a product-architecture recommendation, not a platform popularity ranking.

## Deliberate safety boundary

The current ZIP does not have a production database or user-authentication system. Therefore:

- OAuth callback does not persist access or refresh tokens.
- Webhooks are HMAC-verified but return 503 until durable persistence is configured.
- Live sync uses server-side environment credentials only.
- No token is placed in localStorage, browser state, logs, or API responses.
- No fake connected state is shown.

This is intentional rather than a hidden failure.
