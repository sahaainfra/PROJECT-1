// Part 16 — Advanced Data-Entry Framework Data

export interface FormRegistry {
  formCode: string;
  module: string;
  entityType: string;
  version: string;
  fieldSequence: string[];
  contextFields: string[];
  defaultRules: Record<string, any>;
  conditionalRules: Record<string, any>;
  calcRules: Record<string, any>;
  unitFields: string[];
  duplicateRuleCode: string;
  autosaveEnabled: boolean;
  isActive: boolean;
}

export interface UserPreference {
  userId: string;
  formCode: string;
  field: string;
  preferredValue: any;
  pinned: boolean;
  updatedAt: string;
}

export interface RecentValue {
  userId: string;
  formCode: string;
  field: string;
  valueRef: string;
  valueLabel: string;
  usedCount: number;
  lastUsedAt: string;
}

export interface Draft {
  draftId: string;
  userId: string;
  userName: string;
  formCode: string;
  entityType: string;
  entityId?: string;
  contextJson: Record<string, any>;
  payloadJson: Record<string, any>;
  version: number;
  savedAt: string;
  deviceId: string;
  status: 'active' | 'submitted' | 'discarded' | 'expired';
  expiresAt: string;
}

export interface DuplicateRule {
  ruleCode: string;
  entityType: string;
  matchFields: string[];
  fuzzyFields: string[];
  windowDays: number;
  action: 'warn' | 'block';
  scope: string;
}

export interface UnitConversion {
  id: string;
  fromUnit: string;
  toUnit: string;
  factor: number;
  materialCategory?: string;
  effectiveFrom: string;
}

export interface BulkEditJob {
  jobId: string;
  entityType: string;
  filterJson: Record<string, any>;
  fieldsChanged: Record<string, any>;
  recordCount: number;
  requestedBy: string;
  requestedByName: string;
  approvalId?: string;
  status: 'preview' | 'submitted' | 'approved' | 'executed' | 'failed';
  auditBatchId?: string;
  createdAt: string;
  executedAt?: string;
}

export interface QuickAction {
  role: string;
  formCode: string;
  label: string;
  order: number;
  icon: string;
}

export interface DuplicateWarning {
  id: string;
  entityType: string;
  existingRecord: Record<string, any>;
  newRecord: Record<string, any>;
  matchScore: number;
  matchFields: string[];
  action: 'warn' | 'block';
}

export interface ContextBundle {
  projectId: string;
  projectName: string;
  sites: Array<{ id: string; name: string }>;
  activities: Array<{ id: string; name: string; wbsCode: string }>;
  boqItems: Array<{ id: string; code: string; description: string; unit: string; rate: number }>;
  vendors: Array<{ id: string; code: string; name: string }>;
  materials: Array<{ id: string; code: string; name: string; unit: string }>;
  employees: Array<{ id: string; code: string; name: string; designation: string }>;
}

