// Part 32 — GIS, Survey & Site Location Intelligence Data
// A visual and navigation layer over existing records (Parts 4, 20, 27, 30), never a replacement.

export interface GisLayer {
  id: string;
  projectId: string;
  projectName: string;
  code: string;
  name: string;
  type: 'boundary' | 'alignment' | 'structure' | 'zone' | 'work_front' | 'asset' | 'store';
  siteId?: string;
  geometryGeojson: string;
  version: number;
  status: 'draft' | 'approved' | 'superseded';
  source: 'survey' | 'CAD' | 'KML' | 'manual';
  createdAt: string;
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  supersededBy?: string;
}

export interface GisChainageRef {
  id: string;
  projectId: string;
  alignmentLayerId: string;
  chainage: string;
  lat: number;
  lng: number;
}

export interface GisLocationLink {
  id: string;
  entityType: 'dpr' | 'mb' | 'inspection' | 'ncr' | 'incident' | 'photo' | 'equipment' | 'store' | 'asset';
  entityId: string;
  entityRef: string;
  layerId?: string;
  chainageFrom?: string;
  chainageTo?: string;
  lat?: number;
  lng?: number;
  status: string;
  recordedAt: string;
}

export interface GisBoqLocation {
  id: string;
  boqItemId: string;
  boqItemCode: string;
  boqItemName: string;
  layerId?: string;
  zoneName?: string;
  chainageFrom?: string;
  chainageTo?: string;
  plannedQty: number;
  measuredQty: number;
  uomName: string;
}

export interface GisHeatCell {
  id: string;
  kind: 'zone' | 'chainage';
  label: string;
  plannedPct: number;
  actualPct: number;
  variancePct: number;
  ncrCount: number;
  incidentCount: number;
}

