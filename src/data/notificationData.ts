// Part 18 — Real-Time Notification & Collaboration Foundation Data

export interface NotificationTemplate {
  id: string;
  code: string;
  module: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';
  locale: string;
  subject: string;
  body: string;
  variables: string[];
  version: string;
  isMandatoryCategory: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCategory {
  id: string;
  code: string;
  name: string;
  module: string;
  mandatory: boolean;
  defaultChannels: string[];
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  category: string;
  title: string;
  body: string;
  entityType: string;
  entityId: string;
  link: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  readAt?: string;
  archivedAt?: string;
  createdAt: string;
  eventId?: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  userName: string;
  category: string;
  channels: string[];
  digest: 'none' | 'hourly' | 'daily';
  quietHours: {
    start: string;
    end: string;
    enabled: boolean;
  };
}

export interface DeliveryLog {
  id: string;
  notificationId: string;
  channel: string;
  provider: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  attempts: number;
  providerRef?: string;
  error?: string;
  timestamp: string;
}

export interface SocketRoom {
  id: string;
  name: string;
  type: 'user' | 'project' | 'site' | 'dept' | 'role' | 'conv' | 'doc';
  members: number;
  permission: string;
  createdAt: string;
}

export interface EventCatalogueEntry {
  id: string;
  event: string;
  module: string;
  description: string;
  rooms: string[];
  payload: string;
  legacy: boolean;
}

export interface PresenceInfo {
  entityType: string;
  entityId: string;
  users: Array<{
    userId: string;
    userName: string;
    joinedAt: string;
    isEditing: boolean;
  }>;
}

// Notification Templates
export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'tmpl_001',
    code: 'WF_TASK_ASSIGNED',
    module: 'workflow',
    channel: 'in_app',
    locale: 'en',
    subject: 'New Approval Required: {{docNumber}}',
    body: 'You have been assigned to approve {{docType}} {{docNumber}} submitted by {{submitterName}}. Amount: {{amount}}. Due: {{dueDate}}',
    variables: ['docNumber', 'docType', 'submitterName', 'amount', 'dueDate'],
    version: '1.0',
    isMandatoryCategory: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'tmpl_002',
    code: 'WF_TASK_ASSIGNED_EMAIL',
    module: 'workflow',
    channel: 'email',
    locale: 'en',
    subject: 'Action Required: Approve {{docNumber}}',
    body: 'Dear {{userName}},\n\nYou have a new approval request for {{docType}} {{docNumber}}.\n\nDetails:\n- Submitter: {{submitterName}}\n- Amount: {{amount}}\n- Due Date: {{dueDate}}\n\nPlease review and take action at your earliest convenience.\n\nClick here to view: {{link}}',
    variables: ['userName', 'docNumber', 'docType', 'submitterName', 'amount', 'dueDate', 'link'],
    version: '1.0',
    isMandatoryCategory: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'tmpl_003',
    code: 'PROTOCOL_VIOLATION',
    module: 'protocol',
    channel: 'in_app',
    locale: 'en',
    subject: 'Protocol Violation: {{violationCode}}',
    body: 'A protocol violation has been detected: {{description}}. Severity: {{severity}}. Project: {{projectName}}. Please review and take corrective action.',
    variables: ['violationCode', 'description', 'severity', 'projectName'],
    version: '1.0',
    isMandatoryCategory: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'tmpl_004',
    code: 'PROTOCOL_ESCALATION',
    module: 'protocol',
    channel: 'push',
    locale: 'en',
    subject: 'URGENT: Escalation Required',
    body: 'Protocol escalation triggered for {{violationCode}}. Immediate attention required.',
    variables: ['violationCode'],
    version: '1.0',
    isMandatoryCategory: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'tmpl_005',
    code: 'MAT_LOW_STOCK',
    module: 'materials',
    channel: 'in_app',
    locale: 'en',
    subject: 'Low Stock Alert: {{materialName}}',
    body: 'Material {{materialCode}} ({{materialName}}) is below reorder level. Current stock: {{currentStock}} {{unit}}. Reorder level: {{reorderLevel}} {{unit}}.',
    variables: ['materialCode', 'materialName', 'currentStock', 'unit', 'reorderLevel'],
    version: '1.0',
    isMandatoryCategory: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'tmpl_006',
    code: 'SECURITY_LOCKOUT',
    module: 'security',
    channel: 'email',
    locale: 'en',
    subject: 'Account Locked Due to Multiple Failed Attempts',
    body: 'Your account has been locked due to multiple failed login attempts. Please contact your administrator to unlock your account.',
    variables: ['userName', 'attemptCount', 'lockoutTime'],
    version: '1.0',
    isMandatoryCategory: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

// Notification Categories
export const notificationCategories: NotificationCategory[] = [
  {
    id: 'cat_001',
    code: 'workflow_approvals',
    name: 'Workflow Approvals',
    module: 'workflow',
    mandatory: false,
    defaultChannels: ['in_app', 'email'],
    description: 'Notifications for approval tasks and workflow events'
  },
  {
    id: 'cat_002',
    code: 'protocol_violations',
    name: 'Protocol Violations',
    module: 'protocol',
    mandatory: true,
    defaultChannels: ['in_app', 'push', 'email'],
    description: 'Critical protocol violations and escalations'
  },
  {
    id: 'cat_003',
    code: 'material_alerts',
    name: 'Material Alerts',
    module: 'materials',
    mandatory: false,
    defaultChannels: ['in_app'],
    description: 'Low stock and material-related alerts'
  },
  {
    id: 'cat_004',
    code: 'security_events',
    name: 'Security Events',
    module: 'security',
    mandatory: true,
    defaultChannels: ['in_app', 'email', 'push'],
    description: 'Security-related events and lockouts'
  },
  {
    id: 'cat_005',
    code: 'system_updates',
    name: 'System Updates',
    module: 'system',
    mandatory: false,
    defaultChannels: ['in_app'],
    description: 'System maintenance and update notifications'
  },
  {
    id: 'cat_006',
    code: 'task_assignments',
    name: 'Task Assignments',
    module: 'tasks',
    mandatory: false,
    defaultChannels: ['in_app', 'email'],
    description: 'New task assignments and updates'
  }
];

// Notifications
export const notifications: Notification[] = [
  {
    id: 'ntf_001',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    category: 'workflow_approvals',
    title: 'New Approval Required: PO-2026-0143',
    body: 'You have been assigned to approve Purchase Order PO-2026-0143 submitted by Vikram Singh. Amount: ₹8,50,000. Due: 2026-01-16',
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0143',
    link: '/workflow/approvals/po_2026_0143',
    priority: 'high',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'ntf_002',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    category: 'protocol_violations',
    title: 'Protocol Violation: CP-MAT-03',
    body: 'A protocol violation has been detected: Material reconciliation pending. Severity: medium. Project: Riverside Tower. Please review and take corrective action.',
    entityType: 'Violation',
    entityId: 'viol_2026_002',
    link: '/protocol/violations/viol_2026_002',
    priority: 'critical',
    createdAt: '2026-01-15T09:30:00Z'
  },
  {
    id: 'ntf_003',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    category: 'material_alerts',
    title: 'Low Stock Alert: Steel TMT 16mm',
    body: 'Material MAT-STEEL-16MM (Steel TMT 16mm) is below reorder level. Current stock: 8 MT. Reorder level: 10 MT.',
    entityType: 'Material',
    entityId: 'mat_001',
    link: '/materials/stock/mat_001',
    priority: 'normal',
    readAt: '2026-01-15T11:00:00Z',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'ntf_004',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    category: 'task_assignments',
    title: 'New Task Assigned: Review Material Requisition',
    body: 'You have been assigned a new task: Review material requisition MR-2026-0257. Project: Riverside Tower. Due: 2026-01-16',
    entityType: 'Task',
    entityId: 'task_001',
    link: '/tasks/task_001',
    priority: 'normal',
    readAt: '2026-01-15T10:30:00Z',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'ntf_005',
    userId: 'usr_store_001',
    userName: 'Suresh Nair',
    category: 'workflow_approvals',
    title: 'GRN Posted Successfully: GRN-2026-0234',
    body: 'Goods Receipt Note GRN-2026-0234 has been posted successfully. Material: Steel TMT 16mm, Quantity: 50 MT',
    entityType: 'GoodsReceipt',
    entityId: 'grn_2026_0234',
    link: '/materials/grn/grn_2026_0234',
    priority: 'low',
    readAt: '2026-01-15T15:00:00Z',
    createdAt: '2026-01-15T14:30:00Z'
  },
  {
    id: 'ntf_006',
    userId: 'usr_acct_001',
    userName: 'Priya Sharma',
    category: 'workflow_approvals',
    title: 'Payment Approval Required: PAY-2026-0090',
    body: 'You have been assigned to approve Payment PAY-2026-0090. Amount: ₹18,75,000. Vendor: Tata Steel Ltd.',
    entityType: 'Payment',
    entityId: 'pay_2026_0090',
    link: '/finance/payments/pay_2026_0090',
    priority: 'high',
    createdAt: '2026-01-15T15:00:00Z'
  }
];

// User Preferences
export const userPreferences: UserPreference[] = [
  {
    id: 'pref_001',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    category: 'workflow_approvals',
    channels: ['in_app', 'email'],
    digest: 'none',
    quietHours: { start: '22:00', end: '07:00', enabled: true }
  },
  {
    id: 'pref_002',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    category: 'protocol_violations',
    channels: ['in_app', 'push', 'email'],
    digest: 'none',
    quietHours: { start: '22:00', end: '07:00', enabled: false }
  },
  {
    id: 'pref_003',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    category: 'material_alerts',
    channels: ['in_app'],
    digest: 'daily',
    quietHours: { start: '22:00', end: '07:00', enabled: true }
  },
  {
    id: 'pref_004',
    userId: 'usr_store_001',
    userName: 'Suresh Nair',
    category: 'workflow_approvals',
    channels: ['in_app'],
    digest: 'none',
    quietHours: { start: '22:00', end: '07:00', enabled: true }
  },
  {
    id: 'pref_005',
    userId: 'usr_store_001',
    userName: 'Suresh Nair',
    category: 'material_alerts',
    channels: ['in_app', 'push'],
    digest: 'none',
    quietHours: { start: '22:00', end: '07:00', enabled: false }
  }
];

// Delivery Logs
export const deliveryLogs: DeliveryLog[] = [
  {
    id: 'del_001',
    notificationId: 'ntf_001',
    channel: 'in_app',
    provider: 'internal',
    status: 'delivered',
    attempts: 1,
    timestamp: '2026-01-15T10:00:01Z'
  },
  {
    id: 'del_002',
    notificationId: 'ntf_001',
    channel: 'email',
    provider: 'sendgrid',
    status: 'delivered',
    attempts: 1,
    providerRef: 'msg_123456',
    timestamp: '2026-01-15T10:00:05Z'
  },
  {
    id: 'del_003',
    notificationId: 'ntf_002',
    channel: 'in_app',
    provider: 'internal',
    status: 'delivered',
    attempts: 1,
    timestamp: '2026-01-15T09:30:01Z'
  },
  {
    id: 'del_004',
    notificationId: 'ntf_002',
    channel: 'push',
    provider: 'firebase',
    status: 'delivered',
    attempts: 1,
    providerRef: 'push_789012',
    timestamp: '2026-01-15T09:30:02Z'
  },
  {
    id: 'del_005',
    notificationId: 'ntf_002',
    channel: 'email',
    provider: 'sendgrid',
    status: 'delivered',
    attempts: 1,
    providerRef: 'msg_123457',
    timestamp: '2026-01-15T09:30:05Z'
  },
  {
    id: 'del_006',
    notificationId: 'ntf_006',
    channel: 'in_app',
    provider: 'internal',
    status: 'delivered',
    attempts: 1,
    timestamp: '2026-01-15T15:00:01Z'
  },
  {
    id: 'del_007',
    notificationId: 'ntf_006',
    channel: 'email',
    provider: 'sendgrid',
    status: 'failed',
    attempts: 3,
    error: 'SMTP timeout',
    timestamp: '2026-01-15T15:00:10Z'
  }
];

// Socket Rooms
export const socketRooms: SocketRoom[] = [
  {
    id: 'room_001',
    name: 'user:usr_pm_001',
    type: 'user',
    members: 1,
    permission: 'user:self',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'room_002',
    name: 'project:prj_001',
    type: 'project',
    members: 15,
    permission: 'org.project.view',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'room_003',
    name: 'site:site_001',
    type: 'site',
    members: 8,
    permission: 'org.site.view',
    createdAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'room_004',
    name: 'role:project_manager@project:prj_001',
    type: 'role',
    members: 3,
    permission: 'role.project_manager',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'room_005',
    name: 'doc:PurchaseOrder:po_2026_0142',
    type: 'doc',
    members: 2,
    permission: 'mat.po.view',
    createdAt: '2026-01-15T10:00:00Z'
  }
];

// Event Catalogue
export const eventCatalogue: EventCatalogueEntry[] = [
  {
    id: 'evt_001',
    event: 'wf.task.assigned',
    module: 'workflow',
    description: 'Workflow task assigned to user',
    rooms: ['user:{userId}'],
    payload: '{taskId, taskType, docNumber, assignerName}',
    legacy: false
  },
  {
    id: 'evt_002',
    event: 'wf.task.completed',
    module: 'workflow',
    description: 'Workflow task completed',
    rooms: ['user:{assignerId}', 'doc:{docType}:{docId}'],
    payload: '{taskId, completedBy, completionTime}',
    legacy: false
  },
  {
    id: 'evt_003',
    event: 'protocol.violation.raised',
    module: 'protocol',
    description: 'Protocol violation detected',
    rooms: ['project:{projectId}', 'role:protocol_officer@company:{companyId}'],
    payload: '{violationId, violationCode, severity, description}',
    legacy: false
  },
  {
    id: 'evt_004',
    event: 'protocol.violation.escalated',
    module: 'protocol',
    description: 'Protocol violation escalated',
    rooms: ['user:{escalationRecipient}'],
    payload: '{violationId, escalationLevel, escalatedBy}',
    legacy: false
  },
  {
    id: 'evt_005',
    event: 'material.stock.low',
    module: 'materials',
    description: 'Material stock below reorder level',
    rooms: ['site:{siteId}', 'role:store_keeper@site:{siteId}'],
    payload: '{materialId, materialCode, currentStock, reorderLevel}',
    legacy: false
  },
  {
    id: 'evt_006',
    event: 'sec.auth.lockout',
    module: 'security',
    description: 'User account locked due to failed attempts',
    rooms: ['user:{userId}', 'role:super_admin@company:{companyId}'],
    payload: '{userId, attemptCount, lockoutTime}',
    legacy: false
  },
  {
    id: 'evt_007',
    event: 'presence.join',
    module: 'realtime',
    description: 'User joined document viewing session',
    rooms: ['doc:{entityType}:{entityId}'],
    payload: '{userId, userName, joinedAt}',
    legacy: false
  },
  {
    id: 'evt_008',
    event: 'presence.leave',
    module: 'realtime',
    description: 'User left document viewing session',
    rooms: ['doc:{entityType}:{entityId}'],
    payload: '{userId, userName, leftAt}',
    legacy: false
  }
];

// Presence Info
export const presenceData: PresenceInfo[] = [
  {
    entityType: 'PurchaseOrder',
    entityId: 'po_2026_0142',
    users: [
      {
        userId: 'usr_pm_001',
        userName: 'Rajesh Kumar',
        joinedAt: '2026-01-15T10:00:00Z',
        isEditing: false
      },
      {
        userId: 'usr_proc_001',
        userName: 'Vikram Singh',
        joinedAt: '2026-01-15T10:05:00Z',
        isEditing: true
      }
    ]
  },
  {
    entityType: 'Project',
    entityId: 'prj_001',
    users: [
      {
        userId: 'usr_pm_001',
        userName: 'Rajesh Kumar',
        joinedAt: '2026-01-15T09:00:00Z',
        isEditing: false
      }
    ]
  }
];

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-RT-01',
    stage: 'MONITOR',
    control: 'Escalation notifications (PC-9) are mandatory categories and cannot be muted',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-RT-02',
    stage: 'MONITOR',
    control: 'Undelivered critical notifications retried on alternate channel',
    enforcement: 'MONITOR',
    status: 'observe'
  }
];

// Statistics
export const notificationStats = {
  totalNotifications: notifications.length,
  unreadNotifications: notifications.filter(n => !n.readAt).length,
  criticalNotifications: notifications.filter(n => n.priority === 'critical').length,
  totalTemplates: notificationTemplates.length,
  mandatoryTemplates: notificationTemplates.filter(t => t.isMandatoryCategory).length,
  totalCategories: notificationCategories.length,
  mandatoryCategories: notificationCategories.filter(c => c.mandatory).length,
  totalRooms: socketRooms.length,
  totalActiveConnections: socketRooms.reduce((sum, room) => sum + room.members, 0),
  totalEvents: eventCatalogue.length,
  deliverySuccessRate: ((deliveryLogs.filter(d => d.status === 'delivered').length / deliveryLogs.length) * 100).toFixed(1)
};
