'use client';

import { useRouter } from 'next/navigation';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProjectDetailsClient({ project }) {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[140px] pointer-events-none rounded-full"
        style={{ background: `${project.accentColor || '#6366f1'}20` }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.04, x: -2 }}
          whileTap={{ scale: 0.96 }}
          className="mb-8 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center gap-2 text-sm font-medium border border-white/10 transition-all cursor-pointer"
        >
          <FaArrowLeft className="text-xs" /> Back to Projects
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 rounded-2xl p-6 sm:p-10 border border-white/10 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: project.accentColor || '#6366f1' }}>
                  {project.subtitle}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
                  {project.title}
                </h1>
                <p className="text-gray-300 text-sm sm:text-base mb-8 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech stack */}
                {project.technologies && (
                  <div className="mb-8">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {project.features?.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-300">
                        <span className="mr-3 font-bold" style={{ color: project.accentColor || '#6366f1' }}>•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
                <motion.a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center px-6 py-3 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${project.accentColor || '#6366f1'}, #a855f7)`,
                    boxShadow: `0 0 25px rgba(${project.accentRgb || '99,102,241'}, 0.35)`,
                  }}
                >
                  Live Demo <FaExternalLinkAlt className="ml-2 text-xs" />
                </motion.a>

                {project.gitLinkClient && (
                  <motion.a
                    href={project.gitLinkClient}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/10 transition-all"
                  >
                    Client Code <FaGithub className="ml-2 text-sm" />
                  </motion.a>
                )}

                {project.gitLinkServer && (
                  <motion.a
                    href={project.gitLinkServer}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/10 transition-all"
                  >
                    Server Code <FaGithub className="ml-2 text-sm" />
                  </motion.a>
                )}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative h-72 sm:h-96 lg:h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-800/80 shadow-inner">
                <motion.img
                  src={project.image1}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
