'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDatabase,
  FaLock,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaGithub,
  FaShopify,
  FaCode,
  FaLayerGroup,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaSync,
  FaUpload,
  FaFilePdf,
  FaFileDownload,
  FaPen,
  FaUserAlt,
  FaEnvelope,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaTools,
  FaGraduationCap,
  FaBriefcase,
  FaAward,
} from 'react-icons/fa';
import Link from 'next/link';
import { defaultSiteContent, defaultSkillsList } from '@/data/defaultContent';

/* ── Sortable drag-and-drop project card ── */
function SortableProjectCard({ project, index, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id || project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl relative"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-10 z-20 cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-black/50 text-gray-400 hover:text-white transition-colors"
        title="Drag to reorder"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="7" cy="5" r="1.5" /><circle cx="13" cy="5" r="1.5" />
          <circle cx="7" cy="10" r="1.5" /><circle cx="13" cy="10" r="1.5" />
          <circle cx="7" cy="15" r="1.5" /><circle cx="13" cy="15" r="1.5" />
        </svg>
      </div>

      <div>
        {/* Image Preview */}
        <div className="relative h-44 bg-gray-800 overflow-hidden">
          {project.image1 ? (
            <img src={project.image1} alt={project.title} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image Uploaded</div>
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
            #{index + 1}
          </span>
          <span className="absolute top-3 right-3 w-3 h-3 rounded-full" style={{ background: project.accentColor || '#6366f1' }} />
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-[11px] font-bold tracking-wider uppercase mb-1" style={{ color: project.accentColor || '#6366f1' }}>
            {project.subtitle || 'Project'}
          </p>
          <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
          <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {(project.technologies || []).slice(0, 4).map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-gray-300">{tech}</span>
            ))}
            {(project.technologies || []).length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] text-gray-500">+{(project.technologies || []).length - 4} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-2 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs transition-colors" title="Live Demo">
              <FaExternalLinkAlt />
            </a>
          )}
          {project.gitLinkClient && (
            <a href={project.gitLinkClient} target="_blank" rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs transition-colors" title="GitHub">
              <FaGithub />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(project)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors cursor-pointer">
            <FaEdit /> Edit
          </button>
          <button onClick={() => onDelete(project)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('mern'); // 'mern', 'shopify', 'content', 'skills', 'documents'

  // Data state
  const [mernProjects, setMernProjects] = useState([]);
  const [shopifyProjects, setShopifyProjects] = useState([]);
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingProfileImg, setUploadingProfileImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [toast, setToast] = useState(null);

  // New Skill form state
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Frontend',
    color: '#6366f1',
    level: 85,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentProject, setCurrentProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state for Projects
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    technologies: '',
    features: '',
    liveLink: '',
    gitLinkClient: '',
    gitLinkServer: '',
    image1: '',
    accentColor: '#6366f1',
    number: '',
  });

  // File input refs
  const projectImageInputRef = useRef(null);
  const bannerImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const cvInputRef = useRef(null);

  // Check auth session
  useEffect(() => {
    const token = localStorage.getItem('portfolio_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setActionLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('portfolio_admin_token', data.token);
        setIsAuthenticated(true);
        fetchAllData();
        showToast('Login successful! Welcome back.');
      } else {
        setAuthError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_token');
    setIsAuthenticated(false);
    showToast('Logged out successfully');
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [mernRes, shopifyRes, contentRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/shopify-projects'),
        fetch('/api/content'),
      ]);

      const mernData = await mernRes.json();
      const shopifyData = await shopifyRes.json();
      const contentData = await contentRes.json();

      if (mernData.success) setMernProjects(mernData.data);
      if (shopifyData.success) setShopifyProjects(shopifyData.data);
      if (contentData.success && contentData.data) {
        setSiteContent({
          ...defaultSiteContent,
          ...contentData.data,
          hero: { ...defaultSiteContent.hero, ...(contentData.data.hero || {}) },
          about: { ...defaultSiteContent.about, ...(contentData.data.about || {}) },
          skills: contentData.data.skills && contentData.data.skills.length > 0 ? contentData.data.skills : defaultSkillsList,
          skillsStats: { ...defaultSiteContent.skillsStats, ...(contentData.data.skillsStats || {}) },
          contact: {
            ...defaultSiteContent.contact,
            ...(contentData.data.contact || {}),
            socials: { ...defaultSiteContent.contact.socials, ...(contentData.data.contact?.socials || {}) },
          },
          footer: { ...defaultSiteContent.footer, ...(contentData.data.footer || {}) },
        });
      }
    } catch (err) {
      showToast('Error loading data from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // File Upload Handlers
  // ----------------------------------------------------
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append('file', file);
    body.append('type', 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, image1: data.url }));
        showToast('Image uploaded successfully!');
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      showToast('Upload error', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfileImg(true);
    const body = new FormData();
    body.append('file', file);
    body.append('type', 'profile-image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();

      if (data.success) {
        const updatedHero = { ...siteContent.hero, profileImg: data.url };
        const newContent = { ...siteContent, hero: updatedHero };
        setSiteContent(newContent);

        // Auto save to MongoDB
        await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newContent),
        });

        showToast('Banner Profile Image uploaded and activated!');
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast('Banner image upload error', 'error');
    } finally {
      setUploadingProfileImg(false);
    }
  };

  const handleDocumentUpload = async (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const body = new FormData();
    body.append('file', file);
    body.append('type', docType);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();

      if (data.success) {
        const updatedHero = {
          ...siteContent.hero,
          [docType === 'resume' ? 'resumeUrl' : 'cvUrl']: data.url,
        };
        const newContent = { ...siteContent, hero: updatedHero };
        setSiteContent(newContent);

        // Save to backend
        await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newContent),
        });

        showToast(`${docType === 'resume' ? 'Resume' : 'CV'} PDF uploaded and activated!`);
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast('Document upload error', 'error');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSaveSiteContent = async (e) => {
    if (e) e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteContent),
      });
      const data = await res.json();
      if (data.success) {
        showToast('All section content saved successfully!');
      } else {
        showToast(data.message || 'Save failed', 'error');
      }
    } catch (err) {
      showToast('Failed to save site content', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      showToast('Please enter a skill name', 'error');
      return;
    }

    const currentSkills = siteContent.skills || defaultSkillsList;
    const updatedSkills = [
      ...currentSkills,
      {
        ...newSkill,
        accentRgb: '99, 102, 241',
      },
    ];

    const updatedContent = { ...siteContent, skills: updatedSkills };
    setSiteContent(updatedContent);
    setNewSkill({ name: '', category: 'Frontend', color: '#6366f1', level: 85 });
    showToast(`Skill "${newSkill.name}" added! Click "Save All Content" to persist.`);
  };

  const handleRemoveSkill = (skillIndex) => {
    const currentSkills = siteContent.skills || defaultSkillsList;
    const updatedSkills = currentSkills.filter((_, idx) => idx !== skillIndex);
    setSiteContent({ ...siteContent, skills: updatedSkills });
    showToast('Skill removed. Click "Save All Content" to save.');
  };

  const handleSeedDatabase = async () => {
    if (!confirm('This will seed the initial project data into your MongoDB database. Continue?')) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Database populated with initial data!');
        fetchAllData();
      } else {
        showToast(data.message || 'Seed failed', 'error');
      }
    } catch (err) {
      showToast('Failed to seed database', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------------------------
  // Project CRUD Handlers
  // ----------------------------------------------------
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentProject(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      technologies: '',
      features: '',
      liveLink: '',
      gitLinkClient: '',
      gitLinkServer: '',
      image1: '',
      accentColor: activeTab === 'mern' ? '#6366f1' : '#22c55e',
      number: String((activeTab === 'mern' ? mernProjects.length : shopifyProjects.length) + 1).padStart(2, '0'),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setModalMode('edit');
    setCurrentProject(project);
    setFormData({
      title: project.title || '',
      subtitle: project.subtitle || '',
      description: project.description || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      features: Array.isArray(project.features) ? project.features.join('\n') : '',
      liveLink: project.liveLink || '',
      gitLinkClient: project.gitLinkClient || '',
      gitLinkServer: project.gitLinkServer || '',
      image1: project.image1 || '',
      accentColor: project.accentColor || (activeTab === 'mern' ? '#6366f1' : '#22c55e'),
      number: project.number || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      features: formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    const endpoint =
      activeTab === 'mern'
        ? modalMode === 'create'
          ? '/api/projects'
          : `/api/projects/${currentProject._id}`
        : modalMode === 'create'
        ? '/api/shopify-projects'
        : `/api/shopify-projects/${currentProject._id}`;

    const method = modalMode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showToast(
          modalMode === 'create'
            ? 'Project created successfully in MongoDB!'
            : 'Project updated successfully!'
        );
        setIsModalOpen(false);
        fetchAllData();
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Network error while saving project', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (project) => {
    setActionLoading(true);
    const endpoint =
      activeTab === 'mern'
        ? `/api/projects/${project._id}`
        : `/api/shopify-projects/${project._id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        showToast('Project deleted successfully!');
        setDeleteConfirmId(null);
        fetchAllData();
      } else {
        showToast(data.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Failed to delete project', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------------------------
  // DRAG & DROP REORDER
  // ----------------------------------------------------
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const list = activeTab === 'mern' ? mernProjects : shopifyProjects;
    const setList = activeTab === 'mern' ? setMernProjects : setShopifyProjects;
    const oldIndex = list.findIndex((p) => (p._id || p.id) === active.id);
    const newIndex = list.findIndex((p) => (p._id || p.id) === over.id);
    const reordered = arrayMove(list, oldIndex, newIndex);
    setList(reordered);

    // Save new order to DB
    try {
      const endpoint = activeTab === 'mern' ? '/api/projects/reorder' : '/api/shopify-projects/reorder';
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: reordered.map((p) => p._id || p.id) }),
      });
      showToast('Order saved! Portfolio updated.');
    } catch {
      showToast('Order saved locally — DB sync failed.', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-gray-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl mx-auto mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <FaLock />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Portfolio CMS Dashboard</h1>
            <p className="text-xs text-gray-400">Enter your administrator credentials to manage your website.</p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <FaTimes /> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {actionLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft /> Back to Live Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN DASHBOARD INTERFACE
  // ----------------------------------------------------
  const currentList = activeTab === 'mern' ? mernProjects : shopifyProjects;

  return (
    <div className="min-h-screen bg-[#08080f] text-gray-200">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl border text-sm font-semibold shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-red-500/20 border-red-500/30 text-red-300'
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {toast.type === 'error' ? <FaTimes /> : <FaCheck />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-gray-900/80 border-b border-white/10 backdrop-blur-xl px-6 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
              <FaDatabase />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Portfolio Admin CMS</h1>
              <p className="text-[11px] text-green-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                MongoDB Atlas Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-colors"
            >
              <FaExternalLinkAlt /> View Live Website
            </Link>

            <button
              onClick={handleSeedDatabase}
              disabled={actionLoading}
              title="Populate MongoDB with default initial projects"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FaSync /> Reset / Seed DB
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-gray-900 border border-white/10 mb-8 w-fit overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('mern')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mern'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaCode /> MERN ({mernProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('shopify')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'shopify'
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaShopify /> Shopify ({shopifyProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaPen /> Edit Sections
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'skills'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaTools /> Skills & Stats
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaFilePdf /> Resume & CV
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1 & 2: MERN OR SHOPIFY PROJECTS */}
        {/* ======================================================== */}
        {(activeTab === 'mern' || activeTab === 'shopify') && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-white">
                  {activeTab === 'mern' ? 'MERN Stack Applications' : 'Shopify Store Projects'}
                </h2>
                <p className="text-xs text-gray-400">
                  Manage cards, descriptions, uploaded images, and live links displayed on the homepage.
                </p>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              >
                <FaPlus /> Add New {activeTab === 'mern' ? 'MERN Project' : 'Shopify Store'}
              </button>
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-500">Loading projects from database...</div>
            ) : currentList.length === 0 ? (
              <div className="py-20 text-center bg-gray-900/50 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-sm mb-4">No projects found in this section yet.</p>
                <button
                  onClick={handleSeedDatabase}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold"
                >
                  Click here to Seed Default Projects
                </button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={currentList.map((p) => p._id || p.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentList.map((project, index) => (
                      <SortableProjectCard
                        key={project._id || project.id || index}
                        project={project}
                        index={index}
                        onEdit={handleOpenEditModal}
                        onDelete={setDeleteConfirmId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: EDIT ALL SITE SECTIONS & BANNER PROFILE IMAGE */}
        {/* ======================================================== */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveSiteContent} className="space-y-8 max-w-5xl">
            {/* HERO & BANNER SECTION */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">
                  <FaUserAlt />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Hero & Banner Section</h3>
                  <p className="text-xs text-gray-400">Change banner profile picture, name, typing animation, and bio.</p>
                </div>
              </div>

              {/* 📸 BANNER PROFILE IMAGE UPLOAD */}
              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">
                  📸 Banner Profile Photo (Direct Upload)
                </label>

                <input
                  type="file"
                  ref={bannerImageInputRef}
                  onChange={handleBannerImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 shadow-xl bg-gray-800 flex-shrink-0">
                    <img
                      src={
                        siteContent.hero?.profileImg ||
                        '/src/assets/profile-img-2.jpg'
                      }
                      alt="Banner Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs text-gray-300">
                      Upload any JPG/PNG/WebP photo. It will immediately appear on the landing page hero banner with the animated glow ring!
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => bannerImageInputRef.current?.click()}
                        disabled={uploadingProfileImg}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                      >
                        <FaUpload /> {uploadingProfileImg ? 'Uploading...' : 'Upload New Profile Photo'}
                      </button>

                      {siteContent.hero?.profileImg && (
                        <button
                          type="button"
                          onClick={() => {
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, profileImg: '' },
                            });
                            showToast('Reset to default photo');
                          }}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs transition-colors cursor-pointer"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.firstName || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, firstName: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Last Name (Gradient Color)
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.lastName || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, lastName: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Status Badge Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.statusBadge || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, statusBadge: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero?.location || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        hero: { ...siteContent.hero, location: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Typing Animation Roles (comma-separated)
                </label>
                <input
                  type="text"
                  value={(siteContent.hero?.roles || []).join(', ')}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      hero: {
                        ...siteContent.hero,
                        roles: e.target.value.split(',').map((r) => r.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Hero Bio Text
                </label>
                <textarea
                  rows="3"
                  value={siteContent.hero?.bio || ''}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, bio: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Profile Floating Badge Text
                </label>
                <input
                  type="text"
                  value={siteContent.hero?.seekingGrowthText || ''}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      hero: { ...siteContent.hero, seekingGrowthText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* ABOUT ME SECTION */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg">
                  <FaBriefcase />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">About Me Section</h3>
                  <p className="text-xs text-gray-400">Manage work experience, education, tech journey, and 4 professional pillars.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Current Role Title
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.currentRoleTitle || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        about: { ...siteContent.about, currentRoleTitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.currentCompany || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        about: { ...siteContent.about, currentCompany: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Work Location / Type
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.workType || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        about: { ...siteContent.about, workType: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Work Duration
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.workDuration || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        about: { ...siteContent.about, workDuration: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Work Description
                </label>
                <textarea
                  rows="3"
                  value={siteContent.about?.workDescription || ''}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      about: { ...siteContent.about, workDescription: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tech Stack Used at Work (comma-separated)
                </label>
                <input
                  type="text"
                  value={(siteContent.about?.techAtWork || []).join(', ')}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      about: {
                        ...siteContent.about,
                        techAtWork: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      },
                    })
                  }
                  placeholder="React, Next.js, Node.js, MongoDB, Shopify"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Education Degree
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.educationDegree || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        about: { ...siteContent.about, educationDegree: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Institute & Semester
                  </label>
                  <input
                    type="text"
                    value={siteContent.about?.educationInstitute || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        about: { ...siteContent.about, educationInstitute: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Education Bullet Points (one per line)
                </label>
                <textarea
                  rows="3"
                  value={(siteContent.about?.educationPoints || []).join('\n')}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      about: {
                        ...siteContent.about,
                        educationPoints: e.target.value.split('\n').map((p) => p.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tech Journey Description
                </label>
                <textarea
                  rows="2"
                  value={siteContent.about?.techJourneyText || ''}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      about: { ...siteContent.about, techJourneyText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tech Journey Highlights (one per line)
                </label>
                <textarea
                  rows="3"
                  value={(siteContent.about?.techJourneyPoints || []).join('\n')}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      about: {
                        ...siteContent.about,
                        techJourneyPoints: e.target.value.split('\n').map((p) => p.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* CONTACT & SOCIALS & FOOTER */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-lg">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Contact, Socials & Footer</h3>
                  <p className="text-xs text-gray-400">Update direct contact info, social handles, and footer bio.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={siteContent.contact?.email || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact?.phone || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Address / City
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact?.address || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, address: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Availability Badge Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact?.availabilityText || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: { ...siteContent.contact, availabilityText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={siteContent.contact?.socials?.github || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: {
                          ...siteContent.contact,
                          socials: { ...siteContent.contact?.socials, github: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={siteContent.contact?.socials?.linkedin || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: {
                          ...siteContent.contact,
                          socials: { ...siteContent.contact?.socials, linkedin: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Twitter / X URL
                  </label>
                  <input
                    type="url"
                    value={siteContent.contact?.socials?.twitter || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: {
                          ...siteContent.contact,
                          socials: { ...siteContent.contact?.socials, twitter: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={siteContent.contact?.socials?.facebook || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        contact: {
                          ...siteContent.contact,
                          socials: { ...siteContent.contact?.socials, facebook: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Footer Bio Description
                </label>
                <textarea
                  rows="2"
                  value={siteContent.footer?.bio || ''}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      footer: { ...siteContent.footer, bio: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow transition-all cursor-pointer"
            >
              {actionLoading ? 'Saving Changes...' : '💾 Save All Section Content'}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SKILLS & STATS MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-8 max-w-5xl">
            {/* ADD NEW SKILL */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg">
                  <FaTools />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Add New Skill</h3>
                  <p className="text-xs text-gray-400">Add technologies that will show up in the Skills section grid.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g. Next.js, Redux, Docker"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newSkill.color}
                      onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={newSkill.color}
                      onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add Skill
                  </button>
                </div>
              </div>
            </div>

            {/* CURRENT SKILLS LIST */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white">Current Active Skills ({siteContent.skills?.length || 0})</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {(siteContent.skills || defaultSkillsList).map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{sk.name}</p>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${sk.color || '#6366f1'}20`, color: sk.color || '#6366f1' }}
                      >
                        {sk.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs transition-colors cursor-pointer"
                      title="Remove Skill"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* STATS AT BOTTOM OF SKILLS */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white">Bottom Strip Statistics</h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Technologies
                  </label>
                  <input
                    type="text"
                    value={siteContent.skillsStats?.technologies || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        skillsStats: { ...siteContent.skillsStats, technologies: e.target.value },
                      })
                    }
                    placeholder="10+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Projects Built
                  </label>
                  <input
                    type="text"
                    value={siteContent.skillsStats?.projectsBuilt || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        skillsStats: { ...siteContent.skillsStats, projectsBuilt: e.target.value },
                      })
                    }
                    placeholder="10+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Shopify Stores
                  </label>
                  <input
                    type="text"
                    value={siteContent.skillsStats?.shopifyStores || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        skillsStats: { ...siteContent.skillsStats, shopifyStores: e.target.value },
                      })
                    }
                    placeholder="6+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Years Learning
                  </label>
                  <input
                    type="text"
                    value={siteContent.skillsStats?.yearsLearning || ''}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        skillsStats: { ...siteContent.skillsStats, yearsLearning: e.target.value },
                      })
                    }
                    placeholder="2+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSiteContent}
                disabled={actionLoading}
                className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow transition-all cursor-pointer"
              >
                {actionLoading ? 'Saving...' : '💾 Save Skills & Stats'}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: RESUME & CV PDF MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {/* Resume Upload Card */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl mb-4">
                  <FaFilePdf />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Official Resume (PDF)</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Upload your updated official Resume. When uploaded, the &quot;Resume&quot; buttons in the Navbar and Hero will automatically download this file.
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                  <p className="text-xs text-gray-400 font-semibold mb-1">Current Resume File:</p>
                  <p className="text-xs text-indigo-300 break-all font-mono">
                    {siteContent.hero?.resumeUrl || '/Tawhide-hasan-bejoy-official(5).pdf'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={(e) => handleDocumentUpload(e, 'resume')}
                  accept="application/pdf"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingPdf}
                  onClick={() => resumeInputRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                >
                  <FaUpload /> {uploadingPdf ? 'Uploading...' : 'Upload New Resume PDF'}
                </button>

                {siteContent.hero?.resumeUrl && (
                  <a
                    href={siteContent.hero.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <FaFileDownload /> Preview Current Resume
                  </a>
                )}
              </div>
            </div>

            {/* CV Upload Card */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-2xl mb-4">
                  <FaFilePdf />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Curriculum Vitae (CV)</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Upload an extended academic or detailed industry Curriculum Vitae PDF document.
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                  <p className="text-xs text-gray-400 font-semibold mb-1">Current CV File:</p>
                  <p className="text-xs text-cyan-300 break-all font-mono">
                    {siteContent.hero?.cvUrl || 'No separate CV uploaded yet'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  ref={cvInputRef}
                  onChange={(e) => handleDocumentUpload(e, 'cv')}
                  accept="application/pdf"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingPdf}
                  onClick={() => cvInputRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                >
                  <FaUpload /> {uploadingPdf ? 'Uploading...' : 'Upload New CV PDF'}
                </button>

                {siteContent.hero?.cvUrl && (
                  <a
                    href={siteContent.hero.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <FaFileDownload /> Preview Current CV
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* EDIT / CREATE PROJECT MODAL (WITH IMAGE FILE UPLOAD) */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  {modalMode === 'create' ? 'Add New' : 'Edit'}{' '}
                  {activeTab === 'mern' ? 'MERN Project' : 'Shopify Store'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-5">
                {/* IMAGE UPLOAD SECTION */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Project Image Upload *
                  </label>

                  <input
                    type="file"
                    ref={projectImageInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    {formData.image1 ? (
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-white/20 bg-gray-800 flex-shrink-0">
                        <img
                          src={formData.image1}
                          alt="Uploaded Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-24 rounded-lg border border-dashed border-white/20 bg-gray-800/50 flex flex-col items-center justify-center text-gray-500 flex-shrink-0">
                        <FaImage className="text-xl mb-1" />
                        <span className="text-[10px]">No image</span>
                      </div>
                    )}

                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs text-gray-300 font-medium mb-1 truncate max-w-xs">
                        {formData.image1 ? formData.image1 : 'No image uploaded yet'}
                      </p>
                      <button
                        type="button"
                        onClick={() => projectImageInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <FaUpload /> {uploadingImage ? 'Uploading Image...' : 'Choose Image File'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g. Next Class"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Subtitle / Category
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Education Platform"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Description *
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Brief description of the project..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Accent Theme Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows="3"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Role-based dashboards&#10;Stripe-powered enrollments&#10;JWT authentication"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Live Demo Link
                    </label>
                    <input
                      type="url"
                      value={formData.liveLink}
                      onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {activeTab === 'mern' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        GitHub Client Link
                      </label>
                      <input
                        type="url"
                        value={formData.gitLinkClient}
                        onChange={(e) => setFormData({ ...formData, gitLinkClient: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {activeTab === 'mern' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        GitHub Server Link (optional)
                      </label>
                      <input
                        type="url"
                        value={formData.gitLinkServer}
                        onChange={(e) => setFormData({ ...formData, gitLinkServer: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow transition-all cursor-pointer"
                  >
                    {actionLoading ? 'Saving...' : modalMode === 'create' ? 'Create Project' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">Delete Project</h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to delete <span className="text-white font-bold">&quot;{deleteConfirmId.title}&quot;</span>? This will permanently remove it from MongoDB.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(deleteConfirmId)}
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow transition-colors cursor-pointer"
                >
                  {actionLoading ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
