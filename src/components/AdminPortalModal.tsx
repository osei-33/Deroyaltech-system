import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Settings, 
  Image, 
  Phone, 
  Coins, 
  Cpu, 
  FolderKanban, 
  Inbox, 
  Sliders, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Film,
  Share2,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  Quote,
  BarChart3,
  Layers,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Headphones,
  Activity,
  BookOpen,
  FileText,
  Megaphone,
  Globe,
  PenTool,
  Zap,
  UserCog,
  Percent
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { 
  HardwareProduct, 
  CompletedProject, 
  HardwareCategory, 
  SocialHandles, 
  PartnerQuote,
  ServiceItem,
  ServiceCategory,
  ConsultationBooking,
  ClientUser,
  VisitorAnnouncement,
  PageId
} from '../types/index.ts';
import { DEFAULT_LOGO } from '../data/companyData.ts';
import { AdminLiveSupportTab } from './admin/tabs/AdminLiveSupportTab.tsx';
import { AdminProjectTrackerTab } from './admin/tabs/AdminProjectTrackerTab.tsx';
import { AdminKnowledgeBaseTab } from './admin/tabs/AdminKnowledgeBaseTab.tsx';
import { AdminLettersTab } from './admin/tabs/AdminLettersTab.tsx';
import { AdminTeamTab } from './admin/tabs/AdminTeamTab.tsx';
import { AdminProfileTab } from './admin/tabs/AdminProfileTab.tsx';
import { AdminSeoTab } from './admin/tabs/AdminSeoTab.tsx';
import { AdminNegotiationsTab } from './admin/tabs/AdminNegotiationsTab.tsx';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 
  | 'services' 
  | 'negotiations'
  | 'support'
  | 'tracker'
  | 'knowledge'
  | 'letters'
  | 'team'
  | 'profile'
  | 'seo'
  | 'announcement'
  | 'testimonials' 
  | 'metrics' 
  | 'bookings' 
  | 'users' 
  | 'inquiries' 
  | 'hardware' 
  | 'projects' 
  | 'branding' 
  | 'contact' 
  | 'social' 
  | 'currency' 
  | 'overlays';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const { 
    config, 
    updateConfig, 
    updateContact,
    updateSocial,
    updateProjectMetrics,
    formatPrice,
    navigateTo,
    // Services
    services,
    addService,
    updateService,
    updateServicePrice,
    deleteService,
    resetServicesToDefault,
    // Testimonials
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    resetTestimonialsToDefault,
    // Hardware
    hardwareProducts,
    addProduct,
    updateProduct,
    updateProductPrice,
    deleteProduct,
    resetProductsToDefault,
    // Projects
    completedProjects,
    addCompletedProject,
    updateCompletedProject,
    deleteCompletedProject,
    resetProjectsToDefault,
    // Bookings
    consultationBookings,
    approveBooking,
    rejectBooking,
    rescheduleBooking,
    deleteBooking,
    // Users & Access Guard
    registeredUsers,
    approveClientUser,
    rejectClientUser,
    toggleUserAdminRole,
    deleteClientUser,
    // Inquiries
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    // Live Support & Tracker
    chatThreads,
    serviceRequests,
    trackedProjects,
    // Knowledge Base
    faqArticles,
    // Letters & Team Directory
    letters,
    teamMembers,
    revokeAdminSession
  } = useSite();

  const [activeTab, setActiveTab] = useState<AdminTab>('services');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Changes saved successfully and propagated across the website in real time!');

  const unreadSupportCount = chatThreads.filter(t => t.status === 'waiting_admin' || (t.unreadCountForAdmin > 0)).length;
  const pendingServiceOrdersCount = serviceRequests.filter(r => r.status === 'pending').length;

  // Local form states
  const [brandingForm, setBrandingForm] = useState({
    logoUrl: config.logoUrl,
    companyName: config.contact.companyName,
    tagline: config.contact.tagline,
    heroHeadline: config.heroHeadline,
    heroSubtitle: config.heroSubtitle
  });

  const [contactForm, setContactForm] = useState({
    phonePrimary: config.contact.phonePrimary,
    phoneSecondary: config.contact.phoneSecondary,
    whatsappNumber: config.contact.whatsappNumber,
    emailGeneral: config.contact.emailGeneral,
    emailSales: config.contact.emailSales,
    emailSupport: config.contact.emailSupport,
    physicalAddress: config.contact.physicalAddress,
    cityCountry: config.contact.cityCountry,
    businessHours: config.contact.businessHours
  });

  const [socialForm, setSocialForm] = useState<SocialHandles>({
    whatsapp: config.social.whatsapp || '+233245901284',
    facebook: config.social.facebook || 'https://facebook.com/deroyaltech',
    tiktok: config.social.tiktok || 'https://tiktok.com/@deroyaltech',
    instagram: config.social.instagram || 'https://instagram.com/deroyaltech',
    linkedin: config.social.linkedin || 'https://linkedin.com/company/deroyaltech-systems'
  });

  const [currencyForm, setCurrencyForm] = useState({
    currencySymbol: config.currencySymbol,
    currencyCode: config.currencyCode
  });

  // Metrics form
  const [metricsForm, setMetricsForm] = useState({
    projectsCompleted: config.metrics?.projectsCompleted ?? 86,
    clientSatisfactionRate: config.metrics?.clientSatisfactionRate ?? 99.4,
    linesOfCodeWritten: config.metrics?.linesOfCodeWritten ?? '1.4M+',
    uptimeSla: config.metrics?.uptimeSla ?? 99.99,
    hardwareNodesDeployed: config.metrics?.hardwareNodesDeployed ?? 2400
  });

  // Re-sync local form states ONLY when modal opens, preventing background polling from wiping active typing
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current && config) {
      setBrandingForm({
        logoUrl: config.logoUrl || '',
        companyName: config.contact?.companyName || '',
        tagline: config.contact?.tagline || '',
        heroHeadline: config.heroHeadline || '',
        heroSubtitle: config.heroSubtitle || ''
      });
      setContactForm({
        phonePrimary: config.contact?.phonePrimary || '',
        phoneSecondary: config.contact?.phoneSecondary || '',
        whatsappNumber: config.contact?.whatsappNumber || '',
        emailGeneral: config.contact?.emailGeneral || '',
        emailSales: config.contact?.emailSales || '',
        emailSupport: config.contact?.emailSupport || '',
        physicalAddress: config.contact?.physicalAddress || '',
        cityCountry: config.contact?.cityCountry || '',
        businessHours: config.contact?.businessHours || ''
      });
      setSocialForm({
        whatsapp: config.social?.whatsapp || '+233245901284',
        facebook: config.social?.facebook || 'https://facebook.com/deroyaltech',
        tiktok: config.social?.tiktok || 'https://tiktok.com/@deroyaltech',
        instagram: config.social?.instagram || 'https://instagram.com/deroyaltech',
        linkedin: config.social?.linkedin || 'https://linkedin.com/company/deroyaltech'
      });
      setCurrencyForm({
        currencySymbol: config.currencySymbol || 'GH₵',
        currencyCode: config.currencyCode || 'GHS'
      });
      setMetricsForm({
        projectsCompleted: config.metrics?.projectsCompleted ?? 86,
        clientSatisfactionRate: config.metrics?.clientSatisfactionRate ?? 99.4,
        linesOfCodeWritten: config.metrics?.linesOfCodeWritten ?? '1.4M+',
        uptimeSla: config.metrics?.uptimeSla ?? 99.99,
        hardwareNodesDeployed: config.metrics?.hardwareNodesDeployed ?? 2400
      });
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, config]);

  // Visitor Announcement State & Handlers
  const [announcementSavedToast, setAnnouncementSavedToast] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState<VisitorAnnouncement>(() => ({
    enabled: config.announcement?.enabled ?? true,
    badgeText: config.announcement?.badgeText ?? 'Ghana DevOps 2026',
    title: config.announcement?.title ?? 'Accra Edge Nodes & Hybrid Cloud Infrastructure Live',
    message: config.announcement?.message ?? 'DeRoyalTech Systems has activated multi-region failover across Accra and Spintex data corridors.',
    ctaText: config.announcement?.ctaText ?? 'Schedule Consultation',
    ctaPage: config.announcement?.ctaPage ?? 'consultation'
  }));

  useEffect(() => {
    if (config?.announcement) {
      setAnnouncementForm({
        enabled: config.announcement.enabled ?? true,
        badgeText: config.announcement.badgeText || 'Ghana DevOps 2026',
        title: config.announcement.title || 'Accra Edge Nodes & Hybrid Cloud Infrastructure Live',
        message: config.announcement.message || 'DeRoyalTech Systems has activated multi-region failover across Accra and Spintex data corridors.',
        ctaText: config.announcement.ctaText || 'Schedule Consultation',
        ctaPage: config.announcement.ctaPage || 'consultation'
      });
    }
  }, [config.announcement, isOpen]);

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({ announcement: announcementForm });
    setAnnouncementSavedToast(true);
    setTimeout(() => setAnnouncementSavedToast(false), 2500);
  };

  // Quick price map for hardware & services
  const [quickServicePriceMap, setQuickServicePriceMap] = useState<Record<string, number>>({});
  const [quickHardwarePriceMap, setQuickHardwarePriceMap] = useState<Record<string, number>>({});

  // Service form
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Omit<ServiceItem, 'id'>>({
    number: '07',
    category: 'software',
    title: '',
    shortDesc: '',
    fullDesc: '',
    iconName: 'Code',
    startingPrice: 12000,
    keyFeatures: ['Custom Enterprise Architecture', 'Automated QA & CI/CD', 'Ghana Local Cloud Sync', '24/7 SLA Support'],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    deliverables: ['Production Web Portal', 'API Integration', 'Full Admin CMS'],
    businessOutcome: '+140% Operational Efficiency'
  });

  // Testimonial form
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Omit<PartnerQuote, 'id'>>({
    clientName: '',
    clientRole: '',
    company: '',
    quote: '',
    projectScope: 'Custom Enterprise ERP & Cloud Infrastructure',
    metricResult: '+150% Operational Velocity',
    rating: 5,
    industry: 'Enterprise Technology',
    date: '2026-03',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  // Rescheduling modal state
  const [reschedulingBookingId, setReschedulingBookingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM - 11:00 AM GMT');
  const [rescheduleNote, setRescheduleNote] = useState('');

  // New hardware modal state
  const [editingHardwareId, setEditingHardwareId] = useState<string | null>(null);
  const [isAddingHardware, setIsAddingHardware] = useState(false);
  const [hardwareForm, setHardwareForm] = useState<Omit<HardwareProduct, 'id'>>({
    name: '',
    category: 'workstations',
    sku: 'DRT-HW-001',
    price: 15000,
    rating: 5.0,
    tagline: '',
    specs: {
      Processor: 'High-Density Compute',
      Memory: '32GB DDR5',
      Storage: '1TB NVMe Gen 4'
    },
    stockStatus: 'In Stock',
    warranty: '3-Year Enterprise Warranty in Ghana',
    integrationReady: 'Native DeRoyalTech API & CRM Sync',
    description: ''
  });

  // New project modal state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<CompletedProject, 'id'>>({
    title: '',
    client: '',
    industry: 'Logistics',
    category: 'crm',
    completionDate: 'November 2026',
    summary: '',
    liveUrl: 'https://client-preview.deroyaltech.com',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    deliverables: ['Custom Web Portal', 'Cloud DevOps Architecture'],
    metrics: [{ label: 'Performance Gain', value: '+120%' }],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    verifiedDeliveryBadge: 'Production Live in Ghana',
    clientCountry: 'Ghana'
  });

  if (!isOpen) return null;

  const triggerToast = (msg?: string) => {
    if (msg) setSuccessMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      logoUrl: brandingForm.logoUrl,
      heroHeadline: brandingForm.heroHeadline,
      heroSubtitle: brandingForm.heroSubtitle,
      contact: {
        ...config.contact,
        companyName: brandingForm.companyName,
        tagline: brandingForm.tagline
      }
    });
    triggerToast('Brand configuration updated successfully!');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(contactForm);
    triggerToast('Contact details & office location updated!');
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocial(socialForm);
    triggerToast('Social media links and vector handles updated!');
  };

  const handleSaveCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(currencyForm);
    triggerToast('Currency configuration updated!');
  };

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMetrics(metricsForm);
    triggerToast('Project metrics & counters updated live on the Projects page!');
  };

  // Services handlers
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceId) {
      updateService(editingServiceId, serviceForm);
      setEditingServiceId(null);
    } else {
      addService(serviceForm);
      setIsAddingService(false);
    }
    triggerToast('Service & pricing saved successfully!');
  };

  const handleQuickServicePriceChange = (serviceId: string) => {
    const newPrice = quickServicePriceMap[serviceId];
    if (newPrice !== undefined && !isNaN(newPrice) && newPrice >= 0) {
      updateServicePrice(serviceId, newPrice);
      triggerToast('Service starting price updated!');
    }
  };

  // Testimonial handlers
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonialId) {
      updateTestimonial(editingTestimonialId, testimonialForm);
      setEditingTestimonialId(null);
    } else {
      addTestimonial(testimonialForm);
      setIsAddingTestimonial(false);
    }
    triggerToast('Partner testimonial saved! Real-time slider updated on homepage.');
  };

  // Hardware handlers
  const handleSaveHardware = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHardwareId) {
      updateProduct(editingHardwareId, hardwareForm);
      setEditingHardwareId(null);
    } else {
      addProduct(hardwareForm);
      setIsAddingHardware(false);
    }
    triggerToast('Hardware catalog item saved!');
  };

  const handleQuickHardwarePriceChange = (productId: string) => {
    const newPrice = quickHardwarePriceMap[productId];
    if (newPrice !== undefined && !isNaN(newPrice) && newPrice >= 0) {
      updateProductPrice(productId, newPrice);
      triggerToast('Hardware price updated in Ghanaian Cedis (GH₵)!');
    }
  };

  // Project handlers
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProjectId) {
      updateCompletedProject(editingProjectId, projectForm);
      setEditingProjectId(null);
    } else {
      addCompletedProject(projectForm);
      setIsAddingProject(false);
    }
    triggerToast('Completed project showcase saved!');
  };

  // Reschedule execution
  const handleConfirmReschedule = () => {
    if (!reschedulingBookingId || !rescheduleDate) return;
    rescheduleBooking(reschedulingBookingId, rescheduleDate, rescheduleTime, rescheduleNote);
    setReschedulingBookingId(null);
    setRescheduleDate('');
    setRescheduleNote('');
    triggerToast('Consultation rescheduled and notification status updated!');
  };

  const pendingUsersCount = registeredUsers.filter(u => u.status === 'pending').length;
  const pendingBookingsCount = consultationBookings.filter(b => b.status === 'Pending').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  DeRoyalTech Administration & CMS Engine
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                  No-Code Live Sync
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded">
                  Currency: GH₵
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full site governance: Service pricing, partner testimonials, project metrics, client approvals, and consultation dispatch.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close admin panel"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between transition-all">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successMessage}
            </span>
          </div>
        )}

        {/* Quick Action Command Center */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1.5 pl-1 pr-2 border-r border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Quick Actions:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('letters')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'letters'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>✍️ Official Letters</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              <span>🖋️ Profile & Signature</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'seo'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>🌐 Dynamic Sitemap & SEO</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('negotiations')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'negotiations'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <span>🏷️ Price Negotiations & Margins</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hardware')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'hardware'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-orange-400" />
              <span>⚡ Hardware & Demo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'support'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span>💬 Live Support {unreadSupportCount > 0 ? `(${unreadSupportCount})` : ''}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('announcement')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'announcement'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span>📢 Announcement</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'tracker'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>📈 Milestone Tracker</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                activeTab === 'team'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>👥 Team</span>
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar Navigation */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-950/70 border-r border-slate-200 dark:border-slate-800 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0 text-xs font-medium">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 hidden md:block">
              Core Operations
            </div>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Services & Pricing (GH₵)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('negotiations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'negotiations'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-500" />
                <span>Price Negotiations & Margins</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-mono font-bold">
                {config.globalPriceAdjustmentPercent !== undefined && config.globalPriceAdjustmentPercent !== 0 
                  ? `${config.globalPriceAdjustmentPercent > 0 ? '+' : ''}${config.globalPriceAdjustmentPercent}%`
                  : 'Manage'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'support'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>Live Support</span>
              </div>
              {unreadSupportCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold animate-pulse font-mono">
                  {unreadSupportCount}
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {chatThreads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'tracker'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Service Orders & Tracker</span>
              </div>
              {pendingServiceOrdersCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500 text-white font-bold animate-pulse font-mono">
                  {pendingServiceOrdersCount}
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {trackedProjects.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'knowledge'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Knowledge Base (FAQ)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {faqArticles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('letters')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'letters'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Official Letters & Proposals</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {(letters || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-400" />
                <span>Admin Profile & Signature</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                config.adminProfile?.signatureDataUrl
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {config.adminProfile?.signatureDataUrl ? 'Signed' : 'Setup'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'seo'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Dynamic Sitemap & SEO</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                XML
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'team'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Engineering Team</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {(teamMembers || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('announcement')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'announcement'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>Visitor Announcement</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${announcementForm.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'testimonials'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-orange-400" />
                <span>Client Testimonials</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {testimonials.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'metrics'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Project Metrics Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-400" />
                <span>Consultation Bookings</span>
              </div>
              {pendingBookingsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold animate-pulse">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Client Approval Hub</span>
              </div>
              {pendingUsersCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500 text-white font-bold animate-pulse">
                  {pendingUsersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                <span>Direct Inquiries</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {inquiries.length}
              </span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mt-2 hidden md:block">
              Products & Portfolio
            </div>

            <button
              onClick={() => setActiveTab('hardware')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'hardware'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>Hardware & Pricing (GH₵)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {hardwareProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span>Completed Projects (MP4)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {completedProjects.length}
              </span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mt-2 hidden md:block">
              Branding & Global Settings
            </div>

            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Logo & Hero Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Contact & Ghana Office</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'social'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Social Media Handles</span>
            </button>

            <button
              onClick={() => setActiveTab('currency')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'currency'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Currency (Cedis GH₵)</span>
            </button>

            <button
              onClick={() => setActiveTab('overlays')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left whitespace-nowrap ${
                activeTab === 'overlays'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Theme & Overlays</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto">

            {/* TAB: PRICE NEGOTIATIONS & MARGINS */}
            {activeTab === 'negotiations' && (
              <AdminNegotiationsTab />
            )}

            {/* TAB: LIVE SUPPORT CHAT */}
            {activeTab === 'support' && (
              <AdminLiveSupportTab />
            )}

            {/* TAB: SERVICE ORDERS & PROJECT TRACKER */}
            {activeTab === 'tracker' && (
              <AdminProjectTrackerTab />
            )}

            {/* TAB: KNOWLEDGE BASE & FAQ */}
            {activeTab === 'knowledge' && (
              <AdminKnowledgeBaseTab />
            )}

            {/* TAB: OFFICIAL LETTERS & PROPOSALS */}
            {activeTab === 'letters' && (
              <AdminLettersTab />
            )}

            {/* TAB: CORE ENGINEERING TEAM DIRECTORY */}
            {activeTab === 'team' && (
              <AdminTeamTab />
            )}

            {/* TAB: ADMIN PROFILE & OFFICIAL SIGNATURE */}
            {activeTab === 'profile' && (
              <AdminProfileTab />
            )}

            {/* TAB: DYNAMIC SITEMAP & SEO ENGINE */}
            {activeTab === 'seo' && (
              <AdminSeoTab />
            )}

            {/* TAB: VISITOR ANNOUNCEMENT POP-UP */}
            {activeTab === 'announcement' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-amber-500" />
                      Visitor Announcement Pop-Up Configuration
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Toggle and customize the pop-up announcement displayed immediately to visitors and clients upon entering the platform.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem(`drt_announcement_seen_${announcementForm.title.slice(0, 20)}`);
                      triggerToast('Session reset! Reload the page to test the pop-up entrance.');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    Reset Seen Session
                  </button>
                </div>

                <form onSubmit={handleSaveAnnouncement} className="space-y-5 max-w-2xl">
                  {/* Enable / Disable Toggle Switch */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Enable Visitor Announcement Pop-Up
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        When enabled, visitors will see this modal immediately upon visiting the website.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAnnouncementForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        announcementForm.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          announcementForm.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Badge Text */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Announcement Badge Text
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., GHANA TECH EXPO 2026 or SYSTEM UPDATE"
                      value={announcementForm.badgeText}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, badgeText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Announcement Title */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Announcement Headline / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Accra Edge Nodes & Dedicated Cloud Infrastructure Live"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Announcement Message */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Detailed Message Paragraph *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe the update, promotion, partnership, or announcement in detail..."
                      value={announcementForm.message}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  {/* CTA Text and Destination Page */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Call-to-Action Button Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Book Consultation or Track Project"
                        value={announcementForm.ctaText || ''}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, ctaText: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Destination Page on Click
                      </label>
                      <select
                        value={announcementForm.ctaPage || 'consultation'}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, ctaPage: e.target.value as PageId })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
                      >
                        <option value="consultation">Consultation Page</option>
                        <option value="services">Services Catalog</option>
                        <option value="tracker">Track Project Status</option>
                        <option value="hardware">Hardware Store (GH₵)</option>
                        <option value="projects">Portfolio & MP4 Projects</option>
                        <option value="estimator">Solution Cost Estimator</option>
                        <option value="knowledge">Knowledge Base & FAQ</option>
                        <option value="verify">Document Verification</option>
                        <option value="contact">Contact & Head Office</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Preview Card */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Live Modal Preview:
                    </label>
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {announcementForm.badgeText || 'ANNOUNCEMENT'}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {announcementForm.title || 'Announcement Headline'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {announcementForm.message || 'Announcement message content will appear here...'}
                      </p>
                      {announcementForm.ctaText && (
                        <div className="pt-1">
                          <span className="inline-block px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
                            {announcementForm.ctaText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Announcement Settings</span>
                    </button>
                    {announcementSavedToast && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-4 h-4" />
                        <span>Saved successfully!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* TAB: SERVICES & PRICING */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-500" />
                      Services & Pricing Management (GH₵)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Add, edit, or delete technology services and set transparent baseline pricing in Ghanaian Cedis.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetServicesToDefault}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingServiceId(null);
                        setServiceForm({
                          number: String(services.length + 1).padStart(2, '0'),
                          category: 'software',
                          title: '',
                          shortDesc: '',
                          fullDesc: '',
                          iconName: 'Code',
                          startingPrice: 15000,
                          keyFeatures: ['High-Velocity Development', '24/7 Priority SLA', 'Ghana Enterprise Data Sync'],
                          techStack: ['React', 'Node.js', 'PostgreSQL'],
                          deliverables: ['Custom Web Architecture', 'Cloud Deployment'],
                          businessOutcome: '+120% Operational Speed'
                        });
                        setIsAddingService(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add New Service
                    </button>
                  </div>
                </div>

                {/* Service Edit / Create Form */}
                {isAddingService && (
                  <form onSubmit={handleSaveService} className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        {editingServiceId ? 'Edit Service & Pricing' : 'Add New Service Solution'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingService(false);
                          setEditingServiceId(null);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Service Title
                        </label>
                        <input
                          type="text"
                          required
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          placeholder="e.g. AI-Powered Workflow Automations"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Starting Price (GH₵)
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={serviceForm.startingPrice ?? 0}
                          onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={serviceForm.category}
                          onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as ServiceCategory })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="software">Custom Software & Web</option>
                          <option value="mobile">Mobile Apps (iOS & Android)</option>
                          <option value="crm">Custom CRM Solutions</option>
                          <option value="cloud">Cloud Infrastructure</option>
                          <option value="hardware-integration">Hardware Integration</option>
                          <option value="peripherals">Computer Peripherals</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Icon Style
                        </label>
                        <select
                          value={serviceForm.iconName}
                          onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Code">Code (Software)</option>
                          <option value="Smartphone">Smartphone (Mobile)</option>
                          <option value="Users">Users (CRM)</option>
                          <option value="Cloud">Cloud (DevOps)</option>
                          <option value="Cpu">Cpu (Hardware)</option>
                          <option value="Monitor">Monitor (Peripherals)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Target Business Outcome
                        </label>
                        <input
                          type="text"
                          value={serviceForm.businessOutcome}
                          onChange={(e) => setServiceForm({ ...serviceForm, businessOutcome: e.target.value })}
                          placeholder="e.g. +140% Operational Velocity"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Short Description (Card Summary)
                        </label>
                        <input
                          type="text"
                          required
                          value={serviceForm.shortDesc}
                          onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                          placeholder="Brief 1-2 sentence overview for the homepage cards"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Key Deliverables / Features (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={serviceForm.keyFeatures.join(', ')}
                          onChange={(e) => setServiceForm({ 
                            ...serviceForm, 
                            keyFeatures: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) 
                          })}
                          placeholder="Feature 1, Feature 2, Feature 3"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingService(false);
                          setEditingServiceId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {editingServiceId ? 'Update Service' : 'Add Service'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Services List with Live GH₵ Pricing */}
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-orange-600 dark:text-orange-400 font-bold">
                            {service.number}
                          </span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {service.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                          {service.shortDesc}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {service.keyFeatures.map((feat: string, idx: number) => (
                            <span 
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                            >
                              • {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing in GH₵ and Controls */}
                      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Baseline Price</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              defaultValue={service.startingPrice ?? 0}
                              onChange={(e) => setQuickServicePriceMap({
                                ...quickServicePriceMap,
                                [service.id]: Number(e.target.value)
                              })}
                              className="w-24 px-2 py-1 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-right"
                            />
                            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">GH₵</span>
                            <button
                              type="button"
                              onClick={() => handleQuickServicePriceChange(service.id)}
                              className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="Update Price"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingServiceId(service.id);
                              setServiceForm({
                                number: service.number,
                                category: service.category,
                                title: service.title,
                                shortDesc: service.shortDesc,
                                fullDesc: service.fullDesc,
                                iconName: service.iconName,
                                startingPrice: service.startingPrice ?? 0,
                                keyFeatures: [...service.keyFeatures],
                                techStack: [...service.techStack],
                                deliverables: [...service.deliverables],
                                businessOutcome: service.businessOutcome
                              });
                              setIsAddingService(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Edit Service"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteService(service.id);
                              triggerToast(`Service "${service.title}" deleted.`);
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CLIENT TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Quote className="w-4 h-4 text-orange-500" />
                      Client Testimonials & Partner Quotes
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Curate executive partner endorsements featured in the homepage slider with verified business impact.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetTestimonialsToDefault}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonialId(null);
                        setTestimonialForm({
                          clientName: '',
                          clientRole: '',
                          company: '',
                          quote: '',
                          projectScope: 'Custom CRM Architecture',
                          metricResult: '+180% Data Throughput',
                          rating: 5,
                          industry: 'Enterprise FinTech',
                          date: '2026-03',
                          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                        });
                        setIsAddingTestimonial(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Testimonial Quote
                    </button>
                  </div>
                </div>

                {/* Testimonial Form Modal/Drawer */}
                {isAddingTestimonial && (
                  <form onSubmit={handleSaveTestimonial} className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-orange-500" />
                        {editingTestimonialId ? 'Edit Partner Quote' : 'New Partner Endorsement'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTestimonial(false);
                          setEditingTestimonialId(null);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-3">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Testimonial Quote Text
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={testimonialForm.quote}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                          placeholder="e.g. DeRoyalTech modernized our logistics network and reduced system downtime to near zero in Ghana..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Client / Author Name
                        </label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.clientName}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                          placeholder="e.g. Kwame Asante"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Professional Role / Title
                        </label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.clientRole}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                          placeholder="e.g. Chief Technology Officer"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Partner Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.company}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                          placeholder="e.g. Asante Logistics Ltd"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Measurable Outcome / Metric Result
                        </label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.metricResult}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, metricResult: e.target.value })}
                          placeholder="e.g. +310% Delivery Speed, 99.98% Uptime"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Star Rating (1 - 5)
                        </label>
                        <select
                          value={testimonialForm.rating}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value={5}>5 Stars (Exceptional)</option>
                          <option value={4}>4 Stars (Very Good)</option>
                          <option value={3}>3 Stars (Satisfactory)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Industry Domain
                        </label>
                        <input
                          type="text"
                          value={testimonialForm.industry}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, industry: e.target.value })}
                          placeholder="e.g. Logistics & Supply Chain"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTestimonial(false);
                          setEditingTestimonialId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 shadow"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {editingTestimonialId ? 'Save Changes' : 'Publish to Slider'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Testimonial List */}
                <div className="grid grid-cols-1 gap-3">
                  {testimonials.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {item.clientName.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {item.clientName}
                            </span>
                            <span className="text-xs text-slate-500">
                              · {item.clientRole}, <span className="font-medium text-slate-700 dark:text-slate-300">{item.company}</span>
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                              {item.metricResult}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
                            "{item.quote}"
                          </p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: item.rating }).map((_, rIdx) => (
                              <Star key={rIdx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-[10px] text-slate-400 font-mono ml-2">Slider Position #{index + 1}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTestimonialId(item.id);
                            setTestimonialForm({
                              clientName: item.clientName,
                              clientRole: item.clientRole,
                              company: item.company,
                              quote: item.quote,
                              projectScope: item.projectScope,
                              metricResult: item.metricResult,
                              rating: item.rating,
                              industry: item.industry,
                              date: item.date,
                              avatarUrl: item.avatarUrl
                            });
                            setIsAddingTestimonial(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteTestimonial(item.id);
                            triggerToast(`Testimonial from ${item.clientName} removed.`);
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROJECT METRICS TRACKER */}
            {activeTab === 'metrics' && (
              <form onSubmit={handleSaveMetrics} className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    Key Project Metrics & Progress Counter
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure live numerical telemetry rendered on the Projects Page: 'Projects Completed', 'Client Satisfaction Rate', 'Lines of Code Written', and 'Hardware Nodes Deployed'.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <label className="block font-bold text-slate-900 dark:text-white">
                      Projects Completed Counter
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Baseline count displayed as verified completed enterprise deliverables.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        min={1}
                        value={metricsForm.projectsCompleted}
                        onChange={(e) => setMetricsForm({ ...metricsForm, projectsCompleted: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-base"
                      />
                      <span className="text-slate-400 font-mono font-bold">+</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <label className="block font-bold text-slate-900 dark:text-white">
                      Client Satisfaction Rate (%)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Calculated satisfaction percentage from post-deployment SLAs.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        step="0.1"
                        min={50}
                        max={100}
                        value={metricsForm.clientSatisfactionRate}
                        onChange={(e) => setMetricsForm({ ...metricsForm, clientSatisfactionRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-base"
                      />
                      <span className="text-emerald-500 font-mono font-bold">%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <label className="block font-bold text-slate-900 dark:text-white">
                      Lines of Code Written
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Aggregated production code base across repositories.
                    </p>
                    <input
                      type="text"
                      value={metricsForm.linesOfCodeWritten}
                      onChange={(e) => setMetricsForm({ ...metricsForm, linesOfCodeWritten: e.target.value })}
                      placeholder="e.g. 1.8M+"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <label className="block font-bold text-slate-900 dark:text-white">
                      Hardware Nodes Deployed
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Enterprise workstations and IoT edge appliances active in Ghana.
                    </p>
                    <input
                      type="number"
                      min={0}
                      value={metricsForm.hardwareNodesDeployed}
                      onChange={(e) => setMetricsForm({ ...metricsForm, hardwareNodesDeployed: Number(e.target.value) })}
                      placeholder="e.g. 2400"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 sm:col-span-2">
                    <label className="block font-bold text-slate-900 dark:text-white">
                      Infrastructure Uptime SLA (%)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Contractual guarantee across cloud microservices & CRM databases.
                    </p>
                    <input
                      type="number"
                      step="0.01"
                      min={90}
                      max={100}
                      value={metricsForm.uptimeSla}
                      onChange={(e) => setMetricsForm({ ...metricsForm, uptimeSla: Number(e.target.value) })}
                      placeholder="e.g. 99.99"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow"
                  >
                    <Save className="w-4 h-4" />
                    Save Metrics to Projects Page
                  </button>
                </div>
              </form>
            )}

            {/* TAB: CONSULTATION BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-blue-500" />
                      Consultation Bookings & Discovery Dispatch
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Review discovery sessions requested by clients. Approve, reject, or reschedule with revised calendar slots.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {consultationBookings.length} Total Bookings
                    </span>
                  </div>
                </div>

                {/* Reschedule Modal / Popover */}
                {reschedulingBookingId && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <CalendarClock className="w-4 h-4 text-amber-600" />
                        Reschedule Consultation: {consultationBookings.find(b => b.id === reschedulingBookingId)?.fullName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setReschedulingBookingId(null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          New Meeting Date
                        </label>
                        <input
                          type="date"
                          required
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Time Slot (GMT / Ghana)
                        </label>
                        <select
                          value={rescheduleTime}
                          onChange={(e) => setRescheduleTime(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="09:00 AM - 10:00 AM GMT">09:00 AM - 10:00 AM GMT</option>
                          <option value="10:00 AM - 11:00 AM GMT">10:00 AM - 11:00 AM GMT</option>
                          <option value="01:00 PM - 02:00 PM GMT">01:00 PM - 02:00 PM GMT</option>
                          <option value="03:00 PM - 04:00 PM GMT">03:00 PM - 04:00 PM GMT</option>
                          <option value="05:00 PM - 06:00 PM GMT">05:00 PM - 06:00 PM GMT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Admin Note to Client
                        </label>
                        <input
                          type="text"
                          value={rescheduleNote}
                          onChange={(e) => setRescheduleNote(e.target.value)}
                          placeholder="e.g. Moved due to senior architect sprint review"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setReschedulingBookingId(null)}
                        className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmReschedule}
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow"
                      >
                        <CalendarClock className="w-3.5 h-3.5" />
                        Confirm Reschedule
                      </button>
                    </div>
                  </div>
                )}

                {/* Bookings List */}
                <div className="space-y-3">
                  {consultationBookings.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs">
                      No consultation bookings yet. When clients book from the header or services page, they will appear here.
                    </div>
                  ) : (
                    consultationBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{booking.id}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{booking.fullName}</span>
                            <span className="text-slate-500">({booking.company})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              booking.status === 'Approved' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : booking.status === 'Rescheduled'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : booking.status === 'Rejected'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 animate-pulse'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block">Email & Phone:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-mono block">{booking.email}</span>
                            <span className="text-slate-500 font-mono">{booking.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Scheduled Date:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{booking.scheduledDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Time Slot:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{booking.timeSlot}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Budget Bracket:</span>
                            <span className="text-slate-800 dark:text-slate-200 capitalize font-medium">{booking.budgetBracket}</span>
                          </div>
                        </div>

                        {booking.projectScope && (
                          <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg text-xs font-mono text-blue-900 dark:text-blue-200">
                            <span className="font-bold block text-[10px] uppercase text-blue-600 dark:text-blue-400 mb-0.5">
                              Discovery Scope / Requirements:
                            </span>
                            {booking.projectScope}
                          </div>
                        )}

                        {booking.adminNotes && (
                          <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-200 dark:border-amber-900/40">
                            <strong>Admin Note:</strong> {booking.adminNotes}
                          </p>
                        )}

                        {/* Booking Approval & Reschedule Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                          <span className="text-[10px] text-slate-400">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {booking.status !== 'Approved' && (
                              <button
                                type="button"
                                onClick={() => {
                                  approveBooking(booking.id, 'Confirmed by DeRoyalTech Senior Architect');
                                  triggerToast('Consultation approved! Client confirmation scheduled.');
                                }}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 transition-colors"
                              >
                                <CalendarCheck className="w-3.5 h-3.5" />
                                Approve
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setReschedulingBookingId(booking.id);
                                setRescheduleDate(booking.scheduledDate);
                                setRescheduleTime(booking.timeSlot);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded flex items-center gap-1 transition-colors"
                            >
                              <CalendarClock className="w-3.5 h-3.5" />
                              Reschedule
                            </button>

                            {booking.status !== 'Rejected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  rejectBooking(booking.id, 'Declined due to calendar conflict');
                                  triggerToast('Booking rejected.');
                                }}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/30 rounded flex items-center gap-1 transition-colors"
                              >
                                <CalendarX className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                deleteBooking(booking.id);
                                triggerToast('Booking record deleted.');
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: CLIENT APPROVAL & ACCESS HUB */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-purple-500" />
                      Client Approval & Verified Badge Registry
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Enforce strict access controls. Clients cannot access protected sections or receive verified badges until approved here.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-bold">
                      {pendingUsersCount} Pending Approval
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {registeredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {user.fullName}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({user.company})
                          </span>

                          {/* Verification Badge Status */}
                          {user.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              <ShieldCheck className="w-3 h-3 text-blue-500" />
                              Verified Partner
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                              Unverified
                            </span>
                          )}

                          {user.isAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                              Master Admin
                            </span>
                          )}

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            user.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : user.status === 'rejected'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                          }`}>
                            {user.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <span>Email: {user.email}</span>
                          <span>· Phone: {user.phone}</span>
                          <span>· Role: {user.role}</span>
                          <span>· Registered: {new Date(user.registeredAt).toLocaleDateString()}</span>
                        </div>

                        {/* Admin 2-Device Concurrency Tracker */}
                        {user.isAdmin && (
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                                <span>Active Device Sessions (Max 2 Allowed):</span>
                              </span>
                              <span className="font-mono text-orange-600 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 text-[10px]">
                                {(user.activeSessions || []).length} / 2
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {(user.activeSessions || []).length === 0 ? (
                                <span className="text-[11px] text-slate-400 italic">No device sessions currently active</span>
                              ) : (
                                user.activeSessions?.map((s) => (
                                  <div
                                    key={s.deviceId}
                                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center gap-2 shadow-xs"
                                  >
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{s.deviceName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {new Date(s.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        revokeAdminSession(user.id, s.deviceId);
                                        triggerToast(`Revoked session for ${s.deviceName}`);
                                      }}
                                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold text-[10px] underline ml-1 cursor-pointer"
                                    >
                                      Revoke
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {user.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => {
                              approveClientUser(user.id);
                              triggerToast(`Approved and granted verified badge to ${user.fullName}`);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Approve & Verify Badge
                          </button>
                        )}

                        {user.status !== 'rejected' && !user.isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              rejectClientUser(user.id);
                              triggerToast(`Rejected client access for ${user.fullName}`);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            toggleUserAdminRole(user.id);
                            triggerToast(`Updated admin privileges for ${user.fullName}`);
                          }}
                          className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                            user.isAdmin
                              ? 'border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30'
                              : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                          }`}
                          title="Toggle CMS Admin access"
                        >
                          {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>

                        {!user.isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteClientUser(user.id);
                              triggerToast(`Account for ${user.fullName} deleted.`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: DIRECT INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-blue-500" />
                      Direct Inquiries & RFQs
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Messages received from the Contact page and custom hardware RFQ submissions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigateTo('inquiries');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Full Inquiries Page</span>
                    </button>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded border border-blue-200 dark:border-blue-900">
                      {inquiries.length} Inquiries
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {inquiries.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs">
                      No direct inquiries logged yet.
                    </div>
                  ) : (
                    inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{inq.id}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{inq.fullName}</span>
                            <span className="text-slate-400">({inq.company})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                            <select
                              value={inq.status}
                              onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                            >
                              <option value="New">Status: New</option>
                              <option value="In Progress">Status: In Progress</option>
                              <option value="Contacted">Status: Contacted</option>
                              <option value="Closed">Status: Closed</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                deleteInquiry(inq.id);
                                triggerToast(`Inquiry ${inq.id} deleted.`);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block">Email:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-mono">{inq.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Project Domain:</span>
                            <span className="text-slate-800 dark:text-slate-200 capitalize">{inq.projectType}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Planned Budget:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{inq.budget}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Timeline:</span>
                            <span className="text-slate-800 dark:text-slate-200">{inq.timeline}</span>
                          </div>
                        </div>

                        {inq.scopeNotes && (
                          <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg text-xs font-mono text-blue-900 dark:text-blue-200">
                            <span className="font-bold block text-[10px] uppercase text-blue-600 dark:text-blue-400 mb-0.5">
                              Attached RFQ / Scope:
                            </span>
                            {inq.scopeNotes}
                          </div>
                        )}

                        {inq.message && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            "{inq.message}"
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: HARDWARE PRODUCTS & PRICING */}
            {activeTab === 'hardware' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      Hardware Catalog & Price Manager (GH₵)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Configure high-performance enterprise rigs, workstations, and peripherals priced in Ghanaian Cedis.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetProductsToDefault}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHardwareId(null);
                        setHardwareForm({
                          name: '',
                          category: 'workstations',
                          sku: `DRT-HW-${Math.floor(Math.random() * 900) + 100}`,
                          price: 18500,
                          rating: 5.0,
                          tagline: '',
                          specs: {
                            Processor: 'AMD Ryzen 9 / Intel Xeon Enterprise',
                            Memory: '64GB DDR5 ECC',
                            Storage: '2TB PCIe Gen 4 NVMe'
                          },
                          stockStatus: 'In Stock',
                          warranty: '3-Year Enterprise Warranty in Ghana',
                          integrationReady: 'Native DeRoyalTech API & CRM Sync',
                          description: ''
                        });
                        setIsAddingHardware(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Hardware Item
                    </button>
                  </div>
                </div>

                {/* Add / Edit Hardware Form */}
                {isAddingHardware && (
                  <form onSubmit={handleSaveHardware} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-500" />
                        {editingHardwareId ? 'Edit Hardware Product' : 'Add New Hardware Equipment'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingHardware(false);
                          setEditingHardwareId(null);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          required
                          value={hardwareForm.name}
                          onChange={(e) => setHardwareForm({ ...hardwareForm, name: e.target.value })}
                          placeholder="e.g. Apex Alpha Enterprise Workstation"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={hardwareForm.category}
                          onChange={(e) => setHardwareForm({ ...hardwareForm, category: e.target.value as HardwareCategory })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="workstations">Enterprise Workstations</option>
                          <option value="peripherals">High-Spec Peripherals</option>
                          <option value="networking">Edge Computing & Networking</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Price in Cedis (GH₵)
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={hardwareForm.price}
                          onChange={(e) => setHardwareForm({ ...hardwareForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          SKU Identifier
                        </label>
                        <input
                          type="text"
                          required
                          value={hardwareForm.sku}
                          onChange={(e) => setHardwareForm({ ...hardwareForm, sku: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Stock Status
                        </label>
                        <select
                          value={hardwareForm.stockStatus}
                          onChange={(e) => setHardwareForm({ ...hardwareForm, stockStatus: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="In Stock">In Stock (Accra Warehouse)</option>
                          <option value="Fast Ship">Fast Ship (24-48 Hours)</option>
                          <option value="Built to Order">Built to Order</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Warranty Period
                        </label>
                        <input
                          type="text"
                          value={hardwareForm.warranty}
                          onChange={(e) => setHardwareForm({ ...hardwareForm, warranty: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Product Overview / Description
                        </label>
                        <textarea
                          rows={2}
                          value={hardwareForm.description}
                          onChange={(e) => setHardwareForm({ ...hardwareForm, description: e.target.value })}
                          placeholder="Technical engineering capabilities and enterprise warranty terms..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingHardware(false);
                          setEditingHardwareId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {editingHardwareId ? 'Save Changes' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Hardware List with Instant GH₵ Price Override */}
                <div className="space-y-3">
                  {hardwareProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {product.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {product.sku}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold capitalize">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {product.tagline || product.description?.slice(0, 80) + '...'}
                        </p>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </div>
                      </div>

                      {/* Pricing in GH₵ and Controls */}
                      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Unit Price</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              defaultValue={product.price}
                              onChange={(e) => setQuickHardwarePriceMap({
                                ...quickHardwarePriceMap,
                                [product.id]: Number(e.target.value)
                              })}
                              className="w-28 px-2 py-1 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-right"
                            />
                            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">GH₵</span>
                            <button
                              type="button"
                              onClick={() => handleQuickHardwarePriceChange(product.id)}
                              className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="Update Price"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingHardwareId(product.id);
                              setHardwareForm({
                                name: product.name,
                                category: product.category,
                                sku: product.sku,
                                price: product.price,
                                rating: product.rating,
                                tagline: product.tagline,
                                specs: { ...product.specs },
                                stockStatus: product.stockStatus,
                                warranty: product.warranty,
                                integrationReady: product.integrationReady,
                                description: product.description
                              });
                              setIsAddingHardware(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Edit Hardware"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteProduct(product.id);
                              triggerToast(`Product ${product.name} deleted.`);
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Delete Hardware"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: COMPLETED PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-blue-500" />
                      Completed Projects Showcase (MP4 & Live Links)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client-facing portfolio items with active URL launchpads and high-definition video overviews.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetProjectsToDefault}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({
                          title: '',
                          client: '',
                          industry: 'FinTech',
                          category: 'web',
                          completionDate: '2026',
                          summary: '',
                          liveUrl: 'https://',
                          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                          deliverables: ['Custom Web Architecture'],
                          metrics: [{ label: 'Speed', value: '+150%' }],
                          techStack: ['React', 'TypeScript', 'Tailwind'],
                          verifiedDeliveryBadge: 'Production Live in Ghana',
                          clientCountry: 'Ghana'
                        });
                        setIsAddingProject(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Project Case
                    </button>
                  </div>
                </div>

                {/* Add/Edit Project Form */}
                {isAddingProject && (
                  <form onSubmit={handleSaveProject} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-500" />
                        {editingProjectId ? 'Edit Project Showcase' : 'Add New Completed Project'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProject(false);
                          setEditingProjectId(null);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="e.g. Osu Cross-Dock Logistics ERP"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Client Organization
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.client}
                          onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                          placeholder="e.g. GoldCoast Freight Express"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Category Domain
                        </label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="crm">Custom CRM Solution</option>
                          <option value="cloud">Cloud & Infrastructure</option>
                          <option value="hardware">Hardware & Edge Integration</option>
                          <option value="mobile">Mobile Application</option>
                          <option value="web">Web Application & Portals</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Live Product Preview URL (Client Can Visit Directly)
                        </label>
                        <input
                          type="url"
                          required
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          placeholder="https://client-preview.deroyaltech.com"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          MP4 Video Overview URL
                        </label>
                        <input
                          type="url"
                          required
                          value={projectForm.videoUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                          placeholder="https://...mp4"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Project Summary & Solution Value
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={projectForm.summary}
                          onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                          placeholder="Architectural overview of how DeRoyalTech delivered this solution in Ghana..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProject(false);
                          setEditingProjectId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {editingProjectId ? 'Save Changes' : 'Create Showcase'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Projects List */}
                <div className="space-y-3">
                  {completedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {project.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({project.client})
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                            {project.verifiedDeliveryBadge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {project.summary}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-xs">
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-mono text-[11px]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Live Launchpad
                          </a>
                          <span className="text-slate-400">·</span>
                          <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 font-mono text-[11px]">
                            <Film className="w-3 h-3" />
                            MP4 Overview Ready
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(project.id);
                            setProjectForm({
                              title: project.title,
                              client: project.client,
                              industry: project.industry,
                              category: project.category,
                              completionDate: project.completionDate,
                              summary: project.summary,
                              liveUrl: project.liveUrl,
                              videoUrl: project.videoUrl,
                              deliverables: [...project.deliverables],
                              metrics: [...project.metrics],
                              techStack: [...project.techStack],
                              verifiedDeliveryBadge: project.verifiedDeliveryBadge,
                              clientCountry: project.clientCountry
                            });
                            setIsAddingProject(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteCompletedProject(project.id);
                            triggerToast(`Project ${project.title} deleted.`);
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BRANDING & LOGO */}
            {activeTab === 'branding' && (
              <form onSubmit={handleSaveBranding} className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Brand Logo & Hero Messaging
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update the official corporate logo path, headlines, and company identity.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Official Brand Logo Source URL / Asset Path
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={brandingForm.logoUrl}
                        onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setBrandingForm({ ...brandingForm, logoUrl: DEFAULT_LOGO })}
                        className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Reset Logo
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Current default points to official asset: <code className="font-mono text-orange-600 dark:text-orange-400">{DEFAULT_LOGO}</code>
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-32 h-14 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                      <img 
                        src={brandingForm.logoUrl} 
                        alt="Logo Preview" 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_LOGO;
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Logo Live Preview</span>
                      <span className="text-[11px] text-slate-500">Renders crisp across navbar, footer, auth modal, and inquiry brief.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={brandingForm.companyName}
                        onChange={(e) => setBrandingForm({ ...brandingForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Corporate Tagline
                      </label>
                      <input
                        type="text"
                        value={brandingForm.tagline}
                        onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hero Primary Headline
                    </label>
                    <input
                      type="text"
                      value={brandingForm.heroHeadline}
                      onChange={(e) => setBrandingForm({ ...brandingForm, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hero Subtitle Description
                    </label>
                    <textarea
                      rows={2}
                      value={brandingForm.heroSubtitle}
                      onChange={(e) => setBrandingForm({ ...brandingForm, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow"
                  >
                    <Save className="w-4 h-4" />
                    Save Brand Settings
                  </button>
                </div>
              </form>
            )}

            {/* TAB: CONTACT & GHANA OFFICE */}
            {activeTab === 'contact' && (
              <form onSubmit={handleSaveContact} className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Contact Details & Ghana Headquarters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update phone numbers, WhatsApp, physical address, and team routing inboxes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Phone Line (Ghana)
                    </label>
                    <input
                      type="text"
                      value={contactForm.phonePrimary}
                      onChange={(e) => setContactForm({ ...contactForm, phonePrimary: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Direct WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={contactForm.whatsappNumber}
                      onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Secondary Telephone Line
                    </label>
                    <input
                      type="text"
                      value={contactForm.phoneSecondary}
                      onChange={(e) => setContactForm({ ...contactForm, phoneSecondary: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      General Enquiries Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.emailGeneral}
                      onChange={(e) => setContactForm({ ...contactForm, emailGeneral: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sales & Solutions Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.emailSales}
                      onChange={(e) => setContactForm({ ...contactForm, emailSales: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Technical Support Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.emailSupport}
                      onChange={(e) => setContactForm({ ...contactForm, emailSupport: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Physical Office Address (Ghana)
                    </label>
                    <input
                      type="text"
                      value={contactForm.physicalAddress}
                      onChange={(e) => setContactForm({ ...contactForm, physicalAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City, Country
                    </label>
                    <input
                      type="text"
                      value={contactForm.cityCountry}
                      onChange={(e) => setContactForm({ ...contactForm, cityCountry: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Operational Business Hours
                    </label>
                    <input
                      type="text"
                      value={contactForm.businessHours}
                      onChange={(e) => setContactForm({ ...contactForm, businessHours: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant propagation to Homepage, Footer, Verification, & WhatsApp links</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enforce & Save Contact Details</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: SOCIAL MEDIA HANDLES */}
            {activeTab === 'social' && (
              <form onSubmit={handleSaveSocial} className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Social Media Handles & Official Links
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure your official WhatsApp, Facebook, TikTok, Instagram, and LinkedIn channels. All channels are rendered with official SVG vector logos.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Quick-Chat Number or Link
                    </label>
                    <input
                      type="text"
                      value={socialForm.whatsapp}
                      onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                      placeholder="+233245901284 or https://wa.me/233245901284"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={socialForm.facebook}
                      onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
                      placeholder="https://facebook.com/deroyaltech"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      TikTok Profile URL
                    </label>
                    <input
                      type="url"
                      value={socialForm.tiktok}
                      onChange={(e) => setSocialForm({ ...socialForm, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@deroyaltech"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={socialForm.instagram}
                      onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                      placeholder="https://instagram.com/deroyaltech"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      LinkedIn Corporate Page URL
                    </label>
                    <input
                      type="url"
                      value={socialForm.linkedin}
                      onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/company/deroyaltech-systems"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow"
                  >
                    <Save className="w-4 h-4" />
                    Save Social Media Links
                  </button>
                </div>
              </form>
            )}

            {/* TAB: CURRENCY CONFIGURATION */}
            {activeTab === 'currency' && (
              <form onSubmit={handleSaveCurrency} className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Currency Setting (Ghanaian Cedis GH₵)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    All website pricing across services, hardware, RFQ calculators, and discovery briefs format in Ghanaian Cedis.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={currencyForm.currencySymbol}
                      onChange={(e) => setCurrencyForm({ ...currencyForm, currencySymbol: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-base"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Currency Code (ISO)
                    </label>
                    <input
                      type="text"
                      value={currencyForm.currencyCode}
                      onChange={(e) => setCurrencyForm({ ...currencyForm, currencyCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-base"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold block mb-1">Formatting Example:</span>
                  Amount 15,000 formats as: <span className="font-mono font-bold">{formatPrice(15000)}</span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow"
                  >
                    <Save className="w-4 h-4" />
                    Save Currency Configuration
                  </button>
                </div>
              </form>
            )}

            {/* TAB: THEME & OVERLAYS */}
            {activeTab === 'overlays' && (
              <div className="space-y-6 max-w-2xl text-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Ultra-Modern Graphical User Interface & Overlays
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Customize background gradients, glassmorphism blur layers, and accent aesthetics.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Cybernetic Tech Overlays
                    </span>
                    <p className="text-slate-500">
                      Glow gradients with mesh backdrop grid, high-contrast dark mode, and soft ambient light.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'deroyal-dual', name: 'DeRoyal Dual (Blue & Orange)', color: 'bg-blue-600 border-orange-500' },
                      { id: 'cobalt', name: 'Electric Cobalt', color: 'bg-blue-600' },
                      { id: 'emerald', name: 'Industrial Emerald', color: 'bg-emerald-600' },
                      { id: 'amber', name: 'Sovereign Amber', color: 'bg-amber-600' },
                      { id: 'cyan', name: 'Cyber Cyan', color: 'bg-cyan-600' },
                    ].map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          updateConfig({ accentTheme: theme.id as any });
                          triggerToast('Interface theme preset updated!');
                        }}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-medium ${
                          config.accentTheme === theme.id
                            ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${theme.color} shrink-0 shadow-sm`} />
                        <span className="truncate">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>DeRoyalTech Systems Admin Console · Real-time synchronization active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
