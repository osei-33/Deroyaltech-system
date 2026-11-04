import React, { useState } from 'react';
import { ArrowRight, Terminal, Cpu, Database, Cloud, Film, Sparkles } from 'lucide-react';
import { HERO_IMAGE, TRUST_METRICS } from '../data/companyData.ts';
import { useSite } from '../context/SiteContext.tsx';

interface HeroSectionProps {
  openConsultation: () => void;
  scrollToEstimator: () => void;
  scrollToPortfolio: () => void;
  scrollToProjects: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  openConsultation,
  scrollToEstimator,
  scrollToPortfolio,
  scrollToProjects
}) => {
  const { config } = useSite();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      {/* Dynamic Ultra-Modern Overlays based on Admin Settings */}
      {config.overlayStyle === 'ambient-glass' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 dark:bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl" />
        </div>
      )}

      {config.overlayStyle === 'cyber-grid' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
          aria-hidden="true"
        />
      )}

      {config.overlayStyle === 'minimal-slate' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
          aria-hidden="true"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Editorial Subtitle Kicker (Clean Unboxed Text with African Regional Anchor) */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-4">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Enterprise Systems Engineering</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Accra, Ghana & Global Operations</span>
        </div>

        {/* 2-Column Split: Hero Headline & Messaging vs High-Impact 16:9 Visual Anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]" style={{ textWrap: 'balance' }}>
              {config.heroHeadline}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {config.heroSubtitle}
            </p>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={scrollToEstimator}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Calculate Scope ({config.currencySymbol})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToProjects}
                className="px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800/60 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Film className="w-4 h-4 text-orange-500" />
                <span>Completed Projects & MP4s</span>
              </button>

              <button
                onClick={scrollToPortfolio}
                className="px-5 py-3.5 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Case Studies
              </button>
            </div>

            {/* Core Capability Summary (Zero-pill clean typography) */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                Unified Technology Capabilities:
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Web & Mobile Development
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Custom CRM & ERP
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Multi-Cloud DevOps
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-orange-500" /> Hardware Peripherals ({config.currencySymbol})
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Anchor (16:9 Aspect Ratio with Fallback) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xl group">
              <div className="aspect-[16/10] w-full relative">
                <img
                  src={HERO_IMAGE}
                  alt="DeRoyalTech Software and Hardware Integration Center"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                
                {/* Fallback container if image fails or while loading */}
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-slate-900 flex flex-col justify-center items-center p-6 text-center text-white">
                    <Cpu className="w-12 h-12 text-blue-500 mb-3 animate-pulse" />
                    <p className="text-sm font-semibold tracking-wide">DeRoyalTech Engineering Systems</p>
                    <p className="text-xs text-slate-400 mt-1">Software · Cloud DevOps · Hardware Integration</p>
                  </div>
                )}

                {/* Subtle scrim for optical contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Subtle contextual caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center justify-between">
                  <span className="font-medium drop-shadow-sm">DeRoyalTech Systems Lab</span>
                  <span className="text-slate-300 font-mono text-[11px] tabular-nums">Accra Tech Center</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & KPI Row Below Hero Split */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TRUST_METRICS.map((kpi) => (
              <div key={kpi.label} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {kpi.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {kpi.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
