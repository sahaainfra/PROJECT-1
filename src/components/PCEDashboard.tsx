import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import {
  pceFacts,
  pceVariances,
  pceReconciliations,
  pceRefreshLog,
  pceMeasureDefinitions,
  pceControlPoints,
  pceStats
} from '../data/pceData';
import type { PceMeasureGroup, PceFact, PceVariance } from '../data/pceData';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
const fmtUnit = (n: number, unit: string) =>
  unit === 'INR' ? fmt(n) : `${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ${unit}`;

// Field-level masking per measure group (section 6): cost measures require bud.cost.view;
// billing measures require commercial/finance view; site users see quantity/hours only.
const maskedGroups: PceMeasureGroup[] = ['cost', 'procurement', 'billing'];

const varianceTypeLabel: Record<string, string> = {
  quantity: 'Quantity variance',
  cost: 'Cost variance (earned − actual)',
  schedule: 'Schedule variance (earned − planned)',
  productivity: 'Productivity variance',
  commitment_coverage: 'Commitment coverage (committed / budget)',
  billing_lag: 'Billing lag (earned − certified)'
};

export function PCEDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewerRole, setViewerRole] = useState<'commercial' | 'site'>('commercial');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'control', label: 'Control View' },
    { id: 'variance', label: 'Variance Analysis' },
    { id: 'refresh', label: 'Refresh & Reconciliation' },
    { id: 'dictionary', label: 'Measure Dictionary' },
    { id: 'protocol', label: 'Protocol Controls' }
  ];

  const masked = viewerRole === 'site';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planned vs Budgeted vs Actual Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Part 33 — Project Control Engine: Planned → Budgeted → Committed → Actual → Earned → Forecast — the only data source for control dashboards, Project 360, control towers and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full border border-violet-200">ff.pce</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">Active</span>
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
                  ? 'bg-violet-50 text-violet-700 border-b-2 border-violet-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab masked={masked} />}
      {activeTab === 'control' && <ControlViewTab masked={masked} />}
      {activeTab === 'variance' && <VarianceTab />}
      {activeTab === 'refresh' && <RefreshTab />}
      {activeTab === 'dictionary' && <DictionaryTab />}
      {activeTab === 'protocol' && <ProtocolTab masked={masked} />}

      {/* Role context switcher (field-level masking demo) */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Viewer role (field-level masking per measure group)</label>
          <select
            value={viewerRole}
            onChange={(e) => setViewerRole(e.target.value as 'commercial' | 'site')}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="commercial">Commercial / Finance viewer (cost + billing visible)</option>
            <option value="site">Site viewer (cost + billing masked)</option>
          </select>
        </div>
        <p className="text-xs text-slate-500 flex-1 min-w-[240px]">
          {masked
            ? 'Masked groups for this role: cost, procurement, billing — hidden in UI, API, exports, search, notifications and AI context (SA-5). Quantity/hours measures visible.'
            : 'Unmasked: all 8 measure groups visible. Masking is enforced at data access, not just UI.'}
        </p>
      </div>
    </div>
  );
}

