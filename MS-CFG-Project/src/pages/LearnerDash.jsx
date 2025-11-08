import { useState } from "react";
import "./LearnerDash.css";

export const IssueSelect = () => (
  <div className="issue-actions">
    <label>
      <select name="selectedIssue" defaultValue="outofdate">
        <option value="notoffered">No Longer Offered</option>
        <option value="outofdate">Outdated Exam Option</option>
        <option value="restriction">Program Restriction</option>
        <option value="credits">Incorrect Credit Value</option>
        <option value="score">Wrong Minimum Score</option>
        <option value="missing">Exam Missing From List</option>
        <option value="other">Other Issue</option>
      </select>
    </label>
    <button>Submit</button>
  </div>
);

const SchoolCard = ({ title, rows }) => (
  <div className="card">
    <div className="card-header"><h2>{title}</h2></div>
    <div className="card-body">
      <table className="exam-table">
        <thead>
          <tr>
            <th>Exam</th><th>Minimum Score</th><th>Credits</th>
            <th>Last Modified Date</th><th>Report Issue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.exam}</td><td>{r.min}</td>
              <td>{r.credits}</td><td>{r.modified}</td>
              <td><IssueSelect /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const LearnerDash = () => {
  const [query, setQuery] = useState("");

  const data = [
    { exam: "American Government", min: 63, credits: 3, modified: "12/5/2024" },
    { exam: "Biology", min: 62, credits: 8, modified: "11/11/2024" },
    { exam: "Calculus", min: 50, credits: 3, modified: "07/21/2023" },
  ];

  const schools = [
    { title: "The Ohio State", rows: data },
    { title: "University of Maryland Park College", rows: data },
    { title: "University of Delaware", rows: data },
    { title: "University of Cincinnati", rows: data },
  ];

  const filtered = schools.filter(s =>
    s.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const visible = query.trim() ? filtered : schools;

  return (
    <div className="learner-bg">
      <h1>Learner Dashboard</h1>

      {/* Search bar for schools only */}
      <div style={{ width: "90%", maxWidth: 1000, marginBottom: 16 }}>
        <input
          aria-label="Search schools"
          type="text"
          placeholder="Search schools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ced4da",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div className="dash-grid">
        {visible.length ? (
          visible.map((s) => <SchoolCard key={s.title} title={s.title} rows={s.rows} />)
        ) : (
          <div className="card">
            <div className="card-body">No schools match “{query}”.</div>
          </div>
        )}
      </div>
    </div>
  );
};
