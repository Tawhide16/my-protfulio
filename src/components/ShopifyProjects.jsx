// components/ShopifyProjects.js
import { useState } from 'react';
import { FaExternalLinkAlt, FaShopify, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
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

// Shopify Projects Array - এখন আরো প্রোজেক্ট যোগ করা হলো
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
    liveLink: 'https://semilevi.com/',
    image1: '/semilevi.png',
    type: 'shopify'
  },
  {
    id: 'shopify-2',
    title: 'Ruby Art — Gallery',
    description: 'Born from Nuances of the Night, this line reimagines the exhibition\'s world of metal, desire and transformation into wearable contemporary pieces.',
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
    liveLink: 'https://rubyart.gr/',
    image1: '/rubyart.png',
    type: 'shopify'
  },
  {
    id: 'shopify-5',
    title: 'Clothing Brand Store',
    description: 'A modern Shopify store for tech gadgets with 3D product views, AR preview, and smart search functionality.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: [
      'AR preview capability',
      'Smart search with filters',
      'Wishlist functionality',
      'Cross-selling recommendations',
      'One-click checkout'
    ],
    accentColor: 'bg-blue-600',
    liveLink: 'https://uma-7769023412.myshopify.com/',
    image1: '/public/clothing brand.png',
    type: 'shopify'
  },
  {
    id: 'shopify-6',
    title: 'Living Furniture Store',
    description: 'Shopify store for organic foods with recipe integration, meal planning, and delivery scheduling.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: [
      'Recipe integration with ingredients',
      'Meal planning tools',
      'Delivery scheduling system',
      'Nutrition information display',
      'Subscription for weekly boxes',
      'Farm-to-table tracking'
    ],
    accentColor: 'bg-lime-600',
    liveLink: 'https://01living.ae/',
    image1: '/Living-Furniture.png',
    type: 'shopify'
  },
  {
    id: 'shopify-7',
    title: 'Health Care Products Store',
    description: 'Shopify store for organic foods with recipe integration, meal planning, and delivery scheduling.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: [
      'Recipe integration with ingredients',
      'Meal planning tools',
      'Delivery scheduling system',
      'Nutrition information display',
      'Subscription for weekly boxes',
      'Farm-to-table tracking'
    ],
    accentColor: 'bg-lime-600',
    liveLink: 'https://0skuy4-v5.myshopify.com/',
    image1: '/Health-Care.png',
    type: 'shopify'
  },
  {
    id: 'shopify-8',
    title: 'Child Gaming Store',
    description: 'Shopify store for organic foods with recipe integration, meal planning, and delivery scheduling.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: [
      'Recipe integration with ingredients',
      'Meal planning tools',
      'Delivery scheduling system',
      'Nutrition information display',
      'Subscription for weekly boxes',
      'Farm-to-table tracking'
    ],
    accentColor: 'bg-lime-600',
    liveLink: 'https://etiano.myshopify.com/en',
    image1: '/child-gamming.png',
    type: 'shopify'
  },
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
    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 backdrop-blur-sm border border-green-800/50 hover:border-green-400 transition-all duration-300 shadow-lg hover:shadow-green-500/10 "
  >
    {/* Shopify accent gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Project Image - Full visible with object-contain */}
    <div className="relative h-70 bg-gray-800 flex overflow-hidden ">
      <img 
        src={project.image1} 
        alt={project.title}
        className="w-full p-1 h-full object-contain rounded-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
      <div className="absolute bottom-4 left-6">
        <span className="px-3 py-1 text-sm font-medium bg-green-600 text-white rounded-full flex items-center w-fit">
          <FaShopify className="mr-1" />
          Shopify Store
        </span>
      </div>
    </div>

    <div className="relative p-6">
      {/* Project Title and Technologies */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">
          {project.title}
        </h3>
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

      {/* Live Store Button Only - View Code Removed */}
      <div className="flex justify-end">
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-green-400 hover:text-green-300 transition-colors px-6 py-3 border border-green-600/50 hover:border-green-400 rounded-lg bg-green-900/20 hover:bg-green-900/30"
        >
          Visit Live Store
          <FaExternalLinkAlt className="ml-2 text-xs" />
        </a>
      </div>
    </div>
  </motion.div>
);

// Main Shopify Projects Section Component
const ShopifyProjects = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  
  // প্রথম ৪টি প্রোজেক্ট শো করবে, বাকিগুলো View All এ ক্লিক করলে
  const displayedProjects = showAllProjects 
    ? shopifyProjects 
    : shopifyProjects.slice(0, 4);

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
            Shopify <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Store Projects</span>
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Custom e-commerce solutions built on Shopify platform with seamless integrations, 
            optimized user experiences, and proven conversion rates.
          </p>
          <div className="w-32 h-1 mx-auto mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" />
          
          {/* প্রোজেক্ট কাউন্টার */}
          <div className="mt-4 text-gray-400">
            Showing {displayedProjects.length} of {shopifyProjects.length} projects
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto">
          <AnimatePresence>
            {displayedProjects.map((project, index) => (
              <ShopifyProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* View All Button Section */}
        {shopifyProjects.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-medium text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25  border-1 border-green-600 hover:border-green-400 bg-green-900/20 hover:bg-green-900/30"
            >
              {showAllProjects ? (
                <>
                  Show Less
                  <FaChevronUp className="group-hover:translate-y-[-2px] transition-transform" />
                </>
              ) : (
                <>
                  View All Projects
                  <FaChevronDown className="group-hover:translate-y-[2px] transition-transform" />
                </>
              )}
            </button>
            
            {!showAllProjects && (
              <p className="text-gray-400 mt-4">
                Click to see {shopifyProjects.length - 4} more Shopify projects
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          {/* CTA section commented out as per your request */}
        </motion.div>
      </div>
    </section>
  );
};

export default ShopifyProjects;