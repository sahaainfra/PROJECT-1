// Part 19 — Project Management & Project 360 Data

export interface ProjectCharter {
  projectId: string;
  objectives: string[];
  scopeInclusions: string[];
  scopeExclusions: string[];
  keyDates: {
    startDate: string;
    plannedFinish: string;
    revisedFinish?: string;
  };
  constraints: string[];
  assumptions: string[];
  status: 'draft' | 'submitted' | 'approved';
  approvedBy?: string;
  approvedAt?: string;
}

export interface TeamMember {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  projectRole: 'PM' | 'planning' | 'QS' | 'commercial' | 'site_manager' | 'store' | 'QA' | 'HSE' | 'accounts';
  fromDate: string;
  toDate?: string;
  isKeyPerson: boolean;
  allocationPercent: number;
}

export interface ScopeItem {
  id: string;
  projectId: string;
  code: string;
  description: string;
  type: 'inclusion' | 'exclusion';
  sourceContractClause?: string;
}

export interface Objective {
  id: string;
  projectId: string;
  objective: string;
  kpiCode: string;
  target: number;
  dueDate: string;
  currentProgress?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  code: string;
  name: string;
  type: 'contractual' | 'internal' | 'payment';
  plannedDate: string;
  forecastDate?: string;
  actualDate?: string;
  weightPct: number;
  linkedActivityId?: string;
  linkedContractMilestoneId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'slipped' | 'at_risk';
  slippageDays?: number;
}

export interface Risk {
  id: string;
  projectId: string;
  code: string;
  title: string;
  category: 'technical' | 'commercial' | 'HSE' | 'quality' | 'schedule' | 'statutory' | 'external';
  cause: string;
  effect: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  score: number;
  ownerId: string;
  ownerName: string;
  response: 'avoid' | 'mitigate' | 'transfer' | 'accept';
  actions: string;
  dueDate: string;
  status: 'identified' | 'assessed' | 'response_planned' | 'monitoring' | 'closed';
  residualScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  projectId: string;
  code: string;
  title: string;
  category: string;
  raisedBy: string;
  raisedByName: string;
  ownerId: string;
  ownerName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolution?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
  createdAt: string;
  updatedAt: string;
  slaDays: number;
  daysOverdue?: number;
}

export interface KPITarget {
  id: string;
  projectId: string;
  kpiCode: string;
  kpiName: string;
  period: string;
  target: number;
  actual?: number;
  unit: string;
}

export interface Project360Data {
  projectId: string;
  progress: {
    physicalPercent: number;
    financialPercent: number;
    plannedPercent: number;
    spi: number;
  };
  cost: {
    budget: number;
    committed: number;
    actual: number;
    eac: number;
    cpi: number;
    variance: number;
  };
  revenue: {
    contractValue: number;
    billed: number;
    certified: number;
    collected: number;
  };
  procurement: {
    openPRs: number;
    openPOs: number;
    overdueDeliveries: number;
    totalValuePending: number;
  };
  stores: {
    stockValue: number;
    stockOuts: number;
    consumptionVariance: number;
  };
  plant: {
    deployed: number;
    utilisation: number;
    breakdownRate: number;
  };
  manpower: {
    planned: number;
    actual: number;
    variance: number;
  };
  quality: {
    openNCRs: number;
    passRate: number;
    inspectionCount: number;
  };
  hse: {
    openPermits: number;
    incidents: number;
    ltifr: number;
    nearMisses: number;
  };
  contracts: {
    variations: number;
    claims: number;
    eot: number;
  };
  documents: {
    pendingApprovals: number;
    totalDocuments: number;
  };
  tasks: {
    pending: number;
    overdue: number;
    completed: number;
  };
}

export interface ProfitabilitySummary {
  contractValue: number;
  approvedVariations: number;
  totalContractValue: number;
  revenueRecognised: number;
  costToDate: number;
  grossMargin: number;
  grossMarginPct: number;
  eacMargin: number;
  eacMarginPct: number;
}

// Sample Project Data
export const sampleProject = {
  id: 'prj_001',
  code: 'PRJ-2025-001',
  name: 'Riverside Tower - Phase II',
  client: 'Metro Developers Pvt. Ltd.',
  status: 'active',
  startDate: '2025-06-01',
  plannedFinish: '2026-12-30',
  contractValue: 125000000
};

