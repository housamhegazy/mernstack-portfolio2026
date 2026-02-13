import React from "react";

const Projects = ({ user }) => {
  return (
    <section className="admin-section mb-4 p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-success mb-0">
          <i className="bi bi-folder-plus me-2"></i>Project Gallery
        </h3>
        <button className="btn btn-sm btn-outline-success px-4 rounded-pill">
          Add New Project
        </button>
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
                <button className="btn btn-sm btn-link text-info p-0 me-2">
                  Edit
                </button>
                <button className="btn btn-sm btn-link text-danger p-0">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Projects;
