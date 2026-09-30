import { motion } from 'framer-motion';
import { modules, baselineMetrics, regressionResults } from '../data/mockData';
import { 
  Database, Shield, Flag, TestTube, BookOpen, CheckCircle2,
  TrendingUp, Clock, AlertCircle, ArrowRight
} from 'lucide-react';

type View = 'launchpad' | 'baseline' | 'flags' | 'protocol' | 'regression' | 'docs' | 'acceptance';

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
