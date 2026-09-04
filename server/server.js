import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import Project from './models/Project.js';
import ShopifyProject from './models/ShopifyProject.js';
import Admin from './models/Admin.js';
import SiteContent from './models/SiteContent.js';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Configure Uploads Folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Allowed formats: images (jpg, png, webp, gif) and documents (pdf, doc, docx)!'));
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    try {
      await mongoose.connection.db.collection('shopifyprojects').dropIndex('customId_1');
    } catch (_) {}
    try {
      await mongoose.connection.db.collection('sitecontents').dropIndex('key_1');
    } catch (_) {}
    await seedAdmin();
    await seedProjects();
    await seedShopifyProjects();
    await seedContent();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Seeding Default Admin
const seedAdmin = async () => {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    let admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      console.log('Seeding default admin user...');
      admin = new Admin({
        username: 'admin',
        password: adminPassword
      });
      await admin.save();
      console.log('Default admin user seeded successfully.');
    } else if (process.env.ADMIN_PASSWORD) {
      admin.password = adminPassword;
      await admin.save();
      console.log('Admin password synchronized with ADMIN_PASSWORD.');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
};

// Initial Seeding Logic
const seedProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('Seeding initial projects data...');
      const initialProjects = [
        {
          title: 'Next Class',
          subtitle: 'Education Management Platform',
          description: 'A full-stack MERN app for smooth class management, secure login, and seamless payments.',
          technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Firebase'],
          features: ['Role-based dashboards', 'Stripe-powered enrollments', 'Assignment creation & submission', 'JWT-secured private routes'],
          accentColor: '#6366f1',
          accentRgb: '99, 102, 241',
          liveLink: 'https://my-school-b2c91.web.app/',
          gitLinkClient: 'https://github.com/Tawhide16/Next-class-client',
          image1: '/NEXT-CLASS.png',
          number: '01'
        },
        {
          title: 'VibeCircle',
          subtitle: 'Social Media Platform',
          description: 'Social media platform for connecting with like-minded people and sharing experiences.',
          technologies: ['React', 'Firebase', 'Tailwind CSS'],
          features: ['User authentication', 'Real-time posts', 'Like and comment system', 'Responsive design'],
          accentColor: '#8b5cf6',
          accentRgb: '139, 92, 246',
          liveLink: 'https://my-assignment-10-a4262.web.app/',
          gitLinkClient: 'https://github.com/Tawhide16/Vibe-Circle',
          image1: '/vibe.png',
          number: '02'
        },
        {
          title: 'Hotel Booking',
          subtitle: 'Reservation System',
          description: 'Complete hotel reservation system with room selection and booking management.',
          technologies: ['React', 'Node.js', 'MongoDB'],
          features: ['Room availability calendar', 'User dashboard', 'Booking history', 'Admin panel'],
          accentColor: '#10b981',
          accentRgb: '16, 185, 129',
          liveLink: 'https://my-hotel-a3994.web.app/',
          gitLinkClient: 'https://github.com/Tawhide16/Hotel-booking-client',
          image1: '/hotel-booke.png',
          number: '03'
        },
        {
          title: 'Event Explorer',
          subtitle: 'Event Discovery Platform',
          description: 'Platform for discovering and registering for local events and activities.',
          technologies: ['React', 'Express', 'MongoDB', 'Firebase'],
          features: ['Location-based search', 'Event filtering', 'Ticket purchasing', 'User reviews'],
          accentColor: '#f43f5e',
          accentRgb: '244, 63, 94',
          liveLink: 'https://fluffy-clafoutis-ef0d5e.netlify.app/',
          gitLinkClient: 'https://github.com/Tawhide16/event-explorer-client',
          image1: '/event.png',
          number: '04'
        }
      ];
      await Project.insertMany(initialProjects);
      console.log('Seeded 4 initial projects successfully.');
    }
  } catch (err) {
    console.error('Error seeding projects:', err.message);
  }
};

