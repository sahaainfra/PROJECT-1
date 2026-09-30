import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  controlPoints,
  controlPointModes,
  thresholds,
  evidenceRules,
  reasonCodes,
  exceptionMatrix,
  evaluations,
  exceptions,
  controlCycles,
  violations,
  escalations,
  observeImpactReports,
  protocolStats
} from '../data/protocolData';

export function ProtocolDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'control-points', label: 'Control Points', icon: '🎯' },
    { id: 'exceptions', label: 'Exceptions', icon: '⚠️' },
    { id: 'violations', label: 'Violations', icon: '🚨' },
    { id: 'cycles', label: 'Control Cycles', icon: '🔄' },
    { id: 'observe', label: 'OBSERVE Report', icon: '👁️' },
    { id: 'config', label: 'Configuration', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Protocol & Control Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Part 7 — Governance framework for all business transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
            ff.protocol
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
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700'
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
      {activeTab === 'control-points' && <ControlPointsTab />}
      {activeTab === 'exceptions' && <ExceptionsTab />}
      {activeTab === 'violations' && <ViolationsTab />}
      {activeTab === 'cycles' && <CyclesTab />}
      {activeTab === 'observe' && <ObserveTab />}
      {activeTab === 'config' && <ConfigTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Control Points"
          value={protocolStats.totalControlPoints}
          subtitle={`${protocolStats.activeControlPoints} active`}
          icon="🎯"
          color="purple"
        />
        <StatCard
          title="Exceptions"
          value={protocolStats.totalExceptions}
          subtitle={`${protocolStats.pendingExceptions} pending`}
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Violations"
          value={protocolStats.totalViolations}
          subtitle={`${protocolStats.openViolations} open`}
          icon="🚨"
          color="red"
        />
        <StatCard
          title="Pass Rate"
          value={`${protocolStats.passRate}%`}
          subtitle="Last 30 days"
          icon="✅"
          color="green"
        />
      </div>

      {/* Mode Distribution */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Control Point Modes</h3>
        <div className="grid grid-cols-4 gap-4">
          <ModeCard mode="OFF" count={controlPointModes.filter(m => m.mode === 'OFF').length} color="slate" />
          <ModeCard mode="OBSERVE" count={protocolStats.observeModeCount} color="blue" />
          <ModeCard mode="WARN" count={protocolStats.warnModeCount} color="amber" />
          <ModeCard mode="ENFORCE" count={protocolStats.enforceModeCount} color="red" />
        </div>
      </div>

      {/* Recent Evaluations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Protocol Evaluations</h3>
        <div className="space-y-3">
          {evaluations.slice(0, 5).map(evaluation => (
            <div key={evaluation.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                evaluation.result === 'PASS' ? 'bg-green-500' :
                evaluation.result === 'WARN' ? 'bg-amber-500' :
                evaluation.result === 'EXCEPTION_REQUIRED' ? 'bg-blue-500' :
                'bg-red-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{evaluation.cpCode}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    evaluation.result === 'PASS' ? 'bg-green-100 text-green-700' :
                    evaluation.result === 'WARN' ? 'bg-amber-100 text-amber-700' :
                    evaluation.result === 'EXCEPTION_REQUIRED' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {evaluation.result}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded">
                    {evaluation.mode}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {evaluation.actorName} • {evaluation.entityType} {evaluation.entityId}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(evaluation.at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Exceptions */}
      {protocolStats.emergencyExceptions > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <span>🚨</span>
            Emergency Exceptions Pending Regularisation
          </h3>
          <div className="space-y-3">
            {exceptions.filter(e => e.isEmergency && e.status === 'EXECUTED_PENDING_REGULARISATION').map(exc => (
              <div key={exc.id} className="p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{exc.exceptionNo}</p>
                    <p className="text-xs text-slate-500">{exc.projectName} • {exc.siteName}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                    Emergency
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{exc.narrative}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>💰 ₹{exc.costImpact.toLocaleString()}</span>
                  <span>📅 Regularise by: {new Date(exc.regulariseBy!).toLocaleDateString()}</span>
                  <span>👤 {exc.requestedByName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ControlPointsTab() {
  const [selectedCP, setSelectedCP] = useState(controlPoints[0]?.cpCode);
  const selectedControlPoint = controlPoints.find(cp => cp.cpCode === selectedCP);
  const mode = controlPointModes.find(m => m.cpCode === selectedCP);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Control Points List */}
      <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Control Points Registry</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {controlPoints.map(cp => {
            const cpMode = controlPointModes.find(m => m.cpCode === cp.cpCode);
            return (
              <button
                key={cp.id}
                onClick={() => setSelectedCP(cp.cpCode)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCP === cp.cpCode
                    ? 'bg-purple-50 border-2 border-purple-500'
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-900">{cp.cpCode}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    cpMode?.mode === 'ENFORCE' ? 'bg-red-100 text-red-700' :
                    cpMode?.mode === 'WARN' ? 'bg-amber-100 text-amber-700' :
                    cpMode?.mode === 'OBSERVE' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {cpMode?.mode || 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{cp.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500">{cp.module}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{cp.stage}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Point Details */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
        {selectedControlPoint && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedControlPoint.cpCode}</h3>
                <p className="text-sm text-slate-500">{selectedControlPoint.description}</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                Edit Control Point
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <DetailCard label="Module" value={selectedControlPoint.module} />
              <DetailCard label="Stage" value={selectedControlPoint.stage} />
              <DetailCard label="Trigger" value={selectedControlPoint.trigger} />
              <DetailCard label="Check Type" value={selectedControlPoint.checkType} />
              <DetailCard label="Enforcement" value={selectedControlPoint.enforcement} />
              <DetailCard label="Owner Role" value={selectedControlPoint.ownerRole} />
            </div>

            {mode && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Current Mode</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailCard label="Mode" value={mode.mode} />
                  <DetailCard label="Scope" value={`${mode.scopeType}: ${mode.scopeName}`} />
                  <DetailCard label="Effective From" value={new Date(mode.effectiveFrom).toLocaleDateString()} />
                  <DetailCard label="Approved By" value={mode.approvedBy} />
                </div>
              </div>
            )}

            {selectedControlPoint.configJson && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Configuration</h4>
                <pre className="text-xs text-blue-800 overflow-x-auto">
                  {JSON.stringify(selectedControlPoint.configJson, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ExceptionsTab() {
  const [filter, setFilter] = useState('all');
  
  const filteredExceptions = filter === 'all' 
    ? exceptions 
    : exceptions.filter(e => e.status === filter);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Exceptions"
          value={protocolStats.totalExceptions}
          subtitle="All time"
          icon="⚠️"
          color="blue"
        />
        <StatCard
          title="Pending Approval"
          value={protocolStats.pendingExceptions}
          subtitle="Awaiting review"
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Approved"
          value={protocolStats.approvedExceptions}
          subtitle="Active & consumed"
          icon="✅"
          color="green"
        />
        <StatCard
          title="Emergency"
          value={protocolStats.emergencyExceptions}
          subtitle="Pending regularisation"
          icon="🚨"
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          {['all', 'SUBMITTED', 'APPROVED', 'CONSUMED', 'EXECUTED_PENDING_REGULARISATION'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Exceptions List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Exception Register</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredExceptions.map(exc => (
            <div key={exc.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{exc.exceptionNo}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                      {exc.type.replace(/_/g, ' ')}
                    </span>
                    {exc.isEmergency && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        Emergency
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {exc.projectName} {exc.siteName && `• ${exc.siteName}`}
                  </p>
                </div>
                <StatusBadge status={exc.status} />
              </div>

              <p className="text-sm text-slate-700 mb-3">{exc.narrative}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-xs">
                  <span className="text-slate-500">Deviation:</span>
                  <span className="ml-1 font-medium text-slate-900">{exc.deviationValue} {exc.deviationUnit}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Cost Impact:</span>
                  <span className="ml-1 font-medium text-slate-900">₹{exc.costImpact.toLocaleString()}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Requested by:</span>
                  <span className="ml-1 font-medium text-slate-900">{exc.requestedByName}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Created:</span>
                  <span className="ml-1 font-medium text-slate-900">{new Date(exc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {exc.status === 'SUBMITTED' && (
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
                    View Details
                  </button>
                </div>
              )}

              {exc.status === 'EXECUTED_PENDING_REGULARISATION' && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-900 font-medium mb-1">
                    ⚠️ Regularisation Required by {new Date(exc.regulariseBy!).toLocaleDateString()}
                  </p>
                  <button className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700">
                    Regularise Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ViolationsTab() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Violations"
          value={protocolStats.totalViolations}
          subtitle="All time"
          icon="🚨"
          color="red"
        />
        <StatCard
          title="Open"
          value={protocolStats.openViolations}
          subtitle="Require action"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Resolved"
          value={protocolStats.resolvedViolations}
          subtitle="Completed"
          icon="✅"
          color="green"
        />
        <StatCard
          title="Active Escalations"
          value={protocolStats.activeEscalations}
          subtitle="In progress"
          icon="⬆️"
          color="blue"
        />
      </div>

      {/* Violations List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Violations Register</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {violations.map(viol => (
            <div key={viol.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{viol.violationId}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                      {viol.cpCode}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      viol.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      viol.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      viol.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {viol.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {viol.projectName} {viol.siteName && `• ${viol.siteName}`}
                  </p>
                </div>
                <StatusBadge status={viol.status.toUpperCase()} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-xs">
                  <span className="text-slate-500">Actor:</span>
                  <span className="ml-1 font-medium text-slate-900">{viol.actorName}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Created:</span>
                  <span className="ml-1 font-medium text-slate-900">{new Date(viol.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {viol.status === 'open' && (
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Acknowledge
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Resolve
                  </button>
                  <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
                    Escalate
                  </button>
                </div>
              )}

              {viol.status === 'resolved' && viol.resolutionNote && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-900 font-medium mb-1">Resolution Note:</p>
                  <p className="text-xs text-green-800">{viol.resolutionNote}</p>
                  <p className="text-xs text-green-700 mt-1">
                    Resolved by {viol.resolvedBy} on {new Date(viol.resolvedAt!).toLocaleDateString()}
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

function CyclesTab() {
  const stages = ['PLAN', 'VERIFY', 'APPROVE', 'EXECUTE', 'RECORD', 'MONITOR', 'RECONCILE', 'CLOSE'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Control Cycle Visualization</h3>
        
        {controlCycles.map(cycle => (
          <div key={cycle.id} className="mb-8 last:mb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{cycle.rootEntityNumber}</h4>
                <p className="text-xs text-slate-500">{cycle.projectName} • {cycle.responsibleName}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                cycle.isClosed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {cycle.isClosed ? 'Closed' : `Current: ${cycle.currentStage}`}
              </span>
            </div>

            {/* Stage Progress */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {stages.map((stage, idx) => {
                  const stageData = cycle.stageStatus[stage];
                  const isCurrent = stage === cycle.currentStage;
                  const isCompleted = stageData?.status === 'COMPLETED';
                  const isInProgress = stageData?.status === 'IN_PROGRESS';
                  
                  return (
                    <div key={stage} className="flex flex-col items-center flex-1">
                      {/* Connector Line */}
                      {idx < stages.length - 1 && (
                        <div className={`absolute top-6 h-0.5 ${
                          isCompleted ? 'bg-green-500' : 'bg-slate-300'
                        }`} style={{
                          left: `${(idx / stages.length) * 100 + 6}%`,
                          width: `${100 / stages.length}%`
                        }} />
                      )}
                      
                      {/* Stage Circle */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isCompleted ? 'bg-green-500 border-green-500 text-white' :
                        isInProgress ? 'bg-blue-500 border-blue-500 text-white animate-pulse' :
                        isCurrent ? 'bg-blue-100 border-blue-500 text-blue-700' :
                        'bg-white border-slate-300 text-slate-400'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      
                      {/* Stage Label */}
                      <span className={`text-xs font-medium mt-2 ${
                        isCompleted ? 'text-green-700' :
                        isInProgress ? 'text-blue-700' :
                        'text-slate-500'
                      }`}>
                        {stage}
                      </span>
                      
                      {/* Stage Details */}
                      {stageData && (
                        <div className="text-[10px] text-slate-400 mt-1 text-center">
                          {stageData.at && (
                            <p>{new Date(stageData.at).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObserveTab() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">OBSERVE Mode Impact Report</h3>
        <p className="text-sm text-blue-700">
          Analysis of what would have been blocked/warned if controls were in ENFORCE mode. 
          This data helps determine readiness for enforcement.
        </p>
      </div>

      {observeImpactReports.map(report => (
        <div key={report.module} className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-900 capitalize">{report.module} Module</h4>
            <span className="text-sm text-slate-500">{report.totalEvaluations} evaluations</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-700">{report.passRate}%</p>
              <p className="text-xs text-green-600 mt-1">Pass Rate</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-700">{report.wouldBlock}</p>
              <p className="text-xs text-red-600 mt-1">Would Block</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-2xl font-bold text-amber-700">{report.wouldWarn}</p>
              <p className="text-xs text-amber-600 mt-1">Would Warn</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">{report.wouldRequireException}</p>
              <p className="text-xs text-blue-600 mt-1">Would Require Exception</p>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-slate-900 mb-3">Top Violations</h5>
            <div className="space-y-2">
              {report.topViolations.map((viol, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-slate-900">{viol.cpCode}</span>
                    <span className="text-xs text-slate-500 ml-2">{viol.description}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{viol.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfigTab() {
  const [subTab, setSubTab] = useState('thresholds');

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {['thresholds', 'evidence', 'reasons', 'matrix'].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                subTab === tab
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'thresholds' && 'Thresholds'}
              {tab === 'evidence' && 'Evidence Rules'}
              {tab === 'reasons' && 'Reason Codes'}
              {tab === 'matrix' && 'Exception Matrix'}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'thresholds' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Thresholds</h3>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
              Add Threshold
            </button>
          </div>
          <div className="space-y-3">
            {thresholds.map(th => (
              <div key={th.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{th.key}</span>
                  <span className="text-sm font-bold text-purple-700">
                    {th.value} {th.unit}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Scope:</span>
                    <span className="ml-1 text-slate-700">{th.scopeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Effective:</span>
                    <span className="ml-1 text-slate-700">{new Date(th.effectiveFrom).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'evidence' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Evidence Rules</h3>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
              Add Rule
            </button>
          </div>
          <div className="space-y-3">
            {evidenceRules.map(rule => (
              <div key={rule.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{rule.code}</span>
                  <span className="text-xs text-slate-500">{rule.transactionType}</span>
                </div>
                <div className="space-y-1">
                  {rule.requiredItems.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-600">
                      • {item.minCount}x {item.type} {item.docType && `(${item.docType})`}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'reasons' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Reason Codes</h3>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
              Add Reason Code
            </button>
          </div>
          <div className="space-y-3">
            {reasonCodes.map(rc => (
              <div key={rc.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{rc.code}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded">
                    {rc.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{rc.description}</p>
                <p className="text-xs text-slate-500">
                  Min narrative: {rc.requiresNarrativeMinChars} chars
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'matrix' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Exception Matrix</h3>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
              Add Exception Type
            </button>
          </div>
          <div className="space-y-4">
            {exceptionMatrix.map(em => (
              <div key={em.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 capitalize">
                  {em.exceptionType.replace(/_/g, ' ')}
                </h4>
                <div className="space-y-2">
                  {em.severityBandRule.bands.map((band, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200">
                      <span className="text-xs font-medium text-slate-700 w-32">
                        {band.min} - {band.max} {em.severityBandRule.type}
                      </span>
                      <div className="flex items-center gap-1 flex-1">
                        {band.approverChain.map((approver, i) => (
                          <span key={i} className="text-xs">
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                              {approver.replace(/_/g, ' ')}
                            </span>
                            {i < band.approverChain.length - 1 && (
                              <span className="mx-1 text-slate-400">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
    purple: 'bg-purple-50 border-purple-200',
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

function ModeCard({ mode, count, color }: { mode: string; count: number; color: string }) {
  const colorClasses = {
    slate: 'bg-slate-50 border-slate-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-2xl font-bold text-slate-900">{count}</p>
      <p className="text-xs text-slate-600 mt-1">{mode}</p>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
    SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
    APPROVED: { label: 'Approved', color: 'bg-green-100 text-green-700' },
    CONSUMED: { label: 'Consumed', color: 'bg-green-100 text-green-700' },
    EXPIRED: { label: 'Expired', color: 'bg-slate-100 text-slate-700' },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
    RETURNED: { label: 'Returned', color: 'bg-amber-100 text-amber-700' },
    EXECUTED_PENDING_REGULARISATION: { label: 'Pending Regularisation', color: 'bg-amber-100 text-amber-700' },
    REGULARISED: { label: 'Regularised', color: 'bg-green-100 text-green-700' },
    ESCALATED: { label: 'Escalated', color: 'bg-red-100 text-red-700' },
    OPEN: { label: 'Open', color: 'bg-red-100 text-red-700' },
    ACKNOWLEDGED: { label: 'Acknowledged', color: 'bg-amber-100 text-amber-700' },
    RESOLVED: { label: 'Resolved', color: 'bg-green-100 text-green-700' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${config.color}`}>
      {config.label}
    </span>
  );
}
