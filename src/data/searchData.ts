// Part 17 — Global Search & Command Center Data

export interface SearchDocument {
  id: string;
  entityType: string;
  entityId: string;
  companyId: string;
  projectId?: string;
  siteId?: string;
  departmentId?: string;
  ownerId: string;
  title: string;
  subtitle?: string;
  bodyText: string;
  keywords: string[];
  status: string;
  docDate: string;
  aclTags: string[];
  updatedAt: string;
  route: string;
  icon: string;
  module: string;
}

export interface RecentSearch {
  id: string;
  userId: string;
  entityType: string;
  entityId: string;
  title: string;
  viewedAt: string;
  route: string;
  icon: string;
}

export interface Favourite {
  id: string;
  userId: string;
  entityType: string;
  entityId: string;
  title: string;
  pinnedModuleCode?: string;
  position: number;
  addedAt: string;
  route: string;
  icon: string;
}

export interface CommandAction {
  code: string;
  label: string;
  module: string;
  permissionKey: string;
  route: string;
  contextEntityTypes: string[];
  shortcut?: string;
  icon: string;
}

export interface SearchSynonym {
  id: string;
  term: string;
  synonyms: string[];
  createdBy: string;
  createdAt: string;
}

export interface SearchAnalytics {
  query: string;
  count: number;
  zeroResults: boolean;
  lastSearched: string;
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
  highlights: string[];
}

