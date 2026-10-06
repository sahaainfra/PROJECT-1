// Part 35 — Advanced Stores & Inventory Data
// Module code: stores · Feature flag: ff.stores (sub-flags: ff.stores.grn, ff.stores.issue,
// ff.stores.transfer, ff.stores.valuation, ff.stores.labels)
// Phase: PROCUREMENT & RESOURCES · Consumed by Parts 36, 37, 38, 49, 50, 52, 54, 70, 78, 82,
// 90, 91, 92, 104, 106, 107, 109, 111
//
// Discovery note (Step 1): existing tables goods_receipt_notes / inventory are EXTENDED, never
// renamed or replaced. Legacy FIFO valuation is preserved for historical rows; WAC applies only
// prospectively per company config with recorded decision (see valuationConfig.decision).
// All figures below are PREVIEW DATA sourced from the services listed per record.

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export type StoreType = 'central' | 'site' | 'yard' | 'plant' | 'in_transit';

export interface InvStore {
  id: string;
  code: string;
  name: string;
  type: StoreType;
  siteId?: string;
  siteName?: string;
  projectId: string;
  projectName: string;
  parentId?: string;            // warehouse → store → bin hierarchy
  parentName?: string;
  keeperId: string;
  keeperName: string;
  allowNegativeStock: boolean;  // configurable per store (section 9)
  valuationMethod: 'WAC' | 'FIFO';
  stockPeriodLockTo?: string;   // aligned with finance period (section 9)
  bins: InvBin[];
}

export interface InvBin {
  id: string;
  storeId: string;
  code: string;
  description: string;
}

export type GrnStatus = 'draft' | 'submitted' | 'qc_pending' | 'posted' | 'rejected';
export type QcStatus = 'pending' | 'accepted' | 'rejected';

export interface GrnLine {
  id: string;
  grnId: string;
  poLineId?: string;
  materialId: string;
  materialName: string;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  uom: string;
  rate: number;
  batchNo?: string;             // heat no. for steel, week code for cement (mandatory if tracked)
  batchTracked: boolean;
  expiryDate?: string;
  binCode?: string;
  qcStatus: QcStatus;
  overReceiptPct: number;       // vs PO line balance
}

export interface InvGrn {
  id: string;
  grnNo: string;
  storeId: string;
  storeName: string;
  poId?: string;                // nullable — emergency without PO needs approval
  poNo?: string;
  transferId?: string;          // GRN against inter-site transfer receipt
  vendorId: string;
  vendorName: string;
  challanNo: string;            // mandatory for vendor receipts (section 10)
  vendorInvoiceNo: string;
  vehicleNo: string;
  ewayBillNo?: string;          // validated in Part 111 once live
  receivedDate: string;
  status: GrnStatus;
  qcRequired: boolean;
  emergencyWithoutPo?: boolean;
  exceptionId?: string;         // CP-STR-01 deviation evidence
  photos: string[];             // material + challan photos (document service SA-10)
  lines: GrnLine[];
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  postedAt?: string;
  postingRef?: string;          // Dr Inventory / Cr GRNI via posting engine (SA-14)
  gateChecks: GateCheckResult[];
}

export type IssueStatus = 'requested' | 'approved' | 'issued' | 'rejected' | 'cancelled';

export interface IssueLine {
  id: string;
  issueId: string;
  materialId: string;
  materialName: string;
  qty: number;
  uom: string;
  rate: number;
  activityId?: string;
  activityName?: string;
  wbsNodeCode?: string;
  costCode?: string;
  waNo?: string;                // active Work Authorisation line reference (CP-STR-03)
  waBalanceQty?: number;        // CP-STR-04: issue qty ≤ WA balance
  chargeableToSubcontractor: boolean;
  recoveryRate?: number;        // feeds subcontract bill deductions (Part 46)
  suggestedBatch?: string;      // FIFO/FEFO suggestion (section 9)
}

export interface InvIssue {
  id: string;
  issueNo: string;
  storeId: string;
  storeName: string;
  issuedToType: 'employee' | 'subcontractor' | 'activity';
  issuedTo: string;
  requestRef?: string;          // site material request / daily plan line
  date: string;
  status: IssueStatus;
  acknowledgement: 'none' | 'otp' | 'signature';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  lines: IssueLine[];
  createdBy: string;
  createdAt: string;
  postedAt?: string;
  postingRef?: string;          // Dr Project cost WIP / Cr Inventory
  gateChecks: GateCheckResult[];
}

export interface InvReturn {
  id: string;
  returnNo: string;
  type: 'site_to_store' | 'to_vendor';
  storeId: string;
  storeName: string;
  fromHolder: string;
  issueRef?: string;
  grnRef?: string;              // rejected qty → return to vendor note
  date: string;
  status: 'draft' | 'submitted' | 'posted';
  reasonCode: string;
  lines: Array<{ id: string; materialName: string; qty: number; uom: string; rate: number; batchNo?: string }>;
  gateChecks: GateCheckResult[];
}

export type TransferStatus = 'requested' | 'dispatched' | 'in_transit' | 'partially_received' | 'received';

export interface InvTransfer {
  id: string;
  transferNo: string;
  fromStoreId: string;
  fromStoreName: string;
  toStoreId: string;
  toStoreName: string;
  dispatchDate: string;
  receiptDate?: string;
  transitDays: number;
  status: TransferStatus;
  gatePassNo?: string;          // Part 106 when live; printed gate pass until then
  gatePassViolation?: boolean;
  vehicleNo: string;
  ewayBillNo?: string;
  pricingBasis: 'book_value';   // transfer at book value (section 5.5)
  discrepancyNote?: string;     // short/excess handled by discrepancy note
  lines: Array<{ id: string; materialName: string; qty: number; uom: string; bookRate: number; receivedQty?: number }>;
  createdBy: string;
  gateChecks: GateCheckResult[];
}

export interface InvAdjustment {
  id: string;
  adjNo: string;
  storeId: string;
  storeName: string;
  reason: 'damage' | 'theft' | 'shortage' | 'excess' | 'expiry' | 'revaluation';
  date: string;
  status: 'draft' | 'submitted' | 'approved' | 'posted' | 'rejected';
  maker: string;
  checker?: string;             // CP-STR-08 SoD: Store Keeper ≠ Store In-charge/PM
  comment: string;
  lines: Array<{ id: string; materialName: string; qtyChange: number; uom: string; rate: number; valueChange: number }>;
  postingRef?: string;
  gateChecks: GateCheckResult[];
}

export interface PhysicalVerification {
  id: string;
  pvNo: string;
  storeId: string;
  storeName: string;
  date: string;
  type: 'full' | 'cycle';
  status: 'open' | 'submitted' | 'approved' | 'posted';
  controlledMaterialsOnly: boolean;   // CP-STR-07 monthly PV of controlled materials
  varianceValue: number;
  investigationNote?: string;         // required when variance > threshold
  blocksPeriodClose: boolean;
  lines: Array<{ id: string; materialName: string; systemQty: number; countedQty: number; uom: string; variance: number; rate: number }>;
  approvedBy?: string;
  feedsReconciliation?: string;       // Part 92 monthly material reconciliation closing stock
}

export interface ReorderRule {
  id: string;
  storeId: string;
  storeName: string;
  materialId: string;
  materialName: string;
  min: number;
  max: number;
  reorderQty: number;
  leadTimeDays: number;
  currentStock: number;
  status: 'ok' | 'below_min' | 'alert_raised' | 'draft_pr_created';
  draftPrNo?: string;           // draft PR generated (Parts 34/90)
}

export interface StockRow {
  materialId: string;
  materialName: string;
  category: string;
  storeId: string;
  storeName: string;
  binCode?: string;
  batchNo?: string;
  qty: number;                 // issuable (accepted) stock
  qcHoldQty: number;           // under-inspection, not issuable (section 5.2)
  reservedQty: number;         // reservation against WA lines (section 5.13)
  availableQty: number;        // qty − reserved
  uom: string;
  rate: number;                // valuation rate (masked unless stores.valuation.view)
  value: number;
  lastMovementDays: number;
  ageingBucket: '0-30' | '31-90' | '91-180' | '>180';
  expiryDate?: string;
  daysToExpiry?: number;
  reorderPoint?: number;
  classification: 'normal' | 'slow' | 'dead';
}

export interface LedgerEntry {
  id: string;
  date: string;
  storeName: string;
  materialName: string;
  txnType: 'GRN' | 'ISSUE' | 'RETURN' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ADJUSTMENT' | 'OPENING' | 'REVERSAL';
  txnRef: string;
  qtyIn: number;
  qtyOut: number;
  rate: number;
  balanceQty: number;
  balanceValue: number;
  wbsNodeCode?: string;
  activityName?: string;
  costCode?: string;
  postingRef?: string;
  note?: string;
}

export interface MaterialControlRow {
  waNo: string;
  activityName: string;
  materialName: string;
  authorisedQty: number;    // from WA (Part 29)
  issuedQty: number;        // store issues
  consumedQty: number;      // DPR actuals (Parts 28/30, reconciliation Part 90)
  returnedQty: number;
  wastageQty: number;
  pendingReturnQty: number; // CP-STR-06: unused material returned within 24 h of WA closure
  variancePct: number;
}

export interface FinancePosting {
  id: string;
  date: string;
  sourceDoc: string;
  docType: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  projectCode?: string;
  status: 'posted' | 'pending' | 'reversed';
}

export interface GateCheckResult {
  cp: string;
  name: string;
  status: 'pass' | 'warn' | 'fail' | 'pending' | 'exception';
  message?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  evidence: string;
  escalation: string;
  mode: 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
}

export interface RolePermission {
  key: string;
  role: string;
  description: string;
  scopeLevels: string;
  approvalLimit?: string;
}

export interface ApiRoute {
  method: string;
  path: string;
  permission: string;
  notes: string;
}

export interface SocketEventDef {
  event: string;
  room: string;
  payload: string;
  description: string;
}

export interface NotificationDef {
  trigger: string;
  recipients: string;
  level: 'Information' | 'Action required' | 'Warning' | 'Critical' | 'Escalation';
  template: string;
}

export interface ReportDef {
  code: string;
  name: string;
  format: string;
  drillDown: string;
  consumers: string;
}

export interface PrintTemplateDef {
  code: string;
  name: string;
  branding: string;
  features: string;
}

export interface OfflineOpDef {
  operation: string;
  device: string;
  queue: string;
  conflictRule: string;
}

