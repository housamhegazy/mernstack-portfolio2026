import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import { useSignOutMutation, useGetUserByNameQuery } from "../../Redux/UserApi";
import PersonalInfo from "./personalInfo";
import ProfisionalSkills from "./profissinalSkills";
import Projects from "./projects"
import SocialLinks from "./socialLinks";
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
        <SocialLinks user = {user}/>
      </div>
    </div>
  );
};

export default AdminDashboard;
