import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BRAND_NAME } from "../branding";
import { ReactComponent as Logo } from "../assets/logo-ghost.svg";
import "./NavBar.css";

const navItems = [
  { to: "/assessment", label: "Assessment" },
  { to: "/relax", label: "Relax" },
  { to: "/exposure", label: "Exposure" },
  { to: "/journal", label: "Journal" },
  { to: "/progress", label: "Progress" },
];

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);

  // Close mobile menu when route changes or when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Close menu on route change
    setIsMenuOpen(false);
    
    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]);

  return (
    <header className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-icon">
            <Logo className="logo" />
          </div>
          <span className="brand-title">{BRAND_NAME}</span>
        </NavLink>

        {/* Mobile menu button */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Navigation links */}
        <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
          <nav className="navbar-links">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <NavLink 
              to="/therapist" 
              className={({ isActive }) => `navbar-link mobile-cta${isActive ? " active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>AI Guide</span>
              <span className="emoji">👋</span>
            </NavLink>
          </nav>
          <NavLink to="/therapist" className="navbar-cta">
            <span>AI Guide</span>
            <span className="emoji">👋</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default NavBar;