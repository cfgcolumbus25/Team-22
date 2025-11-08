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
<<<<<<< HEAD
          <Route path="/" element={<Navigate to="/login" replace />} />
=======
>>>>>>> 567c4a2fe830e5c66284463af7194828e3c5ea08
          <Route path="/" element={<LogInPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/institution-dash" element={<InstitutionDash />} />
          <Route path="/learner" element={<LearnerDash />} />
          <Route path="/admin" element={<MSAdminDash />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    </div>
<<<<<<< HEAD


);
=======
  );
>>>>>>> 567c4a2fe830e5c66284463af7194828e3c5ea08
}

export default App

