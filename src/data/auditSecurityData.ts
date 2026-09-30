// Part 8 — Audit, Security & Governance Foundation Data

export interface AuditLog {
  id: string;
  auditId: string;
  actorId: string;
  actorName: string;
  impersonatedBy?: string;
  sessionId: string;
  correlationId: string;
  module: string;
  entityType: string;
  entityId: string;
  entityNumber?: string;
  action: 'create' | 'update' | 'delete' | 'state_change' | 'approval' | 'rejection' | 'print' | 'export' | 'download' | 'login' | 'logout';
  actionDescription: string;
  beforeJson: Record<string, any> | null;
  afterJson: Record<string, any> | null;
  changedFields: string[];
  reasonCode?: string;
  reasonNarrative?: string;
  workflowInstanceId?: string;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
  ipAddress: string;
  userAgent: string;
  deviceId: string;
  timestamp: string;
  hash: string;
  previousHash: string;
  verified: boolean;
}

export interface AuditFieldChange {
  id: string;
  auditId: string;
  field: string;
  oldValue: any;
  newValue: any;
  masked: boolean;
}

export interface LoginHistory {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  deviceId: string;
  result: 'success' | 'fail' | 'locked';
  method: 'password' | 'sso' | 'otp';
  geoHint?: string;
  failureReason?: string;
}

export interface Session {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastSeenAt: string;
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
  isActive: boolean;
}

export interface SecurityEvent {
  id: string;
  eventId: string;
  type: 'brute_force' | 'permission_denied_spike' | 'privileged_change' | 'export_bulk' | 'impossible_travel' | 'token_reuse' | 'hash_chain_break' | 'sensitive_read';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userName?: string;
  description: string;
  detailsJson: Record<string, any>;
  timestamp: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'false_positive';
  handledBy?: string;
  handledAt?: string;
  resolutionNotes?: string;
}

export interface ReasonCode {
  id: string;
  code: string;
  module: string;
  description: string;
  requiresNarrative: boolean;
  minNarrativeLength: number;
}

export interface HashChainVerification {
  id: string;
  verificationDate: string;
  totalRecords: number;
  verifiedRecords: number;
  brokenLinks: number;
  status: 'success' | 'broken';
  brokenRecordIds: string[];
  verifiedBy: string;
}

export interface RetentionPolicy {
  id: string;
  module: string;
  entityType: string;
  retentionDays: number;
  archiveToColdStorage: boolean;
  autoDelete: boolean;
}

