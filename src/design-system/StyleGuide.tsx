import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  DataTable,
  StatusBadge,
  GateStatusPanel,
  ReasonCodePicker,
  ComplianceScoreBadge,
  PlannedVsActualBar,
} from './components';
import { ListReport, ObjectPage, Worklist, Dashboard } from './templates';

export const DesignSystemGuide: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [narrative, setNarrative] = useState('');

  // Sample data for demos
  const sampleData = [
    { id: '1', name: 'Steel TMT 16mm', code: 'MAT-001', category: 'Steel', status: 'active', stock: 150 },
    { id: '2', name: 'Cement OPC 53', code: 'MAT-002', category: 'Cement', status: 'active', stock: 500 },
    { id: '3', name: 'River Sand', code: 'MAT-003', category: 'Aggregates', status: 'warning', stock: 25 },
    { id: '4', name: 'Bricks', code: 'MAT-004', category: 'Masonry', status: 'active', stock: 10000 },
  ];

  const columns = [
    { key: 'code' as const, header: 'Code', sortable: true },
    { key: 'name' as const, header: 'Name', sortable: true },
    { key: 'category' as const, header: 'Category' },
    {
      key: 'status' as const,
      header: 'Status',
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'stock' as const,
      header: 'Stock',
      render: (value: number) => `${value} units`,
    },
  ];

  const reasonCodes = [
    { code: 'RC-001', label: 'Budget overrun', category: 'Financial' },
    { code: 'RC-002', label: 'Schedule delay', category: 'Schedule' },
    { code: 'RC-003', label: 'Quality issue', category: 'Quality' },
    { code: 'RC-004', label: 'Safety concern', category: 'Safety' },
  ];

  const gateChecks = [
    { id: '1', name: 'Budget availability', status: 'pass' as const, message: 'Within approved budget' },
    { id: '2', name: 'Material availability', status: 'warn' as const, message: 'Low stock - 25 units remaining', action: 'Request exception to proceed' },
    { id: '3', name: 'Vendor approval', status: 'pass' as const },
    { id: '4', name: 'Safety clearance', status: 'fail' as const, message: 'Pending safety inspection', action: 'Complete safety check before proceeding' },
  ];

  return (
    <div className="ds-style-guide min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-neutral-900">Design System Guide</h1>
          <p className="mt-2 text-neutral-600">
            Comprehensive documentation of the enterprise design system components, patterns, and guidelines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Design Tokens */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Design Tokens</h2>
          
          {/* Colors */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Color Palette</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Primary Colors</h4>
                <div className="grid grid-cols-9 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="text-center">
                      <div
                        className="h-16 rounded-lg border border-neutral-200"
                        style={{ backgroundColor: `var(--ds-color-primary-${shade})` }}
                      />
                      <p className="text-xs text-neutral-600 mt-1">{shade}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Semantic Colors</h4>
                <div className="grid grid-cols-4 gap-4">
                  {['success', 'warning', 'error', 'info'].map((semantic) => (
                    <div key={semantic}>
                      <div
                        className="h-16 rounded-lg border border-neutral-200 mb-2"
                        style={{ backgroundColor: `var(--ds-color-${semantic}-500)` }}
                      />
                      <p className="text-sm font-medium text-neutral-900 capitalize">{semantic}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Typography</h3>
            <div className="space-y-4">
              {[
                { size: '3xl', label: 'Heading 1' },
                { size: '2xl', label: 'Heading 2' },
                { size: 'xl', label: 'Heading 3' },
                { size: 'lg', label: 'Heading 4' },
                { size: 'base', label: 'Body' },
                { size: 'sm', label: 'Small' },
                { size: 'xs', label: 'Extra Small' },
              ].map((item) => (
                <div key={item.size} className="flex items-baseline gap-4">
                  <p className={`text-${item.size} font-semibold text-neutral-900 w-32`}>
                    {item.label}
                  </p>
                  <p className={`text-${item.size} text-neutral-600`}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Spacing */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Spacing (4pt Grid)</h3>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((space) => (
                <div key={space} className="flex items-center gap-4">
                  <p className="text-sm font-medium text-neutral-700 w-20">{space * 4}px</p>
                  <div
                    className="bg-primary-500 rounded"
                    style={{ width: `${space * 16}px`, height: '24px' }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Components */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Components</h2>

          {/* Buttons */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Buttons</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-2">Variants</p>
                <div className="flex gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-2">Sizes</p>
                <div className="flex gap-3 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-2">States</p>
                <div className="flex gap-3">
                  <Button>Default</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Inputs */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Form Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Text Input" placeholder="Enter text..." />
              <Input label="With Error" error="This field is required" />
              <Input label="With Help Text" helpText="Additional information about this field" />
              <Select
                label="Select"
                options={[
                  { value: '1', label: 'Option 1' },
                  { value: '2', label: 'Option 2' },
                  { value: '3', label: 'Option 3' },
                ]}
                placeholder="Choose an option"
              />
            </div>
          </Card>

          {/* Status Badges */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Status Badges</h3>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="success" label="Success" />
              <StatusBadge status="warning" label="Warning" />
              <StatusBadge status="error" label="Error" />
              <StatusBadge status="info" label="Info" />
              <StatusBadge status="neutral" label="Neutral" />
              <StatusBadge status="pending" label="Pending" />
              <StatusBadge status="active" label="Active" />
              <StatusBadge status="inactive" label="Inactive" />
            </div>
          </Card>

          {/* Cards */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card padding="sm" elevation="none">
                <p className="text-sm text-neutral-700">No elevation, small padding</p>
              </Card>
              <Card padding="md" elevation="sm">
                <p className="text-sm text-neutral-700">Small elevation, medium padding</p>
              </Card>
              <Card padding="lg" elevation="lg">
                <p className="text-sm text-neutral-700">Large elevation, large padding</p>
              </Card>
            </div>
          </Card>

          {/* Data Table */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Table</h3>
            <DataTable
              columns={columns}
              data={sampleData}
              keyField="id"
              selectable
              onRowClick={(row) => console.log('Row clicked:', row)}
            />
          </Card>

          {/* Modal */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Modal</h3>
            <Button onClick={() => setShowModal(true)}>Open Modal</Button>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Modal Title"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setShowModal(false)}>
                    Confirm
                  </Button>
                </>
              }
            >
              <p className="text-neutral-700">
                This is a modal dialog. It can contain any content and is used for focused tasks or
                confirmations.
              </p>
            </Modal>
          </Card>

          {/* Protocol Components */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Protocol Components</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Gate Status Panel</h4>
                <GateStatusPanel checks={gateChecks} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Reason Code Picker</h4>
                <ReasonCodePicker
                  reasonCodes={reasonCodes}
                  selectedCode={selectedReason}
                  onSelect={setSelectedReason}
                  narrative={narrative}
                  onNarrativeChange={setNarrative}
                  minNarrativeLength={10}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Compliance Score Badge</h4>
                <div className="flex gap-6 items-center">
                  <ComplianceScoreBadge score={95} size="lg" />
                  <ComplianceScoreBadge score={78} size="md" />
                  <ComplianceScoreBadge score={62} size="sm" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Planned vs Actual Bar</h4>
                <div className="space-y-4">
                  <PlannedVsActualBar planned={100} actual={95} unit="MT" label="Material Consumption" />
                  <PlannedVsActualBar planned={50} actual={58} unit="days" label="Schedule Progress" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Page Templates */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Page Templates</h2>

          {/* List Report */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">List Report Template</h3>
            <ListReport
              title="Materials"
              description="Manage all materials in the system"
              columns={columns}
              data={sampleData}
              keyField="id"
              filters={[
                { key: 'search', label: 'Search', type: 'text' },
                {
                  key: 'category',
                  label: 'Category',
                  type: 'select',
                  options: [
                    { value: 'steel', label: 'Steel' },
                    { value: 'cement', label: 'Cement' },
                    { value: 'aggregates', label: 'Aggregates' },
                  ],
                },
              ]}
              actions={[{ label: 'Add Material', onClick: () => console.log('Add') }]}
              bulkActions={[
                { label: 'Export', onClick: (ids) => console.log('Export:', ids) },
                { label: 'Delete', onClick: (ids) => console.log('Delete:', ids), variant: 'danger' },
              ]}
              onRowClick={(row) => console.log('View:', row)}
            />
          </Card>

          {/* Object Page */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Object Page Template</h3>
            <ObjectPage
              title="PO-2026-0142"
              subtitle="Purchase Order for Steel Materials"
              status="Approved"
              statusType="success"
              headerFields={[
                { label: 'Vendor', value: 'Tata Steel Ltd.' },
                { label: 'Total Value', value: 2450000, type: 'currency' },
                { label: 'Order Date', value: '2026-01-15', type: 'date' },
                { label: 'Delivery Date', value: '2026-01-25', type: 'date' },
              ]}
              tabs={[
                {
                  id: 'details',
                  label: 'Details',
                  content: (
                    <Card>
                      <p className="text-neutral-700">Purchase order details and line items</p>
                    </Card>
                  ),
                },
                {
                  id: 'approvals',
                  label: 'Approvals',
                  content: (
                    <Card>
                      <p className="text-neutral-700">Approval history and workflow</p>
                    </Card>
                  ),
                },
                {
                  id: 'timeline',
                  label: 'Timeline',
                  content: (
                    <Card>
                      <p className="text-neutral-700">Activity timeline</p>
                    </Card>
                  ),
                },
              ]}
              actions={[
                { label: 'Edit', onClick: () => console.log('Edit') },
                { label: 'Cancel', onClick: () => console.log('Cancel'), variant: 'danger' },
              ]}
            />
          </Card>

          {/* Worklist */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Worklist Template</h3>
            <Worklist
              title="Pending Approvals"
              items={[
                {
                  id: '1',
                  title: 'PO-2026-0143',
                  subtitle: 'Purchase Order - Cement Materials',
                  status: 'Pending',
                  statusType: 'pending',
                  dueDate: '2026-01-20',
                  priority: 'high',
                },
                {
                  id: '2',
                  title: 'GRN-2026-0234',
                  subtitle: 'Goods Receipt Note - Steel',
                  status: 'Pending',
                  statusType: 'pending',
                  dueDate: '2026-01-18',
                  priority: 'critical',
                },
                {
                  id: '3',
                  title: 'PAY-2026-0089',
                  subtitle: 'Payment to Vendor',
                  status: 'Pending',
                  statusType: 'pending',
                  dueDate: '2026-01-25',
                  priority: 'medium',
                },
              ]}
              onItemClick={(item) => console.log('View:', item)}
            />
          </Card>

          {/* Dashboard */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Dashboard Template</h3>
            <Dashboard
              title="Project Overview"
              widgets={[
                {
                  id: '1',
                  title: 'Budget Status',
                  size: 'md',
                  content: (
                    <div>
                      <p className="text-2xl font-bold text-neutral-900">₹1.25 Cr</p>
                      <p className="text-sm text-neutral-600">of ₹1.50 Cr budget</p>
                      <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500" style={{ width: '83%' }} />
                      </div>
                    </div>
                  ),
                },
                {
                  id: '2',
                  title: 'Schedule Progress',
                  size: 'md',
                  content: <PlannedVsActualBar planned={100} actual={85} unit="%" label="Completion" />,
                },
                {
                  id: '3',
                  title: 'Compliance Score',
                  size: 'sm',
                  content: (
                    <div className="flex justify-center">
                      <ComplianceScoreBadge score={92} size="lg" />
                    </div>
                  ),
                },
                {
                  id: '4',
                  title: 'Pending Actions',
                  size: 'md',
                  content: (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-700">Approvals</span>
                        <span className="text-sm font-semibold text-neutral-900">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-700">Exceptions</span>
                        <span className="text-sm font-semibold text-neutral-900">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-700">Overdue</span>
                        <span className="text-sm font-semibold text-error-600">3</span>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </section>

        {/* Accessibility */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Accessibility Guidelines</h2>
          <Card>
            <div className="prose prose-neutral max-w-none">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">WCAG 2.1 AA Compliance</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>✓ All interactive elements are keyboard accessible</li>
                <li>✓ Focus indicators are visible and clear</li>
                <li>✓ Color contrast ratios meet minimum requirements (4.5:1 for normal text)</li>
                <li>✓ ARIA labels and roles are properly applied</li>
                <li>✓ Form inputs have associated labels</li>
                <li>✓ Error messages are announced to screen readers</li>
                <li>✓ Modal dialogs trap focus and can be closed with Escape key</li>
                <li>✓ Images have alt text or are marked as decorative</li>
              </ul>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};
