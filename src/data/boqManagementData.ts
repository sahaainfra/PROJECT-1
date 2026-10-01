// Part 20 — WBS, BOQ & Work Package Management Data

export interface BOQVersion {
  id: string;
  projectId: string;
  projectName: string;
  type: 'tender' | 'contract' | 'revised' | 'working';
  versionNo: string;
  status: 'draft' | 'submitted' | 'approved' | 'frozen' | 'superseded';
  effectiveDate: string;
  totalAmount: number;
  approvedBy?: string;
  approvedAt?: string;
  itemCount: number;
  createdAt: string;
  createdBy: string;
}

export interface BOQItem {
  id: string;
  versionId: string;
  parentId?: string;
  level: 'schedule' | 'section' | 'item' | 'sub-item';
  itemNo: string;
  description: string;
  longDescription?: string;
  uomId: string;
  uomName: string;
  quantity: number;
  rate: number;
  amount: number;
  itemType: 'scheduled' | 'non_scheduled' | 'extra' | 'substituted' | 'provisional_sum' | 'prime_cost';
  referenceCode?: string;
  specificationRef?: string;
  isBillable: boolean;
  deviationLimitPct: number;
  children?: BOQItem[];
  mappedActivities?: string[];
  hasNorms: boolean;
}

export interface WBSNode {
  id: string;
  projectId: string;
  parentId?: string;
  code: string;
  name: string;
  level: number;
  responsibleUserId?: string;
  responsibleUserName?: string;
  costCentreId?: string;
  weightPct: number;
  sortOrder: number;
  children?: WBSNode[];
}

export interface WorkPackage {
  id: string;
  wbsNodeId: string;
  wbsNodeCode: string;
  code: string;
  name: string;
  type: 'self' | 'subcontract' | 'supply';
  responsibleId: string;
  responsibleName: string;
  subcontractId?: string;
  subcontractName?: string;
  activityCount: number;
}

export interface Activity {
  id: string;
  workPackageId: string;
  workPackageCode: string;
  code: string;
  name: string;
  uomId: string;
  uomName: string;
  plannedQty: number;
  calendarId?: string;
  responsibleId: string;
  responsibleName: string;
  mappedBOQItems: number;
}

export interface BOQActivityMap {
  id: string;
  boqItemId: string;
  boqItemNo: string;
  boqItemDescription: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  qtySharePct: number;
  quantity: number;
}

export interface ResourceNorm {
  id: string;
  boqItemId?: string;
  activityId?: string;
  resourceName: string;
  resourceType: 'material' | 'labour' | 'plant' | 'subcontract';
  resourceId: string;
  qtyPerUnit: number;
  wastagePct: number;
  source: 'rate_analysis' | 'manual';
  unitCost: number;
  totalCost: number;
}

