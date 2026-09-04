import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaArrowLeft, FaLayerGroup, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

const API_URL = `${API_BASE}/projects`;

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            if (a.number && b.number) return a.number.localeCompare(b.number);
            return 0;
          });
          setProjects(sorted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen py-20 bg-[#0a0203] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#d90429]/8 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#800313]/8 blur-[180px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-6 group">
            <span className="w-7 h-7 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors">
              <FaArrowLeft size={11} />
            </span>
            Back to Portfolio
          </Link>
          <p className="text-[#d90429] text-xs font-bold uppercase tracking-[0.3em] mb-2">Portfolio</p>
          <h1 className="font-bebas text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide uppercase leading-none">
            All <span className="text-[#d90429]">Projects</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-[#d90429]/30 border-t-[#d90429] rounded-full"
            />
            <span className="text-sm">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <FaLayerGroup size={40} className="mx-auto mb-4 opacity-20" />
            <p>No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#0e0305] border border-white/8 rounded-2xl overflow-hidden group hover:border-white/15 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden relative bg-[#0a0203]">
                  <img
                    src={project.image1}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Accent overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ background: project.accentColor }}
                  />
                  {/* Number badge */}
                  {project.number && (
                    <div className="absolute top-3 left-3 font-mono text-[10px] font-bold text-white/60 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {project.number}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: project.accentColor || '#d90429' }} />
                    <div>
                      <h2 className="text-lg font-bold text-white leading-tight">{project.title}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{project.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies?.slice(0, 5).map((tech) => (
                      <span key={tech} className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-gray-400">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#d90429] transition-colors duration-200"
                      >
                        <FaGlobe size={11} /> Live Demo
                      </a>
                    )}
                    {project.gitLinkClient && (
                      <a
                        href={project.gitLinkClient}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-white transition-colors duration-200"
                      >
                        <FaGithub size={11} /> Client
                      </a>
                    )}
                    {project.gitLinkServer && (
                      <a
                        href={project.gitLinkServer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-white transition-colors duration-200"
                      >
                        <FaGithub size={11} /> Server
                      </a>
                    )}
                    <Link
                      to={`/projects/${project._id}`}
                      className="ml-auto flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors duration-200"
                    >
                      Details <FaExternalLinkAlt size={9} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProjects;
