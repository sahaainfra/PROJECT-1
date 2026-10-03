// Design System - Main Export File
// Part 13 — Unified Enterprise UI/UX & Design System

// Import tokens
import './tokens.css';

// Export components
export {
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

export type {
  ButtonProps,
  InputProps,
  SelectProps,
  SelectOption,
  CardProps,
  ModalProps,
  Column,
  DataTableProps,
  StatusBadgeProps,
  StatusType,
  GateCheck,
  GateStatusPanelProps,
  ReasonCode,
  ReasonCodePickerProps,
  ComplianceScoreBadgeProps,
  PlannedVsActualBarProps,
} from './components';

// Export templates
export {
  ListReport,
  ObjectPage,
  Worklist,
  Dashboard,
} from './templates';

export type {
  ListReportProps,
  ObjectPageProps,
  ObjectPageTab,
  WorklistProps,
  WorklistItem,
  DashboardProps,
  DashboardWidget,
} from './templates';

// Export style guide
export { DesignSystemGuide } from './StyleGuide';
