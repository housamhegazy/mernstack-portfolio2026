import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import { useSignOutMutation, useGetUserByNameQuery } from "../../Redux/UserApi";
import PersonalInfo from "./personalInfo";
import ProfisionalSkills from "./profissinalSkills";
import Projects from "./projects"
const AdminDashboard = () => {
  const { data: user, isLoading: isUserLoading } = useGetUserByNameQuery();
  const [signOut, { isLoading }] = useSignOutMutation();
  //========================= signout =====================================
  const handleSignout = async () => {
    try {
      await signOut().unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  //==============================================================
  return (
    <div className="admin-wrapper py-5 text-white">
      <div className="container">
        <header className="mb-5 text-center">
          <h1 className="fw-bold text-gradient">Portfolio Control Center</h1>
          <p className="text-muted">
            Update your professional identity in real-time
          </p>
          <button
            onClick={() => {
              handleSignout();
            }}
            className="btn btn-sm btn-outline-danger px-4 rounded-pill"
          >
            sign out
          </button>
        </header>
        {/* 1. Personal Information Section */}
        <PersonalInfo user={user} />

        {/* 2. ========================================== Skills Management Section =================================*/}
        <ProfisionalSkills user={user} />

        {/* 3. Projects Management Section */}
        <Projects user = {user}/>

        {/* 4. Contact & Social Links Section */}
        <section className="admin-section mb-4 p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-danger mb-0">
              <i className="bi bi-share me-2"></i>Contact & Socials
            </h3>
            <button className="btn btn-sm btn-outline-danger px-4 rounded-pill">
              Edit Links
            </button>
          </div>
          <div className="row g-3">
            <div className="col-md-4">
              <i className="bi bi-envelope me-2 text-muted"></i>
              geohousam@gmail.com
            </div>
            <div className="col-md-4">
              <i className="bi bi-linkedin me-2 text-muted"></i>
              linkedin.com/in/housam
            </div>
            <div className="col-md-4">
              <i className="bi bi-github me-2 text-muted"></i>github.com/housam
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
