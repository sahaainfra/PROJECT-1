// Part 36 — Tool & Small-Asset Tracking Data
// Data layer for the `tools` module (ff.tools). In production this is served by
// /api/v1/tools/*; in this workspace it is the typed fixture consumed by ToolsDashboard.
// Cross-references follow the existing fixture universe:
//   prj_001 Riverside Tower · prj_002 Highway Bridge Phase 2 · site_001 Block A · site_003 Main Site
//   usr_store_001 Suresh Nair (Store Keeper) · usr_pm_001 Rajesh Kumar (PM) · usr_sm_003 Vikram Singh (Site Manager)
//   GRN-2026-0289..0292 (Part 35 GRN register)

// ---------- Tool item ----------

export type TagType = 'qr' | 'barcode' | 'rfid';
export type ToolCategory = 'hand' | 'power' | 'survey' | 'safety' | 'IT' | 'other';
export type ToolStatus = 'in_store' | 'issued' | 'in_transit' | 'under_repair' | 'lost' | 'disposed';
export type ToolCondition = 'good' | 'fair' | 'damaged';

export interface ToolItem {
  id: string;
  toolId: string;                     // human tool number: TOL-2026-XXXX
  tagType: TagType;
  tagCode: string;                    // unique per section 10
  category: ToolCategory;
  make: string;
  model: string;
  serialNo: string;
  purchaseRef: string | null;         // GRN (Part 35) or bulk import
  purchaseDate: string;
  cost: number;
  capitalisedAssetId: string | null;  // Part 48 fixed assets (nullable)
  calibrationRequired: boolean;
  calibrationDueDate: string | null;  // Part 52 calibration register
  currentStatus: ToolStatus;
  currentCustodianId: string | null;  // employee or subcontractor; null = in store
  currentCustodianName: string | null;
  currentCustodianType: 'employee' | 'subcontractor' | 'store' | null;
  currentProjectId: string | null;
  currentSiteId: string | null;
  condition: ToolCondition;
  expectedReturnDate: string | null;
  lastTxnDate: string;
  version: number;                    // optimistic locking (section 10)
  isDeleted: boolean;                 // soft delete (SA-4)
}

// ---------- Custody transaction ----------

export type CustodyTxnType =
  | 'issue' | 'return' | 'transfer' | 'inspect'
  | 'repair_out' | 'repair_in' | 'lost' | 'recovered' | 'dispose';

export interface ToolCustodyTxn {
  id: string;
  txnNo: string;                      // TOL-TXN-2026-XXXX
  toolId: string;                     // tool_items.id
  toolNumber: string;                 // denormalised for display
  type: CustodyTxnType;
  fromParty: string;                  // employee/subcontractor/store name
  toParty: string;
  fromPartyType: 'employee' | 'subcontractor' | 'store';
  toPartyType: 'employee' | 'subcontractor' | 'store';
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  date: string;
  expectedReturnDate: string | null;
  condition: ToolCondition | null;
  remarks: string;
  photoDocIds: string[];
  acknowledgedBy: string | null;      // OTP/signature evidence (CP-TOL-01)
  ackMethod: 'otp' | 'signature' | null;
  performedBy: string;
  protocolCheck: 'PASS' | 'WARN' | 'EXCEPTION_REQUIRED' | 'BLOCK';
  protocolCpCode: string;
  version: number;
  createdAt: string;
}

// ---------- Loss / recovery ----------

export type RecoveryMethod = 'payroll' | 'bill_deduction' | 'write_off';

export interface ToolLossRecovery {
  id: string;
  recoveryNo: string;                 // TOL-LOS-2026-XXXX
  toolId: string;
  toolNumber: string;
  custodyTxnId: string | null;
  responsibleParty: string;
  responsiblePartyId: string;
  responsiblePartyType: 'employee' | 'subcontractor';
  lossType: 'damage' | 'loss';
  amount: number;                     // depreciated value per policy (section 9)
  depreciatedValue: number;
  method: RecoveryMethod;
  status: 'REPORTED' | 'INVESTIGATED' | 'RECOVERY_APPROVED' | 'WRITE_OFF_APPROVED' | 'CLOSED';
  investigationNote: string;
  approvedBy: string | null;
  approvedAt: string | null;
  closedAt: string | null;
  workflowInstanceId: string | null;
  createdAt: string;
  version: number;
}

