# ProfitPilot Live Data Vertical Slice — Shopify First

## What is implemented

- Shopify authorization-code OAuth entry point using signed state.
- Server-side GraphQL Admin API client.
- Server-side configured-token sync path for a single store.
- Order and product/variant inventory normalization into canonical types.
- Conservative reconciliation that does not invent COGS, advertising, fees, or settlement values.
- Shopify webhook HMAC verification with delivery metadata.
- Explicit connection/sync states.
- A `/connections` UI that never fabricates a connected state.

## Current production boundary

The supplied ZIP has no user identity/auth layer and no persistent database adapter. Therefore OAuth callback does **not** persist access or refresh tokens. This is deliberate: tokens are never written to localStorage, returned to browser code, or stored in an ephemeral filesystem as a fake production solution.

For a production multi-merchant connector, add a server-side database/secret storage adapter and connect it to `MarketplaceConnection`, `SyncJob`, `WebhookEvent`, and raw-source persistence.

## Shopify research facts used by this slice

- Standalone apps use the authorization-code grant; expiring offline access tokens are required for public apps calling the GraphQL Admin API, with current Shopify documentation stating existing public apps must not use non-expiring offline GraphQL tokens after January 1, 2027.
- GraphQL Admin API is cost-based rate-limited and complex queries may require bulk operations.
- Webhook deliveries include HMAC, webhook ID, topic, shop domain, API version and triggered-at headers; Shopify does not guarantee event ordering.
- Shopify requires mandatory compliance webhooks for public apps distributed through the App Store.
- The Order object covers order lifecycle, refunds/returns and transactions, but only the last 60 days of orders are accessible from the Order object by default; broader historical extraction must use appropriate reporting/bulk mechanisms.

All current platform claims are sourced from official Shopify documentation in the implementation research report.

## Environment setup reference

Copy `.env.example` to the deployment environment and keep all Shopify secrets server-only. The current `SHOPIFY_OFFLINE_ACCESS_TOKEN` path is intended for controlled server-side live-sync testing only until durable multi-merchant persistence is implemented.
