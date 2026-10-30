export type UserRole = 
  | 'BUREAU_OFFICER'       // HQ New Delhi (Approval Bureau)
  | 'REGIONAL_OFFICER'     // Regional Office (RO)
  | 'COMMITTEE_MEMBER'     // Scrutiny / EVC Expert
  | 'INSTITUTION_HEAD';    // College Registrar / Principal

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  region: Region;
  institutionName?: string;
  permanentId?: string;
  avatarLetter?: string;
}

export type Region = 
  | 'Northern (Kanpur)'
  | 'Western (Mumbai)'
  | 'Southern (Chennai)'
  | 'South-Western (Bengaluru)'
  | 'Eastern (Kolkata)'
  | 'Central (Bhopal)'
  | 'North-West (Chandigarh)'
  | 'South-Central (Hyderabad)';

export type ApplicationStage = 
  | 'Application Submitted'
  | 'Preliminary Scrutiny'
  | 'Re-Scrutiny (Clarifications)'
  | 'EVC Scheduled'
  | 'EVC Inspection Completed'
  | 'SAC / SHC Review'
  | 'Executive Approval'
  | 'Approved (LoA Issued)'
  | 'Returned / Deficient'
  | 'Rejected';

export type ApplicationType =
  | 'New Technical Institution'
  | 'Extension of Approval (EoA)'
  | 'Increase in Intake / New Program'
  | 'Change of Site / Location'
  | 'Conversion to Degree'
  | 'Introduction of Supernumerary Seats';

export type InstitutionCategory =
  | 'Engineering & Technology'
  | 'Management (MBA/PGDM)'
  | 'Pharmacy'
  | 'Architecture & Planning'
  | 'Applied Arts & Crafts'
  | 'Computer Applications (MCA)';

export type UrgencyLevel = 'NORMAL' | 'APPROACHING' | 'OVERDUE' | 'CRITICAL';

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  stageFrom?: ApplicationStage;
  stageTo?: ApplicationStage;
  remarks: string;
  verificationHash: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Land Lease Deed' | 'Building Safety NOC' | 'Fire Safety Certificate' | 'Affiliation Order' | 'Occupancy Certificate' | 'Pollution Clearance';
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'RENEWAL_SUBMITTED' | 'VERIFIED';
  documentUrl?: string;
  mandatedYears?: number;
  verifiedBy?: string;
  verificationDate?: string;
  renewalFile?: string;
  renewalDate?: string;
}

export interface UndertakingItem {
  id: string;
  applicationId: string;
  institutionName: string;
  region: Region;
  title: string;
  conditionDescription: string;
  stipulatedDays: number;
  assignedDate: string;
  dueDate: string;
  daysRemaining: number;
  status: 'PENDING_SUBMISSION' | 'SUBMITTED_FOR_VERIFICATION' | 'COMPLIED' | 'OVERDUE_ESCALATED' | 'SHOW_CAUSE_ISSUED';
  submissionEvidence?: {
    uploadedAt: string;
    description: string;
    fileName: string;
    affidavitNotaryNo: string;
  };
  escalationTier: 0 | 1 | 2 | 3;
  punitiveRisk: string; // e.g. "50% Intake Reduction", "No Admission Category"
}

export interface EVCExpert {
  id: string;
  name: string;
  designation: string;
  organization: string;
  specialization: string;
  contactEmail: string;
  status: 'INVITED' | 'CONFIRMED' | 'DECLINED';
}

export interface EVCRecord {
  id: string;
  applicationId: string;
  institutionName: string;
  region: Region;
  type: 'PHYSICAL_ON_SITE' | 'VIRTUAL_HYBRID';
  scheduledDate: string;
  deadlineDate: string;
  daysRemaining: number;
  experts: EVCExpert[];
  status: 'PENDING_SCHEDULING' | 'EXPERTS_ASSIGNED' | 'INSPECTION_UNDERWAY' | 'REPORT_SUBMITTED' | 'DEFICIENCIES_RECORDED' | 'CLEARED';
  reportSummary?: string;
  overallScore?: number; // 0-100
  checklistFindings?: {
    item: string;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
    aphNorm: string;
    observedValue: string;
  }[];
  evcVideoUrl?: string;
  inspectionSignedAt?: string;
}

export interface Application {
  id: string;
  applicationNumber: string; // e.g., AICTE/WR/2026/1-9874521
  institutionName: string;
  permanentId: string; // e.g., 1-4239841
  region: Region;
  state: string;
  city: string;
  type: ApplicationType;
  category: InstitutionCategory;
  academicYear: string;
  currentStage: ApplicationStage;
  submittedDate: string;
  lastUpdatedDate: string;
  stageDueDate: string;
  daysInCurrentStage: number;
  prescribedSlaDays: number;
  urgency: UrgencyLevel;
  responsibleOfficer: string;
  assignedDesk: string;
  
  // Specific requirements
  requiresEvc: boolean;
  requiresSac: boolean;
  
  // Scrutiny Details
  scrutinyScore?: number;
  scrutinyDeficiencies: string[];
  revertCount: number;
  revertReasons: string[];
  
  // Associated entities
  documents: DocumentItem[];
  undertakings: UndertakingItem[];
  evcRecord?: EVCRecord;
  auditTrail: AuditLog[];
  
  // Institutional Specs
  landAreaAcres: number;
  builtUpAreaSqM: number;
  proposedIntake: number;
  facultyCount: number;
  principalAppointed: boolean;
}

export interface NotificationAlert {
  id: string;
  timestamp: string;
  type: 'SLA_BREACH' | 'UPCOMING_DEADLINE' | 'EVC_REMINDER' | 'UNDERTAKING_OVERDUE' | 'DOCUMENT_EXPIRY' | 'STAGE_ADVANCED' | 'DEFICIENCY_REVERT';
  tier: 1 | 2 | 3; // Escalation Tier
  targetRole: UserRole[];
  title: string;
  message: string;
  applicationId?: string;
  institutionName: string;
  isRead: boolean;
  actionRequired: string;
}

export interface APHRuleConfig {
  id: string;
  stageName: ApplicationStage;
  defaultSlaDays: number;
  escalationTier1Days: number; // Days before due
  escalationTier2Days: number; // At due date
  escalationTier3Days: number; // Days past due
  mandatoryChecklist: string[];
}