// ---------- Custody verification (periodic confirmation, section 5.4) ----------

export interface ToolCustodyVerification {
  id: string;
  verificationNo: string;             // TOL-VER-2026-XXXX
  custodianId: string;
  custodianName: string;
  custodianType: 'employee' | 'subcontractor';
  projectId: string;
  projectName: string;
  periodStart: string;
  periodEnd: string;
  toolsInPossession: number;
  toolsConfirmed: number;
  toolsMissing: number;
  status: 'PENDING' | 'CONFIRMED' | 'PARTIAL' | 'OVERDUE';
  confirmedAt: string | null;
  escalationLevel: 'L1' | 'L2' | null;
}

// ---------- Tool register (section 5.1 / fixture) ----------

export const toolItems: ToolItem[] = [
  {
    id: 'tool_001', toolId: 'TOL-2026-0001', tagType: 'qr', tagCode: 'QR-TOL-0001',
    category: 'survey', make: 'Leica', model: 'TS07', serialNo: 'TS07-88412',
    purchaseRef: 'GRN-2026-0214', purchaseDate: '2025-11-04', cost: 585000,
    capitalisedAssetId: null, calibrationRequired: true, calibrationDueDate: '2026-01-20',
    currentStatus: 'issued', currentCustodianId: 'usr_eng_001', currentCustodianName: 'R. Iyer (Surveyor)',
    currentCustodianType: 'employee', currentProjectId: 'prj_001', currentSiteId: 'site_001',
    condition: 'good', expectedReturnDate: null, lastTxnDate: '2026-01-06', version: 3, isDeleted: false,
  },
  {
    id: 'tool_002', toolId: 'TOL-2026-0002', tagType: 'qr', tagCode: 'QR-TOL-0002',
    category: 'power', make: 'Bosch', model: 'GBH 2-26', serialNo: 'BOS-22104',
    purchaseRef: 'GRN-2026-0225', purchaseDate: '2025-11-18', cost: 14500,
    capitalisedAssetId: null, calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'issued', currentCustodianId: 'sub_001', currentCustodianName: 'Subcontractor Alpha',
    currentCustodianType: 'subcontractor', currentProjectId: 'prj_001', currentSiteId: 'site_001',
    condition: 'good', expectedReturnDate: '2026-01-12', lastTxnDate: '2025-12-28', version: 2, isDeleted: false,
  },
  {
    id: 'tool_003', toolId: 'TOL-2026-0003', tagType: 'barcode', tagCode: 'BC-TOL-0003',
    category: 'hand', make: 'Stanley', model: 'STMT74195', serialNo: 'STN-74195-14',
    purchaseRef: 'GRN-2026-0225', purchaseDate: '2025-11-18', cost: 8900,
    capitalisedAssetId: null, calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'in_store', currentCustodianId: null, currentCustodianName: null,
    currentCustodianType: 'store', currentProjectId: 'prj_001', currentSiteId: 'site_001',
    condition: 'good', expectedReturnDate: null, lastTxnDate: '2026-01-02', version: 4, isDeleted: false,
  },
  {
    id: 'tool_004', toolId: 'TOL-2026-0004', tagType: 'qr', tagCode: 'QR-TOL-0004',
    category: 'safety', make: 'MSA', model: 'Advantage 420', serialNo: 'MSA-420-77',
    purchaseRef: 'GRN-2026-0261', purchaseDate: '2025-12-09', cost: 6200,
    capitalisedAssetId: null, calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'issued', currentCustodianId: 'usr_store_001', currentCustodianName: 'Suresh Nair',
    currentCustodianType: 'employee', currentProjectId: 'prj_002', currentSiteId: 'site_003',
    condition: 'fair', expectedReturnDate: null, lastTxnDate: '2026-01-04', version: 2, isDeleted: false,
  },
  {
    id: 'tool_005', toolId: 'TOL-2026-0005', tagType: 'qr', tagCode: 'QR-TOL-0005',
    category: 'survey', make: 'Leica', model: 'GST05', serialNo: 'GST05-33019',
    purchaseRef: 'GRN-2026-0214', purchaseDate: '2025-11-04', cost: 245000,
    capitalisedAssetId: null, calibrationRequired: true, calibrationDueDate: '2026-01-08',
    currentStatus: 'in_store', currentCustodianId: null, currentCustodianName: null,
    currentCustodianType: 'store', currentProjectId: 'prj_001', currentSiteId: 'site_001',
    condition: 'good', expectedReturnDate: null, lastTxnDate: '2025-12-30', version: 5, isDeleted: false,
  },
  {
    id: 'tool_006', toolId: 'TOL-2026-0006', tagType: 'rfid', tagCode: 'RFID-E200-6C41',
    category: 'IT', make: 'Dell', model: 'Latitude 5440', serialNo: 'DL5440-9012',
    purchaseRef: null, purchaseDate: '2025-10-22', cost: 78000,
    capitalisedAssetId: 'FA-2025-0067', calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'issued', currentCustodianId: 'usr_qs_001', currentCustodianName: 'Anil Deshpande (QS)',
    currentCustodianType: 'employee', currentProjectId: 'prj_001', currentSiteId: 'site_001',
    condition: 'good', expectedReturnDate: null, lastTxnDate: '2025-10-23', version: 2, isDeleted: false,
  },
  {
    id: 'tool_007', toolId: 'TOL-2026-0007', tagType: 'qr', tagCode: 'QR-TOL-0007',
    category: 'power', make: 'Makita', model: 'HM0810T', serialNo: 'MAK-0810-55',
    purchaseRef: 'GRN-2026-0289', purchaseDate: '2025-12-27', cost: 21500,
    capitalisedAssetId: null, calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'issued', currentCustodianId: 'sub_002', currentCustodianName: 'Subcontractor Beta',
    currentCustodianType: 'subcontractor', currentProjectId: 'prj_002', currentSiteId: 'site_003',
    condition: 'fair', expectedReturnDate: '2026-01-10', lastTxnDate: '2025-12-20', version: 2, isDeleted: false,
  },
  {
    id: 'tool_008', toolId: 'TOL-2026-0008', tagType: 'qr', tagCode: 'QR-TOL-0008',
    category: 'hand', make: 'Taparia', model: '812 Socket Set', serialNo: 'TAP-812-31',
    purchaseRef: 'GRN-2026-0261', purchaseDate: '2025-12-09', cost: 4300,
    capitalisedAssetId: null, calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'under_repair', currentCustodianId: null, currentCustodianName: 'Tool Vendor — Precision Services',
    currentCustodianType: 'store', currentProjectId: 'prj_001', currentSiteId: 'site_001',
    condition: 'damaged', expectedReturnDate: '2026-01-22', lastTxnDate: '2026-01-09', version: 3, isDeleted: false,
  },
  {
    id: 'tool_009', toolId: 'TOL-2026-0009', tagType: 'qr', tagCode: 'QR-TOL-0009',
    category: 'power', make: 'Bosch', model: 'GWS 900', serialNo: 'BOS-900-42',
    purchaseRef: 'GRN-2026-0289', purchaseDate: '2025-12-27', cost: 6800,
    capitalisedAssetId: null, calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'lost', currentCustodianId: 'sub_001', currentCustodianName: 'Subcontractor Alpha',
    currentCustodianType: 'subcontractor', currentProjectId: 'prj_001', currentSiteId: 'site_001',
    condition: 'damaged', expectedReturnDate: null, lastTxnDate: '2026-01-11', version: 3, isDeleted: false,
  },
  {
    id: 'tool_010', toolId: 'TOL-2026-0010', tagType: 'barcode', tagCode: 'BC-TOL-0010',
    category: 'other', make: 'Imex', model: 'Laser Level EL-B', serialNo: 'IMX-ELB-08',
    purchaseRef: null, purchaseDate: '2025-08-14', cost: 12500,
    capitalisedAssetId: null, calibrationRequired: false, calibrationDueDate: null,
    currentStatus: 'in_store', currentCustodianId: null, currentCustodianName: null,
    currentCustodianType: 'store', currentProjectId: 'prj_002', currentSiteId: 'site_003',
    condition: 'good', expectedReturnDate: null, lastTxnDate: '2025-10-18', version: 2, isDeleted: false,
  },
];

// ---------- Custody ledger (append-only; section 11) ----------

export const toolCustodyTxns: ToolCustodyTxn[] = [
  {
    id: 'ttxn_001', txnNo: 'TOL-TXN-2026-0001', toolId: 'tool_001', toolNumber: 'TOL-2026-0001',
    type: 'issue', fromParty: 'Main Site Store', toParty: 'R. Iyer (Surveyor)',
    fromPartyType: 'store', toPartyType: 'employee',
    projectId: 'prj_001', projectName: 'Riverside Tower', siteId: 'site_001', siteName: 'Block A',
    date: '2026-01-06', expectedReturnDate: null, condition: 'good',
    remarks: 'Issued for setting out of Level 8 grid', photoDocIds: ['doc_tol_001'],
    acknowledgedBy: 'OTP-4821', ackMethod: 'otp', performedBy: 'usr_store_001',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-01', version: 1, createdAt: '2026-01-06T09:15:00Z',
  },
  {
    id: 'ttxn_002', txnNo: 'TOL-TXN-2026-0002', toolId: 'tool_002', toolNumber: 'TOL-2026-0002',
    type: 'issue', fromParty: 'Main Site Store', toParty: 'Subcontractor Alpha',
    fromPartyType: 'store', toPartyType: 'subcontractor',
    projectId: 'prj_001', projectName: 'Riverside Tower', siteId: 'site_001', siteName: 'Block A',
    date: '2025-12-28', expectedReturnDate: '2026-01-12', condition: 'good',
    remarks: 'Chipping works — slab pour backfill', photoDocIds: ['doc_tol_002'],
    acknowledgedBy: 'SIG-doc_tol_002', ackMethod: 'signature', performedBy: 'usr_store_001',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-01', version: 1, createdAt: '2025-12-28T11:40:00Z',
  },
  {
    id: 'ttxn_003', txnNo: 'TOL-TXN-2026-0003', toolId: 'tool_005', toolNumber: 'TOL-2026-0005',
    type: 'return', fromParty: 'R. Iyer (Surveyor)', toParty: 'Main Site Store',
    fromPartyType: 'employee', toPartyType: 'store',
    projectId: 'prj_001', projectName: 'Riverside Tower', siteId: 'site_001', siteName: 'Block A',
    date: '2025-12-30', expectedReturnDate: null, condition: 'good',
    remarks: 'Returned after Level 6 handover survey', photoDocIds: [],
    acknowledgedBy: null, ackMethod: null, performedBy: 'usr_store_001',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-01', version: 1, createdAt: '2025-12-30T16:05:00Z',
  },
  {
    id: 'ttxn_004', txnNo: 'TOL-TXN-2026-0004', toolId: 'tool_003', toolNumber: 'TOL-2026-0003',
    type: 'inspect', fromParty: 'Main Site Store', toParty: 'Main Site Store',
    fromPartyType: 'store', toPartyType: 'store',
    projectId: 'prj_001', projectName: 'Riverside Tower', siteId: 'site_001', siteName: 'Block A',
    date: '2026-01-02', expectedReturnDate: null, condition: 'good',
    remarks: 'Monthly condition inspection — passed', photoDocIds: ['doc_tol_003'],
    acknowledgedBy: null, ackMethod: null, performedBy: 'usr_store_001',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-02', version: 1, createdAt: '2026-01-02T10:00:00Z',
  },
  {
    id: 'ttxn_005', txnNo: 'TOL-TXN-2026-0005', toolId: 'tool_004', toolNumber: 'TOL-2026-0004',
    type: 'transfer', fromParty: 'Suresh Nair', toParty: 'Vikram Singh',
    fromPartyType: 'employee', toPartyType: 'employee',
    projectId: 'prj_002', projectName: 'Highway Bridge Phase 2', siteId: 'site_003', siteName: 'Main Site',
    date: '2026-01-04', expectedReturnDate: null, condition: 'fair',
    remarks: 'Site-to-site transfer with custodian change (safety harness re-assignment)', photoDocIds: [],
    acknowledgedBy: 'OTP-7734', ackMethod: 'otp', performedBy: 'usr_store_001',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-01', version: 1, createdAt: '2026-01-04T08:30:00Z',
  },
  {
    id: 'ttxn_006', txnNo: 'TOL-TXN-2026-0006', toolId: 'tool_008', toolNumber: 'TOL-2026-0008',
    type: 'repair_out', fromParty: 'Main Site Store', toParty: 'Tool Vendor — Precision Services',
    fromPartyType: 'store', toPartyType: 'store',
    projectId: 'prj_001', projectName: 'Riverside Tower', siteId: 'site_001', siteName: 'Block A',
    date: '2026-01-09', expectedReturnDate: '2026-01-22', condition: 'damaged',
    remarks: 'Ratchet mechanism failure — sent for repair', photoDocIds: ['doc_tol_004'],
    acknowledgedBy: null, ackMethod: null, performedBy: 'usr_store_001',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-02', version: 1, createdAt: '2026-01-09T14:20:00Z',
  },
  {
    id: 'ttxn_007', txnNo: 'TOL-TXN-2026-0007', toolId: 'tool_007', toolNumber: 'TOL-2026-0007',
    type: 'issue', fromParty: 'Main Site Store', toParty: 'Subcontractor Beta',
    fromPartyType: 'store', toPartyType: 'subcontractor',
    projectId: 'prj_002', projectName: 'Highway Bridge Phase 2', siteId: 'site_003', siteName: 'Main Site',
    date: '2025-12-20', expectedReturnDate: '2026-01-10', condition: 'fair',
    remarks: 'Demolition works at pier 3', photoDocIds: ['doc_tol_005'],
    acknowledgedBy: 'SIG-doc_tol_005', ackMethod: 'signature', performedBy: 'usr_store_001',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-01', version: 1, createdAt: '2025-12-20T09:50:00Z',
  },
  {
    id: 'ttxn_008', txnNo: 'TOL-TXN-2026-0008', toolId: 'tool_009', toolNumber: 'TOL-2026-0009',
    type: 'lost', fromParty: 'Subcontractor Alpha', toParty: 'Main Site Store',
    fromPartyType: 'subcontractor', toPartyType: 'store',
    projectId: 'prj_001', projectName: 'Riverside Tower', siteId: 'site_001', siteName: 'Block A',
    date: '2026-01-11', expectedReturnDate: null, condition: null,
    remarks: 'Not produced at custody verification PV check; reported lost — investigation opened', photoDocIds: ['doc_tol_006'],
    acknowledgedBy: null, ackMethod: null, performedBy: 'usr_sm_003',
    protocolCheck: 'EXCEPTION_REQUIRED', protocolCpCode: 'CP-TOL-02', version: 1, createdAt: '2026-01-11T17:00:00Z',
  },
  {
    id: 'ttxn_009', txnNo: 'TOL-TXN-2026-0009', toolId: 'tool_006', toolNumber: 'TOL-2026-0006',
    type: 'issue', fromParty: 'Central Warehouse', toParty: 'Anil Deshpande (QS)',
    fromPartyType: 'store', toPartyType: 'employee',
    projectId: 'prj_001', projectName: 'Riverside Tower', siteId: 'site_001', siteName: 'Block A',
    date: '2025-10-23', expectedReturnDate: null, condition: 'good',
    remarks: 'Capitalised IT device — long-term custodian assignment', photoDocIds: [],
    acknowledgedBy: 'OTP-1145', ackMethod: 'otp', performedBy: 'usr_store_002',
    protocolCheck: 'PASS', protocolCpCode: 'CP-TOL-01', version: 1, createdAt: '2025-10-23T07:45:00Z',
  },
];

