import { useState, useRef } from 'react';
import { FaExternalLinkAlt, FaShopify, FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { SiShopify, SiReact, SiNodedotjs } from 'react-icons/si';

const shopifyTechIcons = {
  Shopify: <SiShopify className="text-green-400" />,
  'Liquid Template': <span className="text-green-400 font-black text-sm">L</span>,
  'Shopify API': <FaShopify className="text-green-400" />,
  React: <SiReact className="text-sky-400" />,
  'Node.js': <SiNodedotjs className="text-green-500" />,
  'Next.js': <span className="text-white font-black text-sm">▲</span>,
};

const shopifyProjects = [
  {
    id: 'shopify-1',
    title: 'Premium Fashion Store',
    subtitle: 'Luxury Fashion',
    description: 'A fully customized Shopify store with advanced product filtering, quick view, and seamless checkout experience.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API', 'React'],
    features: ['Custom Shopify theme development', 'Advanced product filtering', 'Quick view functionality', 'SEO optimized pages'],
    accentColor: '#22c55e',
    accentRgb: '34, 197, 94',
    liveLink: 'https://semilevi.com/',
    image1: '/semilevi.png',
    number: '01',
  },
  {
    id: 'shopify-2',
    title: 'Ruby Art — Gallery',
    subtitle: 'Art & Jewelry',
    description: 'Born from Nuances of the Night, this line reimagines the exhibition\'s world of metal, desire and transformation into wearable contemporary pieces.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API', 'Next.js'],
    features: ['Product variant management', 'Real-time inventory tracking', 'Customer review system', 'Multi-currency support'],
    accentColor: '#10b981',
    accentRgb: '16, 185, 129',
    liveLink: 'https://rubyart.gr/',
    image1: '/rubyart.png',
    number: '02',
  },
  {
    id: 'shopify-3',
    title: 'Clothing Brand Store',
    subtitle: 'Fashion & Apparel',
    description: 'A modern Shopify store for clothing brand with AR preview, smart search functionality, and seamless UX.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['AR preview capability', 'Smart search with filters', 'Wishlist functionality', 'One-click checkout'],
    accentColor: '#3b82f6',
    accentRgb: '59, 130, 246',
    liveLink: 'https://uma-7769023412.myshopify.com/',
    image1: '/clothing brand.png',
    number: '03',
  },
  {
    id: 'shopify-4',
    title: 'Living Furniture Store',
    subtitle: 'Home & Lifestyle',
    description: 'Shopify store for modern furniture with delivery scheduling, room visualization, and curated collections.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['Room visualization tools', 'Delivery scheduling system', 'Subscription for weekly boxes', 'Farm-to-table tracking'],
    accentColor: '#84cc16',
    accentRgb: '132, 204, 22',
    liveLink: 'https://01living.ae/',
    image1: '/Living-Furniture.png',
    number: '04',
  },
  {
    id: 'shopify-5',
    title: 'Health Care Products',
    subtitle: 'Health & Wellness',
    description: 'Shopify store for health and wellness products with subscription plans and nutrition information display.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['Subscription plans', 'Nutrition information display', 'Meal planning tools', 'Delivery scheduling system'],
    accentColor: '#06b6d4',
    accentRgb: '6, 182, 212',
    liveLink: 'https://0skuy4-v5.myshopify.com/',
    image1: '/Health-Care.png',
    number: '05',
  },
  {
    id: 'shopify-6',
    title: 'Child Gaming Store',
    subtitle: 'Kids & Gaming',
    description: 'Shopify store for children\'s gaming products with fun UI, parental controls and age-based filtering.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['Age-based filtering', 'Parental controls', 'Wishlist functionality', 'Gift wrapping options'],
    accentColor: '#f59e0b',
    accentRgb: '245, 158, 11',
    liveLink: 'https://etiano.myshopify.com/en',
    image1: '/child-gamming.png',
    number: '06',
  },
    {
    id: 'shopify-7',
    title: 'Gym Clothing Store (Men & Women)',
    subtitle: 'FITNESS & APPAREL',
    description: 'A modern Shopify-based gym clothing store designed for both men and women. Built with a clean UI, fast performance, and a smooth shopping experience using custom Liquid development.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['Responsive design for all devices', 'Product filtering & clean shop layout', 'Size guide for better user experience', 'Contact page with user-friendly form','Optimized product pages for conversions','Fast loading & smooth navigation'],
    accentColor: 'rgb(146, 59, 246)',
    accentRgb: '146, 59, 246',
    liveLink: 'https://dan-mass1.myshopify.com/',
    image1: '/dan_mass.png',
    number: '07',
  },
    {
    id: 'shopify-8',
    title: 'Northern Projects – Cycling Clothing Store',
    subtitle: 'SPORTS & CYCLING APPAREL',
    description: 'A high-performance cycling clothing website built with Shopify, focused on delivering a smooth and engaging shopping experience. Designed for cyclists with modern UI, structured navigation, and optimized product browsing.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['Fully responsive and mobile-friendly design', 'Advanced product organization for cycling gear', 'Clean and minimal UI for better user experience', 'Multi-page structured navigation','Optimized product display with detailed information','Smooth browsing and fast performance'],
    accentColor: '#C8102E',
    accentRgb: '200, 16, 46',
    liveLink: 'https://northernprojects.cc/',
    image1: '/northern-projects.png',
    number: '08',
  },
  {
  id: 'shopify-9', // Sequence onusare id set kora hoyeche
  title: 'Pop - Soda & Energy Drink Store',
  subtitle: 'Beverages & Soft Drinks',
  description: 'A vibrant Shopify store for a modern soda brand, featuring high-energy branding, subscription-based savings, and a clean product showcase.',
  technologies: ['Shopify', 'Liquid', 'CSS/Tailwind', 'JavaScript'],
  features: ['Product Subscriptions', 'Variant Selectors', 'Interactive Grid Layout', 'Newsletter Integration'],
  accentColor: '#9d174d',
  accentRgb: '157, 23, 77',
  liveLink: 'https://www.fmcgfuture.com/', // Screenshot-er URL mathay rekhe
  image1: '/pop-soda-store.png',
  number: '09',
}

];

