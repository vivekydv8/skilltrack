export type UserRole = 
  | 'govt_admin' 
  | 'analyst' 
  | 'training_provider' 
  | 'provider' 
  | 'employer' 
  | 'field_officer' 
  | 'trainee';

export type ConfidenceLevel = 'VERIFIED' | 'CORROBORATED' | 'SELF-REPORTED' | 'AI-INFERRED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  provider_id?: string;
  employer_id?: string;
  trainee_id?: string;
}

export interface TraineeListItem {
  id: string;
  trainee_code: string;
  skill_id: string;
  full_name: string;
  primary_phone: string;
  primary_email?: string;
  gender: string;
  age: number;
  category: string;
  district: string;
  education_level: string;
  course_id: string;
  course_name: string;
  sector: string;
  provider_id: string;
  provider_name: string;
  enrolment_date: string;
  completion_date?: string;
  attendance_percentage: number;
  assessment_score: number;
  certification_status: string;
  current_status: string;
  confidence_level?: ConfidenceLevel;
  skills_tagged: string[];
  missing_skills?: string[];
  skill_match_pct?: number;
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  risk_factors: string[];
  consent_status: string;
  pii_masked: boolean;
}

export interface ConsentRecord {
  id: string;
  consent_given: boolean;
  consent_version: string;
  consent_timestamp: string;
  purpose_of_use_text: string;
  allow_placement_tracking: boolean;
  allow_epfo_linking: boolean;
  allow_assisted_followup: boolean;
  opted_out: boolean;
  opt_out_timestamp?: string;
  opt_out_reason?: string;
  deletion_requested: boolean;
  deletion_status: string;
  ip_address: string;
}

export interface AlternateContact {
  id: string;
  contact_type: string;
  contact_value: string;
  is_active: boolean;
  source: string;
  verified_at?: string;
}

export interface PlacementItem {
  id: string;
  employer_id?: string;
  employer_name: string;
  job_role: string;
  placement_type: string;
  monthly_wage: number;
  placement_date: string;
  confidence_score: number;
  confidence_level?: ConfidenceLevel;
  reporting_source: string;
  verification_status: string;
  offer_letter_uploaded: boolean;
  payslip_uploaded: boolean;
  notes?: string;
  has_mismatch?: boolean;
}

export interface EmploymentTimelineEntry {
  id: string;
  checkpoint: string;
  status: string;
  employer_name?: string;
  job_role?: string;
  monthly_wage: number;
  log_date: string;
  verified_by: string;
  verification_confidence: number;
  confidence_level?: ConfidenceLevel;
  source: string;
  job_relevance_score: number;
  is_same_employer_as_last: boolean;
  notes?: string;
}

export interface FollowUpScheduleItem {
  id: string;
  trainee_id: string;
  trainee_code: string;
  trainee_name: string;
  trainee_phone: string;
  district: string;
  course_name: string;
  provider_name: string;
  checkpoint: string;
  scheduled_date: string;
  triggered_date?: string;
  channel: string;
  status: 'Scheduled' | 'Sent' | 'Responded' | 'Escalated to Assisted' | 'Completed Assisted';
  attempt_count: number;
  survey_response?: any;
  escalated_at?: string;
  assigned_counsellor?: string;
  assisted_notes?: string;
}

export interface SelfEmploymentDetail {
  id: string;
  business_name: string;
  business_type: string;
  registration_type: string;
  registration_number?: string;
  monthly_revenue_band: string;
  people_employed: number;
  seed_capital_source: string;
  apprenticeship_stipend?: number;
  apprenticeship_duration_months?: number;
}

export interface JobMatchItem {
  job_id: string;
  job_title: string;
  company_name: string;
  location: string;
  salary_range: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
}

