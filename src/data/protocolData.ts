// Part 7 — Protocol & Control Engine Data

export interface ControlPoint {
  id: string;
  cpCode: string;
  module: string;
  stage: 'PLAN' | 'VERIFY' | 'APPROVE' | 'EXECUTE' | 'RECORD' | 'MONITOR' | 'RECONCILE' | 'CLOSE';
  trigger: string;
  checkType: string;
  enforcement: 'BLOCK' | 'EXCEPTION' | 'WARN' | 'MONITOR';
  configJson: Record<string, any>;
  thresholdKey?: string;
  evidenceRuleCode?: string;
  escalationLadderCode?: string;
  ownerRole: string;
  description: string;
  version: number;
  isActive: boolean;
}

export interface ControlPointMode {
  id: string;
  cpCode: string;
  scopeType: 'company' | 'project' | 'module';
  scopeId: string;
  scopeName: string;
  mode: 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
  effectiveFrom: string;
  approvedBy: string;
}

export interface Threshold {
  id: string;
  key: string;
  scopeType: 'company' | 'project' | 'material_group';
  scopeId: string;
  scopeName: string;
  materialGroup?: string;
  value: number;
  unit: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  approvedBy: string;
}

export interface EvidenceRule {
  id: string;
  code: string;
  transactionType: string;
  requiredItems: Array<{
    type: 'photo' | 'document' | 'field' | 'signature' | 'gps';
    docType?: string;
    minCount: number;
    condition?: string;
  }>;
}

export interface ReasonCode {
  id: string;
  code: string;
  module: string;
  category: 'cancel' | 'reverse' | 'modify' | 'excess' | 'deviation' | 'backdate' | 'override' | 'waiver' | 'reject' | 'shortclose';
  description: string;
  requiresNarrativeMinChars: number;
  isActive: boolean;
}

export interface ExceptionMatrix {
  id: string;
  exceptionType: string;
  severityBandRule: {
    type: 'percentage' | 'absolute' | 'quantity' | 'days';
    bands: Array<{
      min: number;
      max: number;
      approverChain: string[];
    }>;
  };
}

export interface Evaluation {
  id: string;
  cpCode: string;
  mode: 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
  actorId: string;
  actorName: string;
  entityType: string;
  entityId: string;
  action: string;
  result: 'PASS' | 'WARN' | 'EXCEPTION_REQUIRED' | 'BLOCK';
  failuresJson: Array<{
    checkType: string;
    message: string;
    threshold?: any;
    actual?: any;
  }>;
  exceptionId?: string;
  at: string;
  correlationId: string;
}

