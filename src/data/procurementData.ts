// Part 34 — Advanced Procurement Data
// Procurement chain: Material Requirement → PR → RFQ → Quotation → Comparative Statement → Approval → PO → Dispatch (GRN in Part 35).
// Read-model sample data for the frontend baseline app; reuses project/site/material/vendor masters from Parts 4, 11, 20.

export interface ProcMrpRun {
  id: string;
  projectId: string;
  projectName: string;
  runAt: string;
  horizonDays: number;
  parametersJson: string;
  status: 'completed' | 'running' | 'failed';
  lineCount: number;
}

export interface ProcMrpLine {
  id: string;
  runId: string;
  materialId: string;
  materialName: string;
  requiredQty: number;
  requiredBy: string;
  stockAvailable: number;
  openPoQty: number;
  inTransitQty: number;
  netRequirement: number;
  suggestedPrQty: number;
  uomName: string;
  sourceActivity: string;
  sourceBoq: string;
  normPerUnit: number;
  wastagePct: number;
}

export interface ProcRequisitionLine {
  id: string;
  prId: string;
  materialId: string;
  materialName: string;
  serviceDesc?: string;
  qty: number;
  uomName: string;
  estimatedRate: number;
  wbsNodeId: string;
  costCodeId: string;
  activityId: string;
  spec?: string;
  preferredVendorId?: string;
  preferredVendorName?: string;
  balanceQtyToOrder: number;
}

export interface ProcRequisition {
  id: string;
  prNo: string;
  projectId: string;
  projectName: string;
  siteId: string;
  requestedByName: string;
  requiredBy: string;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  purpose: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PARTIALLY_ORDERED' | 'ORDERED' | 'CLOSED' | 'REJECTED' | 'CANCELLED';
  budgetCheckStatus: 'pass' | 'soft' | 'fail' | 'pending';
  planRef: string;
  planRefType: 'mrp' | 'wa' | 'daily_plan' | 'site_requirement';
  workflowInstanceId?: string;
  estimatedValue: number;
  createdAt: string;
  lines: ProcRequisitionLine[];
}

export interface ProcRfqLine {
  id: string;
  rfqId: string;
  prLineId: string;
  materialName: string;
  qty: number;
  uomName: string;
}

export interface ProcRfqVendor {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  sentAt?: string;
  channel: 'email' | 'portal' | 'manual';
  responseStatus: 'sent' | 'viewed' | 'responded' | 'declined' | 'pending';
}

export interface ProcRfq {
  id: string;
  rfqNo: string;
  projectId: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  terms: string;
  status: 'DRAFT' | 'ISSUED' | 'CLOSED' | 'CANCELLED';
  prNo: string;
  lines: ProcRfqLine[];
  vendors: ProcRfqVendor[];
}

export interface ProcQuotationLine {
  id: string;
  quotationId: string;
  rfqLineId: string;
  materialName: string;
  qty: number;
  rate: number;
  discountPct: number;
  gstRate: number;
  freight: number;
  otherCharges: number;
  landedRate: number;
  brand?: string;
  remarks?: string;
}

export interface ProcQuotation {
  id: string;
  quoteRef: string;
  rfqId: string;
  rfqNo: string;
  vendorId: string;
  vendorName: string;
  quoteDate: string;
  validity: string;
  deliveryDays: number;
  paymentTerms: string;
  freightTerms: string;
  gstInclusiveFlag: boolean;
  status: 'received' | 'pending' | 'declined';
  lines: ProcQuotationLine[];
}

export interface ProcCsLine {
  id: string;
  csId: string;
  rfqLineId: string;
  materialName: string;
  vendorId: string;
  vendorName: string;
  landedRate: number;
  rank: number;
  selectedQty: number;
  isL1: boolean;
}

export interface ProcComparativeStatement {
  id: string;
  csNo: string;
  rfqId: string;
  rfqNo: string;
  projectId: string;
  recommendedVendorSplitJson: string;
  justification: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  workflowInstanceId?: string;
  budgetRate?: number;
  lastPurchaseRate?: number;
  lines: ProcCsLine[];
}

export interface ProcPoLine {
  id: string;
  poId: string;
  prLineId?: string;
  materialId: string;
  materialName: string;
  description: string;
  qty: number;
  uomName: string;
  rate: number;
  discount: number;
  taxCodeId: string;
  amount: number;
  deliveredQty: number;
  invoicedQty: number;
  wbsNodeId: string;
  costCodeId: string;
}

