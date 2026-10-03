// Part 11 — Master Data Governance Data

export interface Material {
  id: string;
  code: string;
  name: string;
  groupId: string;
  groupName: string;
  subGroup?: string;
  spec?: string;
  grade?: string;
  hsnCode?: string;
  gstRateCode?: string;
  baseUomId: string;
  baseUomName: string;
  purchaseUomId?: string;
  issueUomId?: string;
  isStockItem: boolean;
  isCapital: boolean;
  shelfLifeDays?: number;
  reorderLevel?: number;
  leadTimeDays?: number;
  batchTracked: boolean;
  qcRequired: boolean;
  allowedWastagePct?: number;
  consumptionNormBasis?: string;
  isControlledMaterial: boolean;
  status: 'active' | 'inactive' | 'pending_approval';
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  usageCount: number;
}

export interface MaterialGroup {
  id: string;
  code: string;
  name: string;
  parentId?: string;
  defaultGlInventory?: string;
  defaultGlConsumption?: string;
  isActive: boolean;
}

export interface UOM {
  id: string;
  code: string;
  name: string;
  category: 'weight' | 'length' | 'volume' | 'count' | 'area' | 'time';
  isActive: boolean;
}

export interface UOMConversion {
  id: string;
  fromUomId: string;
  fromUomName: string;
  toUomId: string;
  toUomName: string;
  factor: number;
  materialId?: string;
  materialName?: string;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  vendorType: 'supplier' | 'subcontractor' | 'labour_contractor' | 'plant_hirer' | 'service' | 'transporter';
  pan?: string;
  gstin?: string;
  gstRegType?: string;
  msmeUdyamNo?: string;
  msmeCategory?: string;
  stateCode: string;
  tdsSectionCode?: string;
  bankAccountMasked?: string;
  ifsc?: string;
  bankVerifiedAt?: string;
  categories: string[];
  blacklistFlag: boolean;
  blacklistReason?: string;
  rating?: number;
  status: 'active' | 'inactive' | 'pending_approval' | 'blocked';
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  usageCount: number;
  documentsExpiry: {
    pan: string | null;
    gstCertificate: string | null;
    cancelledCheque: string | null;
    msme: string | null;
    labourLicence: string | null;
  };
}

export interface Client {
  id: string;
  code: string;
  name: string;
  clientType: 'govt' | 'psu' | 'private';
  department?: string;
  gstin?: string;
  pan?: string;
  billingAddress: string;
  stateCode: string;
  paymentTermsId?: string;
  status: 'active' | 'inactive' | 'pending_approval';
  createdAt: string;
  createdBy: string;
  usageCount: number;
}

export interface TaxCode {
  id: string;
  code: string;
  type: 'gst' | 'tds' | 'gst_tds' | 'cess';
  rate: number;
  section?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  glAccount?: string;
  isActive: boolean;
}

export interface PaymentTerms {
  id: string;
  code: string;
  name: string;
  basis: 'invoice' | 'grn' | 'certification';
  days: number;
  advancePct?: number;
  retentionPct?: number;
  isActive: boolean;
}

export interface ChangeRequest {
  id: string;
  masterType: 'material' | 'vendor' | 'client' | 'tax_code' | 'uom';
  recordId?: string;
  recordName?: string;
  changeType: 'create' | 'update' | 'deactivate' | 'merge';
  payloadJson: Record<string, any>;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'returned';
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  workflowInstanceId?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface MergeAlias {
  id: string;
  masterType: string;
  aliasRecordId: string;
  aliasRecordName: string;
  survivorRecordId: string;
  survivorRecordName: string;
  reason: string;
  mergedAt: string;
  mergedBy: string;
}

export interface DuplicateCandidate {
  id: string;
  masterType: string;
  existingRecordId: string;
  existingRecordName: string;
  existingRecordCode: string;
  newRecordData: Record<string, any>;
  similarityScore: number;
  matchType: 'exact' | 'fuzzy';
  matchFields: string[];
}

export interface DataQualityIssue {
  id: string;
  masterType: string;
  recordId: string;
  recordName: string;
  issueType: 'missing_hsn' | 'missing_gstin' | 'duplicate_suspect' | 'unused_master' | 'incomplete_bank' | 'expired_document';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Materials (Sample)
export const materials: Material[] = [
  {
    id: 'mat_001',
    code: 'MAT-STEEL-16MM',
    name: 'Steel TMT 16mm',
    groupId: 'grp_001',
    groupName: 'Steel',
    subGroup: 'TMT Bars',
    spec: 'Fe 500D',
    grade: '500D',
    hsnCode: '7214',
    gstRateCode: 'TAX-GST-18',
    baseUomId: 'uom_mt',
    baseUomName: 'MT',
    purchaseUomId: 'uom_mt',
    issueUomId: 'uom_kg',
    isStockItem: true,
    isCapital: false,
    reorderLevel: 10,
    leadTimeDays: 7,
    batchTracked: true,
    qcRequired: true,
    allowedWastagePct: 2.5,
    consumptionNormBasis: 'theoretical',
    isControlledMaterial: true,
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2026-01-10T00:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 245
  },
  {
    id: 'mat_002',
    code: 'MAT-CEM-OPC53',
    name: 'Cement OPC 53 Grade',
    groupId: 'grp_002',
    groupName: 'Cement',
    subGroup: 'OPC',
    spec: '53 Grade',
    grade: 'OPC 53',
    hsnCode: '2523',
    gstRateCode: 'TAX-GST-28',
    baseUomId: 'uom_bag',
    baseUomName: 'Bag',
    purchaseUomId: 'uom_bag',
    issueUomId: 'uom_bag',
    isStockItem: true,
    isCapital: false,
    shelfLifeDays: 90,
    reorderLevel: 200,
    leadTimeDays: 3,
    batchTracked: true,
    qcRequired: true,
    allowedWastagePct: 3.0,
    consumptionNormBasis: 'theoretical',
    isControlledMaterial: true,
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2026-01-05T00:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 312
  },
  {
    id: 'mat_003',
    code: 'MAT-SAND-RVR',
    name: 'River Sand',
    groupId: 'grp_003',
    groupName: 'Aggregates',
    subGroup: 'Sand',
    hsnCode: '2505',
    gstRateCode: 'TAX-GST-5',
    baseUomId: 'uom_cum',
    baseUomName: 'Cum',
    isStockItem: true,
    isCapital: false,
    reorderLevel: 50,
    leadTimeDays: 2,
    batchTracked: false,
    qcRequired: true,
    allowedWastagePct: 5.0,
    isControlledMaterial: false,
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2025-12-01T00:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 189
  },
  {
    id: 'mat_004',
    code: 'MAT-BRICK-RED',
    name: 'Red Bricks (Standard)',
    groupId: 'grp_004',
    groupName: 'Masonry',
    hsnCode: '6902',
    gstRateCode: 'TAX-GST-12',
    baseUomId: 'uom_nos',
    baseUomName: 'Nos',
    isStockItem: true,
    isCapital: false,
    reorderLevel: 5000,
    leadTimeDays: 5,
    batchTracked: false,
    qcRequired: false,
    allowedWastagePct: 3.0,
    isControlledMaterial: false,
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2025-11-15T00:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 156
  },
  {
    id: 'mat_005',
    code: 'MAT-NEW-001',
    name: 'New Material Request',
    groupId: 'grp_001',
    groupName: 'Steel',
    baseUomId: 'uom_mt',
    baseUomName: 'MT',
    isStockItem: true,
    isCapital: false,
    batchTracked: false,
    qcRequired: false,
    isControlledMaterial: false,
    status: 'pending_approval',
    createdAt: '2026-01-15T10:00:00Z',
    createdBy: 'usr_proc_001',
    lastModifiedAt: '2026-01-15T10:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 0
  }
];

// Material Groups
export const materialGroups: MaterialGroup[] = [
  { id: 'grp_001', code: 'STEEL', name: 'Steel', defaultGlInventory: 'INV-STL-001', defaultGlConsumption: 'CON-STL-001', isActive: true },
  { id: 'grp_002', code: 'CEMENT', name: 'Cement', defaultGlInventory: 'INV-CEM-001', defaultGlConsumption: 'CON-CEM-001', isActive: true },
  { id: 'grp_003', code: 'AGG', name: 'Aggregates', defaultGlInventory: 'INV-AGG-001', defaultGlConsumption: 'CON-AGG-001', isActive: true },
  { id: 'grp_004', code: 'MASONRY', name: 'Masonry', defaultGlInventory: 'INV-MAS-001', defaultGlConsumption: 'CON-MAS-001', isActive: true },
  { id: 'grp_005', code: 'FINISH', name: 'Finishing Materials', isActive: true }
];

// UOM
export const uoms: UOM[] = [
  { id: 'uom_mt', code: 'MT', name: 'Metric Ton', category: 'weight', isActive: true },
  { id: 'uom_kg', code: 'KG', name: 'Kilogram', category: 'weight', isActive: true },
  { id: 'uom_bag', code: 'BAG', name: 'Bag (50kg)', category: 'count', isActive: true },
  { id: 'uom_cum', code: 'CUM', name: 'Cubic Meter', category: 'volume', isActive: true },
  { id: 'uom_cft', code: 'CFT', name: 'Cubic Feet', category: 'volume', isActive: true },
  { id: 'uom_nos', code: 'NOS', name: 'Numbers', category: 'count', isActive: true },
  { id: 'uom_rmt', code: 'RMT', name: 'Running Meter', category: 'length', isActive: true },
  { id: 'uom_sqm', code: 'SQM', name: 'Square Meter', category: 'area', isActive: true }
];

// UOM Conversions
export const uomConversions: UOMConversion[] = [
  { id: 'conv_001', fromUomId: 'uom_mt', fromUomName: 'MT', toUomId: 'uom_kg', toUomName: 'KG', factor: 1000 },
  { id: 'conv_002', fromUomId: 'uom_cum', fromUomName: 'CUM', toUomId: 'uom_cft', toUomName: 'CFT', factor: 35.3147 },
  { id: 'conv_003', fromUomId: 'uom_bag', fromUomName: 'BAG', toUomId: 'uom_kg', toUomName: 'KG', factor: 50, materialId: 'mat_002', materialName: 'Cement OPC 53 Grade' }
];

// Vendors
export const vendors: Vendor[] = [
  {
    id: 'vend_001',
    code: 'VND-TATA-STEEL',
    name: 'Tata Steel Ltd.',
    vendorType: 'supplier',
    pan: 'AABCT1234A',
    gstin: '27AABCT1234A1Z5',
    gstRegType: 'regular',
    msmeUdyamNo: 'UDYAM-MH-01-0012345',
    msmeCategory: 'micro',
    stateCode: '27',
    tdsSectionCode: '194Q',
    bankAccountMasked: 'XXXX XXXX XXXX 1234',
    ifsc: 'TATA0001234',
    bankVerifiedAt: '2026-01-01T00:00:00Z',
    categories: ['Steel', 'TMT Bars'],
    blacklistFlag: false,
    rating: 4.5,
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2026-01-10T00:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 89,
    documentsExpiry: {
      pan: '2030-12-31',
      gstCertificate: '2027-03-31',
      cancelledCheque: null,
      msme: '2028-06-30',
      labourLicence: null
    }
  },
  {
    id: 'vend_002',
    code: 'VND-ULTRATECH',
    name: 'UltraTech Cement Ltd.',
    vendorType: 'supplier',
    pan: 'AABCU5678B',
    gstin: '27AABCU5678B1Z3',
    gstRegType: 'regular',
    stateCode: '27',
    tdsSectionCode: '194Q',
    bankAccountMasked: 'XXXX XXXX XXXX 5678',
    ifsc: 'UTCB0005678',
    bankVerifiedAt: '2026-01-05T00:00:00Z',
    categories: ['Cement'],
    blacklistFlag: false,
    rating: 4.8,
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2026-01-05T00:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 124,
    documentsExpiry: {
      pan: '2029-12-31',
      gstCertificate: '2027-03-31',
      cancelledCheque: null,
      msme: null,
      labourLicence: null
    }
  },
  {
    id: 'vend_003',
    code: 'VND-ABC-CONST',
    name: 'ABC Constructions',
    vendorType: 'subcontractor',
    pan: 'AABCA9012C',
    gstin: '29AABCA9012C1Z2',
    gstRegType: 'regular',
    stateCode: '29',
    tdsSectionCode: '194C',
    bankAccountMasked: 'XXXX XXXX XXXX 9012',
    ifsc: 'ABCB0009012',
    bankVerifiedAt: '2025-12-01T00:00:00Z',
    categories: ['Civil Works', 'Structural'],
    blacklistFlag: false,
    rating: 4.2,
    status: 'active',
    createdAt: '2025-03-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2026-01-08T00:00:00Z',
    lastModifiedBy: 'usr_proc_001',
    usageCount: 34,
    documentsExpiry: {
      pan: '2028-12-31',
      gstCertificate: '2027-03-31',
      cancelledCheque: null,
      msme: null,
      labourLicence: '2026-12-31'
    }
  },
  {
    id: 'vend_004',
    code: 'VND-BLACKLIST',
    name: 'Blacklisted Vendor',
    vendorType: 'supplier',
    pan: 'AABCB3456D',
    gstin: '27AABCB3456D1Z1',
    stateCode: '27',
    categories: ['Materials'],
    blacklistFlag: true,
    blacklistReason: 'Poor quality delivery, payment disputes',
    rating: 1.5,
    status: 'blocked',
    createdAt: '2025-06-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    lastModifiedAt: '2025-12-15T00:00:00Z',
    lastModifiedBy: 'usr_cfo_001',
    usageCount: 12,
    documentsExpiry: {
      pan: '2027-12-31',
      gstCertificate: '2026-03-31',
      cancelledCheque: null,
      msme: null,
      labourLicence: null
    }
  }
];

// Clients
export const clients: Client[] = [
  {
    id: 'cl_001',
    code: 'CLT-METRO-DEV',
    name: 'Metro Developers Pvt. Ltd.',
    clientType: 'private',
    gstin: '27AABCM1234D1Z8',
    pan: 'AABCM1234D',
    billingAddress: 'Andheri West, Mumbai - 400058',
    stateCode: '27',
    paymentTermsId: 'pt_001',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    usageCount: 45
  },
  {
    id: 'cl_002',
    code: 'CLT-NHAI',
    name: 'National Highways Authority of India',
    clientType: 'govt',
    department: 'Ministry of Road Transport',
    gstin: '07AAAGH0012A1ZP',
    pan: 'AAAGH0012A',
    billingAddress: 'Gwalior, Madhya Pradesh',
    stateCode: '23',
    paymentTermsId: 'pt_002',
    status: 'active',
    createdAt: '2025-02-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    usageCount: 23
  }
];

// Tax Codes
export const taxCodes: TaxCode[] = [
  { id: 'tax_001', code: 'TAX-GST-5', type: 'gst', rate: 5, effectiveFrom: '2025-04-01', glAccount: 'GST-INPUT-5', isActive: true },
  { id: 'tax_002', code: 'TAX-GST-12', type: 'gst', rate: 12, effectiveFrom: '2025-04-01', glAccount: 'GST-INPUT-12', isActive: true },
  { id: 'tax_003', code: 'TAX-GST-18', type: 'gst', rate: 18, effectiveFrom: '2025-04-01', glAccount: 'GST-INPUT-18', isActive: true },
  { id: 'tax_004', code: 'TAX-GST-28', type: 'gst', rate: 28, effectiveFrom: '2025-04-01', glAccount: 'GST-INPUT-28', isActive: true },
  { id: 'tax_005', code: 'TAX-TDS-194C', type: 'tds', rate: 2, section: '194C', effectiveFrom: '2025-04-01', glAccount: 'TDS-194C', isActive: true },
  { id: 'tax_006', code: 'TAX-TDS-194Q', type: 'tds', rate: 0.1, section: '194Q', effectiveFrom: '2025-04-01', glAccount: 'TDS-194Q', isActive: true }
];

// Payment Terms
export const paymentTerms: PaymentTerms[] = [
  { id: 'pt_001', code: 'PT-30', name: '30 Days from Invoice', basis: 'invoice', days: 30, isActive: true },
  { id: 'pt_002', code: 'PT-45-GRN', name: '45 Days from GRN', basis: 'grn', days: 45, isActive: true },
  { id: 'pt_003', code: 'PT-60-CERT', name: '60 Days from Certification', basis: 'certification', days: 60, advancePct: 10, retentionPct: 5, isActive: true },
  { id: 'pt_004', code: 'PT-ADV-20', name: '20% Advance, Balance on Delivery', basis: 'invoice', days: 15, advancePct: 20, isActive: true }
];

// Change Requests
export const changeRequests: ChangeRequest[] = [
  {
    id: 'cr_001',
    masterType: 'material',
    changeType: 'create',
    payloadJson: {
      code: 'MAT-NEW-001',
      name: 'New Material Request',
      groupId: 'grp_001',
      baseUomId: 'uom_mt'
    },
    status: 'submitted',
    requestedBy: 'usr_proc_001',
    requestedByName: 'Vikram Singh',
    requestedAt: '2026-01-15T10:00:00Z',
    workflowInstanceId: 'wf_cr_001'
  },
  {
    id: 'cr_002',
    masterType: 'vendor',
    recordId: 'vend_003',
    recordName: 'ABC Constructions',
    changeType: 'update',
    payloadJson: {
      bankAccountMasked: 'XXXX XXXX XXXX 9999',
      ifsc: 'ABCB0009999'
    },
    status: 'submitted',
    requestedBy: 'usr_proc_001',
    requestedByName: 'Vikram Singh',
    requestedAt: '2026-01-14T14:00:00Z',
    workflowInstanceId: 'wf_cr_002'
  },
  {
    id: 'cr_003',
    masterType: 'material',
    recordId: 'mat_001',
    recordName: 'Steel TMT 16mm',
    changeType: 'update',
    payloadJson: {
      reorderLevel: 15,
      leadTimeDays: 10
    },
    status: 'approved',
    requestedBy: 'usr_store_001',
    requestedByName: 'Suresh Nair',
    requestedAt: '2026-01-10T09:00:00Z',
    workflowInstanceId: 'wf_cr_003',
    approvedBy: 'usr_mdm_steward_001',
    approvedAt: '2026-01-11T11:00:00Z'
  },
  {
    id: 'cr_004',
    masterType: 'vendor',
    recordId: 'vend_004',
    recordName: 'Blacklisted Vendor',
    changeType: 'deactivate',
    payloadJson: {
      blacklistFlag: true,
      blacklistReason: 'Poor quality delivery, payment disputes'
    },
    status: 'approved',
    requestedBy: 'usr_cfo_001',
    requestedByName: 'CFO',
    requestedAt: '2025-12-10T00:00:00Z',
    workflowInstanceId: 'wf_cr_004',
    approvedBy: 'usr_mgmt_001',
    approvedAt: '2025-12-15T00:00:00Z'
  }
];

// Merge Aliases
export const mergeAliases: MergeAlias[] = [
  {
    id: 'alias_001',
    masterType: 'vendor',
    aliasRecordId: 'vend_old_001',
    aliasRecordName: 'Tata Steel (Old Code)',
    survivorRecordId: 'vend_001',
    survivorRecordName: 'Tata Steel Ltd.',
    reason: 'Duplicate vendor entry - same GSTIN',
    mergedAt: '2025-06-01T00:00:00Z',
    mergedBy: 'usr_mdm_steward_001'
  }
];

// Duplicate Candidates
export const duplicateCandidates: DuplicateCandidate[] = [
  {
    id: 'dup_001',
    masterType: 'vendor',
    existingRecordId: 'vend_001',
    existingRecordName: 'Tata Steel Ltd.',
    existingRecordCode: 'VND-TATA-STEEL',
    newRecordData: {
      name: 'Tata Steel Limited',
      gstin: '27AABCT1234A1Z5'
    },
    similarityScore: 0.92,
    matchType: 'exact',
    matchFields: ['gstin']
  },
  {
    id: 'dup_002',
    masterType: 'material',
    existingRecordId: 'mat_002',
    existingRecordName: 'Cement OPC 53 Grade',
    existingRecordCode: 'MAT-CEM-OPC53',
    newRecordData: {
      name: 'Cement OPC 53',
      spec: '53 Grade'
    },
    similarityScore: 0.88,
    matchType: 'fuzzy',
    matchFields: ['name', 'spec']
  }
];

// Data Quality Issues
export const dataQualityIssues: DataQualityIssue[] = [
  {
    id: 'dq_001',
    masterType: 'material',
    recordId: 'mat_003',
    recordName: 'River Sand',
    issueType: 'missing_hsn',
    severity: 'medium',
    description: 'HSN code missing for material',
    detectedAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'dq_002',
    masterType: 'vendor',
    recordId: 'vend_002',
    recordName: 'UltraTech Cement Ltd.',
    issueType: 'expired_document',
    severity: 'high',
    description: 'MSME certificate expiring in 30 days',
    detectedAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'dq_003',
    masterType: 'vendor',
    recordId: 'vend_003',
    recordName: 'ABC Constructions',
    issueType: 'incomplete_bank',
    severity: 'medium',
    description: 'Bank details not verified in last 6 months',
    detectedAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'dq_004',
    masterType: 'material',
    recordId: 'mat_004',
    recordName: 'Red Bricks (Standard)',
    issueType: 'unused_master',
    severity: 'low',
    description: 'Material not used in last 180 days',
    detectedAt: '2026-01-15T00:00:00Z'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-MDM-01',
    stage: 'APPROVE',
    control: 'All master creations/changes maker-checker with source documents',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-MDM-02',
    stage: 'VERIFY',
    control: 'Duplicate check (GSTIN/PAN/name/spec) before save',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-MDM-03',
    stage: 'VERIFY',
    control: 'Every material has norm-relevant attributes (UOM, group, allowed wastage %) before it can be planned or issued',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-MDM-04',
    stage: 'MONITOR',
    control: 'Vendor bank detail change places payments on hold until re-verified',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const mdmStats = {
  totalMaterials: materials.length,
  activeMaterials: materials.filter(m => m.status === 'active').length,
  totalVendors: vendors.length,
  activeVendors: vendors.filter(v => v.status === 'active').length,
  blacklistedVendors: vendors.filter(v => v.blacklistFlag).length,
  totalClients: clients.length,
  pendingChangeRequests: changeRequests.filter(cr => cr.status === 'submitted').length,
  approvedChangeRequests: changeRequests.filter(cr => cr.status === 'approved').length,
  duplicateSuspects: duplicateCandidates.length,
  dataQualityIssues: dataQualityIssues.length,
  criticalIssues: dataQualityIssues.filter(dq => dq.severity === 'critical').length,
  highIssues: dataQualityIssues.filter(dq => dq.severity === 'high').length
};
