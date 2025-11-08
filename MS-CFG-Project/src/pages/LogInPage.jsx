import { useState } from "react";
import './LoginPage.css';
import ModernStateLogo from '../assets/Modern-State_logo.png';
import ForgetPasswordModal from '../components/ForgetPasswordModal';
import SignUpModal from '../components/SignUpModal'; // Import our new signup overlay

const LogInPage = () => {
  const [accountType, setAccountType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false); // ✨ new state

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log('Signing in with:', { accountType, email, password });
  };

  return (
    <div className="login-page-container">
      <div className="background-area">
        <div className="logo-box">
          <img src={ModernStateLogo} alt="Modern State Logo" className="logo-image" />
        </div>

        <div className="login-card">
          <h2 className="welcome-text">Welcome</h2>
          <p className="subtitle-text">Enter your credentials to access your account</p>

          <form onSubmit={handleSignIn} className="login-form">
            <div className="input-group">
              <label htmlFor="accountType">Account Type</label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                required
              >
                <option value="" disabled>Select account type</option>
                <option value="institution">Institution</option>
                <option value="learner">Learner</option>
                <option value="ms_admin">Modern State Admin</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="sign-in-button">
              Sign in
            </button>
          </form>

          <p className="signup-prompt">
            Don't have an account?{" "}
            <a
              href="#"
              className="signup-link"
              onClick={(e) => {
                e.preventDefault();
                setShowSignUp(true);
              }}
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Overlays */}
        {showForgot && <ForgetPasswordModal onClose={() => setShowForgot(false)} />}
        {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
      </div>
    </div>
  );
};

export default LogInPage;
