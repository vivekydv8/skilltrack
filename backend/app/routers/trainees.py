from fastapi import APIRouter, Depends, HTTPException, Query, Header, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import csv
import io

from app.database import get_db
from app.models import (
    Trainee, Course, Provider, Batch, ConsentRecord, AlternateContact, PlacementRecord,
    EmploymentTimeline, FollowUpSchedule, SelfEmploymentRecord, AttritionReason,
    JobPosting, JobApplication
)
from app.schemas import (
    TraineeCreate, TraineeUpdate, AlternateContactCreate, TraineeEmploymentSelfUpdate
)
from app.ml_risk_model import risk_engine
from app.services.audit_service import log_audit_action

router = APIRouter(prefix="/api/trainees", tags=["Trainee Profile & Consent"])

def mask_pii(text: str, is_phone: bool = False, is_email: bool = False) -> str:
    if not text:
        return ""
    if is_phone:
        return text[:6] + "*****" + text[-3:] if len(text) > 8 else "***-***"
    if is_email:
        parts = text.split("@")
        if len(parts) == 2:
            return parts[0][:2] + "****@" + parts[1]
        return "a***@***.com"
    words = text.split()
    return " ".join([w[0] + "*" * (len(w) - 1) for w in words])

@router.get("")
def list_trainees(
    course_id: Optional[str] = None,
    provider_id: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    search: Optional[str] = None,
    role: str = Query("govt_admin"),
    user_name: str = Query("Dr. Anand Patil, IAS"),
    db: Session = Depends(get_db)
):
    """
    List trainees with role-based scoping:
    - Government Admin: see all
    - Training Provider: filtered by provider_id
    - Analyst: PII automatically masked
    """
    query = db.query(Trainee)

    if provider_id:
        query = query.filter(Trainee.provider_id == provider_id)
    if course_id:
        query = query.filter(Trainee.course_id == course_id)
    if district:
        query = query.filter(Trainee.district == district)
    if status:
        query = query.filter(Trainee.current_status == status)
    if risk_level:
        query = query.filter(Trainee.risk_level == risk_level)
    if search:
        query = query.filter(
            or_(
                Trainee.full_name.ilike(f"%{search}%"),
                Trainee.trainee_code.ilike(f"%{search}%"),
                Trainee.skill_id.ilike(f"%{search}%"),
                Trainee.district.ilike(f"%{search}%")
            )
        )

    trainees = query.all()

    log_audit_action(
        db,
        user_name=user_name,
        user_role=role,
        action="VIEW_TRAINEE_DIRECTORY",
        resource_type="TraineeList",
        purpose_declared=f"Browsing trainee records with role {role}"
    )

    is_analyst = (role == "analyst")

    results = []
    for t in trainees:
        c = t.course
        p = t.provider
        results.append({
            "id": t.id,
            "trainee_code": t.trainee_code,
            "skill_id": t.skill_id or f"ST-MH-{t.id[:6].upper()}",
            "full_name": mask_pii(t.full_name) if is_analyst else t.full_name,
            "primary_phone": mask_pii(t.primary_phone, is_phone=True) if is_analyst else t.primary_phone,
            "primary_email": mask_pii(t.primary_email, is_email=True) if is_analyst else t.primary_email,
            "gender": t.gender,
            "age": t.age,
            "category": t.category,
            "district": t.district,
            "education_level": t.education_level,
            "course_id": t.course_id,
            "course_name": c.course_name if c else "N/A",
            "sector": c.sector if c else "N/A",
            "provider_id": t.provider_id,
            "provider_name": p.name if p else "N/A",
            "enrolment_date": t.enrolment_date,
            "completion_date": t.completion_date,
            "attendance_percentage": t.attendance_percentage,
            "assessment_score": t.assessment_score,
            "certification_status": t.certification_status,
            "current_status": t.current_status,
            "confidence_level": t.confidence_level or "CORROBORATED",
            "skills_tagged": t.skills_tagged or [],
            "missing_skills": t.missing_skills or [],
            "skill_match_pct": t.skill_match_pct or 70.0,
            "risk_score": t.risk_score,
            "risk_level": t.risk_level,
            "risk_factors": t.risk_factors or [],
            "consent_status": "Opted Out" if (t.consent and t.consent.opted_out) else ("Consented" if t.consent else "Pending"),
            "pii_masked": is_analyst
        })

    return results

