export const systemInfo = {
  version: 'v0.1.0',
  baselineTag: 'erp-baseline-v0',
  gitCommit: 'a3f7c2d',
  capturedAt: '2026-01-15T08:30:00Z',
  capturedBy: 'system-admin',
  environment: 'production',
  database: 'PostgreSQL 15.4',
  nodeVersion: 'v20.11.0',
  lastCheck: '2026-01-15T08:30:00Z',
};

export const modules = [
  { id: 'pgm', name: 'Program Management', code: 'pgm', status: 'active', parts: '0-126', icon: '🏗️', color: 'blue', description: 'Governed engineering baseline for the whole ERP program' },
  { id: 'core', name: 'Core Platform', code: 'core', status: 'active', parts: '1-15', icon: '⚙️', color: 'slate', description: 'Shared services, permissions, workflows, protocol engine' },
  { id: 'prm', name: 'Projects', code: 'prm', status: 'planned', parts: '16-25', icon: '📋', color: 'emerald', description: 'Project setup, WBS, BOQ, budgets' },
  { id: 'mat', name: 'Materials', code: 'mat', status: 'planned', parts: '26-40', icon: '📦', color: 'amber', description: 'PR, PO, GRN, stock, valuation' },
  { id: 'sub', name: 'Subcontracts', code: 'sub', status: 'planned', parts: '41-55', icon: '🤝', color: 'violet', description: 'Subcontractor management, RA bills, retention' },
  { id: 'fin', name: 'Finance', code: 'fin', status: 'planned', parts: '56-70', icon: '💰', color: 'green', description: 'AP/AR, payments, ledger, reconciliation' },
  { id: 'hrm', name: 'HR & Payroll', code: 'hrm', status: 'planned', parts: '71-85', icon: '👷', color: 'orange', description: 'Attendance, payroll, compliance' },
  { id: 'eqp', name: 'Equipment', code: 'eqp', status: 'planned', parts: '86-95', icon: '🚜', color: 'cyan', description: 'Equipment tracking, maintenance, allocation' },
  { id: 'rpt', name: 'Reports & BI', code: 'rpt', status: 'planned', parts: '96-110', icon: '📊', color: 'rose', description: 'Dashboards, analytics, exports' },
  { id: 'adm', name: 'Administration', code: 'adm', status: 'planned', parts: '111-120', icon: '🔧', color: 'indigo', description: 'Config, feature flags, audit, settings' },
  { id: 'int', name: 'Integrations', code: 'int', status: 'planned', parts: '121-126', icon: '🔗', color: 'teal', description: 'External systems, APIs, data sync' },
];

export const baselineMetrics = {
  tables: 47,
  totalRows: 128453,
  views: 12,
  functions: 23,
  triggers: 8,
  indexes: 156,
  schemaHash: 'sha256:e4b3c7a9f2d1...',
  dataIntegrity: 100,
  lastCheck: '2026-01-15T08:30:00Z',
};

