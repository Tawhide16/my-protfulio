import { FaReact, FaNodeJs, FaCode,FaShopify } from 'react-icons/fa';
import { SiTailwindcss, SiExpress, SiMongodb, SiFirebase, SiTypescript,SiNextdotjs,SiJavascript} from 'react-icons/si';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills = [
    { name: 'React', icon: <FaReact size={40} />, category: 'Frontend', color: 'text-cyan-400' },
    { name: 'Next.js', icon: <SiNextdotjs size={40} />, category: 'Frontend', color: 'text-gray-800 dark:text-white' },
    { 
    name: 'JavaScript', icon: <SiJavascript size={40} />, 
    category: 'Frontend', 
    color: 'text-yellow-400' 
  },
    { name: 'TypeScript', icon: <SiTypescript size={40} />, category: 'Frontend', color: 'text-blue-600' },
    { name: 'Firebase', icon: <SiFirebase size={40} />, category: 'Backend', color: 'text-amber-500' },
    { name: 'Node.js', icon: <FaNodeJs size={40} />, category: 'Backend', color: 'text-green-500' },
    { name: 'Express', icon: <SiExpress size={40} />, category: 'Backend', color: 'text-gray-400' },
    { name: 'MongoDB', icon: <SiMongodb size={40} />, category: 'Database', color: 'text-emerald-500' },
    { name: 'React Hook Form', icon: <div className="text-4xl font-bold">RHF</div>, category: 'Frontend', color: 'text-pink-500' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss size={40} />, category: 'Frontend', color: 'text-sky-400' },
    // { name: 'TypeScript', icon: <SiTypescript size={40} />, category: 'Frontend', color: 'text-blue-600' },
    { name: 'DaisyUI', icon: <div className="text-4xl font-bold">D</div>, category: 'Frontend', color: 'text-purple-500' },
    { name: 'Shopify', icon: <FaShopify size={40} />, category: 'E-commerce', color: 'text-green-600' },
    { name: 'TanStack Query', 
  icon: <div className="text-4xl font-bold text-red-500">TQ</div>, 
  category: 'Frontend', 
  color: 'text-red-500' 
},
{ 
  name: 'Axios', 
  icon: <div className="text-4xl font-bold text-purple-600">AX</div>, 
  category: 'Frontend', 
  color: 'text-purple-600' 
},

  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section id="skills" className="relative py-24 bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-500 filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-cyan-500 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          ref={ref}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <FaCode className="text-3xl text-cyan-400 mr-3" />
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              My Skills
            </h2>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Technologies I've worked with and mastered throughout my development journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group perspective-1000"
            >
              <div className="relative h-full transform-style-preserve-3d group-hover:rotate-y-180 transition-transform duration-500 ease-in-out">
                {/* Front of card */}
                <div className="backface-hidden bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
                  <div className={`${skill.color} mb-4`}>{skill.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{skill.name}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                    {skill.category}
                  </span>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 rotate-y-180 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-3">💡</div>
                    <p className="text-sm text-gray-300">Click to see projects using {skill.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;