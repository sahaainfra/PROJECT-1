import { useState } from 'react';
import {
  estimates,
  resourceRates,
  rateAnalyses,
  takeoffSheets,
  referenceLibraries,
  referenceItems,
  protocolControlPoints,
  estimationStats,
  sensitivityScenarios
} from '../data/estimationData';

export function EstimationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEstimate, setSelectedEstimate] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'estimates', label: 'Estimates', icon: '📋' },
    { id: 'rate-analysis', label: 'Rate Analysis', icon: '🔬' },
    { id: 'takeoff', label: 'Take-off', icon: '📐' },
    { id: 'library', label: 'Resource Library', icon: '📚' },
    { id: 'dsr', label: 'DSR Comparison', icon: '📖' },
    { id: 'sensitivity', label: 'Sensitivity', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Estimation</h1>
          <p className="text-sm text-slate-500 mt-1">Part 23 — Rate analysis, quantity take-off, and cost estimation engine</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            ff.est
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
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'estimates' && <EstimatesTab selectedEstimate={selectedEstimate} setSelectedEstimate={setSelectedEstimate} />}
      {activeTab === 'rate-analysis' && <RateAnalysisTab selectedAnalysis={selectedAnalysis} setSelectedAnalysis={setSelectedAnalysis} />}
      {activeTab === 'takeoff' && <TakeoffTab />}
      {activeTab === 'library' && <LibraryTab />}
      {activeTab === 'dsr' && <DSRComparisonTab />}
      {activeTab === 'sensitivity' && <SensitivityTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Estimates"
          value={estimationStats.totalEstimates}
          subtitle={`${estimationStats.draftEstimates} draft`}
          icon="📋"
          color="indigo"
        />
        <StatCard
          title="Approved"
          value={estimationStats.approvedEstimates}
          subtitle={`${estimationStats.releasedEstimates} released`}
          icon="✓"
          color="green"
        />
        <StatCard
          title="Resource Rates"
          value={estimationStats.totalResourceRates}
          subtitle={`${estimationStats.materialRates} materials`}
          icon="💰"
          color="blue"
        />
        <StatCard
          title="Rate Analyses"
          value={estimationStats.totalRateAnalyses}
          subtitle="BOQ items priced"
          icon="🔬"
          color="purple"
        />
      </div>

      {/* Recent Estimates */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Estimates</h3>
        <div className="space-y-3">
          {estimates.slice(0, 3).map(est => (
            <div key={est.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl">📊</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{est.estimateNo}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    est.status === 'approved' ? 'bg-green-100 text-green-700' :
                    est.status === 'released' ? 'bg-blue-100 text-blue-700' :
                    est.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {est.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {est.tenderNo || est.projectName} • v{est.versionNo} • Base: {est.baseDate}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-slate-500">Direct: ₹{(est.totalDirectCost / 10000000).toFixed(2)} Cr</span>
                  <span className="text-slate-500">Total: ₹{(est.totalPrice / 10000000).toFixed(2)} Cr</span>
                  <span className="text-slate-500">Markup: {est.markupPct}%</span>
                </div>
              </div>
            </div>
          ))}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Resource Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Materials</span>
              <span className="text-sm font-semibold text-slate-900">{estimationStats.materialRates}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Labour</span>
              <span className="text-sm font-semibold text-slate-900">{estimationStats.labourRates}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Plant</span>
              <span className="text-sm font-semibold text-slate-900">{estimationStats.plantRates}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Reference Libraries</h4>
          <div className="space-y-2">
            {referenceLibraries.map(lib => (
              <div key={lib.id} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{lib.code}</span>
                <span className="text-xs font-medium text-slate-900">{lib.itemCount} items</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Estimate Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Draft</span>
              <span className="text-sm font-semibold text-slate-900">{estimationStats.draftEstimates}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Approved</span>
              <span className="text-sm font-semibold text-slate-900">{estimationStats.approvedEstimates}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Released</span>
              <span className="text-sm font-semibold text-slate-900">{estimationStats.releasedEstimates}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EstimatesTab({ selectedEstimate, setSelectedEstimate }: { selectedEstimate: string | null; setSelectedEstimate: (id: string | null) => void }) {
  const selected = estimates.find(e => e.id === selectedEstimate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Estimates List */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Estimate Register</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            + New Estimate
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {estimates.map(est => (
            <div
              key={est.id}
              onClick={() => setSelectedEstimate(est.id)}
              className={`p-6 hover:bg-slate-50 cursor-pointer transition-colors ${
                selectedEstimate === est.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{est.estimateNo}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      est.status === 'approved' ? 'bg-green-100 text-green-700' :
                      est.status === 'released' ? 'bg-blue-100 text-blue-700' :
                      est.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {est.status}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                      v{est.versionNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {est.tenderNo || est.projectName} • Basis: {est.basis}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">₹{(est.totalPrice / 10000000).toFixed(2)} Cr</p>
                  <p className="text-xs text-slate-500">Total Price</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Direct Cost:</span>
                  <span className="ml-1 font-medium text-slate-700">₹{(est.totalDirectCost / 10000000).toFixed(2)} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500">Indirects:</span>
                  <span className="ml-1 font-medium text-slate-700">₹{(est.totalIndirects / 10000000).toFixed(2)} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500">Markup:</span>
                  <span className="ml-1 font-medium text-slate-700">{est.markupPct}%</span>
                </div>
                <div>
                  <span className="text-slate-500">Base Date:</span>
                  <span className="ml-1 font-medium text-slate-700">{new Date(est.baseDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimate Details */}
      {selected && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Estimate Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Estimate No</p>
              <p className="text-sm font-semibold text-slate-900">{selected.estimateNo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Reference</p>
              <p className="text-sm text-slate-900">{selected.tenderNo || selected.projectName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Location Factor</p>
              <p className="text-sm font-medium text-slate-900">{selected.locationFactor}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Created By</p>
              <p className="text-sm text-slate-900">{selected.createdByName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Created At</p>
              <p className="text-sm text-slate-900">{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            {selected.approvedBy && (
              <>
                <div>
                  <p className="text-xs text-slate-500">Approved By</p>
                  <p className="text-sm text-slate-900">{selected.approvedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Approved At</p>
                  <p className="text-sm text-slate-900">{new Date(selected.approvedAt!).toLocaleString()}</p>
                </div>
              </>
            )}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-2">Actions</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RateAnalysisTab({ selectedAnalysis, setSelectedAnalysis }: { selectedAnalysis: string | null; setSelectedAnalysis: (id: string | null) => void }) {
  const selected = rateAnalyses.find(ra => ra.id === selectedAnalysis);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Rate Analyses List */}
      <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Rate Analyses</h3>
          <p className="text-sm text-slate-500 mt-1">{rateAnalyses.length} items analyzed</p>
        </div>
        <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
          {rateAnalyses.map(ra => (
            <div
              key={ra.id}
              onClick={() => setSelectedAnalysis(ra.id)}
              className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                selectedAnalysis === ra.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-indigo-700">{ra.boqItemNo}</span>
                <span className="text-xs text-slate-500">{ra.lines.length} lines</span>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">{ra.boqItemDescription}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Direct: ₹{ra.directCost.toLocaleString()}</span>
                <span className="text-sm font-bold text-indigo-700">₹{ra.finalRate.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Analysis Details */}
      {selected && (
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-indigo-700">{selected.boqItemNo}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                    {selected.referenceCode}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{selected.boqItemDescription}</h3>
                {selected.notes && (
                  <p className="text-sm text-slate-600 mt-2">{selected.notes}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-700">₹{selected.finalRate.toLocaleString()}</p>
                <p className="text-xs text-slate-500">per {selected.analysisUom}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Analysis Qty:</span>
                <span className="ml-1 font-medium text-slate-900">{selected.analysisQty} {selected.analysisUom}</span>
              </div>
              <div>
                <span className="text-slate-500">Direct Cost:</span>
                <span className="ml-1 font-medium text-slate-900">₹{selected.directCost.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500">Add-ons:</span>
                <span className="ml-1 font-medium text-slate-900">₹{selected.totalAddons.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Resource Lines */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Resource Lines</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Resource</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">UOM</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Rate</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Wastage</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selected.lines.map(line => (
                    <tr key={line.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-900">{line.resourceName}</p>
                          <p className="text-xs text-slate-500">{line.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                          line.resourceType === 'material' ? 'bg-blue-100 text-blue-700' :
                          line.resourceType === 'labour' ? 'bg-green-100 text-green-700' :
                          line.resourceType === 'plant' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {line.resourceType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-slate-900">{line.qty}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{line.uomName}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-slate-900">₹{line.rate.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-700">{line.wastagePct}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-900">₹{line.amount.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={6} className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      Direct Cost Total:
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-slate-900">
                      ₹{selected.directCost.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Add-ons & Overheads</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {selected.addons.map(addon => (
                <div key={addon.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{addon.description}</p>
                    <p className="text-xs text-slate-500 capitalize">{addon.type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">₹{addon.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">@ {addon.basisPct}%</p>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-indigo-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Total Add-ons</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-700">₹{selected.totalAddons.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TakeoffTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Quantity Take-off Sheets</h3>
          <p className="text-sm text-slate-500 mt-1">Detailed quantity calculations with drawing references</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          + Add Take-off
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">BOQ Item</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Location</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Nos</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">L</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">B</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">D/H</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Qty</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Drawing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {takeoffSheets.map(sheet => (
              <tr key={sheet.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-indigo-700">{sheet.boqItemNo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-900">{sheet.description}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{sheet.location}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-900">{sheet.nos}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-700">{sheet.length}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-700">{sheet.breadth}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-700">{sheet.depthHeight}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900">{sheet.quantity.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-slate-600">{sheet.drawingRef}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LibraryTab() {
  return (
    <div className="space-y-6">
      {/* Resource Rates */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Resource Rate Library</h3>
            <p className="text-sm text-slate-500 mt-1">{resourceRates.length} resources with current rates</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            + Add Rate
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">UOM</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Effective</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {resourceRates.map(rate => (
                <tr key={rate.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{rate.resourceName}</p>
                      <p className="text-xs text-slate-500">Basic: ₹{rate.basicRate.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      rate.resourceType === 'material' ? 'bg-blue-100 text-blue-700' :
                      rate.resourceType === 'labour' ? 'bg-green-100 text-green-700' :
                      rate.resourceType === 'plant' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {rate.resourceType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{rate.region}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {rate.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">₹{rate.rate.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{rate.uomName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(rate.effectiveDate).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reference Libraries */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Reference Libraries (DSR/SOR)</h3>
          <p className="text-sm text-slate-500 mt-1">Standard rate libraries for comparison</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {referenceLibraries.map(lib => (
            <div key={lib.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">{lib.code}</span>
                <span className="text-xs text-slate-500">v{lib.version}</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">{lib.name}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{lib.itemCount} items</span>
                <span className="text-slate-500">Effective: {new Date(lib.effectiveDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DSRComparisonTab() {
  const comparisons = [
    {
      itemCode: 'A.1.1',
      description: 'Excavation for foundation',
      ourRate: 250,
      dsrRate: 245,
      sorRate: 230,
      dsrDiff: 2.04,
      sorDiff: 8.70
    },
    {
      itemCode: 'A.1.2',
      description: 'PCC M15 (1:2:4)',
      ourRate: 4500,
      dsrRate: 4350,
      sorRate: 4200,
      dsrDiff: 3.45,
      sorDiff: 7.14
    },
    {
      itemCode: 'A.1.3',
      description: 'RCC M25 in foundation footing',
      ourRate: 6500,
      dsrRate: 6200,
      sorRate: 6100,
      dsrDiff: 4.84,
      sorDiff: 6.56
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">DSR/SOR Rate Comparison</h3>
        <p className="text-sm text-slate-500 mt-1">Compare our rates with standard schedule of rates</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Item Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Our Rate</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">DSR Rate</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">DSR Diff %</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">SOR Rate</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">SOR Diff %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {comparisons.map((comp, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-indigo-700">{comp.itemCode}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-900">{comp.description}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900">₹{comp.ourRate.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-700">₹{comp.dsrRate.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-medium ${
                    comp.dsrDiff > 5 ? 'text-red-600' : comp.dsrDiff > 0 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {comp.dsrDiff > 0 ? '+' : ''}{comp.dsrDiff.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-700">₹{comp.sorRate.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-medium ${
                    comp.sorDiff > 5 ? 'text-red-600' : comp.sorDiff > 0 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {comp.sorDiff > 0 ? '+' : ''}{comp.sorDiff.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SensitivityTab() {
  return (
    <div className="space-y-6">
      {/* Scenarios */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Sensitivity Analysis</h3>
          <p className="text-sm text-slate-500 mt-1">What-if scenarios for material and labour cost variations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Scenario</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Steel Change</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Cement Change</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Labour Change</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Total Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sensitivityScenarios.map(scenario => (
                <tr key={scenario.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">{scenario.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${
                      scenario.steelChange > 0 ? 'text-red-600' : scenario.steelChange < 0 ? 'text-green-600' : 'text-slate-700'
                    }`}>
                      {scenario.steelChange > 0 ? '+' : ''}{scenario.steelChange}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${
                      scenario.cementChange > 0 ? 'text-red-600' : scenario.cementChange < 0 ? 'text-green-600' : 'text-slate-700'
                    }`}>
                      {scenario.cementChange > 0 ? '+' : ''}{scenario.cementChange}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${
                      scenario.labourChange > 0 ? 'text-red-600' : scenario.labourChange < 0 ? 'text-green-600' : 'text-slate-700'
                    }`}>
                      {scenario.labourChange > 0 ? '+' : ''}{scenario.labourChange}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${
                      scenario.totalImpact > 0 ? 'text-red-600' : scenario.totalImpact < 0 ? 'text-green-600' : 'text-slate-700'
                    }`}>
                      {scenario.totalImpact > 0 ? '+' : ''}{scenario.totalImpact}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Impact */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Cost Impact Visualization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs text-indigo-100 mb-2">Base Estimate</p>
            <p className="text-2xl font-bold">₹23.81 Cr</p>
            <p className="text-xs text-indigo-200 mt-1">Approved estimate</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs text-indigo-100 mb-2">Worst Case (+10%)</p>
            <p className="text-2xl font-bold">₹26.19 Cr</p>
            <p className="text-xs text-indigo-200 mt-1">+₹2.38 Cr impact</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs text-indigo-100 mb-2">Best Case (-10%)</p>
            <p className="text-2xl font-bold">₹21.43 Cr</p>
            <p className="text-xs text-indigo-200 mt-1">-₹2.38 Cr savings</p>
          </div>
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
    indigo: 'bg-indigo-50 border-indigo-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
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
