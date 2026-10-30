import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ApplicationPipeline } from './components/applications/ApplicationPipeline';
import { EvcSchedulingView } from './components/evc/EvcSchedulingView';
import { UndertakingsTracker } from './components/undertakings/UndertakingsTracker';
import { DocumentValidityVault } from './components/documents/DocumentValidityVault';
import { EscalationMatrixView } from './components/escalations/EscalationMatrixView';
import { AiScrutinyAssistant } from './components/ai-assistant/AiScrutinyAssistant';
import { AuditAndReportsView } from './components/reports/AuditAndReportsView';
import { ApplicationDetailModal } from './components/applications/ApplicationDetailModal';
import { NewApplicationModal } from './components/applications/NewApplicationModal';
import { AuthPage } from './components/auth/AuthPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // If user is logged out, show the dedicated AuthPage directly
  if (!isAuthenticated) {
    return <AuthPage onSuccess={() => setShowAuthModal(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-amber-200">
      {/* Top Application Header */}
      <Header 
        onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
        onOpenAuthPage={() => setShowAuthModal(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row shadow-sm">
        {/* Navigation Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <OverviewDashboard onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'pipeline' && (
            <ApplicationPipeline />
          )}

          {currentTab === 'evc' && (
            <EvcSchedulingView />
          )}

          {currentTab === 'undertakings' && (
            <UndertakingsTracker />
          )}

          {currentTab === 'documents' && (
            <DocumentValidityVault />
          )}

          {currentTab === 'escalations' && (
            <EscalationMatrixView />
          )}

          {currentTab === 'ai-scrutiny' && (
            <AiScrutinyAssistant />
          )}

          {currentTab === 'reports' && (
            <AuditAndReportsView />
          )}
        </main>
      </div>

      {/* Case Inspection & Action Modal */}
      <ApplicationDetailModal />

      {/* New Application Intake Modal */}
      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
      />

      {/* Auth Modal if opened while logged in */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/75 overflow-y-auto">
          <div className="relative min-h-screen">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-6 z-50 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer border border-slate-600 shadow-lg"
            >
              ✕ Return to Dashboard
            </button>
            <AuthPage onSuccess={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
