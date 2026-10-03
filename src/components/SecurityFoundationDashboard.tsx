import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  routeRegistry,
  pipelinePolicies,
  pipelineRuns,
  riskAcceptances,
  dependencies,
  credentials,
  securityPolicies,
  mfaFactors,
  rateLimitPolicies,
  uploadPolicies,
  secretRefs,
  legacyFindings,
  protocolControlPoints,
  securityStats
} from '../data/securityFoundationData';

export function SecurityFoundationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🛡️' },
    { id: 'registry', label: 'Route Registry', icon: '📋' },
    { id: 'pipeline', label: 'CI/CD Pipeline', icon: '🔄' },
    { id: 'dependencies', label: 'Dependencies', icon: '📦' },
    { id: 'risk', label: 'Risk Acceptances', icon: '⚠️' },
    { id: 'legacy', label: 'Legacy Findings', icon: '🔍' },
    { id: 'policies', label: 'Policies', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Secure-by-Design Foundation</h1>
          <p className="text-sm text-slate-500 mt-1">Part 9 — Zero-trust pipeline, CI/CD security gates, and security baseline</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
            ff.secbase
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            Enforced
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
                  ? 'bg-red-50 text-red-700 border-b-2 border-red-700'
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
      {activeTab === 'registry' && <RegistryTab />}
      {activeTab === 'pipeline' && <PipelineTab />}
      {activeTab === 'dependencies' && <DependenciesTab />}
      {activeTab === 'risk' && <RiskTab />}
      {activeTab === 'legacy' && <LegacyTab />}
      {activeTab === 'policies' && <PoliciesTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Registered Routes"
          value={securityStats.totalRoutes}
          subtitle={`${securityStats.activeRoutes} active`}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Dependencies"
          value={securityStats.totalDependencies}
          subtitle={`${securityStats.deprecatedDependencies} deprecated`}
          icon="📦"
          color="green"
        />
        <StatCard
          title="Risk Acceptances"
          value={securityStats.activeRiskAcceptances}
          subtitle={`${securityStats.expiredRiskAcceptances} expired`}
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Legacy Findings"
          value={securityStats.openFindings}
          subtitle={`${securityStats.fixedFindings} fixed`}
          icon="🔍"
          color="red"
        />
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Authentication</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">MFA Enabled</span>
              <span className="text-lg font-bold text-green-600">{securityStats.mfaEnabledUsers}/{securityStats.totalCredentials}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Locked Accounts</span>
              <span className="text-lg font-bold text-red-600">{securityStats.lockedAccounts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Password Hash Algorithm</span>
              <span className="text-sm font-medium text-slate-900">Argon2id</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Secrets Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Secrets</span>
              <span className="text-lg font-bold text-slate-900">{securityStats.totalSecrets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Due for Rotation</span>
              <span className="text-lg font-bold text-amber-600">{securityStats.secretsDueForRotation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Storage</span>
              <span className="text-sm font-medium text-green-600">Vault ✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Runs</span>
              <span className="text-lg font-bold text-slate-900">{securityStats.totalPipelineRuns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Passed</span>
              <span className="text-lg font-bold text-green-600">{securityStats.passedPipelineRuns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Failed</span>
              <span className="text-lg font-bold text-red-600">{securityStats.failedPipelineRuns}</span>
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
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                    {cp.stage}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    {cp.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zero-Trust Pipeline */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Zero-Trust Request Pipeline</h3>
        <div className="flex items-center justify-between">
          {['Authenticate', 'Authorise', 'Validate', 'Execute', 'Audit'].map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">
                    {idx === 0 ? '🔐' : idx === 1 ? '🛡️' : idx === 2 ? '✓' : idx === 3 ? '⚡' : '📝'}
                  </span>
                </div>
                <span className="text-xs font-medium">{step}</span>
              </div>
              {idx < 4 && (
                <div className="w-12 h-0.5 bg-white/30 mx-2"></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-300 mt-4 text-center">
          Every request passes through all stages. No exceptions. No bypasses.
        </p>
      </div>
    </div>
  );
}

function RegistryTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Route Registry</h3>
        <p className="text-sm text-slate-500 mt-1">All API endpoints registered with security configurations</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Path</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Permission</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Scope</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Rate Limit</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Idempotent</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Module</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {routeRegistry.map(route => (
              <tr key={route.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    route.method === 'GET' ? 'bg-green-100 text-green-700' :
                    route.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                    route.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {route.method}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-slate-900 font-mono">{route.pathPattern}</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-slate-700 font-mono">{route.permissionKey}</code>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    {route.scopeRule}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{route.rateLimitGroup}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {route.idempotencyRequired ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{route.ownerModule}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PipelineTab() {
  return (
    <div className="space-y-6">
      {/* Pipeline Policies */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pipelinePolicies.map(policy => (
            <div key={policy.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900 uppercase">{policy.gate}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  policy.blockThreshold === 'critical' ? 'bg-red-100 text-red-700' :
                  policy.blockThreshold === 'high' ? 'bg-orange-100 text-orange-700' :
                  policy.blockThreshold === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  Block: {policy.blockThreshold}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Environment: <span className="font-medium">{policy.environment}</span></p>
                <p>Exception: <span className="font-medium">{policy.exceptionRequires}</span></p>
                <p>Approved by: <span className="font-medium">{policy.approvedBy}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Pipeline Runs */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Pipeline Runs</h3>
        <div className="space-y-3">
          {pipelineRuns.map(run => (
            <div key={run.id} className={`p-4 rounded-lg border ${
              run.result === 'pass' ? 'bg-green-50 border-green-200' :
              run.result === 'fail' ? 'bg-red-50 border-red-200' :
              'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    run.result === 'pass' ? 'bg-green-100 text-green-700' :
                    run.result === 'fail' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {run.result.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{run.gate}</span>
                  <span className="text-xs text-slate-500 font-mono">{run.commitSha}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(run.timestamp).toLocaleString()} • {run.duration}s
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-red-600">{run.findingsBySeverity.critical}</p>
                  <p className="text-slate-500">Critical</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-orange-600">{run.findingsBySeverity.high}</p>
                  <p className="text-slate-500">High</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-amber-600">{run.findingsBySeverity.medium}</p>
                  <p className="text-slate-500">Medium</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-blue-600">{run.findingsBySeverity.low}</p>
                  <p className="text-slate-500">Low</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="font-bold text-slate-600">{run.findingsBySeverity.info}</p>
                  <p className="text-slate-500">Info</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DependenciesTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Dependency Inventory</h3>
        <p className="text-sm text-slate-500 mt-1">Third-party packages with security review status</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Version</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Ecosystem</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Licence</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Advisories</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Reviewed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dependencies.map(dep => (
              <tr key={dep.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-900">{dep.package}</span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-slate-700 font-mono">{dep.version}</code>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{dep.ecosystem}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{dep.licenceSpdx}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {dep.openAdvisories > 0 ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      {dep.openAdvisories}
                    </span>
                  ) : (
                    <span className="text-green-600">✓</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    dep.status === 'approved' ? 'bg-green-100 text-green-700' :
                    dep.status === 'blocked' ? 'bg-red-100 text-red-700' :
                    dep.status === 'deprecated' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {dep.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-500">
                    {new Date(dep.lastReviewedAt).toLocaleDateString()}
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

function RiskTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Active Acceptances"
          value={securityStats.activeRiskAcceptances}
          subtitle="Time-limited exceptions"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Expired"
          value={securityStats.expiredRiskAcceptances}
          subtitle="Re-blocked builds"
          icon="⏰"
          color="red"
        />
        <StatCard
          title="Total"
          value={securityStats.totalRiskAcceptances}
          subtitle="All time"
          icon="📊"
          color="blue"
        />
      </div>

      {/* Risk Acceptances List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Risk Acceptances</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {riskAcceptances.map(risk => (
            <div key={risk.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-900">{risk.findingRef}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      risk.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      risk.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      risk.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {risk.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      risk.status === 'active' ? 'bg-green-100 text-green-700' :
                      risk.status === 'expired' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {risk.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{risk.justification}</p>
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Compensating Controls:</span> {risk.compensatingControls}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Requested by:</span>
                  <span className="ml-1 font-medium text-slate-700">{risk.requestedBy}</span>
                </div>
                <div>
                  <span className="text-slate-500">Approved by:</span>
                  <span className="ml-1 font-medium text-slate-700">{risk.approvedBy}</span>
                </div>
                <div>
                  <span className="text-slate-500">Expires:</span>
                  <span className="ml-1 font-medium text-slate-700">
                    {new Date(risk.expiresAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Requested:</span>
                  <span className="ml-1 font-medium text-slate-700">
                    {new Date(risk.requestedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegacyTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Open Findings"
          value={securityStats.openFindings}
          subtitle="Require remediation"
          icon="🔍"
          color="red"
        />
        <StatCard
          title="Fixed"
          value={securityStats.fixedFindings}
          subtitle="Behind flags or verified"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Total"
          value={securityStats.totalLegacyFindings}
          subtitle="All findings"
          icon="📊"
          color="blue"
        />
      </div>

      {/* Legacy Findings List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Legacy Security Findings</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {legacyFindings.map(finding => (
            <div key={finding.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      finding.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      finding.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      finding.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {finding.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {finding.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      finding.status === 'open' ? 'bg-red-100 text-red-700' :
                      finding.status === 'planned' ? 'bg-amber-100 text-amber-700' :
                      finding.status === 'fixed_behind_flag' ? 'bg-blue-100 text-blue-700' :
                      finding.status === 'verified' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {finding.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{finding.description}</p>
                  <p className="text-xs text-slate-500 font-mono mb-2">{finding.location}</p>
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">Remediation:</span> {finding.remediationPlan}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Flag:</span>
                  <span className="ml-1 font-mono text-slate-700">{finding.flagCode}</span>
                </div>
                <div>
                  <span className="text-slate-500">Discovered:</span>
                  <span className="ml-1 text-slate-700">
                    {new Date(finding.discoveredAt).toLocaleDateString()}
                  </span>
                </div>
                {finding.fixedAt && (
                  <div>
                    <span className="text-slate-500">Fixed:</span>
                    <span className="ml-1 text-slate-700">
                      {new Date(finding.fixedAt).toLocaleDateString()}
                    </span>
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

function PoliciesTab() {
  const [subTab, setSubTab] = useState('password');

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {['password', 'session', 'mfa', 'rate_limit', 'upload'].map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                subTab === tab
                  ? 'bg-red-50 text-red-700 border-b-2 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'password' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Password Policies</h3>
          <div className="space-y-4">
            {securityPolicies.filter(p => p.category === 'password').map(policy => (
              <div key={policy.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{policy.key}</span>
                  <span className="text-xs text-slate-500">
                    Effective: {new Date(policy.effectiveFrom).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-slate-700">
                  {typeof policy.value === 'object' ? (
                    <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                      {JSON.stringify(policy.value, null, 2)}
                    </pre>
                  ) : (
                    <span className="font-medium">{String(policy.value)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'session' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Session Policies</h3>
          <div className="space-y-4">
            {securityPolicies.filter(p => p.category === 'session').map(policy => (
              <div key={policy.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">{policy.key}</span>
                  <span className="text-sm font-bold text-red-700">{policy.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'mfa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">MFA Required Roles</h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              {securityPolicies.filter(p => p.category === 'mfa').map(policy => (
                <div key={policy.id}>
                  <div className="flex flex-wrap gap-2">
                    {(policy.value as string[]).map(role => (
                      <span key={role} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">MFA Factors</h3>
            <div className="space-y-3">
              {mfaFactors.map(factor => (
                <div key={factor.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-slate-900">{factor.userName}</span>
                      <span className="ml-2 text-xs text-slate-500">{factor.label}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      factor.type === 'totp' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {factor.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Verified:</span>
                      <span className="ml-1 text-slate-700">{new Date(factor.verifiedAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Last Used:</span>
                      <span className="ml-1 text-slate-700">{new Date(factor.lastUsedAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status:</span>
                      <span className="ml-1 text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'rate_limit' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Rate Limit Policies</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Group</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Limit</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Window</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Burst</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rateLimitPolicies.map(policy => (
                  <tr key={policy.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{policy.group}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-slate-900">{policy.limit}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-slate-700">{policy.windowSeconds}s</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-slate-700">{policy.burst}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        policy.action === 'block' ? 'bg-red-100 text-red-700' :
                        policy.action === 'challenge' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {policy.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'upload' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Policies</h3>
          <div className="space-y-4">
            {uploadPolicies.map(policy => (
              <div key={policy.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-900">{policy.context}</span>
                  <span className="text-xs text-slate-500">
                    Max: {(policy.maxBytes / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Allowed MIME types:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {policy.allowedMime.map(mime => (
                        <span key={mime} className="px-2 py-0.5 bg-white text-slate-700 rounded text-[10px]">
                          {mime}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-500">Magic byte check:</span>
                      <span className="ml-1 text-green-600 font-medium">{policy.magicByteCheck ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Malware scan:</span>
                      <span className="ml-1 text-green-600 font-medium">{policy.scanRequired ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Storage class:</span>
                      <span className="ml-1 text-slate-700 font-medium">{policy.storageClass}</span>
                    </div>
                  </div>
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
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
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