// Project Charter
export const projectCharter: ProjectCharter = {
  projectId: 'prj_001',
  objectives: [
    'Complete construction of 25-floor residential tower',
    'Achieve 95% quality pass rate on first inspection',
    'Maintain zero lost-time injuries',
    'Complete within approved budget of ₹125 Cr'
  ],
  scopeInclusions: [
    'Foundation and substructure work',
    'Superstructure construction (G+25)',
    'MEF first and second fix',
    'Architectural finishes',
    'External development work'
  ],
  scopeExclusions: [
    'Interior decoration by client',
    'Landscaping (separate contract)',
    'Fire fighting system (client direct)'
  ],
  keyDates: {
    startDate: '2025-06-01',
    plannedFinish: '2026-12-30'
  },
  constraints: [
    'Monsoon work restrictions (June-September)',
    'Night work prohibited in residential area',
    'Heavy vehicle movement restricted 8 AM - 10 AM'
  ],
  assumptions: [
    'Client will provide design drawings by July 2025',
    'Statutory approvals already obtained',
    'Site access available from June 1, 2025'
  ],
  status: 'approved',
  approvedBy: 'usr_mgmt_001',
  approvedAt: '2025-05-28T10:00:00Z'
};

// Team Members
export const teamMembers: TeamMember[] = [
  {
    id: 'tm_001',
    projectId: 'prj_001',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    projectRole: 'PM',
    fromDate: '2025-06-01',
    isKeyPerson: true,
    allocationPercent: 100
  },
  {
    id: 'tm_002',
    projectId: 'prj_001',
    userId: 'usr_planning_001',
    userName: 'Anita Sharma',
    projectRole: 'planning',
    fromDate: '2025-06-01',
    isKeyPerson: true,
    allocationPercent: 100
  },
  {
    id: 'tm_003',
    projectId: 'prj_001',
    userId: 'usr_qs_001',
    userName: 'Vikram Patel',
    projectRole: 'QS',
    fromDate: '2025-06-01',
    isKeyPerson: false,
    allocationPercent: 50
  },
  {
    id: 'tm_004',
    projectId: 'prj_001',
    userId: 'usr_sm_001',
    userName: 'Rahul Mehta',
    projectRole: 'site_manager',
    fromDate: '2025-06-01',
    isKeyPerson: true,
    allocationPercent: 100
  },
  {
    id: 'tm_005',
    projectId: 'prj_001',
    userId: 'usr_qa_001',
    userName: 'Priya Singh',
    projectRole: 'QA',
    fromDate: '2025-06-15',
    isKeyPerson: false,
    allocationPercent: 100
  },
  {
    id: 'tm_006',
    projectId: 'prj_001',
    userId: 'usr_hse_001',
    userName: 'Suresh Nair',
    projectRole: 'HSE',
    fromDate: '2025-06-01',
    isKeyPerson: false,
    allocationPercent: 50
  }
];

// Scope Items
export const scopeItems: ScopeItem[] = [
  { id: 'scope_001', projectId: 'prj_001', code: 'INC-001', description: 'Foundation and substructure work', type: 'inclusion', sourceContractClause: 'Clause 2.1' },
  { id: 'scope_002', projectId: 'prj_001', code: 'INC-002', description: 'Superstructure construction (G+25)', type: 'inclusion', sourceContractClause: 'Clause 2.2' },
  { id: 'scope_003', projectId: 'prj_001', code: 'INC-003', description: 'MEF first and second fix', type: 'inclusion', sourceContractClause: 'Clause 2.3' },
  { id: 'scope_004', projectId: 'prj_001', code: 'EXC-001', description: 'Interior decoration by client', type: 'exclusion', sourceContractClause: 'Clause 3.1' },
  { id: 'scope_005', projectId: 'prj_001', code: 'EXC-002', description: 'Landscaping (separate contract)', type: 'exclusion', sourceContractClause: 'Clause 3.2' }
];

// Objectives
export const objectives: Objective[] = [
  { id: 'obj_001', projectId: 'prj_001', objective: 'Complete construction of 25-floor tower', kpiCode: 'physical_progress', target: 100, dueDate: '2026-12-30', currentProgress: 67 },
  { id: 'obj_002', projectId: 'prj_001', objective: 'Achieve 95% quality pass rate', kpiCode: 'quality_pass_rate', target: 95, dueDate: '2026-12-30', currentProgress: 96.8 },
  { id: 'obj_003', projectId: 'prj_001', objective: 'Maintain zero lost-time injuries', kpiCode: 'lti_count', target: 0, dueDate: '2026-12-30', currentProgress: 0 },
  { id: 'obj_004', projectId: 'prj_001', objective: 'Complete within approved budget', kpiCode: 'cost_variance', target: 0, dueDate: '2026-12-30', currentProgress: 2.5 }
];

