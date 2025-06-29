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

const projects = [
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
    gitLinkClient:'https://github.com/Tawhide16/Vibe-Circle',
    gitLinkServer:'https://github.com/Tawhide16/Vibe-Circle-server',
    image1 : '/vibe-cicale.png'
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
    image1:'/hotel-booke.png'
  },
  {
    id: 3,
    title: 'Task Manager',
    description: 'Productivity application for organizing and tracking daily tasks and projects.',
    technologies: ['React', 'Firebase'],
    features: [
      'Drag-and-drop interface',
      'Task categorization',
      'Progress tracking',
      'Dark/light mode'
    ],
    accentColor: 'bg-amber-500',
    liveLink: 'https://tawhide16.github.io/assignment-5/',
    image1:'/DevBoard.png'
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
      'User reviews'
    ],
    accentColor: 'bg-rose-500',
    liveLink: 'https://strong-stroopwafel-a0fc21.netlify.app/',
    image1:'/event.png'
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
    className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
          className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Case Study
          <FaExternalLinkAlt className="ml-2 text-xs" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  return (
    <section 
      id="projects" 
      className="py-24 bg-gradient-to-br from-gray-900 to-gray-950"
    >
      <div className="container px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 text-sm font-medium text-indigo-400">
            MY WORK
          </span>
          <h2 className="text-4xl font-bold text-white">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Projects</span>
          </h2>
          <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
            />
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
  );
};

export default Projects;