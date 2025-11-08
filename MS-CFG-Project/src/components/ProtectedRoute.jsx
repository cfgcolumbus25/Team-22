import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { ROLES } from "../auth/authService";

/**
 * Protected Route Component
 * Restricts access based on user role
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if access granted
 * @param {string|Array} props.allowedRoles - Role(s) allowed to access this route
 * @param {string} props.redirectTo - Path to redirect if access denied (default: "/")
 */
export default function ProtectedRoute({ children, allowedRoles, redirectTo = "/" }) {
  const { user, userData, loading, role } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !userData) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasAccess = rolesArray.includes(role);

  if (!hasAccess) {
    console.warn(`⚠️ Access denied: User role "${role}" not allowed. Required: ${rolesArray.join(", ")}`);
    // Redirect to their dashboard based on role
    if (role === ROLES.LEARNER) {
      return <Navigate to="/learner" replace />;
    } else if (role === ROLES.INSTITUTION) {
      return <Navigate to="/institution" replace />;
    } else if (role === ROLES.ADMIN) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Access granted, render children
  return <>{children}</>;
}

