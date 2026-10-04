// Part 30 — DPR / Field Execution Data

export interface DPRReport {
  id: string;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  dprNo: string;
  preparedBy: string;
  preparedByName: string;
  weatherMorning: string;
  weatherAfternoon: string;
  rainfallMm: number;
  temperature: number;
  siteCondition: string;
  workingHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'returned';
  submittedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  locked: boolean;
  returnReason?: string;
  createdAt: string;
  updatedAt: string;
  activityLines: DPRActivityLine[];
  labourLines: DPRLabourLine[];
  materialLines: DPRMaterialLine[];
  equipmentLines: DPREquipmentLine[];
  events: DPREvent[];
  photos: DPRPhoto[];
  remarks: string;
  gpsLocation?: { lat: number; lng: number };
  voiceNotes?: string;
}

export interface DPRActivityLine {
  id: string;
  dprId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  boqItemId?: string;
  workFrontId: string;
  workFrontName: string;
  location: string;
  chainage?: string;
  plannedQty: number;
  actualQty: number;
  uomId: string;
  uomName: string;
  cumulativeQty: number;
  waId?: string;
  waNo?: string;
  remarks?: string;
  photoIds: string[];
}

export interface DPRLabourLine {
  id: string;
  dprId: string;
  trade: string;
  skill: 'skilled' | 'semi_skilled' | 'unskilled';
  source: 'own' | 'subcontractor';
  subcontractorId?: string;
  subcontractorName?: string;
  plannedCount: number;
  actualCount: number;
  hours: number;
  otHours: number;
  attendanceRef?: string;
}

export interface DPRMaterialLine {
  id: string;
  dprId: string;
  materialId: string;
  materialName: string;
  qtyConsumed: number;
  uomId: string;
  uomName: string;
  activityId?: string;
  activityCode?: string;
  issueRef?: string;
  issueQty?: number;
  balanceQty?: number;
}

export interface DPREquipmentLine {
  id: string;
  dprId: string;
  plantId?: string;
  plantType: string;
  plantName: string;
  workingHours: number;
  idleHours: number;
  breakdownHours: number;
  operator: string;
  logRef?: string;
}

export interface DPREvent {
  id: string;
  dprId: string;
  type: 'visitor' | 'instruction' | 'quality' | 'hse' | 'delay' | 'constraint' | 'incident' | 'other';
  description: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
  time: string;
  reportedBy: string;
  reportedByName: string;
}

export interface DPRPhoto {
  id: string;
  dprId: string;
  activityId?: string;
  activityCode?: string;
  photoUrl: string;
  thumbnailUrl: string;
  caption: string;
  geoLocation: { lat: number; lng: number };
  capturedAt: string;
  capturedBy: string;
  capturedByName: string;
}

