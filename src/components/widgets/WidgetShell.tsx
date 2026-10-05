import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, ExternalLink, MessageSquare, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WidgetMeta, WidgetStatus, DataMode, KPIDefinition } from '../../data/previewData';
import { kpiCatalogue } from '../../data/previewData';

interface WidgetShellProps {
  meta: WidgetMeta;
  children: React.ReactNode;
  onFeedback?: (widgetCode: string) => void;
}

export function WidgetShell({ meta, children, onFeedback }: WidgetShellProps) {
  const [showKPI, setShowKPI] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const statusColors: Record<WidgetStatus, string> = {
    'PREVIEW': 'bg-amber-100 text-amber-800 border-amber-200',
    'LIVE': 'bg-blue-100 text-blue-800 border-blue-200',
    'PROMOTED': 'bg-green-100 text-green-800 border-green-200',
    'RETIRED': 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const dataModeColors: Record<DataMode, string> = {
    'fixture': 'bg-orange-50 text-orange-700',
    'live': 'bg-green-50 text-green-700',
  };

  const kpis: KPIDefinition[] = kpiCatalogue.filter((k: KPIDefinition) => meta.kpiCodes.includes(k.code));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Widget Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{meta.title}</h3>
          {/* PREVIEW DATA Badge */}
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColors[meta.status]}`}>
            {meta.dataMode === 'fixture' ? '📋 PREVIEW DATA' : '🟢 LIVE'}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {meta.kpiCodes.length > 0 && (
            <button 
              onClick={() => setShowKPI(!showKPI)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
              title="View KPI formula"
            >
              <Info size={14} />
            </button>
          )}
          <button 
            onClick={() => onFeedback?.(meta.code)}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
            title="Give feedback"
          >
            <MessageSquare size={14} />
          </button>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
            title="Widget info"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Widget Body */}
      <div className="p-4">
        {children}
      </div>

      {/* KPI Formula Popover */}
      {showKPI && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-slate-900 text-white p-3 rounded-b-xl z-10 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">KPI Formula</span>
            <button onClick={() => setShowKPI(false)} className="text-slate-400 hover:text-white">
              <X size={12} />
            </button>
          </div>
          {kpis.map(kpi => (
            <div key={kpi.code} className="mb-2 last:mb-0">
              <div className="flex items-center gap-2 text-xs">
                <code className="text-blue-300 font-mono">{kpi.code}</code>
                <span className="text-slate-300">{kpi.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{kpi.formula}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Target: {kpi.target} · Owner: {kpi.ownerPrompt}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Widget Info Popover */}
      {showInfo && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-blue-50 border-t border-blue-100 text-[10px] text-blue-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Source:</span> {meta.futureSourcePrompt} · <code className="font-mono">{meta.futureApi}</code>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-blue-400 hover:text-blue-600">
              <X size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// KPI Stat Card
interface KPIStatProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  color?: string;
  target?: string;
}

export function KPIStat({ label, value, unit, trend, trendValue, color = 'blue', target }: KPIStatProps) {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    flat: 'text-slate-500 bg-slate-50',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      <div className="flex items-center gap-2 mt-2">
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${trendColors[trend]}`}>
            <TrendIcon size={10} />
            {trendValue}
          </span>
        )}
        {target && <span className="text-[10px] text-slate-400">Target: {target}</span>}
      </div>
    </div>
  );
}

// Status Badge
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    'approved': 'bg-green-50 text-green-700 border-green-200',
    'completed': 'bg-green-50 text-green-700 border-green-200',
    'pass': 'bg-green-50 text-green-700 border-green-200',
    'healthy': 'bg-green-50 text-green-700 border-green-200',
    'active': 'bg-blue-50 text-blue-700 border-blue-200',
    'in_progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'upcoming': 'bg-slate-50 text-slate-600 border-slate-200',
    'overdue': 'bg-red-50 text-red-700 border-red-200',
    'critical': 'bg-red-50 text-red-700 border-red-200',
    'high': 'bg-red-50 text-red-700 border-red-200',
    'medium': 'bg-amber-50 text-amber-700 border-amber-200',
    'low': 'bg-blue-50 text-blue-700 border-blue-200',
    'idle': 'bg-slate-50 text-slate-600 border-slate-200',
    'maintenance': 'bg-orange-50 text-orange-700 border-orange-200',
    'degraded': 'bg-amber-50 text-amber-700 border-amber-200',
    'fail': 'bg-red-50 text-red-700 border-red-200',
    'processed': 'bg-green-50 text-green-700 border-green-200',
    'accepted': 'bg-green-50 text-green-700 border-green-200',
    'change_requested': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const colorClass = colors[status.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200';
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center font-medium rounded border ${colorClass} ${sizeClass}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

// Notification Level Badge
export function NotificationLevel({ level }: { level: string }) {
  const colors: Record<string, string> = {
    'critical': 'bg-red-500',
    'warning': 'bg-amber-500',
    'action': 'bg-blue-500',
    'info': 'bg-slate-400',
    'escalation': 'bg-purple-500',
  };

  return (
    <span className={`w-2 h-2 rounded-full ${colors[level] || 'bg-slate-400'}`}></span>
  );
}

// Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, max = 100, color = 'blue', showLabel = true, size = 'sm' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${height} bg-slate-100 rounded-full overflow-hidden`}>
        <div 
          className={`h-full rounded-full bg-${color}-500 transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showLabel && <span className="text-[10px] text-slate-500 font-medium w-8 text-right">{Math.round(percentage)}%</span>}
    </div>
  );
}

// Gate Status Card
interface GateStatusProps {
  gate?: string;
  status?: string;
  checkedBy?: string;
  protocolModes?: string[];
  protocolResults?: string[];
  cpLabels?: string[];
}

export function GateStatusCard({ gate, status, checkedBy }: GateStatusProps) {
  return (
    <div className={`p-3 rounded-lg border ${
      status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status === 'approved' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
        <span className="text-xs font-medium text-slate-900 truncate flex-1">{gate}</span>
      </div>
      <p className="text-[10px] text-slate-500 mt-1">{checkedBy}</p>
    </div>
  );
}

// Preview Banner
export function PreviewBanner() {
  return (
    <div className="bg-amber-500 text-white px-3 py-1 text-center text-[10px] font-bold tracking-wider flex items-center justify-center gap-2">
      <AlertTriangle size={10} />
      PREVIEW ENVIRONMENT — SYNTHETIC DATA — NOT PRODUCTION
      <AlertTriangle size={10} />
    </div>
  );
}