// ---------- Losses & recoveries (section 5.5 / fixture) ----------

export const toolLossRecoveries: ToolLossRecovery[] = [
  {
    id: 'tlos_001', recoveryNo: 'TOL-LOS-2026-0001', toolId: 'tool_009', toolNumber: 'TOL-2026-0009',
    custodyTxnId: 'ttxn_008', responsibleParty: 'Subcontractor Alpha', responsiblePartyId: 'sub_001',
    responsiblePartyType: 'subcontractor', lossType: 'loss',
    amount: 5100, depreciatedValue: 5100, method: 'bill_deduction',
    status: 'INVESTIGATED',
    investigationNote: 'GRV tool not produced at custody verification. Subcontractor site supervisor interviewed 2026-01-12; recovery at depreciated value (12 months straight-line, 25% residual) via subcontractor bill deduction proposed.',
    approvedBy: null, approvedAt: null, closedAt: null,
    workflowInstanceId: 'wf_tol_los_001', createdAt: '2026-01-11T17:30:00Z', version: 2,
  },
  {
    id: 'tlos_002', recoveryNo: 'TOL-LOS-2026-0002', toolId: 'tool_002', toolNumber: 'TOL-2026-0002',
    custodyTxnId: 'ttxn_002', responsibleParty: 'Subcontractor Alpha', responsiblePartyId: 'sub_001',
    responsiblePartyType: 'subcontractor', lossType: 'damage',
    amount: 2900, depreciatedValue: 2900, method: 'bill_deduction',
    status: 'RECOVERY_APPROVED',
    investigationNote: 'Chuck housing cracked due to drop. Depreciated value (4 months, 25% residual) recovered via subcontractor bill deduction (Part 46).',
    approvedBy: 'usr_pm_001', approvedAt: '2026-01-13T10:15:00Z', closedAt: null,
    workflowInstanceId: 'wf_tol_los_002', createdAt: '2026-01-12T09:00:00Z', version: 3,
  },
  {
    id: 'tlos_003', recoveryNo: 'TOL-LOS-2026-0003', toolId: 'tool_004', toolNumber: 'TOL-2026-0004',
    custodyTxnId: null, responsibleParty: 'Suresh Nair', responsiblePartyId: 'usr_store_001',
    responsiblePartyType: 'employee', lossType: 'damage',
    amount: 1550, depreciatedValue: 1550, method: 'payroll',
    status: 'CLOSED',
    investigationNote: 'Webbing tear found at inspection. Fair wear and tear not established; custodian accepted 50% of depreciated value via payroll deduction (Part 45) after HR/Commercial approval.',
    approvedBy: 'usr_pm_001', approvedAt: '2026-01-07T12:00:00Z', closedAt: '2026-01-14T09:30:00Z',
    workflowInstanceId: 'wf_tol_los_003', createdAt: '2026-01-05T15:00:00Z', version: 4,
  },
];

