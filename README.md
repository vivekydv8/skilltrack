# 🏛️ SkillTrackAI — From Training Data to Employability Intelligence
### *Longitudinal Skilling-Outcomes and Impact-Measurement System*
**Built for Smart India Hackathon (SIH) | Problem Statement: SIH26135**  
**Government of Maharashtra • Department of Skills, Employment, Entrepreneurship & Innovation (MSSDS / DVET)**

---

## 🎯 Core Vision
> **Track Outcomes → Detect Gaps → Predict Risks → Recommend Actions**

SkillTrackAI transitions vocational education from "snapshot placement claims" to a verified, longitudinal employability intelligence architecture. It provides an auditable, multi-source verification layer that tracks trainees at **1, 3, 6, and 12-month checkpoints** while preserving digital privacy under India's **Digital Personal Data Protection (DPDP) Act 2023**.

---

## 🚀 Live Demo & Quick Start

Both backend and frontend servers are configured to run locally out-of-the-box:

### 1. Backend (FastAPI + Relational SQLite / PostgreSQL)
```bash
# Navigate to backend directory
cd backend

# (Optional) If running for the first time, install requirements:
pip install -r requirements.txt

# Run the FastAPI server (default port 8000)
python run.py
# Server runs at: http://127.0.0.1:8000
# Interactive API documentation: http://127.0.0.1:8000/docs
```

### 2. Frontend (React + TypeScript + Tailwind CSS + Recharts)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies if needed
npm install

# Start Vite development server (default port 5173)
npm run dev
# Open in browser: http://localhost:5173
```

---

## 👥 Multi-Role Demo Switcher (Instant Evaluation for Judges)

In the top header, an **interactive role switcher** allows judges to switch personas with one click:

| Role Icon | Persona | Name & Department | Demonstrates |
| :--- | :--- | :--- | :--- |
| 🏛️ | **Government Admin / Director** | Dr. Anand Patil, IAS (*Dept of Skills & Entrepreneurship*) | Executive Cohort Funnels, District Equity, Wage-Retention Curves, Policy Export |
| 📊 | **Policy Analyst** | Pooja Deshmukh (*Skill Research Cell*) | **Automatic PII Masking/Anonymization** for privacy compliance |
| 🏫 | **Training Provider Head** | Suresh Gokhale (*MSSDS Central Hub, Pune*) | Candidate Enrolment, Consent Capture, In-Training Early Warning Watchlist |
| 🏢 | **Employer HR Partner** | Vikram Shinde (*Tata Motors Ltd, Pune*) | Placement Confirmation, Wage Discrepancy Dispute, Confidence Score Upgrade |
| 📋 | **Field Officer / Counsellor** | Sunita Kamble (*District Guidance Center*) | **Assisted Follow-Up Queue** for candidates unresponsive to automated SMS |
| 🎓 | **Trainee Alumni** | Prashant Jadhav (*Certified Graduate*) | Self-Service Career Updates, DPDP Consent Opt-Out & Deletion Request |

---

## 🧱 Key Architectural Modules

### 1. Consent-Based Trainee Profile & Persistent UUID
- **Persistent Trainee ID (UUID):** Generated upon registration (e.g., `trn-mh-2024-0042`) and survives phone number/address changes.
- **Alternate Contact History Table:** Links old, new, and guardian contact details under the same persistent ID without breaking cohort tracking.
- **Explicit Digital Consent Capture:** Auditable DB table storing consent version (`v1.2-2024-MH-SDED`), timestamp, declared purpose text, IP address, and opt-out status.

### 2. Append-Only Longitudinal Employment Timeline
- Outcomes are **never overwritten**. The system appends chronological milestone records:
  ```json
  {
    "checkpoint": "6 Months",
    "status": "Placed",
    "employer_name": "Tata Motors Ltd",
    "job_role": "Industrial Automation Associate",
    "monthly_wage": 21000.0,
    "log_date": "2024-11-15",
    "verified_by": "Assisted Field Officer Call",
    "verification_confidence": 85,
    "source": "Assisted Outreach",
    "job_relevance_score": 5,
    "is_same_employer_as_last": true
  }
  ```

### 3. Automated + Assisted Follow-Up Engine (Low-Burden KPI)
- **Automated Triggers:** Scheduled at 1, 3, 6, and 12-month post-certification intervals.
- **Interactive WhatsApp/SMS Simulator:** Evaluator can click **"Trigger Follow-up"** to preview mobile outreach and submit the 3-question survey (&lt;90s response time).
- **Auto-Escalation Engine:** Candidates unresponsive to automated triggers are auto-routed to the **"Assisted Follow-Up Queue"** for field counsellors to complete telephonic or in-person verification.
- **KPI Tracking:** Calculates the **Low-Burden Index** (Automated digital resolution % vs Assisted officer resolution %).

### 4. Multi-Tiered Employer Validation & Mismatch Detection
Confidence score hierarchy per placement record:
$$\text{Self-Reported (25\%)} < \text{Provider-Reported (50\%)} < \text{Employer-Confirmed (85\%)} < \text{Document-Verified (100\%)}$$
- **Data Mismatch Engine:** Flags records where candidate-reported salary differs from employer-confirmed payroll data by &gt; ₹500 for administrative audit.

### 5. Self-Employment & Downstream Job Multiplier Effect
- Dedicated intake capturing **Udyam / GST Registration**, monthly revenue bands, and the **Job Multiplier Metric** (number of additional local youth employed by the trainee entrepreneur).

### 6. In-Training ML Non-Placement Risk Prediction
- **Logistic Regression & Explainable AI Model:** Trained on attendance %, mock assessment score, demographic mobility factors, and course complexity.
- Proactively identifies at-risk candidates **DURING training** (not after failure), recommending actionable interventions (e.g., peer mentoring, lab remediation).
- Includes an **Interactive ML Simulator Sandbox** in the UI to test parameter sensitivities live!

### 7. DPDP Act 2023 & Immutable Audit Log
- **Permanent Audit Trail:** Centralized database ledger recording every view of candidate PII, data exports, consent changes, and employer validations.

---

## 🔌 Production Integration Stubs

The codebase includes explicitly documented integration points where production state APIs plug in:
- `backend/app/services/notification_service.py`:
  - **CDAC / NIC SMS Gateway:** DLT-approved templates for automated survey links.
  - **Meta Cloud WhatsApp API:** Conversational 3-question follow-up bot.
  - **EPFO / Shram Suvidha API:** Automated wage employment verification via UAN PF deposits.
- `backend/app/routers/integrations.py`:
  - **MSME Udyam Aadhaar Portal:** Verification of micro-enterprise registration.
  - **DigiLocker NAD:** Issuance of W3C Verifiable Credentials.

---

## 🛠️ Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Python 3.14, FastAPI, SQLAlchemy 2.0, Pure NumPy ML Engine, Pydantic v2
- **Database:** SQLite (default local zero-config) / PostgreSQL (via switchable `DATABASE_URL` in `.env`)
- **Aesthetic:** Indian e-Governance / NIC / Govt of Maharashtra design system (clean, authoritative blue/white palette, data-dense layout).
