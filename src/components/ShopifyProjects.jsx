// components/ShopifyProjects.js
import { FaExternalLinkAlt, FaShopify } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SiShopify, SiReact, SiNodedotjs } from 'react-icons/si';

// Shopify specific tech icons
const shopifyTechIcons = {
  Shopify: <SiShopify className="text-green-600 text-lg" />,
  'Liquid Template': <div className="text-green-500 text-lg font-bold">L</div>,
  'Shopify API': <FaShopify className="text-green-500 text-lg" />,
  'React': <SiReact className="text-sky-500 text-lg" />,
  'Node.js': <SiNodedotjs className="text-green-600 text-lg" />,
  'Next.js': <div className="text-lg font-bold">▲</div>,
};

// Shopify Projects Array
const shopifyProjects = [
  {
    id: 'shopify-1',
    title: 'Premium Fashion Store',
    description: 'A fully customized Shopify store with advanced product filtering, quick view, and seamless checkout experience.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API', 'React'],
    features: [
      'Custom Shopify theme development',
      'Advanced product filtering',
      'Quick view functionality',
      'Mobile-first responsive design',
      'SEO optimized pages',
      'Fast loading performance'
    ],
    accentColor: 'bg-green-600',
    liveLink: 'https://your-fashion-store.myshopify.com/',
    gitLinkClient: '#',
    image1: '/shopify-fashion.png',
    type: 'shopify'
  },
  {
    id: 'shopify-2',
    title: 'Electronics E-Commerce',
    description: 'Shopify store for electronics with inventory management, variant handling, and integrated analytics.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API', 'Next.js'],
    features: [
      'Product variant management',
      'Real-time inventory tracking',
      'Customer review system',
      'Abandoned cart recovery',
      'Multi-currency support',
      'Order fulfillment system'
    ],
    accentColor: 'bg-emerald-600',
    liveLink: 'https://your-electronics-store.myshopify.com/',
    gitLinkClient: '#',
    image1: '/shopify-electronics.png',
    type: 'shopify'
  },
  {
    id: 'shopify-3',
    title: 'Custom Shopify App - Analytics',
    description: 'A custom Shopify app that provides advanced analytics and sales reporting for store owners.',
    technologies: ['Shopify', 'Shopify API', 'React', 'Node.js'],
    features: [
      'Sales performance dashboard',
      'Customer behavior analytics',
      'Inventory forecasting',
      'Custom report generation',
      'Real-time notifications',
      'API integration'
    ],
    accentColor: 'bg-teal-600',
    liveLink: 'https://apps.shopify.com/your-analytics-app',
    gitLinkClient: '#',
    image1: '/shopify-analytics.png',
    type: 'shopify'
  },
  {
    id: 'shopify-4',
    title: 'Beauty & Cosmetics Store',
    description: 'Shopify store for beauty products with subscription service, product recommendations, and loyalty program.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: [
      'Subscription box system',
      'Product recommendation engine',
      'Loyalty points program',
      'Gift card integration',
      'Blog and content marketing',
      'Social media integration'
    ],
    accentColor: 'bg-green-500',
    liveLink: 'https://your-beauty-store.myshopify.com/',
    gitLinkClient: '#',
    image1: '/shopify-beauty.png',
    type: 'shopify'
  }
];

// Shopify Project Card Component
const ShopifyProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      delay: index * 0.15,
      ease: [0.16, 1, 0.3, 1]
    }}
    viewport={{ once: true, margin: "-100px" }}
    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 backdrop-blur-sm border border-green-800/50 hover:border-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
  >
    {/* Shopify accent gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative p-6">
      {/* Shopify Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-bold text-white">
            {project.title}
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded-full flex items-center">
            <FaShopify className="mr-1" />
            Shopify
          </span>
        </div>
        <div className="flex space-x-2">
          {project.technologies.map(tech => (
            <span key={tech} className="text-lg" title={tech}>
              {shopifyTechIcons[tech]}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-300 mb-5 leading-relaxed">
        {project.description}
      </p>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-green-300 mb-2">E-COMMERCE FEATURES</h4>
        <ul className="space-y-2">
          {project.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <span className={`inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2`} />
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-green-400 hover:text-green-300 transition-colors px-4 py-2 border border-green-600/50 hover:border-green-400 rounded-lg"
        >
          Live Store
          <FaExternalLinkAlt className="ml-2 text-xs" />
        </a>
        <a
          href={project.gitLinkClient}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 border border-gray-600/50 hover:border-gray-400 rounded-lg"
        >
          View Code
          <FaExternalLinkAlt className="ml-2 text-xs" />
        </a>
      </div>
    </div>
  </motion.div>
);

// Main Shopify Projects Section Component
const ShopifyProjects = () => {
  return (
    <section
      id="shopify-projects"
      className="relative py-24 bg-gradient-to-br from-gray-900 to-gray-950"
    >
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 text-sm font-medium text-green-400 bg-green-900/30 px-4 py-2 rounded-full border border-green-700/50">
            <FaShopify className="inline mr-2" />
            E-COMMERCE SPECIALTY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Shopify <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Store Portfolio</span>
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Custom e-commerce solutions built on Shopify platform with seamless integrations, 
            optimized user experiences, and proven conversion rates.
          </p>
          <div className="w-32 h-1 mx-auto mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  mx-auto">
          {shopifyProjects.map((project, index) => (
            <ShopifyProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 border border-green-700/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Build Your Shopify Store?
            </h3>
            <p className="text-gray-300 mb-6">
              Let's create a custom e-commerce solution that drives sales and grows your business.
            </p>
            <button
              onClick={() => window.open('mailto:your-email@example.com?subject=Shopify Project Inquiry')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border border-green-500 hover:border-green-400 rounded-lg text-white font-semibold transition-all duration-300 group shadow-lg hover:shadow-green-500/25"
            >
              <FaShopify className="mr-3 text-xl" />
              Start Your Shopify Project
              <svg
                className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopifyProjects;