import { motion } from 'framer-motion';
import { WidgetShell, KPIStat, StatusBadge, ProgressBar, GateStatusCard } from './widgets/WidgetShell';
import { fixtureData, widgetRegistry, type Persona } from '../data/previewData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { Clock, CheckCircle2, AlertTriangle, Users, Package, Truck, Shield } from 'lucide-react';

interface DashboardProps {
  persona: Persona;
  onFeedback?: (widgetCode: string) => void;
}

const getWidgetMeta = (code: string) => widgetRegistry.find(w => w.code === code)!;

export function Dashboard({ persona, onFeedback }: DashboardProps) {
  switch (persona) {
    case 'management': return <CFODashboard onFeedback={onFeedback} />;
    case 'pm': return <PMDashboard onFeedback={onFeedback} />;
    case 'site_engineer': return <SiteEngineerDashboard onFeedback={onFeedback} />;
    case 'store_keeper': return <StoreKeeperDashboard onFeedback={onFeedback} />;
    case 'qs': return <QSDashboard onFeedback={onFeedback} />;
    case 'procurement': return <ProcurementDashboard onFeedback={onFeedback} />;
    case 'plant_manager': return <PlantDashboard onFeedback={onFeedback} />;
    case 'hr': return <HRDashboard onFeedback={onFeedback} />;
    case 'qa_qc': return <QADashboard onFeedback={onFeedback} />;
    case 'hse': return <HSEDashboard onFeedback={onFeedback} />;
    case 'protocol_officer': return <ProtocolDashboard onFeedback={onFeedback} />;
    case 'super_admin': return <AdminDashboard onFeedback={onFeedback} />;
    default: return <PMDashboard onFeedback={onFeedback} />;
  }
}

