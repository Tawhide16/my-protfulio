'use client';

import { FaReact, FaNodeJs, FaCode, FaShopify, FaGitAlt } from 'react-icons/fa';
import {
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiTypescript,
  SiNextdotjs,
  SiJavascript,
  SiPostgresql,
  SiSupabase,
  SiPrisma,
  SiReactquery,
  SiAxios,
  SiReacthookform,
  SiDaisyui,
  SiHtml5,
  SiCss3,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiFigma,
  SiGraphql,
  SiVite,
  SiRedux,
  SiStripe,
  SiGreensock,
  SiFramer,
  SiJsonwebtokens,
  SiBootstrap,
  SiSass,
  SiPython,
  SiCplusplus,
  SiWordpress,
  SiPhp,
  SiMysql,
  SiRedis,
  SiVercel,
  SiNetlify,
  SiLinux,
  SiNpm,
  SiPnpm,
} from 'react-icons/si';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect } from 'react';
import { API_BASE } from '../config/api';
import { getInitialSiteContent, fetchSiteContentFast } from '../utils/apiCache';

/* ── Floating orb ── */
const FloatingOrb = ({ color, style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-[0.08] pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -28, 0], scale: [1, 1.06, 1] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ── NeonDB SVG ── */
const NeonIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#00E599" fillOpacity="0.15"/>
    <path d="M7 8.5C7 7.672 7.672 7 8.5 7h7C16.328 7 17 7.672 17 8.5v3.75c0 .966-.784 1.75-1.75 1.75H14l3 3.5h-2l-3-3.5H9v3.5H7V8.5zm2 .5v3h4.25a.25.25 0 00.25-.25V9.25A.25.25 0 0013.25 9H9z" fill="#00E599"/>
  </svg>
);

const skills = [
  {
    name: 'React',
    icon: <FaReact size={38} />,
    category: 'Frontend',
    color: '#22d3ee',
    accentRgb: '34, 211, 238',
    level: 90,
  },
  {
    name: 'Next.js',
    icon: <SiNextdotjs size={38} />,
    category: 'Frontend',
    color: '#ffffff',
    accentRgb: '255, 255, 255',
    level: 80,
  },
  {
    name: 'JavaScript',
    icon: <SiJavascript size={38} />,
    category: 'Frontend',
    color: '#facc15',
    accentRgb: '250, 204, 21',
    level: 92,
  },
  {
    name: 'TypeScript',
    icon: <SiTypescript size={38} />,
    category: 'Frontend',
    color: '#3b82f6',
    accentRgb: '59, 130, 246',
    level: 75,
  },
  {
    name: 'Tailwind CSS',
    icon: <SiTailwindcss size={38} />,
    category: 'Frontend',
    color: '#38bdf8',
    accentRgb: '56, 189, 248',
    level: 95,
  },
  {
    name: 'Firebase',
    icon: <SiFirebase size={38} />,
    category: 'Backend',
    color: '#f59e0b',
    accentRgb: '245, 158, 11',
    level: 82,
  },
  {
    name: 'Node.js',
    icon: <FaNodeJs size={38} />,
    category: 'Backend',
    color: '#22c55e',
    accentRgb: '34, 197, 94',
    level: 78,
  },
  {
    name: 'Express',
    icon: <SiExpress size={38} />,
    category: 'Backend',
    color: '#9ca3af',
    accentRgb: '156, 163, 175',
    level: 80,
  },
  {
    name: 'MongoDB',
    icon: <SiMongodb size={38} />,
    category: 'Database',
    color: '#10b981',
    accentRgb: '16, 185, 129',
    level: 85,
  },
  {
    name: 'Shopify',
    icon: <FaShopify size={38} />,
    category: 'E-commerce',
    color: '#95bf47',
    accentRgb: '149, 191, 71',
    level: 88,
  },
  {
    name: 'TanStack Query',
    icon: <SiReactquery size={38} />,
    category: 'Frontend',
    color: '#ef4444',
    accentRgb: '239, 68, 68',
    level: 78,
  },
  {
    name: 'Axios',
    icon: <SiAxios size={38} />,
    category: 'Frontend',
    color: '#5a29e4',
    accentRgb: '90, 41, 228',
    level: 88,
  },
  {
    name: 'React Hook Form',
    icon: <SiReacthookform size={38} />,
    category: 'Frontend',
    color: '#ec4899',
    accentRgb: '236, 72, 153',
    level: 85,
  },
  {
    name: 'DaisyUI',
    icon: <SiDaisyui size={38} />,
    category: 'Frontend',
    color: '#1ad1a5',
    accentRgb: '26, 209, 165',
    level: 90,
  },
  {
    name: 'PostgreSQL',
    icon: <SiPostgresql size={38} />,
    category: 'Database',
    color: '#336791',
    accentRgb: '51, 103, 145',
    level: 75,
  },
  {
    name: 'NeonDB',
    icon: <NeonIcon size={38} />,
    category: 'Database',
    color: '#00E599',
    accentRgb: '0, 229, 153',
    level: 72,
  },
  {
    name: 'Supabase',
    icon: <SiSupabase size={38} />,
    category: 'Database',
    color: '#3ECF8E',
    accentRgb: '62, 207, 142',
    level: 74,
  },
  {
    name: 'Prisma',
    icon: <SiPrisma size={38} />,
    category: 'Database',
    color: '#5a67d8',
    accentRgb: '90, 103, 216',
    level: 76,
  },
  {
    name: 'HTML5',
    icon: <SiHtml5 size={38} />,
    category: 'Frontend',
    color: '#e34f26',
    accentRgb: '227, 79, 38',
    level: 95,
  },
  {
    name: 'CSS3',
    icon: <SiCss3 size={38} />,
    category: 'Frontend',
    color: '#1572b6',
    accentRgb: '21, 114, 182',
    level: 92,
  },
  {
    name: 'Git',
    icon: <SiGit size={38} />,
    category: 'Tools',
    color: '#f05032',
    accentRgb: '240, 80, 50',
    level: 88,
  },
  {
    name: 'GitHub',
    icon: <SiGithub size={38} />,
    category: 'Tools',
    color: '#ffffff',
    accentRgb: '255, 255, 255',
    level: 88,
  },
  {
    name: 'Redux',
    icon: <SiRedux size={38} />,
    category: 'Frontend',
    color: '#764abc',
    accentRgb: '118, 74, 188',
    level: 80,
  },
];

