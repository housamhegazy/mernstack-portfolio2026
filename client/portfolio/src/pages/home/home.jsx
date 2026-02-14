import React, { useState } from "react";
import { useGetUserDataQuery } from "../../Redux/UserApi";
import { Link } from "react-router-dom";
const getSkillIcon = (skillName) => {
  const name = skillName.toLowerCase();

  // بنحدد الأيقونة بناءً على الكلمات المفتاحية في اسم المهارة
  if (name.includes("html"))
    return <i className="bi bi-filetype-html text-orange"></i>;
  if (name.includes("css"))
    return <i className="bi bi-filetype-css text-primary"></i>;
  if (name.includes("js") || name.includes("javascript"))
    return <i className="bi bi-patch-check-fill text-warning"></i>;
  if (name.includes("react"))
    return <i className="bi bi-cpu-fill text-info"></i>;
  if (name.includes("node"))
    return <i className="bi bi-hexagon-fill text-success"></i>;
  if (name.includes("mongo"))
    return <i className="bi bi-database-fill text-success"></i>;
  if (name.includes("redux"))
    return <i className="bi bi-reception-4 text-purple"></i>;
  if (name.includes("bootstrap"))
    return <i className="bi bi-bootstrap-fill text-purple"></i>;
  if (name.includes("git")) return <i className="bi bi-git text-danger"></i>;

  // أيقونة افتراضية لو ملقاش مهارة معروفة
  return <i className="bi bi-code-square text-accent"></i>;
};

