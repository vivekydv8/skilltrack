import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Index, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    role = Column(String(30), nullable=False)  # trainee, provider, employer, govt_admin, analyst, field_officer
    organization = Column(String(150), nullable=True)
    phone = Column(String(20), nullable=True)
    provider_id = Column(String(36), nullable=True)
    employer_id = Column(String(36), nullable=True)
    trainee_id = Column(String(36), nullable=True)
    password_hash = Column(String(255), nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)
    lockout_until = Column(DateTime, nullable=True)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_code = Column(String(30), unique=True, index=True, nullable=False)
    course_name = Column(String(150), nullable=False)
    sector = Column(String(80), nullable=False)
    duration_weeks = Column(Integer, default=12)
    nsqf_level = Column(Integer, default=4)
    curriculum_skills = Column(JSON, default=list)  # List of string skills
    created_at = Column(DateTime, default=datetime.utcnow)

    batches = relationship("Batch", back_populates="course")
    trainees = relationship("Trainee", back_populates="course")
    skill_feedbacks = relationship("EmployerSkillFeedback", back_populates="course")

class Provider(Base):
    __tablename__ = "providers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    provider_code = Column(String(30), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    district = Column(String(60), nullable=False)
    accreditation_grade = Column(String(10), default="A")
    contact_person = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    batches = relationship("Batch", back_populates="provider")
    trainees = relationship("Trainee", back_populates="provider")

class Batch(Base):
    __tablename__ = "batches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    batch_code = Column(String(40), unique=True, index=True, nullable=False)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    provider_id = Column(String(36), ForeignKey("providers.id"), nullable=False)
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)
    total_enrolled = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="batches")
    provider = relationship("Provider", back_populates="batches")
    trainees = relationship("Trainee", back_populates="batch")

class Employer(Base):
    __tablename__ = "employers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_name = Column(String(150), nullable=False)
    sector = Column(String(80), nullable=False)
    district = Column(String(60), nullable=False)
    contact_email = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=True)
    udyam_or_cin = Column(String(50), nullable=True)
    is_verified_partner = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    placements = relationship("PlacementRecord", back_populates="employer")
    validations = relationship("EmployerValidation", back_populates="employer")
    skill_feedbacks = relationship("EmployerSkillFeedback", back_populates="employer")
    job_postings = relationship("JobPosting", back_populates="employer", cascade="all, delete-orphan")