export interface ProcPurchaseOrder {
  id: string;
  poNo: string;
  projectId: string;
  projectName: string;
  siteId: string;
  vendorId: string;
  vendorName: string;
  vendorState: string;
  deliveryState: string;
  poDate: string;
  deliveryScheduleJson: string;
  paymentTerms: string;
  priceBasis: 'FOR' | 'ex-works' | 'FOB';
  gstType: 'intra' | 'inter';
  totalBasic: number;
  totalTax: number;
  totalAmount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'RELEASED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CLOSED' | 'SHORT_CLOSED' | 'CANCELLED';
  amendmentNo: number;
  workflowInstanceId?: string;
  csId?: string;
  sourceType: 'cs' | 'direct' | 'rate_contract';
  directPoReason?: string;
  commitmentAmount: number;
  lines: ProcPoLine[];
}

export interface ProcPoAmendment {
  id: string;
  poId: string;
  poNo: string;
  amendmentNo: number;
  changesJson: string;
  reason: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
}

export interface ProcDispatch {
  id: string;
  poId: string;
  poNo: string;
  vendorInvoiceNo?: string;
  lrNo: string;
  vehicleNo: string;
  ewayBillNo?: string;
  dispatchDate: string;
  expectedArrival: string;
  arrived: boolean;
  linesSummary: string;
}

export interface ProcVendorPerformance {
  id: string;
  vendorId: string;
  vendorName: string;
  period: string;
  onTimePct: number;
  qualityAcceptPct: number;
  priceCompetitiveness: number;
  responsiveness: number;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  poCount: number;
}

export interface ProcPriceVariance {
  id: string;
  materialName: string;
  poNo: string;
  poRate: number;
  budgetRate: number;
  lastPurchaseRate: number;
  varianceVsBudgetPct: number;
  varianceVsLastPct: number;
  alert: boolean;
}

export interface ProcControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
  evidence: string;
  escalation: string;
}

export const procControlPoints: ProcControlPoint[] = [
  { id: 'CP-PROC-01', stage: 'PLAN', control: 'PR must reference MRP line, WA/daily-plan requirement or approved site requirement with activity & WBS', enforcement: 'EXCEPTION (UNPLANNED_WORK)', status: 'observe', evidence: 'plan ref', escalation: 'L2 PM' },
  { id: 'CP-PROC-02', stage: 'VERIFY', control: 'Budget check, stock check (no PR while free stock ≥ requirement at same/nearby store), duplicate PR/PO check (DR-04)', enforcement: 'EXCEPTION / BLOCK (duplicate)', status: 'observe', evidence: 'check results', escalation: 'L2' },
  { id: 'CP-PROC-03', stage: 'VERIFY', control: 'Minimum quotations above threshold; approved brand/spec; vendor not blacklisted', enforcement: 'EXCEPTION (SINGLE_SOURCE) / BLOCK (blacklist)', status: 'observe', evidence: 'quotations, submittal', escalation: 'L2 → L3' },
  { id: 'CP-PROC-04', stage: 'APPROVE', control: 'Non-L1 selection needs justification and higher approval', enforcement: 'EXCEPTION (NON_L1_SELECTION)', status: 'observe', evidence: 'CS note', escalation: 'L3' },
  { id: 'CP-PROC-05', stage: 'APPROVE', control: 'PO within approved CS rate and PR balance; price variance vs benchmark > 5 % needs approval', enforcement: 'EXCEPTION', status: 'observe', evidence: 'benchmark', escalation: 'L2 → L3' },
  { id: 'CP-PROC-06', stage: 'EXECUTE', control: 'Emergency purchase without PO allowed only via emergency path; regularise in 24 h', enforcement: 'EXCEPTION (EMERGENCY_PURCHASE)', status: 'observe', evidence: 'photo, bill', escalation: 'L3 if not regularised' },
  { id: 'CP-PROC-07', stage: 'MONITOR', control: 'Delivery overdue, split POs (DR-13)', enforcement: 'MONITOR', status: 'observe', evidence: 'findings', escalation: 'L2' },
  { id: 'CP-PROC-08', stage: 'CLOSE', control: 'PO short-close/cancel with reason; releases commitment', enforcement: 'BLOCK without reason', status: 'observe', evidence: 'reason', escalation: 'L2' }
];

