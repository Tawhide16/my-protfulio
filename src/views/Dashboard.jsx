'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaGlobe,
  FaArrowLeft, FaGithub, FaImage, FaExclamationTriangle,
  FaCheckCircle, FaLayerGroup, FaPalette, FaSortNumericUp,
  FaSignOutAlt, FaLock, FaUser, FaGripVertical, FaMagic,
  FaArrowUp, FaArrowDown, FaCamera, FaCode, FaBriefcase,
  FaGraduationCap, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaExternalLinkAlt, FaCheck, FaSyncAlt, FaShopify
} from 'react-icons/fa';
import { FiMapPin, FiFileText } from 'react-icons/fi';
import Link from 'next/link';

const API_BASE = 'http://localhost:5000/api';
const API_URL = `${API_BASE}/projects`;

const defaultForm = {
  title: '',
  subtitle: '',
  description: '',
  technologies: '',
  features: '',
  accentColor: '#6366f1',
  accentRgb: '99, 102, 241',
  liveLink: '',
  gitLinkClient: '',
  gitLinkServer: '',
  image1: '',
  number: ''
};

/* ── Hex to RGB helper ── */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '99, 102, 241';
};

/* ── Tech stack color dictionary & palette presets ── */
const techColorMap = {
  react: { color: '#06b6d4', rgb: '6, 182, 212' },
  'next.js': { color: '#6366f1', rgb: '99, 102, 241' },
  next: { color: '#6366f1', rgb: '99, 102, 241' },
  node: { color: '#22c55e', rgb: '34, 197, 94' },
  'node.js': { color: '#22c55e', rgb: '34, 197, 94' },
  express: { color: '#94a3b8', rgb: '148, 163, 184' },
  mongodb: { color: '#10b981', rgb: '16, 185, 129' },
  firebase: { color: '#f59e0b', rgb: '245, 158, 11' },
  tailwind: { color: '#38bdf8', rgb: '56, 189, 248' },
  shopify: { color: '#10b981', rgb: '16, 185, 129' },
  vue: { color: '#10b981', rgb: '16, 185, 129' },
  python: { color: '#3b82f6', rgb: '59, 130, 246' },
  javascript: { color: '#facc15', rgb: '250, 204, 21' },
  typescript: { color: '#3b82f6', rgb: '59, 130, 246' },
  stripe: { color: '#6366f1', rgb: '99, 102, 241' }
};

const colorPresets = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Sky', hex: '#38bdf8' }
];

/* ── Extract Dominant / Vibrant Color from Image ── */
const extractDominantColor = (imageSource) => {
  return new Promise((resolve) => {
    if (!imageSource || typeof window === 'undefined') {
      return resolve({ hex: '#6366f1', rgb: '99, 102, 241' });
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve({ hex: '#6366f1', rgb: '99, 102, 241' });

        const sampleSize = 64;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        let bestR = 99, bestG = 102, bestB = 241;
        let maxScore = -1;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 128) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const brightness = (max + min) / 2;

          if (brightness < 35 || brightness > 230 || delta < 25) continue;

          const saturation = delta / max;
          const score = saturation * 250 + (brightness >= 70 && brightness <= 190 ? 80 : 0);

          if (score > maxScore) {
            maxScore = score;
            bestR = r;
            bestG = g;
            bestB = b;
          }
        }

        if (maxScore === -1) {
          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          for (let i = 0; i < imgData.length; i += 16) {
            sumR += imgData[i];
            sumG += imgData[i + 1];
            sumB += imgData[i + 2];
            count++;
          }
          if (count > 0) {
            bestR = Math.round(sumR / count);
            bestG = Math.round(sumG / count);
            bestB = Math.round(sumB / count);
          }
        }

        const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
        const hex = `#${toHex(bestR)}${toHex(bestG)}${toHex(bestB)}`;
        const rgb = `${bestR}, ${bestG}, ${bestB}`;
        resolve({ hex, rgb });
      } catch (err) {
        console.warn('extractDominantColor fallback:', err);
        resolve({ hex: '#6366f1', rgb: '99, 102, 241' });
      }
    };

    img.onerror = () => {
      resolve({ hex: '#6366f1', rgb: '99, 102, 241' });
    };

    img.src = imageSource;
  });
};

