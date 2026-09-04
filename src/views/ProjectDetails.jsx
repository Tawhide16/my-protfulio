import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Use state.project if available, otherwise fetch from API
  const [project, setProject] = useState(state?.project || null);
  const [loading, setLoading] = useState(!state?.project);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we don't have project in state, fetch it from the database
    if (!project && id) {
      fetch(`${API_BASE}/projects/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Project not found or failed to load');
          }
          return res.json();
        })
        .then((data) => {
          setProject(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [project, id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0203] text-white gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
        <span className="text-sm font-semibold tracking-wider uppercase text-gray-400">Loading details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0203] text-white gap-5 p-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <FaExclamationTriangle size={24} className="text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Project</h2>
          <p className="text-gray-400">{error || 'Project not found'}</p>
        </div>
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-semibold"
        >
          ← Return to Home
        </motion.button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 px-6 py-2 bg-gray-800 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
        >
          ← Back to Projects
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

              {project.features && project.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {project.liveLink && (
                  <motion.a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Live Demo <FaExternalLinkAlt className="ml-2" />
                  </motion.a>
                )}
                
                {project.gitLinkClient && (
                  <motion.a
                    href={project.gitLinkClient}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Client Code <FaGithub className="ml-2" />
                  </motion.a>
                )}
                
                {project.gitLinkServer && (
                  <motion.a
                    href={project.gitLinkServer}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Server Code <FaGithub className="ml-2" />
                  </motion.a>
                )}
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[400px] w-full overflow-hidden rounded-t-lg lg:rounded-tr-none lg:rounded-l-lg bg-[#0c0506]">
                <motion.img
                  src={project.image1}
                  alt={project.title}
                  className="w-full h-full object-cover object-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectDetails;