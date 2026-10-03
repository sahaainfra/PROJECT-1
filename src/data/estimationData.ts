// Part 23 — Advanced Estimation Data

export interface Estimate {
  id: string;
  estimateNo: string;
  projectId?: string;
  projectName?: string;
  tenderId?: string;
  tenderNo?: string;
  versionNo: string;
  basis: 'tender' | 'budget' | 'revision';
  status: 'draft' | 'submitted' | 'approved' | 'released' | 'superseded';
  baseDate: string;
  locationFactor: number;
  totalDirectCost: number;
  totalIndirects: number;
  markupPct: number;
  totalPrice: number;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

export interface ResourceRate {
  id: string;
  resourceType: 'material' | 'labour' | 'plant' | 'subcontract';
  resourceId: string;
  resourceName: string;
  region: string;
  source: 'market' | 'quotation' | 'DSR' | 'SOR' | 'historical';
  rate: number;
  uomId: string;
  uomName: string;
  effectiveDate: string;
  basicRate: number;
  freight: number;
  loadingUnloading: number;
  gstTreatment: 'inclusive' | 'exclusive' | 'exempt';
}

export interface RateAnalysis {
  id: string;
  estimateId: string;
  boqItemId: string;
  boqItemNo: string;
  boqItemDescription: string;
  analysisQty: number;
  analysisUom: string;
  referenceCode?: string;
  notes?: string;
  directCost: number;
  totalAddons: number;
  finalRate: number;
  lines: RateAnalysisLine[];
  addons: Addon[];
}

export interface RateAnalysisLine {
  id: string;
  rateAnalysisId: string;
  resourceType: 'material' | 'labour' | 'plant' | 'subcontract';
  resourceId: string;
  resourceName: string;
  description: string;
  qty: number;
  uomId: string;
  uomName: string;
  rate: number;
  amount: number;
  wastagePct: number;
}

export interface Addon {
  id: string;
  rateAnalysisId?: string;
  estimateId?: string;
  type: 'water_charges' | 'sundries' | 'overheads' | 'profit' | 'contingency' | 'escalation' | 'insurance' | 'labour_cess' | 'gst';
  basisPct: number;
  amount: number;
  description: string;
}

export interface TakeoffSheet {
  id: string;
  estimateId: string;
  boqItemId: string;
  boqItemNo: string;
  description: string;
  location: string;
  nos: number;
  length: number;
  breadth: number;
  depthHeight: number;
  factor: number;
  quantity: number;
  deductionFlag: boolean;
  drawingRef?: string;
}

export interface ReferenceLibrary {
  id: string;
  code: string;
  name: string;
  version: string;
  effectiveDate: string;
  itemCount: number;
}

export interface ReferenceItem {
  id: string;
  libraryId: string;
  itemCode: string;
  description: string;
  uom: string;
  rate: number;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Estimates
export const estimates: Estimate[] = [
  {
    id: 'est_001',
    estimateNo: 'EST-2026-001',
    tenderId: 'tnd_001',
    tenderNo: 'TND-2026-001',
    versionNo: '1.0',
    basis: 'tender',
    status: 'approved',
    baseDate: '2026-01-15',
    locationFactor: 1.15,
    totalDirectCost: 185000000,
    totalIndirects: 27750000,
    markupPct: 12,
    totalPrice: 238140000,
    approvedBy: 'usr_cm_001',
    approvedAt: '2026-01-18T14:00:00Z',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-18T14:00:00Z',
    createdBy: 'usr_est_001',
    createdByName: 'Estimation Engineer'
  },
  {
    id: 'est_002',
    estimateNo: 'EST-2026-002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    versionNo: '2.0',
    basis: 'budget',
    status: 'released',
    baseDate: '2026-01-20',
    locationFactor: 1.15,
    totalDirectCost: 192000000,
    totalIndirects: 28800000,
    markupPct: 10,
    totalPrice: 241920000,
    approvedBy: 'usr_cm_001',
    approvedAt: '2026-01-22T10:00:00Z',
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-01-22T10:00:00Z',
    createdBy: 'usr_est_001',
    createdByName: 'Estimation Engineer'
  },
  {
    id: 'est_003',
    estimateNo: 'EST-2026-003',
    tenderId: 'tnd_003',
    tenderNo: 'TND-2026-003',
    versionNo: '1.0',
    basis: 'tender',
    status: 'draft',
    baseDate: '2026-01-25',
    locationFactor: 1.10,
    totalDirectCost: 72000000,
    totalIndirects: 10800000,
    markupPct: 15,
    totalPrice: 95220000,
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-01-25T16:00:00Z',
    createdBy: 'usr_est_002',
    createdByName: 'Senior Estimator'
  }
];

// Sample Resource Rates
export const resourceRates: ResourceRate[] = [
  {
    id: 'rr_001',
    resourceType: 'material',
    resourceId: 'mat_001',
    resourceName: 'Steel TMT Fe500 16mm',
    region: 'Maharashtra',
    source: 'market',
    rate: 55000,
    uomId: 'uom_mt',
    uomName: 'MT',
    effectiveDate: '2026-01-01',
    basicRate: 48000,
    freight: 5000,
    loadingUnloading: 2000,
    gstTreatment: 'exclusive'
  },
  {
    id: 'rr_002',
    resourceType: 'material',
    resourceId: 'mat_002',
    resourceName: 'Cement OPC 53 Grade',
    region: 'Maharashtra',
    source: 'market',
    rate: 380,
    uomId: 'uom_bag',
    uomName: 'Bag',
    effectiveDate: '2026-01-01',
    basicRate: 340,
    freight: 30,
    loadingUnloading: 10,
    gstTreatment: 'exclusive'
  },
  {
    id: 'rr_003',
    resourceType: 'material',
    resourceId: 'mat_003',
    resourceName: 'River Sand',
    region: 'Maharashtra',
    source: 'quotation',
    rate: 1800,
    uomId: 'uom_cum',
    uomName: 'Cum',
    effectiveDate: '2026-01-10',
    basicRate: 1600,
    freight: 150,
    loadingUnloading: 50,
    gstTreatment: 'exclusive'
  },
  {
    id: 'rr_004',
    resourceType: 'labour',
    resourceId: 'lab_001',
    resourceName: 'Mazdoor (Unskilled)',
    region: 'Maharashtra',
    source: 'DSR',
    rate: 500,
    uomId: 'uom_day',
    uomName: 'Day',
    effectiveDate: '2026-01-01',
    basicRate: 500,
    freight: 0,
    loadingUnloading: 0,
    gstTreatment: 'exempt'
  },
  {
    id: 'rr_005',
    resourceType: 'labour',
    resourceId: 'lab_002',
    resourceName: 'Mason',
    region: 'Maharashtra',
    source: 'DSR',
    rate: 700,
    uomId: 'uom_day',
    uomName: 'Day',
    effectiveDate: '2026-01-01',
    basicRate: 700,
    freight: 0,
    loadingUnloading: 0,
    gstTreatment: 'exempt'
  },
  {
    id: 'rr_006',
    resourceType: 'plant',
    resourceId: 'plt_001',
    resourceName: 'Concrete Mixer (0.5 cum)',
    region: 'Maharashtra',
    source: 'historical',
    rate: 1500,
    uomId: 'uom_day',
    uomName: 'Day',
    effectiveDate: '2026-01-01',
    basicRate: 1500,
    freight: 0,
    loadingUnloading: 0,
    gstTreatment: 'exclusive'
  },
  {
    id: 'rr_007',
    resourceType: 'plant',
    resourceId: 'plt_002',
    resourceName: 'Excavator (0.5 cum bucket)',
    region: 'Maharashtra',
    source: 'quotation',
    rate: 12000,
    uomId: 'uom_day',
    uomName: 'Day',
    effectiveDate: '2026-01-15',
    basicRate: 12000,
    freight: 0,
    loadingUnloading: 0,
    gstTreatment: 'exclusive'
  }
];

// Sample Rate Analyses
export const rateAnalyses: RateAnalysis[] = [
  {
    id: 'ra_001',
    estimateId: 'est_001',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    boqItemDescription: 'Excavation for foundation',
    analysisQty: 1,
    analysisUom: 'Cum',
    referenceCode: 'CPWD 4.1',
    notes: 'Excavation in all types of soil including rock cutting',
    directCost: 220,
    totalAddons: 30,
    finalRate: 250,
    lines: [
      {
        id: 'ral_001',
        rateAnalysisId: 'ra_001',
        resourceType: 'labour',
        resourceId: 'lab_001',
        resourceName: 'Mazdoor',
        description: 'Unskilled labour for excavation',
        qty: 0.4,
        uomId: 'uom_day',
        uomName: 'Day',
        rate: 500,
        amount: 200,
        wastagePct: 0
      },
      {
        id: 'ral_002',
        rateAnalysisId: 'ra_001',
        resourceType: 'plant',
        resourceId: 'plt_002',
        resourceName: 'Excavator',
        description: 'Excavator with operator',
        qty: 0.01,
        uomId: 'uom_day',
        uomName: 'Day',
        rate: 12000,
        amount: 120,
        wastagePct: 0
      }
    ],
    addons: [
      {
        id: 'addon_001',
        rateAnalysisId: 'ra_001',
        type: 'water_charges',
        basisPct: 1,
        amount: 2.2,
        description: 'Water charges @ 1%'
      },
      {
        id: 'addon_002',
        rateAnalysisId: 'ra_001',
        type: 'overheads',
        basisPct: 10,
        amount: 22,
        description: 'Overheads @ 10%'
      },
      {
        id: 'addon_003',
        rateAnalysisId: 'ra_001',
        type: 'profit',
        basisPct: 5,
        amount: 11,
        description: 'Contractor profit @ 5%'
      }
    ]
  },
  {
    id: 'ra_002',
    estimateId: 'est_001',
    boqItemId: 'item_004',
    boqItemNo: 'A.1.2',
    boqItemDescription: 'PCC M15 (1:2:4)',
    analysisQty: 1,
    analysisUom: 'Cum',
    referenceCode: 'CPWD 4.2',
    notes: 'Providing and laying PCC M15 in foundation bed',
    directCost: 4200,
    totalAddons: 300,
    finalRate: 4500,
    lines: [
      {
        id: 'ral_003',
        rateAnalysisId: 'ra_002',
        resourceType: 'material',
        resourceId: 'mat_002',
        resourceName: 'Cement OPC 53',
        description: 'Cement for M15 concrete',
        qty: 6.5,
        uomId: 'uom_bag',
        uomName: 'Bag',
        rate: 380,
        amount: 2470,
        wastagePct: 3
      },
      {
        id: 'ral_004',
        rateAnalysisId: 'ra_002',
        resourceType: 'material',
        resourceId: 'mat_003',
        resourceName: 'River Sand',
        description: 'Fine aggregate',
        qty: 0.45,
        uomId: 'uom_cum',
        uomName: 'Cum',
        rate: 1800,
        amount: 810,
        wastagePct: 5
      },
      {
        id: 'ral_005',
        rateAnalysisId: 'ra_002',
        resourceType: 'material',
        resourceId: 'mat_004',
        resourceName: 'Aggregate 20mm',
        description: 'Coarse aggregate',
        qty: 0.85,
        uomId: 'uom_cum',
        uomName: 'Cum',
        rate: 1200,
        amount: 1020,
        wastagePct: 5
      },
      {
        id: 'ral_006',
        rateAnalysisId: 'ra_002',
        resourceType: 'labour',
        resourceId: 'lab_001',
        resourceName: 'Mazdoor',
        description: 'Unskilled labour',
        qty: 0.5,
        uomId: 'uom_day',
        uomName: 'Day',
        rate: 500,
        amount: 250,
        wastagePct: 0
      },
      {
        id: 'ral_007',
        rateAnalysisId: 'ra_002',
        resourceType: 'labour',
        resourceId: 'lab_002',
        resourceName: 'Mason',
        description: 'Skilled mason',
        qty: 0.25,
        uomId: 'uom_day',
        uomName: 'Day',
        rate: 700,
        amount: 175,
        wastagePct: 0
      }
    ],
    addons: [
      {
        id: 'addon_004',
        rateAnalysisId: 'ra_002',
        type: 'water_charges',
        basisPct: 1,
        amount: 42,
        description: 'Water charges @ 1%'
      },
      {
        id: 'addon_005',
        rateAnalysisId: 'ra_002',
        type: 'overheads',
        basisPct: 10,
        amount: 420,
        description: 'Overheads @ 10%'
      },
      {
        id: 'addon_006',
        rateAnalysisId: 'ra_002',
        type: 'profit',
        basisPct: 5,
        amount: 210,
        description: 'Contractor profit @ 5%'
      }
    ]
  }
];

// Sample Take-off Sheets
export const takeoffSheets: TakeoffSheet[] = [
  {
    id: 'to_001',
    estimateId: 'est_001',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    description: 'Excavation for foundation footing F1',
    location: 'Block A - Foundation',
    nos: 10,
    length: 5,
    breadth: 3,
    depthHeight: 2,
    factor: 1,
    quantity: 300,
    deductionFlag: false,
    drawingRef: 'DWG-STR-001'
  },
  {
    id: 'to_002',
    estimateId: 'est_001',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    description: 'Excavation for foundation footing F2',
    location: 'Block A - Foundation',
    nos: 15,
    length: 4,
    breadth: 2.5,
    depthHeight: 2,
    factor: 1,
    quantity: 300,
    deductionFlag: false,
    drawingRef: 'DWG-STR-001'
  },
  {
    id: 'to_003',
    estimateId: 'est_001',
    boqItemId: 'item_004',
    boqItemNo: 'A.1.2',
    description: 'PCC M15 under footing F1',
    location: 'Block A - Foundation',
    nos: 10,
    length: 5.2,
    breadth: 3.2,
    depthHeight: 0.15,
    factor: 1,
    quantity: 249.6,
    deductionFlag: false,
    drawingRef: 'DWG-STR-001'
  }
];

// Sample Reference Libraries
export const referenceLibraries: ReferenceLibrary[] = [
  {
    id: 'lib_001',
    code: 'DSR-2023',
    name: 'CPWD Delhi Schedule of Rates 2023',
    version: '1.0',
    effectiveDate: '2023-07-01',
    itemCount: 2500
  },
  {
    id: 'lib_002',
    code: 'SOR-MH-2024',
    name: 'Maharashtra State Schedule of Rates 2024',
    version: '1.0',
    effectiveDate: '2024-04-01',
    itemCount: 1800
  },
  {
    id: 'lib_003',
    code: 'DSR-2022',
    name: 'CPWD Delhi Schedule of Rates 2022',
    version: '1.0',
    effectiveDate: '2022-07-01',
    itemCount: 2400
  }
];

// Sample Reference Items
export const referenceItems: ReferenceItem[] = [
  {
    id: 'ref_001',
    libraryId: 'lib_001',
    itemCode: '4.1',
    description: 'Excavation in all types of soil including rock cutting',
    uom: 'Cum',
    rate: 245
  },
  {
    id: 'ref_002',
    libraryId: 'lib_001',
    itemCode: '4.2',
    description: 'Providing and laying PCC M15 (1:2:4)',
    uom: 'Cum',
    rate: 4350
  },
  {
    id: 'ref_003',
    libraryId: 'lib_001',
    itemCode: '4.3',
    description: 'Providing and laying RCC M25',
    uom: 'Cum',
    rate: 6200
  },
  {
    id: 'ref_004',
    libraryId: 'lib_002',
    itemCode: '2.1.1',
    description: 'Excavation in ordinary soil',
    uom: 'Cum',
    rate: 230
  },
  {
    id: 'ref_005',
    libraryId: 'lib_002',
    itemCode: '2.2.1',
    description: 'PCC M15 (1:2:4)',
    uom: 'Cum',
    rate: 4200
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-EST-01',
    stage: 'VERIFY',
    control: 'Rates referenced from dated rate library; manual rates need source document',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-EST-02',
    stage: 'APPROVE',
    control: 'Markup/contingency outside policy band needs Management approval',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-EST-03',
    stage: 'RECONCILE',
    control: 'Released estimate reconciles to tender BOQ total',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const estimationStats = {
  totalEstimates: estimates.length,
  draftEstimates: estimates.filter(e => e.status === 'draft').length,
  approvedEstimates: estimates.filter(e => e.status === 'approved').length,
  releasedEstimates: estimates.filter(e => e.status === 'released').length,
  totalResourceRates: resourceRates.length,
  materialRates: resourceRates.filter(r => r.resourceType === 'material').length,
  labourRates: resourceRates.filter(r => r.resourceType === 'labour').length,
  plantRates: resourceRates.filter(r => r.resourceType === 'plant').length,
  totalRateAnalyses: rateAnalyses.length,
  referenceLibraries: referenceLibraries.length,
  totalReferenceItems: referenceItems.length
};

// Sensitivity Analysis Data
export const sensitivityScenarios = [
  { id: 'sens_001', name: 'Base Case', steelChange: 0, cementChange: 0, labourChange: 0, totalImpact: 0 },
  { id: 'sens_002', name: 'Steel +10%', steelChange: 10, cementChange: 0, labourChange: 0, totalImpact: 2.5 },
  { id: 'sens_003', name: 'Steel -10%', steelChange: -10, cementChange: 0, labourChange: 0, totalImpact: -2.5 },
  { id: 'sens_004', name: 'Cement +10%', steelChange: 0, cementChange: 10, labourChange: 0, totalImpact: 1.8 },
  { id: 'sens_005', name: 'Labour +15%', steelChange: 0, cementChange: 0, labourChange: 15, totalImpact: 3.2 },
  { id: 'sens_006', name: 'All +10%', steelChange: 10, cementChange: 10, labourChange: 10, totalImpact: 7.5 }
];
