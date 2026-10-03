import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  raciAssignments,
  actionLedger,
  processCatalogue,
  complianceScores,
  responsibilityItems,
  protocolControlPoints,
  accountabilityStats
} from '../data/accountabilityData';

export function AccountabilityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'raci', label: 'RACI Matrix', icon: '👥' },
    { id: 'ledger', label: 'Action Ledger', icon: '📜' },
    { id: 'responsibilities', label: 'My Responsibilities', icon: '✅' },
    { id: 'team', label: 'Team View', icon: '👨‍💼' },
    { id: 'scores', label: 'Compliance Scores', icon: '📈' },
    { id: 'processes', label: 'Process Catalogue', icon: '📋' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accountability & Responsibility</h1>
          <p className="text-sm text-slate-500 mt-1">Part 10 — RACI assignments, action ledger, and compliance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
            ff.acc
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
      {activeTab === 'raci' && <RaciTab />}
      {activeTab === 'ledger' && <LedgerTab />}
      {activeTab === 'responsibilities' && <ResponsibilitiesTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'scores' && <ScoresTab />}
      {activeTab === 'processes' && <ProcessesTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active RACI"
          value={accountabilityStats.activeRaciAssignments}
          subtitle={`${accountabilityStats.totalRaciAssignments} total`}
          icon="👥"
          color="teal"
        />
        <StatCard
          title="Ledger Entries"
          value={accountabilityStats.totalLedgerEntries}
          subtitle={`${accountabilityStats.todayLedgerEntries} today`}
          icon="📜"
          color="blue"
        />
        <StatCard
          title="Pending Tasks"
          value={accountabilityStats.pendingItems}
          subtitle={`${accountabilityStats.overdueItems} overdue`}
          icon="✅"
          color="amber"
        />
        <StatCard
          title="Avg. Compliance"
          value={`${accountabilityStats.averageComplianceScore}%`}
          subtitle="Last 30 days"
          icon="📈"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ledger Entries */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Actions</h3>
          <div className="space-y-3">
            {actionLedger.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  entry.action === 'CREATED' ? 'bg-green-500' :
                  entry.action === 'APPROVED' ? 'bg-blue-500' :
                  entry.action === 'REJECTED' ? 'bg-red-500' :
                  entry.action === 'EXCEPTION_REQUESTED' ? 'bg-amber-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{entry.actorName}</span>
                    {' '}{entry.action.toLowerCase()} {entry.docNo}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {entry.projectName} • {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  {entry.narrative && (
                    <p className="text-xs text-slate-600 mt-1 italic">{entry.narrative}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Items */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Overdue Responsibilities</h3>
          <div className="space-y-3">
            {responsibilityItems.filter(r => r.status === 'overdue').slice(0, 5).map(item => (
              <div key={item.id} className={`p-3 rounded-lg border ${
                item.priority === 'critical' ? 'bg-red-50 border-red-200' :
                item.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    item.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-900 font-medium">{item.title}</p>
                <p className="text-xs text-slate-600 mt-1">{item.docNo} • {item.projectName}</p>
                <p className="text-xs text-slate-500 mt-1">Assigned to: {item.assignedToName}</p>
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
    </div>
  );
}

function RaciTab() {
  const [filter, setFilter] = useState('all');

  const filteredAssignments = raciAssignments.filter(r => 
    filter === 'all' ? true : r.scopeType === filter
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter by scope:</span>
          {['all', 'project', 'site', 'department', 'wbs_node'].map(scope => (
            <button
              key={scope}
              onClick={() => setFilter(scope)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === scope
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {scope === 'all' ? 'All' : scope.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* RACI Matrix */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">RACI Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Scope</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Process</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Responsible</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Accountable</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Consulted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Informed</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAssignments.map(raci => (
                <tr key={raci.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{raci.scopeName}</p>
                      <p className="text-xs text-slate-500">{raci.scopeType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{raci.processName}</p>
                      <p className="text-xs text-slate-500 font-mono">{raci.processCode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      R: {raci.responsibleUserName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      A: {raci.accountableUserName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {raci.consultedUserNames.map((name, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                          C: {name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {raci.informedUserNames.map((name, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                          I: {name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">
                      <p>From: {new Date(raci.fromDate).toLocaleDateString()}</p>
                      <p>To: {raci.toDate ? new Date(raci.toDate).toLocaleDateString() : 'Present'}</p>
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

function LedgerTab() {
  const [filter, setFilter] = useState('all');

  const filteredEntries = actionLedger.filter(entry => 
    filter === 'all' ? true : entry.action === filter
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter by action:</span>
          {['all', 'CREATED', 'APPROVED', 'REJECTED', 'EXCEPTION_REQUESTED'].map(action => (
            <button
              key={action}
              onClick={() => setFilter(action)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === action
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {action === 'all' ? 'All' : action.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Action Ledger Timeline */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Action Ledger Timeline</h3>
        </div>
        <div className="p-6">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            <div className="space-y-6">
              {filteredEntries.map((entry, idx) => (
                <div key={entry.id} className="relative flex items-start gap-4">
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    entry.action === 'CREATED' ? 'bg-green-500' :
                    entry.action === 'APPROVED' ? 'bg-blue-500' :
                    entry.action === 'REJECTED' ? 'bg-red-500' :
                    entry.action === 'EXCEPTION_REQUESTED' ? 'bg-amber-500' :
                    'bg-slate-400'
                  }`}>
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {entry.action.replace('_', ' ')} - {entry.docNo}
                        </p>
                        <p className="text-xs text-slate-500">{entry.entityType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400">{entry.actorRole}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p><span className="font-medium">Actor:</span> {entry.actorName}</p>
                      <p><span className="font-medium">Project:</span> {entry.projectName}</p>
                      {entry.siteName && <p><span className="font-medium">Site:</span> {entry.siteName}</p>}
                      {entry.narrative && <p className="italic mt-2">{entry.narrative}</p>}
                      {entry.reasonCode && (
                        <p className="mt-2">
                          <span className="font-medium">Reason:</span> {entry.reasonCode}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                      <span>Audit: {entry.auditId}</span>
                      {entry.workflowTaskId && <span>• Workflow: {entry.workflowTaskId}</span>}
                      {entry.protocolEvaluationId && <span>• Protocol: {entry.protocolEvaluationId}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResponsibilitiesTab() {
  const myItems = responsibilityItems.filter(r => r.assignedTo === 'usr_pm_001');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Pending"
          value={myItems.filter(i => i.status === 'pending').length}
          subtitle="Awaiting action"
          icon="⏳"
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={myItems.filter(i => i.status === 'in_progress').length}
          subtitle="Working on"
          icon="🔄"
          color="teal"
        />
        <StatCard
          title="Overdue"
          value={myItems.filter(i => i.status === 'overdue').length}
          subtitle="Past due date"
          icon="⚠️"
          color="red"
        />
        <StatCard
          title="Total"
          value={myItems.length}
          subtitle="All items"
          icon="📊"
          color="slate"
        />
      </div>

      {/* My Responsibilities */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">My Responsibilities</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {myItems.map(item => (
            <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      item.itemType === 'approval' ? 'bg-blue-100 text-blue-700' :
                      item.itemType === 'task' ? 'bg-teal-100 text-teal-700' :
                      item.itemType === 'exception' ? 'bg-amber-100 text-amber-700' :
                      item.itemType === 'violation' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {item.itemType.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      item.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {item.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      item.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'in_progress' ? 'bg-teal-100 text-teal-700' :
                      item.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.docNo} • {item.projectName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Due:</p>
                  <p className={`text-sm font-medium ${
                    item.status === 'overdue' ? 'text-red-600' : 'text-slate-900'
                  }`}>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
                  Take Action
                </button>
                <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  const teamMembers = [
    { id: 'usr_pm_001', name: 'Rajesh Kumar', role: 'Project Manager', pending: 3, overdue: 1 },
    { id: 'usr_proc_001', name: 'Vikram Singh', role: 'Procurement Manager', pending: 2, overdue: 0 },
    { id: 'usr_store_001', name: 'Suresh Nair', role: 'Store Keeper', pending: 1, overdue: 0 },
    { id: 'usr_acct_001', name: 'Priya Sharma', role: 'Accounts Manager', pending: 4, overdue: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Team Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Workload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map(member => (
            <div key={member.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-lg font-bold text-blue-700">{member.pending}</p>
                  <p className="text-xs text-blue-600">Pending</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="text-lg font-bold text-red-700">{member.overdue}</p>
                  <p className="text-xs text-red-600">Overdue</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Responsibilities */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">All Team Responsibilities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {responsibilityItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.docNo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {item.itemType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{item.assignedToName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${
                      item.status === 'overdue' ? 'text-red-600 font-medium' : 'text-slate-700'
                    }`}>
                      {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'in_progress' ? 'bg-teal-100 text-teal-700' :
                      item.status === 'overdue' ? 'bg-red-100 text-red-700' :
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

function ScoresTab() {
  return (
    <div className="space-y-6">
      {/* User Scores */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">User Compliance Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceScores.filter(s => s.subjectType === 'user').map(score => (
            <div key={score.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{score.subjectName}</p>
                  <p className="text-xs text-slate-500">Period: {score.period}</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    score.score >= 90 ? 'text-green-600' :
                    score.score >= 80 ? 'text-blue-600' :
                    score.score >= 70 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {score.score}%
                  </p>
                  <p className={`text-xs ${
                    score.trend === 'up' ? 'text-green-600' :
                    score.trend === 'down' ? 'text-red-600' :
                    'text-slate-500'
                  }`}>
                    {score.trend === 'up' ? '↑' : score.trend === 'down' ? '↓' : '→'}
                    {score.previousScore && ` from ${score.previousScore}%`}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <ScoreComponent label="On-Time Completion" value={score.components.onTimeCompletion} />
                <ScoreComponent label="Quality Score" value={score.components.qualityScore} />
                <ScoreComponent label="Protocol Compliance" value={score.components.protocolCompliance} />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Exception Rate</span>
                  <span className="font-medium text-slate-900">{score.components.exceptionRate}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Violations</span>
                  <span className="font-medium text-slate-900">{score.components.violationCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Scores */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Compliance Scores</h3>
        <div className="space-y-3">
          {complianceScores.filter(s => s.subjectType === 'project').map(score => (
            <div key={score.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{score.subjectName}</p>
                  <p className="text-xs text-slate-500">Period: {score.period}</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    score.score >= 90 ? 'text-green-600' :
                    score.score >= 80 ? 'text-blue-600' :
                    score.score >= 70 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {score.score}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-slate-900">{score.components.onTimeCompletion}%</p>
                  <p className="text-slate-500">On-Time</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-slate-900">{score.components.qualityScore}%</p>
                  <p className="text-slate-500">Quality</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-slate-900">{score.components.protocolCompliance}%</p>
                  <p className="text-slate-500">Protocol</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-slate-900">{score.components.exceptionRate}%</p>
                  <p className="text-slate-500">Exceptions</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-slate-900">{score.components.violationCount}</p>
                  <p className="text-slate-500">Violations</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProcessesTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Process Catalogue</h3>
        <p className="text-sm text-slate-500 mt-1">All processes requiring RACI assignments</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Process Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Module</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Requires RACI</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Independent Accountability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {processCatalogue.map(proc => (
              <tr key={proc.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <code className="text-sm font-mono text-slate-900">{proc.processCode}</code>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    {proc.module}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{proc.description}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {proc.requiresRaci ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {proc.requiresIndependentAccountability ? (
                    <span className="text-amber-600 font-medium">Required</span>
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
  );
}

function ScoreComponent({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${
            value >= 90 ? 'bg-green-500' :
            value >= 80 ? 'bg-blue-500' :
            value >= 70 ? 'bg-amber-500' :
            'bg-red-500'
          }`}
          style={{ width: `${value}%` }}
        ></div>
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
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
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
