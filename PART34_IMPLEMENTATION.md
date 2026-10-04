# Part 34 - Advanced Procurement Implementation

## Overview

Part 34 implements the procurement chain for the Construction ERP: Material Requirement Planning (MRP from BOQ norms and schedule) → Material Requirement → PR → RFQ → Quotation → Comparative Statement → Approval → PO → Dispatch, with budget checks (Part 25), vendor performance scoring, price variance and procurement commitments feeding cost control. GRN (receipt) is Part 35; dispatch/ASN ends at "Arrived" in this Part.

Feature flag: `ff.proc` (sub-flags `ff.proc.mrp`, `ff.proc.vendor_portal`), registered default OFF in production.

## Key Components

### 1. MRP (`src/data/procurementData.ts`)
- `proc_mrp_runs` / `proc_mrp_lines`: requirement = Σ(activity remaining qty × norm × (1+wastage)) − stock − open PO − in-transit
- Suggested PR qty by required-by date minus lead time; parameters_json (wastage default, lead-time buffer)
- Sample: 1 run (Riverside Tower, 30-day horizon) with 5 lines (cement, TMT steel, aggregate, shuttering ply, binding wire)
- MRP Workbench tab with parameters, net-requirement grid and suggested-PR chips (CP-PROC-01)

### 2. PR (Purchase Requisition)
- `proc_requisitions` + `proc_requisition_lines`: lifecycle DRAFT → SUBMITTED → APPROVED → PARTIALLY_ORDERED → ORDERED → CLOSED | REJECTED | CANCELLED
- Budget check status per PR (pass/soft/fail, Part 25); plan ref with type (mrp/wa/daily_plan/site_requirement) — CP-PROC-01
- Sample: 3 PRs (MRP-driven approved, MRP-driven submitted, emergency site-requirement approved with soft budget check)
- PR Register tab: expandable lines with WBS/cost code, balance-to-order, preferred vendor

### 3. RFQ & Quotations
- `proc_rfqs` + `proc_rfq_lines` + `proc_rfq_vendors`: multi-vendor (3 vendors on RFQ-0031), channels email/portal/manual, response tracking
- `proc_quotations` + `proc_quotation_lines`: landed cost = basic − discount + freight + other; GST credit treatment configurable (recoverable GST excluded from comparison)
- Sample: 4 quotations, 7 quote lines with brand and remarks
- Rates are sensitive — `proc.quotation.rates.view` (Procurement, Commercial, Management; not site users); also captured via secure token-based, time-limited vendor response link

### 4. Comparative Statement (CS)
- `proc_comparative_statements` + `proc_cs_lines`: auto-generated, L1 by landed cost per line and overall, split award allowed, justification mandatory if not L1 (CP-PROC-04)
- Sample: CS-2025-0012 (approved) — Shakti Cement Agencies L1 on both lines, full-quantity award
- CS matrix view: vendors × items grid with L1 cells highlighted green, award split and justification panels

### 5. PO & Amendments
- `proc_purchase_orders` + `proc_po_lines`: lifecycle DRAFT → SUBMITTED → APPROVED → RELEASED → PARTIALLY_RECEIVED → RECEIVED → CLOSED | SHORT_CLOSED | CANCELLED
- Source types: cs / direct (reason for emergency, CP-PROC-06) / rate contract; GST intra/inter by vendor state vs delivery state via tax resolver (Part 11; Part 88 rules once live, compared in parallel)
- `proc_po_amendments`: versioned changes_json with reason, re-approval; commitment adjusts
- Sample: 3 POs (PARTIALLY_RECEIVED from CS, RELEASED direct emergency, SHORT_CLOSED with amendment 1 reducing qty/value), 1 amendment
- Commitments: PO approval emits commitment to budget (Part 25); short-close releases (CP-PROC-08)
- Price variance table: PO rate vs budget rate vs last purchase rate, alert above 5% threshold (CP-PROC-05)

### 6. Dispatch / Delivery Tracker
- `proc_dispatches`: vendor invoice, LR no, vehicle, e-way bill, dispatch date, expected arrival, arrived flag
- Sample: 2 dispatches (1 arrived partial cement, 1 in-transit bearings)
- Overdue alerts (CP-PROC-07); GRN deferred to Part 35

### 7. Vendor Performance
- `proc_vendor_performance`: on-time pct (GRN date vs due, from Part 35), quality acceptance (Parts 35/52), price competitiveness, responsiveness, score, grade
- Sample: 3 vendors (A/B/C grades) with metric bars

## Protocol Controls

CP-PROC-01…08 (section 8A) registered with the Protocol & Control Engine (Part 7) in OBSERVE mode; `protocol.check()` evaluated server-side on every path; gate-status panel on the Protocol Controls tab; deviations only through approved exceptions (PC-3) with reason codes (PC-7), ledger (PC-8) and escalation (PC-9).