@router.get("/by-skill-id/{skill_id}")
def get_trainee_by_skill_id(skill_id: str, db: Session = Depends(get_db)):
    """Fetch canonical trainee profile by unique pseudonymous Skill ID"""
    trainee = db.query(Trainee).filter(
        or_(Trainee.skill_id == skill_id, Trainee.trainee_code == skill_id)
    ).first()
    if not trainee:
        raise HTTPException(status_code=404, detail=f"No trainee found with Skill ID: {skill_id}")
    return get_trainee_detail(trainee.id, role="govt_admin", user_name="Skill ID Direct Resolver", db=db)

@router.get("/{trainee_id}")
def get_trainee_detail(
    trainee_id: str,
    role: str = Query("govt_admin"),
    user_name: str = Query("Dr. Anand Patil, IAS"),
    purpose: str = Query("Official Verification & Longitudinal Progression"),
    db: Session = Depends(get_db)
):
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee record not found")

    is_analyst = (role == "analyst")

    log_audit_action(
        db,
        user_name=user_name,
        user_role=role,
        action="VIEW_TRAINEE_PROFILE_PII" if not is_analyst else "VIEW_ANONYMIZED_TRAINEE_RECORD",
        resource_type="Trainee",
        resource_id=trainee.id,
        purpose_declared=purpose
    )

    consent_info = None
    if trainee.consent:
        consent_info = {
            "id": trainee.consent.id,
            "consent_given": trainee.consent.consent_given,
            "consent_version": trainee.consent.consent_version,
            "consent_timestamp": trainee.consent.consent_timestamp.isoformat() if trainee.consent.consent_timestamp else None,
            "purpose_of_use_text": trainee.consent.purpose_of_use_text,
            "allow_placement_tracking": trainee.consent.allow_placement_tracking,
            "allow_epfo_linking": trainee.consent.allow_epfo_linking,
            "allow_assisted_followup": trainee.consent.allow_assisted_followup,
            "opted_out": trainee.consent.opted_out,
            "opt_out_timestamp": trainee.consent.opt_out_timestamp.isoformat() if trainee.consent.opt_out_timestamp else None,
            "opt_out_reason": trainee.consent.opt_out_reason,
            "deletion_requested": trainee.consent.deletion_requested,
            "deletion_status": trainee.consent.deletion_status,
            "ip_address": trainee.consent.ip_address
        }

    alt_contacts = []
    for ac in trainee.alternate_contacts:
        alt_contacts.append({
            "id": ac.id,
            "contact_type": ac.contact_type,
            "contact_value": mask_pii(ac.contact_value, is_phone=True) if is_analyst else ac.contact_value,
            "is_active": ac.is_active,
            "source": ac.source,
            "verified_at": ac.verified_at.isoformat() if ac.verified_at else None
        })

    placements = []
    for p in trainee.placements:
        val_status = "Pending"
        if p.validations:
            val_status = p.validations[0].action

        placements.append({
            "id": p.id,
            "employer_id": p.employer_id,
            "employer_name": p.employer_name,
            "job_role": p.job_role,
            "placement_type": p.placement_type,
            "monthly_wage": p.monthly_wage,
            "placement_date": p.placement_date,
            "confidence_score": p.confidence_score,
            "confidence_level": p.confidence_level or "CORROBORATED",
            "reporting_source": p.reporting_source,
            "verification_status": p.verification_status,
            "offer_letter_uploaded": p.offer_letter_uploaded,
            "payslip_uploaded": p.payslip_uploaded,
            "notes": p.notes,
            "has_mismatch": any(v.has_mismatch for v in p.validations)
        })

    timeline = []
    for tl in sorted(trainee.timeline_logs, key=lambda x: x.log_date):
        timeline.append({
            "id": tl.id,
            "checkpoint": tl.checkpoint,
            "status": tl.status,
            "employer_name": tl.employer_name,
            "job_role": tl.job_role,
            "monthly_wage": tl.monthly_wage,
            "log_date": tl.log_date,
            "verified_by": tl.verified_by,
            "verification_confidence": tl.verification_confidence,
            "confidence_level": tl.confidence_level or "CORROBORATED",
            "source": tl.source,
            "job_relevance_score": tl.job_relevance_score,
            "is_same_employer_as_last": tl.is_same_employer_as_last,
            "notes": tl.notes
        })

    self_emp = None
    if trainee.self_employment:
        se = trainee.self_employment
        self_emp = {
            "id": se.id,
            "business_name": se.business_name,
            "business_type": se.business_type,
            "registration_type": se.registration_type,
            "registration_number": se.registration_number,
            "monthly_revenue_band": se.monthly_revenue_band,
            "people_employed": se.people_employed,
            "seed_capital_source": se.seed_capital_source,
            "apprenticeship_stipend": se.apprenticeship_stipend,
            "apprenticeship_duration_months": se.apprenticeship_duration_months
        }

    followups = []
    for f in trainee.follow_ups:
        followups.append({
            "id": f.id,
            "checkpoint": f.checkpoint,
            "scheduled_date": f.scheduled_date,
            "triggered_date": f.triggered_date.isoformat() if f.triggered_date else None,
            "channel": f.channel,
            "status": f.status,
            "attempt_count": f.attempt_count,
            "survey_response": f.survey_response,
            "escalated_at": f.escalated_at.isoformat() if f.escalated_at else None,
            "assigned_counsellor": f.assigned_counsellor,
            "assisted_notes": f.assisted_notes
        })

    # Relevant job matches based on skills
    job_postings = db.query(JobPosting).filter(JobPosting.status == "Open").all()
    job_matches = []
    t_skills = set(trainee.skills_tagged or [])
    for jp in job_postings:
        req_skills = set(jp.required_skills or [])
        matched = list(t_skills.intersection(req_skills))
        missing = list(req_skills - t_skills)
        match_pct = round(len(matched) / len(req_skills) * 100, 1) if req_skills else 70.0
        job_matches.append({
            "job_id": jp.id,
            "job_title": jp.job_title,
            "company_name": jp.employer.company_name if jp.employer else "Industry Partner",
            "location": jp.location,
            "salary_range": jp.salary_range,
            "match_percentage": match_pct,
            "matched_skills": matched,
            "missing_skills": missing
        })
    job_matches.sort(key=lambda x: x["match_percentage"], reverse=True)

    return {
        "id": trainee.id,
        "trainee_code": trainee.trainee_code,
        "skill_id": trainee.skill_id or f"ST-MH-{trainee.id[:6].upper()}",
        "full_name": mask_pii(trainee.full_name) if is_analyst else trainee.full_name,
        "primary_phone": mask_pii(trainee.primary_phone, is_phone=True) if is_analyst else trainee.primary_phone,
        "primary_email": mask_pii(trainee.primary_email, is_email=True) if is_analyst else trainee.primary_email,
        "gender": trainee.gender,
        "age": trainee.age,
        "category": trainee.category,
        "district": trainee.district,
        "education_level": trainee.education_level,
        "course": {
            "id": trainee.course.id,
            "course_name": trainee.course.course_name,
            "course_code": trainee.course.course_code,
            "sector": trainee.course.sector,
            "curriculum_skills": trainee.course.curriculum_skills or []
        } if trainee.course else None,
        "provider": {
            "id": trainee.provider.id,
            "name": trainee.provider.name,
            "district": trainee.provider.district,
            "grade": trainee.provider.accreditation_grade
        } if trainee.provider else None,
        "enrolment_date": trainee.enrolment_date,
        "completion_date": trainee.completion_date,
        "attendance_percentage": trainee.attendance_percentage,
        "assessment_score": trainee.assessment_score,
        "certification_status": trainee.certification_status,
        "current_status": trainee.current_status,
        "confidence_level": trainee.confidence_level or "CORROBORATED",
        "skills_tagged": trainee.skills_tagged or [],
        "missing_skills": trainee.missing_skills or [],
        "skill_match_pct": trainee.skill_match_pct or 70.0,
        "risk_score": trainee.risk_score,
        "risk_level": trainee.risk_level,
        "risk_factors": trainee.risk_factors or [],
        "consent": consent_info,
        "alternate_contacts": alt_contacts,
        "placements": placements,
        "timeline_logs": timeline,
        "self_employment": self_emp,
        "follow_ups": followups,
        "job_matches": job_matches[:5],
        "pii_masked": is_analyst
    }

