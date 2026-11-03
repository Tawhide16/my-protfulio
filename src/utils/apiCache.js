import { API_BASE } from '../config/api.js';
import { staticProjects, shopifyProjects } from '../data/staticData.js';

// In-memory cache for ultra-fast (0ms) synchronous access within the session
const memoryCache = new Map();
const inFlightRequests = new Map();

const CACHE_KEYS = {
  PROJECTS: 'portfolio_cache_projects_v2',
  SHOPIFY: 'portfolio_cache_shopify_v2',
  CONTENT: 'portfolio_cache_content_v2',
};

// Safe localStorage access
const getStorageItem = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data || null;
  } catch {
    return null;
  }
};

const setStorageItem = (key, data) => {
  if (typeof window === 'undefined' || !data) return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Quota exceeded or private mode, ignore safely
  }
};

/**
 * Fetch with timeout and in-flight deduplication
 */
export async function deduplicatedFetch(url, { timeout = 8000 } = {}) {
  // If an identical request is already running, return the existing promise
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url);
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeout) : null;

  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, {
        signal: controller?.signal,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      inFlightRequests.delete(url);
    }
  })();

  inFlightRequests.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * PROJECTS CACHE & FAST FETCHER
 */
export function getInitialProjects() {
  if (memoryCache.has(CACHE_KEYS.PROJECTS)) {
    return memoryCache.get(CACHE_KEYS.PROJECTS);
  }
  const stored = getStorageItem(CACHE_KEYS.PROJECTS);
  if (Array.isArray(stored) && stored.length > 0) {
    memoryCache.set(CACHE_KEYS.PROJECTS, stored);
    return stored;
  }
  return staticProjects;
}

export async function fetchProjectsFast(onUpdate) {
  // 1. Immediately provide cached data from localStorage/memory if available
  const cached = getInitialProjects();
  if (cached && cached !== staticProjects && onUpdate) {
    onUpdate(cached);
  }

  try {
    const data = await deduplicatedFetch(`${API_BASE}/projects`);
    if (Array.isArray(data) && data.length > 0) {
      const sorted = [...data].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        if (a.number && b.number) return a.number.localeCompare(b.number);
        return 0;
      });
      memoryCache.set(CACHE_KEYS.PROJECTS, sorted);
      setStorageItem(CACHE_KEYS.PROJECTS, sorted);
      if (onUpdate) onUpdate(sorted);
      return sorted;
    }
  } catch {
    // If backend fails or sleeps, fallback data is already shown
  }
  return getInitialProjects();
}

/**
 * SHOPIFY PROJECTS CACHE & FAST FETCHER
 */
export function getInitialShopifyProjects() {
  if (memoryCache.has(CACHE_KEYS.SHOPIFY)) {
    return memoryCache.get(CACHE_KEYS.SHOPIFY);
  }
  const stored = getStorageItem(CACHE_KEYS.SHOPIFY);
  if (Array.isArray(stored) && stored.length > 0) {
    memoryCache.set(CACHE_KEYS.SHOPIFY, stored);
    return stored;
  }
  return shopifyProjects;
}

export async function fetchShopifyProjectsFast(onUpdate) {
  // 1. Immediately provide cached data from localStorage/memory if available
  const cached = getInitialShopifyProjects();
  if (cached && cached !== shopifyProjects && onUpdate) {
    onUpdate(cached);
  }

  try {
    const data = await deduplicatedFetch(`${API_BASE}/shopify-projects`);
    if (Array.isArray(data) && data.length > 0) {
      const sorted = [...data].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        if (a.number && b.number) return a.number.localeCompare(b.number);
        return 0;
      });
      memoryCache.set(CACHE_KEYS.SHOPIFY, sorted);
      setStorageItem(CACHE_KEYS.SHOPIFY, sorted);
      if (onUpdate) onUpdate(sorted);
      return sorted;
    }
  } catch {
    // Silently retain cached/fallback
  }
  return getInitialShopifyProjects();
}

/**
 * SITE CONTENT CACHE & FAST FETCHER (Deduplicated for Hero, Navbar, About, Skills, Contact)
 */
export function getInitialSiteContent(section) {
  const allContent = memoryCache.get(CACHE_KEYS.CONTENT) || getStorageItem(CACHE_KEYS.CONTENT);
  if (allContent && section && allContent[section]) {
    return allContent[section];
  }
  return allContent || null;
}

export async function fetchSiteContentFast(section, onUpdate) {
  // First provide instant cached data if available
  const cached = getInitialSiteContent(section);
  if (cached && onUpdate) {
    onUpdate(cached);
  }

  try {
    const data = await deduplicatedFetch(`${API_BASE}/content`);
    if (data && typeof data === 'object') {
      memoryCache.set(CACHE_KEYS.CONTENT, data);
      setStorageItem(CACHE_KEYS.CONTENT, data);
      if (onUpdate) {
        if (section && data[section]) {
          onUpdate(data[section]);
        } else if (!section) {
          onUpdate(data);
        }
      }
      return data;
    }
  } catch {
    // Graceful fallback
  }
  return cached;
}

/**
 * GET SINGLE PROJECT BY ID (Instant fallback from static/cached + background fetch)
 */
export function getInitialSingleProject(id) {
  const all = getInitialProjects();
  return all.find(p => String(p.id) === String(id) || String(p._id) === String(id)) || null;
}

export async function fetchSingleProjectFast(id, onUpdate) {
  const cached = getInitialSingleProject(id);
  if (cached && onUpdate) {
    onUpdate(cached);
  }

  try {
    const project = await deduplicatedFetch(`${API_BASE}/projects/${id}`);
    if (project && (project._id || project.id)) {
      if (onUpdate) onUpdate(project);
      return project;
    }
  } catch {
    // Handled by returning cached fallback
  }
  return cached;
}

/**
 * Clear cache (e.g. after Dashboard mutations)
 */
export function clearPortfolioCache(key) {
  if (key) {
    memoryCache.delete(key);
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(key); } catch {}
    }
  } else {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(CACHE_KEYS.PROJECTS);
        localStorage.removeItem(CACHE_KEYS.SHOPIFY);
        localStorage.removeItem(CACHE_KEYS.CONTENT);
      } catch {}
    }
  }
}
