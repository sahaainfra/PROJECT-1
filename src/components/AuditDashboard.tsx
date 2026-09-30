import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  stackInfo, moduleInventory, dbEntityMap, apiInventory, dependencyMap,
  gapMatrix, riskRegister, conflicts, controlInventory, socketEvents,
  backgroundJobs, existingReports, calculations,
  type ModuleInventory, type DBEntity, type RiskEntry, type GapEntry
} from '../data/auditData';
import {
  Database, Server, Shield, AlertTriangle, GitBranch, FileText,
  CheckCircle2, XCircle, Clock, ArrowRight, ArrowLeftRight,
  Layers, Zap, Lock, Unlock, Eye, Search, Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

type Tab = 'overview' | 'modules' | 'database' | 'api' | 'dependencies' | 'gaps' | 'risks' | 'controls' | 'conflicts';

export function AuditDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Eye size={14} /> },
    { id: 'modules', label: 'Modules', icon: <Layers size={14} />, count: moduleInventory.length },
    { id: 'database', label: 'Database', icon: <Database size={14} />, count: dbEntityMap.length },
    { id: 'api', label: 'APIs', icon: <Server size={14} />, count: apiInventory.length },
    { id: 'dependencies', label: 'Dependencies', icon: <GitBranch size={14} />, count: dependencyMap.length },
    { id: 'gaps', label: 'Gap Matrix', icon: <FileText size={14} />, count: gapMatrix.length },
    { id: 'risks', label: 'Risks', icon: <AlertTriangle size={14} />, count: riskRegister.length },
    { id: 'controls', label: 'Controls', icon: <Shield size={14} />, count: controlInventory.length },
    { id: 'conflicts', label: 'Conflicts', icon: <ArrowLeftRight size={14} />, count: conflicts.length },
  ];

  const criticalRisks = riskRegister.filter(r => r.severity === 'critical').length;
  const highRisks = riskRegister.filter(r => r.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">System Audit & Architecture Discovery</h1>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              ff.audit
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Part 2 — Read-only technical inventory, gap analysis, and dependency map for Parts 3–126
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
            <CheckCircle2 size={14} />
            Read-Only Audit
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <SummaryCard label="Modules Found" value={moduleInventory.length} icon={<Layers size={16} />} color="blue" />
        <SummaryCard label="DB Tables" value={dbEntityMap.filter(d => d.existingTable !== '—').length} icon={<Database size={16} />} color="violet" />
        <SummaryCard label="API Endpoints" value={apiInventory.length} icon={<Server size={16} />} color="emerald" />
        <SummaryCard label="Critical Risks" value={criticalRisks} icon={<AlertTriangle size={16} />} color="red" />
        <SummaryCard label="High Risks" value={highRisks} icon={<AlertTriangle size={16} />} color="amber" />
        <SummaryCard label="Conflicts" value={conflicts.length} icon={<ArrowLeftRight size={16} />} color="orange" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'modules' && <ModulesTab filter={moduleFilter} setFilter={setModuleFilter} />}
        {activeTab === 'database' && <DatabaseTab search={searchQuery} setSearch={setSearchQuery} />}
        {activeTab === 'api' && <APITab search={searchQuery} setSearch={setSearchQuery} />}
        {activeTab === 'dependencies' && <DependenciesTab />}
        {activeTab === 'gaps' && <GapsTab />}
        {activeTab === 'risks' && <RisksTab filter={riskFilter} setFilter={setRiskFilter} />}
        {activeTab === 'controls' && <ControlsTab />}
        {activeTab === 'conflicts' && <ConflictsTab />}
      </motion.div>
    </div>
  );
}

// Summary Card
function SummaryCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
      <div className={`inline-flex p-1.5 rounded-md bg-${color}-50 text-${color}-600`}>{icon}</div>
      <p className="text-xl font-bold text-slate-900 mt-2">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}

