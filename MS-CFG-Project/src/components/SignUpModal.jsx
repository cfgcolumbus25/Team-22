// src/components/SignUpModal.jsx
import './ModalBase.css';
import SignUpPage from '../pages/SignUpPage';

const SignUpModal = ({ onClose }) => {
  return (
    
    <div className="modal-overlay" onClick={onClose}>
  <div
    className="modal-content large-modal"
    onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
  >
    <button className="close-button" onClick={onClose}>×</button>
    <SignUpPage />
  </div>
    </div>
  );
};

export default SignUpModal;