export interface MissingDPR {
  id: string;
  siteId: string;
  siteName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  daysOverdue: number;
  assignedTo: string;
  assignedToName: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample DPR Reports
export const dprReports: DPRReport[] = [
  {
    id: 'dpr_001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-15',
    shift: 'morning',
    dprNo: 'DPR-2026-0225',
    preparedBy: 'usr_eng_001',
    preparedByName: 'Suresh Engineer',
    weatherMorning: 'Clear, Sunny',
    weatherAfternoon: 'Partly Cloudy',
    rainfallMm: 0,
    temperature: 28,
    siteCondition: 'Good working conditions',
    workingHours: 8,
    status: 'approved',
    submittedAt: '2026-01-15T18:00:00Z',
    approvedBy: 'usr_sm_001',
    approvedByName: 'Rahul Mehta',
    approvedAt: '2026-01-15T19:30:00Z',
    locked: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T19:30:00Z',
    activityLines: [
      {
        id: 'dal_001',
        dprId: 'dpr_001',
        activityId: 'act_006',
        activityCode: 'A2010',
        activityName: 'RCC M30 in Columns (G+F)',
        workFrontId: 'wf_003',
        workFrontName: 'Column C1-C5 (Ground Floor)',
        location: 'Block A - Ground Floor',
        plannedQty: 40,
        actualQty: 40,
        uomId: 'uom_cum',
        uomName: 'Cum',
        cumulativeQty: 1240,
        waId: 'wa_001',
        waNo: 'WA-2026-0142',
        remarks: 'Completed as per plan',
        photoIds: ['photo_001', 'photo_002']
      },
      {
        id: 'dal_002',
        dprId: 'dpr_001',
        activityId: 'act_007',
        activityCode: 'A2020',
        activityName: 'RCC M30 in Beams (G+F)',
        workFrontId: 'wf_003',
        workFrontName: 'Column C1-C5 (Ground Floor)',
        location: 'Block A - Ground Floor',
        plannedQty: 30,
        actualQty: 25,
        uomId: 'uom_cum',
        uomName: 'Cum',
        cumulativeQty: 1225,
        waId: 'wa_001',
        waNo: 'WA-2026-0142',
        remarks: '5 Cum pending due to formwork delay',
        photoIds: ['photo_003']
      }
    ],
    labourLines: [
      {
        id: 'dll_001',
        dprId: 'dpr_001',
        trade: 'Mason',
        skill: 'skilled',
        source: 'own',
        plannedCount: 8,
        actualCount: 8,
        hours: 8,
        otHours: 0,
        attendanceRef: 'att_2026_0115'
      },
      {
        id: 'dll_002',
        dprId: 'dpr_001',
        trade: 'Helper',
        skill: 'unskilled',
        source: 'own',
        plannedCount: 12,
        actualCount: 12,
        hours: 8,
        otHours: 0,
        attendanceRef: 'att_2026_0115'
      },
      {
        id: 'dll_003',
        dprId: 'dpr_001',
        trade: 'Steel Fixer',
        skill: 'skilled',
        source: 'subcontractor',
        subcontractorId: 'sub_001',
        subcontractorName: 'ABC Constructions',
        plannedCount: 6,
        actualCount: 6,
        hours: 8,
        otHours: 1
      }
    ],
    materialLines: [
      {
        id: 'dml_001',
        dprId: 'dpr_001',
        materialId: 'mat_005',
        materialName: 'RCC M30',
        qtyConsumed: 65,
        uomId: 'uom_cum',
        uomName: 'Cum',
        activityId: 'act_006',
        activityCode: 'A2010',
        issueRef: 'issue_001',
        issueQty: 70,
        balanceQty: 5
      },
      {
        id: 'dml_002',
        dprId: 'dpr_001',
        materialId: 'mat_001',
        materialName: 'Steel TMT 16mm',
        qtyConsumed: 2.5,
        uomId: 'uom_mt',
        uomName: 'MT',
        activityId: 'act_007',
        activityCode: 'A2020',
        issueRef: 'issue_002',
        issueQty: 3,
        balanceQty: 0.5
      }
    ],
    equipmentLines: [
      {
        id: 'del_001',
        dprId: 'dpr_001',
        plantId: 'plt_003',
        plantType: 'Crane',
        plantName: 'Tower Crane TC-01',
        workingHours: 6,
        idleHours: 2,
        breakdownHours: 0,
        operator: 'Ramesh Operator',
        logRef: 'log_001'
      },
      {
        id: 'del_002',
        dprId: 'dpr_001',
        plantType: 'Concrete Pump',
        plantName: 'Concrete Pump CP-01',
        workingHours: 4,
        idleHours: 0,
        breakdownHours: 0,
        operator: 'Suresh Operator'
      }
    ],
    events: [
      {
        id: 'dev_001',
        dprId: 'dpr_001',
        type: 'visitor',
        description: 'Client representative visited site for progress review',
        time: '10:30',
        reportedBy: 'usr_eng_001',
        reportedByName: 'Suresh Engineer'
      },
      {
        id: 'dev_002',
        dprId: 'dpr_001',
        type: 'instruction',
        description: 'Consultant instructed to increase column reinforcement as per SI-2026-001',
        linkedEntityType: 'site_instruction',
        linkedEntityId: 'si_001',
        time: '11:00',
        reportedBy: 'usr_eng_001',
        reportedByName: 'Suresh Engineer'
      },
      {
        id: 'dev_003',
        dprId: 'dpr_001',
        type: 'quality',
        description: 'Cube test conducted for column concrete - 3 cubes taken for 7-day and 28-day testing',
        time: '14:00',
        reportedBy: 'usr_qa_001',
        reportedByName: 'Priya QA'
      }
    ],
    photos: [
      {
        id: 'photo_001',
        dprId: 'dpr_001',
        activityId: 'act_006',
        activityCode: 'A2010',
        photoUrl: '/photos/column_reinforcement_001.jpg',
        thumbnailUrl: '/photos/thumb/column_reinforcement_001.jpg',
        caption: 'Column reinforcement inspection before concreting',
        geoLocation: { lat: 19.0760, lng: 72.8777 },
        capturedAt: '2026-01-15T10:30:00Z',
        capturedBy: 'usr_eng_001',
        capturedByName: 'Suresh Engineer'
      },
      {
        id: 'photo_002',
        dprId: 'dpr_001',
        activityId: 'act_006',
        activityCode: 'A2010',
        photoUrl: '/photos/column_concreting_001.jpg',
        thumbnailUrl: '/photos/thumb/column_concreting_001.jpg',
        caption: 'Column concreting in progress',
        geoLocation: { lat: 19.0760, lng: 72.8777 },
        capturedAt: '2026-01-15T14:00:00Z',
        capturedBy: 'usr_eng_001',
        capturedByName: 'Suresh Engineer'
      },
      {
        id: 'photo_003',
        dprId: 'dpr_001',
        activityId: 'act_007',
        activityCode: 'A2020',
        photoUrl: '/photos/beam_formwork_001.jpg',
        thumbnailUrl: '/photos/thumb/beam_formwork_001.jpg',
        caption: 'Beam formwork preparation',
        geoLocation: { lat: 19.0760, lng: 72.8777 },
        capturedAt: '2026-01-15T15:00:00Z',
        capturedBy: 'usr_eng_001',
        capturedByName: 'Suresh Engineer'
      }
    ],
    remarks: 'Good progress on column work. Beam formwork delayed by 1 day due to material shortage. Client visit successful - no major concerns raised.',
    gpsLocation: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 'dpr_002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-16',
    shift: 'morning',
    dprNo: 'DPR-2026-0226',
    preparedBy: 'usr_eng_001',
    preparedByName: 'Suresh Engineer',
    weatherMorning: 'Clear',
    weatherAfternoon: 'Clear',
    rainfallMm: 0,
    temperature: 29,
    siteCondition: 'Normal working conditions',
    workingHours: 8,
    status: 'submitted',
    submittedAt: '2026-01-16T18:30:00Z',
    locked: false,
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T18:30:00Z',
    activityLines: [
      {
        id: 'dal_005',
        dprId: 'dpr_002',
        activityId: 'act_006',
        activityCode: 'A2010',
        activityName: 'RCC M30 in Columns (G+F)',
        workFrontId: 'wf_003',
        workFrontName: 'Column C6-C10 (Ground Floor)',
        location: 'Block A - Ground Floor',
        plannedQty: 45,
        actualQty: 45,
        uomId: 'uom_cum',
        uomName: 'Cum',
        cumulativeQty: 1285,
        waId: 'wa_002',
        waNo: 'WA-2026-0143',
        remarks: 'Completed as per plan',
        photoIds: []
      }
    ],
    labourLines: [
      {
        id: 'dll_004',
        dprId: 'dpr_002',
        trade: 'Mason',
        skill: 'skilled',
        source: 'own',
        plannedCount: 10,
        actualCount: 10,
        hours: 8,
        otHours: 0
      }
    ],
    materialLines: [
      {
        id: 'dml_003',
        dprId: 'dpr_002',
        materialId: 'mat_005',
        materialName: 'RCC M30',
        qtyConsumed: 45,
        uomId: 'uom_cum',
        uomName: 'Cum',
        activityId: 'act_006',
        activityCode: 'A2010'
      }
    ],
    equipmentLines: [],
    events: [],
    photos: [],
    remarks: 'Normal day work. All activities completed as planned.'
  },
  {
    id: 'dpr_003',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-14',
    shift: 'morning',
    dprNo: 'DPR-2026-0224',
    preparedBy: 'usr_eng_001',
    preparedByName: 'Suresh Engineer',
    weatherMorning: 'Cloudy',
    weatherAfternoon: 'Light Rain',
    rainfallMm: 5,
    temperature: 26,
    siteCondition: 'Work affected by rain in afternoon',
    workingHours: 6,
    status: 'returned',
    submittedAt: '2026-01-14T18:00:00Z',
    locked: false,
    returnReason: 'Photos missing for column activity. Please attach photos and resubmit.',
    createdAt: '2026-01-14T08:00:00Z',
    updatedAt: '2026-01-14T19:00:00Z',
    activityLines: [
      {
        id: 'dal_004',
        dprId: 'dpr_003',
        activityId: 'act_006',
        activityCode: 'A2010',
        activityName: 'RCC M30 in Columns (G+F)',
        workFrontId: 'wf_003',
        workFrontName: 'Column C1-C5 (Ground Floor)',
        location: 'Block A - Ground Floor',
        plannedQty: 40,
        actualQty: 35,
        uomId: 'uom_cum',
        uomName: 'Cum',
        cumulativeQty: 1200,
        waId: 'wa_001',
        waNo: 'WA-2026-0142',
        remarks: 'Work stopped at 3 PM due to rain',
        photoIds: []
      }
    ],
    labourLines: [],
    materialLines: [],
    equipmentLines: [],
    events: [
      {
        id: 'dev_004',
        dprId: 'dpr_003',
        type: 'delay',
        description: 'Work delayed due to rain from 3 PM onwards',
        linkedEntityType: 'delay',
        linkedEntityId: 'delay_005',
        time: '15:00',
        reportedBy: 'usr_eng_001',
        reportedByName: 'Suresh Engineer'
      }
    ],
    photos: [],
    remarks: 'Rain affected work in afternoon. 5 Cum pending.'
  }
];

// Missing DPRs
export const missingDPRs: MissingDPR[] = [
  {
    id: 'missing_001',
    siteId: 'site_002',
    siteName: 'Riverside Tower - Block B',
    date: '2026-01-15',
    shift: 'morning',
    daysOverdue: 1,
    assignedTo: 'usr_eng_002',
    assignedToName: 'Amit Engineer'
  },
  {
    id: 'missing_002',
    siteId: 'site_002',
    siteName: 'Riverside Tower - Block B',
    date: '2026-01-15',
    shift: 'afternoon',
    daysOverdue: 1,
    assignedTo: 'usr_eng_002',
    assignedToName: 'Amit Engineer'
  },
  {
    id: 'missing_003',
    siteId: 'site_003',
    siteName: 'Highway Bridge - Main Site',
    date: '2026-01-14',
    shift: 'morning',
    daysOverdue: 2,
    assignedTo: 'usr_eng_003',
    assignedToName: 'Vikram Engineer'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-DPR-01',
    stage: 'RECORD',
    control: 'One DPR per site/date/shift submitted by cut-off',
    enforcement: 'WARN → MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-DPR-02',
    stage: 'VERIFY',
    control: 'DPR activity quantities reference active WA and stay within authorised + tolerance',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-DPR-03',
    stage: 'VERIFY',
    control: 'Material consumed ≤ issued to WA − previous consumption; labour ≤ attendance',
    enforcement: 'EXCEPTION / WARN',
    status: 'observe'
  },
  {
    id: 'CP-DPR-04',
    stage: 'RECORD',
    control: 'Photos per activity with GPS/time (where permitted)',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-DPR-05',
    stage: 'APPROVE',
    control: 'Reviewer ≠ author',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-DPR-06',
    stage: 'CLOSE',
    control: 'Approved DPR locked; addendum only with reason',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const dprStats = {
  totalDPRs: dprReports.length,
  approvedDPRs: dprReports.filter(d => d.status === 'approved').length,
  pendingApproval: dprReports.filter(d => d.status === 'submitted').length,
  returnedDPRs: dprReports.filter(d => d.status === 'returned').length,
  draftDPRs: dprReports.filter(d => d.status === 'draft').length,
  missingDPRs: missingDPRs.length,
  totalActivityLines: dprReports.reduce((sum, d) => sum + d.activityLines.length, 0),
  totalLabourEntries: dprReports.reduce((sum, d) => sum + d.labourLines.length, 0),
  totalMaterialEntries: dprReports.reduce((sum, d) => sum + d.materialLines.length, 0),
  totalEquipmentEntries: dprReports.reduce((sum, d) => sum + d.equipmentLines.length, 0),
  totalPhotos: dprReports.reduce((sum, d) => sum + d.photos.length, 0),
  totalEvents: dprReports.reduce((sum, d) => sum + d.events.length, 0)
};

// DPR Calendar Data
export const dprCalendar = [
  { date: '2026-01-10', site: 'site_001', status: 'approved' },
  { date: '2026-01-11', site: 'site_001', status: 'approved' },
  { date: '2026-01-12', site: 'site_001', status: 'approved' },
  { date: '2026-01-13', site: 'site_001', status: 'approved' },
  { date: '2026-01-14', site: 'site_001', status: 'returned' },
  { date: '2026-01-15', site: 'site_001', status: 'approved' },
  { date: '2026-01-16', site: 'site_001', status: 'submitted' },
  { date: '2026-01-10', site: 'site_002', status: 'approved' },
  { date: '2026-01-11', site: 'site_002', status: 'approved' },
  { date: '2026-01-12', site: 'site_002', status: 'missing' },
  { date: '2026-01-13', site: 'site_002', status: 'approved' },
  { date: '2026-01-14', site: 'site_002', status: 'approved' },
  { date: '2026-01-15', site: 'site_002', status: 'missing' },
  { date: '2026-01-16', site: 'site_002', status: 'missing' }
];
