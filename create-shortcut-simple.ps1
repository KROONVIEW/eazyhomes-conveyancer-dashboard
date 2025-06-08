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
$Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,13"

# Save the shortcut
$Shortcut.Save()

Write-Host "✅ Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "📍 Location: $DesktopPath\EasyHomes Dashboard.lnk" -ForegroundColor Yellow
Write-Host "🚀 Double-click the shortcut to start your server!" -ForegroundColor Cyan 