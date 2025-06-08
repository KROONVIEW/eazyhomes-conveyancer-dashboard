# Create Desktop Shortcut for EasyHomes Dashboard
Write-Host "Creating desktop shortcut for EasyHomes Dashboard..." -ForegroundColor Green

# Get desktop path
$DesktopPath = [Environment]::GetFolderPath("Desktop")

# Create WScript Shell object
$WshShell = New-Object -comObject WScript.Shell

# Create shortcut
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\EasyHomes Dashboard.lnk")

# Set shortcut properties
$Shortcut.TargetPath = "C:\Users\kbtum\Vnote\easyhomes-dashboard\START_SERVER.bat"
$Shortcut.WorkingDirectory = "C:\Users\kbtum\Vnote\easyhomes-dashboard"
$Shortcut.Description = "Start EasyHomes Dashboard Development Server"
$Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,13"  # Globe icon

# Save the shortcut
$Shortcut.Save()

Write-Host "✅ Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "📍 Location: $DesktopPath\EasyHomes Dashboard.lnk" -ForegroundColor Yellow
Write-Host "🚀 Double-click the shortcut to start your server!" -ForegroundColor Cyan

# Also create a shortcut in the project folder for convenience
$ProjectShortcut = $WshShell.CreateShortcut("C:\Users\kbtum\Vnote\easyhomes-dashboard\Start Dashboard.lnk")
$ProjectShortcut.TargetPath = "C:\Users\kbtum\Vnote\easyhomes-dashboard\START_SERVER.bat"
$ProjectShortcut.WorkingDirectory = "C:\Users\kbtum\Vnote\easyhomes-dashboard"
$ProjectShortcut.Description = "Start EasyHomes Dashboard Development Server"
$ProjectShortcut.IconLocation = "C:\Windows\System32\shell32.dll,13"
$ProjectShortcut.Save()

Write-Host "✅ Project folder shortcut also created!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 