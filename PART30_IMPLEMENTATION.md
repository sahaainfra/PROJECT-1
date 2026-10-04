# Part 30 - DPR / Field Execution Implementation

## Overview

Part 30 implements the Daily Progress Report (DPR) module for the Construction ERP: a mobile-first capture of activities and quantities, labour, materials, equipment, weather, site conditions, photos, quality and HSE observations, delays, constraints and remarks — prefilled from the daily plan (Part 28) and Work Authorisations (Part 29), becoming the single daily source for progress, consumption evidence and contemporaneous records.

Feature flag: `ff.dpr` (+ `ff.dpr.voice`), registered default OFF in production.

## Key Components

### 1. DPR Report Management (`src/data/dprData.ts`)
- **One DPR per site per date per shift** with uniqueness on site+date+shift
- **Lifecycle**: DRAFT → SUBMITTED → APPROVED (locked) | RETURNED; late DPR (after 11:00 next-day cut-off) flagged
- **Sections**: weather/site conditions → work done → labour → materials → equipment → quality & HSE → delays/constraints → visitors/instructions → photos → remarks
- **Sample data**: 3 DPRs (1 approved+locked, 1 submitted, 1 returned) across Riverside Tower Block A

### 2. Line Linking (link, don't duplicate)
- **Activity lines**: qty per activity/location/chainage, planned vs actual vs cumulative, WA reference, photos
- **Labour lines**: own labour from attendance (attendanceRef), subcontract headcount captured in DPR
- **Material lines**: consumption from stores issues (issueRef, issueQty, balanceQty); DPR captures only what is missing
- **Equipment lines**: from plant logs (logRef); working/idle/breakdown hours and operator
- **Events**: visitor / instruction / quality / HSE / delay / constraint / incident / other with linked_entity_type/id

### 3. Mobile Capture (stepper)
- 10-section mobile stepper with prefill sources displayed per section
- Offline capture with photo queue (Part 79), GPS stamp on submit
- Voice-to-DPR: speech-to-text creates a labelled AI DRAFT, reviewed and edited before submission — never auto-submitted
- Quick-copy yesterday's labour; photos compressed, max 30 per DPR, geotagged if permitted

### 4. Review & Approval
- Site Manager/PM review: approve (locks), return with comments (reason preserved)
- Plan comparison (planned vs actual vs WA), QTY_OVER_PLAN tolerance warnings
- Gate-status panel showing CP-DPR evaluation
- On approval emits: progress entries (Part 27), consumption vs issue reconciliation (Parts 35/90), delays/constraints records, claims evidence (Part 62)

### 5. Missing DPR Dashboard
- Missing DPRs per site/date/shift with days overdue and assignee
- DPR calendar per site with status colours (approved/submitted/returned/missing)
- Late submissions (after cut-off) flagged
- Escalation L1 → L2 → L3 after 3 misses (CP-DPR-01)

## Protocol Controls

### CP-DPR-01: Cut-off submission (RECORD)
- One DPR per site/date/shift submitted by cut-off — WARN → MONITOR — escalation L1 → L2 → L3 (3 misses)

### CP-DPR-02: WA quantity tolerance (VERIFY)
- DPR activity quantities reference active WA and stay within authorised + tolerance — EXCEPTION (QTY_OVER_PLAN)

### CP-DPR-03: Consumption & labour limits (VERIFY)
- Material consumed ≤ issued to WA − previous consumption; labour ≤ attendance — EXCEPTION / WARN

### CP-DPR-04: Photo evidence (RECORD)
- Photos per activity with GPS/time (where permitted) — EXCEPTION (DOCUMENT_WAIVER)

### CP-DPR-05: Segregation of duties (APPROVE)
- Reviewer ≠ author — BLOCK

### CP-DPR-06: Approved DPR locked (CLOSE)
- Approved DPR locked; addendum only with reason — BLOCK

All control points seeded in OBSERVE mode; `protocol.check()` evaluated server-side on every path (UI, API, import, job, offline sync, AI draft); deviations only through approved exceptions (PC-3) with reason codes (PC-7), ledger (PC-8) and escalation (PC-9); rollout OFF → OBSERVE → WARN → ENFORCE (PC-13).

## Dashboard Features (SAP-inspired workspace, SA-32)

### Overview Tab
- KPI cards: total DPRs, pending approval, missing DPRs, photo evidence
- Lifecycle status summary including late count
- Linked records summary (labour/materials/equipment/events)
- Protocol control points list

### DPR Register Tab
- Filterable register with status chips, late flags, line counts, submission/approval timestamps
- Legacy DPRs remain viewable unchanged (old DPRs preserved)

