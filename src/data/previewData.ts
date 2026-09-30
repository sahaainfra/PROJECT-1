// Preview data for Part 1 — Live Dashboard Preview & Walking Skeleton
// All data is synthetic, labelled PREVIEW DATA, no real identifiers

export type Persona = 
  | 'management' | 'pm' | 'site_engineer' | 'store_keeper'
  | 'qs' | 'procurement' | 'plant_manager' | 'hr'
  | 'qa_qc' | 'hse' | 'protocol_officer' | 'super_admin';

export interface PersonaInfo {
  id: Persona;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  device: 'mobile' | 'tablet' | 'desktop';
}

export const personas: PersonaInfo[] = [
  { id: 'management', name: 'Management / CFO', shortName: 'CFO', icon: '👔', color: 'indigo', description: 'Executive financial overview', device: 'desktop' },
  { id: 'pm', name: 'Project Manager', shortName: 'PM', icon: '📋', color: 'blue', description: 'Project 360° view', device: 'tablet' },
  { id: 'site_engineer', name: 'Site Engineer', shortName: 'Site Eng.', icon: '👷', color: 'orange', description: 'Mobile site operations', device: 'mobile' },
  { id: 'store_keeper', name: 'Store Keeper', shortName: 'Store', icon: '📦', color: 'amber', description: 'Stores & material control', device: 'mobile' },
  { id: 'qs', name: 'QS / Commercial', shortName: 'QS', icon: '💼', color: 'emerald', description: 'Cost & commercial control', device: 'tablet' },
  { id: 'procurement', name: 'Procurement', shortName: 'Proc.', icon: '🛒', color: 'violet', description: 'Procurement pipeline', device: 'desktop' },
  { id: 'plant_manager', name: 'Plant Manager', shortName: 'Plant', icon: '🚜', color: 'cyan', description: 'Equipment utilisation', device: 'desktop' },
  { id: 'hr', name: 'HR Manager', shortName: 'HR', icon: '👥', color: 'rose', description: 'Workforce & payroll', device: 'desktop' },
  { id: 'qa_qc', name: 'QA/QC Inspector', shortName: 'QA/QC', icon: '🔍', color: 'teal', description: 'Quality inspections', device: 'tablet' },
  { id: 'hse', name: 'HSE Officer', shortName: 'HSE', icon: '⛑️', color: 'red', description: 'Safety & compliance', device: 'tablet' },
  { id: 'protocol_officer', name: 'Protocol Officer', shortName: 'Protocol', icon: '🛡️', color: 'slate', description: 'Protocol Control Tower', device: 'desktop' },
  { id: 'super_admin', name: 'Super Admin', shortName: 'Admin', icon: '⚙️', color: 'gray', description: 'System health & config', device: 'desktop' },
];

export type WidgetStatus = 'PREVIEW' | 'LIVE' | 'PROMOTED' | 'RETIRED';
export type DataMode = 'fixture' | 'live';

export interface WidgetMeta {
  code: string;
  title: string;
  persona: Persona[];
  kpiCodes: string[];
  futureSourcePrompt: string;
  futureApi: string;
  status: WidgetStatus;
  dataMode: DataMode;
  owner: string;
  feedbackCount: number;
}

