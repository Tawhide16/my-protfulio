import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaGithub, FaArrowRight } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  SiReact, SiExpress, SiMongodb, SiFirebase, SiTailwindcss, SiNodedotjs,
} from 'react-icons/si';

const techIcons = {
  React: <SiReact className="text-sky-400" />,
  Express: <SiExpress className="text-gray-300" />,
  'Express.js': <SiExpress className="text-gray-300" />,
  MongoDB: <SiMongodb className="text-green-400" />,
  Firebase: <SiFirebase className="text-yellow-400" />,
  'Tailwind CSS': <SiTailwindcss className="text-cyan-400" />,
  'Node.js': <SiNodedotjs className="text-green-500" />,
};

export const projects = [
  {
    id: 3,
    title: 'Next Class',
    subtitle: 'Education Management Platform',
    description: 'A full-stack MERN app for smooth class management, secure login, and seamless payments.',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Firebase'],
    features: ['Role-based dashboards', 'Stripe-powered enrollments', 'Assignment creation & submission', 'JWT-secured private routes'],
    accentColor: '#6366f1',
    accentRgb: '99, 102, 241',
    liveLink: 'https://my-school-b2c91.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Next-class-client',
    image1: '/NEXT-CLASS.png',
    number: '01',
  },
  {
    id: 1,
    title: 'VibeCircle',
    subtitle: 'Social Media Platform',
    description: 'Social media platform for connecting with like-minded people and sharing experiences.',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    features: ['User authentication', 'Real-time posts', 'Like and comment system', 'Responsive design'],
    accentColor: '#8b5cf6',
    accentRgb: '139, 92, 246',
    liveLink: 'https://my-assignment-10-a4262.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Vibe-Circle',
    image1: '/vibe.png',
    number: '02',
  },
  {
    id: 2,
    title: 'Hotel Booking',
    subtitle: 'Reservation System',
    description: 'Complete hotel reservation system with room selection and booking management.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    features: ['Room availability calendar', 'User dashboard', 'Booking history', 'Admin panel'],
    accentColor: '#10b981',
    accentRgb: '16, 185, 129',
    liveLink: 'https://my-hotel-a3994.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Hotel-booking-client',
    image1: '/hotel-booke.png',
    number: '03',
  },
  {
    id: 4,
    title: 'Event Explorer',
    subtitle: 'Event Discovery Platform',
    description: 'Platform for discovering and registering for local events and activities.',
    technologies: ['React', 'Express', 'MongoDB', 'Firebase'],
    features: ['Location-based search', 'Event filtering', 'Ticket purchasing', 'User reviews'],
    accentColor: '#f43f5e',
    accentRgb: '244, 63, 94',
    liveLink: 'https://fluffy-clafoutis-ef0d5e.netlify.app/',
    gitLinkClient: 'https://github.com/Tawhide16/event-explorer-client',
    image1: '/event.png',
    number: '04',
  },
];

/* ── Floating orb background ── */
const FloatingOrb = ({ color, style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-10 pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ── Single project card ── */
const ProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group"
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${project.accentColor}55, transparent 60%)`,
          borderRadius: '1rem',
        }}
      />

      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900/60 backdrop-blur-md"
        style={{ boxShadow: hovered ? `0 0 60px 0 rgba(${project.accentRgb}, 0.2)` : '0 4px 24px rgba(0,0,0,0.4)', transition: 'box-shadow 0.4s' }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${project.accentColor}, transparent)` }}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 0.8, delay: index * 0.12 + 0.3 }}
          viewport={{ once: true }}
        />

        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

          {/* ── Image side ── */}
          <div className="relative lg:w-1/2 overflow-hidden">
            <motion.div
              className="absolute inset-0 z-10"
              style={{
                background: isEven
                  ? `linear-gradient(to right, transparent 60%, rgb(17,24,39))`
                  : `linear-gradient(to left, transparent 60%, rgb(17,24,39))`,
              }}
            />
            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ background: `rgba(${project.accentRgb}, 0.15)` }}
            >
              <motion.a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: hovered ? 1 : 0.8, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm shadow-xl"
                style={{ background: project.accentColor }}
              >
                Live Preview <FaExternalLinkAlt className="text-xs" />
              </motion.a>
            </motion.div>

            <motion.img
              src={project.image1}
              alt={project.title}
              className="w-full h-64 lg:h-full object-cover object-top"
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {/* ── Content side ── */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-between">
            <div>
              {/* Number + subtitle */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-5xl font-black leading-none select-none"
                  style={{ color: `rgba(${project.accentRgb}, 0.18)` }}
                >
                  {project.number}
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: project.accentColor }}>
                    {project.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold text-white mt-0.5">{project.title}</h3>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-5">{project.description}</p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-gray-300"
                  >
                    {techIcons[tech]}
                    {tech}
                  </span>
                ))}
              </div>

              {/* Features */}
              <ul className="space-y-1.5 mb-6">
                {project.features.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.06 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project.accentColor }} />
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA links */}
            <div className="flex items-center gap-4 pt-2 border-t border-white/10">
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: `rgba(${project.accentRgb}, 0.2)` }}
                >
                  <FaExternalLinkAlt style={{ color: project.accentColor }} className="text-xs" />
                </span>
                Live Demo
              </a>
              <a
                href={project.gitLinkClient}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <FaGithub className="text-xs" />
                </span>
                GitHub
              </a>
              <Link
                to={`/projects/${project.id}`}
                state={{ project }}
                className="ml-auto flex items-center gap-1 text-xs font-semibold tracking-wide uppercase"
                style={{ color: project.accentColor }}
              >
                Details <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Section ── */
const Projects = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0b0b0f 0%, #0f0f1a 50%, #0b0b0f 100%)' }}
    >
      {/* Parallax background orbs */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <FloatingOrb color="#6366f1" style={{ width: 500, height: 500, top: -100, left: -150 }} />
        <FloatingOrb color="#8b5cf6" style={{ width: 400, height: 400, bottom: 0, right: -100 }} />
        <FloatingOrb color="#10b981" style={{ width: 300, height: 300, top: '50%', left: '50%' }} />
      </motion.div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative container mx-auto px-6 max-w-6xl">

        {/* ── Section header ── */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-indigo-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          >
            Portfolio
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight"
          >
            Featured{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Projects
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed"
          >
            A collection of things I've built — from full-stack apps to polished UIs.
          </motion.p>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mx-auto mt-6 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }}
          />
        </div>

        {/* ── Project cards ── */}
        <div className="space-y-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* ── View all CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link
            to="/projects"
            className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white overflow-hidden group border border-indigo-500/40 hover:border-indigo-400 transition-colors duration-300"
            style={{ background: 'rgba(99,102,241,0.08)' }}
          >
            <motion.span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))' }}
            />
            <span className="relative z-10">View All Projects</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaArrowRight className="text-indigo-400 text-sm" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;