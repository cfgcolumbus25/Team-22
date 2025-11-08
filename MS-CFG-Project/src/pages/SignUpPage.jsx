import { useState } from "react";
import './SignUpPage.css';
import ModernStateLogo from '../assets/Modern-State_logo.png';
import LogInPage from "./LogInPage"; // <-- import your login page

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // <-- modal state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: Add backend signup logic here
    setSubmitted(true);
  };

  return (
    <div className="background-area">
      <div className="logo-box">
        <img src={ModernStateLogo} alt="Modern State Logo" className="logo-image" />
      </div>

      <div className="login-card">
        {!submitted ? (
          <>
            <h2 className="welcome-text">Create Your Account</h2>
            <p className="subtitle-text">Join Modern State and start learning smarter today.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="accountType">Account Type</label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select account type</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="sign-in-button">
                Create Account
              </button>
            </form>

            <div className="signup-prompt">
              Already have an account?{" "}
              <button
                className="signup-link modal-link"
                type="button"
                onClick={() => setShowLoginModal(true)} // <-- open modal
              >
                Sign In
              </button>
            </div>
          </>
        ) : (
          <div className="confirmation-message">
            <h2 className="welcome-text">Welcome Aboard 🎉</h2>
            <p className="subtitle-text">
              Your account has been created successfully. Please check your email to verify your account.
            </p>
            <button
              className="signup-link modal-link"
              type="button"
             onClick={onClose}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>

      {/* --- Login Modal --- */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal-btn"
              onClick={() => setShowLoginModal(false)}
            >
              ✕
            </button>
            <LogInPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
