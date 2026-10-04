# Test Evidence — Part 31: Weather & Site Condition Management

Date: 2026-10-04 · Workspace: frontend baseline app (see CONFLICTS.md C31-1)

## Gates run

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | PASS |
| Build | `npm run build` | PASS (pre-existing chunk-size warning only) |
| Regression | additive-change verification | PASS — existing data files and components unchanged (additive only) |

## Protocol test matrix — CP-WX (per section 28)

| Control point | PASS | WARN (reason captured) | EXCEPTION approved/rejected | BLOCK | Emergency regularisation | Escalation |
|---|---|---|---|---|---|---|
| CP-WX-01 (daily weather per active site) | wxobs_001/004 morning observations per active site | observationsToday counter + WARN modelled | — | — | via DPR "no work" reason | L1 → L2 |
| CP-WX-02 (restricted activities under breaching conditions) | wxobs_001: concreting permitted (0 mm rain) | wxrw_001: WARN with breach detail + acknowledgement | SPEC_DEVIATION path modelled | wxrw_002: BLOCK — WA issuance prevented | via exception approval | L2 QA/QC |

Regression-specific: restriction rule evaluation (4 rules incl. inactive), duplicate observation prevention (one per site/time slot), provider data never overwrites manual observations (source labels preserved).

OBSERVE mode: controls displayed with `observe` status; no existing flow blocked. ENFORCE mode: enforcement column documents WARN/EXCEPTION/BLOCK behaviour.

## Acceptance verification

| Criterion | Result |
|---|---|
| Shutdown creates a linked delay event with evidence | WSD-2025-0031 → delay_003 with evidenceDocIds; WSD-2026-0007 approved with evidence |
| Restricted-activity WA shows warning | WA-2026-0143 warnings in Restrictions tab (CP-WX-02) |
| Hours lost ≤ shift hours | sample data consistent; validation documented |

## Data integrity

- Additive changes only: `weatherData.ts` (new), `WeatherDashboard.tsx` (new), App.tsx 'wx' registration (additive), Launchpad tile (additive), mockData.ts flags (additive).
- Existing data files, components, routes and screens unchanged (golden comparison).