export const initialShopifyProjects = [
  {
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
    order: 0
  },
  {
    title: 'Ruby Art — Gallery',
    subtitle: 'Art & Jewelry',
    description: "Born from Nuances of the Night, this line reimagines the exhibition's world of metal, desire and transformation into wearable contemporary pieces.",
    technologies: ['Shopify', 'Liquid Template', 'Shopify API', 'Next.js'],
    features: ['Product variant management', 'Real-time inventory tracking', 'Customer review system', 'Multi-currency support'],
    accentColor: '#10b981',
    accentRgb: '16, 185, 129',
    liveLink: 'https://rubyart.gr/',
    image1: '/rubyart.png',
    number: '02',
    order: 1
  },
  {
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
    order: 2
  },
  {
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
    order: 3
  },
  {
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
    order: 4
  },
  {
    title: 'Child Gaming Store',
    subtitle: 'Kids & Gaming',
    description: "Shopify store for children's gaming products with fun UI, parental controls and age-based filtering.",
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['Age-based filtering', 'Parental controls', 'Wishlist functionality', 'Gift wrapping options'],
    accentColor: '#f59e0b',
    accentRgb: '245, 158, 11',
    liveLink: 'https://etiano.myshopify.com/en',
    image1: '/child-gamming.png',
    number: '06',
    order: 5
  },
  {
    title: 'Gym Clothing Store (Men & Women)',
    subtitle: 'FITNESS & APPAREL',
    description: 'A modern Shopify-based gym clothing store designed for both men and women. Built with a clean UI, fast performance, and a smooth shopping experience using custom Liquid development.',
    technologies: ['Shopify', 'Liquid Template', 'Shopify API'],
    features: ['Responsive design for all devices', 'Product filtering & clean shop layout', 'Size guide for better user experience', 'Contact page with user-friendly form', 'Optimized product pages for conversions', 'Fast loading & smooth navigation'],
    accentColor: '#22c55e',
    accentRgb: '34, 197, 94',
    liveLink: 'https://gym-wear-store.myshopify.com/',
    image1: '/gym.png',
    number: '07',
    order: 6
  }
];

const seedShopifyProjects = async () => {
  try {
    const count = await ShopifyProject.countDocuments();
    if (count === 0) {
      console.log('Seeding initial shopify projects data...');
      await ShopifyProject.insertMany(initialShopifyProjects);
      console.log('Seeded 7 initial shopify projects successfully.');
    }
  } catch (err) {
    console.error('Error seeding shopify projects:', err.message);
  }
};

// Default Site Content for Sections
export const defaultSiteContent = {
  hero: {
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
  },
  about: {
    currentPosition: 'Web Developer',
    employmentStatus: 'Currently Working',
    company: 'Softvence Agency',
    location: 'On-Site, Dhaka, BD',
    duration: '2025 – Present',
    bioText: 'Working as a professional web developer at Softvence, building and delivering high-quality client projects — including custom Shopify stores, full-stack MERN applications, and responsive UI/UX implementations.',
    techAtWork: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Shopify'],
    education: {
      degree: 'Diploma in Computer Science',
      institute: 'Borak Polytechnic Institute',
      semester: '7th Semester',
      cgpa: 'CGPA: 3.85 / 4.00 — Top 5% of class',
      graduation: 'Expected Graduation: December 2026',
      coreSubjects: 'Core subjects: DSA, Networking, Web Technology'
    },
    journey: {
      typewriterWords: ['web applications', 'responsive UIs', 'full-stack projects', 'Shopify stores'],
      points: [
        '500+ hours of coding in 2024–2025',
        '10+ full-stack & e-commerce projects delivered',
        'Worked with international clients via Softvence'
      ]
    },
    strengths: [
      { title: 'Clean Code', color: '#6366f1', points: ['Readable & maintainable', 'Component-driven design', 'DRY principles'] },
      { title: 'Performance', color: '#22c55e', points: ['Optimized rendering', 'Lazy loading', 'Fast load times'] },
      { title: 'Collaboration', color: '#f59e0b', points: ['Git & version control', 'Team communication', 'On-time delivery'] },
      { title: 'Growth Mindset', color: '#a855f7', points: ['Constantly learning', 'Adapts to new tech', 'Open to feedback'] }
    ]
  },
  skills: [
    { name: 'React', category: 'Frontend', color: '#22d3ee', accentRgb: '34, 211, 238', level: 90 },
    { name: 'Next.js', category: 'Frontend', color: '#ffffff', accentRgb: '255, 255, 255', level: 80 },
    { name: 'JavaScript', category: 'Frontend', color: '#facc15', accentRgb: '250, 204, 21', level: 92 },
    { name: 'TypeScript', category: 'Frontend', color: '#3b82f6', accentRgb: '59, 130, 246', level: 75 },
    { name: 'Tailwind CSS', category: 'Frontend', color: '#38bdf8', accentRgb: '56, 189, 248', level: 95 },
    { name: 'Node.js', category: 'Backend', color: '#22c55e', accentRgb: '34, 197, 94', level: 85 },
    { name: 'Express.js', category: 'Backend', color: '#94a3b8', accentRgb: '148, 163, 184', level: 88 },
    { name: 'MongoDB', category: 'Database', color: '#10b981', accentRgb: '16, 185, 129', level: 85 },
    { name: 'Firebase', category: 'Backend', color: '#f59e0b', accentRgb: '245, 158, 11', level: 82 },
    { name: 'Shopify', category: 'E-Commerce', color: '#10b981', accentRgb: '16, 185, 129', level: 80 }
  ],
  contact: {
    email: 'tawhideh.b10@gmail.com',
    phone: '+880 1836-817816',
    location: 'Dhaka, Bangladesh',
    heading: "Let's create something great together",
    description: 'Have a project in mind, need a full-stack developer, or just want to chat? Reach out anytime!',
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/Tawhide16' },
      { name: 'Twitter', url: 'https://x.com/TawhideB64383' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/tawhide-hasan-bejoy/' },
      { name: 'Facebook', url: 'https://www.facebook.com/tawhide.hb' }
    ]
  }
};

