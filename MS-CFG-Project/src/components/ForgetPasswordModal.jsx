import React, { useEffect, useState } from 'react';
import ModernStateLogo from '../assets/Modern-State_logo.png';
import '../pages/ForgetPassword.css';

// ForgetPasswordModal — a small, self-contained overlay that tells a tiny story
// about asking for a password reset. Each line below carries a comment so you
// can follow what the code is doing like a narrated scene.
export default function ForgetPasswordModal({ onClose }) {
  // The email the user types in — our little hero for this scene.
  const [email, setEmail] = useState('');

  // Did we submit? We'll show a confirmation state if true.
  const [submitted, setSubmitted] = useState(false);

  // When the modal mounts we add a listener so pressing Escape closes it —
  // like whispering "you can step back" to the user.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Handle the visual submit — in a real app you'd call an API. For now we
  // mark submitted so the UI shows the "check your email" step.
  const handleSubmit = (e) => {
    e.preventDefault();
    // pretend we sent an email; flip the state to show the success message
    setSubmitted(true);
  };

  // Close when clicking the dark backdrop — a friendly tap outside.
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose && onClose();
  };

  return (
    // overlay: full-screen friendly dim that centers our card like a stage
    <div className="modal-overlay" onClick={handleBackdropClick}>
      {/* modal card: the white box that holds the form and the story */}
      <div className="modal-card" role="dialog" aria-modal="true">
        {/* top-right close button — small and polite */}
        <button
          className="modal-close"
          aria-label="Close"
          onClick={() => onClose && onClose()}
        >
          ×
        </button>

        {/* a tiny logo to keep branding visible without taking stage */}
        <div className="modal-logo">
          <img src={ModernStateLogo} alt="Modern State" />
        </div>

        {/* content area — either form or confirmation depending on state */}
        <div className="modal-content">
          {!submitted ? (
            // The form scene: ask for email and let the user hit Send
            <>
              <h3 className="welcome-text">Forgot Password</h3>
              <p className="subtitle-text">Enter your email and we'll send a reset link.</p>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <label htmlFor="modal-email">Email</label>
                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <button type="submit" className="sign-in-button">Send Reset Link</button>
              </form>
            </>
          ) : (
            // Confirmation scene: gentle reassurance our job is done
            <>
              <h3 className="welcome-text">Check your email</h3>
              <p className="subtitle-text">If <strong>{email}</strong> is registered, a link was sent.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="sign-in-button" onClick={() => onClose && onClose()}>Done</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
