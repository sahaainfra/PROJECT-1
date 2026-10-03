import { useState } from 'react';
import {
  boqVersions,
  boqItems,
  wbsNodes,
  workPackages,
  activities,
  boqActivityMaps,
  resourceNorms,
  importResults,
  versionComparison,
  protocolControlPoints,
  boqStats
} from '../data/boqManagementData';

export function BOQManagement() {
  const [activeTab, setActiveTab] = useState('versions');

  const tabs = [
    { id: 'versions', label: 'BOQ Versions', icon: '📋' },
    { id: 'editor', label: 'BOQ Editor', icon: '📝' },
    { id: 'wbs', label: 'WBS Builder', icon: '🏗️' },
    { id: 'mapping', label: 'Activity Mapping', icon: '🔗' },
    { id: 'norms', label: 'Resource Norms', icon: '📊' },
    { id: 'compare', label: 'Version Compare', icon: '🔄' },
    { id: 'import', label: 'Import/Export', icon: '📥' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">WBS, BOQ & Work Package Management</h1>
          <p className="text-sm text-slate-500 mt-1">Part 20 — Bill of Quantities with versioning, WBS structure, and activity mapping</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
            ff.boq
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
      {activeTab === 'versions' && <VersionsTab />}
      {activeTab === 'editor' && <EditorTab />}
      {activeTab === 'wbs' && <WBSTab />}
      {activeTab === 'mapping' && <MappingTab />}
      {activeTab === 'norms' && <NormsTab />}
      {activeTab === 'compare' && <CompareTab />}
      {activeTab === 'import' && <ImportTab />}
    </div>
  );
}

function VersionsTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Versions"
          value={boqStats.totalVersions}
          subtitle={`${boqStats.frozenVersions} frozen`}
          icon="📋"
          color="cyan"
        />
        <StatCard
          title="BOQ Items"
          value={boqStats.totalBOQItems}
          subtitle={`${boqStats.mappedItems} mapped`}
          icon="📝"
          color="blue"
        />
        <StatCard
          title="WBS Nodes"
          value={boqStats.totalWBSNodes}
          subtitle={`${boqStats.totalActivities} activities`}
          icon="🏗️"
          color="green"
        />
        <StatCard
          title="Contract Value"
          value={`₹${(boqStats.contractValue / 10000000).toFixed(1)} Cr`}
          subtitle={`Revised: ₹${(boqStats.revisedValue / 10000000).toFixed(1)} Cr`}
          icon="💰"
          color="amber"
        />
      </div>

      {/* Versions List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">BOQ Versions</h3>
          <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
            + New Version
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Version</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Effective Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {boqVersions.map(version => (
                <tr key={version.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{version.versionNo}</p>
                      <p className="text-xs text-slate-500">{version.projectName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      version.type === 'contract' ? 'bg-blue-100 text-blue-700' :
                      version.type === 'tender' ? 'bg-slate-100 text-slate-700' :
                      version.type === 'revised' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {version.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      version.status === 'frozen' ? 'bg-red-100 text-red-700' :
                      version.status === 'approved' ? 'bg-green-100 text-green-700' :
                      version.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {version.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{(version.totalAmount / 10000000).toFixed(2)} Cr
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-700">{version.itemCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {new Date(version.effectiveDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700">
                        View
                      </button>
                      {version.status === 'draft' && (
                        <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

function EditorTab() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['item_001', 'item_002', 'item_006']));

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderBOQItem = (item: any, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-3 p-3 border-b border-slate-100 hover:bg-slate-50 ${
            depth === 0 ? 'bg-slate-50 font-semibold' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(item.id)}
              className="text-slate-400 hover:text-slate-600"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          <div className="flex-1 grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1">
              <span className="text-xs font-mono text-slate-700">{item.itemNo}</span>
            </div>
            <div className="col-span-4">
              <span className="text-sm text-slate-900">{item.description}</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-xs text-slate-600">{item.uomName}</span>
            </div>
            <div className="col-span-1 text-right">
              <span className="text-sm text-slate-900">{item.quantity.toLocaleString()}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm text-slate-900">₹{item.rate.toLocaleString()}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm font-semibold text-slate-900">₹{item.amount.toLocaleString()}</span>
            </div>
            <div className="col-span-1 text-center">
              {item.hasNorms && (
                <span className="text-xs text-green-600" title="Has resource norms">✓</span>
              )}
              {item.mappedActivities && item.mappedActivities.length > 0 && (
                <span className="text-xs text-blue-600 ml-1" title={`${item.mappedActivities.length} activities mapped`}>
                  🔗
                </span>
              )}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child: any) => renderBOQItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-900">BOQ Editor</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
              Version: R-001 (Revised)
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              Approved
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded hover:bg-slate-300">
              Expand All
            </button>
            <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded hover:bg-slate-300">
              Collapse All
            </button>
            <button className="px-3 py-1.5 bg-cyan-600 text-white text-sm font-medium rounded hover:bg-cyan-700">
              + Add Item
            </button>
          </div>
        </div>
      </div>

      {/* BOQ Tree Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-2">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-1 text-xs font-semibold text-slate-700">Item No</div>
            <div className="col-span-4 text-xs font-semibold text-slate-700">Description</div>
            <div className="col-span-1 text-xs font-semibold text-slate-700 text-center">UOM</div>
            <div className="col-span-1 text-xs font-semibold text-slate-700 text-right">Quantity</div>
            <div className="col-span-2 text-xs font-semibold text-slate-700 text-right">Rate (₹)</div>
            <div className="col-span-2 text-xs font-semibold text-slate-700 text-right">Amount (₹)</div>
            <div className="col-span-1 text-xs font-semibold text-slate-700 text-center">Status</div>
          </div>
        </div>

        {/* Items */}
        <div className="max-h-[600px] overflow-y-auto">
          {boqItems.map(item => renderBOQItem(item))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-3 py-3">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-6 text-right">
              <span className="text-sm font-semibold text-slate-900">Total Amount:</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-lg font-bold text-cyan-700">₹12,85,00,000</span>
            </div>
            <div className="col-span-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WBSTab() {
  const renderWBSNode = (node: any, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className="flex items-center gap-3 p-3 border-b border-slate-100 hover:bg-slate-50"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          <div className="flex-1 grid grid-cols-12 gap-2 items-center">
            <div className="col-span-2">
              <span className="text-xs font-mono text-cyan-700 font-semibold">{node.code}</span>
            </div>
            <div className="col-span-4">
              <span className="text-sm font-medium text-slate-900">{node.name}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-slate-600">{node.responsibleUserName || '—'}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-sm text-slate-700">{node.weightPct}%</span>
            </div>
            <div className="col-span-2 text-right">
              <button className="px-2 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700">
                Edit
              </button>
            </div>
          </div>
        </div>

        {hasChildren && (
          <div>
            {node.children.map((child: any) => renderWBSNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">WBS Tree Builder</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded hover:bg-slate-300">
              Expand All
            </button>
            <button className="px-3 py-1.5 bg-cyan-600 text-white text-sm font-medium rounded hover:bg-cyan-700">
              + Add Node
            </button>
          </div>
        </div>
      </div>

      {/* WBS Tree */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-2">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-2 text-xs font-semibold text-slate-700">WBS Code</div>
            <div className="col-span-4 text-xs font-semibold text-slate-700">Name</div>
            <div className="col-span-2 text-xs font-semibold text-slate-700">Responsible</div>
            <div className="col-span-2 text-xs font-semibold text-slate-700 text-center">Weight %</div>
            <div className="col-span-2 text-xs font-semibold text-slate-700 text-right">Actions</div>
          </div>
        </div>

        {/* Nodes */}
        <div className="max-h-[600px] overflow-y-auto">
          {wbsNodes.map(node => renderWBSNode(node))}
        </div>
      </div>

      {/* Work Packages */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Work Packages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">WBS Node</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Responsible</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Activities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {workPackages.map(wp => (
                <tr key={wp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-cyan-700 font-semibold">{wp.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900">{wp.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{wp.wbsNodeCode}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      wp.type === 'self' ? 'bg-blue-100 text-blue-700' :
                      wp.type === 'subcontract' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {wp.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{wp.responsibleName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{wp.activityCount}</span>
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

function MappingTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Mappings"
          value={boqActivityMaps.length}
          subtitle="BOQ to Activity"
          icon="🔗"
          color="blue"
        />
        <StatCard
          title="Mapped Items"
          value={boqStats.mappedItems}
          subtitle={`of ${boqStats.totalBOQItems} total`}
          icon="✓"
          color="green"
        />
        <StatCard
          title="Unmapped Items"
          value={boqStats.unmappedItems}
          subtitle="Need attention"
          icon="⚠️"
          color="amber"
        />
      </div>

      {/* Mapping Matrix */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">BOQ-Activity Mapping Matrix</h3>
          <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
            + Add Mapping
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">BOQ Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Activity</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Share %</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {boqActivityMaps.map(mapping => (
                <tr key={mapping.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-mono text-cyan-700">{mapping.boqItemNo}</p>
                      <p className="text-xs text-slate-500">{mapping.boqItemDescription}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-mono text-blue-700">{mapping.activityCode}</p>
                      <p className="text-xs text-slate-500">{mapping.activityName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-slate-900">{mapping.qtySharePct}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-900">{mapping.quantity.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700">
                        Edit
                      </button>
                      <button className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200">
                        Delete
                      </button>
                    </div>
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

function NormsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Resource Norms</h3>
          <p className="text-sm text-slate-500 mt-1">Material, labour, and plant requirements per BOQ item</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
          + Add Norm
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">BOQ Item</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Qty/Unit</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Wastage %</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Unit Cost</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {resourceNorms.map(norm => (
              <tr key={norm.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-cyan-700">
                    {boqItems.find(i => i.id === norm.boqItemId)?.itemNo || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-900">{norm.resourceName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                    norm.resourceType === 'material' ? 'bg-blue-100 text-blue-700' :
                    norm.resourceType === 'labour' ? 'bg-green-100 text-green-700' :
                    norm.resourceType === 'plant' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {norm.resourceType}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-900">{norm.qtyPerUnit}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-700">{norm.wastagePct}%</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-900">₹{norm.unitCost.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900">₹{norm.totalCost.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    norm.source === 'rate_analysis' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {norm.source === 'rate_analysis' ? 'Rate Analysis' : 'Manual'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareTab() {
  return (
    <div className="space-y-6">
      {/* Version Selection */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Compare Versions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Version A (Base)</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>C-001 (Contract)</option>
              <option>T-001 (Tender)</option>
              <option>R-001 (Revised)</option>
              <option>W-001 (Working)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Version B (Compare)</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>R-001 (Revised)</option>
              <option>T-001 (Tender)</option>
              <option>C-001 (Contract)</option>
              <option>W-001 (Working)</option>
            </select>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
          Compare Versions
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Items Changed"
          value={versionComparison.summary.totalItemsChanged}
          subtitle="Differences found"
          icon="🔄"
          color="blue"
        />
        <StatCard
          title="Amount Change"
          value={`₹${(versionComparison.summary.totalAmountChange / 100000).toFixed(1)} L`}
          subtitle={`${versionComparison.summary.totalAmountChangePct}% increase`}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Change %"
          value={`${versionComparison.summary.totalAmountChangePct}%`}
          subtitle="Overall variance"
          icon="📊"
          color="amber"
        />
      </div>

      {/* Differences */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Differences</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Item No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Field</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Version A</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Version B</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Change</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Change %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {versionComparison.differences.map((diff, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-cyan-700">{diff.itemNo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900">{diff.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded capitalize">
                      {diff.field}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">{diff.valueA.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">{diff.valueB.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold ${
                      diff.change > 0 ? 'text-green-600' : diff.change < 0 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {diff.change > 0 ? '+' : ''}{diff.change.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold ${
                      diff.changePct > 0 ? 'text-green-600' : diff.changePct < 0 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {diff.changePct > 0 ? '+' : ''}{diff.changePct.toFixed(2)}%
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

function ImportTab() {
  return (
    <div className="space-y-6">
      {/* Import Wizard */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Import BOQ from Excel</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Version</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>W-001 (Working - Draft)</option>
              <option>Create New Version</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Excel File</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm text-slate-600">Drag and drop your Excel file here, or click to browse</p>
              <p className="text-xs text-slate-400 mt-2">Supported formats: .xlsx, .xls (Max 50 MB)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700">
              Import & Validate
            </button>
            <button className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Import History */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Import History</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {importResults.map(result => (
            <div key={result.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{result.fileName}</p>
                  <p className="text-xs text-slate-500">
                    Imported on {new Date(result.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  result.status === 'completed' ? 'bg-green-100 text-green-700' :
                  result.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Total Rows</p>
                  <p className="text-lg font-bold text-slate-900">{result.totalRows}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600">Valid</p>
                  <p className="text-lg font-bold text-green-700">{result.validRows}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600">Invalid</p>
                  <p className="text-lg font-bold text-red-700">{result.invalidRows}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-700 mb-2">Errors & Warnings:</p>
                  <div className="space-y-1">
                    {result.errors.slice(0, 3).map((error, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className={`px-1.5 py-0.5 rounded ${
                          error.severity === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {error.severity}
                        </span>
                        <span className="text-slate-600">
                          Row {error.row}, {error.column}: {error.message}
                        </span>
                      </div>
                    ))}
                    {result.errors.length > 3 && (
                      <p className="text-xs text-slate-500">
                        + {result.errors.length - 3} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
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
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
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