// Audit Logs (Recent)
export const auditLogs: AuditLog[] = [
  {
    id: 'audit_001',
    auditId: 'AUD-2026-001234',
    actorId: 'usr_pm_001',
    actorName: 'Rajesh Kumar',
    sessionId: 'sess_abc123',
    correlationId: 'corr_po_001',
    module: 'mat',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    entityNumber: 'PO-2026-0142',
    action: 'create',
    actionDescription: 'Created purchase order',
    beforeJson: null,
    afterJson: { poNumber: 'PO-2026-0142', vendorId: 'vend_045', totalAmount: 2450000, status: 'pending_approval' },
    changedFields: ['poNumber', 'vendorId', 'totalAmount', 'status'],
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    deviceId: 'dev_laptop_001',
    timestamp: '2026-01-15T10:30:00Z',
    hash: 'sha256:a1b2c3d4e5f6',
    previousHash: 'sha256:z9y8x7w6v5u4',
    verified: true
  },
  {
    id: 'audit_002',
    auditId: 'AUD-2026-001235',
    actorId: 'usr_proc_001',
    actorName: 'Vikram Singh',
    sessionId: 'sess_def456',
    correlationId: 'corr_po_001',
    module: 'mat',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    entityNumber: 'PO-2026-0142',
    action: 'approval',
    actionDescription: 'Approved purchase order',
    beforeJson: { status: 'pending_approval' },
    afterJson: { status: 'approved' },
    changedFields: ['status'],
    reasonCode: 'RC-APPROVE-001',
    reasonNarrative: 'Vendor verified, rates competitive, within budget',
    workflowInstanceId: 'wf_inst_001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    deviceId: 'dev_laptop_002',
    timestamp: '2026-01-15T11:00:00Z',
    hash: 'sha256:b2c3d4e5f6g7',
    previousHash: 'sha256:a1b2c3d4e5f6',
    verified: true
  },
  {
    id: 'audit_003',
    auditId: 'AUD-2026-001236',
    actorId: 'usr_store_001',
    actorName: 'Suresh Nair',
    sessionId: 'sess_ghi789',
    correlationId: 'corr_grn_001',
    module: 'mat',
    entityType: 'GoodsReceipt',
    entityId: 'grn_2026_0234',
    entityNumber: 'GRN-2026-0234',
    action: 'create',
    actionDescription: 'Posted goods receipt note',
    beforeJson: null,
    afterJson: { grnNumber: 'GRN-2026-0234', poId: 'po_2026_0140', receivedQty: 50, receivedBy: 'usr_store_001' },
    changedFields: ['grnNumber', 'poId', 'receivedQty', 'receivedBy'],
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    siteId: 'site_001',
    siteName: 'Block A',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 Mobile Safari/17.0',
    deviceId: 'dev_mobile_001',
    timestamp: '2026-01-15T14:30:00Z',
    hash: 'sha256:c3d4e5f6g7h8',
    previousHash: 'sha256:b2c3d4e5f6g7',
    verified: true
  },
  {
    id: 'audit_004',
    auditId: 'AUD-2026-001237',
    actorId: 'usr_acct_001',
    actorName: 'Priya Sharma',
    sessionId: 'sess_jkl012',
    correlationId: 'corr_pay_001',
    module: 'fin',
    entityType: 'Payment',
    entityId: 'pay_2026_0089',
    entityNumber: 'PAY-2026-0089',
    action: 'create',
    actionDescription: 'Created payment',
    beforeJson: null,
    afterJson: { paymentNumber: 'PAY-2026-0089', invoiceId: 'inv_2025_045', amount: 1875000, status: 'pending_approval' },
    changedFields: ['paymentNumber', 'invoiceId', 'amount', 'status'],
    reasonCode: 'RC-PAY-001',
    reasonNarrative: 'Invoice due date reached, vendor payment scheduled',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    ipAddress: '192.168.1.115',
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    deviceId: 'dev_laptop_003',
    timestamp: '2026-01-15T15:00:00Z',
    hash: 'sha256:d4e5f6g7h8i9',
    previousHash: 'sha256:c3d4e5f6g7h8',
    verified: true
  },
  {
    id: 'audit_005',
    auditId: 'AUD-2026-001238',
    actorId: 'usr_admin_001',
    actorName: 'System Administrator',
    sessionId: 'sess_mno345',
    correlationId: 'corr_iam_001',
    module: 'iam',
    entityType: 'UserRoleAssignment',
    entityId: 'assign_006',
    action: 'create',
    actionDescription: 'Assigned role to user',
    beforeJson: null,
    afterJson: { userId: 'usr_eng_001', roleId: 'role_004', scopeType: 'project', scopeId: 'prj_002' },
    changedFields: ['userId', 'roleId', 'scopeType', 'scopeId'],
    reasonCode: 'RC-IAM-001',
    reasonNarrative: 'Temporary allocation for Highway Bridge project',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    deviceId: 'dev_laptop_001',
    timestamp: '2026-01-15T16:00:00Z',
    hash: 'sha256:e5f6g7h8i9j0',
    previousHash: 'sha256:d4e5f6g7h8i9',
    verified: true
  }
];

