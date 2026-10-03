// Part 14 — Dashboard Architecture Data

export interface Widget {
  code: string;
  name: string;
  module: string;
  type: 'kpi' | 'chart' | 'list' | 'table' | 'map' | 'calendar' | 'custom';
  dataEndpoint: string;
  requiredPermission: string;
  defaultSize: { w: number; h: number };
  refreshSeconds: number;
  supportsFilters: boolean;
  description: string;
}

export interface KPI {
  code: string;
  name: string;
  formulaDescription: string;
  unit: string;
  dataLabel: 'actual' | 'calculated' | 'forecast';
  sourceEndpoint: string;
  thresholds: {
    red: number;
    amber: number;
    green: number;
  };
  direction: 'higher_better' | 'lower_better';
  ownerModule: string;
  currentValue?: number;
  previousValue?: number;
  trend?: number[];
  asOf?: string;
  drillLink?: string;
}

export interface Layout {
  ownerType: 'user' | 'role' | 'system';
  ownerId: string;
  name: string;
  isDefault: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
  widgets: LayoutWidget[];
}

export interface LayoutWidget {
  widgetCode: string;
  x: number;
  y: number;
  w: number;
  h: number;
  filters?: Record<string, any>;
}

export interface QuickAction {
  code: string;
  label: string;
  icon: string;
  permission: string;
  action: string;
  color: string;
}

// Widget Registry
export const widgetRegistry: Widget[] = [
  {
    code: 'my-approvals',
    name: 'My Approvals',
    module: 'workflow',
    type: 'list',
    dataEndpoint: '/api/v1/wf/my/tasks',
    requiredPermission: 'wf.task.view',
    defaultSize: { w: 4, h: 3 },
    refreshSeconds: 60,
    supportsFilters: true,
    description: 'Pending approvals assigned to me'
  },
  {
    code: 'my-tasks',
    name: 'My Tasks',
    module: 'tasks',
    type: 'list',
    dataEndpoint: '/api/v1/tasks/my',
    requiredPermission: 'task.view',
    defaultSize: { w: 4, h: 3 },
    refreshSeconds: 60,
    supportsFilters: true,
    description: 'Tasks assigned to me'
  },
  {
    code: 'my-notifications',
    name: 'My Notifications',
    module: 'notifications',
    type: 'list',
    dataEndpoint: '/api/v1/notifications/my',
    requiredPermission: 'notification.view',
    defaultSize: { w: 4, h: 2 },
    refreshSeconds: 30,
    supportsFilters: true,
    description: 'Recent notifications'
  },
  {
    code: 'my-projects',
    name: 'My Projects',
    module: 'organization',
    type: 'table',
    dataEndpoint: '/api/v1/org/my/projects',
    requiredPermission: 'org.project.view',
    defaultSize: { w: 6, h: 3 },
    refreshSeconds: 300,
    supportsFilters: true,
    description: 'Projects I am allocated to'
  },
  {
    code: 'my-sites',
    name: 'My Sites',
    module: 'organization',
    type: 'table',
    dataEndpoint: '/api/v1/org/my/sites',
    requiredPermission: 'org.site.view',
    defaultSize: { w: 6, h: 3 },
    refreshSeconds: 300,
    supportsFilters: true,
    description: 'Sites I am allocated to'
  },
  {
    code: 'my-gates-today',
    name: 'My Gates Today',
    module: 'protocol',
    type: 'list',
    dataEndpoint: '/api/v1/protocol/my/gates',
    requiredPermission: 'protocol.view',
    defaultSize: { w: 4, h: 3 },
    refreshSeconds: 60,
    supportsFilters: false,
    description: 'Protocol gates I need to check today'
  },
  {
    code: 'my-exceptions',
    name: 'My Exceptions',
    module: 'protocol',
    type: 'list',
    dataEndpoint: '/api/v1/protocol/my/exceptions',
    requiredPermission: 'protocol.exception.view',
    defaultSize: { w: 4, h: 2 },
    refreshSeconds: 120,
    supportsFilters: true,
    description: 'Exceptions I requested or need to approve'
  },
  {
    code: 'my-violations',
    name: 'My Violations',
    module: 'protocol',
    type: 'list',
    dataEndpoint: '/api/v1/protocol/my/violations',
    requiredPermission: 'protocol.violation.view',
    defaultSize: { w: 4, h: 2 },
    refreshSeconds: 120,
    supportsFilters: true,
    description: 'Violations assigned to me'
  },
  {
    code: 'my-compliance-score',
    name: 'My Compliance Score',
    module: 'accountability',
    type: 'kpi',
    dataEndpoint: '/api/v1/acc/me/score',
    requiredPermission: 'acc.score.view',
    defaultSize: { w: 3, h: 2 },
    refreshSeconds: 3600,
    supportsFilters: false,
    description: 'My personal compliance score'
  },
  {
    code: 'planned-vs-actual',
    name: 'Planned vs Actual',
    module: 'protocol',
    type: 'chart',
    dataEndpoint: '/api/v1/protocol/my/planned-vs-actual',
    requiredPermission: 'protocol.view',
    defaultSize: { w: 6, h: 3 },
    refreshSeconds: 300,
    supportsFilters: true,
    description: 'Planned vs actual progress for my scope'
  },
  {
    code: 'recent-records',
    name: 'Recent Records',
    module: 'core',
    type: 'list',
    dataEndpoint: '/api/v1/core/my/recent',
    requiredPermission: 'core.view',
    defaultSize: { w: 4, h: 3 },
    refreshSeconds: 60,
    supportsFilters: false,
    description: 'Recently viewed or modified records'
  },
  {
    code: 'quick-actions',
    name: 'Quick Actions',
    module: 'core',
    type: 'custom',
    dataEndpoint: '',
    requiredPermission: 'core.view',
    defaultSize: { w: 4, h: 2 },
    refreshSeconds: 0,
    supportsFilters: false,
    description: 'Quick action buttons for common tasks'
  }
];

