# Part 19 — Project Management & Project 360

## Overview

Part 19 delivers comprehensive project management capabilities for the Construction ERP, including project charter, team management, scope definition, milestone tracking, risk management, issue tracking, and a unified Project 360 view that aggregates data from all modules.

## Key Components

### 1. Project Charter
- **Objectives**: Clear project goals with measurable KPIs
- **Scope Management**: Defined inclusions and exclusions with contract clause references
- **Key Dates**: Start date, planned finish, and revised finish tracking
- **Constraints & Assumptions**: Documented project constraints and assumptions
- **Approval Workflow**: Draft → Submitted → Approved status tracking

### 2. Team Management
- **Role-Based Assignment**: PM, Planning, QS, Commercial, Site Manager, Store, QA, HSE, Accounts
- **Allocation Tracking**: Percentage allocation per team member
- **Key Person Identification**: Flag critical team members
- **Date-Range Assignments**: Track team member tenure on project

### 3. Milestone Tracking
- **Milestone Types**: Contractual, Internal, Payment milestones
- **Date Tracking**: Planned, forecast, and actual dates
- **Slippage Calculation**: Automatic calculation of days behind/ahead
- **Weight Distribution**: Percentage weight for each milestone
- **Status Management**: Pending, In Progress, Completed, Slipped, At Risk

### 4. Risk Management
- **Risk Register**: Comprehensive risk tracking with categories
- **5×5 Heat Map**: Probability × Impact visualization
- **Risk Scoring**: Automatic calculation (P × I)
- **Risk Categories**: Technical, Commercial, HSE, Quality, Schedule, Statutory, External
- **Response Strategies**: Avoid, Mitigate, Transfer, Accept
- **Residual Risk Tracking**: Track risk score after mitigation

### 5. Issue Management
- **Issue Log**: Track project issues with priority levels
- **SLA Management**: Define and track service level agreements
- **Overdue Tracking**: Automatic calculation of overdue days
- **Status Workflow**: Open → In Progress → Resolved → Closed
- **Category Management**: Design, Procurement, Quality, HSE, Contract issues

### 6. Project 360 View
Unified dashboard aggregating data from all modules:

- **Progress**: Physical %, Financial %, SPI
- **Cost**: Budget, Committed, Actual, EAC, CPI, Variance
- **Revenue**: Contract Value, Billed, Certified, Collected
- **Procurement**: Open PRs, Open POs, Overdue Deliveries
- **Stores**: Stock Value, Stock Outs, Consumption Variance
- **Plant**: Deployed, Utilisation, Breakdown Rate
- **Manpower**: Planned vs Actual, Variance
- **Quality**: Open NCRs, Pass Rate, Inspection Count
- **HSE**: Open Permits, Incidents, LTIFR, Near Misses
- **Contracts**: Variations, Claims, EOT
- **Documents**: Pending Approvals, Total Documents
- **Tasks**: Pending, Overdue, Completed

### 7. Profitability Summary
- **Contract Value**: Base contract + approved variations
- **Revenue Recognition**: Track billed and collected amounts
- **Cost Tracking**: Actual costs to date
- **Margin Analysis**: Gross margin and EAC margin calculations

## Protocol Controls

### CP-PRJ-01: Project Planning Validation
- **Stage**: PLAN
- **Control**: Project charter, milestones, risk register and RACI approved before mobilisation
- **Enforcement**: EXCEPTION (PROCESS_DEVIATION)
- **Status**: OBSERVE

### CP-PRJ-02: High Risk Monitoring
- **Stage**: MONITOR
- **Control**: High risks (score ≥ 15) without response plan in 7 days
- **Enforcement**: MONITOR
- **Status**: OBSERVE

### CP-PRJ-03: Milestone Slippage Alert
- **Stage**: MONITOR
- **Control**: Milestone slip beyond threshold
- **Enforcement**: MONITOR (DR-14)
- **Status**: OBSERVE

### CP-PRJ-04: Project Closure Validation
- **Stage**: CLOSE
- **Control**: Project closure checklist incl. zero open findings/exceptions
- **Enforcement**: BLOCK
- **Status**: OBSERVE

