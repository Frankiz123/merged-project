import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  // browserSessionPersistence,
  getAuth,
  // setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_API_KEY : process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_AUTH_DOMAIN : process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_PROJECT_ID : process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_STORAGE_BUCKET : process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_WEB_ENV === 'prod'
      ? process.env.NEXT_PUBLIC_PROD_MESSAGING_SENDER_ID
      : process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_APP_ID : process.env.NEXT_PUBLIC_APP_ID,
  measurementId:
    process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_MEASUREMENT_ID : process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
// Set session persistence to "session" or "none"
// "session" will keep the user signed in on page reload but clear the session on browser close
// "none" will sign out the user on page reload and browser close
const auth = getAuth(app);
// void setPersistence(auth, browserSessionPersistence);

// Firebase Firestore
const db = getFirestore(app);

// Firebase Storage
const storage = getStorage(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };

export const AUTH_FAILURE_CASES = {
  email_already_in_use: 'email-already-in-use',
  user_not_found: 'user-not-found',
  wrong_password: 'wrong-password',
};
