import { useState, useEffect } from 'react';
import {
  searchDocuments,
  recentSearches,
  favourites,
  commandActions,
  searchSynonyms,
  searchAnalytics,
  protocolControlPoints,
  searchStats,
  searchFacets
} from '../data/searchData';

export function SearchCommandCenter() {
  const [activeTab, setActiveTab] = useState('search');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacets, setSelectedFacets] = useState<string[]>([]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  const tabs = [
    { id: 'search', label: 'Global Search', icon: '🔍' },
    { id: 'recent', label: 'Recent', icon: '🕐' },
    { id: 'favourites', label: 'Favourites', icon: '⭐' },
    { id: 'actions', label: 'Quick Actions', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'synonyms', label: 'Synonyms', icon: '🔤' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Search & Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Part 17 — Permission-safe universal search with command palette</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            ff.search
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            Active
          </span>
          <button
            onClick={() => setShowCommandPalette(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            ⌘K Command Palette
          </button>
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
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
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
      {activeTab === 'search' && (
        <GlobalSearchTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFacets={selectedFacets}
          setSelectedFacets={setSelectedFacets}
        />
      )}
      {activeTab === 'recent' && <RecentTab />}
      {activeTab === 'favourites' && <FavouritesTab />}
      {activeTab === 'actions' && <ActionsTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'synonyms' && <SynonymsTab />}

      {/* Command Palette Overlay */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
    </div>
  );
}

function GlobalSearchTab({
  searchQuery,
  setSearchQuery,
  selectedFacets,
  setSelectedFacets
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedFacets: string[];
  setSelectedFacets: (f: string[]) => void;
}) {
  // Filter documents based on search query and facets
  const filteredDocs = searchDocuments.filter(doc => {
    const matchesQuery = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bodyText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFacets = selectedFacets.length === 0 || 
      selectedFacets.some(f => 
        doc.module === f || 
        doc.status === f || 
        doc.entityType === f
      );
    
    return matchesQuery && matchesFacets;
  });

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all modules... (try: po:, vendor:, emp:, boq:)"
            className="w-full px-4 py-3 pl-12 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          💡 Tip: Use prefixes like <code className="bg-slate-100 px-1 rounded">po:</code>, <code className="bg-slate-100 px-1 rounded">vendor:</code>, <code className="bg-slate-100 px-1 rounded">emp:</code> to search specific types
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Facets Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Module Facet */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Modules</h3>
            <div className="space-y-2">
              {searchFacets.modules.map(facet => (
                <label key={facet.code} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFacets.includes(facet.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFacets([...selectedFacets, facet.code]);
                        } else {
                          setSelectedFacets(selectedFacets.filter(f => f !== facet.code));
                        }
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{facet.label}</span>
                  </div>
                  <span className="text-xs text-slate-500">{facet.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Facet */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Status</h3>
            <div className="space-y-2">
              {searchFacets.statuses.map(facet => (
                <label key={facet.code} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFacets.includes(facet.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFacets([...selectedFacets, facet.code]);
                        } else {
                          setSelectedFacets(selectedFacets.filter(f => f !== facet.code));
                        }
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{facet.label}</span>
                  </div>
                  <span className="text-xs text-slate-500">{facet.count}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {filteredDocs.length} result{filteredDocs.length !== 1 ? 's' : ''} found
              </h3>
              {selectedFacets.length > 0 && (
                <button
                  onClick={() => setSelectedFacets([])}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-200">
              {filteredDocs.map(doc => (
                <div key={doc.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{doc.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">{doc.title}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                          {doc.entityType}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          doc.status === 'active' || doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                          doc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      {doc.subtitle && (
                        <p className="text-xs text-slate-600 mb-1">{doc.subtitle}</p>
                      )}
                      <p className="text-xs text-slate-500 line-clamp-2">{doc.bodyText}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>📅 {new Date(doc.docDate).toLocaleDateString()}</span>
                        <span>🏢 {doc.module}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700">
                      Open →
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
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

function RecentTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Recent Records</h3>
        <p className="text-sm text-slate-500 mt-1">Last 50 records you've viewed</p>
      </div>
      <div className="divide-y divide-slate-200">
        {recentSearches.map(recent => (
          <div key={recent.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{recent.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900">{recent.title}</h4>
                <p className="text-xs text-slate-500">
                  Viewed {new Date(recent.viewedAt).toLocaleString()}
                </p>
              </div>
              <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700">
                Open →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavouritesTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Favourites</h3>
        <p className="text-sm text-slate-500 mt-1">Your pinned records and modules</p>
      </div>
      <div className="divide-y divide-slate-200">
        {favourites.map(fav => (
          <div key={fav.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{fav.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900">{fav.title}</h4>
                <p className="text-xs text-slate-500">
                  Added {new Date(fav.addedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600">
                  ⭐ Unpin
                </button>
                <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700">
                  Open →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        <p className="text-sm text-slate-500 mt-1">Context-aware actions based on your permissions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {commandActions.map(action => (
          <div key={action.code} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-500 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{action.label}</h4>
                  <p className="text-xs text-slate-500">{action.module}</p>
                </div>
              </div>
              {action.shortcut && (
                <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded">
                  {action.shortcut}
                </kbd>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Permission: <code className="bg-slate-200 px-1 rounded">{action.permissionKey}</code>
            </p>
            {action.contextEntityTypes.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Context: {action.contextEntityTypes.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Documents"
          value={searchStats.totalDocuments}
          subtitle="Indexed"
          icon="📄"
          color="indigo"
        />
        <StatCard
          title="Avg Searches/Day"
          value={searchStats.avgSearchesPerDay}
          subtitle="Last 30 days"
          icon="🔍"
          color="blue"
        />
        <StatCard
          title="Zero Results"
          value={searchStats.zeroResultQueries}
          subtitle="Need synonyms"
          icon="⚠️"
          color="amber"
        />
        <StatCard
          title="Synonyms"
          value={searchStats.totalSynonyms}
          subtitle="Configured"
          icon="🔤"
          color="green"
        />
      </div>

      {/* Search Analytics */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Search Analytics</h3>
          <p className="text-sm text-slate-500 mt-1">Most searched terms and zero-result queries</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Query</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Count</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Results</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Last Searched</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {searchAnalytics.map((analytics, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">{analytics.query}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-900">{analytics.count}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {analytics.zeroResults ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Zero</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Found</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(analytics.lastSearched).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {analytics.zeroResults && (
                      <button className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700">
                        Add Synonym
                      </button>
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

function SynonymsTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Search Synonyms</h3>
          <p className="text-sm text-slate-500 mt-1">Configure synonyms to improve search results</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          + Add Synonym
        </button>
      </div>
      <div className="divide-y divide-slate-200">
        {searchSynonyms.map(synonym => (
          <div key={synonym.id} className="p-4 hover:bg-slate-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{synonym.term}</h4>
                <p className="text-xs text-slate-500">
                  Created by {synonym.createdBy} on {new Date(synonym.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {synonym.synonyms.map((syn, idx) => (
                <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                  {syn}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandPalette({
  onClose,
  searchQuery,
  setSearchQuery
}: {
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const [paletteQuery, setPaletteQuery] = useState('');

  // Filter results based on query
  const filteredDocs = searchDocuments.filter(doc =>
    paletteQuery === '' ||
    doc.title.toLowerCase().includes(paletteQuery.toLowerCase()) ||
    doc.subtitle?.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  const filteredActions = commandActions.filter(action =>
    paletteQuery === '' ||
    action.label.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[600px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              value={paletteQuery}
              onChange={(e) => setPaletteQuery(e.target.value)}
              placeholder="Search records or type a command..."
              autoFocus
              className="w-full px-4 py-3 pl-12 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">⌘</span>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[500px]">
          {/* Actions */}
          {filteredActions.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Actions</h3>
              {filteredActions.slice(0, 5).map(action => (
                <button
                  key={action.code}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-left transition-colors"
                >
                  <span className="text-xl">{action.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.module}</p>
                  </div>
                  {action.shortcut && (
                    <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded">
                      {action.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Records */}
          {filteredDocs.length > 0 && (
            <div className="p-2 border-t border-slate-200">
              <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Records</h3>
              {filteredDocs.slice(0, 10).map(doc => (
                <button
                  key={doc.id}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-left transition-colors"
                >
                  <span className="text-xl">{doc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 truncate">{doc.subtitle || doc.entityType}</p>
                  </div>
                  <span className="text-xs text-slate-400">{doc.module}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent */}
          {paletteQuery === '' && (
            <div className="p-2 border-t border-slate-200">
              <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Recent</h3>
              {recentSearches.slice(0, 5).map(recent => (
                <button
                  key={recent.id}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-left transition-colors"
                >
                  <span className="text-xl">{recent.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{recent.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(recent.viewedAt).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>⌘K to toggle</span>
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
    indigo: 'bg-indigo-50 border-indigo-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
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
