from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from app.database import get_db
from app.models import ConsentRecord, Trainee, AuditLog
from app.schemas import ConsentOptOutRequest
from app.services.audit_service import log_audit_action

router = APIRouter(prefix="/api/privacy", tags=["Privacy, Consent & Data Governance"])

@router.get("/audit-logs")
def get_audit_logs(
    limit: int = 50,
    action: Optional[str] = None,
    user_role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns permanent accountability audit logs tracking who accessed PII,
    exported data, or altered consent records.
    """
    q = db.query(AuditLog)
    if action:
        q = q.filter(AuditLog.action == action)
    if user_role:
        q = q.filter(AuditLog.user_role == user_role)

    logs = q.order_by(AuditLog.timestamp.desc()).limit(limit).all()

    return [
        {
            "id": log.id,
            "user_name": log.user_name,
            "user_role": log.user_role,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "purpose_declared": log.purpose_declared,
            "ip_address": log.ip_address,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        }
        for log in logs
    ]

@router.get("/consent/{trainee_id}")
def get_consent_record(trainee_id: str, db: Session = Depends(get_db)):
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    consent = trainee.consent
    if not consent:
        raise HTTPException(status_code=404, detail="No consent record registered for this trainee")

    return {
        "trainee_id": trainee.id,
        "trainee_name": trainee.full_name,
        "trainee_code": trainee.trainee_code,
        "consent_id": consent.id,
        "consent_given": consent.consent_given,
        "consent_version": consent.consent_version,
        "consent_timestamp": consent.consent_timestamp.isoformat() if consent.consent_timestamp else None,
        "purpose_of_use_text": consent.purpose_of_use_text,
        "allow_placement_tracking": consent.allow_placement_tracking,
        "allow_epfo_linking": consent.allow_epfo_linking,
        "allow_assisted_followup": consent.allow_assisted_followup,
        "opted_out": consent.opted_out,
        "opt_out_timestamp": consent.opt_out_timestamp.isoformat() if consent.opt_out_timestamp else None,
        "opt_out_reason": consent.opt_out_reason,
        "deletion_requested": consent.deletion_requested,
        "deletion_status": consent.deletion_status,
        "ip_address": consent.ip_address
    }

@router.post("/opt-out/{trainee_id}")
def process_opt_out(
    trainee_id: str,
    req: ConsentOptOutRequest,
    user_name: str = Query("Self-Service Portal / Trainee"),
    user_role: str = Query("trainee"),
    db: Session = Depends(get_db)
):
    """
    Allows a candidate to exercise their DPDP Act rights:
    revoke longitudinal tracking consent or request data deletion/anonymization.
    """
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")

    consent = trainee.consent
    if not consent:
        raise HTTPException(status_code=404, detail="Consent record not found")

    consent.opted_out = True
    consent.opt_out_timestamp = datetime.utcnow()
    consent.opt_out_reason = req.opt_out_reason
    consent.allow_placement_tracking = False
    consent.allow_epfo_linking = False
    consent.allow_assisted_followup = False

    if req.request_data_deletion:
        consent.deletion_requested = True
        consent.deletion_status = "Pending Review"

    log_audit_action(
        db,
        user_name=user_name,
        user_role=user_role,
        action="CONSENT_OPT_OUT_REVOKED",
        resource_type="ConsentRecord",
        resource_id=consent.id,
        purpose_declared=f"Trainee revoked consent. Reason: {req.opt_out_reason}. Deletion Requested: {req.request_data_deletion}"
    )

    db.commit()
    return {
        "success": True,
        "message": "Consent successfully revoked. Longitudinal tracking halted.",
        "opt_out_timestamp": consent.opt_out_timestamp.isoformat(),
        "deletion_status": consent.deletion_status
    }
