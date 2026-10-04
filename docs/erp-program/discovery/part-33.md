# Discovery — Part 33: Planned vs Budgeted vs Actual Engine (SA-2)

## Search performed
Keywords (code + DB catalogue): variance, planned vs actual, budget vs actual, cost report, control, earned, forecast, fact table, materialized view.

## Findings
- No existing `pce_*` entities, screens or APIs in the repository (frontend baseline app; no backend, no materialized-view capability exposed).
- Existing cost/progress summary surfaces exist as components + data (Parts 25–27, 30): `budgetData.ts` (budget lines, commitments, variance), `progressData.ts` (EVM entries, S-curves), `planningData.ts` (schedule phasing), `dprData.ts` (actuals), `procurementData.ts` (Part 34 commitments) — reused as source adapters; retire only after parity at backend delivery.
- No common engine unifies these today — each module computes its own summary; PCE is delivered as the single control data source (NEW) with source adapters (REUSE).
- Dashboard pattern (Parts 28–32, 34) reused; feature flag registry extended additively with `ff.pce`, `ff.pce.provisional`.
- Part 34 was implemented before Part 33 in this workspace (program order deviation recorded in CONFLICTS.md C34-2); Part 34's PO commitments are referenced as the procurement-group source.
- No part of the existing behaviour is changed; all additions are new files + additive registrations.

## REUSE / EXTEND / NEW

| Item | Kind | Decision | Notes |
|---|---|---|---|
| `pce_facts` | Entity | NEW | PC-14 dimensions × 8 measure groups × 6 engine measures; refreshed_at, source_version |
| `pce_refresh_log` | Entity | NEW | incremental/full/on_demand, status, error |
| `pce_measure_definitions` | Entity | NEW | measure dictionary, formulas, SA-18 labels |
| Budget summary + commitments (Part 25) | Entity | REUSE | budgeted/committed source; reconciliation source |
| Schedule phasing (Part 26) | Entity | REUSE | planned source |
| EVM/progress (Part 27) | Entity | REUSE | earned source (progress × budget) |
| DPR/attendance/plant logs (Part 30) | Entity | REUSE | actual source (approved/posted only) |
| PO commitments (Part 34) | Entity | REUSE | procurement group source |
| Billing (Part 46) | Entity | DEFERRED | certified/billed/collected modelled; Part 46 not yet in workspace |
| Existing cost/progress summary queries | Calculation | REUSE | wrapped as adapters; retired only after parity |
| Variance calculators (6) | Calculation | NEW | quantity/cost/schedule/productivity/commitment coverage/billing lag |
| Reconciliation (engine vs module vs GL) | Calculation | NEW | tolerance 0 vs GL; BLOCK at period close |
| Refresh orchestrator (debounced incremental + nightly full + on-demand) | Job | NEW | refresh failure is a violation (CP-PCE-01) |
| Control view (pivot grid) | Screen | NEW | rows WBS/cost code; columns planned→forecast; toggles; Why? drill |
| Measure dictionary view | Screen | NEW | formulas + SA-18 labels |
| Dashboards/Project 360 consumers (Parts 19, 67, 71, 95, 113) | Screen | DEFERRED | consume `pce.project.refreshed` + query API at their delivery |

## Conflicts
See `CONFLICTS.md` (C33-1..C33-3). No existing behaviour was changed.
