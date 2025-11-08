import { useAuth } from "../auth/useAuth";
import { logoutUser } from "../auth/authService";
import { useState } from "react";

export default function MSAdminDash() {
  const { user, userData, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

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
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h2>Welcome, {userData?.email || user?.email}!</h2>
        <p><strong>Role:</strong> {userData?.role || "Unknown"}</p>
        <p><strong>User ID:</strong> {user?.uid}</p>
      </div>

      <div style={{ background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2>Admin Features</h2>
        <ul>
          <li>View and manage all flagged courses/reports</li>
          <li>Edit any college's exam requirements</li>
          <li>Manage user roles and permissions</li>
          <li>View system analytics and reports</li>
          <li>Moderate content and resolve disputes</li>
        </ul>
        <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
          <strong>Note:</strong> As an admin, you have full access to all collections per Firestore security rules.
        </p>
      </div>
    </div>
  );
}

