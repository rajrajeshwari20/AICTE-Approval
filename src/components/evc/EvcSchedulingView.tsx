import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, EVCExpert } from '../../types';
import { 
  CalendarClock, 
  Users, 
  MapPin, 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Clock, 
  Plus, 
  Send,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const EvcSchedulingView: React.FC = () => {
  const { applications, scheduleEvc, submitEvcReport, setSelectedAppId, activeRole } = useApp();

  const [activeTab, setActiveTab] = useState<'SCHEDULED' | 'PENDING_QUEUE' | 'COMPLETED'>('SCHEDULED');
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState<Application | null>(null);
  const [selectedAppForReport, setSelectedAppForReport] = useState<Application | null>(null);

  // Form states for scheduling
  const [evcDate, setEvcDate] = useState('2026-11-05');
  const [evcType, setEvcType] = useState<'PHYSICAL_ON_SITE' | 'VIRTUAL_HYBRID'>('PHYSICAL_ON_SITE');

  // Checklist for report submission
  const [checklist, setChecklist] = useState<{
    item: string;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
    aphNorm: string;
    observedValue: string;
  }[]>([
    { item: 'Land Ownership & 30-Yr Lease Validity', status: 'COMPLIANT', aphNorm: '5.0 Acres (Urban) / 10 Acres (Rural)', observedValue: 'Verified with revenue authorities' },
    { item: 'Instructional & Administrative Area', status: 'COMPLIANT', aphNorm: '12,000 sq.m minimum', observedValue: '14,850 sq.m verified physically' },
    { item: 'Barrier-Free Built Environment & Lifts', status: 'COMPLIANT', aphNorm: 'Ramps, accessible toilets & braille lifts', observedValue: '100% accessible' },
    { item: 'Cadre Ratio Faculty (1:2:6)', status: 'COMPLIANT', aphNorm: 'Full-time approved faculty', observedValue: '24 regular faculty verified' },
    { item: 'Laboratories, Equipment & Wi-Fi', status: 'COMPLIANT', aphNorm: 'AICTE syllabus compliant lab kit', observedValue: 'State-of-the-art computers & IoT labs' }
  ]);
  const [reportScore, setReportScore] = useState(88);
  const [reportSummary, setReportSummary] = useState('The committee physically verified all infrastructure, classrooms, labs, and safety norms. Recommended for formal approval.');

  // Expert Roster options
  const expertRoster: EVCExpert[] = [
    {
      id: 'exp-101',
      name: 'Prof. S. R. Deshmukh',
      designation: 'Senior Professor of Mechanical Engg',
      organization: 'IIT Delhi',
      specialization: 'Robotics & Automation',
      contactEmail: 'deshmukh.sr@mech.iitd.ac.in',
      status: 'CONFIRMED'
    },
    {
      id: 'exp-102',
      name: 'Ar. Rajeshwari Sundaram',
      designation: 'Council of Architecture Nominee',
      organization: 'School of Planning & Architecture (SPA)',
      specialization: 'Institutional Master Plans & ADA Compliance',
      contactEmail: 'r.sundaram@spa.ac.in',
      status: 'CONFIRMED'
    },
    {
      id: 'exp-103',
      name: 'Dr. Vivek Saxena',
      designation: 'Vice President - Emerging Tech',
      organization: 'Larsen & Toubro Ltd',
      specialization: 'Industry 4.0 & Advanced Labs',
      contactEmail: 'vivek.saxena@larsentoubro.com',
      status: 'CONFIRMED'
    }
  ];

  // Applications requiring EVC
  const pendingEvcQueue = applications.filter(a => a.requiresEvc && a.currentStage === 'Preliminary Scrutiny');
  const scheduledEvcList = applications.filter(a => a.currentStage === 'EVC Scheduled' && a.evcRecord);
  const completedEvcList = applications.filter(a => a.evcRecord && (a.evcRecord.status === 'REPORT_SUBMITTED' || a.evcRecord.status === 'DEFICIENCIES_RECORDED' || a.currentStage === 'EVC Inspection Completed'));

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForSchedule) return;

    scheduleEvc(selectedAppForSchedule.id, evcDate, evcType, expertRoster);
    setSelectedAppForSchedule(null);
    setActiveTab('SCHEDULED');
  };

  const handleConfirmReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForReport) return;

    submitEvcReport(selectedAppForReport.id, reportScore, reportSummary, checklist);
    setSelectedAppForReport(null);
    setActiveTab('COMPLETED');
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Expert Visit Committee (EVC) Administration</span>
            <span>·</span>
            <span>APH Sec 2.10 Physical & Virtual Protocols</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            EVC Scheduling & Expert Inspection Oversight
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Peer inspection assignment, 3-member expert panel constitution, geo-tagged virtual audit recording, and statutory checklist verification.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('SCHEDULED')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'SCHEDULED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Schedules ({scheduledEvcList.length})
          </button>
          <button
            onClick={() => setActiveTab('PENDING_QUEUE')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'PENDING_QUEUE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Awaiting Scheduling ({pendingEvcQueue.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'COMPLETED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed Reports ({completedEvcList.length})
          </button>
        </div>
      </div>

      {/* View 1: Active Schedules */}
      {activeTab === 'SCHEDULED' && (
        <div className="space-y-4">
          {scheduledEvcList.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-xs">
              No active EVC inspections currently scheduled.
            </div>
          ) : (
            scheduledEvcList.map((app) => {
              const evc = app.evcRecord!;
              return (
                <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mb-1">
                        <span>{app.applicationNumber}</span>
                        <span>·</span>
                        <span className="text-amber-700 font-semibold">{app.region}</span>
                        <span>·</span>
                        <span className="text-slate-700">{app.type}</span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900">{app.institutionName}</h2>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {app.city}, {app.state} · Proposed Intake: {app.proposedIntake} Students
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5 font-medium">
                        <CalendarClock className="w-4 h-4 text-amber-600" />
                        <span>Visit Date: {evc.scheduledDate}</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center gap-1 font-medium">
                        {evc.type === 'PHYSICAL_ON_SITE' ? <MapPin className="w-3.5 h-3.5 text-slate-500" /> : <Video className="w-3.5 h-3.5 text-blue-500" />}
                        <span>{evc.type === 'PHYSICAL_ON_SITE' ? 'Physical On-Site' : 'Virtual Geo-tagged'}</span>
                      </div>

                      {/* Committee report filing button */}
                      <button
                        onClick={() => setSelectedAppForReport(app)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Submit Inspection Report</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Experts Roster */}
                  <div className="mt-4">
                    <div className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>Constituted 3-Member Peer Committee (APH 2026 Mandate)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {evc.experts.map((exp, idx) => (
                        <div key={exp.id || idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Expert {idx + 1} · {idx === 0 ? 'Academic' : idx === 1 ? 'Architect' : 'Industry'}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </span>
                          </div>
                          <div className="font-bold text-slate-900">{exp.name}</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{exp.designation}</div>
                          <div className="text-slate-500 text-[10px] mt-1 truncate">{exp.organization}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Inspection Safeguards */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Mandatory Video Evidence: Cloud Storage Sync Enabled</span>
                    <button
                      onClick={() => setSelectedAppId(app.id)}
                      className="text-amber-700 hover:underline font-medium cursor-pointer"
                    >
                      View Complete Docket →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View 2: Pending Queue (Needs Scheduling) */}
      {activeTab === 'PENDING_QUEUE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Applications Cleared Preliminary Scrutiny & Queued for EVC
              </h2>
              <p className="text-xs text-slate-500">Assign experts and schedule within the 21-day statutory SLA</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">{pendingEvcQueue.length} Pending</span>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingEvcQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                All eligible applications currently have EVC scheduled.
              </div>
            ) : (
              pendingEvcQueue.map((app) => (
                <div key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                  <div>
                    <div className="text-[11px] font-mono text-slate-500">{app.applicationNumber}</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">{app.institutionName}</div>
                    <div className="text-[11px] text-slate-600">
                      {app.city}, {app.state} · {app.region} · {app.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppForSchedule(app)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer transition flex items-center gap-1 shadow-xs"
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>Schedule EVC Panel</span>
                    </button>
                    <button
                      onClick={() => setSelectedAppId(app.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* View 3: Completed Reports */}
      {activeTab === 'COMPLETED' && (
        <div className="space-y-3">
          {completedEvcList.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500 text-xs">
              No completed EVC reports on record yet.
            </div>
          ) : (
            completedEvcList.map((app) => {
              const evc = app.evcRecord!;
              const hasDeficiencies = evc.status === 'DEFICIENCIES_RECORDED';

              return (
                <div key={app.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                      <span>{app.applicationNumber}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">{app.institutionName}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-800">
                      Inspection Outcome: <strong>{evc.overallScore || 85}/100</strong>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 max-w-xl">
                      {evc.reportSummary}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      hasDeficiencies ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {hasDeficiencies ? 'Deficiencies Flagged (Referred to SAC)' : 'Clear Recommendation'}
                    </div>
                    <button
                      onClick={() => setSelectedAppId(app.id)}
                      className="text-xs text-amber-700 hover:underline font-semibold cursor-pointer"
                    >
                      View Report Sheet →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal: Schedule EVC */}
      {selectedAppForSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Schedule Expert Visit Committee (EVC)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Institution: <strong>{selectedAppForSchedule.institutionName}</strong>
            </p>

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Mode</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setEvcType('PHYSICAL_ON_SITE')}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer ${
                      evcType === 'PHYSICAL_ON_SITE' ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Physical On-Site Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvcType('VIRTUAL_HYBRID')}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer ${
                      evcType === 'VIRTUAL_HYBRID' ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    AI Geo-tagged Virtual EVC
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Inspection Date</label>
                <input
                  type="date"
                  value={evcDate}
                  onChange={(e) => setEvcDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-800">Auto-Assigned Expert Panel Roster:</div>
                <div className="text-slate-600">1. Prof. S. R. Deshmukh (IIT Delhi - Academic)</div>
                <div className="text-slate-600">2. Ar. Rajeshwari Sundaram (SPA - Architecture)</div>
                <div className="text-slate-600">3. Dr. Vivek Saxena (L&T - Industry Expert)</div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppForSchedule(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Confirm & Dispatch Orders
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit EVC Report */}
      {selectedAppForReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Official EVC Inspection Report Submission
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Institution: <strong>{selectedAppForReport.institutionName}</strong>
            </p>

            <form onSubmit={handleConfirmReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Overall Assessment Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={reportScore}
                    onChange={(e) => setReportScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recommendation</label>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800">
                    {reportScore >= 75 ? 'Recommended for Approval' : 'Referred to SAC for Deficiency Hearing'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Statutory Checklist Verification</label>
                <div className="space-y-2 max-h-52 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                  {checklist.map((item, index) => (
                    <div key={index} className="p-2 rounded bg-white border border-slate-200 text-xs flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{item.item}</div>
                        <div className="text-[10px] text-slate-500">{item.aphNorm}</div>
                      </div>
                      <select
                        value={item.status}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setChecklist(prev => prev.map((c, i) => i === index ? { ...c, status: val } : c));
                        }}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium"
                      >
                        <option value="COMPLIANT">Compliant</option>
                        <option value="PARTIAL">Partial</option>
                        <option value="NON_COMPLIANT">Non-Compliant</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Summary & Observations</label>
                <textarea
                  rows={3}
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppForReport(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Sign & Submit Formal Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
