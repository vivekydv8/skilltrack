import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ChevronLeft } from 'lucide-react';

export const GovernmentLoginPage: React.FC = () => {
  const [email, setEmail] = useState('gov.admin@skilltrack.demo');
  const [password, setPassword] = useState('Demo@123');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password, 'govt_admin');
      navigate('/government/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const quickDemo = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await login('gov.admin@skilltrack.demo', 'Demo@123', 'govt_admin');
      navigate('/government/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gov-login-bg flex flex-col min-h-screen">
      {/* Tricolor top bar */}
      <div className="tricolor-bar" />

      {/* Header */}
      <div className="bg-[#1a2e4a] text-white py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 border border-white/20 rounded flex items-center justify-center text-xs font-bold">
            MH
          </div>
          <div>
            <div className="font-semibold text-sm">Government of Maharashtra</div>
            <div className="text-xs text-blue-200">Department of Skills, Employment, Entrepreneurship &amp; Innovation</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">

          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Portal Gateway
          </Link>

          {/* Login Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="bg-[#1a2e4a] text-white px-6 py-5 text-center">
              <div className="text-xs font-semibold text-blue-200 tracking-wider uppercase mb-1">
                Authorized Access Only
              </div>
              <h1 className="text-xl font-bold">SkillTrackAI</h1>
              <p className="text-sm text-blue-200 mt-1">Employability Intelligence System</p>
              <p className="text-xs text-blue-300 mt-0.5">Government of Maharashtra</p>
            </div>

            {/* Portal badge */}
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-2.5 flex items-center justify-between">
              <span className="text-xs text-blue-700 font-medium">Portal: Government Administration</span>
              <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded font-semibold">GOVT ADMIN</span>
            </div>

            <div className="px-6 py-6">
              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Official Email / Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="gov-input w-full pl-9 pr-3"
                      style={{ height: '40px' }}
                      placeholder="gov.officer@maharashtra.gov.in"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="gov-input w-full pl-9 pr-10"
                      style={{ height: '40px' }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="gov-btn-primary w-full justify-center py-2.5"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    'Sign In to Portal'
                  )}
                </button>

                <div className="text-right">
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </form>

              {/* Official Departmental Direct Sign-In */}
              <div className="mt-5 pt-5 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2 font-medium">
                  Authorized Departmental Direct Sign-In
                </div>
                <button
                  type="button"
                  onClick={quickDemo}
                  disabled={submitting}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 hover:border-gray-300 transition text-left"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-800">State Nodal Administrator (DSEI)</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-mono">gov.admin@skilltrack.gov.in · Direct Auth</div>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold">Sign In →</span>
                </button>
              </div>

              {/* Switch portals */}
              <div className="mt-5 text-center text-xs text-gray-500 space-y-2">
                <div>Access other portals:</div>
                <div className="flex justify-center gap-4">
                  {[
                    ['Training Provider', '/training/login'],
                    ['Employer', '/employer/login'],
                    ['Trainee', '/trainee/login']
                  ].map(([label, path]) => (
                    <Link key={path} to={path} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            This portal is for authorized Government of Maharashtra officers only.
            Unauthorized access is prohibited under the IT Act, 2000.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center text-xs text-gray-500">
        Government of Maharashtra · Department of Skills, Employment, Entrepreneurship &amp; Innovation
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Terms &amp; Conditions</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Accessibility</a>
      </footer>
    </div>
  );
};
