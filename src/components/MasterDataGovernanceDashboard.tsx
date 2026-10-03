import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  materials,
  materialGroups,
  uoms,
  uomConversions,
  vendors,
  clients,
  taxCodes,
  paymentTerms,
  changeRequests,
  mergeAliases,
  duplicateCandidates,
  dataQualityIssues,
  protocolControlPoints,
  mdmStats
} from '../data/masterDataGovernanceData';

export function MasterDataGovernanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'materials', label: 'Materials', icon: '📦' },
    { id: 'vendors', label: 'Vendors', icon: '🏭' },
    { id: 'change-requests', label: 'Change Requests', icon: '📝' },
    { id: 'data-quality', label: 'Data Quality', icon: '🔍' },
    { id: 'tax-resolver', label: 'Tax Resolver', icon: '💰' },
    { id: 'uom', label: 'UOM', icon: '⚖️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Data Governance</h1>
          <p className="text-sm text-slate-500 mt-1">Part 11 — Centralized master data management with maker-checker workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
            ff.mdm
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
                  ? 'bg-cyan-50 text-cyan-700 border-b-2 border-cyan-700'
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
      {activeTab === 'materials' && <MaterialsTab />}
      {activeTab === 'vendors' && <VendorsTab />}
      {activeTab === 'change-requests' && <ChangeRequestsTab />}
      {activeTab === 'data-quality' && <DataQualityTab />}
      {activeTab === 'tax-resolver' && <TaxResolverTab />}
      {activeTab === 'uom' && <UOMTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Materials"
          value={mdmStats.activeMaterials}
          subtitle={`${mdmStats.totalMaterials} total`}
          icon="📦"
          color="cyan"
        />
        <StatCard
          title="Vendors"
          value={mdmStats.activeVendors}
          subtitle={`${mdmStats.blacklistedVendors} blacklisted`}
          icon="🏭"
          color="green"
        />
        <StatCard
          title="Change Requests"
          value={mdmStats.pendingChangeRequests}
          subtitle={`${mdmStats.approvedChangeRequests} approved`}
          icon="📝"
          color="amber"
        />
        <StatCard
          title="DQ Issues"
          value={mdmStats.dataQualityIssues}
          subtitle={`${mdmStats.criticalIssues} critical`}
          icon="🔍"
          color="red"
        />
      </div>

      {/* Master Data Hub */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Master Data Hub</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MasterTile title="Materials" count={materials.length} icon="📦" color="blue" />
          <MasterTile title="Vendors" count={vendors.length} icon="🏭" color="green" />
          <MasterTile title="Clients" count={clients.length} icon="👥" color="purple" />
          <MasterTile title="Tax Codes" count={taxCodes.length} icon="💰" color="amber" />
          <MasterTile title="UOM" count={uoms.length} icon="⚖️" color="cyan" />
          <MasterTile title="Payment Terms" count={paymentTerms.length} icon="💳" color="indigo" />
          <MasterTile title="Material Groups" count={materialGroups.length} icon="📁" color="teal" />
          <MasterTile title="Merge Aliases" count={mergeAliases.length} icon="🔗" color="slate" />
        </div>
      </div>

      {/* Recent Change Requests */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Change Requests</h3>
        <div className="space-y-3">
          {changeRequests.slice(0, 4).map(cr => (
            <div key={cr.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                cr.status === 'approved' ? 'bg-green-500' :
                cr.status === 'submitted' ? 'bg-blue-500' :
                cr.status === 'rejected' ? 'bg-red-500' :
                'bg-slate-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{cr.requestedByName}</span>
                  {' '}requested {cr.changeType} for {cr.masterType}
                  {cr.recordName && `: ${cr.recordName}`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(cr.requestedAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                cr.status === 'approved' ? 'bg-green-100 text-green-700' :
                cr.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                cr.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {cr.status.toUpperCase()}
              </span>
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
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded">
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

function MaterialsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = searchTerm === '' || 
      mat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mat.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || mat.groupId === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search materials by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Groups</option>
              {materialGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
              + New Material
            </button>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Group</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">UOM</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">HSN</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Stock</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">QC</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredMaterials.map(mat => (
              <tr key={mat.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <code className="text-sm font-mono text-slate-900">{mat.code}</code>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{mat.name}</p>
                    {mat.spec && <p className="text-xs text-slate-500">{mat.spec}</p>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{mat.groupName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{mat.baseUomName}</span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-slate-600">{mat.hsnCode || '—'}</code>
                </td>
                <td className="px-6 py-4 text-center">
                  {mat.isStockItem ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {mat.qcRequired ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-slate-900">{mat.usageCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    mat.status === 'active' ? 'bg-green-100 text-green-700' :
                    mat.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {mat.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Duplicate Detection Alert */}
      {duplicateCandidates.filter(d => d.masterType === 'material').length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            Potential Duplicates Detected
          </h4>
          <div className="space-y-2">
            {duplicateCandidates.filter(d => d.masterType === 'material').map(dup => (
              <div key={dup.id} className="p-3 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    New: {dup.newRecordData.name}
                  </span>
                  <span className="text-xs text-amber-700">
                    {Math.round(dup.similarityScore * 100)}% similar
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Existing: <span className="font-medium">{dup.existingRecordName}</span> ({dup.existingRecordCode})
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Match fields: {dup.matchFields.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VendorsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gstin?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || vendor.vendorType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search vendors by name, code, or GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="supplier">Supplier</option>
              <option value="subcontractor">Subcontractor</option>
              <option value="labour_contractor">Labour Contractor</option>
              <option value="service">Service</option>
            </select>
            <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
              + New Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">GSTIN</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">State</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Rating</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredVendors.map(vendor => (
              <tr key={vendor.id} className={`hover:bg-slate-50 ${vendor.blacklistFlag ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4">
                  <code className="text-sm font-mono text-slate-900">{vendor.code}</code>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{vendor.name}</p>
                    {vendor.blacklistFlag && (
                      <p className="text-xs text-red-600 font-medium">⚠️ Blacklisted</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    {vendor.vendorType.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-slate-600">{vendor.gstin || '—'}</code>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{vendor.stateCode}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {vendor.rating && (
                    <span className="text-sm font-medium text-slate-900">
                      {'⭐'.repeat(Math.round(vendor.rating))}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-slate-900">{vendor.usageCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    vendor.status === 'active' ? 'bg-green-100 text-green-700' :
                    vendor.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' :
                    vendor.status === 'blocked' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {vendor.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document Expiry Alerts */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <span>📄</span>
          Document Expiry Alerts
        </h4>
        <div className="space-y-2">
          {vendors.filter(v => v.documentsExpiry.gstCertificate && 
            new Date(v.documentsExpiry.gstCertificate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ).map(vendor => (
            <div key={vendor.id} className="p-3 bg-white rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-slate-900">{vendor.name}</p>
              <p className="text-xs text-amber-700 mt-1">
                GST Certificate expiring on {new Date(vendor.documentsExpiry.gstCertificate!).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChangeRequestsTab() {
  const [filter, setFilter] = useState('all');

  const filteredRequests = changeRequests.filter(cr => 
    filter === 'all' ? true : cr.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex gap-2">
          {['all', 'submitted', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Change Requests List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Change Requests Inbox</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredRequests.map(cr => (
            <div key={cr.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {cr.masterType}
                    </span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">
                      {cr.changeType}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      cr.status === 'approved' ? 'bg-green-100 text-green-700' :
                      cr.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      cr.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {cr.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {cr.recordName || `New ${cr.masterType}`}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Requested by {cr.requestedByName} on {new Date(cr.requestedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payload Preview */}
              <div className="p-3 bg-slate-50 rounded-lg mb-3">
                <p className="text-xs font-medium text-slate-700 mb-2">Changes:</p>
                <pre className="text-xs text-slate-600 overflow-x-auto">
                  {JSON.stringify(cr.payloadJson, null, 2)}
                </pre>
              </div>

              {cr.status === 'submitted' && (
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
                    View Details
                  </button>
                </div>
              )}

              {cr.status === 'approved' && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-900">
                    Approved by {cr.approvedBy} on {new Date(cr.approvedAt!).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataQualityTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Issues"
          value={mdmStats.dataQualityIssues}
          subtitle="All detected"
          icon="🔍"
          color="blue"
        />
        <StatCard
          title="Critical"
          value={mdmStats.criticalIssues}
          subtitle="Immediate action"
          icon="🚨"
          color="red"
        />
        <StatCard
          title="High"
          value={mdmStats.highIssues}
          subtitle="Priority"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Duplicates"
          value={mdmStats.duplicateSuspects}
          subtitle="Suspected"
          icon="🔗"
          color="purple"
        />
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Data Quality Issues</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {dataQualityIssues.map(issue => (
            <div key={issue.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      issue.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      issue.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {issue.masterType}
                    </span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">
                      {issue.issueType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{issue.recordName}</p>
                  <p className="text-xs text-slate-500 mt-1">{issue.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Detected: {new Date(issue.detectedAt).toLocaleDateString()}</span>
                {issue.resolvedAt && (
                  <span>Resolved: {new Date(issue.resolvedAt).toLocaleDateString()} by {issue.resolvedBy}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaxResolverTab() {
  return (
    <div className="space-y-6">
      {/* Tax Codes */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Tax Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Effective From</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">GL Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {taxCodes.map(tax => (
                <tr key={tax.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-slate-900">{tax.code}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {tax.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-900">{tax.rate}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{tax.section || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {new Date(tax.effectiveFrom).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-slate-600">{tax.glAccount || '—'}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Resolver Demo */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Tax Resolver Demo</h3>
        <p className="text-sm text-cyan-100 mb-4">
          Helper function: resolveTax(material/service, vendorState, placeOfSupply, date)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/10 rounded-lg">
            <p className="text-xs text-cyan-200 mb-2">Example 1: Intra-state (Maharashtra)</p>
            <p className="text-sm">Vendor: MH, Supply: MH</p>
            <p className="text-lg font-bold mt-2">CGST 9% + SGST 9%</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <p className="text-xs text-cyan-200 mb-2">Example 2: Inter-state (MH to KA)</p>
            <p className="text-sm">Vendor: MH, Supply: KA</p>
            <p className="text-lg font-bold mt-2">IGST 18%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UOMTab() {
  return (
    <div className="space-y-6">
      {/* UOM List */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Units of Measurement</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uoms.map(uom => (
            <div key={uom.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-900">{uom.name}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">{uom.code}</p>
              <p className="text-xs text-slate-600 mt-2">{uom.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UOM Conversions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">UOM Conversions</h3>
        <div className="space-y-3">
          {uomConversions.map((conv: any) => (
            <div key={conv.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {conv.fromUomName} → {conv.toUomName}
                  </p>
                  {conv.materialName && (
                    <p className="text-xs text-slate-500 mt-1">
                      Material-specific: {conv.materialName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-700">{conv.factor}</p>
                  <p className="text-xs text-slate-500">conversion factor</p>
                </div>
              </div>
            </div>
          ))}
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
    cyan: 'bg-cyan-50 border-cyan-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
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

function MasterTile({ title, count, icon, color }: {
  title: string;
  count: number;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    amber: 'bg-amber-50 border-amber-200',
    cyan: 'bg-cyan-50 border-cyan-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    teal: 'bg-teal-50 border-teal-200',
    slate: 'bg-slate-50 border-slate-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]} cursor-pointer hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold text-slate-900">{count}</span>
      </div>
      <p className="text-xs text-slate-600">{title}</p>
    </div>
  );
}