class Trainee(Base):
    __tablename__ = "trainees"

    id = Column(String(36), primary_key=True, default=generate_uuid)  # Persistent UUID surviving contact changes
    trainee_code = Column(String(40), unique=True, index=True, nullable=False)
    skill_id = Column(String(40), unique=True, index=True, nullable=True)  # Pseudonymous Skill ID e.g. ST-MH-7X42K9
    full_name = Column(String(100), nullable=False)
    primary_phone = Column(String(20), nullable=False)
    primary_email = Column(String(100), nullable=True)
    gender = Column(String(20), nullable=False)  # Male, Female, Transgender
    age = Column(Integer, nullable=False)
    category = Column(String(20), nullable=False)  # SC, ST, OBC, General, EWS, VJNT
    district = Column(String(60), nullable=False)
    education_level = Column(String(50), default="12th Pass")
    
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    provider_id = Column(String(36), ForeignKey("providers.id"), nullable=False)
    batch_id = Column(String(36), ForeignKey("batches.id"), nullable=True)
    
    enrolment_date = Column(String(20), nullable=False)
    completion_date = Column(String(20), nullable=True)
    attendance_percentage = Column(Float, default=85.0)
    assessment_score = Column(Float, default=72.0)
    certification_status = Column(String(40), default="Certified")  # Certified, In Training, Dropped Out, Not Certified
    current_status = Column(String(40), default="Placed")  # Placed, Self-Employed, Apprenticeship, Unemployed, Dropped Out
    confidence_level = Column(String(30), default="CORROBORATED")  # VERIFIED, CORROBORATED, SELF-REPORTED, AI-INFERRED
    
    skills_tagged = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    skill_match_pct = Column(Float, default=70.0)
    risk_score = Column(Float, default=0.15)  # 0.0 to 1.0 (ML output)
    risk_level = Column(String(20), default="Low")  # Low, Medium, High
    risk_factors = Column(JSON, default=list)
    date_of_birth = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    state = Column(String(60), default="Maharashtra")
    city = Column(String(60), nullable=True)
    pincode = Column(String(10), nullable=True)
    profile_photo_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    target_role = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="trainees")
    provider = relationship("Provider", back_populates="trainees")
    batch = relationship("Batch", back_populates="trainees")
    consent = relationship("ConsentRecord", back_populates="trainee", uselist=False)
    alternate_contacts = relationship("AlternateContact", back_populates="trainee", cascade="all, delete-orphan")
    placements = relationship("PlacementRecord", back_populates="trainee", cascade="all, delete-orphan")
    timeline_logs = relationship("EmploymentTimeline", back_populates="trainee", cascade="all, delete-orphan", order_by="EmploymentTimeline.log_date")
    follow_ups = relationship("FollowUpSchedule", back_populates="trainee", cascade="all, delete-orphan")
    self_employment = relationship("SelfEmploymentRecord", back_populates="trainee", uselist=False, cascade="all, delete-orphan")
    attrition_records = relationship("AttritionReason", back_populates="trainee", cascade="all, delete-orphan")
    job_applications = relationship("JobApplication", back_populates="trainee", cascade="all, delete-orphan")
    education_records = relationship("EducationRecord", back_populates="trainee", cascade="all, delete-orphan")
    documents = relationship("TraineeDocument", back_populates="trainee", cascade="all, delete-orphan")
    digilocker_connection = relationship("DigilockerConnection", back_populates="trainee", uselist=False, cascade="all, delete-orphan")
    assessments = relationship("TraineeAssessment", back_populates="trainee", cascade="all, delete-orphan")
    certifications = relationship("TraineeCertification", back_populates="trainee", cascade="all, delete-orphan")
    skills = relationship("TraineeSkill", back_populates="trainee", cascade="all, delete-orphan")
    skill_gap_records = relationship("SkillGapRecord", back_populates="trainee", cascade="all, delete-orphan")
    recommendations = relationship("TraineeRecommendation", back_populates="trainee", cascade="all, delete-orphan")
    wage_records = relationship("WageProgressionRecord", back_populates="trainee", cascade="all, delete-orphan")
    notifications = relationship("TraineeNotification", back_populates="trainee", cascade="all, delete-orphan")
    correction_requests = relationship("ProfileCorrectionRequest", back_populates="trainee", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="trainee", cascade="all, delete-orphan")

class ConsentRecord(Base):
    """Explicit digital consent capture with full audit trail"""
    __tablename__ = "consent_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), unique=True, nullable=False)
    consent_given = Column(Boolean, default=True)
    consent_version = Column(String(30), default="v1.2-2024-MH-SDED")
    consent_timestamp = Column(DateTime, default=datetime.utcnow)
    purpose_of_use_text = Column(Text, nullable=False)
    allow_placement_tracking = Column(Boolean, default=True)
    allow_epfo_linking = Column(Boolean, default=True)
    allow_assisted_followup = Column(Boolean, default=True)
    consent_digilocker_access = Column(Boolean, default=False)
    consent_document_processing = Column(Boolean, default=True)
    consent_ai_personalization = Column(Boolean, default=True)
    consent_employer_sharing = Column(Boolean, default=True)
    consent_govt_analytics = Column(Boolean, default=True)
    consent_job_recommendations = Column(Boolean, default=True)
    consent_training_recommendations = Column(Boolean, default=True)
    
    opted_out = Column(Boolean, default=False)
    opt_out_timestamp = Column(DateTime, nullable=True)
    opt_out_reason = Column(Text, nullable=True)
    deletion_requested = Column(Boolean, default=False)
    deletion_status = Column(String(30), default="None")  # None, Pending Review, Processed
    ip_address = Column(String(45), default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="consent")

