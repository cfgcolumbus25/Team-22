import { useState } from "react";
import { registerUser, loginUser, ROLES } from "../auth/authService";
import "./LogInPage.css";

export default function LogInPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.LEARNER);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        console.log("🔐 Attempting to login:", email);
        const user = await loginUser(email, password);
        console.log("✅ Login successful:", user.email);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        // Register
        console.log("📝 Attempting to register:", { email, role });
        const user = await registerUser(email, password, role);
        console.log("✅ Registration successful:", user.email, "Role:", role);
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      console.error("❌ Auth error:", err);
      // Provide user-friendly error messages
      let errorMessage = "An error occurred";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please login instead.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value={ROLES.LEARNER}>Learner</option>
                <option value={ROLES.INSTITUTION}>Institution</option>
                <option value={ROLES.ADMIN}>Admin</option>
              </select>
              <small>
                Note: Admin role should typically be assigned manually for security.
              </small>
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="toggle-form">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="link-button"
            disabled={loading}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

