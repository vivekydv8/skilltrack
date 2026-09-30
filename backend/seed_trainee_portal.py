import uuid
from datetime import datetime
from app.database import SessionLocal
from app.models import (
    Trainee, EducationRecord, TraineeDocument, DigilockerConnection,
    TraineeAssessment, TraineeCertification, TraineeSkill, SkillGapRecord,
    TraineeRecommendation, WageProgressionRecord, TraineeNotification,
    Provider, Course
)

def seed_trainee_portal_data():
    db = SessionLocal()
    try:
        # Find Rahul Kumar
        trainee = db.query(Trainee).filter(
            (Trainee.skill_id == "ST-MH-7X42K9") | (Trainee.trainee_code == "MH-TRN-2024-0042")
        ).first()

        if not trainee:
            print("[SEED_TP] Trainee ST-MH-7X42K9 not found! Skipping.")
            return

        trainee_id = trainee.id
        print(f"[SEED_TP] Populating verified records for Trainee {trainee.full_name} ({trainee.skill_id})...")

        # Ensure canonical full name matches user account
        trainee.full_name = "Rahul Kumar"
        # Update Personal Profile details if not set
        if not trainee.date_of_birth:
            trainee.date_of_birth = "2002-05-14"
            trainee.address = "Plot 42, Shanti Nagar, Pimpri-Chinchwad"
            trainee.state = "Maharashtra"
            trainee.city = "Pune"
            trainee.pincode = "411019"
            trainee.bio = "Certified Electric Vehicle Technician specializing in battery diagnostics, thermal management, and CAN protocol calibration."
            trainee.target_role = "Senior EV Calibration Engineer"
            db.commit()

        # 1. Education Records
        if db.query(EducationRecord).filter(EducationRecord.trainee_id == trainee_id).count() == 0:
            edu1 = EducationRecord(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                qualification="Class 10 (SSC)",
                specialization="General Science & Mathematics",
                institution="Mahatma Phule High School, Pimpri",
                board_university="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)",
                passing_year=2019,
                percentage_cgpa="84.2%",
                certificate_url="/vault/documents/ssc_marksheet_2019.pdf",
                verification_status="Verified",
                source="Maharashtra State Board"
            )
            edu2 = EducationRecord(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                qualification="ITI (Vocational Certificate)",
                specialization="Mechanic Motor Vehicle / Automotive",
                institution="Government ITI Pune (Aundh Campus)",
                board_university="National Council for Vocational Training (NCVT) / DGT",
                passing_year=2021,
                percentage_cgpa="79.5%",
                certificate_url="/vault/documents/ncvt_iti_certificate.pdf",
                verification_status="Verified",
                source="NCVT / DGT Portal"
            )
            edu3 = EducationRecord(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                qualification="Class 12 (HSC)",
                specialization="Science (Vocational Bifocal)",
                institution="Fergusson Junior College, Pune",
                board_university="Maharashtra State Board (Pune Divisional Board)",
                passing_year=2023,
                percentage_cgpa="76.8%",
                certificate_url="/vault/documents/hsc_certificate_2023.pdf",
                verification_status="Verified",
                source="Maharashtra State Board"
            )
            db.add_all([edu1, edu2, edu3])

        # 2. Document Vault with Document AI OCR Structure
        if db.query(TraineeDocument).filter(TraineeDocument.trainee_id == trainee_id).count() == 0:
            doc1 = TraineeDocument(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                category="Education",
                doc_type="Marksheet",
                title="Class 10 SSC Statement of Marks",
                file_name="MSBSHSE_SSC_2019_RahulKumar.pdf",
                file_url="/vault/documents/MSBSHSE_SSC_2019_RahulKumar.pdf",
                file_size_kb=320,
                mime_type="application/pdf",
                issuer="Maharashtra State Board of Secondary & Higher Secondary Education",
                issue_date="2019-06-15",
                verification_status="Verified",
                source="Maharashtra State Board Digital Repository",
                access_permissions=["trainee", "training_provider", "govt_admin"],
                consent_status="Granted",
                extracted_data={
                    "candidate_name": "RAHUL RAMESH KUMAR",
                    "roll_number": "P198274",
                    "total_marks": "421/500",
                    "percentage": 84.2,
                    "grade": "Distinction",
                    "subjects": ["English", "Marathi", "Science & Tech", "Mathematics", "Social Sciences"]
                },
                ocr_confidence=0.98,
                evidence_source="State Board OCR & QR Verification Engine",
                verified_at=datetime.utcnow()
            )
            doc2 = TraineeDocument(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                category="Skill & Training",
                doc_type="ITI Certificate",
                title="NCVT National Trade Certificate (Mechanic Motor Vehicle)",
                file_name="NCVT_Trade_Certificate_MMV.pdf",
                file_url="/vault/documents/NCVT_Trade_Certificate_MMV.pdf",
                file_size_kb=450,
                mime_type="application/pdf",
                issuer="Directorate General of Training (DGT), Ministry of Skill Development",
                issue_date="2021-08-20",
                verification_status="Verified",
                source="DGT / NCVT National Academic Depository",
                access_permissions=["trainee", "training_provider", "govt_admin", "employer"],
                consent_status="Granted",
                extracted_data={
                    "trade": "Mechanic Motor Vehicle",
                    "nsqf_level": 4,
                    "certificate_number": "NTC/2021/MH/88392",
                    "practical_score": "248/270",
                    "theory_score": "78/100",
                    "result": "Passed with First Class"
                },
                ocr_confidence=0.96,
                evidence_source="NCVT Digital Vault Verifier v2.0",
                verified_at=datetime.utcnow()
            )
            doc3 = TraineeDocument(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                category="Skill & Training",
                doc_type="Skill Certificate",
                title="Certified EV Diagnostics & Powertrain Specialist",
                file_name="DVET_EV_Specialist_Certificate.pdf",
                file_url="/vault/documents/DVET_EV_Specialist_Certificate.pdf",
                file_size_kb=380,
                mime_type="application/pdf",
                issuer="Directorate of Vocational Education & Training (DVET), Maharashtra",
                issue_date="2024-02-15",
                verification_status="Verified",
                source="Training Provider (Govt ITI Pune)",
                access_permissions=["trainee", "training_provider", "govt_admin", "employer"],
                consent_status="Granted",
                extracted_data={
                    "course_code": "EV-DIAG-2024",
                    "competencies": ["BMS Diagnostics", "CAN Bus Protocol", "High Voltage Safety", "Thermal Systems"],
                    "assessment_score": "88/100",
                    "board": "Maharashtra State Board of Vocational Education (MSBVE)"
                },
                ocr_confidence=0.99,
                evidence_source="DVET Direct Institutional Registry",
                verified_at=datetime.utcnow()
            )
            doc4 = TraineeDocument(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                category="Experience",
                doc_type="Experience Certificate",
                title="Employment Confirmation & 6-Month Service Record",
                file_name="Tata_Motors_Service_Certificate.pdf",
                file_url="/vault/documents/Tata_Motors_Service_Certificate.pdf",
                file_size_kb=290,
                mime_type="application/pdf",
                issuer="Tata Motors Ltd (EV Division, Pune)",
                issue_date="2024-09-01",
                verification_status="Verified",
                source="Employer Direct HR Integration",
                access_permissions=["trainee", "training_provider", "govt_admin", "employer"],
                consent_status="Granted",
                extracted_data={
                    "designation": "EV Service Specialist",
                    "plant_location": "Pimpri, Pune",
                    "gross_monthly_salary": "₹24,000",
                    "tenure_months": 6,
                    "performance_rating": "Exceeds Expectations"
                },
                ocr_confidence=0.95,
                evidence_source="Employer HR Validation Signature",
                verified_at=datetime.utcnow()
            )
            db.add_all([doc1, doc2, doc3, doc4])

        # 3. DigiLocker Connection Status
        if not db.query(DigilockerConnection).filter(DigilockerConnection.trainee_id == trainee_id).first():
            digi = DigilockerConnection(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                is_connected=False,
                digilocker_id=None,
                status="Not Configured",
                consent_granted=False,
                config_status="DigiLocker integration is not configured for this deployment."
            )
            db.add(digi)

        # 4. Trainee Assessments
        if db.query(TraineeAssessment).filter(TraineeAssessment.trainee_id == trainee_id).count() == 0:
            p = db.query(Provider).first()
            c = db.query(Course).first()
            asm1 = TraineeAssessment(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                provider_id=p.id if p else None,
                course_id=c.id if c else None,
                assessment_name="Practical EV Powertrain Diagnostics & High-Voltage Safety Exam",
                assessment_date="2024-02-10",
                score=88.0,
                max_score=100.0,
                percentage=88.0,
                competency_level="Level 3 - Advanced Practitioner",
                skills_evaluated=["High Voltage Lockout/Tagout", "CAN Bus Fault Isolation", "BMS State-of-Health Estimation"],
                result="Pass with Distinction",
                verification_status="Verified",
                verified_by="Maharashtra State Board of Skill Development (MSBSD)"
            )
            asm2 = TraineeAssessment(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                provider_id=p.id if p else None,
                course_id=c.id if c else None,
                assessment_name="Mid-Term Automotive Electrical Systems & Multimeter Testing",
                assessment_date="2023-11-28",
                score=82.5,
                max_score=100.0,
                percentage=82.5,
                competency_level="Level 2 - Proficient",
                skills_evaluated=["Multimeter Diagnostics", "Relay & Fuse Testing", "Wiring Harness Inspection"],
                result="Pass",
                verification_status="Verified",
                verified_by="Government ITI Pune Internal Assessment Cell"
            )
            db.add_all([asm1, asm2])

        # 5. Trainee Certifications
        if db.query(TraineeCertification).filter(TraineeCertification.trainee_id == trainee_id).count() == 0:
            cert1 = TraineeCertification(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                certificate_name="State Certificate in Electric Vehicle Service & Diagnostics",
                issuer="Directorate of Vocational Education & Training (DVET), Maharashtra",
                qualification="NSQF Level 4 Professional Certificate",
                skills_certified=["EV Diagnostics", "High-Voltage Safety", "Battery Thermal Systems"],
                issue_date="2024-02-15",
                expiry_date="2029-02-15",
                credential_id="MH-DVET-2024-0042",
                verification_status="Verified",
                source="Training Provider (Govt ITI Pune)",
                document_url="/vault/documents/DVET_EV_Specialist_Certificate.pdf"
            )
            cert2 = TraineeCertification(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                certificate_name="Automotive High Voltage Safety & Maintenance Certification",
                issuer="Automotive Skills Development Council (ASDC)",
                qualification="National Skill Standard ASDC-L4",
                skills_certified=["High Voltage Protocol", "Insulation Resistance Testing"],
                issue_date="2023-12-05",
                expiry_date="2028-12-05",
                credential_id="ASDC-HV-9942",
                verification_status="Verified",
                source="Automotive Skills Development Council"
            )
            db.add_all([cert1, cert2])

        # 6. Trainee Skills with Confidence Framework
        if db.query(TraineeSkill).filter(TraineeSkill.trainee_id == trainee_id).count() == 0:
            skills = [
                TraineeSkill(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    skill_name="EV Diagnostics & Fault Code Analysis",
                    proficiency="Advanced",
                    category="Verified Skills",
                    source="MSBSD Practical Competency Exam",
                    confidence=0.96,
                    confidence_level="VERIFIED",
                    evidence="MSBSD Assessment Record #EV-2024-88 scored 88/100 Distinction"
                ),
                TraineeSkill(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    skill_name="Battery Management Systems (BMS)",
                    proficiency="Intermediate",
                    category="Verified Skills",
                    source="DVET State Certificate #MH-DVET-2024-0042",
                    confidence=0.94,
                    confidence_level="VERIFIED",
                    evidence="ASDC Accredited Certificate ASDC-HV-9942 and DVET Curriculum Module 3"
                ),
                TraineeSkill(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    skill_name="High Voltage Safety & Lockout/Tagout",
                    proficiency="Advanced",
                    category="Assessment-Derived Skills",
                    source="Govt ITI Pune Hands-on Lab Exam",
                    confidence=0.92,
                    confidence_level="VERIFIED",
                    evidence="Practical Demonstration Assessment 2024 (100% safety checklist adherence)"
                ),
                TraineeSkill(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    skill_name="CAN Bus Protocol Diagnostics",
                    proficiency="Intermediate",
                    category="Training-Derived Skills",
                    source="Course Curriculum (EV Diagnostics Module 4)",
                    confidence=0.88,
                    confidence_level="CORROBORATED",
                    evidence="Course batch completion records at Govt ITI Pune (88% attendance)"
                ),
                TraineeSkill(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    skill_name="Automotive Wiring & Harness Repair",
                    proficiency="Advanced",
                    category="Training-Derived Skills",
                    source="NCVT ITI Mechanic Motor Vehicle Syllabus",
                    confidence=0.85,
                    confidence_level="CORROBORATED",
                    evidence="NCVT Trade Certificate NTC/2021/MH/88392"
                ),
                TraineeSkill(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    skill_name="Python for OBD-II Vehicle Telematics",
                    proficiency="Beginner",
                    category="Self-Reported Skills",
                    source="Trainee Self-Declaration",
                    confidence=0.50,
                    confidence_level="SELF-REPORTED",
                    evidence="Self-reported entry in Trainee Portal profile (unverified by external exam)"
                ),
                TraineeSkill(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    skill_name="Thermal Management System Troubleshooting",
                    proficiency="Intermediate",
                    category="AI-Inferred Skills",
                    source="Document AI Extraction from Tata Motors Service Record",
                    confidence=0.82,
                    confidence_level="AI-INFERRED",
                    evidence="Extracted by Document AI from verified Tata Motors Service Record mentioning EV cooling loop maintenance"
                )
            ]
            db.add_all(skills)

        # 7. Skill Gap Record
        if db.query(SkillGapRecord).filter(SkillGapRecord.trainee_id == trainee_id).count() == 0:
            sg = SkillGapRecord(
                id=str(uuid.uuid4()),
                trainee_id=trainee_id,
                target_role="Senior EV Calibration Engineer",
                required_skills=["EV Diagnostics", "BMS", "High Voltage Safety", "Embedded C", "Vector CANoe", "MATLAB Simulink"],
                skills_have=["EV Diagnostics", "BMS", "High Voltage Safety"],
                missing_skills=["Embedded C", "Vector CANoe", "MATLAB Simulink"],
                evidence="Target Role requires embedded vehicle software toolchains not covered in vocational ITI EV syllabus.",
                recommended_action="Enroll in Department of Skills approved 6-week bridge module on 'Automotive Embedded Systems & CANoe Protocol Analysis' at COEP Technological University."
            )
            db.add(sg)

        # 8. Trainee Recommendations
        if db.query(TraineeRecommendation).filter(TraineeRecommendation.trainee_id == trainee_id).count() == 0:
            recs = [
                TraineeRecommendation(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    recommendation_type="Course",
                    title="Automotive Embedded Systems & CANoe Protocol Analysis",
                    description="6-week hands-on bridge programme covering Vector CANoe diagnostics, ECU communication and Embedded C basics.",
                    reason_why="Required to close the critical skill gap for Senior EV Calibration Engineer roles in Pune automotive corridor.",
                    evidence="Tata Motors & Mahindra EV job specifications require CANoe tools; current verified profile does not contain embedded toolchain evidence.",
                    confidence=0.94,
                    lineage_model="SkillTrack-Employability-Intelligence-v1.0"
                ),
                TraineeRecommendation(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    recommendation_type="Certification",
                    title="ASDC Level 5 High Voltage Powertrain Specialist",
                    description="National certification qualifying technicians for supervisory and advanced diagnostic roles in OEM manufacturing.",
                    reason_why="Upgrades NSQF qualification from Level 4 to Level 5, unlocking higher wage bands (₹28,000 - ₹35,000).",
                    evidence="Maharashtra State Skilling outcome dataset indicates a 26.4% average wage premium for NSQF Level 5 certified technicians in Pune district.",
                    confidence=0.91,
                    lineage_model="SkillTrack-Outcome-Prediction-v1.0"
                ),
                TraineeRecommendation(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    recommendation_type="Job",
                    title="Senior EV Diagnostics Specialist at Tata Motors Ltd",
                    description="Open vacancy at Tata Motors EV Division, Pimpri Plant. Requires 6+ months experience and EV diagnostic certification.",
                    reason_why="Matches 85% of your verified skills (EV Diagnostics, BMS, High Voltage Safety) with current employer.",
                    evidence="Verified placement history confirms 6-month continuous retention at Tata Motors with positive employer feedback.",
                    confidence=0.95,
                    lineage_model="SkillTrack-Semantic-Job-Matcher-v1.0"
                )
            ]
            db.add_all(recs)

        # 9. Wage Progression Records
        if db.query(WageProgressionRecord).filter(WageProgressionRecord.trainee_id == trainee_id).count() == 0:
            wages = [
                WageProgressionRecord(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    stage="Training",
                    wage=8000.0,
                    source="Govt ITI Apprenticeship Stipend (NAPS)",
                    verification_status="VERIFIED",
                    effective_date="2023-09-01"
                ),
                WageProgressionRecord(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    stage="First Employment",
                    wage=21000.0,
                    source="Tata Motors Offer Letter & Training Provider Placement Log",
                    verification_status="CORROBORATED",
                    effective_date="2024-03-01"
                ),
                WageProgressionRecord(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    stage="30 Days",
                    wage=21000.0,
                    source="Trainee Self-Service Checkpoint & Initial Payroll Deposit",
                    verification_status="CORROBORATED",
                    effective_date="2024-04-15"
                ),
                WageProgressionRecord(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    stage="90 Days",
                    wage=22500.0,
                    source="Tata Motors HR Confirmation & Probation Completion Wage Adjustment",
                    verification_status="VERIFIED",
                    effective_date="2024-06-30"
                ),
                WageProgressionRecord(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    stage="180 Days",
                    wage=24000.0,
                    source="Employer HR Portal Direct Confirmation & Verified Payslip",
                    verification_status="VERIFIED",
                    effective_date="2024-09-15"
                ),
                WageProgressionRecord(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    stage="Current",
                    wage=24000.0,
                    source="Active Verified Employment Record (Tata Motors EV Division)",
                    verification_status="VERIFIED",
                    effective_date="2024-11-01"
                )
            ]
            db.add_all(wages)

        # 10. Trainee Notifications
        if db.query(TraineeNotification).filter(TraineeNotification.trainee_id == trainee_id).count() == 0:
            notifs = [
                TraineeNotification(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    title="Assessment Verified by State Board",
                    message="Your score of 88/100 in Practical EV Powertrain Diagnostics has been verified by the Maharashtra State Board of Skill Development.",
                    category="assessment",
                    is_read=False,
                    action_url="/trainee/assessments"
                ),
                TraineeNotification(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    title="Digital Certificate Ready in Vault",
                    message="Official DVET Certificate 'Certified EV Diagnostics Specialist' is now available in your Document Vault.",
                    category="certificate",
                    is_read=False,
                    action_url="/trainee/documents"
                ),
                TraineeNotification(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    title="180-Day Employment Milestone Confirmed",
                    message="Tata Motors Ltd confirmed your 180-day employment milestone at ₹24,000/month with VERIFIED status.",
                    category="verification",
                    is_read=True,
                    action_url="/trainee/wage"
                ),
                TraineeNotification(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    title="New Job Opportunity Match",
                    message="Your verified profile matches 85% of requirements for 'Senior EV Diagnostics Specialist' at Tata Motors.",
                    category="job_match",
                    is_read=False,
                    action_url="/trainee/jobs"
                ),
                TraineeNotification(
                    id=str(uuid.uuid4()),
                    trainee_id=trainee_id,
                    title="Career Skill Gap Identified",
                    message="Target role 'Senior EV Calibration Engineer' requires Embedded C and CANoe tool competencies.",
                    category="skill_gap",
                    is_read=False,
                    action_url="/trainee/skill-gaps"
                )
            ]
            db.add_all(notifs)

        db.commit()
        print("[SEED_TP] Successfully seeded verified Trainee Portal records!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_trainee_portal_data()
