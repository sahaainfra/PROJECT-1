// Part 33 — Planned vs Budgeted vs Actual Engine (Project Control Engine) Data
// One common project-control engine: for every project/WBS/activity/resource and period it computes
// Planned → Budgeted → Committed → Actual → Earned → Forecast for quantity, cost, labour hours,
// material, plant hours, time, procurement and billing. Read-model only — never writes to source modules.
// Sources: Part 26 (planned), Part 25 (budgeted/committed), Part 30 + postings (actual), Part 27 (earned),
// Parts 25/71 (forecast), Part 46 (billing). Sample data for the frontend baseline app.

export type PceMeasureGroup =
  | 'quantity'
  | 'cost'
  | 'labour_hours'
  | 'plant_hours'
  | 'material_qty'
  | 'time'
  | 'procurement'
  | 'billing';

export interface PceFact {
  id: string;
  projectId: string;
  projectName: string;
  siteId: string;
  wbsNodeId: string;
  wbsName: string;
  activityId: string;
  boqItemId: string;
  costCodeId: string;
  resourceType: 'labour' | 'material' | 'plant' | 'subcontract' | 'overhead';
  period: string; // month key by project calendar
  measureGroup: PceMeasureGroup;
  planned: number;
  budgeted: number;
  committed: number;
  actual: number;
  earned: number;
  forecast: number;
  uomId?: string;
  currency: string;
  refreshedAt: string;
  sourceVersion: string;
  sources: string[]; // drill links: KPI → document → transaction → source evidence
}

export interface PceVariance {
  id: string;
  projectId: string;
  wbsNodeId: string;
  wbsName: string;
  type: 'quantity' | 'cost' | 'schedule' | 'productivity' | 'commitment_coverage' | 'billing_lag';
  value: number; // absolute value in measure unit (or % for coverage)
  unit: string; // currency | unit | % | days
  status: 'favourable' | 'adverse' | 'neutral';
  threshold: number;
  alert: boolean;
  sources: string[];
}

export interface PceReconciliation {
  id: string;
  projectId: string;
  scope: 'budget' | 'gl_project_cost' | 'billing';
  engineTotal: number;
  moduleTotal: number;
  moduleRef: string; // Part 25 / GL / Part 46
  difference: number;
  tolerance: number;
  status: 'match' | 'difference';
  checkedAt: string;
}

export interface PceRefreshLog {
  id: string;
  runId: string;
  scope: string;
  type: 'incremental' | 'full' | 'on_demand';
  startedAt: string;
  finishedAt?: string;
  rows: number;
  status: 'completed' | 'running' | 'failed';
  error?: string;
  trigger: string; // event / schedule / manual
}

export interface PceMeasureDefinition {
  id: string;
  measureGroup: PceMeasureGroup;
  column: string;
  definition: string;
  source: string;
  formula: string;
  dataLabel: string; // SA-18 label
}

export interface PceControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
  evidence: string;
  escalation: string;
}

export const pceControlPoints: PceControlPoint[] = [
  { id: 'CP-PCE-01', stage: 'MONITOR', control: 'Planned vs budgeted vs committed vs actual vs earned vs forecast computed for PC-14 dimensions; refresh failure is a violation', enforcement: 'MONITOR', status: 'observe', evidence: 'refresh log', escalation: 'L2' },
  { id: 'CP-PCE-02', stage: 'RECONCILE', control: 'Engine totals reconcile to module and GL totals', enforcement: 'BLOCK (period close)', status: 'observe', evidence: 'reconciliation', escalation: 'L2 Cost Controller' }
];

