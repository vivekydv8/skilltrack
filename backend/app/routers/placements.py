from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.database import get_db
from app.models import Trainee, PlacementRecord, EmploymentTimeline, SelfEmploymentRecord, AttritionReason, Employer, EmployerValidation
from app.schemas import PlacementCreate, EmploymentTimelineAppend, SelfEmploymentCreate, AttritionReasonCreate
from app.services.audit_service import log_audit_action

router = APIRouter(prefix="/api/placements", tags=["Placement & Longitudinal Timeline"])

@router.get("")
def list_placements(
    verification_status: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(PlacementRecord)
    if verification_status:
        query = query.filter(PlacementRecord.verification_status == verification_status)
    
    placements = query.all()
    results = []
    for p in placements:
        t = p.trainee
        c = t.course if t else None
        results.append({
            "id": p.id,
            "trainee_id": p.trainee_id,
            "trainee_name": t.full_name if t else "N/A",
            "trainee_code": t.trainee_code if t else "N/A",
            "course_name": c.course_name if c else "N/A",
            "employer_id": p.employer_id,
            "employer_name": p.employer_name,
            "job_role": p.job_role,
            "placement_type": p.placement_type,
            "monthly_wage": p.monthly_wage,
            "placement_date": p.placement_date,
            "confidence_score": p.confidence_score,
            "reporting_source": p.reporting_source,
            "verification_status": p.verification_status,
            "offer_letter_uploaded": p.offer_letter_uploaded,
            "payslip_uploaded": p.payslip_uploaded,
            "notes": p.notes,
            "created_at": p.created_at.isoformat() if p.created_at else None
        })
    return results

@router.post("")
def record_placement(
    data: PlacementCreate,
    user_name: str = Query("Training Provider Admin"),
    user_role: str = Query("provider"),
    db: Session = Depends(get_db)
):
    trainee = db.query(Trainee).filter(Trainee.id == data.trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    # Determine confidence score based on documents uploaded
    confidence = data.confidence_score
    if data.offer_letter_uploaded or data.payslip_uploaded:
        confidence = 100
        verification_status = "Document Verified"
    elif data.reporting_source == "Employer Direct":
        confidence = 85
        verification_status = "Employer Confirmed"
    else:
        confidence = 50
        verification_status = "Pending"

    placement = PlacementRecord(
        trainee_id=trainee.id,
        employer_id=data.employer_id,
        employer_name=data.employer_name,
        job_role=data.job_role,
        placement_type=data.placement_type,
        monthly_wage=data.monthly_wage,
        placement_date=data.placement_date,
        confidence_score=confidence,
        reporting_source=data.reporting_source,
        verification_status=verification_status,
        offer_letter_uploaded=data.offer_letter_uploaded,
        payslip_uploaded=data.payslip_uploaded,
        notes=data.notes
    )
    db.add(placement)
    db.flush()

    # Update trainee current status
    trainee.current_status = "Placed" if data.placement_type == "Wage Employment" else data.placement_type

    # Append first milestone to the Append-Only Longitudinal Employment Timeline
    db.add(EmploymentTimeline(
        trainee_id=trainee.id,
        checkpoint="1 Month",
        status=trainee.current_status,
        employer_name=data.employer_name,
        job_role=data.job_role,
        monthly_wage=data.monthly_wage,
        log_date=data.placement_date,
        verified_by=user_name,
        verification_confidence=confidence,
        source=data.reporting_source,
        job_relevance_score=4,
        is_same_employer_as_last=True,
        notes="Initial placement entry logged upon course completion"
    ))

    # Add pending employer validation
    if data.employer_id:
        db.add(EmployerValidation(
            placement_id=placement.id,
            employer_id=data.employer_id,
            action="Pending Review",
            confirmed_wage=data.monthly_wage,
            confirmed_role=data.job_role,
            has_mismatch=False
        ))

    log_audit_action(
        db,
        user_name=user_name,
        user_role=user_role,
        action="RECORD_PLACEMENT",
        resource_type="Placement",
        resource_id=placement.id,
        purpose_declared=f"Logged placement for trainee {trainee.trainee_code} with {data.employer_name}"
    )

    db.commit()
    return {"success": True, "placement_id": placement.id, "confidence_score": confidence}

@router.post("/timeline/{trainee_id}")
def append_timeline_log(
    trainee_id: str,
    data: EmploymentTimelineAppend,
    user_name: str = Query("Sunita Kamble (Field Officer)"),
    user_role: str = Query("field_officer"),
    db: Session = Depends(get_db)
):
    """
    Appends a new milestone entry into the append-only longitudinal employment log.
    Outcomes are never overwritten; they form an immutable historical progression.
    """
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    timeline_entry = EmploymentTimeline(
        trainee_id=trainee.id,
        checkpoint=data.checkpoint,
        status=data.status,
        employer_name=data.employer_name,
        job_role=data.job_role,
        monthly_wage=data.monthly_wage,
        log_date=data.log_date,
        verified_by=data.verified_by,
        verification_confidence=data.verification_confidence,
        source=data.source,
        job_relevance_score=data.job_relevance_score,
        is_same_employer_as_last=data.is_same_employer_as_last,
        notes=data.notes
    )
    db.add(timeline_entry)

    # Reflect in current status of trainee
    trainee.current_status = data.status

    log_audit_action(
        db,
        user_name=user_name,
        user_role=user_role,
        action="APPEND_TIMELINE_MILESTONE",
        resource_type="EmploymentTimeline",
        resource_id=trainee.id,
        purpose_declared=f"Appended {data.checkpoint} career milestone for {trainee.trainee_code}"
    )

    db.commit()
    return {"success": True, "timeline_id": timeline_entry.id}

@router.post("/self-employment")
def record_self_employment(
    data: SelfEmploymentCreate,
    user_name: str = Query("Field Counsellor"),
    user_role: str = Query("field_officer"),
    db: Session = Depends(get_db)
):
    trainee = db.query(Trainee).filter(Trainee.id == data.trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    # If existing self-employment record exists, update or replace
    existing = db.query(SelfEmploymentRecord).filter(SelfEmploymentRecord.trainee_id == trainee.id).first()
    if existing:
        existing.business_name = data.business_name
        existing.business_type = data.business_type
        existing.registration_type = data.registration_type
        existing.registration_number = data.registration_number
        existing.monthly_revenue_band = data.monthly_revenue_band
        existing.people_employed = data.people_employed
        existing.seed_capital_source = data.seed_capital_source
        existing.apprenticeship_stipend = data.apprenticeship_stipend
        existing.apprenticeship_duration_months = data.apprenticeship_duration_months
        rec_id = existing.id
    else:
        se_record = SelfEmploymentRecord(
            trainee_id=trainee.id,
            business_name=data.business_name,
            business_type=data.business_type,
            registration_type=data.registration_type,
            registration_number=data.registration_number,
            monthly_revenue_band=data.monthly_revenue_band,
            people_employed=data.people_employed,
            seed_capital_source=data.seed_capital_source,
            apprenticeship_stipend=data.apprenticeship_stipend,
            apprenticeship_duration_months=data.apprenticeship_duration_months
        )
        db.add(se_record)
        db.flush()
        rec_id = se_record.id

    is_apprentice = (data.business_type == "NAPS National Apprenticeship") or (data.apprenticeship_stipend is not None)
    trainee.current_status = "Apprenticeship" if is_apprentice else "Self-Employed"

    # Append to timeline
    wage_equiv = data.apprenticeship_stipend if is_apprentice else 25000.0
    db.add(EmploymentTimeline(
        trainee_id=trainee.id,
        checkpoint="Self-Employment Registration",
        status=trainee.current_status,
        employer_name=data.business_name,
        job_role="Apprentice" if is_apprentice else "Proprietor / Entrepreneur",
        monthly_wage=wage_equiv or 20000.0,
        log_date=datetime.utcnow().strftime("%Y-%m-%d"),
        verified_by="Udyam / MSME Portal Verification",
        verification_confidence=85,
        source="Udyam Aadhaar Match",
        job_relevance_score=5,
        is_same_employer_as_last=True,
        notes=f"Enterprise created {data.people_employed} additional local livelihood jobs (multiplier metric)."
    ))

    log_audit_action(
        db,
        user_name=user_name,
        user_role=user_role,
        action="LOG_SELF_EMPLOYMENT_OR_APPRENTICESHIP",
        resource_type="SelfEmployment",
        resource_id=rec_id,
        purpose_declared=f"Recorded enterprise {data.business_name} with {data.people_employed} jobs"
    )

    db.commit()
    return {"success": True, "record_id": rec_id, "status": trainee.current_status}

@router.post("/attrition")
def record_attrition(
    data: AttritionReasonCreate,
    user_name: str = Query("Center Head"),
    user_role: str = Query("provider"),
    db: Session = Depends(get_db)
):
    trainee = db.query(Trainee).filter(Trainee.id == data.trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    reason = AttritionReason(
        trainee_id=trainee.id,
        stage=data.stage,
        primary_reason=data.primary_reason,
        free_text_comment=data.free_text_comment,
        logged_at=datetime.utcnow()
    )
    db.add(reason)
    trainee.current_status = "Unemployed"

    # Append to timeline
    db.add(EmploymentTimeline(
        trainee_id=trainee.id,
        checkpoint="Attrition / Dropout Event",
        status="Unemployed",
        employer_name=None,
        job_role=None,
        monthly_wage=0.0,
        log_date=datetime.utcnow().strftime("%Y-%m-%d"),
        verified_by=user_name,
        verification_confidence=75,
        source="Assisted Outreach",
        job_relevance_score=1,
        is_same_employer_as_last=False,
        notes=f"Reason: {data.primary_reason}. {data.free_text_comment or ''}"
    ))

    db.commit()
    return {"success": True, "reason_id": reason.id}