@router.post("")
def register_trainee(
    data: TraineeCreate,
    user_name: str = Query("Suresh Gokhale (Provider Head)"),
    user_role: str = Query("training_provider"),
    db: Session = Depends(get_db)
):
    trainee_id = str(uuid.uuid4())
    count = db.query(Trainee).count() + 1
    trainee_code = f"MH-TRN-2024-{count:04d}"
    skill_id = f"ST-MH-{uuid.uuid4().hex[:6].upper()}"

    course = db.query(Course).filter(Course.id == data.course_id).first()
    course_name = course.course_name if course else "Skill Course"

    risk_eval = risk_engine.evaluate({
        "attendance_percentage": data.attendance_percentage,
        "assessment_score": data.assessment_score,
        "age": data.age,
        "gender": data.gender,
        "category": data.category,
        "course_name": course_name,
        "district": data.district
    })

    trainee = Trainee(
        id=trainee_id,
        trainee_code=trainee_code,
        skill_id=skill_id,
        full_name=data.full_name,
        primary_phone=data.primary_phone,
        primary_email=data.primary_email,
        gender=data.gender,
        age=data.age,
        category=data.category,
        district=data.district,
        education_level=data.education_level,
        course_id=data.course_id,
        provider_id=data.provider_id,
        batch_id=data.batch_id,
        enrolment_date=data.enrolment_date,
        completion_date=data.completion_date,
        attendance_percentage=data.attendance_percentage,
        assessment_score=data.assessment_score,
        certification_status=data.certification_status,
        current_status="In Training" if data.certification_status == "In Training" else "Certified",
        confidence_level="CORROBORATED",
        skills_tagged=data.skills_tagged,
        risk_score=risk_eval["risk_score"],
        risk_level=risk_eval["risk_level"],
        risk_factors=risk_eval["risk_factors"]
    )
    db.add(trainee)
    db.flush()

    consent = ConsentRecord(
        trainee_id=trainee.id,
        consent_given=data.consent.consent_given,
        consent_version=data.consent.consent_version,
        consent_timestamp=datetime.utcnow(),
        purpose_of_use_text=data.consent.purpose_of_use_text,
        allow_placement_tracking=data.consent.allow_placement_tracking,
        allow_epfo_linking=data.consent.allow_epfo_linking,
        allow_assisted_followup=data.consent.allow_assisted_followup,
        ip_address="127.0.0.1"
    )
    db.add(consent)

    db.add(AlternateContact(
        trainee_id=trainee.id,
        contact_type="primary_phone",
        contact_value=data.primary_phone,
        is_active=True,
        source="Registration Onboarding"
    ))

    # Pre-generate milestones
    if data.completion_date:
        try:
            base_date = datetime.strptime(data.completion_date, "%Y-%m-%d")
        except Exception:
            base_date = datetime.utcnow()
        
        milestones = [
            ("1 Month", base_date + timedelta(days=30)),
            ("3 Months", base_date + timedelta(days=90)),
            ("6 Months", base_date + timedelta(days=180)),
            ("12 Months", base_date + timedelta(days=365)),
        ]
        for name, mdate in milestones:
            db.add(FollowUpSchedule(
                trainee_id=trainee.id,
                checkpoint=name,
                scheduled_date=mdate.strftime("%Y-%m-%d"),
                channel="WhatsApp",
                status="Scheduled"
            ))

    log_audit_action(
        db,
        user_name=user_name,
        user_role=user_role,
        action="REGISTER_TRAINEE_WITH_CONSENT",
        resource_type="Trainee",
        resource_id=trainee.id,
        purpose_declared="New candidate enrollment with digital consent verification"
    )

    db.commit()
    return {"success": True, "trainee_id": trainee.id, "skill_id": trainee.skill_id, "trainee_code": trainee.trainee_code}