// ---------- Custody verification (section 5.4 / fixture) ----------

export const toolCustodyVerifications: ToolCustodyVerification[] = [
  {
    id: 'tver_001', verificationNo: 'TOL-VER-2026-0001', custodianId: 'sub_001',
    custodianName: 'Subcontractor Alpha', custodianType: 'subcontractor',
    projectId: 'prj_001', projectName: 'Riverside Tower',
    periodStart: '2026-01-01', periodEnd: '2026-01-10',
    toolsInPossession: 4, toolsConfirmed: 3, toolsMissing: 1,
    status: 'PARTIAL', confirmedAt: '2026-01-10T18:00:00Z', escalationLevel: 'L1',
  },
  {
    id: 'tver_002', verificationNo: 'TOL-VER-2026-0002', custodianId: 'usr_eng_001',
    custodianName: 'R. Iyer (Surveyor)', custodianType: 'employee',
    projectId: 'prj_001', projectName: 'Riverside Tower',
    periodStart: '2026-01-01', periodEnd: '2026-01-10',
    toolsInPossession: 1, toolsConfirmed: 1, toolsMissing: 0,
    status: 'CONFIRMED', confirmedAt: '2026-01-09T11:20:00Z', escalationLevel: null,
  },
  {
    id: 'tver_003', verificationNo: 'TOL-VER-2026-0003', custodianId: 'sub_002',
    custodianName: 'Subcontractor Beta', custodianType: 'subcontractor',
    projectId: 'prj_002', projectName: 'Highway Bridge Phase 2',
    periodStart: '2026-01-01', periodEnd: '2026-01-15',
    toolsInPossession: 2, toolsConfirmed: 0, toolsMissing: 0,
    status: 'OVERDUE', confirmedAt: null, escalationLevel: 'L1',
  },
  {
    id: 'tver_004', verificationNo: 'TOL-VER-2026-0004', custodianId: 'usr_qs_001',
    custodianName: 'Anil Deshpande (QS)', custodianType: 'employee',
    projectId: 'prj_001', projectName: 'Riverside Tower',
    periodStart: '2026-01-01', periodEnd: '2026-01-31',
    toolsInPossession: 1, toolsConfirmed: 0, toolsMissing: 0,
    status: 'PENDING', confirmedAt: null, escalationLevel: null,
  },
];