// KPI Registry
export const kpiRegistry: KPI[] = [
  {
    code: 'compliance-score',
    name: 'Compliance Score',
    formulaDescription: 'Weighted average of on-time completion, quality, protocol compliance, minus exceptions and violations',
    unit: '%',
    dataLabel: 'calculated',
    sourceEndpoint: '/api/v1/acc/me/score',
    thresholds: { red: 70, amber: 85, green: 90 },
    direction: 'higher_better',
    ownerModule: 'accountability',
    currentValue: 92,
    previousValue: 89,
    trend: [85, 87, 89, 90, 91, 92],
    asOf: '2026-01-15T10:00:00Z',
    drillLink: '/accountability/scores'
  },
  {
    code: 'pending-approvals',
    name: 'Pending Approvals',
    formulaDescription: 'Count of workflow tasks assigned to me with status pending',
    unit: 'count',
    dataLabel: 'actual',
    sourceEndpoint: '/api/v1/wf/my/tasks/count',
    thresholds: { red: 10, amber: 5, green: 0 },
    direction: 'lower_better',
    ownerModule: 'workflow',
    currentValue: 3,
    previousValue: 5,
    trend: [8, 7, 6, 5, 4, 3],
    asOf: '2026-01-15T10:00:00Z',
    drillLink: '/workflow/my-approvals'
  },
  {
    code: 'overdue-tasks',
    name: 'Overdue Tasks',
    formulaDescription: 'Count of tasks with due date in the past and status not completed',
    unit: 'count',
    dataLabel: 'actual',
    sourceEndpoint: '/api/v1/tasks/my/overdue/count',
    thresholds: { red: 5, amber: 2, green: 0 },
    direction: 'lower_better',
    ownerModule: 'tasks',
    currentValue: 1,
    previousValue: 2,
    trend: [4, 3, 3, 2, 2, 1],
    asOf: '2026-01-15T10:00:00Z',
    drillLink: '/tasks/overdue'
  },
  {
    code: 'open-exceptions',
    name: 'Open Exceptions',
    formulaDescription: 'Count of exceptions with status submitted or approved but not consumed',
    unit: 'count',
    dataLabel: 'actual',
    sourceEndpoint: '/api/v1/protocol/my/exceptions/count',
    thresholds: { red: 5, amber: 3, green: 0 },
    direction: 'lower_better',
    ownerModule: 'protocol',
    currentValue: 2,
    previousValue: 3,
    trend: [5, 4, 4, 3, 3, 2],
    asOf: '2026-01-15T10:00:00Z',
    drillLink: '/protocol/my-exceptions'
  },
  {
    code: 'active-violations',
    name: 'Active Violations',
    formulaDescription: 'Count of violations with status open or acknowledged',
    unit: 'count',
    dataLabel: 'actual',
    sourceEndpoint: '/api/v1/protocol/my/violations/count',
    thresholds: { red: 3, amber: 1, green: 0 },
    direction: 'lower_better',
    ownerModule: 'protocol',
    currentValue: 0,
    previousValue: 1,
    trend: [2, 2, 1, 1, 1, 0],
    asOf: '2026-01-15T10:00:00Z',
    drillLink: '/protocol/my-violations'
  },
  {
    code: 'project-progress',
    name: 'Project Progress',
    formulaDescription: 'Weighted average of milestone completion for my allocated projects',
    unit: '%',
    dataLabel: 'calculated',
    sourceEndpoint: '/api/v1/org/my/projects/progress',
    thresholds: { red: 60, amber: 80, green: 95 },
    direction: 'higher_better',
    ownerModule: 'organization',
    currentValue: 87,
    previousValue: 85,
    trend: [75, 78, 80, 83, 85, 87],
    asOf: '2026-01-15T10:00:00Z',
    drillLink: '/organization/my-projects'
  }
];