## Data Structures

### Project Charter
```typescript
interface ProjectCharter {
  projectId: string;
  objectives: string[];
  scopeInclusions: string[];
  scopeExclusions: string[];
  keyDates: {
    startDate: string;
    plannedFinish: string;
    revisedFinish?: string;
  };
  constraints: string[];
  assumptions: string[];
  status: 'draft' | 'submitted' | 'approved';
  approvedBy?: string;
  approvedAt?: string;
}
```

### Risk
```typescript
interface Risk {
  id: string;
  projectId: string;
  code: string;
  title: string;
  category: 'technical' | 'commercial' | 'HSE' | 'quality' | 'schedule' | 'statutory' | 'external';
  cause: string;
  effect: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  score: number;
  ownerId: string;
  ownerName: string;
  response: 'avoid' | 'mitigate' | 'transfer' | 'accept';
  actions: string;
  dueDate: string;
  status: 'identified' | 'assessed' | 'response_planned' | 'monitoring' | 'closed';
  residualScore?: number;
}
```

### Milestone
```typescript
interface Milestone {
  id: string;
  projectId: string;
  code: string;
  name: string;
  type: 'contractual' | 'internal' | 'payment';
  plannedDate: string;
  forecastDate?: string;
  actualDate?: string;
  weightPct: number;
  status: 'pending' | 'in_progress' | 'completed' | 'slipped' | 'at_risk';
  slippageDays?: number;
}
```

## Sample Data

### Project: Riverside Tower - Phase II
- **Contract Value**: ₹128.5 Cr (including variations)
- **Physical Progress**: 67%
- **Financial Progress**: 65%
- **SPI**: 0.96 (slightly behind schedule)
- **CPI**: 0.98 (slightly over budget)
- **EAC Margin**: 0.39% (marginally profitable)

### Team Composition
- **Total Members**: 6
- **Key Persons**: 3 (PM, Planning, Site Manager)
- **Roles**: PM, Planning, QS, Site Manager, QA, HSE

### Risk Profile
- **Total Risks**: 6
- **High Risks (≥15)**: 0
- **Medium Risks (8-14)**: 4
- **Low Risks (<8)**: 2

### Issue Status
- **Total Issues**: 5
- **Open**: 2
- **In Progress**: 2
- **Resolved**: 1
- **Overdue**: 1

### Milestone Status
- **Total Milestones**: 6
- **Completed**: 1
- **At Risk**: 1
- **Pending**: 4

## Integration Points

### Part 4 (Organization)
- Project master data
- Site assignments
- Geofence integration

### Part 5 (IAM)
- Permission-based access control
- Role-based team assignments
- Scope-based data filtering

### Part 6 (Workflow)
- Charter approval workflow
- Risk escalation workflow
- Issue resolution workflow

### Part 7 (Protocol)
- Protocol control enforcement
- Risk monitoring
- Milestone tracking

### Part 14 (Dashboard)
- KPI widget integration
- Progress tracking
- Financial metrics

### Part 18 (Notifications)
- Risk escalation notifications
- Milestone slippage alerts
- Issue assignment notifications

## Features

### Project Charter Management
- ✅ Objectives definition with KPI targets
- ✅ Scope inclusions/exclusions with contract references
- ✅ Constraints and assumptions documentation
- ✅ Approval workflow integration
- ✅ Version control for charter changes

### Team Management
- ✅ Role-based team member assignment
- ✅ Allocation percentage tracking
- ✅ Key person identification
- ✅ Date-range based assignments
- ✅ Team size and composition analytics

### Milestone Tracking
- ✅ Multiple milestone types (contractual, internal, payment)
- ✅ Planned vs forecast vs actual date tracking
- ✅ Automatic slippage calculation
- ✅ Weight distribution for progress calculation
- ✅ Visual timeline representation

### Risk Management
- ✅ 5×5 risk heat map visualization
- ✅ Automatic risk score calculation
- ✅ Risk categorization (7 categories)
- ✅ Response strategy tracking
- ✅ Residual risk assessment
- ✅ Risk trend analysis