// Form Registry
export const formRegistry: FormRegistry[] = [
  {
    formCode: 'DPR',
    module: 'site',
    entityType: 'DailyProgressReport',
    version: '2.1',
    fieldSequence: ['date', 'project', 'site', 'weather', 'workDescription', 'labourCount', 'materialUsed', 'equipmentUsed', 'remarks'],
    contextFields: ['project', 'site'],
    defaultRules: { date: 'today', weather: 'last_used' },
    conditionalRules: { equipmentUsed: 'show_if_labourCount > 0' },
    calcRules: { totalManHours: 'labourCount * 8' },
    unitFields: ['materialUsed'],
    duplicateRuleCode: 'DPR-DUP-001',
    autosaveEnabled: true,
    isActive: true
  },
  {
    formCode: 'MR',
    module: 'materials',
    entityType: 'MaterialRequest',
    version: '3.0',
    fieldSequence: ['project', 'site', 'material', 'quantity', 'unit', 'requiredDate', 'purpose', 'priority'],
    contextFields: ['project', 'site', 'material'],
    defaultRules: { requiredDate: 'today+7', priority: 'normal' },
    conditionalRules: {},
    calcRules: { estimatedCost: 'quantity * material.rate' },
    unitFields: ['quantity'],
    duplicateRuleCode: 'MR-DUP-001',
    autosaveEnabled: true,
    isActive: true
  },
  {
    formCode: 'PO',
    module: 'materials',
    entityType: 'PurchaseOrder',
    version: '4.2',
    fieldSequence: ['project', 'vendor', 'material', 'quantity', 'unit', 'rate', 'deliveryDate', 'paymentTerms', 'remarks'],
    contextFields: ['project', 'vendor', 'material'],
    defaultRules: { deliveryDate: 'today+14', paymentTerms: 'last_used' },
    conditionalRules: { remarks: 'show_if_quantity > 100' },
    calcRules: { totalAmount: 'quantity * rate', gstAmount: 'totalAmount * 0.18' },
    unitFields: ['quantity'],
    duplicateRuleCode: 'PO-DUP-001',
    autosaveEnabled: true,
    isActive: true
  },
  {
    formCode: 'GRN',
    module: 'materials',
    entityType: 'GoodsReceiptNote',
    version: '2.5',
    fieldSequence: ['po', 'material', 'receivedQty', 'unit', 'acceptedQty', 'rejectedQty', 'receivedDate', 'vehicleNo', 'challanNo'],
    contextFields: ['po', 'material'],
    defaultRules: { receivedDate: 'today', acceptedQty: 'receivedQty' },
    conditionalRules: { rejectedQty: 'show_if_acceptedQty < receivedQty' },
    calcRules: { totalReceived: 'acceptedQty + rejectedQty' },
    unitFields: ['receivedQty', 'acceptedQty', 'rejectedQty'],
    duplicateRuleCode: 'GRN-DUP-001',
    autosaveEnabled: true,
    isActive: true
  },
  {
    formCode: 'ATTENDANCE',
    module: 'hr',
    entityType: 'Attendance',
    version: '1.8',
    fieldSequence: ['date', 'project', 'site', 'employee', 'checkIn', 'checkOut', 'overtime', 'remarks'],
    contextFields: ['project', 'site', 'employee'],
    defaultRules: { date: 'today', checkIn: '09:00' },
    conditionalRules: { overtime: 'show_if_checkOut > 18:00' },
    calcRules: { totalHours: 'checkOut - checkIn', regularHours: 'min(totalHours, 8)' },
    unitFields: [],
    duplicateRuleCode: 'ATT-DUP-001',
    autosaveEnabled: true,
    isActive: true
  },
  {
    formCode: 'RFI',
    module: 'quality',
    entityType: 'RequestForInspection',
    version: '2.0',
    fieldSequence: ['project', 'site', 'activity', 'inspectionType', 'requestedDate', 'description', 'attachments'],
    contextFields: ['project', 'site', 'activity'],
    defaultRules: { requestedDate: 'today', inspectionType: 'last_used' },
    conditionalRules: {},
    calcRules: {},
    unitFields: [],
    duplicateRuleCode: 'RFI-DUP-001',
    autosaveEnabled: true,
    isActive: true
  }
];

// User Preferences (Sample)
export const userPreferences: UserPreference[] = [
  { userId: 'usr_pm_001', formCode: 'PO', field: 'paymentTerms', preferredValue: 'PT-30', pinned: true, updatedAt: '2026-01-10T10:00:00Z' },
  { userId: 'usr_pm_001', formCode: 'MR', field: 'priority', preferredValue: 'high', pinned: false, updatedAt: '2026-01-12T14:00:00Z' },
  { userId: 'usr_store_001', formCode: 'GRN', field: 'vehicleNo', preferredValue: 'MH-01-AB-1234', pinned: true, updatedAt: '2026-01-14T09:00:00Z' }
];

