import React, { useState, useMemo } from "react";
import { useGetUserDataQuery } from "../../Redux/UserApi";
import { Link } from "react-router-dom";
import "./home.css";
import LoadingPage from "../loadingPage";

// 1. استخراج الأيقونات خارج المكون لمنع إعادة التعريف في كل Render
const SKILL_CONFIG = {
  html: { icon: "bi-filetype-html", color: "text-orange" },
  css: { icon: "bi-filetype-css", color: "text-primary" },
  js: { icon: "bi-patch-check-fill", color: "text-warning" },
  javascript: { icon: "bi-patch-check-fill", color: "text-warning" },
  react: { icon: "bi-cpu-fill", color: "text-info" },
  node: { icon: "bi-hexagon-fill", color: "text-success" },
  mongo: { icon: "bi-database-fill", color: "text-success" },
  redux: { icon: "bi-reception-4", color: "text-purple" },
  bootstrap: { icon: "bi-bootstrap-fill", color: "text-purple" },
  git: { icon: "bi-git", color: "text-danger" },
};

const getSkillIcon = (skillName) => {
  const name = skillName.toLowerCase();
  const match = Object.keys(SKILL_CONFIG).find((key) => name.includes(key));
  const config = SKILL_CONFIG[match] || { icon: "bi-code-square", color: "text-accent" };
  return <i className={`bi ${config.icon} ${config.color}`}></i>;
};

