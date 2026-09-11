# FX Architecture

The current display-FX provider is Frankfurter's public v2 API. It supports latest and historical rate retrieval without an API key and identifies rates by base, quote, date, and rate. The application keeps the provider behind `lib/fx.ts` so the provider can be replaced later.

## Runtime behavior

1. Request the base/quote rate only when the display currency differs from the operating currency.
2. Cache successful quotes in browser local storage for a short TTL.
3. If the provider fails but a cached quote exists, show the cached quote explicitly as stale.
4. Never claim a reference FX quote is the exact marketplace/payment settlement rate.
5. Historical CSV analysis should preserve transaction/settlement currencies rather than rewriting old economics with today's display rate.
