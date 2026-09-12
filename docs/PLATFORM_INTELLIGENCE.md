# Platform Intelligence

## Purpose

Platform Intelligence is a research-backed knowledge layer. It is not a live marketplace integration and it is not a replacement for the canonical calculation engine.

The supplied research report covers Amazon, Alibaba/Tmall/Taobao, eBay, Shopify, Walmart Marketplace, Rakuten Ichiba, Mercado Libre, JD.com, Etsy and Flipkart. Its methodology prioritizes official seller/merchant help, developer documentation, pricing pages, corporate filings/newsrooms and official seller blogs.

## Architecture boundary

`Platform Registry → Platform Facts → Economic Configuration → Canonical Calculation Engine → Decision Tools → UX Interpretation`

Platform facts explain what a marketplace offers or requires. Only economic fields that are actually modeled and appropriately scoped may enter the calculator.

## Trust rules

- Do not invent unpublished fees.
- Do not silently resolve conflicting official sources.
- Keep `effectiveDate` and `retrievalDate` for time-sensitive values.
- Distinguish researched facts from live account data.
- Distinguish researched marketplaces from calculator-supported marketplaces.
- Do not turn analyst Impact/Adoption judgements into fake numeric adoption statistics.
- Exact source URLs are not fabricated when the supplied parsed research does not expose their inline targets.

## Current coverage

Verified research metadata is represented for the ten research platforms. Meesho and TikTok Shop remain calculator-supported in the existing app but are marked `UNVERIFIED` in this research layer because they were not covered by the supplied A–Z research report.

## Economic families represented

The research layer recognizes these families where supported by the report:

- fulfilment
- seller performance
- advertising
- fees
- payments/payouts
- API/integration
- brand/IP
- multichannel fulfilment
- cross-border
- financing
- pricing automation
- reviews
- storefront
- loyalty
- AI operations

## Important limitation

This layer deliberately does not convert the report into a universal fee schedule. Category, country, seller-tier, plan, and time-dependent economics must be modeled separately when sufficient verified data exists.
