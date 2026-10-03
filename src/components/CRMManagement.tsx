import { useState } from 'react';
import {
  leads,
  enquiries,
  opportunities,
  contacts,
  interactions,
  negotiations,
  protocolControlPoints,
  pipelineStats,
  stageWisePipeline,
  lostReasons
} from '../data/crmData';

export function CRMManagement() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'opportunities', label: 'Opportunities', icon: '💼' },
    { id: 'contacts', label: 'Contacts', icon: '👥' },
    { id: 'interactions', label: 'Interactions', icon: '💬' },
    { id: 'negotiations', label: 'Negotiations', icon: '🤝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM & Business Development</h1>
          <p className="text-sm text-slate-500 mt-1">Part 21 — Complete business acquisition lifecycle management</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">
            ff.crm
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
                  ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-700'
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
      {activeTab === 'leads' && <LeadsTab />}
      {activeTab === 'opportunities' && <OpportunitiesTab />}
      {activeTab === 'contacts' && <ContactsTab />}
      {activeTab === 'interactions' && <InteractionsTab />}
      {activeTab === 'negotiations' && <NegotiationsTab />}
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
          title="Active Opportunities"
          value={pipelineStats.activeOpportunities}
          subtitle={`${pipelineStats.totalOpportunities} total`}
          icon="💼"
          color="orange"
        />
        <StatCard
          title="Pipeline Value"
          value={`₹${(pipelineStats.totalPipelineValue / 10000000).toFixed(1)} Cr`}
          subtitle="Total estimated"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Weighted Value"
          value={`₹${(pipelineStats.totalWeightedValue / 10000000).toFixed(1)} Cr`}
          subtitle="Probability-adjusted"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Win Rate"
          value={`${pipelineStats.winRate}%`}
          subtitle={`₹${(pipelineStats.awardedValue / 10000000).toFixed(1)} Cr awarded`}
          icon="🏆"
          color="purple"
        />
      </div>

      {/* Pipeline Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pipeline by Stage</h3>
        <div className="space-y-3">
          {stageWisePipeline.filter(s => s.count > 0).map((stage, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700 capitalize">
                {stage.stage}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full bg-${stage.color}-500 flex items-center px-3`}
                      style={{ width: `${(stage.value / pipelineStats.totalPipelineValue) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {stage.count} opp{stage.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{(stage.value / 10000000).toFixed(1)} Cr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Interactions</h3>
          <div className="space-y-3">
            {interactions.slice(0, 4).map(int => (
              <div key={int.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl">
                  {int.type === 'meeting' ? '🤝' :
                   int.type === 'call' ? '📞' :
                   int.type === 'email' ? '📧' :
                   int.type === 'site_visit' ? '🏗️' :
                   int.type === 'presentation' ? '📊' : '💬'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{int.summary.substring(0, 80)}...</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {int.ownerName} • {new Date(int.datetime).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Follow-ups</h3>
          <div className="space-y-3">
            {interactions
              .filter(i => i.nextActionDate)
              .sort((a, b) => new Date(a.nextActionDate!).getTime() - new Date(b.nextActionDate!).getTime())
              .slice(0, 4)
              .map(int => (
                <div key={int.id} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl">⏰</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{int.nextAction}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Due: {new Date(int.nextActionDate!).toLocaleDateString()} • {int.ownerName}
                    </p>
                  </div>
                </div>
              ))}
          </div>
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
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
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

function LeadsTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={leads.length}
          subtitle="All time"
          icon="🎯"
          color="blue"
        />
        <StatCard
          title="New Leads"
          value={leads.filter(l => l.status === 'new').length}
          subtitle="This month"
          icon="✨"
          color="green"
        />
        <StatCard
          title="Qualified"
          value={leads.filter(l => l.status === 'qualified').length}
          subtitle="Ready to pursue"
          icon="✓"
          color="orange"
        />
        <StatCard
          title="Converted"
          value={leads.filter(l => l.status === 'converted').length}
          subtitle="To opportunities"
          icon="🔄"
          color="purple"
        />
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Lead Register</h3>
          <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700">
            + New Lead
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Lead No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Work Type</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-orange-700">{lead.leadNo}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{lead.companyName}</p>
                      <p className="text-xs text-slate-500">{lead.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-700">{lead.contactName}</p>
                      <p className="text-xs text-slate-500">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded capitalize">
                      {lead.source.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{lead.workType}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{(lead.estimatedValue / 10000000).toFixed(2)} Cr
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{lead.ownerName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                      lead.status === 'converted' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lead.status}
                    </span>
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

function OpportunitiesTab() {
  return (
    <div className="space-y-6">
      {/* Kanban Pipeline View */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Opportunity Pipeline</h3>
        <div className="grid grid-cols-7 gap-3">
          {['opportunity', 'tender', 'estimation', 'bid', 'negotiation', 'awarded', 'lost'].map(stage => {
            const stageOpps = opportunities.filter(o => o.stage === stage);
            const stageValue = stageOpps.reduce((sum, o) => sum + o.estimatedValue, 0);
            
            return (
              <div key={stage} className="bg-slate-50 rounded-lg p-3">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 capitalize">{stage}</h4>
                  <p className="text-xs text-slate-500">
                    {stageOpps.length} opp{stageOpps.length !== 1 ? 's' : ''} • ₹{(stageValue / 10000000).toFixed(1)} Cr
                  </p>
                </div>
                <div className="space-y-2">
                  {stageOpps.map(opp => (
                    <div key={opp.id} className="bg-white rounded-lg p-3 border border-slate-200 hover:border-orange-300 cursor-pointer transition-colors">
                      <p className="text-xs font-semibold text-slate-900 mb-1">{opp.title}</p>
                      <p className="text-xs text-slate-500 mb-2">{opp.clientName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-orange-700">
                          ₹{(opp.estimatedValue / 10000000).toFixed(1)} Cr
                        </span>
                        <span className="text-xs text-slate-500">{opp.probabilityPct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">All Opportunities</h3>
          <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700">
            + New Opportunity
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Opp No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Client</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Value</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Probability</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Weighted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Owner</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {opportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-orange-700">{opp.oppNo}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{opp.title}</p>
                      <p className="text-xs text-slate-500">{opp.workType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{opp.clientName}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{(opp.estimatedValue / 10000000).toFixed(2)} Cr
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-700">{opp.probabilityPct}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-orange-700">
                      ₹{(opp.weightedValue / 10000000).toFixed(2)} Cr
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      opp.stage === 'awarded' ? 'bg-green-100 text-green-700' :
                      opp.stage === 'lost' ? 'bg-red-100 text-red-700' :
                      opp.stage === 'negotiation' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{opp.ownerName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${
                      opp.daysInStage > 10 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {opp.daysInStage}d
                    </span>
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

function ContactsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Client Contacts</h3>
          <p className="text-sm text-slate-500 mt-1">Manage client relationships and key contacts</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700">
          + Add Contact
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Influence</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {contacts.map(contact => (
              <tr key={contact.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-orange-700">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{contact.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{contact.clientName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{contact.designation}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{contact.department}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-xs text-slate-700">{contact.phone}</p>
                    <p className="text-xs text-slate-500">{contact.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    contact.influence === 'decision_maker' ? 'bg-red-100 text-red-700' :
                    contact.influence === 'influencer' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {contact.influence.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {contact.isActive ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InteractionsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Interaction History</h3>
          <p className="text-sm text-slate-500 mt-1">Track all client interactions and follow-ups</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700">
          + Log Interaction
        </button>
      </div>
      <div className="divide-y divide-slate-200">
        {interactions.map(int => (
          <div key={int.id} className="p-6 hover:bg-slate-50">
            <div className="flex items-start gap-4">
              <div className="text-3xl">
                {int.type === 'meeting' ? '🤝' :
                 int.type === 'call' ? '📞' :
                 int.type === 'email' ? '📧' :
                 int.type === 'site_visit' ? '🏗️' :
                 int.type === 'presentation' ? '📊' : '💬'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded capitalize">
                    {int.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(int.datetime).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-700">{int.ownerName}</span>
                </div>
                <p className="text-sm text-slate-900 mb-2">{int.summary}</p>
                {int.participants.length > 0 && (
                  <p className="text-xs text-slate-500 mb-2">
                    Participants: {int.participants.join(', ')}
                  </p>
                )}
                {int.nextAction && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs font-medium text-amber-900">Next Action: {int.nextAction}</p>
                    {int.nextActionDate && (
                      <p className="text-xs text-amber-700 mt-1">
                        Due: {new Date(int.nextActionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NegotiationsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Negotiation Tracking</h3>
          <p className="text-sm text-slate-500 mt-1">Track negotiation rounds and outcomes</p>
        </div>
        <div className="divide-y divide-slate-200">
          {negotiations.map(neg => {
            const opp = opportunities.find(o => o.id === neg.opportunityId);
            return (
              <div key={neg.id} className="p-6 hover:bg-slate-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                        Round {neg.roundNo}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                        neg.outcome === 'accepted' ? 'bg-green-100 text-green-700' :
                        neg.outcome === 'counter' ? 'bg-amber-100 text-amber-700' :
                        neg.outcome === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {neg.outcome}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{opp?.title}</h4>
                    <p className="text-xs text-slate-500">{opp?.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{new Date(neg.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Our Price</p>
                    <p className="text-lg font-bold text-slate-900">₹{(neg.ourPrice / 10000000).toFixed(2)} Cr</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Client Counter</p>
                    <p className="text-lg font-bold text-orange-700">₹{(neg.clientCounter / 10000000).toFixed(2)} Cr</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Discount</p>
                    <p className="text-lg font-bold text-slate-900">{neg.discountPct.toFixed(2)}%</p>
                  </div>
                </div>

                {neg.termsChanged.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">Terms Changed:</p>
                    <ul className="space-y-1">
                      {neg.termsChanged.map((term, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">•</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Win/Loss Analysis */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Win/Loss Analysis</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <p className="text-3xl font-bold text-green-700">{opportunities.filter(o => o.stage === 'awarded').length}</p>
            <p className="text-sm text-green-600 mt-1">Won</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
            <p className="text-3xl font-bold text-red-700">{opportunities.filter(o => o.stage === 'lost').length}</p>
            <p className="text-sm text-red-600 mt-1">Lost</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <p className="text-3xl font-bold text-blue-700">{pipelineStats.winRate}%</p>
            <p className="text-sm text-blue-600 mt-1">Win Rate</p>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-slate-900 mb-3">Lost Reasons</h4>
        <div className="space-y-2">
          {lostReasons.map(reason => {
            const count = opportunities.filter(o => o.lostReasonCode === reason.code).length;
            return (
              <div key={reason.code} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">{reason.description}</p>
                  <p className="text-xs text-slate-500">{reason.code}</p>
                </div>
                <span className="text-lg font-bold text-slate-900">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Revenue Forecast</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-orange-100">Weighted Pipeline Value</p>
            <p className="text-3xl font-bold mt-1">₹{(pipelineStats.totalWeightedValue / 10000000).toFixed(1)} Cr</p>
          </div>
          <div>
            <p className="text-sm text-orange-100">Expected Awards (Next 90 Days)</p>
            <p className="text-3xl font-bold mt-1">₹{(pipelineStats.totalWeightedValue * 0.3 / 10000000).toFixed(1)} Cr</p>
          </div>
        </div>
      </div>

      {/* Activity by Owner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity by Owner</h3>
        <div className="space-y-3">
          {['Priya Mehta', 'Vikram Singh'].map(owner => {
            const ownerOpps = opportunities.filter(o => o.ownerName === owner);
            const ownerValue = ownerOpps.reduce((sum, o) => sum + o.weightedValue, 0);
            const ownerInteractions = interactions.filter(i => i.ownerName === owner).length;
            
            return (
              <div key={owner} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-orange-700">
                        {owner.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{owner}</p>
                      <p className="text-xs text-slate-500">{ownerOpps.length} opportunities</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-700">₹{(ownerValue / 10000000).toFixed(1)} Cr</p>
                    <p className="text-xs text-slate-500">{ownerInteractions} interactions</p>
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
    orange: 'bg-orange-50 border-orange-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200'
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
