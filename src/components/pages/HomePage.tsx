import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Globe, 
  Play, 
  ExternalLink, 
  Film, 
  Sparkles, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  Server,
  Zap,
  Clock
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { HeroSection } from '../HeroSection.tsx';
import { ClientTestimonialsSlider } from '../ClientTestimonialsSlider.tsx';
import { CompletedProject, HardwareProduct } from '../../types/index.ts';

interface HomePageProps {
  openConsultation: (scope?: string) => void;
  onOpenVideoProject: (project: CompletedProject) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ openConsultation, onOpenVideoProject }) => {
  const { 
    config, 
    services,
    hardwareProducts, 
    completedProjects, 
    formatPrice, 
    navigateTo, 
    clientUser, 
    setIsAuthModalOpen,
    setAuthModalTab
  } = useSite();

  const featuredProjects = completedProjects.slice(0, 3);
  const featuredHardware = hardwareProducts.slice(0, 4);

  // Helper to find starting price from dynamic services
  const getServicePrice = (id: string, fallback: number) => {
    const s = services.find(item => item.id === id);
    return s?.startingPrice ? formatPrice(s.startingPrice) : formatPrice(fallback);
  };

  const isApprovedClient = clientUser && clientUser.status === 'approved' && clientUser.isVerified;
  const isPendingClient = clientUser && clientUser.status === 'pending';

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. Ultra-Modern Hero Section */}
      <HeroSection
        openConsultation={() => openConsultation()}
        scrollToEstimator={() => navigateTo('estimator')}
        scrollToPortfolio={() => navigateTo('projects')}
        scrollToProjects={() => navigateTo('projects')}
      />

      {/* 2. Client Portal Access Banner with Verification Guard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500 text-white">
                  Client Restricted Architecture
                </span>
                <span className="text-xs text-blue-200">DeRoyalTech Enterprise Gateway</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {isApprovedClient ? (
                  <span className="flex items-center gap-2">
                    <span>Welcome, {clientUser.fullName} ({clientUser.company})</span>
                    <span title="Admin Approved Verified Partner">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </span>
                  </span>
                ) : isPendingClient ? (
                  <span className="flex items-center gap-2 text-amber-300">
                    <Clock className="w-5 h-5" />
                    <span>Account Pending Admin Approval ({clientUser.fullName})</span>
                  </span>
                ) : (
                  'Register for Full Access to Engineering Specs, Telemetry & Hardware Supplies'
                )}
              </h2>
              <p className="text-sm text-slate-300">
                {isApprovedClient
                  ? 'Your verified client session is active and approved by DeRoyalTech administrators. You have complete access to all dedicated system pages, live telemetry, and direct hardware requisition in Ghanaian Cedis.'
                  : isPendingClient
                  ? 'Your registration has been submitted. To protect proprietary client intellectual property and wholesale enterprise hardware pricing, an administrator must review and approve your partner account before access is unlocked.'
                  : 'To protect proprietary client architectures and enterprise pricing tiers, individual service deep-dives, completed project repos, and hardware supply modules require approved client registration.'
                }
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {isApprovedClient ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateTo('services')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Go to Services Directory</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigateTo('hardware')}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700"
                  >
                    Hardware Supplies
                  </button>
                </div>
              ) : isPendingClient ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-200 font-mono">
                  Pending Admin Approval · Verification in Progress
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setAuthModalTab('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.02]"
                  >
                    <span>Register as Client</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Enterprise Services Preview with Pricing in GH₵ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Core Capabilities & Disciplines
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              End-to-End Technology Stack for Business Scale
            </h2>
          </div>
          <button
            onClick={() => navigateTo('services')}
            className="group flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <span>View Dedicated Services Page</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Web & Software */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all hover:shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  From {getServicePrice('web-software', 45000)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Websites & Enterprise Web Platforms
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mission-critical enterprise web apps, high-throughput portals, headless e-commerce, and real-time dashboards built on React, TypeScript, and distributed Node.js clusters.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['React 19', 'Next.js', 'REST & GraphQL', 'Tailwind CSS'].map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => navigateTo('services')}
                className="w-full py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between"
              >
                <span>Read Full Technical Architecture</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Custom CRM & Cloud */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all hover:shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Server className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  From {getServicePrice('custom-crm', 65000)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Custom CRM & Multi-Cloud Infrastructure
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tailored business workflow engines, pipeline automation, role-based governance, and managed Kubernetes environments configured across AWS, GCP, and Azure.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['PostgreSQL', 'Kubernetes', 'Terraform', 'Kafka Streams'].map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => navigateTo('services')}
                className="w-full py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 flex items-center justify-between"
              >
                <span>Explore Custom CRM Systems</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Hardware Integration & Peripherals */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all hover:shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  From {getServicePrice('computer-hardware', 25000)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Computer Hardware Peripherals & IoT Supply
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct procurement and deployment of enterprise workstations, 1U edge servers, RFID terminals, barcode scanners, and biometric POS with local warranty in Ghana.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Accra Stock', 'Local Warranty', 'API Synced', 'GH₵ Billing'].map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => navigateTo('hardware')}
                className="w-full py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-between"
              >
                <span>Browse Hardware Store in GH₵</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Completed Projects Showcase Teaser (With MP4 Badges & Live Links) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              Verified Production Deployments
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Completed Client Projects & Systems
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Inspect live URLs or watch high-definition MP4 system overview walkthroughs delivered to enterprises across Ghana and the diaspora.
            </p>
          </div>
          <button
            onClick={() => navigateTo('projects')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 shrink-0"
          >
            <span>View All Completed Projects ({completedProjects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                    {project.industry}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{project.completionDate}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {project.client} · {project.clientCountry}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>

                {/* Metrics Highlight */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{project.metrics[0].label}</span>
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {project.metrics[0].value}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Live Visit & MP4 Video Theater */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Visit Live</span>
                </a>

                {project.videoUrl && (
                  <button
                    onClick={() => onOpenVideoProject(project)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch MP4</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Enterprise Hardware Supply Highlights (Ghanaian Cedis GH₵) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                Local Inventory & Integration Supply
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Computer Hardware Peripherals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Ready-to-deploy hardware inventory with direct CRM & cloud sync. All prices in Ghanaian Cedis ({config.currencySymbol}) with official warranties.
              </p>
            </div>
            <button
              onClick={() => navigateTo('hardware')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shrink-0 shadow-sm"
            >
              <span>Explore All Hardware ({hardwareProducts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredHardware.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400">{product.sku}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {product.stockStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {product.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Enterprise Price</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateTo('hardware')}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                    title="View details & request quote"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quick Teasers for Workflow Simulator & Project Estimator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workflow Hub Teaser */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Interactive Hardware-to-Cloud Simulator</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Experience DeRoyalTech's real-time telemetry pipeline: simulate an RFID terminal scan triggering an edge node, multi-cloud ingestion, and instantaneous CRM pipeline updates.
            </p>
          </div>
          <div className="pt-6 mt-6">
            <button
              onClick={() => navigateTo('workflow')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
            >
              <span>Launch Workflow Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scope Estimator Teaser */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Solution Scope & Budget Estimator (GH₵)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Configure your web, mobile, custom CRM, and cloud infrastructure requirements to generate instant engineering timeframes and estimated budget brackets in Ghanaian Cedis.
            </p>
          </div>
          <div className="pt-6 mt-6">
            <button
              onClick={() => navigateTo('estimator')}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
            >
              <span>Calculate Project Scope in GH₵</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Client Testimonial Section with Smooth Sliding Animation */}
      <ClientTestimonialsSlider openConsultation={openConsultation} />

      {/* 8. Corporate Office & Direct Contacts Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Headquarters: Accra, Ghana
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Speak with a Senior Systems Architect
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Reach our engineering hub in Airport City, Accra. Direct phone lines: <span className="font-mono font-semibold">{config.contact.phonePrimary}</span> or connect via WhatsApp for immediate RFQ reviews.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('contact')}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              View Ghana Office & Socials
            </button>
            <button
              onClick={() => openConsultation('Enterprise Inquiry from Homepage')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Request Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
