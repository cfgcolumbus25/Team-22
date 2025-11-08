/**
 * Script to create preset Admin and Institution accounts for demo
 * 
 * HOW TO USE:
 * 1. Make sure you have Firebase config in .env file
 * 2. Run: npm run create-accounts (or: node create-preset-accounts.js)
 * 
 * This will create:
 * - admin@demo.com / admin123456 (Admin role)
 * - institution@demo.com / institution123456 (Institution role)
 */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current directory (ES module way)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(__dirname, ".env");
try {
  const envFile = readFileSync(envPath, "utf-8");
  const envConfig = {};
  envFile.split("\n").forEach(line => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envConfig[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });
  // Set environment variables
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
} catch (error) {
  console.error("❌ Error reading .env file:", error.message);
  console.log("💡 Make sure you have a .env file in the project root with your Firebase config.");
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Missing Firebase configuration in .env file!");
  console.log("💡 Make sure your .env file has all required Firebase config values.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createPresetAccount(email, password, role) {
  try {
    console.log(`\n📝 Creating ${role} account: ${email}`);
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(`✅ Firebase Auth user created: ${user.uid}`);

    // Create Firestore user document
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      email,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Firestore document created with role: ${role}`);

    return { success: true, uid: user.uid };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log(`⚠️  Account ${email} already exists. Skipping...`);
      return { success: false, reason: "already-exists" };
    }
    console.error(`❌ Error creating ${role} account:`, error.message);
    return { success: false, reason: error.message };
  }
}

async function main() {
  console.log("🚀 Creating preset demo accounts...\n");

  const accounts = [
    { email: "admin@demo.com", password: "admin123456", role: "admin" },
    { email: "institution@demo.com", password: "institution123456", role: "institution" }
  ];

  const results = [];
  for (const account of accounts) {
    const result = await createPresetAccount(account.email, account.password, account.role);
    results.push({ ...account, ...result });
  }

  console.log("\n📊 Summary:");
  console.log("=".repeat(50));
  results.forEach(acc => {
    if (acc.success) {
      console.log(`✅ ${acc.role.toUpperCase()}: ${acc.email} / ${acc.password}`);
    } else if (acc.reason === "already-exists") {
      console.log(`⚠️  ${acc.role.toUpperCase()}: ${acc.email} (already exists)`);
    } else {
      console.log(`❌ ${acc.role.toUpperCase()}: ${acc.email} (failed: ${acc.reason})`);
    }
  });
  console.log("=".repeat(50));
  console.log("\n✨ Done! You can now login with these accounts.");
}

main().catch(console.error);

