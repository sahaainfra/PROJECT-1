// Part 5 — User, Role & Permission Architecture (Enterprise RBAC) Data

export interface Permission {
  key: string;
  module: string;
  feature: string;
  action: string;
  description: string;
  isSensitive: boolean;
  defaultScope: string;
  pcStage?: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  maxScope: string;
  userCount: number;
  permissionCount: number;
}

export interface RolePermission {
  roleId: string;
  permissionKey: string;
  effect: 'allow' | 'deny';
  scopeType: 'company' | 'bu' | 'department' | 'project' | 'site' | 'own';
  conditions?: Record<string, any>;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  userName: string;
  roleId: string;
  roleName: string;
  scopeType: 'company' | 'bu' | 'department' | 'project' | 'site';
  scopeId: string;
  scopeName: string;
  validFrom: string;
  validTo: string | null;
  assignedBy: string;
  reason: string;
  isActive: boolean;
}

export interface FieldPolicy {
  id: string;
  entity: string;
  field: string;
  viewPermission: string;
  editPermission: string;
  maskType: 'full' | 'partial' | 'hash';
}

export interface RecordRule {
  id: string;
  entity: string;
  ruleType: 'own' | 'allocated_project' | 'allocated_site' | 'department' | 'custom';
  expression: string;
  description: string;
}

export interface SoDRule {
  id: string;
  code: string;
  permissionA: string;
  permissionB: string;
  scope: string;
  severity: 'block' | 'warn';
  description: string;
}

export interface LegacyPermissionMap {
  legacyRight: string;
  permissionKey: string;
  module: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleCount: number;
  lastLogin: string;
  status: 'active' | 'inactive' | 'locked';
}

// Permission Registry - Sample permissions from various modules
export const permissions: Permission[] = [
  // Organization Module
  { key: 'org.project.create', module: 'org', feature: 'project', action: 'create', description: 'Create new projects', isSensitive: false, defaultScope: 'company', pcStage: 'PLAN' },
  { key: 'org.project.edit', module: 'org', feature: 'project', action: 'edit', description: 'Edit project details', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'org.project.approve', module: 'org', feature: 'project', action: 'approve', description: 'Approve project creation', isSensitive: false, defaultScope: 'company', pcStage: 'APPROVE' },
  { key: 'org.site.geofence.edit', module: 'org', feature: 'site', action: 'geofence.edit', description: 'Edit site geofences', isSensitive: true, defaultScope: 'site', pcStage: 'APPROVE' },
  
  // Materials Module
  { key: 'mat.pr.create', module: 'mat', feature: 'pr', action: 'create', description: 'Create purchase requests', isSensitive: false, defaultScope: 'project', pcStage: 'PLAN' },
  { key: 'mat.pr.approve', module: 'mat', feature: 'pr', action: 'approve', description: 'Approve purchase requests', isSensitive: false, defaultScope: 'project', pcStage: 'APPROVE' },
  { key: 'mat.po.create', module: 'mat', feature: 'po', action: 'create', description: 'Create purchase orders', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'mat.po.approve', module: 'mat', feature: 'po', action: 'approve', description: 'Approve purchase orders', isSensitive: false, defaultScope: 'project', pcStage: 'APPROVE' },
  { key: 'mat.grn.post', module: 'mat', feature: 'grn', action: 'post', description: 'Post goods receipt notes', isSensitive: false, defaultScope: 'site', pcStage: 'EXECUTE' },
  
  // Finance Module
  { key: 'fin.invoice.create', module: 'fin', feature: 'invoice', action: 'create', description: 'Create invoices', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'fin.payment.create', module: 'fin', feature: 'payment', action: 'create', description: 'Create payments', isSensitive: true, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'fin.payment.approve', module: 'fin', feature: 'payment', action: 'approve', description: 'Approve payments', isSensitive: true, defaultScope: 'company', pcStage: 'APPROVE' },
  
  // HR Module
  { key: 'hr.attendance.view', module: 'hr', feature: 'attendance', action: 'view', description: 'View attendance records', isSensitive: false, defaultScope: 'own', pcStage: 'RECORD' },
  { key: 'hr.payroll.view', module: 'hr', feature: 'payroll', action: 'view', description: 'View payroll data', isSensitive: true, defaultScope: 'own', pcStage: 'RECORD' },
  { key: 'hr.payroll.approve', module: 'hr', feature: 'payroll', action: 'approve', description: 'Approve payroll', isSensitive: true, defaultScope: 'company', pcStage: 'APPROVE' },
  
  // IAM Module
  { key: 'iam.role.edit', module: 'iam', feature: 'role', action: 'edit', description: 'Edit role permissions', isSensitive: true, defaultScope: 'company', pcStage: 'APPROVE' },
  { key: 'iam.assignment.create', module: 'iam', feature: 'assignment', action: 'create', description: 'Assign roles to users', isSensitive: true, defaultScope: 'company', pcStage: 'APPROVE' },
  { key: 'iam.permission.view', module: 'iam', feature: 'permission', action: 'view', description: 'View permission registry', isSensitive: false, defaultScope: 'company', pcStage: 'VERIFY' },
];

