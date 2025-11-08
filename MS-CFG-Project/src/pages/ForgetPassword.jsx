import { useState } from "react";
import './ForgetPassword.css';
import ModernStateLogo from '../assets/Modern-State_logo.png';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your backend/email API call here
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
            <h2 className="welcome-text">Forgot Password</h2>
            <p className="subtitle-text">Enter your email address and we’ll send you a link to reset your password.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button className="sign-in-button" type="submit">Send Reset Link</button>
            </form>

            <div className="signup-prompt">
              <a className="signup-link" href="/login">Back to sign in</a>
            </div>
          </>
        ) : (
          <>
            <h2 className="welcome-text">Check your email</h2>
            <p className="subtitle-text">If <strong>{email}</strong> is registered, a reset link was sent.</p>
            <a className="signup-link" href="/login">Return to Sign In</a>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
