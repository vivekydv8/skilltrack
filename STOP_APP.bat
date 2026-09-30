@echo off
echo Stopping SkillTrackAI servers...
taskkill /F /FI "WINDOWTITLE eq SkillTrackAI Backend*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq SkillTrackAI Frontend*" /T 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 "') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do taskkill /F /PID %%a 2>nul
echo Done.
