import { motion, useScroll, useTransform } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane, FaArrowRight } from 'react-icons/fa';
import { SiGmail, SiMessenger } from 'react-icons/si';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';

/* ── Floating orb ── */
const FloatingOrb = ({ color, style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-[0.07] pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -28, 0], scale: [1, 1.06, 1] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const Contact = () => {
  const form = useRef();
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [sentTime, setSentTime] = useState('');
  const [focused, setFocused] = useState('');
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [leftRef, leftInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [rightRef, rightInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  useEffect(() => {
    setSentTime(new Date().toLocaleString());
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    emailjs.sendForm(
      'service_3sk77oe',
      'template_k3p7ldj',
      form.current,
      'WBIqAMTB226Zt_NED'
    ).then(() => {
      setLoading(false);
      setSuccess(true);
      e.target.reset();
      setSentTime(new Date().toLocaleString());
    }).catch(() => {
      setLoading(false);
      setSuccess(false);
    });
  };

  const socialLinks = [
    { icon: <FaGithub size={18} />, url: "https://github.com/Tawhide16", name: "GitHub", color: '#6b7280', hoverColor: '#ffffff', bg: 'rgba(107,114,128,0.12)' },
    { icon: <FaLinkedin size={18} />, url: "https://www.linkedin.com/in/tawhide-hasan-bejoy/", name: "LinkedIn", color: '#3b82f6', hoverColor: '#ffffff', bg: 'rgba(59,130,246,0.12)' },
    { icon: <SiGmail size={18} />, url: "mailto:tawhideh.b10@gmail.com", name: "Gmail", color: '#ef4444', hoverColor: '#ffffff', bg: 'rgba(239,68,68,0.12)' },
    { icon: <SiMessenger size={18} />, url: "https://www.facebook.com/tawhide.hb", name: "Messenger", color: '#60a5fa', hoverColor: '#ffffff', bg: 'rgba(96,165,250,0.12)' },
  ];

  const contactInfo = [
    {
      icon: <FaEnvelope size={18} />,
      label: 'Email',
      value: 'tawhideh.b10@gmail.com',
      href: 'mailto:tawhideh.b10@gmail.com',
      color: '#6366f1',
      colorRgb: '99,102,241',
    },
    {
      icon: <FaPhone size={18} />,
      label: 'Phone',
      value: '+880 1745413122',
      href: 'tel:+8801745413122',
      color: '#22c55e',
      colorRgb: '34,197,94',
    },
  ];

  const inputClass = (name) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-600 outline-none transition-all duration-300 ${
      focused === name
        ? 'border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0b0b0f 0%, #0f0b1a 50%, #0b0b0f 100%)' }}
    >
      {/* Background orbs */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <FloatingOrb color="#6366f1" style={{ width: 500, height: 500, top: -100, right: -120 }} />
        <FloatingOrb color="#a855f7" style={{ width: 380, height: 380, bottom: 0, left: -100 }} />
        <FloatingOrb color="#22d3ee" style={{ width: 260, height: 260, top: '40%', left: '45%' }} />
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
            Contact
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight"
          >
            Get In{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Touch
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed"
          >
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }}
          />
        </div>

        {/* ── Two column layout ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Contact Info ── */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, y: 50 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-5/12"
          >
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 flex flex-col gap-8">

              {/* Title */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">Reach Out</p>
                <h3 className="text-2xl font-bold text-white">Contact Information</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Feel free to reach out through any of these channels. I typically respond within 24 hours.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={leftInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ background: `rgba(${item.colorRgb}, 0.12)`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                        {item.value}
                      </p>
                    </div>
                    <FaArrowRight
                      className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: item.color }}
                    />
                  </motion.a>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10" />

              {/* Social links */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-600 mb-4">Connect With Me</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={leftInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      whileHover={{ y: -4, scale: 1.12 }}
                      className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-200 hover:border-white/20"
                      style={{ background: social.bg, color: social.color }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={leftInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
                className="mt-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border border-green-500/20 bg-green-500/5"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  Currently <span className="text-green-400 font-semibold">available</span> for freelance & full-time roles
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, y: 50 }}
            animate={rightInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-7/12"
          >
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">Message</p>
                <h3 className="text-2xl font-bold text-white">Send Me a Message</h3>
              </div>

              <form ref={form} onSubmit={sendEmail} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={rightInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className={inputClass('name')}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={rightInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className={inputClass('email')}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={rightInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Project discussion, collaboration..."
                    className={inputClass('subject')}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused('')}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={rightInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 }}
                >
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Hello, I would like to talk about..."
                    className={inputClass('message')}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('')}
                    required
                  />
                </motion.div>

                <input type="hidden" name="time" value={sentTime} />

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={rightInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: loading
                        ? 'rgba(99,102,241,0.5)'
                        : 'linear-gradient(135deg, #6366f1, #a855f7)',
                      boxShadow: '0 0 30px rgba(99,102,241,0.3)',
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-xs" />
                        Send Message
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <FaArrowRight className="text-xs" />
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Success / Error messages */}
                {success === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/25 bg-green-500/8 text-green-400 text-sm font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                    Message sent successfully! I'll get back to you soon 🎉
                  </motion.div>
                )}
                {success === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/8 text-red-400 text-sm font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    Oops! Something went wrong. Please try again.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;