// Sample Search Documents
export const searchDocuments: SearchDocument[] = [
  {
    id: 'doc_001',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    companyId: 'comp_001',
    projectId: 'prj_001',
    ownerId: 'usr_proc_001',
    title: 'PO-2026-0142',
    subtitle: 'Tata Steel Ltd.',
    bodyText: 'Purchase order for Steel TMT 16mm, 50 MT at rate 55000/MT. Delivery date 20-01-2026. Project: Riverside Tower',
    keywords: ['steel', 'tmt', 'purchase', 'order', 'tata'],
    status: 'approved',
    docDate: '2026-01-15',
    aclTags: ['company:comp_001', 'project:prj_001'],
    updatedAt: '2026-01-15T11:30:00Z',
    route: '/materials/po/po_2026_0142',
    icon: '📦',
    module: 'materials'
  },
  {
    id: 'doc_002',
    entityType: 'Vendor',
    entityId: 'vend_001',
    companyId: 'comp_001',
    ownerId: 'usr_proc_001',
    title: 'Tata Steel Ltd.',
    subtitle: 'VND-TATA-STEEL',
    bodyText: 'Vendor code: VND-TATA-STEEL, GSTIN: 27AABCT1234A1Z5, PAN: AABCT1234A, Type: Supplier, Rating: 4.5',
    keywords: ['tata', 'steel', 'vendor', 'supplier'],
    status: 'active',
    docDate: '2025-01-01',
    aclTags: ['company:comp_001'],
    updatedAt: '2026-01-10T00:00:00Z',
    route: '/masters/vendor/vend_001',
    icon: '🏭',
    module: 'mdm'
  },
  {
    id: 'doc_003',
    entityType: 'Project',
    entityId: 'prj_001',
    companyId: 'comp_001',
    ownerId: 'usr_pm_001',
    title: 'Riverside Tower - Phase II',
    subtitle: 'PRJ-2025-001',
    bodyText: 'Project code: PRJ-2025-001, Client: Metro Developers Pvt. Ltd., Type: Building, Status: Active, Progress: 67%',
    keywords: ['riverside', 'tower', 'project', 'building'],
    status: 'active',
    docDate: '2025-06-01',
    aclTags: ['company:comp_001', 'project:prj_001'],
    updatedAt: '2026-01-15T00:00:00Z',
    route: '/projects/prj_001',
    icon: '🏗️',
    module: 'organization'
  },
  {
    id: 'doc_004',
    entityType: 'Material',
    entityId: 'mat_001',
    companyId: 'comp_001',
    ownerId: 'usr_mdm_001',
    title: 'Steel TMT 16mm',
    subtitle: 'MAT-STEEL-16MM',
    bodyText: 'Material code: MAT-STEEL-16MM, Group: Steel, HSN: 7214, GST: 18%, Base UOM: MT, Stock Item: Yes',
    keywords: ['steel', 'tmt', '16mm', 'material', 'reinforcement'],
    status: 'active',
    docDate: '2025-01-01',
    aclTags: ['company:comp_001'],
    updatedAt: '2026-01-10T00:00:00Z',
    route: '/masters/material/mat_001',
    icon: '🔩',
    module: 'mdm'
  },
  {
    id: 'doc_005',
    entityType: 'Employee',
    entityId: 'emp_001',
    companyId: 'comp_001',
    projectId: 'prj_001',
    siteId: 'site_001',
    ownerId: 'usr_hr_001',
    title: 'Rahul Mehta',
    subtitle: 'EMP-001, Site Engineer',
    bodyText: 'Employee code: EMP-001, Name: Rahul Mehta, Designation: Site Engineer, Project: Riverside Tower, Site: Block A',
    keywords: ['rahul', 'mehta', 'engineer', 'site'],
    status: 'active',
    docDate: '2025-01-01',
    aclTags: ['company:comp_001', 'project:prj_001', 'site:site_001'],
    updatedAt: '2026-01-15T00:00:00Z',
    route: '/hr/employee/emp_001',
    icon: '👷',
    module: 'hr'
  },
  {
    id: 'doc_006',
    entityType: 'GoodsReceipt',
    entityId: 'grn_2026_0234',
    companyId: 'comp_001',
    projectId: 'prj_001',
    siteId: 'site_001',
    ownerId: 'usr_store_001',
    title: 'GRN-2026-0234',
    subtitle: 'PO-2026-0140, Steel TMT 16mm',
    bodyText: 'Goods receipt for PO-2026-0140, Material: Steel TMT 16mm, Received: 50 MT, Accepted: 49.5 MT, Rejected: 0.5 MT',
    keywords: ['grn', 'goods', 'receipt', 'steel'],
    status: 'posted',
    docDate: '2026-01-15',
    aclTags: ['company:comp_001', 'project:prj_001', 'site:site_001'],
    updatedAt: '2026-01-15T14:30:00Z',
    route: '/materials/grn/grn_2026_0234',
    icon: '📥',
    module: 'materials'
  },
  {
    id: 'doc_007',
    entityType: 'Payment',
    entityId: 'pay_2026_0089',
    companyId: 'comp_001',
    projectId: 'prj_001',
    ownerId: 'usr_acct_001',
    title: 'PAY-2026-0089',
    subtitle: '₹18,75,000 to Tata Steel',
    bodyText: 'Payment of 1875000 to vendor Tata Steel Ltd. for invoice INV-2025-045. Status: Pending Approval',
    keywords: ['payment', 'tata', 'steel', '1875000'],
    status: 'pending_approval',
    docDate: '2026-01-15',
    aclTags: ['company:comp_001', 'project:prj_001'],
    updatedAt: '2026-01-15T15:00:00Z',
    route: '/finance/payment/pay_2026_0089',
    icon: '💰',
    module: 'finance'
  },
  {
    id: 'doc_008',
    entityType: 'Task',
    entityId: 'task_001',
    companyId: 'comp_001',
    projectId: 'prj_001',
    ownerId: 'usr_pm_001',
    title: 'Review material requisition MR-2026-0257',
    subtitle: 'Assigned to Rajesh Kumar',
    bodyText: 'Task: Review material requisition MR-2026-0257, Project: Riverside Tower, Due: 2026-01-16, Status: Pending',
    keywords: ['task', 'review', 'material', 'requisition'],
    status: 'pending',
    docDate: '2026-01-15',
    aclTags: ['company:comp_001', 'project:prj_001'],
    updatedAt: '2026-01-15T10:00:00Z',
    route: '/tasks/task_001',
    icon: '✅',
    module: 'tasks'
  },
  {
    id: 'doc_009',
    entityType: 'DailyProgressReport',
    entityId: 'dpr_2026_0115',
    companyId: 'comp_001',
    projectId: 'prj_001',
    siteId: 'site_001',
    ownerId: 'usr_eng_001',
    title: 'DPR-2026-0115',
    subtitle: 'Riverside Tower - Block A',
    bodyText: 'Daily progress report for 15-01-2026, Site: Block A, Weather: Clear, Labour: 45, Work: Foundation work',
    keywords: ['dpr', 'daily', 'progress', 'report', 'foundation'],
    status: 'submitted',
    docDate: '2026-01-15',
    aclTags: ['company:comp_001', 'project:prj_001', 'site:site_001'],
    updatedAt: '2026-01-15T17:00:00Z',
    route: '/site/dpr/dpr_2026_0115',
    icon: '📊',
    module: 'site'
  },
  {
    id: 'doc_010',
    entityType: 'WorkflowTask',
    entityId: 'wf_task_001',
    companyId: 'comp_001',
    ownerId: 'usr_pm_001',
    title: 'Approve PO-2026-0143',
    subtitle: 'Purchase Order - Cement Materials',
    bodyText: 'Workflow task: Approve PO-2026-0143, Type: Purchase Order, Amount: 850000, Submitted by: Vikram Singh, Due: 2026-01-16',
    keywords: ['approve', 'po', 'purchase', 'order', 'cement'],
    status: 'pending',
    docDate: '2026-01-15',
    aclTags: ['company:comp_001'],
    updatedAt: '2026-01-15T10:00:00Z',
    route: '/workflow/approvals/wf_task_001',
    icon: '✓',
    module: 'workflow'
  }
];

