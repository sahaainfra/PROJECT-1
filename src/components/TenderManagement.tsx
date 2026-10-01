import { useState } from 'react';
import {
  tenders,
  eligibilityCriteria,
  pqScores,
  tenderDocuments,
  addenda,
  clarifications,
  submissionChecklist,
  emds,
  bidResults,
  tenderDecisions,
  protocolControlPoints,
  tenderStats,
  pipelineStages
} from '../data/tenderData';

export function TenderManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTender, setSelectedTender] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Pipeline', icon: '📊' },
    { id: 'register', label: 'Tender Register', icon: '📋' },
    { id: 'eligibility', label: 'Eligibility & PQ', icon: '✓' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'checklist', label: 'Submission', icon: '📝' },
    { id: 'emd', label: 'EMD Tracking', icon: '💰' },
    { id: 'results', label: 'Bid Results', icon: '🏆' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tender Management</h1>
          <p className="text-sm text-slate-500 mt-1">Part 22 — Complete tender lifecycle from identification to award</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
            ff.tnd
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
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700'
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
      {activeTab === 'register' && <RegisterTab selectedTender={selectedTender} setSelectedTender={setSelectedTender} />}
      {activeTab === 'eligibility' && <EligibilityTab selectedTender={selectedTender} setSelectedTender={setSelectedTender} />}
      {activeTab === 'documents' && <DocumentsTab selectedTender={selectedTender} setSelectedTender={setSelectedTender} />}
      {activeTab === 'checklist' && <ChecklistTab selectedTender={selectedTender} setSelectedTender={setSelectedTender} />}
      {activeTab === 'emd' && <EMDTab />}
      {activeTab === 'results' && <ResultsTab selectedTender={selectedTender} setSelectedTender={setSelectedTender} />}
      {activeTab === 'analytics' && <AnalyticsTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Tenders"
          value={tenderStats.activeTenders}
          subtitle={`${tenderStats.totalTenders} total`}
          icon="📋"
          color="purple"
        />
        <StatCard
          title="Win Rate"
          value={`${tenderStats.winRate}%`}
          subtitle={`${tenderStats.wonTenders} won, ${tenderStats.lostTenders} lost`}
          icon="🏆"
          color="green"
        />
        <StatCard
          title="Pipeline Value"
          value={`₹${(tenderStats.totalBidValue / 10000000).toFixed(0)} Cr`}
          subtitle="Total estimated"
          icon="💰"
          color="blue"
        />
        <StatCard
          title="Pending EMD"
          value={`₹${(tenderStats.pendingEMD / 100000).toFixed(0)} L`}
          subtitle={`${tenderStats.urgentDeadlines} urgent deadlines`}
          icon="⏰"
          color="amber"
        />
      </div>

      {/* Pipeline Board */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Tender Pipeline</h3>
        <div className="grid grid-cols-8 gap-3">
          {pipelineStages.map((stage, idx) => {
            const stageTenders = tenders.filter(t => t.status === stage.stage);
            const stageValue = stageTenders.reduce((sum, t) => sum + t.estimatedValue, 0);
            
            return (
              <div key={idx} className={`bg-${stage.color}-50 rounded-lg p-3 border border-${stage.color}-200`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-xs font-semibold text-${stage.color}-900`}>{stage.label}</h4>
                  <span className={`text-xs font-bold text-${stage.color}-700`}>{stage.count}</span>
                </div>
                <p className={`text-xs text-${stage.color}-600 mb-2`}>
                  ₹{(stageValue / 10000000).toFixed(1)} Cr
                </p>
                <div className="space-y-1">
                  {stageTenders.slice(0, 2).map(t => (
                    <div key={t.id} className="bg-white rounded p-2 text-xs border border-slate-200">
                      <p className="font-medium text-slate-900 truncate">{t.title}</p>
                      <p className="text-slate-500 truncate">{t.clientName}</p>
                    </div>
                  ))}
                  {stageTenders.length > 2 && (
                    <p className="text-xs text-slate-500 text-center">+{stageTenders.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Urgent Deadlines */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Deadlines</h3>
        <div className="space-y-3">
          {tenders
            .filter(t => t.daysToDeadline > 0 && t.daysToDeadline <= 30)
            .sort((a, b) => a.daysToDeadline - b.daysToDeadline)
            .slice(0, 5)
            .map(tender => (
              <div key={tender.id} className={`p-4 rounded-lg border ${
                tender.daysToDeadline <= 7 ? 'bg-red-50 border-red-200' :
                tender.daysToDeadline <= 14 ? 'bg-amber-50 border-amber-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{tender.tenderNo}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        tender.daysToDeadline <= 7 ? 'bg-red-100 text-red-700' :
                        tender.daysToDeadline <= 14 ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {tender.daysToDeadline} days left
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{tender.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {tender.clientName} • Submission: {new Date(tender.submissionDeadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">₹{(tender.estimatedValue / 10000000).toFixed(1)} Cr</p>
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
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
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

function RegisterTab({ selectedTender, setSelectedTender }: { selectedTender: string | null; setSelectedTender: (id: string | null) => void }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Tender Register</h3>
          <p className="text-sm text-slate-500 mt-1">All tenders with status and key information</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
          + New Tender
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tender No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Client</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tenders.map(tender => (
              <tr key={tender.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <code className="text-xs font-mono text-purple-700">{tender.tenderNo}</code>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tender.title}</p>
                    <p className="text-xs text-slate-500">{tender.workType}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-slate-700">{tender.clientName}</p>
                    <p className="text-xs text-slate-500">{tender.location}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    ₹{(tender.estimatedValue / 10000000).toFixed(1)} Cr
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    tender.status === 'won' ? 'bg-green-100 text-green-700' :
                    tender.status === 'lost' ? 'bg-red-100 text-red-700' :
                    tender.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                    tender.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {tender.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {tender.daysToDeadline > 0 ? (
                    <span className={`text-sm font-medium ${
                      tender.daysToDeadline <= 7 ? 'text-red-600' :
                      tender.daysToDeadline <= 14 ? 'text-amber-600' :
                      'text-slate-700'
                    }`}>
                      {tender.daysToDeadline}d
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{tender.ownerName}</span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedTender(tender.id)}
                    className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EligibilityTab({ selectedTender, setSelectedTender }: { selectedTender: string | null; setSelectedTender: (id: string | null) => void }) {
  const tender = tenders.find(t => t.id === selectedTender) || tenders[0];
  const criteria = eligibilityCriteria.filter(e => e.tenderId === tender.id);
  const scores = pqScores.filter(p => p.tenderId === tender.id);
  const totalMaxScore = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const totalSelfScore = scores.reduce((sum, s) => sum + s.selfScore, 0);

  return (
    <div className="space-y-6">
      {/* Tender Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Tender</label>
        <select
          value={selectedTender || tenders[0].id}
          onChange={(e) => setSelectedTender(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {tenders.map(t => (
            <option key={t.id} value={t.id}>{t.tenderNo} - {t.title}</option>
          ))}
        </select>
      </div>

      {/* Eligibility Criteria */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Eligibility Criteria</h3>
          <p className="text-sm text-slate-500 mt-1">Track compliance with tender requirements</p>
        </div>
        <div className="divide-y divide-slate-200">
          {criteria.map(crit => (
            <div key={crit.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      crit.meets === 'Y' ? 'bg-green-100 text-green-700' :
                      crit.meets === 'partial' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {crit.meets === 'Y' ? '✓ Meets' : crit.meets === 'partial' ? '⚠ Partial' : '✗ Does Not Meet'}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded capitalize">
                      {crit.criterion.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{crit.requirement}</p>
                  {crit.notes && (
                    <p className="text-xs text-slate-600 mt-2">{crit.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PQ Scores */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pre-Qualification Scores</h3>
        <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">Total Score</span>
            <span className="text-2xl font-bold text-purple-700">
              {totalSelfScore} / {totalMaxScore} ({((totalSelfScore / totalMaxScore) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {scores.map(score => (
            <div key={score.id} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900">{score.criterionName}</span>
                <span className="text-sm font-bold text-slate-900">
                  {score.selfScore} / {score.maxScore}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(score.selfScore / score.maxScore) * 100}%` }}
                />
              </div>
              {score.remarks && (
                <p className="text-xs text-slate-600 mt-2">{score.remarks}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ selectedTender, setSelectedTender }: { selectedTender: string | null; setSelectedTender: (id: string | null) => void }) {
  const tender = tenders.find(t => t.id === selectedTender) || tenders[0];
  const docs = tenderDocuments.filter(d => d.tenderId === tender.id);
  const tenderAddenda = addenda.filter(a => a.tenderId === tender.id);
  const tenderClarifications = clarifications.filter(c => c.tenderId === tender.id);

  return (
    <div className="space-y-6">
      {/* Tender Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Tender</label>
        <select
          value={selectedTender || tenders[0].id}
          onChange={(e) => setSelectedTender(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {tenders.map(t => (
            <option key={t.id} value={t.id}>{t.tenderNo} - {t.title}</option>
          ))}
        </select>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Tender Documents</h3>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
            + Upload Document
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {docs.map(doc => (
            <div key={doc.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📄</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doc.documentName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{doc.docType}</span>
                      <span className="text-xs text-slate-500">v{doc.version}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">
                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Addenda */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Addenda & Corrigenda</h3>
          <p className="text-sm text-slate-500 mt-1">Track changes to tender documents</p>
        </div>
        <div className="divide-y divide-slate-200">
          {tenderAddenda.map(add => (
            <div key={add.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                      Addendum #{add.addendumNo}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(add.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-900">{add.summary}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {add.impactOnBOQ && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">⚠ BOQ Impact</span>
                )}
                {add.impactOnDates && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">📅 Date Change</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clarifications */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Pre-Bid Clarifications</h3>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
            + Add Query
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {tenderClarifications.map(clar => (
            <div key={clar.id} className="p-6 hover:bg-slate-50">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {clar.queryNo}
                  </span>
                  <span className="text-xs text-slate-500">Ref: {clar.clauseRef}</span>
                </div>
                <p className="text-sm font-medium text-slate-900 mb-2">Query: {clar.query}</p>
                {clar.response && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-900 mb-1">Response ({new Date(clar.responseDate!).toLocaleDateString()}):</p>
                    <p className="text-sm text-green-800">{clar.response}</p>
                    {clar.impact && (
                      <p className="text-xs text-green-700 mt-2">Impact: {clar.impact}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChecklistTab({ selectedTender, setSelectedTender }: { selectedTender: string | null; setSelectedTender: (id: string | null) => void }) {
  const tender = tenders.find(t => t.id === selectedTender) || tenders[0];
  const checklist = submissionChecklist.filter(c => c.tenderId === tender.id);
  const completedItems = checklist.filter(c => c.status === 'completed').length;
  const progressPct = (completedItems / checklist.length) * 100;

  return (
    <div className="space-y-6">
      {/* Tender Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Tender</label>
        <select
          value={selectedTender || tenders[0].id}
          onChange={(e) => setSelectedTender(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {tenders.map(t => (
            <option key={t.id} value={t.id}>{t.tenderNo} - {t.title}</option>
          ))}
        </select>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Submission Checklist</h3>
          <span className="text-2xl font-bold text-purple-700">{progressPct.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-sm text-slate-600">
          {completedItems} of {checklist.length} items completed
        </p>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="divide-y divide-slate-200">
          {checklist.map(item => (
            <div key={item.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in_progress' ? 'bg-blue-500' :
                    item.status === 'overdue' ? 'bg-red-500' :
                    'bg-slate-300'
                  }`}>
                    {item.status === 'completed' && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.item}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Responsible: {item.responsibleName}</span>
                      <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    </div>
                    {item.documentName && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500">Document:</span>
                        <span className="text-xs text-purple-700 font-medium">{item.documentName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  item.status === 'overdue' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EMDTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total EMD"
          value={`₹${(emds.reduce((sum, e) => sum + e.amount, 0) / 100000).toFixed(0)} L`}
          subtitle={`${emds.length} instruments`}
          icon="💰"
          color="blue"
        />
        <StatCard
          title="Submitted"
          value={emds.filter(e => e.status === 'submitted').length}
          subtitle="Active"
          icon="📤"
          color="green"
        />
        <StatCard
          title="Returned"
          value={emds.filter(e => e.status === 'returned').length}
          subtitle="Refunded"
          icon="↩️"
          color="amber"
        />
        <StatCard
          title="Converted"
          value={emds.filter(e => e.status === 'converted_to_PBG').length}
          subtitle="To PBG"
          icon="🔄"
          color="purple"
        />
      </div>

      {/* EMD List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">EMD Register</h3>
          <p className="text-sm text-slate-500 mt-1">Track all EMD instruments and their status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tender</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Instrument</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Bank</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {emds.map(emd => {
                const tender = tenders.find(t => t.id === emd.tenderId);
                return (
                  <tr key={emd.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{tender?.tenderNo}</p>
                        <p className="text-xs text-slate-500">{tender?.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-purple-700">{emd.instrumentNo}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{emd.bank}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        ₹{(emd.amount / 100000).toFixed(1)} L
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">
                        {new Date(emd.issueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">
                        {new Date(emd.expiryDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                        emd.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                        emd.status === 'returned' ? 'bg-green-100 text-green-700' :
                        emd.status === 'converted_to_PBG' ? 'bg-purple-100 text-purple-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {emd.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ResultsTab({ selectedTender, setSelectedTender }: { selectedTender: string | null; setSelectedTender: (id: string | null) => void }) {
  const tender = tenders.find(t => t.id === selectedTender) || tenders.find(t => t.status === 'won') || tenders[0];
  const results = bidResults.filter(r => r.tenderId === tender.id);
  const ourBid = results.find(r => r.isUs);
  const l1Bid = results.find(r => r.rank === 1);
  const l1Diff = ourBid && l1Bid ? ((ourBid.quotedAmount - l1Bid.quotedAmount) / l1Bid.quotedAmount * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Tender Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Tender</label>
        <select
          value={selectedTender || tender.id}
          onChange={(e) => setSelectedTender(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {tenders.filter(t => t.status === 'opened' || t.status === 'won' || t.status === 'lost').map(t => (
            <option key={t.id} value={t.id}>{t.tenderNo} - {t.title}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {ourBid && l1Bid && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-xs text-slate-500 mb-1">Our Bid</p>
            <p className="text-2xl font-bold text-purple-700">₹{(ourBid.quotedAmount / 10000000).toFixed(2)} Cr</p>
            <p className="text-xs text-slate-500 mt-1">Rank: {ourBid.rank}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-xs text-slate-500 mb-1">L1 Bid</p>
            <p className="text-2xl font-bold text-green-700">₹{(l1Bid.quotedAmount / 10000000).toFixed(2)} Cr</p>
            <p className="text-xs text-slate-500 mt-1">{l1Bid.bidderName}</p>
          </div>
          <div className={`bg-white rounded-lg border border-slate-200 p-6 ${
            l1Diff > 0 ? 'border-red-200' : 'border-green-200'
          }`}>
            <p className="text-xs text-slate-500 mb-1">L1 Difference</p>
            <p className={`text-2xl font-bold ${l1Diff > 0 ? 'text-red-700' : 'text-green-700'}`}>
              {l1Diff > 0 ? '+' : ''}{l1Diff.toFixed(2)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">{l1Diff > 0 ? 'Higher than L1' : 'We are L1'}</p>
          </div>
        </div>
      )}

      {/* Bid Results */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Bid Opening Results</h3>
          <p className="text-sm text-slate-500 mt-1">Competitor analysis and ranking</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Bidder</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Quoted Amount</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Technical Score</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.sort((a, b) => a.rank - b.rank).map(result => (
                <tr key={result.id} className={`hover:bg-slate-50 ${result.isUs ? 'bg-purple-50' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-bold ${
                      result.rank === 1 ? 'text-green-600' :
                      result.rank === 2 ? 'text-blue-600' :
                      'text-slate-700'
                    }`}>
                      #{result.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{result.bidderName}</span>
                      {result.isUs && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Us</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{(result.quotedAmount / 10000000).toFixed(2)} Cr
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {result.technicalScore ? (
                      <span className="text-sm text-slate-700">{result.technicalScore}/100</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {result.rank === 1 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        L1
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const wonTenders = tenders.filter(t => t.status === 'won');
  const lostTenders = tenders.filter(t => t.status === 'lost');
  const totalValue = wonTenders.reduce((sum, t) => sum + t.estimatedValue, 0);

  return (
    <div className="space-y-6">
      {/* Win/Loss Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
          <p className="text-4xl font-bold text-green-600">{wonTenders.length}</p>
          <p className="text-sm text-slate-600 mt-2">Won</p>
          <p className="text-xs text-slate-500 mt-1">₹{(totalValue / 10000000).toFixed(1)} Cr</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
          <p className="text-4xl font-bold text-red-600">{lostTenders.length}</p>
          <p className="text-sm text-slate-600 mt-2">Lost</p>
          <p className="text-xs text-slate-500 mt-1">
            ₹{(lostTenders.reduce((sum, t) => sum + t.estimatedValue, 0) / 10000000).toFixed(1)} Cr
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
          <p className="text-4xl font-bold text-purple-600">{tenderStats.winRate}%</p>
          <p className="text-sm text-slate-600 mt-2">Win Rate</p>
          <p className="text-xs text-slate-500 mt-1">Last 12 months</p>
        </div>
      </div>

      {/* Win/Loss Analysis */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Win/Loss Analysis</h3>
        <div className="space-y-3">
          {tenders.filter(t => t.status === 'won' || t.status === 'lost').map(tender => (
            <div key={tender.id} className={`p-4 rounded-lg border ${
              tender.status === 'won' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{tender.tenderNo}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      tender.status === 'won' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tender.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{tender.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{tender.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">₹{(tender.estimatedValue / 10000000).toFixed(1)} Cr</p>
                </div>
              </div>
              {tender.status === 'lost' && (
                <div className="mt-3 p-3 bg-white rounded border border-red-200">
                  <p className="text-xs font-medium text-red-900 mb-1">Loss Analysis:</p>
                  <p className="text-xs text-red-700">
                    {bidResults.find(r => r.tenderId === tender.id && r.isUs)?.rank === 1 
                      ? 'Technical evaluation - lower score than L1' 
                      : 'Price higher than L1 by ' + 
                        (((bidResults.find(r => r.tenderId === tender.id && r.isUs)?.quotedAmount || 0) - 
                          (bidResults.find(r => r.tenderId === tender.id && r.rank === 1)?.quotedAmount || 0)) / 
                          (bidResults.find(r => r.tenderId === tender.id && r.rank === 1)?.quotedAmount || 1) * 100).toFixed(1) + '%'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bid Decisions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Bid/No-Bid Decisions</h3>
        <div className="space-y-3">
          {tenderDecisions.map(decision => {
            const tender = tenders.find(t => t.id === decision.tenderId);
            return (
              <div key={decision.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{tender?.tenderNo}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        decision.decision === 'bid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {decision.decision === 'bid' ? 'BID' : 'NO-BID'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{tender?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Decision Score</p>
                    <p className="text-lg font-bold text-purple-700">
                      {((decision.strategicFit + decision.capacity + decision.eligibility + decision.marginPotential + decision.riskScore) / 5).toFixed(1)}/10
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center p-2 bg-white rounded">
                    <p className="font-bold text-slate-900">{decision.strategicFit}/10</p>
                    <p className="text-slate-500">Strategic</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="font-bold text-slate-900">{decision.capacity}/10</p>
                    <p className="text-slate-500">Capacity</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="font-bold text-slate-900">{decision.eligibility}/10</p>
                    <p className="text-slate-500">Eligibility</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="font-bold text-slate-900">{decision.marginPotential}/10</p>
                    <p className="text-slate-500">Margin</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="font-bold text-slate-900">{decision.riskScore}/10</p>
                    <p className="text-slate-500">Risk</p>
                  </div>
                </div>
              </div>
            );
          })}
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
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200'
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