// Login History
export const loginHistory: LoginHistory[] = [
  {
    id: 'login_001',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    timestamp: '2026-01-15T09:15:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    deviceId: 'dev_laptop_001',
    result: 'success',
    method: 'password',
    geoHint: 'Mumbai, India'
  },
  {
    id: 'login_002',
    userId: 'usr_proc_001',
    userName: 'Vikram Singh',
    timestamp: '2026-01-15T09:30:00Z',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    deviceId: 'dev_laptop_002',
    result: 'success',
    method: 'sso',
    geoHint: 'Mumbai, India'
  },
  {
    id: 'login_003',
    userId: 'usr_unknown',
    userName: 'unknown@example.com',
    timestamp: '2026-01-15T10:00:00Z',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 Firefox/121.0',
    deviceId: 'dev_unknown_001',
    result: 'fail',
    method: 'password',
    geoHint: 'Unknown',
    failureReason: 'Invalid credentials'
  },
  {
    id: 'login_004',
    userId: 'usr_unknown',
    userName: 'unknown@example.com',
    timestamp: '2026-01-15T10:01:00Z',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 Firefox/121.0',
    deviceId: 'dev_unknown_001',
    result: 'fail',
    method: 'password',
    geoHint: 'Unknown',
    failureReason: 'Invalid credentials'
  },
  {
    id: 'login_005',
    userId: 'usr_unknown',
    userName: 'unknown@example.com',
    timestamp: '2026-01-15T10:02:00Z',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 Firefox/121.0',
    deviceId: 'dev_unknown_001',
    result: 'locked',
    method: 'password',
    geoHint: 'Unknown',
    failureReason: 'Account locked after 3 failed attempts'
  },
  {
    id: 'login_006',
    userId: 'usr_store_001',
    userName: 'Suresh Nair',
    timestamp: '2026-01-15T14:00:00Z',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 Mobile Safari/17.0',
    deviceId: 'dev_mobile_001',
    result: 'success',
    method: 'otp',
    geoHint: 'Mumbai, India'
  }
];

// Active Sessions
export const sessions: Session[] = [
  {
    id: 'sess_001',
    sessionId: 'sess_abc123',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    deviceId: 'dev_laptop_001',
    deviceName: 'Work Laptop - Dell XPS 15',
    deviceType: 'desktop',
    browser: 'Chrome 120.0',
    os: 'Windows 11',
    ipAddress: '192.168.1.100',
    location: 'Mumbai, India',
    createdAt: '2026-01-15T09:15:00Z',
    lastSeenAt: '2026-01-15T16:30:00Z',
    isActive: true
  },
  {
    id: 'sess_002',
    sessionId: 'sess_def456',
    userId: 'usr_proc_001',
    userName: 'Vikram Singh',
    deviceId: 'dev_laptop_002',
    deviceName: 'Work Laptop - HP EliteBook',
    deviceType: 'desktop',
    browser: 'Chrome 120.0',
    os: 'Windows 10',
    ipAddress: '192.168.1.105',
    location: 'Mumbai, India',
    createdAt: '2026-01-15T09:30:00Z',
    lastSeenAt: '2026-01-15T16:25:00Z',
    isActive: true
  },
  {
    id: 'sess_003',
    sessionId: 'sess_ghi789',
    userId: 'usr_store_001',
    userName: 'Suresh Nair',
    deviceId: 'dev_mobile_001',
    deviceName: 'iPhone 14 Pro',
    deviceType: 'mobile',
    browser: 'Safari 17.0',
    os: 'iOS 17.2',
    ipAddress: '10.0.0.50',
    location: 'Mumbai, India',
    createdAt: '2026-01-15T14:00:00Z',
    lastSeenAt: '2026-01-15T16:20:00Z',
    isActive: true
  },
  {
    id: 'sess_004',
    sessionId: 'sess_jkl012',
    userId: 'usr_acct_001',
    userName: 'Priya Sharma',
    deviceId: 'dev_laptop_003',
    deviceName: 'Work Laptop - Lenovo ThinkPad',
    deviceType: 'desktop',
    browser: 'Chrome 120.0',
    os: 'Windows 11',
    ipAddress: '192.168.1.115',
    location: 'Mumbai, India',
    createdAt: '2026-01-15T08:00:00Z',
    lastSeenAt: '2026-01-15T16:15:00Z',
    isActive: true
  },
  {
    id: 'sess_005',
    sessionId: 'sess_mno345',
    userId: 'usr_eng_001',
    userName: 'Amit Patel',
    deviceId: 'dev_tablet_001',
    deviceName: 'iPad Pro 12.9"',
    deviceType: 'tablet',
    browser: 'Safari 17.0',
    os: 'iPadOS 17.2',
    ipAddress: '10.0.0.75',
    location: 'Pune, India',
    createdAt: '2026-01-14T10:00:00Z',
    lastSeenAt: '2026-01-15T12:00:00Z',
    revokedAt: '2026-01-15T12:30:00Z',
    revokedBy: 'usr_admin_001',
    revokeReason: 'Device reported lost',
    isActive: false
  }
];

