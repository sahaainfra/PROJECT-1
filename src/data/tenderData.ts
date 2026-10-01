// Part 22 — Tender Management Data

export interface Tender {
  id: string;
  tenderNo: string;
  nitNo: string;
  clientId: string;
  clientName: string;
  clientDepartment: string;
  portal: string;
  title: string;
  location: string;
  stateCode: string;
  workType: string;
  estimatedValue: number;
  completionPeriodMonths: number;
  bidType: 'single' | 'two-envelope';
  publishDate: string;
  prebidDate?: string;
  submissionDeadline: string;
  openingDate: string;
  validityDays: number;
  emdAmount: number;
  emdMode: 'dd' | 'bg' | 'online' | 'exemption';
  tenderFee: number;
  status: 'identified' | 'under_review' | 'bid_decision' | 'preparing' | 'submitted' | 'opened' | 'won' | 'lost' | 'cancelled';
  ownerId: string;
  ownerName: string;
  decisionStatus?: 'pending' | 'bid' | 'no_bid';
  createdAt: string;
  updatedAt: string;
  daysToDeadline: number;
  projectId?: string;
  contractId?: string;
  opportunityId?: string;
}

export interface EligibilityCriterion {
  id: string;
  tenderId: string;
  criterion: 'financial' | 'technical' | 'experience' | 'similar_work' | 'turnover' | 'net_worth' | 'equipment' | 'personnel';
  requirement: string;
  companyEvidenceDocId?: string;
  meets: 'Y' | 'N' | 'partial';
  notes?: string;
}

export interface PQScore {
  id: string;
  tenderId: string;
  criterionId: string;
  criterionName: string;
  maxScore: number;
  selfScore: number;
  remarks?: string;
}

