import { useState } from 'react';
import {
  formRegistry,
  drafts,
  duplicateRules,
  bulkEditJobs,
  quickActions,
  duplicateWarnings,
  contextBundle,
  protocolControlPoints,
  dataEntryStats
} from '../data/dataEntryData';

export function DataEntryFramework() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'forms', label: 'Form Registry', icon: '📋' },
    { id: 'drafts', label: 'Drafts', icon: '💾' },
    { id: 'duplicates', label: 'Duplicate Detection', icon: '⚠️' },
    { id: 'bulk', label: 'Bulk Edit', icon: '🔄' },
    { id: 'workspace', label: 'My Workspace', icon: '🏠' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Data-Entry Framework</h1>
          <p className="text-sm text-slate-500 mt-1">Part 16 — Smart forms with context auto-fill, drafts, and bulk editing</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">
            ff.dex
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
                  ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-700'
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
      {activeTab === 'forms' && <FormsTab />}
      {activeTab === 'drafts' && <DraftsTab />}
      {activeTab === 'duplicates' && <DuplicatesTab />}
      {activeTab === 'bulk' && <BulkTab />}
      {activeTab === 'workspace' && <WorkspaceTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Forms"
          value={dataEntryStats.activeForms}
          subtitle={`${dataEntryStats.totalForms} total`}
          icon="📋"
          color="orange"
        />
        <StatCard
          title="Active Drafts"
          value={dataEntryStats.activeDrafts}
          subtitle="Pending submission"
          icon="💾"
          color="blue"
        />
        <StatCard
          title="Duplicate Rules"
          value={dataEntryStats.totalDuplicateRules}
          subtitle={`${dataEntryStats.blockRules} block, ${dataEntryStats.warnRules} warn`}
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Bulk Edits"
          value={dataEntryStats.executedBulkEdits}
          subtitle={`${dataEntryStats.totalBulkEdits} total`}
          icon="🔄"
          color="green"
        />
      </div>

      {/* Framework Features */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Framework Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="🎯"
            title="Context Auto-Fill"
            description="Selecting a project auto-fills sites, activities, BOQ items, vendors, materials, and employees"
          />
          <FeatureCard
            icon="💡"
            title="Smart Defaults"
            description="Auto-focus, logical field order, smart defaults from context and user preferences"
          />
          <FeatureCard
            icon="🔍"
            title="Searchable Lookups"
            description="Autocomplete with recent and frequently used values, quick-add for new masters"
          />
          <FeatureCard
            icon="📋"
            title="Copy & Duplicate"
            description="Copy previous transactions, duplicate with new numbers, templates from previous periods"
          />
          <FeatureCard
            icon="🧮"
            title="Auto Calculations"
            description="Automatic totals, unit conversions, derived quantities and amounts"
          />
          <FeatureCard
            icon="✓"
            title="Real-time Validation"
            description="Inline validation for mandatory fields, duplicates, budget violations, and conflicts"
          />
          <FeatureCard
            icon="💾"
            title="Auto-Save Drafts"
            description="Periodic auto-save, draft recovery after crash, resume later with version history"
          />
          <FeatureCard
            icon="🔄"
            title="Bulk Editing"
            description="Filtered selection, preview changes, approval workflow, audit per record"
          />
          <FeatureCard
            icon="📱"
            title="Mobile Entry"
            description="Camera capture, voice-to-text, GPS validation, offline drafts for field work"
          />
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
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
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

function FormsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Form Registry</h3>
          <p className="text-sm text-slate-500 mt-1">Declarative metadata for all registered forms</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Form Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Entity Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Version</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Fields</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Auto-Save</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {formRegistry.map(form => (
                <tr key={form.formCode} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-orange-700 font-semibold">{form.formCode}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{form.module}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{form.entityType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">v{form.version}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{form.fieldSequence.length}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {form.autosaveEnabled ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      form.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {form.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Context Bundle Preview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Context Auto-Fill Bundle</h3>
        <p className="text-sm text-slate-600 mb-4">
          When a user selects a project, the system automatically loads related data for form fields
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="text-sm font-semibold text-orange-900 mb-2">Project: {contextBundle.projectName}</h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-orange-700 font-medium">Sites:</span>
                <span className="ml-2 text-slate-700">{contextBundle.sites.map(s => s.name).join(', ')}</span>
              </div>
              <div>
                <span className="text-orange-700 font-medium">Activities:</span>
                <span className="ml-2 text-slate-700">{contextBundle.activities.length} items</span>
              </div>
              <div>
                <span className="text-orange-700 font-medium">BOQ Items:</span>
                <span className="ml-2 text-slate-700">{contextBundle.boqItems.length} items</span>
              </div>
              <div>
                <span className="text-orange-700 font-medium">Vendors:</span>
                <span className="ml-2 text-slate-700">{contextBundle.vendors.length} vendors</span>
              </div>
              <div>
                <span className="text-orange-700 font-medium">Materials:</span>
                <span className="ml-2 text-slate-700">{contextBundle.materials.length} materials</span>
              </div>
              <div>
                <span className="text-orange-700 font-medium">Employees:</span>
                <span className="ml-2 text-slate-700">{contextBundle.employees.length} employees</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Auto-Fill Benefits</h4>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>✓ Reduces data entry errors</li>
              <li>✓ Ensures data consistency</li>
              <li>✓ Speeds up form completion</li>
              <li>✓ Validates references in real-time</li>
              <li>✓ Provides contextual suggestions</li>
              <li>✓ Maintains audit trail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraftsTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Active Drafts"
          value={dataEntryStats.activeDrafts}
          subtitle="Ready to submit"
          icon="💾"
          color="blue"
        />
        <StatCard
          title="Expiring Soon"
          value={drafts.filter(d => new Date(d.expiresAt) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)).length}
          subtitle="Within 2 days"
          icon="⏰"
          color="amber"
        />
        <StatCard
          title="Total Drafts"
          value={dataEntryStats.totalDrafts}
          subtitle="All time"
          icon="📁"
          color="slate"
        />
      </div>

      {/* Drafts List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">My Drafts</h3>
          <p className="text-sm text-slate-500 mt-1">Unsubmitted forms with auto-save</p>
        </div>
        <div className="divide-y divide-slate-200">
          {drafts.map(draft => (
            <div key={draft.draftId} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                      {draft.formCode}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{draft.entityType}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      draft.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      draft.status === 'submitted' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {draft.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Saved {new Date(draft.savedAt).toLocaleString()} • Version {draft.version}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Expires</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(draft.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Draft Preview */}
              <div className="p-3 bg-slate-50 rounded-lg mb-3">
                <p className="text-xs font-medium text-slate-700 mb-2">Draft Data:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(draft.payloadJson).slice(0, 4).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-slate-500">{key}:</span>
                      <span className="ml-1 text-slate-700 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700">
                  Resume Editing
                </button>
                <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                  Submit
                </button>
                <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
                  Discard
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DuplicatesTab() {
  return (
    <div className="space-y-6">
      {/* Duplicate Rules */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Duplicate Detection Rules</h3>
        <div className="space-y-3">
          {duplicateRules.map(rule => (
            <div key={rule.ruleCode} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-orange-700 font-semibold">{rule.ruleCode}</code>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    rule.action === 'block' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {rule.action.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{rule.entityType}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Match Fields:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {rule.matchFields.map(field => (
                      <span key={field} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Window:</span>
                  <span className="ml-1 text-slate-700 font-medium">{rule.windowDays} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Warnings */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Duplicate Warnings</h3>
        <div className="space-y-3">
          {duplicateWarnings.map(warning => (
            <div key={warning.id} className={`p-4 rounded-lg border ${
              warning.action === 'block' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    warning.action === 'block' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {warning.action === 'block' ? '🚫 BLOCK' : '⚠️ WARNING'}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{warning.entityType}</span>
                  <span className="text-xs text-slate-500">Match Score: {(warning.matchScore * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-700 mb-2">Existing Record:</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(warning.existingRecord).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-slate-700 font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-700 mb-2">New Record:</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(warning.newRecord).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-slate-700 font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600">
                <span className="font-medium">Match Fields:</span> {warning.matchFields.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BulkTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Jobs"
          value={dataEntryStats.totalBulkEdits}
          subtitle="All time"
          icon="🔄"
          color="blue"
        />
        <StatCard
          title="Executed"
          value={dataEntryStats.executedBulkEdits}
          subtitle="Completed"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Pending"
          value={bulkEditJobs.filter(j => ['preview', 'submitted', 'approved'].includes(j.status)).length}
          subtitle="In progress"
          icon="⏳"
          color="amber"
        />
      </div>

      {/* Bulk Edit Jobs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Bulk Edit Jobs</h3>
            <p className="text-sm text-slate-500 mt-1">Mass updates with approval workflow</p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700">
            + New Bulk Edit
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {bulkEditJobs.map(job => (
            <div key={job.jobId} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                      {job.entityType}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      job.status === 'executed' ? 'bg-green-100 text-green-700' :
                      job.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      job.status === 'preview' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Requested by {job.requestedByName} on {new Date(job.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{job.recordCount}</p>
                  <p className="text-xs text-slate-500">Records</p>
                </div>
              </div>

              {/* Changes Preview */}
              <div className="p-3 bg-slate-50 rounded-lg mb-3">
                <p className="text-xs font-medium text-slate-700 mb-2">Changes:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Filter:</span>
                    <pre className="mt-1 text-slate-700 font-mono text-[10px] overflow-x-auto">
                      {JSON.stringify(job.filterJson, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-500">Update:</span>
                    <pre className="mt-1 text-slate-700 font-mono text-[10px] overflow-x-auto">
                      {JSON.stringify(job.fieldsChanged, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {job.status === 'preview' && (
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Submit for Approval
                  </button>
                  <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
                    Cancel
                  </button>
                </div>
              )}

              {job.status === 'executed' && (
                <div className="text-xs text-slate-500">
                  Executed on {job.executedAt && new Date(job.executedAt).toLocaleString()}
                  {job.auditBatchId && ` • Audit Batch: ${job.auditBatchId}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkspaceTab() {
  const role = 'project_manager';
  const roleActions = quickActions.filter(a => a.role === role);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roleActions.map(action => (
            <button
              key={action.formCode}
              className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors text-left"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-sm font-medium text-orange-900">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Drafts */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">My Recent Drafts</h3>
        <div className="space-y-2">
          {drafts.slice(0, 3).map(draft => (
            <div key={draft.draftId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                  {draft.formCode}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{draft.entityType}</p>
                  <p className="text-xs text-slate-500">Saved {new Date(draft.savedAt).toLocaleString()}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700">
                Resume
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Benefits */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Framework Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">🚀 Efficiency</h4>
            <ul className="space-y-1 text-xs">
              <li>• 60% faster data entry with auto-fill</li>
              <li>• Reduced errors with real-time validation</li>
              <li>• Quick access to frequent forms</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">🔒 Data Quality</h4>
            <ul className="space-y-1 text-xs">
              <li>• Duplicate prevention</li>
              <li>• Consistent data across modules</li>
              <li>• Complete audit trail</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">📱 Mobile Ready</h4>
            <ul className="space-y-1 text-xs">
              <li>• Field data capture with camera/GPS</li>
              <li>• Offline drafts with sync</li>
              <li>• Touch-optimized interfaces</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">🔄 Bulk Operations</h4>
            <ul className="space-y-1 text-xs">
              <li>• Mass updates with approval</li>
              <li>• Preview before execution</li>
              <li>• Detailed audit per record</li>
            </ul>
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
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    green: 'bg-green-50 border-green-200',
    slate: 'bg-slate-50 border-slate-200'
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

function FeatureCard({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-600">{description}</p>
    </div>
  );
}