function OverviewTab({ masked }: { masked: boolean }) {
  const costFacts = pceFacts.filter(f => f.measureGroup === 'cost');
  const total = (k: 'planned' | 'budgeted' | 'committed' | 'actual' | 'earned' | 'forecast') =>
    costFacts.reduce((s, f) => s + f[k], 0);

  return (
    <div className="space-y-6">
      {/* Engine totals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <EngineCard title="Planned" value={masked ? '•••' : fmt(total('planned'))} color="slate" />
        <EngineCard title="Budgeted" value={masked ? '•••' : fmt(total('budgeted'))} color="blue" />
        <EngineCard title="Committed" value={masked ? '•••' : fmt(total('committed'))} color="amber" />
        <EngineCard title="Actual" value={masked ? '•••' : fmt(total('actual'))} color="emerald" />
        <EngineCard title="Earned" value={masked ? '•••' : fmt(total('earned'))} color="violet" />
        <EngineCard title="Forecast" value={masked ? '•••' : fmt(total('forecast'))} color="rose" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Fact rows (sample)" value={pceStats.factsRows} subtitle="8 measure groups · PC-14 dimensions" color="blue" />
        <StatCard title="Open variance alerts" value={pceStats.openVariances} subtitle={`${pceStats.varianceCount} variance rows · 6 calculators`} color="amber" />
        <StatCard title="Reconciliation differences" value={pceStats.reconciliationDifferences} subtitle="tolerance 0 vs GL (finance live)" color="rose" />
        <StatCard title="Last incremental refresh" value="08:30" subtitle={`${pceStats.lastRefreshRows} rows · 12s · ${pceStats.refreshSuccessRate}% success rate`} color="violet" />
      </div>

      {/* Engine principles */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Engine Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Read-model only</p>
            <p className="font-semibold text-slate-900">never writes to source modules</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Actual data</p>
            <p className="font-semibold text-slate-900">approved/posted only; draft excluded (PROVISIONAL flag optional)</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Refresh</p>
            <p className="font-semibold text-slate-900">incremental on events (debounced per project) + nightly full + on-demand</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Periods</p>
            <p className="font-semibold text-slate-900">by project calendar; FY for financial aggregation</p>
          </div>
        </div>
      </div>

      {/* Control points */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {pceControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded">{cp.stage}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded uppercase">{cp.status}</span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement} · Escalation: {cp.escalation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlViewTab({ masked }: { masked: boolean }) {
  const [measureGroup, setMeasureGroup] = useState<PceMeasureGroup>('cost');
  const [wbsFilter, setWbsFilter] = useState('all');
  const [selectedFact, setSelectedFact] = useState<string | null>(null);

  const facts = pceFacts.filter(f =>
    f.measureGroup === measureGroup && (wbsFilter === 'all' || f.wbsNodeId === wbsFilter)
  );

  // Pivot rows: WBS/cost code; columns: planned/budgeted/committed/actual/earned/forecast
  const pivot = Object.values(
    facts.reduce<Record<string, { key: string; wbsNodeId: string; wbsName: string; costCodeId: string; planned: number; budgeted: number; committed: number; actual: number; earned: number; forecast: number }>>((acc, f) => {
      const key = `${f.wbsNodeId}|${f.costCodeId}`;
      if (!acc[key]) acc[key] = { key, wbsNodeId: f.wbsNodeId, wbsName: f.wbsName, costCodeId: f.costCodeId, planned: 0, budgeted: 0, committed: 0, actual: 0, earned: 0, forecast: 0 };
      acc[key].planned += f.planned;
      acc[key].budgeted += f.budgeted;
      acc[key].committed += f.committed;
      acc[key].actual += f.actual;
      acc[key].earned += f.earned;
      acc[key].forecast += f.forecast;
      return acc;
    }, {})
  );

  const selected = pceFacts.find(f => f.id === selectedFact) || null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Measure group</label>
            <select
              value={measureGroup}
              onChange={(e) => { setMeasureGroup(e.target.value as PceMeasureGroup); setSelectedFact(null); }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="cost">Cost</option>
              <option value="quantity">Quantity</option>
              <option value="labour_hours">Labour hours</option>
              <option value="plant_hours">Plant hours</option>
              <option value="material_qty">Material qty</option>
              <option value="procurement">Procurement</option>
              <option value="billing">Billing</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">WBS filter</label>
            <select
              value={wbsFilter}
              onChange={(e) => { setWbsFilter(e.target.value); setSelectedFact(null); }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All WBS nodes</option>
              <option value="wbs_1.2">wbs_1.2 — Foundations</option>
              <option value="wbs_1.3">wbs_1.3 — RCC Frame</option>
              <option value="wbs_1.4">wbs_1.4 — Masonry & Finishing</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 flex-1 min-w-[220px]">
            Query API: <span className="font-mono">GET /api/v1/pce/facts?project=&dims=&measures=&period=</span> — dimensions (project, site, WBS level, activity, BOQ item, cost code, resource type, period), SA-18 labels and drill links.
          </p>
        </div>
      </div>

      {/* Pivot grid */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Control View — pivot grid</h3>
        <p className="text-sm text-slate-500 mb-4">Rows: WBS / cost code · Columns: planned / budgeted / committed / actual / earned / forecast · period 2025-11 (Riverside Tower — Phase II)</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">WBS / Cost Code</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Planned</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Budgeted</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Committed</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Actual</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Earned</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Forecast</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Why?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pivot.map(row => {
                return (
                  <tr key={row.key} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm">
                      <span className="font-medium text-slate-900">{row.wbsName}</span>
                      <span className="text-xs font-mono text-slate-400 ml-2">{row.costCodeId}</span>
                    </td>
                    {(['planned', 'budgeted', 'committed', 'actual', 'earned', 'forecast'] as const).map(k => {
                      const isMasked = masked && maskedGroups.includes(measureGroup);
                      return (
                        <td key={k} className="px-4 py-3 text-right text-sm text-slate-700">
                          {isMasked ? '•••' : fmt(row[k])}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedFact(facts.find(f => f.wbsNodeId === row.wbsNodeId && f.costCodeId === row.costCodeId)?.id || null)}
                        className="px-2 py-1 text-xs font-semibold rounded bg-violet-100 text-violet-700 hover:bg-violet-200"
                      >
                        Why?
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pivot.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-400">No facts for this measure group / filter (empty state).</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Cost variance (earned − actual) shown per drill-down · variance API: <span className="font-mono">GET /api/v1/pce/variance?project=&type=</span> · drill to source list on every KPI.
        </p>
      </div>

      {/* Why? drill-down panel */}
      {selected && (
        <div className="bg-white rounded-lg border border-violet-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Why? — drill to source list</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 text-xs mb-1">WBS / Activity</p>
              <p className="font-semibold text-slate-900">{selected.wbsName} · {selected.activityId}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 text-xs mb-1">BOQ item</p>
              <p className="font-semibold text-slate-900">{selected.boqItemId}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 text-xs mb-1">Period / source version</p>
              <p className="font-semibold text-slate-900">{selected.period} · {selected.sourceVersion}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-500 text-xs mb-1">Refreshed at</p>
              <p className="font-semibold text-slate-900">{new Date(selected.refreshedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.sources.map(s => (
              <span key={s} className="px-2 py-1 text-xs font-mono rounded bg-slate-100 text-slate-700 border border-slate-200">{s}</span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Drill-down: KPI → document → transaction → source evidence. The engine is a read-model over existing records, never a replacement.</p>
        </div>
      )}
    </div>
  );
}

function VarianceTab() {
  const [selected, setSelected] = useState<string | null>('pcev_009');
  const chartData = pceVariances.filter(v => v.type === 'cost' || v.type === 'schedule').map(v => ({
    name: `${v.wbsName} (${v.type})`,
    value: v.value,
    favourable: v.status === 'favourable'
  }));
  const sel = pceVariances.find(v => v.id === selected) || null;

  return (
    <div className="space-y-6">
      {/* Variance calculators */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Variance Analysis</h3>
        <p className="text-sm text-slate-500 mb-4">Six calculators per WBS: quantity, cost, schedule, productivity, commitment coverage, billing lag · every variance drills to source transactions</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend />
                <Bar dataKey="value" name="Variance (INR)" radius={[4, 4, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.favourable ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">WBS</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Value</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Why?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pceVariances.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(v.id)}>
                    <td className="px-3 py-2 text-sm font-medium text-slate-900">{v.wbsName}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{varianceTypeLabel[v.type]}</td>
                    <td className="px-4 py-2 text-right text-sm font-semibold text-slate-900">
                      {v.value > 0 && v.unit !== '%' ? '+' : ''}{fmtUnit(v.value, v.unit)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        v.status === 'favourable' ? 'bg-green-100 text-green-700' :
                        v.status === 'adverse' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(v.id); }}
                        className={`px-2 py-1 text-xs font-semibold rounded ${selected === v.id ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`}
                      >
                        Why?
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Selected variance drill */}
      {sel && <VarianceDrill v={sel} />}
    </div>
  );
}

function VarianceDrill({ v }: { v: PceVariance }) {
  return (
    <div className="bg-white rounded-lg border border-violet-200 p-6">
      <h4 className="text-sm font-semibold text-slate-900 mb-3">Why? — {varianceTypeLabel[v.type]} on {v.wbsName}</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Value</p>
          <p className="font-semibold text-slate-900">{fmtUnit(v.value, v.unit)}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Status / threshold</p>
          <p className="font-semibold text-slate-900">{v.status} · threshold {v.unit === 'INR' ? fmt(v.threshold) : `${v.threshold}${v.unit === '%' ? '%' : ' ' + v.unit}`}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Alert</p>
          <p className={`font-semibold ${v.alert ? 'text-red-600' : 'text-slate-900'}`}>{v.alert ? 'ALERT raised (Part 76)' : 'No alert'}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Project</p>
          <p className="font-semibold text-slate-900">Riverside Tower - Phase II</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {v.sources.map(s => (
          <span key={s} className="px-2 py-1 text-xs font-mono rounded bg-slate-100 text-slate-700 border border-slate-200">{s}</span>
        ))}
      </div>
    </div>
  );
}

function RefreshTab() {
  return (
    <div className="space-y-6">
      {/* Refresh log */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Refresh Orchestrator — log</h3>
            <p className="text-sm text-slate-500 mt-1">Incremental on events (debounced per project) + nightly full rebuild + on-demand per project · refresh failure is a violation (CP-PCE-01)</p>
          </div>
          <button className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700">Rebuild project now</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Run</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Scope</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Trigger</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Rows</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Started / Finished</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pceRefreshLog.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-violet-700">{r.runId}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.scope}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600 capitalize">{r.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.trigger}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{r.rows.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(r.startedAt).toLocaleString()}{r.finishedAt ? ` → ${new Date(r.finishedAt).toLocaleTimeString()}` : ' → …'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      r.status === 'completed' ? 'bg-green-100 text-green-700' :
                      r.status === 'running' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.status}
                    </span>
                    {r.status === 'failed' && <p className="text-[10px] text-red-600 mt-1 max-w-[220px]">{r.error}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reconciliation */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Reconciliation — engine vs module vs GL</h3>
        <p className="text-sm text-slate-500 mb-4">Tolerance 0 for cost totals vs GL (after finance live); any difference raises a data-quality alert · BLOCK at period close (CP-PCE-02)</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Scope</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Engine Total</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Module Total</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Module Ref</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Difference</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pceReconciliations.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 capitalize">{r.scope.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{fmt(r.engineTotal)}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{fmt(r.moduleTotal)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.moduleRef}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    <span className={r.difference === 0 ? 'text-green-600' : 'text-red-600'}>{r.difference === 0 ? '0' : fmt(r.difference)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${r.status === 'match' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.status === 'match' ? 'MATCH' : 'DIFFERENCE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Reconciliation API: <span className="font-mono">GET /api/v1/pce/reconciliation?project=</span> · refresh: <span className="font-mono">POST /api/v1/pce/refresh</span> (permission <span className="font-mono">pce.refresh.run</span> — Planning/Finance leads, Super Admin) · differences notify Planning/Finance leads + Super Admin (Critical level, cannot be muted).
        </p>
      </div>
    </div>
  );
}

function DictionaryTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Measure Dictionary</h3>
      <p className="text-sm text-slate-500 mb-4">Published in KPI_CATALOGUE.md with formulas · SA-18 data labels · sources per measure</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Measure Group</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Column</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Definition</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Formula</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Data Label</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pceMeasureDefinitions.map(m => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">{m.measureGroup.replace('_', ' ')}</span>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-slate-700">{m.column}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{m.definition}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{m.source}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-600">{m.formula}</td>
                <td className="px-4 py-3 text-xs font-semibold text-slate-900">{m.dataLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProtocolTab({ masked }: { masked: boolean }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Protocol Control Points — CP-PCE</h3>
        <p className="text-sm text-slate-500 mb-4">Registered with the Protocol & Control Engine (Part 7) · rollout OFF → OBSERVE → WARN → ENFORCE · deviations only through approved exceptions (PC-3)</p>
        <div className="space-y-3">
          {pceControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded">{cp.stage}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded uppercase">{cp.status}</span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement} · Evidence: {cp.evidence} · Escalation: {cp.escalation}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-2">Gate-status panel — CP-PCE evaluation (OBSERVE mode)</p>
          <div className="grid grid-cols-2 gap-2">
            {pceControlPoints.map(cp => (
              <div key={cp.id} className="p-2 bg-white rounded border border-slate-200">
                <p className="text-[10px] font-mono font-semibold text-slate-700">{cp.id}</p>
                <p className="text-[10px] text-green-600 font-medium mt-0.5">PASS</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
          <p className="text-xs text-violet-800">
            Every control point is evaluated server-side on all paths (UI, API, job, offline sync, AI draft) via <span className="font-mono">protocol.check()</span> and produces evaluation, exception, violation and action-ledger records (Part 10). CP-PCE-02 blocks period close while reconciliation differences exist. Permission-aware measure masking {masked ? 'is ACTIVE for the selected site-viewer role' : '(switch viewer role below the tabs to see the masked view)'} — cost measures require <span className="font-mono">bud.cost.view</span>, billing measures require commercial/finance view.
          </p>
        </div>
      </div>
    </div>
  );
}

function EngineCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    slate: 'bg-slate-50 border-slate-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    violet: 'bg-violet-50 border-violet-200',
    rose: 'bg-rose-50 border-rose-200'
  };
  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
      <p className="text-[10px] text-slate-600 mt-0.5">{title}</p>
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
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    rose: 'bg-rose-50 border-rose-200',
    violet: 'bg-violet-50 border-violet-200'
  };
  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