export interface TenderDocument {
  id: string;
  tenderId: string;
  docType: 'NIT' | 'ITB' | 'GCC' | 'SCC' | 'specs' | 'drawings' | 'BOQ' | 'forms' | 'corrigendum';
  documentId: string;
  documentName: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Addendum {
  id: string;
  tenderId: string;
  addendumNo: number;
  date: string;
  summary: string;
  impactOnBOQ: boolean;
  impactOnDates: boolean;
  documentId: string;
  documentName: string;
}

export interface Clarification {
  id: string;
  tenderId: string;
  queryNo: string;
  clauseRef: string;
  query: string;
  sentDate: string;
  response?: string;
  responseDate?: string;
  impact?: string;
}

export interface SubmissionChecklist {
  id: string;
  tenderId: string;
  item: string;
  responsibleId: string;
  responsibleName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  documentId?: string;
  documentName?: string;
}

export interface EMD {
  id: string;
  tenderId: string;
  instrumentNo: string;
  bank: string;
  amount: number;
  issueDate: string;
  expiryDate: string;
  status: 'submitted' | 'returned' | 'forfeited' | 'converted_to_PBG';
  returnDate?: string;
}

export interface BidResult {
  id: string;
  tenderId: string;
  bidderName: string;
  quotedAmount: number;
  rank: number;
  technicalScore?: number;
  isUs: boolean;
}

export interface TenderDecision {
  id: string;
  tenderId: string;
  decision: 'bid' | 'no_bid';
  reasons: string[];
  riskSummary: string;
  strategicFit: number;
  capacity: number;
  eligibility: number;
  marginPotential: number;
  riskScore: number;
  approvedBy: string;
  approvedAt: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Tenders
export const tenders: Tender[] = [
  {
    id: 'tnd_001',
    tenderNo: 'TND-2026-001',
    nitNo: 'NIT/MRCL/2026/045',
    clientId: 'cl_002',
    clientName: 'Metro Rail Corporation',
    clientDepartment: 'Engineering',
    portal: 'CPP Portal',
    title: 'Construction of Metro Station - Phase 3',
    location: 'Bangalore, Karnataka',
    stateCode: '29',
    workType: 'Infrastructure - Metro',
    estimatedValue: 250000000,
    completionPeriodMonths: 36,
    bidType: 'two-envelope',
    publishDate: '2026-01-05',
    prebidDate: '2026-01-15',
    submissionDeadline: '2026-02-10T15:00:00Z',
    openingDate: '2026-02-10T16:00:00Z',
    validityDays: 120,
    emdAmount: 2500000,
    emdMode: 'bg',
    tenderFee: 10000,
    status: 'preparing',
    ownerId: 'usr_tnd_001',
    ownerName: 'Tender Manager',
    decisionStatus: 'bid',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-14T16:00:00Z',
    daysToDeadline: 27,
    opportunityId: 'opp_002'
  },
  {
    id: 'tnd_002',
    tenderNo: 'TND-2026-002',
    nitNo: 'NIT/NHAI/2026/012',
    clientId: 'cl_006',
    clientName: 'National Highways Authority',
    clientDepartment: 'Project Implementation',
    portal: 'NHAI Portal',
    title: 'Highway Expansion - NH-48 (Package 3)',
    location: 'Delhi-Jaipur',
    stateCode: '07',
    workType: 'Infrastructure - Highway',
    estimatedValue: 180000000,
    completionPeriodMonths: 24,
    bidType: 'single',
    publishDate: '2025-12-20',
    submissionDeadline: '2026-01-25T15:00:00Z',
    openingDate: '2026-01-25T16:00:00Z',
    validityDays: 90,
    emdAmount: 1800000,
    emdMode: 'online',
    tenderFee: 5000,
    status: 'submitted',
    ownerId: 'usr_tnd_002',
    ownerName: 'Senior Tender Executive',
    decisionStatus: 'bid',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2026-01-24T14:00:00Z',
    daysToDeadline: 0
  },
  {
    id: 'tnd_003',
    tenderNo: 'TND-2026-003',
    nitNo: 'NIT/PWD/2026/078',
    clientId: 'cl_007',
    clientName: 'Public Works Department',
    clientDepartment: 'Buildings',
    portal: 'e-Procurement',
    title: 'Construction of Government Office Complex',
    location: 'Mumbai, Maharashtra',
    stateCode: '27',
    workType: 'Commercial - Office',
    estimatedValue: 95000000,
    completionPeriodMonths: 18,
    bidType: 'single',
    publishDate: '2026-01-10',
    submissionDeadline: '2026-02-05T15:00:00Z',
    openingDate: '2026-02-05T16:00:00Z',
    validityDays: 90,
    emdAmount: 950000,
    emdMode: 'dd',
    tenderFee: 3000,
    status: 'bid_decision',
    ownerId: 'usr_tnd_001',
    ownerName: 'Tender Manager',
    decisionStatus: 'pending',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-13T11:00:00Z',
    daysToDeadline: 22
  },
  {
    id: 'tnd_004',
    tenderNo: 'TND-2025-045',
    nitNo: 'NIT/MRCL/2025/112',
    clientId: 'cl_002',
    clientName: 'Metro Rail Corporation',
    clientDepartment: 'Engineering',
    portal: 'CPP Portal',
    title: 'Metro Station Construction - Phase 2',
    location: 'Bangalore, Karnataka',
    stateCode: '29',
    workType: 'Infrastructure - Metro',
    estimatedValue: 220000000,
    completionPeriodMonths: 30,
    bidType: 'two-envelope',
    publishDate: '2025-10-15',
    submissionDeadline: '2025-11-20T15:00:00Z',
    openingDate: '2025-11-20T16:00:00Z',
    validityDays: 120,
    emdAmount: 2200000,
    emdMode: 'bg',
    tenderFee: 10000,
    status: 'won',
    ownerId: 'usr_tnd_001',
    ownerName: 'Tender Manager',
    decisionStatus: 'bid',
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-12-15T14:00:00Z',
    daysToDeadline: 0,
    projectId: 'prj_002',
    contractId: 'cont_001',
    opportunityId: 'opp_006'
  },
  {
    id: 'tnd_005',
    tenderNo: 'TND-2025-042',
    nitNo: 'NIT/DTCP/2025/089',
    clientId: 'cl_008',
    clientName: 'Directorate of Town Planning',
    clientDepartment: 'Urban Development',
    portal: 'State Portal',
    title: 'Smart City Infrastructure Development',
    location: 'Pune, Maharashtra',
    stateCode: '27',
    workType: 'Infrastructure - Smart City',
    estimatedValue: 150000000,
    completionPeriodMonths: 24,
    bidType: 'single',
    publishDate: '2025-09-20',
    submissionDeadline: '2025-10-25T15:00:00Z',
    openingDate: '2025-10-25T16:00:00Z',
    validityDays: 90,
    emdAmount: 1500000,
    emdMode: 'online',
    tenderFee: 7500,
    status: 'lost',
    ownerId: 'usr_tnd_002',
    ownerName: 'Senior Tender Executive',
    decisionStatus: 'bid',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-11-05T11:00:00Z',
    daysToDeadline: 0
  }
];

// Sample Eligibility Criteria
export const eligibilityCriteria: EligibilityCriterion[] = [
  {
    id: 'elig_001',
    tenderId: 'tnd_001',
    criterion: 'turnover',
    requirement: 'Average annual turnover of ₹200 Cr in last 3 years',
    companyEvidenceDocId: 'doc_turnover_cert',
    meets: 'Y',
    notes: 'FY23: ₹245 Cr, FY24: ₹268 Cr, FY25: ₹285 Cr'
  },
  {
    id: 'elig_002',
    tenderId: 'tnd_001',
    criterion: 'similar_work',
    requirement: 'Successfully completed at least 2 metro/rail projects of value ≥ ₹150 Cr',
    companyEvidenceDocId: 'doc_work_completion',
    meets: 'Y',
    notes: 'Completed 3 metro projects: Chennai Metro (₹180 Cr), Delhi Metro (₹220 Cr), Mumbai Metro (₹195 Cr)'
  },
  {
    id: 'elig_003',
    tenderId: 'tnd_001',
    criterion: 'net_worth',
    requirement: 'Net worth of at least ₹50 Cr',
    companyEvidenceDocId: 'doc_net_worth_cert',
    meets: 'Y',
    notes: 'Net worth as per FY25 audited accounts: ₹68 Cr'
  },
  {
    id: 'elig_004',
    tenderId: 'tnd_001',
    criterion: 'equipment',
    requirement: 'Own or leased equipment: TBM, cranes, batching plant',
    meets: 'partial',
    notes: 'Have cranes and batching plant. TBM to be leased from M/s Equipment Suppliers Ltd.'
  },
  {
    id: 'elig_005',
    tenderId: 'tnd_001',
    criterion: 'personnel',
    requirement: 'Key personnel: Project Manager (15+ yrs exp), Site Engineers (5)',
    companyEvidenceDocId: 'doc_personnel_cv',
    meets: 'Y',
    notes: 'PM: Rajesh Kumar (18 yrs), 6 Site Engineers identified'
  }
];

// Sample PQ Scores
export const pqScores: PQScore[] = [
  {
    id: 'pq_001',
    tenderId: 'tnd_001',
    criterionId: 'crit_001',
    criterionName: 'Financial Capability',
    maxScore: 30,
    selfScore: 28,
    remarks: 'Strong financial position with turnover exceeding requirement by 40%'
  },
  {
    id: 'pq_002',
    tenderId: 'tnd_001',
    criterionId: 'crit_002',
    criterionName: 'Technical Experience',
    maxScore: 40,
    selfScore: 36,
    remarks: '3 similar projects completed successfully with good performance ratings'
  },
  {
    id: 'pq_003',
    tenderId: 'tnd_001',
    criterionId: 'crit_003',
    criterionName: 'Equipment & Resources',
    maxScore: 20,
    selfScore: 16,
    remarks: 'Most equipment owned, TBM to be leased (slight deduction)'
  },
  {
    id: 'pq_004',
    tenderId: 'tnd_001',
    criterionId: 'crit_004',
    criterionName: 'Key Personnel',
    maxScore: 10,
    selfScore: 10,
    remarks: 'Experienced team with all required qualifications'
  }
];

// Sample Documents
export const tenderDocuments: TenderDocument[] = [
  {
    id: 'doc_001',
    tenderId: 'tnd_001',
    docType: 'NIT',
    documentId: 'nit_001',
    documentName: 'Notice Inviting Tender.pdf',
    version: 1,
    uploadedAt: '2026-01-05T10:30:00Z',
    uploadedBy: 'usr_tnd_001'
  },
  {
    id: 'doc_002',
    tenderId: 'tnd_001',
    docType: 'BOQ',
    documentId: 'boq_001',
    documentName: 'Bill of Quantities.xlsx',
    version: 2,
    uploadedAt: '2026-01-12T14:00:00Z',
    uploadedBy: 'usr_tnd_001'
  },
  {
    id: 'doc_003',
    tenderId: 'tnd_001',
    docType: 'drawings',
    documentId: 'dwg_001',
    documentName: 'Structural Drawings.zip',
    version: 1,
    uploadedAt: '2026-01-05T11:00:00Z',
    uploadedBy: 'usr_tnd_001'
  }
];

// Sample Addenda
export const addenda: Addendum[] = [
  {
    id: 'add_001',
    tenderId: 'tnd_001',
    addendumNo: 1,
    date: '2026-01-12',
    summary: 'Extension of submission deadline by 5 days due to multiple queries received',
    impactOnBOQ: false,
    impactOnDates: true,
    documentId: 'add_doc_001',
    documentName: 'Addendum-1.pdf'
  },
  {
    id: 'add_002',
    tenderId: 'tnd_001',
    addendumNo: 2,
    date: '2026-01-18',
    summary: 'Revision in BOQ item quantities for foundation work. Estimate revision required.',
    impactOnBOQ: true,
    impactOnDates: false,
    documentId: 'add_doc_002',
    documentName: 'Addendum-2.pdf'
  }
];

// Sample Clarifications
export const clarifications: Clarification[] = [
  {
    id: 'clar_001',
    tenderId: 'tnd_001',
    queryNo: 'Q-001',
    clauseRef: 'Clause 4.2.1',
    query: 'Whether TBM can be leased or must be owned?',
    sentDate: '2026-01-14',
    response: 'TBM can be leased with valid lease agreement for the project duration',
    responseDate: '2026-01-16',
    impact: 'No impact on estimate'
  },
  {
    id: 'clar_002',
    tenderId: 'tnd_001',
    queryNo: 'Q-002',
    clauseRef: 'Clause 6.3',
    query: 'Clarification on liquidated damages calculation methodology',
    sentDate: '2026-01-14',
    response: 'LD calculated at 0.5% per week of delay, max 10% of contract value',
    responseDate: '2026-01-16',
    impact: 'Risk consideration in pricing'
  }
];

// Sample Submission Checklist
export const submissionChecklist: SubmissionChecklist[] = [
  {
    id: 'chk_001',
    tenderId: 'tnd_001',
    item: 'Technical Bid Preparation',
    responsibleId: 'usr_est_001',
    responsibleName: 'Estimation Engineer',
    dueDate: '2026-02-05',
    status: 'in_progress'
  },
  {
    id: 'chk_002',
    tenderId: 'tnd_001',
    item: 'Financial Bid Preparation',
    responsibleId: 'usr_cm_001',
    responsibleName: 'Commercial Manager',
    dueDate: '2026-02-07',
    status: 'pending'
  },
  {
    id: 'chk_003',
    tenderId: 'tnd_001',
    item: 'EMD Arrangement',
    responsibleId: 'usr_finance_001',
    responsibleName: 'Finance Manager',
    dueDate: '2026-02-03',
    status: 'completed',
    documentId: 'emd_bg_001',
    documentName: 'EMD_Bank_Guarantee.pdf'
  },
  {
    id: 'chk_004',
    tenderId: 'tnd_001',
    item: 'Document Scanning & Upload',
    responsibleId: 'usr_tnd_002',
    responsibleName: 'Tender Executive',
    dueDate: '2026-02-09',
    status: 'pending'
  },
  {
    id: 'chk_005',
    tenderId: 'tnd_001',
    item: 'Final Review & Approval',
    responsibleId: 'usr_cm_001',
    responsibleName: 'Commercial Manager',
    dueDate: '2026-02-09',
    status: 'pending'
  }
];

// Sample EMD
export const emds: EMD[] = [
  {
    id: 'emd_001',
    tenderId: 'tnd_001',
    instrumentNo: 'BG/SBI/2026/1234',
    bank: 'State Bank of India',
    amount: 2500000,
    issueDate: '2026-02-01',
    expiryDate: '2026-08-01',
    status: 'submitted'
  },
  {
    id: 'emd_002',
    tenderId: 'tnd_002',
    instrumentNo: 'EMD/ONLINE/2026/5678',
    bank: 'HDFC Bank',
    amount: 1800000,
    issueDate: '2026-01-20',
    expiryDate: '2026-07-20',
    status: 'submitted'
  },
  {
    id: 'emd_003',
    tenderId: 'tnd_004',
    instrumentNo: 'BG/ICICI/2025/9012',
    bank: 'ICICI Bank',
    amount: 2200000,
    issueDate: '2025-11-15',
    expiryDate: '2026-05-15',
    status: 'converted_to_PBG',
    returnDate: '2025-12-20'
  },
  {
    id: 'emd_004',
    tenderId: 'tnd_005',
    instrumentNo: 'EMD/ONLINE/2025/3456',
    bank: 'Axis Bank',
    amount: 1500000,
    issueDate: '2025-10-20',
    expiryDate: '2026-04-20',
    status: 'returned',
    returnDate: '2025-11-10'
  }
];

// Sample Bid Results
export const bidResults: BidResult[] = [
  {
    id: 'bid_001',
    tenderId: 'tnd_004',
    bidderName: 'Acme Construction Ltd.',
    quotedAmount: 215000000,
    rank: 1,
    technicalScore: 92,
    isUs: true
  },
  {
    id: 'bid_002',
    tenderId: 'tnd_004',
    bidderName: 'L&T Construction',
    quotedAmount: 228000000,
    rank: 2,
    technicalScore: 88,
    isUs: false
  },
  {
    id: 'bid_003',
    tenderId: 'tnd_004',
    bidderName: 'Shapoorji Pallonji',
    quotedAmount: 235000000,
    rank: 3,
    technicalScore: 85,
    isUs: false
  },
  {
    id: 'bid_004',
    tenderId: 'tnd_005',
    bidderName: 'Acme Construction Ltd.',
    quotedAmount: 148000000,
    rank: 3,
    technicalScore: 78,
    isUs: true
  },
  {
    id: 'bid_005',
    tenderId: 'tnd_005',
    bidderName: 'Competitor A',
    quotedAmount: 135000000,
    rank: 1,
    technicalScore: 82,
    isUs: false
  },
  {
    id: 'bid_006',
    tenderId: 'tnd_005',
    bidderName: 'Competitor B',
    quotedAmount: 142000000,
    rank: 2,
    technicalScore: 80,
    isUs: false
  }
];

// Sample Tender Decisions
export const tenderDecisions: TenderDecision[] = [
  {
    id: 'dec_001',
    tenderId: 'tnd_001',
    decision: 'bid',
    reasons: ['Strategic client relationship', 'Strong technical capability', 'Good margin potential'],
    riskSummary: 'Medium risk - TBM leasing required, but experienced team available',
    strategicFit: 9,
    capacity: 8,
    eligibility: 9,
    marginPotential: 8,
    riskScore: 6,
    approvedBy: 'usr_mgmt_001',
    approvedAt: '2026-01-08T14:00:00Z'
  },
  {
    id: 'dec_002',
    tenderId: 'tnd_004',
    decision: 'bid',
    reasons: ['Repeat client', 'Proven capability', 'Strategic importance'],
    riskSummary: 'Low risk - similar to previously completed projects',
    strategicFit: 10,
    capacity: 9,
    eligibility: 10,
    marginPotential: 7,
    riskScore: 8,
    approvedBy: 'usr_mgmt_001',
    approvedAt: '2025-10-20T10:00:00Z'
  },
  {
    id: 'dec_003',
    tenderId: 'tnd_005',
    decision: 'bid',
    reasons: ['New market entry', 'Good learning opportunity'],
    riskSummary: 'High risk - new work type, limited experience',
    strategicFit: 7,
    capacity: 6,
    eligibility: 8,
    marginPotential: 6,
    riskScore: 5,
    approvedBy: 'usr_mgmt_001',
    approvedAt: '2025-09-25T11:00:00Z'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-TND-01',
    stage: 'PLAN',
    control: 'Bid/no-bid decision approved before estimation effort beyond threshold hours',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-TND-02',
    stage: 'VERIFY',
    control: 'Submission checklist complete before submission lock',
    enforcement: 'EXCEPTION',
    status: 'observe'
  },
  {
    id: 'CP-TND-03',
    stage: 'MONITOR',
    control: 'Deadlines at 7/3/1 days and 6 h; EMD expiry',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-TND-04',
    stage: 'CLOSE',
    control: 'Lost/cancelled tender: EMD refund tracked to closure',
    enforcement: 'MONITOR',
    status: 'observe'
  }
];

// Statistics
export const tenderStats = {
  totalTenders: tenders.length,
  activeTenders: tenders.filter(t => !['won', 'lost', 'cancelled'].includes(t.status)).length,
  wonTenders: tenders.filter(t => t.status === 'won').length,
  lostTenders: tenders.filter(t => t.status === 'lost').length,
  winRate: ((tenders.filter(t => t.status === 'won').length / 
    tenders.filter(t => ['won', 'lost'].includes(t.status)).length) * 100).toFixed(1),
  totalBidValue: tenders.reduce((sum, t) => sum + t.estimatedValue, 0),
  wonValue: tenders.filter(t => t.status === 'won').reduce((sum, t) => sum + t.estimatedValue, 0),
  pendingEMD: emds.filter(e => e.status === 'submitted').reduce((sum, e) => sum + e.amount, 0),
  urgentDeadlines: tenders.filter(t => t.daysToDeadline > 0 && t.daysToDeadline <= 7).length
};

// Pipeline stages
export const pipelineStages = [
  { stage: 'identified', label: 'Identified', color: 'slate', count: 0 },
  { stage: 'under_review', label: 'Under Review', color: 'blue', count: 0 },
  { stage: 'bid_decision', label: 'Bid Decision', color: 'indigo', count: 0 },
  { stage: 'preparing', label: 'Preparing', color: 'purple', count: 0 },
  { stage: 'submitted', label: 'Submitted', color: 'amber', count: 0 },
  { stage: 'opened', label: 'Opened', color: 'orange', count: 0 },
  { stage: 'won', label: 'Won', color: 'green', count: 0 },
  { stage: 'lost', label: 'Lost', color: 'red', count: 0 }
];

// Calculate pipeline counts
tenders.forEach(t => {
  const stage = pipelineStages.find(s => s.stage === t.status);
  if (stage) stage.count++;
});