// System Roles
export const roles: Role[] = [
  { id: 'role_001', code: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full system access', isSystem: true, maxScope: 'company', userCount: 2, permissionCount: 150 },
  { id: 'role_002', code: 'MANAGEMENT', name: 'Management / CFO', description: 'Executive oversight and approvals', isSystem: true, maxScope: 'company', userCount: 5, permissionCount: 85 },
  { id: 'role_003', code: 'PM', name: 'Project Manager', description: 'Project-level management', isSystem: true, maxScope: 'project', userCount: 12, permissionCount: 65 },
  { id: 'role_004', code: 'SITE_ENG', name: 'Site Engineer', description: 'Site operations and execution', isSystem: true, maxScope: 'site', userCount: 28, permissionCount: 45 },
  { id: 'role_005', code: 'STORE_KEEPER', name: 'Store Keeper', description: 'Material and inventory management', isSystem: true, maxScope: 'site', userCount: 8, permissionCount: 35 },
  { id: 'role_006', code: 'PROCUREMENT', name: 'Procurement Manager', description: 'Purchase and vendor management', isSystem: true, maxScope: 'company', userCount: 6, permissionCount: 55 },
  { id: 'role_007', code: 'ACCOUNTS', name: 'Accounts Manager', description: 'Financial operations', isSystem: true, maxScope: 'company', userCount: 4, permissionCount: 60 },
  { id: 'role_008', code: 'HR_MANAGER', name: 'HR Manager', description: 'HR and payroll operations', isSystem: true, maxScope: 'company', userCount: 3, permissionCount: 50 },
  { id: 'role_009', code: 'QS', name: 'QS / Commercial', description: 'Quantity surveying and contracts', isSystem: true, maxScope: 'project', userCount: 7, permissionCount: 48 },
  { id: 'role_010', code: 'QA_QC', name: 'QA/QC Engineer', description: 'Quality control and inspections', isSystem: true, maxScope: 'site', userCount: 9, permissionCount: 32 },
  { id: 'role_011', code: 'HSE', name: 'HSE Officer', description: 'Health, safety and environment', isSystem: true, maxScope: 'site', userCount: 5, permissionCount: 30 },
  { id: 'role_012', code: 'PLANT_MGR', name: 'Plant Manager', description: 'Equipment and machinery', isSystem: true, maxScope: 'company', userCount: 3, permissionCount: 38 },
  { id: 'role_013', code: 'EMPLOYEE', name: 'Employee', description: 'Self-service access', isSystem: true, maxScope: 'own', userCount: 234, permissionCount: 12 },
];

// Role-Permission Mappings (Sample)
export const rolePermissions: RolePermission[] = [
  // Super Admin - Full access
  { roleId: 'role_001', permissionKey: 'org.project.create', effect: 'allow', scopeType: 'company' },
  { roleId: 'role_001', permissionKey: 'org.project.approve', effect: 'allow', scopeType: 'company' },
  { roleId: 'role_001', permissionKey: 'mat.po.create', effect: 'allow', scopeType: 'company' },
  { roleId: 'role_001', permissionKey: 'mat.po.approve', effect: 'allow', scopeType: 'company' },
  { roleId: 'role_001', permissionKey: 'fin.payment.approve', effect: 'allow', scopeType: 'company' },
  { roleId: 'role_001', permissionKey: 'iam.role.edit', effect: 'allow', scopeType: 'company' },
  
  // Project Manager - Project scope
  { roleId: 'role_003', permissionKey: 'org.project.create', effect: 'allow', scopeType: 'project' },
  { roleId: 'role_003', permissionKey: 'org.project.edit', effect: 'allow', scopeType: 'project' },
  { roleId: 'role_003', permissionKey: 'mat.pr.approve', effect: 'allow', scopeType: 'project' },
  { roleId: 'role_003', permissionKey: 'mat.po.approve', effect: 'allow', scopeType: 'project', conditions: { maxAmount: 500000 } },
  
  // Site Engineer - Site scope
  { roleId: 'role_004', permissionKey: 'mat.pr.create', effect: 'allow', scopeType: 'site' },
  { roleId: 'role_004', permissionKey: 'mat.grn.post', effect: 'allow', scopeType: 'site' },
  { roleId: 'role_004', permissionKey: 'hr.attendance.view', effect: 'allow', scopeType: 'site' },
  
  // Store Keeper - Site scope
  { roleId: 'role_005', permissionKey: 'mat.grn.post', effect: 'allow', scopeType: 'site' },
  { roleId: 'role_005', permissionKey: 'mat.po.create', effect: 'deny', scopeType: 'site' }, // SoD: Can't create PO
  
  // Accounts Manager - Company scope
  { roleId: 'role_007', permissionKey: 'fin.invoice.create', effect: 'allow', scopeType: 'company' },
  { roleId: 'role_007', permissionKey: 'fin.payment.create', effect: 'allow', scopeType: 'company' },
  { roleId: 'role_007', permissionKey: 'fin.payment.approve', effect: 'allow', scopeType: 'company', conditions: { maxAmount: 1000000 } },
  
  // Employee - Own scope only
  { roleId: 'role_013', permissionKey: 'hr.attendance.view', effect: 'allow', scopeType: 'own' },
  { roleId: 'role_013', permissionKey: 'hr.payroll.view', effect: 'allow', scopeType: 'own' },
];

// User-Role Assignments
export const userAssignments: UserRoleAssignment[] = [
  {
    id: 'assign_001',
    userId: 'usr_admin_001',
    userName: 'System Administrator',
    roleId: 'role_001',
    roleName: 'Super Admin',
    scopeType: 'company',
    scopeId: 'comp_001',
    scopeName: 'Acme Construction Ltd.',
    validFrom: '2025-01-01',
    validTo: null,
    assignedBy: 'usr_admin_001',
    reason: 'Initial system setup',
    isActive: true
  },
  {
    id: 'assign_002',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    roleId: 'role_003',
    roleName: 'Project Manager',
    scopeType: 'project',
    scopeId: 'prj_001',
    scopeName: 'Riverside Tower — Phase II',
    validFrom: '2025-06-01',
    validTo: null,
    assignedBy: 'usr_admin_001',
    reason: 'Project assignment',
    isActive: true
  },
  {
    id: 'assign_003',
    userId: 'usr_sm_001',
    userName: 'Rahul Mehta',
    roleId: 'role_004',
    roleName: 'Site Engineer',
    scopeType: 'site',
    scopeId: 'site_001',
    scopeName: 'Riverside Tower — Block A',
    validFrom: '2025-06-01',
    validTo: null,
    assignedBy: 'usr_pm_001',
    reason: 'Site deployment',
    isActive: true
  },
  {
    id: 'assign_004',
    userId: 'usr_store_001',
    userName: 'Suresh Nair',
    roleId: 'role_005',
    roleName: 'Store Keeper',
    scopeType: 'site',
    scopeId: 'site_001',
    scopeName: 'Riverside Tower — Block A',
    validFrom: '2025-06-15',
    validTo: null,
    assignedBy: 'usr_pm_001',
    reason: 'Site deployment',
    isActive: true
  },
  {
    id: 'assign_005',
    userId: 'usr_acct_001',
    userName: 'Priya Sharma',
    roleId: 'role_007',
    roleName: 'Accounts Manager',
    scopeType: 'company',
    scopeId: 'comp_001',
    scopeName: 'Acme Construction Ltd.',
    validFrom: '2025-01-01',
    validTo: null,
    assignedBy: 'usr_admin_001',
    reason: 'Department assignment',
    isActive: true
  },
  {
    id: 'assign_006',
    userId: 'usr_eng_001',
    userName: 'Amit Patel',
    roleId: 'role_004',
    roleName: 'Site Engineer',
    scopeType: 'project',
    scopeId: 'prj_002',
    scopeName: 'Highway Bridge Phase 2',
    validFrom: '2025-09-01',
    validTo: '2025-12-31',
    assignedBy: 'usr_pm_002',
    reason: 'Temporary allocation',
    isActive: true
  },
];

// Field Policies
export const fieldPolicies: FieldPolicy[] = [
  { id: 'fp_001', entity: 'Employee', field: 'salary', viewPermission: 'hr.payroll.view', editPermission: 'hr.payroll.edit', maskType: 'full' },
  { id: 'fp_002', entity: 'Employee', field: 'bank_account', viewPermission: 'hr.payroll.view', editPermission: 'hr.payroll.edit', maskType: 'partial' },
  { id: 'fp_003', entity: 'Vendor', field: 'pan_number', viewPermission: 'vendor.view', editPermission: 'vendor.edit', maskType: 'partial' },
  { id: 'fp_004', entity: 'Payment', field: 'amount', viewPermission: 'fin.payment.view', editPermission: 'fin.payment.edit', maskType: 'full' },
];

// Record Rules
export const recordRules: RecordRule[] = [
  { id: 'rr_001', entity: 'PurchaseRequest', ruleType: 'allocated_project', expression: 'project_id IN user.allocated_projects', description: 'Site Engineer sees PRs of allocated projects' },
  { id: 'rr_002', entity: 'GoodsReceipt', ruleType: 'allocated_site', expression: 'site_id IN user.allocated_sites', description: 'Store Keeper sees GRNs of allocated sites' },
  { id: 'rr_003', entity: 'Attendance', ruleType: 'own', expression: 'employee_id = current_user.employee_id', description: 'Employee sees own attendance only' },
  { id: 'rr_004', entity: 'Payslip', ruleType: 'own', expression: 'employee_id = current_user.employee_id', description: 'Employee sees own payslips only' },
  { id: 'rr_005', entity: 'DailyProgressReport', ruleType: 'allocated_site', expression: 'site_id IN user.allocated_sites', description: 'Site Engineer sees DPRs of allocated sites' },
];

// Segregation of Duties Rules
export const sodRules: SoDRule[] = [
  { id: 'sod_001', code: 'SOD_PO_CREATE_APPROVE', permissionA: 'mat.po.create', permissionB: 'mat.po.approve', scope: 'project', severity: 'block', description: 'Cannot create and approve PO in same project' },
  { id: 'sod_002', code: 'SOD_PAYMENT_CREATE_APPROVE', permissionA: 'fin.payment.create', permissionB: 'fin.payment.approve', scope: 'company', severity: 'block', description: 'Cannot create and approve payment in same company' },
  { id: 'sod_003', code: 'SOD_VENDOR_PAYMENT', permissionA: 'vendor.create', permissionB: 'fin.payment.approve', scope: 'company', severity: 'block', description: 'Vendor master maintainer cannot approve payments to vendors' },
  { id: 'sod_004', code: 'SOD_PR_PO', permissionA: 'mat.pr.create', permissionB: 'mat.po.create', scope: 'project', severity: 'warn', description: 'Same user creating PR and PO may indicate lack of controls' },
];

// Legacy Permission Mapping
export const legacyMappings: LegacyPermissionMap[] = [
  { legacyRight: 'admin_all', permissionKey: 'org.project.create', module: 'org' },
  { legacyRight: 'admin_all', permissionKey: 'mat.po.create', module: 'mat' },
  { legacyRight: 'pm_projects', permissionKey: 'org.project.edit', module: 'org' },
  { legacyRight: 'pm_approvals', permissionKey: 'mat.pr.approve', module: 'mat' },
  { legacyRight: 'site_operations', permissionKey: 'mat.grn.post', module: 'mat' },
  { legacyRight: 'store_inventory', permissionKey: 'mat.grn.post', module: 'mat' },
  { legacyRight: 'accounts_finance', permissionKey: 'fin.payment.create', module: 'fin' },
];

// Users (Sample)
export const users: User[] = [
  { id: 'usr_admin_001', name: 'System Administrator', email: 'admin@acme.com', roleCount: 1, lastLogin: '2026-01-15T08:30:00Z', status: 'active' },
  { id: 'usr_pm_001', name: 'Rajesh Kumar', email: 'rajesh.kumar@acme.com', roleCount: 1, lastLogin: '2026-01-15T09:15:00Z', status: 'active' },
  { id: 'usr_sm_001', name: 'Rahul Mehta', email: 'rahul.mehta@acme.com', roleCount: 1, lastLogin: '2026-01-15T07:45:00Z', status: 'active' },
  { id: 'usr_store_001', name: 'Suresh Nair', email: 'suresh.nair@acme.com', roleCount: 1, lastLogin: '2026-01-15T08:00:00Z', status: 'active' },
  { id: 'usr_acct_001', name: 'Priya Sharma', email: 'priya.sharma@acme.com', roleCount: 1, lastLogin: '2026-01-15T09:00:00Z', status: 'active' },
  { id: 'usr_eng_001', name: 'Amit Patel', email: 'amit.patel@acme.com', roleCount: 2, lastLogin: '2026-01-14T16:30:00Z', status: 'active' },
];

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-IAM-01',
    stage: 'APPROVE',
    control: 'Role permission changes and privileged assignments are maker-checker',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-IAM-02',
    stage: 'VERIFY',
    control: 'SoD conflict check on every assignment',
    enforcement: 'BLOCK / EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-IAM-03',
    stage: 'MONITOR',
    control: 'Repeated 403/BLOCK attempts by a user on the same function',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-IAM-04',
    stage: 'RECONCILE',
    control: 'Quarterly access review of all privileged roles',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Shadow Mode Mismatches (Sample)
export const shadowMismatches = [
  { userId: 'usr_eng_001', permissionKey: 'mat.po.create', legacyAccess: true, newAccess: false, reason: 'Scope restriction: project-level only', action: 'under_review' },
  { userId: 'usr_store_001', permissionKey: 'mat.po.approve', legacyAccess: false, newAccess: false, reason: 'SoD rule: Store keeper cannot approve PO', action: 'confirmed' },
];
