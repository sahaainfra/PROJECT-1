import { useState } from 'react';
import {
  widgetRegistry,
  kpiRegistry,
  defaultLayouts,
  widgetData,
  quickActions,
  protocolControlPoints,
  dashboardStats
} from '../data/dashboardData';

export function DashboardFramework() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('project_manager');

  const tabs = [
    { id: 'workspace', label: 'My Workspace', icon: '🏠' },
    { id: 'widgets', label: 'Widget Gallery', icon: '📊' },
    { id: 'kpis', label: 'KPI Registry', icon: '📈' },
    { id: 'layouts', label: 'Role Layouts', icon: '🎨' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Framework</h1>
          <p className="text-sm text-slate-500 mt-1">Part 14 — Advanced responsive dashboard with widgets, KPIs, and personalization</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            ff.dash
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'workspace' && <WorkspaceTab editMode={editMode} setEditMode={setEditMode} role={selectedRole} />}
      {activeTab === 'widgets' && <WidgetGalleryTab />}
      {activeTab === 'kpis' && <KPIRegistryTab />}
      {activeTab === 'layouts' && <RoleLayoutsTab selectedRole={selectedRole} setSelectedRole={setSelectedRole} />}
    </div>
  );
}

function WorkspaceTab({ editMode, setEditMode, role }: { editMode: boolean; setEditMode: (v: boolean) => void; role: string }) {
  const layout = defaultLayouts[role];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Personal Workspace</h3>
          <p className="text-sm text-slate-500">Role: {role.replace('_', ' ').toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              editMode
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {editMode ? '✓ Done Editing' : '✏️ Edit Layout'}
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            + Add Widget
          </button>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-12 gap-4">
        {layout.widgets.map((layoutWidget, idx) => {
          const widget = widgetRegistry.find(w => w.code === layoutWidget.widgetCode);
          if (!widget) return null;

          return (
            <div
              key={idx}
              className={`col-span-${layoutWidget.w} row-span-${layoutWidget.h} ${editMode ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
              style={{ gridColumn: `span ${layoutWidget.w} / span ${layoutWidget.w}` }}
            >
              <WidgetRenderer widget={widget} editMode={editMode} />
            </div>
          );
        })}
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {protocolControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                    {cp.stage}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                    {cp.status}
                  </span>
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

function WidgetRenderer({ widget, editMode }: { widget: any; editMode: boolean }) {
  const data = widgetData[widget.code as keyof typeof widgetData];

  if (widget.type === 'kpi') {
    const kpi = kpiRegistry.find(k => k.code === widget.code) || kpiRegistry[0];
    return <KPITile kpi={kpi} editMode={editMode} />;
  }

  if (widget.type === 'custom' && widget.code === 'quick-actions') {
    return <QuickActionsWidget editMode={editMode} />;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900">{widget.name}</h4>
        {editMode && (
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-slate-600">⚙️</button>
            <button className="p-1 text-slate-400 hover:text-red-600">×</button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {Array.isArray(data) && data.slice(0, 5).map((item: any, idx: number) => (
          <div key={idx} className="p-2 bg-slate-50 rounded text-xs">
            <p className="font-medium text-slate-900">{item.title || item.name || item.code}</p>
            {item.message && <p className="text-slate-600 mt-1">{item.message}</p>}
            {item.amount && <p className="text-slate-700 mt-1">₹{item.amount.toLocaleString()}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function KPITile({ kpi, editMode }: { kpi: any; editMode: boolean }) {
  const getStatusColor = (value: number, thresholds: any, direction: string) => {
    if (direction === 'higher_better') {
      if (value >= thresholds.green) return 'text-green-600';
      if (value >= thresholds.amber) return 'text-amber-600';
      return 'text-red-600';
    } else {
      if (value <= thresholds.green) return 'text-green-600';
      if (value <= thresholds.amber) return 'text-amber-600';
      return 'text-red-600';
    }
  };

  const trend = kpi.trend || [];
  const maxTrend = Math.max(...trend);
  const minTrend = Math.min(...trend);
  const trendRange = maxTrend - minTrend || 1;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-500 uppercase">{kpi.name}</h4>
        {editMode && (
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-slate-600">⚙️</button>
            <button className="p-1 text-slate-400 hover:text-red-600">×</button>
          </div>
        )}
      </div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className={`text-3xl font-bold ${getStatusColor(kpi.currentValue, kpi.thresholds, kpi.direction)}`}>
            {kpi.currentValue}{kpi.unit === '%' ? '%' : ''}
          </p>
          <p className="text-xs text-slate-500 mt-1">{kpi.unit !== '%' ? kpi.unit : ''}</p>
        </div>
        {kpi.previousValue && (
          <div className="text-right">
            <p className={`text-xs font-medium ${
              kpi.currentValue > kpi.previousValue ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.currentValue > kpi.previousValue ? '↑' : '↓'} {Math.abs(kpi.currentValue - kpi.previousValue)}
            </p>
            <p className="text-xs text-slate-400">vs previous</p>
          </div>
        )}
      </div>
      {/* Sparkline */}
      {trend.length > 0 && (
        <div className="h-12 flex items-end gap-1 mt-2">
          {trend.map((value: number, idx: number) => (
            <div
              key={idx}
              className="flex-1 bg-indigo-500 rounded-t"
              style={{ height: `${((value - minTrend) / trendRange) * 100}%` }}
            />
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
        <span>As of: {new Date(kpi.asOf).toLocaleDateString()}</span>
        {kpi.drillLink && <button className="text-indigo-600 hover:text-indigo-700">Drill →</button>}
      </div>
    </div>
  );
}

function QuickActionsWidget({ editMode }: { editMode: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900">Quick Actions</h4>
        {editMode && (
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-slate-600">⚙️</button>
            <button className="p-1 text-slate-400 hover:text-red-600">×</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map(action => (
          <button
            key={action.code}
            className={`p-3 rounded-lg border-2 border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors text-left`}
          >
            <div className="text-2xl mb-1">{action.icon}</div>
            <p className={`text-xs font-medium text-${action.color}-700`}>{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function WidgetGalleryTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Widget Gallery</h3>
        <p className="text-sm text-slate-600 mb-6">
          Available widgets for dashboard personalization. Click to add to your workspace.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgetRegistry.map(widget => (
            <div key={widget.code} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-900">{widget.name}</h4>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                  {widget.type}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">{widget.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Module: {widget.module}</span>
                <span>Refresh: {widget.refreshSeconds}s</span>
              </div>
              <button className="mt-3 w-full px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700">
                Add to Workspace
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPIRegistryTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">KPI Registry</h3>
        <p className="text-sm text-slate-600 mb-6">
          Key Performance Indicators with formulas, thresholds, and drill-down paths.
        </p>
        <div className="space-y-4">
          {kpiRegistry.map(kpi => (
            <div key={kpi.code} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{kpi.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">{kpi.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{kpi.currentValue}{kpi.unit}</p>
                  <p className="text-xs text-slate-500">Current Value</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                <div>
                  <span className="text-slate-500">Formula:</span>
                  <p className="text-slate-700 mt-1">{kpi.formulaDescription}</p>
                </div>
                <div>
                  <span className="text-slate-500">Thresholds:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">Red: {kpi.thresholds.red}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Amber: {kpi.thresholds.amber}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">Green: {kpi.thresholds.green}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Direction: {kpi.direction.replace('_', ' ')}</span>
                <span>Module: {kpi.ownerModule}</span>
                {kpi.drillLink && <button className="text-indigo-600 hover:text-indigo-700 font-medium">View Drill Path →</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoleLayoutsTab({ selectedRole, setSelectedRole }: { selectedRole: string; setSelectedRole: (v: string) => void }) {
  const layout = defaultLayouts[selectedRole];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Role Layout Designer</h3>
            <p className="text-sm text-slate-600">Configure default dashboard layouts for each role</p>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="project_manager">Project Manager</option>
            <option value="site_engineer">Site Engineer</option>
            <option value="management">Management</option>
          </select>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Layout Preview</h4>
          <div className="p-4 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
            <div className="grid grid-cols-12 gap-2">
              {layout.widgets.map((widget, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded border border-slate-300 p-2 text-xs text-center"
                  style={{ gridColumn: `span ${widget.w} / span ${widget.w}` }}
                >
                  {widget.widgetCode}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Widget Configuration</h4>
          <div className="space-y-2">
            {layout.widgets.map((widget, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-900 w-48">{widget.widgetCode}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Position:</span>
                  <span className="font-mono">({widget.x}, {widget.y})</span>
                  <span className="text-slate-500 ml-2">Size:</span>
                  <span className="font-mono">{widget.w}×{widget.h}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300">
                    Edit
                  </button>
                  <button className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Save Layout
          </button>
          <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
