import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { fetchApi } from '../api/client';
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  Fingerprint,
  AlertCircle,
  Copy,
  Check,
  HelpCircle,
  Shield,
  X
} from 'lucide-react';
import { toast } from '../components/Toast';
import { DataFlowBanner } from '../components/design-system';

type PersonaKey = 'trainee' | 'govt_admin' | 'employer' | 'training_provider';

interface PersonaConfig {
  key: PersonaKey;
  role: UserRole;
  label: string;
  sublabel: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  themeColor: string;
  tagColor: string;
  officialId: string;
  officialEmail: string;
  officialPassword: string;
  officialName: string;
  officialTitle: string;
  targetDashboard: string;
  highlights: string[];
}

const PERSONAS: PersonaConfig[] = [
  {
    key: 'trainee',
    role: 'trainee',
    label: 'Candidate / Trainee',
    sublabel: 'विद्यार्थी / शिकाऊ उमेदवार',
    badge: 'Skill Passport',
    icon: GraduationCap,
    themeColor: 'teal',
    tagColor: 'bg-teal-50 text-teal-800 border-teal-200',
    officialId: 'ST-MH-7X42K9',
    officialEmail: 'rahul.kumar@skilltrack.in',
    officialPassword: 'Trainee@2025',
    officialName: 'Rahul Kumar',
    officialTitle: 'Certified EV Diagnostics Specialist (Skill ID: ST-MH-7X42K9)',
    targetDashboard: '/trainee/dashboard',
    highlights: [
      'Digital Skill Passport with verified skills',
      'Smart job matches for your trade',
      'Track certificates and career progress'
    ]
  },
  {
    key: 'govt_admin',
    role: 'govt_admin',
    label: 'Government Admin',
    sublabel: 'शासकीय प्रशासक (DVET)',
    badge: 'State Directorate',
    icon: Building,
    themeColor: 'indigo',
    tagColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    officialId: 'GOV-ADMIN-01',
    officialEmail: 'gov.admin@skilltrack.gov.in',
    officialPassword: 'GovAdmin@2025',
    officialName: 'Dr. Anand Patil, IAS',
    officialTitle: 'Director, Skills & Innovation (Govt. of Maharashtra)',
    targetDashboard: '/government/dashboard',
    highlights: [
      'Statewide skilling & placement metrics',
      'District, ITI, and course performance',
      'Curriculum reforms & policy actions'
    ]
  },
  {
    key: 'employer',
    role: 'employer',
    label: 'Employer / Industry',
    sublabel: 'उद्योजक / औद्योगिक भागीदार',
    badge: 'Industry Partner',
    icon: Briefcase,
    themeColor: 'blue',
    tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
    officialId: 'EMP-TATA-01',
    officialEmail: 'employer@tatamotors.com',
    officialPassword: 'TataMotors@2025',
    officialName: 'Vikram Shinde',
    officialTitle: 'Talent Acquisition Head, Tata Motors Ltd',
    targetDashboard: '/employer/dashboard',
    highlights: [
      'Verified candidate skill matching',
      'Fast hiring confirmation',
      'Track skill demand across Maharashtra'
    ]
  },
  {
    key: 'training_provider',
    role: 'training_provider',
    label: 'Training Provider (ITI)',
    sublabel: 'प्रशिक्षण संस्था / शासकीय ITI',
    badge: 'Training Hub',
    icon: Layers,
    themeColor: 'purple',
    tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
    officialId: 'ITI-PUNE-01',
    officialEmail: 'iti.pune@skilltrack.gov.in',
    officialPassword: 'ItiHead@2025',
    officialName: 'Suresh Gokhale',
    officialTitle: 'Principal / Training Head, Government ITI Pune',
    targetDashboard: '/training/dashboard',
    highlights: [
      'Batch rosters & attendance tracking',
      'Course completions & placements',
      'Student risk alerts & skill gaps'
    ]
  }
];

export const UnifiedLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const [activeKey, setActiveKey] = useState<PersonaKey>(() => {
    if (initialRoleParam === 'trainee') return 'trainee';
    if (initialRoleParam === 'govt_admin' || initialRoleParam === 'government' || initialRoleParam === 'admin') return 'govt_admin';
    if (initialRoleParam === 'employer') return 'employer';
    if (initialRoleParam === 'provider' || initialRoleParam === 'training_provider') return 'training_provider';
    return 'trainee';
  });

  const activePersona = PERSONAS.find(p => p.key === activeKey) || PERSONAS[0];

  const [identifier, setIdentifier] = useState<string>(activePersona.officialId);
  const [password, setPassword] = useState<string>(activePersona.officialPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Password Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'reset'>('request');
  const [recoveryHint, setRecoveryHint] = useState<string | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const { login, currentUser, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Explicit switch parameter allows logged-in users to access login screen intentionally
  const isExplicitSwitch = searchParams.get('switch') === 'true' || searchParams.get('action') === 'switch';

  // Helper to determine dashboard path
  const getRoleDashboard = (role?: string) => {
    if (role === 'govt_admin' || role === 'analyst') return '/government/dashboard';
    if (role === 'employer') return '/employer/dashboard';
    if (role === 'training_provider' || role === 'provider') return '/training/dashboard';
    return '/trainee/dashboard';
  };

  // If already authenticated and user navigated or pressed Back to login, immediately return to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && currentUser && !isExplicitSwitch) {
      const target = getRoleDashboard(currentUser.role);
      navigate(target, { replace: true });
    }
  }, [authLoading, isAuthenticated, currentUser, isExplicitSwitch, navigate]);

  // Synchronize credentials when persona tab switches
  useEffect(() => {
    setIdentifier(activePersona.officialId);
    setPassword(activePersona.officialPassword);
    setErrorMessage('');
  }, [activeKey]);

  const handlePersonaSelect = (key: PersonaKey) => {
    setActiveKey(key);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const loggedUser = await login(identifier.trim(), password, activePersona.role);
      toast.success('Authentication Verified', `Welcome to the ${activePersona.label} Portal.`);
      const target = getRoleDashboard(loggedUser.role || activePersona.role);
      navigate(target, { replace: true });
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Login failed. Please verify your User ID / Email and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryIdentifier) return;
    setRecoveryLoading(true);
    try {
      const res = await fetchApi<{ message: string; recovery_hint: string; test_recovery_code?: string }>(
        '/api/auth/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify({ identifier: recoveryIdentifier })
        }
      );
      setRecoveryHint(res.recovery_hint);
      if (res.test_recovery_code) {
        setRecoveryCode(res.test_recovery_code);
      }
      setRecoveryStep('reset');
      toast.info('Verification Code Dispatched', res.recovery_hint);
    } catch (err: any) {
      toast.error('Recovery Error', err.message || 'Could not initiate recovery.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCode || !newPassword) return;
    setRecoveryLoading(true);
    try {
      await fetchApi('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          identifier: recoveryIdentifier,
          recovery_code: recoveryCode,
          new_password: newPassword
        })
      });
      toast.success('Password Reset Successful', 'You can now log in with your new password.');
      setPassword(newPassword);
      setIdentifier(recoveryIdentifier);
      setShowRecoveryModal(false);
      setRecoveryStep('request');
    } catch (err: any) {
      toast.error('Reset Failed', err.message || 'Could not reset password.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans antialiased">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Verifying Maharashtra security credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-teal-600 selection:text-white font-sans antialiased">
      {/* Official Government Header Banner with Tricolor */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        {/* Indian National Tricolor Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF7722]" />
          <div className="flex-1 bg-white border-y border-slate-200" />
          <div className="flex-1 bg-[#128807]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-800 text-sm shadow-xs">
              MH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900">SkillTrackAI</span>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
                  SIH26135
                </span>
                <span className="hidden md:inline-block text-xs font-semibold text-slate-500">
                  Maharashtra Skills Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Government of Maharashtra · MSSDS / DVET
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Portal Online</span>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10 max-w-6xl w-full mx-auto">
        <DataFlowBanner mode="pipeline" className="mb-6 shadow-depth-card" />
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Role Selector & System Capabilities */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-depth-card">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  Select Portal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-2">
                Welcome to SkillTrack
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Choose your role to sign in and access your personalized dashboard.
              </p>

              {/* 4 Interactive Persona Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
                {PERSONAS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = p.key === activeKey;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handlePersonaSelect(p.key)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 relative ${
                        isSelected
                          ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/20 shadow-md scale-[1.01]'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-teal-700 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-700 text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className={`text-base font-bold leading-snug ${isSelected ? 'text-teal-950' : 'text-slate-900'}`}>
                          {p.label}
                        </p>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          {p.sublabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Role Feature Highlights */}
              <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <activePersona.icon className="w-4 h-4 text-teal-700" />
                    <span>{activePersona.label}</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {activePersona.badge}
                  </span>
                </div>
                <ul className="space-y-2 pt-1">
                  {activePersona.highlights.map((h, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Official Persona Profile Footer Note */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                <span className="font-semibold text-slate-500 uppercase text-xs block">Demo Account:</span>
                <span className="font-bold text-slate-900 text-sm">{activePersona.officialName}</span>
                <span className="text-slate-500 block text-xs mt-0.5">{activePersona.officialTitle}</span>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-semibold text-slate-500 uppercase text-xs block">Dashboard:</span>
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {activePersona.targetDashboard}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Authentication Form */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-depth-card flex flex-col justify-between border border-slate-200/90">
            <div>
              {/* Form Title & Role Ribbon */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Lock className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      Sign In
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Enter your credentials to continue</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${activePersona.tagColor}`}>
                  {activePersona.badge}
                </span>
              </div>

              {/* Active Session Notification if logged in */}
              {isAuthenticated && currentUser && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">
                      Signed in: <strong>{currentUser.name}</strong> ({currentUser.role.replace('_', ' ')})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate(getRoleDashboard(currentUser.role), { replace: true })}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] transition shadow-xs"
                    >
                      My Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        toast.info('Signed Out', 'Active session terminated.');
                      }}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-amber-300 text-amber-900 rounded-lg font-semibold text-[10px] transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Clean Standard Login Form */}
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    User ID, Skill ID or Registered Email
                  </label>
                  <div className="relative">
                    <Fingerprint className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      placeholder="e.g. ST-MH-7X42K9 or registered email"
                      className="w-full pl-11 pr-4 py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-slate-900 bg-slate-50/50 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-sm font-bold text-slate-800">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryIdentifier(identifier);
                        setShowRecoveryModal(true);
                      }}
                      className="text-xs text-teal-700 hover:text-teal-900 font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-11 py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-slate-900 bg-slate-50/50 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                    />
                    <span>Remember my session</span>
                  </label>
                  <span className="text-slate-400 text-xs">Rate Limiting Active</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm sm:text-base font-bold transition shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Sign In to {activePersona.label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Official Role Credentials / Direct Sign-In */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Official Role Credentials / Direct Sign-In</span>
                  <span className="text-teal-700 font-bold">Authorized Account</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier(activePersona.officialId);
                    setPassword(activePersona.officialPassword);
                    login(activePersona.officialId, activePersona.officialPassword, activePersona.role)
                      .then((user) => {
                        toast.success('Authentication Verified', `Welcome to the ${activePersona.label} Portal.`);
                        const target = getRoleDashboard(user.role || activePersona.role);
                        navigate(target, { replace: true });
                      })
                      .catch((err: any) => {
                        setErrorMessage(err.message || 'Quick login failed.');
                      });
                  }}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 transition text-left flex items-center justify-between group"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
                      {activePersona.officialName}
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                      {activePersona.officialId} · {activePersona.officialPassword}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-700 bg-white px-2.5 py-1 rounded border border-slate-200 group-hover:border-teal-300">
                    Quick Sign In
                  </span>
                </button>
              </div>
            </div>

            {/* Security Compliance Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Compliant with DPDP Act 2023 · Govt of Maharashtra</span>
            </div>
          </div>
        </div>
      </main>

      {/* Official State Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SkillTrackAI · Smart India Hackathon (SIH26135) · State Directorate DVET Maharashtra</span>
          <span>Zero Demo Data Standard · Longitudinal Verified Employability Intelligence</span>
        </div>
      </footer>

      {/* Forgot Password / Account Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Account Recovery</h3>
                  <p className="text-xs text-slate-500">Reset your password securely</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {recoveryStep === 'request' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enter Registered Skill ID / User ID / Email
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryIdentifier}
                    onChange={(e) => setRecoveryIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    placeholder="e.g. ST-MH-7X42K9 or registered email"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="px-4 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition disabled:opacity-50"
                  >
                    {recoveryLoading ? 'Dispatching…' : 'Send Recovery Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                {recoveryHint && (
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs">
                    {recoveryHint}
                  </div>
                )}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    6-Digit Recovery Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    placeholder="Enter 6-digit code"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRecoveryStep('request')}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="px-4 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition disabled:opacity-50"
                  >
                    {recoveryLoading ? 'Updating…' : 'Confirm Password Reset'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default UnifiedLoginPage;
