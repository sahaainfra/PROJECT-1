// Part 26 — Advanced Project Planning & Scheduling Data

export interface Schedule {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  type: 'baseline' | 'current' | 'what_if';
  versionNo: string;
  dataDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'superseded';
  approvedBy?: string;
  approvedAt?: string;
  totalActivities: number;
  criticalActivities: number;
  projectStart: string;
  projectFinish: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface Activity {
  id: string;
  scheduleId: string;
  activityId: string;
  code: string;
  name: string;
  wbsNodeId: string;
  wbsNodeCode: string;
  type: 'task' | 'milestone' | 'LOE' | 'hammock';
  originalDuration: number;
  remainingDuration: number;
  calendarId: string;
  earlyStart: string;
  earlyFinish: string;
  lateStart: string;
  lateFinish: string;
  actualStart?: string;
  actualFinish?: string;
  totalFloat: number;
  freeFloat: number;
  isCritical: boolean;
  constraintType?: 'start_no_earlier' | 'finish_no_later' | 'mandatory';
  constraintDate?: string;
  percentComplete: number;
  physicalPctSource?: 'dpr' | 'manual' | 'measurement';
}

export interface Dependency {
  id: string;
  scheduleId: string;
  predecessorId: string;
  predecessorCode: string;
  successorId: string;
  successorCode: string;
  type: 'FS' | 'SS' | 'FF' | 'SF';
  lagDays: number;
}

export interface Calendar {
  id: string;
  name: string;
  scope: 'company' | 'project';
  workWeek: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  holidays: string[];
  seasonalNonWorking?: string[];
}

export interface ResourceAssignment {
  id: string;
  activityId: string;
  activityCode: string;
  resourceType: 'labour_trade' | 'plant_type' | 'material';
  resourceId: string;
  resourceName: string;
  qty: number;
  uomId: string;
  uomName: string;
  distribution: 'uniform' | 'front' | 'back';
}

export interface BaselineSnapshot {
  id: string;
  scheduleId: string;
  capturedAt: string;
  capturedBy: string;
  activityCount: number;
  projectStart: string;
  projectFinish: string;
  criticalPathLength: number;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Schedules
export const schedules: Schedule[] = [
  {
    id: 'sch_001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    name: 'Baseline Schedule v1.0',
    type: 'baseline',
    versionNo: '1.0',
    dataDate: '2025-06-01',
    status: 'approved',
    approvedBy: 'usr_pm_001',
    approvedAt: '2025-05-28T10:00:00Z',
    totalActivities: 245,
    criticalActivities: 42,
    projectStart: '2025-06-01',
    projectFinish: '2026-12-30',
    createdAt: '2025-05-15T00:00:00Z',
    createdBy: 'usr_planning_001',
    createdByName: 'Planning Engineer'
  },
  {
    id: 'sch_002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    name: 'Current Schedule',
    type: 'current',
    versionNo: '1.5',
    dataDate: '2026-01-15',
    status: 'approved',
    totalActivities: 245,
    criticalActivities: 48,
    projectStart: '2025-06-01',
    projectFinish: '2027-02-15',
    createdAt: '2026-01-15T00:00:00Z',
    createdBy: 'usr_planning_001',
    createdByName: 'Planning Engineer'
  },
  {
    id: 'sch_003',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    name: 'Recovery Schedule - What-If',
    type: 'what_if',
    versionNo: '2.0',
    dataDate: '2026-01-15',
    status: 'draft',
    totalActivities: 245,
    criticalActivities: 38,
    projectStart: '2025-06-01',
    projectFinish: '2027-01-15',
    createdAt: '2026-01-16T00:00:00Z',
    createdBy: 'usr_planning_001',
    createdByName: 'Planning Engineer'
  }
];

// Sample Activities (CPM calculated)
export const activities: Activity[] = [
  {
    id: 'act_001',
    scheduleId: 'sch_002',
    activityId: 'A1000',
    code: 'A1000',
    name: 'Project Start',
    wbsNodeId: 'wbs_001',
    wbsNodeCode: '1.0',
    type: 'milestone',
    originalDuration: 0,
    remainingDuration: 0,
    calendarId: 'cal_001',
    earlyStart: '2025-06-01',
    earlyFinish: '2025-06-01',
    lateStart: '2025-06-01',
    lateFinish: '2025-06-01',
    actualStart: '2025-06-01',
    actualFinish: '2025-06-01',
    totalFloat: 0,
    freeFloat: 0,
    isCritical: true,
    percentComplete: 100
  },
  {
    id: 'act_002',
    scheduleId: 'sch_002',
    activityId: 'A1010',
    code: 'A1010',
    name: 'Site Clearance & Preparation',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    type: 'task',
    originalDuration: 15,
    remainingDuration: 0,
    calendarId: 'cal_001',
    earlyStart: '2025-06-02',
    earlyFinish: '2025-06-20',
    lateStart: '2025-06-02',
    lateFinish: '2025-06-20',
    actualStart: '2025-06-02',
    actualFinish: '2025-06-18',
    totalFloat: 0,
    freeFloat: 0,
    isCritical: true,
    percentComplete: 100
  },
  {
    id: 'act_003',
    scheduleId: 'sch_002',
    activityId: 'A1020',
    code: 'A1020',
    name: 'Excavation for Foundation',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    type: 'task',
    originalDuration: 25,
    remainingDuration: 0,
    calendarId: 'cal_001',
    earlyStart: '2025-06-21',
    earlyFinish: '2025-07-25',
    lateStart: '2025-06-21',
    lateFinish: '2025-07-25',
    actualStart: '2025-06-21',
    actualFinish: '2025-07-28',
    totalFloat: 0,
    freeFloat: 0,
    isCritical: true,
    percentComplete: 100
  },
  {
    id: 'act_004',
    scheduleId: 'sch_002',
    activityId: 'A1030',
    code: 'A1030',
    name: 'PCC M15 in Foundation',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    type: 'task',
    originalDuration: 10,
    remainingDuration: 0,
    calendarId: 'cal_001',
    earlyStart: '2025-07-26',
    earlyFinish: '2025-08-08',
    lateStart: '2025-07-29',
    lateFinish: '2025-08-11',
    actualStart: '2025-07-29',
    actualFinish: '2025-08-10',
    totalFloat: 3,
    freeFloat: 0,
    isCritical: false,
    percentComplete: 100
  },
  {
    id: 'act_005',
    scheduleId: 'sch_002',
    activityId: 'A1040',
    code: 'A1040',
    name: 'RCC M25 in Foundation Footing',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    type: 'task',
    originalDuration: 20,
    remainingDuration: 0,
    calendarId: 'cal_001',
    earlyStart: '2025-08-09',
    earlyFinish: '2025-09-05',
    lateStart: '2025-08-12',
    lateFinish: '2025-09-08',
    actualStart: '2025-08-11',
    actualFinish: '2025-09-08',
    totalFloat: 3,
    freeFloat: 0,
    isCritical: false,
    percentComplete: 100
  },
  {
    id: 'act_006',
    scheduleId: 'sch_002',
    activityId: 'A2010',
    code: 'A2010',
    name: 'RCC M30 in Columns (G+F)',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    type: 'task',
    originalDuration: 45,
    remainingDuration: 15,
    calendarId: 'cal_001',
    earlyStart: '2025-09-06',
    earlyFinish: '2025-11-18',
    lateStart: '2025-09-09',
    lateFinish: '2025-11-21',
    actualStart: '2025-09-09',
    totalFloat: 3,
    freeFloat: 0,
    isCritical: false,
    percentComplete: 67
  },
  {
    id: 'act_007',
    scheduleId: 'sch_002',
    activityId: 'A2020',
    code: 'A2020',
    name: 'RCC M30 in Beams (G+F)',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    type: 'task',
    originalDuration: 30,
    remainingDuration: 10,
    calendarId: 'cal_001',
    earlyStart: '2025-11-19',
    earlyFinish: '2025-12-29',
    lateStart: '2025-11-22',
    lateFinish: '2026-01-01',
    actualStart: '2025-11-22',
    totalFloat: 3,
    freeFloat: 0,
    isCritical: false,
    percentComplete: 67
  },
  {
    id: 'act_008',
    scheduleId: 'sch_002',
    activityId: 'A2030',
    code: 'A2030',
    name: 'Slab Casting (G+F)',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    type: 'task',
    originalDuration: 20,
    remainingDuration: 20,
    calendarId: 'cal_001',
    earlyStart: '2025-12-30',
    earlyFinish: '2026-01-26',
    lateStart: '2026-01-02',
    lateFinish: '2026-01-29',
    totalFloat: 3,
    freeFloat: 0,
    isCritical: false,
    percentComplete: 0
  },
  {
    id: 'act_009',
    scheduleId: 'sch_002',
    activityId: 'A3010',
    code: 'A3010',
    name: 'Masonry Work (G+F)',
    wbsNodeId: 'wbs_005',
    wbsNodeCode: '1.1.3',
    type: 'task',
    originalDuration: 35,
    remainingDuration: 35,
    calendarId: 'cal_001',
    earlyStart: '2026-01-27',
    earlyFinish: '2026-03-18',
    lateStart: '2026-01-30',
    lateFinish: '2026-03-21',
    totalFloat: 3,
    freeFloat: 0,
    isCritical: false,
    percentComplete: 0
  },
  {
    id: 'act_010',
    scheduleId: 'sch_002',
    activityId: 'M9999',
    code: 'M9999',
    name: 'Project Completion',
    wbsNodeId: 'wbs_001',
    wbsNodeCode: '1.0',
    type: 'milestone',
    originalDuration: 0,
    remainingDuration: 0,
    calendarId: 'cal_001',
    earlyStart: '2027-02-15',
    earlyFinish: '2027-02-15',
    lateStart: '2027-02-15',
    lateFinish: '2027-02-15',
    totalFloat: 0,
    freeFloat: 0,
    isCritical: true,
    percentComplete: 0
  }
];

// Sample Dependencies
export const dependencies: Dependency[] = [
  { id: 'dep_001', scheduleId: 'sch_002', predecessorId: 'act_001', predecessorCode: 'A1000', successorId: 'act_002', successorCode: 'A1010', type: 'FS', lagDays: 0 },
  { id: 'dep_002', scheduleId: 'sch_002', predecessorId: 'act_002', predecessorCode: 'A1010', successorId: 'act_003', successorCode: 'A1020', type: 'FS', lagDays: 0 },
  { id: 'dep_003', scheduleId: 'sch_002', predecessorId: 'act_003', predecessorCode: 'A1020', successorId: 'act_004', successorCode: 'A1030', type: 'FS', lagDays: 0 },
  { id: 'dep_004', scheduleId: 'sch_002', predecessorId: 'act_004', predecessorCode: 'A1030', successorId: 'act_005', successorCode: 'A1040', type: 'FS', lagDays: 0 },
  { id: 'dep_005', scheduleId: 'sch_002', predecessorId: 'act_005', predecessorCode: 'A1040', successorId: 'act_006', successorCode: 'A2010', type: 'FS', lagDays: 0 },
  { id: 'dep_006', scheduleId: 'sch_002', predecessorId: 'act_006', predecessorCode: 'A2010', successorId: 'act_007', successorCode: 'A2020', type: 'FS', lagDays: 0 },
  { id: 'dep_007', scheduleId: 'sch_002', predecessorId: 'act_007', predecessorCode: 'A2020', successorId: 'act_008', successorCode: 'A2030', type: 'FS', lagDays: 0 },
  { id: 'dep_008', scheduleId: 'sch_002', predecessorId: 'act_008', predecessorCode: 'A2030', successorId: 'act_009', successorCode: 'A3010', type: 'FS', lagDays: 0 },
  { id: 'dep_009', scheduleId: 'sch_002', predecessorId: 'act_009', predecessorCode: 'A3010', successorId: 'act_010', successorCode: 'M9999', type: 'FS', lagDays: 0 }
];

// Sample Calendars
export const calendars: Calendar[] = [
  {
    id: 'cal_001',
    name: 'Standard 6-Day Week',
    scope: 'company',
    workWeek: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    holidays: ['2026-01-26', '2026-03-10', '2026-04-14', '2026-05-01', '2026-08-15', '2026-10-02', '2026-11-04', '2026-12-25'],
    seasonalNonWorking: ['2026-06-01', '2026-06-15', '2026-07-01', '2026-07-15', '2026-08-01', '2026-08-15', '2026-09-01']
  },
  {
    id: 'cal_002',
    name: '5-Day Week (Office)',
    scope: 'company',
    workWeek: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    holidays: ['2026-01-26', '2026-03-10', '2026-04-14', '2026-05-01', '2026-08-15', '2026-10-02', '2026-11-04', '2026-12-25']
  }
];

// Sample Resource Assignments
export const resourceAssignments: ResourceAssignment[] = [
  {
    id: 'ra_001',
    activityId: 'act_003',
    activityCode: 'A1020',
    resourceType: 'plant_type',
    resourceId: 'plt_002',
    resourceName: 'Excavator (0.5 cum)',
    qty: 2,
    uomId: 'uom_nos',
    uomName: 'Nos',
    distribution: 'uniform'
  },
  {
    id: 'ra_002',
    activityId: 'act_003',
    activityCode: 'A1020',
    resourceType: 'labour_trade',
    resourceId: 'lab_001',
    resourceName: 'Mazdoor',
    qty: 20,
    uomId: 'uom_nos',
    uomName: 'Nos',
    distribution: 'uniform'
  },
  {
    id: 'ra_003',
    activityId: 'act_005',
    activityCode: 'A1040',
    resourceType: 'labour_trade',
    resourceId: 'lab_002',
    resourceName: 'Mason',
    qty: 15,
    uomId: 'uom_nos',
    uomName: 'Nos',
    distribution: 'uniform'
  },
  {
    id: 'ra_004',
    activityId: 'act_005',
    activityCode: 'A1040',
    resourceType: 'material',
    resourceId: 'mat_005',
    resourceName: 'RCC M25',
    qty: 180,
    uomId: 'uom_cum',
    uomName: 'Cum',
    distribution: 'front'
  },
  {
    id: 'ra_005',
    activityId: 'act_006',
    activityCode: 'A2010',
    resourceType: 'labour_trade',
    resourceId: 'lab_003',
    resourceName: 'Steel Fixer',
    qty: 25,
    uomId: 'uom_nos',
    uomName: 'Nos',
    distribution: 'uniform'
  },
  {
    id: 'ra_006',
    activityId: 'act_006',
    activityCode: 'A2010',
    resourceType: 'plant_type',
    resourceId: 'plt_003',
    resourceName: 'Tower Crane',
    qty: 1,
    uomId: 'uom_nos',
    uomName: 'Nos',
    distribution: 'uniform'
  }
];

// Sample Baseline Snapshots
export const baselineSnapshots: BaselineSnapshot[] = [
  {
    id: 'snap_001',
    scheduleId: 'sch_001',
    capturedAt: '2025-05-28T10:00:00Z',
    capturedBy: 'usr_pm_001',
    activityCount: 245,
    projectStart: '2025-06-01',
    projectFinish: '2026-12-30',
    criticalPathLength: 578
  },
  {
    id: 'snap_002',
    scheduleId: 'sch_001',
    capturedAt: '2025-09-01T10:00:00Z',
    capturedBy: 'usr_pm_001',
    activityCount: 245,
    projectStart: '2025-06-01',
    projectFinish: '2026-12-30',
    criticalPathLength: 578
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-PLAN-01',
    stage: 'PLAN',
    control: 'Baseline approved before mobilisation; activities have duration, resources and responsible',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-PLAN-02',
    stage: 'VERIFY',
    control: 'Logic checks (no open ends/loops); critical path reviewed',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-PLAN-03',
    stage: 'MONITOR',
    control: 'Slip beyond threshold, float erosion on critical path',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-PLAN-04',
    stage: 'APPROVE',
    control: 'Re-baseline only with approved EOT/scope change',
    enforcement: 'EXCEPTION',
    status: 'observe'
  }
];

// Statistics
export const planningStats = {
  totalSchedules: schedules.length,
  baselineSchedules: schedules.filter(s => s.type === 'baseline').length,
  currentSchedules: schedules.filter(s => s.type === 'current').length,
  whatIfSchedules: schedules.filter(s => s.type === 'what_if').length,
  totalActivities: activities.length,
  criticalActivities: activities.filter(a => a.isCritical).length,
  completedActivities: activities.filter(a => a.percentComplete === 100).length,
  inProgressActivities: activities.filter(a => a.percentComplete > 0 && a.percentComplete < 100).length,
  notStartedActivities: activities.filter(a => a.percentComplete === 0).length,
  totalDependencies: dependencies.length,
  totalCalendars: calendars.length,
  totalResourceAssignments: resourceAssignments.length,
  baselineSlippage: 47 // days
};

// Gantt Chart Data (simplified for visualization)
export const ganttData = activities.map(act => {
  const startDate = new Date(act.earlyStart);
  const endDate = new Date(act.earlyFinish);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    id: act.id,
    code: act.code,
    name: act.name,
    startDate: act.earlyStart,
    endDate: act.earlyFinish,
    duration,
    percentComplete: act.percentComplete,
    isCritical: act.isCritical,
    isMilestone: act.type === 'milestone',
    actualStart: act.actualStart,
    actualFinish: act.actualFinish,
    float: act.totalFloat
  };
});

// Critical Path Analysis
export const criticalPathAnalysis = {
  totalFloat: 0,
  criticalPathLength: 625, // days
  criticalActivities: activities.filter(a => a.isCritical).length,
  nearCriticalActivities: activities.filter(a => a.totalFloat > 0 && a.totalFloat <= 5).length,
  projectStart: '2025-06-01',
  projectFinish: '2027-02-15',
  baselineFinish: '2026-12-30',
  slippage: 47 // days
};

// Resource Histogram Data
export const resourceHistogram = [
  { period: '2026-01', labour: 120, plant: 15, material: 450 },
  { period: '2026-02', labour: 145, plant: 18, material: 520 },
  { period: '2026-03', labour: 160, plant: 20, material: 580 },
  { period: '2026-04', labour: 175, plant: 22, material: 640 },
  { period: '2026-05', labour: 180, plant: 22, material: 660 },
  { period: '2026-06', labour: 170, plant: 20, material: 620 }
];

// Look-Ahead Schedule (3-week)
export const lookAheadActivities = activities.filter(a => {
  const startDate = new Date(a.earlyStart);
  const dataDate = new Date('2026-01-15');
  const threeWeeks = 21 * 24 * 60 * 60 * 1000;
  return startDate >= dataDate && startDate <= new Date(dataDate.getTime() + threeWeeks);
});