// ---------- Protocol control points (section 8A) ----------
// Registered with the Protocol & Control Engine (Part 7) — seeded in OBSERVE (PC-13).

export const toolControlPoints = [
  {
    id: 'CP-TOL-01',
    stage: 'EXECUTE',
    control: 'Issue only to a named custodian with acknowledgement (OTP/signature)',
    enforcement: 'BLOCK',
    evidence: 'OTP / signature on custody txn',
    escalation: 'L2',
  },
  {
    id: 'CP-TOL-02',
    stage: 'MONITOR',
    control: 'Overdue returns and custody verification gaps (DR-21)',
    enforcement: 'MONITOR',
    evidence: 'custody ledger · verification status',
    escalation: 'L1 → L2',
  },
  {
    id: 'CP-TOL-03',
    stage: 'CLOSE',
    control: 'Loss closed only with recovery or approved write-off',
    enforcement: 'BLOCK',
    evidence: 'recovery / write-off approval',
    escalation: 'L2 → L3',
  },
];

// CP evaluation results for the register fixture (mirrors evaluations registry)
export const toolControlResults: Record<string, 'PASS' | 'WARN' | 'EXCEPTION_REQUIRED' | 'BLOCK'> = {
  'CP-TOL-01': 'PASS',
  'CP-TOL-02': 'EXCEPTION_REQUIRED',  // ttxn_008 lost tool pending investigation (OBSERVE: would not block)
  'CP-TOL-03': 'PASS',
};

