import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight, Sparkles, Eye, EyeOff, ChevronLeft } from 'lucide-react';

export const TrainingLoginPage: React.FC = () => {
  const [email, setEmail] = useState('training.demo@skilltrack.demo');
  const [password, setPassword] = useState('Demo@123');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await login(email, password, 'training_provider');
      navigate('/training/dashboard');
    } catch (err: any) { setError(err?.message || 'Invalid credentials.'); }
    finally { setSubmitting(false); }
  };

  const quickDemo = async () => {
    setError(null); setSubmitting(true);
    try {
      await login('training.demo@skilltrack.demo', 'Demo@123', 'training_provider');
      navigate('/training/dashboard');
    } catch (err: any) { setError(err?.message || 'Login failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition mb-8 group">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />Back to Portal Gateway
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
          <div className="p-7 sm:p-8">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-400/10 border border-teal-400/30 mb-4">
                <GraduationCap className="w-7 h-7 text-teal-400" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-1">Training Provider / ITI</div>
              <h2 className="text-xl font-black text-white">Institution Access Portal</h2>
              <p className="text-xs text-slate-500 mt-1">Principals, Center Heads & Placement Officers</p>
            </div>

            <div className="flex items-center justify-between mb-5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Portal 2 · Institution Scoped</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/15 text-teal-300 border border-teal-400/30">TRAINING PROVIDER</span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/20 border border-red-800/40 text-red-300 text-xs flex items-start gap-2 slide-up">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Institution Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition"
                    placeholder="training.demo@skilltrack.demo" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition shadow-lg disabled:opacity-50 mt-2">
                {submitting ? <><span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />Verifying…</> : <><span>Access Training Portal</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                <span>Demo Quick Access</span><span className="text-teal-400 font-semibold">1-Click</span>
              </div>
              <button onClick={quickDemo} disabled={submitting}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/70 border border-teal-500/20 rounded-xl hover:border-teal-500/40 hover:bg-slate-800 transition group">
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Suresh Gokhale (Center Head)</div>
                  <div className="text-[11px] text-slate-500 font-mono">training.demo@skilltrack.demo · Demo@123</div>
                </div>
                <Sparkles className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="mt-5 text-center text-xs text-slate-600">
              <div className="mb-2">Switch portal:</div>
              <div className="flex justify-center gap-3">
                {[['Government', '/government/login'], ['Employer', '/employer/login'], ['Trainee', '/trainee/login']].map(([label, path]) => (
                  <Link key={path} to={path} className="text-indigo-400 hover:text-indigo-300 hover:underline transition">{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