const resolveIcon = (name, existingIcon) => {
  const n = (name || '').toLowerCase().trim();

  // Multi-word or specific matches first to prevent false substring overlaps
  if (n.includes('hook form') || n === 'rhf' || n.includes('reacthookform')) return <SiReacthookform size={38} />;
  if (n.includes('tanstack') || n.includes('react query') || n.includes('reactquery') || n === 'query') return <SiReactquery size={38} />;
  if (n.includes('next')) return <SiNextdotjs size={38} />;
  if (n.includes('tailwind')) return <SiTailwindcss size={38} />;
  if (n.includes('bootstrap')) return <SiBootstrap size={38} />;
  if (n.includes('sass') || n === 'scss') return <SiSass size={38} />;
  if (n.includes('redux') || n === 'rtk') return <SiRedux size={38} />;
  if (n.includes('axios')) return <SiAxios size={38} />;
  if (n.includes('daisy')) return <SiDaisyui size={38} />;
  if (n.includes('framer') || n.includes('motion')) return <SiFramer size={38} />;
  if (n.includes('gsap') || n.includes('greensock')) return <SiGreensock size={38} />;
  if (n.includes('jwt') || n.includes('json web token') || n.includes('token')) return <SiJsonwebtokens size={38} />;
  if (n.includes('github')) return <SiGithub size={38} />;
  if (n.includes('git')) return <SiGit size={38} />;
  if (n.includes('docker')) return <SiDocker size={38} />;
  if (n.includes('postman')) return <SiPostman size={38} />;
  if (n.includes('figma')) return <SiFigma size={38} />;
  if (n.includes('graphql') || n.includes('apollo')) return <SiGraphql size={38} />;
  if (n.includes('vite')) return <SiVite size={38} />;
  if (n.includes('stripe')) return <SiStripe size={38} />;
  if (n.includes('html')) return <SiHtml5 size={38} />;
  if (n.includes('css')) return <SiCss3 size={38} />;
  if (n.includes('javascript') || n === 'js' || n.includes('es6')) return <SiJavascript size={38} />;
  if (n.includes('typescript') || n === 'ts') return <SiTypescript size={38} />;
  if (n.includes('react')) return <FaReact size={38} />;
  if (n.includes('node')) return <FaNodeJs size={38} />;
  if (n.includes('express')) return <SiExpress size={38} />;
  if (n.includes('mongo')) return <SiMongodb size={38} />;
  if (n.includes('firebase')) return <SiFirebase size={38} />;
  if (n.includes('shopify') || n.includes('liquid')) return <FaShopify size={38} />;
  if (n.includes('postgres') || n.includes('psql')) return <SiPostgresql size={38} />;
  if (n.includes('mysql')) return <SiMysql size={38} />;
  if (n.includes('redis')) return <SiRedis size={38} />;
  if (n.includes('neon')) return <NeonIcon size={38} />;
  if (n.includes('supabase')) return <SiSupabase size={38} />;
  if (n.includes('prisma')) return <SiPrisma size={38} />;
  if (n.includes('python')) return <SiPython size={38} />;
  if (n.includes('c++') || n.includes('cpp') || n.includes('cplusplus')) return <SiCplusplus size={38} />;
  if (n.includes('wordpress')) return <SiWordpress size={38} />;
  if (n.includes('php')) return <SiPhp size={38} />;
  if (n.includes('vercel')) return <SiVercel size={38} />;
  if (n.includes('netlify')) return <SiNetlify size={38} />;
  if (n.includes('linux')) return <SiLinux size={38} />;
  if (n.includes('pnpm')) return <SiPnpm size={38} />;
  if (n.includes('npm')) return <SiNpm size={38} />;

  // If none matched, check if existingIcon is a valid non-placeholder element
  const isPlaceholder = !existingIcon ||
    typeof existingIcon === 'string' ||
    existingIcon?.type === 'span' ||
    existingIcon?.props?.className?.includes?.('text-');

  if (!isPlaceholder) return existingIcon;

  return <FaCode size={38} />;
};