// Sample MRP runs (requirement = Σ(activity remaining qty × norm × (1+wastage)) − stock − open POs − in-transit)
export const procMrpRuns: ProcMrpRun[] = [
  {
    id: 'mrrun_001',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    runAt: '2025-11-18T06:00:00Z',
    horizonDays: 30,
    parametersJson: '{"wastage_default_pct":3,"lead_time_buffer_days":7,"include_open_po":true,"include_in_transit":true}',
    status: 'completed',
    lineCount: 5
  }
];

export const procMrpLines: ProcMrpLine[] = [
  { id: 'mrline_001', runId: 'mrrun_001', materialId: 'mat_cement', materialName: 'OPC 53 Grade Cement', requiredQty: 1240, requiredBy: '2025-12-05', stockAvailable: 180, openPoQty: 400, inTransitQty: 0, netRequirement: 660, suggestedPrQty: 680, uomName: 'Bag', sourceActivity: 'ACT-CON-010', sourceBoq: 'BOQ-03.1', normPerUnit: 0.42, wastagePct: 2 },
  { id: 'mrline_002', runId: 'mrrun_001', materialId: 'mat_tmt', materialName: 'TMT Steel Fe500D 16mm', requiredQty: 86.5, requiredBy: '2025-12-02', stockAvailable: 22.4, openPoQty: 30, inTransitQty: 15, netRequirement: 19.1, suggestedPrQty: 20, uomName: 'MT', sourceActivity: 'ACT-CON-010', sourceBoq: 'BOQ-03.2', normPerUnit: 0.098, wastagePct: 3 },
  { id: 'mrline_003', runId: 'mrrun_001', materialId: 'mat_aggregate', materialName: 'Coarse Aggregate 20mm', requiredQty: 560, requiredBy: '2025-11-28', stockAvailable: 240, openPoQty: 0, inTransitQty: 0, netRequirement: 320, suggestedPrQty: 330, uomName: 'Cum', sourceActivity: 'ACT-CON-010', sourceBoq: 'BOQ-03.3', normPerUnit: 0.85, wastagePct: 2 },
  { id: 'mrline_004', runId: 'mrrun_001', materialId: 'mat_shutter', materialName: 'Shuttering Ply 12mm', requiredQty: 420, requiredBy: '2025-11-30', stockAvailable: 260, openPoQty: 0, inTransitQty: 0, netRequirement: 160, suggestedPrQty: 165, uomName: 'SqM', sourceActivity: 'ACT-FIN-020', sourceBoq: 'BOQ-04.2', normPerUnit: 2.4, wastagePct: 5 },
  { id: 'mrline_005', runId: 'mrrun_001', materialId: 'mat_binding', materialName: 'Binding Wire', requiredQty: 2.6, requiredBy: '2025-12-02', stockAvailable: 1.1, openPoQty: 0, inTransitQty: 0, netRequirement: 1.5, suggestedPrQty: 1.6, uomName: 'MT', sourceActivity: 'ACT-CON-010', sourceBoq: 'BOQ-03.2', normPerUnit: 0.0095, wastagePct: 2 }
];

