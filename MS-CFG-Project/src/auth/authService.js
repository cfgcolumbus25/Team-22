import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Valid roles as per Firestore security rules
export const ROLES = {
  LEARNER: "learner",
  INSTITUTION: "institution",
  ADMIN: "admin"
};

// Validate role is one of the allowed roles
function validateRole(role) {
  const validRoles = Object.values(ROLES);
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(", ")}`);
  }
  return true;
}

//register user and assign role
export async function registerUser(email, password, role = ROLES.LEARNER) {
  try {
    // Validate role before proceeding
    validateRole(role);
    console.log(`📝 Registering user with role: ${role}`);

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(`✅ Firebase Auth user created: ${user.uid}`);

    // Create Firestore user document - must match security rules structure
    // Rules allow write if: request.auth.uid == userId
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      email,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Firestore user document created at users/${user.uid} with role: ${role}`);

    return user;
  } catch (error) {
    console.error("❌ Error registering user:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error;
  }
}

//log in existing user 
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

//log out current user
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}


export async function getUserData(uid) {
  try {
    if (!uid) {
      console.log("⚠️ getUserData called with no UID");
      return null;
    }
    
    const docRef = doc(db, "users", uid);
    console.log(`📖 Fetching user data from Firestore: users/${uid}`);
    const userDoc = await getDoc(docRef);
    
    if (userDoc.exists()) {
      const userData = { uid: userDoc.id, ...userDoc.data() };
      console.log(`✅ User data retrieved:`, { uid: userData.uid, email: userData.email, role: userData.role });
      return userData;
    }
    console.log(`⚠️ User document does not exist: users/${uid}`);
    return null;
  } catch (error) {
    console.error("❌ Error getting user data:", error);
    console.error("Error code:", error.code);
    // If permission denied, return null (user might not have access)
    if (error.code === "permission-denied") {
      console.error("🚫 Permission denied - check Firestore security rules");
      return null;
    }
    throw error;
  }
}


export async function getUserRole(uid) {
  try {
    const userData = await getUserData(uid);
    return userData?.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}


export async function getCurrentUserRole() {
  const user = auth.currentUser;
  if (!user) return null;
  return await getUserRole(user.uid);
}


export async function getCurrentUserData() {
  const user = auth.currentUser;
  if (!user) return null;
  return await getUserData(user.uid);
}


export async function hasRole(role) {
  validateRole(role);
  const currentRole = await getCurrentUserRole();
  return currentRole === role;
}


export async function isAdmin() {
  return await hasRole(ROLES.ADMIN);
}


export async function isLearner() {
  return await hasRole(ROLES.LEARNER);
}


export async function isInstitution() {
  return await hasRole(ROLES.INSTITUTION);
}

//setup auth state listener
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, get their role data from Firestore
      const userData = await getUserData(user.uid);
      callback(user, userData);
    } else {
      // User is signed out
      callback(null, null);
    }
  });
}

//update user role, will error depending on security permissions/rules
export async function updateUserRole(uid, newRole) {
  try {
    validateRole(newRole);
    
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}
