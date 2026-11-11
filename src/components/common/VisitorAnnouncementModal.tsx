import React, { useState, useEffect } from 'react';
import { Megaphone, X, ArrowRight, Sparkles } from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';

export const VisitorAnnouncementModal: React.FC = () => {
  const { config, navigateTo } = useSite();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if announcement is enabled
    if (!config?.announcement?.enabled) {
      setIsOpen(false);
      return;
    }

    // Check if already dismissed in this browser session
    const dismissedKey = `drt_announcement_seen_${config.announcement.title.slice(0, 20)}`;
    const alreadySeen = sessionStorage.getItem(dismissedKey);
    if (!alreadySeen) {
      // Pop up immediately with a slight natural delay for smooth entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [config?.announcement]);

  const handleDismiss = () => {
    if (config?.announcement) {
      const dismissedKey = `drt_announcement_seen_${config.announcement.title.slice(0, 20)}`;
      sessionStorage.setItem(dismissedKey, 'true');
    }
    setIsOpen(false);
  };

  const handleActionClick = () => {
    handleDismiss();
    if (config?.announcement?.ctaPage) {
      navigateTo(config.announcement.ctaPage);
    }
  };

  if (!isOpen || !config?.announcement?.enabled) {
    return null;
  }

  const { badgeText, title, message, ctaText, ctaPage } = config.announcement;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close Announcement"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Badge & Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-sm">
              <Megaphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3.5 h-3.5" />
                {badgeText || 'Announcement'}
              </span>
            </div>
          </div>

          {/* Title & Body */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {ctaText && ctaPage && (
              <button
                type="button"
                onClick={handleActionClick}
                className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Footer subtle brand */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 text-center text-[11px] text-slate-400 font-medium">
          DeRoyalTech Systems Limited · Accra, Ghana
        </div>
      </div>
    </div>
  );
};