// Sample PRs (lifecycle DRAFT → SUBMITTED → APPROVED → PARTIALLY_ORDERED → ORDERED → CLOSED | REJECTED | CANCELLED)
export const procRequisitions: ProcRequisition[] = [
  {
    id: 'pr_001',
    prNo: 'PR-2025-0118',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    requestedByName: 'Suresh Site Engineer',
    requiredBy: '2025-12-05',
    priority: 'high',
    purpose: 'Slab concrete pour — Zone B (from MRP run mrrun_001)',
    status: 'APPROVED',
    budgetCheckStatus: 'pass',
    planRef: 'mrrun_001',
    planRefType: 'mrp',
    workflowInstanceId: 'wfi_0451',
    estimatedValue: 612400,
    createdAt: '2025-11-18T09:30:00Z',
    lines: [
      { id: 'prl_001', prId: 'pr_001', materialId: 'mat_cement', materialName: 'OPC 53 Grade Cement', qty: 680, uomName: 'Bag', estimatedRate: 405, wbsNodeId: 'wbs_1.3', costCodeId: 'cc_mat_civil', activityId: 'ACT-CON-010', spec: 'IS 269 OPC 53', preferredVendorId: 'ven_001', preferredVendorName: 'Shakti Cement Agencies', balanceQtyToOrder: 680 },
      { id: 'prl_002', prId: 'pr_001', materialId: 'mat_aggregate', materialName: 'Coarse Aggregate 20mm', qty: 330, uomName: 'Cum', estimatedRate: 1450, wbsNodeId: 'wbs_1.3', costCodeId: 'cc_mat_civil', activityId: 'ACT-CON-010', balanceQtyToOrder: 330 },
      { id: 'prl_003', prId: 'pr_001', materialId: 'mat_binding', materialName: 'Binding Wire', qty: 1.6, uomName: 'MT', estimatedRate: 78000, wbsNodeId: 'wbs_1.3', costCodeId: 'cc_mat_steel', activityId: 'ACT-CON-010', balanceQtyToOrder: 1.6 }
    ]
  },
  {
    id: 'pr_002',
    prNo: 'PR-2025-0121',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    requestedByName: 'Suresh Site Engineer',
    requiredBy: '2025-12-02',
    priority: 'normal',
    purpose: 'Steel for next slab cycle — Zone C (from MRP run mrrun_001)',
    status: 'SUBMITTED',
    budgetCheckStatus: 'pass',
    planRef: 'mrrun_001',
    planRefType: 'mrp',
    workflowInstanceId: 'wfi_0462',
    estimatedValue: 1469000,
    createdAt: '2025-11-19T11:00:00Z',
    lines: [
      { id: 'prl_004', prId: 'pr_002', materialId: 'mat_tmt', materialName: 'TMT Steel Fe500D 16mm', qty: 20, uomName: 'MT', estimatedRate: 66500, wbsNodeId: 'wbs_1.3', costCodeId: 'cc_mat_steel', activityId: 'ACT-CON-010', spec: 'IS 1786 Fe500D', preferredVendorId: 'ven_002', preferredVendorName: 'JSW Authorised Distributor', balanceQtyToOrder: 20 }
    ]
  },
  {
    id: 'pr_003',
    prNo: 'PR-2025-0123',
    projectId: 'prj_003',
    projectName: 'Highway Bridge Phase 2',
    siteId: 'site_003',
    requestedByName: 'Kiran Store Keeper',
    requiredBy: '2025-12-10',
    priority: 'emergency',
    purpose: 'Pier 3 bearing pads replacement — urgent, no MRP line (site requirement)',
    status: 'APPROVED',
    budgetCheckStatus: 'soft',
    planRef: 'sr_0014',
    planRefType: 'site_requirement',
    workflowInstanceId: 'wfi_0470',
    estimatedValue: 385000,
    createdAt: '2025-11-20T08:15:00Z',
    lines: [
      { id: 'prl_005', prId: 'pr_003', materialId: 'mat_bearing', materialName: 'Elastomeric Bearing Pads 400x400', qty: 8, uomName: 'No', estimatedRate: 46000, wbsNodeId: 'wbs_2.2', costCodeId: 'cc_mat_brdg', activityId: 'ACT-BRD-014', spec: 'IRC:83 approved brand', preferredVendorId: 'ven_003', preferredVendorName: 'Metro Infra Supplies', balanceQtyToOrder: 8 }
    ]
  }
];

// Sample RFQs
export const procRfqs: ProcRfq[] = [
  {
    id: 'rfq_001',
    rfqNo: 'RFQ-2025-0031',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    issueDate: '2025-11-19',
    dueDate: '2025-11-24',
    terms: 'Delivery FOR site. Payment 30 days from GRN. Quote per item with brand, GST, freight. Validity 30 days.',
    status: 'CLOSED',
    prNo: 'PR-2025-0118',
    lines: [
      { id: 'rfl_001', rfqId: 'rfq_001', prLineId: 'prl_001', materialName: 'OPC 53 Grade Cement', qty: 680, uomName: 'Bag' },
      { id: 'rfl_002', rfqId: 'rfq_001', prLineId: 'prl_002', materialName: 'Coarse Aggregate 20mm', qty: 330, uomName: 'Cum' }
    ],
    vendors: [
      { id: 'rfdv_001', rfqId: 'rfq_001', vendorId: 'ven_001', vendorName: 'Shakti Cement Agencies', sentAt: '2025-11-19T10:00:00Z', channel: 'email', responseStatus: 'responded' },
      { id: 'rfdv_002', rfqId: 'rfq_001', vendorId: 'ven_002', vendorName: 'JSW Authorised Distributor', sentAt: '2025-11-19T10:00:00Z', channel: 'email', responseStatus: 'responded' },
      { id: 'rfdv_003', rfqId: 'rfq_001', vendorId: 'ven_004', vendorName: 'Gujarat Building Materials', sentAt: '2025-11-19T10:00:00Z', channel: 'portal', responseStatus: 'responded' }
    ]
  },
  {
    id: 'rfq_002',
    rfqNo: 'RFQ-2025-0032',
    projectId: 'prj_003',
    projectName: 'Highway Bridge Phase 2',
    issueDate: '2025-11-21',
    dueDate: '2025-11-26',
    terms: 'Delivery FOR bridge site. IRC:83 compliant bearing pads only. Approved brand certificate mandatory with quote.',
    status: 'ISSUED',
    prNo: 'PR-2025-0123',
    lines: [
      { id: 'rfl_003', rfqId: 'rfq_002', prLineId: 'prl_005', materialName: 'Elastomeric Bearing Pads 400x400', qty: 8, uomName: 'No' }
    ],
    vendors: [
      { id: 'rfdv_004', rfqId: 'rfq_002', vendorId: 'ven_003', vendorName: 'Metro Infra Supplies', sentAt: '2025-11-21T09:00:00Z', channel: 'portal', responseStatus: 'viewed' },
      { id: 'rfdv_005', rfqId: 'rfq_002', vendorId: 'ven_005', vendorName: 'Structural Bearings India', sentAt: '2025-11-21T09:00:00Z', channel: 'email', responseStatus: 'responded' }
    ]
  }
];