export interface GisControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample GIS Layers (version lifecycle: DRAFT → APPROVED → SUPERSEDED)
export const gisLayers: GisLayer[] = [
  {
    id: 'gislyr_001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    code: 'LYR-BND-001',
    name: 'Riverside Tower Site Boundary',
    type: 'boundary',
    siteId: 'site_001',
    geometryGeojson: '{"type":"Polygon","coordinates":[[[72.8755,19.0745],[72.8795,19.0745],[72.8795,19.0775],[72.8755,19.0775],[72.8755,19.0745]]]}',
    version: 2,
    status: 'approved',
    source: 'survey',
    createdAt: '2025-11-10T09:00:00Z',
    createdBy: 'usr_sur_001',
    createdByName: 'Anil Surveyor',
    approvedBy: 'usr_pm_001',
    approvedByName: 'Rajesh Kumar',
    approvedAt: '2025-11-10T15:00:00Z'
  },
  {
    id: 'gislyr_001v1',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    code: 'LYR-BND-001',
    name: 'Riverside Tower Site Boundary',
    type: 'boundary',
    siteId: 'site_001',
    geometryGeojson: '{"type":"Polygon","coordinates":[[[72.8758,19.0748],[72.8792,19.0748],[72.8792,19.0772],[72.8758,19.0772],[72.8758,19.0748]]]}',
    version: 1,
    status: 'superseded',
    source: 'manual',
    createdAt: '2025-10-01T09:00:00Z',
    createdBy: 'usr_sur_001',
    createdByName: 'Anil Surveyor',
    supersededBy: 'gislyr_001'
  },
  {
    id: 'gislyr_002',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    code: 'LYR-ALG-002',
    name: 'Highway Bridge Centre-line Alignment',
    type: 'alignment',
    siteId: 'site_003',
    geometryGeojson: '{"type":"LineString","coordinates":[[72.8500,19.0000],[72.8550,19.0040],[72.8600,19.0080],[72.8650,19.0115],[72.8700,19.0150]]]}',
    version: 1,
    status: 'approved',
    source: 'CAD',
    createdAt: '2025-09-15T09:00:00Z',
    createdBy: 'usr_sur_001',
    createdByName: 'Anil Surveyor',
    approvedBy: 'usr_pm_001',
    approvedByName: 'Rajesh Kumar',
    approvedAt: '2025-09-15T14:00:00Z'
  },
  {
    id: 'gislyr_003',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    code: 'LYR-ZON-003',
    name: 'Block A Working Zones',
    type: 'zone',
    siteId: 'site_001',
    geometryGeojson: '{"type":"MultiPolygon","coordinates":[[[[72.8758,19.0748],[72.8775,19.0748],[72.8775,19.0770],[72.8758,19.0770],[72.8758,19.0748]]],[[[72.8776,19.0748],[72.8792,19.0748],[72.8792,19.0770],[72.8776,19.0770],[72.8776,19.0748]]]]}',
    version: 1,
    status: 'approved',
    source: 'manual',
    createdAt: '2025-11-12T09:00:00Z',
    createdBy: 'usr_plan_001',
    createdByName: 'Deepa Planner',
    approvedBy: 'usr_pm_001',
    approvedByName: 'Rajesh Kumar',
    approvedAt: '2025-11-12T16:00:00Z'
  },
  {
    id: 'gislyr_004',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    code: 'LYR-STR-004',
    name: 'Structures & Towers',
    type: 'structure',
    siteId: 'site_001',
    geometryGeojson: '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Tower A"},"geometry":{"type":"Point","coordinates":[72.8766,19.0760]}},{"type":"Feature","properties":{"name":"Tower B"},"geometry":{"type":"Point","coordinates":[72.8784,19.0760]}}]}',
    version: 1,
    status: 'draft',
    source: 'CAD',
    createdAt: '2026-01-05T09:00:00Z',
    createdBy: 'usr_plan_001',
    createdByName: 'Deepa Planner'
  },
  {
    id: 'gislyr_005',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    code: 'LYR-WFR-005',
    name: 'Work Fronts',
    type: 'work_front',
    siteId: 'site_001',
    geometryGeojson: '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Column C1-C5 (Ground Floor)"},"geometry":{"type":"Point","coordinates":[72.8762,19.0756]}},{"type":"Feature","properties":{"name":"Slab Casting - Ground Floor"},"geometry":{"type":"Point","coordinates":[72.8770,19.0754]}}]}',
    version: 1,
    status: 'approved',
    source: 'manual',
    createdAt: '2025-12-01T09:00:00Z',
    createdBy: 'usr_plan_001',
    createdByName: 'Deepa Planner',
    approvedBy: 'usr_pm_001',
    approvedByName: 'Rajesh Kumar',
    approvedAt: '2025-12-01T11:00:00Z'
  },
  {
    id: 'gislyr_006',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    code: 'LYR-STO-006',
    name: 'Stores & Material Locations',
    type: 'store',
    siteId: 'site_001',
    geometryGeojson: '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Main Store"},"geometry":{"type":"Point","coordinates":[72.8759,19.0772]}},{"type":"Feature","properties":{"name":"Cement Yard"},"geometry":{"type":"Point","coordinates":[72.8764,19.0773]}}]}',
    version: 1,
    status: 'approved',
    source: 'survey',
    createdAt: '2025-11-20T09:00:00Z',
    createdBy: 'usr_sur_001',
    createdByName: 'Anil Surveyor',
    approvedBy: 'usr_pm_001',
    approvedByName: 'Rajesh Kumar',
    approvedAt: '2025-11-20T12:00:00Z'
  }
];

