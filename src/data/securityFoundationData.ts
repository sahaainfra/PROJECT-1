// Part 9 — Secure-by-Design Foundation Data

export interface RouteRegistry {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  pathPattern: string;
  apiVersion: string;
  permissionKey: string;
  scopeRule: 'company' | 'project' | 'site' | 'department' | 'resource_owner' | 'public';
  schemaRef: string;
  rateLimitGroup: string;
  idempotencyRequired: boolean;
  auditEvent: string;
  ownerModule: string;
  registeredAt: string;
  status: 'active' | 'deprecated' | 'monitor';
}

export interface PipelinePolicy {
  id: string;
  gate: 'sast' | 'dast' | 'secrets' | 'dependency' | 'container' | 'licence' | 'sbom' | 'security_tests' | 'unit' | 'integration' | 'regression';
  environment: 'development' | 'staging' | 'production';
  blockThreshold: 'critical' | 'high' | 'medium' | 'low' | 'none';
  exceptionRequires: string;
  approvedBy: string;
  effectiveFrom: string;
}

export interface PipelineRun {
  id: string;
  buildRef: string;
  commitSha: string;
  gate: string;
  result: 'pass' | 'fail' | 'waived';
  findingsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  reportDocumentId?: string;
  timestamp: string;
  duration: number;
}

export interface RiskAcceptance {
  id: string;
  findingRef: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  justification: string;
  compensatingControls: string;
  approvedBy: string;
  coApprovedBy?: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  requestedBy: string;
  requestedAt: string;
}

export interface Dependency {
  id: string;
  ecosystem: 'npm' | 'pypi' | 'maven' | 'nuget' | 'go' | 'cargo';
  package: string;
  version: string;
  sourceRegistry: string;
  licenceSpdx: string;
  openAdvisories: number;
  addedBy: string;
  reviewedBy: string;
  status: 'approved' | 'blocked' | 'deprecated' | 'pending_review';
  lastReviewedAt: string;
}

export interface Credential {
  id: string;
  userId: string;
  userName: string;
  algorithm: 'argon2id' | 'bcrypt' | 'scrypt' | 'legacy';
  hashUpdated: boolean;
  legacyMigratedAt?: string;
  lastPasswordChange: string;
  mfaEnabled: boolean;
  mfaType?: 'totp' | 'webauthn';
  failedAttempts: number;
  lockedUntil?: string;
}

export interface SecurityPolicy {
  id: string;
  category: 'password' | 'session' | 'mfa' | 'rate_limit' | 'upload' | 'cors' | 'csp';
  key: string;
  value: any;
  effectiveFrom: string;
  approvedBy: string;
}

export interface MfaFactor {
  id: string;
  userId: string;
  userName: string;
  type: 'totp' | 'webauthn';
  label: string;
  verifiedAt: string;
  lastUsedAt: string;
  revokedAt?: string;
  isActive: boolean;
}

export interface RateLimitPolicy {
  id: string;
  group: 'login' | 'otp' | 'reset' | 'api' | 'upload' | 'messaging' | 'search' | 'report' | 'import' | 'export' | 'socket';
  role?: string;
  limit: number;
  windowSeconds: number;
  burst: number;
  action: 'throttle' | 'block' | 'challenge';
}

export interface UploadPolicy {
  id: string;
  context: string;
  allowedMime: string[];
  magicByteCheck: boolean;
  maxBytes: number;
  scanRequired: boolean;
  storageClass: 'private' | 'public' | 'archive';
}

export interface SecretRef {
  id: string;
  name: string;
  environment: 'development' | 'staging' | 'production';
  vaultPath: string;
  owner: string;
  rotationDays: number;
  lastRotatedAt: string;
  nextRotationAt: string;
}

export interface LegacyFinding {
  id: string;
  type: 'string_sql' | 'missing_authz' | 'hardcoded_secret' | 'tls_verification_disabled' | 'wildcard_cors' | 'unsafe_upload' | 'verbose_errors' | 'client_only_authz';
  location: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remediationPlan: string;
  flagCode: string;
  status: 'open' | 'planned' | 'fixed_behind_flag' | 'verified' | 'closed';
  discoveredAt: string;
  fixedAt?: string;
}

