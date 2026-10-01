import { useState } from 'react';
import {
  sampleProject,
  projectCharter,
  teamMembers,
  scopeItems,
  objectives,
  milestones,
  risks,
  issues,
  kpiTargets,
  project360Data,
  profitabilitySummary,
  protocolControlPoints,
  projectStats
} from '../data/projectManagementData';

export function ProjectManagement() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'charter', label: 'Charter', icon: '📋' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'milestones', label: 'Milestones', icon: '🎯' },
    { id: 'risks', label: 'Risks', icon: '⚠️' },
    { id: 'issues', label: 'Issues', icon: '🔧' },
    { id: '360', label: 'Project 360', icon: '🌐' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 19</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.prj</span>
            </div>
            <h1 className="text-2xl font-bold">{sampleProject.name}</h1>
            <p className="text-sm text-blue-100 mt-1">{sampleProject.code} • {sampleProject.client}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{project360Data.progress.physicalPercent}%</p>
            <p className="text-xs text-blue-100">Physical Progress</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-blue-800/50 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${project360Data.progress.physicalPercent}%` }}></div>
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
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
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
      {activeTab === 'charter' && <CharterTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'milestones' && <MilestonesTab />}
      {activeTab === 'risks' && <RisksTab />}
      {activeTab === 'issues' && <IssuesTab />}
      {activeTab === '360' && <Project360Tab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Contract Value"
          value={`₹${(profitabilitySummary.totalContractValue / 10000000).toFixed(1)} Cr`}
          subtitle="Incl. variations"
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Cost to Date"
          value={`₹${(profitabilitySummary.costToDate / 10000000).toFixed(1)} Cr`}
          subtitle={`${((profitabilitySummary.costToDate / profitabilitySummary.totalContractValue) * 100).toFixed(1)}% of contract`}
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="EAC Margin"
          value={`${profitabilitySummary.eacMarginPct.toFixed(2)}%`}
          subtitle={profitabilitySummary.eacMarginPct >= 0 ? 'Profitable' : 'Loss'}
          icon="📈"
          color={profitabilitySummary.eacMarginPct >= 0 ? 'green' : 'red'}
        />
        <MetricCard
          title="SPI"
          value={project360Data.progress.spi.toFixed(2)}
          subtitle={project360Data.progress.spi >= 1 ? 'On Track' : 'Behind'}
          icon="⏱️"
          color={project360Data.progress.spi >= 1 ? 'green' : 'amber'}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Milestones"
          value={`${projectStats.completedMilestones}/${projectStats.totalMilestones}`}
          subtitle={`${projectStats.atRiskMilestones} at risk`}
          icon="🎯"
          color="blue"
        />
        <StatCard
          title="Risks"
          value={projectStats.totalRisks}
          subtitle={`${projectStats.highRisks} high`}
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Issues"
          value={projectStats.openIssues}
          subtitle={`${projectStats.overdueIssues} overdue`}
          icon="🔧"
          color="red"
        />
        <StatCard
          title="Team"
          value={projectStats.teamSize}
          subtitle={`${projectStats.keyPersons} key persons`}
          icon="👥"
          color="green"
        />
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
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
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

function CharterTab() {
  return (
    <div className="space-y-6">
      {/* Charter Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Project Charter</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            projectCharter.status === 'approved' ? 'bg-green-100 text-green-700' :
            projectCharter.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {projectCharter.status.toUpperCase()}
          </span>
        </div>

        {projectCharter.status === 'approved' && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
            <p className="text-xs text-green-700">
              Approved by {projectCharter.approvedBy} on {new Date(projectCharter.approvedAt!).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Objectives */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Objectives</h4>
          <ul className="space-y-2">
            {projectCharter.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Scope Inclusions</h4>
            <ul className="space-y-2">
              {scopeItems.filter(s => s.type === 'inclusion').map(item => (
                <li key={item.id} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-blue-600 mt-0.5">●</span>
                  <div>
                    <span>{item.description}</span>
                    {item.sourceContractClause && (
                      <span className="text-xs text-slate-500 ml-2">({item.sourceContractClause})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Scope Exclusions</h4>
            <ul className="space-y-2">
              {scopeItems.filter(s => s.type === 'exclusion').map(item => (
                <li key={item.id} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-red-600 mt-0.5">○</span>
                  <div>
                    <span>{item.description}</span>
                    {item.sourceContractClause && (
                      <span className="text-xs text-slate-500 ml-2">({item.sourceContractClause})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Dates */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Dates</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Start Date</p>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(projectCharter.keyDates.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Planned Finish</p>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(projectCharter.keyDates.plannedFinish).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Constraints & Assumptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Constraints</h4>
            <ul className="space-y-2">
              {projectCharter.constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-amber-600 mt-0.5">⚠</span>
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Assumptions</h4>
            <ul className="space-y-2">
              {projectCharter.assumptions.map((assumption, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-blue-600 mt-0.5">ℹ</span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Project Team</h3>
          <p className="text-sm text-slate-500 mt-1">{teamMembers.length} members • {projectStats.keyPersons} key persons</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          + Add Member
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">To</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Allocation</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Key Person</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {teamMembers.map(member => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">
                        {member.userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{member.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded capitalize">
                    {member.projectRole.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {new Date(member.fromDate).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {member.toDate ? new Date(member.toDate).toLocaleDateString() : 'Present'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-slate-900">{member.allocationPercent}%</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {member.isKeyPerson ? (
                    <span className="text-green-600">✓</span>
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

function MilestonesTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total"
          value={projectStats.totalMilestones}
          subtitle="Milestones"
          icon="🎯"
          color="blue"
        />
        <StatCard
          title="Completed"
          value={projectStats.completedMilestones}
          subtitle="On track"
          icon="✓"
          color="green"
        />
        <StatCard
          title="At Risk"
          value={projectStats.atRiskMilestones}
          subtitle="Need attention"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Pending"
          value={milestones.filter(m => m.status === 'pending').length}
          subtitle="Upcoming"
          icon="⏳"
          color="slate"
        />
      </div>

      {/* Milestones List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Milestone Tracker</h3>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            + Add Milestone
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {milestones.map(milestone => (
            <div key={milestone.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs font-mono text-slate-500">{milestone.code}</code>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      milestone.type === 'contractual' ? 'bg-blue-100 text-blue-700' :
                      milestone.type === 'payment' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {milestone.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                      milestone.status === 'at_risk' ? 'bg-amber-100 text-amber-700' :
                      milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {milestone.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{milestone.name}</h4>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Weight</p>
                  <p className="text-lg font-bold text-slate-900">{milestone.weightPct}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Planned:</span>
                  <span className="ml-1 text-slate-700 font-medium">
                    {new Date(milestone.plannedDate).toLocaleDateString()}
                  </span>
                </div>
                {milestone.forecastDate && (
                  <div>
                    <span className="text-slate-500">Forecast:</span>
                    <span className="ml-1 text-amber-600 font-medium">
                      {new Date(milestone.forecastDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {milestone.actualDate && (
                  <div>
                    <span className="text-slate-500">Actual:</span>
                    <span className="ml-1 text-green-600 font-medium">
                      {new Date(milestone.actualDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {milestone.slippageDays && milestone.slippageDays !== 0 && (
                <div className={`mt-3 p-2 rounded text-xs ${
                  milestone.slippageDays > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {milestone.slippageDays > 0 ? '⚠️' : '✓'} Slippage: {Math.abs(milestone.slippageDays)} days {milestone.slippageDays > 0 ? 'behind' : 'ahead'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RisksTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Risks"
          value={projectStats.totalRisks}
          subtitle="Registered"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="High"
          value={projectStats.highRisks}
          subtitle="Score ≥ 15"
          icon="🔴"
          color="red"
        />
        <StatCard
          title="Medium"
          value={projectStats.mediumRisks}
          subtitle="Score 8-14"
          icon="🟡"
          color="amber"
        />
        <StatCard
          title="Low"
          value={projectStats.lowRisks}
          subtitle="Score < 8"
          icon="🟢"
          color="green"
        />
      </div>

      {/* Risk Heat Map */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Heat Map (5×5)</h3>
        <div className="grid grid-cols-6 gap-1">
          <div></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="text-center text-xs font-medium text-slate-700 p-2">
              {i}
            </div>
          ))}
          {[5, 4, 3, 2, 1].map(probability => (
            <>
              <div key={`label-${probability}`} className="text-center text-xs font-medium text-slate-700 p-2 flex items-center justify-center">
                {probability}
              </div>
              {[1, 2, 3, 4, 5].map(impact => {
                const score = probability * impact;
                const risksInCell = risks.filter(r => r.probability === probability && r.impact === impact);
                const bgColor = score >= 15 ? 'bg-red-500' : score >= 8 ? 'bg-amber-500' : 'bg-green-500';
                return (
                  <div
                    key={`${probability}-${impact}`}
                    className={`${bgColor} p-2 rounded text-center text-white text-xs font-bold relative`}
                    style={{ minHeight: '60px' }}
                  >
                    {risksInCell.length > 0 && (
                      <span className="text-lg">{risksInCell.length}</span>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Low (1-6)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span>Medium (8-12)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>High (15-25)</span>
          </div>
        </div>
      </div>

      {/* Risk Register */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Risk Register</h3>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            + Add Risk
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {risks.map(risk => (
            <div key={risk.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs font-mono text-slate-500">{risk.code}</code>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      risk.score >= 15 ? 'bg-red-100 text-red-700' :
                      risk.score >= 8 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Score: {risk.score}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded capitalize">
                      {risk.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{risk.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{risk.cause} → {risk.effect}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">P × I</p>
                  <p className="text-lg font-bold text-slate-900">{risk.probability} × {risk.impact}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                <div>
                  <span className="text-slate-500">Response:</span>
                  <span className="ml-1 text-slate-700 font-medium capitalize">{risk.response}</span>
                </div>
                <div>
                  <span className="text-slate-500">Owner:</span>
                  <span className="ml-1 text-slate-700 font-medium">{risk.ownerName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Actions:</span>
                  <span className="ml-1 text-slate-700">{risk.actions}</span>
                </div>
              </div>

              {risk.residualScore && (
                <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                  Residual Score: {risk.residualScore} (reduced from {risk.score})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IssuesTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Issues"
          value={projectStats.totalIssues}
          subtitle="All time"
          icon="🔧"
          color="blue"
        />
        <StatCard
          title="Open"
          value={projectStats.openIssues}
          subtitle="Need action"
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Overdue"
          value={projectStats.overdueIssues}
          subtitle="Past SLA"
          icon="⚠️"
          color="red"
        />
        <StatCard
          title="Resolved"
          value={issues.filter(i => i.status === 'resolved' || i.status === 'closed').length}
          subtitle="Completed"
          icon="✓"
          color="green"
        />
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Issue Log</h3>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            + Add Issue
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {issues.map(issue => (
            <div key={issue.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs font-mono text-slate-500">{issue.code}</code>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      issue.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      issue.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      issue.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {issue.priority}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      issue.status === 'open' ? 'bg-red-100 text-red-700' :
                      issue.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    {issue.daysOverdue && issue.daysOverdue > 0 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        {issue.daysOverdue}d overdue
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{issue.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Raised by {issue.raisedByName} • Assigned to {issue.ownerName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Category:</span>
                  <span className="ml-1 text-slate-700 font-medium capitalize">{issue.category}</span>
                </div>
                <div>
                  <span className="text-slate-500">Due:</span>
                  <span className="ml-1 text-slate-700 font-medium">
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">SLA:</span>
                  <span className="ml-1 text-slate-700 font-medium">{issue.slaDays} days</span>
                </div>
              </div>

              {issue.resolution && (
                <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700">
                  <span className="font-medium">Resolution:</span> {issue.resolution}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Project360Tab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Project 360° View</h3>
        <p className="text-sm text-slate-600 mb-6">
          Aggregated view of all project data from across modules. Each tile links to the source module.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Progress */}
          <TileCard
            title="Progress"
            icon="📊"
            metrics={[
              { label: 'Physical', value: `${project360Data.progress.physicalPercent}%` },
              { label: 'Financial', value: `${project360Data.progress.financialPercent}%` },
              { label: 'SPI', value: project360Data.progress.spi.toFixed(2) }
            ]}
            color="blue"
          />

          {/* Cost */}
          <TileCard
            title="Cost"
            icon="💰"
            metrics={[
              { label: 'Budget', value: `₹${(project360Data.cost.budget / 10000000).toFixed(1)} Cr` },
              { label: 'Actual', value: `₹${(project360Data.cost.actual / 10000000).toFixed(1)} Cr` },
              { label: 'CPI', value: project360Data.cost.cpi.toFixed(2) }
            ]}
            color="green"
          />

          {/* Revenue */}
          <TileCard
            title="Revenue"
            icon="📈"
            metrics={[
              { label: 'Contract', value: `₹${(project360Data.revenue.contractValue / 10000000).toFixed(1)} Cr` },
              { label: 'Billed', value: `₹${(project360Data.revenue.billed / 10000000).toFixed(1)} Cr` },
              { label: 'Collected', value: `₹${(project360Data.revenue.collected / 10000000).toFixed(1)} Cr` }
            ]}
            color="emerald"
          />

          {/* Procurement */}
          <TileCard
            title="Procurement"
            icon="📦"
            metrics={[
              { label: 'Open PRs', value: project360Data.procurement.openPRs },
              { label: 'Open POs', value: project360Data.procurement.openPOs },
              { label: 'Overdue', value: project360Data.procurement.overdueDeliveries }
            ]}
            color="purple"
          />

          {/* Stores */}
          <TileCard
            title="Stores"
            icon="🏪"
            metrics={[
              { label: 'Stock Value', value: `₹${(project360Data.stores.stockValue / 100000).toFixed(0)} L` },
              { label: 'Stock Outs', value: project360Data.stores.stockOuts },
              { label: 'Variance', value: `${project360Data.stores.consumptionVariance}%` }
            ]}
            color="amber"
          />

          {/* Plant */}
          <TileCard
            title="Plant"
            icon="🚜"
            metrics={[
              { label: 'Deployed', value: project360Data.plant.deployed },
              { label: 'Utilisation', value: `${project360Data.plant.utilisation}%` },
              { label: 'Breakdown', value: `${project360Data.plant.breakdownRate}%` }
            ]}
            color="cyan"
          />

          {/* Manpower */}
          <TileCard
            title="Manpower"
            icon="👷"
            metrics={[
              { label: 'Planned', value: project360Data.manpower.planned },
              { label: 'Actual', value: project360Data.manpower.actual },
              { label: 'Variance', value: project360Data.manpower.variance }
            ]}
            color="indigo"
          />

          {/* Quality */}
          <TileCard
            title="Quality"
            icon="✓"
            metrics={[
              { label: 'Open NCRs', value: project360Data.quality.openNCRs },
              { label: 'Pass Rate', value: `${project360Data.quality.passRate}%` },
              { label: 'Inspections', value: project360Data.quality.inspectionCount }
            ]}
            color="green"
          />

          {/* HSE */}
          <TileCard
            title="HSE"
            icon="⛑️"
            metrics={[
              { label: 'Open Permits', value: project360Data.hse.openPermits },
              { label: 'Incidents', value: project360Data.hse.incidents },
              { label: 'Near Misses', value: project360Data.hse.nearMisses }
            ]}
            color="red"
          />

          {/* Contracts */}
          <TileCard
            title="Contracts"
            icon="📄"
            metrics={[
              { label: 'Variations', value: project360Data.contracts.variations },
              { label: 'Claims', value: project360Data.contracts.claims },
              { label: 'EOT', value: project360Data.contracts.eot }
            ]}
            color="slate"
          />

          {/* Documents */}
          <TileCard
            title="Documents"
            icon="📁"
            metrics={[
              { label: 'Pending', value: project360Data.documents.pendingApprovals },
              { label: 'Total', value: project360Data.documents.totalDocuments }
            ]}
            color="blue"
          />

          {/* Tasks */}
          <TileCard
            title="Tasks"
            icon="✅"
            metrics={[
              { label: 'Pending', value: project360Data.tasks.pending },
              { label: 'Overdue', value: project360Data.tasks.overdue },
              { label: 'Completed', value: project360Data.tasks.completed }
            ]}
            color="teal"
          />
        </div>
      </div>

      {/* Profitability Summary */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Profitability Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-green-100">Total Contract Value</p>
            <p className="text-xl font-bold">₹{(profitabilitySummary.totalContractValue / 10000000).toFixed(1)} Cr</p>
          </div>
          <div>
            <p className="text-xs text-green-100">Revenue Recognised</p>
            <p className="text-xl font-bold">₹{(profitabilitySummary.revenueRecognised / 10000000).toFixed(1)} Cr</p>
          </div>
          <div>
            <p className="text-xs text-green-100">Cost to Date</p>
            <p className="text-xl font-bold">₹{(profitabilitySummary.costToDate / 10000000).toFixed(1)} Cr</p>
          </div>
          <div>
            <p className="text-xs text-green-100">EAC Margin</p>
            <p className="text-xl font-bold">{profitabilitySummary.eacMarginPct.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string;
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
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
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

function TileCard({ title, icon, metrics, color }: {
  title: string;
  icon: string;
  metrics: Array<{ label: string; value: string | number }>;
  color: string;
}) {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-400',
    green: 'border-green-200 hover:border-green-400',
    emerald: 'border-emerald-200 hover:border-emerald-400',
    purple: 'border-purple-200 hover:border-purple-400',
    amber: 'border-amber-200 hover:border-amber-400',
    cyan: 'border-cyan-200 hover:border-cyan-400',
    indigo: 'border-indigo-200 hover:border-indigo-400',
    red: 'border-red-200 hover:border-red-400',
    slate: 'border-slate-200 hover:border-slate-400',
    teal: 'border-teal-200 hover:border-teal-400'
  };

  return (
    <div className={`p-4 bg-white rounded-lg border-2 ${colorClasses[color as keyof typeof colorClasses]} transition-colors cursor-pointer`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>
      <div className="space-y-1">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{metric.label}</span>
            <span className="font-semibold text-slate-900">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
