import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import sam from "../assets/sam.png";

const Header = ({ onCategoryChange }) => {
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
      </a>
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
        {/* Google Translate Element */}
        <div id="google_translate_element" className="ms-3"></div>
      </div>
    </nav>
  );
};

export default Header;
