// Part 12 — Enterprise Excel Data Exchange Engine Data

export interface Template {
  id: string;
  code: string;
  module: string;
  entityType: 'master' | 'transaction';
  operation: 'import' | 'export' | 'both';
  name: string;
  version: string;
  status: 'draft' | 'approved' | 'active' | 'retired';
  effectiveFrom: string;
  requiredErpVersion: string;
  scope: 'company' | 'project' | 'site';
  definitionJson: {
    sheets: string[];
    columns: Array<{
      key: string;
      header: string;
      type: string;
      required: boolean;
      allowedValuesSource?: string;
      lookup?: string;
      uniqueKey?: boolean;
      updateable?: boolean;
      protected?: boolean;
      format?: string;
      example?: string;
    }>;
    keyFields: string[];
    relationships: string[];
  };
  approvedBy: string;
  createdAt: string;
  usageCount: number;
}

export interface ImportJob {
  id: string;
  importId: string;
  templateId: string;
  templateCode: string;
  templateVersion: string;
  module: string;
  companyId: string;
  companyName: string;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
  uploadedBy: string;
  uploadedByName: string;
  role: string;
  fileDocumentId: string;
  fileHash: string;
  fileName: string;
  fileSize: number;
  mode: 'all_or_nothing' | 'valid_only' | 'correct_and_reupload';
  status: 'uploaded' | 'scanning' | 'validating' | 'preview' | 'awaiting_approval' | 'importing' | 'completed' | 'partially_completed' | 'failed' | 'reversed';
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  createRows: number;
  updateRows: number;
  rejectRows: number;
  impactJson?: {
    totalValue?: number;
    budgetImpact?: number;
    costImpact?: number;
    taxImpact?: number;
  };
  workflowInstanceId?: string;
  startedAt?: string;
  finishedAt?: string;
  uploadedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ImportRow {
  id: string;
  importId: string;
  rowNo: number;
  classification: 'CREATE' | 'UPDATE' | 'REJECT' | 'DUPLICATE';
  payloadJson: Record<string, any>;
  targetEntity: string;
  targetId?: string;
  beforeJson?: Record<string, any>;
  status: 'pending' | 'processed' | 'failed';
  messagesJson: string[];
}

export interface ImportError {
  id: string;
  importId: string;
  rowNo: number;
  column: string;
  field: string;
  enteredValue: string;
  expectedValue: string;
  errorCode: string;
  description: string;
  correction: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ExportJob {
  id: string;
  exportId: string;
  source: 'report' | 'list' | 'dataset';
  sourceName: string;
  filtersJson: Record<string, any>;
  scope: 'current_page' | 'selected' | 'filtered' | 'complete';
  format: 'xlsx' | 'csv' | 'pdf' | 'print';
  grouping?: string;
  requestedBy: string;
  requestedByName: string;
  rowCount: number;
  fileDocumentId?: string;
  status: 'requested' | 'processing' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string;
}

export interface ErrorCode {
  id: string;
  code: string;
  category: 'structural' | 'required' | 'master' | 'duplicate' | 'financial' | 'date' | 'relationship' | 'security';
  messageTemplate: string;
  correctionTemplate: string;
  defaultSeverity: 'error' | 'warning' | 'info';
}

export interface ImportMode {
  id: string;
  module: string;
  entityType: string;
  allowedModes: string[];
  defaultMode: string;
  requiresApproval: boolean;
  approvalThresholdRule?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Templates
export const templates: Template[] = [
  {
    id: 'tmpl_001',
    code: 'MAT-MASTER-IMP',
    module: 'mdm',
    entityType: 'master',
    operation: 'import',
    name: 'Material Master Import',
    version: '2.1',
    status: 'active',
    effectiveFrom: '2026-01-01',
    requiredErpVersion: '1.0',
    scope: 'company',
    definitionJson: {
      sheets: ['INSTRUCTIONS', 'DATA ENTRY', 'REFERENCE', 'VALIDATION LISTS', 'ERROR REFERENCE'],
      columns: [
        { key: 'code', header: 'Material Code', type: 'string', required: true, uniqueKey: true, updateable: false, protected: true, example: 'MAT-STEEL-16MM' },
        { key: 'name', header: 'Material Name', type: 'string', required: true, updateable: true, example: 'Steel TMT 16mm' },
        { key: 'groupId', header: 'Material Group', type: 'lookup', required: true, lookup: 'material_groups', example: 'STEEL' },
        { key: 'hsnCode', header: 'HSN Code', type: 'string', required: true, format: '4-8 digits', example: '7214' },
        { key: 'gstRateCode', header: 'GST Rate', type: 'lookup', required: true, lookup: 'tax_codes', example: 'TAX-GST-18' },
        { key: 'baseUomId', header: 'Base UOM', type: 'lookup', required: true, lookup: 'uom', example: 'MT' },
        { key: 'isStockItem', header: 'Stock Item', type: 'boolean', required: true, example: 'Yes' },
        { key: 'qcRequired', header: 'QC Required', type: 'boolean', required: true, example: 'Yes' },
        { key: 'allowedWastagePct', header: 'Wastage %', type: 'decimal', required: false, format: '0-100', example: '2.5' }
      ],
      keyFields: ['code'],
      relationships: ['material_groups', 'tax_codes', 'uom']
    },
    approvedBy: 'usr_mdm_steward_001',
    createdAt: '2025-12-15T00:00:00Z',
    usageCount: 23
  },
  {
    id: 'tmpl_002',
    code: 'VND-MASTER-IMP',
    module: 'mdm',
    entityType: 'master',
    operation: 'import',
    name: 'Vendor Master Import',
    version: '1.5',
    status: 'active',
    effectiveFrom: '2026-01-01',
    requiredErpVersion: '1.0',
    scope: 'company',
    definitionJson: {
      sheets: ['INSTRUCTIONS', 'DATA ENTRY', 'REFERENCE', 'VALIDATION LISTS', 'ERROR REFERENCE'],
      columns: [
        { key: 'code', header: 'Vendor Code', type: 'string', required: true, uniqueKey: true, updateable: false, protected: true, example: 'VND-TATA-STEEL' },
        { key: 'name', header: 'Vendor Name', type: 'string', required: true, updateable: true, example: 'Tata Steel Ltd.' },
        { key: 'vendorType', header: 'Vendor Type', type: 'lookup', required: true, allowedValuesSource: 'vendor_types', example: 'supplier' },
        { key: 'pan', header: 'PAN', type: 'string', required: true, format: '10 chars', example: 'AABCT1234A' },
        { key: 'gstin', header: 'GSTIN', type: 'string', required: true, format: '15 chars', uniqueKey: true, example: '27AABCT1234A1Z5' },
        { key: 'stateCode', header: 'State Code', type: 'string', required: true, format: '2 digits', example: '27' },
        { key: 'ifsc', header: 'IFSC', type: 'string', required: false, format: '11 chars', example: 'TATA0001234' },
        { key: 'tdsSectionCode', header: 'TDS Section', type: 'lookup', required: false, lookup: 'tds_sections', example: '194Q' }
      ],
      keyFields: ['code', 'gstin'],
      relationships: ['vendor_types', 'tds_sections']
    },
    approvedBy: 'usr_mdm_steward_001',
    createdAt: '2025-11-20T00:00:00Z',
    usageCount: 15
  },
  {
    id: 'tmpl_003',
    code: 'PO-BULK-IMP',
    module: 'mat',
    entityType: 'transaction',
    operation: 'import',
    name: 'Purchase Order Bulk Import',
    version: '3.0',
    status: 'active',
    effectiveFrom: '2026-01-01',
    requiredErpVersion: '1.0',
    scope: 'project',
    definitionJson: {
      sheets: ['INSTRUCTIONS', 'DATA ENTRY', 'REFERENCE', 'VALIDATION LISTS', 'ERROR REFERENCE'],
      columns: [
        { key: 'vendorCode', header: 'Vendor Code', type: 'lookup', required: true, lookup: 'vendors', example: 'VND-TATA-STEEL' },
        { key: 'materialCode', header: 'Material Code', type: 'lookup', required: true, lookup: 'materials', example: 'MAT-STEEL-16MM' },
        { key: 'quantity', header: 'Quantity', type: 'decimal', required: true, format: '> 0', example: '50.5' },
        { key: 'uom', header: 'UOM', type: 'lookup', required: true, lookup: 'uom', example: 'MT' },
        { key: 'rate', header: 'Rate', type: 'decimal', required: true, format: '> 0', example: '55000' },
        { key: 'deliveryDate', header: 'Delivery Date', type: 'date', required: true, format: 'DD-MM-YYYY', example: '20-01-2026' },
        { key: 'projectCode', header: 'Project Code', type: 'lookup', required: true, lookup: 'projects', example: 'PRJ-2025-001' }
      ],
      keyFields: ['vendorCode', 'materialCode', 'projectCode'],
      relationships: ['vendors', 'materials', 'projects', 'uom']
    },
    approvedBy: 'usr_proc_manager_001',
    createdAt: '2025-12-01T00:00:00Z',
    usageCount: 42
  },
  {
    id: 'tmpl_004',
    code: 'OPEN-STOCK-IMP',
    module: 'mat',
    entityType: 'transaction',
    operation: 'import',
    name: 'Opening Stock Import',
    version: '1.2',
    status: 'active',
    effectiveFrom: '2026-01-01',
    requiredErpVersion: '1.0',
    scope: 'site',
    definitionJson: {
      sheets: ['INSTRUCTIONS', 'DATA ENTRY', 'REFERENCE', 'VALIDATION LISTS', 'ERROR REFERENCE'],
      columns: [
        { key: 'materialCode', header: 'Material Code', type: 'lookup', required: true, lookup: 'materials', uniqueKey: true, example: 'MAT-STEEL-16MM' },
        { key: 'quantity', header: 'Opening Quantity', type: 'decimal', required: true, format: '>= 0', example: '25.5' },
        { key: 'uom', header: 'UOM', type: 'lookup', required: true, lookup: 'uom', example: 'MT' },
        { key: 'rate', header: 'Rate', type: 'decimal', required: true, format: '> 0', example: '55000' },
        { key: 'batchNo', header: 'Batch No', type: 'string', required: false, example: 'BATCH-001' },
        { key: 'expiryDate', header: 'Expiry Date', type: 'date', required: false, format: 'DD-MM-YYYY', example: '31-12-2026' },
        { key: 'siteCode', header: 'Site Code', type: 'lookup', required: true, lookup: 'sites', example: 'SITE-RT-001' }
      ],
      keyFields: ['materialCode', 'siteCode'],
      relationships: ['materials', 'sites', 'uom']
    },
    approvedBy: 'usr_store_manager_001',
    createdAt: '2025-12-10T00:00:00Z',
    usageCount: 8
  },
  {
    id: 'tmpl_005',
    code: 'BUDGET-IMP',
    module: 'prj',
    entityType: 'transaction',
    operation: 'import',
    name: 'Project Budget Import',
    version: '2.0',
    status: 'active',
    effectiveFrom: '2026-01-01',
    requiredErpVersion: '1.0',
    scope: 'project',
    definitionJson: {
      sheets: ['INSTRUCTIONS', 'DATA ENTRY', 'REFERENCE', 'VALIDATION LISTS', 'ERROR REFERENCE'],
      columns: [
        { key: 'wbsCode', header: 'WBS Code', type: 'lookup', required: true, lookup: 'wbs', example: 'WBS-001-001' },
        { key: 'costCode', header: 'Cost Code', type: 'lookup', required: true, lookup: 'cost_codes', example: 'CC-MAT-001' },
        { key: 'budgetAmount', header: 'Budget Amount', type: 'decimal', required: true, format: '> 0', example: '5000000' },
        { key: 'fiscalYear', header: 'Fiscal Year', type: 'string', required: true, format: 'YYYY-YY', example: '2025-26' },
        { key: 'projectCode', header: 'Project Code', type: 'lookup', required: true, lookup: 'projects', example: 'PRJ-2025-001' }
      ],
      keyFields: ['wbsCode', 'costCode', 'fiscalYear', 'projectCode'],
      relationships: ['wbs', 'cost_codes', 'projects']
    },
    approvedBy: 'usr_finance_manager_001',
    createdAt: '2025-11-25T00:00:00Z',
    usageCount: 12
  }
];

// Import Jobs
export const importJobs: ImportJob[] = [
  {
    id: 'imp_001',
    importId: 'IMP-2026-001234',
    templateId: 'tmpl_003',
    templateCode: 'PO-BULK-IMP',
    templateVersion: '3.0',
    module: 'mat',
    companyId: 'comp_001',
    companyName: 'Acme Construction Ltd.',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    uploadedBy: 'usr_proc_001',
    uploadedByName: 'Vikram Singh',
    role: 'Procurement Manager',
    fileDocumentId: 'doc_001',
    fileHash: 'sha256:a1b2c3d4e5f6',
    fileName: 'PO_Bulk_Import_Jan2026.xlsx',
    fileSize: 245760,
    mode: 'all_or_nothing',
    status: 'awaiting_approval',
    totalRows: 25,
    validRows: 23,
    invalidRows: 2,
    duplicateRows: 0,
    createRows: 23,
    updateRows: 0,
    rejectRows: 2,
    impactJson: {
      totalValue: 12500000,
      budgetImpact: 12500000,
      taxImpact: 2250000
    },
    workflowInstanceId: 'wf_imp_001',
    startedAt: '2026-01-15T10:00:00Z',
    uploadedAt: '2026-01-15T09:45:00Z'
  },
  {
    id: 'imp_002',
    importId: 'IMP-2026-001235',
    templateId: 'tmpl_001',
    templateCode: 'MAT-MASTER-IMP',
    templateVersion: '2.1',
    module: 'mdm',
    companyId: 'comp_001',
    companyName: 'Acme Construction Ltd.',
    uploadedBy: 'usr_mdm_steward_001',
    uploadedByName: 'Master Data Steward',
    role: 'Master Data Steward',
    fileDocumentId: 'doc_002',
    fileHash: 'sha256:b2c3d4e5f6g7',
    fileName: 'Material_Master_Update_Jan2026.xlsx',
    fileSize: 184320,
    mode: 'valid_only',
    status: 'completed',
    totalRows: 50,
    validRows: 48,
    invalidRows: 2,
    duplicateRows: 3,
    createRows: 40,
    updateRows: 8,
    rejectRows: 2,
    startedAt: '2026-01-14T14:00:00Z',
    finishedAt: '2026-01-14T14:15:00Z',
    uploadedAt: '2026-01-14T13:50:00Z',
    approvedBy: 'usr_mdm_steward_001',
    approvedAt: '2026-01-14T14:05:00Z'
  },
  {
    id: 'imp_003',
    importId: 'IMP-2026-001236',
    templateId: 'tmpl_004',
    templateCode: 'OPEN-STOCK-IMP',
    templateVersion: '1.2',
    module: 'mat',
    companyId: 'comp_001',
    companyName: 'Acme Construction Ltd.',
    projectId: 'prj_001',
    projectName: 'Riverside Tower',
    siteId: 'site_001',
    siteName: 'Block A',
    uploadedBy: 'usr_store_001',
    uploadedByName: 'Suresh Nair',
    role: 'Store Keeper',
    fileDocumentId: 'doc_003',
    fileHash: 'sha256:c3d4e5f6g7h8',
    fileName: 'Opening_Stock_BlockA_Jan2026.xlsx',
    fileSize: 122880,
    mode: 'all_or_nothing',
    status: 'importing',
    totalRows: 120,
    validRows: 118,
    invalidRows: 2,
    duplicateRows: 0,
    createRows: 118,
    updateRows: 0,
    rejectRows: 2,
    impactJson: {
      totalValue: 8500000,
      costImpact: 8500000
    },
    workflowInstanceId: 'wf_imp_003',
    startedAt: '2026-01-15T11:30:00Z',
    uploadedAt: '2026-01-15T11:00:00Z',
    approvedBy: 'usr_store_manager_001',
    approvedAt: '2026-01-15T11:20:00Z'
  },
  {
    id: 'imp_004',
    importId: 'IMP-2026-001237',
    templateId: 'tmpl_005',
    templateCode: 'BUDGET-IMP',
    templateVersion: '2.0',
    module: 'prj',
    companyId: 'comp_001',
    companyName: 'Acme Construction Ltd.',
    projectId: 'prj_002',
    projectName: 'Highway Bridge Phase 2',
    uploadedBy: 'usr_planning_001',
    uploadedByName: 'Planning Engineer',
    role: 'Planning Engineer',
    fileDocumentId: 'doc_004',
    fileHash: 'sha256:d4e5f6g7h8i9',
    fileName: 'Budget_Revision_Q2_2026.xlsx',
    fileSize: 307200,
    mode: 'all_or_nothing',
    status: 'failed',
    totalRows: 200,
    validRows: 185,
    invalidRows: 15,
    duplicateRows: 0,
    createRows: 0,
    updateRows: 0,
    rejectRows: 15,
    startedAt: '2026-01-13T16:00:00Z',
    finishedAt: '2026-01-13T16:10:00Z',
    uploadedAt: '2026-01-13T15:45:00Z'
  },
  {
    id: 'imp_005',
    importId: 'IMP-2026-001238',
    templateId: 'tmpl_002',
    templateCode: 'VND-MASTER-IMP',
    templateVersion: '1.5',
    module: 'mdm',
    companyId: 'comp_001',
    companyName: 'Acme Construction Ltd.',
    uploadedBy: 'usr_proc_001',
    uploadedByName: 'Vikram Singh',
    role: 'Procurement Manager',
    fileDocumentId: 'doc_005',
    fileHash: 'sha256:e5f6g7h8i9j0',
    fileName: 'Vendor_Master_New_Suppliers.xlsx',
    fileSize: 163840,
    mode: 'valid_only',
    status: 'preview',
    totalRows: 15,
    validRows: 12,
    invalidRows: 3,
    duplicateRows: 2,
    createRows: 10,
    updateRows: 2,
    rejectRows: 3,
    uploadedAt: '2026-01-15T14:00:00Z'
  }
];

// Import Rows (Sample for imp_001)
export const importRows: ImportRow[] = [
  {
    id: 'row_001',
    importId: 'imp_001',
    rowNo: 1,
    classification: 'CREATE',
    payloadJson: {
      vendorCode: 'VND-TATA-STEEL',
      materialCode: 'MAT-STEEL-16MM',
      quantity: 50.5,
      uom: 'MT',
      rate: 55000,
      deliveryDate: '20-01-2026',
      projectCode: 'PRJ-2025-001'
    },
    targetEntity: 'PurchaseOrder',
    status: 'pending',
    messagesJson: ['Valid row - ready for creation']
  },
  {
    id: 'row_002',
    importId: 'imp_001',
    rowNo: 2,
    classification: 'CREATE',
    payloadJson: {
      vendorCode: 'VND-ULTRATECH',
      materialCode: 'MAT-CEM-OPC53',
      quantity: 500,
      uom: 'BAG',
      rate: 380,
      deliveryDate: '18-01-2026',
      projectCode: 'PRJ-2025-001'
    },
    targetEntity: 'PurchaseOrder',
    status: 'pending',
    messagesJson: ['Valid row - ready for creation']
  },
  {
    id: 'row_003',
    importId: 'imp_001',
    rowNo: 3,
    classification: 'REJECT',
    payloadJson: {
      vendorCode: 'VND-INVALID',
      materialCode: 'MAT-STEEL-12MM',
      quantity: -10,
      uom: 'MT',
      rate: 52000,
      deliveryDate: '25-01-2026',
      projectCode: 'PRJ-2025-001'
    },
    targetEntity: 'PurchaseOrder',
    status: 'pending',
    messagesJson: ['Vendor code not found in master', 'Quantity cannot be negative']
  }
];

// Import Errors
export const importErrors: ImportError[] = [
  {
    id: 'err_001',
    importId: 'imp_001',
    rowNo: 3,
    column: 'A',
    field: 'vendorCode',
    enteredValue: 'VND-INVALID',
    expectedValue: 'Valid vendor code from master',
    errorCode: 'ERR-MST-001',
    description: 'Vendor code not found in master data',
    correction: 'Use a valid vendor code from the REFERENCE sheet or create the vendor first',
    severity: 'error'
  },
  {
    id: 'err_002',
    importId: 'imp_001',
    rowNo: 3,
    column: 'C',
    field: 'quantity',
    enteredValue: '-10',
    expectedValue: 'Positive decimal number',
    errorCode: 'ERR-FIN-001',
    description: 'Quantity cannot be negative',
    correction: 'Enter a positive quantity value',
    severity: 'error'
  },
  {
    id: 'err_003',
    importId: 'imp_004',
    rowNo: 15,
    column: 'A',
    field: 'wbsCode',
    enteredValue: 'WBS-999',
    expectedValue: 'Valid WBS code from project',
    errorCode: 'ERR-MST-002',
    description: 'WBS code not found in project',
    correction: 'Use a valid WBS code from the project structure',
    severity: 'error'
  },
  {
    id: 'err_004',
    importId: 'imp_004',
    rowNo: 28,
    column: 'D',
    field: 'fiscalYear',
    enteredValue: '2024-25',
    expectedValue: 'Current or future fiscal year',
    errorCode: 'ERR-DAT-001',
    description: 'Fiscal year is in the past',
    correction: 'Use current fiscal year (2025-26) or future years',
    severity: 'error'
  },
  {
    id: 'err_005',
    importId: 'imp_005',
    rowNo: 8,
    column: 'E',
    field: 'gstin',
    enteredValue: '27AABCU5678B1Z3',
    expectedValue: 'Unique GSTIN',
    errorCode: 'ERR-DUP-001',
    description: 'Duplicate GSTIN found in existing vendors',
    correction: 'This vendor already exists with code VND-ULTRATECH. Use UPDATE mode or different GSTIN',
    severity: 'warning'
  }
];

// Export Jobs
export const exportJobs: ExportJob[] = [
  {
    id: 'exp_001',
    exportId: 'EXP-2026-001234',
    source: 'report',
    sourceName: 'Purchase Order Register',
    filtersJson: { project: 'prj_001', dateFrom: '2026-01-01', dateTo: '2026-01-31' },
    scope: 'filtered',
    format: 'xlsx',
    requestedBy: 'usr_pm_001',
    requestedByName: 'Rajesh Kumar',
    rowCount: 156,
    fileDocumentId: 'doc_exp_001',
    status: 'completed',
    startedAt: '2026-01-15T09:00:00Z',
    finishedAt: '2026-01-15T09:00:45Z'
  },
  {
    id: 'exp_002',
    exportId: 'EXP-2026-001235',
    source: 'list',
    sourceName: 'Material Stock Report',
    filtersJson: { site: 'site_001', category: 'Steel' },
    scope: 'complete',
    format: 'pdf',
    requestedBy: 'usr_store_001',
    requestedByName: 'Suresh Nair',
    rowCount: 89,
    fileDocumentId: 'doc_exp_002',
    status: 'completed',
    startedAt: '2026-01-15T10:30:00Z',
    finishedAt: '2026-01-15T10:31:12Z'
  },
  {
    id: 'exp_003',
    exportId: 'EXP-2026-001236',
    source: 'dataset',
    sourceName: 'Vendor Master Data',
    filtersJson: { vendorType: 'supplier', status: 'active' },
    scope: 'filtered',
    format: 'csv',
    requestedBy: 'usr_proc_001',
    requestedByName: 'Vikram Singh',
    rowCount: 234,
    status: 'processing',
    startedAt: '2026-01-15T14:30:00Z'
  }
];

// Error Codes
export const errorCodes: ErrorCode[] = [
  { id: 'ec_001', code: 'ERR-STR-001', category: 'structural', messageTemplate: 'Invalid file format', correctionTemplate: 'Upload .xlsx or .csv file only', defaultSeverity: 'error' },
  { id: 'ec_002', code: 'ERR-STR-002', category: 'structural', messageTemplate: 'Template version mismatch', correctionTemplate: 'Download the latest template version', defaultSeverity: 'error' },
  { id: 'ec_003', code: 'ERR-REQ-001', category: 'required', messageTemplate: 'Required field is empty', correctionTemplate: 'Fill in the required field', defaultSeverity: 'error' },
  { id: 'ec_004', code: 'ERR-MST-001', category: 'master', messageTemplate: 'Master data not found', correctionTemplate: 'Use valid master data code', defaultSeverity: 'error' },
  { id: 'ec_005', code: 'ERR-DUP-001', category: 'duplicate', messageTemplate: 'Duplicate record found', correctionTemplate: 'Remove duplicate or use UPDATE mode', defaultSeverity: 'warning' },
  { id: 'ec_006', code: 'ERR-FIN-001', category: 'financial', messageTemplate: 'Invalid financial value', correctionTemplate: 'Enter valid positive number', defaultSeverity: 'error' },
  { id: 'ec_007', code: 'ERR-DAT-001', category: 'date', messageTemplate: 'Invalid date', correctionTemplate: 'Use correct date format DD-MM-YYYY', defaultSeverity: 'error' },
  { id: 'ec_008', code: 'ERR-REL-001', category: 'relationship', messageTemplate: 'Relationship violation', correctionTemplate: 'Ensure related records exist', defaultSeverity: 'error' },
  { id: 'ec_009', code: 'ERR-SEC-001', category: 'security', messageTemplate: 'Macro detected in file', correctionTemplate: 'Remove all macros and resubmit', defaultSeverity: 'error' }
];

// Import Modes
export const importModes: ImportMode[] = [
  { id: 'mode_001', module: 'mdm', entityType: 'master', allowedModes: ['all_or_nothing', 'valid_only'], defaultMode: 'valid_only', requiresApproval: true, approvalThresholdRule: 'any' },
  { id: 'mode_002', module: 'mat', entityType: 'transaction', allowedModes: ['all_or_nothing', 'valid_only', 'correct_and_reupload'], defaultMode: 'all_or_nothing', requiresApproval: true, approvalThresholdRule: 'value > 1000000' },
  { id: 'mode_003', module: 'prj', entityType: 'transaction', allowedModes: ['all_or_nothing'], defaultMode: 'all_or_nothing', requiresApproval: true, approvalThresholdRule: 'any' },
  { id: 'mode_004', module: 'fin', entityType: 'transaction', allowedModes: ['all_or_nothing', 'valid_only'], defaultMode: 'all_or_nothing', requiresApproval: true, approvalThresholdRule: 'any' }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-XLS-01',
    stage: 'VERIFY',
    control: 'File passes security scan, template version and structural validation before any business validation',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-XLS-02',
    stage: 'VERIFY',
    control: 'Critical errors block import; warnings require acknowledgement',
    enforcement: 'BLOCK / WARN',
    status: 'observe'
  },
  {
    id: 'CP-XLS-03',
    stage: 'APPROVE',
    control: 'Master, budget, opening stock, stock adjustment, rate and financial imports require approval by value band; approver ≠ uploader',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-XLS-04',
    stage: 'EXECUTE',
    control: 'Import executes only through module service methods with protocol checks — never direct table writes',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-XLS-05',
    stage: 'RECORD',
    control: 'Every created/updated record carries the import ID; old values retained for updates',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-XLS-06',
    stage: 'RECONCILE',
    control: 'Import result reconciles row counts (created + updated + rejected + duplicate = total)',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-XLS-07',
    stage: 'CLOSE',
    control: 'Reversal only for supported operations, with reason and approval; financial data reversed by documents',
    enforcement: 'EXCEPTION',
    status: 'observe'
  }
];

// Statistics
export const xlsStats = {
  totalTemplates: templates.length,
  activeTemplates: templates.filter(t => t.status === 'active').length,
  totalImports: importJobs.length,
  completedImports: importJobs.filter(i => i.status === 'completed').length,
  pendingApprovals: importJobs.filter(i => i.status === 'awaiting_approval').length,
  failedImports: importJobs.filter(i => i.status === 'failed').length,
  totalExports: exportJobs.length,
  completedExports: exportJobs.filter(e => e.status === 'completed').length,
  processingExports: exportJobs.filter(e => e.status === 'processing').length,
  totalErrors: importErrors.length,
  criticalErrors: importErrors.filter(e => e.severity === 'error').length
};
