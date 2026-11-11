import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CASE_STUDIES } from '../data/companyData.ts';
import { CaseStudy, PortfolioCategory } from '../types/index.ts';

interface PortfolioShowcaseProps {
  onOpenCaseStudy: (study: CaseStudy) => void;
  openConsultation: () => void;
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  onOpenCaseStudy,
  openConsultation
}) => {
  const [selectedFilter, setSelectedFilter] = useState<PortfolioCategory>('all');

  const filteredStudies = selectedFilter === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(s => s.category === selectedFilter);

  return (
    <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
              Verified Case Studies & ROI
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
              Proven systems deployed across mission-critical industries.
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Explore concrete engineering outcomes across custom web applications, native mobile suites, bespoke CRM migrations, and hardware telemetry deployments.
            </p>
          </div>

          <button
            onClick={openConsultation}
            className="self-start md:self-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            Inquire for Your Project
          </button>
        </div>

        {/* Filter Bar (Interactive Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Case Studies ({CASE_STUDIES.length})
          </button>
          <button
            onClick={() => setSelectedFilter('crm')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedFilter === 'crm'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Custom CRM
          </button>
          <button
            onClick={() => setSelectedFilter('cloud')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedFilter === 'cloud'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Cloud DevOps
          </button>
          <button
            onClick={() => setSelectedFilter('hardware')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedFilter === 'hardware'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Hardware Integration
          </button>
          <button
            onClick={() => setSelectedFilter('mobile')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedFilter === 'mobile'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Mobile Apps
          </button>
          <button
            onClick={() => setSelectedFilter('software')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedFilter === 'software'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Workstations & Software
          </button>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              onClick={() => onOpenCaseStudy(study)}
              className="group cursor-pointer bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                  <img
                    src={study.image}
                    alt={study.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Clean unboxed footer in image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold drop-shadow-sm">{study.client}</span>
                    <span className="font-mono text-[11px] text-slate-200 drop-shadow-sm">{study.timeframe}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Unboxed Metadata (NO PILL BADGES) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="capitalize font-medium text-blue-600 dark:text-blue-400">{study.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{study.industry}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2.5">
                    {study.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {study.summary}
                  </p>

                  {/* Key Proof Metric */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                      {study.results[0].metric}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {study.results[0].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 truncate max-w-[190px]">
                  {study.techStack.slice(0, 2).join(' · ')}
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Deep Dive</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
