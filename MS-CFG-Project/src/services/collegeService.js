import { db } from "../lib/firebase";
import { auth } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

/**
 * Get all colleges (public read)
 * @returns {Promise<Array>} Array of college documents
 */
export async function getAllColleges() {
  try {
    console.log("📖 Fetching all colleges from Firestore...");
    const collegesRef = collection(db, "colleges");
    const querySnapshot = await getDocs(collegesRef);

    const colleges = [];
    querySnapshot.forEach((doc) => {
      colleges.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Found ${colleges.length} colleges:`, colleges.map(c => c.id || c.name));
    return colleges;
  } catch (error) {
    console.error("❌ Error getting colleges:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error;
  }
}

/**
 * Get a specific college by ID
 * @param {string} collegeId - The college ID
 * @returns {Promise<Object|null>} College document or null
 */
export async function getCollege(collegeId) {
  try {
    const collegeRef = doc(db, "colleges", collegeId);
    const collegeDoc = await getDoc(collegeRef);

    if (collegeDoc.exists()) {
      return {
        id: collegeDoc.id,
        ...collegeDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting college:", error);
    throw error;
  }
}

/**
 * Get colleges owned by a specific institution user
 * @param {string} ownerId - The institution user's UID
 * @returns {Promise<Array>} Array of college documents owned by this institution
 */
export async function getCollegesByOwner(ownerId) {
  try {
    const collegesRef = collection(db, "colleges");
    const q = query(collegesRef, where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);

    const colleges = [];
    querySnapshot.forEach((doc) => {
      colleges.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return colleges;
  } catch (error) {
    console.error("❌ Error getting colleges by owner:", error);
    throw error;
  }
}

/**
 * Get exams for a specific college
 * @param {string} collegeId - The college ID
 * @returns {Promise<Array>} Array of exam documents
 */
export async function getExamsByCollege(collegeId) {
  try {
    console.log(`📖 Fetching exams for college: ${collegeId}`);
    const examsRef = collection(db, "colleges", collegeId, "exams");
    const querySnapshot = await getDocs(examsRef);

    const exams = [];
    querySnapshot.forEach((doc) => {
      const examData = doc.data();
      exams.push({
        id: doc.id,
        ...examData
      });
      console.log(`  - Found exam: ${doc.id} (${examData.examName || 'no name'})`);
    });

    console.log(`✅ Found ${exams.length} exams for ${collegeId}`);
    return exams;
  } catch (error) {
    console.error(`❌ Error getting exams for college ${collegeId}:`, error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Provide helpful error message
    if (error.code === "permission-denied") {
      throw new Error("Permission denied. Check your Firestore security rules.");
    } else if (error.code === "not-found") {
      throw new Error(`College ${collegeId} not found.`);
    }
    throw error;
  }
}

/**
 * Update an exam (Admin or Institution owner only)
 * @param {string} collegeId - The college ID
 * @param {string} examId - The exam ID
 * @param {Object} examData - The exam data to update
 * @returns {Promise<void>}
 */
export async function updateExam(collegeId, examId, examData) {
  try {
    const examRef = doc(db, "colleges", collegeId, "exams", examId);
    await updateDoc(examRef, {
      ...examData,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Exam updated: ${examId}`);
  } catch (error) {
    console.error("❌ Error updating exam:", error);
    if (error.code === "permission-denied") {
      throw new Error("You don't have permission to update this exam");
    }
    throw error;
  }
}

