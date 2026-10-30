import React from 'react';
import { useApp } from '../../context/AppContext';
import { Region, ApplicationStage } from '../../types';
import { 
  Building2, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  CalendarClock, 
  FileCheck2, 
  ArrowUpRight, 
  ChevronRight,
  TrendingDown,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface OverviewDashboardProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigateTab }) => {
  const { applications, selectedRegion, setSelectedRegion, setSelectedAppId } = useApp();

  const filteredApps = selectedRegion === 'ALL'
    ? applications
    : applications.filter(a => a.region === selectedRegion);

  // Metrics
  const totalApps = filteredApps.length;
  const overdueApps = filteredApps.filter(a => a.urgency === 'OVERDUE');
  const approachingApps = filteredApps.filter(a => a.urgency === 'APPROACHING');
  const approvedApps = filteredApps.filter(a => a.currentStage === 'Approved (LoA Issued)');
  const inScrutinyApps = filteredApps.filter(a => a.currentStage === 'Preliminary Scrutiny' || a.currentStage === 'Re-Scrutiny (Clarifications)');
  const inEvcApps = filteredApps.filter(a => a.currentStage === 'EVC Scheduled' || a.currentStage === 'EVC Inspection Completed');
  const inSacApps = filteredApps.filter(a => a.currentStage === 'SAC / SHC Review');

  // Total undertakings & documents
  const allUndertakings = filteredApps.flatMap(a => a.undertakings);
  const overdueUndertakings = allUndertakings.filter(u => u.status === 'OVERDUE_ESCALATED' || u.status === 'SHOW_CAUSE_ISSUED');
  
  const allDocs = filteredApps.flatMap(a => a.documents);
  const expiredDocs = allDocs.filter(d => d.status === 'EXPIRED');
  const expiringDocs = allDocs.filter(d => d.status === 'EXPIRING_SOON');

  // Regional breakdown
  const regionsList: Region[] = [
    'Northern (Kanpur)',
    'Western (Mumbai)',
    'Southern (Chennai)',
    'South-Western (Bengaluru)',
    'Eastern (Kolkata)',
    'Central (Bhopal)',
    'North-West (Chandigarh)',
    'South-Central (Hyderabad)'
  ];

  const regionalStats = regionsList.map(region => {
    const regionApps = applications.filter(a => a.region === region);
    const overdue = regionApps.filter(a => a.urgency === 'OVERDUE').length;
    const pending = regionApps.filter(a => a.currentStage !== 'Approved (LoA Issued)' && a.currentStage !== 'Rejected').length;
    const completed = regionApps.filter(a => a.currentStage === 'Approved (LoA Issued)').length;
    return {
      region,
      total: regionApps.length,
      overdue,
      pending,
      completed,
      complianceRate: regionApps.length > 0 ? Math.round((completed / regionApps.length) * 100) : 100
    };
  });

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Context Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>AICTE Approval Process Handbook (APH) 2026-27</span>
            <span>·</span>
            <span>Active Cycle</span>
            <span>·</span>
            <span className="font-semibold text-slate-800">
              {selectedRegion === 'ALL' ? 'Pan-India Overview' : selectedRegion}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Integrated Executive Dashboard & Pendency Sentinel
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Real-time monitoring of application movement across 8 regional bureaux, automated SLA compliance countdowns, EVC scheduling, and validity tracking for institutional undertakings.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span>View Processing Stages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Critical SLA Overdue Alert Banner if any */}
      {overdueApps.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                Immediate Action Required · {overdueApps.length} Application(s) Exceeded Prescribed APH Timelines
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                Statutory SLA breached in Re-Scrutiny / EVC stages. Automated Level-2 and Level-3 escalations triggered.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('escalations')}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shrink-0 cursor-pointer transition"
          >
            Review Escalated Queue
          </button>
        </div>
      )}

      {/* KPI Stat Cards (Clean typography, no pill enclosures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Applications</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalApps}</div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span className="font-medium text-emerald-600">{approvedApps.length} Cleared</span>
            <span>·</span>
            <span className="text-slate-500">{totalApps - approvedApps.length} In Progress</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>SLA Overdue Cases</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{overdueApps.length}</div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span className="text-amber-600 font-medium">{approachingApps.length} Approaching SLA</span>
            <span>·</span>
            <span className="text-slate-400">Strict APH Norms</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>EVC Queue & Audits</span>
            <CalendarClock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{inEvcApps.length}</div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span className="text-slate-700 font-medium">Physical / Hybrid Mode</span>
            <span>·</span>
            <span className="text-slate-500">Expert Rosters</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Undertakings & Leases</span>
            <FileCheck2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{allUndertakings.length}</div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span className="text-rose-600 font-medium">{expiredDocs.length + overdueUndertakings.length} Critical Issues</span>
            <span>·</span>
            <span className="text-slate-500">{expiringDocs.length} Expiring Soon</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Regional Performance Table & Stage Flow Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Regional Pendency & Ageing Matrix */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Regional Pendency & SLA Compliance Heatmap</h2>
              <p className="text-xs text-slate-500 mt-0.5">Monitoring workload distribution across all 8 zonal offices</p>
            </div>
            <span className="text-xs text-slate-500">Live Sync</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Regional Bureau</th>
                  <th className="py-2.5 px-3 text-center">Active Cases</th>
                  <th className="py-2.5 px-3 text-center">In Processing</th>
                  <th className="py-2.5 px-3 text-center">Overdue (SLA)</th>
                  <th className="py-2.5 px-3 text-center">LoA Issued</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalStats.map((item) => {
                  const isSelected = selectedRegion === item.region;
                  return (
                    <tr 
                      key={item.region} 
                      className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-amber-50/50' : ''}`}
                    >
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.overdue > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span>{item.region}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">{item.total}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{item.pending}</td>
                      <td className="py-3 px-3 text-center">
                        {item.overdue > 0 ? (
                          <span className="text-rose-600 font-bold">{item.overdue} Alert</span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-medium">{item.completed}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRegion(item.region);
                            onNavigateTab('pipeline');
                          }}
                          className="text-xs text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          Filter <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Stage Pipeline Velocity & Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Stage Velocity & Load</h2>
              <span className="text-[11px] text-slate-400">APH Stages</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">1. Scrutiny & Re-Scrutiny</span>
                  <span className="text-slate-900 font-bold">{inScrutinyApps.length} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${Math.min(100, (inScrutinyApps.length / (totalApps || 1)) * 100)}%` }} 
                  />
                </div>
                <span className="text-[10px] text-slate-500">SLA: 15 days (Scrutiny) / 7 days (Clarification)</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">2. Expert Visit Committee (EVC)</span>
                  <span className="text-slate-900 font-bold">{inEvcApps.length} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${Math.min(100, (inEvcApps.length / (totalApps || 1)) * 100)}%` }} 
                  />
                </div>
                <span className="text-[10px] text-slate-500">SLA: 21 days (Mandatory for new institutions)</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">3. SAC / SHC Appellate Review</span>
                  <span className="text-slate-900 font-bold">{inSacApps.length} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full" 
                    style={{ width: `${Math.min(100, (inSacApps.length / (totalApps || 1)) * 100)}%` }} 
                  />
                </div>
                <span className="text-[10px] text-slate-500">SLA: 14 days (Appellate bench hearing)</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">4. Approved & LoA Issued</span>
                  <span className="text-emerald-700 font-bold">{approvedApps.length} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min(100, (approvedApps.length / (totalApps || 1)) * 100)}%` }} 
                  />
                </div>
                <span className="text-[10px] text-slate-500">Digital Approval Letter dispatched</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 p-4 rounded-b-xl">
            <div className="text-xs font-semibold text-slate-900 mb-1">Bottleneck Diagnostics</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Longest average dwell time observed in <strong>Re-Scrutiny (Clarifications)</strong> due to delayed submission of compliance affidavits and fire NOC certificates from state authorities.
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Pending Application Cases Spotlight */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Priority Application Spotlight</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status of technical institutions requiring immediate official attention</p>
          </div>
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
          >
            View All Pipeline →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredApps.slice(0, 3).map((app) => {
            const isOverdue = app.urgency === 'OVERDUE';
            const isApproaching = app.urgency === 'APPROACHING';

            return (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition bg-slate-50/40 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-mono">
                    <span>{app.applicationNumber}</span>
                    <span className={`font-semibold ${
                      isOverdue ? 'text-rose-600' : isApproaching ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {isOverdue ? 'SLA BREACHED' : `${app.daysInCurrentStage} / ${app.prescribedSlaDays} Days`}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition line-clamp-1 mb-1">
                    {app.institutionName}
                  </h3>

                  <div className="text-[11px] text-slate-600 mb-3">
                    <span>{app.city}, {app.state}</span>
                    <span className="mx-1">·</span>
                    <span>{app.category}</span>
                  </div>

                  <div className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 mb-3">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Current Stage</div>
                    <div className="font-semibold text-slate-900 mt-0.5">{app.currentStage}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Desk: {app.assignedDesk}</span>
                  <span className="font-medium text-amber-700 group-hover:underline flex items-center gap-0.5">
                    Open Case <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
