// MS-CFG-Project/src/App.jsx
// 3-Role Authentication System with Testing Mode
import { useAuth } from "./auth/useAuth";
import LogInPage from "./pages/LogInPage";
import LearnerDash from "./pages/LearnerDash";
import InstitutionDash from "./pages/InstitutionDash";
import MSAdminDash from "./pages/MSAdminDash";
import { ROLES } from "./auth/authService";
import "./App.css";

// Enable debug mode for testing (set to false in production)
const DEBUG_MODE = true;

export default function App() {
  const { user, userData, loading, role, isAdmin, isLearner, isInstitution } = useAuth();

  // Debug logging in development
  if (DEBUG_MODE) {
    console.log("🔍 Auth State:", {
      user: user ? { uid: user.uid, email: user.email } : null,
      userData,
      role,
      isAdmin,
      isLearner,
      isInstitution,
      loading
    });
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <div>🔄 Loading authentication...</div>
        {DEBUG_MODE && <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>Checking Firebase Auth & Firestore...</div>}
      </div>
    );
  }

  // If not authenticated, show login page
  if (!user || !userData) {
    if (DEBUG_MODE) {
      console.log("🚫 Not authenticated - showing login page");
    }
    return <LogInPage onLoginSuccess={() => {
      console.log("✅ Login successful! User will be redirected to dashboard.");
    }} />;
  }

  // Debug: Show role routing decision
  if (DEBUG_MODE) {
    console.log(`🎯 Routing to dashboard for role: ${role}`);
  }

  // Route to appropriate dashboard based on role
  switch (role) {
    case ROLES.LEARNER:
      return <LearnerDash />;
    case ROLES.INSTITUTION:
      return <InstitutionDash />;
    case ROLES.ADMIN:
      return <MSAdminDash />;
    default:
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>⚠️ Unknown Role</h2>
          <p>Your account has an invalid role: <strong>{role}</strong></p>
          <p>Please contact an administrator.</p>
          {DEBUG_MODE && (
            <div style={{ marginTop: "2rem", padding: "1rem", background: "#f5f5f5", borderRadius: "8px", textAlign: "left", maxWidth: "600px", margin: "2rem auto" }}>
              <h3>Debug Info:</h3>
              <pre>{JSON.stringify({ user, userData, role }, null, 2)}</pre>
            </div>
          )}
        </div>
      );
  }
}