// Default Layouts by Role
export const defaultLayouts: Record<string, Layout> = {
  'project_manager': {
    ownerType: 'role',
    ownerId: 'role_pm',
    name: 'Project Manager Default',
    isDefault: true,
    device: 'desktop',
    widgets: [
      { widgetCode: 'my-approvals', x: 0, y: 0, w: 4, h: 3 },
      { widgetCode: 'my-compliance-score', x: 4, y: 0, w: 3, h: 2 },
      { widgetCode: 'pending-approvals', x: 7, y: 0, w: 3, h: 2 },
      { widgetCode: 'my-tasks', x: 4, y: 2, w: 4, h: 3 },
      { widgetCode: 'overdue-tasks', x: 8, y: 2, w: 2, h: 2 },
      { widgetCode: 'my-projects', x: 0, y: 3, w: 6, h: 3 },
      { widgetCode: 'my-gates-today', x: 6, y: 5, w: 4, h: 3 },
      { widgetCode: 'quick-actions', x: 0, y: 6, w: 4, h: 2 },
      { widgetCode: 'my-notifications', x: 4, y: 6, w: 4, h: 2 }
    ]
  },
  'site_engineer': {
    ownerType: 'role',
    ownerId: 'role_se',
    name: 'Site Engineer Default',
    isDefault: true,
    device: 'desktop',
    widgets: [
      { widgetCode: 'my-tasks', x: 0, y: 0, w: 4, h: 3 },
      { widgetCode: 'my-compliance-score', x: 4, y: 0, w: 3, h: 2 },
      { widgetCode: 'my-gates-today', x: 7, y: 0, w: 3, h: 3 },
      { widgetCode: 'my-sites', x: 0, y: 3, w: 6, h: 3 },
      { widgetCode: 'planned-vs-actual', x: 6, y: 3, w: 4, h: 3 },
      { widgetCode: 'quick-actions', x: 0, y: 6, w: 4, h: 2 },
      { widgetCode: 'my-notifications', x: 4, y: 6, w: 4, h: 2 }
    ]
  },
  'management': {
    ownerType: 'role',
    ownerId: 'role_mgmt',
    name: 'Management Default',
    isDefault: true,
    device: 'desktop',
    widgets: [
      { widgetCode: 'my-compliance-score', x: 0, y: 0, w: 3, h: 2 },
      { widgetCode: 'project-progress', x: 3, y: 0, w: 3, h: 2 },
      { widgetCode: 'pending-approvals', x: 6, y: 0, w: 3, h: 2 },
      { widgetCode: 'open-exceptions', x: 9, y: 0, w: 3, h: 2 },
      { widgetCode: 'my-approvals', x: 0, y: 2, w: 6, h: 3 },
      { widgetCode: 'my-projects', x: 6, y: 2, w: 6, h: 3 },
      { widgetCode: 'my-violations', x: 0, y: 5, w: 4, h: 2 },
      { widgetCode: 'my-exceptions', x: 4, y: 5, w: 4, h: 2 },
      { widgetCode: 'my-notifications', x: 8, y: 5, w: 4, h: 2 }
    ]
  }
};

