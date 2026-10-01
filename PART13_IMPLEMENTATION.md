# Part 13 — Design System & UI Framework

## Overview

Part 13 implements a comprehensive enterprise design system for the Construction ERP, providing a unified visual language, reusable components, and page templates that ensure consistency across all modules. The design system is inspired by SAP Fiori usability principles while maintaining original branding and accessibility compliance.

## Key Deliverables

### 1. Design Tokens (`tokens.css`)

**Color System**
- Primary palette: 10 shades (50-900) for brand consistency
- Semantic colors: Success, Warning, Error, Info with 3 shades each
- Neutral palette: 10 shades for text, borders, and backgrounds
- Dark theme support via CSS custom properties
- High contrast mode for accessibility

**Typography**
- System font stack for optimal performance
- 7 font sizes (xs to 3xl) following modular scale
- 4 font weights (normal, medium, semibold, bold)
- 3 line heights (tight, normal, relaxed)

**Spacing**
- 4pt grid system (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)
- Consistent spacing across all components
- Responsive adjustments for different breakpoints

**Other Tokens**
- Border radius: 6 levels (none to 2xl)
- Elevation: 5 shadow levels (none to xl)
- Motion: 3 transition speeds with easing functions
- Breakpoints: 6 responsive breakpoints (sm to 2xl)
- Z-index: 7 layers for proper stacking

### 2. Core Components (`components.tsx`)

**Button**
- 4 variants: primary, secondary, danger, ghost
- 3 sizes: sm, md, lg
- States: default, hover, focus, disabled, loading
- Icon support with proper spacing
- Keyboard accessible with focus indicators

**Input**
- Label, error, and help text support
- Icon placement (left)
- Validation states with ARIA attributes
- Responsive sizing
- Focus ring for accessibility

**Select**
- Options array with value/label
- Placeholder support
- Error and help text
- Disabled state handling
- Keyboard navigation

**Card**
- 3 padding options: none, sm, md, lg
- 4 elevation levels: none, sm, md, lg
- Flexible content container
- Consistent border and background

**Modal**
- 4 sizes: sm, md, lg, xl
- Backdrop with click-to-close
- Focus trapping
- Escape key to close
- Header, body, and footer sections
- ARIA attributes for screen readers

**DataTable**
- Server-side pagination ready
- Sortable columns
- Row selection with bulk actions
- Custom cell rendering
- Loading and empty states
- Keyboard navigation
- Responsive design

**StatusBadge**
- 8 status types: success, warning, error, info, neutral, pending, active, inactive
- 2 sizes: sm, md
- Consistent color mapping
- Accessible labels

**GateStatusPanel** (Protocol Control)
- Visual gate status display
- 4 states: pass, warn, fail, pending
- Color-coded indicators
- Action items display
- Expandable details

**ReasonCodePicker** (Protocol Control)
- Categorized reason codes
- Searchable list
- Narrative text area
- Minimum length validation
- Required field indicators

**ComplianceScoreBadge** (Protocol Control)
- Circular badge with score
- 3 sizes: sm, md, lg
- Color-coded by score range
- Optional label display

**PlannedVsActualBar** (Protocol Control)
- Dual progress bars
- Variance calculation
- Percentage display
- Color-coded indicators
- Unit support

### 3. Page Templates (`templates.tsx`)

**ListReport**
- Filter bar with multiple filter types
- Bulk action support
- Row selection
- Action buttons
- Responsive table layout
- Pagination ready

**ObjectPage**
- Header with title, subtitle, status
- Key metrics display
- Tab navigation
- Action buttons
- Responsive layout
- Breadcrumb support

**Worklist**
- Task list with priority indicators
- Status badges
- Due date display
- Click-to-navigate
- Filterable and sortable

**Dashboard**
- Widget grid layout
- Responsive sizing (sm, md, lg)
- Flexible content
- Consistent spacing

### 4. Style Guide (`StyleGuide.tsx`)

Comprehensive documentation page showcasing:
- All design tokens with visual examples
- Component library with interactive demos
- Page templates with sample data
- Protocol control components
- Accessibility guidelines
- Usage examples and best practices

