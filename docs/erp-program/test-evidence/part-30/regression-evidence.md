# Test Evidence — Part 30: DPR / Field Execution

Date: 2026-10-04 · Workspace: frontend baseline app (see CONFLICTS.md C30-2)

## Gates run

| Gate | Command | Result |
|---|---|---|
| Baseline typecheck | `npm run typecheck` | PASS (before implementation — green baseline) |
| Typecheck after implementation | `npm run typecheck` | PASS |
| Build | `npm run build` | PASS (2406 modules transformed; pre-existing chunk-size warning only) |
| Regression | `npm run build` + golden data check | PASS — existing data files and components unchanged (additive only) |

Note: `erp:regression` script does not exist in this workspace; regression gate executed as typecheck + production build + additive-change verification per CONFLICTS.md C30-2.

## Protocol test matrix — CP-DPR (per section 28)

| Control point | PASS | WARN (reason captured) | EXCEPTION approved/rejected | BLOCK | Emergency regularisation | Escalation |
|---|---|---|---|---|---|---|
| CP-DPR-01 (cut-off submission) | dpr_001/dpr_002 same-day submission | dpr_001 late flag computed by cut-off logic | Missing-DPR exception path modelled | — | regularisation via addendum | L1 → L2 → L3 (3 misses) modelled in Missing DPR dashboard |
| CP-DPR-02 (WA quantity tolerance) | dpr_001 lines within WA-2026-0142 | 5 Cum shortfall remarks captured | QTY_OVER_PLAN warning shown on >10% deviation in Review tab | — | via exception approval | L2 |
| CP-DPR-03 (consumption ≤ issued; labour ≤ attendance) | issueRef balances shown (issue_001: 70 issued / 65 consumed) | consumption without issueRef flagged as "allocation only" | excess consumption requires exception | — | via exception approval | L2 |
| CP-DPR-04 (photos with GPS/time) | dpr_001 photos with geotag + time | dpr_003 returned for missing photos | DOCUMENT_WAIVER path modelled | — | via exception approval | L2 |
| CP-DPR-05 (reviewer ≠ author) | dpr_001 approved_by ≠ prepared_by | — | — | BLOCK modelled in review actions | — | — |
| CP-DPR-06 (approved locked) | dpr_001 locked=true with addendum notice | — | — | BLOCK modelled (addendum only with reason) | — | L2 |

OBSERVE mode: controls displayed with `observe` status; no existing flow blocked. ENFORCE mode: enforcement column documents WARN/EXCEPTION/BLOCK behaviour.

## Screens verified

| Screen | Breakpoints | Result |
|---|---|---|
| DPR Dashboard (Overview / Register / Capture / Review / Missing & Calendar / Protocol) | 360×800, 820×1180, 1440×900 | Grid layouts collapse to single column at 360 px; no horizontal scroll; 44 px touch targets on mobile stepper buttons |

## Data integrity

- Additive changes only: `DPRDashboard.tsx` (new), App.tsx registrations (additive), Launchpad tiles (additive), mockData.ts flags (additive).
- Defect fix in new module data layer: duplicate id `dal_004` in `dpr_002`/`dpr_003` → `dpr_002` line renamed `dal_005` (CONFLICTS.md C30-4).
- Existing data files, components, routes and screens unchanged (golden comparison).
