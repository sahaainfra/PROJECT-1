# Part 33 - Planned vs Budgeted vs Actual Engine (Project Control Engine) Implementation

## Overview

Part 33 implements the common project-control engine (PCE) for the Construction ERP: for every project/WBS/activity/resource and period it computes Planned → Budgeted → Committed → Actual → Earned → Forecast for quantity, cost, labour hours, material, plant hours, time, procurement and billing — the only data source for control dashboards, Project 360, control towers and analytics. The engine is read-model only; it never writes to source modules.

Feature flag: `ff.pce` (sub-flag `ff.pce.provisional`), registered default OFF in production.

## Key Components

### 1. Fact store (`src/data/pceData.ts`)
- `pce_facts` (project_id, site_id, wbs_node_id, activity_id, boq_item_id, cost_code_id, resource_type, resource_id, period, measure_group quantity/cost/labour_hours/plant_hours/material_qty/time/procurement/billing, planned, budgeted, committed, actual, earned, forecast, uom_id, currency, refreshed_at, source_version) — table or materialised views per DB capability at backend delivery
- Sample: 13 facts across 8 measure groups, 3 WBS nodes, period 2025-11 (Riverside Tower — Phase II, by project calendar)
- Source adapters: planned (Part 26 schedule phasing), budgeted (Part 25 approved budget), committed (Part 25 commitments), actual (postings/DPR/attendance/plant logs), earned (progress × budget, Part 27), forecast (Parts 25/71), billing (Part 46 certified/billed/collected), procurement (Part 34 PO commitments)
- Drill links on every fact: KPI → document → transaction → source evidence

### 2. Refresh orchestrator
- `pce_refresh_log` (run_id, scope, type incremental/full/on_demand, started, finished, rows, status, error)
- Incremental refresh on events (debounced per project — e.g. `dpr.approved` reflects within 5 minutes), nightly full rebuild (02:00 UTC), on-demand rebuild per project
- Sample: 4 runs — incremental event-driven (342 rows, 12s), nightly full (12,845 rows), on-demand, and one failed nightly with adapter timeout recorded as CP-PCE-01 violation

### 3. Query API (documented contract, SA-11)
- `GET /api/v1/pce/facts?project=&dims=&measures=&period=` — dimensions (project, site, WBS level, activity, BOQ item, cost code, resource type, period) and measures; returns SA-18 labels and drill links
- `GET /api/v1/pce/variance?project=&type=`
- `POST /api/v1/pce/refresh` (`pce.refresh.run` — Planning/Finance leads, Super Admin)
- `GET /api/v1/pce/reconciliation?project=`

### 4. Variance calculators (6 per section 5.4)
- Quantity variance, cost variance (earned − actual), schedule variance (earned − planned), productivity variance, commitment coverage (committed/budget), billing lag (earned − certified)
- Sample: 10 variance rows with status/threshold/alerts; commitment coverage 109.9% adverse with alert (PO-2025-0204 commitment vs budget, after the Part 34 audit corrections in CONFLICTS.md C34-5)
- Variance chart (recharts, favourable/adverse colouring) + Why? drill to source transactions

### 5. Reconciliation (CP-PCE-02)
- Engine totals vs module totals: budget (Part 25), GL project cost, billing (Part 46) with differences reported
- Tolerance 0 for cost totals vs GL (after finance live); the sample GL difference of ₹45 raises a data-quality alert; BLOCK at period close

### 6. Measure dictionary
- `pce_measure_definitions` (measure_group, column, definition, source, formula, data_label) — published in KPI_CATALOGUE.md with formulas; 11 definitions with SA-18 data labels

## Permission-aware measure masking (section 6)
- `pce.facts.view` — scoped by project; cost measures require `bud.cost.view`; billing measures require commercial/finance view permissions (field-level masking per measure group)
- `pce.refresh.run` — Planning/Finance leads; Super Admin
- Viewer-role switcher on the dashboard demonstrates masking: site viewers see quantity/hours only; cost/procurement/billing masked (•••) in UI, API, exports, search, notifications and AI context (SA-5)

## Protocol Controls

CP-PCE-01 (MONITOR — refresh failure is a violation, L2) and CP-PCE-02 (RECONCILE — BLOCK at period close, L2 Cost Controller) registered with the Protocol & Control Engine (Part 7) in OBSERVE mode; `protocol.check()` evaluated server-side on every path (UI, API, import, job, offline sync, AI draft); deviations only through approved exceptions (PC-3) with reason codes (PC-7), ledger (PC-8) and escalation (PC-9); rollout OFF → OBSERVE → WARN → ENFORCE (PC-13).

## Data Layer (`src/data/pceData.ts` — REUSE/EXTEND/NEW)

| Entity | Decision | Notes |
|---|---|---|
| `pce_facts` | NEW | fact table (or materialised views per DB capability) for PC-14 dimensions |
| `pce_refresh_log` | NEW | incremental/full/on_demand runs, status, error |
| `pce_measure_definitions` | NEW | measure dictionary with formulas, SA-18 labels |
| Existing cost/progress summary queries (Parts 25–27, 30) | REUSE | wrapped as source adapters; retired only after parity |
| Budget/commitments (Part 25) | REUSE | budgeted + committed + reconciliation source |
| Schedule phasing (Part 26) | REUSE | planned source |
| Progress × budget (Part 27) | REUSE | earned source |
| DPR/attendance/plant logs (Part 30) | REUSE | actual source |
| PO commitments (Part 34) | REUSE | procurement group source |
| Billing (Part 46) | REUSE/deferred | certified/billed/collected modelled; Part 46 not yet live |

Live backend migrations are additive, idempotent, reversible; registered in `DB_EXTENSIONS.md` at backend delivery.

## Events & Notifications (SA-8/SA-9)

- Consumes module events (budget approved, DPR/GRN approved, progress posted); emits `pce.project.refreshed` for dashboards
- Notifications: reconciliation difference or refresh failure → Planning/Finance leads, Super Admin (Critical; cannot be muted)

## Business rules

- Engine is read-model only; it never writes to source modules
- Actual = only approved/posted data; draft data excluded (PROVISIONAL view optional flag `ff.pce.provisional`)
- Periods by project calendar; FY for financial aggregation

## Reporting & Printing

- Reports (Part 65 catalogue): planned vs budgeted vs actual report (by WBS/cost code/resource); variance analysis; reconciliation report — drill-down Company → Project → WBS → Activity → BOQ → Transaction; exports audited
- Print: control report PDF per project/period — QR verification, signature blocks, printing audited

## Real-Time, Offline, Security, Performance

- Socket events re-check permission before emit; clients re-sync missed events on reconnect; `pce.project.refreshed` delivery < 2s
- Online-only: screens show connectivity state; submissions disabled while offline with clear message
- Four-layer authorisation, scope isolation, IDs re-authorised on every request (no IDOR); registered routes/jobs/sockets (Part 9); no sensitive data in logs or event payloads
- Server-side pagination, caching with event invalidation, background jobs for heavy rebuilds; additive indexes justified by query plans (Part 86)

## Verification

- `npm run typecheck` — green; `npm run build` — green
- Evidence in `docs/erp-program/test-evidence/part-33/`
