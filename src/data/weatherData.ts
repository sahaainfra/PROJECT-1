// Part 31 — Weather & Site Condition Management Data
// Extends DPR weather fields (Part 30), never duplicates them.

export interface WxObservation {
  id: string;
  projectId: string;
  siteId: string;
  siteName: string;
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  rainfallMm: number;
  tempMin: number;
  tempMax: number;
  humidityPct: number;
  windKmph: number;
  condition: 'clear' | 'rain' | 'storm' | 'fog' | 'heat';
  source: 'manual' | 'station' | 'provider';
  recordedBy: string;
  recordedByName: string;
  recordedAt: string;
  dprNo?: string;
  remarks?: string;
}

export interface WxShutdown {
  id: string;
  projectId: string;
  siteId: string;
  siteName: string;
  shutdownNo: string;
  start: string;
  end: string;
  hoursLost: number;
  reason: string;
  activitiesAffected: string[];
  evidenceDocIds: string[];
  status: 'recorded' | 'approved' | 'linked_to_delay';
  recordedBy: string;
  recordedByName: string;
  recordedAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  delayEventId?: string;
  dprNo?: string;
}

export interface WxRestriction {
  id: string;
  projectId: string;
  projectName: string;
  restrictionNo: string;
  activityType: 'concreting' | 'bituminous' | 'painting' | 'masonry' | 'earthwork';
  rule: string;
  rainfallLimitMm?: number;
  tempLimitC?: number;
  windLimitKmph?: number;
  enforcement: 'warn' | 'block';
  source: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface WxRestrictionWarning {
  id: string;
  restrictionId: string;
  restrictionNo: string;
  waId?: string;
  waNo?: string;
  siteId: string;
  siteName: string;
  date: string;
  conditionObserved: string;
  breachDetail: string;
  result: 'warn' | 'block';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface WxMonthlyHistory {
  siteId: string;
  siteName: string;
  month: string;
  rainDays: number;
  totalRainfallMm: number;
  stormDays: number;
  heatDays: number;
  hoursLost: number;
}

export interface WxControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Weather Observations
export const wxObservations: WxObservation[] = [
  {
    id: 'wxobs_001',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-16',
    timeSlot: 'morning',
    rainfallMm: 0,
    tempMin: 21,
    tempMax: 29,
    humidityPct: 62,
    windKmph: 8,
    condition: 'clear',
    source: 'manual',
    recordedBy: 'usr_eng_001',
    recordedByName: 'Suresh Engineer',
    recordedAt: '2026-01-16T07:30:00Z',
    dprNo: 'DPR-2026-0226',
    remarks: 'Clear morning, concreting permitted'
  },
  {
    id: 'wxobs_002',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-14',
    timeSlot: 'afternoon',
    rainfallMm: 5,
    tempMin: 24,
    tempMax: 26,
    humidityPct: 84,
    windKmph: 14,
    condition: 'rain',
    source: 'manual',
    recordedBy: 'usr_eng_001',
    recordedByName: 'Suresh Engineer',
    recordedAt: '2026-01-14T15:00:00Z',
    dprNo: 'DPR-2026-0224',
    remarks: 'Light rain from 3 PM — work suspended'
  },
  {
    id: 'wxobs_003',
    projectId: 'prj_001',
    siteId: 'site_003',
    siteName: 'Highway Bridge - Main Site',
    date: '2025-07-25',
    timeSlot: 'morning',
    rainfallMm: 48,
    tempMin: 23,
    tempMax: 27,
    humidityPct: 95,
    windKmph: 32,
    condition: 'storm',
    source: 'station',
    recordedBy: 'usr_eng_003',
    recordedByName: 'Vikram Engineer',
    recordedAt: '2025-07-25T08:00:00Z',
    remarks: 'Heavy rainfall — site flooded, all work suspended'
  },
  {
    id: 'wxobs_004',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-15',
    timeSlot: 'morning',
    rainfallMm: 0,
    tempMin: 20,
    tempMax: 28,
    humidityPct: 58,
    windKmph: 6,
    condition: 'clear',
    source: 'provider',
    recordedBy: 'usr_eng_001',
    recordedByName: 'Suresh Engineer',
    recordedAt: '2026-01-15T07:00:00Z',
    dprNo: 'DPR-2026-0225',
    remarks: 'Provider feed (Part 80) — does not overwrite manual observations'
  }
];

// Sample Weather Shutdowns
export const wxShutdowns: WxShutdown[] = [
  {
    id: 'wxshut_001',
    projectId: 'prj_001',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    shutdownNo: 'WSD-2026-0007',
    start: '2026-01-14T15:00:00Z',
    end: '2026-01-14T18:00:00Z',
    hoursLost: 3,
    reason: 'Light rain from 3 PM — slab and beam work suspended',
    activitiesAffected: ['A2020', 'A2030'],
    evidenceDocIds: ['doc_weather_002', 'doc_photo_004'],
    status: 'approved',
    recordedBy: 'usr_eng_001',
    recordedByName: 'Suresh Engineer',
    recordedAt: '2026-01-14T15:10:00Z',
    approvedBy: 'usr_sm_001',
    approvedByName: 'Rahul Mehta',
    approvedAt: '2026-01-14T18:30:00Z',
    dprNo: 'DPR-2026-0224'
  },
  {
    id: 'wxshut_002',
    projectId: 'prj_001',
    siteId: 'site_003',
    siteName: 'Highway Bridge - Main Site',
    shutdownNo: 'WSD-2025-0031',
    start: '2025-07-25T08:00:00Z',
    end: '2025-07-28T18:00:00Z',
    hoursLost: 30,
    reason: 'Heavy rainfall and flooding — excavation and Piling suspended',
    activitiesAffected: ['A1020', 'A1030'],
    evidenceDocIds: ['doc_weather_001', 'doc_photo_003'],
    status: 'linked_to_delay',
    recordedBy: 'usr_eng_003',
    recordedByName: 'Vikram Engineer',
    recordedAt: '2025-07-25T08:15:00Z',
    approvedBy: 'usr_pm_001',
    approvedByName: 'Rajesh Kumar',
    approvedAt: '2025-07-25T19:00:00Z',
    delayEventId: 'delay_003'
  },
  {
    id: 'wxshut_003',
    projectId: 'prj_001',
    siteId: 'site_002',
    siteName: 'Riverside Tower - Block B',
    shutdownNo: 'WSD-2026-0008',
    start: '2026-01-16T14:00:00Z',
    end: '2026-01-16T17:00:00Z',
    hoursLost: 3,
    reason: 'Unseasonal showers — masonry work suspended',
    activitiesAffected: ['A2040'],
    evidenceDocIds: ['doc_weather_003'],
    status: 'recorded',
    recordedBy: 'usr_eng_002',
    recordedByName: 'Amit Engineer',
    recordedAt: '2026-01-16T14:05:00Z'
  }
];

// Sample Weather Restrictions
export const wxRestrictions: WxRestriction[] = [
  {
    id: 'wxres_001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    restrictionNo: 'WXR-2026-001',
    activityType: 'concreting',
    rule: 'No concrete pour if rainfall > 5 mm/h or ambient temperature > 40 °C',
    rainfallLimitMm: 5,
    tempLimitC: 40,
    enforcement: 'warn',
    source: 'Specification Section 03300 — Concrete Works',
    status: 'active',
    createdBy: 'usr_qa_001',
    createdByName: 'Priya QA',
    createdAt: '2026-01-02T09:00:00Z'
  },
  {
    id: 'wxres_002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    restrictionNo: 'WXR-2026-002',
    activityType: 'concreting',
    rule: 'No concrete pour if wind speed > 40 kmph (evaporation protection)',
    windLimitKmph: 40,
    enforcement: 'block',
    source: 'Specification Section 03300 — Hot Weather Concreting',
    status: 'active',
    createdBy: 'usr_qa_001',
    createdByName: 'Priya QA',
    createdAt: '2026-01-02T09:05:00Z'
  },
  {
    id: 'wxres_003',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    restrictionNo: 'WXR-2026-003',
    activityType: 'bituminous',
    rule: 'No bituminous work during rain or on wet surface; minimum surface temperature 10 °C',
    rainfallLimitMm: 0,
    tempLimitC: 10,
    enforcement: 'warn',
    source: 'Specification Section 02700 — Bituminous Works',
    status: 'active',
    createdBy: 'usr_qa_001',
    createdByName: 'Priya QA',
    createdAt: '2026-01-02T09:10:00Z'
  },
  {
    id: 'wxres_004',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    restrictionNo: 'WXR-2026-004',
    activityType: 'painting',
    rule: 'No painting if humidity > 85 % or rainfall forecast > 2 mm',
    rainfallLimitMm: 2,
    enforcement: 'warn',
    source: 'Specification Section 09900 — Painting',
    status: 'inactive',
    createdBy: 'usr_qa_001',
    createdByName: 'Priya QA',
    createdAt: '2026-01-02T09:15:00Z'
  }
];

// Sample Restriction Warnings (CP-WX-02)
export const wxRestrictionWarnings: WxRestrictionWarning[] = [
  {
    id: 'wxrw_001',
    restrictionId: 'wxres_001',
    restrictionNo: 'WXR-2026-001',
    waId: 'wa_002',
    waNo: 'WA-2026-0143',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-14',
    conditionObserved: 'Rain 5 mm (afternoon), humidity 84 %',
    breachDetail: 'Concreting WA active during rainfall at limit — 3 hours lost (WSD-2026-0007)',
    result: 'warn',
    acknowledgedBy: 'usr_eng_001',
    acknowledgedAt: '2026-01-14T15:20:00Z'
  },
  {
    id: 'wxrw_002',
    restrictionId: 'wxres_002',
    restrictionNo: 'WXR-2026-002',
    waId: 'wa_002',
    waNo: 'WA-2026-0143',
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    date: '2026-01-12',
    conditionObserved: 'Wind 42 kmph (gusts)',
    breachDetail: 'BLOCK — WA issuance prevented for concreting under wind above 40 kmph limit',
    result: 'block'
  }
];

// Sample Monthly Weather History per site (feeds schedule calendars, Part 26)
export const wxMonthlyHistory: WxMonthlyHistory[] = [
  { siteId: 'site_001', siteName: 'Riverside Tower - Block A', month: '2025-06', rainDays: 12, totalRainfallMm: 284, stormDays: 3, heatDays: 2, hoursLost: 34 },
  { siteId: 'site_001', siteName: 'Riverside Tower - Block A', month: '2025-07', rainDays: 18, totalRainfallMm: 512, stormDays: 5, heatDays: 0, hoursLost: 62 },
  { siteId: 'site_001', siteName: 'Riverside Tower - Block A', month: '2025-08', rainDays: 15, totalRainfallMm: 401, stormDays: 4, heatDays: 0, hoursLost: 48 },
  { siteId: 'site_003', siteName: 'Highway Bridge - Main Site', month: '2025-06', rainDays: 10, totalRainfallMm: 220, stormDays: 2, heatDays: 4, hoursLost: 21 },
  { siteId: 'site_003', siteName: 'Highway Bridge - Main Site', month: '2025-07', rainDays: 16, totalRainfallMm: 468, stormDays: 4, heatDays: 1, hoursLost: 55 },
  { siteId: 'site_003', siteName: 'Highway Bridge - Main Site', month: '2025-08', rainDays: 13, totalRainfallMm: 355, stormDays: 3, heatDays: 0, hoursLost: 40 }
];

// Protocol Control Points (Part 7, PC-2)
export const wxControlPoints: WxControlPoint[] = [
  {
    id: 'CP-WX-01',
    stage: 'RECORD',
    control: 'Weather recorded daily per active site',
    enforcement: 'WARN',
    status: 'observe'
  },
  {
    id: 'CP-WX-02',
    stage: 'VERIFY',
    control: 'Restricted activities warn/block under breaching conditions',
    enforcement: 'WARN / EXCEPTION (SPEC_DEVIATION)',
    status: 'observe'
  }
];

// Statistics
export const wxStats = {
  totalObservations: wxObservations.length,
  observationsToday: wxObservations.filter(o => o.date === '2026-01-16').length,
  totalShutdowns: wxShutdowns.length,
  approvedShutdowns: wxShutdowns.filter(s => s.status === 'approved' || s.status === 'linked_to_delay').length,
  linkedToDelay: wxShutdowns.filter(s => s.status === 'linked_to_delay').length,
  pendingApproval: wxShutdowns.filter(s => s.status === 'recorded').length,
  totalHoursLost: wxShutdowns.reduce((sum, s) => sum + s.hoursLost, 0),
  activeRestrictions: wxRestrictions.filter(r => r.status === 'active').length,
  restrictionWarnings: wxRestrictionWarnings.filter(w => w.result === 'warn').length,
  restrictionBlocks: wxRestrictionWarnings.filter(w => w.result === 'block').length,
  providerObservations: wxObservations.filter(o => o.source === 'provider').length
};

// Current weather card per site (consumed by site home and DPR)
export const wxCurrentBySite = [
  {
    siteId: 'site_001',
    siteName: 'Riverside Tower - Block A',
    condition: 'clear',
    rainfallMm: 0,
    tempMin: 21,
    tempMax: 29,
    humidityPct: 62,
    windKmph: 8,
    source: 'manual',
    asOf: '2026-01-16T07:30:00Z',
    concretingPermitted: true
  },
  {
    siteId: 'site_002',
    siteName: 'Riverside Tower - Block B',
    condition: 'rain',
    rainfallMm: 3,
    tempMin: 22,
    tempMax: 27,
    humidityPct: 88,
    windKmph: 12,
    source: 'manual',
    asOf: '2026-01-16T14:05:00Z',
    concretingPermitted: false
  },
  {
    siteId: 'site_003',
    siteName: 'Highway Bridge - Main Site',
    condition: 'clear',
    rainfallMm: 0,
    tempMin: 19,
    tempMax: 31,
    humidityPct: 55,
    windKmph: 10,
    source: 'station',
    asOf: '2026-01-16T07:00:00Z',
    concretingPermitted: true
  }
];
