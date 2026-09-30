import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Activity,
  ChevronRight
} from 'lucide-react';

const STATS = [
  { value: '75+', label: 'Active Trainees', color: 'text-amber-400' },
  { value: '87.5%', label: 'Placement Rate', color: 'text-emerald-400' },
  { value: '₹21,850', label: 'Avg. Wage / Month', color: 'text-blue-400' },
  { value: '365D', label: 'Longitudinal Tracking', color: 'text-purple-400' },
];

const PORTALS = [
  {
    id: 'government',
    title: 'Government Admin',
    subtitle: 'Directorate of Vocational Education & MSSDS',
    badge: 'State Executive',
    badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    icon: ShieldCheck,
    iconClass: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    borderClass: 'hover:border-amber-500/60',
    glowClass: 'hover:shadow-amber-500/10',
    accentBar: 'from-amber-500 to-orange-500',
    loginUrl: '/government/login',
    demoUser: 'Dr. Anand Patil, IAS',
    demoEmail: 'gov.admin@skilltrack.demo',
    features: ['State Overview KPIs', 'Multi-Level Drill-Down', 'Early Warning Alerts', 'DPDP Audit Trail'],
  },
  {
    id: 'training',
    title: 'Training Provider / ITI',
    subtitle: 'Technical Hubs & Skilling Institutes',
    badge: 'Institution Scoped',
    badgeClass: 'bg-teal-400/15 text-teal-300 border-teal-400/30',
    icon: GraduationCap,
    iconClass: 'text-teal-400',
    iconBg: 'bg-teal-400/10',
    borderClass: 'hover:border-teal-500/60',
    glowClass: 'hover:shadow-teal-500/10',
    accentBar: 'from-teal-500 to-emerald-500',
    loginUrl: '/training/login',
    demoUser: 'Suresh Gokhale',
    demoEmail: 'training.demo@skilltrack.demo',
    features: ['Batch CSV Ingestion', 'Risk Watchlist', 'Placement Tracking', 'Curriculum Insights'],
  },
  {
    id: 'employer',
    title: 'Employer / Industry',
    subtitle: 'Hiring Partners & Enterprise HR',
    badge: 'Industry Partner',
    badgeClass: 'bg-blue-400/15 text-blue-300 border-blue-400/30',
    icon: Briefcase,
    iconClass: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    borderClass: 'hover:border-blue-500/60',
    glowClass: 'hover:shadow-blue-500/10',
    accentBar: 'from-blue-500 to-indigo-500',
    loginUrl: '/employer/login',
    demoUser: 'Vikram Shinde (Tata Motors)',
    demoEmail: 'employer.demo@skilltrack.demo',
    features: ['Skill Matching Engine', 'Job Postings', 'Hiring Confirmations', 'Wage Verification'],
  },
  {
    id: 'trainee',
    title: 'Trainee Portal',
    subtitle: 'Candidate Career Lifecycle',
    badge: 'Self-Service',
    badgeClass: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    icon: Award,
    iconClass: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    borderClass: 'hover:border-emerald-500/60',
    glowClass: 'hover:shadow-emerald-500/10',
    accentBar: 'from-emerald-500 to-green-500',
    loginUrl: '/trainee/login',
    demoUser: 'Rahul Kumar (ST-MH-7X42K9)',
    demoEmail: 'trainee.demo@skilltrack.demo',
    features: ['Skill ID: ST-MH-7X42K9', 'Career Timeline', 'Job Matches', 'DPDP Privacy Rights'],
  },
];

const CONFIDENCE_LEVELS = [
  { label: '🟢 VERIFIED', pct: 38, color: 'bg-emerald-500', desc: 'Employer + Offer Letter / Payslip' },
  { label: '🟡 CORROBORATED', pct: 42, color: 'bg-amber-400', desc: 'Trainee + Employer Match' },
  { label: '🟠 SELF-REPORTED', pct: 20, color: 'bg-orange-400', desc: 'Unilateral Trainee Update' },
];

