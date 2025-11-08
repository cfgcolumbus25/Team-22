import { useState } from "react";
import { flagExam } from "../services/flagService";

/**
 * Component for learners to flag an exam
 * 
 * Usage:
 * <FlagExamButton examId="bio" collegeId="college123" examName="Biology" />
 */
export default function FlagExamButton({ examId, collegeId, examName }) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      if (!message.trim()) {
        setError("Please enter a message describing the error");
        return;
      }

      await flagExam(examId, collegeId, message.trim());
      setSuccess(true);
      setMessage("");
      setShowForm(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to flag exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ 
        padding: "0.75rem", 
        background: "#d4edda", 
        color: "#155724", 
        borderRadius: "4px",
        marginTop: "1rem"
      }}>
        ✅ Exam flagged successfully! Admin will review it.
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: "0.5rem 1rem",
          background: "#ffc107",
          color: "#000",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "1rem",
          fontWeight: "500"
        }}
      >
        🚩 Flag This Exam
      </button>
    );
  }

  return (
    <div style={{
      marginTop: "1rem",
      padding: "1rem",
      background: "#fff3cd",
      border: "1px solid #ffc107",
      borderRadius: "8px"
    }}>
      <h4 style={{ marginTop: 0 }}>Flag Exam: {examName || examId}</h4>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
        Report an issue with this exam (incorrect information, outdated data, etc.)
      </p>

      {error && (
        <div style={{
          padding: "0.75rem",
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the error or issue with this exam..."
          required
          disabled={loading}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontFamily: "inherit",
            fontSize: "0.95rem"
          }}
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "500"
            }}
          >
            {loading ? "Submitting..." : "Submit Flag"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setMessage("");
              setError("");
            }}
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

