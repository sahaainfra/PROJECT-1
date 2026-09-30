import { useState } from 'react';
import { 
  workflowDefinitions, 
  workflowSteps, 
  workflowInstances, 
  workflowTasks, 
  delegations, 
  workflowStats,
  protocolControlPoints,
  workflowActions
} from '../data/workflowData';

export function WorkflowDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'definitions', label: 'Definitions', icon: '🔧' },
    { id: 'approvals', label: 'My Approvals', icon: '✅' },
    { id: 'instances', label: 'Instances', icon: '📋' },
    { id: 'delegations', label: 'Delegations', icon: '🔄' },
    { id: 'sla', label: 'SLA Monitor', icon: '⏱️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workflow & Approval Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Part 6 — Configurable workflow engine for all document types</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            ff.wf
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
      {activeTab === 'definitions' && <DefinitionsTab />}
      {activeTab === 'approvals' && <ApprovalsTab />}
      {activeTab === 'instances' && <InstancesTab />}
      {activeTab === 'delegations' && <DelegationsTab />}
      {activeTab === 'sla' && <SLATab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Workflow Definitions"
          value={workflowStats.totalDefinitions}
          subtitle={`${workflowStats.activeDefinitions} active`}
          icon="🔧"
          color="indigo"
        />
        <StatCard
          title="Active Instances"
          value={workflowStats.pendingInstances}
          subtitle={`${workflowStats.totalInstances} total`}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Pending Tasks"
          value={workflowStats.pendingTasks}
          subtitle={`${workflowStats.overdueTasks} overdue`}
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Avg. Turnaround"
          value={`${workflowStats.avgTurnaroundHours}h`}
          subtitle="Target: < 48h"
          icon="⚡"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Workflow Activity</h3>
        <div className="space-y-3">
          {workflowActions.slice(0, 5).map(action => (
            <div key={action.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                action.action === 'approve' ? 'bg-green-500' :
                action.action === 'reject' ? 'bg-red-500' :
                action.action === 'submit' ? 'bg-blue-500' :
                'bg-slate-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{action.actorName}</span>
                  {' '}{action.action}ed workflow
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(action.at).toLocaleString()}
                  {action.comment && ` • ${action.comment}`}
                </p>
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded">
                    {cp.stage}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                    {cp.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefinitionsTab() {
  const [selectedDef, setSelectedDef] = useState(workflowDefinitions[0]?.id);
  const selectedWorkflow = workflowDefinitions.find(d => d.id === selectedDef);
  const steps = workflowSteps.filter(s => s.definitionId === selectedDef);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Definitions List */}
      <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Workflow Definitions</h3>
        <div className="space-y-2">
          {workflowDefinitions.map(def => (
            <button
              key={def.id}
              onClick={() => setSelectedDef(def.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedDef === def.id
                  ? 'bg-indigo-50 border-2 border-indigo-500'
                  : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-900">{def.name}</span>
                <span className="text-xs text-slate-500">v{def.version}</span>
              </div>
              <p className="text-xs text-slate-500">{def.code}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-600">{def.stepsCount} steps</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600">{def.instanceCount} instances</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Designer */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{selectedWorkflow?.name}</h3>
            <p className="text-sm text-slate-500">{selectedWorkflow?.code} • Version {selectedWorkflow?.version}</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Edit Definition
          </button>
        </div>

        {/* Workflow Steps Visualization */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-300" />
              )}
              
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-700">{step.seq}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900">{step.name}</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      {step.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Approver: <span className="font-medium">{step.approverRuleType}</span> → {step.approverRuleValue || 'Auto-resolve'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>⏱️ SLA: {step.slaHours}h</span>
                    {step.escalateToRule && (
                      <span>⬆️ Escalate to: {step.escalateToRule}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simulation Button */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Test Simulation</h4>
          <p className="text-xs text-blue-700 mb-3">
            Simulate workflow routing: "Who would approve a PO of ₹12 lakh on Project P3?"
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Run Simulation
          </button>
        </div>
      </div>
    </div>
  );
}

function ApprovalsTab() {
  const myTasks = workflowTasks.filter(t => t.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Pending Approvals"
          value={myTasks.length}
          subtitle="Action required"
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Overdue"
          value={myTasks.filter(t => t.remainingHours <= 0).length}
          subtitle="Past SLA"
          icon="⚠️"
          color="red"
        />
        <StatCard
          title="Due Today"
          value={myTasks.filter(t => t.remainingHours > 0 && t.remainingHours <= 24).length}
          subtitle="Within 24h"
          icon="📅"
          color="blue"
        />
        <StatCard
          title="Approved Today"
          value={workflowTasks.filter(t => t.status === 'approved' && t.actedAt && new Date(t.actedAt).toDateString() === new Date().toDateString()).length}
          subtitle="Completed"
          icon="✅"
          color="green"
        />
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">My Approval Queue</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {myTasks.map(task => {
            const instance = workflowInstances.find(i => i.id === task.instanceId);
            return (
              <div key={task.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{instance?.docNumber}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                        {instance?.docType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Submitted by {instance?.submittedByName} • {new Date(instance?.submittedAt || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      ₹{(instance?.amountSnapshot || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{instance?.contextJson.project}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Step:</span>
                    <span className="text-xs font-medium text-slate-700">{task.stepName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">SLA:</span>
                    <span className={`text-xs font-medium ${
                      task.remainingHours <= 0 ? 'text-red-600' :
                      task.remainingHours <= 24 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {task.remainingHours <= 0 ? 'Overdue' : `${task.remainingHours}h remaining`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
                    Return
                  </button>
                  <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InstancesTab() {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredInstances = statusFilter === 'all' 
    ? workflowInstances 
    : workflowInstances.filter(i => i.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          {['all', 'in_progress', 'approved', 'rejected', 'returned'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Instances Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredInstances.map(instance => (
              <tr key={instance.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{instance.docNumber}</p>
                    <p className="text-xs text-slate-500">by {instance.submittedByName}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{instance.docType.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900">
                    ₹{instance.amountSnapshot.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={instance.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 w-24">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(instance.completedTasks / instance.tasksCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">
                      {instance.completedTasks}/{instance.tasksCount}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-500">
                    {new Date(instance.submittedAt).toLocaleDateString()}
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

function DelegationsTab() {
  return (
    <div className="space-y-6">
      {/* Active Delegations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Active Delegations</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Create Delegation
          </button>
        </div>
        <div className="space-y-3">
          {delegations.filter(d => d.status === 'active').map(del => (
            <div key={del.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {del.delegatorName} → {del.delegateName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{del.reason}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  {del.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>📅 {del.fromDate} to {del.toDate}</span>
                <span>📋 {del.docTypes.join(', ')}</span>
                <span>🎯 {del.scope}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Delegations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pending Approval</h3>
        <div className="space-y-3">
          {delegations.filter(d => d.status === 'pending').map(del => (
            <div key={del.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {del.delegatorName} → {del.delegateName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{del.reason}</p>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                  {del.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                <span>📅 {del.fromDate} to {del.toDate}</span>
                <span>📋 {del.docTypes.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">
                  Approve
                </button>
                <button className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SLATab() {
  const overdueTasks = workflowTasks.filter(t => t.status === 'pending' && t.remainingHours <= 0);
  const atRiskTasks = workflowTasks.filter(t => t.status === 'pending' && t.remainingHours > 0 && t.remainingHours <= 24);

  return (
    <div className="space-y-6">
      {/* SLA Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="On Track"
          value={workflowTasks.filter(t => t.status === 'pending' && t.remainingHours > 24).length}
          subtitle="Tasks"
          icon="✅"
          color="green"
        />
        <StatCard
          title="At Risk"
          value={atRiskTasks.length}
          subtitle="< 24h remaining"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks.length}
          subtitle="Past SLA"
          icon="🚨"
          color="red"
        />
        <StatCard
          title="Avg. Turnaround"
          value={`${workflowStats.avgTurnaroundHours}h`}
          subtitle="Last 30 days"
          icon="⚡"
          color="blue"
        />
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Overdue Tasks</h3>
          <div className="space-y-3">
            {overdueTasks.map(task => {
              const instance = workflowInstances.find(i => i.id === task.instanceId);
              return (
                <div key={task.id} className="p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{instance?.docNumber}</p>
                      <p className="text-xs text-slate-500">{task.stepName}</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      Overdue
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>👤 {task.assigneeName}</span>
                    <span>⏱️ SLA: {task.slaHours}h</span>
                    <span>📅 Due: {new Date(task.dueAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">
                      Escalate
                    </button>
                    <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                      Send Reminder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* At Risk Tasks */}
      {atRiskTasks.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">At Risk Tasks</h3>
          <div className="space-y-3">
            {atRiskTasks.map(task => {
              const instance = workflowInstances.find(i => i.id === task.instanceId);
              return (
                <div key={task.id} className="p-4 bg-white rounded-lg border border-amber-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{instance?.docNumber}</p>
                      <p className="text-xs text-slate-500">{task.stepName}</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                      {task.remainingHours}h remaining
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>👤 {task.assigneeName}</span>
                    <span>⏱️ SLA: {task.slaHours}h</span>
                    <span>📅 Due: {new Date(task.dueAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    green: 'bg-green-50 border-green-200',
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

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
    returned: { label: 'Returned', color: 'bg-amber-100 text-amber-700' },
    cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-700' },
    recalled: { label: 'Recalled', color: 'bg-slate-100 text-slate-700' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${config.color}`}>
      {config.label}
    </span>
  );
}
