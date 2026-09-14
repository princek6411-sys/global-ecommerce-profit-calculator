# ProfitPilot Security Boundary

Marketplace credentials remain server-side in the existing Shopify integration.

The current repository does not claim durable multi-merchant OAuth token persistence because it has no durable identity/database layer. This is explicitly treated as BLOCKED / REQUIRES DATABASE rather than storing secrets insecurely.

Never log credentials. Never expose tokens to client components.
