import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { SiGmail, SiMessenger } from 'react-icons/si';

const Contact = () => {
  const socialLinks = [
    {
      icon: <FaGithub className="text-xl" />,
      url: "https://github.com/yourusername",
      name: "GitHub",
      color: "hover:bg-gray-800"
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      url: "https://linkedin.com/in/yourusername",
      name: "LinkedIn",
      color: "hover:bg-blue-600"
    },
    {
      icon: <SiGmail className="text-xl" />,
      url: "mailto:your.email@example.com",
      name: "Gmail",
      color: "hover:bg-red-500"
    },
    {
      icon: <SiMessenger className="text-xl" />,
      url: "https://m.me/yourusername",
      name: "Messenger",
      color: "hover:bg-blue-400"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 text-sm font-medium text-indigo-400">
            CONTACT
          </span>
          <h2 className="text-4xl font-bold text-white">
            Get In <span className="text-indigo-400">Touch</span>
          </h2>
          <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 h-full border border-gray-700 hover:border-gray-600 transition-all">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-700 rounded-lg text-indigo-400">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium">Email</h4>
                    <a href="mailto:your.email@example.com" className="text-white hover:text-indigo-400 transition-colors">
                      your.email@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-700 rounded-lg text-indigo-400">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium">Phone</h4>
                    <a href="tel:+8801XXXXXXXXX" className="text-white hover:text-indigo-400 transition-colors">
                      +880 1XXX XXXXXX
                    </a>
                  </div>
                </div>

                <div className="pt-6">
                  <h4 className="text-gray-400 text-sm font-medium mb-4">Connect With Me</h4>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        whileHover={{ y: -3 }}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-center p-3 rounded-lg bg-gray-700 text-gray-300 ${social.color} hover:text-white transition-all`}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 h-full border border-gray-700 hover:border-gray-600 transition-all">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Send Me a Message
              </h3>
              
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition-all placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition-all placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Hello, I would like to talk about..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition-all placeholder-gray-500"
                    required
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  <FaPaperPlane />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;