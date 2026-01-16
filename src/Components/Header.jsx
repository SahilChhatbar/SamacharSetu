import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import sam from "../assets/sam.png";

const Header = ({ onCategoryChange }) => {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    const formatDate = (dateObj) => {
      const day = dateObj.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const year = dateObj.getFullYear();
      const suffix =
        day % 10 === 1 && day !== 11
          ? "st"
          : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
      return `${day}${suffix} ${monthNames[dateObj.getMonth()]} ${year}`;
    };

    const formatTime = (dateObj) => {
      let hours = dateObj.getHours();
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    };

    const interval = setInterval(() => {
      const now = new Date();
      setDateTime({
        date: formatDate(now),
        time: formatTime(now),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
      <button
        type="button"
        className="navbar-brand btn p-0"
        onClick={() => onCategoryChange("top-headlines")}
        aria-label="Home"
      >
        <img src={sam} alt="Logo" className="img-fluid" style={{ width: "100px" }} />
      </button>

      <div className="ms-5 text-dark fw-bold d-flex align-items-center">
        <div className="date-time-container text-center">
          <p className="mb-0 small">{dateTime.date || "Loading date..."}</p>
          <p className="mb-0 small">{dateTime.time || "Loading time..."}</p>
        </div>
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
          {["Technology", "Sports", "Business", "Health", "Entertainment"].map((category) => (
            <li className="nav-item me-3" key={category}>
              <button
                type="button"
                className="btn nav-link"
                onClick={() => onCategoryChange(category.toLowerCase())}
              >
                <h5 className="this-text fw-bold text-dark">{category}</h5>
              </button>
            </li>
          ))}
        </ul>
        <div id="google_translate_element" className="ms-3"></div>
      </div>
    </nav>
  );
};

export default Header;
