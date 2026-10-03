// Part 25 — Advanced Budgeting & Cost Control Data

export interface CostCode {
  id: string;
  code: string;
  name: string;
  parentId?: string;
  resourceType: 'material' | 'labour' | 'plant' | 'subcontract' | 'staff' | 'overhead' | 'other';
  glMapping?: string;
  isActive: boolean;
}

export interface BudgetVersion {
  id: string;
  versionNo: string;
  projectId: string;
  projectName: string;
  type: 'original' | 'approved' | 'revised' | 'forecast';
  status: 'draft' | 'submitted' | 'approved' | 'superseded';
  basisEstimateId?: string;
  total: number;
  approvedBy?: string;
  approvedAt?: string;
  effectiveDate: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface BudgetLine {
  id: string;
  versionId: string;
  wbsNodeId: string;
  wbsNodeCode: string;
  wbsNodeName: string;
  boqItemId?: string;
  activityId?: string;
  costCodeId: string;
  costCodeName: string;
  resourceType: string;
  qty: number;
  uomId: string;
  uomName: string;
  rate: number;
  amount: number;
  periodPhasing: Record<string, number>;
}

export interface Commitment {
  id: string;
  projectId: string;
  sourceType: 'PO' | 'WO' | 'subcontract' | 'plant_hire' | 'rate_contract_calloff';
  sourceId: string;
  sourceNo: string;
  lineId: string;
  wbsNodeId: string;
  costCodeId: string;
  committedAmount: number;
  invoicedAmount: number;
  openCommitment: number;
  status: 'open' | 'partial' | 'closed' | 'cancelled';
  createdAt: string;
}

export interface Actual {
  id: string;
  projectId: string;
  wbsNodeId: string;
  costCodeId: string;
  period: string;
  amount: number;
  sourceType: 'GRN' | 'issue' | 'payroll' | 'plant' | 'expense' | 'sub_bill';
  sourceId: string;
}

export interface Transfer {
  id: string;
  projectId: string;
  fromLineId: string;
  toLineId: string;
  amount: number;
  reason: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Forecast {
  id: string;
  projectId: string;
  wbsNodeId: string;
  costCodeId: string;
  period: string;
  etcAmount: number;
  eacAmount: number;
  method: 'remaining_budget' | 'cpi_based' | 'manual_bottom_up';
  enteredBy: string;
  enteredByName: string;
  reason?: string;
  updatedAt: string;
}

export interface BudgetCheckConfig {
  id: string;
  scope: 'company' | 'project';
  scopeId: string;
  level: 'project' | 'wbs' | 'cost_code';
  mode: 'none' | 'warn' | 'block';
  tolerancePct: number;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Cost Codes
export const costCodes: CostCode[] = [
  {
    id: 'cc_001',
    code: 'MAT-STL',
    name: 'Steel & Reinforcement',
    resourceType: 'material',
    glMapping: '5100-001',
    isActive: true
  },
  {
    id: 'cc_002',
    code: 'MAT-CEM',
    name: 'Cement & Concrete',
    resourceType: 'material',
    glMapping: '5100-002',
    isActive: true
  },
  {
    id: 'cc_003',
    code: 'MAT-AGG',
    name: 'Aggregates & Sand',
    resourceType: 'material',
    glMapping: '5100-003',
    isActive: true
  },
  {
    id: 'cc_004',
    code: 'LAB-SK',
    name: 'Skilled Labour',
    resourceType: 'labour',
    glMapping: '5200-001',
    isActive: true
  },
  {
    id: 'cc_005',
    code: 'LAB-UN',
    name: 'Unskilled Labour',
    resourceType: 'labour',
    glMapping: '5200-002',
    isActive: true
  },
  {
    id: 'cc_006',
    code: 'PLT-CRN',
    name: 'Crane & Hoisting',
    resourceType: 'plant',
    glMapping: '5300-001',
    isActive: true
  },
  {
    id: 'cc_007',
    code: 'PLT-EXC',
    name: 'Excavation Equipment',
    resourceType: 'plant',
    glMapping: '5300-002',
    isActive: true
  },
  {
    id: 'cc_008',
    code: 'SUB-CIV',
    name: 'Civil Subcontracts',
    resourceType: 'subcontract',
    glMapping: '5400-001',
    isActive: true
  },
  {
    id: 'cc_009',
    code: 'STF-PM',
    name: 'Project Management Staff',
    resourceType: 'staff',
    glMapping: '5500-001',
    isActive: true
  },
  {
    id: 'cc_010',
    code: 'OVR-SITE',
    name: 'Site Overheads',
    resourceType: 'overhead',
    glMapping: '5600-001',
    isActive: true
  }
];

// Sample Budget Versions
export const budgetVersions: BudgetVersion[] = [
  {
    id: 'bv_001',
    versionNo: 'OB-001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'original',
    status: 'superseded',
    basisEstimateId: 'est_001',
    total: 125000000,
    approvedBy: 'usr_cfo_001',
    approvedAt: '2025-05-28T10:00:00Z',
    effectiveDate: '2025-06-01',
    createdAt: '2025-05-20T00:00:00Z',
    createdBy: 'usr_cm_001',
    createdByName: 'Commercial Manager'
  },
  {
    id: 'bv_002',
    versionNo: 'AB-001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'approved',
    status: 'superseded',
    total: 128000000,
    approvedBy: 'usr_cfo_001',
    approvedAt: '2025-06-05T14:00:00Z',
    effectiveDate: '2025-06-01',
    createdAt: '2025-06-01T00:00:00Z',
    createdBy: 'usr_cm_001',
    createdByName: 'Commercial Manager'
  },
  {
    id: 'bv_003',
    versionNo: 'RB-001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'revised',
    status: 'approved',
    total: 132500000,
    approvedBy: 'usr_cfo_001',
    approvedAt: '2026-01-10T11:00:00Z',
    effectiveDate: '2026-01-01',
    createdAt: '2026-01-05T00:00:00Z',
    createdBy: 'usr_cm_001',
    createdByName: 'Commercial Manager'
  },
  {
    id: 'bv_004',
    versionNo: 'FC-001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'forecast',
    status: 'draft',
    total: 135000000,
    effectiveDate: '2026-01-15',
    createdAt: '2026-01-15T00:00:00Z',
    createdBy: 'usr_cm_001',
    createdByName: 'Commercial Manager'
  }
];

// Sample Budget Lines
export const budgetLines: BudgetLine[] = [
  {
    id: 'bl_001',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    wbsNodeName: 'Foundation & Substructure',
    boqItemId: 'item_003',
    costCodeId: 'cc_001',
    costCodeName: 'Steel & Reinforcement',
    resourceType: 'material',
    qty: 45,
    uomId: 'uom_mt',
    uomName: 'MT',
    rate: 55000,
    amount: 2475000,
    periodPhasing: { '2026-01': 500000, '2026-02': 750000, '2026-03': 1225000 }
  },
  {
    id: 'bl_002',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    wbsNodeName: 'Foundation & Substructure',
    boqItemId: 'item_004',
    costCodeId: 'cc_002',
    costCodeName: 'Cement & Concrete',
    resourceType: 'material',
    qty: 800,
    uomId: 'uom_cum',
    uomName: 'Cum',
    rate: 4500,
    amount: 3600000,
    periodPhasing: { '2026-01': 1200000, '2026-02': 1200000, '2026-03': 1200000 }
  },
  {
    id: 'bl_003',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    wbsNodeName: 'Foundation & Substructure',
    costCodeId: 'cc_004',
    costCodeName: 'Skilled Labour',
    resourceType: 'labour',
    qty: 1200,
    uomId: 'uom_day',
    uomName: 'Days',
    rate: 700,
    amount: 840000,
    periodPhasing: { '2026-01': 280000, '2026-02': 280000, '2026-03': 280000 }
  },
  {
    id: 'bl_004',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    wbsNodeName: 'Superstructure',
    boqItemId: 'item_007',
    costCodeId: 'cc_002',
    costCodeName: 'Cement & Concrete',
    resourceType: 'material',
    qty: 1800,
    uomId: 'uom_cum',
    uomName: 'Cum',
    rate: 7200,
    amount: 12960000,
    periodPhasing: { '2026-02': 3240000, '2026-03': 4860000, '2026-04': 4860000 }
  },
  {
    id: 'bl_005',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    wbsNodeName: 'Superstructure',
    boqItemId: 'item_008',
    costCodeId: 'cc_001',
    costCodeName: 'Steel & Reinforcement',
    resourceType: 'material',
    qty: 450,
    uomId: 'uom_mt',
    uomName: 'MT',
    rate: 65000,
    amount: 29250000,
    periodPhasing: { '2026-02': 7312500, '2026-03': 10968750, '2026-04': 10968750 }
  },
  {
    id: 'bl_006',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    wbsNodeName: 'Superstructure',
    costCodeId: 'cc_008',
    costCodeName: 'Civil Subcontracts',
    resourceType: 'subcontract',
    qty: 1,
    uomId: 'uom_ls',
    uomName: 'LS',
    rate: 15000000,
    amount: 15000000,
    periodPhasing: { '2026-02': 5000000, '2026-03': 5000000, '2026-04': 5000000 }
  },
  {
    id: 'bl_007',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_001',
    wbsNodeCode: '1.0',
    wbsNodeName: 'Riverside Tower - Phase II',
    costCodeId: 'cc_009',
    costCodeName: 'Project Management Staff',
    resourceType: 'staff',
    qty: 18,
    uomId: 'uom_month',
    uomName: 'Months',
    rate: 150000,
    amount: 2700000,
    periodPhasing: { '2026-01': 450000, '2026-02': 450000, '2026-03': 450000, '2026-04': 450000, '2026-05': 450000, '2026-06': 450000 }
  },
  {
    id: 'bl_008',
    versionId: 'bv_003',
    wbsNodeId: 'wbs_001',
    wbsNodeCode: '1.0',
    wbsNodeName: 'Riverside Tower - Phase II',
    costCodeId: 'cc_010',
    costCodeName: 'Site Overheads',
    resourceType: 'overhead',
    qty: 6,
    uomId: 'uom_month',
    uomName: 'Months',
    rate: 500000,
    amount: 3000000,
    periodPhasing: { '2026-01': 500000, '2026-02': 500000, '2026-03': 500000, '2026-04': 500000, '2026-05': 500000, '2026-06': 500000 }
  }
];

// Sample Commitments
export const commitments: Commitment[] = [
  {
    id: 'com_001',
    projectId: 'prj_001',
    sourceType: 'PO',
    sourceId: 'po_2026_0142',
    sourceNo: 'PO-2026-0142',
    lineId: 'bl_001',
    wbsNodeId: 'wbs_003',
    costCodeId: 'cc_001',
    committedAmount: 2450000,
    invoicedAmount: 0,
    openCommitment: 2450000,
    status: 'open',
    createdAt: '2026-01-15T11:30:00Z'
  },
  {
    id: 'com_002',
    projectId: 'prj_001',
    sourceType: 'PO',
    sourceId: 'po_2026_0141',
    sourceNo: 'PO-2026-0141',
    lineId: 'bl_002',
    wbsNodeId: 'wbs_003',
    costCodeId: 'cc_002',
    committedAmount: 890000,
    invoicedAmount: 450000,
    openCommitment: 440000,
    status: 'partial',
    createdAt: '2026-01-13T10:00:00Z'
  },
  {
    id: 'com_003',
    projectId: 'prj_001',
    sourceType: 'subcontract',
    sourceId: 'sub_001',
    sourceNo: 'SC-2026-001',
    lineId: 'bl_006',
    wbsNodeId: 'wbs_004',
    costCodeId: 'cc_008',
    committedAmount: 15000000,
    invoicedAmount: 3500000,
    openCommitment: 11500000,
    status: 'partial',
    createdAt: '2025-12-01T00:00:00Z'
  },
  {
    id: 'com_004',
    projectId: 'prj_001',
    sourceType: 'plant_hire',
    sourceId: 'ph_001',
    sourceNo: 'PH-2026-001',
    lineId: 'bl_007',
    wbsNodeId: 'wbs_001',
    costCodeId: 'cc_006',
    committedAmount: 1800000,
    invoicedAmount: 600000,
    openCommitment: 1200000,
    status: 'partial',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// Sample Actuals
export const actuals: Actual[] = [
  {
    id: 'act_001',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_003',
    costCodeId: 'cc_001',
    period: '2026-01',
    amount: 1250000,
    sourceType: 'GRN',
    sourceId: 'grn_001'
  },
  {
    id: 'act_002',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_003',
    costCodeId: 'cc_002',
    period: '2026-01',
    amount: 450000,
    sourceType: 'GRN',
    sourceId: 'grn_002'
  },
  {
    id: 'act_003',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_003',
    costCodeId: 'cc_004',
    period: '2026-01',
    amount: 280000,
    sourceType: 'payroll',
    sourceId: 'pay_001'
  },
  {
    id: 'act_004',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_004',
    costCodeId: 'cc_008',
    period: '2026-01',
    amount: 3500000,
    sourceType: 'sub_bill',
    sourceId: 'sb_001'
  },
  {
    id: 'act_005',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_001',
    costCodeId: 'cc_009',
    period: '2026-01',
    amount: 450000,
    sourceType: 'payroll',
    sourceId: 'pay_002'
  },
  {
    id: 'act_006',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_001',
    costCodeId: 'cc_010',
    period: '2026-01',
    amount: 500000,
    sourceType: 'expense',
    sourceId: 'exp_001'
  }
];

// Sample Transfers
export const transfers: Transfer[] = [
  {
    id: 'tr_001',
    projectId: 'prj_001',
    fromLineId: 'bl_007',
    toLineId: 'bl_008',
    amount: 200000,
    reason: 'Reallocation from staff to site overheads for additional site office setup',
    status: 'approved',
    requestedBy: 'usr_pm_001',
    requestedByName: 'Rajesh Kumar',
    approvedBy: 'usr_cfo_001',
    approvedAt: '2026-01-12T14:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'tr_002',
    projectId: 'prj_001',
    fromLineId: 'bl_005',
    toLineId: 'bl_001',
    amount: 500000,
    reason: 'Steel requirement increased for foundation due to design change',
    status: 'submitted',
    requestedBy: 'usr_pm_001',
    requestedByName: 'Rajesh Kumar',
    createdAt: '2026-01-15T16:00:00Z'
  }
];

// Sample Forecasts
export const forecasts: Forecast[] = [
  {
    id: 'fc_001',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_003',
    costCodeId: 'cc_001',
    period: '2026-01',
    etcAmount: 1225000,
    eacAmount: 2475000,
    method: 'remaining_budget',
    enteredBy: 'usr_cm_001',
    enteredByName: 'Commercial Manager',
    updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'fc_002',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_003',
    costCodeId: 'cc_002',
    period: '2026-01',
    etcAmount: 2400000,
    eacAmount: 3600000,
    method: 'cpi_based',
    enteredBy: 'usr_cm_001',
    enteredByName: 'Commercial Manager',
    reason: 'CPI of 1.05 applied based on current performance',
    updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'fc_003',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_004',
    costCodeId: 'cc_008',
    period: '2026-01',
    etcAmount: 11500000,
    eacAmount: 15000000,
    method: 'manual_bottom_up',
    enteredBy: 'usr_pm_001',
    enteredByName: 'Rajesh Kumar',
    reason: 'Based on subcontractor payment schedule',
    updatedAt: '2026-01-15T11:00:00Z'
  }
];

// Budget Check Configuration
export const budgetCheckConfigs: BudgetCheckConfig[] = [
  {
    id: 'bcc_001',
    scope: 'company',
    scopeId: 'comp_001',
    level: 'project',
    mode: 'warn',
    tolerancePct: 90
  },
  {
    id: 'bcc_002',
    scope: 'project',
    scopeId: 'prj_001',
    level: 'wbs',
    mode: 'block',
    tolerancePct: 100
  },
  {
    id: 'bcc_003',
    scope: 'project',
    scopeId: 'prj_001',
    level: 'cost_code',
    mode: 'warn',
    tolerancePct: 95
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-BUD-01',
    stage: 'PLAN',
    control: 'No commitment (PR/PO/WO/hire/expense) without an approved budget line',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-BUD-02',
    stage: 'VERIFY',
    control: 'Budget availability check: warn at 90%, exception at 100%',
    enforcement: 'WARN / EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-BUD-03',
    stage: 'APPROVE',
    control: 'Budget transfers and revisions maker-checker',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-BUD-04',
    stage: 'MONITOR',
    control: 'Cost variance / CPI below threshold; spend on unplanned cost codes',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-BUD-05',
    stage: 'RECONCILE',
    control: 'Monthly budget vs GL actual reconciliation',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Budget Check Demo
export const budgetCheckDemo = {
  project: 'prj_001',
  wbs: 'wbs_003',
  costCode: 'cc_001',
  amount: 500000,
  result: {
    available: 25000,
    status: 'warn' as 'ok' | 'warn' | 'block',
    utilization: 98,
    message: 'Budget utilization at 98%. Only ₹25,000 available. Proceed with caution.'
  }
};

// Statistics
export const budgetStats = {
  totalVersions: budgetVersions.length,
  approvedVersions: budgetVersions.filter(v => v.status === 'approved').length,
  totalBudgetLines: budgetLines.length,
  totalCommitments: commitments.length,
  openCommitments: commitments.filter(c => c.status === 'open' || c.status === 'partial').reduce((sum, c) => sum + c.openCommitment, 0),
  totalActuals: actuals.reduce((sum, a) => sum + a.amount, 0),
  totalTransfers: transfers.length,
  pendingTransfers: transfers.filter(t => t.status === 'submitted').length,
  currentBudget: budgetVersions.find(v => v.status === 'approved')?.total || 0,
  forecastBudget: budgetVersions.find(v => v.type === 'forecast')?.total || 0
};

// Variance Analysis
export const varianceAnalysis = budgetLines.map(line => {
  const committed = commitments.filter(c => c.lineId === line.id).reduce((sum, c) => sum + c.committedAmount, 0);
  const actual = actuals.filter(a => a.wbsNodeId === line.wbsNodeId && a.costCodeId === line.costCodeId).reduce((sum, a) => sum + a.amount, 0);
  const forecast = forecasts.find(f => f.wbsNodeId === line.wbsNodeId && f.costCodeId === line.costCodeId);
  const eac = forecast?.eacAmount || line.amount;
  const variance = line.amount - eac;
  const variancePct = line.amount > 0 ? (variance / line.amount) * 100 : 0;
  
  return {
    lineId: line.id,
    wbsNodeCode: line.wbsNodeCode,
    wbsNodeName: line.wbsNodeName,
    costCodeName: line.costCodeName,
    budget: line.amount,
    committed,
    actual,
    eac,
    variance,
    variancePct,
    status: Math.abs(variancePct) > 10 ? 'critical' : Math.abs(variancePct) > 5 ? 'warning' : 'normal'
  };
});
