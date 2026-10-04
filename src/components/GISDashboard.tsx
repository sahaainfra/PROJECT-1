import { useState } from 'react';
import {
  gisLayers,
  gisChainageRefs,
  gisLocationLinks,
  gisBoqLocations,
  gisHeatmap,
  gisControlPoints,
  gisStats
} from '../data/gisData';
import type { GisLocationLink } from '../data/gisData';

const linkStatusChip: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  submitted: 'bg-amber-100 text-amber-700',
  returned: 'bg-red-100 text-red-700',
  open: 'bg-red-100 text-red-700',
  passed: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
  attached: 'bg-blue-100 text-blue-700',
  live: 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700'
};

const entityTypeIcon: Record<string, string> = {
  dpr: '📋',
  mb: '📐',
  inspection: '🔍',
  ncr: '⛔',
  incident: '⚠️',
  photo: '📷',
  equipment: '🏗️',
  store: '📦',
  asset: 'Asset'
};

export function GISDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'map', label: 'Map Workspace' },
    { id: 'heatmap', label: 'Progress Heatmap' },
    { id: 'boq', label: 'BOQ by Location' },
    { id: 'layers', label: 'Layers & Versioning' },
    { id: 'protocol', label: 'Protocol Controls' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">GIS, Survey & Site Location Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">Part 32 — Site boundaries, chainages, structures, location-linked records and progress heatmap — a visual layer over existing records</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            ff.gis
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'map' && <MapWorkspaceTab />}
      {activeTab === 'heatmap' && <HeatmapTab />}
      {activeTab === 'boq' && <BoqTab />}
      {activeTab === 'layers' && <LayersTab />}
      {activeTab === 'protocol' && <ProtocolTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="GIS Layers"
          value={gisStats.totalLayers}
          subtitle={`${gisStats.approvedLayers} approved · ${gisStats.draftLayers} draft`}
          color="emerald"
        />
        <StatCard
          title="Location Links"
          value={gisStats.locationLinks}
          subtitle={`${gisStats.dprLinks} DPR entries located`}
          color="blue"
        />
        <StatCard
          title="Chainage References"
          value={gisStats.chainageRefs}
          subtitle="Linear referencing on approved alignment"
          color="purple"
        />
        <StatCard
          title="BOQ / Location Mappings"
          value={gisStats.boqLocations}
          subtitle="Quantities per zone / chainage"
          color="amber"
        />
      </div>

      {/* Location dimension of control */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Location as a Shared Dimension of Control</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Records located on map</p>
            <p className="font-semibold text-slate-900">DPR · MB · NCR · inspection · incident · photo</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Live equipment positions</p>
            <p className="font-semibold text-slate-900">{gisStats.liveEquipment} from telematics (Part 37)</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Coordinates standard</p>
            <p className="font-semibold text-slate-900">WGS84 · chainage along approved alignment</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Import formats</p>
            <p className="font-semibold text-slate-900">GeoJSON / KML (CAD export) with versioning</p>
          </div>
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {gisControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">{cp.stage}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">{cp.status}</span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapWorkspaceTab() {
  const [mapContext, setMapContext] = useState<'site_001' | 'site_003'>('site_001');
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    boundary: true,
    zones: true,
    workfronts: true,
    stores: true,
    records: true,
    equipment: true
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const toggleLayer = (key: string) => setVisibleLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const links = gisLocationLinks.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (mapContext === 'site_001') return l.lat && l.lng && (l.lat > 19.05);
    return l.chainageFrom !== undefined;
  });
  const selected = gisLocationLinks.find(l => l.id === selectedLink) || null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Map context</label>
            <select
              value={mapContext}
              onChange={(e) => { setMapContext(e.target.value as 'site_001' | 'site_003'); setSelectedLink(null); }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="site_001">Riverside Tower - Block A (zones)</option>
              <option value="site_003">Highway Bridge - Main Site (alignment)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="submitted">Submitted</option>
              <option value="returned">Returned</option>
              <option value="open">Open NCR</option>
              <option value="live">Live equipment</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            {Object.entries(visibleLayers).map(([key, visible]) => (
              <label key={key} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={() => toggleLayer(key)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          {mapContext === 'site_001' ? <SiteMap visibleLayers={visibleLayers} onSelect={setSelectedLink} selectedLink={selectedLink} /> : <AlignmentMap onSelect={setSelectedLink} selectedLink={selectedLink} />}
        </div>

        {/* Click-through panel */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Click-through to records</h4>
          {!selected && (
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-400">Select a marker on the map to open the linked record details.</p>
              <p className="text-[10px] text-slate-400 mt-2">{links.length} records in current filter</p>
            </div>
          )}
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{entityTypeIcon[selected.entityType]}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${linkStatusChip[selected.status] || 'bg-slate-100 text-slate-700'}`}>
                  {selected.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Entity</p>
                <p className="text-sm font-medium text-slate-900">{selected.entityType.toUpperCase()} · {selected.entityRef}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Position (WGS84)</p>
                <p className="text-xs font-mono text-slate-700">
                  {selected.lat !== undefined && selected.lng !== undefined
                    ? `${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}`
                    : `chainage ${selected.chainageFrom}${selected.chainageTo ? ` → ${selected.chainageTo}` : ''}`}
                </p>
              </div>
              {selected.layerId && (
                <div>
                  <p className="text-xs text-slate-500">Layer</p>
                  <p className="text-xs font-mono text-slate-700">{gisLayers.find(l => l.id === selected.layerId)?.code}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500">Recorded</p>
                <p className="text-xs text-slate-700">{new Date(selected.recordedAt).toLocaleString()}</p>
              </div>
              <p className="text-[10px] text-slate-400">Drill-down: KPI → record → source evidence. Map is a navigation layer over the existing record, never a replacement.</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700 mb-2">Legend</p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600">
              <span>🟩 Boundary (approved)</span>
              <span>🟦 Zones</span>
              <span>📍 Work fronts</span>
              <span>📦 Stores</span>
              <span>📋 DPR</span>
              <span>⛔ NCR / incident</span>
              <span>🔍 Inspection</span>
              <span>🏗️ Equipment (live)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteMap({ visibleLayers, onSelect, selectedLink }: {
  visibleLayers: Record<string, boolean>;
  onSelect: (id: string) => void;
  selectedLink: string | null;
}) {
  // viewBox 0 0 400 300 — lng 72.8750..72.8800 → x, lat 19.0780..19.0740 → y
  const px = (lng: number) => ((lng - 72.8750) / 0.0050) * 400;
  const py = (lat: number) => ((19.0780 - lat) / 0.0040) * 300;
  const boundary = gisLayers.find(l => l.id === 'gislyr_001');
  const zones = gisLayers.find(l => l.id === 'gislyr_003');
  const workFronts = gisLayers.find(l => l.id === 'gislyr_005');
  const structures = gisLayers.find(l => l.id === 'gislyr_004');
  const stores = gisLayers.find(l => l.id === 'gislyr_006');

  const parsePts = (geojson: string): number[][] => {
    try {
      const g = JSON.parse(geojson);
      if (g.type === 'Polygon') return g.coordinates[0].map((c: number[]) => [px(c[0]), py(c[1])]);
    } catch { /* invalid geojson handled by validation */ }
    return [];
  };
  const parseFeaturePoints = (geojson: string): { name: string; x: number; y: number }[] => {
    try {
      const g = JSON.parse(geojson);
      if (g.type === 'FeatureCollection') {
        return g.features.map((f: { properties: { name: string }; geometry: { coordinates: number[] } }) => ({
          name: f.properties.name,
          x: px(f.geometry.coordinates[0]),
          y: py(f.geometry.coordinates[1])
        }));
      }
    } catch { /* invalid geojson handled by validation */ }
    return [];
  };

  const recordMarkers = gisLocationLinks.filter(l => l.lat && l.lng && l.lat > 19.05);
  const markerColor = (l: GisLocationLink) =>
    l.entityType === 'ncr' ? '#dc2626' :
    l.entityType === 'incident' ? '#f59e0b' :
    l.entityType === 'inspection' ? '#0ea5e9' :
    l.entityType === 'equipment' ? '#7c3aed' :
    l.entityType === 'store' ? '#64748b' :
    l.entityType === 'dpr' ? '#059669' : '#3b82f6';

  return (
    <svg viewBox="0 0 400 300" className="w-full rounded-lg bg-slate-50 border border-slate-200" role="img" aria-label="Site map with layers and record markers">
      {/* grid */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`gv${i}`} x1={i * 50} y1={0} x2={i * 50} y2={300} stroke="#e2e8f0" strokeWidth={1} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`gh${i}`} x1={0} y1={i * 50} x2={400} y2={i * 50} stroke="#e2e8f0" strokeWidth={1} />
      ))}

      {/* Boundary */}
      {visibleLayers.boundary && boundary && (() => {
        const pts = parsePts(boundary.geometryGeojson);
        if (!pts.length) return null;
        return <polygon points={pts.map(p => p.join(',')).join(' ')} fill="#10b98118" stroke="#10b981" strokeWidth={2} strokeDasharray="0" />;
      })()}

      {/* Zones */}
      {visibleLayers.zones && zones && (() => {
        try {
          const g = JSON.parse(zones.geometryGeojson);
          if (g.type === 'MultiPolygon') {
            return g.coordinates.map((poly: number[][][], i: number) => (
              <polygon
                key={i}
                points={poly[0].map((c: number[]) => [px(c[0]), py(c[1])].join(',')).join(' ')}
                fill="#3b82f618" stroke="#3b82f6" strokeWidth={1.5}
              />
            ));
          }
        } catch { /* invalid geojson handled by validation */ }
        return null;
      })()}

      {/* Structures (draft layer) */}
      {structures && parseFeaturePoints(structures.geometryGeojson).map((p, i) => (
        <g key={`str${i}`}>
          <rect x={p.x - 5} y={p.y - 5} width={10} height={10} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 2" />
          <text x={p.x + 8} y={p.y + 3} fontSize={8} fill="#64748b">{p.name} (draft)</text>
        </g>
      ))}

      {/* Work fronts */}
      {visibleLayers.workfronts && workFronts && parseFeaturePoints(workFronts.geometryGeojson).map((p, i) => (
        <g key={`wf${i}`}>
          <circle cx={p.x} cy={p.y} r={4} fill="#0ea5e9" />
          <text x={p.x + 6} y={p.y + 3} fontSize={7} fill="#0369a1">{p.name}</text>
        </g>
      ))}

      {/* Stores */}
      {visibleLayers.stores && stores && parseFeaturePoints(stores.geometryGeojson).map((p, i) => (
        <g key={`sto${i}`}>
          <rect x={p.x - 4} y={p.y - 4} width={8} height={8} fill="#64748b" />
          <text x={p.x + 6} y={p.y + 3} fontSize={7} fill="#475569">{p.name}</text>
        </g>
      ))}

      {/* Record markers */}
      {visibleLayers.records && recordMarkers.filter(l => l.entityType !== 'equipment' && l.entityType !== 'store').map(l => (
        <g key={l.id} onClick={() => onSelect(l.id)} className="cursor-pointer">
          <circle
            cx={px(l.lng!)} cy={py(l.lat!)} r={selectedLink === l.id ? 7 : 5}
            fill={markerColor(l)} stroke={selectedLink === l.id ? '#1e293b' : '#fff'} strokeWidth={selectedLink === l.id ? 2 : 1}
          />
          <text x={px(l.lng!) + 8} y={py(l.lat!) + 3} fontSize={7} fill={markerColor(l)}>{l.entityRef}</text>
        </g>
      ))}

      {/* Live equipment */}
      {visibleLayers.equipment && recordMarkers.filter(l => l.entityType === 'equipment').map(l => (
        <g key={l.id} onClick={() => onSelect(l.id)} className="cursor-pointer">
          <circle cx={px(l.lng!)} cy={py(l.lat!)} r={7} fill="none" stroke="#7c3aed" strokeWidth={2} />
          <circle cx={px(l.lng!)} cy={py(l.lat!)} r={3} fill="#7c3aed" />
          <text x={px(l.lng!) + 10} y={py(l.lat!) + 3} fontSize={7} fill="#7c3aed">{l.entityRef} (live)</text>
        </g>
      ))}
    </svg>
  );
}

function AlignmentMap({ onSelect, selectedLink }: {
  onSelect: (id: string) => void;
  selectedLink: string | null;
}) {
  const alignment = gisLayers.find(l => l.id === 'gislyr_002');
  const chainages = gisChainageRefs;
  const linearLinks = gisLocationLinks.filter(l => l.chainageFrom !== undefined);

  let pts: number[][] = [];
  try {
    const g = JSON.parse(alignment?.geometryGeojson || '{}');
    if (g.type === 'LineString') pts = g.coordinates;
  } catch { /* invalid geojson handled by validation */ }

  // viewBox 0 0 400 200 — lng 72.8450..72.8800 → x, lat 19.0250..18.9950 → y
  const px = (lng: number) => ((lng - 72.8450) / 0.0350) * 400;
  const py = (lat: number) => ((19.0250 - lat) / 0.0300) * 200;

  const chainageAt = (ch: string) => chainages.find(c => c.chainage === ch);

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 400 200" className="w-full rounded-lg bg-slate-50 border border-slate-200" role="img" aria-label="Alignment map with chainage ticks and linear records">
        {pts.length > 0 && (
          <polyline
            points={pts.map(c => [px(c[0]), py(c[1])].join(',')).join(' ')}
            fill="none" stroke="#059669" strokeWidth={3}
          />
        )}
        {chainages.map(c => (
          <g key={c.id}>
            <line x1={px(c.lng)} y1={py(c.lat) - 8} x2={px(c.lng)} y2={py(c.lat) + 8} stroke="#059669" strokeWidth={1.5} />
            <text x={px(c.lng) - 12} y={py(c.lat) + 20} fontSize={8} fill="#065f46" font-family="monospace">CH {c.chainage}</text>
          </g>
        ))}
        {linearLinks.map(l => {
          const ref = chainageAt(l.chainageFrom!);
          if (!ref) return null;
          const color = l.entityType === 'ncr' ? '#dc2626' : l.entityType === 'mb' ? '#8b5cf6' : '#f59e0b';
          return (
            <g key={l.id} onClick={() => onSelect(l.id)} className="cursor-pointer">
              <circle
                cx={px(ref.lng)} cy={py(ref.lat)} r={selectedLink === l.id ? 7 : 5}
                fill={color} stroke={selectedLink === l.id ? '#1e293b' : '#fff'} strokeWidth={selectedLink === l.id ? 2 : 1}
              />
              <text x={px(ref.lng) + 8} y={py(ref.lat) - 6} fontSize={7} fill={color}>{l.entityRef}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-500">
        Alignment version {alignment?.version} ({alignment?.status}) — chainage computed along the approved alignment version (business rule). CP-GIS-01: linear works require chainage on DPR/MB/NCR entries.
      </p>
    </div>
  );
}

function HeatmapTab() {
  const heatColor = (variancePct: number) =>
    variancePct >= 0 ? 'bg-green-100 border-green-300 text-green-800' :
    variancePct >= -10 ? 'bg-amber-100 border-amber-300 text-amber-800' :
    'bg-red-100 border-red-300 text-red-800';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Progress Heatmap by Zone / Chainage</h3>
        <p className="text-sm text-slate-500 mb-4">Planned vs actual from Parts 27/30 · NCR and incident heat layers · every cell drills down to records</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Kind</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Planned</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Actual</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Variance</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">NCRs</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Incidents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {gisHeatmap.map(cell => (
                <tr key={cell.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{cell.label}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      cell.kind === 'zone' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {cell.kind}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{cell.plannedPct}%</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{cell.actualPct}%</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded border ${heatColor(cell.variancePct)}`}>
                        {cell.variancePct >= 0 ? '+' : ''}{cell.variancePct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      cell.ncrCount > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {cell.ncrCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      cell.incidentCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {cell.incidentCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Aggregations served via <span className="font-mono">GET /api/v1/gis/heatmap?project=&metric=</span> — server-side, cached with event invalidation, additive indexes justified by query plans (Part 86).
        </p>
      </div>
    </div>
  );
}

function BoqTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">BOQ / Location Mapping</h3>
        <p className="text-sm text-slate-500 mt-1">Quantities per zone / chainage · measured vs planned by location (drill-down Company → Project → WBS → Activity → BOQ → Transaction)</p>
      </div>
      <div className="divide-y divide-slate-200">
        {gisBoqLocations.map(b => {
          const pct = b.plannedQty > 0 ? (b.measuredQty / b.plannedQty) * 100 : 0;
          return (
            <div key={b.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    <span className="font-mono text-slate-500 mr-2">{b.boqItemCode}</span>
                    {b.boqItemName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {b.zoneName ? `Zone: ${b.zoneName}` : `Chainage: ${b.chainageFrom} → ${b.chainageTo}`}
                    {b.layerId ? ` · layer ${gisLayers.find(l => l.id === b.layerId)?.code}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{b.measuredQty} / {b.plannedQty} {b.uomName}</p>
                  <p className={`text-xs font-medium ${pct >= 95 ? 'text-green-600' : pct >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                    {pct.toFixed(0)}% measured
                  </p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${pct >= 95 ? 'bg-green-500' : pct >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LayersTab() {
  const layerStatusChip: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    superseded: 'bg-slate-100 text-slate-500'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">GIS Layers & Versioning</h3>
            <p className="text-sm text-slate-500 mt-1">Layer version lifecycle: DRAFT → APPROVED → SUPERSEDED (CP-GIS-02: approval before use)</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700">
            + Import GeoJSON / KML
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {gisLayers.map(layer => (
            <div key={layer.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-mono font-semibold text-emerald-700">{layer.code}</span>
                    <span className="text-xs text-slate-500">v{layer.version}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${layerStatusChip[layer.status]}`}>
                      {layer.status}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600 capitalize">
                      {layer.type.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                      source: {layer.source}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{layer.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {layer.projectName}{layer.siteId ? ` · ${layer.siteId}` : ''} · by {layer.createdByName}
                    {layer.approvedByName ? ` · approved by ${layer.approvedByName}` : ''}
                    {layer.supersededBy ? ` · superseded by ${layer.supersededBy}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-[10px] font-mono rounded ${
                    layer.geometryGeojson.startsWith('{') ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'
                  }`}>
                    {layer.geometryGeojson.length} bytes GeoJSON
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chainage refs */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Chainage References (Linear Referencing)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {gisChainageRefs.map(c => (
            <div key={c.id} className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs font-mono font-semibold text-emerald-700">CH {c.chainage}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">{c.lat.toFixed(4)}, {c.lng.toFixed(4)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProtocolTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Protocol Control Points — CP-GIS</h3>
        <p className="text-sm text-slate-500 mb-4">Registered with the Protocol & Control Engine (Part 7) · rollout OFF → OBSERVE → WARN → ENFORCE · deviations only through approved exceptions (PC-3)</p>
        <div className="space-y-3">
          {gisControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">{cp.stage}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded uppercase">{cp.status}</span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-2">Gate-status panel — CP-GIS evaluation (OBSERVE mode)</p>
          <div className="grid grid-cols-2 gap-2">
            {gisControlPoints.map(cp => (
              <div key={cp.id} className="p-2 bg-white rounded border border-slate-200">
                <p className="text-[10px] font-mono font-semibold text-slate-700">{cp.id}</p>
                <p className="text-[10px] text-green-600 font-medium mt-0.5">PASS</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-xs text-emerald-800">
            Every control point is evaluated server-side on all paths (UI, API, import, job, offline sync, AI draft) via <span className="font-mono">protocol.check()</span> and produces evaluation, exception, violation and action-ledger records (Part 10). Validations: valid GeoJSON; chainage ranges within alignment length; layer belongs to project. Coordinates stored in WGS84.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    amber: 'bg-amber-50 border-amber-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
