import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Activity, 
  ExternalLink,
  X,
  Play
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { TrackedProject, ProjectMilestone } from '../../types/index.ts';

// Helper to synthesize a friendly chime using the standard Web Audio API
const playMilestoneChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First high note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.35);

    // Second harmonious note
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch {
    // Audio context may be restricted by autoplay policy; silent fallback
  }
};

interface NotificationToast {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  projectId?: string;
  type: 'milestone' | 'status' | 'negotiation' | 'test';
}

export const ProjectWebNotificationManager: React.FC = () => {
  const { trackedProjects, config, negotiations } = useSite();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeToasts, setActiveToasts] = useState<NotificationToast[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  // Snapshot refs to detect status & milestone updates
  const prevProjectsSnapshot = useRef<Record<string, { stage: string; progress: number; completedCount: number }>>({});
  const prevNegotiationsSnapshot = useRef<Record<string, string>>({});
  const isInitialMount = useRef(true);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }
  }, []);

  // Request browser Web Notification permission
  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    setIsRequesting(true);
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        dispatchAlert(
          '🎉 Web Notifications Activated',
          'You will now receive instant desktop alerts when project milestones are verified or stage changes occur.',
          'test'
        );
      }
    } catch (e) {
      console.warn('Failed to request notification permission:', e);
    } finally {
      setIsRequesting(false);
    }
  };

  // Dispatch both Native Web Notification API and in-app visual alert
  const dispatchAlert = (
    title: string, 
    body: string, 
    type: 'milestone' | 'status' | 'negotiation' | 'test' = 'milestone',
    projectId?: string
  ) => {
    // 1. Play audio chime if sound enabled
    if (soundEnabled) {
      playMilestoneChime();
    }

    // 2. Dispatch native browser Web Notification if supported & granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: config.logoUrl || '/favicon.ico',
          tag: `drt-alert-${Date.now()}`,
          requireInteraction: false
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (err) {
        console.warn('Browser Web Notification failed:', err);
      }
    }

    // 3. Dispatch in-app visual alert toast
    const newToast: NotificationToast = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      projectId,
      type
    };

    setActiveToasts(prev => [newToast, ...prev.slice(0, 3)]);

    // Auto-dismiss in-app toast after 8 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 8000);
  };

  // Monitor project status and milestone changes in real time
  useEffect(() => {
    if (!trackedProjects || trackedProjects.length === 0) return;

    if (isInitialMount.current) {
      // First mount: seed initial state without spamming notifications
      trackedProjects.forEach(p => {
        const completedCount = p.milestones.filter(m => m.status === 'completed').length;
        prevProjectsSnapshot.current[p.projectId] = {
          stage: p.stage,
          progress: p.progressPercent,
          completedCount
        };
      });
      isInitialMount.current = false;
      return;
    }

    trackedProjects.forEach(p => {
      const prev = prevProjectsSnapshot.current[p.projectId];
      const completedCount = p.milestones.filter(m => m.status === 'completed').length;

      if (prev) {
        // Milestone newly completed
        if (completedCount > prev.completedCount) {
          const newlyCompleted = p.milestones.find(
            (m, i) => m.status === 'completed' && i >= prev.completedCount
          ) || p.milestones.filter(m => m.status === 'completed').slice(-1)[0];

          dispatchAlert(
            `🎯 Milestone Reached: ${p.title}`,
            `Milestone "${newlyCompleted?.title || 'Phase Verified'}" was marked complete! Project is now at ${p.progressPercent}%.`,
            'milestone',
            p.projectId
          );
        }

        // Stage or substantial progress change
        if (p.stage !== prev.stage) {
          dispatchAlert(
            `🚀 Project Stage Updated: ${p.title}`,
            `Status transitioned to: ${p.stageLabel || p.stage} (${p.progressPercent}% overall completion).`,
            'status',
            p.projectId
          );
        }
      }

      // Update snapshot
      prevProjectsSnapshot.current[p.projectId] = {
        stage: p.stage,
        progress: p.progressPercent,
        completedCount
      };
    });
  }, [trackedProjects]);

  // Monitor negotiation responses
  useEffect(() => {
    if (!negotiations || negotiations.length === 0) return;

    negotiations.forEach(neg => {
      const prevStatus = prevNegotiationsSnapshot.current[neg.id];
      if (prevStatus && prevStatus !== neg.status) {
        if (neg.status === 'approved') {
          dispatchAlert(
            `🤝 Negotiation Approved: ${neg.itemTitle}`,
            `Your proposed price of GH₵ ${neg.offeredPrice.toLocaleString()} was accepted by DeRoyalTech leadership!`,
            'negotiation'
          );
        } else if (neg.status === 'countered') {
          dispatchAlert(
            `🤝 Counter-Offer Received: ${neg.itemTitle}`,
            `Admin offered a counter-price of GH₵ ${(neg.adminResponse?.counterPrice || 0).toLocaleString()}. Check details in your proposal.`,
            'negotiation'
          );
        }
      }
      prevNegotiationsSnapshot.current[neg.id] = neg.status;
    });
  }, [negotiations]);

  // Trigger test notification
  const handleTestNotification = async () => {
    if (permission !== 'granted') {
      await handleRequestPermission();
    }
    dispatchAlert(
      '🎯 Project Milestone Verified (Test Alert)',
      'Telemetry Node Deployment passed automated QA testing at 99.98% accuracy. All test milestones verified.',
      'test',
      trackedProjects[0]?.projectId
    );
  };

  const dismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="w-full">
      {/* Real-time Notification Status Ribbon in Client Hub */}
      <div className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            permission === 'granted'
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : permission === 'denied'
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
          }`}>
            {permission === 'granted' ? (
              <BellRing className="w-5 h-5 animate-pulse" />
            ) : permission === 'denied' ? (
              <BellOff className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Web Notifications API
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                permission === 'granted'
                  ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : permission === 'denied'
                  ? 'bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                  : 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              }`}>
                {permission === 'granted' ? 'Active & Synced' : permission === 'denied' ? 'Permission Blocked' : 'Action Required'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {permission === 'granted'
                ? 'Receiving real-time OS desktop & mobile alerts when project milestones or statuses update.'
                : permission === 'denied'
                ? 'Browser notifications are blocked in your site settings. In-app visual alerts remain active.'
                : 'Enable browser notifications to receive immediate milestone completion and delivery alerts.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {permission !== 'granted' && permission !== 'unsupported' && (
            <button
              type="button"
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isRequesting ? 'Requesting...' : 'Enable Web Notifications'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleTestNotification}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Trigger a test milestone notification"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Test Web Alert</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(prev => !prev)}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* In-App Floating Real-time Notification Banner / Toaster */}
      {activeToasts.length > 0 && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 max-w-sm w-full space-y-2 pointer-events-none">
          {activeToasts.map(toast => (
            <div
              key={toast.id}
              className="pointer-events-auto p-4 rounded-xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-blue-500/40 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    {toast.type === 'milestone' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : toast.type === 'negotiation' ? (
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    ) : (
                      <BellRing className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white leading-tight">
                        {toast.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">
                      {toast.body}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      {toast.timestamp} {toast.projectId ? `· Project: ${toast.projectId}` : ''}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