export interface ImportResult {
  id: string;
  versionId: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  status: 'pending' | 'validating' | 'completed' | 'failed';
  errors: Array<{
    row: number;
    column: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  createdAt: string;
}

export interface VersionComparison {
  versionA: string;
  versionB: string;
  differences: Array<{
    itemNo: string;
    description: string;
    field: 'quantity' | 'rate' | 'amount';
    valueA: number;
    valueB: number;
    change: number;
    changePct: number;
  }>;
  summary: {
    totalItemsChanged: number;
    totalAmountChange: number;
    totalAmountChangePct: number;
  };
}

// Sample BOQ Versions
export const boqVersions: BOQVersion[] = [
  {
    id: 'boq_v1',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'tender',
    versionNo: 'T-001',
    status: 'superseded',
    effectiveDate: '2025-03-01',
    totalAmount: 118000000,
    itemCount: 245,
    createdAt: '2025-02-15T00:00:00Z',
    createdBy: 'usr_qs_001'
  },
  {
    id: 'boq_v2',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'contract',
    versionNo: 'C-001',
    status: 'frozen',
    effectiveDate: '2025-06-01',
    totalAmount: 125000000,
    approvedBy: 'usr_cm_001',
    approvedAt: '2025-05-28T10:00:00Z',
    itemCount: 268,
    createdAt: '2025-05-20T00:00:00Z',
    createdBy: 'usr_qs_001'
  },
  {
    id: 'boq_v3',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'revised',
    versionNo: 'R-001',
    status: 'approved',
    effectiveDate: '2026-01-01',
    totalAmount: 128500000,
    approvedBy: 'usr_cm_001',
    approvedAt: '2025-12-20T14:00:00Z',
    itemCount: 275,
    createdAt: '2025-12-15T00:00:00Z',
    createdBy: 'usr_qs_001'
  },
  {
    id: 'boq_v4',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    type: 'working',
    versionNo: 'W-001',
    status: 'draft',
    effectiveDate: '2026-01-15',
    totalAmount: 129200000,
    itemCount: 280,
    createdAt: '2026-01-10T00:00:00Z',
    createdBy: 'usr_qs_001'
  }
];

// Sample BOQ Items (Tree Structure)
export const boqItems: BOQItem[] = [
  {
    id: 'item_001',
    versionId: 'boq_v3',
    level: 'schedule',
    itemNo: 'A',
    description: 'Civil Works',
    uomId: 'ls',
    uomName: 'LS',
    quantity: 1,
    rate: 85000000,
    amount: 85000000,
    itemType: 'scheduled',
    isBillable: true,
    deviationLimitPct: 25,
    hasNorms: false,
    children: [
      {
        id: 'item_002',
        versionId: 'boq_v3',
        parentId: 'item_001',
        level: 'section',
        itemNo: 'A.1',
        description: 'Foundation & Substructure',
        uomId: 'ls',
        uomName: 'LS',
        quantity: 1,
        rate: 25000000,
        amount: 25000000,
        itemType: 'scheduled',
        isBillable: true,
        deviationLimitPct: 25,
        hasNorms: false,
        children: [
          {
            id: 'item_003',
            versionId: 'boq_v3',
            parentId: 'item_002',
            level: 'item',
            itemNo: 'A.1.1',
            description: 'Excavation for foundation',
            longDescription: 'Excavation in all types of soil including rock cutting for foundation, lead up to 50m and lift up to 3m',
            uomId: 'cum',
            uomName: 'Cum',
            quantity: 2500,
            rate: 250,
            amount: 625000,
            itemType: 'scheduled',
            referenceCode: 'CPWD 4.1',
            isBillable: true,
            deviationLimitPct: 25,
            hasNorms: true,
            mappedActivities: ['act_001', 'act_002']
          },
          {
            id: 'item_004',
            versionId: 'boq_v3',
            parentId: 'item_002',
            level: 'item',
            itemNo: 'A.1.2',
            description: 'PCC M15 (1:2:4)',
            longDescription: 'Providing and laying PCC M15 (1:2:4) over foundation bed including curing',
            uomId: 'cum',
            uomName: 'Cum',
            quantity: 800,
            rate: 4500,
            amount: 3600000,
            itemType: 'scheduled',
            referenceCode: 'CPWD 4.2',
            isBillable: true,
            deviationLimitPct: 25,
            hasNorms: true,
            mappedActivities: ['act_003']
          },
          {
            id: 'item_005',
            versionId: 'boq_v3',
            parentId: 'item_002',
            level: 'item',
            itemNo: 'A.1.3',
            description: 'RCC M25 in foundation footing',
            longDescription: 'Providing and laying RCC M25 in foundation footing including formwork, reinforcement, and curing',
            uomId: 'cum',
            uomName: 'Cum',
            quantity: 1200,
            rate: 6500,
            amount: 7800000,
            itemType: 'scheduled',
            referenceCode: 'CPWD 4.3',
            isBillable: true,
            deviationLimitPct: 25,
            hasNorms: true,
            mappedActivities: ['act_004', 'act_005']
          }
        ]
      },
      {
        id: 'item_006',
        versionId: 'boq_v3',
        parentId: 'item_001',
        level: 'section',
        itemNo: 'A.2',
        description: 'Superstructure',
        uomId: 'ls',
        uomName: 'LS',
        quantity: 1,
        rate: 45000000,
        amount: 45000000,
        itemType: 'scheduled',
        isBillable: true,
        deviationLimitPct: 25,
        hasNorms: false,
        children: [
          {
            id: 'item_007',
            versionId: 'boq_v3',
            parentId: 'item_006',
            level: 'item',
            itemNo: 'A.2.1',
            description: 'RCC M30 in columns',
            longDescription: 'Providing and laying RCC M30 in columns including formwork, reinforcement, and curing',
            uomId: 'cum',
            uomName: 'Cum',
            quantity: 1800,
            rate: 7200,
            amount: 12960000,
            itemType: 'scheduled',
            referenceCode: 'CPWD 5.1',
            isBillable: true,
            deviationLimitPct: 25,
            hasNorms: true,
            mappedActivities: ['act_006']
          },
          {
            id: 'item_008',
            versionId: 'boq_v3',
            parentId: 'item_006',
            level: 'item',
            itemNo: 'A.2.2',
            description: 'Steel reinforcement TMT Fe500',
            longDescription: 'Supply and binding of TMT Fe500 steel reinforcement including cutting, bending, and tying',
            uomId: 'mt',
            uomName: 'MT',
            quantity: 450,
            rate: 65000,
            amount: 29250000,
            itemType: 'scheduled',
            referenceCode: 'CPWD 5.2',
            isBillable: true,
            deviationLimitPct: 25,
            hasNorms: true,
            mappedActivities: ['act_007', 'act_008']
          }
        ]
      }
    ]
  },
  {
    id: 'item_009',
    versionId: 'boq_v3',
    level: 'schedule',
    itemNo: 'B',
    description: 'MEP Works',
    uomId: 'ls',
    uomName: 'LS',
    quantity: 1,
    rate: 28000000,
    amount: 28000000,
    itemType: 'scheduled',
    isBillable: true,
    deviationLimitPct: 25,
    hasNorms: false,
    children: [
      {
        id: 'item_010',
        versionId: 'boq_v3',
        parentId: 'item_009',
        level: 'section',
        itemNo: 'B.1',
        description: 'Electrical Works',
        uomId: 'ls',
        uomName: 'LS',
        quantity: 1,
        rate: 15000000,
        amount: 15000000,
        itemType: 'scheduled',
        isBillable: true,
        deviationLimitPct: 25,
        hasNorms: false
      }
    ]
  }
];

// Sample WBS Nodes
export const wbsNodes: WBSNode[] = [
  {
    id: 'wbs_001',
    projectId: 'prj_001',
    code: '1.0',
    name: 'Riverside Tower - Phase II',
    level: 1,
    responsibleUserId: 'usr_pm_001',
    responsibleUserName: 'Rajesh Kumar',
    weightPct: 100,
    sortOrder: 1,
    children: [
      {
        id: 'wbs_002',
        projectId: 'prj_001',
        parentId: 'wbs_001',
        code: '1.1',
        name: 'Civil Works',
        level: 2,
        responsibleUserId: 'usr_sm_001',
        responsibleUserName: 'Rahul Mehta',
        weightPct: 68,
        sortOrder: 1,
        children: [
          {
            id: 'wbs_003',
            projectId: 'prj_001',
            parentId: 'wbs_002',
            code: '1.1.1',
            name: 'Foundation & Substructure',
            level: 3,
            responsibleUserId: 'usr_eng_001',
            responsibleUserName: 'Suresh Engineer',
            weightPct: 20,
            sortOrder: 1
          },
          {
            id: 'wbs_004',
            projectId: 'prj_001',
            parentId: 'wbs_002',
            code: '1.1.2',
            name: 'Superstructure',
            level: 3,
            responsibleUserId: 'usr_eng_001',
            responsibleUserName: 'Suresh Engineer',
            weightPct: 36,
            sortOrder: 2
          },
          {
            id: 'wbs_005',
            projectId: 'prj_001',
            parentId: 'wbs_002',
            code: '1.1.3',
            name: 'Finishing Works',
            level: 3,
            responsibleUserId: 'usr_eng_002',
            responsibleUserName: 'Amit Engineer',
            weightPct: 12,
            sortOrder: 3
          }
        ]
      },
      {
        id: 'wbs_006',
        projectId: 'prj_001',
        parentId: 'wbs_001',
        code: '1.2',
        name: 'MEP Works',
        level: 2,
        responsibleUserId: 'usr_mep_001',
        responsibleUserName: 'MEP Manager',
        weightPct: 22,
        sortOrder: 2
      },
      {
        id: 'wbs_007',
        projectId: 'prj_001',
        parentId: 'wbs_001',
        code: '1.3',
        name: 'External Development',
        level: 2,
        responsibleUserId: 'usr_sm_001',
        responsibleUserName: 'Rahul Mehta',
        weightPct: 10,
        sortOrder: 3
      }
    ]
  }
];

// Sample Work Packages
export const workPackages: WorkPackage[] = [
  {
    id: 'wp_001',
    wbsNodeId: 'wbs_003',
    wbsNodeCode: '1.1.1',
    code: 'WP-001',
    name: 'Foundation Construction',
    type: 'self',
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    activityCount: 5
  },
  {
    id: 'wp_002',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    code: 'WP-002',
    name: 'Column & Beam Construction',
    type: 'self',
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    activityCount: 8
  },
  {
    id: 'wp_003',
    wbsNodeId: 'wbs_004',
    wbsNodeCode: '1.1.2',
    code: 'WP-003',
    name: 'Slab Construction',
    type: 'subcontract',
    responsibleId: 'usr_eng_002',
    responsibleName: 'Amit Engineer',
    subcontractId: 'sub_001',
    subcontractName: 'ABC Constructions',
    activityCount: 6
  },
  {
    id: 'wp_004',
    wbsNodeId: 'wbs_006',
    wbsNodeCode: '1.2',
    code: 'WP-004',
    name: 'Electrical Installation',
    type: 'subcontract',
    responsibleId: 'usr_mep_001',
    responsibleName: 'MEP Manager',
    subcontractId: 'sub_002',
    subcontractName: 'Power Tech Solutions',
    activityCount: 12
  }
];

// Sample Activities
export const activities: Activity[] = [
  {
    id: 'act_001',
    workPackageId: 'wp_001',
    workPackageCode: 'WP-001',
    code: 'ACT-001',
    name: 'Site Clearance & Preparation',
    uomId: 'ls',
    uomName: 'LS',
    plannedQty: 1,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  },
  {
    id: 'act_002',
    workPackageId: 'wp_001',
    workPackageCode: 'WP-001',
    code: 'ACT-002',
    name: 'Excavation for Foundation',
    uomId: 'cum',
    uomName: 'Cum',
    plannedQty: 2500,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  },
  {
    id: 'act_003',
    workPackageId: 'wp_001',
    workPackageCode: 'WP-001',
    code: 'ACT-003',
    name: 'PCC M15 Laying',
    uomId: 'cum',
    uomName: 'Cum',
    plannedQty: 800,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  },
  {
    id: 'act_004',
    workPackageId: 'wp_001',
    workPackageCode: 'WP-001',
    code: 'ACT-004',
    name: 'Reinforcement for Footing',
    uomId: 'mt',
    uomName: 'MT',
    plannedQty: 45,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  },
  {
    id: 'act_005',
    workPackageId: 'wp_001',
    workPackageCode: 'WP-001',
    code: 'ACT-005',
    name: 'RCC M25 in Footing',
    uomId: 'cum',
    uomName: 'Cum',
    plannedQty: 1200,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  },
  {
    id: 'act_006',
    workPackageId: 'wp_002',
    workPackageCode: 'WP-002',
    code: 'ACT-006',
    name: 'RCC M30 in Columns',
    uomId: 'cum',
    uomName: 'Cum',
    plannedQty: 1800,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  },
  {
    id: 'act_007',
    workPackageId: 'wp_002',
    workPackageCode: 'WP-002',
    code: 'ACT-007',
    name: 'Steel Reinforcement Supply',
    uomId: 'mt',
    uomName: 'MT',
    plannedQty: 450,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  },
  {
    id: 'act_008',
    workPackageId: 'wp_002',
    workPackageCode: 'WP-002',
    code: 'ACT-008',
    name: 'Steel Reinforcement Binding',
    uomId: 'mt',
    uomName: 'MT',
    plannedQty: 450,
    responsibleId: 'usr_eng_001',
    responsibleName: 'Suresh Engineer',
    mappedBOQItems: 1
  }
];

// Sample BOQ-Activity Mappings
export const boqActivityMaps: BOQActivityMap[] = [
  {
    id: 'map_001',
    boqItemId: 'item_003',
    boqItemNo: 'A.1.1',
    boqItemDescription: 'Excavation for foundation',
    activityId: 'act_002',
    activityCode: 'ACT-002',
    activityName: 'Excavation for Foundation',
    qtySharePct: 100,
    quantity: 2500
  },
  {
    id: 'map_002',
    boqItemId: 'item_004',
    boqItemNo: 'A.1.2',
    boqItemDescription: 'PCC M15 (1:2:4)',
    activityId: 'act_003',
    activityCode: 'ACT-003',
    activityName: 'PCC M15 Laying',
    qtySharePct: 100,
    quantity: 800
  },
  {
    id: 'map_003',
    boqItemId: 'item_005',
    boqItemNo: 'A.1.3',
    boqItemDescription: 'RCC M25 in foundation footing',
    activityId: 'act_005',
    activityCode: 'ACT-005',
    activityName: 'RCC M25 in Footing',
    qtySharePct: 100,
    quantity: 1200
  },
  {
    id: 'map_004',
    boqItemId: 'item_007',
    boqItemNo: 'A.2.1',
    boqItemDescription: 'RCC M30 in columns',
    activityId: 'act_006',
    activityCode: 'ACT-006',
    activityName: 'RCC M30 in Columns',
    qtySharePct: 100,
    quantity: 1800
  },
  {
    id: 'map_005',
    boqItemId: 'item_008',
    boqItemNo: 'A.2.2',
    boqItemDescription: 'Steel reinforcement TMT Fe500',
    activityId: 'act_007',
    activityCode: 'ACT-007',
    activityName: 'Steel Reinforcement Supply',
    qtySharePct: 60,
    quantity: 270
  },
  {
    id: 'map_006',
    boqItemId: 'item_008',
    boqItemNo: 'A.2.2',
    boqItemDescription: 'Steel reinforcement TMT Fe500',
    activityId: 'act_008',
    activityCode: 'ACT-008',
    activityName: 'Steel Reinforcement Binding',
    qtySharePct: 40,
    quantity: 180
  }
];

// Sample Resource Norms
export const resourceNorms: ResourceNorm[] = [
  {
    id: 'norm_001',
    boqItemId: 'item_003',
    resourceName: 'Excavator (0.5 cum bucket)',
    resourceType: 'plant',
    resourceId: 'plant_001',
    qtyPerUnit: 0.005,
    wastagePct: 0,
    source: 'rate_analysis',
    unitCost: 1500,
    totalCost: 18750
  },
  {
    id: 'norm_002',
    boqItemId: 'item_003',
    resourceName: 'Labour (Mazdoor)',
    resourceType: 'labour',
    resourceId: 'lab_001',
    qtyPerUnit: 0.5,
    wastagePct: 5,
    source: 'rate_analysis',
    unitCost: 500,
    totalCost: 625000
  },
  {
    id: 'norm_003',
    boqItemId: 'item_004',
    resourceName: 'Cement OPC 53',
    resourceType: 'material',
    resourceId: 'mat_002',
    qtyPerUnit: 6.5,
    wastagePct: 3,
    source: 'rate_analysis',
    unitCost: 380,
    totalCost: 1550400
  },
  {
    id: 'norm_004',
    boqItemId: 'item_004',
    resourceName: 'Sand (River)',
    resourceType: 'material',
    resourceId: 'mat_003',
    qtyPerUnit: 0.45,
    wastagePct: 5,
    source: 'rate_analysis',
    unitCost: 1800,
    totalCost: 720000
  },
  {
    id: 'norm_005',
    boqItemId: 'item_004',
    resourceName: 'Aggregate 20mm',
    resourceType: 'material',
    resourceId: 'mat_004',
    qtyPerUnit: 0.85,
    wastagePct: 5,
    source: 'rate_analysis',
    unitCost: 1200,
    totalCost: 1020000
  },
  {
    id: 'norm_006',
    boqItemId: 'item_005',
    resourceName: 'Steel TMT Fe500 16mm',
    resourceType: 'material',
    resourceId: 'mat_001',
    qtyPerUnit: 0.12,
    wastagePct: 2.5,
    source: 'rate_analysis',
    unitCost: 55000,
    totalCost: 7920000
  },
  {
    id: 'norm_007',
    boqItemId: 'item_008',
    resourceName: 'Steel TMT Fe500 (All sizes)',
    resourceType: 'material',
    resourceId: 'mat_001',
    qtyPerUnit: 1.025,
    wastagePct: 2.5,
    source: 'rate_analysis',
    unitCost: 55000,
    totalCost: 25368750
  }
];

// Sample Import Results
export const importResults: ImportResult[] = [
  {
    id: 'imp_001',
    versionId: 'boq_v4',
    fileName: 'BOQ_Revised_Jan2026.xlsx',
    totalRows: 280,
    validRows: 275,
    invalidRows: 5,
    status: 'completed',
    errors: [
      { row: 45, column: 'Rate', message: 'Rate is negative', severity: 'error' },
      { row: 89, column: 'Quantity', message: 'Quantity is zero', severity: 'warning' },
      { row: 123, column: 'UOM', message: 'Invalid UOM code', severity: 'error' },
      { row: 156, column: 'Amount', message: 'Amount mismatch (qty × rate ≠ amount)', severity: 'error' },
      { row: 201, column: 'Item No', message: 'Duplicate item number', severity: 'error' }
    ],
    createdAt: '2026-01-10T14:30:00Z'
  }
];

// Sample Version Comparison
export const versionComparison: VersionComparison = {
  versionA: 'boq_v2',
  versionB: 'boq_v3',
  differences: [
    {
      itemNo: 'A.1.1',
      description: 'Excavation for foundation',
      field: 'quantity',
      valueA: 2400,
      valueB: 2500,
      change: 100,
      changePct: 4.17
    },
    {
      itemNo: 'A.1.3',
      description: 'RCC M25 in foundation footing',
      field: 'rate',
      valueA: 6200,
      valueB: 6500,
      change: 300,
      changePct: 4.84
    },
    {
      itemNo: 'A.2.2',
      description: 'Steel reinforcement TMT Fe500',
      field: 'quantity',
      valueA: 420,
      valueB: 450,
      change: 30,
      changePct: 7.14
    }
  ],
  summary: {
    totalItemsChanged: 15,
    totalAmountChange: 3500000,
    totalAmountChangePct: 2.8
  }
};

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-BOQ-01',
    stage: 'PLAN',
    control: 'Every billable BOQ item mapped to activity and resource norms before budget approval',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-BOQ-02',
    stage: 'APPROVE',
    control: 'Contract BOQ frozen after approval; changes only via variation',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-BOQ-03',
    stage: 'VERIFY',
    control: 'Norm changes (qty per unit, wastage) maker-checker; they drive WA and wastage limits',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const boqStats = {
  totalVersions: boqVersions.length,
  frozenVersions: boqVersions.filter(v => v.status === 'frozen').length,
  draftVersions: boqVersions.filter(v => v.status === 'draft').length,
  totalBOQItems: 280,
  mappedItems: 245,
  unmappedItems: 35,
  totalWBSNodes: 15,
  totalWorkPackages: workPackages.length,
  totalActivities: activities.length,
  totalResourceNorms: resourceNorms.length,
  contractValue: 125000000,
  revisedValue: 128500000,
  workingValue: 129200000
};
