@echo off
echo ========================================
echo    EasyHomes Dashboard Startup Script
echo ========================================
echo.
echo Navigating to project directory...
cd /d "C:\Users\kbtum\Vnote\easyhomes-dashboard"
echo Current directory: %CD%
echo.
echo Checking for package.json...
if exist package.json (
    echo ✅ Found package.json - Starting development server...
    echo.
    npx react-scripts start
) else (
    echo ❌ package.json not found! 
    echo Make sure you're in the correct directory.
    echo Expected: C:\Users\kbtum\Vnote\easyhomes-dashboard
    echo Current:  %CD%
)
echo.
pause 