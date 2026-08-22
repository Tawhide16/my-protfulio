'use client';

import { FaReact, FaNodeJs, FaCode, FaShopify, FaGitAlt, FaHtml5, FaCss3Alt, FaFigma, FaDatabase } from 'react-icons/fa';
import { SiTailwindcss, SiExpress, SiMongodb, SiFirebase, SiTypescript, SiNextdotjs, SiJavascript, SiRedux, SiPostman, SiVercel } from 'react-icons/si';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect } from 'react';
import { defaultSkillsList, defaultSiteContent } from '@/data/defaultContent';

const getSkillIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('react')) return <FaReact size={38} />;
  if (n.includes('next')) return <SiNextdotjs size={38} />;
  if (n.includes('javascript') || n === 'js') return <SiJavascript size={38} />;
  if (n.includes('typescript') || n === 'ts') return <SiTypescript size={38} />;
  if (n.includes('tailwind')) return <SiTailwindcss size={38} />;
  if (n.includes('firebase')) return <SiFirebase size={38} />;
  if (n.includes('node')) return <FaNodeJs size={38} />;
  if (n.includes('express')) return <SiExpress size={38} />;
  if (n.includes('mongo')) return <SiMongodb size={38} />;
  if (n.includes('shopify')) return <FaShopify size={38} />;
  if (n.includes('redux')) return <SiRedux size={38} />;
  if (n.includes('git')) return <FaGitAlt size={38} />;
  if (n.includes('html')) return <FaHtml5 size={38} />;
  if (n.includes('css')) return <FaCss3Alt size={38} />;
  if (n.includes('figma')) return <FaFigma size={38} />;
  if (n.includes('postman')) return <SiPostman size={38} />;
  if (n.includes('vercel')) return <SiVercel size={38} />;
  return <FaCode size={38} />;
};

/* ── Floating orb ── */
const FloatingOrb = ({ color, style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-[0.08] pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -28, 0], scale: [1, 1.06, 1] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ── Single skill card ── */
const SkillCard = ({ skill, index }) => {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const color = skill.color || '#6366f1';
  const accentRgb = skill.accentRgb || '99, 102, 241';
  const icon = skill.icon || getSkillIcon(skill.name);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group cursor-default"
    >
      {/* Glow aura on hover */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(120px circle at center, rgba(${accentRgb}, 0.35), transparent 70%)`,
        }}
      />

      <motion.div
        className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col items-center justify-between gap-4 h-44 overflow-hidden"
        animate={{
          y: hovered ? -6 : 0,
          borderColor: hovered ? `rgba(${accentRgb}, 0.5)` : 'rgba(255,255,255,0.1)',
          boxShadow: hovered
            ? `0 12px 28px rgba(${accentRgb}, 0.12)`
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : {}}
          transition={{ duration: 0.7, delay: index * 0.07 + 0.2 }}
        />

        {/* Category badge */}
        <span
          className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{
            color: color,
            background: `rgba(${accentRgb}, 0.12)`,
            border: `1px solid rgba(${accentRgb}, 0.25)`,
          }}
        >
          {skill.category || 'Skill'}
        </span>

        {/* Icon */}
        <motion.div
          className="flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{ background: `rgba(${accentRgb}, 0.1)`, color: color }}
          animate={{ rotate: hovered ? [0, -6, 6, 0] : 0, scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>

        {/* Name */}
        <h3 className="text-base font-bold text-white text-center leading-tight">{skill.name}</h3>
      </motion.div>
    </motion.div>
  );
};

/* ── Category filter tabs ── */
const categories = ['All', 'Frontend', 'Backend', 'Database', 'E-commerce'];

/* ── Main Section ── */
const Skills = () => {
  const sectionRef = useRef(null);
  const [skillsList, setSkillsList] = useState(defaultSkillsList);
  const [stats, setStats] = useState(defaultSiteContent.skillsStats);
  const [activeCategory, setActiveCategory] = useState('All');
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.skills && Array.isArray(data.data.skills) && data.data.skills.length > 0) {
            setSkillsList(data.data.skills);
          }
          if (data.data.skillsStats) {
            setStats((prev) => ({ ...prev, ...data.data.skillsStats }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  const filtered = activeCategory === 'All'
    ? skillsList
    : skillsList.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0b0b0f 0%, #0f0b1a 50%, #0b0b0f 100%)' }}
    >
      {/* Background orbs */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <FloatingOrb color="#6366f1" style={{ width: 450, height: 450, top: -80, left: -120 }} />
        <FloatingOrb color="#22d3ee" style={{ width: 350, height: 350, bottom: 0, right: -80 }} />
        <FloatingOrb color="#a855f7" style={{ width: 280, height: 280, top: '45%', left: '50%' }} />
      </motion.div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto px-6" style={{ maxWidth: '1515px' }}>

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-indigo-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          >
            Tech Stack
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight"
          >
            My{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Skills
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed"
          >
            Technologies I&apos;ve worked with and mastered throughout my development journey.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }}
          />

          {/* ── Category filter tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mt-10"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border cursor-pointer"
                style={
                  activeCategory === cat
                    ? {
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        color: '#fff',
                        borderColor: 'transparent',
                        boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        color: '#9ca3af',
                        borderColor: 'rgba(255,255,255,0.1)',
                      }
                }
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── Skills grid ── */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
        >
          {filtered.map((skill, index) => (
            <SkillCard key={skill.name || index} skill={skill} index={index} />
          ))}
        </motion.div>

        {/* ── Bottom stat strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Technologies', value: stats.technologies || `${skillsList.length}+` },
            { label: 'Projects Built', value: stats.projectsBuilt || '10+' },
            { label: 'Shopify Stores', value: stats.shopifyStores || '6+' },
            { label: 'Years Learning', value: stats.yearsLearning || '2+' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-5 rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <p
                className="text-3xl font-black mb-1"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;