// Part 36 — Tool & Small-Asset Tracking Data
// Module code: tools · Feature flag: ff.tools (sub-flags: ff.tools.register, ff.tools.custody,
// ff.tools.scan, ff.tools.loss, ff.tools.calibration)
// Phase: PROCUREMENT & RESOURCES · Depends on: Parts 11, 35 (+ implicit 7, 10) · Consumed by: Part 107
//
// Discovery note (Step 1): searched repository + DB catalogue for tool, small asset, custody,
// hand tool, power tool, survey instrument, qr, barcode, rfid, calibration, loss. No existing
// tool register was found; the three tables below are NEW (additive migration only). Material
// master and GRNs from Parts 11/35 are REUSED through service interfaces — registration reads
// posted GRN lines (stores module), it never writes to inv_* tables. Calibration dates mirror
// the QA/QC calibration register (Part 52) read-only until that interface is live (adapter).
// Employee custodians resolve against the employee master (Part 39); capitalised items link to
// fixed assets (Part 48) via capitalisedAssetId without altering asset tables.
// All figures below are PREVIEW DATA sourced from the services listed per record.

import type { GateCheckResult } from './storesData';

// ──────────────────────────────────────────────────────────────────────────────
// Types (section 11 — names follow existing snake_case convention in UI layer)
// ──────────────────────────────────────────────────────────────────────────────

export type TagType = 'qr' | 'barcode' | 'rfid';
export type ToolCategory = 'hand' | 'power' | 'survey' | 'safety' | 'IT' | 'other';
export type ToolStatus = 'in_store' | 'issued' | 'in_transit' | 'under_repair' | 'lost' | 'disposed';
export type ToolCondition = 'good' | 'fair' | 'damaged';

export interface ToolItem {
  id: string;
  tagCode: string;                  // unique (section 10)
  tagType: TagType;
  name: string;
  category: ToolCategory;
  make: string;
  model: string;
  serialNo: string;
  materialId?: string;              // material master link (Part 11)
  purchaseRef?: string;             // GRN reference — registered per unit from GRN (section 5.1)
  purchaseDate: string;
  cost: number;
  depreciatedValue: number;         // recovery basis unless investigation assigns otherwise (section 9)
  capitalisedAssetId?: string;      // Part 48 link for capitalised items (nullable)
  calibrationRequired: boolean;
  calibrationDueDate?: string;      // instruments only; issue blocked when overdue (section 10)
  currentStatus: ToolStatus;
  currentCustodianType?: 'employee' | 'subcontractor';
  currentCustodianId?: string;
  currentCustodianName?: string;    // exactly one custodian OR store at any time (section 9)
  currentStoreId?: string;
  currentStoreName?: string;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  condition: ToolCondition;
  idleDaysInStore: number;          // utilisation monitor (section 5.7)
  version: number;                  // optimistic locking (section 10)
}

export type CustodyTxnType =
  | 'issue' | 'return' | 'transfer' | 'inspect'
  | 'repair_out' | 'repair_in' | 'lost' | 'recovered' | 'dispose';

export interface CustodyParty {
  kind: 'employee' | 'subcontractor' | 'store';
  id: string;
  name: string;
}

export interface CustodyTxn {
  id: string;
  txnNo: string;
  toolId: string;
  toolTagCode: string;
  toolName: string;
  type: CustodyTxnType;
  date: string;
  fromParty: CustodyParty;
  toParty: CustodyParty;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  expectedReturnDate?: string;      // issue with expected return (section 5.2)
  returnedOnTime?: boolean;
  conditionAtTxn?: ToolCondition;   // return with condition inspection (section 5.2)
  remarks?: string;
  photoDocIds: string[];            // document service SA-10
  acknowledgedBy?: string;          // OTP / signature (CP-TOL-01)
  acknowledgementMethod?: 'otp' | 'signature' | 'none';
  scanCapture: boolean;             // mobile QR/barcode scan (section 5.3)
  deviceId?: string;                // offline capture provenance (section 23)
  createdBy: string;
  gateChecks: GateCheckResult[];
}

export type LossStatus = 'reported' | 'investigated' | 'recovery_approved' | 'write_off_approved' | 'closed';
export type RecoveryMethod = 'payroll' | 'bill_deduction' | 'write_off';

export interface ToolLossRecovery {
  id: string;
  lossNo: string;
  toolId: string;
  toolTagCode: string;
  toolName: string;
  custodyTxnId: string;             // the 'lost' custody txn
  reportedDate: string;
  reportedBy: string;
  responsibleParty: CustodyParty;
  investigationNote: string;        // loss closed only with recovery or approved write-off (CP-TOL-03)
  amount: number;                   // default = depreciated value per policy (section 9)
  method: RecoveryMethod;           // payroll (Part 45) / bill deduction (Part 46) / write-off
  status: LossStatus;
  approvedBy?: string;
  approvalLimit?: string;           // authority limits (section 7)
  postingRef?: string;              // recovery money only via posting engine (SA-14)
  photos: string[];
  gateChecks: GateCheckResult[];
}

export interface CustodyVerification {
  id: string;
  campaignNo: string;
  date: string;
  custodianId: string;
  custodianName: string;
  custodianType: 'employee' | 'subcontractor';
  toolsExpected: number;
  toolsConfirmed: number;
  missingTags: string[];
  status: 'awaiting' | 'completed' | 'gap_escalated';   // CP-TOL-02 custody verification gaps
  verifiedVia: 'scan' | 'manual' | 'none';
}

export interface IdleToolRow {
  toolId: string;
  tagCode: string;
  toolName: string;
  category: ToolCategory;
  storeName: string;
  idleDays: number;                 // idle beyond N days threshold (configurable)
  cost: number;
  recommendation: string;
}

export interface ExitClearanceCheck {
  employeeId: string;
  employeeName: string;
  toolsInCustody: Array<{ tagCode: string; toolName: string; since: string }>;
  clearanceBlocked: boolean;        // section 9: exit clearance blocked while tools in custody (Part 39)
  lastCheckedAt: string;
}

export interface CalibrationRow {
  toolId: string;
  tagCode: string;
  toolName: string;
  instrumentClass: string;          // total station, UDT gauge, torque wrench…
  lastCalibrated: string;
  dueDate: string;
  daysRemaining: number;
  certificateDocId?: string;
  issueBlocked: boolean;            // overdue calibration blocks issue (section 10)
}

// Re-export shared shapes so this module's dashboards have a single import source.
export type { GateCheckResult };

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

export interface IntegrationRow {
  part: string;
  name: string;
  direction: 'inbound' | 'outbound';
  mechanism: string;
  state: 'live' | 'adapter' | 'planned';
}

// ──────────────────────────────────────────────────────────────────────────────
// Module configuration
// ──────────────────────────────────────────────────────────────────────────────

