import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAddprojectMutation, useDeleteProjectMutation, useEditProjectMutation } from "../../Redux/UserApi";

const Projects = ({ user }) => {
  const [addProject, { isLoading: isAdding }] = useAddprojectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [editProject, { isLoading: isEditing }] = useEditProjectMutation();

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveLink: "",
    category: "Web Development"
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user?.projects) setProjects(user.projects);
  }, [user]);

  // --- Functions ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // فتح مودال التعديل ببيانات المشروع المختارة
  const openEditModal = (proj) => {
    setEditingProjectId(proj._id);
    setFormData({
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies.join(", "),
      githubLink: proj.githubLink || "",
      liveLink: proj.liveLink || "",
      category: proj.category || "Web Development"
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const newProjectObj = {
      ...formData,
      technologies: formData.technologies.split(",").map(t => t.trim())
    };
    data.append("projectData", JSON.stringify(newProjectObj));
    if (selectedFile) data.append("projectImage", selectedFile);

    try {
      await addProject(data).unwrap();
      toast.success("New project added, Samsem!");
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add project");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const updatedObj = {
      ...formData,
      technologies: formData.technologies.split(",").map(t => t.trim())
    };
    data.append("updatedData", JSON.stringify(updatedObj));
    if (selectedFile) data.append("projectImage", selectedFile);

    try {
      await editProject({ projectId: editingProjectId, data }).unwrap();
      toast.success("Project updated successfully, Samsem!");
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المشروع يا سمسم؟")) {
      try {
        await deleteProject(projectId).unwrap();
        toast.info("تم حذف المشروع بنجاح");
      } catch (err) {
        toast.error("فشل حذف المشروع");
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", technologies: "", githubLink: "", liveLink: "", category: "Web Development" });
    setSelectedFile(null);
    setEditingProjectId(null);
  };

  return (
    <section className="admin-section mb-4 p-4 shadow-sm bg-dark rounded text-white border border-secondary">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-success mb-0"><i className="bi bi-folder-plus me-2"></i>Project Gallery</h3>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-sm btn-outline-success px-4 rounded-pill">
          Add New Project
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-hover mb-0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj._id} className="align-middle">
                <td>{proj.title}</td>
                <td><span className="badge bg-secondary">{proj.category}</span></td>
                <td className="text-end">
                  <button onClick={() => openEditModal(proj)} className="btn btn-sm btn-link text-info p-0 me-3">
                    <i className="bi bi-pencil-square"></i> Edit
                  </button>
                  <button onClick={() => handleDelete(proj?._id)} className="btn btn-sm btn-link text-danger p-0" disabled={isDeleting}>
                    <i className="bi bi-trash3"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL (Add / Edit) ================= */}
      {(showModal || showEditModal) && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-success">{showEditModal ? "Edit Project" : "Add New Project"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowModal(false); setShowEditModal(false); }}></button>
              </div>
              <form onSubmit={showEditModal ? handleUpdate : handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small">Project Title</label>
                      <input type="text" name="title" value={formData.title} className="form-control form-control-sm bg-secondary text-white border-0" required onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Category</label>
                      <select name="category" value={formData.category} className="form-select form-select-sm bg-secondary text-white border-0" onChange={handleInputChange}>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Description</label>
                      <textarea name="description" value={formData.description} rows="2" className="form-control form-control-sm bg-secondary text-white border-0" required onChange={handleInputChange}></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">GitHub Link</label>
                      <input type="url" name="githubLink" value={formData.githubLink} className="form-control form-control-sm bg-secondary text-white border-0" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Live Demo Link</label>
                      <input type="url" name="liveLink" value={formData.liveLink} className="form-control form-control-sm bg-secondary text-white border-0" onChange={handleInputChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Tech Stack (comma separated)</label>
                      <input type="text" name="technologies" value={formData.technologies} placeholder="React, Node, MongoDB" className="form-control form-control-sm bg-secondary text-white border-0" onChange={handleInputChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small text-warning">Project Image {showEditModal && "(Leave blank to keep current)"}</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm bg-secondary text-white border-0" onChange={handleFileChange} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setShowEditModal(false); }}>Cancel</button>
                  <button type="submit" className="btn btn-success px-5" disabled={isAdding || isEditing}>
                    {isAdding || isEditing ? "Processing..." : showEditModal ? "Update Project" : "Save Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};



export default Projects;

