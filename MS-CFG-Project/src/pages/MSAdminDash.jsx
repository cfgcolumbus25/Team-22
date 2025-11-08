import { useAuth } from "../auth/useAuth";
import { logoutUser } from "../auth/authService";
import { useState, useEffect } from "react";
import { getAllFlags, deleteFlag } from "../services/flagService";
import { getAllColleges, getExamsByCollege } from "../services/collegeService";

export default function MSAdminDash() {
  const { user, userData, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [flags, setFlags] = useState([]);
  const [loadingFlags, setLoadingFlags] = useState(true);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [exams, setExams] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [activeTab, setActiveTab] = useState("flags"); // "flags" or "colleges"

  useEffect(() => {
    loadFlags();
    loadColleges();
  }, []);

  const loadFlags = async () => {
    try {
      setLoadingFlags(true);
      const flagsData = await getAllFlags();
      setFlags(flagsData);
    } catch (error) {
      console.error("Error loading flags:", error);
    } finally {
      setLoadingFlags(false);
    }
  };

  const loadColleges = async () => {
    try {
      setLoadingColleges(true);
      const collegesData = await getAllColleges();
      setColleges(collegesData);
    } catch (error) {
      console.error("Error loading colleges:", error);
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

  const handleDeleteFlag = async (flagId) => {
    if (!window.confirm("Are you sure you want to delete this flag?")) {
      return;
    }

    try {
      await deleteFlag(flagId);
      setFlags(flags.filter(flag => flag.id !== flagId));
    } catch (error) {
      alert("Error deleting flag: " + error.message);
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
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Admin Dashboard</h1>
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
        <p style={{ color: "#28a745", fontWeight: "500" }}>
          ✅ You have unrestricted access to all features.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid #dee2e6" }}>
        <button
          onClick={() => setActiveTab("flags")}
          style={{
            padding: "0.75rem 1.5rem",
            background: activeTab === "flags" ? "#007bff" : "transparent",
            color: activeTab === "flags" ? "white" : "#007bff",
            border: "none",
            borderBottom: activeTab === "flags" ? "2px solid #007bff" : "2px solid transparent",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          🚩 Flagged Exams ({flags.length})
        </button>
        <button
          onClick={() => setActiveTab("colleges")}
          style={{
            padding: "0.75rem 1.5rem",
            background: activeTab === "colleges" ? "#007bff" : "transparent",
            color: activeTab === "colleges" ? "white" : "#007bff",
            border: "none",
            borderBottom: activeTab === "colleges" ? "2px solid #007bff" : "2px solid transparent",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          🏫 All Colleges
        </button>
      </div>

      {/* Flags Tab */}
      {activeTab === "flags" && (
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h2>Flagged Exams</h2>
          {loadingFlags ? (
            <p>Loading flags...</p>
          ) : flags.length === 0 ? (
            <p style={{ color: "#666" }}>No flags found.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              {flags.map(flag => (
                <div
                  key={flag.id}
                  style={{
                    padding: "1rem",
                    background: "#fff3cd",
                    border: "1px solid #ffc107",
                    borderRadius: "8px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginTop: 0 }}>
                        Exam: <strong>{flag.examId}</strong> | College: {flag.collegeId}
                      </h4>
                      <p style={{ margin: "0.5rem 0", fontSize: "1rem" }}>
                        <strong>Message:</strong> {flag.flagMsg}
                      </p>
                      <p style={{ margin: "0.5rem 0", color: "#666", fontSize: "0.9rem" }}>
                        Flagged by: {flag.flaggedByEmail || flag.flaggedBy}
                        {flag.createdAt && (
                          <> | {flag.createdAt.toDate ? flag.createdAt.toDate().toLocaleString() : "Unknown date"}</>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFlag(flag.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Colleges Tab */}
      {activeTab === "colleges" && (
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h2>All Colleges</h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            As an admin, you have access to view and edit all colleges.
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
                    {college.name || college.id}
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
                <p style={{ color: "#666" }}>No exams found for this college.</p>
              ) : (
                <div>
                  <h3>Exams:</h3>
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
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ 
        padding: "1rem", 
        background: "#e7f3ff", 
        borderRadius: "8px",
        border: "1px solid #b3d9ff",
        marginTop: "2rem"
      }}>
        <h3 style={{ marginTop: 0 }}>👑 Admin Features</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>✅ View and manage all flagged courses/reports</li>
          <li>✅ Edit any college's exam requirements</li>
          <li>✅ Manage user roles and permissions</li>
          <li>✅ View system analytics and reports</li>
          <li>✅ Moderate content and resolve disputes</li>
        </ul>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          <strong>Note:</strong> As an admin, you have full unrestricted access to all collections per Firestore security rules.
        </p>
      </div>
    </div>
  );
}

