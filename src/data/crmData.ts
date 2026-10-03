// Part 21 — CRM & Business Development Management Data

export interface Lead {
  id: string;
  leadNo: string;
  source: 'referral' | 'portal' | 'tender_site' | 'event' | 'website' | 'cold_call' | 'other';
  companyName: string;
  clientId?: string;
  contactName: string;
  phone: string;
  email: string;
  location: string;
  workType: string;
  estimatedValue: number;
  ownerId: string;
  ownerName: string;
  departmentId: string;
  status: 'new' | 'qualified' | 'disqualified' | 'converted';
  disqualifyReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  enquiryNo: string;
  leadId: string;
  clientId: string;
  clientName: string;
  subject: string;
  scopeSummary: string;
  documents: string[];
  receivedDate: string;
  responseDue: string;
  ownerId: string;
  ownerName: string;
  status: 'pending' | 'in_progress' | 'responded' | 'closed';
}

export interface Opportunity {
  id: string;
  oppNo: string;
  clientId: string;
  clientName: string;
  enquiryId?: string;
  title: string;
  workType: string;
  location: string;
  estimatedValue: number;
  probabilityPct: number;
  weightedValue: number;
  expectedTenderDate?: string;
  expectedAwardDate?: string;
  stage: 'lead' | 'enquiry' | 'opportunity' | 'tender' | 'estimation' | 'bid' | 'negotiation' | 'awarded' | 'lost' | 'dropped';
  ownerId: string;
  ownerName: string;
  departmentId: string;
  competitors: string[];
  lostReasonCode?: string;
  lostNotes?: string;
  tenderId?: string;
  projectId?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  daysInStage: number;
}

export interface Contact {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  influence: 'decision_maker' | 'influencer' | 'user';
  isActive: boolean;
}

export interface Interaction {
  id: string;
  entityType: 'lead' | 'opportunity' | 'client';
  entityId: string;
  type: 'call' | 'meeting' | 'email' | 'site_visit' | 'presentation' | 'whatsapp';
  datetime: string;
  participants: string[];
  summary: string;
  nextAction?: string;
  nextActionDate?: string;
  ownerId: string;
  ownerName: string;
  communicationRef?: string;
}

