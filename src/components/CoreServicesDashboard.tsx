import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  sharedServices,
  requestContextFields,
  outboxEvents,
  numberSeries,
  backgroundJobs,
  healthStatus,
  recentAuditLogs,
  protocolControlPoints,
  errorCodes
} from '../data/coreServicesData';
import {
  Server, Database, Shield, Zap, FileText, Bell, Hash, Clock,
  CheckCircle2, XCircle, AlertTriangle, Activity, GitBranch,
  Lock, Unlock, Eye, ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

type Tab = 'overview' | 'services' | 'context' | 'outbox' | 'numbering' | 'jobs' | 'health' | 'audit' | 'errors';

export function CoreServicesDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Eye size={14} /> },
    { id: 'services', label: 'Shared Services', icon: <Layers size={14} /> },
    { id: 'context', label: 'Request Context', icon: <Shield size={14} /> },
    { id: 'outbox', label: 'Event Outbox', icon: <Zap size={14} /> },
    { id: 'numbering', label: 'Number Series', icon: <Hash size={14} /> },
    { id: 'jobs', label: 'Job Framework', icon: <Clock size={14} /> },
    { id: 'health', label: 'Health Checks', icon: <Activity size={14} /> },
    { id: 'audit', label: 'Audit Trail', icon: <FileText size={14} /> },
    { id: 'errors', label: 'Error Codes', icon: <AlertTriangle size={14} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Core Enterprise Foundation</h1>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">ff.core</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Part 3 — Shared service layer: auth, audit, events, numbering, jobs, and transaction helpers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
            <CheckCircle2 size={14} />
            All Services Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'context' && <ContextTab />}
        {activeTab === 'outbox' && <OutboxTab />}
        {activeTab === 'numbering' && <NumberingTab />}
        {activeTab === 'jobs' && <JobsTab />}
        {activeTab === 'health' && <HealthTab />}
        {activeTab === 'audit' && <AuditTab />}
        {activeTab === 'errors' && <ErrorsTab />}
      </motion.div>
    </div>
  );
}

