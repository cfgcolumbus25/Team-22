import { useAuth } from "../auth/useAuth";
import { logoutUser } from "../auth/authService";
import { useState, useEffect } from "react";
import { getAllColleges, getExamsByCollege } from "../services/collegeService";
import FlagExamButton from "../components/FlagExamButton";

export default function LearnerDash() {
  const { user, userData, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [exams, setExams] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoadingColleges(true);
      console.log("🔄 Loading colleges...");
      const collegesData = await getAllColleges();
      console.log("✅ Colleges loaded:", collegesData);
      setColleges(collegesData);
      if (collegesData.length === 0) {
        console.warn("⚠️ No colleges found in Firestore. Make sure you have colleges collection set up.");
      }
    } catch (error) {
      console.error("❌ Error loading colleges:", error);
      alert(`Error loading colleges: ${error.message}. Check console for details.`);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleCollegeSelect = async (collegeId) => {
    if (!collegeId) {
      setSelectedCollege(null);
      setExams([]);
      return;
    }
    
    try {
      setLoadingExams(true);
      setSelectedCollege(collegeId);
      console.log(`🔄 Loading exams for college: ${collegeId}`);
      const examsData = await getExamsByCollege(collegeId);
      console.log("✅ Exams loaded:", examsData);
      setExams(examsData);
      if (examsData.length === 0) {
        console.warn(`⚠️ No exams found for college ${collegeId}. Check if the exams subcollection exists.`);
      }
    } catch (error) {
      console.error("❌ Error loading exams:", error);
      alert(`Error loading exams: ${error.message}. Check console for details.`);
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Learner Dashboard</h1>
        <button 
          onClick={handleLogout} 
          disabled={loggingOut}
          style={{
            padding: "0.5rem 1rem",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h2>Welcome, {userData?.email || user?.email}!</h2>
        <p><strong>Role:</strong> {userData?.role || "Unknown"}</p>
      </div>

      <div style={{ background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
        <h2>View Colleges and Exams</h2>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          Select a college to view its CLEP exam requirements. You can flag exams if you notice any errors.
        </p>

        {loadingColleges ? (
          <p>Loading colleges...</p>
        ) : (
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="college-select" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Select a College:
            </label>
            <select
              id="college-select"
              value={selectedCollege || ""}
              onChange={(e) => handleCollegeSelect(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            >
              <option value="">-- Select a college --</option>
              {colleges.map(college => (
                <option key={college.id} value={college.id}>
                  {college.name || college.id} {college.state ? `(${college.state})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCollege && (
          <div>
            {loadingExams ? (
              <p>Loading exams...</p>
            ) : exams.length === 0 ? (
              <div style={{ padding: "1rem", background: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107" }}>
                <p style={{ color: "#666", margin: 0 }}>
                  <strong>No exams found for this college.</strong>
                </p>
                <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  Make sure the college document has an <code>exams</code> subcollection in Firestore.
                </p>
              </div>
            ) : (
              <div>
                <h3>
                  Exams for {colleges.find(c => c.id === selectedCollege)?.name || selectedCollege}:
                </h3>
                <div style={{ display: "grid", gap: "1.5rem", marginTop: "1rem" }}>
                  {exams.map(exam => (
                    <div
                      key={exam.id}
                      style={{
                        padding: "1rem",
                        background: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        borderRadius: "8px"
                      }}
                    >
                      <h4 style={{ marginTop: 0 }}>{exam.examName || exam.id}</h4>
                      {exam.minScore !== undefined && (
                        <p><strong>Minimum Score:</strong> {exam.minScore}</p>
                      )}
                      {exam.credits !== undefined && (
                        <p><strong>Credits:</strong> {exam.credits}</p>
                      )}
                      {exam.transcriptChargeCents !== undefined && (
                        <p><strong>Transcript Charge:</strong> ${(exam.transcriptChargeCents / 100).toFixed(2)}</p>
                      )}
                      {exam.flagged !== undefined && exam.flagged > 0 && (
                        <p style={{ color: "#dc3545", fontWeight: "500" }}>
                          ⚠️ This exam has been flagged {exam.flagged} time(s)
                        </p>
                      )}
                      <FlagExamButton 
                        examId={exam.id} 
                        collegeId={selectedCollege}
                        examName={exam.examName || exam.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        padding: "1rem", 
        background: "#e7f3ff", 
        borderRadius: "8px",
        border: "1px solid #b3d9ff"
      }}>
        <h3 style={{ marginTop: 0 }}>📝 Learner Features</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>View available CLEP exams from different colleges</li>
          <li>Search colleges and their exam requirements</li>
          <li>🚩 Flag exams if you notice errors or incorrect information</li>
          <li>Track your exam progress</li>
        </ul>
      </div>
    </div>
  );
}