// Milestones
export const milestones: Milestone[] = [
  {
    id: 'ms_001',
    projectId: 'prj_001',
    code: 'MS-001',
    name: 'Foundation Complete',
    type: 'contractual',
    plannedDate: '2025-11-30',
    actualDate: '2025-11-28',
    weightPct: 15,
    status: 'completed',
    slippageDays: -2
  },
  {
    id: 'ms_002',
    projectId: 'prj_001',
    code: 'MS-002',
    name: 'Structure - Ground Floor',
    type: 'contractual',
    plannedDate: '2026-01-15',
    forecastDate: '2026-01-20',
    weightPct: 10,
    status: 'at_risk',
    slippageDays: 5
  },
  {
    id: 'ms_003',
    projectId: 'prj_001',
    code: 'MS-003',
    name: 'Structure - 5th Floor',
    type: 'contractual',
    plannedDate: '2026-03-30',
    weightPct: 15,
    status: 'pending'
  },
  {
    id: 'ms_004',
    projectId: 'prj_001',
    code: 'MS-004',
    name: 'MEP First Fix',
    type: 'internal',
    plannedDate: '2026-05-15',
    weightPct: 20,
    status: 'pending'
  },
  {
    id: 'ms_005',
    projectId: 'prj_001',
    code: 'MS-006',
    name: 'Payment Milestone - 50% Completion',
    type: 'payment',
    plannedDate: '2026-06-30',
    weightPct: 25,
    status: 'pending'
  },
  {
    id: 'ms_006',
    projectId: 'prj_001',
    code: 'MS-007',
    name: 'Handover',
    type: 'contractual',
    plannedDate: '2026-12-30',
    weightPct: 15,
    status: 'pending'
  }
];

// Risks
export const risks: Risk[] = [
  {
    id: 'risk_001',
    projectId: 'prj_001',
    code: 'RSK-001',
    title: 'Monsoon delay to foundation work',
    category: 'schedule',
    cause: 'Heavy rainfall during June-September',
    effect: 'Project delay of 2-3 weeks',
    probability: 4,
    impact: 3,
    score: 12,
    ownerId: 'usr_pm_001',
    ownerName: 'Rajesh Kumar',
    response: 'mitigate',
    actions: 'Accelerate foundation work before monsoon; deploy additional pumps for dewatering',
    dueDate: '2025-05-31',
    status: 'monitoring',
    residualScore: 6,
    createdAt: '2025-04-15T00:00:00Z',
    updatedAt: '2025-06-01T00:00:00Z'
  },
  {
    id: 'risk_002',
    projectId: 'prj_001',
    code: 'RSK-002',
    title: 'Steel price escalation',
    category: 'commercial',
    cause: 'Global steel market volatility',
    effect: 'Cost overrun of 5-8%',
    probability: 3,
    impact: 4,
    score: 12,
    ownerId: 'usr_cm_001',
    ownerName: 'Commercial Manager',
    response: 'mitigate',
    actions: 'Lock in steel rates with vendor for 6 months; explore alternative suppliers',
    dueDate: '2025-07-31',
    status: 'monitoring',
    residualScore: 8,
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-06-15T00:00:00Z'
  },
  {
    id: 'risk_003',
    projectId: 'prj_001',
    code: 'RSK-003',
    title: 'Skilled labour shortage',
    category: 'technical',
    cause: 'High demand in construction sector',
    effect: 'Productivity reduction, schedule delay',
    probability: 3,
    impact: 3,
    score: 9,
    ownerId: 'usr_sm_001',
    ownerName: 'Rahul Mehta',
    response: 'mitigate',
    actions: 'Engage labour contractors early; provide accommodation and transport',
    dueDate: '2025-06-30',
    status: 'response_planned',
    createdAt: '2025-05-10T00:00:00Z',
    updatedAt: '2025-06-01T00:00:00Z'
  },
  {
    id: 'risk_004',
    projectId: 'prj_001',
    code: 'RSK-004',
    title: 'Design delay from client',
    category: 'schedule',
    cause: 'Client architectural team resource constraints',
    effect: 'Work stoppage, idle resources',
    probability: 2,
    impact: 5,
    score: 10,
    ownerId: 'usr_pm_001',
    ownerName: 'Rajesh Kumar',
    response: 'transfer',
    actions: 'Contractual clause for delay damages; weekly design review meetings',
    dueDate: '2025-07-15',
    status: 'monitoring',
    residualScore: 6,
    createdAt: '2025-05-15T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z'
  },
  {
    id: 'risk_005',
    projectId: 'prj_001',
    code: 'RSK-005',
    title: 'Safety incident due to height work',
    category: 'HSE',
    cause: 'Working at height without proper safeguards',
    effect: 'Injury, work stoppage, regulatory action',
    probability: 2,
    impact: 5,
    score: 10,
    ownerId: 'usr_hse_001',
    ownerName: 'Suresh Nair',
    response: 'avoid',
    actions: 'Mandatory safety harness; daily toolbox talks; safety officer presence',
    dueDate: '2025-06-01',
    status: 'monitoring',
    residualScore: 4,
    createdAt: '2025-05-20T00:00:00Z',
    updatedAt: '2025-06-01T00:00:00Z'
  },
  {
    id: 'risk_006',
    projectId: 'prj_001',
    code: 'RSK-006',
    title: 'Quality defects in concrete work',
    category: 'quality',
    cause: 'Improper curing, poor workmanship',
    effect: 'Rework, cost overrun, schedule delay',
    probability: 2,
    impact: 4,
    score: 8,
    ownerId: 'usr_qa_001',
    ownerName: 'Priya Singh',
    response: 'mitigate',
    actions: 'Strict quality checks; curing compound application; trained masons only',
    dueDate: '2025-06-15',
    status: 'monitoring',
    residualScore: 4,
    createdAt: '2025-05-25T00:00:00Z',
    updatedAt: '2025-06-15T00:00:00Z'
  }
];

