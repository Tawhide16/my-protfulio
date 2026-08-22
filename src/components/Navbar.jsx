'use client';

import { motion } from 'framer-motion';
import { FaCode, FaUserGraduate, FaTools, FaEnvelope, FaHome, FaGithub, FaLinkedin, FaTwitter, FaFileDownload, FaArrowRight, FaShopify } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('/Tawhide-hasan-bejoy-official(5).pdf');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.hero?.resumeUrl) {
          setResumeUrl(data.data.hero.resumeUrl);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: "home", icon: <FaHome />, text: "Home" },
    { to: "about", icon: <FaUserGraduate />, text: "About" },
    { to: "skills", icon: <FaTools />, text: "Skills" },
    { to: "projects", icon: <FaCode />, text: "Full Stack" },
    { to: "shopify-projects", icon: <FaShopify />, text: "Shopify" },
    { to: "contact", icon: <FaEnvelope />, text: "Contact" },
  ];

  const socialLinks = [
    { url: "https://github.com/Tawhide16", icon: <FaGithub /> },
    { url: "https://www.linkedin.com/in/tawhide-hasan-bejoy/", icon: <FaLinkedin /> },
    { url: "https://x.com/TawhideB64383", icon: <FaTwitter /> },
  ];

  const handleNavClick = (id) => {
    setIsOpen(false);
    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      setPendingScroll(id);
      router.push('/');
    }
  };

  useEffect(() => {
    if (pendingScroll && pathname === '/') {
      const timer = setTimeout(() => {
        const el = document.getElementById(pendingScroll);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        setPendingScroll(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname, pendingScroll]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/[0.07] shadow-2xl"
      style={{
        background: 'rgba(8, 8, 15, 0.08)',
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        boxShadow: '0 1px 40px rgba(99,102,241,0.05), 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16" suppressHydrationWarning>
        <div className="flex items-center justify-between h-16 sm:h-20" suppressHydrationWarning>

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
          <div className="hidden md:flex items-center space-x-1" suppressHydrationWarning>
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
          <div className="md:hidden flex items-center" suppressHydrationWarning>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
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
      </div>
    </header>
  );
};

export default Navbar;
