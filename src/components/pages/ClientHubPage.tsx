import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Activity,
  Sparkles,
  ShieldCheck,
  Fingerprint,
  ChevronRight
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { ConsultationPage } from './ConsultationPage.tsx';
import { TrackProjectPage } from './TrackProjectPage.tsx';
import { ProjectWebNotificationManager } from '../tracker/ProjectWebNotificationManager.tsx';
import { ClientSecurityDashboard } from '../hub/ClientSecurityDashboard.tsx';

interface ClientHubPageProps {
  initialTab?: 'consultation' | 'tracker' | 'security';
}

export const ClientHubPage: React.FC<ClientHubPageProps> = ({ initialTab }) => {
  const { currentPage, trackerSearchId, clientUser } = useSite();
  const [activeTab, setActiveTab] = useState<'consultation' | 'tracker' | 'security'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#security') return 'security';
    if (initialTab) return initialTab;
    if (currentPage === 'tracker' || trackerSearchId) return 'tracker';
    return 'consultation';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#security') {
      setActiveTab('security');
      return;
    }
    if (currentPage === 'tracker') {
      setActiveTab((prev) => (prev === 'security' ? prev : 'tracker'));
    } else if (currentPage === 'consultation') {
      setActiveTab((prev) => (prev === 'security' ? prev : 'consultation'));
    }
  }, [currentPage]);

  const handleTabSwitch = (tab: 'consultation' | 'tracker' | 'security') => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const passkeyCount = clientUser?.webAuthnCredentials?.length || 0;

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Unified Client Services & Project Hub Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-14 pb-12 sm:pt-16 sm:pb-14 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Client Engagement & Operations Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Client Project Hub & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Architecture Consultation
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Schedule an executive architecture discovery session, track live sprint milestones and hardware telemetry, or configure WebAuthn biometric passkeys in your Security Dashboard.
          </p>

          {/* Unified Segmented Switcher (wraps cleanly on narrow screens to prevent horizontal overflow) */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleTabSwitch('consultation')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'consultation'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Consultation</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('tracker')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'tracker'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Track Live Project</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('security')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Security Dashboard</span>
                {clientUser && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      activeTab === 'security'
                        ? 'bg-white/20 text-white'
                        : passkeyCount > 0
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {passkeyCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Web Notifications & Security Quick-Access Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-3">
        <ProjectWebNotificationManager />

        {activeTab !== 'security' && (
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  passkeyCount > 0
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/30'
                }`}
              >
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">
                  {clientUser
                    ? passkeyCount > 0
                      ? `WebAuthn Biometric Security Active (${passkeyCount} Passkey${passkeyCount > 1 ? 's' : ''})`
                      : 'Security Dashboard: Register Biometrics for Passwordless Login'
                    : 'Security Dashboard: WebAuthn Biometric Passkeys'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {clientUser
                    ? 'Manage Touch ID, Face ID, Windows Hello, or hardware FIDO2 keys bound to your account.'
                    : 'Sign in inside the Security Dashboard to register biometric credentials for faster, stronger logins.'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleTabSwitch('security')}
              className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Open Security Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Render Active View without Page Reload */}
      <div className="w-full max-w-full overflow-x-hidden">
        {activeTab === 'consultation' ? (
          <ConsultationPage embedded={true} />
        ) : activeTab === 'tracker' ? (
          <TrackProjectPage embedded={true} />
        ) : (
          <ClientSecurityDashboard />
        )}
      </div>
    </div>
  );
};

