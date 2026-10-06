import { useState } from 'react';
import {
  toolsConfig,
  toolItems,
  custodyTxns,
  lossRecoveries,
  custodyVerifications,
  idleTools,
  calibrationRegister,
  exitClearanceChecks,
  overdueReturns,
  protocolControlPoints,
  protocolStats,
  rolePermissions,
  apiRoutes,
  socketEvents,
  notificationMatrix,
  reports,
  printTemplates,
  offlineOperations,
  dbEntityMap,
  conflictsLogged,
  dependencyValidation,
  publishedContracts,
  integrations,
  toolsStats,
  launchpadTiles,
  kpiWhys,
} from '../data/toolsData';
import type { ToolItem, GateCheckResult } from '../data/toolsData';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

function GateBadge({ check }: { check: GateCheckResult }) {
  const tones: Record<string, string> = {
    pass: 'bg-green-100 text-green-700 border-green-200',
    warn: 'bg-amber-100 text-amber-700 border-amber-200',
    fail: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-slate-100 text-slate-600 border-slate-200',
    exception: 'bg-violet-100 text-violet-700 border-violet-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${tones[check.status]}`}>
      {check.cp} · {check.status.toUpperCase()}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const tones: Record<string, string> = {
    in_store: 'bg-blue-100 text-blue-700',
    issued: 'bg-green-100 text-green-700',
    in_transit: 'bg-amber-100 text-amber-700',
    under_repair: 'bg-orange-100 text-orange-700',
    lost: 'bg-red-100 text-red-700',
    disposed: 'bg-slate-200 text-slate-600',
    reported: 'bg-amber-100 text-amber-700',
    investigated: 'bg-violet-100 text-violet-700',
    recovery_approved: 'bg-green-100 text-green-700',
    write_off_approved: 'bg-slate-200 text-slate-700',
    closed: 'bg-slate-100 text-slate-500',
    completed: 'bg-green-100 text-green-700',
    awaiting: 'bg-amber-100 text-amber-700',
    gap_escalated: 'bg-red-100 text-red-700',
    PASS: 'bg-green-100 text-green-700',
    ADAPTER: 'bg-amber-100 text-amber-700',
    live: 'bg-green-100 text-green-700',
    adapter: 'bg-amber-100 text-amber-700',
    planned: 'bg-slate-100 text-slate-600',
    NEW: 'bg-violet-100 text-violet-700',
    REUSE: 'bg-blue-100 text-blue-700',
    EXTEND: 'bg-amber-100 text-amber-700',
    OBSERVE: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${tones[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function ToolsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'register', label: 'Tool Register', icon: '🧰' },
    { id: 'custody', label: 'Custody Ledger', icon: '🔄' },
    { id: 'scan', label: 'Scan & My Tools', icon: '📱' },
    { id: 'loss', label: 'Loss & Recovery', icon: '⚠️' },
    { id: 'calibration', label: 'Calibration', icon: '🎯' },
    { id: 'utilisation', label: 'Idle / Utilisation', icon: '🕐' },
    { id: 'controls', label: 'Protocol Controls', icon: '🛡️' },
    { id: 'governance', label: 'Governance', icon: '📜' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tool & Small-Asset Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">
            Part 36 — Purchase → Register → Issue → Custody → Transfer → Return → Inspection → Repair → Reissue → Disposal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
            {toolsConfig.featureFlag}
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
            {toolsConfig.rolloutStage} mode
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-50 text-cyan-700 border-b-2 border-cyan-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'register' && <RegisterTab selectedTool={selectedTool} setSelectedTool={setSelectedTool} />}
      {activeTab === 'custody' && <CustodyTab />}
      {activeTab === 'scan' && <ScanTab />}
      {activeTab === 'loss' && <LossTab />}
      {activeTab === 'calibration' && <CalibrationTab />}
      {activeTab === 'utilisation' && <UtilisationTab />}
      {activeTab === 'controls' && <ControlsTab />}
      {activeTab === 'governance' && <GovernanceTab />}
    </div>
  );
}

// ────────────────────────────── Overview ──────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Registered Tools" value={toolsStats.totalTools} subtitle={`${fmt(toolsStats.netBookValue)} net book`} icon="🧰" color="cyan" />
        <StatCard title="Issued (in custody)" value={toolsStats.issued} subtitle={`${toolsStats.inStore} in store · ${toolsStats.inTransit} in transit`} icon="👷" color="green" />
        <StatCard title="Overdue Returns" value={toolsStats.overdueCount} subtitle={`Grace ${toolsConfig.overdueGraceDays} d · DR-21 feed`} icon="⏰" color="amber" />
        <StatCard title="Open Losses" value={toolsStats.openLosses} subtitle={`${fmt(toolsStats.recoveryApprovedValue)} recovery approved`} icon="⚠️" color="red" />
      </div>

      {/* Launchpad tiles per role (section 13) */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Launchpad — Role Workspaces</h3>
        <p className="text-xs text-slate-500 mb-4">Live counts (pending · overdue · exceptions) for the roles of section 6.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {launchpadTiles.map(group => (
            <div key={group.role} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-700 mb-2">{group.role}</p>
              <div className="space-y-2">
                {group.tiles.map(t => (
                  <div key={t.label} className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-slate-200">
                    <span className="text-xs text-slate-600">{t.label}</span>
                    <span className={`text-sm font-bold ${
                      t.tone === 'red' ? 'text-red-600' : t.tone === 'amber' ? 'text-amber-600' : t.tone === 'violet' ? 'text-violet-600' : t.tone === 'blue' ? 'text-blue-600' : 'text-slate-500'
                    }`}>{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Why? drill-downs (section 12) */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">KPI “Why?” Drill-downs</h3>
        <div className="space-y-2">
          {kpiWhys.map(k => (
            <div key={k.kpi} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{k.kpi}</p>
              <p className="text-xs text-slate-500 mt-1">{k.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exit clearance hook summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Exit Clearance Hook (Part 39)</h3>
        <p className="text-xs text-slate-500 mb-3">Section 9 — a user’s exit clearance is blocked while tools remain in their custody.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-4">Employee</th><th className="py-2 pr-4">Tools in custody</th><th className="py-2">Clearance</th>
              </tr>
            </thead>
            <tbody>
              {exitClearanceChecks.map(c => (
                <tr key={c.employeeId} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-slate-800">{c.employeeName}</td>
                  <td className="py-2 pr-4 text-xs text-slate-600">
                    {c.toolsInCustody.length === 0 ? '—' : c.toolsInCustody.map(t => `${t.tagCode} (${t.toolName})`).join(', ')}
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.clearanceBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {c.clearanceBlocked ? 'BLOCKED' : 'CLEAR'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────── Register ──────────────────────────────

function RegisterTab({ selectedTool, setSelectedTool }: {
  selectedTool: ToolItem | null;
  setSelectedTool: (t: ToolItem | null) => void;
}) {
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const filtered = toolItems.filter(t =>
    (category === 'all' || t.category === category) && (status === 'all' || t.currentStatus === status));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={category} onChange={e => setCategory(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="all">All categories</option>
          {['hand', 'power', 'survey', 'safety', 'IT', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white">
          <option value="all">All statuses</option>
          {['in_store', 'issued', 'in_transit', 'under_repair', 'lost', 'disposed'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <span className="text-xs text-slate-500">{filtered.length} of {toolItems.length} tools · List Report pattern (SA-32)</span>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200 bg-slate-50">
              <th className="py-2 px-3">Tag</th><th className="py-2 px-3">Tool</th><th className="py-2 px-3">Cat.</th>
              <th className="py-2 px-3">Status</th><th className="py-2 px-3">Custodian / Store</th><th className="py-2 px-3">Site</th>
              <th className="py-2 px-3">Cond.</th><th className="py-2 px-3">Cost*</th><th className="py-2 px-3">v</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr
                key={t.id}
                onClick={() => setSelectedTool(t.id === selectedTool?.id ? null : t)}
                className={`border-b border-slate-100 cursor-pointer hover:bg-cyan-50/40 ${selectedTool?.id === t.id ? 'bg-cyan-50' : ''}`}
              >
                <td className="py-2 px-3 font-mono text-xs text-slate-700">{t.tagCode}<span className="ml-1 text-[9px] uppercase text-slate-400">{t.tagType}</span></td>
                <td className="py-2 px-3 text-slate-800">{t.name}</td>
                <td className="py-2 px-3 text-xs">{t.category}</td>
                <td className="py-2 px-3"><StatusPill status={t.currentStatus} /></td>
                <td className="py-2 px-3 text-xs text-slate-600">{t.currentCustodianName ?? t.currentStoreName ?? '—'}</td>
                <td className="py-2 px-3 text-xs text-slate-600">{t.siteName}</td>
                <td className="py-2 px-3 text-xs">{t.condition}</td>
                <td className="py-2 px-3 text-xs">{fmt(t.cost)}</td>
                <td className="py-2 px-3 text-xs text-slate-400">{t.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="p-2 text-[10px] text-slate-400">* Cost/depreciated values require tools.valuation.view; masked otherwise (sections 6–7).</p>
      </div>

      {/* Object Page — custody timeline for selected tool */}
      {selectedTool && (
        <div className="bg-white rounded-lg border border-cyan-200 p-5">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Object Page — {selectedTool.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedTool.tagCode} · {selectedTool.make} {selectedTool.model} · SN {selectedTool.serialNo} ·
                GRN ref {selectedTool.purchaseRef ?? 'manual import'} · cal. {selectedTool.calibrationRequired ? `due ${selectedTool.calibrationDueDate}` : 'n/a'}
                {selectedTool.capitalisedAssetId && <> · asset {selectedTool.capitalisedAssetId} (Part 48)</>}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-cyan-600 text-white text-xs font-semibold rounded-lg hover:bg-cyan-700">Print Tag Label</button>
              <button className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50">Request Exception</button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Custody Timeline (immutable chain)</p>
            {custodyTxns
              .filter(c => c.toolId === selectedTool.id)
              .sort((a, b) => b.date.localeCompare(a.date))
              .map(c => (
                <div key={c.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/60">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-xs font-semibold text-slate-800">{c.txnNo} · {c.type.replace('_', ' ').toUpperCase()} · {c.date}</span>
                    <span className="text-[10px] text-slate-500">{c.fromParty.name} → {c.toParty.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{c.remarks}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {c.gateChecks.map(g => <GateBadge key={g.cp + g.name} check={g} />)}
                    <span className="text-[10px] text-slate-400">ack: {c.acknowledgementMethod}{c.scanCapture ? ' · scanned' : ''}{c.deviceId ? ` on ${c.deviceId}` : ''}</span>
                  </div>
                </div>
              ))}
            {custodyTxns.filter(c => c.toolId === selectedTool.id).length === 0 && (
              <p className="text-xs text-slate-400 italic">No custody transactions — tool registered via bulk import (OPENING balance only).</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────── Custody ledger ──────────────────────────────

function CustodyTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-slate-900 text-sm">tool_custody_txns — append-only custody ledger</h3>
          <span className="text-xs text-slate-500">Corrections by reversal documents only (section 9 pattern inherited from Part 35)</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200 bg-slate-50">
              <th className="py-2 px-3">Txn</th><th className="py-2 px-3">Type</th><th className="py-2 px-3">Tool</th>
              <th className="py-2 px-3">From → To</th><th className="py-2 px-3">Expected return</th>
              <th className="py-2 px-3">Ack</th><th className="py-2 px-3">Gate checks</th>
            </tr>
          </thead>
          <tbody>
            {[...custodyTxns].sort((a, b) => b.date.localeCompare(a.date)).map(c => (
              <tr key={c.id} className="border-b border-slate-100 align-top">
                <td className="py-2 px-3 text-xs font-mono">{c.txnNo}<div className="text-[10px] text-slate-400">{c.date}</div></td>
                <td className="py-2 px-3"><StatusPill status={c.type} /></td>
                <td className="py-2 px-3 text-xs">{c.toolName}<div className="text-[10px] font-mono text-slate-400">{c.toolTagCode}</div></td>
                <td className="py-2 px-3 text-xs text-slate-600">{c.fromParty.name}<br />→ {c.toParty.name}</td>
                <td className="py-2 px-3 text-xs">{c.expectedReturnDate ?? 'open-ended'}</td>
                <td className="py-2 px-3 text-xs">{c.acknowledgedBy ? `${c.acknowledgementMethod} ✓` : '— pending'}</td>
                <td className="py-2 px-3"><div className="flex flex-wrap gap-1">{c.gateChecks.map(g => <GateBadge key={g.cp + g.name} check={g} />)}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Periodic Custody Verification (section 5.4 / CP-TOL-02)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {custodyVerifications.map(v => (
            <div key={v.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">{v.campaignNo} · {v.custodianName} ({v.custodianType})</p>
                <p className="text-[11px] text-slate-500">{v.toolsConfirmed}/{v.toolsExpected} confirmed via {v.verifiedVia}{v.missingTags.length ? ` · missing: ${v.missingTags.join(', ')}` : ''}</p>
              </div>
              <StatusPill status={v.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────── Scan & mobile ──────────────────────────────

function ScanTab() {
  const myTools = toolItems.filter(t => t.currentCustodianId === 'emp_102');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-2">Mobile — Scan to Issue / Return / Transfer (360 px target)</h3>
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-900 text-white p-6 text-center">
          <div className="text-4xl mb-2">▣</div>
          <p className="text-sm font-medium">Point camera at QR / barcode tag</p>
          <p className="text-[10px] text-slate-400 mt-1">RFID gate readers via integration where available (section 5.3)</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['Issue', 'Return', 'Count'].map(a => (
              <button key={a} className="py-2.5 bg-cyan-600 rounded-lg text-xs font-semibold hover:bg-cyan-500 min-h-[44px]">{a}</button>
            ))}
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {offlineOperations.map(o => (
            <div key={o.operation} className="p-2 bg-slate-50 rounded border border-slate-100">
              <p className="text-xs font-semibold text-slate-700">{o.operation} <span className="text-slate-400 font-normal">· {o.device} · {o.queue}</span></p>
              <p className="text-[10px] text-slate-500">{o.conflictRule}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-2">Custodian Workspace — “My Tools” (Rakesh Nair)</h3>
        <div className="space-y-2">
          {myTools.map(t => (
            <div key={t.id} className="p-3 border border-slate-100 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">{t.name}</p>
                <p className="text-[10px] font-mono text-slate-400">{t.tagCode} · since issue · condition {t.condition}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-2.5 py-1.5 border border-cyan-200 text-cyan-700 rounded-lg text-[11px] font-semibold hover:bg-cyan-50 min-h-[44px]">Confirm</button>
                <button className="px-2.5 py-1.5 border border-red-200 text-red-600 rounded-lg text-[11px] font-semibold hover:bg-red-50 min-h-[44px]">Report loss</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 font-semibold">Overdue worklist</p>
          {overdueReturns.length === 0
            ? <p className="text-[11px] text-amber-700 mt-1">No returns past due as of 2026-01-16.</p>
            : overdueReturns.map(o => (
              <p key={o.txnNo} className="text-[11px] text-amber-700 mt-1">{o.txnNo} · {o.toolName} ({o.tagCode}) · {o.custodian} · {o.daysOverdue} d overdue</p>
            ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────── Loss & recovery ──────────────────────────────

function LossTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-1">Workflow: REPORTED → INVESTIGATED → RECOVERY_APPROVED / WRITE_OFF_APPROVED → CLOSED</h3>
        <p className="text-xs text-slate-500 mb-4">CP-TOL-03 blocks closure until recovery (payroll Part 45 / bill deduction Part 46) or an approved write-off exists. Recovery amount defaults to depreciated value per policy (section 9).</p>
        <div className="space-y-3">
          {lossRecoveries.map(l => (
            <div key={l.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50/60">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{l.lossNo} — {l.toolName}</p>
                  <p className="text-[11px] text-slate-500">{l.toolTagCode} · reported {l.reportedDate} by {l.reportedBy} · responsible: {l.responsibleParty.name}</p>
                </div>
                <StatusPill status={l.status} />
              </div>
              <p className="text-xs text-slate-600 mt-2"><span className="font-semibold">Investigation:</span> {l.investigationNote}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap text-xs">
                <span className="text-slate-700">Amount: <b>{fmt(l.amount)}</b></span>
                <span className="text-slate-700">Method: <b>{l.method.replace('_', ' ')}</b></span>
                <span className="text-slate-500">Limit: {l.approvalLimit}</span>
                {l.postingRef && <span className="text-green-700">Posting: {l.postingRef}</span>}
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">{l.gateChecks.map(gc => <GateBadge key={gc.cp + gc.name} check={gc} />)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────── Calibration ──────────────────────────────

function CalibrationTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 text-sm mb-1">Calibration Due — Survey / Measuring Instruments</h3>
      <p className="text-xs text-slate-500 mb-4">Mirrors the QA/QC calibration register (Part 52) read-only via adapter. Section 10: calibration-required tools cannot be issued when overdue — enforced server-side inside the issue transaction.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200 bg-slate-50">
              <th className="py-2 px-3">Tool</th><th className="py-2 px-3">Class</th><th className="py-2 px-3">Last calibrated</th>
              <th className="py-2 px-3">Due</th><th className="py-2 px-3">Days</th><th className="py-2 px-3">Certificate</th><th className="py-2 px-3">Issue gate</th>
            </tr>
          </thead>
          <tbody>
            {calibrationRegister.map(c => (
              <tr key={c.toolId} className="border-b border-slate-100">
                <td className="py-2 px-3 text-xs text-slate-800">{c.toolName}<div className="text-[10px] font-mono text-slate-400">{c.tagCode}</div></td>
                <td className="py-2 px-3 text-xs">{c.instrumentClass}</td>
                <td className="py-2 px-3 text-xs">{c.lastCalibrated}</td>
                <td className="py-2 px-3 text-xs">{c.dueDate}</td>
                <td className={`py-2 px-3 text-xs font-semibold ${c.daysRemaining < 0 ? 'text-red-600' : c.daysRemaining <= 30 ? 'text-amber-600' : 'text-green-600'}`}>{c.daysRemaining}</td>
                <td className="py-2 px-3 text-xs text-slate-500">{c.certificateDocId}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.issueBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {c.issueBlocked ? 'BLOCKED' : 'ALLOWED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────────────────────── Utilisation ──────────────────────────────

function UtilisationTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-1">Idle Tools in Store &gt; {toolsConfig.idleThresholdDays} days (section 5.7)</h3>
        <p className="text-xs text-slate-500 mb-4">MONITOR control feeds DR-21 (Part 78) and the alert engine (Part 76). Rows below threshold shown for context.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="py-2 px-3">Tool</th><th className="py-2 px-3">Category</th><th className="py-2 px-3">Store</th>
                <th className="py-2 px-3">Idle days</th><th className="py-2 px-3">Cost*</th><th className="py-2 px-3">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {idleTools.map(i => (
                <tr key={i.toolId} className={`border-b border-slate-100 ${i.idleDays > toolsConfig.idleThresholdDays ? 'bg-red-50/40' : ''}`}>
                  <td className="py-2 px-3 text-xs text-slate-800">{i.toolName}<div className="text-[10px] font-mono text-slate-400">{i.tagCode}</div></td>
                  <td className="py-2 px-3 text-xs">{i.category}</td>
                  <td className="py-2 px-3 text-xs">{i.storeName}</td>
                  <td className={`py-2 px-3 text-xs font-bold ${i.idleDays > toolsConfig.idleThresholdDays ? 'text-red-600' : 'text-slate-500'}`}>{i.idleDays}</td>
                  <td className="py-2 px-3 text-xs">{fmt(i.cost)}</td>
                  <td className="py-2 px-3 text-xs text-slate-600">{i.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Idle > threshold" value={toolsStats.idleCount} subtitle="units flagged" icon="🕐" color="red" />
        <StatCard title="Under repair" value={toolsStats.underRepair} subtitle="not issuable" icon="🔧" color="amber" />
        <StatCard title="Lost" value={toolsStats.lost} subtitle="pending closure" icon="❓" color="red" />
        <StatCard title="Disposed" value={toolsStats.disposed} subtitle="PM-approved" icon="🗑️" color="slate" />
      </div>
    </div>
  );
}

// ────────────────────────────── Protocol controls ──────────────────────────────

function ControlsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-1">Section 8A — Protocol Control Points (registered with Part 7 engine)</h3>
        <p className="text-xs text-slate-500 mb-4">Seeded in OBSERVE (PC-13 rollout OFF → OBSERVE → WARN → ENFORCE). protocol.check() runs inside the business transaction on every path: UI, API, import, job, offline sync.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="py-2 px-3">CP</th><th className="py-2 px-3">Stage</th><th className="py-2 px-3">Control</th>
                <th className="py-2 px-3">Enforcement</th><th className="py-2 px-3">Evidence / threshold</th><th className="py-2 px-3">Escalation</th><th className="py-2 px-3">Mode</th>
              </tr>
            </thead>
            <tbody>
              {protocolControlPoints.map(p => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-2 px-3 text-xs font-mono font-semibold text-slate-700">{p.id}</td>
                  <td className="py-2 px-3 text-xs">{p.stage}</td>
                  <td className="py-2 px-3 text-xs text-slate-700">{p.control}</td>
                  <td className="py-2 px-3 text-xs">{p.enforcement}</td>
                  <td className="py-2 px-3 text-xs text-slate-500">{p.evidence}</td>
                  <td className="py-2 px-3 text-xs">{p.escalation}</td>
                  <td className="py-2 px-3"><StatusPill status={p.mode} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Evaluations today — {protocolStats.evaluationsToday} (PASS {protocolStats.passes} · WARN {protocolStats.warns} · EXCEPTION {protocolStats.exceptions} · BLOCK {protocolStats.blocks})</h3>
        <div className="space-y-2">
          {protocolStats.detail.map(d => (
            <div key={d.cp} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <p className="text-xs font-semibold text-slate-800">{d.cp} — evaluated {d.evaluated}</p>
                <p className="text-[11px] text-slate-500">pass {d.pass} · warn {d.warn} · exc {d.exception} · block {d.block}</p>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">{d.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────── Governance ──────────────────────────────

function GovernanceTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Roles & Permissions (Part 5 registry)">
          {rolePermissions.map(r => (
            <Row key={r.key}>
              <div>
                <p className="text-xs font-mono font-semibold text-slate-800">{r.key}</p>
                <p className="text-[11px] text-slate-500">{r.description} · scope: {r.scopeLevels}{r.approvalLimit ? ` · limit: ${r.approvalLimit}` : ''}</p>
              </div>
              <span className="text-[10px] font-semibold text-cyan-700 whitespace-nowrap">{r.role}</span>
            </Row>
          ))}
        </Panel>
        <Panel title="APIs (SA-11 · v1 new routes)">
          {apiRoutes.map(a => (
            <Row key={a.method + a.path}>
              <div>
                <p className="text-xs font-mono text-slate-800">{a.method} {a.path}</p>
                <p className="text-[11px] text-slate-500">{a.notes}</p>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">{a.permission.split(' ')[0]}</span>
            </Row>
          ))}
        </Panel>
        <Panel title="Socket Events (SA-8 outbox → queue → rooms)">
          {socketEvents.map(s => (
            <Row key={s.event}>
              <div>
                <p className="text-xs font-mono font-semibold text-slate-800">{s.event}</p>
                <p className="text-[11px] text-slate-500">{s.description}</p>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">{s.room}</span>
            </Row>
          ))}
        </Panel>
        <Panel title="Notifications (levels per SA-9)">
          {notificationMatrix.map(n => (
            <Row key={n.trigger}>
              <div>
                <p className="text-xs font-semibold text-slate-800">{n.trigger}</p>
                <p className="text-[11px] text-slate-500">{n.recipients} · tpl {n.template}</p>
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${
                n.level === 'Critical' || n.level === 'Escalation' ? 'text-red-600' : n.level === 'Warning' || n.level === 'Action required' ? 'text-amber-600' : 'text-blue-600'
              }`}>{n.level}</span>
            </Row>
          ))}
        </Panel>
        <Panel title="Reports (catalogue Part 65)">
          {reports.map(r => (
            <Row key={r.code}>
              <div>
                <p className="text-xs font-semibold text-slate-800">{r.code} — {r.name}</p>
                <p className="text-[11px] text-slate-500">{r.format} · drill: {r.drillDown}</p>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">{r.consumers}</span>
            </Row>
          ))}
        </Panel>
        <Panel title="Print Templates (SA-15)">
          {printTemplates.map(p => (
            <Row key={p.code}>
              <div>
                <p className="text-xs font-semibold text-slate-800">{p.code} — {p.name}</p>
                <p className="text-[11px] text-slate-500">{p.branding} · {p.features}</p>
              </div>
            </Row>
          ))}
        </Panel>
        <Panel title="DB Entity Map (additive · reversible)">
          {dbEntityMap.map(d => (
            <Row key={d.table}>
              <div>
                <p className="text-xs font-mono font-semibold text-slate-800">{d.table}</p>
                <p className="text-[11px] text-slate-500">{d.entity} — {d.notes}</p>
              </div>
              <StatusPill status={d.decision} />
            </Row>
          ))}
        </Panel>
        <Panel title="Dependency Validation (section 30)">
          {dependencyValidation.map(d => (
            <Row key={d.part}>
              <div>
                <p className="text-xs font-semibold text-slate-800">{d.part} — {d.name} <span className="text-slate-400 font-normal">({d.flag}: {d.flagState})</span></p>
                <p className="text-[11px] text-slate-500">{d.interfaces} · evidence: {d.regressionEvidence}</p>
              </div>
              <StatusPill status={d.result} />
            </Row>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-100">
            {publishedContracts.map(c => (
              <p key={c.part + c.interface} className="text-[11px] text-slate-600">Published → {c.part}: <span className="font-mono">{c.interface}</span> ({c.kind}) · {c.test}</p>
            ))}
          </div>
        </Panel>
        <Panel title="Integrations (service interfaces & events only)">
          {integrations.map(i => (
            <Row key={i.part + i.name}>
              <div>
                <p className="text-xs font-semibold text-slate-800">{i.part} — {i.name} <span className="text-slate-400 font-normal">({i.direction})</span></p>
                <p className="text-[11px] text-slate-500">{i.mechanism}</p>
              </div>
              <StatusPill status={i.state} />
            </Row>
          ))}
        </Panel>
        <Panel title="Conflicts Logged (CONFLICTS.md)">
          {conflictsLogged.map(c => (
            <Row key={c.id}>
              <div>
                <p className="text-xs font-semibold text-slate-800">{c.id}</p>
                <p className="text-[11px] text-slate-500">{c.issue} → {c.resolution}</p>
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${c.status.startsWith('RESOLVED') ? 'text-green-600' : 'text-amber-600'}`}>{c.status}</span>
            </Row>
          ))}
        </Panel>
      </div>
    </div>
  );
}

// ────────────────────────────── Shared widgets ──────────────────────────────

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h4 className="text-sm font-semibold text-slate-900 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-3 p-2 bg-slate-50/70 rounded border border-slate-100">{children}</div>;
}

function StatCard({ title, value, subtitle, icon, color }: {
  title: string; value: string | number; subtitle: string; icon: string; color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'bg-cyan-50 border-cyan-200',
    amber: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    violet: 'bg-violet-50 border-violet-200',
    slate: 'bg-slate-50 border-slate-200',
  };
  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color] ?? colorClasses.slate}`}>
      <div className="flex items-center justify-between mb-2"><span className="text-2xl">{icon}</span></div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