@router.post("/import-csv")
async def import_trainees_csv(
    file: UploadFile = File(...),
    provider_id: str = Query("prv-pune-01"),
    user_name: str = Query("Training Provider Head"),
    db: Session = Depends(get_db)
):
    """
    Bulk Trainee Import for Training Providers / ITIs.
    Parses CSV and creates canonical records with pseudonymous Skill IDs.
    """
    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode("utf-8", errors="ignore")))
    
    courses = db.query(Course).all()
    default_course = courses[0] if courses else None

    imported = 0
    for row in reader:
        full_name = row.get("full_name") or row.get("Trainee_Name") or row.get("Name")
        if not full_name:
            continue
        
        count = db.query(Trainee).count() + 1
        t_id = str(uuid.uuid4())
        code = f"MH-TRN-2024-{count:04d}"
        skill_id = f"ST-MH-{uuid.uuid4().hex[:6].upper()}"

        t = Trainee(
            id=t_id,
            trainee_code=code,
            skill_id=skill_id,
            full_name=full_name,
            primary_phone=row.get("phone") or row.get("Mobile") or "+91 98000 00000",
            primary_email=row.get("email") or f"trn.{count}@example.com",
            gender=row.get("gender") or "Male",
            age=int(row.get("age", 22)),
            category=row.get("category", "General"),
            district=row.get("district", "Pune"),
            education_level=row.get("education", "12th Pass"),
            course_id=default_course.id if default_course else "crs-auto-01",
            provider_id=provider_id,
            enrolment_date="2024-01-15",
            completion_date="2024-05-15",
            attendance_percentage=float(row.get("attendance", 85.0)),
            assessment_score=float(row.get("assessment_score", 75.0)),
            certification_status="Certified",
            current_status="Placed" if float(row.get("assessment_score", 75.0)) > 70 else "In Training",
            confidence_level="CORROBORATED",
            skills_tagged=default_course.curriculum_skills[:3] if default_course else []
        )
        db.add(t)

        db.add(ConsentRecord(
            trainee_id=t.id,
            consent_given=True,
            purpose_of_use_text="Bulk enrollment digital consent via Provider CSV batch.",
            allow_placement_tracking=True,
            allow_epfo_linking=True,
            allow_assisted_followup=True
        ))
        imported += 1

    log_audit_action(
        db,
        user_name=user_name,
        user_role="training_provider",
        action="BULK_CSV_TRAINEE_IMPORT",
        resource_type="TraineeBatch",
        purpose_declared=f"Bulk imported {imported} candidates via CSV"
    )

    db.commit()
    return {"success": True, "count": imported, "message": f"Successfully imported {imported} trainees"}

