import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import profileImg from '../assets/Profile.jpg';

const Hero = () => {
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

      <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Tawhid Hasan <span className="text-indigo-400">Bejoy</span>
          </motion.h1>

          <div className="text-2xl md:text-3xl font-mono text-gray-300 mb-8 h-12">
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
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-indigo-500/50 transform hover:-translate-y-1">
              View My Work
            </button>
            <button className="px-8 py-3 border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              Download CV
            </button>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center lg:justify-start gap-4 mt-12"
          >
            {['github', 'linkedin', 'twitter', 'facebook'].map((social, index) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ y: -5 }}
                className="w-12 h-12 bg-gray-800 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <span className="text-white text-xl">{social.charAt(0).toUpperCase()}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
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
            className="absolute -bottom-5 -right-5 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <span className="font-bold">Available</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, repeat: Infinity, repeatType: 'reverse', duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-8 h-14 border-2 border-indigo-400 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-indigo-400 rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;