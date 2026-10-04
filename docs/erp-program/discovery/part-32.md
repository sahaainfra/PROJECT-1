# Discovery — Part 32: GIS, Survey & Site Location Intelligence (SA-2)

## Search performed
Keywords (code + DB catalogue): map, gis, gps, coordinates, chainage, boundary, polygon, survey, heatmap, location, geojson.

## Findings
- No existing GIS/map/layer entities, screens or APIs in the repository.
- GPS on DPR/photos exists in `src/data/dprData.ts` (lat/lng on DPR + photos, WGS84) — reused as location-link source data.
- `src/data/siteExecutionData.ts` — work fronts and site photos (location sources); `src/data/workAuthorisationData.ts` — WA locations.
- Survey checks (Part 98) and map provider (Part 80) not present in the workspace — deferred (CONFLICTS.md C32-2).
- No map library in the frontend stack — the map workspace is delivered as an original SVG schematic visualization (no vendor code/logos), consistent with the design system.
- Dashboard pattern (Parts 28–30) reused; feature flag registry extended additively with `ff.gis`.
- Geofence/site coordinates (Part 4) and BOQ/WBS (Part 20) masters referenced conceptually (boq_item_id, site boundaries WGS84).

## REUSE / EXTEND / NEW

| Item | Kind | Decision | Notes |
|---|---|---|---|
| `gis_layers` | Entity | NEW | boundary/alignment/structure/zone/work_front/asset/store, GeoJSON, version DRAFT→APPROVED→SUPERSEDED |
| `gis_chainage_refs` | Entity | NEW | linear referencing on approved alignment |
| `gis_location_links` | Entity | NEW | entity_type/entity_id → lat/lng or chainage |
| `gis_boq_locations` | Entity | NEW | quantities per zone/chainage, measured vs planned |
| Site coordinates & geofences (Part 4) | Entity | REUSE | WGS84 boundary consistency |
| BOQ/WBS (Part 20) | Entity | REUSE | boq_item_id references |
| GPS on DPR/photos (Part 30) | Entity | REUSE | location links source |
| Survey checks (Part 98) | Entity | DEFERRED | control-points overlay deferred to Part 98 |
| Map provider (Part 80) | Integration | DEFERRED | real tiles deferred; SVG schematic delivered |
| Dashboard pattern | Screen | REUSE | Parts 28–30 conventions |
| Map workspace | Screen | NEW | SVG schematic, layer control, filters, click-through |
| Heatmap aggregations | Calculation | NEW | zone/chainage planned vs actual + NCR/incident density |
| Chainage computation | Calculation | NEW | along approved alignment version |
| Layer import (GeoJSON/KML) | Job | NEW | validation + versioning |
| Missing chainage monitor (CP-GIS-01) | Job | NEW | linear works require chainage |

## Conflicts
See `CONFLICTS.md` (C32-1..C32-3). No existing behaviour was changed.