export interface TraineeDetail {
  id: string;
  trainee_code: string;
  skill_id: string;
  full_name: string;
  primary_phone: string;
  primary_email?: string;
  gender: string;
  age: number;
  category: string;
  district: string;
  education_level: string;
  course: {
    id: string;
    course_name: string;
    course_code: string;
    sector: string;
    curriculum_skills: string[];
  };
  provider: {
    id: string;
    name: string;
    district: string;
    grade: string;
  };
  enrolment_date: string;
  completion_date?: string;
  attendance_percentage: number;
  assessment_score: number;
  certification_status: string;
  current_status: string;
  confidence_level?: ConfidenceLevel;
  skills_tagged: string[];
  missing_skills?: string[];
  skill_match_pct?: number;
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  risk_factors: string[];
  consent?: ConsentRecord;
  alternate_contacts: AlternateContact[];
  placements: PlacementItem[];
  timeline_logs: EmploymentTimelineEntry[];
  self_employment?: SelfEmploymentDetail;
  follow_ups: FollowUpScheduleItem[];
  job_matches?: JobMatchItem[];
  pii_masked: boolean;
}

export interface ProviderLeaderboardItem {
  provider_id: string;
  provider_name: string;
  district: string;
  accreditation_grade?: string;
  grade?: string;
  enrolled_count?: number;
  total_candidates?: number;
  certified_count?: number;
  placed_count?: number;
  placement_rate_pct: number;
  avg_starting_wage: number;
  avg_6m_wage?: number;
  wage_growth_6m_pct?: number;
  wage_growth_pct?: number;
  retention_rate_pct: number;
  followup_compliance_pct: number;
  composite_score?: number;
}

export interface CohortFunnelItem {
  stage: string;
  count: number;
  conversion_pct: number;
  dropoff_pct: number;
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  user_role: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  purpose_declared: string;
  ip_address: string;
  timestamp: string;
}

export interface ExecutiveSummary {
  // Source provenance (Section 3 requirement)
  is_demo_synthetic_data?: boolean;
  is_synthetic_demo?: boolean;
  dataset_label?: string;
  source?: string;
  data_as_of?: string;
  data_period?: string;

  // Core counts — null = data not available from source
  total_trainees?: number | null;
  total_enrolled: number;
  certified: number;
  training_completed?: number | null;
  employed?: number | null;
  placed_wage: number;
  self_employed: number;
  apprenticeship: number;
  total_positive_outcomes: number;
  employability_rate_pct: number;

  // Rates — null means no verified data from source
  employment_rate?: number | null;
  relevant_employment_rate?: number | null;
  retention_90_day?: number | null;
  retention_180_day?: number | null;
  retention_365_day?: number | null;
  avg_starting_wage: number;
  average_wage?: number | null;

  // Alerts
  skill_gap_alerts?: number | null;
  high_risk_programmes?: number | null;
  high_risk_count: number;
  followup_response_rate_pct: number;

  // Confidence breakdown — null means no placement records
  confidence_breakdown?: {
    verified_pct: number;
    corroborated_pct: number;
    self_reported_pct: number;
    ai_inferred_pct: number;
  } | null;
}

export interface JobItem {
  id: string;
  employer_id: string;
  employer_name: string;
  job_title: string;
  industry: string;
  location: string;
  salary_range: string;
  salary_min: number;
  salary_max: number;
  required_skills: string[];
  experience_required: string;
  education_required: string;
  employment_type: string;
  vacancies: number;
  status: string;
  applicants_count: number;
  created_at: string;
}

export interface CandidateMatchItem {
  id: string;
  job_id: string;
  job_title: string;
  employer_id: string;
  employer_name: string;
  trainee_id: string;
  skill_id: string;
  trainee_code: string;
  candidate_name: string;
  district: string;
  course_name: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  status: string;
  offered_salary?: number;
  joining_date?: string;
  feedback_notes?: string;
}

export interface EarlyWarningAlert {
  id: string;
  district: string;
  sector: string;
  course_id: string;
  course_name: string;
  alert_title: string;
  severity: string;
  metric_drop: string;
  detected_skill_gap: string;
  root_cause: string;
  suggested_action: string;
  status: string;
  affected_trainees_count: number;
  expected_outcome_lift: string;
  evidence_signals: string[];
  demo_label: string;
}

export interface DrillDownSkill {
  skill_name: string;
  status: string;
  market_gap: boolean;
  risk_signal: string;
  root_cause: string;
  recommended_action: string;
  affected_cohort_size?: number;
  canonical_example?: string;
}

export interface DrillDownCourse {
  course_id: string;
  course_code: string;
  course_name: string;
  sector: string;
  trainees_count: number;
  placement_rate: number;
  has_critical_gap: boolean;
  skills: DrillDownSkill[];
}

