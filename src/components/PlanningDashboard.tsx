import { useState } from 'react';
import {
  schedules,
  activities,
  dependencies,
  calendars,
  resourceAssignments,
  baselineSnapshots,
  protocolControlPoints,
  planningStats,
  ganttData,
  criticalPathAnalysis,
  resourceHistogram,
  lookAheadActivities
} from '../data/planningData';

export function PlanningDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'schedules', label: 'Schedules', icon: '📅' },
    { id: 'gantt', label: 'Gantt Chart', icon: '📈' },
    { id: 'activities', label: 'Activities', icon: '📋' },
    { id: 'critical-path', label: 'Critical Path', icon: '🎯' },
    { id: 'resources', label: 'Resources', icon: '👷' },
    { id: 'lookahead', label: 'Look-Ahead', icon: '🔭' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Project Planning & Scheduling</h1>
          <p className="text-sm text-slate-500 mt-1">Part 26 — CPM scheduling with Gantt charts, baseline management, and resource loading</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
            ff.plan
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
      {activeTab === 'schedules' && <SchedulesTab selectedSchedule={selectedSchedule} setSelectedSchedule={setSelectedSchedule} />}
      {activeTab === 'gantt' && <GanttTab />}
      {activeTab === 'activities' && <ActivitiesTab selectedActivity={selectedActivity} setSelectedActivity={setSelectedActivity} />}
      {activeTab === 'critical-path' && <CriticalPathTab />}
      {activeTab === 'resources' && <ResourcesTab />}
      {activeTab === 'lookahead' && <LookAheadTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Schedules"
          value={planningStats.totalSchedules}
          subtitle={`${planningStats.baselineSchedules} baseline`}
          icon="📅"
          color="cyan"
        />
        <StatCard
          title="Activities"
          value={planningStats.totalActivities}
          subtitle={`${planningStats.criticalActivities} critical`}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Completed"
          value={planningStats.completedActivities}
          subtitle={`${planningStats.inProgressActivities} in progress`}
          icon="✓"
          color="green"
        />
        <StatCard
          title="Baseline Slip"
          value={`${planningStats.baselineSlippage}d`}
          subtitle="Behind schedule"
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Critical Path Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Critical Path Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 mb-1">Critical Path Length</p>
            <p className="text-2xl font-bold text-red-900">{criticalPathAnalysis.criticalPathLength} days</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 mb-1">Critical Activities</p>
            <p className="text-2xl font-bold text-amber-900">{criticalPathAnalysis.criticalActivities}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 mb-1">Near-Critical (≤5d float)</p>
            <p className="text-2xl font-bold text-blue-900">{criticalPathAnalysis.nearCriticalActivities}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 mb-1">Baseline Slippage</p>
            <p className="text-2xl font-bold text-red-900">+{criticalPathAnalysis.slippage} days</p>
          </div>
        </div>
      </div>

      {/* Schedule Comparison */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Baseline vs Current Schedule</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Baseline Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Start Date:</span>
                <span className="font-medium text-slate-900">{new Date(criticalPathAnalysis.projectStart).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Finish Date:</span>
                <span className="font-medium text-slate-900">{new Date(criticalPathAnalysis.baselineFinish).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Duration:</span>
                <span className="font-medium text-slate-900">578 days</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Current Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Start Date:</span>
                <span className="font-medium text-slate-900">{new Date(criticalPathAnalysis.projectStart).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Finish Date:</span>
                <span className="font-medium text-red-700">{new Date(criticalPathAnalysis.projectFinish).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Duration:</span>
                <span className="font-medium text-red-700">625 days (+47d)</span>
              </div>
            </div>
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

function SchedulesTab({ selectedSchedule, setSelectedSchedule }: { selectedSchedule: string | null; setSelectedSchedule: (id: string | null) => void }) {
  const selected = schedules.find(s => s.id === selectedSchedule);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Schedule List */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Schedule Register</h3>
          <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
            + New Schedule
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {schedules.map(schedule => (
            <div
              key={schedule.id}
              onClick={() => setSelectedSchedule(schedule.id)}
              className={`p-6 hover:bg-slate-50 cursor-pointer transition-colors ${
                selectedSchedule === schedule.id ? 'bg-cyan-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-900">{schedule.name}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      schedule.type === 'baseline' ? 'bg-blue-100 text-blue-700' :
                      schedule.type === 'current' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {schedule.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      schedule.status === 'approved' ? 'bg-green-100 text-green-700' :
                      schedule.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {schedule.projectName} • v{schedule.versionNo} • Data Date: {new Date(schedule.dataDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {Math.ceil((new Date(schedule.projectFinish).getTime() - new Date(schedule.projectStart).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Activities:</span>
                  <span className="ml-1 font-medium text-slate-900">{schedule.totalActivities}</span>
                </div>
                <div>
                  <span className="text-slate-500">Critical:</span>
                  <span className="ml-1 font-medium text-red-600">{schedule.criticalActivities}</span>
                </div>
                <div>
                  <span className="text-slate-500">Created:</span>
                  <span className="ml-1 text-slate-700">{new Date(schedule.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Details */}
      {selected && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Schedule Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Schedule Name</p>
              <p className="text-sm font-medium text-slate-900">{selected.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Project</p>
              <p className="text-sm text-slate-900">{selected.projectName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Type</p>
              <p className="text-sm text-slate-900 capitalize">{selected.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Version</p>
              <p className="text-sm text-slate-900">v{selected.versionNo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Data Date</p>
              <p className="text-sm text-slate-900">{new Date(selected.dataDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Project Duration</p>
              <p className="text-sm text-slate-900">
                {new Date(selected.projectStart).toLocaleDateString()} - {new Date(selected.projectFinish).toLocaleDateString()}
              </p>
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
          </div>
        </div>
      )}
    </div>
  );
}

function GanttTab() {
  const maxDuration = Math.max(...ganttData.map(g => g.duration));
  const projectStart = new Date('2025-06-01');
  const projectEnd = new Date('2027-02-15');
  const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Gantt Chart Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Gantt Chart</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                Day
              </button>
              <button className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded">
                Week
              </button>
              <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                Month
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
              Show Baseline
            </button>
            <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
              Show Critical
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex items-center mb-4 border-b border-slate-200 pb-2">
            <div className="w-64 flex-shrink-0">
              <span className="text-xs font-semibold text-slate-700">Activity</span>
            </div>
            <div className="flex-1 relative">
              <div className="flex justify-between text-xs text-slate-500">
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date(projectStart);
                  date.setMonth(date.getMonth() + i * 2);
                  return (
                    <span key={i} style={{ position: 'absolute', left: `${(i * 2 / 20) * 100}%` }}>
                      {date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gantt Bars */}
          <div className="space-y-2">
            {ganttData.map(activity => {
              const startDate = new Date(activity.startDate);
              const startOffset = Math.ceil((startDate.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
              const barWidth = (activity.duration / totalDays) * 100;
              const barLeft = (startOffset / totalDays) * 100;

              return (
                <div key={activity.id} className="flex items-center">
                  <div className="w-64 flex-shrink-0 pr-4">
                    <div className="flex items-center gap-2">
                      {activity.isMilestone && <span className="text-red-600">◆</span>}
                      <span className={`text-xs ${activity.isCritical ? 'font-semibold text-red-700' : 'text-slate-700'}`}>
                        {activity.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{activity.name}</p>
                  </div>
                  <div className="flex-1 relative h-8 bg-slate-50 rounded">
                    {/* Activity Bar */}
                    <div
                      className={`absolute top-1 h-6 rounded ${
                        activity.isCritical ? 'bg-red-500' : 'bg-cyan-500'
                      }`}
                      style={{
                        left: `${barLeft}%`,
                        width: `${Math.max(barWidth, 0.5)}%`
                      }}
                    >
                      {activity.percentComplete > 0 && (
                        <div
                          className="h-full bg-green-600 rounded-l"
                          style={{ width: `${activity.percentComplete}%` }}
                        />
                      )}
                    </div>
                    {/* Float Indicator */}
                    {activity.float > 0 && !activity.isCritical && (
                      <div
                        className="absolute top-3 h-2 bg-slate-300 rounded"
                        style={{
                          left: `${barLeft + barWidth}%`,
                          width: `${(activity.float / totalDays) * 100}%`
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-slate-700">Critical Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded"></div>
              <span className="text-slate-700">Normal Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-slate-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-300 rounded"></div>
              <span className="text-slate-700">Float</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600">◆</span>
              <span className="text-slate-700">Milestone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitiesTab({ selectedActivity, setSelectedActivity }: { selectedActivity: string | null; setSelectedActivity: (id: string | null) => void }) {
  const selected = activities.find(a => a.id === selectedActivity);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity List */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Activity Register</h3>
          <p className="text-sm text-slate-500 mt-1">{activities.length} activities with CPM calculations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">WBS</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Duration</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">% Complete</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Float</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Critical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activities.map(activity => (
                <tr
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  className={`hover:bg-slate-50 cursor-pointer ${
                    selectedActivity === activity.id ? 'bg-cyan-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className={`text-xs font-mono ${activity.isCritical ? 'text-red-700 font-semibold' : 'text-slate-700'}`}>
                      {activity.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{activity.name}</p>
                      <p className="text-xs text-slate-500">{activity.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-600">{activity.wbsNodeCode}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-900">{activity.originalDuration}d</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${activity.percentComplete}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-700 w-10">{activity.percentComplete}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${
                      activity.totalFloat === 0 ? 'text-red-600' :
                      activity.totalFloat <= 5 ? 'text-amber-600' :
                      'text-slate-700'
                    }`}>
                      {activity.totalFloat}d
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {activity.isCritical ? (
                      <span className="text-red-600">●</span>
                    ) : (
                      <span className="text-slate-400">○</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Details */}
      {selected && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Activity Code</p>
              <p className="text-sm font-mono font-semibold text-slate-900">{selected.code}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm text-slate-900">{selected.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">WBS</p>
              <p className="text-sm text-slate-900">{selected.wbsNodeCode} - {selected.wbsNodeId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Type</p>
              <p className="text-sm text-slate-900 capitalize">{selected.type}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Original Duration</p>
                <p className="text-sm font-medium text-slate-900">{selected.originalDuration} days</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Remaining Duration</p>
                <p className="text-sm font-medium text-slate-900">{selected.remainingDuration} days</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Early Start</p>
                <p className="text-sm text-slate-900">{new Date(selected.earlyStart).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Early Finish</p>
                <p className="text-sm text-slate-900">{new Date(selected.earlyFinish).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Late Start</p>
                <p className="text-sm text-slate-900">{new Date(selected.lateStart).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Late Finish</p>
                <p className="text-sm text-slate-900">{new Date(selected.lateFinish).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Total Float</p>
                <p className={`text-sm font-bold ${selected.totalFloat === 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {selected.totalFloat} days
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Free Float</p>
                <p className="text-sm font-medium text-slate-900">{selected.freeFloat} days</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500">Percent Complete</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${selected.percentComplete}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-900">{selected.percentComplete}%</span>
              </div>
            </div>
            {selected.actualStart && (
              <div>
                <p className="text-xs text-slate-500">Actual Start</p>
                <p className="text-sm text-slate-900">{new Date(selected.actualStart).toLocaleDateString()}</p>
              </div>
            )}
            {selected.actualFinish && (
              <div>
                <p className="text-xs text-slate-500">Actual Finish</p>
                <p className="text-sm text-slate-900">{new Date(selected.actualFinish).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CriticalPathTab() {
  const criticalActivities = activities.filter(a => a.isCritical);

  return (
    <div className="space-y-6">
      {/* Critical Path Summary */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Critical Path Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-red-100">Critical Path Length</p>
            <p className="text-3xl font-bold">{criticalPathAnalysis.criticalPathLength}</p>
            <p className="text-xs text-red-100">days</p>
          </div>
          <div>
            <p className="text-xs text-red-100">Critical Activities</p>
            <p className="text-3xl font-bold">{criticalPathAnalysis.criticalActivities}</p>
            <p className="text-xs text-red-100">activities</p>
          </div>
          <div>
            <p className="text-xs text-red-100">Total Float</p>
            <p className="text-3xl font-bold">{criticalPathAnalysis.totalFloat}</p>
            <p className="text-xs text-red-100">days</p>
          </div>
          <div>
            <p className="text-xs text-red-100">Baseline Slippage</p>
            <p className="text-3xl font-bold">+{criticalPathAnalysis.slippage}</p>
            <p className="text-xs text-red-100">days</p>
          </div>
        </div>
      </div>

      {/* Critical Activities List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Critical Activities</h3>
          <p className="text-sm text-slate-500 mt-1">Activities with zero or negative float</p>
        </div>
        <div className="divide-y divide-slate-200">
          {criticalActivities.map(activity => (
            <div key={activity.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono font-semibold text-red-700">{activity.code}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                      CRITICAL
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{activity.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">WBS: {activity.wbsNodeCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Float</p>
                  <p className="text-lg font-bold text-red-600">{activity.totalFloat}d</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Early Start:</span>
                  <span className="ml-1 text-slate-700">{new Date(activity.earlyStart).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Early Finish:</span>
                  <span className="ml-1 text-slate-700">{new Date(activity.earlyFinish).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Duration:</span>
                  <span className="ml-1 text-slate-700">{activity.originalDuration}d</span>
                </div>
                <div>
                  <span className="text-slate-500">% Complete:</span>
                  <span className="ml-1 text-slate-700">{activity.percentComplete}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesTab() {
  return (
    <div className="space-y-6">
      {/* Resource Histogram */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resource Histogram</h3>
        <div className="space-y-4">
          {resourceHistogram.map((data, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-slate-700">{data.period}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-16">Labour:</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500 flex items-center px-2"
                      style={{ width: `${(data.labour / 200) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">{data.labour}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-16">Plant:</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-purple-500 flex items-center px-2"
                      style={{ width: `${(data.plant / 25) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">{data.plant}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-16">Material:</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500 flex items-center px-2"
                      style={{ width: `${(data.material / 700) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">{data.material}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Assignments */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Resource Assignments</h3>
          <p className="text-sm text-slate-500 mt-1">{resourceAssignments.length} resource assignments across activities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">UOM</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {resourceAssignments.map(ra => (
                <tr key={ra.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-cyan-700">{ra.activityCode}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900">{ra.resourceName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      ra.resourceType === 'labour_trade' ? 'bg-blue-100 text-blue-700' :
                      ra.resourceType === 'plant_type' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ra.resourceType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">{ra.qty}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{ra.uomName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 capitalize">{ra.distribution}</span>
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

function LookAheadTab() {
  return (
    <div className="space-y-6">
      {/* Look-Ahead Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">3-Week Look-Ahead Schedule</h3>
            <p className="text-sm text-slate-500 mt-1">Activities scheduled for the next 3 weeks from data date</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
              Generate Look-Ahead
            </button>
            <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Look-Ahead Activities */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Activities</h3>
          <p className="text-sm text-slate-500 mt-1">{lookAheadActivities.length} activities in next 3 weeks</p>
        </div>
        <div className="divide-y divide-slate-200">
          {lookAheadActivities.map(activity => (
            <div key={activity.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-cyan-700">{activity.code}</span>
                    {activity.isCritical && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{activity.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">WBS: {activity.wbsNodeCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Start Date</p>
                  <p className="text-sm font-medium text-slate-900">{new Date(activity.earlyStart).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Duration:</span>
                  <span className="ml-1 text-slate-700">{activity.originalDuration} days</span>
                </div>
                <div>
                  <span className="text-slate-500">Finish:</span>
                  <span className="ml-1 text-slate-700">{new Date(activity.earlyFinish).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Float:</span>
                  <span className="ml-1 text-slate-700">{activity.totalFloat} days</span>
                </div>
                <div>
                  <span className="text-slate-500">% Complete:</span>
                  <span className="ml-1 text-slate-700">{activity.percentComplete}%</span>
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
    cyan: 'bg-cyan-50 border-cyan-200',
    blue: 'bg-blue-50 border-blue-200',
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
