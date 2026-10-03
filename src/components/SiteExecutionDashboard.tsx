import { useState } from 'react';
import {
  workFronts,
  dailyPlans,
  constraints,
  delays,
  siteInstructions,
  sitePhotos,
  protocolControlPoints,
  siteStats
} from '../data/siteExecutionData';

export function SiteExecutionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'work-fronts', label: 'Work Fronts', icon: '🏗️' },
    { id: 'daily-plans', label: 'Daily Plans', icon: '📅' },
    { id: 'constraints', label: 'Constraints', icon: '⚠️' },
    { id: 'delays', label: 'Delays', icon: '⏱️' },
    { id: 'instructions', label: 'Site Instructions', icon: '📝' },
    { id: 'photos', label: 'Photo Gallery', icon: '📷' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Site Execution</h1>
          <p className="text-sm text-slate-500 mt-1">Part 28 — Site control with work fronts, daily plans, constraints, and photo evidence</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
            ff.site
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
      {activeTab === 'work-fronts' && <WorkFrontsTab />}
      {activeTab === 'daily-plans' && <DailyPlansTab />}
      {activeTab === 'constraints' && <ConstraintsTab />}
      {activeTab === 'delays' && <DelaysTab />}
      {activeTab === 'instructions' && <InstructionsTab />}
      {activeTab === 'photos' && <PhotosTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Work Fronts"
          value={siteStats.totalWorkFronts}
          subtitle={`${siteStats.activeWorkFronts} active`}
          icon="🏗️"
          color="teal"
        />
        <StatCard
          title="Yesterday's PPC"
          value={`${siteStats.yesterdayPPC}%`}
          subtitle="Plan completion"
          icon="📊"
          color={siteStats.yesterdayPPC >= 80 ? 'green' : 'amber'}
        />
        <StatCard
          title="Open Constraints"
          value={siteStats.openConstraints}
          subtitle={`${siteStats.resolvedConstraints} resolved`}
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Active Delays"
          value={siteStats.activeDelays}
          subtitle={`${siteStats.totalDelayDays} days total`}
          icon="⏱️"
          color="red"
        />
      </div>

      {/* Today's Plan */}
      {siteStats.todayPlan && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Today's Plan - {new Date(siteStats.todayPlan.date).toLocaleDateString()}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              siteStats.todayPlan.status === 'published' ? 'bg-blue-100 text-blue-700' :
              siteStats.todayPlan.status === 'closed' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {siteStats.todayPlan.status.toUpperCase()}
            </span>
          </div>
          <div className="space-y-3">
            {siteStats.todayPlan.lines.map(line => (
              <div key={line.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-teal-700">{line.activityCode}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                        line.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                        line.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                        line.status === 'completed' ? 'bg-green-100 text-green-700' :
                        line.status === 'blocked' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {line.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{line.activityName}</p>
                    <p className="text-xs text-slate-500 mt-1">{line.workFrontName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {line.plannedQty} {line.uomName}
                    </p>
                    <p className="text-xs text-slate-500">Planned</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Crew:</span>
                    <span className="ml-1 text-slate-700">{line.crew}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Labour:</span>
                    <span className="ml-1 text-slate-700">
                      {Object.values(line.labourPlanned).reduce((a, b) => a + b, 0)} workers
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Supervisor:</span>
                    <span className="ml-1 text-slate-700">{line.supervisorName}</span>
                  </div>
                </div>
                {line.nonCompletionReason && (
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs text-amber-900">
                      <span className="font-medium">Note:</span> {line.nonCompletionReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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

function WorkFrontsTab() {
  return (
    <div className="space-y-6">
      {/* Work Front Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Available"
          value={siteStats.availableWorkFronts}
          subtitle="Ready for work"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Active"
          value={siteStats.activeWorkFronts}
          subtitle="Work in progress"
          icon="🏗️"
          color="blue"
        />
        <StatCard
          title="Blocked"
          value={siteStats.blockedWorkFronts}
          subtitle="Need resolution"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Completed"
          value={siteStats.completedWorkFronts}
          subtitle="Work finished"
          icon="✓"
          color="teal"
        />
      </div>

      {/* Work Front Board */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Work Front Board</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workFronts.map(front => (
            <div
              key={front.id}
              className={`p-4 rounded-lg border-2 ${
                front.status === 'available' ? 'bg-green-50 border-green-200' :
                front.status === 'active' ? 'bg-blue-50 border-blue-200' :
                front.status === 'blocked' ? 'bg-amber-50 border-amber-200' :
                'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-teal-700">{front.code}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      front.status === 'available' ? 'bg-green-100 text-green-700' :
                      front.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      front.status === 'blocked' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {front.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{front.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{front.location}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">WBS:</span>
                  <span className="text-slate-700 font-mono">{front.wbsNodeCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Site:</span>
                  <span className="text-slate-700">{front.siteName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Created:</span>
                  <span className="text-slate-700">{new Date(front.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {front.blockingReason && (
                <div className="mt-3 p-2 bg-amber-100 rounded border border-amber-300">
                  <p className="text-xs text-amber-900">
                    <span className="font-medium">Blocked:</span> {front.blockingReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DailyPlansTab() {
  return (
    <div className="space-y-6">
      {/* Plans List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Daily Plans</h3>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
            + Create Plan
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {dailyPlans.map(plan => (
            <div key={plan.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {new Date(plan.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      plan.status === 'published' ? 'bg-blue-100 text-blue-700' :
                      plan.status === 'closed' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {plan.status}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded capitalize">
                      {plan.shift}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Prepared by {plan.preparedByName} • {plan.lines.length} work items
                  </p>
                </div>
                {plan.ppc !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-slate-500">PPC</p>
                    <p className={`text-2xl font-bold ${
                      plan.ppc >= 80 ? 'text-green-600' :
                      plan.ppc >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {plan.ppc}%
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {plan.lines.map(line => (
                  <div key={line.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-teal-700">{line.activityCode}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                          line.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                          line.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                          line.status === 'completed' ? 'bg-green-100 text-green-700' :
                          line.status === 'blocked' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {line.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Completion:</span>
                        <span className="text-xs font-semibold text-slate-900">{line.completionPct}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-900 mb-1">{line.activityName}</p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Planned:</span>
                        <span className="ml-1 text-slate-700">{line.plannedQty} {line.uomName}</span>
                      </div>
                      {line.actualQty !== undefined && (
                        <div>
                          <span className="text-slate-500">Actual:</span>
                          <span className="ml-1 text-slate-700">{line.actualQty} {line.uomName}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-500">Crew:</span>
                        <span className="ml-1 text-slate-700">{line.crew}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Labour:</span>
                        <span className="ml-1 text-slate-700">
                          {Object.values(line.labourPlanned).reduce((a, b) => a + b, 0)} workers
                        </span>
                      </div>
                    </div>
                    {line.nonCompletionReason && (
                      <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                        <p className="text-xs text-amber-900">
                          <span className="font-medium">Reason:</span> {line.nonCompletionReason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConstraintsTab() {
  const openConstraints = constraints.filter(c => c.status === 'open' || c.status === 'in_progress');
  const resolvedConstraints = constraints.filter(c => c.status === 'resolved' || c.status === 'closed');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Open"
          value={openConstraints.length}
          subtitle="Need attention"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="In Progress"
          value={constraints.filter(c => c.status === 'in_progress').length}
          subtitle="Being resolved"
          icon="🔄"
          color="blue"
        />
        <StatCard
          title="Resolved"
          value={resolvedConstraints.length}
          subtitle="Completed"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Total Impact"
          value={`${constraints.reduce((sum, c) => sum + c.impactDays, 0)}d`}
          subtitle="Days of delay"
          icon="⏱️"
          color="red"
        />
      </div>

      {/* Constraints Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Open */}
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            Open ({openConstraints.filter(c => c.status === 'open').length})
          </h3>
          <div className="space-y-3">
            {openConstraints.filter(c => c.status === 'open').map(constraint => (
              <div key={constraint.id} className="p-3 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded capitalize">
                    {constraint.type}
                  </span>
                  <span className="text-xs text-amber-700 font-medium">
                    Impact: {constraint.impactDays}d
                  </span>
                </div>
                <p className="text-sm text-slate-900 mb-2">{constraint.description}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Raised by: {constraint.raisedByName}</p>
                  <p>Owner: {constraint.ownerName}</p>
                  <p>Need by: {new Date(constraint.needBy).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>🔄</span>
            In Progress ({constraints.filter(c => c.status === 'in_progress').length})
          </h3>
          <div className="space-y-3">
            {constraints.filter(c => c.status === 'in_progress').map(constraint => (
              <div key={constraint.id} className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded capitalize">
                    {constraint.type}
                  </span>
                  <span className="text-xs text-blue-700 font-medium">
                    Impact: {constraint.impactDays}d
                  </span>
                </div>
                <p className="text-sm text-slate-900 mb-2">{constraint.description}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Raised by: {constraint.raisedByName}</p>
                  <p>Owner: {constraint.ownerName}</p>
                  <p>Need by: {new Date(constraint.needBy).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
            <span>✓</span>
            Resolved ({resolvedConstraints.length})
          </h3>
          <div className="space-y-3">
            {resolvedConstraints.map(constraint => (
              <div key={constraint.id} className="p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded capitalize">
                    {constraint.type}
                  </span>
                  <span className="text-xs text-green-700 font-medium">
                    Resolved in {constraint.impactDays}d
                  </span>
                </div>
                <p className="text-sm text-slate-900 mb-2">{constraint.description}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Raised by: {constraint.raisedByName}</p>
                  <p>Resolved by: {constraint.resolvedBy}</p>
                  <p>Resolved on: {constraint.resolvedOn && new Date(constraint.resolvedOn).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DelaysTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Delays"
          value={siteStats.activeDelays}
          subtitle="In progress"
          icon="⏱️"
          color="red"
        />
        <StatCard
          title="Total Delay Days"
          value={siteStats.totalDelayDays}
          subtitle="Across all delays"
          icon="📅"
          color="amber"
        />
        <StatCard
          title="Client Caused"
          value={delays.filter(d => d.responsibleParty === 'client').length}
          subtitle="Potential claims"
          icon="👤"
          color="blue"
        />
        <StatCard
          title="Resolved"
          value={delays.filter(d => d.status === 'resolved').length}
          subtitle="Completed"
          icon="✓"
          color="green"
        />
      </div>

      {/* Delay Register */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Delay Register</h3>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
            + Record Delay
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {delays.map(delay => (
            <div key={delay.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {delay.activityCode && (
                      <span className="text-xs font-mono text-teal-700">{delay.activityCode}</span>
                    )}
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      delay.responsibleParty === 'client' ? 'bg-blue-100 text-blue-700' :
                      delay.responsibleParty === 'contractor' ? 'bg-amber-100 text-amber-700' :
                      delay.responsibleParty === 'subcontractor' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {delay.responsibleParty}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      delay.status === 'open' ? 'bg-red-100 text-red-700' :
                      delay.status === 'acknowledged' ? 'bg-amber-100 text-amber-700' :
                      delay.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {delay.status}
                    </span>
                  </div>
                  {delay.activityName && (
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{delay.activityName}</h4>
                  )}
                  <p className="text-sm text-slate-600">{delay.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{delay.durationDays}d</p>
                  <p className="text-xs text-slate-500">Duration</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Start:</span>
                  <span className="ml-1 text-slate-700">{new Date(delay.start).toLocaleDateString()}</span>
                </div>
                {delay.end && (
                  <div>
                    <span className="text-slate-500">End:</span>
                    <span className="ml-1 text-slate-700">{new Date(delay.end).toLocaleDateString()}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Cause:</span>
                  <span className="ml-1 text-slate-700 capitalize">{delay.causeCategory.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Recorded by:</span>
                  <span className="ml-1 text-slate-700">{delay.createdByName}</span>
                </div>
              </div>

              {delay.evidenceDocIds.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Evidence:</span>
                  <span className="text-xs text-teal-700">{delay.evidenceDocIds.length} documents</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstructionsTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Instructions"
          value={siteInstructions.length}
          subtitle="All time"
          icon="📝"
          color="blue"
        />
        <StatCard
          title="Pending Review"
          value={siteStats.pendingSiteInstructions}
          subtitle="Need action"
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Cost Impact"
          value={`₹${(siteInstructions.reduce((sum, si) => sum + (si.costImpactAmount || 0), 0) / 100000).toFixed(1)}L`}
          subtitle="Total impact"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Time Impact"
          value={`${siteInstructions.reduce((sum, si) => sum + (si.timeImpactDays || 0), 0)}d`}
          subtitle="Total delay"
          icon="⏱️"
          color="red"
        />
      </div>

      {/* Instructions Register */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Site Instruction Register</h3>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
            + Record Instruction
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {siteInstructions.map(instruction => (
            <div key={instruction.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-teal-700 font-semibold">{instruction.siNo}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      instruction.issuedBy === 'client' ? 'bg-blue-100 text-blue-700' :
                      instruction.issuedBy === 'consultant' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {instruction.issuedBy}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      instruction.status === 'received' ? 'bg-amber-100 text-amber-700' :
                      instruction.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                      instruction.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      instruction.status === 'converted_to_variation' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {instruction.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-900 mb-2">{instruction.description}</p>
                  <p className="text-xs text-slate-500">
                    Issued by {instruction.issuedByName} on {new Date(instruction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {instruction.costImpactFlag && (
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <span className="text-green-700 font-medium">Cost Impact</span>
                    {instruction.costImpactAmount && (
                      <p className="text-green-900 font-semibold mt-1">
                        ₹{(instruction.costImpactAmount / 100000).toFixed(1)} L
                      </p>
                    )}
                  </div>
                )}
                {instruction.timeImpactFlag && (
                  <div className="p-2 bg-red-50 rounded border border-red-200">
                    <span className="text-red-700 font-medium">Time Impact</span>
                    {instruction.timeImpactDays && (
                      <p className="text-red-900 font-semibold mt-1">
                        {instruction.timeImpactDays} days
                      </p>
                    )}
                  </div>
                )}
                {instruction.drawings.length > 0 && (
                  <div>
                    <span className="text-slate-500">Drawings:</span>
                    <div className="mt-1 space-y-0.5">
                      {instruction.drawings.map((dwg, idx) => (
                        <p key={idx} className="text-slate-700 font-mono text-[10px]">{dwg}</p>
                      ))}
                    </div>
                  </div>
                )}
                {instruction.variationId && (
                  <div>
                    <span className="text-slate-500">Variation:</span>
                    <p className="text-slate-700 font-mono mt-1">{instruction.variationId}</p>
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

function PhotosTab() {
  return (
    <div className="space-y-6">
      {/* Photo Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Photos"
          value={siteStats.totalPhotos}
          subtitle="Geo-tagged"
          icon="📷"
          color="blue"
        />
        <StatCard
          title="This Week"
          value={sitePhotos.filter(p => new Date(p.capturedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          subtitle="Recent uploads"
          icon="📅"
          color="green"
        />
        <StatCard
          title="Activities"
          value={new Set(sitePhotos.map(p => p.activityId).filter(Boolean)).size}
          subtitle="Documented"
          icon="🏗️"
          color="purple"
        />
        <StatCard
          title="Work Fronts"
          value={new Set(sitePhotos.map(p => p.workFrontId).filter(Boolean)).size}
          subtitle="Covered"
          icon="📍"
          color="teal"
        />
      </div>

      {/* Photo Gallery */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Photo Gallery</h3>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700">
            + Upload Photos
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sitePhotos.map(photo => (
            <div key={photo.id} className="group relative">
              <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-xs font-medium mb-1">{photo.description}</p>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span>📍 {photo.geoLocation.lat.toFixed(4)}, {photo.geoLocation.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] mt-1">
                    <span>📅 {new Date(photo.capturedAt).toLocaleDateString()}</span>
                    <span> 👤 {photo.capturedByName}</span>
                  </div>
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {photo.tags.map((tag, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-white/20 rounded text-[9px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
    teal: 'bg-teal-50 border-teal-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
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