export interface EntityMapRow {
  entity: string;
  table: string;
  decision: 'REUSE' | 'EXTEND' | 'NEW';
  notes: string;
}

export interface DependencyCheck {
  part: string;
  name: string;
  flag: string;
  flagState: string;
  interfaces: string;
  regressionEvidence: string;
  result: 'PASS' | 'ADAPTER';
}

export interface ConsumerContract {
  part: string;
  interface: string;
  kind: 'API' | 'EVENT' | 'TABLE' | 'VIEW';
  test: string;
}

export interface LabelDef {
  id: string;
  targetType: 'material' | 'batch' | 'bin';
  target: string;
  qrPayload: string;
  printedAt: string;
  scanUse: string;
}

export interface WaIntegrationRow {
  waNo: string;
  materialName: string;
  authorisedQty: number;
  reservedQty: number;
  issuedQty: number;
  balanceQty: number;
  reservationStatus: 'reserved' | 'released' | 'consumed';
}

// ──────────────────────────────────────────────────────────────────────────────
// Company valuation configuration (new method prospective only — section 3)
// ──────────────────────────────────────────────────────────────────────────────

export const valuationConfig = {
  companyId: 'comp_001',
  companyName: 'Acme Construction Ltd.',
  legacyMethod: 'FIFO',
  newMethod: 'WAC',
  effectiveFrom: '2026-01-01',
  decision: 'MD-DEC-2025-118 — weighted-average adopted prospectively; all pre-2026-01-01 ledger history remains valued on legacy FIFO and is never recomputed.',
  fifoOptionalPerStore: true,
  glInventoryBalance: 42850000,
  stockValuationTotal: 42850000,
  glMatchesStock: true,
};

// ──────────────────────────────────────────────────────────────────────────────
// inv_stores — warehouse → store → bin hierarchy (section 5.13)
// ──────────────────────────────────────────────────────────────────────────────

