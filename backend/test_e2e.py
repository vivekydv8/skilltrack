import urllib.request
import json

BASE = 'http://127.0.0.1:8000'

def post_json(path, data, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(BASE + path, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')

def get_json(path, token=None):
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(BASE + path, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')

def run_tests():
    print('=====================================================')
    print('  SkillTrackAI - End-to-End Persona & API Verification')
    print('=====================================================')

    # 1. Test Logins
    print('\n[1] Testing Auth Logins for All 4 Roles:')
    official_credentials = [
        ('GOV-ADMIN-01', 'GovAdmin@2025', 'govt_admin'),
        ('ITI-PUNE-01', 'ItiHead@2025', 'training_provider'),
        ('EMP-TATA-01', 'TataMotors@2025', 'employer'),
        ('ST-MH-7X42K9', 'Trainee@2025', 'trainee')
    ]

    tokens = {}
    for identifier, pwd, role in official_credentials:
        status, res = post_json('/api/auth/login', {'identifier': identifier, 'password': pwd, 'role': role})
        assert status == 200, f'Login failed for {identifier}: {res}'
        tokens[role] = res['access_token']
        user = res['user']
        print(f"  [PASS] {role.upper()} Logged In via ID ({identifier}): {user['name']} | ID: {user['id']} | Token: {tokens[role][:18]}...")

    # Verify wrong password rejection
    bad_status, bad_res = post_json('/api/auth/login', {'identifier': 'GOV-ADMIN-01', 'password': 'WrongPassword123'})
    assert bad_status == 401, f'Expected 401 for wrong password, got {bad_status}'
    print("  [PASS] Rejected unauthorized login with invalid password (401 Unauthorized)")

    # 2. Test /api/auth/me
    print('\n[2] Testing Token Validation via /api/auth/me:')
    for role, token in tokens.items():
        status, user = get_json('/api/auth/me', token)
        assert status == 200, f'Failed /me for {role}: {user}'
        print(f"  [PASS] Validated {role}: email={user['email']}, org={user.get('organization')}")

    # 3. Test Canonical Trainee by Skill ID
    print('\n[3] Testing Canonical Trainee Lookup by Skill ID (ST-MH-7X42K9):')
    status, trainee = get_json('/api/trainees/by-skill-id/ST-MH-7X42K9', tokens['govt_admin'])
    assert status == 200, f'Failed to fetch canonical trainee: {trainee}'
    print(f"  [PASS] Found Candidate: {trainee['full_name']}")
    print(f"  [PASS] Skill ID: {trainee['skill_id']}")
    print(f"  [PASS] Confidence: {trainee['confidence_level']}")
    print(f"  [PASS] Course: {trainee['course']['course_name']}")
    print(f"  [PASS] Missing Skills: {trainee.get('missing_skills')}")
    assert trainee['skill_id'] == 'ST-MH-7X42K9'
    assert trainee['full_name'] == 'Rahul Kumar'

    # 4. Test Government Analytics KPIs & Multi-Level Drill Down
    print('\n[4] Testing State-Level Government Intelligence APIs:')
    status, kpis = get_json('/api/analytics/government/kpis', tokens['govt_admin'])
    assert status == 200, f'Failed /government/kpis: {kpis}'
    print(f"  [PASS] State Overview KPIs keys: {list(kpis.keys())}")
    total_enr = kpis.get('total_enrolled') or kpis.get('total_trainees')
    v_rate = kpis.get('verified_placement_rate_pct') or kpis.get('employment_rate')
    v_wage = kpis.get('average_verified_wage') or kpis.get('average_wage')
    alerts_c = kpis.get('skill_gap_alerts_count') or kpis.get('skill_gap_alerts')
    hr_c = kpis.get('high_risk_trainees_count') or kpis.get('high_risk_count')
    print(f"    - Total Enrolled: {total_enr}")
    print(f"    - Verified Placement Rate: {v_rate}%")
    print(f"    - Average Verified Wage: Rs. {v_wage:,}")
    print(f"    - Skill Gap Alerts: {alerts_c}")
    print(f"    - High Risk Count: {hr_c}")

    status, drilldown = get_json('/api/analytics/drilldown', tokens['govt_admin'])
    assert status == 200, f'Failed /drilldown: {drilldown}'
    print(f"  [PASS] Multi-Level Drill Down: State={drilldown['state']}, Districts={len(drilldown['districts'])}")
    for d in drilldown['districts']:
        print(f"    - District {d.get('district')}: {len(d.get('institutes', []))} institutes registered")

    status, alerts = get_json('/api/analytics/early-warnings', tokens['govt_admin'])
    assert status == 200, f'Failed /early-warnings: {alerts}'
    print(f"  [PASS] Early Warning Alerts count: {len(alerts)}")

    status, insights = get_json('/api/analytics/curriculum-insights', tokens['govt_admin'])
    assert status == 200, f'Failed /curriculum-insights: {insights}'
    print(f"  [PASS] Curriculum Insights count: {len(insights)}")

    status, entity_matches = get_json('/api/analytics/entity-resolution', tokens['govt_admin'])
    assert status == 200, f'Failed /entity-resolution: {entity_matches}'
    print(f"  [PASS] Entity Resolution Cross-System Matches: {len(entity_matches)}")

    # 5. Test Employer Portal APIs
    print('\n[5] Testing Employer Portal APIs (Tata Motors):')
    status, jobs = get_json('/api/employer/jobs', tokens['employer'])
    assert status == 200, f'Failed /employer/jobs: {jobs}'
    print(f"  [PASS] Open Jobs: {len(jobs)}")
    for j in jobs:
        print(f"    - Job: {j['job_title']} ({j.get('industry', 'Automotive')}) | Vacancies: {j.get('vacancies', 10)} | Skills: {j.get('required_skills')}")

    status, candidates = get_json('/api/employer/candidates', tokens['employer'])
    assert status == 200, f'Failed /employer/candidates: {candidates}'
    print(f"  [PASS] Matched Candidates count: {len(candidates)}")
    rahul = next((c for c in candidates if c['skill_id'] == 'ST-MH-7X42K9'), None)
    assert rahul is not None, 'Canonical candidate ST-MH-7X42K9 missing in employer candidate list'
    print(f"  [PASS] Canonical Candidate in Tata Motors pool:")
    print(f"    - Name: {rahul.get('candidate_name')} | Skill ID: {rahul['skill_id']}")
    print(f"    - Match Score: {rahul.get('match_percentage')}%")
    print(f"    - Missing Skills flagged: {rahul.get('missing_skills')}")

    # 6. Test Outcome Verification: Upgrade Rahul to VERIFIED
    print('\n[6] Testing Employer Verification Action (Upgrades confidence to VERIFIED):')
    status, outcome_res = post_json(
        f"/api/employer/candidates/{rahul['id']}/outcome",
        {'status': 'Joined', 'feedback_notes': 'Cleared technical evaluation. Offer accepted at Rs. 24,000/mo.', 'offered_salary': 24000.0},
        tokens['employer']
    )
    assert status == 200, f'Failed outcome update: {outcome_res}'
    print(f"  [PASS] Outcome Updated: status={outcome_res['status']}, confidence_upgraded={outcome_res.get('confidence_upgraded')}")

    # Re-fetch Rahul by Skill ID to confirm persistence of VERIFIED status in DB
    status, updated_trainee = get_json('/api/trainees/by-skill-id/ST-MH-7X42K9', tokens['govt_admin'])
    assert status == 200
    assert updated_trainee['confidence_level'] == 'VERIFIED'
    print(f"  [PASS] Confirmed in Database: Trainee ST-MH-7X42K9 is now {updated_trainee['confidence_level']}!")

    print('\n=====================================================')
    print('  [PASS] ALL 6 TEST SUITES PASSED WITH 100% SUCCESS!')
    print('=====================================================')

if __name__ == '__main__':
    run_tests()