// Recent Values (Sample)
export const recentValues: RecentValue[] = [
  { userId: 'usr_pm_001', formCode: 'PO', field: 'vendor', valueRef: 'vend_001', valueLabel: 'Tata Steel Ltd.', usedCount: 15, lastUsedAt: '2026-01-15T10:00:00Z' },
  { userId: 'usr_pm_001', formCode: 'PO', field: 'vendor', valueRef: 'vend_002', valueLabel: 'UltraTech Cement', usedCount: 12, lastUsedAt: '2026-01-14T15:00:00Z' },
  { userId: 'usr_pm_001', formCode: 'MR', field: 'material', valueRef: 'mat_001', valueLabel: 'Steel TMT 16mm', usedCount: 8, lastUsedAt: '2026-01-15T09:00:00Z' },
  { userId: 'usr_store_001', formCode: 'GRN', field: 'po', valueRef: 'po_2026_0140', valueLabel: 'PO-2026-0140', usedCount: 3, lastUsedAt: '2026-01-15T11:00:00Z' }
];

// Drafts
export const drafts: Draft[] = [
  {
    draftId: 'draft_001',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    formCode: 'PO',
    entityType: 'PurchaseOrder',
    contextJson: { project: 'prj_001', vendor: 'vend_001' },
    payloadJson: {
      material: 'mat_001',
      quantity: 50,
      unit: 'MT',
      rate: 55000,
      deliveryDate: '2026-01-29'
    },
    version: 3,
    savedAt: '2026-01-15T14:30:00Z',
    deviceId: 'dev_desktop_001',
    status: 'active',
    expiresAt: '2026-01-22T14:30:00Z'
  },
  {
    draftId: 'draft_002',
    userId: 'usr_store_001',
    userName: 'Suresh Nair',
    formCode: 'GRN',
    entityType: 'GoodsReceiptNote',
    contextJson: { po: 'po_2026_0141' },
    payloadJson: {
      material: 'mat_002',
      receivedQty: 500,
      unit: 'BAG',
      acceptedQty: 495,
      rejectedQty: 5,
      vehicleNo: 'MH-01-AB-1234'
    },
    version: 2,
    savedAt: '2026-01-15T15:00:00Z',
    deviceId: 'dev_mobile_001',
    status: 'active',
    expiresAt: '2026-01-22T15:00:00Z'
  },
  {
    draftId: 'draft_003',
    userId: 'usr_eng_001',
    userName: 'Amit Patel',
    formCode: 'DPR',
    entityType: 'DailyProgressReport',
    contextJson: { project: 'prj_001', site: 'site_001' },
    payloadJson: {
      date: '2026-01-15',
      weather: 'Clear',
      workDescription: 'Foundation work for Block A',
      labourCount: 45,
      materialUsed: 'Cement, Steel'
    },
    version: 1,
    savedAt: '2026-01-15T17:00:00Z',
    deviceId: 'dev_mobile_002',
    status: 'active',
    expiresAt: '2026-01-22T17:00:00Z'
  }
];

// Duplicate Rules
export const duplicateRules: DuplicateRule[] = [
  {
    ruleCode: 'DPR-DUP-001',
    entityType: 'DailyProgressReport',
    matchFields: ['date', 'project', 'site'],
    fuzzyFields: [],
    windowDays: 1,
    action: 'block',
    scope: 'site'
  },
  {
    ruleCode: 'MR-DUP-001',
    entityType: 'MaterialRequest',
    matchFields: ['project', 'material', 'requiredDate'],
    fuzzyFields: ['quantity'],
    windowDays: 7,
    action: 'warn',
    scope: 'project'
  },
  {
    ruleCode: 'PO-DUP-001',
    entityType: 'PurchaseOrder',
    matchFields: ['vendor', 'material', 'deliveryDate'],
    fuzzyFields: ['quantity', 'rate'],
    windowDays: 14,
    action: 'warn',
    scope: 'company'
  },
  {
    ruleCode: 'GRN-DUP-001',
    entityType: 'GoodsReceiptNote',
    matchFields: ['po', 'vehicleNo', 'receivedDate'],
    fuzzyFields: [],
    windowDays: 1,
    action: 'block',
    scope: 'site'
  },
  {
    ruleCode: 'ATT-DUP-001',
    entityType: 'Attendance',
    matchFields: ['date', 'employee'],
    fuzzyFields: [],
    windowDays: 1,
    action: 'block',
    scope: 'company'
  },
  {
    ruleCode: 'RFI-DUP-001',
    entityType: 'RequestForInspection',
    matchFields: ['project', 'site', 'activity', 'requestedDate'],
    fuzzyFields: ['inspectionType'],
    windowDays: 7,
    action: 'warn',
    scope: 'site'
  }
];