// Management / CFO Dashboard
function CFODashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.cfoSnapshot;
  const agingData = d.agingReceivables.map(a => ({ bucket: a.bucket, amount: Number(a.amount) / 100000 }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Cash Position" value={`₹${(d.cashPosition / 10000000).toFixed(1)}Cr`} trend="up" trendValue="+8.2%" target="Positive" />
        <KPIStat label="Receivables" value={`₹${(d.receivables / 10000000).toFixed(1)}Cr`} trend="down" trendValue="-3.1%" target="< 5% rev" />
        <KPIStat label="Payables" value={`₹${(d.payables / 10000000).toFixed(1)}Cr`} trend="flat" trendValue="0%" target="Within terms" />
        <KPIStat label="Project Margin" value={`${d.margin}%`} trend="up" trendValue="+1.2%" target="> 12%" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-cfo-snapshot')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Revenue vs Cost (YTD)</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.projects.map(p => ({ name: p.name.split(' ')[0], revenue: p.revenue / 10000000, cost: p.cost / 10000000 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Revenue (Cr)" />
                  <Bar dataKey="cost" fill="#94a3b8" radius={[2, 2, 0, 0]} name="Cost (Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Receivables Aging (₹ Lakhs)</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="amount" radius={[2, 2, 0, 0]}>
                    {agingData.map((_, i) => (
                      <Cell key={i} fill={['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#7f1d1d'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </WidgetShell>

      <WidgetShell meta={getWidgetMeta('w-my-approvals')} onFeedback={onFeedback}>
        <div className="space-y-2">
          {fixtureData.myApprovals.items.slice(0, 4).map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <StatusBadge status={item.priority} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate">{item.type} — {item.ref}</p>
                <p className="text-[10px] text-slate-500">{item.requester} · ₹{(Number(item.amount.replace(/[₹,]/g, '')) / 100000).toFixed(1)}L</p>
              </div>
              <span className="text-[10px] text-slate-400">{item.submitted}</span>
            </div>
          ))}
        </div>
      </WidgetShell>
    </div>
  );
}

// Project Manager Dashboard
function PMDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.project360;

  return (
    <div className="space-y-4">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-blue-200 uppercase tracking-wider">{d.project.code}</p>
            <h2 className="text-lg font-bold">{d.project.name}</h2>
            <p className="text-xs text-blue-200 mt-0.5">{d.project.client}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{d.project.progress}%</p>
            <p className="text-[10px] text-blue-200">Overall Progress</p>
          </div>
        </div>
        <div className="mt-3 h-2 bg-blue-800/50 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${d.project.progress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Schedule (SPI)" value={d.schedule.spi} trend={d.schedule.spi >= 1 ? 'up' : 'down'} trendValue={`${d.schedule.variance}%`} target="±5%" />
        <KPIStat label="Cost (CPI)" value={d.cost.cpi} trend={d.cost.cpi >= 1 ? 'up' : 'down'} trendValue={`${((d.cost.cpi - 1) * 100).toFixed(1)}%`} target="±3%" />
        <KPIStat label="Open Issues" value={d.openIssues} trend="down" trendValue="-2" target="0" />
        <KPIStat label="Labour On-site" value={d.labourCount} unit="workers" trend="flat" trendValue="0" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-project-360')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Milestones</h4>
            <div className="space-y-2">
              {d.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                  <div className={`w-2 h-2 rounded-full ${
                    m.status === 'completed' ? 'bg-green-500' : m.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.date}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Budget vs Actual (₹ Cr)</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Budget', value: d.cost.budget / 10000000 }, { name: 'Actual', value: d.cost.actual / 10000000 }, { name: 'Earned', value: d.cost.earned / 10000000 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <Cell fill="#94a3b8" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#22c55e" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </WidgetShell>

      <WidgetShell meta={getWidgetMeta('w-my-tasks')} onFeedback={onFeedback}>
        <div className="space-y-1.5">
          {fixtureData.myTasks.items.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <StatusBadge status={task.priority} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-900 truncate">{task.title}</p>
              </div>
              <span className="text-[10px] text-slate-400">{task.due}</span>
            </div>
          ))}
        </div>
      </WidgetShell>
    </div>
  );
}

// Site Engineer Mobile Dashboard
function SiteEngineerDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.siteHome;

  return (
    <div className="space-y-4">
      {/* Site Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">{d.site}</h2>
            <p className="text-[10px] text-orange-100 mt-0.5">{d.date} · {d.weather}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{d.workAuthorisations.approved}/{d.workAuthorisations.total}</p>
            <p className="text-[10px] text-orange-100">Authorisations</p>
          </div>
        </div>
      </div>

      {/* Gate Status */}
      <WidgetShell meta={getWidgetMeta('w-site-home')} onFeedback={onFeedback}>
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <Shield size={12} /> Gate Status — Today
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {d.gateStatus.map((gate, i) => (
              <GateStatusCard key={i} {...gate} />
            ))}
          </div>
        </div>
      </WidgetShell>

      {/* Labour & DPR */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-blue-500" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Labour</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">{d.labour.present}</span>
            <span className="text-xs text-slate-500">/ {d.labour.planned}</span>
          </div>
          <ProgressBar value={d.labour.present} max={d.labour.planned} color="blue" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase">DPR</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">{d.dpr.progress}%</span>
          </div>
          <ProgressBar value={d.dpr.progress} color="green" />
        </div>
      </div>

      {/* Material Balance */}
      <WidgetShell meta={getWidgetMeta('w-stores')} onFeedback={onFeedback}>
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <Package size={12} /> Material Balance
          </h4>
          <div className="space-y-2">
            {d.materialBalance.map((mat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-900 truncate">{mat.item}</p>
                  <p className="text-[10px] text-slate-400">Bal: {mat.balance} {mat.unit}</p>
                </div>
                <div className="w-20">
                  <ProgressBar value={mat.consumed} max={mat.received} color="amber" size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// Store Keeper Dashboard
function StoreKeeperDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.stores;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Consumption vs Theo." value={`${d.consumptionVsTheoretical}%`} trend="flat" trendValue="0%" target="95-102%" />
        <KPIStat label="Wastage" value={`${d.wastage}%`} trend="down" trendValue="-0.3%" target="< 3%" />
        <KPIStat label="Low Stock Items" value={d.lowStockItems} trend="up" trendValue="+2" target="0" />
        <KPIStat label="Stock Value" value={`₹${(d.stockValue / 100000).toFixed(0)}L`} trend="up" trendValue="+5.2%" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-stores')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Consumption vs Theoretical</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.topConsumed.map(t => ({ name: t.item.split(' ')[0], actual: t.consumed, theoretical: t.theoretical }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="theoretical" fill="#94a3b8" radius={[2, 2, 0, 0]} name="Theoretical" />
                  <Bar dataKey="actual" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
              <AlertTriangle size={12} /> Low Stock Alerts
            </h4>
            <div className="space-y-2">
              {d.lowStockAlerts.map((item, i) => (
                <div key={i} className="p-2 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-900">{item.item}</span>
                    <span className="text-[10px] text-red-600 font-mono">{item.balance} {item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <ProgressBar value={item.balance} max={item.reorderLevel} color="red" />
                    <span className="text-[10px] text-slate-400">Reorder: {item.reorderLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// QS / Commercial Dashboard
function QSDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.project360;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Schedule Variance" value={`${d.schedule.variance}%`} trend="down" trendValue="-2%" target="±5%" />
        <KPIStat label="Cost Variance" value={`${((d.cost.cpi - 1) * 100).toFixed(1)}%`} trend="up" trendValue="+1.2%" target="±3%" />
        <KPIStat label="Budget Used" value={`${((d.cost.actual / d.cost.budget) * 100).toFixed(1)}%`} trend="flat" trendValue="0%" target="< 100%" />
        <KPIStat label="Pending Bills" value={d.pendingApprovals} trend="down" trendValue="-3" target="0" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-project-360')} onFeedback={onFeedback}>
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Earned Value Analysis</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Aug', planned: 25, actual: 24, earned: 25 },
                { month: 'Sep', planned: 35, actual: 33, earned: 34 },
                { month: 'Oct', planned: 45, actual: 42, earned: 44 },
                { month: 'Nov', planned: 55, actual: 52, earned: 54 },
                { month: 'Dec', planned: 65, actual: 60, earned: 63 },
                { month: 'Jan', planned: 72, actual: 67, earned: 67 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={2} dot={false} name="Planned (PV)" />
                <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} dot={false} name="Actual (AC)" />
                <Line type="monotone" dataKey="earned" stroke="#22c55e" strokeWidth={2} dot={false} name="Earned (EV)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// Procurement Dashboard
function ProcurementDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.procurement;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Pending PRs" value={d.pendingPRs} trend="down" trendValue="-3" target="< 10" />
        <KPIStat label="Pending POs" value={d.pendingPOs} trend="flat" trendValue="0" target="< 5" />
        <KPIStat label="Pending GRNs" value={d.grnPending} trend="up" trendValue="+1" target="0" />
        <KPIStat label="Value Pending" value={`₹${(d.totalValuePending / 100000).toFixed(0)}L`} trend="down" trendValue="-12%" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-procurement')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Vendor Performance</h4>
            <div className="space-y-2">
              {d.vendorPerformance.map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-900 truncate">{v.vendor}</p>
                    <p className="text-[10px] text-slate-400">{v.deliveries} deliveries · {v.onTime}% on-time</p>
                  </div>
                  <div className="w-24">
                    <ProgressBar value={v.score} color={v.score >= 85 ? 'green' : v.score >= 70 ? 'amber' : 'red'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Recent Purchase Orders</h4>
            <div className="space-y-2">
              {d.recentPOs.map((po, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded-lg flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-slate-900">{po.po}</p>
                    <p className="text-[10px] text-slate-500">{po.vendor}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-700">₹{(po.value / 100000).toFixed(1)}L</span>
                  <StatusBadge status={po.status.toLowerCase().replace(' ', '_')} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// Plant Manager Dashboard
function PlantDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.plant;
  const chartData = d.equipment.filter(e => e.status === 'active').map(e => ({ name: e.name.split(' ')[0] + ' ' + e.name.split(' ')[1], utilisation: e.utilisation }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Utilisation" value={`${d.utilisation}%`} trend="up" trendValue="+3.2%" target="> 75%" />
        <KPIStat label="Breakdown Rate" value={`${d.breakdownRate}%`} trend="down" trendValue="-0.8%" target="< 5%" />
        <KPIStat label="Active" value={d.active} unit={`/ ${d.totalEquipment}`} trend="flat" trendValue="0" />
        <KPIStat label="Under Maintenance" value={d.maintenance} trend="down" trendValue="-1" target="0" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-plant')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Equipment Utilisation</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={80} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="utilisation" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.utilisation >= 80 ? '#22c55e' : entry.utilisation >= 60 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Equipment Status</h4>
            <div className="space-y-2">
              {d.equipment.map((eq, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                  <Truck size={14} className="text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-900 truncate">{eq.name}</p>
                    <p className="text-[10px] text-slate-400">{eq.hours}h total · {eq.breakdown}% breakdown</p>
                  </div>
                  <div className="w-16">
                    <ProgressBar value={eq.utilisation} color={eq.utilisation >= 70 ? 'green' : 'amber'} />
                  </div>
                  <StatusBadge status={eq.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// HR Dashboard
function HRDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.hr;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Total Headcount" value={d.totalHeadcount} trend="up" trendValue="+12" target="Per plan" />
        <KPIStat label="Present Today" value={d.presentToday} unit={`/ ${d.totalHeadcount}`} trend="flat" trendValue="0" />
        <KPIStat label="Attendance Rate" value={`${d.attendanceRate}%`} trend="up" trendValue="+0.5%" target="> 95%" />
        <KPIStat label="Payroll Status" value={d.payrollStatus} color="green" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-hr-dashboard')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Department Attendance</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.departments.map(dep => ({ name: dep.name.split(' ')[0], present: dep.present, total: dep.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="total" fill="#e2e8f0" radius={[2, 2, 0, 0]} name="Total" />
                  <Bar dataKey="present" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Present" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Today's Summary</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                <p className="text-lg font-bold text-green-700">{d.presentToday}</p>
                <p className="text-[10px] text-green-600">Present</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                <p className="text-lg font-bold text-amber-700">{d.onLeave}</p>
                <p className="text-[10px] text-amber-600">On Leave</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                <p className="text-lg font-bold text-red-700">{d.absent}</p>
                <p className="text-[10px] text-red-600">Absent</p>
              </div>
            </div>
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// QA/QC Dashboard
function QADashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.qa;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Inspection Pass Rate" value={`${d.inspectionPassRate}%`} trend="up" trendValue="+1.2%" target="> 95%" />
        <KPIStat label="Open NCRs" value={d.openNCRs} trend="down" trendValue="-1" target="< 3" />
        <KPIStat label="Inspections (Month)" value={d.inspectionsThisMonth} trend="up" trendValue="+8" />
        <KPIStat label="Test Requests" value={d.testRequests} trend="flat" trendValue="0" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-qa-dashboard')} onFeedback={onFeedback}>
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Recent Inspections</h4>
          <div className="space-y-2">
            {d.recentInspections.map((insp, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                <div className={`w-2 h-2 rounded-full ${insp.result === 'Pass' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-900 truncate">{insp.type} — {insp.location}</p>
                  <p className="text-[10px] text-slate-400">{insp.id} · {insp.date}</p>
                </div>
                <StatusBadge status={insp.result.toLowerCase()} />
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// HSE Dashboard
function HSEDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.hse;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Incident Rate" value={d.incidentRate} trend="down" trendValue="-0.3" target="< 1.0" />
        <KPIStat label="Near Misses" value={d.nearMisses} trend="up" trendValue="+2" target="> 5" />
        <KPIStat label="Open Incidents" value={d.openIncidents} trend="down" trendValue="-1" target="0" />
        <KPIStat label="Safety Score" value={d.safetyScore} trend="up" trendValue="+3" target="> 90" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-hse-dashboard')} onFeedback={onFeedback}>
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Recent HSE Events</h4>
          <div className="space-y-2">
            {d.recentIncidents.map((inc, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                <StatusBadge status={inc.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-900 truncate">{inc.type} — {inc.description}</p>
                  <p className="text-[10px] text-slate-400">{inc.site} · {inc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// Protocol Control Tower
function ProtocolDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.protocolTower;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Compliance Score" value={`${d.complianceScore}%`} trend="up" trendValue="+1.4%" target="> 95%" />
        <KPIStat label="Violations" value={d.violations} trend="down" trendValue="-3" target="0" />
        <KPIStat label="Exceptions" value={d.exceptions} trend="flat" trendValue="0" target="< 5%" />
        <KPIStat label="Total Checks" value={d.totalChecks} trend="up" trendValue="+124" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-protocol-tower')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
              <AlertTriangle size={12} /> Recent Violations
            </h4>
            <div className="space-y-2">
              {d.recentViolations.map((v, i) => (
                <div key={i} className="p-2 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={v.severity} />
                    <code className="text-[10px] font-mono text-slate-600">{v.control}</code>
                  </div>
                  <p className="text-xs text-slate-900 mt-1">{v.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{v.site} · {v.time}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Compliance Trend</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[88, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="compliance" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Compliance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <h4 className="text-xs font-semibold text-amber-700 mb-2 mt-4 flex items-center gap-1">
              <Clock size={12} /> Pending Exceptions
            </h4>
            <div className="space-y-2">
              {d.recentExceptions.map((ex, i) => (
                <div key={i} className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] font-mono text-slate-600">{ex.control}</code>
                    <StatusBadge status={ex.status} />
                  </div>
                  <p className="text-xs text-slate-900 mt-1">{ex.reason}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ex.site} · {ex.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}

// Super Admin Dashboard
function AdminDashboard({ onFeedback }: { onFeedback?: (code: string) => void }) {
  const d = fixtureData.adminHealth;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPIStat label="Uptime" value={`${d.uptime}%`} trend="flat" trendValue="0%" target="> 99.5%" />
        <KPIStat label="API p95" value={`${d.apiP95}ms`} trend="down" trendValue="-12ms" target="< 500ms" />
        <KPIStat label="Active Users" value={d.activeUsers} trend="up" trendValue="+8" />
        <KPIStat label="Error Rate" value={`${d.errorRate}%`} trend="down" trendValue="-0.01%" target="< 0.1%" />
      </div>

      <WidgetShell meta={getWidgetMeta('w-admin-health')} onFeedback={onFeedback}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Service Health</h4>
            <div className="space-y-2">
              {d.services.map((svc, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                  <div className={`w-2 h-2 rounded-full ${svc.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span className="text-xs text-slate-900 flex-1">{svc.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{svc.latency}ms</span>
                  <StatusBadge status={svc.status} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">System Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] text-slate-400">DB Connections</p>
                <p className="text-lg font-bold text-slate-900">{d.dbConnections}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] text-slate-400">Queue Depth</p>
                <p className="text-lg font-bold text-slate-900">{d.queueDepth}</p>
              </div>
            </div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2 mt-4">Recent Incidents</h4>
            <div className="space-y-2">
              {d.recentIncidents.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 size={12} className="text-green-500" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-900">{inc.title}</p>
                    <p className="text-[10px] text-slate-400">{inc.time}</p>
                  </div>
                  <StatusBadge status={inc.severity} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetShell>
    </div>
  );
}
