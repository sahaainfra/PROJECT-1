# Test Evidence - Part 34: Advanced Procurement

Date: 2026-10-04 · Workspace: frontend baseline app (see CONFLICTS.md C34-1)

## Gates run

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | PASS |
| Build | `npm run build` | PASS |
| Regression | additive-change verification | PASS - existing data files and components unchanged (additive only: new `procurementData.ts`, new `ProcurementDashboard.tsx`, App.tsx 'proc' registration, Launchpad tile, feature flags appended) |

## Protocol test matrix - CP-PROC (per section 28)

| Control point | PASS | WARN (reason captured) | EXCEPTION approved/rejected | BLOCK | Emergency regularisation | Escalation |
|---|---|---|---|---|---|---|
| CP-PROC-01 (PR plan reference) | pr_001/pr_002 reference MRP run mrrun_001 with activity & WBS | - | UNPLANNED_WORK path modelled (site_requirement sr_0014 on pr_003) | - | via exception approval | L2 PM |
| CP-PROC-02 (budget/stock/duplicate) | budget check status pass/soft on PRs; stock deducted in MRP lines | pr_003 soft budget check captured | - | BLOCK modelled for duplicate PR/PO (DR-04) | - | L2 |
| CP-PROC-03 (quotations/brand/blacklist) | 3 vendors quoted on RFQ-2025-0031; brand + spec captured; IRC:83 certificate noted on RFQ-0032 | - | SINGLE_SOURCE path modelled | BLOCK modelled (blacklisted vendor) | - | L2 → L3 |
| CP-PROC-04 (non-L1 justification) | CS-2025-0012 all lines L1 — no justification needed | - | NON_L1_SELECTION path modelled (justification mandatory if not L1) | - | - | L3 |
| CP-PROC-05 (PO within CS rate; variance > 5%) | PO-2025-0204 rates ≤ CS L1 rates; price variance ≤ 5% on all lines (audit corrections C34-5 applied) | - | EXCEPTION path modelled for variance > 5% | - | - | L2 → L3 |
| CP-PROC-06 (emergency purchase) | PO-2025-0198 direct PO with reason; regularisation within 24h modelled | - | EMERGENCY_PURCHASE approved | - | modelled on po_002 | L3 if not regularised |
| CP-PROC-07 (delivery overdue) | disp_001 partial delivery arrived | disp_002 overdue captured (expected 2025-12-03 vs 04-Dec) | - | - | - | L2 |
| CP-PROC-08 (short-close/cancel reason) | po_003 SHORT_CLOSED with reason on amendment + commitment released | - | - | BLOCK without reason modelled | - | L2 |

Regression-specific: landed cost calculation tests (7 quote lines: basic − discount + freight + other, GST excluded per `gst_inclusive_flag: false` — audit corrections C34-5), L1 ranking tests (CS matrix), PO qty/rate limit validations (≤ PR balance, ≤ CS rate), PO totals recomputed from lines (po_001 basic 754,430.40 / total 856,906.21; po_002 total 200,600; po_003 post-amendment total 138,880), amendment diff (po_003 amendment 1 qty 120→80, value −33.3%), vendor link token expiry modelled, price variance threshold tests (alert > 5%), permission masking (`proc.quotation.rates.view` — rates hidden from site users, documented).

## Acceptance verification

| Criterion | Result |
|---|---|
| End-to-end PR → PO with budget check, CS and approvals | pr_001 (MRP) → RFQ-2025-0031 → CS-2025-0012 (approved) → PO-2025-0204 (approved, released) with commitment |
| Commitments visible in budget | commitmentAmount on POs; open PO value ₹1,057,506.21 aggregated in Overview KPI; emission/release modelled (Part 25) |
| Non-L1 requires justification | CS justification panel — mandatory if not L1 (CP-PROC-04) |
| Blacklisted vendor blocked | CP-PROC-03 BLOCK modelled; blacklist check in RFQ vendor filter |
| Legacy POs viewable and receivable | PO register shows all lifecycle states; receivable states modelled (GRN in Part 35) |

## Data integrity

- Additive changes only: `procurementData.ts` (new), `ProcurementDashboard.tsx` (new), App.tsx 'proc' registration (additive), Launchpad tile (additive), feature flags (appended to registry, existing entries untouched).
- Audit corrections (C34-5): arithmetic/data fixes to Part 34 sample data only — no legacy data or files altered.

## Dependency validation (section 30)

| Dependency | State | Result |
|---|---|---|
| Part 6 - Workflow & Approval Engine | workflowData.ts present | workflow_instance_id references valid; chain Procurement → Project → Management above limit modelled |
| Part 11 - Master Data Governance | MasterDataGovernanceDashboard + vendor master present | ven_* ids valid; tax resolver modelled (Part 88 rules deferred per C34-4) |
| Part 20 - WBS, BOQ & Work Package Management | BOQManagement + data present | wbs_node_id / cost_code_id / activity_id references valid |
| Part 25 - Advanced Budgeting & Cost Control | BudgetDashboard + budgetData present | budget check + commitment interfaces modelled |
| Part 26 - Advanced Project Planning & Scheduling | PlanningDashboard + planningData present | schedule phasing feeds MRP timing modelled |
| Part 35 - Stores / GRN | not present | deferred per C34-3; dispatches end at "Arrived" |
| Part 33 - Planned vs Budgeted vs Actual Engine | explored, not implemented | recorded per C34-2; PCE will consume commitments when delivered |
