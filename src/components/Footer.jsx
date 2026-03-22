import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaArrowUp, FaFacebook } from 'react-icons/fa';
import { SiReact, SiTailwindcss } from 'react-icons/si';
import { useInView } from 'react-intersection-observer';

const socialLinks = [
  { icon: <FaGithub size={18} />, url: "https://github.com/Tawhide16", name: "GitHub", color: '#6b7280', rgb: '107,114,128' },
  { icon: <FaLinkedin size={18} />, url: "https://www.linkedin.com/in/tawhide-hasan-bejoy/", name: "LinkedIn", color: '#3b82f6', rgb: '59,130,246' },
  { icon: <FaTwitter size={18} />, url: "https://x.com/TawhideB64383", name: "Twitter", color: '#38bdf8', rgb: '56,189,248' },
  { icon: <FaFacebook size={18} />, url: "https://www.facebook.com/tawhide.hb", name: "Facebook", color: '#60a5fa', rgb: '96,165,250' },
  { icon: <FaEnvelope size={18} />, url: "mailto:tawhideh.b10@gmail.com", name: "Email", color: '#ef4444', rgb: '239,68,68' },
];

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

const Footer = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-white/10"
      style={{ background: 'linear-gradient(180deg, #0b0b0f 0%, #08080c 100%)' }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06), transparent 70%)' }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto px-6 py-16" style={{ maxWidth: '1515px' }}>

        {/* ── Main footer grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">

          {/* ── Brand ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-1"
          >
            <h3
              className="text-2xl font-black mb-1"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tawhid Hasan Bejoy
            </h3>
            <p className="text-indigo-400 text-sm font-semibold mb-3">Web Developer @ Softvence</p>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Crafting clean, performant web experiences — full-stack MERN apps, custom Shopify stores & more.
            </p>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-xs text-gray-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Open to new opportunities
            </motion.div>
          </motion.div>

          {/* ── Nav links ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-5">Quick Links</p>
            <ul className="space-y-2.5">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.07 }}
                >
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ── Connect ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-1"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-600 mb-5">Connect</p>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  whileHover={{ y: -4, scale: 1.12 }}
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-200 hover:border-white/20"
                  style={{
                    background: `rgba(${social.rgb}, 0.08)`,
                    color: social.color,
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            <div className="mt-6 space-y-1.5">
              <a
                href="mailto:tawhideh.b10@gmail.com"
                className="block text-sm text-gray-600 hover:text-indigo-400 transition-colors"
              >
                tawhideh.b10@gmail.com
              </a>
              <a
                href="tel:+8801745413122"
                className="block text-sm text-gray-600 hover:text-indigo-400 transition-colors"
              >
                +880 1745413122
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-px origin-left mb-8"
          style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(168,85,247,0.2), transparent)' }}
        />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-xs text-gray-700 text-center sm:text-left"
          >
            © {new Date().getFullYear()} Tawhid Hasan Bejoy. All rights reserved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.65 }}
            className="flex items-center gap-1.5 text-xs text-gray-700"
          >
            Built with
            <SiReact className="text-cyan-500" size={12} />
            <span className="text-gray-700">&</span>
            <SiTailwindcss className="text-sky-400" size={12} />
            <span className="text-gray-700">with</span>
            <FaHeart className="text-red-500" size={10} />
          </motion.p>

          {/* Scroll to top */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            onClick={scrollToTop}
            whileHover={{ y: -3, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-gray-500 hover:text-white hover:border-indigo-500/40 transition-all duration-200"
          >
            Back to top <FaArrowUp className="text-indigo-400" size={10} />
          </motion.button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;