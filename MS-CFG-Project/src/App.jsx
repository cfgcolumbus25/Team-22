import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { db } from './lib/firebase.js';
import './App.css';

function App() {
  const [docs, setDocs] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function testFirestore() {
      try {
        const querySnapshot = await getDocs(collection(db, "test"));
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        console.log("✅ Firestore test results:", results);
        setDocs(results);
      } catch (error) {
        console.error("❌ Error connecting to Firestore:", error);
      }
    }

    testFirestore();
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

      <div>
        <h1>Firestore Connection Test</h1>
        <p>Check the console to see if the Firestore read worked ✅</p>

        {docs.length > 0 ? (
          <ul>
            {docs.map((item) => (
              <li key={item.id}>
                <strong>{item.id}:</strong> {JSON.stringify(item)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents found yet.</p>
        )}
      </div>

      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