// Recent Searches
export const recentSearches: RecentSearch[] = [
  {
    id: 'recent_001',
    userId: 'usr_pm_001',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    title: 'PO-2026-0142',
    viewedAt: '2026-01-15T14:30:00Z',
    route: '/materials/po/po_2026_0142',
    icon: '📦'
  },
  {
    id: 'recent_002',
    userId: 'usr_pm_001',
    entityType: 'Project',
    entityId: 'prj_001',
    title: 'Riverside Tower - Phase II',
    viewedAt: '2026-01-15T13:00:00Z',
    route: '/projects/prj_001',
    icon: '🏗️'
  },
  {
    id: 'recent_003',
    userId: 'usr_pm_001',
    entityType: 'Vendor',
    entityId: 'vend_001',
    title: 'Tata Steel Ltd.',
    viewedAt: '2026-01-15T11:00:00Z',
    route: '/masters/vendor/vend_001',
    icon: '🏭'
  },
  {
    id: 'recent_004',
    userId: 'usr_pm_001',
    entityType: 'Material',
    entityId: 'mat_001',
    title: 'Steel TMT 16mm',
    viewedAt: '2026-01-15T10:00:00Z',
    route: '/masters/material/mat_001',
    icon: '🔩'
  },
  {
    id: 'recent_005',
    userId: 'usr_pm_001',
    entityType: 'Payment',
    entityId: 'pay_2026_0089',
    title: 'PAY-2026-0089',
    viewedAt: '2026-01-15T09:00:00Z',
    route: '/finance/payment/pay_2026_0089',
    icon: '💰'
  }
];

// Favourites
export const favourites: Favourite[] = [
  {
    id: 'fav_001',
    userId: 'usr_pm_001',
    entityType: 'Project',
    entityId: 'prj_001',
    title: 'Riverside Tower - Phase II',
    position: 1,
    addedAt: '2026-01-10T00:00:00Z',
    route: '/projects/prj_001',
    icon: '🏗️'
  },
  {
    id: 'fav_002',
    userId: 'usr_pm_001',
    entityType: 'Vendor',
    entityId: 'vend_001',
    title: 'Tata Steel Ltd.',
    position: 2,
    addedAt: '2026-01-12T00:00:00Z',
    route: '/masters/vendor/vend_001',
    icon: '🏭'
  },
  {
    id: 'fav_003',
    userId: 'usr_pm_001',
    entityType: 'Material',
    entityId: 'mat_001',
    title: 'Steel TMT 16mm',
    position: 3,
    addedAt: '2026-01-14T00:00:00Z',
    route: '/masters/material/mat_001',
    icon: '🔩'
  }
];

// Command Actions
export const commandActions: CommandAction[] = [
  {
    code: 'create-po',
    label: 'Create Purchase Order',
    module: 'materials',
    permissionKey: 'mat.po.create',
    route: '/materials/po/new',
    contextEntityTypes: ['Project', 'Vendor'],
    shortcut: 'Ctrl+Shift+P',
    icon: '📦'
  },
  {
    code: 'create-pr',
    label: 'Create Material Request',
    module: 'materials',
    permissionKey: 'mat.pr.create',
    route: '/materials/pr/new',
    contextEntityTypes: ['Project', 'Material'],
    shortcut: 'Ctrl+Shift+R',
    icon: '📋'
  },
  {
    code: 'create-grn',
    label: 'Create Goods Receipt',
    module: 'materials',
    permissionKey: 'mat.grn.create',
    route: '/materials/grn/new',
    contextEntityTypes: ['PurchaseOrder'],
    shortcut: 'Ctrl+Shift+G',
    icon: '📥'
  },
  {
    code: 'create-invoice',
    label: 'Create Invoice',
    module: 'finance',
    permissionKey: 'fin.invoice.create',
    route: '/finance/invoice/new',
    contextEntityTypes: ['Project', 'Client'],
    shortcut: 'Ctrl+Shift+I',
    icon: '🧾'
  },
  {
    code: 'create-payment',
    label: 'Create Payment',
    module: 'finance',
    permissionKey: 'fin.payment.create',
    route: '/finance/payment/new',
    contextEntityTypes: ['Invoice', 'Vendor'],
    shortcut: 'Ctrl+Shift+Y',
    icon: '💰'
  },
  {
    code: 'request-exception',
    label: 'Request Exception',
    module: 'protocol',
    permissionKey: 'protocol.exception.request',
    route: '/protocol/exception/new',
    contextEntityTypes: ['PurchaseOrder', 'GoodsReceipt', 'Payment'],
    shortcut: 'Ctrl+Shift+E',
    icon: '⚠️'
  },
  {
    code: 'approve-pending',
    label: 'Approve Pending Items',
    module: 'workflow',
    permissionKey: 'wf.task.approve',
    route: '/workflow/approvals',
    contextEntityTypes: [],
    shortcut: 'Ctrl+Shift+A',
    icon: '✓'
  },
  {
    code: 'view-reports',
    label: 'View Reports',
    module: 'reports',
    permissionKey: 'report.view',
    route: '/reports',
    contextEntityTypes: [],
    shortcut: 'Ctrl+Shift+O',
    icon: '📈'
  }
];