export const PortalGatewayPage: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans overflow-x-hidden">

      {/* ── Top Government Ribbon ── */}
      <div className="bg-slate-900 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            {/* MH Emblem */}
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-black text-amber-300 text-sm font-serif shadow-inner">
              MH
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Government of Maharashtra
              </div>
              <div className="text-[11px] text-slate-400 leading-none mt-0.5">
                Department of Skills, Employment, Entrepreneurship & Innovation (MSSDS / DVET)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              SIH Problem: <strong className="text-white">SIH26135</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold animate-pulse">
              ● SYNTHETIC / DEMO DATA
            </span>
          </div>
        </div>
        {/* Tricolor accent bar */}
        <div className="tricolor-bar opacity-60" />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        {/* Background dot grid */}
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-700 ${mounted ? 'fade-in' : 'opacity-0'}`}>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>State Employability Intelligence Platform</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-5 leading-none">
            SkillTrack<span className="gradient-text">AI</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
            From snapshot placement claims to an auditable,{' '}
            <span className="text-white font-semibold">longitudinal career intelligence ecosystem</span>{' '}
            powered by{' '}
            <span className="text-amber-300 font-semibold">One Privacy-Preserving Skill ID</span>.
          </p>

          {/* Journey chain */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5 backdrop-blur-sm mb-8 overflow-x-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Full Longitudinal Employability Journey
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-200 flex-nowrap min-w-max mx-auto">
              {['Training', 'Certification', 'Employment', 'Job Relevance', 'Retention', 'Wage Growth', 'Skill Gap Action'].map((stage, i, arr) => (
                <React.Fragment key={stage}>
                  <span className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                    i === arr.length - 1
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-slate-900/80 text-slate-300 border border-slate-700/60'
                  }`}>{stage}</span>
                  {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Skill ID Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs backdrop-blur-sm">
            <span className="text-slate-400">Canonical Pseudonymous Skill ID:</span>
            <code className="font-mono font-bold text-amber-300 text-sm tracking-widest bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700/60">
              ST-MH-7X42K9
            </code>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> DPDP Preserved
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-slate-900/80 border-y border-slate-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map(({ value, label, color }) => (
            <div key={label} className="text-center fade-in">
              <div className={`text-2xl sm:text-3xl font-black tabular-nums ${color}`}>{value}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 Portal Cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Select Authenticated Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            4 Distinct Role-Based Portals
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Each portal is scoped to its stakeholder. Click to enter with one-click demo credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PORTALS.map((portal, idx) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className={`group relative bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-600 ${portal.borderClass} ${portal.glowClass} card-hover hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer`}
                style={{ animationDelay: `${idx * 80}ms` }}
                onClick={() => navigate(portal.loginUrl)}
              >
                {/* Gradient accent top bar */}
                <div className={`h-0.5 w-full bg-gradient-to-r ${portal.accentBar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="p-5 flex-1 flex flex-col">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${portal.iconBg} border border-white/5 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${portal.iconClass}`} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${portal.badgeClass}`}>
                      {portal.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-white/90 mb-0.5">
                    {portal.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium mb-3">{portal.subtitle}</div>

                  {/* Feature list */}
                  <div className="space-y-1.5 flex-1 mb-4">
                    {portal.features.map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <div className={`w-1 h-1 rounded-full ${portal.iconClass.replace('text-', 'bg-')} opacity-70`} />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Demo persona */}
                  <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-2.5 mb-4">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Demo Persona</div>
                    <div className="text-xs font-semibold text-slate-200 truncate">{portal.demoUser}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{portal.demoEmail}</div>
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(portal.loginUrl); }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 bg-slate-800 text-slate-300 group-hover:bg-white group-hover:text-slate-900 border border-slate-700 group-hover:border-transparent shadow-sm`}
                  >
                    <span>Enter {portal.title.split(' ')[0]} Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5 Key Questions ── */}
      <section className="bg-slate-900/60 border-y border-slate-800/60 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
              Core Architectural Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-4">
              Answers 5 Critical Policy Questions
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
              Transforming fragmented training MIS into continuous, explainable employment outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { n: '1', q: 'What Happened?', a: 'Wage employment, self-employment, apprenticeship, or drop-out', color: 'border-indigo-500/30 bg-indigo-950/30', num: 'bg-indigo-500/20 text-indigo-300' },
              { n: '2', q: 'How Sure Are We?', a: '🟢 Verified, 🟡 Corroborated, 🟠 Self-Reported, 🔵 AI-Inferred', color: 'border-emerald-500/30 bg-emerald-950/20', num: 'bg-emerald-500/20 text-emerald-300' },
              { n: '3', q: 'Why Did It Happen?', a: 'Explainable AI: Skill gaps, OEM tech shift, location mismatch', color: 'border-amber-500/30 bg-amber-950/20', num: 'bg-amber-500/20 text-amber-300' },
              { n: '4', q: 'What Next?', a: 'Targeted bridge module, lab hardware, or employer linkage', color: 'border-purple-500/30 bg-purple-950/20', num: 'bg-purple-500/20 text-purple-300' },
              { n: '5', q: 'Did It Work?', a: 'Measure cohort retention at 90D, 180D, and 365D intervals', color: 'border-teal-500/30 bg-teal-950/20', num: 'bg-teal-500/20 text-teal-300' },
            ].map(({ n, q, a, color, num }) => (
              <div key={n} className={`rounded-2xl border p-4 ${color}`}>
                <div className={`w-8 h-8 rounded-full ${num} flex items-center justify-center font-black text-sm mx-auto mb-3`}>{n}</div>
                <h4 className="font-bold text-white text-sm text-center mb-2">{q}</h4>
                <p className="text-[11px] text-slate-400 text-center leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Confidence Engine Visual ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                Section 11 Architecture
              </div>
              <h3 className="text-xl font-bold text-white">Outcome Evidence & Confidence Engine</h3>
              <p className="text-sm text-slate-400 mt-1">Never treats AI inference as equivalent to employer-confirmed verification.</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Live Calibration</span>
            </div>
          </div>

          {/* Stacked bar */}
          <div className="w-full h-6 rounded-full overflow-hidden flex mb-4 bg-slate-800">
            {CONFIDENCE_LEVELS.map(({ pct, color, label }) => (
              <div key={label} style={{ width: `${pct}%` }} className={`${color} h-full transition-all duration-1000`} title={label} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {CONFIDENCE_LEVELS.map(({ label, pct, color, desc }) => (
              <div key={label} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="font-bold text-white">{label} ({pct}%)</span>
                </div>
                <p className="text-slate-400 text-[11px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="bg-slate-900/50 border-t border-slate-800/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: Lock, label: 'DPDP Compliant', sub: 'Privacy by design', color: 'text-emerald-400' },
            { icon: TrendingUp, label: 'ML Risk Engine', sub: 'Explainable AI', color: 'text-blue-400' },
            { icon: Globe, label: 'Multi-Portal', sub: '4 stakeholder views', color: 'text-purple-400' },
            { icon: BarChart3, label: 'Longitudinal Data', sub: '30D · 90D · 180D · 365D', color: 'text-amber-400' },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-white">{label}</div>
              <div className="text-[11px] text-slate-500">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-300">SkillTrackAI Platform</span>
            {' '}• Built for Smart India Hackathon (SIH26135)
            <div className="text-[11px] text-slate-600 mt-0.5">
              Government of Maharashtra • Department of Skills, Employment, Entrepreneurship & Innovation
            </div>
          </div>
          <div className="flex items-center gap-4">
            {[
              { to: '/government/login', label: 'Government' },
              { to: '/training/login', label: 'Training' },
              { to: '/employer/login', label: 'Employer' },
              { to: '/trainee/login', label: 'Trainee' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800/50 text-center text-[10px] text-slate-700">
          All data is synthetic & generated for SIH26135 demonstration. No real Government of Maharashtra records are shown. • Powered by FastAPI + React + TailwindCSS
        </div>
      </footer>
    </div>
  );
};