// ---------- Real-time events (section 14) ----------
// Registered in EVENT_CATALOGUE.md; outbox → queue → Socket.IO rooms (SA-8).

export const toolEvents = [
  { event: 'tools.custody.changed', description: 'Custody ledger entry created (issue/return/transfer/repair/dispose)', room: 'project:{projectId}' },
  { event: 'tools.return.overdue', description: 'Expected return date passed without return', room: 'project:{projectId}' },
  { event: 'tools.loss.reported', description: 'Loss/damage reported and investigation opened', room: 'project:{projectId}' },
];

// ---------- Notifications (section 16) ----------

export const toolNotifications = [
  { level: 'action', text: 'Return overdue → custodian and supervisor (TOL-2026-0002, TOL-2026-0007)' },
  { level: 'critical', text: 'Loss reported → Site Manager (TOL-2026-0009, Subcontractor Alpha)' },
  { level: 'warning', text: 'Calibration due → Surveyor & Store Keeper (TOL-2026-0005 due 2026-01-08)' },
  { level: 'action', text: 'Custody verification pending → custodian (TOL-VER-2026-0003, TOL-VER-2026-0004)' },
  { level: 'info', text: 'Repair completed → Store Keeper for reissue (TOL-2026-0008)' },
];

// ---------- Permissions (section 7) ----------
// Keys registered in the permission registry (Part 5); deny by default, explicit deny wins.

