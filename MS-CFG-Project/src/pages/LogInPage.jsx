import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import ModernStateLogo from '../assets/Modern-State_logo.png';


const LogInPage = () => {
  const [accountType, setAccountType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Logic for sign-in goes here
    console.log('Signing in with:', { accountType, email, password });
    
    // Navigate to learner dashboard
    if (accountType === 'learner') {
      navigate('/learner');
    } else if (accountType === 'institution') {
      navigate('/institution');
    } else if (accountType === 'ms_admin') {
      navigate('/admin');
    }
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
                <a href="#" className="forgot-password">Forgot password?</a>
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
      </div>
    </div>
);

}

export default LogInPage;
