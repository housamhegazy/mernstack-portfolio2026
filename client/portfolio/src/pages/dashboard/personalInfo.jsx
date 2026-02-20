import React, { useState, useEffect } from "react";
import { useUpdateProfileMutation } from "../../Redux/UserApi";
import { toast } from "react-toastify"; // يفضل استخدامه للتنبيهات
const PersonalInfo = ({ user }) => {
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
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
    if (user && showModal) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        age: user.age || "",
        college: user.college || "",
        university: user.university || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setAvatar(null);
      setCvFile(null);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };
  return (
    <section className="admin-section mb-4 p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-info mb-0 d-md-block fs-6 fs-md-3">
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
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-link text-info p-0 text-decoration-none"
                  download
                >
                  <i className="bi bi-file-earmark-pdf me-1"></i> View Current
                  CV
                </a>
              ) : (
                <span className="text-danger small">No CV Uploaded</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfo;
