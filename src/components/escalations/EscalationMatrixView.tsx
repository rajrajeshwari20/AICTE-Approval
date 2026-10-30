import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  ShieldAlert, 
  Send, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Mail, 
  MessageSquare,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

export const EscalationMatrixView: React.FC = () => {
  const { 
    applications, 
    notifications, 
    aphRules, 
    updateAphRuleSla, 
    dispatchSystemNotice, 
    setSelectedAppId 
  } = useApp();

  const [selectedAppIdForNotice, setSelectedAppIdForNotice] = useState(applications[0]?.id || '');
  const [noticeType, setNoticeType] = useState('SHOW_CAUSE_NOTICE');
  const [noticeBody, setNoticeBody] = useState('You are hereby called upon to show cause within 48 hours why approval for Academic Year 2026-27 should not be withheld due to statutory non-compliance with APH norms.');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const tier3Notifs = notifications.filter(n => n.tier === 3);
  const tier2Notifs = notifications.filter(n => n.tier === 2);
  const tier1Notifs = notifications.filter(n => n.tier === 1);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppIdForNotice) return;

    dispatchSystemNotice(selectedAppIdForNotice, noticeType, noticeBody);
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Automated Governance & Escalations</span>
            <span>·</span>
            <span>APH Sec 5.2 Multi-Tier Escalation Matrix</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Automated Statutory Escalation Engine & Notice Dispatcher
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Rule-based progressive escalation hierarchy with automated dispatch to regional officers, bureau advisers, and member secretary.
          </p>
        </div>
      </div>

      {/* 3-Tier Escalation Matrix Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 */}
        <div className="bg-white rounded-xl border border-blue-200 shadow-xs p-4 border-t-4 border-t-blue-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Level 1 · Pre-Breach Warning
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {tier1Notifs.length} Active
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Institution & Desk Alert</h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Triggered 3 to 5 days prior to SLA expiry. Automated SMS & Portal prompt dispatched to College Principal and assigned Desk Officer.
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
            <strong>Action:</strong> Rapid response & preliminary document submission.
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-white rounded-xl border border-amber-200 shadow-xs p-4 border-t-4 border-t-amber-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Level 2 · SLA Breach Warning
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
              {tier2Notifs.length} Active
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Regional Officer (RO) Escalation</h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Triggered at Day 0 of SLA expiry. Case auto-escalated to Zonal Regional Officer (RO Mumbai, Bengaluru, etc.) for direct intervention.
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
            <strong>Action:</strong> 72-hour deficiency notice or desk call.
          </div>
        </div>

        {/* Tier 3 */}
        <div className="bg-white rounded-xl border border-rose-200 shadow-xs p-4 border-t-4 border-t-rose-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              Level 3 · Statutory Escalation
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
              {tier3Notifs.length} Critical
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Approval Bureau Adviser & MS</h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Triggered at +5 days overdue. Escalated to Approval Bureau HQ & Member Secretary. Freezes seat matrix and triggers punitive proceedings.
          </p>
          <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
            <strong>Sanction:</strong> Show Cause Notice & No Admission warning.
          </div>
        </div>
      </div>

      {/* Main Grid: Active Escalations Feed & Rule Engine Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Escalated Cases */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active High-Priority Escalations</h2>
              <p className="text-xs text-slate-500">Currently logged in AICTE automated incident register</p>
            </div>
            <span className="text-xs text-rose-600 font-semibold">{tier3Notifs.length + tier2Notifs.length} Alerts</span>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => {
              const isTier3 = notif.tier === 3;
              const isTier2 = notif.tier === 2;

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-lg border transition ${
                    isTier3 
                      ? 'bg-rose-50/60 border-rose-200' 
                      : isTier2 
                      ? 'bg-amber-50/50 border-amber-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isTier3 ? 'bg-rose-600 text-white' : isTier2 ? 'bg-amber-600 text-white' : 'bg-slate-600 text-white'
                      }`}>
                        Tier {notif.tier} Escalation
                      </span>
                      <span className="text-[11px] font-semibold text-slate-900">{notif.institutionName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{notif.timestamp}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-800 mb-1">{notif.title}</div>
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">{notif.message}</p>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-700">
                      <strong>Directive:</strong> {notif.actionRequired}
                    </span>
                    {notif.applicationId && (
                      <button
                        onClick={() => setSelectedAppId(notif.applicationId!)}
                        className="text-amber-800 hover:underline font-semibold cursor-pointer shrink-0 ml-2"
                      >
                        Intervene in Case →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Interactive Notice Dispatcher */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Official Notice Dispatcher</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Simulate dispatch of formal AICTE communications with automatic logging to legal audit trail.
            </p>

            {dispatchSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Statutory notice successfully dispatched & encrypted in audit ledger.</span>
              </div>
            )}

            <form onSubmit={handleDispatch} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Technical Institute</label>
                <select
                  value={selectedAppIdForNotice}
                  onChange={(e) => setSelectedAppIdForNotice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.institutionName} ({app.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Communication Type</label>
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="SHOW_CAUSE_NOTICE">Formal Show-Cause Notice</option>
                  <option value="SLA_BREACH_DIRECTIVE">SLA Breach Directive</option>
                  <option value="INTAKE_FREEZE_WARNING">Admission Seat Freeze Warning</option>
                  <option value="EVC_EMERGENCY_SUMMON">EVC Emergency Compliance Summon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Order Text</label>
                <textarea
                  rows={4}
                  value={noticeBody}
                  onChange={(e) => setNoticeBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Dispatch Official Notice</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-normal">
            Every notice dispatches instant multi-channel push to Institution Registrar Email, Registered Mobile, and AikyaTrace institutional inbox.
          </div>
        </div>
      </div>

      {/* APH Rule Engine Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Configurable APH Timeline Parameters</h2>
            <p className="text-xs text-slate-500">Fine-tune stage SLA days as prescribed in Approval Process Handbook</p>
          </div>
          <span className="text-xs text-amber-700 font-semibold">APH 2026-27 Active Standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {aphRules.map((rule) => (
            <div key={rule.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="font-bold text-slate-900 mb-1">{rule.stageName}</div>
              <div className="text-[11px] text-slate-500 mb-2">Default SLA Threshold</div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={rule.defaultSlaDays}
                  onChange={(e) => updateAphRuleSla(rule.id, Number(e.target.value))}
                  className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900"
                />
                <span className="text-xs text-slate-600 font-medium">Days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
