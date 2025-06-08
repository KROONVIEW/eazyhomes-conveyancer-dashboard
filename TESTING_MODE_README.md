# 🧪 Testing Mode - Always Show Login Screen

## What Changed

The authentication service has been temporarily modified to **always show the login screen** on page refresh during testing.

### Changes Made:
1. **Disabled localStorage persistence** - Auth data is not saved between sessions
2. **Auto-clear stored data** - Any existing auth data is cleared on app initialization
3. **Force login on refresh** - Every page refresh will show the login screen

## Current Behavior
- ✅ Login screen appears every time you refresh the page
- ✅ You can still log in and use the app normally during the session
- ✅ Closing/refreshing the browser will require login again
- ✅ All authentication features work normally within the session

## Test Accounts Available
- **CEO**: `ceo@easyhomes.co.za` / `admin123`
- **Admin**: `admin@easyhomes.co.za` / `admin123`  
- **Manager**: `manager@easyhomes.co.za` / `admin123`
- **Conveyancer**: `conveyancer@easyhomes.co.za` / `admin123`
- **Assistant**: `assistant@easyhomes.co.za` / `admin123`

## How to Restore Original Behavior

When you're ready to restore persistent login (stay logged in after refresh):

### Option 1: Use the Backup File
```bash
# Navigate to your project directory
cd C:\Users\kbtum\Vnote\easyhomes-dashboard

# Restore the original file
copy "src\services\authService.BACKUP.js" "src\services\authService.js"
```

### Option 2: Manual Restoration
Edit `src/services/authService.js` and:

1. **In the `init()` method**, replace:
```javascript
console.log('🔧 Using mock authentication for testing - ALWAYS SHOW LOGIN');
// TESTING MODE: Always clear stored auth data to force login screen
localStorage.removeItem('mockUser');
sessionStorage.removeItem('session_start_time');
console.log('🧹 Cleared stored auth data - login screen will appear');
resolve(null); // Always resolve with null to force login
```

With:
```javascript
console.log('🔧 Using mock authentication for testing');
// Check if user is already logged in (from localStorage)
const savedUser = localStorage.getItem('mockUser');
if (savedUser) {
  const userData = JSON.parse(savedUser);
  this.currentUser = { uid: userData.profile.id, email: userData.profile.email };
  this.userProfile = userData.profile;
  this.authStateListeners.forEach(listener => listener(this.currentUser, this.userProfile));
}
resolve(this.currentUser);
```

2. **In the `mockSignIn()` method**, replace:
```javascript
// TESTING MODE: Do NOT save to localStorage to force login on refresh
console.log('🧪 TESTING MODE: Not saving auth data - login required on refresh');
```

With:
```javascript
// Save to localStorage for persistence
localStorage.setItem('mockUser', JSON.stringify(mockAccount));
```

3. **In the `mockSignUp()` method**, replace:
```javascript
// TESTING MODE: Do NOT save to localStorage to force login on refresh
console.log('🧪 TESTING MODE: Not saving signup data - login required on refresh');
```

With:
```javascript
// Save to localStorage
localStorage.setItem('mockUser', JSON.stringify(newAccount));
```

## Files Modified
- `src/services/authService.js` - Main authentication service (modified)
- `src/services/authService.BACKUP.js` - Original backup (safe copy)

## Notes
- The backup file (`authService.BACKUP.js`) contains the original logic with persistent login
- All other authentication features remain unchanged
- This is purely a testing convenience modification 