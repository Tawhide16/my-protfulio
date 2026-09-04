'use client';

import { motion } from 'framer-motion';
import profileImg from '../assets/profile-new.jpg';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaArrowRight } from 'react-icons/fa';
import { FiMapPin, FiFileText } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

const socialLinks = [
  { icon: <FaGithub size={16} />, url: "https://github.com/Tawhide16", name: "GitHub" },
  { icon: <FaTwitter size={16} />, url: "https://x.com/TawhideB64383", name: "Twitter" },
  { icon: <FaLinkedin size={16} />, url: "https://www.linkedin.com/in/tawhide-hasan-bejoy/", name: "LinkedIn" },
  { icon: <FaFacebook size={16} />, url: "https://www.facebook.com/tawhide.hb", name: "Facebook" },
];

const Hero = () => {
  const [heroContent, setHeroContent] = useState(null);
  const [processedImg, setProcessedImg] = useState(profileImg);

  useEffect(() => {
    fetch(`${API_BASE}/content`)
      .then(res => res.json())
      .then(data => {
        if (data && data.hero) setHeroContent(data.hero);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = profileImg;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const width = canvas.width;
      const height = canvas.height;

      const visited = new Uint8Array(width * height);
      const queue = [];

      const enqueue = (x, y) => {
        const idx = y * width + x;
        if (!visited[idx]) {
          visited[idx] = 1;
          queue.push(idx);
        }
      };

      for (let x = 0; x < width; x++) {
        enqueue(x, 0);
        enqueue(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        enqueue(0, y);
        enqueue(width - 1, y);
      }

      let head = 0;
      while (head < queue.length) {
        const idx = queue[head++];
        const x = idx % width;
        const y = Math.floor(idx / width);
        const rIdx = idx * 4;

        const r = data[rIdx];
        const g = data[rIdx + 1];
        const b = data[rIdx + 2];

        if (r > 200 && g > 200 && b > 200) {
          data[rIdx + 3] = 0;
          if (x > 0) enqueue(x - 1, y);
          if (x < width - 1) enqueue(x + 1, y);
          if (y > 0) enqueue(x, y - 1);
          if (y < height - 1) enqueue(x, y + 1);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setProcessedImg(canvas.toDataURL('image/png'));
    };
  }, []);

  // Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-screen w-full bg-[#080711] text-white flex items-center justify-center overflow-hidden font-jakarta pt-24 pb-16 lg:py-24 bg-hero-grid"
    >
      {/* ── Ambient Radial Glow background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Violet glow behind right avatar */}
        <div className="absolute right-[-5%] lg:right-[5%] top-1/2 -translate-y-1/2 w-[450px] lg:w-[600px] h-[450px] lg:h-[600px] bg-purple-600/20 rounded-full blur-[140px] transform-gpu" />
        {/* Soft blue glow on top-left */}
        <div className="absolute left-[-10%] top-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] transform-gpu" />
      </div>

      {/* ── Main Content Container ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column: Content & Details ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-left z-10"
          >
            {/* Top Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141424]/90 border border-white/10 text-xs sm:text-sm text-gray-300 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium text-gray-200">{heroContent?.badge || "Web Developer @ Softvence"}</span>
                <span className="text-gray-500 font-bold">·</span>
                <div className="flex items-center gap-1.5 text-purple-400">
                  <FiMapPin className="text-xs sm:text-sm text-purple-400" />
                  <span className="text-gray-300">{heroContent?.location || "Dhaka, BD"}</span>
                </div>
              </div>
            </motion.div>

            {/* Main Name Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-extrabold text-white tracking-tight leading-[1.1] mb-4"
            >
              {heroContent?.name || "Tawhid Hasan"}{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
                {heroContent?.highlightedName || "Bejoy"}
              </span>
            </motion.h1>

            {/* Role Subheading */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 text-xl sm:text-2xl md:text-3xl font-fira text-gray-200 font-medium mb-6 tracking-wide"
            >
              <span className="text-purple-400 font-bold">&gt;</span>
              <span>{heroContent?.role || "React.js Developer"}</span>
            </motion.div>

            {/* Bio Description */}
            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mb-8 font-normal"
            >
              {heroContent?.bio || "Building clean, performant web experiences — from full-stack MERN apps to custom Shopify stores. Currently working on-site at Softvence Agency."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <a
                href="#projects"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.75)] hover:scale-[1.02] transition-all duration-300 active:scale-95"
              >
                <span>View My Work</span>
                <FaArrowRight className="text-xs" />
              </a>
              <a
                href={heroContent?.resumeUrl || "/resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#151526] hover:bg-[#1d1d34] border border-white/10 hover:border-white/25 text-white font-medium text-sm sm:text-base flex items-center gap-2.5 transition-all duration-200"
              >
                <FiFileText className="text-base text-gray-300" />
                <span>Resume</span>
              </a>
            </motion.div>

            {/* Social Links Row */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 pt-2"
            >
              <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase font-mono">
                FOLLOW
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    whileHover={{ y: -2, scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-[#141424] border border-white/10 hover:border-purple-500/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-950/40 transition-all duration-200"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Avatar Widget ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
          >
            <div className="relative group">
              {/* Outer Glowing Gradient Ring */}
              <div className="relative p-1.5 sm:p-2 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-600 shadow-[0_0_55px_rgba(168,85,247,0.4)]">
                {/* Circle Container with Dynamic Background Color */}
                <div
                  className="w-72 h-72 sm:w-88 sm:h-88 md:w-[380px] md:h-[380px] rounded-full overflow-hidden flex items-end justify-center relative transition-colors duration-300"
                  style={{ backgroundColor: heroContent?.avatarBgColor || '#ff9900' }}
                >
                  <img
                    src={heroContent?.avatarUrl || processedImg}
                    alt={heroContent?.name || "Tawhid Hasan Bejoy"}
                    className="h-auto block drop-shadow-xl transform group-hover:scale-105 transition-all duration-300"
                    style={{
                      width: `${heroContent?.avatarScale || 88}%`,
                      transform: `translate(${heroContent?.avatarOffsetX || 0}px, ${heroContent?.avatarOffsetY || 0}px)`,
                      objectFit: heroContent?.avatarFit || 'cover',
                      objectPosition: 'top',
                    }}
                  />
                </div>
              </div>

              {/* Status Badge floating at bottom */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 z-20">
                <div className="inline-flex items-center gap-2 bg-[#0c0d18]/95 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-2xl whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{heroContent?.statusText || "Seeking Growth Opportunities"}</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;