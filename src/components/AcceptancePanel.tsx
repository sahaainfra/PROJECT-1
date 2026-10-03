import { motion } from 'framer-motion';
import { acceptanceCriteria } from '../data/mockData';
import { CheckCircle2, Shield, Award, FileCheck } from 'lucide-react';

export function AcceptancePanel() {
  const allPassed = acceptanceCriteria.every(c => c.status === 'pass');
  const passCount = acceptanceCriteria.filter(c => c.status === 'pass').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Acceptance Gate</h1>
          <p className="text-sm text-slate-500 mt-1">
            Definition of Done checklist — Part 0 must pass all criteria before proceeding
          </p>
        </div>
        {allPassed && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
            <Award size={20} className="text-green-600" />
            <span className="text-sm font-semibold text-green-700">All Criteria Met</span>
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Acceptance Progress</h3>
          <span className="text-2xl font-bold text-slate-900">{passCount}/{acceptanceCriteria.length}</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(passCount / acceptanceCriteria.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${allPassed ? 'bg-green-500' : 'bg-blue-500'}`}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-slate-400">
          <span>0%</span>
          <span>{Math.round((passCount / acceptanceCriteria.length) * 100)}% Complete</span>
          <span>100%</span>
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-2">
        {acceptanceCriteria.map((criterion, i) => (
          <motion.div
            key={criterion.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`
              bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4
              ${criterion.status === 'pass' ? 'border-green-200' : 'border-slate-200'}
            `}
          >
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${criterion.status === 'pass' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}
            `}>
              {criterion.status === 'pass' ? <CheckCircle2 size={18} /> : <FileCheck size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="text-[10px] font-mono font-semibold text-slate-400">{criterion.id}</code>
                <span className={`
                  text-[10px] font-medium px-1.5 py-0.5 rounded
                  ${criterion.status === 'pass' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}
                `}>
                  {criterion.status === 'pass' ? 'PASS' : 'PENDING'}
                </span>
              </div>
              <p className="text-sm text-slate-700 mt-1">{criterion.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Gate */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-indigo-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Security Acceptance Gate (SEC-28)</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              The following security tests must pass before the baseline can be accepted:
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Functional tests',
                'Security tests',
                'Authorisation tests',
                'Integration tests',
                'Regression tests',
                'Performance tests',
                'Backup/recovery tests',
                'Code review',
                'Dependency review',
              ].map((test, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                  <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                  {test}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sign-off */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Baseline Sign-off</h4>
            <p className="text-xs text-slate-400 mt-1">
              Part 0 Definition of Done — verified and signed by technical lead
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                TL
              </div>
              <div>
                <p className="text-xs font-medium">Technical Lead</p>
                <p className="text-[10px] text-slate-400">2026-01-15 08:30 UTC</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            DECISIONS.md updated
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            CHANGELOG.md updated
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            Backup verified
          </div>
        </div>
      </div>
    </div>
  );
}
