import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import logoSvg from "../../logo.svg";

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
          <img src={logoSvg} alt="LearnEdge Logo" className="logo-img" />
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
