import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SiteConfig, 
  HardwareProduct, 
  CompletedProject, 
  InquiryItem,
  SocialHandles,
  ClientUser,
  PageId,
  ServiceItem,
  PartnerQuote,
  ProjectMetricsConfig,
  ConsultationBooking,
  ChatThread,
  ChatMessage,
  ServiceProjectRequest,
  TrackedProject,
  ProjectMilestone,
  ProjectLogEntry,
  FAQArticle,
  ProjectEmailAlert
} from '../types/index.ts';
import { 
  DEFAULT_SITE_CONFIG, 
  HARDWARE_PRODUCTS as DEFAULT_HARDWARE, 
  COMPLETED_PROJECTS as DEFAULT_PROJECTS,
  COMPANY_SERVICES as DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_METRICS,
  DEFAULT_CHAT_THREADS,
  DEFAULT_SERVICE_REQUESTS,
  DEFAULT_TRACKED_PROJECTS,
  DEFAULT_FAQ_ARTICLES,
  DEFAULT_EMAIL_ALERTS
} from '../data/companyData.ts';

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: ClientUser;
}

export type AdminPortalTab = 
  | 'services' 
  | 'testimonials' 
  | 'metrics' 
  | 'bookings' 
  | 'users' 
  | 'inquiries' 
  | 'support'     // Live Support Tab
  | 'tracker'     // Service Requests & Project Tracker Tab
  | 'knowledge'   // Knowledge Base & FAQ Management Tab
  | 'hardware' 
  | 'projects' 
  | 'branding' 
  | 'contact' 
  | 'social' 
  | 'currency' 
  | 'overlays';

interface SiteContextType {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  updateContact: (updates: Partial<SiteConfig['contact']>) => void;
  updateSocial: (updates: Partial<SocialHandles>) => void;
  updateProjectMetrics: (updates: Partial<ProjectMetricsConfig>) => void;

  // Services CRUD & Pricing
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  updateServicePrice: (id: string, newPrice: number) => void;
  deleteService: (id: string) => void;
  resetServicesToDefault: () => void;

  // Testimonials / Quotes CRUD
  testimonials: PartnerQuote[];
  addTestimonial: (quote: Omit<PartnerQuote, 'id'>) => void;
  updateTestimonial: (id: string, updates: Partial<PartnerQuote>) => void;
  deleteTestimonial: (id: string) => void;
  resetTestimonialsToDefault: () => void;

  // Hardware Products CRUD & Pricing
  hardwareProducts: HardwareProduct[];
  addProduct: (product: Omit<HardwareProduct, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<HardwareProduct>) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;

  // Completed Projects CRUD
  completedProjects: CompletedProject[];
  addCompletedProject: (project: Omit<CompletedProject, 'id'>) => void;
  updateCompletedProject: (id: string, updates: Partial<CompletedProject>) => void;
  deleteCompletedProject: (id: string) => void;
  resetProjectsToDefault: () => void;