const Home = () => {
  const { data: user, isLoading, isError } = useGetUserDataQuery();
  const [selectedProject, setSelectedProject] = useState(null);
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-deep-blue text-accent">
        <div className="spinner-border" role="status"></div>
        <span className="ms-3 fs-5">Loading Samsem's Awesome Portfolio...</span>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-deep-blue text-danger px-3 text-center">
        <h3>Error loading portfolio data. Please check your connection.</h3>
      </div>
    );
  }

  return (
    <div className="bg-deep-blue text-white min-vh-100 overflow-x-hidden">
      {/* 1. Hero / Personal Info Section */}
      <section
        id="personal-info"
        className="min-vh-100 d-flex align-items-center py-5 position-relative overflow-hidden"
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-gradient"
          style={{ opacity: 0.05, zIndex: -1 }}
        ></div>

        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            {/* الجزء الخاص بالصورة - يظهر أولاً في الموبايل */}
            <div className="col-lg-5 text-center order-1 order-lg-2">
              <div className="position-relative d-inline-block">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="img-fluid rounded-circle border border-accent border-4 shadow-lg"
                    style={{
                      width: "clamp(200px, 50vw, 320px)",
                      height: "clamp(200px, 50vw, 320px)",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="bg-secondary rounded-circle d-flex align-items-center justify-content-center border border-accent border-4"
                    style={{ width: "250px", height: "250px" }}
                  >
                    <i className="bi bi-person-fill display-1 text-dark"></i>
                  </div>
                )}
                <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-accent text-dark px-3 py-2 fw-bold shadow fs-7 fs-md-6">
                  {user.age} Years Old
                </span>
              </div>
            </div>

            {/* الجزء الخاص بالبيانات النصية */}
            <div className="col-lg-7 text-center text-lg-start order-2 order-lg-1">
              <p className="fs-6 fs-md-5 text-accent fw-medium mb-2">
                Welcome to my professional space
              </p>
              <h1 className="display-4 display-md-2 fw-bold text-white mb-2">
                I'm <span className="text-accent">{user.name || "Samsem"}</span>
              </h1>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 gap-md-3 mb-4 text-secondary small">
                <span className="d-flex align-items-center">
                  <i className="bi bi-envelope-at me-1 text-accent"></i>
                  {user.email}
                </span>
                <span className="d-flex align-items-center">
                  <i className="bi bi-mortarboard me-1 text-accent"></i>
                  {user.college}
                </span>
                <span className="d-flex align-items-center">
                  <i className="bi bi-building me-1 text-accent"></i>
                  {user.university}
                </span>
              </div>

              <p
                className="lead fs-6 fs-md-5 text-secondary mb-4 px-2 px-lg-0 pe-lg-5 text-center text-lg-start"
                style={{ lineHeight: "1.7" }}
              >
                {user.bio ||
                  "Crafting digital experiences with precision and passion."}
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                {user.cv && (
                  <a
                    href={user.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-accent px-4 py-3 rounded-pill fw-bold shadow-lg"
                  >
                    <i className="bi bi-file-earmark-pdf me-2"></i> Download CV
                  </a>
                )}
                <a
                  href="#projects"
                  className="btn btn-outline-light px-4 py-3 rounded-pill fw-bold shadow-lg"
                >
                  <i className="bi bi-grid me-2"></i> My Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Skills Section */}
      <section
        id="skills"
        className="py-5 bg-dark border-top border-bottom border-secondary"
      >
        <div className="container">
          <h2 className="text-center text-accent fw-bold mb-5 display-6 display-md-5">
            <span className="pb-2 border-bottom border-accent border-3">
              My Expertise
            </span>
          </h2>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
            {user.professionalSkills?.length > 0 ? (
              user.professionalSkills.map((skill, index) => (
                <div className="col" key={index}>
                  <div className="card h-100 bg-dark text-white border-accent transition skill-card">
                    <div className="card-body d-flex align-items-center justify-content-center py-3 py-md-4 gap-3">
                      {/* استدعاء وظيفة الأيقونة */}
                      <span className="fs-3">{getSkillIcon(skill)}</span>
                      <h6 className="card-title fw-bold mb-0 small text-uppercase">
                        {skill}
                      </h6>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-secondary">
                <p>No skills added yet.</p>
              </div>
            )}
          </div>
        </div>

        <style>
          {`
      .skill-card:hover {
        transform: translateY(-5px);
        background-color: #1e2533 !important;
        transition: all 0.3s ease;
      }
      .text-orange { color: #f06529; }
      .text-purple { color: #7952b3; }
    `}
        </style>
      </section>

      {/* 3. Projects Gallery Section */}
      <section id="projects" className="py-5">
        <div className="container">
          <h2 className="text-center text-accent fw-bold mb-5 display-6 display-md-5">
            <span className="pb-2 border-bottom border-accent border-3">
              Recent Projects
            </span>
          </h2>

          <div className="row g-4">
            {user.projects?.length > 0 ? (
              user.projects.map((project) => (
                <div className="col-12 col-md-6 col-lg-4" key={project._id}>
                  <div
                    className="card h-100 bg-dark border-accent shadow-sm overflow-hidden project-card-hover"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedProject(project)} // عند الضغط يفتح المودال
                    data-bs-toggle="modal"
                    data-bs-target="#projectModal"
                  >
                    {project.image?.url && (
                      <div style={{ height: "200px", overflow: "hidden" }}>
                        <img
                          src={project.image.url}
                          className="card-img-top w-100 h-100 transition"
                          alt={project.title}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="card-body p-3 text-center">
                      <h5 className="card-title text-accent fw-bold h6">
                        {project.title}
                      </h5>
                      <p className="text-secondary small">
                        Click to see full details
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-secondary">
                <p>No projects available.</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. الـ Modal (مكانه يكون بره الـ row) */}
        <div
          className="modal fade"
          id="projectModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-deep-blue border-accent text-white shadow-lg">
              {/* Modal Header */}
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-accent">
                  {selectedProject?.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-0">
                <div className="row g-0">
                  {/* الجزء الخاص بالصورة الكبيرة */}
                  <div className="col-lg-7">
                    <img
                      src={selectedProject?.image?.url}
                      alt={selectedProject?.title}
                      className="img-fluid w-100"
                      style={{
                        maxHeight: "500px",
                        objectFit: "contain",
                        backgroundColor: "#000",
                      }}
                    />
                  </div>

                  {/* الجزء الخاص بالتفاصيل */}
                  <div className="col-lg-5 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold mb-3 text-white border-bottom border-accent pb-2">
                        Description
                      </h4>
                      <p
                        className="text-secondary lead"
                        style={{ fontSize: "1rem", textAlign: "justify" }}
                      >
                        {selectedProject?.description}
                      </p>

                      <h5 className="fw-bold mt-4 text-accent">Tech Stack:</h5>
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {selectedProject?.technologies?.map((tech, i) => (
                          <span
                            style={{ whiteSpace: "normal", textAlign: "left" }}
                            key={i}
                            className="badge bg-secondary rounded-pill px-3 py-2"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* الروابط في أسفل المودال */}
                    <div className="d-flex gap-3 mt-4 pt-3 border-top border-secondary border-opacity-25">
                      {selectedProject?.githubLink && (
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-light flex-grow-1 py-2 fw-bold"
                        >
                          <i className="bi bi-github me-2"></i> GitHub Repo
                        </a>
                      )}
                      {selectedProject?.liveLink && (
                        <a
                          href={selectedProject.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-accent flex-grow-1 py-2 fw-bold text-dark"
                        >
                          <i className="bi bi-box-arrow-up-right me-2"></i> Live
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact Section */}
      <section
        id="contact"
        className="py-5 bg-dark border-top border-secondary"
      >
        <div className="container text-center px-4">
          <h2 className="text-accent fw-bold mb-4 display-6 display-md-5">
            Let's Connect
          </h2>
          <p className="text-secondary mb-5 small">
            Interested in working together? Reach out!
          </p>

          <div className="d-flex justify-content-center flex-wrap gap-4 fs-2 mb-5">
            {/* بنعمل Loop على مصفوفة السوشيال ميديا */}
            {user.socialLinks?.map((link, index) => {
              const formatUrl = (url) => {
                if (!url) return "#";
                return url.startsWith("http") ? url : `https://${url}`;
              };
              // بنحدد الأيقونة بناءً على اسم المنصة (platform)
              const platform = link.platform.toLowerCase();
              let iconClass = "bi bi-link-45deg"; // أيقونة افتراضية
              const brandColors = {
                github: "#ffffff", // أبيض أو أسود حسب الرغبة
                linkedin: "#0077b5", // أزرق لينكد إن
                facebook: "#1877f2", // أزرق فيسبوك
                whatsapp: "#25d366", // أخضر واتساب
                instagram: "#e4405f", // وردي انستجرام
                twitter: "#1da1f2", // أزرق تويتر
                x: "#ffffff", // أبيض لـ X
                youtube: "#ff0000", // أحمر يوتيوب
              };
              if (platform.includes("github")) iconClass = "bi bi-github";
              if (platform.includes("linkedin")) iconClass = "bi bi-linkedin";
              if (platform.includes("facebook")) iconClass = "bi bi-facebook";
              if (platform.includes("whatsapp")) iconClass = "bi bi-whatsapp";
              if (platform.includes("twitter") || platform.includes("x"))
                iconClass = "bi bi-twitter-x";
              if (platform.includes("instagram")) iconClass = "bi bi-instagram";

              return (
                <a
                  key={index}
                  href={formatUrl(link.url)} // استخدام الوظيفة هنا
                  target="_blank"
                  rel="noreferrer"
                  className="transition-hover"
                  title={link.platform}
                  style={{
                    color:
                      brandColors[
                        Object.keys(brandColors).find((key) =>
                          platform.includes(key),
                        )
                      ] || "#ffffff",
                    fontSize: "inherit",
                  }}
                >
                  <i className={iconClass}></i>
                </a>
              );
            })}
          </div>

          <a
            href={`mailto:${user.email}`}
            className="btn btn-accent btn-lg w-100 w-md-auto px-5 py-3 rounded-pill fw-bold text-dark"
          >
            <i className="bi bi-send me-2"></i> Email Me
          </a>
        </div>

        <style>
          {`
      .transition-hover {
        transition: transform 0.3s ease, color 0.3s ease;
      }
      .transition-hover:hover {
        transform: scale(1.2);
        color: #FFD700 !important; /* اللون الذهبي بتاعك */
      }
    `}
        </style>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center border-top border-secondary bg-deep-blue px-2">
        <p className="text-secondary mb-0 small">
          Made with ❤️ by{" "}
          <span className="text-accent fw-bold">{user?.name}</span>
        </p>
        {/* لينك مخفي أو بسيط للدخول لصفحة الأدمن */}
        <div className="mt-2">
          <Link
            to="/signin"
            className="text-secondary text-decoration-none"
            style={{ fontSize: "10px", opacity: 0.5, transition: "0.3s" }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.5)}
          >
            <i className="bi bi-lock-fill me-1"></i> Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
