import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  SiReact,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiTailwindcss,
  SiNodedotjs,
} from 'react-icons/si';

// Tech stack icons with consistent sizing
const techIcons = {
  React: <SiReact className="text-sky-500 text-lg" />,
  Express: <SiExpress className="text-gray-400 text-lg" />,
  MongoDB: <SiMongodb className="text-green-500 text-lg" />,
  Firebase: <SiFirebase className="text-yellow-400 text-lg" />,
  'Tailwind CSS': <SiTailwindcss className="text-cyan-400 text-lg" />,
  'Node.js': <SiNodedotjs className="text-green-600 text-lg" />,
};

export const projects = [
  {
    id: 3,
    title: 'Next Class Project',
    description: 'A full-stack MERN app for smooth class management, secure login, and seamless payments.',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Firebase', 'Stripe'],
    features: [
      'Role-based dashboards',
      'Real-time sweet alerts',
      'Stripe-powered enrollments',
      'Assignment creation & submission',
      'Fully responsive design',
      'JWT-secured private routes',
    ],
    accentColor: 'bg-indigo-600',
    liveLink: 'https://my-school-b2c91.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Next-class-client',
    image1: '/NEXT-CLASS.png'
  },
  {
    id: 1,
    title: 'VibeCircle',
    description: 'Social media platform for connecting with like-minded people and sharing experiences.',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    features: [
      'User authentication',
      'Real-time posts',
      'Like and comment system',
      'Responsive design'
    ],
    accentColor: 'bg-indigo-500',
    liveLink: 'https://my-assignment-10-a4262.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Vibe-Circle',
    image1: '/vibe.png'
  },
  {
    id: 2,
    title: 'Hotel Booking',
    description: 'Complete hotel reservation system with room selection and booking management.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    features: [
      'Room availability calendar',
      'User dashboard',
      'Booking history',
      'Admin panel'
    ],
    accentColor: 'bg-emerald-500',
    liveLink: 'https://my-hotel-a3994.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Hotel-booking-client',
    image1: '/hotel-booke.png'
  },
  {
    id: 4,
    title: 'Event Explorer',
    description: 'Platform for discovering and registering for local events and activities.',
    technologies: ['React', 'Express', 'MongoDB'],
    features: [
      'Location-based search',
      'Event filtering',
      'Ticket purchasing',
      'User reviews',
      'use react',
      'firebase '
    ],
    accentColor: 'bg-rose-500',
    liveLink: 'https://fluffy-clafoutis-ef0d5e.netlify.app/',
    gitLinkClient: 'https://github.com/Tawhide16/event-explorer-client',
    image1: '/event.png'
  },
];

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      delay: index * 0.15,
      ease: [0.16, 1, 0.3, 1]
    }}
    viewport={{ once: true, margin: "-100px" }}
    className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl "
  >
    <div
      className={`absolute inset-0 -z-10 ${project.accentColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
    />

    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">
          {project.title}
        </h3>
        <div className="flex space-x-2">
          {project.technologies.map(tech => (
            <span key={tech} className="text-lg" title={tech}>
              {techIcons[tech]}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-400 mb-5 leading-relaxed">
        {project.description}
      </p>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">KEY FEATURES</h4>
        <ul className="space-y-2">
          {project.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${project.accentColor} mt-2 mr-2`} />
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-white hover:text-indigo-300 transition-colors"
        >
          Live Demo
          <FaExternalLinkAlt className="ml-2 text-xs" />
        </a>
        <Link
          to={`/projects/${project.id}`}
          state={{ project }}
          className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors "
        >
          Details
          <FaExternalLinkAlt className="ml-2 text-xs" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
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

         <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-indigo-500 rounded-lg text-white hover:text-indigo-300 transition-all duration-300 group"
          >
            View all projects
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
};

export default Projects;