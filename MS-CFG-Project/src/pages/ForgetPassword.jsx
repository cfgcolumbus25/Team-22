// Very simple comments version — super plain and easy to read
// Import React's useState so we can keep track of what the user types
import { useState } from "react";
// Bring in the CSS for this page (reuses login styles)
import './ForgetPassword.css';
// Load a small logo image so the page has branding
import ModernStateLogo from '../assets/Modern-State_logo.png';

// The page component. Think of it as a tiny box that asks for your email.
const ForgetPassword = () => {
  // A place to store the email the user types (starts empty)
  const [email, setEmail] = useState('');
  // A flag: false = show form, true = show "check your email" message
  const [submitted, setSubmitted] = useState(false);

  // When the user clicks Send, run this. We stop the browser reloading
  // and switch to the confirmation message. Replace the TODO with your API.
  const handleSubmit = (e) => {
    e.preventDefault(); // stop page reload
    // TODO: call your backend to actually send the reset email
    setSubmitted(true); // show confirmation
  };

  // The UI we show. The outer area centers the card on a blue background.
  return (
    <div className="background-area">
      {/* small white box for the logo */}
      <div className="logo-box">
        <img src={ModernStateLogo} alt="Modern State Logo" className="logo-image" />
      </div>

      {/* the main white card where the form lives */}
      <div className="login-card">
        {/* show the form when not submitted */}
        {!submitted ? (
          <>
            <h2 className="welcome-text">Forgot Password</h2>
            <p className="subtitle-text">Enter your email address and we’ll send you a link to reset your password.</p>

            {/* the form: one input and one button */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email} // show what's typed
                  onChange={(e) => setEmail(e.target.value)} // update as user types
                  required
                />
              </div>

              {/* big button to send the reset link */}
              <button className="sign-in-button" type="submit">Send Reset Link</button>
            </form>

            {/* small link back to login if they remember their password */}
            <div className="signup-prompt">
              <a className="signup-link" href="/login">Back to sign in</a>
            </div>
          </>
        ) : (
          // After sending, show this friendly confirmation
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

// Make the component available to other parts of the app
export default ForgetPassword;
