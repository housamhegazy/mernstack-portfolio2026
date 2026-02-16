import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUpdateSocialLinksMutation } from "../../Redux/UserApi";

const SocialLinks = ({ user }) => {
  const [updateSocialLinks, { isLoading: isUpdating }] =
    useUpdateSocialLinksMutation();
  const [socialLinks, setSocialLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    if (user?.socialLinks) {
      setSocialLinks(user.socialLinks);
    }
  }, [user]);

  // دالة لجلب الأيقونة
  const getIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes("linkedin")) return "bi-linkedin";
    if (p.includes("github")) return "bi-github";
    if (p.includes("facebook")) return "bi-facebook";
    if (p.includes("instagram")) return "bi-instagram";
    if (p.includes("twitter") || p.includes(" x")) return "bi-twitter-x";
    if (
      p.includes("whatsapp") ||
      p.includes("wa.me") ||
      p.includes("api.whatsapp")
    ) {
      return "bi-whatsapp";
    }
    return "bi-link-45deg";
  };

  // إضافة رابط جديد للقائمة المؤقتة
  const handleAddLink = () => {
    if (newPlatform && newUrl) {
      setSocialLinks([...socialLinks, { platform: newPlatform, url: newUrl }]);
      setNewPlatform("");
      setNewUrl("");
    } else {
      toast.warn("برجاء إدخال المنصة والرابط يا سمسم!");
    }
  };

  // حذف رابط من القائمة المؤقتة
  const removeLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  // حفظ الكل في الداتابيز
  const handleSaveAll = async () => {
    try {
      // بنبعت المصفوفة مباشرة والـ Mutation هيغلفها في body
      await updateSocialLinks(socialLinks).unwrap();
      toast.success("All links updated, Samsem!");
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <section className="admin-section mb-4 p-4 shadow-sm bg-dark text-white rounded border border-secondary">
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
        <h3 className="text-danger mb-0">
          <i className="bi bi-share me-2"></i>Contact & Socials
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-sm btn-outline-danger px-4 rounded-pill"
        >
          Edit Links
        </button>
      </div>

      <div className="row g-3">
        {socialLinks.length > 0 ? (
          socialLinks.map((link, index) => (
            <div className="col-md-4" key={index}>
              <div className="p-2 border border-secondary rounded bg-black bg-opacity-25 d-flex align-items-center">
                <i
                  className={`bi ${getIcon(link.platform)} me-2 text-danger fs-5`}
                ></i>
                <div className="text-truncate">
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {link.platform}
                  </small>
                  <span className="small text-white-50">
                    {link.url.replace(/(^\w+:|^)\/\//, "")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted small text-center py-3">
            No links added yet.
          </div>
        )}
      </div>

      {/* ======================= Social Links Modal ======================= */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-danger">
                  <i className="bi bi-pencil-square me-2"></i>Edit Social Links
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Inputs to Add New */}
                <div className="bg-black bg-opacity-25 p-3 rounded mb-3 border border-secondary">
                  <div className="row g-2">
                    <div className="col-5">
                      <input
                        type="text"
                        className="form-control form-control-sm bg-secondary text-white border-0"
                        placeholder="Platform (e.g. GitHub)"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                      />
                    </div>
                    <div className="col-5">
                      <input
                        type="text"
                        className="form-control form-control-sm bg-secondary text-white border-0"
                        placeholder="URL"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                      />
                    </div>
                    <div className="col-2">
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={handleAddLink}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of current links in modal */}
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {socialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center justify-content-between p-2 mb-2 bg-secondary bg-opacity-25 rounded border border-secondary"
                    >
                      <div className="d-flex align-items-center">
                        <i
                          className={`bi ${getIcon(link.platform)} me-2 text-info`}
                        ></i>
                        <span className="small">{link.platform}</span>
                      </div>
                      <button
                        onClick={() => removeLink(index)}
                        className="btn btn-sm text-danger shadow-none"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer border-secondary">
                <button
                  className="btn btn-secondary px-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger px-5"
                  onClick={handleSaveAll}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save All Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialLinks;
