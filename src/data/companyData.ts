import { 
  ServiceItem, 
  CaseStudy, 
  HardwareProduct, 
  CompletedProject, 
  SiteConfig, 
  PartnerQuote, 
  ProjectMetricsConfig,
  ChatThread,
  ServiceProjectRequest,
  TrackedProject,
  FAQArticle,
  ProjectEmailAlert,
  OfficialLetter,
  TeamMember
} from '../types/index.ts';

export const DEFAULT_LOGO = '/assets/aistudio/Deroyaltech_Digital_Innovation_Logo_9f10ddb1.png';
export const HERO_IMAGE = '/src/assets/images/hero_deroyaltech_1793611778755.jpg';
export const HARDWARE_HERO_IMAGE = '/src/assets/images/hardware_peripherals_catalog_1793611780289.jpg';

export const DEFAULT_METRICS: ProjectMetricsConfig = {
  projectsCompleted: 86,
  clientSatisfactionRate: 99.4,
  linesOfCodeWritten: '1.4M+',
  uptimeSla: 99.99,
  hardwareNodesDeployed: 2400
};

export const DEFAULT_TESTIMONIALS: PartnerQuote[] = [
  {
    id: 'quote-1',
    clientName: 'Kwame Asante',
    clientRole: 'Chief Technology Officer',
    company: 'Asante Logistics & Freight Ltd (Ghana)',
    quote: 'DeRoyalTech unified our 120 warehouse RFID barcode scanners and custom CRM into a sub-second dispatch engine across Tema and Takoradi ports. Our manifest clearance velocity skyrocketed by over 200%.',
    projectScope: 'Custom CRM & RFID Telemetry Synchronization',
    metricResult: '+210% Dispatch Velocity',
    rating: 5,
    industry: 'Maritime Logistics',
    date: 'October 2026'
  },
  {
    id: 'quote-2',
    clientName: 'Dr. Abena Mensah-Bonsu',
    clientRole: 'Director of Healthcare Systems',
    company: 'Accra Health Diagnostic Networks',
    quote: 'The multi-cloud architecture and HIPAA/GDPR compliant patient portal developed by DeRoyalTech has maintained 99.99% uptime through power and network fluctuations. Exceptional engineering discipline.',
    projectScope: 'Cloud Infrastructure & High-Availability Portal',
    metricResult: '99.99% Measured Uptime',
    rating: 5,
    industry: 'Healthcare & Diagnostics',
    date: 'August 2026'
  },
  {
    id: 'quote-3',
    clientName: 'Marcus Vance',
    clientRole: 'Chief Operating Officer',
    company: 'Nexus Global Logistics & Supply',
    quote: 'DeRoyalTech took our fragmented spreadsheet processes and obsolete third-party SaaS and engineered a bulletproof bespoke CRM tailored precisely to our cross-border shipping workflows.',
    projectScope: 'Turnkey Enterprise CRM Platform',
    metricResult: 'GH₵ 2.4M Saved Annually',
    rating: 5,
    industry: 'Supply Chain',
    date: 'September 2026'
  },
  {
    id: 'quote-4',
    clientName: 'Elena Rostova',
    clientRole: 'VP of Platform Engineering',
    company: 'FinGuard Capital',
    quote: 'Their Terraform pipelines and autoscaling Kubernetes clusters handled peak financial trading volume with zero packet drops. They are the benchmark for enterprise reliability.',
    projectScope: 'Multi-Cloud DevOps & FinTech Infrastructure',
    metricResult: '<18ms API Latency',
    rating: 5,
    industry: 'FinTech & Capital',
    date: 'July 2026'
  },
  {
    id: 'quote-5',
    clientName: 'Emmanuel K. Danquah',
    clientRole: 'Managing Director',
    company: 'Gold Coast Retail & Supermarkets',
    quote: 'We procured 60 OmniPay biometric POS terminals and barcode readers from DeRoyalTech. The turnkey staging and local Accra warranty gave us tremendous peace of mind.',
    projectScope: 'Enterprise POS Peripherals & CRM Sync',
    metricResult: '0% Hardware Failure',
    rating: 5,
    industry: 'Commercial Retail',
    date: 'November 2026'
  }
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  logoUrl: DEFAULT_LOGO,
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
  metrics: DEFAULT_METRICS,
  testimonials: DEFAULT_TESTIMONIALS,
  enableVideoPreviews: true,
  announcement: {
    enabled: true,
    badgeText: 'INFRASTRUCTURE ADVISORY',
    title: 'Q4 2026 Enterprise Cloud Expansion & Hardware Subsidies',
    message: 'DeRoyalTech Systems has activated redundant edge nodes in Accra and Kumasi. Verified enterprise clients enjoy 15% wholesale hardware subsidies and complimentary cloud architecture assessments this month.',
    ctaText: 'Schedule Architecture Session',
    ctaPage: 'consultation'
  },
  letterhead: {
    companyName: 'DEROYALTECH SYSTEMS LIMITED',
    tagline: 'Enterprise Cloud Infrastructure · Custom CRM · Hardware Telemetry',
    physicalAddress: 'Standard Chartered Bldg, Airport City, Accra, Ghana',
    phone: '+233 (0) 30 294 8821',
    email: 'enterprise@deroyaltech.com',
    website: 'https://deroyal.tech',
    regNumber: 'RC-2024-8921',
    sealText: 'AUTHENTICATED • DEROYALTECH SYSTEMS ACCRA'
  }
};

