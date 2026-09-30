@echo off
echo.
echo  ==========================================================
echo   SkillTrackAI — Government of Maharashtra
echo   State-Level Longitudinal Employability Intelligence Platform
echo  ==========================================================
echo.

REM Start Backend
echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "SkillTrackAI Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak > nul

REM Start Frontend
echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "SkillTrackAI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Wait 4 seconds then open browser
timeout /t 4 /nobreak > nul
echo.
echo  Opening SkillTrackAI Unified Portal in browser...
start http://localhost:5173

echo.
echo  ✓ Backend:  http://localhost:8000
echo  ✓ Frontend: http://localhost:5173
echo  ✓ API Docs: http://localhost:8000/docs
echo.
echo  Official Saved Accounts ^& Credentials:
echo  ────────────────────────────────────────────────────────────────────────────
echo  1. Candidate / Trainee:    ID: ST-MH-7X42K9     Password: Trainee@2025
echo  2. Government Admin:       ID: GOV-ADMIN-01     Password: GovAdmin@2025
echo  3. Employer / Industry:    ID: EMP-TATA-01      Password: TataMotors@2025
echo  4. Training Provider (ITI): ID: ITI-PUNE-01     Password: ItiHead@2025
echo  ────────────────────────────────────────────────────────────────────────────
echo.
pause
