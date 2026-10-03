import { useState } from 'react';
import {
  workAuthorisations,
  verificationChecks,
  protocolControlPoints,
  waStats,
  balanceSummary
} from '../data/workAuthorisationData';

export function WorkAuthorisationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWA, setSelectedWA] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'board', label: 'WA Board', icon: '📋' },
    { id: 'details', label: 'WA Details', icon: '🔍' },
    { id: 'verification', label: 'Verification', icon: '✓' },
    { id: 'balance', label: 'Balance Tracking', icon: '⚖️' },
    { id: 'closure', label: 'Closure & Variance', icon: '🔒' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Authorisation & Plan-Before-Execute</h1>
          <p className="text-sm text-slate-500 mt-1">Part 29 — Enforce "no plan, no work" with approved WAs for all site execution</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
            ff.wa
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
                  ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-700'
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
      {activeTab === 'board' && <BoardTab selectedWA={selectedWA} setSelectedWA={setSelectedWA} />}
      {activeTab === 'details' && <DetailsTab selectedWA={selectedWA} setSelectedWA={setSelectedWA} />}
      {activeTab === 'verification' && <VerificationTab />}
      {activeTab === 'balance' && <BalanceTab selectedWA={selectedWA} setSelectedWA={setSelectedWA} />}
      {activeTab === 'closure' && <ClosureTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total WAs"
          value={waStats.totalWAs}
          subtitle={`${waStats.activeWAs} active`}
          icon="📋"
          color="teal"
        />
        <StatCard
          title="Pending Approval"
          value={waStats.submittedWAs}
          subtitle="Awaiting review"
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="WA Lines"
          value={waStats.totalLines}
          subtitle={`${waStats.totalReservations} reservations`}
          icon="📝"
          color="blue"
        />
        <StatCard
          title="Balance Utilisation"
          value={`${balanceSummary.utilisationPct.toFixed(1)}%`}
          subtitle={`${balanceSummary.totalConsumed} / ${balanceSummary.totalAuthorised}`}
          icon="⚖️"
          color="green"
        />
      </div>

      {/* WA Status Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Work Authorisation Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Draft</p>
            <p className="text-2xl font-bold text-slate-900">{waStats.draftWAs}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 mb-1">Submitted</p>
            <p className="text-2xl font-bold text-amber-900">{waStats.submittedWAs}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-blue-900">{waStats.approvedWAs}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-900">{waStats.activeWAs}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 mb-1">Closed</p>
            <p className="text-2xl font-bold text-purple-900">{waStats.closedWAs}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 mb-1">Expired</p>
            <p className="text-2xl font-bold text-red-900">{waStats.expiredWAs}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Budget Pass</p>
            <p className="text-2xl font-bold text-green-900">{waStats.budgetCheckPass}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 mb-1">Budget Warn</p>
            <p className="text-2xl font-bold text-amber-900">{waStats.budgetCheckWarn}</p>
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
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded">
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

      {/* Today's WAs */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Today's Work Authorisations</h3>
        <div className="space-y-3">
          {workAuthorisations.filter(wa => wa.date === '2026-01-16').map(wa => (
            <div key={wa.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono font-semibold text-teal-700">{wa.waNo}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      wa.status === 'active' ? 'bg-green-100 text-green-700' :
                      wa.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      wa.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {wa.status}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      wa.budgetCheckResult === 'pass' ? 'bg-green-100 text-green-700' :
                      wa.budgetCheckResult === 'warn' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Budget: {wa.budgetCheckResult}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{wa.activityName}</p>
                  <p className="text-xs text-slate-500 mt-1">{wa.workFrontName} • {wa.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{wa.shift}</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(wa.validFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(wa.validTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Responsible:</span>
                  <span className="ml-1 text-slate-700">{wa.responsibleName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Supervisor:</span>
                  <span className="ml-1 text-slate-700">{wa.supervisorName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Lines:</span>
                  <span className="ml-1 text-slate-700">{wa.lines.length} resources</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BoardTab({ selectedWA, setSelectedWA }: { selectedWA: string | null; setSelectedWA: (id: string | null) => void }) {
  const todaysWAs = workAuthorisations.filter(wa => wa.date === '2026-01-16');

  return (
    <div className="space-y-6">
      {/* WA Board */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Work Authorisation Board - 2026-01-16</h3>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
            + Generate WA from Plan
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaysWAs.map(wa => (
            <div
              key={wa.id}
              onClick={() => setSelectedWA(wa.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedWA === wa.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 bg-white hover:border-teal-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold text-teal-700">{wa.waNo}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      wa.status === 'active' ? 'bg-green-100 text-green-700' :
                      wa.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      wa.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {wa.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{wa.activityName}</p>
                  <p className="text-xs text-slate-500">{wa.workFrontName}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Shift:</span>
                  <span className="text-slate-700 font-medium capitalize">{wa.shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="text-slate-700">
                    {new Date(wa.validFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(wa.validTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Responsible:</span>
                  <span className="text-slate-700">{wa.responsibleName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Lines:</span>
                  <span className="text-slate-700">{wa.lines.length} resources</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Budget:</span>
                  <span className={`font-medium ${
                    wa.budgetCheckResult === 'pass' ? 'text-green-600' :
                    wa.budgetCheckResult === 'warn' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {wa.budgetCheckResult.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Gate Status */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Gate Status:</span>
                  <div className="flex gap-1">
                    {wa.lines.slice(0, 3).map((line, idx) => {
                      const utilisation = (line.consumedQty / line.authorisedQty) * 100;
                      return (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            utilisation >= 100 ? 'bg-red-500' :
                            utilisation >= 80 ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          title={`${line.resourceName}: ${utilisation.toFixed(0)}%`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailsTab({ selectedWA, setSelectedWA }: { selectedWA: string | null; setSelectedWA: (id: string | null) => void }) {
  const wa = workAuthorisations.find(w => w.id === selectedWA) || workAuthorisations[0];

  return (
    <div className="space-y-6">
      {/* WA Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Work Authorisation</label>
        <select
          value={selectedWA || wa.id}
          onChange={(e) => setSelectedWA(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {workAuthorisations.map(w => (
            <option key={w.id} value={w.id}>{w.waNo} - {w.activityName} ({w.date})</option>
          ))}
        </select>
      </div>

      {/* WA Details */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-slate-900">{wa.waNo}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded capitalize ${
                wa.status === 'active' ? 'bg-green-100 text-green-700' :
                wa.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                wa.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                wa.status === 'closed' ? 'bg-purple-100 text-purple-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {wa.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{wa.activityName}</p>
            <p className="text-xs text-slate-500 mt-1">
              {wa.workFrontName} • {wa.location} • {wa.shift} shift
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Valid</p>
            <p className="text-sm font-medium text-slate-900">
              {new Date(wa.validFrom).toLocaleString()} - {new Date(wa.validTo).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Responsible</p>
            <p className="text-sm font-medium text-slate-900">{wa.responsibleName}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Supervisor</p>
            <p className="text-sm font-medium text-slate-900">{wa.supervisorName}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Budget Line</p>
            <p className="text-sm font-mono text-slate-900">{wa.budgetLineId}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Budget Check</p>
            <p className={`text-sm font-medium ${
              wa.budgetCheckResult === 'pass' ? 'text-green-600' :
              wa.budgetCheckResult === 'warn' ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {wa.budgetCheckResult.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Resource Lines */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Resource Lines</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Resource</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Authorised</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Consumed</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Balance</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Utilisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {wa.lines.map(line => {
                  const utilisation = (line.consumedQty / line.authorisedQty) * 100;
                  return (
                    <tr key={line.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{line.resourceName}</p>
                          {line.tradeOrCategory && (
                            <p className="text-xs text-slate-500">{line.tradeOrCategory}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                          line.resourceType === 'output' ? 'bg-blue-100 text-blue-700' :
                          line.resourceType === 'material' ? 'bg-green-100 text-green-700' :
                          line.resourceType === 'labour' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {line.resourceType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-slate-900">{line.authorisedQty} {line.uomName}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-slate-700">{line.consumedQty} {line.uomName}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-slate-900">{line.balanceQty} {line.uomName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                utilisation >= 100 ? 'bg-red-500' :
                                utilisation >= 80 ? 'bg-amber-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilisation, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium w-12 text-right ${
                            utilisation >= 100 ? 'text-red-600' :
                            utilisation >= 80 ? 'text-amber-600' :
                            'text-green-600'
                          }`}>
                            {utilisation.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reservations */}
        {wa.reservations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Resource Reservations</h4>
            <div className="space-y-2">
              {wa.reservations.map(res => (
                <div key={res.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {res.storeName || res.plantName || res.crewName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(res.reservedFrom).toLocaleString()} - {new Date(res.reservedTo).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{res.reservedQty}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      res.status === 'reserved' ? 'bg-blue-100 text-blue-700' :
                      res.status === 'consumed' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VerificationTab() {
  return (
    <div className="space-y-6">
      {/* Verification Checks */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Verification Checks</h3>
          <p className="text-sm text-slate-500 mt-1">Protocol checks performed during WA submission</p>
        </div>
        <div className="divide-y divide-slate-200">
          {verificationChecks.map(check => (
            <div key={check.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  check.status === 'pass' ? 'bg-green-100 text-green-600' :
                  check.status === 'warn' ? 'bg-amber-100 text-amber-600' :
                  check.status === 'fail' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {check.status === 'pass' ? '✓' :
                   check.status === 'warn' ? '⚠' :
                   check.status === 'fail' ? '✗' : 'ℹ'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{check.checkName}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      check.status === 'pass' ? 'bg-green-100 text-green-700' :
                      check.status === 'warn' ? 'bg-amber-100 text-amber-700' :
                      check.status === 'fail' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {check.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{check.message}</p>
                  {check.details && (
                    <p className="text-xs text-slate-500 mt-1">{check.details}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    Checked at {new Date(check.checkedAt).toLocaleString()} by {check.checkedBy}
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

function BalanceTab({ selectedWA, setSelectedWA }: { selectedWA: string | null; setSelectedWA: (id: string | null) => void }) {
  const wa = workAuthorisations.find(w => w.id === selectedWA) || workAuthorisations[0];

  return (
    <div className="space-y-6">
      {/* Balance Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs text-slate-500 mb-1">Total Authorised</p>
          <p className="text-3xl font-bold text-blue-700">{balanceSummary.totalAuthorised}</p>
          <p className="text-xs text-slate-500 mt-1">Output quantity</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs text-slate-500 mb-1">Total Consumed</p>
          <p className="text-3xl font-bold text-green-700">{balanceSummary.totalConsumed}</p>
          <p className="text-xs text-slate-500 mt-1">Actual quantity</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs text-slate-500 mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-amber-700">{balanceSummary.totalBalance}</p>
          <p className="text-xs text-slate-500 mt-1">Remaining quantity</p>
        </div>
      </div>

      {/* Utilisation Gauge */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Overall Utilisation</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="h-8 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  balanceSummary.utilisationPct >= 100 ? 'bg-red-500' :
                  balanceSummary.utilisationPct >= 80 ? 'bg-amber-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(balanceSummary.utilisationPct, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${
              balanceSummary.utilisationPct >= 100 ? 'text-red-600' :
              balanceSummary.utilisationPct >= 80 ? 'text-amber-600' :
              'text-green-600'
            }`}>
              {balanceSummary.utilisationPct.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500">Utilisation</p>
          </div>
        </div>
      </div>

      {/* Balance by WA */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Balance by Work Authorisation</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {workAuthorisations.filter(wa => wa.status === 'active' || wa.status === 'approved').map(wa => {
            const outputLines = wa.lines.filter(l => l.resourceType === 'output');
            const totalAuthorised = outputLines.reduce((sum, l) => sum + l.authorisedQty, 0);
            const totalConsumed = outputLines.reduce((sum, l) => sum + l.consumedQty, 0);
            const utilisation = totalAuthorised > 0 ? (totalConsumed / totalAuthorised) * 100 : 0;

            return (
              <div key={wa.id} className="p-6 hover:bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-semibold text-teal-700">{wa.waNo}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                        wa.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {wa.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900">{wa.activityName}</p>
                    <p className="text-xs text-slate-500">{wa.date} • {wa.shift}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      utilisation >= 100 ? 'text-red-600' :
                      utilisation >= 80 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {utilisation.toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-500">Utilisation</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      utilisation >= 100 ? 'bg-red-500' :
                      utilisation >= 80 ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(utilisation, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                  <div>
                    <span className="text-slate-500">Authorised:</span>
                    <span className="ml-1 font-medium text-slate-900">{totalAuthorised}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Consumed:</span>
                    <span className="ml-1 font-medium text-slate-900">{totalConsumed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Balance:</span>
                    <span className="ml-1 font-medium text-slate-900">{totalAuthorised - totalConsumed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClosureTab() {
  const closedWAs = workAuthorisations.filter(wa => wa.status === 'closed');

  return (
    <div className="space-y-6">
      {/* Closure Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Closed WAs"
          value={waStats.closedWAs}
          subtitle="Reconciled"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Expired WAs"
          value={waStats.expiredWAs}
          subtitle="Need review"
          icon="⏰"
          color="amber"
        />
        <StatCard
          title="Variance Recorded"
          value={closedWAs.length}
          subtitle="With reasons"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Returns Pending"
          value={0}
          subtitle="Within 24h"
          icon="↩️"
          color="purple"
        />
      </div>

      {/* Closed WAs List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Closed Work Authorisations</h3>
          <p className="text-sm text-slate-500 mt-1">Reconciled WAs with variance analysis</p>
        </div>
        <div className="divide-y divide-slate-200">
          {closedWAs.map(wa => {
            const outputLines = wa.lines.filter(l => l.resourceType === 'output');
            const totalAuthorised = outputLines.reduce((sum, l) => sum + l.authorisedQty, 0);
            const totalConsumed = outputLines.reduce((sum, l) => sum + l.consumedQty, 0);
            const variance = totalConsumed - totalAuthorised;
            const variancePct = totalAuthorised > 0 ? (variance / totalAuthorised) * 100 : 0;

            return (
              <div key={wa.id} className="p-6 hover:bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono font-semibold text-teal-700">{wa.waNo}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        CLOSED
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{wa.activityName}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Closed by {wa.closedBy} on {wa.closedAt && new Date(wa.closedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      Math.abs(variancePct) > 5 ? 'text-red-600' :
                      Math.abs(variancePct) > 2 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {variancePct >= 0 ? '+' : ''}{variancePct.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-500">Variance</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-slate-500">Authorised</p>
                    <p className="text-sm font-semibold text-blue-700">{totalAuthorised}</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-slate-500">Consumed</p>
                    <p className="text-sm font-semibold text-green-700">{totalConsumed}</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded">
                    <p className="text-slate-500">Variance</p>
                    <p className={`text-sm font-semibold ${variance >= 0 ? 'text-amber-700' : 'text-red-700'}`}>
                      {variance >= 0 ? '+' : ''}{variance}
                    </p>
                  </div>
                </div>

                {variance !== 0 && (
                  <div className="p-3 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs text-amber-900">
                      <span className="font-medium">Variance Reason:</span> {variance > 0 ? 'Excess consumption - site conditions required additional material' : 'Under consumption - work completed with less material than planned'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
    teal: 'bg-teal-50 border-teal-200',
    amber: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200'
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
