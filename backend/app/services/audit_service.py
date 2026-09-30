from datetime import datetime
from sqlalchemy.orm import Session
from app.models import AuditLog

def log_audit_action(
    db: Session,
    user_name: str,
    user_role: str,
    action: str,
    resource_type: str,
    resource_id: str = None,
    purpose_declared: str = "Standard Administrative Oversight",
    ip_address: str = "127.0.0.1"
):
    """
    Centralized auditable event logger for DPDP Act & Govt of Maharashtra compliance.
    Ensures who accessed what record, purpose, and timestamp are permanently recorded.
    """
    try:
        log_entry = AuditLog(
            user_name=user_name,
            user_role=user_role,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            purpose_declared=purpose_declared,
            ip_address=ip_address,
            timestamp=datetime.utcnow()
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[AUDIT_ERROR] Failed to record audit log: {e}")
