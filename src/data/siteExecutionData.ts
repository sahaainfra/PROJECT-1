// Part 28 — Advanced Site Execution Data

export interface WorkFront {
  id: string;
  siteId: string;
  siteName: string;
  code: string;
  name: string;
  location: string;
  chainage?: string;
  wbsNodeId: string;
  wbsNodeCode: string;
  status: 'available' | 'blocked' | 'active' | 'completed';
  blockingReason?: string;
  blockingConstraintId?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface DailyPlan {
  id: string;
  siteId: string;
  siteName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  preparedBy: string;
  preparedByName: string;
  status: 'draft' | 'published' | 'closed';
  publishedAt?: string;
  closedAt?: string;
  lines: DailyPlanLine[];
  ppc?: number; // Percent Plan Complete
}

export interface DailyPlanLine {
  id: string;
  planId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  workFrontId: string;
  workFrontName: string;
  plannedQty: number;
  actualQty?: number;
  uomId: string;
  uomName: string;
  crew: string;
  labourPlanned: Record<string, number>; // trade -> count
  labourActual?: Record<string, number>;
  plantPlanned: string[];
  plantActual?: string[];
  materialPlanned: string[];
  materialActual?: string[];
  supervisorId: string;
  supervisorName: string;
  status: 'planned' | 'in_progress' | 'completed' | 'not_started' | 'blocked';
  completionPct: number;
  nonCompletionReason?: string;
}

export interface Constraint {
  id: string;
  projectId: string;
  siteId: string;
  siteName: string;
  activityId?: string;
  activityCode?: string;
  type: 'drawing' | 'approval' | 'material' | 'labour' | 'plant' | 'access' | 'permit' | 'client' | 'weather' | 'utility' | 'other';
  description: string;
  raisedBy: string;
  raisedByName: string;
  raisedOn: string;
  ownerId: string;
  ownerName: string;
  needBy: string;
  resolvedOn?: string;
  resolvedBy?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  impactDays: number;
  claimEventId?: string;
  photosDocIds?: string[];
}

export interface Delay {
  id: string;
  projectId: string;
  siteId: string;
  siteName: string;
  activityId?: string;
  activityCode?: string;
  activityName?: string;
  start: string;
  end?: string;
  durationDays: number;
  causeCategory: 'client' | 'contractor' | 'subcontractor' | 'neutral' | 'weather' | 'force_majeure';
  responsibleParty: 'client' | 'contractor' | 'subcontractor' | 'neutral';
  description: string;
  evidenceDocIds: string[];
  status: 'open' | 'acknowledged' | 'resolved' | 'escalated';
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface SiteInstruction {
  id: string;
  projectId: string;
  projectName: string;
  siNo: string;
  issuedBy: 'client' | 'consultant' | 'internal';
  issuedByName: string;
  date: string;
  description: string;
  drawings: string[];
  costImpactFlag: boolean;
  timeImpactFlag: boolean;
  costImpactAmount?: number;
  timeImpactDays?: number;
  status: 'received' | 'under_review' | 'accepted' | 'rejected' | 'converted_to_variation';
  variationId?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface SitePhoto {
  id: string;
  siteId: string;
  siteName: string;
  activityId?: string;
  activityCode?: string;
  workFrontId?: string;
  workFrontName?: string;
  photoUrl: string;
  thumbnailUrl: string;
  geoLocation: {
    lat: number;
    lng: number;
  };
  capturedAt: string;
  capturedBy: string;
  capturedByName: string;
  tags: string[];
  description?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Work Fronts
export const workFronts: WorkFront[] = [
  {
    id: 'wf_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    code: 'WF-A-001',
    name: 'Foundation - Footing F1',
    location: 'Block A - Grid A1-A5',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    status: 'completed',
    createdAt: '2025-06-01T00:00:00Z',
    createdBy: 'usr_sm_001',
    createdByName: 'Rahul Mehta'
  },
  {
    id: 'wf_002',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    code: 'WF-A-002',
    name: 'Foundation - Footing F2',
    location: 'Block A - Grid B1-B5',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    status: 'active',
    createdAt: '2025-06-15T00:00:00Z',
    createdBy: 'usr_sm_001',
    createdByName: 'Rahul Mehta'
  },
  {
    id: 'wf_003',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    code: 'WF-A-003',
    name: 'Column C1-C5 (Ground Floor)',
    location: 'Block A - Ground Floor',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    status: 'active',
    createdAt: '2025-09-01T00:00:00Z',
    createdBy: 'usr_sm_001',
    createdByName: 'Rahul Mehta'
  },
  {
    id: 'wf_004',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    code: 'WF-A-004',
    name: 'Slab Casting - Ground Floor',
    location: 'Block A - Ground Floor',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    status: 'blocked',
    blockingReason: 'Waiting for reinforcement approval',
    blockingConstraintId: 'const_001',
    createdAt: '2025-11-01T00:00:00Z',
    createdBy: 'usr_sm_001',
    createdByName: 'Rahul Mehta'
  },
  {
    id: 'wf_005',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    code: 'WF-A-005',
    name: 'Masonry Work - Ground Floor',
    location: 'Block A - Ground Floor',
    wbsNodeId: 'wbs_005',
    wbsNodeCode: '1.1.3',
    status: 'available',
    createdAt: '2026-01-10T00:00:00Z',
    createdBy: 'usr_sm_001',
    createdByName: 'Rahul Mehta'
  }
];

// Sample Daily Plans
export const dailyPlans: DailyPlan[] = [
  {
    id: 'plan_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-15',
    shift: 'morning',
    preparedBy: 'usr_eng_001',
    preparedByName: 'Suresh Engineer',
    status: 'closed',
    publishedAt: '2026-01-14T18:00:00Z',
    closedAt: '2026-01-15T18:00:00Z',
    ppc: 85,
    lines: [
      {
        id: 'line_001',
        planId: 'plan_001',
        activityId: 'act_006',
        activityCode: 'A2010',
        activityName: 'RCC M30 in Columns (G+F)',
        workFrontId: 'wf_003',
        workFrontName: 'Column C1-C5 (Ground Floor)',
        plannedQty: 40,
        actualQty: 40,
        uomId: 'uom_cum',
        uomName: 'Cum',
        crew: 'Crew A',
        labourPlanned: { 'Mason': 8, 'Helper': 12, 'Steel Fixer': 6 },
        labourActual: { 'Mason': 8, 'Helper': 12, 'Steel Fixer': 6 },
        plantPlanned: ['Concrete Pump', 'Vibrator'],
        plantActual: ['Concrete Pump', 'Vibrator'],
        materialPlanned: ['RCC M30', 'Steel TMT 16mm'],
        materialActual: ['RCC M30', 'Steel TMT 16mm'],
        supervisorId: 'usr_sup_001',
        supervisorName: 'Rajesh Supervisor',
        status: 'completed',
        completionPct: 100
      },
      {
        id: 'line_002',
        planId: 'plan_001',
        activityId: 'act_007',
        activityCode: 'A2020',
        activityName: 'RCC M30 in Beams (G+F)',
        workFrontId: 'wf_003',
        workFrontName: 'Column C1-C5 (Ground Floor)',
        plannedQty: 30,
        actualQty: 25,
        uomId: 'uom_cum',
        uomName: 'Cum',
        crew: 'Crew B',
        labourPlanned: { 'Mason': 6, 'Helper': 10, 'Steel Fixer': 5 },
        labourActual: { 'Mason': 6, 'Helper': 10, 'Steel Fixer': 5 },
        plantPlanned: ['Concrete Pump', 'Vibrator'],
        plantActual: ['Concrete Pump', 'Vibrator'],
        materialPlanned: ['RCC M30', 'Steel TMT 16mm'],
        materialActual: ['RCC M30', 'Steel TMT 16mm'],
        supervisorId: 'usr_sup_002',
        supervisorName: 'Amit Supervisor',
        status: 'completed',
        completionPct: 83,
        nonCompletionReason: 'Material shortage - steel delivery delayed'
      }
    ]
  },
  {
    id: 'plan_002',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-16',
    shift: 'morning',
    preparedBy: 'usr_eng_001',
    preparedByName: 'Suresh Engineer',
    status: 'published',
    publishedAt: '2026-01-15T18:00:00Z',
    lines: [
      {
        id: 'line_003',
        planId: 'plan_002',
        activityId: 'act_006',
        activityCode: 'A2010',
        activityName: 'RCC M30 in Columns (G+F)',
        workFrontId: 'wf_003',
        workFrontName: 'Column C1-C5 (Ground Floor)',
        plannedQty: 45,
        uomId: 'uom_cum',
        uomName: 'Cum',
        crew: 'Crew A',
        labourPlanned: { 'Mason': 8, 'Helper': 12, 'Steel Fixer': 6 },
        plantPlanned: ['Concrete Pump', 'Vibrator'],
        materialPlanned: ['RCC M30', 'Steel TMT 16mm'],
        supervisorId: 'usr_sup_001',
        supervisorName: 'Rajesh Supervisor',
        status: 'planned',
        completionPct: 0
      },
      {
        id: 'line_004',
        planId: 'plan_002',
        activityId: 'act_008',
        activityCode: 'A2030',
        activityName: 'Slab Casting (G+F)',
        workFrontId: 'wf_004',
        workFrontName: 'Slab Casting - Ground Floor',
        plannedQty: 120,
        uomId: 'uom_cum',
        uomName: 'Cum',
        crew: 'Crew C',
        labourPlanned: { 'Mason': 12, 'Helper': 18, 'Steel Fixer': 10 },
        plantPlanned: ['Concrete Pump', 'Vibrator', 'Tower Crane'],
        materialPlanned: ['RCC M30', 'Steel TMT 16mm', 'Shuttering'],
        supervisorId: 'usr_sup_003',
        supervisorName: 'Vikram Supervisor',
        status: 'blocked',
        completionPct: 0,
        nonCompletionReason: 'Work front blocked - waiting for reinforcement approval'
      }
    ]
  }
];

// Sample Constraints
export const constraints: Constraint[] = [
  {
    id: 'const_001',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_008',
    activityCode: 'A2030',
    type: 'approval',
    description: 'Reinforcement drawing approval pending from consultant for slab casting',
    raisedBy: 'usr_eng_001',
    raisedByName: 'Suresh Engineer',
    raisedOn: '2026-01-10T10:00:00Z',
    ownerId: 'usr_pm_001',
    ownerName: 'Rajesh Kumar',
    needBy: '2026-01-15',
    status: 'in_progress',
    impactDays: 5,
    photosDocIds: ['doc_photo_001']
  },
  {
    id: 'const_002',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_007',
    activityCode: 'A2020',
    type: 'material',
    description: 'Steel TMT 20mm not available in store - required for beam reinforcement',
    raisedBy: 'usr_sup_002',
    raisedByName: 'Amit Supervisor',
    raisedOn: '2026-01-14T08:00:00Z',
    ownerId: 'usr_store_001',
    ownerName: 'Store Keeper',
    needBy: '2026-01-16',
    status: 'open',
    impactDays: 2
  },
  {
    id: 'const_003',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    type: 'permit',
    description: 'Hot work permit required for welding of structural steel',
    raisedBy: 'usr_eng_001',
    raisedByName: 'Suresh Engineer',
    raisedOn: '2026-01-12T14:00:00Z',
    ownerId: 'usr_hse_001',
    ownerName: 'Safety Officer',
    needBy: '2026-01-17',
    resolvedOn: '2026-01-13T10:00:00Z',
    resolvedBy: 'usr_hse_001',
    status: 'resolved',
    impactDays: 0
  },
  {
    id: 'const_004',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    type: 'client',
    description: 'Client requested design change in lobby area - waiting for revised drawing',
    raisedBy: 'usr_pm_001',
    raisedByName: 'Rajesh Kumar',
    raisedOn: '2026-01-08T11:00:00Z',
    ownerId: 'usr_pm_001',
    ownerName: 'Rajesh Kumar',
    needBy: '2026-01-20',
    status: 'open',
    impactDays: 10,
    claimEventId: 'claim_001'
  }
];

// Sample Delays
export const delays: Delay[] = [
  {
    id: 'delay_001',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_007',
    activityCode: 'A2020',
    activityName: 'RCC M30 in Beams (G+F)',
    start: '2026-01-14',
    end: '2026-01-16',
    durationDays: 2,
    causeCategory: 'contractor',
    responsibleParty: 'contractor',
    description: 'Delay due to material shortage - steel delivery delayed by supplier',
    evidenceDocIds: ['doc_delay_001', 'doc_photo_002'],
    status: 'acknowledged',
    createdAt: '2026-01-14T16:00:00Z',
    createdBy: 'usr_eng_001',
    createdByName: 'Suresh Engineer'
  },
  {
    id: 'delay_002',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_008',
    activityCode: 'A2030',
    activityName: 'Slab Casting (G+F)',
    start: '2026-01-10',
    durationDays: 5,
    causeCategory: 'client',
    responsibleParty: 'client',
    description: 'Delay due to pending approval of reinforcement drawing from consultant',
    evidenceDocIds: ['doc_delay_002'],
    status: 'open',
    createdAt: '2026-01-10T10:00:00Z',
    createdBy: 'usr_pm_001',
    createdByName: 'Rajesh Kumar'
  },
  {
    id: 'delay_003',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_003',
    activityCode: 'A1020',
    activityName: 'Excavation for Foundation',
    start: '2025-07-25',
    end: '2025-07-28',
    durationDays: 3,
    causeCategory: 'weather',
    responsibleParty: 'neutral',
    description: 'Delay due to heavy rainfall - excavation work suspended',
    evidenceDocIds: ['doc_weather_001', 'doc_photo_003'],
    status: 'resolved',
    createdAt: '2025-07-25T18:00:00Z',
    createdBy: 'usr_eng_001',
    createdByName: 'Suresh Engineer'
  }
];

// Sample Site Instructions
export const siteInstructions: SiteInstruction[] = [
  {
    id: 'si_001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siNo: 'SI-2026-001',
    issuedBy: 'consultant',
    issuedByName: 'Structural Consultant',
    date: '2026-01-12',
    description: 'Increase column reinforcement from 16mm to 20mm dia for columns C1-C5 due to revised structural analysis',
    drawings: ['DWG-STR-005 Rev D'],
    costImpactFlag: true,
    timeImpactFlag: false,
    costImpactAmount: 250000,
    status: 'under_review',
    createdAt: '2026-01-12T14:00:00Z',
    createdBy: 'usr_doc_001',
    createdByName: 'Document Controller'
  },
  {
    id: 'si_002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siNo: 'SI-2026-002',
    issuedBy: 'client',
    issuedByName: 'Metro Developers',
    date: '2026-01-08',
    description: 'Change lobby flooring from vitrified tiles to Italian marble as per client requirement',
    drawings: ['DWG-ARCH-010 Rev B'],
    costImpactFlag: true,
    timeImpactFlag: true,
    costImpactAmount: 850000,
    timeImpactDays: 7,
    status: 'converted_to_variation',
    variationId: 'var_001',
    createdAt: '2026-01-08T10:00:00Z',
    createdBy: 'usr_doc_001',
    createdByName: 'Document Controller'
  },
  {
    id: 'si_003',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siNo: 'SI-2026-003',
    issuedBy: 'internal',
    issuedByName: 'Site Manager',
    date: '2026-01-15',
    description: 'Implement additional safety measures for working at height - mandatory harness for all workers above 2m',
    drawings: [],
    costImpactFlag: true,
    timeImpactFlag: false,
    costImpactAmount: 50000,
    status: 'accepted',
    createdAt: '2026-01-15T09:00:00Z',
    createdBy: 'usr_sm_001',
    createdByName: 'Rahul Mehta'
  }
];

// Sample Site Photos
export const sitePhotos: SitePhoto[] = [
  {
    id: 'photo_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_006',
    activityCode: 'A2010',
    workFrontId: 'wf_003',
    workFrontName: 'Column C1-C5 (Ground Floor)',
    photoUrl: '/photos/column_reinforcement_001.jpg',
    thumbnailUrl: '/photos/thumb/column_reinforcement_001.jpg',
    geoLocation: { lat: 19.0760, lng: 72.8777 },
    capturedAt: '2026-01-15T10:30:00Z',
    capturedBy: 'usr_eng_001',
    capturedByName: 'Suresh Engineer',
    tags: ['reinforcement', 'column', 'before_concreting'],
    description: 'Column reinforcement inspection before concreting'
  },
  {
    id: 'photo_002',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_006',
    activityCode: 'A2010',
    workFrontId: 'wf_003',
    workFrontName: 'Column C1-C5 (Ground Floor)',
    photoUrl: '/photos/column_concreting_001.jpg',
    thumbnailUrl: '/photos/thumb/column_concreting_001.jpg',
    geoLocation: { lat: 19.0760, lng: 72.8777 },
    capturedAt: '2026-01-15T14:00:00Z',
    capturedBy: 'usr_eng_001',
    capturedByName: 'Suresh Engineer',
    tags: ['concreting', 'column', 'in_progress'],
    description: 'Column concreting in progress'
  },
  {
    id: 'photo_003',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    activityId: 'act_003',
    activityCode: 'A1020',
    workFrontId: 'wf_001',
    workFrontName: 'Foundation - Footing F1',
    photoUrl: '/photos/foundation_excavation_001.jpg',
    thumbnailUrl: '/photos/thumb/foundation_excavation_001.jpg',
    geoLocation: { lat: 19.0760, lng: 72.8777 },
    capturedAt: '2025-07-20T11:00:00Z',
    capturedBy: 'usr_eng_001',
    capturedByName: 'Suresh Engineer',
    tags: ['excavation', 'foundation', 'progress'],
    description: 'Foundation excavation progress'
  },
  {
    id: 'photo_004',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    workFrontId: 'wf_004',
    workFrontName: 'Slab Casting - Ground Floor',
    photoUrl: '/photos/slab_formwork_001.jpg',
    thumbnailUrl: '/photos/thumb/slab_formwork_001.jpg',
    geoLocation: { lat: 19.0760, lng: 72.8777 },
    capturedAt: '2026-01-14T16:00:00Z',
    capturedBy: 'usr_sup_003',
    capturedByName: 'Vikram Supervisor',
    tags: ['formwork', 'slab', 'before_reinforcement'],
    description: 'Slab formwork completed - ready for reinforcement'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-SITE-01',
    stage: 'PLAN',
    control: 'Daily plan for tomorrow published by cut-off (e.g. 18:00) for every active work front',
    enforcement: 'WARN → escalate',
    status: 'observe'
  },
  {
    id: 'CP-SITE-02',
    stage: 'VERIFY',
    control: 'Constraints resolved (drawing, material, permit, access) before work front marked available',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-SITE-03',
    stage: 'MONITOR',
    control: 'Plan percent complete (PPC) below threshold; idle labour/plant on site (DR-07/10)',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-SITE-04',
    stage: 'RECORD',
    control: 'Delays and site instructions recorded same day with evidence',
    enforcement: 'WARN',
    status: 'observe'
  }
];

// Statistics
export const siteStats = {
  totalWorkFronts: workFronts.length,
  availableWorkFronts: workFronts.filter(wf => wf.status === 'available').length,
  activeWorkFronts: workFronts.filter(wf => wf.status === 'active').length,
  blockedWorkFronts: workFronts.filter(wf => wf.status === 'blocked').length,
  completedWorkFronts: workFronts.filter(wf => wf.status === 'completed').length,
  todayPlan: dailyPlans.find(p => p.date === '2026-01-16'),
  yesterdayPPC: dailyPlans.find(p => p.date === '2026-01-15')?.ppc || 0,
  openConstraints: constraints.filter(c => c.status === 'open' || c.status === 'in_progress').length,
  resolvedConstraints: constraints.filter(c => c.status === 'resolved' || c.status === 'closed').length,
  activeDelays: delays.filter(d => d.status === 'open' || d.status === 'acknowledged').length,
  totalDelayDays: delays.reduce((sum, d) => sum + d.durationDays, 0),
  pendingSiteInstructions: siteInstructions.filter(si => si.status === 'received' || si.status === 'under_review').length,
  totalPhotos: sitePhotos.length
};