export const COMPANY_SERVICES: ServiceItem[] = [
  {
    id: 'web-software',
    category: 'software',
    number: '01',
    title: 'Custom Website & Software Engineering',
    shortDesc: 'Bespoke web platforms, scalable microservices, and enterprise web applications engineered for speed, security, and continuous deployment.',
    fullDesc: 'We architect and build end-to-end software solutions customized to your exact operational workflows. From high-throughput APIs to customer-facing web platforms, our engineers deliver maintainable codebases backed by automated testing, high availability, and modern frontend frameworks.',
    iconName: 'Code2',
    startingPrice: 45000,
    keyFeatures: [
      'Modern Single Page & Server-Rendered Applications',
      'Microservices & RESTful / GraphQL / gRPC APIs',
      'Enterprise Role-Based Access Control (RBAC)',
      'Automated CI/CD Pipelines & Continuous Delivery',
      'Zero-Trust Data Protection & SOC 2 Compliance'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Go', 'Next.js', 'PostgreSQL', 'Redis'],
    deliverables: ['Production Web Application', 'Source Repository & IaC', 'API Documentation', 'Automated Test Suite'],
    businessOutcome: 'Scalable platforms that eliminate manual operational bottlenecks and handle enterprise traffic without degraded latency.'
  },
  {
    id: 'mobile-dev',
    category: 'mobile',
    number: '02',
    title: 'Native & Cross-Platform Mobile Apps',
    shortDesc: 'High-performance iOS and Android applications with offline-first synchronization, peripheral hardware bridging, and biometric security.',
    fullDesc: 'Whether you require an executive portal, a field-agent operations tool, or a consumer marketplace app, DeRoyalTech builds resilient mobile applications. Our mobile engineering incorporates background synchronization, Bluetooth Low Energy (BLE) peripheral pairing, and native hardware telemetry.',
    iconName: 'Smartphone',
    startingPrice: 38000,
    keyFeatures: [
      'Native iOS (Swift) & Android (Kotlin) Development',
      'High-Efficiency Cross-Platform (React Native / Flutter)',
      'Offline-First Database Sync with Conflict Resolution',
      'Bluetooth LE, RFID, & Barcode Peripheral Interfacing',
      'Biometric Authentication & Secure Hardware Enclave'
    ],
    techStack: ['Swift', 'Kotlin', 'React Native', 'SQLite / WatermelonDB', 'Bluetooth LE', 'WebSockets'],
    deliverables: ['App Store & Play Store Submissions', 'SDK Integration Modules', 'Offline Sync Engine', 'QA Test Automation'],
    businessOutcome: 'Empowered frontline teams and mobile customers with responsive, hardware-aware mobile applications that operate reliably anywhere.'
  },
  {
    id: 'custom-crm',
    category: 'crm',
    number: '03',
    title: 'Custom CRM Solutions & Business Growth',
    shortDesc: 'Tailored CRM systems that replace fragmented SaaS tools, automate complex sales pipelines, and provide complete client visibility.',
    fullDesc: 'Off-the-shelf CRMs force your organization into rigid workflows that stifle growth. DeRoyalTech engineers custom CRM architectures mapped precisely to your sales, fulfillment, and client onboarding sequences. Built with custom reporting, client portals, telemetry integration, and bi-directional ERP connectivity.',
    iconName: 'Database',
    startingPrice: 65000,
    keyFeatures: [
      'Custom Multi-Stage Pipeline Automation & Rules Engine',
      'Unified Customer 360 & Interaction Timeline',
      'Secure B2B Client Self-Service Portals',
      'Bi-directional ERP, Billing, & Inventory Sync',
      'Granular Field-Level Permissions & Audit Trails'
    ],
    techStack: ['React', 'Node.js / Express', 'PostgreSQL', 'Apache Kafka', 'Tailwind CSS', 'Docker'],
    deliverables: ['Custom CRM Web & Mobile Portal', 'Data Migration from Legacy Systems', 'Automated Email & Webhook Engine', 'Custom Analytics Dashboards'],
    businessOutcome: 'A 40%–60% reduction in sales administration time, unified customer records, and elimination of compounding per-seat SaaS license fees.'
  },
  {
    id: 'cloud-infrastructure',
    category: 'cloud',
    number: '04',
    title: 'Cloud Infrastructure & DevOps Management',
    shortDesc: 'Multi-cloud architectures, Kubernetes orchestration, infrastructure as code (Terraform), and proactive 24/7 reliability management.',
    fullDesc: 'DeRoyalTech manages and scales cloud infrastructure to protect business continuity. We construct automated Terraform environments, configure autoscaling Kubernetes clusters, implement secure zero-trust networking, and provide real-time Prometheus/Grafana monitoring to guarantee high uptime and lean cloud spend.',
    iconName: 'Cloud',
    startingPrice: 50000,
    keyFeatures: [
      'Multi-Cloud Strategy across AWS, Google Cloud, & Azure',
      'Kubernetes (EKS/GKE) Container Orchestration & Autoscaling',
      'Infrastructure as Code (Terraform & Pulumi)',
      'Zero-Downtime Blue/Green & Canary Deployments',
      'Disaster Recovery, Automated Backups & RPO < 5 Mins'
    ],
    techStack: ['AWS', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'Grafana', 'Cloudflare'],
    deliverables: ['Production Cloud Architecture', 'Automated Disaster Recovery Runbook', 'Cloud Cost Optimization Audit', 'Continuous Monitoring Dashboards'],
    businessOutcome: '99.98% guaranteed SLA uptime with optimized cloud compute utilization that cuts infrastructure spend by up to 35%.'
  },
  {
    id: 'hardware-integration',
    category: 'hardware-integration',
    number: '05',
    title: 'Hardware Integration & Complex Data Workflows',
    shortDesc: 'Bridge physical hardware devices, edge telemetry, and enterprise software to automate data capture and elevate operational efficiency.',
    fullDesc: 'Eliminate manual data transcription and fragmented device silos. DeRoyalTech designs hardware-software bridges connecting warehouse RFID readers, industrial PLC controllers, POS terminals, biometric readers, and environmental IoT sensors directly into your custom CRM and cloud data streams in sub-second intervals.',
    iconName: 'Cpu',
    startingPrice: 55000,
    keyFeatures: [
      'Industrial Protocol Support (MQTT, Modbus, OPC-UA, CANbus)',
      'Low-Latency Edge Computing & Local Cache Forwarding',
      'Real-Time Telemetry Streaming to CRM & Cloud Pipelines',
      'Automated Hardware Device Health & Remote Firmware Updates',
      'Custom Driver & Peripheral SDK Development'
    ],
    techStack: ['Embedded C/C++', 'Rust', 'MQTT', 'gRPC', 'WebSockets', 'Python Edge', 'TimescaleDB'],
    deliverables: ['Edge Gateway Firmware & Drivers', 'Cloud Telemetry Ingestion Pipeline', 'Hardware Simulator & Test Bench', 'Diagnostic Dashboard'],
    businessOutcome: 'Real-time data integrity from physical operations to the executive dashboard, eradicating human error and inventory reconciliation lags.'
  },
  {
    id: 'computer-hardware',
    category: 'peripherals',
    number: '06',
    title: 'Computer Hardware & Enterprise Peripherals',
    shortDesc: 'Direct procurement, staging, and deployment of enterprise workstations, high-density server racks, industrial scanners, and ergonomic peripherals.',
    fullDesc: 'DeRoyalTech delivers end-to-end hardware supply chain services. We configure and supply high-performance workstations, custom 1U/2U server nodes, industrial-grade barcode scanners, POS peripherals, commercial 5K displays, and enterprise docking stations thoroughly tested for software compatibility.',
    iconName: 'Server',
    startingPrice: 25000,
    keyFeatures: [
      'Enterprise Workstations Custom Configured for Engineering',
      'High-Density 1U/2U Rack Servers & Storage Arrays',
      'Industrial Handheld 2D/RFID Scanners & Smart Terminals',
      'Multi-Monitor 5K Displays & Thunderbolt 4 Docking Ecosystems',
      'Pre-Provisioned OS, Security Hardening & Asset Tagging'
    ],
    techStack: ['Intel Xeon / AMD EPYC', 'NVIDIA Enterprise RTX', 'Zebra & Honeywell Hardware', 'Thunderbolt 4', 'TPM 2.0'],
    deliverables: ['Pre-Configured Enterprise Hardware', 'Hardware Compatibility Matrix', 'Comprehensive Manufacturer Warranties', 'On-Site Staging & Deployment'],
    businessOutcome: 'Zero-friction hardware onboarding with pre-tested peripheral compatibility and single-vendor accountability for both software and equipment.'
  }
];

export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    id: 'prj-kofi-logistics',
    title: 'Kofi & Sons OmniChannel CRM & Warehouse Peripheral Sync',
    client: 'Kofi & Sons Logistics Ltd',
    industry: 'Supply Chain & Freight Haulage',
    category: 'crm',
    completionDate: 'October 2026',
    summary: 'Turnkey custom CRM platform interconnected with 120 handheld industrial RFID barcode scanners across Accra, Tema Port, and Kumasi depots for instantaneous manifest clearing.',
    liveUrl: 'https://kofi-logistics-crm.deroyaltech.com',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoThumbnail: '/src/assets/images/case_study_crm_platform_1793611778711.jpg',
    deliverables: [
      'Multi-Branch Custom CRM Web Portal',
      'Real-time Tema Port Clearance Queue Dashboard',
      'Custom Android Handheld App with Bluetooth RFID Reader',
      '120 Staged & Imaged Handheld Rugged Scanners'
    ],
    metrics: [
      { label: 'Dispatch Velocity', value: '+210%' },
      { label: 'Cargo Tracking Loss', value: '0%' },
      { label: 'Scan-to-Cloud Sync', value: '42ms' }
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'MQTT', 'RFID Hardware', 'Docker'],
    verifiedDeliveryBadge: 'Production Live in Ghana & West Africa',
    clientCountry: 'Ghana'
  },
  {
    id: 'prj-goldcoast-cloud',
    title: 'GoldCoast Microfinance Core Banking & Multi-Cloud Infrastructure',
    client: 'GoldCoast Microfinance Group',
    industry: 'Financial Services & Banking',
    category: 'cloud',
    completionDate: 'August 2026',
    summary: 'Migrated 38 branch offices to an active-active Kubernetes infrastructure on AWS & Google Cloud with zero downtime and strict Bank of Ghana data sovereignty compliance.',
    liveUrl: 'https://goldcoast-banking.deroyaltech.com',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoThumbnail: '/src/assets/images/case_study_cloud_datacenter_1793611779631.jpg',
    deliverables: [
      'Multi-Cloud Terraform Infrastructure as Code',
      'Encrypted Kubernetes Clusters with Automated Backup',
      'Financial Regulatory Compliance & Audit Logs',
      '24/7 Automated Prometheus SRE Alerting'
    ],
    metrics: [
      { label: 'System Uptime SLA', value: '99.995%' },
      { label: 'Transaction Latency', value: '38ms' },
      { label: 'Cloud Hosting Savings', value: '42%' }
    ],
    techStack: ['Kubernetes', 'Terraform', 'Go', 'AWS EKS', 'Google Cloud', 'PostgreSQL BDR'],
    verifiedDeliveryBadge: 'Bank of Ghana Regulated Production Stack',
    clientCountry: 'Ghana'
  },
  {
    id: 'prj-volta-agri-telemetry',
    title: 'Volta Agri-Commodities Weighbridge Telemetry & Edge Hub',
    client: 'Volta Basin Agro-Enterprises',
    industry: 'Agriculture & Processing',
    category: 'hardware',
    completionDate: 'June 2026',
    summary: 'Equipped 14 cocoa and grain collection stations with 1U edge gateway servers, industrial weighbridge scale bridges, and moisture sensor networks directly piping data into DeRoyalTech CRM.',
    liveUrl: 'https://volta-agri-hub.deroyaltech.com',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumbnail: '/src/assets/images/case_study_hardware_iot_1793611780107.jpg',
    deliverables: [
      '14x Industrial 1U Edge Gateway Servers with Modbus Integration',
      'Offline-First Weighbridge Logging Software',
      'Farmer Payout Calculation & Mobile Money Webhook',
      'Executive Crop Yield & Weighing Dashboard'
    ],
    metrics: [
      { label: 'Weighbridge Reconciliation', value: 'Instant (<1s)' },
      { label: 'Farmer Payment Cycle', value: '3 mins vs 4 days' },
      { label: 'Discrepancy Fraud', value: '-99.4%' }
    ],
    techStack: ['Rust', 'Python Edge', 'Modbus RTU', 'Kafka', 'React Native', 'TimescaleDB'],
    verifiedDeliveryBadge: 'Operational Across Volta & Eastern Region',
    clientCountry: 'Ghana'
  },
  {
    id: 'prj-afriair-mobile',
    title: 'AfriAir Aviation Fleet Inspection Suite & BLE Diagnostic App',
    client: 'AfriAir Regional Services',
    industry: 'Commercial Aviation Maintenance',
    category: 'mobile',
    completionDate: 'May 2026',
    summary: 'Native iPad & Android tablet application pairing over Bluetooth Low Energy with ultrasonic flaw detectors for rapid aircraft turnaround at Kotoka International Airport.',
    liveUrl: 'https://afriair-fleet.deroyaltech.com',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoThumbnail: '/src/assets/images/case_study_crm_platform_1793611778711.jpg',
    deliverables: [
      'Offline-First iOS (Swift) & Android (Kotlin) Tablet Apps',
      'BLE Ultrasonic Flaw Detector Hardware Bridge',
      'Automated GCAA Inspection Compliance Certificate Generator',
      'Cloud Sync Engine with Delta Cryptographic Verification'
    ],
    metrics: [
      { label: 'Inspection Turnaround', value: '55% Faster' },
      { label: 'Paper Manifests', value: '100% Eliminated' },
      { label: 'Audit Compliance', value: '100% Perfect' }
    ],
    techStack: ['Swift', 'Kotlin', 'Bluetooth LE', 'SQLite', 'Node.js', 'Express'],
    verifiedDeliveryBadge: 'Certified for Kotoka International Airport (KIA)',
    clientCountry: 'Ghana'
  },
  {
    id: 'prj-accra-medlab-hardware',
    title: 'Accra MedLab High-Throughput Diagnostic Workstations Fleet',
    client: 'Accra Premier Diagnostics',
    industry: 'Healthcare & Life Sciences',
    category: 'web',
    completionDate: 'March 2026',
    summary: 'Procured, imaged, and deployed 65 high-performance DeRoyalTech Pro-X workstations with 5K dual displays and automated lab information system (LIS) integrations.',
    liveUrl: 'https://accramedlab-portal.deroyaltech.com',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoThumbnail: '/src/assets/images/hardware_peripherals_catalog_1793611780289.jpg',
    deliverables: [
      '65x Custom Pre-Configured Pro-X Workstations',
      '130x 5K Color-Calibrated Diagnostic Monitors',
      'Custom Pathology Lab Result Web Application',
      '3-Year 24/7 On-Site Hardware Replacement SLA'
    ],
    metrics: [
      { label: 'Diagnostic Turnaround', value: '4x Faster' },
      { label: 'Hardware Downtime', value: '0 Hours' },
      { label: 'Deploy Time', value: 'Completed in 14 Days' }
    ],
    techStack: ['AMD Threadripper', 'NVIDIA RTX', 'React', 'TypeScript', 'HL7 / FHIR Medical API'],
    verifiedDeliveryBadge: 'Installed at Ridge & Airport Residential Labs',
    clientCountry: 'Ghana'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'nexus-crm-hardware',
    title: 'Omnichannel B2B CRM & Warehouse Peripheral Sync',
    client: 'Nexus Global Logistics (West Africa)',
    industry: 'Logistics & Supply Chain',
    category: 'crm',
    timeframe: '8 Months',
    summary: 'A unified custom CRM and warehouse operations system synchronizing 85 handheld industrial RFID scanners directly with dispatch pipelines in real time.',
    challenge: 'Nexus was using three disconnected software suites and paper manifests. Warehouse workers scanned goods on proprietary terminals that required overnight batch export, causing stock discrepancies and delayed order fulfillments.',
    solution: 'DeRoyalTech engineered a custom CRM platform with an edge integration layer. Handheld RFID scanners stream scan events via MQTT to an on-premise gateway that updates order records and CRM inventory states within 80 milliseconds.',
    results: [
      { metric: '+185%', label: 'Sales Pipeline Velocity' },
      { metric: '-92%', label: 'Order Processing Errors' },
      { metric: '80ms', label: 'Average Hardware Scan-to-CRM Sync' }
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'MQTT', 'Industrial RFID Hardware', 'Docker'],
    image: '/src/assets/images/case_study_crm_platform_1793611778711.jpg',
    testimonial: {
      quote: 'DeRoyalTech took our chaotic warehouse hardware and outdated CRM and merged them into a lightning-fast operational platform. Our team now dispatches shipments in minutes rather than days.',
      author: 'Marcus Vance',
      role: 'Chief Operating Officer',
      company: 'Nexus Global Logistics'
    },
    architecturalHighlights: [
      'Bidirectional WebSocket bridge between warehouse handhelds and CRM UI',
      'Automated dispatch order generation triggered by physical dock weight sensors',
      'Offline store-and-forward buffer on edge gateways ensuring zero scan loss'
    ]
  },
  {
    id: 'finguard-cloud-infra',
    title: 'Multi-Region Kubernetes Migration & Zero-Downtime Infrastructure',
    client: 'FinGuard Capital',
    industry: 'Financial Technology',
    category: 'cloud',
    timeframe: '5 Months',
    summary: 'Re-architected monolithic legacy financial trading APIs into an automated multi-region Kubernetes cluster on AWS and GCP with 99.99% uptime SLA.',
    challenge: 'Sudden market volatility spikes caused FinGuard legacy cloud instances to choke, driving latency past 2.8 seconds and costing millions in missed transactions during trading volume peaks.',
    solution: 'Constructed an automated Infrastructure-as-Code (Terraform) blueprint spanning dual cloud providers. Deployed autoscaling Kubernetes nodes with Cilium service mesh, sub-millisecond Redis caching, and automated Canary traffic shifting.',
    results: [
      { metric: '99.99%', label: 'Measured Uptime SLA' },
      { metric: '-74%', label: 'P99 Latency Reduction (2.8s to 42ms)' },
      { metric: '-38%', label: 'Annual Cloud Infrastructure Cost' }
    ],
    techStack: ['Kubernetes', 'AWS EKS', 'GCP', 'Terraform', 'Prometheus', 'Redis Cluster', 'Go'],
    image: '/src/assets/images/case_study_cloud_datacenter_1793611779631.jpg',
    testimonial: {
      quote: 'The architectural precision of DeRoyalTech is unmatched. Our infrastructure scaled effortlessly during the highest market volatility week of the year without a single dropped packet.',
      author: 'Elena Rostova',
      role: 'VP of Platform Engineering',
      company: 'FinGuard Capital'
    },
    architecturalHighlights: [
      'Multi-cloud active-active routing with automatic geo-DNS failover',
      'Automated autoscaling triggers scaling pod capacity in under 12 seconds',
      'Immutable audit trails and encryption meeting strict regulatory requirements'
    ]
  },
  {
    id: 'vanguard-industrial-iot',
    title: 'Industrial Telemetry Gateway & Fleet Peripheral Integration',
    client: 'Vanguard Heavy Industries',
    industry: 'Advanced Manufacturing',
    category: 'hardware',
    timeframe: '6 Months',
    summary: 'Connected 12,000 industrial sensors and PLC automation nodes across 4 assembly plants directly to real-time predictive maintenance software.',
    challenge: 'Factory floor equipment experienced unexpected bearing failures resulting in unscheduled downtime costing GH₵ 680,000 per hour, with no centralized hardware telemetry dashboard.',
    solution: 'Designed and supplied custom industrial edge gateways, calibrated vibration and thermal sensors, and built an event-driven telemetry pipeline routing data to cloud machine-learning models.',
    results: [
      { metric: '12,000', label: 'Monitored Sensor & Peripheral Endpoints' },
      { metric: 'GH₵ 21M', label: 'Saved Downtime Costs' },
      { metric: '<30ms', label: 'Edge Anomaly Alert Dispatch' }
    ],
    techStack: ['Rust', 'Embedded C', 'MQTT Gateway', 'Kafka', 'TimescaleDB', 'React Dashboard'],
    image: '/src/assets/images/case_study_hardware_iot_1793611780107.jpg',
    testimonial: {
      quote: 'DeRoyalTech engineered the entire stack from physical sensors on our CNC presses to the executive monitoring console. It transformed our maintenance strategy completely.',
      author: 'David Lindqvist',
      role: 'Director of Plant Automation',
      company: 'Vanguard Heavy Industries'
    },
    architecturalHighlights: [
      'Ruggedized edge processors running local FFT signal processing',
      'Dual SIM cellular fallback ensuring continuous uplink during factory network outages',
      'Direct integration with enterprise ERP spare parts procurement'
    ]
  }
];