export interface Negotiation {
  id: string;
  opportunityId: string;
  roundNo: number;
  ourPrice: number;
  clientCounter: number;
  discountPct: number;
  termsChanged: string[];
  outcome: 'accepted' | 'counter' | 'rejected' | 'pending';
  date: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// Sample Leads
export const leads: Lead[] = [
  {
    id: 'lead_001',
    leadNo: 'LD-2026-001',
    source: 'referral',
    companyName: 'Sunrise Developers',
    clientId: 'cl_001',
    contactName: 'Mr. Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@sunrise.com',
    location: 'Mumbai, Maharashtra',
    workType: 'Residential High-Rise',
    estimatedValue: 85000000,
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta',
    departmentId: 'dept_bd',
    status: 'qualified',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-12T14:00:00Z'
  },
  {
    id: 'lead_002',
    leadNo: 'LD-2026-002',
    source: 'tender_site',
    companyName: 'Metro Rail Corporation',
    contactName: 'Mr. Amit Patel',
    phone: '+91 98765 43211',
    email: 'amit.patel@metrorail.gov.in',
    location: 'Bangalore, Karnataka',
    workType: 'Infrastructure - Metro',
    estimatedValue: 250000000,
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh',
    departmentId: 'dept_bd',
    status: 'new',
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z'
  },
  {
    id: 'lead_003',
    leadNo: 'LD-2026-003',
    source: 'website',
    companyName: 'Green Valley Industries',
    contactName: 'Ms. Sneha Kulkarni',
    phone: '+91 98765 43212',
    email: 'sneha@greenvalley.com',
    location: 'Pune, Maharashtra',
    workType: 'Industrial Plant',
    estimatedValue: 45000000,
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta',
    departmentId: 'dept_bd',
    status: 'converted',
    createdAt: '2026-01-05T11:00:00Z',
    updatedAt: '2026-01-08T16:00:00Z'
  },
  {
    id: 'lead_004',
    leadNo: 'LD-2026-004',
    source: 'event',
    companyName: 'Heritage Hotels Ltd.',
    contactName: 'Mr. Karan Malhotra',
    phone: '+91 98765 43213',
    email: 'karan@heritagehotels.com',
    location: 'Jaipur, Rajasthan',
    workType: 'Hospitality - Hotel',
    estimatedValue: 120000000,
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh',
    departmentId: 'dept_bd',
    status: 'qualified',
    createdAt: '2026-01-08T15:00:00Z',
    updatedAt: '2026-01-11T10:00:00Z'
  },
  {
    id: 'lead_005',
    leadNo: 'LD-2026-005',
    source: 'cold_call',
    companyName: 'ABC Textiles',
    contactName: 'Mr. Suresh Jain',
    phone: '+91 98765 43214',
    email: 'suresh@abctextiles.com',
    location: 'Surat, Gujarat',
    workType: 'Industrial - Factory',
    estimatedValue: 25000000,
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta',
    departmentId: 'dept_bd',
    status: 'disqualified',
    disqualifyReason: 'Budget constraints - project postponed',
    createdAt: '2026-01-03T14:00:00Z',
    updatedAt: '2026-01-06T11:00:00Z'
  }
];

// Sample Enquiries
export const enquiries: Enquiry[] = [
  {
    id: 'enq_001',
    enquiryNo: 'ENQ-2026-001',
    leadId: 'lead_001',
    clientId: 'cl_001',
    clientName: 'Sunrise Developers',
    subject: 'Construction of G+25 Residential Tower',
    scopeSummary: 'Complete civil, structural and finishing work for 25-floor residential tower with 100 apartments',
    documents: ['scope_document.pdf', 'site_plan.dwg'],
    receivedDate: '2026-01-12T10:00:00Z',
    responseDue: '2026-01-19T10:00:00Z',
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta',
    status: 'in_progress'
  },
  {
    id: 'enq_002',
    enquiryNo: 'ENQ-2026-002',
    leadId: 'lead_004',
    clientId: 'cl_004',
    clientName: 'Heritage Hotels Ltd.',
    subject: '5-Star Hotel Construction',
    scopeSummary: 'Construction of 150-room luxury hotel with banquet halls, swimming pool and landscaping',
    documents: ['architectural_drawings.zip', 'boq_preliminary.xlsx'],
    receivedDate: '2026-01-11T14:00:00Z',
    responseDue: '2026-01-18T14:00:00Z',
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh',
    status: 'responded'
  }
];

// Sample Opportunities
export const opportunities: Opportunity[] = [
  {
    id: 'opp_001',
    oppNo: 'OPP-2026-001',
    clientId: 'cl_001',
    clientName: 'Sunrise Developers',
    enquiryId: 'enq_001',
    title: 'G+25 Residential Tower - Riverside',
    workType: 'Residential High-Rise',
    location: 'Mumbai, Maharashtra',
    estimatedValue: 85000000,
    probabilityPct: 70,
    weightedValue: 59500000,
    expectedTenderDate: '2026-02-01',
    expectedAwardDate: '2026-03-15',
    stage: 'tender',
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta',
    departmentId: 'dept_bd',
    competitors: ['L&T Construction', 'Shapoorji Pallonji'],
    approvalStatus: 'approved',
    createdAt: '2026-01-12T15:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    daysInStage: 3
  },
  {
    id: 'opp_002',
    oppNo: 'OPP-2026-002',
    clientId: 'cl_002',
    clientName: 'Metro Rail Corporation',
    title: 'Metro Station Construction - Phase 3',
    workType: 'Infrastructure - Metro',
    location: 'Bangalore, Karnataka',
    estimatedValue: 250000000,
    probabilityPct: 50,
    weightedValue: 125000000,
    expectedTenderDate: '2026-02-15',
    expectedAwardDate: '2026-04-30',
    stage: 'opportunity',
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh',
    departmentId: 'dept_bd',
    competitors: ['IRB Infrastructure', 'Dilip Buildcon', 'HG Infra'],
    approvalStatus: 'approved',
    createdAt: '2026-01-14T10:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
    daysInStage: 1
  },
  {
    id: 'opp_003',
    oppNo: 'OPP-2026-003',
    clientId: 'cl_003',
    clientName: 'Green Valley Industries',
    enquiryId: 'enq_003',
    title: 'Industrial Plant - Phase 2 Expansion',
    workType: 'Industrial Plant',
    location: 'Pune, Maharashtra',
    estimatedValue: 45000000,
    probabilityPct: 85,
    weightedValue: 38250000,
    expectedTenderDate: '2026-01-25',
    expectedAwardDate: '2026-02-20',
    stage: 'negotiation',
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta',
    departmentId: 'dept_bd',
    competitors: ['Tata Projects'],
    approvalStatus: 'approved',
    createdAt: '2026-01-08T16:00:00Z',
    updatedAt: '2026-01-15T11:00:00Z',
    daysInStage: 7
  },
  {
    id: 'opp_004',
    oppNo: 'OPP-2026-004',
    clientId: 'cl_004',
    clientName: 'Heritage Hotels Ltd.',
    enquiryId: 'enq_002',
    title: '5-Star Hotel Construction',
    workType: 'Hospitality - Hotel',
    location: 'Jaipur, Rajasthan',
    estimatedValue: 120000000,
    probabilityPct: 60,
    weightedValue: 72000000,
    expectedTenderDate: '2026-02-10',
    expectedAwardDate: '2026-03-30',
    stage: 'estimation',
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh',
    departmentId: 'dept_bd',
    competitors: ['Oberoi Realty', 'Godrej Properties'],
    approvalStatus: 'approved',
    createdAt: '2026-01-11T10:00:00Z',
    updatedAt: '2026-01-14T16:00:00Z',
    daysInStage: 4
  },
  {
    id: 'opp_005',
    oppNo: 'OPP-2025-012',
    clientId: 'cl_005',
    clientName: 'TechPark Solutions',
    title: 'IT Park - Building A',
    workType: 'Commercial - IT Park',
    location: 'Hyderabad, Telangana',
    estimatedValue: 95000000,
    probabilityPct: 0,
    weightedValue: 0,
    expectedAwardDate: '2026-01-10',
    stage: 'lost',
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta',
    departmentId: 'dept_bd',
    competitors: ['Prestige Group'],
    lostReasonCode: 'PRICE_HIGH',
    lostNotes: 'Our bid was 15% higher than the lowest bidder. Client opted for competitor.',
    approvalStatus: 'approved',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-10T15:00:00Z',
    daysInStage: 5
  },
  {
    id: 'opp_006',
    oppNo: 'OPP-2025-010',
    clientId: 'cl_006',
    clientName: 'National Highways Authority',
    title: 'Highway Expansion - NH-48',
    workType: 'Infrastructure - Highway',
    location: 'Delhi-Jaipur',
    estimatedValue: 180000000,
    probabilityPct: 100,
    weightedValue: 180000000,
    expectedAwardDate: '2025-12-20',
    stage: 'awarded',
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh',
    departmentId: 'dept_bd',
    competitors: ['IRB Infrastructure', 'Dilip Buildcon'],
    tenderId: 'tender_001',
    projectId: 'prj_002',
    approvalStatus: 'approved',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-12-20T14:00:00Z',
    daysInStage: 26
  }
];

// Sample Contacts
export const contacts: Contact[] = [
  {
    id: 'contact_001',
    clientId: 'cl_001',
    clientName: 'Sunrise Developers',
    name: 'Mr. Rajesh Sharma',
    designation: 'Project Director',
    department: 'Projects',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@sunrise.com',
    influence: 'decision_maker',
    isActive: true
  },
  {
    id: 'contact_002',
    clientId: 'cl_001',
    clientName: 'Sunrise Developers',
    name: 'Ms. Anita Desai',
    designation: 'Procurement Manager',
    department: 'Procurement',
    phone: '+91 98765 43215',
    email: 'anita.desai@sunrise.com',
    influence: 'influencer',
    isActive: true
  },
  {
    id: 'contact_003',
    clientId: 'cl_002',
    clientName: 'Metro Rail Corporation',
    name: 'Mr. Amit Patel',
    designation: 'Chief Engineer',
    department: 'Engineering',
    phone: '+91 98765 43211',
    email: 'amit.patel@metrorail.gov.in',
    influence: 'decision_maker',
    isActive: true
  },
  {
    id: 'contact_004',
    clientId: 'cl_003',
    clientName: 'Green Valley Industries',
    name: 'Ms. Sneha Kulkarni',
    designation: 'Plant Head',
    department: 'Operations',
    phone: '+91 98765 43212',
    email: 'sneha@greenvalley.com',
    influence: 'decision_maker',
    isActive: true
  },
  {
    id: 'contact_005',
    clientId: 'cl_004',
    clientName: 'Heritage Hotels Ltd.',
    name: 'Mr. Karan Malhotra',
    designation: 'VP - Expansion',
    department: 'Business Development',
    phone: '+91 98765 43213',
    email: 'karan@heritagehotels.com',
    influence: 'decision_maker',
    isActive: true
  }
];

// Sample Interactions
export const interactions: Interaction[] = [
  {
    id: 'int_001',
    entityType: 'opportunity',
    entityId: 'opp_001',
    type: 'meeting',
    datetime: '2026-01-15T10:00:00Z',
    participants: ['Priya Mehta', 'Rajesh Sharma', 'Anita Desai'],
    summary: 'Discussed project scope and timeline. Client confirmed budget range. Requested detailed technical proposal by Jan 20.',
    nextAction: 'Submit technical proposal',
    nextActionDate: '2026-01-20',
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta'
  },
  {
    id: 'int_002',
    entityType: 'opportunity',
    entityId: 'opp_003',
    type: 'call',
    datetime: '2026-01-14T15:00:00Z',
    participants: ['Priya Mehta', 'Sneha Kulkarni'],
    summary: 'Negotiation discussion. Client requested 5% discount. We offered 3% with extended warranty. Client considering.',
    nextAction: 'Follow up on discount decision',
    nextActionDate: '2026-01-17',
    ownerId: 'usr_bd_001',
    ownerName: 'Priya Mehta'
  },
  {
    id: 'int_003',
    entityType: 'opportunity',
    entityId: 'opp_004',
    type: 'site_visit',
    datetime: '2026-01-13T11:00:00Z',
    participants: ['Vikram Singh', 'Karan Malhotra'],
    summary: 'Site visit completed. Assessed site conditions and access. Discussed phasing strategy. Client satisfied with approach.',
    nextAction: 'Prepare estimation based on site findings',
    nextActionDate: '2026-01-18',
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh'
  },
  {
    id: 'int_004',
    entityType: 'lead',
    entityId: 'lead_002',
    type: 'email',
    datetime: '2026-01-14T09:30:00Z',
    participants: ['Vikram Singh'],
    summary: 'Received tender notification from Metro Rail Corporation. Downloaded tender documents.',
    nextAction: 'Review tender documents and prepare qualification checklist',
    nextActionDate: '2026-01-16',
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh'
  },
  {
    id: 'int_005',
    entityType: 'client',
    entityId: 'cl_006',
    type: 'presentation',
    datetime: '2025-12-15T14:00:00Z',
    participants: ['Vikram Singh', 'Amit Patel', 'Project Team'],
    summary: 'Presented technical proposal and project methodology. Demonstrated past project experience. Client impressed with approach.',
    ownerId: 'usr_bd_002',
    ownerName: 'Vikram Singh'
  }
];

// Sample Negotiations
export const negotiations: Negotiation[] = [
  {
    id: 'neg_001',
    opportunityId: 'opp_003',
    roundNo: 1,
    ourPrice: 45000000,
    clientCounter: 42000000,
    discountPct: 6.67,
    termsChanged: ['Payment terms: 30 days instead of 45 days'],
    outcome: 'counter',
    date: '2026-01-12T10:00:00Z'
  },
  {
    id: 'neg_002',
    opportunityId: 'opp_003',
    roundNo: 2,
    ourPrice: 43500000,
    clientCounter: 42500000,
    discountPct: 3.33,
    termsChanged: ['Extended warranty from 1 year to 2 years'],
    outcome: 'counter',
    date: '2026-01-14T15:00:00Z'
  },
  {
    id: 'neg_003',
    opportunityId: 'opp_003',
    roundNo: 3,
    ourPrice: 43000000,
    clientCounter: 43000000,
    discountPct: 4.44,
    termsChanged: ['Final price agreed', 'Payment terms: 30 days', 'Warranty: 2 years'],
    outcome: 'accepted',
    date: '2026-01-15T11:00:00Z'
  }
];

// Protocol Control Points
export const protocolControlPoints: ProtocolControlPoint[] = [
  {
    id: 'CP-CRM-01',
    stage: 'APPROVE',
    control: 'Opportunities above threshold need an approved pursuit decision before tendering',
    enforcement: 'BLOCK',
    status: 'observe'
  },
  {
    id: 'CP-CRM-02',
    stage: 'MONITOR',
    control: 'Follow-ups overdue and opportunities ageing beyond stage limits',
    enforcement: 'MONITOR',
    status: 'observe'
  },
  {
    id: 'CP-CRM-03',
    stage: 'CLOSE',
    control: 'Lost/dropped opportunities closed only with reason code',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Pipeline Statistics
export const pipelineStats = {
  totalOpportunities: opportunities.length,
  activeOpportunities: opportunities.filter(o => !['awarded', 'lost', 'dropped'].includes(o.stage)).length,
  totalPipelineValue: opportunities
    .filter(o => !['awarded', 'lost', 'dropped'].includes(o.stage))
    .reduce((sum, o) => sum + o.estimatedValue, 0),
  totalWeightedValue: opportunities
    .filter(o => !['awarded', 'lost', 'dropped'].includes(o.stage))
    .reduce((sum, o) => sum + o.weightedValue, 0),
  awardedValue: opportunities
    .filter(o => o.stage === 'awarded')
    .reduce((sum, o) => sum + o.estimatedValue, 0),
  winRate: (opportunities.filter(o => o.stage === 'awarded').length / 
    opportunities.filter(o => ['awarded', 'lost'].includes(o.stage)).length * 100).toFixed(1),
  avgDaysInPipeline: 15,
  leadsThisMonth: leads.filter(l => new Date(l.createdAt) > new Date('2026-01-01')).length,
  enquiriesPending: enquiries.filter(e => e.status === 'pending' || e.status === 'in_progress').length
};

// Stage-wise Pipeline
export const stageWisePipeline = [
  { stage: 'lead', count: 0, value: 0, color: 'slate' },
  { stage: 'enquiry', count: 0, value: 0, color: 'blue' },
  { stage: 'opportunity', count: 1, value: 250000000, color: 'indigo' },
  { stage: 'tender', count: 1, value: 85000000, color: 'purple' },
  { stage: 'estimation', count: 1, value: 120000000, color: 'pink' },
  { stage: 'bid', count: 0, value: 0, color: 'rose' },
  { stage: 'negotiation', count: 1, value: 45000000, color: 'amber' },
  { stage: 'awarded', count: 1, value: 180000000, color: 'green' },
  { stage: 'lost', count: 1, value: 95000000, color: 'red' }
];

// Lost Reasons
export const lostReasons = [
  { code: 'PRICE_HIGH', description: 'Our price was higher than competitors' },
  { code: 'TECHNICAL', description: 'Technical capability not sufficient' },
  { code: 'EXPERIENCE', description: 'Lack of relevant experience' },
  { code: 'RELATIONSHIP', description: 'Client preferred existing relationship' },
  { code: 'TIMELINE', description: 'Could not meet client timeline' },
  { code: 'BUDGET_CONSTRAINT', description: 'Client budget constraints' },
  { code: 'OTHER', description: 'Other reasons' }
];
