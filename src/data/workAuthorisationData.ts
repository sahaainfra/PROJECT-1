// Part 29 — Work Authorisation & Plan-Before-Execute Control Data

export interface WorkAuthorisation {
  id: string;
  waNo: string;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  validFrom: string;
  validTo: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  wbsNodeId: string;
  wbsNodeCode: string;
  workFrontId: string;
  workFrontName: string;
  location: string;
  chainageFrom?: string;
  chainageTo?: string;
  responsibleId: string;
  responsibleName: string;
  supervisorId: string;
  supervisorName: string;
  status: 'draft' | 'submitted' | 'verified' | 'approved' | 'active' | 'closed' | 'expired' | 'cancelled';
  dailyPlanLineId?: string;
  permitIds: string[];
  drawingRevisionIds: string[];
  methodStatementDocId?: string;
  budgetLineId: string;
  budgetCheckResult: 'pass' | 'warn' | 'fail';
  workflowInstanceId?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  approvedAt?: string;
  approvedBy?: string;
  closedAt?: string;
  closedBy?: string;
  lines: WALine[];
  reservations: WAReservation[];
}

export interface WALine {
  id: string;
  waId: string;
  resourceType: 'output' | 'material' | 'labour' | 'plant';
  resourceId: string;
  resourceName: string;
  tradeOrCategory?: string;
  plannedQty: number;
  uomId: string;
  uomName: string;
  normBasis: string;
  authorisedQty: number;
  consumedQty: number;
  balanceQty: number;
  wastagePct?: number;
}

export interface WAReservation {
  id: string;
  waLineId: string;
  storeId?: string;
  storeName?: string;
  plantId?: string;
  plantName?: string;
  crewId?: string;
  crewName?: string;
  reservedQty: number;
  reservedFrom: string;
  reservedTo: string;
  status: 'reserved' | 'released' | 'consumed';
}

