import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css'; // Don't forget to create this CSS file!

// --- Placeholder Data ---
const studentData = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  basicInfo: {
    dob: 'January 15, 2005',
    grade: '12th Grade',
    highSchool: 'Lincoln High School',
    gpa: '3.85',
  },
  targetUniversities: [
    { name: 'University of California, Berkeley', status: 'Reach' },
    { name: 'University of Michigan', status: 'Target' },
    { name: 'Boston University', status: 'Target' },
    { name: 'University of Washington', status: 'Safety' },
  ],
  clepExamScores: [
    { exam: 'College Composition', score: 65, date: 'Sep 14, 2024', status: 'Passed', credits: 6 },
    { exam: 'American Government', score: 72, date: 'Oct 19, 2024', status: 'Passed', credits: 3 },
    { exam: 'College Algebra', score: 58, date: 'Nov 4, 2024', status: 'Passed', credits: 3 },
    { exam: 'Biology', score: 68, date: 'Jan 11, 2025', status: 'Passed', credits: 6 },
  ],
};

// --- Main Student Profile Component ---
const StudentProfile = () => {
  const { name, email, basicInfo, targetUniversities, clepExamScores } = studentData;

  // Function to get initials for the avatar
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[1][0];
    }
    return parts[0][0];
  };

  return (
    <div className="student-profile-container">
      {/* 1. Header Section */}
      <header className="profile-header-card">
        <div className="avatar">{getInitials(name)}</div>
        <div className="header-info">
          <h2 className="student-name">{name}</h2>
          <p className="student-email">{email}</p>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="profile-content-grid">
        {/* 2. Basic Information Card */}
        <div className="info-card basic-info-card">
          <h3>Basic Information</h3>
          <div className="info-item">
            <div>
              <p className="info-label">Date of Birth</p>
              <p className="info-value">{basicInfo.dob}</p>
            </div>
          </div>
          <div className="info-item">
            <div>
              <p className="info-label">Grade</p>
              <p className="info-value">{basicInfo.grade}</p>
            </div>
          </div>
          <div className="info-item">
            <div>
              <p className="info-label">High School</p>
              <p className="info-value">{basicInfo.highSchool}</p>
            </div>
          </div>
          <div className="info-item">
            <div>
              <p className="info-label">GPA</p>
              <p className="info-value">{basicInfo.gpa}</p>
            </div>
          </div>
        </div>

        {/* 3. Target Universities Card */}
        <div className="info-card target-universities-card">
          <h3>Target Universities</h3>
          {targetUniversities.map((uni, index) => (
            <div key={index} className="university-item">
              <p className="university-name">{uni.name}</p>
              <span className={`university-status-tag status-${uni.status.toLowerCase()}`}>
                {uni.status}
              </span>
            </div>
          ))}
        </div>

        {/* 4. CLEP Exam Scores Table */}
        <div className="info-card exam-scores-card">
          <div className="exam-scores-header">
            <h3>CLEP Exam Scores</h3>
            <p className="total-credits">
              Total Credits: {clepExamScores.reduce((acc, curr) => acc + curr.credits, 0)}
            </p>
          </div>
          
          <table className="exam-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Score</th>
                <th>Date</th>
                <th>Status</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {clepExamScores.map((exam, index) => (
                <tr key={index}>
                  <td>{exam.exam}</td>
                  <td>{exam.score}</td>
                  <td>{exam.date}</td>
                  <td>
                    <span className="exam-status-tag passed">
                        {exam.status}
                    </span>
                  </td>
                  <td>{exam.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;