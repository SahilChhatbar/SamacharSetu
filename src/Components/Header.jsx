import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import sam from "../assets/sam.png";

const Header = ({ onCategoryChange }) => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      const now = new Date();
      
      // Format date as DD-MM-YYYY
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = now.getFullYear();
      
      // Format time in 12-hour format with AM/PM
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? String(hours).padStart(2, '0') : '12'; // 12 AM/PM adjustment

      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
      
      setDateTime({ date: formattedDate, time: formattedTime });
    }, 1000);// Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
      <a 
        className="navbar-brand" 
        href="#" 
        onClick={(e) => {
          e.preventDefault(); 
          onCategoryChange('top-headlines');
        }}
      >
        <img
          src={sam}
          alt="Logo"
          className="img-fluid"
          style={{ width: '100px' }}
        />
      </a>   <div className="ms-5 text-dark fw-bold">
          <p className="mb-0">{dateTime.date || "Loading date..."}</p>
          <p className="mb-0">{dateTime.time || "Loading time..."}</p>
        </div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item me-3">
            <button 
              className="btn nav-link" 
              onClick={() => onCategoryChange('technology')}
            >
              <h5 className="this-text fw-bold text-dark">Technology</h5>
            </button>
          </li>
          <li className="nav-item me-3">
            <button 
              className="btn nav-link" 
              onClick={() => onCategoryChange('sports')}
            >
              <h5 className="this-text fw-bold text-dark">Sports</h5>
            </button>
          </li>
          <li className="nav-item me-3">
            <button 
              className="btn nav-link" 
              onClick={() => onCategoryChange('business')}
            >
              <h5 className="this-text fw-bold text-dark">Business</h5>
            </button>
          </li>
          <li className="nav-item me-3">
            <button 
              className="btn nav-link" 
              onClick={() => onCategoryChange('health')}
            >
              <h5 className="this-text fw-bold text-dark">Health</h5>
            </button>
          </li>
          <li className="nav-item me-3">
            <button 
              className="btn nav-link" 
              onClick={() => onCategoryChange('entertainment')}
            >
              <h5 className="this-text fw-bold text-dark">Entertainment</h5>
            </button>
          </li>
        </ul>
        {/* Display Date and Time */}
      
        {/* Google Translate Element */}
        <div id="google_translate_element" className="ms-3"></div>
      </div>
    </nav>
  );
};

export default Header;
