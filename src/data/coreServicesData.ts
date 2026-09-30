// Part 3 — Core Enterprise ERP Foundation (Shared Services) Data

export interface SharedService {
  id: string;
  name: string;
  description: string;
  hooks: string[];
  status: 'active' | 'partial' | 'planned';
  wrappedExisting: boolean;
  existingEquivalent?: string;
}

export const sharedServices: SharedService[] = [
  {
    id: 'auth',
    name: 'Authentication Service',
    description: 'Wraps existing JWT/session logic into unified authService',
    hooks: ['validateToken', 'refreshSession', 'getUserContext'],
    status: 'active',
    wrappedExisting: true,
    existingEquivalent: 'src/middleware/auth.ts'
  },
  {
    id: 'authorization',
    name: 'Authorization Hook',
    description: 'Permission evaluation hook — delegates to existing role checks until Part 5',
    hooks: ['authorize(ctx, permissionKey, resource)'],
    status: 'partial',
    wrappedExisting: true,
    existingEquivalent: 'Role-based middleware'
  },
  {
    id: 'validation',
    name: 'Validation Service',
    description: 'Shared validation library for frontend and backend',
    hooks: ['validate(schema, input)', 'validateAsync(schema, input)'],
    status: 'active',
    wrappedExisting: true,
    existingEquivalent: 'Joi/Zod validators'
  },
  {
    id: 'audit',
    name: 'Audit Hook',
    description: 'Captures before/after state for all entity changes',
    hooks: ['audit(ctx, entity, action, before, after, reason)'],
    status: 'active',
    wrappedExisting: false
  },
  {
    id: 'event',
    name: 'Domain Event Service',
    description: 'Transactional outbox for domain events with at-least-once delivery',
    hooks: ['emit(ctx, eventName, entity, data)'],
    status: 'active',
    wrappedExisting: false
  },
  {
    id: 'notification',
    name: 'Notification Dispatch',
    description: 'Facade delegating to existing mailer/in-app until Part 18',
    hooks: ['notify(ctx, template, recipients, data)'],
    status: 'partial',
    wrappedExisting: true,
    existingEquivalent: 'SendGrid + notifications table'
  },
  {
    id: 'document',
    name: 'Document Attachment',
    description: 'Unified document upload/download with signed URLs',
    hooks: ['attach(ctx, entityType, entityId, file)', 'getSignedUrl(fileKey)'],
    status: 'active',
    wrappedExisting: true,
    existingEquivalent: 'S3 upload handler'
  },
  {
    id: 'numbering',
    name: 'Numbering Service',
    description: 'Concurrency-safe document number allocation with preview',
    hooks: ['nextNumber(ctx, docType)', 'previewNumber(ctx, docType)'],
    status: 'active',
    wrappedExisting: false
  },
  {
    id: 'transaction',
    name: 'Transaction Helper',
    description: 'Guarantees business write + audit + outbox in one DB transaction',
    hooks: ['transaction(fn)', 'withRetry(fn, attempts)'],
    status: 'active',
    wrappedExisting: false
  },
  {
    id: 'job',
    name: 'Job Framework',
    description: 'Scheduled and on-demand jobs with idempotency keys',
    hooks: ['scheduleJob(type, payload, runAt)', 'executeJob(jobId)'],
    status: 'active',
    wrappedExisting: true,
    existingEquivalent: 'BullMQ + cron'
  },
  {
    id: 'logging',
    name: 'Structured Logging',
    description: 'JSON logging with correlationId propagation and PII redaction',
    hooks: ['log(level, message, metadata)', 'setCorrelationId(id)'],
    status: 'active',
    wrappedExisting: true,
    existingEquivalent: 'Winston logger'
  },
  {
    id: 'error',
    name: 'Error Envelope',
    description: 'Standardized error responses per SA-11/SA-17',
    hooks: ['formatError(error, correlationId)', 'mapToUserMessage(errorCode)'],
    status: 'active',
    wrappedExisting: true,
    existingEquivalent: 'Error handler middleware'
  },
  {
    id: 'money',
    name: 'Money Utilities',
    description: 'Decimal arithmetic, rounding modes, Indian formatting',
    hooks: ['formatCurrency(amount, currency)', 'calculateGST(base, rate)', 'roundDecimal(value, places)'],
    status: 'active',
    wrappedExisting: false
  },
  {
    id: 'context',
    name: 'Request Context',
    description: 'Per-request context with userId, companyId, correlationId, permissions',
    hooks: ['createContext(req)', 'getContext()', 'setActiveProject(projectId)'],
    status: 'active',
    wrappedExisting: false
  }
];

export interface RequestContext {
  field: string;
  type: string;
  description: string;
  example: string;
}