// Seed site content if empty
const seedContent = async () => {
  try {
    for (const [section, data] of Object.entries(defaultSiteContent)) {
      const exists = await SiteContent.findOne({ section });
      if (!exists) {
        await SiteContent.create({ section, data });
        console.log(`Seeded default ${section} content.`);
      }
    }
  } catch (err) {
    console.error('Error seeding site content:', err.message);
  }
};

// API Routes

const isDbConnected = () => mongoose.connection.readyState === 1;

let memoryProjects = [
  {
    _id: 'mem_1',
    title: 'Next Class',
    subtitle: 'Education Management Platform',
    description: 'A full-stack MERN app for smooth class management, secure login, and seamless payments.',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Firebase'],
    features: ['Role-based dashboards', 'Stripe-powered enrollments', 'Assignment creation & submission', 'JWT-secured private routes'],
    accentColor: '#6366f1',
    accentRgb: '99, 102, 241',
    liveLink: 'https://my-school-b2c91.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Next-class-client',
    image1: '/NEXT-CLASS.png',
    number: '01',
    order: 0
  },
  {
    _id: 'mem_2',
    title: 'VibeCircle',
    subtitle: 'Social Media Platform',
    description: 'Social media platform for connecting with like-minded people and sharing experiences.',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    features: ['User authentication', 'Real-time posts', 'Like and comment system', 'Responsive design'],
    accentColor: '#8b5cf6',
    accentRgb: '139, 92, 246',
    liveLink: 'https://my-assignment-10-a4262.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Vibe-Circle',
    image1: '/vibe.png',
    number: '02',
    order: 1
  },
  {
    _id: 'mem_3',
    title: 'Hotel Booking',
    subtitle: 'Reservation System',
    description: 'Complete hotel reservation system with room selection and booking management.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    features: ['Room availability calendar', 'User dashboard', 'Booking history', 'Admin panel'],
    accentColor: '#10b981',
    accentRgb: '16, 185, 129',
    liveLink: 'https://my-hotel-a3994.web.app/',
    gitLinkClient: 'https://github.com/Tawhide16/Hotel-booking-client',
    image1: '/hotel-booke.png',
    number: '03',
    order: 2
  },
  {
    _id: 'mem_4',
    title: 'Event Explorer',
    subtitle: 'Event Discovery Platform',
    description: 'Platform for discovering and registering for local events and activities.',
    technologies: ['React', 'Express', 'MongoDB', 'Firebase'],
    features: ['Location-based search', 'Event filtering', 'Ticket purchasing', 'User reviews'],
    accentColor: '#f43f5e',
    accentRgb: '244, 63, 94',
    liveLink: 'https://fluffy-clafoutis-ef0d5e.netlify.app/',
    gitLinkClient: 'https://github.com/Tawhide16/event-explorer-client',
    image1: '/event.png',
    number: '04',
    order: 3
  }
];

let memorySiteContent = JSON.parse(JSON.stringify(defaultSiteContent));
let memoryShopifyProjects = initialShopifyProjects.map((p, idx) => ({
  ...p,
  _id: `shopify_${idx + 1}`
}));

// API Routes

