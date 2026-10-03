// Part 4 — Organization, Company, Project & Site Master Data

export interface Company {
  id: string;
  code: string;
  name: string;
  gstin: string;
  address: string;
  baseCurrency: string;
  isActive: boolean;
}

export interface Group {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface LegalEntity {
  id: string;
  groupId: string;
  code: string;
  legalName: string;
  pan: string;
  cin: string;
  registeredAddress: string;
  baseCurrency: string;
  gstins: { stateCode: string; gstin: string }[];
  isActive: boolean;
}

export interface Branch {
  id: string;
  companyId: string;
  legalEntityId: string;
  type: 'branch' | 'regional_office' | 'site_office' | 'yard' | 'plant_depot';
  code: string;
  name: string;
  address: string;
  stateCode: string;
  gstin: string;
  lat: number;
  lng: number;
  isActive: boolean;
}

export interface BusinessUnit {
  id: string;
  companyId: string;
  code: string;
  name: string;
  headUserId: string;
  isActive: boolean;
}

export interface Division {
  id: string;
  businessUnitId: string;
  code: string;
  name: string;
  headUserId: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  divisionId: string;
  costCentreId: string;
  code: string;
  name: string;
  headUserId: string;
  isActive: boolean;
}

export interface CostCentre {
  id: string;
  companyId: string;
  code: string;
  name: string;
  parentId: string | null;
  type: 'project' | 'overhead' | 'plant' | 'department';
  validFrom: string;
  validTo: string | null;
  isActive: boolean;
}

export interface ProfitCentre {
  id: string;
  companyId: string;
  code: string;
  name: string;
  parentId: string | null;
  isActive: boolean;
}

export type ProjectLifecycleStatus = 
  | 'proposed' | 'tendering' | 'awarded' | 'mobilisation' 
  | 'active' | 'on_hold' | 'substantially_complete' | 'dlp' | 'closed' | 'archived';

export interface Project {
  id: string;
  projectCode: string;
  companyId: string;
  businessUnitId: string;
  divisionId: string;
  name: string;
  clientId: string;
  clientName: string;
  projectType: 'building' | 'road' | 'bridge' | 'irrigation' | 'railway' | 'industrial' | 'infra' | 'other';
  contractMode: 'item_rate' | 'ls' | 'epc' | 'ham' | 'other';
  stateCode: string;
  district: string;
  startDate: string;
  plannedFinish: string;
  revisedFinish: string | null;
  lifecycleStatus: ProjectLifecycleStatus;
  legacyStatus: string;
  projectManagerId: string;
  projectManagerName: string;
  planningManagerId: string;
  commercialManagerId: string;
  costCentreId: string;
  profitCentreId: string;
  contractValue: number;
  isActive: boolean;
}

export interface Site {
  id: string;
  siteCode: string;
  projectId: string;
  name: string;
  siteManagerId: string;
  siteManagerName: string;
  address: string;
  stateCode: string;
  lat: number;
  lng: number;
  status: 'planned' | 'mobilising' | 'active' | 'suspended' | 'demobilising' | 'closed';
  timezone: string;
  isActive: boolean;
}

export interface Geofence {
  id: string;
  siteId: string;
  type: 'circle' | 'polygon';
  centerLat: number;
  centerLng: number;
  radiusM: number | null;
  polygonGeoJson: any | null;
  accuracyToleranceM: number;
  validFrom: string;
  validTo: string | null;
  version: number;
  approvedBy: string;
  createdAt: string;
}

export interface Allocation {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  projectName: string;
  siteId: string | null;
  siteName: string | null;
  roleOnProject: string;
  fromDate: string;
  toDate: string | null;
  allocationPercent: number;
  isActive: boolean;
}

export const companies: Company[] = [
  {
    id: 'comp_001',
    code: 'ACME',
    name: 'Acme Construction Ltd.',
    gstin: '27AABCA1234A1Z5',
    address: 'Mumbai, Maharashtra',
    baseCurrency: 'INR',
    isActive: true
  }
];

export const groups: Group[] = [
  { id: 'grp_001', companyId: 'comp_001', code: 'GRP01', name: 'Infrastructure Group', isActive: true },
  { id: 'grp_002', companyId: 'comp_001', code: 'GRP02', name: 'Building Group', isActive: true }
];

export const legalEntities: LegalEntity[] = [
  {
    id: 'le_001',
    groupId: 'grp_001',
    code: 'LE001',
    legalName: 'Acme Infrastructure Pvt. Ltd.',
    pan: 'AABCA1234A',
    cin: 'U45200MH2010PTC123456',
    registeredAddress: 'Mumbai, Maharashtra',
    baseCurrency: 'INR',
    gstins: [
      { stateCode: '27', gstin: '27AABCA1234A1Z5' },
      { stateCode: '29', gstin: '29AABCA1234A1Z3' }
    ],
    isActive: true
  }
];

export const branches: Branch[] = [
  {
    id: 'br_001',
    companyId: 'comp_001',
    legalEntityId: 'le_001',
    type: 'branch',
    code: 'HO-MUM',
    name: 'Head Office Mumbai',
    address: 'Andheri East, Mumbai - 400069',
    stateCode: '27',
    gstin: '27AABCA1234A1Z5',
    lat: 19.1136,
    lng: 72.8697,
    isActive: true
  },
  {
    id: 'br_002',
    companyId: 'comp_001',
    legalEntityId: 'le_001',
    type: 'regional_office',
    code: 'RO-BLR',
    name: 'Regional Office Bangalore',
    address: 'Whitefield, Bangalore - 560066',
    stateCode: '29',
    gstin: '29AABCA1234A1Z3',
    lat: 12.9698,
    lng: 77.7500,
    isActive: true
  }
];

export const businessUnits: BusinessUnit[] = [
  { id: 'bu_001', companyId: 'comp_001', code: 'BU-INFRA', name: 'Infrastructure', headUserId: 'usr_dir_001', isActive: true },
  { id: 'bu_002', companyId: 'comp_001', code: 'BU-BLDG', name: 'Buildings', headUserId: 'usr_dir_002', isActive: true }
];

export const divisions: Division[] = [
  { id: 'div_001', businessUnitId: 'bu_001', code: 'DIV-ROAD', name: 'Roads & Highways', headUserId: 'usr_gm_001', isActive: true },
  { id: 'div_002', businessUnitId: 'bu_001', code: 'DIV-BRDG', name: 'Bridges & Structures', headUserId: 'usr_gm_002', isActive: true },
  { id: 'div_003', businessUnitId: 'bu_002', code: 'DIV-COMM', name: 'Commercial Buildings', headUserId: 'usr_gm_003', isActive: true }
];

export const departments: Department[] = [
  { id: 'dept_001', divisionId: 'div_001', costCentreId: 'cc_001', code: 'DEPT-ENG', name: 'Engineering', headUserId: 'usr_hod_001', isActive: true },
  { id: 'dept_002', divisionId: 'div_001', costCentreId: 'cc_002', code: 'DEPT-PROJ', name: 'Project Management', headUserId: 'usr_hod_002', isActive: true },
  { id: 'dept_003', divisionId: 'div_003', costCentreId: 'cc_003', code: 'DEPT-SITE', name: 'Site Operations', headUserId: 'usr_hod_003', isActive: true }
];

export const costCentres: CostCentre[] = [
  { id: 'cc_001', companyId: 'comp_001', code: 'CC-OVH-001', name: 'Corporate Overhead', parentId: null, type: 'overhead', validFrom: '2025-04-01', validTo: null, isActive: true },
  { id: 'cc_002', companyId: 'comp_001', code: 'CC-PLT-001', name: 'Plant & Machinery', parentId: null, type: 'plant', validFrom: '2025-04-01', validTo: null, isActive: true },
  { id: 'cc_003', companyId: 'comp_001', code: 'CC-PRJ-001', name: 'Riverside Tower Project', parentId: null, type: 'project', validFrom: '2025-04-01', validTo: null, isActive: true },
  { id: 'cc_004', companyId: 'comp_001', code: 'CC-PRJ-002', name: 'Highway Bridge Phase 2', parentId: null, type: 'project', validFrom: '2025-04-01', validTo: null, isActive: true }
];

export const profitCentres: ProfitCentre[] = [
  { id: 'pc_001', companyId: 'comp_001', code: 'PC-INFRA', name: 'Infrastructure Division', parentId: null, isActive: true },
  { id: 'pc_002', companyId: 'comp_001', code: 'PC-BLDG', name: 'Buildings Division', parentId: null, isActive: true }
];

export const projects: Project[] = [
  {
    id: 'prj_001',
    projectCode: 'PRJ-2025-001',
    companyId: 'comp_001',
    businessUnitId: 'bu_002',
    divisionId: 'div_003',
    name: 'Riverside Tower — Phase II',
    clientId: 'cl_001',
    clientName: 'Metro Developers Pvt. Ltd.',
    projectType: 'building',
    contractMode: 'item_rate',
    stateCode: '27',
    district: 'Mumbai',
    startDate: '2025-06-01',
    plannedFinish: '2026-12-30',
    revisedFinish: null,
    lifecycleStatus: 'active',
    legacyStatus: 'In Progress',
    projectManagerId: 'usr_pm_001',
    projectManagerName: 'Rajesh Kumar',
    planningManagerId: 'usr_pl_001',
    commercialManagerId: 'usr_cm_001',
    costCentreId: 'cc_003',
    profitCentreId: 'pc_002',
    contractValue: 125000000,
    isActive: true
  },
  {
    id: 'prj_002',
    projectCode: 'PRJ-2025-002',
    companyId: 'comp_001',
    businessUnitId: 'bu_001',
    divisionId: 'div_002',
    name: 'Highway Bridge Phase 2',
    clientId: 'cl_002',
    clientName: 'National Highways Authority',
    projectType: 'bridge',
    contractMode: 'epc',
    stateCode: '27',
    district: 'Pune',
    startDate: '2025-04-15',
    plannedFinish: '2027-03-31',
    revisedFinish: '2027-06-30',
    lifecycleStatus: 'active',
    legacyStatus: 'In Progress',
    projectManagerId: 'usr_pm_002',
    projectManagerName: 'Amit Patel',
    planningManagerId: 'usr_pl_002',
    commercialManagerId: 'usr_cm_002',
    costCentreId: 'cc_004',
    profitCentreId: 'pc_001',
    contractValue: 280000000,
    isActive: true
  },
  {
    id: 'prj_003',
    projectCode: 'PRJ-2025-003',
    companyId: 'comp_001',
    businessUnitId: 'bu_002',
    divisionId: 'div_003',
    name: 'Metro Station Fit-out',
    clientId: 'cl_003',
    clientName: 'Metro Rail Corporation',
    projectType: 'infra',
    contractMode: 'ls',
    stateCode: '29',
    district: 'Bangalore',
    startDate: '2025-08-01',
    plannedFinish: '2026-06-30',
    revisedFinish: null,
    lifecycleStatus: 'mobilisation',
    legacyStatus: 'Mobilisation',
    projectManagerId: 'usr_pm_003',
    projectManagerName: 'Priya Sharma',
    planningManagerId: 'usr_pl_003',
    commercialManagerId: 'usr_cm_003',
    costCentreId: 'cc_003',
    profitCentreId: 'pc_002',
    contractValue: 45000000,
    isActive: true
  },
  {
    id: 'prj_004',
    projectCode: 'PRJ-2024-012',
    companyId: 'comp_001',
    businessUnitId: 'bu_001',
    divisionId: 'div_001',
    name: 'State Highway Rehabilitation',
    clientId: 'cl_004',
    clientName: 'State PWD',
    projectType: 'road',
    contractMode: 'item_rate',
    stateCode: '27',
    district: 'Nashik',
    startDate: '2024-03-01',
    plannedFinish: '2025-09-30',
    revisedFinish: '2025-11-30',
    lifecycleStatus: 'substantially_complete',
    legacyStatus: 'SC Complete',
    projectManagerId: 'usr_pm_004',
    projectManagerName: 'Sunil Verma',
    planningManagerId: 'usr_pl_004',
    commercialManagerId: 'usr_cm_004',
    costCentreId: 'cc_004',
    profitCentreId: 'pc_001',
    contractValue: 95000000,
    isActive: true
  }
];

export const sites: Site[] = [
  {
    id: 'site_001',
    siteCode: 'SITE-RT-001',
    projectId: 'prj_001',
    name: 'Riverside Tower — Block A',
    siteManagerId: 'usr_sm_001',
    siteManagerName: 'Rahul Mehta',
    address: 'Plot 12, Riverside Area, Mumbai',
    stateCode: '27',
    lat: 19.0760,
    lng: 72.8777,
    status: 'active',
    timezone: 'Asia/Kolkata',
    isActive: true
  },
  {
    id: 'site_002',
    siteCode: 'SITE-RT-002',
    projectId: 'prj_001',
    name: 'Riverside Tower — Block B',
    siteManagerId: 'usr_sm_002',
    siteManagerName: 'Meena Iyer',
    address: 'Plot 13, Riverside Area, Mumbai',
    stateCode: '27',
    lat: 19.0765,
    lng: 72.8782,
    status: 'active',
    timezone: 'Asia/Kolkata',
    isActive: true
  },
  {
    id: 'site_003',
    siteCode: 'SITE-HB-001',
    projectId: 'prj_002',
    name: 'Highway Bridge — Main Site',
    siteManagerId: 'usr_sm_003',
    siteManagerName: 'Vikram Singh',
    address: 'KM 45, Mumbai-Pune Expressway',
    stateCode: '27',
    lat: 18.7500,
    lng: 73.4500,
    status: 'active',
    timezone: 'Asia/Kolkata',
    isActive: true
  },
  {
    id: 'site_004',
    siteCode: 'SITE-MS-001',
    projectId: 'prj_003',
    name: 'Metro Station — Site Office',
    siteManagerId: 'usr_sm_004',
    siteManagerName: 'Anita Desai',
    address: 'Whitefield Metro Station, Bangalore',
    stateCode: '29',
    lat: 12.9698,
    lng: 77.7500,
    status: 'mobilising',
    timezone: 'Asia/Kolkata',
    isActive: true
  }
];

export const geofences: Geofence[] = [
  {
    id: 'gf_001',
    siteId: 'site_001',
    type: 'circle',
    centerLat: 19.0760,
    centerLng: 72.8777,
    radiusM: 150,
    polygonGeoJson: null,
    accuracyToleranceM: 20,
    validFrom: '2025-06-01T00:00:00Z',
    validTo: null,
    version: 1,
    approvedBy: 'usr_admin_001',
    createdAt: '2025-05-28T10:00:00Z'
  },
  {
    id: 'gf_002',
    siteId: 'site_002',
    type: 'polygon',
    centerLat: 19.0765,
    centerLng: 72.8782,
    radiusM: null,
    polygonGeoJson: {
      type: 'Polygon',
      coordinates: [[
        [72.8775, 19.0760],
        [72.8790, 19.0760],
        [72.8790, 19.0770],
        [72.8775, 19.0770],
        [72.8775, 19.0760]
      ]]
    },
    accuracyToleranceM: 15,
    validFrom: '2025-06-01T00:00:00Z',
    validTo: null,
    version: 1,
    approvedBy: 'usr_admin_001',
    createdAt: '2025-05-28T10:30:00Z'
  },
  {
    id: 'gf_003',
    siteId: 'site_003',
    type: 'circle',
    centerLat: 18.7500,
    centerLng: 73.4500,
    radiusM: 500,
    polygonGeoJson: null,
    accuracyToleranceM: 30,
    validFrom: '2025-04-15T00:00:00Z',
    validTo: null,
    version: 2,
    approvedBy: 'usr_admin_001',
    createdAt: '2025-07-10T14:00:00Z'
  }
];

export const allocations: Allocation[] = [
  {
    id: 'alloc_001',
    userId: 'usr_pm_001',
    userName: 'Rajesh Kumar',
    projectId: 'prj_001',
    projectName: 'Riverside Tower — Phase II',
    siteId: null,
    siteName: null,
    roleOnProject: 'Project Manager',
    fromDate: '2025-06-01',
    toDate: null,
    allocationPercent: 100,
    isActive: true
  },
  {
    id: 'alloc_002',
    userId: 'usr_sm_001',
    userName: 'Rahul Mehta',
    projectId: 'prj_001',
    projectName: 'Riverside Tower — Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower — Block A',
    roleOnProject: 'Site Manager',
    fromDate: '2025-06-01',
    toDate: null,
    allocationPercent: 100,
    isActive: true
  },
  {
    id: 'alloc_003',
    userId: 'usr_eng_001',
    userName: 'Suresh Nair',
    projectId: 'prj_001',
    projectName: 'Riverside Tower — Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower — Block A',
    roleOnProject: 'Site Engineer',
    fromDate: '2025-06-15',
    toDate: null,
    allocationPercent: 100,
    isActive: true
  },
  {
    id: 'alloc_004',
    userId: 'usr_eng_001',
    userName: 'Suresh Nair',
    projectId: 'prj_002',
    projectName: 'Highway Bridge Phase 2',
    siteId: 'site_003',
    siteName: 'Highway Bridge — Main Site',
    roleOnProject: 'Site Engineer',
    fromDate: '2025-09-01',
    toDate: '2025-12-31',
    allocationPercent: 50,
    isActive: true
  },
  {
    id: 'alloc_005',
    userId: 'usr_pm_002',
    userName: 'Amit Patel',
    projectId: 'prj_002',
    projectName: 'Highway Bridge Phase 2',
    siteId: null,
    siteName: null,
    roleOnProject: 'Project Manager',
    fromDate: '2025-04-15',
    toDate: null,
    allocationPercent: 100,
    isActive: true
  }
];

export const projectLifecycleStatuses = [
  { value: 'proposed', label: 'Proposed', color: 'slate' },
  { value: 'tendering', label: 'Tendering', color: 'blue' },
  { value: 'awarded', label: 'Awarded', color: 'indigo' },
  { value: 'mobilisation', label: 'Mobilisation', color: 'violet' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'on_hold', label: 'On Hold', color: 'amber' },
  { value: 'substantially_complete', label: 'Substantially Complete', color: 'cyan' },
  { value: 'dlp', label: 'DLP', color: 'teal' },
  { value: 'closed', label: 'Closed', color: 'gray' },
  { value: 'archived', label: 'Archived', color: 'slate' }
];

export const siteStatuses = [
  { value: 'planned', label: 'Planned', color: 'slate' },
  { value: 'mobilising', label: 'Mobilising', color: 'violet' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'suspended', label: 'Suspended', color: 'amber' },
  { value: 'demobilising', label: 'Demobilising', color: 'orange' },
  { value: 'closed', label: 'Closed', color: 'gray' }
];

export const projectTypes = [
  { value: 'building', label: 'Building' },
  { value: 'road', label: 'Road' },
  { value: 'bridge', label: 'Bridge' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'railway', label: 'Railway' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'infra', label: 'Infrastructure' },
  { value: 'other', label: 'Other' }
];

export const contractModes = [
  { value: 'item_rate', label: 'Item Rate' },
  { value: 'ls', label: 'Lump Sum' },
  { value: 'epc', label: 'EPC' },
  { value: 'ham', label: 'HAM' },
  { value: 'other', label: 'Other' }
];
