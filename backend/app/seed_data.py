import random
import string
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import (
    User, Course, Provider, Batch, Employer, Trainee, ConsentRecord,
    AlternateContact, PlacementRecord, EmploymentTimeline, FollowUpSchedule,
    EmployerValidation, SelfEmploymentRecord, AttritionReason, EmployerSkillFeedback,
    AuditLog, JobPosting, JobApplication, EntityMatch, CurriculumIntervention
)
from app.security import hash_password
from app.ml_risk_model import risk_engine

def generate_skill_id(seq_num: int) -> str:
    """Generate canonical pseudonymous Skill ID format: ST-MH-XXXXXX"""
    chars = string.ascii_uppercase + string.digits
    rnd = ''.join(random.choices(chars, k=6))
    return f"ST-MH-{rnd}"

def seed_database(db: Session, force: bool = False):
    # Check if database is already seeded
    if not force and db.query(Course).count() > 0:
        print("[SEED] Database already contains records. Skipping seed.")
        return

    if force:
        print("[SEED] Force re-seeding database with complete state-level data...")
        # Clear tables in proper dependency order
        db.query(JobApplication).delete()
        db.query(JobPosting).delete()
        db.query(EntityMatch).delete()
        db.query(CurriculumIntervention).delete()
        db.query(EmployerSkillFeedback).delete()
        db.query(AuditLog).delete()
        db.query(AttritionReason).delete()
        db.query(SelfEmploymentRecord).delete()
        db.query(EmployerValidation).delete()
        db.query(FollowUpSchedule).delete()
        db.query(EmploymentTimeline).delete()
        db.query(PlacementRecord).delete()
        db.query(AlternateContact).delete()
        db.query(ConsentRecord).delete()
        db.query(Trainee).delete()
        db.query(Batch).delete()
        db.query(Employer).delete()
        db.query(Provider).delete()
        db.query(Course).delete()
        db.query(User).delete()
        db.commit()

    print("[SEED] Seeding database with realistic Maharashtra skilling & employability intelligence data...")

    default_hashed_pwd = hash_password("Demo@123")

    # 1. System Users with Secure Hashes and Official Identifiers
    users = [
        # Official Launch Ready Accounts
        User(
            id="GOV-ADMIN-01",
            name="Dr. Anand Patil, IAS",
            email="gov.admin@skilltrack.gov.in",
            role="govt_admin",
            organization="Directorate of Vocational Education & Training (DVET), Maharashtra",
            phone="+91 98220 11223",
            password_hash=hash_password("GovAdmin@2025")
        ),
        User(
            id="ITI-PUNE-01",
            name="Suresh Gokhale",
            email="iti.pune@skilltrack.gov.in",
            role="training_provider",
            organization="Government ITI Pune (MSSDS Skilling Hub)",
            provider_id="prv-pune-01",
            phone="+91 94220 33445",
            password_hash=hash_password("ItiHead@2025")
        ),
        User(
            id="EMP-TATA-01",
            name="Vikram Shinde",
            email="employer@tatamotors.com",
            role="employer",
            organization="Tata Motors Ltd (EV Division, Pune)",
            employer_id="emp-tata-01",
            phone="+91 98900 44556",
            password_hash=hash_password("TataMotors@2025")
        ),
        User(
            id="ST-MH-7X42K9",
            name="Rahul Kumar",
            email="rahul.kumar@skilltrack.in",
            role="trainee",
            organization="SkillTrack Certified Trainee (EV Diagnostics)",
            trainee_id="trn-mh-2024-0042",
            phone="+91 98231 66778",
            password_hash=hash_password("Trainee@2025")
        ),
        User(
            id="usr-gov-admin-demo",
            name="Dr. Anand Patil, IAS",
            email="gov.admin@skilltrack.demo",
            role="govt_admin",
            organization="Dept of Skills, Employment, Entrepreneurship & Innovation, Govt of Maharashtra",
            phone="+91 98220 11223",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-training-demo",
            name="Suresh Gokhale",
            email="training.demo@skilltrack.demo",
            role="training_provider",
            organization="Government ITI Pune (MSSDS Central Hub)",
            provider_id="prv-pune-01",
            phone="+91 94220 33445",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-employer-demo",
            name="Vikram Shinde",
            email="employer.demo@skilltrack.demo",
            role="employer",
            organization="Tata Motors Ltd (EV Division, Pune)",
            employer_id="emp-tata-01",
            phone="+91 98900 44556",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-trainee-demo",
            name="Rahul Kumar",
            email="trainee.demo@skilltrack.demo",
            role="trainee",
            organization="SkillTrack Certified Trainee",
            trainee_id="trn-mh-2024-0042",
            phone="+91 98231 66778",
            password_hash=default_hashed_pwd
        ),
        # Legacy & Specialist Users
        User(
            id="usr-admin-1",
            name="Dr. Anand Patil, IAS",
            email="director.sded@maharashtra.gov.in",
            role="govt_admin",
            organization="Dept of Skills, Employment, Entrepreneurship & Innovation, Govt of Maharashtra",
            phone="+91 98220 11223",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-analyst-1",
            name="Pooja Deshmukh",
            email="pooja.analyst@mahaskill.in",
            role="analyst",
            organization="Maharashtra Skill Research & Analytics Cell",
            phone="+91 98221 22334",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-provider-1",
            name="Suresh Gokhale",
            email="centerhead.pune@mssds.org",
            role="training_provider",
            organization="Demo ITI Pune (MSSDS Central Hub)",
            provider_id="prv-pune-01",
            phone="+91 94220 33445",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-employer-1",
            name="Vikram Shinde",
            email="hr.placements@tatamotors.com",
            role="employer",
            organization="Tata Motors Ltd (Pune)",
            employer_id="emp-tata-01",
            phone="+91 98900 44556",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-field-1",
            name="Sunita Kamble",
            email="sunita.counsellor@mssds.org",
            role="field_officer",
            organization="District Employment & Guidance Center, Pune",
            phone="+91 97650 55667",
            password_hash=default_hashed_pwd
        ),
        User(
            id="usr-trainee-1",
            name="Prashant Jadhav",
            email="prashant.j@gmail.com",
            role="trainee",
            organization="Certified Trainee Alumni",
            trainee_id="trn-mh-2024-0001",
            phone="+91 98231 66778",
            password_hash=default_hashed_pwd
        ),
    ]
    db.add_all(users)
    db.flush()

    # 2. Courses
    courses = [
        Course(
            id="crs-auto-01",
            course_code="MH-AUTO-01",
            course_name="EV Technician",
            sector="Automotive & EV",
            duration_weeks=16,
            nsqf_level=5,
            curriculum_skills=["Electrical Diagnostics", "Vehicle Systems", "Wiring Harness Assembly", "High Voltage Safety", "Cell Packaging"]
        ),
        Course(
            id="crs-elec-02",
            course_code="MH-ELE-02",
            course_name="Industrial Automation & PLC Technician",
            sector="Electronics & Hardware",
            duration_weeks=14,
            nsqf_level=4,
            curriculum_skills=["Siemens S7-1200 PLC", "Ladder Logic", "Pneumatics & Hydraulics", "SCADA Basics", "Sensor Calibration"]
        ),
        Course(
            id="crs-it-03",
            course_code="MH-IT-03",
            course_name="Full Stack Cloud Application Support",
            sector="IT & BPM",
            duration_weeks=20,
            nsqf_level=5,
            curriculum_skills=["Linux Admin", "Python/Node.js", "SQL & Database Mgmt", "Docker Basics", "Cloud Support & Troubleshooting"]
        ),
        Course(
            id="crs-hlth-04",
            course_code="MH-HLTH-04",
            course_name="Healthcare Assistant & Dialysis Support",
            sector="Healthcare & Life Sciences",
            duration_weeks=18,
            nsqf_level=4,
            curriculum_skills=["Vital Signs Monitoring", "Infection Control Protocols", "Dialyzer Priming", "Patient Care Documentation", "CPR & First Aid"]
        ),
        Course(
            id="crs-solar-05",
            course_code="MH-SOL-05",
            course_name="Solar PV & Renewable Energy Technician",
            sector="Clean Energy",
            duration_weeks=12,
            nsqf_level=4,
            curriculum_skills=["Solar PV Inverter Setup", "Roof Mounting", "Grid Synchronization", "Earthing & Lightning Protection"]
        )
    ]
    db.add_all(courses)
    db.flush()

    # 3. Training Providers / ITIs
    providers = [
        Provider(
            id="prv-pune-01",
            provider_code="PRV-PUNE-01",
            name="Demo ITI Pune (MSSDS Central Hub)",
            district="Pune",
            accreditation_grade="A+",
            contact_person="Suresh Gokhale",
            phone="+91 94220 33445",
            email="pune.center@mssds.org"
        ),
        Provider(
            id="prv-nagpur-02",
            provider_code="PRV-NAGPUR-02",
            name="Tata STRIVE Skill Development Center (Nagpur)",
            district="Nagpur",
            accreditation_grade="A+",
            contact_person="Manish Tiwari",
            phone="+91 98230 77889",
            email="nagpur.strive@tatas.com"
        ),
        Provider(
            id="prv-nashik-03",
            provider_code="PRV-NASHIK-03",
            name="Don Bosco Technical Institute (Nashik)",
            district="Nashik",
            accreditation_grade="A",
            contact_person="Fr. Francis D'souza",
            phone="+91 98222 99001",
            email="nashik.tech@donbosco.org"
        ),
        Provider(
            id="prv-chhatrapati-04",
            provider_code="PRV-CS-04",
            name="Government ITI Chhatrapati Sambhajinagar",
            district="Chhatrapati Sambhajinagar",
            accreditation_grade="A",
            contact_person="Rameshwar Deshmukh",
            phone="+91 94231 44556",
            email="iti.csambhajinagar@dvet.gov.in"
        ),
        Provider(
            id="prv-mumbai-05",
            provider_code="PRV-MUM-05",
            name="MSSDS Advanced Training Academy (Thane / Mumbai)",
            district="Mumbai Suburban",
            accreditation_grade="A+",
            contact_person="Neeta Sawant",
            phone="+91 98200 88990",
            email="mumbai.academy@mssds.org"
        )
    ]
    db.add_all(providers)
    db.flush()

    # 4. Batches
    batches = [
        Batch(id="btc-ev-pune-2024a", batch_code="EV-PUN-2024-Q1", course_id="crs-auto-01", provider_id="prv-pune-01", start_date="2024-01-15", end_date="2024-05-15", total_enrolled=25),
        Batch(id="btc-plc-nagpur-2024a", batch_code="PLC-NAG-2024-Q1", course_id="crs-elec-02", provider_id="prv-nagpur-02", start_date="2024-02-01", end_date="2024-05-30", total_enrolled=25),
        Batch(id="btc-it-pune-2024b", batch_code="IT-PUN-2024-Q2", course_id="crs-it-03", provider_id="prv-pune-01", start_date="2024-03-01", end_date="2024-07-31", total_enrolled=20),
        Batch(id="btc-hlth-nashik-2024a", batch_code="HLTH-NSK-2024-Q1", course_id="crs-hlth-04", provider_id="prv-nashik-03", start_date="2024-01-10", end_date="2024-05-20", total_enrolled=20),
        Batch(id="btc-sol-cs-2024a", batch_code="SOL-CS-2024-Q1", course_id="crs-solar-05", provider_id="prv-chhatrapati-04", start_date="2024-02-15", end_date="2024-05-15", total_enrolled=20)
    ]
    db.add_all(batches)
    db.flush()

    # 5. Employers
    employers = [
        Employer(
            id="emp-tata-01",
            company_name="Tata Motors Ltd (EV Division, Pune)",
            sector="Automotive & EV",
            district="Pune",
            contact_email="placements@tatamotors.com",
            contact_phone="+91 20 6613 0000",
            udyam_or_cin="L28920MH1945PLC004520",
            is_verified_partner=True
        ),
        Employer(
            id="emp-bajaj-02",
            company_name="Bajaj Auto Ltd (Chakan Works)",
            sector="Automotive & EV",
            district="Pune",
            contact_email="recruitment@bajajauto.co.in",
            contact_phone="+91 20 2747 2851",
            udyam_or_cin="L65993PN2007PLC130076",
            is_verified_partner=True
        ),
        Employer(
            id="emp-infosys-03",
            company_name="Infosys BPM Ltd (Hinjewadi DC)",
            sector="IT & BPM",
            district="Pune",
            contact_email="campus.bpm@infosys.com",
            contact_phone="+91 20 2293 2800",
            udyam_or_cin="U72200KA2002PLC030310",
            is_verified_partner=True
        ),
        Employer(
            id="emp-apollo-04",
            company_name="Apollo Hospitals & Health City",
            sector="Healthcare & Life Sciences",
            district="Nashik",
            contact_email="hr.nashik@apollohospitals.com",
            contact_phone="+91 253 660 0000",
            udyam_or_cin="L85110TN1979PLC008035",
            is_verified_partner=True
        ),
        Employer(
            id="emp-thermax-05",
            company_name="Thermax Clean Energy Systems Ltd",
            sector="Electronics & Hardware",
            district="Pune",
            contact_email="talent@thermaxglobal.com",
            contact_phone="+91 20 6605 1200",
            udyam_or_cin="L29299PN1980PLC022787",
            is_verified_partner=True
        ),
        Employer(
            id="emp-lt-06",
            company_name="L&T Electrical & Automation Services",
            sector="Electronics & Hardware",
            district="Nagpur",
            contact_email="careers.eas@larsentoubro.com",
            contact_phone="+91 712 254 3300",
            udyam_or_cin="L99999MH1946PLC004768",
            is_verified_partner=True
        )
    ]
    db.add_all(employers)
    db.flush()

    # 6. Employer Job Postings (Open jobs with required skills)
    job_postings = [
        JobPosting(
            id="job-tata-01",
            employer_id="emp-tata-01",
            job_title="EV Service Technician",
            industry="Automotive & EV",
            location="Pune (Chakan EV Plant)",
            salary_range="₹22,000 - ₹28,000 / month",
            salary_min=22000.0,
            salary_max=28000.0,
            required_skills=["EV Diagnostics", "Battery Management", "CAN Diagnostics", "Electrical Diagnostics", "Vehicle Systems"],
            experience_required="0 - 2 Years (Fresher / ITI)",
            education_required="ITI / Diploma in Automotive or Electrical",
            employment_type="Full Time",
            vacancies=15,
            status="Open"
        ),
        JobPosting(
            id="job-bajaj-02",
            employer_id="emp-bajaj-02",
            job_title="EV Assembly & Battery Pack Technician",
            industry="Automotive & EV",
            location="Pune (Akurdi / Chakan)",
            salary_range="₹20,000 - ₹25,000 / month",
            salary_min=20000.0,
            salary_max=25000.0,
            required_skills=["Cell Packaging", "High Voltage Safety", "Wiring Harness Assembly", "BMS"],
            experience_required="0 - 1 Year",
            education_required="ITI Automobile / Electrician",
            employment_type="Full Time",
            vacancies=8,
            status="Open"
        ),
        JobPosting(
            id="job-lt-03",
            employer_id="emp-lt-06",
            job_title="Automation & PLC Commissioning Associate",
            industry="Electronics & Hardware",
            location="Nagpur (MIHAN SEZ)",
            salary_range="₹24,000 - ₹32,000 / month",
            salary_min=24000.0,
            salary_max=32000.0,
            required_skills=["Siemens S7-1200 PLC", "Ladder Logic", "Pneumatics & Hydraulics", "SCADA Basics"],
            experience_required="1 - 2 Years",
            education_required="Diploma / ITI Instrumentation",
            employment_type="Full Time",
            vacancies=6,
            status="Open"
        ),
        JobPosting(
            id="job-infy-04",
            employer_id="emp-infosys-03",
            job_title="Cloud Operations Support Specialist",
            industry="IT & BPM",
            location="Pune (Hinjewadi Phase II)",
            salary_range="₹25,000 - ₹35,000 / month",
            salary_min=25000.0,
            salary_max=35000.0,
            required_skills=["Linux Admin", "Python/Node.js", "Docker Basics", "Cloud Support & Troubleshooting"],
            experience_required="0 - 2 Years",
            education_required="B.Sc / BCA / 3-Year Diploma in CS/IT",
            employment_type="Full Time",
            vacancies=20,
            status="Open"
        ),
        JobPosting(
            id="job-apollo-05",
            employer_id="emp-apollo-04",
            job_title="Dialysis & Patient Care Technician",
            industry="Healthcare & Life Sciences",
            location="Nashik",
            salary_range="₹19,000 - ₹26,000 / month",
            salary_min=19000.0,
            salary_max=26000.0,
            required_skills=["Dialyzer Priming", "Vital Signs Monitoring", "Infection Control Protocols", "Patient Care Documentation"],
            experience_required="0 - 1 Year",
            education_required="Certification in Dialysis Assistance / GDA",
            employment_type="Full Time",
            vacancies=10,
            status="Open"
        ),
        JobPosting(
            id="job-thermax-06",
            employer_id="emp-thermax-05",
            job_title="Clean Energy & Solar Field Technician",
            industry="Electronics & Hardware",
            location="Pune / Shirwal",
            salary_range="₹21,000 - ₹27,000 / month",
            salary_min=21000.0,
            salary_max=27000.0,
            required_skills=["Solar PV Inverter Setup", "Roof Mounting", "Grid Synchronization", "Sensor Calibration"],
            experience_required="Fresher / ITI",
            education_required="ITI Electrician / Wireman",
            employment_type="Full Time",
            vacancies=12,
            status="Open"
        )
    ]
    db.add_all(job_postings)
    db.flush()

    # 7. Seed Canonical Trainee: ST-MH-7X42K9 (Rahul Kumar)
    # This is the exact demo trainee specified in Section 1, 3, 5, 6, 10, 28!
    canonical_id = "trn-mh-2024-0042"
    canonical_skill_id = "ST-MH-7X42K9"
    canonical_trainee = Trainee(
        id=canonical_id,
        trainee_code="MH-TRN-2024-0042",
        skill_id=canonical_skill_id,
        full_name="Rahul Kumar",
        primary_phone="+91 98231 66778",
        primary_email="rahul.kumar.demo@gmail.com",
        gender="Male",
        age=22,
        category="OBC",
        district="Pune",
        education_level="ITI Automobile Technician",
        course_id="crs-auto-01",  # EV Technician
        provider_id="prv-pune-01",  # Demo ITI Pune
        batch_id="btc-ev-pune-2024a",
        enrolment_date="2024-01-15",
        completion_date="2024-05-15",
        attendance_percentage=88.5,
        assessment_score=81.0,
        certification_status="Certified",
        current_status="Placed",
        confidence_level="CORROBORATED",
        skills_tagged=["Electrical Diagnostics", "Vehicle Systems", "Wiring Harness Assembly"],
        missing_skills=["EV Diagnostics", "BMS"],
        skill_match_pct=68.0,
        risk_score=0.74,
        risk_level="High",
        risk_factors=[
            "Critical missing industry skill: EV Diagnostics",
            "Employer job requirement mismatch (Tata Motors requires BMS & CAN diagnostics)",
            "Auto-sector transition to EV diagnostic scan tools"
        ]
    )
    db.add(canonical_trainee)
    db.flush()

    # Consent for Canonical Trainee
    db.add(ConsentRecord(
        id="cns-canonical-0042",
        trainee_id=canonical_id,
        consent_given=True,
        consent_version="v1.2-2024-MH-SDED",
        consent_timestamp=datetime(2024, 1, 16, 9, 30),
        purpose_of_use_text="I hereby grant explicit digital consent to Dept of Skills, Govt of Maharashtra, to track post-training employability, log employment timeline milestones, coordinate employer verifications, and provide career progression services under SkillTrackAI.",
        allow_placement_tracking=True,
        allow_epfo_linking=True,
        allow_assisted_followup=True,
        opted_out=False
    ))

    # Alternate Contact for Canonical Trainee
    db.add(AlternateContact(
        id="alt-canonical-0042",
        trainee_id=canonical_id,
        contact_type="guardian_phone",
        contact_value="+91 94220 88776",
        source="Registration Form",
        is_active=True
    ))

    # Placement Record for Canonical Trainee
    db.add(PlacementRecord(
        id="plc-canonical-0042",
        trainee_id=canonical_id,
        employer_id="emp-tata-01",
        employer_name="Tata Motors Ltd (EV Division, Pune)",
        job_role="EV Service Technician",
        placement_type="Wage Employment",
        monthly_wage=21500.0,
        placement_date="2024-06-01",
        confidence_score=75,
        confidence_level="CORROBORATED",
        reporting_source="Employer & Trainee Corroborated",
        verification_status="Confirmed",
        offer_letter_uploaded=True,
        payslip_uploaded=True,
        notes="Candidate reported salary ₹21,500/mo. Employer confirmed ₹21,500/mo. Placed in Chakan EV facility."
    ))

    # Longitudinal Timeline for Canonical Trainee
    # Training -> Certification -> Employment -> 90 Days -> 180 Days -> 365 Days
    db.add(EmploymentTimeline(
        id="tml-0042-tr",
        trainee_id=canonical_id,
        checkpoint="Training",
        status="Completed",
        employer_name=None,
        job_role="EV Technician Trainee",
        monthly_wage=0.0,
        log_date="2024-05-15",
        verified_by="Demo ITI Pune",
        verification_confidence=100,
        confidence_level="VERIFIED",
        source="Institute Assessment",
        job_relevance_score=5,
        notes="Completed 16-week coursework with 88.5% attendance."
    ))
    db.add(EmploymentTimeline(
        id="tml-0042-crt",
        trainee_id=canonical_id,
        checkpoint="Certification",
        status="Certified",
        employer_name=None,
        job_role="Certified EV Technician",
        monthly_wage=0.0,
        log_date="2024-05-20",
        verified_by="DVET Maharashtra Examination Board",
        verification_confidence=100,
        confidence_level="VERIFIED",
        source="MahaSwayam NCVT Portal",
        job_relevance_score=5,
        notes="Awarded NSQF Level 5 Certificate in EV Technician."
    ))
    db.add(EmploymentTimeline(
        id="tml-0042-emp",
        trainee_id=canonical_id,
        checkpoint="Employment",
        status="Placed",
        employer_name="Tata Motors Ltd (EV Division, Pune)",
        job_role="EV Service Technician",
        monthly_wage=21500.0,
        log_date="2024-06-01",
        verified_by="Tata Motors HR & Trainee",
        verification_confidence=85,
        confidence_level="CORROBORATED",
        source="Direct Employer Confirmation",
        job_relevance_score=4,
        notes="Hired into EV passenger vehicle servicing team at Chakan."
    ))
    db.add(EmploymentTimeline(
        id="tml-0042-90d",
        trainee_id=canonical_id,
        checkpoint="90 Days",
        status="Placed",
        employer_name="Tata Motors Ltd (EV Division, Pune)",
        job_role="EV Service Technician",
        monthly_wage=22500.0,
        log_date="2024-09-01",
        verified_by="Automated WhatsApp Survey",
        verification_confidence=75,
        confidence_level="CORROBORATED",
        source="WhatsApp Interactive Bot",
        job_relevance_score=4,
        notes="Retained at 90 days. Wage increment to ₹22,500."
    ))
    db.add(EmploymentTimeline(
        id="tml-0042-180d",
        trainee_id=canonical_id,
        checkpoint="180 Days",
        status="Placed",
        employer_name="Tata Motors Ltd (EV Division, Pune)",
        job_role="EV Service Technician",
        monthly_wage=24000.0,
        log_date="2024-12-01",
        verified_by="Employer Quarterly Payroll Confirmation",
        verification_confidence=85,
        confidence_level="CORROBORATED",
        source="Employer Batch Upload",
        job_relevance_score=4,
        notes="Retained at 180 days. Continuous wage progression."
    ))

    # Follow-Up Schedules for Canonical Trainee
    db.add(FollowUpSchedule(
        id="fu-0042-30d",
        trainee_id=canonical_id,
        checkpoint="1 Month",
        scheduled_date="2024-07-01",
        triggered_date=datetime(2024, 7, 1, 10, 0),
        channel="WhatsApp",
        status="Responded",
        attempt_count=1,
        survey_response={"is_employed": True, "employer": "Tata Motors Ltd", "wage": 21500, "satisfaction": 4}
    ))
    db.add(FollowUpSchedule(
        id="fu-0042-90d",
        trainee_id=canonical_id,
        checkpoint="3 Months",
        scheduled_date="2024-09-01",
        triggered_date=datetime(2024, 9, 1, 10, 15),
        channel="WhatsApp",
        status="Responded",
        attempt_count=1,
        survey_response={"is_employed": True, "employer": "Tata Motors Ltd", "wage": 22500, "satisfaction": 4}
    ))
    db.add(FollowUpSchedule(
        id="fu-0042-180d",
        trainee_id=canonical_id,
        checkpoint="6 Months",
        scheduled_date="2024-12-01",
        triggered_date=datetime(2024, 12, 1, 11, 0),
        channel="WhatsApp",
        status="Responded",
        attempt_count=1,
        survey_response={"is_employed": True, "employer": "Tata Motors Ltd", "wage": 24000, "satisfaction": 5}
    ))
    db.add(FollowUpSchedule(
        id="fu-0042-365d",
        trainee_id=canonical_id,
        checkpoint="12 Months",
        scheduled_date="2025-06-01",
        channel="WhatsApp",
        status="Scheduled",
        attempt_count=0
    ))

    # Job Application for Canonical Trainee to Tata Motors (Demonstrating Section 5 & 28)
    db.add(JobApplication(
        id="app-canonical-0042",
        job_id="job-tata-01",
        trainee_id=canonical_id,
        match_percentage=68.0,
        matched_skills=["Electrical Diagnostics", "Vehicle Systems"],
        missing_skills=["EV Diagnostics", "BMS"],
        status="Joined",
        offered_salary=21500.0,
        joining_date="2024-06-01",
        feedback_notes="Candidate has strong fundamental automotive electrical knowledge; needs in-house bridge training on EV battery diagnostics and CAN bus protocols."
    ))

    # 8. Generate Remaining 74 Trainees Across Maharashtra
    first_names = [
        "Prashant", "Rahul", "Pooja", "Sneha", "Kiran", "Nilesh", "Aniket", "Swapnil",
        "Priyanka", "Amol", "Vishal", "Kavita", "Sanjay", "Deepak", "Aarti", "Ganesh",
        "Pallavi", "Sachin", "Roshani", "Vikas", "Ashwini", "Rohan", "Tanvi", "Akshay",
        "Manisha", "Tushar", "Shweta", "Omkar", "Neha", "Manoj", "Kalyani", "Dinesh",
        "Vaishali", "Aditya", "Pratiksha", "Abhishek", "Mayur", "Shraddha", "Siddharth", "Megha"
    ]
    last_names = [
        "Jadhav", "Patil", "Deshmukh", "Shinde", "Kamble", "Kadam", "Gaikwad", "More",
        "Pawar", "Chavan", "Sawant", "Bhosale", "Wagh", "Sonawane", "Salunkhe", "Ingle",
        "Tambe", "Mane", "Ghuge", "Thorat", "Gawande", "Meshram", "Bansode", "Lokhande",
        "Bhat", "Kale", "Gore", "Joshi", "Borkar", "Pardeshi"
    ]
    districts = ["Pune", "Nagpur", "Nashik", "Mumbai Suburban", "Chhatrapati Sambhajinagar", "Amravati", "Solapur", "Kolhapur", "Thane"]
    categories = ["OBC", "General", "SC", "ST", "EWS", "VJNT"]
    category_weights = [0.35, 0.25, 0.18, 0.10, 0.07, 0.05]
    genders = ["Male", "Female"]
    gender_weights = [0.58, 0.42]

    for i in range(1, 76):
        if i == 42:
            continue  # Already seeded canonical trainee

        t_id = f"trn-mh-2024-{i:04d}"
        code = f"MH-TRN-2024-{i:04d}"
        skill_id = generate_skill_id(i)
        f_name = random.choice(first_names)
        l_name = random.choice(last_names)
        full_name = f"{f_name} {l_name}"
        gender = random.choices(genders, weights=gender_weights)[0]
        age = random.randint(19, 28)
        category = random.choices(categories, weights=category_weights)[0]
        district = random.choice(districts)
        phone = f"+91 9{random.randint(7000, 9999)}{random.randint(10000, 99999)}"
        email = f"{f_name.lower()}.{l_name.lower()}{i}@example.com"

        # Course & Provider assignment
        batch = batches[(i - 1) % len(batches)]
        course = next(c for c in courses if c.id == batch.course_id)
        provider = next(p for p in providers if p.id == batch.provider_id)

        # Performance metrics
        if i in [7, 14, 28, 59, 71]:
            attendance = round(random.uniform(52.0, 68.0), 1)
            score = round(random.uniform(45.0, 58.0), 1)
            cert_status = "In Training" if i in [59, 71] else "Completed Not Certified"
        else:
            attendance = round(random.uniform(76.0, 96.0), 1)
            score = round(random.uniform(66.0, 94.0), 1)
            cert_status = "Certified"

        if cert_status == "Completed Not Certified":
            current_status = "Unemployed"
        elif i in [59, 71]:
            current_status = "In Training"
        elif i % 7 == 0:
            current_status = "Self-Employed"
        elif i % 9 == 0:
            current_status = "Apprenticeship"
        elif i in [11, 23, 37]:
            current_status = "Unemployed"
        else:
            current_status = "Placed"

        eval_res = risk_engine.evaluate({
            "attendance_percentage": attendance,
            "assessment_score": score,
            "age": age,
            "gender": gender,
            "category": category,
            "course_name": course.course_name,
            "district": district
        })

        # Confidence level assignment
        if i % 3 == 0:
            conf_level = "VERIFIED"
            conf_score = 85
        elif i % 2 == 0:
            conf_level = "CORROBORATED"
            conf_score = 70
        else:
            conf_level = "SELF-REPORTED"
            conf_score = 45

        # Tagged skills
        tagged = random.sample(course.curriculum_skills, k=min(3, len(course.curriculum_skills)))
        missing = [s for s in course.curriculum_skills if s not in tagged]
        match_pct = round(len(tagged) / len(course.curriculum_skills) * 100, 1)

        trainee = Trainee(
            id=t_id,
            trainee_code=code,
            skill_id=skill_id,
            full_name=full_name,
            primary_phone=phone,
            primary_email=email,
            gender=gender,
            age=age,
            category=category,
            district=district,
            education_level=random.choice(["10th Pass", "12th Pass", "ITI / Diploma", "Graduate"]),
            course_id=course.id,
            provider_id=provider.id,
            batch_id=batch.id,
            enrolment_date=batch.start_date,
            completion_date=batch.end_date,
            attendance_percentage=attendance,
            assessment_score=score,
            certification_status=cert_status,
            current_status=current_status,
            confidence_level=conf_level,
            skills_tagged=tagged,
            missing_skills=missing,
            skill_match_pct=match_pct,
            risk_score=eval_res["risk_score"],
            risk_level=eval_res["risk_level"],
            risk_factors=eval_res["risk_factors"]
        )
        db.add(trainee)
        db.flush()

        # Consent
        db.add(ConsentRecord(
            id=f"cns-{i:04d}",
            trainee_id=trainee.id,
            consent_given=True,
            consent_version="v1.2-2024-MH-SDED",
            consent_timestamp=datetime.strptime(batch.start_date, "%Y-%m-%d") + timedelta(days=1),
            purpose_of_use_text="I grant consent to Dept of Skills, Govt of Maharashtra, to track post-training employability under SkillTrackAI.",
            allow_placement_tracking=True,
            allow_epfo_linking=True,
            allow_assisted_followup=True,
            opted_out=(i == 48)
        ))

        # Placements and Timeline
        base_wage = 18000 + (i % 8) * 1500
        chosen_emp = employers[(i - 1) % len(employers)]

        if current_status == "Placed":
            plc = PlacementRecord(
                id=f"plc-{i:04d}",
                trainee_id=trainee.id,
                employer_id=chosen_emp.id,
                employer_name=chosen_emp.company_name,
                job_role=f"{course.course_name.split()[0]} Associate",
                placement_type="Wage Employment",
                monthly_wage=float(base_wage),
                placement_date="2024-06-01",
                confidence_score=conf_score,
                confidence_level=conf_level,
                reporting_source="Employer Confirmed" if conf_level == "VERIFIED" else "Training Provider",
                verification_status="Confirmed" if conf_level in ["VERIFIED", "CORROBORATED"] else "Pending",
                offer_letter_uploaded=(i % 2 == 0),
                payslip_uploaded=(i % 3 == 0)
            )
            db.add(plc)

            # Timeline: 1M, 3M, 6M
            db.add(EmploymentTimeline(
                id=f"tml-1m-{i:04d}",
                trainee_id=trainee.id,
                checkpoint="1 Month",
                status="Placed",
                employer_name=chosen_emp.company_name,
                job_role=f"{course.course_name.split()[0]} Associate",
                monthly_wage=float(base_wage),
                log_date="2024-06-15",
                verified_by="System Auto-Survey",
                verification_confidence=conf_score,
                confidence_level=conf_level,
                source="SMS/WhatsApp Survey",
                job_relevance_score=4
            ))

            db.add(EmploymentTimeline(
                id=f"tml-3m-{i:04d}",
                trainee_id=trainee.id,
                checkpoint="3 Months",
                status="Placed",
                employer_name=chosen_emp.company_name,
                job_role=f"{course.course_name.split()[0]} Associate",
                monthly_wage=float(base_wage + 1000),
                log_date="2024-08-15",
                verified_by="Assisted Call / Direct Employer",
                verification_confidence=conf_score + 5,
                confidence_level=conf_level,
                source="Quarterly Verification",
                job_relevance_score=4
            ))

            if i <= 40:
                db.add(EmploymentTimeline(
                    id=f"tml-6m-{i:04d}",
                    trainee_id=trainee.id,
                    checkpoint="6 Months",
                    status="Placed",
                    employer_name=chosen_emp.company_name,
                    job_role=f"{course.course_name.split()[0]} Associate",
                    monthly_wage=float(base_wage + 2500),
                    log_date="2024-11-15",
                    verified_by="Employer Payroll Data",
                    verification_confidence=85,
                    confidence_level="VERIFIED",
                    source="Employer Validation",
                    job_relevance_score=4
                ))

        elif current_status == "Self-Employed":
            db.add(SelfEmploymentRecord(
                id=f"slf-{i:04d}",
                trainee_id=trainee.id,
                business_name=f"{full_name.split()[0]} Technical Solutions",
                business_type="Repair & Maintenance Workshop",
                registration_type="Udyam Registered",
                registration_number=f"UDYAM-MH-26-00{i:04d}",
                monthly_revenue_band="₹25,000 - ₹45,000",
                people_employed=2,
                seed_capital_source="MUDRA Loan (Shishu)"
            ))

        # Follow-Up Schedules
        is_escalated = (i in [3, 8, 15, 22, 33, 55, 67])
        db.add(FollowUpSchedule(
            id=f"fu-3m-{i:04d}",
            trainee_id=trainee.id,
            checkpoint="3 Months",
            scheduled_date="2024-08-15",
            triggered_date=datetime(2024, 8, 15, 10, 0),
            channel="Assisted Phone Call" if is_escalated else "WhatsApp",
            status="Escalated to Assisted" if is_escalated else "Responded",
            attempt_count=3 if is_escalated else 1,
            survey_response=None if is_escalated else {"is_employed": current_status in ["Placed", "Self-Employed"], "wage": base_wage}
        ))

        # Connect some trainees to JobPostings
        if current_status == "Placed" and i % 2 == 0:
            matching_job = job_postings[(i - 1) % len(job_postings)]
            db.add(JobApplication(
                id=f"app-seed-{i:04d}",
                job_id=matching_job.id,
                trainee_id=trainee.id,
                match_percentage=round(random.uniform(65.0, 92.0), 1),
                matched_skills=tagged[:2],
                missing_skills=missing[:2],
                status="Joined" if i % 4 != 0 else "Interviewed",
                offered_salary=float(base_wage)
            ))

    # 9. Government Early Warning & Recommended Policy Intervention (Section 15, 28)
    intervention = CurriculumIntervention(
        id="intv-pune-ev-01",
        course_id="crs-auto-01",
        district="Pune",
        sector="Automotive & EV",
        detected_skill_gap="EV Diagnostics & Battery Management System (BMS)",
        risk_signal="Auto-sector employment ↓14% in Pune district (Q2 2024)",
        root_cause="Automotive OEMs transitioning to high-voltage EV platforms require CAN protocol scanning and BMS fault diagnostics, competencies absent from legacy ITI curriculum.",
        recommended_action="Introduce targeted 40-hour EV Diagnostics / BMS module with diagnostic scanner hardware and battery pack test rigs at Demo ITI Pune and affiliated centres.",
        status="Action Initiated",
        affected_trainees_count=45,
        measured_employment_lift="+18% Expected Placement Rate"
    )
    db.add(intervention)

    # 10. Backend Entity Resolution Records (Section 12)
    entity_matches = [
        EntityMatch(
            id="ent-match-01",
            trainee_id=canonical_id,
            source_a_system="Government MahaSwayam MIS",
            source_a_record="Rahul Kumar (MIS-MH-2024-884, Pune)",
            source_b_system="Demo ITI Pune Register",
            source_b_record="Rahul K. (ITI Pune Roll #42)",
            matched_attributes={
                "name_similarity": "94%",
                "phone_match": "Exact (+91 98231*****78)",
                "dob_match": "Exact (2002-04-12)",
                "district": "Pune",
                "course": "EV Technician"
            },
            confidence_pct=96.0,
            status="Pending Review"
        ),
        EntityMatch(
            id="ent-match-02",
            trainee_id="trn-mh-2024-0002",
            source_a_system="Government MahaSwayam MIS",
            source_a_record="Pooja D. Deshmukh (MIS-MH-2024-912)",
            source_b_system="Tata Motors HR Portal",
            source_b_record="P. Deshmukh (EMP-TT-1048)",
            matched_attributes={
                "name_similarity": "91%",
                "phone_match": "Masked (+91 98221*****34)",
                "course": "Industrial Automation"
            },
            confidence_pct=92.0,
            status="Pending Review"
        )
    ]
    db.add_all(entity_matches)

    # 11. Employer Skill Feedback (Curriculum Insights for Training Providers)
    skill_feedbacks = [
        EmployerSkillFeedback(course_id="crs-auto-01", employer_id="emp-tata-01", skill_name="EV Diagnostics", importance_rating=5, proficiency_observed=2, gap_severity="Critical Gap", feedback_notes="Urgent: Technicians lack practical diagnostics on live EV battery packs and CAN communication buses."),
        EmployerSkillFeedback(course_id="crs-auto-01", employer_id="emp-tata-01", skill_name="Battery Management (BMS)", importance_rating=5, proficiency_observed=2, gap_severity="Critical Gap", feedback_notes="Thermal runaway and cell balancing fault-finding needed."),
        EmployerSkillFeedback(course_id="crs-auto-01", employer_id="emp-bajaj-02", skill_name="CAN Diagnostics", importance_rating=4, proficiency_observed=3, gap_severity="Moderate Gap", feedback_notes="CAN analyzer tool usage needs inclusion in practical labs."),
        EmployerSkillFeedback(course_id="crs-elec-02", employer_id="emp-lt-06", skill_name="Siemens S7-1200 PLC", importance_rating=5, proficiency_observed=3, gap_severity="Moderate Gap", feedback_notes="Analog sensor configuration requires additional lab hours."),
        EmployerSkillFeedback(course_id="crs-it-03", employer_id="emp-infosys-03", skill_name="Docker Basics", importance_rating=4, proficiency_observed=2, gap_severity="Critical Gap", feedback_notes="Container debugging needs reinforcement in the curriculum.")
    ]
    db.add_all(skill_feedbacks)

    # 12. Accountability Audit Logs
    audit_samples = [
        AuditLog(user_name="Dr. Anand Patil, IAS", user_role="govt_admin", action="VIEW_STATE_DASHBOARD", resource_type="StateAnalytics", resource_id="MH-STATE", purpose_declared="Quarterly Skilling Committee Executive Review", ip_address="10.150.12.4"),
        AuditLog(user_name="Dr. Anand Patil, IAS", user_role="govt_admin", action="DRILLDOWN_ANALYSIS", resource_type="DistrictCourse", resource_id="Pune/crs-auto-01", purpose_declared="Root cause analysis of auto-sector employment dip", ip_address="10.150.12.4"),
        AuditLog(user_name="Suresh Gokhale", user_role="training_provider", action="UPDATE_PLACEMENT", resource_type="PlacementRecord", resource_id="plc-canonical-0042", purpose_declared="Placement verification update with Tata Motors offer letter", ip_address="192.168.1.15"),
        AuditLog(user_name="Vikram Shinde", user_role="employer", action="CONFIRM_HIRE", resource_type="JobApplication", resource_id="app-canonical-0042", purpose_declared="HR confirmation of candidate joining EV technician role", ip_address="125.19.45.10"),
        AuditLog(user_name="Pooja Deshmukh", user_role="analyst", action="EXPORT_AUDIT_REPORT", resource_type="ReportExport", resource_id="rep-skill-gap-q2", purpose_declared="Policy documentation for Maharashtra Skilling Council", ip_address="10.150.12.88")
    ]
    db.add_all(audit_samples)

    db.commit()
    print("[SEED] Successfully seeded complete SkillTrackAI platform data!")