export const requestContextFields: RequestContext[] = [
  { field: 'userId', type: 'string', description: 'Authenticated user ID', example: 'usr_a1b2c3d4' },
  { field: 'companyId', type: 'string', description: 'Active company scope', example: 'comp_001' },
  { field: 'activeProjectId', type: 'string | null', description: 'Selected project context', example: 'prj_2025_003' },
  { field: 'activeSiteId', type: 'string | null', description: 'Selected site context', example: 'site_riverside_c' },
  { field: 'roles', type: 'string[]', description: 'User roles in current scope', example: '["pm", "approver"]' },
  { field: 'permissions', type: 'string[]', description: 'Evaluated permission keys snapshot', example: '["po.create", "po.approve"]' },
  { field: 'locale', type: 'string', description: 'User locale preference', example: 'en-IN' },
  { field: 'timezone', type: 'string', description: 'User timezone', example: 'Asia/Kolkata' },
  { field: 'correlationId', type: 'string', description: 'Request correlation ID for tracing', example: 'corr_xyz789' },
  { field: 'deviceInfo', type: 'object', description: 'Client device/browser info', example: '{browser: "Chrome", os: "Windows"}' }
];

export interface OutboxEvent {
  eventId: string;
  name: string;
  aggregateType: string;
  aggregateId: string;
  companyId: string;
  projectId: string | null;
  siteId: string | null;
  payload: Record<string, any>;
  createdAt: string;
  publishedAt: string | null;
  attempts: number;
  lastError: string | null;
  status: 'pending' | 'published' | 'failed' | 'dead_letter';
}

export const outboxEvents: OutboxEvent[] = [
  {
    eventId: 'evt_001',
    name: 'purchase_order.created',
    aggregateType: 'PurchaseOrder',
    aggregateId: 'po_2026_0142',
    companyId: 'comp_001',
    projectId: 'prj_2025_003',
    siteId: null,
    payload: { poNumber: 'PO-2026-0142', vendorId: 'vend_045', totalAmount: 2450000 },
    createdAt: '2026-01-15T08:30:00Z',
    publishedAt: '2026-01-15T08:30:01Z',
    attempts: 1,
    lastError: null,
    status: 'published'
  },
  {
    eventId: 'evt_002',
    name: 'goods_receipt.posted',
    aggregateType: 'GoodsReceipt',
    aggregateId: 'grn_2026_0234',
    companyId: 'comp_001',
    projectId: 'prj_2025_003',
    siteId: 'site_riverside_c',
    payload: { grnNumber: 'GRN-2026-0234', poId: 'po_2026_0140', receivedBy: 'usr_r123' },
    createdAt: '2026-01-15T09:15:00Z',
    publishedAt: '2026-01-15T09:15:02Z',
    attempts: 1,
    lastError: null,
    status: 'published'
  },
  {
    eventId: 'evt_003',
    name: 'approval.requested',
    aggregateType: 'Approval',
    aggregateId: 'apr_001',
    companyId: 'comp_001',
    projectId: null,
    siteId: null,
    payload: { entityType: 'PurchaseOrder', entityId: 'po_2026_0142', approverId: 'usr_mgmt_001' },
    createdAt: '2026-01-15T08:30:05Z',
    publishedAt: null,
    attempts: 3,
    lastError: 'Socket.IO room join failed: room not found',
    status: 'failed'
  },
  {
    eventId: 'evt_004',
    name: 'inventory.updated',
    aggregateType: 'Inventory',
    aggregateId: 'inv_12345',
    companyId: 'comp_001',
    projectId: 'prj_2025_003',
    siteId: 'site_riverside_c',
    payload: { itemId: 'item_steel_16mm', qtyChange: -2.5, newBalance: 6.3 },
    createdAt: '2026-01-15T09:20:00Z',
    publishedAt: '2026-01-15T09:20:01Z',
    attempts: 1,
    lastError: null,
    status: 'published'
  },
  {
    eventId: 'evt_005',
    name: 'payment.created',
    aggregateType: 'Payment',
    aggregateId: 'pay_2026_0089',
    companyId: 'comp_001',
    projectId: null,
    siteId: null,
    payload: { paymentNumber: 'PAY-2026-0089', invoiceId: 'inv_2025_045', amount: 1875000 },
    createdAt: '2026-01-15T10:00:00Z',
    publishedAt: null,
    attempts: 5,
    lastError: 'Dead letter: max retries exceeded',
    status: 'dead_letter'
  }
];

export interface NumberSeries {
  companyId: string;
  projectId: string | null;
  docType: string;
  fy: string;
  prefixTemplate: string;
  nextValue: number;
  padding: number;
  resetRule: string;
  isGapless: boolean;
  lastGenerated: string | null;
}

