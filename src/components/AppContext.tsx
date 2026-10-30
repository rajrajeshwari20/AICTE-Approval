import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Application, 
  ApplicationStage, 
  UserRole, 
  Region, 
  NotificationAlert, 
  APHRuleConfig, 
  AuditLog, 
  EVCExpert,
  UndertakingItem,
  AuthUser
} from '../types';
import { INITIAL_APPLICATIONS, INITIAL_APH_RULES, INITIAL_NOTIFICATIONS } from '../data/mockData';

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'user-bureau',
    name: 'Dr. Rameshwar Sharma',
    email: 'adviser.hq@aicte-india.org',
    role: 'BUREAU_OFFICER',
    designation: 'Advisor-I (Approval Bureau HQ)',
    region: 'Northern (Kanpur)',
    avatarLetter: 'RS'
  },
  {
    id: 'user-ro-mumbai',
    name: 'Dr. Suresh K. Patil',
    email: 'ro.mumbai@aicte-india.org',
    role: 'REGIONAL_OFFICER',
    designation: 'Regional Officer & Director (Western Bureau)',
    region: 'Western (Mumbai)',
    avatarLetter: 'SP'
  },
  {
    id: 'user-expert',
    name: 'Prof. S. R. Deshmukh',
    email: 'expert.deshmukh@iitd.ac.in',
    role: 'COMMITTEE_MEMBER',
    designation: 'Senior Scrutiny & EVC Expert (IIT Delhi)',
    region: 'Northern (Kanpur)',
    avatarLetter: 'SD'
  },
  {
    id: 'user-institute',
    name: 'Dr. Amitav K. Somaiya',
    email: 'registrar@somaiya-siat.edu.in',
    role: 'INSTITUTION_HEAD',
    designation: 'Registrar & Authorized Representative',
    region: 'Western (Mumbai)',
    institutionName: 'Somaiya Institute of Advanced Technology & AI',
    permanentId: '1-4239841',
    avatarLetter: 'AS'
  }
];

interface AppContextType {
  applications: Application[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  selectedRegion: Region | 'ALL';
  setSelectedRegion: (region: Region | 'ALL') => void;
  notifications: NotificationAlert[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dispatchSystemNotice: (targetAppId: string, noticeType: string, customMessage: string) => void;

  // Authentication State & Actions
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    region: Region;
    designation: string;
    institutionName?: string;
    permanentId?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  demoLogin: (role: UserRole) => void;
  
  // Workflow actions
  advanceStage: (appId: string, nextStage: ApplicationStage, remarks: string) => void;
  revertWithDeficiencies: (appId: string, deficiencies: string[], remarks: string, cureDays: number) => void;
  
  // EVC actions
  scheduleEvc: (appId: string, scheduledDate: string, type: 'PHYSICAL_ON_SITE' | 'VIRTUAL_HYBRID', experts: EVCExpert[]) => void;
  submitEvcReport: (appId: string, score: number, summary: string, checklist: { item: string; status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'; aphNorm: string; observedValue: string }[]) => void;
  
  // Undertakings actions
  submitUndertakingEvidence: (undertakingId: string, fileName: string, description: string, notaryNo: string) => void;
  verifyUndertaking: (undertakingId: string, approved: boolean, remarks: string) => void;
  
  // Document validity actions
  submitDocumentRenewal: (docId: string, fileName: string, newExpiryDate: string) => void;
  verifyDocumentRenewal: (docId: string, approved: boolean) => void;
  
  // Rules configuration
  aphRules: APHRuleConfig[];
  updateAphRuleSla: (ruleId: string, newSla: number) => void;
  
  // Application modal
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  
  // New application creation (Institution portal)
  addNewApplication: (appData: Partial<Application>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('aikyatrace_apps');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // User & Authentication state
  const [users, setUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem('aikyatrace_users');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('aikyatrace_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Default logged in as Bureau Officer for easy demo
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'BUREAU_OFFICER';
  });

  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('ALL');
  const [notifications, setNotifications] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem('aikyatrace_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [aphRules, setAphRules] = useState<APHRuleConfig[]>(INITIAL_APH_RULES);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('aikyatrace_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('aikyatrace_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('aikyatrace_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aikyatrace_current_user', JSON.stringify(currentUser));
      setActiveRole(currentUser.role);
    } else {
      localStorage.removeItem('aikyatrace_current_user');
    }
  }, [currentUser]);

  const isAuthenticated = currentUser !== null;

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both official email ID and password.' };
    }
    
    // Find registered user or match demo users
    const foundUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      setActiveRole(foundUser.role);
      return { success: true };
    }

    // Auto-create/accept for valid AICTE or institute formats if testing new account
    const isGov = email.endsWith('.gov.in') || email.endsWith('.org') || email.includes('aicte');
    const autoRole: UserRole = isGov ? 'REGIONAL_OFFICER' : 'INSTITUTION_HEAD';
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
      email: email.trim().toLowerCase(),
      role: autoRole,
      designation: isGov ? 'Designated Regional Officer' : 'Institution Registrar / Principal',
      region: 'Western (Mumbai)',
      avatarLetter: email[0].toUpperCase()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveRole(newUser.role);
    return { success: true };
  };

  const register = (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    region: Region;
    designation: string;
    institutionName?: string;
    permanentId?: string;
  }): { success: boolean; error?: string } => {
    if (!userData.name || !userData.email || !userData.password) {
      return { success: false, error: 'Mandatory fields missing. Please fill all fields.' };
    }

    const existing = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this official email is already registered.' };
    }

