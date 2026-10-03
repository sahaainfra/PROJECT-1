// Part 24 — Advanced QS / Quantity Surveying Data

export interface MBBook {
  id: string;
  mbNo: string;
  projectId: string;
  projectName: string;
  contractId?: string;
  type: 'client' | 'subcontract';
  issuedTo: string;
  status: 'open' | 'closed';
  totalEntries: number;
  certifiedEntries: number;
  createdAt: string;
  createdBy: string;
}

export interface MBEntry {
  id: string;
  mbBookId: string;
  entryNo: number;
  date: string;
  boqItemId: string;
  boqItemNo: string;
  boqItemDescription: string;
  activityId?: string;
  location?: string;
  chainageFrom?: string;
  chainageTo?: string;
  floor?: string;
  grid?: string;
  description: string;
  nos: number;
  length: number;
  breadth: number;
  depth: number;
  factor: number;
  quantity: number;
  isDeduction: boolean;
  drawingRef?: string;
  photosDocIds?: string[];
  measuredBy: string;
  measuredByName: string;
  checkMeasuredBy?: string;
  checkMeasuredByName?: string;
  checkStatus: 'pending' | 'accepted' | 'adjusted' | 'rejected';
  certifiedBillId?: string;
  locked: boolean;
}

export interface QuantityLedger {
  id: string;
  boqItemId: string;
  boqItemNo: string;
  boqItemDescription: string;
  period: string;
  contractQty: number;
  executedQty: number;
  measuredQty: number;
  certifiedQty: number;
  billedQty: number;
  balanceQty: number;
  forecastFinalQty: number;
  uom: string;
}

export interface Deviation {
  id: string;
  boqItemId: string;
  boqItemNo: string;
  boqItemDescription: string;
  contractQty: number;
  forecastQty: number;
  deviationPct: number;
  limitPct: number;
  status: 'normal' | 'warning' | 'critical' | 'exceeded';
  reason?: string;
}

