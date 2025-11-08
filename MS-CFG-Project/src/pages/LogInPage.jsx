import { useState } from "react";
import { registerUser, loginUser, ROLES } from "../auth/authService";
import "./LogInPage.css";

export default function LogInPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        // Register - Only learners can register through the form
        console.log("📝 Attempting to register as learner:", email);
        const user = await registerUser(email, password, ROLES.LEARNER);
        console.log("✅ Registration successful:", user.email, "Role: learner");
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
              <div style={{ 
                background: "#e3f2fd", 
                padding: "0.75rem", 
                borderRadius: "6px", 
                marginBottom: "1rem",
                fontSize: "0.9rem",
                color: "#1976d2"
              }}>
                <strong>📝 Creating a Learner Account</strong>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem" }}>
                  New accounts are created as Learners. Admin and Institution accounts are preset for demo purposes.
                </p>
              </div>
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

        {isLogin && (
          <div style={{ 
            marginTop: "1.5rem", 
            padding: "1rem", 
            background: "#f5f5f5", 
            borderRadius: "6px",
            fontSize: "0.85rem",
            color: "#666"
          }}>
            <strong>🔑 Demo Accounts:</strong>
            <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem" }}>
              <li>Admin: Check Firebase Console for preset credentials</li>
              <li>Institution: Check Firebase Console for preset credentials</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

