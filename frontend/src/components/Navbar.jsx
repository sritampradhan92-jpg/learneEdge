import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

// Inline SVG Logo Component
const LogoSvg = () => (
  <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" className="logo-img" style={{ width: '40px', height: '32px' }}>
    <ellipse cx="100" cy="35" rx="35" ry="8" fill="#1a2e4a"/>
    <polygon points="100,35 140,45 100,55 60,45" fill="#1a2e4a"/>
    <path d="M 75 45 Q 75 55 100 65 Q 125 55 125 45" fill="#1a2e4a" stroke="#1a2e4a" strokeWidth="1"/>
    <rect x="40" y="55" width="45" height="70" fill="#0099ff" rx="3"/>
    <line x1="45" y1="65" x2="80" y2="65" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="45" y1="75" x2="80" y2="75" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="45" y1="85" x2="80" y2="85" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="45" y1="95" x2="80" y2="95" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="45" y1="105" x2="80" y2="105" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="45" y1="115" x2="75" y2="115" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="95" y1="45" x2="85" y2="100" stroke="#ff9900" strokeWidth="3"/>
    <circle cx="85" cy="100" r="2" fill="#ff9900"/>
    <rect x="115" y="55" width="45" height="70" fill="#ff9900" rx="3"/>
    <line x1="120" y1="65" x2="155" y2="65" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="120" y1="75" x2="155" y2="75" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="120" y1="85" x2="155" y2="85" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="120" y1="95" x2="155" y2="95" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="120" y1="105" x2="155" y2="105" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="120" y1="115" x2="155" y2="115" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <g fill="#00ccff">
      <polygon points="160,25 162,30 167,32 162,34 160,39 158,34 153,32 158,30"/>
      <polygon points="180,45 181,48 184,49 181,50 180,53 179,50 176,49 179,48"/>
    </g>
    <polygon points="135,15 137,20 142,22 137,24 135,29 133,24 128,22 133,20" fill="#ff9900"/>
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const getActiveClass = ({ isActive }) => (isActive ? "active" : "");

  const handleToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={handleClose}>
          <LogoSvg />
          <span>LearnEdge</span>
        </Link>
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" className={getActiveClass} onClick={handleClose}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={getActiveClass}
              onClick={handleClose}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={getActiveClass}
              onClick={handleClose}
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={getActiveClass}
              onClick={handleClose}
            >
              Contact
            </NavLink>
          </li>
          <li>
            {isAuthenticated ? (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${isActive ? "active" : ""} btn-nav`
                }
                onClick={handleClose}
              >
                Dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${isActive ? "active" : ""} btn-nav`
                }
                onClick={handleClose}
              >
                Login
              </NavLink>
            )}
          </li>
        </ul>
        <div className="hamburger" onClick={handleToggle}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
