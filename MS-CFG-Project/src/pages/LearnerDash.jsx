import './LearnerDash.css';

export const IssueSelect = () => (
  <div className="issue-actions">
    <label>
      <select name="selectedIssue" defaultValue="outofdate">
        <option value="notoffered">No Longer Offered</option>
        <option value="outofdate">Outdated Exam Option</option>
        <option value="restriction">Program Restriction</option>
      </select>
    </label>
    <button>Report Issue</button>
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
  const data = [
    { exam: 'American Government', min: 63, credits: 3, modified: '12/5/2024' },
    { exam: 'Biology', min: 62, credits: 8, modified: '11/11/2024' },
    { exam: 'Calculus', min: 50, credits: 3, modified: '07/21/2023' },
  ];

  return (
    <div className="learner-bg">
      <h1>Learner Dashboard</h1>
      <div className="dash-grid">
        <SchoolCard title="The Ohio State" rows={data} />
        <SchoolCard title="University of Maryland Park College" rows={data} />
        <SchoolCard title="University of Delaware" rows={data} />
        <SchoolCard title="University of Cincinnati" rows={data} />
      </div>
    </div>
  );
};
