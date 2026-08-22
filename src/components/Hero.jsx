'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import defaultProfileImg from '@/assets/profile-img-2.jpg';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaFileDownload, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import { defaultSiteContent } from '@/data/defaultContent';

const Hero = () => {
  const sectionRef = useRef(null);
  const [content, setContent] = useState(defaultSiteContent.hero);
  const [socials, setSocials] = useState(defaultSiteContent.contact.socials);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.hero) {
            setContent((prev) => ({ ...prev, ...data.data.hero }));
          }
          if (data.data.contact?.socials) {
            setSocials((prev) => ({ ...prev, ...data.data.contact.socials }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const socialLinks = [
    { icon: <FaGithub size={18} />, url: socials?.github || "https://github.com/Tawhide16", name: "GitHub" },
    { icon: <FaTwitter size={18} />, url: socials?.twitter || "https://x.com/TawhideB64383", name: "Twitter" },
    { icon: <FaLinkedin size={18} />, url: socials?.linkedin || "https://www.linkedin.com/in/tawhide-hasan-bejoy/", name: "LinkedIn" },
    { icon: <FaFacebook size={18} />, url: socials?.facebook || "https://www.facebook.com/tawhide.hb", name: "Facebook" },
  ];

  const typeSequence = (content.roles && content.roles.length > 0 ? content.roles : defaultSiteContent.hero.roles)
    .flatMap((role) => [role, 2000]);

  const profileImageSrc = content.profileImg || (typeof defaultProfileImg === 'string' ? defaultProfileImg : defaultProfileImg.src);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center bg-[#08080f]"
    >
      {/* ── Background Gradients & Glow Orbs ── */}
      <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, #a855f7 50%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, #22d3ee 0%, #6366f1 50%, transparent 70%)' }}
        />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        suppressHydrationWarning
      />

      {/* ── Main content ── */}
      <motion.div
        style={{ opacity, maxWidth: '1515px' }}
        className="relative z-10 w-full mx-auto px-6 py-20"
        suppressHydrationWarning
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20" suppressHydrationWarning>

          {/* Left: Text */}
          <motion.div
            style={{ y: textY }}
            className="flex-1 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-300 font-medium">{content.statusBadge || 'Web Developer @ Softvence'}</span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <FaMapMarkerAlt className="text-indigo-400" /> {content.location || 'Dhaka, BD'}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 md:mb-6"
            >
              {content.firstName || 'Tawhid Hasan'}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {content.lastName || 'Bejoy'}
              </span>
            </motion.h1>

            {/* Type animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl lg:text-3xl font-mono text-gray-300 mb-6 md:mb-8 h-10 md:h-12 flex items-center justify-center lg:justify-start gap-2"
            >
              <span className="text-indigo-400">{'>'}</span>
              {typeSequence.length > 0 && (
                <TypeAnimation
                  key={typeSequence.join(',')}
                  sequence={typeSequence}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                />
              )}
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10"
            >
              {content.bio || defaultSiteContent.hero.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative group px-8 py-3.5 rounded-full font-bold text-white text-sm overflow-hidden shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View My Work
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              <a
                href={content.resumeUrl || '/Tawhide-hasan-bejoy-official(5).pdf'}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm border border-white/15 bg-white/5 backdrop-blur-md text-gray-300 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <FaFileDownload className="text-indigo-400" />
                Resume
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase mr-1">Follow</span>
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Profile image with glowing ring & badge */}
          <motion.div
            style={{ y: imgY }}
            className="order-1 lg:order-2 flex-shrink-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Outer glowing pulsing border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1.5 rounded-full opacity-70 blur-xs"
                style={{
                  background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #6366f1)',
                }}
              />

              {/* Profile image container */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-900">
                <img
                  src={profileImageSrc}
                  alt={content.firstName ? `${content.firstName} ${content.lastName}` : "Tawhid Hasan Bejoy"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status pill badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -bottom-3 -left-4 sm:-bottom-4 sm:-left-6 flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-gray-900/90 backdrop-blur-md shadow-xl text-xs font-bold text-white"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
                {content.seekingGrowthText || 'Seeking Growth Opportunities'}
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default Hero;