// Sample quotations — landed cost = basic − discount + freight + other (recoverable GST excluded from comparison, configurable)
export const procQuotations: ProcQuotation[] = [
  {
    id: 'qt_001',
    quoteRef: 'Q-SHAKTI-881',
    rfqId: 'rfq_001',
    rfqNo: 'RFQ-2025-0031',
    vendorId: 'ven_001',
    vendorName: 'Shakti Cement Agencies',
    quoteDate: '2025-11-22',
    validity: '2025-12-24',
    deliveryDays: 5,
    paymentTerms: '30 days from GRN',
    freightTerms: 'FOR site',
    gstInclusiveFlag: false,
    status: 'received',
    lines: [
      { id: 'qtl_001', quotationId: 'qt_001', rfqLineId: 'rfl_001', materialName: 'OPC 53 Grade Cement', qty: 680, rate: 398, discountPct: 1.5, gstRate: 28, freight: 22, otherCharges: 0, landedRate: 414.23, brand: 'UltraTech', remarks: 'Ex-works plus freight; 1.5% discount on basic' },
      { id: 'qtl_002', quotationId: 'qt_001', rfqLineId: 'rfl_002', materialName: 'Coarse Aggregate 20mm', qty: 330, rate: 1385, discountPct: 0, gstRate: 5, freight: 48, otherCharges: 0, landedRate: 1502.25, brand: '—', remarks: 'Royalty included' }
    ]
  },
  {
    id: 'qt_002',
    quoteRef: 'Q-JSW-2204',
    rfqId: 'rfq_001',
    rfqNo: 'RFQ-2025-0031',
    vendorId: 'ven_002',
    vendorName: 'JSW Authorised Distributor',
    quoteDate: '2025-11-23',
    validity: '2025-12-22',
    deliveryDays: 7,
    paymentTerms: 'Advance 20%, balance 30 days',
    freightTerms: 'FOR site',
    gstInclusiveFlag: false,
    status: 'received',
    lines: [
      { id: 'qtl_003', quotationId: 'qt_002', rfqLineId: 'rfl_001', materialName: 'OPC 53 Grade Cement', qty: 680, rate: 402, discountPct: 0, gstRate: 28, freight: 30, otherCharges: 0, landedRate: 432.00, brand: 'JSW', remarks: 'Cement via associate mill' },
      { id: 'qtl_004', quotationId: 'qt_002', rfqLineId: 'rfl_002', materialName: 'Coarse Aggregate 20mm', qty: 330, rate: 1420, discountPct: 0, gstRate: 5, freight: 40, otherCharges: 0, landedRate: 1531.00, brand: '—', remarks: '' }
    ]
  },
  {
    id: 'qt_003',
    quoteRef: 'Q-GBM-1140',
    rfqId: 'rfq_001',
    rfqNo: 'RFQ-2025-0031',
    vendorId: 'ven_004',
    vendorName: 'Gujarat Building Materials',
    quoteDate: '2025-11-24',
    validity: '2025-12-20',
    deliveryDays: 6,
    paymentTerms: '50% advance',
    freightTerms: 'FOR site',
    gstInclusiveFlag: false,
    status: 'received',
    lines: [
      { id: 'qtl_005', quotationId: 'qt_003', rfqLineId: 'rfl_001', materialName: 'OPC 53 Grade Cement', qty: 680, rate: 388, discountPct: 0, gstRate: 28, freight: 55, otherCharges: 12, landedRate: 455.00, brand: 'Ambuja', remarks: 'Lower basic but highest landed cost' },
      { id: 'qtl_006', quotationId: 'qt_003', rfqLineId: 'rfl_002', materialName: 'Coarse Aggregate 20mm', qty: 330, rate: 1395, discountPct: 0, gstRate: 5, freight: 52, otherCharges: 0, landedRate: 1516.95, brand: '—', remarks: '' }
    ]
  },
  {
    id: 'qt_004',
    quoteRef: 'Q-SBI-556',
    rfqId: 'rfq_002',
    rfqNo: 'RFQ-2025-0032',
    vendorId: 'ven_005',
    vendorName: 'Structural Bearings India',
    quoteDate: '2025-11-24',
    validity: '2025-12-24',
    deliveryDays: 21,
    paymentTerms: '30 days from delivery',
    freightTerms: 'FOR site',
    gstInclusiveFlag: false,
    status: 'received',
    lines: [
      { id: 'qtl_007', quotationId: 'qt_004', rfqLineId: 'rfl_003', materialName: 'Elastomeric Bearing Pads 400x400', qty: 8, rate: 42500, discountPct: 0, gstRate: 18, freight: 1800, otherCharges: 0, landedRate: 44300, brand: 'SBI (IRC:83)', remarks: 'Test certificate attached' }
    ]
  }
];

