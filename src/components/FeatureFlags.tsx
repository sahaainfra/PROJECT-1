import { useState } from 'react';
import { motion } from 'framer-motion';
import { featureFlags } from '../data/mockData';
import { Flag, ToggleLeft, ToggleRight, Info, Globe, Users, User } from 'lucide-react';

export function FeatureFlags() {
  const [flags, setFlags] = useState(featureFlags);
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  const filteredFlags = flags.filter(f => {
    if (filter === 'enabled') return f.enabled;
    if (filter === 'disabled') return !f.enabled;
    return true;
  });

  const toggleFlag = (key: string) => {
    setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'global': return <Globe size={12} />;
      case 'company': return <Users size={12} />;
      case 'user': return <User size={12} />;
      default: return <Globe size={12} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Feature Flags</h1>
          <p className="text-sm text-slate-500 mt-1">
            Module toggles and rollout control — evaluated per company/project/role/user
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {flags.filter(f => f.enabled).length} of {flags.length} enabled
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {(['all', 'enabled', 'disabled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === f 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Flags List */}
      <div className="space-y-3">
        {filteredFlags.map((flag, i) => (
          <motion.div
            key={flag.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 flex items-center gap-4">
              {/* Toggle */}
              <button
                onClick={() => toggleFlag(flag.key)}
                className="flex-shrink-0"
              >
                {flag.enabled ? (
                  <ToggleRight size={32} className="text-blue-600" />
                ) : (
                  <ToggleLeft size={32} className="text-slate-300" />
                )}
              </button>

              {/* Flag Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-semibold text-slate-900">{flag.key}</code>
                  <span className={`
                    text-[10px] font-medium px-1.5 py-0.5 rounded
                    ${flag.enabled ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}
                  `}>
                    {flag.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{flag.description}</p>
              </div>

              {/* Meta */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  {getScopeIcon(flag.scope)}
                  <span className="capitalize">{flag.scope}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info size={12} />
                  <span>{flag.owner}</span>
                </div>
              </div>

              {/* Rollout Bar */}
              <div className="hidden md:block w-24">
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Rollout</span>
                  <span>{flag.rolloutPercent}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${flag.enabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                    style={{ width: `${flag.rolloutPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Usage Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Flag size={18} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Feature Flag Usage</h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Flags are evaluated server-side via <code className="bg-blue-100 px-1 rounded">isEnabled(flagKey, context)</code> and mirrored client-side. 
              Context includes company, project, role, and user. Admin toggle UI is deferred to Part 110.
              All flag evaluations are audited in the central audit trail.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <code className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                server: isEnabled('ff.pgm', {'{'} company, project, role, user {'}'})
              </code>
              <code className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                client: useFeatureFlag('ff.pgm')
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
