import { motion } from 'framer-motion';
import { modules, baselineMetrics, regressionResults } from '../data/mockData';
import { 
  Database, Shield, Flag, TestTube, BookOpen, CheckCircle2,
  TrendingUp, Clock, AlertCircle, ArrowRight, Eye, Search, AlertTriangle, Activity, Building2, Key, FileText, Users, Settings, LayoutDashboard, Smartphone, Edit
} from 'lucide-react';

type View = 'launchpad' | 'baseline' | 'flags' | 'protocol' | 'regression' | 'docs' | 'acceptance' | 'preview' | 'audit' | 'core' | 'org' | 'iam' | 'wf' | 'protocol-engine' | 'audit-sec' | 'security' | 'acc' | 'mdm' | 'xls' | 'design-system' | 'dashboard' | 'responsive' | 'data-entry' | 'search';

interface LaunchpadProps {
  onNavigate: (view: View) => void;
}

const quickStats = [
  { label: 'Tables', value: baselineMetrics.tables, icon: <Database size={18} />, color: 'blue' },
  { label: 'Total Rows', value: baselineMetrics.totalRows.toLocaleString(), icon: <TrendingUp size={18} />, color: 'emerald' },
  { label: 'Tests Passing', value: `${regressionResults.passed}/${regressionResults.totalTests}`, icon: <TestTube size={18} />, color: 'green' },
  { label: 'Integrity', value: `${baselineMetrics.dataIntegrity}%`, icon: <Shield size={18} />, color: 'violet' },
];

const recentActivity = [
  { time: '08:30', event: 'Baseline integrity check completed — 100% match', type: 'success' },
  { time: '08:25', event: 'Regression harness: 42/42 tests passed', type: 'success' },
  { time: '08:20', event: 'Schema baseline exported to schema_baseline.sql', type: 'info' },
  { time: '08:15', event: 'Feature flag ff.pgm enabled globally', type: 'info' },
  { time: '08:10', event: 'Protocol controls registered in OBSERVE mode', type: 'info' },
  { time: '08:05', event: 'Git tag erp-baseline-v0 created', type: 'success' },
  { time: '08:00', event: 'Branch erp-program/baseline created', type: 'info' },
];