// Sample comparative statements — L1 per line and overall; split award allowed
export const procComparativeStatements: ProcComparativeStatement[] = [
  {
    id: 'cs_001',
    csNo: 'CS-2025-0012',
    rfqId: 'rfq_001',
    rfqNo: 'RFQ-2025-0031',
    projectId: 'prj_001',
    recommendedVendorSplitJson: '{"splits":[{"vendorId":"ven_001","lines":["rfl_001","rfl_002"],"reason":"L1 on both lines by landed cost"}]}',
    justification: '',
    status: 'APPROVED',
    workflowInstanceId: 'wfi_0477',
    budgetRate: 430,
    lastPurchaseRate: 421,
    lines: [
      { id: 'csl_001', csId: 'cs_001', rfqLineId: 'rfl_001', materialName: 'OPC 53 Grade Cement', vendorId: 'ven_001', vendorName: 'Shakti Cement Agencies', landedRate: 414.23, rank: 1, selectedQty: 680, isL1: true },
      { id: 'csl_002', csId: 'cs_001', rfqLineId: 'rfl_002', materialName: 'Coarse Aggregate 20mm', vendorId: 'ven_001', vendorName: 'Shakti Cement Agencies', landedRate: 1502.25, rank: 1, selectedQty: 330, isL1: true }
    ]
  }
];