// Route Registry (Sample)
export const routeRegistry: RouteRegistry[] = [
  {
    id: 'route_001',
    method: 'GET',
    pathPattern: '/api/v1/projects/:id',
    apiVersion: 'v1',
    permissionKey: 'org.project.view',
    scopeRule: 'project',
    schemaRef: 'project.get.schema.json',
    rateLimitGroup: 'api',
    idempotencyRequired: false,
    auditEvent: 'project.viewed',
    ownerModule: 'org',
    registeredAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'route_002',
    method: 'POST',
    pathPattern: '/api/v1/purchase-orders',
    apiVersion: 'v1',
    permissionKey: 'mat.po.create',
    scopeRule: 'project',
    schemaRef: 'po.create.schema.json',
    rateLimitGroup: 'api',
    idempotencyRequired: true,
    auditEvent: 'po.created',
    ownerModule: 'mat',
    registeredAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'route_003',
    method: 'POST',
    pathPattern: '/api/v1/payments',
    apiVersion: 'v1',
    permissionKey: 'fin.payment.create',
    scopeRule: 'company',
    schemaRef: 'payment.create.schema.json',
    rateLimitGroup: 'api',
    idempotencyRequired: true,
    auditEvent: 'payment.created',
    ownerModule: 'fin',
    registeredAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'route_004',
    method: 'GET',
    pathPattern: '/api/v1/audit/logs',
    apiVersion: 'v1',
    permissionKey: 'audit.log.view',
    scopeRule: 'company',
    schemaRef: 'audit.list.schema.json',
    rateLimitGroup: 'api',
    idempotencyRequired: false,
    auditEvent: 'audit.viewed',
    ownerModule: 'audit',
    registeredAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'route_005',
    method: 'POST',
    pathPattern: '/api/v1/auth/login',
    apiVersion: 'v1',
    permissionKey: 'public',
    scopeRule: 'public',
    schemaRef: 'login.schema.json',
    rateLimitGroup: 'login',
    idempotencyRequired: false,
    auditEvent: 'login.attempted',
    ownerModule: 'auth',
    registeredAt: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'route_006',
    method: 'POST',
    pathPattern: '/api/v1/documents/upload',
    apiVersion: 'v1',
    permissionKey: 'doc.upload',
    scopeRule: 'project',
    schemaRef: 'upload.schema.json',
    rateLimitGroup: 'upload',
    idempotencyRequired: true,
    auditEvent: 'document.uploaded',
    ownerModule: 'doc',
    registeredAt: '2026-01-01T00:00:00Z',
    status: 'active'
  }
];

// Pipeline Policies
export const pipelinePolicies: PipelinePolicy[] = [
  {
    id: 'policy_001',
    gate: 'secrets',
    environment: 'production',
    blockThreshold: 'critical',
    exceptionRequires: 'CISO approval',
    approvedBy: 'usr_ciso_001',
    effectiveFrom: '2026-01-01T00:00:00Z'
  },
  {
    id: 'policy_002',
    gate: 'dependency',
    environment: 'production',
    blockThreshold: 'high',
    exceptionRequires: 'Security Lead approval',
    approvedBy: 'usr_sec_lead_001',
    effectiveFrom: '2026-01-01T00:00:00Z'
  },
  {
    id: 'policy_003',
    gate: 'sast',
    environment: 'production',
    blockThreshold: 'critical',
    exceptionRequires: 'CISO + Management approval',
    approvedBy: 'usr_ciso_001',
    effectiveFrom: '2026-01-01T00:00:00Z'
  },
  {
    id: 'policy_004',
    gate: 'security_tests',
    environment: 'production',
    blockThreshold: 'none',
    exceptionRequires: 'Security Lead approval',
    approvedBy: 'usr_sec_lead_001',
    effectiveFrom: '2026-01-01T00:00:00Z'
  }
];

