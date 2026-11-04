export type ServiceCategory = 
  | 'software'
  | 'mobile'
  | 'crm'
  | 'cloud'
  | 'hardware-integration'
  | 'peripherals';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  startingPrice?: number; // In Ghanaian Cedis (GH₵)
  keyFeatures: string[];
  techStack: string[];
  deliverables: string[];
  businessOutcome: string;
}

export type PortfolioCategory = 'all' | 'software' | 'mobile' | 'crm' | 'cloud' | 'hardware';

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  category: PortfolioCategory;
  timeframe: string;
  summary: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    label: string;
  }[];
  techStack: string[];
  image: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  architecturalHighlights: string[];
}

export interface CompletedProject {
  id: string;
  title: string;
  client: string;
  industry: string;
  category: 'web' | 'mobile' | 'crm' | 'cloud' | 'hardware';
  completionDate: string;
  summary: string;
  liveUrl: string;
  videoUrl?: string; // MP4 video file or preview
  videoThumbnail?: string;
  deliverables: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  verifiedDeliveryBadge: string;
  clientCountry: string;
}

export type HardwareCategory = 'all' | 'workstations' | 'networking' | 'scanners-pos' | 'displays-docks';

export interface HardwareProduct {
  id: string;
  name: string;
  category: HardwareCategory;
  sku: string;
  price: number; // In Ghanaian Cedis (GH₵)
  rating: number;
  tagline: string;
  specs: {
    [key: string]: string;
  };
  stockStatus: 'In Stock' | 'Fast Ship' | 'Built to Order';
  warranty: string;
  integrationReady: string;
  badge?: string;
  description: string;
  imageUrl?: string;
}

export interface SiteContactDetails {
  companyName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  emailGeneral: string;
  emailSales: string;
  emailSupport: string;
  physicalAddress: string;
  cityCountry: string;
  businessHours: string;
  whatsappNumber: string;
}

export interface SocialHandles {
  whatsapp: string;
  facebook: string;
  tiktok: string;
  instagram: string;
  linkedin: string;
}

export interface PartnerQuote {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  avatarUrl?: string;
  quote: string;
  projectScope: string;
  metricResult: string;
  rating: number;
  industry: string;
  date: string;
}

export interface ProjectMetricsConfig {
  projectsCompleted: number; // e.g. 86
  clientSatisfactionRate: number; // e.g. 99.4
  linesOfCodeWritten: string; // e.g. "1.4M+"
  uptimeSla: number; // e.g. 99.99
  hardwareNodesDeployed: number; // e.g. 2400
}