// Sample POs (lifecycle DRAFT → SUBMITTED → APPROVED → RELEASED → PARTIALLY_RECEIVED → RECEIVED → CLOSED | SHORT_CLOSED | CANCELLED)
export const procPurchaseOrders: ProcPurchaseOrder[] = [
  {
    id: 'po_001',
    poNo: 'PO-2025-0204',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    vendorId: 'ven_001',
    vendorName: 'Shakti Cement Agencies',
    vendorState: 'Maharashtra',
    deliveryState: 'Maharashtra',
    poDate: '2025-11-25',
    deliveryScheduleJson: '[{"lineId":"qtl_001","qty":680,"deliverBy":"2025-12-01"},{"lineId":"qtl_002","qty":330,"deliverBy":"2025-12-01"}]',
    paymentTerms: '30 days from GRN',
    priceBasis: 'FOR',
    gstType: 'intra',
    totalBasic: 731410,
    totalTax: 195780.75,
    totalAmount: 927190.75,
    status: 'PARTIALLY_RECEIVED',
    amendmentNo: 0,
    workflowInstanceId: 'wfi_0480',
    csId: 'cs_001',
    sourceType: 'cs',
    commitmentAmount: 927190.75,
    lines: [
      { id: 'pol_001', poId: 'po_001', prLineId: 'prl_001', materialId: 'mat_cement', materialName: 'OPC 53 Grade Cement', description: 'OPC 53 Grade Cement, IS 269, brand UltraTech', qty: 680, uomName: 'Bag', rate: 414.23, discount: 0, taxCodeId: 'gst_28', amount: 281676.40, deliveredQty: 400, invoicedQty: 0, wbsNodeId: 'wbs_1.3', costCodeId: 'cc_mat_civil' },
      { id: 'pol_002', poId: 'po_001', prLineId: 'prl_002', materialId: 'mat_aggregate', materialName: 'Coarse Aggregate 20mm', description: 'Coarse Aggregate 20mm, royalty included', qty: 330, uomName: 'Cum', rate: 1502.25, discount: 0, taxCodeId: 'gst_5', amount: 495742.50, deliveredQty: 0, invoicedQty: 0, wbsNodeId: 'wbs_1.3', costCodeId: 'cc_mat_civil' }
    ]
  },
  {
    id: 'po_002',
    poNo: 'PO-2025-0198',
    projectId: 'prj_003',
    projectName: 'Highway Bridge Phase 2',
    siteId: 'site_003',
    vendorId: 'ven_005',
    vendorName: 'Structural Bearings India',
    vendorState: 'Haryana',
    deliveryState: 'Maharashtra',
    poDate: '2025-11-12',
    deliveryScheduleJson: '[{"lineId":"pol_003","qty":4,"deliverBy":"2025-11-28"}]',
    paymentTerms: '30 days from delivery',
    priceBasis: 'FOR',
    gstType: 'inter',
    totalBasic: 170000,
    totalTax: 31230,
    totalAmount: 201230,
    status: 'RELEASED',
    amendmentNo: 0,
    workflowInstanceId: 'wfi_0469',
    sourceType: 'direct',
    directPoReason: 'Emergency replacement of Pier 3 bearing pads — direct PO under rate contract RC-2025-004; regularised within 24h (CP-PROC-06)',
    commitmentAmount: 201230,
    lines: [
      { id: 'pol_003', poId: 'po_002', materialId: 'mat_bearing', materialName: 'Elastomeric Bearing Pads 400x400', description: 'Elastomeric Bearing Pads 400x400, IRC:83, batch test certificate', qty: 4, uomName: 'No', rate: 42500, discount: 0, taxCodeId: 'gst_18_igst', amount: 170000, deliveredQty: 0, invoicedQty: 0, wbsNodeId: 'wbs_2.2', costCodeId: 'cc_mat_brdg' }
    ]
  },
  {
    id: 'po_003',
    poNo: 'PO-2025-0187',
    projectId: 'prj_001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site_001',
    vendorId: 'ven_004',
    vendorName: 'Gujarat Building Materials',
    vendorState: 'Gujarat',
    deliveryState: 'Maharashtra',
    poDate: '2025-11-05',
    deliveryScheduleJson: '[{"lineId":"pol_004","qty":120,"deliverBy":"2025-11-20"}]',
    paymentTerms: '50% advance',
    priceBasis: 'FOR',
    gstType: 'inter',
    totalBasic: 186000,
    totalTax: 9300,
    totalAmount: 195300,
    status: 'SHORT_CLOSED',
    amendmentNo: 1,
    workflowInstanceId: 'wfi_0455',
    sourceType: 'cs',
    commitmentAmount: 0,
    lines: [
      { id: 'pol_004', poId: 'po_003', materialId: 'mat_shutter', materialName: 'Shuttering Ply 12mm', description: 'Shuttering Ply 12mm BWR grade', qty: 120, uomName: 'SqM', rate: 1550, discount: 0, taxCodeId: 'gst_12_igst', amount: 186000, deliveredQty: 80, invoicedQty: 80, wbsNodeId: 'wbs_1.4', costCodeId: 'cc_mat_fin' }
    ]
  }
];

export const procPoAmendments: ProcPoAmendment[] = [
  {
    id: 'amend_001',
    poId: 'po_003',
    poNo: 'PO-2025-0187',
    amendmentNo: 1,
    changesJson: '{"pol_004.qty":{"from":120,"to":80},"pol_004.amount":{"from":186000,"to":124000}}',
    reason: 'Site reduced shuttering requirement after design change; quantity reduced from 120 to 80 SqM, value revised and re-approved',
    status: 'APPROVED',
    createdAt: '2025-11-14T10:00:00Z'
  }
];

