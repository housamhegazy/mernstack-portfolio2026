import React from "react";
import { useGetUserDataQuery } from "../../Redux/UserApi";

const Home = () => {
  const { data: user, isLoading, isError } = useGetUserDataQuery();

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
      <section id="personal-info" className="min-vh-100 d-flex align-items-center py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient" style={{ opacity: 0.05, zIndex: -1 }}></div>

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
                      objectFit: "cover" 
                    }}
                  />
                ) : (
                  <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center border border-accent border-4" 
                       style={{ width: "250px", height: "250px" }}>
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
              <p className="fs-6 fs-md-5 text-accent fw-medium mb-2">Welcome to my professional space</p>
              <h1 className="display-4 display-md-2 fw-bold text-white mb-2">
                I'm <span className="text-accent">{user.name || "Samsem"}</span>
              </h1>
              
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 gap-md-3 mb-4 text-secondary small">
                <span className="d-flex align-items-center"><i className="bi bi-envelope-at me-1 text-accent"></i>{user.email}</span>
                <span className="d-flex align-items-center"><i className="bi bi-mortarboard me-1 text-accent"></i>{user.college}</span>
                <span className="d-flex align-items-center"><i className="bi bi-building me-1 text-accent"></i>{user.university}</span>
              </div>

              <p className="lead fs-6 fs-md-5 text-secondary mb-4 px-2 px-lg-0 pe-lg-5 text-center text-lg-start" style={{ lineHeight: '1.7' }}>
                {user.bio || "Crafting digital experiences with precision and passion."}
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                {user.cv && (
                  <a href={user.cv} target="_blank" rel="noreferrer" className="btn btn-accent px-4 py-3 rounded-pill fw-bold shadow-lg">
                    <i className="bi bi-file-earmark-pdf me-2"></i> Download CV
                  </a>
                )}
                <a href="#projects" className="btn btn-outline-light px-4 py-3 rounded-pill fw-bold shadow-lg">
                  <i className="bi bi-grid me-2"></i> My Projects
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Skills Section */}
      <section id="skills" className="py-5 bg-dark border-top border-bottom border-secondary">
        <div className="container">
          <h2 className="text-center text-accent fw-bold mb-5 display-6 display-md-5">
            <span className="pb-2 border-bottom border-accent border-3">My Expertise</span>
          </h2>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
            {user.professionalSkills?.length > 0 ? (
              user.professionalSkills.map((skill, index) => (
                <div className="col" key={index}>
                  <div className="card h-100 bg-dark text-white border-accent transition">
                    <div className="card-body text-center py-3 py-md-4">
                      <i className="bi bi-code-slash fs-3 text-accent mb-2 d-block"></i> 
                      <h6 className="card-title fw-bold mb-0 small text-uppercase">{skill}</h6>
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
      </section>

      {/* 3. Projects Gallery Section */}
      <section id="projects" className="py-5">
        <div className="container">
          <h2 className="text-center text-accent fw-bold mb-5 display-6 display-md-5">
            <span className="pb-2 border-bottom border-accent border-3">Recent Projects</span>
          </h2>
          <div className="row g-4">
            {user.projects?.length > 0 ? (
              user.projects.map((project) => (
                <div className="col-12 col-md-6 col-lg-4" key={project._id}>
                  <div className="card h-100 bg-dark border-accent shadow-sm overflow-hidden">
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
                    <div className="card-body p-3">
                      <h5 className="card-title text-accent fw-bold h6">{project.title}</h5>
                      <p className="card-text text-secondary x-small mb-3" style={{ fontSize: '0.85rem' }}>{project.description}</p>
                      <div className="d-flex flex-wrap gap-1">
                        {project.technologies?.map((tech, i) => (
                          <span key={i} className="badge bg-secondary text-white rounded-pill" style={{ fontSize: "0.65rem" }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-footer bg-transparent border-secondary border-opacity-25 d-flex justify-content-between p-3">
                      <div className="d-flex gap-3">
                        {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-white fs-5"><i className="bi bi-github"></i></a>}
                        {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-accent fs-5"><i className="bi bi-box-arrow-up-right"></i></a>}
                      </div>
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
      </section>

      {/* 4. Contact Section */}
      <section id="contact" className="py-5 bg-dark border-top border-secondary">
        <div className="container text-center px-4">
          <h2 className="text-accent fw-bold mb-4 display-6 display-md-5">Let's Connect</h2>
          <p className="text-secondary mb-5 small">Interested in working together? Reach out!</p>
          <div className="d-flex justify-content-center flex-wrap gap-4 fs-2 mb-5">
            {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="text-white"><i className="bi bi-github"></i></a>}
            {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-white"><i className="bi bi-linkedin"></i></a>}
            {user.socialLinks?.facebook && <a href={user.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-white"><i className="bi bi-facebook"></i></a>}
          </div>
          <a href={`mailto:${user.email}`} className="btn btn-accent btn-lg w-100 w-md-auto px-5 py-3 rounded-pill fw-bold">
            <i className="bi bi-send me-2"></i> Email Me
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center border-top border-secondary bg-deep-blue px-2">
        <p className="text-secondary mb-0 small">
          Made with ❤️ by <span className="text-accent fw-bold">{user?.name}</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;