/* ── Smart Text Parser ── */
const parseProjectDetailsFromText = (rawText) => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return {};

  let title = '';
  let subtitle = '';
  let description = '';
  const features = [];
  const technologies = [];
  let liveLink = '';
  let gitLinkClient = '';
  let gitLinkServer = '';

  const knownTechs = [
    'React', 'Next.js', 'Node.js', 'Express', 'Express.js', 'MongoDB',
    'Firebase', 'Tailwind CSS', 'Tailwind', 'TypeScript', 'JavaScript',
    'Shopify', 'Stripe', 'Redux', 'JWT', 'HTML', 'CSS', 'PostgreSQL',
    'MySQL', 'Docker', 'AWS', 'Framer Motion', 'Socket.io', 'GraphQL'
  ];

  // Scan for tech keywords across whole text
  knownTechs.forEach(tech => {
    const regex = new RegExp(`\\b${tech.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(rawText) && !technologies.includes(tech)) {
      technologies.push(tech);
    }
  });

  // Extract URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = rawText.match(urlRegex) || [];
  matches.forEach(url => {
    if (url.includes('github.com')) {
      if (!gitLinkClient) gitLinkClient = url;
      else if (!gitLinkServer) gitLinkServer = url;
    } else if (!liveLink) {
      liveLink = url;
    }
  });

  // Line-by-line classification
  const descLines = [];
  lines.forEach((line, index) => {
    // Check explicit keys
    const lower = line.toLowerCase();
    if (lower.startsWith('title:')) {
      title = line.replace(/title:/i, '').trim();
    } else if (lower.startsWith('subtitle:') || lower.startsWith('tagline:') || lower.startsWith('category:')) {
      subtitle = line.replace(/^(subtitle|tagline|category):/i, '').trim();
    } else if (lower.startsWith('desc:') || lower.startsWith('description:')) {
      descLines.push(line.replace(/^(desc|description):/i, '').trim());
    } else if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || /^\d+\./.test(line)) {
      const cleanFeature = line.replace(/^[-*•\d.]+\s*/, '').trim();
      if (cleanFeature) features.push(cleanFeature);
    } else if (index === 0 && !title) {
      title = line.replace(/^[#\s]+/, '').trim();
    } else if (index === 1 && !subtitle && !line.includes('http')) {
      subtitle = line;
    } else if (!line.includes('http') && !line.toLowerCase().startsWith('tech:')) {
      descLines.push(line);
    }
  });

  if (descLines.length > 0) {
    description = descLines.join(' ');
  }

  // Pick smart accent color based on technologies or title
  let accentColor = '#6366f1';
  for (const t of technologies) {
    const key = t.toLowerCase();
    if (techColorMap[key]) {
      accentColor = techColorMap[key].color;
      break;
    }
  }

  return {
    title: title || 'New Awesome Project',
    subtitle: subtitle || (technologies.length > 0 ? `${technologies[0]} Web Application` : 'Full-Stack Application'),
    description: description || 'A comprehensive, responsive web application engineered for optimal performance and modern user experience.',
    technologies: technologies.join(', '),
    features: features.join('\n'),
    accentColor,
    accentRgb: hexToRgb(accentColor),
    liveLink,
    gitLinkClient,
    gitLinkServer
  };
};

/* ── Field wrapper ── */
const Field = ({ label, icon, children, tip }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        <span className="text-indigo-400">{icon}</span>
        {label}
      </label>
      {tip && <span className="text-[10px] text-gray-500">{tip}</span>}
    </div>
    {children}
  </div>
);

const inputCls =
  'w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 text-sm transition-all duration-200';

/* ── Delete Confirm Modal ── */
const DeleteModal = ({ projectTitle, onConfirm, onCancel }) => (
  <AnimatePresence>
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 20 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-slate-950/95 border border-red-500/30 rounded-2xl p-7 max-w-sm w-full shadow-2xl backdrop-blur-md"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <FaExclamationTriangle size={22} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Delete Project?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              You're about to permanently delete{' '}
              <span className="text-white font-semibold">"{projectTitle}"</span>.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <FaTrash size={11} /> Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

/* ── Unified Edit Card Modal (For Portfolio and Shopify cards) ── */
const CardEditModal = ({ card, isShopify, token, onSave, onClose, showToast }) => {
  const [formData, setFormData] = useState({
    title: card.title || '',
    subtitle: card.subtitle || '',
    description: card.description || '',
    technologies: Array.isArray(card.technologies) ? card.technologies.join(', ') : (card.technologies || ''),
    features: Array.isArray(card.features) ? card.features.join('\n') : (card.features || ''),
    accentColor: card.accentColor || (isShopify ? '#22c55e' : '#6366f1'),
    accentRgb: card.accentRgb || (isShopify ? '34, 197, 94' : '99, 102, 241'),
    liveLink: card.liveLink || '',
    gitLinkClient: card.gitLinkClient || '',
    gitLinkServer: card.gitLinkServer || '',
    image1: card.image1 || '',
    number: card.number || ''
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const upd = { ...prev, [name]: value };
      if (name === 'accentColor') upd.accentRgb = hexToRgb(value);
      return upd;
    });
  };

  const handleModalImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setFormData(prev => ({ ...prev, image1: data.url }));
      showToast('Image uploaded successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const endpoint = isShopify ? `${API_BASE}/shopify-projects/${card._id}` : `${API_BASE}/projects/${card._id}`;
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean)
    };
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update project');
      onSave(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/85 backdrop-blur-md"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative flex flex-col w-full max-w-2xl lg:max-w-3xl max-h-[96vh] sm:max-h-[88vh] bg-[#0e0e1a] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(${formData.accentRgb || '99, 102, 241'}, 0.2)`
        }}
      >
        {/* ── Sticky Header ── */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 bg-[#131325] border-b border-white/10 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border"
              style={{
                background: `rgba(${formData.accentRgb}, 0.15)`,
                borderColor: `rgba(${formData.accentRgb}, 0.35)`,
                color: formData.accentColor
              }}
            >
              {isShopify ? <FaShopify /> : <FaEdit />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-bold text-base sm:text-lg truncate">
                  Edit {isShopify ? 'Shopify' : 'Portfolio'} Card
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border"
                  style={{
                    background: `rgba(${formData.accentRgb}, 0.15)`,
                    borderColor: `rgba(${formData.accentRgb}, 0.3)`,
                    color: formData.accentColor
                  }}
                >
                  #{formData.number || '01'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-gray-300">
                  {isShopify ? 'Shopify Store' : 'Web Project'}
                </span>
              </div>
              <p className="text-gray-400 text-xs truncate max-w-xs sm:max-w-md">
                Editing: <span className="text-white font-medium">"{card.title || 'Untitled Project'}"</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit popup"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer shrink-0 ml-2"
          >
            <FaTimes size={13} />
          </button>
        </div>

        {/* ── Form Container with Scrollable Body & Sticky Footer ── */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Body */}
          <div
            data-lenis-prevent="true"
            className="flex-1 overflow-y-auto px-4 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/15"
          >
            {/* Serial & Card Title */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-1">
                <Field label="Serial #" icon={<FaSortNumericUp size={10} />}>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="01"
                  />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field label="Card Title *" icon={<FaLayerGroup size={10} />}>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="e.g. Next Class or Premium Fashion Store"
                  />
                </Field>
              </div>
            </div>

            {/* Subtitle / Category */}
            <Field label="Subtitle / Tagline *" icon={<FaLayerGroup size={10} />}>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                required
                className={inputCls}
                placeholder="e.g. Education Management Platform or Luxury Fashion"
              />
            </Field>

            {/* Description */}
            <Field label="Description *" icon={<FaLayerGroup size={10} />}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className={inputCls + ' resize-none'}
                placeholder="Overview of the project..."
              />
            </Field>

            {/* Technologies */}
            <Field label="Technologies (comma-separated)" icon={<FaCode size={10} />}>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                className={inputCls}
                placeholder="React, Shopify, Liquid Template, Node.js"
              />
            </Field>

            {/* Feature Bullets */}
            <Field label="Key Features (one bullet per line)" icon={<FaLayerGroup size={10} />}>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={3}
                className={inputCls + ' resize-none'}
                placeholder={`Custom theme development\nProduct filtering & quick view\nSEO optimized pages`}
              />
            </Field>

            {/* Card Thumbnail & Image Upload */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/45 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <FaImage className="text-indigo-400" /> Card Thumbnail Image
                </span>
                {formData.image1 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                    ✓ Image Loaded
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Inputs: File upload and URL */}
                <div className="md:col-span-7 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Upload from Computer:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModalImageUpload}
                      disabled={uploading}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/25 file:text-indigo-300 hover:file:bg-indigo-500/40 cursor-pointer"
                    />
                    {uploading && (
                      <p className="text-xs text-indigo-400 animate-pulse mt-1 flex items-center gap-1.5">
                        <FaSyncAlt className="animate-spin" size={10} /> Uploading image to server...
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Or Image URL / Local Path:
                    </label>
                    <input
                      type="text"
                      name="image1"
                      value={formData.image1}
                      onChange={handleInputChange}
                      required
                      className={inputCls}
                      placeholder="/semilevi.png or https://..."
                    />
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="md:col-span-5">
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Live Preview:
                  </label>
                  <div className="rounded-xl border border-white/15 overflow-hidden bg-black/60 h-28 sm:h-32 flex items-center justify-center relative group">
                    {formData.image1 ? (
                      <>
                        <img src={formData.image1} alt="Card Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[10px] text-gray-300 truncate">{formData.image1}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 text-gray-500">
                        <FaImage className="mx-auto text-xl mb-1 opacity-40" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Accent Color */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/45 space-y-3">
              <Field label="Card Accent Brand Color" icon={<FaPalette size={10} />}>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleInputChange}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 shrink-0"
                  />
                  <input
                    type="text"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="#22c55e"
                  />
                  <div
                    className="hidden sm:flex items-center px-3 py-2 rounded-xl text-xs font-bold border shrink-0"
                    style={{
                      background: `rgba(${formData.accentRgb}, 0.15)`,
                      borderColor: `rgba(${formData.accentRgb}, 0.35)`,
                      color: formData.accentColor
                    }}
                  >
                    Preview Accent
                  </div>
                </div>
              </Field>

              {/* Color Presets */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] text-gray-400">Presets:</span>
                {colorPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        accentColor: preset.hex,
                        accentRgb: hexToRgb(preset.hex)
                      }));
                    }}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-115 transition-transform cursor-pointer shadow-sm relative group"
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  >
                    {formData.accentColor.toLowerCase() === preset.hex.toLowerCase() && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Link */}
            <Field label={isShopify ? 'Live Shopify Store URL *' : 'Live Demo URL *'} icon={<FaGlobe size={10} />}>
              <input
                type="url"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleInputChange}
                required
                className={inputCls}
                placeholder="https://..."
              />
            </Field>

            {/* GitHub Links (Web projects only) */}
            {!isShopify && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="GitHub Client (Optional)" icon={<FaGithub size={10} />}>
                  <input
                    type="url"
                    name="gitLinkClient"
                    value={formData.gitLinkClient}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="https://github.com/..."
                  />
                </Field>
                <Field label="GitHub Server (Optional)" icon={<FaGithub size={10} />}>
                  <input
                    type="url"
                    name="gitLinkServer"
                    value={formData.gitLinkServer}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="https://github.com/..."
                  />
                </Field>
              </div>
            )}
          </div>

          {/* ── Sticky Footer ── */}
          <div className="shrink-0 flex items-center justify-between gap-3 px-5 sm:px-7 py-3.5 bg-[#131325] border-t border-white/10 z-20">
            <span className="hidden sm:inline-block text-xs text-gray-400">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-gray-300">Esc</kbd> or click outside to cancel
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${formData.accentColor}, #4f46e5)`,
                  boxShadow: `0 4px 20px rgba(${formData.accentRgb}, 0.35)`
                }}
              >
                {saving ? (
                  <>
                    <FaSyncAlt className="animate-spin text-xs" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave size={12} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Unified Create Card Modal (For Portfolio and Shopify cards) ── */
const CardCreateModal = ({ isShopify, token, onCreated, onClose, showToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    technologies: isShopify ? 'Shopify, Liquid Template, Shopify API' : 'React, Node.js, MongoDB',
    features: isShopify ? 'Custom theme development\nProduct filtering & quick view\nSEO optimized pages' : 'User authentication\nResponsive design\nSecure API endpoints',
    accentColor: isShopify ? '#22c55e' : '#6366f1',
    accentRgb: isShopify ? '34, 197, 94' : '99, 102, 241',
    liveLink: '',
    gitLinkClient: '',
    gitLinkServer: '',
    image1: '',
    number: ''
  });
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const upd = { ...prev, [name]: value };
      if (name === 'accentColor') upd.accentRgb = hexToRgb(value);
      return upd;
    });
  };

  const handleModalImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setFormData(prev => ({ ...prev, image1: data.url }));
      showToast('Image uploaded successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    const endpoint = isShopify ? `${API_BASE}/shopify-projects` : `${API_BASE}/projects`;
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean)
    };
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create project');
      onCreated(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/85 backdrop-blur-md"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative flex flex-col w-full max-w-2xl lg:max-w-3xl max-h-[96vh] sm:max-h-[88vh] bg-[#0e0e1a] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(${formData.accentRgb || '34, 197, 94'}, 0.2)`
        }}
      >
        {/* ── Sticky Header ── */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 bg-[#131325] border-b border-white/10 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border"
              style={{
                background: `rgba(${formData.accentRgb}, 0.15)`,
                borderColor: `rgba(${formData.accentRgb}, 0.35)`,
                color: formData.accentColor
              }}
            >
              {isShopify ? <FaShopify /> : <FaPlus />}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-base sm:text-lg truncate">
                Add New {isShopify ? 'Shopify' : 'Portfolio'} Card
              </h3>
              <p className="text-gray-400 text-xs truncate">
                Fill details below to create and display a new project card
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close create popup"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer shrink-0 ml-2"
          >
            <FaTimes size={13} />
          </button>
        </div>

        {/* ── Form Container with Scrollable Body & Sticky Footer ── */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Body */}
          <div
            data-lenis-prevent="true"
            className="flex-1 overflow-y-auto px-4 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/15"
          >
            {/* Serial & Card Title */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-1">
                <Field label="Serial #" icon={<FaSortNumericUp size={10} />}>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="08"
                  />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field label="Card Title *" icon={<FaLayerGroup size={10} />}>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="e.g. Modern E-Commerce Store"
                  />
                </Field>
              </div>
            </div>

            {/* Subtitle / Category */}
            <Field label="Subtitle / Tagline *" icon={<FaLayerGroup size={10} />}>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                required
                className={inputCls}
                placeholder="e.g. Luxury Fashion or Full Stack SaaS"
              />
            </Field>

            {/* Description */}
            <Field label="Description *" icon={<FaLayerGroup size={10} />}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className={inputCls + ' resize-none'}
                placeholder="Overview of the project..."
              />
            </Field>

            {/* Technologies */}
            <Field label="Technologies (comma-separated)" icon={<FaCode size={10} />}>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                className={inputCls}
                placeholder="React, Shopify, Liquid Template, Node.js"
              />
            </Field>

            {/* Feature Bullets */}
            <Field label="Key Features (one bullet per line)" icon={<FaLayerGroup size={10} />}>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={3}
                className={inputCls + ' resize-none'}
                placeholder={`Custom theme development\nProduct filtering & quick view\nSEO optimized pages`}
              />
            </Field>

            {/* Card Thumbnail & Image Upload */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/45 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <FaImage className="text-indigo-400" /> Card Thumbnail Image
                </span>
                {formData.image1 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                    ✓ Image Loaded
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Inputs: File upload and URL */}
                <div className="md:col-span-7 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Upload from Computer:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModalImageUpload}
                      disabled={uploading}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/25 file:text-indigo-300 hover:file:bg-indigo-500/40 cursor-pointer"
                    />
                    {uploading && (
                      <p className="text-xs text-indigo-400 animate-pulse mt-1 flex items-center gap-1.5">
                        <FaSyncAlt className="animate-spin" size={10} /> Uploading image to server...
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Or Image URL / Local Path:
                    </label>
                    <input
                      type="text"
                      name="image1"
                      value={formData.image1}
                      onChange={handleInputChange}
                      required
                      className={inputCls}
                      placeholder="/semilevi.png or https://..."
                    />
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="md:col-span-5">
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Live Preview:
                  </label>
                  <div className="rounded-xl border border-white/15 overflow-hidden bg-black/60 h-28 sm:h-32 flex items-center justify-center relative group">
                    {formData.image1 ? (
                      <>
                        <img src={formData.image1} alt="Card Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[10px] text-gray-300 truncate">{formData.image1}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 text-gray-500">
                        <FaImage className="mx-auto text-xl mb-1 opacity-40" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Accent Color */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/45 space-y-3">
              <Field label="Card Accent Brand Color" icon={<FaPalette size={10} />}>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleInputChange}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 shrink-0"
                  />
                  <input
                    type="text"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="#22c55e"
                  />
                  <div
                    className="hidden sm:flex items-center px-3 py-2 rounded-xl text-xs font-bold border shrink-0"
                    style={{
                      background: `rgba(${formData.accentRgb}, 0.15)`,
                      borderColor: `rgba(${formData.accentRgb}, 0.35)`,
                      color: formData.accentColor
                    }}
                  >
                    Preview Accent
                  </div>
                </div>
              </Field>

              {/* Color Presets */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] text-gray-400">Presets:</span>
                {colorPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        accentColor: preset.hex,
                        accentRgb: hexToRgb(preset.hex)
                      }));
                    }}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-115 transition-transform cursor-pointer shadow-sm relative group"
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  >
                    {formData.accentColor.toLowerCase() === preset.hex.toLowerCase() && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Link */}
            <Field label={isShopify ? 'Live Shopify Store URL *' : 'Live Demo URL *'} icon={<FaGlobe size={10} />}>
              <input
                type="url"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleInputChange}
                required
                className={inputCls}
                placeholder="https://..."
              />
            </Field>

            {/* GitHub Links (Web projects only) */}
            {!isShopify && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="GitHub Client (Optional)" icon={<FaGithub size={10} />}>
                  <input
                    type="url"
                    name="gitLinkClient"
                    value={formData.gitLinkClient}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="https://github.com/..."
                  />
                </Field>
                <Field label="GitHub Server (Optional)" icon={<FaGithub size={10} />}>
                  <input
                    type="url"
                    name="gitLinkServer"
                    value={formData.gitLinkServer}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="https://github.com/..."
                  />
                </Field>
              </div>
            )}
          </div>

          {/* ── Sticky Footer ── */}
          <div className="shrink-0 flex items-center justify-between gap-3 px-5 sm:px-7 py-3.5 bg-[#131325] border-t border-white/10 z-20">
            <span className="hidden sm:inline-block text-xs text-gray-400">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-gray-300">Esc</kbd> or click outside to cancel
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${formData.accentColor}, #4f46e5)`,
                  boxShadow: `0 4px 20px rgba(${formData.accentRgb}, 0.35)`
                }}
              >
                {creating ? (
                  <>
                    <FaSyncAlt className="animate-spin text-xs" /> Adding Card...
                  </>
                ) : (
                  <>
                    <FaPlus size={12} /> Add Card
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Toast Notification ── */
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -16, x: 16 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: -16 }}
    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
      type === 'success'
        ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
        : 'bg-red-950/90 border-red-500/40 text-red-300'
    } backdrop-blur-md`}
  >
    {type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
      <FaTimes size={12} />
    </button>
  </motion.div>
);

/* ── Main Dashboard Component ── */
const Dashboard = () => {
  // Authentication states
  const [token, setToken] = useState(null);
  const [adminUser, setAdminUser] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('adminToken');
      const savedUser = localStorage.getItem('adminUsername');
      if (savedToken) setToken(savedToken);
      if (savedUser) setAdminUser(savedUser || '');
    }
  }, []);

  // Active Tab: 'projects' | 'smart-create' | 'hero' | 'about' | 'skills' | 'contact'
  const [activeTab, setActiveTab] = useState('projects');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Shopify Projects state
  const [shopifyProjects, setShopifyProjects] = useState([]);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [savingShopifyOrder, setSavingShopifyOrder] = useState(false);
  const [deleteShopifyTarget, setDeleteShopifyTarget] = useState(null);

  // Edit Modal state (Prominent popup editor for any existing card)
  const [editingCard, setEditingCard] = useState(null);
  const [isEditingShopify, setIsEditingShopify] = useState(false);

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingShopify, setIsCreatingShopify] = useState(false);

  // Smart Quick Box state
  const [smartProjectType, setSmartProjectType] = useState('web'); // 'web' | 'shopify'
  const [smartText, setSmartText] = useState('');
  const [smartImage, setSmartImage] = useState('');
  const [smartParsedData, setSmartParsedData] = useState(defaultForm);
  const [uploadingSmartImg, setUploadingSmartImg] = useState(false);
  const [smartCreating, setSmartCreating] = useState(false);
  const [colorExtractedFromImg, setColorExtractedFromImg] = useState(false);

  // Section Content states
  const [contentLoading, setContentLoading] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [heroData, setHeroData] = useState({
    name: 'Tawhid Hasan',
    highlightedName: 'Bejoy',
    role: 'React.js Developer',
    badge: 'Web Developer @ Softvence',
    location: 'Dhaka, BD',
    bio: 'Building clean, performant web experiences — from full-stack MERN apps to custom Shopify stores. Currently working on-site at Softvence Agency.',
    statusText: 'Seeking Growth Opportunities',
    avatarUrl: '',
    avatarBgColor: '#ff9900',
    avatarScale: 88,
    avatarOffsetX: 0,
    avatarOffsetY: 0,
    avatarFit: 'cover',
    resumeUrl: '/resume.pdf',
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/Tawhide16' },
      { name: 'Twitter', url: 'https://x.com/TawhideB64383' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/tawhide-hasan-bejoy/' },
      { name: 'Facebook', url: 'https://www.facebook.com/tawhide.hb' }
    ]
  });

  const [aboutData, setAboutData] = useState({
    currentPosition: 'Web Developer',
    employmentStatus: 'Currently Working',
    company: 'Softvence Agency',
    location: 'On-Site, Dhaka, BD',
    duration: '2025 – Present',
    bioText: 'Working as a professional web developer at Softvence, building and delivering high-quality client projects.',
    techAtWork: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Shopify'],
    education: {
      degree: 'Diploma in Computer Science',
      institute: 'Borak Polytechnic Institute',
      semester: '7th Semester',
      cgpa: 'CGPA: 3.85 / 4.00 — Top 5% of class',
      graduation: 'Expected Graduation: December 2026',
      coreSubjects: 'Core subjects: DSA, Networking, Web Technology'
    }
  });

  const [skillsData, setSkillsData] = useState([]);
  const [contactData, setContactData] = useState({
    email: 'tawhideh.b10@gmail.com',
    phone: '+880 1836-817816',
    location: 'Dhaka, Bangladesh',
    heading: "Let's create something great together",
    description: 'Have a project in mind, need a full-stack developer, or just want to chat? Reach out anytime!'
  });

  const [toast, setToast] = useState(null);
  const formTopRef = useRef(null);

  /* ── Show Toast Helper ── */
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Logout Helper ── */
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setToken(null);
    setAdminUser('');
    showToast('Logged out successfully.');
  };

  /* ── Fetch Projects ── */
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch {
      showToast('Could not connect to server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch Site Content ── */
  const fetchSiteContent = async () => {
    try {
      setContentLoading(true);
      const res = await fetch(`${API_BASE}/content`);
      if (!res.ok) throw new Error('Failed to fetch site content');
      const data = await res.json();
      if (data.hero) setHeroData(data.hero);
      if (data.about) setAboutData(data.about);
      if (data.skills) setSkillsData(data.skills);
      if (data.contact) setContactData(data.contact);
    } catch {
      console.warn('Using default site content.');
    } finally {
      setContentLoading(false);
    }
  };

  /* ── Fetch Shopify Projects ── */
  const fetchShopifyProjects = async () => {
    try {
      setShopifyLoading(true);
      const res = await fetch(`${API_BASE}/shopify-projects`);
      if (!res.ok) throw new Error('Failed to fetch Shopify projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
          if (a.number && b.number) return a.number.localeCompare(b.number);
          return 0;
        });
        setShopifyProjects(sorted);
      }
    } catch {
      console.warn('Could not fetch Shopify projects.');
    } finally {
      setShopifyLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchShopifyProjects();
      fetchSiteContent();
    }
  }, [token]);

  /* ── Admin Login ── */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      showToast('Please fill in all credentials.', 'error');
      return;
    }
    setLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid credentials');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.admin.username);
      setToken(data.token);
      setAdminUser(data.admin.username);
      setUsernameInput('');
      setPasswordInput('');
      showToast('Welcome back, Admin!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoggingIn(false);
    }
  };

  /* ── Save Reordered Projects to Backend ── */
  const handleReorder = async (newOrder) => {
    // Update local state immediately with new sequential numbers
    const updatedWithNumbers = newOrder.map((proj, idx) => ({
      ...proj,
      number: String(idx + 1).padStart(2, '0'),
      order: idx
    }));
    setProjects(updatedWithNumbers);

    // Sync to backend
    try {
      setSavingOrder(true);
      const orderedIds = updatedWithNumbers.map(p => p._id);
      const res = await fetch(`${API_URL}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds })
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to save project sequence');
      const data = await res.json();
      setProjects(data);
      showToast('Project order updated and saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingOrder(false);
    }
  };

  /* ── Save Reordered Shopify Projects ── */
  const handleShopifyReorder = async (newOrder) => {
    const updatedWithNumbers = newOrder.map((proj, idx) => ({
      ...proj,
      number: String(idx + 1).padStart(2, '0'),
      order: idx
    }));
    setShopifyProjects(updatedWithNumbers);

    try {
      setSavingShopifyOrder(true);
      const orderedIds = updatedWithNumbers.map(p => p._id);
      const res = await fetch(`${API_BASE}/shopify-projects/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds })
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to save Shopify sequence');
      const data = await res.json();
      setShopifyProjects(data);
      showToast('Shopify card order updated and saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingShopifyOrder(false);
    }
  };

  /* ── Manual Shift Buttons for Reordering ── */
  const moveCard = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const newItems = [...projects];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    handleReorder(newItems);
  };

  const moveToEdge = (index, edge) => {
    const newItems = [...projects];
    const [moved] = newItems.splice(index, 1);
    if (edge === 'top') newItems.unshift(moved);
    else newItems.push(moved);
    handleReorder(newItems);
  };

  const moveShopifyCard = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= shopifyProjects.length) return;
    const newItems = [...shopifyProjects];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    handleShopifyReorder(newItems);
  };

  const moveShopifyToEdge = (index, edge) => {
    const newItems = [...shopifyProjects];
    const [moved] = newItems.splice(index, 1);
    if (edge === 'top') newItems.unshift(moved);
    else newItems.push(moved);
    handleShopifyReorder(newItems);
  };

  const handleDeleteShopifyConfirm = async () => {
    if (!deleteShopifyTarget) return;
    try {
      const res = await fetch(`${API_BASE}/shopify-projects/${deleteShopifyTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to delete Shopify project');
      setShopifyProjects(prev => prev.filter(p => p._id !== deleteShopifyTarget.id));
      showToast('Shopify project deleted successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteShopifyTarget(null);
    }
  };

  /* ── Form Input Change ── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'accentColor') updated.accentRgb = hexToRgb(value);
      return updated;
    });
  };

  /* ── Image Upload via Multer ── */
  const handleImageUpload = async (e, targetField = 'image1', customSetter = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setter = customSetter || setUploadingImage;
    setter(true);

    // If uploading for Smart Card, instantly extract dominant color from the image file!
    if (targetField === 'smart') {
      try {
        const objectUrl = URL.createObjectURL(file);
        const { hex, rgb } = await extractDominantColor(objectUrl);
        setSmartParsedData(prev => ({
          ...prev,
          accentColor: hex,
          accentRgb: rgb
        }));
        setColorExtractedFromImg(true);
      } catch (cErr) {
        console.warn('Smart color extraction notice:', cErr);
      }
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');
      
      if (targetField === 'hero') {
        setHeroData(prev => ({ ...prev, avatarUrl: data.url }));
        showToast('Hero avatar uploaded successfully!');
      } else if (targetField === 'resume') {
        setHeroData(prev => ({ ...prev, resumeUrl: data.url }));
        showToast(`Resume "${data.filename || file.name}" uploaded successfully!`);
      } else if (targetField === 'smart') {
        setSmartImage(data.url);
        setSmartParsedData(prev => ({ ...prev, image1: data.url }));
        showToast('Image uploaded & color auto-extracted!');
      } else {
        setForm(prev => ({ ...prev, [targetField]: data.url }));
        showToast('File uploaded successfully!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setter(false);
    }
  };

  /* ── Project Edit Trigger (For ANY card: Regular Portfolio or Shopify) ── */
  const handleEdit = (project, isShopify = false) => {
    setEditingCard(project);
    setIsEditingShopify(isShopify);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(defaultForm);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formattedData = {
      ...form,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean)
    };
    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Operation failed');
      }
      showToast(editingId ? '✓ Project updated successfully!' : '✓ Project created successfully!');
      setForm(defaultForm);
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete Project ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_URL}/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to delete project');
      showToast('Project deleted successfully.');
      fetchProjects();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ── Smart Quick Card Parsing ── */
  useEffect(() => {
    if (smartText.trim()) {
      const parsed = parseProjectDetailsFromText(smartText);
      const isShopify = smartProjectType === 'shopify';
      setSmartParsedData(prev => ({
        ...prev,
        ...parsed,
        accentColor: colorExtractedFromImg
          ? prev.accentColor
          : (isShopify && parsed.accentColor === '#6366f1' ? '#22c55e' : parsed.accentColor),
        accentRgb: colorExtractedFromImg
          ? prev.accentRgb
          : (isShopify && parsed.accentColor === '#6366f1' ? '34, 197, 94' : parsed.accentRgb),
        image1: smartImage || prev.image1 || (isShopify ? '/Living-Furniture.png' : '/NEXT-CLASS.png')
      }));
    }
  }, [smartText, smartImage, smartProjectType, colorExtractedFromImg]);

  /* ── Submit Smart Quick Card ── */
  const handleSmartCardSubmit = async () => {
    if (!smartParsedData.title) {
      showToast('Please provide a title in the box.', 'error');
      return;
    }
    setSmartCreating(true);

    const isShopify = smartProjectType === 'shopify';
    const targetCount = isShopify ? shopifyProjects.length : projects.length;
    const newSerial = String(targetCount + 1).padStart(2, '0');

    const defaultImg = isShopify ? '/Living-Furniture.png' : '/NEXT-CLASS.png';
    const defaultLive = isShopify ? 'https://my-shopify-store.myshopify.com' : 'https://my-portfolio-project.web.app';
    const defaultTech = isShopify ? ['Shopify', 'Liquid Template', 'Shopify API'] : ['React', 'Node.js', 'MongoDB'];
    const defaultFeat = isShopify
      ? ['Custom theme development', 'Product filtering & quick view', 'SEO optimized pages']
      : ['Role-based dashboards', 'Secure API endpoints', 'Responsive design'];

    const projectToCreate = {
      ...smartParsedData,
      number: newSerial,
      order: targetCount,
      image1: smartImage || smartParsedData.image1 || defaultImg,
      liveLink: smartParsedData.liveLink || defaultLive,
      technologies: typeof smartParsedData.technologies === 'string'
        ? smartParsedData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : (smartParsedData.technologies && smartParsedData.technologies.length > 0 ? smartParsedData.technologies : defaultTech),
      features: typeof smartParsedData.features === 'string'
        ? smartParsedData.features.split('\n').map(f => f.trim()).filter(Boolean)
        : (smartParsedData.features && smartParsedData.features.length > 0 ? smartParsedData.features : defaultFeat)
    };

    const targetUrl = isShopify ? `${API_BASE}/shopify-projects` : API_URL;

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectToCreate)
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error(`Failed to create ${isShopify ? 'Shopify' : 'Web'} project`);
      showToast(`🎉 Card created successfully as ${isShopify ? 'Shopify' : 'Web'} Project #${newSerial}!`);
      setSmartText('');
      setSmartImage('');
      setColorExtractedFromImg(false);
      setSmartParsedData(defaultForm);

      if (isShopify) {
        await fetchShopifyProjects();
        setActiveTab('shopify');
      } else {
        await fetchProjects();
        setActiveTab('projects');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSmartCreating(false);
    }
  };

  /* ── Save Section Content ── */
  const saveSectionContent = async (section, data) => {
    setSavingSection(true);
    try {
      const res = await fetch(`${API_BASE}/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data })
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error(`Failed to update ${section} content`);
      showToast(`✓ ${section.toUpperCase()} section updated successfully!`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingSection(false);
    }
  };

  // ── Render Login Screen ──
  if (!token) {
    return (
      <div className="min-h-screen bg-[#080711] text-white font-inter flex items-center justify-center py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[160px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-purple-500/15 blur-[180px]" />
        </div>
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full relative z-10"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-semibold uppercase tracking-widest mb-6 transition-colors group"
          >
            <span className="w-7 h-7 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors">
              <FaArrowLeft size={11} />
            </span>
            Back to Portfolio
          </Link>

          <div className="bg-[#0f0f1c]/85 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8 backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
                <FaLock size={20} />
              </div>
              <h1 className="font-bebas text-3xl text-white tracking-widest uppercase">Admin Dashboard</h1>
              <p className="text-gray-400 text-xs mt-1">Manage projects, hero image, and all section content</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <Field label="Username" icon={<FaUser size={10} />}>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className={inputCls}
                  placeholder="admin"
                  required
                />
              </Field>

              <Field label="Password" icon={<FaLock size={10} />}>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                  required
                />
              </Field>

              <motion.button
                type="submit"
                disabled={loggingIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all duration-200 mt-6 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                {loggingIn ? 'Authenticating...' : 'Login to Dashboard'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Render Authenticated Dashboard ──
  return (
    <div className="min-h-screen bg-[#080711] text-white font-inter py-10 px-4 md:px-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-purple-500/8 blur-[180px]" />
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {deleteTarget && (
        <DeleteModal
          projectTitle={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10" ref={formTopRef}>

        {/* ── Top Navigation Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors group"
            >
              <span className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors">
                <FaArrowLeft size={11} />
              </span>
              <span>View Portfolio</span>
            </Link>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <span className="hidden sm:inline text-xs text-gray-500">
              Admin: <span className="text-white font-semibold">{adminUser}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              <FaSignOutAlt size={11} /> Logout
            </button>
          </div>
        </div>

        {/* ── Header Title & Stats ── */}
        <div className="mb-8">
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-[0.3em] mb-1">Central Control Panel</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide uppercase leading-none">
              Portfolio <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MongoDB Connected & Synchronized</span>
            </div>
          </div>
        </div>

        {/* ── Tabs Navigation (Responsive wrapped pills so no tab is ever cut off) ── */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pb-4 mb-8 border-b border-white/10">
          {[
            { id: 'projects', label: 'Web Projects', icon: <FaLayerGroup />, count: projects.length },
            { id: 'shopify', label: 'Shopify Projects', icon: <FaShopify />, count: shopifyProjects.length },
            { id: 'smart-create', label: 'Smart Quick Card', icon: <FaMagic /> },
            { id: 'hero', label: 'Hero & Avatar', icon: <FaCamera /> },
            { id: 'about', label: 'About Section', icon: <FaBriefcase /> },
            { id: 'skills', label: 'Skills & Tech', icon: <FaCode /> },
            { id: 'contact', label: 'Contact Details', icon: <FaEnvelope /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-300 shadow-lg shadow-indigo-500/10'
                  : 'border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 bg-white/[0.02]'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/30 text-indigo-200">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: PROJECTS MANAGER (With Drag & Drop Card Serial Reordering)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f0f1c]/60 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Drag any card to reposition in the serial (1st, 2nd, etc.)
                </span>
                {savingOrder && (
                  <span className="text-xs text-indigo-400 flex items-center gap-1.5 animate-pulse">
                    <FaSyncAlt className="animate-spin" size={10} /> Saving order...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* View switcher */}
                <div className="flex bg-black/40 border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                      viewMode === 'cards' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Draggable Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                      viewMode === 'table' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Table List
                  </button>
                </div>

                {!showForm && (
                  <button
                    onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm); }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
                  >
                    <FaPlus size={10} /> Add Project
                  </button>
                )}
              </div>
            </div>

            {/* ── Add / Edit Project Form Modal / Drawer ── */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#0f0f1c]/90 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        {editingId ? <FaEdit size={16} /> : <FaPlus size={16} />}
                      </div>
                      <div>
                        <h2 className="font-bebas text-2xl text-white tracking-widest uppercase">
                          {editingId ? 'Edit Project' : 'Upload New Project'}
                        </h2>
                        <p className="text-gray-400 text-xs">
                          {editingId ? 'Modify project specs and media' : 'Fill details or use Smart Quick Card'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left 3 cols */}
                    <div className="lg:col-span-3 space-y-5">
                      <div className="grid grid-cols-4 gap-4">
                        <Field label="Serial #" icon={<FaSortNumericUp size={10} />}>
                          <input
                            type="text"
                            name="number"
                            value={form.number}
                            onChange={handleInputChange}
                            className={inputCls}
                            placeholder="01"
                          />
                        </Field>
                        <div className="col-span-3">
                          <Field label="Project Title *" icon={<FaLayerGroup size={10} />}>
                            <input
                              type="text"
                              name="title"
                              value={form.title}
                              onChange={handleInputChange}
                              required
                              className={inputCls}
                              placeholder="e.g. Next Class"
                            />
                          </Field>
                        </div>
                      </div>

                      <Field label="Subtitle / Category *" icon={<FaLayerGroup size={10} />}>
                        <input
                          type="text"
                          name="subtitle"
                          value={form.subtitle}
                          onChange={handleInputChange}
                          required
                          className={inputCls}
                          placeholder="e.g. Education Management Platform"
                        />
                      </Field>

                      <Field label="Description *" icon={<FaLayerGroup size={10} />}>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className={inputCls + ' resize-none'}
                          placeholder="Detailed overview of what the application accomplishes..."
                        />
                      </Field>

                      <Field label="Technologies (comma-separated)" icon={<FaCode size={10} />}>
                        <input
                          type="text"
                          name="technologies"
                          value={form.technologies}
                          onChange={handleInputChange}
                          className={inputCls}
                          placeholder="React, Next.js, Node.js, MongoDB, Tailwind"
                        />
                      </Field>

                      <Field label="Key Features (one per line)" icon={<FaLayerGroup size={10} />}>
                        <textarea
                          name="features"
                          value={form.features}
                          onChange={handleInputChange}
                          rows={3}
                          className={inputCls + ' resize-none'}
                          placeholder={`JWT-secured private routes\nStripe payments\nReal-time notifications`}
                        />
                      </Field>
                    </div>

                    {/* Right 2 cols */}
                    <div className="lg:col-span-2 space-y-5">
                      {/* Image Upload box */}
                      <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-3">
                        <Field label="Upload Project Image" icon={<FaImage size={10} />}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'image1')}
                            disabled={uploadingImage}
                            className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/25 file:text-indigo-400 hover:file:bg-indigo-500/35 cursor-pointer"
                          />
                          {uploadingImage && (
                            <p className="text-xs text-indigo-400 animate-pulse mt-1">Uploading image to server...</p>
                          )}
                        </Field>

                        <Field label="Or Image URL / Path" icon={<FaGlobe size={10} />}>
                          <input
                            type="text"
                            name="image1"
                            value={form.image1}
                            onChange={handleInputChange}
                            required
                            className={inputCls}
                            placeholder="/NEXT-CLASS.png or https://..."
                          />
                        </Field>

                        {/* Thumbnail Preview */}
                        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/60 aspect-video flex items-center justify-center relative">
                          {form.image1 ? (
                            <img src={form.image1} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-500">Image Preview</span>
                          )}
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div>
                        <Field label="Accent Brand Color" icon={<FaPalette size={10} />}>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              name="accentColor"
                              value={form.accentColor}
                              onChange={handleInputChange}
                              className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              name="accentColor"
                              value={form.accentColor}
                              onChange={handleInputChange}
                              className={inputCls}
                              placeholder="#6366f1"
                            />
                          </div>
                        </Field>
                        {/* Quick Presets */}
                        <div className="flex gap-1.5 mt-2">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => {
                                setForm(prev => ({
                                  ...prev,
                                  accentColor: preset.hex,
                                  accentRgb: hexToRgb(preset.hex)
                                }));
                              }}
                              className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: preset.hex }}
                              title={preset.name}
                            />
                          ))}
                        </div>
                      </div>

                      <Field label="Live URL *" icon={<FaGlobe size={10} />}>
                        <input
                          type="url"
                          name="liveLink"
                          value={form.liveLink}
                          onChange={handleInputChange}
                          required
                          className={inputCls}
                          placeholder="https://my-app.web.app"
                        />
                      </Field>

                      <Field label="GitHub Client URL" icon={<FaGithub size={10} />}>
                        <input
                          type="url"
                          name="gitLinkClient"
                          value={form.gitLinkClient}
                          onChange={handleInputChange}
                          className={inputCls}
                          placeholder="https://github.com/..."
                        />
                      </Field>
                    </div>

                    {/* Bottom Save bar */}
                    <div className="col-span-full flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2.5 border border-white/10 text-gray-400 hover:text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving || uploadingImage}
                        className="px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
                      >
                        <FaSave size={11} /> {saving ? 'Saving...' : editingId ? 'Update Project' : 'Save Project'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Draggable Cards Grid (Requirement #2: Drag & drop to reorder cards anywhere) ── */}
            {viewMode === 'cards' ? (
              <Reorder.Group
                axis="y"
                values={projects}
                onReorder={handleReorder}
                className="space-y-4"
              >
                {loading ? (
                  <div className="py-20 text-center text-gray-500">Loading projects from MongoDB...</div>
                ) : projects.length === 0 ? (
                  <div className="py-20 text-center text-gray-500">No projects yet. Click "Add Project" or use "Smart Quick Card"!</div>
                ) : (
                  projects.map((project, index) => (
                    <Reorder.Item
                      key={project._id}
                      value={project}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <motion.div
                        layout
                        className="p-5 rounded-2xl bg-[#0f0f1c]/70 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group backdrop-blur-md hover:shadow-xl hover:shadow-indigo-500/5"
                      >
                        {/* Left: Drag handle + Serial Number + Thumbnail + Info */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Drag handle */}
                          <div className="flex items-center gap-2 text-gray-500 group-hover:text-indigo-400 transition-colors">
                            <FaGripVertical size={16} />
                            <span
                              className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10"
                              style={{ backgroundColor: `${project.accentColor}15`, color: project.accentColor || '#6366f1' }}
                            >
                              #{String(index + 1).padStart(2, '0')}
                            </span>
                          </div>

                          {/* Image preview */}
                          <div className="w-16 h-12 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                            <img
                              src={project.image1}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>

                          {/* Title & info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-bold text-base truncate">{project.title}</h3>
                              <span className="text-[10px] text-gray-400 font-mono">({project.subtitle})</span>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {project.technologies?.slice(0, 4).map((tech, i) => (
                                <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Quick position adjusters + Action Buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          {/* Shift Up / Down buttons */}
                          <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); moveToEdge(index, 'top'); }}
                              disabled={index === 0}
                              title="Move to 1st Place"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <span className="text-[10px] font-bold">1ST</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveCard(index, -1); }}
                              disabled={index === 0}
                              title="Move Up One Position"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <FaArrowUp size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveCard(index, 1); }}
                              disabled={index === projects.length - 1}
                              title="Move Down One Position"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <FaArrowDown size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveToEdge(index, 'bottom'); }}
                              disabled={index === projects.length - 1}
                              title="Move to Last Place"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <span className="text-[10px] font-bold">END</span>
                            </button>
                          </div>

                          {/* Live link icon */}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="w-8 h-8 rounded-xl border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                              title="Open live link"
                            >
                              <FaExternalLinkAlt size={11} />
                            </a>
                          )}

                          {/* Edit button */}
                          <button
                            onClick={() => handleEdit(project, false)}
                            className="px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <FaEdit size={11} /> Edit Card
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setDeleteTarget({ id: project._id, title: project.title })}
                            className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  ))
                )}
              </Reorder.Group>
            ) : (
              /* Table view */
              <div className="bg-[#0f0f1c]/50 border border-white/10 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4 text-left">Serial</th>
                      <th className="py-3 px-4 text-left">Image</th>
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Technologies</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, idx) => (
                      <tr key={project._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                          #{String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4">
                          <img src={project.image1} alt="" className="w-10 h-7 object-cover rounded-md" />
                        </td>
                        <td className="py-3 px-4 font-bold text-white">{project.title}</td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {project.technologies?.slice(0, 3).join(', ')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => handleEdit(project, false)} className="text-indigo-400 hover:text-indigo-300 font-semibold mr-3 cursor-pointer">
                            Edit Card
                          </button>
                          <button onClick={() => setDeleteTarget({ id: project._id, title: project.title })} className="text-red-400 cursor-pointer">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: SHOPIFY PROJECTS (Full CRUD + Reordering + Editing)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'shopify' && (
          <div className="space-y-8">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f0f1c]/60 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FaShopify size={16} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">Shopify Projects ({shopifyProjects.length})</h2>
                  <p className="text-xs text-gray-400">
                    Drag any card to change its position, or click <span className="text-emerald-400 font-semibold">Edit Card</span> to modify details
                  </p>
                </div>
                {savingShopifyOrder && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-pulse ml-2">
                    <FaSyncAlt className="animate-spin" size={10} /> Saving order...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setShowCreateModal(true); setIsCreatingShopify(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <FaPlus size={10} /> Add Shopify Project
                </button>
              </div>
            </div>

            {/* Shopify Cards List (Draggable Reorder) */}
            <div className="space-y-4">
              {shopifyLoading ? (
                <div className="py-20 text-center">
                  <FaSyncAlt className="animate-spin text-emerald-400 mx-auto mb-3 text-2xl" />
                  <p className="text-gray-400 text-sm">Loading Shopify projects...</p>
                </div>
              ) : shopifyProjects.length === 0 ? (
                <div className="text-center py-16 bg-[#0f0f1c]/40 rounded-2xl border border-white/10">
                  <FaShopify className="mx-auto text-4xl text-emerald-400 mb-3 opacity-60" />
                  <p className="text-gray-300 font-bold mb-1">No Shopify Projects Found</p>
                  <p className="text-gray-500 text-xs mb-4">Click "Add Shopify Project" above to create your first store card.</p>
                  <button
                    onClick={() => { setShowCreateModal(true); setIsCreatingShopify(true); }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl cursor-pointer"
                  >
                    Add First Shopify Project
                  </button>
                </div>
              ) : (
                <Reorder.Group axis="y" values={shopifyProjects} onReorder={handleShopifyReorder} className="space-y-3">
                  {shopifyProjects.map((project, index) => (
                    <Reorder.Item
                      key={project._id || project.id || index}
                      value={project}
                      className="group relative rounded-2xl bg-[#0f0f1c]/80 border border-white/10 hover:border-emerald-500/40 p-4 transition-all duration-200 cursor-grab active:cursor-grabbing backdrop-blur-md"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left: Drag Handle, Number, Image, Title */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-gray-600 group-hover:text-emerald-400 transition-colors p-1" title="Drag to reorder position">
                            <FaGripVertical size={16} />
                          </div>

                          {/* Serial Number Badge */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-emerald-500/30"
                            style={{
                              background: `rgba(${project.accentRgb || '34, 197, 94'}, 0.15)`,
                              color: project.accentColor || '#22c55e'
                            }}
                          >
                            #{project.number || String(index + 1).padStart(2, '0')}
                          </div>

                          {/* Thumbnail */}
                          <div className="w-16 h-12 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10 relative">
                            {project.image1 ? (
                              <img src={project.image1} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                                No Img
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 cursor-pointer" onClick={() => handleEdit(project, true)}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                {project.subtitle || 'Shopify Store'}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-emerald-400/50" />
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                Shopify
                              </span>
                            </div>
                            <h3 className="text-white font-bold text-sm truncate group-hover:text-emerald-300 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-gray-400 text-xs truncate max-w-md">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {project.technologies?.slice(0, 4).map((tech, i) => (
                                <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Quick shift + Edit + Delete buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          {/* Position Shift buttons */}
                          <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); moveShopifyToEdge(index, 'top'); }}
                              disabled={index === 0}
                              title="Move to 1st Place"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <span className="text-[10px] font-bold">1ST</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveShopifyCard(index, -1); }}
                              disabled={index === 0}
                              title="Move Up One Position"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <FaArrowUp size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveShopifyCard(index, 1); }}
                              disabled={index === shopifyProjects.length - 1}
                              title="Move Down One Position"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <FaArrowDown size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveShopifyToEdge(index, 'bottom'); }}
                              disabled={index === shopifyProjects.length - 1}
                              title="Move to Last Place"
                              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <span className="text-[10px] font-bold">END</span>
                            </button>
                          </div>

                          {/* Live link icon */}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="w-8 h-8 rounded-xl border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                              title="Open live store"
                            >
                              <FaExternalLinkAlt size={11} />
                            </a>
                          )}

                          {/* Edit button */}
                          <button
                            onClick={() => handleEdit(project, true)}
                            className="px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <FaEdit size={11} /> Edit Card
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setDeleteShopifyTarget({ id: project._id, title: project.title })}
                            className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: SMART QUICK CARD (Requirement #3: Details in box + image upload + auto-details & color)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'smart-create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Input Box & Image Upload */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f0f1c]/70 border border-white/10 backdrop-blur-md space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <FaMagic size={16} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-2xl text-white tracking-widest uppercase">Smart Quick Card Creator</h2>
                    <p className="text-gray-400 text-xs">
                      Choose Web or Shopify, paste your notes, and upload an image — colors and specs are auto-generated!
                    </p>
                  </div>
                </div>

                {/* ── 1. Target Destination Selector ── */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="text-indigo-400 font-bold">1. Select Target Section:</span>
                    </label>
                    <span className="text-[11px] font-semibold text-gray-300">
                      Destination: <strong className={smartProjectType === 'shopify' ? 'text-emerald-400' : 'text-indigo-400'}>
                        {smartProjectType === 'shopify' ? 'Shopify Projects' : 'Web Projects'}
                      </strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSmartProjectType('web');
                        if (!colorExtractedFromImg) {
                          setSmartParsedData(prev => ({
                            ...prev,
                            accentColor: prev.accentColor === '#22c55e' ? '#6366f1' : prev.accentColor,
                            accentRgb: prev.accentColor === '#22c55e' ? '99, 102, 241' : prev.accentRgb
                          }));
                        }
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                        smartProjectType === 'web'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <FaLayerGroup className={smartProjectType === 'web' ? 'text-indigo-400' : 'text-gray-500'} />
                      <span>Web Project</span>
                      {smartProjectType === 'web' && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse ml-1" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSmartProjectType('shopify');
                        if (!colorExtractedFromImg) {
                          setSmartParsedData(prev => ({
                            ...prev,
                            accentColor: prev.accentColor === '#6366f1' ? '#22c55e' : prev.accentColor,
                            accentRgb: prev.accentColor === '#6366f1' ? '34, 197, 94' : prev.accentRgb
                          }));
                        }
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                        smartProjectType === 'shopify'
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <FaShopify className={smartProjectType === 'shopify' ? 'text-emerald-400' : 'text-gray-500'} />
                      <span>Shopify Project</span>
                      {smartProjectType === 'shopify' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ── 2. The Magic Details Box ── */}
                <Field
                  label="2. Project Details Box (Type or Paste Raw Specs)"
                  icon={<FaMagic size={10} />}
                  tip="Auto-parses title, tech, features, & links"
                >
                  <textarea
                    rows={8}
                    value={smartText}
                    onChange={(e) => setSmartText(e.target.value)}
                    placeholder={`Paste anything here! Example:

Title: AI Cloud Studio
Category: Cloud Collaboration Platform
Description: An intelligent developer workspace that accelerates microservices deployment with automated pipelines.
Tech: React, Next.js, Node.js, MongoDB, Tailwind CSS
- Real-time multi-user editing
- Integrated AI assistant
- Instant staging preview
Live: https://example.com/demo
Github: https://github.com/my-org/ai-cloud`}
                    className={inputCls + ' font-mono text-xs leading-relaxed resize-y'}
                  />
                </Field>

                {/* ── 3. Image Upload Zone (Auto-Generates Dominant Color) ── */}
                <div className="p-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Field label="3. Upload Screenshot (Auto-extracts Card Color)" icon={<FaImage size={10} />}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'smart', setUploadingSmartImg)}
                        disabled={uploadingSmartImg}
                        className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/25 file:text-indigo-300 hover:file:bg-indigo-500/35 cursor-pointer"
                      />
                    </Field>
                  </div>
                  {uploadingSmartImg && (
                    <p className="text-xs text-indigo-400 animate-pulse">Uploading image to server & analyzing colors...</p>
                  )}
                  {smartImage && (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="flex items-center gap-3">
                        <img src={smartImage} alt="Uploaded" className="w-16 h-10 object-cover rounded-lg border border-white/10" />
                        <div>
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <FaCheck size={10} /> Image uploaded & linked!
                          </span>
                          <span className="text-[11px] text-gray-400">Card thumbnail ready</span>
                        </div>
                      </div>
                      {colorExtractedFromImg && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] uppercase font-bold text-amber-300">✨ Image Color:</span>
                          <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: smartParsedData.accentColor }} />
                          <span className="font-mono text-xs text-white">{smartParsedData.accentColor}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── 4. Extracted Details Overview ── */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Auto-Detected Specs:</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                      Target: {smartProjectType === 'shopify' ? '🛍️ Shopify Projects' : '🌐 Web Projects'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">Title:</span>
                      <p className="text-white font-semibold">{smartParsedData.title || '(Waiting for notes...)'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Subtitle:</span>
                      <p className="text-white font-semibold">{smartParsedData.subtitle || (smartProjectType === 'shopify' ? 'Shopify Store' : 'Web Application')}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">
                          Color Theme {colorExtractedFromImg ? '(Auto-Generated from Image)' : '(Auto-Selected)'}:
                        </span>
                        {colorExtractedFromImg && (
                          <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                            <FaMagic size={9} /> From Uploaded Image
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 rounded-full border border-white/30 shadow-md" style={{ background: smartParsedData.accentColor }} />
                        <span className="text-white font-mono">{smartParsedData.accentColor}</span>
                        {/* Override color buttons */}
                        <div className="flex gap-1.5 ml-auto">
                          {colorPresets.map(p => (
                            <button
                              key={p.hex}
                              type="button"
                              title={`Switch to ${p.name}`}
                              onClick={() => {
                                setSmartParsedData(prev => ({
                                  ...prev,
                                  accentColor: p.hex,
                                  accentRgb: hexToRgb(p.hex)
                                }));
                                setColorExtractedFromImg(false);
                              }}
                              className={`w-4 h-4 rounded-full border cursor-pointer transition-transform hover:scale-125 ${
                                smartParsedData.accentColor === p.hex ? 'ring-2 ring-white border-transparent' : 'border-white/20'
                              }`}
                              style={{ backgroundColor: p.hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Card Button */}
                <button
                  type="button"
                  onClick={handleSmartCardSubmit}
                  disabled={smartCreating || !smartParsedData.title}
                  className={`w-full py-3.5 font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-40 text-white ${
                    smartProjectType === 'shopify'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/25'
                  }`}
                >
                  {smartProjectType === 'shopify' ? <FaShopify size={14} /> : <FaMagic size={12} />}
                  {smartCreating
                    ? `Creating Card in ${smartProjectType === 'shopify' ? 'Shopify' : 'Web'} Projects...`
                    : `Create & Add Card to ${smartProjectType === 'shopify' ? 'Shopify Projects' : 'Web Projects'}`}
                </button>
              </div>
            </div>

            {/* Right: Live Card Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Live Card Preview (Updates in real-time)
                </h3>
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1.5"
                  style={{
                    backgroundColor: smartProjectType === 'shopify' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    borderColor: smartProjectType === 'shopify' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                    color: smartProjectType === 'shopify' ? '#4ade80' : '#a5b4fc'
                  }}
                >
                  {smartProjectType === 'shopify' ? <FaShopify size={11} /> : <FaLayerGroup size={11} />}
                  <span>
                    {smartProjectType === 'shopify' ? 'Shopify Section' : 'Web Section'} • Card #{String((smartProjectType === 'shopify' ? shopifyProjects.length : projects.length) + 1).padStart(2, '0')}
                  </span>
                </span>
              </div>

              {/* Exact Simulated Project Card */}
              <div
                className="rounded-2xl border p-6 overflow-hidden relative backdrop-blur-xl shadow-2xl transition-all"
                style={{
                  borderColor: `${smartParsedData.accentColor}40`,
                  backgroundColor: '#0c0c16'
                }}
              >
                {/* Glow Orb */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: smartParsedData.accentColor }}
                />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-xs font-bold px-3 py-1 rounded-full border"
                      style={{
                        backgroundColor: `${smartParsedData.accentColor}20`,
                        borderColor: `${smartParsedData.accentColor}50`,
                        color: smartParsedData.accentColor
                      }}
                    >
                      #{String((smartProjectType === 'shopify' ? shopifyProjects.length : projects.length) + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: smartProjectType === 'shopify' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        borderColor: smartProjectType === 'shopify' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                        color: smartProjectType === 'shopify' ? '#4ade80' : '#a5b4fc'
                      }}
                    >
                      {smartProjectType === 'shopify' ? 'Shopify Store' : 'Web App'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {smartParsedData.liveLink && (
                      <span className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-gray-400">
                        <FaGlobe size={11} />
                      </span>
                    )}
                    {smartParsedData.gitLinkClient && (
                      <span className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-gray-400">
                        <FaGithub size={11} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Media */}
                <div className="rounded-xl overflow-hidden aspect-video bg-black/50 border border-white/10 mb-5 relative flex items-center justify-center">
                  {smartParsedData.image1 ? (
                    <img src={smartParsedData.image1} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-600">
                      <FaImage size={24} />
                      <span className="text-[10px]">Upload an image above</span>
                    </div>
                  )}
                </div>

                {/* Card Text */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: smartParsedData.accentColor }} />
                    <span className="text-xs text-gray-400 font-mono uppercase">{smartParsedData.subtitle}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white">{smartParsedData.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{smartParsedData.description}</p>
                </div>

                {/* Tech Pills */}
                {smartParsedData.technologies && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                    {smartParsedData.technologies.split(',').map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-300"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: HERO & AVATAR EDITOR (Requirements #4 & #5: Hero image upload & content change)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'hero' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Hero Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f0f1c]/70 border border-white/10 backdrop-blur-md space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FaCamera size={16} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-2xl text-white tracking-widest uppercase">Hero Section & Photo</h2>
                    <p className="text-gray-400 text-xs">Upload your profile image and customize intro text</p>
                  </div>
                </div>

                {/* Hero Image Upload (Requirement #5) */}
                <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 space-y-3">
                  <Field label="Upload Hero Avatar / Profile Image" icon={<FaCamera size={10} />}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero', setUploadingHeroImg)}
                      disabled={uploadingHeroImg}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/30 file:text-indigo-300 hover:file:bg-indigo-500/40 cursor-pointer"
                    />
                  </Field>
                  {uploadingHeroImg && (
                    <p className="text-xs text-indigo-400 animate-pulse">Uploading hero image...</p>
                  )}
                  <Field label="Or Direct Image URL" icon={<FaGlobe size={10} />}>
                    <input
                      type="text"
                      value={heroData.avatarUrl || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                      placeholder="/profile-new.jpg or https://..."
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* ── Avatar Circle Background & Image Adjustments (Cropping, Zoom, Position) ── */}
                <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                        <FaCamera size={12} />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Avatar Circle Background & Image Adjustments
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHeroData(prev => ({
                        ...prev,
                        avatarBgColor: '#ff9900',
                        avatarScale: 88,
                        avatarOffsetX: 0,
                        avatarOffsetY: 0,
                        avatarFit: 'cover'
                      }))}
                      className="text-[10px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                    >
                      Reset Adjustments
                    </button>
                  </div>

                  {/* Background Color Picker & Presets */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Circle Background Color:</span>
                      <span className="font-mono text-xs text-white">{heroData.avatarBgColor || '#ff9900'}</span>
                    </label>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Native color picker */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
                        <input
                          type="color"
                          value={heroData.avatarBgColor || '#ff9900'}
                          onChange={(e) => setHeroData(prev => ({ ...prev, avatarBgColor: e.target.value }))}
                          className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={heroData.avatarBgColor || '#ff9900'}
                          onChange={(e) => setHeroData(prev => ({ ...prev, avatarBgColor: e.target.value }))}
                          className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
                          placeholder="#ff9900"
                        />
                      </div>

                      {/* Quick Color Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                        {[
                          { name: 'Vibrant Orange', hex: '#ff9900' },
                          { name: 'Electric Indigo', hex: '#6366f1' },
                          { name: 'Emerald', hex: '#10b981' },
                          { name: 'Rose', hex: '#f43f5e' },
                          { name: 'Cyan', hex: '#06b6d4' },
                          { name: 'Violet', hex: '#a855f7' },
                          { name: 'Amber', hex: '#f59e0b' },
                          { name: 'Dark Slate', hex: '#1e1e2f' },
                          { name: 'Pure Dark', hex: '#0d0d18' }
                        ].map(preset => (
                          <button
                            key={preset.hex}
                            type="button"
                            title={preset.name}
                            onClick={() => setHeroData(prev => ({ ...prev, avatarBgColor: preset.hex }))}
                            className={`w-6 h-6 rounded-full border cursor-pointer transition-transform hover:scale-110 ${
                              (heroData.avatarBgColor || '#ff9900').toLowerCase() === preset.hex.toLowerCase()
                                ? 'ring-2 ring-white ring-offset-1 ring-offset-black scale-110'
                                : 'border-white/20'
                            }`}
                            style={{ backgroundColor: preset.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Scale / Zoom Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>Image Zoom & Crop Scale:</span>
                      <span className="font-mono text-indigo-400">{heroData.avatarScale ?? 88}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500 font-mono">50%</span>
                      <input
                        type="range"
                        min="50"
                        max="160"
                        step="1"
                        value={heroData.avatarScale ?? 88}
                        onChange={(e) => setHeroData(prev => ({ ...prev, avatarScale: Number(e.target.value) }))}
                        className="w-full accent-indigo-500 cursor-pointer h-2 bg-black/50 rounded-lg"
                      />
                      <span className="text-[10px] text-gray-500 font-mono">160%</span>
                    </div>
                  </div>

                  {/* Horizontal & Vertical Positioning */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Horizontal Position (X-Offset) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Position X (Left ↔ Right):</span>
                        <span className="font-mono text-indigo-400">{heroData.avatarOffsetX ?? 0}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-mono">-60</span>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          step="1"
                          value={heroData.avatarOffsetX ?? 0}
                          onChange={(e) => setHeroData(prev => ({ ...prev, avatarOffsetX: Number(e.target.value) }))}
                          className="w-full accent-indigo-500 cursor-pointer h-2 bg-black/50 rounded-lg"
                        />
                        <span className="text-[10px] text-gray-500 font-mono">+60</span>
                      </div>
                    </div>

                    {/* Vertical Position (Y-Offset) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Position Y (Up ↕ Down):</span>
                        <span className="font-mono text-indigo-400">{heroData.avatarOffsetY ?? 0}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-mono">-60</span>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          step="1"
                          value={heroData.avatarOffsetY ?? 0}
                          onChange={(e) => setHeroData(prev => ({ ...prev, avatarOffsetY: Number(e.target.value) }))}
                          className="w-full accent-indigo-500 cursor-pointer h-2 bg-black/50 rounded-lg"
                        />
                        <span className="text-[10px] text-gray-500 font-mono">+60</span>
                      </div>
                    </div>
                  </div>

                  {/* Image Fit Mode */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Fit Mode:
                    </span>
                    <div className="flex items-center gap-2">
                      {['cover', 'contain'].map((fit) => (
                        <button
                          key={fit}
                          type="button"
                          onClick={() => setHeroData(prev => ({ ...prev, avatarFit: fit }))}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                            (heroData.avatarFit || 'cover') === fit
                              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                              : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full Name & Highlighted Surname */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name(s)" icon={<FaUser size={10} />}>
                    <input
                      type="text"
                      value={heroData.name || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, name: e.target.value }))}
                      className={inputCls}
                      placeholder="Tawhid Hasan"
                    />
                  </Field>
                  <Field label="Highlighted Surname" icon={<FaUser size={10} />}>
                    <input
                      type="text"
                      value={heroData.highlightedName || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, highlightedName: e.target.value }))}
                      className={inputCls}
                      placeholder="Bejoy"
                    />
                  </Field>
                </div>

                {/* Role & Company Badge */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Primary Role" icon={<FaCode size={10} />}>
                    <input
                      type="text"
                      value={heroData.role || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, role: e.target.value }))}
                      className={inputCls}
                      placeholder="React.js Developer"
                    />
                  </Field>
                  <Field label="Current Work Badge" icon={<FaBriefcase size={10} />}>
                    <input
                      type="text"
                      value={heroData.badge || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, badge: e.target.value }))}
                      className={inputCls}
                      placeholder="Web Developer @ Softvence"
                    />
                  </Field>
                </div>

                {/* Location & Status Indicator */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Location" icon={<FiMapPin size={10} />}>
                    <input
                      type="text"
                      value={heroData.location || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, location: e.target.value }))}
                      className={inputCls}
                      placeholder="Dhaka, BD"
                    />
                  </Field>
                  <Field label="Status Badge Text" icon={<FaCheckCircle size={10} />}>
                    <input
                      type="text"
                      value={heroData.statusText || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, statusText: e.target.value }))}
                      className={inputCls}
                      placeholder="Seeking Growth Opportunities"
                    />
                  </Field>
                </div>

                {/* Bio Description */}
                <Field label="Bio Overview" icon={<FiFileText size={10} />}>
                  <textarea
                    rows={3}
                    value={heroData.bio || ''}
                    onChange={(e) => setHeroData(prev => ({ ...prev, bio: e.target.value }))}
                    className={inputCls + ' resize-none'}
                    placeholder="Brief intro line..."
                  />
                </Field>

                {/* ── Resume Upload & Document Manager ── */}
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                        <FiFileText size={12} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider block">
                          Resume Document (PDF / DOC)
                        </span>
                        <p className="text-[11px] text-gray-400">
                          Upload your resume file or provide an external document link
                        </p>
                      </div>
                    </div>
                    {heroData.resumeUrl && (
                      <a
                        href={heroData.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 transition-all hover:bg-emerald-500/20"
                      >
                        <FaExternalLinkAlt size={9} /> View Current
                      </a>
                    )}
                  </div>

                  {/* File Upload Input */}
                  <Field label="Upload Resume File (PDF, DOC, DOCX, etc.)" icon={<FaCamera size={10} />}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => handleImageUpload(e, 'resume', setUploadingResume)}
                      disabled={uploadingResume}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/30 file:text-emerald-300 hover:file:bg-emerald-500/40 cursor-pointer"
                    />
                  </Field>

                  {uploadingResume && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse">
                      <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading and linking your resume document...</span>
                    </div>
                  )}

                  {/* Direct / Linked URL */}
                  <Field label="Current Resume URL / Direct Link" icon={<FaGlobe size={10} />}>
                    <input
                      type="text"
                      value={heroData.resumeUrl || ''}
                      onChange={(e) => setHeroData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                      className={inputCls}
                      placeholder="/resume.pdf or https://..."
                    />
                  </Field>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={() => saveSectionContent('hero', heroData)}
                  disabled={savingSection}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  <FaSave size={12} /> {savingSection ? 'Saving Hero Content...' : 'Save Hero Section Changes'}
                </button>
              </div>
            </div>

            {/* Right: Live Hero Banner Preview */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Hero Section Live Preview
              </h3>

              <div className="p-6 rounded-2xl bg-[#0b0a18] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                {/* Avatar with Glowing Ring */}
                <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-600 shadow-xl mb-4">
                  <div
                    className="w-36 h-36 rounded-full overflow-hidden flex items-end justify-center transition-colors duration-300 relative"
                    style={{ backgroundColor: heroData.avatarBgColor || '#ff9900' }}
                  >
                    {heroData.avatarUrl ? (
                      <img
                        src={heroData.avatarUrl}
                        alt="Avatar"
                        className="h-auto block drop-shadow-xl transition-all duration-200"
                        style={{
                          width: `${heroData.avatarScale || 88}%`,
                          transform: `translate(${heroData.avatarOffsetX || 0}px, ${heroData.avatarOffsetY || 0}px)`,
                          objectFit: heroData.avatarFit || 'cover',
                          objectPosition: 'top'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/50 font-bold text-xs">
                        Default Photo
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-gray-300 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{heroData.statusText || 'Seeking Growth Opportunities'}</span>
                </div>

                {/* Name */}
                <h4 className="text-2xl font-extrabold text-white">
                  {heroData.name}{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
                    {heroData.highlightedName}
                  </span>
                </h4>

                {/* Role */}
                <p className="text-sm font-fira text-purple-400 mt-1 font-semibold">
                  &gt; {heroData.role}
                </p>

                {/* Bio */}
                <p className="text-gray-400 text-xs leading-relaxed mt-3 max-w-sm">
                  {heroData.bio}
                </p>

                {/* Badge */}
                <div className="mt-4 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300">
                  {heroData.badge} · {heroData.location}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: ABOUT SECTION EDITOR (Requirement #4)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f1c]/70 border border-white/10 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FaBriefcase size={16} />
                </div>
                <div>
                  <h2 className="font-bebas text-2xl text-white tracking-widest uppercase">About Section Content</h2>
                  <p className="text-gray-400 text-xs">Update your professional position, agency details, and education</p>
                </div>
              </div>

              {/* Current Role / Softvence */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
                <h3 className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Current Position & Agency</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Position Title">
                    <input
                      type="text"
                      value={aboutData.currentPosition || ''}
                      onChange={(e) => setAboutData(prev => ({ ...prev, currentPosition: e.target.value }))}
                      className={inputCls}
                      placeholder="Web Developer"
                    />
                  </Field>
                  <Field label="Agency / Company">
                    <input
                      type="text"
                      value={aboutData.company || ''}
                      onChange={(e) => setAboutData(prev => ({ ...prev, company: e.target.value }))}
                      className={inputCls}
                      placeholder="Softvence Agency"
                    />
                  </Field>
                  <Field label="Status Badge">
                    <input
                      type="text"
                      value={aboutData.employmentStatus || ''}
                      onChange={(e) => setAboutData(prev => ({ ...prev, employmentStatus: e.target.value }))}
                      className={inputCls}
                      placeholder="Currently Working"
                    />
                  </Field>
                </div>

                <Field label="About Experience Bio">
                  <textarea
                    rows={3}
                    value={aboutData.bioText || ''}
                    onChange={(e) => setAboutData(prev => ({ ...prev, bioText: e.target.value }))}
                    className={inputCls + ' resize-none'}
                    placeholder="Description of work at agency..."
                  />
                </Field>
              </div>

              {/* Education Block */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
                <h3 className="text-xs font-bold uppercase text-purple-400 tracking-wider">Education Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Degree / Course">
                    <input
                      type="text"
                      value={aboutData.education?.degree || ''}
                      onChange={(e) => setAboutData(prev => ({
                        ...prev,
                        education: { ...prev.education, degree: e.target.value }
                      }))}
                      className={inputCls}
                      placeholder="Diploma in Computer Science"
                    />
                  </Field>
                  <Field label="Institute">
                    <input
                      type="text"
                      value={aboutData.education?.institute || ''}
                      onChange={(e) => setAboutData(prev => ({
                        ...prev,
                        education: { ...prev.education, institute: e.target.value }
                      }))}
                      className={inputCls}
                      placeholder="Borak Polytechnic Institute"
                    />
                  </Field>
                  <Field label="CGPA / Grade">
                    <input
                      type="text"
                      value={aboutData.education?.cgpa || ''}
                      onChange={(e) => setAboutData(prev => ({
                        ...prev,
                        education: { ...prev.education, cgpa: e.target.value }
                      }))}
                      className={inputCls}
                      placeholder="CGPA: 3.85 / 4.00"
                    />
                  </Field>
                  <Field label="Graduation / Semester">
                    <input
                      type="text"
                      value={aboutData.education?.graduation || ''}
                      onChange={(e) => setAboutData(prev => ({
                        ...prev,
                        education: { ...prev.education, graduation: e.target.value }
                      }))}
                      className={inputCls}
                      placeholder="Expected: December 2026"
                    />
                  </Field>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => saveSectionContent('about', aboutData)}
                disabled={savingSection}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <FaSave size={12} /> {savingSection ? 'Saving About Changes...' : 'Save About Section Changes'}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: SKILLS & TECH (Requirement #4)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'skills' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f1c]/70 border border-white/10 backdrop-blur-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FaCode size={16} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-2xl text-white tracking-widest uppercase">Skills & Tech Stack</h2>
                    <p className="text-gray-400 text-xs">Add new technologies, change proficiency levels, and brand colors</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSkillsData(prev => [
                      ...prev,
                      { name: 'New Skill', category: 'Frontend', level: 85, color: '#6366f1', accentRgb: '99, 102, 241' }
                    ]);
                  }}
                  className="px-4 py-2 border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 rounded-xl text-xs font-bold uppercase flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FaPlus size={10} /> Add Skill
                </button>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsData.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 relative group">
                    <button
                      type="button"
                      onClick={() => setSkillsData(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove skill"
                    >
                      <FaTimes size={12} />
                    </button>

                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={skill.color || '#6366f1'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSkillsData(prev => prev.map((s, i) => i === idx ? { ...s, color: val, accentRgb: hexToRgb(val) } : s));
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSkillsData(prev => prev.map((s, i) => i === idx ? { ...s, name: val } : s));
                        }}
                        className="font-bold text-white text-sm bg-transparent border-b border-white/10 focus:outline-none focus:border-indigo-400"
                        placeholder="Skill Name"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <select
                        value={skill.category || 'Frontend'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSkillsData(prev => prev.map((s, i) => i === idx ? { ...s, category: val } : s));
                        }}
                        className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-gray-300 text-xs focus:outline-none"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="Tools">Tools</option>
                        <option value="E-Commerce">E-Commerce</option>
                      </select>

                      <span className="font-mono text-indigo-400 font-bold">{skill.level}%</span>
                    </div>

                    {/* Proficiency Slider */}
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skill.level || 80}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSkillsData(prev => prev.map((s, i) => i === idx ? { ...s, level: val } : s));
                      }}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => saveSectionContent('skills', skillsData)}
                disabled={savingSection}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <FaSave size={12} /> {savingSection ? 'Saving Skills...' : 'Save Skills Changes'}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 6: CONTACT DETAILS (Requirement #4)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'contact' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f1c]/70 border border-white/10 backdrop-blur-md space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <h2 className="font-bebas text-2xl text-white tracking-widest uppercase">Contact Information</h2>
                  <p className="text-gray-400 text-xs">Update your email, phone, location, and headline</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email Address" icon={<FaEnvelope size={10} />}>
                  <input
                    type="email"
                    value={contactData.email || ''}
                    onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                    className={inputCls}
                    placeholder="email@domain.com"
                  />
                </Field>
                <Field label="Phone / WhatsApp" icon={<FaPhoneAlt size={10} />}>
                  <input
                    type="text"
                    value={contactData.phone || ''}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    className={inputCls}
                    placeholder="+880 1836-817816"
                  />
                </Field>
              </div>

              <Field label="Location" icon={<FaMapMarkerAlt size={10} />}>
                <input
                  type="text"
                  value={contactData.location || ''}
                  onChange={(e) => setContactData(prev => ({ ...prev, location: e.target.value }))}
                  className={inputCls}
                  placeholder="Dhaka, Bangladesh"
                />
              </Field>

              <Field label="Contact Section Heading" icon={<FaLayerGroup size={10} />}>
                <input
                  type="text"
                  value={contactData.heading || ''}
                  onChange={(e) => setContactData(prev => ({ ...prev, heading: e.target.value }))}
                  className={inputCls}
                  placeholder="Let's create something great together"
                />
              </Field>

              <Field label="Contact Subtitle / Description" icon={<FaLayerGroup size={10} />}>
                <textarea
                  rows={3}
                  value={contactData.description || ''}
                  onChange={(e) => setContactData(prev => ({ ...prev, description: e.target.value }))}
                  className={inputCls + ' resize-none'}
                  placeholder="Have a project in mind..."
                />
              </Field>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => saveSectionContent('contact', contactData)}
                disabled={savingSection}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <FaSave size={12} /> {savingSection ? 'Saving Contact Info...' : 'Save Contact Changes'}
              </button>
            </div>
          </div>
        )}

        {/* ── Modals & Overlays ── */}
        <AnimatePresence>
          {editingCard && (
            <CardEditModal
              card={editingCard}
              isShopify={isEditingShopify}
              token={token}
              showToast={showToast}
              onSave={(updatedProject) => {
                if (isEditingShopify) {
                  setShopifyProjects(prev => prev.map(p => (p._id === updatedProject._id || p.id === updatedProject._id) ? updatedProject : p));
                } else {
                  setProjects(prev => prev.map(p => (p._id === updatedProject._id || p.id === updatedProject._id) ? updatedProject : p));
                }
                setEditingCard(null);
                showToast(`${isEditingShopify ? 'Shopify' : 'Portfolio'} card updated successfully!`);
              }}
              onClose={() => setEditingCard(null)}
            />
          )}

          {showCreateModal && (
            <CardCreateModal
              isShopify={isCreatingShopify}
              token={token}
              showToast={showToast}
              onCreated={(newProject) => {
                if (isCreatingShopify) {
                  setShopifyProjects(prev => [...prev, newProject]);
                } else {
                  setProjects(prev => [...prev, newProject]);
                }
                setShowCreateModal(false);
                showToast(`${isCreatingShopify ? 'Shopify' : 'Portfolio'} card created successfully!`);
              }}
              onClose={() => setShowCreateModal(false)}
            />
          )}

          {deleteTarget && (
            <DeleteModal
              projectTitle={deleteTarget.title}
              onConfirm={confirmDelete}
              onCancel={() => setDeleteTarget(null)}
            />
          )}

          {deleteShopifyTarget && (
            <DeleteModal
              projectTitle={deleteShopifyTarget.title}
              onConfirm={handleDeleteShopifyConfirm}
              onCancel={() => setDeleteShopifyTarget(null)}
            />
          )}

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Dashboard;
