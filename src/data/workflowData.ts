// Part 6 — Workflow & Approval Engine Data

export interface WorkflowDefinition {
  id: string;
  code: string;
  docType: string;
  name: string;
  version: number;
  isActive: boolean;
  effectiveFrom: string;
  createdBy: string;
  stepsCount: number;
  instanceCount: number;
}

export interface WorkflowStep {
  id: string;
  definitionId: string;
  seq: number;
  name: string;
  type: 'sequential' | 'parallel_all' | 'parallel_any' | 'quorum';
  quorumN?: number;
  approverRuleType: 'role' | 'user' | 'position' | 'project_role' | 'department_head' | 'reporting_manager' | 'dynamic';
  approverRuleValue: string;
  slaHours: number;
  escalateToRule?: string;
  canEditFields?: string[];
  allowReturnTo?: number[];
}

export interface WorkflowCondition {
  id: string;
  definitionId: string;
  stepId?: string;
  expression: string;
  action: 'include' | 'skip' | 'route_to';
  targetStep?: number;
}

export interface WorkflowInstance {
  id: string;
  docType: string;
  docId: string;
  docNumber: string;
  definitionId: string;
  definitionVersion: number;
  status: 'draft' | 'in_progress' | 'approved' | 'rejected' | 'returned' | 'cancelled' | 'recalled';
  currentStepSeq: number;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  completedAt: string | null;
  amountSnapshot: number;
  contextJson: Record<string, any>;
  tasksCount: number;
  completedTasks: number;
}

export interface WorkflowTask {
  id: string;
  instanceId: string;
  stepSeq: number;
  stepName: string;
  assigneeUserId: string;
  assigneeName: string;
  originalAssigneeId?: string;
  delegatedFrom?: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'skipped' | 'expired';
  actedAt: string | null;
  comment: string | null;
  dueAt: string;
  escalatedAt: string | null;
  slaHours: number;
  remainingHours: number;
}

export interface WorkflowAction {
  id: string;
  instanceId: string;
  taskId: string;
  action: 'submit' | 'approve' | 'reject' | 'return' | 'resubmit' | 'recall' | 'cancel' | 'reassign' | 'escalate';
  actorId: string;
  actorName: string;
  onBehalfOf?: string;
  comment: string | null;
  reason: string | null;
  at: string;
  ip: string;
}

export interface Delegation {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegateId: string;
  delegateName: string;
  docTypes: string[];
  scope: string;
  fromDate: string;
  toDate: string;
  reason: string;
  approvedBy: string;
  status: 'active' | 'pending' | 'expired';
}

export interface SLACalendar {
  id: string;
  companyId: string;
  workingDays: string[];
  holidays: string[];
}

// Workflow Definitions
export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: 'wf_def_001',
    code: 'WF-PR-001',
    docType: 'purchase_request',
    name: 'Purchase Request Approval',
    version: 2,
    isActive: true,
    effectiveFrom: '2025-06-01',
    createdBy: 'usr_admin_001',
    stepsCount: 3,
    instanceCount: 156
  },
  {
    id: 'wf_def_002',
    code: 'WF-PO-001',
    docType: 'purchase_order',
    name: 'Purchase Order Approval',
    version: 3,
    isActive: true,
    effectiveFrom: '2025-07-01',
    createdBy: 'usr_admin_001',
    stepsCount: 4,
    instanceCount: 89
  },
  {
    id: 'wf_def_003',
    code: 'WF-SB-001',
    docType: 'subcontract_bill',
    name: 'Subcontract Bill Approval',
    version: 1,
    isActive: true,
    effectiveFrom: '2025-08-01',
    createdBy: 'usr_admin_001',
    stepsCount: 4,
    instanceCount: 34
  },
  {
    id: 'wf_def_004',
    code: 'WF-LV-001',
    docType: 'leave_request',
    name: 'Leave Request Approval',
    version: 1,
    isActive: true,
    effectiveFrom: '2025-01-01',
    createdBy: 'usr_admin_001',
    stepsCount: 2,
    instanceCount: 423
  },
  {
    id: 'wf_def_005',
    code: 'WF-BR-001',
    docType: 'budget_revision',
    name: 'Budget Revision Approval',
    version: 1,
    isActive: true,
    effectiveFrom: '2025-04-01',
    createdBy: 'usr_admin_001',
    stepsCount: 3,
    instanceCount: 12
  }
];

