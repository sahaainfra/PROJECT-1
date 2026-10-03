// Part 15 — Responsive Shell Data

export interface DeviceConfig {
  type: 'mobile' | 'tablet' | 'desktop';
  breakpoint: number;
  navigation: 'bottom-nav' | 'rail' | 'sidebar';
  layout: 'single-column' | 'split-pane' | 'multi-panel';
  touchTargets: number;
  maxContentWidth: number;
}

export interface NavigationItem {
  code: string;
  label: string;
  icon: string;
  route: string;
  permission: string;
  badge?: number;
}

export interface DeviceCapability {
  code: string;
  name: string;
  icon: string;
  description: string;
  permission: string;
  supported: boolean;
}

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui';
  orientation: 'portrait' | 'landscape' | 'any';
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
}

export interface DeviceRegistration {
  deviceId: string;
  userId: string;
  platform: string;
  appVersion: string;
  pushToken?: string;
  registeredAt: string;
  lastSeenAt: string;
  isTrusted: boolean;
  revokedAt?: string;
}

// Device Configurations
export const deviceConfigs: Record<string, DeviceConfig> = {
  mobile: {
    type: 'mobile',
    breakpoint: 768,
    navigation: 'bottom-nav',
    layout: 'single-column',
    touchTargets: 44,
    maxContentWidth: 480
  },
  tablet: {
    type: 'tablet',
    breakpoint: 1024,
    navigation: 'rail',
    layout: 'split-pane',
    touchTargets: 44,
    maxContentWidth: 1024
  },
  desktop: {
    type: 'desktop',
    breakpoint: 1025,
    navigation: 'sidebar',
    layout: 'multi-panel',
    touchTargets: 32,
    maxContentWidth: 1440
  }
};

// Navigation Items by Role
export const navigationByRole: Record<string, NavigationItem[]> = {
  site_engineer: [
    { code: 'home', label: 'Home', icon: '🏠', route: '/dashboard', permission: 'dash.view' },
    { code: 'dpr', label: 'DPR', icon: '📋', route: '/site/dpr', permission: 'site.dpr.view' },
    { code: 'tasks', label: 'Tasks', icon: '✅', route: '/tasks/my', permission: 'task.view', badge: 3 },
    { code: 'chat', label: 'Chat', icon: '💬', route: '/chat', permission: 'chat.view' },
    { code: 'more', label: 'More', icon: '⋮', route: '/more', permission: 'core.view' }
  ],
  project_manager: [
    { code: 'home', label: 'Home', icon: '🏠', route: '/dashboard', permission: 'dash.view' },
    { code: 'projects', label: 'Projects', icon: '📊', route: '/projects', permission: 'org.project.view' },
    { code: 'approvals', label: 'Approvals', icon: '✓', route: '/workflow/approvals', permission: 'wf.task.view', badge: 5 },
    { code: 'reports', label: 'Reports', icon: '📈', route: '/reports', permission: 'report.view' },
    { code: 'more', label: 'More', icon: '⋮', route: '/more', permission: 'core.view' }
  ],
  store_keeper: [
    { code: 'home', label: 'Home', icon: '🏠', route: '/dashboard', permission: 'dash.view' },
    { code: 'stock', label: 'Stock', icon: '📦', route: '/inventory', permission: 'mat.stock.view' },
    { code: 'grn', label: 'GRN', icon: '📥', route: '/materials/grn', permission: 'mat.grn.create', badge: 2 },
    { code: 'issues', label: 'Issues', icon: '📤', route: '/materials/issues', permission: 'mat.issue.create' },
    { code: 'more', label: 'More', icon: '⋮', route: '/more', permission: 'core.view' }
  ],
  management: [
    { code: 'home', label: 'Home', icon: '🏠', route: '/dashboard', permission: 'dash.view' },
    { code: 'overview', label: 'Overview', icon: '📊', route: '/overview', permission: 'dash.view' },
    { code: 'approvals', label: 'Approvals', icon: '✓', route: '/workflow/approvals', permission: 'wf.task.view', badge: 8 },
    { code: 'reports', label: 'Reports', icon: '📈', route: '/reports', permission: 'report.view' },
    { code: 'more', label: 'More', icon: '⋮', route: '/more', permission: 'core.view' }
  ]
};

