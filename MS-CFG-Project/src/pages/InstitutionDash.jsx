import { useEffect, useMemo, useState } from "react";
import "../App.css";
import { useAuth } from "../auth/useAuth";
import { logoutUser } from "../auth/authService";

const money = (cents = 0) =>
  (Number(cents || 0) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const shortDate = (ts) => {
  if (!ts) return "—";
  if (typeof ts === "object" && "_seconds" in ts)
    return new Date(ts._seconds * 1000).toLocaleDateString();
  const d = new Date(ts);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

const API = {
  async getCollege(id) {
    const r = await fetch(`/api/colleges/${id}`);
    if (!r.ok) throw new Error("load college failed");
    return r.json();
  },
  async listExams(collegeId) {
    const r = await fetch(`/api/colleges/${collegeId}/exams`);
    if (!r.ok) throw new Error("load exams failed");
    return r.json();
  },
  async addExam(collegeId, payload) {
    const r = await fetch(`/api/colleges/${collegeId}/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("create exam failed");
    return r.json();
  },
  async updateExam(collegeId, examId, payload) {
    const r = await fetch(`/api/colleges/${collegeId}/exams/${examId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("update exam failed");
    return r.json();
  },
  async deleteExam(collegeId, examId) {
    const r = await fetch(`/api/colleges/${collegeId}/exams/${examId}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error("delete exam failed");
    return r.json();
  },
  async resetFlags(collegeId, examId) {
    const r = await fetch(`/api/colleges/${collegeId}/exams/${examId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flagged: 0,
        lastFlagReason: null,
        lastFlaggedAt: null,
      }),
    });
    if (!r.ok) throw new Error("reset flags failed");
    return r.json();
  },
};

export default function InstitutionDashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [college, setCollege] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addExamOpen, setAddExamOpen] = useState(false);
  const [editExam, setEditExam] = useState(null);

  const [newExam, setNewExam] = useState({
    examName: "",
    minScore: "",
    credits: "",
    transcriptDollars: "",
  });

  const [minExamCredits, setMinExamCredits] = useState("");
  const [minExamScore, setMinExamScore] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const collegeId = userData?.collegeId || "MSU";
        const details = await API.getCollege(collegeId);
        const list = await API.listExams(collegeId);
        setCollege(details);
        setExams(list);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, userData]);

  const filteredExams = useMemo(() => {
    const minScore = Number(minExamScore || 0);
    const minCredits = Number(minExamCredits || 0);
    const filter = examFilter.trim().toLowerCase();
    return exams.filter((e) => {
      if (onlyFlagged && !(Number(e.flagged || 0) > 0)) return false;
      if (minScore && Number(e.minScore || 0) < minScore) return false;
      if (minCredits && Number(e.credits || 0) < minCredits) return false;
      if (filter && !e.examName.toLowerCase().includes(filter)) return false;
      return true;
    });
  }, [exams, minExamCredits, minExamScore, examFilter, onlyFlagged]);

  const refresh = async () => {
    if (!college) return;
    const list = await API.listExams(college.id);
    setExams(list);
  };

  const submitAddExam = async () => {
    if (!college) return;
    const { examName, minScore, credits, transcriptDollars } = newExam;
    if (!examName.trim()) return alert("Exam name required");
    try {
      const cents = Math.round(
        (parseFloat(transcriptDollars || "0") || 0) * 100
      );
      const created = await API.addExam(college.id, {
        examName,
        minScore: Number(minScore || 0),
        credits: Number(credits || 0),
        transcriptChargeCents: cents,
      });
      setExams((prev) => [...prev, created]);
      setAddExamOpen(false);
      setNewExam({ examName: "", minScore: "", credits: "", transcriptDollars: "" });
    } catch {
      alert("Failed to add exam");
    }
  };

  const submitEditExam = async () => {
    if (!college || !editExam) return;
    const { examName, minScore, credits, transcriptDollars } = newExam;
    try {
      const cents = Math.round(
        (parseFloat(transcriptDollars || "0") || 0) * 100
      );
      const updated = await API.updateExam(college.id, editExam.id, {
        examName,
        minScore: Number(minScore || 0),
        credits: Number(credits || 0),
        transcriptChargeCents: cents,
      });
      setExams((prev) =>
        prev.map((e) => (e.id === editExam.id ? updated : e))
      );
      setEditExam(null);
    } catch {
      alert("Failed to update exam");
    }
  };

  const deleteExam = async (examId) => {
    if (!confirm("Delete this exam?")) return;
    try {
      await API.deleteExam(college.id, examId);
      setExams((prev) => prev.filter((e) => e.id !== examId));
    } catch {
      alert("Failed to delete exam");
    }
  };

  const resetFlags = async (examId) => {
    if (!confirm("Reset all flags for this exam?")) return;
    try {
      await API.resetFlags(college.id, examId);
      setExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, flagged: 0 } : e))
      );
    } catch {
      alert("Failed to reset flags");
    }
  };

  if (authLoading || loading)
    return (
      <div className="empty" style={{ color: "white" }}>
        Loading...
      </div>
    );

  return (
    <div className="shell">
      <div className="container">
        <header
          className="topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#111827",
            padding: "1rem 2rem",
            borderBottom: "1px solid #1f2937",
          }}
        >
          <h1 className="brand">CLEP Acceptance</h1>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              padding: "0.6rem 1.2rem",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        {college && (
          <main className="stack">
            <section className="college-card">
              <div className="row-head">
                <span className="school">{college.name}</span>
                <div className="meta">
                  {college.state && <span className="badge">{college.state}</span>}
                  {college.zipCode && <span className="badge">{college.zipCode}</span>}
                </div>
                <div className="btn-row">
                  <button className="btn btn-soft" onClick={refresh}>
                    Refresh
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setAddExamOpen(true)}
                  >
                    + Add Exam
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="table-wrap">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Exam</th>
                        <th>Minimum Score</th>
                        <th>Credits</th>
                        <th>Transcript Charge</th>
                        <th>Flags</th>
                        <th>Last Modified</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExams.map((e) => (
                        <tr key={e.id}>
                          <td>{e.examName}</td>
                          <td>{e.minScore}</td>
                          <td>{e.credits}</td>
                          <td>{money(e.transcriptChargeCents)}</td>
                          <td>{e.flagged || 0}</td>
                          <td>{shortDate(e.lastModified)}</td>
                          <td>
                            <div className="btn-row">
                              <button
                                className="btn btn-soft"
                                onClick={() => {
                                  setEditExam(e);
                                  setNewExam({
                                    examName: e.examName,
                                    minScore: e.minScore,
                                    credits: e.credits,
                                    transcriptDollars:
                                      (e.transcriptChargeCents || 0) / 100,
                                  });
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteExam(e.id)}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-soft"
                                onClick={() => resetFlags(e.id)}
                              >
                                Reset Flags
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </main>
        )}
      </div>

      {(addExamOpen || editExam) && (
        <div className="modal">
          <div className="dialog">
            <h3>{editExam ? "Edit Exam" : "Add Exam"}</h3>
            <div className="grid2">
              <label className="label">
                Exam name
                <input
                  className="input input--dark"
                  value={newExam.examName}
                  onChange={(e) =>
                    setNewExam((s) => ({ ...s, examName: e.target.value }))
                  }
                />
              </label>
              <label className="label">
                Minimum score
                <input
                  className="input input--dark"
                  inputMode="numeric"
                  value={newExam.minScore}
                  onChange={(e) =>
                    setNewExam((s) => ({ ...s, minScore: e.target.value }))
                  }
                />
              </label>
              <label className="label">
                Credits
                <input
                  className="input input--dark"
                  inputMode="numeric"
                  value={newExam.credits}
                  onChange={(e) =>
                    setNewExam((s) => ({ ...s, credits: e.target.value }))
                  }
                />
              </label>
              <label className="label">
                Transcript charge ($)
                <input
                  className="input input--dark"
                  inputMode="decimal"
                  value={newExam.transcriptDollars}
                  onChange={(e) =>
                    setNewExam((s) => ({
                      ...s,
                      transcriptDollars: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <div className="btn-row end">
              <button
                className="btn btn-soft"
                onClick={() => {
                  setAddExamOpen(false);
                  setEditExam(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={editExam ? submitEditExam : submitAddExam}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