export interface DrillDownInstitute {
  provider_id: string;
  provider_name: string;
  district: string;
  grade: string;
  courses: DrillDownCourse[];
}

export interface DrillDownDistrict {
  district: string;
  state: string;
  institutes: DrillDownInstitute[];
}

export interface DrillDownResponse {
  state: string;
  hierarchy_levels: string[];
  districts: DrillDownDistrict[];
}

export interface EntityMatchItem {
  id: string;
  trainee_id: string;
  skill_id: string;
  trainee_name: string;
  source_a_system: string;
  source_a_record: string;
  source_b_system: string;
  source_b_record: string;
  matched_attributes: Record<string, string>;
  confidence_pct: number;
  status: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface CurriculumInsightItem {
  course_id: string;
  course_code: string;
  course_name: string;
  sector: string;
  current_skills: string[];
  missing_industry_skills: string[];
  critical_gaps_count: number;
  moderate_gaps_count: number;
  recommendation: string;
  feedback_samples: Array<{
    skill: string;
    severity: string;
    notes: string;
  }>;
}

export interface WageRetentionPoint {
  checkpoint: string;
  avg_wage: number;
  retention_pct: number;
  sample_size?: number;
}

export interface EducationRecordItem {
  id: string;
  qualification: string;
  specialization?: string;
  institution: string;
  board_university: string;
  passing_year: number;
  percentage_cgpa: string;
  certificate_url?: string;
  verification_status: string;
  source: string;
  created_at?: string;
}

export interface TraineeDocumentItem {
  id: string;
  category: string;
  doc_type: string;
  title: string;
  file_name: string;
  file_url: string;
  file_size_kb: number;
  mime_type: string;
  issuer: string;
  issue_date: string;
  verification_status: string;
  source: string;
  access_permissions: string[];
  consent_status: string;
  extracted_data?: Record<string, any>;
  ocr_confidence: number;
  evidence_source: string;
  created_at?: string;
  verified_at?: string;
}

export interface TraineeAssessmentItem {
  id: string;
  assessment_name: string;
  assessment_date: string;
  score: number;
  max_score: number;
  percentage: number;
  competency_level: string;
  skills_evaluated: string[];
  result: string;
  verification_status: string;
  verified_by: string;
  evidence_doc_url?: string;
}

export interface TraineeCertificationItem {
  id: string;
  certificate_name: string;
  issuer: string;
  qualification: string;
  skills_certified: string[];
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  verification_status: string;
  source: string;
  document_url?: string;
}

export interface TraineeSkillItem {
  id: string;
  skill_name: string;
  proficiency: string;
  category: string;
  source: string;
  confidence: number;
  confidence_level: ConfidenceLevel;
  evidence: string;
  last_updated?: string;
}

export interface SkillGapItem {
  id: string;
  target_role: string;
  required_skills: string[];
  skills_have: string[];
  missing_skills: string[];
  evidence: string;
  recommended_action: string;
  computed_at?: string;
}

export interface JobMatchItem {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_district: string;
  industry: string;
  location: string;
  salary_range: string;
  salary_min: number;
  salary_max: number;
  experience_required: string;
  education_required: string;
  employment_type: string;
  vacancies: number;
  source: string;
  posted_date: string;
  explainable_match: {
    match_percentage: number;
    matching_skills: Array<{ skill: string; confidence_level: string }>;
    missing_skills: string[];
    education_match: string;
    experience_match: string;
    recommendation: string;
  };
}

export interface TraineeRecommendationItem {
  id: string;
  recommendation_type: string;
  title: string;
  description: string;
  reason_why: string;
  evidence: string;
  confidence: number;
  lineage_model: string;
  status: string;
  created_at?: string;
}

export interface WageProgressionStage {
  id?: string;
  stage: string;
  wage: number;
  source: string;
  verification_status: string;
  effective_date: string;
}

export interface TraineeNotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  is_read: boolean;
  action_url?: string;
  created_at?: string;
}

export interface ProfileCorrectionItem {
  id: string;
  record_type: string;
  field_name: string;
  current_value: string;
  requested_value: string;
  reason: string;
  status: string;
  reviewer_notes?: string;
  created_at?: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations: string[];
  evidence_sources: string[];
  created_at?: string;
}