### Capture Tab (mobile stepper preview)
- 10-step mobile stepper with prefill sources, offline badge, GPS stamp submit
- Voice-to-DPR (AI-assisted, labelled), open-RFI warnings, client-side validation mirrors

### Review & Approve Tab
- Full DPR object page: header, gate-status panel, weather, work done with plan comparison, labour, materials, equipment, events, photos, remarks
- Approve & lock / return with comments actions

### Missing & Calendar Tab
- Missing DPR dashboard with days overdue
- DPR calendar per site with status colours and legend

### Protocol Controls Tab
- CP-DPR-01..06 with stage/enforcement/OBSERVE status and gate-status panel

## Data Layer (`src/data/dprData.ts` — REUSE/EXTEND/NEW)

| Entity | Decision | Notes |
|---|---|---|
| `dpr_reports` | NEW | project/site/date/shift/dpr_no/weather/status/submitted/approved/locked + GPS + voice notes |
| `dpr_activity_lines` | NEW | WA reference, chainage, planned/actual/cumulative qty, photos |
| `dpr_labour_lines` | NEW | own (attendance ref) / subcontractor, planned vs actual, hours, OT |
| `dpr_material_lines` | NEW | consumed qty, issue ref, issue qty, balance |
| `dpr_equipment_lines` | NEW | plant ref, hours (work/idle/breakdown), operator |
| `dpr_events` | NEW | typed events with linked entity |
| Daily plan (Part 28) | REUSE | `siteExecutionData.dailyPlans` — prefill source |
| Work authorisation (Part 29) | REUSE | `workAuthorisationData.workAuthorisations` — WA references |
| Attendance (Part 40), Stores issues (Part 35), Plant logs (Part 37) | REUSE | linked, not duplicated |

Live backend migrations are additive, idempotent, reversible; registered in `DB_EXTENSIONS.md` at backend delivery.

## APIs (SA-11 — versioned, idempotent; documented contract)

- `GET/POST /api/v1/dpr/reports`
- `GET/PATCH /api/v1/dpr/reports/{id}` (optimistic locking `version`)
- `POST /api/v1/dpr/reports/{id}/submit|approve|return|addendum` (Idempotency-Key)
- `GET /api/v1/dpr/reports/prefill?site=&date=&shift=`
- `GET /api/v1/dpr/missing?project=&from=&to=`

## Events & Notifications

- Events (transactional outbox → Socket.IO rooms, SA-8): `site.dpr.submitted`, `site.dpr.approved`, `site.dpr.returned`, `site.dpr.missing`
- Notifications: submitted → reviewer; returned → author; missing by cut-off → site engineer + site manager; approved → planning

## Permissions (Part 5 registry, `<module>.<feature>.<action>`)

- `dpr.report.create/edit` — Site Engineer (own sites)
- `dpr.report.approve` — Site Manager/PM (authority limits)
- `dpr.report.view` — project team, Management
- `dpr.export.client_format` — Planning/PM
- Evaluated at company/branch/department/project/site/module/transaction/field/approval-limit/document level; deny by default; explicit deny wins; enforced at UI + API + service + data access (SA-5)

## Reporting & Printing

- Reports (Part 65 catalogue): DPR (daily), weekly summary, labour/plant/material daily summaries, missing DPR report, cumulative quantities by activity
- Print: DPR in company and client formats (configurable template) with photos annex, QR verification, signature blocks; printing audited

## Real-Time, Offline, Security

- Socket events re-check permission before emit; clients re-sync missed events on reconnect
- Offline through the field engine (Part 79): encrypted local queue → sync → conflict resolution → server confirmation; server re-validates permissions, protocol checks and balances at sync; nothing counts as posted until confirmed; server version wins after approval/lock, otherwise field-level merge with user prompt; every conflict logged
- Four-layer authorisation, scope isolation per company/project/site, IDs re-authorised on every request (no IDOR); registered routes/jobs/sockets with permission, scope rule, schema, rate-limit group (Part 9); secrets in the secret store; no sensitive data in logs

## Validation & Error Handling

- Server-side validation authoritative; client mirrors it. Mandatory: weather, at least one work line or "no work" reason, labour totals, ≥ 1 photo when work done (configurable)
- SA-17 error states on every screen/endpoint (loading, empty, validation, permission, API, network/offline, sync conflict, job failure) with correlation ID

## Performance

- API p95: lists < 500 ms (filtered, 100k rows), record page < 1 s, dashboards < 3 s, `protocol.check` < 50 ms, socket delivery < 2 s; server-side pagination, lazy loading, caching with event invalidation

## Verification

- `npm run typecheck` — green; `npm run build` — green
- Evidence in `docs/erp-program/test-evidence/part-30/`