// Issues
export const issues: Issue[] = [
  {
    id: 'issue_001',
    projectId: 'prj_001',
    code: 'ISS-001',
    title: 'Drawing revision delay for Block B foundation',
    category: 'design',
    raisedBy: 'usr_sm_001',
    raisedByName: 'Rahul Mehta',
    ownerId: 'usr_pm_001',
    ownerName: 'Rajesh Kumar',
    priority: 'high',
    dueDate: '2026-01-20',
    status: 'in_progress',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
    slaDays: 7,
    daysOverdue: 0
  },
  {
    id: 'issue_002',
    projectId: 'prj_001',
    code: 'ISS-002',
    title: 'Material delivery delay - Steel reinforcement',
    category: 'procurement',
    raisedBy: 'usr_store_001',
    raisedByName: 'Store Keeper',
    ownerId: 'usr_proc_001',
    ownerName: 'Procurement Manager',
    priority: 'critical',
    dueDate: '2026-01-18',
    status: 'open',
    createdAt: '2026-01-14T00:00:00Z',
    updatedAt: '2026-01-14T00:00:00Z',
    slaDays: 3,
    daysOverdue: 2
  },
  {
    id: 'issue_003',
    projectId: 'prj_001',
    code: 'ISS-003',
    title: 'Quality non-conformance in column casting',
    category: 'quality',
    raisedBy: 'usr_qa_001',
    raisedByName: 'Priya Singh',
    ownerId: 'usr_sm_001',
    ownerName: 'Rahul Mehta',
    priority: 'high',
    dueDate: '2026-01-22',
    status: 'in_progress',
    resolution: 'Core testing conducted; results acceptable with minor repair',
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-16T00:00:00Z',
    slaDays: 5,
    daysOverdue: 0
  },
  {
    id: 'issue_004',
    projectId: 'prj_001',
    code: 'ISS-004',
    title: 'Safety permit renewal pending',
    category: 'HSE',
    raisedBy: 'usr_hse_001',
    raisedByName: 'Suresh Nair',
    ownerId: 'usr_hse_001',
    ownerName: 'Suresh Nair',
    priority: 'medium',
    dueDate: '2026-01-25',
    status: 'open',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
    slaDays: 10,
    daysOverdue: 0
  },
  {
    id: 'issue_005',
    projectId: 'prj_001',
    code: 'ISS-005',
    title: 'Client variation order not approved',
    category: 'contract',
    raisedBy: 'usr_cm_001',
    raisedByName: 'Commercial Manager',
    ownerId: 'usr_pm_001',
    ownerName: 'Rajesh Kumar',
    priority: 'high',
    dueDate: '2026-01-19',
    status: 'resolved',
    resolution: 'Client approved variation on Jan 18; value ₹12.5 Lakhs',
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
    slaDays: 7,
    daysOverdue: 0
  }
];

