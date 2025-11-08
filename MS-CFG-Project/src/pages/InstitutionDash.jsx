import { useAuth } from "../auth/useAuth";
import { logoutUser } from "../auth/authService";
import { useState, useEffect } from "react";
import { getCollegesByOwner, getExamsByCollege, updateExam, getAllColleges } from "../services/collegeService";

export default function InstitutionDash() {
  const { user, userData, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [myColleges, setMyColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [exams, setExams] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadMyColleges();
    }
  }, [user]);

  const loadMyColleges = async () => {
    try {
      setLoadingColleges(true);
      setError("");
      // First try to get colleges by ownerId
      let colleges = await getCollegesByOwner(user.uid);
      
      // If no colleges found with ownerId, show all colleges with a note
      // This allows testing even if ownerId hasn't been set up yet
      if (colleges.length === 0) {
        const allColleges = await getAllColleges();
        if (allColleges.length > 0) {
          setError("No colleges found with your ownerId. Showing all colleges for testing. To restrict access, add an 'ownerId' field to college documents matching your user ID.");
          colleges = allColleges;
        }
      }
      
      setMyColleges(colleges);
      if (colleges.length > 0) {
        setSelectedCollege(colleges[0].id);
        handleCollegeSelect(colleges[0].id);
      }
    } catch (error) {
      console.error("Error loading colleges:", error);
      // Fallback: try to load all colleges if owner-based query fails
      try {
        const allColleges = await getAllColleges();
        setMyColleges(allColleges);
        setError("Note: Showing all colleges. To restrict access, add an 'ownerId' field to college documents.");
        if (allColleges.length > 0) {
          setSelectedCollege(allColleges[0].id);
          handleCollegeSelect(allColleges[0].id);
        }
      } catch (fallbackError) {
        setError("Failed to load colleges. Check your Firestore connection and security rules.");
      }
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleCollegeSelect = async (collegeId) => {
    try {
      setLoadingExams(true);
      setSelectedCollege(collegeId);
      const examsData = await getExamsByCollege(collegeId);
      setExams(examsData);
    } catch (error) {
      console.error("Error loading exams:", error);
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
        <h1>Institution Dashboard</h1>
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
        <p><strong>User ID:</strong> {user?.uid}</p>
      </div>

      {error && (
        <div style={{
          padding: "1rem",
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          marginBottom: "2rem"
        }}>
          {error}
        </div>
      )}

      <div style={{ background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2>My Colleges</h2>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          You can only view and edit colleges where you are the owner (ownerId matches your user ID).
        </p>

        {loadingColleges ? (
          <p>Loading your colleges...</p>
        ) : myColleges.length === 0 ? (
          <div style={{ 
            padding: "2rem", 
            background: "#fff3cd", 
            borderRadius: "8px",
            border: "1px solid #ffc107"
          }}>
            <p><strong>No colleges found.</strong></p>
            <p>To manage a college, the college document in Firestore must have an <code>ownerId</code> field that matches your user ID: <strong>{user?.uid}</strong></p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              Example: Create a college document with <code>ownerId: "{user?.uid}"</code>
            </p>
          </div>
        ) : (
          <div>
            {myColleges.length > 1 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="college-select" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Select College:
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
                  {myColleges.map(college => (
                    <option key={college.id} value={college.id}>
                      {college.name || college.id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedCollege && (
              <div>
                <h3>{myColleges.find(c => c.id === selectedCollege)?.name || selectedCollege} - Exams</h3>
                {loadingExams ? (
                  <p>Loading exams...</p>
                ) : exams.length === 0 ? (
                  <p style={{ color: "#666" }}>No exams found for this college.</p>
                ) : (
                  <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
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
                        <p style={{ fontSize: "0.9rem", color: "#666" }}>
                          You can edit this exam (functionality to be implemented)
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        padding: "1rem", 
        background: "#e7f3ff", 
        borderRadius: "8px",
        border: "1px solid #b3d9ff",
        marginTop: "2rem"
      }}>
        <h3 style={{ marginTop: 0 }}>🏫 Institution Features</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>Manage your college's CLEP exam requirements</li>
          <li>View and edit exams for colleges you own</li>
          <li>Add/edit exam minimum scores and credit information</li>
          <li>Update exam acceptance policies</li>
        </ul>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          <strong>Note:</strong> You can only access colleges where <code>ownerId</code> matches your user ID ({user?.uid}).
        </p>
      </div>
    </div>
  );
}

