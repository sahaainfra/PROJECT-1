// Part 2 — Audit & Architecture Discovery Data
// Read-only inventory of the existing Construction ERP system

export const stackInfo = {
  frontend: { framework: 'React 18', ui: 'Tailwind CSS + Headless UI', state: 'Redux Toolkit', build: 'Vite 5', mobile: 'React Native (Expo)' },
  backend: { framework: 'Node.js 20 + Express', orm: 'Prisma 5', realtime: 'Socket.IO 4', queue: 'BullMQ + Redis', cache: 'Redis 7' },
  database: { engine: 'PostgreSQL 15', migrations: 'Prisma Migrate', search: '—', storage: 'AWS S3 (presigned URLs)' },
  auth: { method: 'JWT + Refresh Tokens', mfa: 'TOTP (optional)', passwordPolicy: 'Min 8 chars, complexity required', session: 'Stateless JWT, 15min access / 7d refresh' },
  deployment: { ci: 'GitHub Actions', staging: 'AWS ECS Fargate', production: 'AWS ECS Fargate', environments: ['dev', 'staging', 'production'] },
  monitoring: { logging: 'Winston → CloudWatch', apm: 'Datadog APM', errorTracking: 'Sentry', uptime: 'Pingdom' },
  tests: { unit: 'Jest + Vitest', integration: 'Supertest', e2e: 'Playwright', coverage: '62%' },
};

export interface ModuleInventory {
  id: string;
  name: string;
  routes: number;
  screens: number;
  tables: number;
  apis: number;
  status: 'working' | 'partial' | 'broken' | 'missing';
  coverage: number;
  notes: string;
  programParts: string;
}

export const moduleInventory: ModuleInventory[] = [
  { id: 'auth', name: 'Authentication & Users', routes: 8, screens: 4, tables: 5, apis: 12, status: 'working', coverage: 95, notes: 'JWT auth, role-based access, basic CRUD. No MFA enforcement.', programParts: 'Part 5' },
  { id: 'company', name: 'Company / Organization', routes: 4, screens: 3, tables: 3, apis: 6, status: 'working', coverage: 85, notes: 'Single-company setup. Multi-tenant scaffolding exists but unused.', programParts: 'Part 4' },
  { id: 'project', name: 'Project Management', routes: 12, screens: 8, tables: 8, apis: 18, status: 'working', coverage: 70, notes: 'Basic project CRUD, WBS exists but no BOQ integration. Budget module incomplete.', programParts: 'Part 16-25' },
  { id: 'material', name: 'Material / Inventory', routes: 15, screens: 10, tables: 12, apis: 22, status: 'partial', coverage: 55, notes: 'PR/PO/GRN flow exists but 3-way match is UI-only. Stock valuation uses FIFO but no revaluation.', programParts: 'Part 26-40' },
  { id: 'vendor', name: 'Vendor Management', routes: 6, screens: 4, tables: 4, apis: 8, status: 'working', coverage: 60, notes: 'Vendor master exists. No performance scoring, no blacklist workflow.', programParts: 'Part 27' },
  { id: 'subcontract', name: 'Subcontracts', routes: 8, screens: 6, tables: 6, apis: 10, status: 'partial', coverage: 45, notes: 'Subcontract creation works. RA billing has no retention tracking. WO linkage missing.', programParts: 'Part 41-55' },
  { id: 'finance', name: 'Finance / Accounts', routes: 10, screens: 7, tables: 9, apis: 14, status: 'partial', coverage: 40, notes: 'AP/AR basic entries exist. No posting engine, no reconciliation, GST computation is hardcoded.', programParts: 'Part 56-70' },
  { id: 'billing', name: 'Client Billing', routes: 5, screens: 4, tables: 4, apis: 7, status: 'partial', coverage: 50, notes: 'Invoice generation works. No milestone-based billing, retention deduction manual.', programParts: 'Part 58' },
  { id: 'hr', name: 'HR / Payroll', routes: 8, screens: 6, tables: 7, apis: 11, status: 'partial', coverage: 35, notes: 'Employee master exists. Attendance is manual entry. Payroll calculation is spreadsheet-based.', programParts: 'Part 71-85' },
  { id: 'equipment', name: 'Equipment / Plant', routes: 5, screens: 3, tables: 4, apis: 6, status: 'partial', coverage: 30, notes: 'Equipment register exists. No maintenance scheduling, no utilisation tracking.', programParts: 'Part 86-95' },
  { id: 'quality', name: 'Quality (QA/QC)', routes: 4, screens: 3, tables: 3, apis: 5, status: 'broken', coverage: 15, notes: 'Inspection templates exist but workflow is broken. NCR module not connected.', programParts: 'Part 92-94' },
  { id: 'safety', name: 'Health & Safety', routes: 3, screens: 2, tables: 2, apis: 4, status: 'broken', coverage: 10, notes: 'Incident form exists. No near-miss reporting, no toolbox talk tracking.', programParts: 'Part 90-91' },
  { id: 'report', name: 'Reports', routes: 6, screens: 5, tables: 0, apis: 8, status: 'partial', coverage: 45, notes: '12 hardcoded reports. No dynamic report builder. PDF generation uses puppeteer.', programParts: 'Part 96-109' },
  { id: 'document', name: 'Document Management', routes: 4, screens: 3, tables: 3, apis: 5, status: 'working', coverage: 55, notes: 'S3 upload/download works. No versioning, no approval workflow on documents.', programParts: 'Part 10' },
  { id: 'notification', name: 'Notifications', routes: 3, screens: 2, tables: 2, apis: 4, status: 'partial', coverage: 25, notes: 'In-app notifications exist. Email via SendGrid. No SMS, no preferences, no dedup.', programParts: 'Part 3 (shared)' },
  { id: 'settings', name: 'System Settings', routes: 5, screens: 4, tables: 3, apis: 6, status: 'working', coverage: 70, notes: 'Basic config screen. No feature flags, no audit config, no approval matrix UI.', programParts: 'Part 110' },
];

