import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import profileImg from '../assets/profile-img-2.jpg';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaFileDownload, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { useRef } from 'react';

/* ── Floating orb ── */
const FloatingOrb = ({ color, style, duration = 9 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -30, 0], scale: [1, 1.07, 1] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const socialLinks = [
  { icon: <FaGithub size={18} />, url: "https://github.com/Tawhide16", name: "GitHub" },
  { icon: <FaTwitter size={18} />, url: "https://x.com/TawhideB64383", name: "Twitter" },
  { icon: <FaLinkedin size={18} />, url: "https://www.linkedin.com/in/tawhide-hasan-bejoy/", name: "LinkedIn" },
  { icon: <FaFacebook size={18} />, url: "https://www.facebook.com/tawhide.hb", name: "Facebook" },
];

const Hero = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: 'linear-gradient(160deg, #08080f 0%, #0d0b18 50%, #080c10 100%)' }}
    >
      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb color="#6366f1" style={{ width: 600, height: 600, top: -150, left: -150, opacity: 0.12 }} duration={10} />
        <FloatingOrb color="#a855f7" style={{ width: 450, height: 450, bottom: -100, right: -100, opacity: 0.1 }} duration={12} />
        <FloatingOrb color="#22d3ee" style={{ width: 300, height: 300, top: '40%', left: '40%', opacity: 0.07 }} duration={8} />
        <FloatingOrb color="#ec4899" style={{ width: 250, height: 250, bottom: '20%', left: '20%', opacity: 0.06 }} duration={11} />
      </div>

      {/* ── Grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Radial spotlight ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Main content ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full mx-auto px-6 py-20"
        style={{ maxWidth: '1515px' }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* ── Left: Text ── */}
          <motion.div
            style={{ y: textY }}
            className="flex-1 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-300 font-medium">Web Developer @ Softvence</span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-1 text-gray-500 text-xs">
                <FaMapMarkerAlt className="text-indigo-400" /> Dhaka, BD
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 md:mb-6"
            >
              Tawhid Hasan <span
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >Bejoy</span>
            </motion.h1>

            {/* Type animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-xl md:text-2xl lg:text-3xl font-mono text-gray-300 mb-6 md:mb-8 h-10 md:h-12 flex items-center justify-center lg:justify-start gap-2"
            >
              <span className="text-indigo-400">{'>'}</span>
              <TypeAnimation
                sequence={[
                  'Frontend Developer', 2000,
                  'MERN Stack Developer', 2000,
                  'Shopify Expert', 2000,
                  'React.js Developer', 2000,
                  'UI/UX Enthusiast', 2000,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
              />
            </motion.div>

            {/* Short bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10"
            >
              Building clean, performant web experiences — from full-stack MERN apps to custom Shopify stores.
              Currently working on-site at <span className="text-indigo-400 font-medium">Softvence Agency</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-white text-sm shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  boxShadow: '0 0 30px rgba(99,102,241,0.35)',
                }}
              >
                View My Work
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaArrowRight className="text-xs" />
                </motion.span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="/Tawhide-hasan-bejoy-official(5).pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-sm border border-white/15 bg-white/5 backdrop-blur-sm text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <FaFileDownload className="text-indigo-400" />
                Resume
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span className="text-xs text-gray-700 font-semibold tracking-widest uppercase mr-1">Follow</span>
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.15 }}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Profile image ── */}
          <motion.div
            style={{ y: imgY }}
            className="order-1 lg:order-2 flex-shrink-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Outer decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #22d3ee, #6366f1)',
                  opacity: 0.2,
                  filter: 'blur(2px)',
                }}
              />

              {/* Glow pulse */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              />

              {/* Profile image */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl"
              >
                <img
                  src={profileImg}
                  alt="Tawhid Hasan Bejoy"
                  className="w-full h-full object-cover"
                />
                {/* Inner overlay gradient */}
                <div className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(99,102,241,0.15))' }}
                />
              </motion.div>

              {/* Floating cards around image */}


              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-4 -left-6 sm:-bottom-6 sm:-left-10 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-gray-900/90 backdrop-blur-sm shadow-xl text-xs font-bold text-white"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Seeking Growth Opportunities
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase font-semibold">Scroll</span>
        <div className="w-5 h-9 border border-white/15 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-indigo-400"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;