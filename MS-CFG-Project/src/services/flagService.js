import { db } from "../lib/firebase";
import { auth } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp,
  orderBy 
} from "firebase/firestore";

/**
 * Flag an exam with a message
 * Only learners can create flags (per security rules)
 * 
 * @param {string} examId - The exam ID (e.g., "bio", "chemistry")
 * @param {string} collegeId - The college ID
 * @param {string} message - The flag message
 * @returns {Promise<string>} The ID of the created flag document
 */
export async function flagExam(examId, collegeId, message) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be logged in to flag an exam");
    }

    console.log(`🚩 Flagging exam: ${examId} at college: ${collegeId}`);

    // Create flag document in flags collection
    const flagsRef = collection(db, "flags");
    const flagDoc = await addDoc(flagsRef, {
      examId,           // Exam name/id (e.g., "bio")
      collegeId,        // College ID
      flagMsg: message, // The flag message
      flaggedBy: user.uid, // Learner's UID
      flaggedByEmail: user.email, // Learner's email (for admin reference)
      createdAt: serverTimestamp(),
      status: "pending" // pending, resolved, etc.
    });

    console.log(`✅ Flag created with ID: ${flagDoc.id}`);
    return flagDoc.id;
  } catch (error) {
    console.error("❌ Error flagging exam:", error);
    throw error;
  }
}

/**
 * Get all flags (Admin only - per security rules)
 * @returns {Promise<Array>} Array of flag documents
 */
export async function getAllFlags() {
  try {
    const flagsRef = collection(db, "flags");
    const q = query(flagsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const flags = [];
    querySnapshot.forEach((doc) => {
      flags.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Retrieved ${flags.length} flags`);
    return flags;
  } catch (error) {
    console.error("❌ Error getting flags:", error);
    if (error.code === "permission-denied") {
      throw new Error("Only admins can view flags");
    }
    throw error;
  }
}

/**
 * Get flags for a specific college
 * @param {string} collegeId - The college ID
 * @returns {Promise<Array>} Array of flag documents for that college
 */
export async function getFlagsByCollege(collegeId) {
  try {
    const flagsRef = collection(db, "flags");
    const q = query(flagsRef, where("collegeId", "==", collegeId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const flags = [];
    querySnapshot.forEach((doc) => {
      flags.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return flags;
  } catch (error) {
    console.error("❌ Error getting flags by college:", error);
    throw error;
  }
}

/**
 * Delete a flag (Admin only - per security rules)
 * @param {string} flagId - The flag document ID
 * @returns {Promise<void>}
 */
export async function deleteFlag(flagId) {
  try {
    console.log(`🗑️ Deleting flag: ${flagId}`);
    const flagRef = doc(db, "flags", flagId);
    await deleteDoc(flagRef);
    console.log(`✅ Flag deleted: ${flagId}`);
  } catch (error) {
    console.error("❌ Error deleting flag:", error);
    if (error.code === "permission-denied") {
      throw new Error("Only admins can delete flags");
    }
    throw error;
  }
}