export const HARDWARE_PRODUCTS: HardwareProduct[] = [
  {
    id: 'hw-workstation-prox',
    name: 'DeRoyalTech Pro-X Engineering Workstation',
    category: 'workstations',
    sku: 'DRT-WS-9950X',
    price: 58500, // In Ghanaian Cedis (GH₵)
    rating: 4.9,
    tagline: 'High-density computational performance for software compilation & 3D workflows.',
    specs: {
      Processor: 'AMD Ryzen 9 9950X (16-Core / 32-Thread 5.7GHz)',
      Memory: '64GB DDR5 6000MHz ECC Support (Up to 192GB)',
      Graphics: 'NVIDIA RTX 4080 Super 16GB VRAM',
      Storage: '2TB PCIe Gen 5 NVMe SSD (12,400 MB/s)',
      Networking: 'Dual 2.5GbE LAN + Wi-Fi 7 + Bluetooth 5.4',
      Chassis: 'Acoustically dampened brushed anodized aluminum'
    },
    stockStatus: 'Fast Ship',
    warranty: '3-Year On-Site Hardware Replacement Warranty in Ghana',
    integrationReady: 'Pre-installed with Docker, Linux/Windows Dual-Boot & Dev Toolchains',
    badge: 'Enterprise Flagship',
    description: 'Engineered specifically for full-stack software teams, machine learning prototyping, and heavy CAD workloads. Rigorously burn-in tested for 72 hours under full thermal load before dispatch.',
    imageUrl: '/src/assets/images/hardware_peripherals_catalog_1793611780289.jpg'
  },
  {
    id: 'hw-edge-gateway-1u',
    name: 'Industrial Edge Gateway Server 1U',
    category: 'networking',
    sku: 'DRT-EDG-1000',
    price: 29800, // In Ghanaian Cedis (GH₵)
    rating: 4.9,
    tagline: 'Low-latency rackmount telemetry hub for factory floors and distributed branches.',
    specs: {
      Processor: 'Intel Xeon D-1700 (8 Cores, Low-Power Fanless Design)',
      Ports: '2x 10GbE SFP+ Fiber + 4x 2.5GbE PoE+ Ports',
      Telemetry: 'Isolated RS-485 / Modbus / CANbus interfaces',
      Security: 'Hardware TPM 2.0 cryptoprocessor + Secure Boot',
      OperatingTemp: '-20°C to +70°C industrial rating',
      Power: 'Dual Redundant Hot-Swappable 250W AC/DC Supplies'
    },
    stockStatus: 'In Stock',
    warranty: '5-Year Industrial Grade Warranty',
    integrationReady: 'Native MQTT broker & DeRoyalTech CRM cloud sync daemon',
    badge: 'Hardware Telemetry',
    description: 'The heartbeat of physical hardware integration. Collects data packets from thousands of field sensors and peripheral scanners, decrypts payloads at the edge, and transmits to your cloud in sub-20ms.',
    imageUrl: '/src/assets/images/case_study_cloud_datacenter_1793611779631.jpg'
  },
  {
    id: 'hw-display-ultrawide',
    name: 'DeRoyalTech Vision 40" 5K HDR Precision Display',
    category: 'displays-docks',
    sku: 'DRT-DSP-405K',
    price: 21500, // In Ghanaian Cedis (GH₵)
    rating: 4.8,
    tagline: 'Expansive 5120x2160 IPS Black display with integrated Thunderbolt 4 KVM.',
    specs: {
      Resolution: '5K2K (5120 x 2160) at 120Hz Refresh Rate',
      ColorAccuracy: '99% DCI-P3, Delta E < 1.0 Factory Calibrated',
      Connectivity: 'Thunderbolt 4 (96W Power Delivery), 2x HDMI 2.1, DP 1.4',
      Features: 'Built-in Auto-KVM, Ambient Light Sensor, Zero-Bezel',
      Ergonomics: 'Height, Tilt, Swivel precision counterbalanced stand'
    },
    stockStatus: 'In Stock',
    warranty: '3-Year Zero-Dead-Pixel Guarantee',
    integrationReady: 'Single cable dock connects keyboard, mouse, and multi-network',
    badge: 'Best for Developers',
    description: 'Replaces dual-monitor clutter with an expansive, color-true canvas. Built-in Thunderbolt 4 delivers single-cable charging, high-speed peripherals, and 2.5Gb ethernet to your laptop.',
    imageUrl: '/src/assets/images/case_study_crm_platform_1793611778711.jpg'
  },
  {
    id: 'hw-scanner-rfid',
    name: 'DeRoyalTech Handheld 2D / RFID Enterprise Scanner',
    category: 'scanners-pos',
    sku: 'DRT-SCN-200X',
    price: 9800, // In Ghanaian Cedis (GH₵)
    rating: 5.0,
    tagline: 'Ruggedized IP68 wireless scanner with instant CRM & inventory webhook sync.',
    specs: {
      ScanEngine: 'High-speed 1D/2D imager + UHF Gen 2 RFID (6-meter read range)',
      Connectivity: 'Wi-Fi 6E (802.11ax), Bluetooth 5.3 LE, USB-C Cradle',
      DropSpec: 'Survives 2.4-meter drops onto concrete surfaces',
      Battery: '5,000 mAh hot-swappable battery (18+ hours continuous scan)',
      Display: '2.8" Sunlight-readable OLED touch feedback screen'
    },
    stockStatus: 'In Stock',
    warranty: '3-Year Comprehensive Accidental Damage Warranty',
    integrationReady: 'Configured out of the box to pipe scans directly into custom CRM API',
    badge: 'Workflow Streamliner',
    description: 'Designed for logistics, inventory control, and retail fulfillment. Features instant tactile haptic feedback, audible tone confirmation, and automatic offline caching when out of range.',
    imageUrl: '/src/assets/images/case_study_hardware_iot_1793611780107.jpg'
  },
  {
    id: 'hw-dock-thunderbolt',
    name: 'Titan Thunderbolt 4 Multi-Display Enterprise Dock',
    category: 'displays-docks',
    sku: 'DRT-DCK-TB4',
    price: 4800, // In Ghanaian Cedis (GH₵)
    rating: 4.9,
    tagline: 'Universal 16-port docking station with 140W fast charge and quad 4K output.',
    specs: {
      Upstream: 'Thunderbolt 4 / USB4 with up to 140W Host Charging',
      VideoOutputs: '2x HDMI 2.1 + 2x DisplayPort 1.4 (Quad 4K or Dual 8K)',
      USBPorts: '5x USB-A 3.2 Gen 2 (10Gbps), 3x USB-C (10Gbps with 20W PD)',
      AudioNetwork: '2.5GbE RJ45 Ethernet + 3.5mm Hi-Res Audio Combo Jack',
      CardReader: 'UHS-II SD & MicroSD high-speed media slots'
    },
    stockStatus: 'In Stock',
    warranty: '2-Year Direct Advance Replacement',
    integrationReady: 'Compatible with macOS, Windows 11, and Linux Enterprise',
    description: 'A bulletproof docking centerpiece for developer and executive workstations. Eliminates cable strain and connects all desktop peripherals seamlessly through a single braided connection.',
    imageUrl: '/src/assets/images/hardware_peripherals_catalog_1793611780289.jpg'
  },
  {
    id: 'hw-input-ergonomic-kit',
    name: 'Precision Mechanical Workstation Keyboard & Mouse Suite',
    category: 'displays-docks',
    sku: 'DRT-KBM-PRO',
    price: 3600, // In Ghanaian Cedis (GH₵)
    rating: 4.8,
    tagline: 'Acoustically tuned tactile mechanical board with ergonomic magnetic scroll mouse.',
    specs: {
      Switches: 'Factory-lubed Gateron Silent Tactile switches (Hot-Swappable)',
      Keycaps: 'Double-shot PBT keycaps with Mac/Windows dual legends',
      MouseSensor: '4,000 DPI Darkfield high-precision sensor works on glass',
      BatteryLife: 'Up to 90 days on USB-C rechargeable internal battery',
      Connectivity: 'Tri-mode: Low-latency 2.4GHz RF, Bluetooth 5.1 (3 devices), USB-C'
    },
    stockStatus: 'In Stock',
    warranty: '2-Year Comprehensive Warranty',
    integrationReady: 'Program custom macro keys for git operations and CRM shortcuts',
    description: 'Engineered for intensive coding and operations sessions. Custom sound dampening gaskets minimize typing fatigue and ambient office noise while preserving crisp tactile actuation.',
    imageUrl: '/src/assets/images/hardware_peripherals_catalog_1793611780289.jpg'
  },
  {
    id: 'hw-smart-pos-terminal',
    name: 'OmniPay Smart POS & Biometric Peripheral Terminal',
    category: 'scanners-pos',
    sku: 'DRT-POS-450',
    price: 13500, // In Ghanaian Cedis (GH₵)
    rating: 4.9,
    tagline: 'PCI-PTS 6.x certified payment terminal with biometric fingerprint and NFC.',
    specs: {
      Display: '8.0" IPS Anti-glare HD Touchscreen + 4.3" Customer Display',
      PaymentMethods: 'EMV Chip, Contactless NFC, Magnetic Stripe, QR/Barcode',
      Biometrics: 'FIPS 201 compliant capacitive optical fingerprint scanner',
      Printer: 'High-speed integrated thermal receipt printer (100mm/s)',
      Connectivity: 'Dual-band Wi-Fi, 4G LTE SIM backup, Gigabit Ethernet'
    },
    stockStatus: 'Fast Ship',
    warranty: '3-Year Business Critical Exchange',
    integrationReady: 'Direct Webhook and REST API connectivity to custom CRM records',
    badge: 'Enterprise POS',
    description: 'Combines payment processing, customer loyalty check-in, and employee time logging into an all-in-one hardened terminal. Directly communicates with DeRoyalTech CRM sales records.',
    imageUrl: '/src/assets/images/case_study_crm_platform_1793611778711.jpg'
  },
  {
    id: 'hw-network-switch-poe',
    name: 'DeRoyalTech Core 24-Port 10G Managed PoE++ Switch',
    category: 'networking',
    sku: 'DRT-NET-24POE',
    price: 24900, // In Ghanaian Cedis (GH₵)
    rating: 4.9,
    tagline: 'High-bandwidth distribution switch powering industrial cameras, APs & IoT gateways.',
    specs: {
      Ports: '16x 2.5GbE PoE++ (90W) + 8x 10GbE SFP+ Uplinks',
      PoEBudget: '740W total power budget with intelligent power allocation',
      SwitchingCap: '240 Gbps non-blocking switching throughput',
      Management: 'Cloud Dashboard, CLI, SNMPv3, REST API configuration',
      FormFactor: '1U Rackmount with front-to-back quiet cooling'
    },
    stockStatus: 'In Stock',
    warranty: 'Lifetime Limited Hardware Warranty',
    integrationReady: 'Integrates with DeRoyalTech Cloud Infrastructure monitoring',
    description: 'Supplies clean power and ultra-wide network bandwidth to demanding enterprise peripherals. Built-in network isolation VLANs keep hardware IoT traffic cleanly separated from office workstations.',
    imageUrl: '/src/assets/images/case_study_cloud_datacenter_1793611779631.jpg'
  }
];

