import React from 'react';
import { BellRing, CheckCircle2, Cloud, Sparkles, X, ArrowRight } from 'lucide-react';
import { useSite, LiveAppAlert } from '../../context/SiteContext.tsx';

export const GlobalNotificationToaster: React.FC = () => {
  const {
    liveAlerts,
    dismissLiveAlert,
    setIsClientNotificationModalOpen,
    openTrackerForId
  } = useSite();

  if (!liveAlerts || liveAlerts.length === 0) return null;

  const handleAlertAction = (alert: LiveAppAlert) => {
    dismissLiveAlert(alert.id);
    if (alert.type === 'negotiation' || alert.referenceId) {
      setIsClientNotificationModalOpen(true);
    } else if (alert.projectId) {
      openTrackerForId(alert.projectId);
    }
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] space-y-2.5 pointer-events-none"
    >
      {liveAlerts.map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto p-4 rounded-2xl bg-slate-900/95 text-white border border-blue-500/40 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5">
                {alert.type === 'milestone' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : alert.type === 'negotiation' ? (
                  <Sparkles className="w-4 h-4 text-amber-400" />
                ) : alert.type === 'backup' ? (
                  <Cloud className="w-4 h-4 text-sky-400" />
                ) : (
                  <BellRing className="w-4 h-4 text-blue-400" />
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="text-xs font-bold text-white leading-tight">
                  {alert.title}
                </div>
                <p className="text-xs text-slate-300 leading-snug break-words">
                  {alert.body}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1.5">
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {alert.timestamp}
                    {alert.projectId ? ` · ${alert.projectId}` : alert.referenceId ? ` · ${alert.referenceId}` : ''}
                  </span>

                  {(alert.type === 'negotiation' || alert.referenceId || alert.projectId) && (
                    <button
                      type="button"
                      onClick={() => handleAlertAction(alert)}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 shrink-0"
                    >
                      <span>{alert.type === 'negotiation' || alert.referenceId ? 'View Decision' : 'Open Tracker'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissLiveAlert(alert.id)}
              aria-label="Dismiss alert"
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
