import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  companies,
  groups,
  legalEntities,
  branches,
  businessUnits,
  divisions,
  departments,
  costCentres,
  profitCentres,
  projects,
  sites,
  geofences,
  allocations,
  projectLifecycleStatuses,
  siteStatuses,
  projectTypes,
  contractModes
} from '../data/organizationData';
import {
  Building2, MapPin, Users, Calendar, DollarSign, TrendingUp,
  CheckCircle2, Clock, AlertTriangle, Eye, Edit, Plus,
  ChevronRight, ChevronDown, Globe, Target, Briefcase,
  Layers, GitBranch, Shield, Map
} from 'lucide-react';

type Tab = 'overview' | 'hierarchy' | 'projects' | 'sites' | 'allocations' | 'geofence';

export function OrganizationDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Eye size={14} /> },
    { id: 'hierarchy', label: 'Organization Structure', icon: <GitBranch size={14} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={14} /> },
    { id: 'sites', label: 'Sites', icon: <MapPin size={14} /> },
    { id: 'allocations', label: 'Allocations', icon: <Users size={14} /> },
    { id: 'geofence', label: 'Geofence Editor', icon: <Map size={14} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Organization & Project Master</h1>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">ff.org</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Part 4 — Enterprise hierarchy: Company → Project → Site with geofences and allocations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
            <CheckCircle2 size={14} />
            {projects.length} Active Projects
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'hierarchy' && <HierarchyTab />}
        {activeTab === 'projects' && <ProjectsTab selected={selectedProject} onSelect={setSelectedProject} />}
        {activeTab === 'sites' && <SitesTab selected={selectedSite} onSelect={setSelectedSite} />}
        {activeTab === 'allocations' && <AllocationsTab />}
        {activeTab === 'geofence' && <GeofenceTab />}
      </motion.div>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { label: 'Companies', value: companies.length, icon: <Building2 size={16} />, color: 'blue' },
    { label: 'Business Units', value: businessUnits.length, icon: <Layers size={16} />, color: 'violet' },
    { label: 'Divisions', value: divisions.length, icon: <GitBranch size={16} />, color: 'indigo' },
    { label: 'Active Projects', value: projects.filter(p => p.lifecycleStatus === 'active').length, icon: <Briefcase size={16} />, color: 'emerald' },
    { label: 'Active Sites', value: sites.filter(s => s.status === 'active').length, icon: <MapPin size={16} />, color: 'amber' },
    { label: 'Total Allocations', value: allocations.filter(a => a.isActive).length, icon: <Users size={16} />, color: 'rose' },
  ];

  const projectStatusCounts = projectLifecycleStatuses.map(status => ({
    ...status,
    count: projects.filter(p => p.lifecycleStatus === status.value).length
  }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm"
          >
            <div className={`inline-flex p-1.5 rounded-md bg-${stat.color}-50 text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-[10px] text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Hierarchy Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Enterprise Hierarchy</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <HierarchyNode label="Company" count={companies.length} color="blue" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Group" count={groups.length} color="violet" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Legal Entity" count={legalEntities.length} color="indigo" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Branch" count={branches.length} color="cyan" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Business Unit" count={businessUnits.length} color="emerald" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Division" count={divisions.length} color="teal" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Department" count={departments.length} color="amber" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Project" count={projects.length} color="rose" />
          <ChevronRight size={16} className="text-slate-400" />
          <HierarchyNode label="Site" count={sites.length} color="orange" />
        </div>
      </div>

      {/* Project Lifecycle Distribution */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Project Lifecycle Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {projectStatusCounts.filter(s => s.count > 0).map((status, i) => (
            <motion.div
              key={status.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-3 rounded-lg border-2 bg-${status.color}-50 border-${status.color}-200`}
            >
              <p className={`text-2xl font-bold text-${status.color}-700`}>{status.count}</p>
              <p className={`text-[10px] font-medium text-${status.color}-600`}>{status.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Protocol Control Points</h3>
        </div>
        <div className="p-3 space-y-2">
          <ControlPoint
            id="CP-ORG-01"
            stage="PLAN"
            control="Project/site cannot move to Active until PM, site manager, cost centre, geofence and RACI assigned"
            enforcement="EXCEPTION"
            status="observe"
          />
          <ControlPoint
            id="CP-ORG-02"
            stage="APPROVE"
            control="Geofence and hierarchy changes require maker-checker with reason"
            enforcement="BLOCK"
            status="observe"
          />
          <ControlPoint
            id="CP-ORG-03"
            stage="CLOSE"
            control="Project closure blocked with open POs, WAs, exceptions, findings, unreconciled stock or unposted bills"
            enforcement="EXCEPTION"
            status="observe"
          />
        </div>
      </div>
    </div>
  );
}

function HierarchyNode({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`px-3 py-2 rounded-lg bg-${color}-50 border-2 border-${color}-200 text-center`}>
      <p className={`text-lg font-bold text-${color}-700`}>{count}</p>
      <p className={`text-[10px] font-medium text-${color}-600`}>{label}</p>
    </div>
  );
}

