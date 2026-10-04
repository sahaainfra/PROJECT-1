# Discovery — Part 30: DPR / Field Execution (SA-2)

## Search performed
Keywords (code + DB catalogue): dpr, daily progress report, daily report, site diary, weather, manpower, labour count, work done.

## Findings
- `src/data/dprData.ts` — Part 30 data layer existed (created by an interrupted prior session) with DPR report/line interfaces, sample data, protocol control points and stats. No UI, no App registration, no implementation doc existed.
- `src/components/WorkAuthorisationDashboard.tsx` (Part 29) and `src/components/SiteExecutionDashboard.tsx` (Part 28) — established dashboard pattern (header with ff badge, tabs, StatCard, protocol controls section) reused.
- `src/data/siteExecutionData.ts` — daily plans (prefill source), work fronts, constraints, delays, site instructions, site photos (GPS pattern).
- `src/data/workAuthorisationData.ts` — WAs with resource lines/balances (WA reference source for CP-DPR-02).
- `src/components/Launchpad.tsx` — part tile pattern (Part 28/29 tiles).
- `src/data/mockData.ts` — feature flag registry (ff.pgm, ff.core.*) — `ff.dpr` flags added additively.
- `src/App.tsx` — View type / navItems / renderView switch — 'dpr' registered additively.
- No DPR tables/forms/legacy DPR system found beyond the data file — repository is the frontend baseline workspace (see CONFLICTS.md C30-2).

## REUSE / EXTEND / NEW

| Item | Kind | Decision | Notes |
|---|---|---|---|
| `dpr_reports` | Entity | NEW | per section 11; follows SA-4 conventions |
| `dpr_activity_lines` | Entity | NEW | WA ref, chainage, qty, photos |
| `dpr_labour_lines` | Entity | NEW | own (attendance) / subcontract |
| `dpr_material_lines` | Entity | NEW | issue refs from stores |
| `dpr_equipment_lines` | Entity | NEW | plant log refs |
| `dpr_events` | Entity | NEW | typed events with linked entity |
| Daily plan (Part 28) | Entity/API | REUSE | prefill source (`dailyPlans`) |
| Work authorisation (Part 29) | Entity/API | REUSE | WA refs + balances |
| Attendance (Part 40), Stores issues (Part 35), Plant logs (Part 37) | Entities | REUSE | linked, not duplicated |
| Dashboard pattern (Parts 28/29) | Screen | REUSE | header/tabs/StatCard/protocol sections |
| Launchpad tile pattern | Screen | REUSE | Part 30 tile added after Part 29 |
| Feature flag registry | Config | EXTEND | `ff.dpr`, `ff.dpr.voice` added default OFF |
| DPR capture stepper | Screen | NEW | mobile-first, 10 sections, offline/GPS/voice |
| Missing DPR job | Job | NEW | missing DPRs per site/date/shift, escalation ladder |
| Prefill service | Calculation | NEW | plan lines → DPR draft |
| QTY_OVER_PLAN tolerance check | Calculation | NEW | CP-DPR-02 |
| Consumption vs issued reconciliation | Calculation | NEW | CP-DPR-03, feeds Parts 35/90 |
| Late-DPR cut-off flag | Calculation | NEW | CP-DPR-01 (11:00 next day) |

## Conflicts
See `CONFLICTS.md` (C30-1..C30-4). No existing behaviour was changed.
