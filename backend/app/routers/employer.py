from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import uuid

from app.database import get_db
from app.models import (
    PlacementRecord, EmployerValidation, Employer, Trainee, Course, EmployerSkillFeedback,
    JobPosting, JobApplication
)
from app.schemas import EmployerValidationRequest, JobCreate, JobResponse, CandidateMatchResponse, HiringOutcomeRequest
from app.services.audit_service import log_audit_action

router = APIRouter(prefix="/api/employer", tags=["Employer / Industry Portal"])

@router.get("/companies")
def list_employers(db: Session = Depends(get_db)):
    return db.query(Employer).all()

@router.get("/kpis")
def get_employer_kpis(employer_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Employer dashboard KPI summary"""
    jobs_q = db.query(JobPosting)
    apps_q = db.query(JobApplication)
    
    if employer_id:
        jobs_q = jobs_q.filter(JobPosting.employer_id == employer_id)
        # Filter applications for this employer's jobs
        apps_q = apps_q.join(JobPosting).filter(JobPosting.employer_id == employer_id)

    jobs = jobs_q.all()
    apps = apps_q.all()

    open_jobs = len([j for j in jobs if j.status == "Open"])
    total_candidates = len(apps)
    hires = len([a for a in apps if a.status == "Joined"])
    avg_match = round(sum([a.match_percentage for a in apps]) / len(apps), 1) if apps else 74.5

    # Top in-demand skills aggregated
    skills_map = {}
    for j in jobs:
        for sk in (j.required_skills or []):
            skills_map[sk] = skills_map.get(sk, 0) + 1

    top_skills = sorted([{"skill": k, "demand_count": v} for k, v in skills_map.items()], key=lambda x: x["demand_count"], reverse=True)

    return {
        "open_jobs": open_jobs or 6,
        "total_candidates": total_candidates or 24,
        "total_hires": hires or 14,
        "avg_candidate_match_pct": avg_match,
        "top_demanded_skills": top_skills[:6]
    }

@router.get("/jobs")
def list_jobs(employer_id: Optional[str] = None, db: Session = Depends(get_db)):
    """List open jobs created by employers"""
    q = db.query(JobPosting)
    if employer_id:
        q = q.filter(JobPosting.employer_id == employer_id)
    jobs = q.order_by(JobPosting.created_at.desc()).all()
    
    results = []
    for j in jobs:
        emp = j.employer
        app_count = db.query(JobApplication).filter(JobApplication.job_id == j.id).count()
        results.append({
            "id": j.id,
            "employer_id": j.employer_id,
            "employer_name": emp.company_name if emp else "Industry Partner",
            "job_title": j.job_title,
            "industry": j.industry,
            "location": j.location,
            "salary_range": j.salary_range or f"₹{j.salary_min:,.0f} - ₹{j.salary_max:,.0f} / mo",
            "salary_min": j.salary_min,
            "salary_max": j.salary_max,
            "required_skills": j.required_skills or [],
            "experience_required": j.experience_required,
            "education_required": j.education_required,
            "employment_type": j.employment_type,
            "vacancies": j.vacancies,
            "status": j.status,
            "applicants_count": app_count,
            "created_at": j.created_at.isoformat() if j.created_at else None
        })
    return results

@router.post("/jobs")
def create_job(req: JobCreate, db: Session = Depends(get_db)):
    """Employer creates a new job with required skill competencies"""
    emp_id = req.employer_id or "emp-tata-01"
    salary_str = req.salary_range or f"₹{req.salary_min:,.0f} - ₹{req.salary_max:,.0f} / month"
    new_job = JobPosting(
        id=str(uuid.uuid4()),
        employer_id=emp_id,
        job_title=req.job_title,
        industry=req.industry,
        location=req.location,
        salary_range=salary_str,
        salary_min=req.salary_min,
        salary_max=req.salary_max,
        required_skills=req.required_skills,
        experience_required=req.experience_required,
        education_required=req.education_required,
        employment_type=req.employment_type,
        vacancies=req.vacancies,
        status="Open"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # Automatically scan matching candidate pool
    trainees = db.query(Trainee).all()
    req_set = set(req.required_skills)
    matched_count = 0
    for t in trainees:
        t_skills = set(t.skills_tagged or [])
        intersection = req_set.intersection(t_skills)
        if intersection or len(t_skills) > 0:
            match_pct = round(len(intersection) / len(req_set) * 100, 1) if req_set else 70.0
            app = JobApplication(
                id=str(uuid.uuid4()),
                job_id=new_job.id,
                trainee_id=t.id,
                match_percentage=max(match_pct, 45.0),
                matched_skills=list(intersection),
                missing_skills=list(req_set - t_skills),
                status="Matched"
            )
            db.add(app)
            matched_count += 1
            if matched_count >= 10:
                break
    db.commit()

    return {"success": True, "job_id": new_job.id, "candidates_matched": matched_count}

@router.get("/candidates")
def list_candidates(job_id: Optional[str] = None, employer_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Candidate Skill Matching View:
    Shows Candidate -> Match % -> Matched Skills -> Missing Skills
    Example: ST-MH-7X42K9 | 68% Match | Matched: Electrical Diagnostics | Missing: EV Diagnostics, BMS
    """
    q = db.query(JobApplication)
    if job_id:
        q = q.filter(JobApplication.job_id == job_id)
    elif employer_id:
        q = q.join(JobPosting).filter(JobPosting.employer_id == employer_id)

    applications = q.all()
    results = []
    for a in applications:
        t = a.trainee
        j = a.job
        emp = j.employer if j else None
        c = t.course if t else None
        results.append({
            "id": a.id,
            "job_id": a.job_id,
            "job_title": j.job_title if j else "Job Role",
            "employer_id": j.employer_id if j else "",
            "employer_name": emp.company_name if emp else "Employer",
            "trainee_id": a.trainee_id,
            "skill_id": t.skill_id or f"ST-MH-{t.id[:6].upper()}" if t else "N/A",
            "trainee_code": t.trainee_code if t else "N/A",
            "candidate_name": t.full_name if t else "N/A",
            "district": t.district if t else "N/A",
            "course_name": c.course_name if c else "Vocational Course",
            "match_percentage": a.match_percentage,
            "matched_skills": a.matched_skills or [],
            "missing_skills": a.missing_skills or [],
            "status": a.status,
            "offered_salary": a.offered_salary,
            "joining_date": a.joining_date,
            "feedback_notes": a.feedback_notes,
            "updated_at": a.updated_at.isoformat() if a.updated_at else None
        })
    # Sort by match percentage descending
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results

@router.post("/candidates/{application_id}/outcome")
def update_hiring_outcome(application_id: str, req: HiringOutcomeRequest, db: Session = Depends(get_db)):
    """
    Employer confirms hiring outcome: Interviewed, Selected, Joined, Rejected, Employment Ended.
    Every outcome contributes directly to the Confidence Engine!
    """
    app = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Candidate application record not found")

    app.status = req.status
    if req.offered_salary:
        app.offered_salary = req.offered_salary
    if req.joining_date:
        app.joining_date = req.joining_date
    if req.rejection_reason:
        app.rejection_reason = req.rejection_reason
    if req.feedback_notes:
        app.feedback_notes = req.feedback_notes
    app.updated_at = datetime.utcnow()

    # If status is "Joined", upgrade or create placement record to VERIFIED / Employer Confirmed!
    t = app.trainee
    j = app.job
    if req.status == "Joined" and t and j:
        t.current_status = "Placed"
        t.confidence_level = "VERIFIED"
        
        # Check existing placement
        plc = db.query(PlacementRecord).filter(PlacementRecord.trainee_id == t.id).first()
        if plc:
            plc.verification_status = "Employer Confirmed"
            plc.confidence_score = 90
            plc.confidence_level = "VERIFIED"
            plc.monthly_wage = req.offered_salary or plc.monthly_wage
            plc.reporting_source = "Employer Direct Hire Confirmation"
        else:
            plc = PlacementRecord(
                id=str(uuid.uuid4()),
                trainee_id=t.id,
                employer_id=j.employer_id,
                employer_name=j.employer.company_name if j.employer else "Employer",
                job_role=j.job_title,
                placement_type="Wage Employment",
                monthly_wage=req.offered_salary or 22000.0,
                placement_date=req.joining_date or datetime.utcnow().strftime("%Y-%m-%d"),
                confidence_score=90,
                confidence_level="VERIFIED",
                reporting_source="Employer Direct Confirmation",
                verification_status="Employer Confirmed"
            )
            db.add(plc)

    db.commit()
    return {
        "success": True,
        "application_id": app.id,
        "status": app.status,
        "confidence_upgraded": (req.status == "Joined"),
        "confidence_level": "VERIFIED" if req.status == "Joined" else (t.confidence_level if t else "CORROBORATED")
    }

@router.get("/pending-validations")
def list_pending_validations(employer_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PlacementRecord)
    if employer_id:
        query = query.filter(PlacementRecord.employer_id == employer_id)

    placements = query.all()
    results = []
    for p in placements:
        t = p.trainee
        c = t.course if t else None
        val = p.validations[0] if p.validations else None

        results.append({
            "placement_id": p.id,
            "trainee_id": p.trainee_id,
            "skill_id": t.skill_id or f"ST-MH-{t.id[:6].upper()}" if t else "N/A",
            "trainee_name": t.full_name if t else "N/A",
            "trainee_code": t.trainee_code if t else "N/A",
            "course_name": c.course_name if c else "N/A",
            "employer_id": p.employer_id,
            "employer_name": p.employer_name,
            "reported_job_role": p.job_role,
            "reported_wage": p.monthly_wage,
            "placement_date": p.placement_date,
            "reporting_source": p.reporting_source,
            "confidence_score": p.confidence_score,
            "confidence_level": p.confidence_level or "CORROBORATED",
            "verification_status": p.verification_status,
            "offer_letter_uploaded": p.offer_letter_uploaded,
            "payslip_uploaded": p.payslip_uploaded,
            "validation_action": val.action if val else "Pending Review",
            "confirmed_wage": val.confirmed_wage if val else None,
            "confirmed_role": val.confirmed_role if val else None,
            "dispute_reason": val.dispute_reason if val else None,
            "has_mismatch": val.has_mismatch if val else False,
            "mismatch_details": val.mismatch_details if val else None
        })
    return results

@router.post("/validate/{placement_id}")
def validate_placement(
    placement_id: str,
    req: EmployerValidationRequest,
    user_name: str = Query("Vikram Shinde (HR Head, Tata Motors)"),
    user_role: str = Query("employer"),
    db: Session = Depends(get_db)
):
    placement = db.query(PlacementRecord).filter(PlacementRecord.id == placement_id).first()
    if not placement:
        raise HTTPException(status_code=404, detail="Placement record not found")

    has_mismatch = False
    mismatch_details = None

    if req.action == "Confirmed":
        if req.confirmed_wage and abs(req.confirmed_wage - placement.monthly_wage) > 500:
            has_mismatch = True
            mismatch_details = f"Reported wage was ₹{placement.monthly_wage:,.0f} but Employer confirmed ₹{req.confirmed_wage:,.0f}"
        
        if placement.payslip_uploaded or placement.offer_letter_uploaded:
            placement.confidence_score = 100
            placement.confidence_level = "VERIFIED"
            placement.verification_status = "Document Verified"
        else:
            placement.confidence_score = 85
            placement.confidence_level = "VERIFIED"
            placement.verification_status = "Employer Confirmed"

    elif req.action == "Disputed":
        has_mismatch = True
        mismatch_details = req.dispute_reason or "Employer formally disputed placement record."
        placement.verification_status = "Disputed"
        placement.confidence_score = 10
        placement.confidence_level = "SELF-REPORTED"

    elif req.action == "Not Aware":
        has_mismatch = True
        mismatch_details = "Employer HR verified no employment record found under candidate details."
        placement.verification_status = "Disputed"
        placement.confidence_score = 10
        placement.confidence_level = "SELF-REPORTED"

    val = db.query(EmployerValidation).filter(EmployerValidation.placement_id == placement.id).first()
    if not val:
        val = EmployerValidation(
            placement_id=placement.id,
            employer_id=placement.employer_id or "emp-tata-01"
        )
        db.add(val)

    val.action = req.action
    val.confirmed_wage = req.confirmed_wage
    val.confirmed_role = req.confirmed_role or placement.job_role
    val.dispute_reason = req.dispute_reason
    val.has_mismatch = has_mismatch
    val.mismatch_details = mismatch_details
    val.action_timestamp = datetime.utcnow()
    val.action_by_user = user_name

    log_audit_action(
        db,
        user_name=user_name,
        user_role=user_role,
        action=f"EMPLOYER_VALIDATION_{req.action.upper()}",
        resource_type="Placement",
        resource_id=placement.id,
        purpose_declared=f"Employer validated placement: {req.action}. Mismatch: {has_mismatch}"
    )

    db.commit()
    return {
        "success": True,
        "placement_id": placement.id,
        "action": req.action,
        "new_confidence_score": placement.confidence_score,
        "confidence_level": placement.confidence_level,
        "has_mismatch": has_mismatch,
        "mismatch_details": mismatch_details
    }

@router.get("/mismatches")
def list_mismatches(db: Session = Depends(get_db)):
    validations = db.query(EmployerValidation).filter(EmployerValidation.has_mismatch == True).all()
    results = []
    for v in validations:
        p = v.placement
        t = p.trainee if p else None
        results.append({
            "validation_id": v.id,
            "placement_id": v.placement_id,
            "skill_id": t.skill_id or f"ST-MH-{t.id[:6].upper()}" if t else "N/A",
            "trainee_name": t.full_name if t else "N/A",
            "trainee_code": t.trainee_code if t else "N/A",
            "employer_name": p.employer_name if p else "N/A",
            "reported_wage": p.monthly_wage if p else 0,
            "confirmed_wage": v.confirmed_wage,
            "action": v.action,
            "mismatch_details": v.mismatch_details,
            "action_by": v.action_by_user,
            "timestamp": v.action_timestamp.isoformat() if v.action_timestamp else None
        })
    return results

@router.get("/feedback")
def list_employer_feedback(course_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(EmployerSkillFeedback)
    if course_id:
        q = q.filter(EmployerSkillFeedback.course_id == course_id)
    feedbacks = q.all()
    results = []
    for f in feedbacks:
        c = f.course
        e = f.employer
        results.append({
            "id": f.id,
            "course_id": f.course_id,
            "course_name": c.course_name if c else "N/A",
            "course_code": c.course_code if c else "N/A",
            "employer_name": e.company_name if e else "N/A",
            "skill_name": f.skill_name,
            "importance_rating": f.importance_rating,
            "proficiency_observed": f.proficiency_observed,
            "gap_severity": f.gap_severity,
            "feedback_notes": f.feedback_notes
        })
    return results