// Security Events
export const securityEvents: SecurityEvent[] = [
  {
    id: 'sec_001',
    eventId: 'SEC-2026-0001',
    type: 'brute_force',
    severity: 'high',
    userId: 'usr_unknown',
    userName: 'unknown@example.com',
    description: 'Multiple failed login attempts detected',
    detailsJson: {
      attemptCount: 3,
      timeWindow: '2 minutes',
      ipAddress: '203.0.113.45',
      accountLocked: true
    },
    timestamp: '2026-01-15T10:02:00Z',
    status: 'resolved',
    handledBy: 'usr_admin_001',
    handledAt: '2026-01-15T10:15:00Z',
    resolutionNotes: 'Account locked automatically. IP address added to watchlist.'
  },
  {
    id: 'sec_002',
    eventId: 'SEC-2026-0002',
    type: 'privileged_change',
    severity: 'medium',
    userId: 'usr_admin_001',
    userName: 'System Administrator',
    description: 'Privileged role assignment detected',
    detailsJson: {
      action: 'role_assignment',
      targetUser: 'usr_eng_001',
      roleAssigned: 'Site Engineer',
      scope: 'Project: Highway Bridge Phase 2'
    },
    timestamp: '2026-01-15T16:00:00Z',
    status: 'acknowledged',
    handledBy: 'usr_admin_001',
    handledAt: '2026-01-15T16:05:00Z',
    resolutionNotes: 'Legitimate temporary allocation for project duration.'
  },
  {
    id: 'sec_003',
    eventId: 'SEC-2026-0003',
    type: 'sensitive_read',
    severity: 'low',
    userId: 'usr_hr_001',
    userName: 'HR Manager',
    description: 'Sensitive field access logged',
    detailsJson: {
      entityType: 'Employee',
      entityId: 'emp_045',
      fieldsAccessed: ['salary', 'bank_account'],
      reason: 'Payroll processing'
    },
    timestamp: '2026-01-15T11:30:00Z',
    status: 'open'
  },
  {
    id: 'sec_004',
    eventId: 'SEC-2026-0004',
    type: 'export_bulk',
    severity: 'medium',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    description: 'Bulk export operation detected',
    detailsJson: {
      entityType: 'PurchaseOrder',
      recordCount: 250,
      format: 'Excel',
      reason: 'Monthly report generation'
    },
    timestamp: '2026-01-15T15:45:00Z',
    status: 'acknowledged',
    handledBy: 'usr_pm_001',
    handledAt: '2026-01-15T15:50:00Z',
    resolutionNotes: 'Legitimate monthly reporting requirement.'
  },
  {
    id: 'sec_005',
    eventId: 'SEC-2026-0005',
    type: 'impossible_travel',
    severity: 'critical',
    userId: 'usr_pm_002',
    userName: 'Amit Patel',
    description: 'Login from geographically impossible location',
    detailsJson: {
      previousLogin: {
        timestamp: '2026-01-15T08:00:00Z',
        location: 'Mumbai, India',
        ipAddress: '192.168.1.120'
      },
      currentLogin: {
        timestamp: '2026-01-15T09:00:00Z',
        location: 'London, UK',
        ipAddress: '81.2.69.142'
      },
      timeDifference: '1 hour',
      distance: '7192 km'
    },
    timestamp: '2026-01-15T09:00:00Z',
    status: 'open'
  }
];

