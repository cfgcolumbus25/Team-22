import { useState } from 'react'
import './App.css'
import  {LearnerDash} from './pages/LearnerDash';
import { Routes, Route, Navigate } from 'react-router-dom'
import LogInPage from './pages/LogInPage'
import InstitutionDash from './pages/InstitutionDash'
import MSAdminDash from './pages/MSAdminDash'

function App() {

  return (
      <div>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/institution" element={<InstitutionDash />} />
          <Route path="/learner" element={<LearnerDash />} />
          <Route path="/admin" element={<MSAdminDash />} />
        </Routes>
    </div>
  );
}

export default App
