import { motion } from 'framer-motion';
import { 
  Package, Shield, AlertTriangle, CheckCircle2, XCircle, TrendingUp, TrendingDown, 
  Clipboard, Calendar, Loader2, Sun, Moon, RefreshCw, 
  Mail, Phone, MapPin, Users, Settings, Printer, 
  Menu, ChevronRight, LogOut, ShieldMinus,
  Folder, Eye, Search as SearchIcon
} from 'lucide-react';
import { KPIStat, StatusBadge, ProgressBar, GateStatusCard } from './widgets/WidgetShell';
import { useState, useEffect } from 'react';
import { systemInfo } from '../data/mockData';
import { featureFlags } from '../data/mockData';
import { protocolControls } from '../data/mockData';
import { controlPointModes } from '../data/protocolData';
import { observeImpactReports } from '../data/protocolData';
import { kpiCatalogue } from '../data/previewData';
import { widgetRegistry } from '../data/previewData';
import { quickActions } from '../data/dashboardData';

interface StoreDashboardProps {
  persona: string;
  onFeedback?: (widgetCode: string) => void;
}

const STORE_TYPES = ['site', 'central', 'yard', 'plant'];
const QC_STATUS = ['pending', 'accepted', 'rejected'];
const TXN_TYPES = ['GRN', 'ISSUE', 'RETURN', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT', 'OPENING'];
const AGEING_BUCKETS = ['0-30 days', '31-90 days', '91-180 days', '>180 days'];

function useFeatureFlag(key: string): boolean {
  const flag = featureFlags.find(f => f.key === key);
  return flag ? flag.enabled : false;
}

function useControlPointMode(cpCode: string): 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE' {
  const mode = controlPointModes.find(m => m.cpCode === cpCode);
  return mode ? mode.mode : 'OFF';
}

function computeStoreValue(stores: any[]): number {
  return stores.reduce((sum, st) => sum + st.stockValue, 0) / 100000;
}

function computeLowStockCount(stores: any[]): number {
  return stores.reduce((sum, st) => sum + st.lowStockItems, 0);
}