| Control point | Stage | Enforcement |
|---|---|---|
| CP-PROC-01 (PR plan reference) | PLAN | EXCEPTION (UNPLANNED_WORK) |
| CP-PROC-02 (budget/stock/duplicate check) | VERIFY | EXCEPTION / BLOCK (duplicate) |
| CP-PROC-03 (min quotations, brand, blacklist) | VERIFY | EXCEPTION (SINGLE_SOURCE) / BLOCK (blacklist) |
| CP-PROC-04 (non-L1 justification) | APPROVE | EXCEPTION (NON_L1_SELECTION) |
| CP-PROC-05 (PO within CS rate; variance > 5%) | APPROVE | EXCEPTION |
| CP-PROC-06 (emergency purchase regularise 24h) | EXECUTE | EXCEPTION (EMERGENCY_PURCHASE) |
| CP-PROC-07 (delivery overdue, split POs) | MONITOR | MONITOR |
| CP-PROC-08 (short-close/cancel with reason) | CLOSE | BLOCK without reason |

## Data Layer (`src/data/procurementData.ts` — REUSE/EXTEND/NEW)

| Entity | Decision | Notes |
|---|---|---|
| `proc_mrp_runs` / `proc_mrp_lines` | NEW | norms × wastage − stock − open PO − in-transit |
| `proc_requisitions` + lines | NEW | full lifecycle, budget check, plan ref |
| `proc_rfqs` + lines + vendors | NEW | multi-vendor, response tracking |
| `proc_quotations` + lines | NEW | landed cost calculation |
| `proc_comparative_statements` + lines | NEW | L1 ranking, split award |
| `proc_purchase_orders` + lines | NEW | lifecycle, source types, commitment |
| `proc_po_amendments` | NEW | versioned, re-approved |
| `proc_dispatches` | NEW | ASN/LR/e-way; GRN in Part 35 |
| `proc_vendor_performance` | NEW | scorecard scoring |
| Vendor master / blacklist / tax resolver (Part 11) | REUSE | ven_* ids, GST determination |
| Budget commitments (Part 25) | REUSE | emission/release modelled |
| Workflow engine (Part 6) | REUSE | workflow_instance_id references |

Live backend migrations are additive, idempotent, reversible; registered in `DB_EXTENSIONS.md` at backend delivery.

## APIs (SA-11 — versioned, idempotent, optimistic locking; documented contract)

- `POST /api/v1/proc/mrp/run`, `GET /api/v1/proc/mrp/runs/{id}`
- `GET/POST/PATCH /api/v1/proc/requisitions`, `/rfqs`, `/quotations`, `/comparative-statements`, `/purchase-orders`, `/purchase-orders/{id}/amendments`, `/dispatches`
- `POST /api/v1/proc/purchase-orders/{id}/release|short-close|cancel`
- `GET /api/v1/proc/vendors/{id}/performance`, `GET /api/v1/proc/price-variance`
- Vendor response (public, token): `GET/POST /api/v1/proc/vendor-portal/rfq/{token}`

## Events & Notifications (SA-8/SA-9)

- Events: `proc.pr.approved`, `proc.po.approved`, `proc.po.released`, `proc.dispatch.recorded`, `proc.po.delivery_overdue`
- Notifications: PR approved → procurement; RFQ sent → vendors (email); quotation due reminders; CS/PO approvals; PO released → vendor + site store; delivery overdue → procurement + site; price variance alerts (Part 76 alert engine)

## Permissions (Part 5 registry)

- `proc.pr.create` — Site Engineer, Store Keeper, Planning; `proc.pr.approve` — per workflow
- `proc.rfq.*`, `proc.quotation.*`, `proc.cs.create` — Procurement team; `proc.cs.approve` — per workflow
- `proc.po.create/amend` — Procurement; `proc.po.approve` — per amount bands
- `proc.quotation.rates.view` (sensitive) — Procurement, Commercial, Management (not site users)
- Deny by default; explicit deny wins; enforced at UI + API + service + data access (SA-5)

## Reporting & Printing

- Reports (Part 65 catalogue): PR status/ageing; RFQ response; CS register; PO register; pending deliveries; price variance; vendor performance; procurement savings (budget − PO value); commitment report
- Print: PR, RFQ, CS, PO (with T&C, tax summary, delivery schedule), PO amendment — QR verification, signature blocks, printing audited

## Real-Time, Offline, Security

- Socket events re-check permission before emit; clients re-sync missed events on reconnect
- Online-only: screens show connectivity state; submissions disabled while offline with clear message
- Validations: required-by ≥ today; UOM conversion; quotation validity ≥ CS approval date; PO totals recomputed server-side; optimistic locking `version`; Idempotency-Key on approval actions
- Four-layer authorisation, scope isolation, IDs re-authorised on every request (no IDOR); vendor portal users isolated (SA-33); registered routes/jobs/sockets (Part 9); secrets in the secret store

## Verification

- `npm run typecheck` — green; `npm run build` — green
- Evidence in `docs/erp-program/test-evidence/part-34/`
