import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    {
      icon: <FaGithub className="text-xl" />,
      url: "https://github.com/Tawhide16",
      name: "GitHub",
      color: "hover:bg-gray-700"
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      url: "https://www.linkedin.com/in/tawhide-hasan-bejoy/",
      name: "LinkedIn",
      color: "hover:bg-blue-600"
    },
    {
      icon: <FaTwitter className="text-xl" />,
      url: "https://x.com/TawhideB64383",
      name: "Twitter",
      color: "hover:bg-sky-500"
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      url: "mailto:tawhideh.b10@gmail.com",
      name: "Email",
      color: "hover:bg-red-500"
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          {/* Name and Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Tawhid Hasan Bejoy
            </h3>
            <p className="text-indigo-400 font-medium">
              Diploma in Computer Science
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-8">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-300 ${link.color} hover:text-white transition-all`}
                aria-label={link.name}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Tawhid Hasan Bejoy. All rights reserved.
            </p>
            <p className="text-gray-600 mt-1">
              Built with React and Tailwind CSS
            </p>
          </div>

          {/* Decorative Element */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mt-8 rounded-full"
          />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;