// 1. Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  try {
    if (isDbConnected()) {
      const admin = await Admin.findOne({ username });
      if (admin) {
        const isMatch = await admin.comparePassword(password);
        if (isMatch) {
          const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || 'your_fallback_jwt_secret_key_12345',
            { expiresIn: '24h' }
          );
          return res.json({ token, admin: { id: admin._id, username: admin.username } });
        }
      }
    }

    // Resilient fallback authentication (uses ADMIN_PASSWORD from .env or default)
    const adminPass = process.env.ADMIN_PASSWORD || 'adminpassword';
    if (username === 'admin' && password === adminPass) {
      const token = jwt.sign(
        { id: 'admin_session_id' },
        process.env.JWT_SECRET || 'your_fallback_jwt_secret_key_12345',
        { expiresIn: '24h' }
      );
      return res.json({ token, admin: { id: 'admin_session_id', username: 'admin' } });
    }

    return res.status(400).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. File & Resume Upload (Protected)
app.post('/api/upload', auth, (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const file = req.files[0];
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    res.json({ url: fileUrl, filename: file.originalname });
  });
});

// 3. Get all projects (sorted by custom drag & drop order)
app.get('/api/projects', async (req, res) => {
  try {
    if (isDbConnected()) {
      const projects = await Project.find().sort({ order: 1, number: 1, createdAt: -1 });
      return res.json(projects);
    }
    const sorted = [...memoryProjects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Reorder projects (Protected)
app.put('/api/projects/reorder', auth, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array of project IDs' });
    }

    if (isDbConnected()) {
      const updates = orderedIds.map((id, index) => {
        const serial = String(index + 1).padStart(2, '0');
        return Project.findByIdAndUpdate(id, { order: index, number: serial }, { new: true });
      });
      await Promise.all(updates);
      const updatedProjects = await Project.find().sort({ order: 1, number: 1, createdAt: -1 });
      return res.json(updatedProjects);
    }

    // In-memory reordering
    const reordered = [];
    orderedIds.forEach((id, index) => {
      const found = memoryProjects.find(p => p._id === id);
      if (found) {
        found.order = index;
        found.number = String(index + 1).padStart(2, '0');
        reordered.push(found);
      }
    });
    // Add any not in list
    memoryProjects.forEach(p => {
      if (!orderedIds.includes(p._id)) reordered.push(p);
    });
    memoryProjects = reordered;
    res.json(memoryProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      return res.json(project);
    }
    const project = memoryProjects.find(p => p._id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Create a project (Protected)
app.post('/api/projects', auth, async (req, res) => {
  try {
    if (isDbConnected()) {
      if (req.body.order === undefined) {
        const count = await Project.countDocuments();
        req.body.order = count;
        if (!req.body.number) {
          req.body.number = String(count + 1).padStart(2, '0');
        }
      }
      const project = new Project(req.body);
      const savedProject = await project.save();
      return res.status(201).json(savedProject);
    }

    // In-memory create
    const newOrder = req.body.order !== undefined ? req.body.order : memoryProjects.length;
    const newNumber = req.body.number || String(memoryProjects.length + 1).padStart(2, '0');
    const newProject = {
      ...req.body,
      _id: Date.now().toString(),
      order: newOrder,
      number: newNumber,
      createdAt: new Date().toISOString()
    };
    memoryProjects.push(newProject);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 7. Update a project (Protected)
app.put('/api/projects/:id', auth, async (req, res) => {
  try {
    if (isDbConnected()) {
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
      return res.json(updatedProject);
    }

    const idx = memoryProjects.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Project not found' });
    memoryProjects[idx] = { ...memoryProjects[idx], ...req.body };
    res.json(memoryProjects[idx]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 8. Delete a project (Protected)
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    if (isDbConnected()) {
      const deletedProject = await Project.findByIdAndDelete(req.params.id);
      if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
      return res.json({ message: 'Project deleted successfully' });
    }

    const exists = memoryProjects.some(p => p._id === req.params.id);
    if (!exists) return res.status(404).json({ message: 'Project not found' });
    memoryProjects = memoryProjects.filter(p => p._id !== req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 9. Get all site section content (Hero, About, Skills, Contact)
app.get('/api/content', async (req, res) => {
  try {
    if (isDbConnected()) {
      const contents = await SiteContent.find();
      const contentMap = {};
      contents.forEach(item => {
        contentMap[item.section] = item.data;
      });

      return res.json({
        hero: contentMap.hero || defaultSiteContent.hero,
        about: contentMap.about || defaultSiteContent.about,
        skills: contentMap.skills || defaultSiteContent.skills,
        contact: contentMap.contact || defaultSiteContent.contact
      });
    }

    res.json({
      hero: memorySiteContent.hero || defaultSiteContent.hero,
      about: memorySiteContent.about || defaultSiteContent.about,
      skills: memorySiteContent.skills || defaultSiteContent.skills,
      contact: memorySiteContent.contact || defaultSiteContent.contact
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 10. Update a specific site section content (Protected)
app.put('/api/content/:section', auth, async (req, res) => {
  const { section } = req.params;
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ message: 'Section data is required' });
  }

  try {
    if (isDbConnected()) {
      const updated = await SiteContent.findOneAndUpdate(
        { section },
        { section, data },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ section: updated.section, data: updated.data });
    }

    memorySiteContent[section] = data;
    res.json({ section, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Shopify Projects API ──
// 11. Get all Shopify projects
app.get('/api/shopify-projects', async (req, res) => {
  try {
    if (isDbConnected()) {
      const projects = await ShopifyProject.find().sort({ order: 1, number: 1, createdAt: -1 });
      return res.json(projects);
    }
    const sorted = [...memoryShopifyProjects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 12. Reorder Shopify projects (Protected)
app.put('/api/shopify-projects/reorder', auth, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array of project IDs' });
    }

    if (isDbConnected()) {
      const updates = orderedIds.map((id, index) => {
        const serial = String(index + 1).padStart(2, '0');
        return ShopifyProject.findByIdAndUpdate(id, { order: index, number: serial }, { new: true });
      });
      await Promise.all(updates);
      const updated = await ShopifyProject.find().sort({ order: 1, number: 1, createdAt: -1 });
      return res.json(updated);
    }

    const reordered = [];
    orderedIds.forEach((id, index) => {
      const found = memoryShopifyProjects.find(p => p._id === id);
      if (found) {
        found.order = index;
        found.number = String(index + 1).padStart(2, '0');
        reordered.push(found);
      }
    });
    memoryShopifyProjects.forEach(p => {
      if (!orderedIds.includes(p._id)) reordered.push(p);
    });
    memoryShopifyProjects = reordered;
    res.json(memoryShopifyProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 13. Get single Shopify project
app.get('/api/shopify-projects/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const project = await ShopifyProject.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Shopify project not found' });
      return res.json(project);
    }
    const project = memoryShopifyProjects.find(p => p._id === req.params.id);
    if (!project) return res.status(404).json({ message: 'Shopify project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 14. Create Shopify project (Protected)
app.post('/api/shopify-projects', auth, async (req, res) => {
  try {
    if (isDbConnected()) {
      if (req.body.order === undefined) {
        const count = await ShopifyProject.countDocuments();
        req.body.order = count;
        if (!req.body.number) {
          req.body.number = String(count + 1).padStart(2, '0');
        }
      }
      const project = new ShopifyProject(req.body);
      const saved = await project.save();
      return res.status(201).json(saved);
    }

    const newOrder = req.body.order !== undefined ? req.body.order : memoryShopifyProjects.length;
    const newNumber = req.body.number || String(memoryShopifyProjects.length + 1).padStart(2, '0');
    const newProject = {
      ...req.body,
      _id: Date.now().toString(),
      order: newOrder,
      number: newNumber,
      createdAt: new Date().toISOString()
    };
    memoryShopifyProjects.push(newProject);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 15. Update Shopify project (Protected)
app.put('/api/shopify-projects/:id', auth, async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await ShopifyProject.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: 'Shopify project not found' });
      return res.json(updated);
    }

    const idx = memoryShopifyProjects.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Shopify project not found' });
    memoryShopifyProjects[idx] = { ...memoryShopifyProjects[idx], ...req.body };
    res.json(memoryShopifyProjects[idx]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 16. Delete Shopify project (Protected)
app.delete('/api/shopify-projects/:id', auth, async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await ShopifyProject.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Shopify project not found' });
      return res.json({ message: 'Shopify project deleted successfully' });
    }

    const exists = memoryShopifyProjects.some(p => p._id === req.params.id);
    if (!exists) return res.status(404).json({ message: 'Shopify project not found' });
    memoryShopifyProjects = memoryShopifyProjects.filter(p => p._id !== req.params.id);
    res.json({ message: 'Shopify project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