class AlternateContact(Base):
    """Alternate contact history linking previous and current phone/address under persistent Trainee ID"""
    __tablename__ = "alternate_contacts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    contact_type = Column(String(30), nullable=False)  # phone, alternate_phone, guardian_phone, whatsapp, email, address
    contact_value = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=True)
    verified_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String(50), default="Registration")
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="alternate_contacts")

class PlacementRecord(Base):
    __tablename__ = "placement_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    employer_id = Column(String(36), ForeignKey("employers.id"), nullable=True)
    employer_name = Column(String(150), nullable=False)
    job_role = Column(String(100), nullable=False)
    placement_type = Column(String(40), default="Wage Employment")  # Wage Employment, Self-Employed, Apprenticeship
    monthly_wage = Column(Float, nullable=False)
    placement_date = Column(String(20), nullable=False)
    
    # Confidence Score:
    # 25: Trainee Self-Report
    # 50: Training Provider
    # 85: Employer Direct / Confirmed
    # 100: Document Verified (payslip/offer letter)
    confidence_score = Column(Integer, default=50)
    confidence_level = Column(String(30), default="CORROBORATED")  # VERIFIED, CORROBORATED, SELF-REPORTED, AI-INFERRED
    reporting_source = Column(String(50), default="Training Provider")
    verification_status = Column(String(30), default="Pending")  # Pending, Confirmed, Disputed, Document Verified
    
    offer_letter_uploaded = Column(Boolean, default=False)
    payslip_uploaded = Column(Boolean, default=False)
    document_url = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="placements")
    employer = relationship("Employer", back_populates="placements")
    validations = relationship("EmployerValidation", back_populates="placement")

class EmploymentTimeline(Base):
    """Append-only longitudinal timeline log for tracking career & wage trajectory"""
    __tablename__ = "employment_timeline"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    checkpoint = Column(String(30), nullable=False)  # 1 Month, 3 Months, 6 Months, 12 Months, Ad-hoc
    status = Column(String(40), nullable=False)  # Placed, Self-Employed, Apprenticeship, Unemployed, Dropped Out, Higher Studies
    employer_name = Column(String(150), nullable=True)
    job_role = Column(String(100), nullable=True)
    monthly_wage = Column(Float, default=0.0)
    log_date = Column(String(20), nullable=False)
    verified_by = Column(String(60), default="System Auto-Survey")
    verification_confidence = Column(Integer, default=50)
    confidence_level = Column(String(30), default="CORROBORATED")  # VERIFIED, CORROBORATED, SELF-REPORTED, AI-INFERRED
    source = Column(String(50), default="SMS/WhatsApp Survey")
    job_relevance_score = Column(Integer, default=4)  # 1 to 5 scale
    is_same_employer_as_last = Column(Boolean, default=True)  # Retention metric helper
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="timeline_logs")

class FollowUpSchedule(Base):
    """Automated & Assisted Follow-Up engine records"""
    __tablename__ = "follow_up_schedules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    checkpoint = Column(String(30), nullable=False)  # 1 Month, 3 Months, 6 Months, 12 Months
    scheduled_date = Column(String(20), nullable=False)
    triggered_date = Column(DateTime, nullable=True)
    channel = Column(String(30), default="WhatsApp")  # WhatsApp, SMS, IVR, Assisted Phone Call, Field Visit
    status = Column(String(30), default="Scheduled")  # Scheduled, Sent, Responded, Escalated to Assisted, Completed Assisted
    attempt_count = Column(Integer, default=0)
    survey_response = Column(JSON, nullable=True)
    survey_token = Column(String(64), unique=True, index=True, nullable=True)
    twilio_message_sid = Column(String(64), nullable=True)
    twilio_delivery_status = Column(String(32), default="not_sent")
    sms_recipient_phone = Column(String(24), nullable=True)
    escalated_at = Column(DateTime, nullable=True)
    assigned_counsellor = Column(String(100), nullable=True)
    assisted_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="follow_ups")

