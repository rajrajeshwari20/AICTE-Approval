import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '../../context/AppContext';
import { UserRole, Region } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  UserCheck, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register, demoLogin } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('adviser.hq@aicte-india.org');
  const [loginPassword, setLoginPassword] = useState('AikyaTrace@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regRole, setRegRole] = useState<UserRole>('INSTITUTION_HEAD');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRegion, setRegRegion] = useState<Region>('Western (Mumbai)');
  const [regDesignation, setRegDesignation] = useState('Registrar & Head of Institute');
  const [regInstituteName, setRegInstituteName] = useState('');
  const [regPermanentId, setRegPermanentId] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      if (onSuccess) onSuccess();
    } else {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (!declarationAccepted) {
      setRegError('You must accept the statutory declaration under AICTE Act regulations.');
      return;
    }

    const res = register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      region: regRegion,
      designation: regDesignation,
      institutionName: regRole === 'INSTITUTION_HEAD' ? regInstituteName : undefined,
      permanentId: regRole === 'INSTITUTION_HEAD' ? (regPermanentId || `1-${Math.floor(1000000 + Math.random() * 9000000)}`) : undefined
    });

    if (res.success) {
      if (onSuccess) onSuccess();
    } else {
      setRegError(res.error || 'Registration failed. Please check your details.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    demoLogin(role);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Ministry Banner */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">भारत सरकार · Government of India</span>
            <span>|</span>
            <span>शिक्षा मंत्रालय · Ministry of Education</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span>Approval Process Handbook (APH) 2026-27</span>
            <span>·</span>
            <span className="text-amber-400 font-mono">256-bit PKI Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center my-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-slate-850 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          
          {/* Left Column: Branding, Mission & Quick Demo Personas (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-700/80">
            <div>
              {/* Logo & Platform Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md">
                  <Building2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-white font-sans">
                    Aikya<span className="text-amber-400">Trace</span>
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    AICTE Central Portal
                  </div>
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-100 mb-2 leading-snug">
                Unified AICTE Approval Automation & Compliance Sentinel
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Single secure gateway for Technical Institutions, Regional Bureaux, Peer Experts, and the Approval Bureau to manage end-to-end approvals, EVC scheduling, undertakings, and 30-year lease surveillance.
              </p>

              {/* Quick Persona Demo Switcher for Hackathon Judges */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant 1-Click Role Login</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Click any verified persona below to enter immediately:
                </p>

                <div className="space-y-2">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleQuickDemoLogin(user.role)}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/60 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition truncate">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {user.designation}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Complies with APH Section 1.4 Digital Governance norms.</span>
            </div>
          </div>

          {/* Right Column: Interactive Login / Register Tabs (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-800/90 flex flex-col justify-between">
            <div>
              {/* Tab Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl mb-6 border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setLoginError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg font-semibold transition cursor-pointer text-center ${
                    mode === 'LOGIN'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Authorized Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setRegError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg font-semibold transition cursor-pointer text-center ${
                    mode === 'REGISTER'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  New Registration
                </button>
              </div>

              {/* LOGIN MODE */}
              {mode === 'LOGIN' && (
                <div>
                  <div className="mb-5">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Sign In to AICTE AikyaTrace
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter your registered institutional or departmental credentials.
                    </p>
                  </div>

                  {loginError && (
                    <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Official Email ID / Username
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. adviser.hq@aicte-india.org"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Password
                        </label>
                        <span className="text-[11px] text-amber-400 hover:underline cursor-pointer">
                          Forgot Password?
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your security password"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-700 text-amber-500" />
                        <span>Keep me logged in on this terminal</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authenticate & Access Portal</span>
                    </button>
                  </form>
                </div>
              )}

              {/* REGISTER MODE */}
              {mode === 'REGISTER' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Register on AICTE AikyaTrace
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Create an account for technical institutions, regional officers, or peer experts.
                    </p>
                  </div>

                  {regError && (
                    <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                    {/* Role Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Register As:
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setRegRole('INSTITUTION_HEAD');
                            setRegDesignation('Registrar / Director');
                          }}
                          className={`p-2 rounded-lg border text-center cursor-pointer transition ${
                            regRole === 'INSTITUTION_HEAD'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          Institution
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegRole('REGIONAL_OFFICER');
                            setRegDesignation('Regional Officer (RO)');
                          }}
                          className={`p-2 rounded-lg border text-center cursor-pointer transition ${
                            regRole === 'REGIONAL_OFFICER'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          AICTE Official
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegRole('COMMITTEE_MEMBER');
                            setRegDesignation('EVC Peer Committee Expert');
                          }}
                          className={`p-2 rounded-lg border text-center cursor-pointer transition ${
                            regRole === 'COMMITTEE_MEMBER'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          Peer Expert
                        </button>
                      </div>
                    </div>

                    {/* Institution Specific Fields */}
                    {regRole === 'INSTITUTION_HEAD' && (
                      <div className="space-y-3 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Institution Legal Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. National Institute of Tech & Applied Science"
                            value={regInstituteName}
                            onChange={(e) => setRegInstituteName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            AICTE Permanent Institute ID (If Existing)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1-4890219 (or leave blank if new applicant)"
                            value={regPermanentId}
                            onChange={(e) => setRegPermanentId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Authorized Person Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Authorized Person Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. K. Radhakrishnan"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    {/* Official Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Official Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. registrar@institute.edu.in"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Jurisdiction Region
                        </label>
                        <select
                          value={regRegion}
                          onChange={(e) => setRegRegion(e.target.value as Region)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="Western (Mumbai)">Western (Mumbai)</option>
                          <option value="Northern (Kanpur)">Northern (Kanpur)</option>
                          <option value="Southern (Chennai)">Southern (Chennai)</option>
                          <option value="South-Western (Bengaluru)">South-Western (Bengaluru)</option>
                          <option value="Eastern (Kolkata)">Eastern (Kolkata)</option>
                          <option value="Central (Bhopal)">Central (Bhopal)</option>
                          <option value="North-West (Chandigarh)">North-West (Chandigarh)</option>
                          <option value="South-Central (Hyderabad)">South-Central (Hyderabad)</option>
                        </select>
                      </div>
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Statutory Declaration */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declarationAccepted}
                          onChange={(e) => setDeclarationAccepted(e.target.checked)}
                          className="mt-0.5 rounded border-slate-700 text-amber-500"
                          required
                        />
                        <span>
                          I solemnly declare that the institution profile and details furnished herein conform strictly to AICTE Approval Process Handbook (APH) 2026-27 norms.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Complete Registration & Open Dashboard</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[10px] text-slate-500 text-center">
              AikyaTrace Digital Portal · AICTE (New Delhi) · All activities are stamped with legal digital audit hash.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-4 py-3 text-center text-xs text-slate-500">
        © 2026 All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India. All rights reserved.
      </footer>
    </div>
  );
};
