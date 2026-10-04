# Test Evidence — Part 32: GIS, Survey & Site Location Intelligence

Date: 2026-10-04 · Workspace: frontend baseline app (see CONFLICTS.md C32-1)

## Gates run

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | PASS |
| Build | `npm run build` | PASS (pre-existing chunk-size warning only) |
| Regression | additive-change verification | PASS — existing data files and components unchanged (additive only) |

## Protocol test matrix — CP-GIS (per section 28)

| Control point | PASS | WARN (reason captured) | EXCEPTION approved/rejected | BLOCK | Emergency regularisation | Escalation |
|---|---|---|---|---|---|---|
| CP-GIS-01 (chainage on DPR/MB/NCR for linear works) | dpr_003, mb_001 located at CH 0+400 on approved alignment | — | DOCUMENT_WAIVER path modelled | — | via exception approval | L2 |
| CP-GIS-02 (layer versions approved before use) | boundary v2 approved (v1 superseded), alignment approved, zones approved | structures layer DRAFT shown dashed + flagged | — | BLOCK modelled (draft layer not approved for use) | — | L2 |

Regression-specific: chainage calculation tests (6 refs along approved alignment), GeoJSON validation (parse guards in map components), permission on layers (`gis.layer.manage` vs `gis.map.view` documented).

## Acceptance verification

| Criterion | Result |
|---|---|
| DPR, NCR and inspection records appear at correct chainage/coordinates | gisLocationLinks: DPR/NCR/inspection markers plotted at WGS84 coordinates and CH 0+400 |
| Heatmap matches progress data | zone/chainage cells derived from Parts 27/30 planned vs actual |
| Click-through to records | Map Workspace marker → linked record panel (entity, position, layer, time) |

## Data integrity

- Additive changes only: `gisData.ts` (new), `GISDashboard.tsx` (new), App.tsx 'gis' registration (additive), Launchpad tile (additive), mockData.ts flags (additive).
- Existing data files, components, routes and screens unchanged (golden comparison).

## Dependency validation (section 30)

| Dependency | State | Result |
|---|---|---|
| Part 4 — Organization, Company, Project & Site Master | foundation data present (project/site masters in data files) | interfaces respond with documented contract; adapter not required |
| Part 20 — WBS, BOQ & Work Package Management | BOQ Management component + data present | boq_item references valid |
| Part 30 — DPR / Field Execution | completed this chain (data + UI + docs) | dpr ids referenced by location links valid |