function HierarchyTab() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['comp_001']));

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Organization Structure Explorer</h3>
      <div className="space-y-1">
        {companies.map(company => (
          <TreeNode
            key={company.id}
            id={company.id}
            label={company.name}
            sublabel={company.code}
            icon={<Building2 size={14} className="text-blue-600" />}
            expanded={expandedNodes.has(company.id)}
            onToggle={() => toggleNode(company.id)}
            level={0}
          >
            {groups.filter(g => g.companyId === company.id).map(group => (
              <TreeNode
                key={group.id}
                id={group.id}
                label={group.name}
                sublabel={group.code}
                icon={<Layers size={14} className="text-violet-600" />}
                expanded={expandedNodes.has(group.id)}
                onToggle={() => toggleNode(group.id)}
                level={1}
              >
                {legalEntities.filter(le => le.groupId === group.id).map(le => (
                  <TreeNode
                    key={le.id}
                    id={le.id}
                    label={le.legalName}
                    sublabel={le.code}
                    icon={<Shield size={14} className="text-indigo-600" />}
                    expanded={expandedNodes.has(le.id)}
                    onToggle={() => toggleNode(le.id)}
                    level={2}
                  >
                    {branches.filter(b => b.legalEntityId === le.id).map(branch => (
                      <TreeNode
                        key={branch.id}
                        id={branch.id}
                        label={branch.name}
                        sublabel={branch.code}
                        icon={<MapPin size={14} className="text-cyan-600" />}
                        level={3}
                        isLeaf
                      />
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
            {businessUnits.filter(bu => bu.companyId === company.id).map(bu => (
              <TreeNode
                key={bu.id}
                id={bu.id}
                label={bu.name}
                sublabel={bu.code}
                icon={<Briefcase size={14} className="text-emerald-600" />}
                expanded={expandedNodes.has(bu.id)}
                onToggle={() => toggleNode(bu.id)}
                level={1}
              >
                {divisions.filter(d => d.businessUnitId === bu.id).map(div => (
                  <TreeNode
                    key={div.id}
                    id={div.id}
                    label={div.name}
                    sublabel={div.code}
                    icon={<GitBranch size={14} className="text-teal-600" />}
                    expanded={expandedNodes.has(div.id)}
                    onToggle={() => toggleNode(div.id)}
                    level={2}
                  >
                    {departments.filter(dept => dept.divisionId === div.id).map(dept => (
                      <TreeNode
                        key={dept.id}
                        id={dept.id}
                        label={dept.name}
                        sublabel={dept.code}
                        icon={<Users size={14} className="text-amber-600" />}
                        level={3}
                        isLeaf
                      />
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        ))}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  level: number;
  isLeaf?: boolean;
  children?: React.ReactNode;
}

function TreeNode({ id, label, sublabel, icon, expanded, onToggle, level, isLeaf, children }: TreeNodeProps) {
  return (
    <div>
      <div
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={!isLeaf ? onToggle : undefined}
      >
        {!isLeaf && (
          expanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
        )}
        {icon}
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-900">{label}</p>
          <p className="text-[10px] text-slate-400 font-mono">{sublabel}</p>
        </div>
      </div>
      {expanded && children && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

function ProjectsTab({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const selectedProject = projects.find(p => p.id === selected);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Projects ({projects.length})</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
            <Plus size={14} />
            New Project
          </button>
        </div>
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {projects.map(project => {
            const status = projectLifecycleStatuses.find(s => s.value === project.lifecycleStatus);
            const statusColor = status?.color || 'slate';
            const statusLabel = status?.label || 'Unknown';
            return (
              <div
                key={project.id}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${selected === project.id ? 'bg-blue-50' : ''}`}
                onClick={() => onSelect(project.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{project.projectCode}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded bg-${statusColor}-50 text-${statusColor}-700 border border-${statusColor}-200`}>
                    {statusLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                  <div>
                    <span className="text-slate-400">Client:</span> {project.clientName}
                  </div>
                  <div>
                    <span className="text-slate-400">PM:</span> {project.projectManagerName}
                  </div>
                  <div>
                    <span className="text-slate-400">Start:</span> {new Date(project.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-slate-400">Value:</span> ₹{(project.contractValue / 10000000).toFixed(1)} Cr
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Project Details</h3>
          <div className="space-y-3 text-xs">
            <DetailRow label="Project Code" value={selectedProject.projectCode} />
            <DetailRow label="Client" value={selectedProject.clientName} />
            <DetailRow label="Type" value={projectTypes.find(t => t.value === selectedProject.projectType)?.label || selectedProject.projectType} />
            <DetailRow label="Contract Mode" value={contractModes.find(c => c.value === selectedProject.contractMode)?.label || selectedProject.contractMode} />
            <DetailRow label="Location" value={`${selectedProject.district}, ${selectedProject.stateCode}`} />
            <DetailRow label="Start Date" value={new Date(selectedProject.startDate).toLocaleDateString()} />
            <DetailRow label="Planned Finish" value={new Date(selectedProject.plannedFinish).toLocaleDateString()} />
            {selectedProject.revisedFinish && (
              <DetailRow label="Revised Finish" value={new Date(selectedProject.revisedFinish).toLocaleDateString()} highlight />
            )}
            <DetailRow label="Project Manager" value={selectedProject.projectManagerName} />
            <DetailRow label="Contract Value" value={`₹${(selectedProject.contractValue / 10000000).toFixed(2)} Cr`} />
            <DetailRow label="Cost Centre" value={costCentres.find(cc => cc.id === selectedProject.costCentreId)?.code || selectedProject.costCentreId} />
            <DetailRow label="Profit Centre" value={profitCentres.find(pc => pc.id === selectedProject.profitCentreId)?.code || selectedProject.profitCentreId} />
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 mb-1">Legacy Status</p>
              <p className="text-xs text-slate-600 font-mono">{selectedProject.legacyStatus}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SitesTab({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const selectedSite = sites.find(s => s.id === selected);
  const siteGeofence = selectedSite ? geofences.find(g => g.siteId === selectedSite.id) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Sites ({sites.length})</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {sites.map(site => {
            const status = siteStatuses.find(s => s.value === site.status);
            const statusColor = status?.color || 'slate';
            const statusLabel = status?.label || 'Unknown';
            const project = projects.find(p => p.id === site.projectId);
            return (
              <div
                key={site.id}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${selected === site.id ? 'bg-blue-50' : ''}`}
                onClick={() => onSelect(site.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{site.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{site.siteCode}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded bg-${statusColor}-50 text-${statusColor}-700 border border-${statusColor}-200`}>
                    {statusLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                  <div>
                    <span className="text-slate-400">Project:</span> {project?.name}
                  </div>
                  <div>
                    <span className="text-slate-400">Manager:</span> {site.siteManagerName}
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Location:</span> {site.address}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedSite && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Site Details</h3>
          <div className="space-y-3 text-xs">
            <DetailRow label="Site Code" value={selectedSite.siteCode} />
            <DetailRow label="Site Manager" value={selectedSite.siteManagerName} />
            <DetailRow label="Address" value={selectedSite.address} />
            <DetailRow label="Coordinates" value={`${selectedSite.lat.toFixed(4)}, ${selectedSite.lng.toFixed(4)}`} />
            <DetailRow label="Timezone" value={selectedSite.timezone} />
            
            {siteGeofence && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Geofence</p>
                <DetailRow label="Type" value={siteGeofence.type} />
                {siteGeofence.type === 'circle' && (
                  <DetailRow label="Radius" value={`${siteGeofence.radiusM}m`} />
                )}
                <DetailRow label="Accuracy Tolerance" value={`${siteGeofence.accuracyToleranceM}m`} />
                <DetailRow label="Version" value={`v${siteGeofence.version}`} />
                <DetailRow label="Valid From" value={new Date(siteGeofence.validFrom).toLocaleDateString()} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AllocationsTab() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Project Allocations ({allocations.filter(a => a.isActive).length})</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
          <Plus size={14} />
          New Allocation
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">User</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Project</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Site</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Role</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Period</th>
              <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Allocation %</th>
            </tr>
          </thead>
          <tbody>
            {allocations.filter(a => a.isActive).map((alloc, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-3 py-2">
                  <p className="font-medium text-slate-900">{alloc.userName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{alloc.userId}</p>
                </td>
                <td className="px-3 py-2 text-slate-700">{alloc.projectName}</td>
                <td className="px-3 py-2 text-slate-500">{alloc.siteName || '—'}</td>
                <td className="px-3 py-2">
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{alloc.roleOnProject}</span>
                </td>
                <td className="px-3 py-2 text-[10px] text-slate-500">
                  {new Date(alloc.fromDate).toLocaleDateString()} — {alloc.toDate ? new Date(alloc.toDate).toLocaleDateString() : 'Present'}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-xs font-bold ${alloc.allocationPercent === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                    {alloc.allocationPercent}%
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

function GeofenceTab() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <Map size={16} />
          Geofence Editor — Super Admin Only
        </h4>
        <p className="text-xs text-blue-700 mt-1">
          Define attendance validation boundaries for sites. Changes are versioned, effective-dated, and require approval (CP-ORG-02).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Active Geofences</h3>
          <div className="space-y-2">
            {geofences.map(gf => {
              const site = sites.find(s => s.id === gf.siteId);
              return (
                <div key={gf.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-slate-900">{site?.name}</p>
                    <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded font-mono">v{gf.version}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                    <div>
                      <span className="text-slate-400">Type:</span> {gf.type}
                    </div>
                    {gf.type === 'circle' && (
                      <div>
                        <span className="text-slate-400">Radius:</span> {gf.radiusM}m
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400">Accuracy:</span> {gf.accuracyToleranceM}m
                    </div>
                    <div>
                      <span className="text-slate-400">Valid From:</span> {new Date(gf.validFrom).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Map Preview</h3>
          <div className="bg-slate-100 rounded-lg h-80 flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-center">
              <Map size={48} className="text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Interactive map integration</p>
              <p className="text-[10px] text-slate-400 mt-1">Part 80 — Maps Provider</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
              <Plus size={14} />
              Draw Circle
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700 transition-colors">
              <Plus size={14} />
              Draw Polygon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlPoint({ id, stage, control, enforcement, status }: {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
      <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
        <Shield size={16} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <code className="text-[10px] font-mono text-slate-400">{id}</code>
          <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded font-medium">{stage}</span>
          <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">{status.toUpperCase()}</span>
        </div>
        <p className="text-xs text-slate-700">{control}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Enforcement: {enforcement}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className={`text-xs ${highlight ? 'text-amber-600 font-medium' : 'text-slate-700'}`}>{value}</p>
    </div>
  );
}
