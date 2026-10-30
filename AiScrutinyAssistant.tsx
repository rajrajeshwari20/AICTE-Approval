import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Copy, 
  Send,
  Building,
  Calculator,
  RefreshCw
} from 'lucide-react';

export const AiScrutinyAssistant: React.FC = () => {
  const { applications, revertWithDeficiencies, setSelectedAppId } = useApp();

  const [selectedAppId, setLocalSelectedAppId] = useState(applications[0]?.id || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Calculated checks based on AICTE APH 2026-27 norms:
  // 1. Built-up area required: proposedIntake * 35 sq.m
  const reqBuiltUp = selectedApp ? selectedApp.proposedIntake * 35 : 12000;
  const actualBuiltUp = selectedApp ? selectedApp.builtUpAreaSqM : 14000;
  const builtUpCompliant = actualBuiltUp >= reqBuiltUp;

  // 2. Land norm: 5.0 acres
  const reqLand = 5.0;
  const actualLand = selectedApp ? selectedApp.landAreaAcres : 5.4;
  const landCompliant = actualLand >= reqLand;

  // 3. Faculty-Student Ratio (FSR): 1:20
  const reqFaculty = selectedApp ? Math.ceil(selectedApp.proposedIntake / 20) : 18;
  const actualFaculty = selectedApp ? selectedApp.facultyCount : 24;
  const facultyCompliant = actualFaculty >= reqFaculty;

  // 4. Lease tenure check
  const leaseDoc = selectedApp?.documents.find(d => d.category === 'Land Lease Deed');
  const leaseRemainingYears = leaseDoc ? Math.floor(leaseDoc.daysRemaining / 365) : 0;
  const leaseCompliant = leaseDoc ? leaseRemainingYears >= 30 : false;

  // 5. Fire NOC
  const fireDoc = selectedApp?.documents.find(d => d.category === 'Fire Safety Certificate');
  const fireCompliant = fireDoc ? fireDoc.status === 'VALID' || fireDoc.status === 'EXPIRING_SOON' : false;

  // Deficiencies list generated
  const generatedDeficiencies: string[] = [];
  if (!builtUpCompliant) {
    generatedDeficiencies.push(`Built-up area deficit: Available ${actualBuiltUp} sq.m vs APH required ${reqBuiltUp} sq.m for ${selectedApp?.proposedIntake} intake.`);
  }
  if (!landCompliant) {
    generatedDeficiencies.push(`Land area shortfall: Available ${actualLand} Acres vs mandatory ${reqLand} Acres for ${selectedApp?.category}.`);
  }
  if (!facultyCompliant) {
    generatedDeficiencies.push(`Faculty shortage: Current regular faculty is ${actualFaculty}, minimum required under 1:20 Cadre Ratio is ${reqFaculty}.`);
  }
  if (!leaseCompliant && leaseDoc) {
    generatedDeficiencies.push(`Lease validity deficiency: Remaining tenure is ${leaseRemainingYears} years, APH Section 1.6 mandates continuous 30 years minimum.`);
  }
  if (!fireCompliant) {
    generatedDeficiencies.push(`Life safety violation: Fire Safety NOC is expired or missing mandatory municipal clearance.`);
  }

  const generatedMemo = `ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
APPROVAL BUREAU · CURATIVE DEFICIENCY MEMORANDUM
Ref: AICTE/DEF/${selectedApp?.applicationNumber?.replace(/[^a-zA-Z0-9]/g, '') || '2026'}/APH

To:
The Principal / Director,
${selectedApp?.institutionName}
Location: ${selectedApp?.city}, ${selectedApp?.state} (${selectedApp?.region})

Subject: AICTE Preliminary Scrutiny Findings AY 2026-27 - Deficiencies Flagged.

Sir/Madam,
On automated examination of your application (${selectedApp?.applicationNumber}) under the AICTE Approval Process Handbook (APH) 2026-27 norms, the following statutory deficiencies have been observed:

${generatedDeficiencies.length > 0 
  ? generatedDeficiencies.map((d, i) => `${i + 1}. ${d}`).join('\n')
  : '1. All primary infrastructure and faculty norms comply with baseline APH thresholds. Pending EVC site verification.'}

You are hereby granted a cure window of 7 (Seven) working days from the date of this memorandum to upload notarized compliance evidence along with registered supporting deeds on the AikyaTrace portal.

Failure to cure the above deficiencies will lead to automatic rejection of the application or referral to the Standing Hearing Committee (SHC) for punitive action.

By Order of Competent Authority,
Regional Officer / Adviser (Approval Bureau)
All India Council for Technical Education, New Delhi`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMemo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 3000);
  };

  const handleApplyDeficienciesToCase = () => {
    if (!selectedApp) return;
    revertWithDeficiencies(
      selectedApp.id,
      generatedDeficiencies.length > 0 ? generatedDeficiencies : ['Technical clarification required on infrastructural layout'],
      'Automated APH Scrutiny Audit flagged mandatory compliance items.',
      7
    );
  };

  const handleTriggerRescan = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Automated AI Scrutiny Module</span>
            <span>·</span>
            <span>APH 2026-27 Algorithmic Validation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI APH Scrutiny Assistant & Discrepancy Scanner</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Instant heuristic and machine evaluation of land, built-up areas, cadre ratio, and lease covenants against statutory regulations.
          </p>
        </div>

        {/* Institution Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium hidden sm:inline">Target Case:</label>
          <select
            value={selectedAppId}
            onChange={(e) => setLocalSelectedAppId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer max-w-xs truncate"
          >
            {applications.map(app => (
              <option key={app.id} value={app.id}>
                {app.institutionName} ({app.city})
              </option>
            ))}
          </select>
          <button
            onClick={handleTriggerRescan}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition"
            title="Rescan Application"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Norm Compliance Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Land */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          landCompliant ? 'bg-white border-slate-200' : 'bg-rose-50/70 border-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Land Title</span>
            {landCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-base font-bold text-slate-900">{actualLand} Acres</div>
          <div className="text-[11px] text-slate-500 mt-1">Norm: ≥ {reqLand} Acres</div>
        </div>

        {/* Built-up */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          builtUpCompliant ? 'bg-white border-slate-200' : 'bg-rose-50/70 border-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Built-Up Area</span>
            {builtUpCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-base font-bold text-slate-900">{actualBuiltUp.toLocaleString()} m²</div>
          <div className="text-[11px] text-slate-500 mt-1">Norm: ≥ {reqBuiltUp.toLocaleString()} m²</div>
        </div>

        {/* Faculty */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          facultyCompliant ? 'bg-white border-slate-200' : 'bg-rose-50/70 border-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Faculty (1:20)</span>
            {facultyCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-base font-bold text-slate-900">{actualFaculty} Faculty</div>
          <div className="text-[11px] text-slate-500 mt-1">Norm: ≥ {reqFaculty} Faculty</div>
        </div>

        {/* 30-Yr Lease */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          leaseCompliant ? 'bg-white border-slate-200' : 'bg-rose-50/70 border-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">30-Yr Lease</span>
            {leaseCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-base font-bold text-slate-900">{leaseRemainingYears > 0 ? `${leaseRemainingYears} Yrs Left` : 'Expired'}</div>
          <div className="text-[11px] text-slate-500 mt-1">Norm: ≥ 30 continuous</div>
        </div>

        {/* Fire NOC */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          fireCompliant ? 'bg-white border-slate-200' : 'bg-rose-50/70 border-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Fire & Safety</span>
            {fireCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-base font-bold text-slate-900">{fireCompliant ? 'Valid NOC' : 'Action Due'}</div>
          <div className="text-[11px] text-slate-500 mt-1">Municipal Fire NOC</div>
        </div>
      </div>

      {/* Main Grid: Algorithmic Scrutiny Summary & Deficiency Notice Draft */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Discrepancy Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Scrutiny Audit Findings</h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                generatedDeficiencies.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {generatedDeficiencies.length === 0 ? 'Fully Compliant' : `${generatedDeficiencies.length} Deficiencies Detected`}
              </span>
            </div>

            <div className="text-xs text-slate-600 mb-4 leading-relaxed">
              Based on the parameters submitted for <strong>{selectedApp?.institutionName}</strong>, the automated rule engine scanned against AICTE Approval Process Handbook (APH) 2026-27 clauses:
            </div>

            <div className="space-y-3">
              {generatedDeficiencies.length === 0 ? (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Clear Scrutiny Recommendation</div>
                    <div className="mt-1 text-emerald-700">
                      All infrastructure, land acreage, instructional space, faculty cadre ratios, and lease tenures meet or exceed statutory mandates. Ready to advance to EVC inspection queue.
                    </div>
                  </div>
                </div>
              ) : (
                generatedDeficiencies.map((def, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Deficiency #{idx + 1}</div>
                      <div className="text-rose-800 mt-0.5 leading-relaxed">{def}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => setSelectedAppId(selectedApp.id)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Open Complete Application File →
            </button>

            {generatedDeficiencies.length > 0 && (
              <button
                onClick={handleApplyDeficienciesToCase}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition flex items-center gap-1.5"
              >
                <span>Revert Case to Institution</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Auto-Drafted AICTE Deficiency Memorandum */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">Official Deficiency Notice Generator</h2>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedMemo ? 'Copied!' : 'Copy Memorandum'}</span>
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[360px] overflow-y-auto whitespace-pre-wrap border border-slate-800">
              {generatedMemo}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Official digital seal & QR signature included upon dispatch.</span>
            <span className="font-semibold text-slate-700">APH Form 2A Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
