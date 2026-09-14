# ProfitPilot Reconciliation

Reconciliation is a first-class capability.

## Supported foundations

- Expected vs actual amount reconciliation.
- Currency conflict detection.
- Order-to-transaction reconciliation primitive.
- Settlement-to-payout reconciliation primitive.
- Shopify order reconciliation.
- CSV settlement reconciliation.

## States

MATCHED
PARTIALLY_MATCHED
UNMATCHED
UNCLASSIFIED
PENDING
DATA_DELAY
SOURCE_CONFLICT
DUPLICATE
INVALID
STALE

Unexplained differences stay UNCLASSIFIED instead of being assigned to an invented category.