export interface Variation {
  id: string;
  voNo: string;
  projectId: string;
  projectName: string;
  contractId?: string;
  type: 'addition' | 'omission' | 'substitution' | 'extra_item' | 'rate_revision';
  source: 'site_instruction' | 'drawing_revision' | 'client_letter';
  description: string;
  boqItemId?: string;
  boqItemNo?: string;
  newItemDesc?: string;
  uomId?: string;
  uomName?: string;
  qty: number;
  rate: number;
  amount: number;
  rateBasis: 'contract' | 'derived' | 'DSR' | 'market' | 'negotiated';
  rateAnalysisId?: string;
  status: 'identified' | 'priced' | 'submitted_to_client' | 'approved' | 'rejected' | 'part_approved' | 'incorporated';
  clientApprovalRef?: string;
  timeImpactDays?: number;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample MB Books
export const mbBooks: MBBook[] = [
  {
    id: 'mb_001',
    mbNo: 'MB-2026-001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'client',
    issuedTo: 'Metro Developers Pvt. Ltd.',
    status: 'open',
    totalEntries: 45,
    certifiedEntries: 32,
    createdAt: '2026-01-01T00:00:00Z',
    createdBy: 'usr_qs_001'
  },
  {
    id: 'mb_002',
    mbNo: 'MB-2026-002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'subcontract',
    issuedTo: 'ABC Constructions',
    status: 'open',
    totalEntries: 28,
    certifiedEntries: 20,
    createdAt: '2026-01-05T00:00:00Z',
    createdBy: 'usr_qs_001'
  },
  {
    id: 'mb_003',
    mbNo: 'MB-2025-045',
    projectId: 'prj_002',
    projectName: 'Highway Bridge Phase 2',
    type: 'client',
    issuedTo: 'National Highways Authority',
    status: 'closed',
    totalEntries: 156,
    certifiedEntries: 156,
    createdAt: '2025-10-01T00:00:00Z',
    createdBy: 'usr_qs_002'
  }
];

// Sample MB Entries
export const mbEntries: MBEntry[] = [
  {
    id: 'entry_001',
    mbBookId: 'mb_001',
    entryNo: 1,
    date: '2026-01-15',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    boqItemDescription: 'Excavation for foundation',
    location: 'Block A - Foundation',
    description: 'Excavation for footing F1',
    nos: 10,
    length: 5,
    breadth: 3,
    depth: 2,
    factor: 1,
    quantity: 300,
    isDeduction: false,
    drawingRef: 'DWG-STR-001 Rev C',
    photosDocIds: ['doc_photo_001', 'doc_photo_002'],
    measuredBy: 'usr_eng_001',
    measuredByName: 'Suresh Engineer',
    checkMeasuredBy: 'usr_qs_001',
    checkMeasuredByName: 'Vikram Patel',
    checkStatus: 'accepted',
    locked: true
  },
  {
    id: 'entry_002',
    mbBookId: 'mb_001',
    entryNo: 2,
    date: '2026-01-16',
    boqItemId: 'item_004',
    boqItemNo: 'A.1.2',
    boqItemDescription: 'PCC M15 (1:2:4)',
    location: 'Block A - Foundation',
    description: 'PCC under footing F1',
    nos: 10,
    length: 5.2,
    breadth: 3.2,
    depth: 0.15,
    factor: 1,
    quantity: 249.6,
    isDeduction: false,
    drawingRef: 'DWG-STR-001 Rev C',
    measuredBy: 'usr_eng_001',
    measuredByName: 'Suresh Engineer',
    checkMeasuredBy: 'usr_qs_001',
    checkMeasuredByName: 'Vikram Patel',
    checkStatus: 'accepted',
    locked: true
  },
  {
    id: 'entry_003',
    mbBookId: 'mb_001',
    entryNo: 3,
    date: '2026-01-18',
    boqItemId: 'item_005',
    boqItemNo: 'A.1.3',
    boqItemDescription: 'RCC M25 in foundation footing',
    location: 'Block A - Foundation',
    description: 'RCC in footing F1',
    nos: 10,
    length: 5,
    breadth: 3,
    depth: 1.2,
    factor: 1,
    quantity: 180,
    isDeduction: false,
    drawingRef: 'DWG-STR-002 Rev B',
    measuredBy: 'usr_eng_001',
    measuredByName: 'Suresh Engineer',
    checkStatus: 'pending',
    locked: false
  },
  {
    id: 'entry_004',
    mbBookId: 'mb_001',
    entryNo: 4,
    date: '2026-01-20',
    boqItemId: 'item_007',
    boqItemNo: 'A.2.1',
    boqItemDescription: 'RCC M30 in columns',
    location: 'Block A - Ground Floor',
    floor: 'Ground Floor',
    grid: 'A1-A5',
    description: 'RCC in columns C1 to C20',
    nos: 20,
    length: 0.6,
    breadth: 0.6,
    depth: 3.5,
    factor: 1,
    quantity: 252,
    isDeduction: false,
    drawingRef: 'DWG-STR-005 Rev A',
    measuredBy: 'usr_eng_001',
    measuredByName: 'Suresh Engineer',
    checkStatus: 'pending',
    locked: false
  },
  {
    id: 'entry_005',
    mbBookId: 'mb_002',
    entryNo: 1,
    date: '2026-01-15',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    boqItemDescription: 'Excavation for foundation',
    location: 'Block A - Foundation',
    description: 'Excavation for footing F1 (Subcontract)',
    nos: 10,
    length: 5,
    breadth: 3,
    depth: 2,
    factor: 1,
    quantity: 300,
    isDeduction: false,
    measuredBy: 'usr_sub_001',
    measuredByName: 'ABC Constructions Rep',
    checkMeasuredBy: 'usr_qs_001',
    checkMeasuredByName: 'Vikram Patel',
    checkStatus: 'accepted',
    locked: true
  }
];

// Sample Quantity Ledger
export const quantityLedger: QuantityLedger[] = [
  {
    id: 'ledger_001',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    boqItemDescription: 'Excavation for foundation',
    period: '2026-01',
    contractQty: 2500,
    executedQty: 2450,
    measuredQty: 2400,
    certifiedQty: 2300,
    billedQty: 2200,
    balanceQty: 200,
    forecastFinalQty: 2550,
    uom: 'Cum'
  },
  {
    id: 'ledger_002',
    boqItemId: 'item_004',
    boqItemNo: 'A.1.2',
    boqItemDescription: 'PCC M15 (1:2:4)',
    period: '2026-01',
    contractQty: 800,
    executedQty: 780,
    measuredQty: 750,
    certifiedQty: 720,
    billedQty: 700,
    balanceQty: 80,
    forecastFinalQty: 810,
    uom: 'Cum'
  },
  {
    id: 'ledger_003',
    boqItemId: 'item_005',
    boqItemNo: 'A.1.3',
    boqItemDescription: 'RCC M25 in foundation footing',
    period: '2026-01',
    contractQty: 1200,
    executedQty: 1150,
    measuredQty: 1100,
    certifiedQty: 1050,
    billedQty: 1000,
    balanceQty: 150,
    forecastFinalQty: 1220,
    uom: 'Cum'
  },
  {
    id: 'ledger_004',
    boqItemId: 'item_007',
    boqItemNo: 'A.2.1',
    boqItemDescription: 'RCC M30 in columns',
    period: '2026-01',
    contractQty: 1800,
    executedQty: 1200,
    measuredQty: 1150,
    certifiedQty: 1100,
    billedQty: 1050,
    balanceQty: 700,
    forecastFinalQty: 1850,
    uom: 'Cum'
  },
  {
    id: 'ledger_005',
    boqItemId: 'item_008',
    boqItemNo: 'A.2.2',
    boqItemDescription: 'Steel reinforcement TMT Fe500',
    period: '2026-01',
    contractQty: 450,
    executedQty: 420,
    measuredQty: 410,
    certifiedQty: 400,
    billedQty: 390,
    balanceQty: 50,
    forecastFinalQty: 460,
    uom: 'MT'
  }
];

// Sample Deviations
export const deviations: Deviation[] = [
  {
    id: 'dev_001',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    boqItemDescription: 'Excavation for foundation',
    contractQty: 2500,
    forecastQty: 2550,
    deviationPct: 2.0,
    limitPct: 25,
    status: 'normal'
  },
  {
    id: 'dev_002',
    boqItemId: 'item_004',
    boqItemNo: 'A.1.2',
    boqItemDescription: 'PCC M15 (1:2:4)',
    contractQty: 800,
    forecastQty: 810,
    deviationPct: 1.25,
    limitPct: 25,
    status: 'normal'
  },
  {
    id: 'dev_003',
    boqItemId: 'item_005',
    boqItemNo: 'A.1.3',
    boqItemDescription: 'RCC M25 in foundation footing',
    contractQty: 1200,
    forecastQty: 1220,
    deviationPct: 1.67,
    limitPct: 25,
    status: 'normal'
  },
  {
    id: 'dev_004',
    boqItemId: 'item_007',
    boqItemNo: 'A.2.1',
    boqItemDescription: 'RCC M30 in columns',
    contractQty: 1800,
    forecastQty: 1850,
    deviationPct: 2.78,
    limitPct: 25,
    status: 'normal'
  },
  {
    id: 'dev_005',
    boqItemId: 'item_008',
    boqItemNo: 'A.2.2',
    boqItemDescription: 'Steel reinforcement TMT Fe500',
    contractQty: 450,
    forecastQty: 460,
    deviationPct: 2.22,
    limitPct: 25,
    status: 'normal'
  }
];

// Sample Variations
export const variations: Variation[] = [
  {
    id: 'var_001',
    voNo: 'VO-2026-001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'addition',
    source: 'site_instruction',
    description: 'Additional excavation due to unexpected rock formation',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    uomId: 'uom_cum',
    uomName: 'Cum',
    qty: 150,
    rate: 350,
    amount: 52500,
    rateBasis: 'derived',
    rateAnalysisId: 'ra_extra_001',
    status: 'approved',
    clientApprovalRef: 'CL-SI-2026-015',
    timeImpactDays: 5,
    createdAt: '2026-01-10T10:00:00Z',
    createdBy: 'usr_qs_001',
    createdByName: 'Vikram Patel',
    approvedAt: '2026-01-15T14:00:00Z',
    approvedBy: 'usr_cm_001'
  },
  {
    id: 'var_002',
    voNo: 'VO-2026-002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'substitution',
    source: 'drawing_revision',
    description: 'Substitution of M25 concrete with M30 in foundation footing as per revised drawing',
    boqItemId: 'item_005',
    boqItemNo: 'A.1.3',
    uomId: 'uom_cum',
    uomName: 'Cum',
    qty: 0,
    rate: 500,
    amount: 0,
    rateBasis: 'contract',
    status: 'submitted_to_client',
    createdAt: '2026-01-18T11:00:00Z',
    createdBy: 'usr_qs_001',
    createdByName: 'Vikram Patel'
  },
  {
    id: 'var_003',
    voNo: 'VO-2026-003',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'extra_item',
    source: 'client_letter',
    description: 'Extra item: Waterproofing treatment for basement walls',
    newItemDesc: 'Providing and applying waterproofing treatment to basement walls',
    uomId: 'uom_sqm',
    uomName: 'Sqm',
    qty: 450,
    rate: 280,
    amount: 126000,
    rateBasis: 'DSR',
    rateAnalysisId: 'ra_extra_002',
    status: 'identified',
    createdAt: '2026-01-20T09:00:00Z',
    createdBy: 'usr_qs_001',
    createdByName: 'Vikram Patel'
  },
  {
    id: 'var_004',
    voNo: 'VO-2026-004',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'omission',
    source: 'drawing_revision',
    description: 'Omission of decorative cladding in lobby area as per client request',
    boqItemId: 'item_015',
    boqItemNo: 'B.3.2',
    uomId: 'uom_sqm',
    uomName: 'Sqm',
    qty: -120,
    rate: 1200,
    amount: -144000,
    rateBasis: 'contract',
    status: 'approved',
    clientApprovalRef: 'CL-LET-2026-028',
    timeImpactDays: -3,
    createdAt: '2026-01-12T14:00:00Z',
    createdBy: 'usr_qs_001',
    createdByName: 'Vikram Patel',
    approvedAt: '2026-01-16T10:00:00Z',
    approvedBy: 'usr_cm_001'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-QS-01',
    stage: 'RECORD',
    control: 'MB entry must reference location/chainage, drawing revision and (for listed items) photo; work must exist in DPR for that location',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-QS-02',
    stage: 'VERIFY',
    control: 'Measured qty ≤ executed qty (DPR/WA) + tolerance; duplicate location/item check',
    enforcement: 'BLOCK / EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-QS-03',
    stage: 'APPROVE',
    control: 'Check-measurement by a different person than the measurer',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-QS-04',
    stage: 'VERIFY',
    control: 'Cumulative certified qty beyond deviation limit needs approved variation',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-QS-05',
    stage: 'RECONCILE',
    control: 'Monthly quantity reconciliation executed vs measured vs certified vs billed',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-QS-06',
    stage: 'CLOSE',
    control: 'Certified entries locked; reversal only with reason and approval',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const qsStats = {
  totalMBBooks: mbBooks.length,
  openMBBooks: mbBooks.filter(mb => mb.status === 'open').length,
  closedMBBooks: mbBooks.filter(mb => mb.status === 'closed').length,
  totalMBEntries: mbEntries.length,
  certifiedEntries: mbEntries.filter(e => e.locked).length,
  pendingCheck: mbEntries.filter(e => e.checkStatus === 'pending').length,
  totalVariations: variations.length,
  approvedVariations: variations.filter(v => v.status === 'approved').length,
  pendingVariations: variations.filter(v => ['identified', 'priced', 'submitted_to_client'].includes(v.status)).length,
  totalDeviations: deviations.length,
  normalDeviations: deviations.filter(d => d.status === 'normal').length,
  warningDeviations: deviations.filter(d => d.status === 'warning').length,
  criticalDeviations: deviations.filter(d => d.status === 'critical').length
};

// Reconciliation Summary
export const reconciliationSummary = {
  totalContractQty: quantityLedger.reduce((sum, l) => sum + l.contractQty, 0),
  totalExecutedQty: quantityLedger.reduce((sum, l) => sum + l.executedQty, 0),
  totalMeasuredQty: quantityLedger.reduce((sum, l) => sum + l.measuredQty, 0),
  totalCertifiedQty: quantityLedger.reduce((sum, l) => sum + l.certifiedQty, 0),
  totalBilledQty: quantityLedger.reduce((sum, l) => sum + l.billedQty, 0),
  totalBalanceQty: quantityLedger.reduce((sum, l) => sum + l.balanceQty, 0),
  totalForecastQty: quantityLedger.reduce((sum, l) => sum + l.forecastFinalQty, 0)
};
