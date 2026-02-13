import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import {
  useSignOutMutation,
  useGetUserByNameQuery,
  useUpdateProfileMutation,
} from "../../Redux/UserApi";
import { toast } from "react-toastify"; // يفضل استخدامه للتنبيهات
import { useUpdateSkillsMutation } from "../../Redux/UserApi.js";
const AdminDashboard = () => {
  const { data: user, isLoading: isUserLoading } = useGetUserByNameQuery();
  const [signOut, { isLoading }] = useSignOutMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateSkills ,{ isLoadingskills }] = useUpdateSkillsMutation();

  //========================= signout =====================================
  const handleSignout = async () => {
    try {
      await signOut().unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  //============================ open and close personal info model ========================================
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    age: "",
    college: "",
    university: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  // ملء البيانات عند فتح المودال
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        age: user.age || "",
        college: user.college || "",
        university: user.university || "",
      });
    }
  }, [user, showModal]);
  // ================================== send personal info ========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("bio", formData.bio);
    data.append("age", formData.age);
    data.append("college", formData.college);
    data.append("university", formData.university);
    if (avatar) data.append("avatar", avatar);
    if (cvFile) data.append("cvFile", cvFile);

    try {
      await updateProfile(data).unwrap();
      toast.success("Profile updated successfully!");
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };
  //============================= update skills ====================================
  //============================= open update skills modal ========================
  const [skills, setSkills] = useState([]);
  const [skillsModal, setSkillsModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  useEffect(() => {
  if (user?.professionalSkills) {
    setSkills(user.professionalSkills);
  }
}, [user]);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updated = [...skills, newSkill];
      setSkills(updated);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

const handleSave = async () => {
  try {
    await updateSkills(skills).unwrap();
    toast.success("تم تحديث المهارات بنجاح يا سمسم!"); // استخدم toast بدل alert
    setSkillsModal(false);
  } catch (err) {
    toast.error("حدث خطأ أثناء حفظ المهارات");
    console.error(err);
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
        {/* 1. Personal Information Section */}
        <section className="admin-section mb-4 p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-info mb-0">
              <i className="bi bi-person-vcard me-2"></i>Personal Info
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-sm btn-outline-info px-4 rounded-pill"
            >
              Edit Info
            </button>
          </div>
          {/* --- Bootstrap Modal --- */}
          {showModal && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content bg-dark text-white border-secondary">
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title">Edit Personal Information</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control bg-secondary text-white border-0"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Age</label>
                          <input
                            type="text"
                            className="form-control bg-secondary text-white border-0"
                            value={formData.age}
                            onChange={(e) =>
                              setFormData({ ...formData, age: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Bio</label>
                          <textarea
                            className="form-control bg-secondary text-white border-0"
                            rows="2"
                            value={formData.bio}
                            onChange={(e) =>
                              setFormData({ ...formData, bio: e.target.value })
                            }
                          ></textarea>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">College</label>
                          <input
                            type="text"
                            className="form-control bg-secondary text-white border-0"
                            value={formData.college}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                college: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">University</label>
                          <input
                            type="text"
                            className="form-control bg-secondary text-white border-0"
                            value={formData.university}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                university: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Profile Picture (Avatar)
                          </label>
                          <input
                            type="file"
                            className="form-control bg-secondary text-white border-0"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            accept="image/*"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">CV (PDF)</label>
                          <input
                            type="file"
                            className="form-control bg-secondary text-white border-0"
                            onChange={(e) => setCvFile(e.target.files[0])}
                            accept=".pdf"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-secondary">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-info px-5"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="row g-4 align-items-center">
            {/* عرض الصورة الشخصية */}
            <div className="col-md-2 text-center">
              <small className="text-muted d-block mb-2">Profile Picture</small>
              <img
                src={user?.avatar}
                alt="Profile"
                className="rounded-circle border border-info p-1"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            </div>

            <div className="col-md-10">
              <div className="row g-3">
                <div className="col-md-4">
                  <small className="text-muted d-block">Full Name</small>
                  <span className="fw-bold">{user?.name}</span>
                </div>
                <div className="col-md-8">
                  <small className="text-muted d-block">Bio</small>
                  <span>{user?.bio}</span>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">Age</small>
                  <span>{user?.age} Years</span>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">College</small>
                  <span>{user?.college}</span>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">University</small>
                  <span>{user?.university}</span>
                </div>
                {/* عرض حالة السي في */}
                <div className="col-md-3">
                  <small className="text-muted d-block">
                    Curriculum Vitae (CV)
                  </small>
                  {user?.cv ? (
                    <a
                      href={user.cv}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-link text-info p-0 text-decoration-none"
                      download
                    >
                      <i className="bi bi-file-earmark-pdf me-1"></i> View
                      Current CV
                    </a>
                  ) : (
                    <span className="text-danger small">No CV Uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ========================================== Skills Management Section =================================*/}
        <section className="admin-section mb-4 p-4 shadow-sm">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h3 className="text-warning mb-0">
      <i className="bi bi-lightbulb me-2"></i>Professional Skills
    </h3>
    <button onClick={() => setSkillsModal(true)} className="btn btn-sm btn-outline-warning px-4 rounded-pill">
      Add / Edit Skills
    </button>
  </div>
  <div className="d-flex flex-wrap gap-2">
    {/* ✅ تعديل هنا: نعرض المهارات اللي جاية من الـ user */}
    {user?.professionalSkills?.length > 0 ? (
      user.professionalSkills.map((skill) => (
        <span key={skill} className="badge bg-dark border border-secondary p-2 px-3">
          {skill}
        </span>
      ))
    ) : (
      <span className="text-muted small">No skills added yet</span>
    )}
  </div>
</section>
          {/* ============================================= skills modal ===================================== */}
      {/* ============================================= skills modal ===================================== */}

{/* ============================================= skills modal (Unified Style) ===================================== */}
{skillsModal && (
  <div
    className="modal fade show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}
  >
    <div className="modal-dialog modal-md modal-dialog-centered"> {/* جعلته في المنتصف ومقاس متوسط */}
      <div className="modal-content bg-dark text-white border-secondary shadow-lg">
        
        {/* Header - بنفس تنسيق مودال المعلومات الشخصية */}
        <div className="modal-header border-secondary">
          <h5 className="modal-title text-info">
            <i className="bi bi-lightbulb me-2"></i>Edit Professional Skills
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setSkillsModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          {/* قسم إضافة مهارة جديدة */}
          <div className="mb-4">
            <label className="form-label text-muted small">Add New Skill</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                placeholder="e.g. React, Node.js..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <button 
                className="btn btn-info" 
                type="button" 
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>
          </div>

          {/* قسم عرض المهارات المضافة */}
          <label className="form-label text-muted small d-block">Current Skills (Click × to remove)</label>
          <div 
            className="p-3 rounded bg-black bg-opacity-25 border border-secondary"
            style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
          >
            <div className="d-flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map(s => (
                  <span 
                    key={s} 
                    className="badge bg-secondary border border-info d-flex align-items-center gap-2 py-2 px-3"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {s}
                    <i 
                      className="bi bi-x-lg text-danger" 
                      style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                      onClick={() => removeSkill(s)}
                    ></i>
                  </span>
                ))
              ) : (
                <div className="text-center w-100 text-muted my-3 italic">
                  No skills added yet...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - بنفس التنسيق */}
        <div className="modal-footer border-secondary">
          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => setSkillsModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-info px-5"
            onClick={handleSave}
            disabled={isLoadingskills}
          >
            {isLoadingskills ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : "Save All Skills"}
          </button>
        </div>

      </div>
    </div>
  </div>
)}
        {/* =============================================== end skills ========================================== */}
        {/* 3. Projects Management Section */}
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
