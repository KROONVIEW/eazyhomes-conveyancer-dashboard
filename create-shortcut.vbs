Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get desktop path
DesktopPath = WshShell.SpecialFolders("Desktop")

' Create shortcut
Set Shortcut = WshShell.CreateShortcut(DesktopPath & "\EasyHomes Dashboard.lnk")

' Set shortcut properties
Shortcut.TargetPath = "C:\Users\kbtum\Vnote\easyhomes-dashboard\START_SERVER.bat"
Shortcut.WorkingDirectory = "C:\Users\kbtum\Vnote\easyhomes-dashboard"
Shortcut.Description = "Start EasyHomes Dashboard Development Server"
Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,13"

' Save the shortcut
Shortcut.Save

' Show success message
WScript.Echo "✅ Desktop shortcut created successfully!" & vbCrLf & _
             "📍 Location: " & DesktopPath & "\EasyHomes Dashboard.lnk" & vbCrLf & _
             "🚀 Double-click the shortcut to start your server!" 