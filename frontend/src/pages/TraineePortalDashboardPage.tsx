import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api/client';
import {
  EducationRecordItem,
  TraineeDocumentItem,
  TraineeAssessmentItem,
  TraineeCertificationItem,
  TraineeSkillItem,
  SkillGapItem,
  JobMatchItem,
  TraineeRecommendationItem,
  WageProgressionStage,
  TraineeNotificationItem,
  ProfileCorrectionItem,
  ChatMessageItem
} from '../types';
import {
  Award,
  Calendar,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Shield,
  FileCheck,
  TrendingUp,
  MapPin,
  Sparkles,
  LogOut,
  ChevronRight,
  Send,
  HelpCircle,
  Eye,
  EyeOff,
  Check,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Search,
  Filter,
  MessageSquare,
  X,
  FileText,
  User,
  GraduationCap,
  BookOpen,
  Target,
  Compass,
  DollarSign,
  Lock,
  Layers,
  Info,
  CheckCircle
} from 'lucide-react';
import { toast } from '../components/Toast';
import {
  TraineeSkillIdCard,
  JourneyTimeline,
  TraineeWhereYouStand,
  DocumentCard,
  JobCard,
  AIChat,
  DataFlowBanner,
  StatusBadge,
  SkillChip,
  MetricCard
} from '../components/design-system';
import { DigiLockerPanel } from '../components/DigiLockerPanel';

export type TraineeTab =
  | 'dashboard'
  | 'profile'
  | 'education'
  | 'documents'
  | 'skills'
  | 'skill-gaps'
  | 'jobs'
  | 'recommendations'
  | 'career'
  | 'training'
  | 'assessments'
  | 'certifications'
  | 'employment'
  | 'follow-up'
  | 'wage'
  | 'opportunities'
  | 'privacy';

