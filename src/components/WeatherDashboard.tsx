import { useState } from 'react';
import {
  wxObservations,
  wxShutdowns,
  wxRestrictions,
  wxRestrictionWarnings,
  wxMonthlyHistory,
  wxControlPoints,
  wxStats,
  wxCurrentBySite
} from '../data/weatherData';

const conditionChip: Record<string, string> = {
  clear: 'bg-green-100 text-green-700',
  rain: 'bg-blue-100 text-blue-700',
  storm: 'bg-red-100 text-red-700',
  fog: 'bg-slate-100 text-slate-700',
  heat: 'bg-amber-100 text-amber-700'
};

const shutdownStatusChip: Record<string, string> = {
  recorded: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  linked_to_delay: 'bg-purple-100 text-purple-700'
};

export function WeatherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'observations', label: 'Observations' },
    { id: 'shutdowns', label: 'Shutdowns' },
    { id: 'restrictions', label: 'Restrictions' },
    { id: 'history', label: 'History & Analysis' },
    { id: 'protocol', label: 'Protocol Controls' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weather & Site Condition Management</h1>
          <p className="text-sm text-slate-500 mt-1">Part 31 — Rainfall, temperature, humidity, wind, shutdowns and concrete restrictions linked to DPR → Schedule → Delay → EOT</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
            ff.weather
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
                  ? 'bg-cyan-50 text-cyan-700 border-b-2 border-cyan-700'
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
      {activeTab === 'observations' && <ObservationsTab />}
      {activeTab === 'shutdowns' && <ShutdownsTab />}
      {activeTab === 'restrictions' && <RestrictionsTab />}
      {activeTab === 'history' && <HistoryTab />}
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
          title="Observations"
          value={wxStats.totalObservations}
          subtitle={`${wxStats.observationsToday} today · ${wxStats.providerObservations} from provider`}
          color="cyan"
        />
        <StatCard
          title="Weather Shutdowns"
          value={wxStats.totalShutdowns}
          subtitle={`${wxStats.approvedShutdowns} approved`}
          color="amber"
        />
        <StatCard
          title="Hours Lost"
          value={wxStats.totalHoursLost}
          subtitle={`${wxStats.linkedToDelay} shutdowns linked to delay (EOT evidence)`}
          color="red"
        />
        <StatCard
          title="Restriction Warnings"
          value={wxStats.restrictionWarnings + wxStats.restrictionBlocks}
          subtitle={`${wxStats.activeRestrictions} active rules`}
          color="purple"
        />
      </div>

      {/* Current weather card per site */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Weather by Site</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wxCurrentBySite.map(w => (
            <div key={w.siteId} className={`p-4 rounded-lg border ${
              w.concretingPermitted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{w.condition === 'clear' ? '☀️' : w.condition === 'rain' ? '🌧️' : '⛈️'}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${conditionChip[w.condition]}`}>
                  {w.condition}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{w.siteName}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-slate-500">Temp:</span>
                  <span className="ml-1 text-slate-700">{w.tempMin}–{w.tempMax} °C</span>
                </div>
                <div>
                  <span className="text-slate-500">Rain:</span>
                  <span className="ml-1 text-slate-700">{w.rainfallMm} mm</span>
                </div>
                <div>
                  <span className="text-slate-500">Humidity:</span>
                  <span className="ml-1 text-slate-700">{w.humidityPct} %</span>
                </div>
                <div>
                  <span className="text-slate-500">Wind:</span>
                  <span className="ml-1 text-slate-700">{w.windKmph} kmph</span>
                </div>
              </div>
              <p className="text-xs mt-2 font-medium">
                <span className={w.concretingPermitted ? 'text-green-700' : 'text-red-700'}>
                  {w.concretingPermitted ? 'Concreting permitted' : 'Concreting restricted (WXR)'}
                </span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">As of {new Date(w.asOf).toLocaleString()} · source: {w.source}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {wxControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded">{cp.stage}</span>
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

function ObservationsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Weather Observations Register</h3>
        <p className="text-sm text-slate-500 mt-1">One observation per site / time slot · provider data labelled source=provider and never overwrites manual observations · prefilled into DPR</p>
      </div>
      <div className="divide-y divide-slate-200">
        {wxObservations.map(o => (
          <div key={o.id} className="p-6 hover:bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${conditionChip[o.condition]}`}>
                    {o.condition}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    o.source === 'manual' ? 'bg-slate-100 text-slate-700' :
                    o.source === 'station' ? 'bg-blue-100 text-blue-700' :
                    'bg-violet-100 text-violet-700'
                  }`}>
                    source: {o.source}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600 capitalize">
                    {o.timeSlot}
                  </span>
                  {o.dprNo && (
                    <span className="text-xs font-mono text-sky-700">→ {o.dprNo}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-900">{o.siteName}</p>
                <p className="text-xs text-slate-500 mt-1">{o.date} · recorded by {o.recordedByName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Rainfall:</span>
                  <span className="ml-1 font-semibold text-slate-900">{o.rainfallMm} mm</span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Temp min/max:</span>
                  <span className="ml-1 font-semibold text-slate-900">{o.tempMin}/{o.tempMax} °C</span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Humidity:</span>
                  <span className="ml-1 font-semibold text-slate-900">{o.humidityPct} %</span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Wind:</span>
                  <span className="ml-1 font-semibold text-slate-900">{o.windKmph} kmph</span>
                </div>
              </div>
            </div>
            {o.remarks && (
              <p className="text-xs text-slate-600 mt-1">{o.remarks}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShutdownsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Weather Shutdown Register</h3>
          <p className="text-sm text-slate-500 mt-1">Lifecycle: RECORDED → APPROVED → LINKED_TO_DELAY · shutdowns above threshold auto-create delay events (Part 62) with evidence</p>
        </div>
        <div className="divide-y divide-slate-200">
          {wxShutdowns.map(s => (
            <div key={s.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-mono font-semibold text-cyan-700">{s.shutdownNo}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${shutdownStatusChip[s.status]}`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                    {s.dprNo && <span className="text-xs font-mono text-sky-700">→ {s.dprNo}</span>}
                    {s.delayEventId && <span className="text-xs font-mono text-purple-700">→ delay: {s.delayEventId}</span>}
                  </div>
                  <p className="text-sm font-medium text-slate-900">{s.siteName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleString()} · recorded by {s.recordedByName}
                    {s.approvedByName ? ` · approved by ${s.approvedByName}` : ''}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">{s.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{s.hoursLost}</p>
                  <p className="text-xs text-slate-500">hours lost</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Activities affected:</span>
                  <span className="ml-1 font-mono text-slate-700">{s.activitiesAffected.join(', ')}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500">Evidence documents:</span>
                  <span className="ml-1 font-mono text-slate-700">{s.evidenceDocIds.join(', ') || '—'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile quick entry preview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Mobile Quick Entry</h3>
        <p className="text-sm text-slate-500 mb-4">Shutdown with photos, GPS/time stamps and device ID — offline-capable through the field engine (Part 79)</p>
        <div className="max-w-sm mx-auto w-full bg-slate-100 rounded-2xl p-3 border border-slate-200">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3">
              <p className="text-sm font-semibold">Record Weather Shutdown</p>
              <p className="text-xs text-slate-400">Riverside Tower - Block B · now</p>
            </div>
            <div className="p-3 space-y-2">
              {['Start / end time', 'Reason (reason-code picker)', 'Hours lost (≤ shift hours)', 'Activities affected', 'Photos (GPS + time)', 'Submit — notifies PM, Planning, Contracts'].map((label, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-xs font-medium text-slate-900">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RestrictionsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Concreting & Activity Restrictions</h3>
          <p className="text-sm text-slate-500 mt-1">Rules warn when a WA for a restricted activity is issued under forecast/observed conditions (CP-WX-02)</p>
        </div>
        <div className="divide-y divide-slate-200">
          {wxRestrictions.map(r => (
            <div key={r.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-mono font-semibold text-cyan-700">{r.restrictionNo}</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700 capitalize">
                      {r.activityType}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded uppercase ${
                      r.enforcement === 'block' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.enforcement}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-900">{r.rule}</p>
                  <p className="text-xs text-slate-500 mt-1">Source: {r.source} · managed by QA/QC (wx.restriction.manage)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restriction warnings */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Restriction Warnings (CP-WX-02)</h3>
          <p className="text-sm text-slate-500 mt-1">Warnings issued to Site Engineer and QA/QC; blocks prevent WA issuance</p>
        </div>
        <div className="divide-y divide-slate-200">
          {wxRestrictionWarnings.map(w => (
            <div key={w.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  w.result === 'block' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {w.result === 'block' ? '✗' : '⚠'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">{w.restrictionNo}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded uppercase ${
                      w.result === 'block' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {w.result}
                    </span>
                    {w.waNo && <span className="text-xs font-mono text-teal-700">→ {w.waNo}</span>}
                  </div>
                  <p className="text-sm text-slate-700">{w.breachDetail}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {w.siteName} · {w.date} · observed: {w.conditionObserved}
                    {w.acknowledgedBy ? ` · acknowledged by ${w.acknowledgedBy}` : ' · awaiting acknowledgement'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryTab() {
  const maxRain = Math.max(...wxMonthlyHistory.map(h => h.totalRainfallMm));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Historic Weather Analysis per Site</h3>
        <p className="text-sm text-slate-500 mb-4">Rain days by month feeding schedule calendars (Part 26) and monsoon planning</p>
        <div className="space-y-6">
          {Array.from(new Set(wxMonthlyHistory.map(h => h.siteId))).map(siteId => (
            <div key={siteId}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {wxMonthlyHistory.find(h => h.siteId === siteId)?.siteName}
              </p>
              <div className="space-y-2">
                {wxMonthlyHistory.filter(h => h.siteId === siteId).map(h => (
                  <div key={h.month} className="flex items-center gap-3 text-xs">
                    <span className="w-16 text-slate-500 font-mono">{h.month}</span>
                    <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(h.totalRainfallMm / maxRain) * 100}%` }}
                      />
                    </div>
                    <span className="w-24 text-right text-slate-700 font-medium">{h.totalRainfallMm} mm</span>
                    <span className="w-20 text-right text-slate-500">{h.rainDays} rain days</span>
                    <span className="w-24 text-right text-red-600">{h.hoursLost} h lost</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Weather Register Extract for Claims (EOT Evidence)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Shutdown</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Site</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Period</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Hours Lost</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Delay Link</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {wxShutdowns.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-cyan-700">{s.shutdownNo}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{s.siteName}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">
                    {new Date(s.start).toLocaleDateString()} → {new Date(s.end).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-semibold text-red-600">{s.hoursLost}</td>
                  <td className="px-4 py-3 text-xs font-mono text-purple-700">{s.delayEventId || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${shutdownStatusChip[s.status]}`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Shutdown → DPR → Schedule → Delay → EOT evidence chain — weather-related delays are provable and planned around. Printing audited with letterhead, QR verification and signature blocks.
        </p>
      </div>
    </div>
  );
}

function ProtocolTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Protocol Control Points — CP-WX</h3>
      <p className="text-sm text-slate-500 mb-4">Registered with the Protocol & Control Engine (Part 7) · rollout OFF → OBSERVE → WARN → ENFORCE · deviations only through approved exceptions (PC-3)</p>
      <div className="space-y-3">
        {wxControlPoints.map(cp => (
          <div key={cp.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-2xl">🛡️</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded">{cp.stage}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded uppercase">{cp.status}</span>
              </div>
              <p className="text-sm text-slate-600">{cp.control}</p>
              <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
        <p className="text-xs text-cyan-800">
          Every control point is evaluated server-side on all paths (UI, API, import, job, offline sync, AI draft) via <span className="font-mono">protocol.check()</span>, visible through the Gate-status panel, and produces evaluation, exception, violation and action-ledger records (Part 10). Business rules: hours lost cannot exceed shift hours; one observation per site/time slot; value ranges validated (rainfall ≥ 0, humidity 0–100).
        </p>
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
    cyan: 'bg-cyan-50 border-cyan-200',
    amber: 'bg-amber-50 border-amber-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
