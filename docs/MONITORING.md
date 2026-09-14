# ProfitPilot Monitoring

The current monitoring engine derives deterministic economic alerts for:

- material profit drops
- material margin drops
- widening settlement variance
- unclassified money
- stale data

The pure alert engine is implemented. Background scheduling, durable alert history and notification delivery require persistence/worker infrastructure and are not falsely claimed as complete.