// Pipeline Runs (Recent)
export const pipelineRuns: PipelineRun[] = [
  {
    id: 'run_001',
    buildRef: 'build-2026-0115-001',
    commitSha: 'a1b2c3d4e5f6',
    gate: 'secrets',
    result: 'pass',
    findingsBySeverity: { critical: 0, high: 0, medium: 0, low: 0, info: 2 },
    timestamp: '2026-01-15T10:00:00Z',
    duration: 45
  },
  {
    id: 'run_002',
    buildRef: 'build-2026-0115-002',
    commitSha: 'b2c3d4e5f6g7',
    gate: 'dependency',
    result: 'pass',
    findingsBySeverity: { critical: 0, high: 1, medium: 3, low: 12, info: 45 },
    timestamp: '2026-01-15T10:05:00Z',
    duration: 120
  },
  {
    id: 'run_003',
    buildRef: 'build-2026-0115-003',
    commitSha: 'c3d4e5f6g7h8',
    gate: 'sast',
    result: 'fail',
    findingsBySeverity: { critical: 2, high: 5, medium: 12, low: 28, info: 67 },
    reportDocumentId: 'doc_sast_001',
    timestamp: '2026-01-15T10:10:00Z',
    duration: 180
  },
  {
    id: 'run_004',
    buildRef: 'build-2026-0115-004',
    commitSha: 'd4e5f6g7h8i9',
    gate: 'security_tests',
    result: 'pass',
    findingsBySeverity: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    timestamp: '2026-01-15T10:15:00Z',
    duration: 90
  }
];

// Risk Acceptances
export const riskAcceptances: RiskAcceptance[] = [
  {
    id: 'risk_001',
    findingRef: 'SAST-2026-001',
    severity: 'high',
    justification: 'Legacy code path scheduled for refactor in Q2 2026. Compensating control: enhanced monitoring and rate limiting.',
    compensatingControls: 'Rate limiting enabled, enhanced logging, weekly review',
    approvedBy: 'usr_sec_lead_001',
    coApprovedBy: 'usr_mgmt_001',
    expiresAt: '2026-06-30T23:59:59Z',
    status: 'active',
    requestedBy: 'usr_dev_001',
    requestedAt: '2026-01-10T14:00:00Z'
  },
  {
    id: 'risk_002',
    findingRef: 'DEP-2026-045',
    severity: 'medium',
    justification: 'Third-party library with known medium-severity vulnerability. No exploit available, vendor patch in progress.',
    compensatingControls: 'WAF rules in place, input validation enhanced',
    approvedBy: 'usr_sec_lead_001',
    expiresAt: '2026-03-31T23:59:59Z',
    status: 'active',
    requestedBy: 'usr_dev_002',
    requestedAt: '2026-01-12T09:00:00Z'
  },
  {
    id: 'risk_003',
    findingRef: 'SAST-2025-123',
    severity: 'low',
    justification: 'False positive confirmed by security team.',
    compensatingControls: 'N/A',
    approvedBy: 'usr_sec_lead_001',
    expiresAt: '2026-01-15T23:59:59Z',
    status: 'expired',
    requestedBy: 'usr_dev_003',
    requestedAt: '2025-12-01T10:00:00Z'
  }
];

// Dependencies
export const dependencies: Dependency[] = [
  {
    id: 'dep_001',
    ecosystem: 'npm',
    package: 'express',
    version: '4.18.2',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 0,
    addedBy: 'usr_dev_001',
    reviewedBy: 'usr_sec_lead_001',
    status: 'approved',
    lastReviewedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'dep_002',
    ecosystem: 'npm',
    package: 'jsonwebtoken',
    version: '9.0.2',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 0,
    addedBy: 'usr_dev_001',
    reviewedBy: 'usr_sec_lead_001',
    status: 'approved',
    lastReviewedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'dep_003',
    ecosystem: 'npm',
    package: 'lodash',
    version: '4.17.21',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 1,
    addedBy: 'usr_dev_002',
    reviewedBy: 'usr_sec_lead_001',
    status: 'approved',
    lastReviewedAt: '2026-01-05T00:00:00Z'
  },
  {
    id: 'dep_004',
    ecosystem: 'npm',
    package: 'axios',
    version: '1.6.2',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 0,
    addedBy: 'usr_dev_001',
    reviewedBy: 'usr_sec_lead_001',
    status: 'approved',
    lastReviewedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'dep_005',
    ecosystem: 'npm',
    package: 'moment',
    version: '2.29.4',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 2,
    addedBy: 'usr_dev_003',
    reviewedBy: 'usr_sec_lead_001',
    status: 'deprecated',
    lastReviewedAt: '2025-12-01T00:00:00Z'
  }
];

