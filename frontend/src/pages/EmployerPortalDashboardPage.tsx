import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api/client';
import { JobItem, CandidateMatchItem } from '../types';
import {
  Briefcase,
  Users,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Building,
  Check,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  MapPin,
  Calendar,
  Layers,
  Bell,
  Activity
} from 'lucide-react';
import { toast } from '../components/Toast';
import {
  MetricCard,
  SkillGapCard,
  SkillChip,
  JobCreationWizardModal,
  JobCreationData,
  AIChat,
  DataFlowBanner,
  NotificationPanel
} from '../components/design-system';

export const EmployerPortalDashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const employerId = currentUser?.employer_id || 'emp-tata-01';
  const companyName = currentUser?.organization || 'Tata Motors Ltd (EV Division, Pune)';

  // Tabs
  const [activeTab, setActiveTab] = useState<'matching' | 'jobs' | 'validations' | 'feedback'>('matching');
  const [showNotifications, setShowNotifications] = useState(false);

  // Data
  const [kpis, setKpis] = useState<any>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateMatchItem[]>([]);
  const [validations, setValidations] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Create Job Modal
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('EV Service Technician');
  const [newIndustry, setNewIndustry] = useState('Automotive & EV');
  const [newLocation, setNewLocation] = useState('Pune (Chakan Plant)');
  const [newSalaryMin, setNewSalaryMin] = useState(22000);
  const [newSalaryMax, setNewSalaryMax] = useState(28000);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'EV Diagnostics',
    'Battery Management',
    'CAN Diagnostics',
    'Electrical Diagnostics',
    'Vehicle Systems'
  ]);
  const [newExperience, setNewExperience] = useState('0 - 2 Years (Fresher / ITI)');
  const [newEducation, setNewEducation] = useState('ITI / Diploma in Automotive or Electrical');
  const [newVacancies, setNewVacancies] = useState(12);

  // Hiring Outcome Action Modal
  const [actionCandidate, setActionCandidate] = useState<CandidateMatchItem | null>(null);
  const [outcomeStatus, setOutcomeStatus] = useState<'Interviewed' | 'Selected' | 'Joined' | 'Rejected' | 'Employment Ended'>('Joined');
  const [offeredSalary, setOfferedSalary] = useState<number>(22500);
  const [feedbackNotes, setFeedbackNotes] = useState<string>('Candidate demonstrates solid electrical fundamentals; will participate in internal EV Diagnostics bridge module.');

  const availableSkillsList = [
    'EV Diagnostics',
    'Battery Management',
    'CAN Diagnostics',
    'High Voltage Safety',
    'Cell Packaging',
    'Electrical Diagnostics',
    'Vehicle Systems',
    'Wiring Harness Assembly',
    'Siemens S7-1200 PLC',
    'Ladder Logic',
    'SCADA Basics',
    'Linux Admin',
    'Docker Basics',
    'Cloud Support & Troubleshooting'
  ];

  const loadData = async () => {
    try {
      const [kpiRes, jobsRes, candRes, valRes] = await Promise.all([
        fetchApi<any>(`/api/employer/kpis?employer_id=${employerId}`),
        fetchApi<JobItem[]>(`/api/employer/jobs?employer_id=${employerId}`),
        fetchApi<CandidateMatchItem[]>(`/api/employer/candidates?employer_id=${employerId}`),
        fetchApi<any[]>(`/api/employer/pending-validations?employer_id=${employerId}`)
      ]);
      setKpis(kpiRes);
      setJobs(jobsRes);
      setCandidates(candRes);
      setValidations(valRes);
    } catch (err) {
      console.warn('Error loading employer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [employerId]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleWizardSaveJob = async (data: JobCreationData) => {
    try {
      await fetchApi('/api/employer/jobs', {
        method: 'POST',
        body: JSON.stringify({
          employer_id: employerId,
          job_title: data.title,
          industry: data.industry,
          location: data.location,
          salary_min: Number(data.salaryMin),
          salary_max: Number(data.salaryMax),
          salary_range: `₹${data.salaryMin.toLocaleString()} - ₹${data.salaryMax.toLocaleString()} / month`,
          required_skills: data.requiredSkills,
          experience_required: data.experience,
          education_required: data.education,
          employment_type: 'Full Time',
          vacancies: Number(data.vacancies)
        })
      });
      setShowCreateJobModal(false);
      loadData();
      toast.success('Job Published via Wizard', 'Requisition created and neural candidate matching engine triggered.');
    } catch (err: any) {
      toast.error('Job Creation Failed', err.message || 'Could not publish job.');
    }
  };

  const handleConfirmOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionCandidate) return;
    try {
      await fetchApi(`/api/employer/candidates/${actionCandidate.id}/outcome`, {
        method: 'POST',
        body: JSON.stringify({
          status: outcomeStatus,
          offered_salary: Number(offeredSalary),
          joining_date: new Date().toISOString().slice(0, 10),
          feedback_notes: feedbackNotes
        })
      });
      setActionCandidate(null);
      loadData();
      toast.success('Outcome Confirmed', `Hiring decision logged: ${outcomeStatus}. Platform confidence engine upgraded to 🟢 VERIFIED!`);
    } catch (err: any) {
      toast.error('Outcome Recording Failed', err.message || 'Could not record hiring decision.');
    }
  };

  const handleValidatePlacement = async (placementId: string, action: 'Confirmed' | 'Disputed') => {
    try {
      await fetchApi(`/api/employer/validate/${placementId}`, {
        method: 'POST',
        body: JSON.stringify({
          action,
          confirmed_wage: 21500,
          confirmed_role: 'EV Service Technician',
          dispute_reason: action === 'Disputed' ? 'Wage discrepancy reported' : undefined,
          action_by_user: currentUser?.name || 'HR Head'
        })
      });
      loadData();
      toast.success('Ledger Updated', `Placement record marked as ${action}! Confidence score recalculated in state registry.`);
    } catch (err: any) {
      toast.error('Validation Failed', err.message || 'Could not validate placement record.');
    }
  };

  const filteredCandidates = candidates.filter(c => {
    if (selectedJobId !== 'all' && c.job_id !== selectedJobId) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-base font-bold text-slate-800">Loading Employer & Industry Workspace...</p>
          <p className="text-sm text-slate-500 mt-1">Retrieving candidate skill matches and requisition telemetry</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-blue-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  INDUSTRY TALENT INTELLIGENCE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  FIND THE RIGHT SKILLS
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>{companyName}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  VERIFIED INDUSTRY PARTNER
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 z-50">
                  <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>

            <div className="hidden md:block text-right">
              <div className="font-semibold text-slate-200">{currentUser?.name || 'Vikram Shinde'}</div>
              <div className="text-[11px] text-slate-400">Head of Talent Acquisition • EV Operations</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-900 rounded-lg text-slate-200 hover:text-rose-200 transition font-semibold text-xs sm:text-sm"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Ribbon */}
        <div className="bg-slate-950/80 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs py-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('matching')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'matching' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Candidates ({candidates.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'jobs' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Open Jobs ({jobs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('validations')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'validations' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verifications ({validations.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Animated Data Flow Banner */}
        <DataFlowBanner mode="pipeline" />

        {/* KPI Ribbon using MetricCard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            title="ACTIVE JOBS"
            value={`${jobs.length} Open`}
            trend={{ value: 2, isPositive: true, label: 'this month' }}
            sparklineData={[4, 5, 5, 6, 7, jobs.length]}
            source="Job Listings"
            confidence="Verified"
          />
          <MetricCard
            title="CANDIDATE MATCHES"
            value={`${candidates.length} Profiles`}
            subtitle={`Avg Match: ${kpis?.avg_candidate_match_pct || 72.5}%`}
            trend={{ value: 6.8, isPositive: true, label: 'match fit' }}
            sparklineData={[12, 16, 20, 24, 28, candidates.length]}
            source="Skill Match"
            confidence="Verified"
          />
          <MetricCard
            title="CONFIRMED HIRES"
            value={`${kpis?.total_hires || 14} Placed`}
            subtitle="Verified in Ledger"
            trend={{ value: 4.2, isPositive: true, label: 'retention 94%' }}
            sparklineData={[6, 8, 9, 11, 13, kpis?.total_hires || 14]}
            source="Employer Records"
            confidence="Verified"
          />
          <MetricCard
            title="TOP DEMAND SKILL"
            value="EV Diagnostics"
            subtitle="BMS & CAN-Bus"
            trend={{ value: 92, isPositive: true, label: 'high priority' }}
            sparklineData={[60, 72, 80, 85, 90, 92]}
            source="Skill Demand"
            confidence="High"
          />
        </div>

        {/* TAB 1: CANDIDATE SKILL MATCHING (SECTION 5) */}
        {activeTab === 'matching' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Candidate Matches
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Candidates ranked by matched skills for your job openings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
                >
                  <option value="all">Filter by Job: All Positions</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.job_title}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCreateJobModal(true)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Job</span>
                </button>
              </div>
            </div>

            {/* Interactive Skill Demand & State Supply Visual */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 mb-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Skill Demand vs Available Candidates</span>
                  </h4>
                  <p className="text-xs text-slate-500">Comparison of your required skills against candidate supply across Maharashtra.</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                  State ITI Pool
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SkillGapCard
                  skill="EV Battery Management (BMS)"
                  demandCount={120}
                  supplyCount={35}
                  gapPercent={71}
                  urgency="Critical"
                />
                <SkillGapCard
                  skill="High Voltage Safety Protocols"
                  demandCount={85}
                  supplyCount={42}
                  gapPercent={50}
                  urgency="Critical"
                />
                <SkillGapCard
                  skill="CAN-Bus Powertrain Diagnostics"
                  demandCount={70}
                  supplyCount={48}
                  gapPercent={31}
                  urgency="Moderate"
                />
              </div>
            </div>

            {/* Candidate Cards Grid */}
            <div className="space-y-4">
              {filteredCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className={`p-5 rounded-2xl border-2 transition ${
                    cand.skill_id === 'ST-MH-7X42K9'
                      ? 'border-indigo-400 bg-indigo-50/30 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Identity & Match % */}
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 ${
                        cand.match_percentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : cand.match_percentage >= 65
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className="text-lg font-black">{cand.match_percentage}%</span>
                        <span className="text-[9px] uppercase font-bold tracking-tight">Match</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-bold font-mono text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
                            {cand.skill_id}
                          </code>
                          {cand.skill_id === 'ST-MH-7X42K9' && (
                            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold rounded-md">
                              PRIORITY CANDIDATE
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            cand.status === 'Joined'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cand.status === 'Selected'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            Status: {cand.status}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {cand.candidate_name} • <span className="font-normal text-xs text-slate-600">{cand.course_name} ({cand.district})</span>
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Applying for: <strong className="text-slate-800">{cand.job_title}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActionCandidate(cand);
                          setOfferedSalary(cand.offered_salary || 22000);
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Confirm Hiring Outcome
                      </button>
                    </div>
                  </div>

                  {/* Skills Comparison: Matched vs Missing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                    {/* Matched */}
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                      <div className="font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Matched Skills ({cand.matched_skills.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.matched_skills.map(sk => (
                          <SkillChip
                            key={sk}
                            name={sk}
                            isCertified={true}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Missing */}
                    <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                      <div className="font-bold text-rose-900 mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Missing Required Skills ({cand.missing_skills.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.missing_skills.length > 0 ? (
                          cand.missing_skills.map(ms => (
                            <SkillChip
                              key={ms}
                              name={ms}
                              isInferred={true}
                            />
                          ))
                        ) : (
                          <span className="text-emerald-700 font-medium">Full skill requirement satisfied</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {cand.feedback_notes && (
                    <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <strong>HR Evaluation Note:</strong> {cand.feedback_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OPEN JOBS */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Open Job Postings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage active listings and required candidate skills.
                </p>
              </div>
              <button
                onClick={() => setShowCreateJobModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Job</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(j => (
                <div key={j.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{j.job_title}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                        <span>•</span>
                        <span>{j.salary_range}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {j.status}
                    </span>
                  </div>

                  <div className="text-xs">
                    <div className="font-semibold text-slate-700 mb-1">Required Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {j.required_skills?.map(sk => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>Vacancies: <strong>{j.vacancies}</strong></span>
                    <button
                      onClick={() => {
                        setSelectedJobId(j.id);
                        setActiveTab('matching');
                      }}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      View Candidates →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLACEMENT VALIDATIONS */}
        {activeTab === 'validations' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Hiring Verifications</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm newly hired trainees and verify reported salary details.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Skill ID</th>
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Reported Role</th>
                    <th className="py-3 px-3">Reported Wage</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {validations.map((v) => (
                    <tr key={v.placement_id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-900">{v.skill_id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{v.trainee_name}</td>
                      <td className="py-3 px-3 text-slate-700">{v.reported_job_role}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{v.reported_wage?.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.validation_action === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {v.validation_action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleValidatePlacement(v.placement_id, 'Confirmed')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700"
                        >
                          Confirm & Verify
                        </button>
                        <button
                          onClick={() => handleValidatePlacement(v.placement_id, 'Disputed')}
                          className="px-2.5 py-1 border border-red-300 text-red-700 rounded text-xs font-semibold hover:bg-red-50"
                        >
                          Flag Mismatch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 5-Step AI Job Creation Wizard Modal */}
      <JobCreationWizardModal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        onSaveJob={handleWizardSaveJob}
      />

      {/* Hiring Outcome Modal */}
      {actionCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Record Hiring Decision</h3>
                <div className="text-xs text-slate-500">Candidate: {actionCandidate.candidate_name} ({actionCandidate.skill_id})</div>
              </div>
              <button onClick={() => setActionCandidate(null)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmOutcome} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Hiring Decision Outcome</label>
                <select
                  value={outcomeStatus}
                  onChange={(e: any) => setOutcomeStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                >
                  <option value="Interviewed">Interviewed</option>
                  <option value="Selected">Selected</option>
                  <option value="Joined">Joined (Upgrades to 🟢 VERIFIED)</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Employment Ended">Employment Ended</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Offered Monthly Wage (₹)</label>
                <input
                  type="number"
                  value={offeredSalary}
                  onChange={(e) => setOfferedSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">HR Evaluation & Bridge Notes</label>
                <textarea
                  rows={3}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                Confirming <strong>Joined</strong> automatically updates state-level placement metrics with verified employer credentials.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionCandidate(null)}
                  className="px-3 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                >
                  Confirm Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Explainable AI Assistant */}
      <AIChat />
    </div>
  );
};
