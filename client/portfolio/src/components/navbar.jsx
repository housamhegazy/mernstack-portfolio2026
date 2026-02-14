import React from 'react';
import { Link } from 'react-router-dom';
// ملاحظة: لو حابب تثبت مكتبة react-router-hash-link هتبقى أفضل، 
// بس حالياً هنعدلها لروابط داخلية سريعة.
import './navbar.css';
import { useSelector } from "react-redux";


const Navbar = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-custom sticky-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-gradient fs-4" to="/">
          Housam.DEV
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link mx-2" href="#personal-info">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-2" href="#skills">Skills</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-2" href="#projects">Projects</a>
            </li>
            
            <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
              <a className="btn btn-accent rounded-pill px-4 fw-bold" href="#contact">
                Contact Me
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;