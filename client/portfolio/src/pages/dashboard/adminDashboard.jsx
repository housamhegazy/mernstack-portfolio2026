import React, { useState } from 'react';
import './adminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-wrapper py-5 text-white">
      <div className="container">
        <header className="mb-5 text-center">
          <h1 className="fw-bold text-gradient">Portfolio Control Center</h1>
          <p className="text-muted">Update your professional identity in real-time</p>
        </header>

        {/* 1. Personal Information Section */}
        <section className="admin-section mb-4 p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-info mb-0"><i className="bi bi-person-vcard me-2"></i>Personal Info</h3>
            <button className="btn btn-sm btn-outline-info px-4 rounded-pill">Edit Info</button>
          </div>
          <div className="row g-3">
            <div className="col-md-3"><small className="text-muted d-block">Full Name</small><span>Housam Admin</span></div>
            <div className="col-md-2"><small className="text-muted d-block">Age</small><span>25 Years</span></div>
            <div className="col-md-4"><small className="text-muted d-block">Education</small><span>Computer Science</span></div>
            <div className="col-md-3"><small className="text-muted d-block">University</small><span>Cairo University</span></div>
          </div>
        </section>

        {/* 2. Skills Management Section */}
        <section className="admin-section mb-4 p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-warning mb-0"><i className="bi bi-lightbulb me-2"></i>Professional Skills</h3>
            <button className="btn btn-sm btn-outline-warning px-4 rounded-pill">Add / Edit Skills</button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {['React', 'Node.js', 'MongoDB', 'Bootstrap', 'Redux'].map(skill => (
              <span key={skill} className="badge bg-dark border border-secondary p-2 px-3">{skill}</span>
            ))}
          </div>
        </section>

        {/* 3. Projects Management Section */}
        <section className="admin-section mb-4 p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-success mb-0"><i className="bi bi-folder-plus me-2"></i>Project Gallery</h3>
            <button className="btn btn-sm btn-outline-success px-4 rounded-pill">Add New Project</button>
          </div>
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tech Stack</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>E-commerce App</td>
                  <td>React, Firebase</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-link text-info p-0 me-2">Edit</button>
                    <button className="btn btn-sm btn-link text-danger p-0">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Contact & Social Links Section */}
        <section className="admin-section mb-4 p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-danger mb-0"><i className="bi bi-share me-2"></i>Contact & Socials</h3>
            <button className="btn btn-sm btn-outline-danger px-4 rounded-pill">Edit Links</button>
          </div>
          <div className="row g-3">
            <div className="col-md-4"><i className="bi bi-envelope me-2 text-muted"></i>geohousam@gmail.com</div>
            <div className="col-md-4"><i className="bi bi-linkedin me-2 text-muted"></i>linkedin.com/in/housam</div>
            <div className="col-md-4"><i className="bi bi-github me-2 text-muted"></i>github.com/housam</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;