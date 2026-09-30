import os
import sys
import csv
import argparse
import random
import uuid
import secrets
from datetime import datetime, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, SessionLocal
from app.models import (
    User, Course, Provider, Batch, Employer, Trainee, ConsentRecord,
    AlternateContact, PlacementRecord, EmploymentTimeline, FollowUpSchedule,
    EmployerValidation, SelfEmploymentRecord, AttritionReason, EmployerSkillFeedback,
    AuditLog
)
from app.security import hash_password
from app.ml_risk_model import risk_engine

def import_csv_to_database(csv_path: str, reset_db: bool = False):
    print(f"[CSV_SEED] Connecting to database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if reset_db:
        print("[CSV_SEED] Resetting existing database tables...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    if not os.path.exists(csv_path):
        print(f"[CSV_SEED] ERROR: Specified CSV file not found at: {csv_path}")
        return

    print(f"[CSV_SEED] Ingesting published skilling dataset from: {csv_path}")

    # 1. Ensure Standard System Users exist with real bcrypt hashes
    standard_users = [
        ("usr-admin-1", "Dr. Anand Patil, IAS", "director.sded@maharashtra.gov.in", "govt_admin", "Admin@123", "Dept of Skills & Entrepreneurship, Govt of MH"),
        ("usr-analyst-1", "Pooja Deshmukh", "pooja.analyst@mahaskill.in", "analyst", "Analyst@123", "Maharashtra Skill Research & Analytics Cell"),
        ("usr-provider-1", "Suresh Gokhale", "centerhead.pune@mssds.org", "provider", "Provider@123", "MSSDS Skilling Hub - Pune"),
        ("usr-employer-1", "Vikram Shinde", "hr.placements@tatamotors.com", "employer", "Employer@123", "Tata Motors Ltd (Pune)"),
        ("usr-field-1", "Sunita Kamble", "sunita.counsellor@mssds.org", "field_officer", "Field@123", "District Employment Guidance Center, Pune"),
        ("usr-trainee-1", "Prashant Jadhav", "prashant.j@gmail.com", "trainee", "Trainee@123", "Certified Trainee Alumni")
    ]
    for uid, name, email, role, pwd, org in standard_users:
        u = db.query(User).filter(User.id == uid).first()
        if not u:
            db.add(User(
                id=uid,
                name=name,
                email=email,
                role=role,
                password_hash=hash_password(pwd),
                organization=org,
                phone="+91 98220 11223"
            ))
    db.flush()

    # 2. Parse CSV
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"[CSV_SEED] Read {len(rows)} trainee records from CSV. Processing relational entities...")

    courses_cache = {}
    providers_cache = {}
    employers_cache = {}

    # Pre-seed employers
    emp_definitions = [
        ("emp-tata-01", "Tata Motors Ltd (Passenger & EV)", "Automotive & EV", "Pune", "hr@tatamotors.com", "L28920MH1945PLC004520"),
        ("emp-bajaj-02", "Bajaj Auto Ltd (Chakan Works)", "Automotive & EV", "Pune", "recruitment@bajajauto.co.in", "L65993PN2007PLC130076"),
        ("emp-infosys-03", "Infosys BPM Ltd (Hinjewadi DC)", "IT & BPM", "Pune", "campus@infosys.com", "U72200KA2002PLC030310"),
        ("emp-apollo-04", "Apollo Hospitals & Health City", "Healthcare & Life Sciences", "Nashik", "hr@apollohospitals.com", "L85110TN1979PLC008035"),
        ("emp-thermax-05", "Thermax Clean Energy Systems Ltd", "Electronics & Hardware", "Pune", "talent@thermaxglobal.com", "L29299PN1980PLC022787"),
        ("emp-lt-06", "L&T Electrical & Automation Services", "Electronics & Hardware", "Nagpur", "careers@larsentoubro.com", "L99999MH1946PLC004768")
    ]
    for eid, ename, esec, edist, eemail, ecin in emp_definitions:
        emp = db.query(Employer).filter(Employer.id == eid).first()
        if not emp:
            emp = Employer(id=eid, company_name=ename, sector=esec, district=edist, contact_email=eemail, udyam_or_cin=ecin)
            db.add(emp)
        employers_cache[ename] = emp
    db.flush()

    trainee_count = 0
    for idx, row in enumerate(rows, 1):
        c_code = row.get("Course_Code", "MH-AUTO-01")
        c_name = row.get("Course_Name", "EV Battery & Drivetrain Assembly")
        sector = row.get("Sector", "Automotive & EV")
        
        # Course lookup/create
        if c_code not in courses_cache:
            crs = db.query(Course).filter(Course.course_code == c_code).first()
            if not crs:
                skills_map = {
                    "Automotive & EV": ["BMS Diagnostics", "High Voltage Safety", "Cell Packaging", "CAN Bus Communication", "Wiring Harness Assembly"],
                    "Electronics & Hardware": ["Siemens S7-1200 PLC", "Ladder Logic", "Pneumatics & Hydraulics", "SCADA Basics", "Sensor Calibration"],
                    "IT & BPM": ["Linux Admin", "Python/Node.js", "SQL & Database Mgmt", "Docker Basics", "Cloud Support & Troubleshooting"],
                    "Healthcare & Life Sciences": ["Vital Signs Monitoring", "Infection Control Protocols", "Dialyzer Priming", "Patient Care Documentation", "CPR & First Aid"]
                }
                crs = Course(
                    id=f"crs-{c_code.lower()}",
                    course_code=c_code,
                    course_name=c_name,
                    sector=sector,
                    duration_weeks=16,
                    nsqf_level=4,
                    curriculum_skills=skills_map.get(sector, ["Technical Skill A", "Technical Skill B"])
                )
                db.add(crs)
                db.flush()
            courses_cache[c_code] = crs
        course = courses_cache[c_code]

        # Provider lookup/create
        p_code = row.get("Provider_Code", "PRV-PUNE-01")
        p_name = row.get("Provider_Name", "MSSDS Central Skilling Hub (Pune)")
        p_dist = row.get("District", "Pune")
        if p_code not in providers_cache:
            prv = db.query(Provider).filter(Provider.provider_code == p_code).first()
            if not prv:
                prv = Provider(
                    id=f"prv-{p_code.lower()}",
                    provider_code=p_code,
                    name=p_name,
                    district=p_dist,
                    accreditation_grade="A+" if "Central" in p_name or "Tata" in p_name else "A"
                )
                db.add(prv)
                db.flush()
            providers_cache[p_code] = prv
        provider = providers_cache[p_code]

        # Trainee Fields
        t_id = f"trn-mh-2024-{idx:04d}"
        code = row.get("Candidate_ID", f"MH-TRN-2024-{idx:04d}")
        full_name = row.get("Candidate_Name", f"Trainee {idx}")
        gender = row.get("Gender", "Male")
        age = int(row.get("Age", 22))
        category = row.get("Category", "OBC")
        district = row.get("District", "Pune")
        att_pct = float(row.get("Attendance_Pct", 85.0))
        score = float(row.get("Assessment_Score", 75.0))
        cert_status = row.get("Certification_Status", "Certified")
        emp_status = row.get("Employment_Status", "Placed")
        phone = row.get("Phone_Number", f"+91 98220 {idx:05d}")
        consent_yes = row.get("Consent_Given", "Yes").lower() == "yes"

        # Check existing
        existing_t = db.query(Trainee).filter(Trainee.id == t_id).first()
        if existing_t:
            continue

        # Evaluate ML Risk
        eval_res = risk_engine.evaluate({
            "attendance_percentage": att_pct,
            "assessment_score": score,
            "age": age,
            "gender": gender,
            "category": category,
            "course_name": course.course_name,
            "district": district
        })

        trainee = Trainee(
            id=t_id,
            trainee_code=code,
            full_name=full_name,
            primary_phone=phone,
            primary_email=f"{full_name.lower().replace(' ', '.')}{idx}@example.com",
            gender=gender,
            age=age,
            category=category,
            district=district,
            education_level="12th Pass",
            course_id=course.id,
            provider_id=provider.id,
            enrolment_date=row.get("Enrolment_Date", "2024-01-15"),
            completion_date=row.get("Completion_Date", "2024-05-15"),
            attendance_percentage=att_pct,
            assessment_score=score,
            certification_status=cert_status,
            current_status=emp_status,
            skills_tagged=random.sample(course.curriculum_skills, k=min(3, len(course.curriculum_skills))),
            risk_score=eval_res["risk_score"],
            risk_level=eval_res["risk_level"],
            risk_factors=eval_res["risk_factors"]
        )
        db.add(trainee)
        db.flush()

        # Explicit Consent Record
        db.add(ConsentRecord(
            id=f"cns-{idx:04d}",
            trainee_id=trainee.id,
            consent_given=consent_yes,
            consent_version="v1.2-2024-MH-SDED",
            consent_timestamp=datetime(2024, 1, 16, 10, 0),
            purpose_of_use_text="I hereby grant explicit digital consent to Dept of Skills, Govt of Maharashtra, to track post-training employability outcomes, verify employment records via employer portal, and facilitate assisted career progression services under SkillTrackAI.",
            allow_placement_tracking=consent_yes,
            allow_epfo_linking=consent_yes,
            allow_assisted_followup=consent_yes,
            opted_out=not consent_yes,
            opt_out_reason="Revoked longitudinal tracking" if not consent_yes else None,
            ip_address=f"103.21.{random.randint(10, 99)}.{random.randint(2, 250)}"
        ))

        # Alternate Contact History
        db.add(AlternateContact(
            id=f"alt-c1-{idx:04d}",
            trainee_id=trainee.id,
            contact_type="primary_phone",
            contact_value=phone,
            is_active=True,
            source="PMKVY Registration Intake"
        ))
        if idx % 3 == 0:
            db.add(AlternateContact(
                id=f"alt-c2-{idx:04d}",
                trainee_id=trainee.id,
                contact_type="guardian_phone",
                contact_value=f"+91 8{random.randint(7000, 9999)}{random.randint(10000, 99999)}",
                is_active=True,
                source="3-Month Verification Update"
            ))

        # Outcome-specific tables & Append-Only Timeline
        wage = float(row.get("Monthly_Wage", 0) or 0)
        emp_name = row.get("Employer_Name") or "Tata Motors Ltd (Passenger & EV)"

        if emp_status == "Placed":
            conf = 85 if idx % 2 == 0 else 50
            plc = PlacementRecord(
                id=f"plc-{idx:04d}",
                trainee_id=trainee.id,
                employer_name=emp_name,
                job_role=row.get("Job_Role") or "Technician Associate",
                placement_type="Wage Employment",
                monthly_wage=wage or 18000.0,
                placement_date="2024-05-15",
                confidence_score=conf,
                reporting_source="Employer Direct" if conf >= 85 else "Training Provider",
                verification_status="Employer Confirmed" if conf >= 85 else "Pending",
                offer_letter_uploaded=conf >= 85
            )
            db.add(plc)
            db.flush()

            # Append-Only Timeline
            db.add(EmploymentTimeline(
                id=f"tml-1m-{idx:04d}",
                trainee_id=trainee.id,
                checkpoint="1 Month",
                status="Placed",
                employer_name=emp_name,
                job_role=plc.job_role,
                monthly_wage=plc.monthly_wage,
                log_date="2024-06-15",
                verified_by="Automated Survey Response",
                verification_confidence=conf,
                source="Twilio SMS Survey",
                job_relevance_score=random.randint(4, 5),
                is_same_employer_as_last=True
            ))
            db.add(EmploymentTimeline(
                id=f"tml-6m-{idx:04d}",
                trainee_id=trainee.id,
                checkpoint="6 Months",
                status="Placed",
                employer_name=emp_name,
                job_role=plc.job_role,
                monthly_wage=plc.monthly_wage + 2500,
                log_date="2024-11-15",
                verified_by="Employer HR Portal Sync",
                verification_confidence=85,
                source="Employer Confirmation",
                job_relevance_score=5,
                is_same_employer_as_last=True
            ))

        elif emp_status == "Self-Employed":
            db.add(SelfEmploymentRecord(
                id=f"se-{idx:04d}",
                trainee_id=trainee.id,
                business_name=emp_name or f"{full_name.split()[0]} Enterprise",
                business_type="Fabrication/Repair" if "EV" in course.course_name else "Electrical Contractor",
                registration_type="Udyam Registered",
                registration_number=f"UDYAM-MH-26-00{random.randint(1000, 9999)}",
                monthly_revenue_band="₹30,000 - ₹50,000",
                people_employed=random.randint(1, 4),
                seed_capital_source="MUDRA Loan"
            ))
            db.add(EmploymentTimeline(
                id=f"tml-se-1m-{idx:04d}",
                trainee_id=trainee.id,
                checkpoint="1 Month",
                status="Self-Employed",
                employer_name=emp_name,
                job_role="Proprietor",
                monthly_wage=25000.0,
                log_date="2024-06-15",
                verified_by="Udyam Match",
                verification_confidence=85,
                source="Udyam Portal",
                job_relevance_score=5,
                is_same_employer_as_last=True
            ))

        elif emp_status == "Unemployed":
            db.add(AttritionReason(
                id=f"att-{idx:04d}",
                trainee_id=trainee.id,
                primary_reason="Location/Commute Mismatch",
                free_text_comment=f"Candidate preferred local work in {district} rather than plant relocation."
            ))
            db.add(EmploymentTimeline(
                id=f"tml-un-1m-{idx:04d}",
                trainee_id=trainee.id,
                checkpoint="1 Month",
                status="Unemployed",
                employer_name=None,
                job_role=None,
                monthly_wage=0.0,
                log_date="2024-06-15",
                verified_by="Assisted Phone Call",
                verification_confidence=75,
                source="Assisted Outreach",
                job_relevance_score=1,
                is_same_employer_as_last=False
            ))

        # Follow-Up Schedules (1m, 3m, 6m)
        token_1m = secrets.token_urlsafe(16)
        token_3m = secrets.token_urlsafe(16)
        token_6m = secrets.token_urlsafe(16)

        is_escalated = (idx in [3, 8, 15, 22, 33, 44, 55, 67, 82])
        db.add(FollowUpSchedule(
            id=f"fu-1m-{idx:04d}",
            trainee_id=trainee.id,
            checkpoint="1 Month",
            scheduled_date="2024-06-15",
            triggered_date=datetime(2024, 6, 15, 10, 0),
            channel="SMS",
            status="Responded",
            attempt_count=1,
            survey_token=token_1m,
            twilio_message_sid=f"SM_{secrets.token_hex(16)}",
            twilio_delivery_status="delivered",
            sms_recipient_phone=phone,
            survey_response={"is_employed": emp_status in ["Placed", "Self-Employed", "Apprenticeship"], "wage": wage}
        ))
        db.add(FollowUpSchedule(
            id=f"fu-3m-{idx:04d}",
            trainee_id=trainee.id,
            checkpoint="3 Months",
            scheduled_date="2024-08-15",
            triggered_date=datetime(2024, 8, 15, 10, 0),
            channel="SMS",
            status="Escalated to Assisted" if is_escalated else "Responded",
            attempt_count=3 if is_escalated else 1,
            survey_token=token_3m,
            twilio_message_sid=f"SM_{secrets.token_hex(16)}",
            twilio_delivery_status="delivered",
            sms_recipient_phone=phone,
            assigned_counsellor="Sunita Kamble (Field Officer)" if is_escalated else None,
            assisted_notes="Unresponsive to 2 automated Twilio SMS triggers. Escalated for telephonic outreach." if is_escalated else None
        ))
        db.add(FollowUpSchedule(
            id=f"fu-6m-{idx:04d}",
            trainee_id=trainee.id,
            checkpoint="6 Months",
            scheduled_date="2024-11-15",
            triggered_date=datetime(2024, 11, 15, 10, 0),
            channel="SMS",
            status="Scheduled",
            attempt_count=0,
            survey_token=token_6m,
            sms_recipient_phone=phone
        ))

        trainee_count += 1

    # Employer Skill Feedbacks
    course_list = list(courses_cache.values())
    if course_list:
        db.add(EmployerSkillFeedback(course_id=course_list[0].id, employer_id="emp-tata-01", skill_name="CAN Bus Communication", importance_rating=5, proficiency_observed=2, gap_severity="Critical Gap", feedback_notes="Trainees understand theory but lack practical troubleshooting on live vehicle wiring harnesses."))
        db.add(EmployerSkillFeedback(course_id=course_list[0].id, employer_id="emp-bajaj-02", skill_name="High Voltage Safety", importance_rating=5, proficiency_observed=4, gap_severity="Adequate", feedback_notes="Good foundation in NFPA 70E and Indian EV safety standards."))

    # Initial Audit Logs
    db.add(AuditLog(user_name="Dr. Anand Patil, IAS", user_role="govt_admin", action="INGEST_PMKVY_DATASET", resource_type="Dataset", resource_id=csv_path, purpose_declared="Initial import of published PMKVY Maharashtra trainee dataset", ip_address="127.0.0.1"))

    db.commit()
    print(f"[CSV_SEED] SUCCESS: Successfully ingested {trainee_count} trainee records into the relational database!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SkillTrackAI CSV Data Ingestion Pipeline")
    parser.add_argument("--file", default="data/pmkvy_maharashtra_trainees.csv", help="Path to PMKVY dataset CSV file")
    parser.add_argument("--reset", action="store_true", help="Reset existing tables before import")
    args = parser.parse_args()

    csv_target = os.path.join(os.path.dirname(os.path.abspath(__file__)), args.file)
    import_csv_to_database(csv_target, reset_db=args.reset)