export interface ClientUser {
  id: string;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  role: string;
  password?: string;
  registeredAt: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  isAdmin?: boolean;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ConsultationBooking {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectScope: string;
  budgetBracket: string;
  scheduledDate: string;
  timeSlot: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Rescheduled';
  rescheduledDate?: string;
  rescheduledTime?: string;
  adminNotes?: string;
}

export type PageId = 'home' | 'services' | 'workflow' | 'projects' | 'hardware' | 'estimator' | 'contact' | 'knowledge';

export interface SiteConfig {
  logoUrl: string;
  currencySymbol: string;
  currencyCode: string;
  accentTheme: 'deroyal-dual' | 'cobalt' | 'emerald' | 'amber' | 'cyan';
  overlayStyle: 'ambient-glass' | 'cyber-grid' | 'minimal-slate';
  heroHeadline: string;
  heroSubtitle: string;
  contact: SiteContactDetails;
  social: SocialHandles;
  metrics: ProjectMetricsConfig;
  testimonials: PartnerQuote[];
  enableVideoPreviews: boolean;
}

export interface InquiryItem {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  scopeNotes?: string;
  message: string;
  status: 'New' | 'In Progress' | 'Contacted' | 'Closed';
  adminNotes?: string;
}

export interface QuoteItem {
  product: HardwareProduct;
  quantity: number;
}

export interface WorkflowPacket {
  id: string;
  timestamp: string;
  sourceDevice: string;
  deviceType: 'RFID' | 'IoT_Sensor' | 'POS_Terminal' | 'Mobile_BLE';
  payloadData: string;
  edgeGatewayStatus: 'Received' | 'Decrypted' | 'Queued';
  cloudStatus: 'Streamed to Kafka' | 'Processed via K8s' | 'Stored in DB';
  crmStatus: 'Pipeline Updated' | 'Telemetry Logged' | 'Order Triggered';
  latencyMs: number;
}

export interface EstimatorState {
  services: string[];
  companyScale: 'growth' | 'midmarket' | 'enterprise';
  cloudTier: 'standard' | 'high-availability' | 'mission-critical';
  hardwareSupport: 'none' | 'edge-gateways' | 'fleet-deployment' | 'full-integration';
  hardwareUnits: number;
  deliveryTimeline: 'standard' | 'accelerated';
}

// ==================== LIVE SUPPORT REAL-TIME CHAT ====================
export interface ChatMessage {
  id: string;
  sender: 'client' | 'admin' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  isInternalNote?: boolean;
}

export type ChatThreadStatus = 'active' | 'waiting_admin' | 'waiting_client' | 'resolved';

export interface ChatThread {
  id: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  subject: string;
  status: ChatThreadStatus;
  priority: 'normal' | 'high' | 'urgent';
  projectId?: string; // Optional link to a tracked project
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  unreadCountForAdmin: number;
  unreadCountForClient: number;
  assignedAdmin?: string;
}

// ==================== SERVICE REQUESTS & TRACKER ====================
export type ServiceRequestStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'declined';

export interface ServiceProjectRequest {
  id: string;
  createdAt: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  serviceId: string;
  serviceTitle: string;
  projectTitle: string;
  description: string;
  estimatedBudget: number; // In Ghanaian Cedis (GH₵)
  targetTimeline: string;
  hardwareIntegrationNeeded: boolean;
  status: ServiceRequestStatus;
  assignedProjectId?: string;
  adminNotes?: string;
  confirmedAt?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedAt?: string;
  targetDate?: string;
}

export interface ProjectLogEntry {
  id: string;
  timestamp: string;
  title: string;
  note: string;
  author: string;
  stageBadge?: string;
}

export type ProjectStageStatus = 
  | 'confirmed'
  | 'architecture_planning'
  | 'prototyping'
  | 'development'
  | 'hardware_assembly'
  | 'testing_qa'
  | 'deployment'
  | 'completed'
  | 'on_hold';

export interface TrackedProject {
  projectId: string; // e.g. "DRT-2026-7841"
  requestId?: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientPhone?: string;
  serviceCategory: ServiceCategory;
  serviceTitle: string;
  stage: ProjectStageStatus;
  stageLabel: string;
  progressPercent: number; // 0 to 100
  startDate: string;
  estimatedDeliveryDate: string;
  completedDate?: string;
  leadEngineer: string;
  assignedTeam: string[];
  liveUrl?: string;
  repositoryOrPortalUrl?: string;
  hardwareUnitsCount?: number;
  milestones: ProjectMilestone[];
  updatesLog: ProjectLogEntry[];
  adminNotes?: string;
}

// ==================== PROJECT TRACKER EMAIL NOTIFICATIONS ====================
export interface ProjectEmailAlert {
  id: string;
  projectId: string;
  projectTitle: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  stage: string;
  stageLabel: string;
  progressPercent: number;
  updateSummary: string;
  status: 'Delivered' | 'Queued' | 'Simulated';
  leadEngineer?: string;
  estimatedDeliveryDate?: string;
  htmlPreview?: string;
}

// ==================== KNOWLEDGE BASE & FAQ ARTICLES ====================
export type FAQCategory = 
  | 'General & Onboarding'
  | 'Web & Mobile Development'
  | 'Custom CRM Solutions'
  | 'Cloud Infrastructure & DevOps'
  | 'Hardware & Peripherals'
  | 'Billing & Ghana Cedis Pricing'
  | 'Project Tracking & SLAs';

export interface FAQArticle {
  id: string;
  title: string;
  slug: string;
  category: FAQCategory;
  summary: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  readTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  author: string;
}

