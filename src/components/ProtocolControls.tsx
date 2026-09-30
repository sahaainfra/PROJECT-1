import { motion } from 'framer-motion';
import { protocolControls, protocolStages } from '../data/mockData';
import { Shield, AlertTriangle, CheckCircle2, Lock, ArrowRight, Eye } from 'lucide-react';

export function ProtocolControls() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Protocol Controls</h1>
        <p className="text-sm text-slate-500 mt-1">
          PLAN → AUTHORIZE → EXECUTE → RECORD → VERIFY → ANALYZE → CONTROL → CLOSE
        </p>
      </div>

      {/* Protocol Cycle Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Eight-Stage Protocol Cycle</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {protocolStages.map((stage, i) => (
            <div key={stage.stage} className="flex items-center flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center"
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-lg
                  ${i < 3 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-slate-50 border border-slate-200'}
                `}>
                  {stage.icon}
                </div>
                <span className="text-[9px] font-semibold text-slate-700 mt-1.5 text-center whitespace-nowrap">
                  {stage.stage}
                </span>
              </motion.div>
              {i < protocolStages.length - 1 && (
                <ArrowRight size={14} className="text-slate-300 mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enforcement Mode Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <Eye size={20} className="text-amber-600" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-900">Current Mode: OBSERVE</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            Controls are registered and evaluated but do not block operations. Rollout path: OFF → OBSERVE → WARN → ENFORCE (PC-13)
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          {['OFF', 'OBSERVE', 'WARN', 'ENFORCE'].map((mode, i) => (
            <div key={mode} className="flex items-center">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold
                ${i === 1 ? 'bg-amber-500 text-white' : i < 1 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}
              `}>
                {i + 1}
              </div>
              {i < 3 && <div className={`w-4 h-0.5 ${i < 1 ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Control Points */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Registered Control Points</h3>
        {protocolControls.map((cp, i) => (
          <motion.div
            key={cp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-lg
                    ${cp.enforcement === 'BLOCK' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}
                  `}>
                    {cp.enforcement === 'BLOCK' ? <Lock size={18} /> : <AlertTriangle size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold text-slate-900">{cp.id}</code>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                        {cp.stage}
                      </span>
                      <span className={`
                        text-[10px] font-medium px-1.5 py-0.5 rounded
                        ${cp.mode === 'OBSERVE' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}
                      `}>
                        {cp.mode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{cp.control}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-[10px] text-green-600 font-medium">Active</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 pl-11">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Enforcement</p>
                  <p className="text-xs font-medium text-slate-700">{cp.enforcement}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Evidence</p>
                  <p className="text-xs font-medium text-slate-700">{cp.evidence}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Escalation</p>
                  <p className="text-xs font-medium text-slate-700">{cp.escalation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Protocol Engine Info */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-violet-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-violet-900">Protocol & Control Engine</h4>
            <p className="text-xs text-violet-700 mt-1 leading-relaxed">
              Services call <code className="bg-violet-100 px-1 rounded">protocol.check()</code> inside business transactions on every path 
              (UI, API, import, job, offline sync, AI draft). Deviations only through exceptions (PC-3) with thresholds (PC-4), 
              mandatory evidence (PC-5), maker-checker (PC-6), reason codes (PC-7), ledger (PC-8) and escalation (PC-9).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