export interface DBEntity {
  targetEntity: string;
  existingTable: string;
  existingColumns: string;
  decision: 'REUSE' | 'EXTEND' | 'NEW';
  notes: string;
  rowCount: number;
}

export const dbEntityMap: DBEntity[] = [
  { targetEntity: 'users', existingTable: 'users', existingColumns: 'id, email, name, role_id, company_id, status, created_at', decision: 'EXTEND', notes: 'Add MFA fields, last_login, password_version. Existing role_id links to legacy roles.', rowCount: 234 },
  { targetEntity: 'roles', existingTable: 'roles', existingColumns: 'id, name, description, is_system', decision: 'EXTEND', notes: 'Legacy flat roles. Need hierarchy + scope levels for Part 5.', rowCount: 12 },
  { targetEntity: 'companies', existingTable: 'companies', existingColumns: 'id, name, gstin, address, status', decision: 'REUSE', notes: 'Clean table, no changes needed.', rowCount: 3 },
  { targetEntity: 'projects', existingTable: 'projects', existingColumns: 'id, code, name, company_id, client_id, start_date, end_date, status, budget', decision: 'EXTEND', notes: 'Add location, latitude/longitude, project_type, phase. Budget field is single value — needs BOQ link.', rowCount: 47 },
  { targetEntity: 'wbs', existingTable: 'project_wbs', existingColumns: 'id, project_id, parent_id, code, name, level', decision: 'REUSE', notes: 'Tree structure works. No BOQ linkage yet.', rowCount: 892 },
  { targetEntity: 'boq_items', existingTable: '—', existingColumns: '—', decision: 'NEW', notes: 'No BOQ table exists. Must be created for Parts 16-25.', rowCount: 0 },
  { targetEntity: 'vendors', existingTable: 'vendors', existingColumns: 'id, name, gstin, pan, category, status, created_at', decision: 'EXTEND', notes: 'Add performance_score, blacklist_flag, bank_details (encrypted), contact_persons.', rowCount: 186 },
  { targetEntity: 'purchase_requests', existingTable: 'material_requests', existingColumns: 'id, project_id, requested_by, status, required_date, notes', decision: 'REUSE', notes: 'Works. Needs budget check integration (Part 28).', rowCount: 5623 },
  { targetEntity: 'purchase_orders', existingTable: 'purchase_orders', existingColumns: 'id, vendor_id, mr_id, order_date, delivery_date, status, total_amount', decision: 'EXTEND', notes: 'Add approval_workflow_id, cs_reference, gst_breakup columns.', rowCount: 3892 },
  { targetEntity: 'po_lines', existingTable: 'purchase_order_items', existingColumns: 'id, po_id, item_id, qty, rate, amount, tax_rate', decision: 'REUSE', notes: 'Clean. Tax calculation is inline — needs extraction to service.', rowCount: 18234 },
  { targetEntity: 'grn', existingTable: 'goods_receipt_notes', existingColumns: 'id, po_id, received_date, received_by, status, vehicle_no', decision: 'EXTEND', notes: 'Add quality_check_status, qty_accepted, qty_rejected. 3-way match is UI-only.', rowCount: 2156 },
  { targetEntity: 'stock', existingTable: 'inventory', existingColumns: 'id, item_id, site_id, qty, valuation_method', decision: 'EXTEND', notes: 'FIFO valuation exists but no revaluation. Add batch tracking.', rowCount: 12456 },
  { targetEntity: 'subcontracts', existingTable: 'subcontracts', existingColumns: 'id, project_id, vendor_id, wo_number, amount, start_date, end_date, status', decision: 'EXTEND', notes: 'Add retention_percent, deduction_schedule, variation_log.', rowCount: 89 },
  { targetEntity: 'ra_bills', existingTable: 'subcontract_bills', existingColumns: 'id, sub_id, bill_number, bill_date, amount, status', decision: 'EXTEND', notes: 'No retention deduction, no measurement book linkage.', rowCount: 234 },
  { targetEntity: 'invoices', existingTable: 'invoices', existingColumns: 'id, project_id, client_id, invoice_number, amount, gst_amount, status, due_date', decision: 'EXTEND', notes: 'GST split is hardcoded. Needs proper tax engine.', rowCount: 1847 },
  { targetEntity: 'payments', existingTable: 'payments', existingColumns: 'id, invoice_id, payment_date, amount, mode, reference', decision: 'EXTEND', notes: 'No maker-checker, no bank reconciliation linkage.', rowCount: 2341 },
  { targetEntity: 'journal_entries', existingTable: '—', existingColumns: '—', decision: 'NEW', notes: 'No double-entry journal. Needed for posting engine (Part 56).', rowCount: 0 },
  { targetEntity: 'employees', existingTable: 'employees', existingColumns: 'id, name, emp_code, department_id, designation, joining_date, status', decision: 'REUSE', notes: 'Clean. Add bank_details (encrypted), uan, pf_number.', rowCount: 342 },
  { targetEntity: 'attendance', existingTable: 'attendance', existingColumns: 'id, employee_id, date, status, hours', decision: 'EXTEND', notes: 'Manual entry only. Needs biometric/GPS integration.', rowCount: 45678 },
  { targetEntity: 'equipment', existingTable: 'equipment', existingColumns: 'id, name, type, registration_no, status, site_id', decision: 'EXTEND', notes: 'Add maintenance_schedule, utilisation_log, fuel_consumption.', rowCount: 234 },
  { targetEntity: 'audit_log', existingTable: 'audit_logs', existingColumns: 'id, user_id, action, table_name, record_id, old_value, new_value, created_at', decision: 'EXTEND', notes: 'Exists but missing IP, device, session_id. No field-level granularity.', rowCount: 45678 },
  { targetEntity: 'notifications', existingTable: 'notifications', existingColumns: 'id, user_id, type, title, message, read_at, created_at', decision: 'EXTEND', notes: 'Add channel (email/sms/push), preference_id, dedup_key.', rowCount: 23456 },
  { targetEntity: 'documents', existingTable: 'documents', existingColumns: 'id, name, file_key, file_type, size, uploaded_by, created_at', decision: 'EXTEND', notes: 'Add version, approval_status, entity_type, entity_id for polymorphic linking.', rowCount: 8934 },
  { targetEntity: 'feature_flags', existingTable: '—', existingColumns: '—', decision: 'NEW', notes: 'No feature flag system exists. Needed for Parts 0-126 rollout.', rowCount: 0 },
  { targetEntity: 'workflow_definitions', existingTable: '—', existingColumns: '—', decision: 'NEW', notes: 'No workflow engine. Hardcoded approvals in controllers.', rowCount: 0 },
  { targetEntity: 'protocol_checks', existingTable: '—', existingColumns: '—', decision: 'NEW', notes: 'No protocol/control engine. Needed for Part 7.', rowCount: 0 },
];

