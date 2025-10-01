import React, { useState, useEffect } from "react";
import { ArtProject } from "@/entities/ArtProject";

export default function Gallery() {
  const [projects, setProjects] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await ArtProject.list("order");
    setProjects(data);
    if (data.length > 0) {
      setActiveSection(data[0].id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = projects.map((p) =>
        document.getElementById(`project-${p.id}`)
      );
      const current = sections.find((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          // Adjust threshold if needed for better active section detection
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) {
        setActiveSection(current.id.replace("project-", ""));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [projects]);

  const scrollToProject = (projectId) => {
    const element = document.getElementById(`project-${projectId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#36313c",
        minHeight: "100vh",
        color: "#ede9e4",
      }}
    >
      {/* Fixed Sidebar Navigation */}
      <nav
        className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 p-8 hidden lg:block"
        style={{ backgroundColor: "#2e2b33" }}
      >
        <div className="mb-12">
          <h1
            className="text-2xl font-light tracking-wide"
            style={{ color: "#ede9e4" }}
          >
            Gallery
          </h1>
        </div>

        <div className="space-y-1">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => scrollToProject(project.id)}
              className={`w-full text-left py-2 px-3 rounded transition-all duration-300 ${
                activeSection === project.id
                  ? "bg-white/5 text-white"
                  : "text-white/60 hover:text-white/90 hover:bg-white/3"
              }`}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: "300",
                letterSpacing: "0.3px",
              }}
            >
              {project.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className="lg:hidden sticky top-0 z-10 backdrop-blur-lg border-b border-white/5 p-4"
        style={{ backgroundColor: "rgba(46, 43, 51, 0.8)" }}
      >
        <h1
          className="text-xl font-light tracking-wide mb-3"
          style={{ color: "#ede9e4" }}
        >
          Gallery
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => scrollToProject(project.id)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-all duration-300 ${
                activeSection === project.id
                  ? "bg-white/10 text-white"
                  : "bg-white/5 text-white/60"
              }`}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: "300",
              }}
            >
              {project.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {projects.length === 0 ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p
                  className="text-lg font-light mb-2"
                  style={{ color: "#ede9e4" }}
                >
                  No projects yet
                </p>
                <p
                  className="text-sm"
                  style={{ color: "rgba(237, 233, 228, 0.5)" }}
                >
                  Add your first art project from the Dashboard
                </p>
              </div>
            </div>
          ) : (
            projects.map((project, index) => (
              <section
                key={project.id}
                id={`project-${project.id}`}
                className="mb-32 md:mb-48 scroll-mt-24"
              >
                {/* Project Title & Info */}
                <div className="mb-8 md:mb-12">
                  <h2
                    className="text-3xl md:text-5xl font-light mb-4 tracking-tight"
                    style={{ color: "#ede9e4", lineHeight: "1.2" }}
                  >
                    {project.title}
                  </h2>

                  <div
                    className="flex flex-wrap gap-4 text-sm mb-6"
                    style={{ color: "rgba(237, 233, 228, 0.6)" }}
                  >
                    {project.year && (
                      <span className="font-light">{project.year}</span>
                    )}
                    {project.medium && (
                      <span className="font-light">{project.medium}</span>
                    )}
                  </div>

                  {project.description && (
                    <p
                      className="text-base md:text-lg font-light leading-relaxed max-w-2xl"
                      style={{ color: "rgba(237, 233, 228, 0.8)" }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Project Images */}
                {project.images && project.images.length > 0 && (
                  <div className="space-y-6 md:space-y-8">
                    {project.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="overflow-hidden rounded-sm"
                        style={{
                          border: "1px solid rgba(237, 233, 228, 0.08)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <img
                          src={image}
                          alt={`${project.title} - ${imgIndex + 1}`}
                          className="w-full h-auto"
                          style={{ display: "block" }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtle separator for non-last items */}
                {index < projects.length - 1 && (
                  <div
                    className="mt-32 md:mt-48 h-px w-full"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(237, 233, 228, 0.1), transparent)",
                    }}
                  />
                )}
              </section>
            ))
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #36313c;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(237, 233, 228, 0.2) transparent;
        }

        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background-color: rgba(237, 233, 228, 0.2);
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: rgba(237, 233, 228, 0.3);
        }
      `}</style>
    </div>
  );
}
