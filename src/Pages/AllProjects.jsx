import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { projects } from '../components/Projects';




const AllProjects = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-10 text-center">
          All <span className="text-indigo-400">Projects</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl border border-gray-800 p-6 hover:border-indigo-500 transition-all"
            >
              <img
                src={project.image1}
                alt={project.title}
                className="w-full h-60 object-cover rounded-lg mb-5"
              />
              <h2 className="text-2xl font-semibold text-white mb-3">{project.title}</h2>
              <p className="text-gray-400 mb-4">{project.description}</p>

              <ul className="mb-4 list-disc list-inside text-gray-300 text-sm">
                {project.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>

              <div className="flex space-x-4">
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-400 hover:text-indigo-300"
                >
                  Live Demo <FaExternalLinkAlt className="ml-2" />
                </a>
                {project.gitLinkClient && (
                  <a
                    href={project.gitLinkClient}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    GitHub Client
                  </a>
                )}
                {project.gitLinkServer && (
                  <a
                    href={project.gitLinkServer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    GitHub Server
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AllProjects;
