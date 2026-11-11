import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
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

// Initial site data template
const getInitialData = () => {
  return {
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
      enableVideoPreviews: true
    },
    hardware: [],
    projects: [],
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

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading site data file:', err);
  }
  const init = getInitialData();
  saveData(init);
  return init;
};

const saveData = (data: any) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving site data file:', err);
  }
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

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
    current._lastModified = new Date().toISOString();
    saveData(current);
    res.json({ success: true, contact: current.config.contact });
  });

  app.post('/api/site-data', (req: Request, res: Response) => {
    const current = loadData();
    const updated = { 
      ...current, 
      ...req.body,
      config: req.body.config ? {
        ...current.config,
        ...req.body.config,
        contact: { ...(current.config?.contact || {}), ...(req.body.config.contact || {}) },
        social: { ...(current.config?.social || {}), ...(req.body.config.social || {}) },
        metrics: { ...(current.config?.metrics || {}), ...(req.body.config.metrics || {}) },
        announcement: req.body.config.announcement !== undefined ? req.body.config.announcement : current.config?.announcement,
        letterhead: req.body.config.letterhead !== undefined ? req.body.config.letterhead : current.config?.letterhead,
        adminProfile: req.body.config.adminProfile !== undefined ? req.body.config.adminProfile : current.config?.adminProfile
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
      _lastModified: new Date().toISOString()
    };
    saveData(updated);
    res.json({ success: true, data: updated });
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

  // Serve Vite app
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    // Development SPA fallback: render index.html via Vite for any non-API navigation
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err: any) {
        vite.ssrFixStacktrace(err);
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

  app.listen(PORT, HOST, () => {
    console.log(`DeRoyalTech Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