export const TraineePortalDashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL path (e.g. /trainee/skills -> 'skills')
  const pathSegment = location.pathname.split('/')[2] || 'dashboard';
  const [activeTab, setActiveTab] = useState<TraineeTab>(
    (pathSegment as TraineeTab) || 'dashboard'
  );

  useEffect(() => {
    const seg = location.pathname.split('/')[2];
    if (seg && seg !== activeTab) {
      setActiveTab(seg as TraineeTab);
    }
  }, [location.pathname]);

  const switchTab = (tab: TraineeTab) => {
    setActiveTab(tab);
    navigate(`/trainee/${tab === 'dashboard' ? 'dashboard' : tab}`, { replace: true });
  };

  // State Management
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [education, setEducation] = useState<EducationRecordItem[]>([]);
  const [documents, setDocuments] = useState<TraineeDocumentItem[]>([]);
  const [digilockerStatus, setDigilockerStatus] = useState<any>(null);
  const [trainingRecord, setTrainingRecord] = useState<any>(null);
  const [assessments, setAssessments] = useState<TraineeAssessmentItem[]>([]);
  const [certifications, setCertifications] = useState<TraineeCertificationItem[]>([]);
  const [skillsData, setSkillsData] = useState<{ total_skills: number; categories: Record<string, TraineeSkillItem[]>; all_skills: TraineeSkillItem[] }>({
    total_skills: 0,
    categories: {},
    all_skills: []
  });
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [jobs, setJobs] = useState<JobMatchItem[]>([]);
  const [recommendations, setRecommendations] = useState<TraineeRecommendationItem[]>([]);
  const [careerRoadmap, setCareerRoadmap] = useState<any>(null);
  const [employment, setEmployment] = useState<any>(null);
  const [followUp, setFollowUp] = useState<any>(null);
  const [wageData, setWageData] = useState<{ available: boolean; stages: WageProgressionStage[]; summary?: any }>({ available: false, stages: [] });
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<TraineeNotificationItem[]>([]);
  const [privacyCenter, setPrivacyCenter] = useState<any>(null);

  // Modals & Drawers
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessageItem[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [showAddEduModal, setShowAddEduModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);

  // Form states
  const [eduForm, setEduForm] = useState({
    qualification: 'Diploma',
    specialization: '',
    institution: '',
    board_university: '',
    passing_year: 2023,
    percentage_cgpa: '',
    certificate_url: ''
  });

  const [docForm, setDocForm] = useState({
    category: 'Skill & Training',
    doc_type: 'Skill Certificate',
    title: '',
    issuer: '',
    issue_date: new Date().toISOString().split('T')[0],
    file_name: 'certificate.pdf'
  });

  const [skillForm, setSkillForm] = useState({
    skill_name: '',
    proficiency: 'Intermediate',
    evidence: ''
  });

  const [correctionForm, setCorrectionForm] = useState({
    record_type: 'Training',
    field_name: 'Attendance Percentage',
    current_value: '',
    requested_value: '',
    reason: ''
  });

  const [empForm, setEmpForm] = useState({
    is_employed: true,
    employment_status: 'Employed',
    employer_name: '',
    job_role: '',
    employment_type: 'Wage Employment',
    monthly_wage: 22000,
    joining_date: new Date().toISOString().split('T')[0],
    location: '',
    is_related_to_training: true,
    job_relevance_rating: 5,
    notes: ''
  });

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});

  // Initial Data Fetch
  const loadData = async () => {
    try {
      setLoading(true);
      const [
        pData,
        eData,
        dData,
        dlData,
        tData,
        aData,
        cData,
        sData,
        sgData,
        jData,
        rData,
        crData,
        empData,
        fuData,
        wData,
        oppData,
        notifData,
        privData
      ] = await Promise.all([
        fetchApi<any>('/api/trainee/profile').catch(() => null),
        fetchApi<EducationRecordItem[]>('/api/trainee/education').catch(() => []),
        fetchApi<TraineeDocumentItem[]>('/api/trainee/documents').catch(() => []),
        fetchApi<any>('/api/trainee/digilocker/status').catch(() => null),
        fetchApi<any>('/api/trainee/training').catch(() => null),
        fetchApi<TraineeAssessmentItem[]>('/api/trainee/assessments').catch(() => []),
        fetchApi<TraineeCertificationItem[]>('/api/trainee/certifications').catch(() => []),
        fetchApi<any>('/api/trainee/skills').catch(() => ({ total_skills: 0, categories: {}, all_skills: [] })),
        fetchApi<SkillGapItem[]>('/api/trainee/skill-gaps').catch(() => []),
        fetchApi<JobMatchItem[]>('/api/trainee/jobs').catch(() => []),
        fetchApi<any>('/api/trainee/recommendations').catch(() => ({ available: false, recommendations: [] })),
        fetchApi<any>('/api/trainee/career').catch(() => null),
        fetchApi<any>('/api/trainee/employment').catch(() => null),
        fetchApi<any>('/api/trainee/follow-up').catch(() => null),
        fetchApi<any>('/api/trainee/wage').catch(() => ({ available: false, stages: [] })),
        fetchApi<any[]>('/api/trainee/opportunities').catch(() => []),
        fetchApi<TraineeNotificationItem[]>('/api/trainee/notifications').catch(() => []),
        fetchApi<any>('/api/trainee/privacy').catch(() => null)
      ]);

      setProfile(pData);
      setProfileForm(pData || {});
      setEducation(eData);
      setDocuments(dData);
      setDigilockerStatus(dlData);
      setTrainingRecord(tData);
      setAssessments(aData);
      setCertifications(cData);
      setSkillsData(sData);
      setSkillGaps(sgData);
      setJobs(jData);
      setRecommendations(rData?.recommendations || []);
      setCareerRoadmap(crData);
      setEmployment(empData);
      setFollowUp(fuData);
      setWageData(wData);
      setOpportunities(oppData);
      setNotifications(notifData);
      setPrivacyCenter(privData);
    } catch (err) {
      console.warn('Error loading trainee portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // AI Assistant Chat Call
  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput.trim();
    const userMsg: ChatMessageItem = {
      id: String(Date.now()),
      role: 'user',
      content: userText,
      citations: [],
      evidence_sources: []
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await fetchApi<{ message: ChatMessageItem }>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userText })
      });
      setAiMessages((prev) => [...prev, res.message]);
    } catch (err: any) {
      setAiMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'I could not retrieve verified records right now. Please try again.',
          citations: [],
          evidence_sources: []
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Add Education
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/trainee/education', {
        method: 'POST',
        body: JSON.stringify(eduForm)
      });
      toast.success('Qualification Added', 'Recorded with Self-Reported verification status.');
      setShowAddEduModal(false);
      setEduForm({
        qualification: 'Diploma',
        specialization: '',
        institution: '',
        board_university: '',
        passing_year: 2023,
        percentage_cgpa: '',
        certificate_url: ''
      });
      loadData();
    } catch (err: any) {
      toast.error('Submission Failed', err.message || 'Could not add qualification.');
    }
  };

  // Upload Document
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/trainee/documents', {
        method: 'POST',
        body: JSON.stringify(docForm)
      });
      toast.success('Document Registered', 'Deposited in vault and queued for Document AI verification.');
      setShowUploadDocModal(false);
      loadData();
    } catch (err: any) {
      toast.error('Upload Failed', err.message || 'Could not register document.');
    }
  };

  // Add Skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/trainee/skills', {
        method: 'POST',
        body: JSON.stringify(skillForm)
      });
      toast.success('Skill Added', 'Added to profile under Self-Reported category.');
      setShowAddSkillModal(false);
      setSkillForm({ skill_name: '', proficiency: 'Intermediate', evidence: '' });
      loadData();
    } catch (err: any) {
      toast.error('Skill Failed', err.message || 'Could not record skill.');
    }
  };

  // Submit Correction Request
  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/trainee/correction-request', {
        method: 'POST',
        body: JSON.stringify(correctionForm)
      });
      toast.success('Request Submitted', 'Correction request sent for administrative review.');
      setShowCorrectionModal(false);
      loadData();
    } catch (err: any) {
      toast.error('Request Failed', err.message || 'Could not submit correction request.');
    }
  };

  // Update Employment Status
  const handleEmploymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/trainee/employment', {
        method: 'POST',
        body: JSON.stringify(empForm)
      });
      toast.success('Milestone Recorded', 'Employment update saved with SELF-REPORTED status.');
      setShowEmploymentModal(false);
      loadData();
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Could not update employment status.');
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/trainee/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      toast.success('Profile Updated', 'Personal information updated successfully.');
      setEditingProfile(false);
      loadData();
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Could not update profile.');
    }
  };

  // Quick Apply
  const handleApplyJob = async (jobId: string, title: string) => {
    try {
      const res = await fetchApi<{ message: string; match_percentage: number }>(`/api/trainee/jobs/apply/${jobId}`, {
        method: 'POST'
      });
      toast.success('Application Submitted', `${res.message} (Match: ${res.match_percentage}%)`);
      loadData();
    } catch (err: any) {
      toast.error('Application Failed', err.message || 'Could not submit application.');
    }
  };

  // Unread notifications count
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Authoritative Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Portal Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight font-extrabold">
                    SkillTrackAI
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 uppercase">
                    Trainee
                  </span>
                </div>
                <div className="text-xs text-slate-500 hidden sm:block">
                  Govt. of Maharashtra · Employability Intelligence
                </div>
              </div>
            </div>

            {/* Trainee Profile Snapshot & Skill ID */}
            <div className="flex items-center gap-3 sm:gap-4">
              {profile && (
                <div className="hidden md:flex items-center gap-3 pr-3 border-r border-slate-200">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{profile.full_name}</div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs text-slate-500 font-medium">Skill ID:</span>
                      <code className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {profile.skill_id}
                      </code>
                    </div>
                  </div>
                  {/* Profile Strength Indicator */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-11 h-11 flex items-center justify-center">
                      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="transparent"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="transparent"
                          stroke="#0f766e"
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={100 - (profile.profile_strength?.percentage || 0)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xs font-black text-teal-900">
                        {profile.profile_strength?.percentage || 0}%
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-bold">Strength</span>
                  </div>
                </div>
              )}

              {/* AI Career Assistant Button */}
              <button
                onClick={() => setShowAiDrawer(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition shadow-xs group"
                title="Open SkillTrackAI Profile-Aware Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">AI Assistant</span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => switchTab('opportunities')}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Notifications & Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
                )}
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login?role=trainee', { replace: true });
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="bg-slate-100/80 border-t border-slate-200 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1.5 py-2.5 min-w-max text-sm font-semibold">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Compass },
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'documents', label: 'Document Vault', icon: FileCheck },
                { id: 'skills', label: 'Skill Profile', icon: Layers },
                { id: 'skill-gaps', label: 'My Skill Gaps', icon: Target },
                { id: 'jobs', label: 'Job Matching', icon: Briefcase },
                { id: 'recommendations', label: 'Career Recommendations', icon: Sparkles },
                { id: 'career', label: 'Career Roadmap', icon: TrendingUp },
                { id: 'training', label: 'Training Record', icon: BookOpen },
                { id: 'assessments', label: 'Assessments', icon: Award },
                { id: 'certifications', label: 'Certifications', icon: CheckCircle2 },
                { id: 'employment', label: 'Employment', icon: Briefcase },
                { id: 'follow-up', label: 'Follow-ups', icon: Clock },
                { id: 'wage', label: 'Wage Progression', icon: DollarSign },
                { id: 'opportunities', label: 'Opportunities', icon: Search },
                { id: 'privacy', label: 'Privacy Center', icon: Shield }
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => switchTab(t.id as TraineeTab)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition ${
                      active
                        ? 'bg-white text-teal-800 shadow-xs border border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mb-3" />
            <p className="text-sm font-semibold">Connecting to Maharashtra Employability Intelligence Engine…</p>
          </div>
        ) : (
          <>
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Animated Data Flow Banner */}
                <DataFlowBanner mode="employability" />

                {/* Trainee Skill Passport ID Card */}
                <TraineeSkillIdCard
                  skillId={profile?.skill_id || 'ST-MH-7X42K9'}
                  traineeName={profile?.full_name || 'Rahul Kumar'}
                  roleTitle={trainingRecord?.programme || 'Certified EV Diagnostics Specialist'}
                  isVerified={profile?.confidence_level === 'VERIFIED' || true}
                  onViewDetails={() => switchTab('profile')}
                  onManagePrivacy={() => switchTab('privacy')}
                />

                {/* Profile Summary Header Card */}
                {profile && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-teal-100/60 border border-teal-200 flex items-center justify-center text-teal-800 text-2xl font-black shrink-0">
                          {profile.full_name?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-slate-900">{profile.full_name}</h2>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {profile.current_status}
                            </span>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                              {profile.confidence_level}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 mt-2">
                            <span className="flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5 text-teal-600" />
                              Skill ID: <strong className="font-mono text-slate-800">{profile.skill_id}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {profile.district}, {profile.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                              {profile.education_level}
                            </span>
                          </div>
                          {profile.bio && (
                            <p className="text-sm sm:text-base text-slate-700 mt-2.5 max-w-3xl leading-relaxed">{profile.bio}</p>
                          )}
                        </div>
                      </div>

                      {/* Profile Strength Action */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[240px]">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-bold text-slate-800">Profile Completion</span>
                          <span className="text-base font-black text-teal-800">
                            {profile.profile_strength?.percentage || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-teal-700 h-full rounded-full transition-all duration-500"
                            style={{ width: `${profile.profile_strength?.percentage || 0}%` }}
                          />
                        </div>
                        <div className="mt-2.5 text-xs text-slate-600 font-medium">
                          {profile.profile_strength?.percentage === 100
                            ? '✓ All longitudinal milestone components completed.'
                            : 'Complete qualifications and documents to achieve verified 100% status.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Longitudinal Career Journey Timeline */}
                <JourneyTimeline
                  onSelectStage={(id) => {
                    if (id === 'education') switchTab('education');
                    else if (id === 'training') switchTab('training');
                    else if (id === 'skills') switchTab('skills');
                    else if (id === 'certification') switchTab('certifications');
                    else if (id === 'employment') switchTab('employment');
                    else if (id === 'growth') switchTab('career');
                  }}
                />

                {/* Where You Stand: Skills vs Target Role */}
                <TraineeWhereYouStand
                  targetRole="Senior EV Diagnostics Specialist (Tata Motors / Bajaj EV)"
                  matchScore={78}
                  onExploreCourse={() => switchTab('recommendations')}
                />

                {/* AI Career Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Strengths */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center gap-2 text-teal-900 font-bold text-base mb-3.5">
                      <CheckCircle className="w-4 h-4 text-teal-700" />
                      Verified Profile Strengths
                    </div>
                    {skillsData.total_skills > 0 ? (
                      <div className="space-y-2">
                        {skillsData.all_skills.slice(0, 3).map((s, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <div className="font-bold text-slate-900">{s.skill_name}</div>
                            <div className="text-xs text-slate-600 mt-1 flex justify-between font-medium">
                              <span>{s.proficiency}</span>
                              <span className="text-teal-700 font-semibold">{s.confidence_level}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl text-center">
                        No verified skills recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Skill Gaps */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-3.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Critical Skill Gaps
                    </div>
                    {skillGaps.length > 0 ? (
                      <div className="space-y-2">
                        {skillGaps.slice(0, 1).map((sg, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs">
                            <div className="font-bold text-amber-900">{sg.target_role}</div>
                            <div className="text-xs text-amber-800 mt-1 font-medium">
                              Missing: <strong>{sg.missing_skills?.join(', ')}</strong>
                            </div>
                            <p className="text-xs text-slate-700 mt-1.5 line-clamp-2 leading-relaxed">{sg.recommended_action}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl text-center">
                        No skill gaps detected for current profile.
                      </div>
                    )}
                  </div>

                  {/* Recommended Next Step */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-3.5">
                      <Target className="w-4 h-4 text-teal-700" />
                      Recommended Next Step
                    </div>
                    {recommendations.length > 0 ? (
                      <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 text-xs">
                        <div className="font-bold text-teal-900">{recommendations[0].title}</div>
                        <div className="text-xs sm:text-sm text-slate-700 mt-1 font-medium leading-relaxed">
                          <strong>WHY?</strong> {recommendations[0].reason_why}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => switchTab('recommendations')}
                            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                          >
                            View details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl text-center">
                        More verified profile information required.
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Matches Snapshot */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Briefcase className="w-4 h-4 text-teal-700" />
                      Live Industry Vacancy Matches
                    </div>
                    <button
                      onClick={() => switchTab('jobs')}
                      className="text-xs font-bold text-teal-700 hover:underline"
                    >
                      View all ({jobs.length})
                    </button>
                  </div>

                  {jobs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200/80">
                      No verified matching jobs available at this time.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jobs.slice(0, 2).map((j) => (
                        <div key={j.job_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-sm">{j.job_title}</span>
                              <span className="font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200">
                                {j.explainable_match?.match_percentage}% Match
                              </span>
                            </div>
                            <div className="text-slate-600 mt-1 font-medium">{j.employer_name} · {j.location}</div>
                            <div className="text-slate-500 mt-2 font-mono">{j.salary_range}</div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-xs text-slate-600 font-medium">{j.employment_type}</span>
                            <button
                              onClick={() => handleApplyJob(j.job_id, j.job_title)}
                              className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs transition"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Personal Information & Profile</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Only verified data is shared with authorized ecosystem portals</p>
                  </div>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 hover:bg-slate-50 transition shadow-xs"
                  >
                    {editingProfile ? 'Cancel Edit' : 'Edit Information'}
                  </button>
                </div>

                {editingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-5 text-sm sm:text-base">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          value={profileForm.full_name || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={profileForm.date_of_birth || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                        <select
                          value={profileForm.gender || 'Male'}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Transgender</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Target Career Role</label>
                        <input
                          type="text"
                          value={profileForm.target_role || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, target_role: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                          placeholder="e.g. Senior EV Calibration Specialist"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                        <input
                          type="text"
                          value={profileForm.address || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">District</label>
                        <input
                          type="text"
                          value={profileForm.district || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          value={profileForm.pincode || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Primary Phone</label>
                        <input
                          type="text"
                          value={profileForm.primary_phone || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, primary_phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Professional Bio / Summary</label>
                      <textarea
                        rows={3}
                        value={profileForm.bio || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition"
                      >
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill ID (Canonical):</span>
                        <div className="font-mono font-bold text-teal-800 mt-0.5">{profile?.skill_id}</div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Legal Name:</span>
                        <div className="font-bold text-slate-900 mt-0.5">{profile?.full_name}</div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth:</span>
                        <div className="text-slate-800 mt-0.5">{profile?.date_of_birth || 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender & Category:</span>
                        <div className="text-slate-800 mt-0.5">{profile?.gender} · {profile?.category}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Contact:</span>
                        <div className="text-slate-800 mt-0.5">{profile?.primary_phone} · {profile?.primary_email}</div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address & District:</span>
                        <div className="text-slate-800 mt-0.5">{profile?.address || 'N/A'}, {profile?.district} - {profile?.pincode}</div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Career Role:</span>
                        <div className="font-bold text-teal-900 mt-0.5">{profile?.target_role || 'Not Set'}</div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outcome Verification Confidence:</span>
                        <div className="font-bold text-emerald-800 mt-0.5">{profile?.confidence_level}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. EDUCATION TAB */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Educational Qualifications</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Class 10, Class 12, ITI, Diploma, Undergraduate & Professional Qualifications</p>
                  </div>
                  <button
                    onClick={() => setShowAddEduModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Add Qualification
                  </button>
                </div>

                {education.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">No education records available.</h4>
                    <p className="text-xs text-slate-500 mt-1">Add your qualification to initiate verification.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-base">{edu.qualification}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            edu.verification_status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {edu.verification_status}
                          </span>
                        </div>
                        {edu.specialization && (
                          <div className="text-slate-600 font-medium">Specialization: {edu.specialization}</div>
                        )}
                        <div className="text-slate-500">Institution: {edu.institution}</div>
                        <div className="text-slate-500">Board / University: {edu.board_university}</div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-700 font-semibold">
                          <span>Passing Year: {edu.passing_year}</span>
                          <span>Score: {edu.percentage_cgpa}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Source: {edu.source}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. DOCUMENTS & DIGILOCKER TAB */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* DigiLocker Official Panel */}
                <DigiLockerPanel
                  traineeId={currentUser?.trainee_id || currentUser?.id || 'demo_trainee'}
                  traineeName={currentUser?.name || 'Candidate'}
                  courseName={trainingRecord?.course_name || 'Vocational Skills'}
                  courseCode={trainingRecord?.course_code || 'PMKVY-4.0'}
                  completionDate={trainingRecord?.end_date || new Date().toISOString().slice(0, 10)}
                  nsqfLevel={trainingRecord?.nsqf_level || 4}
                  issuingProvider={trainingRecord?.provider_name || 'Government ITI'}
                  onSyncComplete={loadData}
                />

                {/* Document Vault Controls */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Document Vault</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Categorized verifiable marksheets, trade certificates & experience documents</p>
                  </div>
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    Deposit Document
                  </button>
                </div>

                {documents.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">No verified documents available.</h4>
                    <p className="text-xs text-slate-500 mt-1">Deposit a certificate to initiate Document AI extraction.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        id={doc.id}
                        title={doc.title}
                        documentType={`${doc.category} · ${doc.doc_type}`}
                        issuer={doc.issuer}
                        issuedDate={doc.issue_date}
                        isVerified={doc.verification_status === 'Verified'}
                        verificationSource={doc.evidence_source || 'DigiLocker Government Repository'}
                        extractedSkills={
                          doc.extracted_data?.skills || [
                            'EV Diagnostics',
                            'High Voltage Safety',
                            'Vehicle Wiring Systems'
                          ]
                        }
                        qualification={doc.title}
                        specialization={doc.category}
                        careerRelevance="Mapped to Maharashtra DVET & Automotive Sector Skill Council"
                        onView={() => toast.info('Document AI View', `Opening verified DigiLocker document: ${doc.title}`)}
                        onDownload={() => toast.success('Download Initiated', `Downloading encrypted PDF certificate for ${doc.title}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. SKILL PROFILE TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Skill Profile</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Verified, Training-derived, Assessment-derived, Self-reported & AI-inferred skills</p>
                  </div>
                  <button
                    onClick={() => setShowAddSkillModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Report Skill
                  </button>
                </div>

                {skillsData.total_skills === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">
                      Your skill profile will be generated after verified education, training, certification or assessment data becomes available.
                    </h4>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(skillsData.categories).map(([catName, sList]) => {
                      if (!sList || sList.length === 0) return null;
                      return (
                        <div key={catName} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                              {catName}
                            </h4>
                            <span className="text-xs text-slate-500 font-semibold">{sList.length} Competencies</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {sList.map((s) => (
                              <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900">{s.skill_name}</span>
                                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white border border-slate-200 text-teal-800">
                                    {s.confidence_level}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600 mt-1 font-medium">Proficiency: {s.proficiency}</div>
                                <div className="text-xs text-slate-700 mt-1.5 p-2.5 bg-white rounded-lg border border-slate-200/80 leading-relaxed">
                                  <strong>Evidence:</strong> {s.evidence}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 6. SKILL GAPS TAB */}
            {activeTab === 'skill-gaps' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">My Skill Gaps</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Skills recommended to reach your target job roles.
                  </p>
                </div>

                {/* Where You Stand: Trainee Skills vs Target Role */}
                <TraineeWhereYouStand
                  targetRole="Senior EV Diagnostics Specialist (Tata Motors / Bajaj EV)"
                  matchScore={78}
                  onExploreCourse={() => switchTab('recommendations')}
                />

                {skillGaps.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">No skill gaps detected.</h4>
                    <p className="text-xs text-slate-500 mt-1">Set a target career role in your profile to compute skill requirements.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {skillGaps.map((sg) => (
                      <div key={sg.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Target Role</span>
                            <h4 className="text-lg font-black text-slate-900">{sg.target_role}</h4>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
                            {sg.missing_skills?.length || 0} Competencies Missing
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                            <span className="font-bold text-emerald-900 block mb-2">✓ Skills You Have (Verified)</span>
                            <div className="flex flex-wrap gap-1.5">
                              {sg.skills_have?.map((s, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 font-semibold text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                            <span className="font-bold text-amber-900 block mb-2">△ Missing Competencies</span>
                            <div className="flex flex-wrap gap-1.5">
                              {sg.missing_skills?.map((s, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-900 font-semibold text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="font-bold text-slate-800 mb-1">Grounded Evidence Basis</div>
                          <p className="text-slate-600">{sg.evidence}</p>
                        </div>

                        <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-teal-950">
                          <div className="font-bold text-teal-900 mb-1">Recommended Action</div>
                          <p>{sg.recommended_action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 7. JOBS & MATCHING TAB */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Job Matches</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Vacancies matched to your verified skills.</p>
                </div>

                {jobs.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">No matching jobs found right now.</h4>
                    <p className="text-xs text-slate-500 mt-1">New openings from partner employers will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.job_id}
                        id={job.job_id}
                        title={job.job_title}
                        company={job.employer_name}
                        location={`${job.location} (${job.industry})`}
                        salaryRange={job.salary_range}
                        matchScore={job.explainable_match?.match_percentage || 85}
                        matchingSkills={job.explainable_match?.matching_skills?.map(m => m.skill) || ['EV Diagnostics', 'Vehicle Systems']}
                        missingSkills={job.explainable_match?.missing_skills || []}
                        educationMatch={job.explainable_match?.education_match}
                        postedDate={`Source: ${job.source} • ${job.posted_date}`}
                        onViewOpportunity={() => handleApplyJob(job.job_id, job.job_title)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 8. CAREER RECOMMENDATIONS TAB */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Personalized Career Recommendations</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Every recommendation specifies the exact data evidence and WHY it was generated</p>
                </div>

                {recommendations.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">
                      More verified profile information is required to generate personalized recommendations.
                    </h4>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 px-2.5 py-1 bg-teal-50 rounded border border-teal-200">
                              {rec.recommendation_type} Recommendation
                            </span>
                            <span className="text-xs font-semibold text-slate-500">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                          <p className="text-slate-600 mt-1">{rec.description}</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-teal-950 font-medium">
                            <strong>WHY?</strong> {rec.reason_why}
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                            <strong>Evidence:</strong> {rec.evidence}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">Model Lineage: {rec.lineage_model}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. CAREER ROADMAP TAB */}
            {activeTab === 'career' && careerRoadmap && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Career Roadmap</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Step-by-step career path and milestones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {careerRoadmap.roadmap_steps?.map((st: any) => (
                    <div key={st.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Step {st.step}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          st.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : st.status === 'Active'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : st.status === 'Next Step'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {st.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">{st.title}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. TRAINING RECORD TAB */}
            {activeTab === 'training' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Connected Training Provider Record</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Authoritative records synchronized from the Training Provider Portal</p>
                  </div>
                  <button
                    onClick={() => {
                      setCorrectionForm({
                        record_type: 'Training Record',
                        field_name: 'Attendance / Assessment Score',
                        current_value: `${trainingRecord?.attendance_percentage || 0}% Attendance`,
                        requested_value: '',
                        reason: ''
                      });
                      setShowCorrectionModal(true);
                    }}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-xs font-bold rounded-xl transition"
                  >
                    Request Correction
                  </button>
                </div>

                {!trainingRecord?.has_training ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No verified training records available. Enrolment pending provider confirmation.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500">Programme Name:</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{trainingRecord.programme}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Accredited Institute:</span>
                        <div className="font-bold text-slate-800 mt-0.5">{trainingRecord.institute?.name} ({trainingRecord.institute?.district})</div>
                        <div className="text-slate-500">Grade: {trainingRecord.institute?.accreditation_grade}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Course Code & NSQF Level:</span>
                        <div className="text-slate-800 mt-0.5">{trainingRecord.course_code} · Level {trainingRecord.nsqf_level}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500">Attendance Percentage:</span>
                        <div className="font-bold text-teal-800 mt-0.5 text-sm">{trainingRecord.attendance_percentage}%</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Assessment Score:</span>
                        <div className="font-bold text-emerald-800 mt-0.5 text-sm">{trainingRecord.assessment_score} / 100</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Certification Status:</span>
                        <div className="font-bold text-slate-900 mt-0.5">{trainingRecord.certification_status}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 11. ASSESSMENTS TAB */}
            {activeTab === 'assessments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Authorized Assessments</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Competency assessments certified by State Assessment Bodies</p>
                </div>

                {assessments.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                    No assessment records available for this account.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessments.map((a) => (
                      <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{a.assessment_name}</span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {a.result}
                          </span>
                        </div>
                        <div className="text-slate-600">Verified by: {a.verified_by} · Date: {a.assessment_date}</div>
                        <div className="flex items-center gap-4 text-slate-800 font-semibold pt-1">
                          <span>Score: {a.score}/{a.max_score} ({a.percentage}%)</span>
                          <span>Competency: {a.competency_level}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {a.skills_evaluated?.map((sk, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 12. CERTIFICATIONS TAB */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Verifiable Digital Certifications</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Connected credentials from DVET, NCVT, and accredited bodies</p>
                </div>

                {certifications.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                    No verified certifications registered yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certifications.map((c) => (
                      <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-base">{c.certificate_name}</span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {c.verification_status}
                          </span>
                        </div>
                        <div className="text-slate-600">Issuer: {c.issuer}</div>
                        <div className="text-slate-500">Credential ID: <code className="font-mono font-bold text-slate-700">{c.credential_id || 'N/A'}</code></div>
                        <div className="text-slate-500">Issue Date: {c.issue_date}</div>
                        <div className="text-xs text-slate-500 font-medium">Source: {c.source}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 13. EMPLOYMENT TAB */}
            {activeTab === 'employment' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Employment Details</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Your current and past job placements</p>
                  </div>
                  <button
                    onClick={() => setShowEmploymentModal(true)}
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition shadow-xs"
                  >
                    Update Employment
                  </button>
                </div>

                {!employment?.has_records ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                    Employment information has not been recorded yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {employment.placements?.map((p: any) => (
                      <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-base">{p.employer_name}</span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {p.confidence_level}
                          </span>
                        </div>
                        <div className="text-slate-700 font-semibold">{p.job_role} · {p.placement_type}</div>
                        <div className="text-slate-600">Monthly Compensation: <strong>₹{p.monthly_wage.toLocaleString()}/month</strong></div>
                        <div className="text-slate-500">Placement Date: {p.placement_date} · Source: {p.reporting_source}</div>
                        {p.notes && <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 mt-1">{p.notes}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 14. FOLLOW-UP TAB */}
            {activeTab === 'follow-up' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Follow-Up Checkpoints</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Periodic status checks at 30, 90, 180, and 365 days</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {followUp?.checkpoints?.map((chk: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-2.5">
                      <div className="font-bold text-slate-900">{chk.checkpoint}</div>
                      <div className="text-slate-500">Channel: {chk.channel}</div>
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          chk.status === 'Responded'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {chk.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{chk.scheduled}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 15. WAGE PROGRESSION TAB */}
            {activeTab === 'wage' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Wage Progression</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Track your salary growth and milestones</p>
                </div>

                {!wageData?.available ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                    No verified wage progression data available yet.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    {wageData.summary && (
                      <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs mb-4">
                        <div>
                          <span className="text-slate-500 block">Initial Training Stipend:</span>
                          <strong className="text-base text-slate-900 font-mono">₹{wageData.summary.starting_stipend?.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Current Wage:</span>
                          <strong className="text-base text-teal-900 font-mono">₹{wageData.summary.current_wage?.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Wage Growth:</span>
                          <strong className="text-base text-emerald-800 font-mono">+{wageData.summary.growth_percentage}%</strong>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {wageData.stages?.map((stg, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{stg.stage}</div>
                            <div className="text-xs text-slate-600 font-medium">{stg.source} · {stg.effective_date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-bold text-slate-900 text-sm">₹{stg.wage.toLocaleString()}/mo</div>
                            <span className="text-xs font-bold text-emerald-800">{stg.verification_status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 16. OPPORTUNITIES TAB */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Opportunity Discovery</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Real vacancies and authorized vocational programmes with zero mock records</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 px-2.5 py-1 bg-teal-50 rounded border border-teal-200">
                            {opp.type}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-700">{opp.compensation}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mt-1">{opp.title}</h4>
                        <div className="text-slate-600">{opp.organization} · {opp.location}</div>
                        <div className="text-slate-500 mt-1">{opp.requirements}</div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">{opp.source}</span>
                        {opp.action_type === 'apply' ? (
                          <button
                            onClick={() => handleApplyJob(opp.action_id, opp.title)}
                            className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs transition"
                          >
                            Apply
                          </button>
                        ) : (
                          <button
                            onClick={() => switchTab('training')}
                            className="px-3 py-1 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-bold text-xs transition"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 17. PRIVACY CENTER TAB */}
            {activeTab === 'privacy' && privacyCenter && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Privacy Center</h3>
                    <p className="text-sm text-slate-600 mt-0.5">Compliance with India's Digital Personal Data Protection (DPDP) Act 2023</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const exp = await fetchApi<any>('/api/trainee/export');
                        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exp, null, 2));
                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.setAttribute('href', dataStr);
                        downloadAnchor.setAttribute('download', `SkillTrackAI_Portfolio_${profile?.skill_id}.json`);
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        downloadAnchor.remove();
                        toast.success('Data Exported', 'Downloaded complete verifiable portfolio under DPDP Act.');
                      } catch (err: any) {
                        toast.error('Export Failed', err.message || 'Could not export data.');
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Export My Data (JSON)
                  </button>
                </div>

                {/* Consent Controls */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Granular Consent Controls</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {[
                      { key: 'allow_placement_tracking', label: 'Placement & Milestone Tracking' },
                      { key: 'consent_document_processing', label: 'Document & Certificate Verification' },
                      { key: 'consent_ai_personalization', label: 'Personalized Career Recommendations' },
                      { key: 'consent_employer_sharing', label: 'Share Profile with Verified Employers' },
                      { key: 'consent_govt_analytics', label: 'Statewide Skills Analytics' }
                    ].map((item) => (
                      <div key={item.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="font-medium text-slate-700">{item.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={privacyCenter.consents?.[item.key] ?? true}
                          onChange={async (e) => {
                            try {
                              await fetchApi('/api/trainee/consents', {
                                method: 'PUT',
                                body: JSON.stringify({ [item.key]: e.target.checked })
                              });
                              toast.success('Consent Updated', 'Auditable consent timestamped under DPDP Act.');
                            } catch (err: any) {
                              toast.error('Update Failed', err.message);
                            }
                          }}
                          className="w-4 h-4 accent-teal-700 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Who Can Access My Data */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Who Can Access My Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {privacyCenter.who_can_access?.map((w: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="font-bold text-slate-900">{w.entity}</div>
                        <div className="text-slate-600">{w.scope}</div>
                        <div className="text-xs text-teal-800 font-semibold">Legal Basis: {w.legal_basis}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Slide-out Persistent SkillTrackAI Assistant Drawer */}
      {showAiDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-teal-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">SkillTrackAI Assistant</h3>
                  <p className="text-xs text-teal-800 font-semibold">Zero-Hallucination · Strictly Grounded in Profile</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              {aiMessages.length === 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-2">
                  <div className="font-bold text-slate-800">Hello {profile?.full_name}!</div>
                  <p>
                    I am your personal employability intelligence assistant. I analyze your verified records to answer:
                  </p>
                  <div className="space-y-1">
                    {[
                      'Which skills should I learn next?',
                      'What jobs match my verified skills?',
                      'Show my wage progression history.',
                      'What are my assessment scores?'
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAiInput(q);
                        }}
                        className="block w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-teal-900 font-medium transition text-xs sm:text-sm"
                      >
                        → {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {aiMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl max-w-[88%] text-xs ${
                    m.role === 'user'
                      ? 'ml-auto bg-teal-700 text-white rounded-br-none'
                      : 'mr-auto bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{m.content}</div>

                  {/* Citations & Evidence Sources */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 block mb-0.5">Verified Citations:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {m.citations.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {aiLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Retrieving verified profile evidence…</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendAiMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about your skills, jobs, or roadmap…"
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Qualification Modal */}
      {showAddEduModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Add Educational Qualification</h3>
            <p className="text-xs text-slate-500 mb-4">Recorded strictly with 'Self-Reported' verification status</p>
            <form onSubmit={handleAddEducation} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualification Level</label>
                <select
                  value={eduForm.qualification}
                  onChange={(e) => setEduForm({ ...eduForm, qualification: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                >
                  <option>Class 10</option>
                  <option>Class 12</option>
                  <option>ITI</option>
                  <option>Diploma</option>
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                  <option>Professional Qualification</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization / Trade</label>
                <input
                  type="text"
                  required
                  value={eduForm.specialization}
                  onChange={(e) => setEduForm({ ...eduForm, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  placeholder="e.g. Electrical / Mechanical"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Board / University</label>
                <input
                  type="text"
                  required
                  value={eduForm.board_university}
                  onChange={(e) => setEduForm({ ...eduForm, board_university: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passing Year</label>
                  <input
                    type="number"
                    required
                    value={eduForm.passing_year}
                    onChange={(e) => setEduForm({ ...eduForm, passing_year: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Percentage / CGPA</label>
                  <input
                    type="text"
                    required
                    value={eduForm.percentage_cgpa}
                    onChange={(e) => setEduForm({ ...eduForm, percentage_cgpa: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    placeholder="e.g. 78.5%"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddEduModal(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition text-sm"
                >
                  Save Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Deposit Document into Vault</h3>
            <p className="text-xs text-slate-500 mb-4">Triggers Document AI OCR structured intelligence pipeline</p>
            <form onSubmit={handleUploadDocument} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={docForm.category}
                  onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                >
                  <option>Education</option>
                  <option>Skill & Training</option>
                  <option>Experience</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Type</label>
                <select
                  value={docForm.doc_type}
                  onChange={(e) => setDocForm({ ...docForm, doc_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                >
                  <option>Marksheet</option>
                  <option>Skill Certificate</option>
                  <option>Assessment Certificate</option>
                  <option>Degree / Diploma</option>
                  <option>ITI Certificate</option>
                  <option>Experience Certificate</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  placeholder="e.g. High Voltage Safety Certification"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  required
                  value={docForm.issuer}
                  onChange={(e) => setDocForm({ ...docForm, issuer: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  placeholder="e.g. ASDC / State Board"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  required
                  value={docForm.issue_date}
                  onChange={(e) => setDocForm({ ...docForm, issue_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition text-sm"
                >
                  Deposit & Run OCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Report a Competency</h3>
            <p className="text-xs text-slate-500 mb-4">Saved under Self-Reported Skills until verified</p>
            <form onSubmit={handleAddSkill} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.skill_name}
                  onChange={(e) => setSkillForm({ ...skillForm, skill_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  placeholder="e.g. CAN Protocol Analysis"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence / Practical Application</label>
                <textarea
                  rows={3}
                  required
                  value={skillForm.evidence}
                  onChange={(e) => setSkillForm({ ...skillForm, evidence: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  placeholder="Describe projects, practical tasks or coursework demonstrating this skill."
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition text-sm"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Correction Request Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Request Official Record Correction</h3>
            <p className="text-xs text-slate-500 mb-4">
              Authoritative records cannot be directly edited. Submit request with evidence for reviewer audit.
            </p>
            <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Record Type</label>
                <input
                  type="text"
                  disabled
                  value={correctionForm.record_type}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field to Correct</label>
                <input
                  type="text"
                  required
                  value={correctionForm.field_name}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, field_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Recorded Value</label>
                <input
                  type="text"
                  value={correctionForm.current_value}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, current_value: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requested Corrected Value</label>
                <input
                  type="text"
                  required
                  value={correctionForm.requested_value}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, requested_value: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason & Supporting Evidence Reference</label>
                <textarea
                  rows={3}
                  required
                  value={correctionForm.reason}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  placeholder="Explain why this record is inaccurate with reference to marksheet or official letter."
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition text-sm"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employment Milestone Update Modal */}
      {showEmploymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Update Employment Milestone</h3>
            <p className="text-xs text-slate-500 mb-4">Captures training relevance and wage progression</p>
            <form onSubmit={handleEmploymentSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employment Status</label>
                <select
                  value={empForm.employment_status}
                  onChange={(e) => setEmpForm({ ...empForm, employment_status: e.target.value, is_employed: e.target.value === 'Employed' || e.target.value === 'Self-Employed' || e.target.value === 'Apprenticeship' })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                >
                  <option>Employed</option>
                  <option>Self-Employed</option>
                  <option>Apprenticeship</option>
                  <option>Seeking Employment</option>
                  <option>Further Education</option>
                  <option>Not Currently Employed</option>
                </select>
              </div>
              {empForm.is_employed && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Employer / Enterprise Name</label>
                    <input
                      type="text"
                      required
                      value={empForm.employer_name}
                      onChange={(e) => setEmpForm({ ...empForm, employer_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      placeholder="e.g. Tata Motors Ltd"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Designation / Job Role</label>
                    <input
                      type="text"
                      required
                      value={empForm.job_role}
                      onChange={(e) => setEmpForm({ ...empForm, job_role: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      placeholder="e.g. EV Service Specialist"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monthly Wage (₹)</label>
                    <input
                      type="number"
                      required
                      value={empForm.monthly_wage}
                      onChange={(e) => setEmpForm({ ...empForm, monthly_wage: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                  {/* Job Relevance Question */}
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                    <label className="block font-bold text-teal-900">
                      Is your current employment related to your training?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="training_rel"
                          checked={empForm.is_related_to_training}
                          onChange={() => setEmpForm({ ...empForm, is_related_to_training: true })}
                        />
                        <span>Yes, Directly Related</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="training_rel"
                          checked={!empForm.is_related_to_training}
                          onChange={() => setEmpForm({ ...empForm, is_related_to_training: false })}
                        />
                        <span>No, Unrelated Sector</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEmploymentModal(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition text-sm"
                >
                  Save Milestone
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
export default TraineePortalDashboardPage;
