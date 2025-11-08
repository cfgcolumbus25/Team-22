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
  if (typeof ts === "object" && "_seconds" in ts) {
    return new Date(ts._seconds * 1000).toLocaleDateString();
  }
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
  async addCollege(payload) {
    const r = await fetch("/api/colleges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("create college failed");
    return r.json();
  },
  async deleteCollege(id) {
    const r = await fetch(`/api/colleges/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("delete college failed");
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
  // Flags
  async flagExam(collegeId, examId, reason, contact) {
    const r = await fetch(`/api/colleges/${collegeId}/exams/${examId}/flags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, contact }),
    });
    if (!r.ok) throw new Error("flag exam failed");
    return r.json(); // { ok: true, flagged: number }
  },
  async listFlags(collegeId, examId, limit = 20) {
    const r = await fetch(
      `/api/colleges/${collegeId}/exams/${examId}/flags?limit=${limit}`
    );
    if (!r.ok) throw new Error("load flags failed");
    return r.json();
  },
};

// ---------- component ----------
export default function App() {
  const { user, userData, loading: authLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

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
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  // search/sort
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("school"); // school|state|zip|exams|flags
  const [sortDir, setSortDir] = useState("asc");

  // expand state
  const [open, setOpen] = useState({});

  // advanced filters
  const [minSchoolExams, setMinSchoolExams] = useState("");
  const [minExamCredits, setMinExamCredits] = useState("");
  const [minExamScore, setMinExamScore] = useState("");
  const [examFilter, setExamFilter] = useState("");

  // NEW: show only flagged exams
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  // modals
  const [addOpen, setAddOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(null); // {collegeId, examId} | null
  const [flagText, setFlagText] = useState("");
  const [flagContact, setFlagContact] = useState("");

  const [newSchool, setNewSchool] = useState({
    id: "",
    name: "",
    state: "",
    zipCode: "",
  });

  const [addExamOpen, setAddExamOpen] = useState(null); // {collegeId} | null
  const [newExam, setNewExam] = useState({
    examName: "",
    minScore: "",
    credits: "",
    transcriptDollars: "",
  });
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await API.listColleges();
        setColleges(
          list.map((c) => ({
            id: c.id,
            name: c.name || c.id,
            state: c.state || "",
            zipCode: c.zipCode || "",
            lastUpdated: c.lastUpdated,
            examsCount: c.exams?.length ?? c.examsCount ?? null,
            exams: undefined, // lazy load
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Helper: ensure exams loaded for a single college
  const ensureExamsLoaded = async (id) => {
    const idx = colleges.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const col = colleges[idx];
    if (col.exams) return;

    const details = await API.getCollege(id);
    const exams = details.exams ?? (await API.listExams(id)) ?? [];
    const updated = [...colleges];
    updated[idx] = {
      ...col,
      name: details.name || col.name,
      state: details.state ?? col.state,
      zipCode: details.zipCode ?? col.zipCode,
      exams,
      examsCount: exams.length,
      lastUpdated: details.lastUpdated ?? col.lastUpdated,
    };
    setColleges(updated);
  };

  // When filtering by exam name, load exams for all schools (so filter is accurate)
  useEffect(() => {
    if (!examFilter.trim()) return;
    (async () => {
      await Promise.all(colleges.map((c) => ensureExamsLoaded(c.id)));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examFilter]);

  // NEW: When sorting by flags OR showing only flagged, load exams for all schools
  useEffect(() => {
    if (sortKey !== "flags" && !onlyFlagged) return;
    (async () => {
      await Promise.all(colleges.map((c) => ensureExamsLoaded(c.id)));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, onlyFlagged]);

  const toggleOpen = async (id) => {
    const next = { ...open, [id]: !open[id] };
    setOpen(next);
    if (!open[id]) await ensureExamsLoaded(id);
  };

  const applyRefreshCollege = async (id) => {
    await ensureExamsLoaded(id);
    const details = await API.getCollege(id);
    const exams = details.exams ?? (await API.listExams(id)) ?? [];
    setColleges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: details.name || c.name,
              state: details.state ?? c.state,
              zipCode: details.zipCode ?? c.zipCode,
              exams,
              examsCount: exams.length,
              lastUpdated: details.lastUpdated ?? c.lastUpdated,
            }
          : c
      )
    );
  };

  // add school
  const submitAddSchool = async () => {
    if (!newSchool.id || !newSchool.name) {
      alert("Please provide both School ID and School Name.");
      return;
    }
    try {
      const created = await API.addCollege({
        id: newSchool.id.trim(),
        name: newSchool.name.trim(),
        state: (newSchool.state || "").trim(),
        zipCode: (newSchool.zipCode || "").trim(),
        acceptsExams: true,
      });
      setColleges((list) => [
        ...list,
        {
          id: created.id,
          name: created.name || created.id,
          state: created.state || "",
          zipCode: created.zipCode || "",
          lastUpdated: created.lastUpdated,
          examsCount: 0,
          exams: [],
        },
      ]);
      setAddOpen(false);
      setNewSchool({ id: "", name: "", state: "", zipCode: "" });
    } catch (e) {
      alert("Failed to add school");
    }
  };

  // delete school
  const removeCollege = async (id) => {
    if (!confirm("Delete this university and ALL its exams?")) return;
    try {
      await API.deleteCollege(id);
      setColleges((list) => list.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete university");
    }
  };

  // open flag modal
  const openFlag = (collegeId, examId) => {
    setFlagText("");
    setFlagContact("");
    setFlagOpen({ collegeId, examId });
  };

  // submit flag
  const submitFlag = async () => {
    if (!flagOpen) return;
    if (!flagText.trim()) {
      alert("Please enter a brief explanation.");
      return;
    }
    try {
      const { flagged } = await API.flagExam(
        flagOpen.collegeId,
        flagOpen.examId,
        flagText,
        flagContact
      );
      // update count locally
      setColleges((list) =>
        list.map((c) =>
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
      alert("Failed to flag exam");
    }
  };

  // add exam modal handlers
  const openAddExam = (collegeId) => {
    setNewExam({
      examName: "",
      minScore: "",
      credits: "",
      transcriptDollars: "",
    });
    setAddExamOpen({ collegeId });
  };

  const submitAddExam = async () => {
    if (!addExamOpen) return;
    const { examName, minScore, credits, transcriptDollars } = newExam;
    if (!examName.trim()) {
      alert("Please enter an exam name.");
      return;
    }
    try {
      const cents = Math.round(
        (parseFloat(transcriptDollars || "0") || 0) * 100
      );
      const created = await API.addExam(addExamOpen.collegeId, {
        examName: examName.trim(),
        minScore: Number(minScore || 0),
        credits: Number(credits || 0),
        transcriptChargeCents: cents,
      });

      setColleges((list) =>
        list.map((c) =>
          c.id !== addExamOpen.collegeId
            ? c
            : {
                ...c,
                exams: [...(c.exams || []), created].sort((a, b) =>
                  (a.examName || "").localeCompare(b.examName || "")
                ),
                examsCount: (c.examsCount || 0) + 1,
              }
        )
      );

      setAddExamOpen(null);
    } catch {
      alert("Failed to add exam");
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
      title={`Sort by ${label}`}
    >
      {label}
      {sortKey === key && (
        <span className="chip-caret">{sortDir === "asc" ? "▴" : "▾"}</span>
      )}
    </button>
  );

  const asNum = (v) => {
    const n = Number(String(v).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const examSuggestions = useMemo(() => {
    const set = new Set();
    colleges.forEach((c) => (c.exams || []).forEach((e) => set.add(e.examName)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [colleges]);

  // helper: total flags per college (sum of exam.flagged)
  const collegeFlagsTotal = (c) =>
    (c.exams || []).reduce((sum, e) => sum + (Number(e.flagged || 0) || 0), 0);

  // filter + sort college rows
  const filteredSorted = useMemo(() => {
    const text = q.trim().toLowerCase();
    const wantedExam = examFilter.trim().toLowerCase();

    let rows = colleges.filter((c) => {
      if (text) {
        const hit =
          c.name.toLowerCase().includes(text) ||
          c.state.toLowerCase().includes(text) ||
          String(c.zipCode).includes(text);
        if (!hit) return false;
      }
      const minEx = Number(minSchoolExams || 0);
      if (minEx > 0 && typeof c.examsCount === "number" && c.examsCount < minEx)
        return false;

      if (wantedExam) {
        const list = c.exams || [];
        const ok = list.some((e) =>
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
        case "exams":
          x = a.examsCount ?? -1;
          y = b.examsCount ?? -1;
          break;
        case "flags": {
          // sort by total flags (requires exams to be loaded)
          x = collegeFlagsTotal(a);
          y = collegeFlagsTotal(b);
          break;
        }
        default:
          x = (a.name || "").toUpperCase();
          y = (b.name || "").toUpperCase();
      }
      if (x < y) return sortDir === "asc" ? -1 : 1;
      if (x > y) return sortDir === "asc" ? 1 : -1;
      return 0;
    };

    return rows.sort(cmp);
  }, [colleges, q, sortKey, sortDir, minSchoolExams, examFilter]);

  return (
    <div className="shell">
      <div className="container">
        <header className="topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#111827",
            padding: "1rem 2rem",
            borderBottom: "1px solid #1f2937",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}>
          <h1 className="brand">CLEP Acceptance</h1>

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
              {/* NEW: sort by Flags */}
              {sortBtn("Flags", "flags")}
            </div>

            {/* advanced filters & add school */}
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
                  list="exam-suggestions"
                  className="input input--dark"
                  placeholder="e.g. Calculus, Biology…"
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                />
                <datalist id="exam-suggestions">
                  {examSuggestions.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </label>

              {/* NEW: Only flagged exams toggle */}
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

              <div className="add-col">
                <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
                  + Add School
                </button>
              </div>
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
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#b52a36")}
            onMouseLeave={(e) => (e.target.style.background = "#dc3545")}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        <main className="stack">
          {loading && <div className="empty">Loading schools…</div>}
          {!loading && filteredSorted.length === 0 && (
            <div className="empty">No schools found.</div>
          )}

          {filteredSorted.map((c) => {
            const asNumber = (v) => {
              const n = Number(String(v).replace(/[^\d.-]/g, ""));
              return Number.isFinite(n) ? n : 0;
            };
            const creditsMin = asNumber(minExamCredits);
            const scoreMin = asNumber(minExamScore);

            // apply per-exam filters and only-flagged toggle
            const visibleExams =
              (c.exams || []).filter((e) => {
                if (onlyFlagged && !(Number(e.flagged || 0) > 0)) return false;
                if (creditsMin && Number(e.credits || 0) < creditsMin) return false;
                if (scoreMin && Number(e.minScore || 0) < scoreMin) return false;
                return true;
              }) || [];

            const flagsTotal = collegeFlagsTotal(c);

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
                    {/* NEW: show total flags per school when exams loaded */}
                    {c.exams && (
                      <span className="flag-chip" title="Total flags in this school">
                        {flagsTotal} flag{flagsTotal === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                  <span className="count">
                    {typeof c.examsCount === "number"
                      ? `${c.examsCount} exam${c.examsCount === 1 ? "" : "s"}`
                      : "—"}
                  </span>
                </button>

                {open[c.id] && (
                  <div className="card-body">
                    <div className="card-title-row">
                      <div className="title-col">
                        <h2 className="title">{c.name}</h2>
                        <div className="sub">
                          State: <strong>{c.state || "—"}</strong>
                          <span className="dot">•</span>
                          Zip: <strong>{c.zipCode || "—"}</strong>
                        </div>
                      </div>
                      <div className="actions-col">
                        <button
                          className="btn btn-primary"
                          onClick={() => applyRefreshCollege(c.id)}
                        >
                          Refresh
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => openAddExam(c.id)}
                        >
                          + Add exam
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeCollege(c.id)}
                        >
                          Delete University
                        </button>
                      </div>
                    </div>

                    <div className="table-wrap">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th className="col-exam">Exams</th>
                            <th className="col-num">Minimum Score</th>
                            <th className="col-num">Credits Transcribed</th>
                            <th className="col-num">Transcript Charge</th>
                            <th className="col-date">Last Modified</th>
                            <th className="col-actions">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleExams.length > 0 ? (
                            visibleExams.map((e) => (
                              <tr key={e.id}>
                                <td className="col-exam">
                                  <span className="pill">{e.examName}</span>
                                  <span className="flag-chip" title="Flags on this exam">
                                    {(e.flagged ?? 0)} flag
                                    {(e.flagged ?? 0) === 1 ? "" : "s"}
                                  </span>
                                </td>
                                <td className="col-num">{e.minScore ?? "—"}</td>
                                <td className="col-num">{e.credits ?? "—"}</td>
                                <td className="col-num">
                                  {money(e.transcriptChargeCents ?? 0)}
                                </td>
                                <td className="col-date">
                                  {shortDate(e.lastModified)}
                                </td>
                                <td className="col-actions">
                                  <div className="btn-row">
                                    <button
                                      className="btn btn-soft"
                                      onClick={() => openFlag(c.id, e.id)}
                                    >
                                      Flag
                                    </button>
                                    <button className="btn btn-soft">Edit</button>
                                    <button className="btn btn-danger">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="empty-row">
                              <td colSpan={6}>No exams match your filters.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </main>
      </div>

      {/* Add School Modal */}
      {addOpen && (
        <div className="modal">
          <div className="dialog">
            <h3>Add School</h3>
            <div className="grid2">
              <label className="label">
                School ID
                <input
                  className="input input--dark"
                  value={newSchool.id}
                  onChange={(e) =>
                    setNewSchool((s) => ({ ...s, id: e.target.value }))
                  }
                  placeholder="e.g. osu"
                />
              </label>
              <label className="label">
                School Name
                <input
                  className="input input--dark"
                  value={newSchool.name}
                  onChange={(e) =>
                    setNewSchool((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="e.g. Ohio State University"
                />
              </label>
              <label className="label">
                State
                <input
                  className="input input--dark"
                  value={newSchool.state}
                  onChange={(e) =>
                    setNewSchool((s) => ({ ...s, state: e.target.value }))
                  }
                  placeholder="e.g. OH"
                />
              </label>
              <label className="label">
                Zip
                <input
                  className="input input--dark"
                  value={newSchool.zipCode}
                  onChange={(e) =>
                    setNewSchool((s) => ({ ...s, zipCode: e.target.value }))
                  }
                  placeholder="e.g. 43210"
                  inputMode="numeric"
                />
              </label>
            </div>

            <div className="btn-row end">
              <button className="btn btn-soft" onClick={() => setAddOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitAddSchool}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {addExamOpen && (
        <div className="modal">
          <div className="dialog">
            <h3>Add exam</h3>
            <div className="grid2">
              <label className="label">
                Exam name
                <input
                  className="input input--dark"
                  value={newExam.examName}
                  onChange={(e) =>
                    setNewExam((s) => ({ ...s, examName: e.target.value }))
                  }
                  placeholder="e.g. Calculus, Biology…"
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
                  placeholder="e.g. 50"
                />
              </label>
              <label className="label">
                Credits transcribed
                <input
                  className="input input--dark"
                  inputMode="numeric"
                  value={newExam.credits}
                  onChange={(e) =>
                    setNewExam((s) => ({ ...s, credits: e.target.value }))
                  }
                  placeholder="e.g. 3"
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
                  placeholder="e.g. 25.00"
                />
              </label>
            </div>

            <div className="btn-row end">
              <button
                className="btn btn-soft"
                onClick={() => setAddExamOpen(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitAddExam}>
                Save exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
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
              placeholder="e.g. Minimum score listed as 60 on registrar site"
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


