# CONFLICTS.md

Register of conflicts, deviations and deferred items found during Parts 30–34 execution.
Rule: if a requirement can only be met by violating the preservation rule, it is stopped and recorded here.

## Part 30 — DPR / Field Execution

| # | Conflict / deviation | Resolution |
|---|---|---|
| C30-1 | Prerequisite reading files (`00_READ_FIRST/01_SHARED_ARCHITECTURE.md`, `02_PROTOCOL_CONTROL_FRAMEWORK.md`, `03_NON_NEGOTIABLE_RULES.md`, `13_SECURE_DEVELOPMENT_STANDARD.md`, `docs/erp-program/EXISTING_SYSTEM_MAP.md`, `DB_ENTITY_MAP.csv`) do not exist in this repository | Proceeded with code-level discovery (SA-2) over the existing repository instead; no preservation rule was violated. Recorded here for program-office awareness. |
| C30-2 | Workspace is a frontend baseline app (React + Vite, TypeScript). There is no live database, backend server, or `erp:regression` script in this workspace | DB/API/job/protocol requirements are represented as the typed data layer (`src/data/dprData.ts`), UI workspace, feature flags and implementation docs — consistent with how Parts 3–29 were delivered. Regression gate verified via `npm run typecheck` + `npm run build` (both green). |
| C30-3 | Part 30 was left at the data-layer stage by the prior session (`src/data/dprData.ts` existed; no dashboard, no App registration, no implementation doc) | Completed here as a prerequisite of Parts 31/32: `DPRDashboard.tsx`, App/Launchpad/flag registration, implementation doc, discovery and evidence docs. |
| C30-4 | Latent defect in the Part 30 data layer: activity line id `dal_004` was duplicated across `dpr_002` and `dpr_003` | Fixed by renaming the `dpr_002` line to `dal_005`. This is a new-module data-layer defect fix (created by the interrupted session), not a legacy record alteration. |

## Part 31 — Weather & Site Condition Management

| # | Conflict / deviation | Resolution |
|---|---|---|
| C31-1 | Same missing prerequisite documents as C30-1 | Same resolution — code-level discovery; no preservation rule violated. |
| C31-2 | External weather provider integration (Part 80) does not exist in this workspace | Data model carries `source: manual/station/provider`; provider observations are labelled and never overwrite manual observations. Actual provider feed is deferred to Part 80 and recorded in the handoff note. |

## Part 32 — GIS, Survey & Site Location Intelligence

| # | Conflict / deviation | Resolution |
|---|---|---|
| C32-1 | Same missing prerequisite documents as C30-1 | Same resolution — code-level discovery; no preservation rule violated. |
| C32-2 | No map provider library (leaflet/mapbox/google-maps) exists in the frontend stack; Part 80 map provider not delivered | Map workspace delivered as an original SVG schematic visualization (no vendor logos/code); coordinates stored and displayed in WGS84 per the business rule. Real map tiles are deferred to Part 80/103. |
| C32-3 | Pre-existing inconsistency: `ff.wa`/`ff.site` badges display "Active" in dashboards but are not present in the `featureFlags` registry in `mockData.ts` | Not altered (pre-existing behaviour preserved). `ff.dpr`, `ff.dpr.voice`, `ff.weather`, `ff.weather.provider`, `ff.gis` were added to the registry default OFF without touching existing entries. |

## Part 34 — Advanced Procurement

| # | Conflict / deviation | Resolution |
|---|---|---|
| C34-1 | Same missing prerequisite documents as C30-1 (`00_READ_FIRST/*`, `EXISTING_SYSTEM_MAP.md`, `DB_ENTITY_MAP.csv`) | Same resolution — code-level discovery; no preservation rule violated. |
| C34-2 | Part 33 (Planned vs Budgeted vs Actual Engine) was explored but not implemented by the prior session — no code, docs or flags exist for it. Part 33 is not a dependency of Part 34 (depends on Parts 6, 11, 20, 25, 26) | Part 34 implemented as directed; Part 33 completion recorded in the handoff note as pending. The PCE fact store (`pce_facts`) will consume procurement commitments (CP-PCE-01) when Part 33 is delivered. |
| C34-3 | Part 35 (Stores/GRN) does not exist in this workspace; procurement acceptance criterion "PR → PO → GRN" cannot be fully demonstrated | Dispatch/ASN recording delivered with arrived status; GRN deferred to Part 35 and recorded in the handoff note. |
| C34-4 | Parts 88 (GST tax engine) and 91 (rate observations) not yet live | Data model and UI carry the documented contract: GST by tax resolver (Part 11) with parallel comparison before switching to Part 88; PO-rate benchmark uses budget/last-purchase rates until Part 91 becomes the single source. |

## Deferred items

| Item | Deferred to |
|---|---|
| Live backend migrations for `dpr_*`, `wx_*`, `gis_*`, `proc_*` tables (additive, reversible per section 31) | Backend delivery parts / final integration (Parts 120–130) |
| Actual APIs, Socket.IO events, notification gateway templates, job framework wiring | Backend delivery parts |
| Weather provider feed (Part 80), real map tiles | Parts 80, 103 |
| Voice-to-DPR speech-to-text engine (frontend label + review flow delivered) | AI delivery parts (Parts 73–74) |