// Search Synonyms
export const searchSynonyms: SearchSynonym[] = [
  {
    id: 'syn_001',
    term: 'TMT',
    synonyms: ['reinforcement steel', 'steel bar', 'saria'],
    createdBy: 'usr_admin_001',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'syn_002',
    term: 'PO',
    synonyms: ['purchase order', 'order'],
    createdBy: 'usr_admin_001',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'syn_003',
    term: 'GRN',
    synonyms: ['goods receipt', 'receipt note', 'material receipt'],
    createdBy: 'usr_admin_001',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'syn_004',
    term: 'DPR',
    synonyms: ['daily progress report', 'daily report', 'site report'],
    createdBy: 'usr_admin_001',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// Search Analytics
export const searchAnalytics: SearchAnalytics[] = [
  { query: 'steel', count: 145, zeroResults: false, lastSearched: '2026-01-15T14:00:00Z' },
  { query: 'tata', count: 89, zeroResults: false, lastSearched: '2026-01-15T13:00:00Z' },
  { query: 'riverside', count: 67, zeroResults: false, lastSearched: '2026-01-15T12:00:00Z' },
  { query: 'po-2026', count: 45, zeroResults: false, lastSearched: '2026-01-15T11:00:00Z' },
  { query: 'cement', count: 34, zeroResults: false, lastSearched: '2026-01-15T10:00:00Z' },
  { query: 'xyz123', count: 12, zeroResults: true, lastSearched: '2026-01-15T09:00:00Z' },
  { query: 'abc456', count: 8, zeroResults: true, lastSearched: '2026-01-14T16:00:00Z' }
];

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-SRCH-01',
    stage: 'VERIFY',
    control: 'Search results never reveal existence of records outside scope (including exception/finding records)',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const searchStats = {
  totalDocuments: searchDocuments.length,
  totalRecentSearches: recentSearches.length,
  totalFavourites: favourites.length,
  totalCommandActions: commandActions.length,
  totalSynonyms: searchSynonyms.length,
  zeroResultQueries: searchAnalytics.filter(a => a.zeroResults).length,
  avgSearchesPerDay: 125
};

// Search Facets
export const searchFacets = {
  modules: [
    { code: 'materials', label: 'Materials', count: 3 },
    { code: 'mdm', label: 'Master Data', count: 2 },
    { code: 'organization', label: 'Organization', count: 1 },
    { code: 'hr', label: 'HR', count: 1 },
    { code: 'finance', label: 'Finance', count: 1 },
    { code: 'tasks', label: 'Tasks', count: 1 },
    { code: 'site', label: 'Site', count: 1 },
    { code: 'workflow', label: 'Workflow', count: 1 }
  ],
  statuses: [
    { code: 'active', label: 'Active', count: 5 },
    { code: 'approved', label: 'Approved', count: 1 },
    { code: 'pending', label: 'Pending', count: 2 },
    { code: 'posted', label: 'Posted', count: 1 },
    { code: 'submitted', label: 'Submitted', count: 1 }
  ],
  entityTypes: [
    { code: 'PurchaseOrder', label: 'Purchase Orders', count: 1 },
    { code: 'Vendor', label: 'Vendors', count: 1 },
    { code: 'Project', label: 'Projects', count: 1 },
    { code: 'Material', label: 'Materials', count: 1 },
    { code: 'Employee', label: 'Employees', count: 1 },
    { code: 'GoodsReceipt', label: 'Goods Receipts', count: 1 },
    { code: 'Payment', label: 'Payments', count: 1 },
    { code: 'Task', label: 'Tasks', count: 1 },
    { code: 'DailyProgressReport', label: 'DPRs', count: 1 },
    { code: 'WorkflowTask', label: 'Workflow Tasks', count: 1 }
  ]
};