// Workflow Steps (Sample for PO)
export const workflowSteps: WorkflowStep[] = [
  // PR Workflow
  { id: 'step_001', definitionId: 'wf_def_001', seq: 1, name: 'Procurement Review', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'PROCUREMENT', slaHours: 24 },
  { id: 'step_002', definitionId: 'wf_def_001', seq: 2, name: 'Project Manager Approval', type: 'sequential', approverRuleType: 'project_role', approverRuleValue: 'PROJECT_MANAGER', slaHours: 48 },
  { id: 'step_003', definitionId: 'wf_def_001', seq: 3, name: 'Management Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'MANAGEMENT', slaHours: 72, escalateToRule: 'CFO' },
  
  // PO Workflow
  { id: 'step_004', definitionId: 'wf_def_002', seq: 1, name: 'Procurement Manager', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'PROCUREMENT', slaHours: 24 },
  { id: 'step_005', definitionId: 'wf_def_002', seq: 2, name: 'Project/Commercial Manager', type: 'parallel_any', approverRuleType: 'project_role', approverRuleValue: 'PROJECT_MANAGER,COMMERCIAL_MANAGER', slaHours: 48 },
  { id: 'step_006', definitionId: 'wf_def_002', seq: 3, name: 'Finance Review', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'ACCOUNTS', slaHours: 24 },
  { id: 'step_007', definitionId: 'wf_def_002', seq: 4, name: 'Management Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'MANAGEMENT', slaHours: 72, escalateToRule: 'CFO' },
  
  // Subcontract Bill Workflow
  { id: 'step_008', definitionId: 'wf_def_003', seq: 1, name: 'QS Verification', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'QS', slaHours: 48 },
  { id: 'step_009', definitionId: 'wf_def_003', seq: 2, name: 'Commercial Manager', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'COMMERCIAL_MANAGER', slaHours: 48 },
  { id: 'step_010', definitionId: 'wf_def_003', seq: 3, name: 'Finance Review', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'ACCOUNTS', slaHours: 24 },
  { id: 'step_011', definitionId: 'wf_def_003', seq: 4, name: 'Authorised Approver', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'MANAGEMENT', slaHours: 72 },
  
  // Leave Request Workflow
  { id: 'step_012', definitionId: 'wf_def_004', seq: 1, name: 'Reporting Manager', type: 'sequential', approverRuleType: 'reporting_manager', approverRuleValue: '', slaHours: 24 },
  { id: 'step_013', definitionId: 'wf_def_004', seq: 2, name: 'HR Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'HR_MANAGER', slaHours: 48 },
  
  // Budget Revision Workflow
  { id: 'step_014', definitionId: 'wf_def_005', seq: 1, name: 'Project Manager', type: 'sequential', approverRuleType: 'project_role', approverRuleValue: 'PROJECT_MANAGER', slaHours: 48 },
  { id: 'step_015', definitionId: 'wf_def_005', seq: 2, name: 'Commercial Manager', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'COMMERCIAL_MANAGER', slaHours: 48 },
  { id: 'step_016', definitionId: 'wf_def_005', seq: 3, name: 'CFO Approval', type: 'sequential', approverRuleType: 'role', approverRuleValue: 'MANAGEMENT', slaHours: 72 }
];

// Workflow Conditions
export const workflowConditions: WorkflowCondition[] = [
  { id: 'cond_001', definitionId: 'wf_def_001', expression: 'amount < 500000', action: 'skip', targetStep: 3 },
  { id: 'cond_002', definitionId: 'wf_def_002', expression: 'amount < 500000', action: 'skip', targetStep: 4 },
  { id: 'cond_003', definitionId: 'wf_def_002', expression: 'amount >= 10000000', action: 'include' },
  { id: 'cond_004', definitionId: 'wf_def_004', expression: 'days <= 3', action: 'skip', targetStep: 2 },
];

// Workflow Instances
export const workflowInstances: WorkflowInstance[] = [
  {
    id: 'inst_001',
    docType: 'purchase_order',
    docId: 'po_2026_0142',
    docNumber: 'PO-2026-0142',
    definitionId: 'wf_def_002',
    definitionVersion: 3,
    status: 'in_progress',
    currentStepSeq: 2,
    submittedBy: 'usr_proc_001',
    submittedByName: 'Vikram Singh',
    submittedAt: '2026-01-14T10:30:00Z',
    completedAt: null,
    amountSnapshot: 2450000,
    contextJson: { vendor: 'Tata Steel Ltd.', project: 'Riverside Tower' },
    tasksCount: 4,
    completedTasks: 1
  },
  {
    id: 'inst_002',
    docType: 'purchase_request',
    docId: 'pr_2026_0256',
    docNumber: 'PR-2026-0256',
    definitionId: 'wf_def_001',
    definitionVersion: 2,
    status: 'approved',
    currentStepSeq: 3,
    submittedBy: 'usr_eng_001',
    submittedByName: 'Rahul Mehta',
    submittedAt: '2026-01-13T08:00:00Z',
    completedAt: '2026-01-14T16:30:00Z',
    amountSnapshot: 320000,
    contextJson: { project: 'Riverside Tower', material: 'Steel TMT 16mm' },
    tasksCount: 3,
    completedTasks: 3
  },
  {
    id: 'inst_003',
    docType: 'subcontract_bill',
    docId: 'sb_2026_0034',
    docNumber: 'SCB-2026-0034',
    definitionId: 'wf_def_003',
    definitionVersion: 1,
    status: 'in_progress',
    currentStepSeq: 1,
    submittedBy: 'usr_pm_002',
    submittedByName: 'Amit Patel',
    submittedAt: '2026-01-15T09:00:00Z',
    completedAt: null,
    amountSnapshot: 4200000,
    contextJson: { subcontractor: 'ABC Constructions', project: 'Highway Bridge' },
    tasksCount: 4,
    completedTasks: 0
  },
  {
    id: 'inst_004',
    docType: 'leave_request',
    docId: 'lv_2026_0089',
    docNumber: 'LV-2026-0089',
    definitionId: 'wf_def_004',
    definitionVersion: 1,
    status: 'approved',
    currentStepSeq: 2,
    submittedBy: 'usr_eng_002',
    submittedByName: 'Suresh Nair',
    submittedAt: '2026-01-12T11:00:00Z',
    completedAt: '2026-01-12T15:00:00Z',
    amountSnapshot: 0,
    contextJson: { leaveType: 'Casual', days: 2 },
    tasksCount: 2,
    completedTasks: 2
  },
  {
    id: 'inst_005',
    docType: 'purchase_order',
    docId: 'po_2026_0141',
    docNumber: 'PO-2026-0141',
    definitionId: 'wf_def_002',
    definitionVersion: 3,
    status: 'rejected',
    currentStepSeq: 2,
    submittedBy: 'usr_proc_001',
    submittedByName: 'Vikram Singh',
    submittedAt: '2026-01-10T14:00:00Z',
    completedAt: '2026-01-11T10:00:00Z',
    amountSnapshot: 890000,
    contextJson: { vendor: 'Local Suppliers', project: 'Site B' },
    tasksCount: 4,
    completedTasks: 2
  },
  {
    id: 'inst_006',
    docType: 'budget_revision',
    docId: 'br_2026_0005',
    docNumber: 'BR-2026-0005',
    definitionId: 'wf_def_005',
    definitionVersion: 1,
    status: 'in_progress',
    currentStepSeq: 1,
    submittedBy: 'usr_pm_001',
    submittedByName: 'Rajesh Kumar',
    submittedAt: '2026-01-15T07:30:00Z',
    completedAt: null,
    amountSnapshot: 15000000,
    contextJson: { project: 'Riverside Tower', revisionType: 'Scope Addition' },
    tasksCount: 3,
    completedTasks: 0
  }
];

// Workflow Tasks
export const workflowTasks: WorkflowTask[] = [
  {
    id: 'task_001',
    instanceId: 'inst_001',
    stepSeq: 1,
    stepName: 'Procurement Manager',
    assigneeUserId: 'usr_proc_001',
    assigneeName: 'Vikram Singh',
    status: 'approved',
    actedAt: '2026-01-14T11:00:00Z',
    comment: 'Vendor verified, rates competitive',
    dueAt: '2026-01-15T10:30:00Z',
    escalatedAt: null,
    slaHours: 24,
    remainingHours: 0
  },
  {
    id: 'task_002',
    instanceId: 'inst_001',
    stepSeq: 2,
    stepName: 'Project/Commercial Manager',
    assigneeUserId: 'usr_pm_001',
    assigneeName: 'Rajesh Kumar',
    status: 'pending',
    actedAt: null,
    comment: null,
    dueAt: '2026-01-16T11:00:00Z',
    escalatedAt: null,
    slaHours: 48,
    remainingHours: 36
  },
  {
    id: 'task_003',
    instanceId: 'inst_003',
    stepSeq: 1,
    stepName: 'QS Verification',
    assigneeUserId: 'usr_qs_001',
    assigneeName: 'Priya Sharma',
    status: 'pending',
    actedAt: null,
    comment: null,
    dueAt: '2026-01-17T09:00:00Z',
    escalatedAt: null,
    slaHours: 48,
    remainingHours: 44
  },
  {
    id: 'task_004',
    instanceId: 'inst_006',
    stepSeq: 1,
    stepName: 'Project Manager',
    assigneeUserId: 'usr_pm_001',
    assigneeName: 'Rajesh Kumar',
    status: 'pending',
    actedAt: null,
    comment: null,
    dueAt: '2026-01-17T07:30:00Z',
    escalatedAt: null,
    slaHours: 48,
    remainingHours: 40
  },
  {
    id: 'task_005',
    instanceId: 'inst_005',
    stepSeq: 1,
    stepName: 'Procurement Manager',
    assigneeUserId: 'usr_proc_001',
    assigneeName: 'Vikram Singh',
    status: 'approved',
    actedAt: '2026-01-10T15:00:00Z',
    comment: 'Forwarded for review',
    dueAt: '2026-01-11T14:00:00Z',
    escalatedAt: null,
    slaHours: 24,
    remainingHours: 0
  },
  {
    id: 'task_006',
    instanceId: 'inst_005',
    stepSeq: 2,
    stepName: 'Project/Commercial Manager',
    assigneeUserId: 'usr_cm_001',
    assigneeName: 'Amit Patel',
    status: 'rejected',
    actedAt: '2026-01-11T10:00:00Z',
    comment: 'Vendor not in approved list. Please select from empaneled vendors.',
    dueAt: '2026-01-12T15:00:00Z',
    escalatedAt: null,
    slaHours: 48,
    remainingHours: 0
  }
];

// Workflow Actions (Audit Trail)
export const workflowActions: WorkflowAction[] = [
  {
    id: 'act_001',
    instanceId: 'inst_001',
    taskId: 'task_001',
    action: 'submit',
    actorId: 'usr_proc_001',
    actorName: 'Vikram Singh',
    comment: null,
    reason: null,
    at: '2026-01-14T10:30:00Z',
    ip: '192.168.1.100'
  },
  {
    id: 'act_002',
    instanceId: 'inst_001',
    taskId: 'task_001',
    action: 'approve',
    actorId: 'usr_proc_001',
    actorName: 'Vikram Singh',
    comment: 'Vendor verified, rates competitive',
    reason: null,
    at: '2026-01-14T11:00:00Z',
    ip: '192.168.1.100'
  },
  {
    id: 'act_003',
    instanceId: 'inst_005',
    taskId: 'task_006',
    action: 'reject',
    actorId: 'usr_cm_001',
    actorName: 'Amit Patel',
    comment: 'Vendor not in approved list',
    reason: 'VENDOR_NOT_APPROVED',
    at: '2026-01-11T10:00:00Z',
    ip: '192.168.1.105'
  }
];

// Delegations
export const delegations: Delegation[] = [
  {
    id: 'del_001',
    delegatorId: 'usr_pm_001',
    delegatorName: 'Rajesh Kumar',
    delegateId: 'usr_pm_002',
    delegateName: 'Amit Patel',
    docTypes: ['purchase_order', 'purchase_request'],
    scope: 'project:prj_001',
    fromDate: '2026-01-20',
    toDate: '2026-01-25',
    reason: 'Official tour - Client meeting',
    approvedBy: 'usr_admin_001',
    status: 'pending'
  },
  {
    id: 'del_002',
    delegatorId: 'usr_acct_001',
    delegatorName: 'Priya Sharma',
    delegateId: 'usr_acct_002',
    delegateName: 'Neha Gupta',
    docTypes: ['payment', 'invoice'],
    scope: 'company',
    fromDate: '2026-01-15',
    toDate: '2026-01-18',
    reason: 'Medical leave',
    approvedBy: 'usr_admin_001',
    status: 'active'
  }
];

// SLA Calendar
export const slaCalendars: SLACalendar[] = [
  {
    id: 'cal_001',
    companyId: 'comp_001',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    holidays: ['2026-01-26', '2026-03-10', '2026-04-14', '2026-05-01', '2026-08-15', '2026-10-02', '2026-11-04', '2026-12-25']
  }
];

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-WF-01',
    stage: 'APPROVE',
    control: 'Submitter cannot approve own document; one approver cannot act at two levels',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-WF-02',
    stage: 'MONITOR',
    control: 'Approval SLA breach escalates L1→L2→L3',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-WF-03',
    stage: 'VERIFY',
    control: 'Bulk approval disabled for documents carrying WARN/EXCEPTION results',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-WF-04',
    stage: 'MONITOR',
    control: 'Split documents to stay under approval bands',
    enforcement: 'MONITOR',
    status: 'observe'
  }
];

// Statistics
export const workflowStats = {
  totalDefinitions: workflowDefinitions.length,
  activeDefinitions: workflowDefinitions.filter(d => d.isActive).length,
  totalInstances: workflowInstances.length,
  pendingInstances: workflowInstances.filter(i => i.status === 'in_progress').length,
  approvedInstances: workflowInstances.filter(i => i.status === 'approved').length,
  rejectedInstances: workflowInstances.filter(i => i.status === 'rejected').length,
  pendingTasks: workflowTasks.filter(t => t.status === 'pending').length,
  overdueTasks: workflowTasks.filter(t => t.status === 'pending' && t.remainingHours <= 0).length,
  activeDelegations: delegations.filter(d => d.status === 'active').length,
  avgTurnaroundHours: 36.5
};