## Integration

### Application Integration
- Added to main navigation as "Design System"
- Accessible via `/design-system` route
- Integrated with existing app shell
- Feature flag: `ff.ds`

### CSS Integration
- Tokens imported in main CSS file
- Tailwind CSS compatibility
- No conflicts with existing styles
- Progressive enhancement

## Accessibility Features

**WCAG 2.1 AA Compliance**
- Keyboard navigation for all interactive elements
- Focus indicators with sufficient contrast
- ARIA labels and roles
- Screen reader support
- Color contrast ratios ≥ 4.5:1
- Reduced motion support

**Keyboard Shortcuts**
- Tab/Shift+Tab: Navigate between elements
- Enter/Space: Activate buttons and links
- Escape: Close modals and dropdowns
- Arrow keys: Navigate within components

## Protocol Control Components

The design system includes specialized components for protocol controls:

1. **GateStatusPanel**: Displays validation gate status with pass/warn/fail indicators
2. **ReasonCodePicker**: Structured reason selection with narrative capture
3. **ComplianceScoreBadge**: Visual compliance score display
4. **PlannedVsActualBar**: Progress comparison with variance calculation

These components enforce the protocol control framework (Part 7) at the UI level.

## Design Principles

1. **Consistency**: Uniform spacing, colors, and typography across all modules
2. **Accessibility**: WCAG 2.1 AA compliance with keyboard and screen reader support
3. **Responsiveness**: Mobile-first design with breakpoints for all device sizes
4. **Performance**: Optimized CSS with minimal JavaScript
5. **Maintainability**: Token-based system for easy theme updates
6. **Scalability**: Component-based architecture for future extensions

## Migration Strategy

**Phase 1: Foundation (Current)**
- Design tokens established
- Core components built
- Style guide created
- Protocol components implemented

**Phase 2: Pilot Migration (Next)**
- Migrate 2-3 pilot screens
- Validate with users
- Gather feedback
- Refine components

**Phase 3: Full Migration (Future)**
- Module-by-module migration
- Behind feature flags (`ff.ds.<module>`)
- Parallel operation with legacy screens
- Progressive rollout

## Usage Examples

### Using a Button
```tsx
import { Button } from './design-system';

<Button variant="primary" size="md" onClick={handleClick}>
  Submit
</Button>
```

### Using DataTable
```tsx
import { DataTable } from './design-system';

<DataTable
  columns={columns}
  data={data}
  keyField="id"
  selectable
  onRowClick={handleRowClick}
/>
```

### Using GateStatusPanel
```tsx
import { GateStatusPanel } from './design-system';

<GateStatusPanel
  checks={[
    { id: '1', name: 'Budget Check', status: 'pass' },
    { id: '2', name: 'Approval', status: 'warn', action: 'Pending' },
  ]}
/>
```

## File Structure

```
src/design-system/
├── tokens.css          # Design tokens (colors, spacing, typography)
├── components.tsx      # Core UI components
├── templates.tsx       # Page templates
├── StyleGuide.tsx      # Living documentation
└── index.ts           # Main export file
```

## Statistics

- **Components**: 12 core components
- **Templates**: 4 page templates
- **Protocol Components**: 4 specialized components
- **Design Tokens**: 100+ tokens
- **Color Shades**: 40+ colors
- **Accessibility**: WCAG 2.1 AA compliant
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Next Steps

1. **Pilot Migration**: Select 2-3 screens for migration
2. **User Testing**: Validate design system with real users
3. **Component Expansion**: Add more specialized components
4. **Theme Customization**: Enable company-specific branding
5. **Documentation**: Expand style guide with more examples

## Conclusion

Part 13 establishes a robust foundation for the enterprise UI, providing a consistent, accessible, and maintainable design system that will scale across all 126 parts of the Construction ERP. The system balances visual appeal with functional requirements, ensuring that users have a productive and enjoyable experience while maintaining compliance with protocol controls and accessibility standards.
