import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  Activity,
  CheckCircle2,
  Sparkles,
  Cloud,
  RefreshCw,
  Trash2,
  Clock
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';

export const ProjectWebNotificationManager: React.FC = () => {
  const {
    trackedProjects,
    notificationPermission,
    requestBrowserNotificationPermission,
    notificationSoundEnabled,
    setNotificationSoundEnabled,
    dispatchLiveAlert,
    alertHistory,
    clearAlertHistory,
    refreshFromServer
  } = useSite();

  const [isRequesting, setIsRequesting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const res = await requestBrowserNotificationPermission();
      if (res !== 'granted') {
        dispatchLiveAlert({
          title: 'In-App Real-Time Alerts Active',
          body: 'OS browser popups are restricted in this frame/browser, so instant in-app banner & chime alerts remain active across all pages.',
          type: 'test'
        });
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = async () => {
    if (notificationPermission === 'default') {
      await handleRequestPermission();
    }
    dispatchLiveAlert({
      title: 'Project Milestone Verified (Test Alert)',
      body: 'Telemetry Node Deployment passed automated QA testing at 99.98% accuracy. Real-time notifications verified.',
      type: 'test',
      projectId: trackedProjects[0]?.projectId
    });
  };

  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      await refreshFromServer();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Real-time Notification Status Ribbon in Client Hub */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              notificationPermission === 'granted'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : notificationPermission === 'denied' || notificationPermission === 'unsupported'
                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <BellRing className="w-5 h-5 animate-pulse" />
            ) : notificationPermission === 'denied' ? (
              <BellOff className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Real-Time Project & Pricing Notifications
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                  notificationPermission === 'granted'
                    ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : notificationPermission === 'denied' || notificationPermission === 'unsupported'
                    ? 'bg-sky-50 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                    : 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                }`}
              >
                {notificationPermission === 'granted'
                  ? 'OS & In-App Active'
                  : notificationPermission === 'denied' || notificationPermission === 'unsupported'
                  ? 'In-App Live Active'
                  : 'In-App Active · Enable OS Push'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {notificationPermission === 'granted'
                ? 'Receiving real-time OS desktop & in-app alerts when milestones, price decisions, or weekly backups update.'
                : notificationPermission === 'denied' || notificationPermission === 'unsupported'
                ? 'In-app visual banners & audio chimes are active across all pages (OS popups restricted by browser frame).'
                : 'In-app alerts are active. Click Enable Browser Alerts for optional OS desktop notifications.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {notificationPermission === 'default' && (
            <button
              type="button"
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isRequesting ? 'Requesting...' : 'Enable Browser Alerts'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleTestNotification}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Trigger a test milestone notification"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Test Alert</span>
          </button>

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isRefreshing}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            title="Pull latest admin updates from main backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>

          {alertHistory.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(prev => !prev)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Feed ({alertHistory.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setNotificationSoundEnabled(prev => !prev)}
            className={`p-1.5 rounded-lg border transition-colors ${
              notificationSoundEnabled
                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
            title={notificationSoundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
          >
            {notificationSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Alert History Feed */}
      {showHistory && alertHistory.length > 0 && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Recent Real-Time Alerts ({alertHistory.length})
            </span>
            <button
              type="button"
              onClick={clearAlertHistory}
              className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-[11px] font-semibold"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Feed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {alertHistory.slice(0, 10).map(item => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex items-start gap-2.5 text-xs"
              >
                <div className="mt-0.5 shrink-0">
                  {item.type === 'milestone' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : item.type === 'negotiation' ? (
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  ) : item.type === 'backup' ? (
                    <Cloud className="w-4 h-4 text-sky-500" />
                  ) : (
                    <BellRing className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{item.title}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.body}</p>
                  <div className="text-[10px] font-mono text-slate-400">
                    {item.timestamp} {item.projectId ? `· ${item.projectId}` : item.referenceId ? `· ${item.referenceId}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
