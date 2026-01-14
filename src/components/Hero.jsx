import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import profileImg from '../assets/profile-img-2.jpg';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaFileDownload } from 'react-icons/fa';

const Hero = () => {
  const socialLinks = [
    {
      icon: <FaGithub className="text-xl text-white" />,
      url: "https://github.com/Tawhide16",
      name: "GitHub"
    },
    {
      icon: <FaTwitter className="text-xl text-white" />,
      url: "https://x.com/TawhideB64383",
      name: "Twitter"
    },
    {
      icon: <FaLinkedin className="text-xl text-white" />,
      url: "https://www.linkedin.com/in/tawhide-hasan-bejoy/",
      name: "LinkedIn"
    },
    {
      icon: <FaFacebook className="text-xl text-white" />,
      url: "https://www.facebook.com/tawhide.hb",
      name: "Facebook"
    }
  ];

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </motion.div>

      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-between relative z-10 min-h-[90vh]">
        {/* Profile Image - On top for mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative order-1 lg:order-2 mb-8 lg:mb-0"
        >
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-md animate-pulse"></div>
            <motion.img
              src={profileImg}
              alt="Tawhid Hasan Bejoy"
              className="relative z-10 w-full h-full object-cover rounded-full border-4 border-white/10 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
            className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm"
          >
            <span className="font-bold">Available</span>
          </motion.div>
        </motion.div>

        {/* Text Content - Below image on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 text-center lg:text-left order-2 lg:order-1 mt-0 lg:mt-0"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6"
          >
            Tawhid Hasan <span className="text-indigo-400">Bejoy</span>
          </motion.h1>

          <div className="text-xl md:text-2xl lg:text-3xl font-mono text-gray-300 mb-6 md:mb-8 h-10 md:h-12">
            <TypeAnimation
              sequence={[
                'Diploma in Computer Science',
                2000,
                'Frontend Developer',
                2000,
                'Junior MERN Developer',
                2000,
                'React.js Expert',
                2000
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              style={{ display: 'inline-block' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={() => {
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1 text-sm sm:text-base"
            >
              View My Work
            </button>
            <a
              href="/Tawhide-hasan-bejoy-official(5).pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-2 sm:px-8 sm:py-3 border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
            >
              <FaFileDownload className="mr-2" />
              Resume
            </a>
          </motion.div>

          {/* Social Icons with proper react-icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center lg:justify-start gap-3 sm:gap-4 mt-8 md:mt-12"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -5 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label={social.name}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, repeat: Infinity, repeatType: 'reverse', duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 sm:w-8 sm:h-14 border-2 border-indigo-400 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;