class EmployerValidation(Base):
    """Employer confirmation or dispute of placement record"""
    __tablename__ = "employer_validations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    placement_id = Column(String(36), ForeignKey("placement_records.id"), nullable=False)
    employer_id = Column(String(36), ForeignKey("employers.id"), nullable=False)
    action = Column(String(30), nullable=False)  # Confirmed, Disputed, Not Aware
    confirmed_wage = Column(Float, nullable=True)
    confirmed_role = Column(String(100), nullable=True)
    dispute_reason = Column(Text, nullable=True)
    has_mismatch = Column(Boolean, default=False)
    mismatch_details = Column(Text, nullable=True)
    action_timestamp = Column(DateTime, default=datetime.utcnow)
    action_by_user = Column(String(100), default="HR Officer")

    placement = relationship("PlacementRecord", back_populates="validations")
    employer = relationship("Employer", back_populates="validations")

class SelfEmploymentRecord(Base):
    """Self-employment and apprenticeship specific metrics"""
    __tablename__ = "self_employment_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), unique=True, nullable=False)
    business_name = Column(String(150), nullable=False)
    business_type = Column(String(60), nullable=False)  # Fabrication/Repair, Electrical Contractor, Retail, IT Freelance
    registration_type = Column(String(60), default="Udyam Registered")  # Udyam Registered, GST Registered, Trade License, Informal
    registration_number = Column(String(60), nullable=True)
    monthly_revenue_band = Column(String(40), default="₹15,000 - ₹30,000")
    people_employed = Column(Integer, default=1)  # Multiplier effect metric!
    seed_capital_source = Column(String(60), default="Self/Family Savings")  # MUDRA Loan, CMEGP Scheme, Savings
    apprenticeship_stipend = Column(Float, nullable=True)
    apprenticeship_duration_months = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="self_employment")

class AttritionReason(Base):
    """Structured capture of why trainees drop out or remain unemployed"""
    __tablename__ = "attrition_reasons"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    stage = Column(String(50), default="Post-Certification Pre-Placement")
    primary_reason = Column(String(80), nullable=False)  # Wage Too Low, Location Mismatch, Family Reasons, Further Study, etc.
    free_text_comment = Column(Text, nullable=True)
    logged_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="attrition_records")

class EmployerSkillFeedback(Base):
    """Employer feedback on curriculum skills vs actual job needs"""
    __tablename__ = "employer_skill_feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    employer_id = Column(String(36), ForeignKey("employers.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    importance_rating = Column(Integer, default=5)  # 1 to 5
    proficiency_observed = Column(Integer, default=3)  # 1 to 5
    gap_severity = Column(String(30), default="Moderate Gap")  # Critical Gap, Moderate Gap, Adequate, Exceeds
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="skill_feedbacks")
    employer = relationship("Employer", back_populates="skill_feedbacks")

class AuditLog(Base):
    """Accountability and privacy audit log"""
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_name = Column(String(100), nullable=False)
    user_role = Column(String(40), nullable=False)
    action = Column(String(60), nullable=False)  # VIEW_TRAINEE_PII, EXPORT_DATA, CONSENT_OPT_OUT, DELETION_REQUEST, etc.
    resource_type = Column(String(40), nullable=False)
    resource_id = Column(String(36), nullable=True)
    purpose_declared = Column(String(200), nullable=False)
    ip_address = Column(String(45), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow)