// Sample dispatches / ASN (GRN happens in Part 35)
export const procDispatches: ProcDispatch[] = [
  {
    id: 'disp_001',
    poId: 'po_001',
    poNo: 'PO-2025-0204',
    vendorInvoiceNo: 'SCA/25-26/0342',
    lrNo: 'LR-MUM-88231',
    vehicleNo: 'MH 04 AB 4471',
    ewayBillNo: 'EWB-2511-778812',
    dispatchDate: '2025-11-27',
    expectedArrival: '2025-11-29',
    arrived: true,
    linesSummary: 'OPC 53 Cement — 400 Bags (partial)'
  },
  {
    id: 'disp_002',
    poId: 'po_002',
    poNo: 'PO-2025-0198',
    vendorInvoiceNo: 'SBI/25-26/0119',
    lrNo: 'LR-DED-41207',
    vehicleNo: 'HR 26 DK 9012',
    ewayBillNo: 'EWB-2511-901245',
    dispatchDate: '2025-11-30',
    expectedArrival: '2025-12-03',
    arrived: false,
    linesSummary: 'Elastomeric Bearing Pads — 4 No'
  }
];

// Sample vendor performance scoring (delivery timeliness, quality acceptance, price competitiveness, responsiveness)
export const procVendorPerformance: ProcVendorPerformance[] = [
  { id: 'venperf_001', vendorId: 'ven_001', vendorName: 'Shakti Cement Agencies', period: '2025-Q3', onTimePct: 94, qualityAcceptPct: 98, priceCompetitiveness: 88, responsiveness: 92, score: 93, grade: 'A', poCount: 14 },
  { id: 'venperf_002', vendorId: 'ven_002', vendorName: 'JSW Authorised Distributor', period: '2025-Q3', onTimePct: 87, qualityAcceptPct: 99, priceCompetitiveness: 82, responsiveness: 85, score: 88, grade: 'B', poCount: 9 },
  { id: 'venperf_003', vendorId: 'ven_004', vendorName: 'Gujarat Building Materials', period: '2025-Q3', onTimePct: 72, qualityAcceptPct: 91, priceCompetitiveness: 79, responsiveness: 70, score: 77, grade: 'C', poCount: 11 }
];

// Sample price variance (PO rate vs budget rate vs last purchase rate; alert above threshold 5%)
export const procPriceVariance: ProcPriceVariance[] = [
  { id: 'pv_001', materialName: 'OPC 53 Grade Cement', poNo: 'PO-2025-0204', poRate: 414.23, budgetRate: 430, lastPurchaseRate: 421, varianceVsBudgetPct: -3.67, varianceVsLastPct: -1.61, alert: false },
  { id: 'pv_002', materialName: 'Coarse Aggregate 20mm', poNo: 'PO-2025-0204', poRate: 1502.25, budgetRate: 1450, lastPurchaseRate: 1478, varianceVsBudgetPct: 3.60, varianceVsLastPct: 1.64, alert: false },
  { id: 'pv_003', materialName: 'Elastomeric Bearing Pads 400x400', poNo: 'PO-2025-0198', poRate: 44300, budgetRate: 46000, lastPurchaseRate: 45200, varianceVsBudgetPct: -3.70, varianceVsLastPct: -1.99, alert: false }
];

export const procStats = {
  mrpRuns: 1,
  mrpLines: procMrpLines.length,
  openPrs: procRequisitions.filter(pr => pr.status === 'SUBMITTED' || pr.status === 'APPROVED' || pr.status === 'PARTIALLY_ORDERED').length,
  totalPrs: procRequisitions.length,
  rfqsIssued: procRfqs.filter(r => r.status === 'ISSUED' || r.status === 'CLOSED').length,
  quotations: procQuotations.length,
  csApproved: procComparativeStatements.filter(cs => cs.status === 'APPROVED').length,
  openPoValue: procPurchaseOrders.filter(po => !['CLOSED', 'SHORT_CLOSED', 'CANCELLED'].includes(po.status)).reduce((s, po) => s + po.commitmentAmount, 0),
  poCount: procPurchaseOrders.length,
  overdueDeliveries: procDispatches.filter(d => !d.arrived && new Date(d.expectedArrival).getTime() < new Date('2025-12-04').getTime()).length,
  vendorScoreAvg: Math.round(procVendorPerformance.reduce((s, v) => s + v.score, 0) / procVendorPerformance.length),
  savingsYtd: 384200,
  priceAlerts: procPriceVariance.filter(pv => pv.alert).length
};
