import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Region } from '../../types';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  UserCheck, 
  SlidersHorizontal,
  ChevronDown,
  X,
  ExternalLink,
  LogOut,
  LogIn,
  User
} from 'lucide-react';

interface HeaderProps {
  onOpenNewAppModal: () => void;
  onOpenAuthPage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewAppModal, onOpenAuthPage }) => {
  const { 
    activeRole, 
    setActiveRole, 
    selectedRegion, 
    setSelectedRegion,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedAppId,
    currentUser,
    logout
  } = useApp();

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const regions: (Region | 'ALL')[] = [
    'ALL',
    'Northern (Kanpur)',
    'Western (Mumbai)',
    'Southern (Chennai)',
    'South-Western (Bengaluru)',
    'Eastern (Kolkata)',
    'Central (Bhopal)',
    'North-West (Chandigarh)',
    'South-Central (Hyderabad)'
  ];

  const roleLabels: Record<UserRole, { title: string; subtitle: string; badge: string }> = {
    BUREAU_OFFICER: {
      title: 'Approval Bureau (HQ)',
      subtitle: 'New Delhi · National Oversight',
      badge: 'Apex Authority'
    },
    REGIONAL_OFFICER: {
      title: 'Regional Officer (RO)',
      subtitle: 'Western Region · Mumbai',
      badge: 'Zonal Approver'
    },
    COMMITTEE_MEMBER: {
      title: 'Scrutiny & EVC Expert',
      subtitle: 'Senior Academic Panelist',
      badge: 'Peer Reviewer'
    },
    INSTITUTION_HEAD: {
      title: 'Institution Representative',
      subtitle: 'Registrar / Director',
      badge: 'Applicant Institute'
    }
  };

  const overdueNotifs = notifications.filter(n => n.tier >= 2);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Banner Alert Bar if overdue items exist */}
      {overdueNotifs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-700 via-rose-700 to-amber-800 px-4 py-1.5 text-xs flex items-center justify-between text-amber-50">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
            <span>
              <strong>STATUTORY ALERT:</strong> {overdueNotifs.length} approval & compliance matters exceed prescribed APH timelines and are under automated Level-2/3 escalation.
            </span>
          </div>
          <button 
            onClick={() => setShowNotifDrawer(true)} 
            className="text-xs text-amber-100 hover:text-white underline font-medium cursor-pointer"
          >
            Review Escalated Queue →
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & AICTE Emblems */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 shadow-inner">
            <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Aikya<span className="text-amber-400">Trace</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                AICTE APH 2026-27
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Integrated Approval Automation & Compliance Sentinel
            </p>
          </div>
        </div>

        {/* Global Controls: Region Selector, Role Switcher, Notification Bell, New Application */}
        <div className="flex items-center gap-3">
          {/* Region Filter */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as Region | 'ALL')}
              className="bg-transparent text-amber-300 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {regions.map(r => (
                <option key={r} value={r} className="bg-slate-900 text-slate-200">
                  {r === 'ALL' ? 'All 8 Regions (National)' : r}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Application (Available for Institution or testing) */}
          <button
            onClick={onOpenNewAppModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow transition cursor-pointer"
          >
            <span>+ New Application</span>
          </button>

          {/* Role Switcher Dropdown (Essential for testing all perspectives) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 cursor-pointer transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <span className="font-semibold block leading-tight text-white">{roleLabels[activeRole].title}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline leading-none">{roleLabels[activeRole].subtitle}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active AICTE Role
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((roleKey) => {
                  const item = roleLabels[roleKey];
                  const isSelected = activeRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => {
                        setActiveRole(roleKey);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition cursor-pointer ${
                        isSelected ? 'bg-slate-800/80 text-amber-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-[10px] text-slate-400">{item.subtitle}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile Badge & Logout / Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-700">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center">
                  {currentUser.avatarLetter || 'AI'}
                </div>
                <div className="text-left text-xs leading-none">
                  <span className="font-semibold text-white block truncate max-w-[120px]">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px] block mt-0.5">{currentUser.email}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-700/80 text-xs text-slate-300 hover:text-rose-200 transition cursor-pointer"
                title="Sign out of AikyaTrace session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline font-medium text-[11px]">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthPage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-slate-900">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Drawer */}
      {showNotifDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Statutory Alerts & Escalations
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifDrawer(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800 p-3 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No alerts pending at this moment.
                </div>
              ) : (
                notifications.map((n) => {
                  const isTier3 = n.tier === 3;
                  const isTier2 = n.tier === 2;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.applicationId) {
                          setSelectedAppId(n.applicationId);
                          setShowNotifDrawer(false);
                        }
                      }}
                      className={`p-3.5 rounded-lg border transition cursor-pointer ${
                        !n.isRead 
                          ? isTier3 
                            ? 'bg-rose-950/30 border-rose-800/80' 
                            : isTier2 
                            ? 'bg-amber-950/20 border-amber-800/70' 
                            : 'bg-slate-800/70 border-slate-700'
                          : 'bg-slate-900 border-slate-800/60 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          {isTier3 ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                              Tier 3 Escalation
                            </span>
                          ) : isTier2 ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                              Tier 2 Warning
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium uppercase text-slate-400">
                              System Alert
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            {n.timestamp}
                          </span>
                        </div>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-white mb-1">
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-amber-300 font-medium">
                          Action: {n.actionRequired}
                        </span>
                        {n.applicationId && (
                          <span className="text-slate-400 flex items-center gap-1 hover:text-white">
                            View Case <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
              AICTE Automated Rule Engine v4.2 · All escalations logged to immutable audit ledger
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
