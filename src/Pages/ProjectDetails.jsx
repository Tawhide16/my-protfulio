import { useLocation, useNavigate } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
  const { state } = useLocation();
  const project = state?.project;
  const navigate = useNavigate();

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Project not found</p>
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
          className="mb-8 px-6 py-2 bg-gray-800 text-white rounded-lg flex items-center gap-2"
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
              <p className="text-gray-300 mb-6">{project.description}</p>

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

              <div className="flex gap-4">
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Live Demo <FaExternalLinkAlt className="ml-2" />
                </a>
                <a
                  href={project.gitLinkClient}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  View Client <FaGithub className="ml-2" />
                </a>
                <a
                  href={project.gitLinkServer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  View Server <FaGithub className="ml-2" />
                </a>
              </div>
            </div>

            <div className="md:w-1/2">
              {/* Add project screenshots or additional content here */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[400px] w-full overflow-hidden rounded-t-lg lg:rounded-tr-none lg:rounded-l-lg">
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