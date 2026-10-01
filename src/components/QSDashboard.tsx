import { useState } from 'react';
import {
  mbBooks,
  mbEntries,
  quantityLedger,
  deviations,
  variations,
  protocolControlPoints,
  qsStats,
  reconciliationSummary
} from '../data/qsData';

export function QSDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'mb-books', label: 'Measurement Books', icon: '📖' },
    { id: 'mb-entries', label: 'MB Entries', icon: '📝' },
    { id: 'reconciliation', label: 'Quantity Ledger', icon: '📋' },
    { id: 'deviations', label: 'Deviations', icon: '⚠️' },
    { id: 'variations', label: 'Variations', icon: '🔄' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced QS / Quantity Surveying</h1>
          <p className="text-sm text-slate-500 mt-1">Part 24 — Measurement books, quantity reconciliation, and variation management</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full border border-pink-200">
            ff.qs
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
                  ? 'bg-pink-50 text-pink-700 border-b-2 border-pink-700'
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
      {activeTab === 'mb-books' && <MBBooksTab />}
      {activeTab === 'mb-entries' && <MBEntriesTab />}
      {activeTab === 'reconciliation' && <ReconciliationTab />}
      {activeTab === 'deviations' && <DeviationsTab />}
      {activeTab === 'variations' && <VariationsTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="MB Books"
          value={qsStats.totalMBBooks}
          subtitle={`${qsStats.openMBBooks} open`}
          icon="📖"
          color="blue"
        />
        <StatCard
          title="MB Entries"
          value={qsStats.totalMBEntries}
          subtitle={`${qsStats.certifiedEntries} certified`}
          icon="📝"
          color="green"
        />
        <StatCard
          title="Variations"
          value={qsStats.totalVariations}
          subtitle={`${qsStats.approvedVariations} approved`}
          icon="🔄"
          color="purple"
        />
        <StatCard
          title="Deviations"
          value={qsStats.totalDeviations}
          subtitle={`${qsStats.warningDeviations} warnings`}
          icon="⚠️"
          color="amber"
        />
      </div>

      {/* Reconciliation Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quantity Reconciliation Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 mb-1">Contract Qty</p>
            <p className="text-2xl font-bold text-blue-900">{reconciliationSummary.totalContractQty.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Executed Qty</p>
            <p className="text-2xl font-bold text-green-900">{reconciliationSummary.totalExecutedQty.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 mb-1">Measured Qty</p>
            <p className="text-2xl font-bold text-purple-900">{reconciliationSummary.totalMeasuredQty.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 mb-1">Certified Qty</p>
            <p className="text-2xl font-bold text-amber-900">{reconciliationSummary.totalCertifiedQty.toLocaleString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Billed Qty</p>
            <p className="text-xl font-bold text-slate-900">{reconciliationSummary.totalBilledQty.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Balance Qty</p>
            <p className="text-xl font-bold text-slate-900">{reconciliationSummary.totalBalanceQty.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Forecast Final</p>
            <p className="text-xl font-bold text-slate-900">{reconciliationSummary.totalForecastQty.toLocaleString()}</p>
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
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded">
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

function MBBooksTab() {
  return (
    <div className="space-y-6">
      {/* MB Books List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Measurement Books</h3>
          <button className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700">
            + New MB Book
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">MB No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Issued To</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Entries</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Certified</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mbBooks.map(mb => (
                <tr key={mb.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-pink-700">{mb.mbNo}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900">{mb.projectName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      mb.type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {mb.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{mb.issuedTo}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{mb.totalEntries}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-green-600">{mb.certifiedEntries}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      mb.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {mb.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(mb.createdAt).toLocaleDateString()}
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

function MBEntriesTab() {
  return (
    <div className="space-y-6">
      {/* MB Entries List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Measurement Book Entries</h3>
          <button className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700">
            + New Entry
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Entry No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">BOQ Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Location</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Dimensions</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Check Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Locked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mbEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-pink-700">{entry.entryNo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-mono text-slate-500">{entry.boqItemNo}</p>
                      <p className="text-sm text-slate-900">{entry.boqItemDescription}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{entry.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs text-slate-700">{entry.location}</p>
                      {entry.floor && <p className="text-xs text-slate-500">{entry.floor}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-xs text-slate-600">
                      <p>{entry.nos} × {entry.length} × {entry.breadth} × {entry.depth}</p>
                      <p className="text-slate-400">× {entry.factor}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {entry.quantity.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      entry.checkStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                      entry.checkStatus === 'adjusted' ? 'bg-amber-100 text-amber-700' :
                      entry.checkStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {entry.checkStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {entry.locked ? (
                      <span className="text-green-600">🔒</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
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

function ReconciliationTab() {
  return (
    <div className="space-y-6">
      {/* Quantity Ledger */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Quantity Reconciliation Ledger</h3>
          <p className="text-sm text-slate-500 mt-1">Track quantities from contract to billing</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">BOQ Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Contract</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Executed</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Measured</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Certified</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Billed</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Balance</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Forecast</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">UOM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quantityLedger.map(ledger => (
                <tr key={ledger.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-pink-700">{ledger.boqItemNo}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900">{ledger.boqItemDescription}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-blue-700">{ledger.contractQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-green-700">{ledger.executedQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-purple-700">{ledger.measuredQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-amber-700">{ledger.certifiedQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-700">{ledger.billedQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-900">{ledger.balanceQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">{ledger.forecastFinalQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600">{ledger.uom}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 border-t-2 border-slate-300">
              <tr>
                <td colSpan={2} className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                  Total:
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-blue-700">
                  {reconciliationSummary.totalContractQty.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-green-700">
                  {reconciliationSummary.totalExecutedQty.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-purple-700">
                  {reconciliationSummary.totalMeasuredQty.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-amber-700">
                  {reconciliationSummary.totalCertifiedQty.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-slate-700">
                  {reconciliationSummary.totalBilledQty.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-slate-900">
                  {reconciliationSummary.totalBalanceQty.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-slate-900">
                  {reconciliationSummary.totalForecastQty.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function DeviationsTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={qsStats.totalDeviations}
          subtitle="Monitored"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Normal"
          value={qsStats.normalDeviations}
          subtitle="Within limits"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Warnings"
          value={qsStats.warningDeviations}
          subtitle="Approaching limit"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Critical"
          value={qsStats.criticalDeviations}
          subtitle="Exceeded limit"
          icon="🚨"
          color="red"
        />
      </div>

      {/* Deviations List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Deviation Monitoring</h3>
          <p className="text-sm text-slate-500 mt-1">Track forecast quantities against contract quantities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">BOQ Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Contract Qty</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Forecast Qty</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Deviation %</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Limit %</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {deviations.map(dev => (
                <tr key={dev.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-pink-700">{dev.boqItemNo}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900">{dev.boqItemDescription}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-900">{dev.contractQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-900">{dev.forecastQty.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${
                      dev.deviationPct > dev.limitPct ? 'text-red-600' :
                      dev.deviationPct > dev.limitPct * 0.8 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {dev.deviationPct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-700">±{dev.limitPct}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      dev.status === 'normal' ? 'bg-green-100 text-green-700' :
                      dev.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      dev.status === 'critical' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {dev.status}
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

function VariationsTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Variations"
          value={qsStats.totalVariations}
          subtitle="All types"
          icon="🔄"
          color="purple"
        />
        <StatCard
          title="Approved"
          value={qsStats.approvedVariations}
          subtitle="Incorporated"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Pending"
          value={qsStats.pendingVariations}
          subtitle="Awaiting approval"
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Total Value"
          value={`₹${(variations.reduce((sum, v) => sum + v.amount, 0) / 100000).toFixed(1)} L`}
          subtitle="Net variation"
          icon="💰"
          color="blue"
        />
      </div>

      {/* Variations List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Variation Register</h3>
          <button className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700">
            + New Variation
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {variations.map(variation => (
            <div key={variation.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs font-mono text-pink-700">{variation.voNo}</code>
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      variation.type === 'addition' ? 'bg-green-100 text-green-700' :
                      variation.type === 'omission' ? 'bg-red-100 text-red-700' :
                      variation.type === 'substitution' ? 'bg-blue-100 text-blue-700' :
                      variation.type === 'extra_item' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {variation.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      variation.status === 'approved' ? 'bg-green-100 text-green-700' :
                      variation.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      variation.status === 'incorporated' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {variation.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{variation.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Source: {variation.source.replace(/_/g, ' ')} • Created by {variation.createdByName}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${variation.amount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {variation.amount >= 0 ? '+' : ''}₹{(variation.amount / 100000).toFixed(2)} L
                  </p>
                  <p className="text-xs text-slate-500">{variation.qty} {variation.uomName}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Rate Basis:</span>
                  <span className="ml-1 text-slate-700 font-medium capitalize">{variation.rateBasis}</span>
                </div>
                <div>
                  <span className="text-slate-500">Rate:</span>
                  <span className="ml-1 text-slate-700 font-medium">₹{variation.rate.toLocaleString()}</span>
                </div>
                {variation.timeImpactDays && (
                  <div>
                    <span className="text-slate-500">Time Impact:</span>
                    <span className="ml-1 text-slate-700 font-medium">{variation.timeImpactDays} days</span>
                  </div>
                )}
                {variation.clientApprovalRef && (
                  <div>
                    <span className="text-slate-500">Client Ref:</span>
                    <span className="ml-1 text-slate-700 font-mono">{variation.clientApprovalRef}</span>
                  </div>
                )}
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
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
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