// Overview Tab
function OverviewTab() {
  const statusData = [
    { name: 'Working', value: moduleInventory.filter(m => m.status === 'working').length, color: '#22c55e' },
    { name: 'Partial', value: moduleInventory.filter(m => m.status === 'partial').length, color: '#f59e0b' },
    { name: 'Broken', value: moduleInventory.filter(m => m.status === 'broken').length, color: '#ef4444' },
    { name: 'Missing', value: moduleInventory.filter(m => m.status === 'missing').length, color: '#94a3b8' },
  ];

  const coverageData = moduleInventory.map(m => ({ name: m.name.split('/')[0].split(' ')[0], coverage: m.coverage }));

  return (
    <div className="space-y-6">
      {/* Stack Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Technology Stack</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StackSection title="Frontend" items={stackInfo.frontend} />
          <StackSection title="Backend" items={stackInfo.backend} />
          <StackSection title="Database & Storage" items={stackInfo.database} />
          <StackSection title="Authentication" items={stackInfo.auth} />
          <StackSection title="Deployment" items={stackInfo.deployment} />
          <StackSection title="Monitoring" items={stackInfo.monitoring} />
        </div>
      </div>

      {/* Module Status + Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Module Status Distribution</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Module Coverage (%)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={70} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="coverage" radius={[0, 4, 4, 0]}>
                  {coverageData.map((entry, i) => (
                    <Cell key={i} fill={entry.coverage >= 70 ? '#22c55e' : entry.coverage >= 40 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Background Jobs & Socket Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Background Jobs</h3>
          </div>
          <div className="p-3 space-y-2">
            {backgroundJobs.map((job, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <div className={`w-2 h-2 rounded-full ${
                  job.status === 'working' ? 'bg-green-500' : job.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900">{job.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{job.schedule}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  job.status === 'working' ? 'bg-green-50 text-green-700' : job.status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                }`}>{job.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Socket.IO Events</h3>
          </div>
          <div className="p-3 space-y-2">
            {socketEvents.map((evt, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <Zap size={10} className="text-blue-500" />
                  <code className="text-[10px] font-mono text-slate-700">{evt.event}</code>
                  <span className="text-[10px] text-slate-400">ns: {evt.namespace}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Rooms: {evt.rooms} · Auth: {evt.auth}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Existing Reports */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Existing Reports ({existingReports.length})</h3>
          <span className="text-[10px] text-amber-600 font-medium">⚠ No permission filtering on most reports</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase">Report</th>
                <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase">Type</th>
                <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase">Generation</th>
                <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase">Frequency</th>
                <th className="text-center px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase">Perm Filter</th>
              </tr>
            </thead>
            <tbody>
              {existingReports.map((rpt, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-2 text-slate-700">{rpt.name}</td>
                  <td className="px-4 py-2"><span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">{rpt.type}</span></td>
                  <td className="px-4 py-2 text-slate-500 font-mono text-[10px]">{rpt.generation}</td>
                  <td className="px-4 py-2 text-slate-500">{rpt.frequency}</td>
                  <td className="px-4 py-2 text-center">
                    {rpt.permissionFilter ? <CheckCircle2 size={12} className="text-green-500 inline" /> : <XCircle size={12} className="text-red-400 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Calculation Inventory ({calculations.length})</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Protected characterisation tests — these formulas must not change without explicit approval</p>
        </div>
        <div className="p-3 space-y-2">
          {calculations.map((calc, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-[10px] font-mono text-blue-600">{calc.id}</code>
                <span className="text-xs font-medium text-slate-900">{calc.name}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-400">Formula: </span>
                  <code className="text-slate-700 font-mono">{calc.formula}</code>
                </div>
                <div>
                  <span className="text-slate-400">Location: </span>
                  <code className="text-slate-600 font-mono">{calc.location}</code>
                </div>
                <div>
                  <span className="text-slate-400">Example: </span>
                  <span className="text-slate-700">{calc.example}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackSection({ title, items }: { title: string; items: Record<string, string | string[]> }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h4>
      <div className="space-y-1">
        {Object.entries(items).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 capitalize w-20">{key}:</span>
            <span className="text-slate-700 font-medium">{Array.isArray(value) ? value.join(', ') : value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modules Tab
function ModulesTab({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const filtered = moduleInventory.filter(m => filter === 'all' || m.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {['all', 'working', 'partial', 'broken'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-900">{mod.name}</h4>
              <StatusBadge status={mod.status} />
            </div>
            <p className="text-xs text-slate-500 mb-3">{mod.notes}</p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <MiniStat label="Routes" value={mod.routes} />
              <MiniStat label="Screens" value={mod.screens} />
              <MiniStat label="Tables" value={mod.tables} />
              <MiniStat label="APIs" value={mod.apis} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Coverage</span>
                  <span>{mod.coverage}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${mod.coverage >= 70 ? 'bg-green-500' : mod.coverage >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${mod.coverage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">→ {mod.programParts}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Database Tab
function DatabaseTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const filtered = dbEntityMap.filter(e =>
    e.targetEntity.toLowerCase().includes(search.toLowerCase()) ||
    e.existingTable.toLowerCase().includes(search.toLowerCase())
  );

  const decisionCounts = {
    REUSE: dbEntityMap.filter(e => e.decision === 'REUSE').length,
    EXTEND: dbEntityMap.filter(e => e.decision === 'EXTEND').length,
    NEW: dbEntityMap.filter(e => e.decision === 'NEW').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium">REUSE: {decisionCounts.REUSE}</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">EXTEND: {decisionCounts.EXTEND}</span>
          <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded font-medium">NEW: {decisionCounts.NEW}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Target Entity</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Existing Table</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Key Columns</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Decision</th>
                <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Rows</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entity, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-3 py-2 font-medium text-slate-900">{entity.targetEntity}</td>
                  <td className="px-3 py-2 font-mono text-slate-600">{entity.existingTable}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-400 max-w-48 truncate">{entity.existingColumns}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      entity.decision === 'REUSE' ? 'bg-green-50 text-green-700' :
                      entity.decision === 'EXTEND' ? 'bg-blue-50 text-blue-700' :
                      'bg-violet-50 text-violet-700'
                    }`}>{entity.decision}</span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-slate-500">{entity.rowCount > 0 ? entity.rowCount.toLocaleString() : '—'}</td>
                  <td className="px-3 py-2 text-slate-500 max-w-56 truncate">{entity.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// API Tab
function APITab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const filtered = apiInventory.filter(e =>
    e.path.toLowerCase().includes(search.toLowerCase()) ||
    e.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search endpoints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Method</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Path</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Handler</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Auth</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Perm Check</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Method</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Module</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ep, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ep.method === 'GET' ? 'bg-green-50 text-green-700' :
                      ep.method === 'POST' ? 'bg-blue-50 text-blue-700' :
                      ep.method === 'PUT' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>{ep.method}</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-slate-700">{ep.path}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{ep.handler}</td>
                  <td className="px-3 py-2 text-center">
                    {ep.authRequired ? <Lock size={12} className="text-green-500 inline" /> : <Unlock size={12} className="text-red-400 inline" />}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {ep.permissionChecked ? <CheckCircle2 size={12} className="text-green-500 inline" /> : <XCircle size={12} className="text-red-400 inline" />}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-500 max-w-36 truncate">{ep.permissionMethod}</td>
                  <td className="px-3 py-2"><span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{ep.module}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Observations */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-red-900 flex items-center gap-2">
          <AlertTriangle size={16} />
          Security Observations
        </h4>
        <ul className="mt-2 space-y-1 text-xs text-red-700">
          <li>• {apiInventory.filter(e => !e.permissionChecked).length} endpoints have no permission check</li>
          <li>• 3 endpoints use hardcoded role checks instead of permission engine</li>
          <li>• GET /api/projects/:id has no scope check (IDOR risk)</li>
          <li>• No rate limiting observed on any endpoint</li>
        </ul>
      </div>
    </div>
  );
}

// Dependencies Tab
function DependenciesTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Module Dependency Graph</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dependencyMap.map((dep, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-700">{dep.from}</span>
                <ArrowRight size={12} className="text-slate-400" />
                <span className="text-xs font-semibold text-violet-700">{dep.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  dep.type === 'data' ? 'bg-blue-50 text-blue-600' :
                  dep.type === 'api' ? 'bg-green-50 text-green-600' :
                  dep.type === 'event' ? 'bg-amber-50 text-amber-600' :
                  'bg-violet-50 text-violet-600'
                }`}>{dep.type}</span>
                <span className={`text-[10px] ${
                  dep.strength === 'strong' ? 'text-red-600' : dep.strength === 'moderate' ? 'text-amber-600' : 'text-slate-400'
                }`}>● {dep.strength}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{dep.notes}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hidden Couplings */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
          <AlertTriangle size={16} />
          Hidden Couplings & Circular Dependencies
        </h4>
        <ul className="mt-2 space-y-2 text-xs text-amber-800">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span><strong>material ↔ finance:</strong> PO approval should trigger AP entry but is currently manual. Risk of unrecorded liabilities.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span><strong>subcontract ↔ finance:</strong> RA bill approval should create AP entry — not connected. Payments may not match bills.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span><strong>quality → material:</strong> GRN should trigger quality check event — event handler is broken since Redis migration.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
            <span><strong>report → multiple:</strong> Reports query tables directly bypassing service layer. Schema changes will break reports silently.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Gaps Tab
function GapsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900">Gap Matrix — Parts 3–126 Coverage Analysis</h4>
        <p className="text-xs text-blue-700 mt-1">For each program part: existing coverage %, reusable artifacts, missing capabilities, and risks.</p>
      </div>

      <div className="space-y-3">
        {gapMatrix.map((gap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{gap.part}</span>
                <span className="text-xs text-slate-500">— {gap.module}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Coverage:</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${gap.existingCoverage >= 60 ? 'bg-green-500' : gap.existingCoverage >= 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${gap.existingCoverage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-700">{gap.existingCoverage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider mb-1">Reusable</p>
                <ul className="space-y-0.5">
                  {gap.reusableArtifacts.map((a, j) => (
                    <li key={j} className="text-[10px] text-slate-600 flex items-center gap-1">
                      <CheckCircle2 size={8} className="text-green-500" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1">Missing</p>
                <ul className="space-y-0.5">
                  {gap.missingCapabilities.map((m, j) => (
                    <li key={j} className="text-[10px] text-slate-600 flex items-center gap-1">
                      <XCircle size={8} className="text-amber-500" /> {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider mb-1">Risks</p>
                <ul className="space-y-0.5">
                  {gap.risks.map((r, j) => (
                    <li key={j} className="text-[10px] text-slate-600 flex items-center gap-1">
                      <AlertTriangle size={8} className="text-red-500" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400">Recommendation:</p>
              <p className="text-xs text-slate-700">{gap.recommendation}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Risks Tab
function RisksTab({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const filtered = riskRegister.filter(r => filter === 'all' || r.severity === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {['all', 'critical', 'high', 'medium', 'low'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' && (
              <span className="ml-1 text-[10px]">({riskRegister.filter(r => r.severity === s).length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((risk, i) => (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`bg-white rounded-xl border shadow-sm p-4 ${
              risk.severity === 'critical' ? 'border-red-200' :
              risk.severity === 'high' ? 'border-amber-200' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                risk.severity === 'critical' ? 'bg-red-50 text-red-600' :
                risk.severity === 'high' ? 'bg-amber-50 text-amber-600' :
                risk.severity === 'medium' ? 'bg-blue-50 text-blue-600' :
                'bg-slate-50 text-slate-500'
              }`}>
                <AlertTriangle size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[10px] font-mono text-slate-400">{risk.id}</code>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    risk.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    risk.severity === 'high' ? 'bg-amber-100 text-amber-700' :
                    risk.severity === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{risk.severity.toUpperCase()}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{risk.category.replace('_', ' ')}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900">{risk.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{risk.description}</p>
                <div className="mt-2 p-2 bg-slate-50 rounded text-[10px]">
                  <span className="text-slate-400">Evidence: </span>
                  <code className="text-slate-600 font-mono">{risk.evidence}</code>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    {risk.affectedParts.map((p, j) => (
                      <span key={j} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">Mitigation: {risk.mitigation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Controls Tab
function ControlsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-violet-900">Control Inventory — PC-1 Stage Coverage</h4>
        <p className="text-xs text-violet-700 mt-1">
          Maps existing validations/controls to protocol stages. Feeds Part 7's OBSERVE seeding.
          Enforcement: <span className="font-bold">hard</span> = server-side block, <span className="font-bold">soft</span> = UI-only warning, <span className="font-bold">none</span> = gap.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">ID</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Module</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">PC Stage</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Control</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Location</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Enforcement</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Gap</th>
              </tr>
            </thead>
            <tbody>
              {controlInventory.map((ctrl, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-400">{ctrl.id}</td>
                  <td className="px-3 py-2 text-slate-700">{ctrl.module}</td>
                  <td className="px-3 py-2">
                    <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded font-medium">{ctrl.pcStage}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-700 max-w-48 truncate">{ctrl.description}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-500 max-w-40 truncate">{ctrl.existingLocation}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ctrl.enforcement === 'hard' ? 'bg-green-50 text-green-700' :
                      ctrl.enforcement === 'soft' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>{ctrl.enforcement}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-500 max-w-48 truncate">{ctrl.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stage Coverage Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['PLAN', 'AUTHORIZE', 'EXECUTE', 'VERIFY', 'RECORD', 'MONITOR', 'RECONCILE', 'CLOSE'].map(stage => {
          const controls = controlInventory.filter(c => c.pcStage === stage);
          const hardCount = controls.filter(c => c.enforcement === 'hard').length;
          const softCount = controls.filter(c => c.enforcement === 'soft').length;
          const noneCount = controls.filter(c => c.enforcement === 'none').length;
          return (
            <div key={stage} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
              <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-wider">{stage}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-slate-900">{controls.length}</span>
                <span className="text-[10px] text-slate-400">controls</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {hardCount > 0 && <span className="text-[9px] bg-green-50 text-green-600 px-1 rounded">{hardCount} hard</span>}
                {softCount > 0 && <span className="text-[9px] bg-amber-50 text-amber-600 px-1 rounded">{softCount} soft</span>}
                {noneCount > 0 && <span className="text-[9px] bg-red-50 text-red-600 px-1 rounded">{noneCount} none</span>}
                {controls.length === 0 && <span className="text-[9px] text-slate-400">No controls</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Conflicts Tab
function ConflictsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-orange-900 flex items-center gap-2">
          <ArrowLeftRight size={16} />
          Duplicate / Conflict Detection
        </h4>
        <p className="text-xs text-orange-700 mt-1">
          Two implementations of the same concept detected. Each must be resolved before the relevant Part executes.
        </p>
      </div>

      <div className="space-y-3">
        {conflicts.map((conflict, i) => (
          <motion.div
            key={conflict.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-orange-100 shadow-sm p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <code className="text-[10px] font-mono text-orange-500">{conflict.id}</code>
              <h4 className="text-sm font-semibold text-slate-900">{conflict.title}</h4>
            </div>
            <p className="text-xs text-slate-600 mb-3">{conflict.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                <p className="text-[10px] font-semibold text-red-600 mb-0.5">Location 1</p>
                <code className="text-[10px] text-red-700 font-mono">{conflict.location1}</code>
              </div>
              <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                <p className="text-[10px] font-semibold text-red-600 mb-0.5">Location 2</p>
                <code className="text-[10px] text-red-700 font-mono">{conflict.location2}</code>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1">
                {conflict.affectedParts.map((p, j) => (
                  <span key={j} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{p}</span>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 max-w-md text-right">Resolution: {conflict.resolution}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Helper components
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'working': 'bg-green-50 text-green-700 border-green-200',
    'partial': 'bg-amber-50 text-amber-700 border-amber-200',
    'broken': 'bg-red-50 text-red-700 border-red-200',
    'missing': 'bg-slate-50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${colors[status] || colors.missing}`}>
      {status.toUpperCase()}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center bg-slate-50 rounded p-1.5">
      <p className="text-sm font-bold text-slate-900">{value}</p>
      <p className="text-[9px] text-slate-400">{label}</p>
    </div>
  );
}