/* ── Skill Card ── */
const SkillCard = ({ skill, index }) => {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
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
          background: `linear-gradient(135deg, ${skill.color}50, transparent 65%)`,
          borderRadius: '1rem',
        }}
      />

      <motion.div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col items-center gap-4 cursor-default"
        animate={{
          y: hovered ? -6 : 0,
          boxShadow: hovered
            ? `0 12px 28px rgba(${skill.accentRgb}, 0.12)`
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${skill.color}, transparent)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : {}}
          transition={{ duration: 0.7, delay: index * 0.07 + 0.2 }}
        />

        {/* Category badge */}
        <span
          className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{
            color: skill.color,
            background: `rgba(${skill.accentRgb}, 0.12)`,
            border: `1px solid rgba(${skill.accentRgb}, 0.25)`,
          }}
        >
          {skill.category}
        </span>

        {/* Icon */}
        <motion.div
          className="flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{ background: `rgba(${skill.accentRgb || '99,102,241'}, 0.1)`, color: skill.color || '#6366f1' }}
          animate={{ rotate: hovered ? [0, -6, 6, 0] : 0, scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {resolveIcon(skill.name, skill.icon)}
        </motion.div>

        {/* Name */}
        <h3 className="text-base font-bold text-white text-center leading-tight">{skill.name}</h3>
      </motion.div>
    </motion.div>
  );
};

/* ── Category filter tabs ── */
const categories = ['All', 'Frontend', 'Backend', 'Database', 'E-commerce', 'Tools'];

/* ── Main Section ── */
const Skills = () => {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [dynamicSkills, setDynamicSkills] = useState(skills);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  useEffect(() => {
    fetchSiteContentFast('skills', (freshSkills) => {
      if (Array.isArray(freshSkills) && freshSkills.length > 0) {
        setDynamicSkills(freshSkills);
      }
    });
  }, []);

  const activeSkills = dynamicSkills.length > 0 ? dynamicSkills : skills;
  const filtered = activeCategory === 'All'
    ? activeSkills
    : activeSkills.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());

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
            Technologies I've worked with and mastered throughout my development journey.
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
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border"
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
            <SkillCard key={skill.name} skill={skill} index={index} />
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
            { label: 'Technologies', value: `${skills.length}+` },
            { label: 'Projects Built', value: '10+' },
            { label: 'Shopify Stores', value: '6+' },
            { label: 'Years Learning', value: '2+' },
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