export const featureFlags = [
  { key: 'ff.pgm', description: 'Program Management module', scope: 'global', enabled: true, rolloutPercent: 100, owner: 'Part 0' },
  { key: 'ff.pgm.baseline', description: 'Baseline capture & verification', scope: 'global', enabled: true, rolloutPercent: 100, owner: 'Part 0' },
  { key: 'ff.pgm.regression', description: 'Regression harness', scope: 'global', enabled: true, rolloutPercent: 100, owner: 'Part 0' },
  { key: 'ff.core.auth', description: 'Four-layer authorization', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 5' },
  { key: 'ff.core.workflow', description: 'Central workflow engine', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 6' },
  { key: 'ff.core.protocol', description: 'Protocol & Control engine', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 7' },
  { key: 'ff.core.audit', description: 'Central audit trail', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 3' },
  { key: 'ff.core.notify', description: 'Notification engine', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 3' },
  { key: 'ff.dpr', description: 'DPR / Field Execution module (Part 30)', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 30' },
  { key: 'ff.dpr.voice', description: 'Voice-to-DPR AI draft (labelled, never auto-submitted)', scope: 'project', enabled: false, rolloutPercent: 0, owner: 'Part 30' },
  { key: 'ff.weather', description: 'Weather & Site Condition Management module (Part 31)', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 31' },
  { key: 'ff.weather.provider', description: 'External weather provider integration (Part 80)', scope: 'project', enabled: false, rolloutPercent: 0, owner: 'Part 31' },
  { key: 'ff.gis', description: 'GIS, Survey & Site Location Intelligence module (Part 32)', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 32' },
  { key: 'ff.proc', description: 'Advanced Procurement module (Part 34)', scope: 'global', enabled: false, rolloutPercent: 0, owner: 'Part 34' },
  { key: 'ff.proc.mrp', description: 'MRP workbench (Part 34)', scope: 'project', enabled: false, rolloutPercent: 0, owner: 'Part 34' },
  { key: 'ff.proc.vendor_portal', description: 'Secure vendor response link (Part 34)', scope: 'project', enabled: false, rolloutPercent: 0, owner: 'Part 34' },
];

export const protocolControls = [
  { id: 'CP-PGM-01', stage: 'PLAN', control: 'No prompt starts until previous regression gate evidence exists', enforcement: 'BLOCK', evidence: 'test-evidence folder', escalation: 'Tech lead → Program manager', status: 'active', mode: 'OBSERVE' },
  { id: 'CP-PGM-02', stage: 'VERIFY', control: 'Baseline integrity check re-run before and after every migration batch', enforcement: 'BLOCK', evidence: 'integrity report', escalation: 'Tech lead', status: 'active', mode: 'OBSERVE' },
  { id: 'CP-PGM-03', stage: 'CLOSE', control: 'Prompt closed only with Definition of Done checklist signed', enforcement: 'BLOCK', evidence: 'DoD checklist', escalation: 'Program manager', status: 'active', mode: 'OBSERVE' },
];

export const regressionResults = {
  status: 'passing',
  totalTests: 42,
  passed: 42,
  failed: 0,
  skipped: 3,
  duration: '12.4s',
  lastRun: '2026-01-15T08:25:00Z',
  suites: [
    { name: 'DB Integrity Check', tests: 4, passed: 4, status: 'pass' },
    { name: 'Golden Tests - Auth', tests: 8, passed: 8, status: 'pass' },
    { name: 'Golden Tests - Projects', tests: 6, passed: 6, status: 'pass' },
    { name: 'Golden Tests - Materials', tests: 7, passed: 7, status: 'pass' },
    { name: 'Golden Tests - Finance', tests: 5, passed: 5, status: 'pass' },
    { name: 'Report Comparison', tests: 4, passed: 4, status: 'pass' },
    { name: 'Schema Baseline', tests: 3, passed: 3, status: 'pass' },
    { name: 'Feature Flag Tests', tests: 5, passed: 5, status: 'pass' },
  ],
};

export const documentationFiles = [
  { path: '01_SHARED_ARCHITECTURE.md', category: 'Architecture', status: 'complete' },
  { path: '02_PROTOCOL_CONTROL_FRAMEWORK.md', category: 'Architecture', status: 'complete' },
  { path: '03_NON_NEGOTIABLE_RULES.md', category: 'Rules', status: 'complete' },
  { path: '13_SECURE_DEVELOPMENT_STANDARD.md', category: 'Security', status: 'complete' },
  { path: 'EXISTING_SYSTEM_MAP.md', category: 'Discovery', status: 'complete' },
  { path: 'DB_ENTITY_MAP.csv', category: 'Discovery', status: 'complete' },
  { path: 'baseline/schema_baseline.sql', category: 'Baseline', status: 'complete' },
  { path: 'baseline/schema_baseline.json', category: 'Baseline', status: 'complete' },
  { path: 'baseline/data_baseline.csv', category: 'Baseline', status: 'complete' },
  { path: 'baseline/protocol_baseline.md', category: 'Baseline', status: 'complete' },
  { path: 'baseline/BASELINE_REPORT.md', category: 'Baseline', status: 'complete' },
  { path: 'discovery/part-0.md', category: 'Discovery', status: 'complete' },
  { path: 'test-evidence/part-0/', category: 'Evidence', status: 'complete' },
  { path: 'PROGRAM_RULES.md', category: 'Rules', status: 'complete' },
  { path: 'DB_EXTENSIONS.md', category: 'Extensions', status: 'complete' },
  { path: 'EVENT_CATALOGUE.md', category: 'Catalogue', status: 'complete' },
  { path: 'PERMISSION_REGISTRY.md', category: 'Registry', status: 'complete' },
  { path: 'PROTOCOL_REGISTER.md', category: 'Registry', status: 'complete' },
];

export const tableBaselines = [
  { name: 'users', rows: 234, checksum: 'a1b2c3d4', status: 'verified' },
  { name: 'companies', rows: 12, checksum: 'e5f6g7h8', status: 'verified' },
  { name: 'projects', rows: 47, checksum: 'i9j0k1l2', status: 'verified' },
  { name: 'purchase_orders', rows: 3892, checksum: 'm3n4o5p6', status: 'verified' },
  { name: 'purchase_order_lines', rows: 18234, checksum: 'q7r8s9t0', status: 'verified' },
  { name: 'goods_receipt_notes', rows: 2156, checksum: 'u1v2w3x4', status: 'verified' },
  { name: 'material_requests', rows: 5623, checksum: 'y5z6a7b8', status: 'verified' },
  { name: 'invoices', rows: 1847, checksum: 'c9d0e1f2', status: 'verified' },
  { name: 'payments', rows: 2341, checksum: 'g3h4i5j6', status: 'verified' },
  { name: 'subcontracts', rows: 89, checksum: 'k7l8m9n0', status: 'verified' },
  { name: 'attendance', rows: 45678, checksum: 'o1p2q3r4', status: 'verified' },
  { name: 'payroll_runs', rows: 156, checksum: 's5t6u7v8', status: 'verified' },
  { name: 'equipment', rows: 234, checksum: 'w9x0y1z2', status: 'verified' },
  { name: 'sys_feature_flags', rows: 8, checksum: 'a3b4c5d6', status: 'verified' },
  { name: 'sys_audit_log', rows: 45678, checksum: 'e7f8g9h0', status: 'verified' },
];

export const protocolStages = [
  { stage: 'PLAN', description: 'Define scope, dependencies, acceptance criteria', icon: '📝' },
  { stage: 'AUTHORIZE', description: 'Obtain approval before execution', icon: '✅' },
  { stage: 'EXECUTE', description: 'Implement the change within guardrails', icon: '🔨' },
  { stage: 'RECORD', description: 'Capture evidence, audit trail, documents', icon: '📄' },
  { stage: 'VERIFY', description: 'Confirm correctness via tests and checks', icon: '🔍' },
  { stage: 'ANALYZE', description: 'Review metrics, KPIs, deviations', icon: '📊' },
  { stage: 'CONTROL', description: 'Enforce rules, escalate exceptions', icon: '🛡️' },
  { stage: 'CLOSE', description: 'Sign off, archive, update baselines', icon: '🏁' },
];

export const acceptanceCriteria = [
  { id: 'AC-01', text: 'Tag erp-baseline-v0 exists; schema/data/report baselines stored and reproducible', status: 'pass' },
  { id: 'AC-02', text: 'erp:regression runs green on unchanged code and is wired into CI', status: 'pass' },
  { id: 'AC-03', text: 'Feature-flag helper works server- and client-side with a unit test', status: 'pass' },
  { id: 'AC-04', text: 'Test restore of the baseline backup succeeds and integrity check matches 100%', status: 'pass' },
  { id: 'AC-05', text: 'No application behaviour, schema object or data row has changed', status: 'pass' },
  { id: 'AC-06', text: 'Every section 8A control point is registered, evaluated server-side on all paths', status: 'pass' },
  { id: 'AC-07', text: 'Deviations only through approved exceptions or emergency path', status: 'pass' },
  { id: 'AC-08', text: 'Security acceptance gate (SEC-28) passed', status: 'pass' },
  { id: 'AC-09', text: 'Definition of Done (SA-20) met; ff.pgm can be enabled in production', status: 'pass' },
];
