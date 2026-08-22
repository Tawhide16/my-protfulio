'use client';

import Link from 'next/link';
import { FaExternalLinkAlt, FaGithub, FaArrowRight } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  SiReact, SiExpress, SiMongodb, SiFirebase, SiTailwindcss, SiNodedotjs,
} from 'react-icons/si';
import { projects } from '@/data/projectsData';

export { projects };

const techIcons = {
  React: <SiReact className="text-sky-400" />,
  Express: <SiExpress className="text-gray-300" />,
  'Express.js': <SiExpress className="text-gray-300" />,
  MongoDB: <SiMongodb className="text-green-400" />,
  Firebase: <SiFirebase className="text-yellow-400" />,
  'Tailwind CSS': <SiTailwindcss className="text-cyan-400" />,
  'Node.js': <SiNodedotjs className="text-green-500" />,
};

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
      {/* Glow border on hover */}
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
        style={{
          boxShadow: hovered
            ? `0 0 60px 0 rgba(${project.accentRgb || '99, 102, 241'}, 0.2)`
            : '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.4s',
        }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 rounded-t-2xl z-10"
          style={{ background: `linear-gradient(90deg, ${project.accentColor}, transparent)` }}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
          viewport={{ once: true }}
        />

        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch`}>

          {/* ── Image side ── */}
          <div className="lg:w-1/2 relative overflow-hidden bg-gray-800/80 min-h-[400px]">
            {/* Hover overlay with Live Preview button */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
            >
              {project.liveLink && (
                <motion.a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: hovered ? 1 : 0.85, opacity: hovered ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-xl"
                  style={{ background: project.accentColor }}
                >
                  Live Preview <FaExternalLinkAlt className="text-xs" />
                </motion.a>
              )}
            </motion.div>

            {/* Gradient overlay bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent z-10 pointer-events-none" />

            {/* Project image */}
            <motion.img
              src={project.image1}
              alt={project.title}
              className="w-full h-full object-cover object-top"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {/* ── Content side ── */}
          <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-between relative z-10">
            <div>
              {/* Category badge */}
              <p
                className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3"
                style={{ color: project.accentColor }}
              >
                {project.subtitle}
              </p>

              {/* Number + Title row */}
              <div className="flex items-start gap-4 mb-4">
                <span
                  className="text-5xl lg:text-6xl font-black leading-none select-none opacity-90 tabular-nums"
                  style={{ color: project.accentColor }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight pt-1">
                  {project.title}
                </h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {project.description}
              </p>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-gray-300"
                  >
                    {techIcons[tech] || null}
                    {tech}
                  </span>
                ))}
              </div>

              {/* Feature highlights */}
              <ul className="space-y-1.5">
                {project.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-400"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: project.accentColor }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3 pt-5 mt-6 border-t border-white/10">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <FaExternalLinkAlt className="text-[10px]" style={{ color: project.accentColor }} />
                  Live Demo
                </a>
              )}

              {project.gitLinkClient && (
                <a
                  href={project.gitLinkClient}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <FaGithub />
                  GitHub
                </a>
              )}

              {project.gitLinkServer && (
                <a
                  href={project.gitLinkServer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <FaGithub />
                  Server
                </a>
              )}

              <Link
                href={`/projects/${project.id}`}
                className="flex items-center gap-1.5 text-xs font-bold ml-auto transition-colors group"
                style={{ color: project.accentColor }}
              >
                DETAILS <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
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
  const [projectList, setProjectList] = useState(projects);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setProjectList(data.data);
        }
      })
      .catch(() => {});
  }, []);

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

      <div className="relative container mx-auto px-6 max-w-6xl z-10">
        {/* Section header */}
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
            A collection of things I&apos;ve built — from full-stack apps to polished UIs.
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

        {/* Project cards */}
        <div className="space-y-10">
          {projectList.map((project, index) => (
            <ProjectCard key={project._id || project.id} project={project} index={index} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link
            href="/projects"
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