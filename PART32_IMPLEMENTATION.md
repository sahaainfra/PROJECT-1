# Part 32 - GIS, Survey & Site Location Intelligence Implementation

## Overview

Part 32 implements the GIS, Survey & Site Location Intelligence module for the Construction ERP: giving every project a map — site boundaries, coordinates, chainages, structures, assets, equipment, work fronts, material locations, and the locations of DPR entries, inspections and NCRs — with a progress heatmap and BOQ-to-location mapping, so location becomes a shared dimension of control. The map is a visual and navigation layer over existing records, never a replacement for them.

Feature flag: `ff.gis`, registered default OFF in production.

## Key Components

### 1. GIS Layers & Versioning (`src/data/gisData.ts`)
- Layer types: boundary / alignment / structure / zone / work_front / asset / store
- Geometry stored as valid GeoJSON (WGS84); source: survey / CAD / KML / manual
- Layer version lifecycle: DRAFT → APPROVED → SUPERSEDED (CP-GIS-02: approved before use)
- Import GeoJSON/KML (CAD export) with versioning
- Sample data: 7 layers (boundary approved v2 with v1 superseded, alignment approved, zones approved, structures draft, work fronts approved, stores approved)

### 2. Linear Referencing
- `gis_chainage_refs`: chainage computed along the approved alignment version (business rule)
- Highway Bridge centre-line with CH 0+000 → CH 1+000 ticks, lat/lng per tick (roads/railways/pipelines)

### 3. Location Linking
- `gis_location_links`: entity_type (dpr / mb / inspection / ncr / incident / photo / equipment / store / asset) + entity_id, lat/lng or chainage range
- Sample data: 10 links — 3 DPR entries, 1 MB, 1 NCR, 1 inspection, 1 incident, 1 photo, 1 live equipment position (telematics, Part 37), 1 store

### 4. BOQ / Location Mapping
- `gis_boq_locations`: quantities per zone/chainage; measured vs planned by location
- Drill-down Company → Project → WBS → Activity → BOQ → Transaction
- Sample data: 5 mappings (3 zone-based, 2 chainage-based)

### 5. Progress Heatmap
- By chainage/zone (planned vs actual from Parts 27/30) with NCR and incident heat layers
- Sample data: 5 heat cells (3 zones, 2 chainage segments)

## Protocol Controls

### CP-GIS-01: Chainage required on linear records (RECORD)
- Linear works require chainage on DPR/MB/NCR entries — EXCEPTION (DOCUMENT_WAIVER) — escalation L2

### CP-GIS-02: Layer versions approved before use (APPROVE)
- Alignment/boundary layer versions approved before use — BLOCK — escalation L2

All control points seeded in OBSERVE mode; `protocol.check()` evaluated server-side on every path (UI, API, import, job, offline sync, AI draft); deviations only through approved exceptions (PC-3) with reason codes (PC-7), ledger (PC-8) and escalation (PC-9); rollout OFF → OBSERVE → WARN → ENFORCE (PC-13).

## Dashboard Features (SAP-inspired workspace, SA-32)

### Overview Tab
- KPI cards: layers, location links, chainage references, BOQ/location mappings
- Location dimension of control (records located, live equipment, WGS84 standard, import formats)
- Protocol control points list

### Map Workspace Tab
- Original SVG schematic map workspace (no vendor map library): boundary polygon, zones, structures (draft shown dashed), work fronts, stores, DPR/NCR/inspection markers, live equipment
- Map context switcher (zones site vs alignment site), layer control checkboxes, status filter
- Click-through to records: marker → linked record details (entity, position, layer, recorded time)
- Legend; no horizontal scroll at 360 px

### Progress Heatmap Tab
- Zone/chainage table with colour-coded variance cells, NCR and incident density
- Aggregation API documented (`GET /api/v1/gis/heatmap?project=&metric=`)

### BOQ by Location Tab
- BOQ item per zone/chainage with measured vs planned progress bars

### Layers & Versioning Tab
- Layer register with version status chips, source labels, approval/supersession trail
- Import GeoJSON/KML action; chainage references grid

### Protocol Controls Tab
- CP-GIS-01/02 with stage/enforcement/OBSERVE status and gate-status panel

## Data Layer (`src/data/gisData.ts` — REUSE/EXTEND/NEW)

| Entity | Decision | Notes |
|---|---|---|
| `gis_layers` | NEW | project/code/name/type/geometry_geojson/version/status/source |
| `gis_chainage_refs` | NEW | project/alignment_layer_id/chainage/lat/lng |
| `gis_location_links` | NEW | entity_type/entity_id/layer_id/chainage range/lat/lng |
| `gis_boq_locations` | NEW | boq_item_id/layer_id or chainage range/planned vs measured |
| Site coordinates & geofences (Part 4) | REUSE | boundary WGS84 consistent with site master |
| BOQ/WBS (Part 20) | REUSE | boq_item_id references |
| GPS on DPR/photos (Part 30) | REUSE | `dprData` lat/lng, photo geotags |
| Survey checks (Part 98), map provider (Part 80) | REUSE/deferred | control points overlay; real tiles deferred to Part 80/103 |

Live backend migrations are additive, idempotent, reversible; registered in `DB_EXTENSIONS.md` at backend delivery.

## APIs (SA-11 — versioned, idempotent; documented contract)

- `GET/POST /api/v1/gis/layers`
- `POST /api/v1/gis/layers/import` (valid GeoJSON; layer belongs to project)
- `GET /api/v1/gis/heatmap?project=&metric=`
- `POST /api/v1/gis/links`

## Events & Notifications

- Events (SA-8): `gis.layer.approved`; live equipment positions where telematics exists
- Notifications: layer approved → project team

## Permissions (Part 5 registry)

- `gis.layer.manage` — Planning Engineer, Survey lead
- `gis.map.view` — project team
- Geofence edits remain Super Admin only (Part 4)
- Deny by default; explicit deny wins; enforced at UI + API + service + data access (SA-5)

## Reporting & Printing

- Reports (Part 65 catalogue): progress by chainage/zone; NCR/incident density; strip chart export
- Print: map sheets (A3) with legend, date and layers, QR verification, signature blocks; printing audited

## Real-Time, Offline, Security

- Socket events re-check permission before emit; clients re-sync missed events on reconnect
- Offline through the field engine (Part 79): my location on map, nearby work fronts and open NCRs captured offline
- Validations: valid GeoJSON; chainage ranges within alignment length; layer belongs to project; optimistic locking `version`; Idempotency-Key on posting actions
- Four-layer authorisation, scope isolation, IDs re-authorised on every request (no IDOR); registered routes/jobs/sockets (Part 9); secrets in the secret store

## Verification

- `npm run typecheck` — green; `npm run build` — green
- Evidence in `docs/erp-program/test-evidence/part-32/`
