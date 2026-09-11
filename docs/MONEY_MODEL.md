# Money Model

ProfitPilot distinguishes operating/marketplace currency from display/reporting currency.

- Inputs and core economics stay in the marketplace operating currency.
- Display currency changes presentation through the FX layer.
- A display-currency change must not alter margin, ROI, fee percentages, return rates, RTO rates, or profit score.
- Monetary calculations use the `Money` type from `lib/money.ts`.
- Currency formatting follows the currency registry and decimal policy.