// Facts — cost group (period 2025-11, Riverside Tower by project calendar)
export const pceFacts: PceFact[] = [
  {
    id: 'pcef_001', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.2', wbsName: 'Foundations', activityId: 'ACT-CON-006', boqItemId: 'BOQ-02.1',
    costCodeId: 'cc_lab_civil', resourceType: 'labour', period: '2025-11', measureGroup: 'cost',
    planned: 420000, budgeted: 450000, committed: 440000, actual: 415000, earned: 430000, forecast: 470000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['DPR-2025-1121', 'attendance Nov-25', 'GL-PRJ1-4210']
  },
  {
    id: 'pcef_002', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.2', wbsName: 'Foundations', activityId: 'ACT-CON-006', boqItemId: 'BOQ-02.1',
    costCodeId: 'cc_mat_civil', resourceType: 'material', period: '2025-11', measureGroup: 'cost',
    planned: 880000, budgeted: 900000, committed: 910000, actual: 862000, earned: 880000, forecast: 945000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['GRN-2025-0834', 'MRN-2025-0412', 'PO-2025-0204']
  },
  {
    id: 'pcef_003', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.2',
    costCodeId: 'cc_mat_steel', resourceType: 'material', period: '2025-11', measureGroup: 'cost',
    planned: 1250000, budgeted: 1300000, committed: 1290000, actual: 1180000, earned: 1240000, forecast: 1360000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['GRN-2025-0812', 'PO-2025-0194', 'MB-2025-0031']
  },
  {
    id: 'pcef_004', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.1',
    costCodeId: 'cc_mat_civil', resourceType: 'material', period: '2025-11', measureGroup: 'cost',
    planned: 760000, budgeted: 780000, committed: 772000, actual: 748000, earned: 755000, forecast: 815000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['GRN-2025-0840', 'MRN-2025-0418']
  },
  {
    id: 'pcef_005', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.4',
    costCodeId: 'cc_plant', resourceType: 'plant', period: '2025-11', measureGroup: 'cost',
    planned: 300000, budgeted: 320000, committed: 300000, actual: 285000, earned: 295000, forecast: 335000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['plant log Nov-25', 'PL-2025-0771']
  },
  {
    id: 'pcef_006', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.4', wbsName: 'Masonry & Finishing', activityId: 'ACT-FIN-020', boqItemId: 'BOQ-04.2',
    costCodeId: 'cc_lab_civil', resourceType: 'labour', period: '2025-11', measureGroup: 'cost',
    planned: 310000, budgeted: 330000, committed: 318000, actual: 296000, earned: 305000, forecast: 352000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['DPR-2025-1118', 'attendance Nov-25', 'GL-PRJ1-4210']
  },
  // Quantity group (Cum / SqM / MT by BOQ item)
  {
    id: 'pcef_101', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.1',
    costCodeId: 'cc_mat_civil', resourceType: 'material', period: '2025-11', measureGroup: 'quantity',
    planned: 640, budgeted: 640, committed: 640, actual: 612, earned: 628, forecast: 665,
    uomId: 'uom_cum', currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['MB-2025-0031', 'DPR-2025-1121']
  },
  {
    id: 'pcef_102', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.4', wbsName: 'Masonry & Finishing', activityId: 'ACT-FIN-020', boqItemId: 'BOQ-04.1',
    costCodeId: 'cc_mat_civil', resourceType: 'material', period: '2025-11', measureGroup: 'quantity',
    planned: 2400, budgeted: 2400, committed: 2400, actual: 2185, earned: 2310, forecast: 2520,
    uomId: 'uom_sqm', currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['MB-2025-0030', 'DPR-2025-1118']
  },
  // Labour hours group
  {
    id: 'pcef_201', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.2', wbsName: 'Foundations', activityId: 'ACT-CON-006', boqItemId: 'BOQ-02.1',
    costCodeId: 'cc_lab_civil', resourceType: 'labour', period: '2025-11', measureGroup: 'labour_hours',
    planned: 8400, budgeted: 9000, committed: 8800, actual: 8300, earned: 8600, forecast: 9400,
    uomId: 'uom_hr', currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['attendance Nov-25', 'DPR-2025-1121']
  },
  {
    id: 'pcef_202', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.1',
    costCodeId: 'cc_lab_civil', resourceType: 'labour', period: '2025-11', measureGroup: 'labour_hours',
    planned: 12600, budgeted: 13200, committed: 13000, actual: 12150, earned: 12480, forecast: 13900,
    uomId: 'uom_hr', currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['attendance Nov-25', 'DPR-2025-1121']
  },
  // Plant hours group
  {
    id: 'pcef_301', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.4',
    costCodeId: 'cc_plant', resourceType: 'plant', period: '2025-11', measureGroup: 'plant_hours',
    planned: 480, budgeted: 512, committed: 480, actual: 456, earned: 472, forecast: 536,
    uomId: 'uom_hr', currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['plant log Nov-25', 'PL-2025-0771']
  },
  // Procurement group (committed POs vs budget — CP-PCE-02 source)
  {
    id: 'pcef_401', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.1',
    costCodeId: 'cc_mat_civil', resourceType: 'material', period: '2025-11', measureGroup: 'procurement',
    planned: 760000, budgeted: 780000, committed: 856906, actual: 165612, earned: 755000, forecast: 815000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['PO-2025-0204', 'CS-2025-0012', 'PR-2025-0118', 'GRN-2025-0834']
  },
  // Billing group (certified / billed / collected — Part 46)
  {
    id: 'pcef_501', projectId: 'prj_001', projectName: 'Riverside Tower - Phase II', siteId: 'site_001',
    wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', activityId: 'ACT-CON-010', boqItemId: 'BOQ-03.1',
    costCodeId: 'cc_mat_civil', resourceType: 'material', period: '2025-11', measureGroup: 'billing',
    planned: 760000, budgeted: 780000, committed: 0, actual: 0, earned: 755000, forecast: 815000,
    currency: 'INR', refreshedAt: '2025-12-04T08:30:00Z', sourceVersion: 'sv_2025_12_04_01',
    sources: ['RA Bill 12 (certified)', 'collection Nov-25']
  }
];

