'use client';

import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaArrowRight, FaLinkedin, FaGithub, FaTwitter, FaFacebook } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

/* ── Floating orb ── */
const FloatingOrb = ({ color, style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-[0.07] pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -25, 0], scale: [1, 1.07, 1] }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const Contact = () => {
  const form = useRef();
  const sectionRef = useRef(null);
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [leftRef, leftInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [rightRef, rightInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [content, setContent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.contact) {
          setContent(data.data.contact);
        }
      })
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const sentTime = new Date().toLocaleTimeString();

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    emailjs
      .sendForm(
        'service_04944c6',
        'template_n3o84y4',
        form.current,
        'Y4w43o77L3V-6wG8f'
      )
      .then(
        () => {
          setLoading(false);
          setSuccess(true);
          form.current.reset();
          setTimeout(() => setSuccess(null), 6000);
        },
        () => {
          setLoading(false);
          setSuccess(false);
          setTimeout(() => setSuccess(null), 6000);
        }
      );
  };

  const contactDetails = [
    {
      icon: <FaEnvelope className="text-indigo-400" size={18} />,
      label: 'Email',
      value: content?.email || 'tawhideh.b10@gmail.com',
      href: `mailto:${content?.email || 'tawhideh.b10@gmail.com'}`,
      color: '#6366f1',
      rgb: '99, 102, 241',
    },
    {
      icon: <FaPhoneAlt className="text-emerald-400" size={18} />,
      label: 'Phone / WhatsApp',
      value: content?.phone || '+880 1745413122',
      href: `tel:${(content?.phone || '+880 1745413122').replace(/\s/g, '')}`,
      color: '#10b981',
      rgb: '16, 185, 129',
    },
    {
      icon: <FaMapMarkerAlt className="text-pink-400" size={18} />,
      label: 'Location',
      value: content?.address || 'Dhaka, Bangladesh',
      href: null,
      color: '#ec4899',
      rgb: '236, 72, 153',
    },
  ];

  const socialLinks = [
    {
      icon: <FaLinkedin size={18} />,
      url: content?.socials?.linkedin || 'https://www.linkedin.com/in/tawhide-hasan-bejoy/',
      name: 'LinkedIn',
      color: '#0077b5',
      rgb: '0, 119, 181',
    },
    {
      icon: <FaGithub size={18} />,
      url: content?.socials?.github || 'https://github.com/Tawhide16',
      name: 'GitHub',
      color: '#ffffff',
      rgb: '255, 255, 255',
    },
    {
      icon: <FaTwitter size={18} />,
      url: content?.socials?.twitter || 'https://x.com/TawhideB64383',
      name: 'Twitter',
      color: '#1da1f2',
      rgb: '29, 161, 242',
    },
    {
      icon: <FaFacebook size={18} />,
      url: content?.socials?.facebook || 'https://www.facebook.com/tawhide.hb',
      name: 'Facebook',
      color: '#1877f2',
      rgb: '24, 119, 242',
    },
  ];

  const inputClass = (name) =>
    `w-full px-4 py-3.5 rounded-xl border text-sm text-white placeholder-gray-600 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 outline-none ${
      focused === name
        ? 'border-indigo-500 bg-indigo-500/[0.06] shadow-[0_0_20px_rgba(99,102,241,0.2)]'
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0b0b0f 0%, #0d0a18 50%, #0b0b0f 100%)' }}
    >
      {/* Background orbs */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <FloatingOrb color="#6366f1" style={{ width: 480, height: 480, top: -100, right: -100 }} />
        <FloatingOrb color="#a855f7" style={{ width: 380, height: 380, bottom: -50, left: -100 }} />
        <FloatingOrb color="#ec4899" style={{ width: 260, height: 260, top: '40%', left: '50%' }} />
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
            Get In Touch
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight"
          >
            Let&apos;s Work{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Together
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed"
          >
            Have a project in mind, a question, or a collaboration opportunity? My inbox is always open.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #6366f1, transparent)' }}
          />
        </div>

        {/* ── Content Grid ── */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left: Contact Info ── */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, y: 50 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-5/12 flex flex-col gap-6"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 flex flex-col gap-6 h-full">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">Reach Out</p>
                <h3 className="text-2xl font-bold text-white mb-2">Contact Information</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Feel free to reach out via email, phone, or find me on social media platforms.
                </p>
              </div>

              {/* Detail cards */}
              <div className="space-y-4">
                {contactDetails.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={leftInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-white/15 transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `rgba(${item.rgb}, 0.12)` }}
                    >
                      {item.icon}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-white truncate">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-600 mb-4">Find Me Online</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={leftInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      whileHover={{ y: -4, scale: 1.1 }}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
                      style={{ hoverBorderColor: social.color }}
                    >
                      <span style={{ color: social.color }}>{social.icon}</span>
                      {social.name}
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
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                    Message sent successfully! I&apos;ll get back to you soon 🎉
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