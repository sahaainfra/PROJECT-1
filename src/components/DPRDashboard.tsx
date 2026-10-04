import { useState } from 'react';
import {
  dprReports,
  missingDPRs,
  protocolControlPoints as dprControlPoints,
  dprStats,
  dprCalendar
} from '../data/dprData';
import type { DPRReport } from '../data/dprData';
import { dailyPlans } from '../data/siteExecutionData';

const CUT_OFF_HOUR = 11;

function isLate(dpr: DPRReport): boolean {
  if (!dpr.submittedAt) return false;
  const d = new Date(dpr.date + 'T00:00:00Z');
  const cutoff = new Date(d.getTime() + (1 + CUT_OFF_HOUR / 24) * 86400000);
  return new Date(dpr.submittedAt).getTime() > cutoff.getTime();
}

const statusChip: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  submitted: 'bg-amber-100 text-amber-700',
  returned: 'bg-red-100 text-red-700',
  draft: 'bg-slate-100 text-slate-700'
};

export function DPRDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDPR, setSelectedDPR] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'register', label: 'DPR Register' },
    { id: 'capture', label: 'Capture (Mobile)' },
    { id: 'review', label: 'Review & Approve' },
    { id: 'missing', label: 'Missing & Calendar' },
    { id: 'protocol', label: 'Protocol Controls' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">DPR / Field Execution</h1>
          <p className="text-sm text-slate-500 mt-1">Part 30 — Daily Progress Report: activities, labour, materials, equipment, weather, photos and HSE observations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full border border-sky-200">
            ff.dpr
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-50 text-sky-700 border-b-2 border-sky-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'register' && <RegisterTab />}
      {activeTab === 'capture' && <CaptureTab />}
      {activeTab === 'review' && <ReviewTab selectedDPR={selectedDPR} setSelectedDPR={setSelectedDPR} />}
      {activeTab === 'missing' && <MissingTab />}
      {activeTab === 'protocol' && <ProtocolTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total DPRs"
          value={dprStats.totalDPRs}
          subtitle={`${dprStats.approvedDPRs} approved`}
          color="sky"
        />
        <StatCard
          title="Pending Approval"
          value={dprStats.pendingApproval}
          subtitle="Awaiting Site Manager / PM"
          color="amber"
        />
        <StatCard
          title="Missing DPRs"
          value={dprStats.missingDPRs}
          subtitle="Site / date / shift gaps"
          color="red"
        />
        <StatCard
          title="Photo Evidence"
          value={dprStats.totalPhotos}
          subtitle={`${dprStats.totalActivityLines} activity lines`}
          color="green"
        />
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">DPR Lifecycle Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Draft</p>
            <p className="text-2xl font-bold text-slate-900">{dprStats.draftDPRs}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 mb-1">Submitted</p>
            <p className="text-2xl font-bold text-amber-900">{dprStats.pendingApproval}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 mb-1">Approved (locked)</p>
            <p className="text-2xl font-bold text-green-900">{dprStats.approvedDPRs}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 mb-1">Returned</p>
            <p className="text-2xl font-bold text-red-900">{dprStats.returnedDPRs}</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
            <p className="text-xs text-sky-600 mb-1">Late (after 11:00 cut-off)</p>
            <p className="text-2xl font-bold text-sky-900">{dprReports.filter(isLate).length}</p>
          </div>
        </div>
      </div>

      {/* Linked Records */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Linked Records (link, don't duplicate)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Labour from attendance</p>
            <p className="font-semibold text-slate-900">{dprStats.totalLabourEntries} lines</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Materials from stores issues</p>
            <p className="font-semibold text-slate-900">{dprStats.totalMaterialEntries} lines</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Equipment from plant logs</p>
            <p className="font-semibold text-slate-900">{dprStats.totalEquipmentEntries} lines</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-500 text-xs mb-1">Events (visitor/instruction/quality/HSE/delay)</p>
            <p className="font-semibold text-slate-900">{dprStats.totalEvents} records</p>
          </div>
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {dprControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded">
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

function RegisterTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">DPR Register</h3>
        <p className="text-sm text-slate-500 mt-1">One DPR per site per date per shift · legacy DPRs remain viewable unchanged</p>
      </div>
      <div className="divide-y divide-slate-200">
        {dprReports.map(dpr => (
          <div key={dpr.id} className="p-6 hover:bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-mono font-semibold text-sky-700">{dpr.dprNo}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${statusChip[dpr.status]}`}>
                    {dpr.status}{dpr.status === 'approved' && dpr.locked ? ' · locked' : ''}
                  </span>
                  {isLate(dpr) && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                      Late
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-900">{dpr.siteName}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {dpr.date} · {dpr.shift} shift · {dpr.projectName} · Prepared by {dpr.preparedByName}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="text-slate-500">Submitted</p>
                <p className="text-slate-700">{dpr.submittedAt ? new Date(dpr.submittedAt).toLocaleString() : '—'}</p>
                <p className="text-slate-500 mt-1">Approved</p>
                <p className="text-slate-700">{dpr.approvedAt ? new Date(dpr.approvedAt).toLocaleString() : '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500">Work lines:</span>
                <span className="ml-1 font-medium text-slate-900">{dpr.activityLines.length}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500">Labour:</span>
                <span className="ml-1 font-medium text-slate-900">{dpr.labourLines.length}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500">Materials:</span>
                <span className="ml-1 font-medium text-slate-900">{dpr.materialLines.length}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500">Equipment:</span>
                <span className="ml-1 font-medium text-slate-900">{dpr.equipmentLines.length}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500">Photos:</span>
                <span className="ml-1 font-medium text-slate-900">{dpr.photos.length}</span>
              </div>
            </div>
            {dpr.returnReason && (
              <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                <p className="text-xs text-red-900">
                  <span className="font-medium">Return reason:</span> {dpr.returnReason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const captureSteps = [
  { n: 1, label: 'Weather & site conditions', source: 'Manual / wx observation (Part 31)' },
  { n: 2, label: 'Work done (qty per activity/location)', source: 'Prefilled from daily plan (Part 28) + WA (Part 29)' },
  { n: 3, label: 'Labour (own from attendance, subcontract headcount)', source: 'Prefilled from attendance (Part 40)' },
  { n: 4, label: 'Materials consumed', source: 'Prefilled from stores issues (Part 35)' },
  { n: 5, label: 'Equipment', source: 'Prefilled from plant logs (Part 37)' },
  { n: 6, label: 'Quality & HSE observations', source: 'Linked QA (Part 52) / HSE (Part 55)' },
  { n: 7, label: 'Delays / constraints', source: 'Linked delays & constraints (Part 26/28)' },
  { n: 8, label: 'Visitors / instructions received', source: 'Manual, linked site instructions' },
  { n: 9, label: 'Photos (GPS + time stamped)', source: 'Offline photo queue (Part 79)' },
  { n: 10, label: 'Remarks', source: 'Voice-to-DPR draft — AI output labelled, reviewed before submit' }
];

function CaptureTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Mobile DPR Capture — Stepper</h3>
        <p className="text-sm text-slate-500 mb-4">Offline-capable · GPS stamp on submit · draft auto-created from the daily plan with planned lines prefilled</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mobile stepper preview */}
          <div className="max-w-sm mx-auto w-full bg-slate-100 rounded-2xl p-3 border border-slate-200">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-3">
                <p className="text-xs text-slate-400">New DPR · Riverside Tower - Block A</p>
                <p className="text-sm font-semibold">2026-01-16 · Morning shift</p>
              </div>
              <div className="p-3 space-y-2">
                {captureSteps.map(step => (
                  <div key={step.n} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {step.n}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 leading-snug">{step.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{step.source}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 flex gap-2">
                <button className="flex-1 px-3 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 min-h-[44px]">
                  Save draft
                </button>
                <button className="flex-1 px-3 py-2.5 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 min-h-[44px]">
                  Submit (GPS stamp)
                </button>
              </div>
            </div>
          </div>

          {/* Capture capabilities */}
          <div className="space-y-3">
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-sm font-semibold text-sky-900 mb-1">Offline capture with photo queue</p>
              <p className="text-xs text-sky-800">Encrypted local queue → sync → conflict resolution → server confirmation. Nothing counts as posted until confirmed. Server re-validates permissions, protocol checks and balances at sync.</p>
            </div>
            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <p className="text-sm font-semibold text-violet-900 mb-1">Voice-to-DPR (AI-assisted)</p>
              <p className="text-xs text-violet-800">Speech-to-text creates a draft DPR text/lines. Output is labelled <span className="font-mono">AI DRAFT</span> — the engineer reviews and edits before submission. Never auto-submitted.</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm font-semibold text-amber-900 mb-1">Open-RFI warnings</p>
              <p className="text-xs text-amber-800">DPR lines link to RFIs (Part 58); open-RFI warnings shown on affected activities during capture and review.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-1">Validations mirrored client-side</p>
              <p className="text-xs text-slate-600">Mandatory: weather, at least one work line or "no work" reason, labour totals, ≥ 1 photo when work done (configurable). Photos compressed, max 30 per DPR, geotagged if permitted. Optimistic locking (<span className="font-mono">version</span>) and <span className="font-mono">Idempotency-Key</span> on submit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prefill source: today's plan */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Prefill Source — Daily Plan 2026-01-16 (Part 28)</h3>
        <div className="space-y-3">
          {(dailyPlans.find(p => p.date === '2026-01-16')?.lines || []).map(line => (
            <div key={line.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">{line.activityCode} — {line.activityName}</p>
                  <p className="text-xs text-slate-500 mt-1">{line.workFrontName} · {line.crew}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Planned</p>
                  <p className="text-sm font-semibold text-slate-900">{line.plannedQty} {line.uomName}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Labour planned:</span>
                  <span className="ml-1 text-slate-700">{Object.entries(line.labourPlanned).map(([t, c]) => `${t} ${c}`).join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Plant planned:</span>
                  <span className="ml-1 text-slate-700">{line.plantPlanned.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Materials planned:</span>
                  <span className="ml-1 text-slate-700">{line.materialPlanned.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewTab({ selectedDPR, setSelectedDPR }: { selectedDPR: string | null; setSelectedDPR: (id: string | null) => void }) {
  const dpr = dprReports.find(d => d.id === selectedDPR) || dprReports[0];

  return (
    <div className="space-y-6">
      {/* DPR Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select DPR</label>
        <select
          value={selectedDPR || dpr.id}
          onChange={(e) => setSelectedDPR(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {dprReports.map(d => (
            <option key={d.id} value={d.id}>{d.dprNo} — {d.siteName} ({d.date}, {d.shift})</option>
          ))}
        </select>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">{dpr.dprNo}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded capitalize ${statusChip[dpr.status]}`}>
                {dpr.status}{dpr.status === 'approved' && dpr.locked ? ' · locked' : ''}
              </span>
              {isLate(dpr) && (
                <span className="px-3 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">Late</span>
              )}
            </div>
            <p className="text-sm text-slate-600">{dpr.siteName} · {dpr.projectName}</p>
            <p className="text-xs text-slate-500 mt-1">
              {dpr.date} · {dpr.shift} shift · Prepared by {dpr.preparedByName}
              {dpr.gpsLocation ? ` · GPS ${dpr.gpsLocation.lat.toFixed(4)}, ${dpr.gpsLocation.lng.toFixed(4)}` : ''}
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="text-slate-500">Submitted</p>
            <p className="text-slate-700">{dpr.submittedAt ? new Date(dpr.submittedAt).toLocaleString() : '—'}</p>
            <p className="text-slate-500 mt-1">Approved by</p>
            <p className="text-slate-700">{dpr.approvedByName || '—'}</p>
          </div>
        </div>

        {/* Gate-status panel */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-2">Gate-status panel — CP-DPR evaluation (OBSERVE mode)</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {dprControlPoints.map(cp => (
              <div key={cp.id} className="p-2 bg-white rounded border border-slate-200">
                <p className="text-[10px] font-mono font-semibold text-slate-700">{cp.id}</p>
                <p className="text-[10px] text-green-600 font-medium mt-0.5">PASS</p>
              </div>
            ))}
          </div>
        </div>

        {dpr.status === 'approved' && (
          <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-xs text-green-900">
              <span className="font-medium">Approved DPR locked.</span> Changes only via DPR addendum with reason — original preserved. Reviewer must differ from author (CP-DPR-05).
            </p>
          </div>
        )}
        {dpr.returnReason && (
          <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <p className="text-xs text-red-900">
              <span className="font-medium">Returned with comments:</span> {dpr.returnReason}
            </p>
          </div>
        )}
      </div>

      {/* Weather & Site Conditions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Weather & Site Conditions</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Morning</p>
            <p className="font-medium text-slate-900">{dpr.weatherMorning}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Afternoon</p>
            <p className="font-medium text-slate-900">{dpr.weatherAfternoon}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Rainfall</p>
            <p className="font-medium text-slate-900">{dpr.rainfallMm} mm</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Temperature</p>
            <p className="font-medium text-slate-900">{dpr.temperature} °C</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Working hours</p>
            <p className="font-medium text-slate-900">{dpr.workingHours} h</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3">{dpr.siteCondition}</p>
      </div>

      {/* Work Done — plan comparison */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Work Done — comparison with plan (CP-DPR-02: WA reference + tolerance)</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Activity</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Location</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Planned</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Actual</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700 uppercase">Cumulative</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">WA Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dpr.activityLines.map(line => {
                const deviation = line.plannedQty > 0 ? ((line.actualQty - line.plannedQty) / line.plannedQty) * 100 : 0;
                const overTolerance = deviation > 10;
                return (
                  <tr key={line.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{line.activityCode}</p>
                      <p className="text-xs text-slate-500">{line.activityName}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700">
                      {line.location}{line.chainage ? ` · ${line.chainage}` : ''}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700">{line.plannedQty} {line.uomName}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <span className={`font-semibold ${overTolerance ? 'text-red-600' : 'text-slate-900'}`}>
                        {line.actualQty} {line.uomName}
                      </span>
                      {overTolerance && (
                        <p className="text-[10px] text-red-600 font-medium">QTY_OVER_PLAN — exception required</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700">{line.cumulativeQty}</td>
                    <td className="px-4 py-3 text-xs font-mono text-sky-700">{line.waNo || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Labour / Materials / Equipment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Labour (CP-DPR-03: ≤ attendance)</h4>
          <div className="space-y-2">
            {dpr.labourLines.length === 0 && <p className="text-xs text-slate-400">No labour lines recorded</p>}
            {dpr.labourLines.map(l => (
              <div key={l.id} className="p-3 bg-slate-50 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-900">{l.trade}</span>
                  <span className="text-slate-500">{l.actualCount}/{l.plannedCount}</span>
                </div>
                <p className="text-slate-500">
                  {l.source === 'subcontractor' ? `Subcontractor: ${l.subcontractorName}` : 'Own — from attendance'}
                  {l.attendanceRef ? ` · ${l.attendanceRef}` : ''} · {l.hours}h{ l.otHours ? ` +${l.otHours}h OT` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Materials consumed</h4>
          <div className="space-y-2">
            {dpr.materialLines.length === 0 && <p className="text-xs text-slate-400">No material lines recorded</p>}
            {dpr.materialLines.map(m => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-900">{m.materialName}</span>
                  <span className="text-slate-700">{m.qtyConsumed} {m.uomName}</span>
                </div>
                <p className="text-slate-500">
                  {m.issueRef ? `Issue ${m.issueRef}: ${m.issueQty} — balance ${m.balanceQty}` : 'No issue ref — allocation only'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Equipment</h4>
          <div className="space-y-2">
            {dpr.equipmentLines.length === 0 && <p className="text-xs text-slate-400">No equipment lines recorded</p>}
            {dpr.equipmentLines.map(e => (
              <div key={e.id} className="p-3 bg-slate-50 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-900">{e.plantName}</span>
                  <span className="text-slate-500">{e.workingHours}h work</span>
                </div>
                <p className="text-slate-500">
                  Idle {e.idleHours}h · Breakdown {e.breakdownHours}h · {e.operator}
                  {e.logRef ? ` · ${e.logRef}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events & Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Quality, HSE, Delays, Visitors & Instructions</h4>
          <div className="space-y-2">
            {dpr.events.length === 0 && <p className="text-xs text-slate-400">No events recorded</p>}
            {dpr.events.map(ev => (
              <div key={ev.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded uppercase ${
                    ev.type === 'hse' || ev.type === 'incident' ? 'bg-red-100 text-red-700' :
                    ev.type === 'quality' ? 'bg-blue-100 text-blue-700' :
                    ev.type === 'delay' || ev.type === 'constraint' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {ev.type}
                  </span>
                  <span className="text-[10px] text-slate-400">{ev.time} · {ev.reportedByName}</span>
                </div>
                <p className="text-xs text-slate-700">{ev.description}</p>
                {ev.linkedEntityType && (
                  <p className="text-[10px] text-sky-700 mt-1 font-mono">→ {ev.linkedEntityType}: {ev.linkedEntityId}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Photos (GPS + time)</h4>
          <div className="grid grid-cols-3 gap-3">
            {dpr.photos.length === 0 && <p className="text-xs text-slate-400 col-span-3">No photos attached</p>}
            {dpr.photos.map(p => (
              <div key={p.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="h-16 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-lg mb-1">📷</div>
                <p className="text-[10px] text-slate-700 leading-snug">{p.caption}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{p.activityCode} · {new Date(p.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))}
          </div>
          {dpr.remarks && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-semibold text-slate-700 mb-1">Remarks</p>
              <p className="text-xs text-slate-600">{dpr.remarks}</p>
            </div>
          )}
        </div>
      </div>

      {/* Review actions */}
      {dpr.status === 'submitted' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Review actions (Site Manager / PM)</h4>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 min-h-[44px]">
              Approve & lock
            </button>
            <button className="px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 min-h-[44px]">
              Return with comments
            </button>
            <span className="text-xs text-slate-500 self-center">Approve emits progress entries (Part 27), consumption reconciliation (Parts 35/90), delay/constraint records and claims evidence (Part 62) within 1 minute.</span>
          </div>
        </div>
      )}
    </div>
  );
}

function MissingTab() {
  const sites = Array.from(new Set(dprCalendar.map(c => c.site)));

  return (
    <div className="space-y-6">
      {/* Missing DPR dashboard */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Missing DPR Dashboard</h3>
          <p className="text-sm text-slate-500 mt-1">Site / date / shift gaps — notified to site engineer + site manager by cut-off (CP-DPR-01, escalation L1 → L2 → L3 after 3 misses)</p>
        </div>
        <div className="divide-y divide-slate-200">
          {missingDPRs.map(m => (
            <div key={m.id} className="p-6 hover:bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">MISSING</span>
                  <span className="text-xs text-slate-500">{m.shift} shift</span>
                </div>
                <p className="text-sm font-medium text-slate-900">{m.siteName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.date} · assigned to {m.assignedToName}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{m.daysOverdue}</p>
                <p className="text-xs text-slate-500">days overdue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DPR Calendar per site */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">DPR Calendar per Site</h3>
        <div className="space-y-6">
          {sites.map(site => (
            <div key={site}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{site}</p>
              <div className="flex flex-wrap gap-2">
                {dprCalendar.filter(c => c.site === site).map(c => (
                  <div
                    key={`${c.site}-${c.date}`}
                    title={`${c.date} — ${c.status}`}
                    className={`w-16 p-2 rounded-lg text-center border ${
                      c.status === 'approved' ? 'bg-green-50 border-green-200' :
                      c.status === 'submitted' ? 'bg-amber-50 border-amber-200' :
                      c.status === 'returned' ? 'bg-red-50 border-red-200' :
                      'bg-slate-50 border-slate-200 border-dashed'
                    }`}
                  >
                    <p className="text-[10px] text-slate-500">{c.date.slice(5)}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 capitalize ${
                      c.status === 'approved' ? 'text-green-700' :
                      c.status === 'submitted' ? 'text-amber-700' :
                      c.status === 'returned' ? 'text-red-700' :
                      'text-slate-400'
                    }`}>
                      {c.status === 'approved' ? 'OK' : c.status === 'submitted' ? 'SUB' : c.status === 'returned' ? 'RET' : 'MISS'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-400"></span>Approved</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400"></span>Submitted</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-400"></span>Returned</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded border border-slate-300 bg-slate-100"></span>Missing</span>
        </div>
      </div>
    </div>
  );
}

function ProtocolTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Protocol Control Points — CP-DPR</h3>
      <p className="text-sm text-slate-500 mb-4">Registered with the Protocol & Control Engine (Part 7) · rollout OFF → OBSERVE → WARN → ENFORCE · deviations only through approved exceptions (PC-3)</p>
      <div className="space-y-3">
        {dprControlPoints.map(cp => (
          <div key={cp.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-2xl">🛡️</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded">{cp.stage}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded uppercase">{cp.status}</span>
              </div>
              <p className="text-sm text-slate-600">{cp.control}</p>
              <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <p className="text-xs text-sky-800">
          Every control point is evaluated server-side on all paths (UI, API, import, job, offline sync, AI draft) via <span className="font-mono">protocol.check()</span>, visible through the Gate-status panel, and produces evaluation, exception, violation and action-ledger records (Part 10).
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    sky: 'bg-sky-50 border-sky-200',
    amber: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