export interface Exception {
  id: string;
  exceptionNo: string;
  type: string;
  cpCode: string;
  entityType: string;
  entityId: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  requestedBy: string;
  requestedByName: string;
  deviationValue: number;
  deviationUnit: string;
  costImpact: number;
  timeImpactDays: number;
  reasonCode: string;
  narrative: string;
  evidenceDocIds: string[];
  validityType: 'one_time' | 'until_date' | 'qty_cap' | 'amount_cap';
  capValue: number;
  consumedValue: number;
  validTo: string | null;
  isEmergency: boolean;
  regulariseBy: string | null;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'CONSUMED' | 'EXPIRED' | 'REJECTED' | 'RETURNED' | 'EXECUTED_PENDING_REGULARISATION' | 'REGULARISED' | 'ESCALATED';
  workflowInstanceId?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ControlCycle {
  id: string;
  activityType: string;
  rootEntityType: string;
  rootEntityId: string;
  rootEntityNumber: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  responsibleId: string;
  responsibleName: string;
  stageStatus: Record<string, {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'STUCK';
    entityRef?: string;
    at?: string;
    by?: string;
  }>;
  currentStage: string;
  isClosed: boolean;
}

export interface Violation {
  id: string;
  violationId: string;
  cpCode: string;
  evaluationId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actorId: string;
  actorName: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  departmentId?: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'escalated';
  resolvedBy?: string;
  resolutionNote?: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface Escalation {
  id: string;
  violationId?: string;
  exceptionId?: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  recipientIds: string[];
  recipientNames: string[];
  raisedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface ObserveImpact {
  module: string;
  totalEvaluations: number;
  wouldBlock: number;
  wouldWarn: number;
  wouldRequireException: number;
  passRate: number;
  topViolations: Array<{
    cpCode: string;
    description: string;
    count: number;
  }>;
}

// Control Points Registry
export const controlPoints: ControlPoint[] = [
  // Part 4 - Organization
  {
    id: 'cp_001',
    cpCode: 'CP-ORG-01',
    module: 'org',
    stage: 'PLAN',
    trigger: 'project.activate',
    checkType: 'DOCUMENT_REQUIRED',
    enforcement: 'EXCEPTION',
    configJson: { requiredDocs: ['geofence', 'raci_matrix', 'project_manager'] },
    evidenceRuleCode: 'EVD-PROJ-ACTIVATE',
    escalationLadderCode: 'ESC-L3-MGMT',
    ownerRole: 'protocol_officer',
    description: 'Project/site cannot move to Active until project manager, site manager, cost centre, geofence and RACI template are assigned',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_002',
    cpCode: 'CP-ORG-02',
    module: 'org',
    stage: 'APPROVE',
    trigger: 'geofence.edit',
    checkType: 'SOD',
    enforcement: 'BLOCK',
    configJson: { makerChecker: true },
    escalationLadderCode: 'ESC-L3',
    ownerRole: 'protocol_officer',
    description: 'Geofence and hierarchy changes maker-checker with reason',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_003',
    cpCode: 'CP-ORG-03',
    module: 'org',
    stage: 'CLOSE',
    trigger: 'project.close',
    checkType: 'RECONCILIATION',
    enforcement: 'EXCEPTION',
    configJson: { checks: ['open_pos', 'unposted_bills', 'open_ncrs', 'active_allocations'] },
    escalationLadderCode: 'ESC-L3',
    ownerRole: 'protocol_officer',
    description: 'Project closure blocked with open POs, WAs, exceptions, findings, unreconciled stock or unposted bills',
    version: 1,
    isActive: true
  },
  
  // Part 5 - IAM
  {
    id: 'cp_004',
    cpCode: 'CP-IAM-01',
    module: 'iam',
    stage: 'APPROVE',
    trigger: 'role.assignment',
    checkType: 'SOD',
    enforcement: 'BLOCK',
    configJson: { makerChecker: true, privilegedRoles: ['super_admin', 'management', 'accounts'] },
    escalationLadderCode: 'ESC-L3',
    ownerRole: 'protocol_officer',
    description: 'Role permission changes and privileged assignments are maker-checker',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_005',
    cpCode: 'CP-IAM-02',
    module: 'iam',
    stage: 'VERIFY',
    trigger: 'user.assignment',
    checkType: 'SOD',
    enforcement: 'BLOCK',
    configJson: { conflictPairs: [['po.create', 'po.approve'], ['vendor.create', 'payment.approve']] },
    escalationLadderCode: 'ESC-L3',
    ownerRole: 'protocol_officer',
    description: 'SoD conflict check on every assignment',
    version: 1,
    isActive: true
  },
  
  // Part 6 - Workflow
  {
    id: 'cp_006',
    cpCode: 'CP-WF-01',
    module: 'wf',
    stage: 'APPROVE',
    trigger: 'workflow.approve',
    checkType: 'SOD',
    enforcement: 'BLOCK',
    configJson: { preventSelfApproval: true },
    escalationLadderCode: 'ESC-L3',
    ownerRole: 'protocol_officer',
    description: 'Submitter cannot approve own document; one approver cannot act at two levels of one instance',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_007',
    cpCode: 'CP-WF-02',
    module: 'wf',
    stage: 'MONITOR',
    trigger: 'workflow.sla_breach',
    checkType: 'TIME_WINDOW',
    enforcement: 'MONITOR',
    configJson: { escalationLevels: ['L1', 'L2', 'L3'] },
    escalationLadderCode: 'ESC-WF-SLA',
    ownerRole: 'protocol_officer',
    description: 'Approval SLA breach escalates L1→L2→L3',
    version: 1,
    isActive: true
  },
  
  // Part 7 - Protocol (self-referential)
  {
    id: 'cp_008',
    cpCode: 'CP-PRT-01',
    module: 'protocol',
    stage: 'APPROVE',
    trigger: 'protocol.config.change',
    checkType: 'SOD',
    enforcement: 'BLOCK',
    configJson: { makerChecker: true },
    escalationLadderCode: 'ESC-L3-MGMT',
    ownerRole: 'protocol_officer',
    description: 'Any change to control points, thresholds, modes, reason codes or exception matrix is maker-checker',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_009',
    cpCode: 'CP-PRT-02',
    module: 'protocol',
    stage: 'VERIFY',
    trigger: 'protocol.mode.enforce',
    checkType: 'DOCUMENT_REQUIRED',
    enforcement: 'EXCEPTION',
    configJson: { requiredDocs: ['observe_report_14_days', 'impact_review_signed'] },
    escalationLadderCode: 'ESC-L3-MGMT',
    ownerRole: 'protocol_officer',
    description: 'Switching a CP to ENFORCE requires ≥ 14 days of OBSERVE data and a signed impact review',
    version: 1,
    isActive: true
  },
  
  // Materials Module (Part 26-40)
  {
    id: 'cp_010',
    cpCode: 'CP-MAT-01',
    module: 'mat',
    stage: 'PLAN',
    trigger: 'po.create',
    checkType: 'BUDGET_AVAILABLE',
    enforcement: 'BLOCK',
    configJson: { checkBudget: true },
    escalationLadderCode: 'ESC-L2-PM',
    ownerRole: 'cost_controller',
    description: 'PO creation requires budget availability check',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_011',
    cpCode: 'CP-MAT-02',
    module: 'mat',
    stage: 'RECORD',
    trigger: 'grn.post',
    checkType: 'STOCK_AVAILABLE',
    enforcement: 'WARN',
    configJson: { tolerance: 0.05 },
    escalationLadderCode: 'ESC-L1-STORE',
    ownerRole: 'store_incharge',
    description: 'GRN posting validates stock availability with 5% tolerance',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_012',
    cpCode: 'CP-MAT-03',
    module: 'mat',
    stage: 'RECONCILE',
    trigger: 'material.reconcile',
    checkType: 'BALANCE_QTY',
    enforcement: 'BLOCK',
    configJson: { requireReconciliation: true },
    escalationLadderCode: 'ESC-L2-COST',
    ownerRole: 'cost_controller',
    description: 'Material reconciliation must balance before period close',
    version: 1,
    isActive: true
  },
  
  // Finance Module (Part 56-70)
  {
    id: 'cp_013',
    cpCode: 'CP-FIN-01',
    module: 'fin',
    stage: 'APPROVE',
    trigger: 'payment.approve',
    checkType: 'THRESHOLD',
    enforcement: 'BLOCK',
    configJson: { thresholdKey: 'payment_approval_limit' },
    thresholdKey: 'payment_approval_limit',
    escalationLadderCode: 'ESC-L3-CFO',
    ownerRole: 'finance_manager',
    description: 'Payment approval requires authority limit check',
    version: 1,
    isActive: true
  },
  {
    id: 'cp_014',
    cpCode: 'CP-FIN-02',
    module: 'fin',
    stage: 'EXECUTE',
    trigger: 'invoice.post',
    checkType: 'CERTIFICATION_VALID',
    enforcement: 'BLOCK',
    configJson: { requireCertification: true },
    escalationLadderCode: 'ESC-L2-FIN',
    ownerRole: 'finance_manager',
    description: 'Invoice posting requires valid certification',
    version: 1,
    isActive: true
  }
];

// Control Point Modes
export const controlPointModes: ControlPointMode[] = [
  { id: 'mode_001', cpCode: 'CP-ORG-01', scopeType: 'company', scopeId: 'comp_001', scopeName: 'Acme Construction Ltd.', mode: 'OBSERVE', effectiveFrom: '2026-01-01', approvedBy: 'usr_admin_001' },
  { id: 'mode_002', cpCode: 'CP-ORG-02', scopeType: 'company', scopeId: 'comp_001', scopeName: 'Acme Construction Ltd.', mode: 'OBSERVE', effectiveFrom: '2026-01-01', approvedBy: 'usr_admin_001' },
  { id: 'mode_003', cpCode: 'CP-IAM-01', scopeType: 'company', scopeId: 'comp_001', scopeName: 'Acme Construction Ltd.', mode: 'OBSERVE', effectiveFrom: '2026-01-01', approvedBy: 'usr_admin_001' },
  { id: 'mode_004', cpCode: 'CP-WF-01', scopeType: 'company', scopeId: 'comp_001', scopeName: 'Acme Construction Ltd.', mode: 'OBSERVE', effectiveFrom: '2026-01-01', approvedBy: 'usr_admin_001' },
  { id: 'mode_005', cpCode: 'CP-PRT-01', scopeType: 'company', scopeId: 'comp_001', scopeName: 'Acme Construction Ltd.', mode: 'OBSERVE', effectiveFrom: '2026-01-01', approvedBy: 'usr_admin_001' },
  { id: 'mode_006', cpCode: 'CP-MAT-01', scopeType: 'project', scopeId: 'prj_001', scopeName: 'Riverside Tower', mode: 'WARN', effectiveFrom: '2026-01-10', approvedBy: 'usr_pm_001' },
  { id: 'mode_007', cpCode: 'CP-FIN-01', scopeType: 'company', scopeId: 'comp_001', scopeName: 'Acme Construction Ltd.', mode: 'ENFORCE', effectiveFrom: '2026-01-05', approvedBy: 'usr_cfo_001' }
];

// Thresholds
export const thresholds: Threshold[] = [
  { id: 'th_001', key: 'payment_approval_limit', scopeType: 'company', scopeId: 'comp_001', scopeName: 'Acme Construction Ltd.', value: 1000000, unit: 'INR', effectiveFrom: '2026-01-01', effectiveTo: null, approvedBy: 'usr_cfo_001' },
  { id: 'th_002', key: 'po_approval_limit', scopeType: 'project', scopeId: 'prj_001', scopeName: 'Riverside Tower', value: 500000, unit: 'INR', effectiveFrom: '2026-01-01', effectiveTo: null, approvedBy: 'usr_pm_001' },
  { id: 'th_003', key: 'material_wastage_tolerance', scopeType: 'material_group', scopeId: 'steel', scopeName: 'Steel', materialGroup: 'steel', value: 3, unit: 'percent', effectiveFrom: '2026-01-01', effectiveTo: null, approvedBy: 'usr_cost_001' },
  { id: 'th_004', key: 'budget_overrun_threshold', scopeType: 'project', scopeId: 'prj_001', scopeName: 'Riverside Tower', value: 10, unit: 'percent', effectiveFrom: '2026-01-01', effectiveTo: null, approvedBy: 'usr_cfo_001' }
];

// Evidence Rules
export const evidenceRules: EvidenceRule[] = [
  {
    id: 'evr_001',
    code: 'EVD-PROJ-ACTIVATE',
    transactionType: 'project.activate',
    requiredItems: [
      { type: 'document', docType: 'geofence_map', minCount: 1 },
      { type: 'document', docType: 'raci_matrix', minCount: 1 },
      { type: 'signature', minCount: 2, condition: 'pm_and_site_manager' }
    ]
  },
  {
    id: 'evr_002',
    code: 'EVD-EXCESS-MATERIAL',
    transactionType: 'material.excess',
    requiredItems: [
      { type: 'photo', minCount: 1, condition: 'site_photo' },
      { type: 'gps', minCount: 1 },
      { type: 'document', docType: 'justification_letter', minCount: 1 }
    ]
  },
  {
    id: 'evr_003',
    code: 'EVD-EMERGENCY-PO',
    transactionType: 'po.emergency',
    requiredItems: [
      { type: 'signature', minCount: 1, condition: 'pm_approval' },
      { type: 'document', docType: 'emergency_justification', minCount: 1 },
      { type: 'photo', minCount: 2, condition: 'site_conditions' }
    ]
  }
];

// Reason Codes
export const reasonCodes: ReasonCode[] = [
  { id: 'rc_001', code: 'RC-CANCEL-001', module: 'mat', category: 'cancel', description: 'Vendor unable to supply', requiresNarrativeMinChars: 50, isActive: true },
  { id: 'rc_002', code: 'RC-CANCEL-002', module: 'mat', category: 'cancel', description: 'Project scope change', requiresNarrativeMinChars: 50, isActive: true },
  { id: 'rc_003', code: 'RC-EXCESS-001', module: 'mat', category: 'excess', description: 'Design change requiring additional material', requiresNarrativeMinChars: 100, isActive: true },
  { id: 'rc_004', code: 'RC-EXCESS-002', module: 'mat', category: 'excess', description: 'Wastage beyond tolerance', requiresNarrativeMinChars: 100, isActive: true },
  { id: 'rc_005', code: 'RC-DEVIATION-001', module: 'org', category: 'deviation', description: 'Emergency work authorization', requiresNarrativeMinChars: 100, isActive: true },
  { id: 'rc_006', code: 'RC-BACKDATE-001', module: 'fin', category: 'backdate', description: 'System downtime during original transaction', requiresNarrativeMinChars: 150, isActive: true },
  { id: 'rc_007', code: 'RC-OVERRIDE-001', module: 'wf', category: 'override', description: 'Approver unavailable, business critical', requiresNarrativeMinChars: 100, isActive: true },
  { id: 'rc_008', code: 'RC-REJECT-001', module: 'mat', category: 'reject', description: 'Non-compliant with specifications', requiresNarrativeMinChars: 50, isActive: true }
];

// Exception Matrix
export const exceptionMatrix: ExceptionMatrix[] = [
  {
    id: 'em_001',
    exceptionType: 'material_excess',
    severityBandRule: {
      type: 'percentage',
      bands: [
        { min: 0, max: 5, approverChain: ['project_manager'] },
        { min: 5, max: 10, approverChain: ['project_manager', 'commercial_manager'] },
        { min: 10, max: 20, approverChain: ['commercial_manager', 'management'] },
        { min: 20, max: 100, approverChain: ['management', 'cfo'] }
      ]
    }
  },
  {
    id: 'em_002',
    exceptionType: 'budget_overrun',
    severityBandRule: {
      type: 'percentage',
      bands: [
        { min: 0, max: 5, approverChain: ['project_manager'] },
        { min: 5, max: 15, approverChain: ['project_manager', 'cost_controller'] },
        { min: 15, max: 30, approverChain: ['cost_controller', 'management'] },
        { min: 30, max: 100, approverChain: ['management', 'cfo'] }
      ]
    }
  },
  {
    id: 'em_003',
    exceptionType: 'emergency_execution',
    severityBandRule: {
      type: 'absolute',
      bands: [
        { min: 0, max: 100000, approverChain: ['project_manager'] },
        { min: 100000, max: 500000, approverChain: ['project_manager', 'management'] },
        { min: 500000, max: 10000000, approverChain: ['management', 'cfo'] }
      ]
    }
  }
];

// Evaluations (Recent)
export const evaluations: Evaluation[] = [
  {
    id: 'eval_001',
    cpCode: 'CP-MAT-01',
    mode: 'WARN',
    actorId: 'usr_proc_001',
    actorName: 'Vikram Singh',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    action: 'create',
    result: 'WARN',
    failuresJson: [{ checkType: 'BUDGET_AVAILABLE', message: 'Budget utilization at 92%', threshold: 90, actual: 92 }],
    at: '2026-01-15T10:30:00Z',
    correlationId: 'corr_po_001'
  },
  {
    id: 'eval_002',
    cpCode: 'CP-FIN-01',
    mode: 'ENFORCE',
    actorId: 'usr_acct_001',
    actorName: 'Priya Sharma',
    entityType: 'Payment',
    entityId: 'pay_2026_0089',
    action: 'approve',
    result: 'BLOCK',
    failuresJson: [{ checkType: 'THRESHOLD', message: 'Amount exceeds approval limit', threshold: 1000000, actual: 1875000 }],
    at: '2026-01-15T11:00:00Z',
    correlationId: 'corr_pay_001'
  },
  {
    id: 'eval_003',
    cpCode: 'CP-WF-01',
    mode: 'OBSERVE',
    actorId: 'usr_pm_001',
    actorName: 'Rajesh Kumar',
    entityType: 'WorkflowInstance',
    entityId: 'inst_001',
    action: 'approve',
    result: 'PASS',
    failuresJson: [],
    at: '2026-01-15T09:15:00Z',
    correlationId: 'corr_wf_001'
  },
  {
    id: 'eval_004',
    cpCode: 'CP-ORG-01',
    mode: 'OBSERVE',
    actorId: 'usr_pm_002',
    actorName: 'Amit Patel',
    entityType: 'Project',
    entityId: 'prj_003',
    action: 'activate',
    result: 'EXCEPTION_REQUIRED',
    failuresJson: [
      { checkType: 'DOCUMENT_REQUIRED', message: 'Missing RACI matrix' },
      { checkType: 'DOCUMENT_REQUIRED', message: 'Geofence not defined' }
    ],
    at: '2026-01-15T08:00:00Z',
    correlationId: 'corr_org_001'
  }
];

// Exceptions
export const exceptions: Exception[] = [
  {
    id: 'exc_001',
    exceptionNo: 'EXC-2026-001',
    type: 'material_excess',
    cpCode: 'CP-MAT-03',
    entityType: 'MaterialReconciliation',
    entityId: 'recon_2026_012',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    siteId: 'site_001',
    siteName: 'Block A',
    requestedBy: 'usr_store_001',
    requestedByName: 'Suresh Nair',
    deviationValue: 2.5,
    deviationUnit: 'MT',
    costImpact: 125000,
    timeImpactDays: 0,
    reasonCode: 'RC-EXCESS-001',
    narrative: 'Design change in foundation layout required additional steel reinforcement. Approved by structural engineer via site instruction SI-2026-045.',
    evidenceDocIds: ['doc_001', 'doc_002'],
    validityType: 'qty_cap',
    capValue: 2.5,
    consumedValue: 2.5,
    validTo: null,
    isEmergency: false,
    regulariseBy: null,
    status: 'CONSUMED',
    workflowInstanceId: 'wf_exc_001',
    createdAt: '2026-01-10T14:00:00Z',
    approvedAt: '2026-01-11T09:00:00Z',
    approvedBy: 'usr_pm_001'
  },
  {
    id: 'exc_002',
    exceptionNo: 'EXC-2026-002',
    type: 'emergency_execution',
    cpCode: 'CP-ORG-01',
    entityType: 'WorkAuthorization',
    entityId: 'wa_2026_089',
    projectId: 'prj_002',
    projectName: 'Highway Bridge Phase 2',
    siteId: 'site_003',
    siteName: 'Main Site',
    requestedBy: 'usr_sm_003',
    requestedByName: 'Vikram Singh',
    deviationValue: 450000,
    deviationUnit: 'INR',
    costImpact: 450000,
    timeImpactDays: 3,
    reasonCode: 'RC-DEVIATION-001',
    narrative: 'Emergency repair of formwork after unexpected heavy rain. Critical path activity, delay would impact project completion by 5 days.',
    evidenceDocIds: ['doc_003', 'doc_004', 'doc_005'],
    validityType: 'one_time',
    capValue: 450000,
    consumedValue: 0,
    validTo: '2026-01-20',
    isEmergency: true,
    regulariseBy: '2026-01-18',
    status: 'EXECUTED_PENDING_REGULARISATION',
    workflowInstanceId: 'wf_exc_002',
    createdAt: '2026-01-15T06:00:00Z',
    approvedAt: '2026-01-15T06:30:00Z',
    approvedBy: 'usr_pm_002'
  },
  {
    id: 'exc_003',
    exceptionNo: 'EXC-2026-003',
    type: 'budget_overrun',
    cpCode: 'CP-MAT-01',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0143',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    requestedBy: 'usr_proc_001',
    requestedByName: 'Vikram Singh',
    deviationValue: 8,
    deviationUnit: 'percent',
    costImpact: 320000,
    timeImpactDays: 0,
    reasonCode: 'RC-EXCESS-001',
    narrative: 'Steel prices increased by 8% due to market conditions. Vendor quoted rates are competitive as per comparative statement CS-2026-034.',
    evidenceDocIds: ['doc_006', 'doc_007'],
    validityType: 'amount_cap',
    capValue: 320000,
    consumedValue: 0,
    validTo: '2026-02-15',
    isEmergency: false,
    regulariseBy: null,
    status: 'SUBMITTED',
    workflowInstanceId: 'wf_exc_003',
    createdAt: '2026-01-15T11:30:00Z'
  }
];

// Control Cycles
export const controlCycles: ControlCycle[] = [
  {
    id: 'cycle_001',
    activityType: 'procurement',
    rootEntityType: 'PurchaseOrder',
    rootEntityId: 'po_2026_0142',
    rootEntityNumber: 'PO-2026-0142',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    siteId: 'site_001',
    siteName: 'Block A',
    responsibleId: 'usr_proc_001',
    responsibleName: 'Vikram Singh',
    stageStatus: {
      PLAN: { status: 'COMPLETED', entityRef: 'pr_2026_0256', at: '2026-01-13T08:00:00Z', by: 'usr_eng_001' },
      VERIFY: { status: 'COMPLETED', entityRef: 'cs_2026_034', at: '2026-01-14T10:00:00Z', by: 'usr_proc_001' },
      APPROVE: { status: 'IN_PROGRESS', entityRef: 'wf_inst_001', at: '2026-01-14T10:30:00Z', by: 'usr_proc_001' },
      EXECUTE: { status: 'NOT_STARTED' },
      RECORD: { status: 'NOT_STARTED' },
      MONITOR: { status: 'NOT_STARTED' },
      RECONCILE: { status: 'NOT_STARTED' },
      CLOSE: { status: 'NOT_STARTED' }
    },
    currentStage: 'APPROVE',
    isClosed: false
  },
  {
    id: 'cycle_002',
    activityType: 'subcontract',
    rootEntityType: 'SubcontractBill',
    rootEntityId: 'sb_2026_0034',
    rootEntityNumber: 'SCB-2026-0034',
    projectId: 'prj_002',
    projectName: 'Highway Bridge Phase 2',
    siteId: 'site_003',
    siteName: 'Main Site',
    responsibleId: 'usr_pm_002',
    responsibleName: 'Amit Patel',
    stageStatus: {
      PLAN: { status: 'COMPLETED', entityRef: 'wo_2025_012', at: '2025-12-01T09:00:00Z', by: 'usr_pm_002' },
      VERIFY: { status: 'COMPLETED', entityRef: 'mb_2026_045', at: '2026-01-14T15:00:00Z', by: 'usr_qs_001' },
      APPROVE: { status: 'IN_PROGRESS', entityRef: 'wf_inst_003', at: '2026-01-15T09:00:00Z', by: 'usr_pm_002' },
      EXECUTE: { status: 'NOT_STARTED' },
      RECORD: { status: 'NOT_STARTED' },
      MONITOR: { status: 'NOT_STARTED' },
      RECONCILE: { status: 'NOT_STARTED' },
      CLOSE: { status: 'NOT_STARTED' }
    },
    currentStage: 'APPROVE',
    isClosed: false
  }
];

// Violations
export const violations: Violation[] = [
  {
    id: 'viol_001',
    violationId: 'VIOL-2026-001',
    cpCode: 'CP-FIN-01',
    evaluationId: 'eval_002',
    severity: 'high',
    actorId: 'usr_acct_001',
    actorName: 'Priya Sharma',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    status: 'open',
    createdAt: '2026-01-15T11:00:00Z'
  },
  {
    id: 'viol_002',
    violationId: 'VIOL-2026-002',
    cpCode: 'CP-WF-02',
    evaluationId: 'eval_005',
    severity: 'medium',
    actorId: 'usr_pm_001',
    actorName: 'Rajesh Kumar',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    status: 'acknowledged',
    createdAt: '2026-01-14T16:00:00Z',
    acknowledgedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'viol_003',
    violationId: 'VIOL-2026-003',
    cpCode: 'CP-MAT-03',
    evaluationId: 'eval_006',
    severity: 'low',
    actorId: 'usr_store_001',
    actorName: 'Suresh Nair',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    siteId: 'site_001',
    siteName: 'Block A',
    status: 'resolved',
    resolvedBy: 'usr_cost_001',
    resolutionNote: 'Reconciliation completed after adjusting for design change. Exception EXC-2026-001 approved.',
    createdAt: '2026-01-10T14:00:00Z',
    acknowledgedAt: '2026-01-11T09:00:00Z',
    resolvedAt: '2026-01-12T10:00:00Z'
  }
];

// Escalations
export const escalations: Escalation[] = [
  {
    id: 'esc_001',
    violationId: 'viol_001',
    level: 'L1',
    recipientIds: ['usr_cost_001'],
    recipientNames: ['Cost Controller'],
    raisedAt: '2026-01-15T11:05:00Z'
  },
  {
    id: 'esc_002',
    exceptionId: 'exc_002',
    level: 'L2',
    recipientIds: ['usr_pm_002', 'usr_cfo_001'],
    recipientNames: ['Project Manager', 'CFO'],
    raisedAt: '2026-01-17T06:00:00Z'
  }
];

// OBSERVE Impact Reports
export const observeImpactReports: ObserveImpact[] = [
  {
    module: 'mat',
    totalEvaluations: 1247,
    wouldBlock: 23,
    wouldWarn: 89,
    wouldRequireException: 12,
    passRate: 91.2,
    topViolations: [
      { cpCode: 'CP-MAT-01', description: 'Budget availability check', count: 15 },
      { cpCode: 'CP-MAT-03', description: 'Material reconciliation', count: 8 }
    ]
  },
  {
    module: 'fin',
    totalEvaluations: 856,
    wouldBlock: 45,
    wouldWarn: 34,
    wouldRequireException: 8,
    passRate: 89.8,
    topViolations: [
      { cpCode: 'CP-FIN-01', description: 'Payment approval limit', count: 32 },
      { cpCode: 'CP-FIN-02', description: 'Invoice certification', count: 13 }
    ]
  },
  {
    module: 'org',
    totalEvaluations: 423,
    wouldBlock: 8,
    wouldWarn: 15,
    wouldRequireException: 5,
    passRate: 94.1,
    topViolations: [
      { cpCode: 'CP-ORG-01', description: 'Project activation requirements', count: 5 },
      { cpCode: 'CP-ORG-03', description: 'Project closure checks', count: 3 }
    ]
  }
];

// Statistics
export const protocolStats = {
  totalControlPoints: controlPoints.length,
  activeControlPoints: controlPoints.filter(cp => cp.isActive).length,
  observeModeCount: controlPointModes.filter(m => m.mode === 'OBSERVE').length,
  warnModeCount: controlPointModes.filter(m => m.mode === 'WARN').length,
  enforceModeCount: controlPointModes.filter(m => m.mode === 'ENFORCE').length,
  totalExceptions: exceptions.length,
  pendingExceptions: exceptions.filter(e => ['DRAFT', 'SUBMITTED'].includes(e.status)).length,
  approvedExceptions: exceptions.filter(e => ['APPROVED', 'CONSUMED'].includes(e.status)).length,
  emergencyExceptions: exceptions.filter(e => e.isEmergency).length,
  totalViolations: violations.length,
  openViolations: violations.filter(v => v.status === 'open').length,
  resolvedViolations: violations.filter(v => v.status === 'resolved').length,
  activeEscalations: escalations.filter(e => !e.resolvedAt).length,
  totalEvaluations: evaluations.length,
  passRate: ((evaluations.filter(e => e.result === 'PASS').length / evaluations.length) * 100).toFixed(1)
};
