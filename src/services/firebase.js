// Firebase Configuration for EasyHomes Legal Platform
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const useFirebase = process.env.REACT_APP_FIREBASE_API_KEY && process.env.REACT_APP_FIREBASE_API_KEY !== "demo-key";

// Firebase config - Replace with your actual config
const firebaseConfig = {
  // This will be replaced with actual Firebase config in production
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "easyhomes-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "easyhomes-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "easyhomes-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "demo-app-id"
};

let app, db, auth, storage;

try {
  if (useFirebase) {
    // Initialize Firebase only if real config is provided
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
  } else {
    console.log('🔧 Running in development mode with mock data');
    // Create mock objects for development
    db = null;
    auth = null;
    storage = null;
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization failed, using mock data:', error.message);
  db = null;
  auth = null;
  storage = null;
}

export { db, auth, storage };
export default app; 