export const TRUST_METRICS = [
  { value: '99.98%', label: 'Infrastructure Availability', detail: 'Across all managed cloud clusters' },
  { value: '140+', label: 'Software & Mobile Apps Shipped', detail: 'Production systems worldwide' },
  { value: '2.4M+', label: 'Daily Telemetry Packets', detail: 'From integrated hardware peripherals' },
  { value: '<45ms', label: 'Edge-to-Cloud CRM Latency', detail: 'Real-time operational sync' }
];

export const CLIENT_TESTIMONIALS = [
  {
    id: 'test-1',
    author: 'Marcus Vance',
    role: 'Chief Operating Officer',
    company: 'Nexus Global Logistics',
    content: 'DeRoyalTech took our chaotic warehouse hardware and outdated CRM and merged them into a lightning-fast operational platform. Our team now dispatches shipments in minutes rather than days.',
    metric: '+185% Sales Velocity',
    industry: 'Logistics'
  },
  {
    id: 'test-2',
    author: 'Elena Rostova',
    role: 'VP of Platform Engineering',
    company: 'FinGuard Capital',
    content: 'The architectural precision of DeRoyalTech is unmatched. Our infrastructure scaled effortlessly during the highest market volatility week of the year without a single dropped packet.',
    metric: '99.99% Measured Uptime',
    industry: 'FinTech'
  },
  {
    id: 'test-3',
    author: 'David Lindqvist',
    role: 'Director of Plant Automation',
    company: 'Vanguard Heavy Industries',
    content: 'DeRoyalTech engineered the entire stack from physical sensors on our CNC presses to the executive monitoring console. It transformed our maintenance strategy completely.',
    metric: 'GH₵ 21M Saved Downtime',
    industry: 'Industrial Manufacturing'
  }
];