// Linear referencing (roads / railways / pipelines) — chainage computed along approved alignment version
export const gisChainageRefs: GisChainageRef[] = [
  { id: 'gisch_001', projectId: 'prj_001', alignmentLayerId: 'gislyr_002', chainage: '0+000', lat: 19.0000, lng: 72.8500 },
  { id: 'gisch_002', projectId: 'prj_001', alignmentLayerId: 'gislyr_002', chainage: '0+200', lat: 19.0040, lng: 72.8550 },
  { id: 'gisch_003', projectId: 'prj_001', alignmentLayerId: 'gislyr_002', chainage: '0+400', lat: 19.0080, lng: 72.8600 },
  { id: 'gisch_004', projectId: 'prj_001', alignmentLayerId: 'gislyr_002', chainage: '0+600', lat: 19.0115, lng: 72.8650 },
  { id: 'gisch_005', projectId: 'prj_001', alignmentLayerId: 'gislyr_002', chainage: '0+800', lat: 19.0150, lng: 72.8700 },
  { id: 'gisch_006', projectId: 'prj_001', alignmentLayerId: 'gislyr_002', chainage: '1+000', lat: 19.0185, lng: 72.8750 }
];

// Location links for DPR, MB, inspections, NCRs, incidents, photos, equipment, stores
export const gisLocationLinks: GisLocationLink[] = [
  { id: 'gislnk_001', entityType: 'dpr', entityId: 'dpr_001', entityRef: 'DPR-2026-0225', layerId: 'gislyr_003', lat: 19.0760, lng: 72.8777, status: 'approved', recordedAt: '2026-01-15T18:00:00Z' },
  { id: 'gislnk_002', entityType: 'dpr', entityId: 'dpr_002', entityRef: 'DPR-2026-0226', layerId: 'gislyr_003', lat: 19.0760, lng: 72.8777, status: 'submitted', recordedAt: '2026-01-16T18:30:00Z' },
  { id: 'gislnk_003', entityType: 'dpr', entityId: 'dpr_003', entityRef: 'DPR-2026-0224', layerId: 'gislyr_002', chainageFrom: '0+400', lat: 19.0080, lng: 72.8600, status: 'returned', recordedAt: '2026-01-14T18:00:00Z' },
  { id: 'gislnk_004', entityType: 'mb', entityId: 'mb_001', entityRef: 'MB-2026-0117', layerId: 'gislyr_002', chainageFrom: '0+400', chainageTo: '0+600', lat: 19.0080, lng: 72.8600, status: 'submitted', recordedAt: '2026-01-15T17:00:00Z' },
  { id: 'gislnk_005', entityType: 'ncr', entityId: 'ncr_001', entityRef: 'NCR-2026-0019', layerId: 'gislyr_003', lat: 19.0756, lng: 72.8762, status: 'open', recordedAt: '2026-01-15T11:30:00Z' },
  { id: 'gislnk_006', entityType: 'inspection', entityId: 'insp_001', entityRef: 'INSP-2026-0042', layerId: 'gislyr_005', lat: 19.0756, lng: 72.8762, status: 'passed', recordedAt: '2026-01-15T09:45:00Z' },
  { id: 'gislnk_007', entityType: 'incident', entityId: 'inc_001', entityRef: 'INC-2026-0004', layerId: 'gislyr_003', lat: 19.0754, lng: 72.8770, status: 'closed', recordedAt: '2026-01-12T14:20:00Z' },
  { id: 'gislnk_008', entityType: 'photo', entityId: 'photo_001', entityRef: 'Column reinforcement inspection', lat: 19.0760, lng: 72.8777, status: 'attached', recordedAt: '2026-01-15T10:30:00Z' },
  { id: 'gislnk_009', entityType: 'equipment', entityId: 'plt_003', entityRef: 'Tower Crane TC-01', lat: 19.0762, lng: 72.8775, status: 'live', recordedAt: '2026-01-16T08:00:00Z' },
  { id: 'gislnk_010', entityType: 'store', entityId: 'store_001', entityRef: 'Main Store', layerId: 'gislyr_006', lat: 19.0772, lng: 72.8759, status: 'active', recordedAt: '2025-11-20T12:00:00Z' }
];

