# Discovery — Part 35: Advanced Stores & Inventory (SA-2)

## Search performed
Keywords (code + DB catalogue): store, stock, inventory, grn, mrn, receipt, issue, return, transfer, consumption, valuation, physical verification, reorder, barcode, qr.

## Findings
- No existing store/stock/GRN/issue/return/transfer/adjustment/PV/ledger/reorder/label entities, screens or APIs exist in the repository (frontend baseline app, React + Vite + TS; no backend). A legacy fixture widget `w-stores` exists in `Dashboard.tsx` (Part 13 framework demo fixture) — display only, no data layer; untouched.
- Part 34 (`procurementData.ts`) carries the procurement chain: open POs with delivered qty (`pol_001` cement 400 bags partial on `po_001`), dispatches/ASN ending at "Arrived" (`disp_001` arrived, `disp_002` in transit), landed rates (cement 414.03) and vendor masters (`ven_*`). GRN consumes these cross-references.
- Work Authorisation (Part 29, `workAuthorisationData.ts`) and DPR (Part 30, `dprData.ts`) provide WA lines, activities (`ACT-CON-010`, `ACT-FIN-020`), WBS nodes and cost codes for issue/consumption traceability. DPR already labels "Materials consumed — Prefilled from stores issues (Part 35)".
- Workflow engine (Part 6), protocol engine (Part 7), permission engine (Part 5), accountability ledger (Part 10) delivered as patterns — workflow_instance_id references and CP-STR-01…09 control points registered in OBSERVE.
- Store hierarchy warehouse → store → bin modelled with store type extension `plant` (batching plant store, Part 109 consumer) on top of the section 11 enum site/central/yard/in_transit — additive extension, documented here.
- Part 52 (QA/QC acceptance), 90 (theoretical vs actual reconciliation), 92 (monthly material reconciliation), 106 (gate passes), 109 (batch issues), 111 (e-way bill engine) are not yet live in the workspace — data model carries the documented contract (qc_status, reconciliation refs, gate pass refs, eway bill validation refs) without consuming them.
- Dashboard pattern (Parts 28–34) reused; feature flag registry extended additively with `ff.stores`, `ff.stores.barcode`, `ff.stores.plant_store` (default OFF).
- No part of the existing behaviour is changed; all additions are new files + additive registrations.

## REUSE / EXTEND / NEW

| Item | Kind | Decision | Notes |
|---|---|---|---|
| `inv_stores` (+ plant type extension) | Entity | NEW | type site/central/yard/in_transit/plant; keeper, negative-stock-block flag, warehouse→store→bin hierarchy |
| `inv_bins` | Entity | NEW | optional bins per store |
| `inv_grns` + `inv_grn_lines` | Entity | NEW | lifecycle DRAFT→SUBMITTED→QC_PENDING→POSTED/REJECTED; against PO/transfer/emergency; challan/invoice/vehicle/e-way bill; batch/heat/cement-week; qc_status |
| `inv_stock_ledger` | Entity | NEW | append-only; txn_type GRN/ISSUE/RETURN/TRANSFER_OUT/TRANSFER_IN/ADJUSTMENT/OPENING; valuation computed on posting; WAC default |
| `inv_issues` + `inv_issue_lines` | Entity | NEW | lifecycle REQUESTED→APPROVED→ISSUED; against activity/WBS/cost code; subcontractor free-issue vs chargeable with recovery rate |
| `inv_returns` | Entity | NEW | site→store and store→vendor (RTV from rejected qty) |
| `inv_transfers` (+ lines) | Entity | NEW | DISPATCHED→IN_TRANSIT→RECEIVED; in-transit store; transfer at book value; gate pass |
| `inv_adjustments` (+ lines) | Entity | NEW | reason damage/theft/shortage/excess/expiry/revaluation; maker-checker |
| `inv_physical_verifications` (+ lines) | Entity | NEW | full/cycle; variance posting after approval; feeds Part 92 closing physical stock |
| `inv_reorder_rules` | Entity | NEW | min/max/reorder qty/lead time per store+material; reorder alerts and draft PR refs (Parts 34/90) |
| `inv_labels` | Entity | NEW | QR payload for material/batch/bin; printed_at |
| `inv_stock_balances` (read model) | Entity | NEW | on-hand/accepted (issuable)/under-inspection per store+material with WAC |
| `inv_material_control` (read model) | Entity | NEW | per WA/activity: authorised → issued → consumed (DPR) → returned → wastage |
| `inv_finance_postings` (read model) | Entity | NEW | posting-engine entries: GRN Dr Inventory/Cr GRNI; issue Dr WIP/Cr Inventory; adjustments |
| Open POs, dispatches, landed rates, vendors (Part 34) | Entity | REUSE | po_001 partial 400 bags; disp_001 arrived; book-value cross-references |
| WA lines, activities, WBS, cost codes (Parts 29/30) | Entity | REUSE | issue/consumption traceability; DPR consumption prefill |
| Workflow engine (Part 6) | Service | REUSE | workflow_instance_id references; standard lifecycle |
| Protocol engine (Part 7) | Service | REUSE | CP-STR-01…09 registered in OBSERVE |
| Numbering (Part 3) | Service | REUSE | GRN-/ISS-/RET-/TRF-/ADJ-/PV- series |
| Legacy fixture widget `w-stores` (Part 13) | Screen | REUSE | display-only demo fixture; untouched; replaced by this Part's workspace behind `ff.stores` |
| Store dashboard (launchpad tiles, list report, object cards) | Screen | NEW | KPI cards, gate-status panel, QC hold, expandable registers |
| GRN form (mobile scan & photos) | Screen | NEW | against PO lines / transfer / emergency |
| Issue slip, returns, transfers, adjustments | Screen | NEW | registers + lifecycle chips + receiver ack |
| Physical verification (mobile count mode) | Screen | NEW | system vs counted variance |
| Stock ledger explorer + valuation | Screen | NEW | append-only ledger, WAC, GL parity note |
| Reorder & ageing/dead stock | Screen | NEW | min/max alerts, ageing buckets, dead stock |
| Label printing | Screen | NEW | QR payloads, scan targets |
| Stock valuation (WAC on posting) | Calculation | NEW | per company config; WAC default, FIFO optional prospectively |
| Negative stock block, over-receipt tolerance 2% | Calculation | NEW | configurable per store / material group |
| Ageing buckets & dead stock | Calculation | NEW | 0–30/31–90/91–180/>180; no movement > N days |
| GRN/issue posting to finance | Job | NEW | via posting engine; GL inventory = stock valuation |
| Reorder monitor, in-transit ageing, dead stock monitor (CP-STR-09) | Job | NEW | alert engine (Part 76) registration documented |
| Part 52 QC acceptance consumption | Integration | DEFERRED | qc_status contract carried; live consumption at Part 52 |
| Part 90/92 reconciliation consumption | Integration | DEFERRED | theoretical vs actual and monthly material reconciliation at Parts 90/92 |
| Part 106 gate pass / Part 111 e-way bill consumption | Integration | DEFERRED | printed gate pass continues; e-way numbers captured and validated later |
| Part 109 batch-driven issues from plant store | Integration | DEFERRED | plant store + availability check contract carried |
| Backend migrations for `inv_*` tables | Job | DEFERRED | additive, reversible per section 31; Parts 120–130 |

## Conflicts
See `CONFLICTS.md` (C35-1..C35-3). No existing behaviour was changed.