class JobPosting(Base):
    """Employer open job postings and industry skill demand"""
    __tablename__ = "job_postings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    employer_id = Column(String(36), ForeignKey("employers.id"), nullable=False)
    job_title = Column(String(150), nullable=False)
    industry = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    salary_range = Column(String(60), default="₹18,000 - ₹25,000 / month")
    salary_min = Column(Float, default=18000.0)
    salary_max = Column(Float, default=25000.0)
    required_skills = Column(JSON, default=list)  # e.g. ["EV Diagnostics", "BMS", "CAN Diagnostics"]
    experience_required = Column(String(50), default="0 - 2 Years (Fresher / ITI)")
    education_required = Column(String(80), default="ITI / Diploma in Automotive or Electrical")
    employment_type = Column(String(50), default="Full Time")
    status = Column(String(30), default="Open")  # Open, Closed, Paused
    vacancies = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)

    employer = relationship("Employer", back_populates="job_postings")
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")

class JobApplication(Base):
    """Candidate match & hiring outcome pipeline connecting Trainee and Job"""
    __tablename__ = "job_applications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("job_postings.id"), nullable=False)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    match_percentage = Column(Float, default=70.0)
    matched_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    status = Column(String(40), default="Matched")  # Matched, Shortlisted, Interviewed, Selected, Joined, Rejected, Employment Ended
    interview_date = Column(String(20), nullable=True)
    joining_date = Column(String(20), nullable=True)
    offered_salary = Column(Float, nullable=True)
    rejection_reason = Column(String(120), nullable=True)
    feedback_notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("JobPosting", back_populates="applications")
    trainee = relationship("Trainee", back_populates="job_applications")

class EntityMatch(Base):
    """Backend entity-resolution candidate records across fragmented MIS & Employer datasets"""
    __tablename__ = "entity_matches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    source_a_system = Column(String(80), default="Government MahaSwayam MIS")
    source_a_record = Column(String(150), nullable=False)  # e.g. "Rahul Kumar (MIS-MH-2024-884)"
    source_b_system = Column(String(80), default="Tata Motors HR Portal")
    source_b_record = Column(String(150), nullable=False)  # e.g. "R. Kumar (EMP-TT-992)"
    matched_attributes = Column(JSON, default=dict)
    confidence_pct = Column(Float, default=96.0)
    status = Column(String(30), default="Pending Review")  # Pending Review, Verified & Merged, Disputed
    reviewed_by = Column(String(100), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee")

class CurriculumIntervention(Base):
    """Government Early Warning Root Cause & Recommended Policy Interventions"""
    __tablename__ = "curriculum_interventions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    district = Column(String(60), nullable=False)
    sector = Column(String(80), nullable=False)
    detected_skill_gap = Column(String(120), nullable=False)  # e.g. "EV Diagnostics & BMS"
    risk_signal = Column(String(150), nullable=False)  # e.g. "Auto-sector employment ↓14% in Pune"
    root_cause = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String(40), default="Identified")  # Identified, Recommended, Module Introduced, Completed
    affected_trainees_count = Column(Integer, default=45)
    measured_employment_lift = Column(String(60), default="+18% Expected Placement Rate")
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course")

class EducationRecord(Base):
    """Trainee formal qualifications and board verification status"""
    __tablename__ = "education_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    qualification = Column(String(80), nullable=False)  # Class 10, Class 12, ITI, Diploma, Undergraduate, Postgraduate, Professional
    specialization = Column(String(120), nullable=True)
    institution = Column(String(150), nullable=False)
    board_university = Column(String(150), nullable=False)
    passing_year = Column(Integer, nullable=False)
    percentage_cgpa = Column(String(30), nullable=False)
    certificate_url = Column(String(255), nullable=True)
    verification_status = Column(String(40), default="Self-Reported")  # Self-Reported, Pending, Verified, Corroborated
    source = Column(String(80), default="Self-Entry")  # Self-Entry, Maharashtra State Board, DigiLocker, University Portal
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="education_records")