@router.post("/{trainee_id}/employment-update")
def trainee_employment_self_update(
    trainee_id: str,
    req: TraineeEmploymentSelfUpdate,
    db: Session = Depends(get_db)
):
    """
    Trainee self-reports employment outcome in Trainee Portal.
    Creates an append-only timeline entry tagged with 'SELF-REPORTED' confidence (🟠).
    """
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee record not found")

    new_status = "Placed" if req.is_employed else "Unemployed"
    if req.employment_type == "Self-Employed":
        new_status = "Self-Employed"
    elif req.employment_type == "Apprenticeship":
        new_status = "Apprenticeship"

    trainee.current_status = new_status
    trainee.confidence_level = "SELF-REPORTED"

    # Append to longitudinal timeline
    now_str = datetime.utcnow().strftime("%Y-%m-%d")
    timeline_entry = EmploymentTimeline(
        id=str(uuid.uuid4()),
        trainee_id=trainee.id,
        checkpoint="Self-Reported Update",
        status=new_status,
        employer_name=req.employer_name,
        job_role=req.job_role,
        monthly_wage=req.monthly_wage,
        log_date=req.joining_date or now_str,
        verified_by="Trainee Self-Service",
        verification_confidence=35,
        confidence_level="SELF-REPORTED",
        source="Trainee Portal Form",
        job_relevance_score=req.job_relevance_rating,
        notes=req.notes or f"Self-reported placement at {req.employer_name or 'Independent'}"
    )
    db.add(timeline_entry)

    # If wage employment, update or add placement record with confidence = SELF-REPORTED
    if req.is_employed and req.employer_name:
        plc = db.query(PlacementRecord).filter(PlacementRecord.trainee_id == trainee.id).first()
        if not plc:
            plc = PlacementRecord(
                id=str(uuid.uuid4()),
                trainee_id=trainee.id,
                employer_name=req.employer_name,
                job_role=req.job_role or "Associate",
                placement_type=req.employment_type,
                monthly_wage=req.monthly_wage,
                placement_date=req.joining_date or now_str,
                confidence_score=35,
                confidence_level="SELF-REPORTED",
                reporting_source="Trainee Self-Report",
                verification_status="Pending Employer Verification"
            )
            db.add(plc)
        else:
            plc.employer_name = req.employer_name
            plc.job_role = req.job_role or plc.job_role
            plc.monthly_wage = req.monthly_wage
            plc.confidence_level = "SELF-REPORTED"
            plc.verification_status = "Pending Employer Verification"

    log_audit_action(
        db,
        user_name=trainee.full_name,
        user_role="trainee",
        action="SELF_REPORT_EMPLOYMENT_UPDATE",
        resource_type="Trainee",
        resource_id=trainee.id,
        purpose_declared="Candidate self-service career milestone update"
    )

    db.commit()
    return {
        "success": True,
        "trainee_id": trainee.id,
        "status": trainee.current_status,
        "confidence_level": trainee.confidence_level
    }

