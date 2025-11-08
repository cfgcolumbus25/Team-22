import React, { useState } from 'react';
import './LearnerDash.css'; 
import GradCapIcon from '../assets/grad-cap-icon.png';
import LocationIconImg from '../assets/location-icon.png';
import UpdateIconImg from '../assets/update-icon.png';
import ModernStateLogo from '../assets/Modern-State_logo.png';
import ListIconImg from '../assets/list-icon.jpg';
import UserIcon from '../assets/user-icon.png';


// Placeholder Data 
const collegeData = [
  { 
    name: 'Stanford University', 
    type: 'Private', 
    location: 'Stanford, CA', 
    scoresAccepted: '1,243', 
    lastUpdated: 'March 15, 2024', 
    description: 'A prestigious private research university known for its engineering and technology programs.',
    courses: [
      { name: 'American Government', minScore: 50, credits: 3 },
      { name: 'Biology', minScore: 50, credits: 6, highlighted: true },
      { name: 'Calculus', minScore: 50, credits: 4 },
      { name: 'Chemistry', minScore: 50, credits: 6 },
      { name: 'English Literature', minScore: 50, credits: 6, highlighted: true },
      { name: 'History of the United States I', minScore: 50, credits: 3 },
      { name: 'Psychology', minScore: 50, credits: 3 },
      { name: 'Spanish Language', minScore: 50, credits: 6 },
    ]
  },
  { 
    name: 'Massachusetts Institute of Technology', 
    type: 'Private', 
    location: 'Cambridge, MA', 
    scoresAccepted: '987', 
    lastUpdated: 'January 22, 2024', 
    description: 'A world-renowned institution specializing in science, technology, and research.',
    courses: [
      { name: 'Calculus', minScore: 55, credits: 8 },
      { name: 'Chemistry', minScore: 55, credits: 8, highlighted: true },
      { name: 'Physics', minScore: 55, credits: 8 },
      { name: 'Biology', minScore: 50, credits: 6 },
    ]
  },
  { 
    name: 'University of California, Berkeley', 
    type: 'Public', 
    location: 'Berkeley, CA', 
    scoresAccepted: '2,156', 
    lastUpdated: 'February 8, 2024', 
    description: 'A leading public university with strong programs across various disciplines.',
    courses: [
      { name: 'American Government', minScore: 50, credits: 3, highlighted: true },
      { name: 'Biology', minScore: 50, credits: 5 },
      { name: 'Calculus', minScore: 50, credits: 3 },
      { name: 'English Composition', minScore: 50, credits: 6 },
      { name: 'Psychology', minScore: 50, credits: 4, highlighted: true },
    ]
  },
  { 
    name: 'Georgia Institute of Technology', 
    type: 'Technical', 
    location: 'Atlanta, GA', 
    scoresAccepted: '1,834', 
    lastUpdated: 'April 3, 2024', 
    description: 'A top technical university focused on engineering and computing.',
    courses: [
      { name: 'Calculus', minScore: 50, credits: 4 },
      { name: 'Chemistry', minScore: 50, credits: 4 },
      { name: 'Physics', minScore: 50, credits: 4 },
    ]
  },
  { 
    name: 'University of Michigan', 
    type: 'Public', 
    location: 'Ann Arbor, MI', 
    scoresAccepted: '2,401', 
    lastUpdated: 'March 28, 2024', 
    description: 'A comprehensive public university with excellent academic programs.',
    courses: [
      { name: 'American Government', minScore: 50, credits: 3 },
      { name: 'Biology', minScore: 50, credits: 4 },
      { name: 'Calculus', minScore: 50, credits: 4 },
      { name: 'English Literature', minScore: 50, credits: 3 },
      { name: 'Psychology', minScore: 50, credits: 3 },
    ]
  },
  { 
    name: 'Carnegie Mellon University', 
    type: 'Private', 
    location: 'Pittsburgh, PA', 
    scoresAccepted: '1,102', 
    lastUpdated: 'February 19, 2024', 
    description: 'Known for computer science, robotics, and performing arts programs.',
    courses: [
      { name: 'Calculus', minScore: 50, credits: 10 },
      { name: 'Chemistry', minScore: 50, credits: 10 },
      { name: 'English Composition', minScore: 50, credits: 9 },
    ]
  },
  { 
    name: 'Harvard University', 
    type: 'Private', 
    location: 'Cambridge, MA', 
    scoresAccepted: '1,567', 
    lastUpdated: 'April 10, 2024', 
    description: 'One of the most prestigious Ivy League institutions in the world.',
    courses: [
      { name: 'American Government', minScore: 50, credits: 4 },
      { name: 'Biology', minScore: 50, credits: 8 },
      { name: 'Calculus', minScore: 50, credits: 8 },
      { name: 'English Literature', minScore: 50, credits: 8 },
    ]
  },
  { 
    name: 'University of Texas at Austin', 
    type: 'Public', 
    location: 'Austin, TX', 
    scoresAccepted: '3,245', 
    lastUpdated: 'March 5, 2024', 
    description: 'A large public research university with diverse academic offerings.',
    courses: [
      { name: 'American Government', minScore: 50, credits: 3 },
      { name: 'Biology', minScore: 50, credits: 6 },
      { name: 'Chemistry', minScore: 50, credits: 6 },
      { name: 'English Composition', minScore: 50, credits: 3 },
      { name: 'Psychology', minScore: 50, credits: 3 },
    ]
  },
  { 
    name: 'Cornell University', 
    type: 'Private', 
    location: 'Ithaca, NY', 
    scoresAccepted: '1,456', 
    lastUpdated: 'February 28, 2024', 
    description: 'An Ivy League university with strong engineering and agriculture programs.',
    courses: [
      { name: 'Biology', minScore: 50, credits: 8 },
      { name: 'Calculus', minScore: 50, credits: 8 },
      { name: 'Chemistry', minScore: 50, credits: 8 },
    ]
  },
  { 
    name: 'University of Washington', 
    type: 'Public', 
    location: 'Seattle, WA', 
    scoresAccepted: '2,789', 
    lastUpdated: 'April 1, 2024', 
    description: 'A leading public research university in the Pacific Northwest.',
    courses: [
      { name: 'American Government', minScore: 50, credits: 5 },
      { name: 'Biology', minScore: 50, credits: 5 },
      { name: 'English Composition', minScore: 50, credits: 5 },
      { name: 'Psychology', minScore: 50, credits: 5 },
    ]
  },
  { 
    name: 'California Institute of Technology', 
    type: 'Technical', 
    location: 'Pasadena, CA', 
    scoresAccepted: '654', 
    lastUpdated: 'January 30, 2024', 
    description: 'Elite technical institute specializing in science and engineering.',
    courses: [
      { name: 'Calculus', minScore: 65, credits: 9 },
      { name: 'Chemistry', minScore: 65, credits: 9 },
      { name: 'Physics', minScore: 65, credits: 9 },
    ]
  },
  { 
    name: 'Duke University', 
    type: 'Private', 
    location: 'Durham, NC', 
    scoresAccepted: '1,234', 
    lastUpdated: 'March 12, 2024', 
    description: 'A prestigious private university known for research and academics.',
    courses: [
      { name: 'American Government', minScore: 50, credits: 3 },
      { name: 'Biology', minScore: 50, credits: 4 },
      { name: 'Calculus', minScore: 50, credits: 4 },
      { name: 'English Literature', minScore: 50, credits: 3 },
      { name: 'Psychology', minScore: 50, credits: 3 },
    ]
  },
];


