import { motion } from 'framer-motion';
import { FaGraduationCap, FaCode, FaHeart, FaLaptopCode } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const About = () => {
  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        viewport={{ once: true }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          About <span className="text-indigo-400">Me</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="backdrop-blur-lg bg-white/5 rounded-xl p-8 shadow-2xl border border-white/10 hover:border-indigo-400/30 transition-all duration-300 h-full">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-600/20 rounded-lg mr-4">
                  <FaGraduationCap className="text-2xl text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Education</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  Currently pursuing <span className="text-indigo-300 font-medium">Diploma in Computer Science</span> at Borak Polytechnic Institute (5th Semester).
                </p>
                <div className="flex items-center text-sm text-indigo-300">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  <span>CGPA: 3.85/4.00 (Top 5% of class)</span>
                </div>
                <div className="flex items-center text-sm text-indigo-300">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  <span>Expected Graduation: december 2026</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tech Journey Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="backdrop-blur-lg bg-white/5 rounded-xl p-8 shadow-2xl border border-white/10 hover:border-indigo-400/30 transition-all duration-300 h-full">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-600/20 rounded-lg mr-4">
                  <FaLaptopCode className="text-2xl text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Tech Journey</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  Passionate about building 
                  <TypeAnimation
                    sequence={[
                      'web applications',
                      2000,
                      'responsive UIs',
                      2000,
                      'Frontend: React projects',
                      2000,
                      'Familiar with MERN stack',
                      2000
                    ]}
                    wrapper="span"
                    cursor={true}
                    repeat={Infinity}
                    style={{ display: 'inline-block', color: '#a78bfa', marginLeft: '4px' }}
                  />
                </p>
                <div className="flex items-center text-sm text-indigo-300">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  <span>500+ hours of coding in 2025</span>
                </div>
                <div className="flex items-center text-sm text-indigo-300">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  <span>10+ projects completed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Passion Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 backdrop-blur-lg bg-white/5 rounded-xl p-8 shadow-2xl border border-white/10 hover:border-indigo-400/30 transition-all duration-300"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 bg-indigo-600/20 rounded-lg mr-4">
              <FaHeart className="text-2xl text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Beyond Coding</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-indigo-300 font-medium mb-2">Hobbies</h4>
              <ul className="space-y-2">
                {['Photography', 'Gaming', 'Reading Tech Blogs', 'Open Source Contributing'].map((hobby, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                    {hobby}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-indigo-300 font-medium mb-2">Current Focus</h4>
              <ul className="space-y-2">
                {['Mastering React Performance', 'Learning Next.js', 'Building Portfolio', 'Preparing for Internships'].map((focus, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                    {focus}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;