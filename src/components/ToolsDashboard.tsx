// Part 36 — Tool & Small-Asset Tracking Dashboard
import { 
  Package, Shield, AlertTriangle, CheckCircle2, XCircle, TrendingUp, TrendingDown, 
  Clipboard, Calendar, Loader2, Sun, Moon, RefreshCw, 
  Mail, Phone, MapPin, Users, Settings, Printer, 
  Menu, ChevronRight, LogOut, ShieldMinus,
  Folder, Eye, Search as SearchIcon, Wrench, LayoutDashboard, ClipboardList
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { systemInfo } from '../data/mockData';
import { featureFlags } from '../data/mockData';
import { toolItems, toolCustodyTxns, toolLossRecoveries, toolCustodyVerifications } from '../data/toolsData';
import { toolPermissionKeys, toolControlPoints, toolControlResults, toolEvents, toolNotifications } from '../data/toolsData';
import { toolUtilisation, IDLE_THRESHOLD_DAYS } from '../data/toolsData';
import { StatusBadge } from './widgets/WidgetShell';

interface ToolDashboardProps {
  persona: string;
  onFeedback?: (widgetCode: string) => void;
}

const TOOL_STATUSES = ['in_store', 'issued', 'in_transit', 'under_repair', 'lost', 'disposed'];

function getStatusColor(status: string): string {
  if (status === 'blocked') return 'red';
  if (status === 'warning') return 'amber';
  return 'green';
}

function useToolFeatureFlag(key: string): boolean {
  const flag = featureFlags.find(f => f.key === key);
  return flag ? flag.enabled : false;
}

function computeToolsStats() {
  const total = toolItems.filter(t => !t.isDeleted).length;
  const inStore = toolItems.filter(t => t.currentStatus === 'in_store').length;
  const issued = toolItems.filter(t => t.currentStatus === 'issued').length;
  const inTransit = toolItems.filter(t => t.currentStatus === 'in_transit').length;
  const underRepair = toolItems.filter(t => t.currentStatus === 'under_repair').length;
  const lost = toolItems.filter(t => t.currentStatus === 'lost').length;
  const disposed = toolItems.filter(t => t.currentStatus === 'disposed').length;

  const overdueReturns = toolItems.filter(t =>
    t.currentStatus === 'issued' &&
    t.expectedReturnDate !== null &&
    t.expectedReturnDate < '2026-01-15'
  ).length;

  const calibrationDue = toolItems.filter(t =>
    t.calibrationRequired &&
    t.calibrationDueDate !== null &&
    t.calibrationDueDate <= '2026-01-15'
  ).length;

  const openLosses = toolLossRecoveries.filter(l => l.status !== 'CLOSED').length;
  const recoveryApprovedAmount = toolLossRecoveries
    .filter(l => l.status === 'RECOVERY_APPROVED')
    .reduce((s, l) => s + l.amount, 0);

  const verificationPending = toolCustodyVerifications.filter(v => v.status === 'PENDING' || v.status === 'OVERDUE').length;

  return {
    total, inStore, issued, inTransit, underRepair, lost, disposed,
    overdueReturns, calibrationDue, openLosses, recoveryApprovedAmount, verificationPending,
  };
}

function getStatusLabel(status: string): string {
  if (status === 'blocked') return 'BLOCK';
  if (status === 'warning') return 'WARN';
  return 'PASS';
}

export function ToolsDashboard({ persona, onFeedback }: ToolDashboardProps) {
  const [ffTools, setFfTools] = useState(false);
  const [ffToolsRegister, setFfToolsRegister] = useState(false);
  const [ffToolsCustody, setFfToolsCustody] = useState(false);
  const [ffToolsLossRecovery, setFfToolsLossRecovery] = useState(false);

  useEffect(() => {
    setFfTools(useToolFeatureFlag('ff.tools'));
    setFfToolsRegister(useToolFeatureFlag('ff.tools.register'));
    setFfToolsCustody(useToolFeatureFlag('ff.tools.custody'));
    setFfToolsLossRecovery(useToolFeatureFlag('ff.tools.loss_recovery'));
  }, []);

  const stats = computeToolsStats();

  if (!ffTools) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="text-center py-12">
          <Shield size={48} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Tool & Small-Asset Tracking</h2>
          <p className="text-slate-500 mt-2">Feature flag ff.tools is disabled</p>
          <p className="text-slate-500 mt-4">Enable ff.tools from the feature flags panel to access tool tracking functionality.</p>
          <button 
            onClick={() => onFeedback?.('ff.tools')}
            className="mt-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
          >
            Navigate to Feature Flags
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded border border-slate-200 mb-6">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tool & Small-Asset Tracking</h1>
              <p className="text-sm text-slate-500">Part 36 of 126</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium {ffTools ? 'text-green-700' : 'text-red-700'}">
                {ffTools ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded border border-slate-200 p-4">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">In Store</span>
              <span className="text-2xl font-bold text-slate-900">{stats.inStore}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Issued</span>
              <span className="text-2xl font-bold text-slate-900">{stats.issued}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">In Transit</span>
              <span className="text-2xl font-bold text-slate-900">{stats.inTransit}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Under Repair</span>
              <span className="text-2xl font-bold text-slate-900">{stats.underRepair}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Lost</span>
              <span className="text-2xl font-bold text-slate-900">{stats.lost}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Disposed</span>
              <span className="text-2xl font-bold text-slate-900">{stats.disposed}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 mb-6">
        <div className="px-4 py-3">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Protocol Controls</h2>
          <div className="grid grid-cols-3 gap-2">
            {toolControlPoints.map((cp, i) => {
              const result = toolControlResults[cp.id] || 'PASS';
              const status = getStatusLabel(result);
              const color = getStatusColor(result);
              return (
                <div key={i} className="p-2 rounded border border-slate-200 text-[8px] font-medium">
                  <span className="block text-slate-900"> {cp.id}</span>
                  <span className={`mt-1 text-${color}-700 font-medium`}>{result}</span>
                  <span className="text-[8px] text-slate-500 ml-1">{cp.stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 mb-6">
        <div className="px-4 py-3">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Tool Inventory Summary</h2>
          <div className="grid grid-cols-1 gap-3">
            {TOOL_STATUSES.map(status => {
              const toolsOfStatus = toolItems.filter(t => t.currentStatus === status && !t.isDeleted);
              if (toolsOfStatus.length === 0) return null;
              return (
                <div key={status} className="p-3 rounded border border-slate-200">
                  <span className="text-[10px] font-medium text-slate-700">{status}: {toolsOfStatus.length}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 mb-6">
        <div className="px-4 py-3">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Custody Ledger</h2>
          <div className="text-sm">
            <p>{toolCustodyTxns.length} custody transactions recorded</p>
            <p>{toolLossRecoveries.length} loss recoveries recorded</p>
            <p>{toolCustodyVerifications.length} custody verifications recorded</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 mb-6">
        <div className="px-4 py-3">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Losses & Recoveries</h2>
          <div className="text-sm">
            <p>{stats.openLosses} open losses</p>
            <p>₹{stats.recoveryApprovedAmount.toLocaleString()} approved recovery</p>
            <p>{stats.verificationPending} verification(s) pending</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Notifications</h3>
          <div className="space-y-2">
            {toolNotifications.map((notif, i) => (
              <div key={i} className="p-2 border border-slate-200 text-[9px]">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                <p className="text-[9px] text-slate-900 mt-0.5">{notif.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Alert Summary</h3>
          <div className="space-y-2">
            <div>
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[9px] font-medium text-slate-900">{stats.openLosses} open losses</span>
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[9px] text-slate-900">{stats.overdueReturns} overdue returns</span>
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[9px] text-slate-900">{stats.verificationPending} verification(s) pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 mt-6">
        <div className="px-4 py-3">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { code: 'request-exception', label: 'Request Exception', icon: '⚠️', color: 'red' }
            ].map((action, i) => {
              const showAction = ffTools ? action.code === 'request-exception' : false;
              if (showAction) {
                return (
                  <button key={i} className="flex-1 rounded border px-3 py-2 text-[9px] font-medium transition-colors bg-red-50 text-red-700 border-red-200">
                    <span className="mr-1">{action.icon}</span>
                    {action.label}
                  </button>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsDashboard;