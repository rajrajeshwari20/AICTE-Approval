import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStage, ApplicationType, Region } from '../../types';
import { 
  GitMerge, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  ListFilter,
  Eye,
  Building,
  Calendar,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const ApplicationPipeline: React.FC = () => {
  const { 
    applications, 
    selectedRegion, 
    setSelectedRegion,
    setSelectedAppId,
    activeRole
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');

  // Stages in pipeline
  const pipelineStages: ApplicationStage[] = [
    'Preliminary Scrutiny',
    'Re-Scrutiny (Clarifications)',
    'EVC Scheduled',
    'EVC Inspection Completed',
    'SAC / SHC Review',
    'Executive Approval',
    'Approved (LoA Issued)'
  ];

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesRegion = selectedRegion === 'ALL' || app.region === selectedRegion;
    const matchesType = selectedType === 'ALL' || app.type === selectedType;
    const matchesStage = selectedStageFilter === 'ALL' || app.currentStage === selectedStageFilter;
    const matchesQuery = 
      app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.permanentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesType && matchesStage && matchesQuery;
  });

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
              <span>Approval Process Automation</span>
              <span>·</span>
              <span>APH Sec 1.4 - 2.8 Routing Engine</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Application Movement & Workflow Pipeline
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Automated routing through preliminary scrutiny, re-scrutiny, EVC inspections, and appellate SAC benches with strict SLA ageing tracking.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  viewMode === 'KANBAN' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kanban Stages
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  viewMode === 'TABLE' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabular Registry
              </button>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Application / Institute / ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Application Types</option>
            <option value="New Technical Institution">New Technical Institution</option>
            <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
            <option value="Increase in Intake / New Program">Increase in Intake / New Program</option>
            <option value="Change of Site / Location">Change of Site / Location</option>
            <option value="Conversion to Degree">Conversion to Degree</option>
            <option value="Introduction of Supernumerary Seats">Supernumerary Seats</option>
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Workflow Stages</option>
            {pipelineStages.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Quick Counter */}
          <div className="flex items-center justify-end text-xs text-slate-500 font-medium px-2">
            Showing <strong className="text-slate-900 mx-1">{filteredApps.length}</strong> of {applications.length} cases
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'KANBAN' && (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[560px]">
          {pipelineStages.map((stage) => {
            const stageApps = filteredApps.filter(a => a.currentStage === stage);

            return (
              <div 
                key={stage} 
                className="w-72 shrink-0 bg-slate-100/70 border border-slate-200 rounded-xl flex flex-col max-h-[750px]"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-900 tracking-tight truncate" title={stage}>
                      {stage}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {stageApps.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {stage === 'Preliminary Scrutiny' && 'SLA: 15 Days · Desk Review'}
                    {stage === 'Re-Scrutiny (Clarifications)' && 'SLA: 7 Days · Deficiency Cure'}
                    {stage === 'EVC Scheduled' && 'SLA: 21 Days · Expert Panel'}
                    {stage === 'EVC Inspection Completed' && 'Report Review & Scoring'}
                    {stage === 'SAC / SHC Review' && 'SLA: 14 Days · Appellate Hearing'}
                    {stage === 'Executive Approval' && 'Final Bureau Sanction'}
                    {stage === 'Approved (LoA Issued)' && 'Statutory Grant Dispatched'}
                  </div>
                </div>

                {/* Stage Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {stageApps.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No applications in this stage
                    </div>
                  ) : (
                    stageApps.map((app) => {
                      const isOverdue = app.urgency === 'OVERDUE';
                      const isApproaching = app.urgency === 'APPROACHING';

                      return (
                        <div
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-xs transition cursor-pointer group"
                        >
                          {/* Card Header */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 font-mono">
                            <span className="truncate">{app.applicationNumber}</span>
                            <span className={`font-semibold ${
                              isOverdue ? 'text-rose-600 font-bold' : isApproaching ? 'text-amber-600' : 'text-slate-500'
                            }`}>
                              {isOverdue ? 'OVERDUE' : `${app.daysInCurrentStage}d / ${app.prescribedSlaDays}d`}
                            </span>
                          </div>

                          {/* Institute Title */}
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 line-clamp-2 mb-1.5">
                            {app.institutionName}
                          </h4>

                          {/* Metadata */}
                          <div className="text-[11px] text-slate-600 space-y-0.5 mb-2.5">
                            <div className="truncate">
                              {app.city} · {app.region}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {app.type}
                            </div>
                          </div>

                          {/* Flags: EVC / Reverts / Deficiencies */}
                          <div className="flex flex-wrap gap-1 mb-2 text-[10px]">
                            {app.requiresEvc && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                EVC Mandatory
                              </span>
                            )}
                            {app.revertCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Reverted {app.revertCount}x
                              </span>
                            )}
                            {app.scrutinyDeficiencies.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                {app.scrutinyDeficiencies.length} Deficiencies
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Due: {app.stageDueDate}</span>
                            <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                              Open Case <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Application No & Institute</th>
                  <th className="py-3 px-3">Type & Discipline</th>
                  <th className="py-3 px-3">Region & Desk</th>
                  <th className="py-3 px-3">Current Stage</th>
                  <th className="py-3 px-3 text-center">Stage Ageing / SLA</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isOverdue = app.urgency === 'OVERDUE';
                  const isApproaching = app.urgency === 'APPROACHING';

                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => setSelectedAppId(app.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono text-[11px] text-slate-500">{app.applicationNumber}</div>
                        <div className="font-bold text-slate-900 text-xs mt-0.5">{app.institutionName}</div>
                        <div className="text-[11px] text-slate-500">{app.city}, {app.state}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{app.type}</div>
                        <div className="text-[11px] text-slate-500">{app.category}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800">{app.region}</div>
                        <div className="text-[11px] text-slate-500">{app.assignedDesk}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900">{app.currentStage}</div>
                        <div className="text-[11px] text-slate-500">Due: {app.stageDueDate}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="font-semibold text-slate-800">
                          {app.daysInCurrentStage} / {app.prescribedSlaDays} days
                        </div>
                        <div className="w-16 mx-auto h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              isOverdue ? 'bg-rose-600' : isApproaching ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (app.daysInCurrentStage / app.prescribedSlaDays) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isOverdue ? (
                          <span className="text-rose-600 font-bold">SLA Breached</span>
                        ) : isApproaching ? (
                          <span className="text-amber-600 font-medium">Nearing Due</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">In Window</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppId(app.id);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
