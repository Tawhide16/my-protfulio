import { motion } from 'framer-motion';
import { FaCode, FaUserGraduate, FaTools, FaEnvelope, FaHome, FaGithub, FaLinkedin, FaTwitter, FaFileDownload } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { Link as ScrollLink, scroller } from 'react-scroll';
import { useNavigate, useLocation } from 'react-router-dom';

// Custom easing for react-scroll
const easeInOutQuad = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "home", icon: <FaHome />, text: "Home" },
    { to: "about", icon: <FaUserGraduate />, text: "About" },
    { to: "skills", icon: <FaTools />, text: "Skills" },
    { to: "projects", icon: <FaCode />, text: "Projects" },
    { to: "contact", icon: <FaEnvelope />, text: "Contact" },
  ];

  const socialLinks = [
    { url: "https://github.com/yourusername", icon: <FaGithub /> },
    { url: "https://linkedin.com/in/yourusername", icon: <FaLinkedin /> },
    { url: "https://twitter.com/yourusername", icon: <FaTwitter /> },
  ];

  const handleNavClick = (id) => {
    if (location.pathname === "/") {
      // Already home → scroll immediately
      scroller.scrollTo(id, {
        duration: 600,
        delay: 0,
        smooth: 'easeInOutQuad',
        offset: -70
      });
    } else {
      // Not on home → navigate then scroll
      setPendingScroll(id);
      navigate("/");
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (pendingScroll && location.pathname === "/") {
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
  }, [location.pathname, pendingScroll]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10 shadow-lg"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-30">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex  flex-shrink-0 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" onClick={() => handleNavClick("home")}>
            Tawhid Hasan <span className='hidden lg:flex md:flex pl-2'>Bejoy</span>
          </motion.div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex justify-center flex-1">
            <div className="flex space-x-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span
                    onClick={() => handleNavClick(item.to)}
                    className="cursor-pointer group relative px-3 py-2 text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.text}
                    <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 w-0 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resume Button */}
          <a
            href="/Tawhide-hasan-bejoy.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition"
          >
            <FaFileDownload /> Resume
          </a>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden px-4 pb-4"
        >
          <div className="space-y-2">
            {navItems.map((item) => (
              <span
                key={item.to}
                onClick={() => handleNavClick(item.to)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center cursor-pointer"
              >
                <span className="mr-2">{item.icon}</span>
                {item.text}
              </span>
            ))}

            {/* Resume Mobile */}
            <a
              href="/Tawhide-hasan-bejoy.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mt-2 px-3 py-3 rounded-md text-base font-medium text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              <FaFileDownload className="mr-2" />
              Resume
            </a>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4 pt-4">
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
  );
};

export default Navbar;
