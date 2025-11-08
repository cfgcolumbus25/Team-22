import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LogInPage from './pages/LogInPage'
import InstitutionDash from './pages/InstitutionDash'
import LearnerDash from './pages/LearnerDash'
import MSAdminDash from './pages/MSAdminDash'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/institution-dash" element={<InstitutionDash />} />
          <Route path="/learner" element={<LearnerDash />} />
          <Route path="/admin" element={<MSAdminDash />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    </div>

)
}

export default App

