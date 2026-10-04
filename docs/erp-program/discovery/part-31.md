# Discovery — Part 31: Weather & Site Condition Management (SA-2)

## Search performed
Keywords (code + DB catalogue): weather, rainfall, temperature, humidity, wind, shutdown, monsoon, site condition, concreting restriction.

## Findings
- No existing weather/rainfall/shutdown module in the repository — no `wx_*` entities, screens or APIs existed.
- DPR weather fields exist in `src/data/dprData.ts` (`weatherMorning/Afternoon`, `rainfallMm`, `temperature`) — extended, not duplicated: wx observations carry `dprNo` links back to the DPR.
- `src/data/siteExecutionData.ts` — `delays` array contains `delay_003` (weather cause, 2025-07-25 heavy rainfall) — shutdown `delayEventId` links to it (Part 26/62 records).
- `src/data/workAuthorisationData.ts` — WAs (WA-2026-0143 active, concreting) — restriction warnings reference WAs (CP-WX-02).
- Dashboard pattern (Parts 28–30) reused: header with ff badge, tabs, StatCard, protocol sections.
- Feature flag registry extended additively with `ff.weather`, `ff.weather.provider`.

## REUSE / EXTEND / NEW

| Item | Kind | Decision | Notes |
|---|---|---|---|
| `wx_observations` | Entity | NEW | site/date/time_slot/values/condition/source/recorded_by + DPR link |
| `wx_shutdowns` | Entity | NEW | hours lost, affected activities, evidence, delay link |
| `wx_restrictions` | Entity | NEW | project/activity_type/rule/limits/enforcement/source |
| `wx_restriction_warnings` | Entity | NEW | CP-WX-02 results with WA refs |
| `wx_monthly_history` | Entity | NEW | rain days by month feeding schedule calendars |
| DPR weather fields (Part 30) | Entity | EXTEND | wx card shown in DPR; observations carry dprNo |
| Schedule calendars (Part 26) | Entity | REUSE | monthly history feeds wet-day settings |
| Delay records (Part 26/62) | Entity | REUSE | `delayEventId` links |
| Weather provider (Part 80) | Integration | DEFERRED | `source=provider` model ready; actual feed deferred |
| Dashboard pattern | Screen | REUSE | Parts 28–30 conventions |
| Weather card | Screen | NEW | site home and DPR |
| Shutdown form (mobile) | Screen | NEW | photos, GPS/time, offline-capable |
| Restriction evaluator | Calculation | NEW | CP-WX-02 warn/block |
| Hours-lost ≤ shift-hours validation | Calculation | NEW | business rule |
| Duplicate-observation prevention | Calculation | NEW | one per site/time slot |
| Missing-weather job (CP-WX-01) | Job | NEW | daily per active site, WARN |

## Conflicts
See `CONFLICTS.md` (C31-1, C31-2). No existing behaviour was changed.