export const numberSeries: NumberSeries[] = [
  {
    companyId: 'comp_001',
    projectId: null,
    docType: 'PURCHASE_ORDER',
    fy: '2025-26',
    prefixTemplate: 'PO-{FY}-{SEQ}',
    nextValue: 143,
    padding: 4,
    resetRule: 'ANNUAL',
    isGapless: true,
    lastGenerated: '2026-01-15T08:30:00Z'
  },
  {
    companyId: 'comp_001',
    projectId: 'prj_2025_003',
    docType: 'MATERIAL_REQUEST',
    fy: '2025-26',
    prefixTemplate: 'MR-{PROJECT}-{SEQ}',
    nextValue: 257,
    padding: 4,
    resetRule: 'ANNUAL',
    isGapless: false,
    lastGenerated: '2026-01-15T07:45:00Z'
  },
  {
    companyId: 'comp_001',
    projectId: null,
    docType: 'GOODS_RECEIPT',
    fy: '2025-26',
    prefixTemplate: 'GRN-{FY}-{SEQ}',
    nextValue: 235,
    padding: 4,
    resetRule: 'ANNUAL',
    isGapless: true,
    lastGenerated: '2026-01-15T09:15:00Z'
  },
  {
    companyId: 'comp_001',
    projectId: null,
    docType: 'INVOICE',
    fy: '2025-26',
    prefixTemplate: 'INV-{FY}-{SEQ}',
    nextValue: 46,
    padding: 4,
    resetRule: 'ANNUAL',
    isGapless: true,
    lastGenerated: '2026-01-14T16:20:00Z'
  },
  {
    companyId: 'comp_001',
    projectId: null,
    docType: 'PAYMENT',
    fy: '2025-26',
    prefixTemplate: 'PAY-{FY}-{SEQ}',
    nextValue: 90,
    padding: 4,
    resetRule: 'ANNUAL',
    isGapless: true,
    lastGenerated: '2026-01-15T10:00:00Z'
  }
];

export interface BackgroundJob {
  jobId: string;
  type: string;
  payload: Record<string, any>;
  status: 'scheduled' | 'running' | 'completed' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  runAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
  correlationId: string;
}

export const backgroundJobs: BackgroundJob[] = [
  {
    jobId: 'job_001',
    type: 'DailyAttendanceSync',
    payload: { date: '2026-01-15', siteId: 'site_riverside_c' },
    status: 'completed',
    attempts: 1,
    maxAttempts: 3,
    runAt: '2026-01-15T06:00:00Z',
    startedAt: '2026-01-15T06:00:01Z',
    finishedAt: '2026-01-15T06:00:45Z',
    error: null,
    correlationId: 'corr_att_001'
  },
  {
    jobId: 'job_002',
    type: 'ReportCacheRefresh',
    payload: { reportType: 'stock_statement', companyId: 'comp_001' },
    status: 'running',
    attempts: 1,
    maxAttempts: 2,
    runAt: '2026-01-15T12:00:00Z',
    startedAt: '2026-01-15T12:00:02Z',
    finishedAt: null,
    error: null,
    correlationId: 'corr_rpt_002'
  },
  {
    jobId: 'job_003',
    type: 'PaymentReminder',
    payload: { invoiceId: 'inv_2025_042', daysOverdue: 15 },
    status: 'failed',
    attempts: 3,
    maxAttempts: 3,
    runAt: '2026-01-15T10:00:00Z',
    startedAt: '2026-01-15T10:00:01Z',
    finishedAt: '2026-01-15T10:00:12Z',
    error: 'Email service timeout',
    correlationId: 'corr_pay_003'
  },
  {
    jobId: 'job_004',
    type: 'InventoryAlert',
    payload: { threshold: 'low_stock', companyId: 'comp_001' },
    status: 'retrying',
    attempts: 2,
    maxAttempts: 5,
    runAt: '2026-01-15T08:00:00Z',
    startedAt: '2026-01-15T08:00:01Z',
    finishedAt: null,
    error: 'Redis connection lost',
    correlationId: 'corr_inv_004'
  },
  {
    jobId: 'job_005',
    type: 'NotificationDigest',
    payload: { userId: 'usr_pm_001', frequency: 'weekly' },
    status: 'scheduled',
    attempts: 0,
    maxAttempts: 1,
    runAt: '2026-01-16T09:00:00Z',
    startedAt: null,
    finishedAt: null,
    error: null,
    correlationId: 'corr_not_005'
  }
];

export interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  details: string;
  lastCheck: string;
}

