import { useState } from 'react';
import { motion } from 'framer-motion';
import { documentationFiles } from '../data/mockData';
import { FileText, Folder, CheckCircle2, Search, ChevronRight } from 'lucide-react';

export function Documentation() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...new Set(documentationFiles.map(f => f.category))];

  const filteredFiles = documentationFiles.filter(f => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch = f.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedFiles = filteredFiles.reduce((acc, file) => {
    if (!acc[file.category]) acc[file.category] = [];
    acc[file.category].push(file);
    return acc;
  }, {} as Record<string, typeof documentationFiles>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Documentation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Program documentation set — architecture, rules, baselines, and evidence
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* File Tree */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">docs/erp-program/</span>
          </div>
          <span className="text-[10px] text-slate-400">{filteredFiles.length} files</span>
        </div>
        
        <div className="p-2">
          {Object.entries(groupedFiles).map(([category, files]) => (
            <div key={category} className="mb-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <ChevronRight size={12} />
                {category}
                <span className="text-slate-300 font-normal">({files.length})</span>
              </div>
              <div className="space-y-0.5">
                {files.map((file, i) => (
                  <motion.div
                    key={file.path}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <FileText size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm text-slate-700 font-mono group-hover:text-blue-700 transition-colors flex-1">
                      {file.path}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-600">
                      <CheckCircle2 size={10} />
                      {file.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Required Documents (SA-21)</h3>
          <ul className="space-y-2">
            {[
              'PROGRAM_RULES.md — Consolidated rules reference',
              'DB_EXTENSIONS.md — Database changes log',
              'EVENT_CATALOGUE.md — All registered events',
              'PERMISSION_REGISTRY.md — Permission keys & mapping',
              'PROTOCOL_REGISTER.md — Control points & modes',
              'CONFLICTS.md — Conflicts with existing system',
              'DECISIONS.md — Sign-off entries',
            ].map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Baseline Artifacts</h3>
          <ul className="space-y-2">
            {[
              'baseline/schema_baseline.sql — Full DDL export',
              'baseline/schema_baseline.json — Machine-readable',
              'baseline/data_baseline.csv — Row counts & checksums',
              'baseline/protocol_baseline.md — Workflow coverage',
              'baseline/BASELINE_REPORT.md — Stack summary',
              'discovery/part-0.md — REUSE/EXTEND/NEW analysis',
              'test-evidence/part-0/ — Regression evidence',
            ].map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reading Order */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900">Prerequisite Reading Order</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            '01_SHARED_ARCHITECTURE.md',
            '02_PROTOCOL_CONTROL_FRAMEWORK.md',
            '03_NON_NEGOTIABLE_RULES.md',
            '13_SECURE_DEVELOPMENT_STANDARD.md',
            'EXISTING_SYSTEM_MAP.md',
          ].map((doc, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] font-mono">
              <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                {i + 1}
              </span>
              {doc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
