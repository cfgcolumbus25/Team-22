// src/components/SignUpModal.jsx
import './ModalBase.css';
import SignUpPage from '../pages/SignUpPage'; // Assuming your SignUpPage.jsx is in /pages

const SignUpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <SignUpPage />
      </div>
    </div>
  );
};

export default SignUpModal;
