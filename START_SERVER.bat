@echo off
title EasyHomes Dashboard Server
echo ========================================
echo    Starting EasyHomes Dashboard
echo ========================================
echo.
cd /d "C:\Users\kbtum\Vnote\easyhomes-dashboard"
echo Current directory: %CD%
echo.
echo Starting development server...
echo Your app will be available at: http://localhost:3000
echo.
npm start
pause 