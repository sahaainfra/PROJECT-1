import { motion } from 'framer-motion';
import { regressionResults } from '../data/mockData';
import { CheckCircle2, XCircle, Clock, TestTube, BarChart3, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function RegressionTests() {
  const chartData = regressionResults.suites.map(s => ({
    name: s.name.replace('Golden Tests - ', '').replace('Report ', 'Rpt ').replace('Schema ', 'Sch ').replace('Feature ', 'FF '),
    passed: s.passed,
    total: s.tests,
    status: s.status,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Regression Tests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Golden tests, DB integrity checks, and report comparison — run via <code className="bg-slate-100 px-1 rounded text-xs">npm run erp:regression</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border
            ${regressionResults.status === 'passing' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'}
          `}>
            {regressionResults.status === 'passing' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {regressionResults.status === 'passing' ? 'All Passing' : 'Failures Detected'}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Tests', value: regressionResults.totalTests, icon: <TestTube size={16} />, color: 'blue' },
          { label: 'Passed', value: regressionResults.passed, icon: <CheckCircle2 size={16} />, color: 'green' },
          { label: 'Failed', value: regressionResults.failed, icon: <XCircle size={16} />, color: 'red' },
          { label: 'Skipped', value: regressionResults.skipped, icon: <Clock size={16} />, color: 'amber' },
          { label: 'Duration', value: regressionResults.duration, icon: <BarChart3 size={16} />, color: 'violet' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <div className={`inline-flex p-1.5 rounded-md bg-${stat.color}-50 text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-[10px] text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Test Suite Results</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(value: number) => [value, 'Tests']}
              />
              <Bar dataKey="passed" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.status === 'pass' ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Test Suites Detail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">Test Suites</h3>
          <span className="text-[10px] text-slate-400">
            Last run: {new Date(regressionResults.lastRun).toLocaleString()}
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {regressionResults.suites.map((suite, i) => (
            <motion.div
              key={suite.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${suite.status === 'pass' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
              `}>
                {suite.status === 'pass' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{suite.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-32">
                    <div 
                      className={`h-full rounded-full ${suite.status === 'pass' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${(suite.passed / suite.tests) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400">{suite.passed}/{suite.tests}</span>
                </div>
              </div>
              <span className={`
                text-[10px] font-medium px-2 py-0.5 rounded
                ${suite.status === 'pass' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
              `}>
                {suite.status === 'pass' ? 'PASS' : 'FAIL'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CI Integration */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-slate-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-slate-900">CI Integration</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              The regression harness is wired into the CI pipeline. It runs on every merge request to the program branch and includes:
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={10} className="text-green-500" />
                Existing test suite + golden tests
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={10} className="text-green-500" />
                DB integrity check (schema + data checksums)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={10} className="text-green-500" />
                Report output comparison (byte + semantic)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={10} className="text-green-500" />
                Evidence stored in <code className="bg-slate-200 px-1 rounded">docs/erp-program/test-evidence/&lt;prompt&gt;/</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
