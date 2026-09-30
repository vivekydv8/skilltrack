from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    email: str
    role: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    organization: Optional[str] = None
    phone: Optional[str] = None

# Consent Schemas
class ConsentCaptureRequest(BaseModel):
    consent_given: bool = True
    consent_version: str = "v1.2-2024-MH-SDED"
    purpose_of_use_text: str = "I hereby authorize the Directorate of Vocational Education & Training (DVET), Govt of Maharashtra, to track post-training employability outcomes, verify employment records via employer portal, and facilitate assisted career progression services under SkillTrackAI."
    allow_placement_tracking: bool = True
    allow_epfo_linking: bool = True
    allow_assisted_followup: bool = True

class ConsentOptOutRequest(BaseModel):
    opt_out_reason: str
    request_data_deletion: bool = False

# Alternate Contact Schemas
class AlternateContactCreate(BaseModel):
    contact_type: str  # phone, alternate_phone, guardian_phone, whatsapp, address
    contact_value: str
    source: str = "Direct Update"

class AlternateContactResponse(BaseModel):
    id: str
    contact_type: str
    contact_value: str
    is_active: bool
    verified_at: Optional[datetime] = None
    source: str
    created_at: Optional[datetime] = None

# Trainee Schemas
class TraineeCreate(BaseModel):
    full_name: str
    primary_phone: str
    primary_email: Optional[str] = None
    gender: str
    age: int
    category: str
    district: str
    education_level: str = "12th Pass"
    course_id: str
    provider_id: str
    batch_id: Optional[str] = None
    enrolment_date: str
    completion_date: Optional[str] = None
    attendance_percentage: float = 85.0
    assessment_score: float = 75.0
    certification_status: str = "In Training"
    skills_tagged: List[str] = []
    consent: ConsentCaptureRequest

class TraineeUpdate(BaseModel):
    primary_phone: Optional[str] = None
    primary_email: Optional[str] = None
    attendance_percentage: Optional[float] = None
    assessment_score: Optional[float] = None
    certification_status: Optional[str] = None
    current_status: Optional[str] = None
    district: Optional[str] = None

# Placement Schemas
class PlacementCreate(BaseModel):
    trainee_id: str
    employer_id: Optional[str] = None
    employer_name: str
    job_role: str
    placement_type: str = "Wage Employment"
    monthly_wage: float
    placement_date: str
    reporting_source: str = "Training Provider"
    confidence_score: int = 50
    offer_letter_uploaded: bool = False
    payslip_uploaded: bool = False
    notes: Optional[str] = None

class EmployerValidationRequest(BaseModel):
    action: str  # Confirmed, Disputed, Not Aware
    confirmed_wage: Optional[float] = None
    confirmed_role: Optional[str] = None
    dispute_reason: Optional[str] = None
    action_by_user: str = "HR Manager"

# Timeline Schemas (Append-only)
class EmploymentTimelineAppend(BaseModel):
    checkpoint: str  # 1 Month, 3 Months, 6 Months, 12 Months, Ad-hoc
    status: str  # Placed, Self-Employed, Apprenticeship, Unemployed, Dropped Out, Higher Studies
    employer_name: Optional[str] = None
    job_role: Optional[str] = None
    monthly_wage: float = 0.0
    log_date: str
    verified_by: str = "Centre Counsellor"
    verification_confidence: int = 50
    source: str = "Assisted Outreach"
    job_relevance_score: int = 4
    is_same_employer_as_last: bool = True
    notes: Optional[str] = None

# Follow-Up Survey Schemas
class FollowUpTriggerRequest(BaseModel):
    channel: str = "WhatsApp"  # WhatsApp, SMS, IVR, Assisted Phone Call

