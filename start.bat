@echo off
echo ========================================================
echo   Starting Kerala PYQ Hub (Full Stack Application)
echo ========================================================
echo.
cd /d "%~dp0backend"
echo Launching Flask API & Web Application on http://localhost:5000 ...
python app.py
pause
