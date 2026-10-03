// Part 27 — Advanced Progress Management Data

export interface ProgressEntry {
  id: string;
  projectId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  boqItemId?: string;
  date: string;
  qtyDone: number;
  uomId: string;
  uomName: string;
  pctComplete: number;
  source: 'DPR' | 'MB' | 'manual';
  sourceId?: string;
  enteredBy: string;
  enteredByName: string;
  status: 'submitted' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ProgressPeriod {
  id: string;
  projectId: string;
  periodType: 'week' | 'month';
  start: string;
  end: string;
  status: 'open' | 'closed';
  closedBy?: string;
  closedAt?: string;
}

export interface ProgressSnapshot {
  id: string;
  projectId: string;
  periodId: string;
  periodName: string;
  wbsNodeId?: string;
  wbsNodeCode?: string;
  wbsNodeName?: string;
  plannedPct: number;
  actualPct: number;
  forecastPct: number;
  pv: number; // Planned Value
  ev: number; // Earned Value
  ac: number; // Actual Cost
  spi: number; // Schedule Performance Index
  cpi: number; // Cost Performance Index
  sv: number; // Schedule Variance
  cv: number; // Cost Variance;
}

export interface ProgressWeight {
  id: string;
  projectId: string;
  wbsNodeId?: string;
  activityId?: string;
  weightBasis: 'budget' | 'boq_value' | 'manual';
  weight: number;
}

export interface SCurveData {
  period: string;
  planned: number;
  actual: number | null;
  forecast: number;
}

export interface ProductivityData {
  activityId: string;
  activityCode: string;
  activityName: string;
  trade: string;
  outputQty: number;
  outputUom: string;
  inputManDays: number;
  inputMachineHours: number;
  actualProductivity: number;
  normProductivity: number;
  variancePct: number;
  status: 'above' | 'on_target' | 'below';
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Progress Entries
export const progressEntries: ProgressEntry[] = [
  {
    id: 'pe_001',
    projectId: 'prj_001',
    activityId: 'act_002',
    activityCode: 'A1010',
    activityName: 'Site Clearance & Preparation',
    date: '2025-06-18',
    qtyDone: 1,
    uomId: 'uom_ls',
    uomName: 'LS',
    pctComplete: 100,
    source: 'DPR',
    sourceId: 'dpr_001',
    enteredBy: 'usr_eng_001',
    enteredByName: 'Suresh Engineer',
    status: 'verified',
    verifiedBy: 'usr_pm_001',
    verifiedAt: '2025-06-19T10:00:00Z'
  },
  {
    id: 'pe_002',
    projectId: 'prj_001',
    activityId: 'act_003',
    activityCode: 'A1020',
    activityName: 'Excavation for Foundation',
    date: '2025-07-28',
    qtyDone: 2500,
    uomId: 'uom_cum',
    uomName: 'Cum',
    pctComplete: 100,
    source: 'DPR',
    sourceId: 'dpr_045',
    enteredBy: 'usr_eng_001',
    enteredByName: 'Suresh Engineer',
    status: 'verified',
    verifiedBy: 'usr_pm_001',
    verifiedAt: '2025-07-29T10:00:00Z'
  },
  {
    id: 'pe_003',
    projectId: 'prj_001',
    activityId: 'act_004',
    activityCode: 'A1030',
    activityName: 'PCC M15 in Foundation',
    date: '2025-08-10',
    qtyDone: 800,
    uomId: 'uom_cum',
    uomName: 'Cum',
    pctComplete: 100,
    source: 'MB',
    sourceId: 'mb_001',
    enteredBy: 'usr_qs_001',
    enteredByName: 'Vikram QS',
    status: 'verified',
    verifiedBy: 'usr_pm_001',
    verifiedAt: '2025-08-11T10:00:00Z'
  },
  {
    id: 'pe_004',
    projectId: 'prj_001',
    activityId: 'act_005',
    activityCode: 'A1040',
    activityName: 'RCC M25 in Foundation Footing',
    date: '2025-09-08',
    qtyDone: 1200,
    uomId: 'uom_cum',
    uomName: 'Cum',
    pctComplete: 100,
    source: 'MB',
    sourceId: 'mb_002',
    enteredBy: 'usr_qs_001',
    enteredByName: 'Vikram QS',
    status: 'verified',
    verifiedBy: 'usr_pm_001',
    verifiedAt: '2025-09-09T10:00:00Z'
  },
  {
    id: 'pe_005',
    projectId: 'prj_001',
    activityId: 'act_006',
    activityCode: 'A2010',
    activityName: 'RCC M30 in Columns (G+F)',
    date: '2026-01-15',
    qtyDone: 1200,
    uomId: 'uom_cum',
    uomName: 'Cum',
    pctComplete: 67,
    source: 'DPR',
    sourceId: 'dpr_225',
    enteredBy: 'usr_eng_001',
    enteredByName: 'Suresh Engineer',
    status: 'submitted'
  },
  {
    id: 'pe_006',
    projectId: 'prj_001',
    activityId: 'act_007',
    activityCode: 'A2020',
    activityName: 'RCC M30 in Beams (G+F)',
    date: '2026-01-15',
    qtyDone: 1200,
    uomId: 'uom_cum',
    uomName: 'Cum',
    pctComplete: 67,
    source: 'DPR',
    sourceId: 'dpr_225',
    enteredBy: 'usr_eng_001',
    enteredByName: 'Suresh Engineer',
    status: 'submitted'
  }
];

// Sample Progress Periods
export const progressPeriods: ProgressPeriod[] = [
  {
    id: 'pp_001',
    projectId: 'prj_001',
    periodType: 'month',
    start: '2025-06-01',
    end: '2025-06-30',
    status: 'closed',
    closedBy: 'usr_planning_001',
    closedAt: '2025-07-02T10:00:00Z'
  },
  {
    id: 'pp_002',
    projectId: 'prj_001',
    periodType: 'month',
    start: '2025-07-01',
    end: '2025-07-31',
    status: 'closed',
    closedBy: 'usr_planning_001',
    closedAt: '2025-08-02T10:00:00Z'
  },
  {
    id: 'pp_003',
    projectId: 'prj_001',
    periodType: 'month',
    start: '2025-08-01',
    end: '2025-08-31',
    status: 'closed',
    closedBy: 'usr_planning_001',
    closedAt: '2025-09-02T10:00:00Z'
  },
  {
    id: 'pp_004',
    projectId: 'prj_001',
    periodType: 'month',
    start: '2025-09-01',
    end: '2025-09-30',
    status: 'closed',
    closedBy: 'usr_planning_001',
    closedAt: '2025-10-02T10:00:00Z'
  },
  {
    id: 'pp_005',
    projectId: 'prj_001',
    periodType: 'month',
    start: '2026-01-01',
    end: '2026-01-31',
    status: 'open'
  }
];

// Sample Progress Snapshots (EVM Data)
export const progressSnapshots: ProgressSnapshot[] = [
  {
    id: 'ps_001',
    projectId: 'prj_001',
    periodId: 'pp_001',
    periodName: 'Jun 2025',
    plannedPct: 5,
    actualPct: 5,
    forecastPct: 5,
    pv: 6250000,
    ev: 6250000,
    ac: 6100000,
    spi: 1.00,
    cpi: 1.02,
    sv: 0,
    cv: 150000
  },
  {
    id: 'ps_002',
    projectId: 'prj_001',
    periodId: 'pp_002',
    periodName: 'Jul 2025',
    plannedPct: 12,
    actualPct: 11,
    forecastPct: 12,
    pv: 15000000,
    ev: 13750000,
    ac: 14200000,
    spi: 0.92,
    cpi: 0.97,
    sv: -1250000,
    cv: -450000
  },
  {
    id: 'ps_003',
    projectId: 'prj_001',
    periodId: 'pp_003',
    periodName: 'Aug 2025',
    plannedPct: 20,
    actualPct: 19,
    forecastPct: 20,
    pv: 25000000,
    ev: 23750000,
    ac: 24500000,
    spi: 0.95,
    cpi: 0.97,
    sv: -1250000,
    cv: -750000
  },
  {
    id: 'ps_004',
    projectId: 'prj_001',
    periodId: 'pp_004',
    periodName: 'Sep 2025',
    plannedPct: 28,
    actualPct: 27,
    forecastPct: 28,
    pv: 35000000,
    ev: 33750000,
    ac: 35200000,
    spi: 0.96,
    cpi: 0.96,
    sv: -1250000,
    cv: -1450000
  },
  {
    id: 'ps_005',
    projectId: 'prj_001',
    periodId: 'pp_005',
    periodName: 'Jan 2026',
    plannedPct: 65,
    actualPct: 62,
    forecastPct: 67,
    pv: 81250000,
    ev: 77500000,
    ac: 78500000,
    spi: 0.95,
    cpi: 0.99,
    sv: -3750000,
    cv: -1000000
  }
];

// Sample Progress Weights
export const progressWeights: ProgressWeight[] = [
  {
    id: 'pw_001',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_003',
    weightBasis: 'budget',
    weight: 20
  },
  {
    id: 'pw_002',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_004',
    weightBasis: 'budget',
    weight: 36
  },
  {
    id: 'pw_003',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_005',
    weightBasis: 'budget',
    weight: 12
  },
  {
    id: 'pw_004',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_006',
    weightBasis: 'budget',
    weight: 22
  },
  {
    id: 'pw_005',
    projectId: 'prj_001',
    wbsNodeId: 'wbs_007',
    weightBasis: 'budget',
    weight: 10
  }
];

// Sample S-Curve Data
export const sCurveData: SCurveData[] = [
  { period: 'Jun 2025', planned: 5, actual: 5, forecast: 5 },
  { period: 'Jul 2025', planned: 12, actual: 11, forecast: 12 },
  { period: 'Aug 2025', planned: 20, actual: 19, forecast: 20 },
  { period: 'Sep 2025', planned: 28, actual: 27, forecast: 28 },
  { period: 'Oct 2025', planned: 36, actual: 34, forecast: 36 },
  { period: 'Nov 2025', planned: 44, actual: 42, forecast: 44 },
  { period: 'Dec 2025', planned: 52, actual: 50, forecast: 52 },
  { period: 'Jan 2026', planned: 60, actual: 57, forecast: 62 },
  { period: 'Feb 2026', planned: 68, actual: null, forecast: 70 },
  { period: 'Mar 2026', planned: 76, actual: null, forecast: 78 },
  { period: 'Apr 2026', planned: 84, actual: null, forecast: 85 },
  { period: 'May 2026', planned: 92, actual: null, forecast: 92 },
  { period: 'Jun 2026', planned: 100, actual: null, forecast: 100 }
];

// Sample Productivity Data
export const productivityData: ProductivityData[] = [
  {
    activityId: 'act_003',
    activityCode: 'A1020',
    activityName: 'Excavation for Foundation',
    trade: 'Earthwork',
    outputQty: 2500,
    outputUom: 'Cum',
    inputManDays: 125,
    inputMachineHours: 200,
    actualProductivity: 20,
    normProductivity: 22,
    variancePct: -9.1,
    status: 'below'
  },
  {
    activityId: 'act_004',
    activityCode: 'A1030',
    activityName: 'PCC M15 in Foundation',
    trade: 'Concrete',
    outputQty: 800,
    outputUom: 'Cum',
    inputManDays: 160,
    inputMachineHours: 80,
    actualProductivity: 5,
    normProductivity: 4.5,
    variancePct: 11.1,
    status: 'above'
  },
  {
    activityId: 'act_005',
    activityCode: 'A1040',
    activityName: 'RCC M25 in Foundation Footing',
    trade: 'Concrete',
    outputQty: 1200,
    outputUom: 'Cum',
    inputManDays: 300,
    inputMachineHours: 150,
    actualProductivity: 4,
    normProductivity: 4,
    variancePct: 0,
    status: 'on_target'
  },
  {
    activityId: 'act_006',
    activityCode: 'A2010',
    activityName: 'RCC M30 in Columns (G+F)',
    trade: 'Concrete',
    outputQty: 1200,
    outputUom: 'Cum',
    inputManDays: 360,
    inputMachineHours: 180,
    actualProductivity: 3.33,
    normProductivity: 3.5,
    variancePct: -4.9,
    status: 'below'
  },
  {
    activityId: 'act_007',
    activityCode: 'A2020',
    activityName: 'RCC M30 in Beams (G+F)',
    trade: 'Concrete',
    outputQty: 1200,
    outputUom: 'Cum',
    inputManDays: 340,
    inputMachineHours: 170,
    actualProductivity: 3.53,
    normProductivity: 3.5,
    variancePct: 0.9,
    status: 'on_target'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-PROG-01',
    stage: 'RECORD',
    control: 'Progress sourced from approved DPR/MB; manual progress requires evidence',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-PROG-02',
    stage: 'MONITOR',
    control: 'SPI/CPI below thresholds; productivity below norm (DR-08)',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-PROG-03',
    stage: 'RECONCILE',
    control: 'Period close requires DPR completeness for the period',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const progressStats = {
  totalEntries: progressEntries.length,
  verifiedEntries: progressEntries.filter(e => e.status === 'verified').length,
  pendingVerification: progressEntries.filter(e => e.status === 'submitted').length,
  openPeriods: progressPeriods.filter(p => p.status === 'open').length,
  closedPeriods: progressPeriods.filter(p => p.status === 'closed').length,
  currentSPI: progressSnapshots[progressSnapshots.length - 1].spi,
  currentCPI: progressSnapshots[progressSnapshots.length - 1].cpi,
  currentSV: progressSnapshots[progressSnapshots.length - 1].sv,
  currentCV: progressSnapshots[progressSnapshots.length - 1].cv,
  projectPlannedPct: progressSnapshots[progressSnapshots.length - 1].plannedPct,
  projectActualPct: progressSnapshots[progressSnapshots.length - 1].actualPct,
  projectForecastPct: progressSnapshots[progressSnapshots.length - 1].forecastPct,
  bac: 125000000, // Budget at Completion
  eac: 126250000, // Estimate at Completion
  etc: 47750000, // Estimate to Complete
  vac: -1250000 // Variance at Completion
};

// EVM Summary
export const evmSummary = {
  bac: progressStats.bac,
  pv: progressSnapshots[progressSnapshots.length - 1].pv,
  ev: progressSnapshots[progressSnapshots.length - 1].ev,
  ac: progressSnapshots[progressSnapshots.length - 1].ac,
  sv: progressStats.currentSV,
  cv: progressStats.currentCV,
  spi: progressStats.currentSPI,
  cpi: progressStats.currentCPI,
  eac: progressStats.eac,
  etc: progressStats.etc,
  vac: progressStats.vac,
  tcpi: progressStats.eac / progressStats.bac // To-Complete Performance Index
};