// ==================== DEFAULT LIVE SUPPORT THREADS ====================
export const DEFAULT_CHAT_THREADS: ChatThread[] = [
  {
    id: 'chat-asante-01',
    clientId: 'user-partner-asante',
    clientName: 'Kwame Asante',
    clientEmail: 'k.asante@ghana-enterprises.com',
    clientCompany: 'Asante Logistics & Technology Ltd',
    clientPhone: '+233 24 590 1284',
    subject: 'Port RFID Gateway Calibration & Tracking DRT-2026-7841',
    status: 'active',
    priority: 'high',
    projectId: 'DRT-2026-7841',
    createdAt: '2026-11-01T10:15:00Z',
    updatedAt: '2026-11-02T08:30:00Z',
    unreadCountForAdmin: 0,
    unreadCountForClient: 0,
    assignedAdmin: 'DeRoyalTech Systems Lead',
    messages: [
      {
        id: 'msg-1',
        sender: 'client',
        senderName: 'Kwame Asante',
        message: 'Good morning DeRoyalTech team. We received the first batch of 12 OmniPay Gateways at the Tema transit depot. How soon can we conduct the live telemetry bridge test with our custom CRM?',
        timestamp: '2026-11-01T10:15:00Z'
      },
      {
        id: 'msg-2',
        sender: 'admin',
        senderName: 'Admin / Systems Lead',
        message: 'Hello Kwame! Excellent news. Our engineering team has already verified the TLS certificates on your gateway firmware. We have scheduled the integration test for 2:00 PM GMT today. You can monitor progress under Project Tracker ID: DRT-2026-7841.',
        timestamp: '2026-11-01T10:32:00Z'
      },
      {
        id: 'msg-3',
        sender: 'client',
        senderName: 'Kwame Asante',
        message: 'Thank you! The live tracker shows 68% completion, which matches our rollout timeline perfectly.',
        timestamp: '2026-11-02T08:30:00Z'
      }
    ]
  },
  {
    id: 'chat-mensah-02',
    clientId: 'user-pending-mensah',
    clientName: 'Ama Mensah',
    clientEmail: 'ama.mensah@accra-retail.com',
    clientCompany: 'Accra Retail Ventures',
    clientPhone: '+233 20 445 1928',
    subject: 'Inquiry on Multi-Branch POS Rollout & Custom CRM Sync',
    status: 'waiting_admin',
    priority: 'normal',
    createdAt: '2026-11-02T07:10:00Z',
    updatedAt: '2026-11-02T07:10:00Z',
    unreadCountForAdmin: 1,
    unreadCountForClient: 0,
    messages: [
      {
        id: 'msg-m-1',
        sender: 'client',
        senderName: 'Ama Mensah',
        message: 'Hello DeRoyalTech support. We operate 6 supermarket branches in Accra and Kumasi. We need custom inventory software connected to biometric POS terminals. Can you confirm if your hardware comes with on-site warranty in Ghana?',
        timestamp: '2026-11-02T07:10:00Z'
      }
    ]
  }
];

