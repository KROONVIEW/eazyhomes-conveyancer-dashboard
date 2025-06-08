@echo off
echo.
echo ========================================
echo   EasyHomes Dashboard - Deployment Prep
echo ========================================
echo.

echo [1/4] Testing production build...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo.
echo [2/4] Build successful! ✅
echo.

echo [3/4] Checking Git status...
git status

echo.
echo [4/4] Ready for deployment! 🚀
echo.
echo Next steps:
echo 1. Push to GitHub: git add . && git commit -m "Ready for deployment" && git push
echo 2. Go to vercel.com and import your GitHub repository
echo 3. Deploy automatically!
echo.
echo Your build files are in the 'build' folder
echo File sizes:
dir build\static\js\*.js /b
echo.

pause 