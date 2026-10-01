import React, { useState } from 'react';
import { Button, Input, Select, Card, DataTable, StatusBadge } from './components';

// List Report Template
export interface ListReportProps<T> {
  title: string;
  description?: string;
  columns: any[];
  data: T[];
  keyField: keyof T;
  filters?: {
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: { value: string; label: string }[];
  }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  onRowClick?: (row: T) => void;
  bulkActions?: {
    label: string;
    onClick: (selectedIds: string[]) => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export function ListReport<T>({
  title,
  description,
  columns,
  data,
  keyField,
  filters = [],
  actions = [],
  onRowClick,
  bulkActions = [],
}: ListReportProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleBulkAction = (action: (selectedIds: string[]) => void) => {
    action(Array.from(selectedRows));
    setSelectedRows(new Set());
  };

  return (
    <div className="ds-list-report">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
      </div>

      {/* Filter Bar */}
      {filters.length > 0 && (
        <Card className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                {filter.type === 'text' ? (
                  <Input
                    label={filter.label}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) =>
                      setFilterValues({ ...filterValues, [filter.key]: e.target.value })
                    }
                    placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                  />
                ) : (
                  <Select
                    label={filter.label}
                    options={filter.options || []}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) =>
                      setFilterValues({ ...filterValues, [filter.key]: e.target.value })
                    }
                    placeholder="All"
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Bulk Actions */}
      {bulkActions.length > 0 && selectedRows.size > 0 && (
        <Card className="mb-4 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary-900">
              {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              {bulkActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || 'secondary'}
                  size="sm"
                  onClick={() => handleBulkAction(action.onClick)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Actions Bar */}
      {actions.length > 0 && (
        <div className="mb-4 flex gap-2">
          {actions.map((action, idx) => (
            <Button key={idx} variant={action.variant || 'primary'} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Data Table */}
      <Card padding="none">
        <DataTable
          columns={columns}
          data={data}
          keyField={keyField}
          onRowClick={onRowClick}
          selectable={bulkActions.length > 0}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </Card>
    </div>
  );
}

// Object Page Template
export interface ObjectPageTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface ObjectPageProps {
  title: string;
  subtitle?: string;
  status?: string;
  statusType?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'active' | 'inactive';
  headerFields?: {
    label: string;
    value: string | number;
    type?: 'currency' | 'number' | 'date' | 'text';
  }[];
  tabs: ObjectPageTab[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export const ObjectPage: React.FC<ObjectPageProps> = ({
  title,
  subtitle,
  status,
  statusType,
  headerFields = [],
  tabs,
  actions = [],
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const formatValue = (value: string | number, type?: string) => {
    if (type === 'currency') {
      return `₹${Number(value).toLocaleString('en-IN')}`;
    }
    if (type === 'number') {
      return Number(value).toLocaleString('en-IN');
    }
    if (type === 'date') {
      return new Date(value as string).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return value;
  };

  return (
    <div className="ds-object-page">
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
              {status && statusType && <StatusBadge status={statusType} label={status} />}
            </div>
            {subtitle && <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>}
          </div>
          {actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((action, idx) => (
                <Button key={idx} variant={action.variant || 'primary'} onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Header Fields */}
        {headerFields.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
            {headerFields.map((field, idx) => (
              <div key={idx}>
                <p className="text-xs text-neutral-500 mb-1">{field.label}</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {formatValue(field.value, field.type)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// Worklist Template
export interface WorklistItem {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  statusType: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'active' | 'inactive';
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  onClick?: () => void;
}

export interface WorklistProps {
  title: string;
  items: WorklistItem[];
  onItemClick?: (item: WorklistItem) => void;
}

export const Worklist: React.FC<WorklistProps> = ({ title, items, onItemClick }) => {
  const priorityConfig = {
    low: { bg: 'bg-neutral-100', text: 'text-neutral-700' },
    medium: { bg: 'bg-info-100', text: 'text-info-700' },
    high: { bg: 'bg-warning-100', text: 'text-warning-700' },
    critical: { bg: 'bg-error-100', text: 'text-error-700' },
  };

  return (
    <div className="ds-worklist">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <Card
            key={item.id}
            padding="sm"
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              onItemClick ? '' : 'cursor-default'
            }`}
          >
            <div
              className="flex items-start justify-between"
              onClick={() => onItemClick && onItemClick(item)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                  <StatusBadge status={item.statusType} label={item.status} size="sm" />
                </div>
                {item.subtitle && (
                  <p className="text-xs text-neutral-600 mb-2">{item.subtitle}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  {item.dueDate && (
                    <span>
                      Due: {new Date(item.dueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {item.priority && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        priorityConfig[item.priority].bg
                      } ${priorityConfig[item.priority].text}`}
                    >
                      {item.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Dashboard Template
export interface DashboardWidget {
  id: string;
  title: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export interface DashboardProps {
  title: string;
  widgets: DashboardWidget[];
}

export const Dashboard: React.FC<DashboardProps> = ({ title, widgets }) => {
  const sizeStyles = {
    sm: 'col-span-1',
    md: 'col-span-1 md:col-span-2',
    lg: 'col-span-1 md:col-span-2 lg:col-span-3',
  };

  return (
    <div className="ds-dashboard">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div key={widget.id} className={sizeStyles[widget.size || 'md']}>
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">{widget.title}</h3>
              {widget.content}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