// Sample Widget Data
export const widgetData = {
  'my-approvals': [
    { id: '1', title: 'PO-2026-0143', type: 'Purchase Order', amount: 850000, submittedBy: 'Vikram Singh', dueDate: '2026-01-16', priority: 'high' },
    { id: '2', title: 'SCB-2026-0035', type: 'Subcontract Bill', amount: 1200000, submittedBy: 'Amit Patel', dueDate: '2026-01-17', priority: 'medium' },
    { id: '3', title: 'PAY-2026-0091', type: 'Payment', amount: 450000, submittedBy: 'Priya Sharma', dueDate: '2026-01-18', priority: 'low' }
  ],
  'my-tasks': [
    { id: '1', title: 'Review material requisition MR-2026-0257', project: 'Riverside Tower', dueDate: '2026-01-16', status: 'pending' },
    { id: '2', title: 'Approve site instruction SI-2026-046', project: 'Highway Bridge', dueDate: '2026-01-17', status: 'in_progress' },
    { id: '3', title: 'Complete daily progress report', project: 'Riverside Tower', dueDate: '2026-01-15', status: 'overdue' }
  ],
  'my-notifications': [
    { id: '1', title: 'New approval assigned', message: 'PO-2026-0143 requires your approval', time: '2 hours ago', read: false, type: 'action' },
    { id: '2', title: 'Exception approved', message: 'Your exception EXC-2026-003 has been approved', time: '5 hours ago', read: true, type: 'info' },
    { id: '3', title: 'Task overdue', message: 'Task "Complete DPR" is now overdue', time: '1 day ago', read: true, type: 'warning' }
  ],
  'my-projects': [
    { id: '1', code: 'PRJ-2025-001', name: 'Riverside Tower', client: 'Metro Developers', progress: 67, status: 'active' },
    { id: '2', code: 'PRJ-2025-002', name: 'Highway Bridge Phase 2', client: 'NHAI', progress: 45, status: 'active' }
  ],
  'my-sites': [
    { id: '1', code: 'SITE-RT-001', name: 'Riverside Tower - Block A', project: 'Riverside Tower', status: 'active' },
    { id: '2', code: 'SITE-RT-002', name: 'Riverside Tower - Block B', project: 'Riverside Tower', status: 'active' }
  ],
  'my-gates-today': [
    { id: '1', gate: 'Material Issue', status: 'pending', item: 'Steel TMT 16mm', quantity: '5 MT', site: 'Block A' },
    { id: '2', gate: 'Work Authorization', status: 'approved', item: 'Concrete Pour - Footing F12', quantity: '25 cum', site: 'Block A' },
    { id: '3', gate: 'Quality Check', status: 'pending', item: 'Rebar Inspection - Column C3', quantity: '12 bars', site: 'Block B' }
  ],
  'my-exceptions': [
    { id: '1', code: 'EXC-2026-003', type: 'material_excess', status: 'approved', value: '2.5 MT', project: 'Riverside Tower' },
    { id: '2', code: 'EXC-2026-004', type: 'budget_overrun', status: 'submitted', value: '8%', project: 'Highway Bridge' }
  ],
  'my-violations': [
    { id: '1', code: 'VIOL-2026-002', severity: 'medium', description: 'SLA breach on approval', project: 'Riverside Tower', status: 'acknowledged' }
  ],
  'recent-records': [
    { id: '1', type: 'Purchase Order', number: 'PO-2026-0142', action: 'viewed', time: '10 minutes ago' },
    { id: '2', type: 'Goods Receipt', number: 'GRN-2026-0234', action: 'created', time: '2 hours ago' },
    { id: '3', type: 'Payment', number: 'PAY-2026-0089', action: 'approved', time: '1 day ago' }
  ]
};

// Quick Actions
export const quickActions: QuickAction[] = [
  { code: 'create-po', label: 'Create PO', icon: '📦', permission: 'mat.po.create', action: '/materials/po/new', color: 'blue' },
  { code: 'create-pr', label: 'Create PR', icon: '📋', permission: 'mat.pr.create', action: '/materials/pr/new', color: 'green' },
  { code: 'create-grn', label: 'Create GRN', icon: '📥', permission: 'mat.grn.create', action: '/materials/grn/new', color: 'purple' },
  { code: 'create-invoice', label: 'Create Invoice', icon: '🧾', permission: 'fin.invoice.create', action: '/finance/invoice/new', color: 'amber' },
  { code: 'request-exception', label: 'Request Exception', icon: '⚠️', permission: 'protocol.exception.request', action: '/protocol/exception/new', color: 'red' }
];

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-DASH-01',
    stage: 'VERIFY',
    control: 'Every KPI widget declares data label, formula, threshold and drill path',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const dashboardStats = {
  totalWidgets: widgetRegistry.length,
  totalKPIs: kpiRegistry.length,
  defaultLayouts: Object.keys(defaultLayouts).length,
  activeQuickActions: quickActions.length
};
