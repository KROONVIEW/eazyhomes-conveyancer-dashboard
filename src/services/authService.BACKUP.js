import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Mock user accounts for testing
const MOCK_ACCOUNTS = {
  'ceo@easyhomes.co.za': {
    email: 'ceo@easyhomes.co.za',
    password: 'admin123',
    profile: {
      id: 'mock-ceo-id',
      email: 'ceo@easyhomes.co.za',
      role: 'admin',
      firstName: 'CEO',
      lastName: 'Administrator',
      firmName: 'EasyHomes Legal Solutions',
      phone: '+27 11 123 4567',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  },
  'cea@easyhomes.co.za': {
    email: 'cea@easyhomes.co.za',
    password: 'admin123',
    profile: {
      id: 'mock-cea-id',
      email: 'cea@easyhomes.co.za',
      role: 'admin',
      firstName: 'CEA',
      lastName: 'Administrator',
      firmName: 'EasyHomes Legal Solutions',
      phone: '+27 11 123 4568',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  },
  'admin@easyhomes.co.za': {
    email: 'admin@easyhomes.co.za',
    password: 'admin123',
    profile: {
      id: 'mock-admin-id',
      email: 'admin@easyhomes.co.za',
      role: 'admin',
      firstName: 'Bruce',
      lastName: 'Wayne',
      firmName: 'EasyHomes Legal Solutions',
      phone: '+27 11 123 4569',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  },
  'manager@easyhomes.co.za': {
    email: 'manager@easyhomes.co.za',
    password: 'admin123',
    profile: {
      id: 'mock-manager-id',
      email: 'manager@easyhomes.co.za',
      role: 'manager',
      firstName: 'Clark',
      lastName: 'Kent',
      firmName: 'EasyHomes Legal Solutions',
      phone: '+27 11 123 4570',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  },
  'senior.conveyancer@easyhomes.co.za': {
    email: 'senior.conveyancer@easyhomes.co.za',
    password: 'admin123',
    profile: {
      id: 'mock-senior-id',
      email: 'senior.conveyancer@easyhomes.co.za',
      role: 'senior_conveyancer',
      firstName: 'Sarah',
      lastName: 'Johnson',
      firmName: 'Johnson & Associates',
      phone: '+27 11 123 4571',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  },
  'conveyancer@easyhomes.co.za': {
    email: 'conveyancer@easyhomes.co.za',
    password: 'admin123',
    profile: {
      id: 'mock-conveyancer-id',
      email: 'conveyancer@easyhomes.co.za',
      role: 'conveyancer',
      firstName: 'John',
      lastName: 'Smith',
      firmName: 'Smith Legal Practice',
      phone: '+27 11 123 4572',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  },
  'assistant@easyhomes.co.za': {
    email: 'assistant@easyhomes.co.za',
    password: 'admin123',
    profile: {
      id: 'mock-assistant-id',
      email: 'assistant@easyhomes.co.za',
      role: 'assistant',
      firstName: 'Lisa',
      lastName: 'Davis',
      firmName: 'EasyHomes Legal Solutions',
      phone: '+27 11 123 4573',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  }
};

class AuthService {
  constructor() {
    this.currentUser = null;
    this.userProfile = null;
    this.authStateListeners = [];
    this.useMockAuth = !auth; // Use mock auth if Firebase auth is not available
  }

  // Initialize auth state listener
  init() {
    return new Promise((resolve) => {
      if (this.useMockAuth) {
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
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          await this.loadUserProfile(user.uid);
        } else {
          this.currentUser = null;
          this.userProfile = null;
        }
        
        // Notify all listeners
        this.authStateListeners.forEach(listener => listener(user, this.userProfile));
        resolve(user);
      });

      // Store unsubscribe function for cleanup
      this.unsubscribeAuth = unsubscribe;
    });
  }

  // Load user profile from Firestore
  async loadUserProfile(uid) {
    if (this.useMockAuth) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        this.userProfile = { id: uid, ...userDoc.data() };
      } else {
        // Create default profile for new users
        this.userProfile = {
          id: uid,
          email: this.currentUser.email,
          role: 'conveyancer',
          firmName: '',
          firstName: '',
          lastName: '',
          phone: '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', uid), this.userProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.userProfile = null;
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    if (this.useMockAuth) {
      return this.mockSignIn(email, password);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      if (userCredential.user) {
        await this.updateLastLogin(userCredential.user.uid);
        
        // Log successful login (import auditService dynamically to avoid circular dependency)
        try {
          const { default: auditService } = await import('./auditService');
          auditService.logLogin(true, { email, loginMethod: 'email_password' });
        } catch (auditError) {
          console.warn('Failed to log login event:', auditError);
        }
      }
      
      return {
        success: true,
        user: userCredential.user,
        profile: this.userProfile
      };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Log failed login attempt
      try {
        const { default: auditService } = await import('./auditService');
        auditService.logLogin(false, { 
          email, 
          error: error.code,
          loginMethod: 'email_password' 
        });
      } catch (auditError) {
        console.warn('Failed to log failed login event:', auditError);
      }
      
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Mock sign in for testing
  async mockSignIn(email, password) {
    console.log('🔧 Mock sign in attempt:', email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockAccount = MOCK_ACCOUNTS[email.toLowerCase()];
    
    if (!mockAccount) {
      return {
        success: false,
        error: 'No account found with this email address.'
      };
    }
    
    if (mockAccount.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.'
      };
    }
    
    // Set current user and profile
    this.currentUser = { 
      uid: mockAccount.profile.id, 
      email: mockAccount.profile.email 
    };
    this.userProfile = mockAccount.profile;
    
    // Save to localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(mockAccount));
    
    // Notify listeners
    this.authStateListeners.forEach(listener => listener(this.currentUser, this.userProfile));
    
    console.log('✅ Mock login successful:', this.userProfile);
    
    return {
      success: true,
      user: this.currentUser,
      profile: this.userProfile
    };
  }

  // Sign up new user
  async signUp(email, password, userData) {
    if (this.useMockAuth) {
      return this.mockSignUp(email, password, userData);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Create user profile in Firestore
      const userProfile = {
        id: user.uid,
        email: user.email,
        role: userData.role || 'conveyancer',
        firmName: userData.firmName || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      this.userProfile = userProfile;

      return {
        success: true,
        user: user,
        profile: userProfile
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Mock sign up for testing
  async mockSignUp(email, password, userData) {
    console.log('🔧 Mock sign up attempt:', email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (MOCK_ACCOUNTS[email.toLowerCase()]) {
      return {
        success: false,
        error: 'An account with this email already exists.'
      };
    }
    
    // Create new mock account
    const newProfile = {
      id: `mock-${Date.now()}`,
      email: email,
      role: userData.role || 'conveyancer',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      firmName: userData.firmName || '',
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    const newAccount = {
      email: email,
      password: password,
      profile: newProfile
    };
    
    // Add to mock accounts
    MOCK_ACCOUNTS[email.toLowerCase()] = newAccount;
    
    // Set current user
    this.currentUser = { uid: newProfile.id, email: newProfile.email };
    this.userProfile = newProfile;
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(newAccount));
    
    console.log('✅ Mock sign up successful:', this.userProfile);
    
    return {
      success: true,
      user: this.currentUser,
      profile: this.userProfile
    };
  }

  // Sign out
  async signOut() {
    if (this.useMockAuth) {
      localStorage.removeItem('mockUser');
      this.currentUser = null;
      this.userProfile = null;
      this.authStateListeners.forEach(listener => listener(null, null));
      console.log('🔧 Mock sign out successful');
      return { success: true };
    }

    try {
      // Log logout before signing out
      try {
        const { default: auditService } = await import('./auditService');
        auditService.logLogout({ 
          email: this.currentUser?.email,
          sessionDuration: this.getSessionDuration()
        });
      } catch (auditError) {
        console.warn('Failed to log logout event:', auditError);
      }
      
      await signOut(auth);
      this.currentUser = null;
      this.userProfile = null;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Send password reset email
  async resetPassword(email) {
    if (this.useMockAuth) {
      console.log('🔧 Mock password reset for:', email);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Update last login time
  async updateLastLogin(uid) {
    if (this.useMockAuth) return;

    try {
      const loginTime = new Date().toISOString();
      await updateDoc(doc(db, 'users', uid), {
        lastLogin: loginTime
      });
      
      // Store session start time for duration calculation
      sessionStorage.setItem('session_start_time', loginTime);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Get session duration in minutes
  getSessionDuration() {
    const startTime = sessionStorage.getItem('session_start_time');
    if (!startTime) return 0;
    
    const start = new Date(startTime);
    const now = new Date();
    return Math.round((now - start) / (1000 * 60)); // Duration in minutes
  }

  // Update user profile
  async updateProfile(updatedProfile) {
    if (this.useMockAuth) {
      return this.mockUpdateProfile(updatedProfile);
    }

    try {
      if (!this.currentUser) {
        throw new Error('No authenticated user');
      }

      // Update Firestore document
      await updateDoc(doc(db, 'users', this.currentUser.uid), updatedProfile);
      
      // Update local profile
      this.userProfile = { ...this.userProfile, ...updatedProfile };
      
      // Notify listeners
      this.authStateListeners.forEach(listener => listener(this.currentUser, this.userProfile));
      
      console.log('✅ Profile updated successfully');
      return { success: true, profile: this.userProfile };
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Mock profile update
  async mockUpdateProfile(updatedProfile) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local profile
      this.userProfile = { ...this.userProfile, ...updatedProfile };
      
      // Update mock account in memory
      const userEmail = this.userProfile.email.toLowerCase();
      if (MOCK_ACCOUNTS[userEmail]) {
        MOCK_ACCOUNTS[userEmail].profile = this.userProfile;
      }
      
      // Update localStorage
      const savedUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
      if (savedUser.profile) {
        savedUser.profile = this.userProfile;
        localStorage.setItem('mockUser', JSON.stringify(savedUser));
      }
      
      // Notify listeners
      this.authStateListeners.forEach(listener => listener(this.currentUser, this.userProfile));
      
      console.log('✅ Mock profile updated successfully:', this.userProfile);
      return { success: true, profile: this.userProfile };
    } catch (error) {
      console.error('Mock profile update error:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user profile
  getUserProfile() {
    return this.userProfile;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Check user role
  hasRole(role) {
    return this.userProfile?.role === role;
  }

  // Check if user has permission
  hasPermission(permission) {
    const rolePermissions = {
      admin: ['all'],
      manager: ['view_all_matters', 'edit_all_matters', 'view_reports', 'manage_users'],
      senior_conveyancer: ['view_all_matters', 'edit_own_matters', 'view_reports'],
      conveyancer: ['view_own_matters', 'edit_own_matters'],
      assistant: ['view_own_matters']
    };

    const userRole = this.userProfile?.role || 'assistant';
    const permissions = rolePermissions[userRole] || [];
    
    return permissions.includes('all') || permissions.includes(permission);
  }

  // Add auth state listener
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(listener => listener !== callback);
    };
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/requires-recent-login': 'Please sign in again to complete this action.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }

  // Cleanup
  cleanup() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
    this.authStateListeners = [];
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService; 