// KPI Targets
export const kpiTargets: KPITarget[] = [
  { id: 'kpi_001', projectId: 'prj_001', kpiCode: 'physical_progress', kpiName: 'Physical Progress', period: '2026-01', target: 70, actual: 67, unit: '%' },
  { id: 'kpi_002', projectId: 'prj_001', kpiCode: 'financial_progress', kpiName: 'Financial Progress', period: '2026-01', target: 68, actual: 65, unit: '%' },
  { id: 'kpi_003', projectId: 'prj_001', kpiCode: 'quality_pass_rate', kpiName: 'Quality Pass Rate', period: '2026-01', target: 95, actual: 96.8, unit: '%' },
  { id: 'kpi_004', projectId: 'prj_001', kpiCode: 'safety_incidents', kpiName: 'Safety Incidents', period: '2026-01', target: 0, actual: 0, unit: 'count' },
  { id: 'kpi_005', projectId: 'prj_001', kpiCode: 'cost_variance', kpiName: 'Cost Variance', period: '2026-01', target: 0, actual: 2.5, unit: '%' }
];

// Project 360 Data
export const project360Data: Project360Data = {
  projectId: 'prj_001',
  progress: {
    physicalPercent: 67,
    financialPercent: 65,
    plannedPercent: 70,
    spi: 0.96
  },
  cost: {
    budget: 125000000,
    committed: 85000000,
    actual: 78500000,
    eac: 128000000,
    cpi: 0.98,
    variance: 3000000
  },
  revenue: {
    contractValue: 125000000,
    billed: 82000000,
    certified: 78000000,
    collected: 72000000
  },
  procurement: {
    openPRs: 14,
    openPOs: 8,
    overdueDeliveries: 2,
    totalValuePending: 8950000
  },
  stores: {
    stockValue: 12450000,
    stockOuts: 3,
    consumptionVariance: 1.6
  },
  plant: {
    deployed: 18,
    utilisation: 78.5,
    breakdownRate: 3.2
  },
  manpower: {
    planned: 186,
    actual: 178,
    variance: -8
  },
  quality: {
    openNCRs: 2,
    passRate: 96.8,
    inspectionCount: 45
  },
  hse: {
    openPermits: 5,
    incidents: 0,
    ltifr: 0,
    nearMisses: 7
  },
  contracts: {
    variations: 3,
    claims: 1,
    eot: 0
  },
  documents: {
    pendingApprovals: 12,
    totalDocuments: 234
  },
  tasks: {
    pending: 24,
    overdue: 3,
    completed: 156
  }
};

// Profitability Summary
export const profitabilitySummary: ProfitabilitySummary = {
  contractValue: 125000000,
  approvedVariations: 3500000,
  totalContractValue: 128500000,
  revenueRecognised: 78000000,
  costToDate: 78500000,
  grossMargin: -500000,
  grossMarginPct: -0.64,
  eacMargin: 500000,
  eacMarginPct: 0.39
};

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-PRJ-01',
    stage: 'PLAN',
    control: 'Project charter, milestones, risk register and RACI approved before mobilisation',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-PRJ-02',
    stage: 'MONITOR',
    control: 'High risks (score ≥ 15) without response plan in 7 days',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-PRJ-03',
    stage: 'MONITOR',
    control: 'Milestone slip beyond threshold',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-PRJ-04',
    stage: 'CLOSE',
    control: 'Project closure checklist incl. zero open findings/exceptions',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const projectStats = {
  totalMilestones: milestones.length,
  completedMilestones: milestones.filter(m => m.status === 'completed').length,
  atRiskMilestones: milestones.filter(m => m.status === 'at_risk').length,
  totalRisks: risks.length,
  highRisks: risks.filter(r => r.score >= 15).length,
  mediumRisks: risks.filter(r => r.score >= 8 && r.score < 15).length,
  lowRisks: risks.filter(r => r.score < 8).length,
  totalIssues: issues.length,
  openIssues: issues.filter(i => i.status === 'open').length,
  overdueIssues: issues.filter(i => i.daysOverdue && i.daysOverdue > 0).length,
  teamSize: teamMembers.length,
  keyPersons: teamMembers.filter(t => t.isKeyPerson).length
};