// College Card Component
const CollegeCard = ({ college, onClick }) => {
  let typeClass;
  // Determine styling class based on type
  if (college.type === 'Private') typeClass = 'type-private';
  else if (college.type === 'Public') typeClass = 'type-public';
  else if (college.type === 'Technical') typeClass = 'type-technical';

  return (
    <div className="college-card" onClick={() => onClick(college)}>
      <div className="card-header">
        <img src={GradCapIcon} alt="Graduation Cap" className="card-icon-img" />
        <span className={`college-type-tag ${typeClass}`}>{college.type}</span>
      </div>
      
      <h3 className="college-name">{college.name}</h3>

      <div className="card-details">
        <p className="detail-item">
          <img src={LocationIconImg} alt="Location" className="detail-icon-img" />
          {college.location}
        </p>
        <p className="detail-item">
          <img src={ListIconImg} alt="Scores" className="detail-icon-img list-icon-img" />
          <span className="scores-count">{college.scoresAccepted}</span> Scores Accepted
        </p>
        <p className="detail-item">
          <img src={UpdateIconImg} alt="Last Updated" className="detail-icon-img" />
          Last Updated {college.lastUpdated}
        </p>
      </div>
    </div>
  );
};


// Main Dashboard Component
const LearnerDash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [courseSearch, setCourseSearch] = useState('');

  const handleCardClick = (college) => {
    setSelectedCollege(college);
    setCourseSearch(''); // Reset course search when opening new popup
  };

  const handleClosePopup = () => {
    setSelectedCollege(null);
    setCourseSearch('');
  };

  // Filter courses based on search term
  const getFilteredCourses = () => {
    if (!selectedCollege || !selectedCollege.courses) return [];
    
    return selectedCollege.courses.filter(course =>
      course.name.toLowerCase().includes(courseSearch.toLowerCase())
    );
  };

  return (
    <div className="learner-dash-container">
      {/* 1. Top Navigation Bar (Blue) */}
      <header className="dash-header">
        <div className="header-logo">
          <img src={ModernStateLogo} alt="Modern State Logo" className="header-logo-img" />
        </div>
        <button className="header-login-btn">
          <img src={UserIcon} alt="User Login" className="user-icon-img" />
        </button>
      </header>

      {/* Main Content Area (Yellowish Background) */}
      <main className="dash-main-content">
        
        {/* 2. Dashboard Title */}
        <h1 className="dash-title">CLEP Learner Dashboard</h1>

        {/* 3. Search Bar */}
        <div className="search-bar-wrapper">
          <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search colleges by name, location, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* 4. College Cards Grid */}
        <div className="college-cards-grid">
          {collegeData.map((college) => (
            <CollegeCard key={college.name} college={college} onClick={handleCardClick} />
          ))}
        </div>
      </main>

      {/* Fixed Help Button */}
      <button className="help-button">?</button>

      {/* College Details Popup */}
      {selectedCollege && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={handleClosePopup}>×</button>
            <h2>{selectedCollege.name}</h2>
            <p className="popup-feedback-link">
              Is a score not up to date? <a href="#" className="feedback-link">Let us know!</a>
            </p>
            
            <div className="popup-details">
              <p className="popup-location"><strong>Location:</strong> {selectedCollege.location}</p>
              
              {/* Course Search Bar */}
              <div className="course-search-wrapper">
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="course-search-input"
                />
              </div>

              {/* Course List */}
              <div className="course-list">
                {getFilteredCourses().length > 0 ? (
                  getFilteredCourses().map((course, index) => (
                    <div key={index} className={`course-item ${course.highlighted ? 'course-highlighted' : ''}`}>
                      <div className="course-name">{course.name}</div>
                      <span className="course-score">CLEP Score: {course.minScore}</span>
                      <span className="course-credits">{course.credits} Credits</span>
                    </div>
                  ))
                ) : (
                  <p className="no-courses">No courses found</p>
                )}
              </div>
              
              {/* Disclaimer for highlighted courses */}
              <p className="course-disclaimer">*Highlighted scores may not be up to date</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerDash;
