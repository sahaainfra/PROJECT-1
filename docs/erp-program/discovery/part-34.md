# Discovery — Part 34: Advanced Procurement (SA-2)

## Search performed
Keywords (code + DB catalogue): purchase requisition, indent, pr, rfq, enquiry, quotation, comparative statement, cs, purchase order, po, vendor, supplier, delivery, dispatch, asn.

## Findings
- No existing PR/RFQ/quotation/CS/PO/dispatch entities, screens or APIs exist in the repository (frontend baseline app, React + Vite + TS; no backend).
- Vendor masters exist conceptually via `src/data/masterDataGovernanceData.ts` (Part 11) — vendor ids referenced as `ven_*` with state for GST determination.
- Tender/CRM modules (Parts 21–22) cover pre-award vendor interaction; this Part covers post-award procurement and reuses their patterns.
- Budget commitments (Part 25, `budgetData.ts`) — PO approval emits commitment; short-close releases; pattern reused conceptually.
- Workflow engine (Part 6, `workflowData.ts`) — workflow_instance_id references on PR/CS/PO; legacy approvals continue until migrated behind `ff.wf.pr`/`ff.wf.po` (not present in workspace; deferred).
- Stores/GRN (Part 35) does not exist in the workspace — dispatches end at "Arrived"; GRN deferred to Part 35.
- Dashboard pattern (Parts 28–32) reused; feature flag registry extended additively with `ff.proc`, `ff.proc.mrp`, `ff.proc.vendor_portal`.
- No part of the existing behaviour is changed; all additions are new files + additive registrations.

## REUSE / EXTEND / NEW

| Item | Kind | Decision | Notes |
|---|---|---|---|
| `proc_mrp_runs` + `proc_mrp_lines` | Entity | NEW | requirement = Σ(remaining × norm × (1+wastage)) − stock − open PO − in-transit; suggested PR by required-by − lead time |
| `proc_requisitions` + `proc_requisition_lines` | Entity | NEW | lifecycle DRAFT→SUBMITTED→APPROVED→PARTIALLY_ORDERED→ORDERED→CLOSED/REJECTED/CANCELLED; budget check per line; plan ref (CP-PROC-01) |
| `proc_rfqs` + `proc_rfq_lines` + `proc_rfq_vendors` | Entity | NEW | multi-vendor, channels email/portal/manual; response status tracking |
| `proc_quotations` + `proc_quotation_lines` | Entity | NEW | landed cost = basic − discount + freight + other; GST credit treatment configurable |
| `proc_comparative_statements` + `proc_cs_lines` | Entity | NEW | L1 per line and overall; split award; justification if non-L1 (CP-PROC-04) |
| `proc_purchase_orders` + `proc_po_lines` | Entity | NEW | lifecycle with RELEASED/SHORT_CLOSED; source cs/direct/rate_contract; commitment amount |
| `proc_po_amendments` | Entity | NEW | versioned changes_json, reason, re-approval |
| `proc_dispatches` | Entity | NEW | ASN/LR/vehicle/e-way bill; GRN deferred to Part 35 |
| `proc_vendor_performance` | Entity | NEW | on-time/quality/price/responsiveness scoring |
| Vendor master, blacklist, tax resolver (Part 11) | Entity | REUSE | ven_* ids; GST intra/inter by vendor state vs delivery state (Part 88 rules once live) |
| Budget commitments (Part 25) | Entity | REUSE | PO commitment emission/release modelled |
| Workflow engine (Part 6) | Service | REUSE | workflow_instance_id references; chain Procurement → Project → Management above limit |
| Protocol engine (Part 7) | Service | REUSE | CP-PROC-01…08 registered in OBSERVE |
| Numbering (Part 3) | Service | REUSE | PR-/RFQ-/CS-/PO- series in sample data |
| Dashboard pattern (Parts 28–32) | Screen | REUSE | tabs, KPI cards, status chips, gate-status panel |
| MRP workbench | Screen | NEW | params, run, net-requirement grid, suggested PR |
| PR register (mobile-friendly form) | Screen | NEW | list + expandable lines |
| RFQ builder + quotation grid | Screen | NEW | lines, vendors/responses, landed-cost table |
| CS matrix view | Screen | NEW | vendors × items, L1 highlighted, award split |
| PO form + amendment compare | Screen | NEW | totals, delivery schedule, amendment diff |
| Delivery tracker | Screen | NEW | dispatch/ASN, overdue status |
| Vendor scorecard | Screen | NEW | metric bars, grade chips |
| MRP net requirement | Calculation | NEW | norms × wastage − stock − open PO − in-transit |
| Landed cost & L1 ranking | Calculation | NEW | per line and overall |
| Price variance | Calculation | NEW | PO rate vs budget vs last purchase; alert > 5% |
| PO commitment emission | Job | NEW | on approval; amendments adjust; short-close releases |
| Overdue delivery monitor (CP-PROC-07) | Job | NEW | expected vs today |
| Stores GRN (Part 35) | Screen | DEFERRED | dispatch ends at "Arrived"; GRN is Part 35 |
| Legacy PR/PO migration (ff.wf.pr/ff.wf.po) | Job | DEFERRED | not present in workspace |

## Conflicts
See `CONFLICTS.md` (C34-1..C34-3). No existing behaviour was changed.
