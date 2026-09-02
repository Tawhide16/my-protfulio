'use client';

import { motion } from 'framer-motion';
import { FaCode, FaUserGraduate, FaTools, FaEnvelope, FaHome, FaGithub, FaLinkedin, FaTwitter, FaFileDownload, FaArrowRight } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { scroller } from 'react-scroll';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [resumeUrl, setResumeUrl] = useState('/Tawhide-hasan-bejoy-official(5).pdf');

  useEffect(() => {
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(data => {
        if (data?.hero?.resumeUrl) {
          setResumeUrl(data.hero.resumeUrl);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { to: "home", icon: <FaHome />, text: "Home" },
    { to: "about", icon: <FaUserGraduate />, text: "About" },
    { to: "skills", icon: <FaTools />, text: "Skills" },
    { to: "projects", icon: <FaCode />, text: "Projects" },
    { to: "contact", icon: <FaEnvelope />, text: "Contact" },
  ];

  const socialLinks = [
    { url: "https://github.com/Tawhide16", icon: <FaGithub /> },
    { url: "https://linkedin.com/in/tawhide-hasan-bejoy/", icon: <FaLinkedin /> },
    { url: "https://twitter.com/yourusername", icon: <FaTwitter /> },
  ];

  const handleNavClick = (id) => {
    if (pathname === "/") {
      scroller.scrollTo(id, {
        duration: 600,
        delay: 0,
        smooth: 'easeInOutQuad',
        offset: -70
      });
    } else {
      setPendingScroll(id);
      router.push("/");
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (pendingScroll && pathname === "/") {
      setTimeout(() => {
        scroller.scrollTo(pendingScroll, {
          duration: 600,
          delay: 0,
          smooth: 'easeInOutQuad',
          offset: -70
        });
        setPendingScroll(null);
      }, 300);
    }
  }, [pathname, pendingScroll]);

  // Hide the public portfolio navbar on the dashboard
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{
        padding: scrolled ? '0px 0px' : (isMobile ? '0px 0px' : '14px 50px'),
        backgroundColor: scrolled ? 'rgba(8, 7, 17, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'padding 0.45s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full border border-white/15 px-6 sm:px-10 pointer-events-auto"
        style={{
          borderRadius: scrolled ? '0px' : (isMobile ? '0px' : '9999px'),
          backgroundColor: 'rgba(13, 13, 24, 0.45)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
          transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="flex items-center flex-shrink-0 text-lg font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent cursor-pointer select-none"
            onClick={() => handleNavClick("home")}
          >
            <span className="mr-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
              TH
            </span>
            Tawhid Hasan
            <span className="hidden lg:inline pl-1">Bejoy</span>
          </motion.div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <span
                  onClick={() => handleNavClick(item.to)}
                  className="cursor-pointer px-3 py-1.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10 flex items-center gap-1.5 group"
                >
                  <span className="text-gray-500 group-hover:text-indigo-400 transition-colors text-xs">
                    {item.icon}
                  </span>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Resume CTA Button */}
          <motion.a
            href={resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:flex items-center gap-2 px-5 py-2 bg-[#d4f040] text-gray-900 text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:bg-[#c5e832] transition-all duration-200"
          >
            Resume <FaArrowRight className="text-xs" />
          </motion.a>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              {isOpen ? <HiX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden pb-4 pt-1 border-t border-white/10 mt-1"
          >
            <div className="space-y-1 px-2">
              {navItems.map((item) => (
                <span
                  key={item.to}
                  onClick={() => handleNavClick(item.to)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="text-gray-500 text-xs">{item.icon}</span>
                  {item.text}
                </span>
              ))}

              {/* Resume Mobile */}
              <a
                href={resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-full text-sm font-bold bg-[#d4f040] text-gray-900 hover:bg-[#c5e832] transition-all shadow"
              >
                <FaFileDownload /> Resume
              </a>

              {/* Social Icons */}
              <div className="flex justify-center space-x-3 pt-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
};

export default Navbar;
