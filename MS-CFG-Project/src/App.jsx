import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MSAdminDash from './pages/MSAdminDash'; 




function App() {

  // for MSAdminDash   
  return (
   <MSAdminDash  >


    
   </MSAdminDash  >
   
    // <BrowserRouter>
    //   <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
    //     {/* Navigation links */}
    //     <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
    //     <Link to="/MSAdmin">MSAdmin Dashboard</Link>
    //   </nav>

    //   <Routes>
    //     <Route
    //       path="/"
    //       element={
    //         <div style={{ padding: '2rem' }}>
    //           <h1>Welcome to Modern States Tool</h1>
    //           <p>This is your home page. Click MSAdmin Dashboard” to navigate.</p>
    //         </div>
    //       }
    //     />
    //     <Route path="/MSAdmin  " element={<MSAdminDash   />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
