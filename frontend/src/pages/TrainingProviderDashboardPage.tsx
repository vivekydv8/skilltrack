import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api/client';
import {
  TraineeListItem,
  CurriculumInsightItem,
  FollowUpScheduleItem
} from '../types';
import {
  GraduationCap,
  Users,
  Award,
  Briefcase,
  AlertTriangle,
  Upload,
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
  FileSpreadsheet,
  X,
  FileText,
  Bell,
  Activity,
  Layers,
  Calendar
} from 'lucide-react';
import { TraineeDetailPage } from './TraineeDetailPage';
import { toast } from '../components/Toast';
import {
  MetricCard,
  InsightCard,
  TraineeJourneyKanban,
  TraineeKanbanItem,
  AttendanceCalendarHeatmap,
  AIChat,
  StatusBadge,
  DataFlowBanner,
  NotificationPanel
} from '../components/design-system';

export const TrainingProviderDashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const providerId = currentUser?.provider_id || 'prv-pune-01';
  const providerName = currentUser?.organization || 'Government ITI Pune (MSSDS Central Hub)';

  // Tabs
  const [activeTab, setActiveTab] = useState<'trainees' | 'pipeline' | 'curriculum' | 'outcomes' | 'followups'>('trainees');
  const [showNotifications, setShowNotifications] = useState(false);

  // State
  const [trainees, setTrainees] = useState<TraineeListItem[]>([]);
  const [curriculumInsights, setCurriculumInsights] = useState<CurriculumInsightItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [inspectTraineeId, setInspectTraineeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Add Trainee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGender, setNewGender] = useState('Male');
  const [newAge, setNewAge] = useState(21);
  const [newCategory, setNewCategory] = useState('OBC');
  const [newDistrict, setNewDistrict] = useState('Pune');
  const [newEducation, setNewEducation] = useState('12th Pass');
  const [newCourseId, setNewCourseId] = useState('crs-auto-01');

  // Import CSV Modal
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  // Outcome Update Modal
  const [updateTrainee, setUpdateTrainee] = useState<TraineeListItem | null>(null);
  const [placementEmployer, setPlacementEmployer] = useState('Tata Motors Ltd');
  const [placementRole, setPlacementRole] = useState('EV Service Technician');
  const [placementWage, setPlacementWage] = useState(22000);
  const [placementDate, setPlacementDate] = useState('2024-06-01');

  const loadData = async () => {
    try {
      setLoading(true);
      const [trnRes, currRes] = await Promise.all([
        fetchApi<TraineeListItem[]>(`/api/trainees?provider_id=${providerId}&role=training_provider`),
        fetchApi<CurriculumInsightItem[]>('/api/analytics/curriculum-insights')
      ]);
      setTrainees(trnRes);
      setCurriculumInsights(currRes);
    } catch (err) {
      console.warn('Error loading training provider data:', err);
      toast.error('Network Error', 'Could not refresh training provider data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [providerId]);

  // Handle Add Trainee
  const handleAddTrainee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/api/trainees', {
        method: 'POST',
        body: JSON.stringify({
          full_name: newFullName,
          primary_phone: newPhone,
          gender: newGender,
          age: Number(newAge),
          category: newCategory,
          district: newDistrict,
          education_level: newEducation,
          course_id: newCourseId,
          provider_id: providerId,
          enrolment_date: '2024-01-15',
          completion_date: '2024-05-15',
          attendance_percentage: 85.0,
          assessment_score: 75.0,
          certification_status: 'Certified',
          skills_tagged: ['Electrical Diagnostics', 'Vehicle Systems'],
          consent: {
            consent_given: true,
            consent_version: 'v1.2-2024-MH-SDED',
            purpose_of_use_text: 'Digital consent for placement tracking under SkillTrackAI.',
            allow_placement_tracking: true,
            allow_epfo_linking: true,
            allow_assisted_followup: true
          }
        })
      });
      setShowAddModal(false);
      setNewFullName('');
      setNewPhone('');
      loadData();
      toast.success('Trainee Enrolled', 'Trainee registered with unique Skill ID and digital consent.');
    } catch (err: any) {
      toast.error('Enrollment Failed', err.message || 'Could not register trainee.');
    }
  };

  // Handle CSV Import
  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiBase}/api/trainees/import-csv?provider_id=${providerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('skilltrack_token') || ''}`
        },
        body: formData
      });
      const data = await res.json();
      const msg = `Successfully imported ${data.count || 0} trainees via batch CSV!`;
      setImportResult(msg);
      toast.success('Batch CSV Imported', msg);
      loadData();
    } catch (err: any) {
      const errMsg = 'CSV import failed: ' + err.message;
      setImportResult(errMsg);
      toast.error('Import Failed', err.message || 'Could not parse batch CSV file.');
    } finally {
      setImporting(false);
    }
  };

  // Handle Placement Update
  const handleUpdatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTrainee) return;
    try {
      await fetchApi('/api/placements', {
        method: 'POST',
        body: JSON.stringify({
          trainee_id: updateTrainee.id,
          employer_name: placementEmployer,
          job_role: placementRole,
          monthly_wage: Number(placementWage),
          placement_date: placementDate,
          reporting_source: 'Training Provider (Institute Verified)',
          confidence_score: 50,
          notes: `Placement reported by ${currentUser?.name || 'Institute Head'} on ${new Date().toISOString()}`
        })
      });
      setUpdateTrainee(null);
      loadData();
      toast.success('Placement Recorded', 'Outcome updated with timestamp and confidence tracking.');
    } catch (err: any) {
      toast.error('Placement Failed', err.message || 'Could not record placement.');
    }
  };

  // Filtered trainees
  const filteredTrainees = trainees.filter(t => {
    const matchesSearch =
      t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.skill_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.trainee_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'all' || t.course_id === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  // Calculate Institute Metrics
  const totalEnrolled = trainees.length;
  const certifiedCount = trainees.filter(t => t.certification_status === 'Certified').length;
  const placedCount = trainees.filter(t => t.current_status === 'Placed' || t.current_status === 'Self-Employed').length;
  const certRate = totalEnrolled ? roundVal((certifiedCount / totalEnrolled) * 100) : 0;
  const placementRate = certifiedCount ? roundVal((placedCount / certifiedCount) * 100) : 0;

  function roundVal(n: number) {
    return Math.round(n * 10) / 10;
  }

  // Trainee Journey Kanban items
  const kanbanItems: TraineeKanbanItem[] = trainees.map(t => {
    let status: TraineeKanbanItem['status'] = 'Enrolled';
    if (t.current_status === 'Placed' || t.current_status === 'Self-Employed') status = 'Employment';
    else if (t.current_status === 'Offered' || t.current_status === 'Interviewing') status = 'Placement';
    else if (t.certification_status === 'Certified') status = 'Certified';
    else if (t.assessment_score > 0) status = 'Assessment';
    else if (t.attendance_percentage > 20) status = 'Training';

    return {
      id: t.id,
      name: t.full_name,
      course: t.course_name,
      district: t.district,
      attendancePct: t.attendance_percentage,
      placementEmployer: (t as any).employer_name || (t.current_status === 'Placed' ? 'Tata Motors Ltd' : undefined),
      wage: (t as any).monthly_wage || (t.current_status === 'Placed' ? 22000 : undefined),
      status
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-base font-bold text-slate-800">Loading Training Provider Workspace...</p>
          <p className="text-sm text-slate-500 mt-1">Retrieving cohort rosters, attendance, and curriculum insights</p>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-emerald-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  TRAINING PERFORMANCE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  RUN BETTER TRAINING
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>{providerName}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  DVET PUNE HUB
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
              <div className="font-semibold text-slate-200">{currentUser?.name || 'Suresh Gokhale'}</div>
              <div className="text-xs text-slate-400">Principal & Center Head</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-900 rounded-lg text-slate-200 hover:text-rose-200 transition font-semibold"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-950/80 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs py-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('trainees')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'trainees' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Trainees ({totalEnrolled})</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pipeline' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Student Pipeline</span>
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'curriculum' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Curriculum Insights</span>
            </button>
            <button
              onClick={() => setActiveTab('outcomes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'outcomes' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Placements</span>
            </button>
            <button
              onClick={() => setActiveTab('followups')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'followups' ? 'bg-teal-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Follow-Ups</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Animated Data Flow Banner */}
        <DataFlowBanner mode="pipeline" />

        {/* KPI Ribbon using MetricCard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            title="TOTAL TRAINEES"
            value={totalEnrolled}
            trend={{ value: 8.4, isPositive: true, label: 'vs last batch' }}
            sparklineData={[180, 195, 210, 235, 250, totalEnrolled]}
            source="Student Roster"
            confidence="Verified"
          />
          <MetricCard
            title="CERTIFIED"
            value={`${certRate}%`}
            subtitle={`${certifiedCount} certified`}
            trend={{ value: 4.1, isPositive: true, label: 'exam pass rate' }}
            sparklineData={[76, 79, 81, 83, 85, certRate]}
            source="DVET Exams"
            confidence="Verified"
          />
          <MetricCard
            title="PLACEMENT RATE"
            value={`${placementRate}%`}
            subtitle={`${placedCount} placed`}
            trend={{ value: 6.2, isPositive: true, label: 'hiring trend' }}
            sparklineData={[52, 58, 63, 67, 71, placementRate]}
            source="Employer Records"
            confidence="Verified"
          />
          <MetricCard
            title="6-MO RETENTION"
            value="78.5%"
            subtitle="continuous wage"
            trend={{ value: 3.8, isPositive: true, label: 'retention rate' }}
            sparklineData={[70, 72, 74, 76, 77.5, 78.5]}
            source="EPFO & Monthly Check"
            confidence="High"
          />
          <MetricCard
            title="SKILL GAPS"
            value="1 Alert"
            subtitle="EV Diagnostics"
            trend={{ value: -2, isPositive: true, label: 'gaps reduced' }}
            sparklineData={[4, 3, 2, 2, 1, 1]}
            source="Industry Feedback"
            confidence="High"
          />
          <MetricCard
            title="FOLLOW-UP RATE"
            value="86.2%"
            subtitle="digital outreach"
            trend={{ value: 5.0, isPositive: true, label: 'active' }}
            sparklineData={[72, 75, 79, 82, 85, 86.2]}
            source="Follow-up Bot"
            confidence="Verified"
          />
        </div>

        {/* TAB 1: TRAINEE MANAGEMENT & ATTENDANCE HEATMAP */}
        {activeTab === 'trainees' && (
          <div className="space-y-6">
            {/* Attendance Calendar Heatmap */}
            <AttendanceCalendarHeatmap
              cohortName="Automotive & EV Technician Batch MH-24"
              monthName="Current Term • 2024"
              averageAttendance={88.4}
            />
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Trainee Roster</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View student profiles, attendance, and exam scores.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCsvModal(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition border border-slate-300"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Import CSV</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Trainee</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name or Skill ID (e.g. ST-MH-7X42K9)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Courses</option>
                <option value="crs-auto-01">EV Technician</option>
                <option value="crs-elec-02">Industrial Automation & PLC</option>
                <option value="crs-it-03">Full Stack Cloud Support</option>
                <option value="crs-hlth-04">Healthcare & Dialysis</option>
              </select>
            </div>

            {/* Trainee Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Skill ID</th>
                    <th className="py-3 px-3">Trainee Name</th>
                    <th className="py-3 px-3">Course</th>
                    <th className="py-3 px-3">Attendance</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Missing Skills</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrainees.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-900">
                        {t.skill_id}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{t.full_name}</td>
                      <td className="py-3 px-3 text-slate-600">{t.course_name}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{t.attendance_percentage}%</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{t.assessment_score}/100</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.current_status === 'Placed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.current_status === 'Self-Employed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t.current_status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {t.missing_skills && t.missing_skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {t.missing_skills.slice(0, 2).map(ms => (
                              <span key={ms} className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] border border-red-200 font-semibold">
                                {ms}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => setInspectTraineeId(t.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition"
                        >
                          Skill Profile
                        </button>
                        <button
                          onClick={() => setUpdateTrainee(t)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded text-[11px] font-semibold transition border border-teal-200"
                        >
                          Record Outcome
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TRAINEE JOURNEY PIPELINE (KANBAN) */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <TraineeJourneyKanban
            trainees={kanbanItems}
            onSelectTrainee={(id) => setInspectTraineeId(id)}
          />
        </div>
      )}

      {/* TAB 3: CURRICULUM INSIGHTS */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <InsightCard
            title="AI CURRICULUM MISALIGNMENT REPORT"
            observed="Graduates from MH-AUTO-01 course show a 32% drop in direct placement offers across Pune & Chakan EV manufacturers."
            evidence={[
              "14 recent employer interview rejection records cite 'Lack of practical Battery Management System (BMS) diagnostics'",
              "Current syllabus dedicates 85% practical hours to ICE internal combustion engines and only 15% to high-voltage EV powertrains",
              "Direct recruitment tests by Tata Motors EV and Bajaj Auto evaluate CAN bus protocols and battery thermal diagnostics"
            ]}
            skillGap="EV Battery Management Systems (BMS) & High-Voltage CAN-Bus Diagnostics"
            contributingFactors={[
              "State vocational curriculum syllabus baseline was established prior to the 2023 EV adoption surge",
              "Workshop lab equipment lacks high-voltage diagnostic simulators and calibrated oscilloscope benches",
              "Rapid industry transition across Chakan-Talegaon manufacturing clusters requiring immediate EV technicians"
            ]}
            suggestedAction={{
              title: "Adopt 40-Hour EV Diagnostics Modular Bridge Course",
              description: "Integrate the industry-certified EV Technician bridge module into Weeks 11-14 before DVET assessment.",
              actionLabel: "Submit Curriculum Update to DVET",
              onAction: () => toast.success("Module Queued", "EV Diagnostics module has been sent to DVET curriculum board for accelerated sign-off.")
            }}
            confidenceScore={96}
            lastUpdated="DVET-AI Engine • Real-time"
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                INDUSTRY ALIGNMENT ENGINE • SECTION 4
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Curriculum Insights: Course → Missing Industry Skills
              </h3>
              <p className="text-xs text-slate-500">
                Direct feedback from Tata Motors, Bajaj Auto, L&T, and Infosys identifying syllabus deficits.
              </p>
            </div>

            <div className="space-y-4">
              {curriculumInsights.map((ci) => (
                <div
                  key={ci.course_id}
                  className={`p-5 rounded-2xl border-2 ${
                    ci.course_code === 'MH-AUTO-01'
                      ? 'border-amber-400 bg-amber-50/40'
                      : 'border-slate-200 bg-slate-50/50'
                  } space-y-3`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{ci.sector}</span>
                      <h4 className="text-base font-bold text-slate-900">{ci.course_name} ({ci.course_code})</h4>
                    </div>
                    {ci.missing_industry_skills.length > 0 && (
                      <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold self-start">
                        {ci.missing_industry_skills.length} Missing Industry Competencies
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Current Curriculum Skills */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-700">Taught in Syllabus:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {ci.current_skills.map(sk => (
                          <span key={sk} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills Identified by Industry */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="font-bold text-red-700">Missing from Syllabus (Employer Demand):</div>
                      <div className="flex flex-wrap gap-1.5">
                        {ci.missing_industry_skills.map(ms => (
                          <span key={ms} className="px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 font-bold">
                            ⚠ {ms}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Recommended Institute Action:</strong>{' '}
                      <span className="text-slate-700 font-medium">{ci.recommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

        {/* TAB 3: OUTCOME TRACKING */}
        {activeTab === 'outcomes' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Placement Outcomes</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track candidate job placements and verified employment status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Skill ID</th>
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Confidence Level</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trainees.slice(0, 15).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-900">{t.skill_id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{t.full_name}</td>
                      <td className="py-3 px-3">{t.current_status}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.confidence_level === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.confidence_level === 'CORROBORATED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {t.confidence_level || 'CORROBORATED'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setUpdateTrainee(t)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
                        >
                          Update Placement Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FOLLOW-UPS */}
        {activeTab === 'followups' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Post-Training Follow-Ups</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor candidate outreach and check-ins at 30, 90, 180, and 365 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-500">30-Day Checkpoint</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">94.8%</div>
                <div className="text-[11px] text-emerald-600 font-semibold">Responded via WhatsApp</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-500">90-Day Checkpoint</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">82.5%</div>
                <div className="text-[11px] text-emerald-600 font-semibold">Corroborated Retention</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-500">180-Day Checkpoint</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">74.0%</div>
                <div className="text-[11px] text-teal-600 font-semibold">Wage Progression Recorded</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-500">365-Day Checkpoint</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">68.2%</div>
                <div className="text-[11px] text-indigo-600 font-semibold">Longitudinal Active</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Trainee Detail Modal */}
      {inspectTraineeId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setInspectTraineeId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <TraineeDetailPage
              traineeId={inspectTraineeId}
              onBack={() => setInspectTraineeId(null)}
            />
          </div>
        </div>
      )}

      {/* Add Trainee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-base text-slate-900">Enrol New Trainee (Consent Verified)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTrainee} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh S. Shinde"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98220 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Course Assignment</label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="crs-auto-01">EV Technician (16 Weeks)</option>
                  <option value="crs-elec-02">Industrial Automation & PLC (14 Weeks)</option>
                  <option value="crs-it-03">Full Stack Cloud Application Support (20 Weeks)</option>
                  <option value="crs-hlth-04">Healthcare Assistant & Dialysis (18 Weeks)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border text-slate-600 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 inline mr-1" />
                Explicit digital consent version v1.2-2024-MH-SDED will be captured automatically.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700"
                >
                  Register & Generate Skill ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-base text-slate-900">Batch Ingestion via CSV</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCsvImport} className="space-y-4 text-xs">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer">
                <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-800 mb-1">Select Trainee Batch CSV</div>
                <p className="text-[11px] text-slate-500 mb-3">Columns: full_name, phone, gender, age, course_code, attendance</p>
                <input
                  type="file"
                  accept=".csv"
                  required
                  onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-600"
                />
              </div>

              {importResult && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 font-medium">
                  {importResult}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-3 py-2 border rounded-lg text-slate-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={importing || !csvFile}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  {importing ? 'Processing Batch...' : 'Ingest & Generate Skill IDs'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outcome Tracking Modal */}
      {updateTrainee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Record Placement Outcome</h3>
                <div className="text-xs text-slate-500">Skill ID: {updateTrainee.skill_id} • {updateTrainee.full_name}</div>
              </div>
              <button onClick={() => setUpdateTrainee(null)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdatePlacement} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Employer / Company Name</label>
                <input
                  type="text"
                  required
                  value={placementEmployer}
                  onChange={(e) => setPlacementEmployer(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Designation / Job Role</label>
                <input
                  type="text"
                  required
                  value={placementRole}
                  onChange={(e) => setPlacementRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Monthly Wage (₹)</label>
                  <input
                    type="number"
                    required
                    value={placementWage}
                    onChange={(e) => setPlacementWage(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={placementDate}
                    onChange={(e) => setPlacementDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                Every update carries: <strong>Source: Training Provider • Timestamp: Current • Status: Pending Employer Confirmation</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUpdateTrainee(null)}
                  className="px-3 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700"
                >
                  Save & Propagate Outcome
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
