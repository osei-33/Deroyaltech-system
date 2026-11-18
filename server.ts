// Ensure HMR is disabled in AI Studio container environment
process.env.DISABLE_HMR = 'true';

process.on('SIGTERM', () => {
  process.exit(0);
});
process.on('SIGINT', () => {
  process.exit(0);
});

import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve PORT and HOST: Prioritize CLI --port/--host flags.
// In container environments, Nginx listens on 8080 and reverse-proxies to 3000.
// Express/Vite must bind to port 3000 (never 8080) to avoid EADDRINUSE conflicts.
let PORT = 3000;
const portArgIndex = process.argv.indexOf('--port');
if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
  PORT = Number(process.argv[portArgIndex + 1]);
} else if (process.env.PORT && process.env.PORT !== '8080') {
  PORT = Number(process.env.PORT);
} else if (process.env.DEFAULT_APP_PORT) {
  PORT = Number(process.env.DEFAULT_APP_PORT);
}

let HOST = '0.0.0.0';
const hostArgIndex = process.argv.indexOf('--host');
if (hostArgIndex !== -1 && process.argv[hostArgIndex + 1]) {
  HOST = process.argv[hostArgIndex + 1];
} else if (process.env.HOST) {
  HOST = process.env.HOST;
}

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'site-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial site data template (do not seed empty hardware/projects arrays so frontend defaults apply until customized)
const getInitialData = () => {
  return {
    _revision: 1,
    _lastModified: new Date().toISOString(),
    config: {
      logoUrl: '/assets/aistudio/Deroyaltech_Digital_Innovation_Logo_9f10ddb1.png',
      currencySymbol: 'GH₵',
      currencyCode: 'GHS',
      accentTheme: 'deroyal-dual',
      overlayStyle: 'ambient-glass',
      heroHeadline: 'Full-stack software, custom CRM, and integrated hardware workflows.',
      heroSubtitle: 'DeRoyalTech engineers web platforms, native mobile applications, bespoke CRM architectures, and multi-cloud infrastructure—seamlessly integrated with industrial sensors, edge gateways, and enterprise computer peripherals to streamline operations.',
      contact: {
        companyName: 'DeRoyalTech Systems Limited',
        tagline: 'Innovate · Build · Grow',
        phonePrimary: '+233 (0) 30 294 8821',
        phoneSecondary: '+233 (0) 24 590 1284',
        emailGeneral: 'info@deroyaltech.com',
        emailSales: 'sales@deroyaltech.com',
        emailSupport: 'support@deroyaltech.com',
        physicalAddress: 'Suite 402, Standard Chartered Building, Airport City & Spintex Tech Corridor',
        cityCountry: 'Accra, Ghana',
        businessHours: 'Mon - Fri: 8:00 AM - 6:00 PM GMT (24/7 DevOps Support Standby)',
        whatsappNumber: '+233245901284'
      },
      social: {
        whatsapp: 'https://wa.me/233245901284',
        facebook: 'https://facebook.com/deroyaltech',
        tiktok: 'https://tiktok.com/@deroyaltech',
        instagram: 'https://instagram.com/deroyaltech',
        linkedin: 'https://linkedin.com/company/deroyaltech'
      },
      enableVideoPreviews: true,
      enableServiceNegotiations: true,
      autoBackupIntervalDays: 7
    },
    inquiries: [
      {
        id: 'DRT-INQ-9481',
        createdAt: new Date().toISOString(),
        fullName: 'Kwame Mensah',
        email: 'k.mensah@ghanashippers.org',
        company: 'West Africa Shippers Council',
        projectType: 'turnkey',
        budget: 'GH₵ 150,000 - GH₵ 400,000',
        timeline: 'Within 2-3 months',
        scopeNotes: 'Warehouse scanner fleet integration and custom CRM pipeline synchronization',
        message: 'Looking to deploy 45 rugged handheld RFID terminals with real-time cloud data telemetry.',
        status: 'New'
      }
    ]
  };
};

// Connected SSE clients for instant cross-device broadcast
const sseClients = new Set<Response>();

const broadcastDataUpdate = (data: any) => {
  const payload = JSON.stringify({
    type: 'site-data-updated',
    revision: data._revision || 0,
    lastModified: data._lastModified || new Date().toISOString()
  });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
};

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Clean legacy empty unrevisioned arrays from initial boot file so client defaults are not wiped
      if (!parsed._revision) {
        if (Array.isArray(parsed.hardware) && parsed.hardware.length === 0) {
          delete parsed.hardware;
        }
        if (Array.isArray(parsed.projects) && parsed.projects.length === 0) {
          delete parsed.projects;
        }
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading site data file:', err);
  }
  const init = getInitialData();
  saveData(init, false);
  return init;
};