export interface VerificationCheck {
  id: string;
  waId: string;
  checkType: 'plan_exists' | 'budget_available' | 'stock_available' | 'plant_available' | 'manpower_available' | 'permit_valid' | 'drawing_current' | 'predecessor_complete' | 'raci_assigned';
  checkName: string;
  status: 'pass' | 'warn' | 'fail' | 'exception';
  message: string;
  details?: string;
  exceptionId?: string;
  checkedAt: string;
  checkedBy: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Work Authorisations
export const workAuthorisations: WorkAuthorisation[] = [
  {
    id: 'wa_001',
    waNo: 'WA-2026-0142',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-16',
    shift: 'morning',
    validFrom: '2026-01-16T08:00:00Z',
    validTo: '2026-01-16T17:00:00Z',
    activityId: 'act_006',
    activityCode: 'A2010',
    activityName: 'RCC M30 in Columns (G+F)',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    workFrontId: 'wf_003',
    workFrontName: 'Column C1-C5 (Ground Floor)',
    location: 'Block A - Ground Floor',
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    supervisorId: 'usr_sup_001',
    supervisorName: 'Rajesh Supervisor',
    status: 'active',
    dailyPlanLineId: 'line_003',
    permitIds: ['permit_001'],
    drawingRevisionIds: ['dwg_005_rev_a'],
    methodStatementDocId: 'doc_method_001',
    budgetLineId: 'bl_004',
    budgetCheckResult: 'pass',
    createdAt: '2026-01-15T18:00:00Z',
    createdBy: 'usr_eng_001',
    createdByName: 'Suresh Engineer',
    approvedAt: '2026-01-15T19:00:00Z',
    approvedBy: 'usr_sm_001',
    lines: [
      {
        id: 'wal_001',
        waId: 'wa_001',
        resourceType: 'output',
        resourceId: 'act_006',
        resourceName: 'RCC M30 in Columns',
        plannedQty: 45,
        uomId: 'uom_cum',
        uomName: 'Cum',
        normBasis: 'schedule',
        authorisedQty: 45,
        consumedQty: 30,
        balanceQty: 15
      },
      {
        id: 'wal_002',
        waId: 'wa_001',
        resourceType: 'material',
        resourceId: 'mat_005',
        resourceName: 'RCC M30',
        plannedQty: 45,
        uomId: 'uom_cum',
        uomName: 'Cum',
        normBasis: '1:1.5:3',
        authorisedQty: 47.25,
        consumedQty: 31.5,
        balanceQty: 15.75,
        wastagePct: 5
      },
      {
        id: 'wal_003',
        waId: 'wa_001',
        resourceType: 'material',
        resourceId: 'mat_001',
        resourceName: 'Steel TMT 16mm',
        plannedQty: 5.4,
        uomId: 'uom_mt',
        uomName: 'MT',
        normBasis: '0.12 MT/cum',
        authorisedQty: 5.54,
        consumedQty: 3.7,
        balanceQty: 1.84,
        wastagePct: 2.5
      },
      {
        id: 'wal_004',
        waId: 'wa_001',
        resourceType: 'labour',
        resourceId: 'lab_003',
        resourceName: 'Steel Fixer',
        tradeOrCategory: 'Steel',
        plannedQty: 25,
        uomId: 'uom_nos',
        uomName: 'Nos',
        normBasis: 'crew',
        authorisedQty: 25,
        consumedQty: 25,
        balanceQty: 0
      },
      {
        id: 'wal_005',
        waId: 'wa_001',
        resourceType: 'labour',
        resourceId: 'lab_002',
        resourceName: 'Mason',
        tradeOrCategory: 'Concrete',
        plannedQty: 15,
        uomId: 'uom_nos',
        uomName: 'Nos',
        normBasis: 'crew',
        authorisedQty: 15,
        consumedQty: 15,
        balanceQty: 0
      },
      {
        id: 'wal_006',
        waId: 'wa_001',
        resourceType: 'plant',
        resourceId: 'plt_003',
        resourceName: 'Tower Crane',
        tradeOrCategory: 'Hoisting',
        plannedQty: 9,
        uomId: 'uom_hour',
        uomName: 'Hour',
        normBasis: 'shift',
        authorisedQty: 9,
        consumedQty: 6,
        balanceQty: 3
      }
    ],
    reservations: [
      {
        id: 'war_001',
        waLineId: 'wal_002',
        storeId: 'store_001',
        storeName: 'Block A Store',
        reservedQty: 47.25,
        reservedFrom: '2026-01-16T07:00:00Z',
        reservedTo: '2026-01-16T18:00:00Z',
        status: 'consumed'
      },
      {
        id: 'war_002',
        waLineId: 'wal_003',
        storeId: 'store_001',
        storeName: 'Block A Store',
        reservedQty: 5.54,
        reservedFrom: '2026-01-16T07:00:00Z',
        reservedTo: '2026-01-16T18:00:00Z',
        status: 'reserved'
      },
      {
        id: 'war_003',
        waLineId: 'wal_006',
        plantId: 'plant_003',
        plantName: 'Tower Crane TC-01',
        reservedQty: 9,
        reservedFrom: '2026-01-16T08:00:00Z',
        reservedTo: '2026-01-16T17:00:00Z',
        status: 'consumed'
      }
    ]
  },
  {
    id: 'wa_002',
    waNo: 'WA-2026-0143',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-16',
    shift: 'morning',
    validFrom: '2026-01-16T08:00:00Z',
    validTo: '2026-01-16T17:00:00Z',
    activityId: 'act_008',
    activityCode: 'A2030',
    activityName: 'Slab Casting (G+F)',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    workFrontId: 'wf_004',
    workFrontName: 'Slab Casting - Ground Floor',
    location: 'Block A - Ground Floor',
    responsibleId: 'usr_eng_002',
    responsibleName: 'Amit Engineer',
    supervisorId: 'usr_sup_003',
    supervisorName: 'Vikram Supervisor',
    status: 'submitted',
    dailyPlanLineId: 'line_004',
    permitIds: ['permit_002', 'permit_003'],
    drawingRevisionIds: ['dwg_010_rev_b'],
    budgetLineId: 'bl_005',
    budgetCheckResult: 'warn',
    createdAt: '2026-01-15T18:30:00Z',
    createdBy: 'usr_eng_002',
    createdByName: 'Amit Engineer',
    lines: [
      {
        id: 'wal_007',
        waId: 'wa_002',
        resourceType: 'output',
        resourceId: 'act_008',
        resourceName: 'Slab Casting',
        plannedQty: 120,
        uomId: 'uom_cum',
        uomName: 'Cum',
        normBasis: 'schedule',
        authorisedQty: 120,
        consumedQty: 0,
        balanceQty: 120
      },
      {
        id: 'wal_008',
        waId: 'wa_002',
        resourceType: 'material',
        resourceId: 'mat_005',
        resourceName: 'RCC M30',
        plannedQty: 120,
        uomId: 'uom_cum',
        uomName: 'Cum',
        normBasis: '1:1.5:3',
        authorisedQty: 126,
        consumedQty: 0,
        balanceQty: 126,
        wastagePct: 5
      },
      {
        id: 'wal_009',
        waId: 'wa_002',
        resourceType: 'labour',
        resourceId: 'lab_002',
        resourceName: 'Mason',
        tradeOrCategory: 'Concrete',
        plannedQty: 30,
        uomId: 'uom_nos',
        uomName: 'Nos',
        normBasis: 'crew',
        authorisedQty: 30,
        consumedQty: 0,
        balanceQty: 30
      }
    ],
    reservations: []
  },
  {
    id: 'wa_003',
    waNo: 'WA-2026-0141',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-15',
    shift: 'morning',
    validFrom: '2026-01-15T08:00:00Z',
    validTo: '2026-01-15T17:00:00Z',
    activityId: 'act_006',
    activityCode: 'A2010',
    activityName: 'RCC M30 in Columns (G+F)',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    workFrontId: 'wf_003',
    workFrontName: 'Column C1-C5 (Ground Floor)',
    location: 'Block A - Ground Floor',
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    supervisorId: 'usr_sup_001',
    supervisorName: 'Rajesh Supervisor',
    status: 'closed',
    dailyPlanLineId: 'line_001',
    permitIds: ['permit_001'],
    drawingRevisionIds: ['dwg_005_rev_a'],
    budgetLineId: 'bl_004',
    budgetCheckResult: 'pass',
    createdAt: '2026-01-14T18:00:00Z',
    createdBy: 'usr_eng_001',
    createdByName: 'Suresh Engineer',
    approvedAt: '2026-01-14T19:00:00Z',
    approvedBy: 'usr_sm_001',
    closedAt: '2026-01-15T18:00:00Z',
    closedBy: 'usr_eng_001',
    lines: [
      {
        id: 'wal_010',
        waId: 'wa_003',
        resourceType: 'output',
        resourceId: 'act_006',
        resourceName: 'RCC M30 in Columns',
        plannedQty: 40,
        uomId: 'uom_cum',
        uomName: 'Cum',
        normBasis: 'schedule',
        authorisedQty: 40,
        consumedQty: 40,
        balanceQty: 0
      },
      {
        id: 'wal_011',
        waId: 'wa_003',
        resourceType: 'material',
        resourceId: 'mat_005',
        resourceName: 'RCC M30',
        plannedQty: 40,
        uomId: 'uom_cum',
        uomName: 'Cum',
        normBasis: '1:1.5:3',
        authorisedQty: 42,
        consumedQty: 41,
        balanceQty: 1,
        wastagePct: 5
      }
    ],
    reservations: []
  },
  {
    id: 'wa_004',
    waNo: 'WA-2026-0144',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-16',
    shift: 'afternoon',
    validFrom: '2026-01-16T13:00:00Z',
    validTo: '2026-01-16T22:00:00Z',
    activityId: 'act_009',
    activityCode: 'A3010',
    activityName: 'Masonry Work (G+F)',
    wbsNodeId: 'wbs_005',
    wbsNodeCode: '1.1.3',
    workFrontId: 'wf_005',
    workFrontName: 'Masonry Work - Ground Floor',
    location: 'Block A - Ground Floor',
    responsibleId: 'usr_eng_002',
    responsibleName: 'Amit Engineer',
    supervisorId: 'usr_sup_002',
    supervisorName: 'Amit Supervisor',
    status: 'approved',
    dailyPlanLineId: 'line_005',
    permitIds: [],
    drawingRevisionIds: ['dwg_015_rev_c'],
    budgetLineId: 'bl_006',
    budgetCheckResult: 'pass',
    createdAt: '2026-01-15T18:45:00Z',
    createdBy: 'usr_eng_002',
    createdByName: 'Amit Engineer',
    approvedAt: '2026-01-15T19:30:00Z',
    approvedBy: 'usr_sm_001',
    lines: [
      {
        id: 'wal_012',
        waId: 'wa_004',
        resourceType: 'output',
        resourceId: 'act_009',
        resourceName: 'Masonry Work',
        plannedQty: 50,
        uomId: 'uom_sqm',
        uomName: 'Sqm',
        normBasis: 'schedule',
        authorisedQty: 50,
        consumedQty: 0,
        balanceQty: 50
      },
      {
        id: 'wal_013',
        waId: 'wa_004',
        resourceType: 'material',
        resourceId: 'mat_006',
        resourceName: 'Bricks (Standard)',
        plannedQty: 15000,
        uomId: 'uom_nos',
        uomName: 'Nos',
        normBasis: '300 nos/sqm',
        authorisedQty: 15750,
        consumedQty: 0,
        balanceQty: 15750,
        wastagePct: 5
      },
      {
        id: 'wal_014',
        waId: 'wa_004',
        resourceType: 'labour',
        resourceId: 'lab_002',
        resourceName: 'Mason',
        tradeOrCategory: 'Masonry',
        plannedQty: 12,
        uomId: 'uom_nos',
        uomName: 'Nos',
        normBasis: 'crew',
        authorisedQty: 12,
        consumedQty: 0,
        balanceQty: 12
      }
    ],
    reservations: []
  }
];

// Sample Verification Checks
export const verificationChecks: VerificationCheck[] = [
  {
    id: 'vc_001',
    waId: 'wa_001',
    checkType: 'plan_exists',
    checkName: 'Daily Plan Exists',
    status: 'pass',
    message: 'Approved daily plan found for this activity',
    checkedAt: '2026-01-15T18:05:00Z',
    checkedBy: 'system'
  },
  {
    id: 'vc_002',
    waId: 'wa_001',
    checkType: 'budget_available',
    checkName: 'Budget Availability',
    status: 'pass',
    message: 'Sufficient budget available (₹2.5 L remaining)',
    checkedAt: '2026-01-15T18:05:00Z',
    checkedBy: 'system'
  },
  {
    id: 'vc_003',
    waId: 'wa_001',
    checkType: 'stock_available',
    checkName: 'Material Stock Availability',
    status: 'pass',
    message: 'All materials available in store',
    checkedAt: '2026-01-15T18:05:00Z',
    checkedBy: 'system'
  },
  {
    id: 'vc_004',
    waId: 'wa_001',
    checkType: 'permit_valid',
    checkName: 'Permit Validation',
    status: 'pass',
    message: 'Hot work permit valid for WA duration',
    checkedAt: '2026-01-15T18:05:00Z',
    checkedBy: 'system'
  },
  {
    id: 'vc_005',
    waId: 'wa_002',
    checkType: 'budget_available',
    checkName: 'Budget Availability',
    status: 'warn',
    message: 'Budget utilization at 92%. Only ₹8 L remaining.',
    details: 'Consider cost optimization',
    checkedAt: '2026-01-15T18:35:00Z',
    checkedBy: 'system'
  },
  {
    id: 'vc_006',
    waId: 'wa_002',
    checkType: 'predecessor_complete',
    checkName: 'Predecessor Activity Complete',
    status: 'fail',
    message: 'Predecessor activity A2020 (RCC Beams) not yet complete',
    details: 'Activity 67% complete, expected finish 2026-01-20',
    exceptionId: 'exc_001',
    checkedAt: '2026-01-15T18:35:00Z',
    checkedBy: 'system'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-WA-01',
    stage: 'PLAN',
    control: 'WA must derive from an approved daily plan/look-ahead line',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-WA-02',
    stage: 'VERIFY',
    control: 'Budget, stock, plant, manpower, permit, drawing revision, predecessor/IR checks pass',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-WA-03',
    stage: 'APPROVE',
    control: 'WA approved by Site Manager (maker ≠ checker)',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-WA-04',
    stage: 'EXECUTE',
    control: 'Issue/labour/plant/DPR/MB transactions reference an ACTIVE WA line with balance',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-WA-05',
    stage: 'RECORD',
    control: 'DPR quantities recorded against WA by cut-off',
    enforcement: 'WARN',
    status: 'observe'
  },
  {
    id: 'CP-WA-06',
    stage: 'RECONCILE',
    control: 'WA closure reconciles authorised vs consumed with reason codes; unused material returned within 24 h',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-WA-07',
    stage: 'CLOSE',
    control: 'Expired WAs auto-closed only after variance review',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const waStats = {
  totalWAs: workAuthorisations.length,
  draftWAs: workAuthorisations.filter(wa => wa.status === 'draft').length,
  submittedWAs: workAuthorisations.filter(wa => wa.status === 'submitted').length,
  approvedWAs: workAuthorisations.filter(wa => wa.status === 'approved').length,
  activeWAs: workAuthorisations.filter(wa => wa.status === 'active').length,
  closedWAs: workAuthorisations.filter(wa => wa.status === 'closed').length,
  expiredWAs: workAuthorisations.filter(wa => wa.status === 'expired').length,
  totalLines: workAuthorisations.reduce((sum, wa) => sum + wa.lines.length, 0),
  totalReservations: workAuthorisations.reduce((sum, wa) => sum + wa.reservations.length, 0),
  budgetCheckPass: workAuthorisations.filter(wa => wa.budgetCheckResult === 'pass').length,
  budgetCheckWarn: workAuthorisations.filter(wa => wa.budgetCheckResult === 'warn').length,
  budgetCheckFail: workAuthorisations.filter(wa => wa.budgetCheckResult === 'fail').length
};

// Balance Summary
export const balanceSummary = {
  totalAuthorised: workAuthorisations.reduce((sum, wa) => 
    sum + wa.lines.filter(l => l.resourceType === 'output').reduce((s, l) => s + l.authorisedQty, 0), 0
  ),
  totalConsumed: workAuthorisations.reduce((sum, wa) => 
    sum + wa.lines.filter(l => l.resourceType === 'output').reduce((s, l) => s + l.consumedQty, 0), 0
  ),
  totalBalance: workAuthorisations.reduce((sum, wa) => 
    sum + wa.lines.filter(l => l.resourceType === 'output').reduce((s, l) => s + l.balanceQty, 0), 0
  ),
  utilisationPct: 0 // Will be calculated
};

balanceSummary.utilisationPct = balanceSummary.totalAuthorised > 0 
  ? (balanceSummary.totalConsumed / balanceSummary.totalAuthorised) * 100 
  : 0;