export function Launchpad({ onNavigate }: LaunchpadProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Program Launchpad</h1>
        <p className="text-sm text-slate-500 mt-1">
          Part 0 of 126 — Foundation phase. Governed engineering baseline established.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.icon}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Module Tiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Module Overview</h2>
          <span className="text-xs text-slate-400">11 modules · Parts 0–126</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`
                bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer
                ${mod.status === 'active' ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'}
              `}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{mod.icon}</span>
                <span className={`
                  text-[10px] font-medium px-2 py-0.5 rounded-full
                  ${mod.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}
                `}>
                  {mod.status === 'active' ? 'Active' : 'Planned'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mt-2 text-sm">{mod.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mod.description}</p>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                <span className="bg-slate-50 px-1.5 py-0.5 rounded font-mono">{mod.code}</span>
                <span>Parts {mod.parts}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Preview + System Audit + Core Services CTAs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 1 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.preview: ON</span>
            </div>
            <h2 className="text-xl font-bold">Live Dashboard Preview</h2>
            <p className="text-sm text-amber-100 mt-1 max-w-lg">
              Click through 12 persona dashboards with device preview. All widgets show PREVIEW DATA with future API sources. 
              Stakeholder feedback captured directly.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('preview')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors shadow-sm"
              >
                <Eye size={16} />
                Open Preview
              </button>
              <span className="text-[10px] text-amber-200">17 widgets · 12 personas · 3 device sizes</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">👁️</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 2 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.audit</span>
            </div>
            <h2 className="text-xl font-bold">System Audit & Discovery</h2>
            <p className="text-sm text-violet-100 mt-1 max-w-lg">
              Complete technical inventory of the existing ERP. Module coverage, database entity map, API inventory, 
              dependency graph, gap matrix for Parts 3–126, risk register, and control inventory.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('audit')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-violet-700 rounded-lg text-sm font-semibold hover:bg-violet-50 transition-colors shadow-sm"
              >
                <Search size={16} />
                View Audit
              </button>
              <span className="text-[10px] text-violet-200">16 modules · 25 entities · 12 risks</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🔍</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 3 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.core</span>
            </div>
            <h2 className="text-xl font-bold">Core Services Foundation</h2>
            <p className="text-sm text-cyan-100 mt-1 max-w-lg">
              Shared service layer: auth, audit, events, numbering, jobs, transactions. 
              14 services wrapping existing implementations with unified hooks.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('core')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-cyan-700 rounded-lg text-sm font-semibold hover:bg-cyan-50 transition-colors shadow-sm"
              >
                <Activity size={16} />
                View Services
              </button>
              <span className="text-[10px] text-cyan-200">14 services · 7 hooks · 5 number series</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">⚙️</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 4 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.org</span>
            </div>
            <h2 className="text-xl font-bold">Organization & Projects</h2>
            <p className="text-sm text-emerald-100 mt-1 max-w-lg">
              Enterprise hierarchy: Company → Project → Site with geofences and allocations. 
              Full lifecycle management with protocol controls.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('org')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
              >
                <Building2 size={16} />
                View Organization
              </button>
              <span className="text-[10px] text-emerald-200">4 projects · 4 sites · 5 allocations</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🏢</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 5 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.iam</span>
            </div>
            <h2 className="text-xl font-bold">User, Role & Permission Architecture</h2>
            <p className="text-sm text-indigo-100 mt-1 max-w-lg">
              Enterprise RBAC with scoped grants, field-level masking, and SoD rules. 
              13 system roles, 15 permissions, shadow mode active.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('iam')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <Key size={16} />
                View Permissions
              </button>
              <span className="text-[10px] text-indigo-200">13 roles · 15 permissions · 4 SoD rules</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🔐</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 6 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.wf</span>
            </div>
            <h2 className="text-xl font-bold">Workflow & Approval Engine</h2>
            <p className="text-sm text-purple-100 mt-1 max-w-lg">
              Configurable workflow engine for all document types with multi-level routing, 
              delegation, SLA tracking, and parallel approvals.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('wf')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors shadow-sm"
              >
                <Activity size={16} />
                View Workflows
              </button>
              <span className="text-[10px] text-purple-200">5 definitions · 6 instances · 4 protocol controls</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">⚡</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 7 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.protocol</span>
            </div>
            <h2 className="text-xl font-bold">Protocol & Control Engine</h2>
            <p className="text-sm text-violet-100 mt-1 max-w-lg">
              Governance framework with control points, exceptions, violations, and escalation. 
              PLAN → VERIFY → APPROVE → EXECUTE → RECORD → MONITOR → RECONCILE → CLOSE.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('protocol-engine')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-violet-700 rounded-lg text-sm font-semibold hover:bg-violet-50 transition-colors shadow-sm"
              >
                <Shield size={16} />
                View Protocol Engine
              </button>
              <span className="text-[10px] text-violet-200">14 control points · 3 exceptions · 3 violations</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🛡️</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 8 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.audit_sec</span>
            </div>
            <h2 className="text-xl font-bold">Audit, Security & Governance</h2>
            <p className="text-sm text-slate-200 mt-1 max-w-lg">
              Tamper-evident audit engine with hash chain verification, session management, 
              security event detection, and comprehensive audit trails.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('audit-sec')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors shadow-sm"
              >
                <FileText size={16} />
                View Audit & Security
              </button>
              <span className="text-[10px] text-slate-300">45,678 audit records · 4 active sessions · 5 security events</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🔒</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 9 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.secbase</span>
            </div>
            <h2 className="text-xl font-bold">Secure-by-Design Foundation</h2>
            <p className="text-sm text-red-100 mt-1 max-w-lg">
              Zero-trust pipeline, CI/CD security gates, route registry, secrets management, 
              and secure SDLC. Every request authenticated, authorized, validated, executed, and audited.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('security')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
              >
                <Shield size={16} />
                View Security Foundation
              </button>
              <span className="text-[10px] text-red-200">6 routes · 5 dependencies · 3 risk acceptances · 5 findings</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🛡️</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 10 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.acc</span>
            </div>
            <h2 className="text-xl font-bold">Accountability & Responsibility</h2>
            <p className="text-sm text-teal-100 mt-1 max-w-lg">
              RACI assignments, action ledger, and compliance tracking. Complete accountability 
              for every transaction with protocol controls and compliance scoring.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('acc')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-teal-700 rounded-lg text-sm font-semibold hover:bg-teal-50 transition-colors shadow-sm"
              >
                <Users size={16} />
                View Accountability
              </button>
              <span className="text-[10px] text-teal-200">5 RACI assignments · 7 ledger entries · 6 responsibilities</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">👥</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 11 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.mdm</span>
            </div>
            <h2 className="text-xl font-bold">Master Data Governance</h2>
            <p className="text-sm text-cyan-100 mt-1 max-w-lg">
              Centralized master data management with maker-checker workflows, duplicate prevention, 
              and comprehensive data quality tracking for materials, vendors, and more.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('mdm')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-cyan-700 rounded-lg text-sm font-semibold hover:bg-cyan-50 transition-colors shadow-sm"
              >
                <Database size={16} />
                View Master Data
              </button>
              <span className="text-[10px] text-cyan-200">5 materials · 4 vendors · 4 change requests · 4 DQ issues</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">📦</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 12 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.xls</span>
            </div>
            <h2 className="text-xl font-bold">Excel Data Exchange Engine</h2>
            <p className="text-sm text-blue-100 mt-1 max-w-lg">
              Controlled import/export with governed templates, multi-stage validation, approval workflows, 
              and comprehensive error handling. Excel as a controlled exchange mechanism.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('xls')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm"
              >
                <FileText size={16} />
                View Excel Exchange
              </button>
              <span className="text-[10px] text-blue-200">5 templates · 5 imports · 3 exports · 7 protocol controls</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">📊</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 13 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.ds</span>
            </div>
            <h2 className="text-xl font-bold">Design System & UI Framework</h2>
            <p className="text-sm text-purple-100 mt-1 max-w-lg">
              Unified enterprise design language with tokens, components, page templates, and accessibility. 
              SAP-inspired workspace patterns with light/dark themes.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('design-system')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors shadow-sm"
              >
                <Settings size={16} />
                View Style Guide
              </button>
              <span className="text-[10px] text-purple-200">12 components · 4 templates · WCAG 2.1 AA</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🎨</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 14 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.dash</span>
            </div>
            <h2 className="text-xl font-bold">Dashboard Framework</h2>
            <p className="text-sm text-emerald-100 mt-1 max-w-lg">
              Advanced responsive dashboard with widget framework, KPI registry, personalization, 
              and drill-down capabilities. Role-based layouts with protocol widgets.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
              >
                <LayoutDashboard size={16} />
                View Dashboard
              </button>
              <span className="text-[10px] text-emerald-200">12 widgets · 6 KPIs · 3 role layouts · CP-DASH-01</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">📊</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 15 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.rsp</span>
            </div>
            <h2 className="text-xl font-bold">Responsive Shell</h2>
            <p className="text-sm text-pink-100 mt-1 max-w-lg">
              Mobile + Tablet + Desktop experience with PWA support, device capabilities (camera, GPS, QR), 
              and role-based navigation. Installable app with offline-ready foundation.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('responsive')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-pink-700 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors shadow-sm"
              >
                <Smartphone size={16} />
                View Responsive Shell
              </button>
              <span className="text-[10px] text-pink-200">3 shells · 6 capabilities · PWA ready · CP-RSP-01</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">📱</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 16 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.dex</span>
            </div>
            <h2 className="text-xl font-bold">Advanced Data-Entry Framework</h2>
            <p className="text-sm text-orange-100 mt-1 max-w-lg">
              Smart forms with context auto-fill, drafts, duplicate detection, and bulk editing. 
              Enter once, validate, link, reuse, calculate, and report.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('data-entry')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-orange-700 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors shadow-sm"
              >
                <Edit size={16} />
                View Data Entry
              </button>
              <span className="text-[10px] text-orange-200">6 forms · 3 drafts · 6 duplicate rules · 4 protocol controls</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">📝</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Part 17 · New</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">ff.search</span>
            </div>
            <h2 className="text-xl font-bold">Global Search & Command Center</h2>
            <p className="text-sm text-indigo-100 mt-1 max-w-lg">
              Permission-safe universal search with command palette (⌘K), recent records, favourites, 
              and context-aware actions across all modules.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={() => onNavigate('search')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <Search size={16} />
                Open Search
              </button>
              <span className="text-[10px] text-indigo-200">10 documents · 8 actions · 4 synonyms · CP-SRCH-01</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-6xl opacity-50">🔍</div>
          </div>
        </div>
      </motion.div>
      </div>

      {/* Bottom Row: Activity + Navigation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Recent Activity</h3>
          </div>
          <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className={`
                  w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                  ${item.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}
                `}></span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{item.event}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.time} today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => onNavigate('baseline')} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Database size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-slate-900">System Baseline</h4>
                <p className="text-xs text-slate-500">Schema, data & report snapshots</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>

          <button onClick={() => onNavigate('flags')} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 transition-colors">
                <Flag size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-slate-900">Feature Flags</h4>
                <p className="text-xs text-slate-500">Module toggles & rollout control</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>

          <button onClick={() => onNavigate('protocol')} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 rounded-lg text-violet-600 group-hover:bg-violet-100 transition-colors">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-slate-900">Protocol Controls</h4>
                <p className="text-xs text-slate-500">PLAN → CLOSE governance cycle</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>

          <button onClick={() => onNavigate('regression')} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
                <TestTube size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-slate-900">Regression Tests</h4>
                <p className="text-xs text-slate-500">Golden tests & integrity checks</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>

          <button onClick={() => onNavigate('docs')} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-100 transition-colors">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-slate-900">Documentation</h4>
                <p className="text-xs text-slate-500">Architecture, rules & baselines</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>

          <button onClick={() => onNavigate('acceptance')} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-slate-900">Acceptance Gate</h4>
                <p className="text-xs text-slate-500">Definition of Done checklist</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
