import { useState } from "react";
import { registerUser, loginUser, ROLES } from "../auth/authService";
import "./LogInPage.css";

export default function LogInPage() {
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
        const user = await loginUser(email, password);
        console.log("✅ Login successful:", user.email);
      } else {
        const user = await registerUser(email, password, ROLES.LEARNER);
        console.log("✅ Registration successful:", user.email);
      }
    } catch (err) {
      console.error("❌ Auth error:", err);
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
    <div className="login-page" style={{ paddingLeft: "500px" }}>
      <div className="login-card">
        <h2 className="login-title">{isLogin ? "Login" : "Sign Up"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="info-box">
              <strong>📝 Creating a Learner Account</strong>
              <p>
                New accounts are created as Learners. Admin and Institution
                accounts are preset for demo purposes.
              </p>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <button
          className="toggle-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          disabled={loading}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </button>

        {isLogin && (
          <div className="demo-box">
            <strong>🔑 Demo Accounts:</strong>
            <ul>
              <li>Admin: Check Firebase Console for preset credentials</li>
              <li>Institution: Check Firebase Console for preset credentials</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