/* ── Floating orb ── */
const FloatingOrb = ({ color, style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-[0.07] pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ y: [0, -25, 0], scale: [1, 1.08, 1] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ── Single card ── */
const ShopifyProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group"
    >
      {/* Glow border */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${project.accentColor}44, transparent 60%)`,
          borderRadius: '1rem',
        }}
      />

      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900/70 backdrop-blur-md flex flex-col h-full"
        style={{
          boxShadow: hovered
            ? `0 0 55px 0 rgba(${project.accentRgb}, 0.18)`
            : '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.4s',
        }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 rounded-t-2xl z-10"
          style={{ background: `linear-gradient(90deg, ${project.accentColor}, transparent)` }}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.25 }}
          viewport={{ once: true }}
        />

        {/* ── Image ── */}
        <div className="relative overflow-hidden h-48 bg-gray-800/60 flex-shrink-0">
          {/* Gradient overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

          {/* Hover color wash */}
          <motion.div
            className="absolute inset-0 z-20"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: `rgba(${project.accentRgb}, 0.12)` }}
          />

          {/* Hover preview button */}
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ scale: 0.85 }}
              animate={{ scale: hovered ? 1 : 0.85 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold shadow-xl"
              style={{ background: project.accentColor }}
            >
              Visit Store <FaExternalLinkAlt className="text-xs" />
            </motion.a>
          </motion.div>

          {/* Number watermark */}
          <span
            className="absolute top-3 right-4 text-4xl font-black leading-none select-none z-10 opacity-20"
            style={{ color: project.accentColor }}
          >
            {project.number}
          </span>

          <motion.img
            src={project.image1}
            alt={project.title}
            className="w-full h-full object-cover object-top"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />

          {/* Shopify badge */}
          <div className="absolute bottom-3 left-4 z-20">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow"
              style={{ background: `rgba(${project.accentRgb}, 0.85)` }}
            >
              <FaShopify />
              Shopify Store
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 p-5">
          {/* Title + subtitle */}
          <div className="mb-3">
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: project.accentColor }}>
              {project.subtitle}
            </p>
            <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed mb-3">{project.description}</p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies.map(tech => (
              <span
                key={tech}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-gray-300"
              >
                {shopifyTechIcons[tech]}
                {tech}
              </span>
            ))}
          </div>

          {/* Features */}
          <ul className="space-y-1 mb-4 flex-1">
            {project.features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 + i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-xs text-gray-400"
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project.accentColor }} />
                {f}
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <div className="pt-3 border-t border-white/10">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold text-white border border-white/10 hover:border-white/20 transition-all duration-200"
              style={{ background: `rgba(${project.accentRgb}, 0.1)` }}
            >
              Visit Live Store
              <motion.span
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaArrowRight style={{ color: project.accentColor }} className="text-xs" />
              </motion.span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Section ── */
const ShopifyProjects = () => {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  // ✅ 3 cards per row — show 6 initially (2 full rows), then all
  const INITIAL_COUNT = 6;
  const displayed = showAll ? shopifyProjects : shopifyProjects.slice(0, INITIAL_COUNT);

  return (
    <section
      id="shopify-projects"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0b0f0b 0%, #0a110a 50%, #0b0f0b 100%)' }}
    >
      {/* Background orbs */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <FloatingOrb color="#22c55e" style={{ width: 500, height: 500, top: -100, left: -150 }} />
        <FloatingOrb color="#10b981" style={{ width: 350, height: 350, bottom: 50, right: -100 }} />
        <FloatingOrb color="#84cc16" style={{ width: 280, height: 280, top: '40%', left: '55%' }} />
      </motion.div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative container mx-auto px-6 max-w-[1500px]">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border text-sm font-semibold"
            style={{
              color: '#22c55e',
              borderColor: 'rgba(34,197,94,0.3)',
              background: 'rgba(34,197,94,0.07)',
            }}
          >
            <FaShopify />
            E-COMMERCE SPECIALTY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight"
          >
            Shopify{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #22c55e, #10b981, #84cc16)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Store Projects
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed"
          >
            Custom e-commerce solutions built on Shopify with seamless integrations, optimized UX, and proven conversion rates.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mx-auto mt-6 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #22c55e, transparent)' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-4 text-sm text-gray-600"
          >
            Showing {displayed.length} of {shopifyProjects.length} projects
          </motion.p>
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayed.map((project, index) => (
              <ShopifyProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* ── Toggle button ── */}
        {shopifyProjects.length > INITIAL_COUNT && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white border transition-all duration-300"
              style={{
                borderColor: 'rgba(34,197,94,0.4)',
                background: 'rgba(34,197,94,0.08)',
              }}
            >
              {showAll ? (
                <>Show Less <FaChevronUp className="text-green-400 text-sm" /></>
              ) : (
                <>View All {shopifyProjects.length} Projects <FaChevronDown className="text-green-400 text-sm" /></>
              )}
            </motion.button>

            {!showAll && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-sm mt-3"
              >
                {shopifyProjects.length - INITIAL_COUNT} more projects waiting
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ShopifyProjects;
