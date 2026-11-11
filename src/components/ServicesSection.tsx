import React, { useState } from 'react';
import { 
  Code2, 
  Smartphone, 
  Database, 
  Cloud, 
  Cpu, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  DollarSign,
  Sparkles,
  Tag,
  ChevronRight
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { ServiceItem, ServiceCategory } from '../types/index.ts';

interface ServicesSectionProps {
  onSelectServiceForEstimate: (serviceId: string) => void;
  openConsultation: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForEstimate,
  openConsultation
}) => {
  const { services, formatPrice, openServiceRequestModal, openNegotiationModal } = useSite();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'web-software');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ServiceCategory>('all');

  const filteredServices = categoryFilter === 'all'
    ? services
    : services.filter(s => s.category === categoryFilter);

  const activeService = services.find(s => s.id === selectedServiceId) || services[0] || {
    id: 'web-software',
    category: 'software',
    number: '01',
    title: 'Custom Website & Software Engineering',
    shortDesc: 'Enterprise web applications and scalable platforms.',
    fullDesc: 'Comprehensive full-stack software development.',
    iconName: 'Code2',
    startingPrice: 45000,
    keyFeatures: ['Modern Single Page Applications', 'Enterprise RBAC'],
    techStack: ['React', 'TypeScript', 'Node.js'],
    deliverables: ['Production Web Application', 'Source Repository'],
    businessOutcome: 'Scalable platforms with zero bottleneck.'
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Database': return <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Server': return <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            Engineering Capabilities & Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Comprehensive technology services engineered for operational resilience.
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            From modern responsive software and native mobile applications to bespoke CRM workflows, automated cloud DevOps, and physical hardware peripherals.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => setCategoryFilter('software')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'software'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Web & Software
          </button>
          <button
            onClick={() => setCategoryFilter('mobile')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'mobile'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Mobile Apps
          </button>
          <button
            onClick={() => setCategoryFilter('crm')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'crm'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Custom CRM
          </button>
          <button
            onClick={() => setCategoryFilter('cloud')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'cloud'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Cloud Infrastructure
          </button>
          <button
            onClick={() => setCategoryFilter('hardware-integration')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'hardware-integration'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Hardware Integration
          </button>
          <button
            onClick={() => setCategoryFilter('peripherals')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'peripherals'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Peripherals & Hardware
          </button>
        </div>

        {/* Bento Grid: Interactive Service Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`cursor-pointer text-left p-6 rounded-xl border transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-500 shadow-md ring-1 ring-blue-600 dark:ring-blue-500'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                      {service.number}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {getIcon(service.iconName)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Dynamic Price Tag in Ghanaian Cedis */}
                  {service.startingPrice && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Starting Price</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(service.startingPrice)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                      {service.techStack.slice(0, 3).join(' · ')}
                    </span>
                    <span className={`text-xs font-semibold flex items-center gap-1 ${
                      isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {isSelected ? 'Active Details' : 'View Scope'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Service Deep Dive Architecture Panel */}
        <div className="mt-10 p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <span>{activeService.number} Architectural Scope</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeService.category}</span>
                </div>

                {activeService.startingPrice && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    Base Investment: {formatPrice(activeService.startingPrice)}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeService.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeService.fullDesc}
              </p>

              {/* Key Features List */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Technical Pillars & Capabilities:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  {activeService.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => openServiceRequestModal(activeService)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Request Service & Order</span>
                </button>

                <button
                  onClick={() => openNegotiationModal({
                    id: activeService.id,
                    title: activeService.title,
                    price: activeService.startingPrice || 15000,
                    type: 'software'
                  })}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 rounded-lg shadow-2xs transition-colors flex items-center gap-2"
                  title="Negotiate software project pricing or tailored scope"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Negotiate Terms</span>
                </button>

                <button
                  onClick={() => onSelectServiceForEstimate(activeService.id)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-2"
                >
                  <span>Include in Scope Estimator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={openConsultation}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  Schedule Architecture Call
                </button>
              </div>
            </div>

            {/* Right Column: Deliverables & Tech Stack */}
            <div className="lg:col-span-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                  Scope Deliverables:
                </div>
                <div className="space-y-2">
                  {activeService.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                  Production Tech Stack:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeService.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                <span className="font-bold block text-[10px] uppercase text-blue-600 dark:text-blue-400">
                  Target Business Outcome:
                </span>
                <p>{activeService.businessOutcome}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
