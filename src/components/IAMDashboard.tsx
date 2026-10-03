import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  permissions,
  roles,
  rolePermissions,
  userAssignments,
  fieldPolicies,
  recordRules,
  sodRules,
  legacyMappings,
  users,
  protocolControlPoints,
  shadowMismatches
} from '../data/iamData';
import {
  Shield, Users, Key, Lock, Eye, AlertTriangle, CheckCircle2,
  XCircle, ChevronRight, ChevronDown, Building2, Briefcase,
  MapPin, User, Settings, Activity, GitBranch
} from 'lucide-react';

type Tab = 'overview' | 'permissions' | 'roles' | 'assignments' | 'effective' | 'sod' | 'shadow';

export function IAMDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Eye size={14} /> },
    { id: 'permissions', label: 'Permissions', icon: <Key size={14} /> },
    { id: 'roles', label: 'Roles', icon: <Users size={14} /> },
    { id: 'assignments', label: 'Assignments', icon: <User size={14} /> },
    { id: 'effective', label: 'Effective Permissions', icon: <Shield size={14} /> },
    { id: 'sod', label: 'SoD Rules', icon: <AlertTriangle size={14} /> },
    { id: 'shadow', label: 'Shadow Mode', icon: <Activity size={14} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">User, Role & Permission Architecture</h1>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">ff.iam</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Part 5 — Enterprise RBAC with scoped grants and field-level masking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
            <CheckCircle2 size={14} />
            Shadow Mode Active
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
        {activeTab === 'permissions' && <PermissionsTab />}
        {activeTab === 'roles' && <RolesTab selected={selectedRole} onSelect={setSelectedRole} />}
        {activeTab === 'assignments' && <AssignmentsTab selected={selectedUser} onSelect={setSelectedUser} />}
        {activeTab === 'effective' && <EffectiveTab />}
        {activeTab === 'sod' && <SoDTab />}
        {activeTab === 'shadow' && <ShadowTab />}
      </motion.div>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { label: 'Permissions', value: permissions.length, icon: <Key size={16} />, color: 'blue' },
    { label: 'Roles', value: roles.length, icon: <Users size={16} />, color: 'violet' },
    { label: 'Users', value: users.length, icon: <User size={16} />, color: 'emerald' },
    { label: 'Active Assignments', value: userAssignments.filter(a => a.isActive).length, icon: <GitBranch size={16} />, color: 'amber' },
    { label: 'SoD Rules', value: sodRules.length, icon: <AlertTriangle size={16} />, color: 'rose' },
    { label: 'Field Policies', value: fieldPolicies.length, icon: <Lock size={16} />, color: 'indigo' },
  ];

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

      {/* Permission Hierarchy */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Permission Scope Hierarchy</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <ScopeNode label="User" icon={<User size={14} />} color="blue" />
          <ChevronRight size={16} className="text-slate-400" />
          <ScopeNode label="Role" icon={<Users size={14} />} color="violet" />
          <ChevronRight size={16} className="text-slate-400" />
          <ScopeNode label="Department" icon={<Building2 size={14} />} color="indigo" />
          <ChevronRight size={16} className="text-slate-400" />
          <ScopeNode label="Project" icon={<Briefcase size={14} />} color="emerald" />
          <ChevronRight size={16} className="text-slate-400" />
          <ScopeNode label="Site" icon={<MapPin size={14} />} color="amber" />
          <ChevronRight size={16} className="text-slate-400" />
          <ScopeNode label="Module" icon={<Settings size={14} />} color="rose" />
          <ChevronRight size={16} className="text-slate-400" />
          <ScopeNode label="Feature" icon={<Key size={16} />} color="cyan" />
          <ChevronRight size={16} className="text-slate-400" />
          <ScopeNode label="Action" icon={<Shield size={14} />} color="teal" />
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Protocol Control Points</h3>
        </div>
        <div className="p-3 space-y-2">
          {protocolControlPoints.map(cp => (
            <div key={cp.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Shield size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[10px] font-mono text-slate-400">{cp.id}</code>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">{cp.stage}</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">{cp.status.toUpperCase()}</span>
                </div>
                <p className="text-xs text-slate-700">{cp.control}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Enforcement: {cp.enforcement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enforcement Layers */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Four-Layer Authorization (SA-5)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <EnforcementLayer layer="UI" description="Menu/route guards, disabled actions" color="blue" />
          <EnforcementLayer layer="API" description="Middleware checks on every endpoint" color="violet" />
          <EnforcementLayer layer="Service" description="Business logic authorization" color="emerald" />
          <EnforcementLayer layer="Data" description="Row-level security, field masking" color="amber" />
        </div>
      </div>
    </div>
  );
}

function ScopeNode({ label, icon, color }: { label: string; icon: React.ReactNode; color: string }) {
  return (
    <div className={`px-3 py-2 rounded-lg bg-${color}-50 border-2 border-${color}-200 text-center`}>
      <div className={`text-${color}-600 mb-1 flex justify-center`}>{icon}</div>
      <p className={`text-[10px] font-medium text-${color}-700`}>{label}</p>
    </div>
  );
}

function EnforcementLayer({ layer, description, color }: { layer: string; description: string; color: string }) {
  return (
    <div className={`p-3 rounded-lg border-2 border-${color}-200 bg-${color}-50`}>
      <p className={`text-sm font-bold text-${color}-700 mb-1`}>{layer}</p>
      <p className="text-[10px] text-slate-600">{description}</p>
    </div>
  );
}

function PermissionsTab() {
  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Permission Registry ({permissions.length} permissions)</h3>
      </div>
      <div className="p-4 space-y-4">
        {Object.entries(permissionsByModule).map(([module, perms]) => (
          <div key={module} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h4 className="text-xs font-semibold text-slate-700 uppercase">{module}</h4>
            </div>
            <div className="divide-y divide-slate-100">
              {perms.map(perm => (
                <div key={perm.key} className="px-4 py-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <code className="text-xs font-mono text-blue-700">{perm.key}</code>
                      <p className="text-[10px] text-slate-500 mt-0.5">{perm.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {perm.pcStage && (
                        <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded">{perm.pcStage}</span>
                      )}
                      {perm.isSensitive && (
                        <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Lock size={8} /> Sensitive
                        </span>
                      )}
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{perm.defaultScope}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RolesTab({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const selectedRoleData = roles.find(r => r.id === selected);
  const rolePerms = selected ? rolePermissions.filter(rp => rp.roleId === selected) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">System Roles ({roles.length})</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {roles.map(role => (
            <div
              key={role.id}
              className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${selected === role.id ? 'bg-blue-50' : ''}`}
              onClick={() => onSelect(role.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{role.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{role.code}</p>
                </div>
                {role.isSystem && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                    System
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-2">{role.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span>{role.userCount} users</span>
                <span>·</span>
                <span>{role.permissionCount} permissions</span>
                <span>·</span>
                <span>Max scope: {role.maxScope}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoleData && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Role Details</h3>
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">Role Code</p>
              <p className="text-xs text-slate-700 font-mono">{selectedRoleData.code}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Description</p>
              <p className="text-xs text-slate-700">{selectedRoleData.description}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Max Scope</p>
              <p className="text-xs text-slate-700">{selectedRoleData.maxScope}</p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Assigned Permissions</p>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {rolePerms.map((rp, i) => {
                  const perm = permissions.find(p => p.key === rp.permissionKey);
                  return (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div>
                        <code className="text-[10px] font-mono text-blue-700">{rp.permissionKey}</code>
                        <p className="text-[10px] text-slate-500">{perm?.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          rp.effect === 'allow' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {rp.effect}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{rp.scopeType}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AssignmentsTab({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const selectedUserAssignments = selected ? userAssignments.filter(a => a.userId === selected) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">User Assignments ({userAssignments.filter(a => a.isActive).length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Role</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Scope</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Period</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {userAssignments.map(assign => (
                <tr
                  key={assign.id}
                  className={`border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer ${selected === assign.userId ? 'bg-blue-50' : ''}`}
                  onClick={() => onSelect(assign.userId)}
                >
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-900">{assign.userName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{assign.userId}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{assign.roleName}</td>
                  <td className="px-3 py-2">
                    <p className="text-slate-700">{assign.scopeName}</p>
                    <p className="text-[10px] text-slate-400">{assign.scopeType}</p>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-500">
                    {new Date(assign.validFrom).toLocaleDateString()} — {assign.validTo ? new Date(assign.validTo).toLocaleDateString() : 'Present'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      assign.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {assign.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-3">User Assignments</h3>
          <div className="space-y-2">
            {selectedUserAssignments.map(assign => (
              <div key={assign.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-900">{assign.roleName}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    assign.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {assign.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-500">
                  <div>
                    <span className="text-slate-400">Scope:</span> {assign.scopeName} ({assign.scopeType})
                  </div>
                  <div>
                    <span className="text-slate-400">Period:</span> {new Date(assign.validFrom).toLocaleDateString()} — {assign.validTo ? new Date(assign.validTo).toLocaleDateString() : 'Present'}
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned by:</span> {assign.assignedBy}
                  </div>
                  <div>
                    <span className="text-slate-400">Reason:</span> {assign.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function EffectiveTab() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900">Effective Permission Explorer</h4>
        <p className="text-xs text-blue-700 mt-1">
          Select a user to see their effective permissions with source role and scope ("explain" feature).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">User: Rajesh Kumar (usr_pm_001)</h3>
        <div className="space-y-2">
          <EffectivePermission
            permissionKey="org.project.create"
            effect="allow"
            source="Role: Project Manager"
            scope="Project: Riverside Tower — Phase II"
            pcStage="PLAN"
          />
          <EffectivePermission
            permissionKey="mat.pr.approve"
            effect="allow"
            source="Role: Project Manager"
            scope="Project: Riverside Tower — Phase II"
            pcStage="APPROVE"
          />
          <EffectivePermission
            permissionKey="mat.po.approve"
            effect="allow"
            source="Role: Project Manager"
            scope="Project: Riverside Tower — Phase II"
            condition="Amount ≤ ₹5,00,000"
            pcStage="APPROVE"
          />
          <EffectivePermission
            permissionKey="fin.payment.approve"
            effect="deny"
            source="SoD Rule: SOD_PAYMENT_CREATE_APPROVE"
            scope="Company"
            pcStage="APPROVE"
          />
        </div>
      </div>
    </div>
  );
}

function EffectivePermission({ permissionKey, effect, source, scope, condition, pcStage }: {
  permissionKey: string;
  effect: 'allow' | 'deny';
  source: string;
  scope: string;
  condition?: string;
  pcStage?: string;
}) {
  return (
    <div className={`p-3 rounded-lg border ${effect === 'allow' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <code className="text-xs font-mono text-slate-900">{permissionKey}</code>
        <div className="flex items-center gap-1">
          {pcStage && (
            <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded">{pcStage}</span>
          )}
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            effect === 'allow' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {effect.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="space-y-0.5 text-[10px] text-slate-600">
        <div><span className="text-slate-400">Source:</span> {source}</div>
        <div><span className="text-slate-400">Scope:</span> {scope}</div>
        {condition && <div><span className="text-slate-400">Condition:</span> {condition}</div>}
      </div>
    </div>
  );
}

function SoDTab() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Segregation of Duties Rules ({sodRules.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Code</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Permission A</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Permission B</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Scope</th>
              <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Severity</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Description</th>
            </tr>
          </thead>
          <tbody>
            {sodRules.map(rule => (
              <tr key={rule.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{rule.code}</td>
                <td className="px-3 py-2">
                  <code className="text-[10px] font-mono text-blue-700">{rule.permissionA}</code>
                </td>
                <td className="px-3 py-2">
                  <code className="text-[10px] font-mono text-blue-700">{rule.permissionB}</code>
                </td>
                <td className="px-3 py-2 text-slate-700">{rule.scope}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    rule.severity === 'block' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {rule.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-600">{rule.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShadowTab() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
          <Activity size={16} />
          Shadow Mode — Legacy Compatibility
        </h4>
        <p className="text-xs text-amber-700 mt-1">
          New permission engine runs in parallel with legacy middleware. Mismatches are logged for review before switch-over.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Mismatches</p>
          <p className="text-2xl font-bold text-amber-600 mt-2">{shadowMismatches.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Under Review</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{shadowMismatches.filter(m => m.action === 'under_review').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Confirmed</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{shadowMismatches.filter(m => m.action === 'confirmed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Mismatch Report</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Permission</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Legacy</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">New</th>
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Reason</th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {shadowMismatches.map((mismatch, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{mismatch.userId}</td>
                  <td className="px-3 py-2">
                    <code className="text-[10px] font-mono text-blue-700">{mismatch.permissionKey}</code>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {mismatch.legacyAccess ? (
                      <CheckCircle2 size={14} className="text-green-500 inline" />
                    ) : (
                      <XCircle size={14} className="text-red-400 inline" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {mismatch.newAccess ? (
                      <CheckCircle2 size={14} className="text-green-500 inline" />
                    ) : (
                      <XCircle size={14} className="text-red-400 inline" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-600">{mismatch.reason}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      mismatch.action === 'under_review' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {mismatch.action.replace('_', ' ')}
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