// Variances (section 5.4 calculators)
export const pceVariances: PceVariance[] = [
  { id: 'pcev_001', projectId: 'prj_001', wbsNodeId: 'wbs_1.2', wbsName: 'Foundations', type: 'cost', value: 15000, unit: 'INR', status: 'favourable', threshold: 50000, alert: false, sources: ['DPR-2025-1121', 'GL-PRJ1-4210'] },
  { id: 'pcev_002', projectId: 'prj_001', wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', type: 'cost', value: 60000, unit: 'INR', status: 'favourable', threshold: 50000, alert: false, sources: ['GRN-2025-0812', 'MB-2025-0031'] },
  { id: 'pcev_003', projectId: 'prj_001', wbsNodeId: 'wbs_1.4', wbsName: 'Masonry & Finishing', type: 'cost', value: 9000, unit: 'INR', status: 'favourable', threshold: 50000, alert: false, sources: ['DPR-2025-1118'] },
  { id: 'pcev_004', projectId: 'prj_001', wbsNodeId: 'wbs_1.2', wbsName: 'Foundations', type: 'schedule', value: 10000, unit: 'INR', status: 'favourable', threshold: 0, alert: false, sources: ['MB-2025-0028', 'schedule baseline v2'] },
  { id: 'pcev_005', projectId: 'prj_001', wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', type: 'schedule', value: -10000, unit: 'INR', status: 'adverse', threshold: 0, alert: false, sources: ['MB-2025-0031', 'schedule baseline v2'] },
  { id: 'pcev_006', projectId: 'prj_001', wbsNodeId: 'wbs_1.2', wbsName: 'Foundations', type: 'productivity', value: 2.4, unit: '%', status: 'favourable', threshold: 0, alert: false, sources: ['attendance Nov-25', 'MB-2025-0028'] },
  { id: 'pcev_007', projectId: 'prj_001', wbsNodeId: 'wbs_1.4', wbsName: 'Masonry & Finishing', type: 'productivity', value: -3.1, unit: '%', status: 'adverse', threshold: 0, alert: false, sources: ['attendance Nov-25', 'MB-2025-0030'] },
  { id: 'pcev_008', projectId: 'prj_001', wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', type: 'quantity', value: -16, unit: 'Cum', status: 'adverse', threshold: 0, alert: false, sources: ['MB-2025-0031', 'BOQ-03.1'] },
  { id: 'pcev_009', projectId: 'prj_001', wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', type: 'commitment_coverage', value: 109.9, unit: '%', status: 'adverse', threshold: 100, alert: true, sources: ['PO-2025-0204', 'CS-2025-0012'] },
  { id: 'pcev_010', projectId: 'prj_001', wbsNodeId: 'wbs_1.3', wbsName: 'RCC Frame', type: 'billing_lag', value: 5000, unit: 'INR', status: 'neutral', threshold: 100000, alert: false, sources: ['RA Bill 12 (certified)'] }
];

// Reconciliation (engine totals vs module totals — tolerance 0 for cost totals vs GL after finance live)
export const pceReconciliations: PceReconciliation[] = [
  { id: 'pcer_001', projectId: 'prj_001', scope: 'budget', engineTotal: 2970000, moduleTotal: 2970000, moduleRef: 'Part 25 approved budget v4 (Riverside)', difference: 0, tolerance: 0, status: 'match', checkedAt: '2025-12-04T08:35:00Z' },
  { id: 'pcer_002', projectId: 'prj_001', scope: 'gl_project_cost', engineTotal: 2742000, moduleTotal: 2741955, moduleRef: 'GL project cost postings (finance live)', difference: 45, tolerance: 0, status: 'difference', checkedAt: '2025-12-04T08:35:00Z' },
  { id: 'pcer_003', projectId: 'prj_001', scope: 'billing', engineTotal: 755000, moduleTotal: 755000, moduleRef: 'Part 46 certified RA bills', difference: 0, tolerance: 0, status: 'match', checkedAt: '2025-12-04T08:35:00Z' }
];

// Refresh log (incremental on events debounced per project + nightly full + on-demand)
export const pceRefreshLog: PceRefreshLog[] = [
  { id: 'pcerl_001', runId: 'REF-2025-1204-0830', scope: 'prj_001', type: 'incremental', startedAt: '2025-12-04T08:30:00Z', finishedAt: '2025-12-04T08:30:12Z', rows: 342, status: 'completed', trigger: 'event: dpr.approved (debounced)' },
  { id: 'pcerl_002', runId: 'REF-2025-1204-0200', scope: 'all projects', type: 'full', startedAt: '2025-12-04T02:00:00Z', finishedAt: '2025-12-04T02:11:40Z', rows: 12845, status: 'completed', trigger: 'schedule: nightly 02:00 UTC' },
  { id: 'pcerl_003', runId: 'REF-2025-1203-1432', scope: 'prj_001', type: 'on_demand', startedAt: '2025-12-03T14:32:00Z', finishedAt: '2025-12-03T14:32:09Z', rows: 342, status: 'completed', trigger: 'manual: planning lead' },
  { id: 'pcerl_004', runId: 'REF-2025-1203-0200', scope: 'all projects', type: 'full', startedAt: '2025-12-03T02:00:00Z', finishedAt: '2025-12-03T02:06:15Z', rows: 9011, status: 'failed', error: 'source adapter budget (Part 25) timeout after 300s — retried and completed as REF-2025-1203-0200R (violation recorded, CP-PCE-01)', trigger: 'schedule: nightly 02:00 UTC' }
];

// Measure dictionary (published in KPI_CATALOGUE.md with formulas)
export const pceMeasureDefinitions: PceMeasureDefinition[] = [
  { id: 'pcem_001', measureGroup: 'cost', column: 'planned', definition: 'Time-phased planned cost from schedule phasing', source: 'Part 26 schedule', formula: 'Σ(activity planned qty × budget rate, by period)', dataLabel: 'Planned Cost' },
  { id: 'pcem_002', measureGroup: 'cost', column: 'budgeted', definition: 'Approved budget for the cost code / WBS', source: 'Part 25 approved budget', formula: 'approved budget line value', dataLabel: 'Budgeted Cost' },
  { id: 'pcem_003', measureGroup: 'cost', column: 'committed', definition: 'Committed cost from approved POs/contracts and adjustments', source: 'Part 25 commitments', formula: 'Σ(approved PO value + amendments − short-closed)', dataLabel: 'Committed Cost' },
  { id: 'pcem_004', measureGroup: 'cost', column: 'actual', definition: 'Approved/posted actual cost only; draft data excluded', source: 'Postings / DPR / attendance / plant logs', formula: 'Σ posted cost (approved)', dataLabel: 'Actual Cost' },
  { id: 'pcem_005', measureGroup: 'cost', column: 'earned', definition: 'Earned value = progress × budget', source: 'Part 27 progress', formula: 'physical progress % × budgeted cost', dataLabel: 'Earned Value' },
  { id: 'pcem_006', measureGroup: 'cost', column: 'forecast', definition: 'Estimate at completion for the WBS/cost code', source: 'Parts 25/71 forecast', formula: 'actual + (budget − earned) × performance factor', dataLabel: 'Forecast Cost' },
  { id: 'pcem_007', measureGroup: 'quantity', column: 'planned', definition: 'Planned quantity by BOQ item and period', source: 'Part 26 schedule', formula: 'Σ(planned qty by period)', dataLabel: 'Planned Qty' },
  { id: 'pcem_008', measureGroup: 'labour_hours', column: 'actual', definition: 'Approved labour hours from attendance and DPR', source: 'Part 30 DPR / attendance', formula: 'Σ approved hours', dataLabel: 'Actual Labour Hrs' },
  { id: 'pcem_009', measureGroup: 'plant_hours', column: 'actual', definition: 'Approved plant hours from plant logs', source: 'Plant logs (Part 37 source)', formula: 'Σ approved plant hours', dataLabel: 'Actual Plant Hrs' },
  { id: 'pcem_010', measureGroup: 'procurement', column: 'committed', definition: 'Procurement commitments feeding cost control', source: 'Part 34 PO approval', formula: 'Σ approved PO + amendments', dataLabel: 'Procurement Committed' },
  { id: 'pcem_011', measureGroup: 'billing', column: 'earned', definition: 'Certified / billed / collected billing measures', source: 'Part 46 billing', formula: 'certified value (RA bills)', dataLabel: 'Certified Value' }
];

export const pceStats = {
  factsRows: pceFacts.length,
  measureGroups: 8,
  wbsNodes: new Set(pceFacts.map(f => f.wbsNodeId)).size,
  openVariances: pceVariances.filter(v => v.alert).length,
  varianceCount: pceVariances.length,
  reconciliationDifferences: pceReconciliations.filter(r => r.status === 'difference').length,
  lastRefresh: '2025-12-04T08:30:12Z',
  lastRefreshRows: 342,
  refreshSuccessRate: 98,
  cvTotal: pceVariances.filter(v => v.type === 'cost').reduce((s, v) => s + v.value, 0)
};
