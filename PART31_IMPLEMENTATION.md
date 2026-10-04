# Part 31 - Weather & Site Condition Management Implementation

## Overview

Part 31 implements the Weather & Site Condition Management module for the Construction ERP: daily recording of rainfall, temperature, humidity, wind, weather shutdowns, working hours lost and concrete restrictions per site — linked DPR → Schedule → Delay → EOT → Evidence, so weather-related delays are provable and planned around.

Feature flag: `ff.weather` (+ `ff.weather.provider`), registered default OFF in production.

## Key Components

### 1. Weather Observations (`src/data/weatherData.ts`)
- Daily weather capture (mobile or provider integration via Part 80) prefilled into DPR
- One observation per site / time slot; value ranges validated (rainfall ≥ 0, humidity 0–100)
- Conditions: clear / rain / storm / fog / heat
- Source: manual / station / provider — provider data labelled `source=provider` and never overwrites manual observations
- Sample data: 4 observations (manual, station, provider) linked to DPRs DPR-2026-0226, DPR-2026-0224, DPR-2026-0225

### 2. Weather Shutdowns
- Logging with hours lost, affected activities and evidence documents
- Lifecycle: RECORDED → APPROVED → LINKED_TO_DELAY
- Hours lost cannot exceed shift hours (business rule)
- Automatic delay event creation (Part 62) for shutdowns above threshold, linked to DPR and schedule activities
- Sample data: 3 shutdowns — WSD-2026-0007 (approved, 3 h), WSD-2025-0031 (linked_to_delay → delay_003, 30 h), WSD-2026-0008 (recorded, 3 h)

### 3. Restriction Rules
- Per project / activity type (concreting, bituminous, painting, masonry, earthwork)
- Rules warn when a WA for a restricted activity is issued under forecast/observed conditions (e.g. no pour if rain > 5 mm or temp > 40 °C)
- Enforcement warn / block; managed by QA/QC (`wx.restriction.manage`)
- Sample data: 4 restrictions from specification sources + 2 warnings (CP-WX-02) with WA links (WA-2026-0143)

### 4. Historic Weather Analysis
- Rain days by month per site feeding schedule calendars (Part 26) and monsoon planning
- Weather register extract for claims (EOT evidence) with the shutdown → DPR → Schedule → Delay → EOT chain
- Sample data: 6 monthly history rows across 2 sites

## Protocol Controls

### CP-WX-01: Daily weather recording (RECORD)
- Weather recorded daily per active site — WARN — escalation L1 → L2

### CP-WX-02: Restricted activities under breaching conditions (VERIFY)
- Restricted activities warn/block under breaching conditions — WARN / EXCEPTION (SPEC_DEVIATION) — escalation L2 QA/QC

All control points seeded in OBSERVE mode; `protocol.check()` evaluated server-side on every path (UI, API, import, job, offline sync, AI draft); deviations only through approved exceptions (PC-3) with mandatory evidence (PC-5), maker-checker (PC-6), reason codes (PC-7), ledger (PC-8) and escalation (PC-9); rollout OFF → OBSERVE → WARN → ENFORCE (PC-13).

## Dashboard Features (SAP-inspired workspace, SA-32)

### Overview Tab
- KPI cards: observations (with provider count), shutdowns, hours lost, restriction warnings
- Current weather card per site with concreting-permitted status and source label
- Protocol control points list

### Observations Tab
- Observations register: condition chips, source labels (manual/station/provider), time slot, DPR links, value grid
- Duplicate-observation prevention documented

### Shutdowns Tab
- Shutdown register with lifecycle chips, DPR/delay links, hours lost, affected activities, evidence
- Mobile quick entry preview (photos, GPS/time stamps, device ID, offline-capable Part 79)

### Restrictions Tab
- Restriction rules register (enforcement warn/block, specification sources)
- Restriction warnings with WA links and acknowledgement status

### History & Analysis Tab
- Monthly rain-days bar analysis per site feeding schedule calendars
- Weather register extract for claims (EOT evidence) table with delay links

### Protocol Controls Tab
- CP-WX-01/02 with stage/enforcement/OBSERVE status and business-rule summary

## Data Layer (`src/data/weatherData.ts` — REUSE/EXTEND/NEW)

| Entity | Decision | Notes |
|---|---|---|
| `wx_observations` | NEW | site/date/time_slot/rainfall/temp_min/max/humidity/wind/condition/source/recorded_by + DPR link |
| `wx_shutdowns` | NEW | start/end/hours_lost/reason/activities_affected/evidence_doc_ids/approved_by + delay link |
| `wx_restrictions` | NEW | project/activity_type/rule/limits/enforcement/source |
| `wx_restriction_warnings` | NEW | CP-WX-02 evaluation results with WA references |
| DPR weather fields (Part 30) | EXTEND, not duplicate | DPR shows weather card from wx data; observations carry dprNo link |
| Schedule calendars (Part 26) | REUSE | monthly history feeds calendar wet-day settings |
| Delay records (Part 26/62) | REUSE | `siteExecutionData.delays` — shutdown delayEventId links |

Live backend migrations are additive, idempotent, reversible; registered in `DB_EXTENSIONS.md` at backend delivery.

## APIs (SA-11 — versioned, idempotent; documented contract)

- `GET/POST /api/v1/wx/observations`
- `GET/POST /api/v1/wx/shutdowns`
- `GET/POST /api/v1/wx/restrictions`
- `GET /api/v1/wx/history?site=`

## Events & Notifications

- Events (SA-8): `wx.shutdown.recorded`, `wx.restriction.warning`
- Notifications: restriction warning → Site Engineer and QA/QC; shutdown recorded → PM, Planning, Contracts

## Permissions (Part 5 registry)

- `wx.observation.record` — Site Engineer
- `wx.shutdown.approve` — Site Manager/PM
- `wx.restriction.manage` — QA/QC Manager
- `wx.view` — project team
- Deny by default; explicit deny wins; enforced at UI + API + service + data access (SA-5)

## Reporting & Printing

- Reports (Part 65 catalogue): weather register; hours lost; weather delays for EOT
- Print: weather register extract for claims with letterhead, QR verification, signature blocks; printing audited

## Real-Time, Offline, Security

- Socket events re-check permission before emit; clients re-sync missed events on reconnect
- Offline through the field engine (Part 79): encrypted local queue → sync → conflict resolution → server confirmation; conflict rule: server version wins after approval/lock, otherwise field-level merge with user prompt; every conflict logged
- Four-layer authorisation, scope isolation, IDs re-authorised on every request (no IDOR); registered routes/jobs/sockets (Part 9); secrets in the secret store

## Verification

- `npm run typecheck` — green; `npm run build` — green
- Evidence in `docs/erp-program/test-evidence/part-31/`
