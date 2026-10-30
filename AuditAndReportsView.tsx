import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Search, 
  Printer, 
  CheckCircle2, 
  Building2, 
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';

export const AuditAndReportsView: React.FC = () => {
  const { applications, setSelectedAppId } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppForNoteSheet, setSelectedAppForNoteSheet] = useState(applications[0]?.id || '');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Flatten all audit entries across applications
  const allAudits: { audit: AuditLog; institutionName: string; appNumber: string; appId: string }[] = applications.flatMap(app => 
    app.auditTrail.map(audit => ({
      audit,
      institutionName: app.institutionName,
      appNumber: app.applicationNumber,
      appId: app.id
    }))
  ).sort((a, b) => new Date(b.audit.timestamp).getTime() - new Date(a.audit.timestamp).getTime());

  const filteredAudits = allAudits.filter(({ audit, institutionName, appNumber }) => {
    const matchesRole = roleFilter === 'ALL' || audit.actorRole === roleFilter;
    const matchesQuery = 
      institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.verificationHash.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesQuery;
  });

  const targetAppForNoteSheet = applications.find(a => a.id === selectedAppForNoteSheet) || applications[0];

  const handleExportCsv = () => {
    const headers = ['Application Number', 'Institution Name', 'Region', 'State', 'Category', 'Current Stage', 'Days in Stage', 'SLA Days', 'Urgency Status'];
    const rows = applications.map(app => [
      `"${app.applicationNumber}"`,
      `"${app.institutionName}"`,
      `"${app.region}"`,
      `"${app.state}"`,
      `"${app.category}"`,
      `"${app.currentStage}"`,
      app.daysInCurrentStage,
      app.prescribedSlaDays,
      app.urgency
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_AikyaTrace_Pendency_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Statutory Accountability & Verification</span>
            <span>·</span>
            <span>Cryptographic Digital Audit Ledger</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Digital Audit Trail & Official Note Sheet Exporter
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Tamper-evident record of all stage advancements, reversions, expert inspections, and statutory note sheet generations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Pendency CSV</span>
          </button>
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Official Note Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Institution, Hash, Action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="BUREAU_OFFICER">Approval Bureau (HQ)</option>
            <option value="REGIONAL_OFFICER">Regional Officer (RO)</option>
            <option value="COMMITTEE_MEMBER">Committee Expert</option>
            <option value="INSTITUTION_HEAD">Institution Head</option>
          </select>
          <span className="text-xs text-slate-500 font-mono">
            {filteredAudits.length} Events Logged
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp & Verification Hash</th>
                <th className="py-3 px-3">Actor & Role</th>
                <th className="py-3 px-3">Action Performed</th>
                <th className="py-3 px-3">Institution & Case No</th>
                <th className="py-3 px-4">Official Remarks & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No matching audit entries found.
                  </td>
                </tr>
              ) : (
                filteredAudits.map(({ audit, institutionName, appNumber, appId }) => (
                  <tr key={audit.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-slate-900 font-semibold">{audit.timestamp}</div>
                      <div className="font-mono text-[10px] text-amber-700 flex items-center gap-1 mt-0.5">
                        <Lock className="w-2.5 h-2.5 text-slate-400" />
                        <span className="truncate max-w-[130px]">{audit.verificationHash}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{audit.actorName}</div>
                      <div className="text-[10px] uppercase font-mono text-slate-500">{audit.actorRole}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      <div>{audit.action}</div>
                      {audit.stageFrom && audit.stageTo && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {audit.stageFrom} → <strong className="text-slate-700">{audit.stageTo}</strong>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedAppId(appId)}
                        className="text-left font-bold text-slate-900 hover:text-amber-800 hover:underline cursor-pointer block truncate max-w-[180px]"
                      >
                        {institutionName}
                      </button>
                      <div className="font-mono text-[10px] text-slate-500">{appNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed max-w-sm">
                      {audit.remarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Note Sheet Modal Preview */}
      {showPrintModal && targetAppForNoteSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header with Print button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  AICTE Approval Note Sheet (Electronic Case Record)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Note Sheet</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Note Sheet Document Format (Official AICTE Layout) */}
            <div className="border border-slate-300 p-6 rounded-lg bg-white space-y-4 text-xs font-sans text-slate-900">
              {/* Emblem Mock */}
              <div className="text-center border-b border-slate-300 pb-4">
                <div className="text-xs uppercase font-bold tracking-widest text-slate-600">
                  Government of India · Ministry of Education
                </div>
                <div className="text-base font-extrabold text-slate-950 mt-1 uppercase tracking-tight">
                  All India Council for Technical Education
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 · Approval Bureau
                </div>
                <div className="text-xs font-bold text-amber-800 mt-2">
                  CASE SCRUTINY NOTE SHEET & STATUTORY COMPLIANCE RECORD
                </div>
              </div>

              {/* Institute Particulars Table */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Application File No:</span>
                  <div className="font-mono font-bold">{targetAppForNoteSheet.applicationNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Permanent Institute ID:</span>
                  <div className="font-mono font-bold">{targetAppForNoteSheet.permanentId}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Institution Name:</span>
                  <div className="font-bold text-slate-950">{targetAppForNoteSheet.institutionName}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Regional Jurisdiction:</span>
                  <div className="font-bold">{targetAppForNoteSheet.region}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Application Sub-Type:</span>
                  <div>{targetAppForNoteSheet.type}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Current Processing Stage:</span>
                  <div className="font-bold text-amber-700">{targetAppForNoteSheet.currentStage}</div>
                </div>
              </div>

              {/* Infrastructure & Faculty Matrix */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  1. Statutory Parameters (APH 2026-27 Norms)
                </h4>
                <table className="w-full text-left border border-slate-200 text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2 border border-slate-200">Parameter</th>
                      <th className="p-2 border border-slate-200">Prescribed Norm</th>
                      <th className="p-2 border border-slate-200">Reported by Institute</th>
                      <th className="p-2 border border-slate-200">Scrutiny Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-200">Land Area</td>
                      <td className="p-2 border border-slate-200">5.0 Acres (Urban)</td>
                      <td className="p-2 border border-slate-200">{targetAppForNoteSheet.landAreaAcres} Acres</td>
                      <td className="p-2 border border-slate-200 font-semibold text-emerald-700">Verified from Title Deed</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200">Built-Up Area</td>
                      <td className="p-2 border border-slate-200">Min 12,000 sq.m</td>
                      <td className="p-2 border border-slate-200">{targetAppForNoteSheet.builtUpAreaSqM} sq.m</td>
                      <td className="p-2 border border-slate-200 font-semibold text-emerald-700">Structural Plan Approved</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200">Approved Student Intake</td>
                      <td className="p-2 border border-slate-200">As requested</td>
                      <td className="p-2 border border-slate-200">{targetAppForNoteSheet.proposedIntake} Seats</td>
                      <td className="p-2 border border-slate-200 font-semibold text-emerald-700">Compliant</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200">Faculty Cadre Ratio</td>
                      <td className="p-2 border border-slate-200">1:20 (Prof:Assoc:Asst = 1:2:6)</td>
                      <td className="p-2 border border-slate-200">{targetAppForNoteSheet.facultyCount} Regular Faculty</td>
                      <td className="p-2 border border-slate-200 font-semibold text-emerald-700">Biometric & Bank verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* EVC Inspection Summary if present */}
              {targetAppForNoteSheet.evcRecord && (
                <div>
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    2. Expert Visit Committee (EVC) Findings
                  </h4>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                    <div><strong>Inspection Date:</strong> {targetAppForNoteSheet.evcRecord.scheduledDate} ({targetAppForNoteSheet.evcRecord.type})</div>
                    <div><strong>Score Awarded:</strong> {targetAppForNoteSheet.evcRecord.overallScore || 90}/100</div>
                    <div><strong>Committee Observation:</strong> {targetAppForNoteSheet.evcRecord.reportSummary}</div>
                  </div>
                </div>
              )}

              {/* Digital Signatures and Seal */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="font-mono text-[10px] text-slate-500 mb-1">
                    Digitally Verified via AikyaTrace PKI
                  </div>
                  <div className="font-bold text-slate-950">
                    {targetAppForNoteSheet.responsibleOfficer}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Regional Officer, AICTE
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-500 mb-1">
                    Counter-Signed for Apex Approval
                  </div>
                  <div className="font-bold text-slate-950">
                    Prof. (Dr.) Rajive Kumar
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Member Secretary, AICTE New Delhi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
