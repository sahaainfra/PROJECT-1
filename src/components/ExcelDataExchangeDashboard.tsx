import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  templates,
  importJobs,
  importRows,
  importErrors,
  exportJobs,
  errorCodes,
  protocolControlPoints,
  xlsStats
} from '../data/excelDataExchangeData';

export function ExcelDataExchangeDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'import', label: 'Import', icon: '📥' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'export', label: 'Export', icon: '📤' },
    { id: 'errors', label: 'Error Reports', icon: '⚠️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Excel Data Exchange Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Part 12 — Controlled import/export with templates, validation, and approval workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
            ff.xls
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
                  ? 'bg-cyan-50 text-cyan-700 border-b-2 border-cyan-700'
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
      {activeTab === 'templates' && <TemplatesTab />}
      {activeTab === 'import' && <ImportTab />}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'export' && <ExportTab />}
      {activeTab === 'errors' && <ErrorsTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Templates"
          value={xlsStats.activeTemplates}
          subtitle={`${xlsStats.totalTemplates} total`}
          icon="📋"
          color="cyan"
        />
        <StatCard
          title="Imports"
          value={xlsStats.completedImports}
          subtitle={`${xlsStats.pendingApprovals} pending`}
          icon="📥"
          color="blue"
        />
        <StatCard
          title="Exports"
          value={xlsStats.completedExports}
          subtitle={`${xlsStats.processingExports} processing`}
          icon="📤"
          color="green"
        />
        <StatCard
          title="Errors"
          value={xlsStats.totalErrors}
          subtitle={`${xlsStats.criticalErrors} critical`}
          icon="⚠️"
          color="amber"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Imports */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Imports</h3>
          <div className="space-y-3">
            {importJobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  job.status === 'completed' ? 'bg-green-500' :
                  job.status === 'failed' ? 'bg-red-500' :
                  job.status === 'awaiting_approval' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{job.importId}</span>
                    {' '}— {job.fileName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {job.uploadedByName} • {job.totalRows} rows • {new Date(job.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  job.status === 'completed' ? 'bg-green-100 text-green-700' :
                  job.status === 'failed' ? 'bg-red-100 text-red-700' :
                  job.status === 'awaiting_approval' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {importJobs.filter(j => j.status === 'awaiting_approval').map(job => (
              <div key={job.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.importId}</p>
                    <p className="text-xs text-slate-500">{job.fileName}</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                    Awaiting Approval
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                  <div>
                    <span className="text-slate-500">Uploaded by:</span>
                    <span className="ml-1 font-medium">{job.uploadedByName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Rows:</span>
                    <span className="ml-1 font-medium">{job.validRows} valid / {job.totalRows} total</span>
                  </div>
                  {job.impactJson?.totalValue && (
                    <div className="col-span-2">
                      <span className="text-slate-500">Total Value:</span>
                      <span className="ml-1 font-medium">₹{(job.impactJson.totalValue / 100000).toFixed(2)} L</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
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
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded">
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

function TemplatesTab() {
  const [filter, setFilter] = useState('all');

  const filteredTemplates = templates.filter(t => 
    filter === 'all' ? true : t.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          {['all', 'active', 'draft', 'approved', 'retired'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === status
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Template Center</h3>
          <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
            + New Template
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Version</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTemplates.map(template => (
                <tr key={template.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-slate-900">{template.code}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{template.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {template.module}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 capitalize">{template.entityType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">v{template.version}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      template.status === 'active' ? 'bg-green-100 text-green-700' :
                      template.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                      template.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{template.usageCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700">
                        Download
                      </button>
                      <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                        Edit
                      </button>
                    </div>
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

function ImportTab() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Import Wizard</h3>
        <div className="flex items-center justify-between mb-8">
          {['Upload', 'Validate', 'Preview', 'Approve', 'Execute'].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className={`flex flex-col items-center ${idx < step ? 'text-cyan-600' : 'text-slate-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  idx < step ? 'bg-cyan-600 border-cyan-600 text-white' :
                  idx === step - 1 ? 'border-cyan-600 text-cyan-600' :
                  'border-slate-300 text-slate-400'
                }`}>
                  {idx < step ? '✓' : idx + 1}
                </div>
                <span className="text-xs font-medium mt-2">{label}</span>
              </div>
              {idx < 4 && (
                <div className={`w-16 h-0.5 mx-2 ${idx < step - 1 ? 'bg-cyan-600' : 'bg-slate-300'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Template</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">Choose a template...</option>
                {templates.filter(t => t.status === 'active').map(t => (
                  <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload File</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-2">📁</div>
                <p className="text-sm text-slate-600">Drag and drop your Excel file here, or click to browse</p>
                <p className="text-xs text-slate-400 mt-2">Supported formats: .xlsx, .csv (Max 25 MB, 50,000 rows)</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Import Mode</label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500">
                  <input type="radio" name="mode" value="all_or_nothing" className="mr-2" defaultChecked />
                  <div>
                    <p className="text-sm font-medium text-slate-900">All or Nothing</p>
                    <p className="text-xs text-slate-500">Import all or fail completely</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500">
                  <input type="radio" name="mode" value="valid_only" className="mr-2" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Valid Only</p>
                    <p className="text-xs text-slate-500">Import only valid rows</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500">
                  <input type="radio" name="mode" value="correct_and_reupload" className="mr-2" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Correct & Reupload</p>
                    <p className="text-xs text-slate-500">Fix errors and try again</p>
                  </div>
                </label>
              </div>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700"
            >
              Upload & Validate
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Validation Complete</h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-700">25</p>
                  <p className="text-xs text-blue-600">Total Rows</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">23</p>
                  <p className="text-xs text-green-600">Valid</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">2</p>
                  <p className="text-xs text-red-600">Invalid</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">0</p>
                  <p className="text-xs text-amber-600">Duplicates</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700"
              >
                View Preview
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Row Classification</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <p className="text-2xl font-bold text-green-700">23</p>
                  <p className="text-xs text-green-600">CREATE</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <p className="text-2xl font-bold text-blue-700">0</p>
                  <p className="text-xs text-blue-600">UPDATE</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                  <p className="text-2xl font-bold text-red-700">2</p>
                  <p className="text-xs text-red-600">REJECT</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                  <p className="text-2xl font-bold text-amber-700">0</p>
                  <p className="text-xs text-amber-600">DUPLICATE</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h4 className="text-sm font-semibold text-cyan-900 mb-2">Impact Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-cyan-700">Total Value:</span>
                  <span className="ml-2 font-bold text-cyan-900">₹1.25 Cr</span>
                </div>
                <div>
                  <span className="text-cyan-700">Budget Impact:</span>
                  <span className="ml-2 font-bold text-cyan-900">₹1.25 Cr</span>
                </div>
                <div>
                  <span className="text-cyan-700">Tax Impact:</span>
                  <span className="ml-2 font-bold text-cyan-900">₹22.5 L</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(4)}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">Awaiting Approval</h4>
              <p className="text-xs text-amber-700">
                This import requires approval from the Procurement Manager due to financial value exceeding ₹10 Lakhs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(5)}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700"
                disabled
              >
                Waiting for Approval...
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-green-900 mb-2">Import Complete</h4>
              <div className="grid grid-cols-3 gap-4 text-center mt-3">
                <div>
                  <p className="text-2xl font-bold text-green-700">23</p>
                  <p className="text-xs text-green-600">Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">0</p>
                  <p className="text-xs text-blue-600">Updated</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">2</p>
                  <p className="text-xs text-red-600">Rejected</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setStep(1)}
              className="w-full px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700"
            >
              Start New Import
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryTab() {
  const [filter, setFilter] = useState('all');

  const filteredJobs = importJobs.filter(job => 
    filter === 'all' ? true : job.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          {['all', 'completed', 'awaiting_approval', 'failed', 'importing'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === status
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Import History */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Import History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Import ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Template</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">File</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Uploaded By</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Rows</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Valid</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Invalid</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-slate-900">{job.importId}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{job.templateCode}</p>
                      <p className="text-xs text-slate-500">v{job.templateVersion}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{job.fileName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{job.uploadedByName}</p>
                      <p className="text-xs text-slate-500">{job.role}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{job.totalRows}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-green-600">{job.validRows}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-red-600">{job.invalidRows}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                      job.status === 'failed' ? 'bg-red-100 text-red-700' :
                      job.status === 'awaiting_approval' ? 'bg-amber-100 text-amber-700' :
                      job.status === 'importing' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(job.uploadedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700">
                        View
                      </button>
                      <button className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                        Download
                      </button>
                    </div>
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

function ExportTab() {
  return (
    <div className="space-y-6">
      {/* Export Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Export Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Purchase Order Register</option>
              <option>Material Stock Report</option>
              <option>Vendor Master Data</option>
              <option>Project Budget Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Excel (.xlsx)</option>
              <option>CSV (.csv)</option>
              <option>PDF (.pdf)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Scope</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Current Page</option>
              <option>Selected Records</option>
              <option>All Filtered Records</option>
              <option>Complete Dataset</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Filter</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>All Projects</option>
              <option>Riverside Tower</option>
              <option>Highway Bridge Phase 2</option>
            </select>
          </div>
        </div>
        <button className="mt-4 px-6 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700">
          Start Export
        </button>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Export History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Export ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Format</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Requested By</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Rows</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exportJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-slate-900">{job.exportId}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{job.sourceName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded uppercase">
                      {job.format}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{job.requestedByName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{job.rowCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                      job.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(job.startedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {job.status === 'completed' && (
                      <button className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700">
                        Download
                      </button>
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

function ErrorsTab() {
  const [selectedImport, setSelectedImport] = useState(importJobs[0]?.importId);

  const errors = importErrors.filter(e => e.importId === selectedImport);

  return (
    <div className="space-y-6">
      {/* Import Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Import</label>
        <select 
          value={selectedImport}
          onChange={(e) => setSelectedImport(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {importJobs.map(job => (
            <option key={job.id} value={job.importId}>
              {job.importId} — {job.fileName}
            </option>
          ))}
        </select>
      </div>

      {/* Error Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-2xl font-bold text-red-700">{errors.filter(e => e.severity === 'error').length}</p>
          <p className="text-xs text-red-600 mt-1">Errors</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-2xl font-bold text-amber-700">{errors.filter(e => e.severity === 'warning').length}</p>
          <p className="text-xs text-amber-600 mt-1">Warnings</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{errors.filter(e => e.severity === 'info').length}</p>
          <p className="text-xs text-blue-600 mt-1">Info</p>
        </div>
      </div>

      {/* Error List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Error Report</h3>
          <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
            Download Error Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Row</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Column</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Field</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Entered Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Expected</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Error Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {errors.map(error => (
                <tr key={error.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">{error.rowNo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{error.column}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{error.field}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{error.enteredValue}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600">{error.expectedValue}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-slate-900">{error.errorCode}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs text-slate-700">{error.description}</p>
                      <p className="text-xs text-slate-500 mt-1 italic">{error.correction}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      error.severity === 'error' ? 'bg-red-100 text-red-700' :
                      error.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {error.severity}
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

function StatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    cyan: 'bg-cyan-50 border-cyan-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200'
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
