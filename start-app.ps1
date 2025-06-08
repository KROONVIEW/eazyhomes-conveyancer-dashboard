# EasyHomes Dashboard Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   EasyHomes Dashboard Startup Script" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\kbtum\Vnote\easyhomes-dashboard"

Write-Host "Navigating to project directory..." -ForegroundColor Yellow
Set-Location $projectPath

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

if (Test-Path "package.json") {
    Write-Host "✅ Found package.json - Starting development server..." -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Your app will be available at: http://localhost:3000" -ForegroundColor Magenta
    Write-Host ""
    npx react-scripts start
} else {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the correct directory." -ForegroundColor Red
    Write-Host "Expected: $projectPath" -ForegroundColor Yellow
    Write-Host "Current:  $(Get-Location)" -ForegroundColor Yellow
}

Read-Host "Press Enter to continue" 