export const healthStatus: HealthStatus[] = [
  { service: 'Database (PostgreSQL)', status: 'healthy', latency: 12, details: 'Connection pool: 28/50 active', lastCheck: '2026-01-15T12:05:00Z' },
  { service: 'Cache (Redis)', status: 'healthy', latency: 3, details: 'Memory: 45% used, 1.2k keys', lastCheck: '2026-01-15T12:05:00Z' },
  { service: 'Queue (BullMQ)', status: 'degraded', latency: 45, details: 'Queue depth: 3, 1 job retrying', lastCheck: '2026-01-15T12:05:00Z' },
  { service: 'Storage (S3)', status: 'healthy', latency: 89, details: 'Presigned URL generation OK', lastCheck: '2026-01-15T12:05:00Z' },
  { service: 'Email (SendGrid)', status: 'healthy', latency: 234, details: 'API rate: 45/100 per min', lastCheck: '2026-01-15T12:05:00Z' },
  { service: 'Socket.IO', status: 'healthy', latency: 8, details: 'Active connections: 142', lastCheck: '2026-01-15T12:05:00Z' }
];

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  reason: string | null;
  correlationId: string;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
}

export const recentAuditLogs: AuditLog[] = [
  {
    id: 'audit_001',
    userId: 'usr_pm_001',
    action: 'create',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    before: null,
    after: { poNumber: 'PO-2026-0142', status: 'pending_approval', totalAmount: 2450000 },
    reason: null,
    correlationId: 'corr_po_001',
    timestamp: '2026-01-15T08:30:00Z',
    ipAddress: '192.168.1.100',
    deviceInfo: 'Chrome/Windows'
  },
  {
    id: 'audit_002',
    userId: 'usr_store_001',
    action: 'update',
    entityType: 'Inventory',
    entityId: 'inv_12345',
    before: { qty: 8.8, balance: 8.8 },
    after: { qty: 6.3, balance: 6.3 },
    reason: 'Material issued to site',
    correlationId: 'corr_grn_002',
    timestamp: '2026-01-15T09:20:00Z',
    ipAddress: '192.168.1.105',
    deviceInfo: 'Mobile/Android'
  },
  {
    id: 'audit_003',
    userId: 'usr_finance_001',
    action: 'create',
    entityType: 'Payment',
    entityId: 'pay_2026_0089',
    before: null,
    after: { paymentNumber: 'PAY-2026-0089', amount: 1875000, status: 'pending_approval' },
    reason: null,
    correlationId: 'corr_pay_003',
    timestamp: '2026-01-15T10:00:00Z',
    ipAddress: '192.168.1.110',
    deviceInfo: 'Chrome/Windows'
  }
];

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  serviceMethod: string;
  status: 'active' | 'observe' | 'disabled';
}

export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-CORE-01',
    stage: 'VERIFY',
    control: 'Transaction helper invokes protocol.check before commit for controllable actions',
    enforcement: 'BLOCK',
    serviceMethod: 'BaseService.transaction()',
    status: 'observe'
  },
  {
    id: 'CP-CORE-02',
    stage: 'RECORD',
    control: 'Action ledger hook invoked for every lifecycle action through shared services',
    enforcement: 'BLOCK',
    serviceMethod: 'BaseService.audit()',
    status: 'observe'
  }
];

export const errorCodes = [
  { code: 'AUTH_001', message: 'Invalid or expired token', httpStatus: 401, userMessage: 'Your session has expired. Please log in again.' },
  { code: 'AUTH_002', message: 'Insufficient permissions', httpStatus: 403, userMessage: 'You do not have permission to perform this action.' },
  { code: 'VAL_001', message: 'Validation failed', httpStatus: 400, userMessage: 'Please check the form for errors.' },
  { code: 'VAL_002', message: 'Duplicate entry', httpStatus: 409, userMessage: 'This record already exists.' },
  { code: 'NOT_001', message: 'Resource not found', httpStatus: 404, userMessage: 'The requested record could not be found.' },
  { code: 'CONFLICT_001', message: 'Optimistic lock conflict', httpStatus: 409, userMessage: 'This record was modified by another user. Please refresh and try again.' },
  { code: 'IDEM_001', message: 'Idempotency key conflict', httpStatus: 409, userMessage: 'This request was already processed.' },
  { code: 'RATE_001', message: 'Rate limit exceeded', httpStatus: 429, userMessage: 'Too many requests. Please wait a moment.' },
  { code: 'INT_001', message: 'Integration failure', httpStatus: 502, userMessage: 'Unable to connect to external service. Please try again later.' },
  { code: 'SYS_001', message: 'Internal server error', httpStatus: 500, userMessage: 'An unexpected error occurred. Our team has been notified.' }
];
