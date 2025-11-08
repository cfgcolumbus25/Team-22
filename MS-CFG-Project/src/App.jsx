import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LogInPage from './pages/LogInPage' 
import InstitutionDash from './pages/InstitutionDash'
import LearnerDash from './pages/LearnerDash'
import MSAdminDash from './pages/MSAdminDash'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/institution" element={<InstitutionDash />} />
          <Route path="/learner" element={<LearnerDash />} />
          <Route path="/admin" element={<MSAdminDash />} />
        </Routes>
    </div>
  )
}

export default App
