import { useState } from "react";
import './LoginPage.css';
import ModernStateLogo from '../assets/Modern-State_logo.png';
import ForgetPasswordModal from '../components/ForgetPasswordModal'; // the overlay we will show


const LogInPage = () => {
  const [accountType, setAccountType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false); // whether the overlay is visible

  const handleSignIn = (e) => {
    e.preventDefault();
    // Logic for sign-in goes here
    console.log('Signing in with:', { accountType, email, password });
  };

  return (
    <div className="login-page-container">
      {/* Outer Blue Background */}
      <div className="background-area">
        <div className="logo-box">
            <img src={ModernStateLogo} alt="Modern State Logo" className="logo-image" />
        </div>
        
        {/* The Main White Card */}
        <div className="login-card">
          <h2 className="welcome-text">Welcome</h2>
          <p className="subtitle-text">Enter your credentials to access your account</p>

          <form onSubmit={handleSignIn} className="login-form">
            {/* Account Type Dropdown */}
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

            {/* Email Input */}
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

            {/* Password Input */}
            <div className="input-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                {/* Turn the forgot link into a button that opens our overlay */}
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

            {/* Sign In Button */}
            <button type="submit" className="sign-in-button">
              Sign in
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="signup-prompt">
            Don't have an account? <a href="#" className="signup-link">Sign up</a>
          </p>
        </div>
        {/* Render the modal overlay when showForgot is true. Pass onClose so it can dismiss. */}
        {showForgot && <ForgetPasswordModal onClose={() => setShowForgot(false)} />}
      </div>
    </div>
);

}

export default LogInPage;
