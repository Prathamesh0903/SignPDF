// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import getAuth, GoogleAuthProvider and signInWithPopup

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAvmlhgXfzsvGepjAnTg1IrOXbm6p7VDeE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "signpdf-f4ff2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "signpdf-f4ff2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "signpdf-f4ff2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "154704879141",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:154704879141:web:92c36ec6063ca77c17a9cc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZJK2193BG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export the auth instance

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);