### Issue Management
- ✅ Priority-based issue tracking
- ✅ SLA definition and monitoring
- ✅ Overdue issue identification
- ✅ Status workflow management
- ✅ Issue-to-task conversion capability

### Project 360 Dashboard
- ✅ 12 module tiles with real-time data
- ✅ Drill-down to source modules
- ✅ Permission-based tile visibility
- ✅ Color-coded status indicators
- ✅ Comprehensive project health view

### Profitability Analysis
- ✅ Contract value tracking with variations
- ✅ Revenue recognition monitoring
- ✅ Cost-to-date analysis
- ✅ Gross margin calculation
- ✅ EAC (Estimate at Completion) margin

## UI Components

### Overview Tab
- Key metrics cards (Contract Value, Cost, EAC Margin, SPI)
- Quick stats (Milestones, Risks, Issues, Team)
- Protocol controls display

### Charter Tab
- Charter status indicator
- Objectives list
- Scope inclusions/exclusions
- Key dates
- Constraints and assumptions

### Team Tab
- Team member table with roles
- Allocation percentages
- Key person indicators
- Add member functionality

### Milestones Tab
- Milestone summary cards
- Detailed milestone list
- Status indicators
- Slippage alerts

### Risks Tab
- Risk summary cards
- 5×5 heat map visualization
- Risk register with details
- Add risk functionality

### Issues Tab
- Issue summary cards
- Issue list with priority indicators
- SLA tracking
- Overdue alerts

### Project 360 Tab
- 12 tile grid layout
- Real-time data from all modules
- Color-coded metrics
- Drill-down links

## Business Rules

### Risk Scoring
- **Low**: Score 1-6 (Green)
- **Medium**: Score 8-12 (Amber)
- **High**: Score 15-25 (Red)
- **Escalation**: High risks (≥15) without response plan in 7 days trigger escalation

### Milestone Slippage
- **Calculation**: Forecast/Actual - Planned (working days)
- **Threshold**: Configurable per project
- **Alert**: Automatic notification when slippage exceeds threshold

### Project Closure
- **Checklist**: Zero open findings/exceptions required
- **Validation**: All milestones completed or formally closed
- **Approval**: Management sign-off required

## Performance Characteristics

- **Project 360 Load**: < 3 seconds for full aggregation
- **Risk Heat Map**: Real-time rendering for up to 100 risks
- **Milestone Timeline**: Smooth scrolling for 50+ milestones
- **Issue List**: Paginated with 20 items per page

## Security Features

- **Permission-Based Access**: Users see only projects they're assigned to
- **Field-Level Security**: Sensitive financial data masked for unauthorized users
- **Audit Trail**: Complete history of all project changes
- **Protocol Enforcement**: All protocol controls validated server-side

## Future Enhancements

### Phase 2
1. **Gantt Chart Integration**: Visual timeline with dependencies
2. **Resource Leveling**: Automatic resource allocation optimization
3. **Earned Value Management**: Advanced EVM calculations
4. **Baseline Comparison**: Compare actual vs baseline performance
5. **What-If Analysis**: Scenario planning for project changes

### Phase 3
1. **AI Risk Prediction**: Machine learning for risk identification
2. **Automated Reporting**: Scheduled project status reports
3. **Mobile App**: Field-level project updates
4. **Integration with BIM**: 3D model integration
5. **Predictive Analytics**: Forecast project outcomes

## Conclusion

Part 19 establishes a comprehensive project management foundation for the Construction ERP, providing end-to-end project lifecycle management from charter to closure. The Project 360 view offers a unified perspective across all modules, enabling informed decision-making and proactive project control.

The risk management system with 5×5 heat map provides visual risk assessment, while the milestone tracking ensures schedule adherence. The issue management system with SLA tracking ensures timely resolution of project challenges.

All protocol controls are integrated to ensure governance and compliance, while the permission-based access control ensures data security. The modular design allows for seamless integration with other ERP modules, creating a cohesive project management ecosystem.