class FollowUpSurveyResponse(BaseModel):
    is_employed: bool
    employment_type: str  # Wage Employment, Self-Employed, Apprenticeship, Unemployed, Higher Studies
    employer_or_business_name: Optional[str] = None
    job_role: Optional[str] = None
    monthly_wage: float = 0.0
    job_relevance_score: int = 4  # 1 to 5
    needs_counselling_support: bool = False
    feedback_notes: Optional[str] = None

class AssistedFollowUpLog(BaseModel):
    counsellor_name: str
    channel: str = "Assisted Phone Call"  # Assisted Phone Call, Field Visit
    status: str = "Completed Assisted"
    survey_response: FollowUpSurveyResponse
    assisted_notes: str

# Self-Employment Schemas
class SelfEmploymentCreate(BaseModel):
    trainee_id: str
    business_name: str
    business_type: str
    registration_type: str = "Udyam Registered"
    registration_number: Optional[str] = None
    monthly_revenue_band: str = "₹15,000 - ₹30,000"
    people_employed: int = 1  # Multiplier effect metric
    seed_capital_source: str = "Self/Family Savings"
    apprenticeship_stipend: Optional[float] = None
    apprenticeship_duration_months: Optional[int] = None

# Attrition Reason Schemas
class AttritionReasonCreate(BaseModel):
    trainee_id: str
    stage: str = "Post-Certification Pre-Placement"
    primary_reason: str
    free_text_comment: Optional[str] = None

# Risk Prediction Schemas
class RiskPredictionRequest(BaseModel):
    attendance_percentage: float
    assessment_score: float
    age: int
    gender: str
    category: str
    course_name: str
    district: str
    education_level: str

class RiskPredictionResponse(BaseModel):
    risk_score: float  # 0.0 to 1.0
    risk_level: str   # Low, Medium, High
    risk_factors: List[str]
    recommended_interventions: List[str]

# Audit Log Schemas
class AuditLogCreate(BaseModel):
    user_name: str
    user_role: str
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    purpose_declared: str
    ip_address: str = "127.0.0.1"

# Employer & Candidate Match Schemas
class JobCreate(BaseModel):
    employer_id: Optional[str] = None
    job_title: str
    industry: str
    location: str
    salary_range: Optional[str] = None
    salary_min: float = 18000.0
    salary_max: float = 25000.0
    required_skills: List[str] = []
    experience_required: str = "0 - 2 Years"
    education_required: str = "ITI / Diploma"
    employment_type: str = "Full Time"
    vacancies: int = 5

class JobResponse(BaseModel):
    id: str
    employer_id: str
    employer_name: Optional[str] = None
    job_title: str
    industry: str
    location: str
    salary_range: str
    salary_min: float
    salary_max: float
    required_skills: List[str]
    experience_required: str
    education_required: str
    employment_type: str
    vacancies: int
    status: str
    applicants_count: int = 0
    created_at: Optional[datetime] = None

class CandidateMatchResponse(BaseModel):
    id: str
    job_id: str
    job_title: str
    employer_name: str
    trainee_id: str
    skill_id: str
    candidate_name: str
    district: str
    course_name: str
    match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    status: str
    offered_salary: Optional[float] = None
    updated_at: Optional[datetime] = None

class HiringOutcomeRequest(BaseModel):
    status: str  # Interviewed, Selected, Joined, Rejected, Employment Ended
    offered_salary: Optional[float] = None
    joining_date: Optional[str] = None
    rejection_reason: Optional[str] = None
    feedback_notes: Optional[str] = None

class TraineeEmploymentSelfUpdate(BaseModel):
    is_employed: bool
    employment_type: str = "Wage Employment"  # Wage Employment, Self-Employed, Apprenticeship, Unemployed
    employer_name: Optional[str] = None
    job_role: Optional[str] = None
    monthly_wage: float = 0.0
    joining_date: Optional[str] = None
    location: Optional[str] = None
    job_relevance_rating: int = 4
    notes: Optional[str] = None

class EntityResolutionReviewRequest(BaseModel):
    action: str  # Merged, Dismissed
    notes: Optional[str] = None