// Credentials (Sample)
export const credentials: Credential[] = [
  {
    id: 'cred_001',
    userId: 'usr_admin_001',
    userName: 'System Administrator',
    algorithm: 'argon2id',
    hashUpdated: true,
    lastPasswordChange: '2026-01-01T00:00:00Z',
    mfaEnabled: true,
    mfaType: 'totp',
    failedAttempts: 0
  },
  {
    id: 'cred_002',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    algorithm: 'argon2id',
    hashUpdated: true,
    lastPasswordChange: '2025-12-15T00:00:00Z',
    mfaEnabled: true,
    mfaType: 'totp',
    failedAttempts: 0
  },
  {
    id: 'cred_003',
    userId: 'usr_eng_001',
    userName: 'Amit Patel',
    algorithm: 'bcrypt',
    hashUpdated: false,
    legacyMigratedAt: '2026-01-10T08:00:00Z',
    lastPasswordChange: '2025-06-01T00:00:00Z',
    mfaEnabled: false,
    failedAttempts: 0
  },
  {
    id: 'cred_004',
    userId: 'usr_unknown',
    userName: 'unknown@example.com',
    algorithm: 'legacy',
    hashUpdated: false,
    lastPasswordChange: '2025-01-01T00:00:00Z',
    mfaEnabled: false,
    failedAttempts: 3,
    lockedUntil: '2026-01-15T10:30:00Z'
  }
];

// Security Policies
export const securityPolicies: SecurityPolicy[] = [
  {
    id: 'pol_001',
    category: 'password',
    key: 'min_length',
    value: 12,
    effectiveFrom: '2026-01-01T00:00:00Z',
    approvedBy: 'usr_ciso_001'
  },
  {
    id: 'pol_002',
    category: 'password',
    key: 'complexity_required',
    value: { uppercase: true, lowercase: true, numbers: true, special: true },
    effectiveFrom: '2026-01-01T00:00:00Z',
    approvedBy: 'usr_ciso_001'
  },
  {
    id: 'pol_003',
    category: 'session',
    key: 'idle_timeout_minutes',
    value: 30,
    effectiveFrom: '2026-01-01T00:00:00Z',
    approvedBy: 'usr_ciso_001'
  },
  {
    id: 'pol_004',
    category: 'session',
    key: 'absolute_timeout_hours',
    value: 8,
    effectiveFrom: '2026-01-01T00:00:00Z',
    approvedBy: 'usr_ciso_001'
  },
  {
    id: 'pol_005',
    category: 'mfa',
    key: 'required_roles',
    value: ['super_admin', 'management', 'accounts', 'procurement'],
    effectiveFrom: '2026-01-01T00:00:00Z',
    approvedBy: 'usr_ciso_001'
  },
  {
    id: 'pol_006',
    category: 'rate_limit',
    key: 'login_attempts',
    value: { limit: 5, window: 300, action: 'lockout' },
    effectiveFrom: '2026-01-01T00:00:00Z',
    approvedBy: 'usr_ciso_001'
  }
];

// MFA Factors
export const mfaFactors: MfaFactor[] = [
  {
    id: 'mfa_001',
    userId: 'usr_admin_001',
    userName: 'System Administrator',
    type: 'totp',
    label: 'Authenticator App',
    verifiedAt: '2026-01-01T00:00:00Z',
    lastUsedAt: '2026-01-15T09:15:00Z',
    isActive: true
  },
  {
    id: 'mfa_002',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    type: 'totp',
    label: 'Google Authenticator',
    verifiedAt: '2025-12-15T00:00:00Z',
    lastUsedAt: '2026-01-15T09:15:00Z',
    isActive: true
  },
  {
    id: 'mfa_003',
    userId: 'usr_ciso_001',
    userName: 'CISO',
    type: 'webauthn',
    label: 'YubiKey 5',
    verifiedAt: '2026-01-01T00:00:00Z',
    lastUsedAt: '2026-01-15T08:00:00Z',
    isActive: true
  }
];

