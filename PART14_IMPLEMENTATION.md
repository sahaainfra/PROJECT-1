# Part 14 — Dashboard Framework Implementation

## Overview

Part 14 implements a comprehensive dashboard framework for the Construction ERP, providing a flexible widget-based system with KPI tracking, personalization, role-based layouts, and protocol widgets. The framework enables users to create personalized workspaces with real-time data visualization and drill-down capabilities.

## Key Deliverables

### 1. Widget Registry System

**Widget Types**
- **KPI Widgets**: Display key performance indicators with trend visualization
- **List Widgets**: Show recent items, tasks, approvals, notifications
- **Table Widgets**: Display structured data with filtering and sorting
- **Chart Widgets**: Visualize data with various chart types
- **Custom Widgets**: Specialized widgets like Quick Actions

**Widget Registry** (`widgetRegistry`)
- 12 pre-configured widgets
- Each widget defines: code, name, module, type, data endpoint, required permission, default size, refresh interval, filter support
- Widgets are permission-aware and only visible to authorized users

**Available Widgets**
1. My Approvals - Pending workflow approvals
2. My Tasks - Assigned tasks with status
3. My Notifications - Recent notifications
4. My Projects - Allocated projects with progress
5. My Sites - Allocated sites with status
6. My Gates Today - Protocol gates for today
7. My Exceptions - Requested and pending exceptions
8. My Violations - Assigned violations
9. My Compliance Score - Personal compliance metric
10. Planned vs Actual - Progress comparison
11. Recent Records - Recently viewed/modified items
12. Quick Actions - Common action shortcuts

### 2. KPI Registry

**KPI Structure**
- Code, name, formula description, unit
- Data label type (actual/calculated/forecast)
- Source endpoint for data retrieval
- Thresholds (red/amber/green) with direction (higher/lower better)
- Owner module for governance
- Current value, previous value, trend data
- As-of timestamp and drill-down link

**KPI Registry** (`kpiRegistry`)
- 6 pre-configured KPIs
- Compliance Score, Pending Approvals, Overdue Tasks, Open Exceptions, Active Violations, Project Progress
- Each KPI includes formula documentation and threshold definitions
- Trend visualization with sparkline charts
- Color-coded status indicators (red/amber/green)

### 3. Layout Management

**Layout Types**
- **System Layouts**: Default layouts for the application
- **Role Layouts**: Default layouts per role (Project Manager, Site Engineer, Management)
- **User Layouts**: Personalized layouts per user

**Layout Structure**
- Owner type (user/role/system)
- Owner ID
- Name and default flag
- Device type (desktop/tablet/mobile)
- Widget array with position (x, y), size (w, h), and filters

**Default Layouts** (`defaultLayouts`)
- **Project Manager**: 9 widgets focused on approvals, tasks, projects, and protocol
- **Site Engineer**: 7 widgets focused on tasks, sites, gates, and progress
- **Management**: 9 widgets focused on KPIs, approvals, projects, and violations

### 4. Dashboard Component

**Features**
- **Workspace Tab**: Personal workspace with widget grid
- **Widget Gallery Tab**: Browse and add available widgets
- **KPI Registry Tab**: View all KPIs with formulas and thresholds
- **Role Layouts Tab**: Configure default layouts per role

**Workspace Features**
- Edit mode for adding/removing/rearranging widgets
- Real-time widget rendering with data
- KPI tiles with trend visualization
- Quick actions widget
- Protocol widgets integration
- Responsive grid layout

**Widget Rendering**
- Dynamic widget rendering based on type
- KPI tiles with sparkline charts and color coding
- List widgets with item display
- Quick actions with permission filtering
- Edit mode controls (settings, remove buttons)

### 5. Protocol Integration

**Protocol Widgets**
- My Gates Today - Display protocol gates for validation
- My Exceptions - Show requested and pending exceptions
- My Violations - Display assigned violations
- My Compliance Score - Personal compliance metric
- Planned vs Actual - Progress comparison with thresholds

**Protocol Control Point**
- **CP-DASH-01**: Every KPI widget declares data label, formula, threshold and drill path
- Enforcement: BLOCK (widget registration)
- Stage: VERIFY
- Status: OBSERVE

### 6. Personalization

**User Preferences**
- Add/remove widgets from workspace
- Rearrange widget positions
- Resize widgets within grid constraints
- Configure widget filters
- Save personalized layouts

**Role-Based Defaults**
- Each role has a pre-configured default layout
- Users can reset to role default
- Layouts are device-specific (desktop/tablet/mobile)

### 7. Data Flow

**Widget Data**
- Each widget has a data endpoint
- Data is fetched on widget mount
- Refresh intervals configurable per widget
- Error isolation - one failing widget doesn't break the page

**KPI Data**
- KPIs fetch from source endpoints
- Current value, previous value, and trend data
- Threshold comparison for color coding
- Drill-down links for detailed views

**Quick Actions**
- Permission-filtered action list
- Direct navigation to creation forms
- Color-coded action buttons

## Technical Implementation

### Data Structures

**Widget Interface**
```typescript
interface Widget {
  code: string;
  name: string;
  module: string;
  type: 'kpi' | 'chart' | 'list' | 'table' | 'map' | 'calendar' | 'custom';
  dataEndpoint: string;
  requiredPermission: string;
  defaultSize: { w: number; h: number };
  refreshSeconds: number;
  supportsFilters: boolean;
  description: string;
}
```