@router.post("/{trainee_id}/consent")
def update_trainee_consent(
    trainee_id: str,
    opt_out: bool = False,
    allow_placement_tracking: bool = True,
    allow_epfo_linking: bool = True,
    allow_assisted_followup: bool = True,
    request_deletion: bool = False,
    opt_out_reason: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update DPDP Act 2023 digital consent preferences"""
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee record not found")

    consent = trainee.consent
    if not consent:
        consent = ConsentRecord(trainee_id=trainee.id, purpose_of_use_text="DPDP Consent capture")
        db.add(consent)

    consent.opted_out = opt_out
    consent.allow_placement_tracking = allow_placement_tracking
    consent.allow_epfo_linking = allow_epfo_linking
    consent.allow_assisted_followup = allow_assisted_followup
    consent.deletion_requested = request_deletion
    if opt_out:
        consent.opt_out_timestamp = datetime.utcnow()
        consent.opt_out_reason = opt_out_reason or "User exercised DPDP Section 6 withdrawal rights."
    if request_deletion:
        consent.deletion_status = "Pending Review"

    log_audit_action(
        db,
        user_name=trainee.full_name,
        user_role="trainee",
        action="UPDATE_DPDP_CONSENT_SETTINGS",
        resource_type="ConsentRecord",
        resource_id=trainee.id,
        purpose_declared=f"DPDP consent update: opt_out={opt_out}, deletion={request_deletion}"
    )

    db.commit()
    return {"success": True, "opted_out": consent.opted_out, "deletion_requested": consent.deletion_requested}

@router.post("/{trainee_id}/follow-up")
def submit_trainee_follow_up(
    trainee_id: str,
    checkpoint: str = "6 Months",
    is_employed: bool = True,
    employer: Optional[str] = None,
    monthly_wage: float = 0.0,
    job_relevance_score: int = 4,
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Trainee submits simple follow-up survey for 30 / 90 / 180 / 365 days"""
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    # Find or create schedule record
    fu = db.query(FollowUpSchedule).filter(
        FollowUpSchedule.trainee_id == trainee.id,
        FollowUpSchedule.checkpoint == checkpoint
    ).first()

    if not fu:
        fu = FollowUpSchedule(
            id=str(uuid.uuid4()),
            trainee_id=trainee.id,
            checkpoint=checkpoint,
            scheduled_date=datetime.utcnow().strftime("%Y-%m-%d"),
            channel="Trainee Portal Web"
        )
        db.add(fu)

    fu.status = "Responded"
    fu.triggered_date = datetime.utcnow()
    fu.survey_response = {
        "is_employed": is_employed,
        "employer": employer,
        "wage": monthly_wage,
        "job_relevance_score": job_relevance_score,
        "submitted_via": "Trainee Portal"
    }

    db.commit()
    return {"success": True, "message": f"{checkpoint} follow-up survey submitted successfully"}
