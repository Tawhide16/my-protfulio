import { motion, useScroll, useTransform } from 'framer-motion';
import { FaGraduationCap, FaHeart, FaLaptopCode, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { SiReact, SiNextdotjs, SiNodedotjs, SiMongodb, SiShopify } from 'react-icons/si';
import { TypeAnimation } from 'react-type-animation';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';

/* ── Floating orb ── */
const FloatingOrb = ({ color, style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-[0.07] pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -24, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ── Info card wrapper ── */
const Card = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-7 hover:border-white/20 transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ── Section label ── */
const CardLabel = ({ icon, label, color = '#6366f1', colorRgb = '99,102,241' }) => (
  <div className="flex items-center gap-3 mb-5">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `rgba(${colorRgb}, 0.12)`, color }}
    >
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white">{label}</h3>
  </div>
);

/* ── Bullet point ── */
const Bullet = ({ text, color = '#6366f1' }) => (
  <li className="flex items-start gap-2.5 text-sm text-gray-400">
    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
    {text}
  </li>
);

const About = () => {
  const sectionRef = useRef(null);
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0b0b0f 0%, #0d0b14 50%, #0b0b0f 100%)' }}
    >
      {/* Background orbs */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <FloatingOrb color="#6366f1" style={{ width: 420, height: 420, top: -60, right: -100 }} />
        <FloatingOrb color="#a855f7" style={{ width: 320, height: 320, bottom: 40, left: -80 }} />
        <FloatingOrb color="#22d3ee" style={{ width: 250, height: 250, top: '50%', left: '45%' }} />
      </motion.div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
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
            Who I Am
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight"
          >
            About{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Me
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed"
          >
            A passionate web developer crafting clean, performant digital experiences.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }}
          />
        </div>

        {/* ── Top: Current Role (full width) ── */}
        <Card delay={0.1} className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <CardLabel icon={<FaBriefcase size={18} />} label="Current Position" color="#6366f1" colorRgb="99,102,241" />
              <div className="pl-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-white">Web Developer</h4>
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Currently Working
                  </span>
                </div>
                <p className="text-indigo-300 font-semibold mb-1">Softvence Agency</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-indigo-400" /> On-Site, Dhaka, BD</span>
                  <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-indigo-400" /> 2025 – Present</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                  Working as a professional web developer at Softvence, building and delivering high-quality client projects — 
                  including custom Shopify stores, full-stack MERN applications, and responsive UI/UX implementations.
                </p>
              </div>
            </div>

            {/* Tech stack used at work */}
            <div className="lg:border-l lg:border-white/10 lg:pl-8 flex-shrink-0">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-600 mb-3">Tech at Work</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <SiReact className="text-cyan-400" />, name: 'React' },
                  { icon: <SiNextdotjs className="text-white" />, name: 'Next.js' },
                  { icon: <SiNodedotjs className="text-green-500" />, name: 'Node.js' },
                  { icon: <SiMongodb className="text-emerald-400" />, name: 'MongoDB' },
                  { icon: <SiShopify className="text-green-400" />, name: 'Shopify' },
                ].map(t => (
                  <span key={t.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-medium">
                    {t.icon} {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ── Middle row: Education + Tech Journey ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Education */}
          <Card delay={0.2}>
            <CardLabel icon={<FaGraduationCap size={18} />} label="Education" color="#a855f7" colorRgb="168,85,247" />
            <div className="pl-1 space-y-3">
              <p className="text-gray-400 text-sm leading-relaxed">
                Pursuing <span className="text-indigo-300 font-semibold">Diploma in Computer Science</span> at Borak Polytechnic Institute — currently in 7th Semester.
              </p>
              <ul className="space-y-2 mt-3">
                <Bullet text="CGPA: 3.85 / 4.00 — Top 5% of class" color="#a855f7" />
                <Bullet text="Expected Graduation: December 2026" color="#a855f7" />
                <Bullet text="Core subjects: DSA, Networking, Web Technology" color="#a855f7" />
              </ul>
            </div>
          </Card>

          {/* Tech Journey */}
          <Card delay={0.3}>
            <CardLabel icon={<FaLaptopCode size={18} />} label="Tech Journey" color="#22d3ee" colorRgb="34,211,238" />
            <div className="pl-1 space-y-3">
              <p className="text-gray-400 text-sm leading-relaxed">
                Passionate about building{' '}
                <TypeAnimation
                  sequence={[
                    'web applications', 2000,
                    'responsive UIs', 2000,
                    'full-stack projects', 2000,
                    'Shopify stores', 2000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  style={{ color: '#22d3ee', fontWeight: 600 }}
                />
              </p>
              <ul className="space-y-2 mt-3">
                <Bullet text="500+ hours of coding in 2024–2025" color="#22d3ee" />
                <Bullet text="10+ full-stack & e-commerce projects delivered" color="#22d3ee" />
                <Bullet text="Worked with international clients via Softvence" color="#22d3ee" />
              </ul>
            </div>
          </Card>
        </div>

        {/* ── Bottom: What a Pro Developer Brings ── */}
        <Card delay={0.4}>
          <CardLabel icon={<FaHeart size={18} />} label="What I Bring as a Professional" color="#f43f5e" colorRgb="244,63,94" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pl-1">
            {[
              {
                title: 'Clean Code',
                color: '#6366f1',
                colorRgb: '99,102,241',
                points: ['Readable & maintainable', 'Component-driven design', 'DRY principles'],
              },
              {
                title: 'Performance',
                color: '#22c55e',
                colorRgb: '34,197,94',
                points: ['Optimized rendering', 'Lazy loading', 'Fast load times'],
              },
              {
                title: 'Collaboration',
                color: '#f59e0b',
                colorRgb: '245,158,11',
                points: ['Git & version control', 'Team communication', 'On-time delivery'],
              },
              {
                title: 'Growth Mindset',
                color: '#a855f7',
                colorRgb: '168,85,247',
                points: ['Constantly learning', 'Adapts to new tech', 'Open to feedback'],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: col.color }}
                >
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.points.map(p => <Bullet key={p} text={p} color={col.color} />)}
                </ul>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </section>
  );
};

export default About;