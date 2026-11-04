import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Film, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { CompletedProject } from '../types/index.ts';

interface CompletedProjectsSectionProps {
  onOpenVideo: (project: CompletedProject) => void;
  openConsultation: () => void;
}

export const CompletedProjectsSection: React.FC<CompletedProjectsSectionProps> = ({
  onOpenVideo,
  openConsultation
}) => {
  const { completedProjects } = useSite();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProjects = activeCategory === 'all'
    ? completedProjects
    : completedProjects.filter(p => p.category === activeCategory);

  return (
    <section id="completed-projects" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Verified Client Deployments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
              Completed Projects & Live System Demonstrations
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Browse production platforms delivered by DeRoyalTech. You can visit each client application directly or launch an MP4 video overview to inspect the live architecture.
            </p>
          </div>

          <button
            onClick={openConsultation}
            className="self-start md:self-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            Commission a System
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 text-xs font-medium scrollbar-none">
          {[
            { id: 'all', label: `All Deliveries (${completedProjects.length})` },
            { id: 'crm', label: 'Custom CRM' },
            { id: 'cloud', label: 'Cloud DevOps' },
            { id: 'hardware', label: 'Hardware & IoT' },
            { id: 'mobile', label: 'Mobile Apps' },
            { id: 'web', label: 'Web Software' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Completed Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Thumbnail with Video Overlay Button */}
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={project.videoThumbnail || '/src/assets/images/case_study_crm_platform_1793611778711.jpg'}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                  {/* Centered MP4 Play Trigger */}
                  <button
                    onClick={() => onOpenVideo(project)}
                    aria-label={`Watch MP4 video overview for ${project.title}`}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-xl backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 group/btn"
                  >
                    <Play className="w-6 h-6 ml-1 text-white fill-current" />
                  </button>

                  {/* Badge top-left */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider uppercase text-white bg-slate-950/80 backdrop-blur-md rounded border border-white/10 flex items-center gap-1.5">
                      <Film className="w-3 h-3 text-orange-400" /> MP4 Video Available
                    </span>
                  </div>

                  {/* Badge bottom-right */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 text-[10px] font-medium text-slate-200 bg-black/60 backdrop-blur-sm rounded">
                      {project.completionDate}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {project.client}
                    </span>
                    <span>{project.industry}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 dark:border-slate-800 text-center">
                    {project.metrics.map((m, idx) => (
                      <div key={idx}>
                        <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verified Delivery Note */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{project.verifiedDeliveryBadge}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Visit Live & Watch MP4 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenVideo(project)}
                  className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3 h-3 text-orange-500 fill-current" />
                  <span>Watch MP4</span>
                </button>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Visit Live</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