// Rate Limit Policies
export const rateLimitPolicies: RateLimitPolicy[] = [
  { id: 'rl_001', group: 'login', limit: 5, windowSeconds: 300, burst: 2, action: 'block' },
  { id: 'rl_002', group: 'otp', limit: 3, windowSeconds: 60, burst: 1, action: 'block' },
  { id: 'rl_003', group: 'reset', limit: 3, windowSeconds: 3600, burst: 1, action: 'challenge' },
  { id: 'rl_004', group: 'api', limit: 1000, windowSeconds: 60, burst: 100, action: 'throttle' },
  { id: 'rl_005', group: 'upload', limit: 50, windowSeconds: 60, burst: 10, action: 'throttle' },
  { id: 'rl_006', group: 'search', limit: 100, windowSeconds: 60, burst: 20, action: 'throttle' }
];

// Upload Policies
export const uploadPolicies: UploadPolicy[] = [
  {
    id: 'up_001',
    context: 'document_attachment',
    allowedMime: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    magicByteCheck: true,
    maxBytes: 10485760,
    scanRequired: true,
    storageClass: 'private'
  },
  {
    id: 'up_002',
    context: 'profile_picture',
    allowedMime: ['image/jpeg', 'image/png'],
    magicByteCheck: true,
    maxBytes: 2097152,
    scanRequired: false,
    storageClass: 'public'
  },
  {
    id: 'up_003',
    context: 'import_data',
    allowedMime: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    magicByteCheck: true,
    maxBytes: 52428800,
    scanRequired: true,
    storageClass: 'private'
  }
];

// Secret References
export const secretRefs: SecretRef[] = [
  {
    id: 'secret_001',
    name: 'DATABASE_URL',
    environment: 'production',
    vaultPath: 'secret/data/erp/production/database',
    owner: 'usr_devops_001',
    rotationDays: 90,
    lastRotatedAt: '2026-01-01T00:00:00Z',
    nextRotationAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'secret_002',
    name: 'JWT_SECRET',
    environment: 'production',
    vaultPath: 'secret/data/erp/production/jwt',
    owner: 'usr_devops_001',
    rotationDays: 180,
    lastRotatedAt: '2025-12-01T00:00:00Z',
    nextRotationAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'secret_003',
    name: 'SENDGRID_API_KEY',
    environment: 'production',
    vaultPath: 'secret/data/erp/production/sendgrid',
    owner: 'usr_devops_001',
    rotationDays: 365,
    lastRotatedAt: '2025-06-01T00:00:00Z',
    nextRotationAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'secret_004',
    name: 'AWS_S3_KEY',
    environment: 'production',
    vaultPath: 'secret/data/erp/production/aws',
    owner: 'usr_devops_001',
    rotationDays: 90,
    lastRotatedAt: '2026-01-01T00:00:00Z',
    nextRotationAt: '2026-04-01T00:00:00Z'
  }
];

