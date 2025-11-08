// MS-CFG-Project/src/App.jsx
// 3-Role Authentication System with Protected Routes
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import LogInPage from "./pages/LogInPage";
import LearnerDash from "./pages/LearnerDash";
import InstitutionDash from "./pages/InstitutionDash";
import MSAdminDash from "./pages/MSAdminDash";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./auth/authService";
import "./App.css";

// Enable debug mode for testing (set to false in production)
const DEBUG_MODE = true;

// Redirect based on role after login
function RoleBasedRedirect() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  switch (role) {
    case ROLES.LEARNER:
      return <Navigate to="/learner" replace />;
    case ROLES.INSTITUTION:
      return <Navigate to="/institution" replace />;
    case ROLES.ADMIN:
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

// Public route that redirects if already logged in
function PublicRoute({ children }) {
  const { user, userData, loading, role } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If logged in, redirect to appropriate dashboard
  if (user && userData) {
    return <RoleBasedRedirect />;
  }

  return <>{children}</>;
}

export default function App() {
  const { user, userData, loading } = useAuth();

  // Debug logging in development
  if (DEBUG_MODE) {
    console.log("🔍 Auth State:", {
      user: user ? { uid: user.uid, email: user.email } : null,
      userData,
      loading
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LogInPage />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/learner"
          element={
            <ProtectedRoute allowedRoles={ROLES.LEARNER}>
              <LearnerDash />
            </ProtectedRoute>
          }
        />

        <Route
          path="/institution"
          element={
            <ProtectedRoute allowedRoles={ROLES.INSTITUTION}>
              <InstitutionDash />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={ROLES.ADMIN}>
              <MSAdminDash />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<RoleBasedRedirect />} />
        
        {/* Catch all - redirect to login or appropriate dashboard */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