export const toolPermissionKeys = [
  { key: 'tools.item.register', role: 'Store Keeper', description: 'Register tools from GRN / bulk import, print tags' },
  { key: 'tools.custody.issue', role: 'Store Keeper', description: 'Issue tool to named custodian' },
  { key: 'tools.custody.return', role: 'Store Keeper', description: 'Receive return with condition inspection' },
  { key: 'tools.custody.acknowledge', role: 'Custodian', description: 'Acknowledge custody (OTP/signature), confirm possession' },
  { key: 'tools.loss.approve', role: 'Site Manager + HR/Commercial', description: 'Approve recovery / write-off' },
  { key: 'tools.dispose.approve', role: 'Project Manager', description: 'Approve disposal' },
];

// ---------- Utilisation (section 5.7) ----------

export interface ToolUtilisation {
  siteId: string;
  siteName: string;
  toolsRequired: number;
  toolsAtSite: number;
  idleInStore: number;   // tools idle in store beyond N days (threshold: 30)
  idleBeyondThreshold: number;
}

export const toolUtilisation: ToolUtilisation[] = [
  { siteId: 'site_001', siteName: 'Block A — Riverside Tower', toolsRequired: 24, toolsAtSite: 21, idleInStore: 3, idleBeyondThreshold: 1 },
  { siteId: 'site_003', siteName: 'Main Site — Highway Bridge Ph 2', toolsRequired: 18, toolsAtSite: 14, idleInStore: 2, idleBeyondThreshold: 1 },
];

// Idle threshold (configurable per store / section 5.7)
export const IDLE_THRESHOLD_DAYS = 30;

// ---------- Stats ----------

export const toolsStats = {
  totalTools: toolItems.filter(t => !t.isDeleted).length,
  inStore: toolItems.filter(t => t.currentStatus === 'in_store').length,
  issued: toolItems.filter(t => t.currentStatus === 'issued').length,
  inTransit: toolItems.filter(t => t.currentStatus === 'in_transit').length,
  underRepair: toolItems.filter(t => t.currentStatus === 'under_repair').length,
  lost: toolItems.filter(t => t.currentStatus === 'lost').length,
  disposed: toolItems.filter(t => t.currentStatus === 'disposed').length,
  overdueReturns: toolItems.filter(t =>
    t.currentStatus === 'issued' &&
    t.expectedReturnDate !== null &&
    t.expectedReturnDate < '2026-01-15'
  ).length,
  calibrationDue: toolItems.filter(t =>
    t.calibrationRequired &&
    t.calibrationDueDate !== null &&
    t.calibrationDueDate <= '2026-01-15'
  ).length,
  openLosses: toolLossRecoveries.filter(l => l.status !== 'CLOSED').length,
  recoveryApprovedAmount: toolLossRecoveries
    .filter(l => l.status === 'RECOVERY_APPROVED')
    .reduce((s, l) => s + l.amount, 0),
  verificationPending: toolCustodyVerifications.filter(v => v.status === 'PENDING' || v.status === 'OVERDUE').length,
  idleBeyondThreshold: toolUtilisation.reduce((s, u) => s + u.idleBeyondThreshold, 0),
};
