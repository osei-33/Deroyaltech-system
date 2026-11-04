// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = 3e3;
var portArgIndex = process.argv.indexOf("--port");
if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
  PORT = Number(process.argv[portArgIndex + 1]);
} else if (process.env.PORT && process.env.PORT !== "8080") {
  PORT = Number(process.env.PORT);
} else if (process.env.DEFAULT_APP_PORT) {
  PORT = Number(process.env.DEFAULT_APP_PORT);
}
var HOST = "0.0.0.0";
var hostArgIndex = process.argv.indexOf("--host");
if (hostArgIndex !== -1 && process.argv[hostArgIndex + 1]) {
  HOST = process.argv[hostArgIndex + 1];
} else if (process.env.HOST) {
  HOST = process.env.HOST;
}
var DATA_DIR = path.resolve(__dirname, "data");
var DATA_FILE = path.resolve(DATA_DIR, "site-data.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var getInitialData = () => {
  return {
    config: {
      logoUrl: "/assets/aistudio/Deroyaltech_Digital_Innovation_Logo_9f10ddb1.png",
      currencySymbol: "GH\u20B5",
      currencyCode: "GHS",
      accentTheme: "deroyal-dual",
      overlayStyle: "ambient-glass",
      heroHeadline: "Full-stack software, custom CRM, and integrated hardware workflows.",
      heroSubtitle: "DeRoyalTech engineers web platforms, native mobile applications, bespoke CRM architectures, and multi-cloud infrastructure\u2014seamlessly integrated with industrial sensors, edge gateways, and enterprise computer peripherals to streamline operations.",
      contact: {
        companyName: "DeRoyalTech Systems Limited",
        tagline: "Innovate \xB7 Build \xB7 Grow",
        phonePrimary: "+233 (0) 30 294 8821",
        phoneSecondary: "+233 (0) 24 590 1284",
        emailGeneral: "info@deroyaltech.com",
        emailSales: "sales@deroyaltech.com",
        emailSupport: "support@deroyaltech.com",
        physicalAddress: "Suite 402, Standard Chartered Building, Airport City & Spintex Tech Corridor",
        cityCountry: "Accra, Ghana",
        businessHours: "Mon - Fri: 8:00 AM - 6:00 PM GMT (24/7 DevOps Support Standby)",
        whatsappNumber: "+233245901284"
      },
      social: {
        whatsapp: "https://wa.me/233245901284",
        facebook: "https://facebook.com/deroyaltech",
        tiktok: "https://tiktok.com/@deroyaltech",
        instagram: "https://instagram.com/deroyaltech",
        linkedin: "https://linkedin.com/company/deroyaltech"
      },
      enableVideoPreviews: true
    },
    hardware: [],
    projects: [],
    inquiries: [
      {
        id: "DRT-INQ-9481",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        fullName: "Kwame Mensah",
        email: "k.mensah@ghanashippers.org",
        company: "West Africa Shippers Council",
        projectType: "turnkey",
        budget: "GH\u20B5 150,000 - GH\u20B5 400,000",
        timeline: "Within 2-3 months",
        scopeNotes: "Warehouse scanner fleet integration and custom CRM pipeline synchronization",
        message: "Looking to deploy 45 rugged handheld RFID terminals with real-time cloud data telemetry.",
        status: "New"
      }
    ]
  };
};
var loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading site data file:", err);
  }
  const init = getInitialData();
  saveData(init);
  return init;
};
var saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving site data file:", err);
  }
};
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.get("/api/site-data", (_req, res) => {
    const data = loadData();
    res.json(data);
  });
  app.post("/api/site-data", (req, res) => {
    const current = loadData();
    const updated = { ...current, ...req.body };
    saveData(updated);
    res.json({ success: true, data: updated });
  });
  app.post("/api/inquiries", (req, res) => {
    const data = loadData();
    const newInquiry = {
      id: `DRT-INQ-${Math.floor(1e3 + Math.random() * 9e3)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "New",
      ...req.body
    };
    data.inquiries = [newInquiry, ...data.inquiries || []];
    saveData(data);
    res.json({ success: true, inquiry: newInquiry });
  });
  app.patch("/api/inquiries/:id", (req, res) => {
    const data = loadData();
    const id = req.params.id;
    data.inquiries = (data.inquiries || []).map(
      (inq) => inq.id === id ? { ...inq, ...req.body } : inq
    );
    saveData(data);
    res.json({ success: true });
  });
  app.get("/api/chats", (_req, res) => {
    const data = loadData();
    res.json(data.chatThreads || []);
  });
  app.post("/api/chats/sync", (req, res) => {
    const data = loadData();
    data.chatThreads = req.body.chatThreads || [];
    saveData(data);
    res.json({ success: true });
  });
  app.get("/api/service-requests", (_req, res) => {
    const data = loadData();
    res.json(data.serviceRequests || []);
  });
  app.post("/api/service-requests/sync", (req, res) => {
    const data = loadData();
    data.serviceRequests = req.body.serviceRequests || [];
    saveData(data);
    res.json({ success: true });
  });
  app.get("/api/tracked-projects", (_req, res) => {
    const data = loadData();
    res.json(data.trackedProjects || []);
  });
  app.post("/api/tracked-projects/sync", (req, res) => {
    const data = loadData();
    data.trackedProjects = req.body.trackedProjects || [];
    saveData(data);
    res.json({ success: true });
  });
  app.get("/api/knowledge-base", (_req, res) => {
    const data = loadData();
    res.json(data.faqArticles || []);
  });
  app.post("/api/knowledge-base/sync", (req, res) => {
    const data = loadData();
    data.faqArticles = req.body.faqArticles || [];
    saveData(data);
    res.json({ success: true, count: data.faqArticles.length });
  });
  app.post("/api/knowledge-base/vote", (req, res) => {
    const { id, isHelpful } = req.body;
    const data = loadData();
    if (data.faqArticles) {
      data.faqArticles = data.faqArticles.map((art) => {
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
  app.get("/api/notifications/email-alerts", (_req, res) => {
    const data = loadData();
    res.json(data.emailAlerts || []);
  });
  app.post("/api/notifications/email-alert", (req, res) => {
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
          <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">Innovate \xB7 Build \xB7 Grow \xB7 Accra, Ghana</p>
        </div>

        <div style="padding: 28px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-top: 0;">
            Hello ${recipientName || "Valued Partner"},
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
              <div style="font-size: 13px; color: #e2e8f0; line-height: 1.5;">${updateSummary || "Engineering roadmap advancing on schedule."}</div>
            </div>
          </div>

          <div style="font-size: 12px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
            <div><strong>Lead Architect:</strong> ${leadEngineer || "Senior Systems Architect, DeRoyalTech"}</div>
            ${estimatedDeliveryDate ? `<div><strong>Target Delivery:</strong> ${estimatedDeliveryDate}</div>` : ""}
            <div><strong>Currency / Invoicing:</strong> Ghanaian Cedis (GH\u20B5)</div>
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
      recipientName: recipientName || "Client",
      subject,
      sentAt: (/* @__PURE__ */ new Date()).toISOString(),
      stage,
      stageLabel: stageLabel || stage,
      progressPercent: Number(progressPercent) || 0,
      updateSummary: updateSummary || "Project status updated.",
      status: "Delivered",
      leadEngineer: leadEngineer || "Senior Systems Architect",
      estimatedDeliveryDate,
      htmlPreview
    };
    data.emailAlerts = [newAlert, ...data.emailAlerts || []];
    saveData(data);
    res.json({ success: true, alert: newAlert });
  });
  app.post("/api/notifications/email-alerts/sync", (req, res) => {
    const data = loadData();
    data.emailAlerts = req.body.emailAlerts || [];
    saveData(data);
    res.json({ success: true });
  });
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith("/api")) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (err) {
        vite.ssrFixStacktrace(err);
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, HOST, () => {
    console.log(`DeRoyalTech Server running on http://${HOST}:${PORT}`);
  });
}
startServer();
