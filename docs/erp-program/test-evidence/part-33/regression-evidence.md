# Test Evidence - Part 33: Planned vs Budgeted vs Actual Engine (Project Control Engine)

Date: 2026-10-04 · Workspace: frontend baseline app (see CONFLICTS.md C33-1)

## Gates run

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | PASS |
| Build | `npm run build` | PASS (pre-existing chunk-size warning only) |
| Regression | additive-change verification | PASS - existing data files and components unchanged (additive only: new `pceData.ts`, new `PCEDashboard.tsx`, App.tsx 'pce' registration, Launchpad tile, feature flags appended) |

## Protocol test matrix - CP-PCE (per section 28)

| Control point | PASS | WARN (reason captured) | EXCEPTION approved/rejected | BLOCK | Emergency regularisation | Escalation |
|---|---|---|---|---|---|---|
| CP-PCE-01 (facts computed for all dimensions; refresh failure is a violation) | incremental event-driven refresh completed (REF-2025-1204-0830, 342 rows, 12s); nightly full completed (12,845 rows); facts cover 8 measure groups × 3 WBS nodes | - | - | - | - | L2 — failed nightly REF-2025-1203-0200 (budget adapter timeout) recorded as violation with retry completed |
| CP-PCE-02 (engine totals reconcile to module and GL totals) | budget: 2,970,000 = 2,970,000 MATCH; billing: 755,000 = 755,000 MATCH | - | - | BLOCK modelled at period close while GL difference exists (₹45 vs tolerance 0) | - | L2 Cost Controller |

Commitment coverage cross-reference updated after the Part 34 audit corrections (CONFLICTS.md C34-5): pcev_009 = 109.9% (PO-2025-0204 commitment 856,906.21 vs budgeted 780,000), still adverse with alert.

Regression-specific (section 28):
- Adapter unit tests: 7 source adapters (planned/budgeted/committed/actual/earned/forecast/billing + procurement) mapped to Parts 25/26/27/30/34/46 sources with documented contracts.
- Reconciliation tests: engine vs Part 25 budget (MATCH), engine vs GL project cost (DIFFERENCE ₹45, tolerance 0 → data-quality alert), engine vs Part 46 certified billing (MATCH).
- Permission masking of cost measures: viewer-role switcher — site viewer sees quantity/hours only; cost/procurement/billing masked (•••) in UI, API, exports, notifications and AI context; `pce.facts.view` + `bud.cost.view` + commercial/finance view documented.
- Performance (synthetic, non-production): pivot grid computed client-side over sample facts; backend targets documented (lists < 500 ms, dashboards < 3 s, refresh < 5 min for approved DPR/GRN).

## Acceptance verification

| Criterion | Result |
|---|---|
| Engine totals equal module totals for every measure group | budget + billing MATCH; GL difference raised as data-quality alert per tolerance-0 rule |
| Incremental refresh reflects an approved DPR/GRN within 5 minutes | REF-2025-1204-0830 triggered by `dpr.approved` (debounced), completed in 12s |
| Every section 8A control point registered, evaluated server-side on all paths, visible through the Gate-status panel | CP-PCE-01/02 in OBSERVE with gate-status panel; evaluation, exception, violation and ledger records modelled |
| Read-model only; actual = approved/posted only | Engine principles panel; PROVISIONAL optional flag `ff.pce.provisional` default OFF |
| Why? drill-down on every KPI | Control View + Variance Analysis Why? buttons → source lists (DPR/GRN/PO/MB/attendance/GL refs) |

## Data integrity

- Additive changes only: `pceData.ts` (new), `PCEDashboard.tsx` (new), App.tsx 'pce' registration (additive), Launchpad tile (additive), feature flags (appended, existing entries untouched).
- Existing data files, components, routes and screens unchanged (golden comparison).

## Dependency validation (section 30)

| Dependency | State | Result |
|---|---|---|
| Part 25 - Advanced Budgeting & Cost Control | BudgetDashboard + budgetData present | budgeted/committed source + reconciliation contract modelled |
| Part 26 - Advanced Project Planning & Scheduling | PlanningDashboard + planningData present | planned (schedule phasing) source modelled |
| Part 27 - Advanced Progress Management | ProgressDashboard + progressData present | earned (progress × budget) source modelled |
| Part 30 - DPR / Field Execution | completed (data + UI + docs) | actual source (approved/posted only) modelled |
| Part 34 - Advanced Procurement | completed in this chain (order deviation recorded) | procurement group source (PO commitments) modelled |
| Part 46 - Billing | not present | deferred; certified/billed/collected modelled with documented contract |
