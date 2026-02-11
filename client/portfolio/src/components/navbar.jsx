import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-custom sticky-top">
      <div className="container">
        {/* Logo / Brand Name */}
        <Link className="navbar-brand fw-bold text-gradient" to="/">
          SEMSUM.DEV
        </Link>

        {/* Mobile Toggle Button */}
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
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link mx-2" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link mx-2" to="/projects">Projects</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link mx-2" to="/about">About</Link>
            </li>
            {/* Call to Action Button */}
            <li className="nav-item ms-lg-3">
              <Link className="btn btn-outline-primary rounded-pill px-4" to="/contact">
                Contact Me
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;