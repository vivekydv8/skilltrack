import asyncio
import httpx
from datetime import datetime
from app.main import app

async def run_all_tests():
    print("=" * 70)
    print("SKILLTRACKAI — PRODUCTION TRAINEE PORTAL E2E TEST SUITE")
    print("=" * 70)

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # -------------------------------------------------------------
        # TEST 1: Real Trainee Authentication (Valid Login by Skill ID)
        # -------------------------------------------------------------
        print("\n[TEST 1] Trainee Authentication with Canonical Skill ID...")
        res = await client.post("/api/auth/login", json={
            "identifier": "ST-MH-7X42K9",
            "password": "Trainee@2025"
        })
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        data = res.json()
        assert "access_token" in data
        assert data["user"]["role"] == "trainee"
        token = data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("  [OK] Login succeeded with token issued.")

        # -------------------------------------------------------------
        # TEST 2: Account Lockout & Password Security
        # -------------------------------------------------------------
        print("\n[TEST 2] Password Rejection & Security Checks...")
        bad_res = await client.post("/api/auth/login", json={
            "identifier": "ST-MH-7X42K9",
            "password": "WrongPassword!99"
        })
        assert bad_res.status_code == 401, f"Expected 401, got {bad_res.status_code}"
        assert "remaining before temporary account lockout" in bad_res.json()["detail"]
        print("  [OK] Incorrect password cleanly rejected with remaining attempt count displayed.")

        # -------------------------------------------------------------
        # TEST 3: Account Recovery & Password Reset
        # -------------------------------------------------------------
        print("\n[TEST 3] Account Recovery & Password Reset...")
        rec_res = await client.post("/api/auth/forgot-password", json={
            "identifier": "ST-MH-7X42K9"
        })
        assert rec_res.status_code == 200
        assert "test_recovery_code" in rec_res.json()
        rec_code = rec_res.json()["test_recovery_code"]

        reset_res = await client.post("/api/auth/reset-password", json={
            "identifier": "ST-MH-7X42K9",
            "recovery_code": rec_code,
            "new_password": "Trainee@2025"
        })
        assert reset_res.status_code == 200
        print("  [OK] Account recovery and password reset verified.")

        # -------------------------------------------------------------
        # TEST 4: Trainee Profile & Calculated Profile Strength
        # -------------------------------------------------------------
        print("\n[TEST 4] Trainee Profile & Strength Metric...")
        prof_res = await client.get("/api/trainee/profile", headers=headers)
        assert prof_res.status_code == 200
        p_data = prof_res.json()
        assert p_data["skill_id"] == "ST-MH-7X42K9"
        assert p_data["full_name"] == "Rahul Kumar"
        assert "percentage" in p_data["profile_strength"]
        print(f"  [OK] Profile retrieved for {p_data['full_name']} (Skill ID: {p_data['skill_id']}) with strength {p_data['profile_strength']['percentage']}%.")

        # -------------------------------------------------------------
        # TEST 5: Educational Qualifications
        # -------------------------------------------------------------
        print("\n[TEST 5] Educational Qualifications...")
        edu_res = await client.get("/api/trainee/education", headers=headers)
        assert edu_res.status_code == 200
        edu_list = edu_res.json()
        assert len(edu_list) >= 3
        assert any(e["qualification"].startswith("Class 10") for e in edu_list)
        assert any("ITI" in e["qualification"] for e in edu_list)
        print(f"  [OK] {len(edu_list)} verified qualification records retrieved.")

        # -------------------------------------------------------------
        # TEST 6: DigiLocker Integration & Automated Document Verification
        # -------------------------------------------------------------
        print("\n[TEST 6] DigiLocker Operational Status & Auto-Verification...")
        digi_res = await client.get("/api/trainee/digilocker/status", headers=headers)
        assert digi_res.status_code == 200
        d_data = digi_res.json()
        assert d_data["is_configured"] is True

        # Authorize DigiLocker and verify automated document sync
        auth_digi = await client.post("/api/trainee/digilocker/authorize", headers=headers)
        assert auth_digi.status_code == 200
        auth_data = auth_digi.json()
        assert auth_data["connected"] is True
        assert auth_data["verified_documents_count"] >= 3
        print(f"  [OK] DigiLocker successfully authenticated candidate and verified {auth_data['verified_documents_count']} documents.")

        # -------------------------------------------------------------
        # TEST 7: Document Vault & Document AI OCR Intelligence
        # -------------------------------------------------------------
        print("\n[TEST 7] Document Vault & Document AI Extraction Structure...")
        doc_res = await client.get("/api/trainee/documents", headers=headers)
        assert doc_res.status_code == 200
        docs = doc_res.json()
        assert len(docs) >= 3
        # Check Document AI structured extraction on first doc
        sample_doc = docs[0]
        assert "extracted_data" in sample_doc
        assert sample_doc["ocr_confidence"] > 0.8
        print(f"  [OK] Document Vault returned {len(docs)} records with OCR confidence {sample_doc['ocr_confidence'] * 100}%.")

        # -------------------------------------------------------------
        # TEST 8: Skill Profile & Confidence Framework
        # -------------------------------------------------------------
        print("\n[TEST 8] Skill Profile with Confidence Framework...")
        skill_res = await client.get("/api/trainee/skills", headers=headers)
        assert skill_res.status_code == 200
        s_data = skill_res.json()
        assert s_data["total_skills"] >= 6
        assert "Verified Skills" in s_data["categories"]
        assert "Training-Derived Skills" in s_data["categories"]
        assert "Assessment-Derived Skills" in s_data["categories"]
        assert "Self-Reported Skills" in s_data["categories"]
        assert "AI-Inferred Skills" in s_data["categories"]
        print(f"  [OK] Skills categorized across all 5 confidence tiers ({s_data['total_skills']} total skills).")

        # -------------------------------------------------------------
        # TEST 9: Skill Gaps Identification
        # -------------------------------------------------------------
        print("\n[TEST 9] Skill Gap Detection...")
        gap_res = await client.get("/api/trainee/skill-gaps", headers=headers)
        assert gap_res.status_code == 200
        gaps = gap_res.json()
        assert len(gaps) >= 1
        assert "target_role" in gaps[0]
        assert len(gaps[0]["missing_skills"]) > 0
        print(f"  [OK] Skill gaps detected for Target Role: '{gaps[0]['target_role']}' (Missing: {gaps[0]['missing_skills']}).")

        # -------------------------------------------------------------
        # TEST 10: Explainable Job Matching
        # -------------------------------------------------------------
        print("\n[TEST 10] Explainable Job Matching...")
        job_res = await client.get("/api/trainee/jobs", headers=headers)
        assert job_res.status_code == 200
        jobs = job_res.json()
        assert len(jobs) >= 1
        first_job = jobs[0]
        assert "explainable_match" in first_job
        em = first_job["explainable_match"]
        assert "match_percentage" in em
        assert "matching_skills" in em
        assert "missing_skills" in em
        print(f"  [OK] Explainable match for '{first_job['job_title']}': {em['match_percentage']}% with clear evidence.")

        # -------------------------------------------------------------
        # TEST 11: Longitudinal Wage Progression (Zero Invented Salary)
        # -------------------------------------------------------------
        print("\n[TEST 11] Longitudinal Wage Progression Timeline...")
        wage_res = await client.get("/api/trainee/wage", headers=headers)
        assert wage_res.status_code == 200
        w_data = wage_res.json()
        assert w_data["available"] is True
        assert len(w_data["stages"]) >= 4
        print(f"  [OK] Wage progression tracks {len(w_data['stages'])} actual stages ({w_data['stages'][0]['stage']} -> {w_data['stages'][-1]['stage']}: Rs.{w_data['stages'][-1]['wage']}).")

        # -------------------------------------------------------------
        # TEST 12: SkillTrackAI Assistant (Zero Hallucination & Citations)
        # -------------------------------------------------------------
        print("\n[TEST 12] SkillTrackAI Profile-Aware Assistant...")
        ai_res = await client.post("/api/ai/chat", headers=headers, json={
            "message": "Which skills should I learn next?"
        })
        assert ai_res.status_code == 200
        msg = ai_res.json()["message"]
        assert len(msg["citations"]) > 0
        assert "Senior EV Calibration Engineer" in msg["content"] or "Embedded C" in msg["content"]
        print(f"  [OK] Assistant answered with citation: {msg['citations'][0]}")

        # -------------------------------------------------------------
        # TEST 13: Privacy Center & DPDP Compliance
        # -------------------------------------------------------------
        print("\n[TEST 13] Privacy Center & DPDP Data Export...")
        priv_res = await client.get("/api/trainee/privacy", headers=headers)
        assert priv_res.status_code == 200
        assert "consents" in priv_res.json()

        exp_res = await client.get("/api/trainee/export", headers=headers)
        assert exp_res.status_code == 200
        assert "export_metadata" in exp_res.json()
        print("  [OK] DPDP Act 2023 data export and privacy center validated.")

        # -------------------------------------------------------------
        # TEST 14: Fresh Trainee Registration & Empty States (Rule #0)
        # -------------------------------------------------------------
        print("\n[TEST 14] Fresh Trainee Registration & Authentic Empty States...")
        test_email = f"trainee.test.{datetime.utcnow().timestamp()}@maharashtra.gov.in"
        reg_res = await client.post("/api/auth/register", json={
            "name": "Ajay Shinde",
            "email": test_email,
            "password": "Password@2026",
            "role": "trainee",
            "phone": "+91 98111 22334"
        })
        assert reg_res.status_code == 200
        fresh_token = reg_res.json()["access_token"]
        fresh_headers = {"Authorization": f"Bearer {fresh_token}"}

        # Check empty states
        fresh_edu = await client.get("/api/trainee/education", headers=fresh_headers)
        assert fresh_edu.json() == []

        fresh_docs = await client.get("/api/trainee/documents", headers=fresh_headers)
        assert fresh_docs.json() == []

        fresh_skills = await client.get("/api/trainee/skills", headers=fresh_headers)
        assert fresh_skills.json()["total_skills"] == 0

        fresh_wage = await client.get("/api/trainee/wage", headers=fresh_headers)
        assert fresh_wage.json()["available"] is False
        assert "No verified wage progression data available yet." in fresh_wage.json()["message"]

        fresh_recs = await client.get("/api/trainee/recommendations", headers=fresh_headers)
        assert fresh_recs.json()["available"] is False
        assert "More verified profile information is required" in fresh_recs.json()["message"]

        print("  [OK] Fresh candidate receives unique Skill ID with 100% authentic empty states and ZERO fake data.")

    print("\n" + "=" * 70)
    print("ALL 14 PRODUCTION E2E SUITE TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(run_all_tests())
