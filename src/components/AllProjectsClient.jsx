'use client';

import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaArrowRight, FaArrowLeft, FaShopify } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { projects as initialProjects, shopifyProjects as initialShopify } from '@/data/projectsData';

export default function AllProjectsClient() {
  const [filter, setFilter] = useState('all'); // 'all', 'mern', 'shopify'
  const [mernList, setMernList] = useState(initialProjects);
  const [shopifyList, setShopifyList] = useState(initialShopify);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then((r) => r.json()).catch(() => null),
      fetch('/api/shopify-projects').then((r) => r.json()).catch(() => null),
    ]).then(([mernData, shopifyData]) => {
      if (mernData?.success && mernData?.data?.length > 0) setMernList(mernData.data);
      if (shopifyData?.success && shopifyData?.data?.length > 0) setShopifyList(shopifyData.data);
    });
  }, []);

  const displayedProjects =
    filter === 'mern'
      ? mernList.map((p) => ({ ...p, type: 'mern' }))
      : filter === 'shopify'
      ? shopifyList.map((p) => ({ ...p, type: 'shopify' }))
      : [
          ...mernList.map((p) => ({ ...p, type: 'mern' })),
          ...shopifyList.map((p) => ({ ...p, type: 'shopify' })),
        ];

  return (
    <section className="min-h-screen py-28 px-4 sm:px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0b0b0f 0%, #0d0b18 50%, #0b0b0f 100%)' }}>
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors mb-6 group"
          >
            <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" /> Back to Home
          </Link>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            All <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Projects</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Comprehensive portfolio of Full-Stack MERN applications, responsive web apps, and custom Shopify stores.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {[
              { id: 'all', label: `All Projects (${mernList.length + shopifyList.length})` },
              { id: 'mern', label: `MERN & React (${mernList.length})` },
              { id: 'shopify', label: `Shopify Stores (${shopifyList.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border ${
                  filter === tab.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedProjects.map((project, index) => {
            const isShopify = project.type === 'shopify';
            const detailsLink = isShopify ? null : `/projects/${project.id}`;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 group"
              >
                <div>
                  <div className="relative h-56 w-full rounded-xl overflow-hidden mb-5 bg-gray-800">
                    <img
                      src={project.image1}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full text-white shadow ${
                          isShopify ? 'bg-green-600/90' : 'bg-indigo-600/90'
                        }`}
                      >
                        {isShopify ? 'Shopify Store' : 'Full Stack MERN'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: project.accentColor || '#6366f1' }}>
                    {project.subtitle}
                  </p>
                  <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies?.map(tech => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <ul className="mb-6 space-y-1.5 text-xs text-gray-400">
                    {project.features?.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.accentColor || '#6366f1' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Live Demo <FaExternalLinkAlt className="text-xs" />
                    </a>

                    {project.gitLinkClient && (
                      <a
                        href={project.gitLinkClient}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                      >
                        <FaGithub className="text-sm" /> Client
                      </a>
                    )}

                    {project.gitLinkServer && (
                      <a
                        href={project.gitLinkServer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                      >
                        <FaGithub className="text-sm" /> Server
                      </a>
                    )}
                  </div>

                  {detailsLink && (
                    <Link
                      href={detailsLink}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white hover:text-indigo-400 transition-colors"
                    >
                      Details <FaArrowRight className="text-[10px]" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