// ==================== DEFAULT SERVICE REQUESTS ====================
export const DEFAULT_SERVICE_REQUESTS: ServiceProjectRequest[] = [
  {
    id: 'REQ-2026-108',
    createdAt: '2026-10-28T09:20:00Z',
    clientId: 'user-partner-asante',
    clientName: 'Kwame Asante',
    clientEmail: 'k.asante@ghana-enterprises.com',
    clientPhone: '+233 24 590 1284',
    clientCompany: 'Asante Logistics & Technology Ltd',
    serviceId: 'custom-crm',
    serviceTitle: 'Custom CRM Solutions & Business Growth',
    projectTitle: 'Maritime Port Cargo Dispatch & Warehouse Sensor Bridge',
    description: 'Real-time cargo tracking platform interfacing 120 warehouse RFID scanners with custom CRM pipeline across Tema & Takoradi ports.',
    estimatedBudget: 95000,
    targetTimeline: '6-8 Weeks',
    hardwareIntegrationNeeded: true,
    status: 'confirmed',
    assignedProjectId: 'DRT-2026-7841',
    adminNotes: 'Tracker generated and milestone tracking live. Hardware modules calibrated.',
    confirmedAt: '2026-10-29T11:00:00Z'
  },
  {
    id: 'REQ-2026-109',
    createdAt: '2026-11-01T15:30:00Z',
    clientId: 'user-pending-mensah',
    clientName: 'Ama Mensah',
    clientEmail: 'ama.mensah@accra-retail.com',
    clientPhone: '+233 20 445 1928',
    clientCompany: 'Accra Retail Ventures',
    serviceId: 'hardware-integration',
    serviceTitle: 'Hardware Integration & Complex Data Workflows',
    projectTitle: 'Smart POS Hardware & Multi-Branch Realtime Inventory Hub',
    description: 'Supply and integration of 40 OmniPay Terminals and wireless barcode scanners synchronizing with central inventory database.',
    estimatedBudget: 72000,
    targetTimeline: '4-6 Weeks',
    hardwareIntegrationNeeded: true,
    status: 'pending',
    adminNotes: 'Awaiting site audit review before tracker assignment.'
  }
];

// ==================== DEFAULT TRACKED PROJECTS ====================
export const DEFAULT_TRACKED_PROJECTS: TrackedProject[] = [
  {
    projectId: 'DRT-2026-7841',
    requestId: 'REQ-2026-108',
    title: 'Maritime Port Cargo Dispatch & Warehouse Sensor Bridge',
    clientName: 'Kwame Asante',
    clientEmail: 'k.asante@ghana-enterprises.com',
    clientCompany: 'Asante Logistics & Technology Ltd',
    clientPhone: '+233 24 590 1284',
    serviceCategory: 'crm',
    serviceTitle: 'Custom CRM & Hardware Integration',
    stage: 'development',
    stageLabel: 'Firmware Telemetry Bridge & CRM Integration in Progress',
    progressPercent: 72,
    startDate: '2026-10-29',
    estimatedDeliveryDate: '2026-11-28',
    leadEngineer: 'Chief Systems Architect, DeRoyalTech',
    assignedTeam: ['Senior IoT Engineer', 'Lead Backend Architect', 'DevOps Specialist'],
    liveUrl: 'https://staging.deroyaltech.com/demo/asante-port',
    repositoryOrPortalUrl: 'https://portal.deroyaltech.com/asante-logistics',
    hardwareUnitsCount: 120,
    milestones: [
      {
        id: 'm1',
        title: 'Project Kickoff & Architecture Blueprint',
        description: 'Finalize network topology, port security compliance, and data schema specifications.',
        status: 'completed',
        completedAt: '2026-10-31',
        targetDate: '2026-10-31'
      },
      {
        id: 'm2',
        title: 'Hardware Peripheral Staging & Flashing',
        description: 'Staging 120 RFID terminals and edge gateways with custom encrypted firmware.',
        status: 'completed',
        completedAt: '2026-11-01',
        targetDate: '2026-11-02'
      },
      {
        id: 'm3',
        title: 'Custom CRM Pipeline & Telemetry Bridge',
        description: 'Sub-second Kafka event pipeline streaming manifest scanning data into CRM.',
        status: 'in_progress',
        targetDate: '2026-11-15'
      },
      {
        id: 'm4',
        title: 'Stress Testing & High-Throughput QA',
        description: 'Simulate 5,000 concurrent container transactions and automated failover.',
        status: 'pending',
        targetDate: '2026-11-22'
      },
      {
        id: 'm5',
        title: 'On-site Deployment & Port Operations Handover',
        description: 'Final physical staging at Tema & Takoradi terminals and staff certification.',
        status: 'pending',
        targetDate: '2026-11-28'
      }
    ],
    updatesLog: [
      {
        id: 'log-1',
        timestamp: '2026-11-02T08:00:00Z',
        title: 'Depot Gateway Firmware Verification Passed',
        note: 'All 12 edge gateways flashed with version 2.4.1. Ping latency to Accra cloud region clocked at 14ms.',
        author: 'Lead IoT Engineer',
        stageBadge: 'Hardware Staging'
      },
      {
        id: 'log-2',
        timestamp: '2026-11-01T16:30:00Z',
        title: 'Database Schema Migrated to Production Staging',
        note: 'PostgreSQL partitioned tables for high-frequency scan packets initialized successfully.',
        author: 'Lead Backend Architect',
        stageBadge: 'Database Core'
      },
      {
        id: 'log-3',
        timestamp: '2026-10-29T11:00:00Z',
        title: 'Project Formally Initialized & Approved',
        note: 'Service request confirmed. Milestone roadmap and hardware staging inventory locked.',
        author: 'DeRoyalTech Admin',
        stageBadge: 'Kickoff'
      }
    ],
    adminNotes: 'Priority enterprise partner. Weekly sync calls every Tuesday at 10 AM GMT.'
  },
  {
    projectId: 'DRT-2026-9024',
    title: 'Omni-Channel Retail POS Network & Cloud Synchronization',
    clientName: 'Emmanuel K. Danquah',
    clientEmail: 'e.danquah@goldcoast-retail.com',
    clientCompany: 'Gold Coast Retail & Supermarkets',
    clientPhone: '+233 20 882 1199',
    serviceCategory: 'hardware-integration',
    serviceTitle: 'POS Hardware Staging & Cloud Microservices',
    stage: 'testing_qa',
    stageLabel: 'Final Penetration Testing & Cash-Drawer Telemetry QA',
    progressPercent: 90,
    startDate: '2026-10-10',
    estimatedDeliveryDate: '2026-11-10',
    leadEngineer: 'Platform Security Lead, DeRoyalTech',
    assignedTeam: ['Hardware QA Engineer', 'Cloud Systems Specialist'],
    liveUrl: 'https://staging.deroyaltech.com/demo/goldcoast-pos',
    hardwareUnitsCount: 60,
    milestones: [
      {
        id: 'g-m1',
        title: 'Hardware Procurement & Component Benchmarking',
        description: 'Sourcing 60 heavy-duty thermal receipt units and biometric readers.',
        status: 'completed',
        completedAt: '2026-10-18',
        targetDate: '2026-10-18'
      },
      {
        id: 'g-m2',
        title: 'Cloud Inventory Microservices Deployment',
        description: 'Multi-region AWS cluster with automatic offline data caching for intermittent connections.',
        status: 'completed',
        completedAt: '2026-10-26',
        targetDate: '2026-10-26'
      },
      {
        id: 'g-m3',
        title: 'POS Firmware Integration & Test Cashouts',
        description: 'Hardware peripheral driver installation across all 60 stations.',
        status: 'completed',
        completedAt: '2026-11-01',
        targetDate: '2026-11-02'
      },
      {
        id: 'g-m4',
        title: 'Security Audit & Penetration Testing',
        description: 'Zero-trust network audit and payment gateway PCI DSS tokenization verification.',
        status: 'in_progress',
        targetDate: '2026-11-06'
      },
      {
        id: 'g-m5',
        title: 'Turnkey Store Launch & Operator Training',
        description: 'Go-live across 8 supermarket storefronts in Greater Accra.',
        status: 'pending',
        targetDate: '2026-11-10'
      }
    ],
    updatesLog: [
      {
        id: 'glog-1',
        timestamp: '2026-11-01T14:00:00Z',
        title: 'Payment Tokenization Test 100% Pass Rate',
        note: 'Completed 1,200 mock mobile money (MTN / Telecel MoMo) and debit card transactions without error.',
        author: 'Platform Security Lead',
        stageBadge: 'Security QA'
      }
    ],
    adminNotes: 'Client scheduled for final store launch on November 10, 2026.'
  }
];

