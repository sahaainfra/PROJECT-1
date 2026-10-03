# Part 6 — Workflow & Approval Engine Implementation

## Overview

Part 6 implements a comprehensive workflow and approval engine for the Construction ERP system. This module provides configurable workflows for all document types with multi-level routing, delegation, SLA tracking, and parallel approvals.

## Key Features Implemented

### 1. **Workflow Definitions** (5 workflows)
- **Purchase Request (PR)**: 3-step approval with amount-based skipping
- **Purchase Order (PO)**: 4-step approval with parallel any logic
- **Subcontract Bill**: 4-step approval for subcontractor payments
- **Leave Request**: 2-step approval with day-based skipping
- **Budget Revision**: 3-step approval for budget changes

### 2. **Workflow Instances** (6 active instances)
- Real-time tracking of document approval status
- Progress visualization (completed tasks / total tasks)
- Amount snapshots for audit trail
- Context preservation (project, vendor, material details)

### 3. **Task Management**
- Pending approval queue with SLA tracking
- Overdue task identification and escalation
- At-risk task monitoring (< 24h remaining)
- Bulk approval capability (where allowed)

### 4. **Delegation System**
- Active delegations with date ranges
- Pending delegation approvals
- Scope-based delegation (project/company level)
- Document type filtering

### 5. **SLA Monitoring**
- Real-time SLA compliance tracking
- Overdue task alerts with escalation options
- At-risk task warnings
- Average turnaround time metrics

### 6. **Protocol Controls** (4 controls)
- **CP-WF-01**: Submitter cannot approve own document
- **CP-WF-02**: SLA breach escalation (L1→L2→L3)
- **CP-WF-03**: Bulk approval disabled for documents with warnings
- **CP-WF-04**: Split document detection for approval band evasion

## Dashboard Components

### Overview Tab
- Key statistics (definitions, instances, tasks, turnaround)
- Recent workflow activity feed
- Protocol control points status

### Definitions Tab
- Visual workflow designer with step-by-step visualization
- Step configuration (approver rules, SLA, escalation)
- Simulation capability for testing routing logic
- Version management

### My Approvals Tab
- Pending approval queue with filters
- Quick action buttons (Approve/Reject/Return)
- SLA countdown timers
- Document preview integration

### Instances Tab
- All workflow instances with status filters
- Progress bars showing completion
- Amount and context display
- Submitted by tracking

### Delegations Tab
- Active delegations list
- Pending delegation approvals
- Delegation creation interface
- Scope and document type configuration

### SLA Monitor Tab
- Overdue tasks with escalation actions
- At-risk tasks (< 24h remaining)
- SLA compliance statistics
- Reminder and escalation buttons

## Data Structure

### Workflow Definitions
```typescript
{
  id: string;
  code: string;
  docType: string;
  name: string;
  version: number;
  isActive: boolean;
  stepsCount: number;
  instanceCount: number;
}
```

### Workflow Steps
```typescript
{
  id: string;
  definitionId: string;
  seq: number;
  name: string;
  type: 'sequential' | 'parallel_all' | 'parallel_any' | 'quorum';
  approverRuleType: 'role' | 'user' | 'project_role' | 'department_head' | 'reporting_manager';
  approverRuleValue: string;
  slaHours: number;
  escalateToRule?: string;
}
```

### Workflow Instances
```typescript
{
  id: string;
  docType: string;
  docId: string;
  docNumber: string;
  status: 'draft' | 'in_progress' | 'approved' | 'rejected' | 'returned' | 'cancelled';
  currentStepSeq: number;
  submittedBy: string;
  amountSnapshot: number;
  contextJson: Record<string, any>;
  tasksCount: number;
  completedTasks: number;
}
```

### Workflow Tasks
```typescript
{
  id: string;
  instanceId: string;
  stepSeq: number;
  stepName: string;
  assigneeUserId: string;
  assigneeName: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'skipped' | 'expired';
  dueAt: string;
  slaHours: number;
  remainingHours: number;
}
```

## Integration Points

### Part 5 (IAM) Integration
- Approver resolution uses role-based permissions
- Scope-based access control for workflow actions
- Delegation requires matching permission scope

### Part 4 (Organization) Integration
- Project and site scope for workflow routing
- Department-based approver resolution
- Organizational hierarchy for escalation

### Part 3 (Core Services) Integration
- Audit logging for all workflow actions
- Event emission for real-time updates
- Notification dispatch for task assignments

## Protocol Control Implementation

### CP-WF-01: Self-Approval Prevention
```typescript
// Prevents submitter from approving their own document
if (task.assigneeUserId === instance.submittedBy) {
  throw new ProtocolViolation('CP-WF-01', 'Cannot approve own document');
}
```