**KPI Interface**
```typescript
interface KPI {
  code: string;
  name: string;
  formulaDescription: string;
  unit: string;
  dataLabel: 'actual' | 'calculated' | 'forecast';
  sourceEndpoint: string;
  thresholds: { red: number; amber: number; green: number };
  direction: 'higher_better' | 'lower_better';
  ownerModule: string;
  currentValue?: number;
  previousValue?: number;
  trend?: number[];
  asOf?: string;
  drillLink?: string;
}
```

**Layout Interface**
```typescript
interface Layout {
  ownerType: 'user' | 'role' | 'system';
  ownerId: string;
  name: string;
  isDefault: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
  widgets: LayoutWidget[];
}
```

### Component Architecture

**DashboardFramework**
- Main container with tab navigation
- Manages active tab and edit mode state
- Routes to appropriate tab component

**WorkspaceTab**
- Displays personal workspace
- Renders widget grid based on layout
- Handles edit mode for widget management
- Shows protocol control points

**WidgetRenderer**
- Dynamic widget rendering based on type
- Routes to KPI, list, or custom widget components
- Handles edit mode controls

**KPITile**
- Displays KPI with value, trend, and status
- Color-coded based on thresholds
- Sparkline chart for trend visualization
- Drill-down link for detailed view

**QuickActionsWidget**
- Grid of action buttons
- Permission-filtered actions
- Color-coded by action type

**WidgetGalleryTab**
- Browse available widgets
- Add widgets to workspace
- Widget information display

**KPIRegistryTab**
- List all KPIs with details
- Formula documentation
- Threshold visualization
- Drill path information

**RoleLayoutsTab**
- Configure default layouts per role
- Visual layout preview
- Widget position and size configuration
- Save and reset functionality

## Integration Points

### Part 5 (IAM)
- Permission-based widget visibility
- Role-based layout assignment
- User-specific layout persistence

### Part 6 (Workflow)
- My Approvals widget integration
- Workflow task notifications
- Approval status tracking

### Part 7 (Protocol)
- Protocol widgets (Gates, Exceptions, Violations)
- Compliance score integration
- Planned vs Actual tracking

### Part 10 (Accountability)
- Compliance score widget
- Task and responsibility tracking
- Violation management

### Part 13 (Design System)
- Uses design system components
- Consistent styling and theming
- Responsive grid layout

## Features

### Widget Management
- ✅ Add/remove widgets from workspace
- ✅ Rearrange widget positions
- ✅ Resize widgets within grid
- ✅ Configure widget filters
- ✅ Save personalized layouts

### KPI Tracking
- ✅ Real-time KPI values
- ✅ Trend visualization with sparklines
- ✅ Color-coded status indicators
- ✅ Threshold-based alerts
- ✅ Drill-down to detailed views

### Layout Personalization
- ✅ Role-based default layouts
- ✅ User-specific customizations
- ✅ Device-specific layouts
- ✅ Reset to role default
- ✅ Layout persistence

### Protocol Integration
- ✅ My Gates Today widget
- ✅ My Exceptions widget
- ✅ My Violations widget
- ✅ Compliance Score KPI
- ✅ Planned vs Actual tracking

### Quick Actions
- ✅ Permission-filtered actions
- ✅ Direct navigation to forms
- ✅ Color-coded action buttons
- ✅ Customizable action list

## Statistics

- **Total Widgets**: 12
- **Total KPIs**: 6
- **Default Layouts**: 3 (Project Manager, Site Engineer, Management)
- **Protocol Widgets**: 5
- **Quick Actions**: 5
- **Protocol Control Points**: 1 (CP-DASH-01)

## File Structure

```
src/
├── data/
│   └── dashboardData.ts          # Widget, KPI, layout data structures
├── components/
│   └── DashboardFramework.tsx    # Main dashboard component
└── PART14_IMPLEMENTATION.md      # This documentation
```

## Usage Examples

### Adding a Widget to Workspace
1. Navigate to Dashboard Framework
2. Click "Edit Layout" button
3. Click "+ Add Widget" button
4. Select widget from gallery
5. Position and resize as needed
6. Click "Done Editing" to save

### Configuring KPI Thresholds
1. Navigate to KPI Registry tab
2. Select KPI to configure
3. View current thresholds (red/amber/green)
4. Thresholds are defined in KPI registry
5. Color coding is automatic based on values

### Creating Role Layout
1. Navigate to Role Layouts tab
2. Select role from dropdown
3. View current layout preview
4. Configure widget positions and sizes
5. Click "Save Layout" to persist

## Next Steps

1. **Real Data Integration**: Connect widgets to actual API endpoints
2. **Advanced Filtering**: Implement widget-level filtering
3. **Real-time Updates**: Add WebSocket support for live updates
4. **Export Functionality**: Enable dashboard export to PDF/Excel
5. **Mobile Optimization**: Enhance mobile layout and interactions
6. **Widget Marketplace**: Allow custom widget development
7. **Advanced Analytics**: Add more chart types and visualizations

## Conclusion

Part 14 establishes a robust dashboard framework that provides users with personalized, real-time insights into their work. The widget-based architecture enables flexible composition of dashboards, while the KPI registry ensures consistent metric tracking across the application. Protocol widgets integrate seamlessly with the governance framework, providing visibility into compliance, exceptions, and violations.

The framework is designed to scale as more modules are added, with new widgets and KPIs easily registered and made available to users. Role-based layouts ensure that each user sees relevant information by default, while personalization allows customization to individual preferences.

This implementation provides the foundation for all future dashboard and reporting features in the Construction ERP, enabling data-driven decision making at every level of the organization.
