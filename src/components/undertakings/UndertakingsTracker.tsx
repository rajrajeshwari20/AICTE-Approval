import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UndertakingItem } from '../../types';
import { 
  FileCheck2, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  UploadCloud, 
  ShieldAlert, 
  FileText, 
  Filter,
  Check,
  X,
  Building2,
  Calendar
} from 'lucide-react';

export const UndertakingsTracker: React.FC = () => {
  const { 
    applications, 
    submitUndertakingEvidence, 
    verifyUndertaking, 
    activeRole,
    setSelectedAppId 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedUndertaking, setSelectedUndertaking] = useState<UndertakingItem | null>(null);

  // Evidence upload form state
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const [notaryNumber, setNotaryNumber] = useState('');

  // Collect all undertakings across applications
  const allUndertakings: UndertakingItem[] = applications.flatMap(app => 
    app.undertakings.map(u => ({
      ...u,
      institutionName: app.institutionName,
      region: app.region
    }))
  );

  const filteredUndertakings = allUndertakings.filter(u => {
    if (filterStatus === 'ALL') return true;
    return u.status === filterStatus;
  });

  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUndertaking) return;

    submitUndertakingEvidence(
      selectedUndertaking.id,
      fileName || 'Compliance_Affidavit_Evidence.pdf',
      evidenceDesc,
      notaryNumber || `NOT/AICTE/${Date.now().toString().slice(-6)}`
    );

    setSelectedUndertaking(null);
    setEvidenceDesc('');
    setFileName('');
    setNotaryNumber('');
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Conditional Approvals Monitoring</span>
            <span>·</span>
            <span>APH Sec 4.12 Statutory Undertakings</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Time-Bound Undertakings & Institutional Compliance Tracker
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Digital ledger for conditional approvals granted subject to time-bound affidavits, faculty cadre recruitments, and infrastructure deliverables.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          {['ALL', 'PENDING_SUBMISSION', 'SUBMITTED_FOR_VERIFICATION', 'COMPLIED', 'OVERDUE_ESCALATED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' && 'All'}
              {st === 'PENDING_SUBMISSION' && 'Pending Upload'}
              {st === 'SUBMITTED_FOR_VERIFICATION' && 'In Review'}
              {st === 'COMPLIED' && 'Complied'}
              {st === 'OVERDUE_ESCALATED' && 'Overdue'}
            </button>
          ))}
        </div>
      </div>

      {/* Undertakings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUndertakings.length === 0 ? (
          <div className="col-span-2 bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-xs">
            No undertakings found under selected filter.
          </div>
        ) : (
          filteredUndertakings.map((und) => {
            const isOverdue = und.status === 'OVERDUE_ESCALATED' || und.daysRemaining < 0;
            const isComplied = und.status === 'COMPLIED';
            const isSubmitted = und.status === 'SUBMITTED_FOR_VERIFICATION';

            return (
              <div 
                key={und.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Assigned: {und.assignedDate} · Due: {und.dueDate}
                    </span>
                    <span className={`text-[11px] font-bold ${
                      isComplied 
                        ? 'text-emerald-700' 
                        : isOverdue 
                        ? 'text-rose-700 font-mono font-bold' 
                        : 'text-amber-700'
                    }`}>
                      {isComplied 
                        ? 'COMPLIED' 
                        : isOverdue 
                        ? `OVERDUE BY ${Math.abs(und.daysRemaining)} DAYS` 
                        : `${und.daysRemaining} DAYS REMAINING`}
                    </span>
                  </div>

                  {/* Title & Institute */}
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {und.title}
                  </h3>
                  <div className="text-xs text-slate-600 mb-3 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{und.institutionName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{und.region}</span>
                  </div>

                  {/* Condition Details */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-3 leading-relaxed">
                    {und.conditionDescription}
                  </div>

                  {/* Punitive Risk Notice */}
                  <div className="text-[11px] text-rose-800 bg-rose-50 border border-rose-200/80 p-2 rounded-lg mb-3 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Statutory Sanction:</strong> {und.punitiveRisk}</span>
                  </div>

                  {/* Submission Evidence if available */}
                  {und.submissionEvidence && (
                    <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 mb-3 space-y-1">
                      <div className="font-semibold flex items-center justify-between">
                        <span>Submitted Evidence File:</span>
                        <span className="text-[10px] text-blue-600 font-mono">{und.submissionEvidence.uploadedAt}</span>
                      </div>
                      <div className="font-mono text-[11px] text-blue-700">{und.submissionEvidence.fileName}</div>
                      <div className="text-slate-600 text-[11px]">{und.submissionEvidence.description}</div>
                      <div className="text-[10px] text-slate-500">Notary Reg: {und.submissionEvidence.affidavitNotaryNo}</div>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedAppId(und.applicationId)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                  >
                    View Parent Case
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Institution role or any testing user can submit evidence */}
                    {und.status !== 'COMPLIED' && (
                      <button
                        onClick={() => setSelectedUndertaking(und)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5 transition"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload Evidence</span>
                      </button>
                    )}

                    {/* Officer verification controls */}
                    {isSubmitted && (
                      <>
                        <button
                          onClick={() => verifyUndertaking(und.id, true, 'All statutory conditions fulfilled as per affidavit.')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Verify and clear undertaking"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => verifyUndertaking(und.id, false, 'Submitted evidence incomplete or invalid.')}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Issue show cause notice"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Deficient</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Upload Undertaking Evidence */}
      {selectedUndertaking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Submit Institutional Compliance Evidence
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Undertaking: <strong>{selectedUndertaking.title}</strong>
            </p>

            <form onSubmit={handleEvidenceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document File Name</label>
                <input
                  type="text"
                  placeholder="e.g. SIAT_Faculty_Recruitment_Affidavit_2026.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notary / Stamp Paper Number</label>
                <input
                  type="text"
                  placeholder="e.g. MH/NOTARY/2026/89312"
                  value={notaryNumber}
                  onChange={(e) => setNotaryNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Compliance Summary & Affidavit Details</label>
                <textarea
                  rows={3}
                  placeholder="Explain how the conditions stipulated by AICTE have been fully complied with..."
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-50 text-amber-900 text-[11px] leading-relaxed border border-amber-200">
                <strong>Statutory Declaration:</strong> Submitting fraudulent documents attracts criminal prosecution under Section 193 of the Indian Penal Code and immediate withdrawal of approval.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUndertaking(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Submit for Desk Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