export interface APIEndpoint {
  method: string;
  path: string;
  handler: string;
  authRequired: boolean;
  permissionChecked: boolean;
  permissionMethod: string;
  consumers: string;
  module: string;
}

export const apiInventory: APIEndpoint[] = [
  { method: 'POST', path: '/api/auth/login', handler: 'AuthController.login', authRequired: false, permissionChecked: false, permissionMethod: '—', consumers: 'Web, Mobile', module: 'auth' },
  { method: 'POST', path: '/api/auth/refresh', handler: 'AuthController.refresh', authRequired: true, permissionChecked: false, permissionMethod: '—', consumers: 'Web, Mobile', module: 'auth' },
  { method: 'GET', path: '/api/users', handler: 'UserController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Admin UI', module: 'auth' },
  { method: 'GET', path: '/api/projects', handler: 'ProjectController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web, Mobile', module: 'project' },
  { method: 'POST', path: '/api/projects', handler: 'ProjectController.store', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'project' },
  { method: 'GET', path: '/api/projects/:id', handler: 'ProjectController.show', authRequired: true, permissionChecked: false, permissionMethod: '—', consumers: 'Web, Mobile', module: 'project' },
  { method: 'GET', path: '/api/material-requests', handler: 'MRController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'material' },
  { method: 'POST', path: '/api/material-requests', handler: 'MRController.store', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web, Mobile', module: 'material' },
  { method: 'POST', path: '/api/material-requests/:id/approve', handler: 'MRController.approve', authRequired: true, permissionChecked: true, permissionMethod: 'Hardcoded role check', consumers: 'Web', module: 'material' },
  { method: 'GET', path: '/api/purchase-orders', handler: 'POController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'material' },
  { method: 'POST', path: '/api/purchase-orders', handler: 'POController.store', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware + hardcoded amount limit', consumers: 'Web', module: 'material' },
  { method: 'POST', path: '/api/goods-receipt', handler: 'GRNController.store', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web, Mobile', module: 'material' },
  { method: 'GET', path: '/api/inventory', handler: 'InventoryController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'material' },
  { method: 'GET', path: '/api/subcontracts', handler: 'SubcontractController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'subcontract' },
  { method: 'POST', path: '/api/subcontract-bills', handler: 'RABillController.store', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'subcontract' },
  { method: 'GET', path: '/api/invoices', handler: 'InvoiceController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'finance' },
  { method: 'POST', path: '/api/invoices', handler: 'InvoiceController.store', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'finance' },
  { method: 'POST', path: '/api/payments', handler: 'PaymentController.store', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'finance' },
  { method: 'GET', path: '/api/employees', handler: 'EmployeeController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'hr' },
  { method: 'GET', path: '/api/attendance', handler: 'AttendanceController.index', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web, Mobile', module: 'hr' },
  { method: 'GET', path: '/api/reports/:type', handler: 'ReportController.generate', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web', module: 'report' },
  { method: 'POST', path: '/api/documents/upload', handler: 'DocumentController.upload', authRequired: true, permissionChecked: true, permissionMethod: 'Middleware (role-based)', consumers: 'Web, Mobile', module: 'document' },
  { method: 'GET', path: '/api/notifications', handler: 'NotificationController.index', authRequired: true, permissionChecked: false, permissionMethod: '—', consumers: 'Web, Mobile', module: 'notification' },
];

export interface DependencyLink {
  from: string;
  to: string;
  type: 'data' | 'api' | 'event' | 'shared_table';
  strength: 'strong' | 'moderate' | 'weak';
  notes: string;
}

export const dependencyMap: DependencyLink[] = [
  { from: 'material', to: 'project', type: 'data', strength: 'strong', notes: 'MR/PO require project_id. No budget check integration.' },
  { from: 'material', to: 'vendor', type: 'data', strength: 'strong', notes: 'PO requires vendor_id.' },
  { from: 'material', to: 'finance', type: 'api', strength: 'moderate', notes: 'PO approval triggers AP entry (manual currently).' },
  { from: 'subcontract', to: 'project', type: 'data', strength: 'strong', notes: 'Subcontract requires project_id.' },
  { from: 'subcontract', to: 'vendor', type: 'data', strength: 'strong', notes: 'Subcontract vendor = same vendor table.' },
  { from: 'subcontract', to: 'finance', type: 'api', strength: 'moderate', notes: 'RA bill approval should trigger AP entry (not connected).' },
  { from: 'finance', to: 'project', type: 'data', strength: 'moderate', notes: 'Invoices reference project for cost allocation.' },
  { from: 'billing', to: 'project', type: 'data', strength: 'strong', notes: 'Client billing per project.' },
  { from: 'billing', to: 'finance', type: 'api', strength: 'strong', notes: 'Invoice creation triggers AR entry.' },
  { from: 'hr', to: 'project', type: 'data', strength: 'weak', notes: 'Employee-site allocation exists but not enforced.' },
  { from: 'equipment', to: 'project', type: 'data', strength: 'moderate', notes: 'Equipment allocated to sites.' },
  { from: 'report', to: 'material', type: 'api', strength: 'moderate', notes: 'Stock reports query inventory directly.' },
  { from: 'report', to: 'finance', type: 'api', strength: 'moderate', notes: 'Financial reports query invoices/payments.' },
  { from: 'quality', to: 'material', type: 'event', strength: 'weak', notes: 'GRN should trigger quality check (broken).' },
  { from: 'safety', to: 'project', type: 'data', strength: 'weak', notes: 'Incidents linked to site but no workflow.' },
];

export interface GapEntry {
  part: string;
  module: string;
  existingCoverage: number;
  reusableArtifacts: string[];
  missingCapabilities: string[];
  risks: string[];
  recommendation: string;
}

export const gapMatrix: GapEntry[] = [
  { part: 'Part 3', module: 'Core Platform', existingCoverage: 30, reusableArtifacts: ['Express server', 'Prisma ORM', 'Socket.IO setup', 'Redis connection'], missingCapabilities: ['Central config service', 'Job framework', 'Shared hooks', 'Event bus'], risks: ['No standard middleware chain', 'Inconsistent error handling'], recommendation: 'EXTEND existing Express app. Add shared middleware chain.' },
  { part: 'Part 5', module: 'Permission Engine', existingCoverage: 20, reusableArtifacts: ['Role-based middleware', 'roles table'], missingCapabilities: ['Multi-scope evaluation', 'Field-level permissions', 'Permission registry', 'Deny-by-default'], risks: ['Existing checks are role-only, no scope', 'Some routes have no auth'], recommendation: 'NEW engine. Map existing roles to new permission keys.' },
  { part: 'Part 6', module: 'Workflow Engine', existingCoverage: 5, reusableArtifacts: ['Status fields in tables', 'Manual approval endpoints'], missingCapabilities: ['Workflow definitions', 'Step engine', 'Delegation', 'SLA', 'Maker-checker'], risks: ['Hardcoded approvals in controllers', 'No audit of approval chain'], recommendation: 'NEW engine. Migrate hardcoded approvals to workflow definitions.' },
  { part: 'Part 7', module: 'Protocol Engine', existingCoverage: 0, reusableArtifacts: ['—'], missingCapabilities: ['Full protocol engine', 'Control registry', 'Exception workflow', 'Ledger'], risks: ['No existing controls to build on'], recommendation: 'NEW. Seed OBSERVE controls from existing validations found in audit.' },
  { part: 'Part 16-25', module: 'Projects', existingCoverage: 70, reusableArtifacts: ['projects table', 'WBS tree', 'Project CRUD'], missingCapabilities: ['BOQ', 'Budget control', 'Earned value', 'Milestone tracking'], risks: ['Budget field is single value — no breakdown', 'No cost code structure'], recommendation: 'EXTEND. Add BOQ tables, budget breakdown, EV calculations.' },
  { part: 'Part 26-40', module: 'Materials', existingCoverage: 55, reusableArtifacts: ['MR/PO/GRN flow', 'Inventory table', 'Vendor master'], missingCapabilities: ['3-way match (server)', 'Stock valuation (revaluation)', 'Batch tracking', 'Budget integration'], risks: ['3-way match is UI-only', 'FIFO has no revaluation', 'No budget check on PO'], recommendation: 'EXTEND. Move match to service layer, add budget check hook.' },
  { part: 'Part 41-55', module: 'Subcontracts', existingCoverage: 45, reusableArtifacts: ['Subcontract CRUD', 'RA bill creation'], missingCapabilities: ['WO linkage', 'Retention tracking', 'MB measurement', 'Variation orders'], risks: ['No retention deduction', 'RA bill amount not reconciled'], recommendation: 'EXTEND. Add retention, variation, measurement tables.' },
  { part: 'Part 56-70', module: 'Finance', existingCoverage: 40, reusableArtifacts: ['Invoice/payment CRUD', 'AP/AR basic entries'], missingCapabilities: ['Posting engine', 'Double-entry journal', 'Reconciliation', 'Tax engine', 'Multi-currency'], risks: ['GST hardcoded', 'No journal entries', 'No bank reconciliation'], recommendation: 'NEW posting engine. EXTEND existing invoice/payment tables.' },
  { part: 'Part 71-85', module: 'HR/Payroll', existingCoverage: 35, reusableArtifacts: ['Employee master', 'Attendance table'], missingCapabilities: ['Biometric integration', 'Payroll calculation engine', 'Statutory compliance', 'Leave management'], risks: ['Payroll is spreadsheet-based', 'Attendance is manual'], recommendation: 'EXTEND. Build payroll engine on existing employee/attendance data.' },
  { part: 'Part 86-95', module: 'Equipment', existingCoverage: 30, reusableArtifacts: ['Equipment register'], missingCapabilities: ['Maintenance scheduling', 'Utilisation tracking', 'Fuel management', 'Cost allocation'], risks: ['No maintenance alerts', 'No cost per hour calculation'], recommendation: 'EXTEND. Add maintenance, utilisation, fuel tables.' },
  { part: 'Part 96-109', module: 'Reports/BI', existingCoverage: 45, reusableArtifacts: ['12 existing reports', 'Puppeteer PDF generation'], missingCapabilities: ['Dynamic report builder', 'Permission-filtered reports', 'Drill-down', 'Export audit'], risks: ['Hardcoded reports', 'No permission filtering on data', 'PDF generation is slow'], recommendation: 'EXTEND. Migrate to report catalogue, add permission layer.' },
];

export interface RiskEntry {
  id: string;
  category: 'data_quality' | 'performance' | 'security' | 'coupling' | 'missing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string;
  affectedParts: string[];
  mitigation: string;
}

export const riskRegister: RiskEntry[] = [
  { id: 'R-001', category: 'security', severity: 'critical', title: 'IDOR on project detail endpoint', description: 'GET /api/projects/:id has no ownership/scope check. Any authenticated user can view any project.', evidence: 'src/controllers/ProjectController.ts:45 — only checks isAuthenticated', affectedParts: ['Part 5', 'Part 16'], mitigation: 'Add scope check middleware in Part 5.' },
  { id: 'R-002', category: 'security', severity: 'high', title: '3-way match bypassed server-side', description: 'GRN can be posted without PO match verification on server. Check exists only in frontend form.', evidence: 'src/controllers/GRNController.ts:78 — no server-side match call', affectedParts: ['Part 30', 'Part 7'], mitigation: 'Move match to service layer, add protocol control.' },
  { id: 'R-003', category: 'security', severity: 'high', title: 'Payment approval has no maker-checker', description: 'Payment can be created and approved by same user. No segregation of duties.', evidence: 'src/controllers/PaymentController.ts:34 — single-user flow', affectedParts: ['Part 6', 'Part 56'], mitigation: 'Implement maker-checker in workflow engine (Part 6).' },
  { id: 'R-004', category: 'data_quality', severity: 'high', title: 'Orphan material request records', description: '47 MRs have project_id pointing to deleted projects (soft-deleted but FK not enforced).', evidence: 'SELECT * FROM material_requests WHERE project_id NOT IN (SELECT id FROM projects) — 47 rows', affectedParts: ['Part 16', 'Part 26'], mitigation: 'Add FK constraint or clean up orphans before Part 26.' },
  { id: 'R-005', category: 'data_quality', severity: 'medium', title: 'Duplicate vendor entries', description: '12 vendors have duplicate GSTIN numbers, suggesting data entry duplicates.', evidence: 'SELECT gstin, COUNT(*) FROM vendors GROUP BY gstin HAVING COUNT(*) > 1 — 12 gstins', affectedParts: ['Part 27'], mitigation: 'Add unique constraint on GSTIN, merge duplicates.' },
  { id: 'R-006', category: 'performance', severity: 'medium', title: 'Slow inventory query (p95 > 3s)', description: 'Inventory listing with filters takes 3.2s p95 due to missing composite index.', evidence: 'EXPLAIN ANALYZE on inventory query — seq scan on 12k rows', affectedParts: ['Part 30', 'Part 86'], mitigation: 'Add composite index on (site_id, item_id, status).' },
  { id: 'R-007', category: 'performance', severity: 'low', title: 'Report generation blocks request thread', description: 'PDF report generation runs synchronously in request handler, blocking for 5-15s.', evidence: 'src/controllers/ReportController.ts:23 — await puppeteer.render() inline', affectedParts: ['Part 96-109'], mitigation: 'Move to background job, return async download link.' },
  { id: 'R-008', category: 'coupling', severity: 'medium', title: 'GST calculation hardcoded in invoice controller', description: 'GST split (CGST/SGST/IGST) is computed inline in InvoiceController with hardcoded rates.', evidence: 'src/controllers/InvoiceController.ts:89-102 — inline tax calculation', affectedParts: ['Part 56', 'Part 7'], mitigation: 'Extract to tax engine service. Protocol control on tax computation.' },
  { id: 'R-009', category: 'missing', severity: 'high', title: 'No audit trail for approval actions', description: 'When MR/PO/Subcontract bills are approved, no audit record is created with approver details.', evidence: 'No INSERT into audit_logs in any approve endpoint', affectedParts: ['Part 3', 'Part 6'], mitigation: 'Add audit hook in Part 3 shared services.' },
  { id: 'R-010', category: 'security', severity: 'medium', title: 'Secrets in environment file committed', description: '.env.example contains placeholder API keys that match staging values in one case.', evidence: '.env.example:SENDGRID_KEY=SG.placeholder — matches staging env', affectedParts: ['Part 9'], mitigation: 'Rotate key, move to secret store, add pre-commit hook.' },
  { id: 'R-011', category: 'coupling', severity: 'medium', title: 'Two role systems (roles table + hardcoded)', description: 'roles table has 12 roles but controllers also check hardcoded role names like "admin", "pm".', evidence: 'src/middleware/auth.ts:23 — req.user.role === "admin" hardcoded', affectedParts: ['Part 5'], mitigation: 'Consolidate into permission engine (Part 5).' },
  { id: 'R-012', category: 'data_quality', severity: 'low', title: 'Null FK on attendance records', description: '234 attendance records have NULL employee_id (likely from deleted employees).', evidence: 'SELECT COUNT(*) FROM attendance WHERE employee_id IS NULL — 234', affectedParts: ['Part 71'], mitigation: 'Add NOT NULL constraint, clean or reassign records.' },
];

export interface ConflictEntry {
  id: string;
  title: string;
  description: string;
  location1: string;
  location2: string;
  resolution: string;
  affectedParts: string[];
}

export const conflicts: ConflictEntry[] = [
  { id: 'C-001', title: 'Two vendor identification approaches', description: 'vendors table uses GSTIN as business key but some code paths use PAN. No unique constraint on either.', location1: 'vendors.gstin (column)', location2: 'src/services/VendorService.ts:45 (PAN-based lookup)', resolution: 'Standardize on GSTIN as primary business key. Add unique constraint. Deprecate PAN lookup.', affectedParts: ['Part 27'] },
  { id: 'C-002', title: 'Duplicate status tracking', description: 'Purchase orders use status enum in DB but also have a separate is_approved boolean. Conflicting states possible.', location1: 'purchase_orders.status (enum)', location2: 'purchase_orders.is_approved (boolean)', resolution: 'Remove is_approved. Derive from status workflow. Add migration in Part 26.', affectedParts: ['Part 28', 'Part 6'] },
  { id: 'C-003', title: 'Two notification systems', description: 'In-app notifications table exists alongside direct SendGrid email calls in controllers. No unified notification service.', location1: 'notifications table + NotificationController', location2: 'src/services/EmailService.ts (direct SendGrid)', resolution: 'Unify in Part 3 communication gateway. All notifications through single service.', affectedParts: ['Part 3', 'Part 9'] },
  { id: 'C-004', title: 'Role-based vs permission-based auth', description: 'Middleware checks roles (admin, pm, engineer) but some routes check specific permissions inline. Two authorization paradigms coexist.', location1: 'src/middleware/auth.ts (role check)', location2: 'src/controllers/POController.ts:67 (inline permission)', resolution: 'Consolidate in Part 5 permission engine. Map existing roles to permissions.', affectedParts: ['Part 5'] },
  { id: 'C-005', title: 'Multiple amount fields for PO total', description: 'purchase_orders has both total_amount and final_amount. Unclear which is authoritative after variations.', location1: 'purchase_orders.total_amount', location2: 'purchase_orders.final_amount', resolution: 'Define total_amount as original, final_amount as current (after variations). Document in Part 28.', affectedParts: ['Part 28'] },
];

export interface ControlEntry {
  id: string;
  module: string;
  pcStage: string;
  description: string;
  existingLocation: string;
  enforcement: 'hard' | 'soft' | 'none';
  gap: string;
  recommendation: string;
}

export const controlInventory: ControlEntry[] = [
  { id: 'CI-001', module: 'material', pcStage: 'PLAN', description: 'MR requires project selection', existingLocation: 'src/validators/mrValidator.ts:12', enforcement: 'hard', gap: 'No budget availability check', recommendation: 'Add budget check in Part 28' },
  { id: 'CI-002', module: 'material', pcStage: 'AUTHORIZE', description: 'MR approval by PM/Store', existingLocation: 'src/controllers/MRController.ts:89', enforcement: 'soft', gap: 'No authority limit, no workflow', recommendation: 'Wire to workflow engine Part 6' },
  { id: 'CI-003', module: 'material', pcStage: 'EXECUTE', description: 'PO creation from approved MR', existingLocation: 'src/controllers/POController.ts:34', enforcement: 'hard', gap: 'No CS (comparative statement) requirement', recommendation: 'Add CS gate in Part 28' },
  { id: 'CI-004', module: 'material', pcStage: 'VERIFY', description: 'GRN quantity entry', existingLocation: 'src/controllers/GRNController.ts:56', enforcement: 'soft', gap: '3-way match is UI-only, no server check', recommendation: 'Server-side match in Part 30' },
  { id: 'CI-005', module: 'finance', pcStage: 'AUTHORIZE', description: 'Payment creation requires invoice reference', existingLocation: 'src/validators/paymentValidator.ts:8', enforcement: 'hard', gap: 'No maker-checker, no authority limit', recommendation: 'Workflow + authority in Part 56' },
  { id: 'CI-006', module: 'finance', pcStage: 'RECONCILE', description: '—', existingLocation: '—', enforcement: 'none', gap: 'No bank reconciliation exists', recommendation: 'Build in Part 62' },
  { id: 'CI-007', module: 'subcontract', pcStage: 'VERIFY', description: 'RA bill amount entry', existingLocation: 'src/controllers/RABillController.ts:45', enforcement: 'soft', gap: 'No measurement book verification, no retention deduction', recommendation: 'MB check + retention in Part 45' },
  { id: 'CI-008', module: 'project', pcStage: 'MONITOR', description: '—', existingLocation: '—', enforcement: 'none', gap: 'No budget vs actual tracking', recommendation: 'Build EV tracking in Part 20' },
  { id: 'CI-009', module: 'hr', pcStage: 'RECORD', description: 'Attendance manual entry', existingLocation: 'src/controllers/AttendanceController.ts:23', enforcement: 'soft', gap: 'No biometric/GPS verification', recommendation: 'Integration in Part 73' },
  { id: 'CI-010', module: 'auth', pcStage: 'PLAN', description: 'Login requires credentials', existingLocation: 'src/controllers/AuthController.ts:15', enforcement: 'hard', gap: 'No MFA enforcement, no rate limiting', recommendation: 'MFA in Part 5, rate limit in Part 9' },
];

export const socketEvents = [
  { namespace: '/', event: 'connection', auth: 'JWT in handshake', rooms: 'user:{id}', notes: 'Basic connection tracking' },
  { namespace: '/', event: 'notification:new', auth: 'JWT verified', rooms: 'user:{id}', notes: 'Push notification to specific user' },
  { namespace: '/', event: 'project:update', auth: 'JWT verified', rooms: 'project:{id}', notes: 'Project status changes broadcast' },
  { namespace: '/', event: 'approval:required', auth: 'JWT verified', rooms: 'role:{role}', notes: 'Approval requests to role-based room' },
  { namespace: '/dashboard', event: 'metrics:update', auth: 'JWT verified', rooms: 'company:{id}', notes: 'Dashboard metric refresh (5s interval)' },
];

export const backgroundJobs = [
  { name: 'DailyAttendanceSync', schedule: '0 6 * * *', status: 'working', notes: 'Syncs attendance from biometric (if configured)' },
  { name: 'NotificationDigest', schedule: '0 9 * * 1', status: 'working', notes: 'Weekly email digest of unread notifications' },
  { name: 'ReportCacheRefresh', schedule: '0 */4 * * *', status: 'working', notes: 'Refreshes cached report data every 4 hours' },
  { name: 'PaymentReminder', schedule: '0 10 * * *', status: 'partial', notes: 'Sends payment reminders — only email, no SMS' },
  { name: 'InventoryAlert', schedule: '0 8 * * *', status: 'broken', notes: 'Low stock alerts — broken since Redis migration' },
];

export const existingReports = [
  { name: 'Project Status Report', type: 'PDF', generation: 'Puppeteer HTML→PDF', frequency: 'Monthly', permissionFilter: false },
  { name: 'Material Consumption Report', type: 'Excel', generation: 'exceljs', frequency: 'Weekly', permissionFilter: false },
  { name: 'Vendor Performance Report', type: 'PDF', generation: 'Puppeteer HTML→PDF', frequency: 'Monthly', permissionFilter: false },
  { name: 'Attendance Register', type: 'Excel', generation: 'exceljs', frequency: 'Monthly', permissionFilter: true },
  { name: 'Stock Statement', type: 'PDF', generation: 'Puppeteer HTML→PDF', frequency: 'Daily', permissionFilter: false },
  { name: 'Pending Approvals', type: 'PDF', generation: 'Puppeteer HTML→PDF', frequency: 'Daily', permissionFilter: true },
  { name: 'Project Cost Sheet', type: 'Excel', generation: 'exceljs', frequency: 'Monthly', permissionFilter: false },
  { name: 'Subcontract Bill Register', type: 'PDF', generation: 'Puppeteer HTML→PDF', frequency: 'On-demand', permissionFilter: false },
  { name: 'GST Return Summary', type: 'Excel', generation: 'exceljs', frequency: 'Monthly', permissionFilter: false },
  { name: 'Cash Flow Statement', type: 'PDF', generation: 'Puppeteer HTML→PDF', frequency: 'Monthly', permissionFilter: true },
  { name: 'Labour Deployment Report', type: 'Excel', generation: 'exceljs', frequency: 'Weekly', permissionFilter: false },
  { name: 'Equipment Utilisation', type: 'PDF', generation: 'Puppeteer HTML→PDF', frequency: 'Monthly', permissionFilter: false },
];

export const calculations = [
  { id: 'CALC-001', name: 'PO Total Amount', formula: 'SUM(qty × rate) + GST', location: 'src/services/POService.ts:67', usedBy: 'PO creation, PO display', example: '100 × ₹500 + 18% GST = ₹59,000' },
  { id: 'CALC-002', name: 'GST Split (Intra-state)', formula: 'GST/2 as CGST + GST/2 as SGST', location: 'src/controllers/InvoiceController.ts:89', usedBy: 'Invoice creation', example: '₹18,000 GST → ₹9,000 CGST + ₹9,000 SGST' },
  { id: 'CALC-003', name: 'GST Split (Inter-state)', formula: 'Full GST as IGST', location: 'src/controllers/InvoiceController.ts:95', usedBy: 'Invoice creation', example: '₹18,000 GST → ₹18,000 IGST' },
  { id: 'CALC-004', name: 'Stock Valuation (FIFO)', formula: 'Oldest batch rate × qty consumed', location: 'src/services/InventoryService.ts:123', usedBy: 'GRN posting, stock report', example: 'Batch A: 50 @ ₹100, Batch B: 30 @ ₹110 → consumed 60 = 50×100 + 10×110 = ₹6,100' },
  { id: 'CALC-005', name: 'RA Bill Amount', formula: 'Measured qty × BOQ rate - deductions', location: 'src/services/RABillService.ts:45', usedBy: 'RA bill creation', example: '100 cum × ₹500/cum - ₹5,000 retention = ₹45,000' },
  { id: 'CALC-006', name: 'TDS Deduction', formula: 'Bill amount × TDS rate (2% for subcontract)', location: 'src/controllers/PaymentController.ts:78', usedBy: 'Payment processing', example: '₹1,00,000 × 2% = ₹2,000 TDS' },
  { id: 'CALC-007', name: 'Payroll Net Pay', formula: 'Basic + DA + HRA + Allowances - PF - ESI - PT - TDS', location: 'spreadsheet (not in code)', usedBy: 'Payroll processing (manual)', example: '₹30,000 + ₹5,000 + ₹3,000 - ₹3,600 - ₹750 - ₹200 = ₹33,450' },
  { id: 'CALC-008', name: 'Invoice Total', formula: 'Subtotal + GST - Discount', location: 'src/services/InvoiceService.ts:56', usedBy: 'Invoice creation', example: '₹1,00,000 + ₹18,000 - ₹5,000 = ₹1,13,000' },
];
