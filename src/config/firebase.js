import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "easyhomes-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "easyhomes-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "easyhomes-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Development mode setup
if (process.env.NODE_ENV === 'development') {
  // Check if we're running in development and should use emulators
  const useEmulators = process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true';
  
  if (useEmulators) {
    try {
      // Connect to Firebase emulators if they're not already connected
      if (!auth._delegate._config.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      
      if (!db._delegate._databaseId.projectId.includes('localhost')) {
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
      
      if (!storage._delegate._host.includes('localhost')) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      
      console.log('🔧 Connected to Firebase emulators');
    } catch (error) {
      console.warn('⚠️ Firebase emulators connection failed:', error.message);
    }
  }
}

// Export the Firebase app instance
export default app;

// Helper function to check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== "demo-api-key"
  );
};

// Helper function to get Firebase configuration status
export const getFirebaseStatus = () => {
  const isConfigured = isFirebaseConfigured();
  const isDemoMode = firebaseConfig.apiKey === "demo-api-key";
  
  return {
    isConfigured,
    isDemoMode,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    usingEmulators: process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true'
  };
}; 