export const widgetRegistry: WidgetMeta[] = [
  { code: 'w-my-tasks', title: 'My Tasks', persona: ['management','pm','site_engineer','qs','procurement'], kpiCodes: ['KPI-001'], futureSourcePrompt: 'Part 14', futureApi: '/api/v1/dash/my-tasks', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 14', feedbackCount: 3 },
  { code: 'w-my-approvals', title: 'My Approvals', persona: ['management','pm','procurement','qs'], kpiCodes: ['KPI-002'], futureSourcePrompt: 'Part 6', futureApi: '/api/v1/dash/my-approvals', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 6', feedbackCount: 5 },
  { code: 'w-my-projects', title: 'My Projects / Sites', persona: ['pm','site_engineer'], kpiCodes: ['KPI-003'], futureSourcePrompt: 'Part 16', futureApi: '/api/v1/dash/my-projects', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 16', feedbackCount: 2 },
  { code: 'w-my-kpis', title: 'My KPIs', persona: ['management','pm','qs','procurement'], kpiCodes: ['KPI-004'], futureSourcePrompt: 'Part 109', futureApi: '/api/v1/dash/my-kpis', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 109', feedbackCount: 4 },
  { code: 'w-protocol-tower', title: 'Protocol Control Tower', persona: ['protocol_officer','management'], kpiCodes: ['KPI-010','KPI-011','KPI-012'], futureSourcePrompt: 'Part 7', futureApi: '/api/v1/dash/protocol-tower', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 7', feedbackCount: 7 },
  { code: 'w-project-360', title: 'Project 360°', persona: ['pm','qs','management'], kpiCodes: ['KPI-020','KPI-021','KPI-022'], futureSourcePrompt: 'Part 16', futureApi: '/api/v1/dash/project-360', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 16', feedbackCount: 6 },
  { code: 'w-site-home', title: 'Site Mobile Home', persona: ['site_engineer'], kpiCodes: ['KPI-030','KPI-031'], futureSourcePrompt: 'Part 18', futureApi: '/api/v1/dash/site-home', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 18', feedbackCount: 4 },
  { code: 'w-procurement', title: 'Procurement Control', persona: ['procurement','pm'], kpiCodes: ['KPI-040','KPI-041','KPI-042'], futureSourcePrompt: 'Part 26', futureApi: '/api/v1/dash/procurement', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 26', feedbackCount: 3 },
  { code: 'w-stores', title: 'Stores Control', persona: ['store_keeper','pm'], kpiCodes: ['KPI-050','KPI-051'], futureSourcePrompt: 'Part 30', futureApi: '/api/v1/dash/stores', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 30', feedbackCount: 2 },
  { code: 'w-plant', title: 'Plant Utilisation', persona: ['plant_manager','pm'], kpiCodes: ['KPI-060','KPI-061'], futureSourcePrompt: 'Part 86', futureApi: '/api/v1/dash/plant', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 86', feedbackCount: 1 },
  { code: 'w-cfo-snapshot', title: 'CFO Snapshot', persona: ['management'], kpiCodes: ['KPI-070','KPI-071','KPI-072','KPI-073'], futureSourcePrompt: 'Part 56', futureApi: '/api/v1/dash/cfo', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 56', feedbackCount: 8 },
  { code: 'w-admin-health', title: 'System Health', persona: ['super_admin'], kpiCodes: ['KPI-080','KPI-081'], futureSourcePrompt: 'Part 3', futureApi: '/api/v1/dash/admin-health', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 3', feedbackCount: 2 },
  { code: 'w-notifications', title: 'Notifications', persona: ['management','pm','site_engineer','store_keeper','qs','procurement','plant_manager','hr','qa_qc','hse','protocol_officer','super_admin'], kpiCodes: [], futureSourcePrompt: 'Part 3', futureApi: '/api/v1/dash/notifications', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 3', feedbackCount: 1 },
  { code: 'w-attendance', title: 'My Attendance', persona: ['site_engineer','store_keeper','hr'], kpiCodes: ['KPI-090'], futureSourcePrompt: 'Part 71', futureApi: '/api/v1/dash/attendance', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 71', feedbackCount: 0 },
  { code: 'w-hse-dashboard', title: 'HSE Dashboard', persona: ['hse','pm','management'], kpiCodes: ['KPI-100','KPI-101'], futureSourcePrompt: 'Part 90', futureApi: '/api/v1/dash/hse', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 90', feedbackCount: 3 },
  { code: 'w-qa-dashboard', title: 'QA/QC Dashboard', persona: ['qa_qc','pm'], kpiCodes: ['KPI-110','KPI-111'], futureSourcePrompt: 'Part 92', futureApi: '/api/v1/dash/qa', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 92', feedbackCount: 2 },
  { code: 'w-hr-dashboard', title: 'HR Workforce', persona: ['hr','management'], kpiCodes: ['KPI-120','KPI-121'], futureSourcePrompt: 'Part 71', futureApi: '/api/v1/dash/hr', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 71', feedbackCount: 1 },
];

// KPI Catalogue Draft
export interface KPIDefinition {
  code: string;
  name: string;
  formula: string;
  unit: string;
  target: string;
  ownerPrompt: string;
}

export const kpiCatalogue: KPIDefinition[] = [
  { code: 'KPI-001', name: 'Tasks Completed', formula: 'COUNT(tasks WHERE status=done AND assignee=current_user) / COUNT(tasks WHERE assignee=current_user)', unit: '%', target: '> 85%', ownerPrompt: 'Part 14' },
  { code: 'KPI-002', name: 'Approval Turnaround', formula: 'AVG(approval.completed_at - approval.created_at) WHERE approver=current_user', unit: 'hours', target: '< 24h', ownerPrompt: 'Part 6' },
  { code: 'KPI-003', name: 'Project Health Score', formula: 'Weighted avg of schedule, cost, quality, safety indices', unit: 'score 0-100', target: '> 80', ownerPrompt: 'Part 16' },
  { code: 'KPI-004', name: 'Personal KPI Achievement', formula: 'SUM(achieved_kpis) / SUM(total_kpis) × 100', unit: '%', target: '> 90%', ownerPrompt: 'Part 109' },
  { code: 'KPI-010', name: 'Protocol Compliance Score', formula: '(passed_checks / total_checks) × 100', unit: '%', target: '> 95%', ownerPrompt: 'Part 7' },
  { code: 'KPI-011', name: 'Open Violations', formula: 'COUNT(violations WHERE status=open)', unit: 'count', target: '0', ownerPrompt: 'Part 7' },
  { code: 'KPI-012', name: 'Exception Rate', formula: 'COUNT(approved_exceptions) / COUNT(protocol_checks) × 100', unit: '%', target: '< 5%', ownerPrompt: 'Part 7' },
  { code: 'KPI-020', name: 'Schedule Variance', formula: '(EV - PV) / PV × 100', unit: '%', target: '±5%', ownerPrompt: 'Part 16' },
  { code: 'KPI-021', name: 'Cost Variance', formula: '(EV - AC) / EV × 100', unit: '%', target: '±3%', ownerPrompt: 'Part 16' },
  { code: 'KPI-022', name: 'Budget Utilisation', formula: 'AC / BAC × 100', unit: '%', target: '< 100%', ownerPrompt: 'Part 16' },
  { code: 'KPI-030', name: 'Today\'s Work Authorisations', formula: 'COUNT(authorisations WHERE date=today AND site=current_site)', unit: 'count', target: 'All approved', ownerPrompt: 'Part 18' },
  { code: 'KPI-031', name: 'DPR Completion', formula: 'Daily Progress Report fields filled / total fields', unit: '%', target: '100%', ownerPrompt: 'Part 18' },
  { code: 'KPI-040', name: 'PO Cycle Time', formula: 'AVG(po.approved_at - pr.created_at)', unit: 'days', target: '< 7 days', ownerPrompt: 'Part 26' },
  { code: 'KPI-041', name: 'Pending PRs', formula: 'COUNT(pr WHERE status=open)', unit: 'count', target: '< 10', ownerPrompt: 'Part 26' },
  { code: 'KPI-042', name: 'Vendor Performance', formula: 'Weighted avg of delivery, quality, cost scores', unit: 'score 0-100', target: '> 75', ownerPrompt: 'Part 26' },
  { code: 'KPI-050', name: 'Consumption vs Theoretical', formula: 'actual_consumption / theoretical_consumption × 100', unit: '%', target: '95-102%', ownerPrompt: 'Part 30' },
  { code: 'KPI-051', name: 'Material Wastage', formula: '(actual - theoretical) / theoretical × 100', unit: '%', target: '< 3%', ownerPrompt: 'Part 30' },
  { code: 'KPI-060', name: 'Plant Utilisation', formula: 'working_hours / available_hours × 100', unit: '%', target: '> 75%', ownerPrompt: 'Part 86' },
  { code: 'KPI-061', name: 'Breakdown Rate', formula: 'breakdown_hours / working_hours × 100', unit: '%', target: '< 5%', ownerPrompt: 'Part 86' },
  { code: 'KPI-070', name: 'Cash Position', formula: 'SUM(cash_in) - SUM(cash_out) for current period', unit: 'currency', target: '> 0', ownerPrompt: 'Part 56' },
  { code: 'KPI-071', name: 'Outstanding Receivables', formula: 'SUM(invoices WHERE status=unpaid AND due_date < today)', unit: 'currency', target: '< 5% revenue', ownerPrompt: 'Part 56' },
  { code: 'KPI-072', name: 'Outstanding Payables', formula: 'SUM(bills WHERE status=unpaid)', unit: 'currency', target: 'Within terms', ownerPrompt: 'Part 56' },
  { code: 'KPI-073', name: 'Project Margin', formula: '(revenue - cost) / revenue × 100', unit: '%', target: '> 12%', ownerPrompt: 'Part 56' },
  { code: 'KPI-080', name: 'System Uptime', formula: 'available_time / total_time × 100', unit: '%', target: '> 99.5%', ownerPrompt: 'Part 3' },
  { code: 'KPI-081', name: 'API Response p95', formula: 'PERCENTILE(response_time, 0.95)', unit: 'ms', target: '< 500ms', ownerPrompt: 'Part 3' },
  { code: 'KPI-090', name: 'Attendance Rate', formula: 'present_days / working_days × 100', unit: '%', target: '> 95%', ownerPrompt: 'Part 71' },
  { code: 'KPI-100', name: 'Safety Incident Rate', formula: 'incidents × 200000 / total_hours_worked', unit: 'rate', target: '< 1.0', ownerPrompt: 'Part 90' },
  { code: 'KPI-101', name: 'Near Miss Reports', formula: 'COUNT(near_misses WHERE month=current)', unit: 'count', target: '> 5 (reporting culture)', ownerPrompt: 'Part 90' },
  { code: 'KPI-110', name: 'Inspection Pass Rate', formula: 'passed_inspections / total_inspections × 100', unit: '%', target: '> 95%', ownerPrompt: 'Part 92' },
  { code: 'KPI-111', name: 'NCR Open Count', formula: 'COUNT(ncr WHERE status=open)', unit: 'count', target: '< 3', ownerPrompt: 'Part 92' },
  { code: 'KPI-120', name: 'Headcount vs Plan', formula: 'actual_headcount / planned_headcount × 100', unit: '%', target: '95-105%', ownerPrompt: 'Part 71' },
  { code: 'KPI-121', name: 'Payroll Accuracy', formula: '(total_records - error_records) / total_records × 100', unit: '%', target: '100%', ownerPrompt: 'Part 71' },
];

// Fixture data for dashboards
export const fixtureData = {
  myTasks: {
    total: 24,
    overdue: 3,
    inProgress: 8,
    completed: 13,
    items: [
      { id: 'T-001', title: 'Review PO-2026-0142 for Riverside Tower', priority: 'high', due: '2026-01-16', status: 'pending' },
      { id: 'T-002', title: 'Approve GRN for steel reinforcement batch #47', priority: 'high', due: '2026-01-15', status: 'pending' },
      { id: 'T-003', title: 'Update DPR for Site B — Foundation work', priority: 'medium', due: '2026-01-15', status: 'in_progress' },
      { id: 'T-004', title: 'Reconcile material consumption for Block C', priority: 'medium', due: '2026-01-17', status: 'in_progress' },
      { id: 'T-005', title: 'Submit monthly progress report — December', priority: 'low', due: '2026-01-20', status: 'pending' },
      { id: 'T-006', title: 'Review subcontractor RA bill #12', priority: 'high', due: '2026-01-14', status: 'overdue' },
      { id: 'T-007', title: 'Schedule equipment maintenance — Crane #3', priority: 'medium', due: '2026-01-18', status: 'pending' },
    ],
  },
  myApprovals: {
    pending: 7,
    overdue: 2,
    approvedThisWeek: 12,
    avgTurnaround: '18.4h',
    items: [
      { id: 'APR-001', type: 'Purchase Order', ref: 'PO-2026-0142', amount: '₹24,50,000', requester: 'Rajesh Kumar', submitted: '2026-01-14', priority: 'high' },
      { id: 'APR-002', type: 'Payment Release', ref: 'PAY-2026-0089', amount: '₹18,75,000', requester: 'Priya Sharma', submitted: '2026-01-13', priority: 'high' },
      { id: 'APR-003', type: 'Subcontract Bill', ref: 'SCB-2026-0034', amount: '₹42,00,000', requester: 'Amit Patel', submitted: '2026-01-12', priority: 'medium' },
      { id: 'APR-004', type: 'Material Request', ref: 'MR-2026-0256', amount: '₹3,20,000', requester: 'Sunil Verma', submitted: '2026-01-15', priority: 'low' },
      { id: 'APR-005', type: 'Variation Order', ref: 'VO-2026-0018', amount: '₹8,50,000', requester: 'Neha Gupta', submitted: '2026-01-11', priority: 'high' },
    ],
  },
  project360: {
    project: { name: 'Riverside Tower — Phase II', code: 'PRJ-2025-003', client: 'Metro Developers Pvt. Ltd.', status: 'In Progress', progress: 67 },
    schedule: { planned: 72, actual: 67, variance: -5, spi: 0.93 },
    cost: { budget: 125000000, actual: 78500000, earned: 83750000, cpi: 1.07, spi: 0.93 },
    milestones: [
      { name: 'Foundation Complete', date: '2025-11-30', status: 'completed' },
      { name: 'Structure — Ground Floor', date: '2026-01-15', status: 'in_progress' },
      { name: 'Structure — 5th Floor', date: '2026-03-30', status: 'upcoming' },
      { name: 'MEP First Fix', date: '2026-05-15', status: 'upcoming' },
      { name: 'Handover', date: '2026-12-30', status: 'upcoming' },
    ],
    openIssues: 8,
    pendingApprovals: 5,
    activePOs: 12,
    labourCount: 186,
  },
  protocolTower: {
    complianceScore: 94.2,
    totalChecks: 1247,
    passed: 1175,
    warnings: 48,
    violations: 12,
    exceptions: 24,
    recentViolations: [
      { id: 'V-001', control: 'CP-MAT-03', description: 'GRN posted without 3-way match', severity: 'high', site: 'Riverside Tower', time: '2h ago' },
      { id: 'V-002', control: 'CP-FIN-01', description: 'Payment released without maker-checker', severity: 'critical', site: 'Highway Bridge', time: '5h ago' },
      { id: 'V-003', control: 'CP-SUB-02', description: 'RA bill approved beyond authority limit', severity: 'medium', site: 'Riverside Tower', time: '1d ago' },
    ],
    recentExceptions: [
      { id: 'EX-001', control: 'CP-MAT-05', reason: 'Emergency material — vendor shortage', status: 'approved', site: 'Site C', time: '3h ago' },
      { id: 'EX-002', control: 'CP-PRM-02', reason: 'Back-dated entry — system outage', status: 'pending', site: 'Site A', time: '6h ago' },
    ],
    trend: [
      { week: 'W1', compliance: 91.2 },
      { week: 'W2', compliance: 92.8 },
      { week: 'W3', compliance: 93.5 },
      { week: 'W4', compliance: 94.2 },
    ],
  },
  siteHome: {
    site: 'Riverside Tower — Block C',
    date: '2026-01-15',
    weather: 'Clear, 28°C',
    workAuthorisations: { total: 8, approved: 7, pending: 1 },
    gateStatus: [
      { gate: 'Concrete Pour — Footing F12', status: 'approved', checkedBy: 'Site Eng. Rahul' },
      { gate: 'Rebar Inspection — Column Grid B3', status: 'approved', checkedBy: 'QA Anil' },
      { gate: 'Formwork — Beam B4-B5', status: 'pending', checkedBy: 'Awaiting' },
      { gate: 'Shuttering — Slab Level 2', status: 'approved', checkedBy: 'Site Eng. Meena' },
    ],
    labour: { planned: 45, present: 42, absent: 3 },
    materialBalance: [
      { item: 'Steel TMT 16mm', unit: 'MT', received: 24.5, consumed: 18.2, balance: 6.3 },
      { item: 'Cement OPC 53', unit: 'Bags', received: 800, consumed: 620, balance: 180 },
      { item: 'Sand (River)', unit: 'Cum', received: 120, consumed: 95, balance: 25 },
      { item: 'Aggregate 20mm', unit: 'Cum', received: 85, consumed: 72, balance: 13 },
    ],
    dpr: { progress: 78, itemsCompleted: 12, itemsPending: 3 },
  },
  procurement: {
    pendingPRs: 14,
    pendingPOs: 8,
    pendingApprovals: 6,
    grnPending: 4,
    totalValuePending: 8950000,
    vendorPerformance: [
      { vendor: 'Tata Steel Ltd.', score: 88, deliveries: 45, onTime: 92 },
      { vendor: 'UltraTech Cement', score: 92, deliveries: 38, onTime: 95 },
      { vendor: 'JSW Steel', score: 76, deliveries: 22, onTime: 82 },
      { vendor: 'Ambuja Cements', score: 85, deliveries: 30, onTime: 90 },
    ],
    recentPOs: [
      { po: 'PO-2026-0142', vendor: 'Tata Steel Ltd.', value: 2450000, status: 'Pending Approval', date: '2026-01-14' },
      { po: 'PO-2026-0141', vendor: 'UltraTech Cement', value: 890000, status: 'Approved', date: '2026-01-13' },
      { po: 'PO-2026-0140', vendor: 'Local Bricks Supply', value: 320000, status: 'Partially Received', date: '2026-01-12' },
    ],
  },
  stores: {
    consumptionVsTheoretical: 98.4,
    wastage: 1.6,
    lowStockItems: 5,
    pendingGRNs: 3,
    stockValue: 12450000,
    topConsumed: [
      { item: 'Steel TMT 16mm', consumed: 18.2, theoretical: 17.8, variance: 2.2 },
      { item: 'Cement OPC 53', consumed: 620, theoretical: 600, variance: 3.3 },
      { item: 'Sand (River)', consumed: 95, theoretical: 92, variance: 3.3 },
      { item: 'Aggregate 20mm', consumed: 72, theoretical: 70, variance: 2.9 },
      { item: 'Bricks (Red)', consumed: 15000, theoretical: 14800, variance: 1.4 },
    ],
    lowStockAlerts: [
      { item: 'Binding Wire', balance: 12, unit: 'Kg', reorderLevel: 25 },
      { item: 'Cover Blocks 50mm', balance: 80, unit: 'Nos', reorderLevel: 200 },
      { item: 'Curing Compound', balance: 5, unit: 'Ltr', reorderLevel: 10 },
    ],
  },
  plant: {
    totalEquipment: 24,
    active: 18,
    idle: 4,
    maintenance: 2,
    utilisation: 78.5,
    breakdownRate: 3.2,
    equipment: [
      { name: 'Tower Crane TC-01', utilisation: 85, status: 'active', hours: 1420, breakdown: 2.1 },
      { name: 'Batching Plant BP-01', utilisation: 92, status: 'active', hours: 1580, breakdown: 1.5 },
      { name: 'Excavator EX-03', utilisation: 65, status: 'active', hours: 980, breakdown: 4.8 },
      { name: 'Concrete Pump CP-02', utilisation: 72, status: 'active', hours: 1100, breakdown: 3.2 },
      { name: 'Generator DG-01', utilisation: 45, status: 'idle', hours: 650, breakdown: 0.8 },
      { name: 'Loader LD-02', utilisation: 0, status: 'maintenance', hours: 890, breakdown: 12.5 },
    ],
  },
  cfoSnapshot: {
    cashPosition: 42500000,
    receivables: 18750000,
    payables: 24300000,
    revenueYTD: 185000000,
    costYTD: 158000000,
    margin: 14.6,
    projects: [
      { name: 'Riverside Tower', revenue: 85000000, cost: 72500000, margin: 14.7 },
      { name: 'Highway Bridge Ph.2', revenue: 62000000, cost: 54000000, margin: 12.9 },
      { name: 'Metro Station Fit-out', revenue: 38000000, cost: 31500000, margin: 17.1 },
    ],
    agingReceivables: [
      { bucket: 'Current', amount: 8500000 },
      { bucket: '1-30 days', amount: 5250000 },
      { bucket: '31-60 days', amount: 3200000 },
      { bucket: '61-90 days', amount: 1200000 },
      { bucket: '90+ days', amount: 600000 },
    ],
  },
  adminHealth: {
    uptime: 99.97,
    apiP95: 245,
    activeUsers: 142,
    dbConnections: 28,
    queueDepth: 3,
    errorRate: 0.02,
    services: [
      { name: 'API Gateway', status: 'healthy', latency: 12 },
      { name: 'Auth Service', status: 'healthy', latency: 8 },
      { name: 'Workflow Engine', status: 'healthy', latency: 24 },
      { name: 'Notification Service', status: 'healthy', latency: 15 },
      { name: 'Document Service', status: 'healthy', latency: 45 },
      { name: 'Report Engine', status: 'degraded', latency: 120 },
    ],
    recentIncidents: [
      { id: 'INC-001', title: 'Report engine timeout', severity: 'medium', resolved: true, time: '2h ago' },
      { id: 'INC-002', title: 'Queue backlog spike', severity: 'low', resolved: true, time: '1d ago' },
    ],
  },
  hse: {
    incidentRate: 0.8,
    nearMisses: 7,
    openIncidents: 2,
    toolboxTalks: 12,
    safetyScore: 92,
    inspectionsThisMonth: 28,
    recentIncidents: [
      { id: 'HSE-001', type: 'Near Miss', description: 'Unsecured material at height', site: 'Riverside Tower', severity: 'medium', date: '2026-01-14' },
      { id: 'HSE-002', type: 'First Aid', description: 'Minor cut — PPE compliance issue', site: 'Site B', severity: 'low', date: '2026-01-12' },
    ],
  },
  qa: {
    inspectionPassRate: 96.8,
    openNCRs: 2,
    inspectionsThisMonth: 45,
    testRequests: 8,
    recentInspections: [
      { id: 'QA-001', type: 'Rebar Inspection', location: 'Column Grid B3', result: 'Pass', date: '2026-01-15' },
      { id: 'QA-002', type: 'Concrete Slump Test', location: 'Footing F12', result: 'Pass', date: '2026-01-15' },
      { id: 'QA-003', type: 'Waterproofing Check', location: 'Basement Wall W4', result: 'Fail', date: '2026-01-14' },
    ],
  },
  hr: {
    totalHeadcount: 342,
    presentToday: 328,
    onLeave: 8,
    absent: 6,
    attendanceRate: 95.9,
    payrollStatus: 'Processed',
    departments: [
      { name: 'Site Operations', count: 186, present: 178 },
      { name: 'Procurement', count: 24, present: 23 },
      { name: 'Finance', count: 18, present: 18 },
      { name: 'Engineering', count: 42, present: 40 },
      { name: 'Admin', count: 72, present: 69 },
    ],
  },
  notifications: [
    { id: 'N-001', level: 'critical', title: 'Payment approval overdue', message: 'PAY-2026-0089 pending for 48h', time: '5m ago', read: false },
    { id: 'N-002', level: 'warning', title: 'Low stock alert', message: 'Binding Wire below reorder level', time: '15m ago', read: false },
    { id: 'N-003', level: 'action', title: 'Approval required', message: 'PO-2026-0142 awaiting your approval', time: '1h ago', read: false },
    { id: 'N-004', level: 'info', title: 'GRN completed', message: 'GRN-2026-0234 processed successfully', time: '2h ago', read: true },
    { id: 'N-005', level: 'info', title: 'Report generated', message: 'Monthly progress report — December ready', time: '3h ago', read: true },
    { id: 'N-006', level: 'escalation', title: 'Protocol violation', message: 'CP-FIN-01 breach at Highway Bridge', time: '5h ago', read: true },
  ],
};

export interface FeedbackEntry {
  id: string;
  widgetCode: string;
  screen: string;
  reviewer: string;
  comment: string;
  decision: 'accepted' | 'change_requested';
  createdAt: string;
}

export const sampleFeedback: FeedbackEntry[] = [
  { id: 'FB-001', widgetCode: 'w-cfo-snapshot', screen: 'CFO Dashboard', reviewer: 'Vikram Singh (CFO)', comment: 'Add cash flow forecast chart for next 90 days', decision: 'change_requested', createdAt: '2026-01-14T10:30:00Z' },
  { id: 'FB-002', widgetCode: 'w-protocol-tower', screen: 'Protocol Control Tower', reviewer: 'Anita Desai (Compliance)', comment: 'Layout is excellent. Accept as reference.', decision: 'accepted', createdAt: '2026-01-14T11:15:00Z' },
  { id: 'FB-003', widgetCode: 'w-project-360', screen: 'Project 360°', reviewer: 'Rajesh Kumar (PM)', comment: 'Need SPI/CPI trend chart and risk register widget', decision: 'change_requested', createdAt: '2026-01-14T14:20:00Z' },
  { id: 'FB-004', widgetCode: 'w-site-home', screen: 'Site Mobile Home', reviewer: 'Rahul Mehta (Site Eng.)', comment: 'Good mobile layout. Gate status cards are clear.', decision: 'accepted', createdAt: '2026-01-15T08:00:00Z' },
];
