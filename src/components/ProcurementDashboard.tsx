import { useState } from 'react';
import {
  procMrpRuns,
  procMrpLines,
  procRequisitions,
  procRfqs,
  procQuotations,
  procComparativeStatements,
  procPurchaseOrders,
  procPoAmendments,
  procDispatches,
  procVendorPerformance,
  procPriceVariance,
  procControlPoints,
  procStats
} from '../data/procurementData';
import type { ProcRequisition } from '../data/procurementData';

const statusChip: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-600',
  SUBMITTED: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  PARTIALLY_ORDERED: 'bg-blue-100 text-blue-700',
  ORDERED: 'bg-blue-100 text-blue-700',
  PARTIALLY_RECEIVED: 'bg-blue-100 text-blue-700',
  RELEASED: 'bg-purple-100 text-purple-700',
  RECEIVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  SHORT_CLOSED: 'bg-orange-100 text-orange-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-red-100 text-red-700',
  ISSUED: 'bg-cyan-100 text-cyan-700'
};

const priorityChip: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  emergency: 'bg-red-100 text-red-700'
};

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
const planRefLabel: Record<string, string> = { mrp: 'MRP line', wa: 'Work Authorisation', daily_plan: 'Daily Plan', site_requirement: 'Site Requirement' };

export function ProcurementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'mrp', label: 'MRP Workbench' },
    { id: 'pr', label: 'PR Register' },
    { id: 'rfq', label: 'RFQ & Quotations' },
    { id: 'cs', label: 'Comparative Statement' },
    { id: 'po', label: 'Purchase Orders' },
    { id: 'delivery', label: 'Delivery Tracker' },
    { id: 'vendors', label: 'Vendor Scorecard' },
    { id: 'protocol', label: 'Protocol Controls' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Procurement</h1>
          <p className="text-sm text-slate-500 mt-1">Part 34 — Material Requirement → PR → RFQ → Quotation → Comparative Statement → Approval → PO → Dispatch (GRN in Part 35) with MRP, budget checks and vendor performance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">ff.proc</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'mrp' && <MrpTab />}
      {activeTab === 'pr' && <PrTab />}
      {activeTab === 'rfq' && <RfqTab />}
      {activeTab === 'cs' && <CsTab />}
      {activeTab === 'po' && <PoTab />}
      {activeTab === 'delivery' && <DeliveryTab />}
      {activeTab === 'vendors' && <VendorsTab />}
      {activeTab === 'protocol' && <ProtocolTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Open PRs" value={procStats.openPrs} subtitle={`${procStats.totalPrs} total in register`} color="amber" />
        <StatCard title="RFQs Issued" value={procStats.rfqsIssued} subtitle={`${procStats.quotations} quotations received`} color="cyan" />
        <StatCard title="Open PO Commitment" value={fmt(procStats.openPoValue)} subtitle={`${procStats.poCount} POs · fed to budget (Part 25)`} color="emerald" />
        <StatCard title="Avg Vendor Score" value={procStats.vendorScoreAvg} subtitle={`YTD savings ${fmt(procStats.savingsYtd)} · ${procStats.priceAlerts} price alerts`} color="purple" />
      </div>

      {/* Procurement chain */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Procurement Chain — PLAN → AUTHORIZE → EXECUTE → RECORD → VERIFY → ANALYZE → CONTROL → CLOSE</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">MRP from BOQ norms + schedule</p>
            <p className="font-semibold text-slate-900">requirement − stock − open PO − in-transit; PR by required-by − lead time</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Budget & protocol checks</p>
            <p className="font-semibold text-slate-900">budget check at PR (soft) and PO approval (hard); CP-PROC-01…08</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Landed cost comparison</p>
            <p className="font-semibold text-slate-900">basic − discount + freight + other; recoverable GST excluded (configurable)</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Commitments</p>
            <p className="font-semibold text-slate-900">PO approval emits commitment (Part 25); amendments adjust; short-close releases</p>
          </div>
        </div>
      </div>

      {/* Control points summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {procControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">{cp.stage}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded uppercase">{cp.status}</span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement} · Escalation: {cp.escalation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MrpTab() {
  const run = procMrpRuns[0];
  const params = (() => { try { return JSON.parse(run.parametersJson); } catch { return {}; } })();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">MRP Workbench</h3>
            <p className="text-sm text-slate-500 mt-1">Material Requirement Planning from BOQ norms and schedule (Parts 20/26) — requirement = Σ(remaining qty × norm × (1+wastage)) − stock − open POs − in-transit</p>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">+ Run MRP</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Project</p>
            <p className="font-semibold text-slate-900">{run.projectName}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Horizon</p>
            <p className="font-semibold text-slate-900">{run.horizonDays} days</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Run at</p>
            <p className="font-semibold text-slate-900">{new Date(run.runAt).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Parameters</p>
            <p className="text-xs font-mono text-slate-700">wastage {params.wastage_default_pct}% · lead buffer {params.lead_time_buffer_days}d</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Material</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Required</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Required By</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Stock</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Open PO</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">In-Transit</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Net Req.</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Suggested PR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {procMrpLines.map(l => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{l.materialName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{l.sourceActivity} · {l.sourceBoq}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{l.requiredQty} {l.uomName}</td>
                  <td className="px-4 py-3 text-center text-sm text-slate-700">{l.requiredBy}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{l.stockAvailable}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{l.openPoQty}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{l.inTransitQty}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{l.netRequirement}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-700">{l.suggestedPrQty} {l.uomName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Planner converts suggested lines to PR — <span className="font-mono">POST /api/v1/proc/mrp/run</span>, <span className="font-mono">GET /api/v1/proc/mrp/runs/&#123;id&#125;</span>. CP-PROC-01: PR must reference an MRP line, WA/daily-plan or approved site requirement.
        </p>
      </div>
    </div>
  );
}

function PrTab() {
  const [expanded, setExpanded] = useState<string | null>('pr_001');
  const toggle = (id: string) => setExpanded(prev => (prev === id ? null : id));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Purchase Requisition Register</h3>
            <p className="text-sm text-slate-500 mt-1">DRAFT → SUBMITTED → APPROVED → PARTIALLY_ORDERED → ORDERED → CLOSED | REJECTED | CANCELLED · budget check per line (Part 25) · approval via workflow engine (Part 6)</p>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">+ New PR</button>
        </div>
        <div className="divide-y divide-slate-200">
          {procRequisitions.map((pr) => <PrCard key={pr.id} pr={pr} expanded={expanded === pr.id} onToggle={() => toggle(pr.id)} />)}
        </div>
      </div>
    </div>
  );
}

function PrCard({ pr, expanded, onToggle }: { pr: ProcRequisition; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="p-6 hover:bg-slate-50">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm font-mono font-semibold text-amber-700">{pr.prNo}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusChip[pr.status]}`}>{pr.status}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${priorityChip[pr.priority]}`}>{pr.priority}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${pr.budgetCheckStatus === 'pass' ? 'bg-green-100 text-green-700' : pr.budgetCheckStatus === 'fail' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              budget: {pr.budgetCheckStatus}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600">{planRefLabel[pr.planRefType]}: {pr.planRef}</span>
          </div>
          <p className="text-sm font-medium text-slate-900">{pr.purpose}</p>
          <p className="text-xs text-slate-500 mt-1">{pr.projectName} · site {pr.siteId} · by {pr.requestedByName} · required by {pr.requiredBy} · {pr.lines.length} line(s)</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{fmt(pr.estimatedValue)}</p>
          <button onClick={onToggle} className="text-xs text-amber-700 hover:text-amber-800 font-medium mt-1">
            {expanded ? 'Hide lines ▲' : 'Show lines ▼'}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Material / Service</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">WBS / Cost Code</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Qty</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Est. Rate</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Balance to Order</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Preferred Vendor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pr.lines.map(l => (
                <tr key={l.id}>
                  <td className="px-3 py-2 text-sm text-slate-900">{l.materialName}{l.spec ? <span className="text-xs text-slate-400"> · {l.spec}</span> : ''}</td>
                  <td className="px-3 py-2 text-xs font-mono text-slate-500">{l.wbsNodeId} · {l.costCodeId}</td>
                  <td className="px-3 py-2 text-right text-sm text-slate-700">{l.qty} {l.uomName}</td>
                  <td className="px-3 py-2 text-right text-sm text-slate-700">{fmt(l.estimatedRate)}</td>
                  <td className="px-3 py-2 text-right text-sm text-slate-700">{l.balanceQtyToOrder} {l.uomName}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{l.preferredVendorName || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RfqTab() {
  return (
    <div className="space-y-6">
      {procRfqs.map(rfq => (
        <div key={rfq.id} className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-mono font-semibold text-cyan-700">{rfq.rfqNo}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusChip[rfq.status]}`}>{rfq.status}</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600">from {rfq.prNo}</span>
              </div>
              <p className="text-sm font-medium text-slate-900">{rfq.projectName}</p>
              <p className="text-xs text-slate-500 mt-1">Issued {rfq.issueDate} · responses due {rfq.dueDate}</p>
            </div>
            <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">+ Issue RFQ</button>
          </div>
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">{rfq.terms}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase mb-2">RFQ Lines</p>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Material</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rfq.lines.map(l => (
                    <tr key={l.id}>
                      <td className="px-3 py-2 text-sm text-slate-900">{l.materialName}</td>
                      <td className="px-3 py-2 text-right text-sm text-slate-700">{l.qty} {l.uomName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase mb-2">Vendors & Responses</p>
              <div className="space-y-2">
                {rfq.vendors.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{v.vendorName}</p>
                      <p className="text-[10px] text-slate-500">{v.channel} · sent {v.sentAt ? new Date(v.sentAt).toLocaleDateString() : '—'}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      v.responseStatus === 'responded' ? 'bg-green-100 text-green-700' :
                      v.responseStatus === 'viewed' ? 'bg-blue-100 text-blue-700' :
                      v.responseStatus === 'declined' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {v.responseStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quotations against this RFQ */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-700 uppercase mb-2">Quotations Received (sensitive — `proc.quotation.rates.view`, not site users)</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Vendor</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Material</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Rate</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Disc %</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Freight</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Landed Rate</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Brand</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Delivery Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {procQuotations.filter(q => q.rfqId === rfq.id).flatMap(q =>
                    q.lines.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-sm font-medium text-slate-900">{q.vendorName}</td>
                        <td className="px-3 py-2 text-sm text-slate-700">{l.materialName}</td>
                        <td className="px-3 py-2 text-right text-sm text-slate-700">{fmt(l.rate)}</td>
                        <td className="px-3 py-2 text-right text-sm text-slate-700">{l.discountPct}%</td>
                        <td className="px-3 py-2 text-right text-sm text-slate-700">{fmt(l.freight)}</td>
                        <td className="px-3 py-2 text-right text-sm font-semibold text-slate-900">{fmt(l.landedRate)}</td>
                        <td className="px-3 py-2 text-sm text-slate-700">{l.brand || '—'}</td>
                        <td className="px-3 py-2 text-center text-sm text-slate-700">{q.deliveryDays}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Landed cost = basic − discount + freight + other; recoverable GST excluded from comparison (configurable). Vendor responses also captured via secure token-based, time-limited vendor response link (<span className="font-mono">/api/v1/proc/vendor-portal/rfq/&#123;token&#125;</span>).
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CsTab() {
  const cs = procComparativeStatements[0];
  const vendors = Array.from(new Set(procQuotations.filter(q => q.rfqId === cs.rfqId).map(q => q.vendorName)));
  const items = procQuotations.filter(q => q.rfqId === cs.rfqId).flatMap(q => q.lines.map(l => l.materialName));
  const uniqueItems = Array.from(new Set(items));
  const rateFor = (vendor: string, item: string) =>
    procQuotations.filter(q => q.rfqId === cs.rfqId && q.vendorName === vendor)
      .flatMap(q => q.lines).find(l => l.materialName === item)?.landedRate;
  const l1For = (item: string) => {
    const rates = vendors.map(v => ({ vendor: v, rate: rateFor(v, item) })).filter(r => r.rate !== undefined) as { vendor: string; rate: number }[];
    return rates.reduce((min, r) => (r.rate < min.rate ? r : min), rates[0]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-mono font-semibold text-amber-700">{cs.csNo}</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusChip[cs.status]}`}>{cs.status}</span>
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600">{cs.rfqNo}</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Auto-generated comparison · L1 by landed cost per line and overall · budget rate {cs.budgetRate ? fmt(cs.budgetRate) : '—'} · last purchase rate {cs.lastPurchaseRate ? fmt(cs.lastPurchaseRate) : '—'}</p>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">+ Create CS</button>
        </div>

        {/* CS matrix: vendors × items, L1 highlighted */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Item</th>
                {vendors.map(v => (
                  <th key={v} className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">{v}</th>
                ))}
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">L1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {uniqueItems.map(item => {
                const l1 = l1For(item);
                return (
                  <tr key={item} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{item}</td>
                    {vendors.map(v => {
                      const rate = rateFor(v, item);
                      const isL1 = l1 && rate === l1.rate;
                      return (
                        <td key={v} className="px-4 py-3 text-right">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${isL1 ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                            {rate !== undefined ? fmt(rate) : '—'}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center text-xs font-medium text-green-700">{l1 ? l1.vendor : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected award split */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Recommended Award Split</p>
            {cs.lines.filter(l => l.selectedQty > 0).map(l => (
              <div key={l.id} className="flex items-center justify-between text-sm py-1">
                <span className="text-slate-700">{l.vendorName} — {l.materialName}</span>
                <span className="font-semibold text-slate-900">{l.selectedQty} @ {fmt(l.landedRate)} {l.isL1 ? '(L1)' : '(non-L1)'}</span>
              </div>
            ))}
            <p className="text-[10px] text-slate-500 mt-2">Split award allowed · justification mandatory if not L1 (CP-PROC-04: non-L1 needs justification and higher approval, escalation L3)</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Justification</p>
            <p className="text-sm text-slate-700">{cs.justification || '— (all selections are L1 — no justification required)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PoTab() {
  return (
    <div className="space-y-6">
      {procPurchaseOrders.map(po => (
        <div key={po.id} className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-mono font-semibold text-emerald-700">{po.poNo}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusChip[po.status]}`}>{po.status}</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600">{po.sourceType === 'cs' ? `from ${procComparativeStatements.find(c => c.id === po.csId)?.csNo}` : po.sourceType === 'direct' ? 'DIRECT PO' : 'rate contract'}</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600">GST {po.gstType}</span>
                {po.amendmentNo > 0 && <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">Amendment {po.amendmentNo}</span>}
              </div>
              <p className="text-sm font-medium text-slate-900">{po.vendorName} · {po.projectName}</p>
              <p className="text-xs text-slate-500 mt-1">PO date {po.poDate} · {po.paymentTerms} · {po.priceBasis} · {po.vendorState} → {po.deliveryState}</p>
              {po.directPoReason && <p className="text-xs text-orange-700 bg-orange-50 p-2 rounded mt-2">{po.directPoReason}</p>}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">{fmt(po.totalAmount)}</p>
              <p className="text-xs text-slate-500">basic {fmt(po.totalBasic)} · tax {fmt(po.totalTax)}</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">commitment: {fmt(po.commitmentAmount)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase">WBS / Cost Code</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Qty</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Amount</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Delivered</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Invoiced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {po.lines.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-sm text-slate-900">{l.description}</td>
                    <td className="px-3 py-2 text-xs font-mono text-slate-500">{l.wbsNodeId} · {l.costCodeId}</td>
                    <td className="px-3 py-2 text-right text-sm text-slate-700">{l.qty} {l.uomName}</td>
                    <td className="px-3 py-2 text-right text-sm text-slate-700">{fmt(l.rate)}</td>
                    <td className="px-3 py-2 text-right text-sm font-semibold text-slate-900">{fmt(l.amount)}</td>
                    <td className="px-3 py-2 text-center text-sm text-slate-700">{l.deliveredQty}/{l.qty}</td>
                    <td className="px-3 py-2 text-center text-sm text-slate-700">{l.invoicedQty}/{l.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700">Release to vendor</button>
            <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700">Amend</button>
            <button className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700">Short-close</button>
            <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700">Cancel</button>
            <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50">Print PO</button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Cancelling a PO with GRN against it is not allowed (short-close instead) · short-close/cancel require reason code and release commitment (CP-PROC-08) · PO qty ≤ approved PR balance, PO rate ≤ approved CS rate, price variance vs benchmark {'>'} 5% needs approval (CP-PROC-05) · GST via tax resolver (Part 11), switching to GST engine rules (Part 88) once live with parallel comparison · rate observations feed Part 91 once live.
          </p>
        </div>
      ))}

      {/* Amendments */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">PO Amendments (versioned, re-approved)</h3>
        <div className="space-y-3">
          {procPoAmendments.map(a => {
            const changes = (() => { try { return JSON.parse(a.changesJson); } catch { return {}; } })();
            return (
              <div key={a.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-mono font-semibold text-purple-700">{a.poNo}</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">Amendment {a.amendmentNo}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${a.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{a.status}</span>
                </div>
                {Object.entries(changes).map(([field, ch]) => {
                  const c = ch as { from: number; to: number };
                  const pct = c.from !== 0 ? ((c.to - c.from) / c.from) * 100 : 0;
                  return (
                    <div key={field} className="flex items-center justify-between text-sm py-1">
                      <span className="font-mono text-xs text-slate-500">{field}</span>
                      <span className="text-slate-700">{c.from.toLocaleString()} → {c.to.toLocaleString()}
                        <span className={`ml-2 font-medium ${pct > 0 ? 'text-red-600' : 'text-green-600'}`}>{pct > 0 ? '+' : ''}{pct.toFixed(1)}%</span>
                      </span>
                    </div>
                  );
                })}
                <p className="text-xs text-slate-600 mt-2">Reason: {a.reason}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price variance */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Price Variance — PO rate vs budget rate vs last purchase rate</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Material</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">PO</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">PO Rate</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Budget Rate</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Last Purchase</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">vs Budget</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {procPriceVariance.map(pv => (
                <tr key={pv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{pv.materialName}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{pv.poNo}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{fmt(pv.poRate)}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{fmt(pv.budgetRate)}</td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">{fmt(pv.lastPurchaseRate)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${pv.varianceVsBudgetPct > 0 ? 'bg-red-100 border-red-300 text-red-800' : 'bg-green-100 border-green-300 text-green-800'}`}>
                      {pv.varianceVsBudgetPct > 0 ? '+' : ''}{pv.varianceVsBudgetPct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded ${pv.alert ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {pv.alert ? 'ALERT' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">Alerts above 5% threshold → registered with the alert engine (Part 76) and escalation ladders (Part 7).</p>
      </div>
    </div>
  );
}

function DeliveryTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Delivery Tracker — Dispatch / ASN recording</h3>
        <p className="text-sm text-slate-500 mb-4">Expected delivery tracking · overdue alerts (CP-PROC-07) · GRN happens in Part 35 (Stores)</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">PO</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Lines</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Vendor Invoice</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">LR / Vehicle</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">E-Way Bill</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Dispatched</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Expected</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {procDispatches.map(d => {
                const overdue = !d.arrived && new Date(d.expectedArrival).getTime() < new Date('2025-12-04').getTime();
                return (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-emerald-700">{d.poNo}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{d.linesSummary}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{d.vendorInvoiceNo || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{d.lrNo} · {d.vehicleNo}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{d.ewayBillNo || '—'}</td>
                    <td className="px-4 py-3 text-center text-sm text-slate-700">{d.dispatchDate}</td>
                    <td className="px-4 py-3 text-center text-sm text-slate-700">{d.expectedArrival}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${d.arrived ? 'bg-green-100 text-green-700' : overdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {d.arrived ? 'Arrived' : overdue ? 'Overdue' : 'In Transit'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          {procStats.overdueDeliveries} overdue delivery(ies) → alerts to procurement + site (CP-PROC-07, escalation L2) · events: <span className="font-mono">proc.dispatch.recorded</span>, <span className="font-mono">proc.po.delivery_overdue</span>
        </p>
      </div>
    </div>
  );
}

function VendorsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Vendor Performance Scorecard</h3>
        <p className="text-sm text-slate-500 mb-4">Delivery timeliness (GRN date vs due, from Part 35) · quality acceptance (Parts 35/52) · price competitiveness · responsiveness — <span className="font-mono">GET /api/v1/proc/vendors/&#123;id&#125;/performance</span></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {procVendorPerformance.map(v => (
            <div key={v.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{v.vendorName}</p>
                  <p className="text-xs text-slate-500">{v.period} · {v.poCount} POs</p>
                </div>
                <span className={`px-2 py-1 text-sm font-bold rounded-lg ${
                  v.grade === 'A' ? 'bg-green-100 text-green-700' :
                  v.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                  v.grade === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {v.grade}
                </span>
              </div>
              <div className="space-y-2">
                <MetricBar label="On-time delivery" pct={v.onTimePct} />
                <MetricBar label="Quality acceptance" pct={v.qualityAcceptPct} />
                <MetricBar label="Price competitiveness" pct={v.priceCompetitiveness} />
                <MetricBar label="Responsiveness" pct={v.responsiveness} />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Overall score</span>
                <span className="text-lg font-bold text-slate-900">{v.score}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">Blacklisted vendor blocked from RFQ/PO (CP-PROC-03) · vendor with bank-change hold can receive PO but not payment (Part 50).</p>
      </div>
    </div>
  );
}

function MetricBar({ label, pct }: { label: string; pct: number }) {
  const color = pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
        <span>{label}</span>
        <span className="font-semibold text-slate-700">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ProtocolTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Protocol Control Points — CP-PROC</h3>
        <p className="text-sm text-slate-500 mb-4">Registered with the Protocol & Control Engine (Part 7) · rollout OFF → OBSERVE → WARN → ENFORCE · deviations only through approved exceptions (PC-3)</p>
        <div className="space-y-3">
          {procControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">{cp.stage}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded uppercase">{cp.status}</span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement} · Evidence: {cp.evidence} · Escalation: {cp.escalation}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-2">Gate-status panel — CP-PROC evaluation (OBSERVE mode)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {procControlPoints.map(cp => (
              <div key={cp.id} className="p-2 bg-white rounded border border-slate-200">
                <p className="text-[10px] font-mono font-semibold text-slate-700">{cp.id}</p>
                <p className="text-[10px] text-green-600 font-medium mt-0.5">PASS</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-800">
            Every control point is evaluated server-side on all paths (UI, API, import, job, offline sync, AI draft) via <span className="font-mono">protocol.check()</span> and produces evaluation, exception, violation and action-ledger records (Part 10). Blocked actions offer Request exception; emergency purchases follow the emergency path and are regularised within 24 h (CP-PROC-06).
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    amber: 'bg-amber-50 border-amber-200',
    cyan: 'bg-cyan-50 border-cyan-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