// ==================== DEFAULT KNOWLEDGE BASE / FAQ ARTICLES ====================
export const DEFAULT_FAQ_ARTICLES: FAQArticle[] = [
  {
    id: 'faq-tracker-01',
    title: 'How does the DeRoyalTech Project Tracker work and how do I track my deliverables?',
    slug: 'how-project-tracker-works',
    category: 'Project Tracking & SLAs',
    summary: 'Learn how to monitor your live project progress, engineering milestones, and telemetry logs using your unique Project ID (e.g. DRT-2026-XXXX).',
    content: `Each confirmed project at DeRoyalTech is assigned a globally unique **Project Tracking ID** (formatted as \`DRT-2026-XXXX\`). 

### How to Track:
1. Click the **Track Project** button in the top navigation bar or client dashboard.
2. Enter your Project ID (or search by your company name).
3. Review your live completion percentage, milestone delivery dates, active lead engineer, and real-time engineering logs.
4. If you have any questions on an active milestone, click **Chat with Systems Lead** directly inside the tracker to open a direct Live Support channel connected to that project.

### Automated Notifications:
Whenever our engineers advance a milestone, update code completion percentage, or log a QA test, an automatic email notification is dispatched to your registered address with full telemetry details.`,
    tags: ['Tracker', 'Milestones', 'Project ID', 'Status Updates', 'Email Alerts'],
    isPublished: true,
    isFeatured: true,
    helpfulVotes: 48,
    unhelpfulVotes: 1,
    readTimeMinutes: 3,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-11-01T10:00:00Z',
    author: 'Principal Systems Administrator'
  },
  {
    id: 'faq-crm-02',
    title: 'What makes DeRoyalTech Custom CRM different from off-the-shelf software like Salesforce or HubSpot?',
    slug: 'custom-crm-vs-off-the-shelf',
    category: 'Custom CRM Solutions',
    summary: 'Discover why West African mid-market and enterprise businesses choose bespoke CRM architecture with physical hardware telemetry integration.',
    content: `Off-the-shelf SaaS CRM platforms charge steep per-seat monthly subscription fees in USD and are rigid when it comes to unique African supply chain, mobile money, and hardware workflows.

### The DeRoyalTech Advantage:
- **Zero Per-Seat SaaS Tax**: You own your database, proprietary source code, and cloud infrastructure with zero recurring vendor lock-in.
- **Bespoke Business Logic**: Tailored specifically to your corporate hierarchy, field agent commission models, dispatch workflows, and multi-currency accounting in Ghanaian Cedis (GH₵).
- **Physical Hardware Telemetry**: Direct bi-directional integration with barcode/RFID scanners, POS thermal receipt printers, weighbridges, and IoT edge gateways.
- **Local Payment Gateways**: Native integration with MTN Mobile Money (MoMo), Telecel Cash, AT Money, and Ghana Interbank Payment and Settlement Systems (GhIPSS/Instant Pay).`,
    tags: ['Custom CRM', 'Enterprise Software', 'Ghanaian Cedis', 'MoMo', 'Hardware Integration'],
    isPublished: true,
    isFeatured: true,
    helpfulVotes: 64,
    unhelpfulVotes: 2,
    readTimeMinutes: 4,
    createdAt: '2026-10-05T09:30:00Z',
    updatedAt: '2026-11-02T12:00:00Z',
    author: 'Chief Technology Officer'
  },
  {
    id: 'faq-hardware-03',
    title: 'What enterprise computer peripherals and edge hardware do you supply and calibrate?',
    slug: 'hardware-peripherals-and-calibration',
    category: 'Hardware & Peripherals',
    summary: 'An overview of DeRoyalTech ruggedized scanners, Thunderbolt 4 workstations, edge micro-servers, and industrial IoT gateways.',
    content: `DeRoyalTech operates an integrated hardware division alongside software engineering. We don't just sell boxes; we flash custom firmware, calibrate device drivers, and test peripherals against your cloud API before deployment.

### Supported Equipment:
- **Industrial RFID & 2D Barcode Scanners**: Rugged IP65/IP68 handheld terminals with wireless Wi-Fi 6E roaming and batch offline caching.
- **Edge Micro-Servers & Gateways**: Intel Xeon fanless edge gateways with dual redundant power supplies, RS-485 Modbus, and secure TPM 2.0.
- **Developer & Executive Workstations**: High-precision 40" 5K HDR IPS Black displays, Thunderbolt 4 docking stations (140W PD), and ergonomic tactile mechanical keyboards.
- **Biometric POS Systems**: Heavy-duty thermal receipt printers, magnetic swipe, and EMV chip card terminals with offline store caching.

All hardware includes our standard **3 to 5-year enterprise warranty** with local swap-out support in Accra and Takoradi.`,
    tags: ['Hardware', 'Peripherals', 'Scanners', 'POS', 'Edge Gateways', 'Accra'],
    isPublished: true,
    isFeatured: true,
    helpfulVotes: 39,
    unhelpfulVotes: 0,
    readTimeMinutes: 3,
    createdAt: '2026-10-12T14:15:00Z',
    updatedAt: '2026-10-28T16:00:00Z',
    author: 'Lead Hardware & IoT Engineer'
  },
  {
    id: 'faq-pricing-04',
    title: 'How are projects priced and invoiced in Ghanaian Cedis (GH₵)?',
    slug: 'ghanaian-cedis-pricing-and-billing',
    category: 'Billing & Ghana Cedis Pricing',
    summary: 'Transparent milestone-based escrow billing in Ghanaian Cedis (GH₵) protecting your budget from foreign exchange volatility.',
    content: `All quotes, product prices, and services are clearly denominated in **Ghanaian Cedis (GH₵)** to insulate our domestic clients from foreign currency exchange rate fluctuations.

### Milestone Escrow Structure:
- **Milestone 1 (30%)**: Project Kickoff, Architecture Blueprint, and Hardware Component Staging.
- **Milestone 2 (40%)**: Core Software Development, Database Schema, and Gateway Microservices.
- **Milestone 3 (20%)**: Telemetry Stress Testing, Security Penetration QA, and Operator Staging.
- **Milestone 4 (10%)**: Final Turnkey Handover, Source Code & IP Transfer, and Warranty Sign-off.

### Payment Methods:
We accept Corporate Bank Wire Transfers, GhIPSS Instant Pay, Cheque payments, and Mobile Money corporate merchant disbursements. Formal VAT invoices with GRA tax compliance are issued for all accounts.`,
    tags: ['Pricing', 'GH₵', 'Billing', 'Escrow', 'GRA VAT', 'Ghana'],
    isPublished: true,
    isFeatured: false,
    helpfulVotes: 52,
    unhelpfulVotes: 1,
    readTimeMinutes: 3,
    createdAt: '2026-10-18T11:00:00Z',
    updatedAt: '2026-11-01T09:00:00Z',
    author: 'Finance & Operations Lead'
  },
  {
    id: 'faq-cloud-05',
    title: 'What cloud infrastructure, SLA, and DevOps guarantees does DeRoyalTech provide?',
    slug: 'cloud-infrastructure-and-sla',
    category: 'Cloud Infrastructure & DevOps',
    summary: 'Details on 99.99% uptime SLAs, Kubernetes microservices, automated backups, and 24/7 DevOps standby monitoring.',
    content: `DeRoyalTech architects multi-cloud solutions across Google Cloud Platform (GCP), Amazon Web Services (AWS), and on-premise private clouds.

### Key Infrastructure Specs:
- **99.99% High Availability SLA**: Redundant containerized microservices managed via automated Kubernetes clusters.
- **Geographic Data Residency**: Ability to host sensitive corporate data in compliant West African data centers or global tier-1 regions.
- **Automated Backup & Disaster Recovery**: Point-in-time database snapshots replicated across multiple availability zones every 15 minutes.
- **24/7 Monitoring**: Real-time alerting via Prometheus, Grafana, and automated SMS/email alerts with a guaranteed 15-minute response time for critical priority incidents.`,
    tags: ['Cloud', 'DevOps', 'Kubernetes', 'AWS', 'GCP', 'SLA', 'Uptime'],
    isPublished: true,
    isFeatured: false,
    helpfulVotes: 31,
    unhelpfulVotes: 0,
    readTimeMinutes: 4,
    createdAt: '2026-10-22T13:45:00Z',
    updatedAt: '2026-10-30T10:15:00Z',
    author: 'Principal Systems Administrator'
  },
  {
    id: 'faq-auth-06',
    title: 'Why do clients need to register and be approved by the admin to access internal pages?',
    slug: 'client-registration-and-admin-approval',
    category: 'General & Onboarding',
    summary: 'Understanding our enterprise security posture and role-based access control protecting proprietary blueprints and commercial pricing.',
    content: `Because DeRoyalTech handles proprietary enterprise software blueprints, confidential system architectural diagrams, and wholesale hardware pricing, our platform implements enterprise-grade Role-Based Access Control (RBAC).

### How Client Access Works:
1. **Public Exploration**: The Homepage, Contact Hub, and Knowledge Base are publicly accessible without authentication.
2. **Registration**: When a client signs up with their corporate email, full name, and company, their profile is marked as \`Pending Review\`.
3. **Admin Verification**: DeRoyalTech administrators verify company legitimacy in the Admin Portal and grant official \`Approved & Verified\` credentials.
4. **Instant Unlock**: Once approved, clients gain full unhindered access to the Hardware Store, Completed Projects with MP4 Video Overviews, Workflow Simulator, and Solution Estimator.`,
    tags: ['Registration', 'Security', 'Admin Approval', 'Verified Badge', 'Access Control'],
    isPublished: true,
    isFeatured: false,
    helpfulVotes: 44,
    unhelpfulVotes: 2,
    readTimeMinutes: 3,
    createdAt: '2026-10-25T15:20:00Z',
    updatedAt: '2026-11-02T11:00:00Z',
    author: 'Platform Security Lead'
  }
];

