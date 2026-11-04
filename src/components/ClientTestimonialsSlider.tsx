import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { PartnerQuote } from '../types/index.ts';

interface ClientTestimonialsSliderProps {
  openConsultation: (scope?: string) => void;
}

export const ClientTestimonialsSlider: React.FC<ClientTestimonialsSliderProps> = ({ openConsultation }) => {
  const { testimonials, navigateTo } = useSite();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = testimonials.length;

  // Auto-play sliding interval
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % total);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused]);

  if (total === 0) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % total);
  };

  const current = testimonials[currentIndex];

  return (
    <section 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* Background glow halos */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-orange-400 mb-1">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Verified Enterprise Client Endorsements</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Trusted by Industry Leaders Across West Africa
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Real quotes and architectural outcomes from executives, CTOs, and operations leaders deploying DeRoyalTech software, cloud, and hardware systems.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              {currentIndex + 1} / {total}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sliding Card Frame */}
        <div className="relative z-10 min-h-[300px] flex flex-col justify-between">
          <div 
            key={current.id}
            className="space-y-6 transition-all duration-500 ease-out animate-in fade-in slide-in-from-right-4"
          >
            {/* Top Row: Stars + Project Scope Tag + Verified Metric */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  5.0 Verified Review
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  {current.projectScope}
                </span>
                {current.metricResult && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{current.metricResult}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quote Body */}
            <div className="relative">
              <Quote className="absolute -top-3 -left-3 w-10 h-10 text-blue-500/15 pointer-events-none" />
              <blockquote className="text-lg sm:text-2xl font-medium text-slate-100 leading-relaxed italic pl-6 border-l-2 border-orange-500">
                "{current.quote}"
              </blockquote>
            </div>

            {/* Client Signature & Organization */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-orange-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
                  {current.clientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {current.clientName}
                    </h3>
                    <span title="Verified Enterprise Client">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">{current.clientRole}</span> · {current.company}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{current.industry}</span>
                </span>
                <span>·</span>
                <span>{current.date}</span>
              </div>
            </div>
          </div>

          {/* Dots Pagination */}
          <div className="flex items-center justify-center gap-2 pt-8 mt-6 border-t border-slate-800/80">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-8 h-2 bg-gradient-to-r from-blue-500 to-orange-500'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