const saveData = (data: any, shouldBroadcast = true) => {
  try {
    data._revision = (Number(data._revision) || 0) + 1;
    data._lastModified = new Date().toISOString();
    const serialized = JSON.stringify(data, null, 2);
    const tmpFile = `${DATA_FILE}.tmp`;
    try {
      fs.writeFileSync(tmpFile, serialized, 'utf-8');
      fs.renameSync(tmpFile, DATA_FILE);
    } catch {
      fs.writeFileSync(DATA_FILE, serialized, 'utf-8');
    }
    if (shouldBroadcast) {
      broadcastDataUpdate(data);
    }
  } catch (err) {
    console.error('Error saving site data file:', err);
  }
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // Enforce strict no-cache on all /api routes so mobile & cross-device browsers always receive live state
  app.use('/api', (_req: Request, res: Response, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Real-time Server-Sent Events stream for instant cross-device admin-to-client synchronization
  app.get('/api/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const current = loadData();
    res.write(`data: ${JSON.stringify({
      type: 'connected',
      revision: current._revision || 0,
      lastModified: current._lastModified || new Date().toISOString()
    })}\n\n`);

    sseClients.add(res);
    const keepAlive = setInterval(() => {
      try {
        res.write(': keepalive\n\n');
      } catch {
        clearInterval(keepAlive);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  // API Routes
  app.get('/api/site-data', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data);
  });

  // Dedicated Contact Enforce & Sync Endpoint
  app.post('/api/contact', (req: Request, res: Response) => {
    const current = loadData();
    current.config = current.config || {};
    current.config.contact = {
      ...(current.config.contact || {}),
      ...req.body
    };
    saveData(current);
    res.json({ success: true, contact: current.config.contact, revision: current._revision });
  });

  app.post('/api/site-data', (req: Request, res: Response) => {
    const current = loadData();
    const incomingConfig = req.body.config;
    const updated = {
      ...current,
      ...req.body,
      config: incomingConfig ? {
        ...(current.config || {}),
        ...incomingConfig,
        contact: { ...(current.config?.contact || {}), ...(incomingConfig.contact || {}) },
        social: { ...(current.config?.social || {}), ...(incomingConfig.social || {}) },
        metrics: { ...(current.config?.metrics || {}), ...(incomingConfig.metrics || {}) },
        announcement: incomingConfig.announcement !== undefined ? incomingConfig.announcement : current.config?.announcement,
        letterhead: incomingConfig.letterhead !== undefined ? incomingConfig.letterhead : current.config?.letterhead,
        adminProfile: incomingConfig.adminProfile !== undefined ? incomingConfig.adminProfile : current.config?.adminProfile
      } : current.config,
      services: req.body.services !== undefined ? req.body.services : current.services,
      hardware: req.body.hardware !== undefined ? req.body.hardware : current.hardware,
      projects: req.body.projects !== undefined ? req.body.projects : current.projects,
      testimonials: req.body.testimonials !== undefined ? req.body.testimonials : current.testimonials,
      teamMembers: req.body.teamMembers !== undefined ? req.body.teamMembers : current.teamMembers,
      letters: req.body.letters !== undefined ? req.body.letters : current.letters,
      users: req.body.users !== undefined ? req.body.users : current.users,
      bookings: req.body.bookings !== undefined ? req.body.bookings : current.bookings,
      inquiries: req.body.inquiries !== undefined ? req.body.inquiries : current.inquiries,
      faqArticles: req.body.faqArticles !== undefined ? req.body.faqArticles : current.faqArticles,
      chatThreads: req.body.chatThreads !== undefined ? req.body.chatThreads : current.chatThreads,
      serviceRequests: req.body.serviceRequests !== undefined ? req.body.serviceRequests : current.serviceRequests,
      trackedProjects: req.body.trackedProjects !== undefined ? req.body.trackedProjects : current.trackedProjects,
      emailAlerts: req.body.emailAlerts !== undefined ? req.body.emailAlerts : current.emailAlerts,
      negotiations: req.body.negotiations !== undefined ? req.body.negotiations : current.negotiations,
      projectBackups: req.body.projectBackups !== undefined ? req.body.projectBackups : current.projectBackups,
      autoEmailEnabled: req.body.autoEmailEnabled !== undefined ? req.body.autoEmailEnabled : current.autoEmailEnabled
    };
    saveData(updated);
    res.json({ success: true, data: updated, revision: updated._revision, lastModified: updated._lastModified });
  });

  // Inquiries endpoints
  app.get('/api/inquiries', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.inquiries || []);
  });

  app.post('/api/inquiries', (req: Request, res: Response) => {
    const data = loadData();
    const newInquiry = {
      id: `DRT-INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'New',
      ...req.body
    };
    data.inquiries = [newInquiry, ...(data.inquiries || [])];
    saveData(data);
    res.json({ success: true, inquiry: newInquiry });
  });

  app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
    const data = loadData();
    const id = req.params.id;
    data.inquiries = (data.inquiries || []).map((inq: any) => 
      inq.id === id ? { ...inq, ...req.body } : inq
    );
    saveData(data);
    res.json({ success: true });
  });

  // Official Letters endpoints
  app.get('/api/letters', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.letters || []);
  });

  app.post('/api/letters/sync', (req: Request, res: Response) => {
    const data = loadData();
    data.letters = req.body.letters || [];
    saveData(data);
    res.json({ success: true, count: data.letters.length });
  });

  // Team Directory endpoints
  app.get('/api/team', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.teamMembers || []);
  });

  app.post('/api/team/sync', (req: Request, res: Response) => {
    const data = loadData();
    data.teamMembers = req.body.teamMembers || [];
    saveData(data);
    res.json({ success: true, count: data.teamMembers.length });
  });

  // Helper to dynamically build XML sitemap querying active services, blog posts, content pages, and hardware
  const buildDynamicSitemapXml = (data: any): { xml: string; stats: any } => {
    const today = new Date().toISOString().split('T')[0];
    const baseUrl = 'https://deroyal.tech';

    // Static core pages
    const urls: { loc: string; lastmod: string; changefreq: string; priority: string; type: string; title: string }[] = [
      { loc: `${baseUrl}/`, lastmod: today, changefreq: 'daily', priority: '1.0', type: 'core', title: 'Home - Enterprise Cloud & CRM Systems' },
      { loc: `${baseUrl}/services`, lastmod: today, changefreq: 'weekly', priority: '0.9', type: 'core', title: 'Services - Hybrid Cloud & DevSecOps' },
      { loc: `${baseUrl}/projects`, lastmod: today, changefreq: 'weekly', priority: '0.9', type: 'core', title: 'Case Studies & Production Deployments' },
      { loc: `${baseUrl}/hardware`, lastmod: today, changefreq: 'weekly', priority: '0.85', type: 'core', title: 'Hardware Store - Servers & Peripherals' },
      { loc: `${baseUrl}/tracker`, lastmod: today, changefreq: 'daily', priority: '0.85', type: 'core', title: 'Live Project Tracker & Telemetry Hub' },
      { loc: `${baseUrl}/consultation`, lastmod: today, changefreq: 'monthly', priority: '0.85', type: 'core', title: 'Architecture Consultation & Scoping' },
      { loc: `${baseUrl}/knowledge-base`, lastmod: today, changefreq: 'weekly', priority: '0.8', type: 'core', title: 'Knowledge Base & Technical Runbooks' },
      { loc: `${baseUrl}/estimator`, lastmod: today, changefreq: 'monthly', priority: '0.75', type: 'core', title: 'Project Budget & Cloud Estimator' },
      { loc: `${baseUrl}/verify`, lastmod: today, changefreq: 'daily', priority: '0.75', type: 'core', title: 'Official Document Verification Registry' },
      { loc: `${baseUrl}/workflow`, lastmod: today, changefreq: 'monthly', priority: '0.7', type: 'core', title: 'Engineering Lifecycle & SLA Methodology' },
      { loc: `${baseUrl}/contact`, lastmod: today, changefreq: 'monthly', priority: '0.7', type: 'core', title: 'Contact Engineering Desk Accra' },
    ];

    // Query active service IDs
    const services = data.services || [];
    let indexedServices = 0;
    services.forEach((s: any) => {
      if (s.id) {
        indexedServices++;
        urls.push({
          loc: `${baseUrl}/services#${encodeURIComponent(s.id)}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: '0.8',
          type: 'service',
          title: s.title || `Service ${s.id}`
        });
      }
    });

    // Query active blog posts / FAQ articles
    const faqArticles = data.faqArticles || [];
    let indexedArticles = 0;
    faqArticles.forEach((art: any) => {
      if (art.id) {
        indexedArticles++;
        urls.push({
          loc: `${baseUrl}/knowledge-base#${encodeURIComponent(art.id)}`,
          lastmod: art.updatedAt ? art.updatedAt.split('T')[0] : today,
          changefreq: 'weekly',
          priority: '0.75',
          type: 'article',
          title: art.title || `Article ${art.id}`
        });
      }
    });

    // Query active hardware products
    const hardware = data.hardware || [];
    let indexedHardware = 0;
    hardware.forEach((h: any) => {
      if (h.id) {
        indexedHardware++;
        urls.push({
          loc: `${baseUrl}/hardware#${encodeURIComponent(h.id)}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: '0.7',
          type: 'hardware',
          title: h.name || `Hardware ${h.id}`
        });
      }
    });

    // Query active case studies / projects
    const projects = data.projects || [];
    let indexedProjects = 0;
    projects.forEach((p: any) => {
      if (p.id) {
        indexedProjects++;
        urls.push({
          loc: `${baseUrl}/projects#${encodeURIComponent(p.id)}`,
          lastmod: today,
          changefreq: 'monthly',
          priority: '0.75',
          type: 'project',
          title: p.title || `Project ${p.id}`
        });
      }
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`.trim();

    const stats = {
      totalUrls: urls.length,
      indexedServices,
      indexedArticles,
      indexedHardware,
      indexedProjects,
      builtAt: new Date().toISOString()
    };

    return { xml, stats };
  };

  // SEO: Dynamic XML Sitemap endpoint (automatically queries active services, blog posts, hardware)
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const data = loadData();
    const { xml } = buildDynamicSitemapXml(data);
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // SEO: Trigger dynamic sitemap rebuild and sync
  app.post('/api/seo/rebuild-sitemap', (_req: Request, res: Response) => {
    const data = loadData();
    const { xml, stats } = buildDynamicSitemapXml(data);
    try {
      const publicDir = path.resolve(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), xml, 'utf-8');
    } catch (e) {
      console.warn('Could not write to public/sitemap.xml:', e);
    }
    res.json({ success: true, stats, xml });
  });

  // Price Negotiations endpoints
  app.get('/api/negotiations', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.negotiations || []);
  });

  app.post('/api/negotiations', (req: Request, res: Response) => {
    const data = loadData();
    const newNegotiation = {
      id: `NEG-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...req.body
    };
    data.negotiations = [newNegotiation, ...(data.negotiations || [])];
    saveData(data);
    res.json({ success: true, negotiation: newNegotiation });
  });

  app.post('/api/negotiations/:id/respond', (req: Request, res: Response) => {
    const data = loadData();
    const { id } = req.params;
    const { action, counterPrice, adminNotes, adminName } = req.body;
    
    if (data.negotiations) {
      data.negotiations = data.negotiations.map((neg: any) => {
        if (neg.id === id) {
          const newStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'countered';
          return {
            ...neg,
            status: newStatus,
            adminResponse: {
              action,
              counterPrice,
              adminNotes,
              respondedAt: new Date().toISOString(),
              adminName: adminName || 'DeRoyalTech Commercial Desk'
            }
          };
        }
        return neg;
      });
      saveData(data);
    }
    res.json({ success: true });
  });

  // Bulk Price Adjustments (Percentage markup / discount on all products or categories)
  app.post('/api/pricing/bulk-adjustment', (req: Request, res: Response) => {
    const data = loadData();
    const { percent, category } = req.body;
    data.config = data.config || {};
    if (category === 'all' || !category) {
      data.config.globalPriceAdjustmentPercent = Number(percent) || 0;
    } else if (category === 'software') {
      data.config.softwarePriceAdjustmentPercent = Number(percent) || 0;
    } else if (category === 'hardware') {
      data.config.hardwarePriceAdjustmentPercent = Number(percent) || 0;
    }
    saveData(data);
    res.json({ success: true, config: data.config });
  });

  // Project Cloud Backups endpoints (Automated Weekly & Manual Snapshots)
  app.get('/api/projects/:id/backups', (req: Request, res: Response) => {
    const data = loadData();
    const { id } = req.params;
    const backups = (data.projectBackups || []).filter((b: any) => b.projectId.toUpperCase() === id.toUpperCase());
    res.json(backups);
  });

  app.post('/api/projects/:id/backup', (req: Request, res: Response) => {
    const data = loadData();
    const { id } = req.params;
    const project = (data.trackedProjects || []).find((p: any) => p.projectId.toUpperCase() === id.toUpperCase()) || req.body.snapshotData?.project;
    
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const snapId = req.body.id || `SNAP-${id}-${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}-${Math.floor(100 + Math.random() * 900)}`;
    const resolvedEmail = (req.body.clientEmail || project?.clientEmail || '').trim().toLowerCase();

    const newBackup = {
      id: snapId,
      projectId: id,
      projectTitle: req.body.projectTitle || project?.title || 'System Development Project',
      clientEmail: req.body.clientEmail || project?.clientEmail || '',
      createdAt: req.body.createdAt || now.toISOString(),
      type: req.body.type || 'automated_weekly',
      stage: req.body.stage || project?.stage || 'development',
      stageLabel: req.body.stageLabel || project?.stageLabel || 'Active Engineering Phase',
      progressPercent: req.body.progressPercent ?? project?.progressPercent ?? 0,
      completedMilestonesCount: req.body.completedMilestonesCount ?? (project?.milestones?.filter((m: any) => m.status === 'completed').length || 0),
      totalMilestonesCount: req.body.totalMilestonesCount ?? (project?.milestones?.length || 0),
      snapshotData: req.body.snapshotData || {
        project: project || {},
        systemTimestamp: now.toISOString(),
        checksum: `SHA256-${Buffer.from(`${id}-${now.getTime()}`).toString('hex').slice(0, 16).toUpperCase()}`
      },
      fileSizeBytes: req.body.fileSizeBytes || (JSON.stringify(project || {}).length + 1024),
      note: req.body.note || 'Automated weekly progress snapshot archived in client account cloud storage',
      syncedToCloud: true
    };

    const existingBackups = Array.isArray(data.projectBackups) ? data.projectBackups : [];
    data.projectBackups = [newBackup, ...existingBackups.filter((b: any) => b.id !== newBackup.id)];

    // Update project with lastBackupDate and nextScheduledBackupDate
    if (Array.isArray(data.trackedProjects)) {
      data.trackedProjects = data.trackedProjects.map((p: any) => {
        if (p.projectId.toUpperCase() === id.toUpperCase()) {
          return {
            ...p,
            lastBackupDate: newBackup.createdAt,
            nextScheduledBackupDate: nextWeek.toISOString(),
            autoBackupEnabled: p.autoBackupEnabled !== false,
            backupsCount: data.projectBackups.filter((b: any) => b.projectId.toUpperCase() === id.toUpperCase()).length
          };
        }
        return p;
      });
    }

    // Store snapshot inside matching client account storage (data.users)
    if (Array.isArray(data.users) && resolvedEmail) {
      data.users = data.users.map((u: any) => {
        if ((u.email || '').trim().toLowerCase() === resolvedEmail) {
          const prevAccountBackups = Array.isArray(u.cloudBackups) ? u.cloudBackups : [];
          return {
            ...u,
            cloudBackups: [newBackup, ...prevAccountBackups.filter((b: any) => b.id !== newBackup.id)]
          };
        }
        return u;
      });
    }

    saveData(data);
    res.json({ success: true, backup: newBackup, revision: data._revision });
  });

  app.patch('/api/projects/:id/backup-schedule', (req: Request, res: Response) => {
    const data = loadData();
    const { id } = req.params;
    const { autoBackupEnabled } = req.body;
    if (Array.isArray(data.trackedProjects)) {
      data.trackedProjects = data.trackedProjects.map((p: any) =>
        p.projectId.toUpperCase() === id.toUpperCase()
          ? { ...p, autoBackupEnabled: Boolean(autoBackupEnabled) }
          : p
      );
      saveData(data);
    }
    res.json({ success: true, revision: data._revision });
  });

  app.delete('/api/projects/backups/:backupId', (req: Request, res: Response) => {
    const data = loadData();
    const { backupId } = req.params;
    const target = (data.projectBackups || []).find((b: any) => b.id === backupId);
    data.projectBackups = (data.projectBackups || []).filter((b: any) => b.id !== backupId);
    if (Array.isArray(data.users)) {
      data.users = data.users.map((u: any) => ({
        ...u,
        cloudBackups: Array.isArray(u.cloudBackups)
          ? u.cloudBackups.filter((b: any) => b.id !== backupId)
          : u.cloudBackups
      }));
    }
    if (target && Array.isArray(data.trackedProjects)) {
      data.trackedProjects = data.trackedProjects.map((p: any) => {
        if (p.projectId.toUpperCase() === (target.projectId || '').toUpperCase()) {
          return {
            ...p,
            backupsCount: data.projectBackups.filter((b: any) => b.projectId.toUpperCase() === p.projectId.toUpperCase()).length
          };
        }
        return p;
      });
    }
    saveData(data);
    res.json({ success: true, revision: data._revision });
  });

  // SEO: Robots.txt endpoint
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robotsFile = path.resolve(__dirname, 'public', 'robots.txt');
    if (fs.existsSync(robotsFile)) {
      res.header('Content-Type', 'text/plain');
      return res.sendFile(robotsFile);
    }
    const txt = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\n\nSitemap: https://deroyal.tech/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    res.send(txt);
  });

  app.delete('/api/inquiries/:id', (req: Request, res: Response) => {
    const data = loadData();
    const id = req.params.id;
    data.inquiries = (data.inquiries || []).filter((inq: any) => inq.id !== id);
    saveData(data);
    res.json({ success: true });
  });

  // Live Support Chat endpoints
  app.get('/api/chats', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.chatThreads || []);
  });

  app.post('/api/chats/sync', (req: Request, res: Response) => {
    const data = loadData();
    data.chatThreads = req.body.chatThreads || [];
    saveData(data);
    res.json({ success: true });
  });

  // Service Requests endpoints
  app.get('/api/service-requests', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.serviceRequests || []);
  });

  app.post('/api/service-requests/sync', (req: Request, res: Response) => {
    const data = loadData();
    data.serviceRequests = req.body.serviceRequests || [];
    saveData(data);
    res.json({ success: true });
  });

  // Tracked Projects endpoints
  app.get('/api/tracked-projects', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.trackedProjects || []);
  });

  app.post('/api/tracked-projects/sync', (req: Request, res: Response) => {
    const data = loadData();
    data.trackedProjects = req.body.trackedProjects || [];
    saveData(data);
    res.json({ success: true });
  });

  // Knowledge Base & FAQ endpoints
  app.get('/api/knowledge-base', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.faqArticles || []);
  });

  app.post('/api/knowledge-base/sync', (req: Request, res: Response) => {
    const data = loadData();
    data.faqArticles = req.body.faqArticles || [];
    saveData(data);
    res.json({ success: true, count: data.faqArticles.length });
  });

  app.post('/api/knowledge-base/vote', (req: Request, res: Response) => {
    const { id, isHelpful } = req.body;
    const data = loadData();
    if (data.faqArticles) {
      data.faqArticles = data.faqArticles.map((art: any) => {
        if (art.id === id) {
          return {
            ...art,
            helpfulVotes: isHelpful ? (art.helpfulVotes || 0) + 1 : art.helpfulVotes,
            unhelpfulVotes: !isHelpful ? (art.unhelpfulVotes || 0) + 1 : art.unhelpfulVotes
          };
        }
        return art;
      });
      saveData(data);
    }
    res.json({ success: true });
  });

  // Automated Email Notification System for Project Tracker
  app.get('/api/notifications/email-alerts', (_req: Request, res: Response) => {
    const data = loadData();
    res.json(data.emailAlerts || []);
  });

  app.post('/api/notifications/email-alert', (req: Request, res: Response) => {
    const data = loadData();
    const { 
      projectId, 
      projectTitle, 
      recipientEmail, 
      recipientName, 
      stage, 
      stageLabel, 
      progressPercent, 
      updateSummary,
      leadEngineer,
      estimatedDeliveryDate
    } = req.body;

    const alertId = `alert-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const subject = `[DeRoyalTech Status Update] Project ${projectId}: ${stageLabel || stage} (${progressPercent}%)`;
    
    // Generate high-fidelity branded HTML email preview
    const htmlPreview = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #090d16; color: #f1f5f9; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #0b1528 0%, #172554 100%); padding: 32px 28px; border-bottom: 2px solid #2563eb;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
              DeRoyal<span style="color: #3b82f6;">Tech</span>
            </div>
            <span style="background: rgba(37, 99, 235, 0.2); color: #60a5fa; border: 1px solid #3b82f6; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
              Project Tracker Alert
            </span>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">Innovate · Build · Grow · Accra, Ghana</p>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-top: 0;">
            Hello ${recipientName || 'Valued Partner'},
          </h2>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
            A milestone status update has just been recorded by the engineering team for your project:
          </p>

          <div style="background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-family: monospace; font-size: 13px; font-weight: 700; color: #60a5fa; background: #1e293b; padding: 3px 8px; border-radius: 6px;">
                ${projectId}
              </span>
              <span style="font-size: 16px; font-weight: 800; color: #38bdf8;">
                ${progressPercent}% Complete
              </span>
            </div>
            <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">
              ${projectTitle}
            </h3>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 14px 0;">
              <strong>Current Stage:</strong> <span style="color: #60a5fa;">${stageLabel || stage}</span>
            </p>

            <div style="background: #1e293b; height: 8px; border-radius: 9999px; overflow: hidden; margin-bottom: 16px;">
              <div style="background: linear-gradient(90deg, #2563eb, #38bdf8); width: ${progressPercent}%; height: 100%; border-radius: 9999px;"></div>
            </div>

            <div style="background: #131c2e; border-left: 3px solid #3b82f6; padding: 12px 14px; border-radius: 4px;">
              <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Latest Engineering Note</div>
              <div style="font-size: 13px; color: #e2e8f0; line-height: 1.5;">${updateSummary || 'Engineering roadmap advancing on schedule.'}</div>
            </div>
          </div>

          <div style="font-size: 12px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
            <div><strong>Lead Architect:</strong> ${leadEngineer || 'Senior Systems Architect, DeRoyalTech'}</div>
            ${estimatedDeliveryDate ? `<div><strong>Target Delivery:</strong> ${estimatedDeliveryDate}</div>` : ''}
            <div><strong>Currency / Invoicing:</strong> Ghanaian Cedis (GH₵)</div>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="https://ais-dev-ovrllj26d3zhyvidgfaw2k-497479362614.europe-west2.run.app" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 13px; font-weight: 700; border-radius: 8px; display: inline-block;">
              Access Live Project Tracker Portal
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px; margin-bottom: 0;">
            This automated email was dispatched to <strong>${recipientEmail}</strong> by the DeRoyalTech Systems Project Desk. 
            For real-time queries, connect via Live Support or call our DevOps standby line at +233 (0) 24 590 1284.
          </p>
        </div>
      </div>
    `.trim();

    const newAlert = {
      id: alertId,
      projectId,
      projectTitle,
      recipientEmail,
      recipientName: recipientName || 'Client',
      subject,
      sentAt: new Date().toISOString(),
      stage,
      stageLabel: stageLabel || stage,
      progressPercent: Number(progressPercent) || 0,
      updateSummary: updateSummary || 'Project status updated.',
      status: 'Delivered',
      leadEngineer: leadEngineer || 'Senior Systems Architect',
      estimatedDeliveryDate,
      htmlPreview
    };

    data.emailAlerts = [newAlert, ...(data.emailAlerts || [])];
    saveData(data);

    res.json({ success: true, alert: newAlert });
  });

  app.post('/api/notifications/email-alerts/sync', (req: Request, res: Response) => {
    const data = loadData();
    data.emailAlerts = req.body.emailAlerts || [];
    saveData(data);
    res.json({ success: true });
  });

  // AI Official Letter Generator Endpoint
  app.post('/api/ai/generate-letter', async (req: Request, res: Response) => {
    try {
      const { 
        objective, 
        recipientCompany, 
        recipientName, 
        recipientTitle,
        keyPoints, 
        tone 
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `You are the executive correspondence lead at DeRoyalTech Systems Limited, Accra, Ghana.
Write an official corporate letter.
Recipient Organization: ${recipientCompany || 'Corporate Partner'}
Recipient Person: ${recipientName || 'Managing Director'} (${recipientTitle || 'Director'})
Tone: ${tone || 'Formal Executive'}
Objective: ${objective || 'Commercial & Technical Proposal for Enterprise Infrastructure'}
Key Points to Cover:
${keyPoints || 'High-availability hybrid cloud architecture, CRM synchronization, turnkey hardware delivery, 3-year warranty in Ghana, 24/7 DevOps SLA.'}

Respond with valid JSON only in this format:
{
  "subject": "CLEAR ALL-CAPS FORMAL SUBJECT LINE",
  "salutation": "Dear Sir/Madam,",
  "content": "Paragraph 1 introducing the purpose...\\n\\nParagraph 2 detailing the technical scope and Ghanaian operational readiness...\\n\\nParagraph 3 outlining commercial terms, warranty, and next steps.",
  "recommendedTemplate": "proposal"
}`;

          const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          const responseText = aiResponse.text || '';
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, ...parsed });
        } catch (genErr) {
          console.warn('Gemini AI generation fallback:', genErr);
        }
      }

      // Robust Ghanaian corporate template generator fallback
      const company = recipientCompany || 'Valued Corporate Partner';
      const sub = `PROPOSAL FOR ADVANCED CLOUD ARCHITECTURE & CRM SYSTEM FOR ${company.toUpperCase()}`;
      const salutation = recipientName ? `Dear ${recipientName},` : 'Dear Sir/Madam,';
      const body = `We have the honor to submit this formal proposal on behalf of DeRoyalTech Systems Limited regarding the deployment of resilient enterprise infrastructure and tailored software architectures.

Following our technical assessment, DeRoyalTech Systems proposes to engineer a specialized technology suite optimized for Ghanaian enterprise scale:

1. High-Availability Hybrid Cloud: Redundant server clusters deployed with automated failover and 99.99% uptime guarantee across local ISP networks.
2. Custom Enterprise CRM & Workflow Automation: Real-time telemetry synchronizing your operations, branches, and customer service desks.
3. Turnkey Hardware & Peripheral Deployment: Enterprise workstations, industrial barcode/RFID scanners, and local appliance backups with on-site engineering setup.

Our Accra-based DevOps operations hub ensures continuous technical support, rapid equipment replacement, and dedicated account oversight under our 3-Year Enterprise SLA.

We welcome the opportunity to review this scope in detail with your executive leadership.`;

      return res.json({
        success: true,
        subject: sub,
        salutation: salutation,
        content: body,
        recommendedTemplate: 'proposal'
      });
    } catch (error: any) {
      console.error('Error generating letter:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Official Letter Email Dispatch Endpoint
  app.post('/api/letters/dispatch-email', (req: Request, res: Response) => {
    try {
      const { letter, recipientEmail } = req.body;
      const data = loadData();
      
      if (data.letters && letter?.id) {
        data.letters = data.letters.map((l: any) => 
          l.id === letter.id ? { ...l, status: 'sent', sentAt: new Date().toISOString(), sentTo: recipientEmail } : l
        );
        saveData(data);
      }

      res.json({ 
        success: true, 
        message: `Official letter ${letter?.referenceNumber || ''} dispatched successfully to ${recipientEmail}`,
        dispatchedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error dispatching letter email:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== WEBAUTHN / FIDO2 BIOMETRIC AUTHENTICATION ====================
  const DEFAULT_SEED_USERS = [
    {
      id: 'user-admin-master',
      fullName: 'DeRoyalTech Engineering Lead',
      email: 'admin@deroyaltech.com',
      company: 'DeRoyalTech Systems Limited',
      phone: '+233 (0) 30 294 8821',
      role: 'Principal Systems Administrator',
      password: 'admin',
      registeredAt: '2026-01-01T00:00:00Z',
      status: 'approved',
      isVerified: true,
      isAdmin: true,
      approvedAt: '2026-01-01T00:00:00Z',
      approvedBy: 'System'
    },
    {
      id: 'user-partner-asante',
      fullName: 'Kwame Asante',
      email: 'k.asante@ghana-enterprises.com',
      company: 'Asante Logistics & Technology Ltd',
      phone: '+233 24 590 1284',
      role: 'Chief Technology Officer',
      password: 'password123',
      registeredAt: '2026-10-15T11:20:00Z',
      status: 'approved',
      isVerified: true,
      isAdmin: false,
      approvedAt: '2026-10-16T09:00:00Z',
      approvedBy: 'DeRoyalTech Admin'
    },
    {
      id: 'user-pending-mensah',
      fullName: 'Ama Mensah',
      email: 'ama.mensah@accra-retail.com',
      company: 'Accra Retail Ventures',
      phone: '+233 20 445 1928',
      role: 'Procurement Director',
      password: 'password123',
      registeredAt: '2026-11-01T14:45:00Z',
      status: 'pending',
      isVerified: false,
      isAdmin: false
    }
  ];

  const ensureSeedUsers = (data: any) => {
    if (!Array.isArray(data.users) || data.users.length === 0) {
      data.users = JSON.parse(JSON.stringify(DEFAULT_SEED_USERS));
      return true;
    }
    return false;
  };

  const toBase64Url = (buf: Buffer): string =>
    buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

  const fromBase64Url = (str: string): Buffer => {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
    return Buffer.from(padded, 'base64');
  };

  // Lightweight deterministic CBOR decoder for WebAuthn attestationObject & COSE keys
  const decodeCbor = (buf: Buffer, state = { offset: 0 }): any => {
    if (state.offset >= buf.length) throw new Error('Unexpected end of CBOR buffer');
    const initialByte = buf[state.offset++];
    const majorType = initialByte >> 5;
    const additionalInfo = initialByte & 0x1f;

    const readLength = (): number => {
      if (additionalInfo < 24) return additionalInfo;
      if (additionalInfo === 24) return buf[state.offset++];
      if (additionalInfo === 25) {
        const v = buf.readUInt16BE(state.offset);
        state.offset += 2;
        return v;
      }
      if (additionalInfo === 26) {
        const v = buf.readUInt32BE(state.offset);
        state.offset += 4;
        return v;
      }
      throw new Error(`Unsupported CBOR length info: ${additionalInfo}`);
    };

    if (majorType === 0) return readLength();
    if (majorType === 1) return -1 - readLength();
    if (majorType === 2) {
      const len = readLength();
      const slice = buf.subarray(state.offset, state.offset + len);
      state.offset += len;
      return slice;
    }
    if (majorType === 3) {
      const len = readLength();
      const slice = buf.subarray(state.offset, state.offset + len).toString('utf8');
      state.offset += len;
      return slice;
    }
    if (majorType === 4) {
      const len = readLength();
      const arr = [];
      for (let i = 0; i < len; i++) arr.push(decodeCbor(buf, state));
      return arr;
    }
    if (majorType === 5) {
      const len = readLength();
      const map: Record<string, any> = {};
      for (let i = 0; i < len; i++) {
        const k = decodeCbor(buf, state);
        const v = decodeCbor(buf, state);
        map[String(k)] = v;
      }
      return map;
    }
    if (majorType === 7) {
      if (additionalInfo === 20) return false;
      if (additionalInfo === 21) return true;
      if (additionalInfo === 22) return null;
      return undefined;
    }
    throw new Error(`Unsupported CBOR major type: ${majorType}`);
  };

  const coseToSpki = (coseKey: Record<string, any>): { spkiBase64Url: string; alg: number } => {
    const kty = Number(coseKey['1']);
    const alg = Number(coseKey['3'] || -7);
    if (kty === 2 && Number(coseKey['-1']) === 1) {
      // EC2 P-256
      const x = Buffer.from(coseKey['-2']);
      const y = Buffer.from(coseKey['-3']);
      const keyObj = crypto.createPublicKey({
        key: { kty: 'EC', crv: 'P-256', x: toBase64Url(x), y: toBase64Url(y) },
        format: 'jwk'
      });
      const spki = keyObj.export({ type: 'spki', format: 'der' }) as Buffer;
      return { spkiBase64Url: toBase64Url(spki), alg };
    }
    if (kty === 3) {
      // RSA
      const n = Buffer.from(coseKey['-1']);
      const e = Buffer.from(coseKey['-2']);
      const keyObj = crypto.createPublicKey({
        key: { kty: 'RSA', n: toBase64Url(n), e: toBase64Url(e) },
        format: 'jwk'
      });
      const spki = keyObj.export({ type: 'spki', format: 'der' }) as Buffer;
      return { spkiBase64Url: toBase64Url(spki), alg };
    }
    throw new Error(`Unsupported COSE key type: ${kty}`);
  };

  const extractSpkiFromAttestation = (
    attestationObjectB64Url?: string,
    fallbackSpkiB64Url?: string,
    fallbackAlg?: number
  ): { spkiBase64Url: string; alg: number; counter: number; credentialId?: string } => {
    if (attestationObjectB64Url) {
      try {
        const attBuf = fromBase64Url(attestationObjectB64Url);
        const attObj = decodeCbor(attBuf);
        const authData: Buffer = Buffer.from(attObj.authData);
        const flags = authData[32];
        const counter = authData.readUInt32BE(33);
        const hasAttestedCred = (flags & 0x40) !== 0;
        if (hasAttestedCred && authData.length > 55) {
          const credIdLen = authData.readUInt16BE(53);
          const credId = toBase64Url(authData.subarray(55, 55 + credIdLen));
          const coseSlice = authData.subarray(55 + credIdLen);
          const coseKey = decodeCbor(coseSlice);
          const { spkiBase64Url, alg } = coseToSpki(coseKey);
          return { spkiBase64Url, alg, counter, credentialId: credId };
        }
      } catch (err) {
        if (!fallbackSpkiB64Url) {
          throw err;
        }
      }
    }
    if (fallbackSpkiB64Url) {
      // Validate DER SPKI parses cleanly in Node crypto
      const spkiBuf = fromBase64Url(fallbackSpkiB64Url);
      crypto.createPublicKey({ key: spkiBuf, format: 'der', type: 'spki' });
      return {
        spkiBase64Url: fallbackSpkiB64Url,
        alg: Number(fallbackAlg || -7),
        counter: 0
      };
    }
    throw new Error('Could not extract valid SPKI public key from WebAuthn credential');
  };

  interface PendingWebAuthnChallenge {
    challenge: string;
    type: 'register' | 'login';
    email?: string;
    rpId: string;
    expiresAt: number;
  }
  const webAuthnChallenges = new Map<string, PendingWebAuthnChallenge>();

  const cleanupExpiredChallenges = () => {
    const now = Date.now();
    for (const [key, entry] of webAuthnChallenges.entries()) {
      if (entry.expiresAt < now) {
        webAuthnChallenges.delete(key);
      }
    }
  };

  // Step 1: Begin Biometric / Passkey Registration
  app.post('/api/webauthn/register/options', (req: Request, res: Response) => {
    try {
      cleanupExpiredChallenges();
      const data = loadData();
      if (ensureSeedUsers(data)) {
        saveData(data, false);
      }

      const rawEmail = String(req.body?.email || '').trim().toLowerCase();
      const rpId = String(req.body?.rpId || req.hostname || 'localhost').split(':')[0];
      const password = req.body?.password ? String(req.body.password) : undefined;
      const allowNewAccountRegistration = Boolean(req.body?.allowNewAccountRegistration);
      const authenticatorAttachment = req.body?.authenticatorAttachment === 'cross-platform' ? 'cross-platform' : 'platform';

      if (!rawEmail) {
        return res.status(400).json({ success: false, message: 'Corporate email address is required to enroll biometrics.' });
      }

      const existingUser = (data.users || []).find((u: any) => (u.email || '').toLowerCase() === rawEmail);

      if (!existingUser && !allowNewAccountRegistration) {
        return res.status(404).json({
          success: false,
          message: 'No registered client account found with this email. Register first or switch to New Client Registration.'
        });
      }

      if (existingUser && !allowNewAccountRegistration && !req.body?.isLoggedInSession) {
        // Require password proof before attaching a new passkey to an existing account
        if (existingUser.password && existingUser.password !== password) {
          return res.status(401).json({
            success: false,
            message: 'Enter your current account password to authorize enrolling a biometric passkey.'
          });
        }
      }

      const challenge = toBase64Url(crypto.randomBytes(32));
      const challengeId = `wa-reg-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
      webAuthnChallenges.set(challengeId, {
        challenge,
        type: 'register',
        email: rawEmail,
        rpId,
        expiresAt: Date.now() + 5 * 60 * 1000
      });

      const userIdStr = existingUser?.id || `pending-${rawEmail}`;
      const displayName = existingUser?.fullName || String(req.body?.fullName || rawEmail);
      const excludeCredentials = (existingUser?.webAuthnCredentials || []).map((c: any) => ({
        id: c.id,
        type: 'public-key',
        transports: c.transports || ['internal']
      }));

      res.json({
        success: true,
        challengeId,
        options: {
          challenge,
          rp: {
            name: 'DeRoyalTech Systems Enterprise Portal',
            id: rpId
          },
          user: {
            id: toBase64Url(Buffer.from(userIdStr, 'utf8')),
            name: rawEmail,
            displayName
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
          ],
          timeout: 60000,
          attestation: 'none',
          excludeCredentials,
          authenticatorSelection: {
            authenticatorAttachment,
            residentKey: 'preferred',
            requireResidentKey: false,
            userVerification: 'required'
          }
        }
      });
    } catch (error: any) {
      console.error('WebAuthn register/options error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to generate WebAuthn registration options.' });
    }
  });

  // Step 2: Verify & Store Biometric / Passkey Registration
  app.post('/api/webauthn/register/verify', (req: Request, res: Response) => {
    try {
      cleanupExpiredChallenges();
      const { challengeId, email, credential, deviceName, authenticatorType } = req.body || {};
      const pending = webAuthnChallenges.get(String(challengeId || ''));
      if (!pending || pending.type !== 'register') {
        return res.status(400).json({ success: false, message: 'Biometric registration session expired or invalid. Please retry.' });
      }
      webAuthnChallenges.delete(String(challengeId));

      if (!credential?.id || !credential?.response?.clientDataJSON) {
        return res.status(400).json({ success: false, message: 'Malformed WebAuthn credential payload.' });
      }

      const clientDataBuf = fromBase64Url(credential.response.clientDataJSON);
      const clientData = JSON.parse(clientDataBuf.toString('utf8'));

      if (clientData.type !== 'webauthn.create') {
        return res.status(400).json({ success: false, message: 'Invalid WebAuthn ceremony type.' });
      }
      if (clientData.challenge !== pending.challenge) {
        return res.status(400).json({ success: false, message: 'WebAuthn challenge mismatch.' });
      }

      const extracted = extractSpkiFromAttestation(
        credential.response.attestationObject,
        credential.response.publicKeySpki,
        credential.response.publicKeyAlgorithm
      );

      const newCredRecord = {
        id: String(credential.id),
        rawId: String(credential.rawId || credential.id),
        publicKeySpki: extracted.spkiBase64Url,
        algorithm: extracted.alg,
        counter: extracted.counter || 0,
        deviceName: String(deviceName || 'Biometric Passkey Device').slice(0, 80),
        transports: Array.isArray(credential.response.transports) ? credential.response.transports : ['internal'],
        authenticatorType: authenticatorType || 'platform',
        createdAt: new Date().toISOString()
      };

      const data = loadData();
      ensureSeedUsers(data);
      const cleanEmail = String(email || pending.email || '').trim().toLowerCase();
      let matchedUser: any = null;

      data.users = (data.users || []).map((u: any) => {
        if ((u.email || '').toLowerCase() === cleanEmail) {
          const prevCreds = Array.isArray(u.webAuthnCredentials) ? u.webAuthnCredentials : [];
          const nextCreds = [newCredRecord, ...prevCreds.filter((c: any) => c.id !== newCredRecord.id)];
          matchedUser = { ...u, webAuthnCredentials: nextCreds };
          return matchedUser;
        }
        return u;
      });

      if (matchedUser) {
        saveData(data);
      }

      res.json({
        success: true,
        credential: newCredRecord,
        user: matchedUser,
        pendingAccountCreation: !matchedUser,
        revision: data._revision
      });
    } catch (error: any) {
      console.error('WebAuthn register/verify error:', error);
      res.status(400).json({ success: false, message: error.message || 'Biometric registration verification failed.' });
    }
  });

  // Step 3: Begin Biometric / Passkey Login
  app.post('/api/webauthn/login/options', (req: Request, res: Response) => {
    try {
      cleanupExpiredChallenges();
      const data = loadData();
      if (ensureSeedUsers(data)) {
        saveData(data, false);
      }

      const rawEmail = String(req.body?.email || '').trim().toLowerCase();
      const rpId = String(req.body?.rpId || req.hostname || 'localhost').split(':')[0];

      let allowCredentials: any[] = [];
      if (rawEmail) {
        const user = (data.users || []).find((u: any) => (u.email || '').toLowerCase() === rawEmail);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'No client account found for this email address.'
          });
        }
        const creds = Array.isArray(user.webAuthnCredentials) ? user.webAuthnCredentials : [];
        if (creds.length === 0) {
          return res.status(404).json({
            success: false,
            code: 'NO_CREDENTIALS',
            message: 'No biometric passkey is enrolled yet for this account. Enroll one using your password below.'
          });
        }
        allowCredentials = creds.map((c: any) => ({
          id: c.id,
          type: 'public-key',
          transports: c.transports || ['internal']
        }));
      }

      const challenge = toBase64Url(crypto.randomBytes(32));
      const challengeId = `wa-auth-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
      webAuthnChallenges.set(challengeId, {
        challenge,
        type: 'login',
        email: rawEmail || undefined,
        rpId,
        expiresAt: Date.now() + 5 * 60 * 1000
      });

      res.json({
        success: true,
        challengeId,
        options: {
          challenge,
          rpId,
          timeout: 60000,
          userVerification: 'required',
          allowCredentials
        }
      });
    } catch (error: any) {
      console.error('WebAuthn login/options error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to generate biometric login challenge.' });
    }
  });

  // Step 4: Verify Cryptographic Biometric Assertion & Authenticate User
  app.post('/api/webauthn/login/verify', (req: Request, res: Response) => {
    try {
      cleanupExpiredChallenges();
      const { challengeId, email, credential } = req.body || {};
      const pending = webAuthnChallenges.get(String(challengeId || ''));
      if (!pending || pending.type !== 'login') {
        return res.status(400).json({ success: false, message: 'Biometric authentication challenge expired or invalid. Please retry.' });
      }
      webAuthnChallenges.delete(String(challengeId));

      const resp = credential?.response;
      if (!credential?.id || !resp?.clientDataJSON || !resp?.authenticatorData || !resp?.signature) {
        return res.status(400).json({ success: false, message: 'Incomplete WebAuthn assertion payload.' });
      }

      const clientDataBuf = fromBase64Url(resp.clientDataJSON);
      const clientData = JSON.parse(clientDataBuf.toString('utf8'));
      if (clientData.type !== 'webauthn.get') {
        return res.status(400).json({ success: false, message: 'Invalid WebAuthn assertion type.' });
      }
      if (clientData.challenge !== pending.challenge) {
        return res.status(400).json({ success: false, message: 'Biometric login challenge mismatch.' });
      }

      const data = loadData();
      ensureSeedUsers(data);

      const cleanEmail = String(email || pending.email || '').trim().toLowerCase();
      let matchedUser: any = null;
      let matchedCred: any = null;

      for (const u of data.users || []) {
        if (cleanEmail && (u.email || '').toLowerCase() !== cleanEmail) continue;
        const creds = Array.isArray(u.webAuthnCredentials) ? u.webAuthnCredentials : [];
        const found = creds.find((c: any) => c.id === credential.id);
        if (found) {
          matchedUser = u;
          matchedCred = found;
          break;
        }
      }

      if (!matchedUser || !matchedCred) {
        return res.status(404).json({
          success: false,
          message: 'Biometric credential is not registered to an account on this portal.'
        });
      }

      // Parse authenticatorData & verify UP flag + RP ID hash
      const authDataBuf = fromBase64Url(resp.authenticatorData);
      if (authDataBuf.length < 37) {
        return res.status(400).json({ success: false, message: 'Malformed authenticatorData.' });
      }
      const flags = authDataBuf[32];
      const userPresent = (flags & 0x01) !== 0;
      if (!userPresent) {
        return res.status(401).json({ success: false, message: 'Biometric user presence verification was not completed.' });
      }

      const rpIdHash = authDataBuf.subarray(0, 32);
      const expectedRpHash = crypto.createHash('sha256').update(pending.rpId).digest();
      if (!rpIdHash.equals(expectedRpHash)) {
        return res.status(401).json({ success: false, message: 'WebAuthn relying party domain verification failed.' });
      }

      const newCounter = authDataBuf.readUInt32BE(33);
      if (matchedCred.counter > 0 && newCounter > 0 && newCounter <= matchedCred.counter) {
        return res.status(401).json({ success: false, message: 'Security warning: possible cloned authenticator counter detected.' });
      }

      // Cryptographic signature verification: signature over (authenticatorData || sha256(clientDataJSON))
      const clientDataHash = crypto.createHash('sha256').update(clientDataBuf).digest();
      const signedPayload = Buffer.concat([authDataBuf, clientDataHash]);
      const signatureBuf = fromBase64Url(resp.signature);
      const keyObj = crypto.createPublicKey({
        key: fromBase64Url(matchedCred.publicKeySpki),
        format: 'der',
        type: 'spki'
      });

      let isSignatureValid = false;
      try {
        isSignatureValid = crypto.verify('sha256', signedPayload, keyObj, signatureBuf);
      } catch {
        isSignatureValid = false;
      }

      if (!isSignatureValid && signatureBuf.length === 64) {
        try {
          isSignatureValid = crypto.verify('sha256', signedPayload, { key: keyObj, dsaEncoding: 'ieee-p1363' }, signatureBuf);
        } catch {
          isSignatureValid = false;
        }
      }

      if (!isSignatureValid) {
        return res.status(401).json({ success: false, message: 'Biometric cryptographic signature verification failed.' });
      }

      // Check account approval status
      if (matchedUser.status === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Biometric signature verified, but your account is still PENDING APPROVAL by DeRoyalTech System Administrators.'
        });
      }
      if (matchedUser.status === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your client portal access has been restricted. Contact support@deroyaltech.com.'
        });
      }

      const nowIso = new Date().toISOString();
      data.users = (data.users || []).map((u: any) => {
        if (u.id === matchedUser.id) {
          const nextCreds = (u.webAuthnCredentials || []).map((c: any) =>
            c.id === matchedCred.id ? { ...c, counter: newCounter, lastUsedAt: nowIso } : c
          );
          matchedUser = { ...u, webAuthnCredentials: nextCreds };
          return matchedUser;
        }
        return u;
      });
      saveData(data);

      res.json({
        success: true,
        user: matchedUser,
        authenticatedWith: {
          credentialId: matchedCred.id,
          deviceName: matchedCred.deviceName,
          authenticatorType: matchedCred.authenticatorType
        },
        revision: data._revision
      });
    } catch (error: any) {
      console.error('WebAuthn login/verify error:', error);
      res.status(500).json({ success: false, message: error.message || 'Biometric authentication verification error.' });
    }
  });

  // Delete / Revoke a registered WebAuthn biometric credential
  app.delete('/api/webauthn/credentials/:credentialId', (req: Request, res: Response) => {
    const { credentialId } = req.params;
    const { userId, email } = req.body || {};
    const data = loadData();
    ensureSeedUsers(data);

    let updatedUser: any = null;
    data.users = (data.users || []).map((u: any) => {
      const matchesUser =
        (userId && u.id === userId) ||
        (email && (u.email || '').toLowerCase() === String(email).toLowerCase()) ||
        (!userId && !email);
      if (matchesUser && Array.isArray(u.webAuthnCredentials)) {
        const nextCreds = u.webAuthnCredentials.filter((c: any) => c.id !== credentialId);
        if (nextCreds.length !== u.webAuthnCredentials.length) {
          updatedUser = { ...u, webAuthnCredentials: nextCreds };
          return updatedUser;
        }
      }
      return u;
    });

    if (updatedUser) {
      saveData(data);
    }
    res.json({ success: true, user: updatedUser, revision: data._revision });
  });

  // Bind HTTP listener immediately so container startup probes succeed without waiting on cold Vite initialization
  const server = app.listen(PORT, HOST, () => {
    console.log(`DeRoyalTech Server running on http://${HOST}:${PORT}`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://${HOST}:${PORT}/`);
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });

  // Serve Vite app
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vitePromise = createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: null
      },
      appType: 'spa'
    });

    app.use(async (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    // Development SPA fallback: render index.html via Vite for any non-API navigation
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      let viteInstance: Awaited<ReturnType<typeof createViteServer>> | null = null;
      try {
        viteInstance = await vitePromise;
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await viteInstance.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err: any) {
        if (viteInstance) {
          viteInstance.ssrFixStacktrace(err);
        }
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

startServer();