function OverviewTab() {
  const serviceStats = [
    { label: 'Shared Services', value: sharedServices.length, icon: <Layers size={16} />, color: 'blue' },
    { label: 'Outbox Events (24h)', value: outboxEvents.length, icon: <Zap size={16} />, color: 'violet' },
    { label: 'Number Series', value: numberSeries.length, icon: <Hash size={16} />, color: 'emerald' },
    { label: 'Active Jobs', value: backgroundJobs.filter(j => j.status === 'running' || j.status === 'scheduled').length, icon: <Clock size={16} />, color: 'amber' },
    { label: 'Healthy Services', value: healthStatus.filter(h => h.status === 'healthy').length, icon: <Activity size={16} />, color: 'green' },
    { label: 'Audit Entries (24h)', value: recentAuditLogs.length, icon: <FileText size={16} />, color: 'slate' },
  ];

  const hooksDiagram = [
    { name: 'authorize', color: '#3b82f6' },
    { name: 'validate', color: '#8b5cf6' },
    { name: 'audit', color: '#22c55e' },
    { name: 'emit', color: '#f59e0b' },
    { name: 'notify', color: '#ef4444' },
    { name: 'attach', color: '#06b6d4' },
    { name: 'nextNumber', color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {serviceStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <div className={`inline-flex p-1.5 rounded-md bg-${stat.color}-50 text-${stat.color}-600`}>{stat.icon}</div>
            <p className="text-xl font-bold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-[10px] text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Architecture Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Shared Service Architecture</h3>
        <div className="relative">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="bg-slate-900 text-white rounded-xl p-4 text-center">
              <p className="text-xs font-bold">Business Service</p>
              <p className="text-[10px] text-slate-400 mt-1">e.g. POService.create()</p>
            </div>
            <ArrowRight size={20} className="text-slate-400" />
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-blue-900">BaseService.transaction()</p>
              <p className="text-[10px] text-blue-600 mt-1">Atomic wrapper</p>
            </div>
            <ArrowRight size={20} className="text-slate-400" />
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                <p className="text-[10px] font-bold text-green-800">DB Write</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                <p className="text-[10px] font-bold text-amber-800">Audit Log</p>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-2 text-center">
                <p className="text-[10px] font-bold text-violet-800">Outbox Event</p>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center">
                <p className="text-[10px] font-bold text-rose-800">Notification</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-[10px] text-slate-500 font-mono">
            // All hooks execute in a single DB transaction — commit or rollback together
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            await ctx.transaction(async (tx) =&gt; {'{'} await tx.save(entity); await tx.audit(...); await tx.emit(...); {'}'})
          </p>
        </div>
      </div>

      {/* Service Hooks */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Service Hooks</h3>
        <div className="flex flex-wrap gap-2">
          {hooksDiagram.map((hook, i) => (
            <motion.div key={hook.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="px-3 py-2 rounded-lg border-2 text-xs font-mono font-bold"
              style={{ borderColor: hook.color, color: hook.color, backgroundColor: `${hook.color}10` }}>
              {hook.name}()
            </motion.div>
          ))}
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Protocol Control Points (Part 7 integration)</h3>
        </div>
        <div className="p-3 space-y-2">
          {protocolControlPoints.map(cp => (
            <div key={cp.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><Shield size={16} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="text-[10px] font-mono text-slate-400">{cp.id}</code>
                  <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded font-medium">{cp.stage}</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">{cp.status.toUpperCase()}</span>
                </div>
                <p className="text-xs text-slate-700 mt-1">{cp.control}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{cp.serviceMethod}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {sharedServices.map((svc, i) => (
        <motion.div key={svc.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-slate-900">{svc.name}</h4>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
              svc.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
              svc.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-slate-50 text-slate-500 border-slate-200'
            }`}>{svc.status.toUpperCase()}</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">{svc.description}</p>
          <div className="space-y-1 mb-3">
            {svc.hooks.map((hook, j) => (
              <code key={j} className="block text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">{hook}</code>
            ))}
          </div>
          {svc.wrappedExisting && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              <GitBranch size={10} />
              <span>Wraps: {svc.existingEquivalent || 'existing implementation'}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ContextTab() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900">RequestContext — Created per request/job/socket message</h4>
        <p className="text-xs text-blue-700 mt-1">Carries user identity, scope, permissions snapshot, and correlation ID through the entire request lifecycle.</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Field</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Type</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Description</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Example</th>
            </tr>
          </thead>
          <tbody>
            {requestContextFields.map((field, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-2 font-mono font-medium text-slate-900">{field.field}</td>
                <td className="px-4 py-2 font-mono text-[10px] text-slate-500">{field.type}</td>
                <td className="px-4 py-2 text-slate-600">{field.description}</td>
                <td className="px-4 py-2 font-mono text-[10px] text-slate-400">{field.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OutboxTab() {
  const statusCounts = {
    published: outboxEvents.filter(e => e.status === 'published').length,
    pending: outboxEvents.filter(e => e.status === 'pending').length,
    failed: outboxEvents.filter(e => e.status === 'failed').length,
    dead_letter: outboxEvents.filter(e => e.status === 'dead_letter').length,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Published" value={statusCounts.published} color="green" />
        <StatCard label="Pending" value={statusCounts.pending} color="blue" />
        <StatCard label="Failed" value={statusCounts.failed} color="amber" />
        <StatCard label="Dead Letter" value={statusCounts.dead_letter} color="red" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">sys_event_outbox</h3>
          <span className="text-[10px] text-slate-400">At-least-once delivery · Exponential backoff · Dead letter after 5 attempts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Event</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Aggregate</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Scope</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Attempts</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Error</th>
              </tr>
            </thead>
            <tbody>
              {outboxEvents.map((evt, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-3 py-2">
                    <p className="font-mono text-slate-900">{evt.name}</p>
                    <p className="text-[10px] text-slate-400">{evt.eventId}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-slate-700">{evt.aggregateType}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{evt.aggregateId}</p>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-500">
                    {evt.projectId && <p>Project: {evt.projectId}</p>}
                    {evt.siteId && <p>Site: {evt.siteId}</p>}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-slate-600">{evt.attempts}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      evt.status === 'published' ? 'bg-green-50 text-green-700' :
                      evt.status === 'pending' ? 'bg-blue-50 text-blue-700' :
                      evt.status === 'failed' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>{evt.status.replace('_', ' ').toUpperCase()}</span>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-red-600 max-w-48 truncate">{evt.lastError || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NumberingTab() {
  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-emerald-900">Concurrency-Safe Number Allocation</h4>
        <p className="text-xs text-emerald-700 mt-1">Row-level locking ensures no duplicate numbers under 100 concurrent allocations. Preview endpoint available for UI.</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">sys_number_series</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Doc Type</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Template</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">FY</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Next</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Preview</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Gapless</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Last Generated</th>
              </tr>
            </thead>
            <tbody>
              {numberSeries.map((ns, i) => {
                const preview = ns.prefixTemplate
                  .replace('{FY}', ns.fy)
                  .replace('{PROJECT}', ns.projectId?.split('_').pop() || '')
                  .replace('{SEQ}', String(ns.nextValue).padStart(ns.padding, '0'));
                return (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-medium text-slate-900">{ns.docType}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{ns.prefixTemplate}</td>
                    <td className="px-3 py-2 text-slate-600">{ns.fy}</td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-slate-900">{ns.nextValue}</td>
                    <td className="px-3 py-2 text-center font-mono text-emerald-700 bg-emerald-50 rounded">{preview}</td>
                    <td className="px-3 py-2 text-center">
                      {ns.isGapless ? <Lock size={12} className="text-green-500 inline" /> : <Unlock size={12} className="text-slate-400 inline" />}
                    </td>
                    <td className="px-3 py-2 text-[10px] text-slate-400">{ns.lastGenerated ? new Date(ns.lastGenerated).toLocaleString() : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function JobsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Scheduled" value={backgroundJobs.filter(j => j.status === 'scheduled').length} color="blue" />
        <StatCard label="Running" value={backgroundJobs.filter(j => j.status === 'running').length} color="violet" />
        <StatCard label="Completed" value={backgroundJobs.filter(j => j.status === 'completed').length} color="green" />
        <StatCard label="Failed" value={backgroundJobs.filter(j => j.status === 'failed').length} color="red" />
        <StatCard label="Retrying" value={backgroundJobs.filter(j => j.status === 'retrying').length} color="amber" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">sys_jobs — BullMQ + Cron</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Job Type</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Attempts</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Run At</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Duration</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Correlation</th>
              </tr>
            </thead>
            <tbody>
              {backgroundJobs.map((job, i) => {
                const duration = job.startedAt && job.finishedAt
                  ? `${((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1000).toFixed(1)}s`
                  : job.startedAt ? 'running...' : '—';
                return (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-900">{job.type}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{job.jobId}</p>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        job.status === 'completed' ? 'bg-green-50 text-green-700' :
                        job.status === 'running' ? 'bg-violet-50 text-violet-700' :
                        job.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                        job.status === 'retrying' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>{job.status.toUpperCase()}</span>
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-slate-600">{job.attempts}/{job.maxAttempts}</td>
                    <td className="px-3 py-2 text-[10px] text-slate-500">{new Date(job.runAt).toLocaleString()}</td>
                    <td className="px-3 py-2 text-[10px] text-slate-500 font-mono">{duration}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-400">{job.correlationId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {backgroundJobs.filter(j => j.error).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-red-900 flex items-center gap-2"><AlertTriangle size={16} />Job Failures</h4>
          <div className="mt-2 space-y-2">
            {backgroundJobs.filter(j => j.error).map(job => (
              <div key={job.jobId} className="p-2 bg-white rounded-lg border border-red-100">
                <p className="text-xs font-medium text-slate-900">{job.type}</p>
                <p className="text-[10px] text-red-600 mt-0.5">{job.error}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HealthTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {healthStatus.map((svc, i) => (
          <motion.div key={svc.service} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-xl border shadow-sm p-4 ${
              svc.status === 'healthy' ? 'border-green-200' : svc.status === 'degraded' ? 'border-amber-200' : 'border-red-200'
            }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-900">{svc.service}</h4>
              <div className={`w-2.5 h-2.5 rounded-full ${
                svc.status === 'healthy' ? 'bg-green-500' : svc.status === 'degraded' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
              }`}></div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-slate-900">{svc.latency}</span>
              <span className="text-xs text-slate-500">ms</span>
            </div>
            <p className="text-[10px] text-slate-500">{svc.details}</p>
            <p className="text-[10px] text-slate-400 mt-2">Last check: {new Date(svc.lastCheck).toLocaleTimeString()}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Health Endpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <code className="text-xs font-mono text-blue-700">GET /health/live</code>
            <p className="text-[10px] text-slate-500 mt-1">Returns 200 if process is alive. Used by load balancer.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <code className="text-xs font-mono text-blue-700">GET /health/ready</code>
            <p className="text-[10px] text-slate-500 mt-1">Checks DB, cache, queue, storage. Returns 503 if any dependency down.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-slate-900">Audit Trail — SA-7 Compliant</h4>
        <p className="text-xs text-slate-600 mt-1">Every create, update, soft delete, state change captured with user, IP, device, before/after values, and correlation ID.</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Action</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Entity</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Change</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">IP / Device</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Correlation</th>
              </tr>
            </thead>
            <tbody>
              {recentAuditLogs.map((log, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      log.action === 'create' ? 'bg-green-50 text-green-700' :
                      log.action === 'update' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>{log.action.toUpperCase()}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-slate-900">{log.entityType}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{log.entityId}</p>
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{log.userId}</td>
                  <td className="px-3 py-2">
                    {log.before && log.after ? (
                      <div className="text-[10px]">
                        <p className="text-red-500">- {JSON.stringify(log.before).slice(0, 50)}</p>
                        <p className="text-green-600">+ {JSON.stringify(log.after).slice(0, 50)}</p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400">New record</p>
                    )}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-500">
                    <p>{log.ipAddress}</p>
                    <p className="text-slate-400">{log.deviceInfo}</p>
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-400">{log.correlationId}</td>
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
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-amber-900">Error Envelope — SA-11 / SA-17</h4>
        <p className="text-xs text-amber-700 mt-1">Standardized error responses with error code, correlation ID, and user-friendly message. Full catalogue in ERROR_CODES.md.</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Code</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">HTTP</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Technical Message</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">User Message</th>
              </tr>
            </thead>
            <tbody>
              {errorCodes.map((err, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-3 py-2 font-mono font-medium text-slate-900">{err.code}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      err.httpStatus < 400 ? 'bg-green-50 text-green-700' :
                      err.httpStatus < 500 ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>{err.httpStatus}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{err.message}</td>
                  <td className="px-3 py-2 text-slate-500 italic">{err.userMessage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-slate-700 mb-2">Error Envelope Format</h4>
        <pre className="text-[10px] font-mono text-slate-600 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
{`{
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "userMessage": "Please check the form for errors.",
    "correlationId": "corr_xyz789",
    "details": [{ "field": "amount", "message": "Must be positive" }],
    "timestamp": "2026-01-15T08:30:00Z"
  }
}`}
        </pre>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 text-${color}-600`}>{value}</p>
    </div>
  );
}
