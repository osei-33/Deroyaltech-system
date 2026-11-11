import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { CaseStudy } from '../types/index.ts';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  openConsultation: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  openConsultation
}) => {
  if (!caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>Case Study</span>
            <span aria-hidden="true">·</span>
            <span>{caseStudy.industry}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-8">
          {/* Hero Details */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {caseStudy.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              <span className="font-medium text-slate-800 dark:text-slate-200">{caseStudy.client}</span>
              <span aria-hidden="true">·</span>
              <span>Timeline: {caseStudy.timeframe}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{caseStudy.category} Solution</span>
            </div>
          </div>

          {/* Featured Visual */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-[16/9] w-full relative">
            <img
              src={caseStudy.image}
              alt={caseStudy.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quantified Results Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            {caseStudy.results.map((res, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                  {res.metric}
                </div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                  {res.label}
                </div>
              </div>
            ))}
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                The Operational Challenge
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                DeRoyalTech Solution & Engineering
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>
          </div>

          {/* Architectural Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Architectural Highlights
            </h3>
            <div className="space-y-2">
              {caseStudy.architecturalHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
              Implemented Tech & Hardware Stack
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
              {caseStudy.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial Quote */}
          {caseStudy.testimonial && (
            <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50">
              <p className="text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                "{caseStudy.testimonial.quote}"
              </p>
              <div className="mt-3 text-xs font-medium text-slate-900 dark:text-white">
                <span className="font-bold">{caseStudy.testimonial.author}</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">
                  {' '}— {caseStudy.testimonial.role}, {caseStudy.testimonial.company}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Close Overview
          </button>

          <button
            onClick={() => {
              onClose();
              openConsultation();
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2"
          >
            <span>Discuss a Similar Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
