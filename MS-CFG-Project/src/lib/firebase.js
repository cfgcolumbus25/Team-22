// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Ensure .env variables exist
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 🔍 Debug: Check if Firebase config is loaded (only in development)
if (import.meta.env.DEV) {
  const configCheck = {
    apiKey: firebaseConfig.apiKey ? "✅ Set" : "❌ Missing",
    authDomain: firebaseConfig.authDomain ? "✅ Set" : "❌ Missing",
    projectId: firebaseConfig.projectId ? "✅ Set" : "❌ Missing",
    storageBucket: firebaseConfig.storageBucket ? "✅ Set" : "❌ Missing",
    messagingSenderId: firebaseConfig.messagingSenderId ? "✅ Set" : "❌ Missing",
    appId: firebaseConfig.appId ? "✅ Set" : "❌ Missing",
  };
  console.log("🔧 Firebase Config Check:", configCheck);
  
  if (Object.values(configCheck).some(v => v.includes("❌"))) {
    console.error("⚠️ WARNING: Some Firebase config values are missing! Check your .env file.");
  } else {
    console.log("✅ Firebase config loaded successfully");
  }
}

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export clearly as named exports
export { auth, db };