class TraineeDocument(Base):
    """Document Vault entries with OCR structured intelligence and verification status"""
    __tablename__ = "trainee_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    category = Column(String(40), nullable=False)  # Education, Skill & Training, Experience
    doc_type = Column(String(80), nullable=False)  # Marksheet, Degree, Diploma, ITI Certificate, Skill Certificate, Assessment Certificate, Apprenticeship Certificate, Experience Certificate, Salary Slip
    title = Column(String(150), nullable=False)
    file_name = Column(String(150), nullable=False)
    file_url = Column(String(255), nullable=False)
    file_size_kb = Column(Integer, default=240)
    mime_type = Column(String(50), default="application/pdf")
    issuer = Column(String(150), nullable=False)
    issue_date = Column(String(20), nullable=False)
    verification_status = Column(String(40), default="Pending")  # Pending, Verified, Corroborated, Self-Reported, Rejected
    source = Column(String(80), default="Manual Upload")  # Manual Upload, DigiLocker, Training Provider MIS, Employer Direct
    access_permissions = Column(JSON, default=lambda: ["trainee", "training_provider", "govt_admin"])
    consent_status = Column(String(30), default="Granted")  # Granted, Revoked
    extracted_data = Column(JSON, default=dict)  # Structured extraction from Document AI OCR
    ocr_confidence = Column(Float, default=0.0)
    evidence_source = Column(String(120), default="Document AI Extraction Pipeline")
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

    trainee = relationship("Trainee", back_populates="documents")

class DigilockerConnection(Base):
    """Authorized DigiLocker integration status & consent records"""
    __tablename__ = "digilocker_connections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), unique=True, nullable=False)
    is_connected = Column(Boolean, default=False)
    digilocker_id = Column(String(100), nullable=True)
    connected_at = Column(DateTime, nullable=True)
    last_sync_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="Not Configured")  # Not Configured, Authorized, Disconnected
    consent_granted = Column(Boolean, default=False)
    config_status = Column(Text, default="DigiLocker integration is not configured for this deployment.")
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="digilocker_connection")

class TraineeAssessment(Base):
    """Authorized assessment records from Training Providers & State Assessment Bodies"""
    __tablename__ = "trainee_assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    provider_id = Column(String(36), ForeignKey("providers.id"), nullable=True)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=True)
    assessment_name = Column(String(150), nullable=False)
    assessment_date = Column(String(20), nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, default=100.0)
    percentage = Column(Float, nullable=False)
    competency_level = Column(String(50), default="Level 2 - Intermediate")
    skills_evaluated = Column(JSON, default=list)
    result = Column(String(30), default="Pass")  # Pass, Distinction, Remedial Required
    verification_status = Column(String(40), default="Verified")  # Verified, Pending
    verified_by = Column(String(100), default="State Board of Vocational Education")
    evidence_doc_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="assessments")
    provider = relationship("Provider")
    course = relationship("Course")

class TraineeCertification(Base):
    """Authoritative digital credentials and certificates"""
    __tablename__ = "trainee_certifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    certificate_name = Column(String(150), nullable=False)
    issuer = Column(String(150), nullable=False)
    qualification = Column(String(100), nullable=False)
    skills_certified = Column(JSON, default=list)
    issue_date = Column(String(20), nullable=False)
    expiry_date = Column(String(20), nullable=True)
    credential_id = Column(String(80), nullable=True)
    verification_status = Column(String(40), default="Verified")  # Verified, Corroborated, Self-Reported
    source = Column(String(80), default="Training Provider")  # Training Provider, DigiLocker, NCVT/DGT, MSSDS
    document_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="certifications")