// Unit Conversions
export const unitConversions: UnitConversion[] = [
  { id: 'conv_001', fromUnit: 'MT', toUnit: 'KG', factor: 1000, effectiveFrom: '2025-01-01' },
  { id: 'conv_002', fromUnit: 'KG', toUnit: 'GM', factor: 1000, effectiveFrom: '2025-01-01' },
  { id: 'conv_003', fromUnit: 'CUM', toUnit: 'CFT', factor: 35.3147, effectiveFrom: '2025-01-01' },
  { id: 'conv_004', fromUnit: 'RMT', toUnit: 'FT', factor: 3.28084, effectiveFrom: '2025-01-01' },
  { id: 'conv_005', fromUnit: 'SQM', toUnit: 'SQFT', factor: 10.7639, effectiveFrom: '2025-01-01' },
  { id: 'conv_006', fromUnit: 'BAG', toUnit: 'KG', factor: 50, materialCategory: 'cement', effectiveFrom: '2025-01-01' }
];

// Bulk Edit Jobs
export const bulkEditJobs: BulkEditJob[] = [
  {
    jobId: 'bulk_001',
    entityType: 'PurchaseOrder',
    filterJson: { project: 'prj_001', status: 'pending' },
    fieldsChanged: { deliveryDate: '2026-02-15' },
    recordCount: 12,
    requestedBy: 'usr_pm_001',
    requestedByName: 'Rajesh Kumar',
    approvalId: 'appr_001',
    status: 'executed',
    auditBatchId: 'audit_bulk_001',
    createdAt: '2026-01-14T10:00:00Z',
    executedAt: '2026-01-14T11:00:00Z'
  },
  {
    jobId: 'bulk_002',
    entityType: 'Attendance',
    filterJson: { project: 'prj_001', date: '2026-01-15' },
    fieldsChanged: { checkOut: '18:00' },
    recordCount: 45,
    requestedBy: 'usr_hr_001',
    requestedByName: 'HR Manager',
    status: 'approved',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    jobId: 'bulk_003',
    entityType: 'MaterialRequest',
    filterJson: { project: 'prj_002', priority: 'low' },
    fieldsChanged: { priority: 'normal' },
    recordCount: 8,
    requestedBy: 'usr_pm_002',
    requestedByName: 'Amit Patel',
    status: 'preview',
    createdAt: '2026-01-15T14:00:00Z'
  }
];

// Quick Actions
export const quickActions: QuickAction[] = [
  { role: 'project_manager', formCode: 'PO', label: 'Create Purchase Order', order: 1, icon: '📦' },
  { role: 'project_manager', formCode: 'MR', label: 'Create Material Request', order: 2, icon: '📋' },
  { role: 'project_manager', formCode: 'DPR', label: 'Daily Progress Report', order: 3, icon: '📊' },
  { role: 'site_engineer', formCode: 'DPR', label: 'Daily Progress Report', order: 1, icon: '📊' },
  { role: 'site_engineer', formCode: 'RFI', label: 'Request Inspection', order: 2, icon: '🔍' },
  { role: 'site_engineer', formCode: 'ATTENDANCE', label: 'Mark Attendance', order: 3, icon: '✅' },
  { role: 'store_keeper', formCode: 'GRN', label: 'Goods Receipt', order: 1, icon: '📥' },
  { role: 'store_keeper', formCode: 'MR', label: 'Issue Material', order: 2, icon: '📤' }
];

