import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personas, widgetRegistry, sampleFeedback, type Persona, type WidgetMeta } from '../data/previewData';
import { Dashboard } from './Dashboard';
import { PreviewBanner, StatusBadge } from './widgets/WidgetShell';
import { 
  Smartphone, Tablet, Monitor, MessageSquare, X, Send, 
  ChevronDown, Layout, Eye, CheckCircle2, AlertCircle
} from 'lucide-react';

type DeviceFrame = 'mobile' | 'tablet' | 'desktop';

interface PreviewShellProps {
  onBack: () => void;
}

export function PreviewShell({ onBack }: PreviewShellProps) {
  const [currentPersona, setCurrentPersona] = useState<Persona>('pm');
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('desktop');
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWidgetBoard, setShowWidgetBoard] = useState(false);
  const [feedbackWidget, setFeedbackWidget] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackDecision, setFeedbackDecision] = useState<'accepted' | 'change_requested'>('change_requested');

  const currentPersonaInfo = personas.find(p => p.id === currentPersona)!;

  const handleFeedback = (widgetCode: string) => {
    setFeedbackWidget(widgetCode);
    setShowFeedback(true);
  };

  const submitFeedback = () => {
    if (feedbackText.trim() && feedbackWidget) {
      // In real app, this would POST to the API
      console.log('Feedback submitted:', { widgetCode: feedbackWidget, comment: feedbackText, decision: feedbackDecision });
      setFeedbackText('');
      setShowFeedback(false);
      setFeedbackWidget(null);
    }
  };

  // Device frame widths
  const frameWidths: Record<DeviceFrame, string> = {
    'mobile': 'max-w-[375px]',
    'tablet': 'max-w-[820px]',
    'desktop': 'max-w-full',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Preview Banner */}
      <PreviewBanner />

      {/* Preview Shell Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-900">Live Preview</span>
          </div>

          {/* Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaPicker(!showPersonaPicker)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <span className="text-sm">{currentPersonaInfo.icon}</span>
              <span className="text-xs font-medium text-slate-900">{currentPersonaInfo.name}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            <AnimatePresence>
              {showPersonaPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg p-2 w-64 z-50 max-h-96 overflow-y-auto"
                >
                  {personas.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setCurrentPersona(p.id); setShowPersonaPicker(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        currentPersona === p.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{p.icon}</span>
                      <div>
                        <p className="text-xs font-medium">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.description}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Device Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setDeviceFrame('mobile')}
              className={`p-1.5 rounded-md transition-colors ${deviceFrame === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Mobile (360px)"
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={() => setDeviceFrame('tablet')}
              className={`p-1.5 rounded-md transition-colors ${deviceFrame === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Tablet (820px)"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setDeviceFrame('desktop')}
              className={`p-1.5 rounded-md transition-colors ${deviceFrame === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Desktop (1440px)"
            >
              <Monitor size={16} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWidgetBoard(!showWidgetBoard)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-700"
            >
              <Layout size={14} />
              Widget Board
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-xs font-medium text-blue-700"
            >
              <MessageSquare size={14} />
              Feedback
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Device Frame Container */}
        <div className="flex-1 flex justify-center p-4 overflow-auto">
          <div className={`${frameWidths[deviceFrame]} w-full transition-all duration-300`}>
            {/* Device Frame */}
            <div className={`
              bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200
              ${deviceFrame === 'mobile' ? 'mx-auto' : ''}
            `}>
              {/* Simulated device header */}
              {deviceFrame === 'mobile' && (
                <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 border border-white/50 rounded-sm">
                      <div className="w-2 h-full bg-green-400 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Content */}
              <div className={`${deviceFrame === 'mobile' ? 'p-3' : 'p-4'} min-h-[600px]`}>
                <Dashboard persona={currentPersona} onFeedback={handleFeedback} />
              </div>
            </div>
          </div>
        </div>

        {/* Widget Board Sidebar */}
        <AnimatePresence>
          {showWidgetBoard && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-slate-200 overflow-hidden flex-shrink-0"
            >
              <div className="p-4 w-80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">Widget Status Board</h3>
                  <button onClick={() => setShowWidgetBoard(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {widgetRegistry
                    .filter(w => w.persona.includes(currentPersona))
                    .map(w => (
                      <div key={w.code} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-900">{w.title}</span>
                          <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              w.status === 'PREVIEW' ? 'bg-amber-100 text-amber-700' :
                              w.status === 'LIVE' ? 'bg-blue-100 text-blue-700' :
                              w.status === 'PROMOTED' ? 'bg-green-100 text-green-700' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {w.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                          <span>Source: {w.futureSourcePrompt}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MessageSquare size={8} />
                            {w.feedbackCount}
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <span className={`text-[9px] px-1 py-0.5 rounded ${
                            w.dataMode === 'fixture' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {w.dataMode === 'fixture' ? '📋 Fixture Data' : '🟢 Live Data'}
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback Drawer */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-50 max-h-[50vh] overflow-y-auto"
          >
            <div className="p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  {feedbackWidget ? `Feedback: ${widgetRegistry.find(w => w.code === feedbackWidget)?.title}` : 'Screen Feedback'}
                </h3>
                <button onClick={() => { setShowFeedback(false); setFeedbackWidget(null); }} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              {/* Decision Toggle */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setFeedbackDecision('accepted')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    feedbackDecision === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  Accept Layout
                </button>
                <button
                  onClick={() => setFeedbackDecision('change_requested')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    feedbackDecision === 'change_requested' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}
                >
                  <AlertCircle size={14} />
                  Request Change
                </button>
              </div>

              {/* Comment Input */}
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your feedback on this screen/widget..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-slate-400">
                  Feedback is recorded in preview_feedback and exported to the program backlog
                </span>
                <button
                  onClick={submitFeedback}
                  disabled={!feedbackText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={12} />
                  Submit
                </button>
              </div>

              {/* Recent Feedback */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Feedback</h4>
                <div className="space-y-2">
                  {sampleFeedback.slice(0, 3).map(fb => (
                    <div key={fb.id} className="p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-700">{fb.reviewer}</span>
                        <StatusBadge status={fb.decision} />
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{fb.comment}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{fb.screen} · {new Date(fb.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