// Reason Codes
export const reasonCodes: ReasonCode[] = [
  { id: 'rc_001', code: 'RC-APPROVE-001', module: 'mat', description: 'Standard approval - vendor verified', requiresNarrative: true, minNarrativeLength: 20 },
  { id: 'rc_002', code: 'RC-REJECT-001', module: 'mat', description: 'Rejection - non-compliant', requiresNarrative: true, minNarrativeLength: 50 },
  { id: 'rc_003', code: 'RC-PAY-001', module: 'fin', description: 'Payment - invoice due', requiresNarrative: true, minNarrativeLength: 20 },
  { id: 'rc_004', code: 'RC-IAM-001', module: 'iam', description: 'Role assignment - project allocation', requiresNarrative: true, minNarrativeLength: 30 },
  { id: 'rc_005', code: 'RC-CANCEL-001', module: 'mat', description: 'Cancellation - vendor unable to supply', requiresNarrative: true, minNarrativeLength: 50 },
  { id: 'rc_006', code: 'RC-MODIFY-001', module: 'org', description: 'Modification - scope change', requiresNarrative: true, minNarrativeLength: 50 },
  { id: 'rc_007', code: 'RC-OVERRIDE-001', module: 'wf', description: 'Override - emergency approval', requiresNarrative: true, minNarrativeLength: 100 },
  { id: 'rc_008', code: 'RC-EXPORT-001', module: 'rpt', description: 'Export - reporting requirement', requiresNarrative: true, minNarrativeLength: 20 }
];

// Hash Chain Verifications
export const hashChainVerifications: HashChainVerification[] = [
  {
    id: 'verify_001',
    verificationDate: '2026-01-15T02:00:00Z',
    totalRecords: 45678,
    verifiedRecords: 45678,
    brokenLinks: 0,
    status: 'success',
    brokenRecordIds: [],
    verifiedBy: 'system'
  },
  {
    id: 'verify_002',
    verificationDate: '2026-01-14T02:00:00Z',
    totalRecords: 45234,
    verifiedRecords: 45234,
    brokenLinks: 0,
    status: 'success',
    brokenRecordIds: [],
    verifiedBy: 'system'
  },
  {
    id: 'verify_003',
    verificationDate: '2026-01-13T02:00:00Z',
    totalRecords: 44890,
    verifiedRecords: 44889,
    brokenLinks: 1,
    status: 'broken',
    brokenRecordIds: ['audit_12345'],
    verifiedBy: 'system'
  }
];

// Retention Policies
export const retentionPolicies: RetentionPolicy[] = [
  { id: 'ret_001', module: 'mat', entityType: 'PurchaseOrder', retentionDays: 2555, archiveToColdStorage: true, autoDelete: false },
  { id: 'ret_002', module: 'fin', entityType: 'Payment', retentionDays: 2555, archiveToColdStorage: true, autoDelete: false },
  { id: 'ret_003', module: 'hr', entityType: 'Payslip', retentionDays: 1825, archiveToColdStorage: true, autoDelete: false },
  { id: 'ret_004', module: 'audit', entityType: 'AuditLog', retentionDays: 3650, archiveToColdStorage: true, autoDelete: false }
];

// Statistics
export const auditStats = {
  totalAuditRecords: 45678,
  todayRecords: 234,
  thisWeekRecords: 1567,
  thisMonthRecords: 8934,
  verifiedRecords: 45678,
  brokenLinks: 0,
  lastVerification: '2026-01-15T02:00:00Z',
  activeSessions: sessions.filter(s => s.isActive).length,
  totalSessions: sessions.length,
  revokedSessions: sessions.filter(s => !s.isActive).length,
  openSecurityEvents: securityEvents.filter(e => e.status === 'open').length,
  totalSecurityEvents: securityEvents.length,
  criticalEvents: securityEvents.filter(e => e.severity === 'critical').length,
  failedLoginsToday: loginHistory.filter(l => l.result === 'fail' && new Date(l.timestamp).toDateString() === new Date().toDateString()).length,
  lockedAccountsToday: loginHistory.filter(l => l.result === 'locked' && new Date(l.timestamp).toDateString() === new Date().toDateString()).length
};
