import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api/client';
import {
  Award,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle2,
  KeyRound,
  FileText
} from 'lucide-react';
import { toast } from '../components/Toast';

export const TraineeLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('ST-MH-7X42K9');
  const [password, setPassword] = useState('Trainee@2025');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Forgot password modal
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'reset'>('request');
  const [recoveryHint, setRecoveryHint] = useState<string | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(identifier, password, 'trainee');
      toast.success('Authentication Successful', 'Welcome to your SkillTrackAI Trainee Portal.');
      navigate('/trainee/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Authentication failed.');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative selection:bg-teal-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-teal-50 via-slate-50 to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Navigation back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition mb-6 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Government Portal Gateway
        </Link>

        {/* Authentication Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Header Tricolor Accent */}
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

          <div className="p-7 sm:p-8">
            {/* Header info */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 mb-3 shadow-inner">
                <Award className="w-7 h-7 text-teal-700" />
              </div>
              <div className="text-[11px] font-bold tracking-wider text-teal-800 uppercase">
                Government of Maharashtra · SDED / DVET
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Trainee Employability Portal
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Official access for certified candidates & vocational trainees
              </p>
            </div>

            {/* Privacy-Preserving Skill ID Banner */}
            <div className="mb-5 p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="text-slate-700 text-[11px]">Canonical Skill ID:</span>
              </div>
              <span className="font-mono font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-300 text-xs">
                ST-MH-7X42K9
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Skill ID / Registered Email / Mobile
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
                    placeholder="e.g. ST-MH-7X42K9 or registered email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryIdentifier(identifier);
                      setShowRecoveryModal(true);
                    }}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 transition shadow-md shadow-teal-700/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying Official Record…
                    </>
                  ) : (
                    <>
                      <span>Sign In to Trainee Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick evaluation credentials */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Evaluation Quick Sign-In</span>
                <span className="text-teal-700 font-bold">1-Click Authorized</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('ST-MH-7X42K9');
                  setPassword('Trainee@2025');
                  login('ST-MH-7X42K9', 'Trainee@2025', 'trainee').then(() => navigate('/trainee/dashboard'));
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 transition text-left group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                    Rahul Kumar (Certified EV Specialist)
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    ST-MH-7X42K9 · Trainee@2025
                  </div>
                </div>
                <span className="text-[11px] font-bold text-teal-700 bg-white px-2 py-1 rounded border border-slate-200 group-hover:border-teal-300">
                  Select
                </span>
              </button>
            </div>

            {/* Switch Portal Navigation */}
            <div className="mt-5 text-center text-xs text-slate-500">
              <div>Switch Ecosystem Portal:</div>
              <div className="flex justify-center gap-3 mt-1.5 font-medium">
                <Link to="/government/login" className="text-teal-700 hover:underline">Government</Link>
                <span>·</span>
                <Link to="/training/login" className="text-teal-700 hover:underline">Training Provider</Link>
                <span>·</span>
                <Link to="/employer/login" className="text-teal-700 hover:underline">Employer Partner</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Security & DPDP Compliance Footer */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-700" />
          <span>Protected under Digital Personal Data Protection (DPDP) Act 2023 · Govt of Maharashtra</span>
        </div>
      </div>

      {/* Account Recovery / Forgot Password Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Account Recovery</h3>
                <p className="text-xs text-slate-500">Reset your password using verified identifier</p>
              </div>
            </div>

            {recoveryStep === 'request' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Registered Skill ID / Email / Phone
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
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition disabled:opacity-50"
                  >
                    {recoveryLoading ? 'Dispatching…' : 'Send Recovery Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {recoveryHint && (
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800">
                    {recoveryHint}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    6-Digit Recovery Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    placeholder="Enter 6-digit code (e.g. 948216)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition disabled:opacity-50"
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
