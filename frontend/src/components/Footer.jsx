import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About LearnEdge</h3>
          <p>
            Your trusted learning partner for fast, clean, and reliable educational
            solutions.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/courses">Services</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: support@learnedge.com</p>
          <p>Phone: +91 7788911019</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-icon">
              f
            </a>
            <a href="#" className="social-icon">
              𝕏
            </a>
            <a href="#" className="social-icon">
              in
            </a>
            <a href="#" className="social-icon">
              ▶
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 LearnEdge. All rights reserved.</p>
      </div>
    </footer>
  );
}