// BOQ / location mapping — quantities per zone / chainage; measured vs planned by location
export const gisBoqLocations: GisBoqLocation[] = [
  { id: 'gisbq_001', boqItemId: 'boq_014', boqItemCode: 'BOQ-014', boqItemName: 'RCC M30 in Columns', layerId: 'gislyr_003', zoneName: 'Zone A1', plannedQty: 320, measuredQty: 310, uomName: 'Cum' },
  { id: 'gisbq_002', boqItemId: 'boq_015', boqItemCode: 'BOQ-015', boqItemName: 'RCC M30 in Beams', layerId: 'gislyr_003', zoneName: 'Zone A1', plannedQty: 260, measuredQty: 240, uomName: 'Cum' },
  { id: 'gisbq_003', boqItemId: 'boq_021', boqItemCode: 'BOQ-021', boqItemName: 'RCC M30 in Slab', layerId: 'gislyr_003', zoneName: 'Zone A2', plannedQty: 480, measuredQty: 410, uomName: 'Cum' },
  { id: 'gisbq_004', boqItemId: 'boq_031', boqItemCode: 'BOQ-031', boqItemName: 'Excavation for Foundation', layerId: 'gislyr_002', chainageFrom: '0+000', chainageTo: '0+600', plannedQty: 2400, measuredQty: 2400, uomName: 'Cum' },
  { id: 'gisbq_005', boqItemId: 'boq_032', boqItemCode: 'BOQ-032', boqItemName: 'Piling', layerId: 'gislyr_002', chainageFrom: '0+600', chainageTo: '1+000', plannedQty: 32, measuredQty: 24, uomName: 'No.' }
];

// Progress heatmap by zone / chainage (planned vs actual from Parts 27/30), NCR and incident heat layers
export const gisHeatmap: GisHeatCell[] = [
  { id: 'gishm_001', kind: 'zone', label: 'Zone A1', plannedPct: 100, actualPct: 96, variancePct: -4, ncrCount: 1, incidentCount: 0 },
  { id: 'gishm_002', kind: 'zone', label: 'Zone A2', plannedPct: 100, actualPct: 85, variancePct: -15, ncrCount: 0, incidentCount: 1 },
  { id: 'gishm_003', kind: 'zone', label: 'Zone A3', plannedPct: 80, actualPct: 78, variancePct: -2, ncrCount: 0, incidentCount: 0 },
  { id: 'gishm_004', kind: 'chainage', label: 'CH 0+000–0+600', plannedPct: 100, actualPct: 100, variancePct: 0, ncrCount: 0, incidentCount: 0 },
  { id: 'gishm_005', kind: 'chainage', label: 'CH 0+600–1+000', plannedPct: 100, actualPct: 75, variancePct: -25, ncrCount: 2, incidentCount: 0 }
];

// Protocol Control Points (Part 7, PC-2)
export const gisControlPoints: GisControlPoint[] = [
  {
    id: 'CP-GIS-01',
    stage: 'RECORD',
    control: 'Linear works require chainage on DPR/MB/NCR entries',
    enforcement: 'EXCEPTION (DOCUMENT_WAIVER)',
    status: 'observe'
  },
  {
    id: 'CP-GIS-02',
    stage: 'APPROVE',
    control: 'Alignment/boundary layer versions approved before use',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const gisStats = {
  totalLayers: gisLayers.length,
  approvedLayers: gisLayers.filter(l => l.status === 'approved').length,
  draftLayers: gisLayers.filter(l => l.status === 'draft').length,
  supersededLayers: gisLayers.filter(l => l.status === 'superseded').length,
  chainageRefs: gisChainageRefs.length,
  locationLinks: gisLocationLinks.length,
  dprLinks: gisLocationLinks.filter(l => l.entityType === 'dpr').length,
  boqLocations: gisBoqLocations.length,
  liveEquipment: gisLocationLinks.filter(l => l.entityType === 'equipment' && l.status === 'live').length
};