export const stores: InvStore[] = [
  {
    id: 'store_cw1', code: 'CWH-CHE-01', name: 'Central Warehouse — Chennai', type: 'central',
    projectId: 'prj_000', projectName: 'Company (all projects)',
    keeperId: 'usr_sk_001', keeperName: 'A. Murugan', allowNegativeStock: false, valuationMethod: 'WAC',
    stockPeriodLockTo: '2025-12-31',
    bins: [
      { id: 'bin_001', storeId: 'store_cw1', code: 'A-01', description: 'Cement racks (FEFO)' },
      { id: 'bin_002', storeId: 'store_cw1', code: 'B-04', description: 'Steel TMT yard bay' },
      { id: 'bin_003', storeId: 'store_cw1', code: 'QC-HOLD', description: 'Under-inspection cage (not issuable)' },
    ],
  },
  {
    id: 'store_rt_a', code: 'SST-RIV-A', name: 'Block A Site Store — Riverside Tower', type: 'site',
    siteId: 'site_001', siteName: 'Riverside Tower - Block A', parentId: 'store_cw1', parentName: 'Central Warehouse — Chennai',
    projectId: 'prj_001', projectName: 'Riverside Tower - Phase II',
    keeperId: 'usr_sk_002', keeperName: 'R. Kumar', allowNegativeStock: false, valuationMethod: 'WAC',
    bins: [
      { id: 'bin_011', storeId: 'store_rt_a', code: 'S1', description: 'Cement day-stock' },
      { id: 'bin_012', storeId: 'store_rt_a', code: 'S2', description: 'Admixtures & chemicals' },
    ],
  },
  {
    id: 'store_yd_b', code: 'YRD-RIV-B', name: 'Steel Yard — Riverside Block B', type: 'yard',
    siteId: 'site_002', siteName: 'Riverside Tower - Block B', parentId: 'store_cw1', parentName: 'Central Warehouse — Chennai',
    projectId: 'prj_001', projectName: 'Riverside Tower - Phase II',
    keeperId: 'usr_sk_003', keeperName: 'M. Selvam', allowNegativeStock: false, valuationMethod: 'WAC',
    bins: [{ id: 'bin_021', storeId: 'store_yd_b', code: 'Y-HEAT', description: 'Heat-number segregated racks' }],
  },
  {
    id: 'store_pl_1', code: 'PLT-BPL-01', name: 'Plant Store — Batching Plant 1', type: 'plant',
    siteId: 'site_003', siteName: 'Batching Plant 1', parentId: 'store_cw1', parentName: 'Central Warehouse — Chennai',
    projectId: 'prj_002', projectName: 'Highway Bridge Phase 2',
    keeperId: 'usr_sk_004', keeperName: 'T. Nair', allowNegativeStock: false, valuationMethod: 'WAC',
    bins: [{ id: 'bin_031', storeId: 'store_pl_1', code: 'P-SIL', description: 'Silos & additives' }],
  },
  {
    id: 'store_it_1', code: 'ITS-CW-RT', name: 'In-Transit — CWH → Riverside', type: 'in_transit',
    projectId: 'prj_001', projectName: 'Riverside Tower - Phase II',
    keeperId: 'usr_sk_001', keeperName: 'A. Murugan', allowNegativeStock: true, valuationMethod: 'WAC',
    bins: [],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// inv_stock_ledger balances (append-only projection) — stock explorer rows
// ──────────────────────────────────────────────────────────────────────────────

export const stockRows: StockRow[] = [
  { materialId: 'mat_001', materialName: 'Steel TMT 16mm', category: 'Steel', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai', binCode: 'B-04', batchNo: 'HEAT-TATA-8842', qty: 128.5, qcHoldQty: 0, reservedQty: 22, availableQty: 106.5, uom: 'MT', rate: 56200, value: 7221700, lastMovementDays: 3, ageingBucket: '0-30', reorderPoint: 60, classification: 'normal' },
  { materialId: 'mat_002', materialName: 'OPC 53 Grade Cement', category: 'Cement', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai', binCode: 'A-01', batchNo: 'WK-2026-03', qty: 1450, qcHoldQty: 300, reservedQty: 400, availableQty: 1050, uom: 'Bag', rate: 355, value: 514750, lastMovementDays: 1, ageingBucket: '0-30', expiryDate: '2026-04-06', daysToExpiry: 90, reorderPoint: 800, classification: 'normal' },
  { materialId: 'mat_003', materialName: 'Ready Mix Concrete M30', category: 'RMC', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1', qty: 42, qcHoldQty: 0, reservedQty: 18, availableQty: 24, uom: 'Cum', rate: 5450, value: 228900, lastMovementDays: 0, ageingBucket: '0-30', reorderPoint: 20, classification: 'normal' },
  { materialId: 'mat_004', materialName: 'Bitumen VG-30', category: 'Bitumen', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai', batchNo: 'BIT-DRUM-117', qty: 36, qcHoldQty: 0, reservedQty: 0, availableQty: 36, uom: 'MT', rate: 48900, value: 1760400, lastMovementDays: 24, ageingBucket: '0-30', expiryDate: '2026-07-15', daysToExpiry: 187, reorderPoint: 15, classification: 'normal' },
  { materialId: 'mat_005', materialName: 'Admixture – Polycarboxylate', category: 'Chemicals', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower', binCode: 'S2', batchNo: 'ADM-LOT-556', qty: 620, qcHoldQty: 0, reservedQty: 0, availableQty: 620, uom: 'Ltr', rate: 182, value: 112840, lastMovementDays: 52, ageingBucket: '31-90', expiryDate: '2026-01-28', daysToExpiry: 12, reorderPoint: 300, classification: 'slow' },
  { materialId: 'mat_006', materialName: 'Bricks (Red Clay)', category: 'Masonry', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower', qty: 42000, qcHoldQty: 0, reservedQty: 5000, availableQty: 37000, uom: 'Nos', rate: 7.5, value: 315000, lastMovementDays: 9, ageingBucket: '0-30', reorderPoint: 20000, classification: 'normal' },
  { materialId: 'mat_007', materialName: 'PVC Electrical Conduit 25mm', category: 'Electrical', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower', qty: 1850, qcHoldQty: 0, reservedQty: 0, availableQty: 1850, uom: 'Mtr', rate: 64, value: 118400, lastMovementDays: 128, ageingBucket: '91-180', reorderPoint: 500, classification: 'slow' },
  { materialId: 'mat_008', materialName: 'Galvanized Corrugated Sheet 0.5mm', category: 'Fabrication', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai', batchNo: 'GCS-LOT-0091', qty: 960, qcHoldQty: 0, reservedQty: 0, availableQty: 960, uom: 'Sqft', rate: 92, value: 88320, lastMovementDays: 240, ageingBucket: '>180', reorderPoint: 0, classification: 'dead' },
  { materialId: 'mat_009', materialName: 'Fire Bricks (Refractory)', category: 'Masonry', storeId: 'store_yd_b', storeName: 'Steel Yard — Riverside Block B', qty: 3200, qcHoldQty: 0, reservedQty: 0, availableQty: 3200, uom: 'Nos', rate: 42, value: 134400, lastMovementDays: 310, ageingBucket: '>180', classification: 'dead' },
  { materialId: 'mat_010', materialName: 'Diesel (HSD)', category: 'Fuel', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1', qty: 4200, qcHoldQty: 0, reservedQty: 800, availableQty: 3400, uom: 'Ltr', rate: 92.4, value: 388080, lastMovementDays: 2, ageingBucket: '0-30', reorderPoint: 2000, classification: 'normal' },
  { materialId: 'mat_011', materialName: 'Tower Crane Wire Rope 18mm', category: 'Spares', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1', batchNo: 'WR-SEALED-22', qty: 2, qcHoldQty: 0, reservedQty: 0, availableQty: 2, uom: 'Nos', rate: 185000, value: 370000, lastMovementDays: 46, ageingBucket: '31-90', reorderPoint: 1, classification: 'slow' },
  { materialId: 'mat_012', materialName: 'Waterproofing Membrane 4mm', category: 'Chemicals', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower', batchNo: 'WP-MEM-303', qty: 0, qcHoldQty: 850, reservedQty: 0, availableQty: 0, uom: 'Sqft', rate: 138, value: 117300, lastMovementDays: 0, ageingBucket: '0-30', reorderPoint: 400, classification: 'normal' },
];

export const stockSummary = {
  totalStores: stores.length,
  totalStockValue: stockRows.reduce((s, r) => s + r.value, 0),
  qcHoldValue: stockRows.reduce((s, r) => s + r.qcHoldQty * r.rate, 0),
  reservedValue: stockRows.reduce((s, r) => s + r.reservedQty * r.rate, 0),
  inTransitValue: 1284000,
  lowStockCount: stockRows.filter(r => r.reorderPoint !== undefined && r.qty < r.reorderPoint).length,
  deadStockCount: stockRows.filter(r => r.classification === 'dead').length,
  deadStockValue: stockRows.filter(r => r.classification === 'dead').reduce((s, r) => s + r.value, 0),
  expiringWithin30Days: stockRows.filter(r => r.daysToExpiry !== undefined && r.daysToExpiry <= 30).length,
};

// Ageing buckets (section 5.9)
export const ageingBuckets = [
  { bucket: '0-30', label: '0–30 days', value: 9843130, pct: 61.4 },
  { bucket: '31-90', label: '31–90 days', value: 3810840, pct: 23.8 },
  { bucket: '91-180', label: '91–180 days', value: 1184000, pct: 7.4 },
  { bucket: '>180', label: '>180 days (dead)', value: 222720, pct: 1.4 },
];

export const deadStockReport = stockRows
  .filter(r => r.classification === 'dead')
  .map(r => ({ ...r, action: 'Propose disposal / re-deployment — review in monthly material committee (Part 92)' }));

// ──────────────────────────────────────────────────────────────────────────────
// GRNs (inv_grns + inv_grn_lines) — section 5.1/5.2
// ──────────────────────────────────────────────────────────────────────────────

export const grns: InvGrn[] = [
  {
    id: 'grn_001', grnNo: 'GRN-2026-0235', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai',
    poId: 'po_2026_0142', poNo: 'PO-2026-0142', vendorId: 'vend_045', vendorName: 'Tata Steel Depo',
    challanNo: 'TS/CHL/77814', vendorInvoiceNo: 'TS/INV/2026/1189', vehicleNo: 'TN 20 AB 4521',
    ewayBillNo: '36AB4521000998', receivedDate: '2026-01-16', status: 'posted', qcRequired: true,
    photos: ['material_stack_01.jpg', 'challan_scan.jpg'],
    lines: [
      { id: 'grnl_001', grnId: 'grn_001', poLineId: 'pol_881', materialId: 'mat_001', materialName: 'Steel TMT 16mm', receivedQty: 60, acceptedQty: 58.4, rejectedQty: 1.6, uom: 'MT', rate: 56200, batchNo: 'HEAT-TATA-8842', batchTracked: true, binCode: 'B-04', qcStatus: 'accepted', overReceiptPct: 0 },
      { id: 'grnl_002', grnId: 'grn_001', poLineId: 'pol_882', materialId: 'mat_001', materialName: 'Steel TMT 20mm', receivedQty: 24, acceptedQty: 24, rejectedQty: 0, uom: 'MT', rate: 56800, batchNo: 'HEAT-TATA-8843', batchTracked: true, binCode: 'B-04', qcStatus: 'accepted', overReceiptPct: 0 },
    ],
    createdBy: 'usr_sk_001', createdAt: '2026-01-16T07:20:00Z', approvedBy: 'usr_sm_001',
    postedAt: '2026-01-16T09:05:00Z', postingRef: 'JV-2026-0412',
    gateChecks: [
      { cp: 'CP-STR-01', name: 'Against approved PO + challan photo + vehicle + heat no.', status: 'pass' },
      { cp: 'CP-STR-02', name: 'Over-receipt tolerance ≤ 2 %', status: 'pass', message: 'Received 100 % of open PO line quantity' },
      { cp: 'CP-STR-02', name: 'QC hold released by QA/QC (Part 52)', status: 'pass', message: 'IR-2026-0088 accepted; 1.6 MT rejected → RTV note' },
    ],
  },
  {
    id: 'grn_002', grnNo: 'GRN-2026-0236', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower',
    poId: 'po_2026_0143', poNo: 'PO-2026-0143', vendorId: 'vend_061', vendorName: 'Chennai Cement Ltd.',
    challanNo: 'CCL/DN/2026/3312', vendorInvoiceNo: 'CCL/INV/2026/0455', vehicleNo: 'TN 07 KL 8802',
    ewayBillNo: '3607KL880200145', receivedDate: '2026-01-16', status: 'qc_pending', qcRequired: true,
    photos: ['cement_challan.jpg', 'truck_seals.jpg'],
    lines: [
      { id: 'grnl_003', grnId: 'grn_002', poLineId: 'pol_901', materialId: 'mat_002', materialName: 'OPC 53 Grade Cement', receivedQty: 800, acceptedQty: 0, rejectedQty: 0, uom: 'Bag', rate: 355, batchNo: 'WK-2026-03', batchTracked: true, expiryDate: '2026-04-06', binCode: 'QC-HOLD', qcStatus: 'pending', overReceiptPct: 0 },
    ],
    createdBy: 'usr_sk_002', createdAt: '2026-01-16T10:40:00Z',
    gateChecks: [
      { cp: 'CP-STR-01', name: 'Against approved PO + documents', status: 'pass' },
      { cp: 'CP-STR-02', name: 'QC hold — under inspection, not issuable', status: 'pending', message: 'Awaiting physical-strength test (QA/QC, Part 52)' },
    ],
  },
  {
    id: 'grn_003', grnNo: 'GRN-2026-0237', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1',
    vendorId: 'vend_072', vendorName: 'Petro Additives Pvt Ltd',
    challanNo: 'PA/DC/1187', vendorInvoiceNo: 'PA/INV/2026/0092', vehicleNo: 'TN 22 CD 1190',
    receivedDate: '2026-01-16', status: 'submitted', qcRequired: false, emergencyWithoutPo: true,
    exceptionId: 'EXC-STR-2026-004',
    photos: ['drums_photo.jpg'],
    lines: [
      { id: 'grnl_004', grnId: 'grn_003', materialId: 'mat_005', materialName: 'Admixture – Polycarboxylate', receivedQty: 400, acceptedQty: 400, rejectedQty: 0, uom: 'Ltr', rate: 182, batchNo: 'ADM-LOT-557', batchTracked: true, expiryDate: '2026-06-30', qcStatus: 'accepted', overReceiptPct: 0 },
    ],
    createdBy: 'usr_sk_004', createdAt: '2026-01-16T14:05:00Z',
    gateChecks: [
      { cp: 'CP-STR-01', name: 'Emergency receipt without PO', status: 'exception', message: 'Exception EXC-STR-2026-004 raised with evidence; regularisation by Site Manager pending' },
    ],
  },
  {
    id: 'grn_004', grnNo: 'GRN-2026-0238', storeId: 'store_yd_b', storeName: 'Steel Yard — Riverside Block B',
    transferId: 'trf_001', poId: undefined, vendorId: 'internal', vendorName: 'Central Warehouse — Chennai (transfer)',
    challanNo: 'TRF-2026-0031', vendorInvoiceNo: '—', vehicleNo: 'TN 25 EF 3390',
    receivedDate: '2026-01-15', status: 'posted', qcRequired: false,
    photos: [],
    lines: [
      { id: 'grnl_005', grnId: 'grn_004', materialId: 'mat_001', materialName: 'Steel TMT 16mm', receivedQty: 40, acceptedQty: 39.2, rejectedQty: 0.8, uom: 'MT', rate: 56050, batchNo: 'HEAT-JSW-4410', batchTracked: true, qcStatus: 'accepted', overReceiptPct: 0 },
    ],
    createdBy: 'usr_sk_003', createdAt: '2026-01-15T16:30:00Z', approvedBy: 'usr_pm_001',
    postedAt: '2026-01-15T17:10:00Z', postingRef: 'JV-2026-0409',
    gateChecks: [
      { cp: 'CP-STR-01', name: 'GRN against approved transfer request', status: 'pass' },
      { cp: 'CP-STR-05', name: 'Receipt confirmation within N days', status: 'pass', message: 'Confirmed on dispatch+1 d; short 0.8 MT booked via discrepancy note' },
    ],
  },
  {
    id: 'grn_005', grnNo: 'GRN-2026-0239', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai',
    poId: 'po_2026_0139', poNo: 'PO-2026-0139', vendorId: 'vend_088', vendorName: 'National Bitumen Traders',
    challanNo: 'NBT/WO/5521', vendorInvoiceNo: 'NBT/INV/2026/0210', vehicleNo: 'AP 09 ZX 1123',
    ewayBillNo: '3709ZX1123000771', receivedDate: '2026-01-16', status: 'rejected', qcRequired: true,
    photos: ['seal_broken.jpg'],
    lines: [
      { id: 'grnl_006', grnId: 'grn_005', poLineId: 'pol_870', materialId: 'mat_004', materialName: 'Bitumen VG-30', receivedQty: 18, acceptedQty: 0, rejectedQty: 18, uom: 'MT', rate: 48900, batchNo: 'BIT-DRUM-118', batchTracked: true, qcStatus: 'rejected', overReceiptPct: 0 },
    ],
    createdBy: 'usr_sk_001', createdAt: '2026-01-16T11:15:00Z',
    gateChecks: [
      { cp: 'CP-STR-02', name: 'QC rejection', status: 'fail', message: 'Broken drum seals — full rejection, return-to-vendor note RTV-2026-0012 raised' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Issues (inv_issues + inv_issue_lines) — sections 5.4, 5.12, 5.13
// ──────────────────────────────────────────────────────────────────────────────

export const issues: InvIssue[] = [
  {
    id: 'iss_001', issueNo: 'ISS-2026-0512', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai',
    issuedToType: 'activity', issuedTo: 'RCC M30 in Columns (G+F) — WA-2026-0142',
    requestRef: 'MR-PRJ001-0256', date: '2026-01-16', status: 'issued',
    acknowledgement: 'otp', acknowledgedBy: 'Suresh Engineer (Site)', acknowledgedAt: '2026-01-16T08:22:00Z',
    lines: [
      { id: 'isl_001', issueId: 'iss_001', materialId: 'mat_002', materialName: 'OPC 53 Grade Cement', qty: 315, uom: 'Bag', rate: 355, activityId: 'act_006', activityName: 'RCC M30 in Columns (G+F)', wbsNodeCode: '1.1.2', costCode: 'CC-MAT-CON', waNo: 'WA-2026-0142', waBalanceQty: 400, chargeableToSubcontractor: false, suggestedBatch: 'WK-2026-02 (FEFO)' },
      { id: 'isl_002', issueId: 'iss_001', materialId: 'mat_001', materialName: 'Steel TMT 16mm', qty: 3.7, uom: 'MT', rate: 56200, activityId: 'act_006', activityName: 'RCC M30 in Columns (G+F)', wbsNodeCode: '1.1.2', costCode: 'CC-MAT-CON', waNo: 'WA-2026-0142', waBalanceQty: 1.84, chargeableToSubcontractor: false, suggestedBatch: 'HEAT-TATA-8842' },
    ],
    createdBy: 'usr_sk_001', createdAt: '2026-01-16T08:05:00Z', postedAt: '2026-01-16T08:22:00Z', postingRef: 'JV-2026-0413',
    gateChecks: [
      { cp: 'CP-STR-03', name: 'Active WA line + receiver OTP acknowledgement', status: 'pass' },
      { cp: 'CP-STR-04', name: 'Issue qty ≤ WA balance', status: 'warn', message: 'Steel line exceeds WA balance by 1.86 MT — excess-consumption exception EXC-STR-2026-005 captured' },
      { cp: 'CP-STR-04', name: 'Negative stock block', status: 'pass' },
    ],
  },
  {
    id: 'iss_002', issueNo: 'ISS-2026-0513', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai',
    issuedToType: 'subcontractor', issuedTo: 'Arjun Infra (Subcontract SCK-2025-018)',
    requestRef: 'PLAN-2026-0116-L4', date: '2026-01-16', status: 'issued',
    acknowledgement: 'signature', acknowledgedBy: 'Foreman — Arjun Infra', acknowledgedAt: '2026-01-16T10:12:00Z',
    lines: [
      { id: 'isl_003', issueId: 'iss_002', materialId: 'mat_006', materialName: 'Bricks (Red Clay)', qty: 5000, uom: 'Nos', rate: 7.5, activityId: 'act_011', activityName: 'Brickwork 230mm wall', wbsNodeCode: '1.2.3', costCode: 'CC-MAT-MAS', waNo: 'WA-2026-0139', waBalanceQty: 8000, chargeableToSubcontractor: true, recoveryRate: 8.25 },
    ],
    createdBy: 'usr_sk_001', createdAt: '2026-01-16T09:50:00Z', postedAt: '2026-01-16T10:12:00Z', postingRef: 'JV-2026-0415',
    gateChecks: [
      { cp: 'CP-STR-03', name: 'Chargeable free-issue flagged for Part 46 recovery', status: 'pass', message: '₹41,250 recovery queued for next RA bill deduction' },
    ],
  },
  {
    id: 'iss_003', issueNo: 'ISS-2026-0514', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower',
    issuedToType: 'employee', issuedTo: 'HSE Cell — PPE kit issue (Part 55)',
    requestRef: 'MR-PRJ001-0258', date: '2026-01-16', status: 'requested',
    acknowledgement: 'none',
    lines: [
      { id: 'isl_004', issueId: 'iss_003', materialId: 'mat_ppe_01', materialName: 'Safety Harness Full-Body', qty: 12, uom: 'Nos', rate: 1450, activityId: 'act_004', activityName: 'Facade works Level 6', wbsNodeCode: '1.3.1', costCode: 'CC-SAFETY', waNo: 'WA-2026-0145', waBalanceQty: 12, chargeableToSubcontractor: false },
    ],
    createdBy: 'usr_eng_001', createdAt: '2026-01-16T13:30:00Z',
    gateChecks: [
      { cp: 'CP-STR-03', name: 'Issue against approved requisition', status: 'pass' },
      { cp: 'CP-STR-04', name: 'Accepted stock availability', status: 'pending', message: 'Awaiting approval — 12 nos available, 0 reserved' },
    ],
  },
  {
    id: 'iss_004', issueNo: 'ISS-2026-0515', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1',
    issuedToType: 'activity', issuedTo: 'Batch B-2026-0116-07 (Part 109 plant cycle)',
    requestRef: 'BATCH-B-0116-07', date: '2026-01-16', status: 'issued',
    acknowledgement: 'otp', acknowledgedBy: 'Plant Operator', acknowledgedAt: '2026-01-16T12:01:00Z',
    lines: [
      { id: 'isl_005', issueId: 'iss_004', materialId: 'mat_002', materialName: 'OPC 53 Grade Cement', qty: 84, uom: 'Bag', rate: 355, activityId: 'act_021', activityName: 'RMC production M30', wbsNodeCode: '2.1.1', costCode: 'CC-PLANT', waNo: 'WA-2026-0151', waBalanceQty: 168, chargeableToSubcontractor: false, suggestedBatch: 'WK-2026-02 (FEFO)' },
    ],
    createdBy: 'usr_sk_004', createdAt: '2026-01-16T12:00:00Z', postedAt: '2026-01-16T12:01:00Z', postingRef: 'JV-2026-0417',
    gateChecks: [
      { cp: 'CP-STR-04', name: 'Stock availability checked before batch posts (section 5.15)', status: 'pass' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Returns, Transfers, Adjustments, PV
// ──────────────────────────────────────────────────────────────────────────────

export const returns: InvReturn[] = [
  {
    id: 'ret_001', returnNo: 'MRS-2026-0088', type: 'site_to_store', storeId: 'store_cw1',
    storeName: 'Central Warehouse — Chennai', fromHolder: 'WA-2026-0138 (closed 2026-01-15)',
    issueRef: 'ISS-2026-0498', date: '2026-01-16', status: 'posted', reasonCode: 'UNUSED_WA_CLOSURE',
    lines: [{ id: 'rtl_001', materialName: 'OPC 53 Grade Cement', qty: 45, uom: 'Bag', rate: 355, batchNo: 'WK-2026-02' }],
    gateChecks: [{ cp: 'CP-STR-06', name: 'Returned within 24 h of WA closure', status: 'pass', message: 'Returned 6 h after closure' }],
  },
  {
    id: 'ret_002', returnNo: 'RTV-2026-0012', type: 'to_vendor', storeId: 'store_cw1',
    storeName: 'Central Warehouse — Chennai', fromHolder: 'National Bitumen Traders',
    grnRef: 'GRN-2026-0239', date: '2026-01-16', status: 'submitted', reasonCode: 'QC_REJECTION',
    lines: [{ id: 'rtl_002', materialName: 'Bitumen VG-30', qty: 18, uom: 'MT', rate: 48900, batchNo: 'BIT-DRUM-118' }],
    gateChecks: [
      { cp: 'CP-STR-02', name: 'Rejected qty routed to return-to-vendor note', status: 'pass' },
      { cp: 'Gate pass (Part 106)', name: 'Outgoing material needs valid gate pass', status: 'pending', message: 'Printed gate pass GP-2026-0451 used until Part 106 goes live' },
    ],
  },
  {
    id: 'ret_003', returnNo: 'MRS-2026-0089', type: 'site_to_store', storeId: 'store_rt_a',
    storeName: 'Block A Site Store — Riverside Tower', fromHolder: 'Block B slab crew',
    issueRef: 'ISS-2026-0501', date: '2026-01-16', status: 'draft', reasonCode: 'OVER_ISSUE_SAME_DAY',
    lines: [{ id: 'rtl_003', materialName: 'Bricks (Red Clay)', qty: 800, uom: 'Nos', rate: 7.5 }],
    gateChecks: [{ cp: 'CP-STR-06', name: 'Return slip capture', status: 'warn', message: 'Draft — submit before WA-2026-0140 closure audit' }],
  },
];

export const transfers: InvTransfer[] = [
  {
    id: 'trf_001', transferNo: 'TRF-2026-0031', fromStoreId: 'store_cw1', fromStoreName: 'Central Warehouse — Chennai',
    toStoreId: 'store_yd_b', toStoreName: 'Steel Yard — Riverside Block B',
    dispatchDate: '2026-01-14', receiptDate: '2026-01-15', transitDays: 1, status: 'received',
    gatePassNo: 'GP-2026-0448', vehicleNo: 'TN 25 EF 3390', ewayBillNo: '3725EF339000231',
    pricingBasis: 'book_value', discrepancyNote: 'Short 0.8 MT (weighbridge diff) — booked TRANSFER_IN 39.2 MT, variance adjustment ADJ-2026-0021 approved',
    lines: [{ id: 'trl_001', materialName: 'Steel TMT 16mm', qty: 40, uom: 'MT', bookRate: 56050, receivedQty: 39.2 }],
    createdBy: 'usr_sk_001',
    gateChecks: [
      { cp: 'CP-STR-05', name: 'Approved transfer request + gate pass', status: 'pass' },
      { cp: 'CP-STR-05', name: 'Receiving acknowledgement within 3 days', status: 'pass' },
    ],
  },
  {
    id: 'trf_002', transferNo: 'TRF-2026-0032', fromStoreId: 'store_cw1', fromStoreName: 'Central Warehouse — Chennai',
    toStoreId: 'store_rt_a', toStoreName: 'Block A Site Store — Riverside Tower',
    dispatchDate: '2026-01-15', transitDays: 1, status: 'in_transit',
    gatePassNo: 'GP-2026-0450', vehicleNo: 'TN 07 GH 5512',
    pricingBasis: 'book_value',
    lines: [
      { id: 'trl_002', materialName: 'Waterproofing Membrane 4mm', qty: 850, uom: 'Sqft', bookRate: 138 },
      { id: 'trl_003', materialName: 'Admixture – Polycarboxylate', qty: 200, uom: 'Ltr', bookRate: 182 },
    ],
    createdBy: 'usr_sk_001',
    gateChecks: [
      { cp: 'CP-STR-05', name: 'Receiving acknowledgement pending', status: 'warn', message: 'Day 1 of 3 — reminder sent to both stores' },
    ],
  },
  {
    id: 'trf_003', transferNo: 'TRF-2026-0033', fromStoreId: 'store_rt_a', fromStoreName: 'Block A Site Store — Riverside Tower',
    toStoreId: 'store_pl_1', toStoreName: 'Plant Store — Batching Plant 1',
    dispatchDate: '2026-01-11', transitDays: 5, status: 'in_transit',
    gatePassNo: undefined, vehicleNo: 'TN 41 PQ 7788', pricingBasis: 'book_value',
    discrepancyNote: 'No gate pass captured — recorded as gate-pass violation (section 5.17)',
    lines: [{ id: 'trl_004', materialName: 'Diesel (HSD)', qty: 600, uom: 'Ltr', bookRate: 92.4 }],
    createdBy: 'usr_sk_002',
    gateChecks: [
      { cp: 'CP-STR-05', name: 'Gate pass required for outgoing material', status: 'fail', message: 'Gate-pass violation logged; escalated L2 to Site Manager' },
      { cp: 'CP-STR-05', name: 'Acknowledgement within 3 days', status: 'fail', message: 'In transit 5 days — escalation fired to both stores' },
    ],
  },
];

export const adjustments: InvAdjustment[] = [
  {
    id: 'adj_001', adjNo: 'ADJ-2026-0021', storeId: 'store_yd_b', storeName: 'Steel Yard — Riverside Block B',
    reason: 'shortage', date: '2026-01-15', status: 'posted', maker: 'usr_sk_003 (Store Keeper)',
    checker: 'usr_pm_001 (Project Manager)', comment: 'Weighbridge difference on TRF-2026-0031 receipt — 0.8 MT write-off approved',
    lines: [{ id: 'adl_001', materialName: 'Steel TMT 16mm', qtyChange: -0.8, uom: 'MT', rate: 56050, valueChange: -44840 }],
    postingRef: 'JV-2026-0410',
    gateChecks: [
      { cp: 'CP-STR-08', name: 'Maker-checker SoD', status: 'pass' },
      { cp: 'PC-7', name: 'Reason code mandatory', status: 'pass', message: 'SHORTAGE / weighbridge variance evidence attached' },
    ],
  },
  {
    id: 'adj_002', adjNo: 'ADJ-2026-0022', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower',
    reason: 'damage', date: '2026-01-16', status: 'submitted', maker: 'usr_sk_002 (Store Keeper)',
    comment: '26 bags cement set due to tarpaulin failure during rain — claim filed with insurer',
    lines: [{ id: 'adl_002', materialName: 'OPC 53 Grade Cement', qtyChange: -26, uom: 'Bag', rate: 355, valueChange: -9230 }],
    gateChecks: [
      { cp: 'CP-STR-08', name: 'Checker approval pending', status: 'pending', message: 'Store In-charge ≠ maker enforced; SLA 24 h' },
    ],
  },
  {
    id: 'adj_003', adjNo: 'ADJ-2026-0023', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai',
    reason: 'expiry', date: '2026-01-16', status: 'draft', maker: 'usr_sk_001 (Store Keeper)',
    comment: 'Admixture lot ADM-LOT-556 expires 2026-01-28 — propose write-down or redeploy',
    lines: [{ id: 'adl_003', materialName: 'Admixture – Polycarboxylate', qtyChange: -620, uom: 'Ltr', rate: 182, valueChange: -112840 }],
    gateChecks: [{ cp: 'PC-5', name: 'Evidence required before submission', status: 'pending', message: 'Attach expiry certificate + disposal plan' }],
  },
];

export const physicalVerifications: PhysicalVerification[] = [
  {
    id: 'pv_001', pvNo: 'PV-2026-0004', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai',
    date: '2026-01-15', type: 'full', status: 'posted', controlledMaterialsOnly: false,
    varianceValue: -58070, investigationNote: 'Steel rack recount confirmed 0.8 MT shortage (see ADJ-2026-0021); cement variance within ±0.5 % tolerance',
    blocksPeriodClose: false, approvedBy: 'usr_pm_001 + usr_acc_001',
    feedsReconciliation: 'MRS-2026-01 (Jan) closing physical stock — Part 92',
    lines: [
      { id: 'pvl_001', materialName: 'Steel TMT 16mm', systemQty: 129.3, countedQty: 128.5, uom: 'MT', variance: -0.8, rate: 56200 },
      { id: 'pvl_002', materialName: 'OPC 53 Grade Cement', systemQty: 1458, countedQty: 1450, uom: 'Bag', variance: -8, rate: 355 },
      { id: 'pvl_003', materialName: 'Bitumen VG-30', systemQty: 36, countedQty: 36, uom: 'MT', variance: 0, rate: 48900 },
    ],
  },
  {
    id: 'pv_002', pvNo: 'PV-2026-0005', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower',
    date: '2026-01-16', type: 'cycle', status: 'submitted', controlledMaterialsOnly: true,
    varianceValue: -14320,
    lines: [
      { id: 'pvl_004', materialName: 'OPC 53 Grade Cement', systemQty: 1126, countedQty: 1100, uom: 'Bag', variance: -26, rate: 355 },
      { id: 'pvl_005', materialName: 'Bricks (Red Clay)', systemQty: 42000, countedQty: 42000, uom: 'Nos', variance: 0, rate: 7.5 },
    ],
    gateChecksPending: undefined as unknown as undefined,
  } as unknown as PhysicalVerification,
  {
    id: 'pv_003', pvNo: 'PV-2026-0006', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1',
    date: '2026-01-10', type: 'cycle', status: 'open', controlledMaterialsOnly: true, varianceValue: 0,
    blocksPeriodClose: true,
    lines: [
      { id: 'pvl_006', materialName: 'Diesel (HSD)', systemQty: 4200, countedQty: 0, uom: 'Ltr', variance: -4200, rate: 92.4 },
      { id: 'pvl_007', materialName: 'OPC 53 Grade Cement', systemQty: 0, countedQty: 0, uom: 'Bag', variance: 0, rate: 355 },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Reorder rules (inv_reorder_rules) — section 5.8
// ──────────────────────────────────────────────────────────────────────────────

export const reorderRules: ReorderRule[] = [
  { id: 'ror_001', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai', materialId: 'mat_002', materialName: 'OPC 53 Grade Cement', min: 800, max: 3000, reorderQty: 1600, leadTimeDays: 2, currentStock: 1450, status: 'ok' },
  { id: 'ror_002', storeId: 'store_cw1', storeName: 'Central Warehouse — Chennai', materialId: 'mat_001', materialName: 'Steel TMT 16mm', min: 60, max: 250, reorderQty: 100, leadTimeDays: 5, currentStock: 128.5, status: 'ok' },
  { id: 'ror_003', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower', materialId: 'mat_012', materialName: 'Waterproofing Membrane 4mm', min: 400, max: 1500, reorderQty: 800, leadTimeDays: 4, currentStock: 0, status: 'alert_raised' },
  { id: 'ror_004', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1', materialId: 'mat_011', materialName: 'Tower Crane Wire Rope 18mm', min: 1, max: 4, reorderQty: 2, leadTimeDays: 21, currentStock: 2, status: 'below_min' },
  { id: 'ror_005', storeId: 'store_rt_a', storeName: 'Block A Site Store — Riverside Tower', materialId: 'mat_005', materialName: 'Admixture – Polycarboxylate', min: 300, max: 1200, reorderQty: 600, leadTimeDays: 3, currentStock: 620, status: 'draft_pr_created', draftPrNo: 'PR-DRAFT-2026-0091' },
  { id: 'ror_006', storeId: 'store_pl_1', storeName: 'Plant Store — Batching Plant 1', materialId: 'mat_010', materialName: 'Diesel (HSD)', min: 2000, max: 8000, reorderQty: 4000, leadTimeDays: 1, currentStock: 4200, status: 'ok' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Stock ledger sample (append-only) — section 5.3
// ──────────────────────────────────────────────────────────────────────────────

export const ledgerSample: LedgerEntry[] = [
  { id: 'led_901', date: '2026-01-01', storeName: 'Central Warehouse — Chennai', materialName: 'Steel TMT 16mm', txnType: 'OPENING', txnRef: 'MAP-2025-12', qtyIn: 82.4, qtyOut: 0, rate: 55800, balanceQty: 82.4, balanceValue: 4597920 },
  { id: 'led_902', date: '2026-01-16', storeName: 'Central Warehouse — Chennai', materialName: 'Steel TMT 16mm', txnType: 'GRN', txnRef: 'GRN-2026-0235', qtyIn: 58.4, qtyOut: 0, rate: 56200, balanceQty: 140.8, balanceValue: 7872640, postingRef: 'JV-2026-0412' },
  { id: 'led_903', date: '2026-01-15', storeName: 'Steel Yard — Riverside Block B', materialName: 'Steel TMT 16mm', txnType: 'TRANSFER_IN', txnRef: 'TRF-2026-0031', qtyIn: 39.2, qtyOut: 0, rate: 56050, balanceQty: 39.2, balanceValue: 2197160, postingRef: 'JV-2026-0409' },
  { id: 'led_904', date: '2026-01-15', storeName: 'Steel Yard — Riverside Block B', materialName: 'Steel TMT 16mm', txnType: 'ADJUSTMENT', txnRef: 'ADJ-2026-0021', qtyIn: 0, qtyOut: 0.8, rate: 56050, balanceQty: 38.4, balanceValue: 2152320, postingRef: 'JV-2026-0410' },
  { id: 'led_905', date: '2026-01-16', storeName: 'Central Warehouse — Chennai', materialName: 'Steel TMT 16mm', txnType: 'TRANSFER_OUT', txnRef: 'TRF-2026-0031', qtyIn: 0, qtyOut: 40, rate: 56050, balanceQty: 100.8, balanceValue: 5630400 },
  { id: 'led_906', date: '2026-01-16', storeName: 'Central Warehouse — Chennai', materialName: 'Steel TMT 16mm', txnType: 'ISSUE', txnRef: 'ISS-2026-0512', qtyIn: 0, qtyOut: 3.7, rate: 56200, balanceQty: 97.1, balanceValue: 5457020, wbsNodeCode: '1.1.2', activityName: 'RCC M30 in Columns (G+F)', costCode: 'CC-MAT-CON', postingRef: 'JV-2026-0413' },
  { id: 'led_907', date: '2026-01-16', storeName: 'Central Warehouse — Chennai', materialName: 'OPC 53 Grade Cement', txnType: 'GRN', txnRef: 'GRN-2026-0234', qtyIn: 300, qtyOut: 0, rate: 355, balanceQty: 1450, balanceValue: 514750, note: 'qty held in QC — ledger shows accepted stock only' },
  { id: 'led_908', date: '2026-01-16', storeName: 'Central Warehouse — Chennai', materialName: 'OPC 53 Grade Cement', txnType: 'ISSUE', txnRef: 'ISS-2026-0512', qtyIn: 0, qtyOut: 315, rate: 355, balanceQty: 1050, balanceValue: 372750, wbsNodeCode: '1.1.2', activityName: 'RCC M30 in Columns (G+F)', costCode: 'CC-MAT-CON', postingRef: 'JV-2026-0413' },
  { id: 'led_909', date: '2026-01-16', storeName: 'Central Warehouse — Chennai', materialName: 'OPC 53 Grade Cement', txnType: 'RETURN', txnRef: 'MRS-2026-0088', qtyIn: 45, qtyOut: 0, rate: 355, balanceQty: 1095, balanceValue: 388725 },
  { id: 'led_910', date: '2026-01-16', storeName: 'Plant Store — Batching Plant 1', materialName: 'OPC 53 Grade Cement', txnType: 'ISSUE', txnRef: 'ISS-2026-0515', qtyIn: 0, qtyOut: 84, rate: 355, balanceQty: 84, balanceValue: 29820, wbsNodeCode: '2.1.1', activityName: 'RMC production M30', costCode: 'CC-PLANT', postingRef: 'JV-2026-0417' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Material control ledger per WA + activity (section 5.12)
// ──────────────────────────────────────────────────────────────────────────────

export const materialControlLedger: MaterialControlRow[] = [
  { waNo: 'WA-2026-0142', activityName: 'RCC M30 in Columns (G+F)', materialName: 'OPC 53 Grade Cement', authorisedQty: 472.5, issuedQty: 450, consumedQty: 441, returnedQty: 9, wastageQty: 0, pendingReturnQty: 0, variancePct: -2.0 },
  { waNo: 'WA-2026-0142', activityName: 'RCC M30 in Columns (G+F)', materialName: 'Steel TMT 16mm', authorisedQty: 5.54, issuedQty: 3.7, consumedQty: 3.62, returnedQty: 0, wastageQty: 0.08, pendingReturnQty: 0, variancePct: -33.6 },
  { waNo: 'WA-2026-0139', activityName: 'Brickwork 230mm wall', materialName: 'Bricks (Red Clay)', authorisedQty: 12000, issuedQty: 11500, consumedQty: 10800, returnedQty: 500, wastageQty: 200, pendingReturnQty: 0, variancePct: -10.0 },
  { waNo: 'WA-2026-0138', activityName: 'Slab casting Level 3', materialName: 'OPC 53 Grade Cement', authorisedQty: 630, issuedQty: 630, consumedQty: 585, returnedQty: 45, wastageQty: 0, pendingReturnQty: 0, variancePct: -7.1 },
  { waNo: 'WA-2026-0140', activityName: 'Column shuttering Level 4', materialName: 'Waterproofing Membrane 4mm', authorisedQty: 300, issuedQty: 260, consumedQty: 248, returnedQty: 0, wastageQty: 12, pendingReturnQty: 12, variancePct: -13.3 },
  { waNo: 'WA-2026-0151', activityName: 'RMC production M30', materialName: 'OPC 53 Grade Cement', authorisedQty: 336, issuedQty: 168, consumedQty: 168, returnedQty: 0, wastageQty: 0, pendingReturnQty: 0, variancePct: 0 },
];

// Reservations against WA lines (section 5.13)
export const waReservations: WaIntegrationRow[] = [
  { waNo: 'WA-2026-0142', materialName: 'OPC 53 Grade Cement', authorisedQty: 472.5, reservedQty: 400, issuedQty: 450, balanceQty: 22.5, reservationStatus: 'consumed' },
  { waNo: 'WA-2026-0145', materialName: 'Safety Harness Full-Body', authorisedQty: 12, reservedQty: 12, issuedQty: 0, balanceQty: 12, reservationStatus: 'reserved' },
  { waNo: 'WA-2026-0151', materialName: 'OPC 53 Grade Cement', authorisedQty: 336, reservedQty: 84, issuedQty: 84, balanceQty: 168, reservationStatus: 'released' },
  { waNo: 'WA-2026-0144', activityName: '', materialName: 'Ready Mix Concrete M30', authorisedQty: 45, reservedQty: 18, issuedQty: 0, balanceQty: 27, reservationStatus: 'reserved' },
].map(r => ({ ...r, activityName: undefined as never })) as unknown as WaIntegrationRow[];

// ──────────────────────────────────────────────────────────────────────────────
// Finance postings (section 5.11) — money only through posting engine (SA-14)
// ──────────────────────────────────────────────────────────────────────────────

export const financePostings: FinancePosting[] = [
  { id: 'fp_001', date: '2026-01-16', sourceDoc: 'GRN-2026-0235', docType: 'GRN', debitAccount: '1400 · Inventory — Raw Material', creditAccount: '2110 · GRN In Transit / Payables', amount: 4738080, projectCode: 'RTP2', status: 'posted' },
  { id: 'fp_002', date: '2026-01-16', sourceDoc: 'ISS-2026-0512', docType: 'ISSUE', debitAccount: '5100 · Project Cost WIP — Materials', creditAccount: '1400 · Inventory — Raw Material', amount: 2198690, projectCode: 'RTP2', status: 'posted' },
  { id: 'fp_003', date: '2026-01-16', sourceDoc: 'ISS-2026-0513', docType: 'ISSUE (chargeable)', debitAccount: '5100 · Project Cost WIP → Subcontract Recovery', creditAccount: '1400 · Inventory — Raw Material', amount: 37500, projectCode: 'RTP2', status: 'posted' },
  { id: 'fp_004', date: '2026-01-15', sourceDoc: 'ADJ-2026-0021', docType: 'ADJUSTMENT', debitAccount: '6900 · Stock Loss / Shrinkage', creditAccount: '1400 · Inventory — Raw Material', amount: 44840, projectCode: 'RTP2', status: 'posted' },
  { id: 'fp_005', date: '2026-01-15', sourceDoc: 'TRF-2026-0031', docType: 'TRANSFER (inter-project)', debitAccount: '1400 · Inventory — Riverside', creditAccount: '1400 · Inventory — Central', amount: 2242000, status: 'posted' },
  { id: 'fp_006', date: '2026-01-16', sourceDoc: 'PV-2026-0004', docType: 'PV VARIANCE', debitAccount: '6900 · Stock Loss / Shrinkage', creditAccount: '1400 · Inventory — Raw Material', amount: 58070, status: 'pending' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 6/7 — roles & permissions (registered in Part 5 permission registry)
// ──────────────────────────────────────────────────────────────────────────────

export const rolePermissions: RolePermission[] = [
  { key: 'stores.grn.create', role: 'Store Keeper', description: 'Create GRN (maker)', scopeLevels: 'company·branch·dept·project·site·module·txn·field·limit·doc', approvalLimit: '—' },
  { key: 'stores.grn.approve', role: 'Site Manager / Store In-charge', description: 'Approve & post GRN (checker)', scopeLevels: 'project·site·doc', approvalLimit: '₹ 5,000,000 per GRN' },
  { key: 'stores.issue.create', role: 'Store Keeper', description: 'Create & post issue slips', scopeLevels: 'site·txn', approvalLimit: '≤ WA balance else exception' },
  { key: 'stores.issue.request', role: 'Site Engineer', description: 'Raise material request against WA/daily plan', scopeLevels: 'project·site·doc', approvalLimit: '—' },
  { key: 'stores.adjustment.approve', role: 'Project Manager + Accounts', description: 'Approve stock adjustments (parallel, maker ≠ checker)', scopeLevels: 'project·site·txn', approvalLimit: '₹ 250,000 value change' },
  { key: 'stores.pv.approve', role: 'Project Manager + Accounts', description: 'Approve physical verification variances', scopeLevels: 'project·site·doc', approvalLimit: 'variance ≤ 0.5 % value' },
  { key: 'stores.valuation.view', role: 'Stores lead / Accounts / PM', description: 'View rates & stock values (masked elsewhere)', scopeLevels: 'field-level mask: UI·API·exports·search·notifications·chat·AI context' },
];

export const sodRules = [
  { id: 'SOD-STR-01', rule: 'GRN maker ≠ approver (stores.grn.create ⊥ stores.grn.approve)', enforcement: 'BLOCK' },
  { id: 'SOD-STR-02', rule: 'Adjustment maker (Store Keeper) ≠ checker (Store In-charge / PM) — CP-STR-08', enforcement: 'BLOCK' },
  { id: 'SOD-STR-03', rule: 'PV counter ≠ PV approver; variance approval needs PM + Accounts', enforcement: 'BLOCK / EXCEPTION' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 8A — protocol control points (seeded OBSERVE, PC-13 rollout)
// ──────────────────────────────────────────────────────────────────────────────

export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-STR-01', stage: 'RECORD', control: 'GRN only against approved PO/transfer (or emergency exception) with challan photo, vehicle no., batch/heat no.', enforcement: 'EXCEPTION', evidence: 'PC-5: challan + material photos, vehicle, heat no.', escalation: 'L2', mode: 'OBSERVE' },
  { id: 'CP-STR-02', stage: 'VERIFY', control: 'Over-receipt beyond 2 % blocked; QC-required materials held until accepted', enforcement: 'BLOCK / EXCEPTION', evidence: 'QC status (Part 52 IR)', escalation: 'L2', mode: 'OBSERVE' },
  { id: 'CP-STR-03', stage: 'EXECUTE', control: 'Issue only against active WA line or approved requisition, to activity/cost code, with receiver acknowledgement (OTP/signature)', enforcement: 'EXCEPTION (EXCESS_CONSUMPTION / UNPLANNED_WORK)', evidence: 'WA ref + ack record', escalation: 'L2 → L3', mode: 'OBSERVE' },
  { id: 'CP-STR-04', stage: 'VERIFY', control: 'Issue quantity ≤ WA balance; no negative stock', enforcement: 'BLOCK (negative) / EXCEPTION (over WA)', evidence: 'balances snapshot', escalation: 'L2', mode: 'OBSERVE' },
  { id: 'CP-STR-05', stage: 'EXECUTE', control: 'Transfers need approved transfer request, gate pass and receiving acknowledgement within N days', enforcement: 'EXCEPTION', evidence: 'gate pass no. + ack', escalation: 'L2', mode: 'OBSERVE' },
  { id: 'CP-STR-06', stage: 'RECORD', control: 'Unused material returned at WA closure within 24 h', enforcement: 'WARN → MONITOR (DR-02)', evidence: 'return slip', escalation: 'L2', mode: 'OBSERVE' },
  { id: 'CP-STR-07', stage: 'RECONCILE', control: 'Monthly physical verification of controlled materials; variance > threshold needs investigation note', enforcement: 'BLOCK (period close)', evidence: 'PV sheet + investigation note', escalation: 'L2 → L3', mode: 'OBSERVE' },
  { id: 'CP-STR-08', stage: 'APPROVE', control: 'Stock adjustments maker-checker (Store Keeper ≠ Store In-charge/PM)', enforcement: 'BLOCK', evidence: 'SoD matrix', escalation: 'L2', mode: 'OBSERVE' },
  { id: 'CP-STR-09', stage: 'MONITOR', control: 'Slow/dead stock, repeated shortages (DR-03/17)', enforcement: 'MONITOR', evidence: 'findings register', escalation: 'L2', mode: 'OBSERVE' },
];

export const protocolStats = {
  registered: protocolControlPoints.length,
  inObserve: protocolControlPoints.filter(c => c.mode === 'OBSERVE').length,
  evaluationsToday: 148,
  passes: 131,
  warns: 9,
  exceptionsRaised: 6,
  blocks: 2,
  topFindings: [
    { cp: 'CP-STR-04', text: 'Negative-stock attempts blocked at ISS-2026-0511 (reserved qty ignored)' },
    { cp: 'CP-STR-05', text: 'Gate-pass violation on TRF-2026-0033 — escalated L2' },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// Section 14 — real-time events (outbox → queue → Socket.IO rooms, SA-8)
// ──────────────────────────────────────────────────────────────────────────────

export const socketEvents: SocketEventDef[] = [
  { event: 'stores.grn.posted', room: 'site:{siteId}, role:procurement@company:{companyId}, role:accounts@company:{companyId}', payload: '{grnNo, storeId, poNo, value, qcRequired}', description: 'GRN posted — invoice matching triggered' },
  { event: 'stores.issue.posted', room: 'site:{siteId}, doc:WorkAuthorisation:{waId}', payload: '{issueNo, waNo, activityId, value}', description: 'Issue posted — WA balance updated' },
  { event: 'stores.transfer.dispatched', room: 'site:{fromSiteId}, site:{toSiteId}', payload: '{transferNo, fromStore, toStore, eta}', description: 'Dispatch out of store' },
  { event: 'stores.transfer.received', room: 'site:{fromSiteId}, site:{toSiteId}', payload: '{transferNo, receivedQty, discrepancy}', description: 'Receipt confirmation closes in-transit' },
  { event: 'stores.stock.below_reorder', room: 'role:store_keeper@site:{siteId}, role:procurement@company:{companyId}', payload: '{storeId, materialId, currentStock, reorderQty}', description: 'Min/max breach → alert + draft PR' },
  { event: 'stores.stock.negative_attempt', room: 'site:{siteId}, role:protocol_officer@company:{companyId}', payload: '{storeId, materialId, attemptedQty, actor}', description: 'Blocked negative-stock attempt (no qty/rate values in payload)' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 15 — API surface (v1 additive; existing contracts untouched)
// ──────────────────────────────────────────────────────────────────────────────

export const apiRoutes: ApiRoute[] = [
  { method: 'GET', path: '/api/v1/stores/grns', permission: 'stores.grn.create|approve', notes: 'paginated, filterable (store/status/po), optimistic version field' },
  { method: 'POST', path: '/api/v1/stores/grns', permission: 'stores.grn.create', notes: 'Idempotency-Key mandatory; protocol.check() inside transaction' },
  { method: 'POST', path: '/api/v1/stores/grns/{id}/post', permission: 'stores.grn.approve', notes: 'posting + outbox + GL in one transaction; 409 on version mismatch' },
  { method: 'GET/POST', path: '/api/v1/stores/issues', permission: 'stores.issue.create / stores.issue.request', notes: 'server re-validates WA balance & accepted stock' },
  { method: 'GET/POST', path: '/api/v1/stores/returns', permission: 'stores.issue.create', notes: 'site→store and →vendor types' },
  { method: 'GET/POST', path: '/api/v1/stores/transfers', permission: 'stores.issue.create', notes: 'dispatch/receive endpoints; in-transit store posting' },
  { method: 'GET/POST', path: '/api/v1/stores/adjustments', permission: 'stores.adjustment.approve', notes: 'maker-checker enforced server-side' },
  { method: 'GET/POST', path: '/api/v1/stores/physical-verifications', permission: 'stores.pv.approve', notes: 'mobile count mode submits counted lines' },
  { method: 'GET', path: '/api/v1/stores/stock?store=&material=', permission: '(any stores member)', notes: 'rates masked without stores.valuation.view' },
  { method: 'GET', path: '/api/v1/stores/ledger?…', permission: '(scoped read)', notes: 'append-only projection; server-side pagination' },
  { method: 'GET', path: '/api/v1/stores/ageing', permission: 'stores.valuation.view', notes: '0–30/31–90/91–180/>180 buckets' },
  { method: 'POST', path: '/api/v1/stores/labels', permission: 'stores.grn.create', notes: 'QR/barcode label generation + print audit' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 16 — notifications
// ──────────────────────────────────────────────────────────────────────────────

export const notificationMatrix: NotificationDef[] = [
  { trigger: 'GRN posted', recipients: 'Procurement + Accounts (invoice matching)', level: 'Information', template: 'STR_GRN_POSTED' },
  { trigger: 'QC pending > 24 h', recipients: 'QA/QC team + Store Keeper', level: 'Action required', template: 'STR_QC_PENDING' },
  { trigger: 'Stock below reorder point', recipients: 'Store Keeper + Procurement', level: 'Warning', template: 'MAT_LOW_STOCK (existing template reused)' },
  { trigger: 'Transfer in transit > N days', recipients: 'Both store keepers + Site Managers', level: 'Warning', template: 'STR_TRANSIT_AGING' },
  { trigger: 'Negative stock attempt blocked', recipients: 'Actor + protocol officer', level: 'Critical', template: 'STR_NEGATIVE_BLOCKED' },
  { trigger: 'Gate-pass violation on outgoing material', recipients: 'Site Manager (L2) → PM (L3)', level: 'Escalation', template: 'STR_GATEPASS_VIOLATION' },
  { trigger: 'PV variance > threshold', recipients: 'PM + Accounts', level: 'Action required', template: 'STR_PV_VARIANCE' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Sections 17/18 — report catalogue & print templates
// ──────────────────────────────────────────────────────────────────────────────

export const reports: ReportDef[] = [
  { code: 'RPT-STR-01', name: 'Stock Summary & Valuation', format: 'PDF/Excel/CSV', drillDown: 'Company → Project → Store → Material', consumers: 'PM, Accounts' },
  { code: 'RPT-STR-02', name: 'Stock Ledger', format: 'Excel/CSV', drillDown: 'Store → Material → Transaction', consumers: 'Accounts, Audit' },
  { code: 'RPT-STR-03', name: 'GRN Register', format: 'Excel/PDF', drillDown: 'Company → Store → GRN → Line', consumers: 'Procurement' },
  { code: 'RPT-STR-04', name: 'Issue Register by Activity/WBS', format: 'Excel', drillDown: 'Project → WBS → Activity → Issue', consumers: 'Site, QS' },
  { code: 'RPT-STR-05', name: 'Material Consumption (theoretical vs actual)', format: 'PDF/Excel', drillDown: 'WA → Activity → Material → DPR', consumers: 'Part 90 reconciliation' },
  { code: 'RPT-STR-06', name: 'Transfers Register (with in-transit aging)', format: 'Excel', drillDown: 'Route → Transfer → Lines', consumers: 'Stores' },
  { code: 'RPT-STR-07', name: 'Ageing Analysis', format: 'PDF', drillDown: 'Bucket → Store → Material', consumers: 'Materials committee' },
  { code: 'RPT-STR-08', name: 'Dead Stock Report', format: 'Excel', drillDown: 'Store → Material → Last movement', consumers: 'PM, Accounts' },
  { code: 'RPT-STR-09', name: 'PV Variance Report', format: 'PDF', drillDown: 'PV → Store → Line → Adjustment', consumers: 'Part 92 reconciliation' },
  { code: 'RPT-STR-10', name: 'Reorder Report / Draft PR List', format: 'Excel', drillDown: 'Store → Rule → Material', consumers: 'Procurement (Part 34)' },
];

export const printTemplates: PrintTemplateDef[] = [
  { code: 'DOC-STR-GRN', name: 'GRN / MRN', branding: 'Letterhead + project branding', features: 'Doc no., revision, date, approval & signature blocks, QR verification, footer, page numbers, print audited' },
  { code: 'DOC-STR-ISS', name: 'Issue Slip', branding: 'Letterhead', features: 'Receiver OTP/signature block, WA ref, QR line labels' },
  { code: 'DOC-STR-GP', name: 'Gate Pass / Transfer Note', branding: 'Site gate branding', features: 'Legacy printed pass until Part 106 live; QR verified at gate' },
  { code: 'DOC-STR-RTN', name: 'Return Note', branding: 'Letterhead', features: 'Reason code + approval block' },
  { code: 'DOC-STR-PVS', name: 'Physical Verification Sheet', branding: '—', features: 'System vs counted columns, sign-off rows' },
  { code: 'DOC-STR-QRL', name: 'QR Labels', branding: '—', features: 'Material/batch/bin payloads, printable rolls' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 23 — offline support (field engine, Part 79)
// ──────────────────────────────────────────────────────────────────────────────

export const offlineOperations: OfflineOpDef[] = [
  { operation: 'GRN draft capture (scan + photos)', device: 'Mobile', queue: 'Encrypted local queue → sync → server re-validation (permissions, protocol, balances)', conflictRule: 'Server wins after approval/lock; else field-level merge with prompt; every conflict logged' },
  { operation: 'Issue by scan + receiver OTP', device: 'Mobile', queue: 'Same queue; nothing counts as posted until server confirms', conflictRule: 'Field-level merge; WA balance re-checked at sync' },
  { operation: 'Physical count mode', device: 'Tablet/Mobile', queue: 'Counted lines buffered with GPS/time/device ID', conflictRule: 'Last-write-wins per line with user prompt; log kept' },
  { operation: 'Stock lookup (read cache)', device: 'Mobile', queue: 'Read-only snapshot TTL 15 min', conflictRule: 'n/a' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 11 — DB entity map decisions (Step 1 discovery output)
// ──────────────────────────────────────────────────────────────────────────────

export const dbEntityMap: EntityMapRow[] = [
  { entity: 'inv_stores', table: 'inv_stores', decision: 'NEW', notes: 'warehouse→store→bin hierarchy incl. in_transit pseudo-store' },
  { entity: 'inv_bins', table: 'inv_bins', decision: 'NEW (optional)', notes: 'additive; blank bins allowed' },
  { entity: 'inv_grns', table: 'goods_receipt_notes_ext', decision: 'EXTEND', notes: '1:1 extension of legacy goods_receipt_notes — challan/invoice/vehicle/eway/qc fields; legacy table & API untouched' },
  { entity: 'inv_grn_lines', table: 'goods_receipt_note_items_ext', decision: 'EXTEND', notes: 'accepted/rejected qty, batch/heat, expiry, qc_status added via ext view' },
  { entity: 'inv_stock_ledger', table: 'inv_stock_ledger', decision: 'NEW', notes: 'append-only; legacy inventory table becomes a projection for old screens (golden tests must stay green)' },
  { entity: 'inv_issues / inv_issue_lines', table: 'inv_issues / inv_issue_lines', decision: 'NEW', notes: 'legacy material-issue form mapped onto new ledger' },
  { entity: 'inv_returns', table: 'inv_returns', decision: 'NEW', notes: 'site→store + to-vendor' },
  { entity: 'inv_transfers', table: 'inv_transfers', decision: 'NEW', notes: 'in-transit lifecycle + discrepancy notes' },
  { entity: 'inv_adjustments', table: 'inv_adjustments', decision: 'NEW', notes: 'reason-coded, maker-checker' },
  { entity: 'inv_physical_verifications', table: 'inv_physical_verifications', decision: 'NEW', notes: 'feeds Part 92 closing physical stock' },
  { entity: 'inv_reorder_rules', table: 'inv_reorder_rules', decision: 'NEW', notes: 'replaces broken InventoryAlert job (audit gap) with framework job' },
  { entity: 'inv_labels', table: 'inv_labels', decision: 'NEW', notes: 'QR payloads for material/batch/bin' },
];

// CONFLICTS.md entries raised during Step 1 (recorded, not resolved destructively)
export const conflictsLogged = [
  { id: 'C-STR-01', title: 'Legacy valuation is FIFO; Part 35 default is WAC', resolution: 'Preserve FIFO for all historical rows; WAC applies prospectively from 2026-01-01 per company decision MD-DEC-2025-118. No recompute of history.' },
  { id: 'C-STR-02', title: 'Existing InventoryAlert background job broken since Redis migration', resolution: 'Left untouched; new reorder job runs alongside in OBSERVE, decommission only after parity sign-off (handoff note).' },
  { id: 'C-STR-03', title: 'Legacy GRN 3-way match is UI-only (audit CI-004)', resolution: 'Server-side match added on new /v1 post route; legacy POST /api/goods-receipt behaviour unchanged (golden tests).' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 30 — dependency validation + published consumer contracts
// ──────────────────────────────────────────────────────────────────────────────

export const dependencyValidation: DependencyCheck[] = [
  { part: 'Part 11', name: 'Master Data Governance', flag: 'ff.mdm', flagState: 'ON (global)', interfaces: 'materials/vendors/uoms views, master-change events', regressionEvidence: 'test-evidence/part-11/ (green)', result: 'PASS' },
  { part: 'Part 29', name: 'Work Authorisation', flag: 'ff.wa', flagState: 'ON (project prj_001)', interfaces: 'GET /api/v1/wa/{id}/lines, wa.closed event, wa_reservations view', regressionEvidence: 'test-evidence/part-29/ (green)', result: 'PASS' },
  { part: 'Part 34', name: 'Advanced Procurement', flag: 'ff.procurement', flagState: 'OBSERVE', interfaces: 'open PO lines API, pr.draft.created event', regressionEvidence: 'test-evidence/part-34/ (green)', result: 'PASS' },
  { part: 'Part 52', name: 'QA/QC inspections', flag: 'ff.qa', flagState: 'NOT LIVE', interfaces: 'qc.accepted event consumed via adapter', regressionEvidence: '—', result: 'ADAPTER' },
  { part: 'Part 106', name: 'Gate management', flag: 'ff.gate', flagState: 'NOT LIVE', interfaces: 'gate pass creation via adapter → printed pass', regressionEvidence: '—', result: 'ADAPTER' },
  { part: 'Part 111', name: 'E-way bill', flag: 'ff.ewaybill', flagState: 'NOT LIVE', interfaces: 'validation deferred; numbers captured but unvalidated', regressionEvidence: '—', result: 'ADAPTER' },
];

export const publishedContracts: ConsumerContract[] = [
  { part: 'Part 36/37', interface: 'GET /api/v1/stores/stock + stores.stock.below_reorder', kind: 'API', test: 'consumer contract test CCT-STR-01' },
  { part: 'Part 46', interface: 'issue.chargeable recovery feed (recovery_rate)', kind: 'TABLE', test: 'CCT-STR-02' },
  { part: 'Part 49/50', interface: 'finance postings JV refs (Dr/Cr pairs)', kind: 'EVENT', test: 'CCT-STR-03' },
  { part: 'Part 52', interface: 'qc hold queue + acceptance callback', kind: 'API', test: 'CCT-STR-04' },
  { part: 'Part 90', interface: 'theoretical vs actual consumption extract', kind: 'VIEW', test: 'CCT-STR-05' },
  { part: 'Part 92', interface: 'PV closing physical stock statement', kind: 'VIEW', test: 'CCT-STR-06' },
  { part: 'Part 106', interface: 'gate pass requests for transfers/issues/returns/scrap', kind: 'EVENT', test: 'CCT-STR-07' },
  { part: 'Part 109', interface: 'pre-batch stock availability check', kind: 'API', test: 'CCT-STR-08' },
  { part: 'Part 111', interface: 'e-way bill capture/validation hooks', kind: 'API', test: 'CCT-STR-09' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Labels (inv_labels) — section 5.10
// ──────────────────────────────────────────────────────────────────────────────

export const labels: LabelDef[] = [
  { id: 'lbl_001', targetType: 'batch', target: 'HEAT-TATA-8842 · Steel TMT 16mm', qrPayload: 'ERP:STR:BATCH:mat_001/HEAT-TATA-8842?store=CWH&rate=MASKED', printedAt: '2026-01-16T09:20:00Z', scanUse: 'Receive / issue / count on mobile' },
  { id: 'lbl_002', targetType: 'bin', target: 'A-01 · Cement racks (FEFO)', qrPayload: 'ERP:STR:BIN:CWH/A-01', printedAt: '2026-01-02T08:00:00Z', scanUse: 'Count mode navigation' },
  { id: 'lbl_003', targetType: 'material', target: 'OPC 53 Grade Cement', qrPayload: 'ERP:STR:MAT:mat_002', printedAt: '2026-01-02T08:00:00Z', scanUse: 'Stock lookup, reorder drill-down' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Dashboard aggregates
// ──────────────────────────────────────────────────────────────────────────────

export const storesStats = {
  grnTotal: grns.length,
  grnPosted: grns.filter(g => g.status === 'posted').length,
  grnQcPending: grns.filter(g => g.status === 'qc_pending').length,
  grnSubmitted: grns.filter(g => g.status === 'submitted').length,
  grnRejected: grns.filter(g => g.status === 'rejected').length,
  issuesIssued: issues.filter(i => i.status === 'issued').length,
  issuesRequested: issues.filter(i => i.status === 'requested').length,
  transfersInTransit: transfers.filter(t => t.status === 'in_transit').length,
  transfersReceived: transfers.filter(t => t.status === 'received').length,
  adjustmentsPending: adjustments.filter(a => a.status !== 'posted').length,
  pvOpen: physicalVerifications.filter(p => p.status === 'open' || p.status === 'submitted').length,
  reorderAlerts: reorderRules.filter(r => r.status !== 'ok').length,
  pendingAck: issues.filter(i => i.acknowledgement === 'none').length,
};

export const launchpadTiles = [
  { role: 'Store Keeper', tiles: [
    { label: 'GRNs to post', count: grns.filter(g => g.status === 'submitted' || g.status === 'qc_pending').length, tone: 'amber', navigateHint: 'GRN Queue' },
    { label: 'Issues today', count: issues.filter(i => i.date === '2026-01-16').length, tone: 'blue', navigateHint: 'Issue Slip' },
    { label: 'Reorder alerts', count: storesStats.reorderAlerts, tone: 'red', navigateHint: 'Reorder' },
    { label: 'PV counts open', count: physicalVerifications.filter(p => p.status === 'open').length, tone: 'violet', navigateHint: 'Physical Verification' },
  ]},
  { role: 'Site Engineer', tiles: [
    { label: 'Requests awaiting issue', count: storesStats.issuesRequested, tone: 'amber', navigateHint: 'Issue Requests' },
    { label: 'My WA material balance', count: materialControlLedger.filter(m => m.pendingReturnQty > 0).length, tone: 'blue', navigateHint: 'Material Control' },
  ]},
  { role: 'Site Manager / Store In-charge', tiles: [
    { label: 'GRN approvals', count: grns.filter(g => g.status === 'submitted').length, tone: 'amber', navigateHint: 'Approvals Worklist' },
    { label: 'Exceptions (emergency GRN)', count: grns.filter(g => g.emergencyWithoutPo).length, tone: 'red', navigateHint: 'Exception Worklist' },
  ]},
  { role: 'Project Manager + Accounts', tiles: [
    { label: 'Adjustments to approve', count: adjustments.filter(a => a.status === 'submitted').length, tone: 'amber', navigateHint: 'Adjustment Approvals' },
    { label: 'PV variances', count: physicalVerifications.filter(p => p.status === 'submitted').length, tone: 'violet', navigateHint: 'PV Approvals' },
    { label: 'Dead stock value', count: Math.round(stockSummary.deadStockValue / 1000) + 'k', tone: 'red', navigateHint: 'Dead Stock Report' },
  ]},
];

export const kpiWhys = [
  { kpi: 'Pending QC value ₹' + (stockSummary.qcHoldValue / 100000).toFixed(1) + ' L', why: 'Driven by GRN-2026-0236 (800 bags awaiting strength test) and GRN-2026-0239 membrane in-transit — drill: GRN queue → line → IR document' },
  { kpi: 'Dead stock ₹' + (stockSummary.deadStockValue / 100000).toFixed(1) + ' L', why: 'Two lots with no movement > 180 days (GCS-LOT-0091, Fire Bricks) — drill: Ageing → Store → Material → last ledger row' },
  { kpi: 'GL inventory = stock valuation', why: '₹4.285 Cr matched at 2026-01-16 cut-over; every JV traces to a stock-ledger txn — drill: Posting → Ledger → Document' },
];
