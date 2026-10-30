import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStage } from '../../types';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight, 
  FileCheck, 
  ShieldAlert, 
  CalendarClock, 
  FileText, 
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const ApplicationDetailModal: React.FC = () => {
  const { 
    applications, 
    selectedAppId, 
    setSelectedAppId, 
    advanceStage, 
    revertWithDeficiencies,
    activeRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'WORKFLOW' | 'DOCS' | 'UNDERTAKINGS' | 'EVC' | 'AUDIT'>('OVERVIEW');

  // Advance stage form state
  const [nextStage, setNextStage] = useState<ApplicationStage>('EVC Scheduled');
  const [advanceRemarks, setAdvanceRemarks] = useState('All mandatory preliminary scrutiny criteria found compliant as per APH 2026.');

  // Revert form state
  const [showRevertForm, setShowRevertForm] = useState(false);
  const [revertDeficiencies, setRevertDeficiencies] = useState('1. Registered lease deed remaining tenure is less than statutory 30 years.\n2. Fire Safety NOC is pending verification with municipal fire officer.');
  const [revertRemarks, setRevertRemarks] = useState('Documents are deficient. Reverting application to institution for clarification and upload.');
  const [cureDays, setCureDays] = useState(7);

  const app = applications.find(a => a.id === selectedAppId);

  if (!app) return null;

  const isOverdue = app.urgency === 'OVERDUE';
  const isApproaching = app.urgency === 'APPROACHING';

  const stagesList: ApplicationStage[] = [
    'Preliminary Scrutiny',
    'Re-Scrutiny (Clarifications)',
    'EVC Scheduled',
    'EVC Inspection Completed',
    'SAC / SHC Review',
    'Executive Approval',
    'Approved (LoA Issued)'
  ];

  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    advanceStage(app.id, nextStage, advanceRemarks);
  };

  const handleRevertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const defList = revertDeficiencies.split('\n').filter(d => d.trim().length > 0);
    revertWithDeficiencies(app.id, defList, revertRemarks, cureDays);
    setShowRevertForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>{app.applicationNumber}</span>
              <span>·</span>
              <span>Perm ID: {app.permanentId}</span>
              <span>·</span>
              <span className="text-slate-300">{app.region}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{app.institutionName}</h2>
            <div className="text-xs text-slate-300 mt-0.5">
              {app.city}, {app.state} · {app.category} · AY {app.academicYear}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAppId(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs">
          {[
            { id: 'OVERVIEW', label: 'Institutional Profile' },
            { id: 'WORKFLOW', label: 'Stage Actions & Movement' },
            { id: 'DOCS', label: `Documents (${app.documents.length})` },
            { id: 'UNDERTAKINGS', label: `Undertakings (${app.undertakings.length})` },
            { id: 'EVC', label: 'EVC Inspection Findings' },
            { id: 'AUDIT', label: `Audit Log (${app.auditTrail.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 font-medium border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-500 text-slate-900 font-bold bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Current Stage Status Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Current Processing Stage</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{app.currentStage}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Assigned Desk: <strong>{app.assignedDesk}</strong> · Officer: {app.responsibleOfficer}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Stage SLA Ageing</div>
                  <div className={`text-sm font-bold ${
                    isOverdue ? 'text-rose-600' : isApproaching ? 'text-amber-600' : 'text-slate-900'
                  }`}>
                    {app.daysInCurrentStage} / {app.prescribedSlaDays} Days
                  </div>
                  <div className="text-[11px] text-slate-400">Target Due: {app.stageDueDate}</div>
                </div>
              </div>

              {/* Institutional Specifications Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Land Area</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{app.landAreaAcres} Acres</div>
                  <div className="text-[10px] text-slate-500">Norm: ≥ 5.0 Acres</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Built-Up Area</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{app.builtUpAreaSqM.toLocaleString()} m²</div>
                  <div className="text-[10px] text-slate-500">Instructional & Admin</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Proposed Intake</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{app.proposedIntake} Students</div>
                  <div className="text-[10px] text-slate-500">Undergraduate / PG</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Regular Faculty</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{app.facultyCount} Members</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Cadre 1:20 Ratio</div>
                </div>
              </div>

              {/* Scrutiny Deficiencies History if any */}
              {app.scrutinyDeficiencies.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                  <div className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Recorded Statutory Deficiencies ({app.scrutinyDeficiencies.length})</span>
                  </div>
                  <ul className="list-disc list-inside text-rose-800 space-y-1 mt-2">
                    {app.scrutinyDeficiencies.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WORKFLOW & ADVANCEMENT */}
          {activeTab === 'WORKFLOW' && (
            <div className="space-y-6">
              {/* Authorized Action Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Advance Stage Form */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span>Advance to Next Approval Stage</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Authorized officers can transition application upon statutory verification.
                  </p>

                  <form onSubmit={handleAdvanceSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target Stage</label>
                      <select
                        value={nextStage}
                        onChange={(e) => setNextStage(e.target.value as ApplicationStage)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        {stagesList.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Remarks</label>
                      <textarea
                        rows={3}
                        value={advanceRemarks}
                        onChange={(e) => setAdvanceRemarks(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs transition"
                    >
                      Authorize Stage Movement
                    </button>
                  </form>
                </div>

                {/* Revert / Deficiencies Form */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900 mb-2">
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>Revert / Return for Deficiencies</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">
                    Flag non-compliance items and grant a time-bound clarification window to applicant institute.
                  </p>

                  <form onSubmit={handleRevertSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Itemized Deficiencies</label>
                      <textarea
                        rows={3}
                        value={revertDeficiencies}
                        onChange={(e) => setRevertDeficiencies(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Cure Days Granted</label>
                        <select
                          value={cureDays}
                          onChange={(e) => setCureDays(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800"
                        >
                          <option value={7}>7 Days (Standard)</option>
                          <option value={14}>14 Days (Extended)</option>
                          <option value={21}>21 Days (Special Bench)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official Directive</label>
                      <input
                        type="text"
                        value={revertRemarks}
                        onChange={(e) => setRevertRemarks(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition"
                    >
                      Revert Application with SLA Countdown
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'DOCS' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 mb-2">
                Mandatory prescribed statutory deeds under APH Section 1.6:
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {app.documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">{doc.category}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{doc.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Issue: {doc.issueDate} · Expiry: {doc.expiryDate}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold ${
                        doc.status === 'VALID' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {doc.status}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {doc.daysRemaining > 0 ? `${doc.daysRemaining} days left` : 'Expired'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: UNDERTAKINGS */}
          {activeTab === 'UNDERTAKINGS' && (
            <div className="space-y-3">
              {app.undertakings.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No conditional undertakings recorded for this application.
                </div>
              ) : (
                app.undertakings.map((u) => (
                  <div key={u.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{u.title}</span>
                      <span className="font-mono text-amber-700 font-semibold">{u.status}</span>
                    </div>
                    <p className="text-xs text-slate-600">{u.conditionDescription}</p>
                    <div className="text-[11px] text-slate-500">
                      Stipulated Deadline: {u.dueDate} ({u.daysRemaining} days remaining)
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: EVC FINDINGS */}
          {activeTab === 'EVC' && (
            <div className="space-y-4">
              {!app.evcRecord ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No EVC inspection record generated yet.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-900">EVC Inspection Details</span>
                      <span className="font-semibold text-emerald-700">Score: {app.evcRecord.overallScore || 85}/100</span>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">{app.evcRecord.reportSummary}</div>
                  </div>

                  <div className="text-xs font-bold text-slate-800">Assigned Inspection Panel:</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {app.evcRecord.experts.map((exp, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-slate-200 text-xs bg-white">
                        <div className="font-bold text-slate-900">{exp.name}</div>
                        <div className="text-[11px] text-slate-500">{exp.designation}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{exp.organization}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-3">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {app.auditTrail.map((log) => (
                  <div key={log.id} className="p-3 text-xs flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-slate-900">{log.action}</div>
                      <div className="text-slate-600 mt-0.5 leading-relaxed">{log.remarks}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        By {log.actorName} ({log.actorRole}) · Hash: {log.verificationHash}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 shrink-0 font-mono">
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
