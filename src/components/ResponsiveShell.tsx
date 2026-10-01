import { useState, useEffect } from 'react';
import {
  deviceConfigs,
  navigationByRole,
  deviceCapabilities,
  pwaConfig,
  responsiveStats,
  protocolControlPoints
} from '../data/responsiveData';

export function ResponsiveShell() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [currentRole, setCurrentRole] = useState('site_engineer');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📱' },
    { id: 'shells', label: 'Shell Variants', icon: '🖥️' },
    { id: 'capabilities', label: 'Device Capabilities', icon: '📷' },
    { id: 'pwa', label: 'PWA Setup', icon: '📲' },
    { id: 'navigation', label: 'Navigation Maps', icon: '🧭' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Responsive Shell</h1>
          <p className="text-sm text-slate-500 mt-1">Part 15 — Mobile + Tablet + Desktop Experience with PWA support</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
            ff.rsp
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'shells' && <ShellsTab currentDevice={currentDevice} setCurrentDevice={setCurrentDevice} />}
      {activeTab === 'capabilities' && <CapabilitiesTab />}
      {activeTab === 'pwa' && <PWATab showInstallPrompt={showInstallPrompt} setShowInstallPrompt={setShowInstallPrompt} />}
      {activeTab === 'navigation' && <NavigationTab currentRole={currentRole} setCurrentRole={setCurrentRole} />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Devices"
          value={responsiveStats.totalDevices}
          subtitle="Registered"
          icon="📱"
          color="teal"
        />
        <StatCard
          title="Mobile"
          value={responsiveStats.mobileDevices}
          subtitle="Active"
          icon="📱"
          color="blue"
        />
        <StatCard
          title="Tablet"
          value={responsiveStats.tabletDevices}
          subtitle="Active"
          icon="📱"
          color="purple"
        />
        <StatCard
          title="Capabilities"
          value={responsiveStats.capabilities}
          subtitle="Supported"
          icon="⚡"
          color="green"
        />
      </div>

      {/* Device Configurations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Device Configurations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(deviceConfigs).map(config => (
            <div key={config.type} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-900 capitalize">{config.type}</h4>
                <span className="text-xs text-slate-500">&lt; {config.breakpoint}px</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Navigation:</span>
                  <span className="font-medium text-slate-700">{config.navigation.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Layout:</span>
                  <span className="font-medium text-slate-700">{config.layout.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Touch Targets:</span>
                  <span className="font-medium text-slate-700">{config.touchTargets}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Width:</span>
                  <span className="font-medium text-slate-700">{config.maxContentWidth}px</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {protocolControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded">
                    {cp.stage}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                    {cp.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShellsTab({ currentDevice, setCurrentDevice }: { 
  currentDevice: 'mobile' | 'tablet' | 'desktop'; 
  setCurrentDevice: (v: 'mobile' | 'tablet' | 'desktop') => void 
}) {
  return (
    <div className="space-y-6">
      {/* Device Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Preview Device:</span>
          {(['mobile', 'tablet', 'desktop'] as const).map(device => (
            <button
              key={device}
              onClick={() => setCurrentDevice(device)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentDevice === device
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {device === 'mobile' ? '📱 Mobile' : device === 'tablet' ? '📱 Tablet' : '🖥️ Desktop'}
            </button>
          ))}
        </div>
      </div>

      {/* Shell Preview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Shell Preview - {currentDevice}</h3>
        
        <div className={`mx-auto border-2 border-slate-300 rounded-lg overflow-hidden ${
          currentDevice === 'mobile' ? 'max-w-[375px]' :
          currentDevice === 'tablet' ? 'max-w-[768px]' :
          'max-w-full'
        }`}>
          {/* Shell Header */}
          <div className="bg-slate-900 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-sm font-bold">
                  ERP
                </div>
                <span className="text-sm font-semibold">Construction ERP</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-800 rounded">🔔</button>
                <button className="p-2 hover:bg-slate-800 rounded">👤</button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex min-h-[500px]">
            {/* Navigation */}
            {currentDevice === 'desktop' && (
              <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
                <nav className="space-y-2">
                  {['Home', 'Projects', 'Materials', 'Finance', 'Reports'].map(item => (
                    <button key={item} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 rounded">
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {currentDevice === 'tablet' && (
              <div className="w-20 bg-slate-50 border-r border-slate-200 p-2">
                <nav className="space-y-2">
                  {['🏠', '📊', '📦', '💰', '📈'].map((icon, idx) => (
                    <button key={idx} className="w-full p-3 text-center hover:bg-slate-200 rounded">
                      {icon}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
                <p className="text-sm text-slate-500">Welcome back, User</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-blue-900">5</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600">Tasks Due</p>
                  <p className="text-2xl font-bold text-green-900">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation (Mobile Only) */}
          {currentDevice === 'mobile' && (
            <div className="bg-white border-t border-slate-200 px-2 py-2">
              <div className="flex items-center justify-around">
                {[
                  { icon: '🏠', label: 'Home' },
                  { icon: '📋', label: 'DPR' },
                  { icon: '✅', label: 'Tasks' },
                  { icon: '💬', label: 'Chat' },
                  { icon: '⋮', label: 'More' }
                ].map(item => (
                  <button key={item.label} className="flex flex-col items-center p-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs text-slate-600 mt-1">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Features */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Responsive Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Mobile (&lt; 768px)</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>• Bottom navigation with 5 items</li>
              <li>• Single column layout</li>
              <li>• 44px touch targets</li>
              <li>• Stepper forms</li>
              <li>• Card-based lists</li>
              <li>• Sticky primary actions</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Tablet (768-1023px)</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>• Navigation rail</li>
              <li>• Split pane layout</li>
              <li>• 44px touch targets</li>
              <li>• Side-by-side views</li>
              <li>• Optimized for touch</li>
              <li>• Landscape & portrait</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Desktop (≥ 1024px)</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>• Full sidebar navigation</li>
              <li>• Multi-panel layout</li>
              <li>• 32px touch targets</li>
              <li>• Keyboard shortcuts</li>
              <li>• Dense information display</li>
              <li>• Hover interactions</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Performance</h4>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>• First load &lt; 3s on 4G</li>
              <li>• Route chunks lazy-loaded</li>
              <li>• Responsive images</li>
              <li>• Offline-ready foundation</li>
              <li>• Service worker caching</li>
              <li>• Push notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CapabilitiesTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Device Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deviceCapabilities.map(capability => (
            <div key={capability.code} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{capability.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{capability.name}</h4>
                    <p className="text-xs text-slate-500">{capability.code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  capability.supported ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {capability.supported ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2">{capability.description}</p>
              <p className="text-xs text-slate-500">
                Permission: <span className="font-mono">{capability.permission}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Capture Components */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Capture Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">📷 Camera Capture</h4>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• Multi-photo capture</li>
              <li>• Automatic compression (≤ 500KB)</li>
              <li>• Annotation tools</li>
              <li>• Front/back camera selection</li>
              <li>• Flash control</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">📍 GPS Capture</h4>
            <ul className="space-y-1 text-xs text-green-700">
              <li>• High accuracy mode</li>
              <li>• Accuracy display to user</li>
              <li>• Permission prompts</li>
              <li>• Mock location detection</li>
              <li>• Coordinate formatting</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">📱 QR/Barcode Scanner</h4>
            <ul className="space-y-1 text-xs text-purple-700">
              <li>• QR code scanning</li>
              <li>• Barcode scanning</li>
              <li>• Real-time detection</li>
              <li>• Manual entry fallback</li>
              <li>• History tracking</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-900 mb-2">✍️ Signature Pad</h4>
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• Touch signature capture</li>
              <li>• Clear/redo options</li>
              <li>• PNG export</li>
              <li>• Timestamp embedding</li>
              <li>• Verification hash</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PWATab({ showInstallPrompt, setShowInstallPrompt }: { 
  showInstallPrompt: boolean; 
  setShowInstallPrompt: (v: boolean) => void 
}) {
  return (
    <div className="space-y-6">
      {/* PWA Configuration */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">PWA Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">App Info</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-700">{pwaConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Short Name:</span>
                <span className="font-medium text-slate-700">{pwaConfig.shortName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Display:</span>
                <span className="font-medium text-slate-700">{pwaConfig.display}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Orientation:</span>
                <span className="font-medium text-slate-700">{pwaConfig.orientation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Theme Color:</span>
                <span className="font-medium text-slate-700">{pwaConfig.themeColor}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Icons</h4>
            <div className="grid grid-cols-4 gap-2">
              {pwaConfig.icons.map((icon, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded flex items-center justify-center text-xs font-bold text-teal-700">
                    {icon.sizes.split('x')[0]}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{icon.sizes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PWA Features */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">PWA Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">✓ Installable</h4>
            <p className="text-xs text-green-700">
              App can be installed to home screen with full-screen experience
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">✓ Offline Capable</h4>
            <p className="text-xs text-green-700">
              Service worker caches shell for offline access
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">✓ Push Notifications</h4>
            <p className="text-xs text-green-700">
              Real-time notifications via configured provider
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">✓ Auto-Update</h4>
            <p className="text-xs text-green-700">
              Automatic updates with user notification
            </p>
          </div>
        </div>
      </div>

      {/* Install Prompt Demo */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Install Prompt</h3>
        <button
          onClick={() => setShowInstallPrompt(!showInstallPrompt)}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 mb-4"
        >
          {showInstallPrompt ? 'Hide' : 'Show'} Install Prompt
        </button>

        {showInstallPrompt && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📲</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Install Construction ERP</h4>
                <p className="text-xs text-blue-700 mb-3">
                  Add to your home screen for quick access and offline support
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
                    Install
                  </button>
                  <button className="px-3 py-1.5 bg-white text-blue-700 text-xs font-medium rounded border border-blue-300 hover:bg-blue-50">
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavigationTab({ currentRole, setCurrentRole }: { 
  currentRole: string; 
  setCurrentRole: (v: string) => void 
}) {
  const navItems = navigationByRole[currentRole] || [];

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Select Role:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="site_engineer">Site Engineer</option>
            <option value="project_manager">Project Manager</option>
            <option value="store_keeper">Store Keeper</option>
            <option value="management">Management</option>
          </select>
        </div>
      </div>

      {/* Navigation Map */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Navigation Map - {currentRole.replace('_', ' ').toUpperCase()}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navItems.map(item => (
            <div key={item.code} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">{item.label}</h4>
                  <p className="text-xs text-slate-500 font-mono">{item.route}</p>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Permission: <span className="font-mono text-slate-700">{item.permission}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Nav Preview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Mobile Bottom Navigation</h3>
        <div className="max-w-[375px] mx-auto border-2 border-slate-300 rounded-lg overflow-hidden">
          <div className="bg-slate-100 p-4 min-h-[300px]">
            <p className="text-sm text-slate-500 text-center">Content Area</p>
          </div>
          <div className="bg-white border-t border-slate-200 px-2 py-2">
            <div className="flex items-center justify-around">
              {navItems.slice(0, 5).map(item => (
                <button key={item.code} className="flex flex-col items-center p-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs text-slate-600 mt-1">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    teal: 'bg-teal-50 border-teal-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
