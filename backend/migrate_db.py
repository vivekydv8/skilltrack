import sqlite3
import os
from app.database import engine, Base
from app.models import (
    User, Course, Provider, Batch, Employer, Trainee, ConsentRecord,
    AlternateContact, PlacementRecord, EmploymentTimeline, FollowUpSchedule,
    EmployerValidation, SelfEmploymentRecord, AttritionReason, EmployerSkillFeedback,
    AuditLog, JobPosting, JobApplication, EntityMatch, CurriculumIntervention,
    EducationRecord, TraineeDocument, DigilockerConnection, TraineeAssessment,
    TraineeCertification, TraineeSkill, SkillGapRecord, TraineeRecommendation,
    WageProgressionRecord, TraineeNotification, ChatSession, ChatMessage,
    ProfileCorrectionRequest
)

def run_migration():
    print("[MIGRATION] Creating all schema tables...")
    Base.metadata.create_all(bind=engine)

    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skilltrackai.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    def add_col_if_missing(table, col, col_type, default_val=None):
        cursor.execute(f"PRAGMA table_info({table})")
        cols = [r[1] for r in cursor.fetchall()]
        if col not in cols:
            print(f"Adding column '{col}' to table '{table}'...")
            d_clause = f" DEFAULT {default_val}" if default_val is not None else ""
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}{d_clause}")

    # Trainees
    add_col_if_missing("trainees", "skill_id", "VARCHAR(64)")
    add_col_if_missing("trainees", "date_of_birth", "VARCHAR(20)")
    add_col_if_missing("trainees", "address", "VARCHAR(255)")
    add_col_if_missing("trainees", "state", "VARCHAR(60)", "'Maharashtra'")
    add_col_if_missing("trainees", "city", "VARCHAR(60)")
    add_col_if_missing("trainees", "pincode", "VARCHAR(10)")
    add_col_if_missing("trainees", "profile_photo_url", "VARCHAR(255)")
    add_col_if_missing("trainees", "bio", "TEXT")
    add_col_if_missing("trainees", "target_role", "VARCHAR(100)")

    # Users
    add_col_if_missing("users", "failed_login_attempts", "INTEGER", 0)
    add_col_if_missing("users", "is_locked", "BOOLEAN", 0)
    add_col_if_missing("users", "lockout_until", "DATETIME")
    add_col_if_missing("users", "last_login_at", "DATETIME")

    # Consent records
    add_col_if_missing("consent_records", "consent_digilocker_access", "BOOLEAN", 0)
    add_col_if_missing("consent_records", "consent_document_processing", "BOOLEAN", 1)
    add_col_if_missing("consent_records", "consent_ai_personalization", "BOOLEAN", 1)
    add_col_if_missing("consent_records", "consent_employer_sharing", "BOOLEAN", 1)
    add_col_if_missing("consent_records", "consent_govt_analytics", "BOOLEAN", 1)
    add_col_if_missing("consent_records", "consent_job_recommendations", "BOOLEAN", 1)
    add_col_if_missing("consent_records", "consent_training_recommendations", "BOOLEAN", 1)

    conn.commit()
    conn.close()
    print("[MIGRATION] Migration successfully finished!")

if __name__ == "__main__":
    run_migration()
