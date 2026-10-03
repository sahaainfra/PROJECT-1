// Part 10 — Accountability, Responsibility Assignment & Action Ledger Data

export interface RaciAssignment {
  id: string;
  scopeType: 'company' | 'department' | 'project' | 'site' | 'wbs_node' | 'process';
  scopeId: string;
  scopeName: string;
  processCode: string;
  processName: string;
  responsibleUserId: string;
  responsibleUserName: string;
  accountableUserId: string;
  accountableUserName: string;
  consultedUserIds: string[];
  consultedUserNames: string[];
  informedUserIds: string[];
  informedUserNames: string[];
  fromDate: string;
  toDate: string | null;
  assignedBy: string;
  assignedAt: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface ActionLedgerEntry {
  id: string;
  ledgerId: string;
  entityType: string;
  entityId: string;
  docNo: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  departmentId?: string;
  action: 'CREATED' | 'SUBMITTED' | 'VERIFIED' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'MODIFIED' | 'EXECUTED' | 'RECORDED' | 'RECONCILED' | 'CLOSED' | 'CANCELLED' | 'REVERSED' | 'EXCEPTION_REQUESTED' | 'EXCEPTION_APPROVED';
  actorId: string;
  actorName: string;
  actorRole: string;
  onBehalfOf?: string;
  timestamp: string;
  deviceId?: string;
  location?: { lat: number; lng: number };
  reasonCode?: string;
  narrative?: string;
  auditId: string;
  workflowTaskId?: string;
  protocolEvaluationId?: string;
}

export interface ProcessCatalogue {
  id: string;
  processCode: string;
  module: string;
  description: string;
  requiresRaci: boolean;
  requiresIndependentAccountability: boolean;
}

export interface ComplianceScore {
  id: string;
  subjectType: 'user' | 'role' | 'site' | 'project' | 'department';
  subjectId: string;
  subjectName: string;
  period: string;
  score: number;
  components: {
    onTimeCompletion: number;
    qualityScore: number;
    protocolCompliance: number;
    exceptionRate: number;
    violationCount: number;
  };
  calculatedAt: string;
  trend: 'up' | 'down' | 'stable';
  previousScore?: number;
}

export interface ResponsibilityItem {
  id: string;
  itemType: 'task' | 'approval' | 'exception' | 'violation' | 'overdue_record';
  title: string;
  entityType: string;
  entityId: string;
  docNo: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'overdue' | 'completed';
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// RACI Assignments
export const raciAssignments: RaciAssignment[] = [
  {
    id: 'raci_001',
    scopeType: 'project',
    scopeId: 'prj_001',
    scopeName: 'Riverside Tower',
    processCode: 'PO_APPROVAL',
    processName: 'Purchase Order Approval',
    responsibleUserId: 'usr_proc_001',
    responsibleUserName: 'Vikram Singh',
    accountableUserId: 'usr_pm_001',
    accountableUserName: 'Rajesh Kumar',
    consultedUserIds: ['usr_cm_001'],
    consultedUserNames: ['Commercial Manager'],
    informedUserIds: ['usr_acct_001'],
    informedUserNames: ['Accounts Manager'],
    fromDate: '2026-01-01',
    toDate: null,
    assignedBy: 'usr_admin_001',
    assignedAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'raci_002',
    scopeType: 'project',
    scopeId: 'prj_001',
    scopeName: 'Riverside Tower',
    processCode: 'MATERIAL_ISSUE',
    processName: 'Material Issue from Store',
    responsibleUserId: 'usr_store_001',
    responsibleUserName: 'Suresh Nair',
    accountableUserId: 'usr_sm_001',
    accountableUserName: 'Rahul Mehta',
    consultedUserIds: [],
    consultedUserNames: [],
    informedUserIds: ['usr_pm_001'],
    informedUserNames: ['Rajesh Kumar'],
    fromDate: '2026-01-01',
    toDate: null,
    assignedBy: 'usr_admin_001',
    assignedAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'raci_003',
    scopeType: 'project',
    scopeId: 'prj_002',
    scopeName: 'Highway Bridge Phase 2',
    processCode: 'PO_APPROVAL',
    processName: 'Purchase Order Approval',
    responsibleUserId: 'usr_proc_002',
    responsibleUserName: 'Neha Gupta',
    accountableUserId: 'usr_pm_002',
    accountableUserName: 'Amit Patel',
    consultedUserIds: ['usr_cm_002'],
    consultedUserNames: ['Commercial Manager'],
    informedUserIds: ['usr_acct_002'],
    informedUserNames: ['Finance Manager'],
    fromDate: '2026-01-01',
    toDate: null,
    assignedBy: 'usr_admin_001',
    assignedAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'raci_004',
    scopeType: 'site',
    scopeId: 'site_001',
    scopeName: 'Riverside Tower - Block A',
    processCode: 'DPR',
    processName: 'Daily Progress Report',
    responsibleUserId: 'usr_eng_001',
    responsibleUserName: 'Suresh Engineer',
    accountableUserId: 'usr_sm_001',
    accountableUserName: 'Rahul Mehta',
    consultedUserIds: [],
    consultedUserNames: [],
    informedUserIds: ['usr_pm_001'],
    informedUserNames: ['Rajesh Kumar'],
    fromDate: '2026-01-01',
    toDate: null,
    assignedBy: 'usr_pm_001',
    assignedAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'raci_005',
    scopeType: 'department',
    scopeId: 'dept_finance',
    scopeName: 'Finance Department',
    processCode: 'PAYMENT_APPROVAL',
    processName: 'Payment Approval',
    responsibleUserId: 'usr_acct_001',
    responsibleUserName: 'Priya Sharma',
    accountableUserId: 'usr_cfo_001',
    accountableUserName: 'CFO',
    consultedUserIds: ['usr_pm_001', 'usr_pm_002'],
    consultedUserNames: ['Rajesh Kumar', 'Amit Patel'],
    informedUserIds: [],
    informedUserNames: [],
    fromDate: '2026-01-01',
    toDate: null,
    assignedBy: 'usr_admin_001',
    assignedAt: '2026-01-01T00:00:00Z',
    status: 'active'
  }
];

// Action Ledger Entries
export const actionLedger: ActionLedgerEntry[] = [
  {
    id: 'ledger_001',
    ledgerId: 'LED-2026-001234',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    docNo: 'PO-2026-0142',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    action: 'CREATED',
    actorId: 'usr_proc_001',
    actorName: 'Vikram Singh',
    actorRole: 'Procurement Manager',
    timestamp: '2026-01-15T10:30:00Z',
    deviceId: 'dev_laptop_001',
    reasonCode: 'RC-CREATE-001',
    narrative: 'Created PO for steel reinforcement materials',
    auditId: 'audit_001'
  },
  {
    id: 'ledger_002',
    ledgerId: 'LED-2026-001235',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    docNo: 'PO-2026-0142',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    action: 'SUBMITTED',
    actorId: 'usr_proc_001',
    actorName: 'Vikram Singh',
    actorRole: 'Procurement Manager',
    timestamp: '2026-01-15T10:35:00Z',
    deviceId: 'dev_laptop_001',
    narrative: 'Submitted for approval',
    auditId: 'audit_002',
    workflowTaskId: 'wf_task_001'
  },
  {
    id: 'ledger_003',
    ledgerId: 'LED-2026-001236',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    docNo: 'PO-2026-0142',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    action: 'REVIEWED',
    actorId: 'usr_cm_001',
    actorName: 'Commercial Manager',
    actorRole: 'Commercial Manager',
    timestamp: '2026-01-15T11:00:00Z',
    deviceId: 'dev_laptop_002',
    narrative: 'Reviewed commercial terms, rates competitive',
    auditId: 'audit_003',
    workflowTaskId: 'wf_task_002'
  },
  {
    id: 'ledger_004',
    ledgerId: 'LED-2026-001237',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    docNo: 'PO-2026-0142',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    action: 'APPROVED',
    actorId: 'usr_pm_001',
    actorName: 'Rajesh Kumar',
    actorRole: 'Project Manager',
    timestamp: '2026-01-15T11:30:00Z',
    deviceId: 'dev_laptop_003',
    reasonCode: 'RC-APPROVE-001',
    narrative: 'Approved within budget, vendor verified',
    auditId: 'audit_004',
    workflowTaskId: 'wf_task_003',
    protocolEvaluationId: 'eval_001'
  },
  {
    id: 'ledger_005',
    ledgerId: 'LED-2026-001238',
    entityType: 'GoodsReceipt',
    entityId: 'grn_2026_0234',
    docNo: 'GRN-2026-0234',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    siteId: 'site_001',
    siteName: 'Block A',
    action: 'RECORDED',
    actorId: 'usr_store_001',
    actorName: 'Suresh Nair',
    actorRole: 'Store Keeper',
    timestamp: '2026-01-15T14:30:00Z',
    deviceId: 'dev_mobile_001',
    location: { lat: 19.0760, lng: 72.8777 },
    narrative: 'Material received and verified at site',
    auditId: 'audit_005',
    protocolEvaluationId: 'eval_002'
  },
  {
    id: 'ledger_006',
    ledgerId: 'LED-2026-001239',
    entityType: 'Payment',
    entityId: 'pay_2026_0089',
    docNo: 'PAY-2026-0089',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    action: 'CREATED',
    actorId: 'usr_acct_001',
    actorName: 'Priya Sharma',
    actorRole: 'Accounts Manager',
    timestamp: '2026-01-15T15:00:00Z',
    deviceId: 'dev_laptop_004',
    reasonCode: 'RC-PAY-001',
    narrative: 'Payment created for vendor invoice',
    auditId: 'audit_006'
  },
  {
    id: 'ledger_007',
    ledgerId: 'LED-2026-001240',
    entityType: 'Payment',
    entityId: 'pay_2026_0089',
    docNo: 'PAY-2026-0089',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    action: 'EXCEPTION_REQUESTED',
    actorId: 'usr_acct_001',
    actorName: 'Priya Sharma',
    actorRole: 'Accounts Manager',
    timestamp: '2026-01-15T15:15:00Z',
    deviceId: 'dev_laptop_004',
    reasonCode: 'RC-EXC-001',
    narrative: 'Payment amount exceeds approval limit, requesting exception',
    auditId: 'audit_007',
    protocolEvaluationId: 'eval_003'
  }
];

// Process Catalogue
export const processCatalogue: ProcessCatalogue[] = [
  { id: 'proc_001', processCode: 'PO_APPROVAL', module: 'mat', description: 'Purchase Order Approval', requiresRaci: true, requiresIndependentAccountability: false },
  { id: 'proc_002', processCode: 'MATERIAL_ISSUE', module: 'mat', description: 'Material Issue from Store', requiresRaci: true, requiresIndependentAccountability: true },
  { id: 'proc_003', processCode: 'DPR', module: 'site', description: 'Daily Progress Report', requiresRaci: true, requiresIndependentAccountability: false },
  { id: 'proc_004', processCode: 'PAYMENT_APPROVAL', module: 'fin', description: 'Payment Approval', requiresRaci: true, requiresIndependentAccountability: true },
  { id: 'proc_005', processCode: 'MB_CERTIFICATION', module: 'site', description: 'Measurement Book Certification', requiresRaci: true, requiresIndependentAccountability: true },
  { id: 'proc_006', processCode: 'GRN_POSTING', module: 'mat', description: 'Goods Receipt Note Posting', requiresRaci: true, requiresIndependentAccountability: false },
  { id: 'proc_007', processCode: 'INVOICE_APPROVAL', module: 'fin', description: 'Invoice Approval', requiresRaci: true, requiresIndependentAccountability: false },
  { id: 'proc_008', processCode: 'VARIATION_ORDER', module: 'prj', description: 'Variation Order Approval', requiresRaci: true, requiresIndependentAccountability: true }
];

// Compliance Scores
export const complianceScores: ComplianceScore[] = [
  {
    id: 'score_001',
    subjectType: 'user',
    subjectId: 'usr_proc_001',
    subjectName: 'Vikram Singh',
    period: '2026-01',
    score: 92,
    components: {
      onTimeCompletion: 95,
      qualityScore: 90,
      protocolCompliance: 94,
      exceptionRate: 2,
      violationCount: 0
    },
    calculatedAt: '2026-01-15T00:00:00Z',
    trend: 'up',
    previousScore: 89
  },
  {
    id: 'score_002',
    subjectType: 'user',
    subjectId: 'usr_pm_001',
    subjectName: 'Rajesh Kumar',
    period: '2026-01',
    score: 88,
    components: {
      onTimeCompletion: 85,
      qualityScore: 92,
      protocolCompliance: 90,
      exceptionRate: 5,
      violationCount: 1
    },
    calculatedAt: '2026-01-15T00:00:00Z',
    trend: 'stable',
    previousScore: 87
  },
  {
    id: 'score_003',
    subjectType: 'user',
    subjectId: 'usr_store_001',
    subjectName: 'Suresh Nair',
    period: '2026-01',
    score: 95,
    components: {
      onTimeCompletion: 98,
      qualityScore: 94,
      protocolCompliance: 96,
      exceptionRate: 1,
      violationCount: 0
    },
    calculatedAt: '2026-01-15T00:00:00Z',
    trend: 'up',
    previousScore: 91
  },
  {
    id: 'score_004',
    subjectType: 'user',
    subjectId: 'usr_acct_001',
    subjectName: 'Priya Sharma',
    period: '2026-01',
    score: 85,
    components: {
      onTimeCompletion: 82,
      qualityScore: 88,
      protocolCompliance: 86,
      exceptionRate: 8,
      violationCount: 2
    },
    calculatedAt: '2026-01-15T00:00:00Z',
    trend: 'down',
    previousScore: 89
  },
  {
    id: 'score_005',
    subjectType: 'project',
    subjectId: 'prj_001',
    subjectName: 'Riverside Tower',
    period: '2026-01',
    score: 90,
    components: {
      onTimeCompletion: 88,
      qualityScore: 92,
      protocolCompliance: 91,
      exceptionRate: 4,
      violationCount: 1
    },
    calculatedAt: '2026-01-15T00:00:00Z',
    trend: 'stable',
    previousScore: 89
  }
];

// Responsibility Items
export const responsibilityItems: ResponsibilityItem[] = [
  {
    id: 'resp_001',
    itemType: 'approval',
    title: 'Approve Purchase Order',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0143',
    docNo: 'PO-2026-0143',
    assignedTo: 'usr_pm_001',
    assignedToName: 'Rajesh Kumar',
    dueDate: '2026-01-16T17:00:00Z',
    priority: 'high',
    status: 'pending',
    projectId: 'prj_001',
    projectName: 'Riverside Tower'
  },
  {
    id: 'resp_002',
    itemType: 'task',
    title: 'Complete Daily Progress Report',
    entityType: 'DPR',
    entityId: 'dpr_2026_0115',
    docNo: 'DPR-2026-0115',
    assignedTo: 'usr_eng_001',
    assignedToName: 'Suresh Engineer',
    dueDate: '2026-01-15T18:00:00Z',
    priority: 'medium',
    status: 'in_progress',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    siteId: 'site_001',
    siteName: 'Block A'
  },
  {
    id: 'resp_003',
    itemType: 'exception',
    title: 'Regularise Emergency Execution',
    entityType: 'Exception',
    entityId: 'exc_2026_002',
    docNo: 'EXC-2026-002',
    assignedTo: 'usr_sm_003',
    assignedToName: 'Vikram Singh',
    dueDate: '2026-01-18T23:59:59Z',
    priority: 'critical',
    status: 'overdue',
    projectId: 'prj_002',
    projectName: 'Highway Bridge Phase 2',
    siteId: 'site_003',
    siteName: 'Main Site'
  },
  {
    id: 'resp_004',
    itemType: 'violation',
    title: 'Resolve Protocol Violation',
    entityType: 'Violation',
    entityId: 'viol_2026_001',
    docNo: 'VIOL-2026-001',
    assignedTo: 'usr_acct_001',
    assignedToName: 'Priya Sharma',
    dueDate: '2026-01-17T17:00:00Z',
    priority: 'high',
    status: 'pending',
    projectId: 'prj_001',
    projectName: 'Riverside Tower'
  },
  {
    id: 'resp_005',
    itemType: 'overdue_record',
    title: 'Overdue Invoice Approval',
    entityType: 'Invoice',
    entityId: 'inv_2026_0045',
    docNo: 'INV-2026-0045',
    assignedTo: 'usr_cm_001',
    assignedToName: 'Commercial Manager',
    dueDate: '2026-01-14T17:00:00Z',
    priority: 'high',
    status: 'overdue',
    projectId: 'prj_001',
    projectName: 'Riverside Tower'
  },
  {
    id: 'resp_006',
    itemType: 'approval',
    title: 'Approve Payment',
    entityType: 'Payment',
    entityId: 'pay_2026_0090',
    docNo: 'PAY-2026-0090',
    assignedTo: 'usr_cfo_001',
    assignedToName: 'CFO',
    dueDate: '2026-01-17T17:00:00Z',
    priority: 'critical',
    status: 'pending',
    projectId: 'prj_001',
    projectName: 'Riverside Tower'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-ACC-01',
    stage: 'PLAN',
    control: 'Responsible and Accountable persons assigned for the WBS/activity/process before any EXECUTE-stage action',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-ACC-02',
    stage: 'APPROVE',
    control: 'RACI changes approved by next-level manager',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-ACC-03',
    stage: 'CLOSE',
    control: 'Open responsibilities reassigned before transfer/exit clearance',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-ACC-04',
    stage: 'MONITOR',
    control: 'Responsibility items overdue beyond SLA',
    enforcement: 'MONITOR',
    status: 'observe'
  }
];

// Statistics
export const accountabilityStats = {
  totalRaciAssignments: raciAssignments.length,
  activeRaciAssignments: raciAssignments.filter(r => r.status === 'active').length,
  totalLedgerEntries: actionLedger.length,
  todayLedgerEntries: actionLedger.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length,
  totalResponsibilityItems: responsibilityItems.length,
  pendingItems: responsibilityItems.filter(r => r.status === 'pending').length,
  overdueItems: responsibilityItems.filter(r => r.status === 'overdue').length,
  inProgressItems: responsibilityItems.filter(r => r.status === 'in_progress').length,
  averageComplianceScore: Math.round(complianceScores.filter(s => s.subjectType === 'user').reduce((sum, s) => sum + s.score, 0) / complianceScores.filter(s => s.subjectType === 'user').length),
  raciGaps: 3
};
