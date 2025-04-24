import React from 'react';
import sam from "../assets/sam.png";

const Footer = () => {
  return (
    <footer className="bg-light text-black text-center px-5 py-2">
  <div className="container d-flex align-items-center justify-content-center text-start gap-2">
    <img
      src={sam}
      alt="Logo"
      className="img-fluid me-3"
      style={{ width: "90px" }}
    />
    <div>
      <h5 className="mb-2">Your one place for news and updates</h5>
      <p className="mb-0">with AI-powered summary.</p>
    </div>
  </div>
</footer>

  );
};

export default Footer;
