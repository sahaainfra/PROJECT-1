import { useState } from 'react';
import {
  costCodes,
  budgetVersions,
  budgetLines,
  commitments,
  actuals,
  transfers,
  forecasts,
  budgetCheckConfigs,
  protocolControlPoints,
  budgetCheckDemo,
  budgetStats,
  varianceAnalysis
} from '../data/budgetData';

export function BudgetDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'versions', label: 'Budget Versions', icon: '📋' },
    { id: 'lines', label: 'Budget Lines', icon: '💰' },
    { id: 'commitments', label: 'Commitments', icon: '📝' },
    { id: 'actuals', label: 'Actuals', icon: '💵' },
    { id: 'variance', label: 'Variance Analysis', icon: '📈' },
    { id: 'transfers', label: 'Transfers', icon: '🔄' },
    { id: 'check', label: 'Budget Check', icon: '✓' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Advanced Budgeting & Cost Control</h1>
          <p className="text-sm text-slate-500 mt-1">Part 25 — Comprehensive budget management with cost codes, commitments, and variance analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            ff.bud
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
      {activeTab === 'versions' && <VersionsTab />}
      {activeTab === 'lines' && <LinesTab />}
      {activeTab === 'commitments' && <CommitmentsTab />}
      {activeTab === 'actuals' && <ActualsTab />}
      {activeTab === 'variance' && <VarianceTab />}
      {activeTab === 'transfers' && <TransfersTab />}
      {activeTab === 'check' && <BudgetCheckTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Current Budget"
          value={`₹${(budgetStats.currentBudget / 10000000).toFixed(1)} Cr`}
          subtitle={`${budgetStats.approvedVersions} approved versions`}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Forecast Budget"
          value={`₹${(budgetStats.forecastBudget / 10000000).toFixed(1)} Cr`}
          subtitle={`${((budgetStats.forecastBudget / budgetStats.currentBudget - 1) * 100).toFixed(1)}% variance`}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Open Commitments"
          value={`₹${(budgetStats.openCommitments / 10000000).toFixed(1)} Cr`}
          subtitle={`${budgetStats.totalCommitments} commitments`}
          icon="📝"
          color="amber"
        />
        <StatCard
          title="Actual Costs"
          value={`₹${(budgetStats.totalActuals / 10000000).toFixed(1)} Cr`}
          subtitle="To date"
          icon="💵"
          color="purple"
        />
      </div>

      {/* Budget Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-2">Budget Lines</p>
            <p className="text-3xl font-bold text-slate-900">{budgetStats.totalBudgetLines}</p>
            <p className="text-xs text-slate-500 mt-1">Active cost codes</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Cost Codes</p>
            <p className="text-3xl font-bold text-slate-900">{costCodes.length}</p>
            <p className="text-xs text-slate-500 mt-1">Configured codes</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Pending Transfers</p>
            <p className="text-3xl font-bold text-slate-900">{budgetStats.pendingTransfers}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
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

      {/* Budget Check Config */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Check Configuration</h3>
        <div className="space-y-3">
          {budgetCheckConfigs.map(config => (
            <div key={config.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900 capitalize">{config.scope} Level: {config.level}</p>
                <p className="text-xs text-slate-500">{config.scopeId}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 capitalize">{config.mode}</p>
                  <p className="text-xs text-slate-500">Tolerance: {config.tolerancePct}%</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  config.mode === 'block' ? 'bg-red-100 text-red-700' :
                  config.mode === 'warn' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {config.mode.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VersionsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Budget Versions</h3>
        <p className="text-sm text-slate-500 mt-1">Track budget evolution from original to forecast</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Version</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Total Budget</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Effective Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Approved By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Created By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {budgetVersions.map(version => (
              <tr key={version.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-green-700 font-semibold">{version.versionNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    version.type === 'original' ? 'bg-slate-100 text-slate-700' :
                    version.type === 'approved' ? 'bg-blue-100 text-blue-700' :
                    version.type === 'revised' ? 'bg-amber-100 text-amber-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {version.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    version.status === 'approved' ? 'bg-green-100 text-green-700' :
                    version.status === 'superseded' ? 'bg-slate-100 text-slate-700' :
                    version.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {version.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    ₹{(version.total / 10000000).toFixed(2)} Cr
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {new Date(version.effectiveDate).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {version.approvedBy || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-slate-700">{version.createdByName}</p>
                    <p className="text-xs text-slate-500">{new Date(version.createdAt).toLocaleDateString()}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LinesTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Budget Lines</h3>
        <p className="text-sm text-slate-500 mt-1">Detailed budget breakdown by WBS and cost code</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">WBS</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Cost Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Resource Type</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">UOM</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Rate</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {budgetLines.map(line => (
              <tr key={line.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-xs font-mono text-green-700">{line.wbsNodeCode}</p>
                    <p className="text-sm text-slate-900">{line.wbsNodeName}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-xs font-mono text-green-700">{line.costCodeName}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    line.resourceType === 'material' ? 'bg-blue-100 text-blue-700' :
                    line.resourceType === 'labour' ? 'bg-green-100 text-green-700' :
                    line.resourceType === 'plant' ? 'bg-purple-100 text-purple-700' :
                    line.resourceType === 'subcontract' ? 'bg-amber-100 text-amber-700' :
                    line.resourceType === 'staff' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {line.resourceType}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-900">{line.qty.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{line.uomName}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-900">₹{line.rate.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900">₹{(line.amount / 100000).toFixed(2)} L</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td colSpan={6} className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                Total Budget:
              </td>
              <td className="px-6 py-3 text-right text-sm font-bold text-green-700">
                ₹{(budgetLines.reduce((sum, l) => sum + l.amount, 0) / 10000000).toFixed(2)} Cr
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function CommitmentsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Commitments</h3>
        <p className="text-sm text-slate-500 mt-1">Track all committed costs from POs, WOs, and subcontracts</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">WBS</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Cost Code</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Committed</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Invoiced</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Open</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {commitments.map(comm => (
              <tr key={comm.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-green-700">{comm.sourceNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    comm.sourceType === 'PO' ? 'bg-blue-100 text-blue-700' :
                    comm.sourceType === 'WO' ? 'bg-purple-100 text-purple-700' :
                    comm.sourceType === 'subcontract' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {comm.sourceType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{comm.wbsNodeId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{comm.costCodeId}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-900">₹{(comm.committedAmount / 100000).toFixed(2)} L</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-700">₹{(comm.invoicedAmount / 100000).toFixed(2)} L</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-amber-700">₹{(comm.openCommitment / 100000).toFixed(2)} L</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    comm.status === 'open' ? 'bg-blue-100 text-blue-700' :
                    comm.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                    comm.status === 'closed' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {comm.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td colSpan={4} className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                Total:
              </td>
              <td className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                ₹{(commitments.reduce((sum, c) => sum + c.committedAmount, 0) / 10000000).toFixed(2)} Cr
              </td>
              <td className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                ₹{(commitments.reduce((sum, c) => sum + c.invoicedAmount, 0) / 10000000).toFixed(2)} Cr
              </td>
              <td className="px-6 py-3 text-right text-sm font-bold text-amber-700">
                ₹{(budgetStats.openCommitments / 10000000).toFixed(2)} Cr
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function ActualsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Actual Costs</h3>
        <p className="text-sm text-slate-500 mt-1">Track actual costs incurred from finance postings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">WBS</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Cost Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source ID</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {actuals.map(actual => (
              <tr key={actual.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-900">{actual.period}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{actual.wbsNodeId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{actual.costCodeId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    actual.sourceType === 'GRN' ? 'bg-blue-100 text-blue-700' :
                    actual.sourceType === 'payroll' ? 'bg-green-100 text-green-700' :
                    actual.sourceType === 'sub_bill' ? 'bg-amber-100 text-amber-700' :
                    actual.sourceType === 'expense' ? 'bg-purple-100 text-purple-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {actual.sourceType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-slate-600">{actual.sourceId}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900">₹{(actual.amount / 100000).toFixed(2)} L</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td colSpan={5} className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                Total Actuals:
              </td>
              <td className="px-6 py-3 text-right text-sm font-bold text-purple-700">
                ₹{(budgetStats.totalActuals / 10000000).toFixed(2)} Cr
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function VarianceTab() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Budget"
          value={`₹${(budgetStats.currentBudget / 10000000).toFixed(1)} Cr`}
          subtitle="Approved budget"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Total EAC"
          value={`₹${(varianceAnalysis.reduce((sum, v) => sum + v.eac, 0) / 10000000).toFixed(1)} Cr`}
          subtitle="Estimate at completion"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Total Variance"
          value={`₹${(varianceAnalysis.reduce((sum, v) => sum + v.variance, 0) / 10000000).toFixed(1)} Cr`}
          subtitle={`${((varianceAnalysis.reduce((sum, v) => sum + v.variance, 0) / budgetStats.currentBudget) * 100).toFixed(1)}%`}
          icon="📈"
          color={varianceAnalysis.reduce((sum, v) => sum + v.variance, 0) >= 0 ? 'green' : 'red'}
        />
        <StatCard
          title="Critical Items"
          value={varianceAnalysis.filter(v => v.status === 'critical').length}
          subtitle="Variance > 10%"
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Variance Analysis Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Variance Analysis</h3>
          <p className="text-sm text-slate-500 mt-1">Budget vs Committed vs Actual vs Forecast</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">WBS</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Cost Code</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Budget</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Committed</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Actual</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">EAC</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Variance</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">%</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {varianceAnalysis.map(item => (
                <tr key={item.lineId} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-mono text-green-700">{item.wbsNodeCode}</p>
                      <p className="text-sm text-slate-900">{item.wbsNodeName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{item.costCodeName}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-900">₹{(item.budget / 100000).toFixed(2)} L</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-amber-700">₹{(item.committed / 100000).toFixed(2)} L</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-purple-700">₹{(item.actual / 100000).toFixed(2)} L</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-blue-700">₹{(item.eac / 100000).toFixed(2)} L</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold ${
                      item.variance >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {item.variance >= 0 ? '+' : ''}₹{(item.variance / 100000).toFixed(2)} L
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${
                      item.variancePct >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {item.variancePct >= 0 ? '+' : ''}{item.variancePct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      item.status === 'critical' ? 'bg-red-100 text-red-700' :
                      item.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.status}
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

function TransfersTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Budget Transfers</h3>
          <p className="text-sm text-slate-500 mt-1">Track budget transfers between cost codes</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
          + New Transfer
        </button>
      </div>
      <div className="divide-y divide-slate-200">
        {transfers.map(transfer => (
          <div key={transfer.id} className="p-6 hover:bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    transfer.status === 'approved' ? 'bg-green-100 text-green-700' :
                    transfer.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                    transfer.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {transfer.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(transfer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-900 mb-2">{transfer.reason}</p>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>From: {transfer.fromLineId}</span>
                  <span>→</span>
                  <span>To: {transfer.toLineId}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">₹{(transfer.amount / 100000).toFixed(2)} L</p>
                <p className="text-xs text-slate-500 mt-1">Requested by: {transfer.requestedByName}</p>
                {transfer.approvedBy && (
                  <p className="text-xs text-slate-500">Approved: {new Date(transfer.approvedAt!).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetCheckTab() {
  return (
    <div className="space-y-6">
      {/* Demo Budget Check */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Availability Check</h3>
        <p className="text-sm text-slate-500 mb-6">Demo of budget check API for procurement/contract approval</p>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project</label>
              <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm text-slate-900">{budgetCheckDemo.project}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">WBS Node</label>
              <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm text-slate-900">{budgetCheckDemo.wbs}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cost Code</label>
              <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm text-slate-900">{budgetCheckDemo.costCode}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount to Check</label>
              <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm font-semibold text-slate-900">₹{(budgetCheckDemo.amount / 100000).toFixed(2)} L</span>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg border-2 ${
            budgetCheckDemo.result.status === 'ok' ? 'bg-green-50 border-green-300' :
            budgetCheckDemo.result.status === 'warn' ? 'bg-amber-50 border-amber-300' :
            'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-4xl ${
                budgetCheckDemo.result.status === 'ok' ? 'text-green-600' :
                budgetCheckDemo.result.status === 'warn' ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {budgetCheckDemo.result.status === 'ok' ? '✓' :
                 budgetCheckDemo.result.status === 'warn' ? '⚠' : '✗'}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 capitalize">
                  Status: {budgetCheckDemo.result.status}
                </p>
                <p className="text-sm text-slate-600">
                  Utilization: {budgetCheckDemo.result.utilization}%
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Available Budget:</span>
                <span className="text-sm font-semibold text-slate-900">
                  ₹{(budgetCheckDemo.result.available / 100000).toFixed(2)} L
                </span>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <p className="text-sm text-slate-700">{budgetCheckDemo.result.message}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Check Budget
          </button>
          <button className="px-6 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
            Reset
          </button>
        </div>
      </div>

      {/* Budget Check Rules */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Check Rules</h3>
        <div className="space-y-3">
          {budgetCheckConfigs.map(config => (
            <div key={config.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {config.scope === 'company' ? 'Company-wide' : 'Project-specific'} - {config.level.toUpperCase()} Level
                </p>
                <p className="text-xs text-slate-500 mt-1">Scope: {config.scopeId}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 capitalize">{config.mode}</p>
                  <p className="text-xs text-slate-500">at {config.tolerancePct}% utilization</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded ${
                  config.mode === 'block' ? 'bg-red-100 text-red-700' :
                  config.mode === 'warn' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {config.mode.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
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
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    purple: 'bg-purple-50 border-purple-200',
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
