# Platform Intelligence

## Production implementation

ProfitPilot now has a centralized, versioned Platform Intelligence registry in `lib/platform-intelligence.ts` and a free, discoverable user experience at `/platform-intelligence`.

The registry is sourced from the supplied **E-Commerce Platform Seller Features A–Z: Verified Edition (September 2026)** report. The report covers ten research platforms: Amazon, Alibaba/Tmall/Taobao, eBay, Shopify, Walmart Marketplace, Rakuten Ichiba, Mercado Libre, JD.com, Etsy and Flipkart.

Existing calculator marketplaces Meesho and TikTok Shop remain available to the calculator, but are explicitly marked as research-unverified because they were not covered by the supplied report.

## Architecture boundary

`Platform Registry → Platform Facts → Decision Context → Canonical Calculation Engine → Decision Tools → UX`

Platform facts never silently rewrite profit. A fact marked `CALCULATION_INPUT` is only safe to apply when the fact scope matches the user’s actual country/category/plan/weight/tier/date inputs. Otherwise the UI presents the fact as contextual or asks the seller to enter the relevant cost manually.

## PlatformFact fields

Each fact carries:

- official feature name and A–Z letter
- lifecycle status
- verification state
- feature family
- plain-language definition
- why it matters
- scope/eligibility/dependencies when known
- calculation role (`CALCULATION_INPUT`, `CONTEXT_ONLY`, `NOT_MODELED`)
- economic value/range when explicitly published
- effective/discontinued dates
- replacement information
- failure mode where the source publishes one
- source and official source URL
- research notes

## Trust boundary

- `VERIFIED` means supported by the supplied official-source research report.
- `UNCLASSIFIED`/`UNVERIFIED` must never be presented as verified marketplace economics.
- Unpublished values are explicitly disclosed as unavailable rather than defaulted to zero.
- Analyst impact/adoption scores are context, not platform-published usage statistics.
- Current account-level eligibility, negotiated rates and seller-dashboard-only values are not represented as live data.

## Lifecycle watch

The registry explicitly surfaces deprecated or replaced items, including:

- eBay Bucks — discontinued 2024-04-02.
- eBay Global Shipping Program — legacy workflow replaced by eBay International Shipping in relevant markets from August 2026.
- Shopify Oberlo — shut down 2022-06-15.
- Mercado Shops — active-store access ended 2025-12-31; new-store access had closed earlier according to the research report.
- JD JOS developer centre — migrated into JD Merchant Open Platform by 2026-08-30.
- Etsy Adobe/Hover offers inside Etsy Plus — ended 2026-02-21.

## UI principle

The product follows:

`NUMBER → MEANING → REASON → NEXT ACTION`

The Platform Intelligence hub uses progressive disclosure. Users see capability summaries first and open details/source links only when they need them.

## Free-first product rule

All platform intelligence in this phase is free and discoverable. There is no membership, subscription gate or research paywall.