const Home = () => {
  const { data: user, isLoading, isError } = useGetUserDataQuery();
  const [selectedProject, setSelectedProject] = useState(null);

  // تحسين الأداء في معالجة روابط السوشيال ميديا
  const brandColors = {
    github: "#ffffff", linkedin: "#0077b5", facebook: "#1877f2",
    whatsapp: "#25d366", instagram: "#e4405f", twitter: "#1da1f2", x: "#ffffff"
  };

  if (isLoading) {
    return (
      <LoadingPage/>
    );
  }

  if (isError || !user) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-deep-blue text-white p-4">
        <div className="text-center border border-danger p-5 rounded-4 bg-dark">
          <i className="bi bi-exclamation-triangle display-1 text-danger"></i>
          <h3 className="mt-3">Oops! Connection Lost</h3>
          <p className="text-secondary">We couldn't fetch your brilliant work.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deep-blue text-white min-vh-100">
      {/* --- HERO SECTION --- */}
      <section id="personal-info" className="hero-section d-flex align-items-center position-relative">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            {/* Avatar Column */}
            <div className="col-lg-5 text-center order-1 order-lg-2">
              <div className="avatar-wrapper">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="img-fluid rounded-circle profile-img shadow-2xl"
                  />
                ) : (
                  <div className="avatar-placeholder rounded-circle mx-auto">
                    <i className="bi bi-person-fill display-1"></i>
                  </div>
                )}
                <div className="age-badge">{user.age} Years Old</div>
              </div>
            </div>

            {/* Content Column */}
            <div className="col-lg-7 text-center text-lg-start order-2 order-lg-1">
              <h5 className="text-accent fw-bold text-uppercase tracking-widest mb-3">Professional Portfolio</h5>
              <h1 className="hero-title fw-bold mb-3">
                I'm <span className="text-gradient">{user.name || "Samsem"}</span>
              </h1>
              
              <div className="info-chips d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 mb-4">
                <span className="chip"><i className="bi bi-envelope-at me-2"></i>{user.email}</span>
                <span className="chip"><i className="bi bi-mortarboard me-2"></i>{user.college}</span>
              </div>

              <p className="hero-bio mb-5">{user.bio || "Crafting digital excellence."}</p>

              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                {user.cv && (
                  <a href={user.cv} target="_blank" rel="noreferrer" className="btn btn-accent-custom px-5 py-3 rounded-pill fw-bold">
                    <i className="bi bi-file-earmark-pdf-fill me-2"></i>Download CV
                  </a>
                )}
                <a href="#projects" className="btn btn-outline-custom px-5 py-3 rounded-pill fw-bold">
                  <i className="bi bi-grid-fill me-2"></i>View Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="py-100 bg-dark-soft">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="display-5 fw-bold text-white mb-3">My <span className="text-accent">Expertise</span></h2>
            <div className="header-line mx-auto"></div>
          </div>
          
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
            {user.professionalSkills?.map((skill, index) => (
              <div className="col" key={index}>
                <div className="skill-card-v2 h-100">
                  <div className="icon-box mb-3">{getSkillIcon(skill)}</div>
                  <h6 className="skill-name">{skill}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROJECTS GALLERY --- */}
      <section id="projects" className="py-100">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="display-5 fw-bold text-white mb-3">Recent <span className="text-accent">Projects</span></h2>
            <div className="header-line mx-auto"></div>
          </div>

          <div className="row g-4">
            {user.projects?.map((project) => (
              <div className="col-12 col-md-6 col-lg-4" key={project._id}>
                <div 
                  className="project-glass-card h-100"
                  onClick={() => setSelectedProject(project)}
                  data-bs-toggle="modal"
                  data-bs-target="#projectModal"
                >
                  <div className="img-container">
                    <img src={project.image?.url} alt={project.title} className="project-img" />
                    <div className="img-overlay">
                      <span className="btn btn-sm btn-light rounded-pill">View Details</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="text-accent fw-bold mb-2">{project.title}</h5>
                    <div className="d-flex flex-wrap gap-1 mt-2">
                        {project.technologies?.slice(0, 3).map((t, i) => (
                            <span key={i} className="badge bg-dark-accent" style={{fontSize: '10px'}}>{t}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REFINED MODAL --- */}
      <div className="modal fade" id="projectModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-xl modal-dialog-centered">
    <div className="modal-content project-modal-content border-0 overflow-hidden shadow-2xl">
      <div className="modal-body p-0">
        {/* زر الإغلاق المطور */}
        <button type="button" className="btn-close-custom" data-bs-dismiss="modal">
          <i className="bi bi-x-lg"></i>
        </button>

        {/* g-0 بتشيل المسافات بين الأعمدة عشان التصميم يلحم في بعضه */}
        <div className="row g-0 align-items-center bg-deep-blue">
          
          {/* جزء الصورة: واخد 7 من 12 في الشاشات الكبيرة */}
          <div className="col-lg-7 bg-black d-flex align-items-center justify-content-center p-0">
            <div className="modal-img-container w-100">
              <img 
                src={selectedProject?.image?.url} 
                alt={selectedProject?.title} 
                className="img-fluid modal-main-img" 
              />
            </div>
          </div>

          {/* جزء البيانات: واخد 5 من 12 في الشاشات الكبيرة */}
          <div className="col-lg-5 p-4 p-md-5">
            <div className="project-details-content">
              <h3 className="text-accent fw-bold mb-3 display-6">{selectedProject?.title}</h3>
              
              <hr className="border-secondary opacity-25 mb-4" />

              <div className="mb-4">
                <label className="text-secondary small text-uppercase fw-bold mb-2 d-block tracking-wider">
                  <i className="bi bi-card-text me-2"></i>Project Overview
                </label>
                <p className="modal-description text-light-gray">{selectedProject?.description}</p>
              </div>

              <div className="mb-5">
                <label className="text-secondary small text-uppercase fw-bold mb-2 d-block tracking-wider">
                  <i className="bi bi-stack me-2"></i>Tech Stack
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedProject?.technologies?.map((tech, i) => (
                    <span key={i} className="tech-tag-v2">{tech}</span>
                  ))}
                </div>
              </div>

              {/* الأزرار في الأسفل */}
              <div className="row g-3">
                <div className="col-sm-6">
                  <a href={selectedProject?.githubLink} target="_blank" rel="noreferrer" className="btn btn-outline-light w-100 py-2 fw-bold rounded-pill action-btn">
                    <i className="bi bi-github me-2"></i>GitHub
                  </a>
                </div>
                <div className="col-sm-6">
                  <a href={selectedProject?.liveLink} target="_blank" rel="noreferrer" className="btn btn-accent-custom w-100 py-2 fw-bold rounded-pill action-btn">
                    <i className="bi bi-eye-fill me-2"></i>Live Demo
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-100 bg-dark-soft text-center">
        <div className="container">
          <h2 className="display-6 fw-bold text-accent mb-4">Let's Create Something Great</h2>
          <div className="social-links-v2 d-flex justify-content-center flex-wrap gap-4 mb-5">
            {user.socialLinks?.map((link, index) => {
              const platform = link.platform.toLowerCase();
              const color = brandColors[Object.keys(brandColors).find(k => platform.includes(k))] || "#fff";
              return (
                <a key={index} href={link.url} target="_blank" rel="noreferrer" className="social-icon" style={{ '--brand-color': color }}>
                  <i className={`bi bi-${platform === 'x' ? 'twitter-x' : platform}`}></i>
                </a>
              );
            })}
          </div>
          <a href={`mailto:${user.email}`} className="btn btn-accent-custom btn-lg px-5 py-3 rounded-pill fw-bold">
            <i className="bi bi-envelope-paper-fill me-2"></i>Start a Conversation
          </a>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-5 text-center bg-deep-blue border-top border-dark">
        <p className="text-secondary small">© {new Date().getFullYear()} - Handcrafted by <span className="text-accent">{user.name}</span></p>
        <Link to="/signin" className="admin-link mt-2 d-inline-block text-decoration-none">
          <i className="bi bi-lock-fill me-1"></i>Secure Area
        </Link>
      </footer>

      {/* --- INTERNAL CSS (Optimized for Large & Small Screens) --- */}
      <style>{`
        :root {
          --accent-color: #FFD700;
          --bg-dark: #0a192f;
          --bg-soft: #112240;
        }

        .bg-deep-blue { background-color: var(--bg-dark); }
        .bg-dark-soft { background-color: var(--bg-soft); }
        .text-accent { color: var(--accent-color); }
        .py-100 { padding-top: 100px; padding-bottom: 100px; }
        
        /* Hero Styling */
        .hero-section { min-vh: 100vh; padding-top: 80px; }
        .hero-title { font-size: clamp(2.5rem, 8vw, 4.5rem); }
        .hero-bio { font-size: clamp(1rem, 2vw, 1.25rem); color: #8892b0; max-width: 600px; }
        .text-gradient { background: linear-gradient(45deg, var(--accent-color), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .profile-img {
          width: clamp(250px, 40vw, 400px);
          height: clamp(250px, 40vw, 400px);
          object-fit: cover;
          border: 4px solid var(--accent-color);
          padding: 10px;
        }

        .chip { background: rgba(255,215,0,0.1); padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; border: 1px solid rgba(255,215,0,0.2); color: #ccd6f6; }

        /* Buttons */
        .btn-accent-custom { background: var(--accent-color); color: #000; transition: 0.3s; border: none; }
        .btn-accent-custom:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,215,0,0.2); }
        .btn-outline-custom { border: 2px solid var(--accent-color); color: var(--accent-color); transition: 0.3s; }
        .btn-outline-custom:hover { background: var(--accent-color); color: #000; }

        /* Skill Cards */
        .skill-card-v2 { background: var(--bg-dark); padding: 2rem; border-radius: 20px; text-align: center; border: 1px solid transparent; transition: 0.3s; }
        .skill-card-v2:hover { border-color: var(--accent-color); transform: translateY(-10px); background: #1d2d50; }
        .icon-box { font-size: 2.5rem; }

        /* Project Cards */
        .project-glass-card { background: var(--bg-soft); border-radius: 20px; overflow: hidden; transition: 0.4s; border: 1px solid rgba(255,255,255,0.05); }
        .project-glass-card:hover { transform: translateY(-10px); border-color: var(--accent-color); }
        .img-container { position: relative; height: 250px; overflow: hidden; }
        .project-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .project-glass-card:hover .project-img { transform: scale(1.1); }
        .img-overlay { position: absolute; inset: 0; background: rgba(10, 25, 47, 0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .project-glass-card:hover .img-overlay { opacity: 1; }

        /* Modal */
        .project-modal-content { background: var(--bg-dark); border-radius: 30px; }
        .modal-img-wrapper { height: 100%; min-height: 400px; }
        .tech-tag { background: rgba(255,215,0,0.1); border: 1px solid var(--accent-color); color: var(--accent-color); padding: 5px 15px; border-radius: 5px; font-size: 0.8rem; }
        .btn-close-custom { position: absolute; right: 20px; top: 20px; z-index: 10; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .btn-close-custom:hover { transform: rotate(90deg); background: var(--accent-color); }

        /* Social Icons */
        .social-icon { font-size: 2rem; color: #8892b0; transition: 0.3s; text-decoration: none; }
        .social-icon:hover { color: var(--brand-color) !important; transform: translateY(-5px) scale(1.2); }

        .admin-link { color: #444; font-size: 12px; }
        .admin-link:hover { color: var(--accent-color); }

        @media (max-width: 768px) {
          .py-100 { padding-top: 60px; padding-bottom: 60px; }
          .modal-img-wrapper { min-height: 250px; }
        }
      `}</style>
    </div>
  );
};

export default Home;