// Legacy Findings
export const legacyFindings: LegacyFinding[] = [
  {
    id: 'finding_001',
    type: 'string_sql',
    location: 'src/services/LegacyReportService.ts:145',
    severity: 'high',
    description: 'String concatenation used to build SQL query',
    remediationPlan: 'Migrate to parameterized queries using query builder',
    flagCode: 'ff.secbase.legacy_sql',
    status: 'fixed_behind_flag',
    discoveredAt: '2026-01-05T00:00:00Z',
    fixedAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'finding_002',
    type: 'missing_authz',
    location: 'src/controllers/OldProjectController.ts:23',
    severity: 'critical',
    description: 'Endpoint lacks authorization check',
    remediationPlan: 'Add permission check middleware',
    flagCode: 'ff.secbase.legacy_authz',
    status: 'planned',
    discoveredAt: '2026-01-05T00:00:00Z'
  },
  {
    id: 'finding_003',
    type: 'verbose_errors',
    location: 'src/middleware/errorHandler.ts:45',
    severity: 'medium',
    description: 'Error responses include stack traces in production',
    remediationPlan: 'Strip sensitive details from error responses',
    flagCode: 'ff.secbase.legacy_errors',
    status: 'verified',
    discoveredAt: '2026-01-05T00:00:00Z',
    fixedAt: '2026-01-12T00:00:00Z'
  },
  {
    id: 'finding_004',
    type: 'wildcard_cors',
    location: 'src/app.ts:78',
    severity: 'high',
    description: 'CORS configured with wildcard origin',
    remediationPlan: 'Restrict to specific allowed origins',
    flagCode: 'ff.secbase.legacy_cors',
    status: 'open',
    discoveredAt: '2026-01-05T00:00:00Z'
  },
  {
    id: 'finding_005',
    type: 'client_only_authz',
    location: 'src/components/AdminPanel.tsx:34',
    severity: 'medium',
    description: 'Authorization check only on client side',
    remediationPlan: 'Add server-side authorization middleware',
    flagCode: 'ff.secbase.legacy_client_authz',
    status: 'planned',
    discoveredAt: '2026-01-05T00:00:00Z'
  }
];

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-SDL-01',
    stage: 'VERIFY',
    control: 'Builds with critical vulnerabilities, exposed secrets or failing security tests blocked from production unless a time-limited risk acceptance is approved',
    enforcement: 'BLOCK',
    status: 'enforce'
  },
  {
    id: 'CP-SDL-02',
    stage: 'PLAN',
    control: 'Every route, job, socket event and webhook registered with permission, scope rule, schema and rate-limit group before merge',
    enforcement: 'BLOCK',
    status: 'enforce'
  },
  {
    id: 'CP-SDL-03',
    stage: 'EXECUTE',
    control: 'Every request passes Authenticate → Authorise → Validate → Execute → Audit; client-supplied scope IDs re-authorised',
    enforcement: 'BLOCK',
    status: 'enforce'
  },
  {
    id: 'CP-SDL-04',
    stage: 'APPROVE',
    control: 'New third-party dependencies reviewed for source, licence, maintenance and advisories before use',
    enforcement: 'BLOCK',
    status: 'enforce'
  },
  {
    id: 'CP-SDL-05',
    stage: 'MONITOR',
    control: 'Authentication failures, lockouts, rate-limit breaches and refresh-token reuse beyond thresholds',
    enforcement: 'MONITOR',
    status: 'enforce'
  }
];

// Statistics
export const securityStats = {
  totalRoutes: routeRegistry.length,
  activeRoutes: routeRegistry.filter(r => r.status === 'active').length,
  totalDependencies: dependencies.length,
  approvedDependencies: dependencies.filter(d => d.status === 'approved').length,
  deprecatedDependencies: dependencies.filter(d => d.status === 'deprecated').length,
  totalRiskAcceptances: riskAcceptances.length,
  activeRiskAcceptances: riskAcceptances.filter(r => r.status === 'active').length,
  expiredRiskAcceptances: riskAcceptances.filter(r => r.status === 'expired').length,
  totalPipelineRuns: pipelineRuns.length,
  passedPipelineRuns: pipelineRuns.filter(r => r.result === 'pass').length,
  failedPipelineRuns: pipelineRuns.filter(r => r.result === 'fail').length,
  totalLegacyFindings: legacyFindings.length,
  openFindings: legacyFindings.filter(f => f.status === 'open').length,
  fixedFindings: legacyFindings.filter(f => ['fixed_behind_flag', 'verified', 'closed'].includes(f.status)).length,
  totalCredentials: credentials.length,
  mfaEnabledUsers: credentials.filter(c => c.mfaEnabled).length,
  lockedAccounts: credentials.filter(c => c.lockedUntil && new Date(c.lockedUntil) > new Date()).length,
  totalSecrets: secretRefs.length,
  secretsDueForRotation: secretRefs.filter(s => new Date(s.nextRotationAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length
};
