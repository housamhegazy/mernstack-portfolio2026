import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // يفضل استخدامه للتنبيهات
import { useUpdateSkillsMutation } from "../../Redux/UserApi.js";

const ProfisionalSkills = ({ user }) => {
  const [updateSkills, { isLoadingskills }] = useUpdateSkillsMutation();
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
    setSkills(skills.filter((s) => s !== skillToRemove));
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
  return (
    <section className="admin-section mb-4 p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-warning mb-0">
          <i className="bi bi-lightbulb me-2"></i>Professional Skills
        </h3>
        <button
          onClick={() => setSkillsModal(true)}
          className="btn btn-sm btn-outline-warning px-4 rounded-pill"
        >
          Add / Edit Skills
        </button>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {/* ✅ تعديل هنا: نعرض المهارات اللي جاية من الـ user */}
        {user?.professionalSkills?.length > 0 ? (
          user.professionalSkills.map((skill) => (
            <span
              key={skill}
              className="badge bg-dark border border-secondary p-2 px-3"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-muted small">No skills added yet</span>
        )}
      </div>
      {skillsModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 1060,
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg">
              {/* Modal Header */}
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-info d-flex align-items-center">
                  <i className="bi bi-cpu me-2"></i> Edit Professional Skills
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSkillsModal(false)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                {/* Input Area */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">
                    ADD NEW SKILL
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-0 shadow-none"
                      placeholder="Type skill and press Enter..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      className="btn btn-info px-4 fw-bold"
                      type="button"
                      onClick={handleAddSkill}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Skills Display Area */}
                <label className="form-label text-muted small fw-bold d-block">
                  YOUR SKILLS STACK
                </label>
                <div
                  className="p-3 rounded bg-black bg-opacity-50 border border-secondary"
                  style={{
                    minHeight: "120px",
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  <div className="d-flex flex-wrap gap-2">
                    {skills && skills.length > 0 ? (
                      skills.map((s, index) => (
                        <div
                          key={index}
                          className="badge bg-dark border border-info d-flex align-items-center gap-2 py-2 px-3 transition-all"
                          style={{ fontSize: "0.9rem", borderRadius: "8px" }}
                        >
                          <span>{s}</span>
                          <i
                            className="bi bi-x-circle-fill text-danger"
                            style={{ cursor: "pointer", fontSize: "1rem" }}
                            onClick={() => removeSkill(s)}
                            title="Remove Skill"
                          ></i>
                        </div>
                      ))
                    ) : (
                      <div className="text-center w-100 text-muted my-4">
                        <i className="bi bi-inbox d-block fs-2 mb-2"></i>
                        <span className="small italic">
                          No skills added yet. Start adding some!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-secondary bg-black bg-opacity-10">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-pill"
                  onClick={() => setSkillsModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-info px-5 rounded-pill fw-bold shadow-sm"
                  onClick={handleSave}
                  disabled={isLoadingskills}
                >
                  {isLoadingskills ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfisionalSkills;
