import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  auditLogs,
  loginHistory,
  sessions,
  securityEvents,
  reasonCodes,
  hashChainVerifications,
  retentionPolicies,
  auditStats
} from '../data/auditSecurityData';

export function AuditSecurityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'audit', label: 'Audit Explorer', icon: '📋' },
    { id: 'sessions', label: 'Sessions', icon: '🔐' },
    { id: 'security', label: 'Security Events', icon: '🚨' },
    { id: 'hashchain', label: 'Hash Chain', icon: '🔗' },
    { id: 'config', label: 'Configuration', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit, Security & Governance</h1>
          <p className="text-sm text-slate-500 mt-1">Part 8 — Tamper-evident audit engine and security controls</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
            ff.audit_sec
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
      {activeTab === 'audit' && <AuditExplorerTab />}
      {activeTab === 'sessions' && <SessionsTab />}
      {activeTab === 'security' && <SecurityEventsTab />}
      {activeTab === 'hashchain' && <HashChainTab />}
      {activeTab === 'config' && <ConfigurationTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Audit Records"
          value={auditStats.totalAuditRecords.toLocaleString()}
          subtitle="All time"
          icon="📋"
          color="purple"
        />
        <StatCard
          title="Active Sessions"
          value={auditStats.activeSessions}
          subtitle={`${auditStats.revokedSessions} revoked`}
          icon="🔐"
          color="blue"
        />
        <StatCard
          title="Security Events"
          value={auditStats.openSecurityEvents}
          subtitle={`${auditStats.criticalEvents} critical`}
          icon="🚨"
          color="red"
        />
        <StatCard
          title="Hash Chain"
          value="Verified"
          subtitle="Last: 2 hours ago"
          icon="🔗"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Logs */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Audit Activity</h3>
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.action === 'create' ? 'bg-green-500' :
                  log.action === 'update' ? 'bg-blue-500' :
                  log.action === 'approval' ? 'bg-purple-500' :
                  log.action === 'delete' ? 'bg-red-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{log.actorName}</span>
                    {' '}{log.actionDescription}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {log.entityNumber || log.entityType} • {log.projectName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Alerts</h3>
          <div className="space-y-3">
            {securityEvents.filter(e => e.status === 'open').slice(0, 5).map(event => (
              <div key={event.id} className={`p-3 rounded-lg border ${
                event.severity === 'critical' ? 'bg-red-50 border-red-200' :
                event.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                event.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    event.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    event.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    event.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {event.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-slate-900 font-medium">{event.description}</p>
                <p className="text-xs text-slate-600 mt-1">{event.userName || 'Unknown User'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hash Chain Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hash Chain Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-700">{auditStats.verifiedRecords.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">Verified Records</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-2xl font-bold text-red-700">{auditStats.brokenLinks}</p>
            <p className="text-xs text-red-600 mt-1">Broken Links</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">
              {new Date(auditStats.lastVerification).toLocaleDateString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">Last Verification</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditExplorerTab() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filter === 'all' || log.module === filter;
    const matchesSearch = searchTerm === '' || 
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by user, document number, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'mat', 'fin', 'iam', 'org'].map(module => (
              <button
                key={module}
                onClick={() => setFilter(module)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === module
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {module === 'all' ? 'All Modules' : module.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{log.actorName}</p>
                      <p className="text-xs text-slate-500">{log.ipAddress}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      log.action === 'create' ? 'bg-green-100 text-green-700' :
                      log.action === 'update' ? 'bg-blue-100 text-blue-700' :
                      log.action === 'approval' ? 'bg-purple-100 text-purple-700' :
                      log.action === 'delete' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{log.entityNumber || log.entityType}</p>
                      <p className="text-xs text-slate-500">{log.entityType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{log.projectName || '—'}</td>
                  <td className="px-6 py-4">
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                      View Details →
                    </button>
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

function SessionsTab() {
  const [filter, setFilter] = useState('active');

  const filteredSessions = sessions.filter(s => 
    filter === 'all' ? true : filter === 'active' ? s.isActive : !s.isActive
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Active Sessions"
          value={auditStats.activeSessions}
          subtitle="Currently logged in"
          icon="🟢"
          color="green"
        />
        <StatCard
          title="Revoked Sessions"
          value={auditStats.revokedSessions}
          subtitle="Manually terminated"
          icon="🔴"
          color="red"
        />
        <StatCard
          title="Total Sessions"
          value={auditStats.totalSessions}
          subtitle="All time"
          icon="📊"
          color="blue"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex gap-2">
          {['active', 'revoked', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Session Management</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredSessions.map(session => (
            <div key={session.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    session.deviceType === 'desktop' ? 'bg-blue-100' :
                    session.deviceType === 'mobile' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <span className="text-xl">
                      {session.deviceType === 'desktop' ? '💻' :
                       session.deviceType === 'mobile' ? '📱' : '📟'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{session.deviceName}</p>
                    <p className="text-xs text-slate-500">{session.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      Revoked
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-xs">
                  <span className="text-slate-500">Browser:</span>
                  <span className="ml-1 text-slate-700">{session.browser}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">OS:</span>
                  <span className="ml-1 text-slate-700">{session.os}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">IP:</span>
                  <span className="ml-1 text-slate-700">{session.ipAddress}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Location:</span>
                  <span className="ml-1 text-slate-700">{session.location || 'Unknown'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div>
                  <span>Created: {new Date(session.createdAt).toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <span>Last seen: {new Date(session.lastSeenAt).toLocaleString()}</span>
                </div>
                {session.isActive && (
                  <button className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">
                    Revoke Session
                  </button>
                )}
                {!session.isActive && session.revokedAt && (
                  <div className="text-xs text-slate-500">
                    Revoked: {new Date(session.revokedAt).toLocaleString()}
                    {session.revokeReason && ` • ${session.revokeReason}`}
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

function SecurityEventsTab() {
  const [filter, setFilter] = useState('all');

  const filteredEvents = securityEvents.filter(e => 
    filter === 'all' ? true : e.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Open Events"
          value={auditStats.openSecurityEvents}
          subtitle="Require attention"
          icon="🚨"
          color="red"
        />
        <StatCard
          title="Critical"
          value={auditStats.criticalEvents}
          subtitle="High priority"
          icon="⚠️"
          color="orange"
        />
        <StatCard
          title="Total Events"
          value={auditStats.totalSecurityEvents}
          subtitle="Last 30 days"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Failed Logins"
          value={auditStats.failedLoginsToday}
          subtitle="Today"
          icon="🔒"
          color="amber"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex gap-2">
          {['all', 'open', 'acknowledged', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Security Events</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredEvents.map(event => (
            <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.severity === 'critical' ? 'bg-red-100' :
                    event.severity === 'high' ? 'bg-orange-100' :
                    event.severity === 'medium' ? 'bg-amber-100' :
                    'bg-slate-100'
                  }`}>
                    <span className="text-xl">
                      {event.type === 'brute_force' ? '🔓' :
                       event.type === 'privileged_change' ? '👑' :
                       event.type === 'sensitive_read' ? '👁️' :
                       event.type === 'export_bulk' ? '📤' :
                       event.type === 'impossible_travel' ? '✈️' : '⚠️'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        event.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        event.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                        event.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {event.severity.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                        {event.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{event.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{event.userName || 'Unknown User'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    event.status === 'open' ? 'bg-red-100 text-red-700' :
                    event.status === 'acknowledged' ? 'bg-amber-100 text-amber-700' :
                    event.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 mb-3">
                <p className="font-medium mb-1">Details:</p>
                <pre className="bg-slate-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(event.detailsJson, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{new Date(event.timestamp).toLocaleString()}</span>
                {event.status === 'open' && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">
                      Resolve
                    </button>
                  </div>
                )}
                {event.status === 'resolved' && event.resolutionNotes && (
                  <div className="text-xs text-slate-500">
                    Resolved by {event.handledBy} • {event.resolutionNotes}
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

function HashChainTab() {
  return (
    <div className="space-y-6">
      {/* Hash Chain Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hash Chain Integrity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-700">{auditStats.verifiedRecords.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">Verified Records</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-2xl font-bold text-red-700">{auditStats.brokenLinks}</p>
            <p className="text-xs text-red-600 mt-1">Broken Links</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">
              {new Date(auditStats.lastVerification).toLocaleDateString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">Last Verification</p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">About Hash Chain Verification</h4>
          <p className="text-xs text-purple-700">
            Each audit record contains a cryptographic hash of its content plus the hash of the previous record, 
            creating an immutable chain. Nightly verification jobs check the integrity of the entire chain. 
            Any tampering with audit records will break the chain and be immediately detected.
          </p>
        </div>
      </div>

      {/* Verification History */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Verification History</h3>
        <div className="space-y-3">
          {hashChainVerifications.map(verification => (
            <div key={verification.id} className={`p-4 rounded-lg border ${
              verification.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    verification.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {verification.status.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {new Date(verification.verificationDate).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-slate-500">Verified by: {verification.verifiedBy}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Total Records:</span>
                  <span className="ml-1 font-medium text-slate-700">{verification.totalRecords.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Verified:</span>
                  <span className="ml-1 font-medium text-slate-700">{verification.verifiedRecords.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Broken Links:</span>
                  <span className="ml-1 font-medium text-slate-700">{verification.brokenLinks}</span>
                </div>
              </div>
              {verification.brokenRecordIds.length > 0 && (
                <div className="mt-2 text-xs text-red-700">
                  Broken Record IDs: {verification.brokenRecordIds.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfigurationTab() {
  return (
    <div className="space-y-6">
      {/* Reason Codes */}
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
                  {rc.module.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2">{rc.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Requires narrative: {rc.requiresNarrative ? 'Yes' : 'No'}</span>
                {rc.requiresNarrative && (
                  <span>Min length: {rc.minNarrativeLength} chars</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention Policies */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Retention Policies</h3>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
            Add Policy
          </button>
        </div>
        <div className="space-y-3">
          {retentionPolicies.map(policy => (
            <div key={policy.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">
                  {policy.module.toUpperCase()} - {policy.entityType}
                </span>
                <span className="text-sm font-bold text-purple-700">
                  {policy.retentionDays} days
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>Archive to cold storage: {policy.archiveToColdStorage ? 'Yes' : 'No'}</span>
                <span>Auto-delete: {policy.autoDelete ? 'Yes' : 'No'}</span>
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
    purple: 'bg-purple-50 border-purple-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200'
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
