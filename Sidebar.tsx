import React from 'react';
import { 
  LayoutDashboard, 
  GitMerge, 
  CalendarClock, 
  FileCheck2, 
  FileWarning, 
  Radio, 
  Sparkles, 
  FileText,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTab = 
  | 'overview' 
  | 'pipeline' 
  | 'evc' 
  | 'undertakings' 
  | 'documents' 
  | 'escalations' 
  | 'ai-scrutiny' 
  | 'reports';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { applications, notifications, currentUser, logout } = useApp();

  const overdueAppsCount = applications.filter(a => a.urgency === 'OVERDUE').length;
  const pendingEvcCount = applications.filter(a => a.currentStage === 'EVC Scheduled' || (a.requiresEvc && a.currentStage === 'Preliminary Scrutiny')).length;
  const pendingUndertakingsCount = applications.flatMap(a => a.undertakings).filter(u => u.status === 'OVERDUE_ESCALATED' || u.status === 'PENDING_SUBMISSION').length;
  const expiringDocsCount = applications.flatMap(a => a.documents).filter(d => d.status === 'EXPIRED' || d.status === 'EXPIRING_SOON').length;
  const tier3Escalations = notifications.filter(n => n.tier === 3 && !n.isRead).length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string; description: string }[] = [
    {
      id: 'overview',
      label: 'Integrated Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      description: 'Zonal pendency, SLAs & stage bottlenecks'
    },
    {
      id: 'pipeline',
      label: 'Approval Workflows',
      icon: <GitMerge className="w-4 h-4" />,
      badge: overdueAppsCount > 0 ? overdueAppsCount : undefined,
      badgeColor: 'bg-rose-500/10 text-rose-600 border border-rose-200',
      description: 'Scrutiny, Re-Scrutiny & Stage transitions'
    },
    {
      id: 'evc',
      label: 'EVC Scheduling & Alerts',
      icon: <CalendarClock className="w-4 h-4" />,
      badge: pendingEvcCount > 0 ? pendingEvcCount : undefined,
      badgeColor: 'bg-amber-500/10 text-amber-700 border border-amber-200',
      description: 'Expert roster, physical & hybrid audits'
    },
    {
      id: 'undertakings',
      label: 'Time-Bound Undertakings',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: pendingUndertakingsCount > 0 ? pendingUndertakingsCount : undefined,
      badgeColor: 'bg-purple-500/10 text-purple-700 border border-purple-200',
      description: 'Conditional approvals & evidence verification'
    },
    {
      id: 'documents',
      label: 'Lease & Document Vault',
      icon: <FileWarning className="w-4 h-4" />,
      badge: expiringDocsCount > 0 ? expiringDocsCount : undefined,
      badgeColor: 'bg-rose-500/10 text-rose-700 border border-rose-200',
      description: '30-yr lease, Fire & Safety NOC radar'
    },
    {
      id: 'escalations',
      label: 'Escalation Engine',
      icon: <Radio className="w-4 h-4" />,
      badge: tier3Escalations > 0 ? tier3Escalations : undefined,
      badgeColor: 'bg-rose-600 text-white font-bold',
      description: '3-tier automatic statutory alerts & notices'
    },
    {
      id: 'ai-scrutiny',
      label: 'AI APH Scrutiny Assistant',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      description: 'Automated discrepancy checks & deficiency memos'
    },
    {
      id: 'reports',
      label: 'Audit Trail & Note Sheets',
      icon: <FileText className="w-4 h-4" />,
      description: 'Cryptographic log, official LoA & exports'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Platform Authority Badge */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <div>
            <div className="text-xs font-bold text-slate-900 tracking-tight">AICTE Statutory Portal</div>
            <div className="text-[11px] text-slate-500">Ministry of Education, Govt of India</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition group flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {item.icon}
                </span>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-snug">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ml-2 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active User Session Card */}
      {currentUser && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/90">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                {currentUser.avatarLetter || 'AI'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate leading-tight">{currentUser.designation}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer shrink-0 ml-1 hover:underline"
              title="Sign out"
            >
              Sign Out
            </button>
          </div>
          {currentUser.institutionName && (
            <div className="text-[10px] text-slate-600 truncate bg-white px-2 py-1 rounded border border-slate-200 mt-1">
              {currentUser.institutionName}
            </div>
          )}
        </div>
      )}

      {/* Regulatory Notice Footer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-100/60 text-[11px] text-slate-600">
        <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
          <Building className="w-3.5 h-3.5 text-slate-500" />
          Regulatory Safeguard
        </div>
        <p className="text-[10px] leading-relaxed text-slate-500">
          AikyaTrace automates monitoring & alerts under AICTE APH norms. Final statutory approvals remain reserved for Competent Authority.
        </p>
      </div>
    </aside>
  );
};