export const toolsConfig = {
  companyId: 'comp_001',
  companyName: 'Acme Construction Ltd.',
  featureFlag: 'ff.tools',
  subFlags: ['ff.tools.register', 'ff.tools.custody', 'ff.tools.scan', 'ff.tools.loss', 'ff.tools.calibration'],
  productionDefault: 'OFF',
  rolloutStage: 'OBSERVE',                    // PC-13: OFF → OBSERVE → WARN → ENFORCE
  idleThresholdDays: 30,                      // section 5.7 — tools idle in store beyond N days
  overdueGraceDays: 3,                        // grace before tools.return.overdue escalates
  transitAckDays: 5,                          // receiving acknowledgement within N days (CP-TOL-01 transfers)
  custodyVerificationFrequencyDays: 30,       // periodic custody verification (section 5.4)
  recoveryBasis: 'depreciated_value',         // section 9 business rule
  ackMethods: ['OTP', 'Signature'] as const,  // Part 81 OTP service
};

// ──────────────────────────────────────────────────────────────────────────────
// tool_items — register (one row per physical unit, tagged)
// ──────────────────────────────────────────────────────────────────────────────

export const toolItems: ToolItem[] = [
  {
    id: 'tool_001', tagCode: 'TOL-QR-000451', tagType: 'qr', name: 'Total Station Leica TS16',
    category: 'survey', make: 'Leica', model: 'TS16', serialNo: 'LTS16-778210',
    materialId: 'mat_survey_01', purchaseRef: 'GRN-2025-0912', purchaseDate: '2025-04-18',
    cost: 1250000, depreciatedValue: 875000, capitalisedAssetId: 'fa_001',
    calibrationRequired: true, calibrationDueDate: '2026-04-30',
    currentStatus: 'issued', currentCustodianType: 'employee', currentCustodianId: 'emp_102',
    currentCustodianName: 'Rakesh Nair (Survey Engineer)',
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    condition: 'good', idleDaysInStore: 0, version: 7,
  },
  {
    id: 'tool_002', tagCode: 'TOL-QR-000452', tagType: 'qr', name: 'Digital Theodolite Topcon GT-1000',
    category: 'survey', make: 'Topcon', model: 'GT-1000', serialNo: 'TCG-551203',
    materialId: 'mat_survey_02', purchaseRef: 'GRN-2025-0912', purchaseDate: '2025-04-18',
    cost: 640000, depreciatedValue: 448000, capitalisedAssetId: 'fa_002',
    calibrationRequired: true, calibrationDueDate: '2026-01-20',   // overdue → issue blocked
    currentStatus: 'in_store', currentStoreId: 'str_002', currentStoreName: 'Riverside Site Store',
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    condition: 'good', idleDaysInStore: 12, version: 4,
  },
  {
    id: 'tool_003', tagCode: 'TOL-BC-100233', tagType: 'barcode', name: 'Hilti TE-30 Rotary Hammer',
    category: 'power', make: 'Hilti', model: 'TE-30-AVR', serialNo: 'HT30-99120',
    materialId: 'mat_power_11', purchaseRef: 'GRN-2026-0231', purchaseDate: '2026-01-08',
    cost: 98000, depreciatedValue: 93000,
    calibrationRequired: false,
    currentStatus: 'issued', currentCustodianType: 'subcontractor', currentCustodianId: 'sub_vertex',
    currentCustodianName: 'Vertex Interiors (Mohan — mason)',
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    condition: 'good', idleDaysInStore: 0, version: 2,
  },
  {
    id: 'tool_004', tagCode: 'TOL-BC-100234', tagType: 'barcode', name: 'Bosch GWS 22-180 Angle Grinder',
    category: 'power', make: 'Bosch', model: 'GWS 22-180', serialNo: 'BGW-44102',
    materialId: 'mat_power_12', purchaseRef: 'GRN-2026-0231', purchaseDate: '2026-01-08',
    cost: 14500, depreciatedValue: 12800,
    calibrationRequired: false,
    currentStatus: 'under_repair', currentStoreId: 'str_002', currentStoreName: 'Riverside Site Store',
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    condition: 'damaged', idleDaysInStore: 0, version: 5,
  },
  {
    id: 'tool_005', tagCode: 'TOL-RF-200781', tagType: 'rfid', name: 'Concrete Vibrator (Needle) Makita',
    category: 'power', make: 'Makita', model: 'EM9400', serialNo: 'MK-EM-30211',
    materialId: 'mat_power_15', purchaseRef: 'GRN-2025-1180', purchaseDate: '2025-09-02',
    cost: 26500, depreciatedValue: 18500,
    calibrationRequired: false,
    currentStatus: 'lost', currentCustodianType: 'employee', currentCustodianId: 'emp_118',
    currentCustodianName: 'Suresh Kumar (Formwork Crew)',
    projectId: 'prj_highway', projectName: 'Highway Bridge Phase 2', siteId: 'site_hwy', siteName: 'Highway Bridge Camp',
    condition: 'fair', idleDaysInStore: 0, version: 9,
  },
  {
    id: 'tool_006', tagCode: 'TOL-QR-000510', tagType: 'qr', name: 'Ultrasonic Thickness Gauge Olympus',
    category: 'survey', make: 'Olympus', model: '38DL Plus', serialNo: 'OL-38-20771',
    materialId: 'mat_survey_05', purchaseRef: 'GRN-2025-1044', purchaseDate: '2025-06-25',
    cost: 210000, depreciatedValue: 147000, capitalisedAssetId: 'fa_009',
    calibrationRequired: true, calibrationDueDate: '2026-03-15',
    currentStatus: 'in_store', currentStoreId: 'str_001', currentStoreName: 'Central Warehouse — Pune',
    projectId: 'prj_company', projectName: 'Company Common', siteId: 'site_pun', siteName: 'Pune Central Yard',
    condition: 'good', idleDaysInStore: 46, version: 3,
  },
  {
    id: 'tool_007', tagCode: 'TOL-BC-100301', tagType: 'barcode', name: 'Torque Wrench 200 Nm Bahco',
    category: 'hand', make: 'Bahco', model: '30850-200', serialNo: 'BH-30-88120',
    materialId: 'mat_hand_21', purchaseRef: 'GRN-2025-1180', purchaseDate: '2025-09-02',
    cost: 18500, depreciatedValue: 13000,
    calibrationRequired: true, calibrationDueDate: '2026-02-10',
    currentStatus: 'issued', currentCustodianType: 'employee', currentCustodianId: 'emp_131',
    currentCustodianName: 'Amit Sharma (Steel Fixing Foreman)',
    projectId: 'prj_highway', projectName: 'Highway Bridge Phase 2', siteId: 'site_hwy', siteName: 'Highway Bridge Camp',
    condition: 'good', idleDaysInStore: 0, version: 6,
  },
  {
    id: 'tool_008', tagCode: 'TOL-QR-000612', tagType: 'qr', name: 'Laser Distance Meter Bosch GLM 100',
    category: 'survey', make: 'Bosch', model: 'GLM 100 C', serialNo: 'BGL-100-55210',
    materialId: 'mat_survey_07', purchaseRef: 'GRN-2026-0201', purchaseDate: '2025-12-14',
    cost: 12500, depreciatedValue: 11200,
    calibrationRequired: false,
    currentStatus: 'in_transit', currentStoreId: 'str_003', currentStoreName: 'In-Transit Bin',
    projectId: 'prj_highway', projectName: 'Highway Bridge Phase 2', siteId: 'site_hwy', siteName: 'Highway Bridge Camp',
    condition: 'good', idleDaysInStore: 0, version: 2,
  },
  {
    id: 'tool_009', tagCode: 'TOL-BC-100415', tagType: 'barcode', name: 'Safety Harness Full-Body (3M)',
    category: 'safety', make: '3M', model: 'PF 6000', serialNo: '3M-PF6-11209',
    materialId: 'mat_safety_03', purchaseRef: 'GRN-2026-0233', purchaseDate: '2026-01-10',
    cost: 8500, depreciatedValue: 8100,
    calibrationRequired: false,
    currentStatus: 'issued', currentCustodianType: 'employee', currentCustodianId: 'emp_145',
    currentCustodianName: 'Vikram Singh (Height Work Crew)',
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    condition: 'good', idleDaysInStore: 0, version: 1,
  },
  {
    id: 'tool_010', tagCode: 'TOL-QR-000701', tagType: 'qr', name: 'Tablet Samsung Galaxy Tab A9 (Field)',
    category: 'IT', make: 'Samsung', model: 'Galaxy Tab A9', serialNo: 'SM-TA9-77120',
    materialId: 'mat_it_02', purchaseRef: 'GRN-2025-1305', purchaseDate: '2025-10-20',
    cost: 32000, depreciatedValue: 25600,
    calibrationRequired: false,
    currentStatus: 'issued', currentCustodianType: 'employee', currentCustodianId: 'emp_102',
    currentCustodianName: 'Rakesh Nair (Survey Engineer)',
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    condition: 'fair', idleDaysInStore: 0, version: 4,
  },
  {
    id: 'tool_011', tagCode: 'TOL-BC-100520', tagType: 'barcode', name: 'Welding Machine ESAB Warrior',
    category: 'power', make: 'ESAB', model: 'Warrior 300', serialNo: 'ES-W3-44102',
    materialId: 'mat_power_18', purchaseRef: 'GRN-2025-1180', purchaseDate: '2025-09-02',
    cost: 145000, depreciatedValue: 101500,
    calibrationRequired: false,
    currentStatus: 'in_store', currentStoreId: 'str_004', currentStoreName: 'Highway Bridge Store',
    projectId: 'prj_highway', projectName: 'Highway Bridge Phase 2', siteId: 'site_hwy', siteName: 'Highway Bridge Camp',
    condition: 'good', idleDaysInStore: 62, version: 8,
  },
  {
    id: 'tool_012', tagCode: 'TOL-QR-000815', tagType: 'qr', name: 'Water Level Dumpy Set',
    category: 'survey', make: 'Solinst', model: 'Level 100', serialNo: 'SL-100-99210',
    materialId: 'mat_survey_09', purchaseRef: 'GRN-2025-0912', purchaseDate: '2025-04-18',
    cost: 28000, depreciatedValue: 16800,
    calibrationRequired: false,
    currentStatus: 'disposed', currentStoreId: 'str_001', currentStoreName: 'Central Warehouse — Pune',
    projectId: 'prj_company', projectName: 'Company Common', siteId: 'site_pun', siteName: 'Pune Central Yard',
    condition: 'damaged', idleDaysInStore: 0, version: 11,
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// tool_custody_txns — custody ledger (immutable chain; corrections by reversal)
// ──────────────────────────────────────────────────────────────────────────────

const g = (cp: string, name: string, status: GateCheckResult['status'], message?: string): GateCheckResult =>
  ({ cp, name, status, message });

export const custodyTxns: CustodyTxn[] = [
  {
    id: 'ctx_1001', txnNo: 'CT-2026-0412', toolId: 'tool_001', toolTagCode: 'TOL-QR-000451',
    toolName: 'Total Station Leica TS16', type: 'issue', date: '2026-01-12',
    fromParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    toParty: { kind: 'employee', id: 'emp_102', name: 'Rakesh Nair (Survey Engineer)' },
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    expectedReturnDate: '2026-01-30', conditionAtTxn: 'good',
    remarks: 'Issued for L1 slab setting-out (WA-RVS-041 line 3).',
    photoDocIds: ['doc_ack_551', 'doc_cond_552'], acknowledgedBy: 'emp_102',
    acknowledgementMethod: 'otp', scanCapture: true, deviceId: 'tab-rvs-07', createdBy: 'sk_river_01',
    gateChecks: [g('CP-TOL-01', 'Named custodian + acknowledgement', 'pass', 'OTP verified via Part 81')],
  },
  {
    id: 'ctx_1002', txnNo: 'CT-2026-0413', toolId: 'tool_003', toolTagCode: 'TOL-BC-100233',
    toolName: 'Hilti TE-30 Rotary Hammer', type: 'issue', date: '2026-01-14',
    fromParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    toParty: { kind: 'subcontractor', id: 'sub_vertex', name: 'Vertex Interiors (Mohan)' },
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    expectedReturnDate: '2026-01-21', conditionAtTxn: 'good',
    remarks: 'Free-issue to subcontractor; chargeable usage recorded for Part 46 recovery tracking.',
    photoDocIds: ['doc_ack_555'], acknowledgedBy: 'sub_vertex_mohan',
    acknowledgementMethod: 'signature', scanCapture: true, deviceId: 'phn-mohan-02', createdBy: 'sk_river_01',
    gateChecks: [g('CP-TOL-01', 'Named custodian + acknowledgement', 'pass', 'Signature captured on tablet')],
  },
  {
    id: 'ctx_1003', txnNo: 'CT-2026-0414', toolId: 'tool_004', toolTagCode: 'TOL-BC-100234',
    toolName: 'Bosch GWS 22-180 Angle Grinder', type: 'return', date: '2026-01-15',
    fromParty: { kind: 'employee', id: 'emp_121', name: 'Prakash Reddy (Bar Bending Crew)' },
    toParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    conditionAtTxn: 'damaged',
    remarks: 'Carbon brush holder cracked during use; returned with condition inspection → repair_out same day.',
    photoDocIds: ['doc_cond_560', 'doc_cond_561'], acknowledgedBy: 'sk_river_01',
    acknowledgementMethod: 'signature', scanCapture: true, deviceId: 'tab-rvs-03', createdBy: 'sk_river_01',
    gateChecks: [g('CP-TOL-01', 'Return inspected & accepted', 'pass', 'Damaged condition photographed')],
  },
  {
    id: 'ctx_1004', txnNo: 'CT-2026-0415', toolId: 'tool_004', toolTagCode: 'TOL-BC-100234',
    toolName: 'Bosch GWS 22-180 Angle Grinder', type: 'repair_out', date: '2026-01-15',
    fromParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    toParty: { kind: 'store', id: 'vendor_bosch_svc', name: 'Bosch Service Centre' },
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    remarks: 'WO# BOS-88121; estimate ₹2,400 — under repair, not issuable.',
    photoDocIds: ['doc_wo_562'], acknowledgedBy: undefined, acknowledgementMethod: 'none',
    scanCapture: false, createdBy: 'sk_river_01',
    gateChecks: [g('CP-TOL-01', 'Repair movement recorded', 'warn', 'Outbound gate pass pending Part 106 integration')],
  },
  {
    id: 'ctx_1005', txnNo: 'CT-2026-0416', toolId: 'tool_005', toolTagCode: 'TOL-RF-200781',
    toolName: 'Concrete Vibrator (Needle) Makita', type: 'lost', date: '2026-01-13',
    fromParty: { kind: 'employee', id: 'emp_118', name: 'Suresh Kumar (Formwork Crew)' },
    toParty: { kind: 'store', id: 'str_004', name: 'Highway Bridge Store' },
    projectId: 'prj_highway', projectName: 'Highway Bridge Phase 2', siteId: 'site_hwy', siteName: 'Highway Bridge Camp',
    conditionAtTxn: 'fair',
    remarks: 'Not traced after night-shift pour 12-Jan; RFID gate reader saw no exit event — investigation opened.',
    photoDocIds: ['doc_loss_570'], acknowledgedBy: undefined, acknowledgementMethod: 'none',
    scanCapture: false, createdBy: 'sm_highway_01',
    gateChecks: [
      g('CP-TOL-02', 'Overdue/gap detection', 'fail', 'Missing at shift-end count'),
      g('CP-TOL-03', 'Loss closure needs recovery/write-off', 'pending', 'Investigation in progress'),
    ],
  },
  {
    id: 'ctx_1006', txnNo: 'CT-2026-0417', toolId: 'tool_007', toolTagCode: 'TOL-BC-100301',
    toolName: 'Torque Wrench 200 Nm Bahco', type: 'transfer', date: '2026-01-15',
    fromParty: { kind: 'employee', id: 'emp_129', name: 'Firoz Ali (Steel Foreman, retired crew)' },
    toParty: { kind: 'employee', id: 'emp_131', name: 'Amit Sharma (Steel Fixing Foreman)' },
    projectId: 'prj_highway', projectName: 'Highway Bridge Phase 2', siteId: 'site_hwy', siteName: 'Highway Bridge Camp',
    expectedReturnDate: '2026-02-28', conditionAtTxn: 'good',
    remarks: 'Custody transfer on crew changeover; both parties scanned and signed on mobile.',
    photoDocIds: ['doc_ack_575', 'doc_ack_576'], acknowledgedBy: 'emp_131',
    acknowledgementMethod: 'otp', scanCapture: true, deviceId: 'phn-amit-01', createdBy: 'sk_highway_01',
    gateChecks: [g('CP-TOL-01', 'Both-custodian acknowledgement', 'pass', 'Chain intact: Firoz → Amit')],
  },
  {
    id: 'ctx_1007', txnNo: 'CT-2026-0418', toolId: 'tool_008', toolTagCode: 'TOL-QR-000612',
    toolName: 'Laser Distance Meter Bosch GLM 100', type: 'transfer', date: '2026-01-16',
    fromParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    toParty: { kind: 'store', id: 'str_004', name: 'Highway Bridge Store' },
    projectId: 'prj_highway', projectName: 'Highway Bridge Phase 2', siteId: 'site_hwy', siteName: 'Highway Bridge Camp',
    remarks: 'Inter-site tool transfer TRF-TOL-2026-018 dispatched; awaiting receiving acknowledgement (within 5 days).',
    photoDocIds: ['doc_gp_580'], acknowledgedBy: undefined, acknowledgementMethod: 'none',
    scanCapture: true, deviceId: 'tab-rvs-03', createdBy: 'sk_river_01',
    gateChecks: [
      g('CP-TOL-01', 'Dispatch scan recorded', 'pass'),
      g('CP-TOL-02', 'Receipt confirmation due', 'warn', 'Acknowledgement window closes 21-Jan'),
    ],
  },
  {
    id: 'ctx_1008', txnNo: 'CT-2026-0419', toolId: 'tool_009', toolTagCode: 'TOL-BC-100415',
    toolName: 'Safety Harness Full-Body (3M)', type: 'issue', date: '2026-01-16',
    fromParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    toParty: { kind: 'employee', id: 'emp_145', name: 'Vikram Singh (Height Work Crew)' },
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    conditionAtTxn: 'good',   // open-ended PPE custody — no expected return date (section 5.2 exception class)
    remarks: 'Long-term PPE custody (open-ended return); HSE register synced (Part 55).',
    photoDocIds: ['doc_ack_585'], acknowledgedBy: 'emp_145', acknowledgementMethod: 'signature',
    scanCapture: true, deviceId: 'phn-vikram-04', createdBy: 'sk_river_01',
    gateChecks: [g('CP-TOL-01', 'Named custodian + acknowledgement', 'pass')],
  },
  {
    id: 'ctx_1009', txnNo: 'CT-2026-0420', toolId: 'tool_012', toolTagCode: 'TOL-QR-000815',
    toolName: 'Water Level Dumpy Set', type: 'dispose', date: '2026-01-10',
    fromParty: { kind: 'store', id: 'str_001', name: 'Central Warehouse — Pune' },
    toParty: { kind: 'store', id: 'scrap_vendor_02', name: 'Scrap Vendor — Shree Metals' },
    projectId: 'prj_company', projectName: 'Company Common', siteId: 'site_pun', siteName: 'Pune Central Yard',
    conditionAtTxn: 'damaged',
    remarks: 'Beyond economic repair; PM-approved disposal DL-2026-004; sale proceeds ₹3,500 via posting engine.',
    photoDocIds: ['doc_disp_590', 'doc_appr_591'], acknowledgedBy: 'pm_acme_01', acknowledgementMethod: 'signature',
    scanCapture: false, createdBy: 'cw_keeper_01',
    gateChecks: [g('CP-TOL-03', 'Disposal approval on file', 'pass', 'tools.dispose.approve — PM')],
  },
  {
    id: 'ctx_1010', txnNo: 'CT-2026-0421', toolId: 'tool_002', toolTagCode: 'TOL-QR-000452',
    toolName: 'Digital Theodolite Topcon GT-1000', type: 'inspect', date: '2026-01-16',
    fromParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    toParty: { kind: 'store', id: 'str_002', name: 'Riverside Site Store' },
    projectId: 'prj_riverside', projectName: 'Riverside Tower', siteId: 'site_rvs', siteName: 'Riverside Site 1',
    conditionAtTxn: 'good',
    remarks: 'Pre-issue condition check flagged calibration overdue (due 20-Jan-2026) — issue held.',
    photoDocIds: [], acknowledgedBy: undefined, acknowledgementMethod: 'none',
    scanCapture: true, deviceId: 'tab-rvs-03', createdBy: 'sk_river_01',
    gateChecks: [g('CP-TOL-01', 'Calibration gate on issue', 'fail', 'Block: calibration overdue — send to accredited lab')],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// tool_loss_recoveries — REPORTED → INVESTIGATED → RECOVERY/WRITE-OFF → CLOSED
// ──────────────────────────────────────────────────────────────────────────────

export const lossRecoveries: ToolLossRecovery[] = [
  {
    id: 'loss_001', lossNo: 'LS-2026-0031', toolId: 'tool_005', toolTagCode: 'TOL-RF-200781',
    toolName: 'Concrete Vibrator (Needle) Makita', custodyTxnId: 'ctx_1005',
    reportedDate: '2026-01-13', reportedBy: 'sm_highway_01',
    responsibleParty: { kind: 'employee', id: 'emp_118', name: 'Suresh Kumar (Formwork Crew)' },
    investigationNote: 'Crew interview + RFID gate log review: no exit scan; likely left at shuttered face and removed with third-party labour. Police notification not pursued (value below threshold).',
    amount: 18500, method: 'payroll', status: 'recovery_approved',
    approvedBy: 'sm_highway_01 + hr_commercial_01', approvalLimit: '₹50,000 per incident (Site Manager + HR/Commercial)',
    postingRef: 'JV-2026-0118 (Dr Recovery Receivable / Cr Tool Cost Centre)',
    photos: ['doc_loss_570', 'doc_inv_571'],
    gateChecks: [
      g('CP-TOL-03', 'Investigation completed', 'pass'),
      g('CP-TOL-03', 'Recovery approved (maker-checker)', 'pass', 'SoD: reporter ≠ approver'),
    ],
  },
  {
    id: 'loss_002', lossNo: 'LS-2026-0032', toolId: 'tool_011', toolTagCode: 'TOL-BC-100520',
    toolName: 'Welding Machine ESAB Warrior (cable set missing)', custodyTxnId: 'ctx_1005',
    reportedDate: '2026-01-16', reportedBy: 'sk_highway_01',
    responsibleParty: { kind: 'subcontractor', id: 'sub_ashirvad', name: 'Ashirvad Welding Works' },
    investigationNote: 'Earth cable + holder missing from machine store cage; access log shows subcontractor crew only. Awaiting bill-deduction approval.',
    amount: 6500, method: 'bill_deduction', status: 'investigated',
    approvedBy: undefined, approvalLimit: 'Deduction feeds Part 46 RA bill line',
    postingRef: undefined, photos: ['doc_loss_573'],
    gateChecks: [
      g('CP-TOL-03', 'Close requires recovery or write-off', 'pending', 'Recovery approval not yet taken'),
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Periodic custody verification (section 5.4 / CP-TOL-02)
// ──────────────────────────────────────────────────────────────────────────────

export const custodyVerifications: CustodyVerification[] = [
  { id: 'cv_001', campaignNo: 'CV-2026-01', date: '2026-01-05', custodianId: 'emp_102', custodianName: 'Rakesh Nair', custodianType: 'employee', toolsExpected: 2, toolsConfirmed: 2, missingTags: [], status: 'completed', verifiedVia: 'scan' },
  { id: 'cv_002', campaignNo: 'CV-2026-01', date: '2026-01-05', custodianId: 'emp_118', custodianName: 'Suresh Kumar', custodianType: 'employee', toolsExpected: 2, toolsConfirmed: 1, missingTags: ['TOL-RF-200781'], status: 'gap_escalated', verifiedVia: 'scan' },
  { id: 'cv_003', campaignNo: 'CV-2026-01', date: '2026-01-06', custodianId: 'sub_vertex', custodianName: 'Vertex Interiors', custodianType: 'subcontractor', toolsExpected: 1, toolsConfirmed: 1, missingTags: [], status: 'completed', verifiedVia: 'manual' },
  { id: 'cv_004', campaignNo: 'CV-2026-02', date: '2026-02-01', custodianId: 'emp_145', custodianName: 'Vikram Singh', custodianType: 'employee', toolsExpected: 1, toolsConfirmed: 0, missingTags: [], status: 'awaiting', verifiedVia: 'none' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Utilisation — idle tools beyond threshold (section 5.7)
// ──────────────────────────────────────────────────────────────────────────────

export const idleTools: IdleToolRow[] = [
  { toolId: 'tool_011', tagCode: 'TOL-BC-100520', toolName: 'Welding Machine ESAB Warrior', category: 'power', storeName: 'Highway Bridge Store', idleDays: 62, cost: 145000, recommendation: 'Reallocate to Riverside steel yard or release to central store' },
  { toolId: 'tool_006', tagCode: 'TOL-QR-000701', toolName: 'Ultrasonic Thickness Gauge Olympus', category: 'survey', storeName: 'Central Warehouse — Pune', idleDays: 46, cost: 210000, recommendation: 'Offer to QA (Part 52) for weld audit programme' },
  { toolId: 'tool_002', tagCode: 'TOL-QR-000452', toolName: 'Digital Theodolite Topcon GT-1000', category: 'survey', storeName: 'Riverside Site Store', idleDays: 12, cost: 640000, recommendation: 'Below threshold — hold for calibration then reissue' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Calibration register view (mirrors Part 52 read-only)
// ──────────────────────────────────────────────────────────────────────────────

export const calibrationRegister: CalibrationRow[] = [
  { toolId: 'tool_002', tagCode: 'TOL-QR-000452', toolName: 'Digital Theodolite Topcon GT-1000', instrumentClass: 'Theodolite', lastCalibrated: '2025-01-18', dueDate: '2026-01-20', daysRemaining: -6, certificateDocId: 'doc_cal_401', issueBlocked: true },
  { toolId: 'tool_007', tagCode: 'TOL-BC-100301', toolName: 'Torque Wrench 200 Nm Bahco', instrumentClass: 'Torque tool', lastCalibrated: '2025-08-11', dueDate: '2026-02-10', daysRemaining: 25, certificateDocId: 'doc_cal_402', issueBlocked: false },
  { toolId: 'tool_001', tagCode: 'TOL-QR-000451', toolName: 'Total Station Leica TS16', instrumentClass: 'Total station', lastCalibrated: '2025-04-30', dueDate: '2026-04-30', daysRemaining: 105, certificateDocId: 'doc_cal_403', issueBlocked: false },
  { toolId: 'tool_006', tagCode: 'TOL-QR-000701', toolName: 'Ultrasonic Thickness Gauge Olympus', instrumentClass: 'NDT gauge', lastCalibrated: '2025-03-15', dueDate: '2026-03-15', daysRemaining: 58, certificateDocId: 'doc_cal_404', issueBlocked: false },
];

// ──────────────────────────────────────────────────────────────────────────────
// Exit-clearance hook (Part 39) — blocked while tools are in custody
// ──────────────────────────────────────────────────────────────────────────────

export const exitClearanceChecks: ExitClearanceCheck[] = [
  {
    employeeId: 'emp_118', employeeName: 'Suresh Kumar (Formwork Crew)',
    toolsInCustody: [{ tagCode: 'TOL-RF-200781', toolName: 'Concrete Vibrator Makita', since: '2025-12-02' }],
    clearanceBlocked: true, lastCheckedAt: '2026-01-16T09:30:00Z',
  },
  {
    employeeId: 'emp_102', employeeName: 'Rakesh Nair (Survey Engineer)',
    toolsInCustody: [
      { tagCode: 'TOL-QR-000451', toolName: 'Total Station Leica TS16', since: '2026-01-12' },
      { tagCode: 'TOL-QR-000701', toolName: 'Tablet Samsung Galaxy Tab A9', since: '2025-10-21' },
    ],
    clearanceBlocked: true, lastCheckedAt: '2026-01-16T09:31:00Z',
  },
  {
    employeeId: 'emp_121', employeeName: 'Prakash Reddy (Bar Bending Crew)',
    toolsInCustody: [], clearanceBlocked: false, lastCheckedAt: '2026-01-15T18:02:00Z',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Overdue returns worklist (derived)
// ──────────────────────────────────────────────────────────────────────────────

const TODAY = '2026-01-16';

export const overdueReturns = custodyTxns
  .filter(t => (t.type === 'issue' || t.type === 'transfer') && t.expectedReturnDate && t.expectedReturnDate !== 'undefined' && t.expectedReturnDate < TODAY)
  .map(t => ({
    txnNo: t.txnNo, tagCode: t.toolTagCode, toolName: t.toolName,
    custodian: t.toParty.name, expectedReturnDate: t.expectedReturnDate!,
    daysOverdue: Math.round((Date.parse(TODAY) - Date.parse(t.expectedReturnDate!)) / 86400000),
  }));

// ──────────────────────────────────────────────────────────────────────────────
// Section 8A — protocol control points (seeded in OBSERVE per PC-13)
// ──────────────────────────────────────────────────────────────────────────────

export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-TOL-01', stage: 'EXECUTE', control: 'Issue only to a named custodian with acknowledgement (OTP/signature)', enforcement: 'BLOCK', evidence: 'OTP/signature record on custody txn', escalation: 'L2', mode: 'OBSERVE' },
  { id: 'CP-TOL-02', stage: 'MONITOR', control: 'Overdue returns and custody verification gaps', enforcement: 'MONITOR (DR-21)', evidence: 'Custody ledger', escalation: 'L1 → L2', mode: 'OBSERVE' },
  { id: 'CP-TOL-03', stage: 'CLOSE', control: 'Loss closed only with recovery or approved write-off', enforcement: 'BLOCK', evidence: 'Approval record', escalation: 'L2 → L3', mode: 'OBSERVE' },
];

export const protocolStats = {
  controlsRegistered: protocolControlPoints.length,
  evaluationsToday: 41,
  passes: 36,
  warns: 3,
  exceptions: 1,
  blocks: 1,
  detail: [
    { cp: 'CP-TOL-01', evaluated: 22, pass: 20, warn: 1, exception: 0, block: 1, note: 'Block: Topcon theodolite issue halted — calibration overdue' },
    { cp: 'CP-TOL-02', evaluated: 15, pass: 12, warn: 2, exception: 1, block: 0, note: 'Exception: CV gap for emp_118 regularised after recovery approval' },
    { cp: 'CP-TOL-03', evaluated: 4, pass: 2, warn: 0, exception: 0, block: 2, note: 'Block: LS-2026-0032 cannot close without recovery/write-off' },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// Sections 6–7 — roles & permissions (registered in Part 5 registry)
// ──────────────────────────────────────────────────────────────────────────────

export const rolePermissions: RolePermission[] = [
  { key: 'tools.item.register', role: 'Store Keeper', description: 'Register tools from GRN per unit, bulk import, print tags', scopeLevels: 'company, branch, site' },
  { key: 'tools.custody.issue', role: 'Store Keeper', description: 'Issue/transfer tools to named custodians', scopeLevels: 'company, project, site, transaction' },
  { key: 'tools.custody.return', role: 'Store Keeper', description: 'Receive returns with condition inspection', scopeLevels: 'company, project, site, transaction' },
  { key: 'tools.custody.acknowledge', role: 'Custodian (employee/subcontractor)', description: 'Acknowledge receipt via OTP/signature on mobile', scopeLevels: 'transaction, document', approvalLimit: 'own custody txns only' },
  { key: 'tools.loss.approve', role: 'Site Manager + HR/Commercial', description: 'Approve recovery (payroll/bill deduction) or write-off', scopeLevels: 'project, site, approval-limit', approvalLimit: '₹50,000 per incident; above → PM + Accounts' },
  { key: 'tools.dispose.approve', role: 'Project Manager', description: 'Approve disposal of damaged/idle tools', scopeLevels: 'project, approval-limit', approvalLimit: '₹2,00,000 book value' },
  { key: 'tools.valuation.view', role: 'Stores lead, Accounts, PM', description: 'View cost/depreciated values; masked for others', scopeLevels: 'field-level masking' },
];

export const sodRules = [
  { rule: 'Maker-checker on loss recovery', detail: 'Person reporting the loss cannot approve recovery/write-off (PC-6)' },
  { rule: 'Custodian self-ack only', detail: 'Acknowledgement binds the custodian identity (OTP to their registered phone)' },
  { rule: 'Disposal SoD', detail: 'Store Keeper proposes; PM approves; Accounts verifies posting' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 15 — APIs (v1 new routes; no existing contract changed)
// ──────────────────────────────────────────────────────────────────────────────

export const apiRoutes: ApiRoute[] = [
  { method: 'GET', path: '/api/v1/tools/items', permission: 'tools.item.register (read scope)', notes: 'Paginated, filterable by category/status/custodian/site; Idempotency not required' },
  { method: 'POST', path: '/api/v1/tools/items', permission: 'tools.item.register', notes: 'Register from GRN line or manual; tag_code uniqueness enforced server-side' },
  { method: 'POST', path: '/api/v1/tools/custody', permission: 'tools.custody.issue | tools.custody.return', notes: 'Body: {type: issue|return|transfer, toolId, toParty, expectedReturnDate?}; Idempotency-Key mandatory; version checked' },
  { method: 'POST', path: '/api/v1/tools/custody/{txnId}/acknowledge', permission: 'tools.custody.acknowledge', notes: 'OTP verify (Part 81) or signature hash; CP-TOL-01 evaluated inside transaction' },
  { method: 'GET', path: '/api/v1/tools/overdue', permission: 'tools.custody.issue (read scope)', notes: 'Derived from custody ledger; DR-21 monitor feed' },
  { method: 'GET', path: '/api/v1/tools/losses', permission: 'tools.loss.approve (read scope)', notes: 'Loss/recovery worklist with statuses' },
  { method: 'POST', path: '/api/v1/tools/losses', permission: 'tools.custody.issue', notes: 'Report loss with photos; emits tools.loss.reported' },
  { method: 'POST', path: '/api/v1/tools/losses/{id}/approve-recovery', permission: 'tools.loss.approve', notes: 'Recovery or write-off; CP-TOL-03 BLOCK if unapproved; posting via engine (SA-14)' },
  { method: 'GET', path: '/api/v1/tools/my-tools', permission: 'authenticated (self scope)', notes: 'Custodian mobile view — own custody only, IDs re-authorised each request (no IDOR)' },
  { method: 'POST', path: '/api/v1/tools/scan', permission: 'tools.custody.issue | tools.item.register', notes: 'Scan-resolve tag → action context (issue/return/count)' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 14 — real-time events (outbox → queue → Socket.IO rooms, SA-8)
// ──────────────────────────────────────────────────────────────────────────────

export const socketEvents: SocketEventDef[] = [
  { event: 'tools.custody.changed', room: 'store:{storeId} + custodian:{partyId}', payload: '{toolId, tagCode, txnNo, type, toParty, date}', description: 'Emitted after every posted custody txn; server re-checks permission before emit' },
  { event: 'tools.return.overdue', room: 'project:{projectId}', payload: '{txnNo, tagCode, custodian, daysOverdue}', description: 'Daily job + on-transition; no personal data in payload' },
  { event: 'tools.loss.reported', room: 'site:{siteId} + role:SiteManager', payload: '{lossNo, tagCode, siteId, reportedDate}', description: 'Triggers Site Manager action-required notification' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 16 — notifications
// ──────────────────────────────────────────────────────────────────────────────

export const notificationMatrix: NotificationDef[] = [
  { trigger: 'Return overdue past grace (3 days)', recipients: 'Custodian + supervisor', level: 'Warning', template: 'tol_return_overdue' },
  { trigger: 'Loss reported', recipients: 'Site Manager (+HR/Commercial if value > ₹10k)', level: 'Action required', template: 'tol_loss_reported' },
  { trigger: 'Calibration due (−30/−7 days)', recipients: 'Custodian + QA/QC', level: 'Action required', template: 'tol_calibration_due' },
  { trigger: 'Calibration overdue → issue blocked', recipients: 'Store Keeper + Survey lead', level: 'Critical', template: 'tol_calibration_blocked' },
  { trigger: 'Custody verification gap escalated (DR-21)', recipients: 'Site Manager', level: 'Escalation', template: 'tol_cv_gap' },
  { trigger: 'Recovery approved (payroll/bill deduction)', recipients: 'Payroll/Commercial + Accounts', level: 'Information', template: 'tol_recovery_approved' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 17 — reports (catalogue Part 65)
// ──────────────────────────────────────────────────────────────────────────────

export const reports: ReportDef[] = [
  { code: 'RPT-TOL-01', name: 'Custody Register', format: 'PDF/Excel/CSV', drillDown: 'Company → Project → Site → Custodian → Tool → Txn', consumers: 'Parts 39, 107' },
  { code: 'RPT-TOL-02', name: 'Overdue Returns', format: 'PDF/Excel', drillDown: 'Project → Custodian → Txn', consumers: 'DR-21 dashboard (Part 78)' },
  { code: 'RPT-TOL-03', name: 'Losses & Recoveries', format: 'PDF/Excel', drillDown: 'Company → Project → Loss → Approval → Posting', consumers: 'Parts 45/46/48' },
  { code: 'RPT-TOL-04', name: 'Idle Tools / Utilisation', format: 'Overview page + Excel', drillDown: 'Site → Store → Tool → Last txn', consumers: 'Part 107' },
  { code: 'RPT-TOL-05', name: 'Calibration Status', format: 'PDF', drillDown: 'Instrument class → Tool → Certificate', consumers: 'Part 52' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 18 — printing
// ──────────────────────────────────────────────────────────────────────────────

export const printTemplates: PrintTemplateDef[] = [
  { code: 'PRT-TOL-01', name: 'Tag label (QR/barcode)', branding: 'Letterhead + project logo', features: 'Tag code, category, company asset no., QR verification payload, print audit stamp' },
  { code: 'PRT-TOL-02', name: 'Custody acknowledgement slip', branding: 'Per-project branding', features: 'Tool details, expected return, signature block, revision/date, QR of txn for re-scan' },
  { code: 'PRT-TOL-03', name: 'Loss report / recovery order', branding: 'Letterhead', features: 'Investigation note, approval matrix, reason codes, digital signature where configured' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 23 — offline support (field engine Part 79)
// ──────────────────────────────────────────────────────────────────────────────

export const offlineOperations: OfflineOpDef[] = [
  { operation: 'Scan issue/return draft', device: 'Mobile', queue: 'Encrypted local queue → sync', conflictRule: 'Server wins after approval/lock; else field merge with prompt; conflicts logged' },
  { operation: 'My-tools custody verification', device: 'Mobile', queue: 'Local confirmations batched', conflictRule: 'Server re-validates balances & CP-TOL-01 at sync; nothing counts until confirmed' },
  { operation: 'Report loss with photo/GPS', device: 'Mobile', queue: 'Draft + media upload resume', conflictRule: 'Duplicate loss suppressed by Idempotency-Key' },
  { operation: 'Financial-impact approvals (recovery/disposal)', device: '—', queue: 'Online only', conflictRule: 'Not available offline (section 23)' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 11 / SA-4 — DB entity map (decisions vs DB_ENTITY_MAP.csv)
// ──────────────────────────────────────────────────────────────────────────────

export const dbEntityMap: EntityMapRow[] = [
  { entity: 'Tool register', table: 'tool_items', decision: 'NEW', notes: 'Additive migration 20260136_tool_items_create; tag_code unique index' },
  { entity: 'Custody ledger', table: 'tool_custody_txns', decision: 'NEW', notes: 'Append-only like inv_stock_ledger pattern (Part 35); corrections by reversal txn' },
  { entity: 'Loss & recovery', table: 'tool_loss_recoveries', decision: 'NEW', notes: 'FK to custody txn; money only via posting engine' },
  { entity: 'Material master', table: 'materials', decision: 'REUSE', notes: 'Parts 11/35 — categories/UOM resolved read-only' },
  { entity: 'GRN lines (registration source)', table: 'inv_grn_lines', decision: 'REUSE', notes: 'Read posted GRN qty>1 to register per-unit tools; never written by this module' },
  { entity: 'Employee master / exit clearance', table: 'employees', decision: 'EXTEND', notes: 'Nullable ext columns via employees_ext (Part 39 owns); this module exposes check API only' },
  { entity: 'Fixed assets', table: 'assets', decision: 'REUSE', notes: 'capitalised_asset_id link (Part 48); no schema change' },
  { entity: 'Calibration register', table: 'qa_calibration', decision: 'REUSE', notes: 'Part 52 read interface; adapter mirrors due dates until live' },
];

export const conflictsLogged = [
  { id: 'CONF-36-01', issue: 'Legacy paper tool register exists at Highway site (no digital table)', resolution: 'Bulk import into tool_items as OPENING custody txns (new rows only); legacy sheets retained read-only', status: 'RESOLVED' },
  { id: 'CONF-36-02', issue: 'Part 52 calibration register not yet live', resolution: 'Adapter falls back to qa_calibration_view snapshot; recorded in dependency validation', status: 'OPEN — closes with Part 52' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 30 — dependency validation
// ──────────────────────────────────────────────────────────────────────────────

export const dependencyValidation: DependencyCheck[] = [
  { part: 'Part 11', name: 'Master Data Governance', flag: 'ff.mdm', flagState: 'ON (staging)', interfaces: 'material categories, UOM, employees via mdmService', regressionEvidence: 'part-11/regression-gate.md', result: 'PASS' },
  { part: 'Part 35', name: 'Advanced Stores & Inventory', flag: 'ff.stores', flagState: 'ON (staging)', interfaces: 'GRN lines (registration source), stores list, stock availability', regressionEvidence: 'part-35/stores-regression.md', result: 'PASS' },
  { part: 'Part 7', name: 'Protocol & Control Engine', flag: 'ff.pgm', flagState: 'ON', interfaces: 'protocol.check() on all paths', regressionEvidence: 'foundation suite', result: 'PASS' },
  { part: 'Part 10', name: 'Accountability & Action Ledger', flag: 'ff.pgm', flagState: 'ON', interfaces: 'action-ledger hook per custody txn', regressionEvidence: 'foundation suite', result: 'PASS' },
];

export const publishedContracts: ConsumerContract[] = [
  { part: 'Part 107', interface: 'GET /api/v1/tools/items?status=', kind: 'API', test: 'consumer-contract/part-107-tools-items.spec' },
  { part: 'Part 107', interface: 'tools.custody.changed', kind: 'EVENT', test: 'consumer-contract/part-107-tools-events.spec' },
  { part: 'Part 39', interface: 'tools.exitClearance.check(employeeId) → blocked?', kind: 'API', test: 'consumer-contract/part-39-exit-clearance.spec' },
  { part: 'Parts 45/46', interface: 'tool_loss_recoveries (approved rows) → payroll/deduction feed', kind: 'TABLE', test: 'consumer-contract/part-46-recovery-feed.spec' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Section 24 — integrations
// ──────────────────────────────────────────────────────────────────────────────

export const integrations: IntegrationRow[] = [
  { part: 'Part 11', name: 'Material master & employees', direction: 'inbound', mechanism: 'mdmService read', state: 'live' },
  { part: 'Part 35', name: 'GRN per-unit registration', direction: 'inbound', mechanism: 'storesService.getPostedGrnLines(category=tool)', state: 'live' },
  { part: 'Part 39', name: 'Exit clearance block', direction: 'outbound', mechanism: 'tools.exitClearance.check service call', state: 'live' },
  { part: 'Parts 45/46', name: 'Payroll / subcontract bill deductions', direction: 'outbound', mechanism: 'approved recovery → posting engine → bill line', state: 'adapter' },
  { part: 'Part 48', name: 'Capitalised asset link', direction: 'inbound', mechanism: 'asset lookup by capitalisedAssetId', state: 'planned' },
  { part: 'Part 52', name: 'Calibration register', direction: 'inbound', mechanism: 'qa_calibration_view snapshot', state: 'adapter' },
  { part: 'Part 78', name: 'DR-21 resource-gap signal', direction: 'outbound', mechanism: 'event tools.return.overdue → alert engine', state: 'live' },
  { part: 'Part 81', name: 'OTP acknowledgement', direction: 'inbound', mechanism: 'otpService.verify', state: 'live' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Derived stats
// ──────────────────────────────────────────────────────────────────────────────

export const toolsStats = {
  totalTools: toolItems.length,
  inStore: toolItems.filter(t => t.currentStatus === 'in_store').length,
  issued: toolItems.filter(t => t.currentStatus === 'issued').length,
  inTransit: toolItems.filter(t => t.currentStatus === 'in_transit').length,
  underRepair: toolItems.filter(t => t.currentStatus === 'under_repair').length,
  lost: toolItems.filter(t => t.currentStatus === 'lost').length,
  disposed: toolItems.filter(t => t.currentStatus === 'disposed').length,
  bookValue: toolItems.reduce((s, t) => s + t.cost, 0),
  netBookValue: toolItems.reduce((s, t) => s + t.depreciatedValue, 0),
  idleCount: idleTools.filter(i => i.idleDays > toolsConfig.idleThresholdDays).length,
  overdueCount: overdueReturns.length,
  openLosses: lossRecoveries.filter(l => l.status !== 'closed').length,
  recoveryApprovedValue: lossRecoveries.filter(l => l.status === 'recovery_approved').reduce((s, l) => s + l.amount, 0),
  calibrationBlocked: calibrationRegister.filter(c => c.issueBlocked).length,
  cvGaps: custodyVerifications.filter(v => v.status === 'gap_escalated').length,
};

export const launchpadTiles = [
  { role: 'Store Keeper', tiles: [
    { label: 'Issues awaiting ack', count: custodyTxns.filter(t => t.type === 'issue' && t.acknowledgementMethod !== 'none' ? 0 : t.type === 'issue' ? 0 : 0).length + custodyTxns.filter(t => (t.type === 'issue' || t.type === 'transfer') && t.acknowledgementMethod === 'none').length, tone: 'amber', navigateHint: 'Custody Queue' },
    { label: 'Returns today', count: custodyTxns.filter(t => t.type === 'return' && t.date === TODAY).length, tone: 'blue', navigateHint: 'Return Desk' },
    { label: 'Overdue returns', count: toolsStats.overdueCount, tone: 'red', navigateHint: 'Overdue Worklist' },
    { label: 'Unregistered GRN units', count: 2, tone: 'violet', navigateHint: 'Register from GRN' },
  ]},
  { role: 'Custodian', tiles: [
    { label: 'My tools', count: toolItems.filter(t => t.currentCustodianId === 'emp_102').length, tone: 'blue', navigateHint: 'My Tools' },
    { label: 'Awaiting my acknowledgement', count: 1, tone: 'amber', navigateHint: 'Acknowledge' },
    { label: 'Calibration due (mine)', count: calibrationRegister.filter(c => c.daysRemaining <= 30).length, tone: 'violet', navigateHint: 'Calibration' },
  ]},
  { role: 'Site Manager + HR/Commercial', tiles: [
    { label: 'Losses to approve', count: lossRecoveries.filter(l => l.status === 'investigated').length, tone: 'red', navigateHint: 'Loss Approvals' },
    { label: 'Custody gaps (DR-21)', count: toolsStats.cvGaps, tone: 'amber', navigateHint: 'Verification Gaps' },
  ]},
  { role: 'Project Manager', tiles: [
    { label: 'Disposals pending', count: 0, tone: 'slate', navigateHint: 'Disposal Approvals' },
    { label: 'Idle tools > 30 d', count: toolsStats.idleCount, tone: 'violet', navigateHint: 'Utilisation' },
  ]},
];

export const kpiWhys = [
  { kpi: 'Idle value ₹' + (idleTools.filter(i => i.idleDays > toolsConfig.idleThresholdDays).reduce((s, i) => s + i.cost, 0) / 100000).toFixed(1) + ' L', why: 'Welding machine (62 d) + UDT gauge (46 d) idle beyond 30-day threshold — drill: Utilisation → Store → Tool → last custody txn' },
  { kpi: 'Open losses ' + toolsStats.openLosses, why: 'LS-2026-0031 recovery approved (payroll ₹18.5k); LS-2026-0032 awaiting bill-deduction approval — CP-TOL-03 blocks closure until then' },
  { kpi: 'Calibration-blocked issues 1', why: 'Topcon GT-1000 due 20-Jan-2026 (−6 days); server-side block at CP-TOL-01 evaluation inside issue transaction' },
];
