import { useEffect, useMemo, useState } from "react";
import "../App.css";
import { useAuth } from "../auth/useAuth";
import { logoutUser } from "../auth/authService";

// ---------- utils ----------
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

// ---------- API ----------
const API = {
  async listColleges() {
    const r = await fetch("/api/colleges");
    if (!r.ok) throw new Error("load colleges failed");
    return r.json();
  },
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
  async flagExam(collegeId, examId, reason, contact) {
    const r = await fetch(`/api/colleges/${collegeId}/exams/${examId}/flags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, contact }),
    });
    if (!r.ok) throw new Error("flag exam failed");
    return r.json(); // { ok: true, flagged: number }
  },
};

// ---------- component ----------
export default function LearnerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({});
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("school");
  const [sortDir, setSortDir] = useState("asc");

  // restored filters
  const [minSchoolExams, setMinSchoolExams] = useState("");
  const [minExamCredits, setMinExamCredits] = useState("");
  const [minExamScore, setMinExamScore] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  // flag modal
  const [flagOpen, setFlagOpen] = useState(null);
  const [flagText, setFlagText] = useState("");
  const [flagContact, setFlagContact] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await API.listColleges();
        setColleges(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ensureExamsLoaded = async (id) => {
    const idx = colleges.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const col = colleges[idx];
    if (col.exams) return;

    const details = await API.getCollege(id);
    const exams = details.exams ?? (await API.listExams(id)) ?? [];
    const updated = [...colleges];
    updated[idx] = { ...col, exams };
    setColleges(updated);
  };

  const toggleOpen = async (id) => {
    const next = { ...open, [id]: !open[id] };
    setOpen(next);
    if (!open[id]) await ensureExamsLoaded(id);
  };

  const submitFlag = async () => {
    if (!flagOpen) return;
    if (!flagText.trim()) return alert("Please describe the issue.");
    try {
      const { flagged } = await API.flagExam(
        flagOpen.collegeId,
        flagOpen.examId,
        flagText,
        flagContact
      );
      setColleges((prev) =>
        prev.map((c) =>
          c.id !== flagOpen.collegeId
            ? c
            : {
                ...c,
                exams: (c.exams || []).map((e) =>
                  e.id === flagOpen.examId ? { ...e, flagged } : e
                ),
              }
        )
      );
      setFlagOpen(null);
    } catch {
      alert("Failed to flag exam.");
    }
  };

  const sortBtn = (label, key) => (
    <button
      className={`chip ${sortKey === key ? "chip--active" : ""}`}
      onClick={() => {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
          setSortKey(key);
          setSortDir("asc");
        }
      }}
    >
      {label}
      {sortKey === key && (
        <span className="chip-caret">{sortDir === "asc" ? "▴" : "▾"}</span>
      )}
    </button>
  );

  const collegeFlagsTotal = (c) =>
    (c.exams || []).reduce((sum, e) => sum + (Number(e.flagged || 0) || 0), 0);

  const filteredSorted = useMemo(() => {
    const text = q.trim().toLowerCase();
    const wantedExam = examFilter.trim().toLowerCase();

    let rows = colleges.filter((c) => {
      if (
        text &&
        !(
          c.name.toLowerCase().includes(text) ||
          c.state?.toLowerCase().includes(text) ||
          String(c.zipCode).includes(text)
        )
      )
        return false;

      const minEx = Number(minSchoolExams || 0);
      if (minEx > 0 && typeof c.examsCount === "number" && c.examsCount < minEx)
        return false;

      if (wantedExam && c.exams) {
        const ok = c.exams.some((e) =>
          (e.examName || "").toLowerCase().includes(wantedExam)
        );
        if (!ok) return false;
      }
      return true;
    });

    const cmp = (a, b) => {
      let x, y;
      switch (sortKey) {
        case "state":
          x = (a.state || "").toUpperCase();
          y = (b.state || "").toUpperCase();
          break;
        case "zip":
          x = String(a.zipCode || "");
          y = String(b.zipCode || "");
          break;
        case "flags":
          x = collegeFlagsTotal(a);
          y = collegeFlagsTotal(b);
          break;
        default:
          x = (a.name || "").toUpperCase();
          y = (b.name || "").toUpperCase();
      }
      if (x < y) return sortDir === "asc" ? -1 : 1;
      if (x > y) return sortDir === "asc" ? 1 : -1;
      return 0;
    };
    return rows.sort(cmp);
  }, [
    colleges,
    q,
    sortKey,
    sortDir,
    minSchoolExams,
    examFilter,
  ]);

  if (authLoading || loading)
    return <div className="empty">Loading data...</div>;

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
          <h1 className="brand">CLEP Acceptance (Learner View)</h1>

          <div className="filters">
            <div className="searchbox">
              <input
                className="input input--dark search-input"
                placeholder="Search schools, state, zip…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <span className="kbd">/</span>
            </div>

            <div className="chip-row">
              {sortBtn("School", "school")}
              {sortBtn("State", "state")}
              {sortBtn("Zip", "zip")}
              {sortBtn("# Exams", "exams")}
              {sortBtn("Flags", "flags")}
            </div>

            <div className="adv-grid">
              <label className="label">
                Min exams (school)
                <input
                  className="input input--dark"
                  placeholder="e.g. 10"
                  inputMode="numeric"
                  value={minSchoolExams}
                  onChange={(e) => setMinSchoolExams(e.target.value)}
                />
              </label>
              <label className="label">
                Min credits (exam)
                <input
                  className="input input--dark"
                  placeholder="e.g. 3"
                  inputMode="numeric"
                  value={minExamCredits}
                  onChange={(e) => setMinExamCredits(e.target.value)}
                />
              </label>
              <label className="label">
                Min score (exam)
                <input
                  className="input input--dark"
                  placeholder="e.g. 50"
                  inputMode="numeric"
                  value={minExamScore}
                  onChange={(e) => setMinExamScore(e.target.value)}
                />
              </label>
              <label className="label">
                Exam accepted
                <input
                  className="input input--dark"
                  placeholder="e.g. Biology, Calculus…"
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                />
              </label>

              <label className="label" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={onlyFlagged}
                    onChange={(e) => setOnlyFlagged(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                  Show only flagged exams
                </div>
              </label>
            </div>
          </div>

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
            }}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        <main className="stack">
          {filteredSorted.map((c) => {
            const visibleExams =
              (c.exams || []).filter((e) => {
                if (onlyFlagged && !(Number(e.flagged || 0) > 0)) return false;
                if (
                  minExamCredits &&
                  Number(e.credits || 0) < Number(minExamCredits)
                )
                  return false;
                if (
                  minExamScore &&
                  Number(e.minScore || 0) < Number(minExamScore)
                )
                  return false;
                if (
                  examFilter &&
                  !e.examName.toLowerCase().includes(examFilter.toLowerCase())
                )
                  return false;
                return true;
              }) || [];

            return (
              <section key={c.id} className="college-card">
                <button
                  className="row-head"
                  onClick={() => toggleOpen(c.id)}
                  aria-expanded={!!open[c.id]}
                >
                  <span className={`chev ${open[c.id] ? "open" : ""}`} />
                  <span className="school">{c.name || c.id}</span>
                  <div className="meta">
                    {c.state && <span className="badge">{c.state}</span>}
                    {c.zipCode && <span className="badge">{c.zipCode}</span>}
                  </div>
                </button>

                {open[c.id] && (
                  <div className="card-body">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>Exam</th>
                          <th>Minimum Score</th>
                          <th>Credits</th>
                          <th>Transcript Charge</th>
                          <th>Flags</th>
                          <th>Last Modified</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleExams.length > 0 ? (
                          visibleExams.map((e) => (
                            <tr key={e.id}>
                              <td>{e.examName}</td>
                              <td>{e.minScore ?? "—"}</td>
                              <td>{e.credits ?? "—"}</td>
                              <td>{money(e.transcriptChargeCents ?? 0)}</td>
                              <td>{e.flagged ?? 0}</td>
                              <td>{shortDate(e.lastModified)}</td>
                              <td>
                                <button
                                  className="btn btn-soft"
                                  onClick={() =>
                                    setFlagOpen({
                                      collegeId: c.id,
                                      examId: e.id,
                                    })
                                  }
                                >
                                  Flag
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7}>No exams available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}
        </main>
      </div>

      {flagOpen && (
        <div className="modal">
          <div className="dialog">
            <h3>Flag this exam</h3>
            <p className="muted">
              Briefly explain what looks inaccurate. Your feedback helps keep data
              up to date.
            </p>
            <textarea
              className="input input--dark textarea"
              rows={5}
              placeholder="e.g. Minimum score is listed wrong"
              value={flagText}
              onChange={(e) => setFlagText(e.target.value)}
            />
            <label className="label" style={{ marginTop: 8 }}>
              (Optional) Contact email
              <input
                className="input input--dark"
                placeholder="you@example.com"
                value={flagContact}
                onChange={(e) => setFlagContact(e.target.value)}
              />
            </label>
            <div className="btn-row end" style={{ marginTop: 10 }}>
              <button className="btn btn-soft" onClick={() => setFlagOpen(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitFlag}>
                Submit Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
