import { motion } from 'framer-motion';
import { baselineMetrics, tableBaselines, systemInfo } from '../data/mockData';
import { Database, CheckCircle2, Hash, Shield, Clock, Server, FileText } from 'lucide-react';

export function BaselineOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Baseline</h1>
          <p className="text-sm text-slate-500 mt-1">
            Verified snapshot of the current system — schema, data, and report outputs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
            <CheckCircle2 size={14} />
            Verified
          </span>
        </div>
      </div>

      {/* System Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Baseline Information</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tag</p>
            <p className="text-sm font-mono font-medium text-slate-900 mt-0.5">{systemInfo.baselineTag}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Git Commit</p>
            <p className="text-sm font-mono font-medium text-slate-900 mt-0.5">{systemInfo.gitCommit}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Captured At</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{new Date(systemInfo.capturedAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Captured By</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{systemInfo.capturedBy}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Database</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{systemInfo.database}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Environment</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5 capitalize">{systemInfo.environment}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Node.js</p>
            <p className="text-sm font-mono font-medium text-slate-900 mt-0.5">{systemInfo.nodeVersion}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Schema Hash</p>
            <p className="text-sm font-mono font-medium text-slate-900 mt-0.5 truncate">{baselineMetrics.schemaHash}</p>
          </div>
        </div>
      </div>

      {/* Schema Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Tables', value: baselineMetrics.tables, icon: <Database size={16} />, color: 'blue' },
          { label: 'Views', value: baselineMetrics.views, icon: <FileText size={16} />, color: 'violet' },
          { label: 'Functions', value: baselineMetrics.functions, icon: <Server size={16} />, color: 'emerald' },
          { label: 'Triggers', value: baselineMetrics.triggers, icon: <Clock size={16} />, color: 'amber' },
          { label: 'Indexes', value: baselineMetrics.indexes, icon: <Hash size={16} />, color: 'rose' },
          { label: 'Total Rows', value: baselineMetrics.totalRows.toLocaleString(), icon: <Shield size={16} />, color: 'cyan' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm"
          >
            <div className={`inline-flex p-1.5 rounded-md bg-${metric.color}-50 text-${metric.color}-600`}>
              {metric.icon}
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2">{metric.value}</p>
            <p className="text-[10px] text-slate-500">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Data Integrity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">Data Integrity Check</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Last run: {new Date(baselineMetrics.lastCheck).toLocaleString()}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              {baselineMetrics.dataIntegrity}% Match
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Table</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Rows</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Checksum</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableBaselines.map((table, i) => (
                <motion.tr
                  key={table.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-700">{table.name}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs text-slate-600">{table.rows.toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-mono text-[10px] text-slate-400">{table.checksum}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-medium">
                      <CheckCircle2 size={10} />
                      {table.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Baseline Files */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Baseline Artifacts</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'schema_baseline.sql', size: '2.4 MB', desc: 'Full DDL export' },
            { name: 'schema_baseline.json', size: '890 KB', desc: 'Machine-readable schema' },
            { name: 'data_baseline.csv', size: '156 KB', desc: 'Row counts & checksums' },
            { name: 'protocol_baseline.md', size: '12 KB', desc: 'Existing workflow coverage' },
            { name: 'BASELINE_REPORT.md', size: '8 KB', desc: 'Stack summary & metrics' },
            { name: 'db_integrity_check.js', size: '4 KB', desc: 'Integrity verification script' },
          ].map((file) => (
            <div key={file.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <FileText size={16} className="text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-900 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400">{file.size} · {file.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
