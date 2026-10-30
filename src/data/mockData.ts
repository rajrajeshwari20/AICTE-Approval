import { Application, DocumentItem, UndertakingItem, EVCRecord, NotificationAlert, APHRuleConfig } from '../types';

export const INITIAL_APH_RULES: APHRuleConfig[] = [
  {
    id: 'aph-scrutiny',
    stageName: 'Preliminary Scrutiny',
    defaultSlaDays: 15,
    escalationTier1Days: 3,
    escalationTier2Days: 0,
    escalationTier3Days: 5,
    mandatoryChecklist: [
      'Land title / 30-year registered lease deed verification',
      'Building safety certificate from competent structural engineer',
      'Fire & Safety NOC from State Disaster/Fire Department',
      'Corpus fund / Security deposit FDR verification',
      'Cadre ratio & Principal appointment eligibility'
    ]
  },
  {
    id: 'aph-rescrutiny',
    stageName: 'Re-Scrutiny (Clarifications)',
    defaultSlaDays: 7,
    escalationTier1Days: 2,
    escalationTier2Days: 0,
    escalationTier3Days: 3,
    mandatoryChecklist: [
      'Verification of compliance submitted against recorded deficiency',
      'Notarized affidavit on INR 100 non-judicial stamp paper',
      'Verification of revised architectural blueprints',
      'Bank statement proof for equipment expenditure'
    ]
  },
  {
    id: 'aph-evc',
    stageName: 'EVC Scheduled',
    defaultSlaDays: 21,
    escalationTier1Days: 5,
    escalationTier2Days: 0,
    escalationTier3Days: 4,
    mandatoryChecklist: [
      'Constitution of 3-member expert committee (Academic + Civil/Arch + Industry)',
      'Geo-tagged photo/video inspection of labs & barrier-free ramps',
      'Verification of physical library books, DELNET / e-journal subscriptions',
      'Live student and faculty biometric attendance verification'
    ]
  },
  {
    id: 'aph-sac',
    stageName: 'SAC / SHC Review',
    defaultSlaDays: 14,
    escalationTier1Days: 3,
    escalationTier2Days: 0,
    escalationTier3Days: 3,
    mandatoryChecklist: [
      'Hearing of institution representatives before Standing Appellate Committee',
      'Examination of rejected or disputed EVC observations',
      'Legal & procedural compliance check under AICTE Act Sec 10(k)'
    ]
  },
  {
    id: 'aph-exec',
    stageName: 'Executive Approval',
    defaultSlaDays: 7,
    escalationTier1Days: 2,
    escalationTier2Days: 0,
    escalationTier3Days: 2,
    mandatoryChecklist: [
      'Final clearance by Member Secretary & Chairman AICTE',
      'Generation of digital signature Letter of Approval (LoA)',
      'Sync with National Portal for centralized admission seat matrix'
    ]
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    applicationNumber: 'AICTE/WR/2026/1-9874521',
    institutionName: 'Somaiya Institute of Advanced Technology & AI',
    permanentId: '1-4239841',
    region: 'Western (Mumbai)',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'New Technical Institution',
    category: 'Engineering & Technology',
    academicYear: '2026-2027',
    currentStage: 'EVC Scheduled',
    submittedDate: '2026-09-12',
    lastUpdatedDate: '2026-10-25',
    stageDueDate: '2026-11-04',
    daysInCurrentStage: 12,
    prescribedSlaDays: 21,
    urgency: 'NORMAL',
    responsibleOfficer: 'Dr. Suresh K. Patil (RO Western)',
    assignedDesk: 'Desk-04 (New Tech)',
    requiresEvc: true,
    requiresSac: false,
    scrutinyScore: 92,
    scrutinyDeficiencies: [],
    revertCount: 0,
    revertReasons: [],
    landAreaAcres: 5.4,
    builtUpAreaSqM: 14850,
    proposedIntake: 360,
    facultyCount: 24,
    principalAppointed: true,
    documents: [
      {
        id: 'doc-101',
        title: 'Registered Land Lease Deed (30 Yrs)',
        category: 'Land Lease Deed',
        issueDate: '2024-06-01',
        expiryDate: '2054-05-31',
        daysRemaining: 10076,
        status: 'VALID',
        mandatedYears: 30,
        verifiedBy: 'Desk Officer Patil',
        verificationDate: '2026-09-15'
      },
      {
        id: 'doc-102',
        title: 'Fire Safety NOC & Evacuation Plan',
        category: 'Fire Safety Certificate',
        issueDate: '2025-11-10',
        expiryDate: '2026-11-09',
        daysRemaining: 10,
        status: 'EXPIRING_SOON',
        verifiedBy: 'Desk Officer Patil',
        verificationDate: '2026-09-15'
      },
      {
        id: 'doc-103',
        title: 'Building Safety & Structural Stability Certificate',
        category: 'Building Safety NOC',
        issueDate: '2025-08-20',
        expiryDate: '2028-08-19',
        daysRemaining: 658,
        status: 'VALID',
        verifiedBy: 'Desk Officer Patil',
        verificationDate: '2026-09-15'
      }
    ],
    undertakings: [
      {
        id: 'und-201',
        applicationId: 'app-001',
        institutionName: 'Somaiya Institute of Advanced Technology & AI',
        region: 'Western (Mumbai)',
        title: 'AI High Performance Computing Lab Commissioning',
        conditionDescription: 'Submit proof of delivery & commissioning of 64 GPU NVIDIA workstation lab within 90 days of provisional clearance.',
        stipulatedDays: 90,
        assignedDate: '2026-09-20',
        dueDate: '2026-12-19',
        daysRemaining: 50,
        status: 'PENDING_SUBMISSION',
        escalationTier: 0,
        punitiveRisk: 'Intake in AI & Data Science capped to 60 seats'
      }
    ],
    evcRecord: {
      id: 'evc-301',
      applicationId: 'app-001',
      institutionName: 'Somaiya Institute of Advanced Technology & AI',
      region: 'Western (Mumbai)',
      type: 'PHYSICAL_ON_SITE',
      scheduledDate: '2026-11-02',
      deadlineDate: '2026-11-05',
      daysRemaining: 3,
      status: 'EXPERTS_ASSIGNED',
      reportSummary: 'EVC team configured. Physical visit scheduled with video recording.',
      experts: [
        {
          id: 'exp-1',
          name: 'Prof. R. Venkatesh',
          designation: 'Professor, Dept of Computer Science',
          organization: 'IIT Bombay',
          specialization: 'High Performance Computing',
          contactEmail: 'rvenkat@cse.iitb.ac.in',
          status: 'CONFIRMED'
        },
        {
          id: 'exp-2',
          name: 'Ar. Meenakshi Joshi',
          designation: 'Senior Architect & Council of Architecture Member',
          organization: 'Govt. College of Architecture Mumbai',
          specialization: 'Campus Master Planning & ADA Norms',
          contactEmail: 'mjoshi.arch@gov.in',
          status: 'CONFIRMED'
        },
        {
          id: 'exp-3',
          name: 'Dr. Anand Mahindra Jr.',
          designation: 'Chief Technology Director',
          organization: 'Tata Motors EV Division',
          specialization: 'Industry 4.0 Labs',
          contactEmail: 'anand.m@tatamotors.com',
          status: 'CONFIRMED'
        }
      ],
      checklistFindings: [
        { item: 'Clear Land Title & Barrier-free Access', status: 'COMPLIANT', aphNorm: '5.0 Acres minimum in Urban area', observedValue: '5.4 Acres confirmed' },
        { item: 'Administrative & Instructional Space', status: 'COMPLIANT', aphNorm: '12,000 sq.m minimum', observedValue: '14,850 sq.m built' },
        { item: 'Barrier-Free Lifts & Braille Signage', status: 'COMPLIANT', aphNorm: '100% accessible ramps & disabled restrooms', observedValue: '3 Otis passenger lifts & ramps verified' }
      ]
    },
    auditTrail: [
      {
        id: 'aud-001',
        timestamp: '2026-09-12 11:30',
        actorName: 'Registrar, Somaiya SIAT',
        actorRole: 'INSTITUTION_HEAD',
        action: 'Application Submission',
        stageFrom: 'Application Submitted',
        stageTo: 'Preliminary Scrutiny',
        remarks: 'Submitted fresh application for AY 2026-27 with all required annexures and fees paid (INR 7,00,000).',
        verificationHash: 'SHA256:8b4c092a71e89b21f...'
      },
      {
        id: 'aud-002',
        timestamp: '2026-09-28 16:45',
        actorName: 'Dr. Suresh K. Patil',
        actorRole: 'REGIONAL_OFFICER',
        action: 'Scrutiny Completed Successfully',
        stageFrom: 'Preliminary Scrutiny',
        stageTo: 'EVC Scheduled',
        remarks: 'Land and building documents verified. All FDR deposits checked. Forwarded for Expert Visit Committee inspection.',
        verificationHash: 'SHA256:d17a8c339f4001e5...'
      }
    ]
  },
  {
    id: 'app-002',
    applicationNumber: 'AICTE/SW/2026/1-7890123',
    institutionName: 'Bangalore Global Institute of Pharmacy & Research',
    permanentId: '1-3891044',
    region: 'South-Western (Bengaluru)',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Increase in Intake / New Program',
    category: 'Pharmacy',
    academicYear: '2026-2027',
    currentStage: 'Re-Scrutiny (Clarifications)',
    submittedDate: '2026-09-01',
    lastUpdatedDate: '2026-10-22',
    stageDueDate: '2026-10-29',
    daysInCurrentStage: 8,
    prescribedSlaDays: 7,
    urgency: 'OVERDUE',
    responsibleOfficer: 'Smt. Kavitha R. (RO Bengaluru)',
    assignedDesk: 'Desk-02 (Pharmacy & Health)',
    requiresEvc: true,
    requiresSac: false,
    scrutinyScore: 68,
    scrutinyDeficiencies: [
      'Animal House approval from CPCSEA not attached',
      'Cadre ratio deficit: Assistant Professors short by 4 faculty members',
      'Machine Room equipment calibration log missing'
    ],
    revertCount: 1,
    revertReasons: ['Deficiencies flagged during initial scrutiny on 2026-10-15. 7 days granted for re-scrutiny upload.'],
    landAreaAcres: 3.2,
    builtUpAreaSqM: 8200,
    proposedIntake: 100,
    facultyCount: 12,
    principalAppointed: true,
    documents: [
      {
        id: 'doc-201',
        title: 'Land Lease Deed (40 Yrs)',
        category: 'Land Lease Deed',
        issueDate: '2020-04-01',
        expiryDate: '2060-03-31',
        daysRemaining: 12205,
        status: 'VALID',
        mandatedYears: 30
      },
      {
        id: 'doc-202',
        title: 'Fire Safety Certificate',
        category: 'Fire Safety Certificate',
        issueDate: '2025-05-14',
        expiryDate: '2026-05-13',
        daysRemaining: -170,
        status: 'EXPIRED',
        renewalFile: 'Karnataka_FireNOC_Renewal_Ack_2026.pdf',
        renewalDate: '2026-10-21'
      }
    ],
    undertakings: [
      {
        id: 'und-202',
        applicationId: 'app-002',
        institutionName: 'Bangalore Global Institute of Pharmacy & Research',
        region: 'South-Western (Bengaluru)',
        title: 'Recruitment of 4 Associate & Assistant Professors in Pharmaceutics',
        conditionDescription: 'Submit appointment orders, joining reports, and selection committee minutes approved by University within 60 days.',
        stipulatedDays: 60,
        assignedDate: '2026-08-15',
        dueDate: '2026-10-14',
        daysRemaining: -16,
        status: 'OVERDUE_ESCALATED',
        escalationTier: 2,
        punitiveRisk: 'Rejection of B.Pharm intake hike from 60 to 100'
      }
    ],
    auditTrail: [
      {
        id: 'aud-003',
        timestamp: '2026-10-15 14:10',
        actorName: 'Scrutiny Committee Desk-02',
        actorRole: 'COMMITTEE_MEMBER',
        action: 'Application Reverted with Deficiencies',
        stageFrom: 'Preliminary Scrutiny',
        stageTo: 'Re-Scrutiny (Clarifications)',
        remarks: 'Deficiencies noted in faculty cadre and Animal House certificate. Reverted with 7-day timeline.',
        verificationHash: 'SHA256:f5231c990a42e...'
      }
    ]
  },
  {
    id: 'app-003',
    applicationNumber: 'AICTE/NR/2026/1-5462910',
    institutionName: 'Doon Valley College of Engineering & Technology',
    permanentId: '1-1092384',
    region: 'Northern (Kanpur)',
    state: 'Uttar Pradesh',
    city: 'Kanpur',
    type: 'Change of Site / Location',
    category: 'Engineering & Technology',
    academicYear: '2026-2027',
    currentStage: 'SAC / SHC Review',
    submittedDate: '2026-08-10',
    lastUpdatedDate: '2026-10-24',
    stageDueDate: '2026-11-02',
    daysInCurrentStage: 11,
    prescribedSlaDays: 14,
    urgency: 'APPROACHING',
    responsibleOfficer: 'Prof. Alok Verma (Advisor Approval Bureau)',
    assignedDesk: 'SAC High-Level Hearing Bench',
    requiresEvc: true,
    requiresSac: true,
    scrutinyScore: 74,
    scrutinyDeficiencies: ['Dispute regarding land title mutation order at the newly proposed site'],
    revertCount: 2,
    revertReasons: ['EVC pointed out incomplete boundary wall and missing approach road in earlier visit.'],
    landAreaAcres: 7.5,
    builtUpAreaSqM: 19500,
    proposedIntake: 420,
    facultyCount: 38,
    principalAppointed: true,
    documents: [
      {
        id: 'doc-301',
        title: 'Land Lease Deed (Registered)',
        category: 'Land Lease Deed',
        issueDate: '2023-01-10',
        expiryDate: '2027-01-09',
        daysRemaining: 71,
        status: 'EXPIRING_SOON',
        mandatedYears: 30
      },
      {
        id: 'doc-302',
        title: 'State Government NOC for Site Shifting',
        category: 'Affiliation Order',
        issueDate: '2026-06-15',
        expiryDate: '2027-06-14',
        daysRemaining: 227,
        status: 'VALID'
      }
    ],
    undertakings: [
      {
        id: 'und-203',
        applicationId: 'app-003',
        institutionName: 'Doon Valley College of Engineering & Technology',
        region: 'Northern (Kanpur)',
        title: 'Construction of 200m Concrete Pucca Approach Road',
        conditionDescription: 'Submit PWD executive engineer completion certificate for all-weather approach road to new campus.',
        stipulatedDays: 120,
        assignedDate: '2026-07-01',
        dueDate: '2026-10-29',
        daysRemaining: -1,
        status: 'OVERDUE_ESCALATED',
        escalationTier: 1,
        punitiveRisk: 'Site change permission revoked and existing campus barred from fresh admissions'
      }
    ],
    auditTrail: [
      {
        id: 'aud-004',
        timestamp: '2026-10-18 10:00',
        actorName: 'Member Secretary AICTE',
        actorRole: 'BUREAU_OFFICER',
        action: 'Referred to Standing Appellate Committee (SAC)',
        stageFrom: 'EVC Inspection Completed',
        stageTo: 'SAC / SHC Review',
        remarks: 'Appeal filed by institute management against EVC report observations on boundary wall and title deed.',
        verificationHash: 'SHA256:77bc09912aa...'
      }
    ]
  },
  {
    id: 'app-004',
    applicationNumber: 'AICTE/SR/2026/1-6382911',
    institutionName: 'Madras Metropolitan School of Management (PGDM)',
    permanentId: '1-5120938',
    region: 'Southern (Chennai)',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'Extension of Approval (EoA)',
    category: 'Management (MBA/PGDM)',
    academicYear: '2026-2027',
    currentStage: 'Approved (LoA Issued)',
    submittedDate: '2026-09-05',
    lastUpdatedDate: '2026-10-18',
    stageDueDate: '2026-10-20',
    daysInCurrentStage: 5,
    prescribedSlaDays: 15,
    urgency: 'NORMAL',
    responsibleOfficer: 'Dr. C. Shanmugam (RO Chennai)',
    assignedDesk: 'Desk-01 (Management Programs)',
    requiresEvc: false,
    requiresSac: false,
    scrutinyScore: 98,
    scrutinyDeficiencies: [],
    revertCount: 0,
    revertReasons: [],
    landAreaAcres: 2.1,
    builtUpAreaSqM: 6500,
    proposedIntake: 180,
    facultyCount: 18,
    principalAppointed: true,
    documents: [
      {
        id: 'doc-401',
        title: 'Land Ownership Sale Deed (Perpetual)',
        category: 'Land Lease Deed',
        issueDate: '2010-02-15',
        expiryDate: '2099-12-31',
        daysRemaining: 26725,
        status: 'VALID',
        mandatedYears: 30
      },
      {
        id: 'doc-402',
        title: 'Fire Safety Certificate',
        category: 'Fire Safety Certificate',
        issueDate: '2026-02-10',
        expiryDate: '2027-02-09',
        daysRemaining: 102,
        status: 'VALID'
      }
    ],
    undertakings: [
      {
        id: 'und-204',
        applicationId: 'app-004',
        institutionName: 'Madras Metropolitan School of Management (PGDM)',
        region: 'Southern (Chennai)',
        title: 'Subscription to 5 International Scopus Indexed Business Journals',
        conditionDescription: 'Submit invoice and live login credentials for 5 Scopus peer-reviewed journals within 45 days.',
        stipulatedDays: 45,
        assignedDate: '2026-10-18',
        dueDate: '2026-12-02',
        daysRemaining: 33,
        status: 'PENDING_SUBMISSION',
        escalationTier: 0,
        punitiveRisk: 'Warning notice issued in next academic audit'
      }
    ],
    auditTrail: [
      {
        id: 'aud-005',
        timestamp: '2026-10-18 17:30',
        actorName: 'Dr. C. Shanmugam',
        actorRole: 'REGIONAL_OFFICER',
        action: 'Letter of Approval (LoA) Issued',
        stageFrom: 'Executive Approval',
        stageTo: 'Approved (LoA Issued)',
        remarks: 'All APH 2026-27 norms satisfied. Extension of Approval granted for PGDM intake of 180 seats.',
        verificationHash: 'SHA256:399cbaa01123e...'
      }
    ]
  },
  {
    id: 'app-005',
    applicationNumber: 'AICTE/ER/2026/1-8930194',
    institutionName: 'Bhubaneswar Technical Institute & Polytech',
    permanentId: '1-6291045',
    region: 'Eastern (Kolkata)',
    state: 'Odisha',
    city: 'Bhubaneswar',
    type: 'Conversion to Degree',
    category: 'Engineering & Technology',
    academicYear: '2026-2027',
    currentStage: 'Preliminary Scrutiny',
    submittedDate: '2026-10-10',
    lastUpdatedDate: '2026-10-28',
    stageDueDate: '2026-10-25',
    daysInCurrentStage: 18,
    prescribedSlaDays: 15,
    urgency: 'OVERDUE',
    responsibleOfficer: 'Sri. B. Roy (RO Kolkata)',
    assignedDesk: 'Desk-03 (Polytechnic to Degree)',
    requiresEvc: true,
    requiresSac: false,
    scrutinyScore: 54,
    scrutinyDeficiencies: ['Building plan approval not signed by Town & Country Planning Directorate', 'Lease deed expired on 2026-09-30'],
    revertCount: 0,
    revertReasons: [],
    landAreaAcres: 4.8,
    builtUpAreaSqM: 11200,
    proposedIntake: 240,
    facultyCount: 15,
    principalAppointed: false,
    documents: [
      {
        id: 'doc-501',
        title: 'Land Lease Deed (Govt of Odisha)',
        category: 'Land Lease Deed',
        issueDate: '1996-10-01',
        expiryDate: '2026-09-30',
        daysRemaining: -30,
        status: 'EXPIRED',
        mandatedYears: 30
      },
      {
        id: 'doc-502',
        title: 'Building Safety Certificate',
        category: 'Building Safety NOC',
        issueDate: '2024-03-12',
        expiryDate: '2027-03-11',
        daysRemaining: 132,
        status: 'VALID'
      }
    ],
    undertakings: [
      {
        id: 'und-205',
        applicationId: 'app-005',
        institutionName: 'Bhubaneswar Technical Institute & Polytech',
        region: 'Eastern (Kolkata)',
        title: 'Appointment of Regular Qualified Principal through Selection Committee',
        conditionDescription: 'AICTE mandate requires qualified Professor as Principal with PhD. Currently held under interim charge.',
        stipulatedDays: 90,
        assignedDate: '2026-07-20',
        dueDate: '2026-10-18',
        daysRemaining: -12,
        status: 'OVERDUE_ESCALATED',
        escalationTier: 3,
        punitiveRisk: 'Immediate Show Cause Notice for admission stoppage'
      }
    ],
    auditTrail: [
      {
        id: 'aud-006',
        timestamp: '2026-10-10 09:30',
        actorName: 'Registrar, Bhubaneswar Tech',
        actorRole: 'INSTITUTION_HEAD',
        action: 'Application Submitted',
        stageFrom: 'Application Submitted',
        stageTo: 'Preliminary Scrutiny',
        remarks: 'Application submitted for conversion from Diploma to Degree Engineering.',
        verificationHash: 'SHA256:923fa123bce4...'
      }
    ]
  },
  {
    id: 'app-006',
    applicationNumber: 'AICTE/NW/2026/1-3401928',
    institutionName: 'Chandigarh Royal School of Architecture & Design',
    permanentId: '1-7892301',
    region: 'North-West (Chandigarh)',
    state: 'Punjab',
    city: 'Mohali',
    type: 'New Technical Institution',
    category: 'Architecture & Planning',
    academicYear: '2026-2027',
    currentStage: 'EVC Inspection Completed',
    submittedDate: '2026-08-20',
    lastUpdatedDate: '2026-10-27',
    stageDueDate: '2026-11-05',
    daysInCurrentStage: 7,
    prescribedSlaDays: 14,
    urgency: 'NORMAL',
    responsibleOfficer: 'Dr. Manjeet Singh (RO Chandigarh)',
    assignedDesk: 'Desk-05 (Architecture & Arts)',
    requiresEvc: true,
    requiresSac: false,
    scrutinyScore: 88,
    scrutinyDeficiencies: [],
    revertCount: 0,
    revertReasons: [],
    landAreaAcres: 2.8,
    builtUpAreaSqM: 9100,
    proposedIntake: 80,
    facultyCount: 14,
    principalAppointed: true,
    documents: [
      {
        id: 'doc-601',
        title: 'Land Lease Deed (Registered 99 Yrs)',
        category: 'Land Lease Deed',
        issueDate: '2021-08-01',
        expiryDate: '2120-07-31',
        daysRemaining: 34240,
        status: 'VALID',
        mandatedYears: 30
      },
      {
        id: 'doc-602',
        title: 'Council of Architecture (CoA) In-Principle Clearance',
        category: 'Affiliation Order',
        issueDate: '2026-07-15',
        expiryDate: '2027-07-14',
        daysRemaining: 257,
        status: 'VALID'
      }
    ],
    undertakings: [
      {
        id: 'und-206',
        applicationId: 'app-006',
        institutionName: 'Chandigarh Royal School of Architecture & Design',
        region: 'North-West (Chandigarh)',
        title: 'Setting up Material Testing Lab & Model Making Workshop',
        conditionDescription: 'Installation of universal testing machine and CAD drafting workstation lab.',
        stipulatedDays: 60,
        assignedDate: '2026-09-10',
        dueDate: '2026-11-09',
        daysRemaining: 10,
        status: 'SUBMITTED_FOR_VERIFICATION',
        submissionEvidence: {
          uploadedAt: '2026-10-26 14:20',
          description: 'Supplied and installed 40 CAD terminals and universal testing machine with geo-tagged images and tax invoice.',
          fileName: 'CRSA_CAD_Workshop_Commissioning_Report.pdf',
          affidavitNotaryNo: 'NOT/PB/2026/89410'
        },
        escalationTier: 0,
        punitiveRisk: 'Deferred LoA until equipment inspection'
      }
    ],
    evcRecord: {
      id: 'evc-302',
      applicationId: 'app-006',
      institutionName: 'Chandigarh Royal School of Architecture & Design',
      region: 'North-West (Chandigarh)',
      type: 'PHYSICAL_ON_SITE',
      scheduledDate: '2026-10-20',
      deadlineDate: '2026-10-24',
      daysRemaining: 0,
      status: 'REPORT_SUBMITTED',
      reportSummary: 'EVC physical inspection conducted on 20th Oct 2026. Facilities found compliant with APH 2026 norms.',
      overallScore: 89,
      experts: [
        {
          id: 'exp-4',
          name: 'Prof. Gurinderjit Singh',
          designation: 'Head of Architecture',
          organization: 'CCA Chandigarh',
          specialization: 'Sustainable Architecture',
          contactEmail: 'gurinder.cca@gov.in',
          status: 'CONFIRMED'
        },
        {
          id: 'exp-5',
          name: 'Dr. Neha Batra',
          designation: 'Professor of Urban Planning',
          organization: 'SPA New Delhi',
          specialization: 'Town Planning & By-laws',
          contactEmail: 'n.batra@spa.ac.in',
          status: 'CONFIRMED'
        }
      ],
      checklistFindings: [
        { item: 'Studios and Drafting Hall Area', status: 'COMPLIANT', aphNorm: '120 sq.m per division', observedValue: '140 sq.m per studio verified' },
        { item: 'Fire safety & Emergency exits', status: 'COMPLIANT', aphNorm: '2 fire staircases required', observedValue: 'Verified with illuminated signage' }
      ]
    },
    auditTrail: [
      {
        id: 'aud-007',
        timestamp: '2026-10-21 16:30',
        actorName: 'Prof. Gurinderjit Singh',
        actorRole: 'COMMITTEE_MEMBER',
        action: 'EVC Inspection Report Submitted',
        stageFrom: 'EVC Scheduled',
        stageTo: 'EVC Inspection Completed',
        remarks: 'Field inspection completed successfully with geo-tagged video recordings. Clear recommendation for grant of approval.',
        verificationHash: 'SHA256:66ef0129bc...'
      }
    ]
  },
  {
    id: 'app-007',
    applicationNumber: 'AICTE/SC/2026/1-4920194',
    institutionName: 'Telangana Institute of Emerging Tech (AI & ML)',
    permanentId: '1-8402911',
    region: 'South-Central (Hyderabad)',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Introduction of Supernumerary Seats',
    category: 'Computer Applications (MCA)',
    academicYear: '2026-2027',
    currentStage: 'Executive Approval',
    submittedDate: '2026-09-18',
    lastUpdatedDate: '2026-10-26',
    stageDueDate: '2026-11-01',
    daysInCurrentStage: 4,
    prescribedSlaDays: 7,
    urgency: 'NORMAL',
    responsibleOfficer: 'Dr. G. Ramana (RO Hyderabad)',
    assignedDesk: 'Desk-06 (Autonomous Institutions)',
    requiresEvc: false,
    requiresSac: false,
    scrutinyScore: 95,
    scrutinyDeficiencies: [],
    revertCount: 0,
    revertReasons: [],
    landAreaAcres: 6.0,
    builtUpAreaSqM: 16000,
    proposedIntake: 120,
    facultyCount: 16,
    principalAppointed: true,
    documents: [
      {
        id: 'doc-701',
        title: 'Land Ownership Registry Deed',
        category: 'Land Lease Deed',
        issueDate: '2015-01-01',
        expiryDate: '2099-01-01',
        daysRemaining: 26361,
        status: 'VALID',
        mandatedYears: 30
      }
    ],
    undertakings: [],
    auditTrail: [
      {
        id: 'aud-008',
        timestamp: '2026-10-26 11:20',
        actorName: 'Dr. G. Ramana',
        actorRole: 'REGIONAL_OFFICER',
        action: 'Forwarded for Executive Clearance',
        stageFrom: 'Preliminary Scrutiny',
        stageTo: 'Executive Approval',
        remarks: 'Autonomous institution with NBA accreditation. Forwarded for direct LoA issuance for 15% supernumerary seats.',
        verificationHash: 'SHA256:ab1234cdee...'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'notif-1',
    timestamp: '2026-10-30 06:15',
    type: 'UNDERTAKING_OVERDUE',
    tier: 3,
    targetRole: ['BUREAU_OFFICER', 'REGIONAL_OFFICER'],
    title: 'Tier-3 Escalation: Principal Appointment Overdue (12 Days)',
    message: 'Bhubaneswar Technical Institute & Polytech has breached statutory 90-day deadline for appointing regular Principal.',
    applicationId: 'app-005',
    institutionName: 'Bhubaneswar Technical Institute & Polytech',
    isRead: false,
    actionRequired: 'Issue formal Show-Cause Notice & seat reduction under APH Sec 4.12'
  },
  {
    id: 'notif-2',
    timestamp: '2026-10-30 05:40',
    type: 'DOCUMENT_EXPIRY',
    tier: 2,
    targetRole: ['REGIONAL_OFFICER', 'INSTITUTION_HEAD'],
    title: 'Urgent: Land Lease Expired for Bhubaneswar Tech',
    message: 'Registered Lease Deed expired on 30-Sep-2026. Renewal deed not verified within stipulated cure period.',
    applicationId: 'app-005',
    institutionName: 'Bhubaneswar Technical Institute & Polytech',
    isRead: false,
    actionRequired: 'Submit registered 30-year lease extension deed immediately'
  },
  {
    id: 'notif-3',
    timestamp: '2026-10-29 18:30',
    type: 'SLA_BREACH',
    tier: 2,
    targetRole: ['REGIONAL_OFFICER', 'COMMITTEE_MEMBER'],
    title: 'Stage SLA Exceeded: Bangalore Global Institute Re-Scrutiny',
    message: 'Re-Scrutiny clarification pending for 8 days against 7 days SLA. Automatic escalation triggered to Regional Officer.',
    applicationId: 'app-002',
    institutionName: 'Bangalore Global Institute of Pharmacy & Research',
    isRead: false,
    actionRequired: 'Review submitted CPCSEA animal house papers or issue final deficiency revert'
  },
  {
    id: 'notif-4',
    timestamp: '2026-10-29 11:00',
    type: 'EVC_REMINDER',
    tier: 1,
    targetRole: ['COMMITTEE_MEMBER', 'REGIONAL_OFFICER'],
    title: 'EVC Inspection Scheduled in 3 Days: Somaiya SIAT',
    message: 'Physical on-site inspection committee of 3 experts confirmed for 02-Nov-2026 at Mumbai campus.',
    applicationId: 'app-001',
    institutionName: 'Somaiya Institute of Advanced Technology & AI',
    isRead: true,
    actionRequired: 'Download inspection docket and biometric attendance kit'
  },
  {
    id: 'notif-5',
    timestamp: '2026-10-28 14:00',
    type: 'UPCOMING_DEADLINE',
    tier: 1,
    targetRole: ['INSTITUTION_HEAD', 'REGIONAL_OFFICER'],
    title: 'Fire Safety Certificate Expiring in 10 Days',
    message: 'Somaiya Institute Fire NOC expires on 09-Nov-2026. Renewal must be uploaded to avoid compliance blockage.',
    applicationId: 'app-001',
    institutionName: 'Somaiya Institute of Advanced Technology & AI',
    isRead: true,
    actionRequired: 'Upload renewed Fire Safety certificate from Municipal Fire Brigade'
  }
];