class TraineeSkill(Base):
    """Categorized skill profile with confidence levels and auditable evidence"""
    __tablename__ = "trainee_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(String(30), default="Intermediate")  # Beginner, Intermediate, Advanced, Expert
    category = Column(String(50), default="Training-Derived Skills")  # Verified Skills, Training-Derived Skills, Assessment-Derived Skills, Self-Reported Skills, AI-Inferred Skills
    source = Column(String(100), default="Course Curriculum")
    confidence = Column(Float, default=0.85)  # 0.0 to 1.0
    confidence_level = Column(String(30), default="CORROBORATED")  # VERIFIED, CORROBORATED, SELF-REPORTED, AI-INFERRED
    evidence = Column(Text, nullable=False)  # Traceable citation
    last_updated = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="skills")

class SkillGapRecord(Base):
    """Skill gap analysis comparing trainee verified profile against job/target requirements"""
    __tablename__ = "skill_gap_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    target_role = Column(String(100), nullable=False)
    required_skills = Column(JSON, default=list)
    skills_have = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    evidence = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    computed_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="skill_gap_records")

class TraineeRecommendation(Base):
    """AI and rule-engine evidence-grounded career recommendations"""
    __tablename__ = "trainee_recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    recommendation_type = Column(String(40), nullable=False)  # Skill, Course, Certification, Job, CareerPath, Project
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    reason_why = Column(Text, nullable=False)  # Explicit "WHY?"
    evidence = Column(Text, nullable=False)    # Grounded evidence source
    confidence = Column(Float, default=0.90)
    lineage_model = Column(String(80), default="SkillTrack-Employability-Intelligence-v1.0")
    status = Column(String(30), default="Active")  # Active, Accepted, Dismissed, Saved
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="recommendations")

class WageProgressionRecord(Base):
    """Longitudinal wage progression tracking across employment milestones"""
    __tablename__ = "wage_progression_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    stage = Column(String(40), nullable=False)  # Training, First Employment, 30 Days, 90 Days, 180 Days, 365 Days, Current
    wage = Column(Float, nullable=False)
    source = Column(String(100), nullable=False)  # Training Stipend, Employer Payroll Confirmation, Self-Reported Survey, EPFO Verified
    verification_status = Column(String(30), default="CORROBORATED")  # VERIFIED, CORROBORATED, SELF-REPORTED
    effective_date = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="wage_records")

class TraineeNotification(Base):
    """Real-time system, training, and outcome alerts for Trainee"""
    __tablename__ = "trainee_notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(40), default="training")  # training, assessment, certificate, verification, job_match, skill_gap, recommendation, followup, consent
    is_read = Column(Boolean, default=False)
    action_url = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="notifications")

class ChatSession(Base):
    """SkillTrackAI Assistant conversational sessions"""
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    title = Column(String(150), default="Career & Skills Query")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")

class ChatMessage(Base):
    """Profile-grounded, zero-hallucination chat message with lineage citations"""
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    citations = Column(JSON, default=list)  # Direct citations of verified records
    evidence_sources = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class ProfileCorrectionRequest(Base):
    """Auditable correction request for government or provider-owned records"""
    __tablename__ = "profile_correction_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), ForeignKey("trainees.id"), nullable=False)
    record_type = Column(String(50), nullable=False)  # Training, Assessment, Certification, Employment, Personal
    record_id = Column(String(50), nullable=True)
    field_name = Column(String(80), nullable=False)
    current_value = Column(Text, nullable=False)
    requested_value = Column(Text, nullable=False)
    evidence_doc_url = Column(String(255), nullable=True)
    reason = Column(Text, nullable=False)
    status = Column(String(30), default="Pending Review")  # Pending Review, Approved, Rejected
    reviewer_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    trainee = relationship("Trainee", back_populates="correction_requests")

class DigiLockerToken(Base):
    """Stores per-trainee DigiLocker OAuth2 tokens."""
    __tablename__ = "digilocker_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trainee_id = Column(String(36), nullable=False, unique=True, index=True)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    token_type = Column(String(50), default="Bearer")
    scope = Column(String(200), nullable=True)
    digilocker_user_id = Column(String(100), nullable=True)
    mobile_linked = Column(String(20), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    state_token = Column(String(200), nullable=True)  # CSRF state
    linked_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