// Context Bundle (Sample)
export const contextBundle: ContextBundle = {
  projectId: 'prj_001',
  projectName: 'Riverside Tower',
  sites: [
    { id: 'site_001', name: 'Block A' },
    { id: 'site_002', name: 'Block B' }
  ],
  activities: [
    { id: 'act_001', name: 'Foundation Work', wbsCode: 'WBS-001-001' },
    { id: 'act_002', name: 'Structural Work', wbsCode: 'WBS-001-002' },
    { id: 'act_003', name: 'Finishing Work', wbsCode: 'WBS-001-003' }
  ],
  boqItems: [
    { id: 'boq_001', code: 'BOQ-001', description: 'Excavation', unit: 'CUM', rate: 250 },
    { id: 'boq_002', code: 'BOQ-002', description: 'PCC M15', unit: 'CUM', rate: 4500 },
    { id: 'boq_003', code: 'BOQ-003', description: 'RCC M25', unit: 'CUM', rate: 6500 }
  ],
  vendors: [
    { id: 'vend_001', code: 'VND-TATA-STEEL', name: 'Tata Steel Ltd.' },
    { id: 'vend_002', code: 'VND-ULTRATECH', name: 'UltraTech Cement' }
  ],
  materials: [
    { id: 'mat_001', code: 'MAT-STEEL-16MM', name: 'Steel TMT 16mm', unit: 'MT' },
    { id: 'mat_002', code: 'MAT-CEM-OPC53', name: 'Cement OPC 53', unit: 'BAG' }
  ],
  employees: [
    { id: 'emp_001', code: 'EMP-001', name: 'Rahul Mehta', designation: 'Site Engineer' },
    { id: 'emp_002', code: 'EMP-002', name: 'Suresh Nair', designation: 'Store Keeper' }
  ]
};

// Duplicate Warnings (Sample)
export const duplicateWarnings: DuplicateWarning[] = [
  {
    id: 'dup_warn_001',
    entityType: 'PurchaseOrder',
    existingRecord: {
      poNumber: 'PO-2026-0140',
      vendor: 'Tata Steel Ltd.',
      material: 'Steel TMT 16mm',
      quantity: 50,
      deliveryDate: '2026-01-25'
    },
    newRecord: {
      vendor: 'Tata Steel Ltd.',
      material: 'Steel TMT 16mm',
      quantity: 52,
      deliveryDate: '2026-01-26'
    },
    matchScore: 0.92,
    matchFields: ['vendor', 'material'],
    action: 'warn'
  },
  {
    id: 'dup_warn_002',
    entityType: 'DailyProgressReport',
    existingRecord: {
      date: '2026-01-15',
      project: 'Riverside Tower',
      site: 'Block A'
    },
    newRecord: {
      date: '2026-01-15',
      project: 'Riverside Tower',
      site: 'Block A'
    },
    matchScore: 1.0,
    matchFields: ['date', 'project', 'site'],
    action: 'block'
  }
];

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-DEX-01',
    stage: 'VERIFY',
    control: 'Server re-runs every validation and permission check on submit; client-side results are never trusted',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-DEX-02',
    stage: 'RECORD',
    control: 'Important modifications carry user, time, old/new value, source and reason where required',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-DEX-03',
    stage: 'APPROVE',
    control: 'Bulk edits above the configured record count or on financial fields need approval',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-DEX-04',
    stage: 'MONITOR',
    control: 'Duplicate warnings overridden and repeated duplicates per user/entity',
    enforcement: 'MONITOR',
    status: 'observe'
  }
];

// Statistics
export const dataEntryStats = {
  totalForms: formRegistry.length,
  activeForms: formRegistry.filter(f => f.isActive).length,
  totalDrafts: drafts.length,
  activeDrafts: drafts.filter(d => d.status === 'active').length,
  totalDuplicateRules: duplicateRules.length,
  blockRules: duplicateRules.filter(r => r.action === 'block').length,
  warnRules: duplicateRules.filter(r => r.action === 'warn').length,
  totalBulkEdits: bulkEditJobs.length,
  executedBulkEdits: bulkEditJobs.filter(j => j.status === 'executed').length,
  totalQuickActions: quickActions.length
};
