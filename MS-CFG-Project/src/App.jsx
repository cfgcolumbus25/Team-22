// MS-CFG-Project/src/App.jsx
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COLLEGE_ID = "collegeId"; // your doc id shown in Firestore

export default function App() {
  const [college, setCollege] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); // keep the demo counter if you want

  async function loadData() {
    setLoading(true);
    const [cRes, eRes] = await Promise.all([
      fetch(`${API}/api/colleges/${COLLEGE_ID}`),
      fetch(`${API}/api/colleges/${COLLEGE_ID}/exams`),
    ]);
    const cData = await cRes.json();
    const eData = await eRes.json();
    setCollege(cData);
    setExams(Array.isArray(eData) ? eData : []);
    setLoading(false);
  }

  // Example “write via backend”: upsert one exam
  async function upsertExampleExam() {
    await fetch(`${API}/api/colleges/${COLLEGE_ID}/exams/american-government`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "American Government",
        minimumScore: 56,
        creditsTranscribed: 3.0,
        transcriptCharge: null,
        clepUrl:
          "https://registrar.osu.edu/prior-learning-assessment/examination-credit/college-level-examination-program-clep/",
        acceptanceLastModified: "2024-12-06T00:00:00Z",
      }),
    });
    await loadData();
  }

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Firestore via Backend API</h1>
      <p style={{ opacity: 0.8 }}>
        Reading from <code>{API}/api</code>
      </p>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <pre style={{ textWrap: "wrap" }}>
            <strong>college:</strong> {JSON.stringify(college)}
          </pre>

          <h3>Exams</h3>
          {exams.length === 0 ? (
            <p>No exams yet.</p>
          ) : (
            <ul>
              {exams.map((x) => (
                <li key={x.id}>
                  <strong>{x.name}</strong> — min score {x.minimumScore}, credits{" "}
                  {x.creditsTranscribed}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <div className="card" style={{ display: "flex", gap: 16 }}>
        <button onClick={() => setCount((n) => n + 1)}>count is {count}</button>
        <button onClick={upsertExampleExam}>Write via Backend</button>
      </div>
    </>
  );
}