// ==================== DEFAULT EMAIL NOTIFICATIONS ====================
export const DEFAULT_EMAIL_ALERTS: ProjectEmailAlert[] = [
  {
    id: 'alert-sample-01',
    projectId: 'DRT-2026-7841',
    projectTitle: 'Maritime Cargo & Warehouse RFID Telemetry System',
    recipientEmail: 'k.asante@ghana-enterprises.com',
    recipientName: 'Kwame Asante',
    subject: '[DeRoyalTech Status Update] Project DRT-2026-7841: Core Engine Development in Progress (45%)',
    sentAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    stage: 'development',
    stageLabel: 'Core Engine & Microservices Development in Progress',
    progressPercent: 45,
    updateSummary: 'Completed Kafka edge-stream pipeline integration with 15 RFID scanner terminals. Ingest latency verified under 18ms.',
    status: 'Delivered',
    leadEngineer: 'Kwesi Addo, Senior Solutions Architect',
    estimatedDeliveryDate: '2026-11-28'
  },
  {
    id: 'alert-sample-02',
    projectId: 'DRT-2026-9024',
    projectTitle: 'Omni-Channel Retail POS Network & Cloud Synchronization',
    recipientEmail: 'e.danquah@goldcoast-retail.com',
    recipientName: 'Emmanuel K. Danquah',
    subject: '[DeRoyalTech Status Update] Project DRT-2026-9024: Final QA & Penetration Testing (90%)',
    sentAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    stage: 'testing_qa',
    stageLabel: 'Final Penetration Testing & Cash-Drawer Telemetry QA',
    progressPercent: 90,
    updateSummary: 'Payment tokenization test passed 1,200 mock mobile money transactions without error. On track for store launch.',
    status: 'Delivered',
    leadEngineer: 'Platform Security Lead',
    estimatedDeliveryDate: '2026-11-10'
  }
];

// ==================== DEFAULT OFFICIAL LETTERS & PROPOSALS ====================
export const DEFAULT_LETTERS: OfficialLetter[] = [
  {
    id: 'ltr-001',
    referenceNumber: 'DRT/LTR/2026/041',
    date: 'November 6, 2026',
    recipientCompany: 'Ghana Commercial Bank (GCB) PLC',
    recipientName: 'Mr. Emmanuel Kwakye',
    recipientTitle: 'Head of Infrastructure & Cloud Operations',
    recipientAddress: 'GCB Head Office, High Street, Accra, Ghana',
    recipientEmail: 'e.kwakye@gcb.com.gh',
    recipientPhone: '+233 (0) 30 268 1521',
    subject: 'PROPOSAL FOR DEDICATED HYBRID CLOUD INFRASTRUCTURE & DISASTER RECOVERY HUB',
    templateType: 'proposal',
    salutation: 'Dear Mr. Kwakye,',
    content: `We have the honor to submit our formal technical proposal for the design and deployment of an enterprise-grade hybrid cloud infrastructure and secondary disaster recovery node for Ghana Commercial Bank PLC.

DeRoyalTech Systems Limited proposes a fault-tolerant edge cluster in Accra interconnected with secondary cloud nodes, delivering:
1. High-Availability Compute: Automated active-passive failover with target RPO < 15 seconds and RTO < 2 minutes.
2. End-to-End Encryption & Auditability: FIPS-compliant cryptographic modules safeguarding inter-branch financial transaction streams.
3. 24/7 DevOps Operations: On-site systems engineers based in Airport City, Accra, with dedicated direct line access.

Our team stands prepared to initiate the technical architecture blueprint upon receipt of your formal instruction.`,
    signatoryName: 'Emmanuel Osei',
    signatoryRole: 'Chief Technology Officer & Solutions Architect',
    signatoryPhone: '+233 (0) 30 294 8821',
    status: 'issued',
    createdAt: '2026-11-04T09:30:00Z',
    updatedAt: '2026-11-05T14:15:00Z'
  },
  {
    id: 'ltr-002',
    referenceNumber: 'DRT/LTR/2026/042',
    date: 'November 5, 2026',
    recipientCompany: 'Asante Logistics & Freight Systems Ltd',
    recipientName: 'Mr. Kwame Asante',
    recipientTitle: 'Managing Director',
    recipientAddress: 'Airport City, Accra, Greater Accra Region, Ghana',
    recipientEmail: 'k.asante@ghana-enterprises.com',
    recipientPhone: '+233 24 590 1284',
    subject: 'FORMAL QUOTATION & SLA SPECIFICATIONS FOR WAREHOUSE HARDWARE TERMINALS',
    templateType: 'quotation',
    salutation: 'Dear Mr. Asante,',
    content: `Pursuant to your request for proposal, DeRoyalTech Systems Limited is pleased to present our official quotation schedule for forty-five (45) rugged industrial RFID terminals and integrated edge gateway controllers.

All hardware includes:
- Comprehensive 3-Year Enterprise Replacement Warranty in Ghana.
- Native integration with your custom DeRoyalTech CRM pipeline.
- Certified on-site deployment and warehouse staff training by our systems engineers.

Payment terms are 50% mobilization, 40% upon hardware deployment, and 10% following 30-day continuous operation testing.`,
    signatoryName: 'Emmanuel Osei',
    signatoryRole: 'Chief Technology Officer & Solutions Architect',
    signatoryPhone: '+233 (0) 30 294 8821',
    status: 'sent',
    createdAt: '2026-11-05T11:00:00Z',
    updatedAt: '2026-11-05T16:20:00Z'
  }
];

// ==================== DEFAULT CORE ENGINEERING TEAM ====================
export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Emmanuel Osei',
    role: 'Chief Technology Officer & Principal Architect',
    assignedRole: 'Chief Technology Officer & Principal Architect',
    department: 'Executive & Architecture',
    bio: 'Specializes in distributed enterprise architectures, microservice orchestration, and mission-critical cloud deployments across West Africa.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    email: 'e.osei@deroyaltech.com',
    phone: '+233 (0) 30 294 8821',
    linkedinUrl: 'https://linkedin.com/company/deroyaltech',
    githubUrl: 'https://github.com/osei-33',
    displayOrder: 1,
    isActive: true,
    responsibilities: ['Enterprise Cloud Topology', 'Cryptographic Security Audits', 'Core System Specifications']
  },
  {
    id: 'team-02',
    name: 'Kwame Asante',
    role: 'Lead Cloud Infrastructure & DevOps Engineer',
    assignedRole: 'Lead Cloud Infrastructure & DevOps Engineer',
    department: 'Cloud & Infrastructure',
    bio: 'Oversees multi-region Kubernetes clusters, automated zero-downtime CI/CD deployment pipelines, and edge network optimization.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    email: 'k.asante@deroyaltech.com',
    phone: '+233 24 590 1284',
    linkedinUrl: 'https://linkedin.com/company/deroyaltech',
    githubUrl: 'https://github.com/osei-33',
    displayOrder: 2,
    isActive: true,
    responsibilities: ['Kubernetes CI/CD Pipelines', 'Zero-Downtime Releases', 'Accra-Kumasi Edge Gateway Telemetry']
  },
  {
    id: 'team-03',
    name: 'Akosua Mensah',
    role: 'Head of Full-Stack & CRM Solutions',
    assignedRole: 'Lead Developer',
    department: 'Software & CRM Development',
    bio: 'Directs bespoke CRM platforms, client portals, and secure financial integrations with Ghana Interbank Payment and Settlement Systems.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'a.mensah@deroyaltech.com',
    phone: '+233 (0) 30 294 8821',
    linkedinUrl: 'https://linkedin.com/company/deroyaltech',
    githubUrl: 'https://github.com/osei-33',
    displayOrder: 3,
    isActive: true,
    responsibilities: ['React 19 & TypeScript Frontend', 'GraphQL & REST Backends', 'Financial Portals & GIPSS Sync']
  },
  {
    id: 'team-04',
    name: 'David Boateng',
    role: 'Senior Hardware & Industrial IoT Specialist',
    assignedRole: 'Solutions Consultant',
    department: 'Hardware & Embedded Systems',
    bio: 'Designs custom telemetry sensor controllers, industrial server racks, and turnkey edge computer appliances for logistics hubs.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    email: 'd.boateng@deroyaltech.com',
    phone: '+233 (0) 30 294 8821',
    linkedinUrl: 'https://linkedin.com/company/deroyaltech',
    githubUrl: 'https://github.com/osei-33',
    displayOrder: 4,
    isActive: true,
    responsibilities: ['Turnkey Server Racks', 'Industrial RFID Hardware', 'On-Site Diagnostic Deployments']
  }
];