    const initials = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AI';
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      role: userData.role,
      designation: userData.designation || 'Authorized Representative',
      region: userData.region,
      institutionName: userData.institutionName,
      permanentId: userData.permanentId,
      avatarLetter: initials
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveRole(newUser.role);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const demoLogin = (role: UserRole) => {
    const demoUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(demoUser);
    setActiveRole(demoUser.role);
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const generateAuditLog = (
    actorName: string, 
    actorRole: UserRole, 
    action: string, 
    remarks: string, 
    stageFrom?: ApplicationStage, 
    stageTo?: ApplicationStage
  ): AuditLog => {
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const hash = `SHA256:${randomHex}${Date.now().toString(16).slice(-6)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return {
      id: `aud-${Date.now()}`,
      timestamp: formattedDate,
      actorName,
      actorRole,
      action,
      stageFrom,
      stageTo,
      remarks,
      verificationHash: hash
    };
  };

  const advanceStage = (appId: string, nextStage: ApplicationStage, remarks: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      
      const prevStage = app.currentStage;
      const actorName = activeRole === 'BUREAU_OFFICER' ? 'Adviser (Approval Bureau HQ)'
        : activeRole === 'REGIONAL_OFFICER' ? app.responsibleOfficer
        : activeRole === 'COMMITTEE_MEMBER' ? 'Scrutiny Committee Member'
        : 'Authorized Signatory';
        
      const newAudit = generateAuditLog(actorName, activeRole, `Stage Transition to ${nextStage}`, remarks, prevStage, nextStage);
      
      // Calculate SLA for next stage
      const rule = aphRules.find(r => r.stageName === nextStage);
      const slaDays = rule ? rule.defaultSlaDays : 14;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + slaDays);
      const stageDueDate = targetDate.toISOString().split('T')[0];

      return {
        ...app,
        currentStage: nextStage,
        daysInCurrentStage: 0,
        prescribedSlaDays: slaDays,
        stageDueDate,
        urgency: 'NORMAL',
        lastUpdatedDate: new Date().toISOString().split('T')[0],
        auditTrail: [newAudit, ...app.auditTrail]
      };
    }));

    // Generate notification
    const app = applications.find(a => a.id === appId);
    if (app) {
      const newAlert: NotificationAlert = {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'STAGE_ADVANCED',
        tier: 1,
        targetRole: ['REGIONAL_OFFICER', 'INSTITUTION_HEAD'],
        title: `Stage Advanced: ${app.institutionName}`,
        message: `Application moved to [${nextStage}]. Remarks: ${remarks}`,
        applicationId: app.id,
        institutionName: app.institutionName,
        isRead: false,
        actionRequired: `Proceed with requirements prescribed under APH for ${nextStage}`
      };
      setNotifications(prev => [newAlert, ...prev]);
    }
  };

  const revertWithDeficiencies = (appId: string, deficiencies: string[], remarks: string, cureDays: number) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      
      const actorName = activeRole === 'REGIONAL_OFFICER' ? app.responsibleOfficer : 'Scrutiny Expert Desk';
      const newAudit = generateAuditLog(
        actorName, 
        activeRole, 
        'Application Reverted with Deficiencies', 
        `Deficiencies recorded: ${deficiencies.join('; ')}. Clarification remarks: ${remarks}`,
        app.currentStage,
        'Re-Scrutiny (Clarifications)'
      );

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + cureDays);
      const stageDueDate = targetDate.toISOString().split('T')[0];

      return {
        ...app,
        currentStage: 'Re-Scrutiny (Clarifications)',
        daysInCurrentStage: 0,
        prescribedSlaDays: cureDays,
        stageDueDate,
        urgency: 'APPROACHING',
        revertCount: app.revertCount + 1,
        revertReasons: [...app.revertReasons, `${new Date().toISOString().split('T')[0]}: ${remarks}`],
        scrutinyDeficiencies: deficiencies,
        lastUpdatedDate: new Date().toISOString().split('T')[0],
        auditTrail: [newAudit, ...app.auditTrail]
      };
    }));

    const app = applications.find(a => a.id === appId);
    if (app) {
      const newAlert: NotificationAlert = {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'DEFICIENCY_REVERT',
        tier: 2,
        targetRole: ['INSTITUTION_HEAD', 'REGIONAL_OFFICER'],
        title: `Deficiencies Flagged: ${app.institutionName}`,
        message: `${deficiencies.length} deficiencies flagged. Institutional response required within ${cureDays} days.`,
        applicationId: app.id,
        institutionName: app.institutionName,
        isRead: false,
        actionRequired: 'Upload compliance documents for re-scrutiny before deadline.'
      };
      setNotifications(prev => [newAlert, ...prev]);
    }
  };

  const scheduleEvc = (appId: string, scheduledDate: string, type: 'PHYSICAL_ON_SITE' | 'VIRTUAL_HYBRID', experts: EVCExpert[]) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const actorName = activeRole === 'REGIONAL_OFFICER' ? app.responsibleOfficer : 'Approval Bureau Officer';
      const newAudit = generateAuditLog(
        actorName,
        activeRole,
        `EVC Inspection Scheduled (${type})`,
        `Assigned 3-member expert panel on ${scheduledDate}. Notification dispatched to experts and institution.`,
        app.currentStage,
        'EVC Scheduled'
      );

      return {
        ...app,
        currentStage: 'EVC Scheduled',
        evcRecord: {
          id: `evc-${Date.now()}`,
          applicationId: app.id,
          institutionName: app.institutionName,
          region: app.region,
          type,
          scheduledDate,
          deadlineDate: scheduledDate,
          daysRemaining: 7,
          status: 'EXPERTS_ASSIGNED',
          reportSummary: `Inspection scheduled for ${scheduledDate}. Committee constituted.`,
          experts
        },
        auditTrail: [newAudit, ...app.auditTrail]
      };
    }));
  };

  const submitEvcReport = (
    appId: string, 
    score: number, 
    summary: string, 
    checklist: { item: string; status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'; aphNorm: string; observedValue: string }[]
  ) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId || !app.evcRecord) return app;

      const hasDeficiencies = checklist.some(c => c.status === 'NON_COMPLIANT');
      const nextStage: ApplicationStage = hasDeficiencies ? 'SAC / SHC Review' : 'Executive Approval';

      const newAudit = generateAuditLog(
        'EVC Expert Committee Chairman',
        'COMMITTEE_MEMBER',
        'EVC Inspection Report Submitted',
        `Score: ${score}/100. Findings: ${summary}. Outcome: ${hasDeficiencies ? 'Referred to SAC/SHC due to deficiencies' : 'Recommended for Executive Clearance'}.`,
        'EVC Scheduled',
        nextStage
      );

      return {
        ...app,
        currentStage: nextStage,
        evcRecord: {
          ...app.evcRecord,
          status: hasDeficiencies ? 'DEFICIENCIES_RECORDED' : 'REPORT_SUBMITTED',
          overallScore: score,
          reportSummary: summary,
          checklistFindings: checklist,
          inspectionSignedAt: new Date().toISOString()
        },
        auditTrail: [newAudit, ...app.auditTrail]
      };
    }));
  };

  const submitUndertakingEvidence = (undertakingId: string, fileName: string, description: string, notaryNo: string) => {
    setApplications(prev => prev.map(app => {
      const undIndex = app.undertakings.findIndex(u => u.id === undertakingId);
      if (undIndex === -1) return app;

      const updatedUndertakings = [...app.undertakings];
      updatedUndertakings[undIndex] = {
        ...updatedUndertakings[undIndex],
        status: 'SUBMITTED_FOR_VERIFICATION',
        submissionEvidence: {
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          description,
          fileName,
          affidavitNotaryNo: notaryNo
        }
      };

      const newAudit = generateAuditLog(
        'Principal / Registrar',
        'INSTITUTION_HEAD',
        'Compliance Evidence Uploaded',
        `Submitted compliance evidence for undertaking: "${updatedUndertakings[undIndex].title}". Notary No: ${notaryNo}`,
        app.currentStage,
        app.currentStage
      );

      return {
        ...app,
        undertakings: updatedUndertakings,
        auditTrail: [newAudit, ...app.auditTrail]
      };
    }));
  };

  const verifyUndertaking = (undertakingId: string, approved: boolean, remarks: string) => {
    setApplications(prev => prev.map(app => {
      const undIndex = app.undertakings.findIndex(u => u.id === undertakingId);
      if (undIndex === -1) return app;

      const updatedUndertakings = [...app.undertakings];
      updatedUndertakings[undIndex] = {
        ...updatedUndertakings[undIndex],
        status: approved ? 'COMPLIED' : 'SHOW_CAUSE_ISSUED'
      };

      const newAudit = generateAuditLog(
        activeRole === 'REGIONAL_OFFICER' ? app.responsibleOfficer : 'Compliance Desk Officer',
        activeRole,
        approved ? 'Undertaking Verified & Complied' : 'Undertaking Rejected / Show Cause',
        remarks,
        app.currentStage,
        app.currentStage
      );

      return {
        ...app,
        undertakings: updatedUndertakings,
        auditTrail: [newAudit, ...app.auditTrail]
      };
    }));
  };

  const submitDocumentRenewal = (docId: string, fileName: string, newExpiryDate: string) => {
    setApplications(prev => prev.map(app => {
      const docIndex = app.documents.findIndex(d => d.id === docId);
      if (docIndex === -1) return app;

      const updatedDocs = [...app.documents];
      updatedDocs[docIndex] = {
        ...updatedDocs[docIndex],
        status: 'RENEWAL_SUBMITTED',
        renewalFile: fileName,
        renewalDate: new Date().toISOString().split('T')[0],
        expiryDate: newExpiryDate
      };

      return {
        ...app,
        documents: updatedDocs
      };
    }));
  };

  const verifyDocumentRenewal = (docId: string, approved: boolean) => {
    setApplications(prev => prev.map(app => {
      const docIndex = app.documents.findIndex(d => d.id === docId);
      if (docIndex === -1) return app;

      const updatedDocs = [...app.documents];
      updatedDocs[docIndex] = {
        ...updatedDocs[docIndex],
        status: approved ? 'VERIFIED' : 'EXPIRED',
        verifiedBy: 'AICTE Scrutiny Desk',
        verificationDate: new Date().toISOString().split('T')[0]
      };

      return {
        ...app,
        documents: updatedDocs
      };
    }));
  };

  const updateAphRuleSla = (ruleId: string, newSla: number) => {
    setAphRules(prev => prev.map(r => r.id === ruleId ? { ...r, defaultSlaDays: newSla } : r));
  };

  const dispatchSystemNotice = (targetAppId: string, noticeType: string, customMessage: string) => {
    const targetApp = applications.find(a => a.id === targetAppId);
    if (!targetApp) return;

    const newAlert: NotificationAlert = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'SLA_BREACH',
      tier: 3,
      targetRole: ['INSTITUTION_HEAD', 'REGIONAL_OFFICER', 'BUREAU_OFFICER'],
      title: `Official AICTE Notice: ${noticeType}`,
      message: customMessage,
      applicationId: targetApp.id,
      institutionName: targetApp.institutionName,
      isRead: false,
      actionRequired: 'Acknowledge and submit formal reply on institutional letterhead within 48 hours.'
    };

    setNotifications(prev => [newAlert, ...prev]);
  };

  const addNewApplication = (appData: Partial<Application>) => {
    const newId = `app-${Date.now().toString().slice(-4)}`;
    const randomAppNum = `AICTE/${appData.region?.substring(0, 2).toUpperCase() || 'HQ'}/2026/1-${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    const newApp: Application = {
      id: newId,
      applicationNumber: randomAppNum,
      institutionName: appData.institutionName || 'Newly Registered Institute',
      permanentId: `1-${Math.floor(1000000 + Math.random() * 9000000)}`,
      region: appData.region || 'Western (Mumbai)',
      state: appData.state || 'Maharashtra',
      city: appData.city || 'Pune',
      type: appData.type || 'New Technical Institution',
      category: appData.category || 'Engineering & Technology',
      academicYear: '2026-2027',
      currentStage: 'Preliminary Scrutiny',
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      stageDueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      daysInCurrentStage: 0,
      prescribedSlaDays: 15,
      urgency: 'NORMAL',
      responsibleOfficer: 'Designated Regional Officer',
      assignedDesk: 'Desk-01 (General Admissions)',
      requiresEvc: true,
      requiresSac: false,
      scrutinyScore: 85,
      scrutinyDeficiencies: [],
      revertCount: 0,
      revertReasons: [],
      landAreaAcres: appData.landAreaAcres || 5.0,
      builtUpAreaSqM: appData.builtUpAreaSqM || 12500,
      proposedIntake: appData.proposedIntake || 300,
      facultyCount: appData.facultyCount || 20,
      principalAppointed: true,
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          title: 'Registered Land Lease Deed (30 Yrs)',
          category: 'Land Lease Deed',
          issueDate: '2024-01-01',
          expiryDate: '2054-01-01',
          daysRemaining: 9900,
          status: 'VALID',
          mandatedYears: 30
        },
        {
          id: `doc-${Date.now()}-2`,
          title: 'Fire Safety Certificate',
          category: 'Fire Safety Certificate',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          daysRemaining: 365,
          status: 'VALID'
        }
      ],
      undertakings: [
        {
          id: `und-${Date.now()}`,
          applicationId: newId,
          institutionName: appData.institutionName || 'Newly Registered Institute',
          region: appData.region || 'Western (Mumbai)',
          title: 'Full Faculty Recruitment Affidavit',
          conditionDescription: 'Complete selection committee recruitment of cadre ratio faculty within 60 days.',
          stipulatedDays: 60,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
          daysRemaining: 60,
          status: 'PENDING_SUBMISSION',
          escalationTier: 0,
          punitiveRisk: 'Withholding of final admission roster'
        }
      ],
      auditTrail: [
        generateAuditLog(
          'Institution Registrar',
          'INSTITUTION_HEAD',
          'Application Submitted on AikyaTrace',
          'Fresh application submitted for AY 2026-27 with all statutory fees and affidavits.',
          'Application Submitted',
          'Preliminary Scrutiny'
        )
      ]
    };

    setApplications(prev => [newApp, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        activeRole,
        setActiveRole,
        selectedRegion,
        setSelectedRegion,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dispatchSystemNotice,
        currentUser,
        isAuthenticated,
        login,
        register,
        logout,
        demoLogin,
        advanceStage,
        revertWithDeficiencies,
        scheduleEvc,
        submitEvcReport,
        submitUndertakingEvidence,
        verifyUndertaking,
        submitDocumentRenewal,
        verifyDocumentRenewal,
        aphRules,
        updateAphRuleSla,
        selectedAppId,
        setSelectedAppId,
        addNewApplication
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