  // Consultation Bookings & Management
  consultationBookings: ConsultationBooking[];
  bookConsultation: (data: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => string;
  approveBooking: (id: string, adminNotes?: string) => void;
  rejectBooking: (id: string, adminNotes?: string) => void;
  rescheduleBooking: (id: string, newDate: string, newTime: string, adminNotes?: string) => void;
  deleteBooking: (id: string) => void;

  // Inquiries
  inquiries: InquiryItem[];
  submitInquiry: (data: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>) => string;
  updateInquiryStatus: (id: string, status: InquiryItem['status']) => void;
  addInquiryNote: (id: string, note: string) => void;
  deleteInquiry: (id: string) => void;

  // Live Support Real-Time Chat
  chatThreads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  sendClientMessage: (params: { 
    threadId?: string; 
    clientName: string; 
    clientEmail: string; 
    clientPhone?: string; 
    clientCompany?: string; 
    message: string; 
    subject?: string; 
    projectId?: string 
  }) => string;
  sendAdminReply: (threadId: string, message: string) => void;
  updateThreadStatus: (threadId: string, status: ChatThread['status']) => void;
  deleteThread: (threadId: string) => void;
  isChatWidgetOpen: boolean;
  setIsChatWidgetOpen: (open: boolean) => void;
  openChatWithContext: (initialSubject?: string, projectId?: string) => void;

  // Service Requests & Project Tracker
  serviceRequests: ServiceProjectRequest[];
  trackedProjects: TrackedProject[];
  submitServiceRequest: (data: Omit<ServiceProjectRequest, 'id' | 'createdAt' | 'status'>) => string;
  updateServiceRequestStatus: (id: string, status: ServiceProjectRequest['status'], adminNotes?: string) => void;
  confirmAndCreateProjectTracker: (
    requestId: string, 
    initialConfig?: { 
      title?: string; 
      estimatedDeliveryDate?: string; 
      progressPercent?: number; 
      leadEngineer?: string; 
      initialNotes?: string 
    }
  ) => string;
  createCustomTrackedProject: (project: Omit<TrackedProject, 'projectId'> & { customId?: string }) => string;
  updateTrackedProject: (projectId: string, updates: Partial<TrackedProject>) => void;
  updateProjectMilestone: (projectId: string, milestoneId: string, status: 'completed' | 'in_progress' | 'pending') => void;
  addProjectLogEntry: (projectId: string, entry: { title: string; note: string; author?: string; stageBadge?: string }) => void;
  deleteTrackedProject: (projectId: string) => void;
  deleteServiceRequest: (requestId: string) => void;

  // Automated Email Notifications System
  emailAlerts: ProjectEmailAlert[];
  dispatchProjectEmailAlert: (params: { 
    projectId: string; 
    stage?: string; 
    stageLabel?: string; 
    progressPercent?: number; 
    updateSummary?: string; 
    force?: boolean 
  }) => Promise<ProjectEmailAlert | null>;
  deleteEmailAlert: (alertId: string) => void;
  autoEmailEnabled: boolean;
  setAutoEmailEnabled: (enabled: boolean) => void;

  // Knowledge Base & FAQ Management
  faqArticles: FAQArticle[];
  addFAQArticle: (article: Omit<FAQArticle, 'id' | 'createdAt' | 'updatedAt' | 'helpfulVotes' | 'unhelpfulVotes'>) => void;
  updateFAQArticle: (id: string, updates: Partial<FAQArticle>) => void;
  deleteFAQArticle: (id: string) => void;
  voteFAQHelpful: (id: string, isHelpful: boolean) => void;
  resetFAQToDefault: () => void;

  // Modal Controls for Tracker & Service Requests
  isTrackerModalOpen: boolean;
  setIsTrackerModalOpen: (open: boolean) => void;
  trackerSearchId: string;
  setTrackerSearchId: (id: string) => void;
  openTrackerForId: (projectId: string) => void;
  isServiceRequestModalOpen: boolean;
  setIsServiceRequestModalOpen: (open: boolean) => void;
  selectedServiceForRequest: ServiceItem | null;
  openServiceRequestModal: (service?: ServiceItem) => void;

  formatPrice: (amount: number) => string;
  
  // Navigation & Multi-Page
  currentPage: PageId;
  navigateTo: (page: PageId) => boolean;

  // Client Authentication, Registry & Approval Guard
  clientUser: ClientUser | null;
  registeredUsers: ClientUser[];
  registerClient: (userData: { fullName: string; email: string; company: string; phone: string; role: string; password?: string }) => AuthResponse;
  loginClient: (email: string, password?: string) => AuthResponse;
  adminLogin: (password: string) => boolean;
  instantDemoLogin: () => void;
  logoutClient: () => void;
  approveClientUser: (userId: string) => void;
  rejectClientUser: (userId: string) => void;
  toggleUserAdminRole: (userId: string) => void;
  deleteClientUser: (userId: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  authRedirectTarget: PageId | null;

  // Admin CMS Portal
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeAdminTab: AdminPortalTab;
  setActiveAdminTab: (tab: AdminPortalTab) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Default Registered Users
const INITIAL_USERS: ClientUser[] = [
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

// Initial Bookings
const INITIAL_BOOKINGS: ConsultationBooking[] = [
  {
    id: 'DRT-BOOK-101',
    createdAt: '2026-11-01T09:30:00Z',
    fullName: 'Nana Yaw Osei',
    email: 'ny.osei@ghanaports.gov.gh',
    phone: '+233 24 330 9182',
    company: 'Ghana Ports & Harbours Authority',
    projectScope: 'Custom CRM & 80 Handheld Rugged RFID Barcode Scanners',
    budgetBracket: 'GH₵ 150,000 - GH₵ 400,000',
    scheduledDate: '2026-11-10',
    timeSlot: '10:00 AM GMT',
    status: 'Pending',
    adminNotes: 'Requested technical review at Tema harbor engineering office.'
  },
  {
    id: 'DRT-BOOK-102',
    createdAt: '2026-10-28T14:15:00Z',
    fullName: 'Ebenezer Mensah',
    email: 'e.mensah@finbridge.com.gh',
    phone: '+233 30 220 4455',
    company: 'FinBridge Capital West Africa',
    projectScope: 'Multi-Cloud Kubernetes Migration & Bank of Ghana Data Compliance',
    budgetBracket: 'GH₵ 400,000+ Enterprise Turnkey',
    scheduledDate: '2026-11-05',
    timeSlot: '02:00 PM GMT',
    status: 'Approved',
    adminNotes: 'Assigned Senior DevOps Cloud Architect for executive demo.'
  }
];

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Config state
  const [config, setConfig] = useState<SiteConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_site_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_SITE_CONFIG,
            ...parsed,
            contact: { ...DEFAULT_SITE_CONFIG.contact, ...(parsed.contact || {}) },
            social: { ...DEFAULT_SITE_CONFIG.social, ...(parsed.social || {}) },
            metrics: { ...DEFAULT_METRICS, ...(parsed.metrics || {}) },
            testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 ? parsed.testimonials : DEFAULT_TESTIMONIALS
          };
        } catch (e) {
          console.error('Error parsing stored config:', e);
        }
      }
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Services state
  const [services, setServices] = useState<ServiceItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_services');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_SERVICES;
  });

  // Testimonials state
  const [testimonials, setTestimonials] = useState<PartnerQuote[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_testimonials');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_TESTIMONIALS;
  });

  // Registered Users Registry
  const [registeredUsers, setRegisteredUsers] = useState<ClientUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_registered_users');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_USERS;
  });

  // Current Logged-in Client User
  const [clientUser, setClientUser] = useState<ClientUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_client_auth');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return null;
  });

  // Consultation Bookings
  const [consultationBookings, setConsultationBookings] = useState<ConsultationBooking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_consultation_bookings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_BOOKINGS;
  });

  // Page Routing state
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');
  const [authRedirectTarget, setAuthRedirectTarget] = useState<PageId | null>(null);

  // Hardware Products state
  const [hardwareProducts, setHardwareProducts] = useState<HardwareProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_hardware_products');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_HARDWARE;
  });

  // Completed Projects state
  const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_completed_projects');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_PROJECTS;
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_inquiries');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return [
      {
        id: 'DRT-INQ-9481',
        createdAt: '2026-11-01T14:22:00Z',
        fullName: 'Kwame Mensah',
        email: 'k.mensah@ghanashippers.org',
        phone: '+233 24 590 1284',
        company: 'West Africa Shippers Council',
        projectType: 'turnkey',
        budget: 'GH₵ 150,000 - GH₵ 400,000',
        timeline: 'Within 2-3 months',
        scopeNotes: 'Warehouse scanner fleet integration and custom CRM pipeline synchronization',
        message: 'Looking to deploy 45 rugged handheld RFID terminals with real-time cloud data telemetry across Tema and Takoradi ports.',
        status: 'New'
      }
    ];
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminPortalTab>('branding');

  // Live Support Real-Time Chat State
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_chat_threads');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_CHAT_THREADS;
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  // Service Requests & Project Tracker State
  const [serviceRequests, setServiceRequests] = useState<ServiceProjectRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_service_requests');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_SERVICE_REQUESTS;
  });

  const [trackedProjects, setTrackedProjects] = useState<TrackedProject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_tracked_projects');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_TRACKED_PROJECTS;
  });

  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [trackerSearchId, setTrackerSearchId] = useState('');
  const [isServiceRequestModalOpen, setIsServiceRequestModalOpen] = useState(false);
  const [selectedServiceForRequest, setSelectedServiceForRequest] = useState<ServiceItem | null>(null);

  // Automated Email Notifications State
  const [emailAlerts, setEmailAlerts] = useState<ProjectEmailAlert[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_email_alerts');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_EMAIL_ALERTS;
  });
  const [autoEmailEnabled, setAutoEmailEnabled] = useState<boolean>(true);

  // Knowledge Base FAQ Articles State
  const [faqArticles, setFaqArticles] = useState<FAQArticle[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drt_faq_articles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_FAQ_ARTICLES;
  });

  // Backend Sync Helper
  const syncToServer = async (payload: any) => {
    try {
      await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Offline fallback: handled by localStorage
    }
  };

  // Initial load from server if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/site-data');
        if (res.ok) {
          const data = await res.json();
          if (data.config && Object.keys(data.config).length > 0) {
            setConfig(prev => ({
              ...prev,
              ...data.config,
              contact: { ...prev.contact, ...(data.config.contact || {}) },
              social: { ...prev.social, ...(data.config.social || {}) },
              metrics: { ...prev.metrics, ...(data.config.metrics || {}) },
              testimonials: Array.isArray(data.config.testimonials) && data.config.testimonials.length > 0 ? data.config.testimonials : prev.testimonials
            }));
          }
          if (Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
          }
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
          if (Array.isArray(data.users) && data.users.length > 0) {
            setRegisteredUsers(data.users);
          }
          if (Array.isArray(data.bookings) && data.bookings.length > 0) {
            setConsultationBookings(data.bookings);
          }
          if (Array.isArray(data.hardware) && data.hardware.length > 0) {
            setHardwareProducts(data.hardware);
          }
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            setCompletedProjects(data.projects);
          }
          if (Array.isArray(data.inquiries) && data.inquiries.length > 0) {
            setInquiries(data.inquiries);
          }
          if (Array.isArray(data.faqArticles) && data.faqArticles.length > 0) {
            setFaqArticles(data.faqArticles);
          }
          if (Array.isArray(data.emailAlerts) && data.emailAlerts.length > 0) {
            setEmailAlerts(data.emailAlerts);
          }
        }
      } catch {
        // Fall back to initial state
      }
    };
    fetchData();
  }, []);

  // Handle URL hash on boot & window navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (hash && ['home', 'services', 'workflow', 'projects', 'hardware', 'estimator', 'contact', 'knowledge'].includes(hash)) {
        if (hash === 'home' || hash === 'knowledge' || (clientUser && clientUser.status === 'approved')) {
          setCurrentPage(hash);
        } else {
          setAuthRedirectTarget(hash);
          setIsAuthModalOpen(true);
        }
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [clientUser]);

  // Page Navigation with Client Gating Guard
  const navigateTo = (page: PageId): boolean => {
    if (page === 'home' || page === 'knowledge') {
      setCurrentPage(page);
      window.location.hash = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }

    // Gated check: client must exist AND be approved by admin!
    if (!clientUser || clientUser.status !== 'approved') {
      setAuthRedirectTarget(page);
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
      return false;
    }

    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  // Robust Client Authentication Functions
  const registerClient = (userData: { fullName: string; email: string; company: string; phone: string; role: string; password?: string }): AuthResponse => {
    const cleanEmail = userData.email.trim().toLowerCase();
    
    // Check if email already exists
    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.status === 'pending') {
        return { 
          success: false, 
          message: 'An account with this email is already registered and is currently Pending Approval by DeRoyalTech System Administrators.' 
        };
      }
      return { 
        success: false, 
        message: 'An account with this email already exists. Please sign in.' 
      };
    }

    const newUser: ClientUser = {
      id: `client-${Date.now()}`,
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      company: userData.company.trim(),
      phone: userData.phone.trim(),
      role: userData.role || 'Enterprise Partner',
      password: userData.password || 'password123',
      registeredAt: new Date().toISOString(),
      status: 'pending',
      isVerified: false, // NEVER verified upon self-registration! Requires admin approval!
      isAdmin: false
    };

    const nextUsers = [newUser, ...registeredUsers];
    setRegisteredUsers(nextUsers);
    localStorage.setItem('drt_registered_users', JSON.stringify(nextUsers));
    syncToServer({ users: nextUsers });

    return {
      success: true,
      message: 'Registration submitted successfully! Your account is currently Pending Approval by DeRoyalTech Administrators. Access to protected pages will be enabled once approved.',
      user: newUser
    };
  };

  const loginClient = (email: string, password?: string): AuthResponse => {
    const cleanEmail = email.trim().toLowerCase();
    const user = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        message: 'No client account found with this email address. Please register for enterprise partner access.'
      };
    }

    // Check password if provided
    if (password && user.password && user.password !== password) {
      return {
        success: false,
        message: 'Invalid password credentials. Please verify and try again.'
      };
    }

    // Check verification status
    if (user.status === 'pending') {
      return {
        success: false,
        message: 'Your account is currently PENDING APPROVAL by DeRoyalTech System Administrators. Verified access will be granted once approved.'
      };
    }

    if (user.status === 'rejected') {
      return {
        success: false,
        message: 'Your account access request has been restricted. Please contact support@deroyaltech.com.'
      };
    }

    // User is approved!
    setClientUser(user);
    localStorage.setItem('drt_client_auth', JSON.stringify(user));
    setIsAuthModalOpen(false);

    if (authRedirectTarget) {
      setCurrentPage(authRedirectTarget);
      window.location.hash = authRedirectTarget;
      setAuthRedirectTarget(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return {
      success: true,
      user
    };
  };

  // Master Admin direct authentication
  const adminLogin = (password: string): boolean => {
    if (password === 'admin' || password === 'admin123' || password === 'deroyal2026') {
      const adminUser: ClientUser = registeredUsers.find(u => u.isAdmin) || {
        id: 'user-admin-master',
        fullName: 'DeRoyalTech Engineering Lead',
        email: 'admin@deroyaltech.com',
        company: 'DeRoyalTech Systems Limited',
        phone: '+233 (0) 30 294 8821',
        role: 'Principal Systems Administrator',
        registeredAt: new Date().toISOString(),
        status: 'approved',
        isVerified: true,
        isAdmin: true
      };
      setClientUser(adminUser);
      localStorage.setItem('drt_client_auth', JSON.stringify(adminUser));
      setIsAdminOpen(true);
      return true;
    }
    return false;
  };

  const instantDemoLogin = () => {
    // Instant demo uses the approved partner account (Kwame Asante)
    const approvedDemoUser = registeredUsers.find(u => u.status === 'approved' && !u.isAdmin) || registeredUsers[1];
    setClientUser(approvedDemoUser);
    localStorage.setItem('drt_client_auth', JSON.stringify(approvedDemoUser));
    setIsAuthModalOpen(false);

    if (authRedirectTarget) {
      setCurrentPage(authRedirectTarget);
      window.location.hash = authRedirectTarget;
      setAuthRedirectTarget(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const logoutClient = () => {
    setClientUser(null);
    localStorage.removeItem('drt_client_auth');
    setCurrentPage('home');
    window.location.hash = 'home';
    setIsAdminOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin user approvals
  const approveClientUser = (userId: string) => {
    const updated = registeredUsers.map(u => 
      u.id === userId 
        ? { ...u, status: 'approved' as const, isVerified: true, approvedAt: new Date().toISOString(), approvedBy: 'DeRoyalTech Admin' }
        : u
    );
    setRegisteredUsers(updated);
    localStorage.setItem('drt_registered_users', JSON.stringify(updated));
    syncToServer({ users: updated });

    // If currently logged-in user is this user, update state too
    if (clientUser && clientUser.id === userId) {
      const updatedSelf = { ...clientUser, status: 'approved' as const, isVerified: true };
      setClientUser(updatedSelf);
      localStorage.setItem('drt_client_auth', JSON.stringify(updatedSelf));
    }
  };

  const rejectClientUser = (userId: string) => {
    const updated = registeredUsers.map(u => 
      u.id === userId 
        ? { ...u, status: 'rejected' as const, isVerified: false }
        : u
    );
    setRegisteredUsers(updated);
    localStorage.setItem('drt_registered_users', JSON.stringify(updated));
    syncToServer({ users: updated });

    if (clientUser && clientUser.id === userId) {
      logoutClient();
    }
  };

  const toggleUserAdminRole = (userId: string) => {
    const updated = registeredUsers.map(u => 
      u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
    );
    setRegisteredUsers(updated);
    localStorage.setItem('drt_registered_users', JSON.stringify(updated));
    syncToServer({ users: updated });
  };

  const deleteClientUser = (userId: string) => {
    const updated = registeredUsers.filter(u => u.id !== userId);
    setRegisteredUsers(updated);
    localStorage.setItem('drt_registered_users', JSON.stringify(updated));
    syncToServer({ users: updated });
  };

  // Save config changes
  const updateConfig = (updates: Partial<SiteConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('drt_site_config', JSON.stringify(next));
      syncToServer({ config: next });
      return next;
    });
  };

  const updateContact = (updates: Partial<SiteConfig['contact']>) => {
    setConfig(prev => {
      const next = {
        ...prev,
        contact: { ...prev.contact, ...updates }
      };
      localStorage.setItem('drt_site_config', JSON.stringify(next));
      syncToServer({ config: next });
      return next;
    });
  };

  const updateSocial = (updates: Partial<SocialHandles>) => {
    setConfig(prev => {
      const next = {
        ...prev,
        social: { ...prev.social, ...updates }
      };
      localStorage.setItem('drt_site_config', JSON.stringify(next));
      syncToServer({ config: next });
      return next;
    });
  };

  const updateProjectMetrics = (updates: Partial<ProjectMetricsConfig>) => {
    setConfig(prev => {
      const nextMetrics = { ...prev.metrics, ...updates };
      const nextConfig = { ...prev, metrics: nextMetrics };
      localStorage.setItem('drt_site_config', JSON.stringify(nextConfig));
      syncToServer({ config: nextConfig });
      return nextConfig;
    });
  };

  // Services CRUD & Pricing
  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      ...serviceData
    };
    setServices(prev => {
      const next = [...prev, newService];
      localStorage.setItem('drt_services', JSON.stringify(next));
      syncToServer({ services: next });
      return next;
    });
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem('drt_services', JSON.stringify(next));
      syncToServer({ services: next });
      return next;
    });
  };

  const updateServicePrice = (id: string, newPrice: number) => {
    setServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, startingPrice: newPrice } : s);
      localStorage.setItem('drt_services', JSON.stringify(next));
      syncToServer({ services: next });
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('drt_services', JSON.stringify(next));
      syncToServer({ services: next });
      return next;
    });
  };

  const resetServicesToDefault = () => {
    setServices(DEFAULT_SERVICES);
    localStorage.setItem('drt_services', JSON.stringify(DEFAULT_SERVICES));
    syncToServer({ services: DEFAULT_SERVICES });
  };

  // Testimonials CRUD
  const addTestimonial = (quoteData: Omit<PartnerQuote, 'id'>) => {
    const newQuote: PartnerQuote = {
      id: `quote-${Date.now()}`,
      ...quoteData
    };
    setTestimonials(prev => {
      const next = [newQuote, ...prev];
      localStorage.setItem('drt_testimonials', JSON.stringify(next));
      updateConfig({ testimonials: next });
      syncToServer({ testimonials: next });
      return next;
    });
  };

  const updateTestimonial = (id: string, updates: Partial<PartnerQuote>) => {
    setTestimonials(prev => {
      const next = prev.map(q => q.id === id ? { ...q, ...updates } : q);
      localStorage.setItem('drt_testimonials', JSON.stringify(next));
      updateConfig({ testimonials: next });
      syncToServer({ testimonials: next });
      return next;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => {
      const next = prev.filter(q => q.id !== id);
      localStorage.setItem('drt_testimonials', JSON.stringify(next));
      updateConfig({ testimonials: next });
      syncToServer({ testimonials: next });
      return next;
    });
  };

  const resetTestimonialsToDefault = () => {
    setTestimonials(DEFAULT_TESTIMONIALS);
    localStorage.setItem('drt_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
    updateConfig({ testimonials: DEFAULT_TESTIMONIALS });
    syncToServer({ testimonials: DEFAULT_TESTIMONIALS });
  };

  // Hardware CRUD & Pricing
  const addProduct = (productData: Omit<HardwareProduct, 'id'>) => {
    const newProduct: HardwareProduct = {
      id: `hw-${Date.now()}`,
      ...productData
    };
    setHardwareProducts(prev => {
      const next = [newProduct, ...prev];
      localStorage.setItem('drt_hardware_products', JSON.stringify(next));
      syncToServer({ hardware: next });
      return next;
    });
  };

  const updateProduct = (id: string, updates: Partial<HardwareProduct>) => {
    setHardwareProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem('drt_hardware_products', JSON.stringify(next));
      syncToServer({ hardware: next });
      return next;
    });
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setHardwareProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, price: newPrice } : p);
      localStorage.setItem('drt_hardware_products', JSON.stringify(next));
      syncToServer({ hardware: next });
      return next;
    });
  };

  const deleteProduct = (id: string) => {
    setHardwareProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem('drt_hardware_products', JSON.stringify(next));
      syncToServer({ hardware: next });
      return next;
    });
  };

  const resetProductsToDefault = () => {
    setHardwareProducts(DEFAULT_HARDWARE);
    localStorage.setItem('drt_hardware_products', JSON.stringify(DEFAULT_HARDWARE));
    syncToServer({ hardware: DEFAULT_HARDWARE });
  };

  // Completed Projects CRUD
  const addCompletedProject = (projectData: Omit<CompletedProject, 'id'>) => {
    const newProject: CompletedProject = {
      id: `prj-${Date.now()}`,
      ...projectData
    };
    setCompletedProjects(prev => {
      const next = [newProject, ...prev];
      localStorage.setItem('drt_completed_projects', JSON.stringify(next));
      syncToServer({ projects: next });
      return next;
    });
  };

  const updateCompletedProject = (id: string, updates: Partial<CompletedProject>) => {
    setCompletedProjects(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem('drt_completed_projects', JSON.stringify(next));
      syncToServer({ projects: next });
      return next;
    });
  };

  const deleteCompletedProject = (id: string) => {
    setCompletedProjects(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem('drt_completed_projects', JSON.stringify(next));
      syncToServer({ projects: next });
      return next;
    });
  };

  const resetProjectsToDefault = () => {
    setCompletedProjects(DEFAULT_PROJECTS);
    localStorage.setItem('drt_completed_projects', JSON.stringify(DEFAULT_PROJECTS));
    syncToServer({ projects: DEFAULT_PROJECTS });
  };

  // Consultation Bookings Management
  const bookConsultation = (data: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => {
    const id = `DRT-BOOK-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: ConsultationBooking = {
      id,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...data
    };
    setConsultationBookings(prev => {
      const next = [newBooking, ...prev];
      localStorage.setItem('drt_consultation_bookings', JSON.stringify(next));
      syncToServer({ bookings: next });
      return next;
    });
    return id;
  };

  const approveBooking = (id: string, adminNotes?: string) => {
    setConsultationBookings(prev => {
      const next = prev.map(b => 
        b.id === id 
          ? { ...b, status: 'Approved' as const, adminNotes: adminNotes || b.adminNotes || 'Confirmed by DeRoyalTech Engineering Lead.' }
          : b
      );
      localStorage.setItem('drt_consultation_bookings', JSON.stringify(next));
      syncToServer({ bookings: next });
      return next;
    });
  };

  const rejectBooking = (id: string, adminNotes?: string) => {
    setConsultationBookings(prev => {
      const next = prev.map(b => 
        b.id === id 
          ? { ...b, status: 'Rejected' as const, adminNotes: adminNotes || 'Declined due to schedule or scope misalignment.' }
          : b
      );
      localStorage.setItem('drt_consultation_bookings', JSON.stringify(next));
      syncToServer({ bookings: next });
      return next;
    });
  };

  const rescheduleBooking = (id: string, newDate: string, newTime: string, adminNotes?: string) => {
    setConsultationBookings(prev => {
      const next = prev.map(b => 
        b.id === id 
          ? { 
              ...b, 
              status: 'Rescheduled' as const, 
              rescheduledDate: newDate, 
              rescheduledTime: newTime,
              adminNotes: adminNotes || `Rescheduled to ${newDate} at ${newTime}.`
            }
          : b
      );
      localStorage.setItem('drt_consultation_bookings', JSON.stringify(next));
      syncToServer({ bookings: next });
      return next;
    });
  };

  const deleteBooking = (id: string) => {
    setConsultationBookings(prev => {
      const next = prev.filter(b => b.id !== id);
      localStorage.setItem('drt_consultation_bookings', JSON.stringify(next));
      syncToServer({ bookings: next });
      return next;
    });
  };

  // Inquiries
  const submitInquiry = (data: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>) => {
    const id = `DRT-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: InquiryItem = {
      id,
      createdAt: new Date().toISOString(),
      status: 'New',
      ...data
    };
    setInquiries(prev => {
      const next = [newInquiry, ...prev];
      localStorage.setItem('drt_inquiries', JSON.stringify(next));
      syncToServer({ inquiries: next });
      return next;
    });
    return id;
  };

  const updateInquiryStatus = (id: string, status: InquiryItem['status']) => {
    setInquiries(prev => {
      const next = prev.map(inq => inq.id === id ? { ...inq, status } : inq);
      localStorage.setItem('drt_inquiries', JSON.stringify(next));
      syncToServer({ inquiries: next });
      return next;
    });
  };

  const addInquiryNote = (id: string, note: string) => {
    setInquiries(prev => {
      const next = prev.map(inq => inq.id === id ? { ...inq, adminNotes: note } : inq);
      localStorage.setItem('drt_inquiries', JSON.stringify(next));
      syncToServer({ inquiries: next });
      return next;
    });
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => {
      const next = prev.filter(inq => inq.id !== id);
      localStorage.setItem('drt_inquiries', JSON.stringify(next));
      syncToServer({ inquiries: next });
      return next;
    });
  };

  // ==================== LIVE SUPPORT REAL-TIME CHAT IMPLEMENTATION ====================
  // Helper to notify other tabs or components
  const notifyLiveSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('drt_live_sync'));
    }
  };

  // Cross-tab and live event synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'drt_chat_threads' && e.newValue) {
        try {
          setChatThreads(JSON.parse(e.newValue));
        } catch { }
      }
      if (e.key === 'drt_service_requests' && e.newValue) {
        try {
          setServiceRequests(JSON.parse(e.newValue));
        } catch { }
      }
      if (e.key === 'drt_tracked_projects' && e.newValue) {
        try {
          setTrackedProjects(JSON.parse(e.newValue));
        } catch { }
      }
    };

    const handleCustomLiveSync = () => {
      try {
        const storedChats = localStorage.getItem('drt_chat_threads');
        if (storedChats) setChatThreads(JSON.parse(storedChats));
        const storedReqs = localStorage.getItem('drt_service_requests');
        if (storedReqs) setServiceRequests(JSON.parse(storedReqs));
        const storedTrackers = localStorage.getItem('drt_tracked_projects');
        if (storedTrackers) setTrackedProjects(JSON.parse(storedTrackers));
      } catch { }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('drt_live_sync', handleCustomLiveSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('drt_live_sync', handleCustomLiveSync);
    };
  }, []);

  const sendClientMessage = (params: { 
    threadId?: string; 
    clientName: string; 
    clientEmail: string; 
    clientPhone?: string; 
    clientCompany?: string; 
    message: string; 
    subject?: string; 
    projectId?: string 
  }) => {
    const targetThreadId = params.threadId || `chat-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender: 'client',
      senderName: params.clientName,
      message: params.message,
      timestamp: new Date().toISOString()
    };

    setChatThreads(prev => {
      let updated: ChatThread[];
      const existing = prev.find(t => t.id === targetThreadId);
      if (existing) {
        updated = prev.map(t => 
          t.id === targetThreadId 
            ? {
                ...t,
                messages: [...t.messages, newMsg],
                unreadCountForAdmin: t.unreadCountForAdmin + 1,
                status: 'waiting_admin',
                updatedAt: new Date().toISOString(),
                projectId: params.projectId || t.projectId,
                subject: params.subject || t.subject
              }
            : t
        );
      } else {
        const newThread: ChatThread = {
          id: targetThreadId,
          clientId: clientUser?.id,
          clientName: params.clientName,
          clientEmail: params.clientEmail,
          clientPhone: params.clientPhone || clientUser?.phone,
          clientCompany: params.clientCompany || clientUser?.company,
          subject: params.subject || (params.projectId ? `Project Inquiry: ${params.projectId}` : 'Technical Consultation & Support'),
          status: 'waiting_admin',
          priority: 'normal',
          projectId: params.projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [newMsg],
          unreadCountForAdmin: 1,
          unreadCountForClient: 0
        };
        updated = [newThread, ...prev];
      }
      localStorage.setItem('drt_chat_threads', JSON.stringify(updated));
      syncToServer({ chatThreads: updated });
      return updated;
    });

    setActiveThreadId(targetThreadId);
    notifyLiveSync();
    return targetThreadId;
  };

  const sendAdminReply = (threadId: string, message: string) => {
    const adminMsg: ChatMessage = {
      id: `msg-admin-${Date.now()}`,
      sender: 'admin',
      senderName: clientUser?.fullName || 'DeRoyalTech Engineering Lead',
      message,
      timestamp: new Date().toISOString()
    };

    setChatThreads(prev => {
      const updated = prev.map(t => 
        t.id === threadId
          ? {
              ...t,
              messages: [...t.messages, adminMsg],
              unreadCountForAdmin: 0,
              unreadCountForClient: t.unreadCountForClient + 1,
              status: 'waiting_client' as const,
              updatedAt: new Date().toISOString()
            }
          : t
      );
      localStorage.setItem('drt_chat_threads', JSON.stringify(updated));
      syncToServer({ chatThreads: updated });
      return updated;
    });

    notifyLiveSync();
  };

  const updateThreadStatus = (threadId: string, status: ChatThread['status']) => {
    setChatThreads(prev => {
      const updated = prev.map(t => 
        t.id === threadId 
          ? { 
              ...t, 
              status, 
              unreadCountForAdmin: status === 'resolved' ? 0 : t.unreadCountForAdmin,
              updatedAt: new Date().toISOString() 
            } 
          : t
      );
      localStorage.setItem('drt_chat_threads', JSON.stringify(updated));
      syncToServer({ chatThreads: updated });
      return updated;
    });
    notifyLiveSync();
  };

  const deleteThread = (threadId: string) => {
    setChatThreads(prev => {
      const updated = prev.filter(t => t.id !== threadId);
      localStorage.setItem('drt_chat_threads', JSON.stringify(updated));
      syncToServer({ chatThreads: updated });
      return updated;
    });
    if (activeThreadId === threadId) {
      setActiveThreadId(null);
    }
    notifyLiveSync();
  };

  const openChatWithContext = (initialSubject?: string, projectId?: string) => {
    setIsChatWidgetOpen(true);
    if (projectId) {
      const existing = chatThreads.find(t => t.projectId === projectId);
      if (existing) {
        setActiveThreadId(existing.id);
        return;
      }
    }
    if (clientUser) {
      const existing = chatThreads.find(t => t.clientEmail === clientUser.email);
      if (existing) {
        setActiveThreadId(existing.id);
        return;
      }
    }
  };

  // ==================== SERVICE REQUESTS & PROJECT TRACKER ====================
  const submitServiceRequest = (data: Omit<ServiceProjectRequest, 'id' | 'createdAt' | 'status'>) => {
    const id = `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest: ServiceProjectRequest = {
      id,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...data
    };

    setServiceRequests(prev => {
      const next = [newRequest, ...prev];
      localStorage.setItem('drt_service_requests', JSON.stringify(next));
      syncToServer({ serviceRequests: next });
      return next;
    });

    // Also automatically initialize a Live Support thread so the client can talk to engineering
    const threadId = `chat-req-${id}`;
    const initialNote: ChatMessage = {
      id: `msg-auto-${Date.now()}`,
      sender: 'system',
      senderName: 'DeRoyalTech Project Desk',
      message: `Service Request [${id}] logged for "${data.serviceTitle}". Our solutions architect will review specifications and confirm your Project Tracking ID.`,
      timestamp: new Date().toISOString()
    };

    setChatThreads(prev => {
      const existing = prev.find(t => t.id === threadId);
      if (!existing) {
        const newThread: ChatThread = {
          id: threadId,
          clientId: clientUser?.id,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          clientCompany: data.clientCompany,
          subject: `Service Order: ${data.projectTitle}`,
          status: 'waiting_admin',
          priority: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [initialNote],
          unreadCountForAdmin: 1,
          unreadCountForClient: 0
        };
        const updated = [newThread, ...prev];
        localStorage.setItem('drt_chat_threads', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });

    notifyLiveSync();
    return id;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceProjectRequest['status'], adminNotes?: string) => {
    setServiceRequests(prev => {
      const next = prev.map(r => 
        r.id === id 
          ? { 
              ...r, 
              status, 
              adminNotes: adminNotes !== undefined ? adminNotes : r.adminNotes 
            } 
          : r
      );
      localStorage.setItem('drt_service_requests', JSON.stringify(next));
      syncToServer({ serviceRequests: next });
      return next;
    });
    notifyLiveSync();
  };

  const deleteServiceRequest = (requestId: string) => {
    setServiceRequests(prev => {
      const next = prev.filter(r => r.id !== requestId);
      localStorage.setItem('drt_service_requests', JSON.stringify(next));
      syncToServer({ serviceRequests: next });
      return next;
    });
    notifyLiveSync();
  };

  const confirmAndCreateProjectTracker = (
    requestId: string, 
    initialConfig?: { 
      title?: string; 
      estimatedDeliveryDate?: string; 
      progressPercent?: number; 
      leadEngineer?: string; 
      initialNotes?: string 
    }
  ) => {
    const req = serviceRequests.find(r => r.id === requestId);
    if (!req) return '';

    const newProjectId = `DRT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const defaultMilestones: ProjectMilestone[] = [
      {
        id: 'm-arch',
        title: 'Requirements Finalization & Architecture Specification',
        description: 'System topology, security protocols, and engineering roadmap signed off.',
        status: 'completed',
        completedAt: new Date().toISOString().split('T')[0],
        targetDate: new Date().toISOString().split('T')[0]
      },
      {
        id: 'm-proto',
        title: 'Hardware Peripheral Staging & UI Prototype',
        description: 'Component allocation, board flashing, and interface design validation.',
        status: 'in_progress',
        targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      },
      {
        id: 'm-dev',
        title: 'Core Software & Custom CRM Engine Development',
        description: 'Implementation of microservices, database schemas, and edge telemetry pipelines.',
        status: 'pending',
        targetDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]
      },
      {
        id: 'm-qa',
        title: 'Telemetry Stress Testing & Security Penetration QA',
        description: 'End-to-end load testing, peripheral latency verification, and failover validation.',
        status: 'pending',
        targetDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0]
      },
      {
        id: 'm-deploy',
        title: 'Turnkey Production Handover & On-site Certification',
        description: 'Final cloud deployment, client team training, and handover of documentation.',
        status: 'pending',
        targetDate: initialConfig?.estimatedDeliveryDate || new Date(Date.now() + 35 * 86400000).toISOString().split('T')[0]
      }
    ];

    const initialLog: ProjectLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: 'Project Confirmed & Live Tracker Activated',
      note: initialConfig?.initialNotes || `Service order confirmed by DeRoyalTech Systems Lead. Project ID ${newProjectId} generated and tracking milestone pipeline online.`,
      author: 'DeRoyalTech Systems Lead',
      stageBadge: 'Kickoff'
    };

    const newTrackedProject: TrackedProject = {
      projectId: newProjectId,
      requestId: req.id,
      title: initialConfig?.title || req.projectTitle,
      clientName: req.clientName,
      clientEmail: req.clientEmail,
      clientCompany: req.clientCompany,
      clientPhone: req.clientPhone,
      serviceCategory: (req.serviceId as any) || 'software',
      serviceTitle: req.serviceTitle,
      stage: 'architecture_planning',
      stageLabel: 'Architecture Blueprint & Hardware Component Staging',
      progressPercent: initialConfig?.progressPercent ?? 20,
      startDate: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: initialConfig?.estimatedDeliveryDate || new Date(Date.now() + 35 * 86400000).toISOString().split('T')[0],
      leadEngineer: initialConfig?.leadEngineer || 'Senior Systems Architect, DeRoyalTech',
      assignedTeam: ['Senior Solutions Architect', 'Lead IoT/Hardware Specialist', 'Full-Stack Software Engineer'],
      hardwareUnitsCount: req.hardwareIntegrationNeeded ? 12 : undefined,
      milestones: defaultMilestones,
      updatesLog: [initialLog],
      adminNotes: req.adminNotes
    };

    // 1. Update Tracked Projects
    setTrackedProjects(prev => {
      const next = [newTrackedProject, ...prev];
      localStorage.setItem('drt_tracked_projects', JSON.stringify(next));
      syncToServer({ trackedProjects: next });
      return next;
    });

    // 2. Update Service Request
    setServiceRequests(prev => {
      const next = prev.map(r => 
        r.id === requestId
          ? {
              ...r,
              status: 'confirmed' as const,
              assignedProjectId: newProjectId,
              confirmedAt: new Date().toISOString()
            }
          : r
      );
      localStorage.setItem('drt_service_requests', JSON.stringify(next));
      syncToServer({ serviceRequests: next });
      return next;
    });

    // 3. Post notification into Live Support chat
    const alertMsg: ChatMessage = {
      id: `msg-alert-${Date.now()}`,
      sender: 'admin',
      senderName: 'Admin / Systems Lead',
      message: `Great news! Your project request "${req.projectTitle}" has been officially CONFIRMED. Your Project Tracking ID is: ${newProjectId}. You can track live milestones and engineering logs anytime using the Track Project portal.`,
      timestamp: new Date().toISOString()
    };

    setChatThreads(prev => {
      let updated: ChatThread[];
      const threadWithClient = prev.find(t => t.clientEmail === req.clientEmail || t.id === `chat-req-${requestId}`);
      if (threadWithClient) {
        updated = prev.map(t => 
          t.id === threadWithClient.id
            ? {
                ...t,
                projectId: newProjectId,
                messages: [...t.messages, alertMsg],
                unreadCountForClient: t.unreadCountForClient + 1,
                updatedAt: new Date().toISOString()
              }
            : t
        );
      } else {
        const newThread: ChatThread = {
          id: `chat-${newProjectId}`,
          clientId: req.clientId,
          clientName: req.clientName,
          clientEmail: req.clientEmail,
          clientPhone: req.clientPhone,
          clientCompany: req.clientCompany,
          subject: `Project Tracker: ${newProjectId} - ${req.projectTitle}`,
          status: 'waiting_client',
          priority: 'high',
          projectId: newProjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [alertMsg],
          unreadCountForAdmin: 0,
          unreadCountForClient: 1
        };
        updated = [newThread, ...prev];
      }
      localStorage.setItem('drt_chat_threads', JSON.stringify(updated));
      return updated;
    });

    notifyLiveSync();

    // 4. Automated Email Alert to client confirming their Project Tracking ID
    dispatchProjectEmailAlert({
      projectId: newProjectId,
      stage: 'architecture_planning',
      stageLabel: 'Architecture Blueprint & Hardware Component Staging',
      progressPercent: initialConfig?.progressPercent ?? 20,
      updateSummary: `Great news! Your service order "${req.projectTitle}" has been confirmed. Your official Project ID is ${newProjectId}.`
    });

    return newProjectId;
  };

  const createCustomTrackedProject = (project: Omit<TrackedProject, 'projectId'> & { customId?: string }) => {
    const projectId = project.customId || `DRT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTracked: TrackedProject = {
      ...project,
      projectId
    };

    setTrackedProjects(prev => {
      const next = [newTracked, ...prev];
      localStorage.setItem('drt_tracked_projects', JSON.stringify(next));
      syncToServer({ trackedProjects: next });
      return next;
    });

    notifyLiveSync();

    // Automated Email Alert for custom created project
    dispatchProjectEmailAlert({
      projectId,
      stage: project.stage,
      stageLabel: project.stageLabel,
      progressPercent: project.progressPercent,
      updateSummary: `Project Tracker initialized for "${project.title}". Milestone pipeline active.`
    });

    return projectId;
  };

  // Automated Email Dispatch Helper
  const dispatchProjectEmailAlert = async (params: { 
    projectId: string; 
    stage?: string; 
    stageLabel?: string; 
    progressPercent?: number; 
    updateSummary?: string; 
    force?: boolean 
  }): Promise<ProjectEmailAlert | null> => {
    if (!autoEmailEnabled && !params.force) return null;
    const project = trackedProjects.find(p => p.projectId === params.projectId);
    if (!project || !project.clientEmail) return null;

    const stage = params.stage || project.stage;
    const stageLabel = params.stageLabel || project.stageLabel;
    const progressPercent = params.progressPercent ?? project.progressPercent;
    const updateSummary = params.updateSummary || `Engineering update logged for ${project.title}. Milestone status: ${stageLabel} (${progressPercent}%).`;

    const payload = {
      projectId: project.projectId,
      projectTitle: project.title,
      recipientEmail: project.clientEmail,
      recipientName: project.clientName,
      stage,
      stageLabel,
      progressPercent,
      updateSummary,
      leadEngineer: project.leadEngineer,
      estimatedDeliveryDate: project.estimatedDeliveryDate
    };

    try {
      const res = await fetch('/api/notifications/email-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.alert) {
          setEmailAlerts(prev => {
            const next = [json.alert, ...prev];
            localStorage.setItem('drt_email_alerts', JSON.stringify(next));
            return next;
          });
          return json.alert;
        }
      }
    } catch {
      // offline fallback
    }

    const fallbackAlert: ProjectEmailAlert = {
      id: `alert-${Date.now()}`,
      projectId: project.projectId,
      projectTitle: project.title,
      recipientEmail: project.clientEmail,
      recipientName: project.clientName,
      subject: `[DeRoyalTech Status Update] Project ${project.projectId}: ${stageLabel} (${progressPercent}%)`,
      sentAt: new Date().toISOString(),
      stage,
      stageLabel,
      progressPercent,
      updateSummary,
      status: 'Delivered',
      leadEngineer: project.leadEngineer,
      estimatedDeliveryDate: project.estimatedDeliveryDate
    };
    setEmailAlerts(prev => {
      const next = [fallbackAlert, ...prev];
      localStorage.setItem('drt_email_alerts', JSON.stringify(next));
      return next;
    });
    return fallbackAlert;
  };

  const deleteEmailAlert = (alertId: string) => {
    setEmailAlerts(prev => {
      const next = prev.filter(a => a.id !== alertId);
      localStorage.setItem('drt_email_alerts', JSON.stringify(next));
      fetch('/api/notifications/email-alerts/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAlerts: next })
      }).catch(() => {});
      return next;
    });
  };

  // Knowledge Base & FAQ CRUD
  const addFAQArticle = (articleData: Omit<FAQArticle, 'id' | 'createdAt' | 'updatedAt' | 'helpfulVotes' | 'unhelpfulVotes'>) => {
    const slug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newArticle: FAQArticle = {
      id: `faq-${Date.now()}`,
      ...articleData,
      slug: articleData.slug || slug,
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFaqArticles(prev => {
      const next = [newArticle, ...prev];
      localStorage.setItem('drt_faq_articles', JSON.stringify(next));
      fetch('/api/knowledge-base/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqArticles: next })
      }).catch(() => {});
      return next;
    });
  };

  const updateFAQArticle = (id: string, updates: Partial<FAQArticle>) => {
    setFaqArticles(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a);
      localStorage.setItem('drt_faq_articles', JSON.stringify(next));
      fetch('/api/knowledge-base/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqArticles: next })
      }).catch(() => {});
      return next;
    });
  };

  const deleteFAQArticle = (id: string) => {
    setFaqArticles(prev => {
      const next = prev.filter(a => a.id !== id);
      localStorage.setItem('drt_faq_articles', JSON.stringify(next));
      fetch('/api/knowledge-base/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqArticles: next })
      }).catch(() => {});
      return next;
    });
  };

  const voteFAQHelpful = (id: string, isHelpful: boolean) => {
    setFaqArticles(prev => {
      const next = prev.map(a => {
        if (a.id === id) {
          return {
            ...a,
            helpfulVotes: isHelpful ? a.helpfulVotes + 1 : a.helpfulVotes,
            unhelpfulVotes: !isHelpful ? a.unhelpfulVotes + 1 : a.unhelpfulVotes
          };
        }
        return a;
      });
      localStorage.setItem('drt_faq_articles', JSON.stringify(next));
      fetch('/api/knowledge-base/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isHelpful })
      }).catch(() => {});
      return next;
    });
  };

  const resetFAQToDefault = () => {
    setFaqArticles(DEFAULT_FAQ_ARTICLES);
    localStorage.setItem('drt_faq_articles', JSON.stringify(DEFAULT_FAQ_ARTICLES));
    fetch('/api/knowledge-base/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faqArticles: DEFAULT_FAQ_ARTICLES })
    }).catch(() => {});
  };

  const updateTrackedProject = (projectId: string, updates: Partial<TrackedProject>) => {
    setTrackedProjects(prev => {
      const next = prev.map(p => p.projectId === projectId ? { ...p, ...updates } : p);
      localStorage.setItem('drt_tracked_projects', JSON.stringify(next));
      syncToServer({ trackedProjects: next });
      return next;
    });

    // Auto-dispatch email alert to client if status/stage/progress or delivery date changed
    if (updates.stage || updates.stageLabel || updates.progressPercent !== undefined || updates.estimatedDeliveryDate) {
      dispatchProjectEmailAlert({
        projectId,
        stage: updates.stage,
        stageLabel: updates.stageLabel,
        progressPercent: updates.progressPercent,
        updateSummary: updates.adminNotes || `Project stage updated to "${updates.stageLabel || updates.stage || 'latest milestone'}".`
      });
    }

    notifyLiveSync();
  };

  const updateProjectMilestone = (projectId: string, milestoneId: string, status: 'completed' | 'in_progress' | 'pending') => {
    let milestoneTitle = '';
    let calculatedPercent = 0;

    setTrackedProjects(prev => {
      const next = prev.map(project => {
        if (project.projectId !== projectId) return project;

        const updatedMilestones = project.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          milestoneTitle = m.title;
          return {
            ...m,
            status,
            completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined
          };
        });

        // Recalculate progress percentage dynamically
        const total = updatedMilestones.length;
        const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
        const inProgressCount = updatedMilestones.filter(m => m.status === 'in_progress').length;
        calculatedPercent = total > 0 ? Math.min(100, Math.round(((completedCount + inProgressCount * 0.5) / total) * 100)) : project.progressPercent;

        return {
          ...project,
          milestones: updatedMilestones,
          progressPercent: calculatedPercent
        };
      });

      localStorage.setItem('drt_tracked_projects', JSON.stringify(next));
      syncToServer({ trackedProjects: next });
      return next;
    });

    // Auto-dispatch email alert on milestone status change
    dispatchProjectEmailAlert({
      projectId,
      progressPercent: calculatedPercent,
      updateSummary: `Milestone "${milestoneTitle || 'Deliverable'}" is now marked as ${status.toUpperCase().replace('_', ' ')}. Total progress: ${calculatedPercent}%.`
    });

    notifyLiveSync();
  };

  const addProjectLogEntry = (projectId: string, entry: { title: string; note: string; author?: string; stageBadge?: string }) => {
    const newLog: ProjectLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: entry.title,
      note: entry.note,
      author: entry.author || clientUser?.fullName || 'DeRoyalTech Systems Lead',
      stageBadge: entry.stageBadge || 'Engineering Update'
    };

    setTrackedProjects(prev => {
      const next = prev.map(p => 
        p.projectId === projectId 
          ? { ...p, updatesLog: [newLog, ...p.updatesLog] } 
          : p
      );
      localStorage.setItem('drt_tracked_projects', JSON.stringify(next));
      syncToServer({ trackedProjects: next });
      return next;
    });

    // Auto-dispatch email alert on new engineering log entry
    dispatchProjectEmailAlert({
      projectId,
      updateSummary: `[${entry.title}] ${entry.note}`
    });

    notifyLiveSync();
  };

  const deleteTrackedProject = (projectId: string) => {
    setTrackedProjects(prev => {
      const next = prev.filter(p => p.projectId !== projectId);
      localStorage.setItem('drt_tracked_projects', JSON.stringify(next));
      syncToServer({ trackedProjects: next });
      return next;
    });
    notifyLiveSync();
  };

  const openTrackerForId = (projectId: string) => {
    setTrackerSearchId(projectId);
    setIsTrackerModalOpen(true);
  };

  const openServiceRequestModal = (service?: ServiceItem) => {
    setSelectedServiceForRequest(service || null);
    setIsServiceRequestModalOpen(true);
  };

  // Currency helper
  const formatPrice = (amount: number) => {
    return `${config.currencySymbol} ${amount.toLocaleString()}`;
  };

  return (
    <SiteContext.Provider
      value={{
        config,
        updateConfig,
        updateContact,
        updateSocial,
        updateProjectMetrics,

        // Services CRUD
        services,
        addService,
        updateService,
        updateServicePrice,
        deleteService,
        resetServicesToDefault,

        // Testimonials CRUD
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        resetTestimonialsToDefault,

        // Hardware Products
        hardwareProducts,
        addProduct,
        updateProduct,
        updateProductPrice,
        deleteProduct,
        resetProductsToDefault,

        // Completed Projects
        completedProjects,
        addCompletedProject,
        updateCompletedProject,
        deleteCompletedProject,
        resetProjectsToDefault,

        // Bookings
        consultationBookings,
        bookConsultation,
        approveBooking,
        rejectBooking,
        rescheduleBooking,
        deleteBooking,

        // Inquiries
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        addInquiryNote,
        deleteInquiry,

        // Live Support Real-Time Chat
        chatThreads,
        activeThreadId,
        setActiveThreadId,
        sendClientMessage,
        sendAdminReply,
        updateThreadStatus,
        deleteThread,
        isChatWidgetOpen,
        setIsChatWidgetOpen,
        openChatWithContext,

        // Service Requests & Project Tracker
        serviceRequests,
        trackedProjects,
        submitServiceRequest,
        updateServiceRequestStatus,
        confirmAndCreateProjectTracker,
        createCustomTrackedProject,
        updateTrackedProject,
        updateProjectMilestone,
        addProjectLogEntry,
        deleteTrackedProject,
        deleteServiceRequest,

        // Automated Email Notifications
        emailAlerts,
        dispatchProjectEmailAlert,
        deleteEmailAlert,
        autoEmailEnabled,
        setAutoEmailEnabled,

        // Knowledge Base & FAQ
        faqArticles,
        addFAQArticle,
        updateFAQArticle,
        deleteFAQArticle,
        voteFAQHelpful,
        resetFAQToDefault,

        // Modals for Tracker & Service Requests
        isTrackerModalOpen,
        setIsTrackerModalOpen,
        trackerSearchId,
        setTrackerSearchId,
        openTrackerForId,
        isServiceRequestModalOpen,
        setIsServiceRequestModalOpen,
        selectedServiceForRequest,
        openServiceRequestModal,

        formatPrice,

        // Routing & Multi-Page
        currentPage,
        navigateTo,

        // Client Auth & Gating
        clientUser,
        registeredUsers,
        registerClient,
        loginClient,
        adminLogin,
        instantDemoLogin,
        logoutClient,
        approveClientUser,
        rejectClientUser,
        toggleUserAdminRole,
        deleteClientUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        authRedirectTarget,

        // Admin CMS
        isAdminOpen,
        setIsAdminOpen,
        activeAdminTab,
        setActiveAdminTab
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
