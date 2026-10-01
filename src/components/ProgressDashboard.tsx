import { useState } from 'react';
import {
  progressEntries,
  progressPeriods,
  progressSnapshots,
  progressWeights,
  sCurveData,
  productivityData,
  protocolControlPoints,
  progressStats,
  evmSummary
} from '../data/progressData';

export function ProgressDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'entries', label: 'Progress Entries', icon: '📝' },
    { id: 'scurve', label: 'S-Curves', icon: '📈' },
    { id: 'evm', label: 'Earned Value', icon: '💰' },
    { id: 'productivity', label: 'Productivity', icon: '⚡' },
    { id: 'periods', label: 'Period Close', icon: '🔒' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Progress Management</h1>
          <p className="text-sm text-slate-500 mt-1">Part 27 — Progress tracking with EVM, S-curves, and productivity analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            ff.prog
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
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-700'
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
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'entries' && <EntriesTab />}
      {activeTab === 'scurve' && <SCurveTab />}
      {activeTab === 'evm' && <EVMTab />}
      {activeTab === 'productivity' && <ProductivityTab />}
      {activeTab === 'periods' && <PeriodsTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Progress Entries"
          value={progressStats.totalEntries}
          subtitle={`${progressStats.verifiedEntries} verified`}
          icon="📝"
          color="green"
        />
        <StatCard
          title="Project Progress"
          value={`${progressStats.projectActualPct}%`}
          subtitle={`Planned: ${progressStats.projectPlannedPct}%`}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="SPI"
          value={progressStats.currentSPI.toFixed(2)}
          subtitle={progressStats.currentSPI >= 1 ? 'On Schedule' : 'Behind Schedule'}
          icon="⏱️"
          color={progressStats.currentSPI >= 1 ? 'green' : 'red'}
        />
        <StatCard
          title="CPI"
          value={progressStats.currentCPI.toFixed(2)}
          subtitle={progressStats.currentCPI >= 1 ? 'Under Budget' : 'Over Budget'}
          icon="💰"
          color={progressStats.currentCPI >= 1 ? 'green' : 'red'}
        />
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Progress Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-2">Planned Progress</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${progressStats.projectPlannedPct}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-900">{progressStats.projectPlannedPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Actual Progress</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${progressStats.projectActualPct}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-900">{progressStats.projectActualPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Forecast Progress</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${progressStats.projectForecastPct}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-900">{progressStats.projectForecastPct}%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500">Schedule Variance</p>
              <p className={`text-lg font-bold ${progressStats.currentSV >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(progressStats.currentSV / 100000).toFixed(1)} L
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Cost Variance</p>
              <p className={`text-lg font-bold ${progressStats.currentCV >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(progressStats.currentCV / 100000).toFixed(1)} L
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">EAC</p>
              <p className="text-lg font-bold text-slate-900">₹{(progressStats.eac / 10000000).toFixed(2)} Cr</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">VAC</p>
              <p className={`text-lg font-bold ${progressStats.vac >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(progressStats.vac / 100000).toFixed(1)} L
              </p>
            </div>
          </div>
        </div>
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
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
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

function EntriesTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Entries"
          value={progressStats.totalEntries}
          subtitle="All sources"
          icon="📝"
          color="blue"
        />
        <StatCard
          title="Verified"
          value={progressStats.verifiedEntries}
          subtitle="Approved"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Pending"
          value={progressStats.pendingVerification}
          subtitle="Awaiting verification"
          icon="⏳"
          color="amber"
        />
      </div>

      {/* Progress Entries */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Progress Entries</h3>
          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            + New Entry
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Activity</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Qty Done</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">UOM</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">% Complete</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Entered By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {progressEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{new Date(entry.date).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-mono text-green-700">{entry.activityCode}</p>
                      <p className="text-sm text-slate-900">{entry.activityName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">{entry.qtyDone.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{entry.uomName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${entry.pctComplete}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700 w-10">{entry.pctComplete}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      entry.source === 'DPR' ? 'bg-blue-100 text-blue-700' :
                      entry.source === 'MB' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      entry.status === 'verified' ? 'bg-green-100 text-green-700' :
                      entry.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{entry.enteredByName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SCurveTab() {
  const maxPct = 100;

  return (
    <div className="space-y-6">
      {/* S-Curve Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">S-Curve: Planned vs Actual vs Forecast</h3>
        <div className="h-96 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-slate-500">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full border-l border-b border-slate-300 relative">
            {/* Grid lines */}
            {[25, 50, 75].map(pct => (
              <div
                key={pct}
                className="absolute left-0 right-0 border-t border-slate-200 border-dashed"
                style={{ bottom: `${pct}%` }}
              />
            ))}

            {/* Planned curve (blue) */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={sCurveData.map((d, i) => 
                  `${(i / (sCurveData.length - 1)) * 100}%,${100 - d.planned}%`
                ).join(' ')}
              />
            </svg>

            {/* Actual curve (green) */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                points={sCurveData.filter(d => d.actual !== null).map((d, i) => 
                  `${(i / (sCurveData.filter(x => x.actual !== null).length - 1)) * 100}%,${100 - (d.actual ?? 0)}%`
                ).join(' ')}
              />
            </svg>

            {/* Forecast curve (purple, dashed) */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="5,5"
                points={sCurveData.map((d, i) => 
                  `${(i / (sCurveData.length - 1)) * 100}%,${100 - d.forecast}%`
                ).join(' ')}
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="ml-12 mt-2 flex justify-between text-xs text-slate-500">
            {sCurveData.filter((_, i) => i % 2 === 0).map(d => (
              <span key={d.period}>{d.period}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-sm text-slate-700">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-sm text-slate-700">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-500 border-dashed"></div>
            <span className="text-sm text-slate-700">Forecast</span>
          </div>
        </div>
      </div>

      {/* S-Curve Data Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">S-Curve Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Period</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Planned %</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Actual %</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Forecast %</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sCurveData.map((data, idx) => {
                const variance = data.actual !== null ? data.actual - data.planned : null;
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{data.period}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-blue-700 font-medium">{data.planned}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-green-700 font-medium">
                        {data.actual !== null ? `${data.actual}%` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-purple-700 font-medium">{data.forecast}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {variance !== null && (
                        <span className={`text-sm font-semibold ${
                          variance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {variance >= 0 ? '+' : ''}{variance}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EVMTab() {
  return (
    <div className="space-y-6">
      {/* EVM Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">BAC (Budget at Completion)</p>
          <p className="text-xl font-bold text-slate-900">₹{(evmSummary.bac / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">EAC (Estimate at Completion)</p>
          <p className="text-xl font-bold text-slate-900">₹{(evmSummary.eac / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">ETC (Estimate to Complete)</p>
          <p className="text-xl font-bold text-slate-900">₹{(evmSummary.etc / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">VAC (Variance at Completion)</p>
          <p className={`text-xl font-bold ${evmSummary.vac >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{(evmSummary.vac / 100000).toFixed(1)} L
          </p>
        </div>
      </div>

      {/* EVM Metrics */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Earned Value Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 mb-1">PV (Planned Value)</p>
            <p className="text-2xl font-bold text-blue-900">₹{(evmSummary.pv / 10000000).toFixed(2)} Cr</p>
            <p className="text-xs text-blue-600 mt-1">Budgeted cost of work scheduled</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">EV (Earned Value)</p>
            <p className="text-2xl font-bold text-green-900">₹{(evmSummary.ev / 10000000).toFixed(2)} Cr</p>
            <p className="text-xs text-green-600 mt-1">Budgeted cost of work performed</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 mb-1">AC (Actual Cost)</p>
            <p className="text-2xl font-bold text-purple-900">₹{(evmSummary.ac / 10000000).toFixed(2)} Cr</p>
            <p className="text-xs text-purple-600 mt-1">Actual cost of work performed</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">SV (Schedule Variance)</p>
            <p className={`text-2xl font-bold ${evmSummary.sv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{(evmSummary.sv / 100000).toFixed(1)} L
            </p>
            <p className="text-xs text-slate-600 mt-1">EV - PV</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">CV (Cost Variance)</p>
            <p className={`text-2xl font-bold ${evmSummary.cv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{(evmSummary.cv / 100000).toFixed(1)} L
            </p>
            <p className="text-xs text-slate-600 mt-1">EV - AC</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">TCPI (To-Complete Performance Index)</p>
            <p className="text-2xl font-bold text-slate-900">{evmSummary.tcpi.toFixed(2)}</p>
            <p className="text-xs text-slate-600 mt-1">(BAC - EV) / (BAC - AC)</p>
          </div>
        </div>
      </div>

      {/* Performance Indices */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Indices</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">SPI (Schedule Performance Index)</span>
              <span className={`text-2xl font-bold ${evmSummary.spi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                {evmSummary.spi.toFixed(2)}
              </span>
            </div>
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${evmSummary.spi >= 1 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(evmSummary.spi * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">EV / PV = {evmSummary.ev.toLocaleString()} / {evmSummary.pv.toLocaleString()}</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">CPI (Cost Performance Index)</span>
              <span className={`text-2xl font-bold ${evmSummary.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                {evmSummary.cpi.toFixed(2)}
              </span>
            </div>
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${evmSummary.cpi >= 1 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(evmSummary.cpi * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">EV / AC = {evmSummary.ev.toLocaleString()} / {evmSummary.ac.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* EVM History */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">EVM History by Period</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Period</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Planned %</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Actual %</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">PV</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">EV</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">AC</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">SPI</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">CPI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {progressSnapshots.map(snapshot => (
                <tr key={snapshot.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">{snapshot.periodName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-blue-700">{snapshot.plannedPct}%</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-green-700">{snapshot.actualPct}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">₹{(snapshot.pv / 10000000).toFixed(2)} Cr</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">₹{(snapshot.ev / 10000000).toFixed(2)} Cr</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">₹{(snapshot.ac / 10000000).toFixed(2)} Cr</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${snapshot.spi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {snapshot.spi.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${snapshot.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {snapshot.cpi.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductivityTab() {
  return (
    <div className="space-y-6">
      {/* Productivity Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Above Norm"
          value={productivityData.filter(p => p.status === 'above').length}
          subtitle="Productive activities"
          icon="📈"
          color="green"
        />
        <StatCard
          title="On Target"
          value={productivityData.filter(p => p.status === 'on_target').length}
          subtitle="As per norm"
          icon="✓"
          color="blue"
        />
        <StatCard
          title="Below Norm"
          value={productivityData.filter(p => p.status === 'below').length}
          subtitle="Needs attention"
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Productivity Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Productivity Analysis</h3>
          <p className="text-sm text-slate-500 mt-1">Actual vs norm productivity by activity and trade</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Trade</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Output</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Man-Days</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Actual Prod.</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Norm Prod.</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Variance</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {productivityData.map(prod => (
                <tr key={prod.activityId} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-mono text-green-700">{prod.activityCode}</p>
                      <p className="text-sm text-slate-900">{prod.activityName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{prod.trade}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-900">{prod.outputQty} {prod.outputUom}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">{prod.inputManDays}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">{prod.actualProductivity}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">{prod.normProductivity}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${
                      prod.variancePct > 0 ? 'text-green-600' :
                      prod.variancePct < 0 ? 'text-red-600' :
                      'text-slate-700'
                    }`}>
                      {prod.variancePct > 0 ? '+' : ''}{prod.variancePct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      prod.status === 'above' ? 'bg-green-100 text-green-700' :
                      prod.status === 'on_target' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {prod.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PeriodsTab() {
  return (
    <div className="space-y-6">
      {/* Period Summary */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Open Periods"
          value={progressStats.openPeriods}
          subtitle="Active for entry"
          icon="🔓"
          color="green"
        />
        <StatCard
          title="Closed Periods"
          value={progressStats.closedPeriods}
          subtitle="Locked"
          icon="🔒"
          color="blue"
        />
      </div>

      {/* Period List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Progress Periods</h3>
          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Close Period
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {progressPeriods.map(period => (
            <div key={period.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      period.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {period.status}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded capitalize">
                      {period.periodType}
                    </span>
                  </div>
                  {period.closedBy && (
                    <p className="text-xs text-slate-500">
                      Closed by {period.closedBy} on {new Date(period.closedAt!).toLocaleString()}
                    </p>
                  )}
                </div>
                {period.status === 'open' && (
                  <button className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700">
                    Close Period
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period Close Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-amber-900 mb-2">Period Close Process</h4>
        <ul className="space-y-1 text-xs text-amber-800">
          <li>• All progress entries for the period must be verified</li>
          <li>• DPR completeness check required</li>
          <li>• EVM calculations performed automatically</li>
          <li>• Period snapshot created and locked</li>
          <li>• Reopening requires Management approval with reason</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
