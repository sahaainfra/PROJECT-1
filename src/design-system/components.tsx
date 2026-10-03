import React from 'react';

// Button Component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'ds-button inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="ds-input-wrapper">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`ds-input block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            icon ? 'pl-10' : 'pl-3'
          } pr-3 py-2 text-base ${
            error
              ? 'border-error-500 focus:ring-error-500'
              : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${inputId}-help`} className="mt-1 text-sm text-neutral-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Select Component
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  options,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="ds-select-wrapper">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`ds-select block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 pl-3 pr-10 py-2 text-base ${
          error
            ? 'border-error-500 focus:ring-error-500'
            : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-neutral-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

// StatusBadge Component
export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'active' | 'inactive';

export interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
    success: { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200' },
    active: { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200' },
    pending: { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200' },
    error: { bg: 'bg-error-50', text: 'text-error-700', border: 'border-error-200' },
    inactive: { bg: 'bg-error-50', text: 'text-error-700', border: 'border-error-200' },
    info: { bg: 'bg-info-50', text: 'text-info-700', border: 'border-info-200' },
    neutral: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200' },
  };

  const config = statusConfig[status] || statusConfig.neutral;
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`ds-status-badge inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeStyles}`}
    >
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Card Component
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  elevation = 'sm',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const elevationStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={`ds-card bg-white rounded-lg border border-neutral-200 ${paddingStyles[padding]} ${elevationStyles[elevation]} ${className}`}
    >
      {children}
    </div>
  );
};

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="ds-modal fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeStyles[size]}`}
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 id="modal-title" className="text-lg leading-6 font-medium text-neutral-900">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
                    aria-label="Close modal"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">{children}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// DataTable Component
export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(new Set(data.map((row) => String(row[keyField]))));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectionChange(newSelected);
  };

  return (
    <div className="ds-datatable overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            {selectable && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center text-neutral-500">
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const rowId = String(row[keyField]);
              const isSelected = selectedRows.has(rowId);
              return (
                <tr
                  key={rowId}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-neutral-50' : ''} ${isSelected ? 'bg-primary-50' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// GateStatusPanel Component (Protocol Control)
export interface GateCheck {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail' | 'pending';
  message?: string;
  action?: string;
}

export interface GateStatusPanelProps {
  checks: GateCheck[];
  title?: string;
}

export const GateStatusPanel: React.FC<GateStatusPanelProps> = ({ checks, title = 'Gate Status' }) => {
  const statusConfig = {
    pass: { icon: '✓', bg: 'bg-success-50', border: 'border-success-200', text: 'text-success-700' },
    warn: { icon: '⚠', bg: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-700' },
    fail: { icon: '✗', bg: 'bg-error-50', border: 'border-error-200', text: 'text-error-700' },
    pending: { icon: '○', bg: 'bg-neutral-50', border: 'border-neutral-200', text: 'text-neutral-700' },
  };

  return (
    <div className="ds-gate-status-panel bg-white rounded-lg border border-neutral-200 p-4">
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {checks.map((check) => {
          const config = statusConfig[check.status];
          return (
            <div key={check.id} className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg} ${config.border}`}>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${config.text} font-bold`}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${config.text}`}>{check.name}</p>
                {check.message && <p className="text-xs text-neutral-600 mt-1">{check.message}</p>}
                {check.action && (
                  <p className="text-xs text-primary-600 mt-1 font-medium">{check.action}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ReasonCodePicker Component (Protocol Control)
export interface ReasonCode {
  code: string;
  label: string;
  category: string;
}

export interface ReasonCodePickerProps {
  reasonCodes: ReasonCode[];
  selectedCode?: string;
  onSelect: (code: string) => void;
  narrative?: string;
  onNarrativeChange: (narrative: string) => void;
  minNarrativeLength?: number;
}

export const ReasonCodePicker: React.FC<ReasonCodePickerProps> = ({
  reasonCodes,
  selectedCode,
  onSelect,
  narrative,
  onNarrativeChange,
  minNarrativeLength = 10,
}) => {
  const categories = Array.from(new Set(reasonCodes.map((rc) => rc.category)));

  return (
    <div className="ds-reason-code-picker space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Reason Code</label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category}>
              <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">{category}</p>
              <div className="grid grid-cols-1 gap-2">
                {reasonCodes
                  .filter((rc) => rc.category === category)
                  .map((rc) => (
                    <button
                      key={rc.code}
                      type="button"
                      onClick={() => onSelect(rc.code)}
                      className={`text-left px-3 py-2 rounded-lg border transition-colors ${
                        selectedCode === rc.code
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <p className="text-sm font-medium">{rc.label}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{rc.code}</p>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="narrative" className="block text-sm font-medium text-neutral-700 mb-2">
          Narrative {minNarrativeLength > 0 && <span className="text-neutral-500">(min {minNarrativeLength} chars)</span>}
        </label>
        <textarea
          id="narrative"
          rows={4}
          value={narrative || ''}
          onChange={(e) => onNarrativeChange(e.target.value)}
          className="block w-full rounded-lg border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Provide detailed explanation..."
        />
        {minNarrativeLength > 0 && narrative && narrative.length < minNarrativeLength && (
          <p className="mt-1 text-xs text-error-600">
            Minimum {minNarrativeLength} characters required ({narrative.length}/{minNarrativeLength})
          </p>
        )}
      </div>
    </div>
  );
};

// ComplianceScoreBadge Component (Protocol Control)
export interface ComplianceScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ComplianceScoreBadge: React.FC<ComplianceScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const getColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-success-500', text: 'text-white' };
    if (score >= 75) return { bg: 'bg-warning-500', text: 'text-white' };
    return { bg: 'bg-error-500', text: 'text-white' };
  };

  const color = getColor(score);
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  return (
    <div className="ds-compliance-score-badge inline-flex items-center gap-2">
      <div
        className={`${sizeStyles[size]} ${color.bg} ${color.text} rounded-full flex items-center justify-center font-bold`}
      >
        {score}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-neutral-700">Compliance Score</span>
      )}
    </div>
  );
};

// PlannedVsActualBar Component (Protocol Control)
export interface PlannedVsActualBarProps {
  planned: number;
  actual: number;
  unit?: string;
  label?: string;
}

export const PlannedVsActualBar: React.FC<PlannedVsActualBarProps> = ({
  planned,
  actual,
  unit = '',
  label,
}) => {
  const variance = ((actual - planned) / planned) * 100;
  const varianceColor = variance >= 0 ? 'text-success-600' : 'text-error-600';

  return (
    <div className="ds-planned-vs-actual-bar">
      {label && <p className="text-sm font-medium text-neutral-700 mb-2">{label}</p>}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Planned: {planned} {unit}</span>
          <span className="text-neutral-600">Actual: {actual} {unit}</span>
        </div>
        <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-primary-500"
            style={{ width: `${Math.min((actual / planned) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={varianceColor}>
            Variance: {variance >= 0 ? '+' : ''}{variance.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