// Device Capabilities
export const deviceCapabilities: DeviceCapability[] = [
  {
    code: 'camera',
    name: 'Camera',
    icon: '📷',
    description: 'Capture photos for documentation',
    permission: 'device.camera',
    supported: true
  },
  {
    code: 'gps',
    name: 'GPS Location',
    icon: '📍',
    description: 'Record location for field activities',
    permission: 'device.gps',
    supported: true
  },
  {
    code: 'qr-scanner',
    name: 'QR/Barcode Scanner',
    icon: '📱',
    description: 'Scan QR codes and barcodes',
    permission: 'device.camera',
    supported: true
  },
  {
    code: 'file-picker',
    name: 'File Upload',
    icon: '📁',
    description: 'Upload documents and files',
    permission: 'doc.upload',
    supported: true
  },
  {
    code: 'signature',
    name: 'Signature Pad',
    icon: '✍️',
    description: 'Capture digital signatures',
    permission: 'device.signature',
    supported: true
  },
  {
    code: 'voice-input',
    name: 'Voice Input',
    icon: '🎤',
    description: 'Voice-to-text input',
    permission: 'device.microphone',
    supported: false
  }
];

// PWA Configuration
export const pwaConfig: PWAConfig = {
  name: 'Construction ERP',
  shortName: 'ERP',
  description: 'Integrated Construction Enterprise Resource Planning',
  themeColor: '#1e40af',
  backgroundColor: '#ffffff',
  display: 'standalone',
  orientation: 'any',
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png'
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png'
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png'
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png'
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png'
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ]
};

// Sample Device Registrations
export const deviceRegistrations: DeviceRegistration[] = [
  {
    deviceId: 'dev_mobile_001',
    userId: 'usr_store_001',
    platform: 'Android Chrome',
    appVersion: '1.0.0',
    pushToken: 'fcm_token_abc123',
    registeredAt: '2026-01-10T08:00:00Z',
    lastSeenAt: '2026-01-15T14:30:00Z',
    isTrusted: true
  },
  {
    deviceId: 'dev_tablet_001',
    userId: 'usr_pm_001',
    platform: 'iPad Safari',
    appVersion: '1.0.0',
    pushToken: 'apns_token_xyz789',
    registeredAt: '2026-01-05T10:00:00Z',
    lastSeenAt: '2026-01-15T16:00:00Z',
    isTrusted: true
  },
  {
    deviceId: 'dev_desktop_001',
    userId: 'usr_pm_001',
    platform: 'Windows Chrome',
    appVersion: '1.0.0',
    registeredAt: '2026-01-01T09:00:00Z',
    lastSeenAt: '2026-01-15T17:00:00Z',
    isTrusted: true
  }
];

// Responsive Breakpoints
export const breakpoints = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: Infinity }
};

// Performance Budgets
export const performanceBudgets = {
  firstLoad: 3000, // 3 seconds on 4G
  routeChange: 500, // 500ms
  imageLoad: 1000, // 1 second
  apiResponse: 500 // 500ms
};

// Protocol Control Points
export const protocolControlPoints = [
  {
    id: 'CP-RSP-01',
    stage: 'EXECUTE',
    control: 'Field-critical protocol actions (gate status, exception request, emergency execution, approvals) fully usable at 360 px',
    enforcement: 'BLOCK',
    status: 'observe'
  }
];

// Statistics
export const responsiveStats = {
  totalDevices: deviceRegistrations.length,
  mobileDevices: deviceRegistrations.filter(d => d.platform.includes('Android') || d.platform.includes('iOS')).length,
  tabletDevices: deviceRegistrations.filter(d => d.platform.includes('iPad') || d.platform.includes('Tablet')).length,
  desktopDevices: deviceRegistrations.filter(d => d.platform.includes('Windows') || d.platform.includes('Mac')).length,
  trustedDevices: deviceRegistrations.filter(d => d.isTrusted).length,
  capabilities: deviceCapabilities.filter(c => c.supported).length
};