export function StoreDashboard({ persona, onFeedback }: StoreDashboardProps) {
  const [ffStores, setFfStores] = useState(false);
  const [ffGrn, setFfGrn] = useState(false);
  const [ffIssue, setFfIssue] = useState(false);
  const [ffTransfer, setFfTransfer] = useState(false);
  const [ffAdjustment, setFfAdjustment] = useState(false);
  const [ffPv, setFfPv] = useState(false);
  const [ffReorder, setFfReorder] = useState(false);
  const [ffBarcode, setFfBarcode] = useState(false);
  const [ffPlantStore, setFfPlantStore] = useState(false);

  if (!ffStores) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="text-center py-12">
          <Shield size={48} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Stores & Inventory</h2>
          <p className="text-slate-500 mt-2">Feature flag ff.stores is disabled</p>
          <p className="text-slate-500 mt-4">Enable ff.stores from the feature flags panel to access stores & inventory functionality.</p>
          <button 
            onClick={() => onFeedback?.('ff.stores')}
            className="mt-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
          >
            Navigate to Feature Flags
          </button>
        </div>
      </div>
    );
  }

  // Sample stores data - in production this would come from API
  const stores = [
    { id: 'store_001', name: 'Main Site Store', type: 'site', keeper: 'Suresh Nair', status: 'active', stockValue: 12450000, lowStockItems: 5 },
    { id: 'store_002', name: 'Central Warehouse', type: 'central', keeper: 'Manoj Kumar', status: 'active', stockValue: 89500000, lowStockItems: 12 },
    { id: 'store_003', name: 'Block A Satellite Store', type: 'site', keeper: 'Rahul Mehta', status: 'active', stockValue: 3250000, lowStockItems: 8 },
    { id: 'store_004', name: 'Plant Store - BP-01', type: 'plant', keeper: 'Plant Keeper', status: 'active', stockValue: 15500000, lowStockItems: 3 },
  ];

  const materials = [
    { id: 'mat_001', name: 'Steel TMT 16mm', uom: 'MT', currentStock: 15.3, minimum: 25, maximum: 100, reorderLevel: 25 },
    { id: 'mat_002', name: 'Cement OPC 53', uom: 'Bags', currentStock: 180, minimum: 100, maximum: 500, reorderLevel: 100 },
    { id: 'mat_003', name: 'Sand (River)', uom: 'Cum', currentStock: 25, minimum: 50, maximum: 200, reorderLevel: 50 },
    { id: 'mat_004', name: 'Aggregate 20mm', uom: 'Cum', currentStock: 13, minimum: 30, maximum: 150, reorderLevel: 30 },
    { id: 'mat_005', name: 'Binding Wire', uom: 'Kg', currentStock: 12, minimum: 25, maximum: 200, reorderLevel: 25 },
    { id: 'mat_006', name: 'Cover Blocks 50mm', uom: 'Nos', currentStock: 80, minimum: 200, maximum: 1000, reorderLevel: 200 },
  ];

  const totalStockValue = computeStoreValue(stores);
  const totalLowStock = computeLowStockCount(stores);
  const pendingQcCount = 6;
  const inTransitCount = 4;

  const ageingData = [
    { material: 'Steel TMT 16mm', daysSinceLastMovement: 45, bucket: '31-90 days', value: 125000 },
    { material: 'Sand (River)', daysSinceLastMovement: 12, bucket: '0-30 days', value: 8500 },
    { material: 'Aggregate 20mm', daysSinceLastMovement: 110, bucket: '91-180 days', value: 45000 },
    { material: 'Binding Wire', daysSinceLastMovement: 195, bucket: '>180 days', value: 32000 },
  ];

  const deadStock = ageingData.filter(a => a.bucket === '>180 days');

  const pendingGRNs = [
    { grnNo: 'GRN-2026-0289', po: 'PO-2026-0158', vendor: 'Tata Steel Ltd.', qty: '400 Bags', date: '2026-01-10', status: 'under_inspection' },
    { grnNo: 'GRN-2026-0290', po: 'PO-2026-0159', vendor: 'UltraTech Cement', qty: '200 Bags', date: '2026-01-11', status: 'pending_qc' },
    { grnNo: 'GRN-2026-0291', po: 'PO-2026-0160', vendor: 'JSW Steel', qty: '300 Bags', date: '2026-01-12', status: 'pending_qc' },
    { grnNo: 'GRN-2026-0292', po: 'PO-2026-0161', vendor: 'Local Bricks Supply', qty: '150 Bags', date: '2026-01-13', status: 'draft' },
  ];

  const pendingIssues = [
    { issueNo: 'ISS-2026-0123', activity: 'ACT-CON-010', qty: '10 MT', issuedTo: 'Subcontractor Alpha', status: 'approved' },
    { issueNo: 'ISS-2026-0124', activity: 'ACT-FIN-020', qty: '5 MT', issuedTo: 'Workforce', status: 'pending' },
    { issueNo: 'ISS-2026-0125', activity: 'ACT-ENG-050', qty: '3 MT', issuedTo: 'Subcontractor Beta', recoveryRate: 15, status: 'approved' },
  ];

  const recentTransfers = [
    { transferNo: 'TRF-2026-0045', from: 'store_001', to: 'store_003', dispatchDate: '2026-01-08', status: 'in_transit' },
    { transferNo: 'TRF-2026-0046', from: 'store_002', to: 'store_001', dispatchDate: '2026-01-12', status: 'received' },
    { transferNo: 'TRF-2026-0047', from: 'store_002', to: 'store_003', dispatchDate: '2026-01-14', status: 'partially_received' },
  ];

  const recentAdjustments = [
    { adjNo: 'ADJ-2026-0031', reason: 'expiry', qty: '5 Bags', date: '2026-01-13', status: 'approved' },
    { adjNo: 'ADJ-2026-0032', reason: 'shortage', qty: '2 MT', date: '2026-01-14', status: 'posted' },
    { adjNo: 'ADJ-2026-0033', reason: 'revaluation', qty: '10 Bags', date: '2026-01-15', status: 'pending' },
  ];

  const pvSessions = [
    { pvNo: 'PV-2026-0015', date: '2026-01-01', type: 'full', status: 'submitted', store: 'store_001' },
    { pvNo: 'PV-2026-0016', date: '2026-01-15', type: 'cycle', status: 'approved', store: 'store_002' },
  ];

  const cpLabels = [
    'GRN Document Requirement',
    'Over-Receipt Tolerance',
    'Issue WA Balance & Ack',
    'No Negative Stock',
    'Transfer Request & Gate Pass',
    'Unused Material Return',
    'PV Variance Threshold',
    'Maker-Checker Adjustments',
    'Slow/Dead Stock Monitor',
  ];

  const cpModes = ['OBSERVE', 'BLOCK', 'WARN', 'OFF', 'EXCEPTION', 'MONITOR', 'BLOCK', 'BLOCK', 'MONITOR'];

  const cpResults = ['PASS', 'BLOCK', 'EXCEPTION_REQUIRED', 'PASS', 'EXCEPTION_REQUIRED', 'WARN', 'BLOCK', 'BLOCK', 'WARN'];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stores & Inventory</h1>
              <p className="text-sm text-slate-500">Part 35 of 126 — Advanced Stores & Inventory</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[10px] font-medium ${ffStores ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {ffStores ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
          </div>
          <GateStatusCard protocolModes={cpModes} protocolResults={cpResults} cpLabels={cpLabels} />
        </div>
      </motion.div>

      <div className="px-6 py-3 border-t border-slate-100 border-b border-slate-100">
        <h2 className="text-[10px] font-medium text-slate-700 uppercase tracking-wider mb-2">Protocol Controls — Gate Status</h2>
        <div className="grid grid-cols-3 gap-2">
          {cpLabels.map((label, i) => (
                <div key={i} className={`p-2 rounded text-[8px] font-medium transition-colors ${cpModes[i] === 'ENFORCE' ? 'bg-red-100 text-red-800' : cpModes[i] === 'WARN' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                  <span className="block text-slate-900">CP-STR-{String(i + 1).padStart(2, '0')}</span>
                  <span className={`mt-1 text-${cpResults[i] === 'BLOCK' || cpResults[i] === 'EXCEPTION_REQUIRED' ? 'red' : cpResults[i] === 'WARN' ? 'amber' : 'green'}-700 font-medium`}>{cpResults[i]}</span>
                  <span className="text-[8px] text-slate-500 ml-1">{cpModes[i]}</span>
                </div>
              ))}
        </div>
      </div>

      {/* KPI Row */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-baseline gap-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Stock Value</p>
              <p className="text-3xl font-bold text-slate-900">₹{totalStockValue.toFixed(0)}L</p>
            </div>
            <StatusBadge status="active" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-baseline gap-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold text-slate-900">{totalLowStock}</p>
            </div>
            <StatusBadge status="warning" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-baseline gap-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Pending QC</p>
              <p className="text-3xl font-bold text-slate-900">{pendingQcCount}</p>
            </div>
            <StatusBadge status="pending" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-baseline gap-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">In-Transit</p>
              <p className="text-3xl font-bold text-slate-900">{inTransitCount}</p>
            </div>
            <StatusBadge status="action" />
          </div>
        </div>
      </motion.div>

      {/* Protocol Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
      >
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Protocol Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {cpLabels.map((label, i) => (
              <div key={i} className={`p-3 rounded-lg border ${cpModes[i] === 'ENFORCE' && cpResults[i] === 'BLOCK' ? 'bg-red-50 border-red-200' : cpModes[i] === 'WARN' && cpResults[i] === 'WARN' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-medium text-slate-700">CP-STR-{String(i + 1).padStart(2, '0')}</span>
                  <StatusBadge status={cpResults[i].toLowerCase()} size="sm" />
                </div>
                <p className="text-[9px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stores Register Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex gap-3" role="tablist">
            <button role="tab" aria-controls="tab-grn" className="flex-1 px-4 py-3 rounded-t-xl border-b-2 border-blue-600 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">GRN Register</button>
            <button role="tab" aria-controls="tab-issues" className="flex-1 px-4 py-3 rounded-t-xl border-b-2 border-transparent text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">Issues</button>
            <button role="tab" aria-controls="tab-returns" className="flex-1 px-4 py-3 rounded-t-xl border-b-2 border-transparent text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">Returns</button>
            <button role="tab" aria-controls="tab-transfers" className="flex-1 px-4 py-3 rounded-t-xl border-b-2 border-transparent text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">Transfers</button>
            <button role="tab" aria-controls="tab-adjustments" className="flex-1 px-4 py-3 rounded-t-xl border-b-2 border-transparent text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">Adjustments</button>
            <button role="tab" aria-controls="tab-physical" className="flex-1 px-4 py-3 rounded-t-xl border-b-2 border-transparent text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">Physical Verification</button>
          </div>
        </div>

        {/* GRN Register */}
        <div id="tab-grn" className="px-6 py-4 overflow-x-auto">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Goods Receipt Notes</h3>
          <div className="bg-slate-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Against PO</label><select className="w-full rounded border p-2 text-[10px]" /></div>
              <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Emergency GRN</label><select className="w-full rounded border p-2 text-[10px]" /></div>
              <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Challan No.</label><input type="text" className="w-full rounded border p-2 text-[10px]" /></div>
              <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Vehicle No.</label><input type="text" className="w-full rounded border p-2 text-[10px]" /></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {pendingGRNs.map((grn, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{grn.grnNo}</p>
                    <p className="text-[10px] text-slate-500">{grn.vendor} · {grn.qty}</p>
                    <p className="text-[10px] text-slate-500">PO: {grn.po} · Status: {grn.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={grn.status} />
                    <button className="text-blue-600 text-[10px] hover:underline">Post</button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <p className="text-[9px] text-slate-500">Challan: {grn.qty} received, QC: {grn.status}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-3">Total pending GRNs: {pendingGRNs.length}</p>
        </div>

        {/* Issues */}
        <div id="tab-issues" className="px-6 py-4 overflow-x-auto">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Stock Issues</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Issue Against</label><select className="w-full rounded border p-2 text-[10px]"><option>Active WA Line</option><option>Approved Requisition</option></select></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Issued To</label><select className="w-full rounded border p-2 text-[10px]"><option>Subcontractor (Free-Issue)</option><option>Subcontractor (Chargeable)</option><option>Workforce</option></select></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Chargeable</label><select className="w-full rounded border p-2 text-[10px]"><option value="true">Yes</option><option value="false">No</option></select></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Recovery Rate</label><input type="number" className="w-full rounded border p-2 text-[10px]" /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {pendingIssues.map((issue, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{issue.issueNo}</p>
                    <p className="text-[10px] text-slate-500">{issue.activity} · {issue.qty}</p>
                    <p className="text-[10px] text-slate-500">Issued To: {issue.issuedTo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={issue.status} />
                    <button className="text-blue-600 text-[10px] hover:underline">Issue</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-3">Total pending issues: {pendingIssues.length}</p>
        </div>

        {/* Returns */}
        <div id="tab-returns" className="px-6 py-4 overflow-x-auto">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Stock Returns</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">From</label><select className="w-full rounded border p-2 text-[10px]"><option>Site to Store</option><option>Store to Vendor (RTV)</option></select></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Issue Reference</label><input type="text" className="w-full rounded border p-2 text-[10px]" /></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Reason</label><select className="w-full rounded border p-2 text-[10px]"><option>Damage</option><option>Expiry</option><option>Shortage</option></select></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm"><p className="text-[10px] text-slate-500">No returns recorded</p></div>
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm"><p className="text-[10px] text-slate-500">No RTV recorded</p></div>
          </div>
        </div>

        {/* Transfers */}
        <div id="tab-transfers" className="px-6 py-4 overflow-x-auto">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Inter-Site Transfers</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">From Store</label><select className="w-full rounded border p-2 text-[10px]" /></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">To Store</label><select className="w-full rounded border p-2 text-[10px]" /></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Transfer Type</label><select className="w-full rounded border p-2 text-[10px]"><option>Inter-Site</option><option>Warehouse to Store</option></select></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Gate Pass</label><input type="text" className="w-full rounded border p-2 text-[10px]" /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {recentTransfers.map((transfer, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{transfer.transferNo}</p>
                    <p className="text-[10px] text-slate-500">{transfer.from} → {transfer.to}</p>
                    <p className="text-[10px] text-slate-500">Status: {transfer.status} · Dispatched: {transfer.dispatchDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={transfer.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adjustments */}
        <div id="tab-adjustments" className="px-6 py-4 overflow-x-auto">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Stock Adjustments</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Reason</label><select className="w-full rounded border p-2 text-[10px]"><option>Damage</option><option>Theft</option><option>Shortage</option><option>Excess</option><option>Expiry</option><option>Revaluation</option></select></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Approval Required</label><select className="w-full rounded border p-2 text-[10px]"><option>Store Keeper</option><option>Store In-charge</option><option>Project Manager</option></select></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {recentAdjustments.map((adj, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{adj.adjNo}</p>
                    <p className="text-[10px] text-slate-500">{adj.reason} · {adj.qty}</p>
                    <p className="text-[10px] text-slate-500">Status: {adj.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={adj.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Verification */}
        <div id="tab-physical" className="px-6 py-4 overflow-x-auto">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Physical Verification</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Type</label><select className="w-full rounded border p-2 text-[10px]"><option>Full</option><option>Cycle</option></select></div>
            <div><label className="text-[9px] font-medium text-slate-600 block mb-1">Store</label><select className="w-full rounded border p-2 text-[10px]"><option>store_001</option><option>store_002</option></select></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm"><p className="text-[10px] text-slate-500">Initiate physical count</p></div>
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm"><p className="text-[10px] text-slate-500">View PV history</p></div>
          </div>
        </div>
      </motion.div>

      {/* Ageing & Dead Stock */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
      >
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Stock Ageing Analysis</h2>
          <div className="grid grid-cols-2 gap-3">
            {AGEING_BUCKETS.map((bucket, i) => {
              const bucketData = ageingData.filter(a => a.bucket === bucket);
              const bucketValue = bucketData.reduce((sum, a) => sum + a.value, 0);
              const hasData = bucketData.length > 0;
              return (
                <div key={i} className={`p-3 rounded-lg border ${hasData ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-slate-700">{bucket}</span>
                    <span className="text-[10px] text-slate-500">{bucketData.length} materials</span>
                  </div>
                  <p className="text-[9px] text-slate-500">{hasData ? `₹${bucketValue / 1000}L` : '₹0.0L'}</p>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-slate-500 mt-2">Slow-moving threshold: 60 days</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Dead Stock Materials</h2>
          <div className="space-y-3">
            {deadStock.map((item, i) => (
              <div key={i} className="p-3 rounded-lg border-red-100 border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-900">{item.material}</span>
                  <span className="text-[10px] text-red-600 font-medium">{item.value}₹</span>
                </div>
                <p className="text-[9px] text-slate-500">Days since last movement: {item.daysSinceLastMovement}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500">No movement over N days triggers reorder alert</p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm mt-6"
      >
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
            {quickActions.map((action, i) => {
              const isStoresAction = /^create-(grn|issue|return|transfer|adjustment)$/.test(action.code);
              const isToolsAction = action.code === 'create-tool';
              const showAction = ffStores ? (isStoresAction || isToolsAction || action.code === 'request-exception') : false;
              if (showAction) {
                return (
                  <button key={i} className={`flex-1 rounded-lg border px-3 py-2 text-[10px] font-medium transition-colors ${action.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' : action.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' : action.color === 'cyan' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : action.color === 'teal' ? 'bg-teal-50 text-teal-700 border-teal-200' : ''}`}>
                    <span className="w-3 h-3 rounded-md mr-2">{action.icon}</span>
                    {action.label}
                  </button>
                );
              }
              return null;
            })}
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
      >
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Notifications</h3>
          <div className="space-y-2">
            <div>
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-[10px] text-slate-900 mt-0.5">GRN posted to procurement, accounts (for invoice matching)</p>
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-[10px] text-slate-900 mt-0.5">Low stock to store keeper + procurement</p>
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-[10px] text-slate-900 mt-0.5">QC pending to QA/QC</p>
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <p className="text-[10px] text-slate-900 mt-0.5">Transfer in transit to both stores</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Alert Summary</h3>
          <div className="space-y-2">
            <div>
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-medium text-slate-900">2 slow stock alerts</span>
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] text-slate-900">3 pending QC holds</span>
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-slate-900">All stocks above minimum</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StoreDashboard;