### CP-WF-02: SLA Escalation
```typescript
// Monitors SLA breaches and escalates
if (task.remainingHours <= 0 && !task.escalatedAt) {
  escalateToNextLevel(task);
  task.escalatedAt = new Date().toISOString();
}
```

### CP-WF-03: Bulk Approval Guard
```typescript
// Disables bulk approval for documents with warnings
if (instance.hasWarnings && action === 'bulk_approve') {
  throw new ProtocolViolation('CP-WF-03', 'Bulk approval disabled for documents with warnings');
}
```

### CP-WF-04: Split Document Detection
```typescript
// Detects attempts to split documents to bypass approval limits
const recentDocs = getRecentDocuments(instance.submittedBy, 7);
if (sumAmounts(recentDocs) > approvalLimit) {
  flagForReview('CP-WF-04', 'Potential split document evasion');
}
```

## Workflow Routing Logic

### Amount-Based Skipping
```typescript
// Skip management approval for amounts < 5 lakh
if (instance.amountSnapshot < 500000) {
  skipStep(instance, 3); // Skip management step
}
```

### Parallel Any Logic
```typescript
// Any one approver can approve in parallel steps
if (step.type === 'parallel_any') {
  if (anyApproverApproved(step)) {
    completeStep(step);
    skipOtherApprovers(step);
  }
}
```

### Role-Based Resolution
```typescript
// Resolve approver based on role and scope
const approver = resolveApprover({
  ruleType: step.approverRuleType,
  ruleValue: step.approverRuleValue,
  scope: instance.contextJson
});
```

## Delegation System

### Delegation Rules
- Delegate must have same or higher permission scope
- Delegation requires approval for privileged roles
- Date-range enforcement (from/to dates)
- Document type filtering

### Delegation Flow
```typescript
// When task is assigned, check for active delegation
if (hasActiveDelegation(assigneeUserId, docType)) {
  const delegation = getActiveDelegation(assigneeUserId, docType);
  task.assigneeUserId = delegation.delegateId;
  task.delegatedFrom = assigneeUserId;
}
```

## SLA Management

### SLA Calculation
```typescript
// Calculate remaining hours considering working calendar
const remainingHours = calculateWorkingHours(
  task.dueAt,
  new Date(),
  slaCalendar.workingDays,
  slaCalendar.holidays
);
```

### Escalation Levels
- **L1**: Direct manager notification
- **L2**: Department head notification
- **L3**: CFO/Management notification

### Reminder Schedule
- 50% SLA elapsed: First reminder
- 90% SLA elapsed: Urgent reminder
- 100% SLA elapsed: Escalation trigger

## Testing & Validation

### Unit Tests
- Workflow definition validation
- Step routing logic
- SLA calculation accuracy
- Delegation resolution

### Integration Tests
- End-to-end workflow execution
- Parallel approval scenarios
- Delegation handoff
- Escalation triggers

### Protocol Tests
- Self-approval prevention
- SLA breach detection
- Bulk approval guards
- Split document detection

## Performance Metrics

### Current Statistics
- **Total Definitions**: 5
- **Active Instances**: 6
- **Pending Tasks**: 4
- **Overdue Tasks**: 0
- **Average Turnaround**: 36.5 hours

### Performance Targets
- Task assignment: < 100ms
- SLA calculation: < 50ms
- Workflow routing: < 200ms
- Delegation resolution: < 100ms

## Security Considerations

### Access Control
- Role-based workflow definition editing
- Scope-based task visibility
- Permission-gated actions (approve/reject/return)
- Audit trail for all actions

### Data Protection
- Amount snapshots for audit integrity
- Context preservation in JSON format
- IP address tracking for all actions
- Comment and reason code requirements

## Future Enhancements

### Planned Features
1. **Visual Workflow Designer**: Drag-and-drop interface
2. **Advanced Conditions**: Complex routing rules engine
3. **Mobile Approvals**: Push notifications and mobile UI
4. **Analytics Dashboard**: Workflow performance metrics
5. **Integration Hub**: Third-party workflow systems

### Phase 2 Features
1. **Digital Signatures**: Legal compliance for approvals
2. **Document Versioning**: Track changes during approval
3. **Conditional Routing**: Dynamic step inclusion
4. **Bulk Operations**: Mass approval/rejection
5. **Workflow Templates**: Reusable workflow patterns

## Conclusion

Part 6 successfully implements a robust workflow and approval engine that integrates seamlessly with the existing ERP architecture. The system provides comprehensive workflow management with protocol controls, SLA tracking, and delegation capabilities, ensuring efficient and compliant document approval processes across the organization.
