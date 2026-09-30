import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Database, Shield, FileText, TestTube, 
  Flag, BookOpen, Settings, Bell, Search, Menu, X,
  ChevronRight, Activity, CheckCircle2, AlertTriangle, Clock
} from 'lucide-react';
import { Launchpad } from './components/Launchpad';
import { BaselineOverview } from './components/BaselineOverview';
import { FeatureFlags } from './components/FeatureFlags';
import { ProtocolControls } from './components/ProtocolControls';
import { RegressionTests } from './components/RegressionTests';
import { Documentation } from './components/Documentation';
import { AcceptancePanel } from './components/AcceptancePanel';
import { systemInfo } from './data/mockData';

type View = 'launchpad' | 'baseline' | 'flags' | 'protocol' | 'regression' | 'docs' | 'acceptance';

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'launchpad', label: 'Launchpad', icon: <LayoutDashboard size={20} /> },
  { id: 'baseline', label: 'System Baseline', icon: <Database size={20} /> },
  { id: 'flags', label: 'Feature Flags', icon: <Flag size={20} /> },
  { id: 'protocol', label: 'Protocol Controls', icon: <Shield size={20} /> },
  { id: 'regression', label: 'Regression Tests', icon: <TestTube size={20} /> },
  { id: 'docs', label: 'Documentation', icon: <BookOpen size={20} /> },
  { id: 'acceptance', label: 'Acceptance', icon: <CheckCircle2 size={20} /> },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('launchpad');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextCompany, setContextCompany] = useState('Acme Construction Ltd.');
  const [contextProject, setContextProject] = useState('All Projects');

  const renderView = () => {
    switch (currentView) {
      case 'launchpad': return <Launchpad onNavigate={setCurrentView} />;
      case 'baseline': return <BaselineOverview />;
      case 'flags': return <FeatureFlags />;
      case 'protocol': return <ProtocolControls />;
      case 'regression': return <RegressionTests />;
      case 'docs': return <Documentation />;
      case 'acceptance': return <AcceptancePanel />;
      default: return <Launchpad onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Shell Bar */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg z-50 relative">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
                ERP
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold leading-tight">Construction ERP</h1>
                <p className="text-[10px] text-slate-400 leading-tight">Program Baseline Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search modules, controls, documentation..."
                className="w-full bg-white/10 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Context Switcher */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <select 
                value={contextCompany}
                onChange={(e) => setContextCompany(e.target.value)}
                className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option>Acme Construction Ltd.</option>
                <option>Beta Builders Inc.</option>
              </select>
              <ChevronRight size={12} className="text-slate-500" />
              <select 
                value={contextProject}
                onChange={(e) => setContextProject(e.target.value)}
                className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option>All Projects</option>
                <option>Riverside Tower</option>
                <option>Highway Bridge Phase 2</option>
              </select>
            </div>

            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2 ml-2">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                SA
              </div>
              <span className="hidden sm:block text-xs text-slate-300">System Admin</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-slate-900/50 border-t border-white/5 px-4 py-1 flex items-center gap-4 text-[10px] text-slate-400 overflow-x-auto">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Activity size={10} className="text-green-400" />
            System Healthy
          </span>
          <span className="whitespace-nowrap">Baseline: {systemInfo.baselineTag}</span>
          <span className="whitespace-nowrap">Commit: {systemInfo.gitCommit}</span>
          <span className="whitespace-nowrap flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            ff.pgm: ON
          </span>
          <span className="whitespace-nowrap">Integrity: 100%</span>
          <span className="whitespace-nowrap">Last check: {new Date(systemInfo.lastCheck).toLocaleString()}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || typeof window !== 'undefined') && (
            <motion.aside 
              className={`
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 fixed lg:relative z-40 
                w-64 bg-white border-r border-slate-200 
                h-[calc(100vh-72px)] overflow-y-auto
                transition-transform duration-200 ease-in-out
                flex-shrink-0
              `}
            >
              <nav className="p-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                  Navigation
                </div>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${currentView === item.id 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    <span className={currentView === item.id ? 'text-blue-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                    {currentView === item.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" 
                      />
                    )}
                  </button>
                ))}

                <div className="border-t border-slate-100 mt-4 pt-4">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                    Quick Links
                  </div>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                    <Settings size={16} />
                    System Settings
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                    <FileText size={16} />
                    CHANGELOG
                  </a>
                </div>
              </nav>

              {/* Sidebar footer */}
              <div className="p-3 mt-auto border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-slate-500">Phase: FOUNDATION</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Part 0 of 126</span>
                      <span>0.8%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '0.8%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
