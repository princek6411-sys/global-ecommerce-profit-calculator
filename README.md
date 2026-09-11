# ProfitPilot — Global E-commerce True Profit Calculator

Next.js + TypeScript MVP/V2 for an e-commerce profit decision engine and seller intelligence tool.

## What is included

- True profit, margin, ROI and profit score
- Good / Marginal / Not profitable decision engine
- Country + currency + 6-language foundation
- India, USA, Germany, France, Spain and Japan launch countries
- Amazon, Flipkart, Meesho, TikTok Shop, Shopify, Etsy, eBay and Walmart architecture
- Break-even, target-profit price, target-margin price and max ad spend
- What-if and downside stress tests
- Platform and country comparisons
- Local save and shareable results
- Settlement CSV / per-SKU analysis processed in the browser
- Transparent fee assumption metadata
- Mobile-first UX, accessibility and SEO foundation

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Validate

```bash
npm run typecheck
npm run build
```

## Deploy

Push the project to GitHub and import the repository into Vercel. Vercel will run the Next.js build automatically.

## Important data note

Platform fee numbers included in `lib/config.ts` are explicitly **example assumptions**. They are not claims of current official marketplace fees. Replace them with verified official schedules before presenting them as current facts. Each fee configuration includes status/source/update metadata so that a verified data layer can be added without rewriting the UI.

## Privacy note

The settlement analyzer processes uploaded CSV text locally in the browser in this MVP. No database is required for core calculations.
